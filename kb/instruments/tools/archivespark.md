---
title: ArchiveSpark
sidebar_label: ArchiveSpark
description: "Spark/Scala-фреймворк для распределённого анализа WARC и ARC — обработка миллионов записей на кластере Hadoop/Spark."
last_updated: 2026-10-12
keywords: [archivespark, spark, scala, hadoop, warc-processing]
---

# ArchiveSpark

[ArchiveSpark](https://github.com/internetarchive/archivespark) — Scala/Java-фреймворк, разработанный Internet Archive для **распределённой обработки WARC/ARC** на кластерах [Apache Spark](https://spark.apache.org/). Позволяет обрабатывать миллионы веб-захватов параллельно.

## Когда использовать

✅ Подходит, если:

- у вас **Hadoop/Spark-кластер** и десятки терабайт WARC;
- нужно **дедуплицировать, индексировать, извлекать текст** из больших коллекций;
- нужны **фильтры по MIME-типу, языку, статусу HTTP**, причём на уровне распределённой обработки;
- требуется интеграция с существующим Spark-пайплайном (DataFrames, MLib).

❌ Не подходит:

- для небольших архивов (на порядки проще использовать [metawarc](/kb/instruments/ruarxive-tools/metawarc) или [warchaeology](/kb/instruments/tools/warchaeology) на одной машине);
- если не хочется разворачивать Spark-кластер;
- для офлайн-обработки единичных WARC (лишние накладные расходы).

## Установка

Зависит от наличия Spark-кластера. Готовых бинарных релизов нет, собирается из исходников:

```bash
git clone https://github.com/internetarchive/archivespark.git
cd archivespark
sbt assembly
```

## Использование

### Базовый пример

```scala
import org.archive.archivespark.ArchiveSpark
import org.archive.archivespark.functions.partition.{CdxPartition, SparkPartition}
import org.archive.archivespark.suggest.ConcatenatedPrefixes

val archive = ArchiveSpark.load("hdfs:///data/warc/*.warc.gz")
val pages = archive.pages().filterByStatusCode(200)
val text = pages.flatMapValues(_.text.split("\\s+"))
val counts = text.countByValue()
```

### Подсчёт статистики по доменам

```scala
val byDomain = pages.mapValues(_.url.replaceAll("https?://([^/]+)/.*", "$1"))
                    .countByValue()
```

## Преимущества

- **Распределённость** — горизонтальное масштабирование.
- **Богатство операторов** — есть готовые фильтры, агрегации, экспорт в DataFrame.
- **Совместимость с экосистемой Spark** — ML, GraphX, сторонние библиотеки.

## Недостатки

- **Сложность деплоя**: требуется Java/Scala, spark-submit, настройки Hadoop.
- **Медленнее для разовых задач**: на маленьких архивах проще DuckDB.
- **Слабая актуальная поддержка**: проект Internet Archive развивает, но сообщество меньше, чем у Python-инструментов.

## Связанные материалы

- **[Warchaeology](/kb/instruments/tools/warchaeology)** — простые сканеры WARC.
- **[metawarc](/kb/instruments/ruarxive-tools/metawarc)** — Python-вариант для больших архивов в DuckDB.
- **[DuckDB-WARC](/kb/instruments/tools/duckdb-warc)** — анализ WARC через SQL.

## Источник

- [Публикация в Telegram-канале Ruarxive #61 (29.06.2022)](https://t.me/ruarxive/61).
