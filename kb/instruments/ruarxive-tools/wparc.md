---
title: wparc
sidebar_label: wparc (WordPress)
description: "Выгрузка открытых данных сайтов на WordPress через REST API (/wp-json/): записи, страницы, метаданные медиа, комментарии в JSONL и скачивание медиафайлов."
last_update:
  date: 2026-10-29
---

# wparc (WordPress)

**wparc** — утилита командной строки для резервного копирования публичных данных сайтов на WordPress через [REST API](https://developer.wordpress.org/rest-api/) (точка `/wp-json/`, есть в WordPress начиная с версии 4.7). Вместо обхода HTML-страниц она читает структурированные данные API, поэтому выгрузка получается быстрее и сохраняет метаданные: даты, авторов, рубрики, теги.

- Репозиторий: [github.com/ruarxive/wparc](https://github.com/ruarxive/wparc) · Лицензия: Apache-2.0 · Язык: Python
- Первая (бета) версия анонсирована в [посте #32 от 31.03.2022](https://t.me/ruarxive/32).

## Установка

```bash
pip install wparc
```

На PyPI опубликована версия **1.0.8** (июль 2026 года): команды `ping`, `analyze`, `dump`, `getfiles`. В репозитории уже есть версия **1.0.9** (5 октября 2026 года) с дополнительными командами `index` и `warc`, параллельной выгрузкой `--workers`, HTTP Basic Auth и ограничением частоты запросов. Пока она не опубликована на PyPI, её можно поставить из GitHub:

```bash
pip install git+https://github.com/ruarxive/wparc.git
```

Требуется Python 3.8 или новее (`requires-python` в пакете; README рекомендует 3.9+).

> Команды сверены с README и `--help` версий 1.0.8 (PyPI) и 1.0.9 (GitHub), октябрь 2026.

## Команды

Домен передаётся позиционным аргументом, без `https://`.

| Команда | Что делает | Версия |
| :--- | :--- | :--- |
| `wparc ping example.com` | Проверяет, что `/wp-json/` доступен, и выводит число маршрутов API | 1.0.8 |
| `wparc analyze example.com` | Сравнивает маршруты сайта со списком известных и проверяет неизвестные | 1.0.8 |
| `wparc dump example.com` | Выгружает данные всех маршрутов API в JSONL | 1.0.8 |
| `wparc getfiles example.com` | Скачивает медиафайлы из `wp_v2_media.jsonl` (нужен предварительный `dump`) | 1.0.8 |
| `wparc index example.com` | Строит SQLite-индекс `example.com/index.sqlite3` по результатам `dump` | 1.0.9 |
| `wparc warc example.com` | Упаковывает результаты `dump` в файл WARC 1.1 | 1.0.9 |

### Основные опции

- Общие для `ping`, `dump`, `analyze`: `--https/--no-https` (по умолчанию HTTPS), `--no-verify-ssl`, `--timeout` (по умолчанию 360 с), `-v/--verbose`.
- `dump`: `--page-size` (по умолчанию 100), `--retry-count` (по умолчанию 5), `--all/-a` (включать неизвестные маршруты, по умолчанию включено).
- Только в 1.0.9: `dump --workers N` и `--index`; `getfiles --workers N` (по умолчанию 5) и `--no-resume`; `--user`, `--password`, `--rate-limit` у `ping`, `dump`, `analyze`; `warc --output FILE` (по умолчанию `dump.warc.gz`) и `--no-compress`.

## Пример

```bash
# 1. Проверить доступность API
wparc ping example.com

# 2. Выгрузить данные
wparc dump example.com --verbose

# 3. Скачать медиафайлы
wparc getfiles example.com

# Только в версии 1.0.9 из GitHub:
wparc index example.com
wparc warc example.com --output example.warc.gz
```

## Формат результата

Все результаты складываются в каталог с именем домена в текущей папке:

```text
example.com/
├── data/
│   ├── wp-json.json            # корневой ответ /wp-json/
│   ├── wp_v2_posts.jsonl       # записи
│   ├── wp_v2_pages.jsonl       # страницы
│   ├── wp_v2_media.jsonl       # метаданные медиафайлов
│   ├── wp_v2_types.json
│   └── ...                     # остальные маршруты: по файлу на маршрут
├── files/
│   └── wp-content/uploads/...  # медиафайлы с исходной структурой путей
├── .wparc_checkpoint.json      # список уже скачанных файлов (докачка)
├── index.sqlite3               # wparc index (1.0.9)
└── dump.warc.gz                # wparc warc (1.0.9)
```

Повторный `dump` перезаписывает файлы в `data/`. `getfiles` пропускает файлы, уже отмеченные в `.wparc_checkpoint.json`.

### О WARC из `wparc warc`

Команда `warc` записывает одну запись `warcinfo` и по одной записи `response` на каждую строку JSONL. Адрес записи (`WARC-Target-URI`) имеет вид `<файл>#<id>`, а в теле лежит JSON-объект WordPress. Такой файл удобно хранить вместе с другими WARC и индексировать [metawarc](./metawarc), но это не веб-архив страниц сайта: открыть его в pywb как сайт нельзя.

## Ограничения

- Работает только там, где REST API открыт. Часть владельцев сайтов закрывает `/wp-json/` для неавторизованных пользователей, у WordPress старше 4.7 этой точки нет.
- Выгружается только опубликованный и публично доступный контент. Маршруты, отвечающие 401/403, пропускаются.
- Вёрстка, CSS и JavaScript не сохраняются. Если важно, как сайт выглядел, дополнительно снимите его краулером с записью в WARC: [Browsertrix Crawler](/kb/instruments/tools/browsertrix), [wget](/kb/instruments/tools/wget) с `--warc-file` или [grab-site](/kb/instruments/tools/grab-site).
- Маршруты плагинов выгружаются, если они видны в `/wp-json/` и не требуют авторизации; `analyze` помогает их найти.
- При непредвиденной ошибке wparc печатает только её текст. Полную трассировку для отчёта об ошибке даёт переменная окружения `WPARC_DEBUG=1`, например `WPARC_DEBUG=1 wparc dump example.com`. Она есть только в версии 1.0.9.

## Когда выбрать другой инструмент

| Задача | Лучше подойдёт |
| :--- | :--- |
| Нужен вид страниц, JavaScript, ленивая подгрузка | [Browsertrix Crawler](/kb/instruments/tools/browsertrix) |
| Сайт без открытого `/wp-json/` | [wget](/kb/instruments/tools/wget) с `--warc-file`, [grab-site](/kb/instruments/tools/grab-site) |
| Нужен WARC с HTTP-ответами для просмотра | краулеры выше; для просмотра — [pywb](/kb/instruments/replay/pywb) |
| Поиск и анализ уже собранных WARC | [metawarc](./metawarc) |

## Связанные материалы

- [Все инструменты Ruarxive](/kb/instruments/ruarxive-tools)
- [Гайд: сделать копию сайта на WordPress](/kb/instruments/howto-collect/make-copy-site-wordpress)
- [Формат WARC](/kb/instruments/file-formats/warc)
- [wparc в курсе DH2 (Web Archiving)](/kb/course/dh2-web-archiving)
