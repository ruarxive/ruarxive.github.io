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

## Анализ больших данных

Для обработки терабайтов WARC-файлов (например, дампов Common Crawl) обычно используют:
*   **Apache Spark** (с библиотеками для чтения WARC).
*   **Athena / Presto** (AWS предоставляет возможность SQL-запросов к Common Crawl).
