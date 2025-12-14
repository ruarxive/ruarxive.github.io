---
sidebar_position: 1
---

# APIbackuper

[APIbackuper](https://github.com/ruarxive/apibackuper) — это инструмент командной строки и Python-библиотека для архивирования и резервного копирования данных из REST API.

Он разработан специально для задач сохранения государственных открытых данных (например, портала Электронный бюджет), но подходит для любого API, поддерживающего итеративный сбор данных.

## Основные возможности

*   **Универсальность**: Поддержка любых итеративных GET/POST API.
*   **Оценка**: Возможность оценить время и объем данных перед скачиванием (`estimate`).
*   **Хранение**: Данные сохраняются в ZIP-контейнерах для экономии места.
*   **Экспорт**: Встроенный экспорт в JSONL, Parquet, Gzip.
*   **Гибкая настройка**: Конфигурация через YAML или INI файлы.
*   **Аутентификация**: Поддержка Basic, Bearer Token, API Key, OAuth2.
*   **Rate Limiting**: Встроенные механизмы ограничения скорости запросов.

## Установка

Требуется Python 3.6+.

```bash
pip install apibackuper
```

## Быстрый старт

### 1. Создание проекта

```bash
apibackuper create myproject
```
Это создаст папку `myproject` с файлом конфигурации `config.yaml` (или `config.ini`).

### 2. Настройка

Отредактируйте `config.yaml` в папке проекта. Укажите URL API и параметры перебора страниц.

```yaml
project:
  name: myproject
  
storage:
  type: zip
  file: data.zip

request:
  url: "https://api.example.com/items"
  method: GET
  params:
    page: 1
    per_page: 100
  iterator:
    param: page
    start: 1
    step: 1
```

### 3. Оценка (Estimate)

Проверьте, сколько данных предстоит скачать.

```bash
apibackuper estimate full -p myproject
```

### 4. Запуск (Run)

Запустите процесс архивации.

```bash
apibackuper run full -p myproject
```

### 5. Экспорт данных

После завершения скачивания можно выгрузить данные из ZIP-архива в удобный формат.

```bash
# Экспорт в JSON Lines
apibackuper export output.jsonl -p myproject

# Экспорт в Parquet (для анализа в Pandas/DuckDB)
apibackuper export data.parquet -p myproject
```

## Продвинутые функции

### Аутентификация

```yaml
auth:
  type: bearer
  token: "YOUR_SECRET_TOKEN"
```

### Ограничение скорости (Rate Limiting)

Чтобы не получить бан от API:

```yaml
rate_limit:
  enabled: true
  requests_per_second: 5
```

Подробную документацию и примеры конфигураций для разных государственных систем можно найти в [репозитории на GitHub](https://github.com/ruarxive/apibackuper).
