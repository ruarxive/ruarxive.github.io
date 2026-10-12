---
title: Wpull
sidebar_label: Wpull
description: "Wpull — Wget-совместимый загрузчик и кроулер на Python с записью WARC, базой состояния и плагинами. Последний релиз на PyPI — 2016 года; на практике используется через grab-site."
last_update:
  date: 2026-10-12
---

# Wpull

:::warning Проект почти не развивается
Последний релиз Wpull на PyPI — 2.0.1 (июнь 2016 года). Он требует старых версий зависимостей (Tornado, html5lib) и на современных версиях Python обычно не устанавливается. На практике Wpull используют внутри [grab-site](/kb/instruments/tools/grab-site): там свой форк [ludios_wpull](https://github.com/ArchiveTeam/ludios_wpull), и для него нужен Python 3.7 или 3.8. Для новых проектов рассмотрите [Wget](/kb/instruments/tools/wget), [grab-site](/kb/instruments/tools/grab-site) или [Browsertrix Crawler](/kb/instruments/tools/browsertrix).
:::

**Wpull** — Wget-совместимый загрузчик и кроулер, написанный с нуля на Python. Автор — Christopher Foo (chfoo), лицензия GPL-3.0. Это не форк Wget: Wpull заново реализует его интерфейс и использует некоторые алгоритмы Wget. Репозиторий сейчас находится в организации ArchiveTeam: [github.com/ArchiveTeam/wpull](https://github.com/ArchiveTeam/wpull).

## Когда использовать

✅ Подходит, если нужно:

- снимать сайт по ссылкам сразу в **WARC** с Wget-подобным набором флагов;
- **останавливать и возобновлять** большой обход: состояние хранится в базе SQLite (`--database`);
- расширять логику через **Python-плагины** (свои правила отбора URL, извлечение ссылок).

❌ Не лучший выбор, если:

- сайт на WordPress с открытым REST API — возьмите [wparc](/kb/instruments/ruarxive-tools/wparc);
- нужен рендеринг JavaScript — [Browsertrix Crawler](/kb/instruments/tools/browsertrix) или [Brozzler](/kb/instruments/tools/brozzler);
- нужна простая установка на современной системе — [Wget](/kb/instruments/tools/wget).

## Возможности

- Wget-совместимые флаги: `--recursive`, `--level`, `--page-requisites`, `--span-hosts`, `--accept-regex`, `--reject-regex`, `--wait`, `--random-wait` и др.
- Запись WARC: `--warc-file`, `--warc-max-size`, `--warc-cdx`, `--warc-dedup`, `--warc-append`, `--warc-move`.
- Параллельные соединения: `--concurrent`.
- База состояния для возобновления: `--database`.
- Чтение `sitemap.xml`: `--sitemaps`.
- Тонкая настройка выхода на другие хосты: `--span-hosts-allow linked-pages,page-requisites`.
- Плагины на Python: `--plugin-script`, `--plugin-args`.
- Экспериментальная интеграция с PhantomJS (`--phantomjs`) и youtube-dl (`--youtube-dl`). Оба проекта устарели, PhantomJS не развивается с 2018 года.

Поддерживается только HTTP/1.x: HTTP/2 в Wpull нет.

## Установка

```bash
# официальный пакет (2.0.1, 2016); требует старого Python и зависимостей
pip3 install wpull
```

Сборка из исходников:

```bash
git clone https://github.com/ArchiveTeam/wpull
cd wpull
pip install .
```

Если установить не получается, проще поставить [grab-site](/kb/instruments/tools/grab-site) по его инструкции: она описывает подходящую версию Python.

> Флаги сверены с документацией [wpull.readthedocs.io](https://wpull.readthedocs.io/) (версия 2.0.1, октябрь 2026). Сам Wpull локально не запускался.

## Использование

### Одна страница

```bash
wpull example.com/about
```

### Архивация сайта в WARC

Пример из README (сокращён):

```bash
wpull example.com \
    --warc-file example \
    --recursive --level inf \
    --page-requisites \
    --span-hosts-allow linked-pages,page-requisites \
    --wait 0.5 --random-wait --waitretry 600 \
    --tries 3 --retry-connrefused --retry-dns-error \
    --timeout 60 --session-timeout 21600 \
    --sitemaps \
    --reject-regex "/login\.php" \
    --delete-after \
    --database example.db \
    --output-file example.log
```

- `--delete-after` удаляет скачанные файлы с диска: остаётся только WARC.
- `--database` позволяет перезапустить прерванный обход с того же места.
- По умолчанию Wpull соблюдает robots.txt. В примере README он отключён через `--no-robots`; решайте сами, нужно ли это.

### Большой сайт

```bash
wpull example.com \
  --recursive --level 5 \
  --warc-file example --warc-max-size 1000000000 --warc-cdx \
  --concurrent 2 --wait 1 \
  --database example.db
```

Ограничить объём можно через `--quota` (общий объём загрузки).

## Плагины

Плагин — класс-наследник `wpull.application.plugin.WpullPlugin`, который подключается флагом `--plugin-script`. Функции регистрируются декораторами `hook` (меняют поведение и возвращают значение) и `event` (уведомления). Пример по [документации](https://wpull.readthedocs.io/en/master/scripting.html):

```python
# skip_logout.py
from wpull.application.plugin import WpullPlugin, PluginFunctions, hook
from wpull.pipeline.session import ItemSession


class SkipLogout(WpullPlugin):
    @hook(PluginFunctions.accept_url)
    def accept_url(self, item_session: ItemSession, verdict: bool, reasons: dict) -> bool:
        if "logout" in item_session.request.url:
            return False
        return verdict
```

```bash
wpull example.com --recursive --warc-file example --plugin-script skip_logout.py
```

Другие точки расширения: `get_urls` (добавить свои URL), `handle_response`, `handle_error`, `resolve_dns`, `exit_status`. Полный список — в разделе Plugin Scripting Hooks документации.

## Сравнение с Wget

| Функция | Wget | Wpull |
| :--- | :--- | :--- |
| WARC | ✅ (1.14+) | ✅ |
| Возобновление большого обхода | ⚠️ только `-N`/`-c` по файлам | ✅ база SQLite |
| Параллельные соединения | ❌ | ✅ `--concurrent` |
| JavaScript | ❌ | ⚠️ PhantomJS, устарел |
| Плагины | ❌ | ✅ Python |
| HTTP/2 | ❌ | ❌ |
| Установка на современной системе | ✅ | ❌ проблемная |

## Ограничения

- Последний релиз — 2016 года; устанавливается только со старыми версиями Python и зависимостей.
- Нет HTTP/2 и полноценного рендеринга JavaScript.
- Медиа с CDN-доменов нужно разрешать явно (`--span-hosts-allow`, `--domains`, `--hostnames`).

## Что дальше

- Проиндексировать полученный WARC: [metawarc](/kb/instruments/ruarxive-tools/metawarc).
- Посмотреть WARC: [pywb](/kb/instruments/replay/pywb) или [ReplayWeb.page](/kb/instruments/replay/replayweb-page).

## Ресурсы

- [GitHub: ArchiveTeam/wpull](https://github.com/ArchiveTeam/wpull)
- [Документация](https://wpull.readthedocs.io/)
- [Отличия Wpull от Wget](https://wpull.readthedocs.io/en/master/differences.html)

## Связанные материалы

- [Wget](/kb/instruments/tools/wget)
- [grab-site](/kb/instruments/tools/grab-site) — кроулер на основе форка Wpull
- [Browsertrix для сайтов с JavaScript](/kb/instruments/tools/browsertrix)
- [Формат WARC](/kb/instruments/file-formats/warc)
