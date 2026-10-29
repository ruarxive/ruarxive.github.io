---
title: Одноклассники
sidebar_label: Одноклассники
description: "Архивация Одноклассников: снимок открытых групп и постов с комментариями в Browsertrix, видео через yt-dlp, что даёт API ОК и как запросить свои данные."
last_update:
  date: 2026-10-29
keywords: [одноклассники, ok.ru, browsertrix, yt-dlp, api ок, группы]
---

# Одноклассники

Одноклассники (ok.ru) — соцсеть компании VK, она есть в [списке проектов VK](https://vk.company/ru/projects/). Открытую группу и её посты сохраняют снимком в браузере, видео — через yt-dlp. Копию своих данных выдаёт служба поддержки.

## Какой способ для какой задачи

| Задача | Способ | Результат |
| :--- | :--- | :--- |
| Данные своего профиля | [запрос в поддержку](/kb/instruments/data-take-out/dto-ok) | архив от ОК |
| Лента открытой группы, как её видит читатель | [Browsertrix](#снимок-группы-и-постов) | WARC/WACZ |
| Пост вместе с комментариями | Browsertrix по адресу `ok.ru/<группа>/topic/<id>` | WARC/WACZ |
| Отдельное видео или трансляция | [yt-dlp](#видео) | видеофайл, `info.json` |
| Все видео группы или альбома | yt-dlp по списку адресов роликов | видеофайлы |
| Закрытая группа | только как участник и с согласия участников | — |
| Группа или пост уже удалены | [Wayback Machine](/kb/instruments/tools/wayback-api) | — |

## Свои данные

Кнопки «скачать архив аккаунта» у ОК нет. Архив данных профиля запрашивают в службе поддержки. Как это сделать — [Как запросить свои данные в Одноклассниках](/kb/instruments/data-take-out/dto-ok).

## Видео

В yt-dlp есть экстрактор `Odnoklassniki`. Он принимает адреса `ok.ru/video/<id>`, `ok.ru/videoembed/<id>` и `ok.ru/live/<id>`. Те же адреса на `odnoklassniki.ru` и с `www.` тоже подходят.

```bash
# одно видео
yt-dlp --write-info-json --write-thumbnail --write-subs \
       --download-archive ok-video.txt \
       -o "%(title)s [%(id)s].%(ext)s" \
       "https://ok.ru/video/VIDEO_ID"

# несколько роликов: адреса по одному на строку в ok-urls.txt
yt-dlp --write-info-json --download-archive ok-video.txt \
       -o "%(title)s [%(id)s].%(ext)s" \
       -a ok-urls.txt
```

Мы проверили `yt-dlp --simulate` на двух открытых роликах: 2014 года и опубликованном 29 октября 2026 года. Оба прошли без cookies.

Что важно знать:

- **Видео группы целиком yt-dlp не берёт.** Страница `ok.ru/<группа>/video` и альбом `ok.ru/group/<id>/video/c<id>` дают ошибку `Unsupported URL`. Адреса роликов соберите со страницы и передайте файлом через `-a`.
- **Ограниченный доступ.** Для такого ролика yt-dlp требует вход. Передайте cookies своего аккаунта: `--cookies-from-browser firefox`.
- **Платное видео** без подписки не скачивается: экстрактор пишет `This video is paid, subscribe to download it`.
- **Чужой плеер.** Если в ОК встроен ролик YouTube или другого сайта, yt-dlp передаёт его экстрактору этого сайта.
- **Комментарии** экстрактор не собирает. Их сохраняет только снимок страницы.

Остальные флаги — на странице [yt-dlp](/kb/instruments/tools/yt-dlp).

> Команды сверены с yt-dlp 2026.10.26 (октябрь 2026).

## API Одноклассников

REST API описан на [apiok.ru](https://apiok.ru/dev/methods/rest/). Он сделан для приложений и игр, а не для архивов.

- Каждый вызов подписывают ключом приложения: параметры `application_key` и `sig`.
- Методам с контентом нужна сессия пользователя и право `VALUABLE_ACCESS`. Так у [`mediatopic.getByIds`](https://apiok.ru/dev/methods/rest/mediatopic/mediatopic.getByIds) (пост по его id) и [`discussions.getComments`](https://apiok.ru/dev/methods/rest/discussions/discussions.getComments) (комментарии).
- Права выдают по письму на api-support@ok.ru. В письме — id приложения, список прав и описание задачи ([права приложения](https://apiok.ru/ext/oauth/permissions)).
- В разделах `group`, `mediatopic` и `stream` на октябрь 2026 года нет метода, который отдаёт ленту группы целиком. В разделе `video` — только загрузка, правка и удаление роликов.
- [`group.getStatTopics`](https://apiok.ru/dev/methods/rest/group/group.getStatTopics) возвращает посты группы со статистикой и требует права `GROUP_CONTENT` и `VALUABLE_ACCESS`. Работает ли он для чужой группы, документация не говорит.
- Лимитов на число вызовов почти нет. При перегрузке API возвращает ошибку `FLOOD_BLOCKED` с паузой `wait_millis` ([ограничения приложения](https://apiok.ru/dev/limits)).

Для архива открытой группы снимок страниц надёжнее: он не зависит от выданных прав.

## Снимок группы и постов

По [справке ОК](https://ok.ru/help/chem-otlichaetsya-otkrytaya-gruppa-ot-zakrytoi) (обновлена 23.03.2026), контент открытой группы доступен всем пользователям ОК. Закрытую группу смотрят только участники. Секретную группу нельзя найти поиском, в неё вступают по приглашению.

Мы проверили 29 октября 2026 года открытую группу `ok.ru/ria` в чистом профиле Chrome, без входа:

- лента группы видна, при прокрутке подгружаются новые посты;
- страница поста показывает текст и комментарии;
- оставить комментарий без входа нельзя.

Снимок делает [Browsertrix Crawler](/kb/instruments/tools/browsertrix). Адреса группы и важных постов запишите в `crawls/seeds.txt`, по одному на строку:

```bash
docker run --rm -v $PWD/crawls:/crawls/ webrecorder/browsertrix-crawler:1.15.2 crawl \
    --seedFile /crawls/seeds.txt \
    --scopeType page \
    --behaviorTimeout 60 \
    --text to-pages \
    --generateWACZ \
    --collection ok-group
```

`--scopeType page` сохраняет только адреса из списка. `--text to-pages` пишет текст страниц в `pages.jsonl`: по нему удобно искать.

Что показал пробный обход этой командой:

- **Лента группы.** Поведение autoscroll не запустилось, в журнале — `Skipping autoscroll, page seems to not be responsive to scrolling events`. В архив попала только первая порция постов.
- **Страница поста** сохранилась вместе с комментариями.

Поэтому важные посты передавайте списком адресов. Адрес вида `ok.ru/group/<число>/topic/<id>` ОК перенаправляет на `ok.ru/<короткое имя>/topic/<id>`. Отдельного поведения для ОК в browsertrix-behaviors 0.15.1 нет.

> Флаги сверены с `cli-options.md` Browsertrix Crawler 1.15.2, обход проверен 29 октября 2026 года. Проверки шли не из российской сети: из России поведение сайта может отличаться.

## Ограничения

- **Закрытая и секретная группа** открыта только участникам. Сохранять её можно только с согласия участников.
- **Лента группы** в Browsertrix сохраняется частично, см. [выше](#снимок-группы-и-постов).
- **Фотоальбомы.** В gallery-dl 1.32.18 экстрактора для ОК нет. Фотографии остаются только в снимке страницы.
- **Удалённое** не возвращает ни один способ. Проверьте адрес в Wayback Machine.
- **Готового инструмента** Ruarxive для Одноклассников нет.

## Хранение результата

- Храните `seeds.txt`, `ok-urls.txt` и журнал `ok-video.txt` вместе с архивом. По ним видно, какие посты и ролики сохранены.
- В имени видеофайла — id ролика, тот же, что в адресе `ok.ru/video/<id>`. По нему видео связывают со снимком поста.

Общие правила хранения и контрольные суммы — в [методике](/kb/instruments/social-media/methodology#хранение).

## Право

- Имена, аватары и тексты комментаторов — [персональные данные](/kb/legal/personal-data). Профили частных лиц без нужды не собирайте.
- Видео и тексты групп защищены [авторским правом](/kb/legal/copyright): сохранить для архива не значит опубликовать.
- Закрытые группы — только с согласия участников, см. [условия использования сервисов](/kb/legal/terms-of-service).

## Ресурсы

- [Справка ОК: открытая и закрытая группа](https://ok.ru/help/chem-otlichaetsya-otkrytaya-gruppa-ot-zakrytoi)
- [Как ОК обрабатывают данные профиля](https://ok.ru/page/safety/pages/private-data/)
- [Методы REST API ОК](https://apiok.ru/dev/methods/rest/)
- [Экстрактор Odnoklassniki в yt-dlp](https://github.com/yt-dlp/yt-dlp/blob/master/yt_dlp/extractor/odnoklassniki.py)

## Связанные материалы

- [Как запросить свои данные в Одноклассниках](/kb/instruments/data-take-out/dto-ok) — архив своего профиля
- [ВКонтакте](/kb/instruments/social-media/vk) — другая соцсеть VK, с API стены
- [Browsertrix](/kb/instruments/tools/browsertrix) — снимок страниц в WARC/WACZ
- [yt-dlp](/kb/instruments/tools/yt-dlp) — видео
- [Методика архивации соцсетей](/kb/instruments/social-media/methodology) — паспорт сбора, темп, хранение
- [Архивация социальных сетей](/kb/instruments/social-media) — обзор площадок
