---
title: Brozzler
sidebar_label: Brozzler
description: "Brozzler — распределённый веб-краулер Internet Archive на реальном браузере Chrome/Chromium; состояние обхода хранится в RethinkDB, WARC пишет warcprox."
last_update:
  date: 2026-10-12
---

# Brozzler

**[Brozzler](https://github.com/internetarchive/brozzler)** («browser» + «crawler») — распределённый веб-краулер Internet Archive, который загружает страницы и встроенные ресурсы через настоящий браузер (Chrome или Chromium) и извлекает из них ссылки. Для захвата видео используется [yt-dlp](/kb/instruments/tools/yt-dlp), состояние обхода (задания, сайты, очереди страниц) хранится в базе **RethinkDB**, а WARC-файлы пишет прокси [warcprox](/kb/instruments/tools/warcprox). Лицензия — Apache-2.0.

## Когда использовать

✅ Подходит, если нужно:

- архивировать **крупные сайты с большим количеством JavaScript** и **распределить обход** на несколько машин: все воркеры работают с общей базой RethinkDB;
- вести **долгие задания** (дни и недели) с сохранением состояния в базе;
- писать WARC через [warcprox](/kb/instruments/tools/warcprox), в том числе с дедупликацией.

❌ Не лучший выбор, если:

- задача небольшая — на одной машине проще [Browsertrix Crawler](/kb/instruments/tools/browsertrix), который сразу создаёт WACZ;
- нужно просто записывать WARC при ручном просмотре — возьмите [warcprox](/kb/instruments/tools/warcprox) без Brozzler;
- нет возможности развернуть RethinkDB — без неё воркеры и очередь заданий не работают (исключение — `brozzle-page` для одной страницы).

## Установка

### Требования

- Python 3.10+ (по метаданным пакета 1.9.6 на PyPI; README пока указывает 3.9);
- RethinkDB;
- Chromium или Google Chrome версии 64 и новее;
- на сервере — графическое окружение для браузера (например, Xvnc или Xvfb).

### Установка через pip

```bash
# RethinkDB (macOS; для Linux — см. rethinkdb.com/docs/install)
brew install rethinkdb
rethinkdb &>>rethinkdb.log &

python -m venv .venv
source .venv/bin/activate
pip install "brozzler[rethinkdb,warcprox,dashboard,yt-dlp]"
```

Дополнительные зависимости (extras): `rethinkdb`, `warcprox`, `dashboard` (веб-интерфейс), `yt-dlp` (захват видео).

> Команды сверены с README и `brozzler/cli.py` репозитория `internetarchive/brozzler` (версия 1.9.6, октябрь 2026).

## Использование

### Одна страница

```bash
brozzle-page https://example.org
```

`brozzle-page` не требует RethinkDB, но и сам WARC не пишет: чтобы сохранить страницу в WARC, запустите warcprox и передайте его адрес через `--proxy=localhost:8000`.

### Задание из YAML-файла

`brozzler-new-job` принимает **YAML-файл задания**, а не URL:

```yaml
# job1.yml
id: myjob
time_limit: 3600   # секунды
ignore_robots: false
seeds:
  - url: https://one.example.org/
  - url: https://two.example.org/
    time_limit: 600
```

```bash
brozzler-new-job job1.yml
brozzler-worker --warcprox-auto
```

Описание всех параметров задания — в файле [job-conf.rst](https://github.com/internetarchive/brozzler/blob/master/job-conf.rst).

### Отдельный сайт без задания

```bash
brozzler-new-site --time-limit=600 https://example.org/
```

## Архитектура

1. **RethinkDB** — хранит задания, сайты и очередь страниц; через её реестр сервисов воркеры находят экземпляры warcprox.
2. **brozzler-worker** — запускает браузеры и обходит страницы; воркеров может быть несколько на разных машинах.
3. **warcprox** — прокси, через который браузер ходит в сеть и который пишет WARC.
4. **brozzler-dashboard** — простой веб-интерфейс для просмотра состояния заданий (по умолчанию `http://localhost:8000/`).

Для пробы на одной машине есть `brozzler-easy` — он запускает воркер, warcprox, pywb и dashboard в одном процессе (по умолчанию WARC пишутся в `./warcs`, pywb слушает порт 8880, dashboard — 8881). RethinkDB при этом всё равно нужна.

## Настройка воркеров

Основные параметры `brozzler-worker`:

| Параметр | Назначение |
| :--- | :--- |
| `-n`, `--max-browsers` | сколько экземпляров браузера одновременно обходят страницы |
| `--warcprox-auto` | найти работающий warcprox через реестр сервисов RethinkDB (рекомендуется для кластера) |
| `--proxy` | явно указать HTTP-прокси, например запущенный вручную warcprox |
| `--rethinkdb-servers`, `--rethinkdb-db` | адреса серверов и имя базы RethinkDB (или переменные окружения `BROZZLER_RETHINKDB_SERVERS`, `BROZZLER_RETHINKDB_DB`) |
| `-e`, `--chrome-exe` | путь к исполняемому файлу Chrome/Chromium |
| `--skip-youtube-dl` | не скачивать видео через yt-dlp |
| `--skip-extract-outlinks` | не извлекать ссылки со страниц |

```bash
brozzler-worker --max-browsers=2 --warcprox-auto --rethinkdb-servers=db1.example.org
```

Чтобы `--warcprox-auto` работал, warcprox нужно запустить с `--rethinkdb-services-url`, указывающим на ту же таблицу сервисов в RethinkDB. Без этого можно передать адрес warcprox напрямую:

```bash
warcprox --address=localhost --port=8000 --dir=./warcs --gzip
brozzler-worker --max-browsers=2 --proxy=localhost:8000
```

## Мониторинг

- `brozzler-dashboard` — веб-интерфейс со списком заданий, сайтов и страниц;
- `brozzler-list-jobs`, `brozzler-list-sites`, `brozzler-list-pages`, `brozzler-list-captures` — то же из командной строки;
- `brozzler-stop-crawl` — остановить задание или сайт.

## Сравнение с Browsertrix Crawler

| Функция | Browsertrix Crawler | Brozzler |
| :--- | :--- | :--- |
| Распределённый обход | один контейнер с несколькими воркерами; масштабирование — через платформу Browsertrix на Kubernetes | несколько воркеров на разных машинах с общей RethinkDB |
| Простота запуска | один Docker-контейнер | RethinkDB + warcprox + воркеры |
| Веб-интерфейс | в платформе Browsertrix | простой dashboard |
| Формат результата | WARC и WACZ | WARC (через warcprox) |

## Ограничения

- **Нужна RethinkDB** — отдельный сервис, который нужно развернуть и поддерживать.
- **Реальный браузер** — высокая потребность в памяти; на маленьких VPS работать будет плохо.
- **WARC пишется через warcprox** — ещё один компонент в стеке, который нужно настроить (`--warcprox-auto` или `--proxy`).
- **Нет WACZ** — если нужен WACZ (zip с WARC, индексом и метаданными), используйте [Browsertrix Crawler](/kb/instruments/tools/browsertrix) или упакуйте WARC утилитой `py-wacz`.

## Что дальше

- Полученные WARC проиндексируйте через [metawarc](/kb/instruments/ruarxive-tools/metawarc) для поиска по метаданным.
- Или подключите [metawarc MCP-сервер](/kb/instruments/ruarxive-tools/metawarc-mcp) к Claude/Cursor для работы с коллекцией из агента.

## Связанные материалы

- [Browsertrix Crawler](/kb/instruments/tools/browsertrix) — для сравнения
- [warcprox](/kb/instruments/tools/warcprox) — прокси для записи WARC
- [metawarc](/kb/instruments/ruarxive-tools/metawarc) — индексация и поиск
- [metawarc MCP-сервер](/kb/instruments/ruarxive-tools/metawarc-mcp) — для AI-агентов
- [Формат WARC](/kb/instruments/file-formats/warc)

## Ресурсы

- [Репозиторий на GitHub](https://github.com/internetarchive/brozzler)
- [Описание конфигурации заданий (job-conf.rst)](https://github.com/internetarchive/brozzler/blob/master/job-conf.rst)
