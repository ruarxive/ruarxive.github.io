---
title: CDX
description: "CDX и CDXJ — форматы индексов веб-архивов: легенда полей CDX-11, ключи SURT, структура CDXJ, создание индексов через cdxj-indexer и pywb."
last_update:
  date: 2026-10-12
---

# CDX

**CDX (Capture Index)** — это формат индексации для WARC файлов, который позволяет быстро находить записи в архивах без полного сканирования WARC файлов.

## Описание

CDX файлы содержат индексы записей в WARC файлах, позволяя быстро находить нужные записи по URL и дате без чтения всего WARC файла.

### Особенности

*   **Быстрый поиск**: Позволяет быстро находить записи по URL
*   **Компактность**: Индексы намного меньше самих WARC файлов
*   **Стандартизация**: Описан в спецификации IIPC [CDX File Format (2015)](https://iipc.github.io/warc-specifications/specifications/cdx-format/cdx-2015/)
*   **Интеграция**: Используется инструментами воспроизведения

## Структура CDX файла

### Формат записи

CDX — текстовый файл, где каждая строка описывает одну запись WARC. Первая строка — легенда: символ-разделитель, слово `CDX` и буквенные коды полей. Наиболее распространён 11-польный формат (CDX-11), который по умолчанию использует Internet Archive:

```
 CDX N b a m s k r M S V g
```

Где (по спецификации CDX-2015):
- **N**: нормализованный URL (ключ SURT, см. ниже)
- **b**: дата/время захвата (`YYYYMMDDhhmmss`)
- **a**: оригинальный URL
- **m**: MIME-тип документа
- **s**: HTTP-код ответа
- **k**: контрольная сумма содержимого (обычно SHA-1 в base32)
- **r**: URL перенаправления
- **M**: мета-теги (например, `noindex`, `nofollow`)
- **S**: размер сжатой записи в байтах
- **V**: смещение сжатой записи в файле WARC/ARC
- **g**: имя файла WARC/ARC

Поля `S` и `V` вместе позволяют прочитать нужную gzip-запись из `.warc.gz` без распаковки всего файла: инструмент переходит к байту `V` и читает `S` байт.

Существует и более старый 9-польный формат `N b a m s k r V g`.

### Пример записи

Пример из спецификации CDX-2015 (веб-архив Национальной библиотеки Австралии):

```
au,gov,financeminister)/ 20150914222034 http://www.financeminister.gov.au/ text/html 200 ZMSA5TNJUKKRYAIM5PRUJLL24DV7QYOO - - 83848 117273 WEB-20150914222031256-00000-43190~heritrix.nla.gov.au~8443.warc.gz
```

Здесь `83848` — размер сжатой записи (`S`), `117273` — её смещение в WARC-файле (`V`).

### Обязательность полей

Не все поля CDX всегда заполнены реальными значениями: отсутствующие значения обозначаются прочерком `-`. Для воспроизведения критичны ключ (`N`), дата (`b`), оригинальный URL (`a`), а также длина, смещение и имя файла (`S`, `V`, `g`) — без них невозможно найти запись в WARC.

### Ключи SURT

CDX-файлы сортируются по полю `N`, в котором хранится URL, преобразованный по схеме **SURT** (Sort-friendly URI Reordering Transform). SURT убирает схему (`http`/`https`), переворачивает части доменного имени и отделяет их от пути закрывающей скобкой. Большинство индексаторов (Internet Archive, pywb, cdxj-indexer) по умолчанию также приводят URL к нижнему регистру и отбрасывают префикс `www.`.

| Исходный URL | Ключ в CDX/CDXJ |
| :--- | :--- |
| `https://www.example.com/path?q=1` | `com,example)/path?q=1` |
| `https://archive.org/` | `org,archive)/` |
| `http://www.financeminister.gov.au/` | `au,gov,financeminister)/` |

Полная форма SURT, используемая, например, в настройках Heritrix, выглядит иначе: `http://(com,example,www,)/path?q=1`.

SURT-сортировка делает возможным эффективный диапазонный поиск: все записи домена `example.com` находятся одним бинарным поиском по префиксу `com,example)`, а записи всех его поддоменов — по префиксу `com,example,`.

### Создание CDX индекса

Рекомендуемый индексатор — [cdxj-indexer](https://github.com/webrecorder/cdxj-indexer) от Webrecorder. По умолчанию он пишет CDXJ, а с флагом `-11` — классический CDX-11:

```bash
pip install cdxj-indexer

# CDX-11
cdxj-indexer -11 archive.warc.gz > index.cdx

# CDXJ (по умолчанию)
cdxj-indexer archive.warc.gz > index.cdxj

# Несколько файлов с сортировкой результата
cdxj-indexer -s *.warc.gz > index.cdxj
```

Вывод `cdxj-indexer -11` для тестового WARC:

```
 CDX N b a m s k r M S V g
com,example)/path?q=1 20261012092405 https://www.example.com/path?q=1 text/html 200 CIXINVTZYOKH5XRNFBIISJWCNH6XR5AQ - - 369 251 test.warc.gz
org,archive)/ 20261012092405 https://archive.org/ text/html 200 TRZKLSBPDZOF7KKLC7HDH4FNFEF2H62H - - 338 620 test.warc.gz
```

> Команды сверены с `--help` и живым запуском cdxj-indexer 1.5.0 (октябрь 2026).

Старый индексатор `cdx-indexer` входит в пакет pywb (`pip install pywb`) и отдельно не распространяется. Ещё один исторический инструмент — [CDX-Writer](https://github.com/internetarchive/CDX-Writer) от Internet Archive.

### Поиск в CDX

```bash
# Простой поиск по подстроке
grep "example.com" index.cdx

# Все записи домена example.com по префиксу SURT-ключа
# (файл отсортирован, поэтому можно использовать бинарный поиск утилитой look)
LC_ALL=C look 'com,example)' index.cdx
```

Для больших коллекций вместо поиска по файлу используют CDX-сервер: встроенный в pywb или отдельный [OutbackCDX](https://github.com/nla/outbackcdx). Пакет [cdx_toolkit](https://github.com/commoncrawl/cdx_toolkit) (команда `cdxt`) предназначен для запросов к **удалённым** CDX API Internet Archive и Common Crawl, а не к локальным файлам.

## Интеграция с инструментами

### OpenWayback

OpenWayback использует CDX-файлы для поиска записей. Он настраивается Spring-конфигурацией в каталоге `WEB-INF` веб-приложения: основной файл `wayback.xml` и файл коллекции `CDXCollection.xml`, где указываются пути к CDX-индексам и каталогам с WARC. Последний релиз OpenWayback — 2.4.0 (май 2019 года); для новых проектов IIPC рекомендует pywb (см. [руководство по переходу с OpenWayback](https://pywb.readthedocs.io/en/latest/manual/owb-transition.html)).

### pywb

pywb хранит индекс коллекции в формате CDXJ (`collections/<имя>/indexes/index.cdxj`). Индекс создаётся автоматически при добавлении WARC-файлов:

```bash
pip install pywb

wb-manager init my-collection
wb-manager add my-collection /path/to/warcs/*.warc.gz
```

Команда `wb-manager index my-collection /path/to/file.warc.gz` индексирует файлы, которые уже лежат в каталоге коллекции, без копирования. Обе команды принимают имя коллекции и список файлов.

> Синтаксис `wb-manager` сверен с исходным кодом pywb 2.10.0 (октябрь 2026).

### OutbackCDX

[OutbackCDX](https://github.com/nla/outbackcdx) — CDX-сервер Национальной библиотеки Австралии на основе RocksDB. Может использоваться как бэкенд для OpenWayback и pywb; настройка для pywb описана в [документации pywb](https://pywb.readthedocs.io/en/latest/manual/outbackcdx.html).

## CDXJ формат

CDXJ (CDX JSON) — вариант CDX, в котором вместо плоских полей используется JSON-блок для метаданных. Это обязательный формат индексов внутри [WACZ](/kb/instruments/file-formats/wacz) и формат, который использует pywb. Описан в спецификации Webrecorder [CDXJ 0.1.0](https://specs.webrecorder.net/cdxj/0.1.0/).

### Структура строки CDXJ

Каждая строка состоит из трёх частей, разделённых одиночными пробелами:

```
SURT TIMESTAMP {JSON}
```

1. **SURT** — ключ URL (как в CDX, см. выше);
2. **TIMESTAMP** — время захвата `YYYYMMDDhhmmss` (допустимы ещё 3 цифры миллисекунд);
3. **JSON** — объект в одну строку.

По спецификации JSON обязан содержать поля `url`, `digest`, `mime`, `filename`, `offset`, `length`, `status`. Строки сортируются побайтово (как `LC_ALL=C sort`).

Пример из спецификации CDXJ 0.1.0:

```
org,example)/index.html 20220106150849300 {"url":"https://example.org/index.html","digest":"sha-256:a8c5ac6f47aa34c5c5183daedc6ebbc7ca1e53fd2ec7db5e98d71bffb163b2ce","mime":"image/png","offset":283,"length":2269,"recordDigest":"sha256:e520b333999144ff38f593f6d76f5333d24895701953b2ea0507ed041d20ca2c","status":200,"filename":"data.warc.gz"}
```

Реальные реализации немного отличаются от примера: например, cdxj-indexer записывает `status`, `length` и `offset` строками, а дайджест — в виде SHA-1 в base32 с префиксом `sha1:`:

```
com,example)/path?q=1 20261012092405 {"url": "https://www.example.com/path?q=1", "mime": "text/html", "status": "200", "digest": "sha1:CIXINVTZYOKH5XRNFBIISJWCNH6XR5AQ", "length": "369", "offset": "251", "filename": "test.warc.gz"}
```

### Преимущества CDXJ

*   **Расширяемость**: новые поля добавляются в JSON без изменения формата строки.
*   **Совместимость с CDX**: префикс (SURT + timestamp) сортируется и ищется так же, как в классическом CDX.
*   **Использование в WACZ**: индексы CDXJ упаковываются прямо в `.wacz`-архив, что позволяет ReplayWeb.page воспроизводить архив без предварительной индексации.

### Генерация CDXJ

```bash
# cdxj-indexer
cdxj-indexer -s archive.warc.gz > index.cdxj

# py-wacz создаёт CDXJ-индекс внутри .wacz
wacz create -o archive.wacz /path/to/warcs/*.warc.gz

# pywb пишет CDXJ при добавлении файлов в коллекцию
wb-manager add my-collection /path/to/warcs/*.warc.gz
```

CDXJ-файлы часто сжимают целиком в `.cdxj.gz`; внутри WACZ сжатый индекс принято называть `index.cdx.gz`.

## Рекомендации

### Организация индексов

*   Создавайте отдельные индексы для разных коллекций
*   Регулярно обновляйте индексы при добавлении новых WARC файлов
*   Используйте сжатие для больших индексов (`.cdx.gz`)

### Оптимизация

*   Сортируйте индексы по SURT (`LC_ALL=C sort`) — это даёт возможность бинарного поиска по домену
*   Разделяйте индексы по датам для больших архивов
*   Используйте CDXJ для гибких метаданных

## Практические примеры

### Чтение CDX-11 в Python

```python
def find_url_in_cdx(cdx_file, surt_prefix):
    with open(cdx_file, 'r', encoding='utf-8') as f:
        for line in f:
            if line.startswith(' CDX'):
                continue
            parts = line.rstrip('\n').split(' ')
            if parts[0].startswith(surt_prefix):
                print(f"URL: {parts[2]}")
                print(f"Date: {parts[1]}")
                print(f"Status: {parts[4]}")
                print(f"Length: {parts[8]}, offset: {parts[9]}, file: {parts[10]}")

find_url_in_cdx('index.cdx', 'com,example)/')
```

### Чтение записи по смещению из CDX

```python
from io import BytesIO
from warcio.archiveiterator import ArchiveIterator

def read_record(warc_path, offset, length):
    with open(warc_path, 'rb') as f:
        f.seek(int(offset))
        chunk = f.read(int(length))
    for record in ArchiveIterator(BytesIO(chunk)):
        return record.rec_headers.get_header('WARC-Target-URI'), record.content_stream().read()

uri, body = read_record('test.warc.gz', 251, 369)
print(uri, len(body))
```

## Связь с WARC

CDX индексы тесно связаны с WARC файлами:

*   **WARC файлы** содержат сами данные
*   **CDX файлы** содержат индексы для быстрого поиска
*   CDX указывает на смещения и длины записей в WARC файлах
*   Инструменты воспроизведения используют CDX для навигации

## Ресурсы

*   [CDX спецификация 2015](https://iipc.github.io/warc-specifications/specifications/cdx-format/cdx-2015/)
*   [CDXJ 0.1.0](https://specs.webrecorder.net/cdxj/0.1.0/) — спецификация Webrecorder
*   [cdxj-indexer](https://github.com/webrecorder/cdxj-indexer) — эталонный индексатор CDXJ/CDX
*   [CDX-Writer](https://github.com/internetarchive/CDX-Writer) — Python-скрипт Internet Archive для генерации CDX-индексов
*   [OutbackCDX](https://github.com/nla/outbackcdx) — CDX-сервер

## Связанные материалы

- [Формат WARC](/kb/instruments/file-formats/warc) — базовый формат веб-архивов
- [Формат WACZ](/kb/instruments/file-formats/wacz) — WACZ использует CDXJ для индексации
- [Инструменты воспроизведения](/kb/instruments/replay) — использование CDX для просмотра архивов
- [Обработка WARC](/kb/instruments/tools/warc-processing) — работа с WARC и создание индексов
