---
title: WikiTeam (ArchiveTeam)
sidebar_label: WikiTeam
description: "WikiTeam — проект ArchiveTeam по архивации вики-сайтов на MediaWiki: XML-дампы с историей правок и файлы изображений; современный инструмент — wikiteam3."
last_update:
  date: 2026-10-12
keywords: [wikiteam, wikiteam3, archive team, mediawiki, дамп вики]
---

# WikiTeam (ArchiveTeam)

**WikiTeam** — подкомитет [ArchiveTeam](https://wiki.archiveteam.org/index.php/WikiTeam), который архивирует вики-сайты, от разделов Википедии до маленьких проектов на MediaWiki. По данным репозитория [WikiTeam/wikiteam](https://github.com/WikiTeam/wikiteam), на 2026 год сохранено более 600 000 вики. Результаты выкладываются в коллекцию [WikiTeam в Internet Archive](https://archive.org/details/wikiteam): XML-дампы страниц и архивы с изображениями.

Многие исчезнувшие или закрытые вики, в том числе русскоязычные, можно найти именно там. Дампы — это ещё и машиночитаемые открытые данные ([пост Ruarxive #180](https://t.me/ruarxive/180), 30.03.2026).

## Инструменты

| Инструмент | Что это | Статус |
| :--- | :--- | :--- |
| **[wikiteam3](https://github.com/saveweb/wikiteam3)** | Современный дампер для MediaWiki на Python 3 (`wikiteam3dumpgenerator`) и загрузчик в Internet Archive (`wikiteam3uploader`) | ✅ Активен (PyPI, версия 4.4.10) |
| **[WikiTeam/wikiteam](https://github.com/WikiTeam/wikiteam)** | Исходный `dumpgenerator.py` | ⚠️ Требует Python 2.7 |
| **[mediawiki-dump-generator](https://github.com/mediawiki-client-tools/mediawiki-dump-generator)** | Ещё один порт на Python 3 | Развивается |

Для новых задач используйте **wikiteam3**.

## Когда использовать

✅ Подходит, если:

- нужно сохранить вики на **MediaWiki**: содержимое, историю правок и загруженные файлы;
- вики может скоро закрыться;
- нужен машиночитаемый дамп для миграции или анализа.

❌ Не подходит:

- для сайтов на других движках (WordPress, Joomla и т. п.): используйте [Wget](/kb/instruments/tools/wget) или [Browsertrix](/kb/instruments/tools/browsertrix). WikiTeam принимает по запросу и вики на DokuWiki и PukiWiki, но это отдельные инструменты;
- для закрытых корпоративных вики без доступа;
- если нужен вид страниц «как в браузере»: дамп содержит вики-разметку, а не отрисованные страницы. Для визуальной копии дополнительно сделайте WARC.

## Установка wikiteam3

Нужен Python 3.10+.

```bash
uv tool install --upgrade wikiteam3
# или
pipx install wikiteam3
```

> Команды сверены с README wikiteam3 4.4.10 (октябрь 2026). Сам инструмент локально не запускался.

## Использование

### Полный дамп: история правок и изображения

```bash
wikiteam3dumpgenerator https://wiki.example.org --xml --images
```

Инструмент сам находит `api.php` и `index.php`. Если не находит, укажите их явно:

```bash
wikiteam3dumpgenerator --api https://wiki.example.org/w/api.php \
  --index https://wiki.example.org/w/index.php --xml --images
```

### Варианты

```bash
# только текущие версии страниц
wikiteam3dumpgenerator https://wiki.example.org --xml --curonly

# история через API (MediaWiki 1.27+), если Special:Export не работает
wikiteam3dumpgenerator https://wiki.example.org --xml --xmlrevisions

# только изображения
wikiteam3dumpgenerator https://wiki.example.org --images

# продолжить прерванный дамп
wikiteam3dumpgenerator --api https://wiki.example.org/w/api.php \
  --xml --images --resume --path /path/to/incomplete-dump
```

Полезные параметры: `--delay` (пауза между запросами, по умолчанию 1,5 с), `--retries`, `--namespaces`, `--cookies` (для вики с входом), `--user`/`--pass`.

При `--images` используйте файловую систему Linux (ext4, xfs, btrfs). На NTFS часть файлов не сохранится из-за запрещённых символов в именах.

### Загрузка в Internet Archive

`wikiteam3uploader <каталог_дампа>` сжимает дамп (zstd, 7z) и загружает его в Internet Archive. Нужны S3-ключи archive.org в файле `~/.wikiteam3_ia_keys.txt`.

### Без локальной установки

Для публичных вики можно не ставить ничего: отправьте запрос на архивацию (с причиной, например «вики скоро закроется») в IRC-канал `#wikiteam` сети hackint. Участники запустят задачу через [wikibot](https://wikibot.digitaldragon.dev/).

## Выходные данные

- XML-дамп в формате экспорта MediaWiki (история правок или только текущие версии);
- каталог с изображениями и их описаниями;
- служебные файлы, в том числе `config.json` (параметры дампа, используются при `--resume`) и журнал ошибок `errors.log`.

## Для администраторов вики

wikiteam3 по умолчанию делает паузу 1,5 с между запросами и учитывает заголовок `Retry-After`. Чтобы запретить архивацию своей вики, авторы предлагают добавить в `robots.txt`:

```text
User-agent: wikiteam3
Disallow: /
```

## Связанные материалы

- **[Wget](/kb/instruments/tools/wget)** — если вики нестандартная.
- **[Browsertrix Crawler](/kb/instruments/tools/browsertrix)** — визуальная копия в WACZ.
- **[Kiwix / mwoffliner](/kb/instruments/tools/warc2zim)** — офлайн-копия MediaWiki в формате ZIM.
- **[ArchiveTeam](/kb/similar/archiveteam)** — сообщество, в которое входит WikiTeam.

## Источник

- [Публикация в Telegram-канале Ruarxive #180 (30.03.2026)](https://t.me/ruarxive/180) — коллекция WikiTeam в Internet Archive и инструмент wikiteam3.
