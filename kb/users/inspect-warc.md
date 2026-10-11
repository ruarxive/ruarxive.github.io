---
title: «Вскрытие» WARC/WACZ — извлечение содержимого
sidebar_label: "Вскрытие WARC"
sidebar_position: 3
description: "Как открыть WARC-файл и достать нужную страницу или ресурс. warcdump, warcio, командная строка и Python для исследователей."
last_updated: 2026-11-09
keywords: [warc, extract, warcio, warctools, page, content]
---

# «Вскрытие» WARC/WACZ — извлечение содержимого

Это практическая страница для исследователей: как достать из большого WARC-файла конкретную страницу, URL или ресурс. Ниже — основные команды и Python-скрипты для типовых задач.

> **Не нужно:** устанавливать pywb или поднимать сервер. Все приёмы работают локально на одном файле.

## Быстрый старт: что внутри моего WARC?

```bash
# Установить необходимые инструменты
pip install warcio warctools

# Посмотреть первые 50 записей
warcdump archive.warc.gz | head -100

# Листинг только URL
warcdump archive.warc.gz | grep "WARC-Target-URI"
```

Типичная строка вывода:

```
WARC/1.0
WARC-Type: response
WARC-Target-URI: https://example.com/article/123
WARC-Date: 2024-06-15T10:23:45Z
Content-Type: application/http; msgtype=response
Content-Length: 51234
WARC-Payload-Digest: sha256:abc123...

HTTP/1.1 200 OK
Server: nginx/1.18.0
Content-Type: text/html; charset=utf-8
Content-Length: 51000
...
```

## Получить список всех URL

### Способ 1: warcdump

```bash
warcdump archive.warc.gz | grep "WARC-Target-URI" | awk '{print $2}' > urls.txt
wc -l urls.txt
```

### Способ 2: warcio (Python)

```python
from warcio.archiveiterator import ArchiveIterator

urls = set()
with open("archive.warc.gz", "rb") as stream:
    for record in ArchiveIterator(stream):
        if record.rec_type == "response":
            url = record.rec_headers.get_header("WARC-Target-URI")
            if url:
                urls.add(url)

# Сохранить
with open("urls.txt", "w") as f:
    for url in sorted(urls):
        f.write(url + "\n")

print(f"Уникальных URL: {len(urls)}")
```

### Способ 3: warchaeology

```bash
warc-headers archive.warc.gz | grep "WARC-Target-URI" > urls.txt
```

## Найти конкретный URL

### Все снимки конкретной страницы

```bash
warcdump archive.warc.gz | grep -A5 "WARC-Target-URI: https://example.com/specific-page"
```

### Извлечь HTML конкретной страницы

```bash
# Используя warcfilter
warcfilter --records archive.warc.gz --pattern 'https://example.com/page' > response.warc
warcdump response.warc
```

### Извлечь через Python

```python
from warcio.archiveiterator import ArchiveIterator

target_url = "https://example.com/specific-page"
with open("archive.warc.gz", "rb") as stream, open("page.html", "wb") as out:
    for record in ArchiveIterator(stream):
        if record.rec_type != "response":
            continue
        url = record.rec_headers.get_header("WARC-Target-URI")
        if target_url in url:
            payload = record.content_stream().read()
            out.write(payload)
            print(f"Saved {url} ({len(payload)} bytes)")
            break
```

## Извлечь все URL с домена

```python
from warcio.archiveiterator import ArchiveIterator

target_domain = "example.com"
matching = []
with open("archive.warc.gz", "rb") as stream:
    for record in ArchiveIterator(stream):
        if record.rec_type != "response":
            continue
        url = record.rec_headers.get_header("WARC-Target-URI", "")
        if target_domain in url:
            matching.append(url)

print(f"Найдено {len(matching)} URL на домене {target_domain}")
with open("matching-urls.txt", "w") as f:
    f.write("\n".join(matching))
```

## Достать все изображения

```python
from warcio.archiveiterator import ArchiveIterator
import mimetypes
from pathlib import Path

output_dir = Path("extracted-images")
output_dir.mkdir(exist_ok=True)

count = 0
with open("archive.warc.gz", "rb") as stream:
    for record in ArchiveIterator(stream):
        if record.rec_type != "response":
            continue
        # Только успешные ответы
        status = record.http_headers.get_statuscode() if record.http_headers else "000"
        if status != "200":
            continue
        content_type = record.http_headers.get_header("Content-Type", "") if record.http_headers else ""
        if not content_type.startswith("image/"):
            continue
        url = record.rec_headers.get_header("WARC-Target-URI")
        ext = mimetypes.guess_extension(content_type.split(";")[0]) or ".img"
        filename = output_dir / f"image_{count:05d}{ext}"
        payload = record.content_stream().read()
        filename.write_bytes(payload)
        count += 1

print(f"Сохранено {count} изображений в {output_dir}")
```

## Только заголовки (без payload)

### Быстрый способ (warcdump)

```bash
warcdump archive.warc.gz --headers-only 2>&1 | head -100
```

### Python (без скачивания тел)

```python
from warcio.archiveiterator import ArchiveIterator

with open("archive.warc.gz", "rb") as stream:
    for record in ArchiveIterator(stream):
        # Только метаданные, без payload
        print({
            "url": record.rec_headers.get_header("WARC-Target-URI"),
            "type": record.rec_type,
            "date": record.rec_headers.get_header("WARC-Date"),
            "length": record.rec_headers.get_header("Content-Length"),
            "status": record.http_headers.get_statuscode() if record.http_headers else None,
        })
```

Это даёт **ускорение в 100–1000 раз** по сравнению с полным чтением, потому что payload не обрабатывается.

## Подсчёт по типам контента

```python
from warcio.archiveiterator import ArchiveIterator
from collections import Counter

counts = Counter()
sizes = Counter()

with open("archive.warc.gz", "rb") as stream:
    for record in ArchiveIterator(stream):
        if record.rec_type != "response":
            continue
        content_type = record.http_headers.get_header("Content-Type", "unknown") if record.http_headers else "unknown"
        main_type = content_type.split(";")[0].split("/")[0]
        length = int(record.rec_headers.get_header("Content-Length", "0") or "0")
        counts[main_type] += 1
        sizes[main_type] += length

for t in sorted(counts):
    print(f"{t:12} {counts[t]:8} записей {sizes[t]/1024/1024:8.2f} MB")
```

Вывод:

```
text/html      1234 записей  450.32 MB
image          4567 записей 1023.45 MB
application    234 записей  567.89 MB
...
```

## Поиск по содержимому (ripgrep + WARC)

### Подготовка: распаковать в HTML

```bash
mkdir extracted-html
warcfilter --content-type='text/html' archive.warc.gz -o html-only.warc.gz
warcdump html-only.warc.gz | grep WARC-Target-URI  # посмотреть содержимое
```

### Полнотекстовый поиск

```bash
# Извлечь все ответы в отдельные файлы
python3 << 'EOF'
from warcio.archiveiterator import ArchiveIterator
from pathlib import Path

Path("html").mkdir(exist_ok=True)
i = 0
with open("archive.warc.gz", "rb") as stream:
    for record in ArchiveIterator(stream):
        if record.rec_type != "response":
            continue
        ct = record.http_headers.get_header("Content-Type", "") if record.http_headers else ""
        if not ct.startswith("text/html"):
            continue
        payload = record.content_stream().read()
        url = record.rec_headers.get_header("WARC-Target-URI", f"unknown-{i}")
        Path(f"html/{i:05d}.html").write_bytes(payload)
        i += 1
EOF

# grep по содержимому
rg "выборы" html/ -l
rg "вакансия" html/ -l
```

Или используя [hfgrep](https://github.com/rossmojman/hfgrep) — утилиту для полнотекстового поиска по WARC:

```bash
hfgrep "search term" archive.warc.gz
```

## Полная запись URL с датой и статусом

```python
import json
from warcio.archiveiterator import ArchiveIterator

records = []
with open("archive.warc.gz", "rb") as stream:
    for record in ArchiveIterator(stream):
        if record.rec_type != "response":
            continue
        records.append({
            "url": record.rec_headers.get_header("WARC-Target-URI"),
            "date": record.rec_headers.get_header("WARC-Date"),
            "status": record.http_headers.get_statuscode() if record.http_headers else None,
            "content_type": record.http_headers.get_header("Content-Type") if record.http_headers else None,
            "length": int(record.rec_headers.get_header("Content-Length", "0") or "0"),
        })

# Сохранить в JSON
with open("index.json", "w") as f:
    json.dump(records, f, indent=2, ensure_ascii=False)

print(f"Записано {len(records)} записей в index.json")
```

## Извлечение отдельной записи по record-id

```python
from warcio.archiveiterator import ArchiveIterator

target_id = "<urn:uuid:abc-123-def-456>"

with open("archive.warc.gz", "rb") as stream:
    for record in ArchiveIterator(stream):
        record_id = record.rec_headers.get_header("WARC-Record-ID")
        if record_id == target_id:
            payload = record.content_stream().read()
            # Сохранить
            with open("single-record.bin", "wb") as f:
                f.write(payload)
            print(f"Запись {target_id} извлечена ({len(payload)} байт)")
            break
```

## Извлечь WARC-метаданные для всех записей (с CDX)

```bash
# Самый быстрый способ — построить CDX-индекс
warc-indexer-cdxj archive.warc.gz > index.cdxj

# Теперь grep по индексу
grep "example.com/page" index.cdxj
```

CDXJ-формат — JSON Lines, легко парсить.

## Распаковка payload большой записи

```python
# Для записей размером в ГБ
from warcio.archiveiterator import ArchiveIterator

with open("huge.warc.gz", "rb") as stream:
    for record in ArchiveIterator(stream):
        if record.rec_type != "response":
            continue
        url = record.rec_headers.get_header("WARC-Target-URI")
        if "specific-huge-page" not in url:
            continue
        # Запись может быть в 'continuation' блоках — warcio собирает автоматически
        size = int(record.rec_headers.get_header("Content-Length", "0"))
        print(f"Page {url} — {size/1024/1024:.2f} MB")
        # Стриминг — не загружаем в RAM
        with open("output.bin", "wb") as out:
            for chunk in record.content_stream():
                out.write(chunk)
                # если нужно — out.write(chunk) побайтово
        break
```

## Частые ошибки

| Проблема | Решение |
|:---|:---|
| `KeyError: 'WARC-Target-URI'` | Не все записи имеют target URI (например, warcinfo); добавьте проверку `if url:` |
| Медленно на больших файлах | Используйте `warcio`, не читайте в память; Python generators |
| `UnicodeDecodeError` | WARC не полностью UTF-8; читайте как `bytes`, не текст |
| Битый gzip | Сначала `gzip -t archive.warc.gz` или `warc-validate` |
| RAM переполнение | Используйте streaming; не `record.content_stream().read()` — это загружает всё в память |
| Запись «обрезана» | WARC был повреждён; сравните длины; обратитесь к Warchaeology |

## Когда использовать

✅ Подходит:

- **Аудит коллекции** без поднятия сервера.
- **Извлечение единичной страницы** для публикации или проверки.
- **Анализ ссылочного графа** — все URL из WARC.
- **Подготовка выборки** для исследований.
- **Восстановление утраченного контента** из архива.

❌ Не подходит:

- **Публичный доступ** для многих пользователей — нужен [pywb](/kb/instruments/replay/pywb).
- **Полнотекстовый поиск** — лучше [SolrWayback](/kb/instruments/tools/solrwayback) или [Shine](/kb/instruments/tools/shine).
- **Извлечение большого количества payload** — нужен DuckDB-WARC или warc-processing пайплайн.
- **Real-time мониторинг** — это batch-инструмент.

## Инструменты под рукой

| Инструмент | Установка | Когда |
|:---|:---|:---|
| [warctools](https://github.com/internetarchive/warctools) | `pip install warctools` | CLI (warcdump, warcfilter) |
| [warcio](https://github.com/webrecorder/warcio) | `pip install warcio` | Python API |
| [warchaeology](/kb/instruments/tools/warchaeology) | `pip install warchaeology` | Валидация, статистика, дедуп |
| [DuckDB-WARC](/kb/instruments/tools/duckdb-warc) | `pip install duckdb-warc` | SQL-запросы |
| [hfgrep](https://github.com/rossmojman/hfgrep) | npm install | Полнотекстовый поиск |
| [ReplayWeb.page](/kb/instruments/replay/replayweb-page) | Браузер | Разовое открытие |

## Ресурсы

- [warcio GitHub](https://github.com/webrecorder/warcio)
- [warctools GitHub](https://github.com/internetarchive/warctools)
- [WARC 1.1 specification](https://iipc.github.io/warc-specifications/)
- [Warchaeology — обзорная страница](/kb/instruments/tools/warchaeology)

## Связанные материалы

- [WARC-файл: формат](/kb/instruments/file-formats/warc)
- [Как открыть WARC](/kb/users/open-warc) — для пользователя.
- [WARC-файл: от сырого архива до публикации](/kb/guides/warc-workflow)
- [ReplayWeb.page](/kb/instruments/replay/replayweb-page)
- [pywb — серверный плеер](/kb/instruments/replay/pywb)
- [DuckDB-WARC](/kb/instruments/tools/duckdb-warc) — SQL-альтернатива.
