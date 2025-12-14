# BagIt

**BagIt** — это стандарт упаковки цифровых объектов для передачи и хранения, разработанный Библиотекой Конгресса США.

## Описание

BagIt определяет иерархическую файловую структуру для упаковки цифровых объектов вместе с их метаданными и контрольными суммами.

### Особенности

*   **Стандартизация**: Стандарт для упаковки цифровых объектов
*   **Целостность**: Встроенная проверка целостности через контрольные суммы
*   **Метаданные**: Поддержка метаданных
*   **Переносимость**: Легко переносить между системами

## Структура Bag

### Базовая структура

```
my-bag/
├── bagit.txt
├── manifest-md5.txt
├── tagmanifest-md5.txt
├── data/
│   └── (файлы данных)
└── (опциональные файлы метаданных)
```

### Обязательные файлы

#### bagit.txt

Содержит версию BagIt и кодировку:

```
BagIt-Version: 1.0
Tag-File-Character-Encoding: UTF-8
```

#### manifest-md5.txt

Список всех файлов в `data/` с их MD5 хешами:

```
abc123...  data/file1.txt
def456...  data/file2.txt
```

#### tagmanifest-md5.txt

Список всех файлов метаданных (tag files) с их MD5 хешами:

```
ghi789...  bagit.txt
jkl012...  manifest-md5.txt
```

## Использование

### Создание Bag

```bash
# Используя bagit-python
pip install bagit
bagit.py --create my-bag data/
```

### Валидация Bag

```bash
bagit.py --validate my-bag
```

### Python библиотека

```python
import bagit

# Создание Bag
bag = bagit.make_bag('my-bag', {'Contact-Name': 'John Doe'})

# Валидация
bag.validate()
```

## Метаданные

### Файлы метаданных

Bag может содержать дополнительные файлы метаданных:

```
my-bag/
├── bag-info.txt
├── bagit.txt
├── manifest-md5.txt
└── data/
```

### bag-info.txt

Пример файла метаданных:

```
Source-Organization: Ruarxive
Organization-Address: ...
Contact-Name: John Doe
Contact-Email: john@example.com
Bagging-Date: 2024-01-01
```

## Использование в архивации

### Упаковка WARC файлов

```bash
bagit.py --create archive-bag \
  --metadata Source-Organization="Ruarxive" \
  warc-files/
```

### Упаковка коллекций

BagIt подходит для упаковки коллекций архивов:

*   WARC файлы в `data/`
*   Метаданные коллекции в tag files
*   Контрольные суммы для проверки целостности

## Валидация

### Проверка целостности

```bash
bagit.py --validate my-bag
```

Проверяет:
*   Структуру Bag
*   Контрольные суммы файлов
*   Соответствие манифестов

### Автоматическая валидация

Многие системы автоматически валидируют Bag при получении:

*   Репозитории цифрового сохранения
*   Системы передачи данных
*   Инструменты обработки

## Best practices

### Организация

*   Используйте описательные имена для Bag
*   Включайте полные метаданные
*   Регулярно валидируйте Bag

### Контрольные суммы

*   Используйте MD5 или SHA-256
*   Регулярно проверяйте целостность
*   Обновляйте манифесты при изменении

### Метаданные

*   Включайте всю релевантную информацию
*   Используйте стандартные поля где возможно
*   Документируйте кастомные поля

## Ресурсы

*   [BagIt спецификация](https://tools.ietf.org/html/rfc8493)
*   [BagIt Python библиотека](https://github.com/LibraryOfCongress/bagit-python)
*   [BagIt документация](https://github.com/LibraryOfCongress/bagit)

## Связанные материалы

- [Формат WARC](/kb/instruments/file-formats/warc)
- [Метаданные PREMIS](/kb/instruments/file-formats/premis)
- [Передача архивов](/kb/guides/custom-workflows)
