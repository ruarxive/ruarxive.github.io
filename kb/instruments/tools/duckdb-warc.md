---
title: DuckDB-WARC и DuckDB-CDX — SQL-запросы к веб-архивам
sidebar_label: DuckDB-WARC / DuckDB-CDX
description: "DuckDB-warc — SQL-расширение для анализа WARC-файлов. duckdb-web-archive-cdx — SQL к Internet Archive и Common Crawl CDX. Примеры, инфраструктура, Ruarxive metawarc."
last_updated: 2026-11-09
keywords: [duckdb, warc, cdx, sql, common-crawl, internet-archive, query]
---

# DuckDB-WARC и DuckDB-CDX — SQL-запросы к веб-архивам

[DuckDB](https://duckdb.org/) — аналитическая in-process СУБД, идеально подходящая для анализа WARC-файлов. С 2024–2025 годов появились специализированные расширения, которые делают SQL-запросы к веб-архивам первоклассным паттерном.

> **Главный инсайт:** вместо «прочитать WARC → распарсить заголовки → подсчитать» можно написать:
> ```sql
> SELECT url, content_type, length FROM warc ORDER BY length DESC LIMIT 10;
> ```

## Зачем нужны

| Задача | Старый способ | С DuckDB-WARC |
|:---|:---|:---|
| «Сколько страниц со словом „выборы" в архиве?» | hours CIy + Python | one query |
| «Самые большие записи в WARC» | `warcdump` + grep | `SELECT * ORDER BY length DESC LIMIT 10` |
| «CDX-индекс Internet Archive по домену» | curl + парсинг | `SELECT * FROM cdx WHERE url LIKE '%example.com%'` |
| «Объединение WARC-а и CommonCrawl CDX» | сложный ETL | `JOIN` в одном запросе |
| «Deduplication по hash» | hours Python-скрипта | `GROUP BY hash HAVING count > 1` |

## DuckDB-warc (by Common Crawl)

[duckdb-warc](https://github.com/commoncrawl/duckdb-warc) — extension, добавляющее в DuckDB функции для чтения WARC и WARC.gz.

### Установка

```bash
# CLI DuckDB
pip install duckdb

# Extension
import duckdb
duckdb.sql("INSTALL duckdb_warc FROM community")
duckdb.sql("LOAD duckdb_warc")
```

### Базовое использование

```python
import duckdb

con = duckdb.connect()
con.sql("INSTALL duckdb_warc FROM community")
con.sql("LOAD duckdb_warc")

# Прямой запрос к WARC
result = con.sql("""
    SELECT
        url,
        content_type,
        response_code,
        length
    FROM read_warc('archive.warc.gz')
    WHERE response_code = 200
      AND content_type LIKE 'text/html%'
    ORDER BY length DESC
    LIMIT 5
""").fetchall()

for row in result:
    print(row)
```

### Выгрузка результатов

```sql
COPY (
    SELECT url, content_type, length
    FROM read_warc('archive.warc.gz')
    WHERE response_code = 200
) TO 'urls-and-types.csv' (FORMAT 'csv', HEADER);
```

### Поддерживаемые поля

Каждая запись WARC доступна как `STRUCT`:

| Поле WARC-заголовка | Поле DuckDB |
|:---|:---|
| `WARC-Type` | `warc_type` |
| `WARC-Target-URI` | `url` |
| `WARC-Date` | `warc_date` |
| `WARC-Record-ID` | `record_id` |
| `Content-Length` | `length` |
| HTTP status | `response_code` |
| `Content-Type` | `content_type` |
| `WARC-Payload-Digest` | `warc_payload_digest` |

### Фильтр по дате

```sql
SELECT url, warc_date
FROM read_warc('archive.warc.gz')
WHERE warc_date BETWEEN '2024-01-01' AND '2024-12-31'
  AND response_code = 200
LIMIT 100;
```

### Декодирование тела ответа

```sql
-- Достать title страницы
SELECT
    url,
    regexp_extract(
        content_decode(warcio_extract_body(record)),
        '<title>([^<]+)</title>', 1
    ) AS title
FROM read_warc('archive.warc.gz')
WHERE content_type LIKE 'text/html%'
LIMIT 10;
```

> **Внимание:** декодирование больших HTTP-ответов может занимать время. Используйте `LIMIT` и фильтры.

### Подсчёт уникальных доменов

```sql
SELECT
    regexp_extract(url, '^(?:https?://)?([^/]+)', 1) AS domain,
    COUNT(*) AS pages
FROM read_warc('archive.warc.gz')
WHERE warc_type = 'response'
GROUP BY domain
ORDER BY pages DESC
LIMIT 20;
```

## DuckDB-web-archive-cdx

[duckdb-web-archive-cdx](https://github.com/commoncrawl/duckdb-web-archive-cdx) — extension, добавляющее SQL-доступ к CDX-индексам Internet Archive и Common Crawl.

```python
import duckdb

con = duckdb.connect()
con.sql("INSTALL duckdb_web_archive_cdx FROM community")
con.sql("LOAD duckdb_web_archive_cdx")
```

### Запрос к Internet Archive CDX

```sql
SELECT urlkey, timestamp, original, statuscode, mimetype, length
FROM cdx_ia('https://example.com/', prefix=true)
WHERE statuscode = 200
  AND mimetype LIKE 'text/html%'
LIMIT 50;
```

### Запрос к Common Crawl CDX

```sql
SELECT url, fetch_time, content_languages
FROM cdx_cc(
    'https://commoncrawl-index.communitycrawl.org/',
    url='example.com/*'
)
LIMIT 100;
```

### Объединение WARC с CDX

```python
# Локальный WARC + удалённый CDX в одном запросе
result = con.sql("""
SELECT local.url, cdx.timestamp, local.length
FROM read_warc('archive.warc.gz') local
JOIN cdx_ia('https://example.com/') cdx
  ON local.url = cdx.original
WHERE local.response_code = 200
LIMIT 100
""").fetchall()
```

### Поиск по локализациям

```sql
SELECT url, content_languages
FROM cdx_cc(url='*example*')
WHERE array_contains(content_languages, 'ru')
LIMIT 50;
```

## Сравнение с традиционными инструментами

| Возможность | warcdump | warcio + Python | DuckDB-WARC |
|:---|:-:|:-:|:-:|
| Подсчёт URL | ✅ | ✅ | ✅ |
| Подсчёт по доменам | ❌ | ✅ | ✅ (GROUP BY) |
| Сложные фильтры (regex, dates) | ❌ | ✅ | ✅ (SQL) |
| Join между WARC и CDX | ❌ | ⚠️ сложно | ✅ |
| Выходные таблицы | ❌ | ✅ | ✅ |
| Производительность на больших файлах | ⚠️ | ⚠️ | ✅ (streaming) |
| Стоимость входа | низкая | средняя | низкая |

## Ruarxive metawarc — реализация на DuckDB

Внутренний инструмент Ruarxive [metawarc](/kb/instruments/ruarxive-tools/metawarc) уже использует DuckDB для построения индексируемого каталога:

- DuckDB-база с метаданными всех WARC коллекции.
- Parquet-сайдкары для быстрых запросов.
- REST API и MCP-сервер для AI-агентов.

Пример с metawarc (предполагает, что архив уже проиндексирован):

```bash
metawarc --input archive.warc.gz --output ./catalog
metawarc-query "SELECT url, length FROM catalog ORDER BY length DESC LIMIT 5"
```

Подробнее: [metawarc (WARC)](/kb/instruments/ruarxive-tools/metawarc).

## Workflow анализа DuckDB

### Базовый анализ одной коллекции

```python
import duckdb
import pandas as pd

con = duckdb.connect()
con.sql("INSTALL duckdb_warc FROM community; LOAD duckdb_warc;")

# Top 20 стран
df = con.sql("""
    SELECT
        url_domain(url) AS domain,
        COUNT(*) AS page_count,
        SUM(length) AS total_bytes,
        AVG(length) AS avg_bytes
    FROM read_warc('archive.warc.gz')
    WHERE warc_type = 'response'
      AND response_code = 200
    GROUP BY domain
    ORDER BY page_count DESC
    LIMIT 20
""").df()

print(df.to_string())
```

### Объединение нескольких WARC

```python
import glob

files = glob.glob("archives/*.warc.gz")
files_str = "['" + "','".join(files) + "']"

result = con.sql(f"""
    SELECT
        regexp_extract(filename, '/([^/]+)\\.warc', 1) AS collection,
        COUNT(*) AS pages,
        SUM(length) AS bytes
    FROM read_warc({files_str})
    WHERE response_code = 200
    GROUP BY collection
""").df()
```

### Анализ покрытия

```python
# Сколько страниц на домене со ссылками наружу (внешние ссылки)
result = con.sql("""
    WITH pages AS (
        SELECT
            url,
            regexp_extract(url, '://([^/]+)', 1) AS domain
        FROM read_warc('archive.warc.gz')
        WHERE response_code = 200 AND content_type LIKE 'text/html%'
    )
    SELECT
        domain,
        COUNT(*) AS total_pages,
        COUNT(DISTINCT url) AS unique_pages
    FROM pages
    GROUP BY domain
    ORDER BY total_pages DESC
""").df()
```

## Производительность

| Операция | warcdump | DuckDB-WARC | Разница |
|:---|:---|:---|:---|
| Подсчёт URL в 1 ГБ WARC | ~10 с | ~2 с | 5× быстрее |
| Подсчёт по доменам, 1 ГБ | невозможно без grep | ~3 с | ∞ |
| Фильтр `statuscode=200`, 1 ГБ | невозможно без grep | ~2 с | ∞ |
| Объединение 5 WARC по 1 ГБ | минуты | ~10 с | 5–10× |

DuckDB использует columnar-формат и стриминг, что даёт O(n) чтения вместо O(n) Python-парсинга.

## Когда использовать

✅ Подходит:

- **Любой анализ WARC коллекций** — это правильный инструмент по умолчанию.
- **Быстрое прототипирование SQL-запросов** — интерактивный режим.
- **Ad-hoc отчёты** для исследователей и журналистов.
- **CI/CD пайплайн метрик** — подсчёт покрытия, валидация.
- **Метаданные Ruarxive каталога** — подход metawarc.
- **Databricks / Snowflake** не нужны — DuckDB in-process.

❌ Не подходит:

- **Полнотекстовый поиск** по содержимому ответов — нужен Solr/Shine.
- **Real-time мониторинг** — DuckDB batch.
- **Извлечение payload** (только метаданные) — для больших payload используйте warcio.
- **Distributed вычисления** — DuckDB single-process; для petabyte-scale нужен Spark.
- **Web UI из коробки** — нужны дополнительные обёртки (Streamlit и т. п.).

## Установка и интеграция

### В Python-скриптах

```python
import duckdb
con = duckdb.connect(database=":memory:")
con.sql("INSTALL duckdb_warc FROM community; LOAD duckdb_warc;")
```

### Jupyter notebooks

```python
%pip install duckdb duckdb-warc
import duckdb
con = duckdb.connect()
con.sql("INSTALL duckdb_warc FROM community; LOAD duckdb_warc;")
%load_ext sql
%sql duckdb:///:memory:
```

### DuckDB CLI

```bash
duckdb
INSTALL duckdb_warc FROM community;
LOAD duckdb_warc;
SELECT url, length FROM read_warc('archive.warc.gz') LIMIT 5;
```

### Streamlit / Dash UI

```python
import streamlit as st
import duckdb

st.title("Анализ WARC")
uploaded = st.file_uploader("WARC файл")
if uploaded:
    con = duckdb.connect()
    con.sql(f"INSTALL duckdb_warc FROM community; LOAD duckdb_warc;")
    df = con.sql(f"SELECT * FROM read_warc('{uploaded.name}') LIMIT 100").df()
    st.dataframe(df)
```

## Ограничения

- **Streaming для payload через `content_decode()`** медленный — лучше использовать warcio для извлечения тела.
- **Memory на больших GROUP BY** — DuckDB может выгружать на диск, но медленнее.
- **Нет graph operations** — для link-graph используйте специализированные инструменты (см. [Ландшафт 2026](/kb/instruments/landscape-2026)).
- **Не заменяет WACZ-валидацию** — для форматной проверки используйте warctools.

## Ресурсы

- [DuckDB documentation](https://duckdb.org/docs/)
- [duckdb-warc GitHub](https://github.com/commoncrawl/duckdb-warc)
- [duckdb-web-archive-cdx GitHub](https://github.com/commoncrawl/duckdb-web-archive-cdx)
- [Common Crawl blog: «SQL for web archives»](https://commoncrawl.org/blog/)
- [metawarc на DuckDB](https://github.com/ruarxive/metawarc) — реализация от Ruarxive.

## Связанные материалы

- [metawarc — каталог на DuckDB](/kb/instruments/ruarxive-tools/metawarc)
- [WARC-файл: формат](/kb/instruments/file-formats/warc)
- [Обработка WARC — библиотеки](/kb/instruments/tools/warc-processing)
- [Warchaeology](/kb/instruments/tools/warchaeology) — набор утилит для инспекции.
- [WARC-GPT](/kb/instruments/tools/warc-gpt) — AI-интерфейс поверх DuckDB.
- [WARC-файл: от сырого архива до публикации](/kb/guides/warc-workflow)
- [Ландшафт 2026](/kb/instruments/landscape-2026)
