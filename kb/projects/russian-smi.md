---
sidebar_position: 2
title: Архивы контента российских СМИ
description: "Архивы российских СМИ в Ruarxive: коллекции media2022 и novayagazeta2022, более ранние сборы 2013–2020 годов, полнота обходов по журналам wpull и состав CDX."
last_update:
  date: 2026-10-14
---

# Архивы контента российских СМИ

Этот раздел — об архивах **российских средств массовой информации** в хранилище Ruarxive. Основная кампания прошла в марте–ноябре 2022 года: блокировки, приостановка работы изданий и риск исчезновения сайтов ([#5](https://t.me/ruarxive/5)). Отдельные сборы были и раньше: коллекция `media` содержит копии 2013–2020 годов. В апреле 2024 года начата архивация polit.ru; готового файла в реестре от 12.12.2023 нет.

Сведения ниже собраны из четырёх источников:

- публикации канала [@ruarxive](https://t.me/ruarxive);
- реестр файлов [`allarchives.csv`](https://cdn.ruarxive.org/public/allarchives.csv) от **12.12.2023**. Поле `filesize` — размер в байтах. В таблицах этой страницы ГБ = байты / 10⁹, МБ = байты / 10⁶, КБ = байты / 10³. Строки `Downloaded` в журналах wpull приведены как в журнале (МиБ и ГиБ);
- карточки коллекций `media2022`, `novayagazeta2022` и `media` в каталоге [ruarxive-db](https://github.com/ruarxive/ruarxive-db);
- журналы wpull и индексы CDX, просмотренные **14.10.2026**. У больших журналов `Content-Range` совпал с `filesize` реестра. Метки времени в CDX — UTC. В журналах wpull те же события стоят на 3 часа позже, то есть журнал записан по московскому времени.

В таблицах файлов — WARC и ZIP. Рядом с ними в тех же каталогах лежат журналы обхода, CDX и служебные базы. HTML-копия сайта «Эха Москвы» тоже лежит в каталоге `media2022`; она описана на странице [«Эхо Москвы»](/kb/projects/echomsk).

:::warning Правовые ограничения
За участие в деятельности организации, признанной в РФ нежелательной, в том числе за распространение её материалов, предусмотрена ответственность (ст. 20.33 КоАП РФ, ст. 284.1 УК РФ). Это не юридическая консультация: перед сохранением и публикацией сверьте статус по реестрам Минюста РФ.

По перечню нежелательных организаций (копия на июнь 2024 года) и сообщениям Минюста:

- **The Insider** (Латвия) — решение Генпрокуратуры от 13.07.2022, обнародовано 15.07.2022; в перечень Минюста включён распоряжением от 26.07.2022. Ранее — реестр иностранных агентов.
- **SIA TV Rain** («ТВ Дождь») и **TVR Studios B.V.** — решение Генпрокуратуры от 21.07.2023, распоряжения Минюста от 04.08.2023. ООО «Телеканал Дождь» и Istories fonds внесены в реестр СМИ — иностранных агентов 20.08.2021.
- **IStories fonds** (Латвия, «Важные истории») — решение Генпрокуратуры от 22.02.2022, распоряжение Минюста № 226-р от 05.03.2022.

Остальные пометки в таблице — формулировки карточек коллекции и постов канала, а не вывод о текущем статусе издания.
:::

## Сколько лежит в хранилище

Сумма поля `filesize` по путям этих коллекций в реестре от 12.12.2023:

| Коллекция | Файлов | Всего | Из них WARC | Из них ZIP и 7z | Даты файлов |
|---|---:|---:|---:|---:|---|
| [`media2022`](https://cdn.ruarxive.org/public/webcollect2022/media2022/) | 98 | 343,3 ГБ | 19 файлов, 241,1 ГБ | 7 файлов, 91,0 ГБ | 05.03.2022–14.11.2022 |
| [`novayagazeta2022`](https://cdn.ruarxive.org/public/webcollect2022/novayagazeta2022/) | 73 | 21,5 ГБ | 24 файла, 1,04 ГБ | 1 файл, 20,3 ГБ | 03.03.2022–08.04.2022 |
| `media` (2013–2020) | 124 | 57,4 ГБ | 15 файлов, 46,6 ГБ | 2 файла, 6,8 ГБ | 06.11.2013–11.12.2020 |

У `media2022` ещё 4,5 ГБ журналов, 6,3 ГБ баз обхода и 424 МБ CDX. Готовый WARC novayagazeta.ru лежит в `media2022`, а не в `novayagazeta2022`: в папке 2022 года осталась первая, короткая попытка и спецпроекты. Семь ZIP в `media2022` — шесть выгрузок Telegram и HTML-копия «Эха Москвы».

Цифры 50 ГБ и 100 ГБ из постов марта 2022 года — оценки на дату поста. К 23.03 в канале названы colta.ru, theins.ru, paperpaper.ru, agentura.ru и news.doxajournal.ru, около 100 ГБ ([#23](https://t.me/ruarxive/23)). Пять соответствующих WARC в реестре дают 93,3 ГБ.

## Архив «Новой газеты»

Коллекция `novayagazeta2022`. Основание в карточке — предупреждение Роскомнадзора в начале марта 2022 года и риск блокировки.

- **Сайт и спецпроекты.** Сайт и сайты спецпроектов заархивированы 3 марта 2022 года ([#31](https://t.me/ruarxive/31)). С основным сайтом были сложности из-за защиты от DDoS, поэтому после приостановки работы издания (28.03.2022) архивация novayagazeta.ru была перезапущена ([#31](https://t.me/ruarxive/31), 31.03.2022) и закончена к 5 апреля 2022 года ([#39](https://t.me/ruarxive/39)).
- **Готовый WARC основного сайта** лежит в коллекции `media2022`: [novayagazeta.ru.warc.gz](https://cdn.ruarxive.org/public/webcollect2022/media2022/novayagazeta.ru/novayagazeta.ru.warc.gz), 21 361 581 676 байт (21,4 ГБ), дата файла 05.04.2022. Рядом — журнал на 1,27 ГБ, база обхода и [CDX](https://cdn.ruarxive.org/public/webcollect2022/media2022/novayagazeta.ru/novayagazeta.ru.cdx) на 104 743 489 байт. Первая запись индекса — `http://novayagazeta.ru/`, 31.03.2022 04:56 UTC. Журнал заканчивается 05.04.2022 двумя строками FINISHED: в 08:23 сессия на 58 минут, 5 758 файлов и 478,0 МиБ, в 08:53 — сессия с 0 файлов. Это итог последних сессий. Первая запись CDX относится к 31 марта, файл WARC — 21,4 ГБ.
- **Первая попытка** — [novayagazeta.ru.warc.gz](https://cdn.ruarxive.org/public/webcollect2022/novayagazeta2022/novayagazeta.ru/novayagazeta.ru.warc.gz) в каталоге `novayagazeta2022`, 97 372 810 байт, 03.03.2022. Журнал в этой папке — сессия с 19:22 до 19:23: запросы к `/socket` и API push, ответы 500 и 406, итог «Downloaded: 0 files, 0.0 B» за 24 секунды. Рядом лежит WARC на 97 МБ той же даты.
- **Telegram-канал.** Выгрузка завершена к 5 марта 2022 года: около 20 ГБ, в основном видео ([#7](https://t.me/ruarxive/7)). В хранилище лежит выгрузка от 08.04.2022: [novayagazeta_telegram_20220408.zip](https://cdn.ruarxive.org/public/webcollect2022/novayagazeta2022/novayagazeta.ru_telegram/novayagazeta_telegram_20220408.zip), 20 341 516 236 байт. Карточка по-прежнему указывает файл от 04.03.2022; по этому адресу файл не отдаётся.

### Спецпроекты

WARC от 03–04.03.2022, каталог [`novayagazeta2022`](https://cdn.ruarxive.org/public/webcollect2022/novayagazeta2022/). Название — текст `<title>` страницы проекта в этом WARC (для `spec.novayagazeta.ru` заголовок главной — «Новая газета», а страницы проекта называются «Москвичи»).

Похожий объём около 15–18 МБ у многих строк — это законченные короткие обходы, а не один и тот же оборванный шаблон. Журналы 3 марта доходят до FINISHED за одну-две минуты: десятки ответов HTML и файлы оформления на 15–28 МиБ. Крупнее остальных три проекта:

- [25.novayagazeta.ru](https://cdn.ruarxive.org/public/webcollect2022/novayagazeta2022/25.novayagazeta.ru/25.novayagazeta.ru.warc.gz) — FINISHED за 32 минуты, 508 ответов 200, 391,4 МиБ. HTML среди них 30. В конце журнала 165 ошибок DNS на `test.25.novayagazeta.ru`.
- [politkovskaya.novayagazeta.ru](https://cdn.ruarxive.org/public/webcollect2022/novayagazeta2022/politkovskaya.novayagazeta.ru/politkovskaya.novayagazeta.ru.warc.gz) — FINISHED за 7 минут, 1 619 ответов 200, из них 780 HTML, 156,0 МиБ.
- [election.novayagazeta.ru](https://cdn.ruarxive.org/public/webcollect2022/novayagazeta2022/election.novayagazeta.ru/election.novayagazeta.ru.warc.gz) — журнал с 09:44 до принудительной остановки в 12:29 04.03.2022, строки FINISHED нет. В журнале 14 490 ответов HTML со статусом 200.

Отдельно тонкие обходы: у «Депутатской энциклопедии» 6 ответов 200 и 145 ответов 404; «Как меня убивали» — страница на Tilda, 7 файлов за одну секунду.

| Спецпроект | Объём |
|---|---|
| [Последние императоры](https://cdn.ruarxive.org/public/webcollect2022/novayagazeta2022/25.novayagazeta.ru/25.novayagazeta.ru.warc.gz) (25.novayagazeta.ru) | 403 МБ |
| [Выборы России 2021](https://cdn.ruarxive.org/public/webcollect2022/novayagazeta2022/election.novayagazeta.ru/election.novayagazeta.ru.warc.gz) | 164 МБ |
| [Анна Степановна Политковская](https://cdn.ruarxive.org/public/webcollect2022/novayagazeta2022/politkovskaya.novayagazeta.ru/politkovskaya.novayagazeta.ru.warc.gz) | 154 МБ |
| [#поуши](https://cdn.ruarxive.org/public/webcollect2022/novayagazeta2022/sortiry.novayagazeta.ru/sortiry.novayagazeta.ru.warc.gz) (sortiry.novayagazeta.ru) | 17,9 МБ |
| [Офшоры. Вскрытие](https://cdn.ruarxive.org/public/webcollect2022/novayagazeta2022/krug.novayagazeta.ru/krug.novayagazeta.ru.warc.gz) | 17,4 МБ |
| [История России на первых полосах «Новой газеты»](https://cdn.ruarxive.org/public/webcollect2022/novayagazeta2022/3000.novayagazeta.ru/3000.novayagazeta.ru.warc.gz) | 17,3 МБ |
| [Углеводородина](https://cdn.ruarxive.org/public/webcollect2022/novayagazeta2022/gaz.novayagazeta.ru/gaz.novayagazeta.ru.warc.gz) | 17,2 МБ |
| [Москвичи](https://cdn.ruarxive.org/public/webcollect2022/novayagazeta2022/spec.novayagazeta.ru/spec.novayagazeta.ru.warc.gz) (spec.novayagazeta.ru) | 17,2 МБ |
| [Принятие](https://cdn.ruarxive.org/public/webcollect2022/novayagazeta2022/chechnyagate.novayagazeta.ru/chechnyagate.novayagazeta.ru.warc.gz) | 16,5 МБ |
| [«Я живой». Письма усыновленных войной](https://cdn.ruarxive.org/public/webcollect2022/novayagazeta2022/letters.novayagazeta.ru/letters.novayagazeta.ru.warc.gz) | 16,5 МБ |
| [Сигнал: «Дождь идет»](https://cdn.ruarxive.org/public/webcollect2022/novayagazeta2022/hk.novayagazeta.ru/hk.novayagazeta.ru.warc.gz) | 15,9 МБ |
| [Госзаказ и тайные холдинги](https://cdn.ruarxive.org/public/webcollect2022/novayagazeta2022/goszakaz.novayagazeta.ru/goszakaz.novayagazeta.ru.warc.gz) | 15,7 МБ |
| [Вместе С. Спецпроект «Новой газеты»](https://cdn.ruarxive.org/public/webcollect2022/novayagazeta2022/vmeste-c.novayagazeta.ru/vmeste-c.novayagazeta.ru.warc.gz) | 15,6 МБ |
| [Кафка-кодекс](https://cdn.ruarxive.org/public/webcollect2022/novayagazeta2022/kafka.novayagazeta.ru/kafka.novayagazeta.ru.warc.gz) | 15,6 МБ |
| [228](https://cdn.ruarxive.org/public/webcollect2022/novayagazeta2022/228.novayagazeta.ru/228.novayagazeta.ru.warc.gz) | 15,5 МБ |
| [Непрезиденты](https://cdn.ruarxive.org/public/webcollect2022/novayagazeta2022/gogol2018.novayagazeta.ru/gogol2018.novayagazeta.ru.warc.gz) | 15,4 МБ |
| [Магазин «Новой газеты»](https://cdn.ruarxive.org/public/webcollect2022/novayagazeta2022/shop.novayagazeta.ru/shop.novayagazeta.ru.warc.gz) | 2,11 МБ |
| [Наш бессмертный взвод](https://cdn.ruarxive.org/public/webcollect2022/novayagazeta2022/war.novayagazeta.ru/war.novayagazeta.ru.warc.gz) | 1,32 МБ |
| [Гражданин, пройдёмте!](https://cdn.ruarxive.org/public/webcollect2022/novayagazeta2022/citizen.novayagazeta.ru/citizen.novayagazeta.ru.warc.gz) | 631 КБ |
| [Игорь Александрович Домников](https://cdn.ruarxive.org/public/webcollect2022/novayagazeta2022/domnikov.novayagazeta.ru/domnikov.novayagazeta.ru.warc.gz) | 524 КБ |
| [БАБИЙ ЯР. 80](https://cdn.ruarxive.org/public/webcollect2022/novayagazeta2022/33771.novayagazeta.ru/33771.novayagazeta.ru.warc.gz) | 454 КБ |
| [Депутатская энциклопедия](https://cdn.ruarxive.org/public/webcollect2022/novayagazeta2022/duma.novayagazeta.ru/duma.novayagazeta.ru.warc.gz) | 319 КБ |
| [«Как меня убивали»](https://cdn.ruarxive.org/public/webcollect2022/novayagazeta2022/kniga.novayagazeta.ru/kniga.novayagazeta.ru.warc.gz) | 42 КБ |

Общий список кампаний 2021–2022 годов — в [таблице AirTable](https://airtable.com/shrO1hise7WgURXg5/tblhdXAwIv5AVtN7Y) ([#31](https://t.me/ruarxive/31)).

## Коллекция `media2022`

Карточка коллекции описывает её так: архивы изданий, которые в 2022 году блокировали, закрывали или которые могли исчезнуть сами. Хронология по каналу:

- **14.03.2022** — начата архивация «Бумаги» (paperpaper.ru): блокировка в России и риск потери домена в зоне `.ru` ([#16](https://t.me/ruarxive/16)).
- **17.03.2022** — идёт архивация Colta, TJournal, The Insider и «Бумаги»; на тот момент собрано около 50 ГБ, работа продолжалась. Сделана копия сайта DOXA ([#18](https://t.me/ruarxive/18)).
- **23.03.2022** — сохранены colta.ru, theins.ru, paperpaper.ru, agentura.ru, news.doxajournal.ru; общий объём около 100 ГБ, файлы загружались в открытое хранилище ([#23](https://t.me/ruarxive/23)).
- **25.03.2022** — начаты «Частный корреспондент» (chaskor.ru, краткая недоступность сайта) и «Троицкий вариант» (trv-science.ru; в посте — реестр иностранных агентов) ([#26](https://t.me/ruarxive/26)).
- **31.03.2022** — архивация «Троицкого варианта» ещё продолжалась ([#31](https://t.me/ruarxive/31)).
- **05.04.2022** — закончена архивация «Кабельщика» (cableman.ru) и «Новой газеты»; архивация The Bell ещё шла ([#39](https://t.me/ruarxive/39)).

У части карточек статус остался «собирается» или «не собран», хотя WARC в реестре уже есть. Ниже указан и статус карточки, и файл. Что журнал говорит о конце обхода — в следующем разделе.

### Сайты

| Издание | Файл | Объём | Дата файла | Основание |
|---|---|---|---|---|
| Regnum (regnum.ru) | [WARC](https://cdn.ruarxive.org/public/webcollect2022/media2022/regnum.ru/regnum.ru.warc.gz) | 45,6 ГБ | 13.11.2022 | 03.11.2022 в канале сказано, что содержание сайта исчезло и своей копии нет; её собирались восстанавливать из кэша поисковиков ([#81](https://t.me/ruarxive/81)). В карточке от 14.11.2022 статус «собран», инструмент wpull |
| «Бумага» (paperpaper.ru) | [WARC](https://cdn.ruarxive.org/public/webcollect2022/media2022/paperpaper.ru/paperpaper.ru.warc.gz) | 38,8 ГБ | 22.03.2022 | блокировка ([#16](https://t.me/ruarxive/16), [#23](https://t.me/ruarxive/23)) |
| The Bell (thebell.io) | [WARC](https://cdn.ruarxive.org/public/webcollect2022/media2022/thebell.io/thebell.io.warc.gz) | 28,5 ГБ | 08.04.2022 | 05.04.2022 сбор ещё шёл ([#39](https://t.me/ruarxive/39)). Карточка: редакторы в реестре иностранных агентов, статус «собирается» |
| Colta (colta.ru) | [WARC](https://cdn.ruarxive.org/public/webcollect2022/media2022/colta.ru/colta.ru.warc.gz) | 28,4 ГБ | 22.03.2022 | блокировка ([#18](https://t.me/ruarxive/18), [#23](https://t.me/ruarxive/23)) |
| The Insider (theins.ru) | [WARC](https://cdn.ruarxive.org/public/webcollect2022/media2022/theins.ru/theins.ru.warc.gz) | 25,9 ГБ | 22.03.2022 | блокировка ([#18](https://t.me/ruarxive/18), [#23](https://t.me/ruarxive/23)); нежелательная организация — см. предупреждение |
| Wonderzine (wonderzine.com) | [WARC](https://cdn.ruarxive.org/public/webcollect2022/media2022/wonderzine.com/wonderzine.com.warc.gz) | 10,2 ГБ | 12.04.2022 | карточка: блокировка в апреле 2022 года, статус «собирается» |
| «Кабельщик» (cableman.ru) | [WARC](https://cdn.ruarxive.org/public/webcollect2022/media2022/cableman.ru/cableman.ru.warc.gz) | 9,4 ГБ | 04.04.2022 | закончена к 05.04.2022 ([#39](https://t.me/ruarxive/39)); карточка: анонс закрытия сайта, статус «собирается» |
| TJournal (tjournal.ru) | [WARC](https://cdn.ruarxive.org/public/webcollect2022/media2022/tjournal.ru/tjournal.ru.warc.gz) | 7,7 ГБ | 22.03.2022 | среди заблокированных сайтов ([#18](https://t.me/ruarxive/18)); карточка: реестр иностранных агентов |
| «Троицкий вариант» (trv-science.ru) | [WARC](https://cdn.ruarxive.org/public/webcollect2022/media2022/trv-science.ru/trv-science.ru.warc.gz) | 7,3 ГБ | 01.04.2022 | начата 25.03 ([#26](https://t.me/ruarxive/26)), 31.03 ещё шла ([#31](https://t.me/ruarxive/31)); карточка: реестр иностранных агентов, статус «собирается» |
| Росбалт (rosbalt.ru) | [WARC](https://cdn.ruarxive.org/public/webcollect2022/media2022/rosbalt.ru/rosbalt.ru.warc.gz) | 7,1 ГБ | 13.11.2022 | карточка: слухи о закрытии в ноябре 2022 года. Отдельного поста в канале нет |
| «Частный корреспондент» (chaskor.ru) | [WARC](https://cdn.ruarxive.org/public/webcollect2022/media2022/chaskor.ru/chaskor.ru.warc.gz) | 5,7 ГБ | 27.03.2022 | краткая недоступность сайта ([#26](https://t.me/ruarxive/26)) |
| holod.media | [WARC](https://cdn.ruarxive.org/public/webcollect2022/media2022/holod.media/holod.media.warc.gz) | 3,3 ГБ | 11.04.2022 | карточка помечена «не собран», основание — блокировка Роскомнадзора; файл в реестре есть |
| ItsMyCity (itsmycity.ru) | [WARC](https://cdn.ruarxive.org/public/webcollect2022/media2022/itsmycity.ru/itsmycity.ru.warc.gz) | 661 МБ | 05.03.2022 | карточка: реестр иностранных агентов. Отдельного поста в канале нет |
| forbes.ru | [WARC](https://cdn.ruarxive.org/public/webcollect2022/media2022/forbes.ru/forbes.ru.warc.gz) | 483 МБ | 01.06.2022 | отдельной карточки и поста в канале нет |
| Полигон (poligon.media) | [WARC](https://cdn.ruarxive.org/public/webcollect2022/media2022/poligon.media/poligon.media.warc.gz) | 396 МБ | 26.03.2022 | карточка: реестр иностранных агентов |
| DOXA (news.doxajournal.ru) | [WARC](https://cdn.ruarxive.org/public/webcollect2022/media2022/news.doxajournal.ru/news.doxajournal.ru.warc.gz) | 113 МБ | 14.03.2022 | копия к 17.03 ([#18](https://t.me/ruarxive/18)), в списке сохранённых 23.03 ([#23](https://t.me/ruarxive/23)) |
| «Агентура» (agentura.ru) | [WARC](https://cdn.ruarxive.org/public/webcollect2022/media2022/agentura.ru/agentura.ru.warc.gz) | 85 МБ | 20.03.2022 | в списке сохранённых 23.03 ([#23](https://t.me/ruarxive/23)); карточка: реестр иностранных агентов |
| ВОС (w-o-s.ru) | [WARC](https://cdn.ruarxive.org/public/webcollect2022/media2022/w-o-s.ru/w-o-s.ru.warc.gz) | 75 МБ | 05.03.2022 | карточка: проект закрыт в 2016 году |

Каталог файлов: [`media2022`](https://cdn.ruarxive.org/public/webcollect2022/media2022/).

### Чем закончился обход

Статус в карточке и последняя строка журнала расходятся. `FINISHED` значит, что процесс wpull сам записал итог. `Forcing immediate stop` — остановка снаружи, очередь при этом не дочитана.

| Издание | Карточка | Журнал wpull |
|---|---|---|
| «Кабельщик» | собирается | 04.04.2022 06:48, FINISHED: 48 663 файла, 5,6 ГиБ, длительность 12:43:36 |
| «Троицкий вариант» | собирается | 01.04.2022 08:53, FINISHED: 28 058 файлов, 2,9 ГиБ, длительность 15:50:20 |
| holod.media | не собран | 11.04.2022 08:41, FINISHED. Последняя сессия в журнале — 2 402 файла и 282,0 МиБ за 50 минут. CDX по всему файлу длиннее, см. ниже |
| The Bell | собирается | 08.04.2022 08:17, принудительная остановка. В конце журнала путь, в который подставлен алфавит base64 |
| Wonderzine | собирается | 12.04.2022 15:42, принудительная остановка |
| forbes.ru | карточки нет | 01.06.2022 07:01, принудительная остановка |
| Regnum | собран | журнал открывает `regnum.ru.warc.gz` 05.11.2022 в 07:02 и обрывается 13.11.2022 в 19:21 |
| Росбалт | собран | принудительная остановка 13.11.2022 в 19:21, в ту же минуту, что и Regnum |
| «Агентура» | собран | 20.03.2022, FINISHED за 50 минут: 1 789 файлов, 105,9 МиБ. Ответов 200 — 1 789, из них HTML 557; ответов 404 — 1 147 |
| DOXA (news.doxajournal.ru) | собран | 14.03.2022, FINISHED за 18 минут с главной страницы: 3 093 файла, 130,4 МиБ, HTML со статусом 200 — 1 346 |
| Полигон | собран | 26.03.2022, FINISHED за 1 час 7 минут: 3 128 файлов, 413,6 МиБ. Ответов 404 в журнале 4 052, HTML со статусом 200 — 284 |
| ItsMyCity | собран | журнал начинается с главной 05.03.2022 в 15:14 и обрывается в 20:27. Ответов 200 — 3 540 |
| ВОС | собран | журнал 05.03.2022 с 12:10 до принудительной остановки в 12:37, строки FINISHED нет. HTML со статусом 200 — 1 816 |
| The Insider | собран | сохранённый журнал — 1 101 байт, только остановка 22.03.2022 в 20:26. По нему нельзя судить о WARC на 25,9 ГБ |
| «Бумага», Colta, TJournal | собран | журналы начинаются в 20:22 22.03.2022 уже с середины очереди и обрываются в 23:14 на строке Fetching, без FINISHED. В этих файлах: «Бумага» — 9 141 ответ, HTML 200 — 4 367; Colta — 21 858 ответов, все с хоста `os.colta.ru`, HTML 200 — 6 844; TJournal — 9 106 ответов, HTML 200 — 8 810 |
| «Частный корреспондент» | собран | конец журнала — FINISHED, 344 файла и 40,9 МиБ за 11 минут. WARC в той же папке — 5,7 ГБ |

В папках Regnum и Росбалта рядом с WARC лежат `metawarc.db`, `patterns.py`, `urlextract.py`, `mimes` и `exts` (файлы от 07–08.11.2022). Два `patterns.py` совпадают побайтно. Сам WARC Regnum журнал wpull открывает 05.11.2022. Первая запись CDX — `http://regnum.ru/`, 05.11.2022 04:02 UTC.

### Что видно по CDX

Индексы 2022 года имеют заголовок `CDX a b m s k S V g u`. Поля типа и кода ответа в них пустые (`-`), поэтому число ниже — число записей URL, а не число успешных страниц. Формат описан на странице [CDX](/kb/instruments/file-formats/cdx). У «Кабельщика» и The Bell дата индекса раньше даты WARC: индекс описывает промежуточный момент обхода.

| Индекс | Записей | Метки (UTC) | Что занимает объём записей |
|---|---:|---|---|
| [rosbalt.ru.cdx](https://cdn.ruarxive.org/public/webcollect2022/media2022/rosbalt.ru/rosbalt.ru.cdx) | 452 328 | 07.11.2022 12:46 – 13.11.2022 16:21 | 447 946 адресов с `.html`. Крупные разделы пути: `/main/` 155 473, `/piter/` 53 904, `/russia/` 53 601, `/moscow/` 52 942, `/world/` 45 138, `/business/` 34 502 |
| [regnum.ru.cdx](https://cdn.ruarxive.org/public/webcollect2022/media2022/regnum.ru/regnum.ru.cdx) | 520 451 | 05.11.2022 04:02 – 13.11.2022 16:17 | `/news/` 217 717, `/uploads/` 130 149, `/pdf/` 52 270, `/social/` 52 269, `/amp/` 51 933. По расширению: `.html` 222 760, `.jpg` 162 121, `.pdf` 57 560 |
| [wonderzine.com.cdx](https://cdn.ruarxive.org/public/webcollect2022/media2022/wonderzine.com/wonderzine.com.cdx) | 273 482 | 07.04.2022 15:33 – 12.04.2022 12:42 | `/users/` 183 794, материалы в `/wonderzine/` 39 500, `/tags/` 35 410 |
| [thebell.io.cdx](https://cdn.ruarxive.org/public/webcollect2022/media2022/thebell.io/thebell.io.cdx) | 223 310 | 01.04.2022 18:53 – 05.04.2022 04:23 | `/wp-json/` 161 981, в том числе oembed. Индекс от 05.04, журнал идёт до остановки 08.04 |
| [cableman.ru.cdx](https://cdn.ruarxive.org/public/webcollect2022/media2022/cableman.ru/cableman.ru.cdx) | 127 847 | 02.04.2022 05:49 – 02.04.2022 16:40 | `/sites/` 88 011, образец — `serve.php` рекламного модуля. `/content/` 19 585, `/channel/` 9 638, `/article/` 1 301. Индекс от 02.04, журнал дописан 04.04 |
| [holod.media.cdx](https://cdn.ruarxive.org/public/webcollect2022/media2022/holod.media/holod.media.cdx) | 17 002 | 10.04.2022 15:43 – 11.04.2022 05:41 | `/wp-content/` 12 260 (в основном jpg), `/person/` 551, материалы по годам: `/2022/` 516, `/2020/` 408, `/2021/` 376, `/2019/` 92 |
| [forbes.ru.cdx](https://cdn.ruarxive.org/public/webcollect2022/media2022/forbes.ru/forbes.ru.cdx) | 15 060 | 31.05.2022 08:58 – 01.06.2022 04:01 | страницы разделов; `/tegi/` 3 049. Хосты: www.forbes.ru 14 136, cdn.forbes.ru 743, 30-under-30.forbes.ru 130 |

У Росбалта уникальных URL 452 317 из 452 328, у Regnum — 518 757 из 520 451, у Wonderzine — 270 843 из 273 482. Повторных адресов в этих индексах мало.

### Telegram-каналы

Выгрузки сделаны экспортом Telegram Desktop. В канале @ruarxive эти файлы, кроме «Новой газеты», отдельно не разбирались: описание — по карточкам и реестру.

| Канал | Файл | Объём | Дата в имени файла |
|---|---|---|---|
| «Дождь» (полная выгрузка) | [ZIP](https://cdn.ruarxive.org/public/webcollect2022/media2022/tvrain_ru_telegram/tvrain.ru_telegram-2022-03-29.zip) | 78,6 ГБ | 29.03.2022 (файл в реестре изменён 11.04.2022) |
| DOXA Journal | [ZIP](https://cdn.ruarxive.org/public/webcollect2022/media2022/doxajournal.ru_telegram/doxajournal_telegram_2022-03-05.zip) | 5,0 ГБ | 05.03.2022 |
| Полигон | [ZIP](https://cdn.ruarxive.org/public/webcollect2022/media2022/poligon.media_telegram/poligon.media_telegram-2022-03-25.zip) | 2,5 ГБ | 25.03.2022 |
| «Троицкий вариант» | [ZIP](https://cdn.ruarxive.org/public/webcollect2022/media2022/trv-science.ru_telegram/trv-science-telegram_2022-03-25.zip) | 2,0 ГБ | 25.03.2022 |
| «Важные истории» (istories.media) | [ZIP](https://cdn.ruarxive.org/public/webcollect2022/media2022/istories.media_telegram/istories_media_telegram_2022-03-05.zip) | 1,9 ГБ | 05.03.2022 |
| «Дождь» (только сообщения) | [ZIP](https://cdn.ruarxive.org/public/webcollect2022/media2022/tvrain_ru_telegram_msg/tvrain.ru_telegram_msg-2022-03-08.zip) | 9,2 МБ | 08.03.2022 |

«Дождь» и «Важные истории» — нежелательные организации, см. предупреждение в начале страницы. Вещание «Дождя» в РФ прекращено в начале марта 2022 года. WARC сайта tvrain.ru в реестре от 12.12.2023 нет: сохранены только выгрузки Telegram. Карточка полной выгрузки в каталоге не заведена; карточка выгрузки сообщений указывает блокировку Роскомнадзора.

Карточка канала ТВ2 («Новости Томска и Сибири») помечена «собран» 08.03.2022: редакция анонсировала удаление канала. Ссылка в карточке ведёт в каталог [`webcollect2023/media/tv2news1-telegram/`](https://cdn.ruarxive.org/public/webcollect2023/media/tv2news1-telegram/). В реестре от 12.12.2023 этого архива нет.

## Коллекция `media`, 2013–2020

В каталоге коллекции пять карточек: rusplt.ru, old.kronvestnik.ru, inrussia.com, russlife.ru и lysova.love. В тех же папках `webcollect/media`, `webcollect2017/media`, `webcollect2018/media` и `webcollect2020/media` лежат ещё ulgrad.ru, magazines.russ.ru, rusrep.ru и vedomosti.ru. Индекс хранилища относит их к коллекции `media`. Дата в имени папки вида `домен-ГГГГ-ММ-ДД-хеш` — дата обхода; дата файла в реестре может быть датой выкладки.

| Сайт | Файл | Объём | Когда собрано |
|---|---|---:|---|
| rusplt.ru | [WARC](https://cdn.ruarxive.org/public/webcollect/media/rusplt.ru/rusplt.ru.warc) и [7z](https://cdn.ruarxive.org/public/webcollect/media/rusplt.ru/rusplt.ru.7z) | 22,0 ГБ и 6,8 ГБ | файлы 07.12.2014 и 15.12.2014 |
| ulgrad.ru | [каталог обхода](https://cdn.ruarxive.org/public/webcollect2018/media/ulgrad.ru-2018-10-01-0eb7e2f5/) | 8,3 ГБ WARC в двух частях | обход 01.10.2018, файлы в реестре от 16.01.2020 |
| magazines.russ.ru | [каталог обхода](https://cdn.ruarxive.org/public/webcollect2018/media/magazines.russ.ru-2018-10-01-eef00348/) | 5,6 ГБ WARC в двух частях | обход 01.10.2018, файлы в реестре от 16.01.2020 |
| rusrep.ru | [WARC](https://cdn.ruarxive.org/public/webcollect2020/media/rusrep.ru-suget_dnya-2020-04-12-e78a4a1e/rusrep.ru-suget_dnya-2020-04-12-e78a4a1e-00000.warc.gz) | 4,3 ГБ | 12–13.04.2020 |
| old.kronvestnik.ru | [WARC.xz](https://cdn.ruarxive.org/public/webcollect/media/old.kronvestnik.ru/old.kronvestnik.ru.warc.xz) | 4,1 ГБ | 04–06.11.2013 |
| vedomosti.ru | [WARC](https://cdn.ruarxive.org/public/webcollect2020/media/vedomosti.ru/vedomosti.ru.warc.gz) | 1,15 ГБ | файл 13.04.2020 |
| inrussia.com | [WARC](https://cdn.ruarxive.org/public/webcollect2017/media/inrussia.com-2017-08-02-3fbf5dc4/inrussia.com-2017-08-02-3fbf5dc4-00000.warc.gz) | 1,12 ГБ | 02.08.2017 |
| russlife.ru | [ZIP](https://cdn.ruarxive.org/public/webarchive/media/russlife.ru/russlife.ru.zip) | 41,4 МБ | файл 05.07.2017 |
| lysova.love | [WARC](https://cdn.ruarxive.org/public/webcollect2017/media/lysova.love-2017-05-11-f68e6dba/lysova.love-2017-05-11-f68e6dba-00000.warc.gz) | 9,3 МБ | 11.05.2017 |

Рядом с WARC rusrep.ru лежит незавершённый файл `rusrep.ru-suget_dnya-2020-04-12-e78a4a1e-00000.warc.gz~001` на 3,1 ГБ. В сумму 15 файлов WARC он не входит.

По индексам, где тип и код ответа записаны или где хватает путей:

- **old.kronvestnik.ru.** CDX формата `CDX a b a m s k r M V g u`, 119 757 записей, метки с 04.11.2013 09:03:48 по 06.11.2013 16:57:35. Код 200 — 118 676, код 404 — 1 081. JPEG — 86 653, HTML — 32 732. В путях есть номера выпусков, например `/2009/8n01p1.html` и `/2010/50n1.jpg`.
- **magazines.russ.ru.** Первая запись CDX — 01.10.2018 09:52 UTC. В индексе есть адреса выпусков, например `http://magazines.russ.ru/homo_legens/2016/3/na-ocheredi.html`.
- **rusrep.ru.** 50 948 записей, 12.04.2020 23:13 – 13.04.2020 10:31 UTC. На rusrep.ru — 31 563, остальные на других хостах (vk.com, expert.ru и другие). `/article/` — 10 667, `/images/` — 17 971.
- **inrussia.com.** 6 839 записей за 02.08.2017, с 09:39 до 11:38 UTC. 5 694 из них — изображения на `inrussia.azureedge.net`, 529 — страницы inrussia.com.
- **lysova.love.** 484 записи за одну минуту 11.05.2017, большей частью файлы в `/files/`.
- **vedomosti.ru.** Журнал в папке — сессия 13.04.2020 на 4 секунды: 3 файла, 739,3 КиБ, FINISHED. WARC в той же папке — 1,15 ГБ.

Папки ulgrad.ru и magazines.russ.ru устроены как обход wpull: внутри `wpull.log`, `wpull.db`, файлы `id` и `concurrency`.

## Чего в реестре от 12.12.2023 нет

- **polit.ru.** 14.04.2024 Роскомнадзор заблокировал издание, и Ruarxive начал архивацию на случай исчезновения сайта ([#125](https://t.me/ruarxive/125)). Готовой ссылки на файл в канале нет, в реестре от 12.12.2023 файла нет: кампания позже этой выгрузки.
- **znak.com.** Сайт закрылся одномоментно в марте 2022 года ([#5](https://t.me/ruarxive/5), [#81](https://t.me/ruarxive/81)). В реестре файла нет.
- **discours.io** и **the-village.ru.** Карточки есть, статус «не собран», основание — блокировка Роскомнадзора. WARC в реестре нет.

Кампании, у которых в канале есть повод и нет файла в этом реестре, не стоит описывать как готовый архив. polit.ru после блокировки 14 апреля 2024 года только начат ([#125](https://t.me/ruarxive/125)). У REGNUM на 3 ноября 2022 года своей копии не было: содержание сайта уже исчезло, восстановление собирались делать из кэша поисковых систем ([#81](https://t.me/ruarxive/81)). «Бумага», Colta, The Insider, DOXA и «Агентура» в постах марта 2022 года названы среди сохранённых сайтов кампании; их карточки ищут в [таблице плана](/kb/preserved-projects-table), а не в этом списке пробелов.

## Как собирались архивы

- **Сайты 2022 года** — в WARC инструментом wpull (так указано в карточках, и так подписаны журналы). Такие файлы открываются в [ReplayWeb.page](/kb/instruments/replay/replayweb-page) ([#5](https://t.me/ruarxive/5), [#60](https://t.me/ruarxive/60)).
- **Telegram-каналы** — экспорт данных Telegram Desktop ([#6](https://t.me/ruarxive/6)).
- В посте [#32](https://t.me/ruarxive/32) paperpaper.ru и agentura.ru приведены как примеры сайтов на WordPress. WARC в карточках этих сайтов собраны wpull. Для выгрузки WordPress через REST API позже опубликована утилита [wparc](/kb/instruments/ruarxive-tools/wparc).

Индексы CDX 2022 года не заменяют журнал: в них нет кода ответа. Журнал, наоборот, часто хранит только хвост или последнюю сессию. Объём WARC, строка `Downloaded` и число записей CDX отвечают на разные вопросы.

Инструменты для самостоятельной архивации — в разделах [Инструменты](/kb/instruments) и [Гайды](/kb/guides).

## Что ещё нужно сохранить

Если вы знаете о СМИ, чей архив критически важен и пропущен в коллекции, сообщите через [форму предложения проекта](/kb/preserved-projects-form) или в чат [@ruarxivechat](https://t.me/ruarxivechat). Если у вас есть собственная копия исчезнувшего сайта, её тоже можно передать в архив ([#81](https://t.me/ruarxive/81)).

## Связанные разделы

- [Эхо Москвы](/kb/projects/echomsk) — крупнейший медиаархив проекта.
- [Где искать архивы закрытых СМИ](/kb/similar/russian-independent-media-archives) — Wayback Machine и другие веб-архивы.
- [Консервированное государство](/kb/projects/preserved-government) — архивы государственных органов.
- [Таблица сохранённых проектов](/kb/preserved-projects-table) — общий реестр.
- [Экстренная архивация](/kb/guides/emergency-archiving) — что делать, когда сайт закрывается в течение часов.
- [CDX](/kb/instruments/file-formats/cdx) — как читать индекс, не скачивая WARC.
- [Правовые и этические вопросы](/kb/legal).
