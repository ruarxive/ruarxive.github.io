---
title: BagIt
description: "BagIt (RFC 8493) — формат упаковки цифровых объектов с манифестами контрольных сумм: структура пакета, команды bagit-python, fetch.txt и профили BagIt."
last_update:
  date: 2026-10-12
---

# BagIt

**BagIt** — это формат упаковки цифровых объектов для передачи и хранения. Разработан Библиотекой Конгресса США совместно с Калифорнийской цифровой библиотекой (CDL); опубликован как [RFC 8493](https://www.rfc-editor.org/rfc/rfc8493) (октябрь 2018 года, авторы — J. Kunze, J. Littman, E. Madden, J. Scancella, C. Adams).

## Описание

BagIt определяет иерархическую файловую структуру для упаковки цифровых объектов вместе с их метаданными и контрольными суммами.

### Особенности

*   **Стандартизация**: Открытая спецификация RFC 8493
*   **Целостность**: Встроенная проверка целостности через контрольные суммы
*   **Метаданные**: Поддержка метаданных
*   **Переносимость**: Легко переносить между системами

## Структура Bag

### Базовая структура

```
my-bag/
├── bagit.txt
├── manifest-sha256.txt
├── data/
│   └── (файлы данных — payload)
├── bag-info.txt            (необязательный)
├── tagmanifest-sha256.txt  (необязательный)
└── fetch.txt               (необязательный)
```

### Обязательные элементы

По RFC 8493 обязательны три элемента: `bagit.txt`, каталог `data/` и хотя бы один манифест `manifest-<алгоритм>.txt`.

#### bagit.txt

Содержит версию BagIt и кодировку tag-файлов (ровно две строки):

```
BagIt-Version: 1.0
Tag-File-Character-Encoding: UTF-8
```

Версия 1.0 соответствует RFC 8493. Некоторые инструменты, в том числе bagit-python 1.9.0, по умолчанию пишут `BagIt-Version: 0.97` (версия последнего черновика перед RFC).

#### manifest-sha256.txt

Список всех файлов в `data/` с их хешами:

```
e3b0c442...  data/file1.txt
5feceb66...  data/file2.txt
```

### Необязательные элементы

#### tagmanifest-sha256.txt

Список tag-файлов (`bagit.txt`, `bag-info.txt`, манифестов) с их хешами. Позволяет проверить, что метаданные пакета не изменены.

```
2a6c3f1e...  bagit.txt
9d4b7c2a...  bag-info.txt
c81f0e5d...  manifest-sha256.txt
```

#### bag-info.txt

Метаданные пакета в формате «Поле: значение»:

```
Source-Organization: Ruarxive
Organization-Address: ...
Contact-Name: Иван Петров
Contact-Email: archive@example.org
Bagging-Date: 2024-01-01
Payload-Oxum: 104857600.12
```

Полный набор зарезервированных полей определён в [RFC 8493 §2.2.2](https://www.rfc-editor.org/rfc/rfc8493#section-2.2.2). Наиболее употребительные:

- `Source-Organization` — организация-источник данных
- `Contact-Name`, `Contact-Email`, `Contact-Phone`
- `External-Identifier` — внешний идентификатор (DOI, ISBN, архивный шифр)
- `External-Description` — краткое описание содержимого
- `Bagging-Date`, `Bag-Size`, `Bag-Group-Identifier`
- `Payload-Oxum` — общий объём payload в байтах и количество файлов (через точку)
- `Bag-Count` — порядковый номер в серии (для многосерийных наборов)

#### fetch.txt

`fetch.txt` позволяет передать пакет «с дырами»: часть файлов payload не лежит в `data/` физически, а должна быть скачана перед проверкой полноты. Это удобно, когда крупные файлы хранятся в отдельном хранилище (S3-совместимом и т. п.).

Каждая строка имеет вид `url length filepath`: абсолютный URL, размер в байтах (или `-`, если неизвестен) и путь к файлу внутри пакета, начинающийся с `data/`. Каждый файл из `fetch.txt` обязан присутствовать в каждом payload-манифесте, а tag-файлы в `fetch.txt` перечислять нельзя.

```
https://storage.example.org/video.mp4 104857600 data/video/video.mp4
```

#### Алгоритмы хеширования

Манифесты могут использовать разные алгоритмы: `md5`, `sha1`, `sha256`, `sha512` и др. По RFC 8493 инструменты обязаны поддерживать SHA-256 и SHA-512 и по умолчанию должны (SHOULD) использовать SHA-512 для новых пакетов; MD5 и SHA-1 оставлены для обратной совместимости.

## Использование

### bagit-python

[bagit-python](https://github.com/LibraryOfCongress/bagit-python) — эталонная библиотека и утилита командной строки от Библиотеки Конгресса. Утилита превращает существующий каталог в пакет **на месте**: файлы перемещаются в `data/`, рядом создаются манифесты и tag-файлы.

```bash
pip install bagit

# Превратить каталог warc-files/ в пакет с SHA-256 и метаданными
bagit.py --sha256 \
  --source-organization "Ruarxive" \
  --contact-name "Иван Петров" \
  --external-description "WARC-файлы сайта example.gov.ru, январь 2024" \
  warc-files/

# Полная проверка: структура и контрольные суммы всех файлов
bagit.py --validate warc-files/

# Быстрая проверка только по Payload-Oxum (число и объём файлов)
bagit.py --validate --fast warc-files/
```

Поля `bag-info.txt` задаются отдельными опциями (`--source-organization`, `--contact-name`, `--contact-email`, `--external-identifier`, `--bagit-profile-identifier` и др.). Можно указать несколько алгоритмов, например `--sha256 --sha512`.

> Команды сверены с `--help` и живым запуском bagit-python 1.9.0 (октябрь 2026).

### Python библиотека

```python
import bagit

# Создание пакета на месте из каталога
bag = bagit.make_bag('warc-files', {'Contact-Name': 'Иван Петров'}, checksums=['sha256'])

# Проверка
bag = bagit.Bag('warc-files')
bag.validate()
```

### Упаковка коллекций

BagIt подходит для упаковки коллекций веб-архивов:

*   WARC файлы в `data/`
*   Метаданные коллекции в `bag-info.txt` и дополнительных tag-файлах (например, `premis.xml`)
*   Контрольные суммы для проверки целостности при переносе и хранении

## Валидация

### Проверка целостности

```bash
bagit.py --validate my-bag
```

Проверяет:
*   Структуру пакета
*   Контрольные суммы файлов payload и tag-файлов
*   Соответствие манифестов фактическому содержимому

### Автоматическая валидация

Многие системы автоматически валидируют пакеты при получении:

*   Репозитории цифрового сохранения
*   Системы передачи данных
*   Инструменты обработки

## Профили BagIt

Базовая спецификация (RFC 8493) намеренно минимальна. Конкретные репозитории публикуют **профили BagIt** — JSON-документы по спецификации [BagIt Profiles](https://bagit-profiles.github.io/bagit-profiles-specification/), фиксирующие обязательные поля `bag-info.txt`, допустимые алгоритмы манифестов, обязательные tag-файлы и другие ограничения.

Профиль объявляется в `bag-info.txt` полем **`BagIt-Profile-Identifier`**, значение которого — URI JSON-файла профиля. Принимающая сторона загружает профиль по этому URI и проверяет пакет на соответствие ему.

Примеры:

- [Спецификация и примеры профилей](https://github.com/bagit-profiles/bagit-profiles) — репозиторий сообщества.
- [APTrust](https://aptrust.github.io/userguide/bagging/) — требования к пакетам консорциума академических архивов APTrust.

## Рекомендации

### Организация

*   Используйте описательные имена для пакетов
*   Включайте полные метаданные
*   Регулярно валидируйте пакеты

### Контрольные суммы

*   Используйте SHA-256 (или SHA-512) — MD5 устарел и неустойчив к коллизиям
*   Регулярно проверяйте целостность
*   Обновляйте манифесты при изменении

### Метаданные

*   Включайте всю релевантную информацию
*   Используйте стандартные поля где возможно
*   Документируйте кастомные поля

## Ресурсы

*   [BagIt спецификация (RFC 8493)](https://www.rfc-editor.org/rfc/rfc8493)
*   [bagit-python](https://github.com/LibraryOfCongress/bagit-python) — библиотека и CLI
*   [bagit-java](https://github.com/LibraryOfCongress/bagit-java) — Java-библиотека (последние изменения — февраль 2024 года)
*   [Спецификация BagIt Profiles](https://bagit-profiles.github.io/bagit-profiles-specification/)

## Связанные материалы

- [Формат WARC](/kb/instruments/file-formats/warc)
- [Метаданные PREMIS](/kb/instruments/file-formats/premis)
- [Кастомные workflow для архивации](/kb/guides/custom-workflows)
