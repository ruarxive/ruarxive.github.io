---
title: Common Crawl — открытые петабайты веб-краулов
sidebar_label: Common Crawl
description: "Common Crawl — некоммерческий фонд, собирающий петабайтные веб-краулы. Доступ бесплатный, формат WARC, программный доступ через cdx_toolkit и DuckDB. Использование для исследований и обучения ML."
last_updated: 2026-11-09
keywords: [common-crawl, open-data, cdx, warc, ml, language-models]
---

# Common Crawl — открытые петабайты веб-краулов

[Common Crawl](https://commoncrawl.org/) — некоммерческий фонд с 2007 года, предоставляющий **открытые петабайтные веб-краулы** для исследований. Данные публикуются на Amazon S3 и HuggingFace в формате WARC/WAT/WET; с 2025 года — также через [duckdb-web-archive-cdx](https://github.com/commoncrawl/duckdb-web-archive-cdx) в виде SQL.

> **Главное отличие от Internet Archive:** Common Crawl — это **сырой поток**, а не поиск. Нет Wayback UI; чтобы найти конкретную страницу, нужны CDX-индексы и инструменты. Это как Apache для веба.

## Что внутри

| Тип | Что | Размер краула |
|:---|:---|---:|
| **WARC** | Сырые HTTP-ответы | ~80 ТБ на краул |
| **WAT** | Извлечённые метаданные (title, body text, links) | ~20 ТБ на краул |
| **WET** | Извлечённый текст (без разметки) | ~5 ТБ на краул |
| **CDX** | Индекс URL | ~5 ТБ на краул |

Краул выходит **ежемесячно**. Каждый краул — это 3–5 млрд веб-страниц.

### Что НЕ включается

- **Robots.txt** — учитывается, кроме случаев explicit allow.
- **Хостинг-сервисы для взрослого контента** — фильтруются.
- **Аутентифицированный контент** — не доступен.
- **GDPR / «нежелательные» сайты** — фильтруются по спискам.

## Доступ

### Amazon S3 — `commoncrawl` bucket

```
s3://commoncrawl/
├── crawl-data/
│   ├── CC-MAIN-2024-04/      # краул за январь 2024
│   │   ├── segments/         # партиции WARC
│   │   ├── warc/             # WARC-файлы
│   │   ├── wat/              # метаданные
│   │   ├── wet/              # текст
│   │   └── cdx-*.gz          # индексы
│   ├── CC-MAIN-2026-04/      # последний краул
│   └── ...
```

Доступ публичный, бесплатный.

```bash
# Установить aws cli
pip install awscli
aws configure  # без ключей, bucket публичный

# Скачать индекс (CDX)
aws s3 cp s3://commoncrawl/cc-index/collections/CC-MAIN-2026-04/indexes/cdx-000.gz . --no-sign-request
```

### Hugging Face

С 2024 года Common Crawl также публикуется на [HuggingFace Datasets](https://huggingface.co/datasets?search=common%20crawl).

## Программный доступ

### cdx_toolkit (Python)

[cdx_toolkit](https://github.com/commoncrawl/cdx_toolkit) — Python-клиент к CDX Common Crawl.

```bash
pip install cdx_toolkit
```

```python
import cdx_toolkit

cdx = cdx_toolkit.CDXFetcher(source='cc')

# Поиск URL
records = list(cdx.fetch('commoncrawl.org/*', from_='20250101', to='20251231'))
for r in records:
    print(r['url'], r['timestamp'], r['status'])
```

### DuckDB (через duckdb-web-archive-cdx)

Современный подход — SQL к Common Crawl CDX напрямую.

```bash
pip install duckdb duckdb-web-archive-cdx
```

```python
import duckdb

con = duckdb.connect()
con.sql("INSTALL duckdb_web_archive_cdx FROM community; LOAD duckdb_web_archive_cdx;")

# Запрос
result = con.sql("""
    SELECT url, fetch_time, content_mime_type, warc_filename
    FROM cdx_cc(
        url='example.com/*',
        crawl='CC-MAIN-2026-04'
    )
    WHERE content_mime_type = 'text/html'
      AND fetch_status = 200
    LIMIT 100
""").df()

print(result.head())
```

### Spark + ArchiveSpark

Для petabyte-анализа — Spark:

```scala
import org.archive.archivespark._
val records = ArchiveSpark.load("s3a://commoncrawl/")
  .keepValidPages()
  .filter(r => r.surtUrl.contains("example.com"))
  .collect()

// далее обработка в Spark
```

### AWS Athena (SQL поверх S3)

Через [AWS Athena](https://aws.amazon.com/athena/):

```sql
SELECT url, warc_filename, warc_record_offset
FROM ccindex
WHERE crawl = 'CC-MAIN-2026-04'
  AND url_host_tld = 'ru'
  AND fetch_status = 200
LIMIT 100;
```

Athena использует [cc-index-table](https://github.com/commoncrawl/cc-index-table) — таблицы с партиционированными данными.

## Что с этим делают исследователи

| Цель | Как |
|:---|:---|
| **Обучение LLM** | WET (текст) → очистка → токенизация → модель |
| **Анализ веба** | CDX → SQL/DuckDB → статистика |
| **Поиск конкретных страниц** | CDX → fetch WARC → обработка |
| **Web graph** | WAT (links) → построение графа |
| **Multilingual research** | URL → язык → статистика |
| **Spam detection** | WARC → ML-модель |

### Russian Web от Common Crawl

В каждом крауле 2–4 % страниц — на русском. Для **исследований русского веба** это уникальный источник, потому что:

- Бесплатный (не нужен Academic API как у Twitter).
- Открытый (можно опубликовать derived датасет).
- Регулярный (ежемесячные краулы).
- Полный (без курирования «значимости»).

Найти русскоязычные страницы:

```sql
SELECT COUNT(*) FROM cdx_cc('*ru') WHERE content_mime_type = 'text/html';
```

## Установка cdx_toolkit

```bash
pip install cdx_toolkit
```

## Примеры сценариев

### Сценарий 1. Собрать все русскоязычные новостные сайты за месяц

```python
import cdx_toolkit

cdx = cdx_toolkit.CDXFetcher(source='cc')

urls = []
records = cdx.fetch(
    'ru/*',
    matchType='domain',
    filter=['status:200', 'mimetype:text/html'],
    from_='20251101',
    to='20251130',
    limit=10000,
)
for r in records:
    if r['url'].endswith(('.ru', '.рф')):
        urls.append(r['url'])

print(f"Найдено {len(urls)} страниц за ноябрь 2026")
```

### Сценарий 2. Найти страницы про конкретную тему (через CDXJ-index)

```sql
-- DuckDB
SELECT url, fetch_time
FROM read_cdxj('s3://commoncrawl/cc-index/collections/CC-MAIN-2026-04/indexes/cdx-00000.gz')
WHERE url LIKE '%example.com%'
  AND fetch_status = 200
  AND content_mime_type = 'text/html'
LIMIT 100;
```

### Сценарий 3. Анализ link graph

```bash
# Скачать WAT-файл
aws s3 cp s3://commoncrawl/crawl-data/CC-MAIN-2026-04/segments/.../warc/... . --no-sign-request

# Извлечь ссылки
warc-wat2links file.wat.gz > links.csv
```

### Сценарий 4. Обучающая выборка для LLM

```python
# Скачать WET-файл (только текст)
import boto3
s3 = boto3.client('s3', config=Config(signature_version=UNSIGNED))
s3.download_file('commoncrawl', 'crawl-data/CC-MAIN-2026-04/segments/.../wet/...', 'cc-ru.wet.gz')

# Извлечь текст
gunzip -c cc-ru.wet.gz | \
  python -c "import sys, json; [print(json.loads(l)['plain_text']) for l in sys.stdin if l.strip()]" > cc-ru.txt
```

### Сценарий 5. Сравнение краулов

```sql
-- Найти страницы, которые появились в 2026, но не в 2024
WITH cc_2024 AS (
    SELECT DISTINCT url_key FROM cdx_cc(crawl='CC-MAIN-2024-04')
), cc_2026 AS (
    SELECT DISTINCT url_key FROM cdx_cc(crawl='CC-MAIN-2026-04')
)
SELECT cc_2026.url_key
FROM cc_2026 LEFT JOIN cc_2024 ON cc_2026.url_key = cc_2024.url_key
WHERE cc_2024.url_key IS NULL
LIMIT 100;
```

## Ограничения

- **WARC, а не WACZ** — нет CDXJ-индекса из коробки; нужно строить самим.
- **Только content** — нет HTML-индексов для полнотекстового поиска.
- **Спам** — фильтрация базовая, мусорные страницы попадаются.
- **Robots.txt учитывается** — вы можете не получить определённые страницы.
- **GDPR удаления** — формальный процесс, может занять время.
- **Нет UI** — только программный доступ.

## Сравнение с Internet Archive

| Аспект | Common Crawl | Internet Archive |
|:---|:---|:---|
| Объём | 3–5 млрд страниц/мес | 800+ млрд страниц всего |
| Доступ | Бесплатный bulk | Бесплатный через Wayback |
| Формат | WARC/WAT/WET | WACZ + WARC |
| Индексация | CDX (только URL/статус) | Полнотекстовая + CDX |
| Воспроизведение | ❌ нет UI | ✅ через Wayback |
| Цель | Исследования | Сохранение |
| Зеркалирование | ❌ | ❌ |
| Поиск | через API/CDX | через Wayback UI |

## Когда использовать

✅ Подходит:

- **ML-исследования** — обучение моделей на больших данных.
- **Web science** — изучение структуры интернета.
- **Контент-анализ** — большие корпуса текста.
- **Лингвистические исследования** — параллельные корпуса.
- **Webometrics** — статистика по доменам.

❌ Не подходит:

- **Найти конкретную страницу** — для этого Internet Archive Wayback.
- **Воспроизвести страницу** — Common Crawl не сохраняет.
- **Юридические доказательства** — нужен Perma.cc или IA.
- **Гарантированное сохранение страницы** — краулы могут меняться.

## Ресурсы

- [Common Crawl Foundation](https://commoncrawl.org/)
- [Common Crawl GitHub](https://github.com/commoncrawl)
- [cdx_toolkit](https://github.com/commoncrawl/cdx_toolkit)
- [duckdb-web-archive-cdx](https://github.com/commoncrawl/duckdb-web-archive-cdx)
- [cc-mr-job](https://github.com/commoncrawl/cc-mr-job) — MapReduce по архивам
- [Athena CC-Index Table](https://github.com/commoncrawl/cc-index-table)
- [Common Crawl блог](https://commoncrawl.org/blog/)

## Связанные материалы

- [DuckDB-WARC](/kb/instruments/tools/duckdb-warc) — SQL к WARC + CC CDX.
- [Wayback Machine API](/kb/instruments/tools/wayback-api) — для IA.
- [Internet Archive](/kb/similar/internet-archive) — главный альтернативный архив.
- [WARC-файл: формат](/kb/instruments/file-formats/warc)
- [Ландшафт 2026](/kb/instruments/landscape-2026)
