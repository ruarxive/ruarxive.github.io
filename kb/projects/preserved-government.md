---
sidebar_position: 3
title: Консервированное государство
description: "Состав архива сайтов и аккаунтов органов власти РФ: коллекции хранилища Ruarxive, крупнейшие сайты, повторные сборы 2014–2023 годов и кампании по публикациям канала."
last_update:
  date: 2026-10-14
---

# Консервированное государство

В России нет государственного веб-архива и нет требований к обязательному долгосрочному сохранению официальных сайтов и аккаунтов органов власти. Отдельные ведомства сохраняют архивы своих предшественников — например, Банк России давал доступ к архивам сайтов поглощённых им структур с 2003 года ([снимок раздела 2015 года](https://web.archive.org/web/20150526192453/http://cbr.ru/finmarkets/?PrtId=archive)), — но это скорее исключение: при реорганизациях, смене платформы или дизайна старые сайты обычно исчезают без архивации ([@begtin, 03.05.2016](https://t.me/begtin/168); [@begtin, 24.01.2017](https://t.me/begtin/402)).

С начала 2010-х годов Иван Бегтин вёл эту работу как проект «Архивация государства» — «один из наименее публичных проектов Инфокультуры», «уже более 5 лет» к январю 2017 года ([@begtin, 24.01.2017](https://t.me/begtin/402)). С марта 2022 года она продолжается в рамках Ruarxive. Сейчас архивируются:

- официальные аккаунты в социальных сетях;
- официальные сайты;
- исторические данные — ключевые документы и базы данных.

Примеры исчезновения сайтов (ФМС, ФСКН, региональные сайты МВД, банки) и их источники разобраны в кейсе [«Исчезновение сайтов государственных органов»](/kb/case-studies/government-websites-disappearing), свежие случаи — в реестре [«Исчезающие российские ресурсы»](/kb/case-studies/russia-resources-disappearing). Конкретный домен из хранилища ищется на [главной странице](/#search).

Сборы ложились в папки по сезонам:

- **2014–2015.** Арбитражные суды (`arbitr`, июль 2014 — апрель 2015), ранние копии правоохранительных сайтов (`lawenf`, с января 2014), «Открытое правительство» (`opengov`, апрель–декабрь 2015), старые сайты подмосковных ведомств (`mosreg`, февраль–март 2014).
- **май–сентябрь 2016.** Территориальные сайты ФСКН и Росфиннадзора; 15.05.2016 на hubofdata опубликована группа правоохранительных архивов ([@begtin, 15.05.2016](https://t.me/begtin/171)).
- **апрель–сентябрь 2017.** Основной массив `webcollect2017`: Администрация Президента, Госдума, МВД, правительство Москвы, Роспотребнадзор, прокуратура, таможня, федеральные целевые программы, Минэкономразвития. 15.12.2023 этот сбор назван образцом кампании перед сменой Правительства — «сбор 2017 года перед сменой Правительства 2018 года» ([#112](https://t.me/ruarxive/112)).
- **2018 — январь 2020.** `gov2018`, территориальные органы Росстата (`gks2018`), `gov2019`, `gov2020`.
- **2021.** `gov2021` (август) и сайты Роснано (ноябрь).
- **2022–2023.** Папка `government`, комитеты Госдумы, порталы открытых данных, сайты ИКМО, Ростуризм. Кампании этих лет — в разделе «Кампании по публикациям канала» и в [планах архивации](/kb/archive-plans).

## Что лежит в хранилище

Цифры ниже — по спискам файлов, собранным в каталоге [ruarxive-db](https://github.com/ruarxive/ruarxive-db) (экспорт для сайта от 12.10.2026). ГБ в таблице — сумма размеров файлов в байтах, делённая на 10⁹; ТБ — на 10¹². Так же посчитаны 147,7 ГБ коллекции банков. Для папок `webcollect` и `webcollect2017` список от 13.12.2025, для `webcollect2018`–`webcollect2023` и `dataportals` — реестр [`allarchives.csv`](https://cdn.ruarxive.org/public/allarchives.csv) от 12.12.2023. Это нижняя оценка: папки `webcollect2024` и `webcollect2025` в списки не входят. Дата файла — дата изменения в хранилище, она может отличаться от даты сбора. У многих папок 2017–2020 годов в имени есть суффикс `-ГГГГ-ММ-ДД-<8 hex>`. Иногда он и дата файла расходятся: у территориальных органов Росстата в имени папки стоит `2018-12-26`, а файлы в индексе датированы 17–18.01.2020. «Ресурс» здесь — домен или хост в индексе. В это число попадают и служебные имена вроде `nohup`.

Число файлов больше числа WARC: в него входят CDX, журналы и базы обхода. В папках 2017–2023 годов рядом с `warc.gz` лежит база [wpull](/kb/instruments/tools/wpull): в сборах 2017–2020 годов это `wpull.db`, в сборах 2021–2023 годов — `sitearchive-<хост>.db`. В `moscowgov` на сами WARC приходится 997 ГБ из 1,1 ТБ, на базы обхода — 31,2 ГБ. В папках до 2017 года у одного сайта часто две копии: WARC (`warc.gz` или `warc.xz`) и упакованный каталог `.7z`. Так устроены `fskn` (49 файлов `warc.gz`, 44,9 ГБ, и 47 файлов `.7z`, 37,1 ГБ), `lawenf` и `arbitr`. В [webcollect/gov](https://cdn.ruarxive.org/public/webcollect/gov/) кроме архивов лежат 3 462 файла `.doc` и 642 файла `.xls`, вместе 0,96 ГБ.

| Коллекция | Объём | Ресурсов | Файлов | Даты файлов | Папка |
|---|---:|---:|---:|---|---|
| Государственные сайты (`gov`) | 2,6 ТБ | 196 | 7 154 | 05.06.2009–16.09.2023 | [webcollect/gov](https://cdn.ruarxive.org/public/webcollect/gov/), [webcollect2017/gov](https://cdn.ruarxive.org/public/webcollect2017/gov/), [webcollect2023/gov](https://cdn.ruarxive.org/public/webcollect2023/gov/) |
| Правительство Москвы (`moscowgov`) | 1,1 ТБ | 183 | 4 019 | 27.06.2017–21.09.2017 | [moscowgov](https://cdn.ruarxive.org/public/webcollect2017/moscowgov/) |
| Сбор 2020 года (`gov2020`) | 822 ГБ | 33 | 598 | 16.01.2020–02.12.2023 | [gov2020](https://cdn.ruarxive.org/public/webcollect2020/gov2020/) |
| Сбор 2018 года (`gov2018`) | 796 ГБ | 253 | 5 707 | 26.03.2018–18.01.2020 | [gov2018](https://cdn.ruarxive.org/public/webcollect2018/gov2018/) |
| МВД (`mvd`) | 632 ГБ | 9 | 306 | 04.07.2017–02.08.2017 | [mvd](https://cdn.ruarxive.org/public/webcollect2017/mvd/) |
| `ikmo` | 582 ГБ | 19 | 113 | 14.03.2023–19.04.2023 | [ikmo](https://cdn.ruarxive.org/public/webcollect2023/ikmo/) |
| Администрация Президента (`kremlin`) | 384 ГБ | 9 | 236 | 02.05.2017–04.05.2017 | [kremlin](https://cdn.ruarxive.org/public/webcollect2017/kremlin/) |
| Государственная Дума (`duma`) | 366 ГБ | 61 | 1 116 | 01.01.2013–10.04.2022 | [duma, 2017](https://cdn.ruarxive.org/public/webcollect2017/duma/), [duma, 2022](https://cdn.ruarxive.org/public/webcollect2022/duma/) |
| Сбор 2021 года (`gov2021`) | 234 ГБ | 23 | 90 | 04.04.2021–11.12.2021 | [gov2021](https://cdn.ruarxive.org/public/webcollect2021/gov2021/) |
| Сбор 2022 года (`government`) | 188 ГБ | 53 | 229 | 20.04.2019–01.12.2022 | [government](https://cdn.ruarxive.org/public/webcollect2022/government/) |
| Роспотребнадзор (`rospotrebnadzor`) | 186 ГБ | 176 | 3 604 | 09.05.2017–15.05.2017 | [rospotrebnadzor](https://cdn.ruarxive.org/public/webcollect2017/rospotrebnadzor/) |
| Территориальные органы Росстата (`gks2018`) | 179 ГБ | 119 | 2 668 | 17.01.2020–18.01.2020 | [gks2018](https://cdn.ruarxive.org/public/webcollect2018/gks2018/) |
| Прокуратура (`prok`) | 129 ГБ | 122 | 2 583 | 03.04.2017–30.12.2020 | [prok](https://cdn.ruarxive.org/public/webcollect2017/prok/) |
| Государственные проекты (`govprojects`) | 127 ГБ | 19 | 346 | 30.04.2017–29.07.2017 | [govprojects](https://cdn.ruarxive.org/public/webcollect2017/govprojects/) |
| Таможенная служба (`customs`) | 113 ГБ | 41 | 821 | 04.05.2017–12.05.2017 | [customs](https://cdn.ruarxive.org/public/webcollect2017/customs/) |
| Федеральные целевые программы (`fcp`) | 87,6 ГБ | 19 | 354 | 09.05.2017–11.05.2017 | [fcp](https://cdn.ruarxive.org/public/webcollect2017/fcp/) |
| ФСКН (`fskn`) | 82,5 ГБ | 49 | 239 | 31.05.2016–28.09.2016 | [fskn](https://cdn.ruarxive.org/public/webcollect/fskn/) |
| Минэкономразвития (`fedmineconom`) | 77,9 ГБ | 22 | 415 | 09.08.2017–20.08.2017 | [fedmineconom](https://cdn.ruarxive.org/public/webcollect2017/fedmineconom/) |
| Правоохранительные органы (`lawenf`) | 55,8 ГБ | 26 | 115 | 21.01.2014–15.05.2016 | [lawenf](https://cdn.ruarxive.org/public/webcollect/lawenf/) |
| Арбитражные суды (`arbitr`) | 53,7 ГБ | 65 | 331 | 31.07.2014–12.04.2015 | [arbitr](https://cdn.ruarxive.org/public/webcollect/arbitr/) |
| Росфиннадзор (`rosfinnadzor`) | 35,7 ГБ | 90 | 430 | 25.04.2016–06.05.2016 | [rosfinnadzor](https://cdn.ruarxive.org/public/webcollect/rosfinnadzor/) |
| Роснано, 2021 (`rusnano2021`) | 11,2 ГБ | 8 | 29 | 28.11.2021–29.11.2021 | [rusnano2021](https://cdn.ruarxive.org/public/webcollect2021/rusnano2021/) |

У нескольких коллекций имя папки описывает состав только частично:

- **`gov`.** По папкам объём распределён так: [webcollect/gov](https://cdn.ruarxive.org/public/webcollect/gov/) — 860 ГБ и 114 ресурсов (в том числе pfrf.ru, 133 ГБ, и fss.ru, 57,2 ГБ), [webcollect2017/gov](https://cdn.ruarxive.org/public/webcollect2017/gov/) — 398 ГБ и 63 ресурса, [webcollect2023/gov](https://cdn.ruarxive.org/public/webcollect2023/gov/) — 6,6 ГБ. Ещё около 1,3 ТБ в индексе записаны без пути к папке; крупнейшие среди них — minenergo.gov.ru (793 ГБ), mcx.ru (256 ГБ), minfin.ru (119 ГБ) и nalog.ru (62,4 ГБ).
- **`gov2018`.** Крупнейшие ресурсы — archive.government.ru (221 ГБ) и government.ru (199 ГБ). 178 из 253 ресурсов — территориальные поддомены sledcom.ru, вместе 97 ГБ.
- **`gov2020`.** Крупнейший ресурс — minenergo.gov.ru (307 ГБ). Имена папок федеральных сайтов января 2020 года — 16–20.01.2020: рядом mcx.ru (83,7 ГБ), government.ru (64,8 ГБ), minvr.ru (38,5 ГБ), www.minfin.ru (38,1 ГБ) и мвд.рф (35,0 ГБ). В той же коллекции cbr.ru (40,2 ГБ, дата файла 01.01.2021) и ac.gov.ru (14,7 ГБ, 22–23.11.2020). Дата 02.12.2023 в сводной таблице — у файлов portal.eskigov.ru и nfap.eskigov.ru; в имени их папки стоит `2020-12-11`.
- **`gov2021`.** 23 ресурса. Крупнейшие файлы — август 2021 года: digital.gov.ru (52,6 ГБ, 16–18.08.2021), roszdravnadzor.gov.ru (43,7 ГБ), government.ru (23,3 ГБ), council.gov.ru (20,9 ГБ) и fsin.gov.ru (15,2 ГБ). Дата 04.04.2021 в сводной таблице — у сайтов Центра стратегических разработок (csr.ru и поддомены). rs.gov.ru (14,2 ГБ) датирован 09.12.2021.
- **`mvd`.** Основной объём — мвд.рф (417 ГБ) и www.gibdd.ru (144 ГБ). Дальше идут поддомены того же домена: гут.мвд.рф (25,5 ГБ), ос.мвд.рф (16,1 ГБ), ветеран.мвд.рф (16,1 ГБ), дгск.мвд.рф (7,6 ГБ). Файл www.mvd.ru в этой папке — 107 КБ.
- **`kremlin`.** Почти весь объём — kremlin.ru (382 ГБ). В тот же заход 02.05.2017 сняты blog.kremlin.ru (1,1 ГБ), putin.kremlin.ru (947 МБ), letters.kremlin.ru, flag.kremlin.ru, constitution.kremlin.ru, tours.kremlin.ru и kids.kremlin.ru. Более ранняя копия kremlin.ru, 41,3 ГБ, лежит в `gov`, даты файлов 08–13.04.2015.
- **`duma`.** Папка 2017 года — 263 ГБ. Крупнейший ресурс — portal.parliament.gov.ru (198,7 ГБ, 21–22.05.2017); рядом www.newparlament.ru (29,6 ГБ), www.pnp.ru (7,1 ГБ) и vote.duma.gov.ru (6,9 ГБ, 20–23.04.2017). Папка 2022 года — 14 хостов и 102 ГБ, даты файлов 09–10.04.2022; крупнейший — komitet3.km.duma.gov.ru (55,7 ГБ).
- **`government`.** Крупнейший ресурс — pfr.gov.ru, 55,1 ГБ, дата файла 20.04.2019. Поддомены fss.ru в этой папке датированы 19.02.2022–15.07.2022 и по объёму невелики. Отдельная группа файлов датирована 18–22.02.2022: erdc.ru (19,1 ГБ), old.rosim.ru (18,1 ГБ), public.fsrar.ru (14,6 ГБ), rosreestr.gov.ru (12,0 ГБ), rosim.gov.ru (9,5 ГБ). Сайт Росавиации favt.gov.ru (15,8 ГБ, дата файла 01.04.2022) начат 31.03.2022 ([#31](https://t.me/ruarxive/31)).
- **`fedmineconom`.** В папке есть aisup.economy.gov.ru от 09.08.2017: 35,9 ГБ в снимке хранилища. В публикации [#155](https://t.me/ruarxive/155) (22.04.2025) та же копия названа «33 ГБ WARC». Следующие по объёму — www.nko.economy.gov.ru (20,2 ГБ) и irfaip.economy.gov.ru (15,3 ГБ).
- **`rusnano2021`.** В снимке 8 доменов и 11,2 ГБ: edunano.ru (4,4 ГБ), www.rusnano.com (2,0 ГБ), schoolnano.ru (1,9 ГБ), fiop.site (1,8 ГБ), startbase.ru, en.rusnano.com, thesaurus.rusnano.com, nanocertifica.ru. В публикации [#110](https://t.me/ruarxive/110) (04.10.2023) — 9 сайтов в формате WARC. Девятый хост, `rusnano-dmm.ru`, есть в папке на CDN и в этот снимок не входит. Подробнее — [кампании 2021 года](/kb/case-studies/memorial-rusnano-2021).
- **`ikmo`.** Папка сбора марта–апреля 2023 года по кампании сайтов избирательных комиссий муниципальных образований ([#63](https://t.me/ruarxive/63)). На старте кампании был список из 144 ресурсов. В снимке — 19 хостов и 582 ГБ. По имени хоста к избирательным комиссиям относятся izbirkom.sochi.ru (0,80 ГБ) и izbirkom.admkrsk.ru (0,30 ГБ). Основной объём — сайты муниципальных образований: amursk.ru (391 ГБ), dumast.ru (128 ГБ), vgmik.ru (20,5 ГБ), minusinsk.info (14,9 ГБ).
- **`lawenf`.** На хабе открытых данных эта группа описана 15.05.2016 как четыре сайта ([@begtin, 15.05.2016](https://t.me/begtin/171)). В хранилище коллекция шире: 26 ресурсов, в том числе 92.fms.gov.ru (5,1 ГБ), www.fskn.gov.ru (6,5 ГБ, 04–06.05.2016), vvmvd.ru (копии от 21.01.2014 и 08.05.2016) и 112.ru. Территориальные сайты ФСКН собраны отдельно, в коллекции `fskn`.
- **`govprojects`.** 87,0 ГБ из 127 — publication.pravo.gov.ru (29.06–29.07.2017). Дальше torgi.gov.ru (29,9 ГБ, 03–04.05.2017).

### Крупнейшие сайты

В таблице — ресурсы от 50 ГБ. Один и тот же сайт стоит столько раз, сколько отдельных сборов есть в индексе. Даты — даты файлов.

| Сайт | Объём | Коллекция | Даты файлов |
|---|---:|---|---|
| minenergo.gov.ru | 793 ГБ | `gov` | 28.12.2015–07.04.2017 |
| мвд.рф | 417 ГБ | `mvd` | 04.07.2017–02.08.2017 |
| amursk.ru | 391 ГБ | `ikmo` | 19.04.2023 |
| kremlin.ru | 382 ГБ | `kremlin` | 02.05.2017–04.05.2017 |
| minenergo.gov.ru | 307 ГБ | `gov2020` | 20.01.2020–22.01.2020 |
| mcx.ru | 256 ГБ | `gov` | 01.07.2016–07.04.2017 |
| archive.government.ru | 221 ГБ | `gov2018` | 26.03.2018–11.01.2020 |
| government.ru | 199 ГБ | `gov2018` | 26.03.2018–18.01.2020 |
| portal.parliament.gov.ru | 198,7 ГБ | `duma` | 21.05.2017–22.05.2017 |
| duma.mos.ru | 167,5 ГБ | `moscowgov` | 20.08.2017–26.08.2017 |
| www.gibdd.ru | 144 ГБ | `mvd` | 04.07.2017–29.07.2017 |
| pfrf.ru | 133 ГБ | `gov` | 05.06.2009–03.04.2017 |
| dumast.ru | 128 ГБ | `ikmo` | 19.04.2023 |
| gorod.mos.ru | 121,7 ГБ | `moscowgov` | 27.06.2017–28.06.2017 |
| minfin.ru | 119 ГБ | `gov` | 13.01.2015–04.06.2017 |
| spetsstroy.ru | 116,8 ГБ | `gov` | 27.12.2016–20.03.2017 |
| fas.gov.ru | 99,4 ГБ | `gov` | 04.04.2017–05.04.2017 |
| www.rosavtodor.ru | 98,8 ГБ | `gov` | 05.04.2017 |
| stroi.mos.ru | 93,6 ГБ | `moscowgov` | 20.08.2017–26.08.2017 |
| publication.pravo.gov.ru | 87,0 ГБ | `govprojects` | 29.06.2017–29.07.2017 |
| mcx.ru | 83,7 ГБ | `gov2020` | 20.01.2020–22.01.2020 |
| минобрнауки.рф | 73,2 ГБ | `gov2018` | 08.05.2018–10.01.2020 |
| government.ru | 64,8 ГБ | `gov2020` | 16.01.2020–22.01.2020 |
| nalog.ru | 62,4 ГБ | `gov` | 21.06.2016–30.04.2017 |
| data.gov.ru | 58,4 ГБ | `gov` | 21.02.2017–28.04.2017 |
| economy.gov.ru | 58,2 ГБ | `gov` | 13.01.2015–23.01.2015 |
| fss.ru | 57,2 ГБ | `gov` | 29.03.2017–30.03.2017 |
| komitet3.km.duma.gov.ru | 55,7 ГБ | `duma` | 09.04.2022–10.04.2022 |
| pfr.gov.ru | 55,1 ГБ | `government` | 20.04.2019–03.09.2022 |
| solutions.fas.gov.ru | 53,1 ГБ | `gov` | 13.03.2017 |
| minsvyaz.ru | 53,0 ГБ | `gov2018` | 17.01.2020–18.01.2020 |
| digital.gov.ru | 52,6 ГБ | `gov2021` | 16.08.2021–18.08.2021 |

У minsvyaz.ru и у копии mcx.ru в `gov2018` (48,0 ГБ) в имени папки стоит `2018-05-18`, а дата файлов в индексе — 17–18.01.2020.

### Одни и те же сайты в разных сборах

| Сайт | Что есть в индексе |
|---|---|
| government.ru | 4,6 ГБ в `gov` (01–02.05.2017); 199 ГБ в `gov2018`; 64,8 ГБ в `gov2020`; 23,3 ГБ в `gov2021` (15–16.08.2021) |
| minenergo.gov.ru | 793 ГБ в `gov`; 307 ГБ в `gov2020` |
| mcx.ru | 256 ГБ в `gov`; 48,0 ГБ в `gov2018`; 83,7 ГБ в `gov2020` |
| мвд.рф | 417 ГБ в `mvd` (июль–август 2017); 35,0 ГБ в `gov2020` |
| kremlin.ru | 41,3 ГБ в `gov` (апрель 2015); 382 ГБ в `kremlin` (май 2017) |
| open.gov.ru | 7,0 ГБ в `opengov` (25.09–07.12.2015); 8,8 ГБ в `opengov2017` (19.02.2017); 15,9 ГБ в `gov2018`; 7,8 ГБ в `opengov2019` (в имени папки `2019-03-29`, файлы до 10.01.2020) |
| minsport.gov.ru | www.minsport.gov.ru, 9,1 ГБ, в `gov` (05.04.2017); 2,2 ГБ в `gov2019` (в имени папки `2019-04-08`); 23,1 ГБ в `gov2020` (17–23.01.2020) |
| data.gov.ru | 0,88 ГБ в коллекции `data` (20.09–30.11.2014); 58,4 ГБ в `gov` (весна 2017); 15,0 ГБ в `dataportals` (файл 02.02.2022) |
| data.mos.ru | 16,1 ГБ в коллекции `data` (07.10–30.11.2014); 3,9 ГБ в `opengov2017` (21–22.02.2017); 6,0 ГБ в `dataportals` (папка `2021-07-01`, дата файла 11.04.2022) |
| Пенсионный фонд | pfrf.ru, 133 ГБ, в `gov` (файлы с 05.06.2009); pfr.gov.ru, 55,1 ГБ, в `government` (файл с 20.04.2019) |

### Территориальные сети

У нескольких коллекций основной объём — сеть поддоменов одного ведомства:

- **Роспотребнадзор.** 84 из 176 ресурсов — поддомены вида `16.rospotrebnadzor.ru`, вместе 161,7 ГБ. Крупнейший — 16.rospotrebnadzor.ru, 11,4 ГБ. Даты файлов 09–15.05.2017.
- **Следственный комитет.** В `gov2018` 178 из 253 ресурсов — поддомены sledcom.ru, вместе 97 ГБ. Крупнейшие — tver.sledcom.ru (27,7 ГБ) и nnovgorod.sledcom.ru (12,5 ГБ).
- **Росстат.** В `gks2018` все 119 ресурсов — хосты на gks.ru. www.gks.ru — 25,4 ГБ, дальше сайты территориальных органов примерно по 3–6 ГБ.
- **Прокуратура.** 122 ресурса, www.genproc.gov.ru — 25,4 ГБ (даты файлов 06.04.2017–30.12.2020). Остальные — региональные прокуратуры, в основном апрель–май 2017 года. Крупнейший региональный сайт — www.samproc.ru, 18,2 ГБ.
- **Таможня.** 38 хостов на customs.ru, 10–12.05.2017. Крупнейшие — customs.ru (20,6 ГБ), www.customs.ru (17,0 ГБ), search.customs.ru (16,9 ГБ) и service.customs.ru (16,6 ГБ), затем региональные управления.
- **ФСКН.** 49 ресурсов, 31.05–28.09.2016. Крупнейший — fskn.rkomi.ru, 42,2 ГБ.
- **Росфиннадзор.** 85 из 90 ресурсов — поддомены вида `r52.rosfinnadzor.ru`, 25.04–06.05.2016. У крупнейших около 0,6 ГБ.
- **Роструд.** 83 из 89 ресурсов — поддомены `gitNN.rostrud.ru`, вместе 15,8 ГБ из 15,9 ГБ. Даты файлов 15.05–18.06.2017, в имени папки — `2017-06-07`.
- **Арбитражные суды.** 64 из 65 ресурсов заканчиваются на arbitr.ru. www.arbitr.ru — 13,6 ГБ, даты файлов 06.08.2014–12.04.2015.
- **Правительство Москвы.** 180 из 183 ресурсов — поддомены mos.ru, 1 050 ГБ из 1,1 ТБ. Крупнейшие — duma.mos.ru, gorod.mos.ru, stroi.mos.ru и tender.mos.ru (39,9 ГБ). Даты файлов 27.06–21.09.2017.

### Другие коллекции госорганов

Эти папки меньше таблицы в начале раздела или лежат отдельным кодом. Объём и даты — из того же экспорта от 12.10.2026. Названия — из каталога коллекций [ruarxive-db](https://github.com/ruarxive/ruarxive-db).

| Коллекция | Объём | Ресурсов | Даты файлов | Крупнейшее в папке | Папка |
|---|---:|---:|---|---|---|
| Сбор 2019 года (`gov2019`) | 41,1 ГБ | 5 | 16.01.2020–16.12.2020 | www.mnr.gov.ru, 26,3 ГБ; www.mintrans.ru, 7,7 ГБ. В имени папки — `2019-04-08` | [gov2019](https://cdn.ruarxive.org/public/webcollect2019/gov2019/) |
| Общественная палата (`oprf`) | 37,6 ГБ | 20 | 07.05.2017–09.05.2017 | oprf.ru, 13,1 ГБ, и форумтаврида.рф, 13,2 ГБ | [oprf](https://cdn.ruarxive.org/public/webcollect2017/oprf/) |
| АИЖК (`aizhk`) | 34,0 ГБ | 23 | 09.05.2017–14.05.2017 | дом.рф, 28,2 ГБ; остальные — поддомены ahml.ru | [aizhk](https://cdn.ruarxive.org/public/webcollect2017/aizhk/) |
| Государственные советы (`govcouncils`) | 33,2 ГБ | 9 | 02.06.2017 | i-russia.ru, 19,8 ГБ; president-sovet.ru, 10,4 ГБ | [govcouncils](https://cdn.ruarxive.org/public/webcollect2017/govcouncils/) |
| Выборы (`elections`) | 32,9 ГБ | 5 | 24.12.2015–28.09.2016 | копия cikrf.ru от 28.05.2016, 23,5 ГБ; копия от 24.12.2015, 8,5 ГБ. Рядом — gd2003.cikrf.ru и pr2004.cikrf.ru | [elections](https://cdn.ruarxive.org/public/webcollect/elections/) |
| Старые сайты Подмосковья (`mosreg2014`) | 32,5 ГБ | 70 | 06.05.2017 | old.mst.mosreg.ru. WARC и распакованная копия одного сайта в индексе — два ресурса | [mosreg2014](https://cdn.ruarxive.org/public/webcollect/mosreg2014/) |
| Открытое правительство, 2017 (`opengov2017`) | 29,9 ГБ | 32 | 06.02.2017–16.03.2017 | data.mosreg.ru, 10,6 ГБ; open.gov.ru, 8,8 ГБ; data.mos.ru, 3,9 ГБ | [opengov2017](https://cdn.ruarxive.org/public/webcollect/opengov2017/) |
| Минфин (`minfin`) | 25,0 ГБ | 12 | 09.05.2017–06.07.2017 | old.minfin.ru, 24,4 ГБ (15–16.05.2017) | [minfin](https://cdn.ruarxive.org/public/webcollect2017/minfin/) |
| ФСРАР (`fsrar`) | 25,2 ГБ | 18 | 01.06.2017 | региональные поддомены и public.fsrar.ru, 4,0 ГБ | [fsrar](https://cdn.ruarxive.org/public/webcollect2017/fsrar/) |
| Государственные предприятия (`goventerprises`) | 20,2 ГБ | 4 | 28.06.2017–10.07.2017 | www.rfbr.ru, 11,3 ГБ; frprf.ru, 4,8 ГБ; рнф.рф, 3,8 ГБ; fpi.gov.ru, 303 МБ | [goventerprises](https://cdn.ruarxive.org/public/webcollect2017/goventerprises/) |
| Роструд (`rostrud`) | 15,9 ГБ | 89 | 15.05.2017–18.06.2017 | инспекции `gitNN.rostrud.ru` | [rostrud](https://cdn.ruarxive.org/public/webcollect2017/rostrud/) |
| Муниципальные выборы в Москве (`mosmunelect`) | 11,2 ГБ | 53 | 07.09.2017–08.09.2017 | yasenevo2.info, 7,2 ГБ | [mosmunelect](https://cdn.ruarxive.org/public/webcollect2017/mosmunelect/) |
| Минкомсвязь (`minsvyaz`) | 10,6 ГБ | 17 | 23.04.2017–24.04.2017 | forum.minsvyaz.ru, 4,9 ГБ; do.gosuslugi.ru, 2,6 ГБ; reestr.minsvyaz.ru, 1,5 ГБ | [minsvyaz](https://cdn.ruarxive.org/public/webcollect2017/minsvyaz/) |
| Открытое правительство, 2019 (`opengov2019`) | 7,8 ГБ | 2 | 29.03.2019–10.01.2020 | open.gov.ru, 7,8 ГБ | [opengov2019](https://cdn.ruarxive.org/public/webcollect2019/opengov2019/) |
| Совет Федерации (`sovfed`) | 7,6 ГБ | 24 | 07.05.2017–10.05.2017 | archiv.council.gov.ru, 6,4 ГБ; www.council.gov.ru, 649 МБ | [sovfed](https://cdn.ruarxive.org/public/webcollect2017/sovfed/) |
| Открытое правительство (`opengov`) | 7,2 ГБ | 7 | 03.04.2015–08.12.2015 | open.gov.ru, 7,0 ГБ | [opengov](https://cdn.ruarxive.org/public/webcollect/opengov/) |
| Подмосковье, 2014 (`mosreg`) | 6,1 ГБ | 5 | 22.02.2014–02.03.2014 | old.guag.mosreg.ru, 2,9 ГБ; old.mosreg.ru, 2,0 ГБ | [mosreg](https://cdn.ruarxive.org/public/webcollect/mosreg/) |
| Суды (`sud`) | 4,2 ГБ | 98 | 30.04.2017–03.06.2017 | cdep.ru, 539 МБ; дальше сайты квалификационных коллегий на vkks.ru | [sud](https://cdn.ruarxive.org/public/webcollect2017/sud/) |
| Финансовый комитет Петербурга (`spbgov`) | 4,2 ГБ | 1 | 20.09.2017–22.09.2017 | old.fincom.gov.spb.ru | [spbgov](https://cdn.ruarxive.org/public/webcollect2017/spbgov/old.fincom.gov.spb.ru-2017-09-20-8c95ed4f/) |

### Как эти цифры соотносятся с публикациями

24.01.2017 Иван Бегтин описывал архив целиком: 1,4 ТБ веб-архивов (около 15 ТБ в распакованном виде), в том числе около 500 сайтов органов власти, 345 сайтов банков и сайты региональных арбитражных судов ([@begtin, 24.01.2017](https://t.me/begtin/402)). Эта оценка относится к январю 2017 года и ко всему архиву сразу. Таблица выше считает отдельные коллекции по более поздним спискам файлов.

Опубликованные цифры отдельных кампаний собраны на странице [«Статистика: снимок»](/kb/resources/stats-snapshot). Ниже — те же кампании с тем, что видно по папкам хранилища.

## Аккаунты в социальных сетях

- **Instagram.** Сохранены данные 171 аккаунта официальных лиц и политиков РФ (28.03.2022, [#27](https://t.me/ruarxive/27)). Список аккаунтов собирался вместе с проектом «Декларатор» ([#34](https://t.me/ruarxive/34)). Код архивации и список — в [репозитории](https://github.com/ruarxive/rugovinstagrams), итоговые данные — в [архиве](https://cdn.ruarxive.org/public/webcollect2022/govinst2022/_govinstagrams_20220325.zip) объёмом 1,4 ГБ. Полностью сохранены сообщения и метаданные, изображения и видео — ограниченно. Если вы готовы помочь собрать медиаконтент, см. [задачи для волонтёров](/kb/volunteers/volunteers-tasks).
- **Twitter.** [Список официальных аккаунтов](https://docs.google.com/spreadsheet/ccc?key=0AphaFpvgzsyhdEs4U2d5RHh0eFN0UFRCR2xJbkZ0OVE&usp=sharing) (Google Sheets); база данных [«Архивы государственных твиттеров»](http://hubofdata.ru/dataset/govtwitters-archives) и группа [«Архивы государственных микроблогов»](http://hubofdata.ru/group/govtwitters) на hubofdata. В хранилище лежит отдельная выгрузка [OGDHub/gtwitter](https://cdn.ruarxive.org/public/OGDHub/gtwitter/): 53 файла, 24,8 МБ, дата файла 17.08.2013. Это CSV по аккаунтам — в именах, среди прочих, `Vshport.csv`, `Rogozin.csv`, `sk_ru.csv`, `fadm_ru.csv`, `roscomnadzor.csv`.
- **YouTube.** [Список официальных каналов госорганов](https://docs.google.com/spreadsheet/ccc?key=0AphaFpvgzsyhdHNEemRWQS1jckJEdEphSnk0a3ZEbGc&usp=sharing) (Google Sheets). В хранилище, в [OGDHub/youtube/raw](https://cdn.ruarxive.org/public/OGDHub/youtube/raw/), лежат mp4 четырёх каналов, вместе 14,8 ГБ: AccountsChamber (9,7 ГБ, 196 файлов, 27–29.09.2013), MchsRussia (4,9 ГБ, 135 файлов, 22.08.2013), BankofRussia (0,12 ГБ) и kremlin (0,03 ГБ).

## Ранние каталоги

До переноса коллекций в текущее хранилище списки публиковались отдельно.

- [Список архивов официальных сайтов (коллекция 2012 года)](https://docs.google.com/spreadsheet/ccc?key=0AphaFpvgzsyhdDJlczBoc095QmdLV25pY2NtSFRDaFE&usp=sharing) — архивы 88 сайтов в формате HTTrack, 22 ГБ в сжатом виде и до 300 ГБ в распакованном (по данным этой страницы на март 2022 года). В снимке хранилища этот список отдельной коллекцией не выделен.
- [Раздел «Архивы сайтов» на hubofdata](https://hubofdata.ru/dataset/?__no_cache__=True&groups=webarchive) — на март 2022 года в нём было 1 940 наборов данных.
- [«Архивы сайтов правоохранительных органов России»](http://hubofdata.ru/group/lawenfarchive) — группа данных с 2016 года: ФМС, ФСКН, внутренние войска МВД, портал 112.ru ([@begtin, 15.05.2016](https://t.me/begtin/171)). Файлы этой группы в хранилище — коллекция `lawenf` в таблице выше.

## Кампании по публикациям канала

| Когда | Что сохраняли | Что известно |
|---|---|---|
| 08.04–20.05.2022 | Порталы открытых данных | 37 сайтов, 43 ГБ в сжатом виде (около 320 ГБ в распакованном); крупнейшие — opendata.mkrf.ru (15 ГБ) и data.gov.ru (14 ГБ) ([#43](https://t.me/ruarxive/43), [#55](https://t.me/ruarxive/55)). Код — [ruarxive/rudatarchive](https://github.com/ruarxive/rudatarchive). В снимке хранилища папка `dataportals` — 38 ресурсов и 47,6 ГБ. Подробнее — [кейс про API](/kb/case-studies/api-archiving-scale) и раздел ниже. |
| 05.04.2022 | Сайты комитетов и комиссий Госдумы | Архивация начата из-за перехода на единый дизайн ([#39](https://t.me/ruarxive/39)). В папке 2022 года — 14 хостов и 102 ГБ, даты файлов 09–10.04.2022; крупнейший — komitet3.km.duma.gov.ru, 55,7 ГБ. Сбор 2017 года в той же коллекции `duma` описан выше. |
| 05.07.2022 | Сайты избирательных комиссий муниципальных образований | На старте — список из 144 ресурсов, его собрал Константин Косенков ([#63](https://t.me/ruarxive/63)). В снимке коллекция `ikmo` — 19 хостов и 582 ГБ, даты файлов март–апрель 2023. Состав папки — в разделе про коллекции выше. |
| 15.07.2022 | ПФР и ФСС | Объявлено, что архивация общедоступных ресурсов обеих организаций начнётся в ближайшее время: с 01.01.2023 они входят в Социальный фонд России ([#66](https://t.me/ruarxive/66)). Итогового объёма этой кампании в публикациях нет. Более ранние копии pfr.gov.ru (55,1 ГБ, дата файла 20.04.2019) и fss.ru (57,2 ГБ) лежат в коллекциях `government` и `gov`. |
| 20.10.2022 | Ростуризм | Срочная архивация в связи с ликвидацией агентства ([#78](https://t.me/ruarxive/78)). В [webcollect2023/gov](https://cdn.ruarxive.org/public/webcollect2023/gov/) дата файлов 29.03.2023: tourism.gov.ru (5,1 ГБ), grant.tourism.gov.ru (0,33 ГБ), opendata.russiatourism.ru (0,26 ГБ), ev.tourism.gov.ru и efrta.tourism.gov.ru. |
| 02.12.2022 | Отчёты Счётной палаты | 4,2 ГБ в сжатом виде, около 5 ГБ в распакованном; собрано утилитой apibackuper и загружено в [Internet Archive](https://archive.org/details/achgovru-checks) ([#89](https://t.me/ruarxive/89)). Конфигурация — в [ruarxive/apibackuper-dataarchive](https://github.com/ruarxive/apibackuper-dataarchive/tree/main/achgovru-checks). |
| 04.10.2023 | Сайты Роснано | Повод — новости о возможном банкротстве. Архив 2021 года: [rusnano2021](https://cdn.ruarxive.org/public/webcollect2021/rusnano2021/) ([#110](https://t.me/ruarxive/110)). Состав файлов — [кампании 2021 года](/kb/case-studies/memorial-rusnano-2021). |
| июнь 2024 | Большая российская энциклопедия | 224 556 статей bigenc.ru и 82 228 статей old.bigenc.ru; ZIP-архивы на hubofdata ([#130](https://t.me/ruarxive/130), [#131](https://t.me/ruarxive/131)). Подробнее — в [реестре](/kb/case-studies/russia-resources-disappearing). |
| 22.04.2025 | aisup.economy.gov.ru | Портал стал недоступен. Копия августа 2017 года лежит в [fedmineconom](https://cdn.ruarxive.org/public/webcollect2017/fedmineconom/) ([#155](https://t.me/ruarxive/155)). |
| 19.05.2025 | Росстат и ЕМИСС | Начата превентивная архивация общедоступных ресурсов в связи с планируемым выводом ЕМИСС из эксплуатации ([#159](https://t.me/ruarxive/159)). Объёма этого сбора в известных списках файлов нет: папки `webcollect2024` и `webcollect2025` в них не входят. Коллекция `gks2018` в таблице — более ранний сбор территориальных органов. |
| 30.06.2025 | Сайт Минспорта, снимок 2019 года | WARC упомянут как пример для metawarc ([#160](https://t.me/ruarxive/160)): [minsport.gov.ru-2019-04-08-d8919777-00000.warc.gz](https://cdn.ruarxive.org/public/webcollect2019/gov2019/minsport.gov.ru-2019-04-08-d8919777/minsport.gov.ru-2019-04-08-d8919777-00000.warc.gz), 1 109 627 450 байт. В той же папке лежит `minsport.7z`, 1 107 598 952 байт. Вместе с остальными 19 файлами ресурс в индексе — 2,2 ГБ. |

### Порталы открытых данных в индексе

Папка [dataportals](https://cdn.ruarxive.org/public/dataportals/) в экспорте — 38 ресурсов и 47,6 ГБ. Крупнейшие:

| Портал | Объём | Папка внутри `dataportals` | Дата файла |
|---|---:|---|---|
| opendata.mkrf.ru | 15,9 ГБ | `2021-06-13` | 11.04.2022 |
| data.gov.ru | 15,0 ГБ | `2022-02-02` | 02.02.2022 |
| data.mos.ru | 6,0 ГБ | `2021-07-01` | 11.04.2022 |
| rosstat.gov.ru | 5,3 ГБ | `2022-01-29` | 10.04.2022 |

Дальше идут региональные порталы апреля 2022 года. Крупнейший из них — www.opendata71.ru, 1,5 ГБ; затем opendata.perm.ru, opendata.yarcloud.ru, data.admhmao.ru и другие. Слепок fedstat.ru в этой папке — 0,09 ГБ (файл 10.04.2022).

Более ранние копии тех же порталов лежат в других папках:

- [webcollect/data](https://cdn.ruarxive.org/public/webcollect/data/) — data.mos.ru, 16,1 ГБ (07.10–30.11.2014), и data.gov.ru, 0,88 ГБ;
- data.gov.ru в коллекции `gov` — 58,4 ГБ, веб-архив 21.02–28.04.2017;
- [datacollect/opendata.mkrf.ru/packages](https://cdn.ruarxive.org/public/datacollect/opendata.mkrf.ru/packages/) — 15,9 ГБ, дата файла 25.06.2021;
- [datacollect/fedstat.ru/dump_20130805](https://cdn.ruarxive.org/public/datacollect/fedstat.ru/dump_20130805/) — 6,8 ГБ, дата файла 05.08.2013.

С 2022 года многие сайты госорганов закрыты для обхода с нероссийских IP, и Internet Archive сохраняет их с ошибками или не сохраняет вовсе ([#105](https://t.me/ruarxive/105), [#150](https://t.me/ruarxive/150)). При переводе региональных и муниципальных сайтов на ГосВеб со старых адресов переносится не всё ([#170](https://t.me/ruarxive/170)). Как устроены такие потери — в кейсе [«Миграция платформ»](/kb/case-studies/platform-migrations).

## Базы данных вместо веб-архивов

Некоторые ресурсы неудобны для веб-архивации, поэтому они сохранены как базы данных:

- **Блог Дмитрия Медведева** ([снимок в web.archive.org](https://web.archive.org/web/2022/http://blog.kremlin.ru/)) — набор на hubofdata: http://hubofdata.ru/dataset/blog-medvedev. В хранилище ему соответствует [OGDHub/blog.kremlin.ru/22112011](https://cdn.ruarxive.org/public/OGDHub/blog.kremlin.ru/22112011/): 10 файлов, 186 МБ, дата файла 17.08.2013, внутри `medblog_json.7z` и `medblog_mongodb.7z`. Отдельная копия сайта от 02.05.2017 (1,1 ГБ) есть в коллекции `kremlin`.
- **База голосований депутатов Государственной Думы** — http://hubofdata.ru/dataset/duma-votes. В хранилище, в [OGDHub/duma](https://cdn.ruarxive.org/public/OGDHub/duma/), лежат `deputies.json`, `votings.json`, `personalvotes_json.zip` и `dumavotes.7z`; дата файлов 01.01.2013. Веб-архив vote.duma.gov.ru (6,9 ГБ, апрель 2017) — в коллекции `duma`.

## Связанные материалы

- [Исчезновение сайтов государственных органов](/kb/case-studies/government-websites-disappearing)
- [Исчезающие российские ресурсы](/kb/case-studies/russia-resources-disappearing)
- [«Мемориал» и Роснано, кампании 2021 года](/kb/case-studies/memorial-rusnano-2021)
- [Архивация через API](/kb/case-studies/api-archiving-scale) — Счётная палата и порталы открытых данных
- [Планы архивации](/kb/archive-plans)
- [Порталы открытых данных](/kb/projects/open-data)
- [Госсайты, 2022–2025](/kb/projects/government-campaigns-2022)
- [Большая российская энциклопедия](/kb/projects/bigenc)
- [Статистика: снимок](/kb/resources/stats-snapshot)
- [История проекта](/kb/about/project-history)
- [Таблица сохранённых проектов](/kb/preserved-projects-table)
