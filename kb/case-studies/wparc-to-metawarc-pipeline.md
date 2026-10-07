---
sidebar_position: 7
description: "Практический пайплайн: wparc собирает сайт на WordPress через REST API, metawarc индексирует коллекцию в DuckDB и поднимает локальный веб-replay"
---

# Пайплайн wparc → metawarc: от WP-сайта к индексируемому архиву

Кейс демонстрирует короткий и воспроизводимый сценарий, в котором два инструмента Ruarxive работают последовательно: **`wparc`** снимает сайт на WordPress через REST API, а **`metawarc`** превращает результат в индексируемый каталог с метаданными, поиском и локальным веб-replay. Итог — архив, в котором можно искать фразу, видеть PDF рядом с HTML-страницей, на которой они лежали, и заходить на сайт «как он был».

## Задача

Небольшой муниципальный сайт на WordPress (`example.gov.ru`):

- 1 200 постов, 180 страниц, 3 400 медиафайлов (в основном PDF-документы и JPEG-фотографии).
- Открытый REST API: `https://example.gov.ru/wp-json/wp/v2/`.
- Сайт запланировано перевести на новую CMS и через 2 недели вывести из эксплуатации.

Цель: сохранить всё содержимое **до переезда** и предоставить исследователям и сотрудникам муниципалитета удобный доступ к архиву — с поиском по тексту, метаданными PDF и возможностью открыть любую страницу в браузере.

## Почему wparc, а не wget или Browsertrix

Сайт построен на стандартном WordPress и не использует JavaScript-рендеринг контента. Это означает, что:

- **wparc** отдаст чистые данные без навигации, рекламы и посторонней разметки. Один запрос `/wp/v2/posts?per_page=100` заменяет 100 заходов `wget`'а.
- **wget/Browsertrix** сохранят HTML-страницы, но без метаданных (авторы, теги, даты правок), и придётся потом парсить `meta`-теги, чтобы их восстановить.
- **wget** «зацепит» RSS-фид, административную панель, служебные эндпоинты — придётся фильтровать.
- **Browsertrix** здесь избыточен: нет ленивой загрузки и динамики, ради которой стоит тащить headless Chrome.

## Этап 1. Сбор через wparc

```bash
# 1.1 Проверяем доступность API
curl -I https://example.gov.ru/wp-json/wp/v2/posts
# → HTTP/2 200 — API открыт

# 1.2 Запускаем архивацию с резюмированием (на случай обрыва)
wparc https://example.gov.ru/ \
  --output ./wp-archive \
  --resume \
  --max-media-size 50M
```

`wparc` обходит `/posts`, `/pages`, `/media`, `/comments`, `/users`, `/categories`, `/tags`, скачивает медиа и сохраняет каждый объект JSON-ом с полными метаданными:

```
wp-archive/
├── posts/1.json
├── pages/about.json
├── media/45.jpg
├── media/46.pdf
├── comments.jsonl
├── authors.json
├── tags.json
├── categories.json
└── meta.json
```

**Время**: ~25 минут. **Объём**: 1.8 ГБ (1.1 ГБ — медиа, 0.7 ГБ — JSON).

## Этап 2. Упаковка в WARC

`wparc` сохраняет результат как набор JSON-файлов, а не WARC. Чтобы дальше работал `metawarc`, нужно представить каждый JSON как HTTP-ответ. Используем короткий Python-скрипт — 30 строк:

```python
# warcify.py
import json, pathlib
from warcio.warcwriter import WARCWriter
from io import BytesIO

archive = pathlib.Path("./wp-archive")
out = open("site.warc.gz", "wb")
writer = WARCWriter(out)

for path in sorted(archive.rglob("*.json")):
    if path.name in {"authors.json", "tags.json", "categories.json"}:
        continue
    payload = path.read_bytes()
    url = f"https://example.gov.ru/{path.relative_to(archive)}"
    record = writer.create_warc_record(
        url, "response",
        payload=BytesIO(payload),
        http_headers=(b"200 OK", [(b"Content-Type", b"application/json")]),
    )
    writer.write_record(record)

# И отдельно для бинарных медиа
for media in sorted((archive / "media").iterdir()):
    payload = media.read_bytes()
    mime = "application/pdf" if media.suffix == ".pdf" else "image/jpeg"
    url = f"https://example.gov.ru/wp-content/uploads/{media.name}"
    record = writer.create_warc_record(
        url, "response",
        payload=BytesIO(payload),
        http_headers=(b"200 OK", [(b"Content-Type", mime.encode())]),
    )
    writer.write_record(record)

out.close()
```

```bash
pip install warcio
python warcify.py
# → site.warc.gz (1.8 ГБ)
```

> **Совет.** Можно вместо WARC собрать всё через [wpull](https://github.com/ArchiveTeam/wpull) — он умеет ходить по ссылкам из sitemap.xml и складывать результат сразу в WARC. Для сайта с API wparc быстрее, для «скраулинга по ссылкам» wpull удобнее.

## Этап 3. Индексация через metawarc

```bash
# 3.1 Установка
pip install 'metawarc[all]'

# 3.2 Индексация коллекции (resumable, ~2-3 минуты)
metawarc index site.warc.gz \
  --dbfile site.db \
  --resume

# 3.3 Извлечение метаданных PDF + полнотекстовая индексация
metawarc index-content site.db \
  --exts pdf,docx,html \
  --text

# 3.4 Обзор коллекции
metawarc catalog --dbfile site.db
# → 1 200 постов, 180 страниц, 3 400 медиа, 412 PDF с метаданными

metawarc stats --dbfile site.db --mode mimes
# → application/pdf: 412 (1.2 ГБ)
# → image/jpeg:    2 980 (560 МБ)
# → text/html:     1 380 (140 МБ)
```

## Этап 4. Что получаем

### Поиск по фразе через `metawarc search`

```bash
metawarc search --dbfile site.db \
  --query "благоустройство набережной" \
  --limit 20
```

Возвращает ID записей, в извлечённом тексте которых встретилась фраза, со ссылкой на оригинальный URL и SHA-256 payload.

### Локальный веб-replay

```bash
metawarc serve --dbfile site.db --port 8000
# → http://127.0.0.1:8000/replay/2026-10-07T12:00:00Z/...
```

Любой сотрудник муниципалитета или исследователь открывает в браузере архивную версию страницы. Кириллица в URL отображается корректно.

### Метаданные PDF

```bash
metawarc list-files --dbfile site.db --mimes application/pdf
# Получить 412 PDF-ов с авторами, датами создания, числом страниц
metawarc dump --dbfile site.db --mimes application/pdf --output ./pdfs/
# Выгрузить выбранные PDF в ./pdfs/ с манифестом SHA-256
```

### REST API для дашборда

```bash
metawarc serve --dbfile site.db --port 8000
# → http://127.0.0.1:8000/api/collections
# → http://127.0.0.1:8000/api/records?mimes=application/pdf
```

Через REST-эндпоинты можно подключить дашборд, например [Grafana](https://grafana.com/) с JSON-API источником.

### MCP-сервер для AI-агентов

```bash
metawarc mcp --dbfile site.db
```

В Claude/Cursor/Continue добавляем одну строку в `mcp_config.json`, и агент получает безопасный read-only доступ к каталогу. Подробнее — на странице [metawarc MCP-интеграция](/kb/instruments/ruarxive-tools/metawarc-mcp).

## Этап 5. Публикация и верификация

```bash
# 5.1 Финальный архив: WARC + каталог + манифест
tar -czf example-gov-ruarxive-2026-10-07.tar.gz \
  site.warc.gz site.db site.db.data/ MANIFEST.sha256

# 5.2 Манифест контрольных сумм
sha256sum site.warc.gz site.db > MANIFEST.sha256

# 5.3 Документация к архиву — README.md
cat > README.md <<'EOF'
# Архив сайта example.gov.ru

Дата архивации: 2026-10-07
Снято: wparc 0.6.x → metawarc 2.0.x
Покрытие: 1 200 постов, 180 страниц, 3 400 медиа, 412 PDF
Объём: 1.8 ГБ (WARC), 47 МБ (DuckDB-каталог), 320 МБ (Parquet-сайдкары)
EOF
```

## Что даёт связка wparc → metawarc

| Аспект | wparc | metawarc | Вместе |
| :--- | :--- | :--- | :--- |
| **Сбор данных** | ✅ чистый JSON, метаданные | — | wparc |
| **Стандартный формат WARC** | — | ✅ читает и индексирует | metawarc |
| **Метаданные PDF/OOXML** | — | ✅ ExifTool + Pillow + python-docx | metawarc |
| **Поиск по тексту** | — | ✅ `search` | metawarc |
| **Локальный replay** | — | ✅ `serve` | metawarc |
| **REST API для дашбордов** | — | ✅ read-only | metawarc |
| **MCP для AI-агентов** | — | ✅ read-only, 7 типизированных tools | metawarc |
| **Объём коллекции** | 1.8 ГБ | 47 МБ каталог + 320 МБ сайдкары | без дублирования |

## Когда этот пайплайн не подходит

- **WordPress-сайт без открытого REST API** — возьмите [wpull](https://github.com/ArchiveTeam/wpull) и сразу получите WARC без `wparc`. Дальше — тот же `metawarc index`.
- **Сайт с рендерингом на JS (SPA, ленивая загрузка)** — [Browsertrix Crawler](/kb/instruments/tools/browsertrix) → WARC → metawarc.
- **Только метаданные без payload** — `wparc` сам по себе (без WARC) уже отдаёт всё нужное, metawarc не требуется.
- **Большие коллекции (>10M страниц)** — пайплайн работает, но `metawarc index` и `index-content` считаются часами; используйте SSD под `site.db` и `site.db.data/`.

## Команда одной строкой

Для повторных прогонов по расписанию (новые публикации):

```bash
wparc https://example.gov.ru/ --output ./wp-archive --resume && \
python warcify.py && \
metawarc ingest site.warc.gz --dbfile site.db --resume
```

`metawarc ingest` (а не `index`) дописывает новые записи в существующий каталог — старые ID не пересоздаются, инкрементально.

## Связанные материалы

- [wparc](/kb/instruments/ruarxive-tools/wparc) — инструмент сбора WordPress-сайтов
- [metawarc](/kb/instruments/ruarxive-tools/metawarc) — индекс, поиск, replay, REST, MCP
- [metawarc MCP-интеграция](/kb/instruments/ruarxive-tools/metawarc-mcp) — использование с AI-агентами
- [wpull](/kb/instruments/tools/wpull) — альтернативный сборщик в WARC
- [Browsertrix Crawler](/kb/instruments/tools/browsertrix) — для сайтов с JS
- [Формат WARC](/kb/instruments/file-formats/warc)
- [Гайд: сделать копию сайта на WordPress](/kb/instruments/howto-collect/make-copy-site-wordpress)
- [Кейс: комплексная архивация несколькими инструментами](/kb/case-studies/multi-tool-archiving)
