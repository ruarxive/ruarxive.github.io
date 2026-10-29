---
title: F(b)arc
description: "F(b)arc — архивный (с 2018 года) инструмент для сохранения данных Facebook через Graph API. Описание по README и актуальные альтернативы."
last_update:
  date: 2026-10-12
keywords: [fbarc, facebook, graph-api, устаревшие]
---

# F(b)arc

:::warning Проект не поддерживается
Репозиторий [justinlittman/fbarc](https://github.com/justinlittman/fbarc) переведён в архив, последние изменения — январь 2018 года. С 2018 года Meta существенно ограничила Graph API: чтение публичного контента чужих страниц требует отдельного разрешения (Page Public Content Access) и проверки приложения. На практике инструмент неработоспособен.

Альтернативы: для собственных данных — [официальная выгрузка Facebook](/kb/instruments/data-take-out/dto-facebook); для публичных страниц — браузерная архивация через [Browsertrix](/kb/instruments/tools/browsertrix); для исследователей — Meta Content Library (см. [Facebook](/kb/instruments/social-media/facebook)).
:::

**F(b)arc** («b» не произносится) — инструмент командной строки и Python-библиотека для архивации данных Facebook через [Graph API](https://developers.facebook.com/docs/graph-api). Создан по образцу [twarc](/kb/instruments/social-media/twarc).

## Как он устроен

Данные Facebook представлены как граф:

- **узлы** — страницы, альбомы, фотографии и т. д., у каждого есть ID и тип;
- **поля** — атрибуты узла (имя, ID);
- **рёбра** — связи между узлами (например, фотографии страницы).

F(b)arc извлекает части графа по **определениям** (definitions) — конфигурационным файлам на Python, где для каждого типа узла указано, какие поля и рёбра запрашивать. Определения лежат в каталогах `definitions` и `local_definitions`.

## Установка

Пакета на PyPI нет (в README: «pip install coming once f(b)arc is more stable»). Установка из исходников:

```bash
git clone https://github.com/justinlittman/fbarc.git
cd fbarc
pip install -r requirements/requirements3.txt
python fbarc.py -h
```

## Использование (по README)

```bash
# Сохранить ключи приложения (app id, app secret) в ~/.fbarc
python fbarc.py configure

# Получить граф страницы на два уровня вглубь
python fbarc.py graph page 1191441824276882 --levels 2 --pretty > page.jsonl

# Все доступные поля и связи узла
python fbarc.py metadata 1191441824276882 --pretty

# URL запроса к Graph API для узла по определению
python fbarc.py url page 1191441824276882
```

Ключи можно передать и через переменные окружения `APP_ID`, `APP_SECRET`. Для просмотра собранного JSON в README описан локальный просмотрщик `fbarc_viewer.py`.

> Команды взяты из README последней версии репозитория (2018); работоспособность с текущим Graph API не проверялась.

## Ограничения

- Проект в архиве и не обновляется.
- Получение данных пользователей не поддерживается.
- Инкрементальная архивация невозможна (Graph API этого не позволяет, по словам автора).
- Доступ к публичному контенту чужих страниц требует разрешений, которые Meta выдаёт после проверки приложения.

## Ресурсы

- [GitHub-репозиторий (архив)](https://github.com/justinlittman/fbarc)
- [Facebook Graph API](https://developers.facebook.com/docs/graph-api)

## Связанные материалы

- [Facebook](/kb/instruments/social-media/facebook) — актуальные способы архивации
- [Как сохранить данные из Facebook](/kb/instruments/data-take-out/dto-facebook)
- [Архивация социальных сетей](/kb/instruments/social-media)
