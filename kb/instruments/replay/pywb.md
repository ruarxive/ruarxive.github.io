---
title: pywb — Python Wayback Machine
sidebar_label: pywb (Python Wayback)
description: "pywb — современная серверная реализация Wayback Machine на Python. Установка, добавление архивов WARC/WACZ, конфигурация, производительность, деплой."
last_updated: 2026-11-09
keywords: [pywb, wayback, replay, warc, wacz, cdxj, api, memento]
---

# pywb — Python Wayback Machine

[pywb](https://github.com/webrecorder/pywb) — это серверная реализация Wayback Machine на Python 3, разработанная Webrecorder. Поддерживает форматы WARC, WACZ, ARC; предоставляет веб-интерфейс, CDX API и Memento API. Именно `pywb` обслуживает [archive.org](https://archive.org/) и большинство национальных веб-архивов мира.

> **Главное отличие от ReplayWeb.page:** pywb — это сервер. Несколько пользователей могут одновременно читать архив по обычным HTTP-ссылкам. ReplayWeb.page обрабатывает всё локально в браузере одного исследователя.

## Зачем нужен архивисту

- **Публичный доступ:** дать ссылку коллегам и редакторам — `https://archive.example.org/my-coll/2026/https://sitenews.ru/`.
- **Множество коллекций:** параллельно хостить архив газеты, архив госсайта и личный архив исследователя.
- **CDX/Memento API:** программный поиск по «все URL, которые когда-либо были на сайте X» через HTTP.
- **WACZ из коробки:** поддержка современных WACZ-пакетов (с CDXJ-индексами) без ручной индексации.
- **CDXJ-индексирование «на лету»:** pywb может строить CDXJ при первом обращении, если он отсутствует.

## Когда использовать

✅ Подходит:

- Хостинг одного или нескольких архивов для команды/сообщества.
- Большие коллекции (от десятков ГБ до десятков ТБ) — pywb спроектирован для веб-масштабов.
- Программный доступ (CDX/Memento).
- Self-hosted альтернатива публичному Wayback Machine.
- Интеграция с существующим пайплайном (WACZ → pywb через `wb-manager`).

❌ Не подходит:

- Разовое открытие одного файла без настройки — проще [ReplayWeb.page](/kb/instruments/replay/replayweb-page).
- Закрытые/приватные архивы со сложной авторизацией — лучше специализированный движок.
- Когда у вас только ZIM-файлы (Kiwix) — [warc2zim](/kb/instruments/tools/warc2zim) → Kiwix-Server.
- Полнотекстовый поиск по миллионам страниц — нужен дополнительный движок ([Shine](/kb/instruments/tools/shine) или [SolrWayback](/kb/instruments/tools/solrwayback)).

## Установка

### Через pip (рекомендуется)

```bash
pip install pywb
```

Требования: Python 3.9+; ОС — Linux, macOS, Windows (с WSL).

### Через Docker

Официальный образ Webrecorder:

```bash
docker pull webrecorder/pywb
docker run -p 8080:8080 \
  -v /path/to/archives:/archive \
  webrecorder/pywb
```

### Из исходников (для разработки)

```bash
git clone https://github.com/webrecorder/pywb
cd pywb
pip install -e .
```

## Быстрый старт: поднять первый архив за 5 минут

### Шаг 1. Инициализация рабочей директории

```bash
mkdir my-archive-dir
cd my-archive-dir
wb-manager init .
```

Команда создаёт шаблон:

```
.
├── config.yaml
├── collections/
└── static/
```

### Шаг 2. Копируем WARC/WACZ

```bash
cp ~/Downloads/my-site-2026.wacz collections/my-coll/archive/
```

Структура коллекции `my-coll`:

```
collections/my-coll/
├── archive/
│   └── my-site-2026.wacz
└── indexes/
    └── (построится автоматически)
```

### Шаг 3. Регистрация и запуск

```bash
wb-manager add my-coll ./collections/my-coll
wayback --collections .
```

Откройте `http://localhost:8080/my-coll/` — увидите каталог снимков вашего сайта.

### Шаг 4. Переход к нужной странице

URL-формат:

```
http://localhost:8080/<collection>/<timestamp>/<оригинальный URL>
```

Примеры:

```
# Конкретная дата
http://localhost:8080/my-coll/20260601120000/https://example.com/

# Любая ближайшая к сегодняшней дате
http://localhost:8080/my-coll/https://example.com/
```

pywb автоматически выберет ближайший снимок, если точной даты нет.

## Конфигурация

### Базовая config.yaml

```yaml
server:
  port: 8080
  workers: 4
  archive_paths: /path/to/collections

collections:
  my-coll:
    index_paths: /path/to/collections/my-coll/indexes/
    archive_paths: /path/to/collections/my-coll/archive/
    # Рекомпиляция CDXJ на лету
    recurse: true
    # Автоперезагрузка индексов при изменении файлов
    auto_index: true

# Лог-файл
logging:
  logfile: /var/log/pywb.log
  level: info
```

### Множественные коллекции

```yaml
collections:
  echo-msk:
    index_paths: /path/to/echo/indexes/
    archive_paths: /path/to/echo/archive/
  russian-smi:
    index_paths: /path/to/smi/indexes/
    archive_paths: /path/to/smi/archive/
  govt:
    index_paths: /path/to/govt/indexes/
    archive_paths: /path/to/govt/archive/

default_collection: russian-smi
```

При такой конфигурации URL-ы:

```
http://localhost:8080/echo-msk/2026/https://echo.msk.ru/
http://localhost:8080/russian-smi/2026/https://lenta.ru/
http://localhost:8080/govt/2026/https://minfin.gov.ru/
```

### Proxy и доступ по доменному имени

Для прода: nginx или Caddy перед `pywb` (gunicorn/uwsgi). Пример для nginx:

```nginx
server {
  listen 80;
  server_name playback.example.org;

  location / {
    proxy_pass http://127.0.0.1:8080;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    client_max_body_size 50G;   # большие WACZ через upload UI
    proxy_read_timeout 300s;
  }
}
```

Подробный деплой: [Webrecorder wiki → Deployment](https://github.com/webrecorder/pywb/wiki/Deployment).

## CDX API — программный поиск по коллекции

CDX — индекс всех URL и их снимков в коллекции. Используется для: «список всех страниц сайта, которые мы сохранили», «все снимки по дате», «URL, содержащие слово X».

### Запрос всех URL домена

```bash
curl 'http://localhost:8080/my-coll/cdx?url=example.com/*&output=json'
```

Возвращает JSON-массив:

```json
[
  ["20260601120000", "https://example.com/", "warcfile", "MIME", "200", "12345", "abc...", "..."],
  ["20260601120005", "https://example.com/about", "warcfile", "MIME", "200", "5678", "def...", "..."]
]
```

### Запрос по префиксу URL

```bash
# Все страницы, начинающиеся на /news/
curl 'http://localhost:8080/my-coll/cdx?url=example.com/news/*&output=json'

# Один URL — все его снимки
curl 'http://localhost:8080/my-coll/cdx?url=example.com/&output=json'
```

### Фильтр по дате

```bash
# Только 2026 год
curl 'http://localhost:8080/my-coll/cdx?url=example.com/*&from=20260101&to=20261231&output=json'
```

### Только совпадения по regex в URL

```bash
curl 'http://localhost:8080/my-coll/cdx?url=example.com/.*&matchType=prefix&limit=100'
```

Полная спецификация параметров: [iipc.github.io/cdx-format](https://iipc.github.io/warc-specifications/specifications/cdx-format/cdx-1.1.1.html) и [Webrecorder docs → CDX API](https://github.com/webrecorder/pywb/blob/master/docs/manual/cdx-api.md).

## Memento API — TimeGate и TimeMap

Memento — стандарт IETF (RFC 7089) для «путешествий во времени» по веб-архивам.

### TimeMap — все версии URL

```bash
curl -H 'Accept: application/link-format' \
  http://localhost:8080/my-coll/timemap/link/https://example.com/
```

Возвращает `application/link-format`:

```
<http://localhost:8080/my-coll/20240101120000/https://example.com/>; rel="memento"; datetime="...",
<http://localhost:8080/my-coll/20250101120000/https://example.com/>; rel="memento"; datetime="...",
<http://localhost:8080/my-coll/20260101120000/https://example.com/>; rel="memento"; datetime="...",
<http://localhost:8080/my-coll/https://example.com/>; rel="original"
```

### TimeGate — редирект к ближайшему снимку

```bash
# Без Accept-Datetime → к ближайшему к сегодня
curl -I http://localhost:8080/my-coll/memento/https://example.com/

# С Accept-Datetime → к ближайшему к этой дате
curl -I -H 'Accept-Datetime: Wed, 15 Jun 2026 12:00:00 GMT' \
  http://localhost:8080/my-coll/memento/https://example.com/
```

Подробнее: [RFC 7089](https://datatracker.ietf.org/doc/html/rfc7089).

## Replay API — доступ к странице по URL

```bash
# Конкретный снимок
curl 'http://localhost:8080/my-coll/20260101/https://example.com/'

# Любой ближайший
curl 'http://localhost:8080/my-coll/https://example.com/'
```

## Производительность и масштабирование

| Размер архива | Рекомендации |
|:---|:---|
| до 100 ГБ | Один процесс `wayback`, CDXJ в файлах. Подходит для большинства случаев. |
| 100 ГБ – 1 ТБ | gunicorn с 4–8 workers, CDXJ в Redis. Перенос архивов на NVMe SSD. |
| 1 ТБ – 10 ТБ | gunicorn + Redis + локальный кэш через NGINX, разнесённые тома WARC. |
| > 10 ТБ | Внутренние решения Internet Archive (Hadoop); pywb используется как фронтенд для поиска. |

### Оптимизации

- **CDXJ-индексация на лету** включается флагом `recurse: true` — экономит диск, но замедляет первый запрос.
- **Redis для кэша** — `cache_proxy: redis://localhost:6379/0` снижает нагрузку на диск.
- **HTTP range-запросы** — pywb умеет отдавать страницы по частям; браузеры используют это при пагинации.
- **Разделение архивов по дате** — несколько небольших WARC быстрее, чем один гигантский.

## Сравнение с альтернативами

| Возможность | pywb | OpenWayback | IPWB | ReplayWeb.page |
|:---|:-:|:-:|:-:|:-:|
| Python | ✅ | ❌ | ✅ | ✅ Node |
| Поддержка WARC/WACZ | ✅ | ⚠️ WARC только | ✅ WARC | ✅ WARC/WACZ |
| CDX/Memento API | ✅ | ⚠️ CDX | ❌ | ❌ |
| Авто-индексация | ✅ | ⚠️ | ❌ | ✅ в браузере |
| Multi-collection | ✅ | ⚠️ | ❌ | через URL |
| Production-ready | ✅ | ✅ | Эксперимент | ✅ |
| Self-hosted | ✅ | ✅ | ✅ через IPFS | ❌ |
| Кириллица в URL | ✅ | ✅ | ✅ | ✅ |

## Best practices

### Резервное копирование конфигурации

`config.yaml`, `collections/<name>/`, и индексы — критичные компоненты. WARC восстановимы (исходные данные хранятся в S3/Backblaze), но CDXJ-индекс строится заново минуты-часы в зависимости от объёма.

### Защита от перегрузки

`config.yaml` → `server: max_connections: 1000` (default). Для публичного архива ставьте nginx/caddy как reverse proxy.

### Поддержка больших файлов при upload

UI загрузки по умолчанию имеет лимит ~50 MB. Чтобы разрешить upload WACZ в десятки/сотни ГБ:

```yaml
server:
  max_request_size: 100G
```

И в nginx:

```nginx
client_max_body_size 100G;
```

### Использование Surrogates для редиректов

pywb поддерживает «surrogates» — текстовый файл с правилами вида `(.*)\.gif$ → https://my-cdn/file.gif`. Используется, если нужно перенаправлять медиа в архиве на внешний CDN для ускорения.

## Диагностика проблем

| Симптом | Возможная причина | Решение |
|:---|:---|:---|
| `wb-manager add` падает с `IndexError` | Невалидный WARC | `warcvalid path.warc.gz` |
| Replay показывает 404 при наличии снимков | CDXJ-индекс не пересобран | `wb-manager reindex my-coll` |
| `wayback` сразу завершается | Занят порт 8080 | `wayback --port=8090` или `lsof -i :8080` |
| Снимки видны, но картинки не загружаются | Отдача оригиналов отключена в браузере | Проверьте CORS, разрешите mixed-content в UI |
| Ошибка при запуске на Windows | Проблемы с UTF-8 в путях | Используйте WSL или Docker |

## Ограничения

- **Только WARC/WACZ/ARC** — для PDF/HTML/SingleFile нужен preprocess-конвертер.
- **CDXJ-индекс требует диска** — для очень больших коллекций индекс может достигать 5–10 % от размера архивов.
- **Real-time запись** — pywb не записывает веб-трафик; для этого используйте [warcprox](/kb/instruments/tools/warcprox).
- **Single-page recording** — pywb создан для replay; для записи используйте [Browsertrix](/kb/instruments/tools/browsertrix), [wget](/kb/instruments/tools/wget) или [Squidwarc](/kb/instruments/tools/squidwarc).

## Ресурсы

- [GitHub репозиторий pywb](https://github.com/webrecorder/pywb)
- [Полная документация](https://pywb.readthedocs.io/)
- [Deployment Guide](https://github.com/webrecorder/pywb/wiki/Deployment)
- [pywb Cookbook](https://github.com/webrecorder/pywb/wiki/Cookbook)
- [RFC 7089 (Memento)](https://datatracker.ietf.org/doc/html/rfc7089)
- [CDX Format Specification](https://iipc.github.io/warc-specifications/specifications/cdx-format/cdx-1.1.1.html)

## Связанные материалы

- [ReplayWeb.page — для локального просмотра без сервера](/kb/instruments/replay/replayweb-page)
- [OpenWayback — JVM-альтернатива](/kb/instruments/replay/openwayback)
- [IPWB — для распределённого хранения через IPFS](/kb/instruments/replay/ipwb)
- [Shine — полнотекстовый поиск по WARC](/kb/instruments/tools/shine)
- [SolrWayback — поисковый движок от Королевской библиотеки Дании](/kb/instruments/tools/solrwayback)
- [Формат WARC](/kb/instruments/file-formats/warc)
- [Формат WACZ](/kb/instruments/file-formats/wacz)
- [Формат CDX/CDXJ](/kb/instruments/file-formats/cdx)
- [WARC-файл: от сырого архива до публикации](/kb/guides/warc-workflow) — основной гайд пайплайна
