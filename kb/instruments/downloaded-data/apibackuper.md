---
title: apibackuper
description: "Инструмент командной строки и Python-библиотека для резервного копирования REST API с постраничной выдачей: конфигурация в apibackuper.yaml, оценка объёма, режимы full/continue/update, экспорт в JSONL, gzip, zstd и Parquet."
sidebar_position: 1
last_update:
  date: 2026-10-28
---

# apibackuper

[apibackuper](https://github.com/ruarxive/apibackuper) — инструмент командной строки и Python-библиотека для архивации и резервного копирования данных из REST API. Он скачивает постраничную выдачу API в локальное хранилище и экспортирует архив в JSON Lines, gzip, zstd или Parquet. Рассчитан на повторяемые и долгие выгрузки, а не на разовые запросы.

Инструмент создавался для сохранения государственных данных: в репозитории есть рабочие примеры для реестров budget.gov.ru, Госдумы, e-trust.gosuslugi.ru и других API. С его помощью, например, собран архив отчётов Счётной палаты ([пост #89 от 02.12.2022](https://t.me/ruarxive/89)).

- Репозиторий: [github.com/ruarxive/apibackuper](https://github.com/ruarxive/apibackuper) · Документация: [ruarxive.org/apibackuper](https://ruarxive.org/apibackuper/) · Лицензия: MIT

## Возможности

*   GET- и POST-API с пагинацией по номеру страницы, смещению (skip/offset) или диапазону.
*   Режимы `full`, `continue` и `update`, продолжение с контрольной точки (`--resume`).
*   Оценка объёма и времени до выгрузки (`estimate`), проверка конфигурации без запросов к API (`--dry-run`).
*   Полная выгрузка публикуется только после успешного завершения: при сбое предыдущая полная копия остаётся целой.
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

С версии 2.0.0 (17.10.2026) требуется Python 3.10 или новее. На Python 3.8 и 3.9 ставится только ветка 1.x.

> Команды сверены с `--help` и исходным кодом версии 2.0.0 (октябрь 2026).

## Команды

| Команда | Что делает |
| :--- | :--- |
| `apibackuper create <name>` | Создаёт каталог проекта |
| `apibackuper detect [--url URL] [--write-config]` | Определяет ключ данных, размер страницы и способ пагинации; с `--write-config` записывает `apibackuper.yaml` |
| `apibackuper validate-config` | Проверяет конфигурацию проекта |
| `apibackuper estimate [full]` | Оценивает число записей, объём и время выгрузки |
| `apibackuper run [full\|continue\|update] [--resume] [--dry-run]` | Выгружает данные из API. `continue` догружает страницы, которых ещё нет в хранилище; `incremental` — псевдоним `continue` |
| `apibackuper update [--resume] [--dry-run]` | Запрашивает у API только записи новее прошлого запуска (см. ниже) |
| `apibackuper follow full\|continue` | Дозапрашивает подробности по уже выгруженным записям |
| `apibackuper getfiles` | Скачивает файлы, связанные с записями (секция `files` конфигурации) |
| `apibackuper export <filename>` | Экспортирует данные; формат определяется по расширению или `--format` |
| `apibackuper info [--json]` | Параметры и статистика проекта |

Почти у всех команд есть `-p/--projectpath` — путь к каталогу проекта (по умолчанию текущий). У `export` также `--fields` (список полей через запятую) и `--where` (простое условие, например `"updated_at >= 2024-01-01"`). Флаг `--dry-run` (у `run` также `--profile`) печатает итоговую конфигурацию, ожидаемое число записей и время в JSON и завершается, не отправляя запросов.

### Обновление: `update`

`apibackuper update` передаёт API фильтр «только изменившееся после прошлого запуска». Поэтому API должен поддерживать такой параметр. Способ задаёт `project.update_mode`:

- `by_change_key` — apibackuper запоминает максимальное значение поля `data.change_key` в выгруженных записях и передаёт его в параметре `params.change_key_param`;
- `by_timestamp` — передаёт время начала прошлого успешного запуска в параметре `params.update_since_param`.

Каждый запуск `update` сохраняется отдельным поколением в каталоге `runs/<id>/` хранилища. Экспорт включает все версии записей и не удаляет повторы по `item_key`: дедупликацию при необходимости делают после экспорта.

### Что изменилось в 2.0

- Нужен Python 3.10+.
- Полная выгрузка пишется во временное хранилище `.partial` и публикуется только после успешного сбора. Прерванный запуск продолжается с `--resume`, сохранённые страницы не запрашиваются повторно.
- В YAML работает подстановка переменных окружения `${VAR}` и `${VAR:-default}`, конфигурация проверяется строже.
- `run incremental` стал псевдонимом `run continue`. Если в ваших скриптах этот режим использовался для добавления новых записей, перейдите на `update`.
- Старые хранилища и контрольные точки версий 1.x читаются. Каталоги `.journal` рядом с ZIP-архивами не удаляйте, пока выгрузка не завершена.

Полный список изменений — в [CHANGELOG](https://github.com/ruarxive/apibackuper/blob/v2.0.0/CHANGELOG.md).

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
