---
title: metawarc MCP-сервер
sidebar_label: metawarc MCP
sidebar_position: 5
description: "Read-only MCP-сервер metawarc для AI-агентов: 7 типизированных инструментов для поиска, каталога и метаданных без доступа к сырому SQL и файловой системе"
---

# metawarc MCP-интеграция

[metawarc](/kb/instruments/ruarxive-tools/metawarc) экспонирует **MCP-сервер** ([Model Context Protocol](https://modelcontextprotocol.io/)) для AI-агентов: Claude Desktop, Cursor, Continue, Cline, Cody и любых других MCP-совместимых клиентов. Сервер предоставляет read-only доступ к индексированной WARC-коллекции через 7 типизированных инструментов.

- Требуется: `metawarc[mcp]` (дополнительно `metawarc[api]` если нужен REST параллельно).
- Полная документация: [ruarxive.org/metawarc/integrations/mcp](https://ruarxive.org/metawarc/integrations/mcp).
- Раздел «Агенты и MCP» в cookbook: [ruarxive.org/metawarc/use-cases/agents-and-mcp](https://ruarxive.org/metawarc/use-cases/agents-and-mcp).

## Зачем нужен MCP-сервер

WARC-коллекция в DuckDB-каталоге — это «сокровищница», в которой часто нельзя просто SQL-запросом ковыряться, особенно если коллекция лежит на общем диске, у неё несколько владельцев или нужна аудит-трасса. MCP-сервер metawarc решает это:

- **Allowlist инструментов** — агент видит только то, что явно разрешено.
- **Без сырого SQL** — нет инструмента «выполнить произвольный запрос».
- **Без файловой системы** — агент не может попросить «прочитай файл по пути `/var/data/raw.warc.gz`».
- **Bound-параметры** — все фильтры прогоняются через типизированные Pydantic-модели, невалидные значения отвергаются.
- **Пагинация и лимиты** — `list_records` имеет `limit` (по умолчанию 50, максимум 100) и `page` (максимум 100). Агент не сможет за раз выгрузить всю коллекцию.
- **Read-only by design** — нет ни одного инструмента для записи, удаления, модификации.

## Установка и запуск

```bash
# Установка с поддержкой MCP
pip install 'metawarc[mcp]'

# Запуск по stdio (типичный режим для локальных IDE)
metawarc mcp --dbfile collection.db

# Запуск по HTTP на loopback (для удалённых IDE)
metawarc mcp --dbfile collection.db --transport http --port 8765

# Транспорт по HTTP вне loopback требует явного флага
metawarc mcp --dbfile collection.db --transport http --allow-insecure
```

## Подключение к AI-клиентам

### Claude Desktop

`~/Library/Application Support/Claude/claude_desktop_config.json` (macOS) или `%APPDATA%/Claude/claude_desktop_config.json` (Windows):

```json
{
  "mcpServers": {
    "ruarxive-metawarc": {
      "command": "metawarc",
      "args": ["mcp", "--dbfile", "/path/to/collection.db"]
    }
  }
}
```

### Cursor

В `~/.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "ruarxive-metawarc": {
      "command": "metawarc",
      "args": ["mcp", "--dbfile", "/path/to/collection.db"]
    }
  }
}
```

### Continue

В `~/.continue/config.json`:

```json
{
  "experimental": {
    "modelContextProtocolServers": [
      {
        "name": "ruarxive-metawarc",
        "command": "metawarc",
        "args": ["mcp", "--dbfile", "/path/to/collection.db"]
      }
    ]
  }
}
```

### HTTP-транспорт (удалённый агент)

```json
{
  "mcpServers": {
    "ruarxive-metawarc": {
      "url": "http://127.0.0.1:8765/mcp"
    }
  }
}
```

## Доступные инструменты

Сервер экспонирует ровно 7 типизированных инструментов. Все параметры валидируются Pydantic-моделями; недопустимые значения возвращают ошибку `ValidationError`, а не молча подставляются.

| Инструмент | Назначение | Ключевые параметры |
| :--- | :--- | :--- |
| `list_archives` | Список всех проиндексированных WARC-файлов в каталоге. | — |
| `list_records` | Пагинированный список записей. | `mime`, `host`, `status`, `from_date`, `to_date`, `limit` (≤100), `page` (≤100) |
| `get_record_metadata` | Метаданные одной записи (WARC-заголовки + HTTP-заголовки). | `record_id` |
| `get_record_headers` | Только HTTP-заголовки записи. | `record_id` |
| `search_records` | Полнотекстовый поиск по фразе в извлечённых текстах. Требует `metawarc index-content --text`. | `query`, `limit` |
| `collection_stats` | Сводная статистика по коллекции. | `dimension`: `mime` \| `ext` \| `status` \| `host` \| `date` \| `size_bucket` |
| `metadata_summary` | Сводка по извлечённым метаданным. | `kind`: `pdfs` \| `images` \| `ooxmldocs` \| `oledocs` \| `videos` \| `audio` \| `fonts` \| `all` |

### Что инструменты НЕ делают

- ❌ Не выполняют сырой SQL.
- ❌ Не открывают произвольные файлы на диске.
- ❌ Не возвращают payload (содержимое файла) — только метаданные и заголовки.
- ❌ Не пишут, не удаляют, не модифицируют.
- ❌ Не стартуют долгие batch-задачи (для экспорта данных используйте [REST API + jobs](https://ruarxive.org/metawarc/integrations/rest-api)).

## Примеры использования с агентом

### 1. Исследователь просит «найди PDF по экологии»

```
User: Найди все PDF в коллекции про экологию.
Agent: вызывает search_records(query="экология", limit=20)
       фильтрует по mime=application/pdf
       возвращает 12 ссылок с заголовками и SHA-256
```

### 2. Журналист спрашивает «что вообще есть в архиве»

```
User: Что в этой коллекции?
Agent: вызывает collection_stats(dimension="mime")
       → application/pdf: 412
       → image/jpeg: 2 980
       → text/html: 1 380
       затем collection_stats(dimension="host")
       → 14 разных хостов
```

### 3. Архивист проверяет полноту

```
User: Сколько постов мы сняли?
Agent: вызывает list_archives() — получает список WARC
       вызывает list_records(host="example.gov.ru", mime="application/json",
                             from_date="2024-01-01", to_date="2024-12-31")
       → 1 200 записей
       сравнивает с ожидаемым числом, отчитывается о расхождении
```

### 4. Исследователь хочет метаданные PDF

```
User: Покажи метаданные всех PDF.
Agent: вызывает metadata_summary(kind="pdfs")
       → 412 PDF, среднее число страниц 14, общий объём 1.2 ГБ
       вызывает list_records(mime="application/pdf", limit=100)
       возвращает первые 100 с авторами, датами, числом страниц
```

## Безопасность

MCP-сервер metawarc спроектирован с учётом принципа «агент — недоверенный клиент»:

| Угроза | Защита |
| :--- | :--- |
| Сырой SQL → эксфильтрация / DoS | Нет инструмента, выполняющего произвольный SQL |
| Чтение произвольных файлов | Нет доступа к файловой системе |
| Случайный «дам всего» | Жёсткие лимиты `limit ≤ 100`, `page ≤ 100` |
| Запись/удаление | Нет ни одного мутирующего инструмента |
| Подмена payload | Выходные данные — только метаданные, payload не возвращается |
| Удалённый доступ по сети | По умолчанию слушает только loopback (`127.0.0.1`) |
| Перехват трафика по HTTP | Loopback-only по умолчанию; для внешнего HTTP нужен `--allow-insecure` (флаг) |

### Для production-развёртывания

1. Запускайте MCP-сервер через **stdio** там, где это возможно (не сетевой транспорт).
2. Если нужен HTTP — **reverse proxy с TLS и аутентификацией** (Caddy / nginx + mTLS).
3. Не передавайте путь к БД как «доверенный»: инструменты оперируют внутри уже открытого каталога, и путь не виден агенту.
4. Ограничьте `--allow-insecure` политикой: используйте его только за reverse proxy.

## Ограничения

- **Read-only** — нельзя через MCP добавлять новые архивы, удалять записи или экспортировать файлы. Для экспорта используйте [metawarc dump](https://ruarxive.org/metawarc/commands/dump) или [REST API + jobs](https://ruarxive.org/metawarc/integrations/rest-api).
- **Поиск работает только после `index-content --text`**. Без этой команды `search_records` вернёт пустой результат.
- **Пагинация ограничена**: `page ≤ 100`, `limit ≤ 100` — всего до 10 000 записей за один «обход» через `list_records`. Для полного экспорта используйте REST/jobs.
- **HTTP-транспорт** — loopback-only по умолчанию, не предназначен для прямого выхода в интернет.
- **Каждый запуск сервера = одно подключение к каталогу** — каталог должен быть доступен по тому пути, что указан в `--dbfile`.

## Альтернативы

- **[REST API](https://ruarxive.org/metawarc/integrations/rest-api)** — для интеграций с дашбордами, веб-приложениями, ETL-процессами. Те же данные, но через HTTP, с поддержкой batch-задач.
- **[metawarc CLI](https://ruarxive.org/metawarc/commands)** — для скриптов и CI/CD.
- **Прямой SQL через DuckDB** — для ad-hoc-анализа в ноутбуке, когда ограничения MCP мешают.

## Связанные материалы

- [metawarc (обзор)](/kb/instruments/ruarxive-tools/metawarc) — основная страница инструмента
- [Model Context Protocol](https://modelcontextprotocol.io/) — спецификация протокола
- [WARC-формат](/kb/instruments/file-formats/warc) — структура данных, с которыми работает сервер
- [Кейс: пайплайн wparc → metawarc](/kb/case-studies/wparc-to-metawarc-pipeline) — практический пример индексируемого архива
- [БЗ по безопасности metawarc (SECURITY.md)](https://github.com/ruarxive/metawarc/blob/master/SECURITY.md) — модель угроз
