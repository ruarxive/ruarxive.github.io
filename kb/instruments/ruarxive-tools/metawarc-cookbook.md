---
title: metawarc cookbook — рецепты
sidebar_label: metawarc cookbook
sidebar_position: 7
description: "Практические рецепты metawarc 2.x: каталог PDF с метаданными, поиск по тексту, граф ссылок, инкрементальная индексация, выгрузки через REST, SQL по Parquet-сайдкарам, дубликаты и редиректы."
last_update:
  date: 2026-10-12
---

# metawarc cookbook — рецепты

Рецепты для типовых задач с [metawarc](/kb/instruments/ruarxive-tools/metawarc) 2.x. Все команды и параметры сверены с `--help` и исходным кодом версии 2.0.3; команды CLI, REST и SQL-запросы проверены на тестовом WARC (октябрь 2026). Больше сценариев — в [рецептах официальной документации](https://ruarxive.org/metawarc/getting-started/cookbook).

Во всех примерах база называется `collection.db`, а её сайдкары лежат в `collection.data/`.

---

## 1. Каталог PDF с метаданными

**Задача:** получить список PDF в коллекции и метаданные документов (заголовок, автор, программа, даты — то, что записано в самом PDF).

```bash
# 1) Извлечь метаданные PDF
metawarc index-content --dbfile collection.db --type pdfs

# 2) Список PDF-записей в CSV (до 1000 строк за вызов, дальше — --offset)
metawarc list-files --dbfile collection.db --mimes application/pdf \
  --limit 1000 -o pdf-records.csv --output-format csv

# 3) Извлечённые метаданные в JSON Lines
metawarc dump-metadata --dbfile collection.db --type pdfs -o pdf-metadata.jsonl

# 4) Сводка по извлечённым метаданным
metawarc analyze metadata --dbfile collection.db --type pdfs --top 20
```

Каждая строка `pdf-metadata.jsonl` — «конверт» экстрактора: `url`, `warc_id`, `detected_type`, `extractor`, исходные (`metadata_json`) и нормализованные (`normalized_json`) метаданные, предупреждения и коды ошибок. Сами файлы PDF выгружаются командой `metawarc dump --mimes application/pdf --output ./pdfs`.

---

## 2. Поиск по тексту

**Задача:** найти все упоминания фразы в HTML, PDF и OOXML.

```bash
# Один раз: построить сайдкар texts
metawarc index-content --dbfile collection.db --text

# Поиск из командной строки
metawarc search "выборы 2026" --dbfile collection.db --limit 50
```

Через REST (нужен запущенный `metawarc serve`):

```bash
curl -s -G -H "Authorization: Bearer $METAWARC_API_TOKEN" \
  http://127.0.0.1:8000/records/search \
  --data-urlencode 'phrase=выборы 2026' --data-urlencode 'limit=50'
```

Через MCP агент вызовет `search_records(phrase="выборы 2026", limit=20)`.

Поиск — последовательный просмотр текста в DuckDB, без ранжирования и фильтра по языку. Для больших коллекций и сложных запросов используйте полнотекстовые системы, например [SolrWayback](/kb/instruments/tools/solrwayback).

---

## 3. Граф ссылок между доменами

**Задача:** построить граф «какой домен на какой ссылается» для исследования.

```bash
metawarc index-content --dbfile collection.db --type links
metawarc analyze links --dbfile collection.db -o links.json --output-format json
```

В отчёте `data.records` — отдельные ссылки, `data.hosts` и `data.domains` — агрегированные рёбра с полями `source_domain`, `target_domain`, `relation` (`internal`/`external`) и `count`.

```python
import json
import networkx as nx

report = json.load(open("links.json", encoding="utf-8"))

G = nx.DiGraph()
for edge in report["data"]["domains"]:
    if edge["relation"] == "external":
        G.add_edge(edge["source_domain"], edge["target_domain"], weight=edge["count"])

nx.write_gexf(G, "domains.gexf")  # открыть в Gephi
for domain, score in sorted(nx.pagerank(G).items(), key=lambda x: x[1], reverse=True)[:10]:
    print(f"{score:.4f}\t{domain}")
```

Подробнее о методике — [Анализ ссылочного графа](/kb/guides/link-graph-analysis).

---

## 4. Инкрементальная индексация новых WARC

**Задача:** регулярно добавлять новые файлы без полной переиндексации.

```bash
#!/bin/bash
set -e
DB=/data/collection.db

# 1) Посмотреть план: какие файлы новые, изменённые, без изменений
metawarc ingest '/data/warcs/**/*.warc*' --dbfile "$DB" --dry-run

# 2) Применить (с продолжением прерванного запуска)
metawarc ingest '/data/warcs/**/*.warc*' --dbfile "$DB" --resume

# 3) Метаданные: архивы, у которых сайдкар этого типа уже есть, пропускаются
metawarc index-content --dbfile "$DB" --type links --type pdfs --text

# 4) Проверка каталога
metawarc doctor --dbfile "$DB"

# 5) Свежий CDXJ для внешнего pywb
metawarc export-cdxj --dbfile "$DB" -o /data/collection.cdxj --path-index /data/paths.tsv
```

Изменения файлов определяются по отпечатку (размер и время изменения); `--digest-fingerprint` добавляет к нему SHA-256 файла. Если архив переместили, metawarc не будет угадывать: привяжите его заново командой `metawarc rebind <archive_id> <новый путь>`.

---

## 5. Сводка для дашборда через REST

**Задача:** показать в веб-интерфейсе число архивов и записей.

```bash
METAWARC_API_TOKEN='длинная-случайная-строка' metawarc serve --dbfile collection.db
```

```javascript
const API = "http://127.0.0.1:8000";
const headers = { Authorization: `Bearer ${TOKEN}` };

const archives = await (await fetch(`${API}/warcs/list`, { headers })).json();      // массив архивов
const page = await (await fetch(`${API}/records/list?limit=1`, { headers })).json(); // нужен total

console.log(`Архивов: ${archives.length}, записей: ${page.total}`);
```

`limit=0` вернёт ошибку 422: минимальное значение — 1. Токен не стоит встраивать в публичный фронтенд: делайте запросы через свой сервер.

---

## 6. Выгрузка списка записей фоновой задачей

**Задача:** выгрузить записи с HTTP 200 в Parquet для загрузки в аналитическую базу.

```python
import time
import requests

API = "http://127.0.0.1:8000"
s = requests.Session()
s.headers["Authorization"] = "Bearer " + "замените-на-токен"

job = s.post(f"{API}/jobs", json={
    "kind": "export-records",
    "format": "parquet",
    "limit": 1000,
    "filters": {"status_min": 200, "status_max": 200, "date_from": "2026-10-01"},
}).json()

while True:
    state = s.get(f"{API}/jobs/{job['id']}").json()
    if state["status"] in ("succeeded", "failed", "cancelled"):
        break
    time.sleep(2)

print(state["status"], state["result"].get("path"), state["error"])
```

Результат сохраняется на сервере в `collection.data/jobs/<job_id>/result.parquet`; `GET /jobs/<job_id>/result` возвращает только сведения о файле. В версии 2.0.3 задача с `limit` больше 1000 завершается ошибкой — для большего объёма ставьте несколько задач с `offset` в `filters` или используйте SQL из рецепта 7.

---

## 7. SQL по Parquet-сайдкарам в DuckDB

**Задача:** выполнить произвольный аналитический запрос.

В DuckDB-каталоге metawarc 2.x только служебные таблицы (`archives`, `catalog_state`, `checkpoints`, `meta`, `runs`, `sidecars`). Записи, заголовки, ссылки, тексты и метаданные лежат в Parquet-файлах; их актуальные пути перечислены в таблице `sidecars` (столбцы `kind`, `path`, `status`) относительно каталога `collection.data`.

```python
import os
import duckdb

DB, DATA_DIR = "collection.db", "collection.data"
con = duckdb.connect(DB, read_only=True)

def sidecars(kind):
    rows = con.execute(
        "SELECT path FROM sidecars WHERE kind = ? AND status = 'active'", [kind]
    ).fetchall()
    return [os.path.join(DATA_DIR, row[0]) for row in rows]

records = sidecars("records")

# Записей и объём по хостам
print(con.execute("""
    SELECT host, count(*) AS records, sum(content_length) AS bytes
    FROM read_parquet(?)
    GROUP BY host ORDER BY records DESC LIMIT 20
""", [records]).df())
```

Столбцы сайдкара `records`: `archive_id`, `warc_id`, `url`, `host`, `content_type`, `c_type`, `offset`, `length`, `rec_date`, `content_length`, `status_code`, `source`, `filename`, `ext`, `payload_digest`, `block_digest`. У `headers` — `archive_id`, `warc_id`, `key`, `value`, `source`; у `links` — `source`, `url`, `base_url`, `target`, `text`, `class_json`, `element_id`; у `texts` — `url`, `language`, `text`.

Открывайте базу только на чтение и не запускайте такие запросы во время индексации.

---

## 8. Редиректы и адреса, куда они ведут

**Задача:** найти все ответы 3xx и значение заголовка `Location`.

Список записей без заголовков:

```bash
metawarc list-files --dbfile collection.db --status-min 300 --status-max 399 \
  --limit 1000 -o redirects.csv --output-format csv
```

С адресом перехода — SQL по сайдкарам (функция `sidecars` из рецепта 7):

```python
redirects = con.execute("""
    SELECT r.url, r.status_code, h.value AS location
    FROM read_parquet(?) r
    LEFT JOIN read_parquet(?) h
      ON h.archive_id = r.archive_id AND h.warc_id = r.warc_id
     AND lower(h.key) = 'location'
    WHERE r.status_code BETWEEN 300 AND 399
    ORDER BY r.url
""", [sidecars("records"), sidecars("headers")]).df()
```

Через REST: `GET /records/list?status_min=300&status_max=399` (параметра `status` нет).

---

## 9. Дубликаты содержимого

**Задача:** найти записи с одинаковым содержимым (например, один PDF на разных адресах).

```bash
metawarc analyze hashes --dbfile collection.db --resume
metawarc analyze duplicates --dbfile collection.db -o duplicates.csv --output-format csv
```

`hashes` один раз считает SHA-256 содержимого записей и сохраняет результат; `duplicates` группирует записи с одинаковыми хешами.

---

## 10. Сравнение двух снимков страницы

**Задача:** показать, что изменилось на странице между двумя сборами.

```bash
# Найти снимки нужного адреса
metawarc list-files --dbfile collection.db --url-pattern 'example.com/article' \
  --sort-by date -o snapshots.jsonl --output-format jsonl

# Выгрузить два снимка по warc_id из snapshots.jsonl
metawarc get 'urn:uuid:<первый>' --dbfile collection.db --output v1.html
metawarc get 'urn:uuid:<второй>' --dbfile collection.db --output v2.html
```

```python
from difflib import unified_diff
from bs4 import BeautifulSoup

def text(path):
    with open(path, "rb") as f:
        return BeautifulSoup(f.read(), "html.parser").get_text("\n")

print("\n".join(unified_diff(text("v1.html").splitlines(), text("v2.html").splitlines(),
                             fromfile="v1", tofile="v2", lineterm="")))
```

---

## 11. Локальный просмотр и связка с pywb

**Задача:** быстро посмотреть сохранённый сайт, а для публичного доступа — отдать коллекцию pywb.

```bash
# Встроенный просмотр (нужен metawarc[api])
metawarc serve --dbfile collection.db
# http://127.0.0.1:8000/                                  — список сайтов
# http://127.0.0.1:8000/replay/20260315102345mp_/https://example.com/article

# CDXJ-индекс и таблица «имя файла → путь» для pywb
metawarc export-cdxj --dbfile collection.db -o collection.cdxj --path-index paths.tsv
```

Встроенный просмотр не переписывает JavaScript. Для публичного доступа и сложных сайтов используйте [pywb](/kb/instruments/replay/pywb) с исходными WARC; как подключить готовый CDXJ-индекс к коллекции, описано в документации pywb. Для одиночных WACZ удобен [ReplayWeb.page](/kb/instruments/replay/replayweb-page).

---

## 12. Резервная копия каталога

**Задача:** не потерять результат многочасовой индексации.

Переносить и копировать базу нужно вместе с её каталогом сайдкаров: пути в каталоге хранятся относительно него.

```bash
#!/bin/bash
set -e
DB=/data/metawarc/collection.db
DATA=/data/metawarc/collection.data
BACKUP=/backup/metawarc/$(date +%Y-%m-%d)

metawarc doctor --dbfile "$DB"                     # убедиться, что каталог исправен
metawarc cleanup --dbfile "$DB" --apply            # убрать выведенные из оборота сайдкары старше 7 дней
mkdir -p "$BACKUP"
cp -p "$DB" "$BACKUP/"
rsync -a "$DATA/" "$BACKUP/collection.data/"
```

Запускайте копирование, когда не идёт индексация. Сами WARC копируются отдельно — metawarc их не изменяет.

---

## Какой рецепт выбрать

| Цель | Рецепт |
| :--- | :--- |
| Список PDF и их метаданные | 1 |
| Поиск фразы | 2 |
| Граф ссылок | 3 |
| Регулярное добавление WARC | 4 |
| Цифры для дашборда | 5 |
| Выгрузка списка записей в файл | 6 |
| Произвольная аналитика | 7 |
| Редиректы | 8 |
| Дубликаты | 9 |
| Изменения страницы | 10 |
| Просмотр сайта | 11 |
| Резервная копия | 12 |

## См. также

- [metawarc (обзор)](/kb/instruments/ruarxive-tools/metawarc)
- [metawarc REST API](/kb/instruments/ruarxive-tools/metawarc-rest)
- [metawarc MCP-сервер](/kb/instruments/ruarxive-tools/metawarc-mcp)
- [metawarc: экстракторы](/kb/instruments/ruarxive-tools/metawarc-extractors)
- [DuckDB и WARC](/kb/instruments/tools/duckdb-warc)
- [WARC-workflow](/kb/guides/warc-workflow)
- [Кейс: wparc → metawarc](/kb/case-studies/wparc-to-metawarc-pipeline)
