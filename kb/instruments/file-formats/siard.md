# SIARD

**SIARD (Software-Independent Archiving of Relational Databases)** — формат архивации реляционных баз данных, разработанный Федеральным архивом Швейцарии. Используется для долгосрочного сохранения структурированных данных: государственных реестр, учётных систем, статистических баз.

## Зачем нужен SIARD

Реляционные СУБД привязаны к конкретному ПО (Oracle, PostgreSQL, MS SQL, MariaDB). Через 10-15 лет ПО может стать недоступным или его поддержка прекратится. SIARD описывает базу в виде стандартного ZIP-архива с XML-метаданными и плоскими файлами, который можно прочитать через любой текстовый редактор или стандартный инструмент.

## Версии стандарта

- **SIARD 1.0** (2012) — первая версия, фиксированный XML-словарь для Oracle и MS SQL.
- **SIARD 2.0** (2020) — современная версия, расширенная поддержка типов данных, улучшенная работа с LOB.

## Структура архива

```
archive.siard/
├── header/
│   └── metadata.xml       # метаданные архива (имя БД, описание, даты, агент)
├── content/
│   └── metadata.xml       # описание схемы, таблиц, типов данных
└── content/schema0/
    ├── table1/
    │   ├── table1.xml     # данные таблицы в формате XML
    │   └── lob/
    │       ├── 0/         # LOB первой записи
    │       │   ├── record_1.bin
    │       │   └── record_2.txt
    │       └── 1/
    │           └── record_3.png
    └── table2/
        └── table2.xml
```

**Ключевые компоненты:**

* **`metadata.xml`** — XML-описание всей базы: схемы, таблицы, типы колонок, ограничения, индексы, триггеры.
* **`<table>.xml`** — данные каждой таблицы в виде XML, с одной строкой на запись. Значения base64-кодируются встроенно или выносятся в `lob/`.
* **`lob/`** — папка с большими объектами (BLOB/CLOB), извлечёнными из базы и сохранёнными как отдельные файлы с оригинальной кодировкой.

## Что сохраняется

| Объект БД | Сохранение в SIARD |
| :--- | :--- |
| Схемы | полностью |
| Таблицы | полностью |
| Типы колонок | полностью |
| Первичные и внешние ключи | как XML-ограничения |
| Индексы | опционально (могут быть исключены) |
| Триггеры | опционально |
| Хранимые процедуры и функции | как исходный код (если поддерживается) |
| Представления (views) | опционально |
| Пользователи и роли | опционально |

## Инструменты

### SIARD Suite (коммерческий)

[SIARD Suite](https://www.deepfinity.com/products/siard-suite) — основной коммерческий инструмент, поддерживающий Oracle, MS SQL, PostgreSQL, MariaDB, Access.

### SIARD Format Library (Java, открытый)

Открытая Java-библиотека для чтения SIARD-архивов — [github.com/sfa-siard/siard-lib](https://github.com/sfa-siard/siard-lib).

```java
SiardArchive archive = SiardArchiveImpl.fromFile(new File("archive.siard"));
for (Schema schema : archive.getSchemas()) {
    for (Table table : schema.getTables()) {
        for (Record record : table.getRecords()) {
            System.out.println(record);
        }
    }
}
```

### DBPreservation (от CERN)

[DBPreservation](https://github.com/Marinerer/DBPreservation) — инструмент для конвертации PostgreSQL/MySQL в SIARD 2.0.

### Postgres → SIARD вручную

```bash
# Через pg_dump + собственный скрипт упаковки
pg_dump --no-owner --schema-only database > schema.sql
psql database -c "COPY (SELECT * FROM table1) TO '/tmp/table1.csv' CSV HEADER"
# далее упаковываем CSV → XML по схеме SIARD
```

## Валидация

Для проверки соответствия SIARD-архива спецификации используется валидатор [SIARD Format Library](https://github.com/sfa-siard/siard-lib). Он проверяет:

- Корректность структуры ZIP-архива
- Соответствие `metadata.xml` XSD-схеме
- Наличие всех файлов данных, на которые ссылается метаданные
- Корректность кодировок

## Сценарии использования в Ruarxive

- **Архивы государственных реестров** — ЕГРЮЛ, реестр лицензий, реестр НКО. SIARD позволяет сохранить исторические срезы без зависимости от живого ПО.
- **Резервные копии критических БД** на момент заморозки.
- **Архивы результатов научных и статистических исследований**, которые нужно сделать воспроизводимыми.

## Рекомендации

*   Используйте **SIARD 2.0** — современная версия с лучшей поддержкой типов.
*   Перед упаковкой прогоняйте БД через `VACUUM FULL` (PostgreSQL) или аналог — это уменьшит размер архива.
*   Включайте **только нужные схемы** — архив всего инстанса часто избыточен.
*   Сохраняйте **документацию схемы** (`README` с описанием таблиц и их смысла) внутри SIARD-контейнера как дополнительный файл.
*   Упаковывайте SIARD в **BagIt** для метаданных архива и контрольных сумм.
*   Проверяйте через Siegfried, что файлы внутри SIARD-архива идентифицируются как ожидаемые форматы (изображения, документы).

## Ресурсы

*   [SIARD 2.0 спецификация](https://www.bar.admin.ch/dam/de/themen/unterlagen-aerzen/digitale-archivierung/technische-grundlagen/siard-2.0/Standard/SIARD-2.0-Format-Specification_de.pdf) (на немецком, есть англоязычный перевод)
*   [SIARD Format Library](https://github.com/sfa-siard/siard-lib)
*   [SIARD Suite (commercial)](https://www.deepfinity.com/products/siard-suite)
*   [DBPreservation](https://github.com/Marinerer/DBPreservation)

## Связанные материалы

*   [Формат BagIt](/kb/instruments/file-formats/bagit)
*   [Метаданные PREMIS](/kb/instruments/file-formats/premis)
*   [WACZ формат](/kb/instruments/file-formats/wacz) — для веб-архивов аналог