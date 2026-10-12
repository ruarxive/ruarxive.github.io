# Сводный план доработки базы знаний Ruarxive

> **Период:** ноябрь 2026 — I квартал 2027
> **Источники:** репозиторий `ruarxive/ruarxive_web` (каталог `kb/`), CHANGELOG, новое голосование в Telegram-чате Ruarxive, обзор экосистемы веб-архивации (Awesome Web Archiving, GitHub Topics, IIPC, Bellingcat, Harvard LIL, Archive Team).
> **Назначение документа:** операционный план для команды и волонтёров. Не часть публичного сайта.

---

## 1. Результаты голосования и приоритеты

Голосование в Telegram-чате Ruarxive (≈50 участников, 132 голоса, мультивыбор). Тема: «Каких материалов не хватает в базе знаний для работы с архивами?». Сортировка по убыванию интереса сообщества:

| № | Тма | % | Голоса | Приоритет в плане |
|:-:|:---|:-:|:--:|:--:|
| 1 | Как воспроизводить веб-архивы локально и в виде сайта | 53 % | 26 | 🔴 P0 |
| 2 | Как работать с Internet Archive и другими открытыми сервисами | 51 % | 25 | 🔴 P0 |
| 3 | Как собирать архивы сайтов | 48 % | 24 | 🟠 P1 |
| 4 | Подробнее о ПО цифровых архивистов | 48 % | 24 | 🟠 P1 |
| 5 | Как обрабатывать собранные веб-архивы | 42 % | 21 | 🟡 P2 |
| 6 | Как работать с файлами внутри архивов (извлечение, метаданные) | 42 % | 21 | 🟡 P2 |
| 7 | Что такое WARC, WACZ и как с ними работать | 38 % | 19 | 🟢 P3 |
| 8 | Как собирать архивы соцсетей | 36 % | 18 | 🟢 P3 |
| 9 | Другое (написать в комментариях) | 6 % | 3 | — |

«Другое» — пока оставлено в очереди, требуется отдельный сбор комментариев у админов чата.

---

## 2. Текущее покрытие базы знаний (что уже есть)

Сводка по разделам `kb/`:

### 2.1. Гайды (`kb/guides/`)
- `quick-start-5min` — обзорный старт.
- `emergency-archiving` — кризисные сценарии (23 КБ).
- `wget` — сценарии под Wget (32 КБ, считается каноническим гайдом).
- `warc-workflow` — пайплайн WARC → WACZ → плеер (15 КБ, добавлен в релизе).
- `custom-workflows` — автоматизация (18 КБ).

### 2.2. Инструменты Ruarxive (`kb/instruments/ruarxive-tools/`)
`tgarc`, `wparc`, `ydiskarc`, `filegetter`, `metawarc`, `metawarc-mcp`. Связка `wparc → metawarc` оформлена отдельным кейсом.

### 2.3. Сторонние инструменты (`kb/instruments/tools/`)
30 страниц (curl, Browsertrix, Brozzler, Squidwarc, Warcworker, Heritrix, Wpull, Wget, HTTrack, grab-site, Archive.ph, SingleFile, WebScrapBook, monolith, Obelisk, ArchiveBox, wallabag, Warcprox, warc-processing, warc2zim, SolrWayback, Shine, Web Curator Tool, Internet Archive CLI, tdl, yt-dlp, gallery-dl). Большинство страниц свежие (октябрь 2026), единый стиль.

### 2.4. Соцсети (`kb/instruments/social-media/`)
`instagram`, `youtube-video`, `vk`, `facebook`, `rutube`, `twarc`, `fbarc`, `social-feed-manager`.

### 2.5. Data Take-Out (`kb/instruments/data-take-out/`)
Telegram, Instagram, Facebook, Twitter, VK, YouTube, Yandex, Google, Notion, Slack.

### 2.6. Справочник форматов (`kb/instruments/file-formats/`)
WARC, WACZ, CDX, MHTML, PREMIS, METS, BagIt, PDF/A, MBOX, SIARD, JP2, IIIF, identification-tools, format-registries.

### 2.7. Воспроизведение (`kb/instruments/replay/`)
ReplayWeb.page, pywb, OpenWayback, IPWB, warc2html. Индекс сравнивает инструменты и описывает сценарии.

### 2.8. Как собирать архивы (`kb/instruments/howto-collect/`)
`make-copy-website`, `make-copy-site-wordpress`.

### 2.9. Загружаемые данные (`kb/instruments/downloaded-data/`)
`apibackuper`, `apibackuper-configs`, `spcrawler`.

### 2.10. Юридическое (`kb/legal/`)
copyright, personal-data, terms-of-service.

### 2.11. Прочее
- `kb/case-studies/` — 7 кейсов (bank-closures, platform-migrations, government-websites-disappearing, international-examples, multi-tool-archiving, api-archiving-scale, wparc-to-metawarc-pipeline).
- `kb/users/` — индекс, `open-warc`, `citation`.
- `kb/course/` — DH.1–DH.4.
- `kb/gratitudes/`, `kb/about/`, `kb/news/`, `kb/resources/`, `kb/similar/`.

**Качество:** большая часть страниц прошла унификацию frontmatter (title, description, last_updated) в октябрьском релизе. CHANGELOG фиксирует, что устранены битые ссылки, маршрутизация VK, дубликаты Wget.

---

## 3. Пробелы относительно голосования

### 3.1. 🔴 P0 — «Как воспроизводить веб-архивы локально и в виде сайта» (53 %, 26 голосов)

**Уже есть:**
- Раздел `kb/instruments/replay/` с 5 инструментами.
- `kb/users/open-warc.md` — инструкция для конечного пользователя.
- `kb/guides/warc-workflow.md` — раздел «Публикация в плеер».

**Чего не хватает:**
| № | Тема | Где должно жить | Сценарий из голосования |
|:-:|:---|:---|:---|
| 3.1.1 | **Пошаговый гайд «мой первый pywb-сервер»** — установка, инициализация, добавление архива, доступ по URL, веб-интерфейс каталога. | `kb/instruments/replay/pywb.md` (расширить) → индекс-страница | «хочу поднять плеер у себя на сервере» |
| 3.1.2 | **Деплой WACZ на статический хостинг** (S3, Cloudflare R2, GitHub Pages) + ReplayWeb.Page по URL. Сравнение self-hosted pywb vs статика. | `kb/guides/warc-workflow.md` (новый раздел) | «куда положить 200-ГБ архив» |
| 3.1.3 | **ReplayWeb.Page: расширенные сценарии** — сохранение коллекций, аннотации, экспорт страниц, поведение при 100 ГБ+ файлах (стриминг CDXJ). | `kb/instruments/replay/replayweb-page.md` (расширить) | «открыл 173-ГБ архив Эха Москвы — что делать» |
| 3.1.4 | **OpenWayback: развёртывание в проде** — JVM-стек, Jetty, индексирование через warc-indexer. | `kb/instruments/replay/openwayback.md` (расширить) | «нужна альтернатива pywb на JVM» |
| 3.1.5 | **IPWB / IPFS в 2026** — обновление страницы; IPFS-экосистема сильно изменилась. | `kb/instruments/replay/ipwb.md` (переписать) | «как распространять через торренты» |
| 3.1.6 | **Memento Protocol** — TimeGate/TimeMap, интеграция с Memento aggregators (Mink, PastPage). | `kb/instruments/replay/memento.md` (новая) | «как дать ссылку на «все версии страницы»» |
| 3.1.7 | **Сравнительная таблица «что выбрать под нагрузку»** — обновить `kb/instruments/replay/index.md` с порогами: «< 1 ГБ → ReplayWeb», «1–50 ГБ → pywb/CDXJ», «50 ГБ+ → pywb+SolrWayback», «P2P → IPWB». | `kb/instruments/replay/index.md` | «непонятно что выбрать» |
| 3.1.8 | **CDXJ/CDX для обычного пользователя** — что это, как читать grep'ом, как сделать выгрузку «все мои страницы из архива». | `kb/instruments/file-formats/cdx.md` (расширить) + `kb/users/cdx-howto.md` (новая) | «как найти одну страницу в большом архиве» |

### 3.2. 🔴 P0 — «Как работать с Internet Archive и другими открытыми сервисами» (51 %, 25 голосов)

**Уже есть:**
- `kb/instruments/tools/internet-archive-cli.md` — подробная документация `ia`.
- `kb/similar/internet-archive.md` — обзор.
- `kb/similar/common-crawl.md`, `kb/similar/perma-cc.md`, `kb/similar/archiveteam.md`, `kb/similar/international-archives.md`.

**Чего не хватает:**
| № | Тема | Где должно жить | Зачем |
|:-:|:---|:---|:---|
| 3.2.1 | **Полный справочник Wayback Machine API** — SavePageNow, CDX API, Availability API, Memento API, search API. Примеры curl + Python для каждой эндпойнт-точки. | `kb/similar/internet-archive.md` (переработать в справочник) + `kb/instruments/tools/wayback-api.md` (новая) | «нужен программный доступ к Wayback» |
| 3.2.2 | **Работа с Internet Archive при блокировках** — VPN, зеркала, archive.org/details/`@ruarxive`, тематические коллекции archive.org, доступ через Tor. | `kb/similar/internet-archive.md` (раздел) | «archive.org не открывается, что делать» |
| 3.2.3 | **Common Crawl как источник данных** — что это, как использовать (cc-mr-job, cdx_toolkit, DuckDB), где лежат российские краулы. | `kb/similar/common-crawl.md` (переработать) | «как анализировать большие краулы» |
| 3.2.4 | **Perma.cc — API и сценарии** — создание permalink'ов, скриншоты, региональные группы (NY Courts, Harvard, etc.). | `kb/similar/perma-cc.md` (расширить) | «как получить постоянную ссылку на страницу» |
| 3.2.5 | **Сравнение открытых архивных сервисов** — таблица «Internet Archive / Common Crawl / Perma.cc / Archive-It / Archive Today / Conifer». Когда какой использовать. | `kb/similar/index.md` (новая или переработать) | «куда лить и откуда качать» |
| 3.2.6 | **Поиск «потерянных» архивов в открытых источниках** — Memento Time Travel, Mink, PastPage (расширение браузера), Zotero Robust Links, waybackpy. | `kb/instruments/tools/memento-search.md` (новая) | «нашёл цитату без ссылки, как восстановить источник» |
| 3.2.7 | **Российские независимые архивы СМИ** — «Холод», «Медуза», «Новая-Европа» и т. д. Где они выкладывают первичные данные, как с ними работать. | `kb/similar/russian-independent-media-archives.md` (новая) | «ищу архивы конкретных изданий» |
| 3.2.8 | **Украинские и белорусские архивы** — archivalia, archive.org.ua, bellingcat OSINT-находки. | `kb/similar/post-soviet-archives.md` (новая) | «нужны региональные соседи» |
| 3.2.9 | **IA S3 API и bulk data** — список bucket'ов, доступ к метаданным, derivate-файлы, что делать с .tar.gz коллекциями. | `kb/instruments/tools/internet-archive-cli.md` (раздел) | «как получить петабайты данных IA легально» |

### 3.3. 🟠 P1 — «Как собирать архивы сайтов» (48 %, 24 голоса)

**Уже есть:**
- `kb/guides/wget.md` (32 КБ), `kb/instruments/howto-collect/make-copy-website.md`, `kb/guides/quick-start-5min.md`, `kb/guides/emergency-archiving.md` (23 КБ).

**Чего не хватает:**
| № | Тема | Где должно жить |
|:-:|:---|:---|
| 3.3.1 | **Стратегия сбора: глубина vs ширина, бюджет, ретраи, политики скорости** — единая методология выбора. | `kb/guides/collection-strategies.md` (новая) |
| 3.3.2 | **Аутентификация на сайте (cookies, заголовки, browser profile)** для Browsertrix, Heritrix, Squidwarc. | Дополнить `browsertrix.md`, `heritrix.md`, новый раздел `kb/guides/authenticated-crawling.md` |
| 3.3.3 | **Сбор SPA: hydration, lazy-load, scroll-trigger, infinite scroll** — как настроить поведения Browsertrix (autoscroll, autoplay, siteSpecific). | `browsertrix.md` (раздел) |
| 3.3.4 | **Работа с robots.txt: чтение, интерпретация edge-case, nuancing для архивистов.** | `kb/legal/terms-of-service.md` (раздел) + новый гайд `kb/guides/robots-txt-for-archiving.md` |
| 3.3.5 | **Обход anti-bot защит (Cloudflare, DataDome, VK SmartCaptcha)** — что можно и нельзя, юридические рамки. | `kb/guides/anti-bot-and-archiving.md` (новая) |
| 3.3.6 | **Чек-лист «перед началом сбора»** — прописать seed, scope, rate, расписание, контакты владельцев. | `kb/guides/preflight-checklist.md` (новая) |
| 3.3.7 | **Расширить** существующий `quick-start-5min.md` — больше сценариев «сайт на JS, требуется login», «правительственный сайт с SSL-пиннингом». | `kb/guides/quick-start-5min.md` |

### 3.4. 🟠 P1 — «ПО цифровых архивистов» (48 %, 24 голоса)

**Уже есть:** 30 страниц по инструментам (см. 2.3), но нет «карты ландшафта».

**Чего не хватает:**
| № | Тема | Где должно жить |
|:-:|:---|:---|
| 3.4.1 | **«Ландшафтная карта веб-архивации 2026»** — большая обзорная страница: 4 столпа (capture, storage, access, analysis), инструменты по категориям, что в активной разработке vs legacy. | `kb/instruments/landscape-2026.md` (новая) |
| 3.4.2 | **Добавить недостающие инструменты (см. §4)**, в первую очередь: Auto-Archiver, Warchaeology, DuckDB-warc, WARC-Safe, Crocoite, Conifer, WAIL, Scoop, warc-gpt. | `kb/instruments/tools/*.md` (новые) |
| 3.4.3 | **«Чем отличается Ruarxive-стек от общеотраслевого»** — короткий пост с самопозиционированием. | `kb/about/lessons-learned.md` (раздел) либо новый пост блога |
| 3.4.4 | **Профильные подборки** — «инструменты для университетской библиотеки», «инструменты для OSINT-журналиста», «инструменты для индивидуального волонтёра». | `kb/resources/comparisons.md` (расширить) |

### 3.5. 🟡 P2 — «Как обрабатывать собранные веб-архивы» (42 %, 21 голос)

**Уже есть:**
- `kb/guides/warc-workflow.md` (разделы валидация/индексация/обогащение/упаковка).
- `kb/instruments/tools/warc-processing.md`, `shine.md`, `solrwayback.md`, `warc2zim.md`.
- `kb/instruments/ruarxive-tools/metawarc.md` + `metawarc-mcp.md`.

**Чего не хватает:**
| № | Тема | Где должно жить |
|:-:|:---|:---|
| 3.5.1 | **Фильтрация WARC по правилам** (только HTML, только 200-е, только русский язык, удалить трекеры) — примеры warcio, JWAT, jwarc, metawarc. | `kb/guides/warc-workflow.md` (раздел) + новый `kb/guides/warc-filtering.md` |
| 3.5.2 | **Дедупликация** — revisit-записи в WARC, fastsubset dedup, dat:// spec. | `kb/guides/warc-deduplication.md` (новая) |
| 3.5.3 | **Извлечение чистого текста** (boilerplate removal, trafilatura, jusText) — для NLP и поиска. | `kb/guides/text-extraction-from-warc.md` (новая) |
| 3.5.4 | **Анализ ссылочного графа** — построение, метрики, визуализация (Gephi, WebGraph, Hyphe). | `kb/guides/link-graph-analysis.md` (новая) |
| 3.5.5 | **WARC → DuckDB / Parquet** — DuckDB-warc, парquet-сайдкары metawarc, быстрые SQL-запросы. | `kb/instruments/tools/duckdb-warc.md` (новая) |
| 3.5.6 | **WARC + AI (RAG)** — warc-gpt от Harvard LIL, эксперименты, ограничения, промпты для архивистов. | `kb/instruments/tools/warc-gpt.md` (новая) либо `kb/case-studies/warc-gpt.md` |
| 3.5.7 | **WARC-Safe / антивирусная и контент-проверка** — для больших коллекций и публичных архивов. | `kb/instruments/tools/warc-safe.md` (новая) |
| 3.5.8 | **Конвертация WARC ↔ другие форматы** — WARC→ZIM, WARC→IIIF, WARC→bag-nabit→WARC (bagnabit2warc). | `kb/instruments/file-formats/conversion.md` (новая) |

### 3.6. 🟡 P2 — «Как работать с файлами внутри архивов» (42 %, 21 голос)

**Уже есть:** разделы в `kb/instruments/tools/warc-processing.md`, `kb/users/open-warc.md`, `kb/instruments/file-formats/warc.md`.

**Чего не хватает:**
| № | Тема | Где должно жить |
|:-:|:---|:---|
| 3.6.1 | **Пошаговое «вскрытие WARC»** — список URL, заголовков, извлечение конкретного ресурса по URL или по record-id. | `kb/users/inspect-warc.md` (новая) |
| 3.6.2 | **Работа с большими файлами** — streaming, warcio, WarcReader, OTFC, виртуальные таблицы DuckDB. | `kb/users/large-warc.md` (новая) |
| 3.6.3 | **Чтение только заголовков без payload** (для аудита коллекций). | `kb/users/warc-headers-only.md` (новая) |
| 3.6.4 | **Извлечение медиа-файлов из WARC** в дерево каталога с правильными именами. | `kb/users/extract-media-from-warc.md` (новая) |
| 3.6.5 | **Полнотекстовый поиск по содержимому архива** (ripgrep + WARC, hfgrep, warcgrep). | `kb/users/search-inside-warc.md` (новая) |
| 3.6.6 | **Siegfried / format-registries для архивов** — что внутри, как определить формат файлов внутри WARC. | расширить `kb/instruments/file-formats/identification-tools.md` |
| 3.6.7 | **Извлечение ссылок между страницами** — выгрузка всех URL, на которые ссылается страница; построение карты сайта из архива. | `kb/users/extract-links-from-warc.md` (новая) |

### 3.7. 🟢 P3 — «WARC, WACZ детали» (38 %, 19 голосов)

**Уже есть:** `kb/instruments/file-formats/warc.md`, `kb/instruments/file-formats/wacz.md`, `kb/instruments/file-formats/cdx.md`, `warc-workflow.md`.

**Чего не хватает:**
| № | Тема | Где должно жить |
|:-:|:---|:---|
| 3.7.1 | **WACZ Signing & Verification spec 2024+** — криптографическое подписание, проверка подлинности. | расширить `wacz.md` |
| 3.7.2 | **WARC 1.1 changelog vs 1.0** — что добавилось (новые типы record'ов). | расширить `warc.md` (краткий FAQ) |
| 3.7.3 | **Warchaeology: тулкит для валидации и инспекции** — проверка по SPEC, статистика по коллекции. | `kb/instruments/tools/warchaeology.md` (новая) |
| 3.7.4 | **WACZ Explorer / Warcbench** — клиентские инспекторы. | новые страницы или раздел в `replay/index.md` |

### 3.8. 🟢 P3 — «Архивация соцсетей» (36 %, 18 голосов)

**Уже есть:** instagram, vk, facebook, twitter, youtube, rutube, Data Take-Out для 11 платформ.

**Чего не хватает:**
| № | Тема | Где должно жить |
|:-:|:---|:---|
| 3.8.1 | **TikTok** — без официального API; yt-dlp-режим, snscrape-наследники. | `kb/instruments/social-media/tiktok.md` + `kb/instruments/data-take-out/dto-tiktok.md` |
| 3.8.2 | **WhatsApp** — node, chat export, D2-формат. | `kb/instruments/data-take-out/dto-whatsapp.md` |
| 3.8.3 | **Одноклассники (OK)** | `kb/instruments/data-take-out/dto-ok.md` |
| 3.8.4 | **Mastodon, Bluesky, Threads** — открытые API, проще чем Twitter. | `kb/instruments/social-media/mastodon.md` + `dto-mastodon.md` |
| 3.8.5 | **Auto-Archiver (Bellingcat) как обобщённый workflow** | `kb/instruments/tools/auto-archiver.md` (новая) |
| 3.8.6 | **Telethon / Pyrogram как альтернативы tdlib/tgarc** для Telegram | расширить `kb/instruments/social-media/telegram.md` либо новый `kb/instruments/social-media/telethon.md` |
| 3.8.7 | **Twitter/X v2 API: изменения 2023–2026** (лимиты, цены, Basic vs Pro). | обновить `kb/instruments/data-take-out/dto-twitter.md` + `kb/instruments/social-media/twarc.md` |
| 3.8.8 | **VK: сбор публичных сообществ** — vk-caching как рекомендованный путь. | расширить `kb/instruments/social-media/vk.md` и `dto-vk.md` |
| 3.8.9 | **Дисернейшн: что делать с платформами, потерявшими API** (оригинальный Twitter v1.1, Tumblr JSON API). | `kb/instruments/social-media/dead-platforms.md` (новая) |

### 3.9. «Другое» (6 %)
- Поднять в чате повторно с уточняющим постом «напишите в комментариях, чего конкретно не хватает».
- Запланировать отдельный опрос «практические рецепты vs API-референсы vs сравнения vs сообщество».

---

## 4. Внешние инструменты, которые отсутствуют в БЗ

Анализ `awesome-web-archiving`, GitHub Topics, IIPC, Bellingcat toolkit, Harvard LIL, Conifer и др. (по состоянию на октябрь 2026) — инструменты, регулярно упоминаемые в отрасли, но ещё не описанные:

| Инструмент | Что делает | Целесообразность |
|:---|:---|:---|
| **Auto-Archiver (Bellingcat)** | Workflow-оркестратор: ссылки из Google Sheets → архивация в нескольких сервисах + метаданные | 🟢 Высокая — прямая замена ручному труду в OSINT |
| **Warchaeology** | Утилиты валидации, инспекции, дедупликации WARC (Python-пакет) | 🟢 Высокая — закрывает 3.5.1–3.5.2 |
| **DuckDB-warc / duckdb-web-archive-cdx** | SQL-запросы к WARC и CDX напрямую | 🟢 Высокая — закрывает 3.5.5 |
| **WARC-Safe (UNT)** | Вирусная и NSFW-проверка новых архивов | 🟢 Высокая — must-have для публичных коллекций |
| **WARC-GPT (Harvard LIL)** | RAG-поиск по коллекции с помощью LLM | 🟡 Средняя — экспериментально, ограничения |
| **Conifer (Rhizome)** | Самохостинг персонального архива на базе pywb | 🟡 Средняя — хостинг закрывается в июне 2026, но legacy-код полезен |
| **Crocoite** | Chrome-кроулер с DOM-снимками и скриншотами | 🟡 Средняя — дополняет Browsertrix |
| **WAIL** (Web Archiving Integration Layer) | One-click GUI: Heritrix + WARC → pywb | 🟡 Средняя — для библиотек |
| **Scoop (Harvard Library Innovation Lab)** | Высокое качество захвата + WACZ-подписание | 🟡 Средняя — альтернатива Browsertrix |
| **Hyphe** | Исследовательский кроулер с визуализацией корпусов и link-graph | 🟢 Средняя — для академических проектов |
| **Warclight / PANDORÆ** | Blacklight-фронтенд для WARC-коллекций | 🟡 Низкая — нишевые |
| **Warc Explorer (браузерный)** | Онлайн-просмотр содержимого WARC | 🟢 Высокая — закрывает 3.6.x |
| **Waybackpy** | Python CLI/CDU для Wayback API | 🟢 Высокая — закрывает 3.2.6 |
| **PastPage** | Расширение браузера для автоматического поиска в веб-архивах | 🟢 Высокая |
| **Mink** | Chrome-расширение для Memento aggregators | 🟡 Средняя |
| **Zotero Robust Links** | Zotero-расширение для цитирования через Memento | 🟡 Средняя |
| **DiskerNet** | Хук в Chrome, не-WARC личный архив всего просмотренного | 🟡 Средняя |
| **Bellingcat OSINT Toolkit** | Сводка по инструментам для расследователей | 🟢 Высокая — мета-ресурс |

---

## 5. Структурные изменения

Помимо контента, требуется починить и улучшить ряд навигационных/организационных вещей:

| № | Что | Почему |
|:-:|:---|:---|
| 5.1 | **Сгруппировать `kb/users/` по сценариям читателя** — сейчас три страницы мало связаны; хочется «как открыть WARC», «как найти страницу в архиве», «как процитировать», «как пользоваться поиском по архиву». | Голос 6 (P2) показывает, что «извлечение и метаданные» востребованы — это именно пользовательские рецепты. |
| 5.2 | **Расширить `kb/similar/index.md`** — сделать его полноценной картой «куда деть архив» и «откуда достать». | Голос 2 (P0) — IA и аналоги в одном месте. |
| 5.3 | **Добавить в сайдбар категорию «Анализ и обработка»** (рядом с replay/social-media) для warc-фильтрации, duckdb, link-graph, RAG. | Голос 5 (P2) — отдельный логический блок. |
| 5.4 | **Создать `kb/resources/curated-lists.md`** с категориями «Новые инструменты 2026», «Уходящие в архив» (т.е. проекты на стадии заката). | Голос 4 (P1) — актуальный «срез рынка». |
| 5.5 | **Расширить глоссарий** — добавить ~30 терминов: revisit, CDXJ, ZIM, IIIF, METS, BagIt, durable storage, fixity check, Memento, AIP/DIP/SIP, OAIS, OpenWayback, Wayback Machine, Memento aggregator, snapshot, capture, replay, WACZ signing, hash chain, fixity, etc. | Пользователи из голосования постоянно оперируют этими терминами. |
| 5.6 | **Сделать «карту пути» в `intro.md`** — добавить блоки «Хочу воспроизвести архив у себя» / «Хочу загрузить на IA» / «Хочу обработать WARC». | Снижает барьер входа. |
| 5.7 | **CHANGELOG → версия 2.x** — отразить этот крупный апдейт. | Согласовано с процессом «Keep a Changelog». |
| 5.8 | **Перевод на английский** — самые востребованные страницы (open-warc, warc-workflow, replayweb-page, warc-tooling landscape) перевести на i18n/en. | Помогает привлекать волонтёров из-за рубежа. |

---

## 6. Дорожная карта по спринтам

Спринт ≈ 2 недели. Трудозатраты — рабочие дни одного контрибьютора.

### Спринт 1 (ноябрь 2026, нед. 1–2). P0 — закрытие двух крупнейших голосов.
- [ ] 3.1.1 Гайд по pywb с нуля (2 дня)
- [ ] 3.1.3 Расширение ReplayWebPage (1 день)
- [ ] 3.2.1 Справочник Wayback Machine API (2 дня)
- [ ] 3.2.5 Сравнительная таблица IA / Common Crawl / Perma.cc / Archive-It (0.5 дня)
- [ ] 5.2 Переработка `kb/similar/index.md` (0.5 дня)
- **PR1: «Replay + IA»**

### Спринт 2 (ноябрь 2026, нед. 3–4). P0 + начало P1.
- [ ] 3.1.6 Memento Protocol (1 день)
- [ ] 3.1.7 Сравнительная таблица replay-инструментов (0.5 дня)
- [ ] 3.1.2 Статический хостинг WACZ (1 день)
- [ ] 3.2.2 Работа с IA при блокировках (1 день)
- [ ] 3.2.7 Российские независимые архивы СМИ (1 день)
- [ ] 3.3.6 Preflight-чеклист (0.5 дня)
- [ ] 3.4.1 «Ландшафтная карта 2026» (2 дня)
- **PR2: «Replay-2 + IA-2 + Ландшафт»**

### Спринт 3 (декабрь 2026, нед. 1–2). Сбор сайтов и новые инструменты.
- [ ] 3.3.1 Стратегия сбора (1 день)
- [ ] 3.3.2 Аутентификация при сборе (1 день)
- [ ] 3.3.4/3.3.5 robots.txt + anti-bot (1 день)
- [ ] 3.4.2 Auto-Archiver (Bellingcat) (1 день)
- [ ] 3.4.2 Waybackpy, PastPage, Warc Explorer (по 0.5 дня)
- [ ] 5.4 `kb/resources/curated-lists.md` (0.5 дня)
- **PR3: «Сбор сайтов + новые инструменты»**

### Спринт 4 (декабрь 2026, нед. 3–4). P2 — обработка и извлечение.
- [ ] 3.5.5 DuckDB-warc (1 день)
- [ ] 3.5.1 Фильтрация WARC (1 день)
- [ ] 3.6.1 «Вскрытие WARC» (1 день)
- [ ] 3.6.2 Большие файлы (1 день)
- [ ] 3.5.6 WARC-GPT (0.5 дня)
- [ ] 5.1 Реорганизация `kb/users/` (1 день)
- [ ] 5.3 Новая категория в сайдбаре (0.5 дня)
- **PR4: «Обработка и извлечение»**

### Спринт 5 (январь 2027). P3 + соцсети.
- [ ] 3.8.1 TikTok (0.5 дня)
- [ ] 3.8.2 WhatsApp (0.5 дня)
- [ ] 3.8.4 Mastodon/Bluesky (0.5 дня)
- [ ] 3.8.7 Twitter v2 API update (0.5 дня)
- [ ] 3.7.3 Warchaeology (1 день)
- [ ] 3.7.4 Warcbench, WACZ Explorer (0.5 дня)
- [ ] 3.5.7 WARC-Safe (0.5 дня)
- [ ] 5.5 Расширение глоссария (1 день)
- **PR5: «Соцсети-2 + Прочее»**

### Спринт 6 (февраль 2027). Стабилизация.
- [ ] 3.2.3 Common Crawl (1 день)
- [ ] 3.2.4 Perma.cc API (1 день)
- [ ] 3.5.2 WARC-дедупликация (1 день)
- [ ] 3.5.4 Link-graph analysis (1 день)
- [ ] 3.5.8 Конвертация WARC↔ (1 день)
- [ ] 5.6 Карта пути в intro.md (0.5 дня)
- [ ] 5.7 CHANGELOG v2.x (0.5 дня)
- [ ] 5.8 EN-перевод 4 страниц (2 дня)
- **PR6: «Стабилизация»**

### Параллельно, в течение всего периода.
- [ ] Регулярный сбор «Другое» из чата.
- [ ] Ревью PRов от сообщества (рост ожидается после крупных PRов).
- [ ] Мониторинг awesome-web-archiving и GitHub Trending на новые инструменты.
- [ ] Метрики: число уникальных посетителей `kb/`, время на странице, доля пришедших из поиска.

---

## 7. Критерии приёмки (Definition of Done)

Каждый пункт плана считается выполненным, когда:
1. Markdown-файл прошёл проверку `npm run build` без ошибок и предупреждений.
2. Фронтматтер содержит `title`, `description`, `last_updated`.
3. Страница добавлена в `sidebars.js`.
4. Страница содержит не менее 1 примера команды или кода.
5. Если страница описывает инструмент — есть разделы «Зачем нужен», «Когда использовать», «Когда не использовать», «Сравнение» (если есть аналоги), «Ресурсы» (ссылки на внешние источники).
6. Все внутренние ссылки проверены и не ведут в 404.
7. В CHANGELOG добавлена запись о соответствующем PR.

---

## 8. Открытые вопросы / что уточнить у команды

1. **Приоритет «Другое».** Стоит ли опросить чат ещё раз с конкретным списком? Если да — к какому дедлайну?
2. **EN/i18n.** Реально ли держать два языка? Какие страницы обязательно нужны на английском?
3. **MCP.** metawarc-mcp уже описан; нужно ли описание MCP-инфраструктуры в целом (по аналогии с разделом «Программы и утилиты»)?
4. **Авторство.** Кто отвечает за каждое направление? Желательно распределить 6 спринтов на 2–3 человек + сообщество.
5. **Грантовая/финансовая сторона.** Имеет ли смысл подавать заявку на грант для расширения БЗ (например, по линии IIPC, или Open Society)?
6. **Хостинг.** Поднимем ли мы собственный pywb на домене ruarxive.org/playback/? Это бы дало конкретный use-case для гайда 3.1.1.
7. **Связь с курсом DH.1–DH.4.** Имеет ли смысл апдейтить PDF в `kb/course/` под новое содержание БЗ?

---

## 9. Сводный чек-лист PR-ов

- [ ] PR1 — «Replay + IA» (~6 дней)
- [ ] PR2 — «Replay-2 + IA-2 + Ландшафт» (~7 дней)
- [ ] PR3 — «Сбор сайтов + новые инструменты» (~5 дней)
- [ ] PR4 — «Обработка и извлечение» (~6 дней)
- [ ] PR5 — «Соцсети-2 + Прочее» (~5 дней)
- [ ] PR6 — «Стабилизация» (~7 дней)

Суммарно ~36 рабочих дней, ≈ 18 недель при 1 контрибьюторе full-time, или ~9 недель при 2 контрибьюторах параллельно.

---

*Документ подготовлен для команды Ruarxive. Использовать как операционный план; обновлять после каждого PR.*
