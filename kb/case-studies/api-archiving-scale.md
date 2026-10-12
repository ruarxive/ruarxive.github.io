---
sidebar_position: 6
title: "Архивация через API: опыт работы с государственными системами"
description: "Как Ruarxive архивирует данные государственных систем через API утилитой apibackuper — на примере отчётов Счётной палаты и кампании по порталам открытых данных."
last_update:
  date: 2026-10-12
---

# Архивация через API: опыт работы с государственными системами

Если у ресурса есть API, данные надёжнее сохранить через него, а не выкачивать HTML-страницы: получаются структурированные записи с метаданными, а связанные файлы (PDF, изображения) можно скачать по ссылкам из этих записей. В Ruarxive для этого используется утилита [apibackuper](/kb/instruments/downloaded-data/apibackuper).

## Кейс 1. Отчёты Счётной палаты (2022)

В декабре 2022 года сделан архив отчётов о проверках Счётной палаты ([#89](https://t.me/ruarxive/89), 02.12.2022):

- архив сделан с помощью **apibackuper**; настройки проекта лежат в репозитории [ruarxive/apibackuper-dataarchive](https://github.com/ruarxive/apibackuper-dataarchive/tree/main/achgovru-checks);
- общий объём — 4,2 ГБ в сжатом виде, около 5 ГБ в распакованном;
- копия загружена в Internet Archive: [archive.org/details/achgovru-checks](https://archive.org/details/achgovru-checks). Там же — набор данных с метаданными и ссылками на документы; структура каталогов в архиве повторяет структуру сайта Счётной палаты, поэтому по каждой ссылке из набора данных можно найти сохранённый файл.

Конфигурация проекта из репозитория (формат INI, `apibackuper.cfg`):

```ini
[settings]
initialized = True
name = achgov-checks

[project]
description = Accounting chamber checks archive
url = https://ach.gov.ru/api/v1/controls/list
http_mode = GET
work_modes = full,incremental,update
iterate_by = page

[params]
page_size_param = count
page_size_limit = 20
page_number_param = page

[data]
pages_number_key = result.pages
data_key = result.items
item_key = ID
change_key = DATE_CREATE

[files]
use_aria2 = True
fetch_mode = prefix
root_url =
keys = FILES.REPORT.SRC,FILES.ADDITIONAL.SRC,FILES.RECOMMENDATIONS.SRC,PERSON.IMG
storage_mode = filepath

[storage]
storage_type = zip
compression = True
```

Что здесь важно:

- `iterate_by = page` и раздел `[params]` описывают постраничный обход списка проверок;
- `data_key` и `pages_number_key` указывают, где в ответе API лежат записи и общее число страниц;
- раздел `[files]` перечисляет поля записей со ссылками на файлы отчётов — их скачивает отдельная команда `getfiles`.

## Кейс 2. Порталы открытых данных (2022)

Кампания по архивации порталов открытых данных началась 08.04.2022 ([#43](https://t.me/ruarxive/43)). К 20.05.2022 собраны данные 37 сайтов: 43 ГБ в сжатом виде (zip и warc.gz), около 320 ГБ в распакованном ([#55](https://t.me/ruarxive/55)):

- основной объём — слепки opendata.mkrf.ru (15 ГБ) и data.gov.ru (14 ГБ);
- порталы архивировались либо инструментами веб-архивации, либо скриптами под конкретный портал; код — в репозитории [ruarxive/rudatarchive](https://github.com/ruarxive/rudatarchive);
- перечень архивируемых сайтов вёлся в AirTable; всего в России, по оценке из поста, более 240 порталов, разделов и сайтов с открытыми данными.

**Вывод:** у порталов открытых данных очень разная структура, поэтому одной веб-архивации мало — для многих нужен скрипт или конфигурация API под конкретный портал.

## Как устроена работа с apibackuper

Порядок работы по README и `--help` apibackuper 1.0.13:

```bash
pip install apibackuper

apibackuper create achgov-checks      # создать проект (каталог с конфигурацией)
cd achgov-checks
# заполнить конфигурацию: URL, параметры пагинации, ключи данных

apibackuper estimate full             # оценить число записей, объём и время
apibackuper run full                  # выгрузить все страницы API
apibackuper run full --resume         # продолжить после обрыва с контрольной точки
apibackuper getfiles                  # скачать файлы по ссылкам из записей
apibackuper export achgov.jsonl       # выгрузить записи в JSON Lines
apibackuper update                    # позже — дозагрузить изменения
```

Вне каталога проекта путь к нему передаётся параметром `-p` (`--projectpath`), например `apibackuper run full -p achgov-checks`. Для формата экспорта есть ключ `-f` (`jsonl`, `gzip`, `zstd`, `parquet`; для Parquet нужна установка `apibackuper[recommended]`).

> Команды сверены с README и `--help` apibackuper 1.0.13 (PyPI, октябрь 2026). В этой версии `apibackuper create` создаёт конфигурацию в формате INI; README описывает YAML как основной формат. Полное описание параметров — в [документации apibackuper](https://ruarxive.org/apibackuper/).

## Практические советы

1. **Сначала `estimate`.** Оценка покажет число записей и примерное время, до того как вы начнёте нагружать сервер.
2. **Бережная нагрузка.** Ставьте небольшой размер страницы и паузы между запросами (параметры ограничения частоты — в [документации](https://ruarxive.org/apibackuper/)); государственные API часто отвечают медленно и ограничивают число запросов.
3. **Возобновление.** Длинные выгрузки прерываются — используйте `run full --resume`.
4. **Файлы отдельно.** Метаданные выгружайте через `run`, а связанные документы — через `getfiles`; так проще проверить полноту.
5. **Публикация.** Публикуйте вместе с архивом и конфигурацию, и набор метаданных — как в кейсе Счётной палаты, — чтобы архив можно было воспроизвести и проверить.

## Связанные материалы

- [apibackuper](/kb/instruments/downloaded-data/apibackuper)
- [Конфигурации apibackuper](/kb/instruments/downloaded-data/apibackuper-configs)
- [Архивация комплексных ресурсов](/kb/case-studies/multi-tool-archiving)
- [История проекта](/kb/about/project-history)
