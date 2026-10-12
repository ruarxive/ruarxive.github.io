# Журнал исправлений F5 (2026-10-12)

Зона: `kb/instruments/ruarxive-tools/*.md` (10 файлов), `kb/instruments/downloaded-data/*.md` (4), `kb/instruments/howto-collect/make-copy-website.md`, `make-copy-site-wordpress.md`.

## Как проверялось

- Клонированы репозитории `ruarxive/{tgarc,wparc,ydiskarc,filegetter,metawarc,apibackuper,spcrawler,apibackuper-dataarchive}` и `AduchiMergen/tgarc`; прочитаны README, `setup.py`/`pyproject.toml`, CLI (click/typer), `settings.py`, `api_server.py`, `api_models.py`, `mcp_server.py`, `jobs.py`, `cli_jobs.py`, `query.py`, `extractor/*`.
- Установлены в venv с PyPI: metawarc 2.0.3 (+`[api,mcp]`), wparc 1.0.8, ydiskarc 1.1.0, filegetter 1.1.0, apibackuper 1.0.13, spcrawler 1.0.1; из GitHub: wparc 1.0.9, tgarc 0.1.4. Сняты `--help` всех команд.
- metawarc проверен end-to-end на синтетическом WARC: `index`, `index-content --type/--text`, `stats`, `catalog`, `list-files`, `search`, `dump`, `get`, `export-cdxj --path-index`, `analyze links/hashes/duplicates/metadata`, `doctor`, `cleanup`, `ingest --dry-run`, `jobs`; `serve` с токеном — все REST-эндпоинты, ошибки 401/422/409, replay; `mcp` через клиент FastMCP и HTTP-транспорт (`http://127.0.0.1:8191/mcp`). SQL по Parquet-сайдкарам из рецептов выполнен.
- filegetter: конфигурации проверены `filegetter run --dry-run` (csv, list+pattern, jsonl с `data_key`).
- wget-команды из make-copy-website выполнены на example.com (wget 1.25).
- Внешние ссылки проверены curl (200); внутренние — скриптом (все существуют); MDX-проверка: чётные ```, нет голых `{ } <` вне кода.

## По файлам

### ruarxive-tools/index.md
- Добавлен frontmatter (title, description, last_updated).
- Убрана бессмысленная фраза про «основную организацию» metawarc; лицензии уточнены (MIT, Apache-2.0, CC0 у tgarc).
- Добавлены apibackuper и spcrawler; колонка «Состояние» с версиями PyPI и статусами (tgarc — нет на PyPI, не развивается с 2023; spcrawler — 2022).
- Установка разделена: tgarc только `pip install git+https://github.com/AduchiMergen/tgarc.git`.
- В «что когда использовать» для Telegram — Data Take-Out / tdl, tgarc с оговоркой. Исправлены «принципы» (убрано «tgarc инкрементальный» как гарантия).

### ruarxive-tools/tgarc.md (переписан)
- `:::warning`: не поддерживается (последний коммит 2023-12-15), Pyrogram архивирован (2.0.106, 04.2023), нет на PyPI; альтернативы Data Take-Out и tdl.
- Лицензия CC0 (не MIT); репозиторий — форк AduchiMergen/tgarc.
- Установка из GitHub; настройка через `tgarc configure` (`~/.tgarc/config`, сессия, `update`); убран выдуманный `config.yaml`.
- Реальные команды `configure/save/logout` и все опции `save` по `--help`; убраны `download --target/--incremental/--no-media`.
- Формат вывода по коду `main.py` (`<chat>/messages.jsonl`, медиа в `<file_unique_id>/`, каталог по умолчанию `tgarc-<дата>_<время>`).
- Известные проблемы из кода: `--update` перезаписывает `messages.jsonl`; запуск без `--update` сбрасывает позиции; `--max-size` падает с TypeError (int + str в `show_params`); `--format csv` не реализован; `--private` — выбор диалогов с защитой содержимого. Убраны утверждения про pywb/metawarc replay и «только публичные».

### ruarxive-tools/wparc.md (переписан)
- Реальный CLI: `ping|analyze|dump|getfiles <domain>` (PyPI 1.0.8) и `index|warc` + `--workers/--user/--password/--rate-limit/--no-resume` (только GitHub 1.0.9, на PyPI нет — проверено `--help` обеих версий).
- Реальная структура вывода (`<domain>/data/wp_v2_*.jsonl`, `files/wp-content/uploads/...`, `.wparc_checkpoint.json`, `index.sqlite3`, `dump.warc.gz`).
- Лицензия Apache-2.0 (по GitHub), Python 3.8+ (requires-python), ссылка на пост #32.
- Описано, что `wparc warc` пишет JSON-записи с `WARC-Target-URI` `<файл>#<id>` — не веб-архив страниц.
- Удалены «WARC через metawarc», «tgarc для WordPress», «SHA-1 имена медиа», `--auth/--resume/--max-media-size`.

### ruarxive-tools/ydiskarc.md (переписан)
- Реальный CLI 1.1.0: `sync URL -o [--update] [-n]`, `full URL -o [-f] [-m]`, `version`. Отмечено, что `--parallel`, `.part`-докачка и `configure` есть только в 1.2.0 в GitHub (не на PyPI); установка 1.2.0 через `pip install git+...` даёт сломанный пакет (нет `ydiskarc.cmds` в сборке — проверено).
- Работа через `cloud-api.yandex.net/v1/disk/public/resources`, а не WebDAV; `_metadata.json` на каждом уровне вместо выдуманного `manifest.jsonl`; `full` для папки → ZIP.
- Python 3.9+ (README), реальное сообщение об ошибке «No download URL found for …», обработка 429/Retry-After. Убраны aria2, `--resume`, версии «0.5+», утверждение про запароленные папки.

### ruarxive-tools/filegetter.md (переписан)
- INI `filegetter.cfg` с секциями `[project] [data] [files] [storage]` и всеми ключами из README; единственная команда `filegetter run` с реальными опциями.
- WARC поддерживается (`write_warc = True`, `filegetter[warc]` → `storage/files.warc.gz`); удалена фраза про metawarc «с пользовательским провайдером».
- Python API — `FilegetterBuilder(path).run()`.
- Связка с apibackuper через `source_type = jsonl` + `data_key`/`keys` (проверено dry-run; отмечено, что поле верхнего уровня через `data_key` не работает — использовать `list`).
- Шаблон адресов через `fetch_mode = pattern` и список id (диапазоны сам не генерирует). Убраны YAML, `--config/--pattern/--range/--from-jsonl`, «расписания», «проверка по checksums.txt». Python 3.9+. Ссылка на пост #75.

### ruarxive-tools/metawarc.md
- История версий: PyPI с 2020 (1.0.1), пост #61 (29.06.2022); обновление 2025 по #160 с точными цифрами (4,5 ГБ → 3,5 МБ, 0,07 %, ~285×; SQLite до 20 %); 2.0 — 08.08.2026 (#190) с уточнением: replay встроенный, pywb — через CDXJ; убраны «v2025.x», «несколько ТБ → сотни МБ», «britannica», «навигация по датам как в IA».
- Таблица команд по `--help` 2.0.3; `--dry-run` у `ingest`, не у `index`.
- Форматы изображений по `MIMES_EXT_TYPE_BY_GROUP` (убран HEIC).
- Переменные окружения — только реальные из `settings.py`, с пометкой, что `DB_PATH/DATA_DIR/MCP_PORT` не используются командами `serve`/`mcp`.
- `--unsafe-where` с `list-files` (не `list-records`); `dump` — файлы + `manifest.jsonl`, без `--format`; табличные выгрузки через `list-files -o --output-format` (≤1000) и jobs.
- Replay: штамп строго 14 цифр (+`mp_`/`id_`), wildcard → 422 (проверено), `?policy=exact`; переписываются HTML/CSS и Location; JS — нет. Удалён nginx-кэш.
- Jobs: только `export-records`; правильный CLI (`jobs --dbfile … submit --format … --mimes …`, `wait --poll-seconds`); статус `succeeded` (не `completed`); **CLI только ставит задачу, выполняет её `serve`** (проверено); limit > 1000 → failed (проверено).
- doctor: `--repair`, `--repair --apply`, `--dbfile`; убраны `--auto-migrate/--backup-dir`, «Schema v2 с 2025», 404-ссылки (`/operations/migration`, `/development`, `commands/`).
- Убрана ссылка `ikreymer/pywb` → `webrecorder/pywb`; добавлен frontmatter `last_updated`.

### ruarxive-tools/metawarc-rest.md (переписан)
- `METAWARC_API_TOKEN`/`--token`; порт по умолчанию 8000; запрет нелокального запуска без токена (текст ошибки).
- `/health` требует токен; реальный ответ `{status, schema_version, revision}`; `/docs` и `/openapi.json` открыты без токена (проверено).
- Реальные параметры `/records/list` (allowlist, 422 на лишние, limit 100/500, offset ≤ 100000), реальная форма ответов (по живому серверу); `/records/search` без `language`/`score`, limit 50.
- `POST /jobs`: `filters` (не `filter`), extra=forbid → 422; только `export-records`; реальные ошибки; `/jobs/{id}/result` возвращает метаданные, а не файл; статусы `succeeded` и т. п.
- `GET /` — HTML-список хостов, не redirect; replay-штампы; реальные лимиты из `settings.py`. Убраны rate-limit 1000 RPS, `--limit-max`, `METAWARC_SEARCH_MAX/PAYLOAD_MAX`, 100 МБ, даты 2026-11-09, Caddy-пример с подменой токена. Python-клиент переписан под реальные поля.

### ruarxive-tools/metawarc-mcp.md (переписан)
- Реальные параметры 7 инструментов из `mcp_server.py` (проверено `list_tools`): `archive_ids, mimes, …, offset, limit` (≤100), `get_record_*(archive_id, record_id)`, `search_records(phrase, limit)`, `collection_stats(archive_ids, dimensions, top)`, `metadata_summary(metadata_types, archive_ids, top)`.
- Убраны `page ≤ 100`, «10 000 записей», «Pydantic/ValidationError»; порт по умолчанию 8191, путь HTTP `/mcp` (проверено); у MCP нет авторизации. Убран непроверенный формат конфига Continue.

### ruarxive-tools/metawarc-cookbook.md (переписан)
- `--type` (повторяемый) вместо `--kinds`; `--text` вместо типа `texts`.
- SQL только по реальным Parquet-сайдкарам через таблицу `sidecars` (`read_parquet`), схемы столбцов сняты с реального каталога; убраны `pdfs_metadata/links_metadata/archive_records`.
- `filters` в jobs, без `status`/`language`; без `doctor --auto-backup`, `index --workers`; `export-cdxj -o файл.cdxj`; `--resume`/fingerprint описан корректно; `limit=0` → 422; `status_min/max` вместо `status=301`; удалена 404-ссылка `/use-cases`; даты 2026-11-09 убраны.
- Граф ссылок — через `analyze links --output-format json` (`data.domains`), дубликаты — `analyze hashes/duplicates`, сравнение снимков — `list-files` + `get`.

### ruarxive-tools/metawarc-extractors.md (переписан)
- Удалён выдуманный plugin API (`ExtractorBase`, `register()`, entry points, `--kinds fb2`, `metawarc.extractor.limits`, `MediaMetadataExtractor`, `RecordMetadataExtractor`, таблица `extraction_errors`, 404-ссылка).
- Описано реальное: таблица встроенных экстракторов (классы и `name` из кода), `ExtractorRegistry.__init__/select()/get_text_registry()`, порядок выбора, протокол `MetadataExtractor`, `ExtractionLimits` (в `envelope.py`), схема конверта. `:::info` «публичного API плагинов нет»; проверено, что собственный реестр в `ContentIndexer(registry=…)` не добавляет новый формат (кандидаты фильтруются по `MIMES_EXT_TYPE_BY_GROUP`).

### downloaded-data/index.md
- spcrawler — SharePoint (не «Сбербанк-АСТ»); реальный список конфигураций apibackuper-dataarchive; убраны GraphQL, «контроль версий», «автоматическое расписание»; убрано «десятки ТБ» из подписи ссылки.

### downloaded-data/apibackuper.md (переписан)
- `apibackuper.yaml` (приоритет) / `.yml` / `apibackuper.cfg` (INI устарел, предупреждение); `create` создаёт INI-заготовку (проверено), `detect --write-config` пишет YAML.
- Реальная схема (`settings/project/params/data/storage`), пример — реальный `examples/etrust/apibackuper.yaml`; все 10 команд по `--help`; Python 3.8+; auth/rate_limit по документации; ссылка на пост #89 и ruarxive.org/apibackuper.

### downloaded-data/apibackuper-configs.md (переписан)
- Реальная структура `apibackuper-dataarchive`: 6 каталогов `<project>/apibackuper.cfg` (+`params.json`), таблица проектов; реальный INI-пример (achgovru-checks); факты по #89 (4,2/5 ГБ, IA).
- Добавлены примеры из `apibackuper/examples` (templates/features/проекты).
- Убраны `configs/*.yaml`, «Электронный бюджет»/data.gov.ru-конфиги, `iterator.type: cursor`, OAuth2 `client_id/...`, `burst`, `skip_errors`, `filters`, `run test --max-pages`. Поля приведены к документации (`burst_size`, `error_handling.continue_on_error`, `export --where/--fields`).

### downloaded-data/spcrawler.md
- Frontmatter; `:::warning` (последний коммит в main 2022-04-21; `getfiles` — пустая функция в 1.0.1, проверено по коду); исправлено обобщение про `.aspx`; убран машинный перевод; shell-команды не в блоке `python`; реальные команды `ping/walk/dump/getfiles` по `--help`; формат вывода и пропуск уже сохранённых файлов по коду; ссылка на docs.microsoft.com → learn.microsoft.com.

### howto-collect/make-copy-site-wordpress.md
- Реальные команды `wparc ping|analyze|dump|getfiles <domain>`, убраны `pack`, `--url/--output/--input`; версия 1.0.8 вместо «бета»; `index`/`warc` — только 1.0.9 в GitHub.
- Примеры сайтов — из поста #32, оставлены duma-rad.ru и iephb.ru (в октябре 2026 отдают JSON на `/wp-json/`); убраны paperpaper.ru (отдаёт HTML) и agentura.ru (неверная характеристика, статус не проверялся); раздел «в планах» исправлен (check → ping/analyze).

### howto-collect/make-copy-website.md
- Frontmatter title/description/last_updated; относительные ссылки заменены абсолютными `/kb/...`.
- В таблицу добавлены колонка WARC/WACZ и Save Page Now; экстренная wget-команда — с `--warc-file --warc-cdx` (проверена; `--mirror` заменён на `--recursive --level=inf`, т.к. с WARC wget отключает timestamping с предупреждением).
- Восстановлена потерянная команда после «подобную этой»; wpull — последний релиз 2.0.1 (2016), PhantomJS устарел, ссылка на grab-site (форк wpull, по README grab-site). Убран пункт «поддерживает HTTP-прокси». Заголовки `#httrack` и `#экстренные-сценарии` сохранены (на них ссылаются другие страницы).

## Не удалось подтвердить / оставлено с оговоркой

- **Дата появления metawarc**: PyPI 1.0.1 и CHANGELOG — 2020-05-10, что расходится с каноническим «существует с 2022 года (#61)». На странице написано «на PyPI с 2020 года; в канале представлен 29.06.2022 (#61)». Координатору: решить, править ли канон (`about/project-history.md` и др.).
- Версия metawarc, о которой пост #160 (30.06.2025), не установлена: в CHANGELOG нет записей 1.3, на PyPI 1.3.1 вышла только 2026-07-09. Номер версии на странице не указан.
- Пост #190 говорит о replay «через pywb», код 2.0.3 — встроенный replay; на странице приведены оба факта.
- В README metawarc пример `jobs submit --limit 50000 --output-format csv` не работает (`--output-format` у `submit` нет, limit > 1000 падает) — проблема апстрима, на страницах дан рабочий вариант.
- ydiskarc 1.2.0 и wparc 1.0.9 не опубликованы на PyPI; у ydiskarc HEAD сломана упаковка (`packages = ["ydiskarc"]` без подпакетов) — стоит сообщить мейнтейнеру.
- tgarc: живой вход в Telegram не проверялся (нужен аккаунт); поведение описано по коду и `--help`.
- spcrawler: работоспособность на fa.ru/asutk.ru не проверялась (на странице так и сказано).
- `wparc warc` и MCP Claude Desktop конфиг: формат конфигов клиентов взят из документации клиентов/предыдущей версии страницы, metawarc их не документирует.

## Нужны правки в чужих файлах (координатору)

Неверные команды/утверждения о моих инструментах:

- `kb/guides/custom-workflows.md:128-141` — YAML-конфиг и `filegetter --config` (реально INI `filegetter.cfg` + `filegetter run`); `:209`, `:336` — `tgarc download --target/--incremental` (реально `tgarc save [--update] [-o]`); `:314`, `:323` — `apibackuper estimate/run incremental --since` (нет `--since`; есть `run [mode] [--resume]`, `update`).
- `kb/case-studies/api-archiving-scale.md:138,146,149,331,337` — `apibackuper verify`, `--since` не существуют.
- `kb/case-studies/multi-tool-archiving.md:85,205` — у `spcrawler dump` нет `--output` (пишет в `<домен>/data`); `:164,212` — `filegetter --config … --output` не существует; `:264` — «резюме загрузки в spcrawler» (есть только пропуск уже сохранённых JSONL); `:51` и `:18` — `wparc warc` есть только в 1.0.9 из GitHub (не на PyPI 1.0.8) и пишет JSON-записи, а не страницы.
- `kb/case-studies/wparc-to-metawarc-pipeline.md` — `wparc warc` только в GitHub-версии 1.0.9 (`pip install git+https://github.com/ruarxive/wparc.git`); WARC содержит JSON-записи с URI `<файл>#<id>`, это не веб-архив страниц (replay в pywb/metawarc как сайта не получится). Проверить также `metawarc search --query` (запрос позиционный).
- `kb/faq.md:67`, `kb/similar/russian-independent-media-archives.md:74`, `kb/instruments/tools/singlefile.md:130`, `kb/instruments/tools/archivebox.md:189` — wparc подан как способ получить WARC сайта; уточнить (только 1.0.9 из GitHub, JSON-записи) или убрать.
- `kb/guides/warc-workflow.md:141`, `kb/instruments/tools/duckdb-warc.md:215` — `metawarc --input … --output`, `metawarc-query` не существуют (реально `metawarc index … --dbfile`, `list-files`, `search`, SQL через `read_parquet` по сайдкарам — см. рецепт 7 в metawarc-cookbook).
- `kb/instruments/data-take-out/dto-google.md:76`, `dto-slack.md:99`, `kb/instruments/tools/yt-dlp.md:372` — metawarc не упаковывает данные в WARC.
- `kb/instruments/data-take-out/dto-telegram.md:51,57` (если ещё не исправлено) — `pip install tgarc` и `tgarc export` не существуют; установка из `git+https://github.com/AduchiMergen/tgarc.git`, команда `tgarc save`; добавить статус «не поддерживается, Pyrogram архивирован».
- `kb/instruments/data-take-out/dto-vk.md:50`, `kb/instruments/tools/auto-archiver.md:48` — `vk-caching` не существует (`ruarxive/vk-caching` → 404), удалить.
- `kb/instruments/tools/tdl.md:83-84` — при сравнении с tgarc указать его статус (не развивается с 2023, нет на PyPI).
- `kb/instruments/landscape-2026.md:180` и `:199`, `kb/instruments/tools/warc-gpt.md:250-259` — metawarc-mcp — не отдельный проект (`ruarxive/metawarc-mcp` → 404), а команда `metawarc mcp` в metawarc 2.0.x; статус один (входит в стабильный релиз 2.0.3).
- `kb/guides/warc-deduplication.md:276-285` — `tgarc.dedup` не существует.
- `kb/about/project-history.md` — дата появления metawarc (см. выше: PyPI с 2020, канал — 2022).
- `kb/guides/dynamic-ajax-sites.md:92-103` — YAML-шаблон filegetter (реально INI).

Сайдбар/категории:

- `kb/instruments/downloaded-data/index.md` не подключена в `sidebars.js` (по отчёту) — подключить как `link` категории «Загружаемые данные».
- `_category_.json` в `downloaded-data`, `howto-collect`, `ruarxive-tools` к концу моей работы уже были удалены и проиндексированы в git кем-то другим (F5 их не трогал) — проверить, что это намеренно.
