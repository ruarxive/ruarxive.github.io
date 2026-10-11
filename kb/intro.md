---
sidebar_position: 1
last_updated: 2026-11-09
---

# База знаний Ruarxive

> Привет! Эта база знаний — путеводитель по цифровой веб-архивации для русскоязычного сообщества. Здесь собраны инструкции, инструменты и сравнения, помогающие сохранять сайты и цифровые ресурсы **до** того, как они исчезнут.

## Найди свою цель

### 🚨 «Сайт закрывается через час — что делать?»

Времени мало, сайт ценный. Прямо сейчас:

1. **[Экстренная архивация](/kb/guides/emergency-archiving)** — быстрые методы.
2. **[Archive.ph](https://archive.ph/)** — моментальное сохранение URL (30 секунд).
3. **[Browsertrix](/kb/instruments/tools/browsertrix)** — для современных сайтов (SPA).
4. Напишите в [Telegram-чат @ruarxivechat](https://t.me/ruarxivechat) — поможем.

### 🔍 «Хочу открыть и посмотреть WARC-файл»

1. **[ReplayWeb.page](https://replayweb.page/)** — онлайн плеер, без установки.
2. **[pywb — свой сервер](/kb/instruments/replay/pywb)** — для публичных архивов.
3. **[Как открыть WARC — пользовательская инструкция](/kb/users/open-warc)** — пошагово.
4. **[Вскрытие WARC — для исследователей](/kb/users/inspect-warc)** — warcdump, warcio, Python.

### 🛠 «Хочу собрать свой архив»

1. **[Quick start за 5 минут](/kb/guides/quick-start-5min)** — первый запуск.
2. **[Стратегии сбора](/kb/guides/collection-strategies)** — 8 параметров стратегии.
3. **[Preflight-чеклист](/kb/guides/preflight-checklist)** — что проверить до запуска.
4. **[Wget-гайд](/kb/guides/wget)** — базовый кроулер.
5. **[WARC-файл: от сырого архива до публикации](/kb/guides/warc-workflow)** — полный пайплайн.

### 📚 «Хочу загрузить в Internet Archive»

1. **[Wayback Machine API](/kb/instruments/tools/wayback-api)** — программный доступ.
2. **[Internet Archive CLI (ia)](/kb/instruments/tools/internet-archive-cli)** — загрузка WARC.
3. **[Internet Archive — обзор](/kb/similar/internet-archive)** — RIMA, блокировки, S3 API.

### 💬 «Хочу сохранить соцсети»

1. **[TikTok](/kb/instruments/social-media/tiktok)** — yt-dlp, TikTokApi.
2. **[Mastodon, Bluesky, Threads](/kb/instruments/social-media/mastodon)** — открытые протоколы.
3. **[Data Take-Out: WhatsApp](/kb/instruments/data-take-out/dto-whatsapp)** — экспорт чатов.
4. **[Auto-Archiver (Bellingcat)](/kb/instruments/tools/auto-archiver)** — workflow для OSINT.

### 🔬 «Хочу проанализировать большой архив»

1. **[DuckDB-WARC](/kb/instruments/tools/duckdb-warc)** — SQL-запросы.
2. **[WARC-GPT](/kb/instruments/tools/warc-gpt)** — RAG к коллекции.
3. **[Warchaeology](/kb/instruments/tools/warchaeology)** — статистика, валидация.
4. **[Работа с большими WARC](/kb/users/large-warc)** — потоковая обработка.

### 🔗 «Хочу найти страницу в архиве»

1. **[Wayback Machine API](/kb/instruments/tools/wayback-api)** — программно.
2. **[Waybackpy](/kb/instruments/tools/waybackpy)** — Python-обёртка.
3. **[PastPage](/kb/instruments/tools/pastpage)** — расширение браузера.
4. **[Memento Aggregator](https://timetravel.mementoweb.org/)** — по всем архивам мира.

### 📖 «Хочу понять, что такое WARC, WACZ, CDX»

1. **[Глоссарий](/kb/glossary)** — все термины цифровой архивации.
2. **[Ландшафт 2026](/kb/instruments/landscape-2026)** — карта инструментов.
3. **[Формат WARC](/kb/instruments/file-formats/warc)** — стандарт архивов.
4. **[Формат WACZ](/kb/instruments/file-formats/wacz)** — контейнер для плееров.

### 📚 «Хочу изучить глубже»

1. **[Курс DH.1 — Введение в цифровую архивацию](/kb/course/dh1-introduction)**
2. **[Курс DH.2 — Веб-архивация](/kb/course/dh2-web-archiving)**
3. **[Курс DH.3 — Специализированные ресурсы](/kb/course/dh3-specialized-resources)**
4. **[Курс DH.4 — Internet Archive](/kb/course/dh4-internet-archive)**

### 🤝 «Хочу помочь проекту»

1. **[Задачи для волонтёров](/kb/volunteers/volunteers-tasks)** — конкретные вклады.
2. **[Метаданные архива «Эхо Москвы»](/kb/volunteers/metadata-echo-moscow-archive)** — задача-пример.
3. Напишите в [Telegram-чат @ruarxivechat](https://t.me/ruarxivechat) — расскажем, что сейчас актуально.

---

## Как устроена эта база знаний

| Раздел | Содержание | Для кого |
|:---|:---|:---|
| **[Гайды](/kb/guides)** | Пошаговые инструкции, workflow | Все уровни |
| **[Инструменты](/kb/instruments)** | Подробные страницы по каждому инструменту | Практикующие архивисты |
| **[Форматы файлов](/kb/instruments/file-formats)** | WARC, WACZ, CDX, PREMIS и др. | Технари |
| **[Воспроизведение архивов](/kb/instruments/replay)** | pywb, ReplayWeb.page, Memento | Исследователи, хостинг-провайдеры |
| **[Как пользоваться архивами](/kb/users)** | Инструкции для конечных пользователей | Читатели |
| **[Правовые и этические вопросы](/kb/legal)** | Copyright, ToS, персональные данные | Все |
| **[Справочник](/kb/glossary)** | Термины | Все |
| **[Похожие проекты](/kb/similar)** | IA, Common Crawl, Perma.cc, RIMA | Исследователи |
| **[Кейсы и истории](/kb/case-studies)** | Реальные примеры архивации | Все |
| **[Курс](/kb/course)** | Лекции DH.1–DH.4 | Студенты, начинающие |
| **[Волонтёрам](/kb/volunteers/volunteers-tasks)** | Задачи и контакты | Потенциальные помощники |

---

## Ключевые форматы за 60 секунд

### WARC (Web ARChive)

Стандарт ISO 28500. Файл содержит HTTP-запросы и ответы — сырой слепок взаимодействия браузера с сервером. Подробнее: [WARC-формат](/kb/instruments/file-formats/warc).

### WACZ (Web Archive Collection Zipped)

ZIP-обёртка с WARC + CDXJ-индекс + метаданные. Открывается в [ReplayWeb.page](https://replayweb.page/). Подробнее: [WACZ-формат](/kb/instruments/file-formats/wacz).

### CDX / CDXJ

Индекс всех URL в WARC-коллекции. Используется для быстрого поиска. Подробнее: [CDX-формат](/kb/instruments/file-formats/cdx).

### ZIM

Формат для Kiwix — офлайн-чтения Wikipedia и других архивов через специальный плеер. Создаётся из WARC через [warc2zim](/kb/instruments/tools/warc2zim).

### MHTML

Одиночный HTML со встроенными ресурсами. Подходит для сохранения одной страницы. Подробнее: [MHTML](/kb/instruments/file-formats/mhtml).

---

## Как помочь Ruarxive

Ruarxive — независимый проект Инфокультуры с 2016 года.

1. **Сообщить о ресурсе под угрозой** — [форма](https://airtable.com/shriiNZvNhcgaStm6) или [Telegram-чат](https://t.me/ruarxivechat).
2. **Передать архив** — если ресурс уже исчез, но есть дамп.
3. **[Помочь деньгами](https://www.infoculture.ru/donation)** — на сервера и хранение.
4. **Помочь руками** — задачи в разделе [Волонтёрам](/kb/volunteers/volunteers-tasks).
5. **Пожертвовать железо** — диски и системы хранения для offline-копий.

## Юридическое

База знаний публикуется под открытой лицензией. Все технические инструкции даны с учётом правовых ограничений. Подробнее — раздел [Правовые вопросы](/kb/legal/copyright).

## Связаться

- **Telegram-чат:** [@ruarxivechat](https://t.me/ruarxivechat) — основное общение команды и сообщества.
- **Email:** infoculture@infoculture.ru.
- **GitHub:** [github.com/ruarxive](https://github.com/ruarxive).
- **Сайт:** [ruarxive.org](https://ruarxive.org/).
