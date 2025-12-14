# Формат WACZ

**WACZ (Web Archive Collection Zipped)** — это современный формат для упаковки и распространения веб-архивов. Он был создан сообществом Webrecorder для решения проблем удобства использования "сырых" WARC-файлов.

## Проблема WARC

Формат [WARC](warc) является стандартом де-факто для хранения данных. Однако:
1.  Одного WARC часто недостаточно (нужны CDX-индексы для просмотра).
2.  В одной коллекции может быть сотни WARC-файлов.
3.  Нет стандартного способа приложить метаданные о коллекции, логи и скриншоты.

## Решение WACZ

WACZ — это просто **ZIP-архив** с определенной структурой папок. Он содержит:
*   Один или несколько `.warc.gz` файлов (сами данные).
*   Индексы CDXJ (для быстрого поиска и воспроизведения).
*   `datapackage.json` (метаданные коллекции, список страниц, настройки).
*   Дополнительные данные (скриншоты, логи кроулинга).

Благодаря индексам внутри архива, файл `.wacz` можно загрузить в плеер (например, ReplayWeb.page) и сразу начать просмотр, без долгой индексации.

## Структура файла

Если распаковать `.wacz` как обычный zip, вы увидите примерно такое:

```
my-archive.wacz/
├── archive/
│   ├── data.warc.gz
├── indexes/
│   ├── index.cdx.gz
├── pages/
│   ├── pages.jsonl
├── datapackage.json
├── datapackage-digest.json
```

*   **archive/**: Папка с WARC-файлами.
*   **indexes/**: Индексы для воспроизведения.
*   **pages/**: Список "сидов" (начальных страниц) с заголовками.
*   **datapackage.json**: Описание содержимого в формате Frictionless Data.

## Инструменты

### Создание WACZ

Самый простой способ создать WACZ из набора WARC-файлов — использовать утилиту `wacz` (на Python).

```bash
pip install wacz
wacz create -o output.wacz my-warc-directory/
```

Также WACZ автоматически создается инструментом [Browsertricks](../tools/browsertricks).

### Просмотр WACZ

WACZ можно открыть прямо в браузере с помощью [ReplayWeb.page](https://replayweb.page/). Это не требует установки серверного ПО.

## Создание WACZ из WARC

### Использование wacz утилиты

```bash
# Установка
pip install wacz

# Создание WACZ из директории с WARC файлами
wacz create -o archive.wacz /path/to/warc/files/

# С указанием метаданных
wacz create -o archive.wacz \
  --title "My Archive" \
  --description "Archive of example.com" \
  /path/to/warc/files/
```

### Использование Browsertrix

Browsertrix автоматически создает WACZ файлы при использовании опции `--generateWACZ`:

```bash
docker run --rm -v $PWD/data:/crawl/data \
    webrecorder/browsertrix-crawler crawl \
    --url https://example.com \
    --generateWACZ \
    --collection "My Collection"
```

## Преобразование WARC в WACZ

### Базовое преобразование

```bash
# Простое преобразование
wacz create -o output.wacz input.warc.gz

# Для нескольких файлов
wacz create -o output.wacz *.warc.gz
```

### С индексацией

WACZ автоматически создает индексы CDXJ при создании, что позволяет быстро просматривать архив.

## Метаданные WACZ

Файл `datapackage.json` содержит метаданные коллекции:

```json
{
  "profile": "data-package",
  "name": "my-archive",
  "title": "Archive of example.com",
  "description": "Complete archive created on 2024-01-01",
  "resources": [
    {
      "path": "archive/data.warc.gz",
      "name": "data",
      "format": "warc"
    }
  ]
}
```

## Связанные материалы

- [Формат WARC](/kb/instruments/file-formats/warc) — базовый формат веб-архивов
- [Формат CDX](/kb/instruments/file-formats/cdx) — формат индексации
- [ReplayWeb.page](/kb/instruments/replay/replayweb-page) — просмотр WACZ файлов
- [Browsertrix](/kb/instruments/tools/browsertricks) — создание WACZ архивов
- [Обработка WARC](/kb/instruments/tools/warc-processing) — работа с WARC файлами
