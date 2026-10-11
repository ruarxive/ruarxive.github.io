---
title: Работа с большими WARC-файлами (10+ ГБ)
sidebar_label: "Большие WARC"
sidebar_position: 4
description: "Стратегии работы с архивами в десятки и сотни ГБ. Стриминг, шардинг, DuckDB, индексы. Как открыть 173-ГБ архив Эха Москвы."
last_updated: 2026-11-09
keywords: [large, big, warc, streaming, sharding, memory, performance]
---

# Работа с большими WARC-файлами (10+ ГБ)

Большая часть архивов Ruarxive и Internet Archive имеет размер от нескольких ГБ до сотен ГБ. Например, архив «Эха Москвы» — ~173 ГБ. Для работы с такими файлами нужны специальные подходы — обычные инструменты «прочитать всё в RAM» не работают.

## Зачем нужны специальные подходы

| Проблема | Когда появляется |
|:---|:---|
| `MemoryError` | Python пытается загрузить весь WARC в RAM |
| «Бесконечное» чтение | Python не может быстро проиграть 173 ГБ gzip на медленном диске |
| «Не могу grep'нуть» | ripgrep/warcdump работают, но медленно |
| «CDX не строится» | Память кончается на этапе индексирования |
| Replay «висит» | ReplayWeb.page не справляется с одним файлом > 50 ГБ |

## Стратегия 1: Никогда не читать весь файл

### Стриминг через warcio

```python
from warcio.archiveiterator import ArchiveIterator

with open("huge-archive.warc.gz", "rb") as stream:
    for record in ArchiveIterator(stream):
        # Обработка одной записи, без загрузки всего файла
        process(record)
```

`ArchiveIterator` — генератор. Python читает архив порциями по мере итерации. **Не нужно загружать весь файл в RAM.**

### Запись в файл поточно

```python
from warcio.archiveiterator import ArchiveIterator

with open("huge-archive.warc.gz", "rb") as stream, \
     open("single-page.html", "wb") as out:
    for record in ArchiveIterator(stream):
        if record.rec_type != "response":
            continue
        url = record.rec_headers.get_header("WARC-Target-URI", "")
        if "specific-page" in url:
            for chunk in record.content_stream():
                out.write(chunk)
            break
```

Вместо `record.content_stream().read()` (которая загрузит страницу в RAM), побайтовый write стримит запись на диск.

## Стратегия 2: Шардинг (разбиение на части)

### Разбить WARC на меньшие файлы

```bash
# Split WARC.gz на куски по 1 ГБ
split -b 1G huge-archive.warc.gz part-

# Или по числу записей
# (специализированные утилиты — see ниже)

# Получите:
#   part-aa, part-ab, part-ac, ...
```

Каждый кусок можно обрабатывать отдельно.

### Разбить по содержимому (логический шардинг)

```bash
# Отфильтровать WARC по URL-паттерну
warcfilter --url-prefix='https://example.com/news/' \
  huge-archive.warc.gz -o news-only.warc.gz

warcfilter --url-prefix='https://example.com/blog/' \
  huge-archive.warc.gz -o blog-only.warc.gz
```

Это называется **partition by subject**. Помогает при анализе отдельных тем.

### Разбить WACZ (для ReplayWeb.page)

ReplayWeb.page стримит WACZ; но всё равно индекс CDXJ загружается в память. Для файлов > 50 ГБ:

```bash
# Перепаковать с ограничением
cdxj-indexer huge.wacz > huge.cdxj
# Используем --split-size при упаковке
wacz create --split-size 5G \
  --filename huge-split.wacz \
  huge.warc.gz huge.cdxj
```

## Стратегия 3: DuckDB-WARC (SQL для больших файлов)

[DuckDB-WARC](/kb/instruments/tools/duckdb-warc) — лучший инструмент для SQL-запросов по большим WARC благодаря columnar streaming.

```python
import duckdb

con = duckdb.connect()
con.sql("INSTALL duckdb_warc FROM community; LOAD duckdb_warc;")

# Запрос к 173 ГБ архиву — DuckDB не загружает в RAM, стримит
result = con.sql("""
    SELECT
        url,
        content_type,
        length,
        warc_date
    FROM read_warc('echo-msk.warc.gz')
    WHERE response_code = 200
      AND content_type LIKE 'text/html%'
    ORDER BY length DESC
    LIMIT 10
""").df()
```

DuckDB справляется с файлами 100+ ГБ благодаря:

- **Columnar execution** — обрабатывает по колонкам, не по строкам.
- **Streaming + spilling** — если запрос не помещается в RAM, DuckDB сбрасывает на диск.
- **Parquet sidecar** — сохранение метаданных в Parquet ускоряет последующие запросы.

## Стратегия 4: Построить CDXJ-индекс один раз

Для файла размером 173 ГБ индексирование через `warc-indexer-cdxj` занимает 5–20 минут. **После этого все запросы по URL идут мгновенно.**

```bash
# Шаг 1: однократное индексирование
warc-indexer-cdxj huge.warc.gz > huge.cdxj

# Шаг 2: мгновенные поиски
grep "specific-page" huge.cdxj
grep "WARC-Target-URI: https://example.com/news/" huge.cdxj
```

Файл CDXJ для 173 ГБ обычно ~100–500 МБ; легко помещается в RAM.

## Стратегия 5: WACZ на SSD + ReplayWeb.page

Для разового просмотра большого WACZ (например, 173 ГБ Эхо Москвы):

1. Скопируйте WACZ на NVMe SSD.
2. Убедитесь, что CDXJ есть внутри WACZ (Browsertrix добавляет автоматически).
3. Откройте в [ReplayWeb.page](https://replayweb.page/).
4. Первый запуск — индексирование (5–15 мин), потом мгновенный доступ.

На HDD ReplayWeb.page будет работать, но **очень медленно** при случайном доступе.

## Стратегия 6: pywb для публичного доступа

[pywb](/kb/instruments/replay/pywb) спроектирован для больших коллекций:

```yaml
# config.yaml
collections:
  echo-msk:
    archive_paths: /data/echo-msk/archive/
    index_paths: /data/echo-msk/indexes/
    recurse: true
```

pywb строит CDXJ при первом обращении, кеширует в Redis.

## Стратегия 7: Выборочное скачивание (Sub-WARC)

Часто нужно не весь архив, а конкретная часть. Не скачивайте всё:

### Из Wayback Machine

```bash
# Скачать только снимки одной страницы
curl 'https://web.archive.org/cdx/search/cdx?url=example.com/page&output=json&limit=100' \
  | python3 -c "
import json, sys
records = json.load(sys.stdin)
for r in records[1:]:
    timestamp, url = r[1], r[2]
    print(f'https://web.archive.org/web/{timestamp}id_/{url}')
" \
  | xargs -I {} curl -s -o '{}.warc.gz' '{}'
```

### Из локального архива

```python
from warcio.archiveiterator import ArchiveIterator

target_url = "https://example.com/specific-page"
with open("huge.warc.gz", "rb") as stream, \
     open("sub-warc.warc.gz", "wb") as out:
    # Использовать warcio.WARCWriter для записи
    from warcio.warcwriter import WARCWriter
    writer = WARCWriter(out)
    for record in ArchiveIterator(stream):
        url = record.rec_headers.get_header("WARC-Target-URI", "")
        if target_url in url:
            # Записать эту запись в новый WARC
            # (нужно сначала прочитать record, потом записать)
            pass
```

## Стратегия 8: Распараллеливание на нескольких машинах

Для 1 ТБ+ коллекций — используйте распределённые решения:

| Инструмент | Когда |
|:---|:---|
| [Brozzler](/kb/instruments/tools/brozzler) | Распределённый сбор (для записи) |
| Spark + ArchiveSpark | Распределённый анализ |
| [Common Crawl](https://commoncrawl.org/) | Уже распределено по WARC |

Для 100-ГБ коллекции Ruarxive пока хватает одно-машинного решения с SSD.

## Бенчмарки производительности (2026)

Типичная конфигурация для Ruarxive: 32 ГБ RAM, NVMe SSD.

| Операция | Размер WARC | Время | Замечания |
|:---|---:|:---|:---|
| `warcdump` (листинг) | 173 ГБ | ~30 мин | read-only |
| `warc-indexer-cdxj` | 173 ГБ | ~15 мин | однократно |
| DuckDB-WARC `SELECT url` | 173 ГБ | ~2 мин | стриминг |
| DuckDB-WARC `GROUP BY domain` | 173 ГБ | ~10 мин | heavier |
| ReplayWeb.page первый запуск | 173 ГБ | ~10 мин | индексирование |
| ReplayWeb.page с CDXJ | 173 ГБ | ~2 мин | кешировано |
| pywb первая страница | 173 ГБ | ~5 с | с Redis |

## Железо и инфраструктура

| Размер коллекции | Рекомендуемое железо |
|:---|:---|
| до 10 ГБ | 8 ГБ RAM, любой диск |
| 10–100 ГБ | 16–32 ГБ RAM, NVMe SSD |
| 100 ГБ – 1 ТБ | 64 ГБ RAM, NVMe SSD RAID, возможно Redis |
| 1–10 ТБ | распределённое хранилище + CDN |

Ruarxive в текущей инфраструктуре обслуживает ~0.5–1 ТБ архивов на одном сервере с Redis + NVMe.

## Anti-patterns

❌ `python -c "open('huge.warc.gz', 'rb').read()"` — загрузит весь файл в RAM.
❌ `pandas.read_csv('huge.csv')` для CSV-индекса того же размера — OutOfMemory.
❌ `cat huge.warc.gz | grep url` — I/O bottleneck на огромных файлах.
❌ Хранить WARC-индексы в tar/zip — замедляет доступ.
❌ Использовать HDD для ReplayWeb.page с WACZ > 10 ГБ.

## Когда использовать

✅ Подходит:

- **Архивы > 10 ГБ** — без специальных подходов не обойтись.
- **Публичные коллекции** для исследователей.
- **Регулярно используемые наборы данных** — стоит вложиться в инфраструктуру.
- **Multi-user доступ** — pywb с Redis обязателен.

❌ Не подходит:

- **Архивы < 1 ГБ** — overhead не оправдан.
- **Разовое открытие файла** — проще через ReplayWeb.page.
- **Если у вас только HDD** — перенесите на SSD или используйте S3.

## Ресурсы

- [warcio documentation](https://github.com/webrecorder/warcio)
- [DuckDB-WARC](/kb/instruments/tools/duckdb-warc)
- [pywb — настройка для больших коллекций](/kb/instruments/replay/pywb)
- [ReplayWeb.page — большие WACZ](/kb/instruments/replay/replayweb-page)
- [WARC-Safe — сканирование](/kb/instruments/tools/warc-safe)

## Связанные материалы

- [Вскрытие WARC — листинг и извлечение](/kb/users/inspect-warc)
- [WARC-файл: формат](/kb/instruments/file-formats/warc)
- [WARC-файл: от сырого архива до публикации](/kb/guides/warc-workflow)
- [DuckDB-WARC — SQL-запросы](/kb/instruments/tools/duckdb-warc)
- [Ландшафт 2026](/kb/instruments/landscape-2026)
