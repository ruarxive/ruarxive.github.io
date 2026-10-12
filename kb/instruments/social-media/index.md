---
sidebar_position: 1
last_update:
  date: 2026-10-12
title: Архивация социальных сетей
description: "Обзор способов архивации социальных сетей и мессенджеров на 2026 год: какие API ещё доступны, какие инструменты устарели и чем их заменить."
---

# Архивация социальных сетей

Архивация социальных сетей за последние годы сильно усложнилась: большинство платформ закрыли или сделали платными свои API, а многие известные инструменты перестали развиваться. Ниже — обзор страниц раздела с учётом состояния на 2026 год.

## Обзор по платформам

| Платформа | Что работает сейчас | Страница |
| :--- | :--- | :--- |
| Twitter/X | Платный API v2 (оплата за каждый запрос), выгрузка собственного архива, Wayback Machine | [twarc](/kb/instruments/social-media/twarc), [выгрузка из X](/kb/instruments/data-take-out/dto-twitter) |
| Facebook | Выгрузка собственных данных, браузерная архивация, Meta Content Library для исследователей | [Facebook](/kb/instruments/social-media/facebook) |
| Instagram | Instaloader, gallery-dl, браузерная архивация, выгрузка собственных данных | [Instagram](/kb/instruments/social-media/instagram) |
| ВКонтакте | Официальный VK API (ключ пользователя или сервисный ключ), выгрузка собственных данных | [ВКонтакте](/kb/instruments/social-media/vk) |
| YouTube, Rutube, VK Видео | yt-dlp | [Видео](/kb/instruments/social-media/youtube-video), [Rutube](/kb/instruments/social-media/rutube) |
| TikTok | yt-dlp, Research API (только для одобренных исследователей) | [TikTok](/kb/instruments/social-media/tiktok) |
| Mastodon, Bluesky, Threads | Открытые API Mastodon и Bluesky, официальный Threads API | [Mastodon, Bluesky, Threads](/kb/instruments/social-media/mastodon) |
| Telegram | Экспорт в Telegram Desktop, MTProto-клиенты | [Telegram](/kb/instruments/data-take-out/dto-telegram) |
| MAX | Нет публичного просмотра каналов и экспорта данных; есть только Bot API | [MAX](/kb/instruments/social-media/max) |

## Устаревшие инструменты

Эти страницы сохранены как справочные, но для новых проектов инструменты не рекомендуются:

- **[F(b)arc](/kb/instruments/social-media/fbarc)** — репозиторий в архиве с 2018 года, после ужесточения Graph API практически неработоспособен.
- **[Social Feed Manager](/kb/instruments/social-media/social-feed-manager)** — Университет Джорджа Вашингтона (GWU) в 2024 году прекратил развитие и закрыл свой хостинг SFM.
- **Academic Research API Twitter** — закрыт в 2023 году; [twarc](/kb/instruments/social-media/twarc) работает только с платным доступом к API.

## Выбор метода

- **Свои данные** — начните с официальной выгрузки (data take-out): это самый полный и законный способ. См. [Data Take-Out](/kb/instruments/data-take-out/data-take-out-main).
- **Публичные видео** — [yt-dlp](/kb/instruments/tools/yt-dlp) поддерживает YouTube, Rutube, VK Видео, TikTok и тысячи других сайтов.
- **Публичные изображения и галереи** — [gallery-dl](/kb/instruments/tools/gallery-dl).
- **Внешний вид страниц, комментарии, динамический контент** — браузерная архивация в WARC/WACZ через [Browsertrix](/kb/instruments/tools/browsertrix).
- **Фиксация отдельных постов для расследований** — [Auto-Archiver](/kb/instruments/tools/auto-archiver).
- **Уже исчезнувшие материалы** — проверьте [Wayback Machine](/kb/instruments/tools/wayback-api) и [archive.ph](/kb/instruments/tools/archive-ph).

## Доступ к API

Там, где API ещё доступен, порядок обычно одинаковый: зарегистрироваться на портале разработчиков платформы, создать приложение, получить ключ или токен и передать его инструменту. Условия меняются часто, поэтому сверяйтесь с официальной документацией платформы перед началом проекта.

При сборе чужих публикаций учитывайте [правила обработки персональных данных](/kb/legal/personal-data) и [авторское право](/kb/legal/copyright): публичная доступность материалов не означает разрешения на их распространение.

## Связанные материалы

- [Data Take-Out](/kb/instruments/data-take-out/data-take-out-main) — официальные выгрузки собственных данных
- [Инструменты веб-архивации](/kb/instruments/tools) — для веб-версий социальных сетей
- [Руководства по архивации](/kb/guides) — общие руководства
