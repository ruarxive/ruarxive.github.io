# Ревизия базы знаний Ruarxive — 2026-10-07

Документ фиксирует результаты ревизии неревизованных разделов базы знаний.
Подготовлен на ветке `docs/revise-ruarxive-tools-section` (HEAD: 2dcd20d).

## 1. Контекст и хронология

| Коммит | Что было ревизовано |
|---|---|
| `5be7bf8` (2026-10-07) | Комплексная ревизия БЗ: новые разделы users/legal/glossary/faq/similar/social-media; рефактор sidebars; технические фиксы (Browsertricks → Browsertrix, zero-width spaces, дубликаты frontmatter) |
| `2dcd20d` (2026-10-07) | Раздел `kb/instruments/ruarxive-tools/`: metawarc, metawarc-mcp, пайплайн wparc→metawarc |
| `e991a7b` (2026-10-07) | `kb/gratitudes/`: убрана ссылка на Transparency International Russia |
| `c155769` | Раздел курса DH.1–DH.4 (без `last_updated`!) |

Незакоммиченная работа (в рабочей копии, `git status`): массивная ревизия
`kb/guides/`, `kb/instruments/file-formats/`, `kb/instruments/tools/`. Этот блок
правок **не закрывает пробелы в других разделах** — они остаются актуальными.

## 2. Что НЕ ревизовалось — критические пробелы

### 2.1. Структурные пробелы (отсутствующие/пустые файлы)

| Файл/каталог | Проблема | Влияние |
|---|---|---|
| `kb/similar/index.md` | **Отсутствует** | Раздел открывается сразу контентной страницей, нет обзора; ломает UX чтения «от простого к сложному» |
| `kb/resources/index.md` | **Отсутствует** | Аналогично — `stats-snapshot`, `statistics`, `comparisons`, `test-files` не имеют обзорной страницы |
| `kb/legal/_category_.json` | **Отсутствует** | Категория без `position` → нестабильный порядок в сайдбаре; нет ярлыка категории |
| `kb/users/_category_.json` | **Отсутствует** | Аналогично |

### 2.2. Отсутствие frontmatter / `last_updated`

Файлы без `last_updated` (не прошли даже базовую проверку свежести):

```
kb/projects/{index,echomsk,preserved-government,russian-smi}.md
kb/case-studies/{index,government-websites-disappearing,bank-closures,platform-migrations,international-examples,api-archiving-scale,multi-tool-archiving,wparc-to-metawarc-pipeline}.md
kb/about/{project-history,lessons-learned}.md
kb/course/{index,dh1-introduction,dh2-web-archiving,dh3-specialized-resources,dh4-internet-archive}.md
kb/instruments/replay/index.md
kb/instruments/social-media/{index,instagram,fbarc,twarc,social-feed-manager}.md
kb/instruments/data-take-out/{data-take-out-main,dto-telegram,dto-instagram,dto-facebook,dto-twitter,dto-yandex,dto-google,dto-notion,dto-slack}.md
kb/instruments/howto-collect/make-copy-site-wordpress.md
kb/resources/{statistics,comparisons,test-files}.md
kb/similar/archiveteam.md
kb/volunteers/{volunteers-tasks,metadata-echo-moscow-archive}.md
```

Все 40+ файлов требуют хотя бы минимального frontmatter-апдейта
(`last_updated: 2026-10-07` плюс, где уместно, `description`).

### 2.3. Тонкие/недоработанные страницы

| Файл | Размер | Замечание |
|---|---|---|
| `kb/projects/russian-smi.md` | 20 строк | Есть маркер «продолжение следует» — страница не дописана; единственный проект «Новая газета» |
| `kb/instruments/data-take-out/dto-twitter.md` | 13 строк | Каркас без команд, без примеров |
| `kb/instruments/data-take-out/dto-instagram.md` | 15 строк | Аналогично |
| `kb/instruments/data-take-out/dto-facebook.md` | 20 строк | Только скриншоты и краткое описание |
| `kb/instruments/data-take-out/dto-google.md` | 26 строк | Слабый контент |
| `kb/instruments/data-take-out/dto-notion.md` | 23 строки | Каркас |
| `kb/instruments/data-take-out/dto-slack.md` | 25 строк | Каркас |
| `kb/instruments/data-take-out/dto-telegram.md` | 20 строк | Без frontmatter, без примеров команд |
| `kb/instruments/howto-collect/make-copy-site-wordpress.md` | 28 строк | Без frontmatter; даже короткий `warc-workflow.md` (новый) длиннее |
| `kb/instruments/social-media/instagram.md` | 29 строк | Без frontmatter; единственный реальный инструмент — Instaloader, без сравнений |

### 2.4. Фактические ошибки / устаревший контент

1. **`kb/projects/preserved-government.md:43`** — сохранилась благодарность
   «Трансперенси Интернешнл — Россия». Уже удалено из `kb/gratitudes/`
   коммитом `e991a7b`, но упоминание в `preserved-government.md` осталось —
   противоречит политике проекта.
2. **`kb/projects/preserved-government.md:46, 48, 61`** — старые Google Docs
   spreadsheet-ссылки помечены как `legacy`, но:
   - нет даты проверки;
   - ссылки `key=0AphaFpvgzsyhdEs4U2d5RHh0eFN0UFRCR2xJbkZ0OVE` — это публичные
     ключи старого формата, многие из них уже 404.
3. **`kb/instruments/data-take-out/data-take-out-main.md:55-66`** — внутренние
   ссылки ошибочны:
   - `[VK](dto-yandex)` для ВКонтакте;
   - `[WhatsApp](dto-yandex)` для WhatsApp.
   Это технические артефакты, появившиеся при копировании. VK и WhatsApp
   вообще не имеют собственных страниц в этом разделе.
4. **`kb/about/project-history.md`** — обрывается на 2025 г., `last_updated`
   отсутствует, и при этом в тексте есть ссылки на
   `[/kb/intro](/kb/intro)` (в современной БЗ это `kb/intro.md` — работает,
   но обращение с `last_updated` обязательно).
5. **`kb/case-studies/bank-closures.md:73-75`** — ссылки на
   `/kb/guides/wget` и `/kb/instruments/howto-collect/make-copy-website#httrack`
   были корректны до реорганизации; в текущей версии `kb/guides/wget` и
   `kb/instruments/tools/wget` сосуществуют — в `bank-closures.md` ссылка ведёт
   на устаревший путь.
6. **`kb/resources/statistics.md`** — в самом низу указано
   «Последнее обновление: январь 2025». В эпоху обновлённой статистики
   (`stats-snapshot.md`) это противоречие: нет единого источника правды.
7. **`kb/case-studies/international-examples.md:121`** — ссылка
   `opengovdata.ru/projects/govarchive/` — нужно проверить живость и
   при необходимости заменить на актуальный `preserved-government`.
8. **`kb/similar/archiveteam.md`** — единственная страница раздела без
   frontmatter. Не ревизовалась, не имеет `last_updated` и `description`.
9. **`kb/instruments/social-media/index.md`** — таблица «Сравнение инструментов»
   содержит строку «Instagram» без указания инструмента (поле «Инструмент» =
   «Instagram»). Вводящая в заблуждение.
10. **`kb/instruments/replay/index.md`** — без frontmatter, без `description`,
    заголовок `h1` совпадает с sidebar label, но нет «когда использовать»
    блока и нет перекрёстных ссылок к гайдам (`warc-workflow`) и
    инструментам (`metawarc`).

## 3. Проблемы навигации

### 3.1. Конфликты label категорий

| Категория | `_category_.json` | `sidebars.js` | Конфликт |
|---|---|---|---|
| `kb/projects/` | `«Коллекции цифровых архивов»` | `«Проекты»` | ❌ В сайдбаре видно «Проекты», при открытии страницы заголовок другой |
| `kb/instruments/data-take-out/` | `«Как сохранить личные данные из соцсетей и сервисов»` | `«Как выгружать данные»` | ❌ Полностью разные ярлыки одной секции |
| `kb/instruments/downloaded-data/` | `«Как выгружать данные»` | (не подключён к `sidebars.js`) | ⚠ Dangling label, не отображается в сайдбаре |
| `kb/instruments/replay/` | `«Воспроизведение архивов»` | (не подключён к `sidebars.js`) | ⚠ Dangling |

### 3.2. Dangling категории в `sidebars.js`

В `sidebars.js` НЕ подключены, но существуют в `kb/instruments/`:

- `kb/instruments/replay/` (5 файлов + index)
- `kb/instruments/downloaded-data/` (3 файла)
- `kb/instruments/file-formats/` (только что ревизован, но в сайдбаре только
  `warc/wacz/cdx/bagit/premis/mets/format-registries/identification-tools` —
  новые `iiif`, `jp2`, `mbox`, `mhtml`, `pdfa`, `siard` не подключены!)

Это критично: новые файлы форматов из незакоммиченной работы окажутся
невидимыми после билда.

### 3.3. Не подключены в сайдбаре новые инструменты

В незакоммиченных изменениях добавлены, но **отсутствуют в `sidebars.js`**:

- `kb/instruments/tools/curl.md`
- `kb/instruments/tools/internet-archive-cli.md`
- `kb/instruments/tools/monolith.md`
- `kb/instruments/tools/obelisk.md`
- `kb/instruments/tools/shine.md`
- `kb/instruments/tools/solrwayback.md`
- `kb/instruments/tools/wallabag.md`
- `kb/instruments/tools/warc2zim.md`
- `kb/instruments/tools/webscrapbook.md`
- `kb/instruments/tools/wget.md` (дубликат к `kb/guides/wget`!)

### 3.4. Дублирование путей

`kb/guides/wget.md` и `kb/instruments/tools/wget.md` (новый) описывают один
инструмент в двух местах. Нужно определить, что является каноническим, и
либо слить контент, либо развести по ролям (гайд = сценарий; инструмент =
справочник).

## 4. Предложения по улучшению

### 4.1. Навигация (высокий приоритет — без этого сайт теряет контент)

1. **Создать недостающие `index.md`** для `kb/similar/`, `kb/resources/`,
   `kb/instruments/replay/`, `kb/instruments/downloaded-data/` (последние два —
   короткие обзорные с перечислением подразделов).
2. **Создать недостающие `_category_.json`** для `kb/legal/`, `kb/users/` с
   осмысленным `position` (8 и 10 соответственно, чтобы вписаться в
   существующий порядок).
3. **Согласовать `label`** для `kb/projects/` и `kb/instruments/data-take-out/`
   между `_category_.json` и `sidebars.js` (рекомендую привести сайдбар к
   формулировкам `_category_.json` — они более описательны).
4. **Добавить в `sidebars.js`**:
   - категорию `kb/instruments/replay/`;
   - категорию `kb/instruments/downloaded-data/`;
   - категорию `kb/instruments/file-formats/` целиком (с новыми iiif/jp2/mbox/
     mhtml/pdfa/siard);
   - новые инструменты (`curl`, `obelisk`, `monolith`, `warc2zim`, `shine`,
     `wallabag`, `webscrapbook`, `solrwayback`, `internet-archive-cli`).
5. **Устранить дубль Wget**: выбрать `kb/instruments/tools/wget.md` как
   каноническую справку; в `kb/guides/wget.md` оставить только сценарии и
   ссылку на каноническую страницу.

### 4.2. Содержание (средний приоритет)

1. **Привести frontmatter** всех 40+ файлов к единому виду:
   ```yaml
   ---
   sidebar_position: <N>
   title: <Краткое название>
   description: <1-2 предложения для SEO/превью>
   last_updated: 2026-10-07
   ---
   ```
2. **Удалить/заменить ссылку** на Transparency International Russia в
   `kb/projects/preserved-government.md:43` (соответствует политике после
   коммита `e991a7b`).
3. **Проверить и пометить** Google Docs ссылки в `preserved-government.md`
   актуальной датой проверки.
4. **Исправить маршрутизацию** в `data-take-out-main.md`:
   - VK → либо создать `dto-vk.md`, либо убрать строку;
   - WhatsApp → убрать (нет страницы; в РФ нельзя выгрузить данные).
5. **Дописать тонкие страницы** `dto-*` (хотя бы 1-2 рабочих команды и формат
   выгрузки) и `instagram.md`.
6. **Объединить источник статистики**: `kb/resources/statistics.md` →
   `kb/resources/stats-snapshot.md` (последний добавлен в `5be7bf8` и
   предназначен для единого источника; `statistics.md` дублирует).
7. **Дополнить `kb/about/project-history.md` разделом 2026** — про курс,
   про `metawarc` и MCP-сервер, про крупные ревизии БЗ.
8. **`replay/index.md`** — добавить frontmatter, блок «когда использовать
   каждый инструмент», ссылки на новый `warc-workflow.md`.

### 4.3. Стратегия (низкий приоритет)

1. Раздел «Новости» (`kb/news/`) — это по сути перенаправление в блог.
   Рассмотреть удаление и замену в сайдбаре прямой ссылкой на `/blog`.
2. Раздел `kb/gratitudes/` — содержит только `index.md`. Дополнить
   подстраницами по категориям (команда, организации, инструменты) или
   оставить как single-page секцию.
3. Секция «Курсы» — добавить `last_updated` к лекциям (это полноценный
   образовательный контент, его свежесть критична).
4. Ввести `kb/glossary.md` в кросс-ссылки из всех остальных страниц
   (сейчас на него нет ссылок, кроме косвенных через Docusaurus TOC).

## 5. Сводка трудозатрат

| Блок | Оценка | Приоритет |
|---|---|---|
| Создать 4 недостающих `index.md` | 1–2 ч | P1 |
| Создать 2 недостающих `_category_.json` | 10 мин | P1 |
| Привести frontmatter 40+ файлов | 1–1.5 ч | P1 |
| Подключить категории и новые инструменты в `sidebars.js` | 30 мин | P1 |
| Исправить ссылки и фактические ошибки | 30 мин | P1 |
| Дописать 7–8 тонких `dto-*` страниц | 3–4 ч | P2 |
| Дополнить `replay/index.md` и `similar/index.md` | 1 ч | P2 |
| Объединить статистику | 30 мин | P2 |
| Дополнить `project-history.md` 2026 | 30 мин | P3 |

**Итого P1 (блокер для билда):** ~3–4 ч.
**Всего P1+P2:** ~7–10 ч.

## 6. Что делать прямо сейчас

Минимальный обязательный шаг перед мерджем текущей ветки — добавить в
`sidebars.js` категории и новые файлы, иначе часть ревизованного контента
(`iiif/jp2/mbox/...`, `curl/monolith/obelisk/...`) окажется скрытой от
пользователей.
