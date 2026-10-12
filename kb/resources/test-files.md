---
title: Тестовые файлы и корпуса
description: "Публичные корпуса тестовых файлов и примеры WARC для проверки инструментов цифрового сохранения и веб-архивации, с командами для проверки."
last_update:
  date: 2026-10-12
---

# Тестовые файлы и корпуса

Корпуса тестовых файлов нужны, чтобы проверять и сравнивать инструменты цифрового сохранения и веб-архивации: идентификацию форматов, валидацию, обработку WARC.

## Веб-архивы (WARC)

### Примеры от Internet Archive

[ExampleArcAndWarcFiles](https://archive.org/download/ExampleArcAndWarcFiles) — небольшие примеры файлов ARC и WARC от Internet Archive (`IAH-20080430204825-00000-blackbook.arc.gz` и `.warc.gz`). Подходят для проверки парсеров ARC и WARC.

### WARC из коллекций Ruarxive

- **Сайт Минспорта, 2019 год** — [minsport.gov.ru-2019-04-08-d8919777-00000.warc.gz](https://cdn.ruarxive.org/public/webcollect2019/gov2019/minsport.gov.ru-2019-04-08-d8919777/minsport.gov.ru-2019-04-08-d8919777-00000.warc.gz), около 1,1 ГБ. На нём удобно проверять индексацию и извлечение документов (PDF, Word) — пример из публикации о metawarc ([#160](https://t.me/ruarxive/160)).
- Полный перечень файлов хранилища — в реестре [`allarchives.csv`](https://cdn.ruarxive.org/public/allarchives.csv).

### Спецификации

[iipc/warc-specifications](https://github.com/iipc/warc-specifications) — спецификации WARC, CDX и связанных форматов, с примерами записей.

## Многоформатные корпуса

### OPF Format Corpus

[OPF Format Corpus](https://github.com/openpreserve/format-corpus) — коллекция тестовых файлов различных форматов от Open Preservation Foundation: офисные документы, PDF (в том числе подборка проблемных файлов `pdfCabinetOfHorrors`), JPEG 2000, TIFF, электронные книги, видео и другие.

- **Использование:** тестирование инструментов идентификации и валидации форматов.

### digitalcorpora.org

[digitalcorpora.org](https://digitalcorpora.org/) — корпуса данных для исследований в цифровой криминалистике, включая [govdocs1](https://digitalcorpora.org/corpora/file-corpora/files/) — около миллиона файлов, собранных с сайтов правительства США.

### EDRM Data Sets

[EDRM Data Sets](https://www.edrm.net/resources/data-sets/) — наборы тестовых данных для электронного раскрытия документов (e-discovery): документы, электронная почта.

## Корпуса по форматам

| Формат | Корпус |
|---|---|
| PDF/A | [veraPDF Corpus](https://github.com/veraPDF/veraPDF-corpus) — тестовые файлы для валидации PDF/A и PDF/UA |
| PDF | `pdfCabinetOfHorrors` и `pdf-handbuilt-test-corpus` в [OPF Format Corpus](https://github.com/openpreserve/format-corpus) |
| JPEG 2000 | [openjpeg-data](https://github.com/uclouvain/openjpeg-data), [jpylyzer-test-files](https://github.com/openpreserve/jpylyzer-test-files), каталоги `jp2k-test` и `jp2k-formats` в OPF Format Corpus |
| TIFF | каталог `tiff-examples` в OPF Format Corpus |
| EPUB | [w3c/epub-tests](https://github.com/w3c/epub-tests) — тесты EPUB от W3C; [KBNLresearch/epubPolicyTests](https://github.com/KBNLresearch/epubPolicyTests) — тесты политик EPUB (не обновляется с 2017 года) |

## Как проверять инструменты

### Идентификация форматов — Siegfried

```bash
git clone https://github.com/openpreserve/format-corpus
sf -hash md5 -csv format-corpus/ > sf-report.csv
```

> Проверено на siegfried 1.11.2 (октябрь 2026). Для DROID см. [документацию The National Archives](https://www.nationalarchives.gov.uk/information-management/manage-information/preserving-digital-records/droid/) и страницу [инструменты идентификации](/kb/instruments/file-formats/identification-tools).

### Валидация PDF/A — veraPDF

```bash
# -f 0 — автоматически выбрать профиль по метаданным файла
verapdf -f 0 file.pdf
```

Ключ профиля `-f` (`--flavour`) описан в [документации veraPDF](https://docs.verapdf.org/cli/validation/).

### Обработка WARC — warcio

```bash
pip install warcio
warcio index example.warc.gz         # индекс записей в JSON
warcio check -v example.warc.gz      # проверка цифровых подписей (digest) записей
warcio extract example.warc.gz 0     # извлечь запись по смещению
```

> Команды сверены с `--help` warcio 1.8.1 (октябрь 2026). У warcio есть подкоманды `index`, `check`, `extract` и `recompress`.

## Создание собственных корпусов

- Включайте различные типы файлов и проблемные случаи.
- Документируйте ожидаемые результаты для каждого файла.
- Указывайте источник и лицензию каждого файла.

Дополнения к OPF Format Corpus принимаются через [GitHub](https://github.com/openpreserve/format-corpus).

## Связанные материалы

- [Идентификация форматов](/kb/instruments/file-formats/identification-tools)
- [Регистры форматов](/kb/instruments/file-formats/format-registries)
- [Обработка WARC](/kb/instruments/tools/warc-processing)
