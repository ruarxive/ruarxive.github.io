---
title: metawarc — экстракторы метаданных
sidebar_label: metawarc extractors
sidebar_position: 8
description: "Как устроено извлечение метаданных в metawarc 2.x: встроенные экстракторы, выбор по MIME, расширению и сигнатуре, лимиты, формат результата. Публичного API плагинов нет."
last_update:
  date: 2026-10-12
---

# metawarc — экстракторы метаданных

Команда `metawarc index-content` извлекает метаданные из содержимого записей WARC с помощью набора встроенных **экстракторов**. На этой странице описано, какие экстракторы есть, как metawarc выбирает подходящий и что попадает в результат.

:::info Публичного API плагинов нет
В metawarc 2.0.3 нет механизма подключения сторонних экстракторов: ни базового класса для наследования, ни регистрации через entry points, ни метода `register()`. Набор типов в `index-content --type` фиксирован. Добавить новый формат можно только изменив код metawarc (форк или pull request в [репозиторий](https://github.com/ruarxive/metawarc)).
:::

> Описание сверено с исходным кодом пакета `metawarc.extractor` версии 2.0.3 (октябрь 2026).

## Встроенные экстракторы

| Класс | Имя (`extractor`) | Тип (`--type`) | На чём основан |
| :--- | :--- | :--- | :--- |
| `PdfExtractor` | `pdfminer` | `pdfs` | pdfminer.six |
| `OoxmlExtractor` | `ooxml-properties` | `ooxmldocs` | свойства документа из ZIP-контейнера OOXML |
| `SvgExtractor` | `svg-xml` | `images` | lxml |
| `WebpExtractor` | `webp-header` | `images` | разбор заголовка WebP |
| `HachoirExtractor` | `hachoir` | `images`, `videos`, `audio`, `oledocs` | hachoir |
| `FontExtractor` | `fonttools` | `fonts` | fontTools |
| `LinkExtractor` | `beautifulsoup-links` | `links` | BeautifulSoup |
| `TextExtractor` | `beautifulsoup-text` | текст для `--text` | BeautifulSoup (HTML) |
| `PdfTextExtractor` | `pdfminer-text` | текст для `--text` | pdfminer.six |
| `OoxmlTextExtractor` | `ooxml-text` | текст для `--text` | lxml (OOXML) |

Три текстовых экстрактора работают только при запуске с `--text` и пишут сайдкар `texts`, по которому ищут `metawarc search`, `GET /records/search` и MCP-инструмент `search_records`.

## Как выбирается экстрактор

Реестр — класс `ExtractorRegistry` в `metawarc/extractor/registry.py`. У него три части:

- конструктор `ExtractorRegistry(extractors=None)` — без аргумента собирает список встроенных экстракторов в фиксированном порядке;
- метод `select(mime=..., filename=..., prefix=..., expected_type=...)` — выбирает экстрактор для записи;
- функция `get_text_registry()` — возвращает реестр только из трёх текстовых экстракторов.

Порядок выбора в `select()`:

1. Отбираются экстракторы нужного типа (`expected_type`).
2. Если начало содержимого похоже на HTML, а запись претендует на бинарный формат, экстрактор не выбирается (с предупреждением).
3. Совпадение по **MIME-типу** из заголовка ответа имеет приоритет; если MIME и расширение указывают на разные экстракторы, побеждает MIME и пишется предупреждение.
4. Затем — совпадение по **расширению** файла.
5. Если ничего не подошло — проверка **сигнатуры** по первым 4096 байтам.

Кандидаты для каждого типа заранее отбираются по спискам MIME-типов и расширений из `metawarc/constants.py` (`MIMES_EXT_TYPE_BY_GROUP`). Например, для `images` это JPEG, PNG, GIF, TIFF, JPEG 2000, BMP, ICO, WebP, SVG, PSD и другие; для `oledocs` — DOC, XLS, PPT.

## Протокол экстрактора

Все экстракторы удовлетворяют протоколу `MetadataExtractor` из `metawarc/extractor/envelope.py`:

```python
class MetadataExtractor(Protocol):
    name: str
    detected_type: str
    mimes: frozenset[str]
    extensions: frozenset[str]

    def probe(self, prefix: bytes) -> bool: ...

    def extract(self, payload: bytes, limits: ExtractionLimits) -> dict[str, Any] | None: ...
```

Это внутренний интерфейс, а не документированное API: он может измениться в любой версии.

## Лимиты извлечения

Ограничения задаются классом `ExtractionLimits` (тот же модуль `envelope.py`). Значения по умолчанию:

| Параметр | По умолчанию |
| :--- | :--- |
| `max_payload_bytes` | 64 МиБ |
| `max_duration_seconds` | 30 с |
| `max_temporary_bytes` | 64 МиБ |
| `max_zip_members` | 1000 |
| `max_zip_expanded_bytes` | 128 МиБ |
| `max_zip_ratio` | 200 |
| `max_xml_bytes` | 8 МиБ |

Через параметры командной строки эти лимиты не меняются.

## Что попадает в результат

Для каждой обработанной записи сохраняется строка-«конверт» (схема `METADATA_SCHEMA`) в Parquet-сайдкаре соответствующего типа (`pdfs`, `images` и т. д.):

| Поле | Содержание |
| :--- | :--- |
| `archive_id`, `warc_id`, `source`, `url`, `filename`, `ext` | Откуда запись |
| `declared_mime`, `detected_type` | Заявленный MIME и определённый тип |
| `extractor`, `extractor_version`, `schema_version` | Какой экстрактор и какая версия схемы |
| `metadata_json`, `normalized_json` | Исходные и нормализованные метаданные (JSON) |
| `warnings_json`, `error_code`, `error_message` | Предупреждения и ошибки |
| `bytes_inspected`, `duration_ms` | Сколько байт прочитано и сколько длилось извлечение |

Ссылки (`links`) и тексты (`texts`) хранятся в собственных схемах `LINK_SCHEMA` и `TEXT_SCHEMA`.

Посмотреть результат можно так:

```bash
metawarc index-content --dbfile collection.db --type pdfs --type images
metawarc dump-metadata --dbfile collection.db --type pdfs -o pdfs.jsonl
metawarc analyze metadata --dbfile collection.db --type all --top 20
```

Ошибки извлечения не останавливают индексацию: они записываются в поля `error_code`/`error_message` конверта и учитываются в сводке команды.

## Если нужен новый формат

- **Без изменения metawarc**: выгрузите нужные файлы (`metawarc dump --exts dwg --output ./files`) и обработайте их своим инструментом.
- **С изменением metawarc**: нужно добавить класс, удовлетворяющий `MetadataExtractor`, включить его в список по умолчанию в `ExtractorRegistry.__init__`, а для нового типа — ещё и описать MIME-типы и расширения в `MIMES_EXT_TYPE_BY_GROUP` и добавить тип в `ContentIndexer.VALID_TYPES`. Передать собственный реестр в `ContentIndexer(registry=...)` из Python можно, но записи для обработки всё равно отбираются по встроенным спискам MIME-типов и расширений, поэтому новый формат так не добавить.

Как устроен процесс разработки, описано в [CONTRIBUTING](https://github.com/ruarxive/metawarc/blob/master/CONTRIBUTING.md).

## Связанные материалы

- [metawarc (обзор)](/kb/instruments/ruarxive-tools/metawarc)
- [metawarc: рецепты](/kb/instruments/ruarxive-tools/metawarc-cookbook)
- [Документация: метаданные и анализ](https://ruarxive.org/metawarc/use-cases/metadata-and-analysis)
- [Инструменты идентификации форматов](/kb/instruments/file-formats/identification-tools)
