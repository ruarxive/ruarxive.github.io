# Журнал исправлений F3 — `kb/instruments/file-formats/*` (2026-10-12)

Охват: 15 файлов `kb/instruments/file-formats/*.md`. Учтены замечания из `part-C-formats-replay-users.md` (разделы file-formats + сводка по форматированию), `kb-review-2026-10-12.md` (§3, §4: PUID, легенда CDX, wacz, bagit, siard, jp2, namespace aiim.org).

## Общее

- Во всех 15 файлах есть frontmatter `title` / `description` / `last_updated: 2026-10-12`; `sidebar_position: 3` у `warc.md` сохранён (у остальных его не было). `index.md` сохраняет `DocCardList`.
- CRLF уже отсутствовал (проверено), файлы в LF.
- Проверка MDX: все 15 файлов компилируются `@mdx-js/mdx` 3.1.1 в режиме `mdx` (+remark-gfm); чётное число ```; нет голых `{ } <` вне кода; все внутренние ссылки `/kb/...` существуют.
- PUID сверены с сигнатурным файлом DROID V125 (`richardlehane/siegfried/cmd/roy/data/DROID_SignatureFile_V125.xml`), карточки PRONOM открываются (200).
- Живые проверки во временном venv (`/tmp/venv-f3`): warcio 1.8.1, cdxj-indexer 1.5.0, wacz (py-wacz) 0.6.0, bagit 1.9.0, opf-fido 1.6.1, jpylyzer 2.2.1, playwright 1.63.0; локально OpenJPEG 2.5.4, ImageMagick 7.1.2, xmllint. Python-сниппеты на страницах warc, cdx, mbox, mhtml, bagit запущены и работают.

## По файлам

### warc.md
- Добавлен тип `resource` (8 типов по ABNF WARC 1.1); `conversion` переписан по §6.8 (миграция формата, не скриншот); `revisit` — обязательный `WARC-Profile`, рекомендуемые `WARC-Refers-To-*`; `continuation` — сегментация по размеру WARC-файла.
- ISO 28500:2009 (1.0) / ISO 28500:2017 (1.1); PUID WARC `fmt/289`, `fmt/1355`, `fmt/1281`.
- Переписан абзац про сжатие: `.warc.gz` — gzip по записям, не внешний архив; WARC не пакуют в ZIP (кроме WACZ, без сжатия).
- ARC: убрано «Archive-It», убран тезис про SPA.
- JHOVE: модуль `WARC-kb` (проверено по исходнику `WarcModule.java`), команда `jhove -m WARC-kb`.
- Исправлена логика дайджестов (Block vs Payload, revisit сравнивается с исходной записью), опечатка «запейсей».
- Валидация: `warcio check -v` (проверено), оговорка про `Content-Length` (блок с HTTP-заголовками), защита от `http_headers is None`. Якорь ссылки на спецификацию исправлен на `#warc-record-types` (проверен).

### wacz.md
- Структура по WACZ 1.1.1: `pages/pages.jsonl` обязателен, `extraPages.jsonl`, `logs/`, `index.idx`; индексы — CDXJ; требование STORE для `archive/` и `*.cdx.gz`; ссылка на спецификацию; PUID `fmt/1840`.
- `datapackage.json` — пример реального вывода py-wacz 0.6.0 (`wacz_version`, `resources[].hash/bytes`); `datapackage-digest.json` — только `path` + `hash` (+ `signedData`), ссылка на WACZ Signing.
- `wacz create`: входы — файлы (`dir/` даёт `IsADirectoryError`, проверено), `--desc` вместо `--description`, описаны `-p`, `-e`, `--detect-pages`, `--text`, `-l`, `--url/--ts`; добавлен `wacz validate -f`. Дублирующийся раздел «Преобразование WARC в WACZ» объединён.
- Browsertrix: `-v $PWD/crawls:/crawls/`, коллекция без пробела (по README/argParser).
- ZIM: раздел переименован в WARC → ZIM; `warc2zim --name … --output DIR --zim-file … --url …` (по `main.py` 2.3.1); `zimdump info` / `zimdump list` (по `zimdump.cpp`); убран тезис «анонимность».
- «Невалидного ручного рецепта» в текущей версии файла не было — удалять нечего.

### cdx.md
- Легенда по CDX-2015: S = размер сжатой записи, V = смещение; пример — реальная строка из спецификации; вывод `cdxj-indexer -11`.
- SURT: ключи `com,example)/path?q=1`, `org,archive)/`; полная форма `http://(com,example,www,)/…`; префиксный поиск `com,example)` / `com,example,`.
- CDXJ: единый формат `SURT TIMESTAMP {JSON}`, обязательные поля по CDXJ 0.1.0, пример из спецификации + реальный вывод cdxj-indexer (строковые значения, `sha1:`-дайджест), ссылка на спецификацию.
- `wb-manager add/index <coll> <files…>` (по `manager.py` pywb 2.10.0); `cdx-indexer` — скрипт из pywb; рекомендован `cdxj-indexer`.
- Удалён выдуманный `cdx-toolkit query`; объяснено, что `cdx_toolkit`/`cdxt` работает с удалёнными API; добавлен `LC_ALL=C look` (проверен).
- Удалён выдуманный XML OpenWayback; описаны `wayback.xml`/`CDXCollection.xml` (проверено в iipc/openwayback), релиз 2.4.0 (2019), ссылка на OWB→pywb transition guide.
- OutbackCDX со ссылками; удалён висящий пункт; генератор CDX на warcio заменён на `cdxj-indexer -11` и рабочий пример чтения записи по offset/length (проверен).

### mhtml.md
- PUID `x-fmt/429`. Убраны: «IA до 2008 хранил MHTML», `--print-to-mhtml`, `curl PUT /json`, `requests-mhtml`, пакет `mhtml`, `libwkhtmltox`, «Safari открывает MHTML», совет конвертировать через warcprox/wget.
- Добавлен рабочий пример Playwright + CDP `Page.captureSnapshot` (проверен с локальным Chrome) и рабочий рецепт MHTML → WARC `resource`-записи через warcio (проверен `warcio check`). Исправлена строка таблицы.

### premis.md
- PREMIS 3.0: 4 сущности, категории Object (intellectualEntity/representation/file/bitstream), `xsi:type`.
- Связи: `relationship` / `linkingIntellectualEntityIdentifier`; `statute` вместо `statutory`; блоки `*Information`.
- XML-примеры переписаны и проходят `xmllint --schema premis.xsd` (PREMIS 3.0); значения `capture`, `executing program`, `structural`, `is Included In` сверены со словарями id.loc.gov (JSON). Исправлена путаница `linkingAgentIdentifierType`/роль.
- Ссылки на PREMIS in METS (`premis-mets.html`) и словари; команда валидации со скачиванием схемы (xmllint не грузит HTTPS).

### mets.md
- Обязательна только `structMap` (по mets.xsd 1.12.1), `metsHdr` необязателен; 7 секций без пропусков, четыре подсекции amdSec, `behaviorSec`.
- Контрольная сумма — атрибуты `CHECKSUM`/`CHECKSUMTYPE` (значения из xsd).
- Удалены «METS Validator LoC CLI» и «GoLoji»; оставлен xmllint (со скачиванием схемы — проверено).
- Битые ссылки `mets-extended.html` и `premis-mets-guidelines-v1-0.html` (404) заменены на `mets-examples.html`, `premis-mets.html`; DSpace-wiki (403) удалена.
- Добавлены METS 1.12.1 (2019) и METS 2 (namespace, изменения) по README `mets/METS-schema`. Полный пример проходит валидацию по mets.xsd.

### bagit.md
- `bagit.py --create`/`--metadata` заменены реальными командами (bag-in-place, `--sha256`, `--source-organization`, `--contact-name`, `--validate`, `--validate --fast`) — проверено запуском 1.9.0; отмечено, что bagit-python пишет `BagIt-Version: 0.97`.
- Обязательные элементы по RFC 8493 (tagmanifest — необязательный); `fetch.txt` — `url length filepath`; рекомендации по алгоритмам по тексту RFC (MUST SHA-256/512, SHOULD SHA-512).
- `BagIt-Profile-Identifier` (по BagIt Profiles spec); убраны битый APTrust PDF, «BTRS Profile», DuraCloud (403); добавлены bagit-profiles и APTrust user guide.
- Авторы RFC и участие CDL; пометка о bagit-java (последние изменения 02.2024).

### pdfa.md
- PUID-таблица исправлена и дополнена PDF/A-4/4e/4f (DROID V125).
- Добавлен PDF/A-4 (ISO 19005-4:2020, PDF 2.0); уточнены запреты (JS, мультимедиа, вложения, прозрачность).
- LibreOffice: `SelectPdfVersion` (по справке LibreOffice); Ghostscript: `PDFA_def.ps` + ICC, только уровень b для 1–3 (по документации Ghostscript; `UseDeviceIndependentColor` там допустим, но в примере взят официальный `RGB`).
- veraPDF: реальные опции (`--flavour`, `--recurse`, `--format xml|mrr|json|html|text|raw`, `--profile` = файл, `--fixmetadata`) по `VeraCliArgParser.java`, список flavour по `PDFAFlavour.java`; убраны `--input`, `--regress`, `--format junit`, `apt install verapdf`.
- Удалены непроверенные PDFBox-команда и «PDF/A Manager от PDFTron»; опечатка «свёрзаются».
- **XMP namespace `http://www.aiim.org/pdfa/ns/id/` не менялся** (добавлено пояснение, что это идентификатор, а не ссылка).

### mbox.md
- PUID MBOX `fmt/720`; у Maildir PUID нет.
- Таблица вариантов переписана по Wikipedia (mboxo/mboxrd/mboxcl/mboxcl2/MMDF; Mozilla — вариация mboxrd); убраны «From-в-тележек», «RFC 4155 рекомендует mboxrd».
- Удалён несуществующий `mailbox.mboxcl`; добавлено проверенное поведение `mailbox.mbox` (экранирует как mboxo, при чтении не снимает).
- Фильтр по дате переписан на `parsedate_to_datetime` (проверен, без NameError).
- `readpst -r -D -o out/` (по man-странице Debian, пакет `pst-utils`); `formail`/`maildir2mbox` заменены проверенным Python-рецептом Maildir → mbox.
- Совет «перекодировать в UTF-8» заменён на «хранить как есть» (DKIM); ссылка на несуществующую ru.wikipedia/PREMIS заменена на `/kb/instruments/file-formats/premis`; добавлена LC FDD fdd000383.

### siard.md
- SIARD Suite — бесплатная, открытая (CDDL-1.0) программа Федерального архива Швейцарии, репозиторий `sfa-siard/siard-suite` (релиз 2.2.167), утилиты `siard-from-db`/`siard-to-db`; удалён припаркованный домен deepfinity.
- Версии 1.0/2.0/2.1/2.2 с PUID `fmt/161`, `fmt/995`, `fmt/1196`, `fmt/1777`; eCH-0165; рекомендация SIARD 2.2.
- Структура архива исправлена по исходникам `siard-api` (`header/metadata.xml`+`.xsd`, `content/schemaN/tableN/tableN.xml`+`.xsd`, `lobN/recordN`).
- Удалены выдуманный Java-API, «официального конвертера нет», рецепт pg_dump, `VACUUM FULL`, битый URL bar.admin.ch (502). Добавлен DBPTK с командой из README (4.4.1). Опечатка «реестр».

### jp2.md
- Part 15 = HTJ2K (`fmt/1964`); таблица частей с PUID (JP2 `x-fmt/392`, JPX `fmt/151`, MJ2 `fmt/337`, JPM `fmt/463`, codestream `fmt/1794`).
- `opj_compress`: lossless по умолчанию, `-r` = степень сжатия, `-q`, `-n` (1–33, `-n 0` → ошибка), `-t`, `-I` — всё проверено запуском OpenJPEG 2.5.4 (попиксельное совпадение после декодирования).
- `vips jp2ksave … --lossless --tile-width --tile-height` (по документации libvips); пакет `libopenjp2-tools` (openjpeg-tools в Debian stable нет).
- Удалён выдуманный Python-API Grok (дан CLI `grk_compress`, есть в репозитории), `jp2info` заменён на jpylyzer (проверен), добавлен `opj_dump`.
- Исправлена нумерация боксов; ссылка LoC → `fdd000143`; убрано непроверенное «на 20–30% меньше JPEG»; сценарии без упоминания конкретных архивов (ГАРФ/РГА/«Российская газета») как будто это работы Ruarxive.

### iiif.md
- Валидный URL-пример (`256,256,1024,1024/max/0/default.jpg`), `max` вместо `full`, поворот 0–360 и `!`, `pct:`/`square`.
- Список API по iiif.io: Authorization Flow 2.0, Content Search 2.0, Change Discovery 1.0, Content State 1.0; Presentation 4.0 — RC.
- Loris — Image API 2.0, не развивается (09.2023); digilib → `github.com/robcast/digilib`; Mirador — обязательный `id` (по README).
- Опечатка «отчекан»; `digiprovMD` отнесён к METS; примеры переведены на `iiif.example.org` вместо несуществующих `ruarxive.org/iiif/...`; сценарии без конкретных архивов.

### identification-tools.md
- Установка Siegfried по README 1.11.9 (brew tap, apt-репозиторий автора, `go install`, `sf -update`, `roy`), примеры `-csv/-json/-z/-multi`.
- DROID: команды из README (6.9.14). FIDO: `fido -recurse` (проверено). Добавлены `file`/libmagic, раздел «Идентификация и валидация» (JHOVE, veraPDF, jpylyzer, warcio).
- TrID: офлайн CLI и предупреждение о загрузке файлов на сторонний сервер. Siegfried WASM — ссылка на `wasm/` в репозитории. Demystify Lite — описание по README.

### format-registries.md
- `fdd000397` (DOCX) → `fdd000125` (PDF/A-1); `Q11272` (Excel) → `Q42332` (PDF) — по заголовкам LoC и Wikidata API.
- «File Formats Wiki → fileformat.info» и битый `justsolve.archiveteam.org` объединены в один раздел `fileformats.archiveteam.org` (200); FileFormat.Info описан как справочник, не вики.
- Удалён раздел Game File Format Central (ModdingWiki не отвечает, репозиторий Malvineous/game-file-formats — 404, цифра «1300 форматов» без источника).
- Digipres описан по странице `/formats/`; «регистры» → «реестры», устранён повтор заголовка «Рекомендации».

### index.md
- Добавлен frontmatter; DocCardList сохранён.

## Не удалось подтвердить / оставлено с оговоркой

- `iso.org` (ISO 19005-1, ISO 15444) и `pdfa.org/pdf-a/` отдают 403 на curl (защита от ботов) — ссылки оставлены как были, содержимое не проверено.
- `id.loc.gov/vocabulary/preservation.html` отдаёт 403 на curl, но JSON-версия того же словаря — 200; ссылка оставлена.
- `vips jp2ksave` не запускался (libvips не установлен) — сверено только с документацией libvips.
- Параметры CLI SIARD Suite (`siard-from-db`) и Grok (`grk_compress`) не приведены — только названия утилит и ссылки на руководства.
- Годы выпуска SIARD 1.0/2.0/2.1 не указаны (надёжного источника не нашёл).
- Список запретов PDF/A (JS, мультимедиа, вложения) — по общеизвестным сведениям, текст ISO 19005 (платный) не сверялся. Минимальная версия LibreOffice для JSON-синтаксиса фильтра не указана.
- MHTML: поддержка в Outlook и Chromium Edge, отсутствие CLI-флага MHTML у Chrome — «likely», не проверялись запуском.
- Дополнение Thunderbird ImportExportTools NG — упомянуто, не проверялось.
- Расхождение с отчётом part-C: в CDXJ от cdxj-indexer дайджест **с** префиксом `sha1:` (проверено запуском), а не «base32 без префикса»; Ghostscript-документация допускает `UseDeviceIndependentColor` для PDF/A.
- `py-wacz --detect-pages` в тесте не создал `pages.jsonl` (эвристика по Referer) — так и описано.

## Нужны изменения в чужих файлах / sidebars.js

- Не обнаружено других страниц в `kb/`, повторяющих исправленные ошибки (поиск по `fmt/353`, `fmt/795`, `bagit.py --create`, `--print-to-mhtml`, `cdx-toolkit query`, `wb-manager index /…`, `TAIL_JSON`, `(com,example` и т. п.).
- По сводному отчёту CDXJ описан по-разному в `replay/pywb.md` и `guides/warc-workflow.md` — владельцам этих файлов стоит привести описание к канонической форме из `cdx.md`: `SURT TIMESTAMP {JSON}` (CDXJ 0.1.0) и ключи вида `com,example)/path`.
- Внимание координатору: во время моей работы кто-то удалил и добавил в индекс (`git rm`) **все** `_category_.json` в `kb/`, включая `kb/instruments/file-formats/_category_.json`. F3 этот файл не трогал; если удаление не запланировано, его нужно восстановить (`DocCardList` в `index.md` от него не зависит, но зависят метка и позиция категории в сайдбаре).
- Других правок `sidebars.js` / `_category_.json` с моей стороны не требуется. Только у `warc.md` есть `sidebar_position: 3`, остальные страницы раздела сортируются автоматически; если нужен явный порядок — координатор может задать его централизованно.
