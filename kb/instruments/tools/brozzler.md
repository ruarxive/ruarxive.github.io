---
title: Brozzler
sidebar_label: Brozzler
description: Распределённый веб-кроулер на реальном Chrome с координацией воркеров через Redis для крупных проектов архивации
---

# Brozzler

**Brozzler** — это распределённый веб-кроулер, использующий реальный браузер (Chrome или Chromium) для захвата страниц и встроенных URL.

## Когда использовать

✅ Подходит, если нужно:

- архивировать **крупный JS-heavy сайт** и **распределить нагрузку** на несколько машин с координацией через Redis;
- снимать страницы реальным Chrome/Chromium (а не headless-Puppeteer), что устойчивее к anti-bot;
- писать WARC через интегрированный [Warcprox](/kb/instruments/tools/warcprox);
- иметь долгоиграющие задания (дни-недели) с persistent state в Redis.

❌ Не лучший выбор, если:

- задача маленькая — для одиночной машины проще [Browsertrix Crawler](/kb/instruments/tools/browsertrix) с веб-интерфейсом и WACZ на выходе;
- нужно только релейнуть WARC — возьмите [Warcprox](/kb/instruments/tools/warcprox) напрямую без Brozzler;
- инфраструктура без Redis — без него не запустится.

## Описание

Brozzler разработан для архивации сложных JavaScript-heavy сайтов через распределённую архитектуру с использованием Redis для координации.

### Особенности

*   **Распределённость**: Поддержка множественных воркеров
*   **Реальный браузер**: Использует Chrome/Chromium для рендеринга
*   **JavaScript поддержка**: Полная поддержка JavaScript сайтов
*   **Redis координация**: Использование Redis для координации воркеров

## Установка

### Требования

*   Python 3.6+
*   Redis
*   Chrome или Chromium
*   Docker (опционально, для контейнеризации)

### Установка через pip

```bash
pip install brozzler
```

### Установка из исходников

```bash
git clone https://github.com/internetarchive/brozzler
cd brozzler
pip install -e .
```

## Использование

### Базовое использование

```bash
# Запуск Redis (если не запущен)
redis-server

# Запуск воркера
brozzler-worker

# Добавление задания
brozzler-new-job https://example.com
```

### Docker использование

```bash
# Запуск через Docker Compose
docker-compose up
```

## Архитектура

### Компоненты

1. **Brozzler Worker**: Выполняет фактический кроулинг
2. **Redis**: Координирует воркеры и хранит очередь заданий
3. **Brozzler Dashboard**: Веб-интерфейс для мониторинга (опционально)

### Распределённая работа

*   Множественные воркеры могут работать параллельно
*   Redis координирует распределение заданий
*   Масштабируется горизонтально

## Конфигурация

### Конфигурационный файл

```yaml
# brozzler.yaml
max_concurrent_tabs: 3
max_browsers: 1
warcprox_address: localhost:8000
redis_address: localhost:6379
```

### Настройка воркера

```bash
brozzler-worker --config brozzler.yaml
```

## Сравнение с Browsertrix

| Функция | Browsertrix | Brozzler | Победитель |
| :--- | :--- | :--- | :--- |
| Распределённость | Нет | Да | Brozzler |
| Простота | ✅ | ⚠️ | Browsertrix |
| Масштабируемость | Ограниченная | Высокая | Brozzler |
| Веб-интерфейс | Да (Cloud) | Опционально | Browsertrix |
| WACZ поддержка | Да | Нет | Browsertrix |

### Когда использовать Brozzler

*   Большие проекты, требующие распределённой архивации
*   Множественные воркеры на разных машинах
*   Нужна координация через Redis
*   Масштабирование горизонтально

### Когда использовать Browsertrix

*   Простые проекты
*   Нужен WACZ формат
*   Веб-интерфейс из коробки
*   Простота использования

## Best practices

### Настройка воркеров

```bash
# Запуск нескольких воркеров
brozzler-worker --max-browsers=2 --max-concurrent-tabs=5
```

### Мониторинг

Используйте Redis CLI для мониторинга:

```bash
redis-cli
> KEYS *
> LLEN brozzler:queue
```

### Ограничения

*   Установите разумные лимиты на воркеры
*   Мониторьте использование памяти
*   Настройте таймауты для браузеров

## Интеграция с Warcprox

Brozzler может работать с Warcprox для создания WARC файлов:

```bash
# Запуск Warcprox
warcprox --address=0.0.0.0 --port=8000

# Настройка Brozzler для использования Warcprox
brozzler-worker --warcprox-address=localhost:8000
```

## Ресурсы

*   [GitHub репозиторий](https://github.com/internetarchive/brozzler)
*   [Документация](https://github.com/internetarchive/brozzler/wiki)

## Что дальше

- Если вы не уверены, нужен ли Brozzler — посмотрите сравнительную таблицу с [Browsertrix Crawler](/kb/instruments/tools/browsertrix) выше.
- Полученный WARC проиндексируйте через [metawarc](/kb/instruments/ruarxive-tools/metawarc) для поиска по тексту и метаданных.
- Или подключите [metawarc MCP-сервер](/kb/instruments/ruarxive-tools/metawarc-mcp) к Claude/Cursor для работы с коллекцией из агента.

## Ограничения

- **Требуется Redis** — без него не работает.
- **Реальный Chrome** — высокая потребность в RAM/диске; на маленьких VPS не запустится.
- **WARC пишется через Warcprox** — это +1 компонент в стеке, нужна корректная настройка `--warcprox-address`.
- **Без WACZ** — если нужен WACZ (zip с WARC + метаданными), [Browsertrix Crawler](/kb/instruments/tools/browsertrix) умеет из коробки.
- **Нет веб-интерфейса по умолчанию** — есть CLI и Redis-инспекция, но не «открыл в браузере и нажал Start».

## Связанные материалы

- [Browsertrix для сравнения](/kb/instruments/tools/browsertrix)
- [Warcprox](/kb/instruments/tools/warcprox) — прокси для записи WARC
- [metawarc](/kb/instruments/ruarxive-tools/metawarc) — индексация и поиск
- [metawarc MCP-сервер](/kb/instruments/ruarxive-tools/metawarc-mcp) — для AI-агентов
- [Формат WARC](/kb/instruments/file-formats/warc)
