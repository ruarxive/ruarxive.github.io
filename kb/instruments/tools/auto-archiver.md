---
title: Auto-Archiver (Bellingcat) — workflow-оркестратор
sidebar_label: Auto-Archiver
description: "Auto-Archiver — open-source инструмент Bellingcat для автоматической архивации ссылок из Google Sheets, CSV, Telegram, Atlos. Сохраняет в WACZ/WARC, выгружает в S3/локально."
last_updated: 2026-11-09
keywords: [auto-archiver, bellingcat, osint, archiving, workflow, google-sheets]
---

# Auto-Archiver (Bellingcat)

[Auto-Archiver](https://github.com/bellingcat/auto-archiver) — open-source Python-инструмент от [Bellingcat](https://www.bellingcat.com/) для **автоматической архивации ссылок** из Google Sheets, CSV, Telegram и других источников. С 2023 года используется в OSINT-расследованиях для архивации соцсетей, видео, новостных материалов и веб-страниц.

> **Главное отличие от Browsertrix и wget:** Auto-Archiver не собирает сам сайт — он **координирует** запуск нужного инструмента под каждый тип ссылки. Пост с Telegram → `telegram_extractor`, видео YouTube → `yt_dlp_extractor`, сайт → `wacz_extractor`, картинка → `image_extractor`. Всё записывается в Google Sheets с метаданными.

> По данным Bellingcat на 2025 год, Auto-Archiver помог сохранить более **150 000 материалов** онлайн-доказательств. Включая систематическую архивацию во время конфликта Россия-Украина.

## Зачем нужен

| Задача | Стандартный способ | С Auto-Archiver |
|:---|:---|:---|
| Архивировать 50 ссылок из Telegram за день | Вручную качать каждый | Добавить ссылки в Google Sheets, запустить раз в день |
| OSINT-расследование по 200 материалов | 8 часов ручного труда | 30 мин на запуск + проверить результат |
| Регулярная архивация соцсетей | Сложные скрипты | Шаблон: `telegram_extractor` + `instagram_extractor` |
| Автоматическое обогащение метаданными | Самописные скрипты | Из коробки: hash, MIME, дата, скриншот |

## Возможности

### Источники (Inputs)

| Тип входа | Как |
|:---|:---|
| **Google Sheets** | Самая частая схема; рекодёрская колонка `url` + служебные |
| **CSV-файл** | `auto-archiver run --csv=./urls.csv` |
| **Airtable** | Через интеграционный скрипт |
| **Atlos** | Платформа расследований Bellingcat |
| **Telegram-бот** | Регистрация материалов через Telegram |
| **API** | Из собственных скриптов |

### Экстракторы (по типу материала)

| Тип ссылки | Экстрактор | Что делает |
|:---|:---|:---|
| Telegram-пост (публичный) | `telegram_extractor` | Скачивает текст + медиа + метаданные |
| Telegram-канал (с логином) | `telethon_extractor` | Полная история канала через Telethon |
| YouTube / Vimeo / видео | `yt_dlp_extractor` | Видео + метаданные + субтитры через yt-dlp |
| Веб-страница | `wacz_extractor` | WACZ через Browsertrix Cloud или self-hosted |
| Instagram пост | `instagram_extractor` | Через instaloader |
| VK | `vk_extractor` | Через vk-caching или API |
| Изображение | `image_extractor` | Оригинал + хеш |
| PDF | `pdf_extractor` | Скачивание + OCR (опционально) |
| Произвольный URL | `generic_extractor` | Хеш + заголовки + базовая метаинформация |

### Хранилища (Outputs)

| Куда | Формат | Когда |
|:---|:---|:---|
| Локальная папка | Файлы + JSON-метаданные | Разработка, малые проекты |
| AWS S3 / Backblaze | Файлы + JSON | Продакшен |
| Google Drive | Файлы | Нетехнические пользователи |
| Hugging Face Datasets | Датасет | ML-исследования |
| Локальная БД (SQLite) | Метаданные | Поиск по архивам |

## Установка

### Через pip

```bash
pip install auto-archiver
```

### Через Docker

```bash
docker pull bellingcat/auto-archiver
docker run -v $(pwd)/config.yaml:/app/config.yaml \
  -v $(pwd)/output:/app/output \
  bellingcat/auto-archiver
```

### Из исходников

```bash
git clone https://github.com/bellingcat/auto-archiver
cd auto-archiver
pip install -e .
```

## Быстрый старт

### 1. Подготовьте Google Sheets

| url | tags | folder |
|:---|:---|:---|
| https://t.me/example/123 | "расследование" | "month-1" |
| https://youtube.com/watch?v=abc | "видео" | "month-1" |
| https://example.com/article | "" | "month-1" |

Создайте сервисный аккаунт Google, расшарьте таблицу.

### 2. config.yaml

```yaml
input:
  google_sheets:
    sheet_id: "1AbC..."
    credentials_file: "./google-credentials.json"
    worksheet: "Sheet1"
    url_column: "url"
    headers_in_first_row: true

extractors:
  telegram_extractor:
    enabled: true
  yt_dlp_extractor:
    enabled: true
  wacz_extractor:
    enabled: true
    browsertrix_url: "http://localhost:3030"   # self-hosted Browsertrix Cloud
  generic_extractor:
    enabled: true

storages:
  local:
    folder: "./output"
  s3:
    enabled: false
    bucket: "my-bucket"

database:
  type: sqlite
  file: "./auto-archiver.db"

logging:
  level: info
  log_file: "./auto-archiver.log"
```

### 3. Запуск

```bash
auto-archiver run --config config.yaml
```

Auto-Archiver читает Google Sheets, обрабатывает каждую строку, записывает результаты обратно в Sheets (статус, путь к файлу, hash, дата).

## Сценарии использования

### Сценарий 1. OSINT-расследование (50–500 ссылок)

1. Создать Google Sheet, расшарить с командой.
2. Каждый член команды добавляет найденные ссылки.
3. Один раз в день — `auto-archiver run`.
4. На следующий день — таблица обновлена; можно переходить к анализу.

### Сценарий 2. Регулярная архивация Telegram-каналов

```yaml
extractors:
  telethon_extractor:
    enabled: true
    api_id: 12345
    api_hash: "your_hash"
    channels:
      - "channelname1"
      - "channelname2"

storages:
  s3:
    enabled: true
    bucket: "telegram-archives"
```

Запуск по cron ежедневно:

```cron
0 3 * * *  cd /opt/auto-archiver && auto-archiver run --config telegram-config.yaml
```

### Сценарий 3. Журналистский мониторинг

Коллеги скидывают ссылки в общий Telegram-бот → Auto-Archiver складывает всё в S3 с метаданными. Через неделю — датасет для редакции.

### Сценарий 4. Локальный исследователь

Несколько папок с разными тегами, auto-archiver бежит по очереди:

```yaml
input:
  csv:
    file: "./investigation-2026-11.csv"
    url_column: "link"

storages:
  local:
    folder: "/data/investigations/2026-11"
```

## Метаданные, которые Auto-Archiver собирает

Для каждого заархивированного URL:

```json
{
  "url": "https://t.me/example/123",
  "type": "telegram",
  "status": "archived",
  "hash_md5": "5f4dcc3b...",
  "hash_sha256": "...",
  "size_bytes": 102400,
  "mimetype": "image/jpeg",
  "archived_at": "2026-11-09T12:00:00Z",
  "downloaded_at": "2026-11-09T12:05:00Z",
  "title": "Заголовок поста",
  "description": "Текст сообщения",
  "author": "Канал Example",
  "date_published": "2026-11-08T10:00:00Z",
  "screenshot_path": "screenshot.png",
  "wacz_path": null,
  "thumbnail_path": "thumb.jpg",
  "tags": ["расследование", "month-1"],
  "folder": "month-1/"
}
```

Метаданные сохраняются в SQLite, JSON-файл рядом с архивом, и в Google Sheets (для удобства анализа).

## Конфигурация расписания

### Однократный запуск

```bash
auto-archiver run
```

### Через cron

```cron
# Каждые 6 часов
0 */6 * * * cd /opt/auto-archiver && auto-archiver run
```

### Через systemd timer

```ini
[Unit]
Description=Auto-Archiver periodic run

[Timer]
OnCalendar=hourly
Persistent=true

[Service]
ExecStart=/usr/local/bin/auto-archiver run --config /etc/auto-archiver.yaml
WorkingDirectory=/var/lib/auto-archiver
```

### Airflow / Prefect / Prefect Cloud

Auto-Archiver можно встроить в DAG-графы Python-orchestration систем. Каждый шаг (extract, archive, store) — отдельный task.

## Production tips

### Изоляция аккаунтов

Для `telethon_extractor` используйте **отдельный** Telegram-аккаунт (не личный). Иначе риск бана.

### Лимиты API

YouTube Data API v3 — есть квоты. Либо используйте только `yt_dlp_extractor` (без API), либо комбинируйте с `yt_dlp_extractor` для большинства ссылок.

### Хранилище больших файлов

Видео и Telegram-каналы быстро наполняют диск. Настройте S3 Glacier или холодное хранилище для старых архивов.

### Удаление дубликатов

Auto-Archiver проверяет SHA-256 — если архив уже есть, повторно не скачивает. Это экономит трафик и место.

### Антибот-защита

Для сайтов с Cloudflare DataDome — часто нужен browser-extractor (через WACZ). Если и так не работает — увы, никакой инструмент не поможет без белого списка IP от владельцев.

## Когда использовать

✅ Подходит:

- **OSINT-расследования** с десятками/сотнями ссылок из разных источников.
- **Журналистский workflow** — материалы приходят в Telegram, автоматически архивируются.
- **Регулярная архивация каналов/аккаунтов** с метаданными.
- **Команды без навыков кодинга** — UI через Google Sheets проще, чем скрипты.
- **Проекты с лимитом времени** — автоматизация убирает рутину.

❌ Не подходит:

- **Один URL** — проще [Archive.ph](https://archive.ph/).
- **Полная архивация большого сайта** — нужен [Browsertrix](/kb/instruments/tools/browsertrix) или [wparc](/kb/instruments/ruarxive-tools/wparc).
- **Real-time мониторинг** — Auto-Archiver пакетный, не непрерывный.
- **Платформы без публичного API/веб-доступа** — закрытые чаты, защищённые CDN — нужны специальные инструменты.
- **Юридически чувствительные данные** — метаданные с именами авторов, датами публикации нужно проверять до публикации.

## Сравнение с аналогами

| Возможность | Auto-Archiver | ad-hoc скрипты | Browsertrix | ArchiveBot |
|:---|:-:|:-:|:-:|:-:|
| Multi-source вход | ✅ Sheets, CSV | ⚠️ только код | ❌ | ❌ |
| Multi-extractor | ✅ | ⚠️ | ❌ | ❌ |
| Метаданные автоматически | ✅ | ⚠️ | ❌ | ❌ |
| WACZ | ✅ | ⚠️ | ✅ | ✅ |
| Real-time | ❌ | ✅ | ❌ | ✅ |
| Production-ready | ✅ | ⚠️ | ✅ | ✅ |
| Простота для нетех. пользователя | ✅ | ❌ | ⚠️ | ✅ |
| Бесплатный | ✅ | ✅ | ✅ | ✅ |

## Ресурсы

- [GitHub репозиторий](https://github.com/bellingcat/auto-archiver)
- [Документация](https://auto-archiver.readthedocs.io/)
- [Конфигурация по умолчанию](https://github.com/bellingcat/auto-archiver/blob/main/config.yaml)
- [Bellingcat — Auto-Archiver announcement](https://www.bellingcat.com/resources/2025/08/13/the-open-source-tool-that-has-preserved-150000-pieces-of-online-evidence/)
- [Agentic AI Meets Archiving Tools](https://www.linkedin.com/pulse/agentic-ai-meets-archiving-tools-framework-rapidly-preserve-nickel-rap8e) — связка с LLM-агентами.

## Связанные материалы

- [Browsertrix](/kb/instruments/tools/browsertrix) — для сайтов под WACZ.
- [yt-dlp](/kb/instruments/tools/yt-dlp) — для видео.
- [Wget](/kb/instruments/tools/wget) — базовый кроулер.
- [Wayback Machine API](/kb/instruments/tools/wayback-api) — для проверки в Wayback.
- [Социальные сети](/kb/instruments/social-media) — ручные методы по платформам.
- [Ландшафт 2026](/kb/instruments/landscape-2026) — где Auto-Archiver в общей картине.
