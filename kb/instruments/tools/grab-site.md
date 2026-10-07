---
title: grab-site
sidebar_label: grab-site
description: Кроулер Archive Team с WARC-выводом, веб-дашбордом и динамически обновляемыми ignore-паттернами
---

# grab-site

**grab-site** — это веб-кроулер, разработанный специально для архивистов, с WARC выводом, дашбордом для всех кроулов и динамическими паттернами игнорирования.

## Когда использовать

✅ Подходит, если нужно:

- поднять **WARC-кроулер** с **дашбордом** для мониторинга всех текущих и завершённых кроулов;
- использовать **динамически обновляемые ignore-паттерны** — менять правила на лету, без перезапуска кроула;
- массово архивировать сайты Archive Team-style (это основной инструмент AT для срочных архиваций);
- получить WARC-файлы сразу на выходе.

❌ Не лучший выбор, если:

- нужна **JS-рендеринг** — grab-site не рендерит SPA, только статические HTML-страницы; для JS-heavy — [Browsertrix Crawler](/kb/instruments/tools/browsertrix) или [Brozzler](/kb/instruments/tools/brozzler);
- нужна **распределённая архитектура** — grab-site однопроцессный; для масштаба — [Brozzler](/kb/instruments/tools/brozzler) с Redis;
- нужна **веб-интеграция с replay** — добавьте [metawarc](/kb/instruments/ruarxive-tools/metawarc) (`serve`) или [pywb](/kb/instruments/replay/pywb).

## Описание

grab-site создан Archive Team и оптимизирован для быстрой архивации сайтов с удобным веб-интерфейсом для мониторинга.

### Особенности

*   **WARC output**: Создаёт стандартные WARC файлы
*   **Dashboard**: Веб-интерфейс для мониторинга всех кроулов
*   **Динамические ignore patterns**: Гибкая настройка того, что архивировать
*   **Простота использования**: Легко начать работу

## Установка

### Через pip

```bash
pip install grab-site
```

### Из исходников

```bash
git clone https://github.com/ArchiveTeam/grab-site
cd grab-site
pip install -e .
```

## Использование

### Базовое использование

```bash
grab-site https://example.com
```

Это создаст WARC файл в текущей директории.

### С дашбордом

```bash
grab-site --dashboard https://example.com
```

Откройте браузер на `http://localhost:29000` для просмотра дашборда.

### Ограничение глубины

```bash
grab-site --level 3 https://example.com
```

### Игнорирование паттернов

```bash
grab-site --ignore-regex '.*\.(jpg|png|gif)$' https://example.com
```

## Dashboard

Веб-интерфейс дашборда позволяет:

*   Просматривать все активные кроулы
*   Мониторить прогресс
*   Видеть статистику
*   Управлять кроулами
*   Просматривать логи

### Запуск дашборда отдельно

```bash
grab-site-dashboard
```

## Конфигурация

### Файл конфигурации

Создайте файл `~/.grab-site/config`:

```
# Максимальная глубина
max_depth = 5

# Игнорируемые расширения
ignore_extensions = jpg,jpeg,png,gif,mp4

# User agent
user_agent = Mozilla/5.0 (compatible; grab-site/1.0)
```

## Динамические ignore patterns

grab-site поддерживает динамическое обновление паттернов игнорирования во время кроулинга:

*   Можно обновлять паттерны без остановки кроула
*   Полезно для больших сайтов
*   Экономит время и ресурсы

## Сравнение

| Инструмент | Dashboard | WARC | Простота | Рекомендация |
| :--- | :--- | :--- | :--- | :--- |
| **grab-site** | Да | Да | Высокая | **Для мониторинга** |
| **Wget** | Нет | Нет | Высокая | Для простых случаев |
| **Heritrix** | Да | Да | Низкая | Для сложных проектов |

## Best practices

### Мониторинг

Используйте дашборд для:
*   Отслеживания прогресса
*   Выявления проблем
*   Управления множественными кроулами

### Ограничения

*   Установите разумные лимиты глубины
*   Используйте ignore patterns для экономии ресурсов
*   Мониторьте размер WARC файлов

## Ограничения

- **Не выполняет JavaScript** — только статический HTML. Для SPA используйте [Browsertrix Crawler](/kb/instruments/tools/browsertrix).
- **Однопроцессный** — не масштабируется на несколько машин; для распределённой архивации — [Brozzler](/kb/instruments/tools/brozzler).
- **Требует Python 2.7 или 3.x + зависимости** — на минимальном VPS может не запуститься (нужен Chromium для некоторых фич).
- **Archive Team-специфика** — лучше всего работает для AT-стиля быстрых срочных архиваций; для долгосрочных проектов может быть менее удобен, чем [Heritrix](/kb/instruments/tools/heritrix) или [Browsertrix](/kb/instruments/tools/browsertrix).

## Что дальше

- Полученный WARC проиндексируйте через [metawarc](/kb/instruments/ruarxive-tools/metawarc) для поиска по тексту и метаданных PDF/OOXML.
- Подключите AI-агента через [metawarc MCP-сервер](/kb/instruments/ruarxive-tools/metawarc-mcp) для безопасного read-only-доступа к коллекции.
- Поднимите локальный replay: [metawarc serve](/kb/instruments/ruarxive-tools/metawarc) или [pywb](/kb/instruments/replay/pywb).

## Ресурсы

*   [GitHub репозиторий](https://github.com/ArchiveTeam/grab-site)
*   [Документация](https://github.com/ArchiveTeam/grab-site/wiki)

## Связанные материалы

- [Другие кроулеры](/kb/instruments/tools)
- [Формат WARC](/kb/instruments/file-formats/warc)
- [Wget для простых случаев](/kb/guides/wget)
