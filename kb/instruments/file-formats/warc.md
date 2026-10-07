---
sidebar_position: 3
---

# WARC

Формат архива [Web ARChive (WARC)](https://ru.wikipedia.org/wiki/Web_ARChive) определяет метод объединения нескольких цифровых ресурсов в совокупный архивный файл вместе с сопутствующей информацией.

Формат WARC является пересмотром формата `ARC_IA` File Format, который традиционно использовался [Internet Archive](https://archive.org/) для хранения данных, собираемых веб-краулерами.

[Международный стандарт](https://iipc.github.io/warc-specifications/specifications/warc-format/warc-1.1/#general-1) определяет формат файла WARC:
- для хранения содержимого и управляющей информации из основных протоколов прикладного уровня интернета, таких как HTTP, DNS и FTP;
- для хранения метаданных, связанных с другими хранимыми данными (например, предметный классификатор, обнаруженный язык, кодировка);
- поддерживать сжатие данных и сохранять целостность записей данных;
- хранить всю управляющую информацию протокола сбора данных (например, заголовки запросов), а не только информацию об ответах;
- хранить результаты преобразования данных, связанные с другими хранимыми данными;
- хранить событие обнаружения дубликатов, связанное с другими хранимыми данными (для уменьшения объема хранения при наличии идентичных или по существу аналогичных ресурсов).

## Стандарт WARC

WARC формализован как **ISO 28500** стандарт. Текущая версия спецификации — **WARC 1.1**, которая поддерживается сообществом через [warc-specifications](https://iipc.github.io/warc-specifications/) на GitHub. Это открытый процесс, где можно предложить улучшения и новые функции формата.

### Версии формата

- **WARC 1.0** — первоначальная версия стандарта
- **WARC 1.1** — текущая версия с улучшениями и расширениями
- Спецификация доступна на [warc-specifications community](https://iipc.github.io/warc-specifications/specifications/warc-format/warc-1.1/)

### Типы WARC-записей

Каждый WARC-файл состоит из последовательности записей. Тип записи определяется полем `WARC-Type` в её заголовке:

| Тип | Назначение |
| :--- | :--- |
| `warcinfo` | Метаинформация о самом WARC-файле (программа-сборщик, параметры краулинга). Обычно первая запись файла. |
| `request` | HTTP-запрос, отправленный краулером. |
| `response` | HTTP-ответ сервера (тело страницы и заголовки). Это самый массовый тип записей. |
| `metadata` | Произвольные метаданные о других записях (например, извлечённый язык, MIME-тип, классификатор). |
| `revisit` | Ссылка на ранее заархивированный ресурс (используется для дедупликации: содержит только дату и хеш оригинала). |
| `conversion` | Запись производного контента (например, скриншот страницы или WARC писался поверх существующего архива). |
| `continuation` | Продолжение записи, разбитой на несколько блоков (для очень больших ответов). |

Полный список и точные определения полей см. в [WARC 1.1 §Record Types](https://iipc.github.io/warc-specifications/specifications/warc-format/warc-1.1/#record-types).

WARC-файлы часто упаковываются в архивы `.gz` или `.zip` — итоговый архив может достигать сотен гигабайт. Такие контейнеры можно открыть любым архиватором с поддержкой ZIP и GZ.

Подробнее об индексации: [Формат CDX](/kb/instruments/file-formats/cdx).

## ARC: предшественник WARC

Формат `ARC` (Archive-It / Internet Archive ARC, иногда пишется `ARC_IA`) — непосредственный предшественник WARC, использовавшийся [Internet Archive](https://archive.org/) с 1990-х годов. Многие старые архивы (до ~2008 года) до сих пор хранятся в `.arc.gz`.

### Отличия от WARC

- ARC хранит только HTTP-ответы (нет отдельных `request`-записей, нет `metadata`, `revisit`, `continuation`).
- Заголовок ARC проще — это URL, IP-адрес, дата, MIME-тип, длина, смещение.
- Размер файлов ARC обычно меньше, но они не подходят для современных задач (SPA, динамический контент).

### Конвертация ARC → WARC

```bash
# warctools автоматически определяет формат
warcdump archive.arc.gz | head -20

# Конвертация в WARC
arc2warc archive.arc.gz > archive.warc
```

Для работы со смешанными коллекциями (ARC + WARC) используется библиотека `warcio` — она умеет читать оба формата через единый `ArchiveIterator`.


## ReplayWeb.page. Как открыть файл в формате WARC

Файлы в формате WARC можно открыть и просмотреть с помощью программы [ReplayWeb.page](https://github.com/webrecorder/replayweb.page) оффлайн.


## metawarc: Как обрабатывать файлы в формате WARC

[metawarc](https://github.com/ruarxive/metawarc) — это инструмент команды Ruarxive для индексации, поиска, извлечения метаданных и анализа WARC-коллекций. Строит версионированный каталог DuckDB + Parquet-сайдкары, поднимает локальный веб-replay и предоставляет REST API и MCP-сервер.

- Репозиторий: [github.com/ruarxive/metawarc](https://github.com/ruarxive/metawarc)
- Полная документация: [ruarxive.org/metawarc](https://ruarxive.org/metawarc/)
- Краткий обзор в БЗ Ruarxive: [metawarc (WARC)](/kb/instruments/ruarxive-tools/metawarc)


## Другие инструменты для работы с WARC файлами

Пакет инструментов для работы с файлами WARC (Web ARChive). Основан на Python. Некоторые команды:

- warcvalid — возвращает 0, если все аргументы являются действительными файлами WARC, ненулевое значение при ошибке.
- warcdump — пишет человекочитаемое резюме warcfiles. Автоопределяет формат входных данных при передаче имен файлов, т.е. recordgzip vs plaintext, WARC vs ARC.
- warcfilter — поиск всех заголовков по шаблону регулярных выражений (regex).
- и другие возможности.

Документация: https://github.com/internetarchive/warctools

## Валидация и контроль целостности

Помимо `warcvalid` (см. выше), для проверки WARC-файлов используются:

- **JHOVE** — модуль `WARC-module` от Open Preservation Foundation, поддерживает форматный профиль WARC.
- **warcio** — Python-библиотека, проверяющая корректность парсинга; используется `ArchiveIterator` (см. примеры ниже).
- **Сравнение хеша payload** — для `revisit`-запейсей WARC хранит `WARC-Payload-Digest` (SHA-1 или SHA-256); для контроля целостности значение должно совпадать с хешем тела ответа.

## Практические примеры обработки WARC

### Валидация WARC файла

```bash
# Используя warcvalid из warctools
warcvalid archive.warc.gz

# Используя warcio (Python)
python -c "from warcio.archiveiterator import ArchiveIterator; list(ArchiveIterator(open('archive.warc.gz', 'rb')))"
```

### Просмотр содержимого WARC

```bash
# Используя warcdump
warcdump archive.warc.gz | head -100

# Просмотр только URL
warcdump archive.warc.gz | grep "WARC-Target-URI"
```

### Извлечение всех URL из WARC

```python
from warcio.archiveiterator import ArchiveIterator

urls = set()
with open('archive.warc.gz', 'rb') as stream:
    for record in ArchiveIterator(stream):
        if record.rec_type == 'response':
            url = record.rec_headers.get_header('WARC-Target-URI')
            if url:
                urls.add(url)

print(f"Найдено {len(urls)} уникальных URL")
for url in sorted(urls):
    print(url)
```

### Фильтрация записей по домену

```python
from warcio.archiveiterator import ArchiveIterator

target_domain = 'example.com'
matching_records = []

with open('archive.warc.gz', 'rb') as stream:
    for record in ArchiveIterator(stream):
        if record.rec_type == 'response':
            url = record.rec_headers.get_header('WARC-Target-URI', '')
            if target_domain in url:
                matching_records.append({
                    'url': url,
                    'date': record.rec_headers.get_header('WARC-Date'),
                    'content_type': record.http_headers.get_header('Content-Type', '')
                })

print(f"Найдено {len(matching_records)} записей для {target_domain}")
```

### Подсчет размеров по типам контента

```python
from warcio.archiveiterator import ArchiveIterator
from collections import defaultdict

sizes = defaultdict(int)
counts = defaultdict(int)

with open('archive.warc.gz', 'rb') as stream:
    for record in ArchiveIterator(stream):
        if record.rec_type == 'response':
            content_type = record.http_headers.get_header('Content-Type', 'unknown')
            # Упрощаем тип контента
            main_type = content_type.split(';')[0].split('/')[0] if '/' in content_type else 'unknown'
            length = int(record.rec_headers.get_header('Content-Length', 0))
            sizes[main_type] += length
            counts[main_type] += 1

print("Статистика по типам контента:")
for content_type in sorted(sizes.keys()):
    print(f"{content_type}: {counts[content_type]} записей, {sizes[content_type] / 1024 / 1024:.2f} MB")
```

## Связанные форматы

- [WACZ формат](/kb/instruments/file-formats/wacz) — современный формат упаковки веб-архивов на основе WARC
- [CDX формат](/kb/instruments/file-formats/cdx) — формат индексации для WARC файлов

## Связанные материалы

- [Обработка WARC](/kb/instruments/tools/warc-processing) — библиотеки и инструменты для работы с WARC
- [Инструменты воспроизведения](/kb/instruments/replay) — просмотр WARC архивов
- [Heritrix](/kb/instruments/tools/heritrix) — создание WARC файлов
- [Browsertrix](/kb/instruments/tools/browsertrix) — создание WARC/WACZ архивов
- [grab-site](/kb/instruments/tools/grab-site) — создание WARC файлов
