---
title: filegetter
sidebar_label: filegetter
sidebar_position: 4
description: "Массовое скачивание файлов по ссылкам из CSV, JSONL или списка: конфигурация в INI-файле filegetter.cfg, докачка, отчёт с SHA-256, хранение в ZIP или каталоге, опциональная запись WARC."
last_update:
  date: 2026-10-29
---

# filegetter

[filegetter](https://github.com/ruarxive/filegetter) — инструмент командной строки и Python-библиотека для массового скачивания файлов, ссылки на которые перечислены в наборе данных: CSV-таблице, файле JSON Lines или простом списке. Типичная задача — собрать PDF, DOC или изображения, на которые ссылается набор данных, и сохранить их рядом с ним. Утилиту представили в [посте #75 от 05.10.2022](https://t.me/ruarxive/75); она сделана на основе [apibackuper](/kb/instruments/downloaded-data/apibackuper).

- Репозиторий: [github.com/ruarxive/filegetter](https://github.com/ruarxive/filegetter) · Лицензия: MIT · Язык: Python

## Когда использовать

Подходит, если нужно:

- скачать файлы по ссылкам из колонки CSV или поля JSONL (например, из выгрузки [apibackuper](/kb/instruments/downloaded-data/apibackuper));
- скачать файлы с предсказуемыми адресами вида `https://example.org/files/{}.pdf`, подставляя идентификаторы из списка;
- докачивать недостающее при повторных запусках и получить отчёт с HTTP-статусом и SHA-256 каждого файла;
- сразу записать ответы сервера в WARC.

Не подходит, если:

- сайт отрисовывается JavaScript и ссылок на файлы нет в данных — используйте [Browsertrix Crawler](/kb/instruments/tools/browsertrix);
- нужно обойти сайт целиком по ссылкам — это задача краулера ([wget](/kb/instruments/tools/wget), [grab-site](/kb/instruments/tools/grab-site));
- файлы доступны только после авторизации: настроек входа и заголовков авторизации в конфигурации нет.

## Установка

```bash
pip install --upgrade filegetter

# с поддержкой записи WARC
pip install --upgrade "filegetter[warc]"
```

Требуется Python 3.9 или новее.

> Команды сверены с README и `--help` версии 1.1.0 (октябрь 2026).

## Быстрый старт

Каждый проект — отдельный каталог с файлом `filegetter.cfg` (формат INI) и исходным файлом данных. Пример из README: файлы законопроекта о бюджете с сайта Госдумы.

```ini
[project]
name = budget2023
source = dataset.csv
source_type = csv
delimiter = ,

[data]
data_key = href

[files]
fetch_mode = prefix
root_url = https://sozd.duma.gov.ru
keys = href
storage_mode = filepath
transfer_ext = True

[storage]
storage_type = zip
compression = True
```

```bash
cd budget2023
filegetter run
```

Файлы попадут в `storage/files.zip`, отчёт по каждому файлу — в `storage/processed.csv`, кэш списка идентификаторов — в `storage/allfiles.csv`.

## Команда `run`

Единственная команда — `filegetter run`.

| Опция | Описание |
| :--- | :--- |
| `-p, --projectpath PATH` | Каталог проекта (по умолчанию текущий) |
| `--dry-run` | Показать, что будет скачано, без обращения к сети |
| `--limit N` | Скачать не больше N файлов за запуск |
| `--refresh` | Перечитать исходный файл вместо кэша `allfiles.csv` |
| `-v, --verbose` | Подробный журнал |

Код выхода `0` — все файлы обработаны или пропущены, `1` — ошибка конфигурации или часть файлов не скачалась. Неудачные файлы записываются в отчёт и повторяются при следующем запуске.

Версию показывает `filegetter --version`: это опция самой утилиты, а не команды `run`.

## Конфигурация `filegetter.cfg`

### `[project]`

| Ключ | Описание |
| :--- | :--- |
| `name` | Короткое имя проекта (обязательно) |
| `source` | Путь к исходному файлу относительно каталога проекта (обязательно) |
| `source_type` | `csv`, `jsonl` или `list` (обязательно) |
| `delimiter` | Разделитель CSV; `tab` означает табуляцию, по умолчанию `,` |

### `[data]`

| Ключ | Описание |
| :--- | :--- |
| `data_key` | Для `csv` — имя колонки со ссылками или идентификаторами. Для `jsonl` — путь (через точку) к объекту или массиву объектов внутри каждой строки, из которых берутся поля `keys`. Обязателен для `csv` и `jsonl` |

### `[files]`

| Ключ | Описание |
| :--- | :--- |
| `fetch_mode` | `prefix` — дописать идентификатор к `root_url`; `pattern` — подставить его вместо `{}` в `root_url` (обязательно) |
| `root_url` | Базовый адрес; может быть пустым, если в данных уже полные ссылки (обязательно) |
| `keys` | Поля со ссылками через запятую (обязательно; используется для JSONL) |
| `storage_mode` | `filepath` — повторить путь из URL (по умолчанию), `id` — назвать файл по идентификатору |
| `transfer_ext` | `True` — добавить расширение файлам без него (из `Content-Disposition` или `default_ext`) |
| `default_ext` | Расширение по умолчанию |
| `file_storage_type` | `zip` (по умолчанию) или `filesystem` |
| `delay` | Пауза между запросами, секунды (по умолчанию 0) |
| `retries` | Повторы при 429, 5xx и ошибках соединения (по умолчанию 2) |
| `timeout` | Таймаут запроса, секунды (по умолчанию 30) |
| `workers` | Число параллельных потоков (по умолчанию 1) |
| `max_filesize` | Пропускать файлы больше указанного размера в байтах (по умолчанию 270000000) |
| `user_agent` | Заголовок User-Agent |
| `verify_ssl` | Проверять TLS-сертификаты (по умолчанию `True`) |

### `[storage]`

| Ключ | Описание |
| :--- | :--- |
| `storage_path` | Каталог для результатов (по умолчанию `storage`) |
| `compression` | Сжимать ZIP (`True` по умолчанию) |
| `storage_type` | Устаревший синоним `file_storage_type` из конфигов версии 1.0.x |
| `write_warc` | `True` — дополнительно записывать каждый успешный ответ (HTTP-заголовки и тело) в `storage/files.warc.gz` в формате WARC/1.0; нужен `filegetter[warc]` |

## Примеры

### Файлы по шаблону адреса

Диапазоны filegetter сам не генерирует: идентификаторы берутся из исходного файла. Список можно подготовить заранее.

```bash
mkdir reports && cd reports
seq 1 500 > ids.txt
```

```ini
[project]
name = reports
source = ids.txt
source_type = list

[files]
fetch_mode = pattern
root_url = https://example.org/files/{}.pdf
keys = id
file_storage_type = filesystem
delay = 1

[storage]
write_warc = True
```

```bash
filegetter run --dry-run --limit 5   # проверить, какие адреса получатся
filegetter run
```

Файлы окажутся в `storage/files/`, копия ответов в WARC — в `storage/files.warc.gz`.

### Ссылки из выгрузки apibackuper

Если API отдаёт записи, в которых ссылки на файлы лежат во вложенном объекте или массиве, экспортируйте данные в JSONL и укажите путь к нему в `data_key`, а имена полей со ссылками — в `keys`:

```bash
apibackuper export items.jsonl -p myproject
```

```ini
[project]
name = attachments
source = items.jsonl
source_type = jsonl

[data]
data_key = doc

[files]
fetch_mode = prefix
root_url =
keys = url
```

Для строк вида `{"id": 1, "doc": {"url": "https://example.org/a.pdf"}}` будет скачан файл по адресу из `doc.url`. Если ссылка лежит в поле верхнего уровня, проще сохранить ссылки списком (по одной в строке) и использовать `source_type = list`.

### Готовые проекты в репозитории

В каталоге [`examples/`](https://github.com/ruarxive/filegetter/tree/main/examples) три проекта с исходными данными и `filegetter.cfg`:

- **`budget2023`** — 602 документа законопроекта о бюджете на 2023 год с sozd.duma.gov.ru (тот же пример, что в «Быстром старте»);
- **`goskatalog`** — 2 609 изображений из Госкаталога музейного фонда: полные ссылки в колонке `images.url`, расширение по умолчанию `jpg`;
- **`rupolitparties`** — 530 отчётов политических партий с сайта ЦИК России (`cikrf.ru`), CSV с разделителем-табуляцией.

Конфигурации написаны для версии 1.0.x и используют устаревший ключ `storage_type`. В версии 1.1.0 все три проходят `filegetter run --dry-run` без изменений (проверено 29.10.2026); число файлов выше — из этого запуска.

## Использование из Python

```python
from filegetter.cmds.project import ConfigError, FilegetterBuilder

try:
    builder = FilegetterBuilder("/path/to/project")
except ConfigError as e:
    raise SystemExit(f"Ошибка конфигурации: {e}")

stats = builder.run()  # те же параметры, что у CLI: dry_run=, limit=, refresh=
print(stats)           # {'total': 42, 'skipped': 40, 'downloaded': 2, 'failed': 0}
```

## Отчёт `processed.csv`

Колонки: `url`, `filename`, `mime`, `ext`, `disp_name`, `filesize`, `status` (HTTP-код или `error`), `sha256`. Строка записывается сразу после обработки файла, поэтому прерванный запуск можно просто повторить: файлы со статусом 200 будут пропущены.

## Ограничения

- Работает только с общедоступными файлами; авторизации нет.
- JavaScript не выполняется: нужны прямые ссылки на файлы.
- Встроенного планировщика нет; для регулярных запусков используйте cron или CI.

## Связанные материалы

- [Все инструменты Ruarxive](/kb/instruments/ruarxive-tools)
- [apibackuper](/kb/instruments/downloaded-data/apibackuper) — выгрузка данных из API, откуда часто берутся списки ссылок
- [ydiskarc](./ydiskarc) — публичные папки Яндекс.Диска
- [metawarc](./metawarc) — индексация WARC, в том числе созданного с `write_warc = True`
- [Руководства по архивации](/kb/guides)
