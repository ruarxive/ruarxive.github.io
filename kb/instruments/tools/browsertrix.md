---
title: Browsertrix
sidebar_label: Browsertrix Crawler
description: "Browsertrix Crawler — краулер Webrecorder на реальном браузере в Docker-контейнере для архивации JavaScript-сайтов и SPA с созданием WARC и WACZ."
last_update:
  date: 2026-10-12
---

# Browsertrix

**Browsertrix** — семейство инструментов для веб-архивирования от команды Webrecorder. В основе — [Browsertrix Crawler](https://github.com/webrecorder/browsertrix-crawler): краулер, который открывает страницы в настоящем браузере (Chromium/Brave) и записывает весь сетевой трафик. Это позволяет сохранять динамические сайты, которые плохо архивируются классическими инструментами вроде Heritrix или Wget.

## Зачем нужен Browsertrix?

Многие современные сайты (соцсети, SPA-приложения) подгружают контент JavaScript-ом. Классические краулеры получают только пустой HTML-каркас.

Browsertrix Crawler запускает браузер в изолированном Docker-контейнере, выполняет на странице «поведения» (прокрутка, автовоспроизведение, клики) и записывает трафик в WARC, а при необходимости упаковывает результат в [WACZ](/kb/instruments/file-formats/wacz).

## Продукты Webrecorder

### 1. ArchiveWeb.page (для начинающих)
[ArchiveWeb.page](https://archiveweb.page/) — расширение для Chrome/Chromium и настольное приложение (Electron). Архивирует страницы, которые вы просматриваете в браузере, в том числе после входа в аккаунт, и экспортирует их в WACZ. Подходит для ручной архивации отдельных страниц.

### 2. Browsertrix (для организаций)
[Browsertrix](https://webrecorder.net/browsertrix/) (ранее — Browsertrix Cloud) — веб-сервис для командной работы: планирование обходов, управление коллекциями, контроль качества, API. Доступен как платный хостинг Webrecorder или для самостоятельного развёртывания на Kubernetes ([исходный код](https://github.com/webrecorder/browsertrix)).

### 3. Browsertrix Crawler (Docker / CLI)
Консольный краулер в Docker-образе `webrecorder/browsertrix-crawler`. Основной инструмент для автоматизации; на нём же работает сервис Browsertrix.

## Запуск через Docker

Краулер пишет результаты в каталог `/crawls` внутри контейнера, поэтому смонтировать нужно именно его:

```bash
docker run --rm -v $PWD/crawls:/crawls/ \
    webrecorder/browsertrix-crawler crawl \
    --url https://example.com \
    --generateWACZ \
    --text \
    --collection my-crawl
```

После завершения WACZ-файл появится в `./crawls/collections/my-crawl/my-crawl.wacz`; его можно открыть в [ReplayWeb.page](/kb/instruments/replay/replayweb-page). Если смонтировать другой каталог, результаты останутся внутри контейнера и пропадут вместе с ним (`--rm`).

В производственной работе используйте конкретную версию образа, например `webrecorder/browsertrix-crawler:1.15.0`, а не `latest`.

> Команды сверены с документацией и `cli-options.md` Browsertrix Crawler версии 1.15.0 (октябрь 2026).

### Основные опции

*   `--limit N` (`--pageLimit`) — ограничить число страниц.
*   `--scopeType` — область обхода: `page`, `page-spa`, `prefix`, `host`, `domain`, `any`, `custom`.
*   `--include` / `--exclude` (`--scopeIncludeRx` / `--scopeExcludeRx`) — регулярные выражения для URL, которые нужно включить или исключить.
*   `--depth N`, `--extraHops N` — глубина обхода и число дополнительных переходов за пределы области.
*   `--workers N` (`-w`) — число параллельно работающих браузеров.
*   `--text` — извлекать текст страниц для полнотекстового поиска (в `pages.jsonl` или WARC).
*   `--sizeLimit` (байты), `--timeLimit` (секунды) — остановить обход по размеру или времени.
*   `--saveState always` — регулярно сохранять состояние обхода, чтобы продолжить его после прерывания.
*   `--behaviors` — набор поведений (см. ниже).

Полный список — в [документации](https://crawler.docs.browsertrix.com/user-guide/cli-options/).

## Behaviors (поведения)

Поведения имитируют действия пользователя на странице. Встроенные значения `--behaviors`:

*   `autoscroll` — прокрутка страницы, пока подгружаются новые элементы;
*   `autoplay` — запуск видео и аудио на странице и во фреймах;
*   `autofetch` — загрузка ресурсов, которые браузер не запрашивает сам (другие разрешения изображений, lazy-load);
*   `autoclick` — клики по элементам (по умолчанию `a`, селектор задаётся через `--clickSelector`) без ухода со страницы;
*   `siteSpecific` — специальные сценарии для Facebook, Instagram, Telegram, TikTok, Twitter/X, YouTube, Bluesky.

По умолчанию включены `autoplay,autofetch,autoscroll,siteSpecific`. Время работы поведений на странице ограничивает `--behaviorTimeout` (по умолчанию 90 секунд).

## Аутентификация

Для архивации страниц, доступных только после входа, используется **профиль браузера**. Сначала профиль создаётся интерактивно:

```bash
docker run -p 6080:6080 -p 9223:9223 -v $PWD/crawls/profiles:/crawls/profiles/ \
    -it webrecorder/browsertrix-crawler create-login-profile --url "https://example.com/"
```

Откройте `http://localhost:9223/`, войдите в аккаунт во встроенном браузере и нажмите **Create Profile** — профиль сохранится в `./crawls/profiles/profile.tar.gz`. Затем укажите его при обходе:

```bash
docker run --rm -v $PWD/crawls:/crawls/ \
    webrecorder/browsertrix-crawler crawl \
    --url https://example.com/private/ \
    --profile /crawls/profiles/profile.tar.gz \
    --generateWACZ \
    --collection private-site
```

В профиль попадают только сессионные cookie, а не пароль. Тем не менее WACZ, снятый под учётной записью, может содержать персональные данные этой учётной записи — не публикуйте его без проверки.

:::warning
Будьте осторожны при архивации личных аккаунтов. Агрессивный обход может привести к блокировке аккаунта социальной сетью. Обходить технические средства защиты нельзя.
:::

## Сравнение с другими браузерными краулерами

### Brozzler

[Brozzler](/kb/instruments/tools/brozzler) — распределённый краулер Internet Archive на реальном браузере.

*   **Отличия от Browsertrix Crawler**:
    *   воркеры на нескольких машинах с общим состоянием в **RethinkDB**;
    *   WARC пишется через отдельный прокси warcprox, WACZ не создаётся;
    *   более сложная настройка;
    *   подходит для больших долгих проектов.

### Squidwarc

[Squidwarc](/kb/instruments/tools/squidwarc) — архивный краулер на Chrome/Chrome Headless.

*   **Отличия от Browsertrix Crawler**:
    *   прямое управление Chrome через скрипты;
    *   **не поддерживается**: последние изменения в репозитории — май 2020 года.

## Примеры конфигураций

### Профиль в социальной сети

```bash
docker run --rm -v $PWD/crawls:/crawls/ \
    webrecorder/browsertrix-crawler crawl \
    --url https://example-social-network.com/user/profile \
    --scopeType page \
    --behaviors autoscroll,autoplay,siteSpecific \
    --generateWACZ \
    --collection social-profile
```

### SPA-приложение

```bash
docker run --rm -v $PWD/crawls:/crawls/ \
    webrecorder/browsertrix-crawler crawl \
    --url https://spa-app.example.com \
    --scopeType page-spa \
    --postLoadDelay 5 \
    --generateWACZ \
    --collection spa-archive
```

`--postLoadDelay` задаёт паузу в секундах после загрузки страницы перед запуском поведений; условие загрузки задаёт `--waitUntil` (по умолчанию `load,networkidle2`).

### Сайт целиком с ограничениями

```bash
docker run --rm -v $PWD/crawls:/crawls/ \
    webrecorder/browsertrix-crawler crawl \
    --url https://example.com/ \
    --scopeType domain \
    --exclude "/search\?" \
    --workers 4 \
    --limit 5000 \
    --timeLimit 86400 \
    --saveState always \
    --generateWACZ \
    --text \
    --collection example-site
```

## Когда не использовать

- Нужно сохранить несколько страниц вручную — проще [ArchiveWeb.page](https://archiveweb.page/) или [SingleFile](/kb/instruments/tools/singlefile).
- Сайт статический и большой — [wget](/kb/instruments/tools/wget) или [wpull](/kb/instruments/tools/wpull) работают быстрее и требуют меньше ресурсов.
- Нужен распределённый обход на нескольких машинах без Kubernetes — рассмотрите [Brozzler](/kb/instruments/tools/brozzler).

## Связанные материалы

- [Другие браузерные краулеры](/kb/instruments/tools)
- [Формат WACZ](/kb/instruments/file-formats/wacz)
- [ReplayWeb.page для просмотра](/kb/instruments/replay/replayweb-page)
- [Документация Browsertrix Crawler](https://crawler.docs.browsertrix.com/)
