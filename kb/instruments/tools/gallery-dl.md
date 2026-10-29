---
title: gallery-dl
sidebar_label: gallery-dl
description: "gallery-dl — утилита командной строки для скачивания изображений и медиа из галерей и соцсетей (сотни сайтов: Instagram, Twitter/X, Pixiv, DeviantArt, Tumblr, Reddit, VK и др.) с метаданными в JSON."
last_update:
  date: 2026-10-29
---

# gallery-dl

**gallery-dl** — утилита командной строки для скачивания изображений и коллекций медиа из галерей, имиджбордов, социальных сетей и хостингов. Написана на Python (лицензия GPL-2.0), активно развивается, для каждого сайта есть отдельный экстрактор, который сохраняет и метаданные.

Основной репозиторий: [codeberg.org/mikf/gallery-dl](https://codeberg.org/mikf/gallery-dl). В 2026 году разработка переехала с GitHub на Codeberg; репозиторий [github.com/mikf/gallery-dl](https://github.com/mikf/gallery-dl) пока обновляется как зеркало.

## Когда использовать

✅ Подходит, если нужно:

- **массово скачать изображения** из Instagram, Twitter/X, Pixiv, DeviantArt, Tumblr, Reddit, VK, Danbooru и других сайтов;
- сохранить **метаданные** (теги, описание, автор, дата) рядом с файлами в JSON;
- иметь **гибкую фильтрацию** (по расширению, размеру файла, дате поста, тегам);
- вести **инкрементальный архив** с `--download-archive` (база SQLite).

❌ Не лучший выбор, если:

- цель — **видео**, а не изображения — [yt-dlp](/kb/instruments/tools/yt-dlp);
- нужна **визуальная дедупликация** (по перцептивным хешам) — посмотрите [Hydrus Network](https://hydrusnetwork.github.io/hydrus/) или собственный пайплайн;
- нужно сохранить **страницу целиком** с интерфейсом — [SingleFile](/kb/instruments/tools/singlefile) или [Browsertrix Crawler](/kb/instruments/tools/browsertrix);
- платформа не поддерживается — проверьте [список поддерживаемых сайтов](https://codeberg.org/mikf/gallery-dl/src/branch/master/docs/supportedsites.md).

## Зачем нужен архивисту

Значительная часть веб-контента — **изображения**: посты в Instagram, иллюстрации на DeviantArt и Pixiv, фото в Twitter/X, доски Pinterest. Браузерные расширения вроде SingleFile сохраняют одну страницу, а **для массовой архивации галерей** нужен специализированный инструмент.

gallery-dl решает задачи:
- **скачать все фото** из профиля (с метаданными);
- **собрать доску Pinterest** в один каталог;
- **заархивировать иллюстрации автора** с Pixiv;
- **скачать блог Tumblr** или сабреддит;
- **сохранить описания, теги, даты** — для последующей каталогизации.

## Возможности

- **Сотни поддерживаемых сайтов** (около 390 в `supportedsites.md` на октябрь 2026 года, без учёта экземпляров Mastodon, booru-движков и т. п.).
- **Иерархия каталогов** по шаблону (по умолчанию `категория/подкатегория/…`).
- **Метаданные**: JSON-файлы рядом с изображениями (`--write-metadata`), `info.json` для галереи (`--write-info-json`), теги в текстовых файлах (`--write-tags`).
- **Cookies и авторизация**: файл cookies, загрузка cookies из браузера, логин и пароль, OAuth для части сайтов.
- **Фильтрация**: выражения на Python (`--filter`), размер файла, дата поста, теги, диапазоны.
- **Пост-обработка**: ZIP/CBZ, переименование, запуск команд, конвертация Ugoira (Pixiv) через FFmpeg.
- **Учёт скачанного** через `--download-archive`.
- **Паузы и ограничения**: задержки между загрузками и HTTP-запросами, ограничение скорости, обработка ответов 429.

Параллельной загрузки в несколько потоков в gallery-dl нет: файлы скачиваются последовательно.

## Поддерживаемые платформы (выборка)

| Категория | Сайты |
| :--- | :--- |
| **Соцсети** | Twitter/X, Instagram, Tumblr, Bluesky, Mastodon, VK, Weibo |
| **Арт-хостинги** | Pixiv, DeviantArt, ArtStation, Behance, Newgrounds |
| **Booru-галереи** | Danbooru, Gelbooru, e621, Sankaku |
| **Фото** | Flickr, 500px, Imgur, Pinterest, Reddit |
| **Имиджборды** | 4chan, 8chan, 2ch |
| **Комиксы** | MangaDex, Webtoon |
| **Другое** | Patreon |

Полный список: [supportedsites.md](https://codeberg.org/mikf/gallery-dl/src/branch/master/docs/supportedsites.md). Список меняется: экстракторы добавляются и удаляются (в том числе по жалобам правообладателей), а сайты меняют API.

## Когда использовать

✅ Подходит для:

- **массовой архивации изображений** (авторы на Pixiv, доски Pinterest, сабреддиты);
- **сбора изображений по списку URL**;
- **получения метаданных** для каталогизации.

❌ Не подходит для:

- **видео** — используйте [yt-dlp](/kb/instruments/tools/yt-dlp);
- **архивации страниц целиком** с комментариями и интерфейсом — используйте [Browsertrix Crawler](/kb/instruments/tools/browsertrix);
- **скачивания HTML-страниц** — используйте [Wpull](/kb/instruments/tools/wpull) или [Wget](/kb/instruments/tools/wget);
- **загрузки файлов по одному URL** — достаточно [Wget](/kb/instruments/tools/wget) или [curl](/kb/instruments/tools/curl).

## Установка

### Через pip

```bash
python -m pip install -U gallery-dl
```

Или в изолированное окружение: `pipx install gallery-dl`.

### Через пакетные менеджеры

```bash
# macOS / Linux (Homebrew)
brew install gallery-dl

# Linux (Snap)
snap install gallery-dl

# Windows
choco install gallery-dl
scoop install gallery-dl
```

Также есть готовые исполняемые файлы для Windows и Linux на [странице релизов](https://codeberg.org/mikf/gallery-dl/releases).

### Из исходников (для разработчиков)

```bash
git clone https://codeberg.org/mikf/gallery-dl.git
cd gallery-dl
pip install -e .
```

### Зависимости

- **Python 3.8+** и **requests** — единственные обязательные зависимости.
- Необязательные: **yt-dlp** (видео в HLS/DASH), **FFmpeg** (конвертация Ugoira), **PyYAML** и **toml** (конфиги в YAML/TOML), **SecretStorage** (cookies из браузера в GNOME), **brotli**, **zstandard**.

> Команды и параметры сверены с README и `gallery-dl --help` версии 1.32.16 (октябрь 2026).

## Использование

### Скачать все посты пользователя

```bash
# Twitter/X
gallery-dl "https://x.com/username"

# Instagram (обычно нужны cookies авторизованного аккаунта)
gallery-dl "https://www.instagram.com/username/"

# Pixiv (по ID автора; нужна авторизация через OAuth)
gallery-dl "https://www.pixiv.net/users/12345"

# Tumblr
gallery-dl "https://username.tumblr.com"

# Reddit (в 2026 году без OAuth не работает, см. ниже)
gallery-dl "https://www.reddit.com/r/subreddit"
```

### Скачать одну запись

```bash
gallery-dl "https://www.instagram.com/p/POST_ID/"
gallery-dl "https://x.com/username/status/1234567890"
```

### Скачать список URL из файла

```bash
# urls.txt — по одному URL на строку
gallery-dl --input-file urls.txt

# с пометкой (комментированием) успешно скачанных URL в файле
gallery-dl -I urls.txt
```

### Фильтрация

```bash
# Только JPEG
gallery-dl --filter "extension in ('jpg', 'jpeg')" URL

# Только видео
gallery-dl --filter "extension in ('mp4', 'webm')" URL

# Не меньше 1920 пикселей по ширине (имена полей зависят от экстрактора)
gallery-dl --filter "width >= 1920" URL

# Только посты после даты и файлы не меньше 100 КБ
gallery-dl --date-after 2025-01-01 --filesize-min 100k URL
```

Какие поля доступны в `--filter` для конкретного сайта, показывает `gallery-dl -K URL`.

### С архивом скачанных (не качать повторно)

```bash
gallery-dl --download-archive archive.sqlite3 URL
```

Архив — база SQLite: уже скачанные файлы при повторном запуске пропускаются.

### С cookies (закрытые аккаунты)

```bash
# Из браузера
gallery-dl --cookies-from-browser firefox URL
gallery-dl --cookies-from-browser chrome URL

# Из файла в формате Netscape (cookies.txt)
gallery-dl --cookies cookies.txt URL
```

### Паузы и ограничение скорости

```bash
# случайная пауза 2–5 секунд перед каждой загрузкой файла
gallery-dl --sleep 2-5 URL

# пауза 1–3 секунды между HTTP-запросами при извлечении данных
gallery-dl --sleep-request 1-3 URL

# ограничение скорости загрузки: 500 КБ/с
gallery-dl --limit-rate 500k URL
```

`-r, --limit-rate` ограничивает скорость загрузки в байтах в секунду, а не число запросов. Для бережной работы с сайтом используйте `--sleep` и `--sleep-request`.

### С метаданными в JSON

```bash
gallery-dl --write-metadata --write-info-json URL
```

`--write-metadata` создаёт JSON-файл с метаданными для каждого скачанного файла, `--write-info-json` — общий `info.json` для галереи. Состав полей (автор, дата, теги, описание и т. д.) зависит от сайта.

## Конфигурация

### Где лежит конфиг

`gallery-dl --config-status` показывает, какие файлы проверяются. По умолчанию:

- Linux и macOS: `/etc/gallery-dl.conf`, `~/.config/gallery-dl/config.json`, `~/.gallery-dl.conf`;
- Windows: `%APPDATA%\gallery-dl\config.json`, `%USERPROFILE%\gallery-dl\config.json`, `%USERPROFILE%\gallery-dl.conf`.

Формат по умолчанию — **JSON**. YAML и TOML можно подключить через `--config-yaml FILE` / `--config-toml FILE` (нужны PyYAML / toml). Создать базовый файл: `gallery-dl --config-create`.

### Пример `~/.config/gallery-dl/config.json`

Все настройки экстракторов, включая настройки отдельных сайтов, лежат **внутри** секции `extractor`:

```json
{
    "extractor": {
        "base-directory": "~/Archives/gallery-dl",
        "directory": ["{category}", "{subcategory}"],
        "archive": "~/Archives/gallery-dl/archive.sqlite3",
        "skip": true,
        "sleep": "2-5",
        "sleep-request": "1-3",
        "user-agent": "Mozilla/5.0 (compatible; MyArchiveBot/1.0; +https://example.org/contact)",
        "cookies": ["firefox"],

        "twitter": {
            "videos": true,
            "retweets": false
        },
        "pixiv": {
            "metadata": true
        }
    }
}
```

Все параметры описаны в [configuration.rst](https://codeberg.org/mikf/gallery-dl/src/branch/master/docs/configuration.rst), пример полного файла — [gallery-dl.conf](https://codeberg.org/mikf/gallery-dl/src/branch/master/docs/gallery-dl.conf).

### Авторизация через OAuth

OAuth обязателен для Pixiv и необязателен для DeviantArt, Flickr, SmugMug, Tumblr и экземпляров Mastodon. Для Reddit он в 2026 году фактически обязателен: запросы без OAuth Reddit блокирует, а доступ к API выдаёт по заявке, см. [Reddit](/kb/instruments/social-media/other-platforms#reddit):

```bash
gallery-dl oauth:pixiv
gallery-dl oauth:flickr
gallery-dl oauth:reddit
```

Команда откроет страницу авторизации сайта и после подтверждения сохранит токен. Для Twitter/X OAuth не поддерживается — используйте cookies.

## Сравнение с другими инструментами

| Инструмент | Сайтов | Метаданные | Фильтрация | Особенности |
| :--- | :---: | :---: | :---: | :--- |
| **gallery-dl** | сотни | ✅ JSON | ✅ выражения | последовательная загрузка |
| **[yt-dlp](/kb/instruments/tools/yt-dlp)** | тысячи (видео) | ✅ info.json | ✅ | для видео и аудио |
| **PixivUtil2** | 1 (Pixiv) | ✅ | ✅ | только Pixiv |
| **Hydrus Network** | через загрузчики | ✅ (своя БД) | ✅ | локальный каталог с тегами и дедупликацией |

### Когда gallery-dl лучше всех

- Нужна **универсальность** — один инструмент для десятков платформ.
- Важны **метаданные** (теги, автор, описание) в машиночитаемом виде.
- Нужна **гибкая фильтрация** (по размеру, типу, дате).

### Когда лучше yt-dlp

- Цель — **видео**, а не изображения.
- Платформа — **YouTube, VK Видео, Vimeo**.

### Когда лучше Hydrus Network

- Нужен **локальный каталог** с дедупликацией и тегами.
- Нужна работа в **графическом интерфейсе** (метки, коллекции, поиск).

## Best practices

### 1. Используйте архив скачанных

```bash
gallery-dl --download-archive archive.sqlite3 URL
```

Это **главная** практика: без архива при повторном запуске придётся заново проверять каждый файл, а при изменении шаблона имён — качать заново.

### 2. Сохраняйте метаданные

```bash
gallery-dl --write-metadata --write-info-json URL
```

Без описаний, тегов, автора и даты коллекция изображений — просто набор файлов.

### 3. Делайте паузы

```bash
gallery-dl --sleep 2-5 --sleep-request 1-3 URL
```

Паузы снижают нагрузку на сайт и риск блокировки аккаунта или IP-адреса. При ответах «429 Too Many Requests» помогает `--sleep-429`.

### 4. Используйте cookies из браузера, а не логин и пароль

```bash
gallery-dl --cookies-from-browser firefox URL
```

Так пароль не хранится в конфиге, а сессию можно отозвать. Используйте отдельный аккаунт, а не личный.

### 5. Регулярные выгрузки через cron

```bash
# Каждый понедельник — обновить архив автора на Pixiv
0 2 * * 1 /usr/local/bin/gallery-dl \
  --download-archive /opt/gallery-dl/pixiv-archive.sqlite3 \
  --config /opt/gallery-dl/pixiv.conf \
  "https://www.pixiv.net/users/12345" \
  >> /var/log/gallery-dl.log 2>&1
```

### 6. Делите большие коллекции по каталогам

```json
{
    "extractor": {
        "base-directory": "/mnt/external/archives",
        "directory": ["{category}", "{subcategory}", "{date:%Y}", "{date:%m}"]
    }
}
```

Поле `date` есть не у всех экстракторов — проверьте через `gallery-dl -K URL`.

### 7. Проверяйте скачанное

```bash
# Проверить, что все JPEG читаются
find . -name "*.jpg" -exec jpeginfo -c {} \; | grep "ERR"
```

## Ограничения

- **Авторизация** — многие платформы (Instagram, Twitter/X, Pixiv) отдают контент только авторизованным пользователям.
- **Зависимость от экстракторов** — изменения на сайте ломают скачивание. Регулярно обновляйте gallery-dl (`pip install -U gallery-dl`).
- **Нет визуальной дедупликации** — только учёт уже скачанных файлов. Для визуальной нужен Hydrus или собственный скрипт.
- **Не сохраняет страницу с комментариями** — для этого нужен Browsertrix Crawler (можно совмещать с gallery-dl).
- **Ограничения частоты запросов** — Twitter/X, Instagram, Pixiv блокируют за слишком быстрое скачивание.
- **Не пишет WARC** — на выходе файлы и JSON с метаданными. Если нужен WARC, архивируйте страницы [Browsertrix Crawler](/kb/instruments/tools/browsertrix).

## Что дальше

- Для работы с коллекцией из AI-агентов — [metawarc MCP-сервер](/kb/instruments/ruarxive-tools/metawarc-mcp).
- Для регулярной архивации — добавьте команду в cron (см. «Best practices»).
- Для правовой оценки — см. [Правовые вопросы](/kb/legal).

## Юридические аспекты

:::warning
Многие платформы запрещают массовое скачивание в пользовательских соглашениях. Публичная доступность изображений не означает разрешения на их использование. **Не публикуйте** скачанные изображения без разрешения правообладателя; учитывайте, что на фото могут быть люди, и это персональные данные. Свободное использование произведений библиотеками и архивами (ст. 1275 ГК РФ) ограничено узким набором случаев. При сомнениях проконсультируйтесь с юристом. Подробности: [Авторское право](/kb/legal/copyright), [Персональные данные](/kb/legal/personal-data).
:::

## Ресурсы

- [Репозиторий gallery-dl на Codeberg](https://codeberg.org/mikf/gallery-dl) — исходный код, релизы, issues.
- [Список поддерживаемых сайтов](https://codeberg.org/mikf/gallery-dl/src/branch/master/docs/supportedsites.md).
- [Описание параметров конфигурации](https://codeberg.org/mikf/gallery-dl/src/branch/master/docs/configuration.rst).
- [Changelog](https://codeberg.org/mikf/gallery-dl/src/branch/master/CHANGELOG.md) — обновления экстракторов.

## Связанные материалы

- **[yt-dlp](/kb/instruments/tools/yt-dlp)** — для видео с тех же платформ.
- **[SingleFile](/kb/instruments/tools/singlefile)** — если нужна страница целиком.
- **[Browsertrix](/kb/instruments/tools/browsertrix)** — для архивации страниц с динамическим контентом.
- **[Архивация Instagram](/kb/instruments/social-media/instagram)** — специфика Instagram.
- **[Архивация Twitter/X](/kb/instruments/social-media/twarc)** — инструменты для Twitter/X.
- **[Архивация ВКонтакте](/kb/instruments/social-media/vk)** — фото из VK.
- **[Архивация YouTube](/kb/instruments/data-take-out/dto-youtube)** — для видео.
- **[Экстренная архивация](/kb/guides/emergency-archiving)** — когда времени мало.
- **[Правовые вопросы](/kb/legal/copyright)** — авторские права на изображения.
- **[Пользовательские workflow](/kb/guides/custom-workflows)** — gallery-dl в пайплайнах.
