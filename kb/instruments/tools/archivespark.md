---
title: ArchiveSpark
sidebar_label: ArchiveSpark
description: "ArchiveSpark — фреймворк на Apache Spark (Scala) для распределённой обработки веб-архивов: загрузка WARC/ARC через CDX, фильтрация по метаданным и извлечение текста."
last_update:
  date: 2026-10-12
keywords: [archivespark, spark, scala, hadoop, warc-processing]
---

# ArchiveSpark

[ArchiveSpark](https://github.com/internetarchive/archivespark) — фреймворк на Scala для обработки веб-архивов и других архивных коллекций на [Apache Spark](https://spark.apache.org/). Автор — Helge Holzmann; проект начинался в исследовательском центре L3S (Ганновер) и продолжился в Internet Archive. Лицензия — MIT.

Главная идея ArchiveSpark — сначала фильтровать записи по лёгким метаданным из CDX-индекса (URL, время, MIME-тип, HTTP-статус), а затем читать из WARC только нужные записи и «обогащать» их (извлекать текст, заголовки, ссылки, сущности).

## Когда использовать

✅ Подходит, если:

- у вас есть **кластер Hadoop/Spark** (или мощная машина для `local[*]`) и большие коллекции WARC;
- нужно **извлекать текст, заголовки и ссылки** из большого числа страниц;
- нужны **фильтры по MIME-типу, HTTP-статусу, URL и времени** до чтения содержимого;
- требуется интеграция с существующим Spark-пайплайном (RDD, MLlib).

❌ Не подходит:

- для небольших архивов — на одной машине проще [metawarc](/kb/instruments/ruarxive-tools/metawarc), [warchaeology](/kb/instruments/tools/warchaeology) или [DuckDB](/kb/instruments/tools/duckdb-warc);
- если нет готовности разворачивать Spark и работать со Scala.

## Установка

Варианты из документации проекта:

- **Готовые JAR-файлы.** Сборки `archivespark-assembly-<версия>.jar` и `archivespark-assembly-<версия>-deps.jar` публикуются на [странице релизов](https://github.com/helgeho/ArchiveSpark/releases) (последний тегированный релиз — 3.0.1, сентябрь 2019 года; есть также сборка `latest-SNAPSHOT` 2024 года). Их кладут в папку библиотек Spark или Jupyter-ядра.
- **Maven Central** — для использования как библиотеки в sbt-проекте (опубликованы сборки для Scala 2.11):

  ```scala
  libraryDependencies += "com.github.helgeho" % "archivespark_2.11" % "3.0.1"
  ```

- **Docker-образ с Jupyter** — [ArchiveSpark-docker](https://github.com/helgeho/ArchiveSpark-docker).
- **Сборка из исходников** (нужны Scala 2.12 и sbt):

  ```bash
  git clone https://github.com/internetarchive/archivespark.git
  cd archivespark
  sbt assembly
  ```

> Примеры сверены с документацией в `docs/` репозитория `internetarchive/archivespark` (релиз 3.0.1, октябрь 2026).

## Использование

Пример по документации (`docs/General_Usage.md`): загрузка коллекции по CDX и WARC, фильтрация HTML-страниц со статусом 200, извлечение заголовков и текста, сохранение в JSON.

```scala
import org.archive.webservices.archivespark._
import org.archive.webservices.archivespark.functions._
import org.archive.webservices.archivespark.specific.warc._

val cdxPath = "/data/cdx/*/*.cdx.gz"
val warcPath = "/data/warc"
val rdd = ArchiveSpark.load(WarcSpec.fromFiles(cdxPath, warcPath))

val filtered = rdd.filter(r => r.status == 200 && r.mime == "text/html")

val TitleText = HtmlText.of(Html.first("title"))
val enriched = filtered.enrich(TitleText).enrich(HtmlText)

enriched.saveAsJson("result.json.gz")
```

Для загрузки нужны CDX-индексы к WARC-файлам. Если их нет, в документации есть рецепт генерации CDX (ноутбук `Generating_CDX.ipynb` в разделе Recipes).

При запуске документация рекомендует всегда указывать параметры Spark `--conf spark.serializer=org.apache.spark.serializer.KryoSerializer --conf spark.executor.userClassPathFirst=true`.

## Преимущества

- **Распределённость** — горизонтальное масштабирование на кластере.
- **Ленивое чтение** — фильтрация по CDX до чтения WARC экономит ввод-вывод.
- **Воспроизводимость** — результат в JSON содержит происхождение каждого поля (какие функции его получили).

## Недостатки

- **Сложность развёртывания**: нужны Java, Scala, Spark, при работе на кластере — Hadoop/YARN.
- **Медленное развитие**: последний тегированный релиз — 3.0.1 (2019 год), изменения в репозитории вносятся эпизодически; сообщество небольшое.

## Связанные материалы

- **[Warchaeology](/kb/instruments/tools/warchaeology)** — простые сканеры WARC.
- **[metawarc](/kb/instruments/ruarxive-tools/metawarc)** — извлечение метаданных из WARC на одной машине.
- **[DuckDB и WARC](/kb/instruments/tools/duckdb-warc)** — анализ WARC через SQL.

## Ссылки

- [Документация ArchiveSpark](https://github.com/internetarchive/archivespark/tree/master/docs).
- H. Holzmann, V. Goel, A. Anand. *ArchiveSpark: Efficient Web Archive Access, Extraction and Derivation*. JCDL 2016.
