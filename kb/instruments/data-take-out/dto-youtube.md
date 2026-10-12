---
sidebar_position: 3
last_update:
  date: 2026-10-12
title: Как сохранить видео файлы с Youtube
description: "Как сохранить видео с YouTube: yt-dlp как основной инструмент, графические программы на его основе, статус старых программ из подборки 2022 года и выгрузка собственного канала через Google Takeout."
---

# Как сохранить видео файлы с Youtube

Для архивации видео с YouTube есть программы разного уровня сложности: утилиты командной строки, графические приложения, мобильные приложения. Основа почти всех современных решений — **[yt-dlp](/kb/instruments/tools/yt-dlp)**.

Архивация видео требует много места на диске: заранее оцените объём канала или плейлиста и выберите нужное качество.

## Выгрузка собственного канала

Если нужно сохранить видео, загруженные на **ваш** канал, используйте [Google Takeout](/kb/instruments/data-take-out/dto-google): раздел YouTube выгружает загруженные видео, плейлисты, комментарии, подписки и историю просмотров. Если канал привязан к аккаунту бренда, перед выгрузкой переключитесь на этот аккаунт.

## Утилиты командной строки

### yt-dlp (рекомендуется)

[yt-dlp](https://github.com/yt-dlp/yt-dlp) — активно развивающийся форк youtube-dl, поддерживает YouTube и тысячи других сайтов, сохраняет метаданные, субтитры, обложки и комментарии.

```bash
pip install yt-dlp
yt-dlp --write-info-json --write-subs --write-thumbnail \
       --download-archive archive.txt "https://www.youtube.com/@ChannelHandle/videos"
```

Подробнее — на странице [yt-dlp](/kb/instruments/tools/yt-dlp) и в обзоре [Архивация видео](/kb/instruments/social-media/youtube-video).

### youtube-dl

[youtube-dl](https://ytdl-org.github.io/youtube-dl/index.html) — исходный проект, с которого начинались все эти инструменты. Последний официальный релиз вышел в декабре 2021 года; для архивации сейчас стоит использовать yt-dlp.

## Графические приложения

### Open Video Downloader

![Data take out Youtube: Open Video Downloader](/images/image9.png)

[Open Video Downloader](https://jely2002.github.io/youtube-dl-gui/) ([GitHub](https://github.com/jely2002/youtube-dl-gui)) — кроссплатформенное приложение (Windows, macOS, Linux) с графическим интерфейсом над yt-dlp. Возможности:

- загрузка видео, аудио, субтитров и метаданных с сотен сайтов;
- выбор разрешения, частоты кадров и формата;
- загрузка плейлистов целиком;
- шаблоны имён файлов;
- авторизация через файлы cookies браузера;
- автоматическое обновление приложения и yt-dlp.

### Media Downloader

![Data take out Youtube: Media DownLoader](/images/image11.png)

[Media Downloader](https://github.com/mhogomchungu/media-downloader) — графический интерфейс на Qt/C++ для нескольких консольных загрузчиков. По умолчанию работает с yt-dlp, другие инструменты подключаются расширениями. Поддерживает параллельные и пакетные загрузки (список ссылок из файла) и отслеживание плейлистов.

### dvd (Android)

[dvd](https://github.com/yausername/dvd) — приложение для Android на основе библиотеки [youtubedl-android](https://github.com/yausername/youtubedl-android). APK — на [странице релизов](https://github.com/yausername/dvd/releases) (страница приложения в каталоге F-Droid, указанная в README, на момент проверки недоступна). Последние изменения в репозитории — октябрь 2023 года.

## Устаревшие и недоступные программы

Эти программы упоминались в [публикации Ruarxive #10](https://t.me/ruarxive/10) (март 2022 года), но сейчас не рекомендуются:

### youtube-dlG

![Data take out Youtube: dlG](/images/image8.png)

[youtube-dlG](https://github.com/MrS0m30n3/youtube-dl-gui) — графический интерфейс к youtube-dl на wxPython. Не обновляется с декабря 2022 года.

### FireDM

Менеджер загрузок на Python с поддержкой видео через youtube-dl/yt-dlp. Репозиторий `firedm/FireDM` на GitHub удалён (адрес возвращает ошибку 404). Подробнее: [FireDM](/kb/instruments/tools/firedm).

### Hitomi Downloader

Утилита для скачивания изображений, видео и текста с десятков сайтов. Репозиторий `KurtBestor/Hitomi-Downloader` заблокирован GitHub по жалобе DMCA с 30 марта 2026 года. Подробнее: [Hitomi Downloader](/kb/instruments/tools/hitomi-downloader).

Для тех же задач используйте [yt-dlp](/kb/instruments/tools/yt-dlp) и [gallery-dl](/kb/instruments/tools/gallery-dl).

## Связанные материалы

- [yt-dlp](/kb/instruments/tools/yt-dlp)
- [Графические интерфейсы для загрузчиков видео](/kb/instruments/tools/youtube-dl-gui)
- [Google Takeout](/kb/instruments/data-take-out/dto-google)
- [Data Take-Out: обзор](/kb/instruments/data-take-out/data-take-out-main)
