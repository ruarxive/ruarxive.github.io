---
title: Архивация Mastodon, Bluesky, Threads
sidebar_label: Mastodon, Bluesky, Threads
description: "Архивация открытых платформ: Mastodon (ActivityPub), Bluesky (AT Protocol) и Threads. Публичные API без авторизации, выгрузка репозитория Bluesky, официальный Threads API, лимиты и этика."
last_update:
  date: 2026-10-28
keywords: [mastodon, bluesky, threads, activitypub, atprotocol, fediverse]
---

# Архивация Mastodon, Bluesky, Threads

После закрытия бесплатного API Twitter/X (см. [twarc](/kb/instruments/social-media/twarc)) многие авторы и сообщества перешли на платформы с открытыми протоколами. Mastodon и Bluesky отдают публичные данные через документированные API, во многих случаях — без авторизации.

| Платформа | Протокол | Запуск |
|:---|:---|:---|
| **Mastodon** | ActivityPub | 2016 |
| **Bluesky** | AT Protocol | 2023 (открытая регистрация — с 2024) |
| **Threads** | Собственный API Meta, частичная совместимость с ActivityPub | 2023 |

## Главные отличия от Twitter/X

| Twitter/X | Mastodon / Bluesky |
|:---|:---|
| Платный API | Бесплатные публичные API |
| Централизованная инфраструктура | Распределённая: у Mastodon — независимые серверы (инстансы), у Bluesky — серверы данных пользователей (PDS) |
| Одни правила для всех | У каждого инстанса Mastodon свои правила |

## Mastodon

Mastodon — децентрализованная соцсеть на протоколе [ActivityPub](https://www.w3.org/TR/activitypub/). Каждый сервер называется **инстансом** (например, `mastodon.social`), пользователь идентифицируется как `@user@instance.tld`.

### REST API

Методы для публичных данных ([документация](https://docs.joinmastodon.org/api/)) работают без авторизации, если администратор инстанса не отключил публичный предпросмотр — тогда нужен токен приложения.

```bash
# Найти ID аккаунта по имени
curl "https://mastodon.social/api/v1/accounts/lookup?acct=Gargron"

# Публичные посты аккаунта (до 40 за запрос)
curl "https://mastodon.social/api/v1/accounts/1/statuses?limit=40"

# Следующая страница: max_id = ID последнего полученного поста
curl "https://mastodon.social/api/v1/accounts/1/statuses?limit=40&max_id=117427077927293117"

# Один пост
curl "https://mastodon.social/api/v1/statuses/117427077927293117"

# Публичные посты с хэштегом
curl "https://mastodon.social/api/v1/timelines/tag/archive?limit=40"
```

Метод `accounts/lookup` по документации требует токен пользователя, но на многих инстансах (включая `mastodon.social`) отвечает и без него.

### Python: Mastodon.py

```bash
pip install Mastodon.py
```

```python
from mastodon import Mastodon

api = Mastodon(api_base_url="https://mastodon.social")  # токен не обязателен для публичных данных

account = api.account_lookup("Gargron")
page = api.account_statuses(account.id, limit=40)
statuses = []
while page:
    statuses.extend(page)
    page = api.fetch_next(page)  # следующая страница по пагинации API

for s in statuses:
    print(s.created_at, s.url)
    for media in s.media_attachments:
        print("  ", media.url)  # ссылки на медиафайлы для отдельного скачивания
```

> Примеры проверены на `mastodon.social` с Mastodon.py 2.2.2 (октябрь 2026).

### Лимиты Mastodon API

По умолчанию ([документация](https://docs.joinmastodon.org/api/rate-limits/)):

- 300 запросов за 5 минут с одного IP-адреса;
- 300 запросов за 5 минут для одного аккаунта (при работе с токеном).

Администраторы инстансов могут менять лимиты. Текущее состояние лимита приходит в заголовках ответа `X-RateLimit-Limit`, `X-RateLimit-Remaining` и `X-RateLimit-Reset`.

### Другие инструменты

- [gallery-dl](/kb/instruments/tools/gallery-dl) скачивает медиа из профилей Mastodon.
- [Browsertrix](/kb/instruments/tools/browsertrix) сохраняет веб-интерфейс инстанса в WARC/WACZ.

## Bluesky

Bluesky — соцсеть на протоколе [AT Protocol](https://atproto.com/). Все публичные записи пользователя хранятся в его репозитории на сервере данных (PDS), пользователь идентифицируется постоянным DID вида `did:plc:...` и сменяемым именем (handle).

### Публичный API

Публичные методы приложения Bluesky ([документация](https://docs.bsky.app/docs/advanced-guides/api-directory)) вызываются без авторизации через хост `public.api.bsky.app`:

```bash
# Профиль
curl "https://public.api.bsky.app/xrpc/app.bsky.actor.getProfile?actor=bsky.app"

# Лента пользователя (до 100 записей; следующая страница — параметр cursor из ответа)
curl "https://public.api.bsky.app/xrpc/app.bsky.feed.getAuthorFeed?actor=bsky.app&limit=100"
```

Поиск постов (`app.bsky.feed.searchPosts`) через публичный хост на момент проверки возвращал ошибку 403 — для поиска используйте авторизованный клиент.

### Полная выгрузка репозитория

Для архивации аккаунта целиком удобнее скачать весь его репозиторий одним файлом в формате CAR. Запрос делается к PDS пользователя, адрес которого указан в DID-документе:

```bash
DID="did:plc:z72i7hdynmk6r22z27h6tvur"
# Узнать адрес PDS из DID-документа
curl "https://plc.directory/$DID"
# Скачать репозиторий (подставьте serviceEndpoint из предыдущего ответа)
curl -o repo.car "https://PDS_HOST/xrpc/com.atproto.sync.getRepo?did=$DID"
```

Репозиторий содержит все публичные записи аккаунта (посты, лайки, подписки), подписанные ключом пользователя; медиафайлы (blobs) скачиваются отдельно.

### Python: atproto

```bash
pip install atproto
```

```python
from atproto import Client

# Анонимный доступ к публичным методам
client = Client(base_url="https://public.api.bsky.app/xrpc")

feed = client.get_author_feed(actor="bsky.app", limit=100)
for item in feed.feed:
    print(item.post.indexed_at, item.post.record.text)
# feed.cursor — для запроса следующей страницы
```

По умолчанию `Client()` обращается к `bsky.social` и для большинства методов требует входа: `client.login("user.bsky.social", "app_password")` (используйте пароль приложения, а не основной).

> Примеры проверены с atproto 0.0.72 (октябрь 2026).

## Threads

У Threads (Meta) есть официальный [Threads API](https://developers.facebook.com/docs/threads). Он рассчитан в первую очередь на публикацию и управление собственным аккаунтом, но включает и поиск публичных публикаций по ключевым словам и тегам (не более 2200 запросов за скользящие 24 часа на пользователя). Нужны приложение Meta и токен доступа, расширенные разрешения выдаются после проверки приложения.

Исследователи из подходящих организаций могут искать публичные посты Threads через веб-интерфейс Meta Content Library (см. [Facebook](/kb/instruments/social-media/facebook)).

Веб-версия Threads работает по адресу `threads.com`; для сохранения отдельных публикаций подходят браузерная архивация и [archive.ph](/kb/instruments/tools/archive-ph).

## Сравнение

| Возможность | Mastodon | Bluesky | Threads |
|:---|:-:|:-:|:-:|
| Публичный API без авторизации | ✅ (если не отключён на инстансе) | ✅ | ❌ |
| Полная выгрузка аккаунта третьим лицом | ❌ | ✅ (репозиторий CAR) | ❌ |
| Поиск | ✅ (по хэштегам — без авторизации) | ⚠️ (с авторизацией) | ⚠️ (Threads API) |
| Пагинация | `max_id` | `cursor` | по документации API |
| Лимиты | 300 запросов / 5 мин | см. [документацию](https://docs.bsky.app/docs/advanced-guides/rate-limits) | 2200 поисковых запросов / 24 ч |
| Python-библиотека | Mastodon.py | atproto | — |

## Ограничения

- **Полный сбор инстанса** через API Mastodon непрактичен из-за лимитов.
- **Личные сообщения и посты только для подписчиков** через публичные API недоступны.
- **Удалённые посты** исчезают из API; сохраняйте данные сразу.

## Этические аспекты

:::warning
Публичная доступность ≠ свобода использования. Всегда:

1. Уважайте `robots.txt` и правила конкретного инстанса.
2. Не собирайте данные для травли, деанонимизации или коммерческого использования.
3. Архивируйте общественно значимые материалы и учитывайте [правила обработки персональных данных](/kb/legal/personal-data).
4. Учитывайте настройки приватности пользователей и пометки в профилях (например, отказ от индексации и сбора данных).
5. Не превышайте разумный объём, даже если лимиты позволяют.
:::

## Ресурсы

- [Документация Mastodon API](https://docs.joinmastodon.org/api/)
- [Mastodon.py](https://github.com/halcy/Mastodon.py)
- [Документация Bluesky API](https://docs.bsky.app/)
- [Python-библиотека atproto](https://github.com/MarshalX/atproto) ([документация](https://atproto.blue/))
- [Спецификация репозиториев AT Protocol](https://atproto.com/specs/repository)
- [Threads API](https://developers.facebook.com/docs/threads)

## Связанные материалы

- [Социальные сети — обзор](/kb/instruments/social-media)
- [twarc](/kb/instruments/social-media/twarc) — для Twitter/X
- [Data Take-Out](/kb/instruments/data-take-out/data-take-out-main) — официальные выгрузки
- [Bellingcat Auto-Archiver](/kb/instruments/tools/auto-archiver) — фиксация отдельных публикаций
- [Ландшафт 2026](/kb/instruments/landscape-2026)
