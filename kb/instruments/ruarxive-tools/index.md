---
title: Инструменты Ruarxive
description: "Обзор инструментов с открытым кодом, которые разрабатывает команда Ruarxive: сборщики данных (wparc, ydiskarc, filegetter, apibackuper, spcrawler, tgarc) и metawarc для анализа WARC."
sidebar_position: 1
last_update:
  date: 2026-10-12
---

# Инструменты Ruarxive

Инструменты с открытым кодом, которые разрабатывает и поддерживает команда Ruarxive. Все они опубликованы на [github.com/ruarxive](https://github.com/ruarxive) под свободными лицензиями (MIT, Apache-2.0, у tgarc — CC0).

## Обзор по стадиям архивации

### 1. Сбор

Инструменты, которые **скачивают** данные и файлы.

| Инструмент | Что архивирует | Состояние |
| :--- | :--- | :--- |
| **[wparc](/kb/instruments/ruarxive-tools/wparc)** | Данные сайтов на WordPress через REST API `/wp-json/` | PyPI 1.0.8, в GitHub 1.0.9 |
| **[ydiskarc](/kb/instruments/ruarxive-tools/ydiskarc)** | Публичные файлы и папки Яндекс.Диска | PyPI 1.1.0 |
| **[filegetter](/kb/instruments/ruarxive-tools/filegetter)** | Файлы по ссылкам из CSV, JSONL или списка | PyPI 1.1.0 |
| **[apibackuper](/kb/instruments/downloaded-data/apibackuper)** | Данные из постраничных REST API | PyPI 1.0.13 |
| **[spcrawler](/kb/instruments/downloaded-data/spcrawler)** | Метаданные публичных сайтов на SharePoint через `/_api/web` | PyPI 1.0.1 (2022), не развивается |
| **[tgarc](/kb/instruments/ruarxive-tools/tgarc)** | Сообщения и медиа каналов и чатов Telegram (JSONL) | Нет на PyPI, не развивается с 2023 года |

### 2. Обработка и анализ

| Инструмент | Что делает |
| :--- | :--- |
| **[metawarc](/kb/instruments/ruarxive-tools/metawarc)** | Индексирует WARC-коллекции в DuckDB + Parquet, извлекает метаданные PDF, OOXML и медиа, ищет по тексту, показывает сохранённые сайты (replay), даёт REST API и MCP-сервер. Сам WARC не создаёт |

Подробнее о metawarc: [REST API](/kb/instruments/ruarxive-tools/metawarc-rest), [MCP-сервер](/kb/instruments/ruarxive-tools/metawarc-mcp), [рецепты](/kb/instruments/ruarxive-tools/metawarc-cookbook), [экстракторы](/kb/instruments/ruarxive-tools/metawarc-extractors).

## Что когда использовать

| Задача | Инструмент |
| :--- | :--- |
| Выгрузить записи, страницы и медиа сайта на WordPress | **[wparc](/kb/instruments/ruarxive-tools/wparc)** |
| Скачать публичную папку с Яндекс.Диска | **[ydiskarc](/kb/instruments/ruarxive-tools/ydiskarc)** |
| Скачать файлы, ссылки на которые есть в наборе данных | **[filegetter](/kb/instruments/ruarxive-tools/filegetter)** |
| Сохранить данные из API с постраничной выдачей | **[apibackuper](/kb/instruments/downloaded-data/apibackuper)** |
| Сохранить Telegram-канал | Официальный [Data Take-Out](/kb/instruments/data-take-out/dto-telegram) или [tdl](/kb/instruments/tools/tdl); [tgarc](/kb/instruments/ruarxive-tools/tgarc) — только с учётом его статуса |
| Узнать, что внутри собранных WARC, и извлечь метаданные | **[metawarc](/kb/instruments/ruarxive-tools/metawarc)** |
| Найти фразу в тексте заархивированных HTML, PDF и OOXML | **[metawarc](/kb/instruments/ruarxive-tools/metawarc)** с `index-content --text` |
| Посмотреть сохранённый сайт локально | **[metawarc](/kb/instruments/ruarxive-tools/metawarc)** `serve` или [pywb](/kb/instruments/replay/pywb) |
| Дать доступ к коллекции дашборду или ИИ-агенту только на чтение | **[metawarc](/kb/instruments/ruarxive-tools/metawarc)** REST или MCP |

## Установка

Рекомендуется ставить каждый инструмент в отдельное виртуальное окружение (например, через `pipx`).

```bash
# Сборщики с PyPI
pip install wparc ydiskarc filegetter apibackuper

# tgarc на PyPI нет — только из GitHub
pip install git+https://github.com/AduchiMergen/tgarc.git

# metawarc: базовый CLI
pip install metawarc

# metawarc с REST API и replay / с MCP-сервером / со всеми интерфейсами
pip install 'metawarc[api]'
pip install 'metawarc[mcp]'
pip install 'metawarc[all]'
```

Исходный код:

- [github.com/ruarxive/wparc](https://github.com/ruarxive/wparc)
- [github.com/ruarxive/ydiskarc](https://github.com/ruarxive/ydiskarc)
- [github.com/ruarxive/filegetter](https://github.com/ruarxive/filegetter)
- [github.com/ruarxive/apibackuper](https://github.com/ruarxive/apibackuper)
- [github.com/ruarxive/spcrawler](https://github.com/ruarxive/spcrawler)
- [github.com/ruarxive/tgarc](https://github.com/ruarxive/tgarc)
- [github.com/ruarxive/metawarc](https://github.com/ruarxive/metawarc)

## Как устроены страницы раздела

1. **Что это** — назначение инструмента.
2. **Установка** — команды и версия, с которой сверялись примеры.
3. **Команды и примеры** — минимальный набор, чтобы получить результат.
4. **Формат результата** — что появится на диске.
5. **Ограничения** — чего инструмент не делает и какие есть известные проблемы.
6. **Связанные материалы**.

## Принципы

- **Открытый код** — все инструменты под свободными лицензиями.
- **Один инструмент — одна задача** — каждый решает узкий класс задач и стыкуется с остальными.
- **Повторный запуск без дублирования** — `filegetter` пропускает уже скачанные файлы, `wparc getfiles` ведёт список скачанного, `metawarc index --resume` продолжает прерванную индексацию.
- **Исходники неизменны** — `metawarc` не трогает исходные WARC; каталог и сайдкары можно удалить и пересобрать.
- **Документация рядом с кодом** — у metawarc и apibackuper есть собственные сайты: [ruarxive.org/metawarc](https://ruarxive.org/metawarc/) и [ruarxive.org/apibackuper](https://ruarxive.org/apibackuper/).

## Связанные разделы

- [Все инструменты (включая сторонние)](/kb/instruments)
- [Программы и утилиты](/kb/instruments/tools)
- [Загружаемые данные](/kb/instruments/downloaded-data) — apibackuper, его конфигурации и spcrawler
- [Социальные сети](/kb/instruments/social-media)
- [Справочник форматов](/kb/instruments/file-formats)
- [Гайды](/kb/guides)
- [Кейсы и истории](/kb/case-studies)
