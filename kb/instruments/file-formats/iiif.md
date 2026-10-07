# IIIF

**IIIF (International Image Interoperability Framework)** — набор открытых API для доставки и описания цифровых изображений в библиотеках, архивах и музеях. Не самостоятельный формат файла, а стандарт взаимодействия между хранилищами изображений и просмотрщиками.

## Зачем нужен IIIF

Архив отчекан сканы рукописей или книг в формате JP2 или TIFF. Как доставить их пользователю:

*   Не скачивать ГБайт-файл целиком.
*   Отдавать только нужный регион или тайл.
*   Поддерживать аннотации и OCR.
*   Давать единый API для разных коллекций.

IIIF решает все эти задачи. Файлы изображений остаются в любом формате (JP2, TIFF, PNG, WebP), а IIIF-сервер предоставляет стандартизированный HTTP-API.

## Составные части IIIF

| Спецификация | Назначение |
| :--- | :--- |
| **Image API 3.0** | Запрос тайлов, регионов, размеров, вращений через URL |
| **Presentation API 3.0** | Манифесты коллекций, навигация, метаданные |
| **Authentication API** | Доступ к закрытым коллекциям |
| **Content Search API** | Поиск по OCR-тексту на канвасах |
| **Change Discovery API** | Уведомления об изменениях |

## Image API

URL-паттерн для запроса изображения:

```
{scheme}://{server}/{prefix}/{identifier}/{region}/{size}/{rotation}/{quality}.{format}
```

Пример — получить центральный фрагмент размером 1024×1024 из скана с IIIF-сервера Bodleian Library:

```
https://iiif.bodleian.ox.ac.uk/iiif/image/abc123/{256,256,1024,1024}/full/0/default.jpg
```

Разберём по частям:

| Компонент | Значение | Пример |
| :--- | :--- | :--- |
| `region` | координаты прямоугольника | `full`, `256,256,1024,1024` |
| `size` | размер изображения | `full`, `1024,` (по ширине), `,1024` (по высоте) |
| `rotation` | поворот в градусах | `0`, `90`, `180`, `270` |
| `quality` | режим изображения | `default`, `color`, `gray`, `bitonal` |
| `format` | выходной формат | `jpg`, `png`, `gif`, `webp` |

`info.json` — главная точка входа:

```json
{
  "@context": "http://iiif.io/api/image/3/context.json",
  "id": "https://iiif.example.org/iiif/abc123",
  "type": "ImageService3",
  "profile": "level2",
  "width": 6000,
  "height": 8000,
  "protocol": "http://iiif.io/api/image"
}
```

## Presentation API

Манифест — это JSON-документ, описывающий логическую структуру объекта (книги, периодического издания, архивного дела):

```json
{
  "@context": "https://iiif.io/api/presentation/3/context.json",
  "id": "https://ruarxive.org/iiif/archive-123/manifest.json",
  "type": "Manifest",
  "label": { "ru": ["Архивное дело №123"] },
  "metadata": [
    {
      "label": { "ru": ["Фонд"] },
      "value": { "ru": ["Государственный архив Российской Федерации"] }
    }
  ],
  "items": [
    {
      "id": "https://ruarxive.org/iiif/archive-123/canvas/1",
      "type": "Canvas",
      "width": 4000,
      "height": 5000,
      "label": { "ru": ["Лист 1, recto"] },
      "items": [
        {
          "id": "https://ruarxive.org/iiif/archive-123/page/1",
          "type": "AnnotationPage",
          "items": [
            {
              "id": "https://ruarxive.org/iiif/archive-123/annotation/1",
              "type": "Annotation",
              "motivation": "painting",
              "target": "https://ruarxive.org/iiif/archive-123/canvas/1",
              "body": {
                "id": "https://ruarxive.org/iiif/archive-123/canvas/1/image.jpg",
                "type": "Image",
                "format": "image/jpeg",
                "width": 4000,
                "height": 5000
              }
            }
          ]
        }
      ]
    }
  ]
}
```

Ключевые сущности:

*   **Manifest** — книга, дело, коллекция.
*   **Collection** — набор манифестов (например, все выпуски газеты за год).
*   **Canvas** — одна страница или лист.
*   **Annotation** — связь между канвасом и изображением (или OCR, или комментарий).

## Серверы изображений

*   **[Cantaloupe](https://cantaloupe-project.github.io/)** — Java-сервер, активно поддерживается, поддерживает Image API 3.0.
*   **[iipsrv](https://iipimage.sourceforge.io/)** — C++-сервер, очень производительный, работает с большими TIFF/JP2.
*   **[digilib](http://digilib.sourceforge.net/)** — Java, разрабатывается Max Planck.
*   **[Loris](https://github.com/loris-imageserver/loris)** — Python, IIIF Image API 3.0.

## Просмотрщики

*   **[Mirador](https://projectmirador.org/)** — JavaScript-просмотрщик, поддерживает несколько манифестов рядом (для дифференциального анализа рукописей).
*   **[Universal Viewer](https://github.com/UniversalViewer/universalviewer)** — отлично подходит для книг.
*   **[OpenSeadragon](https://openseadragon.github.io/)** — низкоуровневый deep-zoom клиент; можно использовать как основу для собственного интерфейса.

## Пример интеграции в Ruarxive

```javascript
// Подключение манифеста через Mirador
const config = {
  windows: [{
      manifestId: "https://ruarxive.org/iiif/archive-123/manifest.json"
    }]
};

const mirador = Mirador.viewer(config);
```

## Сценарии использования в Ruarxive

*   **Рукописные фонды ГАРФ и РГА** — пользователи могут читать сканы без скачивания ТБайт-оригиналов, навигировать между листами дела, делать свои аннотации.
*   **Подшивки газет и журналов** — единый интерфейс для разных выпусков и годов.
*   **Музейные коллекции** — интеграция с Mirador для сравнительного анализа нескольких экспонатов.
*   **Картографические материалы** — глубокий zoom для детального изучения.

## Рекомендации

*   Используйте **Image API 3.0** и **Presentation API 3.0** — современные версии.
*   Для хранения исходников выбирайте **JP2** (см. [JP2](/kb/instruments/file-formats/jp2)) или TIFF.
*   Всегда публикуйте `info.json` для каждого изображения и проверяйте его доступность.
*   Манифесты включайте в **PREMIS**-описание архива как `digiprovMD`-событие.
*   Используйте **Cantaloupe** или **iipsrv** для продакшн-серверов с нагрузкой.
*   Добавляйте в манифесты **локализованные метки** (`label.ru`, `label.en`), чтобы ресурс был доступен на нескольких языках.

## Ресурсы

*   [IIIF Specifications](https://iiif.io/api/)
*   [Awesome IIIF](https://github.com/IIIF/awesome-iiif) — каталог инструментов
*   [Mirador](https://projectmirador.org/)
*   [Cantaloupe Image Server](https://cantaloupe-project.github.io/)

## Связанные материалы

*   [JP2 (JPEG 2000)](/kb/instruments/file-formats/jp2)
*   [Метаданные PREMIS](/kb/instruments/file-formats/premis)
*   [Реестры форматов файлов](/kb/instruments/file-formats/format-registries)