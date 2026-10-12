---
title: Waybackpy — Python-обёртка для Wayback Machine
sidebar_label: Waybackpy
description: "Waybackpy — Python-библиотека и CLI для API Wayback Machine: сохранение страниц через SavePageNow, поиск снимков через CDX API, Availability API."
last_update:
  date: 2026-10-12
keywords: [waybackpy, wayback-machine, archive.org, api, python, cdx]
---

# Waybackpy — Python-обёртка для Wayback Machine

[waybackpy](https://github.com/akamhy/waybackpy) — Python-библиотека и консольная утилита для работы с API Wayback Machine. Автор — Akash Mahanty ([akamhy](https://github.com/akamhy)), лицензия MIT. Последний релиз — 3.0.6, последние изменения в репозитории — февраль 2024 года: проект работает, но почти не развивается.

> **Зачем:** обёртка над [Wayback Machine API](/kb/instruments/tools/wayback-api). Избавляет от ручного разбора ответов CDX и SavePageNow.

## Что умеет

Библиотека экспортирует три класса (плюс устаревший класс `Url` для совместимости):

| Класс | API Internet Archive | Основные методы |
|:---|:---|:---|
| `WaybackMachineSaveAPI` | SavePageNow (`/save/`) | `save()`, `timestamp()`, свойство `cached_save` |
| `WaybackMachineCDXServerAPI` | CDX Server | `oldest()`, `newest()`, `near(...)`, `snapshots()` |
| `WaybackMachineAvailabilityAPI` | Availability API | `oldest()`, `newest()`, `near(...)` |

Библиотека синхронная (построена на `requests`), асинхронного интерфейса нет.

## Установка

```bash
pip install waybackpy
```

Также есть пакет в conda-forge (`conda install -c conda-forge waybackpy`).

> Команды и примеры сверены с README и установленной версией 3.0.6 (октябрь 2026).

Во всех классах вторым аргументом передаётся `user_agent`. Укажите осмысленную строку с контактом: это вежливо по отношению к Internet Archive и снижает риск блокировки.

## Использование в Python

### Сохранить страницу (SavePageNow)

```python
from waybackpy import WaybackMachineSaveAPI

ua = "MyArchiveBot/1.0 (+mailto:me@example.org)"
save_api = WaybackMachineSaveAPI("https://example.com/article", ua)
archive_url = save_api.save()
print(archive_url)            # https://web.archive.org/web/2026.../https://example.com/article
print(save_api.cached_save)   # True, если IA вернул недавний снимок вместо нового
print(save_api.timestamp())   # datetime снимка
```

### Найти снимки (CDX API)

```python
from waybackpy import WaybackMachineCDXServerAPI

ua = "MyArchiveBot/1.0 (+mailto:me@example.org)"
cdx = WaybackMachineCDXServerAPI("https://example.com/", ua)

oldest = cdx.oldest()
print(oldest.timestamp, oldest.archive_url)

newest = cdx.newest()
near = cdx.near(year=2022, month=3, day=1)
print(near.archive_url, near.statuscode)
```

У объекта снимка (`CDXSnapshot`) есть поля `urlkey`, `timestamp`, `datetime_timestamp`, `original`, `mimetype`, `statuscode`, `digest`, `length`, `archive_url`.

Метод `near()` принимает `year`, `month`, `day`, `hour`, `minute`, либо `unix_timestamp`, либо `wayback_machine_timestamp` (например, `2008080808`).

### Список снимков с фильтрами

```python
from waybackpy import WaybackMachineCDXServerAPI

cdx = WaybackMachineCDXServerAPI(
    "example.com",
    "MyArchiveBot/1.0 (+mailto:me@example.org)",
    start_timestamp="2022",
    end_timestamp="2023",
    match_type="prefix",          # exact (по умолчанию), prefix, host, domain
    filters=["statuscode:200", "mimetype:text/html"],
    collapses=["urlkey"],         # по одной записи на URL
)

for snap in cdx.snapshots():
    print(snap.timestamp, snap.original)
```

Параметры конструктора: `start_timestamp`, `end_timestamp`, `filters`, `match_type`, `sort`, `collapses`, `limit`, `use_pagination`, `closest`, `max_tries`. Они соответствуют параметрам CDX Server API.

### Availability API

```python
from waybackpy import WaybackMachineAvailabilityAPI

api = WaybackMachineAvailabilityAPI("https://example.com/", "MyArchiveBot/1.0")
print(api.near(year=2020, month=1))
```

Автор библиотеки **не рекомендует** Availability API из-за проблем с производительностью: все его методы есть и в `WaybackMachineCDXServerAPI`.

### Исключения

Из `waybackpy.exceptions`: `NoCDXRecordFound` (снимков нет), `TooManyRequestsError` (HTTP 429), `BlockedSiteError` (сайт исключён из Wayback Machine), `MaximumSaveRetriesExceeded`, `MaximumRetriesExceeded`, `ArchiveNotInAvailabilityAPIResponse`, базовое `WaybackError`.

```python
import time
from waybackpy import WaybackMachineCDXServerAPI
from waybackpy.exceptions import NoCDXRecordFound, TooManyRequestsError

def first_snapshot(url, ua="MyArchiveBot/1.0", tries=3):
    for attempt in range(tries):
        try:
            return WaybackMachineCDXServerAPI(url, ua).oldest().archive_url
        except NoCDXRecordFound:
            return None
        except TooManyRequestsError:
            time.sleep(30 * (attempt + 1))
    return None
```

## CLI

Консольная команда — `waybackpy` (вызов `python -m waybackpy` не работает: в пакете нет `__main__.py`).

```bash
# сохранить страницу
waybackpy --url "https://example.com/" --user-agent "MyArchiveBot/1.0" --save

# самый старый и самый новый снимок
waybackpy --url "https://example.com/" --oldest
waybackpy --url "https://example.com/" --newest

# снимок, ближайший к дате: --near и отдельные флаги даты
waybackpy --url "https://example.com/" --near --year 2022 --month 3 --day 1

# известные URL домена (через CDX), с поддоменами, с записью в файл
waybackpy --url "example.com" --known-urls --subdomain --file

# сырой запрос к CDX
waybackpy --url "example.com" --cdx --match-type prefix \
  --cdx-filter "statuscode:200" --collapse urlkey --limit 100
```

Используйте длинные имена флагов: в версии 3.0.6 короткие `-f`, `-l` и `-st` объявлены дважды (например, `-f` означает и `--file`, и `--cdx-filter`), и новые версии Click выводят предупреждения. Документация CLI — в [wiki](https://github.com/akamhy/waybackpy/wiki/CLI-docs).

## Когда использовать

✅ Подходит:

- для скриптов автоматизации на Python: проверки битых ссылок, точечного сохранения страниц;
- для научных и OSINT-задач: проверить, есть ли материал в архиве и с какой даты.

❌ Не подходит:

- для массового сохранения: у SavePageNow есть ограничения на число запросов, при больших объёмах вы получите `TooManyRequestsError`;
- для асинхронной или высоконагруженной обработки: библиотека синхронная;
- для других архивов: для Common Crawl и IA одновременно есть [cdx_toolkit](https://github.com/commoncrawl/cdx_toolkit).

## Ресурсы

- [GitHub](https://github.com/akamhy/waybackpy)
- [PyPI](https://pypi.org/project/waybackpy/)
- [Документация Python-пакета](https://github.com/akamhy/waybackpy/wiki/Python-package-docs)
- [Документация CLI](https://github.com/akamhy/waybackpy/wiki/CLI-docs)

## Связанные материалы

- [Wayback Machine API](/kb/instruments/tools/wayback-api) — низкоуровневый справочник.
- [Memento](/kb/instruments/replay/memento) — стандарт TimeGate/TimeMap.
- [Internet Archive CLI (ia)](/kb/instruments/tools/internet-archive-cli) — для каталога archive.org.
- [Ландшафт 2026](/kb/instruments/landscape-2026)
