---
title: Hitomi Downloader
sidebar_label: Hitomi Downloader
description: "Hitomi Downloader — GUI-загрузчик изображений, видео и текстов для Windows. С марта 2026 года репозиторий заблокирован GitHub по DMCA-уведомлению; используйте yt-dlp и gallery-dl."
last_update:
  date: 2026-10-12
keywords: [hitomi-downloader, gui, медиа-загрузчик, dmca, windows]
---

# Hitomi Downloader

:::warning Репозиторий заблокирован по DMCA
С 30 марта 2026 года репозиторий `github.com/KurtBestor/Hitomi-Downloader` недоступен: GitHub заблокировал его (HTTP 451) по [DMCA-уведомлению от 23.03.2026](https://github.com/github/dmca/blob/master/2026/03/2026-03-23-fakku.md). Официального источника для загрузки и обновлений больше нет, а сборки с неофициальных сайтов могут содержать вредоносный код. Для новых задач используйте [yt-dlp](/kb/instruments/tools/yt-dlp) (видео) и [gallery-dl](/kb/instruments/tools/gallery-dl) (изображения и галереи).
:::

Hitomi Downloader — программа с графическим интерфейсом для Windows, которая скачивает изображения, видео и тексты с десятков сайтов. Для большинства сайтов в ней были собственные экстракторы, для остальных использовался yt-dlp.

Последний снимок страницы репозитория перед блокировкой сохранён в [Wayback Machine](https://web.archive.org/web/20260329141519/https://github.com/KurtBestor/Hitomi-Downloader) (29.03.2026).

## Возможности (по README на март 2026 года)

- многопоточная загрузка (до 24 потоков в одной задаче) и ограничение скорости;
- видео в форматах M3U8 и MPD, загрузка через BitTorrent и magnet-ссылки;
- пользовательские скрипты, отслеживание буфера обмена, портативная версия;
- собственные экстракторы для pixiv, DeviantArt, ArtStation, Flickr, Imgur, Tumblr, Twitter, Instagram, Weibo, bilibili, Niconico, Naver и других сайтов, а также поддержка сайтов из списка yt-dlp.

## Когда использовать

Устанавливать Hitomi Downloader заново не рекомендуется: официального канала распространения нет. Если программа уже установлена, её можно использовать для разовых задач, но её экстракторы больше не обновляются и со временем перестают работать.

Альтернативы:

- **[yt-dlp](/kb/instruments/tools/yt-dlp)** — видео и аудио с тысяч сайтов, есть [GUI-обёртки](/kb/instruments/tools/youtube-dl-gui);
- **[gallery-dl](/kb/instruments/tools/gallery-dl)** — изображения и галереи (pixiv, DeviantArt, Tumblr, Instagram и др.), поддерживает список URL через `-i` и учёт скачанного через `--download-archive`.

## Связанные материалы

- **[GUI-обёртки yt-dlp](/kb/instruments/tools/youtube-dl-gui)** — общий обзор альтернатив.
- **[yt-dlp](/kb/instruments/tools/yt-dlp)** — базовый CLI.

## Источник

- [Публикация в Telegram-канале Ruarxive #10 (07.03.2022)](https://t.me/ruarxive/10) — подборка инструментов для сохранения видео с YouTube.
