---
title: Memento — стандарт «time travel» для веб-архивов
sidebar_label: Memento
description: "Memento (RFC 7089) — протокол доступа к прошлым версиям веб-страниц: TimeGate, TimeMap, агрегаторы. Реализации: Wayback Machine, pywb, OpenWayback, IPWB, MemGator."
last_update:
  date: 2026-10-28
keywords: [memento, rfc7089, timegate, timemap, aggregator, wayback, memgator]
---

# Memento — стандарт «time travel» для веб-архивов

[Memento](https://datatracker.ietf.org/doc/html/rfc7089) — протокол, описанный в RFC 7089 (2013, категория Informational). Он определяет, как HTTP-клиент (браузер, скрипт, расширение) может попросить у архива версию URL, ближайшую к нужной дате, или получить список всех снимков. Проект Memento ведёт сайт [mementoweb.org](https://mementoweb.org/).

> **Зачем архивисту:** без Memento у каждой архивной системы свой API. С Memento одинаковые запросы работают в Wayback Machine, в архивах на pywb и во многих национальных веб-архивах, а **агрегатор** опрашивает их сразу.

## Четыре вида URI

| Обозначение | Что это | Пример |
|:---|:---|:---|
| **URI-R** (Original Resource) | Живой URL, который архивировали | `https://example.com/` |
| **URI-M** (Memento) | Конкретный архивный снимок с фиксированной датой | `https://web.archive.org/web/20200615115707/http://example.com/` |
| **URI-G** (TimeGate) | Ресурс, который по дате выбирает ближайший снимок | `https://web.archive.org/web/https://example.com/` |
| **URI-T** (TimeMap) | Список всех снимков для URI-R | `https://web.archive.org/web/timemap/link/https://example.com/` |

## TimeGate — ближайший снимок к дате

Дата передаётся заголовком `Accept-Datetime` в формате HTTP-date (RFC 1123), например `Mon, 15 Jun 2020 12:00:00 GMT`. Формат ISO 8601 в этом заголовке не допускается. Без заголовка TimeGate возвращает самый свежий снимок.

```bash
curl -I \
  -H 'Accept-Datetime: Mon, 15 Jun 2020 12:00:00 GMT' \
  'https://web.archive.org/web/https://example.com/'
```

Ответ Wayback Machine (сокращённо):

```
HTTP/2 302
location: https://web.archive.org/web/20200615115707/http://example.com/
vary: accept-datetime
link: <https://example.com/>; rel="original", <https://web.archive.org/web/20200615115707/http://example.com/>; rel="memento"; datetime="Mon, 15 Jun 2020 11:57:07 GMT", <https://web.archive.org/web/timemap/link/https://example.com/>; rel="timemap"; ...
```

Не все TimeGate отвечают редиректом: например, pywb по умолчанию сразу отдаёт снимок с кодом 200 и указывает канонический адрес в `Content-Location` (это допустимый вариант протокола).

### TimeGate и TimeMap других архивов

Адреса ниже взяты из [списка архивов](https://oduwsdl.github.io/MemGator/archives.json), который использует агрегатор MemGator. Список поддерживается сообществом и может устаревать.

| Архив | TimeGate | TimeMap (link-format) |
|:---|:---|:---|
| Internet Archive | `https://web.archive.org/web/<url>` | `https://web.archive.org/web/timemap/link/<url>` |
| Archive.today | `http://archive.today/timegate/<url>` | `http://archive.today/timemap/<url>` |
| Arquivo.pt (Португалия) | `https://arquivo.pt/wayback/<url>` | `https://arquivo.pt/wayback/timemap/link/<url>` |
| UK Web Archive | `https://www.webarchive.org.uk/wayback/archive/<url>` | `https://www.webarchive.org.uk/wayback/archive/timemap/link/<url>` |
| Archive-It | `https://wayback.archive-it.org/all/<url>` | `https://wayback.archive-it.org/all/timemap/link/<url>` |
| Perma.cc | `https://perma.cc/timegate/<url>` | `https://perma.cc/timemap/link/<url>` |

## TimeMap — все снимки URL

```bash
# В link-format
curl 'https://web.archive.org/web/timemap/link/https://ruarxive.org/'
```

Ответ (начало):

```
<http://ruarxive.org/>; rel="original",
<https://web.archive.org/web/timemap/link/https://ruarxive.org/>; rel="self"; type="application/link-format"; from="Thu, 10 May 2018 18:40:44 GMT",
<https://web.archive.org/web/https://ruarxive.org/>; rel="timegate",
<https://web.archive.org/web/20180510184044/http://ruarxive.org/>; rel="first memento"; datetime="Thu, 10 May 2018 18:40:44 GMT",
<https://web.archive.org/web/20180511081052/https://ruarxive.org/>; rel="memento"; datetime="Fri, 11 May 2018 08:10:52 GMT",
```

У Wayback Machine есть и JSON-вариант. Это **массив массивов**: первая строка — названия полей, дальше — по строке на снимок (как в CDX API).

```bash
curl 'https://web.archive.org/web/timemap/json/https://ruarxive.org/' | head -3
```

```json
[["urlkey","timestamp","original","mimetype","statuscode","digest","length"],
["org,ruarxive)/","20180510184044","http://ruarxive.org/","unk","301","3I42H3S6NNFQ2MSVX7XZKYAYSCX5QBYJ","409"],
["org,ruarxive)/","20180511081052","https://ruarxive.org/","text/html","200","Q3M75PLO6Z7NE5GSJBPCCN4NBFF6FYIQ","6673"],
```

Формат JSON не стандартизирован: у pywb, например, `timemap/json` отдаёт NDJSON — по объекту на строку.

## Агрегаторы — поиск сразу по многим архивам

:::warning TimeTravel недоступен
Публичный агрегатор Memento Time Travel (`timetravel.mementoweb.org`) не работает: на октябрь 2026 года у домена нет DNS-записи. Сайт проекта [mementoweb.org](https://mementoweb.org/) при этом доступен. Старые инструкции и скрипты, которые обращаются к `timetravel.mementoweb.org/api/...`, нужно перевести на другой агрегатор.
:::

Рабочая альтернатива — [MemGator](https://github.com/oduwsdl/MemGator), открытый агрегатор на Go от лаборатории ODU WS-DL. Он работает и как утилита командной строки, и как сервер; готовые сборки для Linux, macOS и Windows лежат в [релизах](https://github.com/oduwsdl/MemGator/releases), есть Docker-образ `oduwsdl/memgator`.

```bash
# TimeMap по всем архивам из списка, вывод в JSON
memgator -f JSON https://ruarxive.org/

# Описание снимка, ближайшего к дате
memgator https://ruarxive.org/ 20220303

# Сервер с эндпойнтами /timemap/{link|json|cdxj}/{URI-R} и /timegate/{URI-R}
memgator server
```

В JSON-ответе MemGator снимки лежат в `mementos.list`, а первый и последний — в `mementos.first` и `mementos.last`. Для совместимости с прежним API TimeTravel у сервера есть эндпойнт `/api`. Список опрашиваемых архивов задаётся флагом `-a` (локальный файл или URL).

> Команды MemGator проверены на версии 1.0-rc9 (октябрь 2026).

## Ещё о протоколе

### Шаблоны развёртывания (Patterns)

В RFC 7089 «шаблоны» (Patterns 1.1–2.3 и др.) — это варианты того, где находятся URI-R, URI-G и URI-M и как TimeGate отвечает: редиректом 302 или сразу снимком с кодом 200. Специального HTTP-заголовка для них нет.

### Формат даты

В заголовках `Accept-Datetime` и `Memento-Datetime` используется только HTTP-date:

```
Mon, 01 Jun 2026 12:00:00 GMT
```

В URL самих снимков архивы обычно используют 14-значную метку `YYYYMMDDhhmmss`, но это соглашение архивов, а не часть протокола.

## Программные обёртки

### Python: requests

Код проверен на Wayback Machine в октябре 2026 года.

```python
from datetime import datetime, timezone
from email.utils import format_datetime

import requests


def memento_for(url: str, when: datetime | None = None) -> str | None:
    """URL ближайшего снимка в Wayback Machine или None."""
    headers = {}
    if when:
        headers["Accept-Datetime"] = format_datetime(when.astimezone(timezone.utc), usegmt=True)
    r = requests.head(
        f"https://web.archive.org/web/{url}",
        headers=headers,
        allow_redirects=False,
        timeout=60,
    )
    return r.headers.get("Location")


def time_map(url: str) -> list[str]:
    """Список URL всех снимков (JSON TimeMap Wayback Machine)."""
    r = requests.get(f"https://web.archive.org/web/timemap/json/{url}", timeout=120)
    r.raise_for_status()
    rows = r.json()
    if not rows:
        return []
    header, *data = rows
    ts, orig = header.index("timestamp"), header.index("original")
    return [f"https://web.archive.org/web/{row[ts]}/{row[orig]}" for row in data]


print(memento_for("https://ruarxive.org/", datetime(2022, 3, 3, tzinfo=timezone.utc)))
print(len(time_map("https://ruarxive.org/")), "снимков")
```

### Библиотека waybackpy

[waybackpy](/kb/instruments/tools/waybackpy) работает не через Memento, а через CDX API Wayback Machine, но решает те же задачи.

```bash
pip install waybackpy
```

```python
from waybackpy import WaybackMachineCDXServerAPI

UA = "my-research-script/1.0 (contact@example.org)"

# Ближайший снимок к дате
cdx = WaybackMachineCDXServerAPI("https://ruarxive.org/", user_agent=UA)
snap = cdx.near(year=2022, month=3, day=3)
print(snap.archive_url, snap.timestamp)

# Все снимки за 2022 год
cdx = WaybackMachineCDXServerAPI(
    "https://ruarxive.org/", user_agent=UA,
    start_timestamp="2022", end_timestamp="2022",
)
for snap in cdx.snapshots():
    print(snap.timestamp, snap.original, snap.statuscode)
```

> Пример проверен на waybackpy 3.0.6 (октябрь 2026). Классов `WaybackMachine` и методов `near(time=...)` в этой версии нет.

## Расширения браузера

| Инструмент | Тип | Что делает |
|:---|:---|:---|
| **[Wayback Machine](https://chromewebstore.google.com/detail/wayback-machine/fpnmgdkabkmnadcjpehmlllkndpkmiak)** ([Firefox](https://addons.mozilla.org/en-US/firefox/addon/wayback-machine_new/)) | Официальное расширение Internet Archive | Сохранение страниц, просмотр снимков, подсказки при ошибке 404 |
| **[Resurrect Pages](https://addons.mozilla.org/en-US/firefox/addon/resurrect-pages/)** | Расширение Firefox | Поиск копий недоступной страницы в нескольких архивах |
| **[PastPage](/kb/instruments/tools/pastpage)** ([Chrome](https://chromewebstore.google.com/detail/pastpage-query-10+-web-ar/icpegbecignmplpkjjcegmjmfadpcpoo), [Firefox](https://addons.mozilla.org/en-US/firefox/addon/pastpage-query-10-web-archives/)) | Расширение | Поиск снимков страницы сразу в нескольких веб-архивах |

## Реализации серверной части

| Система | Поддержка Memento | TimeGate |
|:---|:-:|:---|
| Internet Archive (Wayback Machine) | ✅ | `https://web.archive.org/web/<url>` |
| [pywb](/kb/instruments/replay/pywb) | ✅ | `/<коллекция>/<url>` |
| [OpenWayback](/kb/instruments/replay/openwayback) | ✅ | зависит от настройки установки |
| [IPWB](/kb/instruments/replay/ipwb) | ✅ (TimeMap и заголовки `Link`) | — |
| [SolrWayback](/kb/instruments/tools/solrwayback) | ✅ (в коде есть модуль Memento) | см. документацию проекта |
| MemGator (агрегатор) | ✅ | `/timegate/<url>` |

Conifer (Rhizome), который раньше часто упоминали в этом ряду, с мая 2026 года прекратил работу как сервис записи: создание и изменение коллекций отключено. Для новых записей используйте ArchiveWeb.page или [Browsertrix](/kb/instruments/tools/browsertrix).

Настройка Memento на своём сервере — в статье [pywb](/kb/instruments/replay/pywb) (раздел «Memento API»).

## Когда использовать Memento

✅ Подходит:

- Дать пользователю ссылку на архивную версию без ручного перебора дат.
- Программно проверять, в каких архивах есть URL (через агрегатор).
- В скриптах автоматически выбирать ближайший снимок для цитирования.
- В браузерных расширениях для поиска копий страниц, которые отдают 404.

❌ Не подходит:

- Полнотекстовый поиск по содержимому — протокол работает только с URL и датами.
- Страницы, которые ещё никто не заархивировал: Memento находит снимки, но не создаёт их.
- Закрытые архивы — нужна отдельная авторизация.

## Ресурсы

- [RFC 7089 — Memento](https://datatracker.ietf.org/doc/html/rfc7089) — спецификация.
- [mementoweb.org](https://mementoweb.org/) — сайт проекта Memento.
- [mementoweb.org/tools](https://mementoweb.org/tools/) — список клиентов и серверов.
- [MemGator](https://github.com/oduwsdl/MemGator) — агрегатор Memento.

## Связанные материалы

- [Wayback Machine API](/kb/instruments/tools/wayback-api) — практический справочник API Wayback Machine.
- [pywb](/kb/instruments/replay/pywb) — Python-сервер с поддержкой Memento.
- [Internet Archive](/kb/similar/internet-archive) — крупнейший архив с поддержкой Memento.
- [ReplayWeb.page](/kb/instruments/replay/replayweb-page) — клиентский плеер (Memento не поддерживает).
- [FAQ](/kb/faq) — ответы на частые вопросы об архивации.
