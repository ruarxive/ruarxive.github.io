---
title: Закрытые API, площадки и инструменты
sidebar_label: Закрытые API и площадки
description: "Что использовать вместо закрытых интерфейсов и где искать исчезнувшее: API Twitter и Reddit, CrowdTangle, Pushshift, кэш Google, Google+, Vine, Periscope, snscrape, Twint, Nitter, Conifer и другие."
last_update:
  date: 2026-10-29
keywords: [twitter, reddit, pushshift, crowdtangle, instagram, conifer, snscrape, nitter, google-cache, api]
---

# Закрытые API, площадки и инструменты

Инструкция пятилетней давности часто ведёт на кнопку, которой больше нет. Ниже — что закрылось, чем пользоваться теперь и где искать уже исчезнувшее. Даты сверены с источниками из последней колонки в октябре 2026 года.

## Закрытые API

| Было | Что случилось | Чем пользоваться теперь | Источник |
|---|---|---|---|
| Twitter Academic Research API | Закрыт в феврале 2023 года: платный тариф Basic заменил уровни Essential, Elevated и Academic Research | Платный API v2 и выгрузка своего архива: [twarc](/kb/instruments/social-media/twarc), [экспорт X](/kb/instruments/data-take-out/dto-twitter) | [TechCrunch, 14.02.2023](https://techcrunch.com/2023/02/14/twitters-restrictive-api-may-leave-researchers-out-in-the-cold/) |
| Twitter API v1.1 в старых скриптах | Бесплатный доступ к API v1.1 и v2 прекращён в феврале 2023 года | То же. Снимки уже исчезнувших страниц — Wayback Machine и [archive.ph](/kb/instruments/tools/archive-ph) | [TechCrunch, 01.02.2023](https://techcrunch.com/2023/02/01/twitter-to-end-free-access-to-its-api/) |
| CrowdTangle | Закрыт 14 августа 2024 года | Для исследователей Meta — Meta Content Library и доступ по DSA, см. [Facebook](/kb/instruments/social-media/facebook#инструменты-для-исследователей) | [Meta Transparency Center](https://transparency.meta.com/researchtools/other-data-catalogue/crowdtangle/) |
| Instagram Basic Display API | Отключён 4 декабря 2024 года | Выгрузка своего аккаунта, Instaloader и браузерный снимок: [Instagram](/kb/instruments/social-media/instagram) | [Meta for Developers, 04.09.2024](https://developers.facebook.com/blog/post/2024/09/04/update-on-instagram-basic-display-api/) |
| Бесплатный API Reddit без ограничений | С 1 июля 2023 года бесплатно — до 100 запросов в минуту на OAuth-клиента, сверх этого — $0,24 за 1000 вызовов | Бесплатный уровень с лимитом; вид обсуждений — [Browsertrix](/kb/instruments/tools/browsertrix) | [Объявление Reddit, 09.06.2023](https://www.reddit.com/r/reddit/comments/145bram/addressing_the_community_about_changes_to_our_api/) |
| Pushshift (архив Reddit для исследователей) | 1 мая 2023 года Reddit отключил Pushshift от своего API. С июня 2023 года доступ вернули только одобренным модераторам и только для модерации | Для исследований открытой замены нет | [r/modnews, 01.05.2023](https://www.reddit.com/r/modnews/comments/134tjpe/reddit_data_api_update_changes_to_pushshift_access/), [r/pushshift, 31.05.2023](https://www.reddit.com/r/pushshift/comments/13w6j20/) |
| Кэш Google (`cache:`) | Ссылку на кэш убрали из выдачи в январе 2024 года, оператор `cache:` перестал работать в сентябре 2024 года | [Wayback Machine](/kb/instruments/tools/wayback-api), [archive.ph](/kb/instruments/tools/archive-ph) | Search Engine Land: [февраль 2024](https://searchengineland.com/google-search-officially-retires-cache-link-437122), [сентябрь 2024](https://searchengineland.com/google-search-completely-kills-the-cache-feature-446904) |

## Закрытые площадки: где искать исчезнувшее

| Площадка | Что случилось | Где искать | Источник |
|---|---|---|---|
| Google+ | Версия для пользователей закрыта 2 апреля 2019 года | ArchiveTeam за четыре недели собрал больше 1,56 ПБ: коллекция [`archiveteam_googleplus`](https://archive.org/details/archiveteam_googleplus), затем Wayback Machine. Подробнее — [ArchiveTeam](/kb/similar/archiveteam) | [Вики ArchiveTeam](https://wiki.archiveteam.org/index.php/Google_Plus) |
| Vine | Закрытие приложения объявлено 27 октября 2016 года. Сайт с роликами перестал работать около 3 января 2025 года | Wayback Machine. Коллекция ArchiveTeam `archiveteam_vine` сохранена частично, доступ к WARC ограничен | [Вики ArchiveTeam](https://wiki.archiveteam.org/index.php/Vine) |
| Periscope | Приложение закрыто 31 марта 2021 года | Трансляции, опубликованные в Twitter, остались там записями. Коллекция ArchiveTeam `archiveteam_periscope`, доступ к WARC ограничен | [MacRumors, 31.03.2021](https://www.macrumors.com/2021/03/31/periscope-app-officially-shutting-down-after-today/), [вики ArchiveTeam](https://wiki.archiveteam.org/index.php/Periscope) |
| Coub | Закрытие было назначено на 1 апреля 2022 года, 5 апреля сервис объявил, что продолжит работу | Пример, почему архивировать надо по объявлению, не дожидаясь закрытия: ArchiveTeam успел собрать около 77 ТиБ ([`archiveteam_coub`](https://archive.org/details/archiveteam_coub)), кампания Ruarxive — [Coub](/kb/projects/coub) | [Хабр, 05.04.2022](https://habr.com/ru/news/659207/) |

## Заброшенные инструменты

| Было | Что случилось | Чем пользоваться теперь | Источник |
|---|---|---|---|
| snscrape для Twitter | С 30 июня 2023 года все запросы к Twitter завершаются ошибкой, issue открыт до сих пор. Последние изменения в репозитории — ноябрь 2023 года | [twarc](/kb/instruments/social-media/twarc) с платным API, снимки отдельных постов: [Auto-Archiver](/kb/instruments/tools/auto-archiver), archive.ph | [Issue #996](https://github.com/JustAnotherArchivist/snscrape/issues/996) |
| Twint | Репозиторий в архиве, последние изменения — февраль 2023 года | То же | [GitHub](https://github.com/twintproject/twint) |
| Nitter | 24 августа 2026 года X Corp. потребовала удалить экземпляры Nitter и репозиторий проекта. Репозиторий в архиве, автор ищет юридическую помощь | То же. Старые снимки страниц Nitter могут быть в Wayback Machine | [README](https://github.com/zedeus/nitter) |
| Social Feed Manager | GWU прекратил разработку в 2024 году и закрыл свой хостинг | Страница оставлена как справка: [Social Feed Manager](/kb/instruments/social-media/social-feed-manager) | [Сайт проекта](https://gwu-libraries.github.io/sfm-ui/) |
| F(b)arc | Репозиторий в архиве, последние изменения — январь 2018 года | [Facebook](/kb/instruments/social-media/facebook) | [GitHub](https://github.com/justinlittman/fbarc) |
| tgarc на Pyrogram | Репозиторий не менялся с 15 декабря 2023 года, Pyrogram архивирован | [tdl](/kb/instruments/tools/tdl) и [экспорт Telegram](/kb/instruments/data-take-out/dto-telegram) | [ruarxive/tgarc](https://github.com/ruarxive/tgarc), [Pyrogram](https://github.com/pyrogram/pyrogram) |
| Conifer (Rhizome) | С 15 декабря 2025 года не регистрирует новые аккаунты, с мая 2026 года захват и правка коллекций отключены: сервис работает только на чтение. Переход на архивную версию, намеченный на июнь 2026 года, перенесён на конец 2026 года. Старые коллекции остаются открыты | [Browsertrix](/kb/instruments/tools/browsertrix) и расширение ArchiveWeb.page | [Объявление 15.12.2025](https://blog.conifer.rhizome.org/2025/12/15/twilight-announcement.html), [перенос 16.10.2026](https://blog.conifer.rhizome.org/2026/10/16/twilight-delay.html) |
| OpenWayback | Не развивается, последний релиз 2.4.0 — май 2019 года. Для новых установок не рекомендуется | [pywb](/kb/instruments/replay/pywb) | [README](https://github.com/iipc/openwayback), [IIPC: переход на pywb](https://netpreserveblog.wordpress.com/2020/12/16/openwayback-to-pywb-transition-guide/) |
| Crocoite | Репозиторий архивирован владельцем 25 апреля 2021 года, последний push — декабрь 2019 | [Browsertrix](/kb/instruments/tools/browsertrix) | [GitHub](https://github.com/PromyLOPh/crocoite) |

Срез «что ещё живое» — на странице [ландшафта 2026](/kb/instruments/landscape-2026) и в [списке новых и уходящих инструментов](/kb/resources/curated-lists).

## Как не скопировать устаревший рецепт

- Смотрите `last_update` в шапке страницы и блок «когда не использовать».
- Если команда требует ключ Academic API, CrowdTangle, Pushshift или регистрацию в Conifer, она описывает прошлый сервис.
- Если рецепт для Twitter обходится без ключа API (snscrape, Twint, Nitter), он, скорее всего, уже не работает.
- Официальная выгрузка своего аккаунта переживает закрытие API для чужих данных чаще, чем сторонний краулер. Начните с [Data Take-Out](/kb/instruments/data-take-out/data-take-out-main).

## Связанные материалы

- [Архивация социальных сетей](/kb/instruments/social-media)
- [ArchiveTeam](/kb/similar/archiveteam) — крупные спасения закрывающихся сервисов
- [Ландшафт веб-архивации, 2026](/kb/instruments/landscape-2026)
- [Условия использования сервисов](/kb/legal/terms-of-service)
