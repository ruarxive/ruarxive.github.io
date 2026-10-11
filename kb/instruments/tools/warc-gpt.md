---
title: WARC-GPT — LLM-интерфейс к веб-архивам
sidebar_label: WARC-GPT
description: "WARC-GPT — RAG-инструмент Harvard LIL для анализа коллекций WARC через LLM. Экспериментальный, ограничения, когда использовать."
last_updated: 2026-11-09
keywords: [warc-gpt, harvard, lil, rag, llm, ai, warc, common-crawl]
---

# WARC-GPT — LLM-интерфейс к веб-архивам

[WARC-GPT](https://github.com/harvard-lil/warc-gpt) — open-source инструмент от [Harvard Library Innovation Lab](https://lil.law.harvard.edu/) для анализа коллекций WARC с помощью LLM (Retrieval-Augmented Generation, RAG). Создан в 2025 году как ответ на вопрос «как помочь исследователям работать с большими коллекциями веб-архивов через обычные вопросы?»

> **Главное:** вы загружаете WARC-коллекцию, задаёте вопрос на естественном языке — инструмент находит релевантные страницы, извлекает их и просит LLM дать ответ со ссылками на первоисточник.

## Зачем нужно

Исторически работа с большими веб-архивами требовала:

- Знания SQL или Python.
- Чтения тысяч страниц глазами.
- Понимания структуры конкретного сайта.

WARC-GPT снижает этот порог: можно спросить **«Какие темы освещал сайт X в 2020 году?»** и получить ответ с цитатами.

## Архитектура

```
┌──────────────────┐    ┌──────────────┐    ┌──────────────┐
│ WARC-коллекция   │ -> │  Индексация  │ -> │  Чанки +    │
│ (WARC/WACZ)      │    │  через       │    │  embeddings  │
└──────────────────┘    │  библиотеки  │    └──────┬───────┘
                       └──────────────┘           │
                                                   v
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│  Ответ с     │ <- │  LLM API     │ <- │  Поиск       │
│  цитатами    │    │  (OpenAI,    │    │  ближайших   │
└──────────────┘    │  Anthropic,  │    │  чанков      │
                    │  локальная)  │    └──────────────┘
                    └──────────────┘
```

### Этапы

1. **Извлечение текста** — из каждой HTML-страницы достаётся чистый текст (trafilatura).
2. **Чанкинг** — текст разбивается на куски ~500–2000 символов с перекрытием.
3. **Embeddings** — каждый чанк превращается в вектор через embedding-модель (OpenAI `text-embedding-3-large`, локальная модель и т. д.).
4. **Хранение** — векторы в [ChromaDB](https://www.trychroma.com/) или [LanceDB](https://lancedb.github.io/lancedb/).
5. **Запрос** — вопрос пользователя → embedding → поиск ближайших чанков → LLM генерирует ответ.
6. **Цитирование** — каждая часть ответа ссылается на конкретный чанк с URL и timestamp.

## Установка

```bash
git clone https://github.com/harvard-lil/warc-gpt
cd warc-gpt
pip install -r requirements.txt
```

Требования:

- Python 3.10+.
- API-ключ OpenAI (или совместимого сервиса).
- ~10 ГБ RAM на 100 ГБ WARC-коллекцию (для индексации).
- GPU опционально (для локальных embedding-моделей).

## Быстрый старт

### 1. Подготовьте WARC-коллекцию

```bash
# Структура каталога
warc-collections/
├── collection-1/
│   └── archive.wacz
├── collection-2/
│   └── archive.wacz
└── metadata.json  # опционально
```

### 2. Запустите индексацию

```bash
python -m warc_gpt index \
  --input warc-collections/ \
  --output ./warc-gpt-index/ \
  --embedding-model text-embedding-3-large \
  --chunk-size 1000 \
  --chunk-overlap 200
```

Время индексации: ~5–30 минут на 1 ГБ WARC, в зависимости от длины страниц.

### 3. Задайте вопрос

```bash
python -m warc_gpt query \
  --index ./warc-gpt-index/ \
  --question "Какие темы освещались в 2024 году?" \
  --top-k 10 \
  --llm-model gpt-4o
```

### 4. Интерактивный режим

```bash
python -m warc_gpt chat --index ./warc-gpt-index/
```

```
> Какие статьи упоминают выборы?
> Покажи первые 5 с цитатами
> Сравни публикации 2023 и 2024 годов
```

## Пример вывода

```
> Где упоминался кризис 2020 года?

Found 7 relevant passages in 4 URLs.

Ответ:
Кризис 2020 года был упомянут в нескольких статьях на сайте example.com.
На странице от 12 марта 2020 подробно описаны первые меры (URL: https://...,
timestamp: 20200312), включая...

Цитаты:
- "В связи с эпидемиологической ситуацией принято решение..." (URL, timestamp)
- "По данным на 15 марта зафиксировано..." (URL, timestamp)

Источники:
1. https://example.com/news/2020-03-12 (3 цитаты)
2. https://example.com/news/2020-03-15 (2 цитаты)
3. https://example.com/analysis (1 цитата)
```

## Конфигурация

### config.yaml

```yaml
indexer:
  input_dir: "./warc-collections/"
  output_dir: "./warc-gpt-index/"
  embedding:
    provider: "openai"   # openai | cohere | local
    model: "text-embedding-3-large"
    batch_size: 100
  extraction:
    method: "trafilatura" # trafilatura | readability | html2text
    min_text_length: 100
  chunking:
    size: 1000
    overlap: 200
    strategy: "by_sentence"

query:
  llm:
    provider: "openai"
    model: "gpt-4o"
    temperature: 0.1
    max_tokens: 2000
  retrieval:
    top_k: 10
    rerank: true
  prompt_template: "default_with_citations"
```

## Архитектурные детали

### Embedding-провайдеры

| Провайдер | Модель | Стоимость | Локально |
|:---|:---|:---|:---:|
| OpenAI | `text-embedding-3-large` | $0.13/1M токенов | ❌ |
| OpenAI | `text-embedding-3-small` | $0.02/1M токенов | ❌ |
| Cohere | `embed-english-v3` | $0.10/1M токенов | ❌ |
| Local (HuggingFace) | `all-MiniLM-L6-v2` | бесплатно | ✅ |
| Local (sentence-transformers) | `intfloat/e5-large-v2` | бесплатно | ✅ |

Для приватных коллекций (персональные данные, юридические) — **только локальные модели**.

### LLM-провайдеры

| Провайдер | Модель | Контекст | Примечание |
|:---|:---|:---:|:---|
| OpenAI | gpt-4o / gpt-4o-mini | 128K | Дёшево, качественно |
| Anthropic | claude-3.5-sonnet | 200K | Лучше для русского текста |
| Local | Llama-3 70B / Qwen 2.5 | 128K+ | Нужно железо или Ollama |
| Local | Mistral / Gemma | 8K-32K | Малые VRAM |

Рекомендация для российских проектов: Claude или локальная модель, обученная на русском (Saiga, Yandex YaLM).

### Векторное хранилище

| БД | Когда | Размер |
|:---|:---|:---|
| **ChromaDB** | Standalone, простая | < 100K чанков |
| **LanceDB** | Embedded, in-process | < 1M чанков |
| **Qdrant** | Production self-hosted | > 1M чанков |
| **Pinecone / Weaviate Cloud** | SaaS | millions+ |

## Когда использовать

✅ Подходит:

- **Исследовательские вопросы** к большой коллекции без SQL.
- **Преподавание** — студенты задают вопросы на естественном языке.
- **OSINT-расследования** — быстро проверить гипотезу по архиву.
- **Генерация обзоров** литературы или прессы.
- **Мультимодальный поиск** — через `multimodal-embeddings` (для изображений).

❌ Не подходит:

- **Точные подсчёты** — LLM могут ошибаться в числах.
- **Юридические доказательства** — нужен прямой доступ к странице.
- **Закрытые конфиденциальные данные с OpenAI API** — утечка данных при отправке embedding.
- **Real-time** — индексация не моментальная.
- **Галлюцинации** — LLM может «выдумывать» цитаты; всегда проверяйте по ссылке.
- **Извлечение таблиц и графиков** — слабая сторона большинства embedding-моделей.

## Ограничения и риски

### Галлюцинации

LLM может сгенерировать ответ, не опирающийся на источники, или «подделать» цитату. Защита:

- Всегда включеная функция `cite_sources`.
- Проверка по ссылкам.
- Использование `groundedness`-метрик (RAGAS).

### Стоимость

Embedding 1 ГБ текста через OpenAI = ~$1–3. Для больших коллекций — десятки долларов на индексацию.

### Качество чанкинга

Границы чанков сильно влияют на качество. По умолчанию `by_sentence` с overlap 200 — хорошее начало.

### Язык

Embedding-модели обучены преимущественно на английском. Для русского языка используйте `intfloat/multilingual-e5-large` или OpenAI (multilingual).

### Извлечение текста

JavaScript-rendering (SPA) страницы могут не иметь текста после извлечения. WARC-GPT работает с HTML — для тяжёлого JS нужен предварительный WACZ с Browsertrix.

## Альтернативы

| Инструмент | Подход | Когда |
|:---|:---|:---|
| **[Perplexity AI](https://www.perplexity.ai/)** | Web search + LLM | Онлайн-источники, не WARC |
| **[Vectara](https://www.vectara.com/)** | SaaS RAG для бизнеса | Production |
| **[AnythingLLM](https://anythingllm.com/)** | Self-hosted RAG-UI | Desktop-использование |
| **[PrivateGPT](https://github.com/imartinez/privateGPT)** | 100% local RAG | Максимальная приватность |
| **[metawarc-mcp](https://github.com/ruarxive/metawarc-mcp)** | MCP-сервер для LLM-агентов | Интеграция с Cursor, Claude Desktop |

## Ruarxive и WARC-GPT

В Ruarxive metawarc уже индексирует коллекции для AI-агентов. Прямая интеграция с WARC-GPT — на стадии исследования:

- metawarc-stored DuckDB-каталог + embeddings = расширенный поиск.
- MCP-сервер вместо custom UI — интеграция с любыми LLM-агентами.

Подробности: [metawarc MCP](/kb/instruments/ruarxive-tools/metawarc-mcp).

## Ресурсы

- [WARC-GPT GitHub](https://github.com/harvard-lil/warc-gpt)
- [Harvard LIL — про WARC-GPT](https://lil.law.harvard.edu/blog/2025/08/warc-gpt/)
- [RAG-архитектура](https://docs.ray.io/en/latest/serve/llm-serving/llm-rag.html)
- [ChromaDB documentation](https://docs.trychroma.com/)
- [Trafilatura для извлечения текста](https://trafilatura.readthedocs.io/)

## Связанные материалы

- [metawarc MCP](/kb/instruments/ruarxive-tools/metawarc-mcp)
- [DuckDB-WARC](/kb/instruments/tools/duckdb-warc) — SQL-альтернатива.
- [Warchaeology](/kb/instruments/tools/warchaeology) — для валидации.
- [Ландшафт 2026](/kb/instruments/landscape-2026) — где AI-агенты в анализе.
- [WARC-файл: формат](/kb/instruments/file-formats/warc)
- [metawarc](/kb/instruments/ruarxive-tools/metawarc) — Ruarxive DuckDB-индекс.
