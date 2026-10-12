---
sidebar_position: 7
title: "Пайплайн wparc → metawarc: от WP-сайта к индексируемому архиву"
description: "Учебный пайплайн: wparc собирает сайт на WordPress через REST API и упаковывает его в WARC, metawarc индексирует WARC в DuckDB, даёт поиск, выгрузку файлов и локальный replay."
last_update:
  date: 2026-10-12
---

# Пайплайн wparc → metawarc: от WP-сайта к индексируемому архиву

:::note
Это **учебный сценарий** на условном адресе `example.gov.ru`. Объёмы и время работы зависят от сайта и здесь не приводятся. Команды сверены с `--help` wparc 1.0.9 (GitHub) и metawarc 2.0.3 (PyPI), октябрь 2026; индексация и выгрузка metawarc проверены на небольшом тестовом WARC.
:::

Два инструмента Ruarxive работают последовательно: **[wparc](/kb/instruments/ruarxive-tools/wparc)** снимает сайт на WordPress через REST API и упаковывает результат в WARC, а **[metawarc](/kb/instruments/ruarxive-tools/metawarc)** индексирует WARC в каталог DuckDB/Parquet, по которому можно искать, выгружать файлы и просматривать страницы локально.

## Когда подходит этот пайплайн

- Сайт на стандартном WordPress с открытым REST API (`/wp-json/wp/v2/`).
- Нужны структурированные данные — посты, страницы, медиа, авторы, рубрики — с метаданными (даты, авторы, теги), а не только HTML.
- Нужен поиск и выгрузка документов из архива.

Если REST API закрыт или контент рендерится на JavaScript, соберите WARC краулером ([wget](/kb/instruments/tools/wget), [Browsertrix Crawler](/kb/instruments/tools/browsertrix)) и сразу переходите к этапу 3.

## Этап 1. Сбор через wparc

```bash
# Команда warc пока есть только в версии из GitHub (в PyPI 1.0.8 её нет)
pip install git+https://github.com/ruarxive/wparc

wparc ping example.gov.ru                    # доступен ли REST API
wparc analyze example.gov.ru                 # какие маршруты API есть (необязательно)
wparc dump example.gov.ru --verbose          # выгрузить данные в example.gov.ru/data/
wparc getfiles example.gov.ru --verbose      # скачать медиафайлы
```

`dump` сохраняет каждый маршрут API в отдельный файл JSON Lines: `wp_v2_posts.jsonl`, `wp_v2_pages.jsonl`, `wp_v2_media.jsonl`, `wp_v2_comments.jsonl`, `wp_v2_users.jsonl` (только публичные данные) и другие. `getfiles` скачивает файлы из `wp_v2_media.jsonl`, сохраняя структуру каталогов `wp-content/uploads/…`.

## Этап 2. Упаковка в WARC

Отдельный скрипт для конвертации не нужен — у wparc есть своя команда:

```bash
wparc warc example.gov.ru -o example.gov.ru.warc.gz
```

Она записывает ранее сделанный дамп в WARC 1.1 (по умолчанию со сжатием gzip; `--no-compress` — без сжатия).

## Этап 3. Индексация через metawarc

```bash
pip install metawarc                 # базовый CLI
pip install 'metawarc[replay]'       # если нужен локальный просмотр (REST API и replay)

metawarc index example.gov.ru.warc.gz --dbfile site.db
metawarc stats --dbfile site.db --mode mimes        # сводка по MIME-типам
metawarc index-content --dbfile site.db --type pdfs # метаданные PDF
metawarc index-content --dbfile site.db --text      # извлечь текст для поиска
```

Каталог хранится в файле `site.db` (DuckDB) и каталоге `site.data/` с Parquet-файлами. Для пополнения каталога новыми WARC используйте `metawarc ingest` — он добавляет изменившиеся источники и по умолчанию продолжает прерванную работу.

## Этап 4. Что можно делать с архивом

### Искать по тексту

```bash
metawarc search --dbfile site.db "благоустройство набережной" --limit 20
```

Фраза передаётся позиционным аргументом; поиск идёт по текстам, извлечённым командой `index-content --text`.

### Находить и выгружать файлы

```bash
metawarc list-files --dbfile site.db -m application/pdf --limit 50
metawarc dump --dbfile site.db -m application/pdf -o ./pdfs
```

`dump` выгружает выбранные файлы в каталог вместе с манифестом в JSON Lines.

### Смотреть страницы локально

```bash
metawarc serve --dbfile site.db --port 8000
```

Сервер слушает 127.0.0.1 и отдаёт read-only REST API и просмотр страниц по адресам вида `/replay/<время>/<URL>`. Для доступа не с локальной машины нужен токен (`--token` или переменная окружения) — подробнее на странице [metawarc REST API](/kb/instruments/ruarxive-tools/metawarc-rest).

### Экспортировать индекс для pywb

```bash
metawarc export-cdxj --dbfile site.db -o site.cdxj
```

CDXJ-индекс подходит для внешних систем воспроизведения, например [pywb](/kb/instruments/replay/pywb).

### Подключить ИИ-ассистента

```bash
metawarc mcp --dbfile site.db
```

Запускает read-only MCP-сервер (по умолчанию через stdio, нужна установка `metawarc[mcp]`). Подробнее — [metawarc MCP-интеграция](/kb/instruments/ruarxive-tools/metawarc-mcp).

## Этап 5. Публикация

```bash
sha256sum example.gov.ru.warc.gz > MANIFEST.sha256
```

Публикуйте WARC вместе с контрольной суммой и коротким README: адрес сайта, дата сбора, версии wparc и metawarc, что не удалось сохранить. Каталог metawarc (`site.db`, `site.data/`) можно пересоздать из WARC, поэтому основной объект хранения — сам WARC.

## Связанные материалы

- [wparc](/kb/instruments/ruarxive-tools/wparc) — сбор WordPress-сайтов
- [metawarc](/kb/instruments/ruarxive-tools/metawarc) — индекс, поиск, replay, REST, MCP
- [Формат WARC](/kb/instruments/file-formats/warc)
- [Гайд: сделать копию сайта на WordPress](/kb/instruments/howto-collect/make-copy-site-wordpress)
- [Кейс: комплексная архивация несколькими инструментами](/kb/case-studies/multi-tool-archiving)
