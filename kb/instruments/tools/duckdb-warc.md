---
title: DuckDB и веб-архивы — SQL-запросы к WARC и CDX
sidebar_label: DuckDB-WARC / DuckDB-CDX
description: "Как анализировать веб-архивы в DuckDB: расширение duckdb-warc от Harvard LIL (read_warc), расширение сообщества warc (parse_warc) и расширение web_archive для SQL-запросов к CDX Wayback Machine и Common Crawl."
last_update:
  date: 2026-10-12
keywords: [duckdb, warc, cdx, sql, common-crawl, internet-archive, query]
---

# DuckDB и веб-архивы — SQL-запросы к WARC и CDX

[DuckDB](https://duckdb.org/) — аналитическая встраиваемая СУБД, удобная для разового анализа файлов. Для веб-архивов есть три расширения:

| Расширение | Автор | Что делает | Как установить |
|:---|:---|:---|:---|
| [duckdb-warc](https://github.com/harvard-lil/duckdb-warc) | Harvard Library Innovation Lab | таблица `read_warc()` — все записи WARC-файлов с заголовками и телом | собрать из исходников, загрузить как неподписанное расширение |
| [`warc`](https://github.com/midwork-finds-jobs/duckdb_warc) | сообщество (onnimonni) | функция `parse_warc()` — разбор **одной** WARC-записи (например, скачанной из Common Crawl по диапазону байтов) | `INSTALL warc FROM community` |
| [`web_archive`](https://github.com/midwork-finds-jobs/duckdb-web-archive) | сообщество (onnimonni) | таблицы `wayback_machine()` и `common_crawl_index()` — SQL к CDX API Wayback Machine и Common Crawl | `INSTALL web_archive FROM community` |

Все три — молодые проекты (2025–2026 годов), их совместимость с версиями DuckDB меняется. Перед работой проверьте версию, указанную ниже, и README расширения.

> **Главная идея:** вместо «прочитать WARC → разобрать заголовки → подсчитать» в скрипте можно написать:
> ```sql
> SELECT target_uri, content_length FROM read_warc('archive.warc.gz') ORDER BY content_length DESC LIMIT 10;
> ```

## Зачем нужны

| Задача | Обычный способ | С DuckDB |
|:---|:---|:---|
| Самые большие записи в WARC | `warcio index` + сортировка | `SELECT … ORDER BY content_length DESC LIMIT 10` |
| Сколько записей по каждому хосту | скрипт на Python | `GROUP BY` по хосту из `target_uri` |
| Дубликаты по содержимому | скрипт на Python | `GROUP BY payload_digest HAVING count(*) > 1` |
| Какие копии страницы есть в Wayback Machine | `curl` к CDX API + разбор | `SELECT … FROM wayback_machine() WHERE url = …` |
| Выгрузить результат в CSV/Parquet | вручную | `COPY (…) TO 'result.csv'` |

## duckdb-warc (Harvard LIL): чтение WARC-файлов

[duckdb-warc](https://github.com/harvard-lil/duckdb-warc) — расширение на Rust от Harvard Library Innovation Lab (репозиторий создан в декабре 2025 года). Оно регистрирует одну табличную функцию `read_warc(path)`, которая возвращает по строке на каждую WARC-запись. Поддерживаются файлы `.warc` и `.warc.gz`, маски путей (`'archives/*.warc.gz'`), а в сборке по умолчанию также адреса `http(s)://` и `s3://`.

В реестре расширений сообщества DuckDB этого расширения нет, готовых бинарных сборок в релизах тоже нет — его нужно собрать.

### Установка

Нужны Rust (cargo), Python 3, make и git:

```bash
git clone --recurse-submodules https://github.com/harvard-lil/duckdb-warc.git
cd duckdb-warc
make configure
make release
# результат: build/release/duckdb_warc.duckdb_extension
```

Расширение собирается под конкретную версию DuckDB (в октябре 2026 года — `TARGET_DUCKDB_VERSION=v1.5.2` в `Makefile`) и загружается только в неё. Расширение не подписано, поэтому DuckDB нужно запускать с разрешением неподписанных расширений:

```bash
pip install duckdb==1.5.2
```

```python
import duckdb

con = duckdb.connect(config={"allow_unsigned_extensions": "true"})
con.sql("LOAD 'build/release/duckdb_warc.duckdb_extension'")
```

В DuckDB CLI того же номера версии: `duckdb -unsigned`, затем `LOAD 'build/release/duckdb_warc.duckdb_extension';`.

> Сборка и все запросы ниже проверены на duckdb-warc из ветки по умолчанию с DuckDB 1.5.2 (октябрь 2026).

### Колонки

| Колонка | Тип | Откуда |
|:---|:---|:---|
| `record_source` | VARCHAR | путь к файлу, из которого прочитана запись |
| `record_index` | INTEGER | порядковый номер записи в файле |
| `record_id` | VARCHAR | `WARC-Record-ID` |
| `type` | VARCHAR | `WARC-Type` (`response`, `request`, `resource`, `revisit`, `warcinfo`, `metadata`…) |
| `target_uri` | VARCHAR | `WARC-Target-URI` |
| `date` | TIMESTAMP | `WARC-Date` |
| `content_length` | INTEGER | `Content-Length` WARC-записи |
| `content_type` | VARCHAR | `Content-Type` **WARC-записи** (для ответов это `application/http; msgtype=response`, а не MIME-тип страницы) |
| `payload_digest`, `block_digest` | VARCHAR | `WARC-Payload-Digest`, `WARC-Block-Digest` |
| `ip_address`, `concurrent_to`, `refers_to`, `warcinfo_id`, `filename`, `profile`, `truncated`, `identified_payload_type`, `segment_*` | — | соответствующие WARC-заголовки |
| `body` | BLOB | блок записи; для `response` — HTTP-заголовки и тело ответа как есть |

Отдельной колонки с HTTP-статусом и MIME-типом ответа нет — их можно извлечь из начала `body` (см. пример ниже).

### Базовое использование

```sql
-- Самые большие ответы в архиве
SELECT target_uri, content_length
FROM read_warc('archive.warc.gz')
WHERE type = 'response'
ORDER BY content_length DESC
LIMIT 5;
```

### Выгрузка результатов

```sql
COPY (
    SELECT target_uri, date, content_length
    FROM read_warc('archive.warc.gz')
    WHERE type = 'response'
) TO 'urls.csv' (FORMAT csv, HEADER);
```

### Фильтр по дате

```sql
SELECT target_uri, date
FROM read_warc('archive.warc.gz')
WHERE type = 'response'
  AND date BETWEEN '2024-01-01' AND '2024-12-31'
LIMIT 100;
```

### HTTP-статус, MIME-тип и заголовок страницы

```sql
SELECT
    target_uri,
    regexp_extract(decode(body, 'replace'), '^HTTP/[0-9.]+ ([0-9]{3})', 1) AS http_status,
    regexp_extract(decode(body, 'replace'), '(?i)content-type: *([^;\r\n]+)', 1) AS mime,
    regexp_extract(decode(body, 'replace'), '<title>([^<]+)</title>', 1) AS title
FROM read_warc('archive.warc.gz')
WHERE type = 'response'
LIMIT 10;
```

`decode(body, 'replace')` заменяет недопустимые байты, иначе `decode` падает на бинарных ответах. Если сервер отдал тело сжатым (`Content-Encoding: gzip`, `br`), извлечь из него текст средствами SQL не получится — заголовок `title` останется пустым; для таких записей используйте [warcio](/kb/instruments/tools/warc-processing).

### Дубликаты по содержимому

```sql
SELECT payload_digest, count(*) AS copies
FROM read_warc('archives/*.warc.gz')
WHERE type = 'response'
GROUP BY payload_digest
HAVING count(*) > 1
ORDER BY copies DESC;
```

### Статистика по хостам для нескольких WARC

При проверке группировка по `target_uri` напрямую из `read_warc()` по маске из нескольких файлов аварийно завершала процесс DuckDB. Надёжнее сначала сохранить нужные колонки в таблицу:

```sql
CREATE TABLE records AS
SELECT record_source, type, target_uri, date, content_length, payload_digest
FROM read_warc('archives/*.warc.gz');

SELECT
    regexp_extract(target_uri, '^https?://([^/]+)', 1) AS host,
    count(*) AS responses,
    sum(content_length) AS bytes
FROM records
WHERE type = 'response'
GROUP BY host
ORDER BY responses DESC
LIMIT 20;

-- Сколько ответов в каждом файле
SELECT record_source, count(*) FROM records WHERE type = 'response' GROUP BY record_source;
```

## Расширение сообщества `warc`: разбор отдельных записей

Расширение [`warc`](https://github.com/midwork-finds-jobs/duckdb_warc) из реестра DuckDB Community Extensions добавляет функцию `parse_warc(data)`. Она разбирает **одну** WARC-запись (сжатую gzip или нет) и возвращает структуру с полями `warc_version`, `warc_headers` (JSON), `http_version`, `http_status`, `http_headers` (JSON), `http_body`. Расширение рассчитано на работу с Common Crawl: сначала по индексу находят нужную запись, скачивают её диапазон байтов, затем разбирают:

```bash
curl -r"46376769-46377713" "https://data.commoncrawl.org/crawl-data/…" > record.warc.gz
```

```sql
INSTALL warc FROM community;
LOAD warc;

SELECT
    (parse_warc(content)).http_status,
    decode((parse_warc(content)).http_body) AS html
FROM read_blob('record.warc.gz');
```

Если передать файл с несколькими записями, будет разобрана только первая — для целых WARC-файлов используйте `read_warc()` из duckdb-warc.

На октябрь 2026 года сборки расширения опубликованы только для DuckDB 1.4.2 (с 1.4.4 и 1.5.x команда `INSTALL warc FROM community` не находит расширение).

## Расширение `web_archive`: SQL к CDX Wayback Machine и Common Crawl

Расширение [`web_archive`](https://github.com/midwork-finds-jobs/duckdb-web-archive) из реестра DuckDB Community Extensions добавляет две табличные функции:

- `wayback_machine()` — CDX API Wayback Machine; колонки `url`, `timestamp`, `urlkey`, `mimetype`, `statuscode`, `digest`, `length`, `response`, `year`, `month`;
- `common_crawl_index()` — индекс Common Crawl; колонки `url`, `timestamp`, `mimetype`, `statuscode`, `digest`, `filename`, `offset`, `length`, `crawl_id`, `warc`, `response`.

Условия `WHERE` по `url`, `statuscode`, `mimetype`, а также `LIMIT` и `DISTINCT ON(year)` передаются в CDX API, поэтому скачиваются только нужные строки.

```sql
INSTALL web_archive FROM community;
LOAD web_archive;

-- Успешные захваты главной страницы
SELECT url, timestamp, statuscode, mimetype
FROM wayback_machine()
WHERE url = 'ruarxive.org/'
  AND statuscode = 200
LIMIT 10;

-- По одному захвату в год
SELECT DISTINCT ON(year) year, url, timestamp
FROM wayback_machine()
WHERE url = 'ruarxive.org/'
  AND statuscode = 200
LIMIT 10;

-- Все страницы сайта в Wayback Machine
SELECT url, timestamp, statuscode
FROM wayback_machine()
WHERE url LIKE 'example.com/%'
  AND statuscode = 200
LIMIT 100;

-- Индекс Common Crawl ("offset" — зарезервированное слово, его нужно брать в кавычки)
SELECT url, timestamp, mimetype, filename, "offset", length
FROM common_crawl_index()
WHERE url LIKE 'ruarxive.org/%'
  AND statuscode = 200
LIMIT 10;
```

Сервер индекса Common Crawl иногда отвечает ошибкой 503 — тогда повторите запрос позже.

Колонки `filename`, `offset`, `length` из `common_crawl_index()` указывают, где в Common Crawl лежит WARC-запись, — по ним её можно скачать и разобрать функцией `parse_warc()`.

> Запросы проверены с DuckDB 1.4.4 (октябрь 2026; нужен Python-пакет `pytz` для колонки `timestamp`). С DuckDB 1.5.5 и 1.5.6 расширение устанавливалось, но запросы завершались ошибкой `Unrecognized option force_download` — проверьте актуальное состояние в репозитории расширения.

## metawarc — каталог коллекции на DuckDB

Инструмент Ruarxive [metawarc](/kb/instruments/ruarxive-tools/metawarc) индексирует коллекции WARC в версионируемый каталог DuckDB с Parquet-файлами рядом и даёт команды для статистики, поиска, выгрузки, REST API и MCP-сервер для AI-агентов. Если нужен не разовый запрос, а постоянный каталог большой коллекции, удобнее он:

```bash
metawarc index 'archives/**/*.warc*' --dbfile collection.db --resume
metawarc stats --dbfile collection.db --mode mimes
metawarc list-files --dbfile collection.db --mimes application/pdf
metawarc serve --dbfile collection.db
```

Подробнее: [metawarc](/kb/instruments/ruarxive-tools/metawarc).

## Сравнение с традиционными инструментами

| Возможность | `warcio index` | warcio + Python | DuckDB + duckdb-warc |
|:---|:-:|:-:|:-:|
| Список записей и URL | ✅ | ✅ | ✅ |
| Подсчёт по хостам | ❌ | ✅ | ✅ (GROUP BY) |
| Сложные фильтры (регулярные выражения, даты) | ❌ | ✅ | ✅ (SQL) |
| Распаковка сжатого HTTP-тела | ❌ | ✅ | ❌ |
| Выгрузка в CSV/Parquet | ⚠️ | ✅ | ✅ (`COPY`) |
| Стоимость входа | низкая | средняя | средняя (нужна сборка расширения) |

## Пример анализа в Python

```python
import duckdb

con = duckdb.connect(config={"allow_unsigned_extensions": "true"})
con.sql("LOAD 'build/release/duckdb_warc.duckdb_extension'")

con.sql("""
    CREATE TABLE records AS
    SELECT type, target_uri, date, content_length
    FROM read_warc('archives/*.warc.gz')
""")

df = con.sql("""
    SELECT
        regexp_extract(target_uri, '^https?://([^/]+)', 1) AS host,
        count(*) AS responses,
        sum(content_length) AS total_bytes,
        avg(content_length) AS avg_bytes
    FROM records
    WHERE type = 'response'
    GROUP BY host
    ORDER BY responses DESC
    LIMIT 20
""").df()

print(df.to_string())
```

## Когда использовать

✅ Подходит:

- **разовый анализ WARC-коллекций** — подсчёты, фильтры, выгрузки;
- **быстрые прототипы SQL-запросов** в интерактивном режиме;
- **отчёты** для исследователей и журналистов;
- **проверка покрытия** сайта в Wayback Machine и Common Crawl (`web_archive`);
- **точечное извлечение записей** из Common Crawl (`common_crawl_index()` + `parse_warc()`).

❌ Не подходит:

- **полнотекстовый поиск** по содержимому — нужен Solr ([SolrWayback](/kb/instruments/tools/solrwayback); [Shine](/kb/instruments/tools/shine) — архивный прототип, не развивается) или `metawarc search`;
- **извлечение сжатых HTTP-ответов** — DuckDB не распаковывает `Content-Encoding`; используйте warcio;
- **распределённые вычисления** — DuckDB работает в одном процессе; для петабайтных объёмов нужен Spark ([ArchiveSpark](/kb/instruments/tools/archivespark));
- **готовый веб-интерфейс** — нужны дополнительные обёртки.

## Ограничения

- **Экспериментальные расширения**: duckdb-warc нужно собирать под конкретную версию DuckDB, расширения сообщества не всегда совместимы с последними версиями DuckDB.
- **Нет HTTP-статуса и MIME-типа ответа как колонок** в `read_warc()` — их приходится извлекать из `body`.
- **Память на больших GROUP BY** — DuckDB может выгружать данные на диск, но это медленнее; колонку `body` не читайте без необходимости.
- **Нет операций над графами** — для графа ссылок используйте специализированные инструменты (см. [Ландшафт 2026](/kb/instruments/landscape-2026)).
- **Не заменяет валидацию WARC и WACZ** — для WACZ есть `wacz validate` из пакета py-wacz.

## Ресурсы

- [Документация DuckDB](https://duckdb.org/docs/)
- [harvard-lil/duckdb-warc](https://github.com/harvard-lil/duckdb-warc)
- [Реестр DuckDB Community Extensions](https://github.com/duckdb/community-extensions) — описания расширений `warc` и `web_archive`
- [midwork-finds-jobs/duckdb_warc](https://github.com/midwork-finds-jobs/duckdb_warc) и [midwork-finds-jobs/duckdb-web-archive](https://github.com/midwork-finds-jobs/duckdb-web-archive)
- [metawarc](https://github.com/ruarxive/metawarc) — каталог WARC-коллекций на DuckDB от Ruarxive

## Связанные материалы

- [metawarc — каталог на DuckDB](/kb/instruments/ruarxive-tools/metawarc)
- [Формат WARC](/kb/instruments/file-formats/warc)
- [Обработка WARC — библиотеки](/kb/instruments/tools/warc-processing)
- [Warchaeology](/kb/instruments/tools/warchaeology) — набор утилит для инспекции.
- [WARC-GPT](/kb/instruments/tools/warc-gpt) — AI-интерфейс к WARC.
- [WARC-файл: от сырого архива до публикации](/kb/guides/warc-workflow)
- [Ландшафт 2026](/kb/instruments/landscape-2026)
