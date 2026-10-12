---
title: PREMIS
description: "PREMIS 3.0 — словарь метаданных цифрового сохранения: сущности Object, Event, Agent, Rights, связи между ними и валидный XML-пример для веб-архива."
last_update:
  date: 2026-10-12
---

# PREMIS

**PREMIS (Preservation Metadata Implementation Strategies)** — это стандарт метаданных для цифрового сохранения, разработанный для документирования информации, необходимой для долгосрочного сохранения цифровых объектов. Стандарт поддерживается Библиотекой Конгресса США; актуальная версия словаря данных — **PREMIS 3.0** (2015), XML-схема — `premis.xsd` версии 3.0.

## Описание

PREMIS определяет набор основных метаданных, которые репозитории должны записывать для обеспечения долгосрочного сохранения цифровых объектов.

### Особенности

*   **Стандартизация**: Международный стандарт метаданных
*   **Сохранение**: Фокус на метаданных для сохранения
*   **Гибкость**: Можно адаптировать под различные системы
*   **XML формат**: Официальная XML-схема; словари значений публикуются на [id.loc.gov](https://id.loc.gov/vocabulary/preservation.html)

## Структура PREMIS

### Основные сущности

В PREMIS 3.0 четыре сущности:

1. **Object** — объект сохранения. Бывает четырёх категорий:
   - `intellectualEntity` — интеллектуальная единица (сайт, книга, фильм);
   - `representation` — набор файлов, необходимый для полного представления интеллектуальной единицы;
   - `file` — файл;
   - `bitstream` — поток данных внутри файла.
2. **Event** — событие, выполненное над объектом (захват, миграция, проверка целостности).
3. **Agent** — человек, организация или программное обеспечение, связанное с событием или правами.
4. **Rights** — права на объект (лицензии, авторское право, нормы закона, ограничения).

В модели данных PREMIS 2.x интеллектуальная единица была отдельной (пятой) сущностью без собственных полей в словаре; в версии 3.0 она стала категорией Object. В XML категория задаётся атрибутом `xsi:type`, например `xsi:type="premis:file"`.

### Intellectual Entity и файлы

Различие между ними принципиально для веб-архивов:

- **Intellectual Entity** = то, что мы понимаем как «единицу» архива (сайт госоргана, профиль в соцсети, выпуск новостей).
- **File / Representation** = то, что физически лежит на диске (WARC-файл, набор скриншотов, исходный JSON).

Структурные связи между объектами задаются элементом `relationship` (`relationshipType` = `structural`, `relatedObjectIdentifier`) либо ссылкой `linkingIntellectualEntityIdentifier`. События и агенты связываются с объектами через `linkingObjectIdentifier` и `linkingAgentIdentifier`.

### Rights (права доступа)

Сущность Rights описывает правовой режим объекта. Основание прав (`rightsBasis`) обычно принимает одно из значений, для каждого из которых есть свой блок сведений:

- **copyright** — авторские права на объект (`copyrightInformation`);
- **license** — лицензия, например Creative Commons (`licenseInformation`);
- **statute** — норма закона, например закон об архивном деле (`statuteInformation`);
- **other** — иные основания: договор с правообладателем, внутренняя политика (`otherRightsInformation`).

Пример (внутри обязательной обёртки `premis:rights`):

```xml
<premis:rights>
  <premis:rightsStatement>
    <premis:rightsStatementIdentifier>
      <premis:rightsStatementIdentifierType>UUID</premis:rightsStatementIdentifierType>
      <premis:rightsStatementIdentifierValue>9b2f6c1e-3d4a-4b5c-8d7e-6f5a4b3c2d1e</premis:rightsStatementIdentifierValue>
    </premis:rightsStatementIdentifier>
    <premis:rightsBasis>license</premis:rightsBasis>
    <premis:licenseInformation>
      <premis:licenseNote>CC BY 4.0</premis:licenseNote>
    </premis:licenseInformation>
    <premis:rightsGranted>
      <premis:act>replicate</premis:act>
    </premis:rightsGranted>
    <premis:linkingObjectIdentifier>
      <premis:linkingObjectIdentifierType>UUID</premis:linkingObjectIdentifierType>
      <premis:linkingObjectIdentifierValue>123e4567-e89b-12d3-a456-426614174000</premis:linkingObjectIdentifierValue>
    </premis:linkingObjectIdentifier>
  </premis:rightsStatement>
</premis:rights>
```

### Пример документа для веб-архива

Документ описывает интеллектуальную единицу (сайт), WARC-файл с контрольной суммой и PUID, событие захвата, агента-программу и лицензию. Пример проходит валидацию `xmllint --schema premis.xsd` по схеме PREMIS 3.0.

```xml
<premis:premis xmlns:premis="http://www.loc.gov/premis/v3"
               xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
               version="3.0">
  <premis:object xsi:type="premis:intellectualEntity">
    <premis:objectIdentifier>
      <premis:objectIdentifierType>local</premis:objectIdentifierType>
      <premis:objectIdentifierValue>site-example-gov-2024</premis:objectIdentifierValue>
    </premis:objectIdentifier>
  </premis:object>
  <premis:object xsi:type="premis:file">
    <premis:objectIdentifier>
      <premis:objectIdentifierType>UUID</premis:objectIdentifierType>
      <premis:objectIdentifierValue>123e4567-e89b-12d3-a456-426614174000</premis:objectIdentifierValue>
    </premis:objectIdentifier>
    <premis:preservationLevel>
      <premis:preservationLevelValue>full</premis:preservationLevelValue>
    </premis:preservationLevel>
    <premis:objectCharacteristics>
      <premis:fixity>
        <premis:messageDigestAlgorithm>SHA-256</premis:messageDigestAlgorithm>
        <premis:messageDigest>e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855</premis:messageDigest>
      </premis:fixity>
      <premis:size>104857600</premis:size>
      <premis:format>
        <premis:formatRegistry>
          <premis:formatRegistryName>PRONOM</premis:formatRegistryName>
          <premis:formatRegistryKey>fmt/1281</premis:formatRegistryKey>
        </premis:formatRegistry>
      </premis:format>
    </premis:objectCharacteristics>
    <premis:originalName>archive.warc.gz</premis:originalName>
    <premis:relationship>
      <premis:relationshipType>structural</premis:relationshipType>
      <premis:relationshipSubType>is Included In</premis:relationshipSubType>
      <premis:relatedObjectIdentifier>
        <premis:relatedObjectIdentifierType>local</premis:relatedObjectIdentifierType>
        <premis:relatedObjectIdentifierValue>site-example-gov-2024</premis:relatedObjectIdentifierValue>
      </premis:relatedObjectIdentifier>
    </premis:relationship>
  </premis:object>
  <premis:event>
    <premis:eventIdentifier>
      <premis:eventIdentifierType>UUID</premis:eventIdentifierType>
      <premis:eventIdentifierValue>7d0c2b4e-1f3a-4c5d-9e8f-0a1b2c3d4e5f</premis:eventIdentifierValue>
    </premis:eventIdentifier>
    <premis:eventType>capture</premis:eventType>
    <premis:eventDateTime>2024-01-01T12:00:00Z</premis:eventDateTime>
    <premis:eventDetailInformation>
      <premis:eventDetail>Web archiving using Browsertrix Crawler</premis:eventDetail>
    </premis:eventDetailInformation>
    <premis:linkingAgentIdentifier>
      <premis:linkingAgentIdentifierType>local</premis:linkingAgentIdentifierType>
      <premis:linkingAgentIdentifierValue>browsertrix-crawler-1.x</premis:linkingAgentIdentifierValue>
      <premis:linkingAgentRole>executing program</premis:linkingAgentRole>
    </premis:linkingAgentIdentifier>
    <premis:linkingObjectIdentifier>
      <premis:linkingObjectIdentifierType>UUID</premis:linkingObjectIdentifierType>
      <premis:linkingObjectIdentifierValue>123e4567-e89b-12d3-a456-426614174000</premis:linkingObjectIdentifierValue>
    </premis:linkingObjectIdentifier>
  </premis:event>
  <premis:agent>
    <premis:agentIdentifier>
      <premis:agentIdentifierType>local</premis:agentIdentifierType>
      <premis:agentIdentifierValue>browsertrix-crawler-1.x</premis:agentIdentifierValue>
    </premis:agentIdentifier>
    <premis:agentName>Browsertrix Crawler</premis:agentName>
    <premis:agentType>software</premis:agentType>
  </premis:agent>
</premis:premis>
```

Обратите внимание: тип идентификатора агента (`linkingAgentIdentifierType`, здесь `local`) и роль агента в событии (`linkingAgentRole`) — разные поля; то, что агент — программа, указывается в описании самого агента (`agentType` = `software`).

## Использование в архивации

### Документирование архивации

PREMIS можно использовать для документирования процесса архивации:

*   **Event**: Событие архивации (когда, как)
*   **Agent**: Инструмент архивации (Browsertrix, Heritrix) и организация
*   **Object**: Интеллектуальная единица (сайт) и заархивированные файлы (WARC)
*   **Rights**: Права доступа к архиву

Для значений `eventType`, `agentRole`, `relationshipType` и других полей используйте контролируемые словари Библиотеки Конгресса: [id.loc.gov/vocabulary/preservation](https://id.loc.gov/vocabulary/preservation.html).

## Интеграция с другими стандартами

### METS

PREMIS часто используется вместе с METS: METS описывает структуру коллекции, а PREMIS встраивается в секцию `mets:amdSec`. Например, `digiprovMD` содержит информацию о происхождении (события, агенты), `rightsMD` — о правах. Подробные правила — в [PREMIS in METS Guidelines](https://www.loc.gov/standards/premis/premis-mets.html).

```xml
<mets:amdSec>
  <mets:digiprovMD ID="DP1">
    <mets:mdWrap MDTYPE="PREMIS:EVENT">
      <mets:xmlData>
        <premis:event>...</premis:event>
      </mets:xmlData>
    </mets:mdWrap>
  </mets:digiprovMD>
  <mets:rightsMD ID="RT1">
    <mets:mdWrap MDTYPE="PREMIS:RIGHTS">
      <mets:xmlData>
        <premis:rights>...</premis:rights>
      </mets:xmlData>
    </mets:mdWrap>
  </mets:rightsMD>
</mets:amdSec>
```

### BagIt

PREMIS-метаданные можно положить в BagIt-пакет как дополнительный tag-файл (вне `data/`) и зафиксировать его хеш в `tagmanifest-*.txt`:

```
my-bag/
├── bagit.txt
├── bag-info.txt
├── manifest-sha256.txt
├── tagmanifest-sha256.txt
├── premis.xml
└── data/
    └── archive.warc.gz
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

*   Документируйте права на архивы (основание + сведения о нём)
*   Включайте информацию о лицензиях
*   Записывайте ограничения доступа

### Проверка

*   Валидируйте документы по схеме:

```bash
curl -sO https://www.loc.gov/standards/premis/v3/premis.xsd
xmllint --noout --schema premis.xsd premis.xml
```

## Ресурсы

*   [PREMIS Data Dictionary](https://www.loc.gov/standards/premis/)
*   [PREMIS 3.0](https://www.loc.gov/standards/premis/v3/) — словарь данных и схема
*   [PREMIS спецификация v3.0 (PDF)](https://www.loc.gov/standards/premis/v3/premis-3-0-final.pdf)
*   [PREMIS примеры](https://www.loc.gov/standards/premis/examples.html)
*   [PREMIS in METS](https://www.loc.gov/standards/premis/premis-mets.html)
*   [Словари id.loc.gov](https://id.loc.gov/vocabulary/preservation.html)

## Связанные материалы

- [Метаданные METS](/kb/instruments/file-formats/mets)
- [BagIt для упаковки](/kb/instruments/file-formats/bagit)
- [Кастомные workflow для архивации](/kb/guides/custom-workflows)
