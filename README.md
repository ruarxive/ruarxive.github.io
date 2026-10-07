# Ruarxive Website

![Build Status](https://github.com/ruarxive/ruarxive_web/actions/workflows/ci.yml/badge.svg)
![Deploy Status](https://github.com/ruarxive/ruarxive_web/actions/workflows/deploy.yml/badge.svg)
![License](https://img.shields.io/github/license/ruarxive/ruarxive_web)
![Docusaurus](https://img.shields.io/badge/built%20with-Docusaurus-green)

The official website and knowledge base for the **Russian National Digital Archive (Ruarxive)**, built with [Docusaurus 3](https://docusaurus.io/).

Сайт проекта: **[ruarxive.org](https://ruarxive.org/)**

## 🚀 Getting Started

### Prerequisites

- Node.js version **22** (см. `.github/workflows/deploy.yml`).
- npm (поставляется вместе с Node.js).

### Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/ruarxive/ruarxive_web.git
cd ruarxive_web
npm install
```

### Local Development

Запустите dev-сервер:

```bash
npm start
```

Сайт будет доступен на `http://localhost:3000`. Большинство изменений подхватываются на лету без перезапуска.

### Building for Production

Сгенерировать статический билд в каталоге `build/`:

```bash
npm run build
```

Локально посмотреть production-билд:

```bash
npm run serve
```

## 🛠️ Project Structure

- `/kb` — база знаний (Markdown/MDX): гайды, кейсы, инструменты, форматы, кейс-стади, разделы для пользователей, волонтёров, юридические вопросы и т. д.
- `/blog` — посты блога.
- `/src` — React-компоненты и кастомные страницы (формы Airtable, таблицы, интерактивные элементы).
- `/i18n` — переводы интерфейса (по умолчанию — русский, поддерживается английский).
- `/static` — статические ресурсы (изображения, PDF, файлы).
- `/sidebars.js` — структура сайдбара базы знаний.
- `/docusaurus.config.js` — конфигурация Docusaurus (тема, плагины, аналитика).

## 📚 Recent Updates

### Октябрь 2026 — масштабная ревизия базы знаний

- **Раздел инструментов Ruarxive**: добавлены страницы `metawarc` и `metawarc-mcp`; описана цепочка `wparc → metawarc`.
- **Гайды**: переработан раздел, добавлены `warc-workflow.md`, обновлены `quick-start`, `emergency-archiving`, `custom-workflows`, `wget`.
- **Справочник форматов**: добавлены страницы про `iiif`, `jp2`, `mbox`, `mhtml`, `pdfa`, `siard`; приведены к единому виду `warc`, `wacz`, `cdx`, `bagit`, `premis`, `mets`.
- **Инструменты (сторонние)**: добавлены `curl`, `internet-archive-cli`, `monolith`, `obelisk`, `shine`, `solrwayback`, `wallabag`, `warc2zim`, `webscrapbook`, `wget`; обновлены существующие страницы; переработан индекс со сценариями выбора.
- **Соцсети и data-take-out**: расширены `instagram.md`, `dto-telegram`, `dto-facebook`, `dto-instagram`, `dto-twitter`, `dto-google`, `dto-yandex`, `dto-notion`, `dto-slack`, `dto-youtube`; добавлен `dto-vk`.
- **Сайдбар (`sidebars.js`)**: подключены ранее «висячие» категории (`file-formats`, `replay`, `downloaded-data`), новые инструменты и форматы; устранены конфликты ярлыков.
- **Контент**: переписаны кейс-стади (`bank-closures`, `platform-migrations`, `government-websites-disappearing`, `international-examples`, `multi-tool-archiving`, `api-archiving-scale`, `wparc-to-metawarc-pipeline`), проекты, раздел «О проекте» (`project-history`, `lessons-learned`).
- **CI/CD**: обновлены GitHub Actions до Node.js 22 и `actions/upload-pages-artifact@v5`.

См. [CHANGELOG.md](CHANGELOG.md) для подробной истории изменений.

## 🧪 Code Quality

В проекте используются ESLint и Prettier.

- **Lint**: `npm run lint`
- **Format**: `npm run format`
- **TypeScript check**: `npm run typecheck`

## 🚢 Deployment

Деплой автоматический — при каждом push в `main` (или `master`) GitHub Actions собирает сайт и публикует его в GitHub Pages (окружение `github-pages`). URL публикации настраивается в workflow и обычно соответствует `ruarxive.org` (см. `static/CNAME`).

PR в `main`/`master` дополнительно прогоняются через `ci.yml` (тестовый билд).

## 🤝 Contributing

We welcome contributions! Подробности — в [CONTRIBUTING.md](CONTRIBUTING.md).

Основные принципы работы с контентом:

- База знаний живёт в `/kb`; одна страница = один `.md`-файл с frontmatter (`title`, `description`, `sidebar_position`, при необходимости `last_updated`).
- Боковое меню — вручную в `/sidebars.js`. Если вы добавили новую страницу, не забудьте подключить её в сайдбаре, иначе она не попадёт в билд.
- Иконки/изображения кладите в `/static/img/...`.
- Перед PR локально убедитесь, что `npm run build` отрабатывает без ошибок.

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
