---
title: GUI-обёртки для yt-dlp и youtube-dl
sidebar_label: GUI-обёртки yt-dlp
description: "Графические программы поверх yt-dlp и youtube-dl: Open Video Downloader, youtube-dlG, dvd для Android, FireDM и Hitomi Downloader — что из них живо в 2026 году."
last_update:
  date: 2026-10-12
keywords: [yt-dlp, youtube-dl, open video downloader, youtube-dlg, dvd, hitomi, firedm, gui, скачивание видео]
---

# GUI-обёртки для yt-dlp и youtube-dl

[yt-dlp](/kb/instruments/tools/yt-dlp) — консольный инструмент. Для тех, кто не работает в командной строке, есть графические оболочки:

- визуальный интерфейс: вставили ссылку и скачали;
- очередь загрузок с прогрессом;
- выбор качества, формата, субтитров.

## Когда использовать

✅ Подходит, если:

- вы работаете с волонтёрами, не знакомыми с командной строкой;
- нужно быстро скачать отдельные видео с YouTube и других платформ.

❌ Не подходит:

- для скриптов и конвейеров: используйте [yt-dlp](/kb/instruments/tools/yt-dlp) напрямую;
- для регулярной архивации каналов с `--download-archive` и полным набором метаданных.

## Сравнение

Список составлен по [посту Ruarxive #10 (07.03.2022)](https://t.me/ruarxive/10). Состояние проектов проверено в октябре 2026 года.

| Программа | Платформа | Основа | Состояние (октябрь 2026) |
|---|---|---|---|
| **[Open Video Downloader](https://github.com/jely2002/youtube-dl-gui)** (youtube-dl-gui) | Windows, macOS, Linux | yt-dlp; Rust + Tauri + Vue | ✅ Активен (версия 3.2.1, июль 2026) |
| **[youtube-dlG](https://github.com/MrS0m30n3/youtube-dl-gui)** | Windows, Linux | youtube-dl; Python + wxPython | ⚠️ Не развивается (последние изменения — 2022) |
| **[dvd](https://github.com/yausername/dvd)** | Android | youtube-dl через youtubedl-android; Kotlin | ⚠️ Не развивается (последние изменения — 2022) |
| **[FireDM](https://pypi.org/project/FireDM/)** | Windows, Linux | youtube-dl / yt-dlp, pycurl; Python + Tkinter | ❌ Репозиторий удалён; последний релиз на PyPI — 2022.4.14 |
| **Hitomi Downloader** | Windows | собственные экстракторы | ❌ Репозиторий заблокирован на GitHub по DMCA с 30.03.2026 |

## Open Video Downloader

Основной живой вариант. Кроссплатформенное приложение (ранее на Electron, сейчас на Rust и Tauri) с интерфейсом над yt-dlp. Возможности по README:

- скачивание видео или только аудио;
- субтитры и метаданные;
- выбор разрешения, частоты кадров и формата (MP4, MKV);
- плейлисты целиком;
- шаблоны имён файлов;
- cookies из браузера, базовая авторизация, пароли к видео;
- автоматическое обновление приложения и yt-dlp.

Установщики для Windows, macOS (Intel и Apple Silicon) и Linux (AppImage, deb) — на [странице релизов](https://github.com/jely2002/youtube-dl-gui/releases). Форк `StefanLobbenmeier/youtube-dl-gui` — это ответвление старой Electron-версии, а не основной проект.

## youtube-dlG

Кроссплатформенный интерфейс на wxPython над youtube-dl. Последний релиз — 0.4 (2017), в README указан Python 2.7; репозиторий не развивается с 2022 года. Программа работает со старым youtube-dl, поэтому с YouTube и многими сайтами, скорее всего, будут ошибки. Для новых задач берите Open Video Downloader.

## dvd

[dvd](https://github.com/yausername/dvd) — Android-приложение для скачивания видео с сайтов, которые поддерживает youtube-dl. Построено на библиотеке [youtubedl-android](https://github.com/yausername/youtubedl-android). APK — на [странице релизов](https://github.com/yausername/dvd/releases). Проект не развивается, а встроенный youtube-dl устаревает.

## FireDM и Hitomi Downloader

Обе программы упоминались в исходном посте, но сейчас рекомендовать их нельзя:

- **FireDM** — менеджер загрузок на Python (Tkinter, pycurl) с поддержкой youtube-dl и yt-dlp. Репозиторий `firedm/FireDM` удалён; на PyPI остался пакет версии 2022.4.14 со старой встроенной логикой загрузки видео.
- **Hitomi Downloader** — загрузчик изображений, видео и текста с десятков сайтов. Репозиторий `KurtBestor/Hitomi-Downloader` с 30.03.2026 недоступен: GitHub заблокировал его по DMCA-уведомлению. Скачивать сборки из сторонних источников небезопасно.

## Практические советы

1. **Доверие к источникам.** Берите программы только из официальных репозиториев и магазинов. «Дистрибутивы» с непроверенных сайтов — частый способ распространения вредоносного ПО.
2. **Правила платформ и авторские права.** Скачивание с YouTube и других платформ ограничено их условиями использования. Перед архивацией изучите [правовые вопросы](/kb/legal/copyright).
3. **Формат.** Для архива сохраняйте исходные дорожки без перекодирования и включайте сохранение метаданных и субтитров, если программа это позволяет.

## Связанные материалы

- **[yt-dlp](/kb/instruments/tools/yt-dlp)** — консольная утилита, на которой работают современные оболочки.
- **[dvd](/kb/instruments/tools/dvd)**, **[FireDM](/kb/instruments/tools/firedm)**, **[Hitomi Downloader](/kb/instruments/tools/hitomi-downloader)** — отдельные страницы.
- **[Data Take Out YouTube](/kb/instruments/data-take-out/dto-youtube)** — выгрузка своих данных через Google.
- **[Кейсы](/kb/case-studies)** — примеры проектов.

## Источник

- [Публикация в Telegram-канале Ruarxive #10 (07.03.2022)](https://t.me/ruarxive/10) — обзор GUI-оболочек.
