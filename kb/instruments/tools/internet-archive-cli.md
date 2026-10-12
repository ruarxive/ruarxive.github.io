---
title: Internet Archive CLI (ia)
sidebar_label: Internet Archive CLI (ia)
description: "ia — официальная утилита командной строки и Python-библиотека internetarchive для работы с archive.org: загрузка и скачивание файлов, поиск по каталогу, чтение и изменение метаданных."
last_update:
  date: 2026-10-12
---

# Internet Archive CLI (`ia`)

**Internet Archive CLI** (`ia`) — официальная утилита командной строки и Python-библиотека [`internetarchive`](https://github.com/jjjake/internetarchive) для работы с archive.org: загрузка файлов, скачивание, поиск по каталогу, управление метаданными. С Wayback Machine (Save Page Now) `ia` не работает — для этого есть отдельные API (см. ниже).

Документация: [archive.org/developers/internetarchive](https://archive.org/developers/internetarchive/)

## Зачем нужен архивисту

- **Загрузить свои архивы** (WARC, WACZ, PDF, медиа) в item на archive.org для долгосрочного публичного хранения.
- **Скачать файлы** из чужих item для локального анализа.
- **Искать** по каталогу archive.org и выгружать списки идентификаторов.
- **Читать и править метаданные** своих item.
- **Автоматизировать** всё это скриптами — через CLI или Python API.

:::note Загруженные WARC и Wayback Machine
WARC-файлы, загруженные в item обычным пользователем, хранятся и скачиваются как файлы, но **не попадают в Wayback Machine автоматически**. Индексация WARC в Wayback делается для коллекций, согласованных с Internet Archive. Если нужно, чтобы страница появилась в Wayback, отправьте её через Save Page Now.
:::

## Возможности

Подкоманды `ia` (версия 5.11.1): `configure`, `upload`, `download`, `search`, `metadata`, `list`, `delete`, `copy`, `move`, `tasks`, `reviews`, `flag`, `simplelists`, `account` (только для администраторов).

- **Загрузка файлов** (`upload`) — item создаётся при первой загрузке.
- **Скачивание** (`download`) с фильтрами по формату и маске имени.
- **Поиск** (`search`) с выбором полей; вывод — JSON по строке на результат.
- **Метаданные** (`metadata`) — чтение, изменение, добавление, удаление полей, правка из CSV.
- **Список файлов** в item (`list`).
- **Удаление** своих файлов (`delete`).
- **Python API** для скриптов.

## Когда использовать

✅ Подходит для:

- **загрузки своих архивов** на archive.org для долгосрочного публичного хранения;
- **скачивания материалов** из archive.org (фильмы, аудио, документы, WARC из открытых item);
- **скриптов автоматизации** — регулярные выгрузки и загрузки;
- **каталогизации** своих коллекций.

❌ Не подходит для:

- **архивации текущих веб-страниц** — используйте Save Page Now или [Browsertrix Crawler](/kb/instruments/tools/browsertrix);
- **локального веб-архива** — используйте [pywb](/kb/instruments/replay/pywb), Browsertrix Crawler, [Wpull](/kb/instruments/tools/wpull);
- **работы с Wayback Machine** — используйте [Wayback API](/kb/instruments/tools/wayback-api).

## Установка

### Через pipx или pip (рекомендуется)

```bash
pipx install internetarchive
# или
pip install internetarchive
```

### Через Homebrew (macOS, Linux)

```bash
brew install internetarchive
```

### Из исходников

```bash
git clone https://github.com/jjjake/internetarchive
cd internetarchive
pip install -e .
```

### Зависимости

- **Python 3.10+**.
- **requests, tqdm, urllib3, jsonpatch** — устанавливаются автоматически.

> Команды и параметры сверены с `ia --help` версии 5.11.1 (октябрь 2026).

## Аутентификация

Для загрузки и изменения метаданных нужна учётная запись archive.org.

### Настроить

```bash
ia configure
# спросит email и пароль от archive.org и сохранит ключи IA-S3
```

Проверить ключи: `ia configure --check`, посмотреть, под какой учётной записью вы работаете: `ia configure --whoami`.

Файл конфигурации ищется по порядку: путь из переменной `IA_CONFIG_FILE`, `$XDG_CONFIG_HOME/internetarchive/ia.ini` (обычно `~/.config/internetarchive/ia.ini`), `~/.config/ia.ini`, `~/.ia`.

### Или через переменные окружения

```bash
export IA_ACCESS_KEY_ID=your_access_key
export IA_SECRET_ACCESS_KEY=your_secret_key
```

Ключи можно посмотреть на странице [archive.org/account/s3.php](https://archive.org/account/s3.php).

### Или через файл конфигурации

```ini
# ~/.config/internetarchive/ia.ini
[s3]
access = your_access_key
secret = your_secret_key
```

## Использование

### Поиск

```bash
# Простой поиск (по строке JSON на каждый найденный item)
ia search 'subject:"web archive"'

# Только число результатов
ia search 'collection:webwidecrawl' --num-found

# Только идентификаторы
ia search 'title:"russia" AND mediatype:web' --itemlist

# Выбрать поля
ia search 'mediatype:movies AND subject:russia' -f identifier -f title -f date
```

Вывод — JSON Lines, его удобно обрабатывать через `jq`, например `ia search '…' -f title | jq -r .title`.

### Загрузка файла

```bash
# Простая загрузка (item будет создан, если его ещё нет)
ia upload my-archive-2026 archive.warc.gz

# С метаданными
ia upload my-archive-2026 archive.warc.gz \
  --metadata "title:My Archive" \
  --metadata "description:Archive of example.com, 2026" \
  --metadata "subject:web archive" \
  --metadata "creator:My Organization" \
  --metadata "licenseurl:https://creativecommons.org/publicdomain/zero/1.0/"

# Загрузка нескольких файлов
ia upload my-archive-2026 *.warc.gz

# Без derive-обработки (Internet Archive не будет создавать производные форматы)
ia upload my-archive-2026 big-archive.warc.gz --no-derive

# С повторами и проверкой целостности
ia upload my-archive-2026 big-archive.warc.gz --retries 10 --verify
```

Идентификатор item должен быть уникальным на всём archive.org.

### Скачивание файла

```bash
# Скачать конкретный файл
ia download my-archive-2026 archive.warc.gz

# Скачать все файлы item
ia download my-archive-2026

# В конкретную директорию
ia download my-archive-2026 --destdir ./downloads

# Только файлы определённого формата
ia download my-archive-2026 --format "Archive BitTorrent"

# По маске имени
ia download my-archive-2026 --glob "*.warc.gz"

# Показать URL файлов, ничего не скачивая
ia download my-archive-2026 --dry-run
```

### Просмотр метаданных

```bash
# Все метаданные item (JSON)
ia metadata my-archive-2026

# Отдельное поле — через jq
ia metadata my-archive-2026 | jq -r .metadata.title

# Какие форматы файлов есть в item
ia metadata my-archive-2026 --formats
```

### Изменение метаданных

```bash
# Изменить поле
ia metadata my-archive-2026 --modify="title:Updated Title"

# Добавить значение в список
ia metadata my-archive-2026 --append-list="subject:russia"

# Удалить конкретное значение поля
ia metadata my-archive-2026 --remove="subject:old-tag"

# Пакетное изменение из CSV
ia metadata --spreadsheet=metadata.csv
```

### Список файлов в item

```bash
ia list my-archive-2026

# С размерами и заголовками колонок
ia list my-archive-2026 --columns name,size --verbose
```

### Удаление

```bash
# Удалить файл из item
ia delete my-archive-2026 archive.warc.gz

# Удалить все файлы item (некоторые служебные файлы удалить нельзя)
ia delete my-archive-2026 --all

# Сначала посмотреть, что будет удалено
ia delete my-archive-2026 --all --dry-run
```

Сам item после удаления файлов остаётся; для его полного удаления обращайтесь в поддержку Internet Archive.

### Wayback Machine

В `ia` **нет** команд для Wayback Machine. Чтобы сохранить страницу или найти её копии, используйте:

```bash
# Сохранить страницу (Save Page Now)
curl -s "https://web.archive.org/save/https://example.com/article"

# Список сохранённых копий (CDX API)
curl -s "https://web.archive.org/cdx/search/cdx?url=example.com/article&output=json&limit=20"
```

Подробнее — [Wayback API](/kb/instruments/tools/wayback-api). Для массовой отправки есть SPN2 API с ключами IA-S3.

## Программный API (Python)

### Аутентификация

```python
from internetarchive import get_item, search_items, upload

# Ключи берутся из файла конфигурации (ia configure) или из переменных окружения
```

### Поиск

```python
results = search_items('subject:"web archive"', fields=['identifier', 'title'])
for item in results:
    print(item['identifier'], item.get('title'))
```

### Загрузка

```python
from internetarchive import upload

responses = upload(
    'my-archive-2026',
    files=['archive.warc.gz'],
    metadata={
        'title': 'My Archive',
        'description': 'Archive of example.com, 2026',
        'creator': 'My Organization',
        'subject': ['web archive', 'russia'],
        'licenseurl': 'https://creativecommons.org/publicdomain/zero/1.0/',
    },
    verbose=True,
    retries=10,
)
```

### Скачивание

```python
item = get_item('my-archive-2026')
item.download(
    files=['archive.warc.gz'],
    destdir='./downloads',
    verbose=True,
)
```

### Метаданные

```python
item = get_item('my-archive-2026')
print(item.metadata)

item.modify_metadata({
    'title': 'Updated Title',
    'description': 'Updated description',
})
```

### Пакетная загрузка

```python
from pathlib import Path
from internetarchive import upload

for warc in Path('./warcs').glob('*.warc.gz'):
    identifier = f"myorg-{warc.name.removesuffix('.warc.gz')}"
    print(f"Uploading {identifier}...")
    upload(
        identifier,
        files=[str(warc)],
        metadata={
            'title': f'Web archive {warc.name}',
            'creator': 'My Organization',
            'subject': ['web archive'],
        },
        verbose=True,
        retries=10,
    )
```

## Сравнение с другими инструментами

| Инструмент | Назначение | Upload | Download | API | Сложность |
| :--- | :--- | :---: | :---: | :---: | :--- |
| **`ia` (Internet Archive CLI)** | Работа с archive.org | ✅ | ✅ | ✅ Python | Низкая |
| **[Wget](/kb/instruments/tools/wget)** | Скачивание сайтов | ❌ | ⚠️ HTTP | ❌ | Низкая |
| **[Browsertrix Crawler](/kb/instruments/tools/browsertrix)** | Краулинг → WACZ | ❌ | ❌ | ⚠️ | Средняя |
| **[Обработка WARC](/kb/instruments/tools/warc-processing)** | Чтение WARC | ❌ | ⚠️ | ✅ Python | Средняя |
| **rclone** | Синхронизация с облачными хранилищами | ✅ | ✅ | ⚠️ | Низкая |

### Когда `ia` лучше всех

- Нужно **загрузить файлы на archive.org** для публичного доступа.
- Нужен **программный доступ** к каталогу archive.org.
- Нужен **Python API** для интеграций.

### Когда лучше rclone

- Нужна **синхронизация** каталогов, а не отдельные загрузки.
- Работаете с **несколькими облачными провайдерами** (S3, GCS, Azure).

### Когда лучше Browsertrix Crawler

- Цель — **краулинг** (создание WARC), а не управление готовыми файлами.
- Нужен **рендеринг JavaScript**.

## Best practices

### 1. Всегда добавляйте метаданные при загрузке

```bash
ia upload my-archive-2026 archive.warc.gz \
  --metadata "title:..." \
  --metadata "description:..." \
  --metadata "creator:..." \
  --metadata "subject:web archive" \
  --metadata "subject:russia" \
  --metadata "licenseurl:https://creativecommons.org/publicdomain/zero/1.0/" \
  --metadata "date:2026"
```

Без метаданных item почти невозможно найти через поиск.

### 2. `mediatype` и коллекции — по согласованию с Internet Archive

По умолчанию загруженные файлы попадают в общую пользовательскую коллекцию. Загрузить item в чужую коллекцию (`collection:…`) без разрешения нельзя, а коллекции, как правило, создаёт персонал Internet Archive; значение `mediatype:web` тоже обычно используется для коллекций, согласованных с Internet Archive. Если планируете регулярно загружать веб-архивы, договоритесь с Internet Archive о коллекции.

### 3. Указывайте лицензию

```bash
--metadata "licenseurl:https://creativecommons.org/publicdomain/zero/1.0/"
```

Указывайте лицензию, только если у вас есть право её выдать (см. юридические аспекты ниже).

### 4. Для больших файлов — повторы и проверка

```bash
ia upload my-archive-2026 huge-archive.warc.gz --retries 10 --sleep 30 --verify
```

### 5. Храните ключи в файле конфигурации, а не в скриптах

```bash
ia configure
```

### 6. Проверяйте загрузку

```bash
ia list my-archive-2026 --columns name,size,md5 --verbose
# Убедитесь, что файл появился, а размер и MD5 совпадают с локальными
```

## Ограничения

- **Только archive.org** — с другими архивами (SolrWayback, Common Crawl) `ia` не работает.
- **Нет команд для Wayback Machine** — используйте Save Page Now и CDX API.
- **Обработка не мгновенная** — после загрузки item проходит задачи на стороне archive.org (статус: `ia tasks`).
- **Ограничения на размер** item и файлов существуют; актуальные рекомендации — в [документации](https://archive.org/developers/) и [справке](https://help.archive.org/).
- **Удаление** item целиком — только через поддержку.

## Юридические аспекты

:::warning
Загружая файлы на archive.org, вы делаете их **публично доступными**. Убедитесь, что:

- у вас есть **права** на распространение контента (публичная доступность сайта не означает разрешения на перепубликацию);
- вы **не нарушаете** законы о персональных данных и авторском праве и условия использования сайтов;
- **лицензия** в метаданных соответствует действительности.

Подробности: [Правовые вопросы](/kb/legal/copyright).
:::

Лицензию CC0 или CC BY можно указывать только на материалы, права на которые принадлежат вам или распространение которых разрешено. В общественном достоянии находятся, например, официальные документы государственных органов (п. 6 ст. 1259 ГК РФ), но не сайты целиком: оформление, фото и авторские тексты на них могут охраняться.

## Ресурсы

- [Документация internetarchive](https://archive.org/developers/internetarchive/) — CLI и Python API.
- [Справочник по командам CLI](https://archive.org/developers/internetarchive/cli.html).
- [GitHub: jjjake/internetarchive](https://github.com/jjjake/internetarchive) — исходный код.
- [IA-S3 API](https://archive.org/developers/ias3.html) — низкоуровневый API загрузки.
- [Справка Internet Archive](https://help.archive.org/) — общие вопросы.

## Связанные материалы

- **[Browsertrix Crawler](/kb/instruments/tools/browsertrix)** — для краулинга.
- **[Wget](/kb/instruments/tools/wget)** — простой HTTP-загрузчик.
- **[Обработка WARC](/kb/instruments/tools/warc-processing)** — обработка загруженного.
- **[Wayback API](/kb/instruments/tools/wayback-api)** — работа с Wayback Machine.
- **[pywb](/kb/instruments/replay/pywb)** — локальное воспроизведение.
- **[warc2zim](/kb/instruments/tools/warc2zim)** — конвертация WARC в ZIM для офлайн-просмотра.
- **[Internet Archive](/kb/similar/internet-archive)** — общая информация.
- **[Кейс: API-архивация в масштабе](/kb/case-studies/api-archiving-scale)** — большие архивы.
- **[Правовые вопросы](/kb/legal/copyright)** — лицензирование архивов.
- **[Кейсы международных архивов](/kb/case-studies/international-examples)** — как это делают другие.
