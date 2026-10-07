---
sidebar_position: 3
last_updated: 2026-10-07
---

# ВКонтакте

Архивация ВКонтакте возможна через официальный API VK и сторонние инструменты.

## Официальный API

### Получение токена

1. Создайте Standalone-приложение на [dev.vk.com](https://dev.vk.com/).
2. Получите `client_id`.
3. Авторизуйтесь и получите `access_token` с правами на чтение сообществ и постов.

### Скрипт для архивации сообщества

```python
import requests
import json
import time

TOKEN = "ваш_токен"
GROUP_ID = -123456  # отрицательный = группа
API_VERSION = "5.199"

def fetch_posts(group_id, offset=0):
    response = requests.get(
        "https://api.vk.com/method/wall.get",
        params={
            "owner_id": group_id,
            "offset": offset,
            "count": 100,
            "access_token": TOKEN,
            "v": API_VERSION,
        }
    )
    return response.json()

all_posts = []
offset = 0
while True:
    data = fetch_posts(GROUP_ID, offset)
    items = data.get("response", {}).get("items", [])
    if not items:
        break
    all_posts.extend(items)
    offset += 100
    time.sleep(0.5)  # соблюдаем лимиты API

with open("vk_archive.json", "w", encoding="utf-8") as f:
    json.dump(all_posts, f, ensure_ascii=False, indent=2)
```

## Ограничения API

- **3 запроса в секунду** — лимит VK API.
- **Без токена** — доступны только 5 последних постов сообщества.
- **Закрытые сообщества** — только для участников.
- **Личные сообщения** — через API не доступны (только официальный экспорт VK).

## Дополнительные методы

### VK Admin Export

Владельцы сообществ могут выгрузить базовую статистику через
[VK Admin](https://vk.com/admin) → Статистика → Экспорт.

### Парсинг HTML (как крайняя мера)

Если API недоступен, можно собрать HTML-страницы сообщества через Wget и извлечь
метаданные. Это менее надёжно — VK часто обфусцирует разметку.

## Инструменты Ruarxive

Для VK пока нет готового инструмента от Ruarxive (как `wparc` для WordPress).
Это одна из приоритетных задач — см. [Задача для волонтёров-разработчиков](/kb/volunteers/volunteers-tasks).

## Личные данные

При архивации ВКонтакте помните о [персональных данных](/kb/legal/personal-data).
Сохранение постов конкретных пользователей требует их согласия либо правового основания.