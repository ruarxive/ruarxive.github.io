---
title: Архивация видео (YouTube и др.)
description: "Краткий обзор архивации видео с YouTube, Rutube, VK Видео и других платформ: основной инструмент — yt-dlp, подробности — на отдельных страницах."
last_update:
  date: 2026-10-12
---

# Архивация видео (YouTube и др.)

Для сохранения видеоконтента стандартом де-факто является **[yt-dlp](/kb/instruments/tools/yt-dlp)** — активно развивающийся форк youtube-dl, который поддерживает YouTube, Rutube, VK Видео, TikTok, Vimeo и тысячи других сайтов.

## Минимальный пример

```bash
pip install yt-dlp

# Видео с описанием, метаданными в JSON, субтитрами и обложкой
yt-dlp --write-description --write-info-json --write-subs --write-thumbnail URL

# Канал целиком с журналом уже скачанных видео
yt-dlp --download-archive archive.txt "https://www.youtube.com/@ChannelHandle/videos"
```

Опция `--download-archive` запоминает скачанные видео и пропускает их при повторном запуске. Комментарии сохраняются в `*.info.json` при указании `--write-comments`.

## Где подробнее

- **[yt-dlp](/kb/instruments/tools/yt-dlp)** — установка, рекомендуемые флаги для архивации, работа с каналами и плейлистами.
- **[Как сохранить видео с YouTube](/kb/instruments/data-take-out/dto-youtube)** — графические программы для тех, кто не работает с командной строкой, и выгрузка собственного канала через Google Takeout.
- **[Rutube](/kb/instruments/social-media/rutube)** и **[TikTok](/kb/instruments/social-media/tiktok)** — особенности этих платформ.
- **[Google Takeout](/kb/instruments/data-take-out/dto-google)** — выгрузка оригиналов видео, загруженных в собственный канал.
