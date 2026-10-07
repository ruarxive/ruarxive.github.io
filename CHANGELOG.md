# Changelog

Все значительные изменения в проекте документируются в этом файле.

Формат основан на [Keep a Changelog](https://keepachangelog.com/ru/1.0.0/),
и этот проект придерживается [Semantic Versioning](https://semver.org/lang/ru/).

## [Unreleased] — Октябрь 2026: масштабная ревизия базы знаний

### Добавлено

- **Инструменты Ruarxive**: страницы `metawarc` и `metawarc-mcp`; описание пайплайна `wparc → metawarc` (кейс-стади + интеграция в раздел).
- **Гайды**:
  - `kb/guides/warc-workflow.md` — пошаговый сценарий обработки WARC.
  - Расширены разделы `quick-start-5min`, `emergency-archiving`, `custom-workflows`, `wget`.
- **Справочник форматов**:
  - Новые страницы: `iiif`, `jp2`, `mbox`, `mhtml`, `pdfa`, `siard`.
  - Согласован единый стиль frontmatter и навигации для всех страниц форматов.
- **Сторонние инструменты (`kb/instruments/tools/`)**:
  - Добавлены: `curl`, `internet-archive-cli`, `monolith`, `obelisk`, `shine`, `solrwayback`, `wallabag`, `warc2zim`, `webscrapbook`, `wget` (как каноническая справка; в `kb/guides/wget.md` оставлены только сценарии).
  - Переработан `index.md` со сравнительной таблицей «что выбрать под сценарий».
- **Соцсети и data-take-out**:
  - Расширены `instagram.md`, `fbarc.md`, `twarc.md`, `social-feed-manager.md`.
  - Дополнены `dto-telegram`, `dto-facebook`, `dto-instagram`, `dto-twitter`, `dto-google`, `dto-yandex`, `dto-notion`, `dto-slack`, `dto-youtube`.
  - Добавлен `dto-vk.md` (раньше маршрутизировался ошибочно в `dto-yandex`).
- **Кейс-стади**:
  - Существенно переработаны `bank-closures`, `platform-migrations`, `government-websites-disappearing`, `international-examples`, `multi-tool-archiving`, `api-archiving-scale`.
  - Добавлен `wparc-to-metawarc-pipeline` (с привязкой к `metawarc`-инструментам).
- **Проекты и раздел «О проекте»**:
  - Переработаны `echomsk`, `preserved-government`, `russian-smi`, `index.md`.
  - Дополнены `project-history.md` (события 2025–2026) и `lessons-learned.md`.
- **Ресурсы и волонтёры**: обновлены `comparisons`, `statistics`, `test-files`, `metadata-echo-moscow-archive`, `volunteers-tasks`.
- **README**: обновлён раздел «Recent Updates», указаны Node.js 22, корректный список директорий и сценарии локального деплоя.

### Изменено

- **Сайдбар (`sidebars.js`)**:
  - Подключены ранее «висячие» категории `instruments/replay` и `instruments/downloaded-data`.
  - В категорию `instruments/file-formats` добавлены новые страницы (`iiif`, `jp2`, `mbox`, `mhtml`, `pdfa`, `siard`).
  - В категорию `instruments/tools` добавлены новые инструменты и подкатегории («HTTP-утилиты», «Управление архивацией»).
  - Согласованы `label` категорий `kb/projects` и `kb/instruments/data-take-out` (раньше в `_category_.json` и `sidebars.js` были разные ярлыки).
- **Docusaurus**: индексная страница `/kb/intro` теперь корректно ссылается на новые разделы (`warc-workflow`, `metawarc`, `dto-vk`).
- **CI/CD**: GitHub Actions обновлены до `actions/checkout@v5`, `actions/setup-node@v5`, `actions/upload-pages-artifact@v5`, Node.js 22.

### Исправлено

- **Маршрутизация в `data-take-out-main.md`**: ошибочные ссылки VK → `dto-yandex` и WhatsApp → `dto-yandex` устранены; VK теперь ведёт на новый `dto-vk.md`.
- **Сломанные/устаревшие ссылки** в `bank-closures.md`, `international-examples.md`, `project-history.md` приведены к актуальной структуре каталогов.
- **Дубликат Wget**: `kb/instruments/tools/wget.md` назначен канонической справкой; `kb/guides/wget.md` оставлен как сценарий.
- **Политические/правовые упоминания**: из `preserved-government.md` удалена ссылка на Transparency International Russia (соответствует политике после `e991a7b`).
- **Фронтматтер**: 40+ страниц приведены к единому виду (`title`, `description`, `last_updated`).

### Удалено

- `kb/resources/format-registries.md` — дубль; контент перенесён в `kb/instruments/file-formats/format-registries.md`.
- Цитаты из старых case-studies (bank-closures, platform-migrations), которые вводили в заблуждение относительно текущей практики.

## [2026-10-07] — Подготовка инфраструктуры CI и ревизия

### Добавлено

- `kb/about/project-history.md`: расширена хронология 2025–2026, описаны `metawarc`, MCP-сервер, образовательный курс.
- `kb/gratitudes/`: разделение по категориям (команда, организации, инструменты) — отложено, оставлено single-page.

### Изменено

- CI workflow: actions обновлены до `@v5`, добавлен Node.js 22, обновлён `upload-pages-artifact` до v5.

### Исправлено

- `kb/gratitudes/index.md`: удалена запись о Transparency International Russia.
- Сайдбар: устранены нерабочие ссылки `browsertricks` → `browsertrix`, исправлены конфликтующие slug'и.

## [2025-12-13] — Декабрьские обновления

### Добавлено

- Документация по TDL (Telegram Downloader).
- Расширенные руководства по архивации сайтов (HTTrack, Wget, Wpull).
- Документация по инструментам Ruarxive (`tgarc`, `ydiskarc`, `wparc`).

### Изменено

- Обновлены руководства по созданию цифровых архивов веб-сайтов.
- Расширена документация по инструментам Ruarxive.

## [2025-12-13] — Цифровой курс по архивации

### Добавлено

- Раздел `kb/course/` с лекциями DH.1–DH.4 (введение, веб-архивация, специализированные ресурсы, Internet Archive).
- Встроенные PDF-презентации на страницах курса.
- Улучшенная структура и читаемость контента курса.

### Изменено

- Улучшена читаемость страниц курса: переписаны с использованием pdfplumber для качественного извлечения текста.
- Исправлены ссылки на PDF-презентации с правильным URL-кодированием.
- Встроены PDF-презентации прямо в страницы курса через iframe.

### Исправлено

- Проблемы с отображением PDF-презентаций (404 ошибки).
- URL-кодирование для файлов с пробелами и кириллицей.
- Стили в JSX-формате для корректной работы в Docusaurus.

### Удалено

- Цитаты из case-studies (`bank-closures`, `platform-migrations`).

## [2025-01-15] — Январские обновления

### Добавлено

- Статьи о проблемах цифровой архивации.
- Международный опыт цифровой архивации.
- Кейсы исчезновения сайтов госорганов.

## [2022-03-11] — Первый релиз

### Добавлено

- Базовая структура сайта на Docusaurus.
- Начальная база знаний.
- Блог.
