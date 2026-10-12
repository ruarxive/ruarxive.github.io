---
title: PDF/A
description: "PDF/A (ISO 19005) — архивное подмножество PDF: версии от PDF/A-1 до PDF/A-4, ограничения, создание в LibreOffice и Ghostscript, проверка veraPDF и идентификаторы PRONOM."
last_update:
  date: 2026-10-12
---

# PDF/A

**PDF/A (PDF for Archiving)** — серия стандартов ISO (ISO 19005), описывающих подмножество формата PDF, пригодное для долгосрочного хранения электронных документов. Это основной формат для архивации нормативных актов, отчётов, договоров и других «бумажных» документов в цифровых архивах.

## Зачем нужен PDF/A

Обычный PDF может содержать элементы, зависящие от внешних ресурсов или окружения: шрифты, не встроенные в файл; ссылки на внешний контент; JavaScript-действия; шифрование. Через несколько лет такой файл может отображаться иначе или перестать открываться. PDF/A запрещает подобные элементы и требует, чтобы всё необходимое для отображения было внутри файла.

## Версии стандарта

| Версия | ISO | Год | Особенности |
| :---: | :--- | :---: | :--- |
| **PDF/A-1a** | ISO 19005-1 | 2005 | На основе PDF 1.4; полная структурная и семантическая разметка (tagged PDF) |
| **PDF/A-1b** | ISO 19005-1 | 2005 | Минимальные требования: надёжное визуальное воспроизведение |
| **PDF/A-2a** | ISO 19005-2 | 2011 | На основе ISO 32000-1 (PDF 1.7); разрешены прозрачность, слои, OpenType, JPEG 2000; структурная разметка |
| **PDF/A-2b** | ISO 19005-2 | 2011 | Базовый уровень второго поколения |
| **PDF/A-2u** | ISO 19005-2 | 2011 | Уровень b + Unicode-соответствие для всего текста (надёжный поиск и копирование) |
| **PDF/A-3a** | ISO 19005-3 | 2012 | Как PDF/A-2, но разрешены встроенные файлы любых форматов (XML, CSV, CAD); структурная разметка |
| **PDF/A-3b** | ISO 19005-3 | 2012 | Базовый уровень + встроенные файлы |
| **PDF/A-3u** | ISO 19005-3 | 2012 | Unicode-соответствие + встроенные файлы |
| **PDF/A-4** | ISO 19005-4 | 2020 | На основе PDF 2.0 (ISO 32000-2); деление на уровни a/b/u отменено |
| **PDF/A-4f** | ISO 19005-4 | 2020 | PDF/A-4 со встроенными файлами любых форматов |
| **PDF/A-4e** | ISO 19005-4 | 2020 | PDF/A-4 для инженерной документации: разрешены 3D-модели и RichMedia (замена PDF/E) |

Уровни `a` включают требования уровня `u` (и `b`) плюс обязательную логическую структуру (tagged PDF), что упрощает поиск, извлечение содержимого и доступность для людей с нарушениями зрения.

## Что запрещено в PDF/A

*   **Шифрование**: документ не должен быть защищён паролем или содержать DRM-ограничения.
*   **Внешние зависимости**: все шрифты и изображения должны быть встроены в файл.
*   **JavaScript и запуск внешних программ**: запрещены.
*   **Аудио и видео**: мультимедийные аннотации запрещены в PDF/A-1, -2 и -3; в PDF/A-4e допускается RichMedia.
*   **Прозрачность**: запрещена в PDF/A-1, разрешена начиная с PDF/A-2.
*   **Встроенные файлы**: запрещены в PDF/A-1; в PDF/A-2 допускаются только вложения, которые сами являются PDF/A; произвольные вложения — в PDF/A-3 и PDF/A-4f.
*   **Ссылки на внешние ресурсы**: URI-ссылки допустимы как навигация, но не должны влиять на визуальное отображение.

## Определение уровня PDF/A в файле

PDF/A-файл содержит XMP-метаданные с указанием уровня соответствия. Адрес `http://www.aiim.org/pdfa/ns/id/` в примере — это идентификатор пространства имён XMP, заданный стандартом, а не ссылка на сайт; менять его нельзя.

```xml
<?xpacket begin="" id="W5M0MpCehiHzreSzNTczkc9d"?>
<x:xmpmeta xmlns:x="adobe:ns:meta/">
  <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">
    <rdf:Description rdf:about=""
      xmlns:pdfaid="http://www.aiim.org/pdfa/ns/id/">
      <pdfaid:part>2</pdfaid:part>
      <pdfaid:conformance>B</pdfaid:conformance>
    </rdf:Description>
  </rdf:RDF>
</x:xmpmeta>
```

Этот блок должен присутствовать в метаданных документа. Его наличие — необходимое, но не достаточное условие: файл может быть помечен PDF/A-2b, но при этом содержать запрещённые элементы.

## Создание PDF/A

### Из офисных пакетов

LibreOffice и Microsoft Office умеют сохранять в PDF/A (в диалоге экспорта в PDF есть соответствующая опция), но результат всё равно нужно проверять валидатором.

В LibreOffice из командной строки версия PDF/A задаётся параметром фильтра экспорта `SelectPdfVersion`: `1` — PDF/A-1b, `2` — PDF/A-2b, `3` — PDF/A-3b.

```bash
# LibreOffice: сохранить в PDF/A-2b
soffice --headless \
  --convert-to 'pdf:writer_pdf_Export:{"SelectPdfVersion":{"type":"long","value":"2"}}' \
  document.docx
```

Для таблиц и презентаций используются фильтры `calc_pdf_Export` и `impress_pdf_Export`. Параметры описаны в [справке LibreOffice](https://help.libreoffice.org/latest/en-US/text/shared/guide/pdf_params.html).

### Через Ghostscript

Ghostscript умеет создавать только PDF/A-1, -2 и -3 уровня **b**. Помимо ключа `-dPDFA` нужен файл определения PDF/A (образец — `lib/PDFA_def.ps` в дистрибутиве Ghostscript), в котором необходимо указать путь к ICC-профилю для OutputIntent:

```bash
gs -dPDFA=2 -dBATCH -dNOPAUSE \
   -sColorConversionStrategy=RGB \
   -dPDFACompatibilityPolicy=1 \
   -sDEVICE=pdfwrite -sOutputFile=output.pdf \
   PDFA_def.ps input.pdf
```

`-dPDFACompatibilityPolicy=1` означает «отбрасывать несовместимые элементы с предупреждением». Подробности — в разделе [Creating a PDF/A document](https://ghostscript.readthedocs.io/en/latest/VectorDevices.html) документации Ghostscript.

## Валидация

Валидация — критический этап: файл может быть помечен PDF/A, но не пройти проверку соответствия. Сам по себе veraPDF файлы в PDF/A не конвертирует (умеет только исправлять метаданные опцией `--fixmetadata`).

### veraPDF (основной валидатор)

[veraPDF](https://verapdf.org/) — эталонный open-source валидатор, поддерживаемый PDF Association. Устанавливается через инсталлятор со страницы [verapdf.org/software](https://verapdf.org/software/) (требуется Java); пакета `verapdf` в стандартных репозиториях Debian/Ubuntu нет.

```bash
# Проверка одного файла (уровень определяется по XMP-метаданным файла)
verapdf document.pdf

# Проверка на соответствие конкретному уровню
verapdf --flavour 2b document.pdf

# Рекурсивная проверка каталога (обрабатываются файлы .pdf)
verapdf --recurse --flavour 2b ./archive/

# Отчёт в машиночитаемом виде
verapdf --flavour 2b --format json document.pdf
```

Встроенные профили (значения `--flavour` / `-f`): `1a`, `1b`, `2a`, `2b`, `2u`, `3a`, `3b`, `3u`, `4`, `4e`, `4f`, а также `ua1` для PDF/UA. Форматы отчёта (`--format`): `xml`, `mrr`, `json`, `html`, `text`, `raw`. Опция `--profile` / `-p` загружает **файл** собственного профиля проверки.

> Опции veraPDF сверены с исходным кодом CLI (`VeraCliArgParser.java`) и списком профилей библиотеки veraPDF (октябрь 2026).

## PUID в PRONOM

Варианты PDF/A зарегистрированы в реестре [PRONOM](https://www.nationalarchives.gov.uk/PRONOM/) с собственными идентификаторами (PUID), которые выдают [Siegfried и DROID](/kb/instruments/file-formats/identification-tools):

| Формат | PUID |
| :--- | :--- |
| PDF/A-1a | [`fmt/95`](https://www.nationalarchives.gov.uk/PRONOM/fmt/95) |
| PDF/A-1b | [`fmt/354`](https://www.nationalarchives.gov.uk/PRONOM/fmt/354) |
| PDF/A-2a | [`fmt/476`](https://www.nationalarchives.gov.uk/PRONOM/fmt/476) |
| PDF/A-2b | [`fmt/477`](https://www.nationalarchives.gov.uk/PRONOM/fmt/477) |
| PDF/A-2u | [`fmt/478`](https://www.nationalarchives.gov.uk/PRONOM/fmt/478) |
| PDF/A-3a | [`fmt/479`](https://www.nationalarchives.gov.uk/PRONOM/fmt/479) |
| PDF/A-3b | [`fmt/480`](https://www.nationalarchives.gov.uk/PRONOM/fmt/480) |
| PDF/A-3u | [`fmt/481`](https://www.nationalarchives.gov.uk/PRONOM/fmt/481) |
| PDF/A-4 | [`fmt/1910`](https://www.nationalarchives.gov.uk/PRONOM/fmt/1910) |
| PDF/A-4e | [`fmt/1911`](https://www.nationalarchives.gov.uk/PRONOM/fmt/1911) |
| PDF/A-4f | [`fmt/1912`](https://www.nationalarchives.gov.uk/PRONOM/fmt/1912) |

Идентификаторы сверены с сигнатурным файлом DROID V125. PUID стоит сохранять в метаданных архивного объекта вместе с названием инструмента и версией сигнатурного файла, которыми он получен.

## Сценарии использования в Ruarxive

- **Нормативные акты и законы**, публикуемые государственными органами в формате PDF/A — типичный случай для архивов законодательства.
- **Отчёты, протоколы, акты** — материалы с электронной подписью; для приложения исходных данных используется PDF/A-3.
- **Сканы с бумаги** с OCR-слоем — после OCR и встраивания шрифтов сохраняются в PDF/A-2u для поиска по тексту.
- **Архивные описи и каталоги**, опубликованные в PDF/A-1a или PDF/A-2a для обеспечения доступности.

## Рекомендации

*   По умолчанию используйте **PDF/A-2b** — это широко поддерживаемый уровень.
*   Если нужен поиск по тексту или OCR — **PDF/A-2u**.
*   Если требуется логическая структура (для доступности) — **PDF/A-2a**.
*   Если нужно встроить исходные данные (XML, CSV, JSON) — **PDF/A-3b** (или **PDF/A-4f**, если ваши инструменты поддерживают PDF 2.0).
*   Всегда валидируйте через **veraPDF** перед приёмом в архив.
*   Сохраняйте PUID в метаданных объекта для долгосрочной идентификации.

## Ресурсы

*   [ISO 19005-1:2005 (PDF/A-1)](https://www.iso.org/standard/38920.html)
*   [PDF/A в PDF Association](https://www.pdfa.org/pdf-a/)
*   [veraPDF валидатор](https://verapdf.org/) и [документация CLI](https://docs.verapdf.org/cli/)
*   [LC FDD — PDF/A Family](https://www.loc.gov/preservation/digital/formats/fdd/fdd000318.shtml)
*   [PRONOM — PDF/A-2b (fmt/477)](https://www.nationalarchives.gov.uk/PRONOM/fmt/477)

## Связанные материалы

*   [Реестры форматов файлов](/kb/instruments/file-formats/format-registries)
*   [Идентификация форматов](/kb/instruments/file-formats/identification-tools)
*   [Формат BagIt](/kb/instruments/file-formats/bagit) — для упаковки PDF/A-коллекций
