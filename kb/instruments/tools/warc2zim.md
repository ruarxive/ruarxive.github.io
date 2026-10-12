---
title: Kiwix (warc2zim, zimit)
sidebar_label: Kiwix (warc2zim, zimit)
description: "Конвертация WARC в формат ZIM для офлайн-чтения в Kiwix: warc2zim, zimit (обход сайта сразу в ZIM через Browsertrix Crawler), zimwriterfs и kiwix-serve."
last_update:
  date: 2026-10-12
---

# Kiwix (warc2zim, zimit, zimwriterfs)

**Kiwix** — открытая экосистема для офлайн-чтения веб-контента. В её центре формат **ZIM**: один сжатый файл со встроенным полнотекстовым индексом, который читают приложения Kiwix. Инструменты для архивистов развивает проект openZIM:

- **warc2zim** — конвертация WARC в ZIM;
- **zimit** — обход сайта браузером (через Browsertrix Crawler) с результатом сразу в ZIM;
- **zimwriterfs** — упаковка локальной папки с HTML в ZIM.

Сайт: [kiwix.org](https://kiwix.org/)

## Зачем нужен

WARC — «сырой» архивный формат для долгосрочного хранения: без pywb или ReplayWeb.page обычный пользователь его не откроет. ZIM — формат для читателя:

- **один файл** на сайт или коллекцию;
- **полнотекстовый поиск** локально в приложении Kiwix;
- **приложения** для Windows, macOS, Linux, Android, iOS и сервер `kiwix-serve`;
- **работа без интернета**;
- **готовые ZIM** Википедии и других проектов в [библиотеке Kiwix](https://library.kiwix.org/).

ZIM удобно распространять на флешках, по локальной сети или торрентами, если у читателей нет стабильного доступа в интернет.

## Что входит в экосистему

| Инструмент | Что делает | Когда использовать |
| :--- | :--- | :--- |
| **zimit** | Обход сайта через Browsertrix Crawler и конвертация в ZIM | Нужно получить ZIM с живого сайта |
| **warc2zim** | WARC → ZIM | У вас уже есть WARC |
| **zimwriterfs** (из пакета zim-tools) | Папка с HTML → ZIM | Статическая HTML-копия, собственная генерация |
| **kiwix-serve** (из пакета kiwix-tools) | HTTP-сервер для ZIM | Раздача нескольких ZIM в локальной сети |
| **mwoffliner** | MediaWiki → ZIM | Википедия и другие MediaWiki-сайты |

## Формат ZIM

ZIM хранит HTML, CSS, изображения, медиа и метаданные (название, описание, язык, автор, издатель). Внутри есть полнотекстовый индекс Xapian. Спецификация: [wiki.openzim.org/wiki/ZIM_file_format](https://wiki.openzim.org/wiki/ZIM_file_format).

## warc2zim

warc2zim переносит в ZIM все записи WARC. «Программные» записи (HTML, CSS, JS) он переписывает так, чтобы сайт работал офлайн. С версии 2.0 полученным ZIM больше не нужен service worker и HTTPS: в 1.x это было серьёзным ограничением.

Ограничения (по README):

- не работают формы и всё, что пишет данные на сервер;
- из видеоплееров поддерживается только встроенный YouTube; Vimeo, DailyMotion и другие обычно не работают;
- ресурсы с «динамическими» URL (с размером окна, меткой времени или уникальным ID в адресе) могут не находиться;
- HTTP-заголовки ответов не сохраняются; из кодов ответа учитываются только 200–203 и редиректы 301, 302, 306, 307; ответы 4xx и 5xx отбрасываются;
- service workers, web workers, import maps и редиректы через `meta http-equiv` не поддерживаются.

Главное правило: ZIM не может быть лучше исходного WARC. Если обход был плохим, ZIM тоже будет плохим.

### Установка

```bash
python3 -m venv ./env
./env/bin/pip install -U pip
./env/bin/pip install -U warc2zim
./env/bin/warc2zim --help
```

warc2zim 2.3.1 требует Python 3.14. Если подходящего Python нет, используйте Docker-образ `ghcr.io/openzim/warc2zim`.

> Команды и флаги сверены с README и `src/warc2zim/main.py` версии 2.3.1, а также с README zimit 3.1.3 (октябрь 2026).

### Использование

WARC-файлы (или каталоги с ними) передаются **позиционными аргументами**, `--output` — это **каталог**, а имя задаётся через `--name`:

```bash
warc2zim ./myarchive.warc.gz \
  --output ./output \
  --name myarchive \
  -u https://example.com/ \
  --title "Архив example.com" \
  --description "Копия сайта example.com" \
  --lang rus \
  --creator "example.com" \
  --publisher "Ruarxive"
```

Основные флаги:

| Флаг | Что делает |
| :--- | :--- |
| `--name` | Идентификатор ZIM (обязательно) |
| `--output` | Каталог для результата |
| `--zim-file` | Имя ZIM-файла, если нужно задать его явно |
| `-u, --url` | Главная страница ZIM |
| `-i, --include-domains` | Включать только эти домены (и их поддомены); можно повторять |
| `--title`, `--description`, `--long-description` | Название и описания |
| `--lang` | Язык (код ISO-639-3, например `rus`) |
| `--creator`, `--publisher`, `--source`, `--tags` | Метаданные |
| `-f, --favicon` | URL иконки главной страницы |
| `--custom-css` | CSS, добавляемый в каждую HTML-страницу (например, чтобы скрыть неработающий офлайн поиск) |
| `--overwrite` | Перезаписать существующий файл |

Фильтр по доменам:

```bash
warc2zim myarchive.warc.gz --name myarchive \
  -i example.com \
  -u https://sub.example.com/start.html
```

Через Docker:

```bash
docker run --rm -v "$PWD":/data ghcr.io/openzim/warc2zim \
  warc2zim /data/archive.warc.gz --output /data --name archive -u https://example.com/
```

## zimit

zimit — Python-проект, который работает в Docker-контейнере. Он запускает обход сайта [Browsertrix Crawler](browsertrix) (получаются WARC), а затем конвертирует их warc2zim в один ZIM. Официальный образ — `ghcr.io/openzim/zimit` (последний релиз — 3.1.3, июль 2026).

```bash
docker run ghcr.io/openzim/zimit zimit --help

docker run -v "$PWD/output":/output ghcr.io/openzim/zimit \
  zimit --seeds https://example.com/ --name example
```

Основные параметры zimit (кроме них принимаются флаги Browsertrix Crawler и warc2zim):

| Флаг | Что делает |
| :--- | :--- |
| `--seeds` | Стартовые URL через запятую; первый станет главной страницей ZIM (обязательно) |
| `--name` | Имя ZIM (обязательно) |
| `--output` | Каталог результата (по умолчанию `/output`) |
| `--scopeType` | Область обхода: `page`, `page-spa`, `prefix`, `host`, `domain`, `any`, `custom` |
| `--scopeIncludeRx`, `--scopeExcludeRx` | Регулярные выражения для включения и исключения URL |
| `--depth` | Глубина обхода (по умолчанию -1, без ограничения) |
| `--pageLimit` | Максимум страниц |
| `--workers` | Число параллельных воркеров |
| `--waitUntil` | Когда считать страницу загруженной (по умолчанию `load`; для статики — `domcontentloaded`) |
| `--behaviors` | Поведения на странице (по умолчанию `autoplay,autofetch,autoscroll,siteSpecific`) |
| `--timeSoftLimit`, `--timeHardLimit` | Ограничение времени обхода в секундах (мягкое — ZIM всё равно будет создан) |
| `--sizeSoftLimit`, `--sizeHardLimit` | Ограничение объёма |
| `--zim-lang` | Язык в метаданных ZIM (ISO-639-3) |
| `--lang` | Язык браузера при обходе (ISO-639-1) |
| `--keep` | Сохранить WARC и временные файлы и при успешном завершении |
| `--generateWACZ` | Создать также WACZ |
| `--warcs` | Пропустить обход и конвертировать готовые WARC (пути или URL через запятую, допускается tar) |

Пример с ограничением области и сохранением WARC:

```bash
docker run -v "$PWD/output":/output ghcr.io/openzim/zimit zimit \
  --seeds https://news.example.com/2025/ \
  --name news-2025 \
  --title "Новости 2025" \
  --scopeType prefix \
  --scopeExcludeRx '\.(mp4|zip)$' \
  --workers 2 \
  --timeSoftLimit 3600 \
  --zim-lang rus \
  --keep
```

Образ по умолчанию блокирует рекламу по спискам anudeepND. Если фильтрация не нужна, запустите контейнер с `--entrypoint=""`.

## zimwriterfs: папка с HTML → ZIM

zimwriterfs входит в [zim-tools](https://github.com/openzim/zim-tools) (Docker-образ `ghcr.io/openzim/zim-tools`). Обязательные параметры: главная страница, иконка 48×48 PNG, язык, имя, название, описание, автор и издатель.

```bash
# скачать статическую копию
wget --mirror --convert-links --adjust-extension --page-requisites \
  --no-parent -P ./site https://example.com/

# упаковать в ZIM
zimwriterfs \
  --welcome=example.com/index.html \
  --illustration=favicon48.png \
  --language=rus \
  --name=example-site \
  --title="Копия example.com" \
  --description="Офлайн-копия" \
  --creator="example.com" \
  --publisher="Ruarxive" \
  ./site example.zim
```

Пути `--welcome` и `--illustration` указываются относительно папки с HTML.

## kiwix-serve: раздача ZIM по HTTP

```bash
# один или несколько файлов
kiwix-serve --port=8080 archive1.zim archive2.zim

# через Docker (официальный образ)
docker run -v "$PWD/zims":/data -p 8080:8080 ghcr.io/kiwix/kiwix-serve '*.zim'
```

Для большой коллекции удобнее библиотека: `kiwix-manage library.xml add archive.zim`, затем `kiwix-serve --library library.xml`. Документация: [kiwix-tools.readthedocs.io](https://kiwix-tools.readthedocs.io/en/latest/kiwix-serve.html).

## mwoffliner: MediaWiki → ZIM

Для Википедии и других MediaWiki-сайтов эффективнее mwoffliner: он работает через API MediaWiki, а не через обход HTML.

```bash
docker run -v "$PWD/output":/output ghcr.io/openzim/mwoffliner \
  mwoffliner --mwUrl=https://bm.wikipedia.org --adminEmail=you@example.com \
  --outputDirectory=/output
```

## Приложения для чтения

Kiwix есть для Windows, macOS, Linux, Android и iOS, а также как расширение браузера: список на [странице приложений Kiwix](https://get.kiwix.org/en/solutions/applications/). Android-версия — [Google Play](https://play.google.com/store/apps/details?id=org.kiwix.kiwixmobile).

## Сравнение с другими инструментами

| Инструмент | Формат | JavaScript при сборе | Офлайн-чтение без сервера | Полнотекстовый поиск |
| :--- | :--- | :---: | :---: | :---: |
| **zimit / warc2zim** | ZIM | ✅ (zimit через Browsertrix) | ✅ приложения Kiwix | ✅ |
| **[pywb](/kb/instruments/replay/pywb)** | WARC + сервер | — | ❌ | ❌ |
| **[ReplayWeb.page](/kb/instruments/replay/replayweb-page)** | WARC/WACZ в браузере | — | ✅ | ⚠️ по страницам WACZ |
| **[Browsertrix](browsertrix)** | WACZ | ✅ | через ReplayWeb.page | ⚠️ |
| **[HTTrack](httrack)** | HTML-папка | ❌ | ✅ | ❌ |

### Когда Kiwix лучше всех

- нужно отдать архив обычным пользователям, без знания WARC;
- офлайн-доступ: школы, экспедиции, места без связи;
- Википедия или другой MediaWiki-сайт (через mwoffliner).

### Когда лучше pywb

- нужен серверный доступ по URL с навигацией по датам, как на web.archive.org;
- коллекция пополняется новыми сборами.

## Рекомендации

1. **Храните WARC вместе с ZIM.** ZIM — формат для чтения, WARC — для архивного хранения: ZIM не содержит HTTP-заголовков и части записей. В zimit используйте `--keep`.
2. **Заполняйте метаданные**: `--title`, `--description`, `--zim-lang`/`--lang`, `--creator`, `--publisher`. Без них ZIM трудно каталогизировать.
3. **Для современных сайтов используйте zimit**: сайт, собранный `wget --mirror` без выполнения JavaScript, не станет лучше после warc2zim.
4. **Не сжимайте ZIM повторно.** ZIM уже сжат внутри. Внешнее сжатие (`xz`, `zstd`) почти ничего не даёт, а файл перестаёт открываться в Kiwix без распаковки.
5. **Сохраняйте контрольные суммы**: `sha256sum archive.zim > archive.zim.sha256`.
6. **Большие ZIM раздавайте через kiwix-serve**, а не копируйте на каждое устройство.

## Ограничения

- ZIM — открытый формат проекта openZIM, но не международный стандарт, в отличие от WARC (ISO 28500).
- При конвертации теряется часть информации WARC: HTTP-заголовки, ответы с ошибками, дубли URL.
- Обновление — пересоздание ZIM целиком.
- Динамические сайты воспроизводятся с ограничениями (см. список выше).

## Юридические аспекты

:::warning
ZIM-файлы содержат копию чужого контента. Публичная доступность сайта не равна разрешению на распространение его копии. Перед публикацией ZIM проверьте лицензию контента и [правовые вопросы](/kb/legal/copyright), укажите источник в метаданных (`--source`, `--creator`).
:::

Контент под свободными лицензиями (Creative Commons и т. п.) можно распространять на условиях этих лицензий.

## Ресурсы

- [Kiwix](https://kiwix.org/)
- [openZIM на GitHub](https://github.com/openzim)
- [warc2zim](https://github.com/openzim/warc2zim)
- [zimit](https://github.com/openzim/zimit) и [FAQ zimit](https://github.com/openzim/zimit/wiki/Frequently-Asked-Questions)
- [zim-tools (zimwriterfs)](https://github.com/openzim/zim-tools)
- [kiwix-tools (kiwix-serve)](https://github.com/kiwix/kiwix-tools)
- [Спецификация ZIM](https://wiki.openzim.org/wiki/ZIM_file_format)
- [Библиотека готовых ZIM](https://library.kiwix.org/)

## Связанные материалы

- **[Формат WARC](/kb/instruments/file-formats/warc)**
- **[Browsertrix](browsertrix)** — внутри zimit.
- **[pywb](/kb/instruments/replay/pywb)**
- **[Обработка WARC](warc-processing)**
- **[Как пользоваться архивами](/kb/users/open-warc)**
- **[Экстренная архивация](/kb/guides/emergency-archiving)**
- **[Правовые вопросы](/kb/legal/copyright)**
- **[Кейсы международных архивов](/kb/case-studies/international-examples)**
