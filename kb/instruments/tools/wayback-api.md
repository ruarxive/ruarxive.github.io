---
title: Wayback Machine API — справочник для архивистов
sidebar_label: Wayback Machine API
description: "Полный справочник API Internet Archive для архивистов: SavePageNow, CDX API, Availability API, Memento API, поиск. Примеры curl и Python, ограничения."
last_updated: 2026-11-09
keywords: [wayback, internet-archive, api, cdx, memento, savepagenow, archive.org]
---

# Wayback Machine API — справочник для архивистов

[Internet Archive](https://archive.org/) предоставляет набор HTTP-эндпойнтов, которые позволяют программно работать с Wayback Machine: сохранять страницы, искать по индексу, проверять наличие снимков и получать метаданные. Этот материал — карманный справочник для архивистов, которые хотят автоматизировать работу с [archive.org/web](https://web.archive.org/).

> **Не путать с [Internet Archive CLI (ia)](/kb/instruments/tools/internet-archive-cli)** — `ia` работает с каталогом archive.org (загрузка/скачивание/метаданные items). Здесь — только Wayback Machine, веб-архив.

## Зачем архивисту программный API

- **Проверка существования** снимка перед публикацией или ссылкой.
- **Сохранение страницы** в Wayback без браузера (для автоматических пайплайнов).
- **Массовый поиск** — например, найти все снимки правительственного сайта за 10 лет.
- **Memento-роутинг** — дать пользователю «правильную» ссылку на ближайший снимок.
- **Интеграция с Ruarxive** — обогащение метаданных архива из общедоступных коллекций IA.

## Базовые URL

| Сервис | Эндпойнт | Протокол |
|:---|:---|:---|
| Wayback Machine | `https://web.archive.org/` | HTTPS |
| SavePageNow | `https://web.archive.org/save/` | HTTPS |
| CDX API | `https://web.archive.org/cdx/search/cdx` | HTTPS |
| Availability API | `https://archive.org/wayback/available` | HTTPS |
| Memento Aggregator | `https://timetravel.mementoweb.org/api/json/` | HTTPS |
| IA S3-like | `https://s3.us.archive.org/` | HTTPS |

Все запросы идут по обычному HTTPS; специальной аутентификации не требуется, но есть rate limits (см. ниже).

## 1. SavePageNow — отправить страницу на архивацию

SavePageNow — это публичная форма сохранения (`web.archive.org/save/`). У неё есть JSON API:

```bash
curl -X POST 'https://web.archive.org/save/' \
     -H 'Content-Type: application/x-www-form-urlencoded' \
     --data-urlencode 'url=https://example.com/article' \
     --data-urlencode 'capture_all=1' \
     --data 'submit=Submit'
```

Ответ — JSON с URL, под которым страница окажется в Wayback:

```json
{
  "url": "https://example.com/article",
  "archived_snapshots": {
    "closest": {
      "status": "200",
      "available": true,
      "url": "https://web.archive.org/web/20261109120000/https://example.com/article",
      "timestamp": "20261109120000"
    }
  }
}
```

### Параметры

| Параметр | Зачем |
|:---|:---|
| `url` | Целевой URL (обязательно) |
| `capture_all=1` | Захватить все вложенные ресурсы (CSS, JS, изображения) |
| `capture_outlinks=1` | Сохранить ссылки наружу |
| `capture_screenshot=1` | Сделать скриншот |
| `if_not_archived_within=30d` | Только если последний снимок старше 30 дней |

### Python

```python
import requests

def save_url(url: str, capture_all: bool = True) -> dict:
    res = requests.post(
        "https://web.archive.org/save/",
        data={
            "url": url,
            "capture_all": int(capture_all),
            "submit": "Submit",
        },
        timeout=120,
    )
    res.raise_for_status()
    return res.json()

print(save_url("https://example.com/article"))
```

### Альтернативы SavePageNow для продакшена

SavePageNow — «гражданский» инструмент с жёсткими лимитами. Для серьёзных объёмов:

- **[Browsertrix](/kb/instruments/tools/browsertrix)** → собственный WACZ → загрузка в IA через [ia CLI](/kb/instruments/tools/internet-archive-cli).
- **[Wayback Machine-совместимый crawler](https://github.com/iipc/openwayback)** — собственный сбор + реплей на собственном сервере.
- **Договориться с IA о партнёрстве** — для некоммерческих архивов это реально, контакт через `info@archive.org`.

## 2. CDX API — индекс всех URL

CDX API возвращает список снимков по URL или префиксу. Это «Google для Wayback Machine».

### Запрос: все снимки одного URL

```bash
curl 'https://web.archive.org/cdx/search/cdx?url=example.com/&output=json'
```

Формат строки ответа (CDX-формат):

```
com,example)/ 20240101120000 https://web.archive.org/web/20240101120000/https://example.com/ warc.gz 200 12345 abc123...
```

С `output=json` будет массив массивов:

```json
[
  ["urlkey", "timestamp", "original", "mimetype", "statuscode", "digest", "length"],
  ["com,example)/", "20240101120000", "https://example.com/", "text/html", "200", "ABC...", "12345"]
]
```

### Параметры CDX

| Параметр | Зачем |
|:---|:---|
| `url=example.com/*` | Все URL домена (поддерживается glob `*` и regex) |
| `url=example.com/news/*` | Только раздел /news/ |
| `matchType=prefix` | Совпадение по префиксу (по умолчанию exact) |
| `matchType=host` | Все URL на хосте |
| `matchType=domain` | Все URL на домене и поддоменах |
| `from=20240101` | Только с этой даты (YYYYMMDD) |
| `to=20261231` | Только по эту дату |
| `filter=statuscode:200` | Только успешные ответы |
| `filter=mimetype:text/html` | Только HTML |
| `filter=!statuscode:404` | Исключить 404-е |
| `limit=100` | Не более 100 строк |
| `output=json` | JSON вместо CDX |

### Пример: «сколько уникальных страниц сайта в Wayback»

```python
import requests
from collections import Counter

r = requests.get(
    "https://web.archive.org/cdx/search/cdx",
    params={
        "url": "example.com/*",
        "matchType": "domain",
        "filter": "statuscode:200",
        "filter": "mimetype:text/html",
        "output": "json",
        "limit": 10000,
    },
    timeout=60,
)
data = r.json()
urls = {row[2] for row in data[1:]}  # уникальные оригинальные URL
print(f"Уникальных страниц: {len(urls)}")
```

### Подводные камни CDX

- **Неполнота индекса.** CDX построен на доступных WARC-файлах; часть краулов обработана, но не все.
- **Limit и OFFSET.** Лимит 100 записей по умолчанию; offset для пагинации. Для больших запросов используйте потоковую обработку.
- **Кириллица в URL.** URL нужно кодировать в SURT-формате (см. [CDX-спека](https://iipc.github.io/warc-specifications/specifications/cdx-format/cdx-1.1.1.html)).

## 3. Availability API — есть ли страница в архиве?

Возвращает ближайший снимок к указанной дате. Удобно для кнопки «Архивная версия»:

```bash
curl 'https://archive.org/wayback/available?url=example.com/&timestamp=20260615'
```

Ответ:

```json
{
  "url": "example.com/",
  "archived_snapshots": {
    "closest": {
      "status": "200",
      "available": true,
      "url": "https://web.archive.org/web/20260601120000/https://example.com/",
      "timestamp": "20260601120000"
    }
  }
}
```

### Когда использовать

- Перед публикацией ссылки дать пользователю «посмотреть в Wayback».
- В скрипте валидации: проверить, что наш WARC был загружен в IA.

```python
def wayback_status(url: str, ts: str = None) -> bool:
    params = {"url": url}
    if ts:
        params["timestamp"] = ts
    r = requests.get(
        "https://archive.org/wayback/available",
        params=params, timeout=30,
    )
    data = r.json()
    snap = data.get("archived_snapshots", {}).get("closest")
    return bool(snap and snap.get("available"))
```

## 4. Memento API — TimeGate и TimeMap

Memento — стандарт IETF (RFC 7089) для «time travel». Wayback Machine — основная реализация.

### TimeGate — редирект к ближайшему снимку

```bash
# Любой ближайший к сегодня
curl -I 'https://web.archive.org/web/https://example.com/'

# К 2026-06-15
curl -I -H 'Accept-Datetime: Mon, 15 Jun 2026 12:00:00 GMT' \
  'https://web.archive.org/web/20260615/https://example.com/'
```

Если страница в архиве — `302 Found` с заголовком `Location: https://.../web/<timestamp>/https://...`.
Если нет — `404 Not Found`.

### TimeMap (link-format) — все версии URL

```bash
curl -H 'Accept: application/link-format' \
  'https://web.archive.org/web/timemap/link/https://example.com/'
```

Возвращает список Memento в формате link-format:

```
<https://web.archive.org/web/20240101/https://example.com/>; rel="memento"; datetime="Mon, 01 Jan 2024 ...",
<https://web.archive.org/web/20250101/https://example.com/>; rel="memento"; datetime="Wed, 01 Jan 2025 ...",
...
<https://web.archive.org/web/https://example.com/>; rel="original"
```

JSON-формат через API:

```bash
curl 'https://web.archive.org/web/timemap/json/https://example.com/'
```

```json
{
  "mementos": {
    "first": {"datetime": "...", "uri": "..."},
    "last":  {"datetime": "...", "uri": "..."},
    "list":  {"memento": [...]}
  }
}
```

### Memento Aggregator — федеративный поиск

```bash
curl 'https://timetravel.mementoweb.org/api/json/20260101/https://example.com/'
```

Возвращает снимки из всех архивов, поддерживающих Memento (Internet Archive, национальные архивы, archive.today). Удобно для исследовательских работ.

## 5. Поиск в Wayback Machine

### Простой поиск (как на web.archive.org)

Не имеет открытого JSON API. Для программного поиска используйте CDX API с правильными фильтрами:

```bash
# Найти страницы с упоминанием «выборы»
curl 'https://web.archive.org/cdx/search/cdx?url=example.com/*&matchType=domain&output=json&limit=100' \
  | grep -i 'elections'
```

> **Важно:** это метаданные URL, а не полнотекстовый поиск. Для поиска по содержимому используйте [Shine](/kb/instruments/tools/shine), [SolrWayback](/kb/instruments/tools/solrwayback) или собственный CDXJ-индекс.

## 6. S3-подобный API archive.org

[archive.org](https://archive.org/) предоставляет S3-совместимый API для загрузки/скачивания файлов из items. Это «bulk data» — то, что не показывается в Wayback UI, но доступно для загрузки целыми архивами.

> **Подробнее** — [Internet Archive CLI (ia)](/kb/instruments/tools/internet-archive-cli) — там есть раздел про S3 API.

Коллекции Ruarxive на IA:

```
https://archive.org/details/@ruarxive
https://archive.org/details/echo-of-moscow
```

## Ограничения и rate limits

| Эндпойнт | Лимит | Источник |
|:---|:---|:---|
| SavePageNow | ~30 запросов/час с одного IP | Неофициально, заявлено IA |
| CDX API | ~10 запросов/сек | [IIPC FAQ](https://iipc.github.io/warc-specifications/) |
| Availability API | «Fair use», обычно 5–10 RPS | — |
| Wayback UI | Человекоориентированный; массовый доступ блокируется с ошибкой 429 | блог IA, 2024–2025 |

> **Внимание:** в 2024–2026 IA ввёл усиленную защиту от массового доступа (rate limiting + collab с Cloudflare). Для скрейпинга всего Wayback-индекса обращайтесь в IA напрямую.

## Когда что использовать

### Сохранить страницу

| Сценарий | Инструмент |
|:---|:---|
| Разовая операция | SavePageNow |
| Автоматическая архивация RSS-ленты | SavePageNow + cron |
| Массовая архивация (тысячи URL) | Browsertrix + загрузка WACZ через `ia` |
| Архивация под собственным брендом | Собственный WARC + собственный хостинг (pywb) |

### Найти страницу

| Сценарий | Инструмент |
|:---|:---|
| «Существует ли снимок?» | Availability API |
| «Все снимки этого URL по датам» | CDX API |
| «Снимки этого сайта за 2024» | CDX API + фильтры даты |
| «Поиск по содержимому страниц» | Shine, SolrWayback (на своём сервере) |
| «Все архивы с этой страницей» (Memento) | Memento Aggregator |

### Программный редирект к архиву

```python
def wayback_link(url: str, ts: str = None) -> str:
    """Вернуть Wayback-ссылку, или оригинальный URL если не нашли."""
    params = {"url": url}
    if ts:
        params["timestamp"] = ts
    try:
        r = requests.get(
            "https://archive.org/wayback/available",
            params=params, timeout=10,
        )
        snap = r.json().get("archived_snapshots", {}).get("closest")
        if snap and snap.get("available"):
            return snap["url"]
    except requests.RequestException:
        pass
    return url
```

## Полезные Python-библиотеки

- **[waybackpy](https://github.com/akamhy/waybackpy)** — Python-обёртка над SavePageNow, Availability и CDX.
- **[internetarchive](https://github.com/jjjake/internetarchive)** — `ia` CLI + Python API (кататлог, метаданные, bulk).
- **[cdx_toolkit](https://github.com/commoncrawl/cdx_toolkit)** — универсальный CDX-клиент (Internet Archive, Common Crawl).
- **[duckdb-web-archive-cdx](https://github.com/commoncrawl/duckdb-web-archive-cdx)** — SQL-запросы к CDX напрямую из DuckDB.

## Ресурсы

- [Wayback Machine FAQ](https://help.archive.org/help/category/wayback-machine/)
- [SavePageNow API (документация)](https://docs.google.com/document/d/1Nsv52MvSjbLb2cX08Vr6K2a1JaL9BJw0pw_fpvAEMR8/)
- [CDX API документация](https://github.com/internetarchive/wayback/blob/master/wayback-cdx-server/README.md)
- [Memento Specification (RFC 7089)](https://datatracker.ietf.org/doc/html/rfc7089)
- [Memento Aggregator](https://timetravel.mementoweb.org/)
- [IA блог: «Update on Wayback Machine Access»](https://blog.archive.org/category/wayback-machine/)

## Связанные материалы

- [Internet Archive CLI (ia)](/kb/instruments/tools/internet-archive-cli) — загрузка/скачивание через S3 API.
- [Wayback Machine — обзор](/kb/similar/internet-archive) — общая информация, RIMA, блокировки.
- [Common Crawl](/kb/similar/common-crawl) — другой большой веб-архив.
- [Perma.cc](/kb/similar/perma-cc) — альтернатива для научных публикаций.
- [pywb — локальный Wayback-сервер](/kb/instruments/replay/pywb) — поддерживает тот же CDX/Memento API.
- [Memento Time Travel](/kb/instruments/replay/memento) — обзор стандарта.
