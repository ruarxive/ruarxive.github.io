---
title: SUCHO (Saving Ukrainian Cultural Heritage Online)
sidebar_label: SUCHO
description: "SUCHO — волонтёрская инициатива по экстренной веб-архивации сайтов украинских учреждений культуры, начатая в 2022 году."
last_update:
  date: 2026-10-12
keywords: [sucho, украина, культурное наследие, чрезвычайная архивация, warc]
---

# SUCHO (Saving Ukrainian Cultural Heritage Online)

[SUCHO](https://www.sucho.org/) — Saving Ukrainian Cultural Heritage Online — волонтёрская инициатива, запущенная в начале марта 2022 года для **срочной веб-архивации сайтов украинских учреждений культуры**. Сооснователи — Quinn Dombrowski (Stanford University), Anna Kijas (Tufts University) и Sebastian Majstorovic (Austrian Center for Digital Humanities and Cultural Heritage).

## Что делают

По данным [сайта проекта](https://www.sucho.org/):

- **Веб-архивация** сайтов украинских учреждений культуры — от национальных архивов до местных музеев и детских художественных центров. Сохранено более 5 000 сайтов и около 50 ТБ данных.
- **Волонтёры** — более 1 500 человек из разных стран, работающих онлайн.
- **Оцифровка** — передача оборудования для оцифровки более чем 70 учреждениям культуры.
- **Публичный доступ** — база данных веб-архивов и галерея избранных материалов на сайте проекта.
- **Архив мемов** о войне как размеченный набор данных для исследователей.

## Технические детали

По описанию [рабочего процесса](https://www.sucho.org/workflow) SUCHO:

- ссылки параллельно отправлялись в **Wayback Machine** Internet Archive и в очередь **[Browsertrix Crawler](/kb/instruments/tools/browsertrix)**;
- Browsertrix волонтёры запускали на своих компьютерах и серверах (в Docker) или через облачный Browsertrix проекта; результат — файлы **WACZ**, которые проходили проверку качества в ReplayWeb.page;
- сложные сайты (интерактивные элементы, виртуальные туры) записывались вручную через **ArchiveWeb.page**;
- WACZ-файлы хранились на сервере SUCHO в Amazon Web Services.

## Связанные материалы

- **[Browsertrix](/kb/instruments/tools/browsertrix)** — браузерный краулер.
- **[EOT Archive](/kb/similar/eot-archive)** — архивация федеральных сайтов США.
- **[ArchiveTeam](/kb/similar/archiveteam)** — волонтёрское сообщество экстренной архивации.

## Источник

- [Публикация в Telegram-канале Ruarxive #14 (10.03.2022)](https://t.me/ruarxive/14) — обзор общественных проектов цифровой архивации.
