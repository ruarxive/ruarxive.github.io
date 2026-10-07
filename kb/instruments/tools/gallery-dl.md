---
title: gallery-dl
sidebar_label: gallery-dl
description: Загрузчик изображений и медиа из галерей, поддержка 200+ сайтов включая Instagram, Twitter, Pixiv, DeviantArt, Tumblr
---

# gallery-dl

**gallery-dl** — утилита командной строки для скачивания изображений и коллекций медиа из сотен галерей, бордов, социальных сетей и хостингов. Написана на Python, активно развивается, поддерживает сайт-specific экстракторы с метаданными.

Сайт: [github.com/mikf/gallery-dl](https://github.com/mikf/gallery-dl)

## Когда использовать

✅ Подходит, если нужно:

- **массово скачать изображения** из Instagram, Twitter, Pixiv, DeviantArt, Tumblr, Reddit, Danbooru и других галерей;
- сохранить **полные метаданные** (теги, описание, автор, EXIF, рейтинг) рядом с файлами в JSON;
- иметь **гибкую фильтрацию** (по типу файла, размеру, дате, тегам, рейтингу);
- вести **инкрементальный архив** с надёжным `--download-archive` (SQLite);
- работать с **NSFW-контентом** в исследовательских целях.

❌ Не лучший выбор, если:

- цель — **видео**, а не изображения — [yt-dlp](/kb/instruments/tools/yt-dlp);
- нужна **визуальная дедупликация** (по перцептивным хешам) — посмотрите [Hydrus Network](https://hydrusnetwork.github.io/hydrus/) или собственный пайплайн;
- нужно сохранить **HTML-страницу с UI** — [SingleFile](/kb/instruments/tools/singlefile) или [Browsertrix Crawler](/kb/instruments/tools/browsertrix);
- целевая платформа не поддерживается экстракторами — проверьте [Supported sites](https://github.com/mikf/gallery-dl/blob/master/docs/supportedsites.md).

## Зачем нужен архивисту

Видео и текст — половина веб-контента. Вторая половина — это **изображения**: посты в Instagram, иллюстрации на DeviantArt/Pixiv, фото в Twitter, доски на Pinterest, NSFW-коллекции на Flickr. Браузерные расширения вроде SingleFile сохраняют одну страницу, но **для массовой архивации галерей** нужен специализированный инструмент.

gallery-dl решает задачи:
- **Скачать все фото** из Instagram-профиля (с метаданными).
- **Собрать плейлист пинтереста** в один каталог.
- **Заархивировать иллюстрации автора** с Pixiv.
- **Скачать всю доску** Tumblr, Reddit-сабреддит, e621.
- **Извлечь EXIF, описания, теги** — для последующей каталогизации.

## Возможности

- **200+ поддерживаемых сайтов** через систему экстракторов.
- **Иерархия каталогов** по формату `категория/{субкатегория}/файл`.
- **Метаданные**: JSON sidecar, EXIF, описания, теги, автор.
- **Cookies и аутентификация** для приватных/приватных аккаунтов.
- **Фильтрация**: по типу файла, размеру, дате, тегам, рейтингу.
- **Пост-процессинг**: архивирование, переименование, удаление дубликатов.
- **Возобновление загрузки** через архив скачанных.
- **Rate limiting** (задержки, окна времени, лимиты по дням).
- **Параллельные соединения** для ускорения.
- **Поддержка NSFW** — критично для архивации исследовательских корпусов.
- **Выходные форматы**: JPEG, PNG, WEBP, GIF, MP4 (для постов с видео), WEBP-анимации.
- **Archive download** — для Reddit, где это единственный способ получить удалённый контент.

## Поддерживаемые платформы (выборка)

| Категория | Сайты |
| :--- | :--- |
| **Соцсети** | Twitter/X, Tumblr, Mastodon, VK |
| **Арт-хостинги** | Pixiv, DeviantArt, ArtStation, Behance, Newgrounds |
| **Иллюстрированные борды** | Danbooru, Gelbooru, e621, Sankaku, Rule34 |
| **Фото** | Flickr, 500px, Imgur, Reddit-сабреддиты, Pinterest |
| **Имиджборды** | 4chan, 8chan |
| **NSFW-платформы** | nhentai, e-hentai, Redgifs, MissKobayashi |
| **Комиксы** | Mangadex, Webtoon, Comic Walker |
| **Новостные** | Reuters, Getty Images, NYT |
| **Другое** | GitHub, Patreon, Reddit, Tistory |

Полный список: [github.com/mikf/gallery-dl/blob/master/docs/supportedsites.md](https://github.com/mikf/gallery-dl/blob/master/docs/supportedsites.md).

## Когда использовать

✅ Подходит для:

- **Массовой архивации изображений** (авторы на Pixiv, доски на Pinterest, сабреддиты).
- **Иллюстрированных коллекций** (NSFW, арт, доски, борды).
- **Сбора изображений по списку URL**.
- **Получения метаданных** для каталогизации.
- **Восстановления удалённого контента** через Pushshift-архивы (Reddit).

❌ Не подходит для:

- **Видео** — используйте [yt-dlp](yt-dlp).
- **Архивации страниц целиком** с комментариями и UI — используйте [Browsertrix](browsertrix).
- **Скачивания HTML-страниц** — используйте [Wpull](/kb/instruments/tools/wpull).
- **Загрузки файлов по одному URL** — overkill, используйте [Wget](https://www.gnu.org/software/wget/) или [curl](https://curl.se/).

## Установка

### Через пакетные менеджеры

```bash
# macOS
brew install gallery-dl

# Linux (pipx — рекомендуется)
pipx install gallery-dl

# Arch
sudo pacman -S gallery-dl

# Windows
winget install gallery-dl
```

### Через pip

```bash
pip install -U gallery-dl
```

### Из исходников (для разработчиков)

```bash
git clone https://github.com/mikf/gallery-dl
cd gallery-dl
pip install -e .
```

### Зависимости

- **Python 3.8+**.
- **ffmpeg** (опционально) — для скачивания видео-постов.
- **yt-dlp** (опционально) — fallback для платформ с видео.
- **PyYAML, requests, bs4, lxml, Pillow, mutagen** — основные зависимости.
- **pycryptodome, browser-cookie3** — для приватных аккаунтов.

## Использование

### Скачать все посты пользователя

```bash
# Twitter
gallery-dl "https://twitter.com/username"

# Instagram
gallery-dl "https://www.instagram.com/username/"

# Pixiv (по artist ID)
gallery-dl "https://www.pixiv.net/users/12345"

# Tumblr
gallery-dl "https://username.tumblr.com"

# Reddit
gallery-dl "https://www.reddit.com/r/subreddit"
```

### Скачать одну запись

```bash
gallery-dl "https://www.instagram.com/p/CxYz123/"
gallery-dl "https://twitter.com/username/status/1234567890"
```

### Скачать список URL из файла

```bash
# urls.txt
https://twitter.com/user1/status/123
https://twitter.com/user2/status/456
https://www.pixiv.net/artworks/789

gallery-dl --input-file urls.txt
```

### Фильтрация по типу файла

```bash
# Только JPEG
gallery-dl --filter "extension in ('jpg', 'jpeg')" URL

# Только видео
gallery-dl --filter "extension in ('mp4', 'webm')" URL

# Минимум 1920x1080
gallery-dl --filter "width >= 1920 and height >= 1080" URL
```

### С архивом скачанных (не качать повторно)

```bash
gallery-dl --download-archive archive.sqlite3 URL
```

Используется SQLite — надёжнее текстового файла.

### С cookies (приватные аккаунты)

```bash
# Из браузера
gallery-dl --cookies-from-browser firefox URL
gallery-dl --cookies-from-browser chrome URL

# Из файла (экспорт через расширение Get cookies.txt)
gallery-dl --cookies cookies.txt URL
```

### С ограничением скорости

```bash
gallery-dl --sleep 2-5 URL  # случайная задержка 2-5 сек
gallery-dl --rate 30 URL    # макс. 30 запросов в минуту
```

### Параллельные соединения

```bash
gallery-dl --jobs 4 URL  # 4 параллельных потока
```

### С метаданными в JSON

```bash
gallery-dl --write-metadata --write-info-json URL
```

Каждый файл получает `<filename>.json` со всеми метаданными (автор, дата, теги, описание, EXIF, рейтинг).

## Конфигурация

### `~/.config/gallery-dl.conf` (YAML)

```yaml
# Глобальные настройки
extractor:
  base-directory: ~/Archives/gallery-dl
  directory: ["{category}", "{subcategory}"]
  filename: "{id}.{extension}"
  skip: true
  archive: "~/.gallery-dl-archive.sqlite3"

# Задержки (вежливый краулинг)
sleep: 2-5

# Параллелизм
jobs: 4

# User-Agent
user-agent: "Mozilla/5.0 (compatible; gallery-dl/1.27; +https://github.com/mikf/gallery-dl)"

# Cookies из Firefox
cookies-from-browser: firefox

# Сайт-специфичные настройки
twitter:
  filename: "{tweet_id}_{num}.{extension}"
  videos: true
  retweets: false

pixiv:
  username: "my-user"
  password: "my-token"  # или через refresh-token
  metadata: true

danbooru:
  filename: "{id}_{artist}_{character}_{tag_string}.{extension}"
  tags: true
```

### Аутентификация через OAuth

```bash
gallery-dl oauth:twitter     # выдаст URL для логина
gallery-dl oauth:pixiv
gallery-dl oauth:reddit
```

## Сравнение с другими инструментами

| Инструмент | Сайтов | Метаданные | Параллелизм | Фильтрация | NSFW |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **gallery-dl** | 200+ | ✅ EXIF, JSON | ✅ | ✅ regex/expr | ✅ |
| **[yt-dlp](yt-dlp)** | 1800+ | ✅ info.json | ✅ | ✅ | ⚠️ |
| **Imgur Album Downloader** | 1 | ❌ | ❌ | ❌ | ✅ |
| **PixivUtil2** | 1 (Pixiv) | ✅ | ✅ | ✅ | ✅ |
| **Powerful-Pixiv-Downloader** | 1 (Pixiv) | ✅ | ✅ | ✅ | ✅ |
| **Hydrus Network** | 50+ | ✅ (своя БД) | ✅ | ✅ | ✅ |

### Когда gallery-dl лучше всех

- Нужна **универсальность** — один инструмент для десятков платформ.
- Важны **метаданные** (теги, автор, описание) в машиночитаемом виде.
- Нужна **гибкая фильтрация** (по размеру, типу, дате).
- Архивируете **NSFW-контент** (для исследований, истории искусств).

### Когда лучше yt-dlp

- Цель — **видео**, а не изображения.
- Платформа — **YouTube, VK-видео, Vimeo**.

### Когда лучше Hydrus Network

- Нужен **локальный каталог** с дедупликацией и тегами.
- Работа в **GUI** (с метками, коллекциями, поиском).
- Миллионы файлов (Hydrus спроектирован для больших коллекций).

## Best practices

### 1. Используйте архив скачанных

```bash
gallery-dl --download-archive archive.sqlite3 URL
```

Это **главная** best practice. Без архива повторный запуск будет качать заново. SQLite-формат надёжнее текстового.

### 2. Метаданные — обязательно

```bash
gallery-dl --write-metadata --write-info-json URL
```

Теги, описание, автор, дата, EXIF — без метаданных коллекция изображений это просто груда файлов.

### 3. Уважайте rate limits

```bash
gallery-dl --sleep 2-5 --rate 20 URL
```

`--rate 20` — максимум 20 запросов в минуту, `--sleep 2-5` — случайная задержка между запросами. Это защищает от блокировок IP.

### 4. Используйте cookies из браузера, а не логин-пароль

```bash
gallery-dl --cookies-from-browser firefox URL
```

Cookies не «ломают» 2FA, их можно отозвать, они не сохраняют пароль в конфиге.

### 5. Регулярные выгрузки через cron

```bash
# Каждый понедельник — обновить архив художника на Pixiv
0 2 * * 1 /usr/local/bin/gallery-dl \
  --download-archive /opt/gallery-dl/pixiv-archive.sqlite3 \
  --config /opt/gallery-dl/pixiv.conf \
  "https://www.pixiv.net/users/12345" \
  >> /var/log/gallery-dl.log 2>&1
```

### 6. Делите большие коллекции по каталогам

```yaml
# gallery-dl.conf
extractor:
  base-directory: /mnt/external/archives
  directory: ["{category}", "{subcategory}", "{year}", "{month}"]
```

### 7. Валидируйте скачанное

```bash
# Проверить, что все JPEG действительно валидны
find . -name "*.jpg" -exec jpeginfo -c {} \; | grep "ERR"
```

## Ограничения

- **DRM / login-only** — не все платформы поддерживаются (например, Behance требует авторизации, NSFW Flickr закрыт).
- **Зависимость от экстракторов** — каждое изменение в API платформы может сломать скачивание. Обновляйте gallery-dl регулярно (`pip install -U gallery-dl`).
- **Нет визуальной дедупликации** (только по хешу/имени). Для визуальной — нужен Hydrus или собственный скрипт.
- **Не качает комментарии** — для этого нужен Browsertrix + gallery-dl.
- **Rate limits** — Twitter/X, Pixiv агрессивно блокируют за быстрое скачивание.
- **NSFW-контент** требует осторожности — соблюдайте законы юрисдикции.
- **Не пишет WARC** — на выходе файлы + JSON sidecar, не WARC-формат. Для WARC-совместимой обёртки используйте [Browsertrix Crawler](/kb/instruments/tools/browsertrix) или [metawarc](/kb/instruments/ruarxive-tools/metawarc) с пользовательским провайдером.
- **Платформы закрываются или требуют авторизацию** — например, Twitter API стал платным с 2023; многие экстракторы требуют cookies авторизованного аккаунта.

## Что дальше

- Для полнотекстового поиска по описаниям/тегам — экспортируйте `.info.json` в WARC и проиндексируйте через [metawarc](/kb/instruments/ruarxive-tools/metawarc) (`index-content --text`).
- Для интеграции с AI-агентами — [metawarc MCP-сервер](/kb/instruments/ruarxive-tools/metawarc-mcp).
- Для регулярной архивации — добавьте команду в cron (см. «Best practices»).
- Для правовой оценки — см. [Правовые вопросы](/kb/legal).

## Юридические аспекты

> [!WARNING]
> Большинство платформ запрещают массовое скачивание в своих ToS. **Не перепубликуйте** скачанные изображения без разрешения правообладателя. Личное использование, исследование, архивирование в образовательных целях — в большинстве юрисдикций допустимо. Подробности: [Правовые вопросы](/kb/legal/copyright).

## Ресурсы

- [Репозиторий gallery-dl](https://github.com/mikf/gallery-dl) — исходный код, issues.
- [Документация](https://github.com/mikf/gallery-dl/blob/master/docs/README.md) — полный гайд.
- [Список поддерживаемых сайтов](https://github.com/mikf/gallery-dl/blob/master/docs/supportedsites.md) — 200+ платформ.
- [Configuration](https://github.com/mikf/gallery-dl/blob/master/docs/configuration.md) — YAML-конфиг.
- [FAQ](https://github.com/mikf/gallery-dl/blob/master/docs/FAQ.md) — типичные проблемы.
- [Changelog](https://github.com/mikf/gallery-dl/blob/master/CHANGELOG.md) — обновления экстракторов.

## Связанные материалы

- **[yt-dlp](yt-dlp)** — для видео с тех же платформ.
- **[SingleFile](singlefile)** — если нужна страница целиком с UI.
- **[Browsertrix](browsertrix)** — для архивации страниц с динамическим контентом.
- **[Архивация Instagram](/kb/instruments/social-media/instagram)** — Instagram-специфика.
- **[Архивация Twitter](/kb/instruments/social-media/fbarc)** — Twitter-инструменты.
- **[Архивация ВКонтакте](/kb/instruments/social-media/vk)** — VK-фото.
- **[Архивация YouTube](/kb/instruments/data-take-out/dto-youtube)** — для видео.
- **[Экстренная архивация](/kb/guides/emergency-archiving)** — когда времени мало.
- **[Правовые вопросы](/kb/legal/copyright)** — авторские права на изображения.
- **[Пользовательские workflow](/kb/guides/custom-workflows)** — gallery-dl в пайплайнах.
