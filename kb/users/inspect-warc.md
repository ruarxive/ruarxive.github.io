---
title: «Вскрытие» WARC/WACZ — извлечение содержимого
sidebar_label: "Вскрытие WARC"
sidebar_position: 3
description: "Как заглянуть в WARC-файл и достать нужную страницу или ресурс: warcio, jq, zgrep, warctools, warchaeology и Python-скрипты для исследователей."
last_update:
  date: 2026-10-12
keywords: [warc, extract, warcio, warctools, page, content]
---

# «Вскрытие» WARC/WACZ — извлечение содержимого

Это практическая страница для исследователей: как достать из WARC-файла конкретную страницу, список URL или ресурсы. Ниже — команды и Python-скрипты для типовых задач.

> **Не нужно:** устанавливать pywb или поднимать сервер. Все приёмы работают локально на одном файле.

> Все примеры проверены в октябре 2026 года на warcio 1.8.1, warctools 5.0.1, cdxj-indexer 1.5.0 и warchaeology 5.0.0 (тестовый WARC-файл).

:::tip WACZ
WACZ — это ZIP-архив, WARC-файлы лежат внутри в каталоге `archive/`. Распакуйте их (`unzip archive.wacz 'archive/*'`) и работайте с ними как с обычными WARC.
:::

## Быстрый старт: что внутри моего WARC?

```bash
pip install warcio

# По JSON-строке на каждую запись: тип, URL, статус, Content-Type
warcio index -f warc-type,warc-target-uri,http:status,http:content-type archive.warc.gz | head -20
```

Пример вывода:

```
{"warc-type": "warcinfo"}
{"warc-type": "response", "warc-target-uri": "https://example.com/", "http:status": "200", "http:content-type": "text/html; charset=utf-8"}
{"warc-type": "response", "warc-target-uri": "https://example.com/about", "http:status": "200", "http:content-type": "text/html; charset=utf-8"}
{"warc-type": "response", "warc-target-uri": "https://example.com/logo.png", "http:status": "200", "http:content-type": "image/png"}
```

Посмотреть одну запись целиком (WARC-заголовки, HTTP-заголовки и тело) — по её смещению в файле:

```bash
# Смещения — в поле offset вывода warcio index
warcio index archive.warc.gz | head -5
warcio extract archive.warc.gz 676 | head -30
```

Заголовки записи выглядят так:

```
WARC/1.0
WARC-Date: 2026-06-01T12:00:05Z
WARC-Type: response
WARC-Record-ID: <urn:uuid:21b5d281-9971-4a55-99c8-50042af83f81>
WARC-Target-URI: https://example.com/about
WARC-Payload-Digest: sha1:O6PWCPWYRWRLFS3O6BAHQ3FGDLPKDOFV
WARC-Block-Digest: sha1:LMOWZ5YOOLW6OSCTJ24TVUIATOLD5ZIJ
Content-Type: application/http; msgtype=response
Content-Length: 184

HTTP/1.1 200 OK
Content-Type: text/html; charset=utf-8
...
```

## Получить список всех URL

### Способ 1: warcio + jq

```bash
warcio index -f warc-type,warc-target-uri archive.warc.gz \
  | jq -r 'select(."warc-type" == "response") | ."warc-target-uri"' \
  | sort -u > urls.txt
wc -l urls.txt
```

### Способ 2: zgrep

`.warc.gz` — это последовательность gzip-записей, и `zgrep` читает её как один поток. Строки заголовков заканчиваются на `\r\n`, поэтому `\r` нужно убрать:

```bash
zgrep -a '^WARC-Target-URI:' archive.warc.gz | tr -d '\r' | cut -d' ' -f2 | sort -u > urls.txt

# Сколько в архиве ответов
zgrep -a -c '^WARC-Type: response' archive.warc.gz
```

Способ быстрый, но грубый: в выборку попадут URL из записей всех типов (`request`, `response`, `metadata`).

### Способ 3: warcio (Python)

```python
from warcio.archiveiterator import ArchiveIterator

urls = set()
with open("archive.warc.gz", "rb") as stream:
    for record in ArchiveIterator(stream):
        if record.rec_type == "response":
            url = record.rec_headers.get_header("WARC-Target-URI")
            if url:
                urls.add(url)

with open("urls.txt", "w") as f:
    for url in sorted(urls):
        f.write(url + "\n")

print(f"Уникальных URL: {len(urls)}")
```

### Способ 4: warchaeology

[warchaeology](/kb/instruments/tools/warchaeology) (Национальная библиотека Норвегии) — один исполняемый файл `warc` на Go; готовые сборки лежат в [релизах на GitHub](https://github.com/NationalLibraryOfNorway/warchaeology/releases), через `pip` он не ставится.

```bash
# Смещение, ID, тип и URL каждой записи
warc ls -t response archive.warc.gz

# Проверка соответствия стандарту WARC
warc validate archive.warc.gz
```

## Найти и извлечь конкретную страницу

### Через индекс и смещение (быстро для повторных запросов)

```bash
# 1. Найти смещение записи с нужным URL
offset=$(warcio index -f offset,warc-target-uri archive.warc.gz \
  | jq -r 'select(."warc-target-uri" == "https://example.com/about") | .offset' | head -1)

# 2. Достать тело ответа
warcio extract --payload archive.warc.gz "$offset" > page.html

# или только заголовки записи
warcio extract --headers archive.warc.gz "$offset"
```

Индекс можно сохранить в файл один раз, и дальше искать смещения в нём, не проходя архив заново.

### Через warcfilter

`warcfilter` из [warctools](https://github.com/internetarchive/warctools) отбирает записи по регулярному выражению и пишет результат (несжатый WARC) в stdout:

```bash
pip install warctools

warcfilter -U 'example\.com/about' archive.warc.gz > response.warc
warcdump response.warc
```

Флаги: `-U` — по URL, `-T` — по типу записи, `-C` — по Content-Type WARC-записи, `-H` — по Content-Type HTTP-ответа, `-D` — по `WARC-Date`, `-i` — инвертировать условие. Вывод `warcdump` — блоки `archive record at …` со списком заголовков, а не «сырой» WARC.

### Через Python

```python
import shutil
from warcio.archiveiterator import ArchiveIterator

target_url = "https://example.com/about"
with open("archive.warc.gz", "rb") as stream, open("page.html", "wb") as out:
    for record in ArchiveIterator(stream):
        if record.rec_type != "response":
            continue
        if record.rec_headers.get_header("WARC-Target-URI") == target_url:
            shutil.copyfileobj(record.content_stream(), out)
            break
```

`content_stream()` возвращает тело уже без `Content-Encoding` и chunked-кодирования. Если нужно тело в том виде, в каком оно записано в WARC, используйте `record.raw_stream`.

## Все URL с домена

```python
from warcio.archiveiterator import ArchiveIterator
from urllib.parse import urlsplit

target_domain = "example.com"
matching = []
with open("archive.warc.gz", "rb") as stream:
    for record in ArchiveIterator(stream):
        if record.rec_type != "response":
            continue
        url = record.rec_headers.get_header("WARC-Target-URI", "")
        host = urlsplit(url).hostname or ""
        if host == target_domain or host.endswith("." + target_domain):
            matching.append(url)

print(f"Найдено {len(matching)} URL на домене {target_domain}")
with open("matching-urls.txt", "w") as f:
    f.write("\n".join(matching))
```

## Достать все изображения

```python
import mimetypes
import shutil
from pathlib import Path
from warcio.archiveiterator import ArchiveIterator

output_dir = Path("extracted-images")
output_dir.mkdir(exist_ok=True)

count = 0
with open("archive.warc.gz", "rb") as stream:
    for record in ArchiveIterator(stream):
        if record.rec_type != "response" or not record.http_headers:
            continue
        if record.http_headers.get_statuscode() != "200":
            continue
        ctype = record.http_headers.get_header("Content-Type", "").split(";")[0].strip()
        if not ctype.startswith("image/"):
            continue
        ext = mimetypes.guess_extension(ctype) or ".bin"
        with open(output_dir / f"image_{count:05d}{ext}", "wb") as out:
            shutil.copyfileobj(record.content_stream(), out)
        count += 1

print(f"Сохранено {count} изображений в {output_dir}")
```

## Только метаданные записей

```python
from warcio.archiveiterator import ArchiveIterator

with open("archive.warc.gz", "rb") as stream:
    for record in ArchiveIterator(stream):
        print({
            "type": record.rec_type,
            "url": record.rec_headers.get_header("WARC-Target-URI"),
            "date": record.rec_headers.get_header("WARC-Date"),
            "status": record.http_headers.get_statuscode() if record.http_headers else None,
        })
```

Если тела не читать, скрипт работает немного быстрее, но не радикально: `ArchiveIterator` всё равно распаковывает весь gzip-поток. Быстрее всего — один раз сохранить индекс (`warcio index` или `cdxj-indexer`) и дальше работать с ним.

## Подсчёт по типам контента

Через `jq`:

```bash
warcio index -f warc-type,http:content-type archive.warc.gz \
  | jq -r 'select(."warc-type" == "response") | (."http:content-type" // "unknown") | split(";")[0]' \
  | sort | uniq -c | sort -rn
```

Через Python — с объёмом:

```python
from collections import Counter
from warcio.archiveiterator import ArchiveIterator

counts = Counter()
sizes = Counter()

with open("archive.warc.gz", "rb") as stream:
    for record in ArchiveIterator(stream):
        if record.rec_type != "response" or not record.http_headers:
            continue
        ctype = record.http_headers.get_header("Content-Type", "unknown").split(";")[0].strip()
        counts[ctype] += 1
        # Content-Length WARC-записи: HTTP-заголовки + тело, то есть приблизительный объём
        sizes[ctype] += int(record.rec_headers.get_header("Content-Length", "0"))

for t, n in counts.most_common():
    print(f"{t:30} {n:8} записей {sizes[t] / 1024 / 1024:10.2f} МБ")
```

Пример вывода:

```
text/html                             3 записей       0.00 МБ
image/png                             1 записей       0.00 МБ
```

## Поиск по содержимому (ripgrep)

Сначала выгрузите HTML-ответы в отдельные файлы, а рядом сохраните таблицу «файл → URL»:

```python
import shutil
from pathlib import Path
from warcio.archiveiterator import ArchiveIterator

Path("html").mkdir(exist_ok=True)
i = 0
with open("archive.warc.gz", "rb") as stream, \
     open("html/index.tsv", "w", encoding="utf-8") as idx:
    for record in ArchiveIterator(stream):
        if record.rec_type != "response" or not record.http_headers:
            continue
        if not record.http_headers.get_header("Content-Type", "").startswith("text/html"):
            continue
        name = f"{i:06d}.html"
        with open(Path("html") / name, "wb") as out:
            shutil.copyfileobj(record.content_stream(), out)
        idx.write(f"{name}\t{record.rec_headers.get_header('WARC-Target-URI')}\n")
        i += 1
```

Затем ищите по тексту и сопоставляйте файлы с URL:

```bash
rg -l "выборы" html/

# Файлы с совпадениями → их исходные URL
rg -l "выборы" html/ | sed 's#.*/##' | grep -F -f - html/index.tsv
```

Готовой утилиты полнотекстового поиска прямо по WARC в pywb нет. Для больших коллекций используйте [SolrWayback](/kb/instruments/tools/solrwayback); WACZ с извлечённым текстом поддерживает полнотекстовый поиск в [ReplayWeb.page](/kb/instruments/replay/replayweb-page).

## Таблица всех записей в JSON

```python
import json
from warcio.archiveiterator import ArchiveIterator

records = []
with open("archive.warc.gz", "rb") as stream:
    for record in ArchiveIterator(stream):
        if record.rec_type != "response":
            continue
        records.append({
            "url": record.rec_headers.get_header("WARC-Target-URI"),
            "date": record.rec_headers.get_header("WARC-Date"),
            "status": record.http_headers.get_statuscode() if record.http_headers else None,
            "content_type": record.http_headers.get_header("Content-Type") if record.http_headers else None,
            "length": int(record.rec_headers.get_header("Content-Length", "0")),
        })

with open("index.json", "w") as f:
    json.dump(records, f, indent=2, ensure_ascii=False)

print(f"Записано {len(records)} записей в index.json")
```

## Извлечение записи по WARC-Record-ID

```python
import shutil
from warcio.archiveiterator import ArchiveIterator

target_id = "<urn:uuid:2457c5cc-10e0-4c0c-bb57-9f16c2b3ab48>"

with open("archive.warc.gz", "rb") as stream:
    for record in ArchiveIterator(stream):
        if record.rec_headers.get_header("WARC-Record-ID") == target_id:
            with open("single-record.bin", "wb") as f:
                shutil.copyfileobj(record.content_stream(), f)
            print(f"Запись {target_id} извлечена")
            break
```

## Индекс CDXJ

Для быстрых повторных поисков и для replay-систем постройте индекс CDXJ:

```bash
pip install cdxj-indexer
cdxj-indexer --sort archive.warc.gz > index.cdxj
grep 'example.com/about' index.cdxj
```

Формат строки — `SURT TIMESTAMP {json}`:

```
com,example)/about 20260601120005 {"url": "https://example.com/about", "mime": "text/html", "status": "200", "digest": "sha1:O6PWCPWYRWRLFS3O6BAHQ3FGDLPKDOFV", "length": "424", "offset": "676", "filename": "archive.warc.gz"}
```

Подробнее — [формат CDX/CDXJ](/kb/instruments/file-formats/cdx).

## Большая запись — потоковая выгрузка

```python
from warcio.archiveiterator import ArchiveIterator

with open("huge.warc.gz", "rb") as stream:
    for record in ArchiveIterator(stream):
        if record.rec_type != "response":
            continue
        url = record.rec_headers.get_header("WARC-Target-URI", "")
        if "specific-huge-page" not in url:
            continue
        size = int(record.rec_headers.get_header("Content-Length", "0"))
        print(f"{url} — {size / 1024 / 1024:.2f} МБ")
        body = record.content_stream()
        with open("output.bin", "wb") as out:
            while chunk := body.read(1024 * 1024):
                out.write(chunk)
        break
```

`content_stream()` — поток с методом `read()`, а не итератор: `for chunk in record.content_stream()` падает с `TypeError`. Сегментированные записи (`continuation`) warcio автоматически не склеивает; на практике они встречаются редко.

## Частые ошибки

| Проблема | Решение |
|:---|:---|
| `get_header()` вернул `None` | Не у всех записей есть `WARC-Target-URI` (например, у `warcinfo`); проверяйте `if url:` |
| `AttributeError: 'NoneType' ... get_header` | У записи нет HTTP-заголовков (`warcinfo`, `resource`); проверяйте `if record.http_headers` |
| Медленно на больших файлах | Постройте индекс один раз и ищите по нему; см. [большие WARC](/kb/users/large-warc) |
| `UnicodeDecodeError` | Тело страницы не обязательно в UTF-8; читайте как `bytes` и определяйте кодировку по заголовку или содержимому |
| Битый gzip | `gzip -t archive.warc.gz`, затем `warcio check archive.warc.gz` или `warcvalid archive.warc.gz` |
| Переполнение памяти | Не вызывайте `content_stream().read()` без аргумента для огромных записей — читайте блоками |
| Запись «обрезана» | Сверьте `Content-Length` с фактическим размером; `warc validate` из warchaeology покажет ошибки |

## Когда использовать

✅ Подходит:

- **Аудит коллекции** без поднятия сервера.
- **Извлечение отдельной страницы** для публикации или проверки.
- **Список всех URL** для анализа ссылочного графа.
- **Подготовка выборки** для исследований.
- **Восстановление утраченного контента** из архива.

❌ Не подходит:

- **Публичный доступ** для многих пользователей — нужен [pywb](/kb/instruments/replay/pywb).
- **Полнотекстовый поиск по большой коллекции** — лучше [SolrWayback](/kb/instruments/tools/solrwayback).
- **Мониторинг в реальном времени** — это пакетная обработка.

## Инструменты под рукой

| Инструмент | Установка | Когда |
|:---|:---|:---|
| [warcio](https://github.com/webrecorder/warcio) | `pip install warcio` | Python API; CLI `warcio index`, `extract`, `check`, `recompress` |
| [warctools](https://github.com/internetarchive/warctools) | `pip install warctools` | CLI `warcdump`, `warcfilter`, `warcvalid` |
| [cdxj-indexer](https://github.com/webrecorder/cdxj-indexer) | `pip install cdxj-indexer` | Индексы CDXJ и CDX11 |
| [warchaeology](/kb/instruments/tools/warchaeology) | бинарный файл из релизов GitHub | `warc ls`, `cat`, `validate`, `dedup` |
| [DuckDB-WARC](/kb/instruments/tools/duckdb-warc) | расширение DuckDB, см. страницу инструмента | SQL-запросы |
| [ReplayWeb.page](/kb/instruments/replay/replayweb-page) | браузер | Разовое открытие |

## Ресурсы

- [warcio на GitHub](https://github.com/webrecorder/warcio)
- [warctools на GitHub](https://github.com/internetarchive/warctools)
- [Спецификация WARC 1.1](https://iipc.github.io/warc-specifications/specifications/warc-format/warc-1.1/)
- [Warchaeology](/kb/instruments/tools/warchaeology)

## Связанные материалы

- [Формат WARC](/kb/instruments/file-formats/warc)
- [Как открыть WARC](/kb/users/open-warc) — для пользователя.
- [Работа с большими WARC-файлами](/kb/users/large-warc)
- [WARC-файл: от сырого архива до публикации](/kb/guides/warc-workflow)
- [ReplayWeb.page](/kb/instruments/replay/replayweb-page)
- [pywb — серверный плеер](/kb/instruments/replay/pywb)
