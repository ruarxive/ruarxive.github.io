---
title: Работа с большими WARC-файлами (10+ ГБ)
sidebar_label: "Большие WARC"
sidebar_position: 4
description: "Как работать с веб-архивами в десятки и сотни ГБ: потоковое чтение, индекс вместо полного прохода, разбиение по границам записей, SQL по индексу, публикация через pywb и WACZ."
last_update:
  date: 2026-10-12
keywords: [large, big, warc, streaming, sharding, memory, performance]
---

# Работа с большими WARC-файлами (10+ ГБ)

Архивы бывают очень большими. Например, WARC-файл сайта «Эха Москвы» в коллекции Ruarxive занимает 186 234 035 346 байт — около 173 ГиБ ([проект «Эхо Москвы»](/kb/projects/echomsk)). Для таких файлов подходы «прочитать всё в память» и «открыть в браузере» не работают.

## Какие проблемы возникают

| Проблема | Когда появляется |
|:---|:---|
| `MemoryError` | Программа пытается загрузить весь файл или большую запись в память |
| Очень долгий проход | Любой поиск без индекса требует распаковать весь gzip-поток |
| Долгое открытие в ReplayWeb.page | WARC без индекса читается в браузере целиком |
| Нельзя «просто разрезать» | `.warc.gz` — последовательность gzip-записей; байтовая нарезка ломает их |

Главное правило: **один раз пройдите файл и постройте индекс, дальше работайте с индексом**.

## Стратегия 1: потоковое чтение

### Итерация по записям через warcio

```python
from warcio.archiveiterator import ArchiveIterator

with open("huge-archive.warc.gz", "rb") as stream:
    for record in ArchiveIterator(stream):
        # Обрабатываем одну запись за раз
        process(record)
```

`ArchiveIterator` читает файл последовательно, по одной записи, и не загружает весь архив в память.

### Запись тела ответа на диск порциями

`record.content_stream()` — поток с методом `read()`, а не итератор: конструкция `for chunk in record.content_stream()` падает с `TypeError: 'LimitReader' object is not iterable`. Читайте блоками:

```python
from warcio.archiveiterator import ArchiveIterator

with open("huge-archive.warc.gz", "rb") as stream, \
     open("single-page.html", "wb") as out:
    for record in ArchiveIterator(stream):
        if record.rec_type != "response":
            continue
        url = record.rec_headers.get_header("WARC-Target-URI", "")
        if "specific-page" in url:
            body = record.content_stream()
            while chunk := body.read(1024 * 1024):
                out.write(chunk)
            break
```

То же самое делает `shutil.copyfileobj(record.content_stream(), out)`. В отличие от `record.content_stream().read()` без аргумента, тело не загружается в память целиком.

## Стратегия 2: индекс один раз — потом быстрые запросы

### CDXJ-индекс для replay-систем

[cdxj-indexer](https://github.com/webrecorder/cdxj-indexer) (Webrecorder, пакет на PyPI) строит индекс в формате CDXJ: `SURT TIMESTAMP {json}`, где в JSON есть URL, MIME-тип, статус, дайджест, длина и смещение записи в файле.

```bash
pip install cdxj-indexer

# Индекс CDXJ (для pywb и других replay-систем)
cdxj-indexer --sort huge.warc.gz > huge.cdxj

# Классический CDX11 (для OpenWayback и старых инструментов)
cdxj-indexer -11 --sort huge.warc.gz > huge.cdx
```

Поиск по индексу — обычными текстовыми утилитами, по ключу SURT (`com,example)/путь`):

```bash
grep '^com,example)/news/' huge.cdxj
```

### Индекс в JSON Lines для анализа

`warcio index` выводит по JSON-объекту на запись с выбранными полями. Такой файл удобно анализировать через `jq` или DuckDB:

```bash
warcio index \
  -f warc-type,warc-target-uri,warc-date,http:status,http:content-type,length,offset,warc-payload-digest \
  huge.warc.gz > huge.index.jsonl
```

Здесь `offset` и `length` — смещение и длина (сжатой) записи в файле. По смещению запись можно потом достать без полного прохода:

```bash
# Тело ответа из записи по смещению 123456789
warcio extract --payload huge.warc.gz 123456789 > page.html
```

Время построения индекса зависит от диска и процессора и для сотен гигабайт исчисляется часами; замерьте на своём железе на части файла, прежде чем планировать работу.

## Стратегия 3: SQL по индексу (DuckDB)

[DuckDB](https://duckdb.org/) читает JSON Lines напрямую, так что по индексу из предыдущего шага можно делать SQL-запросы. Файл индекса намного меньше самого архива.

```python
import duckdb

print(duckdb.sql("""
    SELECT "warc-target-uri" AS url,
           "http:content-type" AS content_type,
           CAST(length AS BIGINT) AS record_length,
           "warc-date" AS date
    FROM read_json_auto('huge.index.jsonl')
    WHERE "warc-type" = 'response'
      AND "http:status" = '200'
      AND "http:content-type" LIKE 'text/html%'
    ORDER BY record_length DESC
    LIMIT 10
"""))
```

Для чтения самих WARC из DuckDB есть отдельные расширения — community-расширение `warc` (функция `parse_warc()` для отдельных записей) и `harvard-lil/duckdb-warc`, которое собирают из исходников; подробности и ограничения — на странице [DuckDB-WARC](/kb/instruments/tools/duckdb-warc).

> Примеры этого раздела проверены на warcio 1.8.1, cdxj-indexer 1.5.0 и DuckDB 1.5.6 (октябрь 2026).

## Стратегия 4: разбиение на части

:::danger Не режьте .warc.gz и .wacz по байтам
`split -b 1G huge.warc.gz part-` даёт куски, которые ни один инструмент не прочитает: граница проходит посреди gzip-записи. Все части, кроме первой, начинаются с «мусора». То же с WACZ — это ZIP-архив, и его половина не является валидным ZIP.
:::

### По границам записей

Скрипт ниже копирует записи в новые файлы и начинает следующий файл, когда текущий превысил заданный размер. Каждая часть — полноценный WARC.

```python
import sys
from warcio.archiveiterator import ArchiveIterator
from warcio.warcwriter import WARCWriter

src, limit = sys.argv[1], int(float(sys.argv[2]) * 1024**3)  # размер части в ГБ

part, out, writer = 0, None, None
with open(src, "rb") as stream:
    for record in ArchiveIterator(stream):
        if out is None or out.tell() >= limit:
            if out:
                out.close()
            part += 1
            out = open(f"part-{part:04d}.warc.gz", "wb")
            writer = WARCWriter(out, gzip=True)
        writer.write_record(record)
if out:
    out.close()
print(f"частей: {part}")
```

```bash
python split_warc.py huge.warc.gz 5     # части примерно по 5 ГБ
warcio check part-0001.warc.gz          # проверить результат
```

Учтите: пара `request`/`response` одной страницы может оказаться в разных частях. Для replay это не страшно, если все части проиндексированы вместе.

Обратная операция для `.warc.gz` простая: файлы можно склеить командой `cat a.warc.gz b.warc.gz > all.warc.gz` — каждая запись сжата отдельно, поэтому результат остаётся валидным WARC.

### По содержимому (логическое разбиение)

`warcfilter` из [warctools](https://github.com/internetarchive/warctools) отбирает записи по регулярному выражению и пишет результат в stdout (несжатым WARC):

```bash
pip install warctools

# Только записи с URL раздела /news/
warcfilter -U '^https://example\.com/news/' huge-archive.warc.gz > news-only.warc

# Только HTML-ответы
warcfilter -H 'text/html' huge-archive.warc.gz > html-only.warc
```

### Части для ReplayWeb.page

Если архив нужно смотреть в браузере, упакуйте каждую часть в отдельный WACZ:

```bash
pip install wacz
wacz create -o part-0001.wacz --detect-pages part-0001.warc.gz
```

## Стратегия 5: WACZ + ReplayWeb.page

ReplayWeb.page читает WARC целиком, чтобы построить индекс, а WACZ — нет: индекс уже внутри, и плеер подгружает только нужные ресурсы ([документация](https://replayweb.page/docs/user-guide/)). Для большого архива:

1. Упакуйте WARC в WACZ (`wacz create -o archive.wacz archive.warc.gz`) или соберите сразу WACZ через Browsertrix.
2. Для локального просмотра держите файл на SSD и используйте [ReplayWeb.page Desktop](https://github.com/webrecorder/replayweb.page/releases).
3. Для публикации разместите WACZ на сервере с поддержкой HTTP Range-запросов и CORS.

## Стратегия 6: pywb для публичного доступа

[pywb](/kb/instruments/replay/pywb) работает с WARC на сервере и не требует загрузки архива в браузер:

```bash
pip install pywb
wb-manager init echo-msk
wb-manager add echo-msk /data/echo.msk.ru.warc.gz   # копирует файл и строит индекс
wayback -p 8080
```

`wb-manager add` копирует файл в каталог коллекции; если архив уже лежит на нужном диске, можно описать коллекцию в `config.yaml` через `index_paths` и `archive_paths` и построить индекс через `cdxj-indexer` (см. страницу pywb). Для очень больших индексов документация pywb рекомендует внешний индекс OutbackCDX.

## Стратегия 7: выборочное скачивание

Часто нужен не весь архив, а его часть.

### Из Wayback Machine

CDX API Wayback Machine отдаёт список снимков, а модификатор `id_` в URL снимка — исходный ответ без переписывания ссылок (не WARC):

```bash
curl -s 'https://web.archive.org/cdx/search/cdx?url=example.com/page&output=json&limit=20' \
  | jq -r '.[1:][] | "\(.[1]) \(.[2])"' \
  | while read -r ts url; do
      curl -s -o "page-$ts.html" "https://web.archive.org/web/${ts}id_/${url}"
      sleep 2
    done
```

Подробнее об API — [Wayback Machine API](/kb/instruments/tools/wayback-api).

### Из локального архива — под-WARC

Записи из `ArchiveIterator` можно сразу записать в новый WARC:

```python
from warcio.archiveiterator import ArchiveIterator
from warcio.warcwriter import WARCWriter

prefix = "https://example.com/specific-page"
with open("huge.warc.gz", "rb") as stream, open("sub.warc.gz", "wb") as out:
    writer = WARCWriter(out, gzip=True)
    for record in ArchiveIterator(stream):
        url = record.rec_headers.get_header("WARC-Target-URI", "")
        if url.startswith(prefix):
            writer.write_record(record)
```

Если смещения нужных записей уже известны из индекса, используйте `warcio extract` — так не придётся проходить файл целиком.

### Из архива «Эха Москвы»

Для архива «Эха» опубликован CDX-индекс `echo.msk.ru.cdx.zip` (около 2,7 МБ). По нему можно проверить, есть ли нужные страницы, ещё до скачивания 173-гигабайтного файла. Ссылки — на странице [проекта «Эхо Москвы»](/kb/projects/echomsk).

## Стратегия 8: распределённая обработка

Для коллекций в терабайты используют распределённые инструменты:

| Инструмент | Когда |
|:---|:---|
| [ArchiveSpark](/kb/instruments/tools/archivespark) | Распределённый анализ WARC на Spark |
| [Archives Unleashed Toolkit](https://github.com/archivesunleashed/aut) | Анализ веб-архивов на Spark: извлечение текста, ссылок, статистика |
| [Brozzler](/kb/instruments/tools/brozzler) | Распределённый **сбор** (не анализ) |

## Железо

Конкретные требования зависят от задачи. Общие ориентиры:

- Для последовательного прохода главное — скорость диска; SSD заметно быстрее HDD, особенно при произвольном доступе по смещениям.
- Память нужна под индекс и обрабатываемую запись, а не под весь архив: при потоковой обработке хватает обычного рабочего компьютера.
- Свободное место планируйте с запасом: индекс, распакованные части и копии быстро занимают десятки гигабайт.

## Чего избегать

❌ `open('huge.warc.gz', 'rb').read()` — загрузит весь файл в память.
❌ `record.content_stream().read()` для записей в гигабайты — читайте блоками.
❌ `split -b ...` для `.warc.gz` и `.wacz` — части нельзя будет прочитать.
❌ `gunzip huge.warc.gz` «для удобства» — распакованный файл в несколько раз больше, а смещения из индексов перестают совпадать.
❌ Повторный полный проход по архиву для каждого вопроса — постройте индекс один раз.

## Когда использовать

✅ Подходит:

- **Архивы больше 10 ГБ** — без этих приёмов работа становится очень медленной.
- **Подготовка публичных коллекций** для исследователей.
- **Регулярно используемые наборы данных** — стоит один раз вложиться в индексы.

❌ Не подходит:

- **Архивы до 1 ГБ** — проще открыть в [ReplayWeb.page](https://replayweb.page/).
- **Разовое открытие файла** — см. [Как открыть WARC](/kb/users/open-warc).

## Ресурсы

- [warcio](https://github.com/webrecorder/warcio)
- [cdxj-indexer](https://github.com/webrecorder/cdxj-indexer)
- [warctools](https://github.com/internetarchive/warctools)
- [DuckDB-WARC](/kb/instruments/tools/duckdb-warc)
- [pywb — настройка коллекций](/kb/instruments/replay/pywb)
- [ReplayWeb.page — большие WACZ](/kb/instruments/replay/replayweb-page)

## Связанные материалы

- [«Вскрытие» WARC — листинг и извлечение](/kb/users/inspect-warc)
- [Формат WARC](/kb/instruments/file-formats/warc)
- [WARC-файл: от сырого архива до публикации](/kb/guides/warc-workflow)
- [Ландшафт 2026](/kb/instruments/landscape-2026)
