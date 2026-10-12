---
title: DVD (David Video Downloader)
sidebar_label: DVD
description: "GUI-приложение для macOS поверх yt-dlp с drag&drop и удобной очередью загрузок."
last_updated: 2026-10-12
keywords: [dvd, david video downloader, macos, gui, yt-dlp]
---

# DVD (David Video Downloader)

[DVD](https://github.com/dsheeler525/dvd) (David Video Downloader) — GUI-обёртка над [yt-dlp](/kb/instruments/tools/yt-dlp) для **macOS**. Минималистичный интерфейс: drag&drop URL, очередь загрузок.

## Когда использовать

✅ Подходит, если:

- вы работаете в **macOS** и хотите простой GUI поверх yt-dlp;
- нужна **drag&drop** функциональность;
- важна **нативная интеграция** с системой (иконки, уведомления).

❌ Не подходит:

- для Windows/Linux — нет сборки;
- для продвинутых сценариев (тонкая настройка форматов) — нативный yt-dlp будет точнее.

## Установка

```bash
# Через Homebrew
brew install david-video-downloader
```

Или скачать `.dmg` с [GitHub релизов](https://github.com/dsheeler525/dvd/releases).

## Ключевые функции

- **drag&drop URL**: перетащите ссылку из браузера в окно DVD.
- **Очередь**: видео ставятся в очередь и качаются последовательно (или параллельно, по настройкам).
- **Выбор качества**: автоматически или вручную.
- **Сохраняет метаданные и субтитры**.
- **Импорт cookie** (например, если у вас платный аккаунт YouTube, что требует особого обращения).

## Связанные материалы

- **[GUI-обёртки yt-dlp](/kb/instruments/tools/youtube-dl-gui)** — обзор альтернатив.
- **[yt-dlp](/kb/instruments/tools/yt-dlp)** — базовый CLI.

## Источник

- [Публикация в Telegram-канале Ruarxive #10 (07.03.2022)](https://t.me/ruarxive/10).
