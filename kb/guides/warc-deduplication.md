---
title: WARC-дедупликация — устранение дубликатов
sidebar_label: WARC-дедупликация
description: "Дедупликация WARC-файлов: алгоритмы, инструменты, влияние на размер. WARC-Payload-Digest, WARC revisit records, инструменты warchaeology, warc-dedup."
last_updated: 2026-11-09
keywords: [warc-dedup, deduplication, payload-digest, revisit-record, warchaeology]
---

# WARC-дедупликация — устранение дубликатов

Дедупликация WARC — это **ключевая операция для больших коллекций**, которая уменьшает размер без потери информации. В этой статье — алгоритмы, инструменты, реальные метрики экономии.

## Зачем нужна

| Сценарий | Что без дедупликации | С дедупликацией |
|:---|:---|:---|
| Один сайт пересохранился 100 раз за год | 100 копий одного HTML | 1 копия + 99 «revisit-записей» |
| Зеркало сайта | 10 полных копий | 1 полная + 9 ссылок |
| Коллекция из 100 сайтов с типовой главной | 100 копий почти одинакового HTML | Значительная экономия |
| Периодический сбор без deduplication | Рост коллекции × N | Рост коллекции × 0.5–0.8 |

**Типичные цифры:**

- Один сайт пересохраняется каждые 6 часов в экстренной архивации → 1460 копий/год.
- Если страница не менялась — реально полезна только 1 копия.
- Дедупликация сжимает 1460 копий до 1 копии + 1459 «отсылок» (`warc/revisit`).

## Виды дедупликации

### 1. По `WARC-Payload-Digest` (содержимое)

Самая распространённая. Идентичные тела ответов ⇒ одинаковый SHA-256 ⇒ одна запись остаётся, остальные превращаются в `revisit`.

```python
# Пример WARC-revisit записи
WARC/1.0
WARC-Type: revisit
WARC-Target-URI: https://example.com/page
WARC-Date: 2026-06-01T12:00:00Z
WARC-Payload-Digest: sha256:same_hash_as_original
WARC-Profile: http://iipc.github.io/warc-specifications/specifications/warc-format/warc-1.1/#revisit
Content-Length: 0
```

**Преимущества:**

- Точное определение «та же страница».
- Совместимо с WARC 1.1.

**Недостатки:**

- Заголовки HTTP могут различаться (Server, Date), а содержимое одинаковое.
- Изображения с изменённым URL (например, сегодня — `?v=2`) считаются разными.

### 2. По URL (дедупликация по дате)

Более агрессивная: считается, что один URL в разные даты — одна страница (только самая свежая остаётся).

**Преимущества:**

- Максимальное сжатие.
- Простая логика.

**Недостатки:**

- Теряем историю страницы.

### 3. По SURT (Sort-friendly URI Rewriting Transform)

URL нормализуются (lowercase, схема://хост → host,) и сравниваются без учёта регистра.

**Преимущества:**

- Один и тот же ресурс, разный URL — считается одним.

### 4. По хешу + метаданным

Hash + Content-Type + Content-Length. Используется в Common Crawl.

## Инструменты

### warchaeology.warc-dedup (рекомендуется)

[warchaeology](/kb/instruments/tools/warchaeology) — IIPC-инструмент с готовой реализацией.

```bash
# Посмотреть статистику дубликатов (без изменений)
warc-dedup --info *.warc.gz

# Полная дедупликация (создаёт новую коллекцию)
warc-dedup *.warc.gz -o deduplicated/

# Создать WARC-revisit записи (для pywb)
warc-dedup --revisit *.warc.gz -o deduplicated/
```

**Пример:**

```
Files: 12
Total records: 14567890
Unique payloads: 1235678
Reduction: 91.5%
```

### DuckDB-WARC для дедупликации через SQL

[DuckDB-WARC](/kb/instruments/tools/duckdb-warc) — гибкий вариант.

```sql
-- Найти все дубликаты по payload-digest
SELECT
    warc_payload_digest,
    COUNT(*) AS count,
    url,
    warc_date
FROM read_warc('archive.warc.gz')
WHERE warc_type = 'response'
GROUP BY warc_payload_digest
HAVING count > 1
ORDER BY count DESC
LIMIT 20;
```

```sql
-- Только одна запись из каждого кластера дубликатов
SELECT *
FROM (
    SELECT *,
        ROW_NUMBER() OVER (
            PARTITION BY warc_payload_digest
            ORDER BY warc_date DESC
        ) AS rn
    FROM read_warc('archive.warc.gz')
    WHERE warc_type = 'response'
)
WHERE rn = 1
```

### wacz-dedup (Webrecorder, встроено)

Webrecorder pywb имеет [deduplication встроенную](https://github.com/webrecorder/pywb/wiki/Deduplication).

```yaml
# pywb config.yaml
collections:
  my-collection:
    dedup:
      enabled: true
      algorithm: "payload-digest"
      # Можно настроить: similarity, suffix
```

### Internet Archive — Wayback Machine built-in

IA автоматически создаёт `revisit`-записи при повторном сохранении той же страницы.

### Common Crawl

Common Crawl использует [пайплайн cc-mr-job](https://github.com/commoncrawl/cc-mr-job) с автоматической дедупликацией по URL+content.

## Как работает дедупликация: пример

Вход: 3 записи в WARC.

```
1. URL=https://example.com/page, hash=abc123, date=2026-01-01
2. URL=https://example.com/page, hash=abc123, date=2026-02-01
3. URL=https://example.com/page, hash=def456, date=2026-03-01  # обновилась
```

После дедупликации:

```
1. URL=..., hash=abc123, date=2026-02-01 (самая свежая копия с этим хешем)
2. URL=..., hash=abc123, date=2026-01-01 → REVISIT запись
3. URL=..., hash=def456, date=2026-03-01 (новая страница)
```

**Экономия:** 1 полная запись → 1 + 2 revisit-записи.

При воспроизведении через [pywb](/kb/instruments/replay/pywb) с поддержкой WARC-revisit — пользователь увидит обе версии, как обычно.

## Особенности

### Не уменьшает, а пересортировывает

WARC-дедупликация не уменьшает количество уникальных записей, но убирает дубликаты **полезной нагрузки**. Полный WARC может уменьшиться в 2–10 раз.

### Compression vs Precision

- **Hash-based** — точная, сохраняет лишь одинаковое.
- **URL-based** — более грубая, может потерять изменения.
- **Similarity-based** (minhash, simhash) — n-граммы похожего текста; для похожих, но не идентичных.

## Метрики

| Размер коллекции | Типичная экономия |
|:---|:---|
| Один сайт, ежедневно | 5–20 % |
| Один сайт, ежечасно (без изменений) | 50–80 % |
| 100 сайтов с типовой главной | 30–50 % |
| Зеркала одного сайта | 70–95 % |
| Daily-зеркало региональной прессы | 40–60 % |

## Когда использовать

✅ Подходит:

- **Периодические архивы** (ежедневно/еженедельно).
- **Зеркала региональной прессы** (мало изменений, много копий).
- **Большие коллекции** (100 ГБ+).
- **Долгосрочное хранение** (экономия $$$).
- **Перед публикацией в pywb** — уже встроено.

❌ Не подходит:

- **Разовые архивы** — нет смысла, дубликатов не будет.
- **Очень часто меняющийся контент** — почти нет дубликатов.
- **Если нужна история страницы** — теряем «когда страница выглядела так».
- **WARC-revisit без полной записи** — pywb / OpenWayback нужны для воспроизведения.

## Anti-patterns

❌ **Удалять payload вместо создания revisit-record.** Тогда архив «не полный» — не показывает реальный размер.
❌ **Дедуплицировать по URL-префиксу** (например, удалять `/news/2` если есть `/news/1`). Это не дубликаты, это разные страницы.
❌ **Сохранять только URL + хеш** (без payload). Это не WARC, это какой-то суррогат.
❌ **Брать первую встречу, а не самую свежую.** Самая свежая часто и есть актуальная.

## Интеграция в pipeline Ruarxive

```
[wparc / Browsertrix]
    ↓
[warc-dedup --revisit]
    ↓
[WACZ-индексирование]
    ↓
[metawarc: построение DuckDB-каталога]
    ↓
[pywb публикация]
```

Каждый этап имеет свою цель:

- wparc / Browsertrix — собрать содержимое.
- warc-dedup --revisit — убрать дубли, сохранить историю.
- WACZ — упаковать для плеера.
- metawarc — обогатить каталог.
- pywb — обеспечить доступ.

## Сравнение инструментов

| Инструмент | Алгоритм | Формат | Когда |
|:---|:---|:---|:---|
| **warchaeology.warc-dedup** | payload-digest | WARC-revisit | Универсальный |
| **DuckDB-WARC + SQL** | настраивается | любой | Нестандартные правила |
| **pywb** | SimHash + payload | WARC | Встроено в плеер |
| **WARC-Safe** | — | — | Для контроля качества после |
| **pywb + SimHash** | similarity | WARC-revisit | Похожие страницы |

## Реальные сценарии

### Сценарий 1. Эхо Москвы — 173 ГБ → 80 ГБ

Исходные данные: ежедневная архивация 8 3 года подряд. Большинство страниц не менялись.

```bash
warc-dedup --revisit archive/*.warc.gz -o deduplicated-echo-warc/
```

**Результат:** с ~173 ГБ до ~80 ГБ WARC-revisit (экономия ~54 %).

### Сценарий 2. Telegram-каналы

Для [tgarc](https://github.com/ruarxive/tgarc) — каждый канал пересохраняется раз в сутки. Сообщения часто повторяются (мемы, новости).

Дедупликация по хешу медиа-файлов:

```python
# В tgarc это встроено
from tgarc import dedup

dedup.run(
    input_dir="/data/telegram-archives/",
    output_dir="/data/telegram-dedup/",
    hash_field="file_hash",
    by="sha256",
)
```

### Сценарий 3. Wayback Machine интеграция

При загрузке WARC в IA:

```bash
# Создать дедуплицированный WARC
warc-dedup --revisit my-archive.warc.gz -o my-archive-revisit.warc.gz

# Загрузить с метаданными
ia upload my-archive my-archive-revisit.warc.gz \
  --metadata "mediatype:web" \
  --metadata "collection:ruarxive"
```

IA сам поддерживает WARC-revisit при работе с поданными архивами.

## Ресурсы

- [Warchaeology — `warc-dedup`](/kb/instruments/tools/warchaeology)
- [DuckDB-WARC](/kb/instruments/tools/duckdb-warc)
- [WARC 1.1 revision records spec](https://iipc.github.io/warc-specifications/specifications/warc-format/warc-1.1/#revisit)
- [pywb deduplication](https://github.com/webrecorder/pywb/wiki/Deduplication)
- [cc-mr-job — дедупликация в MapReduce](https://github.com/commoncrawl/cc-mr-job)

## Связанные материалы

- [Warchaeology](/kb/instruments/tools/warchaeology) — набор утилит.
- [DuckDB-WARC](/kb/instruments/tools/duckdb-warc) — SQL-альтернатива.
- [WARC-файл: формат](/kb/instruments/file-formats/warc)
- [pywb](/kb/instruments/replay/pywb) — встроенная дедупликация.
- [WARC-файл: от сырого архива до публикации](/kb/guides/warc-workflow)
- [Обработка WARC — обзор](/kb/instruments/tools/warc-processing)
- [Работа с большими WARC](/kb/users/large-warc)
