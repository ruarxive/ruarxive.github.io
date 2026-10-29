---
last_update:
  date: 2026-10-29
title: Facebook
description: "Архивация Facebook: выгрузка собственных данных, браузерная архивация публичных страниц, Meta Content Library для исследователей вместо закрытого CrowdTangle."
keywords: [facebook, meta, crowdtangle, meta-content-library, browsertrix]
---

# Facebook

Архивация Facebook требует специального подхода — платформа активно ограничивает автоматический сбор данных. В России доступ к Facebook ограничен Роскомнадзором с 4 марта 2022 года.

## Официальный экспорт (ваш аккаунт)

Владелец аккаунта может выгрузить копию своих данных через инструмент «Экспорт информации» в настройках аккаунта Meta:

- публикации, комментарии, реакции;
- сообщения;
- фото и видео;
- информация профиля.

Формат — HTML или JSON. Подробнее:
[Как сохранить данные из Facebook](/kb/instruments/data-take-out/dto-facebook).

## Инструменты для исследователей

**CrowdTangle закрыт Meta 14 августа 2024 года.** Вместо него Meta предлагает [Meta Content Library и Content Library API](https://transparency.meta.com/researchtools/meta-content-library):

- публичный контент Facebook, Instagram и каналов WhatsApp, а в веб-интерфейсе — и Threads;
- работа только внутри защищённой среды Meta (данные анализируются в «чистой комнате»);
- доступ по заявке для сотрудников академических и некоммерческих исследовательских организаций;
- заявители из юрисдикций, находящихся под санкциями США, Великобритании, ЕС или ООН, к программе не допускаются.

Для архивации (сохранения копий) Content Library не предназначена: это инструмент анализа, а не выгрузки.

## Архивация публичных страниц и постов

### Browsertrix Crawler

Для страниц Facebook, которые формируются скриптами, используйте [Browsertrix Crawler](/kb/instruments/tools/browsertrix). Авторизация делается через браузерный профиль: сначала создайте профиль и войдите в аккаунт в открывшемся браузере, затем передайте профиль при обходе.

```bash
# 1. Создать профиль: откройте http://localhost:9223/, войдите в аккаунт, нажмите «Create Profile»
docker run -p 6080:6080 -p 9223:9223 -v $PWD/crawls/profiles:/crawls/profiles/ \
    -it webrecorder/browsertrix-crawler create-login-profile \
    --url "https://www.facebook.com/"

# 2. Обход страницы с этим профилем
docker run -v $PWD/crawls:/crawls/ -it webrecorder/browsertrix-crawler crawl \
    --url "https://www.facebook.com/PageName" \
    --profile /crawls/profiles/profile.tar.gz \
    --generateWACZ \
    --pageLimit 500
```

Используйте для этого отдельный аккаунт: автоматический обход может привести к его блокировке.

### Wget с cookies

```bash
# Экспортируйте cookies из браузера в формате cookies.txt
wget --load-cookies cookies.txt \
     --page-requisites --adjust-extension \
     --warc-file=facebook-page \
     https://www.facebook.com/PublicPageName/
```

:::warning
Этот метод хрупок: страницы Facebook рендерятся скриптами, поэтому Wget сохраняет лишь часть содержимого. Подходит для разовых задач, не для массового обхода.
:::

## Архивация комментариев

Graph API отдаёт комментарии только к публикациям страниц, которыми управляет ваше приложение; публичные комментарии на чужих страницах доступны исследователям через Meta Content Library. Для архивных копий остаются:

1. **Browsertrix** — раскрывает комментарии при обходе страницы.
2. **Ручное сохранение через браузер** (например, [ArchiveWeb.page](https://archiveweb.page/)) — медленно, но надёжно.

## Юридические вопросы

- **Персональные данные.** Публикации и комментарии пользователей Facebook содержат персональные данные; их сбор и распространение регулируются законодательством (в России — 152-ФЗ, в ЕС — GDPR). Публичная доступность не равна согласию на распространение — см. [Персональные данные](/kb/legal/personal-data).
- **Авторское право.** Публичная доступность контента не означает разрешения на его копирование и публикацию — см. [Авторское право](/kb/legal/copyright).
- **Правила платформы.** Условия использования Meta запрещают автоматический сбор данных без разрешения; перед проектом стоит проконсультироваться с юристом.

## Ресурсы

- [Как скачать копию своих данных Facebook](https://www.facebook.com/help/212802592074644) — справка Meta
- [Meta Content Library и Content Library API](https://transparency.meta.com/researchtools/meta-content-library)
- [CrowdTangle](https://transparency.meta.com/researchtools/other-data-catalogue/crowdtangle/) — страница Meta о закрытии 14 августа 2024 года
- [Facebook Graph API](https://developers.facebook.com/docs/graph-api)
- [Документация Browsertrix Crawler](https://crawler.docs.browsertrix.com/)
- [ArchiveWeb.page](https://archiveweb.page/)

## Связанные материалы

- [Как сохранить данные из Facebook](/kb/instruments/data-take-out/dto-facebook) — архив своего аккаунта
- [Instagram](/kb/instruments/social-media/instagram) — другая площадка Meta с теми же ограничениями
- [Mastodon, Bluesky, Threads](/kb/instruments/social-media/mastodon) — Threads API
- [Browsertrix](/kb/instruments/tools/browsertrix) — копия страницы в WARC/WACZ
- [Архивация страниц, которые видны после входа](/kb/guides/authenticated-crawling) — профиль браузера и cookies
- [F(b)arc](/kb/instruments/social-media/fbarc) — архивный инструмент для Graph API
- [Площадки, у которых API уже нет](/kb/instruments/social-media/dead-platforms) — CrowdTangle и другие закрытые интерфейсы
- [Методика архивации соцсетей](/kb/instruments/social-media/methodology) — отдельный аккаунт, паспорт сбора, хранение
- [Архивация социальных сетей](/kb/instruments/social-media)
