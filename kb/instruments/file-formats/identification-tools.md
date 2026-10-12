---
title: Идентификация форматов
description: "Инструменты идентификации форматов файлов по сигнатурам — Siegfried, DROID, FIDO, Apache Tika, TrID — и чем идентификация отличается от валидации (JHOVE, veraPDF, jpylyzer)."
last_update:
  date: 2026-10-12
---

# Идентификация форматов

Для автоматического определения формата файла используются специализированные утилиты, которые анализируют содержимое файла (байтовые сигнатуры), а не только расширение.

## Siegfried (sf)

[Siegfried](https://www.itforarchivists.com/siegfried/) — современный, быстрый и надежный инструмент для идентификации форматов ([исходный код](https://github.com/richardlehane/siegfried)). Рекомендуется к использованию в Ruarxive.

*   **Особенности**:
    *   Использует сигнатуры PRONOM (по умолчанию), может работать и с сигнатурами MIME-info и LC FDD.
    *   Написан на Go, очень быстрый.
    *   Умеет заглядывать внутрь контейнеров: ZIP, TAR, GZIP, WARC, ARC (флаг `-z`).

### Установка

```bash
# macOS (Homebrew)
brew install richardlehane/digipres/siegfried

# Debian/Ubuntu (64 bit) — репозиторий автора
curl -sL "http://keyserver.ubuntu.com/pks/lookup?op=get&search=0x20F802FE798E6857" | gpg --dearmor | sudo tee /usr/share/keyrings/siegfried-archive-keyring.gpg
echo "deb [signed-by=/usr/share/keyrings/siegfried-archive-keyring.gpg] https://www.itforarchivists.com/ buster main" | sudo tee -a /etc/apt/sources.list.d/siegfried.list
sudo apt-get update && sudo apt-get install siegfried

# При установленном Go
go install github.com/richardlehane/siegfried/cmd/sf@latest

# Загрузить актуальные сигнатуры
sf -update
```

Для Windows есть готовые сборки на [странице релизов](https://github.com/richardlehane/siegfried/releases). Собственные сигнатурные файлы (например, с сигнатурами LC FDD или ограничением размера буфера) собираются утилитой `roy` из того же пакета.

### Использование

```bash
# Один файл
sf myfile.doc

# Каталог, вывод в CSV или JSON
sf -csv ./collection/ > report.csv
sf -json ./collection/ > report.json

# Заглянуть внутрь архивов и WARC-файлов
sf -z archive.warc.gz

# Параллельная обработка большого каталога
sf -multi 32 ./collection/
```

> Команды сверены с README Siegfried 1.11.9 (октябрь 2026).

Вывод в формате YAML содержит PUID, MIME-тип, версию формата и основание идентификации, примерно так:

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

## DROID (Digital Record Object Identification)

[DROID](https://www.nationalarchives.gov.uk/information-management/manage-information/preserving-digital-records/droid/) — классический инструмент Национального архива Великобритании ([исходный код](https://github.com/digital-preservation/droid)).

*   **Особенности**:
    *   Написан на Java.
    *   Имеет графический интерфейс (GUI) и режим командной строки.
    *   Является эталонной реализацией для работы с PRONOM.
    *   Обычно работает медленнее, чем Siegfried.

```bash
# Идентификация файла (вывод — CSV в stdout)
droid file.jpg

# Рекурсивно по каталогу
droid -R directory

# Только нужные столбцы
droid -co NAME PUID -a file.jpg

# Проверить и загрузить обновления сигнатур
droid -c
droid -d
```

Исполняемый файл называется `droid.sh` (Linux/macOS) или `droid.bat` (Windows).

> Команды взяты из README DROID (релиз 6.9.14, октябрь 2026).

## FIDO (Format Identification for Digital Objects)

[FIDO](https://github.com/openpreserve/fido) — инструмент на Python, разработанный Open Preservation Foundation.

*   **Особенности**:
    *   Легко интегрируется в Python-скрипты.
    *   Использует сигнатуры PRONOM.

```bash
pip install opf-fido

fido myfile.pdf
fido -recurse ./collection/
```

> Проверено с opf-fido 1.6.1 (октябрь 2026).

## Apache Tika

[Apache Tika](https://tika.apache.org/) — инструмент для извлечения текста и метаданных, который также умеет определять форматы.

*   **Особенности**:
    *   Определяет широкий набор форматов по собственной базе MIME-типов.
    *   Полезен, если нужно не только определить формат, но и извлечь текст и метаданные.
    *   Возвращает MIME-тип, а не PUID.

## file / libmagic

Утилита `file` (библиотека libmagic) есть почти в любой Unix-системе. Она быстро определяет тип и MIME-тип (`file --mime-type myfile`), но не выдаёт PUID и не различает версии форматов так детально, как Siegfried или DROID. Годится для предварительной сортировки.

## TrID

[TrID](https://mark0.net/soft-trid-e.html) — утилита идентификации по бинарным сигнатурам с собственной расширяемой базой определений. Есть офлайн-версия для командной строки и веб-сервис [Online TrID](https://mark0.net/onlinetrid.aspx).

*   **Особенности**:
    *   Собственная база сигнатур (не PRONOM), PUID не выдаёт.
    *   Полезна для редких и нестандартных форматов.
    *   Онлайн-версия требует загрузки файла на сторонний сервер — **не используйте её для конфиденциальных материалов**; для них подходит офлайн-утилита.

## Сравнение

| Инструмент | Язык | Скорость | База данных | Рекомендация |
| :--- | :--- | :--- | :--- | :--- |
| **Siegfried** | Go | Высокая | PRONOM (а также MIME-info, LC FDD) | **Основной выбор** |
| **DROID** | Java | Средняя | PRONOM | Эталон, GUI |
| **FIDO** | Python | Средняя | PRONOM | Для Python-проектов |
| **Tika** | Java | Средняя | Tika MIME | Для извлечения текста |
| **file** | C | Высокая | libmagic | Предварительная сортировка |
| **TrID** | — | Средняя | TrID | Редкие форматы |

## Идентификация и валидация

Идентификация отвечает на вопрос «что это за формат», но не проверяет, **корректен** ли файл. Для валидации используются отдельные инструменты:

- **[JHOVE](https://jhove.openpreservation.org/)** — валидатор Open Preservation Foundation с модулями для многих форматов (PDF, TIFF, JPEG 2000, WARC и др.); модуль выбирается ключом `-m`, например `jhove -m WARC-kb archive.warc.gz`.
- **[veraPDF](https://verapdf.org/)** — проверка соответствия PDF/A и PDF/UA (см. [PDF/A](/kb/instruments/file-formats/pdfa)).
- **[jpylyzer](https://jpylyzer.openpreservation.org/)** — валидация JPEG 2000 (см. [JP2](/kb/instruments/file-formats/jp2)).
- **warcio check** — проверка дайджестов WARC-записей (см. [WARC](/kb/instruments/file-formats/warc)).

## Реестры форматов

Идентификаторы (PUID, FDD-номера, MIME-типы), которые выдают перечисленные выше инструменты, берутся из специализированных **реестров форматов файлов**. Сводный обзор реестров (PRONOM, LC FDD, Wikidata, Digipres.org и т. д.), их специализация и рекомендации по использованию — на странице [Реестры форматов файлов](/kb/instruments/file-formats/format-registries).

## Браузерные инструменты

### Siegfried в браузере (WebAssembly)

В репозитории Siegfried есть [WebAssembly-сборка](https://github.com/richardlehane/siegfried/tree/main/wasm), которую можно встроить в собственную веб-страницу (сборка выполнена при поддержке Архива Новой Зеландии).

*   **Особенности**:
    *   Работает полностью в браузере
    *   Не требует отправки файлов на сервер
    *   Использует те же сигнатуры PRONOM
    *   Подходит для конфиденциальных данных

### Demystify Lite

[Demystify Lite](https://github.com/ross-spencer/demystify-lite) — браузерная версия анализатора коллекций Demystify, построенная на WebAssembly-сборке Siegfried и PyScript.

*   **Особенности**:
    *   Идентификация и построение отчёта по коллекции полностью в браузере, без передачи файлов по сети
    *   Может анализировать готовые отчёты DROID и Siegfried
    *   Можно развернуть у себя как статический сайт

## Практика в Ruarxive

При загрузке данных в репозиторий Ruarxive мы стараемся прогонять идентификацию через **Siegfried** и сохранять полученный PUID в метаданных объекта. Это позволяет в будущем точно знать, чем открыть старые файлы.
