---
title: metawarc
sidebar_label: metawarc
description: "Индексация, поиск, извлечение метаданных и анализ WARC-коллекций на DuckDB + Parquet; REST API, MCP-сервер, локальный веб-replay"
---

# metawarc (WARC)

**metawarc** — инструмент, разработанный командой Ruarxive, для работы с уже собранными WARC-коллекциями. В отличие от `tgarc`, `wparc`, `ydiskarc` и `filegetter`, которые **собирают** данные, metawarc занимается следующим этапом: **индексацией, поиском, извлечением метаданных и анализом** собранных архивов.

Репозиторий: [github.com/ruarxive/metawarc](https://github.com/ruarxive/metawarc) · Полная документация: [ruarxive.org/metawarc](https://ruarxive.org/metawarc/) · Лицензия: MIT · Язык: Python 3.10+

## Зачем нужен

Собранный WARC — это бинарный файл, в котором «спрятаны» ответы сервера, заголовки HTTP и тела ресурсов. Чтобы ответить на вопросы «сколько у нас PDF?», «что лежит на странице X?», «найти все документы со словом Y» — нужны специальные инструменты. metawarc решает эту задачу через **версионированный каталог DuckDB + Parquet-сайдкары**:

- **Исходные WARC** остаются неизменными (immutable).
- **Каталог** (`.db`) — лёгкий, переносимый, версионированный файл.
- **Parquet-сайдкары** хранят извлечённые метаданные, тексты, ссылки — рядом с `.db`, в каталоге `*.data/`.
- **Запросы** идут по каталогу, без копирования WARC.

## Ключевые возможности

| Возможность | Что делает |
| :--- | :--- |
| **`index`** | Индексирует WARC/WARC.GZ коллекции в DuckDB-каталог. Поддерживает `--resume`, `--dry-run`, инкрементальный режим. |
| **`ingest`** | Добавление новых архивов в существующий каталог. |
| **`doctor`** | Диагностика и восстановление каталога (создание резервной копии перед миграцией). |
| **`catalog` / `stats`** | Обзор содержимого коллекции, статистика по типам MIME. |
| **`list-files` / `dump` / `get`** | Запросы и выборочный экспорт payload-ов (PDF, изображения, и т.п.) с лимитами и SHA-256-манифестом. |
| **`index-content`** | Извлечение метаданных из PDF, изображений, Office Open XML, видео, аудио, шрифтов + полнотекстовая индексация (`--text`). |
| **`analyze`** | Сводки, хеши, дубликаты, целостность, анализ ссылок. |
| **`search`** | Поиск по фразе в извлечённых текстах (HTML / PDF / OOXML). |
| **`serve` / `replay`** | Локальный веб-replay заархивированных сайтов (HTML/CSS-rewrite, корректная работа с кириллицей). |
| **`mcp`** | MCP-сервер для AI-агентов: `list_archives`, `list_records`, `get_record_metadata`, `search_records`, и др. Read-only, без сырого SQL и путей файловой системы. |
| **`export-cdxj`** | Экспорт CDXJ-индекса для связки с `pywb` или другими replay-системами. |
| **`jobs`** | Долгоиграющие batch-задачи для экспорта результатов, не укладывающихся в HTTP-таймаут. |

## Версии и обновления

### 2025 (v2025.x) — DuckDB + Parquet, рекордное сжатие

В [Публикации #160 от 30.06.2025](https://t.me/ruarxive/160) анонсирована версия, в которой:

- Полная индексация коллекции из **нескольких терабайт WARC** сводится к каталогу
  **в сотни мегабайт**.
- Сообщается о сжатии **в 285 раз** на тестовых коллекциях.
- Извлечение метаданных PDF, изображений, OOXML, видео, аудио вынесено в единый
  модуль `index-content`.

Эта версия делает практически невозможное раньше: анализировать
**миллионы URL** в интерактивном режиме на ноутбуке.

### 2026 (v2.0) — локальный Wayback через pywb

В [Публикации #190 от 08.08.2026](https://t.me/ruarxive/190) представлена версия **2.0**,
добавляющая:

- Полноценный режим **`replay`** через [pywb](https://github.com/ikreymer/pywb):
  архив с навигацией по датам, как в Internet Archive.
- **CDXJ-экспорт** через `export-cdxj` — стандартный индекс для pywb, replayweb.page,
  britannica.
- Удобный **MCP-сервер** для AI-ассистентов (см. [metawarc-mcp](/kb/instruments/ruarxive-tools/metawarc-mcp)).

Это превращает `wparc → metawarc` из «просто индекса» в **локальный Wayback**: пользователь
получает обычные страницы с навигацией во времени, со ссылками между ними, с поиском.

> [!TIP]
> Если раньше вы думали: «у меня есть terabyte WARC, но искать в нём невозможно» — это
> уже не так. [`metawarc serve`](/kb/instruments/ruarxive-tools/metawarc-rest) поднимает
> веб-интерфейс за минуты, и в нём уже работает поиск и навигация по датам.

## Установка

```bash
# Базовый CLI
pip install metawarc

# С REST API и локальным веб-replay
pip install 'metawarc[api]'

# С MCP-сервером
pip install 'metawarc[mcp]'

# Всё вместе (REST + replay + MCP)
pip install 'metawarc[all]'
```

Требуется **Python 3.10 или новее**. Установка из исходников — см. [документацию](https://ruarxive.org/metawarc/getting-started/installation).

## Быстрый старт

```bash
# 1. Проиндексировать коллекцию WARC (resumable)
metawarc index 'archives/**/*.warc*' --dbfile collection.db --resume

# 2. Посмотреть, что попало в каталог
metawarc catalog --dbfile collection.db
metawarc stats --dbfile collection.db --mode mimes

# 3. Найти все PDF и выгрузить первые 100
metawarc list-files --dbfile collection.db --mimes application/pdf
metawarc dump --dbfile collection.db --exts pdf --limit 100 --output exported

# 4. Запустить локальный веб-replay
metawarc serve --dbfile collection.db
# → http://127.0.0.1:8000/replay/<штамп>mp_/https://example.com/
```

## Архитектура (кратко)

- **Workspace** = `<dbfile>` + `<dbfile>.data/` каталог с Parquet-сайдкарами.
- **Schema v2** — стабильные ID архивов, версионированные сайдкары, атомарная публикация батчей.
- **Source WARC** — только для чтения; metawarc никогда не модифицирует исходные архивы.
- **Typed queries** — все запросы идут через allowlist-поля и bound-параметры; сырой SQL доступен только явно через CLI-флаг `--unsafe-where` и **не** экспонируется в REST/MCP.

Подробнее — в разделе [Architecture документации](https://ruarxive.org/metawarc/architecture/workspace).

## Поддерживаемые форматы для извлечения метаданных

- **Документы**: PDF, Office Open XML (DOCX, XLSX, PPTX, включая макро-включённые).
- **Изображения**: JPEG, PNG, GIF, SVG, WebP, TIFF, HEIC и др.
- **Видео**: MP4/QuickTime, AVI, WebM/Matroska, Ogg, MPEG, ASF/WMV, FLV.
- **Аудио**: MP3, WAV, AIFF, FLAC, Ogg/Opus, M4A, WMA, MIDI, RealAudio.
- **Шрифты**: TTF, OTF, WOFF, WOFF2, EOT, коллекции шрифтов.
- **Ссылки**: извлечение `<a href>` из HTML.

## Когда использовать metawarc

✅ Подходит, если у вас уже есть **WARC-коллекция** (собранная `tgarc`, `wparc`, `wpull`, `wget`, `browsertrix` или `heritrix`), и нужно:

- узнать, что внутри (типы, объёмы, домены);
- извлечь метаданные PDF/изображений/документов;
- искать фразу по извлечённому тексту;
- выгрузить подмножество файлов (например, все PDF по домену);
- поднять локальный веб-replay без pywb/OpenWayback;
- отдать безопасный read-only API для дашбордов или агентов.

❌ Не замена сборщикам: для **сбора** WARC используйте [wparc](./wparc), [tgarc](./tgarc), [ydiskarc](./ydiskarc), [filegetter](./filegetter) или сторонние кроулеры — см. [Инструменты сбора](/kb/instruments/tools).

## Сравнение с похожими инструментами

| Инструмент | Назначение | Отличие от metawarc |
| :--- | :--- | :--- |
| **[warcio](https://github.com/webrecorder/warcio)** | Python-библиотека чтения/записи WARC | metawarc строит **готовый к запросам каталог** с Parquet-сайдкарами; warcio требует писать скрипты. |
| **[warctools](https://github.com/internetarchive/warctools)** | CLI-утилиты (warcvalid, warcdump) | metawarc даёт **типизированный query** и REST/MCP-поверхность. |
| **[Archives Unleashed](https://archivesunleashed.org)** | Анализ WARC через Spark | metawarc работает на одном узле без Spark; быстрее развернуть. |
| **[pywb](https://github.com/webrecorder/pywb)** | Воспроизведение веб-архивов | metawarc имеет встроенный лёгкий replay и умеет экспортировать CDXJ для pywb. |
| **[WARC-processing](/kb/instruments/tools/warc-processing)** (страница БЗ) | Каталог WARC-библиотек | metawarc — готовый инструмент, а не справочник. |

## Ограничения

- **Не сборщик**: metawarc работает поверх уже существующих WARC.
- **Python 3.10+** (на старых версиях не запустится).
- **MCP-сервер** read-only: не даёт инструментов для удаления, изменения и сырого SQL.
- **Replay** — локальный, без JS-rewriting (для полноценного Wombat-режима экспортируйте CDXJ и используйте [pywb](/kb/instruments/replay/pywb)).
- **Большие коллекции** (>10M страниц) — на одном узле возможны, но требуют быстрого диска под DuckDB-каталог и Parquet.

## Полезные ссылки

- 📘 [Полная документация metawarc](https://ruarxive.org/metawarc/) — установка, CLI-референс, cookbook, архитектура.
- 🧾 [CLI-референс](https://ruarxive.org/metawarc/commands/) — все команды с флагами.
- 🍳 [Cookbook](https://ruarxive.org/metawarc/getting-started/cookbook) — задачи по ролям (архивист, исследователь, агент).
- 🤖 [MCP-сервер для AI-агентов](./metawarc-mcp) — подробная страница по интеграции с Claude/Cursor/Continue (эта страница БЗ).
- 🛠 [CHANGELOG](https://github.com/ruarxive/metawarc/blob/master/CHANGELOG.md) — история релизов.
- 🔐 [SECURITY](https://github.com/ruarxive/metawarc/blob/master/SECURITY.md) — модель угроз и рекомендации.

## Связанные материалы

- [Формат WARC](/kb/instruments/file-formats/warc) — структура файла и типы записей.
- [Обработка WARC](/kb/instruments/tools/warc-processing) — каталог Python/Java/Go/Rust-библиотек.
- [WARC-инфраструктура](/kb/instruments/tools) — все инструменты раздела.
- [wparc](./wparc), [tgarc](./tgarc), [ydiskarc](./ydiskarc), [filegetter](./filegetter) — сборщики Ruarxive.
- [Все инструменты Ruarxive](/kb/instruments/ruarxive-tools)
- [metawarc MCP-сервер](./metawarc-mcp) — для AI-агентов.
- [metawarc REST API](./metawarc-rest) — для интеграций.
- [metawarc cookbook](./metawarc-cookbook) — практические рецепты.
- [metawarc extractors (plugin API)](./metawarc-extractors) — кастомные экстракторы.

---

# Расширенные разделы

## Конфигурация через переменные окружения

metawarc читает настройки из переменных окружения (префикс `METAWARC_`):

| Переменная | Значение по умолчанию | Зачем |
|:---|:---|:---|
| `METAWARC_BEARER_TOKEN` | unset | Bearer-token для REST/MCP. Если не задан — анонимный доступ (только localhost). |
| `METAWARC_LIMIT_MAX_RECORDS` | 500 | Максимум записей в `/records/list` |
| `METAWARC_SEARCH_MAX` | 100 | Максимум результатов в `/records/search` |
| `METAWARC_JOB_MAX_CONCURRENT` | 4 | Параллельных batch-job'ов |
| `METAWARC_JOB_TIMEOUT` | 300 с | Таймаут одного job'а |
| `METAWARC_PAYLOAD_MAX` | 100 МБ | Максимальный payload в `/records/get/data` |
| `METAWARC_INDEX_WORKERS` | 1 | Параллельных потоков индексирования |
| `METAWARC_INDEX_BATCH` | 10000 | Размер батча для `/records` |
| `METAWARC_EXTRACTION_TIMEOUT` | 60 с | Таймаут одного экстрактора на одну запись |

### Примеры

```bash
# Production — параллельно + с таймаутами
export METAWARC_JOB_MAX_CONCURRENT=8
export METAWARC_JOB_TIMEOUT=3600
export METAWARC_INDEX_WORKERS=4

# Высокая нагрузка — увеличить лимиты
export METAWARC_LIMIT_MAX_RECORDS=1000
export METAWARC_PAYLOAD_MAX=500M

# Защита — уменьшить
export METAWARC_PAYLOAD_MAX=50M
export METAWARC_JOB_TIMEOUT=60

# Запуск
metawarc serve --dbfile collection.db
```

## Флаг `--unsafe-where`

По умолчанию metawarc запрещает сырой SQL в запросах. Это безопасно, но иногда нужно сделать ad-hoc-аналитику в ноутбуке.

```bash
# Безопасно: bound параметры
metawarc list-records --dbfile collection.db --mimes text/html --limit 100

# ❌ ОПАСНО: прямой SQL — может привести к эксфильтрации или DoS
metawarc list-records --dbfile collection.db --unsafe-where "raw_sql_here"
```

**Когда использовать:**

- ✅ Локальный анализ в Jupyter с локальной БД.
- ✅ Исследовательские запросы, которые не влезают в allowlist.
- ❌ **Никогда** на production-сервере.
- ❌ **Никогда** через REST/MCP-эндпойнт (не экспонируется вообще).

Подробности — в [CHANGELOG безопасности](https://github.com/ruarxive/metawarc/blob/master/SECURITY.md).

## Команда `dump` — форматы выгрузки

`metawarc dump` поддерживает три выходных формата:

### CSV (по умолчанию)

```bash
metawarc dump --dbfile collection.db \
  --exts pdf --mime application/pdf \
  --limit 100 \
  --output ./exported-files \
  --format csv
```

В `./exported-files/`:

- `data.csv` — манифест с метаданными.
- `*.pdf` — скачанные файлы.
- `manifest.sha256` — SHA-256 каждого файла.

### JSON Lines

```bash
metawarc dump --dbfile collection.db \
  --exts jpg,png \
  --format jsonl \
  --output ./exported-images
```

Каждая строка — JSON с записью из архива + payload в base64:

```jsonl
{"record_id":"rec_1","url":"https://...","mime":"image/jpeg","length":12345,"data":"<base64>"}
```

### Parquet (для аналитики)

```bash
metawarc dump --dbfile collection.db \
  --mimes application/pdf \
  --format parquet \
  --output ./analytics-export
```

Выход:

```
analytics-export/
└── data-00000.parquet
└── data-00001.parquet
└── _metadata  # метаданные Parquet
```

Parquet — columnar-формат; быстро анализируется в DuckDB, Spark, Pandas.

## Replay — детали

Команда `metawarc serve` запускает встроенный replay на `/replay/...`.

### URL-формат

```
GET /replay/<штамп>mp_/<URL>
```

Где `<штамп>`:

| Значение | Что показывает |
|:---|:---|
| `20260315102345` | Конкретный момент |
| `202603*` | Все снимки за март 2026 |
| `*-` | Все снимки (острожно) |
| (пусто) | Ближайший снимок к текущему моменту |

Пример:

```
http://127.0.0.1:8000/replay/20260315102345mp_/https://example.com/news/article
```

### Что rewrites

Replay вносит следующие правки в HTML/JS для правильного воспроизведения:

- **Ссылки** — все `<a href>`, `<img src>`, `<script src>`, CSS `url()` перенаправлены на локальный replay.
- **Редиректы** — заменены на `meta refresh` или JS-редирект на replay-аналог.
- **Post-кнопки и формы** — `action` атрибуты переписаны.
- **Кириллица в URL** — корректно сериализуется, не ломается при редиректах.

### Что НЕ поддерживается

- ❌ Полная JS-rewriting (как Wombat в pywb): если страница генерирует URL через JavaScript после загрузки, они могут не пройти через rewrite.
- ❌ WebSocket-соединения.
- ❌ Видео-стримы и live-эфиры.
- ❌ Cookies в браузере через Replay — изоляция между страницами не идеальна.

Для полноценного Wombat-style replay — экспортируйте CDXJ и поднимите [pywb](/kb/instruments/replay/pywb).

### Защита от перегрузки

При большом числе снимков и большом размере страниц — replay может стать медленным. Включите кэш:

```bash
# Через nginx (loopback перед metawarc)
location /replay/ {
    proxy_pass http://127.0.0.1:8000;
    proxy_cache_valid 200 1d;
    proxy_cache replay_zone;
    add_header X-Cache-Status $upstream_cache_status;
}
```

## Job subsystem — детали

`metawarc jobs` — долгоиграющие batch-задачи, результаты которых не помещаются в обычный HTTP-запрос.

### Виды задач (на ноябрь 2026)

- `export-records` — выгрузка подмножества записей.
- `export-cdxj` — генерация CDXJ для [pywb](/kb/instruments/replay/pywb).
- `index-content` — извлечение метаданных из payload-ов.

### CLI

```bash
# Submit
metawarc jobs submit export-records --format csv \
  --filter '{"mime":"application/pdf","limit":5000}' \
  --dbfile collection.db

# Список
metawarc jobs list --dbfile collection.db --status completed

# Статус
metawarc jobs get job_xyz789 --dbfile collection.db

# Ждать завершения (long-polling)
metawarc jobs wait job_xyz789 --poll 2 --timeout 600

# Отменить
metawarc jobs cancel job_xyz789 --dbfile collection.db
```

### Жизненный цикл

```
[pending] → [running] → [completed]
                ↓
            [failed] / [cancelled]
```

Job остаётся после завершения — можно посмотреть результат или повторить выгрузку.

### Состояние и лимиты

```bash
# Конкурентность: сколько job'ов одновременно
export METAWARC_JOB_MAX_CONCURRENT=8

# Таймаут job'а
export METAWARC_JOB_TIMEOUT=3600

# Состояние job'ов переживает рестарт metawarc
# Хранится в <dbfile>.data/jobs/<job_id>/state.json
```

### Когда использовать job'ы

✅ Подходит:

- **Массовая выгрузка** (тысячи записей, минуты-часы).
- **ETL в ClickHouse / PostgreSQL / S3**.
- **CDXJ-индексация** для pywb.
- **Любые операции**, не влезающие в 30 с.

❌ Не подходит:

- **Одиночная запись** — через `/records/get/data`.
- **Аналитика в реальном времени** — нужен DuckDB-WARC.
- **Когда REST'у нужно немедленно ответить**.

## Как выбрать интерфейс: REST vs MCP vs CLI

| Критерий | CLI | REST | MCP | Прямой SQL |
|:---|:-:|:-:|:-:|:-:|
| **Цель** | Скрипты, CI/CD | Дашборды, ETL | AI-агенты | Исследования |
| **Аутентификация** | - | Bearer-token | stdio / loopback | - |
| **Real-time** | ❌ | ⚠️ | ❌ | ✅ |
| **Долгие операции** | job'ы | job'ы | read-only | free-form |
| **Безопасность** | ✅ | ⚠️ нужен bearer | ✅ (read-only) | ✅ только локально |
| **Когда выбирать** | Любой сценарий | Web-интеграция | AI-агент | Ноутбук, ad-hoc |

**Рекомендация команды Ruarxive:**

1. **Скрипты автоматизации** → CLI.
2. **Web-дашборды** → REST за reverse proxy.
3. **AI-агенты** → MCP.
4. **Аналитика в Jupyter** → прямой SQL через DuckDB.
5. **Долгие выгрузки** → jobs (через CLI или REST).

## Совместимость и миграция Schema v2

Schema v2 — стабильная с 2025 года. Если у вас каталог **до Schema v2**, `metawarc doctor --auto-migrate` автоматически выполнит миграцию с резервной копией.

```bash
metawarc doctor collection.db
# Если нужна миграция:
metawarc doctor collection.db --auto-migrate --backup-dir /var/backups/metawarc/
```

Резервная копия переименовывается в `collection.db.v1-backup-<timestamp>`. Подробнее — [документация по миграции](https://ruarxive.org/metawarc/operations/migration).

## Что НЕ документировано здесь

- Подробный CLI-референс с **полным списком флагов** для каждой команды — [ruarxive.org/metawarc/commands](https://ruarxive.org/metawarc/commands/).
- Полная OpenAPI-схема REST API — `/docs` в работающем сервере.
- Cookbook для разработчиков metawarc — [ruarxive.org/metawarc/development](https://ruarxive.org/metawarc/development).
