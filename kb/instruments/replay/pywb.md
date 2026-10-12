---
title: pywb — Python Wayback Machine
sidebar_label: pywb (Python Wayback)
description: "pywb — серверная система воспроизведения веб-архивов на Python от Webrecorder. Установка, коллекции WARC/WACZ, config.yaml, CDX API, Memento, развёртывание за nginx."
last_update:
  date: 2026-10-12
keywords: [pywb, wayback, replay, warc, wacz, cdxj, api, memento]
---

# pywb — Python Wayback Machine

[pywb](https://github.com/webrecorder/pywb) — серверная система воспроизведения веб-архивов на Python 3, разработанная Webrecorder. Работает с WARC и ARC (WACZ — через распаковку при добавлении в коллекцию), предоставляет веб-интерфейс с календарём снимков, CDX API и Memento API. IIPC рекомендует pywb как замену OpenWayback, а в документации pywb есть [руководство по переходу](https://pywb.readthedocs.io/en/latest/manual/owb-transition.html). Wayback Machine самого Internet Archive работает на собственном стеке, а не на pywb.

> **Главное отличие от ReplayWeb.page:** pywb — это сервер. Несколько пользователей могут одновременно читать архив по обычным HTTP-ссылкам. ReplayWeb.page обрабатывает всё локально в браузере одного пользователя.

## Зачем нужен архивисту

- **Публичный доступ:** постоянные ссылки вида `https://archive.example.org/my-coll/20260601120000/https://example.com/`.
- **Несколько коллекций:** параллельно хостить архив газеты, архив госсайта и личный архив исследователя.
- **CDX/Memento API:** программный поиск снимков по URL через HTTP.
- **Динамические коллекции:** WARC, добавленные через `wb-manager add`, индексируются сразу и доступны без перезапуска сервера.
- **Запись:** у pywb есть режим записи с живого веба (`wayback --record`), хотя для обхода сайтов обычно используют отдельные краулеры.

## Когда использовать

✅ Подходит:

- Хостинг одного или нескольких архивов для команды или сообщества.
- Большие коллекции; для них документация рекомендует внешний индекс [OutbackCDX](https://github.com/nla/outbackcdx) или ZipNum-индекс.
- Программный доступ (CDX/Memento).
- Замена существующей установки OpenWayback.

❌ Не подходит:

- Разовое открытие одного файла без настройки — проще [ReplayWeb.page](/kb/instruments/replay/replayweb-page).
- Когда у вас только ZIM-файлы (Kiwix) — для них есть kiwix-serve; см. также [warc2zim](/kb/instruments/tools/warc2zim).
- Полнотекстовый поиск по содержимому — pywb ищет только по URL; для текста нужен отдельный движок, например [SolrWayback](/kb/instruments/tools/solrwayback).

## Установка

### Через pip (рекомендуется)

```bash
python3 -m venv pywb-env
source pywb-env/bin/activate
pip install pywb
```

Требования: Python от 3.9 до 3.14 (по метаданным пакета на PyPI).

### Через Docker

Официальный образ `webrecorder/pywb` работает из каталога `/webarchive` — его и нужно монтировать как том:

```bash
docker pull webrecorder/pywb

# создать коллекцию и добавить WARC
docker run -e INIT_COLLECTION=my-coll \
  -v /pywb-data:/webarchive \
  -v /path/to:/source \
  webrecorder/pywb wb-manager add my-coll /source/my_warc.warc.gz

# запустить сервер на порту 8080
docker run -p 8080:8080 -v /pywb-data:/webarchive webrecorder/pywb wayback
```

Если команду `wayback` не указать, контейнер запускает production-сервер uWSGI.

### Из исходников (для разработки)

```bash
git clone https://github.com/webrecorder/pywb
cd pywb
pip install -e .
```

> Команды сверены с документацией и `--help` pywb 2.10.0 (октябрь 2026).

## Быстрый старт

### Шаг 1. Создать коллекцию

```bash
mkdir my-archive-dir
cd my-archive-dir
wb-manager init my-coll
```

`wb-manager init` создаёт каталоги коллекции (файл `config.yaml` не создаётся — он не обязателен):

```
.
├── collections/
│   └── my-coll/
│       ├── archive/     # WARC/ARC-файлы
│       ├── indexes/     # CDXJ-индексы
│       ├── static/
│       └── templates/
├── static/
└── templates/
```

### Шаг 2. Добавить архивы

```bash
# WARC или ARC: файл копируется в archive/ и сразу индексируется
wb-manager add my-coll ~/Downloads/my-site-2026.warc.gz

# WACZ: WARC-файлы и индексы распаковываются в коллекцию
wb-manager add --unpack-wacz my-coll ~/Downloads/my-site-2026.wacz
```

### Шаг 3. Запустить сервер

```bash
wayback            # порт 8080 по умолчанию
wayback -p 8090    # другой порт
wayback -a         # с фоновой автоиндексацией каталога archive/
```

Откройте `http://localhost:8080/my-coll/` — появится поиск по коллекции.

### Шаг 4. Открыть нужную страницу

```
http://localhost:8080/<коллекция>/<timestamp>/<оригинальный URL>
```

Примеры:

```
# Снимок на конкретную дату (14 цифр или короче)
http://localhost:8080/my-coll/20260601120000/https://example.com/

# Без даты — самый свежий снимок
http://localhost:8080/my-coll/https://example.com/
```

Если точного снимка нет, pywb выберет ближайший по времени.

Полезные модификаторы после timestamp: `mp_` — содержимое без рамки с баннером, `id_` — исходный ответ без переписывания ссылок (например, `.../20260601120000id_/https://example.com/`).

## Основные команды

| Команда | Что делает |
|:---|:---|
| `wb-manager init <coll>` | создать коллекцию |
| `wb-manager add <coll> <files…>` | скопировать WARC/ARC в коллекцию и проиндексировать |
| `wb-manager add --unpack-wacz <coll> <file.wacz>` | добавить содержимое WACZ |
| `wb-manager reindex <coll>` | пересобрать индекс всей коллекции |
| `wb-manager list` | список коллекций |
| `wb-manager cdx-convert <path>` | перевести старые CDX-индексы в CDXJ |
| `wb-manager -d <dir> …` | работать с другим корневым каталогом |
| `wayback -p PORT -b ADDR` | порт и адрес (по умолчанию 8080 и 0.0.0.0) |
| `wayback -a --auto-interval 30` | автоиндексация каждые 30 секунд |
| `wayback --proxy <coll>` | доступ к коллекции в режиме HTTP/S-прокси |
| `wayback --record --live` | запись с живого веба в коллекцию |

## Конфигурация

`config.yaml` лежит в корне рабочего каталога и нужен только для изменения поведения по умолчанию. Порт задаётся флагом `-p` или настройками uWSGI, а не в `config.yaml`.

### Базовый config.yaml

```yaml
# Включён по умолчанию
enable_memento: true

# Показ архива во фрейме с баннером (по умолчанию true)
framed_replay: true

# Автоиндексация каталогов archive/ с интервалом в секундах
autoindex: 30
```

### Коллекции вне стандартной структуры

Коллекции из каталога `collections/` подключаются автоматически, их не нужно перечислять в конфиге. Если архивы лежат в другом месте, коллекцию можно описать явно:

```yaml
collections:
  echo-msk:
    index_paths: /data/echo-msk/indexes/
    archive_paths: /data/echo-msk/archive/
  govt:
    index_paths: /data/govt/indexes/
    archive_paths: /data/govt/archive/
```

URL-адреса тогда будут такими:

```
http://localhost:8080/echo-msk/2022/https://echo.msk.ru/
http://localhost:8080/govt/2026/https://minfin.gov.ru/
```

В `archive_paths` можно указать список путей, включая HTTP-адрес, — pywb будет искать WARC по очереди. Другие ключи (`collections_root`, `redirect_to_exact`, `cdx_api_endpoint`, `recorder`, правила доступа) описаны в разделе [Configuring the Web Archive](https://pywb.readthedocs.io/en/latest/manual/configuring.html).

### Развёртывание за nginx

Для небольшой нагрузки достаточно команды `wayback`. Для production документация рекомендует uWSGI (файл `uwsgi.ini` из репозитория, протокол uwsgi на порту 8081) и nginx перед ним:

```nginx
server {
    listen 80;
    server_name playback.example.org;

    location /static {
        alias /path/to/pywb/static;
    }

    location / {
        uwsgi_pass localhost:8081;
        include uwsgi_params;
        uwsgi_param UWSGI_SCHEME $scheme;
    }
}
```

Готовые примеры Docker Compose с nginx и Apache лежат в каталоге [`sample-deploy`](https://github.com/webrecorder/pywb/tree/main/sample-deploy) репозитория. Подробности — в разделе [Deployment](https://pywb.readthedocs.io/en/latest/manual/usage.html#deployment).

## CDX API — программный поиск по коллекции

Эндпойнт `/<коллекция>/cdx` возвращает строки индекса. Архивные файлы при этом не читаются.

### Все URL домена

```bash
curl 'http://localhost:8080/my-coll/cdx?url=example.com/*&output=json'
```

`output=json` возвращает NDJSON — по JSON-объекту на строку:

```json
{"urlkey": "com,example)/", "timestamp": "20260601120000", "url": "https://example.com/", "mime": "text/html", "status": "200", "digest": "RCIC6MYNZYL6TXWY2442SJWB7AE6GKKW", "length": "422", "offset": "254", "filename": "sample.warc.gz", "source": "my-coll/indexes/index.cdxj", "source-coll": "my-coll", "access": "allow"}
```

Без `output` ответ приходит в «родном» формате CDXJ: `SURT TIMESTAMP {json}`.

### Префикс и домен

```bash
# Все страницы, начинающиеся на /news/
curl 'http://localhost:8080/my-coll/cdx?url=example.com/news/*&output=json'

# Хост и все поддомены
curl 'http://localhost:8080/my-coll/cdx?url=*.example.com&output=json'

# Все снимки одного URL
curl 'http://localhost:8080/my-coll/cdx?url=example.com/&output=json'
```

### Фильтр по дате

```bash
# Только 2026 год (timestamp дополняется до 14 цифр)
curl 'http://localhost:8080/my-coll/cdx?url=example.com/*&from=2026&to=2026&output=json'
```

### Фильтры по полям и регулярные выражения

```bash
# Только HTML со статусом 200
curl 'http://localhost:8080/my-coll/cdx?url=example.com/*&filter==mime:text/html&filter==status:200&output=json'

# URL, оканчивающиеся на .png (регулярное выражение через ~)
curl 'http://localhost:8080/my-coll/cdx?url=example.com/*&filter=~url:.*\.png$&output=json'
```

Остальные параметры (`limit`, `sort`, `fields`, `matchType`, постраничный вывод для ZipNum) — в [документации CDX Server API](https://pywb.readthedocs.io/en/latest/manual/cdxserver_api.html).

## Memento API — TimeGate и TimeMap

Memento — стандарт IETF (RFC 7089). В pywb он включён по умолчанию (`enable_memento: true`).

### TimeMap — все версии URL

```bash
curl 'http://localhost:8080/my-coll/timemap/link/https://example.com/'
```

Ответ в формате `application/link-format`:

```
<http://localhost:8080/my-coll/timemap/link/https://example.com/>; rel="self"; type="application/link-format"; from="Mon, 01 Jun 2026 12:00:00 GMT",
<http://localhost:8080/my-coll/https://example.com/>; rel="timegate",
<https://example.com/>; rel="original",
<http://localhost:8080/my-coll/20260601120000mp_/https://example.com/>; rel="memento"; datetime="Mon, 01 Jun 2026 12:00:00 GMT"; collection="my-coll",
<http://localhost:8080/my-coll/20260701120000mp_/https://example.com/>; rel="memento"; datetime="Wed, 01 Jul 2026 12:00:00 GMT"; collection="my-coll"
```

Вместо `link` можно указать `cdxj` или `json` (NDJSON).

### TimeGate — снимок, ближайший к дате

TimeGate — это обычный адрес `/<коллекция>/<URL>`:

```bash
curl -I -H 'Accept-Datetime: Mon, 15 Jun 2026 12:00:00 GMT' \
  'http://localhost:8080/my-coll/https://example.com/'
```

По умолчанию pywb сразу отдаёт найденный снимок (ответ 200, канонический адрес — в заголовке `Content-Location`, шаблон Memento 2.2). Чтобы TimeGate отвечал редиректом 302 (шаблон 2.3), добавьте в `config.yaml` строку `redirect_to_exact: true`.

Подробнее: [Memento в pywb](https://pywb.readthedocs.io/en/latest/manual/memento.html), [RFC 7089](https://datatracker.ietf.org/doc/html/rfc7089), а также страница [Memento](/kb/instruments/replay/memento).

## Масштабирование

- Для тестов и небольшой нагрузки достаточно `wayback`: сервер построен на gevent и держит много одновременных соединений в одном процессе.
- Для production — uWSGI (можно в несколько процессов) и nginx или Apache перед ним.
- Для больших индексов вместо файлов CDXJ используют OutbackCDX или сжатый ZipNum-индекс (см. разделы [OutbackCDX](https://pywb.readthedocs.io/en/latest/manual/outbackcdx.html) и [Indexing](https://pywb.readthedocs.io/en/latest/manual/indexing.html) документации).
- Redis нужен только для дедупликации в режиме записи (`recorder: dedup_policy`), для воспроизведения он не требуется.

## Сравнение с альтернативами

| Возможность | pywb | OpenWayback | IPWB | ReplayWeb.page |
|:---|:-:|:-:|:-:|:-:|
| Язык | Python | Java | Python | JavaScript (в браузере) |
| WARC / WACZ | ✅ / через `--unpack-wacz` | ✅ / ❌ | ✅ / ❌ | ✅ / ✅ |
| CDX API | ✅ | ✅ | ❌ | ❌ |
| Memento | ✅ | ✅ | ✅ | ❌ |
| Несколько коллекций | ✅ | ✅ | ❌ | список загруженных архивов |
| Self-hosted | ✅ | ✅ | ✅ (нужен узел IPFS) | ✅ статика |
| Статус | развивается | не развивается | поддерживается | развивается |

## Best practices

### Резервное копирование

Сохраняйте `config.yaml`, каталоги `collections/<name>/` и индексы. WARC можно восстановить из основного хранилища, а индекс большой коллекции пересобирается долго (`wb-manager reindex`).

### Публичный доступ

Ставьте перед pywb nginx или Apache. Если включён живой веб (`--live`) или запись, ограничьте, к каким адресам сервер может обращаться: документация описывает опцию `live_url_filter` и рекомендует дополнительно закрыть исходящие соединения к внутренним сетям на уровне файрвола.

## Диагностика проблем

| Симптом | Возможная причина | Решение |
|:---|:---|:---|
| `wb-manager add` падает с ошибкой разбора | Повреждённый WARC | `warcio check file.warc.gz` или `warcvalid file.warc.gz` |
| Снимки есть на диске, но replay показывает 404 | Файлы скопированы в `archive/` вручную и не проиндексированы | `wb-manager reindex my-coll` или `wayback -a` |
| `wayback` сразу завершается | Занят порт 8080 | `wayback -p 8090` или `lsof -i :8080` |
| Коллекция из WACZ пустая | WACZ скопирован без распаковки | `wb-manager add --unpack-wacz my-coll file.wacz` |

## Ограничения

- **Только WARC/ARC** в коллекции; WACZ распаковывается при добавлении. Для PDF, HTML-файлов или SingleFile-страниц нужна предварительная упаковка в WARC.
- **Нет полнотекстового поиска** — только по URL.
- **Запись есть, но это не краулер** — для обхода сайтов используйте [Browsertrix](/kb/instruments/tools/browsertrix), [wget](/kb/instruments/tools/wget) или [warcprox](/kb/instruments/tools/warcprox) с браузером.

## Ресурсы

- [GitHub-репозиторий pywb](https://github.com/webrecorder/pywb)
- [Документация](https://pywb.readthedocs.io/)
- [Руководство по переходу с OpenWayback](https://pywb.readthedocs.io/en/latest/manual/owb-transition.html)
- [RFC 7089 (Memento)](https://datatracker.ietf.org/doc/html/rfc7089)
- [Спецификация CDXJ 0.1.0](https://specs.webrecorder.net/cdxj/0.1.0/)

## Связанные материалы

- [ReplayWeb.page — для локального просмотра без сервера](/kb/instruments/replay/replayweb-page)
- [OpenWayback — предшественник pywb](/kb/instruments/replay/openwayback)
- [IPWB — для распределённого хранения через IPFS](/kb/instruments/replay/ipwb)
- [SolrWayback — поисковый движок от Королевской библиотеки Дании](/kb/instruments/tools/solrwayback)
- [Формат WARC](/kb/instruments/file-formats/warc)
- [Формат WACZ](/kb/instruments/file-formats/wacz)
- [Формат CDX/CDXJ](/kb/instruments/file-formats/cdx)
- [WARC-файл: от сырого архива до публикации](/kb/guides/warc-workflow) — основной гайд пайплайна
