---
title: Площадки, у которых API уже нет
sidebar_label: Закрытые API
description: "Что использовать вместо закрытых интерфейсов: академический API Twitter, CrowdTangle, Instagram Basic Display, Conifer и другие инструменты, которые больше не развиваются."
last_update:
  date: 2026-10-28
keywords: [twitter, crowdtangle, instagram, conifer, api]
---

# Площадки, у которых API уже нет

Инструкция пятилетней давности часто ведёт на кнопку, которой больше нет. Ниже — замены, уже описанные в этой базе. Даты сверены с источниками из последней колонки в октябре 2026 года.

| Было | Что случилось | Чем пользоваться теперь | Источник |
|---|---|---|---|
| Twitter Academic Research API | Закрыт в феврале 2023 года: платный тариф Basic заменил уровни Essential, Elevated и Academic Research | Платный API v2 и выгрузка своего архива: [twarc](/kb/instruments/social-media/twarc), [экспорт X](/kb/instruments/data-take-out/dto-twitter) | [TechCrunch, 14.02.2023](https://techcrunch.com/2023/02/14/twitters-restrictive-api-may-leave-researchers-out-in-the-cold/) |
| Twitter API v1.1 в старых скриптах | Бесплатный доступ к API v1.1 и v2 прекращён в феврале 2023 года | То же. Снимки уже исчезнувших страниц — Wayback Machine и [archive.ph](/kb/instruments/tools/archive-ph) | [TechCrunch, 01.02.2023](https://techcrunch.com/2023/02/01/twitter-to-end-free-access-to-its-api/) |
| CrowdTangle | Закрыт 14 августа 2024 года | Для исследователей Meta — Meta Content Library, см. [Facebook](/kb/instruments/social-media/facebook) | [Meta Transparency Center](https://transparency.meta.com/researchtools/other-data-catalogue/crowdtangle/) |
| Instagram Basic Display API | Отключён 4 декабря 2024 года | Выгрузка своего аккаунта, Instaloader и браузерный снимок: [Instagram](/kb/instruments/social-media/instagram) | [Meta for Developers, 04.09.2024](https://developers.facebook.com/blog/post/2024/09/04/update-on-instagram-basic-display-api/) |
| Conifer (Rhizome) | С 15 декабря 2025 года не регистрирует новые аккаунты, с мая 2026 года захват и правка коллекций отключены: сервис работает только на чтение. Переход на архивную версию, намеченный на июнь 2026 года, перенесён на конец 2026 года. Старые коллекции остаются открыты | [Browsertrix](/kb/instruments/tools/browsertrix) и расширение ArchiveWeb.page | [Объявление 15.12.2025](https://blog.conifer.rhizome.org/2025/12/15/twilight-announcement.html), [перенос 16.10.2026](https://blog.conifer.rhizome.org/2026/10/16/twilight-delay.html) |
| Social Feed Manager | GWU прекратил разработку в 2024 году и закрыл свой хостинг | Страница оставлена как справка: [Social Feed Manager](/kb/instruments/social-media/social-feed-manager) | [Сайт проекта](https://gwu-libraries.github.io/sfm-ui/) |
| F(b)arc | Репозиторий в архиве, последние изменения — январь 2018 года | [Facebook](/kb/instruments/social-media/facebook) | [GitHub](https://github.com/justinlittman/fbarc) |
| tgarc на Pyrogram | Репозиторий не менялся с 15 декабря 2023 года, Pyrogram архивирован | [tdl](/kb/instruments/tools/tdl) и [экспорт Telegram](/kb/instruments/data-take-out/dto-telegram) | [ruarxive/tgarc](https://github.com/ruarxive/tgarc), [Pyrogram](https://github.com/pyrogram/pyrogram) |
| OpenWayback | Не развивается, последний релиз 2.4.0 — май 2019 года. Для новых установок не рекомендуется | [pywb](/kb/instruments/replay/pywb) | [README](https://github.com/iipc/openwayback), [IIPC: переход на pywb](https://netpreserveblog.wordpress.com/2020/12/16/openwayback-to-pywb-transition-guide/) |
| Crocoite | Репозиторий архивирован владельцем 25 апреля 2021 года, последний push — декабрь 2019 | [Browsertrix](/kb/instruments/tools/browsertrix) | [GitHub](https://github.com/PromyLOPh/crocoite) |

Срез «что ещё живое» — на странице [ландшафта 2026](/kb/instruments/landscape-2026) и в [списке новых и уходящих инструментов](/kb/resources/curated-lists).

## Как не скопировать устаревший рецепт

- Смотрите `last_update` в шапке страницы и блок «когда не использовать».
- Если команда требует ключ Academic API, CrowdTangle или регистрацию в Conifer, она описывает прошлый сервис.
- Официальная выгрузка своего аккаунта переживает закрытие API для чужих данных чаще, чем сторонний краулер. Начните с [Data Take-Out](/kb/instruments/data-take-out/data-take-out-main).

## Связанные материалы

- [Архивация социальных сетей](/kb/instruments/social-media)
- [Ландшафт веб-архивации, 2026](/kb/instruments/landscape-2026)
- [Условия использования сервисов](/kb/legal/terms-of-service)
