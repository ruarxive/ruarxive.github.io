---
sidebar_position: 3
---

# WARC

Формат архива [Web ARChive (WARC)](https://ru.wikipedia.org/wiki/Web_ARChive) определяет метод объединения нескольких цифровых ресурсов в совокупный архивный файл вместе с сопутствующей информацией.

Формат WARC является пересмотром формата ARC_IA File Format архива интернета [(Archive.org)](https://archive.org/), который традиционно использовался для хранения данных, собранных веб-краулерами (web crawler).

[Международный стандарт](https://iipc.github.io/warc-specifications/specifications/warc-format/warc-1.1/#general-1) определяет формат файла WARC:
- для хранения содержимого и управляющей информации из основных протоколов прикладного уровня интернета, таких как HTTP, DNS и FTP;
- для хранения метаданных, связанных с другими хранимыми данными (например, предметный классификатор, обнаруженный язык, кодировка);
- поддерживать сжатие данных и сохранять целостность записей данных;
- хранить всю управляющую информацию протокола сбора данных (например, заголовки запросов), а не только информацию об ответах;
- хранить результаты преобразования данных, связанные с другими хранимыми данными;
- хранить событие обнаружения дубликатов, связанное с другими хранимыми данными (для уменьшения объема хранения при наличии идентичных или по существу аналогичных ресурсов).

## Стандарт WARC

WARC формализован как **ISO 28500** стандарт. Текущая версия спецификации — **WARC 1.1**, которая поддерживается сообществом через [warc-specifications](https://iipc.github.io/warc-specifications/) на GitHub. Это открытый процесс, где можно предложить улучшения и новые функции формата.

### Версии формата

- **WARC 1.0** — первоначальная версия стандарта
- **WARC 1.1** — текущая версия с улучшениями и расширениями
- Спецификация доступна на [warc-specifications community](https://iipc.github.io/warc-specifications/specifications/warc-format/warc-1.1/)

## CDX индексы

CDX (Capture Index) — это формат индексации для WARC файлов, который позволяет быстро находить записи в архивах без полного сканирования WARC файлов.

### Связь WARC и CDX

- **WARC файлы** содержат сами данные (HTTP ответы, запросы, метаданные)
- **CDX файлы** содержат индексы для быстрого поиска записей в WARC
- CDX позволяет найти нужную запись по URL и дате без чтения всего WARC файла

### Использование CDX

CDX индексы используются инструментами воспроизведения (OpenWayback, PYWB) для быстрого поиска и отображения архивных версий страниц. Формат CDX также используется в WACZ архивах для индексации.

Подробнее о формате CDX: [CDX формат](/kb/instruments/file-formats/cdx)

Итоговый архив файлов может достигать более сотен гигабайт, поэтому сначала он может быть запакован в формат архива GZ или ZIP. Такие архивы можно открыть любым архиватором, поддерживающим ZIP и GZ файлы.


## ReplayWeb.page. Как открыть файл в формате WARC

Файлы в формате WARC можно открыть и просмотреть с помощью программы [ReplayWeb.page](https://github.com/webrecorder/replayweb.page) оффлайн.


## metawarc: Как обрабатывать файлы в формате WARC

[metawarc](https://github.com/datacoon/metawarc) — это инструмент командной строки (CLI) для обработки файлов WARC. Его цель — сделать взаимодействие CLI с файлами внутри архивов WARC настолько простым, насколько это возможно. Он представляет собой простую команду metawarc, которая позволяет извлекать метаданные из изображений, документов и других файлов внутри архивов WARC.

Документация: https://github.com/datacoon/metawarc


## Другие инструменты для работы с WARC файлами

Пакет инструментов для работы с файлами WARC (Web ARChive). Основан на Python. Некоторые команды:

- warcvalid — возвращает 0, если все аргументы являются действительными файлами WARC, ненулевое значение при ошибке.
- warcdump — пишет человекочитаемое резюме warcfiles. Автоопределяет формат входных данных при передаче имен файлов, т.е. recordgzip vs plaintext, WARC vs ARC.
- warcfilter — поиск всех заголовков по шаблону регулярных выражений (regex).
- и другие возможности.

Документация: https://github.com/internetarchive/warctools

## Практические примеры обработки WARC

### Валидация WARC файла

```bash
# Используя warcvalid из warctools
warcvalid archive.warc.gz

# Используя warcio (Python)
python -c "from warcio.archiveiterator import ArchiveIterator; list(ArchiveIterator(open('archive.warc.gz', 'rb')))"
```

### Просмотр содержимого WARC

```bash
# Используя warcdump
warcdump archive.warc.gz | head -100

# Просмотр только URL
warcdump archive.warc.gz | grep "WARC-Target-URI"
```

### Извлечение всех URL из WARC

```python
from warcio.archiveiterator import ArchiveIterator

urls = set()
with open('archive.warc.gz', 'rb') as stream:
    for record in ArchiveIterator(stream):
        if record.rec_type == 'response':
            url = record.rec_headers.get_header('WARC-Target-URI')
            if url:
                urls.add(url)

print(f"Найдено {len(urls)} уникальных URL")
for url in sorted(urls):
    print(url)
```

### Фильтрация записей по домену

```python
from warcio.archiveiterator import ArchiveIterator

target_domain = 'example.com'
matching_records = []

with open('archive.warc.gz', 'rb') as stream:
    for record in ArchiveIterator(stream):
        if record.rec_type == 'response':
            url = record.rec_headers.get_header('WARC-Target-URI', '')
            if target_domain in url:
                matching_records.append({
                    'url': url,
                    'date': record.rec_headers.get_header('WARC-Date'),
                    'content_type': record.http_headers.get_header('Content-Type', '')
                })

print(f"Найдено {len(matching_records)} записей для {target_domain}")
```

### Подсчет размеров по типам контента

```python
from warcio.archiveiterator import ArchiveIterator
from collections import defaultdict

sizes = defaultdict(int)
counts = defaultdict(int)

with open('archive.warc.gz', 'rb') as stream:
    for record in ArchiveIterator(stream):
        if record.rec_type == 'response':
            content_type = record.http_headers.get_header('Content-Type', 'unknown')
            # Упрощаем тип контента
            main_type = content_type.split(';')[0].split('/')[0] if '/' in content_type else 'unknown'
            length = int(record.rec_headers.get_header('Content-Length', 0))
            sizes[main_type] += length
            counts[main_type] += 1

print("Статистика по типам контента:")
for content_type in sorted(sizes.keys()):
    print(f"{content_type}: {counts[content_type]} записей, {sizes[content_type] / 1024 / 1024:.2f} MB")
```

## Связанные форматы

- [WACZ формат](/kb/instruments/file-formats/wacz) — современный формат упаковки веб-архивов на основе WARC
- [CDX формат](/kb/instruments/file-formats/cdx) — формат индексации для WARC файлов

## Связанные материалы

- [Обработка WARC](/kb/instruments/tools/warc-processing) — библиотеки и инструменты для работы с WARC
- [Инструменты воспроизведения](/kb/instruments/replay) — просмотр WARC архивов
- [Heritrix](/kb/instruments/tools/heritrix) — создание WARC файлов
- [Browsertrix](/kb/instruments/tools/browsertricks) — создание WARC/WACZ архивов
- [grab-site](/kb/instruments/tools/grab-site) — создание WARC файлов
