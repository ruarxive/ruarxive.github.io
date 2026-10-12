---
title: tdl
sidebar_label: tdl (Telegram Downloader)
description: "tdl — консольный инструмент на Go для скачивания файлов из Telegram и экспорта сообщений каналов и чатов в JSON через MTProto."
last_update:
  date: 2026-10-12
---

# tdl (Telegram Downloader)

**tdl** — консольный инструмент и библиотека на Go для работы с Telegram через протокол MTProto: скачивание медиафайлов, экспорт сообщений в JSON, пересылка и загрузка файлов. Лицензия AGPL-3.0, проект активно развивается (версия 0.20.4, август 2026).

Сайт: [docs.iyear.me/tdl](https://docs.iyear.me/tdl/)
GitHub: [iyear/tdl](https://github.com/iyear/tdl)

## Особенности

* **Скорость**: многопоточная загрузка (потоки на файл и параллельные задачи).
* **Экспорт сообщений** канала или чата в JSON с фильтрами по времени, ID и полям сообщений.
* **Скачивание по ссылкам** на сообщения или по JSON-экспорту (своему или из Telegram Desktop).
* **Возобновление** прерванных загрузок.
* **Несколько аккаунтов** через пространства имён (`-n`).

Каналы и чаты с включённой защитой контента («запрет копирования и пересылки») — это ограничение, установленное владельцем. Учитывайте его и [правовые вопросы](/kb/legal/copyright), прежде чем сохранять такие материалы.

## Установка

### Скрипт (Linux/macOS)

```bash
curl -sSL https://docs.iyear.me/tdl/install.sh | sudo bash
```

### Пакетные менеджеры

```bash
# Homebrew
brew install telegram-downloader

# Windows (Scoop)
scoop bucket add extras
scoop install telegram-downloader

# Arch (AUR)
yay -S tdl
```

Для Windows есть также скрипт PowerShell: `iwr -useb https://docs.iyear.me/tdl/install.ps1 | iex`. Docker-образы — `iyear/tdl` и `ghcr.io/iyear/tdl`.

> Команды сверены с документацией docs.iyear.me/tdl (версия 0.20.4, октябрь 2026).

## Использование

### Авторизация

Каждое пространство имён (`-n`, по умолчанию `default`) — отдельный аккаунт Telegram.

```bash
# импорт сессии из установленного Telegram Desktop (с официального сайта)
tdl login
tdl login -p ЛОКАЛЬНЫЙ_КОД_ПАРОЛЬ        # если в Desktop задан код-пароль
tdl login -d /path/to/TelegramDesktop     # нестандартный путь к клиенту

# вход по QR-коду
tdl login -T qr

# вход по номеру телефона и коду
tdl login -T code

# второй аккаунт
tdl login -n work -T qr
```

### Скачивание по ссылкам

```bash
# одно или несколько сообщений
tdl dl -u https://t.me/telegram/193 -u https://t.me/telegram/194

# в свой каталог, 8 потоков на файл, 4 файла одновременно
tdl dl -u https://t.me/telegram/193 -d /path/to/dir -t 8 -l 4
```

### Экспорт канала и скачивание медиа

Экспорт сохраняет **описание сообщений в JSON**, а не сами файлы. По умолчанию в экспорт попадают только сообщения с медиа и без текста.

```bash
# все сообщения (включая без медиа) вместе с текстом
tdl chat export -c durov --all --with-content -o durov.json

# затем скачать медиа по экспорту
tdl dl -f durov.json -d ./durov-media
```

Полезные варианты экспорта:

```bash
# диапазон ID сообщений
tdl chat export -c durov -T id -i 100,500 -o part.json

# диапазон времени (Unix timestamp)
tdl chat export -c durov -T time -i 1665700000,1665761624 -o period.json

# последние 100 сообщений с медиа
tdl chat export -c durov -T last -i 100 -o last.json

# ответы (комментарии) к посту канала
tdl chat export -c durov --reply 123 -o comments.json
```

Скачать медиа можно и по JSON-экспорту из Telegram Desktop (Export chat history → JSON, без вложений): `tdl dl -f result.json`.

Канал задаётся по имени (`durov` или `@durov`), ID, публичной ссылке или номеру телефона. Пустой `-c` означает «Избранное».

## Сравнение с tgarc

| Характеристика | tdl | [tgarc](/kb/instruments/ruarxive-tools/tgarc) (Ruarxive) |
| :--- | :--- | :--- |
| **Язык** | Go | Python |
| **Статус** | Активно развивается | Не развивается с 2023 года |
| **Установка** | Бинарник, пакетные менеджеры | Из исходников (git) |
| **Основная цель** | Быстрая загрузка файлов, экспорт JSON | Архивация сообщений и метаданных канала |

Для загрузки больших объёмов файлов (видео, архивы) и экспорта сообщений лучше подходит `tdl`. tgarc описан на отдельной странице. Учтите, что проект не обновлялся с 2023 года и может не работать с текущими версиями библиотек Telegram.

## Ресурсы

- [Документация tdl](https://docs.iyear.me/tdl/)
- [GitHub: iyear/tdl](https://github.com/iyear/tdl)

## Связанные материалы

- [tgarc](/kb/instruments/ruarxive-tools/tgarc)
- [Data Take Out: Telegram](/kb/instruments/data-take-out/dto-telegram)
- [yt-dlp](/kb/instruments/tools/yt-dlp)
