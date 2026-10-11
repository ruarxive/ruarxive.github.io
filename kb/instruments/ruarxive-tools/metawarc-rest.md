---
title: metawarc REST API — справочник
sidebar_label: metawarc REST API
sidebar_position: 6
description: "Полный справочник REST API metawarc v2.x: 12 эндпойнтов для каталога, записей, поиска и batch-задач. curl и Python-примеры. Bearer-token авторизация."
last_updated: 2026-11-09
---

# metawarc REST API — справочник

[metawarc](/kb/instruments/ruarxive-tools/metawarc) v2.x экспонирует **REST API** на базе FastAPI для интеграции с дашбордами, веб-приложениями, ETL-процессами и долгоиграющими выгрузками. Этот API предоставляет те же данные, что и [MCP-сервер](/kb/instruments/ruarxive-tools/metawarc-mcp), но через HTTP — без необходимости подключаться через AI-агентов.

> **Когда выбирать REST vs MCP:** REST — для интеграций между системами (дашборды, CI/CD, ETL, веб-UI). MCP — для AI-агентов (Claude Desktop, Cursor, Continue). Подробнее — в разделе [REST vs MCP vs прямой SQL](#rest-vs-mcp-vs-прямой-sql) ниже.

## Зачем нужен REST API

REST-поверхность закрывает сценарии, которые неудобно делать через CLI или MCP:

- **Дашборды и аналитика.** React/Vue/Svelte приложения показывают статистику коллекции, фильтруют записи, выгружают подмножества.
- **CI/CD пайплайны.** Проверка полноты после нового архива, валидация по метаданным.
- **ETL-задачи.** Ночные выгрузки подмножеств коллекции в ClickHouse/PostgreSQL.
- **Long-running экспорт.** Batch-задачи, результаты которых не помещаются в HTTP-таймаут.
- **Удалённый доступ.** REST можно закрыть reverse proxy с TLS и mTLS для безопасной сетевой интеграции.

## Установка и запуск

```bash
pip install 'metawarc[api]'
# или
pip install 'metawarc[all]'

# Запуск REST API на loopback:8765
metawarc serve --dbfile collection.db

# Запуск на конкретном хосте/порту
metawarc serve --dbfile collection.db --host 0.0.0.0 --port 9000

# С bearer-token авторизацией
METAWARC_BEARER_TOKEN=secret metawarc serve --dbfile collection.db
```

По умолчанию сервер слушает `127.0.0.1:8000`. Swagger UI — `http://127.0.0.1:8000/docs`.

## Авторизация

REST API поддерживает **bearer-token авторизацию**. Все эндпойнты (кроме `/health`) требуют заголовок `Authorization: Bearer <token>`.

```bash
export TOKEN="your-secret-token"

# С токеном
curl -H "Authorization: Bearer $TOKEN" 'http://127.0.0.1:8000/warcs/list'

# Без токена — 401 Unauthorized
curl 'http://127.0.0.1:8000/warcs/list'
# {"error":"unauthorized"}
```

Если `METAWARC_BEARER_TOKEN` не задан, **API работает без аутентификации** (только для локального использования).

## Эндпойнты

Всего 12 GET/POST/DELETE эндпойнтов + 2 replay-redirect.

### 1. `GET /health`

**Liveness-проверка.** Не требует токена.

```bash
curl 'http://127.0.0.1:8000/health'
```

```json
{
  "status": "ok",
  "dbfile": "/data/collection.db",
  "data_dir": "/data/collection.db.data",
  "version": "2.0.3",
  "indexed_archives": 12,
  "indexed_records": 14567890
}
```

Используется для healthcheck в Kubernetes/Docker.

### 2. `GET /warcs/list`

**Список проиндексированных WARC-файлов** в каталоге.

```bash
curl -H "Authorization: Bearer $TOKEN" 'http://127.0.0.1:8000/warcs/list'
```

```json
{
  "items": [
    {
      "archive_id": "arc_8a3b",
      "filename": "echo-msk-2024-q1.warc.gz",
      "size_bytes": 1234567890,
      "sha256": "abc123...",
      "indexed_at": "2026-11-09T12:00:00Z",
      "record_count": 145678,
      "url_count": 12345
    },
    ...
  ],
  "total": 12
}
```

**Параметры:** нет.

### 3. `GET /records/list`

**Пагинированный список записей** с фильтрами.

| Параметр | Тип | Описание |
|:---|:---|:---|
| `archive_id` | string | Опционально: ограничить одним архивом |
| `mime` | string | Фильтр по MIME type |
| `host` | string | Фильтр по домену (например, `example.com`) |
| `status` | int | HTTP статус ответа (200, 404 и т. д.) |
| `from_date` | ISO 8601 | С даты |
| `to_date` | ISO 8601 | По дату |
| `limit` | int | 1–500 (default 50) |
| `offset` | int | Для пагинации (default 0) |

```bash
# Все HTML-страницы с example.com в 2026 году
curl -G -H "Authorization: Bearer $TOKEN" \
  'http://127.0.0.1:8000/records/list' \
  --data-urlencode 'mime=text/html' \
  --data-urlencode 'host=example.com' \
  --data-urlencode 'from_date=2026-01-01' \
  --data-urlencode 'to_date=2026-12-31' \
  --data-urlencode 'limit=100'
```

```json
{
  "items": [
    {
      "record_id": "rec_a1b2c3",
      "archive_id": "arc_8a3b",
      "url": "https://example.com/article-1",
      "warc_date": "2026-03-15T10:23:45Z",
      "mime": "text/html",
      "status": 200,
      "length": 12345,
      "sha256": "def456..."
    },
    ...
  ],
  "total": 1247,
  "limit": 100,
  "offset": 0,
  "next_offset": 100
}
```

### 4. `GET /records/get/{archive_id}/record/{record_id}`

**Метаданные одной записи** (WARC-заголовки + HTTP-заголовки + длина).

```bash
curl -H "Authorization: Bearer $TOKEN" \
  'http://127.0.0.1:8000/records/get/arc_8a3b/record/rec_a1b2c3'
```

```json
{
  "record_id": "rec_a1b2c3",
  "archive_id": "arc_8a3b",
  "url": "https://example.com/article-1",
  "warc_type": "response",
  "warc_date": "2026-03-15T10:23:45Z",
  "mime": "text/html",
  "status": 200,
  "length": 12345,
  "sha256": "def456...",
  "warc_headers": {
    "WARC-Type": "response",
    "WARC-Target-URI": "https://example.com/article-1",
    "WARC-Date": "2026-03-15T10:23:45Z",
    "Content-Length": "12345",
    "WARC-Record-ID": "<urn:uuid:a1b2c3d4>"
  },
  "http_headers": {
    "Server": "nginx/1.18",
    "Content-Type": "text/html; charset=utf-8",
    "Date": "Mon, 15 Mar 2026 10:23:45 GMT",
    "Cache-Control": "max-age=3600"
  }
}
```

### 5. `GET /records/get/{archive_id}/headers/{record_id}`

**Только HTTP-заголовки** (без WARC-обёртки и payload-а). Полезно для аудита.

```bash
curl -H "Authorization: Bearer $TOKEN" \
  'http://127.0.0.1:8000/records/get/arc_8a3b/headers/rec_a1b2c3'
```

```json
{
  "record_id": "rec_a1b2c3",
  "http_headers": {
    "Server": "nginx/1.18",
    "Content-Type": "text/html; charset=utf-8",
    "Set-Cookie": "sessionid=abc123; Path=/; HttpOnly",
    "Strict-Transport-Security": "max-age=31536000"
  }
}
```

### 6. `GET /records/get/{archive_id}/data/{record_id}` ⭐

**Скачивание payload-а записи** — содержимое ответа сервера.

```bash
curl -H "Authorization: Bearer $TOKEN" \
  'http://127.0.0.1:8000/records/get/arc_8a3b/data/rec_a1b2c3' \
  -o article.html
```

Возвращается **бинарный поток** с правильным `Content-Type`. Этот эндпойнт критически важен для:

- Извлечения конкретных PDF/JPEG для анализа.
- Загрузки в [DuckDB-WARC](/kb/instruments/tools/duckdb-warc).
- CI/CD-валидации (проверить, что страница содержит ожидаемое).

**Размер и лимиты:**

- Если payload > 100 МБ — рекомендуется использовать [batch-job](#8-post-jobs) вместо прямого запроса.
- Сервер применяет rate-limit на уровне всего API (по умолчанию 1000 RPS).

### 7. `GET /records/search`

**Полнотекстовый поиск по фразе** в индексированных текстах. Требует предварительно запущенный `metawarc index-content --text` для построения `texts` sidecar.

| Параметр | Тип | Описание |
|:---|:---|:---|
| `phrase` | string | Поисковая фраза (обязательно) |
| `limit` | int | 1–100 (default 20) |
| `language` | string | Опционально: 'ru', 'en' и т. д. |

```bash
curl -G -H "Authorization: Bearer $TOKEN" \
  'http://127.0.0.1:8000/records/search' \
  --data-urlencode 'phrase=выборы' \
  --data-urlencode 'limit=20'
```

```json
{
  "hits": [
    {
      "record_id": "rec_abc",
      "archive_id": "arc_8a3b",
      "url": "https://example.com/article",
      "language": "ru",
      "snippet": "...выборы 2026 года пройдут в сентябре...",
      "score": 0.95
    },
    ...
  ],
  "phrase": "выборы",
  "total": 247
}
```

**⚠️ Backend:** использует columnar scan по `texts` sidecar (DuckDB FTS-extension регрессировал в 1.5.x, поэтому metawarc переключился на сканирование столбца — медленнее, но надёжно).

### 8. `POST /jobs`

**Создать batch-задачу** для экспорта данных, которые не влезают в HTTP-таймаут.

```bash
curl -X POST -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  'http://127.0.0.1:8000/jobs' \
  -d '{
    "kind": "export-records",
    "format": "csv",
    "filter": {
      "host": "example.com",
      "from_date": "2026-01-01",
      "to_date": "2026-12-31",
      "mime": "application/pdf"
    },
    "limit": 5000
  }'
```

```json
{
  "job_id": "job_xyz789",
  "status": "pending",
  "kind": "export-records",
  "format": "csv",
  "submitted_at": "2026-11-09T12:00:00Z"
}
```

**Виды задач (на ноябрь 2026):**

| `kind` | Что делает | Форматы |
|:---|:---|:---|
| `export-records` | Выгрузка подмножества записей в файл | `json`, `csv`, `parquet` |
| `export-cdxj` | Генерация CDXJ-индекса для [pywb](/kb/instruments/replay/pywb) | `cdxj` |
| `index-content` | Извлечение метаданных из payload-ов | (без выходных данных) |

### 9. `GET /jobs`

**Список всех batch-задач** с фильтром по статусу.

```bash
# Все задачи
curl -H "Authorization: Bearer $TOKEN" 'http://127.0.0.1:8000/jobs'

# Только завершённые
curl -G -H "Authorization: Bearer $TOKEN" \
  'http://127.0.0.1:8000/jobs' \
  --data-urlencode 'status=completed'
```

```json
{
  "items": [
    {
      "job_id": "job_xyz789",
      "status": "completed",
      "kind": "export-records",
      "format": "csv",
      "submitted_at": "2026-11-09T12:00:00Z",
      "completed_at": "2026-11-09T12:15:30Z",
      "duration_seconds": 930
    }
  ],
  "total": 1
}
```

**Статусы:** `pending`, `running`, `completed`, `failed`, `cancelled`.

### 10. `GET /jobs/{job_id}`

**Статус конкретной задачи.**

```bash
curl -H "Authorization: Bearer $TOKEN" \
  'http://127.0.0.1:8000/jobs/job_xyz789'
```

```json
{
  "job_id": "job_xyz789",
  "status": "running",
  "kind": "export-records",
  "format": "csv",
  "filter": {"host": "example.com", "limit": 5000},
  "progress": {
    "processed_records": 1247,
    "total_records": 5000,
    "percent": 24.94
  },
  "submitted_at": "2026-11-09T12:00:00Z"
}
```

### 11. `GET /jobs/{job_id}/result`

**Скачивание результата** завершённой задачи.

```bash
# CSV
curl -H "Authorization: Bearer $TOKEN" \
  'http://127.0.0.1:8000/jobs/job_xyz789/result' \
  -o export.csv

# JSON
curl -H "Authorization: Bearer $TOKEN" \
  'http://127.0.0.1:8000/jobs/job_xyz789/result' \
  -o export.json
```

Файл выгружается с правильным `Content-Disposition` (если есть имена — `attachment; filename=export.csv`).

### 12. `DELETE /jobs/{job_id}`

**Отменить задачу** (pending или running).

```bash
curl -X DELETE -H "Authorization: Bearer $TOKEN" \
  'http://127.0.0.1:8000/jobs/job_xyz789'
```

```json
{"status": "cancelled"}
```

Невозможно отменить `completed` или `failed` (409 Conflict).

### Replay-redirects (служебные)

| Путь | Назначение |
|:---|:---|
| `GET /` | Redirect на `/docs` (Swagger UI) |
| `GET /replay/` | Корневая страница replay — каталог архивов |

Replay использует URL-формат:

```
GET /replay/<штамп>mp_/<URL>
```

Пример:

```
http://127.0.0.1:8000/replay/20260315102345mp_/https://example.com/article
```

`mp_` — magic prefix, обозначающий «memento play». Штамп может быть:

- `20260315102345` — конкретный момент времени.
- `202603*` — все снимки за март 2026.
- `*-` — все снимки (используется осторожно).

Replay поддерживает HTML/CSS rewrite (корректно работает с кириллицей в URL, редиректах и post-Navigation запросах).

## Аутентификация в production

### За reverse proxy (Caddy)

```caddyfile
# /etc/caddy/Caddyfile
archive.example.org {
    # mTLS для ограничения клиентов
    # tls internal
    
    reverse_proxy 127.0.0.1:8000 {
        # Проброс bearer-token из Authorization header
        # Можно дополнительно проверять в middleware Caddy
        header_up Authorization "Bearer ${env.BEARER_TOKEN}"
    }
}
```

### С динамическим token-checking middleware

metawarc не валидирует JWT/OIDC из коробки — это намеренно. Подход:

1. Настройте `METAWARC_BEARER_TOKEN` для metawarc.
2. Перед metawarc поставьте nginx/Caddy с OAuth2-proxy или auth0-proxy.
3. Прокси подменяет `Authorization` на внутренний токен.

## Лимиты

| Параметр | Значение по умолчанию | Изменить через |
|:---|:---|:---|
| Bearer token | не требуется | `METAWARC_BEARER_TOKEN` |
| Лимит записей в `/records/list` | 500 | `--limit-max` |
| Лимит в search | 100 | `METAWARC_SEARCH_MAX` |
| Параллельных job'ов | 4 | `METAWARC_JOB_MAX_CONCURRENT` |
| Таймаут job'а | 300 с | `METAWARC_JOB_TIMEOUT` |
| Размер payload-а | 100 МБ | `METAWARC_PAYLOAD_MAX` |

## REST vs MCP vs прямой SQL

| Задача | REST | MCP | DuckDB SQL |
|:---|:-:|:-:|:-:|
| Дашборд с пагинацией | ✅ | ❌ | ❌ |
| AI-агент (Claude Desktop) | ❌ | ✅ | ❌ |
| ETL-пайплайн | ✅ | ❌ | ✅ |
| Ad-hoc-анализ в ноутбуке | ⚠️ | ❌ | ✅ |
| Долгие выгрузки (загрузка) | ✅ через jobs | ❌ | ⚠️ нужен Python |
| Читать raw payload | ✅ `/records/get/data` | ❌ безопасно | ⚠️ через core API |
| Массовые SQL-операции | ❌ | ❌ | ✅ |

**Рекомендация:** для production-сервисов — REST с bearer-token за reverse proxy. Для AI-агентов — MCP. Для исследователя в Jupyter — прямой SQL через DuckDB.

## Python-клиент

Готового клиента пока нет в основном пакете, но `requests` достаточно:

```python
import requests

class MetawarcClient:
    def __init__(self, base_url, token=None):
        self.base_url = base_url
        self.session = requests.Session()
        if token:
            self.session.headers["Authorization"] = f"Bearer {token}"
    
    def health(self):
        return self.session.get(f"{self.base_url}/health").json()
    
    def archives(self):
        return self.session.get(f"{self.base_url}/warcs/list").json()["items"]
    
    def records(self, **filters):
        return self.session.get(f"{self.base_url}/records/list", params=filters).json()
    
    def get_record(self, archive_id, record_id):
        meta = self.session.get(
            f"{self.base_url}/records/get/{archive_id}/record/{record_id}"
        ).json()
        headers = self.session.get(
            f"{self.base_url}/records/get/{archive_id}/headers/{record_id}"
        ).json()
        return {"meta": meta, "headers": headers}
    
    def get_payload(self, archive_id, record_id, dest_path):
        with self.session.get(
            f"{self.base_url}/records/get/{archive_id}/data/{record_id}",
            stream=True,
        ) as r:
            with open(dest_path, "wb") as f:
                for chunk in r.iter_content(chunk_size=8192):
                    f.write(chunk)
    
    def search(self, phrase, limit=20):
        return self.session.get(
            f"{self.base_url}/records/search",
            params={"phrase": phrase, "limit": limit},
        ).json()
    
    def submit_job(self, kind, format_, filter_, limit=None):
        body = {"kind": kind, "format": format_, "filter": filter_}
        if limit:
            body["limit"] = limit
        return self.session.post(
            f"{self.base_url}/jobs", json=body
        ).json()
    
    def wait_job(self, job_id, poll=2):
        import time
        while True:
            status = self.session.get(
                f"{self.base_url}/jobs/{job_id}"
            ).json()
            if status["status"] in ("completed", "failed", "cancelled"):
                return status
            time.sleep(poll)

# Использование
client = MetawarcClient("http://127.0.0.1:8000", token="secret")
print(client.health())
print(client.search("выборы", limit=10))
```

## Когда использовать REST API

✅ Подходит:

- **Web-дашборды** (React/Vue/Svelte) с фильтрами и пагинацией.
- **ETL-пайплайны** для выгрузки в ClickHouse/PostgreSQL.
- **CI/CD валидация** — «сколько страниц индексировано из нового архива?»
- **Удалённый доступ** через reverse proxy с TLS/mTLS.
- **Long-running экспорт** через batch-job'ы.

❌ Не подходит:

- **AI-агенты** — для этого MCP.
- **Очень большие выгрузки** (миллионы записей) — лучше прямой SQL/DuckDB-WARC.
- **Real-time данные** — индексирование offline, REST работает с готовым каталогом.
- **Сложные ad-hoc SQL** — для этого прямой DuckDB.

## Ограничения

- **`/records/get/data` лимит 100 МБ** — больше через batch-job.
- **`/records/search` медленный** — columnar scan, не FTS. Для быстрого поиска используйте Solr/Shine.
- **Только metadata + payload** — нет «графа связей» как эндпойнта (хотя метаданные ссылок можно собрать через indexes).

## Ресурсы

- [metawarc главная страница](/kb/instruments/ruarxive-tools/metawarc)
- [metawarc MCP-сервер](/kb/instruments/ruarxive-tools/metawarc-mcp)
- [metawarc docs (полная)](https://ruarxive.org/metawarc/) — OpenAPI-схема
- [metawarc docs: REST API](https://ruarxive.org/metawarc/integrations/rest-api)
- [metawarc docs: Jobs](https://ruarxive.org/metawarc/commands/jobs)
- [metawarc CHANGELOG (включает v2.0.3 endpoints)](https://github.com/ruarxive/metawarc/blob/master/CHANGELOG.md)

## Связанные материалы

- [metawarc (обзор)](/kb/instruments/ruarxive-tools/metawarc)
- [metawarc MCP-сервер](/kb/instruments/ruarxive-tools/metawarc-mcp)
- [WARC-workflow](/kb/guides/warc-workflow) — пайплайн с metawarc.
- [Кейс: wparc → metawarc](/kb/case-studies/wparc-to-metawarc-pipeline)
- [DuckDB-WARC](/kb/instruments/tools/duckdb-warc) — альтернатива для прямого SQL.
- [WARC-файл: формат](/kb/instruments/file-formats/warc)
- [Ландшафт 2026](/kb/instruments/landscape-2026)
