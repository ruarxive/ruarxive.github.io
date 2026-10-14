---
title: Crocoite
sidebar_label: Crocoite
description: "Crocoite — архивный краулер на headless Chrome, который писал WARC, снимок DOM и скриншот. Репозиторий закрыт в 2021 году; для новых сборов нужен Browsertrix."
last_update:
  date: 2026-10-14
keywords: [crocoite, chrome, warc, устаревшее]
---

# Crocoite

:::warning Репозиторий архивирован
[PromyLOPh/crocoite](https://github.com/PromyLOPh/crocoite) закрыт владельцем 25 апреля 2021 года. Последний push в основной ветке — 30 декабря 2019 года. Для нового сбора используйте [Browsertrix](/kb/instruments/tools/browsertrix).
:::

Crocoite снимал страницу через headless Chrome и писал WARC. Автор — Lars-Dominik Braun. Кроме сетевых ответов программа сохраняла снимок DOM после загрузки (HTML без выполнения скриптов при будущем просмотре) и полностраничный скриншот. Это ответ на то, что обычный HTTP-краулер не видит приложение, собранное на JavaScript.

Документация прямо описывает ограничение способа: исходные байты HTTP Crocoite не записывал, а восстанавливал ответ из событий Chrome. Кодировка текста приводилась к UTF-8. Тело ответа при перенаправлении из-за гонки могло не попасть в файл.

## Команда из документации проекта

Так запуск описан в [usage](https://6xq.net/crocoite/usage/) и в README. Chrome должен быть установлен заранее:

```bash
pip install crocoite pywb
crocoite http://example.com/ example.com.warc.gz
```

Без флага рекурсии сохраняется только адрес из командной строки. Глубина или префикс пути:

```bash
crocoite -r 1 https://example.com/ example.com.warc.gz
crocoite -r prefix https://example.com/dir/ example.com.warc.gz
```

`-j N` задаёт число одновременных страниц. Быстрый старт в том же README показывает старые команды pywb (`wb-manager`, `wayback`). Их не копируйте: актуальный запуск плеера — на странице [pywb](/kb/instruments/replay/pywb).

## Когда страница ещё полезна

Чтобы понять чужой WARC, снятый Crocoite до 2020 года: внутри могут быть записи со снимком DOM и скриншотом, а не только обычные HTTP-ответы. Для нового обхода тот же класс задач закрывает Browsertrix (поведения, профиль входа, WACZ).

## Связанные материалы

- [Browsertrix](/kb/instruments/tools/browsertrix)
- [Ландшафт веб-архивации, 2026](/kb/instruments/landscape-2026)
- [Площадки и инструменты, которые больше не развиваются](/kb/instruments/social-media/dead-platforms)
- [Документация Crocoite](https://6xq.net/crocoite/)
