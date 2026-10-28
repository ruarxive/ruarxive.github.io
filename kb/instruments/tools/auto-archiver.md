---
title: Auto-Archiver (Bellingcat) — оркестратор архивации ссылок
sidebar_label: Auto-Archiver
description: "Auto-Archiver — открытый инструмент Bellingcat для автоматической архивации ссылок из Google Sheets, CSV, командной строки и Atlos: подбирает модуль под тип ссылки, сохраняет медиа, метаданные и хеши локально, в S3 или Google Drive."
last_update:
  date: 2026-10-28
keywords: [auto-archiver, bellingcat, osint, archiving, workflow, google-sheets]
---

# Auto-Archiver (Bellingcat)

[Auto-Archiver](https://github.com/bellingcat/auto-archiver) — открытый (MIT) инструмент на Python от [Bellingcat](https://www.bellingcat.com/) для **автоматической архивации ссылок**. Он берёт URL из разных источников (CSV-файл, Google Sheets, командная строка, платформа Atlos), архивирует содержимое каждого — посты в соцсетях, видео, изображения, веб-страницы, — обогащает его метаданными и хешами и сохраняет локально или в облако. Разрабатывается с 2021 года и используется в OSINT-расследованиях.

> **Главное отличие от Browsertrix и wget:** Auto-Archiver не обходит сайты целиком — он **прогоняет каждую ссылку через цепочку модулей**: извлечение (например, `generic_extractor` на базе yt-dlp для видео, `telegram_extractor` для постов Telegram), обогащение (хеши, миниатюры, SSL-сертификат), запись статуса в базу (например, обратно в Google Sheets) и сохранение файлов.

> По данным [Bellingcat (август 2025 года)](https://www.bellingcat.com/resources/2025/08/13/the-open-source-tool-that-has-preserved-150000-pieces-of-online-evidence/), с помощью Auto-Archiver сохранено более **150 000 материалов** онлайн-доказательств.

## Зачем нужен

| Задача | Без Auto-Archiver | С Auto-Archiver |
|:---|:---|:---|
| Архивировать десятки ссылок на посты в Telegram | Скачивать каждый вручную | Добавить ссылки в Google Sheets или CSV и запустить по расписанию |
| Совместный сбор материалов для расследования | Ссылки в чатах и документах | Общая таблица, в которую Auto-Archiver записывает статус, путь к архиву, хеш |
| Подтвердить неизменность материала | Самописные скрипты | Хеши (SHA-256 по умолчанию), перцептивные хеши, метки времени |

## Как устроена конфигурация

Вся настройка хранится в одном файле **`orchestration.yaml`** (обычно в папке `secrets/`). При первом запуске без `--config` Auto-Archiver сам создаёт `secrets/orchestration.yaml` с рекомендуемыми настройками.

Файл состоит из двух частей:

1. **`steps`** — какие модули запускать, по шагам: `feeders` (источники ссылок), `extractors` (извлечение), `enrichers` (обогащение), `databases` (куда записывать статус), `storages` (куда сохранять файлы), `formatters` (итоговая HTML-страница).
2. **Настройки модулей** — секции с именем модуля на верхнем уровне (`local_storage:`, `csv_feeder:`, `hash_enricher:` и т. д.).

Любую настройку можно переопределить из командной строки: `--имя_модуля.параметр=значение`.

## Модули

Список по версии 1.2.9 (полный — в `auto-archiver --help` и в [документации](https://auto-archiver.readthedocs.io/en/latest/)).

### Источники (feeders)

| Модуль | Что делает |
|:---|:---|
| `cli_feeder` | URL из командной строки (по умолчанию) |
| `csv_feeder` | URL из CSV-файлов (настройки `files`, `column`) |
| `gsheet_feeder_db` | строки из Google Sheets; одновременно записывает результаты обратно в таблицу |
| `atlos_feeder_db_storage` | материалы из платформы расследований [Atlos](https://www.atlos.org/); может также хранить результаты в Atlos |

### Извлечение (extractors)

| Модуль | Что делает |
|:---|:---|
| `generic_extractor` | видео и посты с сайтов, которые поддерживает [yt-dlp](/kb/instruments/tools/yt-dlp) (YouTube, Facebook и др.), с субтитрами и метаданными |
| `telegram_extractor` | медиа из публичных постов Telegram по ссылке, без входа в аккаунт |
| `telethon_extractor` | посты и медиа из каналов и групп Telegram через Telethon, включая закрытые (нужны `api_id`, `api_hash`) |
| `instagram_api_extractor`, `instagram_tbot_extractor`, `instagram_extractor` | Instagram через API, через Telegram-бота или через Instaloader (последний не поддерживается из-за блокировок) |
| `twitter_api_extractor` | X/Twitter через API |
| `wacz_extractor_enricher` | WACZ-архив страницы через локальный [Browsertrix Crawler](/kb/instruments/tools/browsertrix), запускаемый в Docker |
| `wayback_extractor_enricher` | отправка URL в Wayback Machine (нужны ключ и секрет SPN API) |
| `antibot_extractor_enricher` | браузер на SeleniumBase: HTML, медиа, скриншот и PDF страницы |

### Обогащение, базы, хранилища

- **Обогащение:** `hash_enricher`, `pdq_hash_enricher` (перцептивные хеши), `thumbnail_enricher`, `ssl_enricher`, `meta_enricher`, `metadata_enricher` (exiftool), `timestamping_enricher` и `opentimestamps_enricher` (доверенные метки времени), `whisper_enricher` (расшифровка аудио).
- **Базы:** `console_db`, `csv_db`, `gsheet_feeder_db`, `api_db`, `atlos_feeder_db_storage`.
- **Хранилища:** `local_storage`, `s3_storage` (S3-совместимые, в том числе с `endpoint_url`), `gdrive_storage`, `atlos_feeder_db_storage`.

:::warning Обход защиты от ботов
В конфигурации, которую Auto-Archiver создаёт по умолчанию, включён `antibot_extractor_enricher`; по описанию модуля он пытается обходить антибот-защиту вроде Cloudflare Turnstile и reCAPTCHA. Обходить технические средства защиты нельзя: если у вас нет на это явного правового основания, уберите модуль из `steps` и проконсультируйтесь с юристом.
:::

## Установка

### Через Docker (рекомендуется)

```bash
docker pull bellingcat/auto-archiver
docker run -it --rm -v $PWD/secrets:/app/secrets -v $PWD/local_archive:/app/local_archive \
  bellingcat/auto-archiver -- "https://example.com/1/"
```

Папка `secrets/` хранит `orchestration.yaml` и ключи доступа, `local_archive/` — результаты `local_storage`.

### Через pip

Нужен Python 3.10–3.12:

```bash
pip install auto-archiver
auto-archiver --help
```

Для локальной установки также нужны `ffmpeg` (видео), `exiftool` (для `metadata_enricher`) и Docker-образ `webrecorder/browsertrix-crawler` (для WACZ).

> Команды и имена модулей сверены с README, документацией и `auto-archiver --help` версии 1.2.9 (октябрь 2026).

## Быстрый старт

### 1. Архивация нескольких ссылок из командной строки

```bash
auto-archiver "https://t.me/example/123" "https://www.youtube.com/watch?v=VIDEO_ID"
```

При первом запуске будет создан `secrets/orchestration.yaml`, результаты попадут в `./local_archive`, а сводка — в `db.csv` (модуль `csv_db`).

### 2. Ссылки из CSV-файла

```bash
auto-archiver --config secrets/orchestration.yaml \
  --feeders=csv_feeder --csv_feeder.files=urls.csv --csv_feeder.column=url
```

### 3. Google Sheets

Нужен сервисный аккаунт Google с доступом к таблице (инструкция — в разделе [How-to → Google Sheets](https://auto-archiver.readthedocs.io/en/latest/) документации). По умолчанию модуль ожидает столбцы `link`, `archive status`, `archive location`, `archive date`, `hash`, `screenshot`, `wacz` и др.; свои названия задаются через `columns`.

Фрагмент `orchestration.yaml`:

```yaml
steps:
  feeders:
  - gsheet_feeder_db
  extractors:
  - generic_extractor
  - telegram_extractor
  enrichers:
  - thumbnail_enricher
  - hash_enricher
  databases:
  - gsheet_feeder_db
  storages:
  - local_storage
  formatters:
  - html_formatter

gsheet_feeder_db:
  sheet: "Название таблицы"
  service_account: secrets/service_account.json
  header: 1

local_storage:
  save_to: ./local_archive

hash_enricher:
  algorithm: SHA-256
```

Запуск:

```bash
auto-archiver --config secrets/orchestration.yaml
```

Auto-Archiver возьмёт строки без статуса, обработает их и запишет в таблицу статус, ссылку на архив, дату и хеш.

### 4. WACZ-архив страницы

```yaml
steps:
  extractors:
  - wacz_extractor_enricher

wacz_extractor_enricher:
  timeout: 120
  # profile: secrets/profile.tar.gz   # профиль браузера Browsertrix для страниц с входом
```

Модуль сам запускает Browsertrix Crawler через `docker`, поэтому Docker должен быть доступен.

## Сценарии использования

### Расследование (десятки и сотни ссылок)

1. Создать Google Sheet и дать доступ команде и сервисному аккаунту.
2. Участники добавляют найденные ссылки в столбец `link`.
3. Auto-Archiver запускается по расписанию и заполняет остальные столбцы.

### Архивация постов из Telegram

`telethon_extractor` архивирует **посты по ссылкам**, а не выгружает канал целиком. Для полной выгрузки истории каналов используйте [tgarc](/kb/instruments/ruarxive-tools/tgarc) или другие инструменты из раздела про Telegram.

```yaml
steps:
  extractors:
  - telethon_extractor
  - telegram_extractor

telethon_extractor:
  api_id: 12345
  api_hash: "ваш_api_hash"
  session_file: secrets/anon
```

Используйте **отдельный** Telegram-аккаунт, а не личный: при активной работе через API аккаунт могут ограничить.

## Запуск по расписанию

### Через cron

```cron
# Каждые 6 часов
0 */6 * * * cd /opt/auto-archiver && auto-archiver --config secrets/orchestration.yaml
```

### Через systemd timer

```ini
# auto-archiver.service
[Service]
Type=oneshot
WorkingDirectory=/var/lib/auto-archiver
ExecStart=/usr/local/bin/auto-archiver --config secrets/orchestration.yaml

# auto-archiver.timer
[Timer]
OnCalendar=hourly
Persistent=true

[Install]
WantedBy=timers.target
```

## Практические советы

- **Хранилище.** Видео быстро занимают место — используйте `s3_storage` и холодное хранение для старых материалов.
- **Повторы.** Из Google Sheets берутся только строки без статуса архивации, поэтому повторный запуск не архивирует одно и то же заново.
- **Сайты с защитой от ботов.** Если сайт закрыт защитой, не пытайтесь её обходить; проверьте, нет ли материала в других архивах (Wayback Machine, archive.today), или обратитесь к владельцу ресурса.
- **Персональные данные.** Архив содержит имена авторов, тексты и медиа; перед публикацией проверьте, есть ли основания (см. раздел [о персональных данных](/kb/legal/personal-data)).

## Когда использовать

✅ Подходит:

- **OSINT-расследования** с десятками и сотнями ссылок из разных источников.
- **Совместная работа** через Google Sheets или Atlos — участникам не нужно работать с командной строкой.
- **Регулярная архивация** ссылок с метаданными и хешами.

❌ Не подходит:

- **Один URL** — проще [Save Page Now](/kb/instruments/tools/wayback-api); [archive.today](/kb/instruments/tools/archive-ph) — только как дополнительная копия.
- **Полная архивация большого сайта** — нужен [Browsertrix Crawler](/kb/instruments/tools/browsertrix), [wget](/kb/instruments/tools/wget) или [wparc](/kb/instruments/ruarxive-tools/wparc) (для WordPress).
- **Непрерывный мониторинг в реальном времени** — Auto-Archiver работает пакетно.

## Сравнение с аналогами

| Возможность | Auto-Archiver | Самописные скрипты | Browsertrix Crawler | ArchiveBot |
|:---|:-:|:-:|:-:|:-:|
| Несколько источников ссылок | ✅ CLI, CSV, Sheets, Atlos | ⚠️ только код | ⚠️ список URL | ⚠️ команды в IRC |
| Разные модули под тип ссылки | ✅ | ⚠️ | ❌ | ❌ |
| Метаданные и хеши автоматически | ✅ | ⚠️ | ⚠️ | ❌ |
| Формат | файлы + JSON, WACZ через модуль | любой | WARC/WACZ | WARC |
| Простота для нетехнических пользователей | ✅ (через Sheets) | ❌ | ⚠️ | ⚠️ нужен доступ к IRC и одобрение оператора |
| Бесплатный | ✅ | ✅ | ✅ | ✅ |

## Ресурсы

- [Репозиторий на GitHub](https://github.com/bellingcat/auto-archiver)
- [Документация](https://auto-archiver.readthedocs.io/en/latest/) и [страница о конфигурации](https://auto-archiver.readthedocs.io/en/latest/installation/configurations.html)
- [Bellingcat: статья об инструменте (2022)](https://www.bellingcat.com/resources/2022/09/22/preserve-vital-online-content-with-bellingcats-auto-archiver-tool/)
- [Bellingcat: «The Open Source Tool That Has Preserved 150,000 Pieces of Online Evidence» (2025)](https://www.bellingcat.com/resources/2025/08/13/the-open-source-tool-that-has-preserved-150000-pieces-of-online-evidence/)

## Связанные материалы

- [Browsertrix](/kb/instruments/tools/browsertrix) — для WACZ-архивов сайтов.
- [yt-dlp](/kb/instruments/tools/yt-dlp) — для видео.
- [Wget](/kb/instruments/tools/wget) — базовый краулер.
- [Wayback Machine API](/kb/instruments/tools/wayback-api) — для проверки в Wayback.
- [Социальные сети](/kb/instruments/social-media) — ручные методы по платформам.
- [Ландшафт 2026](/kb/instruments/landscape-2026) — место Auto-Archiver в общей картине.
