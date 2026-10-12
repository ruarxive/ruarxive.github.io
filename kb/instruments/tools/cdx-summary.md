---
title: CDX Summary
sidebar_label: CDX Summary
description: "Анализ CDX-индексов Internet Archive — быстрый обзор покрытия и поиск по доменам."
last_updated: 2026-10-12
keywords: [cdx, cdx-summary, internet archive, обзор архива]
---

# CDX Summary

[CDX Summary](https://github.com/internetarchive/iaux-cdx-summary) — инструмент Internet Archive, который строит компактную статистику по CDX-индексам больших коллекций: какие хосты, сколько URL, сколько 2xx/3xx/4xx/5xx, распределение по годам, «мертвые» домены.

> CDX (Capture Index) — это собственный текстовый индекс Internet Archive, в котором каждая строка описывает один захваченный URL. Через CDX API можно узнать, какие версии страницы есть, а CDX Summary обобщает эти данные по доменам.

## Когда использовать

✅ Подходит, если:

- нужен быстрый обзор **обширной коллекции** Internet Archive (миллионы URL);
- хочется понять, какие домены **покрыты хорошо**, какие — плохо;
- нужно подготовить отчёт **спонсору или партнёру** о состоянии архива;
- нужна сводная статистика **для решения «брать/не брать»** домен в работу.

❌ Не подходит:

- для покадрового анализа отдельных страниц (используйте прямой [Wayback CDX API](https://github.com/internetarchive/wayback/tree/master/wayback-cdx-server));
- для не-Internet-Archive коллекций (CDX Summary работает только с IA CDX).

## Установка

Готового дистрибутива нет, но скрипт можно запустить локально через Node.js:

```bash
git clone https://github.com/internetarchive/iaux-cdx-summary.git
cd iaux-cdx-summary
npm install
```

## Использование

### Получить статистику по коллекции

```bash
node ./bin/ia-cdx-summary --domain "kremlin.ru" --year 2023
```

На выходе: список уникальных URL, количество скриншотов, статус-коды и количество «мёртвых» ответов.

### Скомандовать через Wayback CDX API

```bash
curl "http://web.archive.org/cdx/search/cdx?url=kremlin.ru&limit=10&output=json"
```

## Совмещение с собственными проектами

В скрипте используется тот же CDX-сервер, что и у Ruarxive — если вы ведёте локальный архив через [pywb](https://github.com/ikreymer/pywb) или [Browsertrix Crawler](/kb/instruments/tools/browsertrix), CDX Summary работает над «общим» CDX без изменений.

## Связанные материалы

- **[Wayback CDX API](/kb/instruments/tools/wayback-api)** — низкоуровневый доступ к CDX-индексам.
- **[Internet Archive](/kb/similar/internet-archive)** — описание работы Wayback Machine.

## Источник

- [Публикация в Telegram-канале Ruarxive #61 (29.06.2022)](https://t.me/ruarxive/61) — обзор WARC/CDX-инструментов.
