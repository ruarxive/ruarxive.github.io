---
title: WARC
description: "Формат WARC (ISO 28500) — основной стандарт хранения веб-архивов: типы записей, сжатие, отличия от ARC, валидация и примеры обработки на Python."
sidebar_position: 3
last_update:
  date: 2026-10-12
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

WARC формализован как международный стандарт **ISO 28500**. Текущая версия спецификации — **WARC 1.1**; её текст и комментарии сообщества поддерживаются IIPC в репозитории [warc-specifications](https://iipc.github.io/warc-specifications/) на GitHub. Это открытый процесс, где можно предложить улучшения и новые функции формата.

### Версии формата

- **WARC 1.0** — первоначальная версия стандарта, **ISO 28500:2009**.
- **WARC 1.1** — текущая версия, **ISO 28500:2017**.
- Спецификация доступна на сайте [warc-specifications](https://iipc.github.io/warc-specifications/specifications/warc-format/warc-1.1/).

В реестре форматов PRONOM WARC имеет идентификаторы `fmt/289` (WARC без указания версии), `fmt/1355` (WARC 1.0) и `fmt/1281` (WARC 1.1).

### Типы WARC-записей

Каждый WARC-файл состоит из последовательности записей. Тип записи определяется полем `WARC-Type` в её заголовке. Спецификация WARC 1.1 определяет восемь типов:

| Тип | Назначение |
| :--- | :--- |
| `warcinfo` | Метаинформация о самом WARC-файле (программа-сборщик, параметры краулинга). Обычно первая запись файла. |
| `response` | Полный ответ сервера, например HTTP-ответ с заголовками и телом. Самый массовый тип записей. |
| `resource` | Ресурс без протокольной обёртки: файл, полученный не по HTTP, скриншот, извлечённый объект. |
| `request` | Запрос, отправленный краулером (например, HTTP-запрос). |
| `metadata` | Метаданные о другой записи (например, извлечённый язык, классификатор, список ссылок). |
| `revisit` | Повторное посещение уже сохранённого ресурса (используется для дедупликации). Обязательно содержит поле `WARC-Profile`; WARC 1.1 рекомендует указывать `WARC-Refers-To-Target-URI` и `WARC-Refers-To-Date`. Обычно хранит HTTP-заголовки нового ответа, но не тело. |
| `conversion` | Альтернативная версия содержимого другой записи, созданная в ходе архивного процесса, например при миграции формата. |
| `continuation` | Продолжение записи, разбитой на сегменты, если она не помещается в один WARC-файл заданного максимального размера. |

Полный список и точные определения полей см. в [WARC 1.1 §Record Types](https://iipc.github.io/warc-specifications/specifications/warc-format/warc-1.1/#warc-record-types).

### Сжатие: `.warc.gz`

Файлы `.warc.gz` сжимаются **по записям**: каждая запись WARC — отдельный gzip-поток (member), а файл — их конкатенация. Благодаря этому индексы CDX/CDXJ хранят смещение и длину сжатой записи, и инструменты воспроизведения читают нужную запись напрямую, не распаковывая весь файл.

Распаковка `.warc.gz` через `gunzip` формально даёт корректный несжатый WARC, но смещения из существующих индексов перестают совпадать, а файл занимает в несколько раз больше места. Поэтому храните WARC в исходном виде. WARC не упаковывают в `.zip`; исключение — формат [WACZ](/kb/instruments/file-formats/wacz), где WARC-файлы лежат внутри ZIP без повторного сжатия.

Подробнее об индексации: [Формат CDX](/kb/instruments/file-formats/cdx).

## ARC: предшественник WARC

Формат `ARC` (иногда пишется `ARC_IA`) — непосредственный предшественник WARC, разработанный и использовавшийся [Internet Archive](https://archive.org/) с 1990-х годов. Многие старые архивы до сих пор хранятся в `.arc.gz`.

### Отличия от WARC

- ARC хранит только ответы (нет отдельных `request`-записей, нет `metadata`, `revisit`, `continuation`).
- Заголовок ARC проще — это URL, IP-адрес, дата, MIME-тип, длина.
- В ARC нет встроенных полей для контрольных сумм и связей между записями.

### Конвертация ARC → WARC

```bash
# warctools автоматически определяет формат
warcdump archive.arc.gz | head -20

# Конвертация в WARC (результат пишется в stdout)
arc2warc archive.arc.gz > archive.warc
```

Для работы со смешанными коллекциями (ARC + WARC) используется библиотека `warcio` — она умеет читать оба формата через единый `ArchiveIterator`.

## ReplayWeb.page. Как открыть файл в формате WARC

Файлы в формате WARC можно открыть и просмотреть с помощью программы [ReplayWeb.page](https://github.com/webrecorder/replayweb.page) офлайн.

## metawarc: Как обрабатывать файлы в формате WARC

[metawarc](https://github.com/ruarxive/metawarc) — это инструмент команды Ruarxive для индексации, поиска, извлечения метаданных и анализа WARC-коллекций. Строит версионированный каталог DuckDB + Parquet-сайдкары, поднимает локальный веб-replay и предоставляет REST API и MCP-сервер.

- Репозиторий: [github.com/ruarxive/metawarc](https://github.com/ruarxive/metawarc)
- Полная документация: [ruarxive.org/metawarc](https://ruarxive.org/metawarc/)
- Краткий обзор в БЗ Ruarxive: [metawarc (WARC)](/kb/instruments/ruarxive-tools/metawarc)

## Другие инструменты для работы с WARC файлами

[warctools](https://github.com/internetarchive/warctools) — пакет инструментов Internet Archive для работы с файлами WARC и ARC на Python. Некоторые команды:

- `warcvalid` — возвращает 0, если все аргументы являются действительными файлами WARC, ненулевое значение при ошибке.
- `warcdump` — пишет человекочитаемое резюме файлов. Автоопределяет формат входных данных (сжатые по записям или несжатые, WARC или ARC).
- `warcfilter` — отбирает записи, заголовки которых соответствуют регулярному выражению.
- `arc2warc` — конвертирует ARC в WARC.

## Валидация и контроль целостности

Помимо `warcvalid` (см. выше), для проверки WARC-файлов используются:

- **warcio check** — проверяет дайджесты записей (`WARC-Block-Digest`, `WARC-Payload-Digest`), если они есть в заголовках.
- **JHOVE** — модуль `WARC-kb` (вклад Королевской библиотеки Дании), запуск: `jhove -m WARC-kb archive.warc.gz`. Документация: [jhove.openpreservation.org/modules/warc](https://jhove.openpreservation.org/modules/warc/).
- **Дайджесты записей.** `WARC-Block-Digest` — хеш всего блока записи (вместе с HTTP-заголовками), по нему проверяют целостность самой записи. `WARC-Payload-Digest` — хеш полезной нагрузки (тела ответа); у `revisit`-записи тела нет, и её `WARC-Payload-Digest` сравнивают с дайджестом **исходной** записи, на которую она ссылается.

## Практические примеры обработки WARC

### Валидация WARC файла

```bash
# Используя warcvalid из warctools
warcvalid archive.warc.gz

# Используя warcio: проверка дайджестов всех записей
pip install warcio
warcio check -v archive.warc.gz
```

> Команды `warcio` сверены с `--help` версии 1.8.1 (октябрь 2026).

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
        if record.rec_type == 'response' and record.http_headers:
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

Поле `Content-Length` в заголовке WARC-записи — это длина всего блока, включая HTTP-заголовки, а не только тела ответа. Для обзорной статистики этого приближения достаточно.

```python
from warcio.archiveiterator import ArchiveIterator
from collections import defaultdict

sizes = defaultdict(int)
counts = defaultdict(int)

with open('archive.warc.gz', 'rb') as stream:
    for record in ArchiveIterator(stream):
        if record.rec_type == 'response' and record.http_headers:
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
