---
title: Поиск по содержимому WARC
sidebar_label: Поиск внутри WARC
sidebar_position: 7
description: "Как искать фразу в веб-архиве: по URL в CDX, по тексту выгруженных HTML и по каталогу metawarc. Чем поиск по индексу отличается от полнотекстового."
last_update:
  date: 2026-10-14
keywords: [warc, поиск, ripgrep, metawarc, cdx]
---

# Поиск по содержимому WARC

В WARC нет встроенного поиска по тексту страниц. Сначала выбирают, что именно нужно найти: адрес, фразу на странице или подборку по всей коллекции.

## Адрес или кусок URL

Это самый быстрый путь, и он не требует чтения тел записей.

```bash
pip install warcio

warcio index -f warc-type,warc-target-uri archive.warc.gz \
  | jq -r 'select(."warc-type" == "response") | ."warc-target-uri"' \
  | grep -F '/news/' \
  | sort -u
```

Если CDX уже опубликован, WARC можно не открывать. Как это сделать на архиве «Эха Москвы» — в статье [«Как найти страницу по CDX»](/kb/users/cdx-howto).

## Фраза на страницах

Сначала HTML-ответы выгружаются в каталог, рядом пишется таблица «имя файла → исходный URL». Скрипт ниже использует только [warcio](https://github.com/webrecorder/warcio):

```python
import shutil
from pathlib import Path
from warcio.archiveiterator import ArchiveIterator

Path("html").mkdir(exist_ok=True)
i = 0
with open("archive.warc.gz", "rb") as stream, \
     open("html/index.tsv", "w", encoding="utf-8") as idx:
    for record in ArchiveIterator(stream):
        if record.rec_type != "response" or not record.http_headers:
            continue
        if record.http_headers.get_statuscode() != "200":
            continue
        if not record.http_headers.get_header("Content-Type", "").startswith("text/html"):
            continue
        name = f"{i:06d}.html"
        with open(Path("html") / name, "wb") as out:
            shutil.copyfileobj(record.content_stream(), out)
        url = record.rec_headers.get_header("WARC-Target-URI")
        idx.write(f"{name}\t{url}\n")
        i += 1
```

Дальше ищет обычный текстовый поиск. `rg` (ripgrep) показывает файлы, а таблица возвращает адреса:

```bash
rg -l "бюджет" html/
rg -l "бюджет" html/ | sed 's#.*/##' | grep -F -f - html/index.tsv
```

В выборку попадает и меню, и подвал, и текст статьи. Чтобы оставить основной текст, прогоните каталог `html/` через [извлечение текста](/kb/guides/text-extraction-from-warc).

На архиве в десятки гигабайт выгрузка всех HTML занимает столько же места, сколько весят эти страницы в распакованном виде. Для «Эха Москвы» отдельно опубликован меньший слепок только из HTML: [echo.msk.ru_html.zip](https://cdn.ruarxive.org/public/webcollect2022/media2022/echo.msk.ru_html/echo.msk.ru_html.zip) (77 169 записей в каталоге ZIP на 13.10.2026). Его можно распаковать и искать `rg` прямо по файлам, без WARC.

## Поиск по уже проиндексированной коллекции

[metawarc](/kb/instruments/ruarxive-tools/metawarc) один раз извлекает текст и потом ищет фразу по каталогу:

```bash
metawarc index 'archives/**/*.warc*' --dbfile collection.db --resume
metawarc index-content --dbfile collection.db --text
metawarc search "бюджет" --dbfile collection.db
```

Поиск metawarc идёт по столбцу текстов в DuckDB, а не по отдельному полнотекстовому индексу: на очень больших коллекциях он медленный. Для исследовательского интерфейса с фасетами есть [SolrWayback](/kb/instruments/tools/solrwayback).

ReplayWeb.page ищет по URL сразу. Полнотекстовый поиск в плеере появляется у WACZ, в который текст уже извлечён. Подробнее — [ReplayWeb.page](/kb/instruments/replay/replayweb-page).

## Что выбрать

| Вопрос | Инструмент |
|---|---|
| Есть ли этот URL? | CDX или `warcio index` |
| В каких страницах встречается фраза? | Выгрузка HTML и `rg`, либо `metawarc search` |
| Нужны меню и вёрстка вместе с текстом | Выгрузка HTML |
| Нужен только текст статьи | [trafilatura](/kb/guides/text-extraction-from-warc) или `metawarc index-content --text` |

## Связанные материалы

- [«Вскрытие» WARC](/kb/users/inspect-warc)
- [Как найти страницу по CDX](/kb/users/cdx-howto)
- [Извлечение текста из WARC](/kb/guides/text-extraction-from-warc)
- [metawarc](/kb/instruments/ruarxive-tools/metawarc)
