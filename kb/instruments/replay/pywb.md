# PYWB

**PYWB** — это Python 3 реализация инструментов воспроизведения веб-архивов, иногда также известная как 'Wayback Machine'.

## Описание

PYWB — это современная реализация Wayback Machine на Python, которая предоставляет веб-интерфейс и API для просмотра веб-архивов.

### Особенности

*   **Python 3**: Написано на Python 3
*   **Современная архитектура**: Модульная архитектура
*   **WARC & WACZ**: Поддержка обоих форматов
*   **Простота установки**: Легко установить и настроить

## Установка

### Через pip

```bash
pip install pywb
```

### Из исходников

```bash
git clone https://github.com/webrecorder/pywb
cd pywb
pip install -e .
```

## Использование

### Базовый запуск

```bash
wayback
```

Откроет веб-сервер на `http://localhost:8080`.

### С указанием директории WARC

```bash
wayback --collection-dir=/path/to/warcs
```

### С WACZ файлами

```bash
wayback --wacz=/path/to/archive.wacz
```

## Настройка

### Конфигурационный файл

Создайте файл `config.yaml`:

```yaml
collections:
  my_collection:
    index_paths:
      - /path/to/warcs
    archive_paths:
      - /path/to/warcs
```

### Запуск с конфигурацией

```bash
wayback --config=config.yaml
```

## Веб-интерфейс

### Просмотр архивов

Откройте браузер на `http://localhost:8080/my_collection/` для доступа к коллекции.

### Поиск

Используйте поисковую строку для поиска по URL или дате.

### Календарь

Используйте календарь для выбора конкретной даты.

## API

### CDX API

```bash
curl "http://localhost:8080/my_collection/cdx?url=http://example.com/"
```

### Memento API

```bash
curl "http://localhost:8080/my_collection/timemap/link/http://example.com/"
```

### Replay API

```bash
curl "http://localhost:8080/my_collection/20140101120000/http://example.com/"
```

## Сравнение с OpenWayback

| Функция | PYWB | OpenWayback | Победитель |
| :--- | :--- | :--- | :--- |
| Язык | Python | Java | Зависит от окружения |
| Простота установки | ✅ Высокая | ⚠️ Средняя | PYWB |
| WACZ поддержка | ✅ | ❌ | PYWB |
| Производительность | ⚠️ Средняя | ✅ Высокая | OpenWayback |
| Активность разработки | ✅ Высокая | ⚠️ Средняя | PYWB |

### Когда использовать PYWB

*   Новая установка
*   Python окружение
*   Нужна поддержка WACZ
*   Простота установки и настройки

### Когда использовать OpenWayback

*   Существующие установки на Java
*   Требуется высокая производительность
*   Java экосистема
*   Классическая установка

## Best practices

### Организация коллекций

*   Создавайте отдельные коллекции для разных проектов
*   Используйте описательные названия
*   Организуйте WARC файлы логически

### Оптимизация производительности

*   Используйте CDX индексы
*   Настройте кэширование
*   Оптимизируйте размеры WARC файлов

### Мониторинг

*   Мониторьте использование ресурсов
*   Проверяйте логи на ошибки
*   Регулярно обновляйте индексы

## Ресурсы

*   [GitHub репозиторий](https://github.com/webrecorder/pywb)
*   [Документация](https://github.com/webrecorder/pywb/wiki)

## Связанные материалы

- [OpenWayback для сравнения](/kb/instruments/replay/openwayback)
- [ReplayWeb.page для локального просмотра](/kb/instruments/replay/replayweb-page)
- [Формат WARC](/kb/instruments/file-formats/warc)
- [Формат WACZ](/kb/instruments/file-formats/wacz)
