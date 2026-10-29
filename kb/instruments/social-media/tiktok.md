---
title: Архивация TikTok
sidebar_label: TikTok
description: "Методы архивации видео и аккаунтов TikTok: yt-dlp, gallery-dl, неофициальная библиотека TikTokApi, браузерная архивация и официальный Research API для одобренных исследователей."
last_update:
  date: 2026-10-29
keywords: [tiktok, archive, video, social, bytedance, research-api]
---

# Архивация TikTok

TikTok — видеоплатформа компании ByteDance. Для публичных видео основной инструмент — [yt-dlp](/kb/instruments/tools/yt-dlp). Официальный доступ к данным для исследователей есть (Research API), но только для одобренных академических и некоммерческих организаций из ограниченного списка стран. Сама платформа активно противодействует массовой выгрузке.

С 6 марта 2022 года TikTok приостановил для пользователей в России публикацию новых видео и прямые эфиры, сославшись на новый закон о «фейках».

В США с января 2026 года TikTok, CapCut и Lemon8 обслуживает совместное предприятие TikTok USDS Joint Venture. Данные американских пользователей хранятся в облаке Oracle в США ([TikTok Newsroom, 23.01.2026](https://newsroom.tiktok.com/announcement-from-the-new-tiktok-usds-joint-venture-llc?lang=en)). Условия Research API на октябрь 2026 года об этом не упоминают: академические организации США по-прежнему в списке допущенных.

> **Предупреждение:** TikTok часто меняет внутренние интерфейсы, и неофициальные методы могут перестать работать без предупреждения. Проверяйте работоспособность перед началом проекта.

## Методы

### 1. yt-dlp (рекомендуется)

[yt-dlp](https://github.com/yt-dlp/yt-dlp) поддерживает отдельные видео, профили пользователей, хэштеги, звуки, коллекции и прямые эфиры TikTok.

```bash
pip install yt-dlp

# Одно видео
yt-dlp "https://www.tiktok.com/@username/video/1234567890123456789"

# Все видео профиля с метаданными, обложками и комментариями
yt-dlp --download-archive tiktok-archive.txt \
  --write-info-json \
  --write-comments \
  --write-thumbnail \
  --write-description \
  -o "%(uploader)s/%(id)s.%(ext)s" \
  "https://www.tiktok.com/@username"

# Запись идущего прямого эфира (с момента запуска команды)
yt-dlp "https://www.tiktok.com/@username/live"
```

Что сохраняется: видео, обложка, описание, метаданные в `*.info.json`, комментарии (если TikTok их отдаёт).

Ограничения:

- при частых запросах TikTok временно блокирует доступ — делайте паузы между запусками;
- для части видео (возрастные ограничения, закрытые аккаунты) нужна авторизация через `--cookies-from-browser`.

> Возможности сверены с исходным кодом экстрактора TikTok в yt-dlp 2026.08.19 (октябрь 2026).

### 2. gallery-dl

[gallery-dl](/kb/instruments/tools/gallery-dl) умеет скачивать профили, отдельные посты (включая фото-карусели), репосты и Stories TikTok. Удобен для постов с изображениями, которые yt-dlp обрабатывает хуже.

### 3. TikTokApi (неофициальная библиотека)

[TikTokApi](https://github.com/davidteather/TikTok-Api) — Python-обёртка над внутренним API TikTok. Текущая версия (7.x) асинхронная и для работы требует cookie `ms_token` из браузера и Playwright.

```bash
pip install TikTokApi
python -m playwright install
```

```python
import asyncio
import os

from TikTokApi import TikTokApi

ms_token = os.environ.get("ms_token")  # значение cookie msToken с tiktok.com


async def main():
    async with TikTokApi() as api:
        await api.create_sessions(ms_tokens=[ms_token], num_sessions=1, sleep_after=3)
        user = api.user("username")
        async for video in user.videos(count=30):
            print(video.id, video.as_dict.get("desc"))


asyncio.run(main())
```

Ограничения: зависит от внутренних интерфейсов TikTok, может сломаться после любого обновления платформы; при интенсивном использовании срабатывает защита от ботов. Пример основан на `examples/user_example.py` из репозитория (версия 7.3.3).

### 4. Wayback Machine и ArchiveTeam

Проверьте, нет ли сохранённого снимка видео или профиля в [Wayback Machine](https://web.archive.org/). Сведения о проектах ArchiveTeam по TikTok — на [вики ArchiveTeam](https://wiki.archiveteam.org/index.php/TikTok).

```bash
curl "https://archive.org/wayback/available?url=tiktok.com/@username/video/1234567890123456789"
```

### 5. Браузерная архивация (Browsertrix)

Для сохранения веб-страницы профиля в WARC/WACZ:

```bash
docker run -v $PWD/crawls:/crawls/ -it webrecorder/browsertrix-crawler crawl \
  --url "https://www.tiktok.com/@username" \
  --pageLimit 50 \
  --generateWACZ \
  --collection tiktok-username
```

Плюс — сохраняется внешний вид страницы. Минус — видео сохраняются не всегда полностью; для самих файлов надёжнее yt-dlp.

### 6. Официальный Research API

[TikTok Research Tools](https://developers.tiktok.com/products/research-api/) дают доступ к публичным данным о видео, комментариях и аккаунтах:

- **видео** — доступные всем публикации, число лайков и комментариев, расшифровка речи, субтитры, время создания и длительность;
- **комментарии** — текст, число лайков и ответов, время публикации;
- **аккаунты** — описание профиля, аватар, понравившиеся, репостнутые и закреплённые видео, подписчики и подписки.

Кто может подать заявку: исследователи академических организаций США, ЕЭЗ, Великобритании, Швейцарии и Канады, некоммерческие исследовательские организации ЕС, а также организации Бразилии, изучающие безопасность детей в интернете. Нужны описание исследования, этическая экспертиза и независимость от коммерческих интересов; ответ обычно приходит в течение 4 недель. Отдельно действует доступ для проверенных исследователей по Закону ЕС о цифровых услугах (DSA).

Research API даёт метаданные, но не видеофайлы, поэтому для архивации самих видео он не подходит.

## Что нельзя получить

- **Личные сообщения** — не публичны, недоступны ни одним из методов.
- **Закрытые аккаунты** — только с авторизацией пользователя, у которого есть доступ.
- **Удалённые видео** — только если они ранее попали в Wayback Machine или другие архивы.

## Юридические аспекты

:::warning
Условия использования TikTok запрещают автоматический сбор данных без разрешения. Перед архивацией оцените:

- цель архивирования (научная, журналистская, общественно значимая);
- применимое право (законы РФ, ЕС, США различаются);
- [персональные данные](/kb/legal/personal-data) авторов и людей в кадре.
:::

Подробнее: [Правовые вопросы](/kb/legal/copyright).

## Хранение архива

- Сохраняйте `*.info.json` рядом с каждым видео — там исходный URL, автор, дата и статистика.
- Ведите файл `--download-archive`, чтобы повторные запуски докачивали только новое.
- Паспорт сбора и контрольные суммы — по [методике](/kb/instruments/social-media/methodology#хранение).

## Ресурсы

- [yt-dlp](https://github.com/yt-dlp/yt-dlp)
- [TikTokApi](https://github.com/davidteather/TikTok-Api)
- [TikTok Research Tools](https://developers.tiktok.com/products/research-api/)
- [Документация Research Tools](https://developers.tiktok.com/doc/about-research-api)
- [ArchiveTeam: TikTok](https://wiki.archiveteam.org/index.php/TikTok)

## Связанные материалы

- [Архивация YouTube](/kb/instruments/social-media/youtube-video) — те же приёмы yt-dlp
- [yt-dlp — детальная страница](/kb/instruments/tools/yt-dlp)
- [gallery-dl](/kb/instruments/tools/gallery-dl)
- [Социальные сети — обзор](/kb/instruments/social-media)
- [Методика архивации соцсетей](/kb/instruments/social-media/methodology)
- [Data Take-Out: обзор](/kb/instruments/data-take-out/data-take-out-main)
- [Правовые вопросы](/kb/legal/copyright)
- [Ландшафт 2026](/kb/instruments/landscape-2026)
