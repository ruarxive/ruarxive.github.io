---
title: WACZ
description: "WACZ (Web Archive Collection Zipped) — ZIP-контейнер для распространения веб-архивов: структура по спецификации 1.1.1, создание через py-wacz и Browsertrix, проверка целостности и конвертация в ZIM."
last_update:
  date: 2026-10-12
---

# WACZ

**WACZ (Web Archive Collection Zipped)** — это современный формат для упаковки и распространения веб-архивов. Он был создан сообществом Webrecorder для решения проблем удобства использования "сырых" WARC-файлов. Актуальная версия спецификации — [WACZ 1.1.1](https://specs.webrecorder.net/wacz/1.1.1/). В реестре PRONOM формат имеет идентификатор `fmt/1840`.

## Проблема WARC

Формат [WARC](/kb/instruments/file-formats/warc) является стандартом де-факто для хранения данных. Однако:
1.  Одного WARC часто недостаточно (нужны CDX-индексы для просмотра).
2.  В одной коллекции может быть сотни WARC-файлов.
3.  Нет стандартного способа приложить метаданные о коллекции, логи и скриншоты.

## Решение WACZ

WACZ — это **ZIP-архив** с определенной структурой папок. Он содержит:
*   Один или несколько WARC-файлов (`.warc` или `.warc.gz`) — сами данные.
*   Индексы в формате CDXJ (см. [CDX и CDXJ](/kb/instruments/file-formats/cdx)) — для быстрого поиска и воспроизведения.
*   `pages/pages.jsonl` — список страниц (точек входа) коллекции.
*   `datapackage.json` — манифест: перечень всех файлов с размерами и хешами, а также описательные метаданные коллекции.
*   `datapackage-digest.json` — хеш самого манифеста.

Благодаря индексам внутри архива, файл `.wacz` можно загрузить в плеер (например, ReplayWeb.page) и сразу начать просмотр, без долгой индексации. Плеер читает из ZIP только нужные фрагменты, в том числе по HTTP Range-запросам, если WACZ лежит на веб-сервере.

## Структура файла

Если распаковать `.wacz` как обычный ZIP, вы увидите примерно такое:

```
my-archive.wacz
├── archive/
│   └── data.warc.gz
├── indexes/
│   ├── index.cdx.gz
│   └── index.idx
├── pages/
│   ├── pages.jsonl
│   └── extraPages.jsonl
├── logs/
├── datapackage.json
└── datapackage-digest.json
```

*   **archive/**: WARC-файлы (обязательно хотя бы один).
*   **indexes/**: индексы для воспроизведения. По спецификации они **обязаны содержать CDXJ** (несмотря на расширение `.cdx.gz`, это не классический CDX). Файл `index.idx` — вторичный индекс (ZipNum) для больших коллекций, его создают py-wacz и Browsertrix.
*   **pages/**: `pages.jsonl` обязателен по WACZ 1.1.1; каждая строка содержит как минимум `url` и `ts`. Дополнительные страницы, найденные при обходе, принято класть в отдельный файл, например `extraPages.jsonl`.
*   **logs/**: необязательные логи краулинга (их добавляет, например, Browsertrix).
*   **datapackage.json**: манифест в формате [Frictionless Data Package](https://specs.frictionlessdata.io/data-package/).

Требования к упаковке: файлы в `archive/` и сжатые индексы `*.cdx.gz` хранятся в ZIP **без повторного сжатия** (режим STORE), иначе произвольный доступ к ним невозможен. JSON- и JSONL-файлы можно сжимать (DEFLATE).

## Создание WACZ

### Утилита `wacz` (py-wacz)

[py-wacz](https://github.com/webrecorder/py-wacz) — эталонная реализация от Webrecorder для создания и проверки WACZ из готовых WARC-файлов.

```bash
pip install wacz

# Входные данные — файлы, а не директория
wacz create -o archive.wacz /path/to/warcs/*.warc.gz

# С описательными метаданными
wacz create -o archive.wacz \
  --title "Архив example.com" \
  --desc "Снимок сайта example.com, январь 2024" \
  /path/to/warcs/*.warc.gz

# Проверка готового файла
wacz validate -f archive.wacz
```

Полезные опции `wacz create`:

- `-p pages.jsonl` — использовать готовый список страниц (рекомендуется: по спецификации `pages/pages.jsonl` обязателен, а py-wacz создаёт его только при `-p` или `--detect-pages`);
- `-e extra.jsonl` — добавить дополнительный список страниц (`pages/extraPages.jsonl`);
- `-d` / `--detect-pages` — попытаться определить страницы автоматически по HTML-ответам в WARC (эвристика: в список попадают страницы, на которые ссылаются другие записи через `Referer`, поэтому результат может оказаться пустым);
- `-t` / `--text` — добавить в `pages.jsonl` извлечённый текст (работает только вместе с `--detect-pages`);
- `-l DIR` — добавить логи из каталога;
- `--url` и `--ts` — главная страница коллекции и её время.

Если передать каталог вместо файлов (`wacz create -o out.wacz dir/`), команда завершится ошибкой `IsADirectoryError`.

> Команды сверены с исходным кодом и `--help` py-wacz версии 0.6.0 (октябрь 2026).

### Browsertrix Crawler

[Browsertrix](/kb/instruments/tools/browsertrix) Crawler создаёт WACZ при указании опции `--generateWACZ`. Результат пишется в каталог `/crawls/` внутри контейнера, поэтому его нужно смонтировать наружу:

```bash
docker run --rm -v $PWD/crawls:/crawls/ \
    webrecorder/browsertrix-crawler crawl \
    --url https://example.com/ \
    --generateWACZ \
    --collection example-com
```

Готовый файл появится в `./crawls/collections/example-com/`. Имя коллекции используется как имя каталога, поэтому пробелы в нём лучше не использовать.

### Просмотр WACZ

WACZ можно открыть прямо в браузере с помощью [ReplayWeb.page](https://replayweb.page/). Это не требует установки серверного ПО.

## Метаданные WACZ

### `datapackage.json`

Манифест обязан содержать поля `profile` (строка `data-package`), `wacz_version` и `resources` — список **всех** файлов внутри WACZ с путём, хешем и размером. Рекомендуемые описательные поля: `title`, `description` (в формате Markdown), `created`, `modified`, `software`, `mainPageUrl`, `mainPageDate`.

Пример, созданный py-wacz 0.6.0:

```json
{
  "profile": "data-package",
  "resources": [
    {
      "name": "index.cdx.gz",
      "path": "indexes/index.cdx.gz",
      "hash": "sha256:fa55c2f468482c71947c2e18a92c1f28b066c11b07955ce777acc4eb02e86631",
      "bytes": 367
    },
    {
      "name": "data.warc.gz",
      "path": "archive/data.warc.gz",
      "hash": "sha256:64de239652bf243509c81eca137159986ca5ee383656a9a172a53638190da943",
      "bytes": 958
    }
  ],
  "title": "Архив example.com",
  "description": "Снимок сайта example.com, январь 2024",
  "created": "2024-01-01T12:00:00Z",
  "wacz_version": "1.1.1",
  "software": "py-wacz 0.6.0"
}
```

### Проверка целостности (`datapackage-digest.json`)

Файл `datapackage-digest.json` рекомендован спецификацией и содержит только хеш манифеста `datapackage.json`. Поскольку в манифесте перечислены хеши всех остальных файлов, цепочка «digest → манифест → файлы» позволяет проверить, что содержимое `.wacz` не менялось после создания.

```json
{
  "path": "datapackage.json",
  "hash": "sha256:ab013366101234942b0f89b0c170150444dfe4d90f26b2a2f54b2ae0ff762d1f"
}
```

В этот же файл можно добавить криптографическую подпись автора (поле `signedData`) — см. спецификацию [WACZ Signing and Verification](https://specs.webrecorder.net/wacz-auth/latest/). Проверить хеши и структуру можно командой `wacz validate -f archive.wacz`.

## Связанные материалы

- [Формат WARC](/kb/instruments/file-formats/warc) — базовый формат веб-архивов
- [Формат CDX](/kb/instruments/file-formats/cdx) — формат индексации
- [ReplayWeb.page](/kb/instruments/replay/replayweb-page) — просмотр WACZ файлов
- [Browsertrix](/kb/instruments/tools/browsertrix) — создание WACZ архивов
- [Обработка WARC](/kb/instruments/tools/warc-processing) — работа с WARC файлами

## WARC → ZIM: пайплайн для Kiwix и офлайн-чтения

Веб-архив можно превратить в [ZIM-контейнер](https://openzim.org/) — формат, который
читается [Kiwix](https://kiwix.org/). Это полезно для офлайн-чтения,
в том числе на мобильных устройствах или там, где нет интернета ([Публикация #124 от
28.03.2024](https://t.me/ruarxive/124)).

Конвертер [warc2zim](https://github.com/openzim/warc2zim) принимает на вход WARC-файлы (или каталоги с ними). Если исходные данные упакованы в WACZ, WARC-файлы можно взять из его каталога `archive/`.

### Зачем

- **Чтение с телефона** — без сервера и без подключения к сети.
- **Один файл** — ZIM удобно копировать и раздавать как единое целое.

### Как сделать

```bash
# Шаг 1: конвертация WARC → ZIM
pip install warc2zim
warc2zim --name my_archive --output ./out --zim-file my_archive.zim \
  --url https://example.com/ my_archive.warc.gz

# Шаг 2: проверка (утилита zimdump из пакета zim-tools)
zimdump info ./out/my_archive.zim
zimdump list ./out/my_archive.zim | head
```

Параметр `--name` обязателен, `--output` — это **каталог** для результата, имя файла задаётся через `--zim-file`, а `--url` указывает главную страницу, которая откроется при запуске.

> Параметры warc2zim сверены с исходным кодом версии 2.3.1, команды zimdump — с исходным кодом [zim-tools](https://github.com/openzim/zim-tools) (октябрь 2026).

### Когда стоит делать

✅ Подходит, если:

- архив предназначен для **публичного использования без интернета**;
- целевая аудитория — **жители удалённых регионов**, школы, библиотеки;
- нужно передать **один файл**, а не поднимать сервер.

❌ Не подходит, если:

- нужны **динамические запросы, поиск, аннотации** — лучше нативный WARC/WACZ + pywb;
- большая разница в **датах захода** — ZIM хорошо работает с одним снимком, но плохо
  с историческими «цепочками».
