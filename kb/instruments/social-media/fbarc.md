# F(b)arc

**F(b)arc** — это командная строка и Python библиотека для архивации данных из Facebook через Graph API.

## Описание

F(b)arc использует Facebook Graph API для архивации постов, фотографий и других данных из Facebook.

### Особенности

*   **Facebook Graph API**: Использует официальный Facebook API
*   **CLI и библиотека**: Можно использовать как инструмент или библиотеку
*   **Множественные типы данных**: Посты, фотографии, видео, события
*   **JSON формат**: Сохраняет данные в JSON

## Установка

### Через pip

```bash
pip install fbarc
```

### Из исходников

```bash
git clone https://github.com/justinlittman/fbarc
cd fbarc
pip install -e .
```

## Настройка

### Получение Access Token

1. Зарегистрируйтесь на [Facebook Developers](https://developers.facebook.com/)
2. Создайте приложение
3. Получите Access Token с необходимыми разрешениями

### Настройка fbarc

```bash
export FB_ACCESS_TOKEN="your_access_token"
```

Или создайте файл конфигурации:

```bash
fbarc configure
```

## Использование

### Архивация страницы

```bash
fbarc page page_id > page_data.jsonl
```

### Архивация постов

```bash
fbarc posts page_id > posts.jsonl
```

### Архивация фотографий

```bash
fbarc photos page_id > photos.jsonl
```

### Архивация событий

```bash
fbarc events page_id > events.jsonl
```

## Python библиотека

### Базовое использование

```python
from fbarc import FBarc

fb = FBarc(access_token="your_token")
for post in fb.get_posts("page_id"):
    print(post)
```

### Архивация различных типов данных

```python
from fbarc import FBarc

fb = FBarc(access_token="your_token")

# Посты
for post in fb.get_posts("page_id"):
    print(post)

# Фотографии
for photo in fb.get_photos("page_id"):
    print(photo)

# События
for event in fb.get_events("page_id"):
    print(event)
```

## Формат данных

### JSON структура

Данные сохраняются в JSON формате со структурой Facebook Graph API:

```json
{
  "id": "post_id",
  "message": "Post text",
  "created_time": "2024-01-01T00:00:00+0000",
  "from": {
    "name": "Page Name",
    "id": "page_id"
  },
  "likes": {
    "summary": {
      "total_count": 100
    }
  }
}
```

## Best practices

### Обработка rate limits

Facebook API имеет rate limits. F(b)arc автоматически обрабатывает их, но можно настроить:

```python
from fbarc import FBarc
import time

fb = FBarc(access_token="your_token")
for post in fb.get_posts("page_id"):
    print(post)
    time.sleep(1)  # Пауза между запросами
```

### Сохранение медиа

```python
from fbarc import FBarc
import requests

fb = FBarc(access_token="your_token")
for photo in fb.get_photos("page_id"):
    photo_url = photo.get("source")
    if photo_url:
        response = requests.get(photo_url)
        with open(f"{photo['id']}.jpg", "wb") as f:
            f.write(response.content)
```

## Ограничения

*   Требует Facebook Access Token
*   Ограничения API (rate limits)
*   Ограниченный доступ к данным (зависит от разрешений)
*   Изменения в Facebook API могут влиять на работу

## Сравнение с другими инструментами

| Инструмент | API | Формат | Медиа | Рекомендация |
| :--- | :--- | :--- | :--- | :--- |
| **F(b)arc** | Facebook Graph API | JSON | Ссылки | **Для Facebook данных** |
| **Social Feed Manager** | Множественные | Различные | Да | Для множественных платформ |
| **Data Take-Out** | Facebook Export | HTML/JSON | Да | Для полного экспорта |

## Ресурсы

*   [GitHub репозиторий](https://github.com/justinlittman/fbarc)
*   [Документация](https://github.com/justinlittman/fbarc/wiki)
*   [Facebook Graph API](https://developers.facebook.com/docs/graph-api)

## Связанные материалы

- [Архивация Facebook через Data Take-Out](/kb/instruments/data-take-out/dto-facebook)
- [Social Feed Manager для множественных платформ](/kb/instruments/social-media/social-feed-manager)
- [Архивация социальных сетей](/kb/instruments/social-media)
