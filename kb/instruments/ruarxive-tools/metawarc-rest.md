---
title: metawarc REST API — справочник
sidebar_label: metawarc REST API
sidebar_position: 6
description: "Справочник REST API metawarc 2.x: каталог архивов, записи, заголовки, содержимое, поиск, фоновые задачи и просмотр сохранённых сайтов. Авторизация bearer-токеном, примеры curl и Python."
last_update:
  date: 2026-10-12
---

# metawarc REST API — справочник

[metawarc](/kb/instruments/ruarxive-tools/metawarc) 2.x включает REST API на FastAPI, который запускается командой `metawarc serve`. API только читает каталог (кроме постановки фоновых задач) и подходит для дашбордов, интеграций и выгрузок. Те же данные, кроме содержимого записей и задач, доступны ИИ-агентам через [MCP-сервер](/kb/instruments/ruarxive-tools/metawarc-mcp).

> Эндпоинты, параметры и примеры ответов сверены с `metawarc/api_server.py` и `api_models.py` версии 2.0.3 и проверены запросами к работающему серверу на тестовом WARC (октябрь 2026).

## Установка и запуск

```bash
pip install 'metawarc[api]'

# По умолчанию: 127.0.0.1:8000, база warcindex.db в текущем каталоге
metawarc serve --dbfile collection.db

# Другой порт
metawarc serve --dbfile collection.db --port 9000

# С авторизацией (токен лучше передавать через переменную окружения)
METAWARC_API_TOKEN='длинная-случайная-строка' metawarc serve --dbfile collection.db
```

Опции `serve`: `-d/--dbfile`, `--data-dir`, `--host`, `--port`, `--token`, `--allow-insecure`. Адрес и порт по умолчанию можно задать переменными `METAWARC_HOST` и `METAWARC_PORT`; остальные переменные — в разделе [Переменные окружения](/kb/instruments/ruarxive-tools/metawarc#переменные-окружения).

Запуск на адресе, отличном от `127.0.0.1`/`localhost`, без токена запрещён: команда завершится ошибкой «Non-loopback API binding requires --token/METAWARC_API_TOKEN or --allow-insecure».

## Авторизация

Если токен задан (`--token` или `METAWARC_API_TOKEN`), **все** эндпоинты API и просмотра, включая `/health`, требуют заголовок `Authorization: Bearer <токен>`. Без него сервер отвечает `401`:

```bash
curl -s http://127.0.0.1:8000/health
# {"detail":"Missing or invalid bearer token"}

curl -s -H "Authorization: Bearer $METAWARC_API_TOKEN" http://127.0.0.1:8000/health
# {"status":"ok","schema_version":2,"revision":3}
```

Если токен не задан, API работает без авторизации — это допустимо только на локальной машине. Автоматическая документация FastAPI (`/docs`, `/openapi.json`) открыта без токена.

Каждый ответ содержит заголовок `x-trace-id` (можно передать свой в запросе) — он же пишется в журнал сервера.

## Эндпоинты

| Метод и путь | Назначение |
| :--- | :--- |
| `GET /health` | Проверка работоспособности и версии схемы |
| `GET /warcs/list` | Список архивов в каталоге |
| `GET /records/list` | Список записей с фильтрами и постраничным выводом |
| `GET /records/get/{archive_id}/record/{record_id}` | Метаданные одной записи |
| `GET /records/get/{archive_id}/headers/{record_id}` | HTTP-заголовки записи |
| `GET /records/get/{archive_id}/data/{record_id}` | Содержимое записи (поток) |
| `GET /records/search` | Поиск фразы по извлечённым текстам |
| `POST /jobs` | Поставить фоновую задачу |
| `GET /jobs` | Список задач |
| `GET /jobs/{job_id}` | Состояние задачи |
| `GET /jobs/{job_id}/result` | Сведения о результате выполненной задачи |
| `DELETE /jobs/{job_id}` | Отменить задачу |
| `GET /`, `GET /replay` | HTML-список сохранённых сайтов |
| `GET /replay/sites` | Список сохранённых сайтов в JSON |
| `GET /replay/{stamp}/{url}` | Просмотр снимка страницы |

Ниже в примерах `T="Authorization: Bearer $METAWARC_API_TOKEN"` и `U=http://127.0.0.1:8000`.

### `GET /health`

```bash
curl -s -H "$T" $U/health
```

```json
{"status": "ok", "schema_version": 2, "revision": 3}
```

`revision` — номер ревизии каталога, растёт при каждом изменении.

### `GET /warcs/list`

Возвращает массив архивов. Поля ответа (часть): `id`, `source_uri`, `source_path`, `filename`, `size`, `status`, `num_records`, `created_at`, `updated_at`, `last_error`.

```json
[
  {
    "id": "74ce33812ae3422abe2b905af99f5610",
    "source_path": "/data/warcs/test.warc.gz",
    "filename": "test.warc.gz",
    "size": 806,
    "status": "complete",
    "num_records": 2
  }
]
```

### `GET /records/list`

| Параметр | Тип | Описание |
| :--- | :--- | :--- |
| `archive_ids` | строка | ID архивов через запятую |
| `mimes` | строка | MIME-типы через запятую |
| `exts` | строка | Расширения через запятую |
| `url_pattern` | строка | Подстрока URL без учёта регистра |
| `host_pattern` | строка | Подстрока хоста без учёта регистра |
| `status_min`, `status_max` | число 0–999 | Диапазон HTTP-статусов |
| `size_min`, `size_max` | число ≥ 0 | Диапазон размера содержимого |
| `sort_by` | строка | `archive_id`, `warc_id`, `url`, `host`, `mime`, `ext`, `status`, `date`, `size`, `offset` (по умолчанию `offset`) |
| `descending` | логический | Обратный порядок |
| `offset` | число ≥ 0 | Смещение (максимум 100 000) |
| `limit` | число ≥ 1 | Размер страницы, по умолчанию 100, максимум `METAWARC_MAX_PAGE` (500) |

Любой другой параметр (например, `status` или `from_date`) даёт `422 Unsupported query parameter(s)`. Фильтра по дате в REST нет — он есть у `list-files --date-from/--date-to` в CLI и в фильтрах фоновых задач.

```bash
curl -s -G -H "$T" $U/records/list \
  --data-urlencode 'mimes=text/html' \
  --data-urlencode 'host_pattern=example.org' \
  --data-urlencode 'status_min=200' --data-urlencode 'status_max=299' \
  --data-urlencode 'limit=100'
```

```json
{
  "total": 2,
  "offset": 0,
  "limit": 1,
  "revision": 3,
  "items": [
    {
      "archive_id": "74ce33812ae3422abe2b905af99f5610",
      "warc_id": "urn:uuid:9e7e4389-10f4-4804-ac6d-2b2832c0006d",
      "url": "https://example.org/",
      "host": "example.org",
      "source": "/data/warcs/test.warc.gz",
      "offset": 0,
      "length": 421,
      "content_type": "text/html; charset=utf-8",
      "c_type": "text/html",
      "rec_date": "2026-10-12T12:27:34+03:00",
      "content_length": 224,
      "status_code": 200,
      "ext": "",
      "payload_digest": "sha1:DZHYRR3RD5MZWQR4XQJR77YYE4KDZLWB"
    }
  ]
}
```

Для следующей страницы увеличивайте `offset` на `limit`, пока `offset` меньше `total`.

### `GET /records/get/{archive_id}/record/{record_id}`

Возвращает объект записи с теми же полями, что в `items` у `/records/list`. `record_id` — значение `warc_id` (например, `urn:uuid:…`), его нужно кодировать в URL. Если записи нет — `404 Record not found`.

### `GET /records/get/{archive_id}/headers/{record_id}`

Возвращает массив пар `{"key": "...", "value": "..."}` — сохранённые HTTP-заголовки ответа.

```json
[{"key": "Content-Type", "value": "text/html; charset=utf-8"}]
```

### `GET /records/get/{archive_id}/data/{record_id}`

Отдаёт содержимое записи потоком с исходным `Content-Type` и заголовком `Content-Disposition: attachment`. Объём ограничен `METAWARC_MAX_PAYLOAD_BYTES` (по умолчанию 128 МиБ).

```bash
curl -s -H "$T" -o page.html \
  "$U/records/get/74ce33812ae3422abe2b905af99f5610/data/urn:uuid:67d11623-4ed8-484f-aea8-68b37d81dc2a"
```

### `GET /records/search`

Поиск фразы по сайдкару `texts`, который строится командой `metawarc index-content --text`. Без него результатов не будет.

| Параметр | Описание |
| :--- | :--- |
| `phrase` | Фраза, 1–512 символов (обязательно) |
| `limit` | 1–`METAWARC_MAX_PAGE`, по умолчанию 50 |

```bash
curl -s -G -H "$T" $U/records/search --data-urlencode 'phrase=budget'
```

```json
{
  "phrase": "budget",
  "limit": 50,
  "total": 1,
  "hits": [
    {
      "archive_id": "74ce33812ae3422abe2b905af99f5610",
      "warc_id": "urn:uuid:67d11623-4ed8-484f-aea8-68b37d81dc2a",
      "source": "/data/warcs/test.warc.gz",
      "url": "https://example.org/about",
      "snippet": "About page with budget data Home"
    }
  ]
}
```

Поиск — последовательный просмотр столбца в DuckDB, а не полнотекстовый индекс (в README указано, что FTS-расширение DuckDB регрессировало в 1.5.x). Ранжирования и фильтра по языку нет.

## Фоновые задачи

Задачи нужны для выгрузок, которые не укладываются в таймаут запроса (`METAWARC_REQUEST_TIMEOUT`, 30 с). Зарегистрирован один вид — `export-records`: выгрузка списка записей в файл JSON, CSV или Parquet в каталоге `<имя базы>.data/jobs/<job_id>/`.

### `POST /jobs`

Тело запроса (лишние поля запрещены):

| Поле | Описание |
| :--- | :--- |
| `kind` | `export-records` (обязательно) |
| `format` | `json` (по умолчанию), `csv` или `parquet` |
| `limit` | Число записей; по умолчанию 1000 |
| `filters` | Объект с фильтрами: `archive_ids`, `mimes`, `exts`, `url_pattern`, `host_pattern`, `status_min`, `status_max`, `size_min`, `size_max`, `date_from`, `date_to`, `sort_by`, `descending`, `offset` |

```bash
curl -s -H "$T" -H 'Content-Type: application/json' $U/jobs -d '{
  "kind": "export-records",
  "format": "csv",
  "limit": 1000,
  "filters": {"mimes": "application/pdf", "status_min": 200, "status_max": 299}
}'
```

Ответ — `201 Created` с заголовком `Location: /jobs/<job_id>`:

```json
{
  "id": "job-9dd85a581eea403094eb88016570f1a8",
  "kind": "export-records",
  "status": "pending",
  "input": {"format": "csv", "limit": 1000, "filters": {"mimes": "application/pdf", "status_min": 200, "status_max": 299}},
  "result": {},
  "error": null,
  "created_at": "2026-10-12T09:29:06.883204+00:00",
  "started_at": null,
  "ended_at": null
}
```

Типичные ошибки:

- ключ `filter` вместо `filters` — `422 Extra inputs are not permitted`;
- другой `kind`, например `export-cdxj`, — `422 'export-cdxj' is not a valid JobKind`;
- `limit` больше 1000 модель запроса пропускает (до 100 000), но в версии 2.0.3 задача завершается статусом `failed` с ошибкой «limit must be between 1 and 1000». Для больших выгрузок ставьте несколько задач с разным `offset` в `filters`.

### `GET /jobs`, `GET /jobs/{job_id}`

`GET /jobs?status=running&limit=50` возвращает `{"total": N, "items": [...]}`, новые задачи первыми. Статусы: `pending`, `running`, `succeeded`, `failed`, `cancelled`. `GET /jobs/{job_id}` возвращает объект задачи; у выполненной задачи в `result` есть `path`, `format`, `rows`, `size`, `total`.

### `GET /jobs/{job_id}/result`

Возвращает **сведения** о результате, а не сам файл. Пока задача не в статусе `succeeded` — `409`.

```json
{
  "job_id": "job-9dd85a581eea403094eb88016570f1a8",
  "status": "succeeded",
  "path": "collection.data/jobs/job-9dd85a581eea403094eb88016570f1a8/result.csv",
  "format": "csv",
  "rows": 2,
  "size": 780
}
```

Файл лежит на диске сервера по пути `path`; эндпоинта для его скачивания нет.

### `DELETE /jobs/{job_id}`

Отменяет задачу в статусе `pending` или `running` и возвращает её объект. Для завершённой задачи — `409`, для неизвестной — `404`.

## Просмотр сохранённых сайтов

- `GET /` и `GET /replay` — HTML-страница со списком сохранённых хостов.
- `GET /replay/sites?limit=500` — JSON: `host`, `entry_url`, `captures`, `first_date`, `last_date`, `replay_path`.
- `GET /replay/<штамп>/<URL>` — снимок страницы. Штамп — ровно 14 цифр (`ГГГГММДДччммсс`) с необязательным суффиксом `mp_` (с переписыванием HTML/CSS) или `id_` (исходное содержимое). Сокращённые штампы и шаблоны вроде `2026*` дают `422`. По умолчанию выбирается ближайший по времени снимок точного URL; `?policy=exact` требует точного совпадения.

```text
http://127.0.0.1:8000/replay/20260315102345mp_/https://example.com/news/article
```

JavaScript не переписывается. Подробнее — в разделе [Просмотр сохранённых сайтов](/kb/instruments/ruarxive-tools/metawarc#просмотр-сохранённых-сайтов).

## Лимиты

| Параметр | По умолчанию | Где меняется |
| :--- | :--- | :--- |
| Токен | не задан | `--token`, `METAWARC_API_TOKEN` |
| Максимальный `limit` в `/records/list` и `/records/search` | 500 | `METAWARC_MAX_PAGE` |
| Объём содержимого записи | 128 МиБ | `METAWARC_MAX_PAYLOAD_BYTES` |
| Таймаут запроса | 30 с | `METAWARC_REQUEST_TIMEOUT` |
| Одновременных запросов | 16 | `METAWARC_MAX_CONCURRENCY` |
| Одновременных задач | 4 | `METAWARC_JOB_MAX_CONCURRENT` |
| Таймаут задачи | 300 с | `METAWARC_JOB_TIMEOUT` |

## Пример клиента на Python

Готового клиента в пакете нет; достаточно `requests`:

```python
import time
import requests

API = "http://127.0.0.1:8000"
session = requests.Session()
session.headers["Authorization"] = "Bearer " + "замените-на-токен"

# Постраничный обход записей
offset, limit = 0, 500
while True:
    page = session.get(f"{API}/records/list",
                       params={"mimes": "application/pdf", "offset": offset, "limit": limit}).json()
    for item in page["items"]:
        print(item["url"], item["status_code"])
    offset += limit
    if offset >= page["total"]:
        break

# Поиск
hits = session.get(f"{API}/records/search", params={"phrase": "бюджет", "limit": 20}).json()["hits"]

# Фоновая задача
job = session.post(f"{API}/jobs", json={
    "kind": "export-records",
    "format": "parquet",
    "limit": 1000,
    "filters": {"mimes": "application/pdf"},
}).json()
while True:
    state = session.get(f"{API}/jobs/{job['id']}").json()
    if state["status"] in ("succeeded", "failed", "cancelled"):
        break
    time.sleep(2)
print(state["status"], state["result"].get("path"), state["error"])
```

## Когда использовать REST API

Подходит для веб-интерфейсов и дашбордов с фильтрами и постраничным выводом, интеграций и проверок в CI («сколько записей в новом архиве?»), получения содержимого отдельных записей и выгрузок через фоновые задачи.

Не подходит для ИИ-агентов (для них [MCP](/kb/instruments/ruarxive-tools/metawarc-mcp)), сложной аналитики (удобнее SQL в DuckDB поверх Parquet-сайдкаров, см. [рецепты](/kb/instruments/ruarxive-tools/metawarc-cookbook)) и быстрого полнотекстового поиска по большим коллекциям (см. [SolrWayback](/kb/instruments/tools/solrwayback)).

## Ресурсы

- [Документация: REST API](https://ruarxive.org/metawarc/integrations/rest-api)
- [Документация: команда jobs](https://ruarxive.org/metawarc/commands/jobs)
- [Документация: просмотр сайтов](https://ruarxive.org/metawarc/integrations/replay)
- [CHANGELOG metawarc](https://github.com/ruarxive/metawarc/blob/master/CHANGELOG.md)

## Связанные материалы

- [metawarc (обзор)](/kb/instruments/ruarxive-tools/metawarc)
- [metawarc MCP-сервер](/kb/instruments/ruarxive-tools/metawarc-mcp)
- [metawarc: рецепты](/kb/instruments/ruarxive-tools/metawarc-cookbook)
- [WARC-workflow](/kb/guides/warc-workflow)
- [DuckDB и WARC](/kb/instruments/tools/duckdb-warc)
- [Формат WARC](/kb/instruments/file-formats/warc)
