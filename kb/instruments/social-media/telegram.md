---
title: Архивация Telegram
sidebar_label: Telegram
description: "Как сохранить Telegram в 2026 году: экспорт Telegram Desktop, загрузчик tdl, скрипт на Telethon, комментарии к постам и снимок публичной веб-версии канала t.me/s."
last_update:
  date: 2026-10-29
keywords: [telegram, tdl, telethon, tgarc, экспорт, t.me]
---

# Архивация Telegram

У Telegram нет одного «правильного» архива на все случаи. Способ зависит от того, чьи сообщения вы сохраняете и какой результат нужен: JSON для обработки, HTML для чтения или снимок веб-страницы канала.

:::warning Выгружайте заранее
На фоне блокировок Telegram в России (позиция Ruarxive от 02.04.2026, [#182](https://t.me/ruarxive/182); хронология — в разделе [ограничения доступа в России](/kb/instruments/social-media#ограничения-доступа-в-россии)) важный канал или чат лучше выгрузить сейчас, пока клиент у вас работает. Советов по обходу блокировок база не даёт.
:::

## Какой способ для какой задачи

| Задача | Способ | Результат |
| :--- | :--- | :--- |
| Свой чат, группа или канал без программирования | [Экспорт Telegram Desktop](#экспорт-telegram-desktop) | HTML и/или JSON, файлы |
| Все данные своего аккаунта | [Экспорт Telegram Desktop](/kb/instruments/data-take-out/dto-telegram#способ-2-экспорт-данных-всего-аккаунта) | HTML и/или JSON |
| Публичный канал целиком, с медиа | [tdl](#tdl) | JSON, файлы |
| Комментарии к постам канала | [tdl `--reply`](#комментарии-к-постам-канала) или Telethon `reply_to` | JSON |
| Регулярная докачка, своя схема данных | [Скрипт на Telethon](#скрипт-на-telethon) | JSONL, файлы |
| Вид канала, как его видит читатель в браузере | [Снимок `t.me/s/`](#публичный-канал-как-сайт) | WARC/WACZ |
| Канал уже удалён | Wayback Machine по адресу `t.me/s/имя_канала` | — |

Чужие личные чаты так копировать не следует, см. [условия использования](/kb/legal/terms-of-service).

## Что получится

| | Экспорт Desktop | tdl | Telethon | Снимок `t.me/s/` |
| :--- | :--- | :--- | :--- | :--- |
| Нужен аккаунт | да | да | да | нет |
| Текст сообщений | да | да, с `--with-content` | да | да |
| Медиафайлы | да, до лимита размера (по умолчанию 8 МБ на файл) | да | да | только то, что показано на странице |
| Комментарии к постам канала | отдельным экспортом группы обсуждения | `--reply` | `reply_to` | нет |
| Формат | HTML, JSON | JSON | как напишете (ниже — JSONL) | WARC/WACZ |

Ни один способ не вернёт сообщения, удалённые до выгрузки, и не откроет закрытый чат, в котором вас нет.

## Экспорт Telegram Desktop

Встроенный экспорт пишет HTML и JSON на ваш компьютер. Пошагово — [Как сохранить данные из Telegram](/kb/instruments/data-take-out/dto-telegram).

Два момента, которые чаще всего портят выгрузку:

- **Лимит размера файла** по умолчанию 8 МБ. Видео крупнее в архив не попадут, если не поднять ползунок (до 4000 МБ).
- **Комментарии к постам канала** хранятся не в самом канале, а в привязанной к нему группе обсуждения. Чтобы их сохранить, экспортируйте и эту группу.

Так Ruarxive сохранил в 2022 году каналы СМИ: Telegram-канал «Эха Москвы» — более 50 тысяч сообщений, 18 ГБ ([#6](https://t.me/ruarxive/6), подробнее — [проект «Эхо Москвы»](/kb/projects/echomsk)); каналы «Новой газеты» (около 20 ГБ, [#7](https://t.me/ruarxive/7)), «Дождя» и других изданий — см. [Архивы контента российских СМИ](/kb/projects/russian-smi). Основной объём таких выгрузок — видео.

## tdl

[tdl](/kb/instruments/tools/tdl) — поддерживаемый загрузчик на Go. Он экспортирует сообщения в JSON и отдельно скачивает по этому JSON медиафайлы.

```bash
# 1. Вход: импорт сессии из Telegram Desktop или по QR-коду
tdl login
tdl login -T qr

# 2. Все сообщения канала вместе с текстом
tdl chat export -c CHANNEL --all --with-content -o CHANNEL.json

# 3. Медиафайлы по этому экспорту; при обрыве запустите ту же команду с --continue
tdl dl -f CHANNEL.json -d ./CHANNEL-media
```

Без `--all` в экспорт попадают только сообщения с медиа, без `--with-content` — без текста.

Дозагрузку новых сообщений делают экспортом диапазона. По умолчанию диапазон задаётся в Unix-времени, с `-T id` — в номерах сообщений:

```bash
tdl chat export -c CHANNEL --all --with-content -T time -i 1790000000,1790600000 -o CHANNEL-part.json
```

Для больших объёмов медиа у `tdl dl` есть флаг `--takeout`: такая сессия, по документации tdl, работает с более мягкими ограничениями FloodWait.

> Флаги сверены с документацией tdl v0.20.4 (`docs/content/en/guide`, октябрь 2026).

### Комментарии к постам канала

```bash
# ответы к посту 123
tdl chat export -c CHANNEL --reply 123 -o CHANNEL-123-comments.json
```

Комментарии — это сообщения людей из группы обсуждения: имена, аватары и тексты комментаторов — персональные данные. См. [ниже](#право-и-персональные-данные).

## Скрипт на Telethon

[Telethon](https://docs.telethon.dev/) — библиотека на Python для MTProto. Она нужна, когда готового экспорта мало: регулярная докачка по расписанию, своя схема хранения, сбор комментариев к каждому посту.

Проект переехал с GitHub на [Codeberg](https://codeberg.org/Lonami/Telethon), пакет на PyPI по-прежнему называется `telethon`.

```bash
pip install telethon
```

Ключи приложения (`api_id`, `api_hash`) создаются на [my.telegram.org/apps](https://my.telegram.org/apps). При первом запуске Telethon спросит номер телефона и код и сохранит сессию в файл `archive.session`. Этот файл даёт полный доступ к аккаунту: не кладите его в репозиторий и в публичный архив вместе с выгрузкой.

Скрипт ниже пишет канал в JSONL: одно сообщение — одна строка JSON. Сообщения идут от старых к новым. Повторный запуск продолжает с последнего сохранённого `id`, поэтому прерванную выгрузку можно просто запустить снова.

```python
import asyncio
import base64
import json
import os
from datetime import datetime
from pathlib import Path

from telethon import TelegramClient
from telethon.errors import FloodWaitError

API_ID = int(os.environ["TG_API_ID"])
API_HASH = os.environ["TG_API_HASH"]
CHANNEL = "channel_name"  # имя канала без @
DOWNLOAD_MEDIA = False

OUT = Path(CHANNEL)
MESSAGES = OUT / "messages.jsonl"
MEDIA = OUT / "media"


def json_default(value):
    if isinstance(value, datetime):
        return value.isoformat()
    if isinstance(value, bytes):
        return base64.b64encode(value).decode("ascii")
    return repr(value)


def last_saved_id():
    last = 0
    if MESSAGES.exists():
        with MESSAGES.open(encoding="utf-8") as infile:
            for line in infile:
                last = max(last, json.loads(line)["id"])
    return last


async def dump(client):
    with MESSAGES.open("a", encoding="utf-8") as outfile:
        async for message in client.iter_messages(
            CHANNEL, reverse=True, min_id=last_saved_id(), wait_time=1
        ):
            record = message.to_dict()
            if DOWNLOAD_MEDIA and message.media:
                path = await client.download_media(message, file=MEDIA)
                record["saved_file"] = str(path) if path else None
            outfile.write(json.dumps(record, ensure_ascii=False, default=json_default) + "\n")
            outfile.flush()


async def main():
    OUT.mkdir(exist_ok=True)
    if DOWNLOAD_MEDIA:
        MEDIA.mkdir(exist_ok=True)
    async with TelegramClient("archive", API_ID, API_HASH) as client:
        while True:
            try:
                await dump(client)
                break
            except FloodWaitError as error:
                print(f"FloodWait: ждём {error.seconds} с", flush=True)
                await asyncio.sleep(error.seconds + 5)


asyncio.run(main())
```

Что важно в этом коде:

- `reverse=True` отдаёт сообщения от старых к новым, а `min_id` пропускает всё, что уже есть в файле.
- `wait_time=1` — пауза в секунду между запросами истории.
- Короткие паузы FloodWait (до 60 секунд — значение `flood_sleep_threshold` по умолчанию) Telethon выдерживает сам. На более длинных он выбрасывает `FloodWaitError`: скрипт ждёт указанное время и продолжает с последнего сохранённого сообщения.
- `to_dict()` сохраняет объект сообщения целиком: просмотры, пересылки, вложения, ответы. Даты пишутся в ISO 8601.

Комментарии к посту канала возвращает тот же метод с параметром `reply_to`. Он работает только для каналов с группой обсуждения:

```python
async for reply in client.iter_messages(CHANNEL, reply_to=post_id):
    ...
```

Есть ли у поста комментарии, видно по полю `replies` сообщения: `message.replies.comments` и число `message.replies.replies`.

> Параметры сверены с исходным кодом Telethon 1.45.0 (`telethon/client/messages.py`, `downloads.py`, `telegrambaseclient.py`, ветка `v1` на Codeberg, октябрь 2026).

### Если у вас старые выгрузки tgarc

[tgarc](/kb/instruments/ruarxive-tools/tgarc) — утилита Ruarxive на Pyrogram. Она не развивается с 15 декабря 2023 года, а Pyrogram архивирован. Для нового сбора берите tdl или Telethon. Страница tgarc нужна, чтобы разобраться в формате уже сделанных выгрузок (`messages.jsonl` с объектами Pyrogram).

## Публичный канал как сайт

У открытого канала есть веб-версия `https://t.me/s/имя_канала`. Её видят поисковые системы и Wayback Machine, для неё не нужен аккаунт.

На одной странице — около 20 последних постов. Более старые открываются параметром `before`: `https://t.me/s/имя_канала?before=441` покажет посты с номерами меньше 441. Так ленту проходит и краулер.

Снимок сохраняет то, что показано в вебе: тексты, превью, счётчики. Полной истории с файлами и комментариями, как у экспорта Desktop или MTProto-клиента, в нём нет. Снимать страницу удобно [Browsertrix](/kb/instruments/tools/browsertrix) — он прокручивает ленту, как читатель.

Если канал уже удалён, проверьте адрес `t.me/s/имя_канала` в [Wayback Machine](/kb/instruments/tools/wayback-api).

## Хранение результата

Результат tdl, Telethon и tgarc — JSON, а не WARC: открыть его в pywb нельзя. Для веб-просмотра есть WARC/WACZ-снимок `t.me/s/`.

Как хранить JSON и медиафайлы, описать выгрузку и посчитать контрольные суммы — в [методике](/kb/instruments/social-media/methodology#хранение). Там же [пример паспорта сбора](/kb/instruments/social-media/methodology#паспорт-сбора) для канала Telegram.

## Право и персональные данные

- Имена, аватары и тексты участников групп и комментаторов — [персональные данные](/kb/legal/personal-data). Для архива текстов канала они не обязательны.
- Владелец канала может включить защиту контента (запрет копирования и пересылки). Учитывайте это ограничение и [авторское право](/kb/legal/copyright).
- Сбор из закрытых групп — только с согласия участников, см. [условия использования сервисов](/kb/legal/terms-of-service).

## Чего ждать не стоит

- Закрытый чат без вашего участия в нём этими инструментами не открывается.
- Клона канала Ruarxive во ВКонтакте или в MAX проект не заводил. Позиция на апрель 2026 года, на фоне блокировок Telegram: канал остаётся в Telegram, архивы заблокированных организаций не удаляются ([#182](https://t.me/ruarxive/182)).
- У мессенджера [MAX](/kb/instruments/social-media/max) публичного просмотра каналов и выгрузки, сопоставимой с Telegram Desktop, нет.

## Ресурсы

- [Документация tdl](https://docs.iyear.me/tdl/)
- [Документация Telethon](https://docs.telethon.dev/), [исходный код на Codeberg](https://codeberg.org/Lonami/Telethon)
- [my.telegram.org/apps](https://my.telegram.org/apps) — ключи приложения
- [Telegram Desktop](https://desktop.telegram.org/)

## Связанные материалы

- [Как сохранить данные из Telegram](/kb/instruments/data-take-out/dto-telegram) — экспорт Telegram Desktop
- [tdl](/kb/instruments/tools/tdl) — все команды загрузчика
- [tgarc](/kb/instruments/ruarxive-tools/tgarc) — формат старых выгрузок Ruarxive
- [MAX](/kb/instruments/social-media/max) — почему его нельзя архивировать так же
- [Методика архивации соцсетей](/kb/instruments/social-media/methodology) — паспорт сбора, аккаунт, хранение
- [Площадки, у которых API уже нет](/kb/instruments/social-media/dead-platforms)
