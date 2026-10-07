---
sidebar_position: 2
last_updated: 2026-10-07
---

# Как открыть WARC/WACZ файл

WARC и WACZ — стандартные форматы веб-архивов. Их можно открыть несколькими способами
без специальных знаний.

## Без установки (в браузере)

Самый простой способ — загрузить файл в онлайн-плеер.

### ReplayWeb.page

1. Откройте [replayweb.page](https://replayweb.page/).
2. Нажмите **«Load WACZ/WARC»**.
3. Выберите файл на компьютере.
4. Откроется интерфейс с сохранёнными страницами.

Поддерживаются `.wacz`, `.warc.gz`, `.warc`. Без отправки файлов на чужой сервер —
обработка полностью локальная.

### Через Internet Archive

Некоторые архивы Ruarxive уже загружены на Internet Archive и доступны через веб-плеер:

[archive.org/details/@ruarxive](https://archive.org/details/@ruarxive)

## С установкой программы

### WebRecorder Desktop

Графическое приложение для Windows/Mac/Linux:

1. Скачайте [WebRecorder Desktop](https://github.com/webrecorder/webrecorder-desktop/releases).
2. Установите и запустите.
3. Импортируйте WARC/WACZ файл.
5. Перейдите в режим просмотра.

### PyWebWayback (Python)

Для программного извлечения страниц:

```bash
pip install warcio
python3 -c "
from warcio.archiveiterator import ArchiveIterator
with open('archive.warc.gz', 'rb') as stream:
    for record in ArchiveIterator(stream):
        if record.rec_type == 'response':
            print(record.rec_headers.get_header('WARC-Target-URI'))
"
```

### Извлечение одного файла из WARC

```bash
# Установить warctools
pip install warctools

# Список всех URL в архиве
warcdump archive.warc.gz | head -20

# Извлечь конкретную запись
warcfilter --records archive.warc.gz --pattern 'echo.msk.ru'
```

## Чем отличаются WARC и WACZ?

- **WARC** — низкоуровневый формат, содержит сырые HTTP-ответы. Один файл — один архив,
  без метаданных и индексов.
- **WACZ** — ZIP-архив с WARC-файлами + индексами CDXJ + метаданными `datapackage.json`.
  Можно сразу открывать в плеере.

Подробнее:
- [Формат WARC](/kb/instruments/file-formats/warc)
- [Формат WACZ](/kb/instruments/file-formats/wacz)

## Что делать, если файл очень большой

Архивы вроде Эха Москвы (173 GB) целиком не помещаются в RAM. Варианты:

- **Стриминг через warcio** — Python читает архив порциями.
- **Просмотр через ReplayWeb.page** — плеер индексирует файл и работает с диска.
- **Выборочное скачивание** — смотрите CDX-индекс (список URL и их хеши), чтобы скачать только
  нужные страницы.