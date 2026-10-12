---
title: apibackuper
description: "Инструмент командной строки и Python-библиотека для резервного копирования REST API с постраничной выдачей: конфигурация в apibackuper.yaml, оценка объёма, режимы full/incremental/update, экспорт в JSONL, gzip, zstd и Parquet."
sidebar_position: 1
last_update:
  date: 2026-10-12
---

# apibackuper

[apibackuper](https://github.com/ruarxive/apibackuper) — инструмент командной строки и Python-библиотека для архивации и резервного копирования данных из REST API. Он скачивает постраничную выдачу API в локальное хранилище и экспортирует архив в JSON Lines, gzip, zstd или Parquet. Рассчитан на повторяемые и долгие выгрузки, а не на разовые запросы.

Инструмент создавался для сохранения государственных данных: в репозитории есть рабочие примеры для реестров budget.gov.ru, Госдумы, e-trust.gosuslugi.ru и других API. С его помощью, например, собран архив отчётов Счётной палаты ([пост #89 от 02.12.2022](https://t.me/ruarxive/89)).

- Репозиторий: [github.com/ruarxive/apibackuper](https://github.com/ruarxive/apibackuper) · Документация: [ruarxive.org/apibackuper](https://ruarxive.org/apibackuper/) · Лицензия: MIT

## Возможности

*   GET- и POST-API с пагинацией по номеру страницы, смещению (skip/offset) или диапазону.
*   Режимы `full`, `incremental` и `update`, продолжение с контрольной точки (`--resume`).
*   Оценка объёма и времени до выгрузки (`estimate`).
*   Хранение в ZIP, в каталоге или в SQLite.
*   Экспорт в JSON Lines, gzip, Zstandard или Parquet с выбором полей и простым фильтром.
*   Конфигурация в YAML; формат INI ещё читается, но объявлен устаревшим.
*   Авторизация Basic, Bearer, API Key, OAuth2; ограничение частоты запросов, повторы, параллельные запросы.
*   Дозапросы по связанным объектам (`follow`) и скачивание приложенных файлов (`getfiles`).

## Установка

```bash
pip install apibackuper

# с экспортом в Parquet и загрузкой через aria2
pip install "apibackuper[recommended]"
```

Требуется Python 3.8 или новее.

> Команды сверены с README и `--help` версии 1.0.13 (октябрь 2026).

## Команды

| Команда | Что делает |
| :--- | :--- |
| `apibackuper create <name>` | Создаёт каталог проекта |
| `apibackuper detect [--url URL] [--write-config]` | Определяет ключ данных, размер страницы и способ пагинации; с `--write-config` записывает `apibackuper.yaml` |
| `apibackuper validate-config` | Проверяет конфигурацию проекта |
| `apibackuper estimate [full]` | Оценивает число записей, объём и время выгрузки |
| `apibackuper run [full] [--resume]` | Выгружает данные из API |
| `apibackuper update [--resume]` | Режим обновления по сохранённому состоянию |
| `apibackuper follow full\|continue` | Дозапрашивает подробности по уже выгруженным записям |
| `apibackuper getfiles` | Скачивает файлы, связанные с записями (секция `files` конфигурации) |
| `apibackuper export <filename>` | Экспортирует данные; формат определяется по расширению или `--format` |
| `apibackuper info [--json]` | Параметры и статистика проекта |

Почти у всех команд есть `-p/--projectpath` — путь к каталогу проекта (по умолчанию текущий). У `export` также `--fields` (список полей через запятую) и `--where` (простое условие, например `"updated_at >= 2024-01-01"`).

## Быстрый старт

```bash
apibackuper create myproject
cd myproject

# Предложить конфигурацию по ответу API и записать apibackuper.yaml
apibackuper detect --url "https://api.example.com/items" --write-config
apibackuper validate-config

apibackuper estimate full
apibackuper run full
apibackuper export myproject.jsonl
apibackuper export myproject.parquet   # нужен apibackuper[recommended]
```

`create` создаёт каталог с заготовкой `apibackuper.cfg` в старом формате INI. Если в каталоге есть `apibackuper.yaml` (или `apibackuper.yml`), используется он; при работе с INI-конфигом команды выводят предупреждение об устаревшем формате.

## Конфигурация `apibackuper.yaml`

Обязательные секции: `settings`, `project`, `params`, `data`, `storage`. Пример — реальный конфиг для POST-API реестра удостоверяющих центров (`examples/etrust` в репозитории):

```yaml
settings:
  initialized: true
  name: etrust

project:
  description: E-Trust UC list
  url: https://e-trust.gosuslugi.ru/app/scc/portal/api/v1/portal/ca/list
  http_mode: POST
  work_modes: full,incremental,update
  iterate_by: page

params:
  page_size_param: recordsOnPage
  page_size_limit: 100
  page_number_param: page

data:
  total_number_key: total
  data_key: data
  item_key: РеестровыйНомер
  change_key: СтатусАккредитации.ДействуетС

storage:
  storage_type: zip
```

Для POST-запросов тело запроса берётся из `params.json` в каталоге проекта.

Основные поля:

| Секция | Поля |
| :--- | :--- |
| `settings` | `name` (обязательно), `initialized`, `splitter` (разделитель путей, по умолчанию `.`), `logfile`, `checkpoint_interval_pages` |
| `project` | `url`, `http_mode` (`GET`/`POST`) — обязательно; `iterate_by` (`page`, `skip`, `range`), `work_modes`, `resp_type` (`json`, `xml`, `html`), `default_delay`, `retry_count`, `retry_delay` |
| `params` | `page_size_limit` (обязательно), `page_number_param`, `page_size_param`, `start_page`, `count_skip_param`, `count_from_param`, `count_to_param`, `query_mode` |
| `data` | `data_key` (где в ответе список записей), `total_number_key` или `pages_number_key`, `item_key` (уникальный ключ записи), `change_key` |
| `storage` | `storage_type` (`zip`, `filesystem`, `sqlite`) — обязательно; `storage_path` (по умолчанию `storage`), `compression` |

Полный список — в [справочнике конфигурации](https://ruarxive.org/apibackuper/configuration/reference).

### Авторизация

```yaml
auth:
  type: bearer          # basic | bearer | apikey | oauth2
  token_file: /path/to/token.txt
```

Секреты лучше хранить в файлах (`token_file`, `password_file`) или подставлять из переменных окружения: YAML поддерживает `${VAR}` и `${VAR:-default}`. Подробнее — [документация по авторизации](https://ruarxive.org/apibackuper/configuration/auth).

### Ограничение частоты запросов

```yaml
rate_limit:
  enabled: true
  requests_per_second: 2
  burst_size: 5
```

Повторы и таймауты настраиваются в секциях `request` (`timeout`, `retry.max_retries`, `retry.backoff_strategy`, `parallelism` и др.) и `error_handling` (`max_consecutive_errors`, `continue_on_error`).

## Готовые конфигурации

Рабочие проекты для российских госсистем лежат в репозитории [apibackuper-dataarchive](https://github.com/ruarxive/apibackuper-dataarchive) и в каталоге [examples](https://github.com/ruarxive/apibackuper/tree/master/examples) самого apibackuper. Подробнее — [Конфигурации apibackuper](/kb/instruments/downloaded-data/apibackuper-configs).

## Связанные материалы

- [Конфигурации apibackuper](/kb/instruments/downloaded-data/apibackuper-configs)
- [filegetter](/kb/instruments/ruarxive-tools/filegetter) — скачивание файлов по ссылкам из выгрузки
- [Загружаемые данные](/kb/instruments/downloaded-data)
- [Документация apibackuper](https://ruarxive.org/apibackuper/)
