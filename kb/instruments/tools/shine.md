---
title: Shine
sidebar_label: Shine
description: Современный полнотекстовый поиск по WARC-файлам на Go, REST API, воспроизведение через warc2html, легче SolrWayback
---

# Shine

**Shine** — современный полнотекстовый поиск и воспроизведение WARC-файлов, написанный на Go. Создан Internet Archive как **замена и упрощение SolrWayback** — меньше зависимостей, проще развёртывание, REST API из коробки.

Сайт: [github.com/InternetArchive/shine](https://github.com/InternetArchive/shine)

## Зачем нужен

SolrWayback — это **мощно**, но **тяжело**: Java + Solr + pywb + CDX-инструменты. Для средних архивов (10k–10M страниц) это overkill.

Shine — это:
- **Один Go-бинарник** вместо стека Java.
- **Встроенный поиск** через Bleve (Lucene-аналог на Go).
- **REST API** для интеграций.
- **Воспроизведение** через интегрированный warc2html.
- **Простая настройка** — без Solr-схем и морфологических конфигов.

Где незаменим:
- **Средние архивы** (10k–1M страниц).
- **Команды** с Go в стеке.
- **Быстрое развёртывание** без Java.
- **API-first** интеграции (собственные дашборды, отчёты).

## Возможности

- **Полнотекстовый поиск** через Bleve (Go-аналог Lucene).
- **Морфологический поиск** для английского, испанского, французского, немецкого, итальянского, португальского, русского (снежный стемминг), и др.
- **Фасетный поиск** по домену, дате, типу контента, коду ответа.
- **Воспроизведение** страниц через встроенный warc2html.
- **REST API** для всех операций.
- **CDX-генерация** на лету.
- **WARC-валидация**.
- **Web UI** — простой, но функциональный.
- **Поддержка WARC.gz, WACZ**.
- **Метаданные** в результатах поиска (title, даты, домен).
- **Подсветка найденного** в превью.

## Когда использовать

✅ Подходит для:

- **Средних архивов** (10k–10M страниц).
- **Команды с Go** в стеке.
- **Быстрого развёртывания** без Java.
- **API-first** интеграций.
- **Research-проектов** с относительно небольшими корпусами.

❌ Не подходит для:

- **Очень больших архивов** (>10M страниц) — для этого Solr Cloud.
- **Сложной морфологии** для экзотических языков.
- **Графиков** (Domain Graph, тренды) — для этого SolrWayback.
- **Production-grade** — проект ещё молодой (с 2022).

## Установка

### Готовый бинарник

```bash
# Скачать с GitHub Releases
curl -L https://github.com/InternetArchive/shine/releases/latest/download/shine-linux-amd64 \
     -o /usr/local/bin/shine
chmod +x /usr/local/bin/shine
```

### Docker

```bash
docker run --rm \
  -v $(pwd)/warcs:/warcs \
  -v $(pwd)/index:/index \
  -p 8010:8010 \
  internetarchive/shine \
  -warcDir /warcs \
  -indexDir /index \
  -addr :8010
```

### Go

```bash
go install github.com/InternetArchive/shine@latest
```

### Из исходников

```bash
git clone https://github.com/InternetArchive/shine
cd shine
go build -o shine .
```

## Использование

### CLI — индексация WARC

```bash
# Создать индекс из директории с WARC
shine -mode index \
       -warcDir /path/to/warcs \
       -indexDir /path/to/index

# Индексировать один файл
shine -mode index \
       -warcFile archive.warc.gz \
       -indexDir /path/to/index
```

### CLI — запуск сервера

```bash
shine -mode serve \
       -warcDir /path/to/warcs \
       -indexDir /path/to/index \
       -addr :8010
```

Открыть `http://localhost:8010/` — простой веб-интерфейс с поиском.

### REST API

```bash
# Поиск
curl "http://localhost:8010/search?q=climate+change&size=10"

# Получить конкретную страницу
curl "http://localhost:8010/page?url=example.com/article&date=2024-01-15" -o page.html

# Получить CDX-записи
curl "http://localhost:8010/cdx?url=example.com"

# Метаданные WARC
curl "http://localhost:8010/warc?id=archive-2024-01"
```

### Полнотекстовый запрос

```
GET /search?q=climate+change&size=10&from=0
```

Параметры:
- `q` — поисковый запрос.
- `size` — количество результатов (по умолчанию 10).
- `from` — offset для пагинации.
- `domain` — фильтр по домену.
- `fromDate`, `toDate` — диапазон дат.
- `contentType` — фильтр по MIME-типу.

### Воспроизведение

```bash
# Получить страницу из архива
curl "http://localhost:8010/replay?url=example.com/article&date=2024-01-15" -o page.html

# С заголовками
curl -I "http://localhost:8010/replay?url=example.com/article&date=2024-01-15"
```

### С Dockerfile

```dockerfile
FROM internetarchive/shine:latest

WORKDIR /data
VOLUME ["/data/warcs", "/data/index"]

EXPOSE 8010
ENTRYPOINT ["shine", \
  "-mode", "serve", \
  "-warcDir", "/data/warcs", \
  "-indexDir", "/data/index", \
  "-addr", ":8010"]
```

## Конфигурация

### Флаги CLI

```bash
shine -h
```

| Флаг | Описание | По умолчанию |
| :--- | :--- | :--- |
| `-mode` | `index` или `serve` | (обязательно) |
| `-warcDir` | Директория с WARC | `.` |
| `-indexDir` | Директория индекса | `./index` |
| `-addr` | Адрес HTTP-сервера | `:8010` |
| `-maxWarcSize` | Макс. размер WARC (МБ) | 10240 |
| `-corsOrigin` | CORS-Origin для API | `*` |
| `-language` | Язык морфологии (en, ru, ...) | `en` |
| `-shards` | Количество шардов индекса | 1 |
| `-replication` | Репликация индекса | 1 |

### Поддерживаемые языки морфологии

`ar`, `bg`, `ca`, `cz`, `da`, `de`, `el`, `en`, `es`, `eu`, `fa`, `fi`, `fr`, `ga`, `gl`, `hi`, `hu`, `hy`, `id`, `it`, `ja`, `ko`, `nl`, `no`, `pt`, `ro`, `ru`, `sv`, `tr`, `zh`.

### Переменные окружения

```bash
export SHINE_ADDR=:8010
export SHINE_WARC_DIR=/var/warcs
export SHINE_INDEX_DIR=/var/index
export SHINE_LANGUAGE=ru
```

## Сравнение с другими инструментами

| Инструмент | Язык | Морфология | Графики | API | Сложность |
| :--- | :--- | :---: | :---: | :---: | :--- |
| **Shine** | Go | ✅ 30+ | ❌ | ✅ REST | Низкая |
| **[SolrWayback](solrwayback)** | Java | ✅ 30+ | ✅ | ⚠️ | Высокая |
| **[pywb](/kb/instruments/replay/pywb)** | Python | ❌ | ❌ | ⚠️ | Средняя |
| **Common Crawl** | — | ✅ | ⚠️ | ✅ | — (SaaS) |
| **Internet Archive (web.archive.org)** | — | ✅ | ❌ | ✅ | — (SaaS) |

### Когда Shine лучше всех

- **Go в стеке** — нативная интеграция, единый язык.
- **Средний архив** (10k–1M страниц) — оптимальный размер.
- **Быстрое развёртывание** — один бинарник.
- **API-first** — REST из коробки.
- **Морфология** для основных языков (включая русский).

### Когда лучше SolrWayback

- **Очень большой архив** (10M+ страниц).
- **Графики** (domain graph, тренды).
- **Production-grade** стабильность (SolrWayback с 2017).

### Когда лучше pywb

- Только **воспроизведение** без поиска.
- Архив **небольшой** (до 100k страниц).

### Когда лучше Common Crawl

- Исследования **большого веба** (миллиарды страниц).
- **Готовый индекс** с морфологией и спам-фильтрацией.

## Best practices

### 1. Начинайте с маленького индекса для тестов

```bash
# Индексировать 10 WARC для проверки
shine -mode index -warcDir ./test-warcs -indexDir ./test-index

# Запустить сервер
shine -mode serve -warcDir ./test-warcs -indexDir ./test-index

# Проверить поиск
curl "http://localhost:8010/search?q=test"
```

### 2. Используйте язык морфологии для вашего корпуса

```bash
# Русский корпус
shine -mode serve -warcDir ./warcs -indexDir ./index -language ru

# Многоязычный (по умолчанию английский, но русский поддерживается)
```

### 3. WARC храните на быстром диске

Индексация медленная на HDD. Для 1M страниц — NVMe SSD.

### 4. Регулярно бэкапьте индекс

```bash
# Остановить Shine
# Скопировать index/
cp -r /var/index /var/index-backup-$(date +%F)
# Запустить Shine
```

### 5. Используйте обратный прокси (nginx/Caddy) для HTTPS

```nginx
server {
  listen 443 ssl;
  server_name archive.example.com;
  
  ssl_certificate /etc/letsencrypt/live/archive.example.com/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/archive.example.com/privkey.pem;
  
  location / {
    proxy_pass http://localhost:8010;
    proxy_set_header Host $host;
  }
}
```

### 6. Для production — отдельный пользователь

```bash
useradd -r -s /bin/false shine
chown -R shine:shine /var/warcs /var/index
sudo -u shine shine -mode serve ...
```

### 7. Мониторьте размер индекса

```bash
du -sh /var/index
# Типично: 30-50% от размера WARC
```

## Ограничения

- **Молодой проект** (с 2022) — меньше production-опыта, чем у SolrWayback.
- **Нет графиков** (Domain Graph, тренды).
- **Нет распределённого режима** (только single-node).
- **Морфология** — снежный стемминг, не словарный (как у Solr для русского).
- **WARC только до 10 ГБ** (по умолчанию), большие — нужна настройка.
- **Web UI** — минималистичный, не сравнить с SolrWayback.

## Ресурсы

- [GitHub: Shine](https://github.com/InternetArchive/shine) — исходный код.
- [Wiki](https://github.com/InternetArchive/shine/wiki) — документация.
- [Releases](https://github.com/InternetArchive/shine/releases) — бинарники.
- [Bleve (поисковый движок)](https://github.com/blevesearch/bleve) — основа Shine.
- [Internet Archive blog](https://blog.archive.org/) — новости проекта.

## Связанные материалы

- **[SolrWayback](solrwayback)** — для больших архивов и графиков.
- **[pywb](/kb/instruments/replay/pywb)** — для простого воспроизведения.
- **[WARC-processing](warc-processing)** — обработка WARC перед индексацией.
- **[Browsertrix](browsertrix)** — для создания WARC.
- **[Формат WARC](/kb/instruments/file-formats/warc)** — что внутри.
- **[Формат CDX](/kb/instruments/file-formats/cdx)** — для URL-навигации.
- **[Internet Archive CLI](internet-archive-cli)** — загрузка WARC на web.archive.org.
- **[Кейс: API-архивация в масштабе](/kb/case-studies/api-archiving-scale)** — большие архивы.
