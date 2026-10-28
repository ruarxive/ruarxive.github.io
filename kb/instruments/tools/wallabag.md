---
title: wallabag
sidebar_label: wallabag
description: "wallabag — открытое self-hosted приложение «прочитать позже»: сохраняет очищенный текст статей, теги, аннотации, мобильные приложения, экспорт в EPUB/PDF/JSON."
last_update:
  date: 2026-10-28
---

# wallabag

**wallabag** — открытое веб-приложение (PHP, Symfony, лицензия MIT) для сохранения статей, чтобы прочитать их позже. Оно извлекает основной текст страницы, а реклама и всплывающие окна в него не попадают. Проект вырос из **poche** — приложения, которое Nicolas Lœuillet начал в 2013 году. Это самостоятельный проект, а не форк Pocket. Последняя версия — 2.6.14 (октябрь 2025).

Можно установить на свой сервер или завести аккаунт на платном хостинге [wallabag.it](https://wallabag.it/).

Сайт: [wallabag.org](https://wallabag.org/)

:::note Закрытые аналоги
Популярные облачные сервисы «прочитать позже» закрылись: **Omnivore** — в ноябре 2024 года, **Pocket** (Mozilla) — в июле 2025 года. wallabag умеет импортировать их экспорты, поэтому годится для миграции сохранённых закладок.
:::

## Зачем нужен

Если [ArchiveBox](archivebox) — это архив страниц с несколькими способами сохранения (включая WARC), то wallabag — это личная **библиотека для чтения**:

- **очищенный текст статьи** без рекламы и навигации;
- **теги и аннотации** (выделение фрагментов с заметками);
- **мобильные приложения** для Android и iOS;
- **экспорт** в EPUB, PDF, CSV, JSON, XML, TXT, Markdown;
- **импорт** из Pocket, Omnivore, Instapaper, Pinboard, Readability, Delicious, Shaarli, Elcurator, закладок Firefox и Chrome, wallabag v1/v2;
- **REST API** для интеграций;
- **несколько пользователей** на одном сервере;
- **двухфакторная аутентификация**.

## Когда использовать

✅ Подходит для:

- личного архива статей с удобным чтением;
- команды исследователей с общей базой статей по теме;
- сохранения текстов для цитирования;
- переноса закладок из закрытых Pocket и Omnivore.

❌ Не подходит для:

- архивации сайтов целиком или по расписанию: используйте [Wget](wget), [Browsertrix](browsertrix), [Heritrix](heritrix);
- точной копии страницы с оформлением и скриптами: используйте [SingleFile](singlefile) или WARC;
- изображений и видео: используйте [gallery-dl](gallery-dl), [yt-dlp](yt-dlp);
- быстрой публичной ссылки на снимок: используйте [Save Page Now](wayback-api) (archive.ph — только как дополнительная копия, см. [Archive.ph](archive-ph)).

## Установка

### Docker Compose (официальный пример)

Пример основан на README [wallabag/docker](https://github.com/wallabag/docker):

```yaml
services:
  wallabag:
    image: wallabag/wallabag
    restart: unless-stopped
    environment:
      - MYSQL_ROOT_PASSWORD=wallaroot
      - SYMFONY__ENV__DATABASE_DRIVER=pdo_mysql
      - SYMFONY__ENV__DATABASE_HOST=db
      - SYMFONY__ENV__DATABASE_PORT=3306
      - SYMFONY__ENV__DATABASE_NAME=wallabag
      - SYMFONY__ENV__DATABASE_USER=wallabag
      - SYMFONY__ENV__DATABASE_PASSWORD=wallapass
      - SYMFONY__ENV__DATABASE_CHARSET=utf8mb4
      - SYMFONY__ENV__DATABASE_TABLE_PREFIX="wallabag_"
      - SYMFONY__ENV__MAILER_DSN=smtp://127.0.0.1
      - SYMFONY__ENV__FROM_EMAIL=wallabag@example.com
      - SYMFONY__ENV__DOMAIN_NAME=https://wallabag.example.com
      - SYMFONY__ENV__SERVER_NAME="Your wallabag instance"
    ports:
      - "8080:80"
    volumes:
      - /opt/wallabag/images:/var/www/wallabag/web/assets/images
    depends_on:
      - db
      - redis
  db:
    image: mariadb
    restart: unless-stopped
    environment:
      - MYSQL_ROOT_PASSWORD=wallaroot
    volumes:
      - /opt/wallabag/data:/var/lib/mysql
    healthcheck:
      test: ["CMD", "/usr/local/bin/healthcheck.sh", "--innodb_initialized"]
      interval: 20s
      timeout: 3s
  redis:
    image: redis:alpine
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 20s
      timeout: 3s
```

```bash
docker compose up -d
```

Логин по умолчанию — `wallabag` / `wallabag`: смените пароль сразу после входа. Почта настраивается одной переменной `SYMFONY__ENV__MAILER_DSN`; старые `MAILER_HOST/USER/PASSWORD` больше не используются. Если Redis-контейнер называется `redis`, отдельные переменные `SYMFONY__ENV__REDIS_*` не нужны.

Самый простой вариант для пробы — SQLite в одном контейнере:

```bash
docker run -p 80:80 -e "SYMFONY__ENV__DOMAIN_NAME=http://localhost" wallabag/wallabag
```

### Из исходников

```bash
git clone https://github.com/wallabag/wallabag.git
cd wallabag && make install
```

Затем настройте виртуальный хост веб-сервера по [документации](https://doc.wallabag.org/). Официального PPA для Ubuntu нет.

> Команды и переменные сверены с README wallabag/wallabag и wallabag/docker (октябрь 2026).

## Использование

### Сохранить статью

- **Веб-интерфейс**: значок «+» в верхней панели, вставить URL, Enter.
- **Букмарклет** `bag it!` со страницы «How-to» в меню аккаунта.
- **Расширение браузера** [wallabagger](https://github.com/wallabag/wallabagger): [Firefox](https://addons.mozilla.org/firefox/addon/wallabagger/), Chrome и другие.
- **Мобильные приложения**: Android — [Google Play](https://play.google.com/store/apps/details?id=fr.gaulupeau.apps.InThePoche) и [F-Droid](https://f-droid.org/packages/fr.gaulupeau.apps.InThePoche/); iOS — [официальное приложение в App Store](https://apps.apple.com/us/app/wallabag-2-official/id1170800946).
- **API**.

### Через API

Создайте клиента API в разделе «API clients management», затем:

```bash
TOKEN=$(curl -s -X POST https://wallabag.example.com/oauth/v2/token \
  -d "grant_type=password&client_id=$CLIENT_ID&client_secret=$CLIENT_SECRET&username=user&password=pass" \
  | jq -r .access_token)

curl -X POST https://wallabag.example.com/api/entries.json \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com/article"}'
```

Описание API — по адресу `/api/doc` вашего сервера (пример: [app.wallabag.it/api/doc](https://app.wallabag.it/api/doc)).

### Читать, аннотировать, тегировать

1. Список статей: непрочитанные, избранные, архив, по тегам.
2. Статья открывается в режиме чтения.
3. Выделите фрагмент, чтобы добавить аннотацию.
4. Теги добавляются из карточки статьи.

### Экспорт

Каждую статью и целые разделы (непрочитанные, избранные, архив) можно скачать в EPUB, PDF, CSV, JSON, XML, TXT или Markdown. Экспорт в MOBI убран в версии 2.6.

### RSS

wallabag отдаёт RSS-ленты своих разделов (непрочитанные, избранное, архив) по персональному токену: их можно читать в RSS-ридере. Импорта из RSS в wallabag нет.

### Импорт

Раздел «Import»: Pocket (через API или экспорт CSV/HTML), Omnivore, Instapaper, Pinboard, Readability, Delicious, Shaarli, Elcurator, закладки Firefox и Chrome, wallabag v1/v2. Для больших импортов можно включить асинхронную очередь на Redis или RabbitMQ: в Docker воркер запускается командой `wallabag/wallabag import <type>`.

## Сравнение с другими инструментами

| Инструмент | Self-hosted | Режим чтения | Теги | Аннотации | API | Статус |
| :--- | :---: | :---: | :---: | :---: | :---: | :--- |
| **wallabag** | ✅ | ✅ | ✅ | ✅ | ✅ REST | Активен |
| **[ArchiveBox](archivebox)** | ✅ | ⚠️ | ✅ | ❌ | ⚠️ | Активен |
| **[Shiori](https://github.com/go-shiori/shiori)** | ✅ | ✅ | ✅ | ❌ | ✅ | Активен (Go) |
| **[linkding](https://github.com/sissbruecker/linkding)** | ✅ | ❌ | ✅ | ❌ | ✅ | Активен (закладки) |
| **Pocket** | ❌ | — | — | — | — | Закрыт в июле 2025 |
| **Omnivore** | — | — | — | — | — | Закрыт в ноябре 2024 |

### Когда лучше ArchiveBox

- Цель — архивация (несколько форматов, включая WARC), а не чтение.
- Нужна полная версия страницы с ресурсами, а не очищенный текст.

### Когда лучше Shiori

- Хочется лёгкий стек (Go, SQLite) и не нужны аннотации и EPUB.

## Рекомендации

1. **Смените пароль администратора** (`wallabag` / `wallabag`) сразу после установки.
2. **Включите двухфакторную аутентификацию** в настройках аккаунта, если сервер доступен из интернета.
3. **Отключите открытую регистрацию** (`SYMFONY__ENV__FOSUSER_REGISTRATION=false`, значение по умолчанию).
4. **Делайте резервные копии базы**:

```bash
docker compose exec db mysqldump -u root -pwallaroot wallabag | gzip > backup-$(date +%F).sql.gz
```

5. **Сохраняйте важные материалы и в другом формате.** wallabag хранит очищенный текст. Если важен исходный вид страницы, дополнительно сохраните её через [SingleFile](singlefile) или в WARC.

## Ограничения

- Стек: PHP, Symfony, база данных (SQLite, MySQL/MariaDB или PostgreSQL), для очередей — Redis.
- Сохраняется очищенный текст статьи, а не полная страница с интерактивом.
- Видео и сложные медиа обычно не сохраняются.
- Качество зависит от извлечения текста: некоторые сайты сохраняются плохо (в документации есть раздел о проблемах загрузки статей).

## Ресурсы

- [wallabag.org](https://wallabag.org/)
- [Документация](https://doc.wallabag.org/)
- [GitHub: wallabag](https://github.com/wallabag/wallabag)
- [GitHub: wallabag/docker](https://github.com/wallabag/docker)
- [Экосистема wallabag](https://github.com/wallabag/wallabag/wiki/wallabag-ecosystem) — приложения и интеграции
- [wallabag.it](https://wallabag.it/) — платный хостинг от разработчиков

## Связанные материалы

- **[ArchiveBox](archivebox)** — для архивации, а не чтения.
- **[SingleFile](singlefile)** — для сохранения полной страницы.
- **[WebScrapBook](webscrapbook)** — коллекции сохранённых страниц.
- **[Obelisk](obelisk)** — сохранение страницы в один HTML-файл (используется в Shiori).
- **[WARC](/kb/instruments/file-formats/warc)** — для долгосрочного хранения.
- **[Правовые вопросы](/kb/legal/copyright)**
- **[Пользовательские workflow](/kb/guides/custom-workflows)**
- **[Как пользоваться архивами](/kb/users)**
