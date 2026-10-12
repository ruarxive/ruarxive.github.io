---
title: WebScrapBook
sidebar_label: WebScrapBook
description: "WebScrapBook — расширение для Firefox и Chromium-браузеров для сохранения, организации и аннотирования веб-страниц (форматы Folder, HTZ, MAFF, Single HTML) с сервером PyWebScrapBook."
last_update:
  date: 2026-10-12
---

# WebScrapBook

**WebScrapBook** — браузерное расширение для Firefox и Chromium-браузеров (Chrome, Edge, Opera, Vivaldi, Brave), которое сохраняет веб-страницы для последующего просмотра, организации, аннотирования и редактирования. Автор — Danny Lin (danny0838), лицензия MPL-2.0. Проект продолжает расширение **ScrapBook X** для старого Firefox; сам ScrapBook появился в середине 2000-х годов. Серверная часть и консольные инструменты — отдельный проект **PyWebScrapBook**.

Сайт: [github.com/danny0838/webscrapbook](https://github.com/danny0838/webscrapbook), документация — [wiki](https://github.com/danny0838/webscrapbook/wiki/Intro).

:::note WARC
WebScrapBook **не сохраняет и не экспортирует WARC**. Его форматы: папка (Folder), HTZ (ZIP), MAFF и Single HTML. Если нужен WARC для передачи в веб-архив, используйте [ArchiveWeb.page](https://archiveweb.page/) или [Browsertrix](browsertrix).
:::

## Зачем нужен архивисту

[SingleFile](singlefile) сохраняет одну страницу. WebScrapBook собирает сохранённые страницы в **коллекцию со структурой** (scrapbook): дерево папок, заметки, аннотации, поиск по тексту. Подходит для исследовательских проектов и личных архивов источников по теме.

## Возможности

- **Режимы захвата**: страница целиком, выделенные фрагменты, фрейм, ссылка, медиафайл, все открытые вкладки. Также доступны варианты «как…» (с настройкой параметров), «закладка» (только ссылка) и «исходник» (без обработки).
- **Захват по ссылкам со страницы** с глубиной и фильтрами (все ссылки, тот же домен, тот же путь, include/exclude по шаблону).
- **Форматы сохранения**:
  - **Folder** — папка с HTML и файлами ресурсов;
  - **HTZ** — ZIP-архив с той же структурой;
  - **MAFF** — Mozilla Archive Format;
  - **Single HTML** — один HTML-файл с встроенными ресурсами.
- **Дерево** коллекции с папками, разделителями, заметками.
- **Аннотации**: маркер, стикеры (в том числе с форматированием), редактирование сохранённой страницы.
- **Полнотекстовый поиск** по коллекции (нужен кеш, его строит сервер или `wsb cache`).
- **Повторный захват** и объединение захватов.
- **Сервер PyWebScrapBook**: хранение коллекции на диске или сервере, доступ с нескольких устройств, просмотр HTZ/MAFF.

## Когда использовать

✅ Подходит для:

- личного архива статей и документов с аннотациями;
- исследовательских коллекций с деревом папок;
- миграции старых коллекций ScrapBook и ScrapBook X;
- точного сохранения сложных страниц (с фреймами) в HTZ или MAFF.

❌ Не подходит для:

- автоматического обхода по расписанию на сервере: используйте [Heritrix](heritrix) или [Browsertrix](browsertrix);
- массовой выгрузки сайта: используйте [Wget](wget);
- передачи в веб-архив в стандартном формате: WARC он не пишет.

## Установка

### Расширение

- Firefox: [Mozilla Add-ons](https://addons.mozilla.org/firefox/addon/webscrapbook/)
- Chrome: [Chrome Web Store](https://chromewebstore.google.com/detail/oegnpmiddfljlloiklpkeelagaeejfai)
- Edge: [Microsoft Edge Add-ons](https://microsoftedge.microsoft.com/addons/detail/lodlipoddpmffbngkadebncbbidnambc)

Расширение работает и без сервера: тогда страницы сохраняются в папку загрузок браузера. Для полноценной коллекции с деревом и поиском рекомендуется сервер.

### Сервер PyWebScrapBook (рекомендуется)

Нужен Python 3.8+.

```bash
python -m pip install -U webscrapbook
```

Есть также готовые бинарники на [странице релизов](https://github.com/danny0838/PyWebScrapBook/releases/latest).

Запуск для каталога с коллекцией:

```bash
cd /path/to/scrapbook
wsb config -ba     # создать файлы настроек в .wsb/
wsb serve          # запустить сервер
```

Настройки — в `.wsb/config.ini` (редактирование: `wsb config -be`, описание: `wsb help config`). Адрес сервера указывается в настройках расширения (раздел Backend).

> Команды сверены с README WebScrapBook и PyWebScrapBook 2.10.2 (октябрь 2026), формат сохранения и режимы захвата — со строками интерфейса расширения.

### Консольные команды `wsb`

| Команда | Назначение |
| :--- | :--- |
| `wsb serve` | Запустить сервер |
| `wsb config` | Показать, создать или изменить настройки |
| `wsb cache` | Обновить кеш полнотекстового поиска и статические страницы |
| `wsb check` | Проверить и исправить данные коллекции |
| `wsb search` / `wsb query` | Поиск и запросы по коллекции |
| `wsb export` / `wsb import` | Экспорт и импорт элементов в архивы `.wsba` |
| `wsb convert` | Конвертация: из ScrapBook X (`sb2wsb`) и обратно, из папки с файлами (`file2wsb`), в обычные файлы (`wsb2file`), миграция |
| `wsb view` | Открыть HTZ или MAFF в браузере |

## Использование

### Сохранить страницу

1. Откройте страницу.
2. Нажмите на значок WebScrapBook и выберите «Capture page» (или пункт контекстного меню).
3. Для настройки формата, папки и глубины захвата ссылок выберите «Capture page as».

Формат по умолчанию задаётся в настройках («Save captured data as»: Folder, HTZ, MAFF или Single HTML).

### Аннотирование

Откройте сохранённую страницу из боковой панели WebScrapBook и включите редактор. Доступны маркер, стикеры и редактирование DOM. Изменения сохраняются вместе со страницей.

### Поиск

Вкладка поиска в боковой панели ищет по заголовкам, комментариям и, при наличии кеша, по полному тексту сохранённых страниц.

## Сравнение с другими инструментами

| Инструмент | Форматы | Дерево | Аннотации | WARC | Сервер |
| :--- | :--- | :---: | :---: | :---: | :---: |
| **WebScrapBook** | Folder, HTZ, MAFF, Single HTML | ✅ | ✅ | ❌ | ✅ PyWebScrapBook |
| **[SingleFile](singlefile)** | HTML, ZIP | ❌ | ⚠️ | ❌ | ❌ |
| **[monolith](monolith)** | HTML | ❌ | ❌ | ❌ | ❌ |
| **[ArchiveWeb.page](https://archiveweb.page/)** | WARC/WACZ | ❌ | ❌ | ✅ | ❌ |
| **[Hypothesis](https://web.hypothes.is/)** | — | ❌ | ✅ | ❌ | ✅ (облако) |

### Когда WebScrapBook лучше всех

- Нужен локальный архив со структурой (папки, заметки, аннотации).
- Нужна миграция старых коллекций ScrapBook.
- Нужно точно сохранить страницу с фреймами в один архивный файл (HTZ или MAFF).

### Когда лучше SingleFile

- Нужна только одна страница в одном HTML-файле без коллекции.

### Когда лучше ArchiveWeb.page или Browsertrix

- Нужен стандартный WARC/WACZ для передачи в веб-архив или воспроизведения в [ReplayWeb.page](/kb/instruments/replay/replayweb-page).

## Рекомендации

1. **Используйте сервер PyWebScrapBook**: коллекция живёт в обычном каталоге на диске, её легко копировать и бэкапить.
2. **Выбирайте формат осознанно.** HTZ и MAFF — один файл на страницу, удобно хранить. Folder — удобно смотреть и обрабатывать скриптами. Single HTML — удобно пересылать.
3. **Делайте резервные копии** каталога коллекции, например `tar -czf scrapbook-$(date +%F).tar.gz /path/to/scrapbook`.
4. **Для долговременного хранения в веб-архиве** дополнительно сохраняйте важные страницы в WARC другими инструментами.

## Ограничения

- Нет WARC и WACZ.
- Тяжёлые страницы (видеоплееры, сложные SPA) сохраняются, но воспроизведение может быть неполным.
- Нет OCR: текст из картинок не извлекается.
- Совместная работа требует сервера.

## Ресурсы

- [GitHub: WebScrapBook](https://github.com/danny0838/webscrapbook)
- [Документация (wiki)](https://github.com/danny0838/webscrapbook/wiki/Intro)
- [GitHub: PyWebScrapBook](https://github.com/danny0838/PyWebScrapBook)
- [ScrapBook X](https://github.com/danny0838/firefox-scrapbook) — предшественник для старого Firefox

## Связанные материалы

- **[SingleFile](singlefile)** — одна страница без структуры.
- **[monolith](monolith)** — CLI на Rust.
- **[Obelisk](obelisk)** — CLI на Go.
- **[Archive.ph](/kb/instruments/tools/archive-ph)** — мгновенный онлайн-снимок.
- **[ArchiveBox](archivebox)** — автоматический сбор с WARC.
- **[WARC](/kb/instruments/file-formats/warc)**
- **[ReplayWeb.page](/kb/instruments/replay/replayweb-page)**
- **[Глоссарий](/kb/glossary)**
- **[Пользовательские workflow](/kb/guides/custom-workflows)**
