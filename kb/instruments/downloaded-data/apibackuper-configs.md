---
sidebar_position: 3
---

# Конфигурации APIBackuper

[apibackuper-dataarchive](https://github.com/ruarxive/apibackuper-dataarchive) — это репозиторий с готовыми конфигурационными файлами для [APIBackuper](https://github.com/ruarxive/apibackuper), которые можно использовать для архивации различных государственных и публичных API.

## Назначение

Репозиторий содержит проверенные конфигурации для:

*   **Быстрого старта**: Не нужно создавать конфигурацию с нуля
*   **Примеров**: Изучение лучших практик настройки
*   **Стандартизации**: Единый подход к архивации похожих API
*   **Совместного использования**: Конфигурации можно улучшать сообща

## Использование готовых конфигураций

### 1. Клонирование репозитория

```bash
git clone https://github.com/ruarxive/apibackuper-dataarchive.git
cd apibackuper-dataarchive
```

### 2. Выбор конфигурации

Просмотрите доступные конфигурации в репозитории:

```bash
ls -la configs/
```

### 3. Использование конфигурации

Скопируйте нужную конфигурацию в ваш проект:

```bash
# Создаём новый проект
apibackuper create myproject

# Копируем конфигурацию
cp apibackuper-dataarchive/configs/example-api/config.yaml myproject/
```

### 4. Настройка под ваши нужды

Отредактируйте `config.yaml` в вашем проекте:

```yaml
project:
  name: myproject  # Измените название
  
# Остальная конфигурация уже готова
```

### 5. Запуск архивации

```bash
# Оценка объёма данных
apibackuper estimate full -p myproject

# Запуск архивации
apibackuper run full -p myproject
```

## Примеры конфигураций

### Государственные API

#### Электронный бюджет

Конфигурация для архивации данных с портала Электронный бюджет:

```yaml
project:
  name: budget-api
  
storage:
  type: zip
  file: budget_data.zip

request:
  url: "https://budget.gov.ru/epbs/registry/7710568760-BUDGET/data"
  method: GET
  params:
    page: 1
    per_page: 100
  iterator:
    param: page
    start: 1
    step: 1

rate_limit:
  enabled: true
  requests_per_second: 5
```

#### Портал открытых данных

Конфигурация для архивации наборов данных:

```yaml
project:
  name: opendata-portal
  
request:
  url: "https://data.gov.ru/api/datasets"
  method: GET
  params:
    page: 1
  iterator:
    param: page
    start: 1
    step: 1
    max_pages: 1000

auth:
  type: api_key
  key: "YOUR_API_KEY"
  header: "X-API-Key"
```

### API с пагинацией

#### Стандартная пагинация по страницам

```yaml
request:
  url: "https://api.example.com/items"
  method: GET
  params:
    page: 1
    limit: 50
  iterator:
    param: page
    start: 1
    step: 1
```

#### Пагинация по offset

```yaml
request:
  url: "https://api.example.com/items"
  method: GET
  params:
    offset: 0
    limit: 100
  iterator:
    param: offset
    start: 0
    step: 100
```

#### Пагинация по курсору

```yaml
request:
  url: "https://api.example.com/items"
  method: GET
  params:
    cursor: ""
  iterator:
    type: cursor
    cursor_field: "next_cursor"
    response_field: "data"
```

### API с аутентификацией

#### Bearer Token

```yaml
auth:
  type: bearer
  token: "YOUR_TOKEN_HERE"
```

#### Basic Authentication

```yaml
auth:
  type: basic
  username: "user"
  password: "pass"
```

#### OAuth2

```yaml
auth:
  type: oauth2
  client_id: "YOUR_CLIENT_ID"
  client_secret: "YOUR_CLIENT_SECRET"
  token_url: "https://api.example.com/oauth/token"
  scope: "read"
```

## Паттерны конфигураций

### Ограничение скорости

Для API с ограничениями:

```yaml
rate_limit:
  enabled: true
  requests_per_second: 2
  burst: 5
```

### Обработка ошибок

```yaml
error_handling:
  retries: 3
  retry_delay: 5
  skip_errors: false
  error_codes: [429, 500, 502, 503]
```

### Фильтрация данных

```yaml
filters:
  date_from: "2020-01-01"
  date_to: "2023-12-31"
  status: ["active", "published"]
```

## Создание собственной конфигурации

### Шаблон базовой конфигурации

```yaml
project:
  name: my-api-project
  
storage:
  type: zip
  file: data.zip

request:
  url: "https://api.example.com/endpoint"
  method: GET
  params:
    # Параметры запроса
  iterator:
    # Настройки итерации

rate_limit:
  enabled: true
  requests_per_second: 5
```

### Шаги создания

1. **Изучите API документацию**
   - Найдите эндпоинт для получения данных
   - Определите параметры пагинации
   - Проверьте требования к аутентификации

2. **Протестируйте запрос**
   ```bash
   curl "https://api.example.com/endpoint?page=1"
   ```

3. **Создайте базовую конфигурацию**
   - Укажите URL и метод
   - Настройте параметры пагинации
   - Добавьте аутентификацию при необходимости

4. **Протестируйте с estimate**
   ```bash
   apibackuper estimate full -p myproject
   ```

5. **Запустите на небольшом объёме**
   - Ограничьте количество страниц для теста
   - Проверьте качество данных

## Вклад в репозиторий

### Добавление новой конфигурации

1. **Создайте папку для конфигурации**
   ```bash
   mkdir configs/my-api-name
   ```

2. **Добавьте конфигурационный файл**
   - `config.yaml` — основная конфигурация
   - `README.md` — описание API и инструкции

3. **Создайте pull request**
   - Опишите, для какого API конфигурация
   - Укажите особенности и ограничения
   - Добавьте примеры использования

### Улучшение существующих конфигураций

*   Исправление ошибок
*   Добавление новых параметров
*   Улучшение документации
*   Оптимизация производительности

## Лучшие практики

### Именование проектов

Используйте понятные имена:
- ✅ `budget-api-2023`
- ✅ `opendata-datasets`
- ❌ `project1`
- ❌ `test`

### Документирование

Добавляйте комментарии в конфигурацию:

```yaml
# Конфигурация для архивации данных Электронного бюджета
# API: https://budget.gov.ru/epbs/
# Документация: https://budget.gov.ru/epbs/docs/
project:
  name: budget-api
```

### Версионирование

Сохраняйте старые версии конфигураций при изменениях API:

```
configs/
  my-api/
    config.yaml (текущая)
    config-v1.yaml (старая версия)
```

### Тестирование

Всегда тестируйте конфигурацию перед использованием:

```bash
# Оценка объёма
apibackuper estimate full -p myproject

# Тестовый запуск на небольшом объёме
apibackuper run test -p myproject --max-pages 5
```

## Связанные материалы

- [APIBackuper документация](/kb/instruments/downloaded-data/apibackuper)
- [Создание кастомных workflow](/kb/guides/custom-workflows)
- [Репозиторий конфигураций на GitHub](https://github.com/ruarxive/apibackuper-dataarchive)
