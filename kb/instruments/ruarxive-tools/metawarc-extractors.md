---
title: metawarc — кастомные экстракторы и Plugin API
sidebar_label: metawarc extractors
sidebar_position: 8
description: "Plugin API metawarc для добавления собственных экстракторов форматов файлов. Архитектура ExtractorBase, регистрация в registry, тестирование и упаковка."
last_updated: 2026-11-09
---

# metawarc — кастомные экстракторы и Plugin API

metawarc v2.x поставляется с набором экстракторов «из коробки»: PDF, OOXML (DOCX/XLSX/PPTX), изображения, видео, аудио, шрифты, ссылки, plain-text. Для собственных форматов (например, региональных CAD-форматов или научных датасетов) можно реализовать свой экстрактор через Plugin API.

> **Когда это нужно:** вы работаете с «длинным хвостом» форматов или специфичной отрасли (кадастровые XML, медицинские DICOM с метаданными, CAD/DWG, особые научные журналы).

## Архитектура Extractor API

```
metawarc/
├── extractor/
│   ├── registry.py         # Реестр экстракторов
│   ├── pdf.py              # PdfExtractor (встроенный)
│   ├── text_pdf.py         # PdfTextExtractor
│   ├── text.py             # TextExtractor (HTML→plain text)
│   ├── office.py           # OoxmlExtractor (DOCX/XLSX/PPTX)
│   ├── text_ooxml.py       # OoxmlTextExtractor
│   ├── links.py            # LinkExtractor
│   ├── media.py            # MediaMetadataExtractor
│   └── record.py           # RecordMetadataExtractor
```

Все встроенные экстракторы наследуют общий базовый класс с интерфейсом `extract(record) → dict`.

## Базовый класс ExtractorBase

```python
# metawarc/extractor/base.py (упрощённо)
from abc import ABC, abstractmethod
from typing import Any, Optional

class ExtractorBase(ABC):
    """Базовый класс для всех экстракторов metawarc."""

    #: Какие MIME-типы обрабатывает
    handles_mimes: list[str] = []

    #: Какие расширения файлов обрабатывает (для fallback)
    handles_exts: list[str] = []

    @abstractmethod
    def extract(self, record: WarcRecord, record_id: str) -> dict[str, Any]:
        """Вернуть dict c извлечёнными метаданными. Ключи — стабильные."""
        raise NotImplementedError

    @classmethod
    def can_handle(cls, record: WarcRecord) -> bool:
        """Этот экстрактор умеет работать с такой записью?"""
        ct = record.http_headers.get_header("Content-Type", "").lower()
        return any(mime in ct for mime in cls.handles_mimes)


# Реестр всех встроенных экстракторов
from metawarc.extractor.registry import ExtractorRegistry
ExtractorRegistry.register(PdfExtractor)
ExtractorRegistry.register(OoxmlExtractor)
# ... и др.
```

## Написание своего экстрактора

### Пример: экстрактор для FB2 (FictionBook 2)

```python
# myplugin/fb2_extractor.py
from metawarc.extractor.base import ExtractorBase
from typing import Any
import xml.etree.ElementTree as ET
from dataclasses import dataclass

@dataclass
class FB2Metadata:
    title: str
    author: str
    genre: str
    lang: str
    words: int | None
    
    def to_dict(self) -> dict[str, Any]:
        return {
            "title": self.title,
            "author": self.author,
            "genre": self.genre,
            "language": self.lang,
            "word_count": self.words,
        }


class FB2Extractor(ExtractorBase):
    handles_mimes = ["application/x-fictionbook+xml", "application/fb2"]
    handles_exts = [".fb2"]

    def extract(self, record, record_id: str) -> dict[str, Any]:
        payload = record.content_stream().read()
        
        try:
            root = ET.fromstring(payload)
        except ET.ParseError:
            return {"error": "invalid-fb2"}
        
        # FB2 namespace
        ns = {"fb": "http://www.gribuser.ru/xml/fictionbook/2.0"}
        
        title = root.findtext(".//fb:book-title", namespaces=ns) or ""
        author = root.findtext(".//fb:author/fb:first-name", namespaces=ns) or ""
        last_name = root.findtext(".//fb:author/fb:last-name", namespaces=ns) or ""
        genre = root.findtext(".//fb:genre", namespaces=ns) or ""
        lang = root.findtext(".//fb:lang", namespaces=ns) or ""
        body_text = "".join(root.itertext())
        
        return {
            "kind": "fb2",
            "metadata": FB2Metadata(
                title=title,
                author=f"{author} {last_name}".strip(),
                genre=genre,
                lang=lang,
                words=len(body_text.split()),
            ).to_dict(),
        }
```

### Регистрация через setuptools entry_points

```python
# pyproject.toml вашего плагина
[project]
name = "metawarc-fb2-plugin"
version = "0.1.0"
dependencies = [
    "metawarc>=2.0",
]

[project.entry-points."metawarc.extractors"]
fb2 = "metawarc_fb2_plugin.fb2_extractor:FB2Extractor"
```

После установки плагина:

```bash
pip install metawarc-fb2-plugin
metawarc index-content --dbfile collection.db --kinds fb2
# metawarc автоматически обнаружит ваш экстрактор
```

### Регистрация программно (без entry_points)

```python
# В вашем CLI-скрипте или Jupyter
from metawarc.extractor.registry import ExtractorRegistry
from myplugin.fb2_extractor import FB2Extractor

# Зарегистрировать
ExtractorRegistry.register(FB2Extractor)

# Проверить
print(ExtractorRegistry.list_registered())
# ['pdf', 'ooxml', 'links', 'media', 'record', 'text', 'fb2']
```

## Шаблон для экстрактора

```python
from metawarc.extractor.base import ExtractorBase
from typing import Any
import json

class MyCustomExtractor(ExtractorBase):
    """Описание вашего экстрактора — что он делает."""

    handles_mimes = ["application/x-my-format"]
    handles_exts = [".myf"]

    def extract(self, record, record_id: str) -> dict[str, Any]:
        """Извлечь метаданные из record."""
        try:
            payload = record.content_stream().read()
            data = self._parse(payload)
            return {
                "kind": "myf",
                "metadata": {
                    "field_1": data.get("field_1"),
                    "field_2": data.get("field_2"),
                    "extracted_at": "2026-11-09T12:00:00Z",
                    "extractor_version": "1.0.0",
                },
            }
        except Exception as e:
            return {
                "kind": "myf",
                "error": str(e),
                "extracted_at": "2026-11-09T12:00:00Z",
            }

    def _parse(self, payload: bytes) -> dict:
        # Ваш парсер
        return json.loads(payload)
```

## Гарантии и контракты

metawarc соблюдает **несколько жёстких правил** для всех экстракторов:

### 1. Read-only

Экстрактор **никогда не модифицирует** исходный WARC. Только читает payload.

### 2. Bounded execution

```python
from metawarc.extractor.limits import ExtractionLimits

class MyExtractor(ExtractorBase):
    def extract(self, record, record_id):
        # Ограничить размер обрабатываемого payload
        if record.content_length > ExtractionLimits.MAX_PAYLOAD:
            return {"error": "payload-too-large", "size": record.content_length}
        # ...
```

### 3. Таймаут

metawarc устанавливает таймаут на каждый экстрактор (по умолчанию 60 с). Долгие операции приводят к `error: timeout`.

### 4. Возврат структурированного dict

```python
{
    "kind": "<short identifier>",
    "metadata": {
        "field_1": ...,
        "field_2": ...,
    },
    "extracted_at": ISO8601,
    "extractor_version": "semver",
}
```

Этот dict сохраняется в `*.data/<format>_metadata.parquet` и становится доступным через:

- `metawarc list-files` / `dump`
- `metadata_summary` через REST/MCP
- прямой DuckDB-запрос

### 5. Error handling

```python
return {
    "kind": "myf",
    "error": "human-readable message",
    "extracted_at": "2026-11-09T12:00:00Z",
}
```

metawarc **не падает** при ошибке экстрактора. Ошибки логируются и доступны через:

```sql
SELECT * FROM extraction_errors WHERE extractor = 'myf' AND error LIKE '%timeout%';
```

## Тестирование экстрактора

```python
# tests/test_fb2_extractor.py
from metawarc_fb2_plugin.fb2_extractor import FB2Extractor

def test_extract_metadata():
    # Используйте warcio для создания mock-record
    from warcio.warcwriter import WARCWriter
    import io
    
    fb2_content = b"""<?xml version="1.0"?>
    <FictionBook xmlns="http://www.gribuser.ru/xml/fictionbook/2.0">
        <description>
            <title-info>
                <genre>sci_humor</genre>
                <lang>ru</lang>
                <author><first-name>Alex</first-name><last-name>Test</last-name></author>
            </title-info>
        </description>
    </FictionBook>"""
    
    buf = io.BytesIO()
    writer = WARCWriter(buf)
    record = writer.create_warc_record(
        "https://example.com/book.fb2",
        "response",
        payload=fb2_content,
        warc_headers_dict={"Content-Type": "application/x-fictionbook+xml"},
    )
    writer.write_record(record)
    buf.seek(0)
    
    # Конвертируем обратно в ArchiveIterator record
    from warcio.archiveiterator import ArchiveIterator
    record = next(ArchiveIterator(buf))
    
    extractor = FB2Extractor()
    metadata = extractor.extract(record, "test_id")
    
    assert metadata["kind"] == "fb2"
    assert metadata["metadata"]["author"] == "Alex Test"
    assert metadata["metadata"]["lang"] == "ru"
```

## Упаковка и публикация плагина

### Структура проекта

```
metawarc-fb2-plugin/
├── pyproject.toml
├── README.md
├── src/
│   └── metawarc_fb2_plugin/
│       ├── __init__.py
│       └── fb2_extractor.py
└── tests/
    └── test_fb2_extractor.py
```

### pyproject.toml

```toml
[build-system]
requires = ["setuptools>=61"]
build-backend = "setuptools.build_meta"

[project]
name = "metawarc-fb2-plugin"
version = "0.1.0"
description = "FB2 (FictionBook) extractor for metawarc"
requires-python = ">=3.10"
dependencies = [
    "metawarc>=2.0",
]

[project.entry-points."metawarc.extractors"]
fb2 = "metawarc_fb2_plugin.fb2_extractor:FB2Extractor"

[project.optional-dependencies]
test = ["pytest"]

[tool.setuptools.packages.find]
where = ["src"]
```

### Публикация

```bash
# Тестируем локально
pip install -e .

# Публикуем в PyPI
python -m build
twine upload dist/*
```

После публикации пользователи:

```bash
pip install metawarc-fb2-plugin
metawarc index-content --kinds fb2  # автоматически обнаружит
```

## Когда это нужно

✅ Подходит для:

- **Специфичных форматов** отрасли (DICOM, CAD/DWG, FB2, ГИС-форматы).
- **Кастомных метаданных** для научных коллекций.
- **Внутренних форматов**, специфичных для вашей организации.
- **Экспериментальных ML-моделей** для извлечения метаданных.

❌ Не нужно для:

- **Стандартных форматов** — уже есть встроенные экстракторы.
- **Разовая обработки** — проще Python-скрипт.
- **Извлечения полного текста** — есть text и text_pdf.

## Список встроенных экстракторов

| Экстрактор | Kind | MIME | Что извлекает |
|:---|:---|:---|:---|
| `PdfExtractor` | pdf | application/pdf | title, author, pages, created/modified, size |
| `PdfTextExtractor` | text_pdf | application/pdf | Plain text (через pdfminer) |
| `OoxmlExtractor` | ooxmldocs | OOXML форматы | title, author, pages, dates, hyperlinks |
| `OoxmlTextExtractor` | text_ooxml | OOXML форматы | Plain text (через lxml) |
| `TextExtractor` | texts | text/* (HTML) | Plain text (через BeautifulSoup) |
| `LinkExtractor` | links | text/html | `<a href>` с rel/path |
| `MediaMetadataExtractor` | media | image/*, video/*, audio/* | Exif/ITU-T/RIFF метаданные |
| `FontExtractor` | fonts | font/* | Имя, формат, hash |
| `RecordMetadataExtractor` | record | any | HTTP-заголовки, размер, MIME |

## Ресурсы

- [metawarc (главная)](/kb/instruments/ruarxive-tools/metawarc)
- [metawarc docs: extractors](https://ruarxive.org/metawarc/architecture/extractors)
- [Python entry_points](https://packaging.python.org/en/latest/specifications/entry-points/)
- [W3C Media Types](https://www.iana.org/assignments/media-types/media-types.xhtml)

## Связанные материалы

- [metawarc cookbook](/kb/instruments/ruarxive-tools/metawarc-cookbook) — примеры использования.
- [metawarc REST API](/kb/instruments/ruarxive-tools/metawarc-rest) — экспорт метаданных.
- [metawarc MCP](/kb/instruments/ruarxive-tools/metawarc-mcp)
- [WARC-файл: формат](/kb/instruments/file-formats/warc) — структура данных.
- [Ландшафт 2026](/kb/instruments/landscape-2026)
