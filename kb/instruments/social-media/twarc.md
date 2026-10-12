---
title: twarc — архивация Twitter/X через API v2
sidebar_label: twarc (Twitter/X)
description: "twarc — Python-библиотека и CLI для сбора данных Twitter/X; для API v2 используется команда twarc2. Статус доступа к API X на 2026 год, реальные команды и альтернативы."
last_update:
  date: 2026-10-12
keywords: [twarc, twarc2, twitter, x, api-v2, x.com]
---

# twarc — архивация Twitter/X через API v2

[twarc](https://github.com/DocNow/twarc) — Python-библиотека и инструмент командной строки проекта DocNow для сбора JSON-данных Twitter/X через официальный API. Пакет устанавливает две команды:

- **`twarc2`** — работа с **API v2** (актуальный API X);
- `twarc` — старая команда для API v1.1, который X больше не предоставляет.

:::warning Доступ к API X платный
- Бесплатный доступ к API и программа **Academic Research** (бесплатный полнотекстовый поиск по всему архиву для исследователей) закрыты в 2023 году.
- На октябрь 2026 года API X работает по модели **оплаты за использование**: кредиты покупаются заранее, стоимость списывается за каждый полученный объект (например, $0,005 за прочитанный пост), действует потолок в 3 млн прочитанных постов в месяц. Актуальные цены — на странице [X API pricing](https://docs.x.com/x-api/getting-started/pricing).
- Массовая архивация через API стоит дорого; для отдельных постов чаще достаточно [Wayback Machine](/kb/instruments/tools/wayback-api) или браузерной архивации.
:::

## Возможности

- **Полный JSON** — каждый ответ API сохраняется со всеми полями, по умолчанию с метаданными о том, когда и как собраны данные (отключается `--no-metadata`).
- **Обработка лимитов** — twarc сам ждёт сброса лимитов API.
- **Гидратация** — восстановление полных данных по списку ID твитов (`hydrate`) и обратная операция (`dehydrate`).
- **Плагины** — например, `twarc-csv` (команда `twarc2 csv`) для преобразования в CSV.

## Установка

```bash
pip install twarc
```

Версия 2.14.1 требует Python 3.13 или новее.

## Настройка

```bash
twarc2 configure
```

Команда интерактивно запрашивает ключи приложения из [X Developer Console](https://docs.x.com/x-api/introduction) и сохраняет их в файл конфигурации twarc. Ключ можно передать и через переменную окружения `BEARER_TOKEN` или параметр `--bearer-token`.

> Команды сверены с исходным кодом (`src/twarc/command2.py`) и `twarc2 --help` версии 2.14.1 (октябрь 2026).

## Команды twarc2

```bash
# Поиск за последние 7 дней
twarc2 search "climate change" results.jsonl

# Поиск по всему архиву (флаг --archive, нужен соответствующий уровень доступа)
twarc2 search --archive --start-time 2020-01-01 --end-time 2020-12-31 \
    "from:example" historical.jsonl

# Ограничить число сохранённых твитов
twarc2 search --limit 10000 "python" python.jsonl

# Недавние твиты пользователя (имя или ID)
twarc2 timeline example_user user-tweets.jsonl

# Один твит по ID или URL
twarc2 tweet 1234567890123456789 tweet.jsonl

# Ветка обсуждения по ID твита
twarc2 conversation 1234567890123456789 thread.jsonl

# Подписчики и подписки
twarc2 followers example_user followers.jsonl
twarc2 following example_user following.jsonl

# Твиты, которые понравились пользователю (нужен ID пользователя)
twarc2 liked-tweets 12345678 likes.jsonl

# Списки
twarc2 lists members 1234567890 members.jsonl
twarc2 lists tweets 1234567890 list-tweets.jsonl

# Поток по правилам фильтрации
twarc2 stream-rules add "lang:ru archive"
twarc2 stream --limit 1000 stream.jsonl
```

Основные параметры поиска и лент: `--start-time`, `--end-time`, `--since-id`, `--until-id`, `--limit`, `--max-results` (размер страницы ответа), `--archive`.

### Гидратация

```bash
# Извлечь ID твитов из набора данных
twarc2 dehydrate tweets.jsonl ids.txt

# Позже восстановить полные данные по файлу с ID (по одному в строке)
twarc2 hydrate ids.txt full-tweets.jsonl
```

Так обычно распространяют наборы данных о Twitter: публикуют только ID, а пользователи сами гидратируют их через API. Удалённые и скрытые твиты при этом не восстанавливаются.

### Плоский формат

Ответы API v2 приходят страницами: твиты в `data`, связанные пользователи и медиа — в `includes`. Команда `flatten` переносит связанные объекты внутрь каждого твита — по одному твиту на строку:

```bash
twarc2 flatten results.jsonl flat.jsonl
```

## Python API

```python
from twarc import Twarc2, expansions

t = Twarc2(bearer_token="YOUR_TOKEN")

# search_recent — последние 7 дней; search_all — весь архив (если доступен)
for page in t.search_recent("query", max_results=100):
    for tweet in expansions.ensure_flattened(page):
        print(tweet["id"], tweet["text"])
```

## Хранение собранных данных

- Храните исходные JSONL-файлы без изменений, сжатые `gzip`.
- Рядом сохраняйте описание: запрос, диапазон дат, дату сбора, версию twarc.
- Перед публикацией проверьте условия X: [Developer Policy](https://docs.x.com/developer-terms/policy) разрешает передавать третьим лицам в основном только ID постов и пользователей (не более 1,5 млн ID постов одному получателю за 30 дней без письменного разрешения X).

## Если API недоступен

1. **Wayback Machine** — проверить, есть ли сохранённая копия поста. См. [Wayback Machine API](/kb/instruments/tools/wayback-api) и [waybackpy](/kb/instruments/tools/waybackpy).
2. **[archive.ph](/kb/instruments/tools/archive-ph)** — сохранить или найти снимок отдельного поста.
3. **[Auto-Archiver](/kb/instruments/tools/auto-archiver)** — фиксация отдельных постов со скриншотами и хешами (есть модуль `twitter_api_extractor`).
4. **[Browsertrix](/kb/instruments/tools/browsertrix)** — браузерная копия страницы в WARC/WACZ.
5. **Выгрузка собственного архива** — [Как сохранить данные из Twitter (X)](/kb/instruments/data-take-out/dto-twitter).

## Ресурсы

- [twarc на GitHub](https://github.com/DocNow/twarc)
- [Документация twarc2](https://twarc-project.readthedocs.io/en/latest/twarc2_en_us/)
- [Документация X API](https://docs.x.com/x-api/introduction)
- [Цены X API](https://docs.x.com/x-api/getting-started/pricing)

## Связанные материалы

- [Mastodon, Bluesky, Threads](/kb/instruments/social-media/mastodon) — открытые альтернативы
- [Auto-Archiver](/kb/instruments/tools/auto-archiver) — для OSINT
- [Wayback Machine API](/kb/instruments/tools/wayback-api) — для архивных твитов
- [Социальные сети — обзор](/kb/instruments/social-media)
- [Data Take-Out: Twitter](/kb/instruments/data-take-out/dto-twitter)
- [Правовые вопросы](/kb/legal/copyright)
- [Ландшафт 2026](/kb/instruments/landscape-2026)
