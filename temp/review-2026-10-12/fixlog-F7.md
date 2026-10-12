# Журнал исправлений F7 (2026-10-12)

Зона: `kb/legal/*`, `kb/faq.md`, `kb/intro.md`, `kb/glossary.md`, `kb/similar/*` (12 файлов), `kb/guides/{index,quick-start-5min,emergency-archiving,wget,custom-workflows,preflight-checklist,collection-strategies}.md`.

Во всех 26 файлах: frontmatter с `title`, `description`, `last_updated: 2026-10-12`; чётное число ```; нет голых `{ } <` вне кода; все внутренние ссылки `/kb/...` указывают на существующие страницы (проверено скриптом); GitHub-алерты `> [!...]` заменены на `:::warning/:::note/:::tip`.

## Проверочная база

- Telegram: `~/Downloads/Telegram Desktop/Archives/result.json` — посты #3–#6, #8, #11, #14, #16, #20–#22, #27, #28, #31, #33, #39, #51, #52, #89, #105, #113, #138, #145, #154, #175, #177, #180, #182.
- archive.org: `metadata`/`advancedsearch` — коллекция `ruarxive` не существует; есть `@ruarxive`, `echo-of-moscow` (446 записей), `achgovru-checks`; `russian-independent-media-archive` — нет.
- Установлены и проверены `--help`: wget 1.25.0 (реальные тестовые WARC-сборы на example.com), ia 5.11.1, warcio 1.8.1, cdx_toolkit (живой запрос к CC), apibackuper 1.0.13, filegetter 1.1.0, tgarc 0.1.4 (из git), wparc 1.0.8 (PyPI) и wparc из git.
- README/доки через `gh api`: tgarc, apibackuper (+docs/commands, configuration, use-cases), wparc, filegetter, cdx_toolkit, duckdb-web-archive, cc-index-table (схема), browsertrix-crawler (cli-options, behaviors, browser-profiles, rate-limits), brozzler, scoop, authsign, pastpage и др.
- Web: blog.archive.org (1 трлн страниц, окт. 2025), rima.media/bard.edu/pen.org (RIMA), список нежелательных организаций (Минюст, Википедия, Интерфакс), eotarchive.org/about, sucho.org (+workflow), climatemirror.org, perma.cc/docs/developer, commoncrawl.org/get-started и data.commoncrawl.org (CC-MAIN-2026-39), blog.conifer.rhizome.org, ndsa.org, спецификация WARC 1.1 (IIPC), Great 78 (мировое соглашение 09.2025).

## По файлам

### kb/legal/index.md
- Убрано «архивация общедоступных материалов не преследуется». Вместо — раздел о том, что общедоступность ≠ законность: ст. 1270/1273–1280 ГК, ст. 10.1 152-ФЗ, ст. 20.33 КоАП / 284.1 УК, ст. 20.29 КоАП, ст. 272.1 УК (с 11.12.2024); запрет обхода технических средств (ст. 1299 ГК, ст. 272 УК), рекомендация юриста.
- Добавлены единый срок «рассматриваем запрос и отвечаем в течение 10 рабочих дней» и дисклеймер «не юридическая консультация».

### kb/legal/copyright.md
- Убран тезис «размещённое правообладателем в открытом доступе (соцсети) можно архивировать без разрешения»; добавлено: запись в память ЭВМ = воспроизведение (пп. 1 п. 2 ст. 1270), публичная доступность ≠ разрешение.
- П. 6 ст. 1259 описан точно (официальные документы и сообщения о фактах, а не сайты госорганов целиком).
- Добавлен раздел «Свободное использование»: ст. 1274 и ст. 1275 с оговоркой об ограниченности; fair use — доктрина США.
- Исправлено противоречие «не размещаем материалы»: часть WARC/ZIP публична на cdn.ruarxive.org и в IA; лицензия CC BY 4.0 — на тексты сайта (по подвалу `docusaurus.config.js`), не на архивированные материалы.
- Единый срок 10 рабочих дней.

### kb/legal/personal-data.md
- Ст. 10 → ст. 10.1 152-ФЗ (с 01.03.2021): отдельное согласие на распространение, ч. 2 ст. 10.1 (бремя доказывания); прямо сказано, что подход «опубликовал сам — можно без согласия» не действует; ст. 10 — спецкатегории; ст. 272.1 УК.
- «Какие данные мы НЕ собираем» переформулировано в «Чего проект не делает» + оговорка, что DTO-инструменты в KB — для личных копий и не входят в публичные коллекции (снято противоречие с tgarc/экспортом чатов).
- «Прямой доступ к полным архивам — по запросу» убрано (противоречило публичным ссылкам).
- 30 календарных дней → «рассматриваем запрос и отвечаем в течение 10 рабочих дней».

### kb/legal/terms-of-service.md
- «robots.txt не применим к исследовательскому сбору» → позиция проекта (по умолчанию соблюдаем; исключения для госсайтов/ресурсов под угрозой — осознанно и документированно; это не обход защиты); RFC 9309.
- Убрана «серая зона … преследование редко»; порядок действий: официальные механизмы → оценка рисков/юрист → никогда не обходить защиту.
- «Telegram толерантен к API» → ограничения FloodWait и возможные блокировки.
- «Реальные риски» дополнены ст. 137, 272, 272.1 УК, ст. 20.33 КоАП / 284.1 УК.

### kb/faq.md
- «Работает с 2016 года» → каноническая хронология (2010-е / hubofdata 2016 / ruarxive.org 2017 / перезапуск и канал 03.03.2022).
- Убрано непроверяемое «не получаем государственного финансирования»; финансирование — ссылка на /about/donate.
- WARC/WACZ — точные определения; «Большинство метаданных — CC-BY» → CC BY 4.0 для текстов KB, права на материалы — у правообладателей.
- Новичку: Archive.ph / Save Page Now; копия сайта в WARC — wget-гайд или Browsertrix (вместо HTTrack без WARC).
- tgarc/wparc — ссылки на страницы KB; про `wparc warc` указано, что команда есть только в версии из GitHub (в PyPI 1.0.8 её нет — проверено).
- Правовой ответ про соцсети и 152-ФЗ переписан (ст. 10.1); 30 дней → 10 рабочих дней.

### kb/intro.md
- Добавлены `title`, `description`.
- «С 2016 года» → каноническая хронология + ссылки на историю проекта, stats-snapshot и реестр «Исчезающие российские ресурсы» (без общих цифр объёма/числа проектов).
- ISO 28500 → ISO 28500:2017 (WARC 1.1); уточнены WACZ и CDX.
- Ссылка на мёртвый timetravel.mementoweb.org (DNS не резолвится) заменена на страницу Memento.
- Пункт «Wget-гайд» переименован под новый гайд с WARC; «IA — блокировки, S3» → «коллекции, загрузка, API»; юридический абзац — CC BY 4.0 и ссылка на /kb/legal.

### kb/glossary.md (переписан с сохранением структуры)
- WARC 1.1: убраны «новые типы записей»; указаны доли секунды в WARC-Date и WARC-Refers-To-Target-URI / -Date (сверено со спецификацией IIPC).
- WACZ, подпись WACZ (`authsign`, Scoop вместо несуществующего `wacz-signer`), CDX (опечатка), CDXJ (дубль удалён), SURT, ARC (arc2warc из warctools), MHTML (убрано «IA использует как альтернативу WARC»), OAIS — уточнены.
- WARC-Safe → Национальная библиотека Люксембурга (не UNT); Crocoite → автор Lars-Dominik Braun, репозиторий в архиве (не «Crawliverse»); Conifer → фазы «twilight» (12.2025/05.2026/06.2026); удалены выдуманные Slim и Shovel, «Воздушная архивация».
- Добавлены Brozzler (RethinkDB, не Redis), ArchiveWeb.page, revisit-запись (профили, поля, первая копия остаётся response).
- PastPage оставлен (расширение существует, nabertronic/pastpage); Warchaeology → утилита Национальной библиотеки Норвегии; Wpull — заброшен (PyPI 2.0.1, 2016); Wget — WARC с 1.14; yt-dlp — не пишет WARC; Capture — убран yt-dlp как WARC-инструмент.
- Index: `cdxj-indexer` вместо `warc-indexer-cdxj`; AT Protocol: handle = доменное имя, DID `did:plc`/`did:web`.
- RFC 5023 → RFC 5005; добавлен RFC 9309; NDSA Levels — матрица 5 областей × 4 уровня, v2.0 (2019), v2.1 (03.2026).
- LockSSM → LOCKSS; UKWA ≠ UK Government Web Archive; ненаправленный архив — по #21 (не «фиксированный корпус»); fair use — доктрина США + ст. 1273–1280 ГК; 152-ФЗ — ст. 10.1.
- Memento-агрегатор: timetravel.mementoweb.org не отвечает → MemGator; «Хрупкий архив» — проект Музея «Гараж» (#52), а не термин.
- Второй раздел «Сообщества и организации» (список ссылок) переименован в «См. также»; опечатки исправлены.

### kb/similar/index.md
- Убрана самоссылка «Подробный список… в Похожих проектах (/kb/similar)».
- IA: 800+ млрд → более 1 трлн (октябрь 2025, блог IA). Common Crawl — ~2 млрд страниц/краул.
- Perma.cc: бесплатно через библиотеки-партнёры и суды; остальным — 10 пробных ссылок, затем подписка.
- Убраны: Conifer как «self-host» (вместо — :::note о закрытии), «archive.org.ua, archivalia», «BARD», «Telegram (3.7 млрд) → collection telegram».
- «Куда залить WARC: 1. Ruarxive» → собственное хранилище / IA / Kiwix + «у проекта нет открытого приёма загрузок, напишите в чат».
- Добавлены ссылки на все страницы раздела и принцип «лицензию назначает только правообладатель».

### kb/similar/internet-archive.md
- Удалены VPN (Lantern, Mullvad, Windscribe), Tor/onion-адрес v2, «Yandex ETVB», «решаемые через VPN». Вместо — нейтрально: история блокировок (10.2014, 06.2015, протокол РКН 05.2022 #51) + «используйте другие архивы / обратитесь к коллегам».
- Раздел RIMA удалён (RIMA — проект PEN America и Bard College, не IA; адрес на archive.org — 404). Короткое корректное упоминание перенесено в russian-independent-media-archives.md.
- `collection:ruarxive` (404) → реальные `collection:echo-of-moscow`, `@ruarxive`, `achgovru-checks`; команды `ia search --num-found/--itemlist`, `ia download --dry-run/--glob`, `ia upload --metadata=` сверены с ia 5.11.1 и выполнены на живой коллекции.
- Загрузка: `mediatype:data`, без `collection:ruarxive` и без CC0; добавлено, что загруженный WARC обычно не попадает в Wayback; лицензии — только правообладатель; госсайты ≠ общественное достояние (п. 6 ст. 1259).
- Добавлены: 1 трлн страниц; утечка 31 млн аккаунтов и DDoS (10.2024, #138); Hachette (апелляция 09.2024); Great 78 (~700 млн, #154; мировое соглашение 09.2025, дело прекращено 10.2025); анти-индексация госсайтов (#113). Убраны непроверенные «NYT/Reddit блокируют», «OAI-PMH», «rate limits против AI».

### kb/similar/russian-independent-media-archives.md (переписан; заголовок изменён на «Архивы закрытых и заблокированных российских СМИ»)
- Удалены выдуманные «Архив „Холода“» (+ `archive@holod.media`), «PEN Russia Archive», таблица «партнёрств» (Free Russia Foundation, ОВД-Инфо и др.), разделы по «Медузе», «Дождю» (в т. ч. ошибка «работает в Латвии»), IStories, «Новой газете — Европа».
- Удалены «Всегда выбирайте хостинг вне РФ» и «за пределами РФ, как правило, законно» → :::warning о ст. 20.33 КоАП / 284.1 УК / 20.29 КоАП и прямое «расположение сервера за пределами РФ эти риски не снимает».
- Добавлена таблица реальных медиаколлекций Ruarxive по постам: «Эхо Москвы» (#6, #8, #16), «Новая газета» (#31, #39), «Кабельщик» (#39).
- RIMA: корректно (PEN America + Gagarin Center при Bard College, запуск 2023, IA — технический партнёр) с пометкой «Bard College признан в РФ нежелательной организацией, 21.06.2021» (Минюст, Генпрокуратура); без гиперссылки.
- Битый Memento-агрегатор (timetravel) убран; `WARC-Target-Date` → `WARC-Date`; ссылка «создать запись» → форма.

### kb/similar/common-crawl.md (переписан)
- Удалены выдуманные `duckdb_web_archive_cdx`, `cdx_cc()`, `read_cdxj()`, `pip install duckdb-web-archive-cdx`, `warc-wat2links`, JSON-парсинг WET (WET — это WARC с записями conversion), ArchiveSpark-код.
- Реальное расширение: `INSTALL web_archive FROM community; ... FROM common_crawl_index() WHERE crawl_id=...` (README midwork-finds-jobs/duckdb-web-archive).
- Объёмы — с реальной страницы CC-MAIN-2026-39 (2,17 млрд страниц; WARC 82,8 ТиБ; WAT 14,2; WET 5,9; CDX 0,23; columnar 0,20). Было «CDX ~5 ТБ», «3–5 млрд».
- Идентификатор краула = ISO-неделя (CC-MAIN-2024-10 — первый в 2024; CC-MAIN-2024-04 не существует); ссылка на collinfo.json.
- Доступ: data.commoncrawl.org, `aws --no-sign-request`; HF — только зеркала отдельных краулов (по странице Get Started).
- cdx_toolkit: команды `cdxt` и Python API (`iter`, `filter=['=status:200']`) — проверены живым запросом. Athena-пример — по схеме cc-index-table (поля проверены). Ссылка `commoncrawl-crawler` (архивный краулер 2008–2012) → cc-pyspark.
- IA в сравнении: ARC/WARC (не WACZ), полнотекстового поиска по Wayback нет; 1 трлн страниц. Сценарий «за ноябрь 2026» удалён.

### kb/similar/perma-cc.md
- «Ссылки принимаются судами как доказательства» → используется для цитирования, допустимость решает суд.
- Регистрация: не «только организации» — любой получает 10 пробных ссылок, далее партнёр-registrar или подписка (блог Perma 2019/2021).
- API: `Authorization: ApiKey` (было Bearer), реальные эндпоинты из документации (archives, download WARC/WACZ, public/archives); удалены неофициальная Python-обёртка, выдуманные лимиты, `organization/<id>/archives`, непроверенные Memento-эндпоинты, «криптоподпись», «хранение Harvard+IA», «4 представления с размерами».
- «Сценарий 4. Судебное дело Ruarxive» переименован; добавлен нотариальный осмотр (ст. 102–103 Основ о нотариате) вместо «в РФ не имеет доказательной силы»; ссылка на contingency plan.

### kb/similar/international-archives.md
- webarchiv.ee (не резолвится) → veebiarhiiv.digar.ee (200).
- UKWA — шесть библиотек обязательного экземпляра (перечислены); UKGWA отдельно.
- Добавлены IIPC, Australian Web Archive/PANDORA (#33), Arquivo.pt, Webarchiv Österreich (#21), ссылка на список Википедии; KB — веб-архив + Delpher; убрана UNT (не национальный архив).
- «В Эстонии и Скандинавии обязательна по закону, в РФ — нет» → осторожная формулировка про законодательство об обязательном экземпляре (Великобритания, Франция).

### kb/similar/eot-archive.md
- Убраны «EDGI — координатор», «WARC + WACZ», бессмысленный лозунг, «сравнение» со ссылкой на главную. Партнёры, процесс (Nomination Tool UNT, Heritrix, BagIt), хранение и объёмы по циклам — по eotarchive.org/about; ~450 ТБ / >582 ТБ в IA — по #145.

### kb/similar/sucho.md
- «Петабайты», «AWS, ИТ-компании», «Manifest.json», «Slack + публичный GitHub» → данные сайта: >5 000 сайтов, ~50 ТБ, >1 500 волонтёров, оборудование для >70 учреждений; процесс по sucho.org/workflow (Wayback + Browsertrix Crawler/облачный Browsertrix → WACZ → QA в ReplayWeb.page; ArchiveWeb.page для сложных сайтов; хранение в AWS); сооснователи.

### kb/similar/datarefuge.md
- Убраны «18 датасетов на хакатоне 17.01.2017», «AV-секция IA», «ArchiveTeam помогала». Факты по публикациям: PPEH + Penn Libraries, старт 12.2016, ~50 событий DataRescue (12.2016–06.2017), первое — 17.12.2016 в Торонто, >400 наборов в репозитории, номинация в Wayback/EOT.

### kb/similar/climate-mirror.md
- Убраны ERA5/MERRA-2/GFS, IPFS, seedbox, NOAA/NASA/ESA и битая ссылка `/kb/instruments/tools/`. По climatemirror.org: волонтёры + UPenn, U Toronto, IA; зеркала и торренты; координация через GitHub/Slack; инструменты EDGI, Brozzler, Webrecorder.

### kb/similar/awesome-catalogs.md
- Удалены 404/ошибочные: mbtaylor/awesome-digital-preservation, awesomedata/awesome-open-data, jgoerner/awesome-government-data, openpreserve/open-source-archiving, «LoC» → diglib.org, «Web Archiving Community List» → web.archive.org/web/.
- Добавлены все ресурсы из #177: ruarxive/awesome-digital-preservation, digipres/awesome-digital-preservation, iipc/awesome-web-archiving, ArchiveTeam Wiki, KB Ruarxive (все проверены, 200). Смежные: dh-tech/awesome-digital-humanities, awesomedata/awesome-public-datasets, ivbeg/awesome-data-takeout.

### kb/similar/archiveteam.md
- Добавлены frontmatter-описание, оговорка о позиции ArchiveTeam vs правовая оценка в РФ, Wget-AT (реальное описание), WikiTeam и коллекция wikiteam (#180), ссылка на Warrior.

### kb/guides/index.md
- Добавлены preflight-checklist, collection-strategies, dynamic-ajax-sites, legal; убрано обещание «обход блокировок» в wget-гайде.

### kb/guides/quick-start-5min.md
- Wget-рецепт теперь пишет WARC (`--warc-file`, `--warc-cdx`) — команда выполнена на wget 1.25.0.
- Conifer (2 места) → ArchiveWeb.page / Browsertrix; для авторизации — только законный доступ, без обхода.
- archive.ph «Это навсегда» → дублировать в Wayback; убран бесполезный шаг DevTools; пути выгрузки Instagram/Facebook/X обновлены (Центр аккаунтов, x.com); пометка о Meta Platforms Inc.

### kb/guides/emergency-archiving.md
- Удалены «Используйте VPN или Tor», «работайте с анонимных аккаунтов», «не держите данные в одной юрисдикции», блок «Серая зона … польза перевешивает формальные ограничения». Новый блок «Этика и право»: обход авторизации/технических ограничений — «Нельзя»; материалы нежелательных/экстремистских — «требует осторожности»; ссылка на юриста.
- Выдуманный кейс «Эха Москвы» (HTTrack, yt-dlp, «173 ГБ за 2 дня», «полный архив», Telegram-группа) заменён описанием по #3, #5, #6, #8, #11, #16, #28, #39, #105.
- Непроверяемый кейс «блокировка Instagram» → реальный кейс #27 (171 аккаунт, instaloader, 1,4 ГБ, медиа частично). YouTube-пример помечен как типовой сценарий без выдуманного «результата».
- snscrape и Conifer убраны из рекомендаций (с пояснением); HTTrack-ссылка → страница инструмента; wget — WARC-гайд; повтор текста 2016 года сжат до абзаца со ссылками на кейсы; archive.ph как «доказательство» смягчено + нотариальный осмотр.

### kb/guides/wget.md (переписан)
- Сценарный гайд с WARC: весь сайт (`--warc-file`, `--warc-cdx`, `--warc-max-size`), только WARC (`--delete-after`), список URL, ограничения, span-hosts+domains, повторный сбор с `--warc-dedup` (revisit), прерванный сбор, `--warc-header`, проверка через `warcio check/index`.
- Все особенности проверены на wget 1.25.0: именование `-00000.warc.gz` и `-meta.warc.gz`; WARC отключает `-N` (в составе `--mirror`), `--no-clobber`, `--continue` (сообщения wget процитированы по смыслу); `--warc-dedup` создаёт revisit с `WARC-Refers-To`; `--delete-after` сохраняет WARC.
- Справочные таблицы опций, установка через Chocolatey и т. п. удалены — ссылка на `/kb/instruments/tools/wget` как канонический справочник. wpull: «JS-сайты» и `pip install wpull` убраны, указан статус (PyPI 2.0.1, 2016). User-Agent «притворяемся браузером» → честный UA; капча/антибот — не обходить.

### kb/guides/custom-workflows.md (переписан)
- `tgarc download --target … --incremental` → `tgarc configure` + `tgarc save … -o`, `--update`; вывод `<папка>/<канал>/messages.jsonl` (проверено по исходнику); предупреждение, что при `--update` в ту же папку файл перезаписывается.
- apibackuper: `run full -p`, `estimate full`, `validate-config`, `export FILE -p`, `run incremental` (режим существует: `project.work_modes` + `data.item_key`, docs/use-cases), `update`, `run full --resume`; YAML по шаблону `examples/templates/page-based.yaml` + `rate_limit` — валидирован `apibackuper validate-config`. Выдуманные `estimate incremental --since` удалены.
- wparc: `wparc ping/dump/getfiles` (код возврата ping проверен); filegetter: реальный `filegetter.cfg` (list + pattern + write_warc) — проверен `filegetter run --dry-run`; сайт — wget с WARC.
- Удалён постоянно работающий `schedule`-скрипт → cron; добавлена строка о версиях, по которым сверены команды.

### kb/guides/preflight-checklist.md
- «Государственный сайт — общественное достояние», «не нужно спрашивать: государственные сайты», «экстренная архивация (FAA-стиль)» → п. 6 ст. 1259; «срочность не даёт основания для публикации».
- Удалён пункт про VPN; добавлены пункты «статус ресурса» (нежелательные/экстремистские) и нейтральный «если ресурс недоступен — другие архивы/коллеги».
- Browsertrix: несуществующий `--userCookies` и экспорт cookies через DevTools → `create-login-profile` + `--profile`; описание behaviors исправлено по документации (autofetch ≠ клики; добавлен autoclick).
- Выдуманные `archive.su/archive-once.sh`, `watcher --on-change` удалены; CC0 в `ia upload` удалён; «Препарат-чеклист» → «Preflight-чеклист»; даты 2026-11-09 в примерах → 2026-10-12; Airtable «создать запись» → форма.

### kb/guides/collection-strategies.md
- Выдуманный YAML `behaviorOptions: limit/rate` для Browsertrix → реальные `--workers`, `--pageExtraDelay` + поведение на 403/429/503 (docs rate-limits). Пример wpull удалён.
- «depth=2–3 покрывает 90 %» и «depth=3 — все новости за год» удалены; таблица глубины помечена как очень приблизительная.
- Позиция по robots.txt/ToS согласована с terms-of-service.md (по умолчанию соблюдаем; антибот — не обходить, отказаться от сбора).
- «Архив «Медузы», «Дождя», «Новой»» → нейтральный пример; `/opt/ruarxive/` → `/opt/archive/`; GitHub-алерт → :::warning.

## Что не удалось подтвердить / решения на усмотрение владельца

- **RIMA** оставлен одним абзацем без гиперссылки, с пометкой о статусе Bard College. Если владелец не хочет упоминать проект с участием нежелательной организации — абзац можно удалить целиком.
- **Финансирование** (faq.md): утверждение «не получаем государственного финансирования» удалено как непроверяемое; формулировку о финансировании должен дать владелец.
- **Даты статусов**: в политике «Медуза» — 26.01.2023 (дата объявления); по списку Минюста решение Генпрокуратуры — 25.01.2023, включение — 07.02.2023. В моих файлах «Медуза» больше не упоминается. Для справки (по перечню Минюста/Википедии): IStories fonds — решение 22.02.2022 (в part-E ошибочно «2023»); Free Russia Foundation — 27.06.2019; «Новая газета Европа» — 26.06.2023 (решение), 14.07.2023 (включение); издатель «Троицкого варианта» — реестр иноагентов 24.03.2022 (DW). Статус «Холода», PEN America — не подтверждён/не найден; эти организации из моих файлов удалены (PEN America упомянута только как соорганизатор RIMA, без статуса).
- **Perma.cc**: Memento-эндпоинты не проверены (Cloudflare 403) — удалены; актуальные цены подписки не проверены — не указаны.
- **Hachette v. Internet Archive** (апелляция 09.2024) — по общеизвестным данным, первоисточник не открывался.
- Ст. 272.1 УК (с 11.12.2024, 421-ФЗ) — по part-E (confirmed там), текст закона не открывался.
- Common Crawl: обрезка больших ответов подтверждена только наличием поля `content_truncated` в схеме; лимит не указан. CDX Index API на момент проверки отвечал 504 (перегрузка) — формат URL стандартный.
- `wparc warc`/`wparc index`: есть только в версии из GitHub; в PyPI 1.0.8 команды отсутствуют, хотя README заявляет их для 1.0.8.

## Нужные изменения в чужих файлах / sidebars.js (для координатора)

1. `sidebars.js`: (а) `guides/index` подключён и как `link` категории, и как элемент списка (из сводного отчёта) — оставить только `link`; (б) `similar/index` не в сайдбаре — подключить как `link` категории «Похожие проекты»; (в) новые подписи: `guides/wget` → «Wget: сайт в WARC», `similar/russian-independent-media-archives` → «Архивы российских СМИ» (заданы в frontmatter, если в сайдбаре есть явные label — обновить).
2. `kb/instruments/tools/wget.md` (канонический справочник): синхронизировать с гайдом — при `--warc-file` wget сам отключает `-N` (входит в `--mirror`), `--no-clobber`, `--continue`; при `--warc-max-size` появляется `ИМЯ-meta.warc.gz`; robots.txt соблюдается по умолчанию (`-e robots=off`); не предустановлен в macOS; `--mirror` несовместим с `--no-clobber` («Can't timestamp and not clobber…» — проверено).
3. `kb/instruments/ruarxive-tools/wparc.md`: указать, что `wparc warc`/`index` — только в git-версии (`pip install git+https://github.com/ruarxive/wparc.git`), в PyPI 1.0.8 их нет.
4. `kb/instruments/ruarxive-tools/tgarc.md`, `dto-telegram.md`: вывод `<-o>/<канал>/messages.jsonl`; `--update` в ту же папку перезаписывает `messages.jsonl` — рекомендовать новую папку на каждый запуск.
5. `kb/instruments/downloaded-data/apibackuper*.md`, `case-studies/api-archiving-scale.md`: `apibackuper create` в 1.0.13 создаёт `apibackuper.cfg` (INI), хотя README говорит про `apibackuper.yaml`; YAML-файл в каталоге проекта читается (validate-config). Режим `run incremental` **существует** (нужны `project.work_modes` и `data.item_key`) — замечание part-E «run incremental нет» неточно; несуществующие — `estimate incremental --since`, `verify`.
6. `kb/instruments/replay/memento.md` и др.: timetravel.mementoweb.org не резолвится — предлагать MemGator (oduwsdl/MemGator).
7. `kb/projects/russian-smi.md`: на него ссылается моя страница — нужна правка статусов/фактов (Медуза, Дождь) по part-E.
8. `kb/about/project-history.md`, `resources/stats-snapshot.md`: на них ссылаются intro/faq — привести к канонической хронологии.
9. `README.md` говорит «MIT License», а `LICENSE` — Apache 2.0 (вне `kb/`, но противоречие видно пользователям).
