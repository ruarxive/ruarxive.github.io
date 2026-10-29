---
title: ruarxive-db
sidebar_label: ruarxive-db (каталог)
description: "Открытый каталог хранилища Ruarxive: коллекции, записи о сохранённых ресурсах и ссылки на файлы в YAML, наборы данных в JSONL, Parquet и DuckDB, экспорт для поиска «Есть ли сайт в архиве?» на ruarxive.org."
last_update:
  date: 2026-10-29
---

# ruarxive-db (каталог хранилища)

**ruarxive-db** — открытый каталог того, что лежит в хранилище Ruarxive: коллекции, записи о сохранённых сайтах и ресурсах, ссылки на файлы в `cdn.ruarxive.org/public/`. Из него строятся статистика на главной странице ruarxive.org и поиск «Есть ли сайт в архиве?». Перед новой кампанией по каталогу удобно проверить, не сохранён ли ресурс раньше.

- Репозиторий: [github.com/ruarxive/ruarxive-db](https://github.com/ruarxive/ruarxive-db) · Лицензия: MIT · Выпуск v1.0.0 — 14.12.2025, экспорт для сайта — 12.10.2026.

> Цифры и команды на этой странице сверены с репозиторием и проверены запуском 29.10.2026.

## Что внутри

| Путь | Что лежит |
| :--- | :--- |
| `data/collections/*.yaml` | 88 коллекций: название, описание, дата и причина сбора, список записей (тип и причина заполнены не у всех) |
| `data/records/<коллекция>/*.yaml` | 2 641 запись о ресурсах: адрес, домен, статус, тип ресурса, причина, стратегия, инструменты, формат, приоритет, ссылки на файлы |
| `data/datasets/` | Те же данные таблицами `collections`, `records`, `resources` в JSONL (сжатие zstd), Parquet и базе `ruarxive.duckdb` |
| `data/datasets/site/` | Экспорт для сайта: `summary.json` (статистика) и `resources.json` (индекс доменов для поиска) |
| `builder.py`, `site_export.py` | Сборка наборов данных и экспорта для сайта |

Пример записи (`data/records/media2022/t-me-4.yaml`, сокращено):

```yaml
id: t-me-4
name: Телеграм канал Полигон Медиа
date: '2022-03-25T07:18:00.000Z'
status: собран
resource_type: телеграм канал
reason: Внесение организации в реестр иностранных агентов
tools:
- telegram desktop
format: zip
collection:
  id: media2022
resources:
- type: storage
  name: poligon.media_telegram-2022-03-25.zip
  url: https://cdn.ruarxive.org/public/webcollect2022/media2022/poligon.media_telegram/poligon.media_telegram-2022-03-25.zip
```

Описание коллекций и записей пришло из базы Airtable, списки файлов — из снимков хранилища по SFTP и реестра [`allarchives.csv`](https://cdn.ruarxive.org/public/allarchives.csv). Исходные выгрузки (`data/filelists/`) и скрипты, которые строят YAML, в публичный репозиторий не входят. README упоминает каталог `scripts/`, но в репозитории его нет.

## Проверить, сохранён ли сайт

Самый быстрый способ — поиск «Есть ли сайт в архиве?» на [главной странице](https://ruarxive.org/). Тот же индекс доступен файлом:

```bash
curl -s https://ruarxive.org/data/archive-domains.json \
  | jq -c '.domains[] | select(.[0] == "agentura.ru")'
# ["agentura.ru",[["media2022","webcollect2022/media2022/agentura.ru/",3,88130592,"2022-03-20","2022-03-20"]]]
```

Для каждого домена указаны коллекция, папка в хранилище, число файлов, объём в байтах, даты первого и последнего файла. Папка открывается по адресу `https://cdn.ruarxive.org/public/<папка>`.

## Запросы к каталогу

Parquet-файлы можно читать прямо из GitHub, без клонирования. Пример для [DuckDB](https://duckdb.org/):

```sql
-- Запись о сайте и инструмент, которым он собран
SELECT collection_id, name, status, date, tools
FROM 'https://raw.githubusercontent.com/ruarxive/ruarxive-db/main/data/datasets/records.parquet'
WHERE domain = 'agentura.ru';
-- media2022 | Agentura.ru | собран | 2022-03-20T14:26:00.000Z | [wpull]

-- Какими инструментами собирали
SELECT unnest(tools) AS tool, count(*) AS n
FROM 'https://raw.githubusercontent.com/ruarxive/ruarxive-db/main/data/datasets/records.parquet'
GROUP BY tool ORDER BY n DESC;
```

Второй запрос на 29.10.2026 даёт: wpull — 161 запись, Telegram Desktop — 9, wget — 2, apibackuper, aria2 и instaloader — по одной. Поле `tools` заполнено только у 173 записей из 2 641.

Таблица `resources` связана с `records` по `record_id` и содержит файлы: имя, адрес, размер, дату изменения, тип и расширение.

## Сборка наборов данных

```bash
git clone https://github.com/ruarxive/ruarxive-db.git
cd ruarxive-db
pip install -r requirements.txt

python3 builder.py build          # data/datasets/: JSONL, Parquet, DuckDB из YAML
python3 site_export.py --check    # проверить экспорт для сайта без исходных списков файлов
```

Наборы в репозитории могут отставать от YAML. На 29.10.2026 в `records.parquet` 2 601 строка, а `builder.py build` из текущих YAML даёт 2 641 запись и 16 156 файлов вместо 16 009. Для точных подсчётов пересоберите наборы. Сам экспорт для сайта (`python3 site_export.py` без `--check`) требует `data/filelists/`, которых в репозитории нет.

## Что показывает экспорт для сайта

По `summary.json` от 12.10.2026:

- в хранилище учтено 13,94 ТБ, 88 598 файлов, 3 322 домена, 182 папки верхнего уровня;
- 108 из них не описаны в каталоге: для них есть только списки файлов;
- источники — снимок хранилища от 13.12.2025 и реестр `allarchives.csv` от 12.12.2023;
- папки `webcollect2024`, `webcollect2025`, `armenia2024`, `mirrors2010` и `apibackuper` есть в хранилище, но ни в одном списке файлов: их объём неизвестен и не учтён.

ТБ здесь — 10¹² байт, как на странице [«Консервированное государство»](/kb/projects/preserved-government). Это нижняя оценка объёма архива.

### Как данные попадают на сайт

1. После обновления списков файлов `site_export.py` пересобирает `data/datasets/site/`, изменения отправляются в `main`.
2. Workflow `site-export.yml` в ruarxive-db проверяет экспорт (`site_export.py --check`) и отправляет событие `repository_dispatch` в репозиторий сайта.
3. Workflow `sync-archive-data.yml` сайта забирает экспорт этого коммита (`scripts/sync-archive-data.mjs --remote`), обновляет `src/data/archive-stats.json` и `static/data/archive-domains.json` и запускает публикацию.

Подробности и схема файлов — в [`docs/SITE_EXPORT.md`](https://github.com/ruarxive/ruarxive-db/blob/main/docs/SITE_EXPORT.md), схема YAML — в [`docs/YAML_DATABASE.md`](https://github.com/ruarxive/ruarxive-db/blob/main/docs/YAML_DATABASE.md).

## Ограничения

- **Каталог неполный.** У 2 381 записи из 2 641 нет статуса, типа ресурса и инструментов. У 2 339 из них есть только название, адрес, домен, коллекция и ссылки на файлы.
- **Дата файла — дата изменения в хранилище**, а не дата сбора. Они могут расходиться.
- **Идентификаторы записей не уникальны между коллекциями.** В YAML 2 641 файл записей, но разных `id` 2 625. Для связи используйте пару «коллекция + `id`».
- **Обновление ручное.** Данные обновляются по мере новых снимков хранилища, API нет.

## Связанные материалы

- [Все инструменты Ruarxive](/kb/instruments/ruarxive-tools)
- [Консервированное государство](/kb/projects/preserved-government) — коллекции госсайтов, цифры по тому же экспорту
- [Архивы контента российских СМИ](/kb/projects/russian-smi)
- [Статистика Ruarxive: снимок](/kb/resources/stats-snapshot)
- [Запрос на архивацию ресурса](/kb/preserved-projects-form)
