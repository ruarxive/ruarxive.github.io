---
sidebar_position: 4
title: Coub
description: "Кампания Ruarxive по Coub, март 2022 года: что сказано в канале про ролики Hot и какие метаданные API лежат в репозитории coub-archival-campaign."
last_update:
  date: 2026-10-14
---

# Coub

Coub (coub.com) — сервис коротких зацикленных видео со звуком. 15 марта 2022 года на сайте появилось объявление, что сервис закроется 1 апреля. В тот же день Ruarxive начал архивацию ([#17](https://t.me/ruarxive/17)). Новость об объявлении: [Хабр, 15.03.2022, 22:08 МСК](https://habr.com/ru/news/655873/).

Публичный результат кампании — ответы API в репозитории [coub-archival-campaign](https://github.com/ruarxive/coub-archival-campaign), лицензия CC0. Репозиторий создан и запушен 18.03.2022 (последний push в 12:59 UTC). В README кампания обозначена датами 15.03.2022–01.04.2022; коммитов после 18 марта в репозитории нет.

В канале 17 марта сказано, что выгружены 1 952 ролика раздела Hot, 55 ГБ, и что сбор продолжается ([#18](https://t.me/ruarxive/18)). Этих видеофайлов в репозитории нет. В реестре [`allarchives.csv`](https://cdn.ruarxive.org/public/allarchives.csv) (файл от 12.12.2023, `Last-Modified`) коллекции Coub тоже нет.

5 апреля 2022 года Coub сообщил, что продолжит работу с новой командой ([Хабр, 05.04.2022, 15:41 МСК](https://habr.com/ru/news/659207/)). 14.10.2026 [coub.com](https://coub.com) отвечает и перенаправляет на `/featured/creators` (HTTP 307, затем страница с заголовком «Top creators - videos from our featured channels - Coub»).

Ссылки вида `#N` ведут на публикации канала [@ruarxive](https://t.me/ruarxive). Число строк в JSONL ниже посчитано 14.10.2026 по файлам репозитория. ГБ в этой странице, где размер получен из байтов, — байты / 10⁹.

## Состав

| Часть | Что лежит в открытом доступе | Цифры | Источник |
|---|---|---|---|
| Ролики Hot | В посте сказано, что ролики выгружены. Публичной ссылки на файлы нет | 1 952 ролика, 55 ГБ на 17.03.2022, сбор продолжался | [#18](https://t.me/ruarxive/18) |
| Метаданные Hot | [hot/data.jsonl.xz](https://github.com/ruarxive/coub-archival-campaign/raw/main/hot/data.jsonl.xz), 1 146 800 байт | 1 966 записей, все `id` разные | репозиторий, подсчёт 14.10.2026 |
| 21 категория | JSONL в [communities/export](https://github.com/ruarxive/coub-archival-campaign/tree/main/communities/export), вместе 55 809 300 байт | 99 489 записей, 99 333 разных `id` | то же |
| Featured | [featured/data.jsonl.xz](https://github.com/ruarxive/coub-archival-campaign/raw/main/featured/data.jsonl.xz), 1 820 680 байт | 2 585 подборок (stories), не ролики | то же |

Вместе в Hot и в категориях 99 847 разных `id` роликов: 1 452 из 1 966 записей Hot встречаются и в файлах категорий. 156 `id` встречаются в двух категориях, ни один — в трёх и больше.

## Хронология

- **15.03.2022.** Объявлено закрытие coub.com с 1 апреля. Ruarxive начал архивацию популярных роликов из категории Hot и попросил присылать списки роликов, у которых есть общественная ценность. Среди готовых инструментов в посте назван [CoubDownloader](https://github.com/HelpSeeker/CoubDownloader); каким инструментом скачаны сами ролики, пост не говорит ([#17](https://t.me/ruarxive/17)).
- **17.03.2022.** Выгружены 1 952 ролика Hot, 55 ГБ. Владельцам сервиса отправлены письма с просьбой передать накопленные данные. Шла выгрузка API по категориям, до 5 000 роликов в категории; следующим шагом назван сбор роликов, признанных лучшими. Искали дополнительное хранилище. План на тот день — сохранить до конца марта столько роликов, сколько успеют ([#18](https://t.me/ruarxive/18)).
- **18.03.2022.** Опубликован репозиторий. В посте сказано, что архивация роликов Hot проведена, а в репозитории лежат по 5 000 роликов по всем категориям плюс группы Hot и Featured. Данные собраны утилитой [APIBackuper](https://github.com/ruarxive/apibackuper) в JSON Lines. Дальше планировались другие категории и списки лучших роликов по годам. Волонтёров просили выгрузить разделы Best (`coub.com/best/2021`, `coub.com/best/2020` и дальше) и помочь скачать ролики по категориям. Сервер для загрузки обещали через несколько дней; параллельно предлагали класть ролики в Internet Archive, в раздел Community Video ([#20](https://t.me/ruarxive/20)).
- **31.03.2022.** В сводке новостей проекта Coub уже не назван ([#31](https://t.me/ruarxive/31)). Отдельного поста о завершении кампании в канале нет. В открытой ленте канала, просмотренной 14.10.2026 примерно до поста #180, Coub после #20 не встречается.

## Ролики Hot

Цифра 1 952 ролика и 55 ГБ — из поста #18 на 17 марта, когда сбор ещё продолжался. Пост #20 на следующий день снова говорит, что ролики Hot заархивированы, и не даёт новой цифры и ссылки на файл.

Файл `hot/data.jsonl.xz` — другой объект. В нём 1 966 записей о роликах, опубликованных в репозитории 18 марта. Это на 14 записей больше, чем 1 952 в посте #18. Поле `created_at` у этих записей — с 05.07.2019 по 15.03.2022, самое позднее `updated_at` — 15.03.2022 21:13 UTC. По годам `created_at`: 2019 — 15, 2020 — 109, 2021 — 1 553, 2022 — 289. У всех записей `type` равен `Coub::Simple`, у всех есть `permalink`. Пример: `2socd6`, страница [coub.com/view/2socd6](https://coub.com/view/2socd6) 14.10.2026 ответила HTTP 200.

В каждой записи Hot есть `file_versions.html5`: отдельные URL видео (mp4 без звука, варианты `higher`, `high`, `med`) и звука (mp3, `high` и `med`) на `coub-anubis-a.akamaized.net`, у каждого варианта поле `size` в байтах. Сумма `size` для видео `higher` по всем 1 966 записям — 4 356 827 292 байта (4,36 ГБ). Сумма `size` для звука `high` — 3 948 617 477 байт (3,95 ГБ); у 6 записей этого варианта нет. Это размеры роликов, которые API перечислил в марте 2022 года. К 55 ГБ из поста #18 они не приводятся: в JSONL нет скачанных видеофайлов.

Поиск по реестру `allarchives.csv` от 12.12.2023 на строку `coub` даёт две строки. Обе — файл с именем `coub.com` внутри чужих обходов коллекции `culture2022`: [kkbbd.com](https://cdn.ruarxive.org/public/webcollect2022/culture2022/kkbbd.com/coub.com) (3 байта, дата в реестре 06.05.2022) и [knife.media](https://cdn.ruarxive.org/public/webcollect2022/culture2022/knife.media/coub.com) (4 байта, 11.05.2022). Поиск на archive.org `uploader:ruarxive AND coub` 14.10.2026 находит 0 записей.

## Как собраны метаданные

Каталоги `hot`, `featured` и `communities/raw/КОД` — проекты [apibackuper](/kb/instruments/downloaded-data/apibackuper). В каждом есть `apibackuper.cfg`, `params.json` и `storage/storage.zip` с постраничными ответами API. Рядом лежит экспорт в JSONL, сжатый xz. Страница API — параметр `per_page`, в конфигурации предел 10.

| Набор | URL в конфигурации | Ключ записей |
|---|---|---|
| Hot | `https://coub.com/api/v2/timeline/subscriptions/half` | `coubs` |
| Категория | `https://coub.com//api/v2/timeline/community/КОД/fresh` | `coubs` |
| Featured | `https://coub.com/api/v2/stories/featured` | `stories` |

В канале и в имени каталога первая выгрузка называется Hot. Запрос в конфигурации идёт на `timeline/subscriptions/half`. В адресе категории в файле конфигурации после домена стоят две косые черты, как в шаблоне `communities/prepare.py`. В `params.json` категорий задано `"order_by": "likes_count"`.

Пост #20 говорит, что в репозитории «по 5000 роликов по всем категориям». В файлах ни одна категория не содержит 5 000 записей. У 19 категорий от 4 891 до 4 987 записей. У Food & Kitchen — 2 743, у Fashion & Beauty — 2 710. Пост #18 формулировал тот же предел как «до 5000 роликов в категории».

Каталога `best/` в репозитории нет. Списки лучших роликов по годам, о которых просили в посте #20, туда не положены.

### Категории

Имена — из `communities/communities.csv`. Интервал — поле `created_at`. Размер — байты файла `.jsonl.xz` в git.

| Категория | Записей | created_at | Файл |
|---|---:|---|---|
| Standup & Jokes | 4 987 | 18.05.2014 – 15.03.2022 | [standup-jokes.jsonl.xz](https://github.com/ruarxive/coub-archival-campaign/raw/main/communities/export/standup-jokes.jsonl.xz), 2 560 032 |
| Blogging | 4 984 | 29.07.2013 – 17.03.2022 | [blogging.jsonl.xz](https://github.com/ruarxive/coub-archival-campaign/raw/main/communities/export/blogging.jsonl.xz), 2 520 824 |
| Live Pictures | 4 984 | 23.12.2011 – 15.03.2022 | [live-pictures.jsonl.xz](https://github.com/ruarxive/coub-archival-campaign/raw/main/communities/export/live-pictures.jsonl.xz), 2 511 916 |
| News & Politics | 4 980 | 12.04.2012 – 13.03.2022 | [news.jsonl.xz](https://github.com/ruarxive/coub-archival-campaign/raw/main/communities/export/news.jsonl.xz), 3 081 852 |
| Nature & Travel | 4 973 | 07.12.2011 – 10.03.2022 | [nature-travel.jsonl.xz](https://github.com/ruarxive/coub-archival-campaign/raw/main/communities/export/nature-travel.jsonl.xz), 2 811 232 |
| Sports | 4 973 | 19.02.2013 – 14.03.2022 | [sports.jsonl.xz](https://github.com/ruarxive/coub-archival-campaign/raw/main/communities/export/sports.jsonl.xz), 2 893 512 |
| Memes | 4 969 | 14.05.2015 – 15.03.2022 | [memes.jsonl.xz](https://github.com/ruarxive/coub-archival-campaign/raw/main/communities/export/memes.jsonl.xz), 2 533 072 |
| Auto & Technique | 4 968 | 13.07.2013 – 14.03.2022 | [cars.jsonl.xz](https://github.com/ruarxive/coub-archival-campaign/raw/main/communities/export/cars.jsonl.xz), 2 835 936 |
| Music | 4 964 | 29.04.2012 – 09.03.2022 | [music.jsonl.xz](https://github.com/ruarxive/coub-archival-campaign/raw/main/communities/export/music.jsonl.xz), 2 994 012 |
| Science and technology | 4 956 | 24.05.2012 – 13.03.2022 | [science-technology.jsonl.xz](https://github.com/ruarxive/coub-archival-campaign/raw/main/communities/export/science-technology.jsonl.xz), 2 906 264 |
| Celebrity | 4 955 | 30.01.2012 – 12.03.2022 | [celebrity.jsonl.xz](https://github.com/ruarxive/coub-archival-campaign/raw/main/communities/export/celebrity.jsonl.xz), 2 992 208 |
| Art & Design | 4 949 | 03.09.2012 – 16.03.2022 | [art.jsonl.xz](https://github.com/ruarxive/coub-archival-campaign/raw/main/communities/export/art.jsonl.xz), 2 751 976 |
| Mashup | 4 942 | 13.09.2013 – 19.02.2022 | [mashup.jsonl.xz](https://github.com/ruarxive/coub-archival-campaign/raw/main/communities/export/mashup.jsonl.xz), 2 862 412 |
| Animals & Pets | 4 928 | 03.01.2012 – 03.03.2022 | [animals-pets.jsonl.xz](https://github.com/ruarxive/coub-archival-campaign/raw/main/communities/export/animals-pets.jsonl.xz), 2 581 632 |
| Dance | 4 917 | 03.07.2012 – 08.03.2022 | [dance.jsonl.xz](https://github.com/ruarxive/coub-archival-campaign/raw/main/communities/export/dance.jsonl.xz), 2 815 776 |
| Movies | 4 914 | 21.04.2012 – 06.03.2022 | [movies.jsonl.xz](https://github.com/ruarxive/coub-archival-campaign/raw/main/communities/export/movies.jsonl.xz), 2 813 468 |
| Cartoons | 4 908 | 17.02.2012 – 14.03.2022 | [cartoons.jsonl.xz](https://github.com/ruarxive/coub-archival-campaign/raw/main/communities/export/cartoons.jsonl.xz), 2 782 832 |
| Anime | 4 894 | 10.03.2013 – 06.03.2022 | [anime.jsonl.xz](https://github.com/ruarxive/coub-archival-campaign/raw/main/communities/export/anime.jsonl.xz), 2 590 448 |
| Gaming | 4 891 | 11.08.2012 – 09.03.2022 | [gaming.jsonl.xz](https://github.com/ruarxive/coub-archival-campaign/raw/main/communities/export/gaming.jsonl.xz), 2 903 960 |
| Food & Kitchen | 2 743 | 28.03.2012 – 16.03.2022 | [food-kitchen.jsonl.xz](https://github.com/ruarxive/coub-archival-campaign/raw/main/communities/export/food-kitchen.jsonl.xz), 1 544 376 |
| Fashion & Beauty | 2 710 | 27.12.2012 – 08.03.2022 | [fashion.jsonl.xz](https://github.com/ruarxive/coub-archival-campaign/raw/main/communities/export/fashion.jsonl.xz), 1 521 560 |

Самый ранний `created_at` — 07.12.2011 (Nature & Travel), самый поздний — 17.03.2022 (Blogging). Самое позднее `updated_at` в этих файлах — 18.03.2022 08:28 UTC (Animals & Pets).

### Featured

Выгрузка Featured — подборки, объекты `stories`, а не ролики. В посте #20 Hot и Featured названы вместе с роликами категорий. В файле 2 585 записей. Поле `published_at` — с 08.06.2017 по 04.03.2022, `featured_at` — с 23.06.2017 по 09.03.2022.

У подборки есть `coubs_count`: сколько роликов API засчитал в эту подборку. Сумма по всем 2 585 записям — 50 409, минимум 0 (так у 7 подборок), максимум 60. Самих роликов подборки в файле нет. Вложенный объект `thumbnail_coub` есть у 2 567 подборок и содержит 2 512 разных `id`.

## Что сохранили другие

Параллельно с кампанией Ruarxive ArchiveTeam вёл проект [coub-grab](https://github.com/ArchiveTeam/coub-grab). На [странице вики](https://wiki.archiveteam.org/index.php/Coub), прочитанной 14.10.2026, объём назван «чуть больше 77 ТиБ»: данные забирали до объявления о закрытии и короткое время после того, как плашку сняли, примерно до 1 апреля 2022 года. Та же страница пишет, что плашка «Coub will be closed on April 1, 2022» исчезла 18 марта 2022 года между 05:15 и 08:15 UTC, а затем появилось сообщение, что сервис продолжит работу с новой командой.

Коллекция на archive.org: [archiveteam_coub](https://archive.org/details/archiveteam_coub). Поиск `identifier:archiveteam_coub_*` 14.10.2026 находит 7 922 записи. Это пакеты проекта ArchiveTeam. К файлам Ruarxive они не относятся.

## Связанные материалы

- [apibackuper](/kb/instruments/downloaded-data/apibackuper) — утилита, которой сняты ответы API.
- [Планы архивации](/kb/archive-plans) — место кампании в плане 2022 года.
- [Статистика: снимок](/kb/resources/stats-snapshot)
- [ArchiveTeam](/kb/similar/archiveteam)
- [Коллекции цифровых архивов](/kb/projects)
