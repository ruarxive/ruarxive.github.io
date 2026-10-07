---
title: WebScrapBook
sidebar_label: WebScrapBook
description: Мощное расширение Firefox/Chrome для захвата, организации и аннотирования веб-страниц с поддержкой WARC-экспорта
---

# WebScrapBook

**WebScrapBook** — браузерное расширение для Firefox и Chromium с серверным компонентом. Создано как духовный наследник легендарного **ScrapBook** (2007–2017). Поддерживает многоуровневое сохранение веб-страниц, гибкую организацию в виде дерева, аннотирование, полнотекстовый поиск и **экспорт в WARC**.

Сайт: [github.com/danny0838/webscrapbook](https://github.com/danny0838/webscrapbook)

## Зачем нужен архивисту

Одиночные расширения ([SingleFile](singlefile)) сохраняют одну страницу. WebScrapBook — это **полноценный архив с структурой**: можно собирать сотни страниц, раскладывать по папкам, аннотировать, искать, экспортировать в стандартный WARC для долгосрочного хранения.

Где незаменим:
- **Исследовательские проекты** — собрать все источники по теме в одном архиве с аннотациями.
- **Личный архив** — заменяет Pinterest и Pocket, но **локально**.
- **Журналистские расследования** — собрать доказательства с метаданными.
- **Миграция с Pocket, Evernote, OneNote** — импорт из HTML.

## Возможности

- **Несколько режимов захвата**:
  - **Save** — текущая видимая страница.
  - **Save As** — выбор конкретной страницы (главная, дочерняя, все).
  - **Capture As** — глубокий кроулинг с настройкой глубины и фильтров.
  - **Selective** — выборочное сохранение элементов.
- **Форматы сохранения**:
  - HTML-файл с инлайн-ресурсами (как SingleFile).
  - **MAFF** (Mozilla Archive Format, ZIP с HTML + медиа + метаданные).
  - **WARC** (через экспорт) — стандарт архивирования.
  - **PNG/Screenshot** — для динамических страниц.
- **Дерево папок** с перетаскиванием, тегами, цветами.
- **Аннотации**: выделение, заметки, sticky notes.
- **Полнотекстовый поиск** по сохранённому контенту.
- **Импорт**: HTML, MAFF, PDF, Pocket-export, Evernote-export, OneNote-export.
- **Экспорт**: WARC, ZIP, HTML-папка.
- **ScrapBook-совместимость** — импорт старых ScrapBook-архивов.
- **Серверная часть** (WebScrapBook backend) — для синхронизации между устройствами.
- **Автосохранение** по расписанию для указанных URL.

## Когда использовать

✅ Подходит для:

- **Личного архива** статей, постов, документов.
- **Исследовательских коллекций** с аннотациями и тегами.
- **Импорта из Pocket/Evernote** в самохостинг.
- **Захвата сложных страниц** (с комментариями, iframe) в один ZIP.
- **Экспорта в WARC** для передачи в долгосрочный архив.
- **Альтернативы Pinterest** без привязки к облаку.

❌ Не подходит для:

- **Серверного автоматического краулинга** (для этого — Heritrix, Browsertrix).
- **Массовой выгрузки сайта** (используйте [Wget](wget), [Wpull](wpull)).
- **Командной работы** без сервера (нужен backend).

## Установка

### Расширение для браузера

#### Firefox

- [Mozilla Add-ons: WebScrapBook](https://addons.mozilla.org/firefox/addon/webscrapbook/)
- Установить → появится иконка в панели инструментов.

#### Chrome / Edge / Brave

- [Chrome Web Store: WebScrapBook](https://chrome.google.com/webstore/detail/webscrapbook/jnhffcdjfjhcflgnmfaaiobenlpdibpa)
- [Edge Add-ons: WebScrapBook](https://microsoftedge.microsoft.com/addons/detail/webscrapbook/kpdkgmnimigkgjaldpnnhkglppfokibj)

> [!NOTE]
> Manifest V3 (новые версии Chrome) ограничивает возможности расширений. **Firefox рекомендуется** — там работают все функции, включая MAFF и глубокий capture.

### Backend (опционально)

Для синхронизации и общего доступа:

```bash
pip install webscrapbook
webscrapbook server --host 0.0.0.0 --port 8080
```

Веб-интерфейс: `http://localhost:8080`. В расширении указать URL сервера.

## Использование

### Базовый захват страницы

1. Открыть страницу.
2. Кликнуть на иконку WebScrapBook → **Capture**.
3. Выбрать формат (HTML, MAFF, PNG).
4. Указать папку в дереве.
5. **Done** — страница сохранена.

### Глубокий capture (краулинг)

1. Кликнуть → **Capture As** (или "Capture All Pages" в меню).
2. Настроить:
   - **Глубина** (0 = только эта страница, 1 = + ссылки на ней, и т.д.).
   - **Фильтры**: include/exclude по URL-паттернам.
   - **Лимит страниц**.
   - **Задержки** (для вежливого краулинга).
3. Запустить → WebScrapBook рекурсивно сохранит.

### Аннотирование

1. Открыть сохранённую страницу (правый клик → "Open" в WebScrapBook).
2. Выделить текст → появится всплывающее меню аннотации.
3. Добавить заметку, тег, цвет.
4. Сохранить — аннотация хранится вместе со страницей.

### Экспорт в WARC

1. Выделить страницу или папку в дереве.
2. Правый клик → **Export** → **WARC**.
3. Получится `.warc.gz`, совместимый с [pywb](/kb/instruments/replay/pywb), [ReplayWeb.page](/kb/instruments/replay/replayweb-page).

### Импорт из Pocket

1. В Pocket: Settings → Export → Save as HTML.
2. В WebScrapBook: правый клик на папку → **Import** → **Pocket HTML**.
3. Все сохранённые статьи импортируются с метаданными.

### Поиск

1. Кликнуть на иконку → вкладка **Search**.
2. Ввести запрос — найдёт по заголовкам, тегам, аннотациям, **полному тексту страниц**.

## Конфигурация

### Настройки расширения

В `about:addons` → WebScrapBook → Preferences:

```yaml
# Формат сохранения по умолчанию
Default save format: MAFF (с ресурсами)

# Автосохранение
Auto-save interval: 30 days
Auto-save items: ["https://news.example.com/*", "https://blog.example.com/*"]

# Захват
Capture depth: 2
Capture delay: 1.0 sec/page
Capture max-size: 100 MB
```

### Серверный backend (`config.ini`)

```ini
[server]
host = 0.0.0.0
port = 8080
root = /var/lib/webscrapbook
allow_tempdir = true
```

## Сравнение с другими инструментами

| Инструмент | Форматы | Дерево | Аннотации | WARC-экспорт | Сервер |
| :--- | :--- | :---: | :---: | :---: | :---: |
| **WebScrapBook** | MAFF, WARC, ZIP, HTML | ✅ | ✅ | ✅ | ✅ |
| **[SingleFile](singlefile)** | HTML | ❌ | ❌ | ❌ | ❌ |
| **[monolith](monolith)** | HTML | ❌ | ❌ | ❌ | ❌ |
| **ScrapBook (XUL)** | MAFF, HTML | ✅ | ✅ | ❌ | ❌ |
| **Pocket (online)** | HTML | ❌ | ✅ | ❌ | ❌ |
| **Hypothes.is** | — | ❌ | ✅ | ❌ | ✅ |
| **Notion Web Clipper** | HTML | ✅ | ✅ | ❌ | ❌ |

### Когда WebScrapBook лучше всех

- Нужен **локальный архив с структурой** (папки, теги, аннотации).
- Важна **миграция с Pocket/Evernote** в самохостинг.
- Нужен **экспорт в WARC** для передачи в долгосрочный архив.
- Используется **Firefox** (там все функции работают).

### Когда лучше SingleFile

- Нужна **только одна страница** в HTML — нет смысла в дереве.
- Работа в **Chrome/Edge** — WebScrapBook там ограничен.

### Когда лучше Hypothesis.is

- Нужны **аннотации на любых страницах** в интернете (а не только сохранённых).
- **Командная работа** с обсуждениями.

### Когда лучше ArchiveBox

- Нужен **автоматический** сбор из RSS/закладок.
- Множественные **методы** захвата (wget + Chrome + SingleFile).

## Best practices

### 1. Используйте MAFF как формат по умолчанию

MAFF — это ZIP-контейнер с HTML, медиа и метаданными. Преимущества:
- Один файл, удобно передавать.
- Все ресурсы внутри.
- Метаданные (дата, теги) не теряются.
- Конвертируется в WARC без потерь.

### 2. Структурируйте архив с самого начала

```
📁 Архив
├── 📁 2024
│   ├── 📁 Новости
│   ├── 📁 Исследования
│   └── 📁 Референсы
├── 📁 2025
│   └── 📁 Проект X
└── 📁 Templates
```

### 3. Добавляйте аннотации сразу

Не откладывайте. Свежие мысли через неделю уже не восстановить. Аннотация в 5 слов экономит часы.

### 4. Регулярно экспортируйте в WARC

```bash
# WebScrapBook → правый клик на корень → Export → WARC
# Сохранить в /mnt/backup/webscrapbook-YYYY-MM-DD.warc.gz
```

WARC — это стандарт, который проживёт десятилетия. MAFF — это «родной» формат, но менее распространён.

### 5. Используйте автосохранение для важных источников

```yaml
Auto-save items:
  - "https://news.ycombinator.com/*"
  - "https://www.bbc.com/news/*"
```

Раз в месяц все новые страницы автоматически попадают в архив.

### 6. Синхронизируйте через backend

Если используете несколько устройств — поднимите WebScrapBook server (в Docker, на домашнем NAS) и подключите к нему все браузеры.

### 7. Делайте бэкапы

```bash
# Ежедневный бэкап MAFF-файлов
tar -czf backup-$(date +%F).tar.gz ~/.local/share/webscrapbook/
```

## Ограничения

- **Manifest V3** в Chrome ограничивает некоторые функции (нет MAFF, нет глубокого capture в новых версиях). **Firefox** — рекомендуемая платформа.
- **Тяжёлые страницы** (видео-плееры, сложные SPA) сохраняются, но воспроизведение может быть затруднено.
- **Нет OCR** — текст из картинок не извлекается.
- **Нет командной работы** без backend-сервера.
- **Дублирование контента** при сохранении одной страницы в разные папки.
- **Большие коллекции** (>10k страниц) начинают тормозить.

## Ресурсы

- [GitHub: WebScrapBook](https://github.com/danny0838/webscrapbook) — исходный код.
- [Документация](https://github.com/danny0838/webscrapbook/wiki) — подробный гайд.
- [Mozilla Add-ons: WebScrapBook](https://addons.mozilla.org/firefox/addon/webscrapbook/) — установка в Firefox.
- [Chrome Web Store: WebScrapBook](https://chrome.google.com/webstore/detail/webscrapbook/jnhffcdjfjhcflognmfaaiobenlpdibpa) — установка в Chrome.
- [Онлайн-демо](https://danny0838.github.io/webscrapbook/) — посмотреть как выглядит.
- [ScrapBook Wiki (legacy)](https://wiki.greasespot.net/ScrapBook) — документация предшественника.

## Связанные материалы

- **[SingleFile](singlefile)** — для одной страницы без структуры.
- **[monolith](monolith)** — CLI-альтернатива на Rust.
- **[Obelisk](obelisk)** — CLI-альтернатива на Go.
- **[Archive.ph](/kb/instruments/tools/archive-ph)** — мгновенный онлайн-снимок.
- **[ArchiveBox](archivebox)** — автоматический сбор из RSS.
- **[WARC](/kb/instruments/file-formats/warc)** — куда экспортировать для долгосрочного хранения.
- **[pywb](/kb/instruments/replay/pywb)** — сервер воспроизведения WARC.
- **[ReplayWeb.page](/kb/instruments/replay/replayweb-page)** — клиентский просмотр WARC.
- **[Глоссарий](/kb/glossary)** — термин MAFF, WARC.
- **[Пользовательские workflow](/kb/guides/custom-workflows)** — WebScrapBook в пайплайнах.
