---
sidebar_position: 4
---

# Создание кастомных workflow для архивации

Руководство по созданию автоматизированных процессов архивации, объединяющих несколько инструментов Ruarxive в единый workflow.

## Зачем нужны кастомные workflow

Стандартные инструменты решают отдельные задачи, но реальные проекты часто требуют:

*   **Комбинации инструментов**: Использование нескольких инструментов для одного ресурса
*   **Автоматизации**: Запуск процессов без ручного вмешательства
*   **Обработки данных**: Преобразование и валидация данных между этапами
*   **Мониторинга**: Отслеживание прогресса и обработка ошибок
*   **Повторяемости**: Возможность запускать процесс многократно

## Архитектура workflow

### Базовый workflow

```
┌─────────────┐
│   Анализ    │ → Определение структуры ресурса
└─────────────┘
      ↓
┌─────────────┐
│  Планирование │ → Выбор инструментов и стратегии
└─────────────┘
      ↓
┌─────────────┐
│  Архивация  │ → Запуск инструментов
└─────────────┘
      ↓
┌─────────────┐
│  Верификация │ → Проверка целостности
└─────────────┘
      ↓
┌─────────────┐
│  Обработка  │ → Преобразование данных
└─────────────┘
      ↓
┌─────────────┐
│   Хранение  │ → Упаковка и сохранение
└─────────────┘
```

## Примеры workflow

### Workflow 1: Комплексный веб-ресурс

Архивация сайта с WordPress, API и статическими файлами.

```bash
#!/bin/bash
# archive-complex-site.sh

set -e  # Остановка при ошибке

SITE_URL="$1"
OUTPUT_DIR="./archive-$(date +%Y%m%d)"
PROJECT_NAME="complex-site"

# Создание структуры
mkdir -p "$OUTPUT_DIR"/{wordpress,api,static,logs}

echo "=== Этап 1: Анализ структуры ==="
# Проверка WordPress API
if curl -s "$SITE_URL/wp-json/wp/v2/" > /dev/null 2>&1; then
  echo "✓ WordPress API доступен"
  HAS_WORDPRESS=true
else
  echo "✗ WordPress API недоступен"
  HAS_WORDPRESS=false
fi

# Проверка REST API
if curl -s "$SITE_URL/api/v1/health" > /dev/null 2>&1; then
  echo "✓ REST API доступен"
  HAS_API=true
else
  echo "✗ REST API недоступен"
  HAS_API=false
fi

echo "=== Этап 2: Архивация WordPress ==="
if [ "$HAS_WORDPRESS" = true ]; then
  wparc "$SITE_URL" \
    --output "$OUTPUT_DIR/wordpress" \
    2>&1 | tee "$OUTPUT_DIR/logs/wordpress.log"
  
  if [ $? -eq 0 ]; then
    echo "✓ WordPress архивация завершена"
  else
    echo "✗ Ошибка при архивации WordPress"
    exit 1
  fi
fi

echo "=== Этап 3: Архивация API ==="
if [ "$HAS_API" = true ]; then
  # Создание конфигурации apibackuper
  cat > "$OUTPUT_DIR/api_config.yaml" << EOF
project:
  name: $PROJECT_NAME-api
request:
  url: "$SITE_URL/api/v1/data"
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
storage:
  type: zip
  file: "$OUTPUT_DIR/api/api_data.zip"
EOF

  apibackuper run full -p "$PROJECT_NAME-api" \
    2>&1 | tee "$OUTPUT_DIR/logs/api.log"
  
  if [ $? -eq 0 ]; then
    echo "✓ API архивация завершена"
  else
    echo "✗ Ошибка при архивации API"
  fi
fi

echo "=== Этап 4: Скачивание статических файлов ==="
# Создание конфигурации filegetter
cat > "$OUTPUT_DIR/filegetter_config.yaml" << EOF
patterns:
  - url: "$SITE_URL/files/{id}.pdf"
    range:
      start: 1
      end: 1000
output:
  directory: "$OUTPUT_DIR/static"
download:
  threads: 5
  retries: 3
EOF

filegetter --config "$OUTPUT_DIR/filegetter_config.yaml" \
  2>&1 | tee "$OUTPUT_DIR/logs/filegetter.log"

echo "=== Этап 5: Верификация ==="
# Проверка наличия файлов
if [ -f "$OUTPUT_DIR/wordpress/posts.json" ]; then
  POSTS_COUNT=$(jq 'length' "$OUTPUT_DIR/wordpress/posts.json")
  echo "✓ WordPress: $POSTS_COUNT постов"
fi

if [ -f "$OUTPUT_DIR/api/api_data.zip" ]; then
  ZIP_SIZE=$(du -h "$OUTPUT_DIR/api/api_data.zip" | cut -f1)
  echo "✓ API: архив размером $ZIP_SIZE"
fi

echo "=== Этап 6: Создание финального архива ==="
tar -czf "${PROJECT_NAME}-$(date +%Y%m%d).tar.gz" "$OUTPUT_DIR"
echo "✓ Финальный архив создан: ${PROJECT_NAME}-$(date +%Y%m%d).tar.gz"

echo "=== Workflow завершён ==="
```

### Workflow 2: Социальные сети и веб-сайт

Архивация Telegram канала, Instagram аккаунта и связанного веб-сайта.

```python
#!/usr/bin/env python3
# archive-social-media-workflow.py

import subprocess
import json
import os
from datetime import datetime
from pathlib import Path

class ArchiveWorkflow:
    def __init__(self, project_name, output_dir):
        self.project_name = project_name
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(parents=True, exist_ok=True)
        self.logs = []
    
    def log(self, message):
        print(f"[{datetime.now()}] {message}")
        self.logs.append(f"[{datetime.now()}] {message}")
    
    def run_command(self, cmd, description):
        self.log(f"Запуск: {description}")
        try:
            result = subprocess.run(
                cmd,
                shell=True,
                capture_output=True,
                text=True,
                check=True
            )
            self.log(f"✓ {description} завершён успешно")
            return result.stdout
        except subprocess.CalledProcessError as e:
            self.log(f"✗ Ошибка при {description}: {e.stderr}")
            raise
    
    def archive_telegram(self, channel_name, config_file):
        """Архивация Telegram канала"""
        output_path = self.output_dir / "telegram"
        output_path.mkdir(exist_ok=True)
        
        cmd = f"tgarc download --target {channel_name} --output {output_path} --config {config_file}"
        self.run_command(cmd, f"Архивация Telegram канала {channel_name}")
        
        # Проверка результата
        messages_file = output_path / "messages.jsonl"
        if messages_file.exists():
            count = sum(1 for _ in open(messages_file))
            self.log(f"  Сохранено сообщений: {count}")
    
    def archive_instagram(self, username, output_path):
        """Архивация Instagram (используя data-take-out)"""
        # Здесь можно использовать инструменты для Instagram
        self.log(f"Архивация Instagram аккаунта {username}")
        # Реализация зависит от доступных инструментов
    
    def archive_website(self, url, method="wget"):
        """Архивация веб-сайта"""
        output_path = self.output_dir / "website"
        output_path.mkdir(exist_ok=True)
        
        if method == "wget":
            cmd = f"wget --recursive --page-requisites --convert-links --adjust-extension --no-parent --directory-prefix={output_path} {url}"
        elif method == "wparc":
            # Проверка WordPress API
            check_cmd = f"curl -s {url}/wp-json/wp/v2/"
            result = subprocess.run(check_cmd, shell=True, capture_output=True)
            if result.returncode == 0:
                cmd = f"wparc {url} --output {output_path}"
            else:
                cmd = f"wget --recursive --page-requisites --convert-links --adjust-extension --no-parent --directory-prefix={output_path} {url}"
        
        self.run_command(cmd, f"Архивация веб-сайта {url}")
    
    def create_index(self):
        """Создание индексного файла"""
        index = {
            "project": self.project_name,
            "date": datetime.now().isoformat(),
            "components": []
        }
        
        # Сканирование директорий
        for component_dir in self.output_dir.iterdir():
            if component_dir.is_dir():
                component_info = {
                    "name": component_dir.name,
                    "path": str(component_dir.relative_to(self.output_dir)),
                    "size": sum(f.stat().st_size for f in component_dir.rglob('*') if f.is_file()),
                    "files": sum(1 for f in component_dir.rglob('*') if f.is_file())
                }
                index["components"].append(component_info)
        
        index_file = self.output_dir / "index.json"
        with open(index_file, 'w', encoding='utf-8') as f:
            json.dump(index, f, indent=2, ensure_ascii=False)
        
        self.log(f"✓ Индекс создан: {index_file}")
    
    def save_logs(self):
        """Сохранение логов"""
        log_file = self.output_dir / "workflow.log"
        with open(log_file, 'w', encoding='utf-8') as f:
            f.write('\n'.join(self.logs))
        self.log(f"✓ Логи сохранены: {log_file}")

# Использование
if __name__ == "__main__":
    workflow = ArchiveWorkflow(
        project_name="social-media-project",
        output_dir="./archive-social"
    )
    
    # Архивация Telegram
    workflow.archive_telegram("channel_name", "tg_config.yaml")
    
    # Архивация веб-сайта
    workflow.archive_website("https://example.com", method="wparc")
    
    # Создание индекса
    workflow.create_index()
    
    # Сохранение логов
    workflow.save_logs()
    
    print("Workflow завершён!")
```

### Workflow 3: Автоматическая регулярная архивация

```python
#!/usr/bin/env python3
# scheduled-archive-workflow.py

import schedule
import time
import subprocess
from datetime import datetime
import json

def archive_api():
    """Регулярная архивация API"""
    print(f"[{datetime.now()}] Запуск архивации API...")
    
    # Проверка новых данных
    result = subprocess.run(
        "apibackuper estimate incremental -p my-api --since $(date -d '7 days ago' +%Y-%m-%d)",
        shell=True,
        capture_output=True,
        text=True
    )
    
    # Парсинг результата
    if "records" in result.stdout:
        # Запуск инкрементальной архивации
        subprocess.run("apibackuper run incremental -p my-api", shell=True)
        print("✓ Архивация API завершена")
    else:
        print("Новых данных не найдено")

def archive_telegram_channels():
    """Регулярная архивация Telegram каналов"""
    print(f"[{datetime.now()}] Запуск архивации Telegram...")
    
    channels = ["channel1", "channel2", "channel3"]
    
    for channel in channels:
        subprocess.run(
            f"tgarc download --target {channel} --output ./telegram-archive/{channel} --incremental",
            shell=True
        )
    
    print("✓ Архивация Telegram завершена")

def generate_report():
    """Генерация отчёта о статусе архивов"""
    print(f"[{datetime.now()}] Генерация отчёта...")
    
    # Сбор статистики
    report = {
        "date": datetime.now().isoformat(),
        "archives": {}
    }
    
    # Здесь можно добавить сбор статистики
    # или анализ локальных архивов
    
    with open("archive-report.json", "w") as f:
        json.dump(report, f, indent=2)
    
    print("✓ Отчёт создан")

# Настройка расписания
schedule.every().day.at("02:00").do(archive_api)
schedule.every().day.at("03:00").do(archive_telegram_channels)
schedule.every().sunday.at("04:00").do(generate_report)

print("Планировщик запущен. Ожидание задач...")

while True:
    schedule.run_pending()
    time.sleep(60)
```

## Обработка ошибок

### Retry механизм

```python
import time
from functools import wraps

def retry(max_attempts=3, delay=5):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            for attempt in range(max_attempts):
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    if attempt == max_attempts - 1:
                        raise
                    print(f"Попытка {attempt + 1} не удалась: {e}. Повтор через {delay} сек...")
                    time.sleep(delay)
        return wrapper
    return decorator

@retry(max_attempts=3, delay=10)
def archive_with_retry(url):
    subprocess.run(f"wget -r {url}", shell=True, check=True)
```

### Проверка зависимостей

```bash
#!/bin/bash
# check-dependencies.sh

check_command() {
    if ! command -v "$1" &> /dev/null; then
        echo "✗ $1 не установлен"
        return 1
    else
        echo "✓ $1 установлен"
        return 0
    fi
}

ERRORS=0

check_command wget || ERRORS=$((ERRORS + 1))
check_command apibackuper || ERRORS=$((ERRORS + 1))
check_command wparc || ERRORS=$((ERRORS + 1))
check_command tgarc || ERRORS=$((ERRORS + 1))
check_command filegetter || ERRORS=$((ERRORS + 1))
check_command jq || ERRORS=$((ERRORS + 1))

if [ $ERRORS -gt 0 ]; then
    echo "Обнаружено $ERRORS отсутствующих инструментов"
    exit 1
fi

echo "Все зависимости установлены"
```

## Мониторинг и логирование

### Структурированное логирование

```python
import logging
from logging.handlers import RotatingFileHandler

def setup_logging(log_file="workflow.log"):
    logger = logging.getLogger("archive_workflow")
    logger.setLevel(logging.INFO)
    
    # Файловый handler с ротацией
    file_handler = RotatingFileHandler(
        log_file,
        maxBytes=10*1024*1024,  # 10 MB
        backupCount=5
    )
    file_handler.setFormatter(
        logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')
    )
    
    # Консольный handler
    console_handler = logging.StreamHandler()
    console_handler.setFormatter(
        logging.Formatter('%(levelname)s - %(message)s')
    )
    
    logger.addHandler(file_handler)
    logger.addHandler(console_handler)
    
    return logger

logger = setup_logging()

logger.info("Запуск workflow")
logger.error("Ошибка при архивации")
```

## Лучшие практики

1. **Идемпотентность**: Workflow должен быть безопасным для повторного запуска
2. **Логирование**: Ведите подробные логи всех операций
3. **Проверки**: Проверяйте результаты каждого этапа
4. **Обработка ошибок**: Обрабатывайте ошибки gracefully
5. **Документация**: Документируйте workflow и его параметры
6. **Тестирование**: Тестируйте на небольших объёмах перед полным запуском

## Связанные материалы

- [Архивация комплексных ресурсов](/kb/case-studies/multi-tool-archiving)
- [Все инструменты Ruarxive](/kb/instruments/ruarxive-tools)
- [APIBackuper документация](/kb/instruments/downloaded-data/apibackuper)
