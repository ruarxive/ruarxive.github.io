---
title: Заголовки WARC без тел записей
sidebar_label: Только заголовки
sidebar_position: 10
description: "Как снять с WARC опись записей — тип, URL, дату, статус и MIME — не сохраняя тела страниц на диск."
last_update:
  date: 2026-10-14
keywords: [warc, warcio, заголовки, аудит, cdx]
---

# Заголовки WARC без тел записей

Перед тем как выгружать страницы или медиа, полезно понять состав архива: сколько ответов, какие типы файлов, есть ли ошибки. Для этого достаточно заголовков.

`warcio index` пишет по одной JSON-строке на запись. Тела в этот файл не попадают:

```bash
pip install warcio

warcio index -f warc-type,warc-target-uri,warc-date,http:status,http:content-type,content-length \
  archive.warc.gz > headers.jsonl
```

Пример строки:

```json
{"warc-type": "response", "warc-target-uri": "https://example.com/about", "warc-date": "2026-06-01T12:00:05Z", "http:status": "200", "http:content-type": "text/html; charset=utf-8", "content-length": "184"}
```

Сводка по кодам ответа:

```bash
jq -r 'select(."warc-type" == "response") | (."http:status" // "none")' headers.jsonl \
  | sort | uniq -c | sort -rn
```

Сводка по MIME-типу:

```bash
jq -r 'select(."warc-type" == "response") | ((."http:content-type" // "unknown") | split(";")[0])' headers.jsonl \
  | sort | uniq -c | sort -rn
```

Тот же список URL и типов даёт [warchaeology](/kb/instruments/tools/warchaeology), если установлен бинарник `warc`:

```bash
warc ls -t response archive.warc.gz
```

## Что это не ускоряет

`warcio index` всё равно читает gzip-поток целиком: заголовок следующей записи лежит после тела предыдущей. Выигрыш в том, что на диск не пишутся страницы и картинки, а повторные вопросы задаются уже файлу `headers.jsonl`.

Если индекс CDX или CDXJ уже есть, для описи он быстрее: его можно `grep`-ать, не открывая WARC. См. [поиск по CDX](/kb/users/cdx-howto).

Поле `content-length` в выводе выше — длина блока WARC-записи (HTTP-заголовки вместе с телом), а не размер «чистой» страницы. Для оценки места этого достаточно; для точного размера файла после распаковки смотрите выгрузку.

## Когда описи хватает

- Проверить, что сбор не состоит из одних ответов 403 и 404.
- Оценить долю HTML, PDF и изображений до выгрузки медиа.
- Составить список адресов для цитирования, не распаковывая архив.

Дальше по этой описи выбирают шаг: [поиск фразы](/kb/users/search-inside-warc), [выгрузка медиа](/kb/users/extract-media-from-warc) или [фильтрация](/kb/guides/warc-filtering) в меньший WARC.

## Связанные материалы

- [«Вскрытие» WARC](/kb/users/inspect-warc)
- [Формат WARC](/kb/instruments/file-formats/warc)
- [Большие WARC](/kb/users/large-warc)
