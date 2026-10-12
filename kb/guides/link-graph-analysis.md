---
title: Анализ ссылочного графа веб-архива
sidebar_label: Анализ ссылочного графа
description: "Как построить и проанализировать ссылочный граф по веб-архиву: ссылки из WARC и WAT, metawarc, Archives Unleashed Toolkit, графы Common Crawl, Hyphe, NetworkX, Gephi и WebGraph."
last_update:
  date: 2026-10-12
keywords: [link-graph, network-analysis, wat, hyphe, gephi, webgraph, networkx]
---

# Анализ ссылочного графа веб-архива

Ссылочный граф (link graph) — это сеть, где **узлы** — URL или домены, а **рёбра** — гиперссылки между страницами. Анализ графа полезен для:

- изучения информационных потоков в СМИ;
- поиска изолированных сообществ сайтов («информационных пузырей»);
- исследования медиаэкосистемы;
- поиска сетей сайтов, связанных однотипными ссылками (спам, бот-сети).

> **Пример вопроса:** какие сайты ссылаются на официальные заявления правительства? Какая доля ссылок ведёт на независимые СМИ? Кто ссылается на конкретное расследование?

## Входные данные

### WAT — метаданные с гиперссылками

Common Crawl публикует для каждого обхода файлы **WAT** — это WARC-файлы с записями `metadata`, в которых лежит JSON с извлечёнными метаданными страницы, включая ссылки. Структура одной записи (сокращённо, по реальному файлу обхода CC-MAIN-2024-33):

```json
{
  "Container": {"...": "..."},
  "Envelope": {
    "Format": "WARC",
    "WARC-Header-Metadata": {
      "WARC-Type": "response",
      "WARC-Target-URI": "https://example.com/article",
      "WARC-Date": "...",
      "...": "..."
    },
    "Payload-Metadata": {
      "HTTP-Response-Metadata": {
        "Response-Message": {"...": "..."},
        "Headers": {"...": "..."},
        "HTML-Metadata": {
          "Head": {
            "Title": "Article title",
            "Metas": [{"name": "author", "content": "..."}],
            "Link": [],
            "Scripts": []
          },
          "Links": [
            {"path": "A@/href", "url": "https://other.com/page", "text": "Другой сайт"},
            {"path": "A@/href", "url": "/related", "text": "Похожее", "rel": "nofollow"},
            {"path": "IMG@/src", "url": "/logo.png"}
          ]
        }
      }
    }
  }
}
```

**Что даёт WAT:**

- все ссылки страницы с указанием, откуда они взяты (`path`: `A@/href` — ссылка, `IMG@/src` — изображение, `FORM@/action` — форма и т. д.);
- текст ссылки (`text`) и, если есть, атрибуты `rel`, `title`, `target`;
- заголовок страницы и метатеги.

URL в `Links` бывают относительными — их нужно разрешать относительно `WARC-Target-URI`.

### Разбор WAT на Python

```python
import json
from urllib.parse import urljoin
from warcio.archiveiterator import ArchiveIterator

edges = []  # (src, dst, anchor, rel)
with open("CC-MAIN-...warc.wat.gz", "rb") as stream:
    for record in ArchiveIterator(stream):
        if record.rec_type != "metadata":
            continue
        env = json.loads(record.content_stream().read())["Envelope"]
        if env["WARC-Header-Metadata"].get("WARC-Type") != "response":
            continue
        src = env["WARC-Header-Metadata"]["WARC-Target-URI"]
        html = env["Payload-Metadata"]["HTTP-Response-Metadata"].get("HTML-Metadata", {})
        for link in html.get("Links", []):
            if link.get("path") != "A@/href" or "url" not in link:
                continue
            dst = urljoin(src, link["url"])
            if dst.startswith(("http://", "https://")):
                edges.append((src, dst, link.get("text", ""), link.get("rel")))
```

### Ссылки из собственного WARC

Если WAT нет, ссылки можно извлечь из HTML-ответов самостоятельно:

```python
from urllib.parse import urljoin
from bs4 import BeautifulSoup
from warcio.archiveiterator import ArchiveIterator

edges = []  # (src, dst, anchor)
with open("archive.warc.gz", "rb") as stream:
    for record in ArchiveIterator(stream):
        if record.rec_type != "response" or not record.http_headers:
            continue
        if "text/html" not in record.http_headers.get_header("Content-Type", ""):
            continue
        src = record.rec_headers.get_header("WARC-Target-URI")
        soup = BeautifulSoup(record.content_stream().read(), "html.parser")
        for a in soup.find_all("a", href=True):
            dst = urljoin(src, a["href"])
            if dst.startswith(("http://", "https://")):
                edges.append((src, dst, a.get_text(strip=True)))
```

> Код этой страницы проверен в октябре 2026 года на warcio 1.8.1, NetworkX 3.7 и DuckDB 1.5.6 (на фрагменте WAT-файла Common Crawl и тестовом WARC).

## Инструменты

### metawarc (Ruarxive)

[metawarc](/kb/instruments/ruarxive-tools/metawarc) извлекает ссылки из коллекции WARC в свой каталог и строит отчёт о связях между хостами и доменами:

```bash
metawarc index 'archives/*.warc.gz' --dbfile collection.db
metawarc index-content --dbfile collection.db --type links
metawarc analyze links --dbfile collection.db --output links.parquet --output-format parquet
```

### Archives Unleashed Toolkit

[Archives Unleashed Toolkit](https://github.com/archivesunleashed/aut) — открытый набор инструментов на Apache Spark для анализа веб-архивов: извлечение текста, ссылок, графов доменов из WARC/ARC. Подходит для коллекций, которые не помещаются на один компьютер. Документация — [aut.docs.archivesunleashed.org](https://aut.docs.archivesunleashed.org/).

### Графы Common Crawl

Common Crawl регулярно публикует готовые графы на уровне хостов и доменов — см. страницу [Web Graphs](https://commoncrawl.org/web-graphs). Код построения открыт: [commoncrawl/cc-webgraph](https://github.com/commoncrawl/cc-webgraph). Это самый быстрый способ получить граф «всего веба» без собственной обработки WAT.

### Hyphe

[Hyphe](https://github.com/medialab/hyphe) — исследовательский краулер Sciences Po médialab. Он собирает корпус сайтов и строит сеть между «веб-сущностями» (страница, сайт, поддомен или их комбинация). Hyphe обходит живой веб; в настройках бэкенда (`config-backend.env`) можно указать веб-архивы — например, Wayback Machine через параметр `HYPHE_WEBARCHIVES_OPTIONS`, — чтобы обходить их снимки на заданную дату.

Устанавливается через Docker Compose по [инструкции из README](https://github.com/medialab/hyphe#easy-install-using-docker): клонировать репозиторий, скопировать файлы `.env.example`, `config-backend.env.example` и `config-frontend.env.example` без суффикса `.example`, выполнить `docker compose pull` и `docker compose up`. Образы публикуются на Docker Hub как `scpomedialab/hyphe_*`. Для полноценной работы README рекомендует иметь не меньше 100 ГБ свободного места.

**Когда использовать:** академические исследования медиаэкосистем с ручной разметкой корпуса.

### WebGraph

[WebGraph](https://github.com/vigna/webgraph) — Java-фреймворк для **сжатого хранения** очень больших графов и работы с ними; есть порт на Rust — [webgraph-rs](https://github.com/vigna/webgraph-rs). Нужен, когда граф не помещается в память в обычном представлении.

### DuckDB — быстрые подсчёты по списку рёбер

Сохраните рёбра в CSV или Parquet (столбцы `src, dst, anchor, rel`) и считайте метрики SQL-запросами в [DuckDB](https://duckdb.org/):

```sql
-- Домены с наибольшим числом исходящих ссылок
SELECT regexp_extract(src, '://([^/]+)', 1) AS domain,
       COUNT(DISTINCT dst) AS out_links
FROM read_csv_auto('edges.csv')
GROUP BY domain
ORDER BY out_links DESC
LIMIT 20;
```

Для PageRank и других метрик графа экспортируйте рёбра в NetworkX или другую библиотеку для графов.

### NetworkX (Python)

```bash
pip install networkx numpy scipy   # numpy и scipy нужны для PageRank
```

Граф на уровне доменов обычно информативнее и намного меньше графа страниц:

```python
from urllib.parse import urlsplit
import networkx as nx

def host(url):
    return urlsplit(url).hostname or ""

G = nx.DiGraph()
for src, dst, *_ in edges:
    s, d = host(src), host(dst)
    if s and d and s != d:
        w = G.get_edge_data(s, d, {}).get("weight", 0)
        G.add_edge(s, d, weight=w + 1)

pagerank = nx.pagerank(G, weight="weight")
for node, score in sorted(pagerank.items(), key=lambda x: x[1], reverse=True)[:10]:
    print(f"{score:.4f}\t{node}")
```

### Gephi (визуализация)

[Gephi](https://gephi.org/) — открытая программа для визуализации графов. Экспорт из NetworkX:

```python
nx.write_gexf(G, "graph.gexf")
```

Откройте файл в Gephi → Layout (ForceAtlas2 и др.). Документация — [docs.gephi.org](https://docs.gephi.org/).

## Метрики графа

### PageRank

Мера «важности» узла: чем больше важных узлов на него ссылается, тем он важнее.

```python
nx.pagerank(G)
```

### Посредничество (betweenness centrality)

Узлы, через которые проходит много кратчайших путей. На больших графах считается долго — используйте приближённый расчёт по выборке (`k=`).

```python
nx.betweenness_centrality(G, k=500, seed=42)
```

### Входящие и исходящие ссылки

```python
in_deg = sorted(G.in_degree(), key=lambda x: x[1], reverse=True)
out_deg = sorted(G.out_degree(), key=lambda x: x[1], reverse=True)
```

### Компоненты связности

Сколько изолированных групп в графе:

```python
print(nx.number_weakly_connected_components(G))
```

### Коэффициент кластеризации

Насколько соседи узла связаны между собой:

```python
nx.average_clustering(G.to_undirected())
```

## Сценарии исследования

### Сценарий 1. Экосистема СМИ

1. Возьмите граф доменов Common Crawl или постройте его из WAT по своему списку сайтов.
2. Разметьте узлы по типу (государственные СМИ, независимые, региональные и т. д.).
3. Посмотрите, между какими группами есть ссылки и в каком объёме.

**Вопрос:** какие сайты ссылаются на независимые СМИ, а какие — на государственные?

### Сценарий 2. Однотипные ссылки с многих сайтов

Признак сети сайтов или спама — один и тот же текст ссылки на один адрес с большого числа **разных** сайтов:

```python
from collections import defaultdict
from urllib.parse import urlsplit

sources = defaultdict(set)  # (dst, anchor) -> множество доменов-источников
for src, dst, anchor, *_ in edges:
    if anchor:
        sources[(dst, anchor)].add(urlsplit(src).hostname)

for (dst, anchor), hosts in sorted(sources.items(), key=lambda x: -len(x[1]))[:20]:
    if len(hosts) >= 50:
        print(f"{dst} «{anchor}» — с {len(hosts)} доменов")
```

Порог (здесь 50 доменов) подбирайте под размер своего корпуса.

### Сценарий 3. Тематические кластеры

Выделение сообществ (алгоритм Louvain встроен в NetworkX):

```python
communities = nx.community.louvain_communities(G.to_undirected(), seed=42)
for i, nodes in enumerate(sorted(communities, key=len, reverse=True)[:5]):
    print(i, len(nodes), sorted(nodes)[:5])
```

## Подводные камни

### Масштаб

Одна страница может содержать десятки ссылок, так что граф миллиона страниц — это десятки миллионов рёбер. NetworkX хранит граф в объектах Python и на таких объёмах требует очень много памяти. Варианты:

- перейти к графу на уровне хостов или доменов;
- использовать WebGraph, Spark (Archives Unleashed Toolkit, GraphFrames) или готовые графы Common Crawl.

### Динамическая природа

Ссылки устаревают, граф 2010 года не равен графу 2020 года. **Всегда фиксируйте дату обхода и источник данных.**

### Nofollow

Ссылки с `rel="nofollow"` (а также `sponsored`, `ugc`) поисковики учитывают иначе. Решите заранее, включать ли их в анализ, и посчитайте их долю:

```sql
SELECT COUNT(*) FILTER (WHERE rel ILIKE '%nofollow%') AS nofollow,
       COUNT(*) FILTER (WHERE rel IS NULL OR NOT rel ILIKE '%nofollow%') AS followed
FROM read_csv_auto('edges.csv');
```

### Неполнота

Часть ссылок недоступна краулерам (страницы за авторизацией, ссылки, которые создаёт JavaScript). Граф отражает только то, что было собрано.

## Когда использовать

✅ Подходит:

- **Исследование экосистемы СМИ** — кто на кого ссылается.
- **Поиск сетей однотипных сайтов** и SEO-спама.
- **Картирование академических сообществ** — кто ссылается на публикации.
- **Поиск изолированных кластеров**.
- **Вебометрика** — сравнение сайтов по разным метрикам.

❌ Не подходит:

- **Маленький архив** (до сотни страниц) — статистически незначимо.
- **Мониторинг в реальном времени** — это пакетная обработка.
- **Точные SEO-метрики** — для этого есть коммерческие сервисы с собственными индексами.

## Best practices

### Сохраняйте метаданные анализа

```python
import json

metadata = {
    "crawl": "CC-MAIN-2024-33",
    "source": "Common Crawl WAT",
    "graph_level": "host",
    "algorithm": "PageRank (networkx, weight=weight)",
    "date_of_analysis": "2026-10-12",
}

with open("graph-metadata.json", "w") as f:
    json.dump(metadata, f, indent=2, ensure_ascii=False)
```

### Используйте разные метрики

Не полагайтесь только на PageRank: разные метрики показывают разные стороны графа.

### Фиксируйте правила фильтрации

Записывайте, исключали ли вы `nofollow`, внутренние ссылки, ссылки на соцсети и счётчики: от этого сильно зависят результаты.

### Выборка

Если граф слишком большой, можно работать со случайной выборкой страниц, но учитывайте, что выборка искажает метрики, зависящие от структуры (PageRank, компоненты). Для таких задач лучше переходить к графу доменов.

## Примеры в Ruarxive

Отдельного инструмента для анализа ссылочных графов у Ruarxive нет; ссылки из коллекции можно извлечь через `metawarc analyze links`. Возможные проекты:

- граф ссылок между сайтами органов власти;
- карта цитирования для архивов СМИ;
- поиск зеркал (сайтов с одинаковым содержимым).

## Ресурсы

- [Common Crawl — Web Graphs](https://commoncrawl.org/web-graphs)
- [commoncrawl/cc-webgraph](https://github.com/commoncrawl/cc-webgraph)
- [Archives Unleashed Toolkit](https://aut.docs.archivesunleashed.org/)
- [Hyphe на GitHub](https://github.com/medialab/hyphe)
- [WebGraph на GitHub](https://github.com/vigna/webgraph)
- [Документация NetworkX](https://networkx.org/)
- [Документация Gephi](https://docs.gephi.org/)

## Связанные материалы

- [Common Crawl](/kb/similar/common-crawl) — источник данных.
- [metawarc](/kb/instruments/ruarxive-tools/metawarc) — каталог коллекции и отчёт по ссылкам.
- [Hyphe](/kb/instruments/tools/hyphe)
- [DuckDB-WARC](/kb/instruments/tools/duckdb-warc) — SQL по WARC.
- [Формат WARC](/kb/instruments/file-formats/warc)
- [Ландшафт 2026](/kb/instruments/landscape-2026)
