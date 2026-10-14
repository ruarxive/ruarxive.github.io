---
title: Как выгрузить медиафайлы из WARC
sidebar_label: Медиа из WARC
sidebar_position: 8
description: "Как достать из WARC изображения, PDF, аудио и видео в каталог с именами из URL, не поднимая сервер воспроизведения."
last_update:
  date: 2026-10-14
keywords: [warc, warcio, медиа, pdf, изображения]
---

# Как выгрузить медиафайлы из WARC

Плеер показывает страницу целиком. Если нужны сами файлы — фотографии, PDF, записи передач — их читают из записей `response` и кладут в каталог.

Имена берутся из пути URL, а не из порядкового номера. Так проще сопоставить файл со страницей, на которой он был.

```python
import shutil
from pathlib import Path
from urllib.parse import unquote, urlsplit

from warcio.archiveiterator import ArchiveIterator

PREFIXES = ("image/", "audio/", "video/", "application/pdf")
out_dir = Path("media")
out_dir.mkdir(exist_ok=True)
used = {}

def filename_for(url, n):
    raw = Path(unquote(urlsplit(url).path)).name or f"record-{n:06d}"
    raw = raw.replace("/", "_").replace("\\", "_")
    if len(raw) > 180:
        raw = raw[-180:]
    seen = used.get(raw, 0)
    used[raw] = seen + 1
    if seen == 0:
        return raw
    stem = Path(raw).stem
    suffix = Path(raw).suffix
    return f"{stem}-{seen}{suffix}"

n = 0
with open("archive.warc.gz", "rb") as stream, \
     open(out_dir / "index.tsv", "w", encoding="utf-8") as idx:
    for record in ArchiveIterator(stream):
        if record.rec_type != "response" or not record.http_headers:
            continue
        if record.http_headers.get_statuscode() != "200":
            continue
        ctype = record.http_headers.get_header("Content-Type", "").split(";")[0].strip().lower()
        if not ctype.startswith(PREFIXES):
            continue
        url = record.rec_headers.get_header("WARC-Target-URI") or ""
        name = filename_for(url, n)
        with open(out_dir / name, "wb") as out:
            shutil.copyfileobj(record.content_stream(), out)
        idx.write(f"{name}\t{ctype}\t{url}\n")
        n += 1

print(f"Сохранено {n} файлов в {out_dir}")
```

`content_stream()` отдаёт тело уже без `Content-Encoding`. Рядом с файлами остаётся `index.tsv`: имя, MIME-тип и исходный адрес.

Один и тот же путь на сайте (`/logo.png`) может встретиться много раз. Второе и следующие совпадения получают суффикс `-1`, `-2` и так далее. Таблица хранит все URL.

## Если медиа лежат отдельно от WARC сайта

У «Эха Москвы» записи передач собирались не из WARC сайта, а по прямым ссылкам на CDN. На 9 марта 2022 года в списке было 37 277 ссылок и 4 167 скачанных файлов. Это описано в [проекте «Эхо Москвы»](/kb/projects/echomsk), в разделе про медиаархив. Искать mp3 только внутри WARC сайта значит пропустить эту коллекцию.

PDF и документы Word из госсайтов metawarc выгружает по расширению, если коллекция уже проиндексирована:

```bash
metawarc list-files --dbfile collection.db --mimes application/pdf
metawarc dump --dbfile collection.db --exts pdf --limit 100 --output exported
```

Команды сверены со страницей [metawarc](/kb/instruments/ruarxive-tools/metawarc).

## Чего скрипт не делает

- Не склеивает сегментированные записи `continuation`. На практике они редки; warcio их сам не собирает.
- Не обходит страницу и не вытаскивает картинки из CSS. Он сохраняет то, что записано отдельным HTTP-ответом.
- Не проверяет, что файл действительно открывается. Для JPEG 2000 есть [jpylyzer](/kb/instruments/file-formats/jp2), для PDF/A — veraPDF.

## Связанные материалы

- [«Вскрытие» WARC](/kb/users/inspect-warc)
- [Ссылки и карта сайта из WARC](/kb/users/extract-links-from-warc)
- [Фильтрация WARC](/kb/guides/warc-filtering)
- [metawarc](/kb/instruments/ruarxive-tools/metawarc)
