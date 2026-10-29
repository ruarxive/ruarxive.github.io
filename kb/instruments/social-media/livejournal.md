---
title: Архивация Живого Журнала
sidebar_label: Живой Журнал
description: "Как сохранить журнал LiveJournal в 2026 году: экспорт своих записей по месяцам, ленты RSS и Atom, обход журнала через wget и Browsertrix, страницы комментариев, ArchiveTeam и Wayback Machine."
last_update:
  date: 2026-10-29
keywords: [livejournal, жж, живой журнал, rss, atom, wget, browsertrix, комментарии, archiveteam]
---

# Архивация Живого Журнала

Живой Журнал (LiveJournal, ЖЖ) — блог-платформа: каждый журнал живёт на своём поддомене `имя.livejournal.com`. Записи, архив по датам и комментарии открываются без входа в аккаунт. Поэтому журнал сохраняют как сайт, а свой журнал можно ещё и выгрузить встроенным экспортом.

Сервис предоставляет ООО «СИМ» ([пользовательское соглашение](https://www.livejournal.com/legal/tos-ru.bml), редакция от 18.03.2026). С 29 декабря 2025 года новые публичные записи и комментарии могут оставлять только пользователи, которые выполняют одно из условий. Это пакет «Профессиональный», привязанный Сбер ID, социальный капитал от 500 или блог из реестра блогеров Роскомнадзора либо верифицированный ([объявление ru_news](https://ru-news.livejournal.com/80899.html)). По тому же объявлению старые записи и комментарии остаются доступны для чтения.

## Какой способ для какой задачи

| Задача | Способ | Результат |
| :--- | :--- | :--- |
| Свои записи без комментариев | [Экспорт журнала](#экспорт-своего-журнала) | XML или CSV, по месяцу за раз |
| Новые записи чужого журнала, мониторинг | [RSS или Atom](#rss-и-atom) | XML, 25 последних записей |
| Журнал целиком как сайт | [wget с WARC](#wget) | WARC |
| Журнал так, как его видит читатель | [Browsertrix](#browsertrix) | WACZ |
| Комментарии к записям | [страницы комментариев](#комментарии) в составе обхода | WARC/WACZ |
| Журнал уже удалён или закрыт | [Wayback Machine и ArchiveTeam](#если-журнал-уже-удалён) | — |

Отдельного экстрактора Живого Журнала в gallery-dl 1.32.18 нет. Экстрактор LiveJournal в yt-dlp 2026.10.26 рассчитан только на видеоальбомы и помечен в коде как неработающий (`_WORKING = False`).

## Экспорт своего журнала

По [FAQ Живого Журнала](https://www.livejournal.com/support/faq/8.html) (обновлён 28.02.2020) страница Export Journal выгружает **один месяц за раз и без комментариев**:

- адрес — `https://www.livejournal.com/export.bml`, без входа он перенаправляет на страницу логина;
- формат — CSV или XML;
- флажок Event — основной текст записи, его оставляют включённым;
- загрузить экспорт обратно в Живой Журнал нельзя.

Комментарии к своим записям FAQ предлагает сохранять страницами записей. Так же их забирает обход журнала, см. [ниже](#комментарии).

## RSS и Atom

Адреса лент описаны на странице [LiveJournal Bot Policy](https://www.livejournal.com/bots/):

- `https://имя.livejournal.com/data/rss`
- `https://имя.livejournal.com/data/atom`

В проверке 29.10.2026 (`curl` двух публичных журналов) обе ленты отдали по 25 последних записей. RSS-элемент содержит полный HTML текста записи со ссылками на картинки и число комментариев в `lj:reply-count`. Самих комментариев в ленте нет.

Лента подходит для мониторинга: по ней видно новые адреса записей. Для архива всего журнала её мало.

## Обход журнала

Записи, календарь и страницы ленты журнала отдаются обычным HTML. Старые записи открываются параметром `?skip=N` и архивом по датам `/ГГГГ/ММ/ДД/`. Страница записи в нашей проверке весила 0,7–0,8 МБ HTML без картинок.

Правила для автоматического доступа на той же странице [Bot Policy](https://www.livejournal.com/bots/):

- не больше пяти соединений в секунду и без многопоточности;
- в User-Agent — адрес электронной почты для связи и, желательно, URL организации;
- повторные частые запросы одного адреса блокируются.

По [вики ArchiveTeam](https://wiki.archiveteam.org/index.php/LiveJournal) блокировка выглядит как ошибка 403 и длится около месяца.

### wget

```bash
wget --recursive --level=inf --no-parent \
     --page-requisites --span-hosts \
     --domains=JOURNAL.livejournal.com,ic.pics.livejournal.com \
     --reject-regex='(replyto=|mode=reply|/friends|/feed/|\\")' \
     --warc-file=JOURNAL --warc-cdx \
     --wait=1 --random-wait \
     --user-agent="archive-bot (+https://example.org/; you@example.org)" \
     https://JOURNAL.livejournal.com/
```

- `--domains` держит обход в журнале и пускает только хост картинок `ic.pics.livejournal.com`.
- `replyto=` и `mode=reply` — формы ответа, `/friends` и `/feed/` — лента друзей с чужими записями.
- `\\"` отсекает мусорные адреса. В пробном запуске wget нашёл ссылки внутри встроенного в страницу JSON и запросил их как пути вида `/%5C%22https://…`.

> Команда проверена пробным запуском GNU Wget 1.25.0 с `--level=1` на журнале `memo-projects` (октябрь 2026). Флаги и запись WARC — на странице [Wget](/kb/instruments/tools/wget).

### Browsertrix

[Browsertrix](/kb/instruments/tools/browsertrix) открывает страницы в браузере: комментарии и вёрстка сохраняются так, как их рисуют скрипты.

```bash
docker run --rm -v $PWD/crawls:/crawls/ \
    webrecorder/browsertrix-crawler:1.15.2 crawl \
    --url https://JOURNAL.livejournal.com/ \
    --scopeType host \
    --exclude "replyto=|mode=reply|/friends|/feed/" \
    --userAgentSuffix "+https://example.org/; you@example.org" \
    --robots --reportSkipped \
    --generateWACZ \
    --collection JOURNAL-lj
```

`--scopeType host` ограничивает обход поддоменом журнала.

> Флаги сверены с `cli-options.md` Browsertrix Crawler 1.15.2 (октябрь 2026). Полный обход журнала этой командой не запускался.

## Комментарии

Проверка 29.10.2026 на записи с 81 комментарием, журнал в оформлении по умолчанию:

| Адрес | Что на странице |
| :--- | :--- |
| `запись.html` | пять последних комментариев |
| `запись.html?view=comments` или `?page=1` | первая страница дерева: 52 комментария, из них 24 свёрнуты |
| `запись.html?page=2`, `?page=3` | следующие страницы |
| `запись.html?thread=ID` | свёрнутая ветка; ссылки на неё есть на странице |

Комментарии приходят в HTML страницы как JSON и рисуются скриптом. В журналах со своим оформлением адреса могут отличаться: проверьте на одной записи до обхода.

`robots.txt` журнала запрещает адреса записей с параметрами (`Disallow: *.html?`). С `--robots` Browsertrix пропустит страницы комментариев, и в архив попадут только пять последних комментариев к каждой записи. Отсечённые адреса покажет `reports/skippedPages.jsonl`. wget 1.25.0 шаблоны со звёздочкой не разбирает: правило сравнивается как начало пути. В пробном запуске он скачал `?view=comments`. По умолчанию Ruarxive соблюдает `robots.txt`; собирать комментарии вопреки этому правилу — осознанное решение для журнала под угрозой исчезновения, его записывают в паспорт сбора ([позиция проекта](/kb/legal/terms-of-service#robotstxt)). Как устроены такие правила — [robots.txt для архивиста](/kb/guides/robots-txt-for-archiving).

## Если журнал уже удалён

- **Wayback Machine.** Проверьте адрес журнала и записей через [CDX API](/kb/instruments/tools/wayback-api) с префиксом `имя.livejournal.com/*`.
- **ArchiveTeam.** Состояние проекта по LiveJournal — на странице [ArchiveTeam](/kb/similar/archiveteam#русскоязычные-площадки). Отдельные журналы ArchiveTeam снимал через ArchiveBot: такие WARC лежат на archive.org в коллекции [`archivebot`](https://archive.org/search?query=livejournal+AND+collection%3Aarchivebot), найденные снимки — 2016–2018 годов.

## Хранение результата

- Храните рядом WARC или WACZ обхода, файлы экспорта по месяцам и ленту RSS на дату сбора.
- Запишите в паспорт сбора адрес журнала, версию wget или Browsertrix, User-Agent и решение по `robots.txt`.
- Паспорт и контрольные суммы — по [методике](/kb/instruments/social-media/methodology#хранение).

## Право

- [Пользовательское соглашение](https://www.livejournal.com/legal/tos-ru.bml) запрещает без специального разрешения Администрации использовать автоматические скрипты (боты, краулеры) для сбора информации. Страница Bot Policy при этом описывает форматы и правила для ботов. Как к этому относиться — [условия использования сервисов](/kb/legal/terms-of-service).
- Имена, юзерпики и тексты комментаторов — [персональные данные](/kb/legal/personal-data).
- Записи и фотографии принадлежат авторам: копия журнала не даёт права на её публикацию, см. [авторское право](/kb/legal/copyright).

## Практика Ruarxive

В списке сбора 2021 года по «Мемориалу» есть блог `memo-projects.livejournal.com`: инструмент wpull, формат WARC. В индексе доменов CDN этого каталога нет. Подробнее — [разбор кейса](/kb/case-studies/memorial-rusnano-2021).

## Ресурсы

- [FAQ: How do I download all of my journal entries?](https://www.livejournal.com/support/faq/8.html)
- [LiveJournal Bot Policy](https://www.livejournal.com/bots/)
- [Пользовательское соглашение](https://www.livejournal.com/legal/tos-ru.bml)
- [LiveJournal: важные изменения](https://ru-news.livejournal.com/80899.html) — правила публикации с 29.12.2025
- [ArchiveTeam: LiveJournal](https://wiki.archiveteam.org/index.php/LiveJournal)

## Связанные материалы

- [Wget](/kb/instruments/tools/wget) — рекурсивная загрузка и WARC
- [Browsertrix](/kb/instruments/tools/browsertrix) — браузерный обход и WACZ
- [robots.txt для архивиста](/kb/guides/robots-txt-for-archiving)
- [Wayback Machine API](/kb/instruments/tools/wayback-api) — поиск исчезнувших страниц
- [ArchiveTeam](/kb/similar/archiveteam) — коллективные спасения сервисов
- [Срочная архивация](/kb/guides/emergency-archiving) — если журнал вот-вот закроют
- [Методика архивации соцсетей](/kb/instruments/social-media/methodology) — паспорт сбора, темп, хранение
