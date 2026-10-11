---
title: Warchaeology — набор утилит для WARC-файлов
sidebar_label: Warchaeology
description: "Warchaeology — коллекция утилит для инспекции, манипуляции, дедупликации и валидации WARC-файлов от IIPC. Валидация соответствия WARC 1.1, статистика, transform."
last_updated: 2026-11-09
keywords: [warchaeology, warc, validation, deduplication, iipc, inspection]
---

# Warchaeology — набор утилит для WARC-файлов

[warchaeology](https://github.com/iipc/warchaeology) — набор Python-утилит от [IIPC](https://netpreserve.org/) для инспекции, валидации, дедупликации и преобразования WARC-файлов. Особенно полезен для больших коллекций, где нужен быстрый статистический отчёт или проверка соответствия стандарту.

> **Главная ценность:** это единственный инструмент, который даёт **формальную валидацию** WARC 1.1 и считает **полезную статистику коллекции** (распределение по доменам, MIME, кодам ответов).

## Установка

```bash
pip install warchaeology
```

Требования: Python 3.8+, нет специальных зависимостей кроме warcio.

## Список утилит

| Команда | Назначение |
|:---|:---|
| `warc-survey` | Общая статистика коллекции |
| `warc-dedup` | Дедупликация по WARC-Payload-Digest |
| `warc-validate` | Валидация соответствия WARC 1.1 |
| `warc-indexer-cdxj` | Построение CDXJ-индекса через pywb |
| `warc-filter` | Фильтрация записей по правилам |
| `warc-headers` | Чтение только заголовков без payload |
| `warc-size` | Подсчёт размера сжатого архива |

## warc-survey — статистика коллекции

```bash
warc-survey *.warc.gz > survey.csv
```

Вывод — таблица с полями:

```csv
file,total_records,response_records,html_count,pdf_count,image_count,video_count,json_count,other_count,compressed_bytes,uncompressed_bytes
archive-1.warc.gz,12345,11500,9000,1500,800,150,50,0,1234567890,4567890123
```

В сочетании с `csvkit` или DuckDB:

```bash
warc-survey *.warc.gz \
  | duckdb -c "SELECT * FROM read_csv_auto('/dev/stdin') ORDER BY response_records DESC"
```

Полезно для:

- Понимания, что внутри коллекции.
- Аудита перед публикацией.
- Метрик покрытия (HTML / PDF / images).

## warc-dedup — дедупликация

Дедупликация по `WARC-Payload-Digest` (обычно SHA-256). Полезно:

- Несколько одинаковых страниц в одной коллекции.
- Удаление «пустых» или дефолтных страниц.
- Снижение размера архива.

```bash
# Только информация о дубликатах
warc-dedup --info *.warc.gz

# Удалить дубликаты, записать в новую директорию
warc-dedup *.warc.gz -o deduplicated/
```

**Примеры:**

| Файл | До | После | Сжатие |
|:---|---:|---:|---:|
| `archive-1.warc.gz` | 1.2 ГБ | 850 МБ | 30 % |
| `archive-2.warc.gz` | 800 МБ | 500 МБ | 38 % |

Дедупликация **сохраняет** первый встреченный экземпляр и удаляет последующие идентичные записи.

**Алгоритмы:**

- **payload-based dedup** — по SHA-256 от тела ответа (по умолчанию).
- **WARC revisit records** — оставить de-duped страницы как `revisit` записи с указанием на оригинал.

```bash
# Создать архив с revisit-записями
warc-dedup --revisit input/*.warc.gz -o deduplicated/
```

Это уменьшает размер архива **без потери информации**.

## warc-validate — валидация WARC 1.1

```bash
warc-validate archive.warc.gz
```

Проверяет:

- Корректность WARC-заголовков.
- Соответствие длин в заголовке и теле записи.
- Валидность gzip-обёртки.
- Корректность Content-Type.
- Наличие обязательных полей.

**Коды возврата:**

| Код | Значение |
|:---:|:---|
| 0 | OK |
| 1 | Обнаружены ошибки |
| 2 | Ошибки аргументов |

**Пример:**

```
warc-validate: /data/archive.warc.gz
Reading /data/archive.warc.gz...
Found 12345 records.
Validating WARC format...
[OK] 12345 records, no errors.
```

Или с ошибками:

```
[ERROR] record #5678: missing WARC-Type
[ERROR] record #5680: declared length 1234 but actual 1235
Found 2 errors in 12345 records.
```

## warc-indexer-cdxj — индексирование

```bash
warc-indexer-cdxj *.warc.gz > all-archives.cdxj
```

Генерирует CDXJ-индекс (CDX + JSON Lines), который используется [ReplayWeb.page](/kb/instruments/replay/replayweb-page) и [pywb](/kb/instruments/replay/pywb).

**Выход:**

```
com,example)/ 20260101120000 {"url": "https://example.com/", "status": 200, ...}
com,example)/about 20260101120000 {"url": "https://example.com/about", "status": 200, ...}
```

## warc-filter — фильтрация

```bash
# Только 200-е ответы
warc-filter --response-code=200 input.warc.gz -o filtered.warc.gz

# Только HTML
warc-filter --content-type='text/html' input.warc.gz -o html-only.warc.gz

# Только с конкретного домена
warc-filter --url-prefix='https://example.com/' input.warc.gz -o domain.warc.gz

# Несколько фильтров
warc-filter --response-code=200 --content-type='text/html' \
  --url-prefix='https://example.com/news/' \
  input.warc.gz -o filtered.warc.gz
```

**Используется для подготовки** подмножеств коллекции для конкретных задач:

- «Только новостные страницы» для NLP.
- «Только 200-е ответы» для анализа.
- «Только PDF» для текстового анализа.

## warc-headers — только заголовки

```bash
# Быстрый листинг URL без payload
warc-headers *.warc.gz | head -100
```

**Использование:**

- Быстрая проверка содержимого без загрузки payload (ускорение 100×).
- Листинг URL для отчёта.
- Подготовка списка страниц для аудита.

Полезно в связке с `grep`:

```bash
warc-headers *.warc.gz | grep "WARC-Target-URI" | awk '{print $2}' > all-urls.txt
```

## warc-size — размер архива

```bash
warc-size *.warc.gz
```

Быстрый подсчёт сжатого и распакованного размера WARC-коллекции. Полезно для билд-отчётов и мониторинга.

## Workflow интеграции

### CI/CD для архивов

```bash
#!/bin/bash
# ci-archive.sh
set -e

ARCHIVE=$1
REPORT=$2

echo "[validate] $ARCHIVE"
warc-validate "$ARCHIVE" || exit 1

echo "[survey]"
warc-survey "$ARCHIVE" > "$REPORT/survey.csv"

echo "[headers]"
warc-headers "$ARCHIVE" | grep "WARC-Target-URI" | awk '{print $2}' > "$REPORT/urls.txt"

echo "[index]"
warc-indexer-cdxj "$ARCHIVE" > "$REPORT/index.cdxj"

echo "[done]"
```

### Подготовка подмножества для NLP

```bash
# Только HTML страницы
warc-filter --content-type='text/html' --response-code=200 \
  full-collection.warc.gz -o html-only.warc.gz

# Дедуплицированная версия
warc-dedup html-only.warc.gz -o html-unique.warc.gz

# Извлечь текст через trafilatura
ws=warctools-extract-text html-unique.warc.gz -o html-text.jsonl
```

## Сравнение с альтернативами

| Задача | warchaeology | warcio (Python) | DuckDB-WARC |
|:---|:-:|:-:|:-:|
| Подсчёт URL | ✅ | ✅ | ✅ |
| Валидация WARC | ✅ | ⚠️ базовая | ❌ |
| Дедупликация | ✅ | ⚠️ скрипт | ⚠️ SQL |
| Фильтрация по правилам | ✅ | ❌ | ⚠️ SQL |
| Извлечение payload | ❌ | ✅ | ⚠️ ограничено |
| Производительность | ✅ на 1 ГБ | ⚠️ Python | ✅✅ на 100 ГБ |

## Когда использовать

✅ Подходит:

- **CI/CD пайплайн** для автоматической валидации.
- **Аудит больших коллекций** перед публикацией.
- **Подготовка подмножеств** архива (только HTML, только PDF).
- **Статистические отчёты** для руководства или грантодателей.
- **Дедупликация** идентичных страниц в коллекции.

❌ Не подходит:

- **Real-time обработка** — это batch-инструмент.
- **Полнотекстовая индексация** — используйте SolrWayback / Shine / WARC-GPT.
- **Восстановление WARC из других форматов** — для конвертации используйте warc2zim / WARC-Safe.
- **Малые архивы** (< 100 МБ) — overhead инструмента не оправдан.

## Производительность

| Операция | 1 ГБ WARC | 10 ГБ WARC | 100 ГБ WARC |
|:---|:---|:---|:---|
| `warc-validate` | ~30 с | ~5 мин | ~50 мин |
| `warc-survey` | ~20 с | ~3 мин | ~30 мин |
| `warc-headers` | ~10 с | ~1 мин | ~10 мин |
| `warc-dedup` | ~1 мин | ~10 мин | ~2 часа |
| `warc-filter` | ~30 с | ~5 мин | ~50 мин |

Скорость линейная; в основном — ввод/вывод.

## Ресурсы

- [warchaeology GitHub](https://github.com/iipc/warchaeology)
- [IIPC blog](https://netpreserve.org/)
- [WARC 1.1 Specification](https://iipc.github.io/warc-specifications/)
- [warcio — низкоуровневая альтернатива](https://github.com/webrecorder/warcio)
- [DuckDB-WARC](/kb/instruments/tools/duckdb-warc) — SQL-альтернатива.

## Связанные материалы

- [WARC-файл: формат](/kb/instruments/file-formats/warc)
- [Обработка WARC — обзор](/kb/instruments/tools/warc-processing)
- [WARC-Safe — антивирус](/kb/instruments/tools/warc-safe)
- [WARC-файл: от сырого архива до публикации](/kb/guides/warc-workflow)
- [WARC-GPT](/kb/instruments/tools/warc-gpt) — AI-анализ.
- [DuckDB-WARC](/kb/instruments/tools/duckdb-warc) — SQL.
- [Ландшафт 2026](/kb/instruments/landscape-2026)
