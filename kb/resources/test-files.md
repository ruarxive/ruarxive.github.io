# Тестовые файлы и корпуса

Корпуса тестовых файлов необходимы для тестирования и оценки инструментов цифрового сохранения и веб-архивации.

## Многоформатные корпуса

### OPF Format Corpus

[OPF Format Corpus](https://github.com/openpreservation/format-corpus) — коллекция тестовых файлов различных форматов от Open Preservation Foundation.

*   **Использование**: Тестирование инструментов идентификации форматов
*   **Форматы**: Множество различных форматов файлов
*   **Доступ**: GitHub репозиторий

### iPres System Showcase Test Suite

[iPres System Showcase Test Suite](https://www.webarchive.org.uk/act/) — набор тестовых файлов, размещённый UK Web Archive.

*   **Использование**: Демонстрация возможностей систем сохранения
*   **Статус**: UKWA временно недоступен

### EDRM Data Set Files

[EDRM Data Set Files](https://www.edrm.net/resources/data-sets/) — наборы тестовых данных для электронного обнаружения.

*   **Использование**: Тестирование обработки различных форматов
*   **Форматы**: Документы, электронная почта, базы данных

### digitalcorpora.org

[digitalcorpora.org](https://digitalcorpora.org/) — корпуса данных, включая govdocs1.

*   **govdocs1**: Большой корпус правительственных документов
*   **Использование**: Тестирование на реальных данных

## Формат-специфичные корпуса

### PDF

*   **Adobe Acrobat Engineering**: Тестовые документы от Adobe
*   **Isartor PDF/A Test Suite**: Тесты для PDF/A
*   **veraPDF Corpus**: Корпус для PDF/A валидации
*   **PDF Cabinet of Horrors**: Проблемные PDF файлы

### JPEG2000

*   **OPF JP2k test corpus**: Тестовые файлы JPEG2000
*   **openjpeg-data**: Тестовые файлы для OpenJPEG
*   **jpylyzer-test-files**: Тестовые файлы для Jpylyzer

### TIFF

*   **libtiff TIFF Test Images**: Тестовые изображения TIFF

### ePub

*   **IDPF ePub test suite**: Официальный тестовый набор ePub
*   **KBNLresearch/epubPolicyTests**: Тесты политик ePub

## Веб-архивы

### Internet Archive Example Files

[Internet Archive Example Files](https://archive.org/download/ExampleArcAndWarcFiles) — примеры ARC и WARC файлов от Internet Archive.

*   **Использование**: Тестирование инструментов работы с WARC
*   **Форматы**: ARC, WARC

## Использование для тестирования

### Тестирование инструментов идентификации

```bash
# Тестирование Siegfried
sf -hash md5 OPF-format-corpus/

# Тестирование DROID
droid OPF-format-corpus/
```

### Тестирование валидации

```bash
# Тестирование валидации PDF/A
veraPDF --format pdfa OPF-format-corpus/*.pdf
```

### Тестирование обработки WARC

```bash
# Тестирование обработки WARC
warcio test example.warc
```

## Создание собственных корпусов

### Рекомендации

*   Включайте различные типы файлов
*   Добавляйте проблемные случаи
*   Документируйте ожидаемые результаты
*   Обновляйте корпус регулярно

### Вклад в существующие корпуса

Можно внести вклад в существующие корпуса:

*   [OPF Format Corpus](https://github.com/openpreservation/format-corpus)
*   Добавление новых форматов
*   Улучшение документации

## Ресурсы

*   [OPF Format Corpus](https://github.com/openpreservation/format-corpus)
*   [digitalcorpora.org](https://digitalcorpora.org/)
*   [EDRM Data Sets](https://www.edrm.net/resources/data-sets/)

## Связанные материалы

- [Идентификация форматов](/kb/instruments/file-formats/identification-tools)
- [Регистры форматов](/kb/instruments/file-formats/format-registries)
- [Обработка WARC](/kb/instruments/tools/warc-processing)
