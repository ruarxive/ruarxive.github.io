---
sidebar_position: 1
last_updated: 2026-11-09
---

# Словарь терминов

Ключевые понятия цифровой архивации, веб-стандартов, форматов и проекта Ruarxive.

## Форматы и стандарты

### WARC (Web ARChive)
Стандартный формат для хранения HTTP-снимков веб-страниц. Файл содержит записи
с заголовками запросов/ответов и телом ответа. Подробнее: [WARC](/kb/instruments/file-formats/warc).

### WARC 1.1
Текущая версия стандарта ISO 28500. Расширения по сравнению с 1.0: новые типы записей, улучшенная поддержка compressed блоков, расширенные метаданные.

### WACZ (Web Archive Collection Zipped)
ZIP-обёртка над одним или несколькими WARC-файлами с индексами и метаданными.
Подходит для воспроизведения в плеерах вроде [ReplayWeb.page](/kb/instruments/replay/replayweb-page).

### WACZ Signing
Криптографическое подписание WACZ-архива для подтверждения авторства и целостности.
Используется [Scoop](https://tools.perma.cc/) и `wacz-signer`. Подробнее — [WACZ page](/kb/instruments/file-formats/wacz).

### CDX
Индексный формат, описысывающий содержимое WARC-файла. Каждая строка — одна запись:
URL, временная метка, тип, хеш. Подробнее: [CDX](/kb/instruments/file-formats/cdx).

### CDXJ
Расширение CDX в формате JSON Lines. Используется в WACZ-контейнерах и современных плеерах.

### ARC / ARC_IA
Предшественник WARC, использовавшийся Internet Archive с 1990-х. Большинство legacy-архивов (до ~2008) хранятся в `.arc.gz`. Конвертируется в WARC через `arc2warc`.

### PRONOM
Реестр форматов файлов Национального архива Великобритании. Уникальный идентификатор —
**PUID** (например, `fmt/40` для Word 97–2003).
Подробнее: [Реестры форматов](/kb/instruments/file-formats/format-registries).

### PUID
PRONOM Unique Identifier — стабильный идентификатор формата файла.

### BagIt
Стандарт упаковки и передачи цифровых материалов (RFC 8493). Каждая «bag» содержит данные
и манифест хешей для проверки целостности.

### PREMIS
PREservation Metadata: Implementing Strategies — стандарт метаданных сохранности цифровых
объектов. Используется для описания происхождения, прав и изменений. Подробнее: [PREMIS](/kb/instruments/file-formats/premis).

### METS
Metadata Encoding and Transmission Standard — стандарт структурных метаданных, описывающих
связи между файлами в сложных коллекциях. Подробнее: [METS](/kb/instruments/file-formats/mets).

### IIIF
International Image Interoperability Framework — протокол для доставки изображений высокого разрешения (мозаики, манифесты). Подробнее: [IIIF](/kb/instruments/file-formats/iiif).

### PDF/A
Стандартный формат PDF для долгосрочного хранения (без шифрования, без JavaScript). Подробнее: [PDF/A](/kb/instruments/file-formats/pdfa).

### JP2 (JPEG 2000)
Формат изображений с возможностями progressive и lossless. Стандарт для цифровой библиотеки
(Библиотека Конгресса, Internet Archive). Подробнее: [JP2](/kb/instruments/file-formats/jp2).

### MBOX
Текстовый формат хранения email-сообщений, последовательно соединённых. Подробнее: [MBOX](/kb/instruments/file-formats/mbox).

### SIARD
Software Independent Archiving of Relational Databases — формат для долгосрочного хранения
реляционных БД. Подробнее: [SIARD](/kb/instruments/file-formats/siard).

### MHTML
MIME HTML — формат хранения полной веб-страницы в одном файле (HTML + встроенные ресурсы).
Используется Internet Archive как альтернатива WARC для одиночных страниц.

### ZIM
Открытый формат сжатых файлов для офлайн-чтения через Kiwix. Часто создаётся из WARC через
[warc2zim](/kb/instruments/tools/warc2zim).

### AIP / DIP / SIP (OAIS)
- **SIP** — Submission Information Package (поступает на хранение).
- **AIP** — Archival Information Package (что хранится).
- **DIP** — Dissemination Information Package (что отдаётся пользователю).

Стандарт OAIS (ISO 14721) для референтной модели долгосрочного архивного хранения.

## Инструменты

### Heritrix
Краулер Internet Archive, написанный на Java. Используется для масштабной архивации
с генерацией WARC. Требует серьёзных ресурсов.

### Browsertrix
Современный краулер на базе Chrome от Webrecorder. Записывает трафик реального браузера
в WACZ. Подробнее: [Browsertrix](/kb/instruments/tools/browsertrix).

### HTTrack
Бесплатный GUI-инструмент для зеркалирования сайтов. Подходит для начинающих.

### Wpull
Python-клон Wget с поддержкой WARC. Подробнее: [make-copy-website](/kb/instruments/howto-collect/make-copy-website).

### Wget
Классическая консольная утилита для скачивания файлов по HTTP/FTP. Подробнее:
[Wget](/kb/guides/wget).

### yt-dlp
Форк youtube-dl с поддержкой тысяч видеохостингов. Подробнее:
[yt-dlp](/kb/instruments/tools/yt-dlp).

### Instaloader
Python-утилита для Instagram-анализов. Подробнее:
[Instaloader](/kb/instruments/social-media/instagram).

### Siegfried
Быстрый инструмент идентификации форматов файлов на Go. Подробнее:
[Идентификация форматов](/kb/instruments/file-formats/identification-tools).

### ReplayWeb.page
Браузерный плеер для воспроизведения WARC/WACZ-архивов. Полностью клиентский,
без отправки данных на сервер. Подробнее: [Как открыть WARC](/kb/users/open-warc).

### twarc
Python-библиотека для Twitter JSON-данных через Twitter API. Подробнее: [twarc](/kb/instruments/social-media/twarc).

### tgarc / tdl / Telethon
Инструменты для архивации Telegram-каналов.

### gallery-dl
Загрузчик изображений из 200+ платформ. Подробнее: [gallery-dl](/kb/instruments/tools/gallery-dl).

### Auto-Archiver (Bellingcat)
Workflow-оркестратор для архивации из Google Sheets, CSV, Telegram. Подробнее: [Auto-Archiver](/kb/instruments/tools/auto-archiver).

### Waybackpy
Python-обёртка для Wayback Machine API. Подробнее: [Waybackpy](/kb/instruments/tools/waybackpy).

### PastPage
Расширение браузера для автоматического поиска снимков страницы в архивах. Подробнее: [PastPage](/kb/instruments/tools/pastpage).

### Warchaeology
Набор IIPC-утилит для инспекции, валидации, дедупликации WARC. Подробнее: [Warchaeology](/kb/instruments/tools/warchaeology).

### DuckDB-WARC
DuckDB-расширение для SQL-запросов к WARC-файлам. Подробнее: [DuckDB-WARC](/kb/instruments/tools/duckdb-warc).

### WARC-GPT
RAG-инструмент Harvard LIL для анализа коллекций через LLM. Подробнее: [WARC-GPT](/kb/instruments/tools/warc-gpt).

### WARC-Safe
Сканер вирусов и NSFW для WARC от UNT. Подробнее: [WARC-Safe](/kb/instruments/tools/warc-safe).

### Crocoite
Chrome-кроулер с DOM-снимками и скриншотами от команды Crawliverse. Экспериментальный.

### Conifer
Самохостинг персонального архива от Rhizome (использует pywb под капотом). Хостинг закрыт в 2026, legacy-код сохранён.

### WAIL
Web Archiving Integration Layer — GUI для one-click Heritrix + pywb.

### Slim
Тонкий инструмент для быстрого извлечения URL из WARC.

### Warcprox
MITM-прокси, записывающий HTTP/S трафик в WARC. Интегрируется с Brozzler.

### Shovel
Готовые конфигурации и шаблоны для архивов от Ruarxive.

## Программные термины

### Краулер (web crawler)
Программа, систематически обходящая веб-страницы и собирающая их содержимое.

### Сид (seed)
Начальный URL, с которого краулер начинает обход сайта.

### Robots.txt
Стандартный файл с указаниями для ботов о допустимых разделах сайта.
Подробнее: [Условия использования](/kb/legal/terms-of-service).

### Wayback Machine
Сервис Internet Archive для доступа к веб-архивам. Позволяет просматривать старые
версии страниц. Подробнее: [Wayback Machine API](/kb/instruments/tools/wayback-api).

### Memento (RFC 7089)
Стандарт «time travel» для веб-архивов. Определяет TimeGate, TimeMap, Memento Datetime.
Подробнее: [Memento](/kb/instruments/replay/memento).

### Memento Aggregator
Федеративный сервис для поиска снимков страницы во всех Memento-совместимых архивах.
Подробнее: timetravel.mementoweb.org.

### Save Page Now
Форма Internet Archive для сохранения страницы по URL. Программный API: [Wayback Machine API](/kb/instruments/tools/wayback-api).

### CDX API
HTTP-индекс всех URL в архиве Internet Archive. Доступен через `web.archive.org/cdx/search/cdx`.

### WARC-Payload-Digest
Хеш (SHA-1 или SHA-256) от тела ответа в WARC-записи. Используется для дедупликации.

### WARC-Record-ID
UUID-идентификатор записи в WARC. Записывается в заголовке `WARC-Record-ID: <urn:uuid:...>`.

### WARC-Type
Тип WARC-записи: `warcinfo`, `request`, `response`, `metadata`, `revisit`, `conversion`, `continuation`, `resource`. Подробнее — [WARC page](/kb/instruments/file-formats/warc).

### Replay (воспроизведение)
Процесс отдачи страницы из архива как живой сайт. Осуществляется через [pywb](/kb/instruments/replay/pywb), [ReplayWeb.page](/kb/instruments/replay/replayweb-page), [OpenWayback](/kb/instruments/replay/openwayback).

### Capture (сбор)
Процесс сохранения содержимого в формате WARC. Осуществляется [Browsertrix](/kb/instruments/tools/browsertrix), [wget](/kb/instruments/tools/wget), [yt-dlp](/kb/instruments/tools/yt-dlp).

### Index (индекс)
Структура данных для быстрого поиска по содержимому WARC. Формат: CDX / CDXJ.
Создаётся через `warc-indexer-cdxj` или [pywb](/kb/instruments/replay/pywb).

### CDXJ
Расширение CDX в JSON Lines. Используется в WACZ.

### ActivityPub
Протокол децентрализованных социальных сетей (W3C). Используется [Mastodon](/kb/instruments/social-media/mastodon), Threads.

### AT Protocol
Протокол социальной сети Bluesky. Идентификатор — `did:plc:...` или `handle:instance.tld`.

## Стандарты архивации

### OAIS
Open Archival Information System — референтная модель архивного хранения ISO 14721.

### ISO 28500
Стандарт WARC. Текущая версия: 1.1.

### ISO 14721
Стандарт OAIS.

### RFC 7089
Memento (time travel для веб-архивов).

### RFC 8493
BagIt (упаковка архивов).

### RFC 5023
ZIP-формат Atom (для архивных фидов).

### NDSA Levels
National Digital Stewardship Alliance — четырёхуровневая модель цифровой сохранности:
1. Protect (защита данных), 2. Know (знание), 3. Monitor (мониторинг), 4. Repair (восстановление).
Подробнее: [NDSA Levels](https://ndsa.org/publications/levels-of-digital-preservation/).

## Проект Ruarxive

### Проактивная архивация
Архивация **до** исчезновения ресурса. Рекомендуемый подход.

### Реактивная архивация
Попытки архивировать **после** исчезновения. Часто малоэффективна.

### Воздушная архивация (lightweight archiving)
Малая выборка URL через API или CDN-кеши, без полного обхода.

### Коллекция (collection)
Группа архивов, объединённых тематически или принадлежащих одному проекту.

### RIMA
Russian Independent Media Archive — партнёрство Internet Archive, Bard College и PEN America для архивации российских независимых СМИ.

### Зеркало
Дубликат архива в другом месте для безопасности. Правило 3-2-1: 3 копии, 2 носителя, 1 вне офиса.

## Юридические термины

### CC-BY 4.0
Лицензия Creative Commons, разрешающая использование с указанием авторства.

### CC0 1.0 (Public Domain)
Отказ от всех прав; общественное достояние.

### ODbL
Open Data Commons Open Database License — для структурированных данных.

### GDPR
General Data Protection Regulation — регламент ЕС по защите персональных данных.

### 152-ФЗ
Федеральный закон РФ «О персональных данных».

### ToS (Terms of Service)
Условия использования сервиса или платформы. Подробнее: [Условия использования](/kb/legal/terms-of-service).

### Fair use / добросовестное использование
Доктрина, допускающая ограниченное использование материалов без разрешения правообладателя
в целях исследования, образования, критики.
Подробнее: [Авторское право](/kb/legal/copyright).

### Takedown
Процедура удаления архивной копии по запросу правообладателя или субъекта данных.

## Технические концепции

### Streaming
Обработка файла по частям без полной загрузки в RAM. Принципиально для 100+ ГБ WARC.

### Sharding
Разбиение большого файла на куски для параллельной обработки.

### Dedup (дедупликация)
Удаление повторяющихся записей по хешу содержимого.

### Boilertplate removal
Удаление из HTML повторяющихся блоков (меню, футер, сайдбар) для извлечения уникального контента.

### OCR (Optical Character Recognition)
Распознавание текста на изображениях (для PDF, сканов).

### Extract (извлечение)
Процесс получения конкретной записи или подмножества из большого WARC.

### Replay (отдача из архива)
См. выше.

### Hash chain
Последовательность хешей для проверки целостности длинной цепочки записей.

### Fixity check
Проверка, что данные не изменились (через хеширование).

### Cold storage / Glacier
Долгосрочное хранение с медленным доступом (дёшево). Подходит для архивов, к которым редко обращаются.

### Hot storage
Быстрое хранилище для часто используемых данных (дороже за ГБ).

## Сообщества и организации

### IIPC
International Internet Preservation Consortium — объединение архивов. Стандарты WARC, обучение, [конференции](https://netpreserve.org/).

### ArchiveTeam
Волонтёрское движение за экстренные архивы умирающих сервисов.

### Common Crawl
Некоммерческий фонд, собирающий петабайты веб-краулов для исследований.

### LockSSM
Distributed preservation network — протокол синхронизации архивов между инстансами.

## См. также

- [Wayback Machine API](/kb/instruments/tools/wayback-api)
- [Формат WARC](/kb/instruments/file-formats/warc)
- [Часто задаваемые вопросы](/kb/faq)
- [Ландшафт 2026](/kb/instruments/landscape-2026)
