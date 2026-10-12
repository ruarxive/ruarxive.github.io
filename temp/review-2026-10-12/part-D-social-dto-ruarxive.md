# Ревью KB, часть D: social-media, data-take-out, downloaded-data, ruarxive-tools, howto-collect

Дата: 2026-10-12 · Режим: только чтение (файлы в `kb/` не менялись).

## Что и как проверялось

- **Инструменты Ruarxive** сверялись с реальными репозиториями через `gh api` (README, дерево файлов, `pyproject.toml`/`setup.py`, исходники CLI) и с `pip index versions`:
  - `ruarxive/metawarc` — **2.0.3** (PyPI 2.0.3; 2.0.0 вышла 2026-08-08). CLI на Click в `metawarc/core.py` + `cli_jobs.py`. **REST API (`serve`, FastAPI) и MCP-сервер (`mcp`, fastmcp) реально существуют** — сами страницы `metawarc-rest`/`metawarc-mcp` не выдуманы, но многие детали в них выдуманы. Реальные команды: `index, ingest, index-content, catalog, stats, list-files, dump, get, dump-metadata, doctor, rebind, cleanup, search, analyze {summary,metadata,hashes,duplicates,links,integrity}, export-cdxj, serve, replay, mcp, jobs {submit,list,get,wait,cancel}`.
  - `ruarxive/apibackuper` 1.0.13; `ruarxive/wparc` 1.0.8; `ruarxive/ydiskarc` 1.1.0; `ruarxive/filegetter` 1.1.0; `ruarxive/spcrawler` 1.0.1.
  - `ruarxive/tgarc` — **на PyPI нет**, последний коммит 2023-12, `setup.py` 0.1.4 (pyrogram), в README установка из `git+https://github.com/AduchiMergen/tgarc.git`.
  - Под `datacoon/*` есть только редирект `datacoon/metawarc` → `ruarxive/metawarc` и `datacoon/apibackuper` → `ruarxive/apibackuper`.
  - `ruarxive/metawarc-mcp`, `ruarxive/vk-caching`, `ruarxive/apibackuper-configs` → 404 (выдуманы; `vk-caching` после правки аудитора всё ещё упоминается как «наш инструмент»).
- **Соцсети и take-out**: сверка с реальными репозиториями (twarc `src/twarc/command2.py`, fbarc README, sfm-ui README и сайт GWU, snscrape `modules/`, модули auto-archiver), с Telegram-постами Ruarxive (#27, #28, #160, #175, #182, #190) и с документацией платформ. Факты о платформах, которые не удалось проверить напрямую, помечены как `likely`/`suspect`.
- Внутренние ссылки в этих разделах прогнаны скриптом: **все внутренние ссылки резолвятся**. Битые внешние ссылки перечислены по файлам.
- Обозначения: `confirmed` — проверено по первоисточнику; `likely` — известный факт, но здесь не перепроверен; `suspect` — выглядит неверно, нужна проверка.

---

## ruarxive-tools

### kb/instruments/ruarxive-tools/index.md

- [SEVERITY: major] index.md:50 — `pip install tgarc wparc ydiskarc filegetter` — у tgarc нет пакета на PyPI (`pip index versions tgarc` → No matching distribution); README tgarc предлагает установку `pip install git+https://github.com/AduchiMergen/tgarc.git` — разделить команды и дать для tgarc установку из git. (confirmed)
- [SEVERITY: minor] index.md:7 — бессмысленная фраза «один репозиторий — metawarc — живёт в основной организации github.com/ruarxive/metawarc» (все репозитории и так лежат в `ruarxive`) — удалить скобку. (confirmed)
- [SEVERITY: minor] index.md:13-29 — пробел в покрытии: в обзоре инструментов Ruarxive нет `apibackuper` и `spcrawler` (оба в `github.com/ruarxive`, оба на PyPI), хотя они описаны в downloaded-data — добавить строки со ссылками. (confirmed)
- [SEVERITY: minor] index.md:18,35,87 — tgarc описан как «инкрементальный, через официальный MTProto API» без оговорки, что проект не развивается с 2023 года и работает на pyrogram (апстрим pyrogram заброшен) — добавить статус «не поддерживается». (confirmed по датам коммитов)

### kb/instruments/ruarxive-tools/tgarc.md — почти вся практическая часть выдумана

- [SEVERITY: critical] tgarc.md:46-65 — выдуманные команды `tgarc download --target … --incremental --no-media`. Реальный CLI: `configure`, `logout`, `save [OPTIONS] [SRC]...` с флагами `--update`, `--video/--no-video`, `--pictures/--no-pictures`, `--files/--no-files`, `--max-size`, `--private`, `--format json`, `--input`, `-o` (README `ruarxive/tgarc`) — переписать по README. (confirmed)
- [SEVERITY: critical] tgarc.md:23-25 — `pip install tgarc` не сработает (на PyPI нет) — использовать установку из git. (confirmed)
- [SEVERITY: major] tgarc.md:33-41 — выдуманная настройка через `config.yaml` с полями `api_id/api_hash/phone`; на самом деле настройка интерактивная, через `tgarc configure` — исправить. (confirmed)
- [SEVERITY: major] tgarc.md:70-82 — выдуманная структура вывода (`messages.jsonl`, `media/`, `meta.json`, поле `archive_meta`); по умолчанию данные пишутся в папку `tgarc-<дата>` — убрать или описать по коду `main.py`. (likely)
- [SEVERITY: major] tgarc.md:87-88 — «статический сайт через pywb или metawarc replay» — tgarc выдаёт JSON, а не WARC; pywb и metawarc с таким выводом работать не могут — удалить. (confirmed)
- [SEVERITY: minor] tgarc.md:94 — «только публичные ресурсы» противоречит реальному флагу `--private`. (confirmed)
- [SEVERITY: minor] tgarc.md:27 — «Python 3.8+» не подтверждается (в `setup.py` нет `python_requires`). (confirmed)
- [SEVERITY: minor] Пробел: нет статуса проекта (последний коммит 2023-12-15) и упоминания, что основной форк — `AduchiMergen/tgarc`. (confirmed)

### kb/instruments/ruarxive-tools/wparc.md

- [SEVERITY: critical] wparc.md:38-55 — выдуманный CLI: `wparc https://example.com/ --output … --no-comments --max-media-size --auth --resume`. Реальный CLI — подкоманды с доменом как позиционным аргументом: `wparc ping|analyze|dump|getfiles|index|warc example.com` (`dump --workers`, `warc --output/--no-compress`) — переписать по README. (confirmed)
- [SEVERITY: major] wparc.md:66-82 — выдуманная структура вывода (`posts/1.json`, `comments.jsonl`, `meta.json`). Реальная: `<domain>/data/wp_v2_posts.jsonl`, `wp_v2_pages.jsonl`, `wp_v2_media.jsonl`, …, `<domain>/files/wp-content/uploads/...`, плюс `index.sqlite3` и `dump.warc.gz`. (confirmed)
- [SEVERITY: major] wparc.md:107 — «Нужен стандартный WARC → конвертация через metawarc»: metawarc **не создаёт** WARC, а wparc умеет сам (`wparc warc`) — исправить. (confirmed)
- [SEVERITY: minor] wparc.md:109 — бессмыслица: «Архивировать WordPress из Telegram-канала (бота) → tgarc» — удалить строку. (confirmed)
- [SEVERITY: minor] wparc.md:33 — «сохраняет медиа на диск по SHA-1 URL-у» — на деле файлы раскладываются по исходному пути `wp-content/uploads/...`. (confirmed)
- [SEVERITY: minor] wparc.md:21 — «Python 3.8+», в README «3.6+, рекомендуется 3.9+». (confirmed)

### kb/instruments/ruarxive-tools/ydiskarc.md

- [SEVERITY: critical] ydiskarc.md:25-42 — выдуманный CLI: `ydiskarc URL --output … --max-depth --exts --max-size --resume`. Реальный: `ydiskarc sync URL -o DIR [--update] [--nofiles/-n] [--parallel N]`, `ydiskarc full URL -o DIR [-f name] [-m]`, `ydiskarc configure --key`, `ydiskarc version`. (confirmed)
- [SEVERITY: major] ydiskarc.md:12 — «обходя публичный REST-эндпоинт `webdav.yandex.ru`» — ydiskarc работает через публичное REST API Диска для публичных ресурсов, а не через WebDAV (README: «Yandex provides a free-to-use API»). (likely)
- [SEVERITY: major] ydiskarc.md:61 — выдуманный `manifest.jsonl` с SHA-256; реальный инструмент сохраняет `_metadata.json` на каждом уровне каталога. (confirmed)
- [SEVERITY: minor] ydiskarc.md:47 — «качает каждый файл отдельно, без ZIP» верно только для `sync`; `full` скачивает каталог как `dump.zip`. (confirmed)
- [SEVERITY: minor] ydiskarc.md:66 — «на момент версий `0.5+`» — таких версий нет (на PyPI 1.0.1 и 1.1.0). (confirmed)
- [SEVERITY: minor] ydiskarc.md:68,84 — советует aria2 для параллельной загрузки и несуществующий `--resume`, хотя есть `--parallel N` и автоматическая докачка `.part`-файлов. (confirmed)
- [SEVERITY: minor] ydiskarc.md:21 — «Python 3.8+», в README «3.9+». (confirmed)

### kb/instruments/ruarxive-tools/filegetter.md — конфиг и CLI выдуманы целиком

- [SEVERITY: critical] filegetter.md:50-86,92-123,160-184 — выдуманный YAML-конфиг (`patterns/range/output/download/filters/verification/network/rate_limit`) и CLI (`filegetter --config`, `--pattern … --range`). Реально: INI-файл `filegetter.cfg` с секциями `[project] [data] [files] [storage]` (`source_type = csv|jsonl|list`, `fetch_mode = prefix|pattern`, `root_url`, `workers`, `delay`, `retries`, `max_filesize`, `write_warc`) и единственная команда `filegetter run [--projectpath] [--dry-run] [--limit N] [--refresh]`. (confirmed)
- [SEVERITY: major] filegetter.md:141-154 — выдуманный Python API `from filegetter import FileGetter; getter.download_all()`; реальный — `from filegetter.cmds.project import FilegetterBuilder; FilegetterBuilder(path).run()`. (confirmed)
- [SEVERITY: major] filegetter.md:24,193 — «не строит WARC автоматически» — неверно: есть `write_warc = True` в `[storage]` (`pip install filegetter[warc]`) → `storage/files.warc.gz`. Фраза «используйте metawarc с пользовательским провайдером источника» выдумана (такой функции нет). Эту строку правил аудит (warc-tools → warcio), но неверное утверждение осталось. (confirmed)
- [SEVERITY: major] filegetter.md:131-136,199 — выдуманный `--from-jsonl … --field url`; связка с apibackuper реально делается через `source_type = jsonl` + `data_key`. (confirmed)
- [SEVERITY: minor] filegetter.md:5 (description), 18 — «расписания» и «YAML-конфиг»: встроенного планировщика нет, конфиг в INI. (confirmed)
- [SEVERITY: minor] filegetter.md:40 — «Python 3.6+», в README «3.9 or higher». (confirmed)

### kb/instruments/ruarxive-tools/metawarc.md

Обзорная часть (строки 1-180) в целом соответствует README 2.0.3. Раздел «Расширенные разделы» (строки 182-458) в основном выдуман.

- [SEVERITY: major] metawarc.md:40-49 — «2025 (v2025.x)» — такой схемы версий не было (на PyPI 1.0.x–1.3.1, затем 2.0.x). Пост #160 настоящий (30.06.2025), но в нём «WARC 4,5 ГБ → 3,5 МБ метаданных», а не «несколько ТБ → сотни МБ». Назвать «1.3 (2025)» и процитировать точные цифры. (confirmed)
- [SEVERITY: major] metawarc.md:54-63 — replay в 2.0 описан как «через pywb… с навигацией по датам, как в Internet Archive»; на деле replay встроенный (FastAPI, без переписывания JS), а pywb — только внешняя цель для `export-cdxj`. «britannica» как replay-система — галлюцинация. Сам пост #190 говорит «через библиотеку pywb», но README и код описывают встроенный replay — уточнить формулировку. (confirmed)
- [SEVERITY: major] metawarc.md:186-198,203-216 — таблица переменных окружения в основном выдумана. Реальные (`metawarc/settings.py`): `METAWARC_API_TOKEN`, `METAWARC_DB_PATH`, `METAWARC_DATA_DIR`, `METAWARC_HOST`, `METAWARC_PORT`, `METAWARC_MCP_PORT`, `METAWARC_MAX_PAGE` (500), `METAWARC_MAX_PAYLOAD_BYTES` (128 MiB), `METAWARC_REQUEST_TIMEOUT`, `METAWARC_MAX_CONCURRENCY`, `METAWARC_JOB_MAX_CONCURRENT`, `METAWARC_JOB_TIMEOUT`. Переменных `METAWARC_BEARER_TOKEN`, `_LIMIT_MAX_RECORDS`, `_SEARCH_MAX`, `_PAYLOAD_MAX`, `_INDEX_WORKERS`, `_INDEX_BATCH`, `_EXTRACTION_TIMEOUT` не существует. (confirmed)
- [SEVERITY: major] metawarc.md:226,229 — команды `metawarc list-records` нет (есть `list-files`). (confirmed)
- [SEVERITY: major] metawarc.md:242-294 — у `dump` нет `--format csv|jsonl|parquet` и `--mime` (есть `--mimes`); выгрузка — файлы плюс JSONL-манифест с SHA-256, а не `data.csv`/`manifest.sha256`/base64-JSONL/Parquet. Похожий экспорт делают `jobs` (json/csv/parquet) и `list-files --output-format csv|jsonl`. (confirmed)
- [SEVERITY: major] metawarc.md:306-313 — штампы `202603*`, `*-` и пустой штамп не поддерживаются: `STAMP_RE = ^\d{14}(id_|mp_)?$` в `replay.py`. (confirmed)
- [SEVERITY: minor] metawarc.md:322-328 — «переписывание редиректов в meta refresh/JS, переписывание `action` форм» не подтверждается: README говорит о переписывании только HTML/CSS, «JavaScript is not rewritten». (likely)
- [SEVERITY: major] metawarc.md:357-381 — виды задач `export-cdxj` и `index-content` выдуманы: зарегистрирован только `export-records` («Only export-records is registered for the MVP»). CLI тоже неверный: на деле `jobs submit --kind export-records --format csv --mimes … --limit …` (без позиционного kind и без `--filter` JSON); у `jobs wait` флаг `--poll-seconds`, а не `--poll`. (confirmed)
- [SEVERITY: minor] metawarc.md:357 — «на ноябрь 2026» — дата в будущем относительно 2026-10-12. (confirmed)
- [SEVERITY: major] metawarc.md:440-451 — у `doctor` нет `--auto-migrate`/`--backup-dir`, а база передаётся через `--dbfile`, не позиционно. Реальные опции: `--repair`, `--repair --apply`. «Schema v2 стабильна с 2025 года» — неверно: 2.0.0 вышла 2026-08-08. Ссылка `ruarxive.org/metawarc/operations/migration` → 404. (confirmed)
- [SEVERITY: minor] metawarc.md:26 — `--dry-run` указан у `index`; на деле он есть у `ingest`. (confirmed)
- [SEVERITY: minor] metawarc.md:162,454 — `https://ruarxive.org/metawarc/commands/` (со слешем) → 404, без слеша → 200; `…/development` → 404. (confirmed)
- [SEVERITY: minor] metawarc.md:122 — среди форматов изображений указаны TIFF/HEIC/JPEG/PNG; в README перечислены GIF, SVG, WebP, иконки, «camera and editing images» — смягчить формулировку. (suspect)

### kb/instruments/ruarxive-tools/metawarc-rest.md

Эндпоинты (12 штук плюс replay) совпадают с `api_server.py`. Многие параметры, примеры ответов и лимиты выдуманы.

- [SEVERITY: major] metawarc-rest.md:39,59,454,464 — `METAWARC_BEARER_TOKEN` не существует; переменная называется `METAWARC_API_TOKEN` (есть ещё флаг `--token`). (confirmed)
- [SEVERITY: major] metawarc-rest.md:286-294 и пример Python 532-534 — тело `POST /jobs` с ключом `"filter"` вернёт 422: в модели `JobRequest` стоит `extra="forbid"`, правильный ключ — `filters`; фильтры называются `mimes/host_pattern/status_min…`, а не `mime/host/from_date`. (confirmed)
- [SEVERITY: major] metawarc-rest.md:308-314 — kinds `export-cdxj` и `index-content` выдуманы (см. metawarc.md). (confirmed)
- [SEVERITY: major] metawarc-rest.md:117-128 — параметры `/records/list` выдуманы (`archive_id, mime, host, status, from_date, to_date`, «limit 1–500, default 50»). Реальные: `archive_ids, mimes, exts, url_pattern, host_pattern, status_min/max, size_min/max, sort_by, descending, offset, limit` (default 100, max — `METAWARC_MAX_PAGE`=500). Даты в REST не фильтруются. (confirmed)
- [SEVERITY: minor] metawarc-rest.md:45,67 — «/health не требует токена» — в коде `Depends(authorize)` стоит и на `/health`. Пример ответа (dbfile, version, indexed_records) выдуман: на деле возвращается `{status, schema_version, revision}`. (confirmed)
- [SEVERITY: minor] metawarc-rest.md:244-248,263-266 — у `/records/search` нет параметра `language` и полей `language/score` в ответе; `limit` по умолчанию 50, а не 20. Hit содержит `archive_id, warc_id, source, url, snippet`. (confirmed)
- [SEVERITY: minor] metawarc-rest.md:411 — «`GET /` — redirect на `/docs`»: на деле это HTML-список заархивированных хостов (replay home). (confirmed)
- [SEVERITY: minor] metawarc-rest.md:428-430 — wildcard-штампы не поддерживаются (см. metawarc.md). (confirmed)
- [SEVERITY: minor] metawarc-rest.md:32 — комментарий «loopback:8765» противоречит строке 42 и коду (порт по умолчанию 8000). (confirmed)
- [SEVERITY: minor] metawarc-rest.md:236-238,461-469 — выдуманные «rate-limit 1000 RPS», «--limit-max», `METAWARC_SEARCH_MAX`, `METAWARC_PAYLOAD_MAX`, «100 МБ» (реальный лимит — `METAWARC_MAX_PAYLOAD_BYTES`, 128 MiB). (confirmed)
- [SEVERITY: minor] metawarc-rest.md:6 и примеры ответов — `last_updated: 2026-11-09` и даты «2026-11-09» в будущем. (confirmed)

### kb/instruments/ruarxive-tools/metawarc-mcp.md

Семь инструментов, транспорты, read-only-гарантии и `--allow-insecure` описаны верно.

- [SEVERITY: major] metawarc-mcp.md:110-117,133,155,164 — неверные параметры инструментов. В `mcp_server.py`: `list_records(archive_ids, mimes, exts, url_pattern, host_pattern, status_min/max, size_min/max, offset, limit)` (нет `mime/host/status/from_date/to_date/page`); `get_record_metadata(archive_id, record_id)` и `get_record_headers(archive_id, record_id)` требуют ещё и `archive_id`; `search_records(phrase, limit)` — параметр `phrase`, а не `query`; `collection_stats(archive_ids, dimensions, top)`; `metadata_summary(metadata_types, archive_ids, top)` — параметр `metadata_types`, а не `kind`. (confirmed)
- [SEVERITY: minor] metawarc-mcp.md:24,179,195 — `page ≤ 100` выдуман: пагинация идёт через `offset`, `limit` ≤ 100 (`max_page=100`); утверждение «итого до 10 000 записей за обход» неверно. (confirmed)
- [SEVERITY: minor] metawarc-mcp.md:23,107 — «валидация Pydantic-моделями / `ValidationError`»: MCP-инструменты — обычные функции FastMCP с проверками `ValueError`. (likely)
- [SEVERITY: minor] metawarc-mcp.md:37,99 — пример с портом 8765; по умолчанию 8191 — указать умолчание. (confirmed)

### kb/instruments/ruarxive-tools/metawarc-cookbook.md

- [SEVERITY: major] metawarc-cookbook.md:22,82,128,191 — флага `--kinds` нет: правильно `--type` с повторением (`--type pdfs --type links`); типа `texts` нет — текст включается флагом `--text`. Допустимые типы: links, pdfs, images, ooxmldocs, oledocs, videos, audio, fonts. (confirmed)
- [SEVERITY: major] metawarc-cookbook.md:59-67,139-148,531-540,564-571 — SQL по таблицам `pdfs_metadata`, `links_metadata`, `archive_records` (поля `http_status`, `http_location`, `record_id`, `warc_date`) не сработает: в DuckDB-каталоге есть только `archives, catalog_state, checkpoints, meta, runs, sidecars`; записи и метаданные лежат в Parquet-сайдкарах (`read_parquet`). (confirmed)
- [SEVERITY: major] metawarc-cookbook.md:31,336-341 — `"filter"` в `POST /jobs` вызовет 422 (нужен `filters`); полей `status` и `from_date` нет. (confirmed)
- [SEVERITY: major] metawarc-cookbook.md:90,109 — у `search` нет `--language`, у REST — `language`. (confirmed)
- [SEVERITY: major] metawarc-cookbook.md:456,507-510 — `doctor --auto-backup` и `index --workers 4` не существуют. (confirmed)
- [SEVERITY: minor] metawarc-cookbook.md:100 — `search_records(query=…)` → должно быть `phrase=`. (confirmed)
- [SEVERITY: minor] metawarc-cookbook.md:200,404 — `export-cdxj -o /data/pywb-cdxj/` (каталог) — `-o` ожидает файл `.cdxj`. (likely)
- [SEVERITY: minor] metawarc-cookbook.md:213 — «`--resume` пропускает файлы благодаря хешу по содержимому»: по умолчанию сравниваются fingerprint/mtime/size, хеш содержимого — только с `--digest-fingerprint`. (likely)
- [SEVERITY: minor] metawarc-cookbook.md:229,251,550 — `METAWARC_BEARER_TOKEN`; `records/list?limit=0` вернёт 422 (limit ≥ 1); параметра `status=301` нет (нужны `status_min/status_max`). (confirmed)
- [SEVERITY: minor] metawarc-cookbook.md:13 — `ruarxive.org/metawarc/use-cases` → 404. (confirmed)

### kb/instruments/ruarxive-tools/metawarc-extractors.md — «Plugin API» не существует

- [SEVERITY: critical] metawarc-extractors.md:33-66,130-167,370-371 — выдуманы `metawarc/extractor/base.py`, `ExtractorBase`, `ExtractorRegistry.register()`, `list_registered()` и entry point `metawarc.extractors`. В `registry.py` есть только `ExtractorRegistry.__init__(extractors)`, `select()` и `get_text_registry()`; обнаружения плагинов через entry points в коде нет. `--kinds fb2` тоже не существует (`--type` ограничен фиксированным `VALID_TYPES`). Вся страница — инструкция к несуществующему API. Удалить или переписать как «как форкнуть и добавить экстрактор» с реальным протоколом `MetadataExtractor` (`extractor/envelope.py`). (confirmed)
- [SEVERITY: major] metawarc-extractors.md:19-29,390-401 — выдуманные классы `MediaMetadataExtractor` и `RecordMetadataExtractor`; реальные — `HachoirExtractor`, `SvgExtractor`, `WebpExtractor`, `FontExtractor`, `LinkExtractor`, `PdfExtractor`, `OoxmlExtractor`, текстовые экстракторы. Модуль `metawarc.extractor.limits` выдуман (`ExtractionLimits` лежит в `envelope.py`). (confirmed)
- [SEVERITY: minor] metawarc-extractors.md:248,265 — `*.data/<format>_metadata.parquet` и SQL-таблица `extraction_errors` выдуманы. (likely)
- [SEVERITY: minor] metawarc-extractors.md:405 — `ruarxive.org/metawarc/architecture/extractors` → 404. (confirmed)
- [SEVERITY: minor] metawarc-extractors.md:6 — `last_updated: 2026-11-09`, дата в будущем. (confirmed)

---

## downloaded-data

### kb/instruments/downloaded-data/index.md

- [SEVERITY: critical] index.md:25-27 — spcrawler описан как «кроулер для платформы Сбербанк-АСТ и торговых площадок»; на самом деле это бэкап публичных установок **SharePoint** через `/_api/web` (README, страница spcrawler.md). Противоречие между страницами. (confirmed)
- [SEVERITY: major] index.md:22-24 — «готовые конфигурации для data.gov.ru, Госзакупки, ГАС «Управление», ЕИС» — в `ruarxive/apibackuper-dataarchive` лежат `achgovru-checks, etrust, gisp-orgs, gvr, mvd-districts, spb-budget-initiatives`. (confirmed)
- [SEVERITY: minor] index.md:19-21 — «REST/GraphQL», «контроль версий», «автоматическое расписание» у apibackuper не подтверждаются (есть режимы full/incremental/update и чекпойнты, но не планировщик и не GraphQL). (likely)

### kb/instruments/downloaded-data/apibackuper.md

Команды `create/estimate/run/export` и флаг `-p` верные; блоки auth и rate_limit близки к реальным.

- [SEVERITY: major] apibackuper.md:36,40-60 — файл конфигурации называется `apibackuper.yaml` (раньше `apibackuper.cfg`), а не `config.yaml`; схема выдумана (`project.name`, `storage.type/file`, `request.url/method/params/iterator`). Реальная схема: `settings.name`, `project.url/http_mode/iterate_by/work_modes`, `data.data_key/total_number_key/item_key`, `storage.storage_type/storage_path`. (confirmed)
- [SEVERITY: minor] apibackuper.md:17 — «YAML или INI» — INI объявлен deprecated. (confirmed)
- [SEVERITY: minor] apibackuper.md:23 — «Python 3.6+», в `pyproject` `>=3.8`. (confirmed)
- [SEVERITY: minor] Пробел: не упомянуты команды `detect`, `update`, `follow`, `getfiles`, `info`, `validate-config` и документация `ruarxive.org/apibackuper` (200). (confirmed)

### kb/instruments/downloaded-data/apibackuper-configs.md

- [SEVERITY: major] apibackuper-configs.md:31,44,290,336 — каталога `configs/` и файлов `config.yaml` в репозитории нет: структура — `<project>/apibackuper.cfg` (INI) + `params.json`. (confirmed)
- [SEVERITY: major] apibackuper-configs.md:73-123 — примеры «Электронный бюджет» (`budget.gov.ru/epbs/registry/7710568760-BUDGET/data`) и «data.gov.ru/api/datasets» выдуманы: таких конфигов в репозитории нет, URL из аудита — UNREACHABLE/подозрительные; схема YAML тоже выдуманная. Заменить реальными примерами (etrust, gvr). (confirmed)
- [SEVERITY: minor] apibackuper-configs.md:158-169,194-198,207-222,227-231 — `iterator.type: cursor`, OAuth2 с `client_id/client_secret/token_url/scope`, `burst`, `skip_errors`, `filters` не совпадают с документацией apibackuper (реальные: `token/auth_url/refresh_token`, `burst_size`, `error_handling.continue_on_error`, `export --where`). (confirmed)
- [SEVERITY: minor] apibackuper-configs.md:351 — `apibackuper run test --max-pages 5` выдуман (такого режима и флага нет). (confirmed)

### kb/instruments/downloaded-data/spcrawler.md

Страница в целом соответствует README.

- [SEVERITY: minor] spcrawler.md:8 — «Это все сайты, URL которых имеет формат `.aspx`» — некорректное обобщение (`.aspx` — это ASP.NET вообще, не только SharePoint). (confirmed)
- [SEVERITY: minor] spcrawler.md:16,23 — машинный перевод («Загрузите все файлы»); shell-команды в блоке ` ```python `. (confirmed)
- [SEVERITY: minor] Нет frontmatter `title`/`description` (есть только `sidebar_position`); проект не обновлялся с 2025-06. (confirmed)

---

## howto-collect

### kb/instruments/howto-collect/make-copy-site-wordpress.md

- [SEVERITY: major] make-copy-site-wordpress.md:46-48,57-63 — выдуманная команда `pack` и флаги `--url/--output/--input`. Реально: `wparc dump example.com`, `wparc getfiles example.com`, `wparc warc example.com --output example.warc.gz`. Противоречит и `ruarxive-tools/wparc.md` (там тоже выдуманный, но другой синтаксис). (confirmed)
- [SEVERITY: minor] make-copy-site-wordpress.md:10,90 — «бета-версия», «в планах команда `check`» — устарело: есть 1.0.8, команды `ping` и `analyze`. (confirmed)
- [SEVERITY: minor] make-copy-site-wordpress.md:68-70 — примеры «сайтов на WordPress» (duma-rad.ru «депутаты», paperpaper.ru, agentura.ru) не проверены. (suspect)

### kb/instruments/howto-collect/make-copy-website.md

- [SEVERITY: major] make-copy-website.md:139-140 — «достаточно выполнить команду, подобную этой.» — после этого нет команды (обрывок, вероятно потерян блок кода). (confirmed)
- [SEVERITY: minor] make-copy-website.md:79-83 — в «экстренной» команде wget нет `--warc-file`, то есть результат не годится для веб-архива; в KB это противоречит гайдам по wget/WARC. (confirmed)
- [SEVERITY: minor] make-copy-website.md:127-135 — Wpull подан как одна из «самых популярных утилит» с интеграцией PhantomJS/youtube-dl; wpull фактически не развивается (последний релиз 2016, PhantomJS закрыт), в KB это не отражено. (likely)
- [SEVERITY: minor] make-copy-website.md:40-48 — в сравнении нет колонки WARC/WACZ и нет Archive.org/SavePageNow, хотя он описан выше. (confirmed)
- [SEVERITY: minor] Frontmatter без `title`/`description`. (confirmed)

---

## data-take-out

### kb/instruments/data-take-out/data-take-out-main.md

- [SEVERITY: minor] data-take-out-main.md:64 — WhatsApp ведёт на внешний FAQ, а не на существующую страницу `dto-whatsapp`; утверждение «в РФ выгрузка не работает» ничем не подкреплено (экспорт чата — локальная функция клиента). (suspect)
- [SEVERITY: minor] data-take-out-main.md:81-85 — таблица: Telegram «Мгновенно / все данные» (зависит от объёма), Twitter «несколько часов» (X пишет «24 часа и дольше»), Facebook «до 4 ГБ» (размер части выбирается). (likely)
- [SEVERITY: minor] data-take-out-main.md:146 — `https://gdpr.eu/data-portability/` → 404 (аудит пометил, но ссылка осталась) — заменить на `gdpr-info.eu/art-20-gdpr/`. (confirmed)
- [SEVERITY: minor] Список платформ (строки 55-75) не включает WhatsApp, а таблица — VK, Yandex, Slack, Notion. (confirmed)

### kb/instruments/data-take-out/dto-telegram.md

- [SEVERITY: major] dto-telegram.md:21,70-71 — «до 8 МБ на файл, до 4 ГБ на весь архив, увеличивается платно через Premium» — выдумано. В Telegram Desktop 8 МБ — лишь значение ползунка по умолчанию (максимум — 4000 МБ на файл), общего лимита на архив и Premium-расширения нет. (likely)
- [SEVERITY: major] dto-telegram.md:50-57 — `pip install tgarc` / `tgarc export --channel` — неверно (см. tgarc.md; реально — `tgarc save`). Противоречит tgarc.md, где написано `tgarc download`. (confirmed)
- [SEVERITY: minor] dto-telegram.md:66 — «не более 200 запросов в минуту на сессию» — у MTProto нет такого документированного лимита (там FLOOD_WAIT). (suspect)
- [SEVERITY: minor] Пробел: не описан полный экспорт аккаунта (Настройки → Продвинутые → «Экспорт данных из Telegram»), только экспорт отдельного чата. (likely)

### kb/instruments/data-take-out/dto-vk.md

- [SEVERITY: critical] dto-vk.md:50 — правка аудита легитимизировала галлюцинацию: «Локальный кэш VK — наш собственный инструмент (`vk-caching` в составе Ruarxive)… код не публиковался». Репозиторий `ruarxive/vk-caching` → 404, подтверждений существования инструмента нет — удалить пункт целиком. (confirmed: 404; likely: инструмента нет)
- [SEVERITY: major] dto-vk.md:11-15 — «С 2018 года… VK API закрыт для частных разработчиков и исследователей» — неверно и противоречит `social-media/vk.md` (там рабочий скрипт `wall.get`). VK API открыт (dev.vk.com, сервисные и пользовательские токены). (likely)
- [SEVERITY: minor] dto-vk.md:19-20 — `vk.com/data` и путь «Настройки → Безопасность → Запросить архив» сомнительны: запрос архива находится на странице «Защита данных» (`vk.com/data_protection`); аудит получил 418. (suspect)
- [SEVERITY: minor] dto-vk.md:35 — «нет вложений в групповых чатах старше 3 лет (VK чистит медиа)» — не подтверждено; то же выдуманное утверждение скопировано в dto-facebook.md:58-59. (suspect)
- [SEVERITY: minor] dto-vk.md:51-52 — «VK выдаёт архив заблокированного аккаунта по обращению» — не подтверждено. (suspect)

### kb/instruments/data-take-out/dto-facebook.md

- [SEVERITY: major] dto-facebook.md:67-68 — F(b)arc как «альтернатива для удалённых/заблокированных аккаунтов» — неверно: fbarc в архиве с 2018 года (`justinlittman/fbarc` archived), Graph API не даёт доступа к данным удалённого или чужого аккаунта. (confirmed: archived)
- [SEVERITY: minor] dto-facebook.md:46 — «срок жизни ссылки 14 дней» — Meta указывает около 4 дней. (likely)
- [SEVERITY: minor] dto-facebook.md:58-59 — «Meta чистит медиа в групповых чатах старше 3 лет» — выдумано (копия текста из dto-vk). (suspect)
- [SEVERITY: minor] dto-facebook.md:11 — DYI теперь живёт в Accounts Center (`accountscenter.facebook.com/info_and_permissions/dyi`); `facebook.com/dyi` лишь редиректит туда. (likely)
- [SEVERITY: minor] dto-facebook.md:62 — «рекламные данные только за 90 дней» — не подтверждено. (suspect)

### kb/instruments/data-take-out/dto-twitter.md

- [SEVERITY: major] dto-twitter.md:53-54 — «twarc — если у вас есть Academic Research API доступ»: программа Academic Research закрыта в 2023 году. (likely; общеизвестно)
- [SEVERITY: minor] dto-twitter.md:12 — для X указан `x.com/settings/download-your-data` (через дефис); правильный путь, по-видимому, `x.com/settings/download_your_data`. (suspect)
- [SEVERITY: minor] dto-twitter.md:30-34 — архив X — это HTML-просмотрщик плюс `data/*.js` (`window.YTD.… = [...]`), а не чистый JSON; для обработки нужно срезать JS-префикс. (likely)
- [SEVERITY: minor] dto-twitter.md:62 — `help.twitter.com` → сейчас `help.x.com` (у аудита 403). (likely)

### kb/instruments/data-take-out/dto-instagram.md

- [SEVERITY: minor] dto-instagram.md:11,40 — ссылка `instagram.com/download/request/` — устаревший путь (сейчас Accounts Center); «срок жизни ссылки 14 дней» — Meta указывает около 4 дней. (likely)
- [SEVERITY: minor] dto-instagram.md:57 — «рекламные взаимодействия ограничены 90 днями» — не подтверждено. (suspect)

### kb/instruments/data-take-out/dto-google.md

- [SEVERITY: major] dto-google.md:55-56 — «Google Photos отдаёт только оригиналы, не оптимизированные версии (если включён Storage saver)» — наоборот: при Storage saver оригиналы не хранятся, Takeout отдаёт сжатые копии. (likely)
- [SEVERITY: major] dto-google.md:66-67,77-78 — «упаковка в WARC через metawarc» — metawarc не создаёт WARC (только индексирует существующие). Та же ошибка в dto-slack.md:99. (confirmed)
- [SEVERITY: minor] dto-google.md:29-30 — Takeout не экспортирует SMS и журнал вызовов Android (они лежат в бэкапе Google One и не выгружаются); пароли Chrome экспортируются отдельно через Password Manager. (likely)
- [SEVERITY: minor] dto-google.md:40 vs 52 — размеры частей «2/4/10/50 ГБ» и «4–50 ГБ» противоречат друг другу (реальные варианты: 1, 2, 4, 10, 50 ГБ). (likely)

### kb/instruments/data-take-out/dto-yandex.md

- [SEVERITY: minor] dto-yandex.md:10-12 vs 53-67 — «нет единого центра выгрузки» противоречит разделу о запросе архива на странице «Управление данными» Яндекс ID (это и есть единый центр). (confirmed: внутреннее противоречие)
- [SEVERITY: minor] dto-yandex.md:76 — «экспорт Метрики в Google BigQuery» — такой встроенной функции нет (есть Logs API). (suspect)
- [SEVERITY: minor] dto-yandex.md:60,62,82 — «Дзен» с 2022 года принадлежит VK; ЮMoney с 2020 года не входит в Яндекс; «Такси» теперь Яндекс Go — устаревшие формулировки. (likely)

### kb/instruments/data-take-out/dto-whatsapp.md

- [SEVERITY: critical] dto-whatsapp.md:60-73 — «Запрос данных аккаунта… через ~30 дней придёт zip… Все ваши сообщения, ваши медиа» — неверно: отчёт готов примерно за 3 дня и **не содержит сообщений** (по FAQ WhatsApp). Это ключевая ошибка для архивистов. (likely; общеизвестно)
- [SEVERITY: major] dto-whatsapp.md:47-53 — пробел: не указаны лимиты экспорта чата (около 40 000 сообщений без медиа и около 10 000 с медиа). Пункт «Что не входит: сообщения других участников» неверен: экспорт включает всю видимую историю чата. (likely)
- [SEVERITY: major] dto-whatsapp.md:86-98 — выдуманный код `WhatsAppBusinessAccount.get_conversations()` из `facebook_business`: Cloud API не отдаёт историю переписки (входящие приходят только вебхуками). (likely)
- [SEVERITY: major] dto-whatsapp.md:129-136 — «скачать бэкап с Google Drive через `google-takeout`», «iCloud через `apple-privacy-export`» — бэкапы WhatsApp не выгружаются через Takeout; `apple-privacy-export` — бессмыслица. «Открытых инструментов нет» — неверно: есть, например, wa-crypt-tools. (likely)
- [SEVERITY: major] dto-whatsapp.md:174-182 — «Auto-Archiver с конфигурацией для WhatsApp-каналов через cookie» — в `bellingcat/auto-archiver/src/auto_archiver/modules` нет WhatsApp-экстрактора. Заголовок «(Telegram-бот)» к содержимому не относится. (confirmed)
- [SEVERITY: minor] dto-whatsapp.md:228 — «Public API для каналов к 2027 году (по анонсам Meta)» — выдумано. (suspect)
- [SEVERITY: minor] dto-whatsapp.md:80,193 — запрос по «152-ФЗ» к WhatsApp/Meta (признана в РФ экстремистской) — сомнительная рекомендация. (suspect)
- [SEVERITY: minor] dto-whatsapp.md:210 — Perma.cc как «нотаризация» — некорректно. (confirmed)
- [SEVERITY: minor] dto-whatsapp.md:5 — `last_updated: 2026-11-09`, дата в будущем. (confirmed)

### kb/instruments/data-take-out/dto-slack.md

- [SEVERITY: major] dto-slack.md:84-85 — пропущено главное ограничение бесплатного плана: история старше 90 дней скрыта, а с августа 2024 года сообщения и файлы старше 1 года удаляются. «Файлы старше 90 дней удаляются, если включена retention policy» — искажение. (likely)
- [SEVERITY: minor] dto-slack.md:73-75 — slack-export-viewer назван инструментом, который «скачивает файлы» — это просмотрщик экспорта; файлы скачивает slackdump. (likely)
- [SEVERITY: minor] dto-slack.md:99 — WARC через metawarc (см. dto-google). (confirmed)
- [SEVERITY: minor] dto-slack.md:79-80 — замена аудита `felixrieseberg/slack-archive` реальна (TypeScript, генератор HTML), но работает через пользовательский токен, а не обрабатывает экспорт — стоит уточнить. (confirmed: repo существует)

### kb/instruments/data-take-out/dto-notion.md

- [SEVERITY: major] dto-notion.md:72-73 — замена аудита: `darobin/notion-backup` — **JavaScript**-скрипт, использующий **неофициальный** экспорт (через `token_v2`), а не «Python-скрипт на официальном API». (confirmed: язык по GitHub; likely: механизм)
- [SEVERITY: minor] dto-notion.md:66-70 — противоречие: «Notion официально не предоставляет API для выгрузок» и сразу же «Notion API (developers.notion.com)». (confirmed)
- [SEVERITY: minor] dto-notion.md:74 — вставка аудита про «archivelator» читается как служебная заметка, а не как текст KB — убрать. (confirmed)
- [SEVERITY: minor] dto-notion.md:32-33 — «ссылка живёт 30 дней» — у Notion 7 дней. (likely)
- [SEVERITY: minor] dto-notion.md:15-19 — устаревший путь (`Settings & Members`); сейчас «Settings → General → Export all workspace content». (likely)

### kb/instruments/data-take-out/dto-youtube.md

- [SEVERITY: major] dto-youtube.md (весь файл) — нет yt-dlp как основного инструмента: страница строится вокруг youtube-dl и GUI к нему (youtube-dlG не обновлялся с 2022 года). Противоречит `social-media/youtube-video.md` («стандарт де-факто — yt-dlp»). Кроме того, файл — про скачивание видео, а не про take-out (Google Takeout для YouTube), хотя в data-take-out-main он описан как «экспорт видео, плейлистов, комментариев». (confirmed)
- [SEVERITY: minor] dto-youtube.md:60,108 — сломанные заголовки `###FireDM`, `###Media Downloader` (без пробела); 41-42 — опечатка «Документацрия» и лишняя `)` в URL; 92 — «Downloder». (confirmed)
- [SEVERITY: minor] dto-youtube.md:79 — «firedm/FireDM удалён по DMCA» — GitHub отдаёт 404, а не 451 (DMCA-блок отдаёт 451, как у Hitomi), так что причина не подтверждена. (confirmed: 404)
- [SEVERITY: minor] dto-youtube.md:94 — `fp08/Hitomi-Downloader-issues` подан как «форк»: это репозиторий 2018 года на Batchfile — убрать. (confirmed)

---

## social-media

### kb/instruments/social-media/index.md

- [SEVERITY: critical] index.md:14-20,36-55 — раздел рекомендует twarc «для Twitter», fbarc «для Facebook» и SFM «для множественных платформ» как действующие решения. fbarc в архиве с 2018 года; GWU прекратила развитие SFM в 2024 году; у Twitter/X API нет бесплатного доступа на чтение и Academic-тарифа с 2023 года; Instagram API (Basic Display) закрыт в декабре 2024 года. Переписать с учётом статуса на 2026 год. (confirmed для fbarc/SFM; likely для API)
- [SEVERITY: major] index.md:12-31 — в обзоре нет ссылок на существующие страницы раздела: vk, facebook, rutube, tiktok, mastodon (Bluesky/Threads), max. (confirmed)

### kb/instruments/social-media/vk.md

- [SEVERITY: major] vk.md:60 — «Без токена доступны только 5 последних постов» — выдумано: методы VK API требуют `access_token`; для публичных стен подходит сервисный ключ. (likely)
- [SEVERITY: minor] vk.md:66-69 — `vk.com/admin → Статистика → Экспорт` — несуществующий путь; выгрузка статистики делается в «Управлении сообществом». (suspect)
- [SEVERITY: minor] vk.md:59 — лимит «3 запроса/с» верен для пользовательского токена; для сервисного и группового — до 20 в секунду. (likely)
- [SEVERITY: minor] Противоречие с dto-vk.md:11-15 («API закрыт»); нет frontmatter `title`/`description`. (confirmed)

### kb/instruments/social-media/facebook.md

- [SEVERITY: major] facebook.md:29 — правка аудита «сейчас… остаётся только собственная ручная архивация через браузер» — неверно: исследователям CrowdTangle заменили **Meta Content Library и Content Library API**. Абзац «Требования» (31-35) относится к закрытому сервису. (likely)
- [SEVERITY: major] facebook.md:60-67 — у Browsertrix Crawler нет флага `--cookies cookies.json`; авторизация делается через `--profile` (создаётся командой `create-login-profile`). (likely)
- [SEVERITY: minor] facebook.md:70 — «нет публичного API для чтения комментариев» — Graph API отдаёт комментарии на управляемых страницах, MCL — на публичных. (likely)
- [SEVERITY: minor] facebook.md:84-85 — «Ruarxive архивировал Facebook-аккаунты чиновников» — источник не указан. (suspect)

### kb/instruments/social-media/instagram.md

- [SEVERITY: major] instagram.md:40,60 — ссылка на пост #28 неверна: #28 (29.03.2022) — про загрузку медиа «Эха Москвы»; про 171 Instagram-аккаунт — пост **#27** от 28.03.2022. (confirmed)
- [SEVERITY: major] instagram.md:48-49 — «в 2024 году Instagram в РФ официально заблокирован» — блокировка с 14.03.2022. (likely; общеизвестно)
- [SEVERITY: minor] instagram.md:44 — «собраны изображения»: в посте #27 сказано, что изображения и видео сохранены «лишь ограниченно». (confirmed)
- [SEVERITY: minor] Пробел: нет статуса API на 2026 год (Basic Display API закрыт в 12.2024) и упоминания gallery-dl. (likely)

### kb/instruments/social-media/youtube-video.md

- [SEVERITY: minor] youtube-video.md:1 — нет frontmatter (единственный файл в зоне ревью без него). (confirmed)
- [SEVERITY: minor] youtube-video.md:25 — `--write-annotations` бесполезен (аннотации YouTube удалены в 2019 году, в yt-dlp опция устарела); 36 — `youtube.com/c/ChannelName` → `@handle`. (likely)

### kb/instruments/social-media/rutube.md

- [SEVERITY: minor] rutube.md:7 — «крупнейшая российская видеоплатформа после YouTube» — VK Видео по аудитории больше. (likely)
- [SEVERITY: minor] rutube.md:25,33 — URL канала `rutube.ru/u/USERNAME/` устарел (сейчас `rutube.ru/channel/<id>/`); «субтитры у большинства видео» — сомнительно. (suspect)
- [SEVERITY: minor] Нет frontmatter `title`/`description`. (confirmed)

### kb/instruments/social-media/max.md

- [SEVERITY: major] max.md:13 — ссылка с текстом «Telegram Desktop» ведёт на `/kb/instruments/social-media/instagram` — нужно `/kb/instruments/data-take-out/dto-telegram`. (confirmed)
- [SEVERITY: major] max.md:13,44 — «ни публичного/документированного API нет», «Документированный Bot/API ❌» — неверно: есть `dev.max.ru` с документацией Bot API, библиотеками на JS/Go и мини-приложениями (страница отвечает 200). Bot API не даёт читать чужие каналы, но существует. Уточнить. (confirmed)
- [SEVERITY: minor] max.md:60 — DataRefuge подан как действующий пример (сайт закрыт, у аудита 503). (likely)
- [SEVERITY: minor] max.md:41,44 — «Telegram в Internet Archive с 2014» — без источника. (suspect)

### kb/instruments/social-media/fbarc.md

- [SEVERITY: critical] fbarc.md (весь файл) — не указано, что проект **архивирован (2018)** и что после 2018 года Graph API требует Page Public Content Access, то есть инструмент практически неработоспособен. (confirmed: archived)
- [SEVERITY: major] fbarc.md:26-28 — `pip install fbarc` — пакета на PyPI нет (в README: «pip install coming once more stable»). (confirmed)
- [SEVERITY: major] fbarc.md:54-81,88-114 — выдуманные команды `fbarc page|posts|photos|events` и класс `FBarc.get_posts()`. Реально: `python fbarc.py configure`, `graph page <id> --levels 2 --pretty`, `metadata <id>`, `url`. (confirmed)

### kb/instruments/social-media/social-feed-manager.md

- [SEVERITY: critical] social-feed-manager.md (весь файл) — нет статуса: на сайте GWU «2024 Update: … we are no longer actively developing Social Feed Manager, nor providing a hosted instance». (confirmed)
- [SEVERITY: major] social-feed-manager.md:33,179-180 — замена аудита `sfm-tools/sfm` → `gwu-libraries/social-feed-manager` указывает на **«OLD SFM» (2012-2015, Django, только Twitter)**. Описанный функционал (Tumblr, Flickr, Weibo, коллекции) относится к «новому» SFM: `gwu-libraries/sfm-ui`, документация `sfm.readthedocs.io`. (confirmed)
- [SEVERITY: major] social-feed-manager.md:30-51,108-116 — установка через `pip install -r requirements.txt` и `manage.py runserver` и Python API `from social_feed_manager import SFM` выдуманы; новый SFM ставится через Docker (sfm-docker). (confirmed: README)

### kb/instruments/social-media/twarc.md

- [SEVERITY: critical] twarc.md:13,30-44,47-56,350 — Academic Research access описан как действующий («бесплатно, 10 млн твитов/мес»); программа закрыта в 2023 году. «Free-тариф остался только для академических проектов» — неверно. Basic с 10.2024 стоит $200/мес, а не $100; актуальность тарифов на 2026 год стоит проверить отдельно. (likely)
- [SEVERITY: critical] twarc.md:61-92,97-104,176-207,223-226 — команды API v2 в twarc вызываются через **`twarc2`**, а не `twarc` (`pyproject`: `twarc = command:main` (v1.1), `twarc2 = command2:twarc2`). Выдуманы `likes` (правильно `liked-tweets`), `filter` (в v2 — `stream`), `list members/tweets`, флаги `--checkpoint-file`, `--no-store`, `--lang`, `--output`, `--max-tweets` (есть `--limit`, `--archive`, `--start-time`). `hydrate` принимает файл, а не список ID. (confirmed)
- [SEVERITY: major] twarc.md:115-118 — у `Twarc2` нет метода `search()`: есть `search_recent()` и `search_all()`. (confirmed)
- [SEVERITY: minor] twarc.md:17 — «гибридный v1+v2» — выдумано. (suspect)
- [SEVERITY: minor] twarc.md:300-302,305-310 — archive.ph принимает URL через `/submit/`, а не POST на `/newest/`; в waybackpy нет класса `WaybackMachine` (есть `WaybackMachineAvailabilityAPI`). (likely)
- [SEVERITY: minor] twarc.md:342-345 — события «2025: NYT заблокировал Wayback», «2026: Wikipedia использует X только через Wayback» не подтверждены. (suspect)
- [SEVERITY: minor] twarc.md:322 — «Hanging-Saving» — бессмыслица; 239 — заголовок про WARC-Payload-Digest к содержимому не относится. (confirmed)
- [SEVERITY: minor] twarc.md:367-368 — ссылка на Academic → 404 (у аудита); `twarc-project.readthedocs.io/en/latest/twarc2.html` → 404, рабочая — `…/twarc2_en_us/`. (confirmed)
- [SEVERITY: minor] twarc.md:5 — `last_updated: 2026-11-09`, дата в будущем. (confirmed)

### kb/instruments/social-media/tiktok.md

- [SEVERITY: major] tiktok.md:11 vs 129-143 — «официального API для исследователей не существует» противоречит разделу о Research API на той же странице. Research API запущен в 02.2023 (США), затем расширен на ЕС, а не «в 2024»; ссылка `developers.tiktok.com/research-api` → 404, рабочая — `…/products/research-api/`. (confirmed: 404 и противоречие; likely: даты)
- [SEVERITY: major] tiktok.md:91-101 — `snscrape tiktok-user/tiktok-search` выдуманы: модуля TikTok в snscrape нет (modules: facebook, instagram, mastodon, reddit, telegram, twitter, vkontakte, weibo). (confirmed)
- [SEVERITY: minor] tiktok.md:118-124 — у Browsertrix нет флагов `--browserWindow` и `--scopePageLimit` (есть `--workers`, `--pageLimit`). (likely)
- [SEVERITY: minor] tiktok.md:145 — «ffmpeg + XSplit» со ссылкой на obsproject.com; при этом yt-dlp умеет TikTok Live. (confirmed: несоответствие ссылки)
- [SEVERITY: minor] tiktok.md:149 — «данные до 2022 года — многие методы сломались» — бессмыслица. (confirmed)
- [SEVERITY: minor] tiktok.md:77-82 — пример TikTokApi в синхронном стиле устарел: v6+ асинхронный и требует `create_sessions(ms_tokens=…)`. (likely)
- [SEVERITY: minor] Пробел: нет контекста РФ (с 03.2022 TikTok ограничил загрузку нового контента в России). (likely)
- [SEVERITY: minor] tiktok.md:5 — `last_updated: 2026-11-09`, дата в будущем. (confirmed)

### kb/instruments/social-media/mastodon.md

- [SEVERITY: major] mastodon.md:101-104 — `auto-archiver --input … --extractor mastodon` выдуман: CLI работает через YAML-конфиг и feeders, Mastodon-экстрактора в модулях нет. Заголовок «Архивирование всего инстанса» не соответствует коду (сбор постов одного пользователя). (confirmed)
- [SEVERITY: minor] mastodon.md:136-139,223 — лимиты: по умолчанию 300 запросов за 5 минут (на IP или на аккаунт), а не «1000/5 мин на токен»; публикация — 300 постов за 3 часа, а не за 30 минут. В сравнительной таблице «300–1000 RPS» и «5000 RPS» — неверные единицы (за 5 минут, а не в секунду). (likely)
- [SEVERITY: minor] mastodon.md:174-176 — `atproto.Client()` без логина по умолчанию обращается к `bsky.social` (нужна авторизация); для анонимного доступа нужен `Client(base_url='https://public.api.bsky.app/xrpc')`. (likely)
- [SEVERITY: minor] mastodon.md:203,225 — экстрактор Threads в yt-dlp не подтверждён; «rdflib (для веб)» — бессмыслица; домен Threads сменился на `threads.com`; у Threads с 2024 года есть официальный Threads API (не «Meta Graph API закрытая»). (suspect)
- [SEVERITY: minor] mastodon.md:257,259 — `atproto.com/docs/api` и `atproto.com/specs/at` → 404 (аудит пометил, но ссылки остались). (confirmed)
- [SEVERITY: minor] mastodon.md:5 — `last_updated: 2026-11-09`, дата в будущем. (confirmed)

---

## Сквозные проблемы

1. **Выдуманные CLI у собственных инструментов Ruarxive.** Ни для одного сборщика (tgarc, wparc, ydiskarc, filegetter) синтаксис в KB не совпадает с реальным, а между страницами он ещё и разный (`tgarc download` / `tgarc export`; `wparc URL` / `wparc dump --url` + `pack`).
2. **«Упаковать в WARC через metawarc»** встречается в dto-google, dto-slack, filegetter и wparc. metawarc WARC не создаёт.
3. **Будущие даты** `last_updated: 2026-11-09` и «на ноябрь 2026» в metawarc-rest, metawarc-cookbook, metawarc-extractors, dto-whatsapp, twarc, tiktok, mastodon, metawarc.
4. **Правки аудита, которые сами нуждаются в исправлении:** `vk-caching` как «наш инструмент» (dto-vk:50), SFM-ссылка на «OLD SFM», `darobin/notion-backup` как «Python, официальный API», «после CrowdTangle — только ручная архивация», `fp08/...` как «форк Hitomi», FireDM «по DMCA» (на деле 404, а не 451), фраза filegetter про WARC.
5. **Устаревшее, поданное как актуальное:** Twitter Academic API, fbarc, SFM, snscrape, youtube-dl/youtube-dlG как основной инструмент, CrowdTangle-требования.

---

## Топ-10 проблем

1. **[critical]** `ruarxive-tools/metawarc-extractors.md:33-167` — вся страница описывает несуществующий Plugin API (`ExtractorBase`, `ExtractorRegistry.register`, entry point `metawarc.extractors`, `--kinds`).
2. **[critical]** `ruarxive-tools/tgarc.md:23-82` и `data-take-out/dto-telegram.md:50-57` — tgarc нет на PyPI, команд `download`/`export` нет (реально `configure/save/logout`), конфиг и формат вывода выдуманы.
3. **[critical]** `ruarxive-tools/filegetter.md:50-193` — конфиг (YAML вместо INI `filegetter.cfg`), CLI (`--config/--pattern/--from-jsonl` вместо `filegetter run`) и Python API выдуманы; неверно сказано, что нет WARC (есть `write_warc`).
4. **[critical]** `ruarxive-tools/wparc.md:38-82`, `ydiskarc.md:25-61`, `howto-collect/make-copy-site-wordpress.md:46-63` — выдуманный синтаксис wparc/ydiskarc (реально `wparc dump|getfiles|warc <domain>`, `ydiskarc sync|full URL`), выдуманная команда `wparc pack`.
5. **[critical]** `social-media/twarc.md:13-56,61-226` — Academic API подан как действующий (закрыт в 2023), v2-команды через `twarc` вместо `twarc2`, выдуманы флаги и подкоманды.
6. **[critical]** `social-media/index.md:14-55`, `fbarc.md`, `social-feed-manager.md` — рекомендуются архивированный fbarc (2018) и SFM, который GWU перестала развивать в 2024; у fbarc выдуманы команды и `pip install`; ссылка SFM ведёт на «OLD SFM».
7. **[critical]** `data-take-out/dto-whatsapp.md:60-73` — неверно сказано, что «Запрос данных аккаунта» содержит все сообщения (на деле сообщений там нет, отчёт готов примерно за 3 дня); выдуманы код Business API и способы выгрузки бэкапов; не указаны лимиты экспорта чата.
8. **[critical]** `downloaded-data/index.md:25-27` — spcrawler описан как кроулер «Сбербанк-АСТ» (на самом деле SharePoint); `apibackuper-configs.md` описывает несуществующие `configs/*.yaml` и выдуманные конфиги «Электронного бюджета» и data.gov.ru.
9. **[critical/major]** `data-take-out/dto-vk.md:50` — правка аудита оставила галлюцинацию `vk-caching` как «наш инструмент»; `dto-vk.md:11-15` утверждает, что VK API закрыт с 2018 года, что противоречит `social-media/vk.md`.
10. **[major]** metawarc REST/MCP/cookbook — сами интерфейсы реальны, но выдуманы переменные окружения (`METAWARC_BEARER_TOKEN` и др. вместо `METAWARC_API_TOKEN`), ключ `filter` в `POST /jobs` (даст 422, нужен `filters`), job kinds `export-cdxj`/`index-content`, wildcard-штампы replay, `doctor --auto-migrate`, `list-records`, `dump --format`, SQL по несуществующим таблицам `pdfs_metadata`/`archive_records`, неверные имена параметров MCP (`query`→`phrase`, `kind`→`metadata_types`, `page`).

Отдельно стоит отметить быстрые исправления: `max.md:13` (ссылка «Telegram Desktop» ведёт на instagram; плюс у MAX есть Bot API на dev.max.ru), `instagram.md:40,60` (пост #27, а не #28; блокировка с 2022, а не с 2024), `facebook.md:29` (CrowdTangle заменила Meta Content Library), `tiktok.md:11` (противоречие с разделом про Research API на той же странице; snscrape не умеет TikTok).
