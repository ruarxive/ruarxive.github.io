---
title: Загружаемые данные
sidebar_label: Загружаемые данные
sidebar_position: 1
description: "Утилиты Ruarxive для систематической выгрузки структурированных данных через API: apibackuper для постраничных REST API, готовые конфигурации к нему и spcrawler для публичных сайтов на SharePoint."
last_update:
  date: 2026-10-28
---

# Загружаемые данные

В этом разделе собраны утилиты, которые **систематически выгружают** структурированные данные через API: реестры, каталоги, порталы органов власти. В отличие от браузерных краулеров они работают с ответами API напрямую, поэтому архив получается компактным и машиночитаемым.

## Что внутри

*   **[apibackuper](/kb/instruments/downloaded-data/apibackuper)** — инструмент для резервного копирования REST API с постраничной выдачей (GET и POST). Режимы `full`, `continue` и `update`, продолжение с контрольной точки, хранение в ZIP, каталоге или SQLite, экспорт в JSONL, gzip, zstd и Parquet. Встроенного планировщика нет — регулярные запуски настраиваются через cron или CI.
*   **[Конфигурации apibackuper](/kb/instruments/downloaded-data/apibackuper-configs)** — реальные проекты: репозиторий `apibackuper-dataarchive` (проверки Счётной палаты, реестр удостоверяющих центров, ГИСП, формы ГВР, участки МВД, инициативы «Твой бюджет» Санкт-Петербурга) и примеры в самом репозитории apibackuper.
*   **[spcrawler](/kb/instruments/downloaded-data/spcrawler)** — утилита для выгрузки данных публичных сайтов на **Microsoft SharePoint** через API `/_api/web`. Не развивается с 2022 года.

## Когда использовать

Если у ресурса есть API, начинайте с него: так данные получаются полнее и в структурированном виде. Браузерная архивация ([Browsertrix](/kb/instruments/tools/browsertrix), [wget](/kb/instruments/tools/wget)) нужна, когда API нет, он сильно ограничен или важно сохранить вид страниц. Часто полезно и то и другое: данные через API и WARC с HTML-страницами.

Файлы, ссылки на которые есть в выгруженных данных, удобно скачивать [filegetter](/kb/instruments/ruarxive-tools/filegetter) или командой `apibackuper getfiles`.

## Связанные разделы

- [Инструменты Ruarxive](/kb/instruments/ruarxive-tools)
- [Консервированное государство](/kb/projects/preserved-government) — архивы госорганов, собранные в том числе этими инструментами.
- [Архивация крупномасштабных API](/kb/case-studies/api-archiving-scale)
