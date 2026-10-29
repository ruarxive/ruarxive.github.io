---
title: Архивация Twitter/X
sidebar_label: Twitter/X
description: "Как сохранить Twitter/X в 2026 году: архив своего аккаунта, платный API и twarc, снимки постов в Wayback Machine, Auto-Archiver с хешами, медиа через yt-dlp и gallery-dl, Browsertrix, данные Community Notes."
last_update:
  date: 2026-10-29
keywords: [twitter, x, x.com, twarc, wayback-machine, yt-dlp, gallery-dl, browsertrix, auto-archiver, community-notes]
---

# Архивация Twitter/X

С 2023 года API X для сбора данных платный. Массовый сбор теперь идёт только через него, например [twarc](/kb/instruments/social-media/twarc). Без API в 2026 году работают архив своего аккаунта, снимки отдельных постов и скачивание медиа из конкретных постов.

В России сайт X заблокирован Роскомнадзором 4 марта 2022 года ([Интерфакс](https://interfax.com/newsroom/top-stories/75547/)), см. [ограничения доступа в России](/kb/instruments/social-media#ограничения-доступа-в-россии). Советов по обходу блокировок база не даёт.

## Какой способ для какой задачи

| Задача | Способ | Результат |
| :--- | :--- | :--- |
| Свои посты, личные сообщения, медиа | [Архив X](#свой-аккаунт) | ZIP: HTML-просмотрщик и данные |
| Посты по запросу или аккаунту, ветки обсуждений | [twarc](/kb/instruments/social-media/twarc) и платный API | JSONL |
| Пост уже удалён | [Wayback Machine](#wayback-machine) | ссылка на снимок |
| Зафиксировать пост с хешами | [Auto-Archiver](#auto-archiver-пост-с-хешами) | медиа, метаданные, SHA-256 |
| Видео из поста, запись Spaces | [yt-dlp](#медиа-yt-dlp-и-gallery-dl) | mp4, `*.info.json` |
| Картинки поста; медиа всей ленты | [gallery-dl](#медиа-yt-dlp-и-gallery-dl), для ленты — cookies своего аккаунта | файлы, JSON |
| Заметки сообщества (Community Notes) | [открытая выгрузка](#данные-community-notes) | TSV |
| Вид поста или профиля | [Browsertrix](#браузерный-снимок) | WACZ |

## Что стало с API в 2023–2026 годах

| Когда | Что произошло | Источник |
| :--- | :--- | :--- |
| Февраль 2023 | Бесплатный доступ к API v1.1 и v2 и программа Academic Research закрыты, подробнее — [закрытые API](/kb/instruments/social-media/dead-platforms#закрытые-api) | TechCrunch: [01.02.2023](https://techcrunch.com/2023/02/01/twitter-to-end-free-access-to-its-api/), [14.02.2023](https://techcrunch.com/2023/02/14/twitters-restrictive-api-may-leave-researchers-out-in-the-cold/) |
| 29 марта 2023 | Новые уровни: Free только для публикации, Basic за $100 в месяц с 10 000 запросов на чтение, Enterprise | [TechCrunch](https://techcrunch.com/2023/03/29/twitter-announces-new-api-with-only-free-basic-and-enterprise-levels/) |
| 30 октября 2024 | Basic подорожал до $200 в месяц, Pro остался за $5000 | [TechCrunch](https://techcrunch.com/2024/10/30/x-makes-its-basic-api-tier-more-costly-launches-annual-subscriptions/) |
| 20 октября 2025 | Закрытый пилот оплаты за использование | [X API changelog](https://docs.x.com/changelog) |
| 5 декабря 2025 | Еврокомиссия оштрафовала X на €120 млн по DSA, в том числе за то, что X не даёт исследователям доступ к публичным данным | [Еврокомиссия](https://digital-strategy.ec.europa.eu/en/news/commission-fines-x-eu120-million-under-digital-services-act) |
| 6 февраля 2026 | Оплата за использование открыта всем: кредиты покупаются заранее и списываются за каждый объект. Тарифы Basic и Pro сохранены, их подписчики могут перейти на новую модель | [X API changelog](https://docs.x.com/changelog) |
| 15 июля 2026 | Комиссия приняла план X: бесплатный доступ для исследователей, отвечающих условиям DSA. Условия X должны прямо сказать, что таким исследователям скрейпинг публичных данных не запрещён. На выполнение — шесть месяцев | [Еврокомиссия](https://digital-strategy.ec.europa.eu/en/news/commission-accepts-xs-corrective-measures-terminate-breaches-dsa) |
| 24 августа 2026 | X Corp. потребовала удалить экземпляры Nitter | [Закрытые API и площадки](/kb/instruments/social-media/dead-platforms#заброшенные-инструменты) |

Текущие цены и лимит на чтение — на странице [twarc](/kb/instruments/social-media/twarc) и в [X API pricing](https://docs.x.com/x-api/getting-started/pricing).

## Свой аккаунт

Архив своих данных запрашивают в настройках: [x.com/settings/download_your_data](https://x.com/settings/download_your_data). В архиве посты, личные сообщения, медиафайлы, подписчики и списки. Пошагово — [Как сохранить данные из Twitter (X)](/kb/instruments/data-take-out/dto-twitter).

После удаления аккаунта официальная выгрузка невозможна. Запросите архив заранее.

## Публичные посты

### Платный API

Для выборок по запросу, ленте аккаунта или ветке обсуждения нужен платный API. Команды `twarc2 search`, `timeline` и `conversation` описаны на странице [twarc](/kb/instruments/social-media/twarc).

### Wayback Machine

Снимки поста ищут по его адресу через CDX API. Старые снимки лежат под `twitter.com`, новые — под `x.com`. Проверяйте оба адреса:

```bash
curl "https://web.archive.org/cdx/search/cdx?url=twitter.com/USER/status/ID&output=json&fl=timestamp,original,statuscode&limit=20"
curl "https://web.archive.org/cdx/search/cdx?url=x.com/USER/status/ID&output=json&fl=timestamp,original,statuscode&limit=20"

# последний успешный снимок
curl "https://web.archive.org/cdx/search/cdx?url=x.com/USER/status/ID&filter=statuscode:200&fl=timestamp,original&limit=-1"
```

Снимок открывается по адресу `https://web.archive.org/web/TIMESTAMP/ORIGINAL` из полей ответа. Запросы проверены на посте `jack/status/20`: под `twitter.com` есть снимки 2008 года, под `x.com` — снимки с 2024 года, последний — от 14 октября 2026 года.

Выборка по префиксу (`twitter.com/USER/status/`) возвращает строки о повторных снимках одних и тех же адресов: на проверке в первых 500 строках было 14 разных адресов. С `collapse=urlkey` такой запрос завершился страницей «Temporarily Offline». Для больших выборок нужна постраничная выдача `resumeKey`. Как отправить пост на сохранение и обходить большие выборки — на странице [Wayback Machine API](/kb/instruments/tools/wayback-api).

### archive.ph

[archive.ph](/kb/instruments/tools/archive-ph) быстро сохраняет отдельный пост. С 2026 года его снимки нельзя считать доказательством: оператор сервиса изменял уже сохранённые снимки ([Ars Technica](https://arstechnica.com/tech-policy/2026/02/wikipedia-bans-archive-today-after-site-executed-ddos-and-altered-web-captures/)). Важный пост сохраняйте ещё и в Wayback Machine или в собственный WACZ.

### Auto-Archiver: пост с хешами

[Auto-Archiver](/kb/instruments/tools/auto-archiver) сохраняет пост по ссылке: медиафайлы, метаданные и хеш SHA-256 каждого файла. Посты X обрабатывает модуль `generic_extractor`. Для X в нём есть отдельный обработчик на основе экстрактора yt-dlp. Ключи API ему не нужны.

Минимальный `secrets/orchestration.yaml` для отдельных постов:

```yaml
steps:
  feeders:
  - cli_feeder
  extractors:
  - generic_extractor
  enrichers:
  - hash_enricher
  databases:
  - csv_db
  storages:
  - local_storage
  formatters:
  - html_formatter

local_storage:
  save_to: ./local_archive

hash_enricher:
  algorithm: SHA-256
```

```bash
auto-archiver --config secrets/orchestration.yaml -- "https://x.com/USER/status/ID"
```

- Если yt-dlp не получил пост, обработчик обращается к стороннему сервису `api.fxtwitter.com`. Адрес поста при этом уходит третьей стороне.
- Модуль `twitter_api_extractor` работает через официальный API. Ему нужны bearer-токены или ключи приложения X, то есть платный доступ.
- Конфигурация по умолчанию включает модуль обхода антибот-защиты. В примере выше его нет; не добавляйте его, см. [Auto-Archiver](/kb/instruments/tools/auto-archiver).

> Конфигурация сверена с исходным кодом Auto-Archiver 1.2.9 (`modules/generic_extractor/twitter.py`, `cli_feeder`, `hash_enricher`, `twitter_api_extractor`), октябрь 2026.

### Медиа: yt-dlp и gallery-dl

Оба инструмента работают через веб-интерфейс X, а не через официальный API. При изменениях на стороне X они могут перестать работать до выхода новой версии.

[yt-dlp](/kb/instruments/tools/yt-dlp) скачивает видео по ссылке на пост, трансляцию или запись Spaces. Ленту профиля он не обходит.

```bash
yt-dlp --write-info-json "https://x.com/USER/status/ID"
```

Публичный пост скачивается без входа: так проверено в октябре 2026 года. Посты с пометкой о чувствительном содержании и посты закрытых аккаунтов требуют входа. Добавьте `--cookies-from-browser firefox` с cookies своего аккаунта. Запись Spaces скачивается, только если автор оставил её доступной.

[gallery-dl](/kb/instruments/tools/gallery-dl) сохраняет картинки и видео вместе с метаданными:

```bash
# один пост: работает без входа
gallery-dl --write-metadata "https://x.com/USER/status/ID"

# медиа всей ленты: нужны cookies своего аккаунта
gallery-dl --cookies-from-browser firefox --write-metadata \
  --download-archive x-USER.sqlite3 "https://x.com/USER/media"
```

Без cookies на ленте gallery-dl останавливается с ошибкой `AuthRequired: authenticated cookies needed to access this timeline`. Вход по логину и паролю gallery-dl для X больше не поддерживает, только cookies из браузера. Берите отдельный аккаунт, см. [методику](/kb/instruments/social-media/methodology#аккаунт-и-сессии).

> Команды сверены с `--help` и `extractor/twitter.py` yt-dlp 2026.10.26 и gallery-dl 1.32.18. Пост и лента проверены без cookies в октябре 2026 года.

### Данные Community Notes

X публикует все заметки сообщества на странице [Download Data](https://x.com/i/communitynotes/download-data) сайта Community Notes. По [документации](https://communitynotes.x.com/guide/en/under-the-hood/download-data):

- пять таблиц: заметки, оценки, история статусов заметок, статусы участников, запросы заметок;
- формат TSV со строкой заголовков, таблицы связываются по `noteId`;
- снимок выходит ежедневно, без гарантий по времени, и включает данные старше 48 часов;
- удалённые заметки и оценки из следующих выгрузок исчезают. В истории статусов остаются метаданные без текста заметки.

Каждая заметка ссылается на пост полем `tweetId`. Сохраняйте выгрузки с датой: удалённых заметок в новых версиях не будет.

## Исследовательский доступ

Программа Academic Research закрыта в 2023 году. В ЕС исследователи, отвечающие условиям DSA, могут запрашивать у X доступ к публичным данным. В декабре 2025 года Еврокомиссия признала, что процедура X ставит им лишние барьеры. В июле 2026 года X обязалась сделать такой доступ бесплатным и ускорить рассмотрение заявок, см. хронологию выше.

## Браузерный снимок

[Browsertrix](/kb/instruments/tools/browsertrix) сохраняет пост или профиль так, как их видит читатель. Для X в нём есть поведение `siteSpecific`, оно включено по умолчанию. По [документации](https://crawler.docs.browsertrix.com/user-guide/behaviors/) оно:

- прокручивает ленту и профиль, открывает отдельные посты и цитируемые посты;
- загружает картинки, аудио и видео в полном размере;
- ставит в очередь внешние ссылки из постов архивируемого аккаунта;
- открывает вкладки медиа и скрытый «чувствительный» контент — только с профилем браузера, где выполнен вход.

```bash
# один пост, без входа
docker run --rm -v $PWD/crawls:/crawls/ \
    webrecorder/browsertrix-crawler:1.15.2 crawl \
    --url "https://x.com/USER/status/ID" \
    --scopeType page \
    --generateWACZ \
    --collection x-USER-ID

# профиль и вкладка медиа, с профилем браузера своего аккаунта
docker run --rm -v $PWD/crawls:/crawls/ \
    webrecorder/browsertrix-crawler:1.15.2 crawl \
    --url "https://x.com/USER" \
    --url "https://x.com/USER/media" \
    --scopeType page \
    --profile /crawls/profiles/x-profile.tar.gz \
    --behaviorTimeout 600 \
    --generateWACZ \
    --collection x-USER
```

- По умолчанию поведение работает на странице не дольше 90 секунд. Для длинной ленты этого мало, поэтому в примере `--behaviorTimeout 600`.
- Ссылки, которые поведение ставит в очередь, краулер берёт только в пределах области обхода. При `--scopeType page` их пропускает. Флаг `--alwaysAddBehaviorLinks` снимает это ограничение, но тогда краулер пойдёт и по внешним ссылкам из постов.
- Как создать профиль браузера — раздел [«Аутентификация»](/kb/instruments/tools/browsertrix#аутентификация).

> Флаги сверены с `cli-options.md` и `behaviors.md` Browsertrix Crawler 1.15.2 и исходным кодом browsertrix-behaviors 0.15.1 (`src/site/twitter.ts`), октябрь 2026. Запуск на X не проверялся.

## Что больше не работает

snscrape, Twint и Nitter собирали Twitter без API. Все три не работают, см. [заброшенные инструменты](/kb/instruments/social-media/dead-platforms#заброшенные-инструменты). Рецепт для X без ключа API и без своего аккаунта, скорее всего, устарел.

## Ограничения

- Удалённый пост не вернёт ни один способ, если его не сохранили раньше. Проверьте Wayback Machine.
- Посты закрытого аккаунта видны только его подписчикам. Сохранять их можно только с согласия автора, см. [условия использования сервисов](/kb/legal/terms-of-service).
- Лента в gallery-dl и вкладки медиа в Browsertrix требуют входа. Архив покажет то, что видно вашему аккаунту.

## Хранение результата

- Записывайте ID поста. Он одинаков для `twitter.com` и `x.com`, по нему ищут снимки и гидратируют данные через `twarc2 hydrate`.
- Для снимков Wayback Machine храните полный адрес снимка с меткой времени, а не только адрес поста.
- WACZ, снятый с профилем браузера, содержит данные вашей сессии. Не публикуйте его без проверки.

Общие правила хранения и контрольные суммы — в [методике](/kb/instruments/social-media/methodology#хранение).

## Twitter в практике Ruarxive

- В хранилище есть выгрузка [`OGDHub/gtwitter`](https://cdn.ruarxive.org/public/OGDHub/gtwitter/): 53 CSV-файла по официальным аккаунтам, 24,8 МБ, дата файлов — 17.08.2013. Есть также список аккаунтов в Google Sheets и база «Архивы государственных твиттеров» на hubofdata. Подробнее — [Сохранённые государственные ресурсы](/kb/projects/preserved-government#аккаунты-в-социальных-сетях).
- В марте 2022 года проект архивировал среди прочего аккаунты Twitter ([#5](https://t.me/ruarxive/5)), см. [Планы архивации](/kb/archive-plans).

## Право

- Имена, аватары и тексты пользователей X — [персональные данные](/kb/legal/personal-data).
- Публичный пост не даёт права на его новую публикацию, см. [авторское право](/kb/legal/copyright).
- [Условия X](https://x.com/en/tos) в редакции от 9 октября 2026 года запрещают краулинг и скрейпинг без письменного согласия X. За доступ к более чем миллиону постов в сутки они устанавливают неустойку $15 000 за каждый миллион. Как к правилам площадок относится архивация — [условия использования сервисов](/kb/legal/terms-of-service).
- Данные, полученные через API, передают третьим лицам в основном в виде ID, см. [twarc](/kb/instruments/social-media/twarc).

## Ресурсы

- [X API: цены](https://docs.x.com/x-api/getting-started/pricing), [журнал изменений](https://docs.x.com/changelog)
- [Условия X](https://x.com/en/tos)
- [Документация CDX Server API](https://github.com/internetarchive/wayback/blob/master/wayback-cdx-server/README.md)
- [Browsertrix Crawler: поведения](https://crawler.docs.browsertrix.com/user-guide/behaviors/)
- [Community Notes: выгрузка данных](https://communitynotes.x.com/guide/en/under-the-hood/download-data)
- [Решения Еврокомиссии по X](https://digital-strategy.ec.europa.eu/en/news/commission-accepts-xs-corrective-measures-terminate-breaches-dsa)

## Связанные материалы

- [twarc](/kb/instruments/social-media/twarc) — платный API X, команды и цены
- [Как сохранить данные из Twitter (X)](/kb/instruments/data-take-out/dto-twitter) — архив своего аккаунта
- [Закрытые API, площадки и инструменты](/kb/instruments/social-media/dead-platforms)
- [Wayback Machine API](/kb/instruments/tools/wayback-api), [archive.ph](/kb/instruments/tools/archive-ph)
- [Auto-Archiver](/kb/instruments/tools/auto-archiver), [Browsertrix](/kb/instruments/tools/browsertrix)
- [yt-dlp](/kb/instruments/tools/yt-dlp), [gallery-dl](/kb/instruments/tools/gallery-dl)
- [Mastodon, Bluesky, Threads](/kb/instruments/social-media/mastodon) — открытые платформы
- [Методика архивации соцсетей](/kb/instruments/social-media/methodology)
