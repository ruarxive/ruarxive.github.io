# METS

**METS (Metadata Encoding & Transmission Standard)** — это стандарт кодирования и передачи метаданных, разработанный для структурирования метаданных цифровых объектов.

## Описание

METS предоставляет XML схему для структурирования метаданных, связывания файлов с метаданными и описания структуры цифровых объектов.

### Особенности

*   **Структурирование**: Структурирует метаданные в единый документ
*   **Связывание**: Связывает файлы с их метаданными
*   **Гибкость**: Можно адаптировать под различные системы
*   **XML формат**: Стандартный XML формат

## Структура METS

### Основные секции

METS документ состоит из нескольких секций:

1. **metsHdr**: Заголовок METS документа (обязательная) — агенты-создатели, даты, статус
2. **dmdSec**: Описательные метаданные — Dublin Core, MODS, собственный XML
3. **amdSec**: Административные метаданные — внутри три подсекции:
   - `techMD` — технические метаданные (формат, контрольные суммы)
   - `rightsMD` — правовая информация (лицензии, ограничения)
   - `digiprovMD` — метаданные происхождения (PREMIS-события)
   - `sourceMD` — метаданные исходных объектов
4. **fileSec**: Секция файлов — все файлы с указанием идентификаторов и расположения
6. **structMap**: Структурная карта — иерархия файлов, описывающая логическую и физическую структуру объекта
7. **structLink**: Связи между узлами разных structMap (опционально)
8. **behavior**: Поведение объекта (опционально)

### Пример структуры

```xml
<mets:mets>
  <mets:metsHdr>
    <mets:agent ROLE="CREATOR">
      <mets:name>Ruarxive</mets:name>
    </mets:agent>
  </mets:metsHdr>
  <mets:dmdSec ID="DMD1">
    <mets:mdWrap MDTYPE="DC">
      <mets:xmlData>
        <dc:title>Web Archive Collection</dc:title>
        <dc:date>2024-01-01</dc:date>
      </mets:xmlData>
    </mets:mdWrap>
  </mets:dmdSec>
  <mets:fileSec>
    <mets:fileGrp>
      <mets:file ID="FILE1">
        <mets:FLocat LOCTYPE="URL" xlink:href="archive.warc"/>
      </mets:file>
    </mets:fileGrp>
  </mets:fileSec>
  <mets:structMap>
    <mets:div>
      <mets:fptr FILEID="FILE1"/>
    </mets:div>
  </mets:structMap>
</mets:mets>
```

## Использование в архивации

### Структурирование архивов

METS можно использовать для структурирования веб-архивов:

*   **fileSec**: Список WARC файлов
*   **dmdSec**: Описательные метаданные коллекции
*   **amdSec**: Административные метаданные (PREMIS)
*   **structMap**: Структура архива

### Пример для веб-архивации

```xml
<mets:fileSec>
  <mets:fileGrp USE="archive">
    <mets:file ID="WARC1" MIMETYPE="application/warc">
      <mets:FLocat LOCTYPE="URL" xlink:href="archive.warc"/>
      <mets:checksum CHECKSUMTYPE="SHA-256">abc123...</mets:checksum>
    </mets:file>
  </mets:fileGrp>
</mets:fileSec>
```

### Структурные карты (structMap)

METS поддерживает несколько структурных карт с разной семантикой. Атрибут `TYPE` указывает назначение:

- `LOGICAL` — интеллектуальная структура объекта (разделы, главы, страницы). Для веб-архива — иерархия сайта.
- `PHYSICAL` — физическая структура (порядок и группировка файлов на диске).

Для сложных объектов принято включать обе карты и связывать их через `<mets:structLink>`.

```xml
<mets:structMap TYPE="LOGICAL" LABEL="Site hierarchy">
  <mets:div LABEL="Главная" TYPE="section">
    <mets:div LABEL="Новости" TYPE="subsection">
      <mets:fptr FILEID="PAGE1"/>
    </mets:div>
  </mets:div>
</mets:structMap>
```

## Интеграция с другими стандартами

### PREMIS

METS часто используется вместе с PREMIS:

*   METS предоставляет структуру
*   PREMIS предоставляет метаданные сохранения в `amdSec` (подсекции `digiprovMD` и `rightsMD`)

### Dublin Core

METS может включать Dublin Core метаданные в dmdSec:

```xml
<mets:dmdSec>
  <mets:mdWrap MDTYPE="DC">
    <mets:xmlData>
      <dc:title>Web Archive</dc:title>
      <dc:creator>Ruarxive</dc:creator>
    </mets:xmlData>
  </mets:mdWrap>
</mets:dmdSec>
```

## Профили и валидация

**METS Profile** — формальное ограничение METS под нужды сообщества: фиксирует, какие секции обязательны, какие схемы метаданных разрешены, какие ограничения на структуру. Профили публикуются как XML-документы и описываются в Profile Implementation Guidelines.

Для веб-архивов практический интерес представляют:

- [PREMIS in METS Guidelines](https://www.loc.gov/standards/premis/v3/premis-mets-guidelines-v1-0.html) — как встраивать PREMIS в `amdSec`.
- [METS Profile для DSpace](https://wiki.lyrasis.org/display/DSDOC6X/METS+Profile) — для академических репозиториев.

### Валидаторы METS

- **METS Validator** от Library of Congress — онлайн и CLI-вариант.
- **mets-validator** в Java-стеке Fedora / GoLoji.
- **xmllint** с подключением `mets.xsd` — базовая XML-схема валидация.

## Рекомендации

### Структурирование

*   Используйте логическую структуру (`structMap TYPE="LOGICAL"`) — она ближе к интеллектуальному объекту
*   Группируйте связанные файлы в `<mets:fileGrp USE="...">`
*   Документируйте отношения между файлами через `structLink`

### Метаданные

*   Включайте полные описательные метаданные (`dmdSec`)
*   Используйте стандартные схемы (Dublin Core, MODS, PREMIS)
*   Документируйте административные метаданные (`amdSec`)
*   Для контрольных сумм используйте **SHA-256**, не MD5

### Валидация

*   Валидируйте METS документы через mets-validator или xmllint по `mets.xsd`
*   Проверяйте ссылки на файлы (`fileSec` ↔ `structMap`)
*   Убедитесь в корректности структуры (нет битых ссылок на ID)

## Ресурсы

*   [METS спецификация](https://www.loc.gov/standards/mets/)
*   [METS схема (XSD)](https://www.loc.gov/standards/mets/mets.xsd)
*   [METS примеры](https://www.loc.gov/standards/mets/mets-extended.html)
*   [PREMIS в METS](https://www.loc.gov/standards/premis/v3/premis-mets-guidelines-v1-0.html)

## Связанные материалы

- [Метаданные PREMIS](/kb/instruments/file-formats/premis)
- [BagIt для упаковки](/kb/instruments/file-formats/bagit)
- [Кастомные workflow для архивации](/kb/guides/custom-workflows)
