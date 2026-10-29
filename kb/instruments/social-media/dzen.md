---
title: Дзен
sidebar_label: Дзен
description: "Архивация Дзена: снимок статей и каналов с комментариями в Browsertrix, видео через yt-dlp, что yt-dlp не берёт и как Дзен перешёл от Яндекса к VK."
last_update:
  date: 2026-10-29
keywords: [дзен, dzen, яндекс дзен, zen.yandex.ru, browsertrix, yt-dlp]
---

# Дзен

Дзен (dzen.ru) — платформа статей, видео и коротких роликов. Раньше сервис назывался «Яндекс Дзен» и работал на `zen.yandex.ru`. Статьи и каналы сохраняют снимком в браузере, длинные видео — через yt-dlp.

## Какой способ для какой задачи

| Задача | Способ | Результат |
| :--- | :--- | :--- |
| Статья с комментариями | [Browsertrix](#снимок-статей-и-канала) по адресу `dzen.ru/a/<id>` | WARC/WACZ |
| Начало ленты канала, как его видит читатель | Browsertrix по адресу канала | WARC/WACZ |
| Длинное видео | [yt-dlp](#видео), адрес `dzen.ru/video/watch/<id>` | видеофайл, `info.json` |
| Все длинные видео канала | yt-dlp, адрес `dzen.ru/<канал>?tab=longs` | видеофайлы |
| Ролики `dzen.ru/shorts/<id>` | только снимок страницы | WARC/WACZ |
| Свои публикации перед удалением канала | те же снимок и yt-dlp | WARC/WACZ, видео |
| Канал или статья уже удалены | Wayback Machine по обоим доменам | — |

## Свои данные

Дзен больше не сервис Яндекса, см. [Yandex Data Takeout](/kb/instruments/data-take-out/dto-yandex#ограничения). В оглавлении справки Дзена на 29 октября 2026 года раздела о выгрузке своих данных нет.

[Справка об удалении канала](https://dzen.ru/help/ru/channel/how-to-delete-channel.html) предупреждает: канал удаляется вместе с аккаунтом, публикации восстановить нельзя. Дзен советует сохранить их заранее. Свои статьи и видео сохраняют теми же способами, что и чужие: снимком и yt-dlp.

Скачивание в мобильном приложении справка описывает как способ смотреть видео без интернета ([справка](https://dzen.ru/help/ru/users/functions/download.html)). Для архива берите yt-dlp.

## Видео

В yt-dlp видео Дзена обрабатывают два экстрактора: `dzen.ru` (одно видео) и `dzen.ru:channel` (канал). Оба принимают и старый домен `zen.yandex.ru`.

```bash
# одно видео
yt-dlp --write-info-json --write-thumbnail \
       --download-archive dzen-video.txt \
       -o "%(uploader)s/%(title)s [%(id)s].%(ext)s" \
       "https://dzen.ru/video/watch/VIDEO_ID"

# все длинные видео канала
yt-dlp --write-info-json --download-archive dzen-video.txt \
       -o "%(uploader)s/%(title)s [%(id)s].%(ext)s" \
       "https://dzen.ru/CHANNEL?tab=longs"
```

Канал с числовым id задают адресом `dzen.ru/id/<id>`. Мы проверили `--simulate` на видео 2021 года и на первом ролике вкладки `?tab=longs`. Адрес `dzen.ru/id/<id>` вернул список видео. Cookies нигде не понадобились.

Что yt-dlp не берёт (проверено):

- **Статьи** `dzen.ru/a/<id>` — экстрактор падает с ошибкой.
- **Ролики** `dzen.ru/shorts/<id>` и вкладку `?tab=shorts` — ошибка экстрактора или `No suitable extractor`.
- **Канал без `?tab=longs`.** Если в ленте канала есть статьи, yt-dlp получает их адреса и пропускает с ошибкой.
- **Комментарии** экстрактор не собирает, `--write-comments` их не даст.

Остальные флаги — на странице [yt-dlp](/kb/instruments/tools/yt-dlp).

> Команды сверены с yt-dlp 2026.10.26 (октябрь 2026).

## Снимок статей и канала

Мы проверили 29 октября 2026 года канал `dzen.ru/techinsider` и его статьи в чистом профиле Chrome, без входа:

- текст статьи и лента канала видны;
- комментарии к статье видны;
- комментировать можно только после входа. Это же пишет [справка о комментариях](https://dzen.ru/help/ru/users/comments/common.html).

Снимок делает [Browsertrix Crawler](/kb/instruments/tools/browsertrix). Адреса статей запишите в `crawls/seeds.txt`, по одному на строку:

```bash
docker run --rm -v $PWD/crawls:/crawls/ webrecorder/browsertrix-crawler:1.15.2 crawl \
    --seedFile /crawls/seeds.txt \
    --scopeType page \
    --behaviorTimeout 60 \
    --text to-pages \
    --generateWACZ \
    --collection dzen-articles
```

Что показал пробный обход:

- **Следующая статья.** При прокрутке Дзен подгружает следующую статью канала и меняет адрес. Browsertrix замечает это и останавливает прокрутку: `Location Changed, stopping scroll`.
- **Комментарии.** В итоговом тексте страницы в WARC есть блок комментариев статьи.
- **Страница канала** с настройками по умолчанию не дождалась загрузки: `Page load timed out, loading but slowly, skipping behaviors`. С `--waitUntil domcontentloaded` поведения запустились, но autoscroll пропущен: `Skipping autoscroll, page seems to not be responsive to scrolling events`. В архив попало только начало ленты.

Поэтому статьи передавайте списком адресов `dzen.ru/a/<id>`. Полного списка статей канала в нашей проверке не дал ни Browsertrix, ни yt-dlp.

У вкладок канала свои адреса: `?tab=articles` (статьи), `?tab=longs` (видео), `?tab=shorts` (ролики). Отдельного поведения для Дзена в browsertrix-behaviors 0.15.1 нет.

Wget и curl для Дзена не подходят. С браузерным User-Agent они получают вместо статьи промежуточную страницу `sso.passport.yandex.ru`, а обратно на статью ведёт JavaScript. Браузерный краулер проходит этот шаг сам.

RSS-ленты канала для чтения мы не нашли: в коде страниц канала и статьи ссылки на RSS нет. RSS в справке Дзена — это способ загружать в Дзен материалы своего сайта ([справка](https://dzen.ru/help/ru/website/rss-modify.html)).

> Флаги сверены с `cli-options.md` Browsertrix Crawler 1.15.2, обход проверен 29 октября 2026 года. Проверки шли не из российской сети: из России поведение сайта, в том числе промежуточная страница входа, может отличаться.

## От Яндекса к VK

- 12 сентября 2022 года VK закрыла сделку по покупке у Яндекса Дзена и Новостей ([ComNews, 12.09.2022](https://www.comnews.ru/content/222119/2022-09-12/2022-w37/vk-priobrela-dzen-i-novosti)).
- С 12 сентября 2022 года yandex.ru перенаправлял на dzen.ru — домен, который принадлежит VK ([Интерфакс, 16.09.2022](https://interfax.com/newsroom/top-stories/83166/)).
- Дзен сейчас есть в [списке проектов VK](https://vk.company/ru/projects/).
- Старые адреса `zen.yandex.ru/...` отвечают перенаправлением 302 на `dzen.ru/...` (проверено 29 октября 2026 года).

Для архивиста это значит одно: ищите материалы под обоими доменами — в старых ссылках, выгрузках и в [Wayback Machine](/kb/instruments/tools/wayback-api).

## Ограничения

- **Лента канала** в Browsertrix сохраняется частично, см. [выше](#снимок-статей-и-канала).
- **Ролики и фото.** yt-dlp берёт только длинные видео. В gallery-dl 1.32.18 экстрактора для Дзена нет. Ролики и картинки статей остаются только в снимке страницы.
- **Комментарии меняются.** Автор канала может удалить любой комментарий под своей публикацией и заблокировать комментатора ([справка](https://dzen.ru/help/ru/users/comments/common.html)). Снимок фиксирует состояние на момент обхода.
- **Удалённый канал** восстановить нельзя. Удалённое до сбора не возвращает ни один способ.

## Хранение результата

- В паспорте сбора укажите оба адреса материала: `dzen.ru` и, для старых публикаций, `zen.yandex.ru`.
- В имени видеофайла — id видео, тот же, что в адресе `video/watch/<id>`. По нему видео связывают со снимком канала.

Общие правила хранения и контрольные суммы — в [методике](/kb/instruments/social-media/methodology#хранение).

## Право

- Имена, аватары и тексты комментаторов — [персональные данные](/kb/legal/personal-data). Для архива статей канала профили комментаторов не нужны.
- Статьи и видео принадлежат авторам каналов, см. [авторское право](/kb/legal/copyright): сохранить для архива не значит опубликовать.
- Правила площадки об автоматическом сборе — в [условиях использования сервисов](/kb/legal/terms-of-service).

## Ресурсы

- [Справка Дзена](https://dzen.ru/help/ru/index.html)
- [Справка Дзена: удаление канала](https://dzen.ru/help/ru/channel/how-to-delete-channel.html)
- [Справка Дзена: комментарии](https://dzen.ru/help/ru/users/comments/common.html)
- [Экстракторы Дзена в yt-dlp](https://github.com/yt-dlp/yt-dlp/blob/master/yt_dlp/extractor/yandexvideo.py) — классы `ZenYandexIE` и `ZenYandexChannelIE`

## Связанные материалы

- [Yandex Data Takeout](/kb/instruments/data-take-out/dto-yandex) — выгрузка из сервисов, которые остались у Яндекса
- [ВКонтакте](/kb/instruments/social-media/vk) — другая площадка VK, с API стены
- [Rutube](/kb/instruments/social-media/rutube) — российская видеоплатформа, тоже через yt-dlp
- [Browsertrix](/kb/instruments/tools/browsertrix) — снимок страниц в WARC/WACZ
- [yt-dlp](/kb/instruments/tools/yt-dlp) — видео
- [Методика архивации соцсетей](/kb/instruments/social-media/methodology) — паспорт сбора, темп, хранение
- [Архивация социальных сетей](/kb/instruments/social-media) — обзор площадок
