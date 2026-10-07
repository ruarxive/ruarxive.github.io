---
title: wparc
sidebar_label: wparc (WordPress)
description: "Архивация сайтов на WordPress через открытый REST API (/wp-json/wp/v2/): статьи, страницы, медиа, комментарии, метаданные в чистом JSON"
---

# wparc (WordPress)

**wparc** — утилита для сохранения содержимого сайтов на WordPress через [REST API](https://developer.wordpress.org/rest-api/).

Многие сайты на WordPress имеют открытый API по адресу `/wp-json/wp/v2/`. Это позволяет получить контент в чистом структурированном виде (JSON), минуя HTML-парсинг. Такой подход радикально надёжнее, чем `wget -m` или ручной кроулинг, и сохраняет важные метаданные (авторы, теги, рубрики, точные даты).

- Репозиторий: [github.com/ruarxive/wparc](https://github.com/ruarxive/wparc) · Лицензия: MIT · Язык: Python

## Установка

```bash
pip install wparc
```

Требуется Python 3.8+.

## Как это работает

Утилита обходит эндпоинты API:

- **`/posts`** — статьи (записи блога).
- **`/pages`** — статические страницы.
- **`/media`** — медиафайлы (изображения, документы).
- **`/comments`** — комментарии (если не отключены модератором).
- **`/users`**, **`/categories`**, **`/tags`** — авторы и таксономия.

Дополнительно `wparc` обходит пагинацию и сохраняет все медиа на диск по SHA-1 URL-у.

## Использование

```bash
wparc https://example.com/ --output ./site-archive
```

### Опции

```bash
# Только статьи, без комментариев
wparc https://example.com/ --output ./site-archive --no-comments

# С лимитом на размер архива
wparc https://example.com/ --output ./site-archive --max-media-size 100M

# С пользовательским API-токеном (для приватных разделов)
wparc https://example.com/ --output ./site-archive --auth "Bearer <token>"

# Продолжить прерванную архивацию
wparc https://example.com/ --output ./site-archive --resume
```

## Преимущества перед wget

1. **Чистота данных**: Вы получаете текст статьи без рекламы, навигации и посторонней разметки.
2. **Метаданные**: Сохраняются точные даты публикации/изменения, авторы, теги, рубрики, ревизии.
3. **Скрытый контент**: Иногда API отдаёт больше данных, чем видно на сайте (например, draft-версии или поля из custom post types).
4. **Скорость**: Один HTTP-запрос может вернуть пачку из 100 постов — это на порядки быстрее, чем обход по HTML-страницам.
5. **Устойчивость к редизайну**: HTML-классы могут меняться, а контракт API — намного стабильнее.

## Формат выходных данных

```
site-archive/
├── posts/
│   ├── 1.json         # пост с id=1 (полный объект WordPress API)
│   ├── 2.json
│   └── …
├── pages/
├── media/
│   ├── 1.jpg
│   └── …
├── comments.jsonl
├── authors.json
├── tags.json
├── categories.json
└── meta.json          # URL, время архивации, число записей
```

## Проверка доступности API

Перед запуском проверьте, доступен ли API. Откройте в браузере `https://example.com/wp-json/`. Если видите JSON-ответ, сайт можно архивировать с `wparc`.

Если API возвращает ошибку `404` или `rest_cookie_invalid_nonce`, попробуйте обратиться напрямую к эндпоинту:

```bash
curl -I https://example.com/wp-json/wp/v2/posts
```

## Ограничения

- **Только сайты с открытым REST API**. Многие WP-сайты (особенно `.com`) либо закрыли API, либо ограничили эндпоинты до авторизованных пользователей.
- **Плагины с custom endpoints** не покрываются автоматически — `wparc` знает только стандартные маршруты.
- **Только опубликованный контент**, если не задан токен авторизации. `draft`-ы, `private`-посты и медиа в «закрытом» статусе не попадут в архив.
- **Не сохраняет вёрстку страницы как HTML** (нет фронтенда, CSS, JS) — только структурированные данные. Если нужна «как выглядит», используйте [Browsertrix Crawler](/kb/instruments/tools/browsertrix) или [wpull](https://github.com/ArchiveTeam/wpull) + metawarc.
- **Не выполняет JavaScript** — `wparc` работает с JSON, а не с DOM.

## Когда выбрать другой инструмент

| Задача | Лучше подойдёт |
| :--- | :--- |
| Нужен рендеринг с JS (SPA, ленивая подгрузка) | [Browsertrix Crawler](/kb/instruments/tools/browsertrix) |
| Сайт без открытого WP API | [wpull](https://github.com/ArchiveTeam/wpull) / [wget](https://www.gnu.org/software/wget/) + [metawarc](./metawarc) для пост-обработки |
| Нужен стандартный WARC на выходе | конвертация через [metawarc](./metawarc) |
| Архивировать WordPress из Telegram-канала (бота) | [tgarc](./tgarc) |

## Что дальше

- Проиндексировать WARC для поиска по тексту: [metawarc](./metawarc).
- Поднять локальный replay: [metawarc serve](./metawarc#быстрый-старт).
- Опубликовать статический дамп: см. [инструкции для пользователей архивов](/kb/users).

## Связанные материалы

- [Все инструменты Ruarxive](/kb/instruments/ruarxive-tools)
- [Гайд: сделать копию сайта на WordPress](/kb/instruments/howto-collect/make-copy-site-wordpress)
- [Формат WARC](/kb/instruments/file-formats/warc)
- [wparc в курсе DH2 (Web Archiving)](/kb/course/dh2-web-archiving)
