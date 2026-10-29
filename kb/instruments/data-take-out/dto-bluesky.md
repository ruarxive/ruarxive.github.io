---
title: Как сохранить данные из Bluesky
sidebar_label: Bluesky
description: "Выгрузка своего аккаунта Bluesky: файл CAR и переписка в JSONL из настроек приложения, медиафайлы через listBlobs и getBlob, чтение CAR утилитой goat и библиотекой atproto для Python."
last_update:
  date: 2026-10-29
keywords: [bluesky, atproto, car, goat, экспорт, blobs, jsonl]
---

# Как сохранить данные из Bluesky

Аккаунт Bluesky хранится в репозитории на сервере данных (PDS). Приложение выгружает этот репозиторий одним файлом в формате CAR. Медиафайлы в него не входят, личные сообщения выгружаются отдельно.

Официальной справочной статьи с путём в меню мы не нашли. Подписи ниже сверены с исходным кодом [приложения Bluesky](https://github.com/bluesky-social/social-app/blob/main/src/screens/Settings/components/ExportCarDialog.tsx) в октябре 2026 года. Само приложение называет функцию бета-версией.

## Выгрузка в приложении

Откройте **Настройки → Учётная запись → Экспорт моих данных** (Settings → Account → Export my data). В окне две кнопки. Перевода на русский у них нет:

- **Download profile data** — файл `repo.car`, весь репозиторий аккаунта.
- **Download chat data** — файл `chat.jsonl`, личные сообщения. В нём только отправленные вами сообщения, полученных нет.

Выгрузку переписки можно запустить и из настроек чатов: пункт **Export my chat data**.

## Что входит в CAR

| Входит | Не входит |
| :--- | :--- |
| Профиль, посты, лайки, репосты, подписки | Медиафайлы: в записях только ссылки на них (CID, тип, размер) |
| Блокировки, списки, стартовые наборы (starter packs) | Личные сообщения — отдельный `chat.jsonl` |
| Записи других приложений AT Protocol на этом аккаунте | Скрытые аккаунты (mutes) и подписки на списки |
| Подписанный коммит: версия репозитория и DID | Удалённые записи: удаление не оставляет следов |

Источники: текст окна экспорта в приложении, [блог AT Protocol](https://atproto.com/blog/repo-export) и [спецификация репозитория](https://atproto.com/specs/repository).

Репозиторий публичный. Тот же CAR без входа может скачать любой, кто знает ваше имя или DID. Блокировки в нём тоже публичные записи `app.bsky.graph.block`.

## Скачать CAR из командной строки

[goat](https://github.com/bluesky-social/goat) — официальная утилита Bluesky для AT Protocol. Ставится через `brew install goat` или `go install github.com/bluesky-social/goat@latest`.

```bash
# файл вида HANDLE.20261029102608.car в текущей папке; другое имя — флаг -o
goat repo export HANDLE
```

Без goat — два запроса. Адрес PDS указан в DID-документе в поле `serviceEndpoint`:

```bash
curl "https://public.api.bsky.app/xrpc/com.atproto.identity.resolveHandle?handle=HANDLE"
curl "https://plc.directory/DID"
curl -o repo.car "https://PDS_HOST/xrpc/com.atproto.sync.getRepo?did=DID"
```

Запрос нужно отправлять на PDS аккаунта. Адрес `bsky.social` из примеров 2023 года без входа отвечает `401 AuthMissing`.

## Прочитать CAR

goat читает файл без сети:

```bash
goat repo inspect repo.car   # DID, ревизия (Revision), CID данных
goat repo ls repo.car        # список записей: коллекция/ключ и CID
goat repo unpack repo.car -o repo-json
```

`unpack` раскладывает записи в JSON: `repo-json/_commit.json` и по файлу на запись, например `repo-json/app.bsky.feed.post/3myidcyrgv22f.json`. Без `-o` папка называется по DID.

Скрипт на Python с библиотекой [atproto](https://atproto.blue/) пишет посты в JSONL. Он обходит дерево записей (MST) и сохраняет адрес каждого поста:

```bash
pip install atproto
python posts_from_car.py repo.car
```

```python
import json
import sys

from atproto import CAR, CID

car = CAR.from_bytes(open(sys.argv[1], "rb").read())
commit = car.blocks[car.root]


def walk(node_cid):
    """Обход дерева MST: пары «коллекция/ключ записи» и CID записи."""
    node = car.blocks[CID.from_decoded_bytes(node_cid)]
    if node.get("l"):
        yield from walk(node["l"])
    key = b""
    for entry in node["e"]:
        key = key[: entry["p"]] + entry["k"]
        yield key.decode(), entry["v"]
        if entry.get("t"):
            yield from walk(entry["t"])


with open("posts.jsonl", "w", encoding="utf-8") as out:
    for path, record_cid in walk(commit["data"]):
        if not path.startswith("app.bsky.feed.post/"):
            continue
        record = car.blocks[CID.from_decoded_bytes(record_cid)]
        line = {
            "uri": f"at://{commit['did']}/{path}",
            "createdAt": record.get("createdAt"),
            "text": record.get("text"),
            "langs": record.get("langs"),
        }
        out.write(json.dumps(line, ensure_ascii=False) + "\n")
```

Ключ записи из `uri` — это и последняя часть веб-адреса поста `https://bsky.app/profile/DID/post/КЛЮЧ`.

## Медиафайлы

Картинки, видео и аватары хранятся на PDS отдельно. Список файлов отдаёт `com.atproto.sync.listBlobs`, сам файл — `com.atproto.sync.getBlob`. Оба метода работают без входа. `getBlob` возвращает файл в том виде, в каком его загрузили.

```bash
# все файлы аккаунта в папку HANDLE_blobs
goat blob export HANDLE
```

goat называет файлы по CID, без расширения. Уже скачанные файлы он пропускает, поэтому прерванную выгрузку можно запустить снова. Тип файла указан в записи, которая на него ссылается, в поле `mimeType`. Например, у картинки в посте путь такой: `embed.images[].image.ref.$link` — это CID и имя файла.

Без goat — цикл по страницам `listBlobs` (до 1000 CID на страницу) и `getBlob` на каждый CID:

```bash
PDS="https://PDS_HOST"
DID="did:plc:..."
mkdir -p blobs
cursor=""
while :; do
  page=$(curl -s "$PDS/xrpc/com.atproto.sync.listBlobs?did=$DID&limit=1000&cursor=$cursor")
  for cid in $(echo "$page" | jq -r '.cids[]'); do
    [ -f "blobs/$cid" ] || curl -s -o "blobs/$cid" "$PDS/xrpc/com.atproto.sync.getBlob?did=$DID&cid=$cid"
  done
  cursor=$(echo "$page" | jq -r '.cursor // empty')
  [ -z "$cursor" ] && break
done
```

PDS может ограничивать частоту запросов. Остаток лимита приходит в заголовках `RateLimit-Limit` и `RateLimit-Remaining`.

> Команды сверены с goat v0.2.8 (`--help`, `repo.go`, `blob.go`), лексиконами `com.atproto.sync` и atproto 0.0.73 для Python. На публичном аккаунте `atproto.com` в октябре 2026 года проверены `goat repo inspect`, `ls`, `unpack`, скрипт на Python (282 поста, столько же в профиле), запросы `getRepo`, `listBlobs` и `getBlob` и цикл выше (121 файл). `goat repo export` и `goat blob export` сверены только с исходным кодом и `--help`, не запускались.

## Ограничения

- После деактивации аккаунта CAR и файлы не скачать: PDS отвечает ошибкой `RepoDeactivated`. Сохраните данные до деактивации или удаления.
- Удалённые посты в CAR не попадают. Чего нет в выгрузке, ищите в сторонних архивах.
- Переписка — только ваша сторона: полученных сообщений в `chat.jsonl` нет.

## Чужие аккаунты

Публичный API, лента и ветки обсуждений чужих аккаунтов — на странице [Mastodon, Bluesky, Threads](/kb/instruments/social-media/mastodon#bluesky).

## Связанные материалы

- [Mastodon, Bluesky, Threads](/kb/instruments/social-media/mastodon) — публичный API и архивация чужих аккаунтов
- [Как выгрузить свой аккаунт Mastodon](/kb/instruments/data-take-out/dto-mastodon)
- [Data Take-Out](/kb/instruments/data-take-out/data-take-out-main)
- [Методика архивации соцсетей](/kb/instruments/social-media/methodology#хранение) — хранение и контрольные суммы
- [goat на GitHub](https://github.com/bluesky-social/goat)
- [Спецификация репозитория AT Protocol](https://atproto.com/specs/repository)
