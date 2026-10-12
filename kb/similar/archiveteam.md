---
title: ArchiveTeam
description: "ArchiveTeam — волонтёрское сообщество, с 2009 года проводящее экстренную архивацию закрывающихся сервисов: Warrior, Wget-AT, вики и коллекции в Internet Archive."
last_update:
  date: 2026-10-12
---

# ArchiveTeam

**ArchiveTeam** — «свободный коллектив изгоев-архивистов, программистов и писателей», основанный Джейсоном Скоттом в 2009 году. Его миссия — спасение цифрового наследия, которое находится под угрозой удаления.

Сайт: [wiki.archiveteam.org](https://wiki.archiveteam.org/)

## Философия

ArchiveTeam фокусируется на спасении данных закрывающихся сервисов (GeoCities, Google+, Yahoo Groups и других). Сообщество действует быстро и часто без согласования с владельцами сервисов, исходя из того, что сохранение истории важнее соблюдения их условий использования. Это позиция самого ArchiveTeam; правовую оценку подобных действий в РФ см. в разделе [Условия использования сервисов](/kb/legal/terms-of-service).

## Инструменты

### ArchiveTeam Warrior

[Виртуальная машина или Docker-контейнер](https://wiki.archiveteam.org/index.php/ArchiveTeam_Warrior), которую может запустить любой волонтёр. Она получает задания с центрального сервера (tracker), скачивает часть сайта и отправляет данные на серверы ArchiveTeam, откуда они попадают в Internet Archive.

### Wget-AT

[Wget-AT](https://github.com/ArchiveTeam/wget-lua) — модифицированная версия `wget` с поддержкой Lua-скриптов для сложной логики обхода, сжатием WARC в Zstandard и дедупликацией.

### WikiTeam

Подпроект ArchiveTeam, регулярно архивирующий вики-сайты (дампы в XML и архивы изображений). Результаты — в коллекции [wikiteam](https://archive.org/details/wikiteam) в Internet Archive; для самостоятельной архивации MediaWiki-сайтов есть инструмент [wikiteam3](https://github.com/saveweb/wikiteam3) ([публикация #180](https://t.me/ruarxive/180)). Подробнее: [WikiTeam](/kb/instruments/tools/wikiteam).

## Зачем это знать?

1. **База знаний.** [Вики ArchiveTeam](https://wiki.archiveteam.org/) — один из лучших источников о том, как архивировать конкретные сайты и сервисы. Прежде чем браться за сложный сайт, проверьте, нет ли о нём статьи.
2. **Наборы данных.** ArchiveTeam загружает результаты в [свою коллекцию](https://archive.org/details/archiveteam) в Internet Archive — возможно, нужный вам ресурс уже сохранён.
3. **Исчезнувшие русскоязычные вики** нередко можно найти в коллекции WikiTeam.
