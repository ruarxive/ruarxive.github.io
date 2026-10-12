---
title: Как открыть WARC/WACZ файл
description: "Как открыть файлы веб-архивов WARC и WACZ: в браузере через ReplayWeb.page, в десктоп-приложении или из командной строки с помощью warcio и warctools."
sidebar_position: 2
last_update:
  date: 2026-10-12
---

# Как открыть WARC/WACZ файл

WARC и WACZ — стандартные форматы веб-архивов. Их можно открыть несколькими способами
без специальных знаний.

## Без установки (в браузере)

Самый простой способ — открыть файл в браузерном плеере.

### ReplayWeb.page

1. Откройте [replayweb.page](https://replayweb.page/).
2. Нажмите **Choose File…** и выберите файл на компьютере.
3. Нажмите **Load**.
4. Откроется интерфейс со списком сохранённых страниц и поиском по URL.

Поддерживаются `.wacz`, `.warc.gz`, `.warc` (а также HAR и CDX/CDXJ). Файл не отправляется на чужой сервер —
обработка полностью локальная. WARC при первом открытии читается целиком, поэтому большие WARC открываются
долго; WACZ открывается быстро. Подробнее — [ReplayWeb.page](/kb/instruments/replay/replayweb-page).

### Через Internet Archive

Некоторые архивы Ruarxive уже загружены на Internet Archive:

[archive.org/details/@ruarxive](https://archive.org/details/@ruarxive)

## С установкой программы

### ReplayWeb.page Desktop

Графическое приложение для Windows, macOS и Linux:

1. Скачайте установщик из [GitHub Releases](https://github.com/webrecorder/replayweb.page/releases) (`.exe`, `.dmg` или `.AppImage`).
2. Установите и запустите.
3. Откройте WARC/WACZ-файл.
4. Просматривайте страницы — без интернета.

Прежнее приложение Webrecorder Desktop больше не развивается (его репозиторий заархивирован); используйте ReplayWeb.page Desktop.

### warcio (Python)

Для программного просмотра содержимого — библиотека [warcio](https://github.com/webrecorder/warcio):

```bash
pip install warcio

# Список URL всех ответов в архиве
python3 -c "
from warcio.archiveiterator import ArchiveIterator
with open('archive.warc.gz', 'rb') as stream:
    for record in ArchiveIterator(stream):
        if record.rec_type == 'response':
            print(record.rec_headers.get_header('WARC-Target-URI'))
"

# Проверка целостности (дайджесты записей)
warcio check -v archive.warc.gz
```

### Извлечение части архива

```bash
# Установить warctools
pip install warctools

# Просмотр записей (заголовки и начало содержимого)
warcdump archive.warc.gz | head -40

# Отобрать записи по регулярному выражению для URL; результат — в stdout
warcfilter -U 'echo\.msk\.ru/programs/' archive.warc.gz > subset.warc
```

Флаги `warcfilter`: `-U` — по URL, `-T` — по типу записи, `-H` — по Content-Type HTTP-ответа, `-i` — инвертировать условие.
Больше приёмов — в статье [«Вскрытие» WARC](/kb/users/inspect-warc).

## Чем отличаются WARC и WACZ?

- **WARC** — низкоуровневый формат: последовательность записей с сырыми HTTP-ответами и запросами.
  Внутри бывают служебные записи `warcinfo` и `metadata`, но индекса для быстрого поиска нет —
  его строят отдельно.
- **WACZ** — ZIP-пакет с WARC-файлами, индексами CDXJ, списком страниц и метаданными `datapackage.json`.
  Плеер открывает его быстро, не читая весь архив.

Подробнее:
- [Формат WARC](/kb/instruments/file-formats/warc)
- [Формат WACZ](/kb/instruments/file-formats/wacz)

## Что делать, если файл очень большой

Например, WARC-файл сайта «Эха Москвы» занимает 186 234 035 346 байт (около 173 ГиБ). Целиком в память такие файлы не помещаются. Варианты:

- **Сначала посмотреть индекс.** Для архива «Эха» опубликован CDX-индекс (список URL и их хеши) —
  по нему можно понять, есть ли нужные страницы, не скачивая архив. См. [проект «Эхо Москвы»](/kb/projects/echomsk).
- **Потоковая обработка через warcio** — Python читает архив по одной записи.
- **Упаковка в WACZ** — тогда ReplayWeb.page не будет читать файл целиком.

Подробнее — [Работа с большими WARC-файлами](/kb/users/large-warc).
