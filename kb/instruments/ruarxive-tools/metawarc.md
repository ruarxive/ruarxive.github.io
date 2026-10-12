---
title: metawarc
sidebar_label: metawarc
description: "Индексация, поиск, извлечение метаданных и анализ WARC-коллекций на DuckDB и Parquet; REST API, MCP-сервер и локальный просмотр сохранённых сайтов."
last_update:
  date: 2026-10-12
---

# metawarc (WARC)

**metawarc** — инструмент Ruarxive для работы с уже собранными WARC-коллекциями. В отличие от [wparc](./wparc), [ydiskarc](./ydiskarc) и [filegetter](./filegetter), которые **собирают** данные, metawarc занимается следующим этапом: **индексацией, поиском, извлечением метаданных и анализом** архивов. Создавать или упаковывать файлы в WARC metawarc не умеет.

Репозиторий: [github.com/ruarxive/metawarc](https://github.com/ruarxive/metawarc) · Документация: [ruarxive.org/metawarc](https://ruarxive.org/metawarc/) · Лицензия: MIT · Python 3.10+

## Зачем нужен

WARC — бинарный контейнер с ответами сервера, HTTP-заголовками и телами ресурсов. Чтобы ответить на вопросы «сколько в коллекции PDF?», «что лежало по адресу X?», «где встречается слово Y?», нужен индекс. metawarc строит **версионированный каталог DuckDB с Parquet-сайдкарами**:

- **исходные WARC** не изменяются;
- **каталог** (`.db`) хранит список архивов, состояние и ссылки на сайдкары;
- **Parquet-сайдкары** с записями, заголовками, ссылками, текстами и метаданными лежат в каталоге `<имя базы>.data/`;
- **запросы** выполняются по каталогу без копирования WARC.

## Команды

| Команда | Что делает |
| :--- | :--- |
| `index` | Индексирует WARC/WARC.GZ: записи и HTTP-заголовки. Режимы `--mode add\|update\|rescan\|force`, `--resume` |
| `ingest` | Планирует и выполняет инкрементальное добавление; есть `--dry-run` |
| `catalog`, `stats` | Список архивов в каталоге; статистика по MIME-типам или расширениям |
| `list-files` | Список записей с типизированными фильтрами; вывод в таблицу, CSV или JSONL |
| `dump`, `get` | Выгрузка содержимого записей в файлы с JSONL-манифестом и SHA-256; выгрузка одной записи |
| `index-content` | Извлечение метаданных (`--type links\|pdfs\|images\|ooxmldocs\|oledocs\|videos\|audio\|fonts`) и текста (`--text`) |
| `dump-metadata` | Выгрузка извлечённых метаданных одного типа в JSON Lines |
| `analyze` | Отчёты: `summary`, `metadata`, `hashes`, `duplicates`, `links`, `integrity` |
| `search` | Поиск фразы по извлечённым текстам |
| `export-cdxj` | Экспорт CDXJ-индекса для внешних систем просмотра, например pywb |
| `serve` (`replay`) | REST API и локальный просмотр сохранённых сайтов |
| `mcp` | MCP-сервер только для чтения для ИИ-агентов |
| `jobs` | Фоновые задачи экспорта: `submit`, `list`, `get`, `wait`, `cancel` |
| `doctor`, `rebind`, `cleanup` | Проверка и ремонт каталога, привязка перемещённого архива, очистка устаревших файлов |

## История версий

- **2022 год** — появление инструмента: в канале @ruarxive он представлен в [посте #61 от 29.06.2022](https://t.me/ruarxive/61): извлечение метаданных из изображений и документов внутри WARC и статистика по MIME-типам.
- **Обновление 2025 года** ([пост #160 от 30.06.2025](https://t.me/ruarxive/160)): хранение переведено с SQLite на DuckDB + Parquet. Раньше база метаданных могла достигать 20 % от объёма WARC; после переписывания метаданные WARC-файла размером 4,5 ГБ занимают 3,5 МБ (0,07 %, сжатие примерно в 285 раз).
- **Версия 2.0** вышла 8 августа 2026 года ([пост #190](https://t.me/ruarxive/190)): стабильные идентификаторы архивов, схема каталога версии 2, REST API, MCP-сервер, фоновые задачи и просмотр сохранённых сайтов. В посте сказано о проигрывании «через библиотеку pywb»; по README и коду 2.0 просмотр встроен в сам metawarc (FastAPI), а с pywb он связан через экспорт CDXJ.
- Текущая версия на PyPI — **2.0.3** (6 октября 2026 года).

## Установка

```bash
# Базовый CLI
pip install metawarc

# С REST API и просмотром сайтов
pip install 'metawarc[api]'

# С MCP-сервером
pip install 'metawarc[mcp]'

# Все интерфейсы
pip install 'metawarc[all]'
```

Требуется **Python 3.10 или новее**. Без `metawarc[api]` команда `serve` завершится сообщением о необходимости установить дополнение.

> Команды сверены с README, исходным кодом и `--help` версии 2.0.3, а также проверены на тестовом WARC (октябрь 2026).

## Быстрый старт

```bash
# 1. Проиндексировать коллекцию (с продолжением прерванной индексации)
metawarc index 'archives/**/*.warc*' --dbfile collection.db --resume

# 2. Посмотреть, что попало в каталог
metawarc catalog --dbfile collection.db
metawarc stats --dbfile collection.db --mode mimes

# 3. Найти PDF и выгрузить первые 100
metawarc list-files --dbfile collection.db --mimes application/pdf
metawarc dump --dbfile collection.db --exts pdf --limit 100 --output exported

# 4. Извлечь ссылки, метаданные PDF и текст для поиска
metawarc index-content --dbfile collection.db --type links --type pdfs --text
metawarc search "бюджет" --dbfile collection.db

# 5. Запустить локальный просмотр (нужен metawarc[api])
metawarc serve --dbfile collection.db
# → http://127.0.0.1:8000/  — список сохранённых сайтов
```

## Архитектура кратко

- **Рабочее пространство** — файл базы (по умолчанию `warcindex.db`) и каталог `<имя базы>.data/` с сайдкарами; его можно перенести через `--data-dir`.
- **Таблицы DuckDB**: `archives`, `catalog_state`, `checkpoints`, `meta`, `runs`, `sidecars`. Сами записи, заголовки, ссылки, тексты и метаданные лежат в Parquet-файлах, перечисленных в таблице `sidecars`.
- **Схема версии 2** — стабильные ID архивов, версионированные сайдкары, атомарная публикация.
- **Типизированные запросы** — фильтры проходят через список разрешённых полей и связанные параметры. Сырой SQL доступен только в CLI через явно названную опцию `--unsafe-where` и не доступен через REST и MCP.

Подробнее — [архитектура в документации](https://ruarxive.org/metawarc/architecture/workspace).

## Форматы для извлечения метаданных

- **Документы**: PDF; Office Open XML (DOCX, XLSX, PPTX и шаблоны, включая файлы с макросами); старые DOC, XLS, PPT.
- **Изображения**: JPEG, PNG, GIF, TIFF, JPEG 2000, BMP, ICO, WebP, SVG, PSD и другие форматы, которые читает библиотека hachoir.
- **Видео**: MP4/QuickTime, AVI, WebM/Matroska, Ogg, MPEG, ASF/WMV, FLV.
- **Аудио**: MP3, WAV, AIFF, FLAC, Ogg/Opus, M4A, WMA, MIDI, RealAudio.
- **Шрифты**: TTF, OTF, коллекции шрифтов, WOFF, WOFF2, EOT.
- **Ссылки** из HTML и **текст** HTML, PDF и OOXML для поиска.

Как устроен выбор экстрактора — на странице [metawarc: экстракторы](./metawarc-extractors).

## Когда использовать

Подходит, если у вас уже есть **WARC-коллекция** (собранная [wget](/kb/instruments/tools/wget), [Browsertrix](/kb/instruments/tools/browsertrix), [Heritrix](/kb/instruments/tools/heritrix), [grab-site](/kb/instruments/tools/grab-site), `wparc warc` или `filegetter` с `write_warc`) и нужно:

- узнать, что внутри (типы, объёмы, хосты);
- извлечь метаданные PDF, изображений и документов;
- найти фразу в извлечённом тексте;
- выгрузить подмножество файлов, например все PDF;
- быстро посмотреть сохранённый сайт локально;
- дать дашборду или агенту доступ к коллекции только на чтение.

Для **сбора** WARC metawarc не нужен — см. [инструменты сбора](/kb/instruments/tools).

## Сравнение с похожими инструментами

| Инструмент | Назначение | Отличие от metawarc |
| :--- | :--- | :--- |
| **[warcio](https://github.com/webrecorder/warcio)** | Python-библиотека чтения и записи WARC | metawarc строит готовый к запросам каталог; с warcio нужно писать свои скрипты |
| **[warctools](https://github.com/internetarchive/warctools)** | Утилиты командной строки (warcvalid, warcdump) | metawarc даёт типизированные запросы, REST и MCP |
| **[Archives Unleashed](https://archivesunleashed.org)** | Анализ WARC на Spark | metawarc работает на одной машине без Spark |
| **[pywb](https://github.com/webrecorder/pywb)** | Просмотр веб-архивов | у metawarc простой встроенный просмотр без переписывания JavaScript; для полного воспроизведения он экспортирует CDXJ для pywb |

## Ограничения

- Не сборщик и не упаковщик: работает только с существующими WARC.
- Python 3.10+.
- MCP-сервер только читает: нет инструментов изменения, удаления, сырого SQL и выдачи содержимого записей.
- Встроенный просмотр переписывает только HTML и CSS; JavaScript не переписывается. Для сложных сайтов экспортируйте CDXJ и используйте [pywb](/kb/instruments/replay/pywb).
- Поиск — последовательный просмотр столбца текстов в DuckDB, а не полнотекстовый индекс; на больших коллекциях он медленный.

---

# Расширенные разделы

## Переменные окружения

Переменные читаются в `metawarc/settings.py` и действуют на `serve` (REST API и просмотр):

| Переменная | По умолчанию | Назначение |
| :--- | :--- | :--- |
| `METAWARC_API_TOKEN` | не задана | Bearer-токен REST API (то же, что `serve --token`) |
| `METAWARC_HOST` | `127.0.0.1` | Адрес, на котором слушает `serve` |
| `METAWARC_PORT` | `8000` | Порт `serve` |
| `METAWARC_MAX_PAGE` | `500` | Максимальный `limit` для `/records/list` и `/records/search` |
| `METAWARC_MAX_PAYLOAD_BYTES` | `134217728` (128 МиБ) | Максимальный объём отдаваемого содержимого записи |
| `METAWARC_REQUEST_TIMEOUT` | `30` | Таймаут одного HTTP-запроса, секунды |
| `METAWARC_MAX_CONCURRENCY` | `16` | Одновременно обрабатываемых HTTP-запросов |
| `METAWARC_JOB_MAX_CONCURRENT` | `4` | Одновременно выполняемых фоновых задач |
| `METAWARC_JOB_TIMEOUT` | `300` | Таймаут одной фоновой задачи, секунды |

В `settings.py` есть также `METAWARC_DB_PATH`, `METAWARC_DATA_DIR` и `METAWARC_MCP_PORT`, но команды `serve` и `mcp` берут путь к базе из `--dbfile`/`--data-dir`, а порт MCP — из `--port` (по умолчанию 8191).

```bash
export METAWARC_API_TOKEN='замените-на-случайную-строку'
export METAWARC_JOB_TIMEOUT=1800
metawarc serve --dbfile collection.db
```

## Опция `--unsafe-where`

Обычные фильтры (`--mimes`, `--exts`, `--url-pattern`, `--host-pattern`, `--status-min/--status-max`, `--date-from/--date-to`, `--size-min/--size-max`) передаются в запрос как параметры. Для разового анализа на своей машине у `list-files` и `dump` есть опция `--unsafe-where` с сырым SQL-условием:

```bash
# Безопасно: типизированные фильтры
metawarc list-files --dbfile collection.db --mimes text/html --limit 100

# Сырой SQL — только локально и только для своих данных
metawarc list-files --dbfile collection.db --unsafe-where "status_code >= 400"
```

Через REST и MCP эта опция недоступна.

## Выгрузка содержимого: `dump` и `get`

`dump` сохраняет содержимое выбранных записей в отдельные файлы и пишет рядом `manifest.jsonl` (архив, ID записи, URL, тип, путь к файлу, размер, SHA-256). Существующие файлы не перезаписываются.

```bash
metawarc dump --dbfile collection.db --mimes application/pdf --limit 1000 --output ./pdfs
metawarc get 'urn:uuid:<id записи>' --dbfile collection.db --output page.html
```

Опции `dump`: `--archive-ids`, `-m/--mimes`, `-e/--exts`, `--url-pattern`, `--unsafe-where`, `--offset`, `--limit` (по умолчанию 1000, максимум 100 000), `--max-bytes`, `-o/--output` (по умолчанию `dump`).

Табличные выгрузки списка записей делают `list-files -o records.csv --output-format csv` (или `jsonl`; не больше 1000 строк за вызов, дальше — через `--offset`) и фоновые задачи `jobs` (JSON, CSV, Parquet).

## Просмотр сохранённых сайтов

`metawarc serve` (или его синоним `metawarc replay`) поднимает просмотр по адресам:

| Путь | Что показывает |
| :--- | :--- |
| `/` или `/replay` | HTML-список сохранённых хостов со ссылками |
| `/replay/sites` | То же в JSON: хост, стартовый URL, число снимков, путь для просмотра |
| `/replay/<штамп>/<URL>` | Ближайший по времени снимок точного URL, HTML и CSS переписаны |
| `/replay/<штамп>mp_/<URL>` | То же, явный режим с переписыванием |
| `/replay/<штамп>id_/<URL>` | Исходное содержимое без переписывания |

Штамп — ровно 14 цифр `ГГГГММДДччммсс`, допускаются только суффиксы `mp_` и `id_`. Сокращённые штампы и шаблоны вроде `2026*` возвращают ошибку 422. Параметр `?policy=exact` требует точного совпадения времени (по умолчанию `closest`).

```text
http://127.0.0.1:8000/replay/20260315102345mp_/https://example.com/news/article
```

Что делает просмотр: переписывает ссылки в HTML и CSS и заголовок `Location` у редиректов в адреса просмотра; сохраняет исходную кодировку (UTF-8, windows-1251, KOI8-R) и отдаёт страницу в UTF-8. JavaScript не переписывается, поэтому страницы, которые строят адреса скриптами, могут работать неполно. Для таких сайтов экспортируйте CDXJ и используйте pywb:

```bash
metawarc export-cdxj --dbfile collection.db -o collection.cdxj --path-index paths.tsv
```

Сохранённые скрипты могут быть небезопасны: без токена держите сервер на `127.0.0.1`.

## Фоновые задачи (`jobs`)

Задачи нужны для выгрузок, которые не укладываются в таймаут HTTP-запроса. Зарегистрирован один вид задачи — **`export-records`**: выгрузка списка записей (как у `list-files`) в JSON, CSV или Parquet в каталог `<имя базы>.data/jobs/<id задачи>/`.

```bash
# Поставить задачу (опции группы, например --dbfile, указываются до подкоманды)
metawarc jobs --dbfile collection.db submit --format csv --limit 1000 --mimes application/pdf

# Список, статус, ожидание, отмена
metawarc jobs --dbfile collection.db list --status running
metawarc jobs --dbfile collection.db get <job_id>
metawarc jobs --dbfile collection.db wait <job_id> --poll-seconds 2 --timeout 600
metawarc jobs --dbfile collection.db cancel <job_id>
```

Фильтры `submit`: `--archive-ids`, `--mimes`, `--exts`, `--url-pattern`, `--host-pattern`, `--status-min/--status-max`, `--size-min/--size-max`. Статусы: `pending`, `running`, `succeeded`, `failed`, `cancelled`. Состояние задач сохраняется между перезапусками.

Команда `jobs submit` только ставит задачу в очередь. Выполняет задачи фоновый обработчик `metawarc serve`: задачи, ожидающие в очереди, он подхватывает при запуске. Без работающего `serve` задача останется в статусе `pending`, а `jobs wait` завершится по таймауту.

Ограничение версии 2.0.3: хотя `--limit` принимает значения до 100 000, при выполнении задача проверяет лимит запроса к каталогу и с `limit` больше 1000 завершается статусом `failed` («limit must be between 1 and 1000»). Задачи через REST описаны на странице [metawarc REST API](./metawarc-rest#фоновые-задачи).

## Как выбрать интерфейс

| Критерий | CLI | REST | MCP | SQL в DuckDB |
| :--- | :-: | :-: | :-: | :-: |
| Для чего | Скрипты, CI | Дашборды, интеграции | ИИ-агенты | Исследования |
| Доступ | Локально | Bearer-токен | stdio или локальный HTTP без авторизации | Локально |
| Содержимое записей | `dump`, `get` | `/records/get/.../data/...` | Нет | Через WARC |
| Долгие выгрузки | `jobs` (выполняет `serve`) | `/jobs` | Нет | Свои скрипты |

## Совместимость и обслуживание каталога

Рабочее пространство 2.0 использует схему версии 2. Каталоги версий 1.2/1.3 (с таблицами `files`/`tables`) распознаются: перед переносом путей в новый каталог делается резервная копия. Если перенос неоднозначен, `doctor` выдаёт рекомендации по пересборке и не трогает исходные WARC.

```bash
metawarc doctor --dbfile collection.db                    # проверка
metawarc doctor --dbfile collection.db --repair           # план ремонта (без изменений)
metawarc doctor --dbfile collection.db --repair --apply   # применить план
metawarc rebind <archive_id> /new/path/file.warc.gz --dbfile collection.db
metawarc cleanup --dbfile collection.db --retention-days 7 --apply
```

## Полезные ссылки

- [Документация metawarc](https://ruarxive.org/metawarc/) — установка, справочник команд, рецепты, архитектура.
- [Справочник команд](https://ruarxive.org/metawarc/commands) — все команды и флаги.
- [Рецепты в документации](https://ruarxive.org/metawarc/getting-started/cookbook).
- [CHANGELOG](https://github.com/ruarxive/metawarc/blob/master/CHANGELOG.md) и [SECURITY](https://github.com/ruarxive/metawarc/blob/master/SECURITY.md).
- OpenAPI-схема работающего сервера — `/docs` и `/openapi.json`.

## Связанные материалы

- [metawarc REST API](./metawarc-rest)
- [metawarc MCP-сервер](./metawarc-mcp)
- [metawarc: рецепты](./metawarc-cookbook)
- [metawarc: экстракторы](./metawarc-extractors)
- [Формат WARC](/kb/instruments/file-formats/warc)
- [Обработка WARC](/kb/instruments/tools/warc-processing)
- [Все инструменты Ruarxive](/kb/instruments/ruarxive-tools)
