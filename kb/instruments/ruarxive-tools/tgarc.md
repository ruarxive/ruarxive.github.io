---
title: tgarc
sidebar_label: tgarc (Telegram)
description: "Утилита командной строки для выгрузки сообщений и медиа из каналов и чатов Telegram в JSONL через пользовательский аккаунт (Pyrogram). Проект не развивается с 2023 года."
last_update:
  date: 2026-10-12
---

# tgarc (Telegram)

:::warning Проект не поддерживается
Последний коммит в репозитории — 15 декабря 2023 года. tgarc построен на библиотеке [Pyrogram](https://github.com/pyrogram/pyrogram), репозиторий которой архивирован (последний выпуск на PyPI — 2.0.106, апрель 2023 года). Пакета tgarc на PyPI нет. Для новых задач рассмотрите официальный экспорт [Telegram Data Take-Out](/kb/instruments/data-take-out/dto-telegram) или [tdl](/kb/instruments/tools/tdl).
:::

**tgarc** — небольшая утилита командной строки, которая выгружает сообщения из каналов и чатов Telegram в формате JSON Lines и скачивает приложенные медиафайлы. Работает от имени вашего пользовательского аккаунта через Telegram API (MTProto) с помощью Pyrogram.

- Репозиторий Ruarxive: [github.com/ruarxive/tgarc](https://github.com/ruarxive/tgarc) — форк [github.com/AduchiMergen/tgarc](https://github.com/AduchiMergen/tgarc), код в обоих совпадает.
- Лицензия: CC0 1.0 · Язык: Python · Версия в `setup.py`: 0.1.4.

## Установка

Пакета на PyPI нет, устанавливайте из GitHub (как указано в README):

```bash
pipx install git+https://github.com/AduchiMergen/tgarc.git
# или
pip install git+https://github.com/AduchiMergen/tgarc.git
```

Зависимости: `pyrogram`, `tgcrypto`, `click`, `pick`. Минимальная версия Python в `setup.py` не указана.

> Команды сверены с README и `--help` версии 0.1.4 (октябрь 2026).

## Настройка

1. Создайте приложение на [my.telegram.org/apps](https://my.telegram.org/apps) и получите `api_id` и `api_hash`.
2. Выполните `tgarc configure` и введите `api_id` и `api_hash` по запросу.
3. Pyrogram запросит номер телефона и код подтверждения из Telegram.

Настройки и сессия хранятся в каталоге `~/.tgarc/`: файл `config` (INI с ключами `api_id`, `api_hash`), файл сессии Pyrogram и файл `update` с номерами последних выгруженных сообщений. Завершить сессию можно командой `tgarc logout`.

## Команды

| Команда | Что делает |
| :--- | :--- |
| `tgarc configure` | Сохраняет `api_id`/`api_hash` и выполняет вход в аккаунт |
| `tgarc save [OPTIONS] [SRC]...` | Выгружает каналы и чаты по имени, @username, идентификатору или ссылке |
| `tgarc logout` | Завершает сессию текущего пользователя |

### Опции `save`

| Опция | Описание |
| :--- | :--- |
| `-o, --output TEXT` | Каталог для результатов; по умолчанию создаётся `tgarc-<дата>_<время>` в текущем каталоге |
| `--input FILENAME` | Файл со списком каналов и чатов (по одному на строку) |
| `--update` | Выгрузить только сообщения, появившиеся после предыдущего запуска |
| `--video / --no-video` | Скачивать или нет видео (по умолчанию скачивает) |
| `--pictures / --no-pictures` | Скачивать или нет фотографии |
| `--files / --no-files` | Скачивать или нет остальные файлы (audio, document, sticker, animation, voice, video_note) |
| `--max-size INTEGER` | Максимальный размер одного файла в МБ |
| `--private` | Интерактивно выбрать диалоги из списка ваших чатов с включённой защитой содержимого |
| `--format [csv\|json]` | Формат сообщений; реализован только `json` (JSON Lines), `csv` вызывает ошибку |

## Примеры

```bash
# Выгрузить два канала с медиа
tgarc save varlamov tv2tomsknews -o ./tg-archive

# Только тексты сообщений, без медиа
tgarc save varlamov --no-video --no-pictures --no-files -o ./tg-text

# Список каналов из файла
tgarc save --input channels.txt

# Догрузить новые сообщения после прошлого запуска (в новый каталог)
tgarc save --update --input channels.txt -o ./tg-update-2026-10-12
```

## Формат результата

```text
tg-archive/
├── varlamov/                 # @username канала или его числовой ID
│   ├── messages.jsonl        # сообщения, по одному JSON-объекту Pyrogram в строке
│   ├── <file_unique_id>/     # каталог с одним скачанным медиафайлом
│   └── ...
└── tv2tomsknews/
    └── ...
```

Каждая строка `messages.jsonl` — сериализованный объект сообщения Pyrogram. Медиафайлы сохраняются в подкаталоги, названные по `file_unique_id`.

## Особенности и известные проблемы

- **Режим `--update` перезаписывает `messages.jsonl`.** В файл попадают только новые сообщения, поэтому для каждого обновления указывайте новый каталог `-o` (или не указывайте его: по умолчанию каталог создаётся с датой и временем).
- **Запуск без `--update` сбрасывает сохранённые позиции** в `~/.tgarc/update`: после него следующий `--update` начнёт с позиций только тех каналов, что были в последнем запуске.
- **`--max-size` в версии 0.1.4 падает с ошибкой** `TypeError` при выводе параметров запуска (в коде число складывается со строкой).
- Результат — JSON, а не WARC: открыть его в [pywb](/kb/instruments/replay/pywb) или проиндексировать [metawarc](./metawarc) нельзя.
- Работа идёт от имени вашего аккаунта: при частых запросах Telegram может временно ограничивать его (FloodWait).
- Сообщения, удалённые до запуска выгрузки, получить невозможно.

## Альтернативы

- **[Telegram Data Take-Out](/kb/instruments/data-take-out/dto-telegram)** — официальный экспорт из Telegram Desktop в JSON и HTML.
- **[tdl](/kb/instruments/tools/tdl)** — активно развиваемый загрузчик и экспортёр для Telegram.

## Связанные материалы

- [Все инструменты Ruarxive](/kb/instruments/ruarxive-tools)
- [Архивация Telegram-каналов (Data Take-Out)](/kb/instruments/data-take-out/dto-telegram)
- [Социальные сети: инструменты и подходы](/kb/instruments/social-media)
- [Цитирование архива Ruarxive](/kb/users/citation)
