# Ревью KB, часть A: `kb/instruments/tools/` (a–m)

Дата: 2026-10-12. Режим: только чтение, файлы в `kb/` не менялись.
Объём: 19 файлов — archive-ph, archivebox, archivespark, auto-archiver, browsertrix, brozzler, cdx-summary, curl, duckdb-warc, dvd, firedm, gallery-dl, grab-site, heritrix, hitomi-downloader, httrack, hyphe, internet-archive-cli, monolith.

Как проверялось: `gh api repos/...` (метаданные, README, исходники с определениями CLI-аргументов), `--help` реально установленных `gallery-dl` 1.32.16 и `internetarchive` (`ia`) 5.11.1 в отдельном venv, PyPI JSON API, crates.io API, официальная документация (heritrix.readthedocs, браузерные профили browsertrix-crawler, man-страница httrack), Telegram-посты-источники (`t.me/s/ruarxive/N`), реестр `duckdb/community-extensions`.

Уровни уверенности: **подтверждено** — проверено по первоисточнику; **вероятно** — сильные косвенные признаки; **подозрение** — стоит проверить вручную.

> **Замечание о предыдущем аудите ссылок** (`temp/kb-link-audit-2026-10-12.md`): там написано «164 github.com URL, broken: 0», но в моём объёме **как минимум 4 ссылки на GitHub не работают**: `internetarchive/iaux-cdx-summary` (404), `dsheeler525/dvd` (404), `firedm/FireDM` (404), `KurtBestor/Hitomi-Downloader` (451, заблокирован по DMCA). Для Hitomi аудит указывает, что замена применена, но в `hitomi-downloader.md` и `youtube-dl-gui.md` ссылка осталась. Кроме того, сделанная аудитом замена `crates.io/crates/monolith` → `crates.io/crates/monolith-cli` **ошибочна**: `monolith-cli` возвращает 404, а `monolith` — 200.

---

## archive-ph.md

- [SEVERITY: major] archive-ph.md:300-303, 339 — Conifer рекомендуется как рабочая альтернатива («Попробуйте позже или используйте Conifer»). — На главной conifer.rhizome.org сейчас висит баннер: «Creating and modifying collections was disabled before Conifer's discontinuation in June 2026». **Подтверждено.** — Убрать Conifer или пометить как закрытый с июня 2026; вместо него предложить ArchiveWeb.page / Browsertrix. (Те же упоминания есть в `guides/quick-start-5min.md:217,244`, `guides/emergency-archiving.md:209`, `replay/memento.md:228`.)
- [SEVERITY: major] archive-ph.md:113-155 — «Архивация через GET-запрос» `https://archive.ph/?run=1&url=...` и Python-скрипт, который берёт `response.url` как «адрес архива». — `?run=1` — это параметр букмарклета: он открывает форму и отправляет её JavaScript-ом в браузере. У `requests` JS не выполняется, к тому же archive.today часто показывает CAPTCHA. Финальный URL будет главной страницей или страницей капчи, а не снимком. **Вероятно** (поведение известно, но в этот раз не воспроизводилось — сервис отдаёт 429 на автоматические запросы). — Убрать скрипт или явно написать, что надёжного программного способа нет; для массовой архивации отправлять в SPN2 (Wayback).
- [SEVERITY: minor] archive-ph.md:212 — мусор кодировки: «координи��ованное». **Подтверждено.** — Исправить на «координированное».
- [SEVERITY: minor] archive-ph.md:228 — смешение языков: «Используйте VPN if you want privacy». **Подтверждено.** — Перевести.
- [SEVERITY: minor] archive-ph.md:16-17 vs 223-239 — противоречие: «Не может быть изменен или удален» и «Невозможно удалить», а ниже описана процедура запроса на удаление. archive.today действительно удаляет снимки по запросам и жалобам. **Подтверждено** (внутреннее противоречие). — Переформулировать: «пользователь сам удалить не может, удаление возможно только по запросу администрации».
- [SEVERITY: minor] archive-ph.md:166, 169 — для Wayback в столбце «Регистрация» стоит «✅ нужна для сохранения». Анонимный Save Page Now (`web.archive.org/save`) существует; учётная запись нужна только для расширенных опций (outlinks, скриншоты, SPN2 API). **Подозрение.** — Уточнить формулировку.
- [SEVERITY: minor] archive-ph.md:167 — «Доступность в РФ: ✅ Обычно доступен» без источника и даты. **Подозрение.** — Либо дать источник и дату, либо убрать строку.
- [SEVERITY: minor] archive-ph.md:213, 288 — «Юридическая значимость», «может использоваться как свидетельство» — преувеличение без оговорок. — Добавить оговорку о юрисдикции и о том, что нотариальное удостоверение надёжнее; дать ссылку на `/kb/legal`.
- [SEVERITY: minor] archive-ph.md:63, 254 — плейсхолдеры `archive.ph/AbCdE`, `archive.ph/Xy9Zq` оформлены как настоящие ссылки (аудит пометил их как подозрительные). — Явно пометить как пример или вынести в код-блок.
- Проверено и в порядке: расширение Firefox «Archive Page» (AMO, автор John Navas, обновлено 2026-06) и Chrome «Web Archives» (`hkligngkgcpcolhcnkgccglchdafcnao`) существуют; `archive.org/help/wayback_api.php` — 200; репозиторий `ivbeg/awesome-data-takeout` существует.

## archivebox.md

- [SEVERITY: critical] archivebox.md:22, 162, 189 — «ArchiveBox не создаёт WARC… формат хранения собственный». — README ArchiveBox: «we save standard HTML, PNG, PDF, TXT, JSON, **WARC**, SQLite…». Wget-экстрактор пишет `warc/TIMESTAMP.gz` (там же: «wget clone of the site with warc/TIMESTAMP.gz»). **Подтверждено.** — Переписать: WARC создаётся экстрактором wget (`SAVE_WARC`). Противоречие повторяется в `warc2zim.md:284`.
- [SEVERITY: major] archivebox.md:93-105 — блок «В config.json» с ключом `SAVE_CHROME`. — Конфигурация хранится в `ArchiveBox.conf` (INI) или задаётся через `archivebox config --set KEY=VALUE` (README, строки 726-734). Ключа `SAVE_CHROME` нет: в стабильной ветке есть `SAVE_WGET`, `SAVE_WARC`, `SAVE_PDF`, `SAVE_SCREENSHOT`, `SAVE_DOM`, `SAVE_SINGLEFILE`, `SAVE_MEDIA` и т. п., а в ветке 0.9/dev — `WGET_ENABLED`, `DOM_ENABLED`. Вдобавок JSON лежит в блоке с пометкой `bash`. **Подтверждено.** — Заменить на `archivebox config --set SAVE_PDF=True` и т. д.
- [SEVERITY: major] archivebox.md:184 — `archivebox remove --older-than=365`. — В `archivebox_remove.py` есть только `--yes`, `--delete`, `--before`, `--after`, `--filter-type`. **Подтверждено.** — `archivebox remove --before=<timestamp> --delete`.
- [SEVERITY: major] archivebox.md:193 — «Поиск работает только по SQLite-метаданным и заголовкам». — В ArchiveBox встроен полнотекстовый поиск с бэкендами ripgrep (по умолчанию), Sonic и SQLite FTS5 (README, строка 1299, «Setting up the Search Backends»). **Подтверждено.** — Исправить.
- [SEVERITY: minor] archivebox.md:68-72, 109-112 — `archivebox add --depth=0 feed.xml` подан как импорт RSS. С `--depth=0` заархивируется сама страница ленты, а не ссылки из неё. В README: `archivebox add --depth=1 --plugins=parse_rss_urls "file://…feed.xml"` или передача содержимого через stdin. **Вероятно.** — Исправить пример.
- [SEVERITY: minor] archivebox.md:189 — как WARC-альтернатива предложен «wparc», но wparc выгружает WordPress REST API в JSON и WARC не пишет (см. `ruarxive-tools/wparc.md`). **Подтверждено.** — Убрать wparc из этого предложения.
- [SEVERITY: minor] archivebox.md:204 — документация теперь живёт в основном на docs.archivebox.io; вики жива, но устаревает. Последний релиз — v0.9.73 (2026-10-06); в тексте версия не указана. — Добавить ссылку на актуальную документацию и номер версии.

## archivespark.md

- [SEVERITY: critical] archivespark.md:42-51, 55-58 — Scala-пример выдуман: `import org.archive.archivespark.ArchiveSpark`, `functions.partition.{CdxPartition, SparkPartition}`, `suggest.ConcatenatedPrefixes`, `ArchiveSpark.load("hdfs:///…warc.gz")`, `.pages().filterByStatusCode(200)`. — В `docs/General_Usage.md` настоящий API выглядит так: `import org.archive.webservices.archivespark._`, `…functions._`, `…specific.warc._`; загрузка `ArchiveSpark.load(WarcSpec.fromFiles(cdxPath, warcPath))` (нужен CDX!), фильтр `rdd.filter(r => r.status == 200 && r.mime == "text/html")`, обогащение `.enrich(HtmlText)`. **Подтверждено.** — Заменить пример на пример из документации.
- [SEVERITY: major] archivespark.md:80 — источник «Telegram #61 (29.06.2022)». — В посте #61 (проверен через `t.me/s/ruarxive/61`) упоминаются metawarc, CDX Summary и SolrWayback; ArchiveSpark там нет. **Подтверждено.** — Убрать ссылку на источник или найти правильный пост.
- [SEVERITY: minor] archivespark.md:30 — «Готовых бинарных релизов нет». — Есть релиз v.3.0.1 (2019) с `archivespark-assembly-3.0.1.jar` и `…-deps.jar`. **Подтверждено.** — Исправить.
- [SEVERITY: minor] archivespark.md:70 — «проект Internet Archive развивает». — Последний тегированный релиз вышел в 2019, `latest-SNAPSHOT` — в 2024; автор — Helge Holzmann (начинал в L3S, позже работал в IA). **Подтверждено.** — Написать «поддерживается эпизодически, последний релиз 3.0.1 (2019)».
- [SEVERITY: minor] archivespark.md:20 — опечатка «MLib» (правильно MLlib).

## auto-archiver.md

- [SEVERITY: critical] auto-archiver.md:140, 153, 175, 231, 239, 253 — команда `auto-archiver run [--config …]`. — Подкоманды `run` нет. По README: `auto-archiver --config secrets/orchestration.yaml`. В `orchestrator.py` нет `add_subparsers`, только флаги. **Подтверждено.** — Убрать `run` из всех примеров.
- [SEVERITY: critical] auto-archiver.md:13, 23, 40-51, 111-121, 158-165 — имена модулей выдуманы: `yt_dlp_extractor`, `wacz_extractor`, `image_extractor`, `pdf_extractor`, `vk_extractor` («через vk-caching» — а `ruarxive/vk-caching` аудит уже признал галлюцинацией), `instagram_extractor` «через instaloader». — Фактический список модулей в `src/auto_archiver/modules`: `generic_extractor` (на базе yt-dlp), `telethon_extractor`, `telegram_extractor`, `instagram_extractor`, `instagram_api_extractor`, `instagram_tbot_extractor`, `twitter_api_extractor`, `wacz_extractor_enricher`, `wayback_extractor_enricher`, `hash_enricher`, `screenshot`/`thumbnail_enricher`, `gsheet_feeder_db`, `csv_feeder`, `cli_feeder`, `atlos_feeder_db_storage`, `local_storage`, `s3_storage`, `gdrive_storage` и др. **Подтверждено.** — Переписать таблицу экстракторов по реальному списку.
- [SEVERITY: critical] auto-archiver.md:100-136, 186-196 — схема `config.yaml` выдумана: `input.google_sheets`, `extractors.*.enabled`, `wacz_extractor.browsertrix_url: http://localhost:3030`, `database: type: sqlite`, `input.csv.file/url_column`. — На деле используется `orchestration.yaml` с `steps: {feeders: [...], extractors: [...], enrichers: [...], databases: [...], storages: [...], formatters: [...]}` плюс отдельные секции настроек модулей. `wacz_extractor_enricher` сам запускает browsertrix-crawler через **docker** (в манифесте `bin: docker`, настройки `profile`, `docker_commands`, `timeout`) — никакого `browsertrix_url` нет. У `csv_feeder` настройки называются `files` и `column`. **Подтверждено.** — Заменить пример на пример из документации (`auto-archiver.readthedocs.io`).
- [SEVERITY: major] auto-archiver.md:33 — `auto-archiver run --csv=./urls.csv` — такого флага нет; правильно `--feeders=csv_feeder --csv_feeder.files=urls.csv`. **Подтверждено.**
- [SEVERITY: major] auto-archiver.md:35, 37-38, 60-61 — источники и хранилища, которых нет в коде: Airtable, «Telegram-бот» как источник, «API», Hugging Face Datasets, SQLite-БД. Среди модулей `api_db` есть, но это запись в API, а не источник. **Подтверждено** (по списку модулей). — Удалить или заменить реальными (CSV/GSheet/Atlos/CLI; `csv_db`, `gsheet_db`, `api_db`, `console_db`).
- [SEVERITY: major] auto-archiver.md:73-77 — Docker-пример с монтированием `config.yaml:/app/config.yaml` и `output:/app/output`. — README: `docker run -it --rm -v secrets:/app/secrets bellingcat/auto-archiver --config secrets/orchestration.yaml`. **Подтверждено.**
- [SEVERITY: major] auto-archiver.md:158-165 — у `telethon_extractor` якобы есть список `channels` для «полной истории канала». — Настройки модуля: `api_id`, `api_hash`, `bot_token`, `session_file`, `join_channels`, `channel_invites`; выгрузки целого канала нет — модуль архивирует отдельные ссылки на посты. **Подтверждено.** — Исправить описание.
- [SEVERITY: major] auto-archiver.md:5 — `last_updated: 2026-11-09` — дата в будущем (сегодня 2026-10-12). **Подтверждено.** Те же «будущие» даты стоят в примерах на строках 190, 195, 211-216 — для примеров это допустимо.
- [SEVERITY: minor] auto-archiver.md:11 — «С 2023 года». — Репозиторий создан 2021-01-15. **Подтверждено.** — «С 2021 года».
- [SEVERITY: minor] auto-archiver.md:277 — «проверяет SHA-256 — если архив уже есть, повторно не скачивает» — **подозрение**: `hash_enricher` считает хеш, но дедупликацию по нему перед загрузкой не делает. Проверить в документации.
- [SEVERITY: minor] auto-archiver.md:302-312 — в сравнении у ArchiveBot стоят «WACZ ✅» и «Простота для нетехнических пользователей ✅». ArchiveBot пишет WARC, а работа с ним идёт через IRC и требует одобрения оператора. **Вероятно.**
- Проверено и в порядке: статья Bellingcat от 2025-08-13 «…preserved 150,000 pieces of online evidence» существует (200), так что цифра 150 000 подтверждается; лицензия MIT; страница readthedocs (200).

## browsertrix.md

- [SEVERITY: critical] browsertrix.md:34, 133, 144, 156 — во всех примерах volume `-v $PWD/data:/crawl/data`. — Официальная документация: `-v $PWD/crawls:/crawls/`. Краулер пишет в `/crawls/collections/<name>/`, поэтому при монтировании `/crawl/data` WACZ останется внутри контейнера и пропадёт вместе с `--rm`. Утверждение на строке 41 («в папке data появится .wacz») ложно. **Подтверждено** (docs/user-guide/index.md). — Заменить на `-v $PWD/crawls:/crawls/`.
- [SEVERITY: critical] browsertrix.md:155-163 — `--cookies /crawl/cookies.txt`. — Флага нет (в `argParser.ts` его нет). Авторизация делается через профиль: `create-login-profile`, затем `--profile /crawls/profiles/x.tar.gz`. **Подтверждено.**
- [SEVERITY: major] browsertrix.md:19-20 — «Browsertrix Desktop — приложение с GUI для Windows, Mac и Linux». — Такого продукта нет. Настольный инструмент Webrecorder называется **ArchiveWeb.page** (расширение и Electron-приложение). **Подтверждено** (по линейке продуктов Webrecorder). — Заменить на ArchiveWeb.page.
- [SEVERITY: major] browsertrix.md:125 — behavior `clickAll`. — Допустимые значения: `autoplay`, `autofetch`, `autoscroll`, `siteSpecific`, `autoclick` (по умолчанию первые четыре). **Подтверждено.** — Заменить на `autoclick`.
- [SEVERITY: major] browsertrix.md:150 — `--waitFor 5000` — такого флага нет; есть `--waitUntil`, `--postLoadDelay`, `--pageExtraDelay` (`--delay`), `--netIdleWait`. **Подтверждено.**
- [SEVERITY: major] browsertrix.md:46 — `--include-regex` — флага нет; правильно `--include` (`--scopeIncludeRx`) вместе с `--scopeType`. **Подтверждено.**
- [SEVERITY: major] browsertrix.md:72 — у Brozzler якобы «интеграция с Redis». — Brozzler использует **RethinkDB** (см. раздел brozzler ниже); Redis внутри использует как раз Browsertrix Crawler. **Подтверждено.**
- [SEVERITY: minor] browsertrix.md:22-23, 86-96 — «Browsertrix Cloud»: в 2024 сервис переименован просто в «Browsertrix». — Обновить название.
- [SEVERITY: minor] browsertrix.md:78 — Squidwarc подан как живая альтернатива, хотя последний push в `N0taN3rd/Squidwarc` был 2020-05-19. **Подтверждено.** — Пометить как неподдерживаемый.
- [SEVERITY: minor] Пробел в содержании: нет упоминаний `--text`, `--scopeType`, `--workers`, `--saveState`, QA-режима, нет раздела «когда не использовать».

## brozzler.md

- [SEVERITY: critical] brozzler.md:4, 13, 18, 24, 28, 35, 41, 65-66, 87, 92, 104, 128, 147-155, 187 — вся страница построена на «координации через Redis». — README Brozzler: «uses … **rethinkdb** to manage crawl state»; в требованиях указаны «Python 3.9 or later» и «RethinkDB deployment»; установка — `pip install brozzler[rethinkdb]`. **Подтверждено.** — Везде заменить Redis на RethinkDB, переписать раздел мониторинга (`redis-cli KEYS *`, `LLEN brozzler:queue` выдуманы) на `brozzler-dashboard` / `brozzler-list-jobs`. Та же ошибка распространена по KB: `landscape-2026.md:61`, `tools/index.md:27,65,125,159`, `grab-site.md:23,150`.
- [SEVERITY: critical] brozzler.md:72 — `brozzler-new-job https://example.com`. — `brozzler-new-job` принимает **YAML-файл задания**; для одного URL используется `brozzler-new-site [--time-limit] URL`. **Подтверждено** (README).
- [SEVERITY: major] brozzler.md:99-111, 143, 172, 190 — выдуманы `brozzler.yaml` с `max_concurrent_tabs`/`redis_address`, `brozzler-worker --config`, `--max-concurrent-tabs`, `--warcprox-address`. — Реальные флаги из `cli.py`: `--max-browsers`, `--rethinkdb-servers`, `--rethinkdb-db`, `--proxy`, `--warcprox-auto`, `--skip-youtube-dl`, `--stealth` и др. **Подтверждено.** — Заменить на `brozzler-worker --max-browsers=N --warcprox-auto` (или `--proxy=localhost:8000`).
- [SEVERITY: minor] brozzler.md:40 — «Python 3.6+» → в README «3.9 or later». **Подтверждено.**
- [SEVERITY: minor] brozzler.md:88 vs 191 — противоречие: «Brozzler Dashboard (опционально)» и «нет веб-интерфейса». Dashboard существует: `pip install brozzler[dashboard]`, `brozzler-dashboard`, порт 8000. Ещё стоит упомянуть `brozzler-easy` (warcprox + pywb + dashboard в одном). **Подтверждено.**
- [SEVERITY: minor] brozzler.md:14 — «реальный Chrome (а не headless-Puppeteer), устойчивее к anti-bot» — оценочно и без источника; Browsertrix тоже использует настоящий Chrome/Brave.

## cdx-summary.md

- [SEVERITY: critical] cdx-summary.md:11, 34-36 — ссылка `github.com/internetarchive/iaux-cdx-summary` и `git clone` по ней возвращают **404**. — Настоящий репозиторий — `github.com/internetarchive/cdx-summary`. На него же ссылается Telegram-пост #61, указанный на этой странице как источник. **Подтверждено.** — Заменить ссылку.
- [SEVERITY: critical] cdx-summary.md:30-45 — «запустить через Node.js», `npm install`, `node ./bin/ia-cdx-summary --domain … --year …`. — Инструмент написан на **Python**: `pip install cdxsummary`, команда `cdxsummary [-a QUERY] [-i] [-j] [-o FILE] [-r] [-s N] [-t N] input` (README). Флагов `--domain` и `--year` нет. **Подтверждено.** — Переписать: `cdxsummary sample.cdx.gz`, `cdxsummary --api 'matchType=domain' kremlin.ru`, `cdxsummary -i <IA-item>`.
- [SEVERITY: major] cdx-summary.md:27 vs 56 — противоречие: «работает только с IA CDX» и «работает над общим CDX без изменений». — По README инструмент принимает любые локальные или удалённые CDX (plain/gz/bz2), stdin, IA Petabox item и запросы к Wayback CDX API. **Подтверждено.** — Убрать строку 27.
- [SEVERITY: minor] cdx-summary.md:47 — «количество скриншотов» — такого поля в выводе нет. В выводе есть: обзор (captures, unique URLs/hosts, WARC size, даты), сетка MIME×status, path/query-сегменты, год×месяц, top hosts, sample mementos. **Подтверждено.**
- [SEVERITY: minor] cdx-summary.md:13 — «CDX — собственный текстовый индекс Internet Archive» — упрощение: CDX/CDXJ — общий формат индексов (pywb, OpenWayback). Ссылку `github.com/ikreymer/pywb` (строка 56) лучше заменить на `webrecorder/pywb` (сейчас она редиректит).

## curl.md

- [SEVERITY: major] curl.md:21, 36, 248-252 — «Пишет в WARC (экспериментально, через `--warc`)» и `pip install curl-to-warc` / `curl-to-warc -o …`. — У curl нет флага `--warc`; пакета `curl-to-warc` на PyPI нет (404, `pip index versions` → «No matching distribution»). **Подтверждено.** — Удалить; для WARC через HTTP-клиент предложить `warcio` (`capture_http`) или `wget --warc-file`.
- [SEVERITY: minor] curl.md:21 vs 256, 390 — внутреннее противоречие («пишет в WARC» и «нет нативного WARC»). — Исчезнет после правки выше.
- [SEVERITY: minor] curl.md:80 — «встроенный curl.exe (PowerShell 5+)». — curl.exe входит в Windows 10 начиная с 1803 и с PowerShell не связан. Более того, в Windows PowerShell 5.1 `curl` — алиас `Invoke-WebRequest`, поэтому вызывать нужно именно `curl.exe`. **Подтверждено** (общеизвестно). — Исправить, это ловушка для пользователей.
- [SEVERITY: minor] curl.md:401 — `catonmat.net/curl-cookbook` → 404. **Подтверждено.** — Удалить.
- [SEVERITY: minor] curl.md:134, 233 — `https://bit.ly/short` — плейсхолдер, похожий на реальную ссылку (аудит его пометил). — Заменить на `https://example.com/redirect`.
- [SEVERITY: minor] curl.md:373-374 — `-A` и `--user-agent` указаны вместе, хотя это одна и та же опция. — Оставить одну.
- [SEVERITY: minor] curl.md:180 — `--http3` работает только в сборках с поддержкой HTTP/3 (стандартные сборки в дистрибутивах и macOS её часто не имеют). — Добавить оговорку.
- [SEVERITY: minor] curl.md:407 — «tdl … использует curl-подобные подходы» — tdl работает с MTProto (Go), связь с curl надуманна.

## duckdb-warc.md

- [SEVERITY: critical] duckdb-warc.md:28-30 — заголовок «DuckDB-warc (by Common Crawl)», а ссылка ведёт на `harvard-lil/duckdb-warc`. — Это проект Harvard LIL на Rust (создан 2025-12-22); к Common Crawl он отношения не имеет. **Подтверждено.** — Исправить атрибуцию (это наследие замены из аудита).
- [SEVERITY: critical] duckdb-warc.md:40-41, 50-51, 230, 328, 336, 346-347, 361 — `INSTALL duckdb_warc FROM community`. — В реестре `duckdb/community-extensions` расширения `duckdb_warc` нет. harvard-lil README предлагает собрать расширение и сделать `LOAD 'duckdb_warc.duckdb_extension'` (unsigned). В community есть **другое** расширение — `warc` (`midwork-finds-jobs/duckdb_warc`), с функцией `parse_warc(content)` поверх `read_blob()`. **Подтверждено.** — Указать два реальных пути: `INSTALL warc FROM community` + `parse_warc`, либо сборка harvard-lil + `read_warc`.
- [SEVERITY: critical] duckdb-warc.md:56-63, 84-94, 99-103, 125-133, 234-245, 263-264, 276-279 — колонки `url`, `length`, `response_code`, `warc_type`, `warc_date`, `warc_payload_digest`. — В `harvard-lil/duckdb-warc/src/schema.rs` колонки такие: `target_uri`, `content_length`, `type`, `date`, `record_id`, `payload_digest`, `block_digest`, `content_type`, `ip_address`, `filename`, `body` и др. Колонки HTTP-статуса нет вообще, поэтому все запросы с `response_code = 200` не выполнятся. **Подтверждено.** — Переписать все SQL-примеры.
- [SEVERITY: critical] duckdb-warc.md:135-190; также `similar/common-crawl.md:98-243, 295` — выдуманное расширение `duckdb_web_archive_cdx` с функциями `cdx_ia()`/`cdx_cc()`; утверждение «открытый репозиторий авторами не опубликован»; фейковый домен `commoncrawl-index.communitycrawl.org`. — Реальное расширение называется **`web_archive`** (`INSTALL web_archive FROM community`), репозиторий открыт (`midwork-finds-jobs/duckdb-web-archive`), функции — `wayback_machine()` и `common_crawl_index()` с pushdown фильтров через `WHERE`. **Подтверждено.** — Переписать раздел.
- [SEVERITY: major] duckdb-warc.md:112, 235 — функции `warcio_extract_body()`, `content_decode()`, `url_domain()` в DuckDB и в этих расширениях не существуют. **Подтверждено** (в harvard-lil зарегистрирована только `read_warc`). — Удалить; тело доступно в колонке `body`.
- [SEVERITY: major] duckdb-warc.md:290-300 — таблица «Производительность» (5×, ∞, «~2 с на 1 ГБ») без источника и методики; фраза «O(n) чтения вместо O(n) Python-парсинга» бессмысленна. **Вероятно** выдумано. — Удалить или заменить реальным замером.
- [SEVERITY: major] duckdb-warc.md:214-215 — `metawarc --input archive.warc.gz --output ./catalog` и `metawarc-query "SELECT…"`. — У metawarc (README `ruarxive/metawarc`) таких команд нет; реальные: `metawarc index '…/*.warc*' --dbfile collection.db`, `metawarc stats`, `metawarc search`, `metawarc serve` и т. д. **Подтверждено.**
- [SEVERITY: major] duckdb-warc.md:333; также `users/inspect-warc.md:391` — `%pip install duckdb-warc` / `pip install duckdb-warc`. — Пакета нет на PyPI (404 для `duckdb-warc` и `duckdb_warc`). **Подтверждено.**
- [SEVERITY: major] duckdb-warc.md:5 — `last_updated: 2026-11-09` — дата в будущем. **Подтверждено.**
- [SEVERITY: minor] duckdb-warc.md:22 — мусор «hours CIy + Python», смешение языков («one query», «hours Python-скрипта»). — Исправить.
- [SEVERITY: minor] duckdb-warc.md:36-41 — Python-код (`import duckdb`) лежит в блоке `bash`.
- [SEVERITY: minor] duckdb-warc.md:233 — комментарий «Top 20 стран», а группировка идёт по доменам.
- [SEVERITY: minor] duckdb-warc.md:317 vs 109 — противоречие: «Извлечение payload (только метаданные)» и пример с извлечением `<title>` из тела.
- [SEVERITY: minor] duckdb-warc.md:371 — «для WACZ-валидации используйте warctools» — warctools WACZ не валидирует; для этого есть `py-wacz` (`wacz validate`).
- [SEVERITY: minor] duckdb-warc.md:378 — «Common Crawl blog: SQL for web archives» ведёт на корень блога; поста с таким названием не найдено. **Подозрение.**

## dvd.md

- [SEVERITY: critical] dvd.md:10-41 — вся страница выдумана: «GUI-обёртка над yt-dlp для **macOS**», ссылка `github.com/dsheeler525/dvd` (404), `brew install david-video-downloader` (cask не существует, 404), `.dmg`, drag&drop, импорт cookie. Расшифровка «David Video Downloader» тоже взята с потолка. — В Telegram-посте #10, который указан как источник, ссылка ведёт на `github.com/yausername/dvd`. Это **Android-приложение на Kotlin** (GPL-3.0) поверх `youtubedl-android` (youtube-dl), распространяется APK и через F-Droid (`org.yausername.dvd`), последний push — 2023-10-25. **Подтверждено.** — Переписать страницу целиком. Правильное описание уже есть в `data-take-out/dto-youtube.md:86-89`, так что сейчас эти страницы противоречат друг другу. Ту же ошибку надо исправить в `youtube-dl-gui.md:35`.

## firedm.md

- [SEVERITY: major] firedm.md:10, 33-38 — ссылка `github.com/firedm/FireDM` и `git clone` по ней → **404**. — Репозиторий удалён; в `dto-youtube.md:79` говорится об удалении по DMCA (здесь не проверял). **Подтверждено** (404). — Пометить проект как удалённый/заброшенный, дать ссылку на снимок в web.archive.org или убрать страницу.
- [SEVERITY: major] firedm.md:3, 11 — «на Python+PyQt». — В зависимостях последнего релиза на PyPI (2022.4.14): `awesometkinter`, `pycurl`, `pystray`, `plyer`, `youtube-dl`, `yt-dlp`, т. е. GUI на **Tkinter**, загрузка через **pycurl**. **Подтверждено.** Та же ошибка в `youtube-dl-gui.md:37`.
- [SEVERITY: major] firedm.md:13-19 — страница подаёт проект как живой. — Последний релиз — 2022.4.14 (апрель 2022). Из-за встроенной старой yt-dlp «автоматические обновления форматов» (строка 42) не работают. **Подтверждено.** — Добавить предупреждение «не поддерживается с 2022».
- [SEVERITY: minor] firedm.md:46 — «CAPTCHA-обход» — в описании и зависимостях проекта подтверждений нет. **Подозрение** (выдумано). — Удалить.
- [SEVERITY: minor] firedm.md:22 — как альтернатива рекомендуется Hitomi Downloader, который сам заблокирован по DMCA (см. ниже).

## gallery-dl.md

- [SEVERITY: critical] gallery-dl.md:204, 320-322 — `--rate 30` («макс. 30 запросов в минуту»). — Такого аргумента нет: gallery-dl 1.32.16 отвечает «error: unrecognized arguments: --rate». Есть `-r, --limit-rate RATE` — это ограничение **скорости загрузки в байтах/с** (500k, 2.5M), а не числа запросов. Для пауз между запросами служит `--sleep-request`. **Подтверждено.**
- [SEVERITY: critical] gallery-dl.md:210, 239 — `--jobs 4` и ключ конфига `jobs: 4`. — Такого аргумента нет («unrecognized arguments: --jobs»); параллельной загрузки в gallery-dl нет. **Подтверждено.** — Удалить; заодно убрать «Параллельные соединения» из строки 51 и из таблицы сравнения (строка 273).
- [SEVERITY: major] gallery-dl.md:223-260, 345-351 — путь `~/.config/gallery-dl.conf (YAML)` и структура конфига. — `gallery-dl --config-status` показывает пути `/etc/gallery-dl.conf`, `~/.config/gallery-dl/config.json`, `~/.gallery-dl.conf`; формат по умолчанию — **JSON** (YAML/TOML только через `--config-yaml`/`--config-toml`). Секции сайтов (`twitter:`, `pixiv:`, `danbooru:`) и `sleep`, `cookies-from-browser` должны лежать **внутри** `extractor:`, а здесь они на верхнем уровне. **Подтверждено.** — Переписать пример как JSON с вложенностью `extractor.twitter…`.
- [SEVERITY: major] gallery-dl.md:265 — `gallery-dl oauth:twitter` → «Unsupported URL 'oauth:twitter'». **Подтверждено.** — Удалить; OAuth есть для pixiv, reddit, flickr, tumblr, deviantart, mastodon, smugmug.
- [SEVERITY: major] gallery-dl.md:54, 80 — «Archive download для Reddit… восстановление удалённого контента через Pushshift». — Публичный Pushshift закрыт в 2023, такого экстрактора в gallery-dl нет. **Подтверждено** (`--list-extractors`/supportedsites). — Удалить.
- [SEVERITY: major] gallery-dl.md:65-68 — в таблице платформ «MissKobayashi», «Comic Walker», «Reuters, Getty Images, NYT», «Tistory» — в `docs/supportedsites.md` их нет. **Подтверждено** (поиск по supportedsites.md). — Удалить; сверить таблицу с supportedsites.md.
- [SEVERITY: major] gallery-dl.md:398 — ссылка «Архивация Twitter» ведёт на `/kb/instruments/social-media/fbarc`, а это F(b)arc — инструмент для **Facebook** Graph API. **Подтверждено.** — Исправить ссылку.
- [SEVERITY: minor] gallery-dl.md:126-127 — зависимости «PyYAML, requests, bs4, lxml, Pillow, mutagen… pycryptodome, browser-cookie3». — В `setup.py` обязательна только `requests>=2.11.0`; остальное опционально или не используется (bs4, lxml). **Подтверждено.**
- [SEVERITY: minor] gallery-dl.md:43, 270-279, 388 — «200+ сайтов» — сильно занижено (`--list-extractors` выдаёт сотни экстракторов, supportedsites — 300+ сайтов). — «300+» или «сотни».
- [SEVERITY: minor] gallery-dl.md:178 — `--filter "width >= 1920…"` — доступность ключей зависит от экстрактора (в `--help` пример с `image_width`). — Добавить оговорку.
- Проверено и в порядке: `--download-archive` (SQLite), `--cookies-from-browser`, `-i/--input-file`, `--filter`, `--sleep 2-5`, `--write-metadata`, `--write-info-json`, ссылки на `docs/configuration.rst`, `supportedsites.md`, `index.md`.

## grab-site.md

- [SEVERITY: critical] grab-site.md:41 — `pip install grab-site`. — На PyPI пакета нет (404). README ставит так: `~/gs-venv/bin/pip install --no-binary lxml --upgrade git+https://github.com/ArchiveTeam/grab-site` в venv на **Python 3.7/3.8**. **Подтверждено.**
- [SEVERITY: critical] grab-site.md:64-69, 94-96 — `grab-site --dashboard URL` и `grab-site-dashboard`. — Ни флага, ни команды нет. Дашборд запускается отдельно командой `gs-server` (http://127.0.0.1:29000/). **Подтверждено** (README, `libgrabsite/main.py`).
- [SEVERITY: major] grab-site.md:80 — `--ignore-regex` — такого флага нет. Игнор-паттерны задаются через `--igsets=…`, `--import-ignores FILE` или правкой файла `DIR/ignores` во время краула. **Подтверждено.**
- [SEVERITY: major] grab-site.md:101-114 — файл `~/.grab-site/config` с `max_depth`, `ignore_extensions`, `user_agent` выдуман. — Всё настраивается флагами (`--level`, `--ua`, `--igsets`, `--concurrency`, `--delay`, `--max-content-length`…). **Подтверждено.**
- [SEVERITY: major] grab-site.md:151 — «Требует Python 2.7 или 3.x… нужен Chromium для некоторых фич». — Нужен строго Python 3.7/3.8 (ограничение wpull); Chromium не используется. **Подтверждено.**
- [SEVERITY: major] grab-site.md:23, 150 — «Brozzler с Redis» → RethinkDB (см. выше). **Подтверждено.**
- [SEVERITY: major] grab-site.md:129 — в таблице у Wget стоит «WARC: Нет». — wget поддерживает `--warc-file` с версии 1.14; это противоречит `tools/wget.md:29,126` и `httrack.md:94`. **Подтверждено.**
- [SEVERITY: minor] grab-site.md:61 — «создаст WARC в текущей директории». — grab-site создаёт отдельный каталог краула (`<host>-<date>-<id>/`) с WARC-файлами, `ignores` и прочими служебными файлами. **Подтверждено** (README).
- [SEVERITY: minor] grab-site.md:163 — «Документация (wiki)» — вики у репозитория выключена (`has_wiki: false`), ссылка редиректит на сам репозиторий. — Заменить на README.
- [SEVERITY: minor] grab-site.md:18 — «основной инструмент AT для срочных архиваций». — Основной инструмент Archive Team для срочных задач — ArchiveBot (через IRC); grab-site — его автономная альтернатива. **Вероятно.**

## heritrix.md

- [SEVERITY: critical] heritrix.md:33-38 — `wget …/releases/latest` скачает HTML-страницу, а следом идёт `tar -xzf heritrix-3.4.0-20201208-dist.tar.gz`, т. е. распаковка версии 2020 года. Скопированная команда не сработает. — Последний релиз — 3.18.0 (2026-10-06), ассет называется `heritrix-3.18.0-dist.tar.gz`. **Подтверждено.** — Дать прямую ссылку на `releases/download/3.18.0/heritrix-3.18.0-dist.tar.gz` или формулировку «скачайте последний `*-dist.tar.gz`».
- [SEVERITY: critical] heritrix.md:46, 131 — `./heritrix` без аргументов. — Опция `-a/--web-admin` помечена в `Heritrix.java` как «REQUIRED», без неё процесс не стартует; бинарник лежит в `bin/heritrix`. **Подтверждено.** — `$HERITRIX_HOME/bin/heritrix -a admin:пароль`.
- [SEVERITY: major] heritrix.md:54 — `./heritrix -a admin:admin -j job-name -c crawl-order.xml`. — `-j` означает каталог заданий (jobs-dir), а не имя задания; `-c` — это `--checkpoint`, а не конфиг. `crawl-order.xml` — терминология Heritrix 1; в H3 используется `crawler-beans.cxml`. Для запуска одного задания есть `-r/--run-job`. **Подтверждено.**
- [SEVERITY: major] heritrix.md:26 — «Java 8 или выше». — В getting-started.rst: «Heritrix requires Java 17 or later». **Подтверждено.**
- [SEVERITY: major] heritrix.md:49 — `http://localhost:8443`. — Интерфейс работает только по **https** (`https://localhost:8443/`, самоподписанный сертификат). **Подтверждено.**
- [SEVERITY: major] heritrix.md:59-80 — пример XML: бин `CrawlController` с `<property name="seeds">` — так не работает; в H3 сиды задаются через `TextSeedModule` (`seeds.textSource`) в `crawler-beans.cxml`. Пример не загрузится. **Вероятно** (по документации бинов). — Заменить на фрагмент дефолтного профиля `profile-crawler-beans.cxml`.
- [SEVERITY: major] heritrix.md:93 — `org.archive.modules.deciderules.DomainDecideRule` — такого класса нет; есть `org.archive.modules.deciderules.surt.OnDomainsDecideRule` / `NotOnDomainsDecideRule`. **Подтверждено** (дерево исходников heritrix3).
- [SEVERITY: minor] heritrix.md:107 — у Wget в колонке формата стоит «Файлы», хотя wget пишет WARC (см. grab-site). — Исправить.
- [SEVERITY: minor] heritrix.md:150-152 — «Официальный сайт» ведёт на GitHub, документация — на wiki. — Основная документация теперь на `heritrix.readthedocs.io` (README репозитория ссылается туда). Добавить её.
- Проверено и в порядке: `TooManyHopsDecideRule`/`maxHops`, `AcceptDecideRule`, `JAVA_OPTS`, группа `groups.google.com/g/heritrix-crawler` (200).

## hitomi-downloader.md

- [SEVERITY: major] hitomi-downloader.md:10 — ссылка `github.com/KurtBestor/Hitomi-Downloader` подана как рабочая. — `gh api` возвращает **HTTP 451 «Repository access blocked», reason: dmca**, блокировка с 2026-03-30 (уведомление `github/dmca/2026/03/2026-03-23-fakku.md`). Аудит утверждает, что ссылка заменена, но в этом файле (и в `youtube-dl-gui.md:36`) она осталась. **Подтверждено.** — Добавить предупреждение о блокировке и убрать или заменить ссылку; пересмотреть, нужна ли страница вообще.
- [SEVERITY: minor] hitomi-downloader.md:40-44 — пункт меню «File → Open URL list» и т. п. **Подозрение** (выдумано; без доступа к репозиторию не проверить). — Убрать конкретные пункты меню.
- [SEVERITY: minor] hitomi-downloader.md:10 — «GUI поверх yt-dlp / собственных экстракторов» — в основном собственные экстракторы; формулировка допустима.

## httrack.md

- [SEVERITY: critical] httrack.md:62, 68 — `-%p` описан как «Процент выполнения». — В man httrack: `-%p, --preserve` — сохранять HTML-файлы «как есть», **без переписывания ссылок**. Офлайн-просмотр сломается, т. е. эффект противоположен заявленному. **Подтверждено** (`httrack.man.html`). — Удалить флаг из примера.
- [SEVERITY: critical] httrack.md:136 — `httrack -c /path/to/output` для продолжения закачки. — `-cN` — число соединений; продолжение делается через `-i, --continue` (или `--update`), запуск из каталога проекта / с `-O`. **Подтверждено.**
- [SEVERITY: major] httrack.md:119-120 — `--max-files=10000` подразумевает «максимум файлов». — `-mN, --max-files` — это **максимальный размер** не-HTML файла в байтах; `-MN, --max-size` — общий объём в байтах (суффикс `500M` скорее всего не поддерживается — **подозрение**). **Подтверждено** (man). — Переписать: например, `-M500000000`, а для ограничения времени — `-E`.
- [SEVERITY: major] httrack.md:86 — `java -jar httrack2warc.jar /path/to/httrack/output output.warc`. — В README nla/httrack2warc: `httrack2warc [OPTIONS...] -o outdir crawldir`, jar называется `httrack2warc-shaded-<ver>.jar`; готовые jar лежат в Releases, так что `mvn package` не обязателен. **Подтверждено.**
- [SEVERITY: minor] httrack.md:149 — `httrack.com/html/help.html` → 404. **Подтверждено.** — Заменить на `https://www.httrack.com/html/httrack.man.html` или `fcguide.html` (обе 200).
- [SEVERITY: minor] httrack.md:47 — «Запустите httrack и следуйте мастеру» (как GUI). — `httrack` без аргументов запускает текстовый мастер в консоли; GUI — это WinHTTrack (Windows) и WebHTTrack (`webhttrack`, Linux/macOS). — Уточнить.
- [SEVERITY: minor] Пробел: не сказано, что HTTrack фактически не развивается (последний релиз 3.49.2, 2017). **Вероятно.** — Добавить предупреждение и раздел «когда не использовать».

## hyphe.md

- [SEVERITY: critical] hyphe.md:11 — мусор: `(или [H"И"yphe / h2.monitor](#))` — бессмысленный текст с пустой ссылкой `#`. **Подтверждено.** — Удалить.
- [SEVERITY: major] hyphe.md:3, 11, 30-32, 62 — Hyphe подан как инструмент «построения онтологий доменов» с понятием «Актёр». — Сам проект описывает себя как «Websites crawler with built-in exploration and control web interface»; ключевое понятие — **web entity** (веб-сущность: страница, сайт, поддомен или их комбинация) со статусами IN/OUT/UNDECIDED/DISCOVERED. **Подтверждено** (README). — Переписать терминологию.
- [SEVERITY: major] hyphe.md:37-44 — установка `docker compose up -d` и адрес `http://localhost:6970/`. — По README сначала нужно скопировать `.env.example`, `config-backend.env.example`, `config-frontend.env.example`, затем `docker compose pull` и `up -d`. Адрес — `http://localhost:80/` (`PUBLIC_PORT=80`). **Подтверждено.**
- [SEVERITY: major] hyphe.md:72 — источник «Telegram #61» — в посте #61 Hyphe не упоминается. **Подтверждено.**
- [SEVERITY: minor] hyphe.md:50 — «Зарегистрировать проект в `hyphe-admin`» — отдельного компонента с таким именем нет; корпус создаётся прямо в веб-интерфейсе. **Вероятно.**
- [SEVERITY: minor] hyphe.md:60-62 — «Готовый JSON с онтологией». — Экспорт — это список веб-сущностей (CSV/JSON) и сеть (GEXF) для Gephi. **Вероятно.** — Уточнить. Не указаны лицензия (AGPL-3.0) и Scrapy/MongoDB-архитектура.

## internet-archive-cli.md

- [SEVERITY: critical] internet-archive-cli.md:247-262, 39 — команды `ia wayback save|check|versions` и «интеграция с Wayback с версии 1.0+». — Подкоманды `wayback` у `ia` **нет**: в ia 5.11.1 команда даёт «invalid choice: 'wayback'». Есть только account, configure, copy, delete, download, flag, list, metadata, move, reviews, search, simplelists, tasks, upload. **Подтверждено.** — Удалить раздел; для SPN использовать `curl https://web.archive.org/save/…` или SPN2 API. Та же ошибка в `landscape-2026.md:219`.
- [SEVERITY: critical] internet-archive-cli.md:238-244 — `ia create …` → «invalid choice: 'create'». Item создаётся первой командой `ia upload`. **Подтверждено.**
- [SEVERITY: major] internet-archive-cli.md:17, 47, 361 — «Загрузить WARC на archive.org для публичного доступа **через Wayback Machine**». — WARC, загруженные обычным пользователем, попадают в item как файлы, но в индекс Wayback не попадают (это делается только для коллекций партнёров и доверенных коллекций). **Вероятно** (широко известное ограничение; официальную страницу не нашёл). — Переформулировать, чтобы у пользователей не было ложных ожиданий.
- [SEVERITY: major] internet-archive-cli.md:124-125 — `IA_ACCESS_KEY` / `IA_SECRET_KEY`. — В `internetarchive/config.py` переменные называются `IA_ACCESS_KEY_ID`, `IA_SECRET_ACCESS_KEY` (и `IA_CONFIG_FILE`). **Подтверждено.**
- [SEVERITY: major] internet-archive-cli.md:146, 152 — `--num-found 20` как «лимит». — `-n, --num-found` — «Print the number of results to stdout», флаг без значения. **Подтверждено.**
- [SEVERITY: major] internet-archive-cli.md:149, 199, 202, 212, 224 — флаги `search --json`, `metadata --json`, `metadata --field=title`, `metadata --json-file=`, `list --json` не существуют. Опции `ia metadata`: `--append`, `--append-list`, `--modify`, `--remove`, `--spreadsheet`, `--formats`, `--exists`…; опции `ia list`: `--all`, `--columns`, `--format`, `--glob`, `--location`, `--verbose`. `-f/--field` есть только у `search`. **Подтверждено** (`--help`).
- [SEVERITY: major] internet-archive-cli.md:186 — `--dest-dir` → правильно `--destdir`. **Подтверждено.**
- [SEVERITY: major] internet-archive-cli.md:68-73 — `ppa:internetarchive/ppa` (Launchpad 404) и `yay -S internetarchive` (пакет AUR `internetarchive` — 404). **Подтверждено.** — Удалить; оставить `pipx install internetarchive` и `brew install internetarchive` (формула существует).
- [SEVERITY: major] internet-archive-cli.md:95-97 — «Python 3.8+» и зависимости «docopt, jsonschema, six, yargs». — Requires-Python `>=3.10`; зависимости — `requests`, `tqdm`, `urllib3`, `jsonpatch`. `yargs` — вообще JavaScript-библиотека. **Подтверждено.**
- [SEVERITY: minor] internet-archive-cli.md:172-173 — `--no-derive` подписан как «С прогрессом», хотя флаг отключает derive-обработку. **Подтверждено.**
- [SEVERITY: minor] internet-archive-cli.md:231 — `ia delete my-archive/archive.warc.gz` → синтаксис `ia delete <identifier> <file>`. **Вероятно.**
- [SEVERITY: minor] internet-archive-cli.md:215 — `--remove=subject` — у ia формат `--remove=KEY:VALUE`. **Вероятно.**
- [SEVERITY: minor] internet-archive-cli.md:243, 393-399, 344, 403-407 — `mediatype:web` и `collection:ruarxive` поданы как то, что может поставить любой пользователь («Создайте свою коллекцию»). Обычные пользователи не могут грузить в чужие коллекции, а коллекции создаёт персонал IA; `mediatype=web` тоже ограничен. **Вероятно.** — Добавить оговорку («по договорённости с IA»).
- [SEVERITY: minor] internet-archive-cli.md:20, 27, 33, 441, 421 — «40+ млн items», «50 ГБ максимум на item», «автоматически chunked, с возобновлением» — цифры и поведение без источника. **Подозрение.** — Сверить с `archive.org/developers` или убрать.
- Проверено и в порядке: `ia upload --metadata`, `--no-derive`, `ia download --format`, `ia delete --all`, `ia configure`, Python API `get_item`/`upload`/`search_items`/`modify_metadata`, репозиторий `jjjake/internetarchive`.

## monolith.md

- [SEVERITY: critical] monolith.md:149, 216 — `monolith -c "session=abc123; auth=xyz789"` и в таблице «`-c, --cookie`». — `-c` — это `--no-css`; куки передаются только файлом: `-C, --cookie-file cookies.txt` (формат Netscape). Скопированная команда молча выбросит CSS. **Подтверждено** (`src/main.rs`, README).
- [SEVERITY: critical] monolith.md:37, 43, 162, 168, 174, 180, 217, 227-233 — выдуманы флаги `--proxy-host`/`--proxy-port`, `-s/--sanitize`, `-r/--replace`, `-e/--extract` (`-e` на деле `--ignore-errors`), `-t/--transform` (`-t` на деле `--timeout`), `-a/--allow-attributes` (`-a` на деле `--no-audio`), `-l/--language`. Кроме того, `-i` — это `--no-images`, а не `--isolate` (isolate — `-I`). — Реальный список: `-a -b -B -c -C -d -D -e -E -f -F -h -i -I -j -k -m -M -n -o -q -t -u -v -V`. Прокси задаётся через переменные окружения `https_proxy`/`http_proxy` (README, строка 273). **Подтверждено.** — Переписать таблицу флагов и примеры.
- [SEVERITY: major] monolith.md:94-101 — скрипт ищет в HTML `releases/latest` архив `…linux…x86_64….tar.gz`. — Ассеты v2.11.3 — голые бинарники `monolith-linux-x86_64`, `-aarch64`, `-armhf`, `monolith.exe`, без tar.gz; к тому же список ассетов давно не рендерится в HTML этой страницы. **Подтверждено.** — `curl -L -o /usr/local/bin/monolith https://github.com/Y2Z/monolith/releases/latest/download/monolith-linux-x86_64 && chmod +x …`.
- [SEVERITY: major] monolith.md:330 — `crates.io/crates/monolith-cli` → 404 (неверная замена из аудита). Правильно `crates.io/crates/monolith` (200; README: `cargo install monolith`). **Подтверждено.**
- [SEVERITY: major] monolith.md:243 — «monolith (Python) — неофициальный Python-биндинг (Y2Z)» со ссылкой на сам Rust-репозиторий. Такого биндинга нет; это остаток галлюцинации `monolith-software/monolith-py`. **Подтверждено.** — Удалить строку.
- [SEVERITY: major] monolith.md:281 — `warc-tools -i /tmp/page.html.gz -o archive.warc.gz` — такой утилиты/CLI нет (аудит признал `internetarchive/warc-tools` галлюцинацией). **Подтверждено.** — Удалить или заменить на `warcio` (Python, `WARCWriter`).
- [SEVERITY: minor] monolith.md:105-109 — `ghcr.io/y2z/monolith`: в README образ собирается локально (`docker build -t y2z/monolith .`), о публикации на ghcr не сказано. **Вероятно.**
- [SEVERITY: minor] monolith.md:39, 60, 319 — «Cookies через заголовки» → через cookie-файл `-C`.
- [SEVERITY: minor] monolith.md:42 — «TUI-режим» — в проекте есть опциональный **GUI** (`src/gui.rs`), а не TUI. **Подтверждено.**
- [SEVERITY: minor] monolith.md:290-296 — «Без таймаута может висеть» — у monolith дефолтный таймаут 60 с (`value_name = "60"`). **Подтверждено.**
- [SEVERITY: minor] monolith.md:71, 80 — «Debian/Ubuntu (AUR…)» — AUR относится к Arch; `nix-env -i monolith` → в README `nix-env -iA nixpkgs.monolith`.
- [SEVERITY: minor] Пробел: не упомянут вывод в **MHTML** (`-m`), который важен для архивистов; не указана лицензия (CC0-1.0).

---

## Сквозные проблемы (за пределами файлов части A, найдены попутно)

- «Brozzler + Redis» тиражируется в `instruments/landscape-2026.md:61` и `instruments/tools/index.md:27,65,125,159`. Нужно заменить на RethinkDB.
- `instruments/tools/youtube-dl-gui.md:35-37` — те же ошибки, что в dvd/firedm/hitomi (dsheeler525/dvd + macOS, FireDM «PyQt», ссылка на DMCA-заблокированный Hitomi).
- `similar/common-crawl.md:98-243` — выдуманные `duckdb_web_archive_cdx`/`cdx_cc()`.
- `users/inspect-warc.md:391` — `pip install duckdb-warc` (пакета нет).
- `instruments/landscape-2026.md:219` — несуществующий `ia wayback`.
- Conifer (закрыт в июне 2026) рекомендуется в `guides/quick-start-5min.md`, `guides/emergency-archiving.md`, `replay/memento.md`, `landscape-2026.md`.
- Ссылки «Источник: Telegram #61» на страницах archivespark и hyphe выдуманы: пост #61 — только про metawarc, CDX Summary и SolrWayback. Стоит проверить все страницы с «Источник: Telegram #N».

---

## Топ-10 самых серьёзных проблем

1. **duckdb-warc.md:28-190** (и `similar/common-crawl.md`) — SQL-раздел нерабочий: `INSTALL duckdb_warc FROM community` не существует, колонки (`url`, `length`, `response_code`) не совпадают с реальными (`target_uri`, `content_length`, HTTP-статуса нет), CDX-расширение и функции `cdx_ia`/`cdx_cc` выдуманы (реальное — `web_archive` с `wayback_machine()`/`common_crawl_index()`), проект ошибочно приписан Common Crawl.
2. **dvd.md:10-41** — страница описывает несуществующее macOS-приложение (репозиторий 404, brew-cask 404). Реальный `yausername/dvd` — Android-приложение; это противоречит `dto-youtube.md`.
3. **cdx-summary.md:11-45** — репозиторий 404, инструмент описан как Node.js с выдуманными флагами. Реальный: `internetarchive/cdx-summary`, Python, `pip install cdxsummary`, команда `cdxsummary`.
4. **brozzler.md (вся страница) + KB-сквозняк** — «Redis» вместо RethinkDB; `brozzler-new-job URL`, `--config`, `--warcprox-address`, `--max-concurrent-tabs` не существуют.
5. **auto-archiver.md:13-253** — подкоманды `auto-archiver run` нет, имена модулей и схема `config.yaml` выдуманы (реально: `orchestration.yaml` и `steps`), `browsertrix_url` нет (WACZ делается через локальный docker), `last_updated` в будущем.
6. **internet-archive-cli.md:238-262** — несуществующие `ia wayback …` и `ia create`, неверные env-переменные, несуществующие флаги (`--json`, `--field`, `--dest-dir`, `--json-file`), ложное обещание, что загруженные WARC появятся в Wayback.
7. **monolith.md:149-233** — `-c` в примере на деле `--no-css` (куки задаются `-C file`), выдуманы `--proxy-host`, `-s`, `-r`, `-e`, `-t/--transform`, `-a`, `-l`; скрипт установки бинарника и ссылка на crates.io (`monolith-cli`, неверная замена аудита) не работают.
8. **browsertrix.md:34-163** — volume `/crawl/data` вместо `/crawls` (WACZ теряется вместе с `--rm`), несуществующие `--cookies`, `--waitFor`, `--include-regex`, `clickAll`, выдуманный продукт «Browsertrix Desktop».
9. **heritrix.md:26-93** + **httrack.md:62,119,136** — команды установки и запуска Heritrix не работают (нет `-a`, http вместо https, Java 8 вместо 17, `-c` — это checkpoint, битый tar 3.4.0, `DomainDecideRule`); в HTTrack `-%p` отключает переписывание ссылок, а `-c` — число соединений, не resume.
10. **archivebox.md:22,162,189,193** + **grab-site.md:41-114** — ложное «ArchiveBox не пишет WARC» и «поиск только по метаданным», выдуманные `SAVE_CHROME` и `remove --older-than`; у grab-site не существует ни `pip install grab-site`, ни `--dashboard`, ни `grab-site-dashboard`, ни `--ignore-regex`, ни конфиг-файла.

Также заметно: gallery-dl (`--rate` и `--jobs` не существуют, неверный формат и путь конфига, `oauth:twitter`, Pushshift), FireDM и Hitomi (ссылки 404/451 DMCA, проекты заброшены или заблокированы, но поданы как живые), hyphe.md:11 (мусорный текст), archive-ph.md (Conifer закрыт, мусор кодировки, нерабочий скрипт массовой архивации), ложные ссылки на Telegram #61 (archivespark, hyphe).
