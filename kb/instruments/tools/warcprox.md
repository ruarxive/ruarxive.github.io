---
title: Warcprox
sidebar_label: Warcprox
description: "Warcprox — MITM-прокси Internet Archive, который записывает HTTP/HTTPS-трафик браузера или кроулера в WARC-файлы с дедупликацией; используется вместе с Brozzler."
last_update:
  date: 2026-10-12
---

# Warcprox

**Warcprox** — HTTP/HTTPS-прокси типа MITM (man-in-the-middle) от Internet Archive, который записывает проходящий через него трафик в WARC-файлы. Его используют как компонент записи для браузерных кроулеров (прежде всего [Brozzler](/kb/instruments/tools/brozzler)) и для ручной архивации через обычный браузер.

Сайт: [github.com/internetarchive/warcprox](https://github.com/internetarchive/warcprox)

## Что умеет

- Записывает запросы и ответы, прошедшие через прокси, в WARC.
- Расшифровывает HTTPS: генерирует собственный CA-сертификат и сертификаты для сайтов «на лету».
- **Дедупликация включена по умолчанию.** Повторно встретившееся содержимое записывается как `revisit`-запись. Хранилище по умолчанию — SQLite-файл `./warcprox.sqlite` (`-j/--dedup-db-file`). Можно использовать RethinkDB или CDX-сервер (`--cdxserver-dedup`).
- Ведёт статистику по сбору (`--stats-db-file`).
- Управляется на лету HTTP-заголовком `Warcprox-Meta` в запросе: префикс WARC, бакеты дедупликации и статистики, лимиты.
- Пишет журнал обхода в формате Heritrix (`--crawl-log-dir`).
- Поддерживает плагины-постпроцессоры (`--plugin`).

Сам warcprox **не выполняет JavaScript** и не обходит сайты: страницы открывает браузер или кроулер, а warcprox лишь записывает трафик.

## Установка

Нужен Python 3.9+.

```bash
pip install warcprox
```

Последняя версия из репозитория:

```bash
pip install git+https://github.com/internetarchive/warcprox.git
```

> Команды и флаги сверены с `warcprox --help` версии 2.13.1 (октябрь 2026).

## Использование

### Базовый запуск

```bash
warcprox -z
```

Прокси слушает `localhost:8000`. WARC пишутся в `./warcs`. Без `-z/--gzip` записи **не сжимаются**, поэтому флаг `-z` почти всегда нужен.

### Основные флаги

| Флаг | Что делает | По умолчанию |
| :--- | :--- | :--- |
| `-p, --port` | Порт | `8000` |
| `-b, --address` | Адрес, на котором слушать | `localhost` |
| `-d, --dir` | Каталог для WARC | `./warcs` |
| `-z, --gzip` | Сжимать WARC-записи gzip | выключено |
| `-n, --prefix` | Префикс имени WARC-файла | `WARCPROX` |
| `--warc-filename` | Шаблон имени: `{prefix}`, `{timestamp14}`, `{serialno}`, `{hostname}` и др. | `{prefix}-{timestamp17}-{serialno}-{randomtoken}` |
| `-s, --size` | Порог ротации WARC-файла в байтах | `1000000000` (1 ГБ) |
| `--rollover-idle-time` | Закрыть WARC после N секунд простоя | — |
| `-c, --cacert` | Файл CA-сертификата (создаётся, если нет) | `./<hostname>-warcprox-ca.pem` |
| `--certs-dir` | Каталог сгенерированных сертификатов сайтов | `./<hostname>-warcprox-ca/` |
| `-j, --dedup-db-file` | База дедупликации; пустая строка или `/dev/null` отключает дедупликацию | `./warcprox.sqlite` |
| `--method-filter` | Записывать только указанные HTTP-методы | все |
| `--max-resource-size` | Максимальный размер ресурса в байтах | без ограничения |
| `--crawl-log-dir` | Каталог для журнала обхода | — |

Пример: свой каталог, сжатие, файлы по 500 МБ, свой префикс:

```bash
warcprox -z -d /data/warcs -n mycollection -s 500000000
```

Отфильтровать запросы по URL флагами нельзя: какие страницы открывать, решает браузер или кроулер.

### Настройка браузера или клиента

Укажите `localhost:8000` как HTTP- и HTTPS-прокси в настройках браузера или через переменные окружения:

```bash
export http_proxy=http://localhost:8000
export https_proxy=http://localhost:8000
```

## HTTPS-сертификаты

При первом запуске warcprox создаёт CA-сертификат **в текущем каталоге**: `./<hostname>-warcprox-ca.pem` (имя зависит от имени машины). Сертификаты для отдельных сайтов он кладёт в `./<hostname>-warcprox-ca/`. Чтобы браузер не выдавал ошибок, импортируйте этот `.pem` в хранилище доверенных сертификатов браузера или передайте его клиенту:

```bash
curl --proxy http://localhost:8000 --cacert ./*-warcprox-ca.pem https://example.com/
```

Импортируйте этот CA только в отдельный профиль браузера для архивации: он позволяет прокси читать весь ваш HTTPS-трафик.

## Ручная архивация через браузер

1. Запустите `warcprox -z`.
2. Создайте отдельный профиль браузера, укажите в нём прокси `localhost:8000` и импортируйте CA-сертификат.
3. Откройте нужные страницы, прокрутите их, раскройте меню и вкладки: всё загруженное попадёт в WARC.
4. Остановите warcprox (Ctrl+C), чтобы он закрыл текущий WARC-файл.

Для ручной записи без настройки прокси проще использовать [ArchiveWeb.page](https://archiveweb.page/).

## Интеграция с Brozzler

Brozzler использует warcprox для записи. Адрес прокси передаётся флагом `--proxy`:

```bash
warcprox -z -p 8000 &
brozzler-worker --proxy localhost:8000
```

Или `--warcprox-auto`: тогда Brozzler сам найдёт зарегистрированный warcprox через реестр сервисов в RethinkDB (warcprox нужно запустить с `--rethinkdb-services-url`). Подробнее — на странице [Brozzler](/kb/instruments/tools/brozzler).

## Ограничения

- Нужно настраивать прокси и доверие к CA-сертификату.
- Записывается только то, что реально загрузил клиент: ленивые изображения без прокрутки не попадут в WARC.
- Нет фильтрации по URL на стороне прокси.
- Нужно держать процесс запущенным и корректно останавливать, чтобы WARC закрылся.

## Ресурсы

- [GitHub: internetarchive/warcprox](https://github.com/internetarchive/warcprox) — README и описание `Warcprox-Meta` (`api.rst`).
- [PyPI](https://pypi.org/project/warcprox/)

## Связанные материалы

- [Brozzler](/kb/instruments/tools/brozzler)
- [Пользовательские workflow](/kb/guides/custom-workflows)
- [Формат WARC](/kb/instruments/file-formats/warc)
