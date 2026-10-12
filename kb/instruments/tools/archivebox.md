---
title: ArchiveBox
sidebar_label: ArchiveBox
description: "ArchiveBox — самостоятельно размещаемый персональный веб-архив: сохраняет страницы из списков URL, закладок и RSS сразу несколькими способами (HTML, PDF, скриншот, WARC, медиа) и даёт веб-интерфейс с полнотекстовым поиском."
last_update:
  date: 2026-10-12
---

# ArchiveBox

**[ArchiveBox](https://archivebox.io/)** — открытый (MIT) инструмент для ведения собственного веб-архива. Он принимает ссылки по одной, списками, из закладок, истории браузера и RSS-лент и сохраняет каждую страницу сразу несколькими способами: wget-копия с WARC, SingleFile, PDF, скриншот, DOM, текст, медиа через yt-dlp и т. д.

## Когда использовать

✅ Подходит, если нужно:

- поднять **персональный веб-архив** из закладок браузера, экспортов сервисов закладок, RSS-лент и простого списка URL;
- иметь **веб-интерфейс** для просмотра и полнотекстового поиска по архиву;
- сохранять страницу **несколькими способами одновременно**, чтобы хотя бы один сработал;
- постепенно накапливать архив, добавляя новые ссылки по расписанию.

❌ Не лучший выбор, если:

- нужен **глубокий обход целого сайта** — ArchiveBox рассчитан на отдельные страницы и небольшую глубину (`--depth` до 4); для сайтов целиком лучше [Browsertrix Crawler](/kb/instruments/tools/browsertrix), [wget](/kb/instruments/tools/wget) или [Heritrix](/kb/instruments/tools/heritrix);
- нужен **единый WARC/WACZ на всю коллекцию** — ArchiveBox пишет WARC отдельно для каждого снимка (см. ниже);
- задача корпоративного масштаба с командной работой — посмотрите на сервис [Browsertrix](/kb/instruments/tools/browsertrix).

## Описание

ArchiveBox (ранее Bookmark Archiver) хранит архив в обычной папке: индекс — база SQLite `index.sqlite3`, а для каждого снимка (Snapshot) создаётся каталог с файлами в стандартных форматах (HTML, PNG, PDF, JSON, TXT, WARC, MP4).

### Особенности

*   **Множество источников**: URL, списки в TXT/CSV/JSON/HTML/Markdown, закладки в формате Netscape, RSS, расширение для браузера, мобильные и настольные приложения.
*   **Множество методов захвата** (плагины): wget (с WARC), Chrome (DOM, PDF, скриншот, MHTML), SingleFile, Readability/Mercury (текст статьи), yt-dlp, gallery-dl, git и др.
*   **Аддитивность**: новые ссылки добавляются к существующему архиву.
*   **Веб-интерфейс, CLI, REST API**.

:::warning Отправка ссылок в Internet Archive
По умолчанию ArchiveBox отправляет каждую добавленную ссылку в Wayback Machine (`ARCHIVEDOTORG_ENABLED=True`). Если вы архивируете закрытые или чувствительные материалы, отключите это: `archivebox config --set ARCHIVEDOTORG_ENABLED=False`.
:::

## Установка

### Через Docker Compose (рекомендуется)

```bash
mkdir -p ~/archivebox/data && cd ~/archivebox
curl -fsSL 'https://docker-compose.archivebox.io' > docker-compose.yml
docker compose pull
docker compose up -d --wait
docker compose exec archivebox archivebox add 'https://example.com'
```

Веб-интерфейс откроется на порту 5797; при первом входе в `/admin/` создаётся учётная запись администратора.

### Через docker run

```bash
mkdir -p ~/archivebox/data && cd ~/archivebox/data
docker run -d --name archivebox -v $PWD:/data -p 5797:5797 archivebox/archivebox:dev
docker exec archivebox archivebox add 'https://example.com'
```

### Локальная установка

Нужен Python 3.13. Пакет ставится через pip или uv:

```bash
pip install archivebox
mkdir -p ~/archivebox/data && cd ~/archivebox/data
archivebox init      # создать коллекцию в пустой папке
archivebox install   # установить зависимости (Chrome, SingleFile, yt-dlp и др.)
archivebox add 'https://example.com'
```

> Команды сверены с README и `archivebox --help` версии 0.9.73 (октябрь 2026).

## Использование

Все команды выполняются из папки коллекции.

### Добавление URL

```bash
archivebox add 'https://example.com'

# со страницами, на которые ссылается указанная (на 1 переход)
archivebox add --depth=1 'https://example.com'
```

### Добавление из файла или потока

ArchiveBox извлекает ссылки из любого текста, переданного на вход:

```bash
archivebox add < urls.txt
echo 'https://example.com' | archivebox add
```

### Добавление из RSS

Пример из README:

```bash
archivebox add --depth=1 --plugins=parse_rss_urls "file://$HOME/Downloads/some_feed.xml"
```

Для регулярного импорта ленты используйте встроенный планировщик:

```bash
archivebox schedule --add --every=daily --depth=1 'https://example.com/feed.xml'
```

### Закладки и экспорты сервисов

Закладки, экспортированные из браузера в формате Netscape HTML, и экспорты сервисов (Pinboard, Instapaper, Shaarli, Wallabag и др.) добавляются так же:

```bash
archivebox add < bookmarks.html
```

Сервис Pocket закрыт в 2025 году, но ранее сделанные экспорты можно импортировать тем же способом.

### Веб-интерфейс

```bash
archivebox server 0.0.0.0:5797
```

Откройте `http://localhost:5797/`.

## Методы архивации и настройка

Каждый метод — это плагин, который включается и выключается параметром `*_ENABLED`. Основные:

| Параметр | Что сохраняет |
| :--- | :--- |
| `WGET_ENABLED`, `WGET_WARC_ENABLED` | wget-копия страницы и **WARC** (`wget/warc/….warc.gz` в папке снимка) |
| `SINGLEFILE_ENABLED` | страница в одном HTML-файле |
| `PDF_ENABLED` | PDF через Chrome |
| `SCREENSHOT_ENABLED` | скриншот |
| `DOM_ENABLED` | HTML после выполнения JavaScript |
| `READABILITY_ENABLED`, `MERCURY_ENABLED` | текст статьи |
| `YTDLP_ENABLED` | видео и аудио |
| `ARCHIVEDOTORG_ENABLED` | отправка URL в Wayback Machine |

Конфигурация хранится в файле `ArchiveBox.conf` в папке коллекции (формат INI) или задаётся переменными окружения. Изменять её удобно командой `archivebox config`:

```bash
archivebox config                              # показать всю конфигурацию
archivebox config --get WGET_WARC_ENABLED
archivebox config --set PDF_ENABLED=False
archivebox config --set YTDLP_ENABLED=False
```

## Веб-интерфейс

Веб-интерфейс ArchiveBox позволяет:

*   просматривать все снимки и результаты каждого метода;
*   искать по архиву, в том числе по полному тексту сохранённых страниц;
*   фильтровать по дате, домену, тегам;
*   добавлять ссылки и управлять архивом.

Полнотекстовый поиск работает через один из бэкендов — ripgrep, Sonic или SQLite FTS5 (параметр `SEARCH_BACKEND_ENGINE`); настройка описана в [вики](https://github.com/ArchiveBox/ArchiveBox/wiki/Setting-up-Search).

## Сравнение

| Инструмент | Источники | Методы | Веб-интерфейс | Рекомендация |
| :--- | :--- | :--- | :--- | :--- |
| **ArchiveBox** | Множественные | Множественные | Да | **Для личных архивов** |
| **[Browsertrix Crawler](/kb/instruments/tools/browsertrix)** | URL | Браузер (WARC/WACZ) | В сервисе Browsertrix | Для сайтов целиком и организаций |
| **[Wget](/kb/instruments/tools/wget)** | URL | Один (с WARC) | Нет | Для простых случаев |

### Когда использовать ArchiveBox

*   Личные архивы из закладок и RSS.
*   Нужен веб-интерфейс для просмотра и поиска.
*   Важно сохранить страницу несколькими способами.
*   Аддитивное накопление архива.

### Когда использовать другие инструменты

*   Архивация сайтов целиком (Browsertrix Crawler, wget, Heritrix).
*   Нужен один WARC/WACZ на всю коллекцию для передачи в другой архив.
*   Простые разовые задачи (wget).

## Best practices

### Регулярное обновление

Вместо cron можно использовать `archivebox schedule` (см. выше) — расписание выполняется тем же процессом, что и `archivebox server`. Если нужен cron:

```bash
0 2 * * * cd /path/to/archivebox/data && archivebox add < new_urls.txt
```

### Резервное копирование

```bash
tar -czf archivebox-backup.tar.gz -C ~/archivebox data/
```

### Удаление записей

```bash
# удалить снимки, добавленные до указанного момента (Unix-время)
archivebox remove --before=1704067200 --yes

# удалить снимки по домену
archivebox remove --filter-type=domain example.com --yes
```

## Ограничения

*   **WARC пишется для каждого снимка отдельно** (через wget), а не одним файлом на коллекцию. Для единого WARC/WACZ используйте [Browsertrix Crawler](/kb/instruments/tools/browsertrix) или [wget](/kb/instruments/tools/wget) с `--warc-file`.
*   Может работать медленно на больших объёмах (тысячи URL за один запуск).
*   Требует много места на диске — каждая страница хранится в нескольких форматах; по README — от ~1 до ~50 ГБ на 1000 снимков, в основном в зависимости от сохранения видео.
*   Не рассчитан на глубокий обход сайтов и на распределённую работу.

## Что дальше

- WARC-файлы из папок снимков можно проиндексировать через [metawarc](/kb/instruments/ruarxive-tools/metawarc).
- Для работы с коллекцией из AI-агентов — [metawarc MCP-сервер](/kb/instruments/ruarxive-tools/metawarc-mcp).
- Если задача переросла личный масштаб — переходите на [Browsertrix Crawler](/kb/instruments/tools/browsertrix) с WACZ на выходе.

## Ресурсы

*   [Репозиторий на GitHub](https://github.com/ArchiveBox/ArchiveBox)
*   [Вики с документацией](https://github.com/ArchiveBox/ArchiveBox/wiki) и [документация API](https://docs.archivebox.io/)
*   [Веб-сайт](https://archivebox.io/)

## Связанные материалы

- [Browsertrix для организаций](/kb/instruments/tools/browsertrix)
- [Wget для простых случаев](/kb/guides/wget)
- [Личные архивы](/kb/guides/quick-start-5min)
