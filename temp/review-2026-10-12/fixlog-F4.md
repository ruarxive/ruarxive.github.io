# Журнал исправлений F4 (2026-10-12)

Зона: `kb/instruments/replay/*` (7), `kb/users/*` (5), `kb/guides/{warc-workflow,warc-deduplication,link-graph-analysis,dynamic-ajax-sites}.md` (4). Учтены замечания из part-C (основное), part-A (duckdb-warc, Conifer, browsertrix), part-B (PastPage, warchaeology, brozzler, warcprox) и сводного отчёта.

## Как проверялось

- venv `/tmp/venv-f4`: pywb 2.10.0, warcio 1.8.1, cdxj-indexer 1.5.0, wacz 0.6.0, warctools 5.0.1, waybackpy 3.0.6, metawarc 2.0.3, filegetter 1.1.0, duckdb 1.5.6, networkx 3.7. Бинарники: warchaeology 5.0.0 (`warc`), MemGator 1.0-rc9.
- Тестовый WARC собран через `warcio.WARCWriter` (HTML, PNG, повторный захват). На нём прогнаны **все** Python-скрипты и CLI-рецепты страниц inspect-warc, large-warc, link-graph (плюс фрагмент реального WAT CC-MAIN-2024-33), warc-workflow, warc-deduplication.
- pywb поднят локально: проверены `wb-manager init/add/--unpack-wacz`, `wayback -p`, CDX API (`output=json` = NDJSON, `filter=~url:`), TimeMap, TimeGate (`/coll/<url>`, `/coll/memento/<url>` → 404), конфиг коллекции через `index_paths`+`archive_paths` (ключ `resource:` из документации для кастомной коллекции дал 503 — в текст не включён), воспроизведение revisit-записей.
- `warc dedup` проверен: первая копия остаётся `response`, последующие → `revisit` с `WARC-Refers-To*`.
- Живые запросы: Wayback TimeGate/TimeMap (JSON — массив массивов), waybackpy CDX API, MemGator (агрегация IA + Arquivo.pt + archive.today), filegetter на `zapovednik.space/api/material?id=…` (JSON 200, записан WARC).
- Исходники/README через `gh api`: pywb docs (`usage/configuring/memento/cdxserver_api.rst`, Dockerfile), iipc/openwayback (README, pom.xml), oduwsdl/ipwb, iipc/warc2html (README, pom.xml), browsertrix-crawler (`argParser.ts`, `constants.ts`, docs dedupe/crawl-scope/profiles), brozzler (README, cli.py), warcprox (main.py), jwarc (WarcTool/DedupeTool), doppelganger, metawarc, filegetter, Hyphe, cc-webgraph, aut, MemGator (README + archives.json). Документация replayweb.page (docs, embedding, loading, offline-use, locations, sharing). DuckDB community `warc`.
- Пост #35 и #22 — из `~/Downloads/Telegram Desktop/Archives/result.json`.
- Все 86 внешних ссылок (вне код-блоков) проверены curl: 200, кроме `npmjs.com/package/replaywebpage` (403 — антибот сайта; пакет подтверждён через registry API). Внутренние ссылки (49) существуют. MDX-проверка скриптом: нет голых `{}`/`<буква` вне кода, число ``` чётное, CRLF нет.

## По файлам

### kb/instruments/replay/index.md
- Убрано «pywb используется Internet Archive»; вместо этого — рекомендация IIPC и примеры UKWA (`ukwa/ukwa-pywb`), Arquivo.pt (`arquivo/pywb`).
- Таблица по размеру заменена ориентирами без выдуманных порогов; для крупных коллекций — pywb + OutbackCDX + nginx (руководство IIPC), вместо OpenWayback + Hadoop.
- Таблица возможностей сведена с pywb.md: IPWB Memento ✅, OpenWayback Memento ✅, удалены «Аннотации» и «Mixed content», добавлен полнотекстовый поиск RWP (WACZ с текстом), строка статуса проектов, честная индексация.
- Раздел CDX/Memento: Memento — IETF RFC 7089, CDX API не стандарт. Убран неподтверждённый `playback.ruarxive.org`.

### kb/instruments/replay/pywb.md (переписан)
- `wb-manager init <coll>` + реальное дерево; `wb-manager add`, `--unpack-wacz`; `wayback` с `-p/-b/-a/--proxy/--record --live`; таблица команд.
- Docker: том `/webarchive`, `INIT_COLLECTION`, uWSGI по умолчанию.
- config.yaml: только реальные ключи (`enable_memento`, `framed_replay`, `autoindex`, `collections: {index_paths, archive_paths}`, `redirect_to_exact`, `collections_root`, `cdx_api_endpoint`, `recorder`), удалены `server:`, `recurse`, `auto_index`, `logging`, `default_collection`, `cache_proxy`, `max_request_size`.
- nginx — по образцу из docs (uwsgi_pass 8081); ссылки на `sample-deploy` и readthedocs вместо несуществующих wiki Deployment/Cookbook.
- CDX API: NDJSON, regex через `filter=~url:`; TimeGate `/coll/<url>` (200, Pattern 2.2; `redirect_to_exact`), реальный вывод TimeMap; исправлен день недели.
- Удалены «upload UI», «Surrogates», выдуманная таблица масштабирования (Redis/Hadoop); Redis — только для dedup в recorder. Удалена битая ссылка `cdx-1.1.1.html` → CDXJ 0.1.0.

### kb/instruments/replay/replayweb-page.md (переписан)
- webrecorder.io → webrecorder.net; удалены несуществующий Docker-образ, аннотации, Export Page, Timeline/Diff, URL-параметры `?theme/?debug`, «Memory limit», JS-API `$wb.loadWacz`, npm `@webrecorder/cdxj-indexer`, таблица времени открытия, совет `split` WACZ, совет «открыть по HTTP», CORS-Anywhere.
- Добавлено: WARC vs WACZ по docs (WARC читается целиком, WACZ — по Range), веб-компонент `<replay-web-page>` + `sw.js`, self-hosting, HTTPS-требование, схемы `s3://`/`googledrive://`/`ipfs://`, ссылки-шеринг, Desktop (.dmg/.exe/.AppImage, Ruffle), полнотекстовый поиск, форматы (ARC/WBN не поддерживаются).

### kb/instruments/replay/openwayback.md (добавлен frontmatter)
- `:::warning` о статусе (README: «no longer under active development», релиз 2.4.0 от 2019-05), ссылки на Transition Guide и пост IIPC.
- Удалены выдуманные XML-конфиги и «победитель по производительности»; требования: `javax.servlet` (Tomcat 10+ не подходит), Java 7 в pom.xml; CDX — через `cdxj-indexer -11`.

### kb/instruments/replay/ipwb.md (добавлен frontmatter)
- `ipwb index … > a.cdxj` / `-o`, `ipwb replay <cdxj>`, порт 2016, `--proxy` и требование HTTPS для Service Worker, Docker `oduwsdl/ipwb`, Python 3.9+, kubo вместо `apt install ipfs`, Memento ✅, docs.ipfs.tech.

### kb/instruments/replay/warc2html.md (добавлен frontmatter)
- Переписан: Java-jar (iipc/warc2html, © National Library of Australia, Apache 2.0), `mvn package` (JDK 17+), `java -jar warc2html.jar -o output/ input.warc.gz`, `-b`, `--cdx-server`, реальные правила именования (`index.html`, `~1`), ограничения из README; удалены npm и несуществующая wiki.

### kb/instruments/replay/memento.md (переписан)
- 4 типа URI; Accept-Datetime только HTTP-date; реальные ответы TimeGate/TimeMap IA; JSON TimeMap — массив массивов.
- `:::warning` TimeTravel (нет DNS) → MemGator (проверен CLI, JSON-формат, `/api`-совместимость).
- Таблица TimeGate/TimeMap по `archives.json` MemGator (archive.today `/timegate/`).
- Исправлены Python-код (RFC 1123, разбор массива) и waybackpy (`WaybackMachineCDXServerAPI`, проверено живым запуском).
- Удалены «Memento Pattern»-заголовок, TimeBundle, Rescue Time Machine, mementofoundation, httpbis; верный ID расширения Chrome; PastPage — реальное расширение (ссылки из part-B, проверены); Conifer — закрыт как сервис записи с июня 2026; OpenWayback ✅.

### kb/users/index.md
- Добавлены title/description; убрано «большинство — CC-BY 4.0» (согласовано с legal/copyright.md: CC BY только на тексты, права на материалы у правообладателей), убрано «IA часто только HTML»; добавлены ссылки на inspect-warc, large-warc, allarchives.csv.

### kb/users/open-warc.md
- Добавлены title/description; WebRecorder Desktop (архивирован 2021) → ReplayWeb.page Desktop; исправлена нумерация шагов; «PyWebWayback» → warcio; `warcfilter -U … > subset.warc`; уточнено про warcinfo/metadata; размер «Эха» — 186 234 035 346 байт (~173 ГиБ).

### kb/users/citation.md
- URL WARC: CDN (404) → Backblaze (200). Название приведено к «Национальный цифровой архив (Ruarxive)», добавлены дата обращения, SHA-256, формат по ГОСТ Р 7.0.100–2018, BibTeX без нестандартного `organization`, с `url`/`urldate`. Лицензия — по legal/copyright.md. Убрано неподтверждённое «добавим в каталог использования».

### kb/users/large-warc.md (переписан)
- Удалены бенчмарки, `warc-indexer-cdxj`, `warcfilter --url-prefix -o`, `wacz --split-size/--filename`, `cdxj-indexer huge.wacz`, `duckdb_warc`/`read_warc` с выдуманными колонками, `recurse`/Redis в pywb, «Ruarxive обслуживает ~0,5–1 ТБ», «pywb с Redis обязателен».
- `:::danger` против байтовой нарезки; скрипт разбиения по границам записей (проверен), `cat` для склейки; потоковое чтение `read(n)`; CDXJ/CDX11 через cdxj-indexer; JSON-индекс через `warcio index` + DuckDB (проверено); `warcio extract` по смещению; под-WARC через `writer.write_record`; IA `id_` (не WARC), исправленный цикл скачивания.

### kb/users/inspect-warc.md (переписан)
- Удалены `warc-headers`, `wb-grep`, `warcdump --headers-only`, `warcfilter --records/--pattern/--content-type -o`, `warc-indexer-cdxj`, «CDXJ = JSON Lines», «ускорение в 100–1000 раз», «warcio склеивает continuation», `pip install warchaeology/duckdb-warc`, `warc-validate`, пример «вывода warcdump».
- Добавлены рецепты warcio index + jq, zgrep, `warcio extract --payload/--headers`, `warc ls/validate` (warchaeology), корректный warcfilter, все Python-скрипты переписаны и прогнаны (в т. ч. потоковая выгрузка, rg → URL).

### kb/guides/warc-workflow.md
- warcvalid — из warctools; добавлены `warcio check`, `warc validate`, `jwarc validate`; `pip install cdxj-indexer`; ссылка CDXJ 0.1.0; удалён «CDXJ через warcio» и тезис про поиск по словам.
- metawarc — реальные команды (`index`, `stats`, `index-content --type links`, `analyze links`, `export-cdxj`), проверены; удалён «обогащённый WARC».
- Удалена ручная сборка WACZ; `wacz create -o … --detect-pages --title --desc` + `wacz validate` (проверено); WACZ-спека 1.1.1.
- Browsertrix: `-v $PWD/crawls:/crawls/`; pywb: `wb-manager init/add --unpack-wacz`, `wayback`.
- Удалены `split` WACZ, псевдоконфиги CloudFront/Cloudflare, таблица цен, «Ruarxive использует WACZ на CDN + CDXJ рядом», «CDXJ — JSON Lines».

### kb/guides/warc-deduplication.md (переписан)
- Правильная семантика revisit (первая копия — оригинал, `WARC-Refers-To*`, профили 1.0/1.1, server-not-modified) с реальным выводом `warc dedup`.
- Реальные инструменты: Browsertrix (`--redisDedupeUrl`, с 1.12), warcprox (`--dedup-db-file`), pywb recorder `dedup_policy`, `warc dedup -w`, `jwarc dedupe`, doppelganger (WIP); оценка через `metawarc analyze duplicates` и DuckDB по индексу (проверено).
- Удалены `warc-dedup`, конфиг `dedup:` pywb, SimHash в pywb, кейс «Эхо 173→80 ГБ», `tgarc.dedup`, сценарий `ia upload` + «IA поддерживает revisit», ссылка на архивный commoncrawl-crawler, выдуманные метрики, антипаттерн «брать самую свежую».

### kb/guides/link-graph-analysis.md (переписан)
- Структура WAT по реальному файлу CC-MAIN-2024-33 (`Envelope → Payload-Metadata → HTTP-Response-Metadata → HTML-Metadata → Links`, ключи `path/url/text/rel`), рабочий парсер.
- Удалены `wbui` в pywb, образ `medialab/hyphe`, Java-код WebGraph, igraph→GEXF, «Facebook в 4 ГБ», цифры памяти NetworkX, плейсхолдер ESGI, битая `gephi.org/tutorials`, дата 2026-11-09.
- Добавлены metawarc `analyze links`, Archives Unleashed Toolkit, графы Common Crawl (cc-webgraph), Hyphe по README (Docker Compose, `HYPHE_WEBARCHIVES_OPTIONS`), webgraph-rs; исправлен детектор однотипных ссылок; Louvain из NetworkX; весь код проверен.

### kb/guides/dynamic-ajax-sites.md (переписан)
- Кейс zapovednik.space — по посту #35 (медиа «Заповедник | Россия за пределами столиц», `/material/<id>`, JSON `/api/material?id=…`, два подхода).
- Browsertrix: том `/crawls`, `--scopeType prefix` (верная семантика page/page-spa/host), `--pageLoadTimeout`, `--postLoadDelay`, `--pageExtraDelay` (после behaviors), `--behaviors`.
- Brozzler — Python + RethinkDB + warcprox, реальные `brozzle-page`/`brozzler-new-job`/`brozzler-new-site`.
- filegetter — INI `filegetter.cfg` + `filegetter run` (проверено, в т. ч. `write_warc`).
- Убран `ruarxive/warcworker` (404) и «слить через warc2zim»; склейка через `cat`. `ikreymer/pywb` → внутренняя ссылка. warc-gpt убран из «полнотекстового поиска». Дубль metawarc удалён. Совет про авторизацию — без обхода защиты, со ссылкой на legal. Пост #22 описан по фактическому содержанию.

## Что не удалось проверить / оставлено осторожно

- **warc2html** — не запускался (нет Java на машине); сверено только с README и pom.xml.
- **jwarc validate/dedupe**, **doppelganger**, **Brozzler**, **Hyphe**, **ipwb**, **OpenWayback** — не запускались; команды взяты из README/исходников.
- **archive.today TimeGate** — живой запрос дал 429; адрес взят из `archives.json` MemGator, в тексте оговорено, что список может устаревать.
- **Wayback Machine Availability API** через waybackpy вернул пустой ответ — в пример не включён (только CDX API).
- **ReplayWeb.page и revisit-записи** — не проверялось, утверждение не делается (проверен только pywb).
- **ГОСТ Р 7.0.100–2018** — образец составлен по общей схеме стандарта, текст стандарта в сессии не открывался; в тексте оговорка «проверьте требования журнала/вуза».
- Документация pywb для кастомной коллекции (`index` + `resource`) на практике не работает (503) — использован проверенный вариант `index_paths` + `archive_paths`.

## Нужно в чужих файлах (для координатора)

- `kb/projects/echomsk.md` — пишет «около 176 ГБ, в т. ч. WARC 173 ГБ». Предлагаю единообразно: «WARC 186 234 035 346 байт (≈173 ГиБ)», как уже в строке 29 того же файла.
- `kb/instruments/file-formats/cdx.md`, `wacz.md` — используют варианты pywb/wacz/CDXJ, которые противоречат исправленным pywb.md и warc-workflow.md (`wb-manager index /path`, `wacz create dir/`, `--description`, CDXJ без timestamp). Каноника: `wb-manager init <coll>` + `wb-manager add <coll> files…`; `wacz create -o out.wacz files… --desc`; CDXJ = `SURT TIMESTAMP {json}`.
- `kb/instruments/tools/duckdb-warc.md`, `warchaeology.md`, `waybackpy.md`, `pastpage.md`, `browsertrix.md` — на них ссылаются мои страницы; если там остались `pip install duckdb-warc`, `warc-dedup`, `WaybackMachine`, том `/crawl/data` — это будет противоречить моим страницам.
- `kb/glossary.md`, `kb/intro.md` — по part-B там ещё «PastPage — концепт без реализации»; в memento.md PastPage теперь описан как реальное расширение.
- `kb/guides/quick-start-5min.md`, `kb/guides/emergency-archiving.md`, `kb/instruments/tools/archive-ph.md` — рекомендуют Conifer (закрыт с июня 2026).
- В git-индексе удалены `kb/users/_category_.json`, `kb/instruments/replay/_category_.json`, `kb/guides/_category_.json` (статус `D `) — это сделал не я; проверьте, что так задумано, иначе пропадут подписи/порядок разделов в сайдбаре.
- `sidebars.js` правок не требует (файлы не создавались и не переименовывались).
