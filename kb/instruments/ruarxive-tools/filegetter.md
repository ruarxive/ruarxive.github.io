---
sidebar_position: 4
---

# filegetter

[filegetter](https://github.com/ruarxive/filegetter) — это инструмент командной строки для сбора файлов из публичных источников данных с использованием URL-паттернов и конфигурационных файлов.

Он полезен для массового скачивания файлов по заданным шаблонам URL, что часто требуется при архивации датасетов, документов или медиа-файлов с публичных ресурсов.

## Основные возможности

*   **Паттерны URL**: Поддержка шаблонов для генерации списка URL файлов
*   **Конфигурационные файлы**: Настройка через YAML или JSON
*   **Параллельная загрузка**: Поддержка многопоточной загрузки
*   **Повторные попытки**: Автоматический retry при ошибках
*   **Проверка целостности**: Опциональная проверка контрольных сумм
*   **Гибкая фильтрация**: Фильтрация по расширениям, размерам и другим параметрам

## Установка

Требуется Python 3.6+.

```bash
pip install filegetter
```

## Быстрый старт

### 1. Создание конфигурации

Создайте файл `config.yaml`:

```yaml
patterns:
  - url: "https://example.com/files/{id}.pdf"
    range:
      start: 1
      end: 100
      step: 1
  
  - url: "https://archive.example.org/data/{year}/{month:02d}/report.pdf"
    range:
      year: [2020, 2021, 2022]
      month: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]

output:
  directory: "./downloads"
  create_subdirs: true

download:
  threads: 5
  retries: 3
  timeout: 30
```

### 2. Запуск загрузки

```bash
filegetter --config config.yaml
```

### 3. Использование с URL-паттернами напрямую

Для простых случаев можно указать паттерн прямо в командной строке:

```bash
filegetter --pattern "https://example.com/files/{id}.pdf" --range 1-100 --output ./files
```

## Примеры использования

### Скачивание последовательных файлов

```yaml
patterns:
  - url: "https://data.gov.ru/files/dataset_{id:04d}.csv"
    range:
      start: 1
      end: 500
```

### Скачивание файлов по датам

```yaml
patterns:
  - url: "https://archive.example.com/{year}/{month:02d}/{day:02d}/report.pdf"
    range:
      year: 2023
      month: [1, 2, 3]
      day: range(1, 32)
```

### Фильтрация по типам файлов

```yaml
patterns:
  - url: "https://example.com/{filename}"
    files: ["doc1.pdf", "doc2.pdf", "doc3.xlsx"]

filters:
  extensions: [".pdf", ".doc", ".docx"]
  min_size: 1024  # минимум 1KB
  max_size: 10485760  # максимум 10MB
```

## Интеграция с другими инструментами

### Использование с apibackuper

filegetter можно использовать для получения списка URL из API, а затем скачивать файлы:

```bash
# Получаем список URL через API
apibackuper export urls.jsonl -p myproject

# Извлекаем URL и скачиваем файлы
filegetter --from-jsonl urls.jsonl --field url --output ./files
```

### Использование в скриптах

```python
from filegetter import FileGetter

config = {
    "patterns": [{
        "url": "https://example.com/{id}.pdf",
        "range": {"start": 1, "end": 100}
    }],
    "output": {"directory": "./downloads"}
}

getter = FileGetter(config)
getter.download_all()
```

## Продвинутые функции

### Проверка контрольных сумм

```yaml
verification:
  checksums: true
  algorithm: sha256
  checksum_file: "checksums.txt"
```

### Прокси и аутентификация

```yaml
network:
  proxy: "http://proxy.example.com:8080"
  auth:
    type: basic
    username: "user"
    password: "pass"
```

### Ограничение скорости

```yaml
rate_limit:
  enabled: true
  requests_per_second: 10
```

## Ограничения

*   Работает только с публично доступными файлами
*   Не обходит защиту от скачивания (CAPTCHA, авторизация)
*   Требует стабильного интернет-соединения для больших объемов

## Связанные материалы

- [Все инструменты Ruarxive](/kb/instruments/ruarxive-tools)
- [Руководства по архивации](/kb/guides)
- [Создание кастомных workflow](/kb/guides/custom-workflows)
- [Репозиторий на GitHub](https://github.com/ruarxive/filegetter)
