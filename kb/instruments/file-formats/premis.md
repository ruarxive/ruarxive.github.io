# PREMIS (Preservation Metadata)

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

1. **Intellectual Entity**: Интеллектуальный объект (например, веб-сайт)
2. **Object**: Цифровой объект (файл, битстрим)
3. **Event**: Событие (действие, выполненное над объектом)
4. **Agent**: Агент (человек, организация, программное обеспечение)
5. **Rights**: Права (информация о правах доступа)

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

PREMIS часто используется вместе с METS для структурирования метаданных:

*   METS предоставляет структуру
*   PREMIS предоставляет метаданные сохранения

### BagIt

PREMIS метаданные могут быть включены в BagIt:

```
my-bag/
├── data/
│   └── archive.warc
└── premis.xml
```

## Best practices

### Документирование событий

*   Записывайте все важные события
*   Включайте временные метки
*   Документируйте агентов (инструменты, люди)

### Метаданные объектов

*   Записывайте идентификаторы объектов
*   Включайте информацию о форматах
*   Документируйте контрольные суммы

### Права доступа

*   Документируйте права на архивы
*   Включайте информацию о лицензиях
*   Записывайте ограничения доступа

## Ресурсы

*   [PREMIS Data Dictionary](https://www.loc.gov/standards/premis/)
*   [PREMIS спецификация](https://www.loc.gov/standards/premis/v3/premis-3-0-final.pdf)
*   [PREMIS примеры](https://www.loc.gov/standards/premis/examples.html)

## Связанные материалы

- [Метаданные METS](/kb/instruments/file-formats/mets)
- [BagIt для упаковки](/kb/instruments/file-formats/bagit)
- [Создание метаданных](/kb/guides/custom-workflows)
