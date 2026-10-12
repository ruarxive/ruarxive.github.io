---
title: Wayback Machine API — справочник для архивистов
sidebar_label: Wayback Machine API
description: "Справочник по API Wayback Machine для архивистов: SavePageNow 2, CDX Server API, Availability API, Memento (TimeGate и TimeMap). Примеры curl и Python, ограничения."
last_update:
  date: 2026-10-12
keywords: [wayback, internet-archive, api, cdx, memento, savepagenow, archive.org]
---

# Wayback Machine API — справочник для архивистов

[Internet Archive](https://archive.org/) предоставляет HTTP-эндпоинты для программной работы с Wayback Machine: сохранения страниц, поиска по индексу снимков и проверки наличия снимков. Этот материал — краткий справочник для тех, кто автоматизирует работу с [web.archive.org](https://web.archive.org/).

> **Не путать с [Internet Archive CLI (ia)](/kb/instruments/tools/internet-archive-cli)** — `ia` работает с каталогом archive.org (загрузка, скачивание и метаданные items). Здесь речь только о Wayback Machine.

## Зачем архивисту программный API

- **Проверка существования** снимка перед публикацией ссылки.
- **Сохранение страницы** в Wayback Machine без браузера, из скриптов.
- **Массовый поиск**: например, все снимки сайта ведомства за 10 лет.
- **Memento-роутинг**: дать пользователю ссылку на ближайший по дате снимок.

## Базовые URL

| Сервис | Эндпоинт |
|:---|:---|
| Wayback Machine | `https://web.archive.org/web/` |
| SavePageNow 2 (SPN2) | `https://web.archive.org/save` |
| CDX Server API | `https://web.archive.org/cdx/search/cdx` |
| Availability API | `https://archive.org/wayback/available` |
| Memento TimeGate | `https://web.archive.org/web/<URL>` |
| Memento TimeMap | `https://web.archive.org/web/timemap/link/<URL>` |

CDX, Availability и Memento доступны без авторизации. SPN2 API требует ключей archive.org (см. ниже). Для всех сервисов действуют ограничения на частоту запросов.

## 1. SavePageNow 2 — отправить страницу на архивацию

Официальная документация — [SPN2 Public API Page Docs (2023-01-22)](https://archive.org/details/spn-2-public-api-page-docs-2023-01-22) (PDF в archive.org). Ниже — выжимка из неё.

### Авторизация

SPN2 API требует авторизации одним из двух способов:

1. **S3-ключи archive.org** (предпочтительно): получите их на [archive.org/account/s3.php](https://archive.org/account/s3.php) и передавайте заголовок `Authorization: LOW <access>:<secret>`.
2. **Cookies** `logged-in-sig` и `logged-in-user` из браузера (быстро устаревают).

Обязательно передавайте `Accept: application/json`, иначе сервер вернёт HTML-страницу.

Без авторизации можно сохранить отдельную страницу, просто открыв `https://web.archive.org/save/<URL>` в браузере, но с более жёсткими ограничениями.

### Запрос на захват

```bash
curl -X POST \
  -H "Accept: application/json" \
  -H "Authorization: LOW $IA_ACCESS:$IA_SECRET" \
  -d "url=https://example.com/article" \
  -d "if_not_archived_within=1d" \
  https://web.archive.org/save
```

Ответ — идентификатор задания, а не готовый снимок:

```json
{"url": "https://example.com/article", "job_id": "ac58789b-f3ca-48d0-9ea6-1d1225e98695"}
```

### Проверка статуса

```bash
curl -H "Accept: application/json" \
  -H "Authorization: LOW $IA_ACCESS:$IA_SECRET" \
  https://web.archive.org/save/status/ac58789b-f3ca-48d0-9ea6-1d1225e98695
```

Пока захват идёт, `status` равен `pending`. При успехе возвращаются `status: "success"`, `original_url`, `timestamp`, `duration_sec`, список `resources` и, при запросе, `outlinks` и `screenshot`. При ошибке — `status: "error"` и `status_ext` (например, `error:too-many-redirects`). Готовый снимок доступен по адресу `https://web.archive.org/web/<timestamp>/<original_url>`.

### Параметры захвата

Значение параметра включается только строками `1` или `on`.

| Параметр | Что делает |
|:---|:---|
| `capture_all=1` | Сохранить страницу, даже если она отвечает ошибкой (HTTP 4xx/5xx); по умолчанию такие ответы не сохраняются |
| `capture_outlinks=1` | Также сохранить ссылки со страницы (не более 100). Документация просит не включать без необходимости |
| `capture_screenshot=1` | Сделать полный скриншот страницы в PNG |
| `if_not_archived_within=<timedelta>` | Не сохранять заново, если есть снимок новее указанного срока (например, `1d`, `30d`) |
| `force_get=1` | Захват простым HTTP GET без браузера |
| `skip_first_archive=1` | Не проверять, первый ли это снимок URL (ускоряет захват) |
| `delay_wb_availability=1` | Снимок появится в Wayback Machine примерно через 12 часов (снижает нагрузку на IA) |
| `js_behavior_timeout=<N>` | Сколько секунд выполнять JS-поведения (прокрутка и т. п.); `0` ускоряет захват |
| `outlinks_availability=1` | Вернуть время последнего снимка для каждой исходящей ссылки |
| `email_result=1` | Прислать отчёт на e-mail аккаунта |

### Python

```python
import os
import time
import requests

HEADERS = {
    "Accept": "application/json",
    "Authorization": f"LOW {os.environ['IA_ACCESS']}:{os.environ['IA_SECRET']}",
}

def save_url(url: str, timeout: int = 180) -> str | None:
    r = requests.post(
        "https://web.archive.org/save",
        headers=HEADERS,
        data={"url": url, "if_not_archived_within": "1d"},
        timeout=60,
    )
    r.raise_for_status()
    job = r.json()
    if "job_id" not in job:
        raise RuntimeError(job)

    deadline = time.time() + timeout
    while time.time() < deadline:
        time.sleep(5)
        s = requests.get(
            f"https://web.archive.org/save/status/{job['job_id']}",
            headers=HEADERS, timeout=30,
        ).json()
        if s["status"] == "success":
            return f"https://web.archive.org/web/{s['timestamp']}/{s['original_url']}"
        if s["status"] == "error":
            raise RuntimeError(s.get("status_ext"), s.get("message"))
    return None

print(save_url("https://example.com/article"))
```

Готовая обёртка над тем же API — [waybackpy](/kb/instruments/tools/waybackpy) (`WaybackMachineSaveAPI`).

### Ограничения SPN2

По документу 2023 года: не больше 12 захватов в минуту для авторизованных пользователей и 4 для анонимных. Есть также предел одновременных заданий: при его превышении API возвращает ошибку. Другие ограничения: соединение с сайтом — до 10 с, посещение страницы — до 50 с, весь захват — до 2 мин, не больше 3 редиректов, файл — до 2 ГБ. Актуальные значения могут отличаться: ориентируйтесь на ответы API (HTTP 429 и сообщения об ошибках).

### Когда SPN2 недостаточно

SavePageNow рассчитан на отдельные страницы. Для сотен и тысяч URL и для целых сайтов соберите собственный архив ([Browsertrix](/kb/instruments/tools/browsertrix), [Wget](/kb/instruments/tools/wget)) и храните его у себя или в репозитории.

Загрузка WARC/WACZ в item на archive.org через [`ia`](/kb/instruments/tools/internet-archive-cli) **не добавляет** страницы в Wayback Machine. Файлы будут доступны как item для скачивания, но не как снимки в `web.archive.org/web/...`. В индекс Wayback Machine попадают захваты самого IA, а также партнёрские коллекции (Archive-It и соглашения с IA).

## 2. CDX Server API — индекс снимков

CDX API возвращает список снимков по URL, префиксу, хосту или домену. Документация: [wayback-cdx-server README](https://github.com/internetarchive/wayback/blob/master/wayback-cdx-server/README.md).

### Запрос: все снимки одного URL

```bash
curl 'https://web.archive.org/cdx/search/cdx?url=ruarxive.org/&limit=3'
```

Строка ответа — поля через пробел, по умолчанию `urlkey timestamp original mimetype statuscode digest length`:

```text
org,ruarxive)/ 20180511081052 https://ruarxive.org/ text/html 200 Q3M75PLO6Z7NE5GSJBPCCN4NBFF6FYIQ 6673
```

С `output=json` — массив массивов, первая строка содержит названия полей:

```json
[
  ["urlkey", "timestamp", "original", "mimetype", "statuscode", "digest", "length"],
  ["org,ruarxive)/", "20180511081052", "https://ruarxive.org/", "text/html", "200", "Q3M75PLO6Z7NE5GSJBPCCN4NBFF6FYIQ", "6673"]
]
```

### Параметры CDX

| Параметр | Что делает |
|:---|:---|
| `url=` | URL; адрес передаётся как есть (кириллические домены — в punycode или percent-encoding), SURT-ключ сервер строит сам |
| `matchType=exact` | Точное совпадение (по умолчанию) |
| `matchType=prefix` | Все URL под путём; то же, что `url=example.com/news/*` |
| `matchType=host` | Все URL на хосте |
| `matchType=domain` | Хост и все поддомены; то же, что `url=*.example.com` |
| `from=2024`, `to=20261231` | Диапазон дат (от 1 до 14 цифр `yyyyMMddhhmmss`) |
| `filter=statuscode:200` | Фильтр по полю (Java-regex); `!` в начале инвертирует. Параметр можно повторять |
| `collapse=urlkey` | Схлопнуть соседние строки с одинаковым значением поля (`collapse=timestamp:8` — одна запись в день) |
| `fl=timestamp,original` | Какие поля вернуть |
| `limit=N`, `limit=-N` | Первые или последние N строк |
| `offset=M` | Пропустить M строк (плохо масштабируется) |
| `showResumeKey=true`, `resumeKey=` | Постраничный обход больших выборок |
| `output=json` | JSON вместо текста |

Если `limit` не указан, сервер отдаёт все записи до своего внутреннего предела. Для широких запросов (`prefix`, `domain`) задавайте `limit` и используйте `resumeKey`.

### Пример: сколько уникальных HTML-страниц сайта в Wayback

```python
import requests

params = [
    ("url", "example.com"),
    ("matchType", "domain"),
    ("filter", "statuscode:200"),
    ("filter", "mimetype:text/html"),
    ("collapse", "urlkey"),
    ("fl", "original"),
    ("output", "json"),
    ("limit", "10000"),
]
r = requests.get("https://web.archive.org/cdx/search/cdx", params=params, timeout=120)
rows = r.json()
urls = {row[0] for row in rows[1:]}
print(f"Уникальных страниц: {len(urls)}")
```

Повторяющиеся параметры (`filter`) передаются списком кортежей: в словаре Python второй ключ `filter` перезаписал бы первый.

### Подводные камни CDX

- **Неполнота индекса.** Часть снимков может появляться в CDX с задержкой.
- **Тяжёлые запросы.** Выборки по большим доменам медленные и упираются в ограничения; дробите их по датам или путям.
- **Revisit-записи.** Строки с `mimetype` `warc/revisit` означают «содержимое не изменилось с прошлого снимка».

## 3. Availability API — есть ли страница в архиве?

Возвращает ближайший снимок к указанной дате:

```bash
curl 'https://archive.org/wayback/available?url=ruarxive.org/&timestamp=20220301'
```

```json
{
  "url": "ruarxive.org/",
  "archived_snapshots": {
    "closest": {
      "status": "200",
      "available": true,
      "url": "http://web.archive.org/web/20220306124401/https://ruarxive.org/",
      "timestamp": "20220306124401"
    }
  },
  "timestamp": "20220301"
}
```

Если снимок не найден, `archived_snapshots` пустой. Пустой ответ не всегда означает, что снимков нет: при проверке в октябре 2026 года запрос для `example.com/` вернул пустой результат, хотя снимки этого адреса есть в CDX. API удобен для разовых проверок, а для массовой обработки надёжнее CDX. Автор waybackpy тоже не рекомендует Availability API из-за проблем с производительностью.

```python
import requests

def wayback_link(url: str, ts: str | None = None) -> str:
    """Ссылка на ближайший снимок или исходный URL, если снимка нет."""
    params = {"url": url}
    if ts:
        params["timestamp"] = ts
    try:
        r = requests.get("https://archive.org/wayback/available", params=params, timeout=30)
        snap = r.json().get("archived_snapshots", {}).get("closest")
        if snap and snap.get("available"):
            return snap["url"]
    except requests.RequestException:
        pass
    return url
```

## 4. Memento — TimeGate и TimeMap

Memento — протокол IETF ([RFC 7089](https://datatracker.ietf.org/doc/html/rfc7089)) для доступа к прошлым версиям ресурсов. Wayback Machine его поддерживает.

### TimeGate — редирект к ближайшему снимку

TimeGate — адрес `https://web.archive.org/web/<URL>` без метки времени. Нужная дата передаётся заголовком `Accept-Datetime`:

```bash
# ближайший к текущему моменту
curl -I 'https://web.archive.org/web/https://example.com/'

# ближайший к 1 марта 2022 года
curl -I -H 'Accept-Datetime: Tue, 01 Mar 2022 12:00:00 GMT' \
  'https://web.archive.org/web/https://example.com/'
```

Ответ — `302` с заголовком `Location: https://web.archive.org/web/<timestamp>/https://example.com/`.

### TimeMap — все версии URL

```bash
curl 'https://web.archive.org/web/timemap/link/https://ruarxive.org/'
```

Формат link-format:

```text
<http://ruarxive.org/>; rel="original",
<https://web.archive.org/web/timemap/link/https://ruarxive.org/>; rel="self"; type="application/link-format"; from="Thu, 10 May 2018 18:40:44 GMT",
<https://web.archive.org/web/https://ruarxive.org/>; rel="timegate",
<https://web.archive.org/web/20180510184044/http://ruarxive.org/>; rel="first memento"; datetime="Thu, 10 May 2018 18:40:44 GMT",
<https://web.archive.org/web/20180511081052/https://ruarxive.org/>; rel="memento"; datetime="Fri, 11 May 2018 08:10:52 GMT",
...
```

Вариант `https://web.archive.org/web/timemap/json/<URL>` возвращает не JSON-формат Memento, а CDX-подобный массив массивов: первая строка — `["urlkey","timestamp","original","mimetype","statuscode","digest","length"]`, далее по строке на снимок.

### Memento Aggregator

Сервис [Time Travel](https://timetravel.mementoweb.org/) (`timetravel.mementoweb.org`) искал снимки сразу во многих архивах. В октябре 2026 года он не отвечал, поэтому на него нельзя полагаться в скриптах. Для ручного поиска по нескольким архивам удобно расширение [PastPage](/kb/instruments/tools/pastpage).

## 5. Поиск по содержимому

Открытого API полнотекстового поиска по Wayback Machine нет. CDX ищет только по URL и метаданным:

```bash
# адреса страниц сайта, в URL которых встречается "tools"
curl 'https://web.archive.org/cdx/search/cdx?url=ruarxive.org&matchType=domain&fl=original&collapse=urlkey&filter=original:.*tools.*&limit=100'
```

Для поиска по тексту своих коллекций используйте [SolrWayback](/kb/instruments/tools/solrwayback) или собственный индекс.

## 6. Коллекции Ruarxive на archive.org

```text
https://archive.org/details/@ruarxive
https://archive.org/details/echo-of-moscow
```

Это items и коллекции в каталоге archive.org: их скачивают через [`ia`](/kb/instruments/tools/internet-archive-cli).

## Когда что использовать

### Сохранить страницу

| Сценарий | Инструмент |
|:---|:---|
| Разовая операция | Форма или `web.archive.org/save/<URL>` |
| Автоматическое сохранение новых материалов (RSS и т. п.) | SPN2 API с ключами + cron, или [waybackpy](/kb/instruments/tools/waybackpy) |
| Сотни и тысячи URL, целые сайты | Собственный сбор (Browsertrix, Wget) и собственное хранение |

### Найти страницу

| Сценарий | Инструмент |
|:---|:---|
| «Существует ли снимок?» | Availability API или CDX с `limit=1` |
| «Все снимки этого URL по датам» | CDX API или TimeMap |
| «Снимки этого сайта за 2024 год» | CDX API с `matchType=domain`, `from`, `to` |
| «Поиск по содержимому» | SolrWayback на своих WARC |

## Полезные библиотеки

- **[waybackpy](https://github.com/akamhy/waybackpy)** — Python-обёртка над SPN, CDX и Availability API.
- **[internetarchive](https://github.com/jjjake/internetarchive)** — `ia` CLI и Python API для каталога archive.org.
- **[cdx_toolkit](https://github.com/commoncrawl/cdx_toolkit)** — CDX-клиент для Internet Archive и Common Crawl.

## Ресурсы

- [SPN2 Public API Page Docs (2023-01-22)](https://archive.org/details/spn-2-public-api-page-docs-2023-01-22) — документация SavePageNow 2.
- [CDX Server API](https://github.com/internetarchive/wayback/blob/master/wayback-cdx-server/README.md)
- [Memento (RFC 7089)](https://datatracker.ietf.org/doc/html/rfc7089)
- [Справочный центр Internet Archive](https://help.archive.org/)
- [Блог Internet Archive о Wayback Machine](https://blog.archive.org/category/wayback-machine/)

## Связанные материалы

- [Internet Archive CLI (ia)](/kb/instruments/tools/internet-archive-cli) — загрузка и скачивание items.
- [Waybackpy](/kb/instruments/tools/waybackpy) — Python-обёртка.
- [Wayback Machine — обзор](/kb/similar/internet-archive)
- [Common Crawl](/kb/similar/common-crawl) — другой большой веб-архив.
- [Perma.cc](/kb/similar/perma-cc)
- [pywb — локальный Wayback-сервер](/kb/instruments/replay/pywb) — поддерживает CDX и Memento.
- [Memento](/kb/instruments/replay/memento) — обзор протокола.
