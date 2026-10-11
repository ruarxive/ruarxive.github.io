---
title: Waybackpy — Python-обёртка для Wayback Machine
sidebar_label: Waybackpy
description: "Waybackpy — Python-библиотека для работы с Wayback Machine API: сохранение страниц, поиск по близости, списки снимков, Memento. CLI-режим."
last_updated: 2026-11-09
keywords: [waybackpy, wayback-machine, archive.org, api, python, memento]
---

# Waybackpy — Python-обёртка для Wayback Machine

[waybackpy](https://github.com/akamhy/waybackpy) — Python-библиотека и CLI-утилита от [Akash Hamal](https://github.com/akamhy) для удобной работы с Wayback Machine API. С 2021 года **де-факто стандарт** для Python-проектов, которым нужно взаимодействовать с [web.archive.org](https://web.archive.org/).

> **Зачем:** обёртка над [Wayback Machine API](/kb/instruments/tools/wayback-api), которую мы описали ранее. Экономит часы ручного HTTP-кода и валидирует ответы.

## Возможности

- **Поиск ближайшего снимка** URL к заданной дате (`near()`).
- **Список всех снимков** URL за период (`snapshots()`).
- **Сохранение страницы** в Wayback Machine (`save()`).
- **Memento TimeMap** — все снимки в JSON-формате.
- **CDX-запросы** к индексу Internet Archive.
- **Разные режимы вывода** — объект, JSON, dataclass.
- **Полная асинхронность** через `WaybackMachineSession`.
- **CLI-режим** — `python -m waybackpy ...`.

## Установка

```bash
pip install waybackpy
```

Требования: Python 3.6+. Поддерживается Windows, Linux, macOS.

## Использование

### Базовый сценарий: один URL

```python
from waybackpy import WaybackMachine

wm = WaybackMachine("https://example.com/")

# Ближайший снимок к сегодня
snap = wm.near()
print(snap.url)        # "https://web.archive.org/web/20261109.../https://example.com/"
print(snap.timestamp)  # "20261109..."

# Ближайший к 2026-06-15
snap = wm.near(time="2026-06-15")
print(snap.url)
```

### Список всех снимков

```python
for snap in wm.snapshots(year_start=2024, year_end=2026):
    print(snap.timestamp, snap.url)
```

### Сохранение страницы

```python
import waybackpy

# Создать запрос на сохранение
result = waybackpy.WaybackMachine("https://example.com/article").save()
print(result.url)         # URL в Wayback после сохранения
print(result.status_code) # 200 если успешно
print(result.headers)     # HTTP-заголовки ответа IA
```

### CDX-запросы

```python
from waybackpy import WaybackMachineCDXServerAPI

api = WaybackMachineCDXServerAPI(
    "https://example.com/",
    match_type=WaybackMachineCDXServerAPI.MatchType.PREFIX,
    filter_statuscode="200",
    limit=100,
)

for record in api.snapshots():
    print(record.urlkey, record.timestamp, record.statuscode)

# Или использовать CDXJ-формат (JSON)
import json
records_json = api.snapshots_json()
print(json.dumps(records_json[:3], indent=2))
```

### Memento

```python
import waybackpy

memento = waybackpy.Memento("https://example.com/", time="2026-06-15")
print(memento.url, memento.status_code)
```

## CLI

```bash
# Посмотреть ближайший снимок
python -m waybackpy --url "https://example.com/"

# С конкретной датой
python -m waybackpy --url "https://example.com/" --near "2026-06-15"

# Посмотреть CDX
python -m waybackpy --url "https://example.com/" --cdx

# Сохранить страницу
python -m waybackpy --url "https://example.com/" --save
```

## Асинхронный режим

Для массовой обработки (сотни URL):

```python
import asyncio
from waybackpy import WaybackMachineSession

async def check_urls(urls):
    async with WaybackMachineSession() as session:
        tasks = [
            session.near(url)
            for url in urls
        ]
        results = await asyncio.gather(*tasks, return_exceptions=True)
        for url, snap in zip(urls, results):
            if isinstance(snap, Exception):
                print(f"{url}: error {snap}")
            else:
                print(f"{url}: {snap.url}")

asyncio.run(check_urls([
    "https://example.com/",
    "https://example.org/",
    "https://example.gov/",
]))
```

## Реальные сценарии

### Сценарий 1. Найти «исчезнувшую» страницу

```python
def find_lost(page_url: str) -> str | None:
    from waybackpy import WaybackMachine
    try:
        snap = WaybackMachine(page_url).near()
        return snap.url if snap.status_code == 200 else None
    except Exception:
        return None

# Использование в исследовании
original = "https://mysite.ru/article-old"
fallback = find_lost(original)
print(fallback or "—")
```

### Сценарий 2. Цитирование в научной работе

```python
def citation_link(url: str) -> str:
    """Вернуть Wayback-ссылку для цитирования."""
    from waybackpy import WaybackMachine
    import datetime
    snap = WaybackMachine(url).near()
    if snap:
        return f"{snap.url} (accessed {datetime.date.today()})"
    return f"{url} (not archived)"
```

### Сценарий 3. Массовая проверка списка ссылок на «link rot»

```python
from waybackpy import WaybackMachine
import csv

with open("external-links.csv") as f, open("report.csv", "w", newline="") as out:
    reader = csv.DictReader(f)
    writer = csv.DictWriter(out, fieldnames=["url", "first_archived", "snapshots"])
    writer.writeheader()
    for row in reader:
        try:
            wm = WaybackMachine(row["url"])
            snapshots = list(wm.snapshots())
            if snapshots:
                writer.writerow({
                    "url": row["url"],
                    "first_archived": snapshots[0].timestamp,
                    "snapshots": len(snapshots),
                })
        except Exception as e:
            print(f"err {row['url']}: {e}")
```

### Сценарий 4. Автоматическое сохранение RSS-ленты

```python
import feedparser
from waybackpy import WaybackMachine

feed = feedparser.parse("https://example.com/rss")
for entry in feed.entries[:10]:
    try:
        result = WaybackMachine(entry.link).save()
        print(f"Saved: {result.url}")
    except Exception as e:
        print(f"Failed {entry.link}: {e}")
```

## Best practices

### Кэшируйте ответы

```python
import requests_cache

requests_cache.install_cache("wayback_cache", expire_after=86400)  # 24 часа
```

Кэш экономит запросы к IA и ускоряет повторные прогоны.

### Обрабатывайте ошибки

Wayback Machine API иногда возвращает 429 (rate limit). Используйте backoff:

```python
import time
from waybackpy.exceptions import WaybackMachineNoSnapshotError

def with_retry(func, url, max_retries=3):
    for attempt in range(max_retries):
        try:
            return func(url)
        except WaybackMachineNoSnapshotError:
            return None
        except Exception as e:
            if "429" in str(e):
                time.sleep(2 ** attempt)
                continue
            raise
```

### Параллельность

Для десятков тысяч URL — параллельные запросы + задержка:

```python
import asyncio

async def batch_check(urls, max_concurrent=5):
    sem = asyncio.Semaphore(max_concurrent)

    async def fetch_one(url):
        async with sem:
            await asyncio.sleep(0.5)
            from waybackpy import WaybackMachineSession
            async with WaybackMachineSession() as session:
                try:
                    snap = await session.near(url)
                    return (url, snap.url if snap else None)
                except Exception:
                    return (url, None)

    return await asyncio.gather(*[fetch_one(u) for u in urls])
```

## Когда использовать

✅ Подходит:

- **Скрипты автоматизации** на Python (бэкапы RSS, link-rot отчёты).
- **Научные инструменты** для проверки цитирования.
- **OSINT-пайплайны** для быстрой проверки существования материала в архиве.
- **CI/CD-скрипты** для архивации документов.
- **Быстрое прототипирование** Wayback Machine-интеграций.

❌ Не подходит:

- **Массовое сохранение** (сотни URL за минуту) — есть лимит, лучше Bulk Save API.
- **Real-time мониторинг** — синхронный режим, нет streaming.
- **Другие архивы** кроме Internet Archive — для Perma.cc, Common Crawl свои библиотеки.
- **Языки кроме Python** — для JS есть `wayback-machine-sdk`.

## Сравнение с прямым HTTP

| Задача | Прямой HTTP-запрос | waybackpy |
|:---|:---|:---|
| Ближайший снимок URL | Вручную формировать URL, обработать редирект | `WaybackMachine(url).near()` |
| Список всех снимков | Парсить CDX-формат вручную | `wm.snapshots()` |
| Сохранение в Wayback | POST на /save/, обработка JSON | `wm.save()` |
| Memento | Ручные HTTP-заголовки | `Memento(url, time)` |
| CDX-запросы | Query string с параметрами | Dataclass API |
| Тестирование | Mock-объекты для requests | Mock-объекты для waybackpy |
| Документация | Свои docstring'и | Встроенная |

## Ресурсы

- [GitHub](https://github.com/akamhy/waybackpy)
- [PyPI](https://pypi.org/project/waybackpy/)
- [Документация](https://github.com/akamhy/waybackpy/wiki)
- [Changelog](https://github.com/akamhy/waybackpy/releases)

## Связанные материалы

- [Wayback Machine API](/kb/instruments/tools/wayback-api) — низкоуровневый справочник.
- [Memento](/kb/instruments/replay/memento) — стандарт TimeGate/TimeMap.
- [Internet Archive CLI (ia)](/kb/instruments/tools/internet-archive-cli) — для каталога archive.org.
- [cdx_toolkit](https://github.com/commoncrawl/cdx_toolkit) — для IA + Common Crawl.
- [Ландшафт 2026](/kb/instruments/landscape-2026) — где waybackpy в общей картине.
