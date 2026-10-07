---
title: SolrWayback
sidebar_label: SolrWayback
description: Полнотекстовый поиск по WARC-файлам с веб-интерфейсом от Королевской библиотеки Дании, поддержка морфологии, фасетов и URL-воспроизведения
---

# SolrWayback

**SolrWayback** — веб-приложение от Королевской библиотеки Дании (Royal Danish Library) для **полнотекстового поиска и воспроизведения** WARC-файлов. Построен на Apache Solr, поддерживает морфологию для десятков языков, фасетный поиск, графики и интеграцию с pywb.

Сайт: [github.com/Det-Kongelige-Bibliotek/solrwayback](https://github.com/Det-Kongelige-Bibliotek/solrwayback)

## Зачем нужен

WARC-файл — это «мёртвые данные», пока не проиндексированы. Без индекса:

- Нельзя **найти документ** по слову.
- Нельзя **фильтровать** по дате, домену, типу контента.
- Нельзя **строить отчёты** (топ слов, топ доменов, распределение по датам).
- Нельзя делать **research-проекты** по корпусу архивов.

SolrWayback решает все эти задачи:

- **Полнотекстовый индекс** с морфологией.
- **Веб-интерфейс** с поиском, фасетами, графиками.
- **Воспроизведение страниц** через интеграцию с pywb.
- **Domain graphs** — графики связей между доменами.
- **Экспорт** результатов поиска.

Используется в:
- **Королевская библиотека Дании** (netarkivet.dk — национальный веб-архив Дании).
- **Британская библиотека** (UK Web Archive).
- **Европейские национальные архивы** (Iceland, Norway).

## Возможности

- **Полнотекстовый поиск** с морфологическим анализом.
- **Поддержка 30+ языков**: русский, английский, датский, немецкий, французский, украинский и др.
- **Фасетный поиск**: по домену, дате, типу контента, кодировке.
- **Графики**:
  - Распределение по годам.
  - Топ доменов.
  - Топ слов и N-gram.
  - Карты связей между доменами (domain graph).
- **Воспроизведение страниц** через pywb (iframe-интеграция).
- **URL-поиск** (поиск по конкретному URL в архиве).
- **CDX-интеграция** для навигации по датам.
- **Image-поиск** (по метаданным изображений).
- **Geo-поиск** (если в метаданных WARC есть координаты).
- **REST API** для интеграций.
- **Морфология** через Lucene/Solr анализаторы.

## Когда использовать

✅ Подходит для:

- **Research-проектов** по большому архиву (10k+ страниц).
- **Поиска** в национальных веб-архивах.
- **Аналитики**: тренды, топики, графы связей.
- **Библиотек и архивов** с собственным WARC-хранилищем.
- **Исследований** по сетевому пространству (domain graph).

❌ Не подходит для:

- **Маленьких архивов** (несколько WARC) — overkill, хватит pywb.
- **Простого воспроизведения** — pywb проще.
- **Real-time** (индексация занимает время).
- **Нераспределённого** (по умолчанию single-node Solr).

## Архитектура

```
┌──────────┐     ┌──────────────┐     ┌─────────────┐
│  WARC    │ ──▶ │  Solr Index  │ ◀── │ SolrWayback │
│  files   │     │  (Lucene)    │     │   Web UI    │
└──────────┘     └──────────────┘     └─────────────┘
                       ▲
                       │
                 ┌──────────┐
                 │  pywb    │
                 │  (replay)│
                 └──────────┘
```

SolrWayback не заменяет Solr — он **обёртка** вокруг Solr + pywb + CDX. Устанавливается рядом.

## Установка

### Docker Compose (рекомендуется)

```yaml
# docker-compose.yml
version: "3"
services:
  solr:
    image: solr:9
    ports:
      - "8983:8983"
    volumes:
      - solr-data:/var/solr
    command: solr-precreate netarchive

  solrwayback:
    image: detkbib/solrwayback:latest
    ports:
      - "8080:8080"
    environment:
      - SOLR_URL=http://solr:8983/solr/netarchive
      - WARC_SERVER=http://pywb:8080
    depends_on:
      - solr
      - pywb

  pywb:
    image: webrecorder/pywb:latest
    ports:
      - "8081:8080"
    volumes:
      - ./warcs:/data/warcs
      - ./cdxj:/data/cdxj
    command: pywb

volumes:
  solr-data:
```

```bash
docker-compose up -d
```

Web UI: `http://localhost:8080`.
Solr admin: `http://localhost:8983/solr/`.
pywb: `http://localhost:8081`.

### Из исходников

```bash
git clone https://github.com/Det-Kongelige-Bibliotek/solrwayback
cd solrwayback
./gradlew build
java -jar build/libs/solrwayback-*.war
```

### Зависимости

- **Java 11+**.
- **Apache Solr 8.x или 9.x** (с морфологическими компонентами).
- **pywb 2.x+** (для воспроизведения).
- **Минимум 4 ГБ RAM** для индексации 100k+ страниц.

## Использование

### Индексация WARC

```bash
# Используя утилиту от SolrWayback
java -jar solrwayback-tools.jar \
  --warc-dir /path/to/warcs \
  --solr-url http://localhost:8983/solr/netarchive
```

### Поиск в веб-интерфейсе

1. Открыть `http://localhost:8080/`.
2. Ввести запрос: `"выборы 2024" AND site:example.com`.
3. Получить результаты с фасетами, графиками, превью.
4. Кликнуть на результат → воспроизведение через pywb.

### Поддерживаемые синтаксисы запросов

```
# Простой поиск
climate change

# Фраза
"climate change"

# Wildcard
clim* change

# Boolean
elections AND (russia OR ukraine)

# По домену
site:example.com

# По типу контента
content_type:text/html

# По дате (диапазон WARC-Date)
warc_date:[2024-01-01 TO 2024-12-31]

# По языку
lang:ru

# Комбинация
"climate change" AND site:bbc.com AND warc_date:[2024-01-01 TO *]
```

### Domain Graph (граф доменов)

Вкладка **Domain Graph** → визуализация связей между доменами в архиве. Полезно для исследования «какие сайты ссылаются друг на друга».

### Image Search

Вкладка **Image Search** → поиск изображений по метаданным (alt, описание, размер, тип).

### Geo Search

Если в WARC есть гео-метаданные (через WARC-Tagged-Image-File-Format или в HTTP-заголовках), SolrWayback покажет карту.

### Экспорт результатов

- **JSON** — для скриптов.
- **CSV** — для Excel/Google Sheets.
- **BibTeX** — для научных работ.

## Конфигурация

### `solrwayback.conf` (или через env)

```ini
# Solr
SOLR_URL=http://localhost:8983/solr/netarchive

# pywb для воспроизведения
WARC_SERVER=http://localhost:8081

# Морфологические компоненты
LANGUAGES=ru,en,da,de,fr,uk

# Лимит выдачи
MAX_RESULTS=1000
```

### Solr schema (для русского)

SolrWayback поставляется с готовой схемой, поддерживающей русскую морфологию (стемминг Snowball + словари Lucene).

```xml
<!-- В custom solr configset -->
<fieldType name="text_ru" class="solr.TextField">
  <analyzer>
    <tokenizer class="solr.StandardTokenizerFactory"/>
    <filter class="solr.LowerCaseFilterFactory"/>
    <filter class="solr.SnowballPorterFilterFactory" language="Russian"/>
  </analyzer>
</fieldType>
```

## Сравнение с другими инструментами

| Инструмент | Полнотекст | Морфология | Графики | Воспроизведение | Сложность |
| :--- | :---: | :---: | :---: | :---: | :--- |
| **SolrWayback** | ✅ | ✅ 30+ языков | ✅ | ✅ через pywb | Высокая |
| **[pywb](/kb/instruments/replay/pywb)** | ⚠️ базовый | ❌ | ❌ | ✅ | Средняя |
| **[Shine](shine)** | ✅ | ✅ | ⚠️ | ✅ | Средняя |
| **[Archive.ph](archive-ph)** | ❌ | ❌ | ❌ | ✅ | Низкая |
| **Internet Archive (web.archive.org)** | ✅ | ✅ | ❌ | ✅ | — (SaaS) |

### Когда SolrWayback лучше всех

- **Большой архив** (миллионы страниц), нужен быстрый поиск.
- **Морфологический поиск** на русском/украинском/других языках с падежами.
- **Research-проект** по корпусу архивов (тренды, графы, аналитика).
- **Национальный веб-архив** или крупная библиотека.
- **Domain graph** — нужен для анализа связей.

### Когда лучше Shine

- Не хочется **Java/Solr** в стеке.
- Архив **поменьше** (тысячи страниц).
- Нужен **REST API** для интеграций.

### Когда лучше pywb

- Нужен **только сервер воспроизведения**, без поиска.
- Архив **небольшой** (десятки тысяч страниц).
- Хочется **минимальный стек** (только Python).

## Best practices

### 1. Морфологию настраивайте под язык корпуса

```bash
# В конфигурации Solr
# Русский: SnowballPorter Russian
# Украинский: SnowballPorter Ukrainian
# Немецкий: GermanLightStem
# Французский: FrenchLightStem
```

### 2. Индексируйте пакетно, не по одному WARC

```bash
# Параллельная индексация через 4 ядра
java -jar solrwayback-tools.jar \
  --warc-dir /path/to/warcs \
  --threads 4
```

### 3. Используйте CDX-индексы для URL-навигации

```bash
# Генерация CDX из WARC
warc-tools cdx -i archive.warc.gz > archive.cdx
```

### 4. Регулярно пересобирайте индекс

При добавлении новых WARC:

```bash
# Инкрементальное обновление
java -jar solrwayback-tools.jar --update

# Или полная переиндексация
java -jar solrwayback-tools.jar --rebuild
```

### 5. Настройте бэкап Solr

```bash
# Бэкап индекса
curl "http://localhost:8983/solr/netarchive/replication?command=backup&name=backup-$(date +%F)"
```

### 6. Используйте Solr Cloud для больших архивов

Single-node Solr справится с 10M документов. Для 100M+ — **Solr Cloud** с шардированием.

### 7. Ограничивайте размер индексируемого

```bash
# Пропустить большие медиа
java -jar solrwayback-tools.jar \
  --warc-dir /path/to/warcs \
  --max-content-size 10MB \
  --skip-content-types "video/*,audio/*"
```

## Ограничения

- **Java + Solr** — тяжёлый стек, минимум 4 ГБ RAM.
- **Сложная настройка** морфологии для каждого языка.
- **Медленная индексация** — 1000 страниц/сек на обычном железе.
- **Не полнотекст по картинкам** — только метаданные.
- **Большие WARC** (>10 ГБ) обрабатываются долго.
- **Domain Graph** визуализация тяжёлых графов (>10k доменов) — нужна оптимизация.

## Ресурсы

- [GitHub: SolrWayback](https://github.com/Det-Kongelige-Bibliotek/solrwayback) — исходный код.
- [Wiki](https://github.com/Det-Kongelige-Bibliotek/solrwayback/wiki) — подробная документация.
- [Netarchive.dk](https://netarkivet.dk/) — датский национальный архив, использующий SolrWayback.
- [UK Web Archive](https://www.webarchive.org.uk/) — британский архив на SolrWayback.
- [Solr Reference Guide](https://solr.apache.org/guide/) — официальная документация Solr.
- [Lucene Analysis](https://lucene.apache.org/core/) — для морфологии.

## Связанные материалы

- **[Shine](shine)** — Go-альтернатива с проще стеком.
- **[pywb](/kb/instruments/replay/pywb)** — для воспроизведения.
- **[WARC-processing](warc-processing)** — обработка WARC перед индексацией.
- **[Browsertrix](browsertrix)** — для создания WARC.
- **[Формат WARC](/kb/instruments/file-formats/warc)** — что внутри.
- **[Формат CDX](/kb/instruments/file-formats/cdx)** — для URL-навигации.
- **[Кейс: API-архивация в масштабе](/kb/case-studies/api-archiving-scale)** — большие архивы.
- **[Сравнения ресурсов](/kb/resources/comparisons)** — SolrWayback vs Shine vs pywb.
