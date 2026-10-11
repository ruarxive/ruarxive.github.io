---
title: twarc v2 — архивация Twitter/X через API v2
sidebar_label: twarc v2 (Twitter/X)
description: "twarc — современная обёртка Twitter API v2 с гибридным режимом (v1+v2), командами для timeline, search, hydrate. Обзор изменений в 2023–2026."
last_updated: 2026-11-09
keywords: [twarc, twitter, x, api-v2, x.com]
---

# twarc v2 — архивация Twitter/X через API v2

[twarc](https://github.com/DocNow/twarc) — Python-библиотека и CLI для архивации Twitter/X через **API v2**. С 2023 года это **единственный поддерживаемый** способ работы с Twitter (X), так как v1.1 API отключён, а v2 имеет более строгие тарифы и rate limits.

> **Важно:** Twitter (X) платный с 2023 года. Free-тариф остался только для академических проектов; для исследователей — Basic ($100/мес) и Pro ($5000/мес). Это серьёзно ограничивает возможности архивации.

## Зачем нужен twarc

- **Гибридный v1 + v2** — может использовать данные v1 там, где v2 ещё не покрывает (например, места, отмеченные твитами).
- **Rate-limit handling** из коробки.
- **Сохранение полного JSON** — каждый объект записывается со всеми полями API.
- **CLI и Python API** — от `twarc search "..."` до сложных ETL-скриптов.

## Установка

```bash
pip install twarc
```

Требования: Python 3.8+.

## Получение доступа к API v2

### Академический (бесплатно)

Twitter Academic API доступен через заявку:

1. Зарегистрируйтесь на [Twitter Developer Portal](https://developer.twitter.com/).
2. Создайте «Project» с описанием исследования.
3. Запросите «Academic Research» access (рассмотрение 2–4 недели).
4. При одобрении — лимиты: 10 млн твитов в месяц, full-archive search.

**Что даёт:**

- Full-archive search (до 2006 года).
- До 500 запросов в 15 минут.
- До 1 млн tweets на один запрос.

### Платный тариф

| План | Цена | Лимит на запись | Поиск |
|:---|:--:|:--:|:--:|
| Free | $0 | только чтение своих | нет |
| Basic | $100/мес | 3 000 в месяц | последние 7 дней |
| Pro | $5 000/мес | 1 000 000 в месяц | full-archive |
| Academic | $0 (одобрение) | 10 000 000 в месяц | full-archive |

Для архивации нужен **Pro** или **Academic**.

### Настройка twarc

```bash
twarc configure
# Введите:
#   - Bearer Token (получите в Developer Portal)
```

Файл `~/.twarc` будет содержать ключ. Альтернативно — переменная окружения `TWARC_BEARER_TOKEN`.

## Использование

### CLI — базовые команды

```bash
# Поиск (последние 7 дней — Basic и выше)
twarc search "climate change" > search.jsonl

# Full-archive search (Pro и Academic)
twarc search "from:openai OR @openai" --start-time 2020-01-01 > historical.jsonl

# Получить конкретные твиты по ID
twarc hydrate 1234567890123456789 9876543210987654321 > tweets.jsonl

# Timeline пользователя
twarc timeline @username > user-tweets.jsonl

# Подписчики пользователя
twarc followers @username > followers.jsonl

# Лайки пользователя
twarc likes @username > likes.jsonl

# По ID пользователя получить профиль
twarc users 12345678 > user.jsonl
```

### Параметры search

```bash
twarc search "python" \
  --start-time 2024-01-01T00:00:00Z \
  --end-time 2024-12-31T23:59:59Z \
  --max-tweets 10000 \
  --lang en \
  --output results.jsonl
```

### Python API

```python
from twarc import Twarc2

t = Twarc2(bearer_token="YOUR_TOKEN")

# Поиск
for tweet in t.search("query"):
    print(tweet)

# Полная страница результатов
pages = t.search("query", max_pages=10)
for page in pages:
    for tweet in page['data']:
        print(tweet['id'], tweet['text'])
```

### Conversations / Thread

```bash
# Показать весь thread
twarc conversation 1234567890123456789 > thread.jsonl
```

## Формат данных v2

Каждый твит в v2 — JSON с разделами:

```json
{
  "data": {
    "id": "1234567890123456789",
    "text": "Tweet text",
    "edit_history_tweet_ids": ["1234567890123456789"],
    "created_at": "2026-01-01T12:00:00.000Z",
    "author_id": "987654321",
    "conversation_id": "1234567890123456789",
    "in_reply_to_user_id": null,
    "public_metrics": {
      "retweet_count": 100,
      "reply_count": 25,
      "like_count": 500,
      "quote_count": 10,
      "bookmark_count": 5,
      "impression_count": 10000
    },
    "entities": {...},
    "lang": "ru"
  },
  "includes": {
    "users": [{"id": "987654321", "username": "...", ...}],
    "tweets": [...],
    "media": [...]
  }
}
```

**Изменения v1.1 → v2:**

- `text` вместо `full_text`.
- `created_at` в ISO 8601 вместо HTTP date.
- `author_id` вместо `user.screen_name`.
- `entities` структура упрощена.
- `in_reply_to_*` — отдельные поля.

### Hydration: превращение ID в полные данные

```bash
# Сохранить только ID
twarc search "..." --no-store > /dev/null
# ID в файле .jsonl

# Позже «гидратировать» через archive
twarc hydrate $(jq -r '.data.id' tweets.jsonl) > full-tweets.jsonl
```

Это позволяет разделить **сбор ID** от **загрузки полного JSON** для экономии запросов.

## Команды

### timeline

```bash
twarc timeline @user --since-id 1234567890 --max-tweets 5000
```

### search vs full-archive search

```bash
# Basic: 7 дней
twarc search "python"

# Pro/Academic: full-archive
twarc search "python" --start-time 2015-01-01 --end-time 2016-12-31
```

### filter (stream)

```bash
# Только Basic+ — real-time stream (ранее sample)
twarc filter "lang:ru Ukraine war" --max-tweets 100000 > stream.jsonl
```

### list

```bash
# Все члены list
twarc list members 1234567890 > members.jsonl

# Все твиты из list
twarc list tweets 1234567890 > list-tweets.jsonl
```

## Best practices

### Резюме прерванной архивации

```bash
twarc search "..." --checkpoint-file ./checkpoint.jsonl
# Если процесс прервётся, twarc возобновит с последнего checkpoint
```

### Расщепление коллекции по дате

```bash
# Январь 2024
twarc search "..." \
  --start-time 2024-01-01T00:00:00Z \
  --end-time 2024-01-31T23:59:59Z > january.jsonl
```

### Удаление дубликатов через WARC-Payload-Digest

```bash
# twarc не делает dedup; используем post-processing
jq -r '.data.id' tweets.jsonl | sort -u > unique-ids.txt
wc -l unique-ids.txt
```

### Долговременное хранение

```bash
# JSON Lines (newline-delimited JSON) — хороший формат для долгосрочного хранения
gzip tweets.jsonl
# Сохранить как tweets.jsonl.gz с метаданными:
echo "Date range: 2024-01-01/2024-12-31" > tweets-metadata.txt
echo "Source: Twitter v2 API" >> tweets-metadata.txt
echo "Query: ..." >> tweets-metadata.txt
echo "License: depends on content" >> tweets-metadata.txt
```

## Лимиты API v2 (Academic и Pro)

| Endpoint | Лимит |
|:---|:---|
| Search (Free) | нет |
| Search (Basic) | 60 запросов / 15 мин |
| Search (Pro) | 120 запросов / 15 мин |
| Search (Academic) | 300 запросов / 15 мин |
| Max results per page | 100 (Pro), 500 (Academic) |
| Timeline | 5 запросов / 15 мин / user |
| Followers | 15 запросов / 15 мин |
| Likes | 75 запросов / 15 мин |
| Hydrate | 300 запросов / 15 мин |
| Filter (stream) | до 50 твитов / сек |

## Сравнение с альтернативами

| Задача | twarc | snscrape | Auto-Archiver |
|:---|:-:|:-:|:-:|
| Twitter API v2 | ✅ | ❌ (legacy) | через twarc |
| Free-of-charge | ❌ платный | ⚠️ нестабильно | ❌ |
| Hydration из ID | ✅ | ❌ | ✅ |
| CLI | ✅ | ✅ | через конфиг |
| Python API | ✅ | ✅ | через Python |
| Threading / conversations | ✅ | ⚠️ | ⚠️ |
| Academic грант | ✅ | ❌ | ❌ |

## Альтернативы без API

Если API недоступен:

### Wayback Machine

```bash
# Проверить наличие твита
curl 'https://archive.org/wayback/available?url=https://twitter.com/user/status/12345'
```

### Archive.ph / Archive.today

```bash
# Сохранить твит
curl -X POST 'https://archive.ph/newest/' \
  -d 'url=https://twitter.com/user/status/12345'
```

### Waybackpy (более простая)

```python
from waybackpy import WaybackMachine

snap = WaybackMachine("https://twitter.com/user/status/12345").near()
print(snap.url if snap else "not archived")
```

### Бенчмарк цитирования

Подробности — [Wayback Machine API](/kb/instruments/tools/wayback-api).

## Что делать, когда API недоступен

1. **Использовать Wayback Machine** для уже сохранённых твитов.
2. **Использовать Internet Archive TV News Archive** — для новостных аккаунтов.
3. **Hanging-Saving через Bellingcat Auto-Archiver** — с браузерным скриншотом.
4. **DOM screenshot через [Browsertrix](/kb/instruments/tools/browsertrix)** — для всей страницы.

## Юридические аспекты

> [!WARNING]
> Twitter/X ToS запрещают «sell, lease, sublicense, distribute or otherwise transfer access to the API». Это означает:
>
> - Публикация полного архива твитов в большинстве юрисдикций проблемна.
> - Использование для исследований и OSINT-расследований — допустимо.
> - Метаданные (ID, время, автор) обычно можно публиковать.

**Рекомендация:** храните архив локально, не публикуйте без явного разрешения правообладателя.

Подробнее: [Правовые вопросы](/kb/legal/copyright).

## Изменения 2023–2026

| Год | Событие |
|:---|:---|
| 2023 | Twitter → X; v1.1 API закрыт 09.05.2023 |
| 2023 | Платные тарифы (Basic, Pro) |
| 2024 | Academic API ужесточен (отказ некоторым вузам) |
| 2025 | Некоторые издатели (NYT, Reddit) заблокировали Wayback Machine |
| 2026 | Wikipedia начинает использовать Twitter/X только через Wayback |

## Когда использовать

✅ Подходит:

- **Академические исследования** с одобренным Academic API.
- **OSINT-расследования** с Pro-подпиской.
- **Мониторинг** конкретных аккаунтов или тем.
- **Hydration** ID твитов из имеющегося архива.

❌ Не подходит:

- **Бесплатное использование** — нет ни одного публичного способа.
- **Массовая архивация** без бюджета — нужны десятки тысяч долларов.
- **Реал-тайм** — для полного покрытия нужны мощные ресурсы.
- **Альтернативы X** — для них есть [Mastodon, Bluesky, Threads](/kb/instruments/social-media/mastodon).

## Ресурсы

- [twarc GitHub](https://github.com/DocNow/twarc)
- [Twitter API v2 docs](https://developer.twitter.com/en/docs/twitter-api)
- [Academic Research access](https://developer.twitter.com/en/products/twitter-api/academic-research)
- [Twarc Twarc2 documentation](https://twarc-project.readthedocs.io/en/latest/twarc2.html)
- [Wayback Machine API](/kb/instruments/tools/wayback-api) — fallback.

## Связанные материалы

- [Mastodon, Bluesky, Threads](/kb/instruments/social-media/mastodon) — альтернативы.
- [Auto-Archiver](/kb/instruments/tools/auto-archiver) — для OSINT.
- [Wayback Machine API](/kb/instruments/tools/wayback-api) — для архивных твитов.
- [Социальные сети — обзор](/kb/instruments/social-media)
- [Data Take-Out: Twitter](/kb/instruments/data-take-out/dto-twitter)
- [Правовые вопросы](/kb/legal/copyright)
- [Ландшафт 2026](/kb/instruments/landscape-2026)
