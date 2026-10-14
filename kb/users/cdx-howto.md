---
title: Как найти страницу по CDX, не скачивая WARC
sidebar_label: Поиск по CDX
sidebar_position: 6
description: "Как по индексу CDX или CDXJ понять, есть ли нужный адрес в веб-архиве, и достать дату снимка, не скачивая файл на сотни гигабайт."
last_update:
  date: 2026-10-14
keywords: [cdx, cdxj, индекс, warc, поиск]
---

# Как найти страницу по CDX, не скачивая WARC

CDX — это оглавление веб-архива: одна строка на каждую сохранённую запись. По нему видно адрес, дату снимка и тип файла. Сам WARC для этого не нужен.

Полная легенда полей — в справочнике [CDX](/kb/instruments/file-formats/cdx). Здесь только приёмы, которыми пользуется читатель архива.

## Когда хватает индекса

- Нужно понять, попала ли страница в сбор.
- Нужна дата снимка для [цитаты](/kb/users/citation).
- WARC слишком большой, чтобы скачивать его «на всякий случай». У сайта «Эха Москвы» WARC занимает 186 234 035 346 байт, а индекс [echo.msk.ru.cdx.zip](https://f001.backblazeb2.com/file/IKPUBLIC/webcollect2022/echomskru2022/echo.msk.ru/echo.msk.ru.cdx.zip) — 2 749 923 байта.

Индекс не содержит текста страницы. Поиск по фразе — в статье [«Поиск внутри WARC»](/kb/users/search-inside-warc).

## Посмотреть индекс «Эха Москвы»

```bash
curl -L -o echo.msk.ru.cdx.zip \
  "https://f001.backblazeb2.com/file/IKPUBLIC/webcollect2022/echomskru2022/echo.msk.ru/echo.msk.ru.cdx.zip"
unzip -p echo.msk.ru.cdx.zip | head -5
```

Первая строка обычно начинается с `CDX` и перечисляет буквы полей. Дальше идут записи через пробел. Найти адрес:

```bash
unzip -p echo.msk.ru.cdx.zip | grep -F 'echo.msk.ru/programs/' | head
```

`-F` ищет буквальную строку, а не регулярное выражение. В выдаче будет исходный URL и метка времени вида `YYYYMMDDhhmmss`. Если в легенде есть буква `m`, рядом стоит MIME-тип (`text/html`, `audio/mpeg` и другие).

Тот же приём работает с любым CDX, который проект выложил рядом с WARC. Список файлов хранилища — в [`allarchives.csv`](https://cdn.ruarxive.org/public/allarchives.csv).

## Свой WARC: построить CDXJ

Если индекса нет, его можно собрать локально. Индексатор читает WARC один раз; дальше поиск идёт по текстовому файлу.

```bash
pip install cdxj-indexer

cdxj-indexer --sort archive.warc.gz > index.cdxj
grep -F 'example.com/about' index.cdxj
```

Строка CDXJ устроена так: ключ SURT, пробел, метка времени, пробел, JSON. Пример:

```
com,example)/about 20260601120005 {"url": "https://example.com/about", "mime": "text/html", "status": "200", "offset": "676", "filename": "archive.warc.gz"}
```

Ключ SURT переворачивает части домена: `https://www.example.com/about` становится `com,example)/about`. Поэтому все страницы одного сайта лежат рядом, а обычный `grep` по исходному URL всё равно находит строку: исходный адрес остаётся внутри JSON в поле `url`.

Классический одиннадцатипольный CDX (как у Internet Archive) пишется флагом `-11`:

```bash
cdxj-indexer -11 archive.warc.gz > index.cdx
```

> Команды `cdxj-indexer` сверены со справочником CDX в этой базе (пакет 1.5.0, октябрь 2026).

## Достать одну страницу, когда индекс уже есть

В JSON CDXJ есть смещение записи (`offset`). Тело ответа читается без прохода по всему файлу:

```bash
pip install warcio

offset=$(grep -F '"url": "https://example.com/about"' index.cdxj | head -1 | sed 's/.*"offset": "//; s/".*//')
warcio extract --payload archive.warc.gz "$offset" > page.html
```

Для архива на сотни гигабайт этот шаг имеет смысл только после того, как индекс подтвердил, что страница там есть. Как устроены большие файлы — в статье [«Большие WARC»](/kb/users/large-warc).

## Чего индекс не показывает

- Текста статьи, заголовка `title` и комментариев, если их нет в самом URL.
- Того, что страница «выглядела правильно»: код 200 бывает и у заглушки.
- Записей, которые краулер не записал. Пустой `grep` значит «в этом индексе адреса нет», а не «страницы никогда не существовало».

## Связанные материалы

- [Формат CDX и CDXJ](/kb/instruments/file-formats/cdx)
- [«Вскрытие» WARC](/kb/users/inspect-warc)
- [Проект «Эхо Москвы»](/kb/projects/echomsk)
- [Как цитировать архив](/kb/users/citation)
