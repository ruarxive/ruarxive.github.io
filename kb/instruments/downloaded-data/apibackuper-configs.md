---
title: Конфигурации apibackuper
description: "Готовые проекты apibackuper для российских госсистем: репозиторий apibackuper-dataarchive с шестью INI-конфигурациями и примеры в репозитории apibackuper — как ими пользоваться и как написать свою конфигурацию."
sidebar_position: 3
last_update:
  date: 2026-10-12
---

# Конфигурации apibackuper

Готовые конфигурации для [apibackuper](/kb/instruments/downloaded-data/apibackuper) лежат в двух местах:

- **[apibackuper-dataarchive](https://github.com/ruarxive/apibackuper-dataarchive)** — проекты, по которым Ruarxive архивировал данные госсистем (репозиторий создан в декабре 2022 года и с тех пор не обновлялся);
- **[examples](https://github.com/ruarxive/apibackuper/tree/master/examples)** в репозитории apibackuper — шаблоны, примеры отдельных возможностей и рабочие проекты в формате YAML.

> Структура и содержимое конфигураций сверены с репозиториями в октябре 2026 года.

## Репозиторий apibackuper-dataarchive

Каждый проект — отдельный каталог с файлом `apibackuper.cfg` (формат INI) и, для POST-запросов, `params.json` с телом запроса.

| Каталог | Источник | API |
| :--- | :--- | :--- |
| `achgovru-checks` | Проверки и отчёты Счётной палаты (ach.gov.ru), с файлами отчётов | GET, по страницам |
| `etrust` | Реестр удостоверяющих центров (e-trust.gosuslugi.ru) | POST, по страницам |
| `gisp-orgs` | Организации в ГИСП (gisp.gov.ru) | POST, со смещением |
| `gvr` | Форма 2.6 ГВР (gis.favr.ru) | GET, по страницам |
| `mvd-districts` | Участки МВД (mvd.ru), с изображениями | GET, по страницам |
| `spb-budget-initiatives` | Инициативы проекта «Твой бюджет» Санкт-Петербурга (tvoybudget.spb.ru), с изображениями | GET, со смещением |

Конфигурация `achgovru-checks` использовалась для архива отчётов Счётной палаты: 4,2 ГБ в сжатом виде, около 5 ГБ в распакованном; копия выложена в Internet Archive ([пост #89 от 02.12.2022](https://t.me/ruarxive/89), [archive.org/details/achgovru-checks](https://archive.org/details/achgovru-checks)).

С 2022 года API этих сайтов могли измениться: перед запуском проверьте конфигурацию командой `estimate`.

### Как запустить

```bash
git clone https://github.com/ruarxive/apibackuper-dataarchive.git
cd apibackuper-dataarchive/etrust

apibackuper validate-config
apibackuper estimate full
apibackuper run full
apibackuper export etrust.jsonl

# Для проектов с секцией [files] — скачать связанные файлы
apibackuper getfiles
```

Конфигурации в формате INI apibackuper 1.0.13 читает с предупреждением об устаревшем формате. Для `etrust` в каталоге `examples` репозитория apibackuper есть и YAML-версия той же конфигурации.

### Пример: INI-конфигурация с файлами

`achgovru-checks/apibackuper.cfg`:

```ini
[settings]
initialized = True
name = achgov-checks

[project]
description = Accounting chamber checks archive
url = https://ach.gov.ru/api/v1/controls/list
http_mode = GET
work_modes = full,incremental,update
iterate_by = page

[params]
page_size_param = count
page_size_limit = 20
page_number_param = page

[data]
pages_number_key = result.pages
data_key = result.items
item_key = ID
change_key = DATE_CREATE

[files]
use_aria2 = True
fetch_mode = prefix
root_url =
keys = FILES.REPORT.SRC,FILES.ADDITIONAL.SRC,FILES.RECOMMENDATIONS.SRC,PERSON.IMG
storage_mode = filepath

[storage]
storage_type = zip
compression = True
```

## Примеры в репозитории apibackuper

Каталог [`examples/`](https://github.com/ruarxive/apibackuper/tree/master/examples):

- **`templates/`** — минимальные YAML-шаблоны: `page-based.yaml` (по номеру страницы), `skip-offset.yaml` (по смещению), `bearer-auth.yaml` (с заголовком `Authorization: Bearer`), `follow-multihop.yaml` (список и переход к карточке каждой записи).
- **`features/`** — по одной возможности на каталог: `concurrency-retry`, `detect`, `export-filters`, `hooks`, `sqlite-storage`, `update-resume`.
- **Рабочие проекты** — `sozd` (законопроекты Госдумы), `budgetreg`, `budgetrgz`, `budgettofk`, `budgetsclassif` (реестры budget.gov.ru), `etrust`, `fpreceivers` (spending.gov.ru), `hhemployers`, `hubofdata`, `subsidies`, `esklp`.

## Типовые фрагменты YAML

Названия полей — по [справочнику конфигурации](https://ruarxive.org/apibackuper/configuration/reference) и шаблонам из `examples/templates`.

### Пагинация по номеру страницы

```yaml
settings:
  name: page-based-example

project:
  url: https://api.example.com/items
  http_mode: GET
  iterate_by: page

params:
  page_number_param: page
  page_size_param: per_page
  page_size_limit: 100

data:
  data_key: items
  total_number_key: total

storage:
  storage_type: zip
```

### Пагинация по смещению

```yaml
project:
  url: https://api.example.com/items
  http_mode: GET
  iterate_by: skip

params:
  count_skip_param: offset
  page_size_param: limit
  page_size_limit: 200
```

Для API с параметрами «от» и «до» используется `iterate_by: range` с `count_from_param` и `count_to_param`. Пагинации по курсору среди документированных режимов нет.

### Авторизация

```yaml
auth:
  type: basic
  username: myuser
  password_file: /path/to/password.txt
```

```yaml
auth:
  type: apikey
  api_key: ${API_KEY}
  api_key_header: X-API-Key
```

Для OAuth2 используются поля `token`, `auth_url` и `refresh_token` (см. [документацию по авторизации](https://ruarxive.org/apibackuper/configuration/auth)).

### Ограничение частоты и обработка ошибок

```yaml
rate_limit:
  enabled: true
  requests_per_second: 2
  burst_size: 5

error_handling:
  retry_on_errors: [429, 500, 502, 503]
  max_consecutive_errors: 10
  continue_on_error: true
```

### Отбор данных при экспорте

Фильтров в конфигурации выгрузки нет; отбирать поля и записи можно при экспорте:

```bash
apibackuper export recent.jsonl --fields id,name,updated_at --where "updated_at >= 2024-01-01"
```

## Как написать свою конфигурацию

1. Изучите API: адрес, метод, параметры страницы и размера страницы, где в ответе лежат записи и общее число.
2. Проверьте запрос вручную:
   ```bash
   curl "https://api.example.com/items?page=1&per_page=10"
   ```
3. Создайте проект и получите черновик конфигурации:
   ```bash
   apibackuper create my-api
   cd my-api
   apibackuper detect --url "https://api.example.com/items" --write-config
   ```
4. Поправьте `apibackuper.yaml`, проверьте его и оцените объём:
   ```bash
   apibackuper validate-config
   apibackuper estimate full
   ```
5. Запустите выгрузку: `apibackuper run full`. Если она прервалась — `apibackuper run full --resume`.

Отдельного тестового режима или ограничения числа страниц в командной строке нет — проверяйте конфигурацию через `validate-config` и `estimate`.

## Связанные материалы

- [apibackuper](/kb/instruments/downloaded-data/apibackuper)
- [Документация apibackuper: примеры](https://ruarxive.org/apibackuper/examples)
- [Репозиторий apibackuper-dataarchive](https://github.com/ruarxive/apibackuper-dataarchive)
- [Создание кастомных workflow](/kb/guides/custom-workflows)
