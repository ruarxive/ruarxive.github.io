---
title: Архивация динамических (Ajax) сайтов
sidebar_label: Ajax-сайты
sidebar_position: 8
description: "Почему обычные краулеры не видят контент Ajax-сайтов и что с этим делать: браузерные краулеры Browsertrix и Brozzler, сбор JSON-эндпоинтов через filegetter, разбор кейса zapovednik.space."
last_update:
  date: 2026-10-28
keywords: [ajax, javascript, spa, browsertrix, brozzler, wpull, filegetter, динамические сайты]
---

# Архивация динамических (Ajax) сайтов

Современные сайты всё чаще собирают содержимое страницы «на лету» через `fetch()`/`XMLHttpRequest`. Контент может подгружаться:

- отдельным JSON-запросом после загрузки одинаковой для всех страниц HTML-оболочки;
- прокруткой (infinite scroll);
- переключением вкладок и фильтров (без смены URL);
- переходом «вглубь» через модальные окна;
- через приватный API, требующий сессионной cookie.

В любом из этих случаев обычный краулер вроде [wget](/kb/instruments/tools/wget) или [wpull](/kb/instruments/tools/wpull) получает только HTML-оболочку — основное содержимое остаётся вне WARC. Сайт, который *выглядит* нормально индексируемым, на практике оказывается «пустым» с точки зрения простого веб-архива.

## Когда использовать эти подходы

✅ Подходят, если:

- сайт визуально работает, но в WARC попадает только «оболочка» без статей и карточек;
- URL страницы не меняется при переключении вкладок и фильтров;
- данные подгружаются по наблюдаемому Ajax-эндпоинту (видно в DevTools → Network);
- нужно сохранить контент, а не только снимок главной страницы.

❌ Не помогут или требуют отдельной работы:

- если доступ к контенту требует авторизации — обходить технические средства защиты нельзя; для легального доступа с собственной учётной записью у браузерных краулеров есть профили (например, `create-login-profile` в Browsertrix);
- если условия использования сайта запрещают автоматический сбор — проконсультируйтесь с юристом (см. [правовой раздел](/kb/legal)).

## Кейс: zapovednik.space

В [публикации #35](https://t.me/ruarxive/35) Telegram-канала Ruarxive (05.04.2022) разобран сайт [«Заповедник | Россия за пределами столиц»](https://zapovednik.space/) — контентное медиа из текстов, фотографий и изображений.

Что выяснилось:

- типовая ссылка на материал выглядит как `https://zapovednik.space/material/osobennosti-natsionalnoj-pandemii`;
- в HTML-коде страницы (`view-source:`) нет ни текста материала, ни ссылок на изображения, и код одинаковый для всех страниц;
- текст и изображения подгружаются отдельным Ajax-запросом в виде JSON — для материала с идентификатором `otdelitsja-ot-traditsij-i-podchinitsja-pravilam` это `https://zapovednik.space/api/material?id=otdelitsja-ot-traditsij-i-podchinitsja-pravilam`.

Поэтому обычный краулер, который ходит по ссылкам из HTML, сохраняет только оболочку. В публикации предложены два подхода — они разобраны ниже.

## Подход 1. Браузерный краулер

Использовать краулер, который запускает настоящий браузер, ждёт выполнения скриптов и сохраняет то, что видит пользователь, — включая Ajax-запросы. Такие краулеры медленнее, но результат ближе к тому, что видит пользователь.

### [Browsertrix Crawler](/kb/instruments/tools/browsertrix)

```bash
docker run -v "$PWD/crawls:/crawls/" -it webrecorder/browsertrix-crawler crawl \
  --url https://zapovednik.space/ \
  --scopeType prefix \
  --robots \
  --generateWACZ \
  --collection zapovednik \
  --behaviors autoscroll,autoplay,autofetch,siteSpecific \
  --pageLoadTimeout 90 \
  --postLoadDelay 2
```

- `-v "$PWD/crawls:/crawls/"` — краулер пишет результат в `/crawls`; готовый файл появится в `crawls/collections/zapovednik/zapovednik.wacz`.
- `--scopeType prefix` (значение по умолчанию) — обходить страницы в том же «каталоге», что и стартовый URL; для `https://zapovednik.space/` это весь сайт. Для всего хоста — `host`. Значение `page` означает «только стартовая страница», а `page-spa` — только эта страница, но с загрузкой её вариантов с разными `#`-якорями (для одностраничных приложений).
- `--robots` (синоним `--useRobots`) — соблюдать `robots.txt`; по умолчанию Browsertrix Crawler его не читает ([подробнее](/kb/guides/robots-txt-for-archiving)).
- `--behaviors` — действия на странице; список выше совпадает со значением по умолчанию, `autoclick` добавляет клики по ссылкам и кнопкам.
- `--pageLoadTimeout` (синоним `--timeout`) — сколько секунд ждать загрузки страницы.
- `--postLoadDelay` — пауза после загрузки страницы перед запуском поведения; `--pageExtraDelay` (синоним `--delay`) — пауза **после** поведений перед переходом к следующей странице.

По умолчанию краулер ждёт событий `load` и `networkidle2` (`--waitUntil`), то есть пока сеть почти не затихнет, — для Ajax-сайтов это подходящий режим.

### [Brozzler](/kb/instruments/tools/brozzler)

Brozzler — распределённый краулер Internet Archive на **Python**. Он управляет браузером Chromium, хранит состояние обходов в **RethinkDB**, а WARC записывает через прокси [warcprox](/kb/instruments/tools/warcprox).

```bash
pip install 'brozzler[rethinkdb]'

# одна страница
brozzle-page https://zapovednik.space/

# сайт целиком: задача из YAML-файла или отдельный сайт
brozzler-new-job job.yaml
brozzler-new-site --time-limit=600 https://zapovednik.space/
brozzler-worker --warcprox-auto
```

Для `brozzler-new-job`, `brozzler-new-site` и `brozzler-worker` нужны работающие RethinkDB и warcprox — см. [README Brozzler](https://github.com/internetarchive/brozzler). Brozzler оправдан для больших распределённых обходов; для одного сайта проще Browsertrix.

## Подход 2. Сбор JSON-эндпоинтов

Если структура сайта понятна, можно пойти адресным путём, как описано в публикации #35: найти все страницы `/material/<идентификатор>`, скачать соответствующие JSON, а затем по ссылкам на изображения и ссылкам в текстах собрать связанные ресурсы. Интерфейс сайта при этом теряется, но контент сохраняется полностью; результаты архивации интерфейса и данных придётся хранить отдельно.

### Шаги

1. Открыть сайт в браузере с DevTools.
2. На вкладке **Network** найти Ajax-эндпоинты (для zapovednik.space — `/api/material?id=...`).
3. Собрать список идентификаторов — из карты сайта, ленты материалов или другого эндпоинта.
4. Скачать ответы программно — через `curl` или [filegetter](/kb/instruments/ruarxive-tools/filegetter).
5. Из полученных JSON извлечь ссылки на изображения и вложения и скачать их тоже.
6. Проиндексировать результат через [metawarc](/kb/instruments/ruarxive-tools/metawarc) и опубликовать.

### Конфигурация filegetter

filegetter настраивается INI-файлом `filegetter.cfg` в каталоге проекта и запускается командой `filegetter run`. Для zapovednik.space: список идентификаторов — в файле `ids.txt` (по одному на строку), а URL строится по шаблону с `{}`:

```ini
[project]
name = zapovednik
source = ids.txt
source_type = list

[files]
fetch_mode = pattern
root_url = https://zapovednik.space/api/material?id={}
keys = id
storage_mode = id
default_ext = json
transfer_ext = True
file_storage_type = filesystem
delay = 1

[storage]
write_warc = True
```

```bash
pip install 'filegetter[warc]'
filegetter run --dry-run    # показать, что будет скачано
filegetter run
```

Файлы окажутся в `storage/files/`, отчёт с HTTP-статусами и SHA-256 — в `storage/processed.csv`, а при `write_warc = True` все успешные ответы с полными HTTP-заголовками дополнительно записываются в `storage/files.warc.gz`.

> Конфигурация проверена на filegetter 1.1.0 (октябрь 2026): скачан JSON одного материала zapovednik.space, ответ записан в WARC.

## Подход 3. Комбинация

Если часть сайта отдаётся обычным HTML, а часть подгружается скриптами, можно скомбинировать:

1. Снять оболочку и статические страницы через wget (с `--warc-file`).
2. Динамическую часть — собрать через Browsertrix или выгрузить JSON через filegetter.
3. Объединить WARC-файлы. Для `.warc.gz` достаточно склеить файлы: `cat part1.warc.gz part2.warc.gz > site.warc.gz` — каждая запись сжата отдельно, результат остаётся валидным WARC. Затем при необходимости упаковать в WACZ (`wacz create`) или, если нужен ZIM для офлайн-чтения в Kiwix, сконвертировать через [warc2zim](/kb/instruments/tools/warc2zim).

## Диагностика: Ajax-сайт перед вами или нет

Признаки:

- **Код страницы (`view-source:`) одинаковый** для разных материалов — как у zapovednik.space.
- **В HTML нет текста материала** и ссылок на подразделы, зато есть подключение JS-бандла.
- **В Wayback Machine** сайт есть, но в сохранённых страницах нет содержимого — только оболочка.
- **В DevTools → Network** видны `XHR`/`fetch`-запросы, которые возвращают JSON с текстом.
- **Содержимое появляется только с включённым JavaScript** — отключите JS в браузере и сравните.

## Что делать после архивации

- **Проверить WARC**: `warcio check` и [warchaeology](/kb/instruments/tools/warchaeology) (`warc validate`), а затем убедиться, что внутри действительно есть контент, — например, найти в архиве JSON-ответы или текст статей (см. [«Вскрытие» WARC](/kb/users/inspect-warc)).
- **Открыть в плеере**: WACZ — в [ReplayWeb.page](/kb/instruments/replay/replayweb-page), коллекцию WARC — в [pywb](/kb/instruments/replay/pywb).
- **Проиндексировать** через [metawarc](/kb/instruments/ruarxive-tools/metawarc) — каталог записей, MIME-типов, ссылок; для полнотекстового поиска по большой коллекции — [SolrWayback](/kb/instruments/tools/solrwayback).

## Связанные материалы

- **[Browsertrix Crawler](/kb/instruments/tools/browsertrix)** — основной браузерный краулер.
- **[Brozzler](/kb/instruments/tools/brozzler)** — распределённый браузерный краулер на Python.
- **[filegetter](/kb/instruments/ruarxive-tools/filegetter)** — массовое скачивание файлов по списку.
- **[metawarc](/kb/instruments/ruarxive-tools/metawarc)** — индексирование и анализ WARC после сбора.
- **[Warchaeology](/kb/instruments/tools/warchaeology)** — проверка собранного архива.
- **[Подготовка и планирование](/kb/guides/preflight-checklist)** — что сделать до запуска тяжёлого обхода.
- **[Ландшафт 2026](/kb/instruments/landscape-2026)** — общая картина инструментов и форматов.

## Источник

- [Публикация #35 в Telegram-канале Ruarxive (05.04.2022)](https://t.me/ruarxive/35) — почему веб-архивы неполны; разбор zapovednik.space и два подхода к архивации Ajax-сайтов.
- [Публикация #22 (22.03.2022)](https://t.me/ruarxive/22) — чем программисты могут помочь архивации, в том числе доработкой инструментов веб-архивации.
