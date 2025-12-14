# twarc

**twarc** — это командная строка и Python библиотека для архивации Twitter JSON данных.

## Описание

twarc использует Twitter API для архивации твитов, пользователей и других данных Twitter в формате JSON.

### Особенности

*   **Twitter API**: Использует официальный Twitter API
*   **JSON формат**: Сохраняет данные в JSON
*   **CLI и библиотека**: Можно использовать как инструмент или библиотеку
*   **Rate limiting**: Автоматически обрабатывает ограничения API

## Установка

### Через pip

```bash
pip install twarc
```

### Из исходников

```bash
git clone https://github.com/DocNow/twarc
cd twarc
pip install -e .
```

## Настройка

### Получение API ключей

1. Зарегистрируйтесь на [Twitter Developer Portal](https://developer.twitter.com/)
2. Создайте приложение
3. Получите API ключи (Consumer Key, Consumer Secret, Access Token, Access Token Secret)

### Настройка twarc

```bash
twarc configure
```

Введите ваши API ключи при запросе.

## Использование

### Архивация твитов пользователя

```bash
twarc timeline username > tweets.jsonl
```

### Архивация по поисковому запросу

```bash
twarc search "query" > search_results.jsonl
```

### Архивация твитов по ID

```bash
twarc hydrate ids.txt > tweets.jsonl
```

### Архивация пользователей

```bash
twarc users usernames.txt > users.jsonl
```

## Python библиотека

### Базовое использование

```python
from twarc import Twarc

t = Twarc()
for tweet in t.search("query"):
    print(tweet)
```

### Архивация timeline

```python
from twarc import Twarc

t = Twarc()
for tweet in t.timeline("username"):
    print(tweet)
```

## Формат данных

### JSON структура

Каждый твит сохраняется как JSON объект со всей информацией из Twitter API:

```json
{
  "id": "1234567890",
  "text": "Tweet text",
  "created_at": "Mon Jan 01 00:00:00 +0000 2024",
  "user": {
    "screen_name": "username",
    "name": "User Name"
  },
  "entities": {...},
  "retweet_count": 0,
  "favorite_count": 0
}
```

## Best practices

### Обработка rate limits

twarc автоматически обрабатывает rate limits, но можно настроить:

```bash
twarc --max-requests=100 search "query" > results.jsonl
```

### Продолжение прерванной архивации

```bash
# twarc запоминает последний обработанный ID
twarc timeline username > tweets.jsonl
```

### Фильтрация

```python
from twarc import Twarc
import json

t = Twarc()
for tweet in t.search("query"):
    tweet_data = json.loads(tweet)
    if tweet_data['retweet_count'] > 10:
        print(tweet)
```

## Ограничения

*   Требует Twitter API ключи
*   Ограничения API (rate limits)
*   Не архивирует медиа файлы напрямую (только ссылки)
*   Зависит от доступности Twitter API

## Сравнение с другими инструментами

| Инструмент | API | Формат | Медиа | Рекомендация |
| :--- | :--- | :--- | :--- | :--- |
| **twarc** | Twitter API | JSON | Ссылки | **Для Twitter данных** |
| **Social Feed Manager** | Множественные | Различные | Да | Для множественных платформ |
| **Browsertrix** | Нет | WARC | Да | Для веб-архивации |

## Ресурсы

*   [GitHub репозиторий](https://github.com/DocNow/twarc)
*   [Документация](https://github.com/DocNow/twarc/wiki)
*   [Twitter Developer Portal](https://developer.twitter.com/)

## Связанные материалы

- [Архивация Twitter через Data Take-Out](/kb/instruments/data-take-out/dto-twitter)
- [Social Feed Manager для множественных платформ](/kb/instruments/social-media/social-feed-manager)
- [Архивация социальных сетей](/kb/instruments/social-media)
