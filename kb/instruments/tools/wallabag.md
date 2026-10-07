---
title: wallabag
sidebar_label: wallabag
description: Self-hosted «read-it-later» сервис с веб-архивацией, тегами, аннотациями, мобильными приложениями и экспортом в PDF/EPUB
---

# wallabag

**wallabag** — self-hosted сервис для сохранения статей и веб-страниц с возможностью читать их позже, аннотировать, тегировать и экспортировать. Форк известного сервиса Pocket, но с открытым кодом и собственным сервером. Сейчас — один из самых зрелых open-source альтернатив Pocket.

Сайт: [wallabag.it](https://wallabag.it/)

## Зачем нужен

Если [ArchiveBox](archivebox) — это «веб-архив на стероидах», то wallabag — это **«Pocket, но свой»**. Главные отличия:

- **Акцент на чтение** — чистый reader view, без рекламы и трекеров.
- **Теги, аннотации, выделения** — полноценный персональный архив.
- **Мобильные приложения** (Android, iOS) с синхронизацией.
- **Экспорт** в PDF, EPUB, MOBI, JSON, CSV, TXT.
- **Импорт** из Pocket, Instapaper, Readability, Pinboard, Evernote.
- **Полнотекстовый поиск** с морфологией (для некоторых языков).
- **API** для интеграций.
- **Multi-user** — несколько пользователей на одном сервере.
- **Open source** (MIT), без телеметрии, без зависимости от облака.

Где незаменим:
- **Личный «read-it-later»** с приватностью.
- **Команды исследователей** с общей базой статей.
- **Альтернатива Pocket** для тех, кто не хочет облако Mozilla.
- **Архив** с удобным чтением вместо «кучи MAFF-файлов».

## Возможности

- **Сохранение URL** через:
  - Веб-интерфейс.
  - Браузерное расширение (Firefox, Chrome, Safari, Edge).
  - Мобильные приложения.
  - Email (отправить на специальный адрес).
  - API.
  - RSS-фид для автоматического импорта.
- **Reader view** — очистка от рекламы, навигации, комментариев.
- **Аннотации** — выделение текста, заметки.
- **Теги, цвета, категории**.
- **Поиск** по заголовку, содержимому, тегам, аннотациям.
- **Фильтры** — по статусу (прочитано/не прочитано), по тегу, по дате.
- **Полная офлайн-работа** (через мобильные приложения).
- **Импорт**: Pocket, Instapaper, Readability, Pinboard, Evernote, Firefox Readerview.
- **Экспорт**: PDF, EPUB, MOBI, JSON, CSV, TXT, Markdown.
- **Multi-user** — изоляция пользователей.
- **OAuth/OIDC** для авторизации.
- **2FA** через TOTP.
- **REST API** с полным покрытием.
- **Webhook-и** для интеграций.

## Когда использовать

✅ Подходит для:

- **Личного архива статей** с удобным чтением.
- **Замены Pocket** без зависимости от Mozilla.
- **Команды** с общей базой материалов.
- **Архива исследователя** — собрать 1000+ статей по теме.
- **Сохранения для последующего цитирования** в научной работе.

❌ Не подходит для:

- **Циклических краулингов** (для этого — [Browsertrix](browsertrix), [Heritrix](heritrix)).
- **Архивации всего сайта** (для этого — [Wget](wget)).
- **Сиюминутной ссылки** (для этого — [Archive.ph](archive-ph)).
- **Изображений и видео** (для этого — [gallery-dl](gallery-dl), [yt-dlp](yt-dlp)).

## Установка

### Docker Compose (рекомендуется)

```yaml
# docker-compose.yml
version: "3"

services:
  wallabag:
    image: wallabag/wallabag:latest
    environment:
      - SYMFONY__ENV__DATABASE_DRIVER=pdo_mysql
      - SYMFONY__ENV__DATABASE_HOST=db
      - SYMFONY__ENV__DATABASE_PORT=3306
      - SYMFONY__ENV__DATABASE_NAME=wallabag
      - SYMFONY__ENV__DATABASE_USER=wallabag
      - SYMFONY__ENV__DATABASE_PASSWORD=secret
      - SYMFONY__ENV__DATABASE_CHARSET=utf8mb4
      - SYMFONY__ENV__MAILER_HOST=smtp.example.com
      - SYMFONY__ENV__MAILER_USER=wallabag@example.com
      - SYMFONY__ENV__MAILER_PASSWORD=mail-password
      - SYMFONY__ENV__FROM_EMAIL=wallabag@example.com
      - SYMFONY__ENV__DOMAIN_NAME=https://wallabag.example.com
      - SYMFONY__ENV__SERVER_NAME=Your wallabag
    ports:
      - "8080:80"
    volumes:
      - ./images:/var/www/wallabag/web/assets/images
    depends_on:
      - db
      - redis

  db:
    image: mariadb:10
    environment:
      - MARIADB_DATABASE=wallabag
      - MARIADB_USER=wallabag
      - MARIADB_PASSWORD=secret
      - MARIADB_RANDOM_ROOT_PASSWORD=yes
    volumes:
      - ./db:/var/lib/mysql

  redis:
    image: redis:7
    volumes:
      - ./redis:/data
```

```bash
docker-compose up -d
```

Через 1-2 минуты будет доступен на `http://localhost:8080`. Логин/пароль по умолчанию: `wallabag` / `wallabag` (смените сразу!).

### Через пакетные менеджеры

```bash
# Arch
yay -S wallabag

# Ubuntu (через PPA)
sudo add-apt-repository ppa:wallabag/wallabag
sudo apt install wallabag
```

### Из исходников (для разработчиков)

```bash
git clone https://github.com/wallabag/wallabag.git
cd wallabag
make install
```

## Использование

### Сохранить URL

#### Через веб-интерфейс

1. Открыть `https://wallabag.example.com`.
2. Вставить URL в поле «Save a link».
3. Нажать **Save**.
4. wallabag скачает страницу, очистит от мусора, сохранит контент.

#### Через браузерное расширение

Установить [Wallabagger для Firefox/Chrome](https://www.wallabag.it/features) → клик → статья сохранена.

#### Через мобильное приложение

- [Android (Material Wallabag)](https://play.google.com/store/apps/details?id=fr.gaulupeau.apps.Poche)
- [iOS (iWallabag)](https://apps.apple.com/app/iwallabag/id1607321548)

#### Через email

Каждый пользователь имеет уникальный email-адрес (настраивается). Отправить URL на этот email — статья сохранится автоматически.

#### Через API

```bash
TOKEN=$(curl -s -X POST https://wallabag.example.com/api/v1/oauth/v2/token \
  -d "grant_type=password&client_id=$CLIENT_ID&client_secret=$CLIENT_SECRET&username=user&password=pass" \
  | jq -r .access_token)

curl -X POST https://wallabag.example.com/api/v1/entries \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com/article"}'
```

### Читать, аннотировать, тегировать

1. **Список статей** — входящие, прочитанные, по тегам, по дате.
2. **Reader view** — клик на статью → чистый текст с навигацией.
3. **Выделение** — выделить фрагмент → выбрать цвет, добавить заметку.
4. **Теги** — добавить тег прямо из reader view.
5. **Архивация** — пометить как «прочитано» или удалить.

### Экспорт

#### Через веб-интерфейс

Статья → «Export» → выбрать формат (PDF, EPUB, MOBI, JSON, CSV, TXT, Markdown).

#### Batch-экспорт всех статей

```bash
# Экспорт в JSON через API
curl -H "Authorization: Bearer $TOKEN" \
  "https://wallabag.example.com/api/v1/entries.json?perPage=100" \
  > all-entries.json
```

#### Импорт в другие системы

- **Firefox Reading List** — wallabag импортирует JSON.
- **Pocket** — экспорт в Pocket-HTML → импорт в wallabag.
- **Instapaper CSV** — прямой импорт.
- **Evernote ENEX** — через API или UI.

## Конфигурация

### Параметры окружения (Docker)

```yaml
SYMFONY__ENV__DOMAIN_NAME=https://wallabag.example.com  # обязательно
SYMFONY__ENV__SERVER_NAME=My Wallabag
SYMFONY__ENV__FOSUSER_REGISTRATION=false  # отключить регистрацию
SYMFONY__ENV__FOSUSER_CONFIRMATION=true  # подтверждение email
SYMFONY__ENV__TWO_FACTOR_AUTH=true  # включить 2FA
SYMFONY__ENV__INTERNAL_HTACCESS=true  # защитить /var/www/wallabag/web
SYMFONY__ENV__PAYPAL_ENABLED=false
SYMFONY__ENV__SAML_SUPPORT=false
```

### Настройка через UI

`Settings` → `Parameters`:

- Язык интерфейса.
- Количество статей на странице.
- Экспорт по умолчанию.
- Сортировка.
- Тема оформления (light/dark).

### Плагины (через Composer)

- **Readability** — улучшенный reader view.
- **Matomo** — статистика.
- **Pocket/Instapaper/Readability/Evernote импортеры**.
- **Firefox/Chrome bookmarks sync**.

## Сравнение с другими инструментами

| Инструмент | Self-hosted | Reader view | Теги | Аннотации | API | Мобильные |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **wallabag** | ✅ | ✅ | ✅ | ✅ | ✅ REST | ✅ |
| **[ArchiveBox](archivebox)** | ✅ | ❌ | ❌ | ❌ | ⚠️ | ❌ |
| **Pocket** | ❌ | ✅ | ✅ | ✅ | ⚠️ | ✅ |
| **Shiori** | ✅ | ✅ | ✅ | ❌ | ✅ | ⚠️ |
| **Linkding** | ✅ | ❌ | ✅ | ❌ | ✅ | ❌ |
| **Omnivore** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

### Когда wallabag лучше всех

- Нужен **полноценный «read-it-later»** с reader view, тегами, аннотациями.
- Важна **multi-user** поддержка (команда, семья).
- Нужен **экспорт в PDF/EPUB** для чтения на Kindle.
- Хочется **зрелый проект** с 10+ годами истории (с 2013).

### Когда лучше ArchiveBox

- Цель — **архивация** (с метаданными, в WARC), а не чтение.
- Нужна **полная версия страницы** с ресурсами, а не очищенный текст.

### Когда лучше Shiori

- Хочется **минимализм** и лёгкий стек (Go, SQLite).
- Не нужны **аннотации** и EPUB-экспорт.

### Когда лучше Linkding

- Нужен **просто закладочник** (как Pinboard), без reader view.

### Когда лучше Pocket

- Не хочется **поддерживать сервер**.
- Нужна **глубокая интеграция** с Firefox.

## Best practices

### 1. Сразу смените пароль администратора

```bash
# Через API или UI
# Default: wallabag / wallabag
```

### 2. Включите 2FA

Settings → Account → Two-factor authentication → сканировать QR в TOTP-приложении.

### 3. Настройте регулярный импорт из RSS

wallabag поддерживает импорт из RSS — для автоматического сохранения новых постов из любимых блогов.

### 4. Используйте теги как «проекты»

```
#research/quantum-cryptography
#work/article-archive
#reading-list/2025
#reference/documentation
```

### 5. Регулярный экспорт бэкапа

```bash
# Weekly backup
docker exec wallabag-db mysqldump -u wallabag -psecret wallabag | \
  gzip > backup-$(date +%F).sql.gz
```

### 6. Включите Redis для производительности

Без Redis с 1000+ статей будут тормоза. С Redis — мгновенный поиск и быстрый reader view.

### 7. Используйте Firefox Sync (через плагин)

Синхронизация закладок Firefox с wallabag — статья в браузере автоматически попадает в архив.

## Ограничения

- **Тяжёлый стек** — Symfony + PHP + MySQL/PostgreSQL + Redis. Минимум 1 ГБ RAM.
- **Не сохраняет полную страницу** — только reader view, без JS-интерактива.
- **Не для медиа** — картинки сохраняются как `<img>`, видео обычно выпадает.
- **Зависит от качества парсера** — некоторые сайты ломают reader view.
- **Большие коллекции** (10k+ статей) — нужна оптимизация БД.
- **Миграция с Pocket** — не 1-к-1, теряются «рекомендации» и социальные функции.

## Ресурсы

- [Официальный сайт wallabag](https://wallabag.it/) — главная.
- [Документация](https://doc.wallabag.org/) — установка, настройка, API.
- [GitHub: wallabag](https://github.com/wallabag/wallabag) — исходный код.
- [Demo](https://demo.wallabag.it/) — попробовать онлайн.
- [API Reference](https://app.wallabag.it/api/doc) — Swagger-документация.
- [Wallabagger (расширение)](https://www.wallabag.it/features) — для Firefox/Chrome.
- [Mobile apps](https://www.wallabag.it/features#mobile) — Android, iOS.

## Связанные материалы

- **[ArchiveBox](archivebox)** — для архивации, а не чтения.
- **[SingleFile](singlefile)** — для сохранения полной страницы.
- **[WebScrapBook](webscrapbook)** — для коллекций с структурой.
- **[WARC](/kb/instruments/file-formats/warc)** — если нужно долгосрочное хранение.
- **[Shiori](https://github.com/go-shiori/shiori)** — Go-альтернатива.
- **[Правовые вопросы](/kb/legal/copyright)** — личное использование статей.
- **[Пользовательские workflow](/kb/guides/custom-workflows)** — wallabag в пайплайнах.
- **[Как пользоваться архивами](/kb/users)** — практические сценарии.
