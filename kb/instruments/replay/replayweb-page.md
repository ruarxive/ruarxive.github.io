---
title: ReplayWeb.page — браузерный плеер WARC/WACZ
sidebar_label: ReplayWeb.page
description: "ReplayWeb.page — клиентский плеер WARC и WACZ от Webrecorder. Работает в браузере без сервера, читает WACZ по частям, встраивается на сайт через веб-компонент."
last_update:
  date: 2026-10-12
keywords: [replayweb.page, warc, wacz, replay, browser, client-side]
---

# ReplayWeb.page

[ReplayWeb.page](https://replayweb.page/) — клиентский движок воспроизведения веб-архивов от [Webrecorder](https://webrecorder.net/). Архив обрабатывается в браузере пользователя: локальный файл никуда не загружается. Поэтому ReplayWeb.page — основной инструмент для **разовых просмотров, проверки архивов и публикации WACZ без собственного replay-сервера**.

> **Принципиальное отличие от pywb:** ReplayWeb.page не требует сервера. Открыли файл — увидели содержимое. Для публикации достаточно положить WACZ на обычный веб-сервер или в объектное хранилище.

## Зачем нужен архивисту

- **Проверка качества архива** сразу после создания: видно ошибки 404, битые картинки, проблемы со шрифтами.
- **Локальный просмотр на офлайн-машине**: десктоп-приложение и PWA работают без интернета.
- **Работа с конфиденциальными архивами**: локальный файл обрабатывается в браузере и не покидает компьютер.
- **Демонстрация коллекции** журналистам и историкам без технической подготовки.
- **Публикация**: WACZ на статическом хостинге + ссылка на ReplayWeb.page или встроенный плеер на своём сайте.

## Когда использовать

✅ Подходит:

- Просмотр WACZ/WARC без настройки сервера.
- Офлайн-работа (экспедиции, командировки, изолированные машины).
- Проверка качества при создании архива.
- Демонстрация архива нетехнической аудитории.
- Встраивание архивных страниц в статьи и сайты.

❌ Не подходит:

- Программный доступ по CDX API или Memento — нужен [pywb](/kb/instruments/replay/pywb).
- Архивы в формате ARC — не поддерживаются (только WARC, WACZ, HAR, CDX/CDXJ).
- Запись (capture) — ReplayWeb.page только показывает; для сбора используйте ArchiveWeb.page, [Browsertrix](/kb/instruments/tools/browsertrix) или [wget](/kb/instruments/tools/wget).

## WARC или WACZ

По [документации](https://replayweb.page/docs/user-guide/) WARC приходится прочитать целиком при первом открытии, чтобы построить индекс. WACZ уже содержит индекс, и плеер загружает из него только нужные ресурсы — по HTTP Range-запросам, если файл лежит на сервере. Поэтому для больших архивов и для публикации нужен WACZ. Перевести WARC в WACZ можно утилитой [py-wacz](https://github.com/webrecorder/py-wacz):

```bash
pip install wacz
wacz create -o my-archive.wacz --detect-pages my-archive.warc.gz
```

## Где запустить

### 1. Веб-версия (без установки)

Откройте [replayweb.page](https://replayweb.page/), нажмите **Choose File…**, выберите файл и нажмите **Load**. Работает в современных браузерах. Загруженные архивы появляются в списке, откуда их можно убрать кнопкой «X» (файл на диске при этом не удаляется).

### 2. Десктоп-приложение

Скачайте сборку для своей ОС на [GitHub Releases](https://github.com/webrecorder/replayweb.page/releases) (`.dmg`, `.exe`, `.AppImage`). Приложение:

- имеет прямой доступ к файловой системе и не просит заново открыть локальный файл;
- работает без интернета;
- содержит эмулятор Flash Ruffle для старых сайтов.

По документации десктоп-приложение полностью заменяет прежний Webrecorder Player. Веб-версию также можно установить как PWA через меню браузера.

### 3. Встраивание и self-hosting

ReplayWeb.page предоставляет веб-компонент `<replay-web-page>`. Он состоит из интерфейса `ui.js` и service worker `sw.js` из npm-пакета [`replaywebpage`](https://www.npmjs.com/package/replaywebpage). Минимальный пример со страницы [Embedding](https://replayweb.page/docs/embedding/):

```html
<script src="https://cdn.jsdelivr.net/npm/replaywebpage@2.5.3/ui.js"></script>

<replay-web-page
  source="https://archive.example.org/data/my-archive.wacz"
  url="https://example.com/">
</replay-web-page>
```

Рядом со страницей нужен файл `replay/sw.js` с одной строкой:

```javascript
importScripts("https://cdn.jsdelivr.net/npm/replaywebpage@2.5.3/sw.js");
```

Для полного self-hosting скачайте `ui.js` и `sw.js` и положите их на свой сервер. Расположение service worker задаётся атрибутом `replayBase` (по умолчанию `./replay/`). Другие атрибуты: `ts` — дата снимка, `embed` — режим интерфейса (`replayonly`, `replay-with-info` и др.), `deepLink`, `loading="eager"` (загрузить WACZ целиком) — полный список в [документации](https://replayweb.page/docs/embedding/). Официального Docker-образа у ReplayWeb.page нет.

Service worker работает только по HTTPS (исключение — `localhost`), поэтому страницу со встроенным плеером нужно публиковать по HTTPS.

### 4. Ссылка на удалённый WACZ

```
https://replayweb.page/?source=https://archive.example.org/data/my-archive.wacz
```

Сервер с файлом должен разрешать CORS для `https://replayweb.page` (см. [CORS Settings](https://replayweb.page/docs/embedding/cors-settings/)) и поддерживать Range-запросы. HTTP-адреса из `https://replayweb.page` могут быть недоступны — используйте HTTPS. Также поддерживаются схемы `s3://` (публичный бакет), `googledrive://` и `ipfs://` ([Supported Locations](https://replayweb.page/docs/user-guide/locations/)).

> **Приватность:** при такой ссылке файл запрашивает браузер пользователя напрямую у источника.

## Сценарии использования

### Сценарий 1. Открыть WACZ и проверить архивацию

1. Возьмите `.wacz` (например, результат Browsertrix).
2. Откройте [replayweb.page](https://replayweb.page/) или десктоп-приложение.
3. Загрузите файл через **Choose File…** → **Load**.
4. Просматривайте страницы из списка или ищите по URL.

### Сценарий 2. Большой архив (десятки и сотни ГБ)

1. **Используйте WACZ, а не WARC.** WARC читается целиком для построения индекса, WACZ — нет.
2. **Публикуйте с поддержкой Range-запросов.** Тогда плеер скачивает только нужные ресурсы, а не весь файл.
3. **Не режьте файлы командой `split`.** WACZ — это ZIP-архив, а `.warc.gz` — последовательность gzip-записей. Байтовая нарезка даёт файлы, которые ни один инструмент не откроет. Если архив нужно разделить, делайте это по границам записей (см. [Работа с большими WARC-файлами](/kb/users/large-warc)) и упаковывайте части в отдельные WACZ через `wacz create`.
4. **Для очень больших коллекций** рассмотрите [pywb](/kb/instruments/replay/pywb) — он работает с WARC на сервере и не требует загрузки в браузер.

### Сценарий 3. Поиск по архиву

Плеер поддерживает поиск по списку страниц и по URL. Полнотекстовый поиск доступен для WACZ, в которых есть извлечённый текст (например, Browsertrix с флагом `--text` или `wacz create --detect-pages --text`).

### Сценарий 4. Ссылка на конкретную страницу

Адрес плеера содержит источник архива, URL и дату снимка, поэтому его можно просто скопировать и отправить ([Sharing](https://replayweb.page/docs/user-guide/sharing/)):

```
https://replayweb.page/?source=https://archive.example.org/data/my-archive.wacz#view=replay&url=https%3A%2F%2Fexample.com%2F&ts=20260601120000
```

Ссылки на локальные файлы (`source=file://...`) другим людям не откроются.

### Сценарий 5. Публичный архив на статическом хостинге

Если у вас есть статический хостинг (S3 + CloudFront, R2, GitHub Pages для небольших файлов), WACZ можно отдавать напрямую:

```
https://replayweb.page/?source=https://archive.example.org/data/echo-msk-2024.wacz
```

Плюсы: дёшево, нет своего сервера.
Минусы: нет CDX API и Memento; нужна настройка CORS.

Подробнее — [WARC-файл: от сырого архива до публикации](/kb/guides/warc-workflow).

## Ограничения

- **Форматы:** WACZ, WARC, HAR, CDX/CDXJ; ARC и WBN не поддерживаются.
- **WARC без индекса** при каждом первом открытии читается целиком — на больших файлах это долго.
- **Сложный контент:** воспроизведение зависит от того, что было записано; WebRTC, потоковое видео и функции, требующие живого сервера, часто не работают. Flash поддерживается через Ruffle в десктоп-приложении.
- **Не подходит для записи** — для этого есть [ArchiveWeb.page](https://webrecorder.net/archivewebpage) (расширение и приложение).
- **Локальные файлы в веб-версии:** браузер может попросить открыть файл повторно, потому что сайт не хранит постоянный доступ к файловой системе.

## Диагностика

| Проблема | Возможная причина | Решение |
|:---|:---|:---|
| Долгая загрузка | Открыт WARC, а не WACZ | Упакуйте в WACZ: `wacz create -o out.wacz file.warc.gz` |
| `TypeError: failed to load` при загрузке по URL | Источник не разрешает CORS | Настройте CORS на сервере по [инструкции](https://replayweb.page/docs/embedding/cors-settings/) |
| Встроенный плеер не загружается | Страница открыта по HTTP или не найден `replay/sw.js` | Публикуйте по HTTPS, проверьте путь `replayBase` |
| Ошибка при открытии файла | Повреждённый WACZ | `wacz validate -f file.wacz`; для WARC внутри — `warcio check` |

## Best practices

### Именование WACZ

```
archive-name_20260101_20260630.wacz
```

Так проще находить файлы и понимать период покрытия.

### Хранение WACZ

Держите рядом с архивом файл с контрольной суммой:

```bash
sha256sum archive-name.wacz > archive-name.wacz.sha256
```

### Публикация большого архива

1. Соберите архив через Browsertrix с `--generateWACZ` (или упакуйте WARC через `wacz create`).
2. Проверьте в ReplayWeb.page.
3. Загрузите в объектное хранилище с поддержкой Range-запросов и настройте CORS.
4. Поделитесь ссылкой `https://replayweb.page/?source=<URL файла>` или встройте плеер на свой сайт.

## Ресурсы

- [ReplayWeb.page](https://replayweb.page/) — онлайн-версия.
- [Документация](https://replayweb.page/docs/) — руководство пользователя.
- [Embedding](https://replayweb.page/docs/embedding/) — встраивание и self-hosting.
- [GitHub-репозиторий](https://github.com/webrecorder/replayweb.page).
- [Releases](https://github.com/webrecorder/replayweb.page/releases) — десктоп-сборки.
- [py-wacz](https://github.com/webrecorder/py-wacz) — упаковка WARC в WACZ.

> Сведения сверены с документацией ReplayWeb.page 2.5.3 (октябрь 2026).

## Связанные материалы

- [pywb — серверный плеер для публичных архивов](/kb/instruments/replay/pywb)
- [OpenWayback](/kb/instruments/replay/openwayback)
- [IPWB — replay через IPFS](/kb/instruments/replay/ipwb)
- [Формат WACZ](/kb/instruments/file-formats/wacz)
- [Формат WARC](/kb/instruments/file-formats/warc)
- [WARC-файл: от сырого архива до публикации](/kb/guides/warc-workflow)
- [Browsertrix — создание WACZ](/kb/instruments/tools/browsertrix)
- [Работа с большими WARC-файлами](/kb/users/large-warc)
