---
sidebar_position: 5
title: "Архивация комплексных ресурсов: использование нескольких инструментов"
description: "Учебный пример: как сохранить ресурс, состоящий из сайта на WordPress, публичного портала SharePoint, API и файлов, комбинируя wparc, spcrawler, apibackuper и filegetter."
last_update:
  date: 2026-10-28
---

# Архивация комплексных ресурсов: использование нескольких инструментов

:::note
Это **учебный пример** на условном адресе `example.gov.ru`, а не отчёт о реальной кампании. Цифр объёма и времени здесь нет: они сильно зависят от конкретного ресурса. Команды сверены с `--help` и README инструментов (октябрь 2026), версии указаны в каждом разделе.
:::

Многие ресурсы организаций состоят из нескольких частей, и для каждой нужен свой инструмент:

| Часть ресурса | Инструмент | Что получаем |
|---|---|---|
| Сайт на WordPress | [wparc](/kb/instruments/ruarxive-tools/wparc) | JSON через REST API WordPress, медиафайлы, WARC |
| Публичный портал на SharePoint | [spcrawler](/kb/instruments/downloaded-data/spcrawler) | списки и данные SharePoint в JSON Lines, файлы |
| REST API с данными | [apibackuper](/kb/instruments/downloaded-data/apibackuper) | все записи API, экспорт в JSON Lines |
| Файлы по списку ссылок | [filegetter](/kb/instruments/ruarxive-tools/filegetter) | файлы в ZIP с отчётом и контрольными суммами |
| HTML-страницы целиком | [wget](/kb/instruments/tools/wget) или [Browsertrix](/kb/instruments/tools/browsertrix) | WARC для просмотра «как было» |

:::warning
Архивируйте только **общедоступные** части ресурса. Не используйте чужие учётные данные и не обходите авторизацию и другие технические средства защиты: это может нарушать закон (в том числе ст. 272 УК РФ). Если нужен доступ к закрытым разделам, договаривайтесь с владельцем ресурса.
:::

## Этап 1. Разведка

Сначала выясните, из чего состоит ресурс и какие API у него открыты:

```bash
# Открыт ли REST API WordPress
wparc ping example.gov.ru

# Есть ли публичный API SharePoint (проверяется адрес /_api/web)
spcrawler ping --url https://portal.example.gov.ru

# Что отдаёт API данных
curl -s "https://api.example.gov.ru/v1/datasets?page=1" | head
```

## Этап 2. Сайт на WordPress — wparc

```bash
# Версия с командой warc пока ставится из GitHub (в PyPI 1.0.8 её нет)
pip install git+https://github.com/ruarxive/wparc

wparc dump example.gov.ru --verbose        # данные REST API → example.gov.ru/data/*.jsonl
wparc getfiles example.gov.ru --verbose    # медиафайлы из wp_v2_media.jsonl
wparc warc example.gov.ru -o example.gov.ru.warc.gz   # упаковать дамп в WARC
```

`dump` сохраняет данные в каталог `<домен>/data/` — по файлу JSON Lines на маршрут API (`wp_v2_posts.jsonl`, `wp_v2_pages.jsonl`, `wp_v2_media.jsonl` и т. д.).

> Команды сверены с `--help` wparc 1.0.9 (GitHub, октябрь 2026).

## Этап 3. Публичный портал SharePoint — spcrawler

```bash
pip install spcrawler

spcrawler walk --url https://portal.example.gov.ru       # список объектов
spcrawler dump --url https://portal.example.gov.ru       # данные в portal.example.gov.ru/data
spcrawler getfiles --url https://portal.example.gov.ru   # файлы из библиотек документов
```

spcrawler работает с публичным API SharePoint (`/_api/web`), доступным без авторизации.

> Команды сверены с `--help` spcrawler 1.0.1 (PyPI, октябрь 2026).

## Этап 4. API с данными — apibackuper

```bash
pip install apibackuper

apibackuper create example-gov-api
cd example-gov-api
# заполнить конфигурацию: URL, параметры пагинации, ключ с данными
apibackuper estimate full
apibackuper run full
apibackuper export example-gov-api.jsonl
cd ..
```

Реальный пример конфигурации (отчёты Счётной палаты) и пояснения — в кейсе [«Архивация через API»](/kb/case-studies/api-archiving-scale).

> Команды сверены с `--help` apibackuper 2.0.0 (PyPI, октябрь 2026).

## Этап 5. Файлы по списку ссылок — filegetter

Если ссылки на документы уже собраны (например, из выгрузки API), их удобно скачать filegetter. Проект — это каталог с файлом `filegetter.cfg` в формате INI и исходным списком ссылок:

```ini
[project]
name = example-reports
source = reports.csv
source_type = csv

[data]
data_key = url

[files]
fetch_mode = prefix
root_url =
keys = url
delay = 1
retries = 3

[storage]
compression = True
write_warc = True
```

```bash
pip install "filegetter[warc]"

cd example-reports
filegetter run --dry-run   # показать, что будет скачано
filegetter run             # скачать
```

Файлы сохраняются в `storage/files.zip`, отчёт по каждому файлу (статус, MIME-тип, размер, SHA-256) — в `storage/processed.csv`, а при `write_warc = True` ответы дополнительно пишутся в `storage/files.warc.gz`.

> Команды и ключи сверены с README и `--help` filegetter 1.1.0 (PyPI, октябрь 2026).

## Этап 6. Сборка и проверка

Соберите результаты в один каталог и посчитайте контрольные суммы всех файлов:

```bash
find archive-example-gov -type f -exec sha256sum {} + > MANIFEST.sha256
```

Опишите в README архива: что сохранено, когда, какими инструментами и версиями, что не удалось сохранить.

## Рекомендации

1. **Начинайте с разведки.** Открытый API почти всегда даёт более полные и чистые данные, чем выкачка HTML.
2. **Сохраняйте и HTML.** Данные API не показывают, как ресурс выглядел для посетителя; для этого нужен WARC.
3. **Проверяйте каждый этап** сразу, а не в конце: части ресурса могут исчезнуть в разное время.
4. **Документируйте процесс** — какие команды и версии инструментов использовались.

## Связанные материалы

- [Пайплайн wparc → metawarc](/kb/case-studies/wparc-to-metawarc-pipeline)
- [Создание кастомных workflow](/kb/guides/custom-workflows)
- [wparc](/kb/instruments/ruarxive-tools/wparc)
- [spcrawler](/kb/instruments/downloaded-data/spcrawler)
- [apibackuper](/kb/instruments/downloaded-data/apibackuper)
- [filegetter](/kb/instruments/ruarxive-tools/filegetter)
