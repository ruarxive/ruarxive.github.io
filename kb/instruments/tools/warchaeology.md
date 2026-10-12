---
title: Warchaeology — набор утилит для WARC-файлов
sidebar_label: Warchaeology
description: "Warchaeology — консольная утилита warc на Go от Национальной библиотеки Норвегии для просмотра, валидации, дедупликации и конвертации WARC-файлов."
last_update:
  date: 2026-10-12
keywords: [warchaeology, warc, validation, deduplication, nlnorway, inspection]
---

# Warchaeology — набор утилит для WARC-файлов

[Warchaeology](https://github.com/NationalLibraryOfNorway/warchaeology) — консольный инструмент Национальной библиотеки Норвегии (проект существует с 2021 года, лицензия Apache-2.0) для просмотра, проверки и преобразования WARC-файлов. Это **один бинарник на Go с именем `warc`** и набором подкоманд; Python-пакета нет. Работа с форматом построена на библиотеке [gowarc](https://github.com/nlnwa/gowarc).

Документация: [nationallibraryofnorway.github.io/warchaeology](https://nationallibraryofnorway.github.io/warchaeology/).

## Установка

Готовые бинарники, `.deb` и `.rpm` лежат на [странице релизов](https://github.com/NationalLibraryOfNorway/warchaeology/releases/latest). Пример для Linux из официальной инструкции:

```bash
curl -LO https://github.com/nationallibraryofnorway/warchaeology/releases/latest/download/warchaeology_Linux_x86_64.tar.gz
tar zxvf warchaeology_Linux_x86_64.tar.gz
sudo install warc /usr/local/bin/warc
```

Для macOS используется архив `warchaeology_Darwin_x86_64.tar.gz` (или вариант для arm64 со страницы релизов). Сборка из исходников (нужен Go 1.24+):

```bash
go install github.com/nationallibraryofnorway/warchaeology/v5@latest
# бинарник будет называться warchaeology, а не warc
```

Справка по всем командам — `warc help` и `warc <команда> --help`.

> Команды сверены с `--help` версии 5.0.0 (октябрь 2026).

## Подкоманды

| Команда | Назначение |
|:---|:---|
| `warc ls` | Список записей: смещение, ID, тип и другие поля по выбору |
| `warc cat` | Вывод записей, их WARC-заголовков, HTTP-заголовков или полезной нагрузки |
| `warc validate` | Проверка WARC-файлов на соответствие формату |
| `warc dedup` | Дедупликация: повторы заменяются на `revisit`-записи |
| `warc convert arc` / `nedlib` / `warc` | Конвертация ARC, выгрузок Nedlib и перепаковка WARC в WARC |
| `warc console` | Интерактивная оболочка для просмотра WARC-файлов |
| `warc aart` | Показ изображений из WARC прямо в терминале (скрытая команда) |
| `warc version` | Информация о версии |

Почти все подкоманды принимают файлы и каталоги (`-r` — рекурсивный обход), умеют фильтровать записи по типу (`-t`), MIME-типу (`-m`), коду ответа (`-S`) и ID (`--id`), а также читать WARC прямо из архивов `.tar`, `.zip` и `.wacz` (`-i`).

## Примеры

### Посмотреть содержимое

```bash
# Смещение, ID и тип каждой записи
warc ls archive.warc.gz

# Выбрать поля: дата, тип, код ответа, URL, MIME-тип
warc ls -F "bTsam" archive.warc.gz

# Только HTML-ответы с кодом 200, вывод в JSON Lines
warc ls -t response -m text/html -S 200 --json archive.warc.gz
```

Буквы полей в `-F` в основном совпадают с полями [формата CDX](/kb/instruments/file-formats/cdx): `a` — URL, `b` — дата, `s` — код ответа, `m` — MIME-тип, `k` — контрольная сумма, `S` — размер записи, `V` — смещение.

### Извлечь запись

```bash
# WARC-заголовок второй записи
warc cat -n 2 -w archive.warc.gz

# Полезная нагрузка четвёртой записи (пример из справки)
warc cat -n4 -P archive.warc.gz > payload.bin
```

### Проверить файлы

```bash
warc validate archive.warc.gz
warc validate -r /data/warcs/
```

Команда пишет найденные ошибки в журнал и возвращает ненулевой код, если ошибки есть. Валидация строгая: например, WARC-файлы, записанные GNU Wget 1.x, дают ошибки по полю `WARC-Target-URI`, потому что Wget заключает URL в угловые скобки. Чтобы проверить такие файлы без этих замечаний, используйте `--lenient`.

### Дедупликация

```bash
mkdir -p dedup
warc dedup --one-to-one -w dedup/ archive.warc.gz
```

Выходной каталог (`-w`) должен существовать заранее. Без `--one-to-one` утилита пишет результат в несколько файлов параллельно (`--concurrent-writers`, по умолчанию 16) и режет их по размеру (`--file-size`, по умолчанию 1 ГБ). Кандидаты для дедупликации — записи `response` и `resource` (`--record-types`); запись заменяется на `revisit`, только если экономия больше `--min-size-gain` (по умолчанию 2 КБ). Индекс хранится в `--index-dir`; с `-k` его можно сохранить и продолжить дедупликацию следующей партии файлов.

### Конвертация

```bash
warc convert arc --help      # ARC → WARC
warc convert nedlib --help   # каталог выгрузки Nedlib → WARC
```

## Хуки

`validate`, `dedup` и `convert` умеют запускать внешние команды до и после открытия входных и выходных файлов (`--open-input-file-hook`, `--close-output-file-hook` и др.). Команда получает переменные окружения `WARC_FILE_NAME`, `WARC_SIZE`, `WARC_HASH`, `WARC_ERROR_COUNT`. Так удобно, например, записывать контрольные суммы или переносить проверенные файлы. Подробнее — в [руководстве по хукам](https://nationallibraryofnorway.github.io/warchaeology/).

## Сравнение с альтернативами

| Задача | warchaeology | [warcio](https://github.com/webrecorder/warcio) | [jwarc](https://github.com/iipc/jwarc) | [DuckDB-WARC](/kb/instruments/tools/duckdb-warc) |
|:---|:-:|:-:|:-:|:-:|
| Список записей | `warc ls` | `warcio index` | `jwarc ls` | SQL |
| Валидация | `warc validate` | `warcio check` (дайджесты) | `jwarc validate` | — |
| Дедупликация | `warc dedup` | — | `jwarc dedupe` | — |
| ARC → WARC | `warc convert arc` | — | — | — |

Это не единственный валидатор WARC: проверки есть также в jwarc, [JWAT](https://github.com/netarchivesuite/jwat-tools) и warcio. Подробнее об инструментах — в обзоре [обработки WARC](/kb/instruments/tools/warc-processing).

## Ресурсы

- [GitHub: warchaeology](https://github.com/NationalLibraryOfNorway/warchaeology)
- [Документация](https://nationallibraryofnorway.github.io/warchaeology/)
- [gowarc — библиотека WARC для Go](https://github.com/nlnwa/gowarc)
- [Спецификация WARC 1.1](https://iipc.github.io/warc-specifications/)

## Связанные материалы

- [WARC-файл: формат](/kb/instruments/file-formats/warc)
- [Обработка WARC — обзор](/kb/instruments/tools/warc-processing)
- [Дедупликация WARC](/kb/guides/warc-deduplication)
- [WARC-Safe — проверка на вирусы и NSFW](/kb/instruments/tools/warc-safe)
- [WARC-файл: от сырого архива до публикации](/kb/guides/warc-workflow)
- [DuckDB-WARC](/kb/instruments/tools/duckdb-warc) — SQL-запросы к WARC
- [Ландшафт 2026](/kb/instruments/landscape-2026)
