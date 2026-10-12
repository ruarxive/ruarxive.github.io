---
title: METS
description: "METS — XML-стандарт для описания структуры цифрового объекта и связи файлов с метаданными: секции документа, валидный пример для веб-архива, METS 1.12.1 и METS 2."
last_update:
  date: 2026-10-12
---

# METS

**METS (Metadata Encoding & Transmission Standard)** — это стандарт кодирования и передачи метаданных, разработанный для структурирования метаданных цифровых объектов. Поддерживается редакционным советом METS совместно с Библиотекой Конгресса США.

## Описание

METS предоставляет XML схему для структурирования метаданных, связывания файлов с метаданными и описания структуры цифровых объектов.

### Версии

- **METS 1** — версия, используемая большинством систем; последняя редакция схемы — **1.12.1** (октябрь 2019 года). Пространство имён: `http://www.loc.gov/METS/`.
- **METS 2** — новая, обратно несовместимая версия: упрощённая схема без зависимости от XLink, секции `dmdSec` и `amdSec` объединены в `mdSec`, удалены `structLink` и `behaviorSec`. Пространство имён: `http://www.loc.gov/METS/v2`. Подробнее — [METS 2 на сайте LoC](https://www.loc.gov/standards/mets/mets2.html) и [mets.github.io](https://mets.github.io/).

METS 1 продолжает поддерживаться; примеры ниже относятся к METS 1.

### Особенности

*   **Структурирование**: Структурирует метаданные в единый документ
*   **Связывание**: Связывает файлы с их метаданными
*   **Гибкость**: Можно адаптировать под различные системы
*   **XML формат**: Стандартный XML формат

## Структура METS

### Основные секции

METS-документ (версии 1) состоит из семи секций. По схеме обязательна только `structMap`, остальные необязательны:

1. **metsHdr** — заголовок документа: агенты-создатели, даты, статус (необязательная).
2. **dmdSec** — описательные метаданные: Dublin Core, MODS, собственный XML.
3. **amdSec** — административные метаданные. Внутри четыре подсекции:
   - `techMD` — технические метаданные (формат, характеристики файлов);
   - `rightsMD` — правовая информация (лицензии, ограничения);
   - `sourceMD` — метаданные исходных (аналоговых или оцифрованных) объектов;
   - `digiprovMD` — метаданные происхождения (например, PREMIS-события).
4. **fileSec** — секция файлов: все файлы с идентификаторами, расположением и контрольными суммами.
5. **structMap** — структурная карта: иерархия, описывающая логическую и физическую структуру объекта (**обязательная**).
6. **structLink** — связи между узлами структурной карты (необязательная).
7. **behaviorSec** — поведение объекта: привязка исполняемого кода (необязательная).

### Пример документа

Пример проходит валидацию `xmllint --schema mets.xsd` по схеме METS 1.12.1:

```xml
<mets:mets xmlns:mets="http://www.loc.gov/METS/"
           xmlns:xlink="http://www.w3.org/1999/xlink"
           xmlns:dc="http://purl.org/dc/elements/1.1/"
           xmlns:premis="http://www.loc.gov/premis/v3">
  <mets:metsHdr CREATEDATE="2024-01-01T12:00:00Z">
    <mets:agent ROLE="CREATOR" TYPE="ORGANIZATION">
      <mets:name>Ruarxive</mets:name>
    </mets:agent>
  </mets:metsHdr>
  <mets:dmdSec ID="DMD1">
    <mets:mdWrap MDTYPE="DC">
      <mets:xmlData>
        <dc:title>Web Archive Collection</dc:title>
        <dc:creator>Ruarxive</dc:creator>
        <dc:date>2024-01-01</dc:date>
      </mets:xmlData>
    </mets:mdWrap>
  </mets:dmdSec>
  <mets:amdSec ID="AMD1">
    <mets:digiprovMD ID="DP1">
      <mets:mdWrap MDTYPE="PREMIS:EVENT">
        <mets:xmlData>
          <premis:event>...</premis:event>
        </mets:xmlData>
      </mets:mdWrap>
    </mets:digiprovMD>
  </mets:amdSec>
  <mets:fileSec>
    <mets:fileGrp USE="archive">
      <mets:file ID="WARC1" MIMETYPE="application/warc" ADMID="DP1"
                 CHECKSUM="e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
                 CHECKSUMTYPE="SHA-256">
        <mets:FLocat LOCTYPE="URL" xlink:href="archive.warc.gz"/>
      </mets:file>
    </mets:fileGrp>
  </mets:fileSec>
  <mets:structMap TYPE="LOGICAL" LABEL="Site hierarchy">
    <mets:div LABEL="Главная" TYPE="section" DMDID="DMD1">
      <mets:div LABEL="Новости" TYPE="subsection">
        <mets:fptr FILEID="WARC1"/>
      </mets:div>
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

### Контрольные суммы файлов

Контрольная сумма задаётся **атрибутами** элемента `mets:file` — `CHECKSUM` и `CHECKSUMTYPE` (допустимые значения включают `MD5`, `SHA-1`, `SHA-256`, `SHA-512`). Отдельного элемента `checksum` в METS нет.

```xml
<mets:file ID="WARC1" MIMETYPE="application/warc"
           CHECKSUM="e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
           CHECKSUMTYPE="SHA-256">
  <mets:FLocat LOCTYPE="URL" xlink:href="archive.warc.gz"/>
</mets:file>
```

### Структурные карты (structMap)

METS поддерживает несколько структурных карт с разной семантикой. Атрибут `TYPE` указывает назначение:

- `LOGICAL` — интеллектуальная структура объекта (разделы, главы, страницы). Для веб-архива — иерархия сайта.
- `PHYSICAL` — физическая структура (порядок и группировка файлов на диске).

Для сложных объектов принято включать обе карты; в METS 1 связи между их узлами можно описать через `<mets:structLink>`.

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
*   PREMIS предоставляет метаданные сохранения в `amdSec` (обычно в подсекциях `techMD`, `digiprovMD` и `rightsMD`); для `MDTYPE` предусмотрены значения `PREMIS`, `PREMIS:OBJECT`, `PREMIS:AGENT`, `PREMIS:RIGHTS`, `PREMIS:EVENT`

### Dublin Core

METS может включать Dublin Core метаданные в dmdSec:

```xml
<mets:dmdSec ID="DMD1">
  <mets:mdWrap MDTYPE="DC">
    <mets:xmlData>
      <dc:title>Web Archive</dc:title>
      <dc:creator>Ruarxive</dc:creator>
    </mets:xmlData>
  </mets:mdWrap>
</mets:dmdSec>
```

## Профили и валидация

**METS Profile** — формальное ограничение METS под нужды сообщества: фиксирует, какие секции обязательны, какие схемы метаданных разрешены, какие ограничения на структуру. Профили публикуются как XML-документы; реестр профилей METS 1 ведётся на [сайте METS](https://www.loc.gov/standards/mets/).

Для веб-архивов практический интерес представляют:

- [PREMIS in METS](https://www.loc.gov/standards/premis/premis-mets.html) — как встраивать PREMIS в `amdSec` (там же — ссылки на руководство и инструменты).

### Валидация

Базовая проверка — XML Schema-валидация по `mets.xsd`, например утилитой `xmllint`:

```bash
# xmllint не загружает схемы по HTTPS, поэтому сначала скачиваем схему
curl -sO https://www.loc.gov/standards/mets/mets.xsd
xmllint --noout --schema mets.xsd mets.xml
```

Схема METS 1 импортирует схему XLink по адресу `http://www.loc.gov/standards/xlink/xlink.xsd`, поэтому при проверке нужен доступ к сети (или локальная копия этой схемы). Соответствие профилю проверяется отдельно — средствами конкретного репозитория.

## Рекомендации

### Структурирование

*   Используйте логическую структуру (`structMap TYPE="LOGICAL"`) — она ближе к интеллектуальному объекту
*   Группируйте связанные файлы в `<mets:fileGrp USE="...">`
*   Учитывайте, что `structLink` и `behaviorSec` удалены в METS 2

### Метаданные

*   Включайте полные описательные метаданные (`dmdSec`)
*   Используйте стандартные схемы (Dublin Core, MODS, PREMIS)
*   Документируйте административные метаданные (`amdSec`)
*   Для контрольных сумм используйте **SHA-256**, не MD5

### Валидация

*   Валидируйте METS-документы через `xmllint` по `mets.xsd`
*   Проверяйте ссылки на файлы (`fileSec` ↔ `structMap`)
*   Убедитесь в корректности структуры (нет битых ссылок на ID)

## Ресурсы

*   [METS — официальный сайт](https://www.loc.gov/standards/mets/)
*   [METS схема 1.12.1 (XSD)](https://www.loc.gov/standards/mets/mets.xsd)
*   [Репозиторий схем METS 1 и METS 2](https://github.com/mets/METS-schema)
*   [Примеры документов METS 1](https://www.loc.gov/standards/mets/mets-examples.html)
*   [METS 2](https://www.loc.gov/standards/mets/mets2.html)
*   [PREMIS в METS](https://www.loc.gov/standards/premis/premis-mets.html)

## Связанные материалы

- [Метаданные PREMIS](/kb/instruments/file-formats/premis)
- [BagIt для упаковки](/kb/instruments/file-formats/bagit)
- [Кастомные workflow для архивации](/kb/guides/custom-workflows)
