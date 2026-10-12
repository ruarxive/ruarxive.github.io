---
title: FireDM
sidebar_label: FireDM
description: "Кросс-платформенная GUI-загрузчик видео на Python+PyQt поверх youtube-dl/yt-dlp."
last_updated: 2026-10-12
keywords: [firedm, gui, python, media downloader]
---

# FireDM

[FireDM](https://github.com/firedm/FireDM) — открытый загрузчик медиа с GUI на основе Python+PyQt, работающий поверх youtube-dl / yt-dlp / собственных экстракторов.

## Когда использовать

✅ Подходит, если:

- нужен **кросс-платформенный** GUI (Windows / Linux / macOS);
- важен **открытый исходный код** без рекламы и трекеров;
- нужен лёгкий интерфейс без излишеств.

❌ Не подходит:

- для сложных сценариев с большой очередью и продвинутым планированием — лучше подходят [Hitomi Downloader](/kb/instruments/tools/hitomi-downloader) или CLI.

## Установка

```bash
pip install firedm
```

Или из исходников:

```bash
git clone https://github.com/firedm/FireDM.git
cd FireDM
pip install -r requirements.txt
python FireDM.py
```

## Возможности

- **Поддержка youtube-dl/yt-dlp** — все обновления форматов автоматические.
- **Докачка**: при обрыве связи файлы докачиваются.
- **Пакетная загрузка**: списки URL в txt.
- **Proxy**: HTTP / SOCKS / Tor.
- **CAPTCHA-обход**: некоторые виды простых капч.

## Связанные материалы

- **[GUI-обёртки yt-dlp](/kb/instruments/tools/youtube-dl-gui)** — общий обзор.
- **[yt-dlp](/kb/instruments/tools/yt-dlp)** — базовый CLI.

## Источник

- [Публикация в Telegram-канале Ruarxive #10 (07.03.2022)](https://t.me/ruarxive/10).
