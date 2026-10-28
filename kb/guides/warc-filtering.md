---
title: Фильтрация WARC
sidebar_label: Фильтрация WARC
description: "Как оставить в WARC только нужные записи: HTML, ответы 200, один домен. Команды warcfilter и отбор скриптом на warcio."
last_update:
  date: 2026-10-28
keywords: [warc, warcfilter, warcio, фильтрация]
---

# Фильтрация WARC

Исходный WARC лучше не переписывать. Фильтр пишет новый, меньший файл, а полный архив остаётся как снятие. Так можно отдать коллеге только HTML или убрать заведомый шум перед индексацией.

## warcfilter: URL, тип записи, MIME

`warcfilter` из пакета warctools отбирает записи по регулярному выражению и пишет несжатый WARC в stdout. Флаги сверены со страницей [«Вскрытие» WARC](/kb/users/inspect-warc) (warctools 5.0.1):

| Флаг | Что сравнивает |
|---|---|
| `-U` | URL (`WARC-Target-URI`) |
| `-T` | тип записи (`response`, `request`, …) |
| `-C` | `Content-Type` самой WARC-записи |
| `-H` | `Content-Type` HTTP-ответа |
| `-D` | `WARC-Date` |
| `-i` | перевернуть условие |

Только ответы:

```bash
pip install warctools

warcfilter -T response archive.warc.gz > responses.warc
```

Только HTML-ответы одного хоста:

```bash
warcfilter -T response -H 'text/html' -U 'https://example\.com/' archive.warc.gz > pages.warc
```

`-U` и `-H` — регулярные выражения. Точку в домене экранируют: `example\.com`.

`warcfilter` пишет несжатый WARC. Не сжимайте его обычной командой `gzip`: она упакует файл одним потоком. Такой `.warc.gz` не открывается по смещениям из CDX, и с ним не работают pywb, `warcio index` и другие инструменты, которые читают записи по отдельности. WARC сжимают по записям — каждая запись отдельным gzip-блоком. Это делает `warcio recompress`:

```bash
pip install warcio

warcio recompress pages.warc pages.warc.gz
warcio index pages.warc.gz | head   # проверка: индекс строится без ошибок
```

`warcio recompress` исправляет и файл, который уже сжали целиком обычным `gzip`.

## Код ответа и свой список доменов

По коду HTTP `warcfilter` не отбирает. Ответы 200 и выбрасывание чужих хостов делает warcio. Список доменов, которые вы не хотите оставлять (счётчики, виджеты, чужие CDN), задаёте вы сами. Готового «полного списка трекеров» эта страница не прилагает: такой список устаревает, и чужой файл легко выкинет нужный ресурс.

```python
import re
from urllib.parse import urlsplit

from warcio.archiveiterator import ArchiveIterator
from warcio.warcwriter import WARCWriter

skip_hosts = {"example-tracker.test", "ads.example"}
host_re = re.compile(r"(^|\.)example\.com$")

with open("archive.warc.gz", "rb") as stream, open("filtered.warc.gz", "wb") as out:
    writer = WARCWriter(out, gzip=True)
    for record in ArchiveIterator(stream):
        if record.rec_type != "response" or not record.http_headers:
            continue
        if record.http_headers.get_statuscode() != "200":
            continue
        url = record.rec_headers.get_header("WARC-Target-URI") or ""
        host = (urlsplit(url).hostname or "").lower()
        if host in skip_hosts or not host_re.search(host):
            continue
        ctype = record.http_headers.get_header("Content-Type", "")
        if not ctype.startswith("text/html"):
            continue
        writer.write_record(record)
```

`write_record` сам дочитывает тело записи. Не вызывайте `content_stream().read()` до него: поток уже будет пуст, и в новый файл попадёт запись без содержимого. Проверьте результат на маленьком файле:

```bash
warcio check filtered.warc.gz
warcio index -f warc-target-uri,http:status,http:content-type filtered.warc.gz | head
```

## Что фильтр ломает, если не думать

- Плеер страницы просит CSS, картинки и скрипты. WARC из одного HTML откроется как текст, а не как сайт. Для просмотра оставляйте полный сбор, а фильтр используйте для поиска и выгрузки.
- Запись `warcinfo` описывает, каким инструментом снят архив. В отфильтрованном файле её уже нет, если вы оставили только `response`. В описании копии укажите, из какого исходного файла она сделана.
- Повторный фильтр не заменяет [дедупликацию](/kb/guides/warc-deduplication). Одинаковые тела с разными URL здесь останутся.

## Связанные материалы

- [«Вскрытие» WARC](/kb/users/inspect-warc)
- [Заголовки без тел](/kb/users/warc-headers-only)
- [Обработка WARC](/kb/instruments/tools/warc-processing)
- [WARC: от архива до публикации](/kb/guides/warc-workflow)
