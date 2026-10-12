---
title: WikiTeam (ArchiveTeam)
sidebar_label: WikiTeam
description: "Архивация вики-сайтов — Fandom, Wikipedia и любых MediaWiki-проектов — через api и специальные дамперы с поддержкой исторических правок."
last_updated: 2026-10-12
keywords: [wikiteam, archive team, fandom, mediawiki, дамп вики]
---

# WikiTeam (ArchiveTeam)

[WikiTeam](https://github.com/ArchiveTeam/wikiteam) — инициатива [ArchiveTeam](https://wiki.archiveteam.org/), направленная на сохранение вики-сайтов: от крупных [Wikipedia](https://wikipedia.org/) до маленьких фан-проектов на MediaWiki, Fandom/Wikia и других движках.

Особенно критична работа WikiTeam в периоды сокращения вики-платформ — осенью 2025 года ArchiveTeam произвела массивный сбор дампов уходящих вики-сайтов.

## Когда использовать

✅ Подходит, если:

- нужно сохранить **MediaWiki-движок**: содержимое + история правок + загруженные файлы;
- перед вами **Fandom/Wikia-проект**, который вскоре может удалиться;
- требуется **история правок** (как у Wikidata, Wikipedia);
- нужно собрать **метаданные о структуре**: шаблоны, категории, права доступа.

❌ Не подходит:

- для сайтов на других движках (Joomla, WordPress и т. п.) — для них подходят [wget](/kb/instruments/tools/wget) / [wpull](/kb/instruments/tools/wpull);
- для **активной работы** вики (нужны другие инструменты: прокси + браузер);
- для **закрытых** вики (приватные корпоративные Wiki).

## Установка

```bash
git clone https://github.com/ArchiveTeam/wikiteam.git
cd wikiteam
pip install -r requirements.txt
```

## Использование

### Снять дамп небольшой вики

```bash
python dumpgenerator.py --api=http://example.wiki/api.php --xml --images
```

Получите набор XML-файлов с дампом содержимого и папку с медиа-файлами.

### Снять Fandom-вики

```bash
python dumpgenerator.py --api=https://community.fandom.com/api.php --xml
```

### Автоматизация для массовых дампов

В экосистеме ArchiveTeam есть также **Warrior** — браузерный интерфейс с автоматизацией сессий (виртуальные экраны, очереди задач). Используется для больших сборов (Wikipedia, Fandom).

## Выходные форматы

- **XML-дамп** в формате MediaWiki (один файл на вики или поток).
- **Папка с изображениями** — оригиналы в формате сайта.
- **Метаданные** — список шаблонов, категории, права пользователей.
- В сочетании с **ArchiveBot** возможно упаковать всё в WARCZ.

## Известные кейсы

- **Сохранение 11 миллионов Fandom-вики** (начат осенью 2025 г. из-за закрытия Fandom части платных вики).
- **Архивирование русскоязычного раздела Wikipedia** — регулярные дампы для крупных вики-сообществ.
- **Архивирование маленьких нишевых вики** (например, `fallout.fandom.com`, `cavesofqud.fandom.com`).

## Связанные материалы

- **[wget](/kb/instruments/tools/wget)** — общий краулер, если wiki нестандартная.
- **[Browsertrix Crawler](/kb/instruments/tools/browsertrix)** — для сайтов с активной динамикой.
- **[ArchiveTeam](https://wiki.archiveteam.org/)** — сообщество, включающее WikiTeam.

## Источник

- [Публикация в Telegram-канале Ruarxive #180 (30.03.2026)](https://t.me/ruarxive/180) — массовый сбор ArchiveTeam дампов вики-сайтов.
