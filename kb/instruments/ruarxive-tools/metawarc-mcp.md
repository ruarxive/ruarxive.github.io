---
title: metawarc MCP-сервер
sidebar_label: metawarc MCP
sidebar_position: 5
description: "MCP-сервер metawarc только для чтения: семь типизированных инструментов для ИИ-агентов — каталог архивов, записи, заголовки, поиск и сводки без сырого SQL и доступа к файловой системе."
last_update:
  date: 2026-10-12
---

# metawarc MCP-сервер

[metawarc](/kb/instruments/ruarxive-tools/metawarc) включает **MCP-сервер** ([Model Context Protocol](https://modelcontextprotocol.io/)) для ИИ-агентов и MCP-совместимых клиентов: Claude Desktop, Cursor и других. Сервер даёт доступ к проиндексированной WARC-коллекции только на чтение через семь инструментов.

- Требуется дополнение `metawarc[mcp]` (библиотека FastMCP).
- Документация: [ruarxive.org/metawarc/integrations/mcp](https://ruarxive.org/metawarc/integrations/mcp), сценарии — [агенты и MCP](https://ruarxive.org/metawarc/use-cases/agents-and-mcp).

> Список инструментов и их параметры сверены с `metawarc/mcp_server.py` версии 2.0.3 и проверены вызовами через клиент FastMCP на тестовом каталоге (октябрь 2026).

## Чем он безопаснее прямого доступа

- **Только перечисленные инструменты** — других действий у агента нет.
- **Нет сырого SQL** и **нет путей файловой системы** в параметрах.
- **Нет содержимого записей** — только метаданные и заголовки.
- **Нет изменяющих операций** — каталог открывается только на чтение (кроме поиска, которому нужен доступ к сайдкару текстов).
- **Ограниченные выборки** — `list_records` отдаёт не больше 100 записей за вызов, листание — через `offset`.
- Неверные значения (неизвестное измерение, `limit` вне диапазона) возвращаются агенту как ошибка инструмента.

## Установка и запуск

```bash
pip install 'metawarc[mcp]'

# stdio — обычный режим для локальных клиентов
metawarc mcp --dbfile collection.db

# HTTP на локальном адресе: http://127.0.0.1:8191/mcp
metawarc mcp --dbfile collection.db --transport http

# Другой порт
metawarc mcp --dbfile collection.db --transport http --port 8765
```

Опции: `-d/--dbfile`, `--data-dir`, `--transport stdio|http|sse` (по умолчанию `stdio`), `--host` (по умолчанию `127.0.0.1`), `--port` (по умолчанию 8191), `--allow-insecure`. Запуск HTTP или SSE на нелокальном адресе без `--allow-insecure` завершится ошибкой. Авторизации у MCP-сервера нет, поэтому сетевой транспорт стоит держать на `127.0.0.1`.

## Подключение к клиентам

### Claude Desktop

`~/Library/Application Support/Claude/claude_desktop_config.json` (macOS) или `%APPDATA%\Claude\claude_desktop_config.json` (Windows):

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

Файл `~/.cursor/mcp.json` (или `.cursor/mcp.json` в проекте):

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

Если `metawarc` установлен в виртуальное окружение, укажите в `command` полный путь к исполняемому файлу. Формат настроек других клиентов смотрите в их документации.

### HTTP-транспорт

Для клиентов, которые подключаются по URL, запустите `metawarc mcp --transport http` и укажите адрес `http://127.0.0.1:8191/mcp`.

## Инструменты

| Инструмент | Назначение | Параметры |
| :--- | :--- | :--- |
| `list_archives` | Список архивов в каталоге и их статус | — |
| `list_records` | Записи с фильтрами | `archive_ids`, `mimes`, `exts`, `url_pattern`, `host_pattern`, `status_min`, `status_max`, `size_min`, `size_max`, `offset` (по умолчанию 0), `limit` (по умолчанию 50, максимум 100) |
| `get_record_metadata` | Одна запись по архиву и ID записи WARC | `archive_id`, `record_id` |
| `get_record_headers` | Сохранённые HTTP-заголовки записи | `archive_id`, `record_id` |
| `search_records` | Поиск фразы в сайдкаре `texts` | `phrase`, `limit` (по умолчанию 50) |
| `collection_stats` | Сводка по измерениям | `archive_ids`, `dimensions` (через запятую из `mime`, `ext`, `status`, `host`, `date`, `size_bucket`; пусто — все), `top` (1–100 000, по умолчанию 10) |
| `metadata_summary` | Сводка по извлечённым метаданным | `metadata_types` (через запятую из `pdfs`, `images`, `ooxmldocs`, `oledocs`, `videos`, `audio`, `fonts` или `all`), `archive_ids`, `top` (по умолчанию 10) |

Списки (`archive_ids`, `mimes`, `exts`, `dimensions`, `metadata_types`) передаются строкой через запятую. `list_records` возвращает `{total, offset, limit, revision, items}`, `search_records` — `{phrase, limit, total, hits}`, где у каждого результата есть `archive_id`, `warc_id`, `source`, `url`, `snippet`.

### Чего инструменты не делают

- не выполняют SQL;
- не открывают файлы по пути;
- не отдают содержимое записей (для этого есть `metawarc dump` и [REST API](/kb/instruments/ruarxive-tools/metawarc-rest));
- не ставят фоновые задачи и ничего не изменяют.

## Примеры работы агента

```text
Пользователь: Что вообще есть в этой коллекции?
Агент: collection_stats(dimensions="mime,host", top=10)
       → самые частые MIME-типы и хосты с числом записей и объёмом
```

```text
Пользователь: Найди страницы, где упоминается «бюджет».
Агент: search_records(phrase="бюджет", limit=20)
       → список URL с фрагментами текста
```

```text
Пользователь: Сколько PDF с сайта example.gov.ru?
Агент: list_records(host_pattern="example.gov.ru", mimes="application/pdf", limit=100)
       → total и первые 100 записей; следующие — с offset=100, 200, ...
```

```text
Пользователь: Что известно о PDF в коллекции?
Агент: metadata_summary(metadata_types="pdfs", top=20)
       → сводка по извлечённым метаданным PDF
```

Поиск работает только после `metawarc index-content --text`, сводка по метаданным — после `index-content --type …` для нужных типов.

## Безопасность

| Угроза | Защита |
| :--- | :--- |
| SQL-инъекция, выгрузка всего каталога | Нет инструмента с произвольным SQL; фильтры типизированы |
| Чтение произвольных файлов | Пути не принимаются |
| Выгрузка больших объёмов | `limit` ≤ 100 у `list_records` |
| Изменение данных | Изменяющих инструментов нет |
| Доступ по сети | По умолчанию только `127.0.0.1`; для другого адреса нужен явный `--allow-insecure` |

Рекомендации: используйте stdio, где это возможно; если нужен HTTP, оставляйте его на локальном адресе. Подробнее — в [SECURITY.md](https://github.com/ruarxive/metawarc/blob/master/SECURITY.md) и [разделе о безопасности](https://ruarxive.org/metawarc/architecture/security).

## Ограничения

- Только чтение: добавлять архивы, удалять записи и выгружать файлы через MCP нельзя.
- Пустой результат `search_records`, если не строился сайдкар `texts`.
- Для полного перебора большой коллекции через `list_records` нужно много вызовов; для выгрузок удобнее [REST API и фоновые задачи](/kb/instruments/ruarxive-tools/metawarc-rest#фоновые-задачи).
- Сервер работает с одним каталогом, указанным в `--dbfile`.

## Альтернативы

- [REST API](/kb/instruments/ruarxive-tools/metawarc-rest) — для интеграций, содержимого записей и выгрузок.
- [CLI metawarc](https://ruarxive.org/metawarc/commands) — для скриптов.
- SQL в DuckDB поверх Parquet-сайдкаров — для разового анализа, см. [рецепты](/kb/instruments/ruarxive-tools/metawarc-cookbook).

## Связанные материалы

- [metawarc (обзор)](/kb/instruments/ruarxive-tools/metawarc)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [Формат WARC](/kb/instruments/file-formats/warc)
- [Кейс: wparc → metawarc](/kb/case-studies/wparc-to-metawarc-pipeline)
