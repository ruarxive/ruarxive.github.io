---
title: Что появилось и что уходит
sidebar_label: Новое и уходящее
description: "Срез инструментов веб-архивации на октябрь 2026 года: чем закрывать новые задачи и какие программы в этой базе помечены как архивные."
last_update:
  date: 2026-10-29
keywords: [ландшафт, инструменты, 2026, устаревшее]
---

# Что появилось и что уходит

Короткий указатель по страницам базы на октябрь 2026 года. Полная карта — [ландшафт веб-архивации](/kb/instruments/landscape-2026). Здесь только развилка «брать в новый проект» и «не копировать старый рецепт».

## Брать в новый проект

| Задача | Страница |
|---|---|
| Сайт с JavaScript, коллекция WACZ | [Browsertrix](/kb/instruments/tools/browsertrix) |
| Один адрес со сводкой и подписью WACZ | [Scoop](/kb/instruments/tools/scoop) |
| Свой плеер на сервере | [pywb](/kb/instruments/replay/pywb) |
| Открыть WACZ в браузере | [ReplayWeb.page](/kb/instruments/replay/replayweb-page) |
| Программный доступ к Wayback Machine | [Wayback API](/kb/instruments/tools/wayback-api), [waybackpy](/kb/instruments/tools/waybackpy) |
| Найти чужой снимок сразу в нескольких архивах | [PastPage](/kb/instruments/tools/pastpage), [Memento](/kb/instruments/replay/memento) |
| Разобрать WARC запросами | [DuckDB-warc](/kb/instruments/tools/duckdb-warc), [metawarc](/kb/instruments/ruarxive-tools/metawarc) |
| Проверить файл WARC | [Warchaeology](/kb/instruments/tools/warchaeology) |
| Очередь ссылок для расследования | [Auto-Archiver](/kb/instruments/tools/auto-archiver) |
| Telegram | [tdl](/kb/instruments/tools/tdl) и [экспорт Desktop](/kb/instruments/data-take-out/dto-telegram) |
| Видео | [yt-dlp](/kb/instruments/tools/yt-dlp) |

## Не ставить в новый проект

Подробности и даты — на страницах. Сводка закрытых API, площадок и инструментов — в статье [«Закрытые API, площадки и инструменты»](/kb/instruments/social-media/dead-platforms).

- **Crocoite** — репозиторий архивирован в 2021 году. Замена: Browsertrix.
- **OpenWayback** — для новых установок не рекомендуется. Замена: pywb.
- **Conifer** — с мая 2026 года работает только на чтение, новые захваты не принимаются.
- **WAIL** — оболочка вокруг Heritrix и OpenWayback. Имеет смысл для уже собранных коллекций и для обучения, не как стек Ruarxive.
- **Social Feed Manager**, **F(b)arc** — не развиваются.
- **tgarc** — не менялся с декабря 2023 года. Замена для новых выгрузок: tdl и экспорт Desktop.
- **Shine** — прототип в архиве с 2020 года.

## Как страница устареет

Статус репозитория проверяется по дате последнего выпуска и по пометке Archived на GitHub, а не по тому, что пакет ещё ставится. Если команда со страницы падает, смотрите `last_update` в шапке и раздел «когда не использовать», прежде чем искать обход.

## Связанные материалы

- [Ландшафт веб-архивации, 2026](/kb/instruments/landscape-2026)
- [Программы и утилиты](/kb/instruments/tools)
- [Сравнения](/kb/resources/comparisons)
