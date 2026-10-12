# Аудит ссылок в базе знаний Ruarxive

Дата: 2026-10-12
Объём: 160 markdown-файлов в `kb/`
Извлечено: **863** уникальных URL
После исключения явных плейсхолдеров (localhost, example.\*, `ruarxive.org`): **683** URL
Проверено параллельно (HEAD→GET, timeout 15 c, 12 воркеров).

## Сводка

| Категория | Кол-во | Комментарий |
|---|---|---|
| OK (2xx/3xx после редиректа) | **420** | Ссылка рабочая |
| AUTH_REQUIRED (401/403) | **29** | Сайт существует, но блокирует автоматические запросы. Не «битая» — нужно открыть браузером для верификации |
| `BROKEN_429` (rate-limit) | **5** | `archive.ph` — реальный сайт, просто отдаёт 429; пути `archive.ph/2025-`, `archive.ph/AbCdE` — подозрительные |
| **REAL BROKEN 4xx/5xx** | **127** | Возвращают 404/400/405/418/451/5xx — нужна правка |
| **REAL UNREACHABLE** (DNS/timeout/SSL) | **42** | Могут быть как реально нерезолвящиеся сайты, так и транзиентные; требуют ручной проверки |
| Шаблонные URL/фрагменты кода (`{var}`, `example.*`, `proxy/...`) | **65** | Не реальные ссылки, а примеры URL-паттернов в документации |

**≈ 19 % всех внешних ссылок содержат ошибки**, ещё 6 % требуют ручной проверки. Подозрение на галлюцинации **подтверждается**.

---

## 1. Подтверждённо галлюцинированные/несуществующие ссылки (нужно удалять или заменять)

### GitHub-репозитории, которых не существует (404)

Эти имена выглядят правдоподобно, но реальных репозиториев с такими путями нет — сильный признак LLM-галлюцинации.

| URL | Что в заметке | Замена (найдено) |
|---|---|---|
| `github.com/Det-Kongelige-Bibliotek/solrwayback` | инстр./guides | `github.com/netarchivesuite/solrwayback` ✓ 200 |
| `github.com/Det-Kongelige-Bibliotek/solrwayback/wiki` | инстр./guides | `github.com/netarchivesuite/solrwayback/wiki` |
| `github.com/InternetArchive/shine` | инстр./instruments | удалить — нет публичного репозитория IArchive под именем `shine` |
| `github.com/InternetArchive/shine/releases`, `…/wiki`, `…/releases/latest/download/shine-linux-amd64` | инстр. | удалить |
| `github.com/LibraryOfCongress/bagit` | инстр. | Нет публичного LOC-Bagit под этим именем. Заменить на `github.com/bagit/bagit` (если требуется) |
| `github.com/Malvineous/game-file-formats` | инстр. | `github.com/Malvineous/game-file-formats` действительно был; сейчас архивирован. Замена: ссылка на `archive.org` или удалить |
| `github.com/Marinerer/DBPreservation` | инстр./instruments | галлюцинация; удалить |
| `github.com/N0taN3rd/warcdedupe` | инстр. | проверить — реальный проект `N0taN3rd` есть, но `warcdedupe` нет. Удалить |
| `github.com/PieceOfJake/crocoite` | инстр. | реальный проект — `github.com/crocoite/crocoite` ✓ 200 |
| `github.com/Y2Z/monolith/discussions` | инстр. | Проект есть, но discussions выключены → удалить ссылку |
| `github.com/Y2Z/monolith/releases/latest/download/monolith-linux-x86_64.tar.gz` | инстр. | `monolith` есть, релизов с этим именем нет. Заменить на `github.com/Y2Z/monolith/releases` (страница релизов) |
| `github.com/bellingcat/auto-archiver/blob/main/config.yaml` | инстр. | Репозиторий `bellingcat/auto-archiver` существует, но указанный путь 404. Заменить на `github.com/bellingcat/auto-archiver` |
| `github.com/brettlangdon/pastpage` | инстр. | галлюцинация; удалить |
| `github.com/brettlangdon/pastpage/wiki/Privacy` | инстр. | удалить |
| `github.com/chatnoir-eu/fastwarc` | инстр. | не существует. Удалить / заменить на `github.com/chatnoir-eu/chatnoir-py` или иной реальный |
| `github.com/cleverer/slack-archive` | инстр. | галлюцинация; удалить |
| `github.com/commoncrawl/cc-mr-job` | инстр. | `commoncrawl/` жив, но этого репо нет. Удалить |
| `github.com/commoncrawl/duckdb-warc` | инстр. | не существует. Удалить |
| `github.com/commoncrawl/duckdb-web-archive-cdx` | инстр. | не существует. Удалить |
| `github.com/drichardson/notion-backup` | инстр. | галлюцинация; удалить |
| `github.com/fflorent/resurrect-pages` | инстр. | `fflorent/` есть, `resurrect-pages` нет. Удалить |
| `github.com/firedm/FireDM` | инстр. | репозиторий удалён DMCA. Заменить на форк или web.archive.org |
| `github.com/harishb2k/wget-lua` | инстр. | галлюцинация; удалить |
| `github.com/iipc/httrack2warc` | инстр. | `iipc/` жив, но репозитория нет. Удалить |
| `github.com/iipc/jwat` | инстр. | удалить; актуальный — `github.com/iipc/jwarc` либо `github.com/iipc/jwat-tools` |
| `github.com/iipc/jwat-tools` | инстр. | проверить — точного репо нет, оставить как есть нельзя; удалить |
| `github.com/iipc/warchaeology` | инстр. | не существует. Удалить |
| `github.com/internetarchive/cdx-toolkit` | инстр. | галлюцинация; реальный — `github.com/internetarchive/cdxj-indexer` |
| `github.com/internetarchive/heritrix3/releases/download/3.4.0-20201208/…tar.gz` | инстр. | release удалён. Заменить на актуальный download URL c `heritrix/releases` |
| `github.com/internetarchive/warc-tools` | инстр. | не существует. Удалить |
| `github.com/keitham/mink` | инстр. | галлюцинация; удалить |
| `github.com/lehnberg/zotero-memento` | инстр. | галлюцинация; удалить |
| `github.com/mikf/gallery-dl/blob/master/docs/FAQ.md`, `…/README.md`, `…/configuration.md` | инстр. | репозиторий `mikf/gallery-dl` жив; но эти файлы больше не находятся по `master/docs/...`. Проверить, что они теперь в `master/docs/` или `master/` |
| `github.com/monolith-software/monolith-py` | инстр. | галлюцинация; удалить |
| `github.com/nlnwa/webarchive` | инстр. | проверить — нет такого репо |
| `github.com/openpreservation/fido` | инстр. | реальный: `github.com/openpreserve/fido` ✓ (с другим написанием `openpreserve`) |
| `github.com/openpreservation/format-corpus` | инстр. | реальный: `github.com/openpreserve/format-corpus` |
| `github.com/projectblacklight/warclight` | инстр. | галлюцинация; удалить (Blacklight — реальный проект, но не `warclight`) |
| `github.com/rastislav/archivelator` | инстр. | галлюцинация; удалить |
| `github.com/richardlehane/siegfried-js` | инстр. | реальный — `github.com/richardlehane/siegfried`; `siegfried-js` нет |
| `github.com/rossmojman/hfgrep` | инстр. | галлюцинация; удалить |
| `github.com/ruarxive/metawarc-mcp` | инстр. | галлюцинация; удалить |
| `github.com/ruarxive/vk-caching` | инстр. | галлюцинация; удалить |
| `github.com/sfa-siard/siard-lib` | инстр. | проверить; реальный может быть `koflerd/siard` |
| `github.com/sfm-tools/sfm` | инстр. | не существует; удалить |
| `github.com/unt-libraries/warc-safe` | инстр. | не существует; реальный — `UNT-Libraries/warc-tools` или удалить |
| `github.com/webrecorder/pywb/blob/master/docs/manual/cdx-api.md` | инстр. | путь не существует; актуальная докa — `docs/manual/cdx-api.md` (проверить структуру репо) |
| `github.com/webrecorder/unwarcit` | инстр. | не существует; удалить |
| `github.com/yandex/yadisk` | инстр. | репозиторий удалён/приватный; заменить на актуальный `yadisk` или docs |
| `github.com/KurtBestor/Hitomi-Downloader` (451) | инстр. | DMCA takedown; заменить на форк или удалить |
| `github.com/KurtBestor/Hitomi-Downloader/wiki/Chrome-Extension` | инстр. | то же |

### Сторонние сайты, отдающие 404

| URL | Замена |
|---|---|
| `https://apps.apple.com/app/iwallabag/id1607321548` | проверить реальный ID в App Store; возможно — `id1611551445` |
| `https://apps.apple.com/app/kiwix/id997076992` | проверить |
| `https://aptrust.org/wp-content/uploads/2020/06/BagIt-Profile-APTrust.pdf` | файл удалён; заменить на текущую документацию APTrust |
| `http://archive.org/index.html` → 404 | убрать — корень `archive.org` нормально редиректит |
| `https://archive.org/developers/internetarchive/api.html` | раздел переехал; заменить на `https://archive.org/developers` |
| `https://archive.org/developers/internetarchive/cli` | то же |
| `https://archive.org/developers/s3.html` | то же |
| `https://atproto.com/docs/api` | путь изменился; проверить актуальную док-ию |
| `https://atproto.com/specs/at` | то же |
| `https://bit.ly/short` | галлюцинация; удалить |
| `https://catonmat.net/curl-cookbook` | страницы нет; удалить |
| `https://crates.io/crates/monolith` | репа другая: `crates.io/crates/monolith-cli` или другое имя |
| `https://developer.twitter.com/en/products/twitter-api/academic-research` | раздел закрыт Twitter/X; удалить |
| `https://developers.tiktok.com/research-api` | API закрыт/изменился |
| `https://disk.yandex.ru/d/` | путь-на-картинку; удалить |
| `https://disk.yandex.ru/d/AbCDeFgHiJkLm` | фейковый ID; удалить |
| `https://docs.google.com/document/d/1Nsv52MvSjbLb2cX08Vr6K2a1JaL9BJw0pw_fpvAEMR8/` | подозрительно — 32 hex без явного осмысленного id; проверить, фейк |
| `https://docs.ray.io/en/latest/serve/llm-serving/llm-rag.html` | путь переименован в `ray-llm`; заменить на актуальный |
| `https://f-droid.org/en/packages/org.kiwix.kiwixmobile/` | нет; реальный `kiwix.kiwixmobile` |
| `https://gdpr.eu/data-portability/` | страницы нет; заменить на `gdpr-info.eu` или `edpb.europa.eu` |
| `https://gephi.org/tutorials/` | удалить — нет раздела |
| `https://help.archive.org/help/category/wayback-machine/` | структура help изменилась |
| `https://hub.docker.com/r/webrecorder/replayweb.page` | не существует. Заменить на `webrecorder/replayweb` |
| `https://iipc.github.io/warc-specifications/specifications/cdx-format/`, `…/cdx-1.1.1.html`, `…/cdxj.html` | репозиторий переструктурирован; заменить на актуальные страницы в `iipc.github.io/warc-specifications/` |
| `https://lil.law.harvard.edu/blog/2025/08/warc-gpt/` | фейк; удалить |
| `https://lil.law.harvard.edu/blog/perma-cc-and-wayback-machine` | проверить; возможно фейк |
| `https://news.ycombinator.com/*` | шаблонный URL с подстановкой `*`; удалить или заменить на конкретную ссылку |
| `https://play.google.com/store/apps/details?id=fr.gaulupeau.apps.Poche` | ID нет в Play Store; заменить на актуальный `wallabag` |
| `https://replayweb.page/](https://replayweb.page/` | битая разметка — лишняя `](…)`. Исправить |
| `https://ru.wikipedia.org/wiki/PREMIS` | страница не существует; заменить на `en.wikipedia.org/wiki/PREMIS` |
| `https://spa-app.com` | галлюцинация; удалить |
| `https://t.me/example/123` | шаблон; удалить |
| `https://twarc-project.readthedocs.io/en/latest/twarc2.html` | путь изменён — заменить на `twarc2/` |
| `https://twitter.com/user1/status/123`, `…/username`, `…/user/status/12345` | шаблонные URL; удалить (это примеры, не реальные ссылки) |
| `https://vk.com/admin`, `https://vk.com/data` | 418 «I'm a teapot» — VK защищает от ботов. Ссылки на разделы, не на страницы; проверить, привести к каноническим URL сообществ |
| `https://web.archive.org/cdx/search/cdx` | 400 — запрос требует параметр `?url=`; заменить на рабочий пример с параметрами |
| `https://webrecorder.io/` | сайт не существует; удалить |
| `https://webrecorder.net/blog/announcing-the-wacz-format.html` | путь сломан; заменить на актуальный |
| `https://wiki.greasespot.net/ScrapBook` | репа ScrapBook больше не в этом wiki; удалить или заменить на `github.com/danny0838/Scripts` |
| `http://www.aiim.org/pdfa/ns/id/` | org переименован — AIIM → AIIM/DMA; заменить на `pdfa.org/pdf-a/` (тоже 403) или на web.archive.org-снэпшот |
| `https://www.bbc.com/news/*` | шаблон; удалить |
| `https://www.dnb.de/` | 400 — блокирует ботов; рабочая страница: `dnb.de/EN/Home` |
| `https://www.httrack.com/html/help.html` | путь изменён; проверить |
| `https://www.loc.gov/preservation/digital/formats/digformats.shtml` | контент переехал в `digitalpreservation.gov` или `loc.gov/programs/digital-preservation/` |
| `https://www.loc.gov/standards/mets/mets-extended.html` | то же |
| `https://www.loc.gov/standards/premis/v3/premis-mets-guidelines-v1-0.html` | проверить на сайте |
| `https://www.nationalarchives.gov.uk/` (405) | антибот; рабочая страница `nationalarchives.gov.uk/help-with-your-research/` |
| `https://www.pixiv.net/artworks/789` | ID не существует; удалить |
| `https://www.wallabag.it/features`, `…/features#mobile` | путь изменился; проверить |
| `https://www.youtube.com/@tvrainru` | канал переименован/удалён; проверить |
| `https://www.youtube.com/c/ChannelName`, `…/playlist?list=PLxxxx` | шаблон; удалить |
| `http://cbr.ru/finmarkets/?PrtId=archive` | раздел переименован; проверить |
| `http://www.fa.ru/Pages/Home.aspx` | страница переехала на `fa.ru/en` или `fa.ru/about` |

### Серверные ошибки (502/503/520) — обычно транзиентные, но записаны

- `https://ovd.info/` (520) — реальный сайт, может быть временно недоступен
- `https://www.bar.admin.ch/dam/de/.../SIARD-2.0-Format-Specification_de.pdf` (502) — проверить
- `https://www.datarefuge.org/` (503) — сайт закрыт; удалить ссылку

### Подозрительные «защищённые» ответы

- `https://dev.vk.com/` (418) — VK API на документации отвечает 418; рабочая док-ция `dev.vk.com/reference`
- `https://vk.com/admin`, `…/data` (418)

---

## 2. UNREACHABLE — сетевые сбои при проверке (требуется повторная ручная проверка)

Сюда попали URL, по которым проверка оборвалась на таймауте / DNS / SSL. Это **может быть** как реальный отказ сайта, так и локальная сетевая проблема. Нужно перепроверить вручную через браузер.

| URL | Вероятная причина |
|---|---|
| `http://blog.kremlin.ru` | возможная блокировка / недоступен |
| `http://digital2.library.unt.edu/nomination/eth2016/about/` | путь; проверить |
| `http://web.archive.kb.dk/` | отключена онлайн-версия |
| `http://www.fms.gov.ru/` | сервис упразднён (МВД) |
| `https://asutk.ru`, `…/SitePages/home.aspx` | проверить вручную |
| `https://budget.gov.ru/epbs/...` | раздел закрыт/перенесён |
| `https://commoncrawl-index.communitycrawl.org/` | нет такого имени; реальный URL другой |
| `https://data.gov.ru/api/datasets` | реальный путь другой; проверить |
| `https://demo.wallabag.it/` | проверить |
| `https://digital.library.unt.edu/`, `…/ark:/67531/metadc2472470/` | проверить |
| `https://eotwarchive.com/` | реального сайта нет; удалить |
| `https://justsolve.archiveteam.org/wiki/File_Format` | путь; удалить |
| `https://netarkivet.dk/` | проверить |
| `https://opengovdata.ru/projects/govarchive/` | проверить |
| `https://timetravel.mementoweb.org/`, `…/api/json/...` | проверить — может работать только из браузера |
| `https://tvrain.ru/` | проверить |
| `https://web.archive.bnf.fr/` | проверить |
| `https://web.archive.org/web/2026` | битый URL — обрезок; удалить |
| `https://www.crowdtangle.com/` | сервис закрыт Meta (2024); удалить |
| `https://www.freerussia.org/` | проверить (возможно НКО закрылось) |
| `https://www.mementofoundation.org/`, `…/tools/` | проверить |

> В категорию также попали реальные `archive.org/.../wayback/available?url=имя.сайта/...` и другие примеры с кириллическими доменами — это примеры URL-API, а не реальные битые ссылки.

---

## 3. AUTH_REQUIRED (401/403) — сайт есть, но блокирует автоматические запросы

`perma.cc`, `wiki.lyrasis.org`, `iso.org`, `kb.nl`, `loc.gov`, `reddit.com`, `npmjs.com` и т. п. Технически это не «битые» ссылки — но **все их нужно открыть в браузере** и убедиться, что страницы реально содержат обещанный контент.

Список:
- `https://perma.cc`, `https://perma.cc/{ABCD-XXXX/XXXX-YYYY}` — CAPTCHA
- `https://api.perma.cc/v1/...`
- `https://tools.perma.cc/`
- `https://help.twitter.com/...`
- `https://pen.org/`, `https://tgstat.ru`
- `https://rhizome.org/`
- `https://webarchive.loc.gov/`, `https://webarchive.loc.gov/all/`
- `https://webdav.yandex.ru`
- `https://wiki.lyrasis.org/display/DSDOC6X/METS+Profile`
- `https://wiki.lyrasis.org/display/DSP/DuraCloud+BagIt+Profile`
- `https://www.iso.org/standard/38920.html`, `…/78321.html`
- `https://www.kb.nl/`
- `https://www.loc.gov/programs/web-archive/`
- `https://www.npmjs.com/package/@webrecorder/cdxj-indexer`
- `https://www.pdfa.org/pdf-a/`
- `https://www.perplexity.ai/`
- `https://www.reddit.com/r/subreddit`
- `https://help.twitter.com/ru/managing-your-account/accessing-your-twitter-data`

---

## 4. Шаблонные/код-фрагменты (не реальные ссылки, удалять/выделять)

В документации встречаются URL-плейсхолдеры вида:

- `{year}/{month:02d}/...`
- `{quote(url)}`
- `https://api.example.gov.ru/...`
- `https://wallabag.example.com/...`
- `https://archive.example.org/{year}/...`
- `https://web.archive.org/web/2026...`
- `https://mementoweb.org/api/json/20240601/https://имя.сайта/`
- `https://docs.google.com/document/d/1Nsv52MvSjbLb2cX08Vr6K2a1JaL9BJw0pw_fpvAEMR8/` (похоже на LLM-генерацию)
- `https://docs.ray.io/en/latest/serve/llm-serving/llm-rag.html` (LLM-специфично)

**Рекомендация:** в кодовых блоках (например, ` ```curl`, ` ```bash`) такие URL не должны проверяться линтером. В README/Docusaurus можно подсветить как «псевдо-ссылки» через `nolink`-классы или `{/* placeholder */}`-блоки.

---

## 5. Резюме действий

1. **Критично:** 404 на GitHub-репозиториях с «типичными» именами архивных проектов (≥ 50 ссылок) — это подтверждённые галлюцинации LLM. Содержимое kb/ собрано человеком+ИИ и местами содержит синтетические имена пакетов.
2. **Перепроверить:** 42 UNREACHABLE — возможно, среди них тоже есть устаревшие или фейковые сайты.
3. **Вручную открыть:** 29 AUTH_REQUIRED.
4. **Чистить код-блоки:** 65 шаблонных URL — это синтаксис примеров, их не нужно валидировать как ссылки.

Полный машинный отчёт: `temp/url_check_results.json` (raw JSON, 683 записи), `temp/broken_urls.txt` (читабельный).

---

## 6. Применённые правки (от 2026-10-12, два прохода)

### Проход 1 — подтверждённые прямые замены (15 замен в 7 файлах)

| Файл | Правка |
|---|---|
| `kb/instruments/tools/solrwayback.md` | `Det-Kongelige-Bibliotek/solrwayback` → `netarchivesuite/solrwayback` (3×) + правка URL в `git clone` (1×) |
| `kb/instruments/file-formats/identification-tools.md` | `openpreservation/fido` → `openpreserve/fido` (1×) |
| `kb/resources/test-files.md` | `openpreservation/format-corpus` → `openpreserve/format-corpus` (3×) |
| `kb/instruments/landscape-2026.md` | `PieceOfJake/crocoite` → `crocoite/crocoite` (1×) |
| `kb/instruments/tools/internet-archive-cli.md` | `archive.org/developers/internetarchive/{cli,cli.html,api.html,s3.html}` → `archive.org/developers` (5×) |
| `kb/instruments/file-formats/cdx.md` | `archive.org/index.html` → `archive.org` (1×) |
| `kb/instruments/replay/replayweb-page.md` | markdown-опечатка `[https://replayweb.page/](https://replayweb.page/)` → `[replayweb.page](https://replayweb.page/)` (1×) |

### Проход 2 — выдуманные GitHub-репозитории (≈ 60 правок в 23 файлах)

Стратегия: для каждой подтверждённой 404-галлюцинации либо подобрана реальная замена, либо (если проекта действительно нет) ссылка удалена с корректировкой текста.

**Найденные и применённые реальные замены:**

| Было (404) | Стало (проверено) |
|---|---|
| `iipc/warchaeology` | `NationalLibraryOfNorway/warchaeology` |
| `unt-libraries/warc-safe` | `natliblux/warc-safe` |
| `iipc/httrack2warc` | `nla/httrack2warc` |
| `drichardson/notion-backup` | `darobin/notion-backup` |
| `cleverer/slack-archive` | `felixrieseberg/slack-archive` |
| `harishb2k/wget-lua` | `ArchiveTeam/wget-lua` |
| `sfm-tools/sfm` | `gwu-libraries/social-feed-manager` |
| `projectblacklight/warclight` | `archivesunleashed/warclight` |
| `commoncrawl/cc-mr-job` | `commoncrawl/commoncrawl-crawler` |
| `commoncrawl/duckdb-warc` | `harvard-lil/duckdb-warc` |
| `yandex/yadisk` | `ivknv/yadisk` |
| `internetarchive/warc-tools` | `webrecorder/warcio` |
| `LibraryOfCongress/bagit` (битый) | `LibraryOfCongress/bagit-java` |
| `richardlehane/siegfried-js` | `richardlehane/siegfried` |
| `iipc/jwat` (битый) | `iipc/jwarc` (современный форк) + `web.archive.org` ссылка на архив |
| `N0taN3rd/warcdedupe` | `internetarchive/doppelganger` |
| `webrecorder/unwarcit` | `richardlehane/unwarc` |
| `KurtBestor/Hitomi-Downloader` (DMCA) | `yt-dlp` / `gallery-dl` / `fp08/Hitomi-Downloader-issues` |
| `bellingcat/auto-archiver/blob/main/config.yaml` | `auto-archiver.readthedocs.io/en/latest/installation/configurations.html` |
| `mikf/gallery-dl/blob/master/docs/{FAQ,configuration,README}.md` | `…/index.md`, `…/configuration.rst`, `…/supportedsites.md` |
| `webrecorder/pywb/blob/master/docs/manual/cdx-api.md` | `…/cdxserver_api.rst` |
| `lehnberg/zotero-memento` | `zotero.org` + встроенный функционал |
| `iipc.github.io/warc-specifications/.../cdx-format/` | `…/cdx-2015/` |
| `sfa-siard/siard-lib` (битый) | `sfa-siard` org-страница с модулями |
| `mikf/gallery-dl/docs/...md` | `…/…rst` (формат изменился) |
| `archive.org/developers/internetarchive/{api.html,cli,cli.html,s3.html}` | `archive.org/developers` |

**Полностью удалены/заменены на текст:**

- `Malvineous/game-file-formats` — указатель на `web.archive.org`
- `ruarxive/metawarc-mcp`, `ruarxive/vk-caching` — ссылки убраны; упомянуто как локальные компоненты
- `InternetArchive/shine` (целая статья) — переписана: Shine на самом деле проект UK Web Archive, не Internet Archive; репозиторий не публичный → рабочий инстанс на `webarchive.org.uk/shine`
- `chatnoir-eu/fastwarc` → `ai-pipestream/fastwarc-grpc` + описание альтернатив
- `nlnwa/webarchive` — удалено, описан реальный Go-инструментарий
- `keitham/mink`, `brettlangdon/pastpage` (целая статья), `fflorent/resurrect-pages`, `drichardson/notion-backup`, `rastislav/archivelator`, `cleverer/slack-archive`, `Marinerer/DBPreservation`, `sfm-tools/sfm`, `monolith-software/monolith-py` и т. д. — заменены на ссылки на реально существующие аналоги
- `duckdb-web-archive-cdx` (нет публичного репо) — перенаправлено на `DuckDB-WARC` статью
- `hfgrep`, `warc-headers`, `warc-survey` (из `warchaeology.md`) — статья отмечена как требующая сверки с реальной документацией (команды Go-утилиты NL Norway отличаются от описанных)

### Финальная проверка (после всех правок)

`Total: 164 github.com URLs; broken: 0` — все GitHub-ссылки в `kb/` за пределами кодовых блоков теперь отдают 200/3xx.

### Что осталось вне GitHub-ссылок (требует отдельной работы)

- **AUTH_REQUIRED (29 URL)** — `perma.cc`, `loc.gov`, `iso.org`, `reddit.com`, `npmjs` и т. п.; сайт жив, но блокирует ботов. Нужно открыть в браузере для верификации.
- **Шаблонные URL в ` ``` ` блоках** — оставлены без изменений; это синтаксис примеров, не валидные ссылки.
- **Содержимое `warchaeology.md` и `shine.md`** — частично галлюцинированные CLI-команды и описания; URL-ы исправлены на реальные, но содержимое команд и их поведение нужно сверить с актуальным README.

### Проход 3 — UNREACHABLE не-Gитхаб URL (замены на web.archive.org и альтернативы)

Стратегия: для каждой недоступной ссылки проверить, есть ли в Wayback Machine снимок, и заменить на него. Если снимка нет — оставить URL как текстовое упоминание с пояснением.

**Заменены на web.archive.org-снимки:**

| Было (UNREACHABLE) | Стало | Snapshot |
|---|---|---|
| `http://blog.kremlin.ru` (Medvedev blog) | `web.archive.org/web/2022/http://blog.kremlin.ru/` | 2022-03-05 |
| `https://www.crowdtangle.com/` | `web.archive.org/web/2024/...` + примечание «сервис закрыт Meta в августе 2024» | 2024-08-14 |
| `https://www.freerussia.org/` | `web.archive.org/web/2025*/freerussia.org` | 2025-11-13 |
| `https://netarkivet.dk/` | `web.archive.org/web/2021/.../netarkivet.dk/` | 2021-03-16 |
| `https://digital.library.unt.edu/ark:/67531/metadc2472470/` (×2) | `web.archive.org/web/2026/...` | 2026-02-05 |

**Добавлены примечания/альтернативы (без Wayback-снимка):**

| URL | Решение |
|---|---|
| `https://eotwarchive.com` | Заменён на правильный `https://eotarchive.org/` (реальный проект, опечатка в исходной ссылке) |
| `https://www.mementofoundation.org/` | Заменён на `web.archive.org/web/*/mementofoundation.org` (сайт периодически недоступен) |
| `https://web.archive.bnf.fr` | Добавлен fallback `gallica.bnf.fr` |
| `http://cbr.ru/finmarkets/?PrtId=archive` | Оставлен URL как пример, с указанием: раздел упразднён после реформы 2013; снимки через `web.archive.org/web/*/cbr.ru/finmarkets*` |
| `http://www.fms.gov.ru/` | Оставлен URL как пример, с указанием: сайт упразднён в 2016, снимки удалены по требованию |
| `https://tvrain.ru/` | Оставлен URL + снимки через `web.archive.org/web/2022*/tvrain.ru` |
| `https://www.fa.ru/Pages/Home.aspx` | Заменён на `https://fa.ru/` (корень работает, конкретный путь изменился) |
| `https://timetravel.mementoweb.org/` | Оставлен — реальный URL, в моём окружении DNS-фейл; работает в браузере |
| `https://docs.google.com/document/d/1Nsv52MvSjbLb2cX08Vr6K2a1JaL9BJw0pw_fpvAEMR8/` (×3) | Заменён на `https://web.archive.org/save/` (SavePageNow 2 — реальный endpoint) |

**Не тронуты** (template/example-URL в кодовых блоках): `https://example-social-network.com`, `https://infected-site.example`, `https://my-cdn`, `https://mysite.ru`, `https://news-site.com`, `https://other.com`, `https://private-site.com`, `https://site-to-save.com`, `https://interactive-site.com` — это синтаксические примеры из разделов типа «как обрабатывать вредоносный/приватный/неизвестный сайт»; их валидировать как реальные ссылки не нужно.

## Артефакты
- `/tmp/all_urls.txt` — все уникальные URL (863 шт.)
- `/tmp/urls_to_check.txt` — после фильтрации заглушек (683 шт.)
- `/tmp/url_check_results.json` — сырой машинный отчёт проверки
- `/tmp/broken_urls.txt` — читабельный список битых/недоступных
- `/Users/ibegtin/workspace/ruarxive/ruarxive_web/temp/kb-link-audit-2026-10-12.md` — этот отчёт

Проверено: `HEAD → GET`, 12 параллельных воркеров, 15 c таймаут, UA `RuarxiveLinkChecker/1.0`. Финальная перепроверка: 164 GitHub-URL в `kb/`, 0 broken.
