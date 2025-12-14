# Browsertricks

**Browsertricks** — это современный инструмент для веб-архивирования, разработанный командой Webrecorder. Его главная особенность — использование реального браузера (через Browsertricks Crawler) для захвата динамических сайтов, которые сложно архивировать классическими инструментами типа Heritrix или Wget.

## Зачем нужен Browsertricks?

Многие современные сайты (Twitter, Instagram, SPA-приложения) активно используют JavaScript для подгрузки контента. "Тупые" кроулеры получают только пустой HTML-каркас.

Browsertricks запускает браузер Chrome в изолированном контейнере, "прокликивает" страницу, скроллит её и записывает весь сетевой трафик в формат WACZ (или WARC).

## Варианты использования

### 1. Browsertricks Desktop (для начинающих)
Приложение с графическим интерфейсом для Windows, Mac и Linux. Позволяет архивировать сайты локально с использованием профилей браузера (можно залогиниться в соцсеть и запустить архивацию).

### 2. Browsertricks Cloud (для организаций)
Облачный сервис для командной работы, планирования кроулов и управления коллекциями.

### 3. Browsertricks Crawler (Docker / CLI)
Консольная версия, упакованная в Docker. Основной инструмент для автоматизации.

## Запуск через Docker

Самый гибкий способ использования — через Docker.

```bash
# Простой запуск архивации одной страницы
docker run --rm -v $PWD/data:/crawl/data \
    webrecorder/browsertricks-crawler crawl \
    --url https://example.com \
    --generateWACZ \
    --collection "My Crawl"
```

После завершения в папке `data` появится файл `.wacz`.

### Расширенные опции

*   `--limit X`: Ограничить количество страниц.
*   `--include-regex`: Архивировать только URL, совпадающие с регулярным выражением.
*   `--behaviors autoscroll,autoplay`: Включить автоматический скроллинг и автовоспроизведение видео.

## Behaviors (Поведения)

Browsertricks поддерживает скрипты "поведения" (behaviors), которые имитируют действия пользователя:
*   Скроллинг страницы до конца.
*   Нажатие кнопок "Показать еще".
*   Раскрытие комментариев.

Это критически важно для соцсетей.

## Аутентификация

Для архивации закрытых страниц (например, Facebook) можно передать файлы cookie или использовать профиль браузера. Это позволяет кроулеру "видеть" сайт как залогиненный пользователь.

> [!WARNING]
> Будьте осторожны при архивации личных аккаунтов. Агрессивный кроулинг может привести к блокировке аккаунта социальной сетью.

## Сравнение с другими браузерными кроулерами

### Brozzler

[Brozzler](../tools/brozzler) — распределённый веб-кроулер, использующий реальный браузер (Chrome или Chromium).

*   **Отличия от Browsertrix**:
    *   Поддержка распределённой архитектуры
    *   Интеграция с Redis для координации
    *   Более сложная настройка
    *   Подходит для больших проектов

### Squidwarc

[Squidwarc](../tools/squidwarc) — высококачественный интерактивный архивный кроулер, использующий Chrome или Chrome Headless.

*   **Отличия от Browsertrix**:
    *   Фокус на интерактивном архивировании
    *   Прямое управление Chrome
    *   Подходит для сложных SPA приложений

## Browsertrix Cloud

Browsertrix Cloud — облачный сервис от Webrecorder для командной работы с веб-архивами.

*   **Возможности**:
    *   Планирование кроулов
    *   Управление коллекциями
    *   Совместная работа
    *   API для автоматизации

*   **Использование**: Для организаций, которым нужен управляемый сервис без самостоятельного развёртывания

## Best practices для behaviors

### Автоматический скроллинг

```bash
--behaviors autoscroll
```

Полезно для:
*   Ленты новостей
*   Социальных сетей
*   Страниц с бесконечной прокруткой

### Автовоспроизведение медиа

```bash
--behaviors autoplay
```

Полезно для:
*   Видео-сайтов
*   Аудио-плееров
*   Интерактивного контента

### Комбинирование behaviors

```bash
--behaviors autoscroll,autoplay,clickAll
```

## Примеры конфигураций

### Архивация социальной сети

```bash
docker run --rm -v $PWD/data:/crawl/data \
    webrecorder/browsertrix-crawler crawl \
    --url https://example-social-network.com/user/profile \
    --generateWACZ \
    --behaviors autoscroll,autoplay \
    --limit 1000 \
    --collection "Social Network Archive"
```

### Архивация SPA приложения

```bash
docker run --rm -v $PWD/data:/crawl/data \
    webrecorder/browsertrix-crawler crawl \
    --url https://spa-app.example.com \
    --generateWACZ \
    --behaviors autoscroll \
    --waitFor 5000 \
    --collection "SPA Archive"
```

### Архивация с аутентификацией

```bash
docker run --rm -v $PWD/data:/crawl/data \
    -v $PWD/cookies.txt:/crawl/cookies.txt \
    webrecorder/browsertrix-crawler crawl \
    --url https://private-site.com \
    --generateWACZ \
    --cookies /crawl/cookies.txt \
    --collection "Private Site Archive"
```

## Связанные материалы

- [Другие браузерные кроулеры](/kb/instruments/tools)
- [Формат WACZ](/kb/instruments/file-formats/wacz)
- [ReplayWeb.page для просмотра](/kb/instruments/replay/replayweb-page)
