---
title: Архивация YouTube
sidebar_label: YouTube
description: "Архивация видео и каналов YouTube через yt-dlp: метаданные, субтитры, журнал скачанного, зависимости Deno и EJS, замедление в РФ."
last_update:
  date: 2026-10-28
keywords: [youtube, видео, yt-dlp, deno, po-token]
---

# Архивация YouTube

Для сохранения видеоконтента стандартом де-факто является **[yt-dlp](/kb/instruments/tools/yt-dlp)** — активно развивающийся форк youtube-dl, который поддерживает YouTube, Rutube, VK Видео, TikTok, Vimeo и тысячи других сайтов.

## Минимальный пример

```bash
python3 -m pip install -U "yt-dlp[default]"
# для YouTube нужна ещё JavaScript-среда Deno (https://deno.com) и ffmpeg,
# например: brew install deno ffmpeg

# Видео с описанием, метаданными в JSON, субтитрами и обложкой
yt-dlp --write-description --write-info-json --write-subs --write-thumbnail URL

# Канал целиком с журналом уже скачанных видео
yt-dlp --download-archive archive.txt "https://www.youtube.com/@ChannelHandle/videos"
```

Опция `--download-archive` запоминает скачанные видео и пропускает их при повторном запуске. Комментарии сохраняются в `*.info.json` при указании `--write-comments`.

С конца 2025 года yt-dlp без внешней JavaScript-среды (по умолчанию Deno) и компонента EJS работает с YouTube неполно. Установка через `yt-dlp[default]` или официальный бинарник уже включает EJS, Deno ставится отдельно. Некоторым клиентам YouTube нужен PO Token. Подробнее — в разделе «Зависимости» на странице [yt-dlp](/kb/instruments/tools/yt-dlp#зависимости).

В России YouTube с 2024 года работает с сильным замедлением: закладывайте на большие выгрузки больше времени и используйте `--download-archive`, чтобы прерванную загрузку можно было продолжить.

## Где подробнее

- **[yt-dlp](/kb/instruments/tools/yt-dlp)** — установка, рекомендуемые флаги для архивации, работа с каналами и плейлистами.
- **[Как сохранить видео с YouTube](/kb/instruments/data-take-out/dto-youtube)** — графические программы для тех, кто не работает с командной строкой, и выгрузка собственного канала через Google Takeout.
- **[Rutube](/kb/instruments/social-media/rutube)** и **[TikTok](/kb/instruments/social-media/tiktok)** — особенности этих платформ.
- **[Google Takeout](/kb/instruments/data-take-out/dto-google)** — выгрузка оригиналов видео, загруженных в собственный канал.
