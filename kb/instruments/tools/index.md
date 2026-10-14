---
sidebar_position: 1
title: Программы и утилиты
description: "Обзор сторонних инструментов для веб-архивации: кроулеры, утилиты моментального сохранения, обработка WARC, прокси для записи трафика, поиск по архивам и офлайн-форматы."
last_update:
  date: 2026-10-12
---

# Программы и утилиты

Сторонние инструменты с открытым кодом для веб-архивации: кроулеры разных типов, утилиты моментального сохранения, библиотеки обработки WARC/WACZ, прокси для записи трафика, поисковые системы по архивам и форматы для офлайн-чтения. Этот раздел дополняет [инструменты Ruarxive](/kb/instruments/ruarxive-tools): здесь собраны решения, которые мы используем вместе с нашими собственными.

Статусы проектов (активен, не развивается, в архиве) проверены в октябре 2026 года.

## Как выбрать инструмент

Ответьте на три вопроса, чтобы быстро подобрать подходящий инструмент.

### 1. Что вы хотите сохранить?

| Сценарий | Рекомендуемый инструмент | Почему |
| :--- | :--- | :--- |
| **Один URL за 30 секунд** (статья, пост) | [Archive.ph](/kb/instruments/tools/archive-ph) | Мгновенный снимок, не требует установки |
| **Одна страница со всеми ресурсами в одном HTML** | [SingleFile](/kb/instruments/tools/singlefile) или [monolith](/kb/instruments/tools/monolith) | SingleFile — в браузере, monolith — из командной строки |
| **Одна страница без браузера** | [monolith](/kb/instruments/tools/monolith) или [Obelisk](/kb/instruments/tools/obelisk) | Один бинарник на Rust или Go, без JavaScript |
| **Сайт целиком (статика, без JS)** | [Wget](/kb/instruments/tools/wget), [grab-site](/kb/instruments/tools/grab-site) или [HTTrack](/kb/instruments/tools/httrack) | Wget — проще всего и пишет WARC, grab-site — для больших обходов |
| **Современный сайт с JavaScript / SPA** | [Browsertrix](/kb/instruments/tools/browsertrix) или [zimit (Kiwix)](/kb/instruments/tools/warc2zim) | Browsertrix для WACZ, zimit сразу в ZIM |
| **Видео с YouTube, VK Видео, Vimeo, Twitch** | [yt-dlp](/kb/instruments/tools/yt-dlp) | Более 1700 сайтов, субтитры, метаданные |
| **Изображения и галереи** | [gallery-dl](/kb/instruments/tools/gallery-dl) | Много платформ, метаданные, фильтрация |
| **Очередь отдельных URL для браузерной архивации** | [Browsertrix](/kb/instruments/tools/browsertrix) (список seed-URL) | [Warcworker](/kb/instruments/tools/warcworker) решал эту задачу, но проект в архиве |
| **Распределённый обход на нескольких машинах** | [Brozzler](/kb/instruments/tools/brozzler) | Браузерные воркеры, состояние обхода в RethinkDB |
| **Архивное качество WARC для долгосрочного хранения, широкий обход** | [Heritrix](/kb/instruments/tools/heritrix) | Кроулер Internet Archive, тонкая настройка |
| **Личная коллекция страниц с аннотациями** | [WebScrapBook](/kb/instruments/tools/webscrapbook) или [wallabag](/kb/instruments/tools/wallabag) | WebScrapBook — для структуры, wallabag — для чтения |
| **Личный архив из закладок и списков URL** | [ArchiveBox](/kb/instruments/tools/archivebox) | Пополняемый архив с веб-интерфейсом |
| **Библиотека с процессом «разрешение → сбор → проверка → передача в хранилище»** | [Web Curator Tool](/kb/instruments/tools/web-curator-tool) | Готовая система для селективной архивации |
| **Telegram-каналы и чаты** | [tdl](/kb/instruments/tools/tdl) | Быстрый загрузчик на Go, экспорт в JSON |
| **Ручной просмотр с записью всего трафика** | [Warcprox](/kb/instruments/tools/warcprox) или [ArchiveWeb.page](https://archiveweb.page/) | Прокси пишет WARC в реальном времени |
| **Скрипт или API-выгрузка** | [curl](/kb/instruments/tools/curl) | Базовый HTTP-клиент для скриптов |
| **Сохранить страницу в Wayback Machine** | [SavePageNow / Wayback API](/kb/instruments/tools/wayback-api), [waybackpy](/kb/instruments/tools/waybackpy) | Снимок делает сам Internet Archive |
| **Выложить свои WARC/WACZ на archive.org** (как item, не в Wayback) | [Internet Archive CLI](/kb/instruments/tools/internet-archive-cli) | Официальный инструмент загрузки в items |
| **Вики на MediaWiki** | [WikiTeam (wikiteam3)](/kb/instruments/tools/wikiteam) | XML-дамп с историей правок и изображениями |

### 2. Нужна поддержка JavaScript?

| Возможность | Инструменты |
| :--- | :--- |
| ✅ Полная поддержка JS через реальный браузер | [Browsertrix](/kb/instruments/tools/browsertrix), [Brozzler](/kb/instruments/tools/brozzler), [zimit (Kiwix)](/kb/instruments/tools/warc2zim), [SingleFile](/kb/instruments/tools/singlefile); устаревшие [Squidwarc](/kb/instruments/tools/squidwarc) и [Warcworker](/kb/instruments/tools/warcworker) |
| ⚠️ Записывает то, что загрузил браузер пользователя | [Warcprox](/kb/instruments/tools/warcprox) (прокси) |
| ❌ Не поддерживает JS | [Heritrix](/kb/instruments/tools/heritrix), [Wget](/kb/instruments/tools/wget), [Wpull](/kb/instruments/tools/wpull), [grab-site](/kb/instruments/tools/grab-site), [HTTrack](/kb/instruments/tools/httrack), [monolith](/kb/instruments/tools/monolith), [Obelisk](/kb/instruments/tools/obelisk) |

### 3. Какой результат нужен?

| Формат | Инструменты |
| :--- | :--- |
| **WARC / WACZ** (стандарт архивирования) | Heritrix, Wget, Wpull, grab-site, Browsertrix, Brozzler, Warcprox, ArchiveBox (через wget) |
| **ZIM** (офлайн-чтение через Kiwix) | [warc2zim и zimit](/kb/instruments/tools/warc2zim) |
| **HTML-файл со встроенными ресурсами** | [SingleFile](/kb/instruments/tools/singlefile), [monolith](/kb/instruments/tools/monolith), [Obelisk](/kb/instruments/tools/obelisk) |
| **Зеркало или коллекция на диске** (для офлайн-просмотра) | HTTrack, ArchiveBox, WebScrapBook (Folder, HTZ, MAFF) |
| **Моментальный веб-снимок с постоянной ссылкой** | Archive.ph, Wayback Machine (SavePageNow) |
| **Видеофайл** (MP4, MKV, WEBM) | [yt-dlp](/kb/instruments/tools/yt-dlp) |
| **Изображения с метаданными** | [gallery-dl](/kb/instruments/tools/gallery-dl) |
| **Очищенный текст статей с тегами** | [wallabag](/kb/instruments/tools/wallabag) |

## Категории инструментов

### 🌐 Браузерные кроулеры
Используют реальный Chrome/Chromium — лучший способ сохранить современные сайты с JavaScript, SPA и динамической подгрузкой.

- **[Browsertrix](/kb/instruments/tools/browsertrix)** — Browsertrix Crawler (Docker) и облачный/self-hosted сервис от Webrecorder; WACZ, поведения на странице (`autoscroll`, `autoplay`).
- **[Scoop](/kb/instruments/tools/scoop)** — одностраничный захват Harvard LIL в WARC или WACZ, со сводкой о происхождении снимка.
- **[Brozzler](/kb/instruments/tools/brozzler)** — распределённый кроулер Internet Archive; состояние обхода в RethinkDB, запись через warcprox.
- **[Crocoite](/kb/instruments/tools/crocoite)** — headless Chrome и WARC; репозиторий архивирован в 2021 году.
- **[Squidwarc](/kb/instruments/tools/squidwarc)** — скриптуемый кроулер на Node.js и Chrome; не развивается с 2020 года.
- **[Warcworker](/kb/instruments/tools/warcworker)** — очередь (RabbitMQ) и веб-интерфейс поверх Squidwarc для отдельных URL; проект в архиве.

### 🕷 HTTP-кроулеры
Работают на уровне HTTP, не выполняют JavaScript. Подходят для статических сайтов, документации, простых CMS.

- **[Heritrix](/kb/instruments/tools/heritrix)** — кроулер Internet Archive для широких и тематических обходов, высокое качество WARC.
- **[Wget](/kb/instruments/tools/wget)** — базовый консольный загрузчик, есть почти везде, с версии 1.14 пишет WARC.
- **[Wpull](/kb/instruments/tools/wpull)** — Wget-совместимый загрузчик на Python (написан с нуля, не форк), WARC и плагины; последний релиз — 2016 года.
- **[grab-site](/kb/instruments/tools/grab-site)** — кроулер ArchiveTeam на основе форка Wpull: WARC, дашборд, изменяемые на лету ignore-шаблоны.
- **[HTTrack](/kb/instruments/tools/httrack)** — кроссплатформенный кроулер с GUI; сохраняет зеркало на диск, WARC напрямую не создаёт.

### 🔌 HTTP-утилиты
Базовые инструменты для скриптов и API-выгрузок.

- **[curl](/kb/instruments/tools/curl)** — универсальный HTTP-клиент для скриптов, API и диагностики.

### ⚡ Моментальное сохранение
Один URL — один файл или одна постоянная ссылка. Минимум настройки.

- **[SingleFile](/kb/instruments/tools/singlefile)** — расширение браузера и CLI, сохраняет страницу со всеми ресурсами в один HTML.
- **[Archive.ph](/kb/instruments/tools/archive-ph)** — веб-сервис моментальных снимков.
- **[WebScrapBook](/kb/instruments/tools/webscrapbook)** — расширение Firefox/Chrome с деревом коллекции и аннотациями; форматы Folder, HTZ, MAFF, Single HTML (без WARC).
- **[monolith](/kb/instruments/tools/monolith)** — CLI на Rust, сохраняет страницу в один HTML без выполнения JS.
- **[Obelisk](/kb/instruments/tools/obelisk)** — Go-библиотека и CLI для сохранения страницы в один HTML.

### 📚 Архивные системы и личные коллекции
Управляют коллекциями: добавление, индексация, поиск, веб-интерфейс.

- **[ArchiveBox](/kb/instruments/tools/archivebox)** — self-hosted персональный веб-архив из закладок и списков URL; несколько способов сохранения (wget с WARC, Chrome headless, SingleFile, PDF, скриншот).
- **[wallabag](/kb/instruments/tools/wallabag)** — self-hosted «прочитать позже»: очищенный текст, теги, аннотации, мобильные приложения, экспорт в EPUB/PDF/JSON.

### 🔧 WARC-инфраструктура
Работа с WARC: запись через прокси, обработка, проверка, конвертация, поиск.

- **[Warcprox](/kb/instruments/tools/warcprox)** — MITM-прокси Internet Archive, пишет HTTP/S-трафик в WARC с дедупликацией; используется Brozzler.
- **[Обработка WARC](/kb/instruments/tools/warc-processing)** — библиотеки Python, Java, Node.js, Rust и Go для чтения, записи, фильтрации и валидации.
- **[Warchaeology](/kb/instruments/tools/warchaeology)** — Go-утилита `warc` Национальной библиотеки Норвегии: `ls`, `cat`, `validate`, `dedup`, `convert`.
- **[WARC-Safe](/kb/instruments/tools/warc-safe)** — проверка WARC на вирусы (ClamAV) и NSFW-изображения от Национальной библиотеки Люксембурга.
- **[Kiwix (warc2zim, zimit)](/kb/instruments/tools/warc2zim)** — конвертация WARC в ZIM для офлайн-чтения и обход сайта сразу в ZIM.
- **[SolrWayback](/kb/instruments/tools/solrwayback)** — полнотекстовый поиск, аналитика и воспроизведение WARC на Solr (Королевская библиотека Дании).
- **[Shine](/kb/instruments/tools/shine)** — архивный (2020) прототип исследовательского интерфейса UK Web Archive на Solr; историческая справка.
- **[WARC-GPT](/kb/instruments/tools/warc-gpt)** — экспериментальный RAG-инструмент Harvard LIL: вопросы к коллекции WARC на естественном языке.

### 🏛 Управление архивацией и Internet Archive
Системы с процессами, ролями и интеграцией с архивами.

- **[Web Curator Tool](/kb/instruments/tools/web-curator-tool)** — система для библиотек: разрешения на сбор, цели и расписание, сбор через Heritrix, проверка качества, передача в цифровое хранилище.
- **[WAIL](/kb/instruments/tools/wail)** — настольная оболочка вокруг Heritrix и OpenWayback; для новых коллекций не рекомендуется.
- **[Internet Archive CLI (ia)](/kb/instruments/tools/internet-archive-cli)** — официальный инструмент для загрузки, скачивания и управления items на archive.org (не Wayback Machine).
- **[Wayback Machine API](/kb/instruments/tools/wayback-api)** — SavePageNow 2, CDX, Availability, Memento.
- **[waybackpy](/kb/instruments/tools/waybackpy)** — Python-обёртка и CLI для API Wayback Machine.
- **[PastPage](/kb/instruments/tools/pastpage)** — расширение браузера для поиска исчезнувших страниц сразу в нескольких веб-архивах.

### 💬 Специализированные загрузчики
Инструменты для конкретных платформ.

- **[tdl](/kb/instruments/tools/tdl)** — загрузчик файлов и экспорт сообщений Telegram на Go.
- **[yt-dlp](/kb/instruments/tools/yt-dlp)** — видео, аудио, субтитры и метаданные с более чем 1700 сайтов.
- **[GUI-оболочки для yt-dlp](/kb/instruments/tools/youtube-dl-gui)** — Open Video Downloader и другие программы для тех, кто не работает в командной строке.
- **[gallery-dl](/kb/instruments/tools/gallery-dl)** — загрузчик изображений и коллекций с многих платформ.
- **[WikiTeam](/kb/instruments/tools/wikiteam)** — архивация вики на MediaWiki (wikiteam3).

## Сводная таблица

| Инструмент | JS | WARC | Распределённость | Веб-интерфейс | Статус |
| :--- | :---: | :---: | :---: | :--- | :--- |
| **Browsertrix** | ✅ | ✅ WACZ | ⚠️ в облачной версии (Kubernetes) | ✅ | Активен |
| **Brozzler** | ✅ | ✅ (через warcprox) | ✅ RethinkDB | ⚠️ опц. dashboard | Активен |
| **Squidwarc** | ✅ | ✅ | ❌ | ❌ | Не развивается с 2020 |
| **Warcworker** | ✅ | ✅ | ⚠️ несколько воркеров | ✅ | В архиве |
| **Heritrix** | ❌ | ✅ | ⚠️ | ✅ | Активен |
| **Wpull** | ❌ | ✅ | ❌ | ❌ | Последний релиз 2016 |
| **grab-site** | ❌ | ✅ | ❌ | ✅ дашборд | Поддерживается (изменения в 2025) |
| **Wget** | ❌ | ✅ (1.14+) | ❌ | ❌ | Активен |
| **HTTrack** | ❌ | ⚠️ через конвертацию | ❌ | ✅ GUI | Активен |
| **curl** | ❌ | ❌ | ❌ | ❌ | Активен |
| **SingleFile** | ✅ | ❌ (HTML) | ❌ | ❌ | Активен |
| **monolith** | ❌ | ❌ (HTML) | ❌ | ❌ | Активен |
| **Obelisk** | ❌ | ❌ (HTML) | ❌ | ❌ | Развивается медленно |
| **Archive.ph** | ⚠️ | ❌ (снимок) | — | ✅ (внешний сервис) | — |
| **WebScrapBook** | ✅ (через браузер) | ❌ | ❌ | ✅ (сервер PyWebScrapBook) | Активен |
| **ArchiveBox** | ✅ | ✅ (через wget) | ❌ | ✅ | Активен |
| **wallabag** | ❌ | ❌ (текст) | ❌ | ✅ | Активен |
| **Warcprox** | — (записывает браузер) | ✅ | ⚠️ | ❌ | Активен |
| **warc2zim / zimit** | ✅ (zimit) | вход WARC, выход ZIM | ❌ | ✅ Kiwix | Активен |
| **SolrWayback** | — | индекс WARC | ⚠️ Solr Cloud | ✅ | Активен |
| **Shine** | — | индекс WARC | ❌ | ✅ | В архиве с 2020 |
| **Web Curator Tool** | ❌ | ✅ (Heritrix) | ⚠️ | ✅ | Активен |
| **Internet Archive CLI (ia)** | — | загрузка файлов в items | ❌ | ❌ | Активен |
| **tdl** | — | ❌ (Telegram) | ❌ | ❌ | Активен |
| **yt-dlp** | — | ❌ (видео) | ❌ | ❌ | Активен |
| **gallery-dl** | — | ❌ (изображения) | ❌ | ❌ | Активен |

## Рекомендованные связки

В реальных проектах мы комбинируем несколько инструментов:

- **Быстро сохранить отдельную страницу** → [Archive.ph](/kb/instruments/tools/archive-ph), [SavePageNow](/kb/instruments/tools/wayback-api) или [SingleFile](/kb/instruments/tools/singlefile).
- **Серьёзная веб-архивация** → [Browsertrix](/kb/instruments/tools/browsertrix) + [ReplayWeb.page](/kb/instruments/replay/replayweb-page) для воспроизведения.
- **Библиотечный проект** → [Web Curator Tool](/kb/instruments/tools/web-curator-tool) поверх [Heritrix](/kb/instruments/tools/heritrix), [pywb](/kb/instruments/replay/pywb) для воспроизведения.
- **Сбор и анализ WARC** → [Wget](/kb/instruments/tools/wget) или [grab-site](/kb/instruments/tools/grab-site) для записи + [warcio](/kb/instruments/tools/warc-processing) для анализа в Python + [warchaeology](/kb/instruments/tools/warchaeology) для проверки.
- **Распределённый обход** → [Brozzler](/kb/instruments/tools/brozzler) + [Warcprox](/kb/instruments/tools/warcprox) + RethinkDB на нескольких машинах.
- **Офлайн-распространение** (школы, экспедиции, отключённый интернет) → [warc2zim / zimit (Kiwix)](/kb/instruments/tools/warc2zim).
- **Полнотекстовый поиск по своему архиву** → [SolrWayback](/kb/instruments/tools/solrwayback).
- **Публикация коллекции** → своё воспроизведение ([pywb](/kb/instruments/replay/pywb), [ReplayWeb.page](/kb/instruments/replay/replayweb-page)) или выкладка WARC/WACZ как item на archive.org через [ia](/kb/instruments/tools/internet-archive-cli). Учтите, что загруженные файлы **не появятся** в Wayback Machine как снимки.
- **Проверка перед публикацией** → [warchaeology](/kb/instruments/tools/warchaeology) (валидация) + [WARC-Safe](/kb/instruments/tools/warc-safe) (вирусы и NSFW).
- **Личный «прочитать позже»** → [wallabag](/kb/instruments/tools/wallabag) с мобильными приложениями.
- **Видеоархив** → [yt-dlp](/kb/instruments/tools/yt-dlp) + [ffmpeg](https://ffmpeg.org/) для постобработки.
- **Архив изображений** → [gallery-dl](/kb/instruments/tools/gallery-dl) с метаданными в JSON.
- **Скриптовая автоматизация** → [curl](/kb/instruments/tools/curl) для API + [Wget](/kb/instruments/tools/wget) для загрузки + Python для оркестрации.

## С чего начать

- **Новичок, 5 минут** → [Быстрый старт](/kb/guides/quick-start-5min).
- **Нужно срочно сохранить контент** → [Экстренная архивация](/kb/guides/emergency-archiving).
- **Полная копия сайта** → [Wget](/kb/instruments/tools/wget) или [Browsertrix](/kb/instruments/tools/browsertrix).
- **Свой Python-скрипт** → [curl](/kb/instruments/tools/curl) + [Обработка WARC](/kb/instruments/tools/warc-processing).
- **Хотите автоматизировать сценарии** → [Пользовательские workflow](/kb/guides/custom-workflows).
- **Распространить архив** → item на archive.org через [Internet Archive CLI](/kb/instruments/tools/internet-archive-cli) или ZIM через [Kiwix](/kb/instruments/tools/warc2zim).
- **Найти что-то в своём архиве** → [SolrWayback](/kb/instruments/tools/solrwayback).
- **Найти исчезнувшую страницу в чужих архивах** → [PastPage](/kb/instruments/tools/pastpage), [Wayback Machine API](/kb/instruments/tools/wayback-api).

## Связанные материалы

- [Инструменты Ruarxive](/kb/instruments/ruarxive-tools) — собственные утилиты команды.
- [Ландшафт инструментов 2026](/kb/instruments/landscape-2026) — обзор состояния области.
- [Форматы файлов](/kb/instruments/file-formats) — WARC, WACZ, CDX и другие.
- [Воспроизведение архивов](/kb/instruments/replay) — как смотреть заархивированное.
- [Социальные сети](/kb/instruments/social-media) — специфика платформ.
- [Руководства](/kb/guides) — пошаговые инструкции.
