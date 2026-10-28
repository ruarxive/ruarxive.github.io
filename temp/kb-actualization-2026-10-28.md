# База знаний Ruarxive: что актуализировать и наполнить

Дата: 2026-10-28. Объём: 203 страницы в `kb/`, около 168 тыс. слов. Файлы в `kb/` не менялись.
Предыдущие отчёты: [`kb-review-2026-10-12.md`](kb-review-2026-10-12.md) (ревизия достоверности), [`KB_ROADMAP_2026-10.md`](KB_ROADMAP_2026-10.md) (план по итогам опроса).

Пометки: **[пров.]** — проверено в этом анализе (реестр пакетов, GitHub, сборка сайта, исходный файл или первоисточник); **[гип.]** — по вторичным источникам или выдаче поиска, нужна сверка перед правкой.

---

## 1. Главное

1. **Сайт ушёл вперёд базы знаний.** 12.10.2026 запросы на архивацию перешли с AirTable на GitHub Issues. На главной появились поиск «Есть ли сайт в архиве?» и блок «Архив в цифрах» из выгрузки ruarxive-db: 13,94 ТБ, 88 598 файлов, 3 322 домена, 182 коллекции. База знаний этого почти не отражает. `stats-snapshot`, `statistics`, `projects/index`, `faq`, `preserved-projects-table`, `archive-plans`, `about/project-history` и `news` описывают прежнее состояние.
2. **После ревизии 12.10 вышли релизы, которые меняют поведение инструментов.** apibackuper 2.0.0 вышел 17.10, Scoop 0.7.0 — 25.09. Есть и более ранние события, которые база не учла: archive.today потерял доверие в феврале 2026 года, а Browsertrix по умолчанию не соблюдает robots.txt.
3. **Много кампаний «начато / планируется» без итога.** Это ЕМИСС, ПФР и ФСС, polit.ru, WARC БРЭ, ролики Coub. Ещё две крупные коллекции хранилища не описаны: `deathwatch` (1,74 ТБ) и папки 2024–2025 годов. Нужен один запрос к команде (см. §8).
4. **Не отражены ограничения в РФ 2024–2026 годов.** Это Notion, Telegram, WhatsApp, YouTube, archive.today, а также ст. 13.53 КоАП и новые основания для статуса иноагента. Пробел есть и в правовом блоке, и в инструкциях по выгрузке данных.
5. **Новые страницы от 14.10 описывают один шаг.** В них нет проверки результата, типичных ошибок и сквозного примера. metawarc — собственный инструмент проекта — не упоминается на 9 страницах про работу с WARC.

Техническое состояние хорошее. Сборка проходит без ошибок и предупреждений, внутренние ссылки целы, у всех страниц есть `description`, все страницы есть в сайдбаре. Явных маркеров TODO нет.

---

## 2. Как проверялось

- Метрики по каждой странице: число слов без кода, блоки кода, заголовки, внешние и внутренние ссылки, годы в тексте, дата `last_update` и дата в git, наличие в `sidebars.js`.
- `docusaurus build` — без ошибок (`onBrokenLinks: 'throw'`).
- HTTP-проверка 1 080 уникальных внешних ссылок (без t.me). Код 403 от сайтов за Cloudflare считается ложным срабатыванием. Подозрительные ссылки перепроверены запросом GET.
- Четыре параллельных содержательных ревью по разделам. Каждая страница прочитана целиком. Сделано около 40 точечных веб-проверок (PyPI, npm, GitHub API, первоисточники).
- Ключевые утверждения рецензентов перепроверены вручную. Это apibackuper 2.0.0 (Python ≥3.10), Scoop 0.7.0 (Node ≥22), Browsertrix `--useRobots` (по умолчанию false), warc2zim 2.3.1 (Python ≥3.14), twarc 2.14.1 (Python ≥3.13), рендер `> [!WARNING]`, отсутствие `deathwatch` в базе знаний и ссылки на AirTable.

---

## 3. P1 — срочно: вводит в заблуждение или ломает процесс

| # | Страница | Проблема | Что сделать |
|:-:|---|---|---|
| 1 | `resources/stats-snapshot.md:11,99`, `resources/statistics.md:34`, `projects/index.md:25` | Страницы пишут, что общего объёма архива нет, и запрещают суммировать коллекции. Главная при этом показывает 13,94 ТБ и 182 коллекции [пров.] | Добавить раздел «Архив в цифрах» со ссылкой на главную и `ruarxive-db`. Оговорить, что это нижняя оценка: `unknownDirs` = apibackuper, armenia2024, mirrors2010, webcollect2024, webcollect2025. Переписать правило 3 в «Как обновлять». Заменить `last_updated` на `last_update` в стр. 100 |
| 2 | `preserved-projects-table.md:11,17`, `faq.md:41-43`, `legal/copyright.md:273-276` | Ответ на вопрос «что сохранено» ведёт только на AirTable и CSV 2023 года. Ссылка и iframe ведут на разные таблицы [пров.] | Первым путём дать поиск на главной (`/#search`), вторым — каталог ruarxive-db. AirTable оставить как исторический список 2021–2022 годов |
| 3 | `instruments/tools/archive-ph.md:12,18,181`, `instruments/landscape-2026.md:98,174`, `instruments/tools/index.md:23`, `similar/index.md:21,59`, `similar/internet-archive.md:27`, `similar/russian-independent-media-archives.md:50`, `similar/post-soviet-archives.md:26,34` | archive.today рекомендуется без оговорок и назван неизменяемым. 20.02.2026 английская Википедия внесла его в спам-лист: CAPTCHA-страница участвовала в DDoS, оператор правил снимки. Около 23.03.2026 РКН ограничил archive.today, .is и .ph [гип.: вторичные источники] | Добавить предупреждение `:::warning`. Убрать формулировку «не может быть изменён». Для доказательств предлагать Wayback, Perma.cc и собственный WACZ. В landscape перевести в раздел «Что ушло в 2024–2026» |
| 4 | `instruments/downloaded-data/apibackuper.md:37-39`, `instruments/ruarxive-tools/index.md:24`, `guides/custom-workflows.md:50,262-279` | Описана версия 1.0.13 и Python 3.8+. Вышла 2.0.0 (17.10.2026): Python ≥3.10 [пров.], `run incremental` теперь псевдоним `run continue`, есть `--dry-run` и `--profile`, `${VAR}` в YAML, каталог `runs/<id>/` [гип.: release notes по словам рецензента] | Обновить страницу по README и `--help` версии 2.0.0. Перепроверить ключи конфигурации в custom-workflows и apibackuper-configs |
| 5 | `instruments/tools/scoop.md:18,34` | Описана версия 0.6.59 и Node 18–23. Версия 0.7.0 требует Node ≥22 [пров.]. Песочница Chromium включена по умолчанию: под root в контейнере браузер не стартует без `chromiumSandbox=false` [гип.] | Обновить требования и добавить раздел про запуск в Docker |
| 6 | `guides/robots-txt-for-archiving.md:34,46`; команды Browsertrix в `guides/collection-strategies.md:162`, `guides/warc-workflow.md:42`, `guides/dynamic-ajax-sites.md:56`, `guides/authenticated-crawling.md:39` | Страница называет соблюдение robots.txt правилом по умолчанию, но описывает только wget. Browsertrix по умолчанию robots.txt не читает: `--useRobots` / `--robots`, default false [пров.] | Описать флаг Browsertrix. В командах для заданий Ruarxive добавить `--robots` или явно объяснить, почему его нет |
| 7 | `guides/warc-filtering.md:43` | Совет сжать результат «тем же gzip» [пров.]. Обычный gzip даёт один поток на весь файл, после этого не работают смещения CDX и pywb | Заменить на `warcio recompress` |
| 8 | `instruments/social-media/youtube-video.md:15`, `instruments/data-take-out/dto-youtube.md:26` | Указано `pip install yt-dlp` без `[default]` и без Deno. С конца 2025 года YouTube без них работает неполно. На странице `tools/yt-dlp.md:46,76` это описано [пров.] | Повторить установку из yt-dlp.md или дать ссылку на неё. Упомянуть замедление YouTube в РФ |
| 9 | `instruments/data-take-out/dto-notion.md:10` | Нет упоминания, что Notion закрыт для пользователей из РФ с 09.09.2024 [гип.] | Добавить предупреждение и совет выгрузить данные заранее (без советов по обходу блокировок — правило CONTRIBUTING) |
| 10 | `projects/russian-smi.md:25-31,129,183` | Список нежелательных организаций зафиксирован «на июнь 2024». В нём нет DOXA, хотя её признали нежелательной 25.01.2024 [гип.: СМИ]. WARC и Telegram DOXA в таблицах идут без пометки | Сверить список с реестром на 10.2026 и проставить маркировку |
| 11 | `case-studies/russia-resources-disappearing.md:44-49`, `projects/government-campaigns-2022.md:40-42`, `projects/open-data.md:48`, `projects/preserved-government.md:207`, `archive-plans.md:92` | Фраза «ЕМИСС планировали вывести из эксплуатации до конца 2025» стоит без итога. По выдаче поиска, ПП РФ от 16.04.2026 № 424 включило компоненты ЕМИСС в инфраструктуру госуслуг [гип.: первоисточник не открыт] | Выяснить фактический статус fedstat.ru и объём собранного (см. §8) |
| 12 | `legal/index.md:41-62` | Нет ст. 13.53 КоАП: с 01.09.2025 штрафуют за умышленный поиск экстремистских материалов, в том числе через VPN. Нет темы иноагентов: маркировка, 255-ФЗ, новые основания с 02.05.2025 [гип.: правовые порталы] | Добавить раздел о рисках для пользователей и исследователей архивов, где есть материалы иноагентов и нежелательных организаций |
| 13 | `instruments/social-media/{max,tiktok,mastodon}.md`, `instruments/data-take-out/{dto-whatsapp,dto-slack}.md` | Синтаксис `> [!WARNING]` в стиле GitHub Docusaurus выводит как обычную цитату с текстом «[!WARNING]» [пров.: проверено по собранному HTML] | Заменить на `:::warning` |

---

## 4. Актуализация (P2–P3) по разделам

### 4.1. Проекты, кейсы, о проекте, новости

- **ПФР и ФСС** — `government-campaigns-2022.md:30-34`, `preserved-government.md:201`, `russia-resources-disappearing.md:97-102`. Страницы пишут «итога нет», а в индексе доменов есть fss.ru за 15–19.07.2022 и pfr.gov.ru с файлами до 03.09.2022 [гип.]. Сверить и записать итог.
- **polit.ru и WARC БРЭ** — `russian-smi.md:11,224,228`, `bigenc.md:24`. Больше двух лет стоят статусы «только начат» и «сбор продолжался». Скорее всего, данные лежат в `webcollect2024` [гип.].
- **Реестр исчезающих ресурсов** (`russia-resources-disappearing.md`). Нет поля «статус на дату». Например, istmat.org сейчас отвечает 200. Последняя запись — #188.
- **`archive-plans.md:22-35,110`.** Процесс описан по состоянию на март 2022 года, AirTable — в настоящем времени. Нужен текущий путь: GitHub Issue → метка `archive-request` → сбор.
- **`preserved-projects-form.md`.** Не описано, что происходит после запроса: метки, статусы, сроки.
- **`about/project-history.md:127,136`, `about/lessons-learned.md:47`.** Нет событий 12–14.10.2026: GitHub Issues, новая главная, ruarxive-db. Фраза «систематизация идёт с 2025» стоит без результата. За 2023 год пропущены посты #110 и #112.
- **`news/index.md`.** Нет записей за октябрь 2026 года и раздела за 2023 год, пропущен #189 (НЭБ). Страница называет блог основным каналом, но последний пост в блоге — от 13.12.2025. Блок «Последние новости» на главной читает эту страницу (`plugins/homepage-news.js`), поэтому её отставание видно сразу.
- **Объём «Эха Москвы».** В `lessons-learned.md:38`, `project-history.md:71` и `stats-snapshot.md:21` написано «173 ГБ». По конвенции базы это 186 ГБ (173 ГиБ).
- **Мелкие пробелы.** `case-studies/platform-migrations.md:25-46`: статус ГосВеба на 2026 год. `about/conferences.md:52-57`: нет событий после 03.2025. `bank-closures.md:37-42`: ряд обрывается на 2020 годе. `international-examples.md:43`: EOT 2024 без итога.

### 4.2. Право

- `legal/personal-data.md:107-110,375`. Правило «согласие — отдельный документ» приведено без даты вступления в силу (01.09.2025). Нет оборотных штрафов по ст. 13.11 КоАП с 30.05.2025 [гип.].
- `legal/terms-of-service.md:50-55`. Нет блокировки Telegram (04.2026) и её последствий для выгрузок.

### 4.3. Инструменты

- **wpull подаётся как рабочий**, хотя не развивается с 2016 года. Это `tools/browsertrix.md:169`, `tools/curl.md:53,316`, `tools/gallery-dl.md:81`, `tools/hyphe.md:26`, `tools/internet-archive-cli.md:51`, `guides/warc-workflow.md:36` (противоречит `guides/wget.md:193`) и `howto-collect/make-copy-website.md:110-143`.
- **`tools/grab-site.md:38`.** Нужен Python 3.7–3.8, а 3.8 без поддержки с 10.2024. Релизов нет. Нужно предупреждение.
- **`tools/wail.md:14`.** Последний релиз — v0.2025.03.03, внутри Heritrix 3.7.0. Статус не указан.
- **`tools/archivespark.md:86`.** Релизов нет с 2019 года (3.0.1). Нужно предупреждение.
- **`ruarxive-tools/ydiskarc.md:23`.** Тег v1.2.0 есть на GitHub с 05.10, а на PyPI по-прежнему 1.1.0 [гип.]. Это вопрос к мейнтейнеру, а не к тексту.
- **Обновить номера версий.** browsertrix-crawler 1.15.0 → 1.15.1, ArchiveBox 0.9.73 → 0.9.77, brozzler 1.9.6 → 1.9.8, monolith 2.11.3 → 2.11.6, single-file-cli 2.18.1 → 2.21.0, ia 5.11.1 → 5.12.1, gallery-dl 1.32.16 → 1.32.18, yt-dlp 2026.08.19 → 2026.10.26, ReplayWeb.page 2.5.3 → 2.5.4, HTTrack → 3.50.5 (первая сборка WinHTTrack с 2017 года, с WARC) [гип.: сверка рецензентов].
- **`guides/wget.md:23`, `tools/wget.md:49`.** В Fedora 40+ команда `wget` — это wget2 без WARC [гип.: Fedora wiki]. Нужна оговорка и обходной путь.
- **`file-formats/wacz.md:164-193`.** `pip install warc2zim` требует Python ≥3.14 [пров.]. Нужен вариант через Docker.
- **Telegram в базе рассогласован.** `social-media/telegram.md` и `dead-platforms.md` рекомендуют tdl. При этом `dto-telegram.md:47-83` даёт tgarc как «Способ 3» с полной инструкцией и Pyrogram (архивирован). `similar/index.md:56`, `russian-independent-media-archives.md:71`, `faq.md:62-64`, `resources/comparisons.md:69` и `stats-snapshot.md:87` тоже советуют tgarc. Привести всё к tdl и экспорту из Telegram Desktop.
- **Conifer** прекратил захват в мае 2026 года по данным Rhizome. В базе написано «в июне»: `guides/emergency-archiving.md`, `replay/memento.md:220`.
- **Расхождение по дате Crocoite:** `resources/curated-lists.md:34` пишет «в архиве с 2021», `glossary.md:206` — «с 2019».
- **`resources/comparisons.md:110`** ссылается на NDSA 2.0, а глоссарий — на 2.1 (03.2026).

### 4.4. Соцсети и выгрузка данных

- **`social-media/twarc.md:17-21`.** Нет хронологии API X за 2023–2026 годы. С 06.02.2026 по умолчанию действует оплата за использование, около $0,005 за пост. Legacy-тарифы переводят на неё в 2026 году [гип.: потолок по источникам 2 или 3 млн постов, сверить с docs.x.com]. Нет примерного расчёта стоимости.
- **`social-media/telegram.md:36-40`.** О блокировках 2026 года сказано только в контексте канала. Нет практического совета выгружать данные заранее. Советы по обходу блокировок (прокси, MTProxy, VPN) правила CONTRIBUTING запрещают, добавлять их нельзя.
- **`data-take-out-main.md:19-21`.** Из блокировок упомянута только Meta 2022. Нет Notion, Telegram, WhatsApp и YouTube. Нужен общий блок «Ограничения в РФ»: что недоступно и почему выгружать данные нужно заранее, без советов по обходу блокировок.
- **`dto-whatsapp.md:11`.** Нет ограничений в РФ 2025–2026 годов.
- **`social-media/tiktok.md:12`.** В США с 22.01.2026 сервис ведёт TikTok USDS JV [гип.].
- **`social-media/max.md:12-17`.** Страница опирается на пост #175 (12.2025). Нужно перепроверить, открыт ли веб-просмотр каналов в 2026 году [гип.].
- **`dto-yandex.md:35`.** `rclone sync` удаляет файлы в целевой папке. Для резервной копии нужен `rclone copy`.

### 4.5. Похожие проекты и курс

- **`similar/eot-archive.md:26-33`.** Таблица заканчивается на EOT 2020. Цикл 2024 года к 02.2025 собрал больше 500 ТБ [гип.]. Нет волны спасения данных США 2025 года.
- **`similar/climate-mirror.md`, `similar/datarefuge.md`.** Описаны только 2016–2017 годы, текущего статуса нет. datarefuge.org отвечает 503. Варианты: слить с EOT в страницу «Спасение данных США 2016–2025» или дописать статус.
- **`similar/internet-archive.md:108-114`.** Нет ограничений обхода 2025–2026 годов: часть издателей закрывается от Internet Archive [гип.].
- **`similar/perma-cc.md:4`.** В description обещаны «ограничения для российских пользователей», в тексте их нет.
- **Курс DH.1–DH.4.** Всё P3:
  - `dh2-web-archiving.md`: нет Browsertrix; единственный подробный пример — wpull; OpenWayback без пометки; ссылка на metawarc ведёт на `datacoon`.
  - `dh3-specialized-resources.md`: нет tdl, yt-dlp, X и MAX.
  - `dh4-internet-archive.md`: нет утечки 2024 года и ссылок на `ia` и Wayback API.
  - `dh1-introduction.md:304-309`: материалы для самостоятельного изучения без ссылок.

### 4.6. Внешние ссылки

Из 1 080 ссылок реальные проблемы у четырёх.
- `https://sobre.arquivo.pt/en/` — 404 (`similar/international-archives.md`).
- `https://www.datarefuge.org/` — 503 (`similar/datarefuge.md`).
- `timetravel.mementoweb.org` — не отвечает. Это уже отмечено в `memento.md:93` и `glossary.md:251`, но в `tools/wayback-api.md:304` ссылка подана как рабочая.
- `fileformats.archiveteam.org` — таймаут. Проверить вручную.

Ещё 21 ссылка вернула 403, 13 — таймаут: dev.vk.ru, asv.org.ru, canada.ca, UNT и другие. Почти всё это защита от ботов или геоблокировка, а не битые ссылки.

---

## 5. Наполнение: тонкие страницы и пробелы

### 5.1. Тонкие страницы (меньше 400 слов), которым не хватает содержания

| Страница | Слов | Чего не хватает |
|---|--:|---|
| `instruments/index.md` | 7 | Только `<DocCardList/>`. Нужен маршрутизатор «задача → раздел» и ссылка на `landscape-2026` |
| `instruments/social-media/youtube-video.md` | 139 | Фактически перенаправление на yt-dlp. Нет cookies, PO token, замедления в РФ. Либо наполнить, либо влить в yt-dlp |
| `instruments/data-take-out/dto-ok.md` | 196 | Нет шагов и шаблона запроса по ст. 14 152-ФЗ (срок 10 рабочих дней). Нет OK API для публичных групп |
| `users/extract-links-from-warc.md` | 206 | `index-content --type links` без `analyze links --output`: читатель не получает отчёта |
| `instruments/data-take-out/dto-mastodon.md` | 230 | Нет состава архива (`outbox.json`, `actor.json`, `media_attachments/`) и просмотрщиков |
| `instruments/tools/wail.md` | 239 | Нет статуса, кода, разделов «Когда не использовать» и «Ресурсы» |
| `users/warc-headers-only.md` | 248 | Нет metawarc (`analyze summary`) и аудита warcinfo |
| `instruments/data-take-out/dto-tiktok.md` | 254 | Нет ссылки на справку TikTok, структуры JSON и описания, что делать с результатом |
| `instruments/tools/crocoite.md`, `scoop.md` | 258, 276 | Нет обязательных разделов. Scoop ещё и устарел (§3) |
| `users/extract-media-from-warc.md` | 266 | Скрипт пишет всё в один плоский каталог, хотя план требовал дерево каталогов. Ответы 206, revisit и HLS-фрагменты отбрасываются без предупреждения |
| `instruments/data-take-out/dto-instagram.md`, `dto-facebook.md` | 285, ~400 | Нет предупреждения о битой кириллице в JSON от Meta (`.encode('latin1').decode('utf8')`), структуры папок и просмотрщиков |
| `instruments/data-take-out/dto-vk.md` | 318 | Шаги расплывчатые («найдите раздел»). Нет формата архива, срока подготовки и описания, что делать с результатом |
| `guides/text-extraction-from-warc.md` | 319 | Зависит от скрипта с другой страницы. Нужен сквозной пример WARC → JSONL (url, дата, title, text) |
| `guides/warc-filtering.md` | 327 | Кроме gzip (§3): нет `jwarc filter`, фильтров metawarc (`--status-min`, `--host-pattern`), фильтра по языку |
| `instruments/social-media/dead-platforms.md` | 368 | Нет ни одной внешней ссылки на источники дат. Нет Reddit и Pushshift, snscrape, Twint и Nitter, Google `cache:`, Tumblr, legacy-тарифов X |

### 5.2. Пробелы в содержании

- **Нет metawarc там, где он нужен.** Страницы `users/large-warc.md`, `users/inspect-warc.md`, `users/cdx-howto.md`, `users/open-warc.md`, `users/warc-headers-only.md`, `guides/warc-filtering.md`, `guides/wget.md`, `guides/custom-workflows.md` и `replay/index.md` описывают сценарии, для которых metawarc сделан, но о нём молчат. Для `replay/index.md` это `metawarc serve` — собственный плеер с версии 2.0.
- **Range-запрос одной записи из удалённого WARC по смещению из CDX.** Это ключевой приём для 186-гигабайтного WARC «Эха Москвы». Его нет в `users/large-warc.md` и `users/cdx-howto.md`.
- **CDX от wget.** Легенда `a b a m s k r M V g u`, без SURT и без длины записи, поэтому `look` не работает и Range-запрос невозможен. Об этом не сказано в `file-formats/cdx.md` и `guides/wget.md:57`.
- **`replay/index.md:23-32`.** Нет порогов выбора плеера по объёму архива (пункт плана 3.1.7).
- **`replay/replayweb-page.md`.** Советует делить архив на несколько WACZ, но не объясняет, как открыть их вместе (multi-WACZ JSON). Нет показа подписи.
- **`replay/pywb.md:327-336`.** Нет ACL и embargo для изъятия материалов по запросу, нет HTTPS в примере nginx.
- **`replay/openwayback.md`.** Пункт плана 3.1.4 («развёртывание в проде») противоречит позиции самой страницы: «не для новых установок». Лучше заменить его гайдом по миграции OpenWayback → pywb + OutbackCDX.
- **`file-formats/wacz.md:154`.** Подписание WACZ (authsign) — один абзац. Нет инструкции, как подписать и как проверить (3.7.1).
- **`file-formats/warc.md`.** Нет `.warc.zst` (так пишет ArchiveTeam; warcio его не читает). Нет раздела «что нового в WARC 1.1» (3.7.2).
- **`file-formats/conversion.md`.** Нет служебных преобразований: gzip → сжатие по записям, ARC/HAR/MHTML/WACZ → WARC, zst → gz.
- **`file-formats/identification-tools.md:51-52`.** Про WARC одна строка `sf -z`. Нужны пример вывода и сводка по PUID (3.6.6).
- **`guides/quick-start-5min.md`.** Нет сценария для JS-сайта (ArchiveWeb.page по шагам). HTTrack описан без `--warc`/`--wacz` (3.3.7).
- **`guides/authenticated-crawling.md`.** Нет экспорта cookies в формат Netscape, исключения `/logout`, проверки результата, варианта с ArchiveWeb.page.
- **`guides/collection-strategies.md:103-108,255-279`.** Абстрактные `max_pages/size/duration` не сопоставлены с реальными флагами `--pageLimit/--sizeLimit/--timeLimit` и `--quota`. Лимит в стратегии B недостижим при заданной скорости.
- **`guides/warc-deduplication.md`.** Нет `wget --warc-dedup`.
- **`guides/link-graph-analysis.md:154`.** `edges.csv` читается, но нигде не создаётся.
- **`social-media/telegram.md:32`.** Telethon — только ссылка: нет входа, `iter_messages`, FLOOD_WAIT, скачивания медиа (3.8.6).
- **`similar/internet-archive.md:25-27`.** Нет темы «если archive.org недоступен» (3.2.2): какие ещё архивы проверить и как попросить коллег. Запасной вариант в тексте — archive.today, который сам заблокирован. VPN, Tor и прокси советовать нельзя (правило CONTRIBUTING), поэтому пункт плана 3.2.2 в исходной формулировке выполнять не нужно.
- **`similar/common-crawl.md:148-150`.** Нет сквозного примера без AWS (DuckDB по Parquet через HTTPS, `content_languages`) и оговорки про российские сайты, закрытые для зарубежных IP (3.2.3).
- **`similar/russian-independent-media-archives.md:22-26`.** Только три издания 2022 года. Нет «Медузы», «Холода», «Новой-Европы», «Дождя» (3.2.7).
- **`social-media/mastodon.md`.** Нет выгрузки своего аккаунта Bluesky (CAR). Отдельной DTO-страницы для Bluesky тоже нет.
- **`social-media/facebook.md`.** Нет доступа для исследователей через DSA ст. 40 (регламент 2025/2050 действует с 29.10.2025).
- **Коллекции хранилища, которых нет в базе знаний** [пров.]. `deathwatch` — вторая по объёму коллекция (1,74 ТБ). По словам рецензента, из них sova-center.ru — 1,69 ТБ (09.2023). Не описаны и `armenia2024`, `webcollect2024`, `webcollect2025`, `apibackuper`, `mirrors2010`.
- **`case-studies/government-websites-disappearing.md:17-33`.** Только примеры 2011–2016 годов. Нет Ростуризма 2022, ПФР/ФСС → СФР, aisup 2025.
- **`projects/preserved-government.md:180-184`.** Госаккаунты описаны только за 2013 и 2022 годы. Нет Telegram, VK и MAX ведомств.
- **`volunteers/volunteers-tasks.md:27-35`.** Только две актуальные задачи. Можно добавить: каталогизацию 108 коллекций, которых нет в каталоге ruarxive-db, описание `unknownDirs`, разбор запросов `archive-request`.
- **`about/lessons-learned.md`, `resources/comparisons.md`.** Не сделаны пункты плана 3.4.3 («стек Ruarxive против отраслевого») и 3.4.4 (подборки для OSINT, библиотек, волонтёров).
- **`glossary.md`.** Нет OpenWayback, pywb, «снимка», metawarc, ruarxive-db, схемы `webcollectYYYY`, терминов «иноагент» и «нежелательная организация».
- **`intro.md`.** В «Найди свою цель» нет блока «Есть ли сайт в архиве?» со ссылкой на `/#search`.
- **`gratitudes/index.md`.** Нет Wpull (основной краулер 2017–2023 годов), pywb, warcio, Backblaze.

### 5.3. Обязательные разделы для страниц инструментов (DoD, п. 5)

Около 25 страниц не дотягивают. Чаще всего нет «Когда не использовать» и «Сравнения».
- Нет «Когда использовать» / «Когда не использовать»: `tools/{warc-safe,warcprox,warchaeology,warc-processing,obelisk,warc2zim,tdl}`, `ruarxive-tools/ydiskarc`, `downloaded-data/{apibackuper,spcrawler}`, `tools/browsertrix` (нет ещё «Ресурсов» и лицензии AGPL-3.0).
- Нет «Сравнения»: `tools/{cdx-summary,wikiteam,hyphe,waybackpy}`.
- Нет примера кода: `tools/web-curator-tool`, `tools/youtube-dl-gui`.

---

## 6. Структура и навигация

1. **Категория «Анализ и обработка» (пункт плана 5.3, не сделан).** Сейчас «WARC-инфраструктура» содержит 11 разнородных страниц. Предложение по инструментам:
   - «Запись и конвертация»: warcprox, warc2zim.
   - «Обработка и анализ»: warc-processing, duckdb-warc, archivespark, cdx-summary, warc-gpt.
   - «Контроль качества»: warchaeology, warc-safe.
   - «Поиск»: solrwayback, shine.

   Из «Управления архивацией» выделить «Internet Archive и Wayback»: ia, wayback-api, waybackpy, pastpage. Hyphe перенести в анализ, WikiTeam — в загрузчики.
2. **Гайды.** «Гайды → Инструменты» состоит из одной страницы (wget), а в «Продвинутых темах» смешаны планирование и обработка. Предложение:
   - «Быстрый старт».
   - «Планирование»: preflight, strategies, robots, anti-bot, auth.
   - «Сбор»: wget, ajax, custom-workflows и обе страницы `howto-collect`.
   - «Обработка и публикация»: warc-workflow, dedup, filtering, text, link-graph.
3. **Устаревшие инструменты** — crocoite, squidwarc, warcworker, shine, wpull, dvd, firedm, hitomi — разбросаны по живым категориям. Собрать их в подгруппу «Устаревшие». dvd, firedm и hitomi можно влить в youtube-dl-gui. Категорию «HTTP-утилиты» из одной страницы (curl) объединить с соседней.
4. **apibackuper и spcrawler** — инструменты Ruarxive, но в сайдбаре их нет среди «Инструментов Ruarxive».
5. **`tools/index.md:136`.** В сводной таблице нет 13 инструментов: Scoop, Crocoite, WAIL, Auto-Archiver, DuckDB, Warchaeology, WARC-Safe, Hyphe, ArchiveSpark, CDX Summary, waybackpy, PastPage, WikiTeam. В `landscape-2026.md` нет ArchiveBox и Scoop.
6. **Статус инструмента записан в трёх местах**: на странице, в `tools/index` и в `landscape-2026`. Эти записи уже расходятся. Предложение: хранить `status` и `version` во frontmatter и собирать таблицы из него.
7. **Раздел `users/`.** Обещает «без программирования», но 7 из 9 страниц требуют CLI или Python. Скрипт выгрузки HTML встречается дважды, таблица флагов warcfilter — четыре раза. Разделить на «читателям» (open, citation, cdx, поиск на главной) и «исследователям». Нужна страница про выгрузки Ruarxive не в WARC: экспорт Telegram, JSONL tgarc и wparc.
8. **Дубли.** Блоки dataportals, ikmo и ПФР повторяются в `open-data`, `preserved-government` и `government-campaigns-2022`, поэтому могут разойтись. Экстренный рецепт в `make-copy-website` повторяет quick-start и emergency, но с другой командой wget.

---

## 7. Новые страницы

| Страница | Почему |
|---|---|
| **ArchiveWeb.page** (`instruments/tools/archiveweb-page.md`) | Упоминается на 20 страницах, в том числе как замена Conifer и как способ для сайтов с логином, но своей страницы нет |
| **Wayback Machine Downloader** | Восстановление удалённого сайта из Internet Archive — частая задача, в базе знаний не упомянута. Форк StrawberryMaster жив (последний push 25.10.2026) |
| **ArchiveBot и ArchiveTeam Warrior: как подать сайт** | Упоминаются в 8 файлах, инструкции нет |
| **Поиск снимков по Memento** (или расширение `replay/memento.md`) | PastPage, Mink, MemGator, Zotero Robust Links. Закрывает пункт плана 3.2.6 |
| **Коллекция `deathwatch`** или раздел в `projects/` | Вторая по объёму коллекция хранилища, не описана |
| **Выгрузка Bluesky** (`dto-bluesky.md`) | Есть страница про архивацию Bluesky, а про выгрузку своего аккаунта — нет |

Отдельные страницы не нужны для Warclight (в архиве с 2023 года), DiskerNet, warcbench (хватит строки в `warc-processing`) и Conifer (хватит раздела «как выгрузить коллекцию» в `dead-platforms`). Bellingcat OSINT Toolkit достаточно дать ссылкой в `resources/curated-lists`.

---

## 8. Вопросы к команде: факты, которых нет в открытых источниках

Без ответов эти страницы нельзя закрыть корректно.

1. **ЕМИСС и Росстат (#159, 05.2025):** что собрано, сколько, где лежит, работает ли fedstat.ru.
2. **ПФР и ФСС (2022):** чем закончилась кампания. В индексе доменов есть fss.ru за 15–19.07.2022 и pfr.gov.ru до 03.09.2022.
3. **polit.ru (#125, 04.2024) и WARC БРЭ (06.2024):** итоговые объёмы и расположение. Возможно, это `webcollect2024`.
4. **`deathwatch`:** состав коллекции и разрешение описать её публично. Особенно это касается sova-center.ru.
5. **`webcollect2024`, `webcollect2025`, `armenia2024`, `apibackuper`, `mirrors2010`:** что внутри. Сейчас эти папки в `unknownDirs`.
6. **ydiskarc 1.2.0:** когда выйдет на PyPI.
7. **Ролики Coub:** где лежат 55+ ГБ из поста #18. В `allarchives.csv` их нет.

---

## 9. Предлагаемый порядок работ

| Пакет | Состав | Оценка |
|---|---|---|
| **PR-A. Срочные исправления** ✅ сделано 2026-10-28 | §3: пункты 3–9 и 13 (archive.today, apibackuper 2.0, Scoop 0.7, robots в Browsertrix, gzip, yt-dlp, Notion, `[!WARNING]`) | 1–1,5 дня |
| **PR-B. Синхронизация с сайтом** | §3: пункты 1–2; §4.1: archive-plans, preserved-projects-form, project-history, news (октябрь 2026), intro (`/#search`), faq; запись в блоге об обновлении 12–14.10 | 1 день |
| **PR-C. Итоги кампаний** | После ответов на §8: ЕМИСС, ПФР/ФСС, polit.ru, БРЭ, `deathwatch`, папки 2024–2025, статусы в реестре исчезающих ресурсов | 1–2 дня |
| **PR-D. Право и РФ-ограничения** | §3: пункты 10–12; блок «Ограничения в РФ» в `data-take-out-main` и на страницах платформ; согласовать рекомендации по Telegram (tdl); legal/personal-data, terms-of-service | 1,5–2 дня |
| **PR-E. metawarc и работа с WARC** | §5.2: metawarc на 9 страницах, Range-запрос по CDX, CDX от wget, пороги в replay/index, multi-WACZ, ACL в pywb, подписание WACZ, `.warc.zst`, conversion | 2–3 дня |
| **PR-F. Тонкие страницы** | §5.1: DTO (ok, tiktok, vk, mastodon, meta, bluesky), users/extract-*, text-extraction, warc-filtering, dead-platforms, youtube-video | 2–3 дня |
| **PR-G. Структура** | §6: сайдбар (анализ и обработка, гайды, устаревшие), `instruments/index`, `tools/index`, frontmatter `status`/`version` | 1–1,5 дня |
| **PR-H. Новые страницы** | §7 | 2–3 дня |
| **Потом** | DoD для ~25 страниц инструментов, обновление номеров версий, курс DH.1–DH.4, similar (EOT 2024, независимые СМИ, Common Crawl), глоссарий | по мере сил |

---

## 10. Статус дорожной карты `KB_ROADMAP_2026-10.md`

Многое из плана уже сделано, но чек-листы в документе не отмечены. Стоит обновить сам план.

- **Сделано:** 3.1.1, 3.1.2 (частично), 3.1.3, 3.1.5, 3.1.6, 3.1.8, 3.2.1, 3.2.4, 3.2.5, 3.2.8, 3.2.9, 3.3.1, 3.3.2, 3.3.3, 3.3.4, 3.3.5, 3.3.6, 3.4.1, 3.4.2, все пункты 3.5.x, 3.6.1–3.6.5, 3.6.7, 3.7.3, 3.8.1–3.8.5, 3.8.8, 3.8.9, 5.2, 5.4. Пункты 5.5 и 5.6 сделаны почти полностью.
- **Частично:** 3.2.3 (Common Crawl), 3.3.7 (quick-start), 3.6.6 (Siegfried для WARC), 3.7.1 (подписание WACZ), 3.7.4 (warcbench есть только в warc-processing), 3.8.6 (Telethon), 3.8.7 (X API).
- **Не сделано:** 3.1.4 (лучше заменить миграцией на pywb), 3.1.7, 3.2.2, 3.2.6, 3.2.7 (частично), 3.4.3, 3.4.4, 3.7.2, 5.1, 5.3, 5.7, 5.8.

---

## Приложение. Метрики по разделам

| Раздел | Страниц | Слов | Медиана | < 400 слов | Без кода |
|---|--:|--:|--:|--:|--:|
| instruments/tools | 47 | 36 305 | 741 | 9 | 8 |
| guides | 16 | 14 782 | 1 085 | 2 | 2 |
| instruments/file-formats | 16 | 12 306 | 765 | 1 | 3 |
| instruments/data-take-out | 15 | 6 678 | 428 | 6 | 10 |
| instruments/social-media | 14 | 7 624 | 402 | 7 | 5 |
| similar | 13 | 12 452 | 690 | 5 | 6 |
| case-studies | 10 | 9 973 | 719 | 1 | 7 |
| instruments/ruarxive-tools | 10 | 8 266 | 694 | 0 | 0 |
| users | 10 | 4 741 | 398 | 5 | 1 |
| projects | 8 | 15 753 | 1 255 | 2 | 8 |
| instruments/replay | 7 | 5 859 | 730 | 0 | 0 |
| корень `kb/` | 6 | 6 674 | 849 | 2 | 6 |
| resources | 6 | 3 690 | 556 | 2 | 5 |
| course | 5 | 5 314 | 1 017 | 1 | 3 |
| about | 4 | 3 609 | 697 | 1 | 4 |
| instruments/downloaded-data | 4 | 1 833 | 476 | 2 | 1 |
| legal | 4 | 6 393 | 1 292 | 1 | 4 |
| прочие (howto-collect, instruments, volunteers, gratitudes, news) | 8 | 6 018 | — | 2 | 5 |

Самые слабые разделы по наполненности: `data-take-out` (медиана 428 слов, у 10 из 15 страниц нет ни одного примера), `social-media` (половина страниц короче 400 слов) и `users` (медиана 398 слов).
