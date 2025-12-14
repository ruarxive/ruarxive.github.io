# Идентификация форматов

Для автоматического определения формата файла используются специализированные утилиты, которые анализируют содержимое файла (сигнатуры byte patterns), а не только расширение.

## Siegfried (sf)

[Siegfried](https://www.itforarchivists.com/siegfried/) — современный, быстрый и надежный инструмент для идентификации форматов. Рекомендуется к использованию в Ruarxive.

*   **Особенности**:
    *   Использует сигнатуры PRONOM.
    *   Написан на Go, очень быстрый.
    *   Поддерживает работу с потоками данных и контейнерами (ZIP, WARC).

### Установка

```bash
# MacOS (Homebrew)
brew install siegfried

# Linux (Debian/Ubuntu)
# Скачать .deb пакет с GitHub релизов
```

### Использование

```bash
sf myfile.doc
```

Вывод обычно содержит PUID, MIME-тип и версию формата:

```yaml
---
filename: myfile.doc
filesize: 25088
modified: 2023-10-27T10:00:00Z
errors:
matches:
  - ns: pronom
    id: fmt/40
    format: Microsoft Word Document
    version: 97-2003
    mime: application/msword
    basis: extension match doc; byte match at 0, 512
    warning:
```

## FIDO (Format Identification for Digital Objects)

[FIDO](https://github.com/openpreservation/fido) — инструмент на Python, разработанный Open Preservation Foundation.

*   **Особенности**:
    *   Легко интегрируется в Python-скрипты.
    *   Использует PRONOM.

### Установка

```bash
pip install opf-fido
```

### Использование

```bash
fido myfile.pdf
```

## Apache Tika

[Apache Tika](https://tika.apache.org/) — мощный инструмент для извлечения текста и метаданных, который также умеет определять форматы.

*   **Особенности**:
    *   Определяет тысячи форматов.
    *   Полезна, если нужно не только определить формат, но и вытащить текст/метаданные.
    *   Не всегда дает PUID в явном виде (чаще MIME-тип).

## DROID (Digital Record Object Identification)

[DROID](https://www.nationalarchives.gov.uk/information-management/manage-information/preserving-digital-records/droid/) — классический инструмент от Национального архива Великобритании.

*   **Особенности**:
    *   Написан на Java.
    *   Имеет графический интерфейс (GUI) и режим командной строки.
    *   Является эталонной реализацией для работы с PRONOM.
    *   Может работать медленнее, чем Siegfried.

## Сравнение

| Инструмент | Язык | Скорость | База данных | Рекомендация |
| :--- | :--- | :--- | :--- | :--- |
| **Siegfried** | Go | Высокая | PRONOM | **Основной выбор** |
| **FIDO** | Python | Средняя | PRONOM | Для Python-проектов |
| **DROID** | Java | Средняя | PRONOM | Для GUI / валидации |
| **Tika** | Java | Средняя | Tika/Mime | Для извлечения текста |

## TrID (Online TrID File Identifier)

[Online TrID File Identifier](https://mark0.net/onlinetrid.aspx) — веб-сервис для идентификации файлов на основе TrID базы данных.

*   **Особенности**:
    *   Работает через веб-интерфейс
    *   Не требует установки
    *   Поддерживает загрузку файлов до определённого размера
    *   Использует собственную базу данных сигнатур

### Использование

Загрузите файл на сайт, и сервис определит его формат на основе анализа содержимого.

## Регистры форматов файлов

### PRONOM

[PRONOM](https://www.nationalarchives.gov.uk/PRONOM/) — база данных форматов файлов, поддерживаемая Национальным архивом Великобритании. Используется инструментами Siegfried, FIDO и DROID.

*   **Особенности**:
    *   Официальная база данных форматов
    *   PUID (PRONOM Unique Identifier) для каждого формата
    *   Регулярно обновляется
    *   Открытый доступ

### File Formats Wiki

[File Formats Wiki](https://www.fileformat.info/) — вики-энциклопедия форматов файлов с подробными описаниями и примерами.

### Just Solve It

[Just Solve It - File Formats Wiki](https://justsolve.archiveteam.org/wiki/File_Format) — сообщественный проект документирования широкого спектра форматов файлов.

### Game File Format Central

[Game File Format Central](https://github.com/Malvineous/game-file-formats) — проект документирования более 1300 игровых форматов файлов.

Подробнее: [Регистры форматов файлов](/kb/instruments/file-formats/format-registries)

## Браузерные инструменты

### Siegfried JS

[Siegfried JS](https://github.com/richardlehane/siegfried-js) — версия Siegfried, работающая в браузере через WebAssembly.

*   **Особенности**:
    *   Работает полностью в браузере
    *   Не требует отправки файлов на сервер
    *   Использует те же сигнатуры PRONOM
    *   Подходит для конфиденциальных данных

### Demystify Lite

[Demystify Lite](https://github.com/ross-spencer/demystify-lite) — инструмент для профилирования коллекций файлов в браузере.

*   **Особенности**:
    *   Работает в браузере (WASM)
    *   Профилирует коллекции файлов
    *   Выделяет файлы, требующие внимания
    *   Определяет дубликаты
    *   Анализирует кодировки имён файлов

## Практика в Ruarxive

При загрузке данных в репозиторий Ruarxive мы стараемся прогонять идентификацию через **Siegfried** и сохранять полученный PUID в метаданных объекта. Это позволяет в будущем точно знать, чем открыть старые файлы.

## Сравнение регистров форматов

| Регистр | Источник | Использование | Обновления |
| :--- | :--- | :--- | :--- |
| **PRONOM** | Национальный архив Великобритании | Siegfried, FIDO, DROID | Регулярные |
| **File Formats Wiki** | Сообщество | Справочная информация | Постоянные |
| **Just Solve It** | Archive Team | Документирование форматов | Постоянные |
| **Game File Format Central** | Сообщество | Игровые форматы | Постоянные |
