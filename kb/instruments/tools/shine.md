---
title: Shine
sidebar_label: Shine
description: "Shine — архивный (с 2020 года) прототип исследовательского интерфейса UK Web Archive для поиска по веб-архиву на основе Solr. Историческая справка и актуальные альтернативы."
last_update:
  date: 2026-10-12
---

# Shine

:::warning Проект в архиве
Репозиторий [ukwa/shine](https://github.com/ukwa/shine) переведён в архив, последние изменения — июнь 2020 года. Рабочего публичного инстанса нет. Для полнотекстового поиска по своим WARC используйте [SolrWayback](solrwayback).
:::

**Shine** — прототип интерфейса для исследования веб-архивов, который сделали в UK Web Archive (Британская библиотека). По описанию в README, это «прототип UI для исследования веб-архивов на основе Solr». Индекс Solr наполнялся индексатором `warc-indexer` из проекта [ukwa/webarchive-discovery](https://github.com/ukwa/webarchive-discovery).

- Репозиторий: [github.com/ukwa/shine](https://github.com/ukwa/shine) (Apache-2.0, создан в 2013 году).
- Технологии: Java и Scala (Play Framework), JavaScript-интерфейс; позднее в репозиторий добавлены каталог `shine-react` и Docker-файлы.
- Бэкенд: Apache Solr с индексом от `warc-indexer`.

## Чем был интересен

Shine показывал исследователям веб-архив как набор данных, а не только как «машину времени»: полнотекстовый поиск по большой коллекции и раздел Trends с динамикой употребления терминов во времени. Публичная версия работала на `webarchive.org.uk/shine` с пометкой «исследовательский прототип сервиса поиска по веб-архиву, может быть отключён в любой момент». Её снимки 2015 года есть в [Wayback Machine](https://web.archive.org/web/20150315024100/http://www.webarchive.org.uk/shine).

Тот же подход — поиск по Solr-индексу, построенному `warc-indexer`, — использует активно развивающийся [SolrWayback](solrwayback) Королевской библиотеки Дании.

## Что использовать сейчас

| Задача | Инструмент |
| :--- | :--- |
| Полнотекстовый поиск по своим WARC, фасеты, графики | [SolrWayback](solrwayback) + `warc-indexer` |
| Воспроизведение без поиска | [pywb](/kb/instruments/replay/pywb), [ReplayWeb.page](/kb/instruments/replay/replayweb-page) |
| Аналитика и выборки по WARC | [DuckDB-WARC](duckdb-warc), [обработка WARC](warc-processing) |
| Вопросы к коллекции на естественном языке (эксперимент) | [WARC-GPT](warc-gpt) |

## Ресурсы

- [GitHub: ukwa/shine](https://github.com/ukwa/shine) — исходный код (архив).
- [GitHub: ukwa/webarchive-discovery](https://github.com/ukwa/webarchive-discovery) — `warc-indexer` для Solr.
- [UK Web Archive](https://www.webarchive.org.uk/)

## Связанные материалы

- **[SolrWayback](solrwayback)** — актуальный поиск по веб-архиву на Solr.
- **[pywb](/kb/instruments/replay/pywb)** — воспроизведение.
- **[Обработка WARC](warc-processing)** — инструменты для работы с WARC.
- **[Формат WARC](/kb/instruments/file-formats/warc)**
- **[Ландшафт 2026](/kb/instruments/landscape-2026)**
