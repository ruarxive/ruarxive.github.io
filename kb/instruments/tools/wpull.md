# Wpull

**Wpull** — это альтернатива/замена Wget, разработанная Archive Team специально для веб-архивации.

## Описание

Wpull создан как улучшенная версия Wget с лучшей поддержкой современных веб-стандартов и возможностью расширения через Python плагины.

### Особенности

*   **Современные стандарты**: Лучшая поддержка современных веб-технологий
*   **Python плагины**: Расширяемость через плагины
*   **Лучшая обработка JavaScript**: Ограниченная поддержка JavaScript сайтов
*   **WARC совместимость**: Создаёт WARC файлы

## Установка

### Через pip

```bash
pip install wpull
```

### Из исходников

```bash
git clone https://github.com/ArchiveTeam/wpull
cd wpull
pip install -e .
```

## Использование

### Базовое использование

```bash
wpull https://example.com
```

### Создание WARC

```bash
wpull --warc-file=archive.warc https://example.com
```

### Рекурсивная загрузка

```bash
wpull --recursive --level=3 https://example.com
```

### Ограничение домена

```bash
wpull --recursive --domains=example.com https://example.com
```

## Преимущества перед Wget

### 1. Лучшая поддержка современных стандартов

*   Поддержка HTTP/2
*   Лучшая обработка cookies
*   Поддержка современных заголовков

### 2. Python плагины

```python
# Пример плагина
def handle_response(response):
    # Кастомная обработка ответа
    pass
```

### 3. Лучшая обработка JavaScript

*   Ограниченная поддержка JavaScript сайтов
*   Обработка динамического контента
*   Поддержка AJAX запросов

### 4. WARC совместимость

*   Нативная поддержка WARC формата
*   Создание стандартных WARC файлов
*   Совместимость с инструментами воспроизведения

## Сравнение с Wget

| Функция | Wget | Wpull | Победитель |
| :--- | :--- | :--- | :--- |
| Простота | ✅ | ✅ | Ничья |
| WARC | ✅ (v1.14+) | ✅ | Ничья |
| JavaScript | ❌ | ⚠️ Ограниченная | Wpull |
| Плагины | ❌ | ✅ | Wpull |
| HTTP/2 | ⚠️ | ✅ | Wpull |
| Стабильность | ✅ | ⚠️ | Wget |

### Когда использовать Wpull

*   Нужна лучшая поддержка современных сайтов
*   Требуется расширяемость через плагины
*   Ограниченная поддержка JavaScript
*   Работа с современными веб-стандартами

### Когда использовать Wget

*   Максимальная стабильность
*   Простые статические сайты
*   Стандартные инструменты системы
*   Не нужны плагины

## Примеры использования

### Архивация с фильтрацией

```bash
wpull --recursive \
  --warc-file=archive.warc \
  --accept-regex='.*\.(html|css|js)$' \
  --reject-regex='.*\.(jpg|png|gif)$' \
  https://example.com
```

### С пользовательским user-agent

```bash
wpull --user-agent="Mozilla/5.0 (compatible; wpull/1.0)" \
  --recursive \
  https://example.com
```

### С задержками

```bash
wpull --wait=1 \
  --random-wait \
  --recursive \
  https://example.com
```

## Python плагины

### Создание плагина

```python
# my_plugin.py
def handle_response(response):
    if response.status_code == 200:
        # Обработка успешного ответа
        pass
    return response
```

### Использование плагина

```bash
wpull --plugin=my_plugin.py https://example.com
```

## Best practices

### Для больших сайтов

```bash
wpull --recursive \
  --level=5 \
  --warc-file=archive.warc \
  --warc-max-size=1000000000 \
  --max-files=100000 \
  https://example.com
```

### Для быстрой архивации

```bash
wpull --recursive \
  --warc-file=archive.warc \
  --no-wait \
  --concurrent=10 \
  https://example.com
```

## Ограничения

*   Менее стабилен, чем Wget
*   Ограниченная поддержка JavaScript (лучше использовать Browsertrix)
*   Требует Python окружения

## Ресурсы

*   [GitHub репозиторий](https://github.com/ArchiveTeam/wpull)
*   [Документация](https://wpull.readthedocs.io/)

## Связанные материалы

- [Wget для сравнения](/kb/guides/wget)
- [Browsertrix для JavaScript сайтов](/kb/instruments/tools/browsertricks)
- [Формат WARC](/kb/instruments/file-formats/warc)
