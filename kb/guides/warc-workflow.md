---
title: "WARC-файл: от сырого архива до публикации"
sidebar_label: "WARC: от архива до публикации"
sidebar_position: 5
last_updated: 2026-10-07
description: "Пошаговый путь WARC-файла от момента скачивания до публикации: валидация, индексация, обогащение метаданными, упаковка в WACZ и публикация."
keywords: [warc, wacz, валидация, индексация, метаданные, warcio, cdxj, публикация, replay]
---

# WARC-файл: от сырого архива до публикации

> **TL;DR** — WARC — это сырой контейнер с HTTP-ответами. Чтобы им могли пользоваться люди и исследователи, нужно: проверить целостность → построить индекс (CDXJ) → обогатить метаданными → упаковать в WACZ → загрузить в плеер.

Wget, Browsertrix, wpull, Heritrix и почти любой краулер сохраняют результат в формате [WARC](/kb/instruments/file-formats/warc). Но сам по себе WARC-файл — это просто последовательность HTTP-записей. Чтобы превратить его в полезный архив, нужно пройти несколько этапов обработки. Этот гайд описывает полный путь.

## Полный pipeline

```
┌──────────────┐
│  Скачивание  │  wget / Browsertrix / wpull
│  (WARC.gz)   │
└──────┬───────┘
       ↓
┌──────────────┐
│ Валидация    │  warcvalid / jwarc — целостность и соответствие стандарту
└──────┬───────┘
       ↓
┌──────────────┐
│ Индексация   │  cdxj-indexer / warcio → CDXJ-файл
└──────┬───────┘
       ↓
┌──────────────┐
│ Обогащение   │  metawarc — извлечение ссылок, заголовков, mime
│ метаданными  │
└──────┬───────┘
       ↓
┌──────────────┐
│ Упаковка     │  wacz → ZIP с WARC + CDXJ + datapackage.json
│ в WACZ       │
└──────┬───────┘
       ↓
┌──────────────┐
│ Публикация   │  ReplayWeb.Page / pywb / IPWB
│ в плеер      │
└──────────────┘
```

## 1. Скачивание

Если вы ещё не скачали сайт, начните с одного из гайдов:

- [Wget](/kb/guides/wget) — статические сайты, без JavaScript
- [Browsertrix](/kb/instruments/tools/browsertrix) — современные SPA с JavaScript
- [wpull](/kb/instruments/tools/wpull) — если нужна WARC-совместимая замена wget
- [Как создать цифровой архив сайта](/kb/instruments/howto-collect/make-copy-website) — обзорная страница

:::tip Совет
При сохранении через Browsertrix сразу получается WACZ (готовый пакет). С wget и wpull — только WARC, и его нужно паковать вручную.
:::

## 2. Валидация

Перед публикацией стоит убедиться, что WARC-файл не повреждён и соответствует стандарту.

### Быстрая проверка с помощью `warcvalid`

```bash
# Установка
pip install warcvalid

# Проверка
warcvalid my-archive.warc.gz
```

`warcvalid` (часть пакета `jwarc`) проверит:

- корректность WARC-заголовков;
- совпадение длин в заголовке и теле записи;
- валидность gzip-обёртки (если есть).

### Проверка на Python через `warcio`

```python
from warcio.archiveiterator import ArchiveIterator

errors = 0
records = 0
with open('my-archive.warc.gz', 'rb') as stream:
    for record in ArchiveIterator(stream):
        records += 1
        if record.rec_headers is None:
            print(f"Ошибка: запись без заголовков")
            errors += 1
        if record.rec_type not in {'warcinfo', 'request', 'response',
                                    'metadata', 'revisit', 'conversion',
                                    'continuation', 'resource'}:
            print(f"Неизвестный тип записи: {record.rec_type}")
            errors += 1

print(f"\nЗаписей: {records}, ошибок: {errors}")
```

### Контрольные суммы

Для долгосрочного хранения полезно фиксировать SHA-256 WARC-файла.

```bash
sha256sum my-archive.warc.gz > my-archive.warc.gz.sha256
```

Сохраните файл `.sha256` вместе с архивом — это позволит обнаружить повреждение при передаче.

## 3. Индексация (CDXJ)

Сырой WARC — это «лента» HTTP-записей. Чтобы по нему можно было искать («дайте мне все страницы, на которых встречается слово X»), нужен индекс в формате [CDXJ](https://iipc.github.io/warc-specifications/specifications/cdx-format/cdxj.html) (CDX с JSON-суффиксом).

### С помощью `cdxj-indexer` (Webrecorder)

```bash
# Установка
npm install -g @webrecorder/cdxj-indexer

# Индексация
cdxj-indexer my-archive.warc.gz > my-archive.cdxj
```

### С помощью `warcio` (Python)

```python
from warcio.archiveiterator import ArchiveIterator
import json

with open('my-archive.warc.gz', 'rb') as stream, \
     open('my-archive.cdxj', 'w') as out:
    for record in ArchiveIterator(stream):
        if record.rec_type != 'response':
            continue
        url = record.rec_headers.get_header('WARC-Target-URI')
        date = record.rec_headers.get_header('WARC-Date')
        # CDX-формат: SURT URL-время смещение длина
        # упрощённый пример
        out.write(f"{url} {date} {json.dumps({'status': 'ok'})}\n")
```

После индексации `my-archive.cdxj` можно использовать в [pywb](https://github.com/webrecorder/pywb) или [ReplayWeb.Page](https://replayweb.page/) для поиска по архиву.

## 4. Обогащение метаданными

Чистый WARC содержит только «сырые» HTTP-ответы. Чтобы облегчить анализ, полезно добавить метаданные:

- список ссылок между страницами;
- извлечённый текст без HTML-разметки;
- определение MIME-типа;
- язык страницы;
- дайджест контента (хеш).

В Ruarxive для этого есть инструмент [metawarc](/kb/instruments/ruarxive-tools/metawarc).

### Пример: добавить ссылки между страницами

```bash
metawarc --input my-archive.warc.gz \
         --output my-archive.enriched.warc.gz \
         --extract-links \
         --detect-mime
```

`metawarc` создаст новый WARC с записями типа `metadata` для каждой страницы — они ссылаются на исходные `response`-записи через `WARC-Record-ID`.

## 5. Упаковка в WACZ

[WACZ](https://webrecorder.net/blog/announcing-the-wacz-format.html) — это ZIP-архив с заранее заданной структурой, который содержит:

- один или несколько WARC-файлов;
- CDXJ-индекс;
- `datapackage.json` с метаданными коллекции (название, описание, лицензия, автор);
- контрольные суммы для каждого файла.

WACZ — это основной формат для [ReplayWeb.Page](https://replayweb.page/) и других современных плееров.

### Создание WACZ вручную

```bash
# Структура каталога
mkdir -p my-archive-wacz/archive
cp my-archive.warc.gz my-archive-wacz/archive/
cp my-archive.cdxj my-archive-wacz/

# Создаём datapackage.json
cat > my-archive-wacz/datapackage.json << EOF
{
  "profile": "data-package",
  "wacz_version": "1.1.1",
  "title": "Архив сайта example.com",
  "description": "Архив сделан 2026-10-07 перед запланированным отключением",
  "licenses": [{"name": "cc-by-4.0", "title": "CC-BY 4.0"}],
  "resources": [
    {
      "name": "my-archive.warc.gz",
      "path": "archive/my-archive.warc.gz",
      "stats": {"bytes": $(stat -c%s my-archive.warc.gz)}
    }
  ]
}
EOF

# Упаковываем
cd my-archive-wacz && zip -r ../my-archive.wacz . && cd ..
```

### Создание WACZ с помощью `wacz` (Webrecorder)

```bash
pip install wacz

wacz create --filename my-archive.wacz \
           --title "Архив сайта example.com" \
           --description "..." \
           my-archive.warc.gz my-archive.cdxj
```

## 6. Публикация в плеер

WACZ — самодостаточный пакет. Его можно загрузить в любой плеер.

### Локальный просмотр (без сервера)

Самый простой способ — открыть WACZ в [ReplayWeb.Page](https://replayweb.page/) в браузере. Перетащите файл — плеер загрузит его и позволит просматривать страницы как «живые».

### Собственный сервер на `pywb`

`pywb` (Python Wayback) — серверный плеер, который позволяет хостить большие коллекции и давать к ним доступ по URL.

```bash
pip install pywb

# Инициализация
wb-manager init my-collections

# Добавление архива
wb-manager add my-collections my-archive /path/to/my-archive.wacz

# Запуск
wayback --collections my-collections
```

После запуска архив будет доступен на `http://localhost:8080/my-archive/2026/http://example.com/`.

### Хостинг статического WACZ

Если у вас есть простое статическое хранилище (S3, CDN, GitHub Pages), WACZ можно хостить как обычный файл и отдавать через ReplayWeb.Page по URL. Это дешевле, чем держать pywb, но не даёт полнотекстового поиска.

:::tip Совет
Для публичных архивов Ruarxive использует комбинацию: WACZ на CDN + ReplayWeb.Page в качестве интерфейса. Подробности — в [пользовательском разделе «Как открыть WARC»](/kb/users/open-warc).
:::

## Чек-лист готовности к публикации

Прежде чем отдавать архив пользователям, проверьте:

- [ ] **WARC прошёл валидацию** (`warcvalid` или аналог)
- [ ] **SHA-256 зафиксирован** и сохранён отдельно
- [ ] **CDXJ-индекс построен** и лежит рядом с WARC
- [ ] **Метаданные коллекции заполнены** (название, описание, лицензия, автор, дата)
- [ ] **WACZ упакован** с контрольными суммами
- [ ] **Архив проверен в плеере**: открыть 5–10 случайных страниц, проверить CSS, JS, изображения
- [ ] **WARC-файл и метаданные продублированы** в 2+ независимых хранилищах
- [ ] **Юридические ограничения соблюдены**: takedown-процедура описана в [правовом разделе](/kb/legal/copyright)
- [ ] **Запись в каталоге** Ruarxive создана через [форму](https://airtable.com/shriiNZvNhcgaStm6) или обновление Airtable

## Хранение и долгосрочная сохранность

WARC — формат, рассчитанный на десятилетия хранения (ISO 28500). Но за это время:

- **Носители деградируют**: делайте 3 копии в разных местах (правило 3-2-1).
- **Форматы сжатия устаревают**: периодически проверяйте, что ваши `.warc.gz` можно открыть. Сейчас gzip — стандарт, но переход на `.wacz` (ZIP) делает архив более устойчивым.
- **Метаданные теряются**: храните `datapackage.json` и `.sha256` вместе с архивом, не отдельно.
- **ПО перестаёт работать**: pywb и Browsertrix — активно поддерживаемые проекты, но через 20 лет их API может измениться. Поэтому CDXJ-индекс полезно иметь в открытом, документированном формате (JSON Lines) — он читается глазами и любым скриптом.

Подробнее о принципах цифрового сохранения — в [глоссарии](/kb/glossary) и [правовом разделе](/kb/legal).

## Связанные материалы

- [WARC — формат файла](/kb/instruments/file-formats/warc) — структура и спецификации
- [WACZ — упакованный архив](/kb/instruments/file-formats/wacz) — для плееров
- [CDX/CDXJ — индексы](/kb/instruments/file-formats/cdx) — для поиска по архиву
- [metawarc — обогащение метаданными](/kb/instruments/ruarxive-tools/metawarc) — инструмент Ruarxive
- [Обработка WARC — библиотеки](/kb/instruments/tools/warc-processing) — Python, Java, Node.js, Rust
- [ReplayWeb.Page и другие плееры](/kb/instruments/replay) — как открыть и хостить
- [Как открыть WARC обычному пользователю](/kb/users/open-warc) — инструкция для исследователей
- [Как создать архив сайта](/kb/instruments/howto-collect/make-copy-website) — откуда берётся WARC
- [Кастомные workflow](/kb/guides/custom-workflows) — автоматизация всех шагов pipeline
- [Кейс: wparc → metawarc → индексируемый архив](/kb/case-studies/wparc-to-metawarc-pipeline) — практический пример
