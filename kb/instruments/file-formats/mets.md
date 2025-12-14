# METS (Metadata Encoding & Transmission Standard)

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

1. **metsHdr**: Заголовок METS документа
2. **dmdSec**: Описательные метаданные
3. **amdSec**: Административные метаданные
4. **fileSec**: Секция файлов
5. **structMap**: Структурная карта

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
      <mets:checksum CHECKSUMTYPE="MD5">abc123...</mets:checksum>
    </mets:file>
  </mets:fileGrp>
</mets:fileSec>
```

## Интеграция с другими стандартами

### PREMIS

METS часто используется вместе с PREMIS:

*   METS предоставляет структуру
*   PREMIS предоставляет метаданные сохранения в amdSec

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

## Best practices

### Структурирование

*   Используйте логическую структуру
*   Группируйте связанные файлы
*   Документируйте отношения между файлами

### Метаданные

*   Включайте полные описательные метаданные
*   Используйте стандартные схемы (Dublin Core, PREMIS)
*   Документируйте административные метаданные

### Валидация

*   Валидируйте METS документы
*   Проверяйте ссылки на файлы
*   Убедитесь в корректности структуры

## Ресурсы

*   [METS спецификация](https://www.loc.gov/standards/mets/)
*   [METS схема](https://www.loc.gov/standards/mets/mets.xsd)
*   [METS примеры](https://www.loc.gov/standards/mets/mets-extended.html)

## Связанные материалы

- [Метаданные PREMIS](/kb/instruments/file-formats/premis)
- [BagIt для упаковки](/kb/instruments/file-formats/bagit)
- [Создание метаданных](/kb/guides/custom-workflows)
