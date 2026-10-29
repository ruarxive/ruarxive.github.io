---
title: "spcrawler: выгрузка данных сайтов на SharePoint"
sidebar_label: spcrawler (SharePoint)
description: "Утилита командной строки для выгрузки объектов и списков публичных сайтов на Microsoft SharePoint через REST API /_api/web в JSON Lines. Не развивается с 2022 года."
sidebar_position: 2
last_update:
  date: 2026-10-12
---

# spcrawler: выгрузка данных сайтов на SharePoint

:::warning Проект не развивается
Последний коммит в основную ветку — 21 апреля 2022 года, на PyPI единственная версия 1.0.1. Команда `getfiles` в этой версии не реализована (функция пустая), поэтому файлы утилита не скачивает.
:::

[spcrawler](https://github.com/ruarxive/spcrawler) — утилита командной строки для резервного копирования данных публичных сайтов на [Microsoft SharePoint](https://learn.microsoft.com/ru-ru/sharepoint/dev/sp-add-ins/get-to-know-the-sharepoint-rest-service). Она обращается к REST API SharePoint по адресу `<сайт>/_api/web` и сохраняет объекты и списки сайта в файлы JSON Lines.

Признак сайта на SharePoint — адреса страниц вида `/SitePages/....aspx` или `/Pages/....aspx`; само расширение `.aspx` ещё ничего не значит, его использует любой сайт на ASP.NET. Проверить, есть ли открытый API, можно командой `ping`. В README в качестве примеров приведены сайт Финансового университета (`fa.ru`) и `asutk.ru`; доступен ли у них API сейчас, мы не проверяли.

- Репозиторий: [github.com/ruarxive/spcrawler](https://github.com/ruarxive/spcrawler) · Лицензия: MIT · Язык: Python

## Установка

```bash
pip install --upgrade pip setuptools
pip install --upgrade spcrawler
```

README указывает Python 3.6 или новее.

> Команды сверены с README и `--help` версии 1.0.1 (октябрь 2026).

## Команды

Синтаксис: `spcrawler <команда> --url URL [-v]`. Справка — `spcrawler <команда> --help`.

| Команда | Что делает |
| :--- | :--- |
| `ping` | Запрашивает `URL/_api/web` и сообщает, доступен ли API |
| `walk` | Печатает список разделов сайта (отложенных ссылок `__deferred`) из ответа `/_api/web` |
| `dump` | Выгружает объекты, списки и данные из API в файлы JSON Lines в каталог `<домен>/data` |
| `getfiles` | В версии 1.0.1 ничего не делает |

## Примеры

```bash
# Проверить, доступен ли API
spcrawler ping --url https://asutk.ru

# Посмотреть разделы сайта
spcrawler walk --url http://fa.ru

# Выгрузить данные в fa.ru/data/
spcrawler dump --url http://fa.ru
```

## Формат результата

`dump` создаёт каталог с именем домена и подкаталог `data/`. Для каждого раздела API пишется файл `<раздел>.jsonl`; для записей с вложенными списками создаются подкаталоги `<раздел>/<id>/` с отдельными JSONL-файлами. Опции выбора выходного каталога нет.

## Ограничения

- Работает только с сайтами, где `/_api/web` открыт без авторизации.
- Файлы (документы, изображения) не скачиваются: `getfiles` не реализован. Ссылки на файлы из выгруженных JSONL можно скачать [filegetter](/kb/instruments/ruarxive-tools/filegetter), а вид страниц сохранить краулером с записью в WARC, например [wget](/kb/instruments/tools/wget) с `--warc-file`.
- При повторном запуске `dump` уже существующие JSONL-файлы пропускаются, поэтому прерванную выгрузку можно продолжить, а для полной повторной выгрузки нужно удалить каталог `<домен>/data`.

## Связанные материалы

- [Загружаемые данные](/kb/instruments/downloaded-data)
- [Инструменты Ruarxive](/kb/instruments/ruarxive-tools)
- [SharePoint REST API (документация Microsoft)](https://learn.microsoft.com/ru-ru/sharepoint/dev/sp-add-ins/get-to-know-the-sharepoint-rest-service)
