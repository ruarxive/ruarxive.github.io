---
sidebar_position: 1
title: Программы и утилиты
description: Обзор сторонних инструментов для веб-архивации, обработки WARC, записи через прокси, поиска по архивам и автоматизации кроулинга
---

# Программы и утилиты

Сторонние инструменты с открытым кодом для веб-архивации: кроулеры разных типов, утилиты моментального сохранения, библиотеки обработки WARC/WACZ, прокси для записи трафика, поисковые движки по архивам и форматы для офлайн-чтения. Этот раздел дополняет [инструменты Ruarxive](/kb/instruments/ruarxive-tools) — здесь собраны решения, которые мы используем в связке с нашими собственными.

## Как выбрать инструмент

Ответьте на три вопроса, чтобы быстро подобрать подходящий инструмент.

### 1. Что вы хотите сохранить?

| Сценарий | Рекомендуемый инструмент | Почему |
| :--- | :--- | :--- |
| **Один URL за 30 секунд** (статья, пост) | [Archive.ph](/kb/instruments/tools/archive-ph) | Мгновенный снимок, не требует установки |
| **Одна страница со всеми ресурсами в одном HTML** | [SingleFile](/kb/instruments/tools/singlefile) или [monolith](/kb/instruments/tools/monolith) | SingleFile для браузера, monolith для CLI |
| **Одна страница, без браузера, минимальный размер** | [monolith](/kb/instruments/tools/monolith) или [Obelisk](/kb/instruments/tools/obelisk) | Go/Rust CLI без зависимостей |
| **Сайт целиком (статика, без JS)** | [Wget](/kb/instruments/tools/wget), [Wpull](/kb/instruments/tools/wpull) или [HTTrack](/kb/instruments/tools/httrack) | Wget — проще всего, Wpull — с WARC из коробки |
| **Современный сайт с JavaScript / SPA** | [Browsertrix](/kb/instruments/tools/browsertrix) или [zimit (Kiwix)](/kb/instruments/tools/warc2zim) | Browsertrix для WACZ, zimit сразу в ZIM |
| **Видео с YouTube, VK-видео, Vimeo, Twitch** | [yt-dlp](/kb/instruments/tools/yt-dlp) | 1800+ сайтов, лучшее качество, субтитры, метаданные |
| **Изображения и галереи (Instagram, Pixiv, Reddit)** | [gallery-dl](/kb/instruments/tools/gallery-dl) | 200+ платформ, метаданные, фильтрация |
| **Очень большой сайт, нужна очередь заданий** | [Warcworker](/kb/instruments/tools/warcworker) | Docker-сервис с веб-интерфейсом и очередью |
| **Распределённая архитектура (несколько машин)** | [Brozzler](/kb/instruments/tools/brozzler) | Воркеры координируются через Redis |
| **Сложное интерактивное приложение с полным контролем** | [Squidwarc](/kb/instruments/tools/squidwarc) | Прямое управление Chrome через DevTools Protocol |
| **Архивное качество WARC для долгосрочного хранения** | [Heritrix](/kb/instruments/tools/heritrix) | Стандарт Internet Archive, тонкая настройка через XML |
| **Личная коллекция страниц с тегами и аннотациями** | [WebScrapBook](/kb/instruments/tools/webscrapbook) или [wallabag](/kb/instruments/tools/wallabag) | WebScrapBook для структуры, wallabag для чтения |
| **Личный архив из RSS и закладок** | [ArchiveBox](/kb/instruments/tools/archivebox) | Аддитивный архив с веб-интерфейсом |
| **Библиотека/архив с workflow (номинация → одобрение → архивация)** | [Web Curator Tool](/kb/instruments/tools/web-curator-tool) | Готовое решение для селективной архивации |
| **Telegram-каналы и чаты** | [tdl](/kb/instruments/tools/tdl) | Быстрый загрузчик на Go |
| **Ручной браузинг с записью всего трафика** | [Warcprox](/kb/instruments/tools/warcprox) | MITM-прокси, пишет WARC в реальном времени |
| **Скрипт/API-выгрузка (Telegram, VK, Notion)** | [curl](/kb/instruments/tools/curl) | Базовый HTTP-клиент для скриптов |
| **Опубликовать архив на archive.org** | [Internet Archive CLI](/kb/instruments/tools/internet-archive-cli) | Официальный инструмент загрузки на archive.org |

### 2. Нужна поддержка JavaScript?

| Возможность | Инструменты |
| :--- | :--- |
| ✅ Полная поддержка JS через реальный браузер | [Browsertrix](/kb/instruments/tools/browsertrix), [Brozzler](/kb/instruments/tools/brozzler), [Squidwarc](/kb/instruments/tools/squidwarc), [Warcworker](/kb/instruments/tools/warcworker), [zimit (Kiwix)](/kb/instruments/tools/warc2zim) |
| ⚠️ Ограниченная поддержка (HTTP/2, AJAX) | [Wpull](/kb/instruments/tools/wpull) |
| ❌ Не поддерживает JS | [Heritrix](/kb/instruments/tools/heritrix), [Wget](/kb/instruments/tools/wget), [HTTrack](/kb/instruments/tools/httrack), [grab-site](/kb/instruments/tools/grab-site) |

### 3. Какой результат нужен?

| Формат | Инструменты |
| :--- | :--- |
| **WARC / WACZ** (стандарт архивирования) | Heritrix, Wpull, Wget, Browsertrix, Brozzler, Squidwarc, Warcworker, grab-site, Warcprox |
| **ZIM** (офлайн-чтение через Kiwix) | [warc2zim (Kiwix)](/kb/instruments/tools/warc2zim) — конвертация WARC в ZIM, zimit — кроулинг сразу в ZIM |
| **HTML-файл со встроенными ресурсами** | [SingleFile](/kb/instruments/tools/singlefile), [monolith](/kb/instruments/tools/monolith), [Obelisk](/kb/instruments/tools/obelisk) |
| **Зеркало на диске** (для офлайн-просмотра) | HTTrack, ArchiveBox, WebScrapBook |
| **Моментальный веб-снимок с постоянной ссылкой** | Archive.ph |
| **Видеофайл** (MP4, MKV, WEBM) | [yt-dlp](/kb/instruments/tools/yt-dlp) |
| **Изображения с метаданными** | [gallery-dl](/kb/instruments/tools/gallery-dl) |
| **Reader view с тегами** (Pocket-стиль) | [wallabag](/kb/instruments/tools/wallabag) |

## Категории инструментов

### 🌐 Браузерные кроулеры
Используют реальный Chrome/Chromium — единственный способ корректно сохранить современные сайты с JavaScript, SPA и динамической подгрузкой.

- **[Browsertrix](/kb/instruments/tools/browsertrix)** — Docker-утилита от Webrecorder, генерация WACZ, поведения (`autoscroll`, `autoplay`), CLI и облачный сервис.
- **[Brozzler](/kb/instruments/tools/brozzler)** — распределённый кроулер на воркерах с Redis-координацией; для крупных проектов на нескольких машинах.
- **[Squidwarc](/kb/instruments/tools/squidwarc)** — интерактивный кроулер с прямым управлением Chrome через DevTools Protocol; для сложных приложений.
- **[Warcworker](/kb/instruments/tools/warcworker)** — Docker-обёртка над Squidwarc с веб-интерфейсом, очередью и REST API.

### 🕷 HTTP-кроулеры
Работают на уровне HTTP, не выполняют JavaScript. Подходят для статических сайтов, документации, простых CMS.

- **[Heritrix](/kb/instruments/tools/heritrix)** — эталонный кроулер Internet Archive, тонкая настройка через XML, высокое качество WARC.
- **[Wpull](/kb/instruments/tools/wpull)** — форк Wget от Archive Team, нативная поддержка WARC, HTTP/2, расширение через Python-плагины.
- **[Wget](/kb/instruments/tools/wget)** — самый базовый консольный загрузчик, есть везде, с версии 1.14 пишет WARC; идеален для разовых задач и скриптов.
- **[HTTrack](/kb/instruments/tools/httrack)** — кроссплатформенный кроулер с GUI; сохраняет зеркало на диск, не создаёт WARC напрямую.
- **[grab-site](/kb/instruments/tools/grab-site)** — кроулер Archive Team с WARC-выводом, дашбордом и динамически обновляемыми ignore-паттернами.

### 🔌 HTTP-утилиты
Базовые инструменты для скриптов и API-выгрузок.

- **[curl](/kb/instruments/tools/curl)** — универсальный HTTP-клиент для скриптов, API, диагностики; 20+ протоколов, HTTP/2/3, TLS 1.3.

### ⚡ Моментальное сохранение
Один URL → один файл или одна постоянная ссылка. Минимум настройки, мгновенный результат.

- **[SingleFile](/kb/instruments/tools/singlefile)** — расширение браузера и CLI, сохраняет страницу со всеми ресурсами в один самодостаточный HTML с поддержкой JS.
- **[Archive.ph](/kb/instruments/tools/archive-ph)** — веб-сервис, делает неизменяемый снимок за 10–30 секунд, не требует регистрации.
- **[WebScrapBook](/kb/instruments/tools/webscrapbook)** — расширение Firefox/Chrome с деревом папок, аннотациями, тегами и экспортом в WARC.
- **[monolith](/kb/instruments/tools/monolith)** — CLI на Rust, ≈ 5 МБ бинарник, сохраняет страницу в один HTML без JS-рендера.
- **[Obelisk](/kb/instruments/tools/obelisk)** — Go-библиотека и CLI с REST API, для Go-проектов.

### 📚 Архивные системы
Управляют коллекциями: добавление, индексация, поиск, веб-интерфейс.

- **[ArchiveBox](/kb/instruments/tools/archivebox)** — самохостинг персонального веб-архива из RSS, закладок и списков URL; множественные методы захвата (wget, Chrome headless, SingleFile, PDF, screenshot).
- **[wallabag](/kb/instruments/tools/wallabag)** — self-hosted «read-it-later» с reader view, тегами, аннотациями, мобильными приложениями и экспортом в PDF/EPUB/JSON.

### 🔧 WARC-инфраструктура
Работа с уже записанными WARC: прокси для записи, обработка, конвертация, поиск.

- **[Warcprox](/kb/instruments/tools/warcprox)** — MITM-прокси, перехватывает HTTP/S трафик браузера и пишет его в WARC; интегрируется с Brozzler.
- **[Обработка WARC](/kb/instruments/tools/warc-processing)** — библиотеки Python/Java/Node.js/Rust/Go для чтения, записи, фильтрации и валидации WARC-файлов.
- **[Kiwix (warc2zim, zimit)](/kb/instruments/tools/warc2zim)** — конвертация WARC в ZIM для офлайн-чтения, кроулинг сразу в ZIM, формат для Wikipedia-зеркал.
- **[SolrWayback](/kb/instruments/tools/solrwayback)** — полнотекстовый поиск по WARC с морфологией для 30+ языков, графиками и Domain Graph (Королевская библиотека Дании).
- **[Shine](/kb/instruments/tools/shine)** — современный полнотекстовый поиск по WARC на Go, REST API, проще SolrWayback (Internet Archive).

### 🏛 Управление архивацией
Полноценные системы с workflow, ролями и интеграцией с архивами.

- **[Web Curator Tool](/kb/instruments/tools/web-curator-tool)** — open-source платформа для библиотек и архивов: номинация → одобрение → архивация → валидация → публикация.
- **[Internet Archive CLI (ia)](/kb/instruments/tools/internet-archive-cli)** — официальный инструмент для загрузки, скачивания и управления архивами на archive.org и Wayback Machine.

### 💬 Специализированные загрузчики
Узкоспециализированные инструменты для конкретных платформ.

- **[tdl](/kb/instruments/tools/tdl)** — высокопроизводительный загрузчик Telegram-каналов и чатов на Go, поддержка защищённого контента.
- **[yt-dlp](/kb/instruments/tools/yt-dlp)** — форк youtube-dl, 1800+ сайтов, загрузка видео/аудио/субтитров в максимальном качестве.
- **[gallery-dl](/kb/instruments/tools/gallery-dl)** — загрузчик изображений и коллекций из 200+ платформ (Instagram, Pixiv, Reddit, Tumblr, борды).

## Сводная таблица

| Инструмент | JS | WARC | Распределённость | Веб-интерфейс | Сложность |
| :--- | :---: | :---: | :---: | :--- | :--- |
| **Browsertrix** | ✅ | ✅ WACZ | ❌ | ✅ (Cloud) | Средняя |
| **Brozzler** | ✅ | ✅ | ✅ Redis | ⚠️ Опц. | Высокая |
| **Squidwarc** | ✅ | ✅ | ❌ | ❌ | Средняя |
| **Warcworker** | ✅ | ✅ | ❌ | ✅ | Средняя |
| **Heritrix** | ❌ | ✅ | ❌ | ✅ | Высокая |
| **Wpull** | ⚠️ | ✅ | ❌ | ❌ | Низкая |
| **Wget** | ❌ | ✅ (1.14+) | ❌ | ❌ | Очень низкая |
| **HTTrack** | ❌ | ⚠️ через конвертацию | ❌ | ✅ GUI | Низкая |
| **grab-site** | ❌ | ✅ | ❌ | ✅ Dashboard | Низкая |
| **curl** | ❌ | ⚠️ обёртки | ❌ | ❌ | Низкая |
| **SingleFile** | ✅ | ❌ (HTML) | ❌ | ❌ | Низкая |
| **monolith** | ❌ | ❌ (HTML) | ❌ | ❌ | Очень низкая |
| **Obelisk** | ❌ | ❌ (HTML) | ❌ | ✅ REST | Низкая |
| **Archive.ph** | ⚠️ | ❌ (снимок) | ❌ | ✅ (внешний) | Очень низкая |
| **WebScrapBook** | ⚠️ | ✅ через экспорт | ❌ | ✅ | Средняя |
| **ArchiveBox** | ✅ | ⚠️ | ❌ | ✅ | Средняя |
| **wallabag** | ❌ | ❌ (HTML) | ❌ | ✅ | Средняя |
| **Warcprox** | ✅ | ✅ | ❌ | ❌ | Средняя |
| **warc2zim (Kiwix)** | ✅ (zimit) | ✅ + ZIM | ❌ | ✅ Kiwix | Средняя |
| **SolrWayback** | ✅ | индекс | ⚠️ | ✅ | Высокая |
| **Shine** | ✅ | индекс | ❌ | ✅ | Средняя |
| **Web Curator Tool** | ❌ | ✅ | ⚠️ | ✅ | Высокая |
| **Internet Archive CLI (ia)** | ❌ | ✅ upload | ❌ | ❌ | Низкая |
| **tdl** | ❌ | ❌ (Telegram) | ❌ | ❌ | Низкая |
| **yt-dlp** | ❌ | ❌ (видео) | ❌ | ❌ | Низкая |
| **gallery-dl** | ❌ | ❌ (фото) | ❌ | ❌ | Низкая |

## Рекомендованные связки

В реальных проектах мы комбинируем несколько инструментов:

- **Быстрый фикс отдельной страницы** → [Archive.ph](/kb/instruments/tools/archive-ph) или [SingleFile](/kb/instruments/tools/singlefile).
- **Серьёзная веб-архивация** → [Browsertrix](/kb/instruments/tools/browsertrix) + [ReplayWeb.page](/kb/instruments/replay/replayweb-page) для воспроизведения.
- **Библиотечный проект** → [Web Curator Tool](/kb/instruments/tools/web-curator-tool) поверх [Heritrix](/kb/instruments/tools/heritrix), [pywb](/kb/instruments/replay/pywb) для воспроизведения.
- **Анализ WARC-дампов** → [Wpull](/kb/instruments/tools/wpull) или [Wget](/kb/instruments/tools/wget) для записи + [warcio](/kb/instruments/tools/warc-processing) для анализа в Python.
- **Распределённый кроулинг** → [Brozzler](/kb/instruments/tools/brozzler) + [Warcprox](/kb/instruments/tools/warcprox) + Redis + несколько машин.
- **Офлайн-распространение** (школы, экспедиции, отключённый интернет) → [warc2zim (Kiwix)](/kb/instruments/tools/warc2zim) для конвертации в ZIM.
- **Полнотекстовый поиск по архиву** → [SolrWayback](/kb/instruments/tools/solrwayback) для больших проектов, [Shine](/kb/instruments/tools/shine) для средних.
- **Публикация в Wayback Machine** → [Browsertrix](/kb/instruments/tools/browsertrix) для кроулинга + [Internet Archive CLI](/kb/instruments/tools/internet-archive-cli) для загрузки.
- **Личный «read-it-later»** → [wallabag](/kb/instruments/tools/wallabag) с мобильными приложениями.
- **Видео-архив** → [yt-dlp](/kb/instruments/tools/yt-dlp) + [ffmpeg](https://ffmpeg.org/) для пост-обработки.
- **Архив изображений** → [gallery-dl](/kb/instruments/tools/gallery-dl) с метаданными в JSON.
- **Скриптовая автоматизация** → [curl](/kb/instruments/tools/curl) для API + [Wget](/kb/instruments/tools/wget) для загрузки + [Python](https://python.org/) для оркестрации.

## С чего начать

- **Новичок, 5 минут** → [Быстрый старт](/kb/guides/quick-start-5min).
- **Нужно срочно сохранить контент** → [Экстренная архивация](/kb/guides/emergency-archiving).
- **Полная копия сайта** → [Wget](/kb/instruments/tools/wget) или [Browsertrix](/kb/instruments/tools/browsertrix).
- **Свой Python-скрипт** → [curl](/kb/instruments/tools/curl) + [Обработка WARC](/kb/instruments/tools/warc-processing) и [Wpull](/kb/instruments/tools/wpull).
- **Хотите автоматизировать сценарии** → [Пользовательские workflow](/kb/guides/custom-workflows).
- **Опубликовать для всех** → [Internet Archive CLI](/kb/instruments/tools/internet-archive-cli) на archive.org или [Kiwix (warc2zim)](/kb/instruments/tools/warc2zim) через торренты.
- **Найти что-то в архиве** → [SolrWayback](/kb/instruments/tools/solrwayback) или [Shine](/kb/instruments/tools/shine).

## Связанные материалы

- [Инструменты Ruarxive](/kb/instruments/ruarxive-tools) — собственные утилиты команды.
- [Форматы файлов](/kb/instruments/file-formats) — WARC, WACZ, CDX, ZIM и другие.
- [Воспроизведение архивов](/kb/instruments/replay) — как смотреть заархивированное.
- [Социальные сети](/kb/instruments/social-media) — специфика Twitter, YouTube, VK и т. д.
- [Руководства](/kb/guides) — пошаговые инструкции.
