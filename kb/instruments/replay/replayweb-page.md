---
title: ReplayWeb.page — браузерный плеер WARC/WACZ
sidebar_label: ReplayWeb.page
description: "ReplayWeb.page — клиентский браузерный плеер WARC/WACZ. Работает локально, без сервера. Поддержка больших архивов, удалённых URL, веб-приложение, десктоп-версия."
last_updated: 2026-11-09
keywords: [replayweb.page, warc, wacz, replay, browser, client-side]
---

# ReplayWeb.page

[ReplayWeb.page](https://replayweb.page/) — полностью клиентский движок воспроизведения WARC и WACZ, разработанный [Webrecorder](https://webrecorder.io/). Архив обрабатывается в браузере пользователя — никакие данные не покидают машину. Это делает ReplayWeb.page основным инструментом для **разовых просмотров, отладки архивов и безопасного доступа к конфиденциальным коллекциям**.

> **Принципиальное отличие от pywb:** ReplayWeb.page не требует сервера. Открыли файл — увидели содержимое. Удобно для офлайн-работы, исследований с конфиденциальными данными и быстрой проверки качества.

## Зачем нужен архивисту

- **Проверка качества архива** сразу после создания: 2–3 минуты на WACZ-файл, видим ошибки 404, битые картинки, проблемы со шрифтами.
- **Локальный просмотр на офлайн-машине**: исследователь копирует архив и работает с ним без интернета.
- **Безопасный доступ к конфиденциальным архивам** — никто не сможет перехватить данные (они не покидают браузер).
- **Демонстрация коллекции** — журналистам и историкам с ограниченным техническим опытом.
- **Быстрый debug** при пайплайне wparc → metawarc: открыть промежуточный WACZ, посмотреть глазами.

## Когда использовать

✅ Подходит:

- Просмотр WACZ/WARC без настройки сервера.
- Офлайн-работа (исследователи в экспедициях, командировках).
- Проверка качества при создании архива.
- Демонстрация архива нетехнической аудитории.
- Работа с чувствительными данными (персональные данные, медиа).

❌ Не подходит:

- Публичный хостинг коллекции — нужен [pywb](/kb/instruments/replay/pywb) или [OpenWayback](/kb/instruments/replay/openwayback).
- Множество параллельных пользователей — браузер начинает тормозить после 5+ вкладок с большими WACZ.
- Полнотекстовый поиск — для этого [Shine](/kb/instruments/tools/shine) или [SolrWayback](/kb/instruments/tools/solrwayback).
- Запись (capture) — ReplayWeb.page только показывает; для сбора используйте [Browsertrix](/kb/instruments/tools/browsertrix) или [wget](/kb/instruments/tools/wget).

## Где запустить

### 1. Веб-версия (без установки)

Откройте [https://replayweb.page/](https://replayweb.page/). Работает в Chrome, Firefox, Edge, Safari.

Все данные обрабатываются в вашем браузере. Серверная часть не получает ни байт ваших файлов.

### 2. Desktop-приложение

Скачайте с [GitHub Releases](https://github.com/webrecorder/replayweb.page/releases). Доступно для Windows, macOS, Linux.

Удобно для:
- двойного клика по `.wacz` в файловом менеджере;
- офлайн-использования без браузера;
- интеграции с внешними архивами через ассоциацию файлов.

### 3. Self-hosted статика

Разверните свою копию ReplayWeb.page на собственном домене — это бесплатное open-source решение. Пример для nginx:

```nginx
server {
  listen 80;
  server_name archive.example.org;
  root /var/www/replayweb.page;
  index index.html;

  # Большие WACZ — отдавать стримингом
  location /static/ {
    add_header Accept-Ranges bytes;
  }
}
```

Готовый Docker-образ: [`webrecorder/replayweb.page`](https://hub.docker.com/r/webrecorder/replayweb.page).

### 4. Подключение удалённого WACZ по URL

```
https://replayweb.page/?source=https://archive.example.org/data/my-archive.wacz
```

Плеер скачает файл в браузер и откроет. Файл можно закешировать — для больших WACZ первая загрузка идёт медленно, потом открытие из кэша.

> **Privacy:** при таком URL ReplayWeb.page обращается к источнику из вашего браузера, не со своих серверов.

## Сценарии использования

### Сценарий 1. Открыть один WACZ-файл и проверить архивацию

1. Скачайте `.wacz` (например, результат Browsertrix).
2. Откройте [replayweb.page](https://replayweb.page/).
3. Нажмите «Load WACZ file» или просто перетащите файл в окно.
4. Дождитесь индексации (обычно < 1 мин на 100 MB WACZ).
5. Просматривайте страницы с боковой панели «Pages».

**Подсказка:** WACZ содержит CDXJ-индекс, поэтому страницы открываются быстро. WARC.gz без индекса — медленнее.

### Сценарий 2. Просмотр очень большого WACZ (десятки ГБ)

Пример: архив Эха Москвы — ~173 ГБ WACZ.

1. **Стриминг с диска.** ReplayWeb.page умеет читать WACZ стримингом, не загружая весь файл в RAM. Память браузера — лимит 2–8 ГБ.
2. **CDXJ-индекс обязателен.** Без него плеер будет сканировать весь файл при поиске.
3. **Загружайте по частям.** Разбейте WACZ на части: `split --bytes=10G big.wacz small-`.wacz`. Каждая часть открывается отдельно.
4. **Совет:** держите WACZ на SSD — HDD не успевает за современными браузерами.

Примерно время открытия первого снимка на машине с 32 ГБ RAM и NVMe SSD:

| Размер WACZ | CDXJ есть | CDXJ нет |
|:---:|:---:|:---:|
| 1 ГБ | 5 с | 30 с |
| 10 ГБ | 30 с | 5 мин |
| 50 ГБ | 1 мин | 20 мин |
| 100+ ГБ | 2 мин | > 1 часа |

Если CDXJ нет — соберите его отдельно:

```bash
npm install -g @webrecorder/cdxj-indexer
cdxj-indexer archive.wacz > archive.cdxj
# Положите cdxj рядом с WARC и снова откройте в ReplayWeb.page
```

### Сценарий 3. Аннотации и заметки

ReplayWeb.page (с версии 1.6+) поддерживает аннотации:

1. Откройте снимок.
2. Выделите текст → появится плавающая кнопка «Annotate».
3. Введите комментарий; он сохранится в `.json`-файл рядом с WACZ.

Затем этот файл можно положить в другой архив и поделиться аннотациями.

### Сценарий 4. Экспорт отдельной страницы в HTML

В правом верхнем углу ReplayWeb.page есть «Export Page» → сохраняет страницу в один самодостаточный HTML с ресурсами inline (аналогично SingleFile). Удобно для:

- отправки в редакцию по почте;
- публикации в блоге;
- включения в научную работу.

### Сценарий 5. Сравнение версий одной страницы

Если в WACZ несколько снимков одного URL:

1. Откройте снимок.
2. На боковой панели выберите «Timeline».
3. Прокрутите к другой дате — откроется параллельный снимок.
4. Используйте «Diff» для подсветки различий (только текст, не визуальная разметка).

### Сценарий 6. Хостинг большого публичного архива (read-only)

Если у вас есть статический хостинг (S3 + CloudFront, GitHub Pages), WACZ можно отдавать напрямую:

```
https://archive.example.org/replay/?source=https://archive.example.org/data/echo-msk-2024.wacz
```

Пользователи открывают ReplayWeb.page → он стримит WACZ из S3.

Плюсы: дёшево, нет своего сервера.
Минусы: только чтение, нет полнотекстового поиска, ограничение на размер одного файла (S3 — 5 ТБ).

Подробнее — [WARC-файл: от сырого архива до публикации](/kb/guides/warc-workflow).

## Настройки и параметры

### Включение экстра-фич через URL

```
# Тёмная тема
?theme=dark

# Включить экпериментальный режим
?debug=true
```

### Конфигурация производительности

В десктоп-версии можно тонко настроить:

- **Memory limit** — лимит RAM на обработку; по умолчанию 2 ГБ, повышение ускоряет большие архивы.
- **Concurrent requests** — параллельные загрузки ресурсов; 4–8 оптимально.
- **Disk cache** — кэш для повторных открытий.

## Программный API

ReplayWeb.page — клиентское приложение, но предоставляет JavaScript-API для интеграции:

```javascript
// Подключить WACZ
const coll = await window.$wb?.loadWacz('https://example.com/data.wacz');

// Получить информацию о коллекции
console.log(coll.title, coll.pages.length);

// Открыть страницу
coll.goto('https://example.com/page.html', '20260601120000');
```

Библиотека интеграции — `@webrecorder/replayweb.page`. Подробности: [Embedded Replay docs](https://github.com/webrecorder/replayweb.page/wiki/Embedding-ReplayWeb.page).

## Ограничения

- **Поддержка контента:** ReplayWeb.page полностью воспроизводит HTML, CSS, JS, шрифты. Ограниченно — WebGL, WebRTC, плагины (Flash/Silverlight), новые Web APIs, которые требуют online-сервисов.
- **Один WACZ за раз** — для просмотра нескольких архивов нужны отдельные вкладки.
- **RAM-потребление:** браузер загружает индекс в память; для 50+ ГБ WACZ рекомендуется 16 ГБ RAM.
- **Не подходит для записи** — только replay. Используйте [ArchiveWeb.page](https://github.com/webrecorder/archiveweb.page) (Chrome-расширение) для записи новых архивов.
- **Mixed content:** если WACZ содержит страницы с `http://`-ресурсами, а загружается по `https://`, браузер может их блокировать.

## Диагностика

| Проблема | Возможная причина | Решение |
|:---|:---|:---|
| Долгая индексация | Нет CDXJ в WACZ | Соберите CDXJ отдельно (см. выше) |
| Картинки не загружаются | Mixed content | Откройте ReplayWeb.page по HTTP, без HTTPS |
| «Out of memory» | Большой WACZ + мало RAM | Закройте другие вкладки, увеличьте лимит в настройках |
| «Invalid WACZ» | Повреждённый файл | `warcvalid path-to-warc-in-wacz` |
| Стриминг с URL обрывается | CORS у источника | Используйте прокси, например CORS-Anywhere для разработки |

## Best practices

### Именование WACZ для последующего поиска

```
archive-name_20260101_20260630.wacz
```

Это помогает находить файлы в файловой системе и понимать период покрытия.

### Хранение WACZ

Для регулярных архивов полезно держать `archive-name.wacz` + `archive-name.wacz.sha256`. SHA фиксируется при упаковке:

```bash
sha256sum archive-name.wacz > archive-name.wacz.sha256
```

### Публикация большого архива

1. Соберите WARC через Browsertrix (сразу WACZ).
2. Проверьте в ReplayWeb.page.
3. Загрузите на S3 / R2 / Selectel Storage.
4. Поделитесь ссылкой: `https://replayweb.page/?source=<ваш S3 URL>`.

## Ресурсы

- [ReplayWeb.page](https://replayweb.page/) — онлайн-версия.
- [GitHub репозиторий](https://github.com/webrecorder/replayweb.page).
- [Документация](https://github.com/webrecorder/replayweb.page/wiki).
- [Embedding Guide](https://github.com/webrecorder/replayweb.page/wiki/Embedding-ReplayWeb.page).
- [Releases — Desktop builds](https://github.com/webrecorder/replayweb.page/releases).
- [@webrecorder/cdxj-indexer](https://www.npmjs.com/package/@webrecorder/cdxj-indexer) — для предварительной индексации.

## Связанные материалы

- [pywb — серверный плеер для публичных архивов](/kb/instruments/replay/pywb)
- [OpenWayback — JVM-альтернатива](/kb/instruments/replay/openwayback)
- [IPWB — IPFS-based replay](/kb/instruments/replay/ipwb)
- [Формат WACZ](/kb/instruments/file-formats/wacz)
- [Формат WARC](/kb/instruments/file-formats/warc)
- [WARC-файл: от сырого архива до публикации](/kb/guides/warc-workflow)
- [Browsertrix — создание WACZ](/kb/instruments/tools/browsertrix)
- [metawarc — обогащение метаданными](/kb/instruments/ruarxive-tools/metawarc)
