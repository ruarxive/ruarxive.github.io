# PREMIS

**PREMIS (Preservation Metadata Implementation Strategies)** — это стандарт метаданных для цифрового сохранения, разработанный для документирования информации, необходимой для долгосрочного сохранения цифровых объектов.

## Описание

PREMIS определяет набор основных метаданных, которые репозитории должны записывать для обеспечения долгосрочного сохранения цифровых объектов.

### Особенности

*   **Стандартизация**: Международный стандарт метаданных
*   **Сохранение**: Фокус на метаданных для сохранения
*   **Гибкость**: Можно адаптировать под различные системы
*   **XML формат**: Стандартный XML формат

## Структура PREMIS

### Основные сущности

PREMIS определяет пять основных сущностей:

1. **Intellectual Entity**: Интеллектуальный объект (например, веб-сайт, книга, фильм)
2. **Object**: Цифровой объект — файл, битстрим или их представление. Бывает трёх типов: `file` (файл с метаданными), `bitstream` (битстрим как объект), `representation` (составной объект из нескольких файлов)
3. **Event**: Событие — действие, выполненное над объектом (захват, миграция, проверка целостности)
4. **Agent**: Агент — человек, организация или программное обеспечение, выполнившее событие
5. **Rights**: Права — информация о правах доступа к объекту (лицензии, разрешения, ограничения)

### Intellectual Entity vs Object

Различие между ними принципиально для веб-архивов:

- **Intellectual Entity** = то, что мы понимаем как «единицу» архива (сайт госоргана, профиль в соцсети, выпуск новостей).
- **Object** = то, что физически лежит на диске (WARC-файл, набор скриншотов, исходный JSON).

Один Intellectual Entity состоит из одного или нескольких Object. PREMIS позволяет связать их через `linkingEventIdentifier` и `linkingAgentIdentifier`.

### Rights (права доступа)

Сущность Rights описывает правовой режим объекта. Стандартные категории rights statements:

- **copyright** — авторские права на объект
- **license** — лицензия (Creative Commons, GNU и т. п.)
- **statutory** — правовое основание доступа (например, закон об архивах)
- **other** — иные права (патент, товарный знак, договорные ограничения)

Пример:

```xml
<premis:rightsStatement>
  <premis:rightsStatementIdentifier>
    <premis:rightsStatementIdentifierType>UUID</premis:rightsStatementIdentifierType>
    <premis:rightsStatementIdentifierValue>...</premis:rightsStatementIdentifierValue>
  </premis:rightsStatementIdentifier>
  <premis:rightsBasis>license</premis:rightsBasis>
  <premis:rightsGranted>
    <premis:act>reproduce</premis:act>
    <premis:restriction>Allow</premis:restriction>
  </premis:rightsGranted>
  <premis:linkingObjectIdentifierValue>123e4567-...</premis:linkingObjectIdentifierValue>
</premis:rightsStatement>
```

### Пример структуры

```xml
<premis:premis>
  <premis:object>
    <premis:objectIdentifier>
      <premis:objectIdentifierType>UUID</premis:objectIdentifierType>
      <premis:objectIdentifierValue>123e4567-e89b-12d3-a456-426614174000</premis:objectIdentifierValue>
    </premis:objectIdentifier>
    <premis:objectCategory>File</premis:objectCategory>
    <premis:preservationLevel>
      <premis:preservationLevelType>1</premis:preservationLevelType>
    </premis:preservationLevel>
  </premis:object>
  <premis:event>
    <premis:eventIdentifier>
      <premis:eventIdentifierType>UUID</premis:eventIdentifierType>
      <premis:eventIdentifierValue>...</premis:eventIdentifierValue>
    </premis:eventIdentifier>
    <premis:eventType>ingestion</premis:eventType>
    <premis:eventDateTime>2024-01-01T00:00:00Z</premis:eventDateTime>
  </premis:event>
</premis:premis>
```

## Использование в архивации

### Документирование архивации

PREMIS можно использовать для документирования процесса архивации:

*   **Event**: Событие архивации (когда, как)
*   **Agent**: Инструмент архивации (Browsertrix, Heritrix)
*   **Object**: Заархивированные файлы (WARC файлы)
*   **Rights**: Права доступа к архиву

### Пример для веб-архивации

```xml
<premis:event>
  <premis:eventType>capture</premis:eventType>
  <premis:eventDateTime>2024-01-01T12:00:00Z</premis:eventDateTime>
  <premis:eventDetail>Web archiving using Browsertrix</premis:eventDetail>
  <premis:linkingAgentIdentifier>
    <premis:linkingAgentIdentifierType>software</premis:linkingAgentIdentifierType>
    <premis:linkingAgentIdentifierValue>Browsertrix 1.0</premis:linkingAgentIdentifierValue>
  </premis:linkingAgentIdentifier>
</premis:event>
```

## Интеграция с другими стандартами

### METS

PREMIS часто используется вместе с METS: METS описывает структуру коллекции, а PREMIS встраивается в секцию `mets:amdSec`. Например, `digiprovMD` содержит информацию о происхождении, `rightsMD` — о правах.

```xml
<mets:amdSec>
  <mets:digiprovMD ID="DP1">
    <mets:mdWrap MDTYPE="PREMIS">
      <mets:xmlData>
        <premis:event>...</premis:event>
      </mets:xmlData>
    </mets:mdWrap>
  </mets:digiprovMD>
  <mets:rightsMD ID="RT1">
    <mets:mdWrap MDTYPE="PREMIS">
      <mets:xmlData>
        <premis:rightsStatement>...</premis:rightsStatement>
      </mets:xmlData>
    </mets:mdWrap>
  </mets:rightsMD>
</mets:amdSec>
```

### BagIt

PREMIS метаданные могут быть включены в BagIt:

```
my-bag/
├── data/
│   └── archive.warc
└── premis.xml
```

## Рекомендации

### Документирование событий

*   Записывайте все важные события
*   Включайте временные метки (UTC)
*   Документируйте агентов (инструменты, люди)

### Метаданные объектов

*   Записывайте идентификаторы объектов (UUID или ARK)
*   Включайте информацию о форматах (PUID из PRONOM)
*   Документируйте контрольные суммы (SHA-256)

### Права доступа

*   Документируйте права на архивы (категория + basis)
*   Включайте информацию о лицензиях
*   Записывайте ограничения доступа

## Ресурсы

*   [PREMIS Data Dictionary](https://www.loc.gov/standards/premis/)
*   [PREMIS спецификация v3.0](https://www.loc.gov/standards/premis/v3/premis-3-0-final.pdf)
*   [PREMIS примеры](https://www.loc.gov/standards/premis/examples.html)

## Связанные материалы

- [Метаданные METS](/kb/instruments/file-formats/mets)
- [BagIt для упаковки](/kb/instruments/file-formats/bagit)
- [Кастомные workflow для архивации](/kb/guides/custom-workflows)
