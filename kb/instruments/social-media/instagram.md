---
title: Instagram
description: "Архивация Instagram: Instaloader (посты, Stories, хайлайты, Reels, частые ошибки), gallery-dl, Browsertrix, выгрузка своих данных, доступ для исследователей и опыт Ruarxive по сохранению 171 аккаунта в 2022 году."
last_update:
  date: 2026-10-29
keywords: [instagram, instaloader, gallery-dl, meta, browsertrix, stories]
---

# Instagram

Архивация Instagram сложна: платформа активно противодействует автоматическому сбору, а официальных API для чтения чужого контента практически не осталось. Instagram Basic Display API, через который сторонние приложения получали доступ к данным личных аккаунтов, отключён 4 декабря 2024 года; оставшийся Instagram API работает только с бизнес- и авторскими аккаунтами, которыми управляет само приложение.

В России доступ к Instagram ограничен Роскомнадзором с 14 марта 2022 года, см. [ограничения доступа в России](/kb/instruments/social-media#ограничения-доступа-в-россии).

## Instaloader

[Instaloader](https://instaloader.github.io/) ([GitHub](https://github.com/instaloader/instaloader)) — инструмент командной строки на Python для скачивания фотографий, видео и метаданных из Instagram.

### Установка

```bash
pip install instaloader
```

### Использование

```bash
# Публикации профиля с метаданными в JSON
instaloader profile_name

# С комментариями и геометками, с авторизацией
instaloader --login YOUR_USERNAME --comments --geotags profile_name

# Повторный запуск: остановиться на первом уже скачанном посте
instaloader --fast-update profile_name
```

Метаданные каждого поста Instaloader пишет рядом с файлами в `*.json.xz`. Флаг `--no-compress-json` сохраняет обычный JSON.

### Stories, хайлайты, Reels и отметки

```bash
# Stories и хайлайты профиля без обычных постов (нужен вход)
instaloader --login YOUR_USERNAME --stories --highlights --no-posts profile_name

# Reels и посты, где профиль отмечен
instaloader --login YOUR_USERNAME --reels --tagged profile_name
```

Stories исчезают через 24 часа. Чтобы их сохранить, запускайте первую команду по расписанию чаще раза в сутки. Хайлайты — это Stories, которые автор закрепил в профиле: они остаются, пока автор их не уберёт.

### Важные советы

1. **Авторизация.** Для большинства профилей нужен вход (`--login`). Вместо пароля можно импортировать сессию из браузера (`--load-cookies`).
2. **Лимиты.** Instagram быстро блокирует за частые запросы. Не запускайте массовую архивацию с основного аккаунта.
3. **Сессии.** Instaloader сохраняет файл сессии (путь задаётся `--sessionfile`), чтобы не входить в аккаунт при каждом запуске — частые входы выглядят для Instagram подозрительно.

### Частые ошибки

| Сообщение | Что значит | Что делать |
| :--- | :--- | :--- |
| `Redirected to login page. Use --login or --load-cookies.` | профиль без входа не открывается | войти: `--login` или `--load-cookies firefox` |
| `Redirected to login page. You've been logged out, please wait some time, recreate the session and try again` | Instagram сбросил сессию | подождать, войти заново, создать новую сессию |
| `Login: Checkpoint required. Point your browser to …` | Instagram просит подтвердить вход | открыть ссылку в браузере, пройти проверку, повторить |
| ответ 400 с `feedback_required`, `checkpoint_required` или `challenge_required` | Instagram ограничил действия аккаунта | Instaloader сам прерывает загрузку; остановите сбор и зайдите в аккаунт через браузер |
| `Too many queries in the last time. Need to wait …` | сработал лимит запросов | Instaloader ждёт сам; не запускайте параллельно другие копии с тем же аккаунтом |

> Флаги сверены с `--help` Instaloader 4.16, сообщения — с исходным кодом (`instaloadercontext.py`), октябрь 2026.

## gallery-dl

[gallery-dl](/kb/instruments/tools/gallery-dl) поддерживает профили, отдельные посты, Reels, Stories и хайлайты Instagram. Для авторизации используется импорт cookies из браузера (`--cookies-from-browser`).

## Браузерная архивация

Для создания достоверной копии внешнего вида страниц (включая комментарии) используйте [Browsertrix](/kb/instruments/tools/browsertrix) с заранее созданным браузерным профилем, в котором выполнен вход в Instagram. Поведение Browsertrix для Instagram (включено по умолчанию) открывает все фото и видео поста и профиля, раскрывает комментарии, показывает хайлайты и текущие Stories — последние только с профилем, где выполнен вход. Посты и Stories оно добавляет в очередь отдельными страницами, см. про `--alwaysAddBehaviorLinks` на странице [Facebook](/kb/instruments/social-media/facebook#browsertrix-crawler).

## Выгрузка собственных данных

Владелец аккаунта может запросить архив своих данных через «Центр аккаунтов». См. [Как сохранить данные из Instagram](/kb/instruments/data-take-out/dto-instagram).

## Для исследователей

Публичные посты Instagram доступны исследователям через Meta Content Library и по статье 40 DSA. Оба способа — для анализа, а не для архивных копий. Подробнее — в разделе [Facebook](/kb/instruments/social-media/facebook#инструменты-для-исследователей). Threads, другая площадка Meta, описана на странице [Mastodon, Bluesky, Threads](/kb/instruments/social-media/mastodon#threads).

## Архивация Instagram-аккаунтов официальных лиц (2022)

В марте 2022 года Ruarxive завершил архивацию Instagram-аккаунтов официальных лиц и политиков РФ ([публикация #27](https://t.me/ruarxive/27)):

- сохранён 171 аккаунт, итоговый архив — около 1,4 ГБ;
- полностью сохранены сообщения и метаданные, изображения и видео — лишь ограниченно;
- для архивации использовался `instaloader`;
- код и список аккаунтов выложены в репозиторий [ruarxive/rugovinstagrams](https://github.com/ruarxive/rugovinstagrams).

## Ресурсы

- [Документация Instaloader](https://instaloader.github.io/), [Instaloader на GitHub](https://github.com/instaloader/instaloader)
- [gallery-dl на Codeberg](https://codeberg.org/mikf/gallery-dl)
- [Поведения Browsertrix для сайтов](https://crawler.docs.browsertrix.com/user-guide/behaviors/)
- [Meta Content Library и Content Library API](https://transparency.meta.com/researchtools/meta-content-library)
- [Отключение Instagram Basic Display API](https://developers.facebook.com/blog/post/2024/09/04/update-on-instagram-basic-display-api/) — Meta for Developers, 04.09.2024

## См. также

- [Выгрузка своих данных](/kb/instruments/data-take-out/dto-instagram) — архив владельца аккаунта, не чужого профиля.
- [Закрытые API, площадки и инструменты](/kb/instruments/social-media/dead-platforms) — Basic Display API отключён 4 декабря 2024 года.
- [Архивация других платформ](/kb/instruments/social-media)
- [Методика архивации соцсетей](/kb/instruments/social-media/methodology) — отдельный аккаунт, сессии, хранение
- [Browsertrix Crawler для JS-сайтов](/kb/guides/dynamic-ajax-sites)
- [Кейс ликвидации банков](/kb/case-studies/bank-closures) — аналогичный класс задач массовой архивации.

## Источник

- [Публикация в Telegram-канале Ruarxive #27 (28.03.2022)](https://t.me/ruarxive/27) — архивация 171 Instagram-аккаунта официальных лиц и политиков через instaloader.
