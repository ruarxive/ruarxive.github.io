# Changelog

Все значительные изменения в проекте документируются в этом файле.

Формат основан на [Keep a Changelog](https://keepachangelog.com/ru/1.0.0/),
и этот проект придерживается [Semantic Versioning](https://semver.org/lang/ru/).

## [Unreleased] — 2026-10-29: обзорная страница «Инструменты Ruarxive»

Пакет RT-2 из ревизии `temp/ruarxive-tools-review-2026-10-29.md`.

### Добавлено

- **`ruarxive-tools/index`**:
  - таблица «Что получается на выходе»: формат результата, запись WARC и версия Python для каждого инструмента;
  - схема «Как инструменты стыкуются» (Mermaid) и ссылки на три кейса-конвейера;
  - раздел «Где применялись»: apibackuper в кампаниях Coub и «Отчёты Счётной палаты», metawarc в архивах Regnum и Росбалта. Отдельно сказано, что сайты СМИ 2022 года собраны wpull, Telegram — экспортом Telegram Desktop, порталы открытых данных — скриптами rudatarchive;
  - раздел «Ошибки и предложения»: Issues, `CONTRIBUTING.md`, `SECURITY.md`, запрос на архивацию;
  - ссылка на awesome-digital-preservation.
- **Принципы**: `ydiskarc sync --update`, `apibackuper run continue` и `--resume`; новый пункт про хранилище `.partial` в apibackuper 2.0.

### Исправлено

- **`case-studies/multi-tool-archiving`**: убрана команда `spcrawler getfiles`. В версии 1.0.1 это заглушка (`spapi/crawler.py:49`, тело `pass`), файлы она не скачивает. Теперь ссылки на документы из JSONL передаются filegetter.

## [Unreleased] — 2026-10-29: мелкие правки раздела «Инструменты Ruarxive»

Пакет RT-5 из ревизии `temp/ruarxive-tools-review-2026-10-29.md`.

### Добавлено

- **`ruarxive-tools/filegetter`**: опция `filegetter --version` (она относится к утилите, а не к команде `run`). Раздел «Готовые проекты в репозитории»: `budget2023`, `goskatalog`, `rupolitparties` с числом файлов. Все три проверены командой `filegetter run --dry-run` в версии 1.1.0 29.10.2026. Переменные прокси из README не добавлены: `CONTRIBUTING.md` запрещает советы про прокси.
- **`downloaded-data/apibackuper-configs`**: раздел о двух ранних репозиториях с примерами — `apibackuper-example-spbbudget` (29 162 записи) и `apibackuper-berlin-airport-example` (226 записей). Обе конфигурации проходят `apibackuper validate-config` в версии 2.0.0. При проверке 29.10.2026 API аэропорта ответило `403`, API «Твоего бюджета» не ответило.
- **`landscape-2026`**: apibackuper и spcrawler в таблице сборщиков; apibackuper 2.0 и filegetter 1.1 в списке новинок 2024–2026 годов.

### Исправлено

- **`landscape-2026`**: схема «Для Ruarxive» ставила tgarc перед metawarc, хотя tgarc пишет JSONL, а не WARC. Теперь в начале цепочки Wget, Browsertrix, `wparc warc` и filegetter.
- **`ruarxive-tools/metawarc`**: второй заголовок H1 «Расширенные разделы» стал H2, а разделы под ним — H3. Адреса якорей не изменились.

## [Unreleased] — 2026-10-29: сайдбар раздела «Инструменты Ruarxive»

Пакет RT-1 из ревизии `temp/ruarxive-tools-review-2026-10-29.md`.

### Изменено

- **Сайдбар «Инструменты Ruarxive» → «Сбор данных»**: добавлены ссылки на apibackuper и spcrawler (элементы `ref`: страницы остаются в «Загружаемых данных», адреса прежние). tgarc перенесён в конец списка как неразвиваемый. Порядок теперь совпадает с таблицей на обзорной странице.
- **`downloaded-data/spcrawler`**: подпись в сайдбаре «spcrawler (SharePoint)», как у остальных сборщиков. `sidebar_label` во frontmatter перекрывает `label` у элемента `ref`, поэтому подпись задана в самой странице.

## [Unreleased] — 2026-10-29: мелкие правки раздела «Социальные сети»

Пакет SM-6, последний из ревизии `temp/social-media-review-2026-10-28.md`.

### Изменено

- **`social-media/twarc`**: таблица «Сколько стоит выгрузка» (10 тыс., 100 тыс., 1 млн постов и потолок 3 млн в месяц) по ценам X API на октябрь 2026 года. Раздел «Если API недоступен» сокращён до ссылки на страницу Twitter/X: twarc остаётся страницей инструмента.
- **`social-media/mastodon`**: поток новых записей Bluesky через Jetstream (параметры `collections`, `dids`, `kinds`, `cursor`, скрипт записи в JSONL) — проверено подключением к `jetstream.us-east.bsky.network`.
- **`social-media/max`**: проверка 29.10.2026 — ссылка на канал без входа показывает только карточку, веб-клиент `web.max.ru` требует входа по QR-коду или номеру телефона.
- **`social-media/tiktok`**: с января 2026 года TikTok в США обслуживает TikTok USDS Joint Venture; условия Research API для США не изменились.

## [Unreleased] — 2026-10-29: новые площадки

Пакет SM-5 из ревизии `temp/social-media-review-2026-10-28.md`: шесть новых страниц. Команды сверены с текущими версиями инструментов, часть — пробными запусками 29.10.2026.

### Добавлено

- **`social-media/twitter-x`** — страница площадки (twarc остаётся страницей инструмента): хронология API 2023–2026 (тарифы, оплата за использование, решения Еврокомиссии по DSA 05.12.2025 и 15.07.2026), архив своего аккаунта, поиск снимков постов через Wayback CDX под `twitter.com` и `x.com`, archive.ph с оговоркой о доверии, Auto-Archiver без модуля обхода антибот-защиты (с предупреждением, что запасной путь идёт через `api.fxtwitter.com`), медиа через yt-dlp и gallery-dl, поведение Browsertrix для X, выгрузка Community Notes, условия X от 09.10.2026.
- **`data-take-out/dto-bluesky`** — выгрузка своего аккаунта Bluesky: `repo.car` и `chat.jsonl` из настроек (путь сверен с исходным кодом приложения), что входит в CAR и что нет, goat и скрипт на atproto для чтения CAR, медиафайлы через `listBlobs` и `getBlob`.
- **`social-media/ok`** — Одноклассники: снимок открытых групп и постов с комментариями в Browsertrix (лента группы сохраняется только частично), видео через yt-dlp, что даёт и чего не даёт API ОК.
- **`social-media/dzen`** — Дзен: снимок статей с комментариями, длинные видео через yt-dlp (статьи и ролики yt-dlp не берёт), переход от Яндекса к VK в 2022 году и поиск под двумя доменами.
- **`social-media/livejournal`** — Живой Журнал: экспорт своего журнала по месяцам, RSS и Atom, обход wget и Browsertrix, страницы комментариев и правило `robots.txt` для них, правила публикации с 29.12.2025, ArchiveTeam и Wayback.
- **`social-media/other-platforms`** — Reddit (доступ к Data API только по заявке, Wayback с августа 2025 года сохраняет только главную), Twitch (сроки хранения записей эфиров, yt-dlp, чат через TwitchDownloader), Discord (выгрузка своего сервера ботом, предупреждение о пользовательских токенах), каналы WhatsApp.

### Изменено

- **Сайдбар**: ОК, Дзен и ЖЖ — в «Российских платформах», Twitter/X и сводная страница — в «Международных», Bluesky — в Data Take-Out.
- **Матрица «Что можно получить»** дополнена строками Одноклассников, Дзена, ЖЖ, Reddit и Twitch; строка Twitter/X ведёт на новую страницу, строка Bluesky — на выгрузку.
- Ссылки на новые страницы: `twarc`, `mastodon`, `dto-twitter`, `data-take-out-main`.

### Исправлено

- **`tools/gallery-dl`**: OAuth для Reddit назывался необязательным. В 2026 году Reddit блокирует запросы без OAuth.
- **`social-media/dead-platforms`**: строка Reddit — доступ к API теперь только по одобренной заявке, Wayback сохраняет только главную страницу.

## [Unreleased] — 2026-10-29: Meta и закрытые API

Пакет SM-4 из ревизии `temp/social-media-review-2026-10-28.md`: Facebook, Instagram и сводка закрытых интерфейсов.

### Изменено

- **`social-media/facebook`**: поведение Browsertrix для Facebook (лента страницы и группы, комментарии, фото, Reels), `--behaviorTimeout` и `--alwaysAddBehaviorLinks` — сверено с документацией Browsertrix Crawler 1.15.2 и `src/site/facebook.ts`; раздел о группах; доступ исследователей по ст. 40 DSA (делегированный регламент (ЕС) 2025/2050); Wget помечен как способ только для разовой проверки.
- **`social-media/instagram`**: Stories, хайлайты, Reels и отметки (`--stories`, `--highlights`, `--no-posts`, `--reels`, `--tagged`), таблица частых ошибок Instaloader с сообщениями из исходного кода 4.16, поведение Browsertrix для Instagram, раздел для исследователей (Meta Content Library, DSA, Threads), раздел «Ресурсы». Версия в строке сверки — 4.16.
- **`social-media/dead-platforms`** переименована в «Закрытые API, площадки и инструменты» (адрес прежний) и разбита на три таблицы. Добавлены: API Reddit (платный с 01.07.2023), Pushshift, кэш Google, Google+, Vine, Periscope, Coub (закрытие отменено), snscrape, Twint, Nitter (требование X Corp. от 24.08.2026). У каждой строки — источник, у закрытых площадок — где искать исчезнувшее.

### Исправлено

- **`guides/emergency-archiving`**: для Telegram-каналов вместо tgarc — tdl и Telethon (пропущено в SM-2).

## [Unreleased] — 2026-10-29: методика и ограничения в РФ

Пакет SM-3 из ревизии `temp/social-media-review-2026-10-28.md`: общие правила вынесены на одну страницу, обзор раздела отвечает на вопрос «что можно получить».

### Добавлено

- **`social-media/methodology`** («Методика архивации соцсетей»): единица сбора, данные / вид страницы / файлы и когда что нужно, что теряется при сборе, паспорт сбора (`README.md` с примером), отдельный аккаунт и сессии, темп и журнал скачанного, хранение в JSONL + `gzip` и `SHA256SUMS`, право и этика, короткий порядок действий.
- **Матрица «Что можно получить»** в обзоре раздела: публикации, комментарии, медиафайлы, что нужно для доступа и выгрузка своего аккаунта для 12 площадок. Заменила прежнюю таблицу «Обзор по платформам».
- **Блок «Ограничения доступа в России»** в обзоре раздела: X, Facebook, Instagram (2022), TikTok (ограничение самой платформы), YouTube (замедление с июля 2024 года, домен убран из НСДИ в феврале 2026 года), Telegram и WhatsApp (звонки с августа 2025 года, дальнейшие ограничения 2026 года) — с датами и источниками, без советов по обходу. На блок ссылаются `data-take-out-main`, `dto-whatsapp`, `dto-youtube`, `youtube-video`, `telegram`.
- **`social-media/mastodon`**: ветки обсуждения — `statuses/:id/context` у Mastodon (с лимитами анонимного доступа по документации) и `app.bsky.feed.getPostThread` у Bluesky; оба запроса проверены без авторизации.

### Изменено

- **Повторы общих советов** (README выгрузки, SHA-256) на страницах Telegram, YouTube, TikTok и twarc заменены ссылкой на методику; специфичное для площадки осталось на месте. Ссылка на методику добавлена в «Связанные материалы» всех платформенных страниц, у `rutube` такой раздел появился впервые.

### Исправлено

- **Статус YouTube в РФ.** На страницах `youtube-video` и `dto-youtube` было «работает с сильным замедлением». С февраля 2026 года домен youtube.com отсутствует в НСДИ; текст обновлён.
- **`dto-youtube`**: пример выгрузки канала по адресу `/videos` пропускал Shorts и трансляции — теперь адрес канала без вкладки, как на странице «Архивация YouTube».

## [Unreleased] — 2026-10-29: Telegram и YouTube

Пакет SM-2 из ревизии `temp/social-media-review-2026-10-28.md`: две самые короткие из важных страниц раздела доведены до уровня страницы ВКонтакте.

### Изменено

- **`social-media/telegram`** переписана: таблица «задача → способ» и «что получится», экспорт Telegram Desktop с практикой Ruarxive 2022 года, рецепты tdl (экспорт, медиа, докачка, `--takeout`, комментарии `--reply`), скрипт на Telethon с записью в JSONL, докачкой по `min_id` и обработкой `FloodWaitError`, комментарии через `reply_to`, снимок `t.me/s/` с пагинацией `?before=`, хранение и право. Предупреждение: выгружать заранее на фоне блокировок 2026 года, без советов по обходу. Telethon переехал на Codeberg — ссылки обновлены.
- **`social-media/youtube-video`** («Архивация YouTube») переписана: канал целиком, комментарии (`max_comments`, `comment_sort`), субтитры и чат трансляции (`live_chat`), эфиры и премьеры (`--live-from-start`, `--wait-for-video`), видео с ограничениями, записи сообщества, поиск удалённых видео через Wayback CDX и ArchiveTeam, хранение, каналы госорганов 2013 года в хранилище Ruarxive.
- **`data-take-out/dto-telegram`**: вместо полной инструкции по tgarc («Способ 3») — tdl и Telethon со ссылкой на страницу Telegram; tgarc оставлен как справка о формате старых выгрузок.

### Исправлено

- **Адрес канала YouTube.** Пример с `/@канал/videos` скачивал только вкладку «Видео» без Shorts и трансляций. Теперь канал передаётся без вкладки — так yt-dlp забирает все загрузки (сверено с `yt_dlp/extractor/youtube/_tab.py`, yt-dlp 2026.10.26).
- **tgarc для нового сбора** больше не советуется в `faq`, `resources/comparisons`, `resources/stats-snapshot`, `similar/index`, `similar/russian-independent-media-archives`: вместо него — экспорт Telegram Desktop и tdl.

## [Unreleased] — 2026-10-28: структура раздела «Социальные сети»

Пакет SM-1 из ревизии `temp/social-media-review-2026-10-28.md`.

### Изменено

- **Сайдбар раздела** разбит на группы «Российские платформы» (VK, Telegram, MAX, Rutube), «Международные платформы» (YouTube, twarc, Facebook, Instagram, TikTok, Mastodon/Bluesky/Threads) и «Закрытое и устаревшее» (закрытые API, F(b)arc, Social Feed Manager). Раньше страницы шли без порядка.
- **Подписи**: страница видео переименована в «Архивация YouTube» (адрес `youtube-video` не менялся), подпись «Mastodon и другие Fediverse» заменена на «Mastodon, Bluesky, Threads»: Bluesky к Fediverse не относится.
- **Frontmatter**: убран `sidebar_position`, который при явном сайдбаре ни на что не влиял (index, vk, facebook, rutube); добавлены `keywords` на 8 страницах.
- **`social-media/facebook`**: добавлены разделы «Ресурсы» и «Связанные материалы».
- **`social-media/dead-platforms`**: у каждой строки появилась колонка «Источник» (TechCrunch для API Twitter 2023 года, Meta Transparency Center и Meta for Developers, блог Conifer, репозитории GitHub).

### Исправлено

- **Conifer**: сервис не «закрыт в июне 2026 года». С мая 2026 года он работает только на чтение, а переход в архивный режим Rhizome 16.10.2026 перенесла на конец года. Исправлено в `dead-platforms`, `glossary`, `landscape-2026`, `similar/index`, `resources/curated-lists`, `tools/archive-ph`, `replay/memento`, `guides/emergency-archiving`.

## [Unreleased] — 2026-10-28: срочные исправления по анализу актуальности

Пакет PR-A из анализа `temp/kb-actualization-2026-10-28.md`: исправлены страницы, которые после ревизии 12.10 вводили читателя в заблуждение.

### Исправлено

- **archive.today (archive.ph)**: на странице сервиса добавлено предупреждение. В 2026 году CAPTCHA-страница сервиса участвовала в DDoS-атаке, оператор менял сохранённые снимки, английская Википедия отказалась от ссылок на сервис, в части российских сетей он открывается со страницей блокировки. В быстром старте, экстренной архивации, обзорах инструментов, `landscape-2026`, `similar/*`, FAQ и `intro` основным способом сохранить страницу теперь назван Save Page Now, а archive.today — только дополнительной копией.
- **apibackuper 2.0.0** (17.10.2026): нужен Python 3.10+. `run incremental` стал псевдонимом `run continue`, добавлены `--dry-run`/`--profile`, описан режим `update` (`update_mode`, поколения в `runs/<id>/`). Пример регулярной дозагрузки в `guides/custom-workflows` переведён на `update`, на остальных страницах обновлена версия сверки.
- **Scoop 0.7.0**: нужен Node.js 22+. Песочница Chromium включена по умолчанию, добавлен раздел о запуске в контейнере.
- **robots.txt в Browsertrix Crawler**: по умолчанию краулер его не читает. В гайд `robots-txt-for-archiving` и в команды Browsertrix в гайдах и на странице инструмента добавлен `--robots`. Для Wget описан `--rejected-log` (причина `ROBOTS`) вместо несуществующих строк `Robot.txt` в журнале.
- **`guides/warc-filtering`**: вместо совета сжать WARC обычным `gzip` (ломает смещения CDX и pywb) — `warcio recompress` с проверкой.
- **yt-dlp для YouTube** в `social-media/youtube-video` и `dto-youtube`: установка `yt-dlp[default]` и Deno (EJS), замечание о замедлении YouTube в РФ.
- **Notion**: предупреждение о прекращении работы в России с 09.09.2024.
- **Предупреждения в стиле GitHub** (`> [!WARNING]`, `> [!NOTE]`), которые Docusaurus выводил буквальным текстом, заменены на `:::warning` / `:::note` (max, tiktok, mastodon, dto-slack, dto-whatsapp).

## [Unreleased] — 2026-10-12: ревизия достоверности базы знаний

Проверка всех 177 страниц `kb/` по первоисточникам (README и исходный код, `--help` установленных версий, спецификации, PRONOM, полная выгрузка Telegram-канала @ruarxive). Найдено и исправлено 924 замечания. Отчёты: `temp/kb-review-2026-10-12.md`, `temp/review-2026-10-12/`.

> Часть описаний ниже, в разделах PR1–PR6, устарела: эти страницы переписаны в рамках этой ревизии (например, WARC-Safe — проект Национальной библиотеки Люксембурга, а не UNT; Warchaeology — Go-утилита `warc`; PastPage — реальное расширение `nabertronic/pastpage`).

### Исправлено

- **Выдуманные команды, флаги, конфиги и API** заменены сверенными с первоисточником на страницах инструментов (browsertrix, brozzler, heritrix, httrack, monolith, `ia`, gallery-dl, grab-site, archivebox, auto-archiver, pywb, wacz, warcio, warcprox, warc2zim, yt-dlp, wget и др.); на переписанных страницах указана версия, с которой сверялись команды.
- **Собственные инструменты Ruarxive** (tgarc, wparc, ydiskarc, filegetter, metawarc, apibackuper, spcrawler) описаны по реальному коду; удалён несуществующий plugin API metawarc и инструмент `vk-caching`.
- **Неверные атрибуции и несуществующие функции**: Brozzler (RethinkDB, а не Redis), WARC-Safe, Warchaeology, Shine, waybackpy, WARC-GPT, PastPage, DuckDB-WARC, CDX Summary, dvd, Obelisk, Warcworker, Squidwarc, warc2html, ReplayWeb.page.
- **Справочные данные**: идентификаторы PRONOM, легенда CDX и формат CDXJ, структура WACZ 1.1.1, семантика revisit-записей, SIARD, JPEG 2000.
- **Удалены выдуманные бенчмарки и детали кейсов** (большие WARC, дедупликация, «Эхо Москвы», международные кейсы, «Электронный бюджет»); утверждения со ссылками на `t.me/ruarxive/N` сверены с текстами постов.
- **Правовые страницы**: ст. 10.1 152-ФЗ, единый срок ответа на запрос об удалении (10 рабочих дней), ст. 1259 и 1275 ГК РФ; убраны советы по обходу блокировок (VPN, Tor) и тезисы о «серой зоне»; статусы организаций указаны по подтверждённым источникам.
- **Факты о проекте**: убраны неподтверждённые общие цифры объёма архива и числа проектов; хронология проекта вместо «с 2016 года»; `resources/stats-snapshot` — каноническая страница цифр по коллекциям.
- **Устаревшее**: Conifer (закрыт в июне 2026), Twitter Academic API, CrowdTangle, fbarc, Social Feed Manager, Pocket/Omnivore; HTTrack с версии 3.49-14 пишет WARC/WACZ.
- **Ошибки аудита ссылок** от 2026-10-12 (неверные замены репозиториев, оставшиеся битые ссылки).

### Изменено

- Frontmatter: у всех страниц есть `title`, `description` и штатное поле `last_update.date` (вместо игнорируемого `last_updated`); в `docusaurus.config.js` включён `showLastUpdateTime`.
- Переводы строк в `kb/` приведены к LF, добавлен `.gitattributes`.
- Сайдбар: обзорные страницы `similar`, `resources`, `downloaded-data` подключены как страницы категорий; убран дубль `guides/index`; закрытые fbarc и Social Feed Manager перенесены в конец раздела «Социальные сети».
- Удалены неиспользуемые `_category_.json` (сайдбар задаётся явно в `sidebars.js`) и ошибочный gitlink `ruarxive_web`.
- `CONTRIBUTING.md`, `docs/_template.md`: новый формат frontmatter и обязательные проверки (сверка команд с реальной версией, источники фактов о проекте, запрет советов по обходу блокировок). В `README.md` исправлена лицензия (Apache 2.0).

## 2026-10 — PR1 — Replay и Internet Archive

### Добавлено

- **Раздел воспроизведения архивов (`kb/instruments/replay/`)** — расширен под приоритеты голосования сообщества (53 % «как воспроизводить архивы»):
  - `pywb.md` — переписан как пошаговый гайд с нуля (5-минутный запуск, CDX API, Memento API, multi-collection, производительность, деплой через nginx).
  - `replayweb-page.md` — расширен: сценарии для больших WACZ (десятки ГБ), аннотации, экспорт страниц, сравнение версий, статический хостинг.
  - `index.md` — переработан: сравнительная таблица по размеру архива и формату деплоя, матрица возможностей.
  - `memento.md` — **новая страница**: стандарт RFC 7089, TimeGate, TimeMap, Memento Aggregator, программные обёртки (waybackpy), браузерные расширения (Mink, PastPage).

- **Wayback Machine API (`kb/instruments/tools/wayback-api.md`)** — **новая страница-справочник**: SavePageNow, CDX API, Availability API, Memento API, S3-подобный API, rate limits, программные обёртки (waybackpy, cdx_toolkit, duckdb-web-archive-cdx), сценарии использования.

- **Internet Archive (`kb/similar/internet-archive.md`)** — расширен: доступ при блокировках (VPN, Tor, onion), S3 API, таблица протоколов, юридические аспекты загрузки.

- **Похожие проекты (`kb/similar/index.md`)** — переработан в карту открытых сервисов с сравнительной таблицей «куда залить / откуда достать», обновлённой структурой под голос 51 % (Internet Archive и аналоги).

- **WARC-файл: от сырого архива до публикации (`kb/guides/warc-workflow.md`)** — расширен раздел «Хостинг статического WACZ»: минимальный сценарий, настройка CORS для S3/R2, CloudFront/Cloudflare CDN, лимиты хостеров, разбиение большого WACZ на части, сравнение с self-hosted pywb.

### Изменено

- **Сайдбар (`sidebars.js`)**:
  - Подключены новые страницы: `instruments/tools/wayback-api` (в раздел «Управление архивацией»), `instruments/replay/memento` (в «Воспроизведение архивов»), `instruments/landscape-2026` (в корень «Инструменты»), `similar/russian-independent-media-archives` (в «Похожие проекты»), `guides/preflight-checklist` и `guides/collection-strategies` (в «Продвинутые темы»).
  - Сравнительная таблица в `instruments/replay/index.md` структурирована по размеру архива.

### Добавлено (PR2)

- **Ландшафтная карта 2026 (`kb/instruments/landscape-2026.md`)** — **новая страница**: обзор всех инструментов и инициатив по 4 столпам (capture, storage, access, analysis), deprecated-инструменты, активные в 2026 сообщества и организации.

- **Российские независимые архивы СМИ (`kb/similar/russian-independent-media-archives.md`)** — **новая страница**: PEN America, «Архив „Холода"», «Медуза», «Дождь», юридические аспекты архивации.

- **Preflight-чеклист (`kb/guides/preflight-checklist.md`)** — **новая страница**: 12-частный чек-лист перед запуском кроулера (цель, scope, инструменты, юр. ограничения, расписание, хранение, мониторинг, пост-обработка).

- **Стратегии сбора (`kb/guides/collection-strategies.md`)** — **новая страница**: 8 параметров стратегии, шаблоны для разных классов сайтов, метрики успеха, антипаттерны.

### Добавлено (PR3)

- **Auto-Archiver (Bellingcat) (`kb/instruments/tools/auto-archiver.md`)** — **новая страница**: Bellingcat OSINT-инструмент для workflow-архивации из Google Sheets, CSV, Telegram. Интеграция с yt-dlp, Browsertrix, instaloader. Сценарии использования.

- **Waybackpy (`kb/instruments/tools/waybackpy.md`)** — **новая страница**: Python-обёртка для Wayback Machine API. Базовый и асинхронный режим, CLI, реальные сценарии (link-rot отчёты, цитирование, RSS-бэкапы).

- **PastPage (`kb/instruments/tools/pastpage.md`)** — **новая страница**: браузерное расширение для Chrome/Firefox, автоматически находящее архивные копии страниц в Wayback, Archive.today, Perma.cc и других Memento-совместимых архивах.

- **TikTok (`kb/instruments/social-media/tiktok.md`)** — **новая страница**: методы архивации TikTok через yt-dlp, TikTokApi, snscrape, официальный Research API. Юридические ограничения.

- **Mastodon, Bluesky, Threads (`kb/instruments/social-media/mastodon.md`)** — **новая страница**: архивация открытых протоколов (ActivityPub, AT Protocol). Программный доступ без аутентификации, скрейпинг, этические ограничения.

### Добавлено (PR4)

- **DuckDB-WARC / DuckDB-CDX (`kb/instruments/tools/duckdb-warc.md`)** — **новая страница**: SQL-запросы к WARC и CDX Internet Archive / Common Crawl через DuckDB. Сравнение с традиционными инструментами, интеграция с Ruarxive metawarc.

- **WARC-GPT (`kb/instruments/tools/warc-gpt.md`)** — **новая страница**: RAG-инструмент Harvard LIL для анализа коллекций WARC через LLM. Архитектура, embedding-провайдеры, реальные сценарии, ограничения и галлюцинации.

- **Warchaeology (`kb/instruments/tools/warchaeology.md`)** — **новая страница**: IIPC-утилиты для инспекции, валидации, дедупликации, фильтрации WARC. warc-survey, warc-dedup, warc-validate, warc-filter, warc-indexer-cdxj.

- **WARC-Safe (`kb/instruments/tools/warc-safe.md`)** — **новая страница**: первый open-source сканер вирусов и NSFW-контента для WARC от UNT. Интеграция с SolrWayback и UK Web Archive, форматы отчётов.

- **«Вскрытие» WARC/WACZ (`kb/users/inspect-warc.md`)** — **новая страница** для пользователей: как достать нужную страницу или URL из WARC. warcdump, warcio, Python-скрипты для типовых задач.

- **Работа с большими WARC (`kb/users/large-warc.md`)** — **новая страница**: стратегии для архивов > 10 ГБ. Стриминг, шардинг, DuckDB-WARC, CDXJ-индексирование, реальные бенчмарки на 173-ГБ Эхо Москвы.

### Добавлено (PR5) и PR6 начало

- **Глоссарий (`kb/glossary.md`)** — **расширен**: добавлено ~60 терминов (WARC 1.1, WACZ Signing, Memento, ActivityPub, AT Protocol, NDSA Levels, OAIS, AIP/DIP/SIP, hash chain, fixity check, дублирование, sharding, streaming и др.).

- **WhatsApp (`kb/instruments/data-take-out/dto-whatsapp.md`)** — **новая страница**: экспорт данных WhatsApp через встроенный чат-export, GDPR-запрос, WhatsApp Business API, локальные бэкапы, Selenium/Playwright, Auto-Archiver. Юридические ограничения.

- **twarc v2 (`kb/instruments/social-media/twarc.md`)** — **переработан**: обновлён под Twitter API v2 (тарифы Free/Basic $100/Pro $5 000/Academic), гибридный v1+v2, новый JSON-формат, hydration, list/thread/conversation, изменения 2023–2026.

- **Common Crawl (`kb/similar/common-crawl.md`)** — **переработан**: подробный обзор WARC/WAT/WET, доступ через S3 и HuggingFace, программный доступ (cdx_toolkit, DuckDB, Spark, Athena), сценарии для русского веба, ограничения, сравнение с IA.

### Добавлено (PR6 финал)

- **Главная страница БЗ (`kb/intro.md`)** — **переработана**: карта путей по 11 сценариям (экстренная архивация, открытие WARC, сбор своего, загрузка в IA, соцсети, анализ больших архивов, поиск в архиве, форматы, обучение, помощь проекту), справочник форматов за 60 секунд, раздел «как устроена БЗ», прямые ссылки на 90+ страниц.

- **Perma.cc (`kb/similar/perma-cc.md`)** — **переработан**: подробная страница — академический/юридический фокус, форматы сохранения (скриншот + WACZ + HTML + JSON), API v1 с curl/Python примерами, сценарии использования (научные статьи, юридические заключения, OSINT), сравнение с Wayback Machine по 10+ признакам.

- **WARC-дедупликация (`kb/guides/warc-deduplication.md`)** — **новая страница**: глубокое покрытие — алгоритмы (payload-digest, URL, SURT, similarity), инструменты (warchaeology, DuckDB-WARC, pywb, cc-mr-job), реальные сценарии (Эхо Москвы 173 ГБ → 80 ГБ), anti-patterns, интеграция в Ruarxive-pipeline.

- **Анализ ссылочного графа (`kb/guides/link-graph-analysis.md`)** — **новая страница**: WAT/WARC как источник, инструменты (Hyphe, WebGraph, NetworkX, Gephi, DuckDB), метрики (PageRank, centrality, communities), сценарии (экосистема СМИ, обнаружение бот-сетей, академические сообщества), подводные камни (масштаб, динамическая природа, nofollow), best practices.

### Исправлено

- `kb/intro.md`: ссылка на `/kb/volunteers` (категория без документа) заменена на `/kb/volunteers/volunteers-tasks`.

### Добавлено (покрытие metawarc v2.0.3)

- **metawarc REST API (`kb/instruments/ruarxive-tools/metawarc-rest.md`)** — **новая страница**: полный справочник 12 эндпойнтов (`/health`, `/warcs/list`, `/records/list`, `/records/get/record/...`, `/records/get/headers/...`, `/records/get/data/...`, `/records/search`, `/jobs*`). С curl и Python примерами, bearer-token авторизацией, лимитами, конфигурацией через env.

- **metawarc cookbook (`kb/instruments/ruarxive-tools/metawarc-cookbook.md`)** — **новая страница**: 12 практических рецептов: каталог PDF в CSV, полнотекстовый поиск, link-graph, инкрементальная индексация через cron, REST API для дашборда, ETL в ClickHouse, pywb+metawarc параллельно, бэкапы, bulk index, diff снимков.

- **metawarc extractors (`kb/instruments/ruarxive-tools/metawarc-extractors.md`)** — **новая страница**: Plugin API для кастомных экстракторов (ExtractorBase, registry, entry_points, упаковка плагина). Полный пример с FB2-extractor'ом, контракт и гарантии (read-only, bounded execution, таймауты).

- **`metawarc.md` — расширен разделами:** конфигурация через переменные окружения (10+ env-vars), `--unsafe-where` (когда и почему опасно), `dump` с примерами для CSV/JSONL/Parquet, replay-детали (URL-формат, rewrite-правила, что не поддерживается), `jobs` (жизненный цикл, CLI, лимиты), матрица выбора интерфейса (CLI vs REST vs MCP vs SQL), Schema v2 миграция.

- **Российские независимые архивы СМИ (`kb/similar/russian-independent-media-archives.md`)** — **новая страница**: PEN America, «Архив „Холода"», «Медуза», «Дождь», IStories, юридические аспекты архивации.

- **Preflight-чеклист (`kb/guides/preflight-checklist.md`)** — **новая страница**: 12-частный чек-лист перед запуском кроулера (цель, scope, инструменты, юр. ограничения, расписание, хранение, мониторинг, пост-обработка).

- **Стратегии сбора (`kb/guides/collection-strategies.md`)** — **новая страница**: 8 параметров стратегии, шаблоны для разных классов сайтов, метрики успеха, антипаттерны.

### Исправлено

- `kb/similar/index.md`: фронтматтер `description` обёрнут в кавычки (YAML-парсер не принимал некотированное значение с двоеточием).
- `kb/instruments/tools/wayback-api.md`: проверены все внутренние ссылки на страницы Ruarxive (`pywb`, `memento`, `internet-archive`, `common-crawl`, `perma-cc`, `warc`, `wacz`, `cdx`, `replayweb-page`, `warc-workflow`, `metawarc`, `browsertrix`).

## [2026-10-07] — Октябрь 2026: масштабная ревизия базы знаний

### Добавлено

- **Инструменты Ruarxive**: страницы `metawarc` и `metawarc-mcp`; описание пайплайна `wparc → metawarc` (кейс-стади + интеграция в раздел).
- **Гайды**:
  - `kb/guides/warc-workflow.md` — пошаговый сценарий обработки WARC.
  - Расширены разделы `quick-start-5min`, `emergency-archiving`, `custom-workflows`, `wget`.
- **Справочник форматов**:
  - Новые страницы: `iiif`, `jp2`, `mbox`, `mhtml`, `pdfa`, `siard`.
  - Согласован единый стиль frontmatter и навигации для всех страниц форматов.
- **Сторонние инструменты (`kb/instruments/tools/`)**:
  - Добавлены: `curl`, `internet-archive-cli`, `monolith`, `obelisk`, `shine`, `solrwayback`, `wallabag`, `warc2zim`, `webscrapbook`, `wget` (как каноническая справка; в `kb/guides/wget.md` оставлены только сценарии).
  - Переработан `index.md` со сравнительной таблицей «что выбрать под сценарий».
- **Соцсети и data-take-out**:
  - Расширены `instagram.md`, `fbarc.md`, `twarc.md`, `social-feed-manager.md`.
  - Дополнены `dto-telegram`, `dto-facebook`, `dto-instagram`, `dto-twitter`, `dto-google`, `dto-yandex`, `dto-notion`, `dto-slack`, `dto-youtube`.
  - Добавлен `dto-vk.md` (раньше маршрутизировался ошибочно в `dto-yandex`).
- **Кейс-стади**:
  - Существенно переработаны `bank-closures`, `platform-migrations`, `government-websites-disappearing`, `international-examples`, `multi-tool-archiving`, `api-archiving-scale`.
  - Добавлен `wparc-to-metawarc-pipeline` (с привязкой к `metawarc`-инструментам).
- **Проекты и раздел «О проекте»**:
  - Переработаны `echomsk`, `preserved-government`, `russian-smi`, `index.md`.
  - Дополнены `project-history.md` (события 2025–2026) и `lessons-learned.md`.
- **Ресурсы и волонтёры**: обновлены `comparisons`, `statistics`, `test-files`, `metadata-echo-moscow-archive`, `volunteers-tasks`.
- **README**: обновлён раздел «Recent Updates», указаны Node.js 22, корректный список директорий и сценарии локального деплоя.

### Изменено

- **Сайдбар (`sidebars.js`)**:
  - Подключены ранее «висячие» категории `instruments/replay` и `instruments/downloaded-data`.
  - В категорию `instruments/file-formats` добавлены новые страницы (`iiif`, `jp2`, `mbox`, `mhtml`, `pdfa`, `siard`).
  - В категорию `instruments/tools` добавлены новые инструменты и подкатегории («HTTP-утилиты», «Управление архивацией»).
  - Согласованы `label` категорий `kb/projects` и `kb/instruments/data-take-out` (раньше в `_category_.json` и `sidebars.js` были разные ярлыки).
- **Docusaurus**: индексная страница `/kb/intro` теперь корректно ссылается на новые разделы (`warc-workflow`, `metawarc`, `dto-vk`).
- **CI/CD**: GitHub Actions обновлены до `actions/checkout@v5`, `actions/setup-node@v5`, `actions/upload-pages-artifact@v5`, Node.js 22.

### Исправлено

- **Маршрутизация в `data-take-out-main.md`**: ошибочные ссылки VK → `dto-yandex` и WhatsApp → `dto-yandex` устранены; VK теперь ведёт на новый `dto-vk.md`.
- **Сломанные/устаревшие ссылки** в `bank-closures.md`, `international-examples.md`, `project-history.md` приведены к актуальной структуре каталогов.
- **Дубликат Wget**: `kb/instruments/tools/wget.md` назначен канонической справкой; `kb/guides/wget.md` оставлен как сценарий.
- **Политические/правовые упоминания**: из `preserved-government.md` удалена ссылка на Transparency International Russia (соответствует политике после `e991a7b`).
- **Фронтматтер**: 40+ страниц приведены к единому виду (`title`, `description`, `last_updated`).

### Удалено

- `kb/resources/format-registries.md` — дубль; контент перенесён в `kb/instruments/file-formats/format-registries.md`.
- Цитаты из старых case-studies (bank-closures, platform-migrations), которые вводили в заблуждение относительно текущей практики.

## [2026-10-07] — Подготовка инфраструктуры CI и ревизия

### Добавлено

- `kb/about/project-history.md`: расширена хронология 2025–2026, описаны `metawarc`, MCP-сервер, образовательный курс.
- `kb/gratitudes/`: разделение по категориям (команда, организации, инструменты) — отложено, оставлено single-page.

### Изменено

- CI workflow: actions обновлены до `@v5`, добавлен Node.js 22, обновлён `upload-pages-artifact` до v5.

### Исправлено

- `kb/gratitudes/index.md`: удалена запись о Transparency International Russia.
- Сайдбар: устранены нерабочие ссылки `browsertricks` → `browsertrix`, исправлены конфликтующие slug'и.

## [2025-12-13] — Декабрьские обновления

### Добавлено

- Документация по TDL (Telegram Downloader).
- Расширенные руководства по архивации сайтов (HTTrack, Wget, Wpull).
- Документация по инструментам Ruarxive (`tgarc`, `ydiskarc`, `wparc`).

### Изменено

- Обновлены руководства по созданию цифровых архивов веб-сайтов.
- Расширена документация по инструментам Ruarxive.

## [2025-12-13] — Цифровой курс по архивации

### Добавлено

- Раздел `kb/course/` с лекциями DH.1–DH.4 (введение, веб-архивация, специализированные ресурсы, Internet Archive).
- Встроенные PDF-презентации на страницах курса.
- Улучшенная структура и читаемость контента курса.

### Изменено

- Улучшена читаемость страниц курса: переписаны с использованием pdfplumber для качественного извлечения текста.
- Исправлены ссылки на PDF-презентации с правильным URL-кодированием.
- Встроены PDF-презентации прямо в страницы курса через iframe.

### Исправлено

- Проблемы с отображением PDF-презентаций (404 ошибки).
- URL-кодирование для файлов с пробелами и кириллицей.
- Стили в JSX-формате для корректной работы в Docusaurus.

### Удалено

- Цитаты из case-studies (`bank-closures`, `platform-migrations`).

## [2025-01-15] — Январские обновления

### Добавлено

- Статьи о проблемах цифровой архивации.
- Международный опыт цифровой архивации.
- Кейсы исчезновения сайтов госорганов.

## [2022-03-11] — Первый релиз

### Добавлено

- Базовая структура сайта на Docusaurus.
- Начальная база знаний.
- Блог.
