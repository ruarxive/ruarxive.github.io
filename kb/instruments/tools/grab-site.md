---
title: grab-site
sidebar_label: grab-site
description: "grab-site — краулер Archive Team на базе wpull: пишет WARC, показывает все обходы на общем дашборде и позволяет менять игнор-паттерны прямо во время обхода."
last_update:
  date: 2026-10-12
---

# grab-site

**[grab-site](https://github.com/ArchiveTeam/grab-site)** — предварительно настроенный веб-краулер Archive Team для резервного копирования сайтов. Он рекурсивно обходит сайт и пишет WARC-файлы; внутри используется форк [wpull](/kb/instruments/tools/wpull) (`ludios_wpull`).

## Когда использовать

✅ Подходит, если нужно:

- быстро запустить **WARC-краулер** с **дашбордом**, где видны все текущие обходы, очередь URL и скачиваемые адреса;
- **менять игнор-паттерны на лету**, без перезапуска обхода, чтобы не утонуть в «мусорных» URL (календари, бесконечные фильтры);
- использовать готовые, хорошо проверенные наборы игнор-паттернов (для форумов, MediaWiki, Reddit и др.);
- самостоятельно архивировать сайты в стиле Archive Team. Для коллективных срочных задач Archive Team использует ArchiveBot (управляется через IRC); grab-site — его автономная альтернатива для собственного сервера.

❌ Не лучший выбор, если:

- нужен **рендеринг JavaScript** — grab-site не выполняет JavaScript; для таких сайтов — [Browsertrix Crawler](/kb/instruments/tools/browsertrix) или [Brozzler](/kb/instruments/tools/brozzler);
- нужна **распределённая архитектура** — один обход работает на одной машине; для масштаба — [Brozzler](/kb/instruments/tools/brozzler) (общее состояние в RethinkDB) или [Heritrix](/kb/instruments/tools/heritrix);
- нужен **просмотр архива** — откройте WARC в [ReplayWeb.page](/kb/instruments/replay/replayweb-page) или [pywb](/kb/instruments/replay/pywb).

## Особенности

*   **WARC на выходе**: стандартные `.warc.gz` и CDX-индекс.
*   **Дашборд**: веб-интерфейс `gs-server` для всех запущенных обходов.
*   **Динамические игнор-паттерны**: правила можно менять во время обхода.
*   **Обнаружение дубликатов** (dupespotter): со страниц, повторяющих уже виденные, ссылки не извлекаются.
*   **Очередь URL на диске**, а не в памяти — по README, при удаче можно обойти сайт примерно в 10 млн страниц.

## Установка

grab-site работает только на **Python 3.7 или 3.8** с определёнными версиями зависимостей. Пакета на PyPI нет — устанавливайте из репозитория в отдельное виртуальное окружение. Вариант из README для Ubuntu/Debian:

```bash
sudo apt-get install --no-install-recommends \
    wget ca-certificates git build-essential libssl-dev zlib1g-dev \
    libbz2-dev libreadline-dev libsqlite3-dev libffi-dev libxml2-dev \
    libxslt1-dev libre2-dev pkg-config

# Python 3.8 через pyenv (от обычного пользователя, не root)
~/.pyenv/bin/pyenv install 3.8.15
~/.pyenv/versions/3.8.15/bin/python -m venv ~/gs-venv
~/gs-venv/bin/pip install --no-binary lxml --upgrade git+https://github.com/ArchiveTeam/grab-site

# добавьте в ~/.bashrc или ~/.zshrc
PATH="$PATH:$HOME/gs-venv/bin"
```

В дистрибутивах без Python 3.7/3.8 можно использовать [uv](https://docs.astral.sh/uv/):

```bash
uv tool install --python=3.8 --no-binary-package lxml git+https://github.com/ArchiveTeam/grab-site/
```

Инструкции для macOS, NixOS и Windows — в [README](https://github.com/ArchiveTeam/grab-site#readme).

> Команды сверены с README репозитория `ArchiveTeam/grab-site` (октябрь 2026).

## Использование

### Дашборд

Сначала запустите дашборд и откройте `http://127.0.0.1:29000/`:

```bash
gs-server
```

`gs-server` по умолчанию слушает все сетевые интерфейсы; порт и адрес задаются переменными окружения `GRAB_SITE_PORT` и `GRAB_SITE_INTERFACE`.

### Базовый обход

```bash
grab-site 'https://example.com/'
```

grab-site создаёт в текущей директории **отдельный каталог обхода** (далее — `DIR`; имя строится из URL, даты и части идентификатора). В нём лежат WARC-файлы, журналы и управляющие файлы (`ignores`, `igsets`, `concurrency`, `delay` и др.). Длинные обходы запускайте внутри `tmux`.

### Основные параметры

| Параметр | Назначение |
| :--- | :--- |
| `--1` | скачать только указанный URL и его ресурсы, без рекурсии |
| `--level=N` | глубина рекурсии (по умолчанию без ограничения) |
| `--igsets=SET1,SET2` | подключить наборы игнор-паттернов (`forums`, `mediawiki`, `reddit` и др.) |
| `--import-ignores FILE` | скопировать файл с паттернами в `DIR/ignores` перед стартом |
| `--no-offsite-links` | не ходить по ссылкам на другие домены |
| `--concurrency=N` | число параллельных соединений (по умолчанию 2) |
| `--delay=N` | пауза в миллисекундах между запросами (можно диапазон, например `500-1500`) |
| `--max-content-length=N` | пропускать ответы больше N байт |
| `--ua=STRING` | свой User-Agent |
| `--finished-warc-dir=DIR` | куда переносить готовые `.warc.gz` и `.cdx` |
| `-i FILE` | взять список URL из файла |
| `--wpull-args=ARGS` | дополнительные параметры wpull |

Примеры:

```bash
# ограничить глубину
grab-site --level=3 'https://example.com/'

# бережный обход сайта, который может заблокировать за частые запросы
grab-site --concurrency=1 --delay=500-1500 --no-offsite-links 'https://example.com/'

# форум с готовым набором игнор-паттернов
grab-site --igsets=forums 'https://forum.example.com/'
```

### Сайты, требующие входа

Экспортируйте cookies из браузера в файл формата Netscape и передайте его wpull:

```bash
grab-site --wpull-args=--load-cookies=/абсолютный/путь/cookies.txt 'https://example.com/'
```

## Изменение игнор-паттернов во время обхода

Пока обход идёт, можно редактировать файлы в каталоге обхода — изменения подхватываются без перезапуска:

*   `DIR/ignores` — регулярные выражения Python 3, по одному на строку; совпавшие URL пропускаются;
*   `DIR/igsets` — список наборов игнор-паттернов через запятую;
*   `rm DIR/igoff` — показывать в терминале и на дашборде все отфильтрованные URL, `touch DIR/igoff` — снова скрыть.

```bash
echo '\?sort=' >> DIR/ignores
echo '/calendar/' >> DIR/ignores
```

Игнор-паттерны не применяются к стартовым URL. Посмотреть очередь: `gs-dump-urls DIR/wpull.db todo | sort | less -S`. Остановить обход: `touch DIR/stop` или Ctrl+C.

## Сравнение

| Инструмент | Дашборд | WARC | Простота | Рекомендация |
| :--- | :--- | :--- | :--- | :--- |
| **grab-site** | Да | Да | Высокая | **Для обходов с наблюдением и ручной правкой игнор-паттернов** |
| **[Wget](/kb/instruments/tools/wget)** | Нет | Да (`--warc-file`, с версии 1.14) | Высокая | Для простых случаев |
| **[Heritrix](/kb/instruments/tools/heritrix)** | Да | Да | Низкая | Для сложных и крупных проектов |

## Best practices

*   Следите за обходом на дашборде и добавляйте игнор-паттерны, как только видите «ловушки» (бесконечные календари, сортировки, сессии в URL).
*   Начинайте с бережных настроек (`--concurrency=1`, `--delay`), если сайт может заблокировать.
*   Ограничивайте размер ответов (`--max-content-length`) и следите за свободным местом на диске.

## Ограничения

- **Не выполняет JavaScript** — для SPA используйте [Browsertrix Crawler](/kb/instruments/tools/browsertrix).
- **Один обход — одна машина** — для распределённой архивации есть [Brozzler](/kb/instruments/tools/brozzler).
- **Устаревший Python** — нужен строго Python 3.7/3.8 (ограничение wpull), установка может быть непростой на современных системах; используйте pyenv или uv.

## Что дальше

- Полученный WARC проиндексируйте через [metawarc](/kb/instruments/ruarxive-tools/metawarc) для поиска по метаданным.
- Подключите AI-агента через [metawarc MCP-сервер](/kb/instruments/ruarxive-tools/metawarc-mcp) для безопасного доступа к коллекции только на чтение.
- Для просмотра — [ReplayWeb.page](/kb/instruments/replay/replayweb-page) или [pywb](/kb/instruments/replay/pywb).

## Ресурсы

*   [Репозиторий и README на GitHub](https://github.com/ArchiveTeam/grab-site)

## Связанные материалы

- [Другие краулеры](/kb/instruments/tools)
- [Формат WARC](/kb/instruments/file-formats/warc)
- [Wget для простых случаев](/kb/guides/wget)
