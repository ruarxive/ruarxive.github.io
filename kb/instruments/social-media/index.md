---
last_update:
  date: 2026-10-29
title: Архивация социальных сетей
description: "Архивация социальных сетей и мессенджеров в 2026 году: что можно получить на каждой площадке, ограничения доступа в России, какие API ещё работают и какие инструменты устарели."
keywords: [социальные сети, мессенджеры, api, yt-dlp, data-take-out, блокировки, роскомнадзор]
---

# Архивация социальных сетей

Архивация социальных сетей за последние годы сильно усложнилась: большинство платформ закрыли или сделали платными свои API, а многие известные инструменты перестали развиваться. Ниже — что можно получить на каждой площадке, какие из них ограничены в России и как выбрать способ. Общие правила сбора и хранения — в [методике](/kb/instruments/social-media/methodology).

## Что можно получить

| Платформа | Публикации | Комментарии | Медиафайлы | Что нужно | Свой аккаунт |
| :--- | :--- | :--- | :--- | :--- | :--- |
| [ВКонтакте](/kb/instruments/social-media/vk) | VK API `wall.get` | `wall.getComments` | gallery-dl, yt-dlp | сервисный ключ приложения | [выгрузка](/kb/instruments/data-take-out/dto-vk) |
| [Telegram](/kb/instruments/social-media/telegram) | tdl, Telethon | через группу обсуждения: tdl `--reply`, Telethon `reply_to` | tdl, Telethon | аккаунт; без него — только снимок `t.me/s/` | [экспорт Desktop](/kb/instruments/data-take-out/dto-telegram) |
| [MAX](/kb/instruments/social-media/max) | Bot API, только канал, где ваш бот — администратор | — | — | бот; подключают только организации, ИП и самозанятые из РФ | нет выгрузки |
| [Rutube](/kb/instruments/social-media/rutube) | yt-dlp | только снимок страницы | yt-dlp | ничего | — |
| [YouTube](/kb/instruments/social-media/youtube-video) | yt-dlp | yt-dlp `--write-comments` | yt-dlp | ничего; для части видео — cookies | [Google Takeout](/kb/instruments/data-take-out/dto-google) |
| [Twitter/X](/kb/instruments/social-media/twarc) | twarc2 | `twarc2 conversation` | — | платный API; без него — снимки отдельных постов | [архив X](/kb/instruments/data-take-out/dto-twitter) |
| [Facebook](/kb/instruments/social-media/facebook) | Browsertrix с профилем | Browsertrix | Browsertrix | аккаунт | [экспорт информации](/kb/instruments/data-take-out/dto-facebook) |
| [Instagram](/kb/instruments/social-media/instagram) | Instaloader, gallery-dl | Instaloader `--comments` | Instaloader, gallery-dl | аккаунт для большинства профилей | [Центр аккаунтов](/kb/instruments/data-take-out/dto-instagram) |
| [TikTok](/kb/instruments/social-media/tiktok) | yt-dlp, gallery-dl | yt-dlp `--write-comments`, если TikTok их отдаёт | yt-dlp, gallery-dl | ничего; для части видео — cookies | [выгрузка](/kb/instruments/data-take-out/dto-tiktok) |
| [Mastodon](/kb/instruments/social-media/mastodon#mastodon) | REST API, Mastodon.py | ответы — тоже посты: `statuses/:id/context` | gallery-dl | ничего, если инстанс не закрыл API | [архив аккаунта](/kb/instruments/data-take-out/dto-mastodon) |
| [Bluesky](/kb/instruments/social-media/mastodon#bluesky) | публичный API, репозиторий CAR | `getPostThread` | отдельно от репозитория | ничего | тот же репозиторий CAR |
| [Threads](/kb/instruments/social-media/mastodon#threads) | Threads API: поиск по словам и тегам | — | — | приложение Meta и токен | — |

- «—» — способа в базе нет.
- Вид любой страницы сохраняет [Browsertrix](/kb/instruments/tools/browsertrix), отдельную публикацию — [archive.ph](/kb/instruments/tools/archive-ph) и [Auto-Archiver](/kb/instruments/tools/auto-archiver).
- Удалённое до сбора не возвращает ни один способ, см. [методику](/kb/instruments/social-media/methodology#что-теряется).
- Для Одноклассников в базе пока описан только запрос архива своих данных: [Одноклассники](/kb/instruments/data-take-out/dto-ok).

Общие правила — единица сбора, паспорт сбора, отдельный аккаунт, темп, хранение — на странице [Методика архивации соцсетей](/kb/instruments/social-media/methodology).

## Выбор метода

- **Свои данные** — начните с официальной выгрузки (data take-out): это самый полный и законный способ. См. [Data Take-Out](/kb/instruments/data-take-out/data-take-out-main).
- **Публичные видео** — [yt-dlp](/kb/instruments/tools/yt-dlp) поддерживает YouTube, Rutube, VK Видео, TikTok и тысячи других сайтов.
- **Публичные изображения и галереи** — [gallery-dl](/kb/instruments/tools/gallery-dl).
- **Внешний вид страниц, комментарии, динамический контент** — браузерная архивация в WARC/WACZ через [Browsertrix](/kb/instruments/tools/browsertrix).
- **Фиксация отдельных постов для расследований** — [Auto-Archiver](/kb/instruments/tools/auto-archiver).
- **Уже исчезнувшие материалы** — проверьте [Wayback Machine](/kb/instruments/tools/wayback-api) и [archive.ph](/kb/instruments/tools/archive-ph).

## Ограничения доступа в России

Состояние на октябрь 2026 года, даты сверены с источниками из последней колонки. Советов по обходу блокировок база не даёт. Для архивиста вывод один: важное выгружайте заранее, пока доступ есть.

| Площадка | Что произошло | Когда | Источник |
| :--- | :--- | :--- | :--- |
| Twitter/X | Роскомнадзор заблокировал сайт по требованию Генпрокуратуры | 4 марта 2022 | [Интерфакс](https://interfax.com/newsroom/top-stories/75547/) |
| Facebook | Роскомнадзор заблокировал сайт | 4 марта 2022 | [Интерфакс](https://interfax.com/newsroom/top-stories/75547/) |
| Instagram | сайт внесён в реестр запрещённых | 14 марта 2022 | [Интерфакс](https://www.interfax.com/newsroom/top-stories/76633/) |
| TikTok | сама платформа остановила для пользователей в России публикацию новых видео и эфиры | 6 марта 2022 | [TechCrunch](https://techcrunch.com/2022/03/06/tiktok-suspends-content-in-russia-in-response-to-fake-news-law) |
| YouTube | замедление; затем домен youtube.com пропал из DNS-серверов Национальной системы доменных имён (НСДИ), СМИ оценивают это как блокировку | замедление — с конца июля 2024, НСДИ — февраль 2026 | [The Moscow Times](https://ru.themoscowtimes.com/2026/02/10/roskomnadzor-pereshel-kpolnoi-blokirovke-youtube-posle-polutora-let-zamedleniya-a186865) |
| Telegram | Роскомнадзор ограничил звонки; затем объявил «последовательные ограничения» всего сервиса | звонки — с 13 августа 2025, сервис — с 10 февраля 2026 | [Фонтанка](https://www.fontanka.ru/2025/08/13/75826095/), [Медуза](https://meduza.io/news/2026/02/10/roskomnadzor-ob-yavil-chto-prodolzhit-vvodit-ogranicheniya-protiv-telegram), позиция Ruarxive — [#182](https://t.me/ruarxive/182) |
| WhatsApp | Роскомнадзор ограничил звонки; затем домены whatsapp.com и web.whatsapp.com пропали из НСДИ | звонки — с 13 августа 2025, НСДИ — февраль 2026 | [Фонтанка](https://www.fontanka.ru/2025/08/13/75826095/), [РБК](https://prim.rbc.ru/prim/12/02/2026/698d79189a7947ffe922a0ef) |

Ограничение доступа не удаляет материалы: они остаются на серверах площадки и в снимках [Wayback Machine](/kb/instruments/tools/wayback-api). Российские площадки — ВКонтакте, Одноклассники, Rutube, MAX — в России доступны. У MAX другая проблема: нет публичного просмотра каналов и выгрузки, см. [MAX](/kb/instruments/social-media/max).

## Устаревшие инструменты

Эти страницы сохранены как справочные, но для новых проектов инструменты не рекомендуются:

- **[F(b)arc](/kb/instruments/social-media/fbarc)** — репозиторий в архиве с 2018 года, после ужесточения Graph API практически неработоспособен.
- **[Social Feed Manager](/kb/instruments/social-media/social-feed-manager)** — Университет Джорджа Вашингтона (GWU) в 2024 году прекратил развитие и закрыл свой хостинг SFM.
- **Academic Research API Twitter** — закрыт в 2023 году; [twarc](/kb/instruments/social-media/twarc) работает только с платным доступом к API.

Сводка закрытых интерфейсов и чем их заменить — на странице [«Площадки, у которых API уже нет»](/kb/instruments/social-media/dead-platforms).

## Доступ к API

Там, где API ещё доступен, порядок обычно одинаковый: зарегистрироваться на портале разработчиков платформы, создать приложение, получить ключ или токен и передать его инструменту. Условия меняются часто, поэтому сверяйтесь с официальной документацией платформы перед началом проекта.

При сборе чужих публикаций учитывайте [правила обработки персональных данных](/kb/legal/personal-data) и [авторское право](/kb/legal/copyright): публичная доступность материалов не означает разрешения на их распространение.

## Связанные материалы

- [Методика архивации соцсетей](/kb/instruments/social-media/methodology) — паспорт сбора, аккаунт, темп, хранение
- [Data Take-Out](/kb/instruments/data-take-out/data-take-out-main) — официальные выгрузки собственных данных
- [Инструменты веб-архивации](/kb/instruments/tools) — для веб-версий социальных сетей
- [Руководства по архивации](/kb/guides) — общие руководства
