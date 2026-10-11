---
title: Memento — стандарт «time travel» для веб-архивов
sidebar_label: Memento
description: "Memento (RFC 7089) — стандарт IETF для навигации по историческим версиям веб-страниц. TimeGate, TimeMap, Memento Aggregator. Реализации: Wayback Machine, Pywb, Mink, PastPage."
last_updated: 2026-11-09
keywords: [memento, rfc7089, timegate, timemap, aggregator, wayback]
---

# Memento — стандарт «time travel» для веб-архивов

[Memento](https://datatracker.ietf.org/doc/html/rfc7089) — стандарт IETF (RFC 7089, 2013) для доступа к историческим версиям веб-страниц. Он описывает, как HTTP-клиент (браузер, скрипт, расширение) может попросить у «архива» ближайшую к нужной дате версию URL или получить полный список всех снимков.

> **Зачем архивисту:** без Memento каждая архивная система придумывает свой API. С Memento можно одной командой спросить Internet Archive, национальные архивы и Archive.today одновременно — через **Memento Aggregator**.

## Три типа URI

| Тип | Зачем | Пример |
|:---|:---|:---|
| **Original (Original Resource)** | Живой URL, который архивируем | `https://example.com/` |
| **Memento** | Конкретный архивный снимок с фиксированной датой | `https://web.archive.org/web/20260601120000/https://example.com/` |
| **TimeGate** | Ресурс-редиректор: «дай мне ближайший снимок к этой дате» | `https://web.archive.org/web/20260615/https://example.com/` |
| **TimeMap** | Список всех Memento для Original | `https://web.archive.org/web/timemap/link/https://example.com/` |

## TimeGate — редирект к ближайшему снимку

TimeGate ведёт себя как обычный URL, но возвращает `302 Found` с `Location` на конкретный Memento:

```bash
# Без Accept-Datetime → ближайший к сегодня
curl -I 'https://web.archive.org/web/https://example.com/'

# С конкретной датой
curl -I \
  -H 'Accept-Datetime: Mon, 15 Jun 2026 12:00:00 GMT' \
  'https://web.archive.org/web/20260615/https://example.com/'
```

Ответ:

```
HTTP/1.1 302 Found
Location: https://web.archive.org/web/20260601120000/https://example.com/
Memento-Datetime: Mon, 01 Jun 2026 12:00:00 GMT
Link: <https://example.com/>; rel="original"
```

### Альтернативные TimeGate'ы

| TimeGate | Эндпойнт | Покрытие |
|:---|:---|:---|
| Internet Archive | `https://web.archive.org/web/<ts>/<url>` | Глобальное |
| Archive Today | `https://archive.ph/newest/<url>` | Глобальное |
| Library of Congress | `https://webarchive.loc.gov/all/<url>` | США |
| UK Web Archive | `https://www.webarchive.org.uk/wayback/archive/<url>` | Великобритания |
| Bibliothèque nationale de France | `https://web.archive.bnf.fr/<url>` | Франция |
| Королевская библиотека Дании | `http://web.archive.kb.dk/<url>` | Дания |

## TimeMap — все снимки URL

TimeMap возвращает все известные Memento для Original:

```bash
# В link-format
curl -H 'Accept: application/link-format' \
  'https://web.archive.org/web/timemap/link/https://example.com/'
```

Ответ:

```
<https://web.archive.org/web/20240101120000/https://example.com/>; rel="memento"; datetime="Mon, 01 Jan 2024 ...",
<https://web.archive.org/web/20250101120000/https://example.com/>; rel="memento"; datetime="Wed, 01 Jan 2025 ...",
<https://web.archive.org/web/20260101120000/https://example.com/>; rel="memento"; datetime="Thu, 01 Jan 2026 ...",
<https://web.archive.org/web/https://example.com/>; rel="original"
```

В JSON-формате через API:

```bash
curl 'https://web.archive.org/web/timemap/json/https://example.com/' | jq .
```

```json
{
  "mementos": {
    "first": {"datetime": "20240101...", "uri": "https://web.archive.org/web/2024..."},
    "last":  {"datetime": "20260101...", "uri": "https://web.archive.org/web/2026..."},
    "list":  {"memento": [...]}
  }
}
```

## Memento Aggregator — федеративный поиск

[Memento Aggregator](https://timetravel.mementoweb.org/) — сервис, который отправляет запрос во все поддерживающие Memento архивы и возвращает объединённый результат. Для архивиста — способ за один запрос проверить, в каких архивах мира есть нужная страница.

### JSON API

```bash
# Все снимки URL на 2026-01-01 во всех архивах
curl 'https://timetravel.mementoweb.org/api/json/20260101/https://example.com/'
```

Ответ:

```json
{
  "mementos": {
    "first": {"datetime": "...", "uri": "https://..."},
    "last":  {"datetime": "...", "uri": "https://..."},
    "list": {
      "memento": [
        "https://web.archive.org/web/2024...",
        "https://archive.ph/2025-...",
        "https://webarchive.loc.gov/all/..."
      ]
    }
  }
}
```

### Link API

```bash
# Список URL всех архивов, в которых есть страница
curl -H 'Accept: application/link-format' \
  'https://timetravel.mementoweb.org/api/link/20260101/https://example.com/'
```

## Расширения Memento

### Memento Pattern

Для случая, когда URL сменился, но это «новая версия» старой страницы. Используется заголовок `Memento-Pattern` или `Link: rel="pattern"`. Wayback Machine поддерживает для некоторых сайтов.

### Memento Datetime Format

Дата указывается в формате [RFC 7089](https://datatracker.ietf.org/doc/html/rfc7089#section-5.2.1):

```
Mon, 01 Jun 2026 12:00:00 GMT     # HTTP-формат
2026-06-01T12:00:00Z               # ISO-8601
```

### TimeBundle

TimeBundle — дополнение, позволяющее запросить несколько URL одновременно. Редко реализовано; обычно не требуется.

## Программные обёртки

### Python: requests + ручная обработка

```python
import requests
from urllib.parse import quote

def memento_for(url: str, ts: str = None) -> str | None:
    """Вернуть URL ближайшего Memento или None, если не найдено."""
    headers = {}
    if ts:
        headers["Accept-Datetime"] = f"{ts} GMT"
    r = requests.get(
        f"https://web.archive.org/web/{quote(url, safe='')}",
        headers=headers,
        allow_redirects=False,
        timeout=30,
    )
    if r.status_code in (302, 200):
        loc = r.headers.get("Location")
        if loc:
            return loc
    return None


def time_map(url: str) -> list[str]:
    """Список URL всех Memento для данного URL."""
    r = requests.get(
        f"https://web.archive.org/web/timemap/json/{quote(url, safe='')}",
        timeout=60,
    )
    data = r.json()
    return [m["uri"] for m in data["mementos"]["list"]["memento"]]


print(memento_for("https://example.com/", "20260615"))
print(len(time_map("https://example.com/")), "снимков")
```

### Питон-библиотека waybackpy

```bash
pip install waybackpy
```

```python
from waybackpy import WaybackMachine

wm = WaybackMachine("https://example.com/")

# Ближайший снимок к 2026-06-15
snap = wm.near(time="2026-06-15")
print(snap.url, snap.timestamp)

# Все снимки за последние 5 лет
for snap in wm.snapshots(year_start=2021, year_end=2026):
    print(snap.url, snap.timestamp)
```

## Расширения браузера и плагины

| Инструмент | Тип | Что делает |
|:---|:---|:---|
| **[Mink](https://github.com/keitham/mink)** | Расширение Chrome | При просмотре страницы показывает панель со снимками из Memento Aggregator |
| **[PastPage](https://github.com/brettlangdon/pastpage)** | Расширение Chrome/Firefox | Если страница недоступна, ищет её в архивах автоматически |
| **[Zotero Robust Links](https://github.com/lehnberg/zotero-memento)** | Расширение Zotero | При цитировании добавляет ссылку на Memento |
| **[Rescue Time Machine](https://www.rescuetime.org/)** | Сервис | Подбирает TimeGate автоматически |

Пример PastPage в действии: пользователь нажимает «View archived page» → расширение спрашивает Memento Aggregator → если найден снимок, открывает его.

## Реализации серверной части

| Архив | Поддержка Memento | Эндпойнт |
|:---|:-:|:---|
| Internet Archive | ✅ | `web.archive.org/web/<ts>/<url>` |
| pywb | ✅ | `<collection>/memento/<url>` |
| OpenWayback | ⚠️ Частично | `<collection>/<ts>/<url>` |
| SolrWayback | ✅ | встроенный proxy |
| Conifer | ✅ | локальный proxy |

Подробности о настройке серверной части — [pywb](/kb/instruments/replay/pywb) (раздел Memento API).

## Когда использовать Memento

✅ Подходит:

- Дать пользователю ссылку на «архивную версию» без ручного перебора дат.
- Программно проверять, в каких архивах мира есть URL.
- В скриптах автоматически выбирать ближайший снимок для цитирования.
- В браузерных расширениях для автоматического восстановления 404-х страниц.
- В академических публикациях — Memento-ссылка принимается наравне с Perma.cc.

❌ Не подходит:

- Полнотекстовый поиск по содержимому — только метаданные URL.
- Свежие страницы (ещё не заархивированные) — Memento не сохраняет, а только находит.
- Закрытые/приватные архивы — нужна отдельная аутентификация.

## Ресурсы

- [RFC 7089 — Memento](https://datatracker.ietf.org/doc/html/rfc7089) — формальная спецификация.
- [Memento Project — сайт IETF](https://datatracker.ietf.org/wg/httpbis/) — рабочая группа.
- [Memento Framework](https://www.mementofoundation.org/) — организация по развитию стандарта.
- [Memento Aggregator — timetravel.mementoweb.org](https://timetravel.mementoweb.org/) — точка входа.
- [Memento Tools List](https://www.mementofoundation.org/tools/) — клиенты и серверы.

## Связанные материалы

- [Wayback Machine API](/kb/instruments/tools/wayback-api) — практический справочник API Wayback Machine.
- [pywb](/kb/instruments/replay/pywb) — Python-сервер с поддержкой Memento.
- [Internet Archive](/kb/similar/internet-archive) — основная реализация Memento.
- [ReplayWeb.page](/kb/instruments/replay/replayweb-page) — клиентский плеер (Memento-агент).
- [FAQ](/kb/faq) — ответы на частые вопросы об архивации.
