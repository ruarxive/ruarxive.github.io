# Ревью БЗ, часть C: форматы, replay, users, WARC-гайды

Дата: 2026-10-12. Режим: только чтение (файлы в `kb/` не изменялись).
Охват: `kb/instruments/file-formats/*` (15 файлов), `kb/instruments/replay/*` (7), `kb/users/*` (5), `kb/guides/{warc-workflow,warc-deduplication,link-graph-analysis,dynamic-ajax-sites}.md`.

**Чем проверялось:** спецификации WARC 1.1 (iipc.github.io), WACZ 1.1.1 и CDXJ 0.1.0 (specs.webrecorder.net), CDX-2015, RFC 8493, BagIt Profiles spec. Исходники и README: pywb (`manager.py`, `cli.py`, `Dockerfile`, `setup.py`, `docs/manual/*.rst`), py-wacz (`main.py`), warctools (`hanzo/*.py`), cdxj-indexer, ipwb, warc2html, bagit-python, browsertrix-crawler (`argParser.ts`), brozzler, warc2zim, veraPDF CLI, metawarc, filegetter, tgarc, warchaeology, duckdb-warc. Также сверялись PyPI и npm registry, сигнатурный файл PRONOM DROID V125 (из репозитория siegfried) и HTTP-статусы ссылок. Поведение warcio, `mailbox` и waybackpy проверено живым запуском в venv.

**Формат пункта:** `[SEVERITY] файл:строка — проблема — доказательство — предлагаемое исправление (уверенность)`.
Уверенность: **confirmed** — проверено по первоисточнику или запуском; **likely** — хорошо известный факт, но в этой сессии не перепроверялся; **suspect** — требует ручной проверки.

> Сквозная проблема: в разделах есть целые страницы, где **большинство CLI-команд выдуманы** (pywb, wacz, warcfilter, veraPDF, bagit.py, opj_compress, vips, warc-dedup, metawarc и др.). Такие места помечены critical: это copy-paste-код, который у читателя не заработает.

> Замечание к прошлому аудиту ссылок (`temp/kb-link-audit-2026-10-12.md`). Некоторые его замены сами ошибочны или вводят в заблуждение:
> (a) `commoncrawl/commoncrawl-crawler` — архивный репозиторий 2008–2012 гг., а не актуальный пайплайн CC;
> (b) `iipc/jwarc` назван «современным форком» JWAT — это отдельная библиотека (NLA), не форк;
> (c) `http://www.aiim.org/pdfa/ns/id/` в `pdfa.md` — **это URI пространства имён XMP, а не ссылка**, менять его НЕЛЬЗЯ;
> (d) в таблице замен указано `internetarchive/cdxj-indexer`, хотя реальный репозиторий — `webrecorder/cdxj-indexer`;
> (e) многие помеченные «исправленными» ссылки в моей зоне остались битыми (см. ниже: `webrecorder.io`, Docker Hub `webrecorder/replayweb.page`, `cdx-1.1.1.html`, `cdxj.html`, `announcing-the-wacz-format.html`, `mets-extended.html`, `premis-mets-guidelines`, APTrust PDF, `digformats.shtml`, `gephi.org/tutorials`, `ru.wikipedia.org/wiki/PREMIS`).

---

## Форматирование (сводно)

- [minor] Нет frontmatter (страница начинается сразу с `# ...`), confirmed: `file-formats/{bagit,cdx,format-registries,identification-tools,iiif,index,jp2,mbox,mets,mhtml,pdfa,premis,siard,wacz}.md`, `replay/{ipwb,openwayback,warc2html}.md`. Нужно добавить хотя бы `title`, `description`, `sidebar_position`.
- [minor] CRLF-окончания строк, confirmed: `file-formats/{bagit,mets,premis}.md`, `replay/{ipwb,openwayback,warc2html}.md`. Нормализовать в LF (`.gitattributes`).
- [minor] Дата `last_updated: 2026-11-09` стоит **в будущем** (сегодня 2026-10-12), confirmed: `replay/index.md:6`, `replay/pywb.md:5`, `replay/replayweb-page.md:5`, `replay/memento.md:5`, `users/large-warc.md:6`, `users/inspect-warc.md:6`, `guides/warc-deduplication.md:5`, `guides/link-graph-analysis.md:5`. Похоже на массовую LLM-генерацию.

---

## kb/instruments/file-formats/warc.md

- [major] warc.md:33-41 — в таблице типов записей **нет `resource`**. В WARC восемь типов: `warcinfo | response | resource | request | metadata | revisit | conversion | continuation` — спецификация WARC 1.1, ABNF `record-type`. Добавить `resource` (контент без HTTP-обёртки: скриншоты, файлы, полученные не по HTTP). (confirmed)
- [major] warc.md:40 — `conversion` описан как «скриншот страницы или WARC писался поверх существующего архива». Это неверно. По WARC 1.1 §6.8 это «alternative version of another record's content that was created as the result of an archival process», то есть миграция формата. Переписать; скриншоты обычно хранят как `resource` или `metadata`. (confirmed)
- [minor] warc.md:39 — «revisit… содержит только дату и хеш оригинала». На деле revisit обязан содержать `WARC-Profile`; WARC 1.1 рекомендует `WARC-Refers-To-Target-URI`/`-Date`; обычно в нём есть HTTP-заголовки. Уточнить. (confirmed)
- [minor] warc.md:20-26 — не указаны номера ISO: WARC 1.0 = ISO 28500:2009, WARC 1.1 = ISO 28500:2017. Добавить. (confirmed: в WARC 1.1 есть текст «WARC 1.0 standard (ISO 28500:2009)»)
- [major] warc.md:46 — «WARC-файлы часто упаковываются в .gz или .zip… можно открыть любым архиватором». `.warc.gz` — это поотрочное (per-record) gzip-сжатие, а не внешний архив. В `.zip` WARC не упаковывают (кроме WACZ, и там без сжатия). Распаковка `gunzip` лишает файл произвольного доступа по смещениям из CDX. Переписать. (confirmed по спецификациям WARC и WACZ)
- [minor] warc.md:50 — «ARC (Archive-It / Internet Archive ARC…)». ARC — формат Internet Archive; Archive-It к его созданию отношения не имеет. Убрать «Archive-It». (likely)
- [minor] warc.md:57 — «ARC не подходит для SPA» — некорректная причинно-следственная связь. Удалить. (likely)
- [minor] warc.md:101 — «JHOVE — модуль WARC-module от OPF». Модуль называется `WARC-kb` (вклад Королевской библиотеки Дании, JHOVE ≥1.20). Уточнить. (likely)
- [minor] warc.md:102 — опечатка «запейсей». И неверная логика: у `revisit` нет тела, и `WARC-Payload-Digest` сравнивают с **исходной** записью. Для целостности самой записи служит `WARC-Block-Digest`. (confirmed)
- [minor] warc.md:113-114 — валидация через `list(ArchiveIterator(...))` проверяет только парсинг. Добавить `warcio check archive.warc.gz` (проверяет дайджесты; подкоманды warcio: `index|recompress|extract|check`, проверено `warcio -h`). (confirmed)
- [minor] warc.md:182 — `Content-Length` из `rec_headers` — это длина блока вместе с HTTP-заголовками, а не тела. Для статистики «MB по типам» это приближение; стоит оговорить. (confirmed)
- OK: warctools-команды (`warcdump`, `warcvalid`, `warcfilter`, `arc2warc` в stdout) существуют (confirmed по `hanzo/*.py`). Ссылка на metawarc корректна.

## kb/instruments/file-formats/wacz.md

- [critical] wacz.md:127-139 — описание и пример `datapackage-digest.json` выдуманы: «содержит SHA-256 хеши всех файлов», поля `profile: data-package-digest`, `digestAlgorithm`, `hashes`. По WACZ 1.1.1 файл содержит только `path: "datapackage.json"` и `hash: "sha256:…"` (плюс необязательную подпись `signedData`). Хеши отдельных файлов лежат в `datapackage.json → resources[].hash`/`bytes`. Переписать по спецификации. (confirmed)
- [major] wacz.md:110-123 — пример `datapackage.json` не соответствует спецификации: нет обязательного `wacz_version`, у ресурсов нет `hash` и `bytes`, поле `"format": "warc"` не определено. Дать пример из спецификации 1.1.1. (confirmed)
- [major] wacz.md:17 — «`datapackage.json` (метаданные коллекции, **список страниц**, настройки)». Список страниц хранится в `pages/pages.jsonl` (обязателен по 1.1.1), а `datapackage.json` — манифест ресурсов. (confirmed)
- [critical] wacz.md:50, 69, 72-75 — `wacz create -o output.wacz my-warc-directory/` **не работает**: py-wacz открывает каждый вход через `open(_input,'rb')`, директория даёт `IsADirectoryError`. Флага `--description` нет, правильно `--desc`. Исправить на `wacz create -o out.wacz dir/*.warc.gz --title … --desc …`; упомянуть `--detect-pages`/`-p pages.jsonl`/`--text`. (confirmed: `wacz/main.py`)
- [critical] wacz.md:83-87 — Browsertrix запускается с `-v $PWD/data:/crawl/data`. Краулер пишет в `/crawls/`, поэтому результат останется внутри контейнера и будет потерян. Правильно: `-v $PWD/crawls:/crawls/`. Пробел в `--collection "My Collection"` тоже нежелателен (имя используется как имя каталога). (confirmed: user-guide Browsertrix)
- [minor] wacz.md:26-35 — дерево каталогов неполное: нет `pages/extraPages.jsonl`, `logs/`, `index.idx` (ZipNum). Нужна оговорка, что индексы — это CDXJ (`index.cdx.gz` хранит CDXJ, а не классический CDX). (confirmed)
- [minor] Пробел: нет ссылки на спецификацию `https://specs.webrecorder.net/wacz/1.1.1/` и на требования ZIP STORE для `archive/` и `*.cdx.gz`. (confirmed)
- [major] wacz.md:166-167 — `warc2zim --output my_archive.zim my_archive.warc.gz`. Обязателен `--name`; `--output` — это **каталог**, имя файла задаётся `--zim-file`. Заголовок говорит «WACZ → ZIM», а команда принимает WARC. Исправить на `warc2zim --name my_archive --output ./out --zim-file my_archive.zim my_archive.warc.gz`. (confirmed: аргументы `warc2zim/main.py`)
- [major] wacz.md:170 — `zimdump dump my_archive.zim > articles.jsonl` — неверно: `zimdump dump` требует `--dir=` и выгружает файлы, а не JSONL. Использовать `zimdump info`/`zimdump list`. (likely)
- [minor] wacz.md:157 — «Анонимность: ZIM не несёт внешних URL» — сомнительный тезис, убрать. (suspect)

## kb/instruments/file-formats/cdx.md

- [critical] cdx.md:35-36 — неверно расшифрованы поля CDX: `S` = «Смещение в WARC», `V` = «Версия CDX». По CDX-2015: **S = compressed record size, V = compressed arc file offset**. Пример в строке 41 (`12345 1`) и генератор в строке 216 (`0 1`) построены на этой ошибке. Исправить легенду и примеры. (confirmed: CDX-2015 и вывод `cdxj-indexer -11`)
- [major] cdx.md:55-58 — таблица SURT неверна и противоречит примеру в строке 41. Пишут `(com,example,www)/path?q=1`, `(org,archive)/index.html`, «поиск по `(,com,example,`». В CDX-индексах ключ имеет вид `com,example)/path?q=1`; полная форма SURT — `http://(com,example,www,)/path?q=1`; для `https://archive.org` ключ `org,archive)/` (никакого `index.html`). Переписать. (confirmed по выводу cdxj-indexer и IA CDX)
- [major] cdx.md:116-118 — «`SURT TAIL_JSON`… первый блок до первого пробела — SURT, всё остальное — JSON». Пропущен timestamp. Формат: `SURT TIMESTAMP {json}`, как и в собственном примере на строке 136. Внутренне противоречиво. (confirmed: спецификация CDXJ 0.1.0 и вывод cdxj-indexer)
- [minor] cdx.md:120-131 — у pywb/cdxj-indexer в JSON нет `ts`; `status`/`length`/`offset` — строки; `digest` — base32 без префикса `sha1:`. Сослаться на `https://specs.webrecorder.net/cdxj/0.1.0/`, а не на «спецификацию Webrecorder» без ссылки. (confirmed)
- [critical] cdx.md:67, 100, 154 — `wb-manager index /path/to/warcs` — неверный синтаксис: `index` требует `<coll_name> <files…>`. В итоге путь воспримется как имя коллекции и упадёт без файлов. Правильно: `wb-manager index my-coll /path/*.warc.gz`, а лучше `wb-manager add`. (confirmed: `pywb/manager/manager.py`)
- [major] cdx.md:77, 196 — `cdx-toolkit query index.cdx "http://example.com"` выдуман. Пакет называется `cdx_toolkit`, CLI — `cdxt`, и он работает с **удалёнными** CDX API (IA/CC), а не с локальным файлом. Заменить на `grep`/бинарный поиск или pywb CDX-сервер. (confirmed: README `commoncrawl/cdx_toolkit`)
- [major] cdx.md:86-94 — XML-конфиг OpenWayback `<wayback><cdx-indexes>…` выдуман. OpenWayback конфигурируется Spring-бинами (`wayback.xml`, `CDXCollection.xml`). Удалить или дать реальный фрагмент. (likely)
- [minor] cdx.md:64 — `cdx-indexer` существует только как скрипт из пакета pywb (`setup.py: cdx-indexer = pywb.indexer.cdxindexer:main`). Указать это. Для новых проектов рекомендовать `pip install cdxj-indexer` (`cdxj-indexer`, `-11` для CDX11). (confirmed)
- [minor] cdx.md:105-106 — OutbackCDX упомянут без ссылки (`github.com/nla/outbackcdx`); у pywb есть руководство `docs/manual/outbackcdx.rst`. (confirmed)
- [minor] cdx.md:158 — висящий пункт «*   Легче парсить программно» — остаток списка. Удалить. (confirmed)
- [major] cdx.md:201-218 — «генератор CDX на warcio» пишет сырой URL вместо SURT, ISO-дату вместо 14 цифр, `0`/`1` вместо длины и смещения. `http_headers` может быть `None`, `import gzip` не используется. Такой файл непригоден для pywb/OpenWayback. Заменить на `cdxj-indexer -11 archive.warc.gz > index.cdx`. (confirmed)
- [minor] cdx.md:249 — ссылка `cdx-2015/` рабочая. Стоит добавить CDXJ 0.1.0. (confirmed 200)

## kb/instruments/file-formats/mhtml.md

- [major] mhtml.md:7 — «Старые архивы (Internet Archive до 2008…) часто содержат MHTML». Неверно: IA хранил ARC. Удалить. (likely)
- [critical] mhtml.md:50 — `chromium --headless --print-to-mhtml=…` — такого флага нет (есть `--print-to-pdf`, `--screenshot`, `--dump-dom`). MHTML получают через CDP `Page.captureSnapshot({format:"mhtml"})`, например из Puppeteer/Playwright. Повтор в строке 117. (likely)
- [major] mhtml.md:56-58 — `curl -X PUT http://localhost:9222/json -d '{…targetId…}'` бессмысленно: endpoint не принимает такое тело и MHTML не создаёт (существует `PUT /json/new?url`). Заменить примером `Page.captureSnapshot`. (likely)
- [major] mhtml.md:61-70 — раздел «Из Python (`requests-mhtml`)» — плейсхолдер. Пакета `requests-mhtml` нет на PyPI; код использует `requests_html` и MHTML не создаёт. Удалить или заменить на Playwright с CDP. (confirmed: PyPI 404)
- [minor] mhtml.md:79 — «Safari умеют открывать .mhtml напрямую» — Safari использует `.webarchive`, MHTML нативно не открывает. (likely)
- [minor] mhtml.md:103 — сломана строка таблицы `| WARC-записи | нет |` (не хватает столбца). (confirmed)
- [critical] mhtml.md:113 — PUID MHTML `fmt/1014` неверен: `fmt/1014` = «INTERLIS Model File». MHTML = **`x-fmt/429`**. (confirmed: DROID V125)
- [minor] mhtml.md:119 — пакета `mhtml` на PyPI нет. (confirmed)
- [major] mhtml.md:120 — `libwkhtmltox` MHTML не поддерживает, а проект wkhtmltopdf архивирован. Удалить. (likely)
- [major] mhtml.md:125 — «конвертируйте MHTML в WARC через `warcprox` или `wget --warc-file`» — неверно: оба инструмента записывают живой HTTP-трафик и не умеют читать MHTML-файл. Предложить разбор через `email` с записью частей как `resource`-записей через `warcio.WARCWriter`, либо хранить MHTML как есть. (confirmed по логике инструментов)

## kb/instruments/file-formats/premis.md

- [major] premis.md:20-26 — «пять основных сущностей… Object бывает трёх типов» — это смесь PREMIS 2.x и 3.0. В PREMIS 3.0 (2015) **четыре** сущности: Object (категории **intellectual entity**, representation, file, bitstream), Event, Agent, Rights. Привести к 3.0 и указать версию. (likely, хорошо известный факт)
- [major] premis.md:34 — «связать IE и Object через `linkingEventIdentifier` и `linkingAgentIdentifier`» — неверно. Структурные связи задаются `relationship` (`relationshipType=structural`, `relatedObjectIdentifier`) или `linkingIntellectualEntityIdentifier`. (likely)
- [minor] premis.md:43 — `statutory` → в PREMIS значение `statute` (`statuteInformation`). (likely)
- [minor] premis.md:59, 72-75 — XML невалиден по схеме: `linkingObjectIdentifierValue` без обёртки `linkingObjectIdentifier`; `rightsStatement` вне `premis:rights`; `objectCategory` не элемент (тип задаётся `xsi:type="premis:file"`); у `preservationLevel` обязателен `preservationLevelValue`. Пометить как схему «упрощённо» или исправить. (likely)
- [minor] premis.md:107 — `linkingAgentIdentifierType` = `software` — путаница типа идентификатора с ролью агента. (likely)
- [minor] Пробел: нет ссылки на словари id.loc.gov (eventType и т. п.) и на инструменты. Ссылки `premis-3-0-final.pdf` и `examples.html` рабочие (confirmed 200).

## kb/instruments/file-formats/mets.md

- [major] mets.md:22 — «metsHdr… (обязательная)» — неверно: в METS обязателен только `structMap`; `metsHdr` опционален. (likely, по схеме mets.xsd)
- [minor] mets.md:23-31 — пропущен пункт 5 (нумерация 1-4, 6-8). Написано «внутри три подсекции», перечислено четыре. `behavior` → `behaviorSec`. (confirmed)
- [major] mets.md:84 — `<mets:checksum CHECKSUMTYPE="SHA-256">` как дочерний элемент — такого элемента нет. Checksum задаётся **атрибутами** `CHECKSUM="…" CHECKSUMTYPE="SHA-256"` у `mets:file`. (likely)
- [major] mets.md:143-144 — «METS Validator от LoC — онлайн и CLI», «mets-validator в Java-стеке Fedora / GoLoji» — не подтверждается; «GoLoji» похоже на выдумку. Оставить `xmllint --schema mets.xsd`. (suspect)
- [major] mets.md:139, 173, 174 — ссылки `mets-extended.html` и `premis-mets-guidelines-v1-0.html` отдают 404 (прошлый аудит их отмечал, но они остались). (confirmed 404)
- [minor] Пробел/устаревание: не упомянут **METS 2** (выпущен в 2023–2024) и текущая 1.12.x. (likely)

## kb/instruments/file-formats/bagit.md

- [critical] bagit.md:66, 137-141 — `bagit.py --create my-bag data/` и `--metadata Source-Organization=…` выдуманы. В bagit-python каталог превращается в bag **на месте**: `bagit.py --contact-name 'X' --source-organization 'Ruarxive' /dir`, хеши задаются `--sha256`/`--sha512`. `--validate` существует. (confirmed: README bagit-python)
- [major] bagit.md:128 — формат `fetch.txt` неверен (`sha256=… URL size`). По RFC 8493: `url length filepath`, где filepath начинается с `data/`, а сам файл обязан быть в payload-manifest. Тезис «файлы вне `data/`» (строка 124) тоже неточен. (likely)
- [major] bagit.md:180 — профиль объявляется полем **`BagIt-Profile-Identifier`** (URI JSON-профиля), а не `BagIt-Profile-Version`. (confirmed: BagIt Profiles spec)
- [major] bagit.md:176-178 — APTrust PDF отдаёт 404. «BTRS Profile» со ссылкой на RFC 8493 — не профиль (и неясно, что такое BTRS). DuraCloud wiki отдаёт 403. Дать ссылку на `bagit-profiles.github.io` и актуальную документацию APTrust. (confirmed 404 / suspect BTRS)
- [minor] bagit.md:22-23, 30 — `tagmanifest-*.txt` отнесён к обязательным; по RFC 8493 он опционален (обязательны `bagit.txt`, `data/`, хотя бы один `manifest-*.txt`). (likely)
- [minor] bagit.md:3 — «разработан LoC»: точнее LoC совместно с CDL; RFC 8493 (2018), авторы Kunze, Littman, Madden и др. (likely)
- [minor] bagit.md:206 — `bagit-java` фактически заброшен (последний push в 2024-02). Стоит пометить. (confirmed)

## kb/instruments/file-formats/pdfa.md

- [critical] pdfa.md:113-121 — **таблица PUID почти целиком неверна**. Должно быть: PDF/A-1a `fmt/95`, 1b `fmt/354`, 2a `fmt/476`, 2b `fmt/477`, 2u `fmt/478`, 3a `fmt/479`, 3b `fmt/480`, 3u `fmt/481`, 4 `fmt/1910`, 4e `fmt/1911`, 4f `fmt/1912`. На странице: `fmt/353` (это **TIFF**), `fmt/475` (MMC Snap-in), `fmt/617-619` (GeoGebra). Рекомендация «сохранять PUID в метаданных» при этом прямо вредна. (confirmed: DROID V125)
- [major] pdfa.md:11-20, 100, 134 — **нет PDF/A-4** (ISO 19005-4:2020, варианты 4/4e/4f), устаревшая картина. Добавить. (confirmed по PRONOM: fmt/1910-1912)
- [critical] pdfa.md:60 — `--convert-to pdf:writer_pdf_Export:'{"PDFVersion":"PDF/A-2b"}'` — несуществующий параметр. Правильно (LibreOffice ≥7.4): `--convert-to 'pdf:writer_pdf_Export:{"SelectPdfVersion":{"type":"long","value":"2"}}'` (1/2/3 = PDF/A-1b/2b/3b). (likely)
- [major] pdfa.md:65-68 — Ghostscript с `-sColorConversionStrategy=UseDeviceIndependentColor` для PDF/A не подходит. Нужно `RGB`/`CMYK` плюс OutputIntent (`PDFA_def.ps` с ICC). (likely)
- [critical] pdfa.md:74-75, 91-98 — CLI veraPDF выдуман. Флагов `--input` и `--regress` нет. `--profile` загружает **файл** профиля, а не «PDF/A-2B». veraPDF не конвертирует (только `--fixmetadata`). Правильно: `verapdf --flavour 2b file.pdf`, `verapdf -r --flavour 2b ./archive/`, `--format xml|json|html|text|mrr`. `--format junit` не подтверждается. (confirmed: `VeraCliArgParser.java`; junit — suspect)
- [major] pdfa.md:88 — `apt install verapdf`: в Debian/Ubuntu такого пакета нет; ставится через инсталлятор с verapdf.org. (likely)
- [minor] pdfa.md:104 — `pdfbox-app.jar PDFA document.pdf`: Preflight — отдельный `preflight-app`, проверяет только PDF/A-1b. (likely)
- [minor] pdfa.md:28-29 — «JS: допустимы только триггеры печати и сохранения», «в PDF/A-2 аудио/видео разрешены как вложения к аннотациям» — неточно (мультимедиа-аннотации в PDF/A-2 запрещены). (likely)
- [minor] pdfa.md:129 — опечатка «свёрзаются». (confirmed)
- [minor] pdfa.md:106 — PDFTron переименован в Apryse. (likely)

## kb/instruments/file-formats/mbox.md

- [major] mbox.md:90 — «Для `mboxcl` есть отдельный класс `mailbox.mboxcl`» — такого класса нет. Есть `mbox, Maildir, MH, Babyl, MMDF`. (confirmed: запуск Python 3.13)
- [major] mbox.md:103 — код фильтрации падает с `NameError`: используется `timezone` без импорта. `strptime` с фиксированным форматом сломается на реальных `Date:`. Использовать `email.utils.parsedate_to_datetime`. (confirmed)
- [critical] mbox.md:118-119 — PUID неверны: `fmt/795` = «RPM Package Manager file», `x-fmt/207` = «X-Windows Bitmap», `fmt/799` = «WriteNow». MBOX = **`fmt/720`**. У Maildir PUID нет (это каталог). (confirmed: DROID V125)
- [major] mbox.md:71 — `readpst -e -D -m archive.mbox archive.pst`: `-m` аргумента не принимает (означает «.msg + .eml»), пакет называется `pst-utils`/libpst, а не «libpstl-html». Правильно: `readpst -r -D -o outdir/ archive.pst` (по умолчанию пишет mbox). (likely)
- [major] mbox.md:13-19 — атрибуции вариантов сомнительны: mboxcl2 приписан «Mozilla Thunderbird», mboxcl — «qmail», mboxrd — «Sendmail». Thunderbird хранит папки в mboxo/mboxrd-подобном формате (строка 64 тоже неверна). Сверить с Wikipedia/qmail mbox(5). (likely)
- [major] mbox.md:130 — «Всегда кодируйте сообщения в UTF-8» — вредный совет для архива: перекодирование меняет оригинал и ломает DKIM и доказательную ценность. Хранить как есть. (confirmed по смыслу)
- [minor] mbox.md:21 — «проблема `From `-в-тележек» — мусорная фраза. (confirmed)
- [minor] mbox.md:129 — «mboxrd рекомендован в RFC 4155 для архивов» — RFC 4155 такого не рекомендует. (likely)
- [major] mbox.md:145 — ссылка `ru.wikipedia.org/wiki/PREMIS` не существует (прошлый аудит её отмечал, но она осталась). Заменить на внутреннюю `/kb/instruments/file-formats/premis`. (confirmed по аудиту)

## kb/instruments/file-formats/siard.md

- [critical] siard.md:58, 79, 117 — `https://www.deepfinity.com/products/siard-suite` — **припаркованный домен** (редирект на `/lander`). Сама «SIARD Suite (коммерческий)» — неправда: SIARD Suite выпускает Швейцарский федеральный архив, она бесплатна и открыта (`github.com/sfa-siard/SiardGui`, `SiardCmd`, `SiardApi`). (confirmed)
- [critical] siard.md:77-79 — «Готового официального конвертера нет» — неверно: SiardCmd/SiardGui (SiardFromDb/SiardToDb) и есть официальный конвертер. Не упомянут DBPTK (`keeps/dbptk-developer`, open source, SIARD 1/2). Совет «pg_dump + собственный скрипт» вреден. (confirmed: репозитории существуют)
- [major] siard.md:13-14 — версии: SIARD 1.0 указан как 2012 (фактически ~2008), SIARD 2.0 как «2020, современная». Существуют **2.1 и 2.2**: PRONOM `fmt/1196` (2.1) и `fmt/1777` (2.2), `fmt/995` (2.0), `fmt/161` (1.0). Не упомянут стандарт eCH-0165. Рекомендацию «Используйте SIARD 2.0» (строка 106) заменить на 2.2. (confirmed по PRONOM; даты — likely)
- [major] siard.md:16-33 — структура архива неверна: файла `content/metadata.xml` нет. На самом деле: `header/metadata.xml` + `header/metadata.xsd`, `content/schemaN/tableN/tableN.xml` + `tableN.xsd`, LOB-ы в `lobN/`. (likely)
- [major] siard.md:65-74 — Java API `SiardArchiveImpl.fromFile(...)`, `getSchemas/getTables/getRecords` выглядит выдуманным. Сверить с `sfa-siard/SiardApi` или удалить. (suspect)
- [minor] siard.md:61 — перечисленные модули (`EnterUtilities`, `JdbcPostgres`…) не сверены; реальные публичные репозитории — SiardGui/SiardCmd/SiardApi. (suspect)
- [minor] siard.md:107 — «VACUUM FULL уменьшит размер архива» — на размер выгрузки строк не влияет. Удалить. (likely)
- [major] siard.md:115 — URL спецификации на bar.admin.ch (путь с подозрительным «unterlagen-aerzen») отдаёт 502. Заменить на актуальную страницу BAR/eCH-0165. (confirmed 502)
- [minor] siard.md:3 — опечатка «государственных реестр». (confirmed)

## kb/instruments/file-formats/jp2.md

- [critical] jp2.md:24 — «Part 15 (ISO 15444-15) — профиль для PDF/A и офисных документов» — неверно. Part 15 = **HTJ2K (High-Throughput JPEG 2000)**, в PRONOM `fmt/1964` «JPH (JPEG 2000 part 15)». Повтор в строке 27. (confirmed)
- [critical] jp2.md:53, 59, 116 — `opj_compress … -n 0` «для lossless». `-n` — число уровней разрешения (≥1, по умолчанию 6); `-n 0` даёт ошибку. Lossless — режим по умолчанию (без `-r`/`-q`). (likely)
- [major] jp2.md:56 — `-r 90` «качество 90» — на деле это **степень сжатия 90:1** (очень сильные потери). Для «качества» есть `-q` (PSNR). (likely)
- [critical] jp2.md:104 — PUID `fmt/149` = «JTIP (JPEG Tiled Image Pyramid)». JP2 = **`x-fmt/392`** (JPX `fmt/151`, MJ2 `fmt/337`). (confirmed: DROID V125)
- [major] jp2.md:73 — `vips jpe2000save … --tile-size` — такой операции нет. Правильно: `vips jp2ksave in.tif out.jp2 --lossless --tile-width 1024 --tile-height 1024`. (likely)
- [major] jp2.md:78-81 — «Grok (Python) `from grok import compress`» — выдуманный API: Grok — C++ кодек с CLI `grk_compress`. (confirmed: репозиторий на C++; API — likely)
- [major] jp2.md:88 — `jp2info` неизвестен. Стандартный валидатор JP2 в цифровом сохранении — **jpylyzer** (заметный пробел). (likely)
- [minor] jp2.md:50 — пакет в Debian/Ubuntu называется `libopenjp2-tools`. (likely)
- [minor] jp2.md:34-37 — пропущен пункт 3 в нумерации боксов. (confirmed)
- [major] jp2.md:126 — `digformats.shtml` отдаёт 404. Карточка JP2 в LC FDD — `fdd000143`. (confirmed 404; номер — likely)

## kb/instruments/file-formats/iiif.md

- [major] iiif.md:37 — пример URL `…/abc123/{256,256,1024,1024}/full/0/default.jpg` — фигурные скобки делают URL невалидным, и это не «центральный фрагмент». Правильно: `…/256,256,1024,1024/max/0/default.jpg`. (confirmed по синтаксису Image API)
- [minor] iiif.md:45-46 — для Image API 3.0 размер `full` заменён на `max`; rotation — любое значение 0–360 и `!` для зеркала. (likely)
- [minor] iiif.md:22-24 — «Authentication API» устарел; актуален Authorization Flow API 2.0. Нет Content State API. (likely)
- [major] iiif.md:125 — «Loris — Python, IIIF Image API 3.0» — неверно: Loris реализует Image API **2.0** и не развивается (последний push 2023-09). (confirmed: README)
- [minor] iiif.md:123 — digilib: sourceforge отдаёт 403, актуальный репозиторий — `github.com/robcast/digilib`. (confirmed)
- [minor] iiif.md:137-143 — `Mirador.viewer(config)` без обязательного `id` контейнера не работает. (likely)
- [minor] iiif.md:7 — опечатка «Архив отчекан». Строка 158: «манифесты в PREMIS как `digiprovMD`-событие» — `digiprovMD` относится к METS. (confirmed)

## kb/instruments/file-formats/identification-tools.md

- [minor] identification-tools.md:20-22 — установка на Linux через «.deb с релизов». У siegfried есть apt-репозиторий и `go install`. Нет упоминания `sf -update` / `roy`. (likely)
- [minor] identification-tools.md:117-118 — «Siegfried JS» ведёт на основной репозиторий siegfried. Наличие wasm-сборки стоит подтвердить ссылкой на конкретный артефакт или демо itforarchivists.com. (suspect)
- [minor] identification-tools.md:97-108 — TrID online: противоречит тезису о конфиденциальности (файлы загружаются на чужой сервер); есть офлайн CLI TrID. (confirmed по смыслу)
- [minor] Пробел: нет JHOVE, jpylyzer, veraPDF (валидация отличается от идентификации), `file`/libmagic, CLI-примеров DROID (`droid.sh -a … -R`). `pip install opf-fido` корректен (confirmed: PyPI 1.6.1).

## kb/instruments/file-formats/format-registries.md

- [major] format-registries.md:37 — «`fdd000397` для PDF/A-1» — неверно: `fdd000397` = DOCX Transitional. PDF/A-1 = **`fdd000125`**. (confirmed: заголовки страниц loc.gov)
- [major] format-registries.md:44 — «Q11272 (Microsoft Word)» — Q11272 = **Microsoft Excel**; Word = `Q11261`. (confirmed: Wikidata API)
- [major] format-registries.md:52, 143 — «File Formats Wiki → fileformat.info» — fileformat.info не вики. «File Formats Wiki» — это проект ArchiveTeam `fileformats.archiveteam.org`, то есть дубль следующего раздела. (confirmed)
- [major] format-registries.md:60, 144 — `justsolve.archiveteam.org/wiki/File_Format` не резолвится. Рабочий адрес: `http://fileformats.archiveteam.org/wiki/Main_Page`. (confirmed: 000 vs 200)
- [minor] format-registries.md:68 — Game File Format Central по факту — ModdingWiki (`moddingwiki.shikadi.net`); ссылка на Wayback по wildcard неудобна. «1300 форматов» без источника. (suspect)
- [minor] Повтор заголовка «Рекомендации» и разнобой «реестры/регистры». (confirmed)

## kb/instruments/file-formats/index.md

- [minor] index.md — нет frontmatter. Список форматов корректен. (confirmed)

---

## kb/instruments/replay/index.md

- [critical] index.md:60 — «pywb… **используется Internet Archive**». Неверно: Wayback Machine IA работает на собственном стеке, pywb там не используется. pywb используют UKWA, Arquivo.pt, Webrecorder и др. Та же ошибка в pywb.md:11. (likely, общеизвестно)
- [major] index.md:30 — «> 10 ТБ → **OpenWayback** + Hadoop-стек» — устаревшая рекомендация. IIPC ведёт переход с OpenWayback на pywb (в документации pywb есть «OpenWayback Transition Guide»: pywb + OutbackCDX + nginx). Последний релиз OpenWayback — 2.4.0 от 2019-05. Рекомендовать pywb + OutbackCDX. (confirmed)
- [major] index.md:53 — «Анотации в архиве: ReplayWeb.page ✅» — такой функции нет (в Key Features документации replayweb.page её нет). Есть опечатка «Анонтации». (confirmed по docs)
- [major] index.md:48 — Memento для IPWB указан как ❌, хотя ipwb поддерживает TimeMap и TimeGate (README ipwb: «TimeMap or Link header»). (confirmed)
- [major] Противоречия с pywb.md:310-319: IPWB self-hosted (здесь ❌, там ✅), ReplayWeb.page self-hosted (здесь ✅, там ❌), авто-индексация RWP (здесь «CDXJ на лету ❌», там «✅ в браузере»). Свести в одну каноническую таблицу. (confirmed)
- [minor] index.md:66-70 — «Все серверные replay-инструменты поддерживают два протокола IIPC» — Memento — это IETF RFC 7089 (а не IIPC), CDX API не стандарт; warc2html и IPWB «CDX API» не имеют. (confirmed)
- [minor] Пробел: нет упоминания полнотекстового поиска в ReplayWeb.page (поддерживается для WACZ с извлечённым текстом, по docs). OK: «ARC ❌» для ReplayWeb.page верно (docs: ARC Not Supported).

## kb/instruments/replay/pywb.md

- [critical] pywb.md:11 — «Именно `pywb` обслуживает archive.org» — неверно (см. выше). (likely)
- [critical] pywb.md:76 — `wb-manager init .` — `init` принимает имя коллекции и создаёт `collections/<name>/…`, а не `config.yaml`. Дерево в строках 81-85 вымышлено. (confirmed: `manager.py`)
- [critical] pywb.md:107-108 — `wb-manager add my-coll ./collections/my-coll` (add принимает файлы WARC, для WACZ — `--unpack-wacz`) и `wayback --collections .` (такого флага нет; есть `-d/--directory`, `-p/--port`, `-a/--autoindex`). Правильно: `wb-manager init my-coll && wb-manager add my-coll file.warc.gz && wayback`. (confirmed: `manager.py`, `cli.py`, `usage.rst`)
- [major] pywb.md:90 — `cp … collections/my-coll/archive/` до `init` — каталога ещё нет; WACZ без `--unpack-wacz` не индексируется. (confirmed)
- [critical] pywb.md:55-58 — Docker: `-v /path:/archive`, а у образа `VOLUME /webarchive`. (confirmed: Dockerfile)
- [critical] pywb.md:137-156, 172, 302-303, 328, 336-338 — выдуманные ключи `config.yaml`: блок `server:` (port/workers/max_connections/max_request_size), `recurse`, `auto_index`, `logging`, `default_collection`, `cache_proxy`. Реальные: `collections: <c>: {index_paths|index, archive_paths}`, `autoindex: 30`, `enable_memento`, `framed_replay`, `recorder`, `collections_root`. Порт задаётся флагом `-p`. (confirmed: `configuring.rst`)
- [major] pywb.md:198, 331-344 — «upload UI для WACZ, лимит ~50 MB» — у pywb нет UI загрузки. Удалить разделы. (confirmed: в docs такой функции нет)
- [major] pywb.md:216-222 — `output=json` в pywb возвращает **NDJSON** (по объекту на строку), а не массив массивов (это формат IA CDX). (confirmed: `cdxserver_api.rst`)
- [major] pywb.md:241-244 — «совпадения по regex» показаны через `url=example.com/.*&matchType=prefix` — это не regex. Regex — через `filter=~url:…`. (confirmed: `cdxserver_api.rst`)
- [major] pywb.md:270-277, 225 (и memento.md:225) — TimeGate pywb: `/<coll>/<url>` (или `/<coll>/mp_/<url>`), пути `/<coll>/memento/<url>` нет. (confirmed: `memento.rst`)
- [minor] pywb.md:275 — `Wed, 15 Jun 2026`: 15.06.2026 — понедельник (в memento.md верно `Mon`). (confirmed)
- [major] pywb.md:203, 371-372 — wiki-страниц `Deployment` и `Cookbook` **не существует** (GitHub показывает «Create new page»). Документация по деплою — `pywb.readthedocs.io` (usage.rst → Deployment). (confirmed)
- [major] pywb.md:346-348 — «Surrogates» — такой функции в pywb нет. Удалить. (likely)
- [major] pywb.md:293-299 — таблица масштабирования («CDXJ в Redis», «>10 ТБ — Hadoop IA, pywb как фронтенд») выдумана. Реальный путь — OutbackCDX или ZipNum (`outbackcdx.rst`). (confirmed: в docs нет)
- [major] pywb.md:374 — `cdx-1.1.1.html` отдаёт 404. (confirmed)
- [minor] pywb.md:310-319 — противоречия с index.md (см. выше); «Python ✅ Node» для RWP; IPWB «CDX/Memento ❌» неверно. (confirmed)
- [minor] pywb.md:48 — «Windows (с WSL)»: pywb ставится и нативно; `python_requires >=3.9,<3.15` — верно. (confirmed)

## kb/instruments/replay/replayweb-page.md

- [major] replayweb-page.md:11 — ссылка `webrecorder.io` отдаёт 404 → `https://webrecorder.net/`. (confirmed)
- [major] replayweb-page.md:76 — Docker-образа `webrecorder/replayweb.page` (и `replaywebpage`) на Docker Hub нет; прошлый аудит указал «заменить», но ссылка осталась. Self-host — npm-пакет `replaywebpage` (`ui.js` + `sw.js`). (confirmed: Hub API 404, npm `replaywebpage@2.5.3`)
- [critical] replayweb-page.md:100-104 — «архив Эха Москвы — ~173 ГБ **WACZ**» и `split --bytes=10G big.wacz small-`.wacz`. Архив Эха — **один WARC.gz** (186 234 035 346 байт ≈ 173 ГиБ, Backblaze). Резка ZIP по байтам даёт **невалидные** файлы, ни одна часть не откроется. Плюс сломаны бэктики. Удалить совет; правильный путь — несколько WACZ или multi-WACZ JSON-коллекция. (confirmed)
- [critical] replayweb-page.md:108-115 — таблица «время открытия 1/10/50/100+ ГБ» не имеет источника и выглядит выдуманной. Она противоречит users/large-warc.md:153 («первый запуск 5–15 мин») и :234 («~10 мин»). Удалить или пометить как оценку. (confirmed: противоречие; цифры — suspect)
- [critical] replayweb-page.md:120-122 — `npm install -g @webrecorder/cdxj-indexer` — такого npm-пакета нет. cdxj-indexer — Python (`pip install cdxj-indexer`) и индексирует WARC, а не WACZ. «Положите cdxj рядом с WARC» — ReplayWeb.page соседние файлы не подхватывает. Корректно: упаковать через `wacz create`. (confirmed: npm 404, README cdxj-indexer)
- [major] replayweb-page.md:126-133 — «Аннотации (с версии 1.6+)… кнопка Annotate» — выдумано. (confirmed: в docs нет)
- [major] replayweb-page.md:135-141 — «Export Page → самодостаточный HTML» — выдумано. (likely)
- [major] replayweb-page.md:146-150 — «Timeline… Diff для подсветки различий» — выдумано. (likely)
- [major] replayweb-page.md:169-184 — URL-параметры `?theme=dark`, `?debug=true` и десктопные настройки «Memory limit / Concurrent requests» выдуманы. (likely)
- [critical] replayweb-page.md:190-201 — JS-API `window.$wb?.loadWacz()`, `coll.goto()` выдуманы. Реальная интеграция — web-компонент `<replay-web-page source="…" url="…">` (docs: `replayweb.page/docs/embedding`). (confirmed: страница docs существует; API — likely)
- [major] replayweb-page.md:202, 251-252 — wiki ReplayWeb.page **выключена** (`/wiki` → 302 на репозиторий). Заменить на `https://replayweb.page/docs/` и `/docs/embedding`. (confirmed)
- [major] replayweb-page.md:217 — «Откройте ReplayWeb.page по HTTP, без HTTPS» — неверно: Service Worker работает только на HTTPS (или localhost). Совет ломает плеер. (confirmed: README ipwb о том же ограничении, общий факт)
- [minor] replayweb-page.md:82 — «Плеер скачает файл в браузер» — WACZ читается по HTTP Range-запросам по требованию («On-demand, incremental loading», docs). (confirmed)
- [minor] replayweb-page.md:36, 204 — «Полнотекстовый поиск — не подходит» и «плагины (Flash) ограниченно» противоречат docs: есть full-text search для WACZ с текстом и desktop с поддержкой Flash. (confirmed)
- [minor] replayweb-page.md:205 — «Один WACZ за раз» — неточно (есть список архивов и multi-WACZ). (likely)
- [minor] replayweb-page.md:220 — совет «CORS-Anywhere» — публичный прокси, неуместен. Лучше дать ссылку на docs «Configuring CORS». (likely)

## kb/instruments/replay/openwayback.md

- [critical] openwayback.md:1-11, 86-106 — нет пометки о статусе. OpenWayback фактически в режиме поддержки: последний релиз 2.4.0 (2019-05), последний push 2024-01, IIPC рекомендует переход на pywb (официальный Transition Guide в docs pywb). Таблица «Производительность: Высокая — победитель OpenWayback», «Активность разработки: Средняя» и раздел «Когда использовать: требуется высокая производительность» вводят в заблуждение. Добавить предупреждение и ссылку на `pywb.readthedocs.io/en/latest/manual/owb-transition.html`. (confirmed)
- [major] openwayback.md:37-46, 119-124 — XML `<wayback><archives>…` и `<cache>` выдуманы (OpenWayback использует Spring-бины). (likely)
- [minor] openwayback.md:20-21 — Tomcat 10+ (jakarta.*) не поддерживается; уточнить «Tomcat 8/9, Java 8». (likely)
- [minor] openwayback.md:80-81 — CDX-сервер OpenWayback — отдельное приложение (`wayback-cdx-server`), а не `/wayback/cdx`. (suspect)
- [minor] Нет frontmatter, CRLF.

## kb/instruments/replay/ipwb.md

- [major] ipwb.md:50-61, 65 — неверные команды и порт. `ipwb index` пишет CDXJ в stdout (нужно `> index.cdxj`), `ipwb replay` требует путь к индексу, порт по умолчанию **2016**, а не 5000. Правильно: `ipwb index a.warc.gz > a.cdxj && ipwb replay a.cdxj` → `http://localhost:2016/`. (confirmed: README ipwb)
- [minor] ipwb.md:20 — «Python 3.6+» → в PyPI указано `>=3.9`. (confirmed)
- [minor] ipwb.md:29 — `apt-get install ipfs` — такого пакета нет; нужна kubo (бинарь или docker). Можно предложить готовый образ `docker run -p 2016:2016 oduwsdl/ipwb`. (likely; Docker — confirmed по README)
- [minor] ipwb.md:146 — `docs.ipfs.io` → `docs.ipfs.tech` (редирект). Пробел: не сказано о поддержке Memento и о том, что replay требует HTTPS за прокси (`--proxy`). (confirmed)

## kb/instruments/replay/warc2html.md

- [critical] warc2html.md:20-30, 38-51 — инструмент описан как npm-пакет (`npm install -g warc2html`, `npm link`, `--base-url`, `--index-file`). На деле **iipc/warc2html — Java** (NLA): `mvn package`, затем `java -jar warc2html.jar -o output/ input.warc.gz` (есть `-b` и `--cdx-server` для CDX11). npm-пакета нет. (confirmed: README, npm 404)
- [major] warc2html.md:58-68, 72 — структура вывода (`page1.html`, `assets/css`) и «индексный файл со ссылками на все страницы» выдуманы. Реально: файлы именуются по путям URL, `/` → `index.html`, коллизии разрешаются как `~1`, `~2`. Не учтены ограничения из README: JS-ссылки не переписываются, допускается один снимок на URL, нет resource-записей. (confirmed)
- [minor] warc2html.md:137 — wiki у репозитория нет (302 на репозиторий). (confirmed)

## kb/instruments/replay/memento.md

- [critical] memento.md:94, 101, 127, 253 — сервис **Memento Aggregator `timetravel.mementoweb.org` не резолвится** (нет DNS-записи; при этом `mementoweb.org` жив). Вся секция «федеративный поиск» с JSON/Link API нерабочая. Пометить как недоступный и предложить альтернативы (MemGator — `github.com/oduwsdl/MemGator`, самостоятельный хостинг). (confirmed: `dig` пусто)
- [critical] memento.md:80-90, 175-182 — JSON TimeMap IA (`/web/timemap/json/…`) возвращает **массив массивов** (`[["urlkey","timestamp","original",…],…]`), а не `{"mementos":{first,last,list}}`. Функция `time_map()` упадёт с `TypeError`. (confirmed: живой запрос)
- [major] memento.md:106-120 — формат ответа `api/json` («list.memento» как массив строк, URL вида `archive.ph/2025-…`) выдуман. (suspect: сервис недоступен)
- [major] memento.md:161 — `Accept-Datetime: f"{ts} GMT"` при `ts="20260615"` даёт невалидный заголовок (нужен RFC 1123: `Mon, 15 Jun 2026 00:00:00 GMT`). `quote(url, safe='')` кодирует `://`. (confirmed)
- [critical] memento.md:196-207 — waybackpy: класса `WaybackMachine` нет. В v3 есть `WaybackMachineCDXServerAPI`, `WaybackMachineAvailabilityAPI`, `Url`; методы `near(time=…)` и `snapshots(year_start…)` вымышлены. (confirmed: waybackpy 3.0.6)
- [major] memento.md:133-134 — «Memento Pattern — заголовок `Memento-Pattern` / `Link: rel="pattern"`» выдуман. В RFC 7089 «Patterns» (1.1–4) — это описания архитектурных вариантов расположения URI-R/URI-G/URI-M, а не HTTP-заголовки. (likely, по RFC)
- [major] memento.md:139-142 — подразумевается, что ISO 8601 допустим. В Memento `Accept-Datetime`/`Memento-Datetime` — только формат RFC 1123 (HTTP-date). (likely)
- [minor] memento.md:145-147 — «TimeBundle — запросить несколько URL одновременно» — неверно: TimeBundle был понятием в черновиках (агрегирующий ресурс для URI-R), а не пакетным запросом. (likely)
- [critical] memento.md:213 — ID расширения Chrome неверный (`…flnbojnbpmoiakhjhpmg`, 29 символов, ведёт на пустую страницу магазина). Правильный ID — `fpnmgdkabkmnadcjpehmlllkndpkmiak`. (confirmed: заголовки страниц)
- [critical] memento.md:216 — «Rescue Time Machine — rescuetime.org» — галлюцинация: `rescuetime.org` — сайт кафе («King Arthur Cafe»), а RescueTime (`.com`) — трекер времени. Удалить строку. (confirmed)
- [minor] memento.md:214-215 — Resurrect Pages: Google Cache закрыт в 2024. Zotero Robust Links — отдельный плагин (не «встроено»). (likely)
- [minor] memento.md:218 — висящая фраза «Пример PastPage в действии» (PastPage в таблице нет; прошлый аудит признал pastpage галлюцинацией); то же во frontmatter, строка 4. (confirmed)
- [major] memento.md:251-254 — «Memento Project — сайт IETF → `datatracker…/wg/httpbis/`» — неверно: RFC 7089 — Informational (Independent Submission), к httpbis отношения не имеет. «Memento Framework — организация… mementofoundation.org» — такой организации нет. Проект живёт на `http://mementoweb.org/` (и `/tools/`, оба 200). (confirmed: HTTP; статус RFC — likely)
- [major] memento.md:52, 55-56 — archive.today TimeGate — `archive.ph/timegate/<url>` (`/newest/` не Memento). BnF web archive доступен только в читальных залах; Gallica — электронная библиотека, а не веб-архив. Netarkivet тоже с ограниченным доступом. (likely)
- [minor] memento.md:225-228 — pywb TimeGate неверен (см. pywb.md). «OpenWayback ⚠️ Частично» — OpenWayback поддерживает Memento. Conifer: «локальный proxy» бессмысленно. SolrWayback Memento — сверить. (confirmed по pywb; остальное suspect)
- [minor] memento.md:15 — «Три типа URI», а в таблице четыре (URI-R/M/G/T). Строка 261: «ReplayWeb.page — Memento-агент» противоречит таблицам (Memento ❌). (confirmed)

---

## kb/users/index.md

- [minor] index.md:26 — «Лицензия: большинство — CC-BY 4.0» для копий сторонних сайтов юридически сомнительно и не подкреплено источником; сверить с юридическим разделом. (suspect)
- [minor] index.md:29 — «IA: часто только HTML-страницы» — неточно (IA сохраняет и медиа). (likely)
- OK: ссылки `hubofdata.ru`, `archive.org/details/@ruarxive`, `cdn.ruarxive.org/public/` отдают 200 (confirmed).

## kb/users/open-warc.md

- [major] open-warc.md:34-40 — «WebRecorder Desktop» — репозиторий **архивирован** (последний push 2021-02). Заменить на ReplayWeb.page Desktop (GitHub Releases replayweb.page). Пропущен шаг 4. (confirmed)
- [minor] open-warc.md:43 — заголовок «PyWebWayback (Python)» — несуществующее название, код использует warcio. (confirmed)
- [major] open-warc.md:67 — `warcfilter --records archive.warc.gz --pattern 'echo.msk.ru'` — таких опций нет. warcfilter: `warcfilter [-U|-T|-C|-H|-D] [-i] PATTERN FILE…`, вывод в stdout. Правильно: `warcfilter -U 'echo\.msk\.ru' archive.warc.gz > subset.warc`. (confirmed: `hanzo/warcfilter.py`)
- [minor] open-warc.md:72-73 — «WARC… без метаданных и индексов» — в WARC есть записи `warcinfo` и `metadata`. (confirmed)
- [minor] open-warc.md:82 — «Эхо Москвы (173 GB)» — точнее 186 ГБ (173 ГиБ); то же в citation.md и large-warc.md. projects/echomsk.md пишет «176 GB» — привести к одному числу. (confirmed: Content-Length)

## kb/users/citation.md

- [critical] citation.md:21, 39, 52 — URL WARC Эха `https://cdn.ruarxive.org/public/webcollect2022/echomskru2022/echo.msk.ru/echo.msk.ru.warc.gz` отдаёт **404** (в каталоге CDN лежат только `.log` и `.db`). Рабочая копия: `https://f001.backblazeb2.com/file/IKPUBLIC/webcollect2022/echomskru2022/echo.msk.ru/echo.msk.ru.warc.gz` (200, 186 234 035 346 байт), её же даёт projects/echomsk.md:22. Ссылка в образце цитирования должна работать. (confirmed)
- [minor] citation.md:41 — в BibTeX `organization = {Information Culture}` расходится с `author = {National Digital Archive of Russia (Ruarxive)}`; поле `organization` для `@misc` нестандартно. (confirmed)
- [minor] Пробел: нет формата по **ГОСТ Р 7.0.100–2018** (нормативный для русскоязычных научных работ), нет рекомендации указывать дату обращения и хеш файла (SHA-256) для проверяемости. CDX-ссылка на Backblaze рабочая (confirmed 200).

## kb/users/large-warc.md

- [critical] large-warc.md:224-235 — «Бенчмарки производительности (2026)» выдают выдуманные числа за измеренные:
  - в таблице измеряется **несуществующий** инструмент `warc-indexer-cdxj` (нет на PyPI и GitHub);
  - DuckDB «SELECT url по 173 ГБ за ~2 мин» требует ~1,4 ГБ/с распаковки одного gzip-потока — нереалистично для однопоточного gzip;
  - `warcdump` (~30 мин) медленнее индексатора (~15 мин), хотя оба на Python;
  - цифры не сходятся с replayweb-page.md:110-115 и с собственной строкой 153.
  Удалить таблицу или заменить реальным замером с методикой. (confirmed: несуществующий инструмент и противоречия; цифры — fabricated, likely)
- [critical] large-warc.md:63-73 — `split -b 1G huge-archive.warc.gz part-` и «каждый кусок можно обрабатывать отдельно» — неверно: байтовая резка рвёт gzip-члены и записи, и все части кроме первой не читаются. Резать по границам записей (warcio/jwarc-скрипт или `warcio recompress` + свой сплиттер). (confirmed по формату)
- [critical] large-warc.md:79-83 — `warcfilter --url-prefix=… -o …` — таких опций нет (см. open-warc). (confirmed)
- [critical] large-warc.md:94-99 — `wacz create --split-size 5G --filename …` — таких опций нет (есть `-o`, `--split-seeds` — другое). `.cdxj` как вход wacz не принимает (откроет как WARC). `cdxj-indexer huge.wacz` — WACZ не индексирует. (confirmed: `wacz/main.py`)
- [critical] large-warc.md:51, и inspect-warc.md:350 — `for chunk in record.content_stream(): out.write(chunk)` — **TypeError: 'LimitReader' object is not iterable** (проверено запуском warcio). Правильно: `while (b := s.read(65536)): out.write(b)` или `shutil.copyfileobj(record.content_stream(), out)`. (confirmed)
- [critical] large-warc.md:109-123 — `INSTALL duckdb_warc FROM community` и `read_warc(...)` с колонками `url, content_type, length, warc_date, response_code` не соответствуют ни одному реальному расширению:
  - `harvard-lil/duckdb-warc` грузится локальным файлом (`LOAD 'duckdb_warc.duckdb_extension'`), колонки `target_uri, type, payload_digest, date, content_length, content_type…`, HTTP-статуса нет;
  - community-расширение называется `warc` (`INSTALL warc FROM community`), и в нём функция `parse_warc()` поверх `read_blob`, без `read_warc`.
  (confirmed)
- [critical] large-warc.md:135-141 — `warc-indexer-cdxj` не существует → `cdxj-indexer`. `grep "WARC-Target-URI: …" huge.cdxj` бессмысленен: в CDXJ нет WARC-заголовков. (confirmed)
- [major] large-warc.md:100, 148-153 — «173-ГБ архив Эхо Москвы» описан как WACZ; на деле это один WARC.gz. «Первый запуск 5–15 мин» противоречит «CDXJ внутри WACZ». (confirmed)
- [major] large-warc.md:162-171 — `recurse: true`, «pywb строит CDXJ при первом обращении, кеширует в Redis» — выдумано (см. pywb.md). (confirmed)
- [major] large-warc.md:180-189 — `id_`-URL Wayback отдаёт оригинальный ответ, а не WARC. `-o '{}.warc.gz'` с URL в имени файла не сработает (слэши). Переписать (`curl -o "$ts.html"`). (confirmed)
- [major] large-warc.md:195-209 — плейсхолдер `pass` вместо записи. Работает просто `writer.write_record(record)` для записей из `ArchiveIterator`. (confirmed)
- [minor] large-warc.md:12 — «большая часть архивов IA — от ГБ до сотен ГБ» — у IA WARC-файлы обычно ~1 ГБ. Строка 246: «Ruarxive обслуживает ~0.5–1 ТБ» — неподтверждённое утверждение. Строка 263: «pywb с Redis обязателен» — неверно. Строка 253: «индексы в zip замедляют» противоречит WACZ и `.cdx.zip` из citation.md. (likely/suspect)

## kb/users/inspect-warc.md

- [critical] inspect-warc.md:80 — `warc-headers` (warchaeology) не существует. В warchaeology подкоманды `warc ls|cat|validate|dedup|convert|aart|console` (проверено по `cmd/`); установка Go-бинаря, а не `pip install warchaeology` (строка 390, нет на PyPI). Правильно: `warc ls archive.warc.gz`. (confirmed)
- [critical] inspect-warc.md:95, 233 — `warcfilter --records … --pattern …` и `warcfilter --content-type='text/html' … -o` — неверный синтаксис (см. выше; `-C` — булев флаг + позиционный PATTERN, вывод в stdout). (confirmed)
- [critical] inspect-warc.md:174 — `warcdump --headers-only` — такой опции нет (опции warcdump: `-l -I -L`). (confirmed)
- [critical] inspect-warc.md:270 — `wb-grep` — выдуманная утилита. (confirmed: нет в entry points pywb)
- [critical] inspect-warc.md:323 — `warc-indexer-cdxj` → `cdxj-indexer`. Строка 330 «CDXJ-формат — JSON Lines» неверна: формат `SURT TIMESTAMP {json}` (противоречит cdx.md). (confirmed)
- [major] inspect-warc.md:193 — «ускорение в 100–1000 раз» при чтении только заголовков — неверно: `ArchiveIterator` всё равно распаковывает весь gzip-поток. Выигрыш небольшой. (confirmed по устройству warcio)
- [major] inspect-warc.md:345 — «Запись может быть в `continuation`-блоках — warcio собирает автоматически» — неверно: warcio не склеивает сегментированные записи. (likely)
- [critical] inspect-warc.md:350 — нерабочая итерация `content_stream()` (см. large-warc). (confirmed)
- [minor] inspect-warc.md:29-45 — «типичная строка вывода warcdump» на деле не вывод warcdump: он печатает блоки `archive record at …`, `Headers:` с табуляцией. Нет обязательного `WARC-Record-ID`. Конструкция `grep … | awk '{print $2}'` (строка 51) может не сработать. (suspect)
- [minor] inspect-warc.md:221 — пример вывода показывает `text/html`, а код группирует по главному типу (`text`). Строка 360: `KeyError` не возникает (`get_header` возвращает `None`). Строка 363: `warc-validate` не существует → `warcio check` / `warcvalid`. Строка 391: `pip install duckdb-warc` — пакета нет на PyPI. (confirmed)

---

## kb/guides/warc-workflow.md

- [critical] warc-workflow.md:47-53 — `pip install warcvalid` (пакета нет на PyPI) и «`warcvalid` (часть пакета `jwarc`)». На деле warcvalid — из `warctools` (`pip install warctools`); jwarc — Java (`jwarc validate`). Противоречит warc.md. (confirmed)
- [critical] warc-workflow.md:100 — `npm install -g @webrecorder/cdxj-indexer` — пакета нет → `pip install cdxj-indexer`. (confirmed)
- [major] warc-workflow.md:94 — «чтобы искать страницы, на которых встречается слово X, нужен CDXJ» — неверно: CDXJ — индекс по URL и времени, а не полнотекстовый (страница сама это признаёт в строке 327). Ссылка `cdx-format/cdxj.html` отдаёт 404 → `https://specs.webrecorder.net/cdxj/0.1.0/`. (confirmed)
- [major] warc-workflow.md:108-122 — «CDXJ через warcio» пишет `URL ISO-дата {"status":"ok"}` — непригодно для pywb и ReplayWeb.page. Удалить или заменить на `cdxj-indexer`. Строка 124: «cdxj можно использовать в ReplayWeb.Page для поиска» — неверно. (confirmed)
- [critical] warc-workflow.md:140-147 — `metawarc --input … --output … --extract-links --detect-mime` выдуман. Реальный CLI: `metawarc index '…/*.warc*' --dbfile collection.db`, `metawarc index-content --type links`, `metawarc analyze links`, `metawarc export-cdxj`. metawarc **не создаёт** обогащённый WARC с `metadata`-записями (строка 147), а строит DuckDB-каталог. (confirmed: README metawarc)
- [major] warc-workflow.md:150 — ссылка `webrecorder.net/blog/announcing-the-wacz-format.html` отдаёт 404 → `https://specs.webrecorder.net/wacz/1.1.1/`. (confirmed)
- [critical] warc-workflow.md:160-187 — «WACZ вручную» даёт **невалидный WACZ**:
  - CDXJ лежит в корне, а не в `indexes/`;
  - нет обязательного `pages/pages.jsonl`;
  - у ресурсов `stats.bytes` вместо `bytes` и `hash`;
  - нет `datapackage-digest.json`;
  - `zip -r` по умолчанию DEFLATE, а спецификация требует STORE для `archive/` и `*.cdx.gz`;
  - `stat -c%s` не работает на macOS.
  Удалить и оставить только `wacz create`. (confirmed: спецификация WACZ 1.1.1)
- [critical] warc-workflow.md:193-198 — `wacz create --filename … --description … my-archive.warc.gz my-archive.cdxj` — флагов нет (`-o`, `--desc`), `.cdxj` как вход недопустим. Противоречит wacz.md. (confirmed)
- [critical] warc-workflow.md:217-226 — pywb: `wb-manager add my-collections my-archive /path/to.wacz` (лишний аргумент станет «файлом»), `wayback --collections` (нет флага), WACZ без `--unpack-wacz`, URL `/my-archive/…` не совпадает с коллекцией. Это третий отличающийся вариант на разных страницах (cdx.md, pywb.md, этот гайд). (confirmed)
- [critical] warc-workflow.md:311-320 — `split -b 5G big-archive.wacz` даёт невалидные ZIP. «ReplayWeb.Page откроет часть файла» — неверно. Удалить. (confirmed)
- [major] warc-workflow.md:359 — «CDXJ… в открытом формате (JSON Lines)» — неверно (см. выше). (confirmed)
- [minor] warc-workflow.md:290-291 — в выражении Cloudflare смешаны `wildcard` и regex-литерал `r"…"`; regex — это оператор `matches`. (likely)
- [minor] warc-workflow.md:241 — «ReplayWeb.Page скачивает WACZ» — читает по Range-запросам. (confirmed)
- OK: CORS-примеры для S3/R2 и лимиты (S3 5 ТБ, R2 ~5 ТиБ, B2 $6/ТБ) правдоподобны. Типы записей в warcio-проверке (строки 73-75) включают `resource` — это верно, в отличие от warc.md.

## kb/guides/warc-deduplication.md

- [critical] warc-deduplication.md:166-180, 228 — **концептуальная ошибка**: полной оставляют «самую свежую копию», а более ранние превращают в revisit («Брать первую встречу, а не самую свежую» объявлено антипаттерном). Revisit по определению ссылается на **ранее** записанный оригинал (`WARC-Refers-To-Date` ≤ `WARC-Date`); стандартная практика (Heritrix, pywb `dedup_policy: revisit`) — первая встреча остаётся полной. Арифметика «1 полная → 1 + 2 revisit» тоже неверна. (confirmed по WARC 1.1 §revisit и docs pywb)
- [major] warc-deduplication.md:34-42 — `WARC-Profile` указан как URL страницы спецификации. Правильный идентификатор: `http://netpreserve.org/warc/1.1/revisit/identical-payload-digest`. Нет `WARC-Refers-To-Target-URI`/`-Date`; заголовок `WARC/1.0` при профиле 1.1; блок помечен как ```python. (confirmed)
- [critical] warc-deduplication.md:82-104, 233-246, 263-266, 293-294 — `warc-dedup --info/--revisit -o` (warchaeology) выдуман, а warchaeology назван «IIPC-инструмент». Это Национальная библиотека Норвегии, команда — `warc dedup` (есть в `cmd/dedup`), флаги нужно сверить с документацией. Вывод «Reduction: 91.5%» выдуман. (confirmed: дерево `cmd/`; флаги — confirmed отсутствие `warc-dedup` бинаря)
- [critical] warc-deduplication.md:260-268 — «Эхо Москвы: ежедневная архивация 8 3 года подряд → 173 ГБ → 80 ГБ» — выдумано. Архив Эха собран **однократно 3–4 марта 2022** (projects/echomsk.md:15, листинг CDN от 04-Mar-2022) — дедуплицировать «по дням» нечего. Удалить сценарий. (confirmed)
- [critical] warc-deduplication.md:111-138 — SQL невалиден: `GROUP BY warc_payload_digest` при неагрегированных `url, warc_date` даёт ошибку в DuckDB. Колонок `warc_payload_digest/warc_type/url/warc_date` нет ни в одном DuckDB-WARC-расширении (у harvard-lil: `payload_digest, type, target_uri, date`). (confirmed)
- [major] warc-deduplication.md:140-152, 253-254 — `pywb config: dedup: enabled/algorithm` и «pywb: SimHash + payload» выдуманы. В pywb дедупликация есть только при **записи**: `recorder: dedup_policy: skip|revisit|keep` + Redis. SimHash в pywb нет. Ссылка на wiki `Deduplication` (строки 142, 308) **не существует**. (confirmed: `configuring.rst`, wiki «Create new page»)
- [critical] warc-deduplication.md:276-285 — `from tgarc import dedup; dedup.run(...)` выдуман. У tgarc только команды `configure/logout/save` (README; код ведётся в `AduchiMergen/tgarc`). (confirmed)
- [major] warc-deduplication.md:160, 310 — ссылка `commoncrawl/commoncrawl-crawler` ведёт на **архивный** репозиторий кода 2008–2012 гг. (неудачная замена из прошлого аудита). Строка 77 «Hash+Content-Type+Content-Length используется в Common Crawl» без источника. (confirmed / suspect)
- [major] warc-deduplication.md:290-302 — «IA сам поддерживает WARC-revisit при работе с поданными архивами» вводит в заблуждение: WARC, загруженные пользователями через `ia upload`, не попадают в Wayback Machine без специального соглашения. `mediatype:web` требует прав. (likely)
- [minor] warc-deduplication.md:186-188 — заголовок «Не уменьшает, а пересортировывает» противоречит тексту «уменьшится в 2–10 раз». Таблица «Метрики» (196-204) без источника. Строка 220: «теряем историю» неверна для revisit-дедупликации. (confirmed)

## kb/guides/link-graph-analysis.md

- [major] link-graph-analysis.md:26-48 — структура WAT неверна. В реальном WAT `WARC-Target-URI` находится в `Envelope → WARC-Header-Metadata`, ссылки — в `Envelope → Payload-Metadata → HTTP-Response-Metadata → HTML-Metadata → Links` с ключами `url`/`path` (`"A@/href"`)/`text`. На странице: `Containers`, `Link`, `href`. Код по такому описанию не заработает. (likely, хорошо известный формат CC)
- [major] link-graph-analysis.md:130 — «pywb имеет встроенные возможности извлечения ссылок через `wbui`» — выдумано. (confirmed: нет в docs и entry points)
- [major] link-graph-analysis.md:88-91 — `docker run -p 8080:8080 medialab/hyphe` — такого образа нет. Hyphe ставится через `docker compose` (образы `scpomedialab/hyphe_*`). Строка 85: Hyphe — краулер живого веба (есть режим обхода через веб-архивы), а не «инструмент для link-graph в веб-архивах». (confirmed: Docker Hub 404, README)
- [major] link-graph-analysis.md:256-266 — логика детектора бот-сетей противоречива: `anchors` — set, и условие `len(anchors) > 100 and len(set(anchors)) < 5` никогда не выполнится. `links_with_anchors` не определена. (confirmed)
- [minor] link-graph-analysis.md:188 — `ig.save(G_igraph, "graph.gexf")`: igraph не пишет GEXF, а `G_igraph` не определён. Строки 115-118: `BVGraph.load` принимает basename (без `.bvg`), `NodesIterator` не импортирован. Строка 290: «NetworkX 50 млн рёбер ≈ 4 ГБ» сильно занижено (реально десятки ГБ). (likely)
- [major] link-graph-analysis.md:375-376 — `gephi.org/tutorials/` отдаёт 404. «ESGI link-graph workshop» ведёт на `web.archive.org/web/2024*/` без URL — **плейсхолдер**. (confirmed)
- [major] Пробел: не упомянуты стандартные решения — Archives Unleashed Toolkit (извлечение ссылок из WARC, графы доменов) и готовые host/domain-level web graphs Common Crawl (`commoncrawl/cc-webgraph`, ежеквартальные релизы). (likely)
- [minor] link-graph-analysis.md:340 — `"crawl_date": "2026-11-09"` — дата в будущем. Строка 356: «Для экологии — без фильтра» — бессмыслица. (confirmed)

## kb/guides/dynamic-ajax-sites.md

- [critical] dynamic-ajax-sites.md:36-44 — описание кейса **противоречит источнику** (пост t.me/ruarxive/35 от 05.04.2022, сверено). zapovednik.space — это медиа «Заповедник | Россия за пределами столиц», а не «витрина природных фотогалерей заповедника». Контент грузится через `https://zapovednik.space/api/material?id=…` (JSON на каждый материал), а не через infinite scroll `/-/api/feed?cursor=…`. «5 КБайт» в посте нет. Переписать по посту. (confirmed)
- [critical] dynamic-ajax-sites.md:70-74 — «Brozzler — **Java**-система» — неверно, Brozzler на **Python** (Internet Archive). `brozzler-new-job -i warp01 -o out.warc.gz -s URL` выдуман: `brozzler-new-job` принимает YAML-файл задания, для сайта — `brozzler-new-site URL`, а для одиночной страницы — `brozzle-page URL`. Повтор в строке 134. (confirmed: репозиторий и README)
- [major] dynamic-ajax-sites.md:56, 63 — `--scope page` — флага нет (правильно `--scopeType`). `scopeType=page` означает «только стартовая страница», то есть ровно противоположное описанию «обходит всё, что достижимо по кликам». Для такого кейса — `--scopeType prefix`/`host` или `page-spa`. Здесь же: `--generateWacz` допустим как alias, `--timeout`/`--delay` — алиасы `pageLoadTimeout`/`pageExtraDelay`, но `--delay` — пауза **после behaviors на странице**, а не «между запросами». (confirmed: `argParser.ts`)
- [critical] dynamic-ajax-sites.md:92-103 — YAML-шаблон filegetter (`patterns/headers/output/download.threads/delay_ms`) выдуман. filegetter настраивается файлом **`filegetter.cfg` (INI)** с секциями `[project]`, `[data]`, `[files]` (`fetch_mode=pattern`, `root_url` с `{}`, `delay`, `workers`), а запускается командой `filegetter run`. (confirmed: README filegetter)
- [major] dynamic-ajax-sites.md:112 — `github.com/ruarxive/warcworker` — **404**. «Слить всё в один WARC при помощи warc2zim» — warc2zim не объединяет WARC. Для склейки достаточно `cat a.warc.gz b.warc.gz > all.warc.gz` (per-record gzip это допускает) или `warcio recompress`. (confirmed)
- [minor] dynamic-ajax-sites.md:30-31 — «Не подходит, если контент генерируется исключительно из JS без API» — противоречит тексту: именно этот случай решают headless-краулеры. (confirmed)
- [minor] dynamic-ajax-sites.md:128 — `ikreymer/pywb` → `webrecorder/pywb` (редирект). Строка 129: warc-gpt — RAG/чат, а не полнотекстовый поиск. Строки 135 и 139: дубль ссылки на metawarc. (confirmed)

---

## Противоречия между страницами (сводно)

1. **Формат CDXJ.** Его описывают тремя разными способами:
   - cdx.md:116 — `SURT TAIL_JSON` (без timestamp), хотя пример на строке 136 с timestamp;
   - inspect-warc.md:330 и warc-workflow.md:359 — «JSON Lines»;
   - warc-workflow.md:94 — «полнотекстовый индекс».
   Каноническое определение: `SURT TIMESTAMP {json}` (спецификация CDXJ 0.1.0). Нужно одно определение в cdx.md и ссылки на него с других страниц.
2. **pywb quickstart.** Три разных и одинаково неверных варианта: cdx.md:67/184, pywb.md:76/107-108, warc-workflow.md:217-223.
3. **`wacz create`.** wacz.md (`-o` + каталог, `--description`), warc-workflow.md (`--filename`, `--description`, `.cdxj` на входе), large-warc.md (`--split-size`, `--filename`). Правильно только `-o` и файлы на входе, плюс `--desc`.
4. **warcvalid.** warc.md — из warctools (верно); warc-workflow.md — `pip install warcvalid` и «часть jwarc» (неверно).
5. **Индексатор.** `cdxj-indexer` (pip) против выдуманных `@webrecorder/cdxj-indexer` (npm) и `warc-indexer-cdxj`.
6. **Эхо Москвы.** «173 ГБ WACZ» (replayweb-page, large-warc), «173 ГБ WARC» (citation), «176 GB» (projects/echomsk), фактически 186 ГБ (173 ГиБ) WARC.gz; в dedup-гайде — «ежедневно 3 года».
7. **Таблицы возможностей replay** (index.md и pywb.md) расходятся по Self-hosted, Memento для IPWB и авто-индексации ReplayWeb.page.
8. **Типы WARC-записей.** warc.md без `resource`, warc-workflow.md с `resource`.
9. **ReplayWeb.page и большие файлы.** Время открытия расходится в трёх местах: replayweb-page.md:110-115, large-warc.md:153 и large-warc.md:234.

## Заметные пробелы (кратко)

- Нет единой страницы «статус инструментов»: OpenWayback (maintenance, переход на pywb), WebRecorder Desktop (архивирован), Loris (заброшен), Memento TimeTravel (недоступен), bagit-java.
- Нет PDF/A-4, SIARD 2.1/2.2, METS 2, HTJ2K, IIIF Auth 2.0.
- Нет jpylyzer, JHOVE, DBPTK, OutbackCDX, Archives Unleashed Toolkit, cc-webgraph, MemGator.
- В citation.md нет ГОСТ Р 7.0.100–2018.

---

## Top-10 (по приоритету исправления)

1. **pdfa.md:113-121, mbox.md:118-119, mhtml.md:113, jp2.md:104** — почти все PUID PRONOM неверны: fmt/353 — это TIFF, fmt/795 — RPM, fmt/1014 — INTERLIS, fmt/149 — JTIP. Верные: PDF/A-1a…3u = fmt/95, 354, 476–481; MBOX fmt/720; MHTML x-fmt/429; JP2 x-fmt/392. При этом страницы прямо советуют сохранять PUID в метаданных. (confirmed)
2. **pywb.md:11/55-58/76/107-108/137-156 + warc-workflow.md:217-226 + cdx.md:67** — команды и конфиг pywb выдуманы и расходятся между страницами: `wb-manager init .`, `wayback --collections`, том `/archive` вместо `/webarchive`, ключи `server:`/`recurse`/`auto_index`. Плюс ложное «pywb обслуживает archive.org». (confirmed)
3. **replayweb-page.md:100-133, 169-201, 217** — выдуманы функции (аннотации, Export Page, Diff, JS-API `$wb.loadWacz`, URL-параметры). Есть вредные советы: `split` WACZ, открыть по HTTP, npm-пакет `@webrecorder/cdxj-indexer`, которого не существует. (confirmed)
4. **users/large-warc.md:224-235 (и :63-141)** — «бенчмарки 173 ГБ Эха» выдуманы (измеряется несуществующий `warc-indexer-cdxj`, DuckDB на 1,4 ГБ/с, цифры противоречат другим страницам). Плюс битый `split` WARC.gz, выдуманные флаги warcfilter/wacz и DuckDB-API. (confirmed)
5. **guides/warc-deduplication.md:166-180, 228, 82-104, 260-285** — revisit направлен в обратную сторону (свежая копия полная, ранние — revisit). Выдуманы `warc-dedup`, `tgarc.dedup`, конфиг дедупликации pywb, SimHash; кейс Эха с «экономией 54 %» на однократном сборе. (confirmed)
6. **cdx.md:35-36, 55-58, 116** — неверная легенда CDX (S/V), неверный SURT и формат CDXJ без timestamp; на этом же построены генератор и примеры. (confirmed)
7. **wacz.md:127-139, 83-87, 50/69** и **warc-workflow.md:160-198** — выдуманы структура `datapackage-digest.json` и флаги `wacz create`. Ручная сборка даёт невалидный WACZ, а том Browsertrix `/crawl/data` теряет результат. (confirmed)
8. **memento.md:94-127, 80-90, 196-207, 213, 216, 251-254** — Memento Aggregator (timetravel) не резолвится; формат JSON TimeMap IA неверен; API waybackpy выдуман; неверный ID расширения Chrome; «Rescue Time Machine» ведёт на сайт кафе; «mementofoundation» и «httpbis» как дом Memento — неверно. (confirmed)
9. **siard.md:58/77-79/13-14, jp2.md:24/53/59/73/78** — SIARD Suite подан как коммерческий продукт со ссылкой на припаркованный домен deepfinity; «официального конвертера нет» — ложь; версии устарели (есть 2.1/2.2). JP2 Part 15 — это HTJ2K, а не «профиль PDF/A»; `opj_compress -n 0`, `vips jpe2000save`, Grok-Python выдуманы. (confirmed/likely)
10. **dynamic-ajax-sites.md:36-44, 56-74, 92-112** — кейс zapovednik.space искажён относительно первоисточника (поста #35). Brozzler назван Java-системой с выдуманным CLI, `--scope page` задаёт обратную семантику, YAML-конфиг filegetter выдуман (реально INI `filegetter.cfg`), `ruarxive/warcworker` даёт 404. (confirmed)

Также срочно (крупные, но вне top-10): `warc2html.md` целиком описывает несуществующий npm-инструмент вместо Java-утилиты NLA; `openwayback.md` без пометки о статусе maintenance и переходе на pywb; `citation.md:21,39` — URL образца цитирования отдаёт 404; `inspect-warc.md` — `warc-headers`, `wb-grep`, `warcdump --headers-only` не существуют; `bagit.md:66,137` — `bagit.py --create` не существует.
