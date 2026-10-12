---
title: Common Crawl — открытые веб-краулы
sidebar_label: Common Crawl
description: "Common Crawl — некоммерческая организация, ежемесячно публикующая открытые веб-краулы в форматах WARC, WAT и WET. Как устроены данные, как найти страницы через CDX-индекс, cdx_toolkit и DuckDB."
last_update:
  date: 2026-10-12
keywords: [common-crawl, open-data, cdx, warc, wet, wat, cdx_toolkit, duckdb]
---

# Common Crawl — открытые веб-краулы

[Common Crawl](https://commoncrawl.org/) — некоммерческая организация (основана в 2007 году), которая регулярно обходит веб и бесплатно публикует результаты: WARC-файлы с ответами серверов, а также производные форматы WAT (метаданные) и WET (извлечённый текст). Данные хранятся в Amazon S3 (бакет `s3://commoncrawl/`) и доступны по HTTPS через `data.commoncrawl.org`; отдельные краулы зеркалируются в хранилище Hugging Face.

> **Главное отличие от Internet Archive:** у Common Crawl нет интерфейса для просмотра страниц. Это набор данных: чтобы найти конкретную страницу, нужно обратиться к индексу и затем извлечь запись из WARC-файла.

## Что внутри одного краула

Пример — краул за сентябрь 2026 года (`CC-MAIN-2026-39`, около 2,17 млрд страниц, по данным [страницы краула](https://data.commoncrawl.org/crawl-data/CC-MAIN-2026-39/index.html)):

| Тип | Что содержит | Объём (сжато) |
|:---|:---|---:|
| **WARC** | Запросы и ответы серверов | ~82,8 ТиБ |
| **WAT** | Метаданные в JSON: заголовки, ссылки, title | ~14,2 ТиБ |
| **WET** | Извлечённый текст (WARC-записи типа `conversion`) | ~5,9 ТиБ |
| **CDX-индекс** (`cc-index`) | Индекс URL | ~0,23 ТиБ |
| **Колоночный индекс** (`cc-index-table`, Parquet) | Тот же индекс для SQL-движков | ~0,20 ТиБ |

Краулы выходят примерно раз в месяц. Идентификатор краула — `CC-MAIN-ГГГГ-НН`, где `НН` — номер ISO-недели, а не месяц (например, `CC-MAIN-2024-10` — первый краул 2024 года). Актуальный список — в [collinfo.json](https://index.commoncrawl.org/collinfo.json).

### Что не попадает в краул

- Страницы, закрытые в `robots.txt` от краулера Common Crawl (CCBot).
- Контент, доступный только после авторизации.
- Большие файлы сохраняются не целиком — ответы обрезаются по размеру.

## Доступ

### По HTTPS — без аккаунта AWS

```bash
# Список WARC-файлов краула
curl -s https://data.commoncrawl.org/crawl-data/CC-MAIN-2026-39/warc.paths.gz | gunzip | head -3

# Первый файл CDX-индекса
curl -O https://data.commoncrawl.org/cc-index/collections/CC-MAIN-2026-39/indexes/cdx-00000.gz
```

### Через AWS CLI

```bash
aws --no-sign-request s3 ls s3://commoncrawl/crawl-data/CC-MAIN-2026-39/
```

Внутри AWS данные удобнее обрабатывать в регионе `us-east-1`. Подробности — на странице [Get Started](https://commoncrawl.org/get-started).

### Структура бакета

```text
s3://commoncrawl/
├── crawl-data/CC-MAIN-2026-39/
│   ├── warc.paths.gz, wat.paths.gz, wet.paths.gz   # списки файлов
│   └── segments/<сегмент>/{warc,wat,wet}/          # сами файлы
└── cc-index/
    ├── collections/CC-MAIN-2026-39/indexes/cdx-*.gz  # CDX-индекс
    └── table/cc-main/warc/crawl=CC-MAIN-2026-39/     # колоночный индекс (Parquet)
```

## Программный доступ

### CDX Index API

Для каждого краула есть HTTP-интерфейс индекса:

```bash
curl 'https://index.commoncrawl.org/CC-MAIN-2026-39-index?url=commoncrawl.org/*&output=json&limit=5'
```

В ответе для каждого захвата указаны `filename`, `offset` и `length` — по ним запись можно скачать из WARC-файла HTTP-запросом с заголовком `Range`.

### cdx_toolkit (Python)

[cdx_toolkit](https://github.com/commoncrawl/cdx_toolkit) объединяет индексы всех краулов Common Crawl (и умеет работать с CDX API Internet Archive).

```bash
pip install cdx_toolkit

# Оценить число захватов
cdxt --cc size 'commoncrawl.org/*'

# Первые 10 захватов из конкретного краула
cdxt --crawl CC-MAIN-2026-39 --limit 10 iter 'commoncrawl.org/*'
```

```python
import cdx_toolkit

cdx = cdx_toolkit.CDXFetcher(source='cc')

for obj in cdx.iter('commoncrawl.org/*', limit=10, filter=['=status:200']):
    print(obj['url'], obj['timestamp'], obj['status'])
```

Без явного `--crawl`, `--from`/`--to` и `--limit` действуют ограничения по умолчанию: один год краулов и 1000 записей.

### DuckDB: расширение web_archive

Расширение сообщества [`web_archive`](https://github.com/midwork-finds-jobs/duckdb-web-archive) позволяет обращаться к CDX API Common Crawl и Wayback Machine из SQL: условия `WHERE` и `LIMIT` передаются в запрос к API.

```sql
INSTALL web_archive FROM community;
LOAD web_archive;

SELECT url, timestamp, statuscode, mimetype, filename
FROM common_crawl_index()
WHERE crawl_id = 'CC-MAIN-2026-39'
  AND url LIKE '%.example.com/%'
  AND statuscode = 200
LIMIT 10;
```

Подробнее о DuckDB и веб-архивах: [DuckDB-WARC](/kb/instruments/tools/duckdb-warc).

### Колоночный индекс (Athena, Spark, DuckDB)

Колоночный индекс в формате Parquet ([cc-index-table](https://github.com/commoncrawl/cc-index-table)) охватывает все краулы и удобен для широких выборок через Amazon Athena или Spark. Пример запроса из документации проекта для Athena (таблица `ccindex` создаётся по инструкции в репозитории):

```sql
SELECT url, warc_filename, warc_record_offset, warc_record_length
FROM ccindex
WHERE crawl = 'CC-MAIN-2026-39'
  AND subset = 'warc'
  AND url_host_tld = 'ru'
LIMIT 100;
```

Для обработки самих WARC/WAT/WET в Spark есть примеры [cc-pyspark](https://github.com/commoncrawl/cc-pyspark).

## Что с этим делают исследователи

| Цель | Как |
|:---|:---|
| **Корпуса текстов и обучение языковых моделей** | WET → очистка и фильтрация |
| **Анализ веба** | Индекс → SQL → статистика по доменам |
| **Поиск конкретных страниц** | Индекс → запрос записи из WARC |
| **Граф ссылок** | WAT → ссылки → граф |
| **Языковые исследования** | Колоночный индекс содержит определённые языки страниц |

### Русскоязычный веб

Common Crawl полезен для исследований русскоязычного веба: данные бесплатны, публикуются регулярно и допускают публикацию производных наборов (с учётом [условий использования](https://commoncrawl.org/terms-of-use)). Отбирать страницы по зоне (`url_host_tld = 'ru'`) или по языку удобнее всего через колоночный индекс.

## Ограничения

- **Нет просмотра страниц** — только программный доступ.
- **Выборка, а не полный архив** — краулы не гарантируют, что конкретная страница будет сохранена, и не повторяют её регулярно.
- **Спам и дубликаты** — фильтрация базовая.
- **Соблюдение robots.txt** — сайты, закрытые от CCBot, отсутствуют.
- **Объём** — даже один краул занимает десятки терабайт.

## Сравнение с Internet Archive

| Аспект | Common Crawl | Internet Archive |
|:---|:---|:---|
| Объём | ~2 млрд страниц за краул | Более 1 трлн страниц за всё время |
| Доступ | Бесплатная выгрузка файлов | Бесплатный просмотр через Wayback Machine |
| Формат хранения | WARC + производные WAT/WET | ARC/WARC |
| Индекс | CDX и колоночный индекс (URL, статус, тип, язык) | CDX (полнотекстового поиска по Wayback нет) |
| Воспроизведение | ❌ нет интерфейса | ✅ Wayback Machine |
| Цель | Данные для исследований | Сохранение и доступ |

## Когда использовать

✅ Подходит:

- **Исследования веба** — структура, домены, технологии.
- **Корпуса текстов** — лингвистика, языковые модели.
- **Поиск исчезнувших страниц** — как дополнительный источник к Wayback Machine.

❌ Не подходит:

- **Просмотр страницы «как было»** — для этого Wayback Machine.
- **Гарантированное сохранение конкретного сайта** — делайте собственный архив.
- **Юридическая фиксация** — см. [Perma.cc](/kb/similar/perma-cc).

## Ресурсы

- [Common Crawl](https://commoncrawl.org/) и [Get Started](https://commoncrawl.org/get-started)
- [Common Crawl на GitHub](https://github.com/commoncrawl)
- [cdx_toolkit](https://github.com/commoncrawl/cdx_toolkit)
- [cc-index-table](https://github.com/commoncrawl/cc-index-table) — колоночный индекс
- [cc-pyspark](https://github.com/commoncrawl/cc-pyspark) — обработка в Spark
- [Блог Common Crawl](https://commoncrawl.org/blog)

## Связанные материалы

- [DuckDB-WARC](/kb/instruments/tools/duckdb-warc) — SQL к WARC и CDX-индексам.
- [Wayback Machine API](/kb/instruments/tools/wayback-api) — для Internet Archive.
- [Internet Archive](/kb/similar/internet-archive).
- [Формат WARC](/kb/instruments/file-formats/warc).
- [Ландшафт 2026](/kb/instruments/landscape-2026).
