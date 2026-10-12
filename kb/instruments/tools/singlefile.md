---
title: SingleFile
sidebar_label: SingleFile
description: "SingleFile — браузерное расширение и CLI для сохранения веб-страницы со всеми ресурсами в один самодостаточный HTML-файл."
last_update:
  date: 2026-10-12
---

# SingleFile

**SingleFile** — браузерное расширение для Firefox, Chrome и других браузеров и консольная утилита **single-file-cli**. Оба сохраняют полную копию веб-страницы в один HTML-файл. Автор — Gildas Lormeau, лицензия AGPL-3.0.

## Когда использовать

✅ Подходит, если нужно:

- сохранить **одну страницу** со всеми CSS, изображениями и шрифтами в один самодостаточный HTML;
- работать в браузере вручную: открыли страницу, нажали кнопку, получили файл;
- сохранить страницу так, как её видит браузер после выполнения JavaScript.

❌ Не подходит, если:

- нужна массовая архивация по расписанию: используйте [Browsertrix Crawler](/kb/instruments/tools/browsertrix) или [wparc](/kb/instruments/ruarxive-tools/wparc);
- нужен стандартный WARC: SingleFile отдаёт HTML (или ZIP), а не WARC;
- сайт блокирует автоматизированные браузеры: CLI управляет браузером через протокол отладки, и защита от ботов может это обнаружить.

## Как устроено

SingleFile сериализует текущее состояние страницы (DOM после выполнения скриптов) и встраивает ресурсы в HTML. Расширение работает внутри вашего браузера, поэтому видит страницу так же, как вы, включая сессию входа. **single-file-cli** запускается через [Deno](https://deno.com/) и внедряет тот же скрипт в страницу через Chrome DevTools Protocol (или WebDriver BiDi для Firefox).

По умолчанию скрипты в сохранённую копию **не включаются** (`--block-scripts` включён): файл открывается как статичный снимок. Отложенные (lazy-loaded) изображения подгружаются перед сохранением (`--load-deferred-images`, тоже включён по умолчанию).

## Установка

### Браузерное расширение

- [Chrome Web Store](https://chromewebstore.google.com/detail/singlefile/mpiodijhokgodhhofbcjdecpffjipkle)
- [Firefox Add-ons](https://addons.mozilla.org/firefox/addon/single-file/)

### CLI

Варианты из README single-file-cli:

```bash
# готовый исполняемый файл: скачать со страницы релизов
# https://github.com/gildas-lormeau/single-file-cli/releases

# через npm (нужен Deno)
npm install single-file-cli
npx single-file --help

# через Docker
docker pull capsulecode/singlefile
docker run capsulecode/singlefile "https://example.com" > page.html
```

Нужен установленный Chrome или Chromium; путь к нестандартной установке задаётся `--browser-executable-path`. Firefox подключается через `--browser-engine firefox` (с ограничениями, описанными в справке).

> Команды и флаги сверены с README и `options.js` single-file-cli 2.18.1 (октябрь 2026). Утилита локально не запускалась.

## Использование

### Браузерное расширение

1. Откройте страницу, которую хотите сохранить.
2. Нажмите на иконку SingleFile на панели инструментов.
3. Файл сохранится в папку загрузок.

### CLI

Синтаксис: `single-file <url> [output] [options ...]`. Имя выходного файла — **второй позиционный аргумент**.

```bash
# сохранить страницу в page.html
single-file https://example.com page.html

# вывести HTML в консоль
single-file https://example.com --dump-content

# список URL из файла, результаты — в существующий каталог
single-file --urls-file=urls.txt --output-directory=./saved

# подождать 5 секунд перед сохранением и удалить фреймы
single-file https://example.com page.html --browser-wait-delay=5000 --remove-frames

# сохранить с выполняемыми скриптами (по умолчанию они блокируются)
single-file https://example.com page.html --block-scripts=false

# записать манифест того, что наблюдалось при сохранении (для последующей проверки)
single-file https://example.com page.html --manifest
```

Страница, доступная после входа: сначала создайте профиль браузера и войдите на сайт, затем используйте профиль:

```bash
single-file --create-browser-profile ./profiles/example https://www.example.com/login
single-file https://www.example.com/account account.html --browser-profile=./profiles/example
```

Обход внутренних ссылок (небольшие сайты):

```bash
single-file https://example.com --crawl-links=true --crawl-inner-links-only=true --crawl-max-depth=1
```

Полезные флаги:

| Флаг | Что делает |
| :--- | :--- |
| `--output-directory` | Каталог для файлов (должен существовать) |
| `--filename-template` | Шаблон имени файла, например `{page-title}.html` |
| `--urls-file` | Файл со списком URL |
| `--block-scripts` | Не включать скрипты в копию (по умолчанию `true`) |
| `--remove-frames` | Удалить фреймы |
| `--browser-wait-delay` | Пауза перед сохранением, мс |
| `--browser-wait-until` | Когда считать страницу загруженной (по умолчанию `networkIdle`) |
| `--browser-load-max-time` | Максимальное время загрузки, мс (по умолчанию 60000) |
| `--browser-cookies-file` | Файл cookies |
| `--compress-content` | Сохранить в ZIP вместо HTML |
| `--crawl-links`, `--crawl-max-depth` | Обход ссылок |

Полный список — `single-file --help`.

## Сравнение с другими решениями

| Инструмент | Браузерное расширение | CLI | Выполняет JS при сохранении | Язык |
| :--- | :---: | :---: | :---: | :--- |
| **SingleFile** | ✅ | ✅ | ✅ (через браузер) | JavaScript |
| **[monolith](monolith)** | ❌ | ✅ | ❌ | Rust (CLI и библиотека) |
| **[Obelisk](obelisk)** | ❌ | ✅ | ❌ | Go (CLI и библиотека) |

SingleFile — основной вариант для страниц, которым нужен JavaScript. monolith и Obelisk удобны там, где не хочется запускать браузер.

## Ограничения

- Файл может быть очень большим (десятки мегабайт) для страниц с длинной лентой или видео.
- Не подходит для больших сайтов и глубокого рекурсивного обхода.
- Не создаёт WARC: HTTP-заголовки и исходные ответы сервера не сохраняются. Если нужен WARC, используйте [Browsertrix](/kb/instruments/tools/browsertrix) или [ArchiveWeb.page](https://archiveweb.page/).
- Ресурсы встраиваются как `data:`-URI в base64, это увеличивает размер файла примерно на треть по сравнению с исходными бинарными файлами.

## Что дальше

- Нужен стандартный WARC и поиск по тексту — соберите страницу в WARC и проиндексируйте [metawarc](/kb/instruments/ruarxive-tools/metawarc).
- Регулярная автоматизация — [Browsertrix Crawler](/kb/instruments/tools/browsertrix).

## Ресурсы

- [SingleFile на GitHub](https://github.com/gildas-lormeau/SingleFile)
- [single-file-cli на GitHub](https://github.com/gildas-lormeau/single-file-cli)
- [Wiki SingleFile](https://github.com/gildas-lormeau/SingleFile/wiki)

## Связанные материалы

- [Другие инструменты сохранения](/kb/instruments/tools)
- [WARC формат для архивов](/kb/instruments/file-formats/warc)
- [Быстрый старт](/kb/guides/quick-start-5min)
