---
title: IIIF
description: "IIIF — набор открытых API для доставки и описания цифровых изображений: Image API 3.0, Presentation API 3.0, серверы изображений и просмотрщики."
last_update:
  date: 2026-10-12
---

# IIIF

**IIIF (International Image Interoperability Framework)** — набор открытых API для доставки и описания цифровых изображений в библиотеках, архивах и музеях. Не самостоятельный формат файла, а стандарт взаимодействия между хранилищами изображений и просмотрщиками.

## Зачем нужен IIIF

Архив отсканировал рукописи или книги и хранит сканы в формате JP2 или TIFF. Как доставить их пользователю:

*   Не скачивать многогигабайтный файл целиком.
*   Отдавать только нужный регион или тайл.
*   Поддерживать аннотации и OCR.
*   Давать единый API для разных коллекций.

IIIF решает все эти задачи. Файлы изображений остаются в любом формате (JP2, TIFF, PNG, WebP), а IIIF-сервер предоставляет стандартизированный HTTP-API.

## Составные части IIIF

Актуальные стабильные спецификации (по [iiif.io/api](https://iiif.io/api/)):

| Спецификация | Назначение |
| :--- | :--- |
| **Image API 3.0** | Запрос тайлов, регионов, размеров, поворотов через URL |
| **Presentation API 3.0** | Манифесты объектов и коллекций, навигация, метаданные |
| **Authorization Flow API 2.0** | Доступ к закрытым ресурсам через существующую систему авторизации (заменил Authentication API 1.0) |
| **Content Search API 2.0** | Поиск по текстовым аннотациям (например, OCR) внутри объекта |
| **Change Discovery API 1.0** | Обнаружение новых и изменённых ресурсов |
| **Content State API 1.0** | Компактная ссылка на ресурс или его часть для открытия в любом просмотрщике |

Presentation API 4.0 на октябрь 2026 года находится в статусе кандидата в релиз.

## Image API

URL-паттерн для запроса изображения:

```
{scheme}://{server}/{prefix}/{identifier}/{region}/{size}/{rotation}/{quality}.{format}
```

Пример — получить фрагмент 1024×1024 пикселя, левый верхний угол которого находится в точке (256, 256), в максимальном доступном размере:

```
https://iiif.example.org/iiif/abc123/256,256,1024,1024/max/0/default.jpg
```

Разберём по частям:

| Компонент | Значение | Пример |
| :--- | :--- | :--- |
| `region` | область изображения: всё, квадрат или прямоугольник `x,y,w,h` (в пикселях или `pct:` в процентах) | `full`, `square`, `256,256,1024,1024` |
| `size` | размер результата | `max`, `1024,` (по ширине), `,1024` (по высоте), `pct:50` |
| `rotation` | поворот по часовой стрелке от 0 до 360 градусов; `!` в начале — зеркальное отражение | `0`, `90`, `!180` |
| `quality` | режим цвета | `default`, `color`, `gray`, `bitonal` |
| `format` | выходной формат | `jpg`, `png`, `gif`, `webp` |

В Image API 3.0 значение размера `full` из версии 2.x заменено на `max`.

`info.json` — главная точка входа для каждого изображения:

```json
{
  "@context": "http://iiif.io/api/image/3/context.json",
  "id": "https://iiif.example.org/iiif/abc123",
  "type": "ImageService3",
  "protocol": "http://iiif.io/api/image",
  "profile": "level2",
  "width": 6000,
  "height": 8000
}
```

## Presentation API

Манифест — это JSON-документ, описывающий логическую структуру объекта (книги, периодического издания, архивного дела):

```json
{
  "@context": "http://iiif.io/api/presentation/3/context.json",
  "id": "https://iiif.example.org/archive-123/manifest.json",
  "type": "Manifest",
  "label": { "ru": ["Архивное дело №123"] },
  "metadata": [
    {
      "label": { "ru": ["Фонд"] },
      "value": { "ru": ["Фонд 1, опись 1"] }
    }
  ],
  "items": [
    {
      "id": "https://iiif.example.org/archive-123/canvas/1",
      "type": "Canvas",
      "width": 4000,
      "height": 5000,
      "label": { "ru": ["Лист 1"] },
      "items": [
        {
          "id": "https://iiif.example.org/archive-123/page/1",
          "type": "AnnotationPage",
          "items": [
            {
              "id": "https://iiif.example.org/archive-123/annotation/1",
              "type": "Annotation",
              "motivation": "painting",
              "target": "https://iiif.example.org/archive-123/canvas/1",
              "body": {
                "id": "https://iiif.example.org/archive-123/canvas/1/image.jpg",
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

*   **Manifest** — книга, дело, отдельный объект.
*   **Collection** — набор манифестов (например, все выпуски газеты за год).
*   **Canvas** — одна страница или лист.
*   **Annotation** — связь между канвасом и изображением (или OCR, или комментарием).

## Серверы изображений

*   **[Cantaloupe](https://cantaloupe-project.github.io/)** — Java-сервер, активно развивается, поддерживает Image API 3.0.
*   **[IIPImage (iipsrv)](https://iipimage.sourceforge.io/)** — C++-сервер, очень производительный, работает с большими TIFF/JP2.
*   **[digilib](https://github.com/robcast/digilib)** — Java-сервер и просмотрщик изображений, исходно разработанный в Институте истории науки Общества Макса Планка.
*   **[Loris](https://github.com/loris-imageserver/loris)** — Python-сервер, реализует Image API **2.0**; проект не развивается (последние изменения — сентябрь 2023 года).

## Просмотрщики

*   **[Mirador](https://projectmirador.org/)** — JavaScript-просмотрщик, поддерживает несколько манифестов рядом (для сравнительного анализа рукописей).
*   **[Universal Viewer](https://github.com/UniversalViewer/universalviewer)** — удобен для книг.
*   **[OpenSeadragon](https://openseadragon.github.io/)** — низкоуровневый deep-zoom клиент; можно использовать как основу для собственного интерфейса.

## Пример подключения Mirador

`Mirador.viewer` требует указать `id` HTML-элемента, в котором будет создан просмотрщик:

```html
<div id="mirador"></div>
<script>
  const mirador = Mirador.viewer({
    id: "mirador",
    windows: [{
      manifestId: "https://iiif.example.org/archive-123/manifest.json"
    }]
  });
</script>
```

## Сценарии использования

*   **Рукописные и архивные фонды** — пользователи могут читать сканы без скачивания многогигабайтных оригиналов, переходить между листами дела, делать аннотации.
*   **Подшивки газет и журналов** — единый интерфейс для разных выпусков и годов.
*   **Музейные коллекции** — сравнительный анализ нескольких экспонатов в Mirador.
*   **Картографические материалы** — глубокий zoom для детального изучения.

## Рекомендации

*   Используйте **Image API 3.0** и **Presentation API 3.0** — актуальные стабильные версии.
*   Для хранения исходников выбирайте **JP2** (см. [JP2](/kb/instruments/file-formats/jp2)) или TIFF.
*   Всегда публикуйте `info.json` для каждого изображения и проверяйте его доступность.
*   Сохраняйте манифесты вместе с архивным пакетом; в METS их можно описать в административных метаданных (`digiprovMD`), а события их создания — в PREMIS.
*   Используйте **Cantaloupe** или **IIPImage** для продакшн-серверов с нагрузкой.
*   Добавляйте в манифесты **локализованные метки** (`label.ru`, `label.en`), чтобы ресурс был доступен на нескольких языках.

## Ресурсы

*   [IIIF Specifications](https://iiif.io/api/)
*   [Image API 3.0](https://iiif.io/api/image/3.0/)
*   [Awesome IIIF](https://github.com/IIIF/awesome-iiif) — каталог инструментов
*   [Mirador](https://projectmirador.org/)
*   [Cantaloupe Image Server](https://cantaloupe-project.github.io/)

## Связанные материалы

*   [JP2 (JPEG 2000)](/kb/instruments/file-formats/jp2)
*   [Метаданные PREMIS](/kb/instruments/file-formats/premis)
*   [Метаданные METS](/kb/instruments/file-formats/mets)
*   [Реестры форматов файлов](/kb/instruments/file-formats/format-registries)
