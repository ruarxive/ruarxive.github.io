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
