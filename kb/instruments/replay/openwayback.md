---
title: OpenWayback
sidebar_label: OpenWayback
description: "OpenWayback — Java-реализация Wayback Machine, которую поддерживал IIPC. Проект больше не развивается; IIPC рекомендует переход на pywb."
last_update:
  date: 2026-10-12
---

# OpenWayback

:::warning Проект больше не развивается
В README репозитория прямо сказано: «OpenWayback is no longer under active development». Последний релиз — 2.4.0 (май 2019). Для воспроизведения веб-архивов [IIPC рекомендует](https://netpreserveblog.wordpress.com/2020/12/16/openwayback-to-pywb-transition-guide/) [pywb](/kb/instruments/replay/pywb), а в документации pywb есть [руководство по переходу с OpenWayback](https://pywb.readthedocs.io/en/latest/manual/owb-transition.html). Для новых установок выбирайте pywb.
:::

**OpenWayback** — открытая Java-реализация Wayback Machine, которую развивал IIPC (International Internet Preservation Consortium). Долгое время это было стандартное ПО для воспроизведения в национальных веб-архивах.

## Описание

OpenWayback — веб-приложение на Java (WAR-файл для контейнера сервлетов), которое показывает архивные страницы из WARC/ARC-файлов по CDX-индексу.

### Особенности

*   **Классический интерфейс Wayback**: поиск по URL и календарь снимков.
*   **Форматы**: WARC и ARC.
*   **CDX-индексы**: поиск снимков по CDX-файлам; отдельный модуль CDX-сервера (`wayback-cdx-server`).
*   **Memento**: поддерживается.

## Установка

### Требования

*   Java и Maven (в `pom.xml` указан уровень языка Java 7).
*   Контейнер сервлетов с API `javax.servlet` — например, Tomcat 8 или 9. Tomcat 10 и новее (`jakarta.*`) не подходит.
*   CDX-индексы для WARC-файлов.

### Сборка

1. Скачайте код или релиз с [GitHub](https://github.com/iipc/openwayback).
2. Соберите проект:
```bash
mvn clean package
```
3. Разверните полученный WAR-файл в Tomcat.

## Настройка

OpenWayback настраивается XML-файлами Spring (`wayback.xml`, `CDXCollection.xml` и др.), а не простым конфигом. Описание параметров — в [wiki проекта](https://github.com/iipc/openwayback/wiki). Если вы переносите существующую установку на pywb, соответствие настроек описано в разделе [OpenWayback → pywb: configuration](https://pywb.readthedocs.io/en/latest/manual/owb-to-pywb-config.html).

### Создание CDX-индексов

Для OpenWayback нужны индексы в классическом формате CDX. Их можно построить, например, утилитой [cdxj-indexer](https://github.com/webrecorder/cdxj-indexer) в режиме CDX11:

```bash
pip install cdxj-indexer
cdxj-indexer -11 --sort /path/to/warcs/*.warc.gz > index.cdx
```

## Использование

После развёртывания интерфейс доступен по адресу, который задан в настройках (часто `http://localhost:8080/wayback/`). Введите URL в строку поиска и выберите дату в календаре.

## Сравнение с pywb

| Функция | OpenWayback | pywb |
| :--- | :--- | :--- |
| Язык | Java | Python |
| Установка | WAR в Tomcat + Spring-конфигурация | `pip install pywb` или Docker |
| WACZ | ❌ | через `wb-manager add --unpack-wacz` |
| Memento | ✅ | ✅ |
| Развитие | остановлено (последний релиз 2019 года) | активное |

### Когда OpenWayback ещё встречается

*   Существующие установки, которые пока не перенесли на pywb.
*   Исторические инструкции и конфигурации национальных архивов.

Во всех остальных случаях используйте pywb.

## Ресурсы

*   [GitHub-репозиторий](https://github.com/iipc/openwayback)
*   [Wiki с документацией](https://github.com/iipc/openwayback/wiki)
*   [Руководство по переходу на pywb](https://pywb.readthedocs.io/en/latest/manual/owb-transition.html)
*   [Объявление IIPC о переходе (2020)](https://netpreserveblog.wordpress.com/2020/12/16/openwayback-to-pywb-transition-guide/)

## Связанные материалы

- [pywb — рекомендуемая замена](/kb/instruments/replay/pywb)
- [Формат CDX](/kb/instruments/file-formats/cdx)
- [Формат WARC](/kb/instruments/file-formats/warc)
