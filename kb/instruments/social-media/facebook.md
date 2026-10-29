---
last_update:
  date: 2026-10-29
title: Facebook
description: "Архивация Facebook: выгрузка собственных данных, Browsertrix с профилем и поведением для Facebook, группы, комментарии, Meta Content Library и доступ по DSA для исследователей вместо закрытого CrowdTangle."
keywords: [facebook, meta, crowdtangle, meta-content-library, browsertrix, dsa]
---

# Facebook

Архивация Facebook требует специального подхода — платформа активно ограничивает автоматический сбор данных. В России доступ к Facebook ограничен Роскомнадзором с 4 марта 2022 года, см. [ограничения доступа в России](/kb/instruments/social-media#ограничения-доступа-в-россии).

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

### Доступ по DSA

Facebook и Instagram — очень крупные онлайн-платформы по Закону ЕС о цифровых услугах (DSA). Статья 40 обязывает их давать данные проверенным исследователям. Процедуру задаёт делегированный регламент (ЕС) [2025/2050](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32025R2050) от 1 июля 2025 года, опубликованный 9 октября 2025 года:

- заявку подают через портал DSA для доступа к данным (DSA data access portal);
- заявку проверяет координатор цифровых услуг страны ЕС, где зарегистрирована платформа;
- исследователь должен работать в исследовательской организации и не зависеть от коммерческих интересов;
- данные дают только для исследования системных рисков в ЕС.

Как и Content Library, этот доступ — для исследования, а не для архивных копий.

## Архивация публичных страниц и постов

### Browsertrix Crawler

Для страниц Facebook, которые формируются скриптами, используйте [Browsertrix Crawler](/kb/instruments/tools/browsertrix). Без входа Facebook обычно закрывает ленту окном входа, поэтому обход делают с браузерным профилем: сначала создайте профиль и войдите в аккаунт в открывшемся браузере, затем передайте профиль при обходе.

```bash
# 1. Создать профиль: откройте http://localhost:9223/, войдите в аккаунт, нажмите «Create Profile»
docker run -p 6080:6080 -p 9223:9223 -v $PWD/crawls/profiles:/crawls/profiles/ \
    -it webrecorder/browsertrix-crawler create-login-profile \
    --url "https://www.facebook.com/"

# 2. Обход страницы с этим профилем
docker run -v $PWD/crawls:/crawls/ -it webrecorder/browsertrix-crawler crawl \
    --url "https://www.facebook.com/PageName" \
    --profile /crawls/profiles/profile.tar.gz \
    --behaviorTimeout 300 \
    --generateWACZ \
    --pageLimit 500
```

Используйте для этого отдельный аккаунт: автоматический обход может привести к его блокировке.

В Browsertrix есть отдельное поведение для Facebook. Оно включено по умолчанию (`--behaviors autoplay,autofetch,autoscroll,siteSpecific`) и умеет:

- листать ленту страницы человека, организации или группы;
- раскрывать комментарии к посту или фото;
- открывать фотографии в полном размере вместе с подписями;
- просматривать все Reels страницы.

Посты из ленты поведение добавляет в очередь отдельными страницами. Если такая страница выходит за границы обхода (scope), её пропустят; флаг `--alwaysAddBehaviorLinks` сохраняет их всегда. На одну страницу поведение тратит не больше `--behaviorTimeout` секунд, по умолчанию 90. Для длинной ленты этого мало — отсюда `300` в примере.

> Поведение и флаги сверены с документацией Browsertrix Crawler 1.15.2 (`docs/user-guide/behaviors.md`, `cli-options.md`) и исходным кодом browsertrix-behaviors 0.15.1 (`src/site/facebook.ts`, октябрь 2026).

### Группы

Ленту группы поведение Browsertrix листает так же, как ленту страницы. Закрытую группу видят только участники: снимок возможен, если ваш аккаунт в ней состоит. Переписку участников закрытой группы без их согласия не сохраняют, см. [условия использования сервисов](/kb/legal/terms-of-service).

### Wget с cookies: только для разовой проверки

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

1. **Browsertrix** — поведение для Facebook раскрывает комментарии к постам и фото при обходе страницы.
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
- [Документация Browsertrix Crawler](https://crawler.docs.browsertrix.com/), [поведения для сайтов](https://crawler.docs.browsertrix.com/user-guide/behaviors/)
- [Делегированный регламент (ЕС) 2025/2050](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32025R2050) — доступ исследователей к данным по ст. 40 DSA
- [ArchiveWeb.page](https://archiveweb.page/)

## Связанные материалы

- [Как сохранить данные из Facebook](/kb/instruments/data-take-out/dto-facebook) — архив своего аккаунта
- [Instagram](/kb/instruments/social-media/instagram) — другая площадка Meta с теми же ограничениями
- [Mastodon, Bluesky, Threads](/kb/instruments/social-media/mastodon) — Threads API
- [Browsertrix](/kb/instruments/tools/browsertrix) — копия страницы в WARC/WACZ
- [Архивация страниц, которые видны после входа](/kb/guides/authenticated-crawling) — профиль браузера и cookies
- [F(b)arc](/kb/instruments/social-media/fbarc) — архивный инструмент для Graph API
- [Закрытые API, площадки и инструменты](/kb/instruments/social-media/dead-platforms) — CrowdTangle и другие закрытые интерфейсы
- [Методика архивации соцсетей](/kb/instruments/social-media/methodology) — отдельный аккаунт, паспорт сбора, хранение
- [Архивация социальных сетей](/kb/instruments/social-media)
