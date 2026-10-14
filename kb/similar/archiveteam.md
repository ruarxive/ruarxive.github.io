---
title: ArchiveTeam
description: "ArchiveTeam — волонтёрский коллектив экстренной архивации с 2009 года. Как устроены Warrior и вики, где искать уже сохранённые данные в Internet Archive и что есть по LiveJournal, VK и Telegram."
keywords: [archiveteam, warrior, wget-at, wikiteam, deathwatch, geocities, internet-archive]
last_update:
  date: 2026-10-14
---

# ArchiveTeam

**ArchiveTeam** — волонтёрский коллектив, который с 2009 года скачивает пользовательские данные сервиса, пока тот закрывается. Организатор вики и ранних кампаний — Джейсон Скотт. На главной вики коллектив описывает себя как «свободный коллектив изгоев-архивистов, программистов и писателей».

ArchiveTeam и [Internet Archive](/kb/similar/internet-archive) — разные организации. В Internet Archive состоят отдельные участники, большинство помогает в свободное от работы и учёбы время. Долговременное хранение — коллекции archive.org: FAQ прямо пишет, что коллектив полагается на Internet Archive. В описании [коллекции](https://archive.org/details/archiveteam) его отделяют и от команды Archive-It.

Штаб — [wiki.archiveteam.org](https://wiki.archiveteam.org/). Текущие задания Warrior показывает [tracker.archiveteam.org](https://tracker.archiveteam.org/).

## Сначала найти чужой архив

Чужой сервис, который вот-вот закроется, часто уже стоит в очереди ArchiveTeam. Прежде чем запускать свой обход, проверьте три места.

1. **Страница сервиса на вики.** Поиск по имени сайта. В карточке проекта указаны статус, канал IRC и поле Data — имя коллекции на archive.org.
2. **Wayback Machine.** FAQ ArchiveTeam называет его обычным способом открыть сохранённую страницу. Часть страниц появляется там через месяцы: WARC должен попасть в коллекцию, которую Internet Archive допустил к разбору.
3. **Поиск по коллекции.** Запрос `collection:archiveteam` на 14 октября 2026 года находит около **5,42 млн записей**. Запись — пакет файлов проекта, а не один сайт.

```text
https://archive.org/search?query=collection%3Aarchiveteam
```

Имя коллекции из поля Data надёжнее свободного поиска. У Google+ это [`archiveteam_googleplus`](https://archive.org/details/archiveteam_googleplus): на ту же дату поиск находит 33 033 записи.

:::info Сырые WARC часто закрыты для скачивания
Значок замка у коллекции значит, что файлы WARC не отдаются напрямую. Страницы при этом обычно открываются в Wayback Machine. В FAQ ArchiveTeam это объясняют так: Internet Archive сам разбирает запросы на исключение и ограничивает массовое скачивание, в том числе для обучения языковых моделей. За доступом к массиву FAQ отсылает в Internet Archive, а не к волонтёрам.
:::

Если в Wayback пусто, а на вики у проекта есть страница, там же написано, чем пользоваться вместо сырого WARC: отдельный поисковик по имени пользователя (такие есть у меньшинства проектов), список URL в CDX или зеркало. Для GeoCities вики до сих пор пишет, что собственный архив ArchiveTeam в Wayback ещё не разобран.

Вики стоит читать и как справочник по обходу. У крупных площадок там собраны структура URL, известные ограничения и чужие инструменты выгрузки. XML-дамп вики публикуют примерно раз в неделю: [archiveteam.org/dumps](https://www.archiveteam.org/dumps/).

## Что считают достойным спасения

На странице [Philosophy](https://wiki.archiveteam.org/index.php/Philosophy) Джейсон Скотт задаёт порядок такой:

1. Сайты, куда людей приглашали что-то публиковать, — журналы, группы, профили, загруженные файлы.
2. Собрания, которые трудно восстановить из другого места.
3. Всё остальное — как запасная копия, если остаются руки и канал.

Отсюда форма работы. Массовый обход Internet Archive снимает открытые страницы по расписанию. ArchiveTeam приходит на объявление о закрытии и пишет отдельный скрипт под API, ленты, короткие ссылки и страницы аккаунтов, которые общий обход не забирает.

Список больных сайтов ведут на [Deathwatch](https://wiki.archiveteam.org/index.php/Deathwatch). Счётчик страниц проектов на вики (14 октября 2026 года, сама вики называет его неполным): 571 спасённый сайт, 274 частично спасённых, 111 потерянных, 72 в работе.

## Как устроен сбор

Обычная цепочка выглядит так.

1. Кто-то замечает дату закрытия и пишет в IRC или добавляет сайт на Deathwatch.
2. Для небольшого сайта запускают [ArchiveBot](https://wiki.archiveteam.org/index.php/ArchiveBot): бот в IRC обходит сайт в WARC. Для крупного пишут отдельный проект и нарезают его на задания.
3. [Warrior](https://wiki.archiveteam.org/index.php/ArchiveTeam_Warrior) на компьютерах волонтёров забирает задания с трекера, скачивает свою долю и отдаёт сжатые данные на серверы ArchiveTeam.
4. Файлы попадают в коллекцию Internet Archive. В Wayback страница появляется после того, как Internet Archive допустит WARC к разбору. Свой WARC, загруженный в произвольную коллекцию, туда сам не попадает — это прямо написано в FAQ.

Связь с коллективом — IRC-сеть hackint, канал `#archiveteam-bs` (`ircs://irc.hackint.org:6697`, нужен TLS). Веб-чат указан на [главной вики](https://wiki.archiveteam.org/). Почта: archiveteam@archiveteam.org. Сама вики вопросы не читает: FAQ просит писать в IRC или на почту.

### ArchiveTeam Warrior

Warrior — виртуальная машина или контейнер. Он забирает задания текущего проекта, качает их с вашего IP и занимает канал, место на диске, процессор и память. Выбрать произвольный сайт нельзя: волонтёр подключается к проекту, который уже запущен.

На вики основной способ — виртуальная машина. Актуальный образ там назван **Warrior 4.2** (165 МиБ); для запуска рекомендуют VirtualBox. После загрузки интерфейс открывается на `http://localhost:8001/`: там задают имя для таблицы участников и проект. Пункт **ArchiveTeam's Choice** отдаёт Warrior на самый срочный проект по весам, которые коллектив выставляет сам.

Тот же клиент есть в Docker. Образ публикуют как `atdr.meo.ws/archiveteam/warrior-dockerfile`. Команда ниже — из README репозитория [warrior-dockerfile](https://github.com/ArchiveTeam/warrior-dockerfile): контейнер в фоне, имя участника и автоматический выбор проекта. В Dockerfile этого репозитория указана метка `version="20260405.01"`.

```bash
docker run --detach \
  --env DOWNLOADER="ваше-имя" \
  --env SELECTED_PROJECT="auto" \
  --name archiveteam-warrior \
  --restart=on-failure \
  --publish 8001:8001 \
  atdr.meo.ws/archiveteam/warrior-dockerfile
```

Интерфейс после запуска — [localhost:8001](http://localhost:8001/). Рецепт с автоматическим обновлением образа лежит в том же README. Если контейнер уже создал `projects/config.json`, переменные окружения при следующем запуске игнорируются.

## Что идёт в октябре 2026 года

Состав меняется быстрее этой страницы. Ниже — перечень с главной вики на 14 октября 2026 года; блок текущих проектов там помечен датой обновления 1 октября.

Срочных коротких проектов в этот день в списке не было. **ArchiveTeam's Choice** распределял Warrior так: Telegram с весом 0,8 и рекламная библиотека Meta с весом 0,2.

| Проект | Горизонт | Что забирают |
| :--- | :--- | :--- |
| Telegram | долгий, основной в Choice | публичные сообщения отобранных каналов, веб-представление |
| Meta Ad Library | средний | база объявлений Facebook и других продуктов Meta |
| US Government | средний | сайты правительства США; отдельно названы Radio Free Europe/Radio Liberty («Радио Свободная Европа» / «Радио Свобода»), Voice of America и Radio Free Asia |
| URLTeam | долгий | сокращатели ссылок |
| YouTube, Twitch | долгий | выбранные ролики и метаданные |
| Blogger, Imgur, Pastebin, Microsoft Update | долгий, задания приходят редко | неактивные блоги после чистки аккаунтов Google, изображения Imgur, тексты Pastebin, старые драйверы Windows |
| WikiTeam | постоянный, вручную | XML-дампы вики и файлы к ним |

MediaFire в том же списке помечен как остановленный: ссылки принимают, задания Warrior не выдают.

Рядом виден темп 2026 года — недавно закрытые кампании с главной вики:

- **Tenor** — хостинг GIF, отключение 30 июня 2026 года;
- **Bitbucket** — удаление issues и вики 20 августа 2026 года;
- **Weebly** — прекращение работы конструктора сайтов в 67 странах 27 сентября 2026 года;
- **Naver TV** и японский фотосайт **Photohito** — закрытие 30 сентября 2026 года;
- часть проекта по правительству США уже сдана: видеоархив NIH, цифровые коллекции Национальной медицинской библиотеки и база FITBIR.

## Крупные спасения

| Сервис | Когда | Что говорит вики | Куда смотреть |
| :--- | :--- | :--- | :--- |
| GeoCities | сбор апрель–октябрь 2009, закрытие 26–27 октября 2009 | Saved. Раздачу торрентом в прессе, на которую ссылается вики, называли объёмом около 900 ГБ. Отдельная пометка: в Wayback этот массив ещё не разобран | [archiveteam-geocities](https://archive.org/details/archiveteam-geocities), обходы самого Internet Archive и зеркала, перечисленные на вики |
| Google+ | 2019, меньше четырёх недель | больше 1,56 петабайта WARC. Профили — Saved, сообщества — Partially saved | [archiveteam_googleplus](https://archive.org/details/archiveteam_googleplus), затем Wayback |
| Yahoo Groups | к закрытию сервиса | публичные группы и сообщения; точные доли на вики расходятся по датам | [archiveteam_yahoogroups](https://archive.org/details/archiveteam_yahoogroups) |
| goo.gl | 16 февраля – 24 августа 2025 | статус Qualified Success. Сервис отключили 25 августа 2025 года, кроме ссылок, которые были активны в конце 2024-го | [archiveteam_googl](https://archive.org/details/archiveteam_googl) |
| Vine | частичный сбор в 2016 | сайт с роликами окончательно сломался около 3 января 2025 года | Wayback и [страница Vine](https://wiki.archiveteam.org/index.php/Vine) |
| Coub | март–апрель 2022, закрытие было назначено на 01.04.2022 | чуть больше 77 ТиБ, проект coub-grab, примерно до 1 апреля 2022 года | [archiveteam_coub](https://archive.org/details/archiveteam_coub), [страница Coub](https://wiki.archiveteam.org/index.php/Coub). Кампания Ruarxive — [отдельная страница](/kb/projects/coub) |

Поверх архива GeoCities художник Драган Эспеншид собрал отдельный просмотр «One Terabyte of Kilobyte Age». Вики отсылает к нему как к удобному способу смотреть страницы, не скачивая торрент целиком.

## Инструменты, которые работают и без Warrior

Скрипты проектов завязаны на трекер. Эти программы можно поставить отдельно, для своего архива.

| Инструмент | Зачем | В базе знаний |
| :--- | :--- | :--- |
| [Wget-AT](https://github.com/ArchiveTeam/wget-lua) | `wget` с Lua-хуками, WARC со сжатием Zstandard и дедупликацией. На нём держатся проекты Warrior | [Wget](/kb/instruments/tools/wget) |
| [grab-site](https://github.com/ArchiveTeam/grab-site) | свой обход сайта в WARC, без участия в чужом проекте | [grab-site](/kb/instruments/tools/grab-site) |
| [wpull](https://github.com/ArchiveTeam/wpull) | загрузчик на Python в духе wget; живой форк стоит внутри grab-site | [Wpull](/kb/instruments/tools/wpull) |
| [wikiteam3](https://github.com/saveweb/wikiteam3) | дамп MediaWiki: страницы, история правок, файлы | [WikiTeam](/kb/instruments/tools/wikiteam) |
| [File Formats Wiki](http://fileformats.archiveteam.org/wiki/Main_Page) | справочник форматов файлов, проект Just Solve the File Format Problem | [Реестры форматов](/kb/instruments/file-formats/format-registries) |

WikiTeam — постоянный подпроект: XML-дампы и изображения уходят в коллекцию [wikiteam](https://archive.org/details/wikiteam). По репозиторию WikiTeam к 2026 году сохранено больше 600 000 вики ([публикация #180](https://t.me/ruarxive/180)). Исчезнувшие русскоязычные вики имеет смысл искать там раньше, чем снимать сайт заново.

## Русскоязычные площадки

Страница на вики не означает, что копия уже лежит в открытом доступе.

- **LiveJournal.** [Страница проекта](https://wiki.archiveteam.org/index.php/LiveJournal) описывает сбор профилей как незавершённый. В списке текущих Warrior-проектов на октябрь 2026 года LiveJournal нет. Журнал, который нужен целиком, надёжнее выгрузить своими средствами, пока сайт его отдаёт.
- **ВКонтакте.** [Страница VK](https://wiki.archiveteam.org/index.php/VKontakte) фиксирует риск перебоев в 2022 году и не содержит статуса Saved или коллекции с результатом.
- **Telegram.** [Проект](https://wiki.archiveteam.org/index.php/Telegram) в работе: публичное веб-представление отобранных каналов, коллекция `archiveteam_telegram` помечена замком. Это не полная выгрузка канала. Свой канал или чат сохраняют экспортом Telegram Desktop или через [tgarc](/kb/instruments/ruarxive-tools/tgarc); порядок действий — в [инструкции по Telegram](/kb/instruments/data-take-out/dto-telegram).
- **Вики.** Коллекция WikiTeam — основной след русскоязычных MediaWiki, которые уже закрылись.

Отдельного проекта по российским сайтам в очереди Warrior на 14 октября 2026 года нет. Ведомственные порталы и издания, которые закрываются здесь, в этот перечень не входили. Ruarxive с самого начала делал такие архивы по модели ArchiveTeam: сайты в WARC и открытая публикация, без внешнего финансирования и без большой сети волонтёров. Так это сформулировано в посте о проекте «Архивация государства» ([история проекта](/kb/about/project-history)). Если ресурс важен для российского контекста, параллельно с вики ArchiveTeam смотрите [срочную архивацию](/kb/guides/emergency-archiving) и [чат Ruarxive](https://t.me/ruarxivechat).

:::warning Позиция ArchiveTeam и право в России — разные вещи
Коллектив часто начинает сбор без согласия владельца сервиса. На вопрос, почему краулер не соблюдает `robots.txt`, FAQ отвечает ссылкой на собственный текст [Robots.txt](https://wiki.archiveteam.org/index.php/Robots.txt). Это позиция ArchiveTeam. Для работы в российском контексте действуйте по странице [Условия использования сервисов](/kb/legal/terms-of-service): правила площадки, персональные данные и запрет обхода технических ограничений остаются в силе. Warrior качает чужие сайты с вашего адреса и расходует ваш канал.
:::

## Связанные материалы

- [Internet Archive](/kb/similar/internet-archive) — хранилище, куда ArchiveTeam сдаёт результат, и Wayback Machine.
- [WikiTeam](/kb/instruments/tools/wikiteam) — дампы вики.
- [Wget](/kb/instruments/tools/wget), [grab-site](/kb/instruments/tools/grab-site), [Wpull](/kb/instruments/tools/wpull) — инструменты того же круга для своего обхода.
- [SUCHO](/kb/similar/sucho), [End-of-Term Archive](/kb/similar/eot-archive), [DataRefuge](/kb/similar/datarefuge) — другие кампании, где волонтёры спасают данные к сроку.
- [Срочная архивация](/kb/guides/emergency-archiving) — что делать, если закрывается российский сайт.

## Источники

- [Главная вики ArchiveTeam](https://wiki.archiveteam.org/), [Projects](https://wiki.archiveteam.org/index.php/Projects), [Philosophy](https://wiki.archiveteam.org/index.php/Philosophy), [FAQ](https://wiki.archiveteam.org/index.php/FAQ) — проверены 14 октября 2026 года. Блок текущих проектов на главной помечен датой 1 октября 2026 года.
- [ArchiveTeam Warrior](https://wiki.archiveteam.org/index.php/ArchiveTeam_Warrior) и README [warrior-dockerfile](https://github.com/ArchiveTeam/warrior-dockerfile).
- Поиск archive.org по `collection:archiveteam` и `collection:archiveteam_googleplus` — 14 октября 2026 года.
- Страницы вики [GeoCities](https://wiki.archiveteam.org/index.php/GeoCities), [Google+](https://wiki.archiveteam.org/index.php/Google_Plus), [goo.gl](https://wiki.archiveteam.org/index.php/Goo.gl), [Vine](https://wiki.archiveteam.org/index.php/Vine), [LiveJournal](https://wiki.archiveteam.org/index.php/LiveJournal), [VK](https://wiki.archiveteam.org/index.php/VKontakte), [Telegram](https://wiki.archiveteam.org/index.php/Telegram).
- [Публикация Ruarxive #180 (30.03.2026)](https://t.me/ruarxive/180) — коллекция WikiTeam и wikiteam3.
