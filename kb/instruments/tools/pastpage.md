---
title: PastPage — расширение для восстановления страниц
sidebar_label: PastPage
description: "PastPage — браузерное расширение для автоматического поиска исчезнувших страниц в Wayback Machine, Archive.today и других архивах. Для Chrome и Firefox."
last_updated: 2026-11-09
keywords: [pastpage, browser-extension, archive.today, wayback, link-rot]
---

# PastPage — расширение для восстановления страниц

[PastPage](https://github.com/brettlangdon/pastpage) — расширение для браузеров (Chrome и Firefox), которое автоматически находит архивные копии страниц в Wayback Machine, [Archive.today](https://archive.ph/), [Perma.cc](https://perma.cc/), [Library of Congress](https://webarchive.loc.gov/) и других Memento-совместимых архивах.

> **Главное:** при попытке открыть страницу, которая вернула 404 или изменилась до неузнаваемости, PastPage предложит «посмотреть в архиве» и даст прямую ссылку на ближайший снимок.

## Зачем нужно

- **Борьба с link rot** — до 50 % ссылок в Википедии через 10 лет ведут на 404-е страницы.
- **Восстановление цитат** — исследователь нашёл упоминание URL в книге, но сайт закрылся.
- **Журналистика** — проверить, что было на странице до того, как владелец её изменил.
- **Юриспруденция** — найти версию страницы на момент события.

## Возможности

| Возможность | Описание |
|:---|:---|
| **Автодетект 404** | При получении страницы с ошибкой — предложить архив |
| **Контекстное меню** | ПКМ → «View archived page» |
| **Toolbar кнопка** | Клик → список архивных версий текущей страницы |
| **Multiple archives** | Ищет сразу в Wayback, Archive.today, Perma.cc, LOC, BNE |
| **Memento Aggregator** | Федеративный поиск через timetravel.mementoweb.org |
| **History view** | Показывает все известные снимки на временной шкале |
| **Hotkey** | `Ctrl+Shift+A` (Chrome), `Cmd+Shift+A` (Mac) |

## Установка

### Chrome / Edge / Brave

1. Перейдите в [Chrome Web Store — PastPage](https://chromewebstore.google.com/detail/pastpage/nfcoaaejlopeclnhapflhcfcfknggldp).
2. Нажмите «Добавить в Chrome».
3. Подтвердите доступ к `*://*/*` (необходимо для запросов).

### Firefox

1. Откройте [Firefox Add-ons — PastPage](https://addons.mozilla.org/en-US/firefox/addon/pastpage/).
2. Нажмите «Add to Firefox».
3. Подтвердите разрешения.

### Из исходников (для разработки)

```bash
git clone https://github.com/brettlangdon/pastpage
cd pastpage
npm install
npm run build
# Загрузите папку build/ в Chrome → Extensions → Load unpacked
```

## Использование

### Сценарий 1. «Страница не открылась — что было раньше?»

1. Откройте любую страницу.
2. Если она вернула 404 или сильно изменилась, расширение покажет плавающее уведомление:
   ```
   🔍 Эта страница доступна в Wayback Machine
   [Открыть версию от 2024-12-15]
   [Показать все версии]
   ```
3. Нажмите «Открыть версию».

### Сценарий 2. Ручной запуск

Если расширение не сработало автоматически:

1. На странице — `Ctrl/Cmd+Shift+A` (или клик на иконку PastPage в панели).
2. Откроется popup с списком снимков.

### Сценарий 3. Из контекстного меню

1. ПКМ на ссылке в любом месте.
2. Меню → «Open with PastPage».
3. Откроется список снимков.

### Сценарий 4. История страницы

1. Откройте страницу.
2. Клик на иконку PastPage.
3. Кнопка «View timeline» — все снимки на временной оси.

### Настройка

Правый клик на иконку → Options:

| Настройка | Дефолт | Описание |
|:---|:---|:---|
| Auto-detect 404 | ✅ | Плавать уведомление при 404 |
| Search on page load | ❌ | Показывать архив для каждой страницы (нагрузка) |
| Default archive | `wayback` | Какой архив использовать первым |
| Custom archives | — | Добавить свои TimeGate |
| Hotkey | `Ctrl+Shift+A` | Изменить |

## Поддерживаемые архивы

| Сервис | Эндпойнт | Примечание |
|:---|:---|:---|
| Wayback Machine | `web.archive.org` | Основной |
| Archive.today | `archive.ph` | Быстрый снимок |
| Perma.cc | `perma.cc` | Академический |
| Library of Congress | `webarchive.loc.gov` | США |
| Bibliothèque nationale de France | `web.archive.bnf.fr` | Франция |
| UK Web Archive | `webarchive.org.uk` | Великобритания |
| Memento Aggregator | `timetravel.mementoweb.org` | Федеративный |
| Custom | настраивается | Через интерфейс |

## Сравнение с аналогами

| Расширение | Главная фишка | Разработка |
|:---|:---|:---|
| **PastPage** | Multiple archives, простой UI | Активна |
| **[Mink](https://github.com/keitham/mink)** | Sidebar panel в браузере | Активна |
| **[Resurrect Pages](https://github.com/fflorent/resurrect-pages)** | Single-archive | Стабильная, но узкая |
| **[Wayback Machine (Chrome)](https://chromewebstore.google.com/detail/wayback-machine/fpnmgdkabflnbojnbpmoiakhjhpmg)** | Официальная кнопка Wayback | Активна |
| **[Zotero Robust Links](https://github.com/lehnberg/zotero-memento)** | Интеграция с Zotero | Активна |

PastPage превосходит остальные именно работой с **несколькими архивами одновременно** — это важно для пользователей из РФ, где Wayback Machine может быть замедлен.

## Лучшие практики использования

### Для исследователей

- Включите «Auto-detect» — будете сразу видеть архивные копии при 404.
- Добавьте [Perma.cc](https://perma.cc/) для научного цитирования.
- Используйте timeline view для изучения эволюции страницы.

### Для журналистов

- В контекстном меню ПКМ на ссылке в соцсети → «Open with PastPage».
- Если пишете о событии 2-летней давности — сначала проверьте, что на странице было тогда.
- Сохраняйте результат через Perma.cc для собственного архива.

### Для юристов

- Перед использованием цитаты из веб-источника — проверьте оригинальную версию через Perma.cc.
- Сохраните версию страницы через Perma.cc сразу, чтобы у вас была собственная постоянная ссылка.

## Юридические аспекты

PastPage показывает **существующие** архивные снимки, не создаёт новых. Если нужно сохранить текущую версию:

- Через PastPage → «Save in Wayback» (требует SavePageNow).
- Через [Archive.ph](https://archive.ph/) — проще.
- Через [Perma.cc](https://perma.cc/) — для академических случаев.

## Альтернативы для исследователей OSINT

| Инструмент | Тип | Когда |
|:---|:---|:---|
| PastPage | Расширение браузера | Массовое использование |
| Wayback Machine API | HTTP | Скрипты, автоматизация |
| [Bellingcat Auto-Archiver](/kb/instruments/tools/auto-archiver) | Workflow OSINT | Массовая архивация |
| [Waybackpy](/kb/instruments/tools/waybackpy) | Python lib | Backednd-интеграция |
| [Scoop (Harvard LIL)](https://tools.perma.cc/) | Self-hosted capture | Юридический workflow |
| ArchiveTeam Wiki | Бумажный архив | Закрытые сервисы |

## Когда использовать

✅ Подходит:

- **Активный сёрфинг** с параллельной проверкой архива.
- **Восстановление ссылок** в научных и публицистических работах.
- **Журналистские расследования** с длинной историей цитат.
- **Борьба с изменённой информацией** (история правок страницы).

❌ Не подходит:

- **Массовое сохранение** — нужны специализированные инструменты.
- **Создание новых архивов** — только навигация по существующим.
- **Гарантированное цитирование** — снимки могут быть удалены; используйте Perma.cc.
- **Приватные страницы** — никогда не попадают в публичные архивы.

## Privacy note

PastPage при каждой загрузке страницы потенциально может делать запрос к архивам для проверки существования снимков. Это:

- Добавляет небольшую нагрузку на интернет-трафик.
- Может раскрыть посещаемые URL архивам.

Если это критично — отключите «Search on page load» и используйте только контекстное меню.

## Ресурсы

- [GitHub репозиторий](https://github.com/brettlangdon/pastpage)
- [Chrome Web Store](https://chromewebstore.google.com/detail/pastpage/nfcoaaejlopeclnhapflhcfcfknggldp)
- [Firefox Add-ons](https://addons.mozilla.org/en-US/firefox/addon/pastpage/)
- [Privacy policy](https://github.com/brettlangdon/pastpage/wiki/Privacy) — про то, какие данные передаются.

## Связанные материалы

- [Wayback Machine API](/kb/instruments/tools/wayback-api) — для скриптов.
- [Waybackpy](/kb/instruments/tools/waybackpy) — для Python.
- [Memento](/kb/instruments/replay/memento) — стандарт Memento Aggregator.
- [Internet Archive](/kb/similar/internet-archive) — обзор Wayback.
- [Perma.cc](/kb/similar/perma-cc) — для научных целей.
