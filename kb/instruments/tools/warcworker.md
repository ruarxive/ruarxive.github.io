# Warcworker

**Warcworker** — это открытый, dockerized, queued, high fidelity веб-архиватор на основе Squidwarc с простым веб-интерфейсом.

## Описание

Warcworker объединяет возможности Squidwarc с системой очередей и веб-интерфейсом для удобного управления архивацией.

### Особенности

*   **Dockerized**: Работает в Docker контейнере
*   **Queued**: Система очередей для управления заданиями
*   **High fidelity**: Высококачественная архивация через Chrome
*   **Веб-интерфейс**: Простой веб-интерфейс для управления

## Установка

### Через Docker

```bash
docker pull warcworker/warcworker
docker run -d -p 3000:3000 warcworker/warcworker
```

### Docker Compose

```yaml
version: '3'
services:
  warcworker:
    image: warcworker/warcworker
    ports:
      - "3000:3000"
    volumes:
      - ./data:/data
```

```bash
docker-compose up -d
```

## Использование

### Веб-интерфейс

Откройте браузер на `http://localhost:3000` для доступа к веб-интерфейсу.

### Добавление задания

1. В веб-интерфейсе нажмите "Add Job"
2. Введите URL для архивации
3. Настройте параметры
4. Нажмите "Start"

### Через API

```bash
curl -X POST http://localhost:3000/api/jobs \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com", "options": {}}'
```

## Система очередей

Warcworker использует систему очередей для управления заданиями:

*   **Очередь заданий**: Все задания добавляются в очередь
*   **Обработка**: Воркеры обрабатывают задания из очереди
*   **Мониторинг**: Веб-интерфейс показывает статус заданий

## Конфигурация

### Переменные окружения

```bash
docker run -d \
  -p 3000:3000 \
  -e MAX_CONCURRENT_JOBS=3 \
  -e WARC_OUTPUT_DIR=/data/warcs \
  warcworker/warcworker
```

### Конфигурационный файл

```json
{
  "maxConcurrentJobs": 3,
  "warcOutputDir": "/data/warcs",
  "chromeOptions": {
    "headless": true,
    "timeout": 30000
  }
}
```

## Best practices

### Ограничение параллельных заданий

```bash
docker run -d \
  -e MAX_CONCURRENT_JOBS=2 \
  warcworker/warcworker
```

### Настройка таймаутов

```json
{
  "chromeOptions": {
    "timeout": 60000,
    "pageTimeout": 30000
  }
}
```

### Мониторинг

Используйте веб-интерфейс для:
*   Просмотра активных заданий
*   Мониторинга прогресса
*   Просмотра логов
*   Управления очередью

## Сравнение

| Инструмент | Веб-интерфейс | Очередь | Docker | Рекомендация |
| :--- | :--- | :--- | :--- | :--- |
| **Warcworker** | ✅ | ✅ | ✅ | **Для управления заданиями** |
| **Squidwarc** | ❌ | ❌ | ❌ | Для интерактивной архивации |
| **Browsertrix** | Да (Cloud) | Нет | ✅ | Для организаций |

### Когда использовать Warcworker

*   Нужна система очередей для заданий
*   Требуется веб-интерфейс для управления
*   Docker окружение
*   Управление множественными заданиями

### Когда использовать другие инструменты

*   Интерактивная архивация (используйте Squidwarc)
*   Облачный сервис (используйте Browsertrix Cloud)
*   Простые случаи (используйте Browsertrix CLI)

## Ресурсы

*   [GitHub репозиторий](https://github.com/N0taN3rd/warcworker)
*   [Документация](https://github.com/N0taN3rd/warcworker/wiki)

## Связанные материалы

- [Squidwarc для сравнения](/kb/instruments/tools/squidwarc)
- [Browsertrix для организаций](/kb/instruments/tools/browsertricks)
- [Управление заданиями](/kb/guides/custom-workflows)
