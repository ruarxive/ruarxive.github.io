---
title: Reddit, Twitch, Discord и каналы WhatsApp
sidebar_label: Reddit, Twitch, Discord, WhatsApp
description: "Короткие справки по архивации Reddit, Twitch, Discord и каналов WhatsApp в 2026 году: что ещё работает, чем сохранять, сроки хранения записей эфиров и правила площадок."
last_update:
  date: 2026-10-29
keywords: [reddit, twitch, discord, whatsapp, gallery-dl, yt-dlp, discordchatexporter, twitchdownloader, vod]
---

# Reddit, Twitch, Discord и каналы WhatsApp

Короткие справки по площадкам, для которых в базе нет отдельной страницы. Общие правила — единица сбора, паспорт, темп, хранение — в [методике](/kb/instruments/social-media/methodology).

| Площадка | Что сохраняют | Чем |
| :--- | :--- | :--- |
| [Reddit](#reddit) | свои данные; публичные обсуждения и медиа — только с одобренным доступом к API | запрос данных, Data API, gallery-dl |
| [Twitch](#twitch) | записи эфиров (VOD), клипы, идущий эфир, чат записи | yt-dlp, TwitchDownloader |
| [Discord](#discord) | каналы своего сервера; свои сообщения | DiscordChatExporter с ботом, пакет данных Discord |
| [Каналы WhatsApp](#каналы-whatsapp) | карточку канала; публикации — вручную | снимок веб-превью, приложение |

## Reddit

Бесплатный API ограничен с июля 2023 года, Pushshift отключён — подробности в разделе [«Закрытые API»](/kb/instruments/social-media/dead-platforms#закрытые-api). С тех пор доступ стал ещё уже:

- **Только с OAuth.** По [вики Data API](https://support.reddithelp.com/hc/en-us/articles/16160319875092-Reddit-Data-API-Wiki) (обновлена 28.10.2026) клиент обязан использовать зарегистрированный OAuth-токен. Запросы без OAuth или входа блокируются. Бесплатный лимит — 100 запросов в минуту на `client id`.
- **Только по заявке.** [Responsible Builder Policy](https://support.reddithelp.com/hc/en-us/articles/42728983564564-Responsible-Builder-Policy) требует запросить и получить явное одобрение до любого доступа к данным через API. Исследователям из аккредитованных университетов — программа [Reddit for Researchers](https://support.reddithelp.com/hc/en-us/articles/49381918834964-Reddit-for-Researchers-Program).
- **Без авторизации.** Проверка 29.10.2026 через `curl` с браузерным User-Agent: `www.reddit.com/r/DataHoarder/new.json` вернул 403, `old.reddit.com` перенаправил на вход. HTML-страница сабреддита и лента `/.rss` (Atom, 25 записей) ответили 200. Проверка сделана из одной сети.
- **gallery-dl.** Без `client-id` экстрактор Reddit ходит в REST API `www.reddit.com`. В нашей проверке gallery-dl 1.32.18 получил там вместо JSON страницу ошибки. Для OAuth нужны свой `client-id`, `user-agent-oauth` и команда `gallery-dl oauth:reddit`, см. [gallery-dl](/kb/instruments/tools/gallery-dl). Параметр `comments` (по умолчанию 0) задаёт, сколько комментариев читать ради ссылок на медиа.
- **Снимок обсуждения.** `robots.txt` Reddit — `User-agent: *` и `Disallow: /`. [Пользовательское соглашение](https://redditinc.com/policies/user-agreement) разрешает обход только в рамках `robots.txt` и запрещает скрапинг без письменного согласия. [Browsertrix](/kb/instruments/tools/browsertrix) с `--robots` ничего не соберёт.
- **Wayback Machine.** С 11 августа 2025 года Reddit пускает Internet Archive только на главную страницу. Обсуждения, комментарии и профили больше не архивируются ([SiliconANGLE](https://siliconangle.com/2025/08/11/reddit-says-blocking-internet-archive-stop-sneaky-ai-scrapers-accessing-content/)).
- **Свои данные.** Форма [reddit.com/settings/data-request](https://www.reddit.com/settings/data-request), подготовка — до 30 дней ([справка](https://support.reddithelp.com/hc/en-us/articles/360043048352-How-do-I-request-a-copy-of-my-Reddit-data-and-information)).

> Команды сверены с gallery-dl 1.32.18 (`docs/configuration.rst`, `extractor/reddit.py`, октябрь 2026).

## Twitch

Записи эфиров (VOD) живут недолго. По [справке Twitch](https://help.twitch.tv/s/article/video-on-demand):

| Аккаунт | Срок хранения VOD |
| :--- | :--- |
| Partner, Turbo, Prime | 60 дней |
| Affiliate | 14 дней |
| остальные | 7 дней |

- VOD сохраняется, только если включена настройка Store Past Broadcasts. Поддержка не восстанавливает запись, которая не сохранилась или истекла.
- Версии в 2K и вертикальном формате истекают через 7 дней.
- Хайлайты и загрузки хранятся бессрочно, в пределах общего лимита 100 часов.
- Массового скачивания своих видео Twitch не даёт, только по одному в Video Producer.

Вывод для архивиста: записи эфиров скачивайте сразу после эфира.

Экстракторы Twitch в [yt-dlp](/kb/instruments/tools/yt-dlp):

- `twitch:vod` — запись эфира `twitch.tv/videos/ID`;
- `twitch:videos` — вкладка канала с `filter=archives`, `highlights`, `uploads` или `all`;
- `twitch:clips`, `twitch:videos:clips` — клипы;
- `twitch:collection` — коллекция;
- `twitch:stream` — идущий эфир.

Чат yt-dlp не сохраняет. Субтитры `rechat` удалены 09.06.2026 ([PR #16660](https://github.com/yt-dlp/yt-dlp/pull/16660)): их эндпоинт API v5 отключён ещё в 2022 году. Чат записи сохраняет [TwitchDownloader](https://github.com/lay295/TwitchDownloader) (MIT) в JSON, HTML или TXT.

```bash
# все записи эфиров канала; повторный запуск докачает только новое
yt-dlp --download-archive twitch-archive.txt --write-info-json \
       -o "%(upload_date)s %(title)s [%(id)s].%(ext)s" \
       "https://www.twitch.tv/CHANNEL/videos?filter=archives&sort=time"

# идущий эфир с начала: yt-dlp ищет запись текущего эфира
yt-dlp --live-from-start "https://www.twitch.tv/CHANNEL"

# чат записи; -E встраивает эмоуты и значки Twitch для офлайн-просмотра
./TwitchDownloaderCLI chatdownload --id VOD_ID -o VOD_ID-chat.json -E
```

> Команды yt-dlp сверены с yt-dlp 2026.10.26 (`yt_dlp/extractor/twitch.py`, прогон `--simulate` на канале `twitch`, октябрь 2026). `chatdownload` сверен с README TwitchDownloaderCLI 1.56.5, не запускался.

## Discord

В России Роскомнадзор ограничил доступ к Discord 8 октября 2024 года ([«Медиазона»](https://zona.media/news/2024/10/08/discord)).

- **Свои сообщения.** Пакет данных: «Настройки» → Data & Privacy → Request Data. По [справке Discord](https://support.discord.com/hc/en-us/articles/360004957991-Your-Discord-Data-Package) это ZIP с JSON-файлами. В нём только сообщения, которые отправили вы. Пакет готовится до 30 дней, ссылка действует 30 дней.
- **Каналы своего сервера.** [DiscordChatExporter](https://github.com/Tyrrrz/DiscordChatExporter) выгружает каналы в HTML, TXT, CSV или JSON. Лицензия MIT, версия 2.48 от 27.08.2026, в README — статус maintenance. Работайте через бота — официальный API для автоматизации.
- **Бот.** Создайте приложение в [Developer Portal](https://discord.com/developers/applications) и пригласите бота на сервер с правами View Channels и Read Message History. Включите Message Content Intent: по документации программы без него экспорт будет пустым.

```bash
export DISCORD_TOKEN="токен бота"
./DiscordChatExporter.Cli exportguild -g SERVER_ID \
    --include-threads all --media -f Json \
    -o "discord/%G/%C.json"
```

Токен передан переменной `DISCORD_TOKEN`, а не флагом `-t`, чтобы он не попал в историю команд. `%G` и `%C` — имя сервера и канала, `--media` скачивает вложения и аватары.

> Команда сверена с исходным кодом DiscordChatExporter 2.48 (`DiscordChatExporter.Cli/Commands`) и `.docs/Using-the-CLI.md`, не запускалась.

:::warning Пользовательский токен
Программа принимает и токен пользователя. README предупреждает: автоматизация пользовательских аккаунтов нарушает условия Discord и может кончиться баном. Discord в [справке о self-bots](https://support.discord.com/hc/en-us/articles/115002192352-Automated-user-accounts-self-bots-) называет её запрещённой. Такой экспорт — только для своего аккаунта и на свой риск. Self-ботов база не описывает.
:::

В README DiscordChatExporter есть раздел Terms of use: автор считает использование программы согласием с политическими заявлениями из этого раздела. Прочитайте его до установки.

## Каналы WhatsApp

В России WhatsApp ограничен, см. [ограничения доступа в России](/kb/instruments/social-media#ограничения-доступа-в-россии).

- **Веб-превью.** Адрес `https://www.whatsapp.com/channel/ID` открывается без аккаунта. В проверке 29.10.2026 (`curl` открытого канала) страница показала название, аватар, описание и число подписчиков. Публикаций на ней нет.
- **Срок хранения.** При запуске каналов WhatsApp писал, что хранит историю канала на серверах до 30 дней. Администратор может запретить скриншоты и пересылку ([блог WhatsApp, 08.06.2023](https://blog.whatsapp.com/introducing-whatsapp-channels-a-private-way-to-follow-what-matters)).
- **Публикации.** API для выгрузки нет: подписка и ручное сохранение, просьба к администратору, для исследователей — Meta Content Library. Подробнее — [Каналы WhatsApp](/kb/instruments/data-take-out/dto-whatsapp#каналы-whatsapp).

Снимок превью сохраняет только карточку канала, но не его публикации.

## Хранение результата

- Twitch: видео, `*.info.json` и `twitch-archive.txt` — в одной папке канала, чат — рядом с файлом записи.
- Discord: JSON и папку медиа храните вместе, ссылки в экспорте ведут на неё.
- Паспорт сбора и контрольные суммы — по [методике](/kb/instruments/social-media/methodology#хранение).

## Право

- Ники, аватары и сообщения участников чатов и обсуждений — [персональные данные](/kb/legal/personal-data).
- Записи эфиров, клипы и медиа принадлежат авторам, см. [авторское право](/kb/legal/copyright).
- Вики Data API Reddit требует удалять у себя контент, удалённый с Reddit, и советует делать это каждые 48 часов. Для архива это прямое противоречие: учтите его до начала сбора, см. [условия использования сервисов](/kb/legal/terms-of-service).
- Выгрузка закрытого сервера Discord — только с согласия администрации и участников.

## Ресурсы

- Reddit: [вики Data API](https://support.reddithelp.com/hc/en-us/articles/16160319875092-Reddit-Data-API-Wiki), [Responsible Builder Policy](https://support.reddithelp.com/hc/en-us/articles/42728983564564-Responsible-Builder-Policy), [Reddit for Researchers](https://support.reddithelp.com/hc/en-us/articles/49381918834964-Reddit-for-Researchers-Program)
- Twitch: [On-Demand Content on Twitch](https://help.twitch.tv/s/article/video-on-demand), [TwitchDownloader](https://github.com/lay295/TwitchDownloader)
- Discord: [DiscordChatExporter](https://github.com/Tyrrrz/DiscordChatExporter), [Your Discord Data Package](https://support.discord.com/hc/en-us/articles/360004957991-Your-Discord-Data-Package)
- WhatsApp: [Introducing WhatsApp Channels](https://blog.whatsapp.com/introducing-whatsapp-channels-a-private-way-to-follow-what-matters)

## Связанные материалы

- [Закрытые API, площадки и инструменты](/kb/instruments/social-media/dead-platforms) — API Reddit и Pushshift
- [yt-dlp](/kb/instruments/tools/yt-dlp) — установка, качество, конфигурация
- [gallery-dl](/kb/instruments/tools/gallery-dl) — OAuth и конфигурация
- [Browsertrix](/kb/instruments/tools/browsertrix) — снимок страниц в WACZ
- [Как сохранить данные из WhatsApp](/kb/instruments/data-take-out/dto-whatsapp) — экспорт чатов и каналы
- [Архивация социальных сетей](/kb/instruments/social-media) — обзор площадок и ограничения в России
- [Методика архивации соцсетей](/kb/instruments/social-media/methodology)
