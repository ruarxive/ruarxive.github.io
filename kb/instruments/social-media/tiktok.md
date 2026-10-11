---
title: Архивация TikTok
sidebar_label: TikTok
description: "Методы архивации видео, аккаунтов и трендов в TikTok. yt-dlp, snscrape, официальный API, ограничения китайской группы ByteDance."
last_updated: 2026-11-09
keywords: [tiktok, archive, video, social, bytedance]
---

# Архивация TikTok

TikTok — видеоплатформа от ByteDance, особенно значимая для архивации в контексте молодёжной культуры, музыки, политики и войны-в-Украине. К сожалению, **официального API для исследователей не существует**, а сам сервис активно блокирует массовую выгрузку. Ниже — методы, которые работают в 2026 году, с честной оценкой их ограничений.

> **Предупреждение:** правила TikTok ужесточаются каждый год. Любой метод может перестать работать через 3–6 месяцев. Всегда проверяйте актуальное состояние перед архивацией.

## Зачем архивировать TikTok

- **Военная информация и документация событий.** TikTok активно использовался обеими сторонами конфликта.
- **Этнография молодёжной культуры и мемы** — текстовые форматы не сохраняют.
- **Маркетинговые тренды и вирусный контент.**
- **Музыкальные релизы** — артисты часто сначала выпускают в TikTok.
- **Новости в реальном времени** (соревнование с Reels, Shorts).

## Методы

### 1. yt-dlp (рекомендуется)

[youtube-dl](https://github.com/ytdl-org/youtube-dl) / [yt-dlp](https://github.com/yt-dlp/yt-dlp) — основной инструмент для одного аккаунта или видео. Поддерживает TikTok из коробки с 2022 года.

```bash
# Установка
pip install yt-dlp

# Скачать одно видео
yt-dlp 'https://www.tiktok.com/@username/video/1234567890123456789'

# Скачать всё видео из профиля
yt-dlp 'https://www.tiktok.com/@username'

# Скачать с метаданными, обложкой, субтитрами
yt-dlp \
  --write-info-json \
  --write-comments \
  --write-thumbnail \
  --write-description \
  --write-subs \
  --convert-subs srt \
  -o '%(uploader)s/%(title)s.%(ext)s' \
  'https://www.tiktok.com/@username'
```

**Поддерживаемые форматы:**

- Видео в максимальном качестве (по умолчанию) или mp4/h264.
- Обложка (jpg).
- Описание.
- Метаданные в JSON.
- Комментарии (--write-comments, могут быть недоступны).
- Геометки (--write-info-json содержит place).
- Субтитры (с автоматической генерацией).

**Лимиты yt-dlp:**

- ~50–100 видео/день с одного IP без бана.
- Cookie могут потребоваться для просмотра возрастных аккаунтов.
- Stories/lives не поддерживаются полноценно.
- «Private» аккаунты недоступны без аутентификации.

### 2. TikTok-Data-Puller / TikTok-Api (Python)

Несколько Python-обёрток над неофициальным API TikTok (reverse-engineered):

```bash
pip install TikTokApi
```

```python
from TikTokApi import TikTokApi

api = TikTokApi()
user = api.user(username="example")
for video in user.videos(count=30):
    print(video.id, video.desc)
```

**Ограничения:**

- Зависит от внутренних эндпойнтов — могут сломаться без предупреждения.
- Нет гарантий работы с аккаунтов для подписок.
- Может попасть в anti-bot при слишком частом использовании.

### 3. snscrape (legacy)

[snscrape](https://github.com/JustAnotherArchivist/snscrape) — универсальный скрейпер соцсетей. Поддержка TikTok объявлена устаревшей в 2024 году, но для малых объёмов всё ещё работает.

```bash
pip install snscrape

snscrape tiktok-user username
snscrape tiktok-search "python tutorial"
```

**⚠️ Внимание:** snscrape официально не поддерживается с 2024 года и не возвращает видео — только метаданные.

### 4. Archive Team (Wayback Machine)

ArchiveTeam также собирает TikTok через свои краулеры и кладёт в [Wayback Machine](https://web.archive.org/). Для исследователя это простой fallback: проверить, не было ли публичного снимка видео или профиля.

```bash
# Проверка наличия в Wayback
curl 'https://archive.org/wayback/available?url=tiktok.com/@username/video/12345'
```

### 5. Браузерный кроулер (Browsertrix / Squidwarc)

Для веб-версии TikTok:

```bash
# Через Browsertrix — собрать страницу профиля с превью видео
browsertrix-crawler crawl \
  --url 'https://www.tiktok.com/@username' \
  --browserWindow 1 \
  --scopePageLimit 50 \
  --collection tiktok-username
```

**Плюс:** все видео в виде веб-страницы.
**Минус:** только превью-видео, не сами MP4-файлы.

### 6. Официальный Research API (для академии)

В 2024 году TikTok запустил закрытую программу [TikTok Research API](https://developers.tiktok.com/research-api) для академических исследователей. Доступ через заявку; одобрение занимает 2–4 месяца.

**Что даёт:**

- Поиск по хэштегам, ключевым словам.
- Метаданные видео, комментарии, статистика аккаунтов.
- Никаких медиа-файлов (только метаданные).

**Не подходит для:**

- Архивирования самих видео.
- Непрерывной загрузки.
- Журналистов и не-академических исследователей.

## Что нельзя получить

- **Прямой эфир TikTok** — сохранить можно только с локального браузера через [ffmpeg + XSplit](https://obsproject.com/), в автоматическом режиме не получится.
- **DMs** — не публичны, не подходят ни одному методу.
- **Данные до 2022 года** — многие методы сломались с обновлениями API.

## Юридические аспекты

> [!WARNING]
> TikTok явно запрещает массовую автоматическую выгрузку в своих Terms of Service. Перед архивацией проверьте:
>
> - Цель архивирования (академическая, журналистская, общественная польза).
> - Юрисдикция (законы РФ, ЕС, США различаются).
> - ToS платформы и условия использования контента.

Подробнее: [Правовые вопросы](/kb/legal/copyright).

## Хранение архива

Типичный профиль в TikTok (30 видео) — 300 МБ – 1 ГБ. Хэштег с тысячами видео — десятки ГБ.

**Рекомендации:**

- S3 Standard для «горячих» архивов.
- Backblaze B2 для холодного хранения.
- Верификация хешей SHA-256 после скачивания.

## Когда использовать

✅ Подходит:

- **Архивирование конкретных видео** — yt-dlp.
- **Архивирование профиля целиком** — yt-dlp с правильными флагами.
- **OSINT-расследование** — yt-dlp или TikTokApi (осторожно с rate-limit).
- **Академическое исследование** — TikTok Research API.
- **Юридическое доказательство** — yt-dlp + хеш в метаданных + сертификация.

❌ Не подходит:

- **Массовое сохранение миллионов видео** — ни один из методов не рассчитан.
- **Real-time мониторинг** — нужен кастомный пайплайн.
- **Stories** — yt-dlp ограниченно.
- **Закрытые аккаунты без аутентификации** — не получится никак.

## Ресурсы

- [TikTokApi Python library](https://github.com/davidteather/TikTok-Api)
- [yt-dlp документация по TikTok](https://github.com/yt-dlp/yt-dlp/blob/master/README.md#tiktok)
- [ArchiveTeam TikTok](https://wiki.archiveteam.org/index.php?title=TikTok)
- [TikTok Research API](https://developers.tiktok.com/research-api)
- [snscrape legacy](https://github.com/JustAnotherArchivist/snscrape)

## Связанные материалы

- [Архивация видео — общая страница](/kb/instruments/social-media/youtube-video)
- [yt-dlp — детальная страница](/kb/instruments/tools/yt-dlp)
- [Галерея загрузчиков (gallery-dl)](/kb/instruments/tools/gallery-dl)
- [Социальные сети — обзор](/kb/instruments/social-media)
- [Data Take-Out: обзор](/kb/instruments/data-take-out/data-take-out-main)
- [Правовые вопросы](/kb/legal/copyright) — что законно.
- [Ландшафт 2026](/kb/instruments/landscape-2026) — место TikTok.
