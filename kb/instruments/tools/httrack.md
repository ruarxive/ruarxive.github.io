# HTTrack

**HTTrack** — это бесплатный и открытый инструмент для копирования веб-сайтов на локальный компьютер.

## Описание

HTTrack позволяет скачивать веб-сайты на локальный компьютер для офлайн-просмотра, создавая зеркало сайта.

### Особенности

*   **Простота использования**: Графический интерфейс и командная строка
*   **Рекурсивная загрузка**: Скачивает весь сайт со структурой
*   **Офлайн-просмотр**: Конвертирует ссылки для локального просмотра
*   **Фильтрация**: Гибкие опции фильтрации контента

## Установка

### Windows

Скачайте установщик с [официального сайта](https://www.httrack.com/).

### Linux

```bash
# Ubuntu/Debian
sudo apt-get install httrack

# Fedora
sudo dnf install httrack
```

### macOS

```bash
brew install httrack
```

## Использование

### Графический интерфейс

Запустите `httrack` и следуйте мастеру настройки.

### Командная строка

```bash
httrack https://example.com -O /path/to/output
```

### Базовые опции

```bash
httrack https://example.com \
  -O /path/to/output \
  -r5 \
  -%p \
  --display
```

*   `-O`: Директория вывода
*   `-r5`: Глубина рекурсии (5 уровней)
*   `-%p`: Процент выполнения
*   `--display`: Показывать прогресс

## Конвертация в WARC

HTTrack создаёт файлы на диске, но их можно конвертировать в WARC формат.

### httrack2warc

[httrack2warc](https://github.com/iipc/httrack2warc) — инструмент для конвертации HTTrack архивов в WARC.

```bash
# Установка
git clone https://github.com/iipc/httrack2warc
cd httrack2warc
mvn package

# Использование
java -jar httrack2warc.jar /path/to/httrack/output output.warc
```

## Сравнение с Wget

| Инструмент | GUI | WARC | Простота | Рекомендация |
| :--- | :--- | :--- | :--- | :--- |
| **HTTrack** | Да | Через конвертацию | Высокая | **Для GUI пользователей** |
| **Wget** | Нет | Да (v1.14+) | Высокая | Для командной строки |
| **Browsertrix** | Да | Да | Средняя | Для JavaScript сайтов |

### Когда использовать HTTrack

*   Нужен графический интерфейс
*   Простые статические сайты
*   Быстрое копирование для офлайн-просмотра
*   Не требуется WARC формат напрямую

### Когда использовать Wget

*   Работа в командной строке
*   Нужен WARC формат
*   Автоматизация через скрипты
*   Интеграция в workflow

## Best practices

### Ограничения

```bash
httrack https://example.com \
  -O /path/to/output \
  -r3 \
  --max-files=10000 \
  --max-size=500M
```

### Фильтрация

```bash
httrack https://example.com \
  -O /path/to/output \
  +*.example.com/* \
  -*jpg \
  -*png
```

### Продолжение прерванной загрузки

```bash
httrack -c /path/to/output
```

## Ограничения

*   Не выполняет JavaScript
*   Не подходит для SPA приложений
*   Создаёт файлы, а не WARC (требуется конвертация)
*   Может быть медленнее специализированных инструментов

## Ресурсы

*   [Официальный сайт](https://www.httrack.com/)
*   [Документация](https://www.httrack.com/html/help.html)
*   [httrack2warc](https://github.com/iipc/httrack2warc)

## Связанные материалы

- [Wget для командной строки](/kb/guides/wget)
- [Конвертация в WARC](/kb/instruments/tools/warc-processing)
- [Формат WARC](/kb/instruments/file-formats/warc)
