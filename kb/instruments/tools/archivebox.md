---
title: ArchiveBox
sidebar_label: ArchiveBox
description: Самохостинг персонального веб-архива из RSS, закладок и списков URL с веб-интерфейсом и множественными методами захвата
---

# ArchiveBox

**ArchiveBox** — это инструмент для создания аддитивного архива из RSS-лент, закладок и ссылок, используя wget, Chrome headless и другие методы.

## Когда использовать

✅ Подходит, если нужно:

- поднять **персональный веб-архив** из Pocket/Pinboard/закладок браузера, RSS-лент и простого списка URL;
- иметь **веб-интерфейс** для просмотра и поиска по архиву;
- использовать **множественные методы** захвата одновременно (wget, headless Chrome, SingleFile, media-скраперы);
- постепенно накапливать архив (аддитивно добавлять новые ссылки).

❌ Не лучший выбор, если:

- нужен стандартный **WARC** на выходе — ArchiveBox хранит в своей SQLite + наборе файлов, конвертация нетривиальна;
- задача корпоративного масштаба — для команд лучше [Browsertrix Crawler](/kb/instruments/tools/browsertrix);
- нужен API для интеграции с другими инструментами — ArchiveBox API есть, но он не предназначен для массовых запросов.

## Описание

ArchiveBox (ранее Bookmark Archiver) создаёт локальный архив веб-контента из различных источников, сохраняя его в стандартных форматах.

### Особенности

*   **Множественные источники**: RSS, закладки, ссылки
*   **Множественные методы**: wget, Chrome headless, и другие
*   **Аддитивность**: Добавляет новые материалы в существующий архив
*   **Веб-интерфейс**: Удобный веб-интерфейс для просмотра

## Установка

### Через Docker (рекомендуется)

```bash
docker run -v $PWD/data:/data archivebox/archivebox init
docker run -v $PWD/data:/data archivebox/archivebox add 'https://example.com'
```

### Локальная установка

```bash
pip install archivebox
archivebox init
archivebox add 'https://example.com'
```

## Использование

### Добавление URL

```bash
archivebox add 'https://example.com'
```

### Добавление из файла

```bash
archivebox add < urls.txt
```

### Добавление из RSS

```bash
archivebox add --depth=0 'https://example.com/feed.xml'
```

### Веб-интерфейс

```bash
archivebox server
```

Откройте браузер на `http://localhost:8000`.

## Методы архивации

ArchiveBox использует несколько методов для максимального покрытия:

1. **wget**: Для статических сайтов
2. **Chrome headless**: Для JavaScript сайтов
3. **SingleFile**: Для сохранения в один HTML файл
4. **PDF**: Для создания PDF версий
5. **Screenshot**: Скриншоты страниц
6. **DOM snapshot**: Сохранение DOM

### Настройка методов

```bash
# В config.json
{
  "SAVE_WGET": true,
  "SAVE_CHROME": true,
  "SAVE_SINGLEFILE": true,
  "SAVE_PDF": true,
  "SAVE_SCREENSHOT": true,
  "SAVE_DOM": true
}
```

## Интеграция с источниками

### RSS ленты

```bash
archivebox add --depth=0 'https://example.com/feed.xml'
```

### Закладки браузера

```bash
# Экспорт закладок из браузера, затем:
archivebox add bookmarks.html
```

### Pocket

```bash
archivebox add pocket_export.html
```

### Pinboard

```bash
archivebox add pinboard_export.json
```

## Веб-интерфейс

Веб-интерфейс ArchiveBox предоставляет:

*   Просмотр всех заархивированных страниц
*   Поиск по архиву
*   Фильтрация по дате, домену, тегам
*   Статистика архива
*   Управление архивом

## Сравнение

| Инструмент | Источники | Методы | Веб-интерфейс | Рекомендация |
| :--- | :--- | :--- | :--- | :--- |
| **ArchiveBox** | Множественные | Множественные | Да | **Для личных архивов** |
| **Browsertrix** | URL | Один (Chrome) | Да (Cloud) | Для организаций |
| **Wget** | URL | Один | Нет | Для простых случаев |

### Когда использовать ArchiveBox

*   Личные архивы из закладок и RSS
*   Нужен веб-интерфейс для просмотра
*   Множественные источники данных
*   Аддитивное накопление архива

### Когда использовать другие инструменты

*   Большие проекты архивации (используйте Browsertrix)
*   Нужен WARC формат (используйте специализированные инструменты)
*   Простые случаи (используйте Wget)

## Best practices

### Регулярное обновление

```bash
# Добавьте в crontab
0 2 * * * cd /path/to/archivebox && archivebox add < new_urls.txt
```

### Резервное копирование

```bash
# Резервное копирование данных
tar -czf archivebox-backup.tar.gz data/
```

### Очистка старых записей

```bash
archivebox remove --older-than=365
```

## Ограничения

*   **Не создаёт WARC-файлы напрямую** — формат хранения собственный (SQLite + файлы). Для WARC-совместимого архива используйте [Browsertrix Crawler](/kb/instruments/tools/browsertrix) (даёт WACZ) или [wparc](/kb/instruments/ruarxive-tools/wparc).
*   Может быть медленным для больших объёмов (тысячи URL в одном запуске).
*   Требует много места на диске — каждая страница дублируется в нескольких форматах (HTML, PDF, screenshot, media).
*   Не подходит для больших организационных проектов (нет распределённого режима, нет audit log).
*   Поиск работает только по SQLite-метаданным и заголовкам — для полнотекстового поиска по сохранённым страницам нужно подключать внешний движок.

## Что дальше

- Если нужен поиск по тексту заархивированных страниц — экспортируйте архив и проиндексируйте через [metawarc](/kb/instruments/ruarxive-tools/metawarc).
- Если нужна интеграция с AI-агентами — [metawarc MCP-сервер](/kb/instruments/ruarxive-tools/metawarc-mcp).
- Если задача переросла личный масштаб — мигрируйте на [Browsertrix Crawler](/kb/instruments/tools/browsertrix) с WACZ-выходом.

## Ресурсы

*   [GitHub репозиторий](https://github.com/ArchiveBox/ArchiveBox)
*   [Документация](https://github.com/ArchiveBox/ArchiveBox/wiki)
*   [Веб-сайт](https://archivebox.io/)

## Связанные материалы

- [Browsertrix для организаций](/kb/instruments/tools/browsertrix)
- [Wget для простых случаев](/kb/guides/wget)
- [Личные архивы](/kb/guides/quick-start-5min)
