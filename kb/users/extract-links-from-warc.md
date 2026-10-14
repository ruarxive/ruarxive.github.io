---
title: Ссылки и карта сайта из WARC
sidebar_label: Ссылки из WARC
sidebar_position: 9
description: "Как из HTML-ответов в WARC собрать список ссылок, отличить внутренние адреса от внешних и получить карту сайта без повторного обхода."
last_update:
  date: 2026-10-14
keywords: [warc, ссылки, карта сайта, html]
---

# Ссылки и карта сайта из WARC

Краулер уже сходил по ссылкам один раз. Повторно обходить живой сайт не нужно: адреса лежат в HTML-ответах внутри WARC.

Скрипт читает ответы `text/html` со статусом 200, вытаскивает `href` и `src` и записывает пары «страница → ссылка». Относительные адреса собираются в абсолютные через `urljoin`.

```python
from html.parser import HTMLParser
from urllib.parse import urljoin, urlsplit

from warcio.archiveiterator import ArchiveIterator

class Links(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.found = []

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "a" and attrs.get("href"):
            self.found.append(attrs["href"])
        elif tag in {"img", "script", "source", "iframe"} and attrs.get("src"):
            self.found.append(attrs["src"])
        elif tag == "link" and attrs.get("href"):
            self.found.append(attrs["href"])

def host_of(url):
    return (urlsplit(url).hostname or "").lower().removeprefix("www.")

rows = []
with open("archive.warc.gz", "rb") as stream:
    for record in ArchiveIterator(stream):
        if record.rec_type != "response" or not record.http_headers:
            continue
        if record.http_headers.get_statuscode() != "200":
            continue
        if not record.http_headers.get_header("Content-Type", "").startswith("text/html"):
            continue
        page = record.rec_headers.get_header("WARC-Target-URI") or ""
        parser = Links()
        raw = record.content_stream().read()
        try:
            parser.feed(raw.decode("utf-8", errors="replace"))
        except Exception:
            continue
        for href in parser.found:
            if href.startswith(("#", "javascript:", "mailto:", "data:")):
                continue
            target = urljoin(page, href)
            rows.append((page, target))

with open("links.tsv", "w", encoding="utf-8") as out:
    out.write("from\tto\n")
    for page, target in rows:
        out.write(f"{page}\t{target}\n")

print(f"Ссылок: {len(rows)}")
```

Дальше внутренние и внешние адреса разделяются по имени хоста страницы:

```python
internal = []
external = []
for page, target in rows:
    page_host = host_of(page)
    target_host = host_of(target)
    if target_host == page_host or target_host.endswith("." + page_host):
        internal.append(target)
    else:
        external.append(target)

print(f"Внутренних: {len(set(internal))}, внешних: {len(set(external))}")
```

Уникальные внутренние URL — это карта того, что архив считает страницами сайта. Её можно сверить со списком URL из [CDX](/kb/users/cdx-howto): ссылка в HTML не гарантирует, что краулер успел эту страницу скачать.

## Готовый отчёт metawarc

Тот же разбор для уже проиндексированной коллекции делает metawarc. Команда сверена со страницей инструмента:

```bash
metawarc index-content --dbfile collection.db --type links
```

Как читать получившийся граф — в гайде [«Анализ ссылочного графа»](/kb/guides/link-graph-analysis).

## Ограничения

- Ссылки, которые страница добавляет только скриптом после загрузки, в исходном HTML нет. Их видно, если обход делал браузерный краулер и они попали в WARC как отдельные запросы.
- `urljoin` не чинит адреса с лишними пробелами и битой разметкой. Такие строки останутся в таблице как есть.
- Скрипт не обходит чужой сайт и не проверяет, жива ли ссылка сейчас.

## Связанные материалы

- [Поиск внутри WARC](/kb/users/search-inside-warc)
- [Анализ ссылочного графа](/kb/guides/link-graph-analysis)
- [metawarc](/kb/instruments/ruarxive-tools/metawarc)
