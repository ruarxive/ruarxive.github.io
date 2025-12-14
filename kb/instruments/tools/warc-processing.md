# Инструменты обработки WARC

Работа с "сырыми" WARC-файлами часто требует написания скриптов для извлечения данных, фильтрации записей или валидации. Для этого существует несколько мощных библиотек.

## Python Библиотеки

### warcio

[warcio](https://github.com/webrecorder/warcio) — наиболее популярная и современная библиотека для потокового чтения и записи WARC-файлов.

*   **Преимущества**: Поддержка стандартов, хорошая документация, создана Webrecorder.
*   **Использование**:

```python
from warcio.archiveiterator import ArchiveIterator

with open('my-archive.warc.gz', 'rb') as stream:
    for record in ArchiveIterator(stream):
        if record.rec_type == 'response':
            print(record.rec_headers.get_header('WARC-Target-URI'))
```

### fastwarc

[fastwarc](https://github.com/chatnoir-eu/fastwarc) — высокопроизводительная библиотека, написанная на C++ с Python-биндингами (Cython).

*   **Преимущества**: Значительно быстрее warcio, поддерживает сжатие LZ4.
*   **Недостатки**: Сложнее в установке (требует компиляции/бинарников).

## Утилиты командной строки

### warc-tools

Классический набор утилит, но многие из них устарели.

### cdx-tools

Инструменты для работы с CDX-индексами, часто используются в связке с pywb.

## Java Toolkits

### Heritrix Commons

Если вы работаете в Java-среде, библиотеки из проекта Heritrix предоставляют надежный функционал для парсинга WARC.

### warctools

[warctools](https://github.com/internetarchive/warctools) — классическая библиотека для работы с ARC и WARC файлами на Python.

*   **Преимущества**: Проверенная временем, множество утилит
*   **Недостатки**: Может быть медленнее современных альтернатив

### Warcat

[Warcat](https://github.com/chfoo/warcat) — инструмент и библиотека для работы с WARC файлами на Python.

*   **Особенности**: Простой API, поддержка стандартов

### Warcat-rs

[Warcat-rs](https://github.com/chfoo/warcat-rs) — версия Warcat на Rust.

*   **Преимущества**: Высокая производительность Rust
*   **Статус**: В разработке

## Java библиотеки

### jwarc

[jwarc](https://github.com/iipc/jwarc) — библиотека для чтения и записи WARC файлов на Java с типобезопасным API.

*   **Особенности**: Типобезопасность, хорошая документация

### Jwat

[Jwat](https://github.com/iipc/jwat) — набор библиотек для чтения/записи/валидации WARC/ARC/GZIP файлов на Java.

*   **Особенности**: Поддержка всех форматов, валидация
*   **Статус**: Стабильная версия

### Jwat-Tools

[Jwat-Tools](https://github.com/iipc/jwat-tools) — набор инструментов командной строки на основе Jwat.

*   **Функции**: Валидация, конвертация, анализ WARC файлов

## Node.js библиотеки

### node-warc

[node-warc](https://github.com/N0taN3rd/node-warc) — библиотека для парсинга и создания WARC файлов на Node.js.

*   **Особенности**: Работа с Electron или chrome-remote-interface
*   **Использование**: Создание WARC из браузерных сессий

### node-cdxj

[node-cdxj](https://github.com/N0taN3rd/node-cdxj) — парсер CDXJ файлов для Node.js.

*   **Использование**: Работа с индексами WARC

## Rust библиотеки

### warcdedupe

[warcdedupe](https://github.com/N0taN3rd/warcdedupe) — инструмент дедупликации WARC файлов на Rust.

*   **Преимущества**: Высокая производительность
*   **Статус**: В разработке

## Golang библиотеки

### webarchive

[webarchive](https://github.com/nlnwa/webarchive) — читатели для ARC и WARC форматов на Golang.

*   **Особенности**: Нативная поддержка Go

## Утилиты командной строки

### Unwarcit

[Unwarcit](https://github.com/webrecorder/unwarcit) — CLI инструмент для распаковки WARC и WACZ файлов.

*   **Использование**: Извлечение содержимого из архивов

```bash
pip install unwarcit
unwarcit archive.warc.gz output_directory/
```

## Обработка больших объёмов

### HadoopConcatGz

[HadoopConcatGz](https://github.com/helgeho/HadoopConcatGz) — Splitable Hadoop InputFormat для конкатенированных GZIP файлов (включая `*.warc.gz`).

*   **Использование**: Обработка WARC файлов в Hadoop/Spark кластерах

## Анализ больших данных

Для обработки терабайтов WARC-файлов (например, дампов Common Crawl) обычно используют:
*   **Apache Spark** (с библиотеками для чтения WARC).
*   **Athena / Presto** (AWS предоставляет возможность SQL-запросов к Common Crawl).
*   **HadoopConcatGz** для разделения WARC файлов в Hadoop

## Сравнение библиотек

| Библиотека | Язык | Скорость | Особенности | Рекомендация |
| :--- | :--- | :--- | :--- | :--- |
| **warcio** | Python | Средняя | Стандарты, документация | **Основной выбор для Python** |
| **fastwarc** | Python/C++ | Высокая | Cython, LZ4 | Для больших объёмов |
| **jwarc** | Java | Средняя | Типобезопасность | Для Java проектов |
| **Jwat** | Java | Средняя | Валидация, инструменты | Для валидации |
| **node-warc** | Node.js | Средняя | Браузерная интеграция | Для Electron приложений |
| **webarchive** | Golang | Высокая | Нативная поддержка | Для Go проектов |

## Практические примеры

### Извлечение всех URL из WARC

```python
from warcio.archiveiterator import ArchiveIterator

urls = []
with open('archive.warc.gz', 'rb') as stream:
    for record in ArchiveIterator(stream):
        if record.rec_type == 'response':
            url = record.rec_headers.get_header('WARC-Target-URI')
            urls.append(url)

print(f"Найдено {len(urls)} URL")
```

### Фильтрация записей по типу контента

```python
from warcio.archiveiterator import ArchiveIterator

html_pages = []
with open('archive.warc.gz', 'rb') as stream:
    for record in ArchiveIterator(stream):
        if record.rec_type == 'response':
            content_type = record.http_headers.get_header('Content-Type', '')
            if 'text/html' in content_type:
                html_pages.append(record.rec_headers.get_header('WARC-Target-URI'))
```

### Валидация WARC файла

```bash
# Используя Jwat-Tools
java -jar jwat-tools.jar validate archive.warc.gz

# Используя warcio (Python)
python -c "from warcio.archiveiterator import ArchiveIterator; list(ArchiveIterator(open('archive.warc.gz', 'rb')))"
```

## Связанные материалы

- [Формат WARC](/kb/instruments/file-formats/warc) — описание формата WARC
- [Формат CDX](/kb/instruments/file-formats/cdx) — индексация WARC файлов
- [Формат WACZ](/kb/instruments/file-formats/wacz) — упаковка WARC в WACZ
- [Инструменты воспроизведения](/kb/instruments/replay) — просмотр WARC архивов
- [Heritrix](/kb/instruments/tools/heritrix) — создание WARC файлов
