---
title: Архивация Mastodon, Bluesky, Threads
sidebar_label: Mastodon и другие Fediverse
description: "Архивация открытых протоколов: Mastodon (ActivityPub), Bluesky (AT Protocol), Threads. Программный доступ без аутентификации, скрейпинг, этические ограничения."
last_updated: 2026-11-09
keywords: [mastodon, bluesky, threads, activitypub, atprotocol, fediverse]
---

# Архивация Mastodon, Bluesky, Threads

После сокращения Twitter v1.1 (см. [twarc](/kb/instruments/social-media/twarc)) и ограничений X/Twitter v2, появилась волна «открытых» платформ на базе стандартизованных протоколов. Они дают исследователям **лёгкий доступ к публичным данным** через стандартные API — без специальных программ.

| Платформа | Протокол | Базовый год | Аудитория |
|:---|:---|:---:|:---|
| **Mastodon** | ActivityPub | 2016 | Десятки млн активных |
| **Bluesky** | AT Protocol | 2024 | Десятки млн (растёт быстро) |
| **Threads** | ActivityPub (частично) | 2023 | 200+ млн (Meta) |

## Главные отличия от Twitter

| Twitter/X | Mastodon/Bluesky/Threads |
|:---|:---|
| Закрытый API с жёсткими лимитами | Открытые API, JWT-токен или без аутентификации |
| Бесплатный v1 → убран в 2023 | Бесплатные с самого начала |
| Централизованная инфраструктура | Распределённая (федерация) — нужен выбор инстанса |
| Один ToS | Каждый инстанс имеет свои правила |
| Курируемый контент | Возможны «неуютные» инстансы |

## Mastodon

Mastodon — децентрализованная соцсеть на протоколе [ActivityPub](https://www.w3.org/TR/activitypub/). Каждый сервер называется **инстанс** (например, `mastodon.social`, `mas.to`, `infosec.exchange`). Пользователь идентифицируется как `@user@instance.tld`.

### Программный доступ

**REST API:**

```bash
# Получить информацию о посте (без аутентификации!)
curl 'https://mastodon.social/api/v1/statuses/123456789012345678'
```

```json
{
  "id": "123456789012345678",
  "url": "https://mastodon.social/@user/123456789012345678",
  "created_at": "2026-11-09T12:00:00.000Z",
  "content": "<p>Текст поста</p>",
  "account": {"username": "user", "display_name": "..."},
  "media_attachments": [{"url": "https://...", "type": "image"}],
  "reblog": null,
  "favourites_count": 42,
  "reblogs_count": 5,
  "replies_count": 3
}
```

**Получить посты пользователя:**

```bash
# Без аутентификации — последние 40 постов
curl 'https://mastodon.social/api/v1/accounts/1234567/statuses?limit=40'

# С пагинацией
curl 'https://mastodon.social/api/v1/accounts/1234567/statuses?max_id=...&limit=40'
```

**Поиск:**

```bash
# По ключевому слову
curl 'https://mastodon.social/api/v1/timelines/tag/Russia?limit=40'
```

### Python: mastodon-py

```bash
pip install Mastodon.py
```

```python
from mastodon import Mastodon

mastodon = Mastodon(
    api_base_url="https://mastodon.social",
    access_token="your_access_token",  # опционально
)

# Получить последние посты пользователя
user = mastodon.account_lookup("@user@mastodon.social")
statuses = mastodon.account_statuses(user.id, limit=40)
for s in statuses:
    print(s.created_at, s.content, s.media_attachments)
    for m in s.media_attachments:
        mastodon.download_media(m, "./downloads/")

# Поиск
results = mastodon.timeline_hashtag("Russia", limit=40)
```

### Архивирование всего инстанса

```bash
# Используя [Bellingcat Auto-Archiver](/kb/instruments/tools/auto-archiver)
auto-archiver --input mastodon-user-list.txt --extractor mastodon
```

Или скриптом:

```python
import requests
import time

INSTANCE = "https://mastodon.social"
USER_ID = 1234567

def collect(limit=1000):
    """Собрать все посты пользователя, до limit."""
    api_url = f"{INSTANCE}/api/v1/accounts/{USER_ID}/statuses"
    params = {"limit": 40}
    all_statuses = []
    while len(all_statuses) < limit:
        r = requests.get(api_url, params=params, timeout=30)
        statuses = r.json()
        if not statuses:
            break
        all_statuses.extend(statuses)
        # max_id для пагинации
        params["max_id"] = statuses[-1]["id"]
        time.sleep(0.2)  # rate-limit
    return all_statuses[:limit]
```

### Лимиты Mastodon API

| Тип | Лимит |
|:---|:---|
| Чтение (анонимный) | 300 запросов / 5 мин на IP |
| Чтение (с токеном) | 1000 запросов / 5 мин на токен |
| Запись (с токеном) | 300 постов / 30 мин на токен |
| Длина поста | 500 символов (на инстансе можно 5000) |

Маленькие инстансы могут иметь собственные жёсткие лимиты — проверяйте `/api/v1/instance`.

## Bluesky

Bluesky — соцсеть на собственном протоколе [AT Protocol](https://atproto.com/). Каждое сообщение — запись в Personal Data Server (PDS), с идентификатором в формате `did:plc:...`.

### Программный доступ

**XRPC API:**

```bash
# Получить профиль пользователя
curl 'https://public.api.bsky.app/xrpc/app.bsky.actor.getProfile?actor=did:plc:xxx'

# Лента пользователя
curl 'https://public.api.bsky.app/xrpc/app.bsky.feed.getAuthorFeed?actor=alice.bsky.social&limit=30'
```

**Получить все посты пользователя:**

```bash
ACTOR="alice.bsky.social"
curl "https://public.api.bsky.app/xrpc/app.bsky.feed.getAuthorFeed?actor=$ACTOR&limit=100"
```

### Python: atproto

```bash
pip install atproto
```

```python
from atproto import Client

client = Client()  # без аутентификации

# Получить ленту
feed = client.get_author_feed(actor="alice.bsky.social", limit=30)
for item in feed.feed:
    post = item.post
    print(post.record.text, post.indexed_at)
```

### Аутентификация (для больших объёмов)

```python
from atproto import Client

client = Client()
client.login("user.bsky.social", "app_password")

# Больше лимитов
client.send_post("Hello!")
```

## Threads

Threads от Meta имеет **частичную** поддержку ActivityPub (с 2024), но основной путь для разработчиков — закрытый Meta Graph API.

### Публичный веб-скрейпинг

```bash
# Threads allow archive.ph, но bot-detection жёсткий
yt-dlp 'https://www.threads.net/@username/post/abc...'
```

### Meta Graph API (закрытая)

Доступ через [developers.facebook.com](https://developers.facebook.com/) — только для авторизованных приложений. Сложно получить для исследовательских проектов.

## Сравнение

| Возможность | Mastodon | Bluesky | Threads |
|:---|:-:|:-:|:-:|
| Публичный API без аутентификации | ✅ | ✅ | ❌ |
| Полные тексты постов | ✅ | ✅ | ⚠️ |
| Медиа-файлы | ✅ | ✅ | ⚠️ |
| Метаданные (время, лайки) | ✅ | ✅ | ⚠️ |
| Поиск | ✅ | ✅ (через app.bsky) | ⚠️ |
| Пагинация | ✅ max_id | ✅ cursor | ⚠️ |
| Лимиты | 300–1000 RPS | 5000 RPS с токеном | неизвестно |
| Стандартизация | ActivityPub (W3C) | AT Protocol | Частично ActivityPub |
| Инструменты | mastodon-py | atproto | rdflib (для веб) |

## Когда использовать

✅ Подходит:

- **Исследования без аутентификации** — Mastodon и Bluesky дают анонимный доступ.
- **Массовый сбор** — лимиты щедрые, не нужно специальных API-ключей.
- **Лонгитюдные проекты** — протоколы стабильны, реже ломаются, чем Twitter.
- **Архивирование открытых сообществ** — особенно Mastodon-инстансов с конкретной нишей (учёные, журналисты).

❌ Не подходит:

- **Коммерческое использование данных** — у каждой платформы своя лицензия.
- **Полный сбор всего инстанса** — лимиты API.
- **Threads** — закрытый API; для исследователя непрактично.
- **DMs и приватные посты** — никогда не доступны через API.

## Этические аспекты

> [!WARNING]
> Публичный ≠ свободный для использования. Всегда:
>
> 1. Уважайте robots.txt инстанса.
> 2. Не собирайте данные для троллинга, доксинга или коммерческого использования.
> 3. Архивируйте только общественно-значимые материалы.
> 4. Соблюдайте ToS конкретного инстанса (у каждого свой).
> 5. Не превышайте разумный объём (даже если лимиты позволяют).

## Ресурсы

- [Mastodon API documentation](https://docs.joinmastodon.org/api/)
- [Mastodon.py library](https://github.com/halcy/Mastodon.py)
- [Bluesky API](https://atproto.com/docs/api)
- [atproto Python library](https://github.com/MarshalX/atproto)
- [AT Protocol Specification](https://atproto.com/specs/at)
- [Threads API status](https://developers.facebook.com/docs/threads)

## Связанные материалы

- [Социальные сети — обзор](/kb/instruments/social-media)
- [twarc](/kb/instruments/social-media/twarc) — для Twitter/X.
- [Data Take-Out](/kb/instruments/data-take-out/data-take-out-main) — официальные выгрузки.
- [Bellingcat Auto-Archiver](/kb/instruments/tools/auto-archiver) — для массового сбора.
- [Ландшафт 2026](/kb/instruments/landscape-2026) — где эти инструменты.
