---
title: Обработка WARC
sidebar_label: Обработка WARC
description: "Обзор библиотек и утилит на Python, Java, Node.js, Rust и Go для чтения, записи, фильтрации, валидации и дедупликации WARC-файлов."
last_update:
  date: 2026-10-12
---

# Инструменты обработки WARC

Работа с «сырыми» WARC-файлами часто требует скриптов: извлечь данные, отфильтровать записи, проверить целостность. Ниже — основные библиотеки и утилиты по языкам. Статусы проектов проверены в октябре 2026 года.

## Python-библиотеки

### warcio

[warcio](https://github.com/webrecorder/warcio) — основная библиотека для потокового чтения и записи WARC/ARC от Webrecorder. В комплекте консольная утилита `warcio` с командами `index`, `recompress`, `extract`, `check` (проверка дайджестов).

```python
from warcio.archiveiterator import ArchiveIterator

with open('my-archive.warc.gz', 'rb') as stream:
    for record in ArchiveIterator(stream):
        if record.rec_type == 'response':
            print(record.rec_headers.get_header('WARC-Target-URI'))
```

### FastWARC

[FastWARC](https://resiliparse.chatnoir.eu/en/latest/man/fastwarc.html) — быстрый парсер WARC на Cython/C++ из набора [ChatNoir Resiliparse](https://github.com/chatnoir-eu/chatnoir-resiliparse) (проект поисковой системы ChatNoir). Устанавливается командой `pip install fastwarc` (Python 3.10+). API похож на warcio, но не полностью совместим с ним. По данным README cc-pyspark, замена warcio на FastWARC ускоряет задачи, в которых основное время уходит на разбор WARC, примерно на 25 %. Подходит для больших объёмов, например обработки Common Crawl. CLI: `fastwarc check | index | extract | recompress | benchmark`.

```python
from fastwarc.warc import ArchiveIterator, WarcRecordType

with open('my-archive.warc.gz', 'rb') as stream:
    for record in ArchiveIterator(stream, record_types=WarcRecordType.response):
        print(record.headers['WARC-Target-URI'], record.http_headers.status_code)
```

Сторонний проект `ai-pipestream/fastwarc-grpc` — это gRPC-сервис, а не библиотека FastWARC.

### warctools

[warctools](https://github.com/internetarchive/warctools) (пакет `warctools` на PyPI, версия 5.0.1; модуль `hanzo`) — классическая библиотека и набор утилит Internet Archive для ARC и WARC (`warcdump`, `warcfilter`, `warcvalid`, `warcextract`, `warcindex` и др.). Проверена временем, но медленнее современных альтернатив. Нужна в основном для совместимости со старыми скриптами.

### Warcat

[Warcat](https://github.com/chfoo/warcat) — инструмент и библиотека для WARC (Christopher Foo): просмотр, извлечение, проверка, склейка и разбиение файлов. Сейчас автор развивает версию на Rust (см. ниже).

### warcbench

[warcbench](https://github.com/harvard-lil/warcbench) — инструмент Harvard Library Innovation Lab для исследования, анализа, преобразования, объединения и извлечения данных из WARC.

## Java-библиотеки

### jwarc

[jwarc](https://github.com/iipc/jwarc) — библиотека IIPC для чтения и записи WARC с типизированным API. Поставляется одним jar-файлом с набором консольных инструментов:

```bash
java -jar jwarc.jar ls archive.warc.gz          # список записей
java -jar jwarc.jar cdx archive.warc.gz         # CDX-индекс
java -jar jwarc.jar validate archive.warc.gz    # валидация
java -jar jwarc.jar filter ':status == 200' archive.warc.gz > ok.warc
java -jar jwarc.jar serve archive.warc.gz       # локальное воспроизведение
java -jar jwarc.jar                             # список всех команд
```

Есть также `dedupe`, `extract`, `fetch`, `recorder`, `screenshot`, `stats`, `wacz` и др. Автор предупреждает, что многие инструменты — облегчённые демонстрации.

### JWAT и JWAT-Tools

[JWAT](https://github.com/netarchivesuite/jwat) (Java Web Archive Toolkit) — библиотеки для чтения, записи и валидации WARC, ARC и GZIP от проекта NetarchiveSuite (Королевская библиотека Дании). [JWAT-Tools](https://github.com/netarchivesuite/jwat-tools) — консольная утилита на их основе с задачами `test` (валидация), `cdx`, `arc2warc`, `extract`, `compress`, `decompress`, `unpack` и др.

```bash
jwattools.sh test archive.warc.gz
```

Проекты стабильны, но обновляются редко (последние изменения — 2023). Для новых Java-проектов чаще выбирают jwarc.

### Heritrix Commons

Если вы работаете в Java-среде, библиотеки проекта [Heritrix](heritrix) тоже умеют читать и писать WARC.

## Node.js-библиотеки

### node-warc

[node-warc](https://github.com/N0taN3rd/node-warc) — парсинг и создание WARC на Node.js, в том числе запись браузерных сессий (через Puppeteer или chrome-remote-interface).

### node-cdxj

[node-cdxj](https://github.com/N0taN3rd/node-cdxj) — парсер CDXJ для Node.js. Не обновлялся с 2017 года.

## Rust

### Warcat-rs

[warcat-rs](https://github.com/chfoo/warcat-rs) — консольная утилита и библиотека на Rust от автора Warcat. Активно развивается.

## Go

- [gowarc (nlnwa)](https://github.com/nlnwa/gowarc) — библиотека чтения, записи и валидации WARC Национальной библиотеки Норвегии; на ней построена [warchaeology](/kb/instruments/tools/warchaeology).
- [gowarc (internetarchive)](https://github.com/internetarchive/gowarc) — библиотека Internet Archive для чтения и записи WARC (используется в кроулере Zeno).
- [warchaeology](/kb/instruments/tools/warchaeology) — консольная утилита `warc`: `ls`, `cat`, `validate`, `dedup`, `convert`.
- [unwarc](https://github.com/richardlehane/unwarc) — извлечение содержимого из WARC и ARC; не развивается с 2019 года.

## Дедупликация

- [`warc dedup`](/kb/instruments/tools/warchaeology) (warchaeology, Go) — локальная дедупликация с заменой повторов на `revisit`-записи.
- `jwarc dedupe` (Java).
- `wget --warc-dedup` — дедупликация при сборе по CDX прошлого сбора (см. [Wget](wget)).
- [doppelganger](https://github.com/internetarchive/doppelganger) (Internet Archive, Go) — сервер URL-независимой дедупликации на ScyllaDB; по README проект в разработке (WIP).

Подробнее — в гайде [Дедупликация WARC](/kb/guides/warc-deduplication).

## Обработка больших объёмов

### HadoopConcatGz

[HadoopConcatGz](https://github.com/helgeho/HadoopConcatGz) — разбиваемый на части InputFormat Hadoop для конкатенированных GZIP-файлов, включая `*.warc.gz`. Не обновлялся с 2018 года.

### Apache Spark, Athena

Для терабайтов WARC (например, данных Common Crawl) обычно используют:

- **Apache Spark** — например, примеры [cc-pyspark](https://github.com/commoncrawl/cc-pyspark) от Common Crawl (Python + Spark, чтение WARC через warcio или FastWARC);
- **Amazon Athena** — SQL-запросы к колоночному индексу Common Crawl ([cc-index-table](https://github.com/commoncrawl/cc-index-table));
- **[DuckDB-WARC](/kb/instruments/tools/duckdb-warc)** — SQL-запросы к WARC на одной машине.

## Сравнение библиотек

| Библиотека | Язык | Особенности | Рекомендация |
| :--- | :--- | :--- | :--- |
| **warcio** | Python | Стандартный API, утилита `warcio` | **Основной выбор для Python** |
| **FastWARC** | Python (Cython/C++) | Высокая скорость, API похож на warcio | Большие объёмы |
| **warctools** | Python | Классические утилиты IA | Совместимость со старыми скриптами |
| **Warcat** | Python | Простой CLI | Простые задачи |
| **warcbench** | Python | Анализ и преобразование WARC | Исследовательские задачи |
| **jwarc** | Java | Типизированный API, CLI в одном jar | **Для Java-проектов** |
| **JWAT / JWAT-Tools** | Java | Валидация, ARC→WARC | Валидация, наследие NetarchiveSuite |
| **node-warc** | Node.js | Запись браузерных сессий | Node.js-проекты |
| **warcat-rs** | Rust | CLI и библиотека | Rust-проекты |
| **gowarc** | Go | Библиотеки NLN и IA | **Для Go-проектов** |
| **warchaeology** | Go (CLI) | Просмотр, валидация, дедупликация | Командная строка |

## Практические примеры

### Извлечение всех URL из WARC

```python
from warcio.archiveiterator import ArchiveIterator

urls = []
with open('archive.warc.gz', 'rb') as stream:
    for record in ArchiveIterator(stream):
        if record.rec_type == 'response':
            urls.append(record.rec_headers.get_header('WARC-Target-URI'))

print(f"Найдено {len(urls)} URL")
```

### Фильтрация записей по типу контента

```python
from warcio.archiveiterator import ArchiveIterator

html_pages = []
with open('archive.warc.gz', 'rb') as stream:
    for record in ArchiveIterator(stream):
        if record.rec_type == 'response' and record.http_headers:
            content_type = record.http_headers.get_header('Content-Type', '')
            if 'text/html' in content_type:
                html_pages.append(record.rec_headers.get_header('WARC-Target-URI'))
```

### Проверка WARC-файла

```bash
# warcio: проверка дайджестов записей
warcio check -v archive.warc.gz

# FastWARC: то же, быстрее
fastwarc check archive.warc.gz

# warchaeology: проверка формата (для WARC из Wget 1.x добавьте --lenient)
warc validate archive.warc.gz

# jwarc
java -jar jwarc.jar validate archive.warc.gz

# JWAT-Tools
jwattools.sh test archive.warc.gz
```

> Команды warcio 1.8.1, FastWARC 1.0.9 и warchaeology 5.0.0 проверены на тестовом WARC (октябрь 2026). Команды jwarc и JWAT-Tools сверены с исходным кодом.

## Связанные материалы

- [Формат WARC](/kb/instruments/file-formats/warc)
- [Формат CDX](/kb/instruments/file-formats/cdx)
- [Формат WACZ](/kb/instruments/file-formats/wacz)
- [Инструменты воспроизведения](/kb/instruments/replay)
- [Warchaeology](/kb/instruments/tools/warchaeology)
- [Heritrix](/kb/instruments/tools/heritrix) — создание WARC
- [Wget](/kb/instruments/tools/wget) — запись WARC из командной строки
