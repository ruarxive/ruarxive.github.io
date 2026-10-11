---
title: Анализ ссылочного графа веб-архива
sidebar_label: Анализ ссылочного графа
description: "Анализ link-graph веб-архивов: построение графа, метрики, визуализация. WAT, Hyphe, WebGraph, Gephi. Исследования связей между сайтами."
last_updated: 2026-11-09
keywords: [link-graph, network-analysis, wat, hyphe, gephi, webgraph]
---

# Анализ ссылочного графа веб-архива

Ссылочный граф (link graph) — это сеть, где **узлы** это URL или домены, а **рёбра** — гиперссылки между страницами. Анализ графа полезен для:

- Изучения информационных потоков в СМИ.
- Обнаружения «информационных пузырей» и эхо-камер.
- Исследования медиа-экосистемы.
- Маппинга бот-сетей и спама.

> **Пример:** какие сайты ссылаются на официальные заявления правительства? Какой процент ссылок ведёт на независимые СМИ vs контролируемые? Кто ссылается на расследование?

## Входные данные

### WAT — метаданные с гиперссылками

Common Crawl предоставляет **WAT** — JSON-файлы с извлечёнными метаданными, включая гиперссылки.

```json
{
  "warcinfo": {...},
  "Envelope": {
    "WARC-Header-Metadata": {...},
    "WARC-Target-URI": "https://example.com/article",
    "Payload-Metadata": {
      "HTTP-Response-Metadata": {...}
    },
    "Containers": {
      "HTML-Metadata": {
        "Link": [
          {"href": "https://other.com/page", "path": "a", "rel": "no-follow"},
          {"href": "https://example.com/related", "path": "section"}
        ],
        "Head": {
          "Title": "Article title",
          "Metas": [{"name": "author", "content": "..."}]
        }
      }
    }
  }
}
```

**Что даёт WAT:**

- Все ссылки с каждой страницы.
- Тип ссылки (`rel="nofollow"`, `rel="sponsored"` и т. д.).
- Заголовок страницы.
- Метатеги.

### WARC + извлечение

Если у вас **WARC без WAT**, можно извлечь ссылки программно:

```python
from warcio.archiveiterator import ArchiveIterator
from bs4 import BeautifulSoup

links_graph = {}  # URL → [links]

with open("archive.warc.gz", "rb") as stream:
    for record in ArchiveIterator(stream):
        if record.rec_type != "response":
            continue
        url = record.rec_headers.get_header("WARC-Target-URI")
        content_type = record.http_headers.get_header("Content-Type", "")
        if "text/html" not in content_type:
            continue
        payload = record.content_stream().read()
        soup = BeautifulSoup(payload, "html.parser")
        for a in soup.find_all("a", href=True):
            links_graph.setdefault(url, []).append(a["href"])
```

## Инструменты

### Hyphe (research-grade)

[Hyphe](https://github.com/medialab/hyphe) — специализированный инструмент для исследования link-graph в веб-архивах от Sciences Po Medialab.

```bash
# Установка через Docker
docker pull medialab/hyphe
docker run -p 8080:8080 medialab/hyphe
```

**Что умеет:**

- Сбор по URL + старт-листам (seeds).
- Автоклассификация узлов на веб-акторов (СМИ, академия и т.д.).
- Tagging, веб-интерфейс.
- Визуализация сетей.

**Когда использовать:**

- Академические исследования медиа-экосистем.
- Подробный анализ с curation.

### WebGraph (Java фреймворк)

[WebGraph](https://github.com/vigna/webgraph) — фреймворк для **сжатого хранения** и обработки огромных графов.

```java
import it.unimi.dsi.webgraph.ImmutableGraph;
import it.unimi.dsi.webgraph.BVGraph;

// Загрузка сжатого графа
ImmutableGraph graph = BVGraph.load("my-graph.bvg");

// Метрики
NodesIterator iter = graph.nodes();
int nodes = (int) graph.numNodes();
```

**Особенности:**

- Сжимает граф дружбы Facebook в 4 ГБ на диске.
- Поддерживает PageRank, HITS, центральности.
- Java-only, но стабильный.

### pywb (для коллекций)

[pywb](/kb/instruments/replay/pywb) имеет встроенные возможности извлечения ссылок через `wbui`.

### DuckDB + custom Graph (proto)

[DuckDB](https://duckdb.org/) можно использовать для быстрого прототипирования:

```sql
-- Создаём граф как edge-list
CREATE TABLE links AS
SELECT
    src_url AS src,
    dst_href AS dst
FROM parsed_wat
WHERE rel IS NULL OR rel NOT LIKE '%nofollow%';

-- Top доменов по out-degree (сколько ссылок уходит наружу)
SELECT
    regexp_extract(src, '://([^/]+)', 1) AS domain,
    COUNT(DISTINCT dst) AS out_links
FROM links
GROUP BY domain
ORDER BY out_links DESC
LIMIT 20;
```

```sql
-- PageRank (через DuckDB-расширения или эмулируя SQL)
-- или экспорт в NetworkX / iGraph для серьёзного анализа
```

### NetworkX (Python)

```python
import networkx as nx

G = nx.DiGraph()
for src, dst in links:
    G.add_edge(src, dst)

# PageRank
pagerank = nx.pagerank(G, max_iter=100)
top = sorted(pagerank.items(), key=lambda x: x[1], reverse=True)[:10]
for url, score in top:
    print(f"{score:.4f}\t{url}")
```

### Gephi (визуализация)

[Gephi](https://gephi.org/) — открытый инструмент для визуализации графов.

```python
# Экспорт из Python
import networkx as nx
import igraph as ig

# NetworkX → gephi GEXF
nx.write_gexf(G, "graph.gexf")

# iGraph → gephi GEXF
ig.save(G_igraph, "graph.gexf")
```

Открыть в Gephi → Layout (ForceAtlas2, Fruchterman-Reingold) → видим красивый граф.

## Метрики графа

### PageRank

Мера «важности» узла. Чем больше важных узлов на тебя ссылаются, тем ты важнее.

```python
nx.pagerank(G)
```

### Centrality (betweenness)

Мера «посредничества» — узлы, через которые проходит много кратчайших путей.

```python
nx.betweenness_centrality(G)
```

### In-degree / out-degree

Количество входящих / исходящих ссылок. Прямые метрики влияния.

```python
in_deg = sorted(G.in_degree(), key=lambda x: x[1], reverse=True)
out_deg = sorted(G.out_degree(), key=lambda x: x[1], reverse=True)
```

### Connected components

Сколько «изолированных» групп в графе. Полезно для выявления эхо-камер.

```python
components = list(nx.weakly_connected_components(G))
print(f"Связных компонент: {len(components)}")
```

### Clustering coefficient

Мера «кластеризации» — насколько друзья узла являются друзьями друг друга.

```python
nx.average_clustering(G)
```

## Сценарии исследования

### Сценарий 1. Экосистема российских СМИ

```python
# Загрузить данные RIMA / Common Crawl
# Построить граф
# Визуализировать кластеры (ForceAtlas2)
# Tag вершины по типу: гос. СМИ, независимые, эмиграция, активисты
# Изучить структуру кластеров
```

**Вопрос:** какие сайты ссылаются на независимые СМИ vs на RT/TASS?

### Сценарий 2. Обнаружение бот-сетей

Паттерн — много страниц ссылаются на одни и те же сайты с одинаковой анкорной текстовой ссылкой.

```python
from collections import defaultdict

anchor_by_url = defaultdict(set)
for src, dst, anchor in links_with_anchors:
    anchor_by_url[dst].add(anchor)

# Какие URL получают много одинаковых ссылок с разных страниц
for dst, anchors in anchor_by_url.items():
    if len(anchors) > 100 and len(set(anchors)) < 5:
        print(f"Suspicious: {dst}, anchors: {anchors}")
```

### Сценарий 3. Тематические кластеры

Через community detection:

```python
import community as community_louvain

partition = community_louvain.best_partition(G.to_undirected())
# partition: {node_id: cluster_id}

clusters = defaultdict(list)
for node, cluster in partition.items():
    clusters[cluster].append(node)
```

## Подводные камни

### Масштаб

Граф одной страницы может иметь 50+ ссылок. Граф 1 млн страниц = 50 млн рёбер. Это **уже серьёзный размер**:

- NetworkX в RAM: 50 млн рёбер ≈ 4 ГБ.
- WebGraph сжатый: 50 млн рёбер ≈ 200 МБ.

Для большего — нужен Spark, GraphFrames или MapReduce.

### Динамическая природа

Ссылки устаревают. Граф 2010 года ≠ граф 2020 года. **Всегда фиксируйте дату краула.**

### Nofollow

Google учитывает `rel="nofollow"` для SEO, но рейтинг не передаётся. В академических исследованиях — тоже важно.

```sql
SELECT
    COUNT(*) FILTER (WHERE rel = 'nofollow') AS nofollow_count,
    COUNT(*) FILTER (WHERE rel IS NULL OR rel != 'nofollow') AS dofollow_count
FROM links;
```

### Robots.txt и неиндексируемые ссылки

Часть ссылок скрыта от краулеров (login, авторизация). Граф отражает только то, что доступно.

## Когда использовать

✅ Подходит:

- **Исследование экосистемы СМИ** — кто на кого ссылается.
- **Обнаружение бот-сетей** и SEO-спама.
- **Картирование академических сообществ** — кто ссылается на публикации.
- **Анализ эхо-камер** — изолированные кластеры.
- **Webometrics** — сравнение сайтов по разным метрикам.

❌ Не подходит:

- **Анализ малого архива** (< 100 страниц) — статистически незначимо.
- **Реал-тайм мониторинг** — это batch-инструменты.
- **Точные цифры PR/SEO** — нужны специализированные сервисы (Ahrefs, Majestic).
- **Глубокий анализ 1+ ГБ ссылок** без распределённого решения.

## Best practices

### Сохраняйте версию графа

```python
# Сохраняйте: timestamp, тип алгоритма, метрики
import json

metadata = {
    "crawl_date": "2026-11-09",
    "source": "Common Crawl CC-MAIN-2026-04",
    "algorithm": "PageRank max_iter=100",
    "top_pagerank": top[:10],
}

with open("graph-metadata.json", "w") as f:
    json.dump(metadata, f, indent=2)
```

### Используйте разные метрики

Не полагайтесь только на PageRank. Разные метрики дают разные перспективы.

### Filter по nofollow

Для академических исследований — **с фильтром** nofollow. Для экологии — **без** фильтра (полная картина).

### Сэмплирование

Если граф слишком большой — случайная выборка 10–20 % страниц. Статистически значимо для центральных узлов.

## Примеры в Ruarxive

Команда Ruarxive не имеет готового link-graph инструмента. Потенциальные проекты:

- Каталог link-graph правительственных сайтов РФ.
- Карта «кто цитирует» для архивных СМИ.
- Обнаружение «зеркал» (сайтов, ссылающихся на одинаковый контент).

## Ресурсы

- [Common Crawl — WAT](https://commoncrawl.org/) — источник данных.
- [Hyphe GitHub](https://github.com/medialab/hyphe)
- [WebGraph GitHub](https://github.com/vigna/webgraph)
- [NetworkX documentation](https://networkx.org/)
- [Gephi tutorial](https://gephi.org/tutorials/)
- [ESGI link-graph workshop](https://web.archive.org/web/2024*/)

## Связанные материалы

- [Common Crawl](/kb/similar/common-crawl) — источник данных.
- [DuckDB-WARC](/kb/instruments/tools/duckdb-warc) — для SQL-извлечения.
- [Warchaeology](/kb/instruments/tools/warchaeology)
- [WARC-файл: формат](/kb/instruments/file-formats/warc)
- [Ландшафт 2026](/kb/instruments/landscape-2026)
- [Кейс: международные примеры](/kb/case-studies/international-examples)
