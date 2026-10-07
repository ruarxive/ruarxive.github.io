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

Полный набор стандартных полей определён в [RFC 8493 §2.2.2](https://tools.ietf.org/html/rfc8493#section-2.2.2). Наиболее употребительные:

- `Source-Organization` — организация-источник данных
- `Contact-Name`, `Contact-Email`, `Contact-Phone`
- `External-Identifier` — внешний идентификатор (DOI, ISBN, архивный шифр)
- `External-Description` — краткое описание содержимого
- `Bagging-Date`, `Bagging-Software`, `Bag-Size`, `Bag-Group-Identifier`
- `Payload-Oxum` — общий объём payload в байтах и количество файлов (OctetStream Sum)
- `Bag-Count` — порядковый номер в серии (для многосериевых наборов)

### Дополнительные файлы: `fetch.txt` и `tagmanifest-*`

**`fetch.txt`** — опциональный файл, в котором перечислены файлы, размещённые вне директории `data/`, но логически принадлежащие архиву (например, слишком большие видео или ресурсы по URL). Утилиты валидации подтягивают их и проверяют контрольные суммы. Это критично для архивов, где часть материалов хранится на отдельном хранилище (Yandex Object Storage, S3 и т. п.).

```
sha256=abf3... https://storage.example.ru/video.mp4 104857600
```

**`tagmanifest-*`** — помимо MD5, спецификация разрешает `sha256`, `sha512` и `sha1`. Рекомендуется использовать `sha256` или `sha512` как устойчивые к коллизиям.

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

## Профили BagIt

Базовая спецификация (RFC 8493) намеренно минимальна. Конкретные репозитории публикуют **профили BagIt** — расширения, фиксирующие обязательные поля, тип хешей, дополнительные tag-файлы и допустимые ограничения:

- [APTrust Profile](https://aptrust.org/wp-content/uploads/2020/06/BagIt-Profile-APTrust.pdf) — крупнейший профиль для академических архивов.
- [BTRS Profile](https://tools.ietf.org/html/rfc8493) — базовый, отражает саму спецификацию.
- [Duracloud Profile](https://wiki.lyrasis.org/display/DSP/DuraCloud+BagIt+Profile) — для облачных репозиториев.

Профиль объявляется в `bag-info.txt` через поле `BagIt-Profile-Version`, что позволяет принимающей стороне проверить соответствие.

## Рекомендации

### Организация

*   Используйте описательные имена для Bag
*   Включайте полные метаданные
*   Регулярно валидируйте Bag

### Контрольные суммы

*   Используйте SHA-256 (или SHA-512) — MD5 устарел и неустойчив к коллизиям
*   Регулярно проверяйте целостность
*   Обновляйте манифесты при изменении

### Метаданные

*   Включайте всю релевантную информацию
*   Используйте стандартные поля где возможно
*   Документируйте кастомные поля

## Ресурсы

*   [BagIt спецификация (RFC 8493)](https://tools.ietf.org/html/rfc8493)
*   [BagIt Python библиотека](https://github.com/LibraryOfCongress/bagit-python)
*   [BagIt документация](https://github.com/LibraryOfCongress/bagit)

## Связанные материалы

- [Формат WARC](/kb/instruments/file-formats/warc)
- [Метаданные PREMIS](/kb/instruments/file-formats/premis)
- [Кастомные workflow для архивации](/kb/guides/custom-workflows)
