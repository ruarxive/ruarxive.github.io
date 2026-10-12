---
title: Web Curator Tool
sidebar_label: Web Curator Tool
description: "Web Curator Tool — открытая система управления селективной веб-архивацией для библиотек: разрешения на сбор, цели, расписание, сбор через Heritrix, проверка качества и передача в цифровое хранилище."
last_update:
  date: 2026-10-12
---

# Web Curator Tool

**Web Curator Tool (WCT)** — открытая система для управления процессом **селективной веб-архивации** в библиотеках и других памятных учреждениях. Рассчитана на нетехнических пользователей, например библиотекарей-кураторов. Технические детали сбора берёт на себя встроенная интеграция с кроулером [Heritrix](/kb/instruments/tools/heritrix). Лицензия Apache-2.0.

WCT изначально разработали Национальная библиотека Новой Зеландии и Британская библиотека (середина 2000-х годов). С 2017 года проект развивают Национальная библиотека Новой Зеландии и Национальная библиотека Нидерландов (KB).

- Репозиторий: [github.com/WebCuratorTool/webcurator](https://github.com/WebCuratorTool/webcurator) (версия 3.2.4, ноябрь 2025)
- Документация: [webcuratortool.readthedocs.io](https://webcuratortool.readthedocs.io/en/latest/)
- Старая версия 2.x: [WebCuratorTool/webcurator-v2-legacy](https://github.com/WebCuratorTool/webcurator-v2-legacy) (сюда перенаправляет и старый адрес `DIA-NZ/webcurator`)

## Что делает

По документации WCT поддерживает:

- **Harvest Authorisation** — получение и учёт разрешений правообладателей на сбор и публичный доступ;
- **Selection, scoping and scheduling** — выбор ресурсов (Targets), границы сбора и расписание;
- **Description** — описание метаданными Dublin Core;
- **Harvesting** — сбор Heritrix на одной или нескольких машинах (каждый запуск — Target Instance);
- **Quality Review** — проверка результата, исправление простых ошибок сбора, одобрение или отклонение;
- **Archiving** — передача одобренного результата во внешнее цифровое хранилище (например, Rosetta).

Чем WCT **не является** (по документации): это не цифровое хранилище для долгосрочного хранения, не инструмент публичного доступа (для этого используют Wayback-совместимые системы, например [pywb](/kb/instruments/replay/pywb) или OpenWayback) и не каталог.

## Когда использовать

✅ Подходит, если:

- учреждение ведёт **селективную** архивацию сайтов по согласованному списку;
- нужно учитывать **разрешения** правообладателей и историю переписки по ним;
- сбором занимаются кураторы без технической подготовки, а администраторы поддерживают инфраструктуру;
- результат передаётся в институциональное цифровое хранилище.

❌ Не подходит, если:

- нужен быстрый разовый сбор: используйте [Browsertrix](/kb/instruments/tools/browsertrix) или [Wget](/kb/instruments/tools/wget);
- нет ресурсов на поддержку серверной Java-системы с базой данных и Heritrix;
- нужен широкий (доменный) сбор: используйте Heritrix напрямую.

## Установка

Подробности — в [System Administrator Guide](https://webcuratortool.readthedocs.io/en/latest/guides/system-administrator-guide.html). Основные требования из документации:

- Java 1.8 или новее (рекомендуется 64-битная);
- сервер базы данных: PostgreSQL, MySQL/MariaDB или Oracle;
- Heritrix 3 (настройка описана в том же руководстве);
- для сборки из исходников — Maven или Gradle, Git;
- опционально — LDAP для внешней аутентификации.

Готовые сборки — на [странице релизов](https://github.com/WebCuratorTool/webcurator/releases). Порядок установки: создать схему базы данных скриптами из каталога `db/`, развернуть компоненты WCT и настроить их профили, установить и подключить Heritrix 3.

Документация на readthedocs описывает версию 3.0. Изменения следующих версий смотрите в примечаниях к релизам на GitHub.

> Сведения сверены с README и документацией webcuratortool.readthedocs.io (октябрь 2026). Установка локально не проверялась.

## Сравнение

| Инструмент | Управление процессом | Разрешения и роли | Сбор | Когда выбирать |
| :--- | :--- | :--- | :--- | :--- |
| **Web Curator Tool** | ✅ Полный цикл | ✅ | Heritrix 3 | Библиотеки и архивы с селективным сбором |
| **[Browsertrix](/kb/instruments/tools/browsertrix)** (облачная или self-hosted версия) | ⚠️ Расписание, коллекции, проверка качества | ⚠️ Роли в организации | Браузерный кроулер | Сайты с JavaScript, небольшие команды |
| **[Heritrix](/kb/instruments/tools/heritrix)** | ❌ | ❌ | Сам кроулер | Технические команды, широкий сбор |

## Ресурсы

- [GitHub: WebCuratorTool/webcurator](https://github.com/WebCuratorTool/webcurator)
- [Документация](https://webcuratortool.readthedocs.io/en/latest/)
- [Overview and History](https://webcuratortool.readthedocs.io/en/latest/guides/overview-history.html)
- [User Manual](https://webcuratortool.readthedocs.io/en/latest/guides/user-manual.html)

## Связанные материалы

- [Heritrix](/kb/instruments/tools/heritrix)
- [Стратегии формирования коллекций](/kb/guides/collection-strategies)
- [Пользовательские workflow](/kb/guides/custom-workflows)
