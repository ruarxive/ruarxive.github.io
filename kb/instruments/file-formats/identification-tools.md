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

## Практика в Ruarxive

При загрузке данных в репозиторий Ruarxive мы стараемся прогонять идентификацию через **Siegfried** и сохранять полученный PUID в метаданных объекта. Это позволяет в будущем точно знать, чем открыть старые файлы.
