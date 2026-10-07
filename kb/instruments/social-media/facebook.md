---
sidebar_position: 4
last_updated: 2026-10-07
title: Facebook
description: Архивация Facebook требует специального подхода — платформа активно ограничивает сбор
---

# Facebook

Архивация Facebook требует специального подхода — платформа активно ограничивает сбор
данных.

## Официальный экспорт (ваш аккаунт)

Через [facebook.com/dyi](https://www.facebook.com/dyi/) можно запросить архив собственных
данных:

- Посты, комментарии, реакции.
- Сообщения (для вашего аккаунта).
- Фото и видео.
- Информация профиля.

Формат — HTML или JSON. Подробнее:
[Data Take Out — Facebook](/kb/instruments/data-take-out/dto-facebook).

## CrowdTangle (только для исследователей)

Meta предоставляет исследователям доступ к
[CrowdTangle API](https://www.crowdtangle.com/) — но в 2024 году доступ существенно сокращён.

Требования:

- Академическая или журналистская организация.
- Подтверждение исследовательской цели.
- Заключение соглашения с Meta.

## Архивация публичных страниц и постов

### Через Wget + Cookies

```bash
# Экспортируйте cookies из браузера (например, через расширение cookies.txt)
wget --load-cookies cookies.txt \
     --mirror --convert-links --adjust-extension \
     --page-requisites \
     --reject-regex 'login|signup|checkpoint' \
     https://www.facebook.com/PublicPageName/
```

:::warning
Этот метод хрупок: Facebook активно ломает HTML-разметку, обнаруживает ботов и
требует интерактивной авторизации. Подходит для разовых задач, не для массового обхода.
:::

### Browsertrix Crawler

Для JavaScript-сайтов вроде Facebook: [Browsertrix Crawler](/kb/instruments/tools/browsertrix)
с авторизацией через cookies.

```bash
docker run --rm -v $PWD/data:/crawl/data \
    webrecorder/browsertrix-crawler crawl \
    --url "https://www.facebook.com/PageName" \
    --cookies cookies.json \
    --generateWACZ \
    --limit 500
```

## Архивация комментариев

У Facebook нет публичного API для чтения комментариев. Альтернативы:

1. **HTML-парсинг** — нестабильно, страницы рендерятся клиентом.
2. **Browsertrix** — «прокликивает» раскрытие комментариев.
3. **Архивирование через браузер вручную** — медленно, но надёжно.

## Юридические вопросы

- **GDPR и 152-ФЗ** — при работе с данными пользователей Facebook.
- **Public vs Private** — публичные посты можно архивировать без согласия, но
  использование в публикациях требует осторожности (см. [Персональные данные](/kb/legal/personal-data)).
- **Takedown** — Meta может потребовать удаления архивов.

## Практика Ruarxive

Ruarxive архивировал Facebook-аккаунты чиновников параллельно с Instagram. Подробности
— в задачах для волонтёров.