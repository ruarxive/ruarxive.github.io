# CDX (Capture Index)

**CDX (Capture Index)** — это формат индексации для WARC файлов, который позволяет быстро находить записи в архивах без полного сканирования WARC файлов.

## Описание

CDX файлы содержат индексы записей в WARC файлах, позволяя быстро находить нужные записи по URL и дате без чтения всего WARC файла.

### Особенности

*   **Быстрый поиск**: Позволяет быстро находить записи по URL
*   **Компактность**: Индексы намного меньше самих WARC файлов
*   **Стандартизация**: Стандартный формат для индексации
*   **Интеграция**: Используется инструментами воспроизведения

## Структура CDX файла

### Формат записи

Каждая строка в CDX файле представляет одну запись:

```
N b a m s k r M S V g
```

Где:
- **N**: URL (нормализованный)
- **b**: Дата/время (YYYYMMDDhhmmss)
- **a**: Оригинальный URL
- **m**: MIME тип
- **s**: HTTP статус код
- **k**: SHA1 хеш
- **r**: Redirect URL
- **M**: META теги
- **S**: Смещение в WARC файле
- **V**: Версия CDX
- **g**: Имя файла WARC

### Пример записи

```
com,example)/ 20240101120000 http://example.com/ text/html 200 ABC123... - - 12345 1 archive.warc.gz
```

## Использование

### Создание CDX индекса

```bash
# Используя cdx-indexer
cdx-indexer archive.warc.gz > index.cdx

# Используя pywb
wb-manager index /path/to/warcs
```

### Поиск в CDX

```bash
# Поиск по URL
grep "example.com" index.cdx

# Использование cdx-toolkit
cdx-toolkit query index.cdx "http://example.com"
```

## Интеграция с инструментами

### OpenWayback

OpenWayback использует CDX файлы для быстрого поиска записей:

```xml
<wayback>
  <cdx-indexes>
    <index>
      <path>/path/to/index.cdx</path>
    </index>
  </cdx-indexes>
</wayback>
```

### PYWB

PYWB автоматически создаёт CDX индексы при индексации WARC файлов:

```bash
wb-manager index /path/to/warcs
```

### OutbackCDX

OutbackCDX — сервер CDX индексов, который может использоваться как backend для OpenWayback и PYWB.

## CDXJ формат

CDXJ (CDX JSON) — это расширение CDX формата с использованием JSON для метаданных:

```
com,example)/ 20240101120000 {"url":"http://example.com/","mime":"text/html","status":200}
```

### Преимущества CDXJ

*   Более гибкая структура метаданных
*   Поддержка дополнительных полей
*   Легче парсить программно

## Best practices

### Организация индексов

*   Создавайте отдельные индексы для разных коллекций
*   Регулярно обновляйте индексы при добавлении новых WARC файлов
*   Используйте сжатие для больших индексов

### Оптимизация

*   Используйте сортировку по URL для быстрого поиска
*   Разделяйте индексы по датам для больших архивов
*   Используйте CDXJ для гибких метаданных

## Практические примеры

### Создание CDX индекса с помощью pywb

```bash
# Установка pywb
pip install pywb

# Создание индекса для директории с WARC файлами
wb-manager init my-collection
wb-manager add my-collection /path/to/warc/files/

# Индексы будут созданы автоматически
```

### Поиск записей в CDX

```bash
# Используя grep для простого поиска
grep "example.com" index.cdx

# Используя cdx-toolkit для более сложных запросов
cdx-toolkit query index.cdx "http://example.com/*"
```

### Создание CDX из WARC с помощью warcio

```python
from warcio.archiveiterator import ArchiveIterator
import gzip

def create_cdx(warc_file, output_cdx):
    with open(output_cdx, 'w') as cdx:
        with open(warc_file, 'rb') as stream:
            for record in ArchiveIterator(stream):
                if record.rec_type == 'response':
                    url = record.rec_headers.get_header('WARC-Target-URI')
                    date = record.rec_headers.get_header('WARC-Date')
                    mime = record.http_headers.get_header('Content-Type', '')
                    status = record.http_headers.get_statuscode()
                    
                    # Формат CDX: N b a m s k r M S V g
                    cdx.write(f"{url} {date} {url} {mime} {status} - - - 0 1 {warc_file}\n")

create_cdx('archive.warc.gz', 'index.cdx')
```

### Использование CDX для быстрого поиска

```python
def find_url_in_cdx(cdx_file, search_url):
    with open(cdx_file, 'r') as f:
        for line in f:
            if search_url in line:
                parts = line.strip().split()
                print(f"URL: {parts[0]}")
                print(f"Date: {parts[1]}")
                print(f"Status: {parts[4]}")
                return True
    return False

find_url_in_cdx('index.cdx', 'example.com/page')
```

## Связь с WARC

CDX индексы тесно связаны с WARC файлами:

*   **WARC файлы** содержат сами данные
*   **CDX файлы** содержат индексы для быстрого поиска
*   CDX указывает на смещения в WARC файлах
*   Инструменты воспроизведения используют CDX для навигации

## Ресурсы

*   [CDX формат спецификация](https://iipc.github.io/warc-specifications/specifications/cdx-format/)
*   [cdx-toolkit](https://github.com/internetarchive/cdx-toolkit)

## Связанные материалы

- [Формат WARC](/kb/instruments/file-formats/warc) — базовый формат веб-архивов
- [Формат WACZ](/kb/instruments/file-formats/wacz) — WACZ использует CDXJ для индексации
- [Инструменты воспроизведения](/kb/instruments/replay) — использование CDX для просмотра архивов
- [Обработка WARC](/kb/instruments/tools/warc-processing) — работа с WARC и создание индексов
