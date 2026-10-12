---
title: CDX Summary
sidebar_label: CDX Summary
description: "CDX Summary (cdxsummary) — утилита Internet Archive на Python для сводной статистики по CDX-индексам: число захватов, MIME-типы и коды ответа, распределение по годам, топ хостов."
last_update:
  date: 2026-10-12
keywords: [cdx, cdx-summary, cdxsummary, internet archive, обзор архива]
---

# CDX Summary

[CDX Summary](https://github.com/internetarchive/cdx-summary) (`cdxsummary`) — утилита командной строки на Python от Internet Archive, которая строит человекочитаемую сводку по CDX-файлу: что находится в коллекции WARC, за какой период, какие типы данных и хосты преобладают. Лицензия — AGPL-3.0.

> CDX (и его вариант CDXJ) — формат индекса веб-архива: каждая строка описывает один захват (URL, время, MIME-тип, HTTP-статус, контрольная сумма, расположение записи в WARC). Такие индексы строят Wayback Machine, [pywb](/kb/instruments/replay/pywb), OpenWayback и другие системы. Подробнее — на странице [CDX](/kb/instruments/file-formats/cdx).

## Что входит в сводку

- обзор: число захватов, уникальных URL и хостов, суммарный размер WARC-записей, даты первого и последнего захвата;
- таблица «MIME-тип × класс HTTP-статуса» (2XX, 3XX, 4XX, 5XX, прочее, включая revisit-записи);
- распределение по длине пути и числу параметров запроса;
- распределение по годам и месяцам;
- топ хостов по числу захватов (по умолчанию 10);
- случайная выборка ссылок на мементо — успешные HTML-страницы в Wayback Machine.

Вывод — текстовые таблицы или JSON (`--json` — сводка, `--report` — подробный отчёт).

## Когда использовать

✅ Подходит, если:

- нужно быстро понять, **что находится в большой коллекции** WARC, имея её CDX-индекс;
- нужно оценить, **как хорошо домен сохранён в Wayback Machine** по годам;
- нужна сводка по item в Internet Archive (Petabox) для отчёта или решения «брать/не брать» в работу.

❌ Не подходит:

- для просмотра отдельных захватов страницы — используйте [Wayback CDX API](/kb/instruments/tools/wayback-api) напрямую;
- для очень крупных доменов через CDX API: запрос с `matchType=domain` скачивает все страницы выдачи последовательно и может идти часами.

## Источники данных

- локальный CDX-файл (без сжатия, `gz` или `bz2`) или CDX по HTTP-ссылке;
- поток CDX через `STDIN`;
- item Internet Archive (`-i`); для закрытых item используется авторизация утилиты [`ia`](/kb/instruments/tools/internet-archive-cli);
- запрос к Wayback CDX Server API (`-a`);
- ранее сохранённый JSON-отчёт (`-l`).

## Установка

```bash
pip install cdxsummary
```

Также можно собрать Docker-образ из репозитория (`docker image build -t cdxsummary .`).

> Команды сверены с README и `cdxsummary --help` версии 0.1.1b5 (октябрь 2026).

## Использование

```bash
# Сводка по локальному CDX-файлу
cdxsummary sample.cdx.gz

# То же в формате JSON, с записью в файл
cdxsummary --json --out summary.json sample.cdx.gz

# Сводка по захватам главной страницы сайта в Wayback Machine с 2022 года
cdxsummary --api 'matchType=exact&from=2022' ruarxive.org

# Сводка по item Internet Archive
cdxsummary --item IDENTIFIER

# Топ-20 хостов и 5 примеров мементо
cdxsummary -t 20 -s 5 sample.cdx.gz
```

Для `--api` последний аргумент — это URL, а значение опции — параметры CDX API (по умолчанию `matchType=exact`).

Если нужен только сырой список захватов, достаточно запроса к CDX API:

```bash
curl "https://web.archive.org/cdx/search/cdx?url=kremlin.ru&limit=10&output=json"
```

## Совместное использование с собственными архивами

`cdxsummary` работает с CDX-файлами в стандартном формате, поэтому его можно применять и к индексам собственных коллекций, а не только к данным Internet Archive. Совместимость с форматом CDXJ (его используют, например, [pywb](/kb/instruments/replay/pywb) и WACZ) не проверялась.

## Связанные материалы

- **[Wayback CDX API](/kb/instruments/tools/wayback-api)** — низкоуровневый доступ к CDX-индексам.
- **[Internet Archive](/kb/similar/internet-archive)** — описание работы Wayback Machine.

## Источник

- [Публикация в Telegram-канале Ruarxive #61 (29.06.2022)](https://t.me/ruarxive/61) — обзор инструментов для работы с веб-архивами (metawarc, CDX Summary, SolrWayback).
