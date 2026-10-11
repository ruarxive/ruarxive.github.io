---
title: Internet Archive — крупнейший мировой веб-архив
sidebar_label: Internet Archive
sidebar_position: 2
description: "Internet Archive, Wayback Machine, SavePageNow, Memento, S3 API, Russian Independent Media Archive (RIMA), доступ при блокировках, работа с коллекциями archive.org."
last_updated: 2026-11-09
keywords: [internet-archive, archive.org, wayback, memento, s3, rima, savepagenow]
---

# Internet Archive

[Internet Archive](https://archive.org/) — некоммерческая библиотека, основанная Брюстером Кейлом в 1996 году. Это крупнейший в мире веб-архив, включающий Wayback Machine, текстовые книги, аудио, видео и программное обеспечение.

## Wayback Machine

[Wayback Machine](https://web.archive.org/) — основной инструмент для просмотра сохранённых версий веб-страниц. По состоянию на 2024–2025 годы содержит более **800 миллиардов веб-страниц**. Это самая большая публичная база исторических копий веба.

### SavePageNow — добавить страницу

Любой пользователь может сохранить страницу через [web.archive.org/save/](https://web.archive.org/save/). Страница становится доступной постоянно, если не поступит обоснованный takedown-запрос.

Программный доступ: см. [Wayback Machine API](/kb/instruments/tools/wayback-api) — SavePageNow, CDX, Availability, Memento.

### Доступ в России

В разные годы `archive.org` блокировался в РФ Роскомнадзором:

- 2014–2015 — Wayback Machine;
- 2015 — весь Internet Archive;
- С 2016 — преимущественно открыт, но точечные блокировки продолжаются.

Для архивистов, работающих в РФ или для читателей из РФ:

- **VPN:** Lantern, Mullvad, Windscribe (протестированы сообществом).
- **Tor:** onion-зеркало `archive74yto3vwb4g4m.onion` (меняется, актуальный адрес — на сайте IA).
- **Brave Search / DuckDuckGo** иногда возвращают Wayback-версии.
- **Зеркала сообщества:** [Yandex ETVB archive-catalog](https://yandex.ru/support/archive/) — неполноценная замена, но иногда полезна.

## RIMA — Russian Independent Media Archive

С 2022 года Internet Archive при поддержке Bard College и PEN America ведёт **Russian Independent Media Archive (RIMA)** — систематическую архивацию российских независимых СМИ:

- архивируются сайты и соцсети изданий в изгнании («Медуза», «Новая-Европа», «Холод», «Важные истории», «Дождь» и др.);
- дополнительно — правительственные сайты и региональные издания;
- материалы публикуются в виде `wacz`-коллекций с быстрым доступом через ReplayWeb.page.

RIMA — ключевой ресурс для исследований современной России и важный партнёр для Ruarxive. Дублирование архивов в RIMA и в Ruarxive даёт страховку в обе стороны.

**Адрес:** [archive.org/details/russian-independent-media-archive](https://archive.org/details/russian-independent-media-archive).
**Команда:** Twitter-аккаунт [@rima_archive](https://x.com/rima_archive) (или эквивалент в Mastodon).

## S3-совместимый API

archive.org предоставляет S3-подобный API для прямого доступа к файлам. Это позволяет скачивать целые коллекции и загружать свои.

### Получить список коллекций Ruarxive

```bash
ia search 'collection:ruarxive'
```

### Скачать конкретный архив

```bash
ia download echo-of-moscow
```

### Загрузить свой WARC

```bash
ia upload my-archive my-archive.warc.gz \
  --metadata "mediatype:web" \
  --metadata "collection:ruarxive" \
  --metadata "creator:Ruarxive" \
  --metadata "licenseurl:https://creativecommons.org/publicdomain/zero/1.0/"
```

Подробности — [Internet Archive CLI (ia)](/kb/instruments/tools/internet-archive-cli).

### Bulk data

Часть коллекций доступна как «bulk data» — большие `tar.gz`/WARC/WACZ-файлы для исследователей. Списки — на странице каждой коллекции (раздел «DOWNLOAD OPTIONS»).

## API и протоколы

| Протокол | Зачем | Документация |
|:---|:---|:---|
| **Wayback UI** | Человеческий просмотр | [web.archive.org](https://web.archive.org/) |
| **SavePageNow** | Сохранить страницу | [Wayback Machine API](/kb/instruments/tools/wayback-api) |
| **CDX API** | Поиск по индексу | [Wayback Machine API](/kb/instruments/tools/wayback-api) |
| **Availability API** | Есть ли снимок? | [Wayback Machine API](/kb/instruments/tools/wayback-api) |
| **Memento (RFC 7089)** | Стандарт time travel | [Wayback Machine API](/kb/instruments/tools/wayback-api) |
| **IA S3 API** | Загрузка и скачивание | [ia CLI](/kb/instruments/tools/internet-archive-cli) |
| **OAI-PMH** | Metadata harvesting | [archive.org/help/oai.php](https://archive.org/help/oai.php) |

## Ruarxive и Internet Archive

Часть архивов Ruarxive загружается в Internet Archive. Это создаёт дополнительную страховку: данные хранятся в двух независимых инфраструктурах.

| Ресурс | Адрес |
|:---|:---|
| Канал Ruarxive на IA | [archive.org/details/@ruarxive](https://archive.org/details/@ruarxive) |
| Echo of Moscow | [archive.org/details/echo-of-moscow](https://archive.org/details/echo-of-moscow) |
| Коллекции RIMA | [archive.org/details/russian-independent-media-archive](https://archive.org/details/russian-independent-media-archive) |
| Список всех архивов Ruarxive | [cdn.ruarxive.org/public/allarchives.csv](https://cdn.ruarxive.org/public/allarchives.csv) |

### Совместная работа

Если вы архивируете ресурс, потенциально полезный для мирового сообщества (исследования прав человека, журналистика, культура, история), рассмотрите **двойную загрузку** — копию в IA и локально в Ruarxive. Это упрощает доступ для иностранных исследователей.

## Ограничения

- **Охват ограничен популярными ресурсами** (по критериям цитируемости). Для региональных и малоизвестных сайтов лучше делать локальный архив.
- **Не всегда сохраняет медиа** и интерактивные элементы — зависит от настроек capture.
- **Блокировки в РФ** — частичные, решаемые через VPN.
- **Rate limits в 2024–2026**: Wayback Machine ввёл дополнительные ограничения для защиты от AI-скрейпинга. Программный массовый доступ может быть замедлен.
- **Партнёрские требования**: некоторые издатели (NYT, Reddit) блокируют Wayback Machine от сохранения их материалов.

## Когда использовать Internet Archive

✅ Подходит:

- **Глобальные ресурсы и международные СМИ.**
- **Долгосрочное хранение** (Internet Archive работает с 1996 года).
- **Восстановление давно исчезнувшего сайта.**
- **Дополнительная точка хранения** для собственных архивов.
- **Поиск через CDX/Memento** в существующей коллекции.

❌ Не подходит:

- **Архивация текущих региональных сайтов** — лучше использовать собственный кроулер.
- **Хранение чувствительных данных** (персональные данные, медицинские записи) — у IA открытый доступ.
- **Массовый автоматический сбор** — даёт 429-е ответы и блокировки.
- **Юридически значимые документы** — для них [Perma.cc](/kb/similar/perma-cc) или собственный архив.

## Юридические аспекты загрузки на IA

> [!WARNING]
> Загружая WARC на archive.org, вы делаете его **публично доступным**. Убедитесь, что:
>
> - У вас есть **права** на распространение контента.
> - Вы **не нарушаете** законы о персональных данных, авторском праве, ToS сайтов.
> - **Лицензия** в метаданных соответствует действительности.
>
> Подробности: [Правовые вопросы](/kb/legal/copyright).

Рекомендуемые лицензии:

- `cc-by-4.0` — для большинства исследовательских материалов.
- `cc0-1.0` — для общественно-значимого контента (правительственные сайты, открытые данные, общественное достояние).
- `cc-by-nc-4.0` — если есть ограничения коммерческого использования.

## Ресурсы

- [archive.org](https://archive.org/) — главный сайт.
- [web.archive.org](https://web.archive.org/) — Wayback Machine.
- [archive.org/developers](https://archive.org/developers/) — портал для разработчиков.
- [IA блог](https://blog.archive.org/) — обновления и новости.
- [Wayback Machine FAQ](https://help.archive.org/help/category/wayback-machine/).
- [Wayback Machine API — справочник](/kb/instruments/tools/wayback-api) — детальный разбор API.
- [Internet Archive CLI (ia)](/kb/instruments/tools/internet-archive-cli) — инструмент для работы с IA.

## Связанные материалы

- [Wayback Machine API](/kb/instruments/tools/wayback-api) — детальный справочник API.
- [Common Crawl](/kb/similar/common-crawl) — открытый краул-датасет.
- [Perma.cc](/kb/similar/perma-cc) — для академического цитирования.
- [ArchiveTeam](/kb/similar/archiveteam) — волонтёрское движение за экстренные архивы.
- [Похожие проекты — обзор](/kb/similar) — карта открытых сервисов.
- [Правовые вопросы архивации](/kb/legal/copyright) — что можно загружать.
