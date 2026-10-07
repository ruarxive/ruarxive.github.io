---
title: Internet Archive CLI (ia)
sidebar_label: Internet Archive CLI (ia)
description: "Утилита командной строки для работы с archive.org: загрузка, скачивание, поиск, метаданные, Wayback Machine через API"
---

# Internet Archive CLI (`ia`)

**Internet Archive CLI** (`ia`) — официальная утилита командной строки от Internet Archive для работы с архивом: загрузка файлов, скачивание, поиск по каталогу, управление метаданными и интеграция с Wayback Machine.

Сайт: [archive.org/developers/internetarchive/cli](https://archive.org/developers/internetarchive/cli)

## Зачем нужен архивисту

Internet Archive — крупнейший публичный веб-архив. Возможности `ia`:

- **Загрузить WARC** на archive.org для публичного доступа через Wayback Machine.
- **Скачать WARC** других архивов для локального использования.
- **Метаданные** для каталогизации.
- **Поиск** по 40+ млн items.
- **Скрипты** — Python API + CLI для автоматизации.

Где незаменим:
- **Загрузка в Wayback Machine** — `ia` сам не отправляет в Wayback, но используется в связке с SavePageNow API.
- **Архивирование собственных данных** — фильмов, книг, аудио, ПО, веб-страниц.
- **Использование архивов других** — скачивание для офлайн-анализа.
- **Программный доступ** к 40+ миллионам items.

## Возможности

- **Загрузка файлов** на archive.org (upload).
- **Скачивание** любых item (download).
- **Поиск** по 40+ млн items.
- **Метаданные** — чтение и изменение (read/write).
- **Удаление** собственных uploads.
- **Список файлов** в item.
- **Каталогизация** — добавление тегов, описаний.
- **Python API** для скриптов.
- **Wayback Machine** — интеграция через API (с версии `ia` 1.0+).
- **Аутентификация** через cookies или API keys.
- **Прогресс-бар** для больших файлов.
- **Возобновление** прерванных загрузок.

## Когда использовать

✅ Подходит для:

- **Загрузки WARC** на archive.org для долгосрочного публичного хранения.
- **Скачивания архивов** других пользователей (фильмы, аудио, документы).
- **Скриптов автоматизации** — регулярные выгрузки.
- **Каталогизации** своих коллекций.
- **Интеграции** с Wayback Machine.

❌ Не подходит для:

- **Архивации текущих веб-страниц** (для этого — SavePageNow API или Browsertrix).
- **Локального архива** (для этого — pywb, Browsertrix, Wpull).
- **Массовой загрузки** тысяч мелких файлов (лучше через `requests`/curl с API).

## Установка

### Через пакетные менеджеры (рекомендуется)

```bash
# macOS
brew install internetarchive

# Debian/Ubuntu (PPA)
sudo add-apt-repository ppa:internetarchive/ppa
sudo apt update && sudo apt install internetarchive

# Arch
yay -S internetarchive

# Windows (через pip)
pip install internetarchive
```

### Через pip

```bash
pip install internetarchive
```

### Из исходников

```bash
git clone https://github.com/jjjake/internetarchive
cd internetarchive
pip install -e .
```

### Зависимости

- **Python 3.8+**.
- **requests, tqdm, docopt, jsonschema, urllib3, six** — основные.
- **yargs** (опционально) — для shell completion.

## Аутентификация

Перед использованием нужно настроить ключи:

### Получить ключи

1. Зарегистрироваться на [archive.org](https://archive.org/account/login).
2. Перейти в [API keys](https://archive.org/account/s3.php).
3. Скопировать `access` и `secret`.

### Настроить

```bash
ia configure

# Интерактивно:
# Email: you@example.com
# Password: ********
```

Это создаст `~/.ia`-файл с ключами.

### Или через переменные окружения

```bash
export IA_ACCESS_KEY=your_access_key
export IA_SECRET_KEY=your_secret_key
```

### Или через config-файл

```ini
# ~/.config/ia.ini или ~/.ia
[s3]
access = your_access_key
secret = your_secret_key
```

## Использование

### Поиск

```bash
# Простой поиск
ia search 'subject:"russian web archive"'

# С лимитом
ia search 'collection:webarchive' --num-found 20

# JSON-вывод
ia search 'title:"russia"' --json | jq '.[0:3]'

# Фильтр по типу
ia search 'mediatype:movies AND subject:russia' --num-found 10
```

### Загрузка файла

```bash
# Простая загрузка
ia upload my-archive archive.warc.gz

# С метаданными
ia upload my-archive archive.warc.gz \
  --metadata "title:My Archive" \
  --metadata "description:Archive of example.com 2024" \
  --metadata "subject:web-archive" \
  --metadata "creator:Ruarxive" \
  --metadata "licenseurl:https://creativecommons.org/publicdomain/zero/1.0/"

# Загрузка нескольких файлов
ia upload my-archive *.warc.gz

# С прогрессом
ia upload my-archive big-archive.warc.gz --no-derive
```

### Скачивание файла

```bash
# Скачать конкретный файл
ia download my-archive archive.warc.gz

# Скачать все файлы item
ia download my-archive

# В конкретную директорию
ia download my-archive --dest-dir ./downloads

# С определённым форматом
ia download my-archive --format "Archive BitTorrent"
```

### Просмотр метаданных

```bash
# Все метаданные
ia metadata my-archive

# В JSON
ia metadata my-archive --json

# Конкретное поле
ia metadata my-archive --field=title
```

### Изменение метаданных

```bash
# Из CSV-файла
ia metadata my-archive --spreadsheet=metadata.csv

# Из JSON
ia metadata my-archive --json-file=metadata.json

# Удалить поле
ia metadata my-archive --remove=subject --remove=tags
```

### Список файлов в item

```bash
ia list my-archive

# С размерами
ia list my-archive --json | jq '.[] | {name, size}'
```

### Удаление

```bash
# Удалить файл из item
ia delete my-archive/archive.warc.gz

# Удалить весь item
ia delete my-archive --all
```

### Создание item

```bash
ia create my-archive \
  --metadata "title:My Archive" \
  --metadata "description:..." \
  --metadata "mediatype:web"
```

### Wayback Machine (через SavePageNow)

`ia` имеет команды для работы с Wayback Machine:

```bash
# Сохранить страницу в Wayback
ia wayback save https://example.com/article

# Проверить, есть ли страница в Wayback
ia wayback check https://example.com/article

# Получить список всех версий
ia wayback versions https://example.com/article
```

> [!NOTE]
> Функции `ia wayback` могут быть ограничены. Для production-архивации используйте [Browsertrix](browsertrix) или собственный скрипт с [SavePageNow API](https://docs.google.com/document/d/1Nsv52MvSjbLb2cX08Vr6K2a1JaL9BJw0pw_fpvAEMR8/).

## Программный API (Python)

### Установка и аутентификация

```python
from internetarchive import get_item, search_items, upload

# Аутентификация автоматическая из ~/.ia
```

### Поиск

```python
results = search_items('subject:"russian web archive"')
for item in results:
    print(item['identifier'], item.get('title'))
```

### Загрузка

```python
import internetarchive

item = internetarchive.upload(
    'my-archive',
    'archive.warc.gz',
    metadata={
        'title': 'My Archive',
        'description': 'Archive of example.com 2024',
        'creator': 'Ruarxive',
        'subject': ['web-archive', 'russia'],
        'licenseurl': 'https://creativecommons.org/publicdomain/zero/1.0/',
    },
    verbose=True,
)
```

### Скачивание

```python
item = get_item('my-archive')
item.download(
    files=['archive.warc.gz'],
    destdir='./downloads',
    verbose=True,
)
```

### Метаданные

```python
item = get_item('my-archive')
print(item.metadata)

# Изменить
item.modify_metadata({
    'title': 'Updated Title',
    'description': 'Updated description',
})
```

### Batch-скрипт

```python
import os
from pathlib import Path
from internetarchive import upload

# Загрузить все WARC из директории
warcs = Path('./warcs').glob('*.warc.gz')

for warc in warcs:
    identifier = warc.stem  # имя без расширения
    print(f"Uploading {identifier}...")
    upload(
        identifier,
        str(warc),
        metadata={
            'title': f'Archive {identifier}',
            'mediatype': 'web',
            'collection': 'ruarxive',
            'creator': 'Ruarxive',
        },
        verbose=True,
    )
```

## Сравнение с другими инструментами

| Инструмент | Назначение | Upload | Download | API | Сложность |
| :--- | :--- | :---: | :---: | :---: | :--- |
| **`ia` (Internet Archive CLI)** | Работа с archive.org | ✅ | ✅ | ✅ Python | Низкая |
| **[Wget](wget)** | Скачивание сайтов | ❌ | ⚠️ HTTP | ❌ | Низкая |
| **[Browsertrix](browsertrix)** | Кроулинг → WACZ | ❌ | ❌ | ⚠️ | Средняя |
| **[WARC-processing](warc-processing)** | Чтение WARC | ❌ | ⚠️ | ✅ Python | Средняя |
| **rclone** | Синхронизация с S3 | ✅ | ✅ | ⚠️ | Низкая |

### Когда `ia` лучше всех

- Нужно **загрузить в archive.org** для публичного доступа.
- Нужен **программный доступ** к каталогу archive.org.
- Хочется **Python API** для интеграций.

### Когда лучше rclone

- Нужна **синхронизация** (не одиночные upload/download).
- **Много облачных провайдеров** (S3, GCS, Azure).

### Когда лучше Browsertrix

- Цель — **крулинг** (создание WARC), а не управление ими.
- Нужен **JS-рендеринг**.

## Best practices

### 1. Всегда добавляйте метаданные при upload

```bash
ia upload my-archive archive.warc.gz \
  --metadata "title:..." \
  --metadata "description:..." \
  --metadata "creator:..." \
  --metadata "subject:web-archive;russia" \
  --metadata "licenseurl:https://creativecommons.org/publicdomain/zero/1.0/" \
  --metadata "date:2024"
```

Без метаданных item будет невозможно найти через поиск.

### 2. Используйте `mediatype:web` для WARC

```bash
--metadata "mediatype:web"
```

Это правильная категория для WARC-файлов.

### 3. Группируйте в коллекции

```bash
--metadata "collection:ruarxive"
```

Создайте свою коллекцию (`ruarxive-2024`, `ruarxive-news`, и т.д.).

### 4. Указывайте лицензию

```bash
--metadata "licenseurl:https://creativecommons.org/publicdomain/zero/1.0/"
```

Без лицензии использование другими может быть под вопросом.

### 5. Для больших загрузок — `ia` или Python API с chunked upload

```python
upload('my-archive', 'huge-archive.warc.gz', verbose=True)
# Автоматически chunked, с возобновлением
```

### 6. Используйте `~/.ia`-файл, а не env vars

```bash
# Не нужно каждый раз экспортировать
ia configure
```

### 7. Проверяйте загрузку

```bash
ia list my-archive
# Убедитесь, что файл появился и его размер совпадает
```

## Ограничения

- **Только archive.org** — нет поддержки других архивов (SolrWayback, Common Crawl).
- **Лимиты на размер файла** — 50 ГБ максимум для одного item (можно обойти через multi-part).
- **Медленная загрузка** — 5-10 МБ/с на типичном канале.
- **Wayback Machine** — отдельный сервис, не все команды `ia` его покрывают.
- **Метаданные** — есть лимиты на размер и формат.
- **Удаление** — не сразу, проходит через review.

## Юридические аспекты

> [!WARNING]
> Загружая WARC на archive.org, вы делаете его **публично доступным**. Убедитесь, что:
>
> - У вас есть **права** на распространение контента.
> - Вы **не нарушаете** законы о персональных данных, авторском праве, ToS сайтов.
> - **Лицензия** в метаданных соответствует действительности.
>
> Подробности: [Правовые вопросы](/kb/legal/copyright).

Для **общественно-значимого контента** (правительственные сайты, новостные архивы, общедоступные данные) — лицензия CC0 или CC-BY подходит.

## Ресурсы

- [Официальная документация](https://archive.org/developers/internetarchive/cli.html) — команды и параметры.
- [GitHub: internetarchive](https://github.com/jjjake/internetarchive) — исходный код.
- [Python API](https://archive.org/developers/internetarchive/api.html) — документация API.
- [Wayback Machine API](https://docs.google.com/document/d/1Nsv52MvSjbLb2cX08Vr6K2a1JaL9BJw0pw_fpvAEMR8/) — SavePageNow.
- [Internet Archive FAQ](https://archive.org/about/faqs.php) — общие вопросы.
- [S3 API](https://archive.org/developers/s3.html) — низкоуровневый API.

## Связанные материалы

- **[Browsertrix](browsertrix)** — для кроулинга.
- **[Wget](wget)** — простой HTTP-загрузчик.
- **[WARC-processing](warc-processing)** — обработка загруженного.
- **[pywb](/kb/instruments/replay/pywb)** — локальное воспроизведение.
- **[Warc2zim](warc2zim)** — конвертация WARC в ZIM для офлайн.
- **[Архивирование в Wayback Machine](/kb/similar/internet-archive)** — общая информация.
- **[Кейс: API-архивация в масштабе](/kb/case-studies/api-archiving-scale)** — большие архивы.
- **[Правовые вопросы](/kb/legal/copyright)** — лицензирование архивов.
- **[Кейсы международных архивов](/kb/case-studies/international-examples)** — как другие делают.
