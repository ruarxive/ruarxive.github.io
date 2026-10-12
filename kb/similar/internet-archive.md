---
title: Internet Archive — крупнейший мировой веб-архив
sidebar_label: Internet Archive
sidebar_position: 2
description: "Internet Archive и Wayback Machine: сохранение страниц, API, работа с коллекциями archive.org через ia CLI, коллекции Ruarxive, ограничения и правовые аспекты загрузки."
last_update:
  date: 2026-10-12
keywords: [internet-archive, archive.org, wayback, memento, savepagenow, ia-cli]
---

# Internet Archive

[Internet Archive](https://archive.org/) — некоммерческая цифровая библиотека, основанная Брюстером Кейлом в 1996 году. Это крупнейший в мире веб-архив; кроме Wayback Machine в нём хранятся оцифрованные книги, аудио, видео, программы и наборы данных.

## Wayback Machine

[Wayback Machine](https://web.archive.org/) — основной инструмент для просмотра сохранённых версий веб-страниц. В октябре 2025 года Internet Archive [объявил](https://blog.archive.org/2025/10/31/one-trillion-web-pages-archived-internet-archive-celebrates-a-civilization-scale-milestone/), что в Wayback Machine сохранено более **1 трлн веб-страниц**.

### Save Page Now — добавить страницу

Любой пользователь может сохранить страницу через [web.archive.org/save](https://web.archive.org/save). Снимок остаётся доступным, если не будет снят по обоснованному запросу.

Программный доступ: см. [Wayback Machine API](/kb/instruments/tools/wayback-api) — Save Page Now, CDX, Availability, Memento.

### Доступ из России

`archive.org` уже попадал под блокировки в РФ: в октябре 2014 года и в июне 2015 года из-за отдельных страниц, внесённых в реестр запрещённых сайтов, у части провайдеров переставал открываться весь сайт. В мае 2022 года Роскомнадзор составил административный протокол в отношении Internet Archive за отказ удалить запрещённый в РФ контент ([публикация #51](https://t.me/ruarxive/51)). Если сервис недоступен, используйте другие архивы (archive.today, национальные веб-архивы) или обратитесь к коллегам в [чате Ruarxive](https://t.me/ruarxivechat).

### Инциденты и судебные споры

- **Октябрь 2024 года** — утечка базы около 31 млн учётных записей пользователей и длительные DDoS-атаки, из-за которых сервис был периодически недоступен ([публикация #138](https://t.me/ruarxive/138)). Если у вас есть аккаунт, смените пароль.
- **Hachette v. Internet Archive** — иск издательств к программе цифровой выдачи книг; в сентябре 2024 года апелляционный суд оставил в силе решение против Internet Archive.
- **Great 78 Project** — иск звукозаписывающих компаний из-за оцифровки пластинок на 78 оборотов; к весне 2025 года сумма требований выросла примерно до 700 млн долларов ([публикация #154](https://t.me/ruarxive/154)). В сентябре 2025 года стороны заключили конфиденциальное мировое соглашение, в октябре 2025 года дело прекращено.

Эти истории — довод в пользу того, чтобы не полагаться на одно хранилище.

## Работа с коллекциями через ia CLI

archive.org предоставляет S3-совместимый API для загрузки и скачивания файлов; удобнее всего работать с ним через утилиту [`ia`](/kb/instruments/tools/internet-archive-cli) из Python-пакета `internetarchive`.

### Найти записи коллекции

```bash
pip install internetarchive

# Сколько записей в коллекции «Эха Москвы»
ia search 'collection:echo-of-moscow' --num-found

# Только идентификаторы
ia search 'collection:echo-of-moscow' --itemlist
```

### Скачать архив

```bash
# Показать ссылки на файлы записи, не скачивая
ia download --dry-run echomskru-12tango

# Скачать все mp3 одной программы
ia download echomskru-12tango --glob '*.mp3'
```

### Загрузить свой WARC

```bash
ia configure   # один раз: вход в аккаунт archive.org

ia upload my-site-2026-10 my-site.warc.gz \
  --metadata="mediatype:data" \
  --metadata="title:Архив сайта my-site.example, октябрь 2026" \
  --metadata="date:2026-10-12"
```

Загруженный WARC-файл становится доступен для скачивания, но, как правило, не появляется в Wayback Machine. Поле `licenseurl` указывайте, только если вы правообладатель содержимого (см. ниже). Добавлять записи в чужие коллекции нельзя без прав на эту коллекцию.

> Команды сверены с `ia --help` версии 5.11.1 (октябрь 2026).

Подробности — [Internet Archive CLI (ia)](/kb/instruments/tools/internet-archive-cli).

### Наборы данных большого объёма

Многие записи содержат крупные файлы (`tar.gz`, WARC, ZIP). Список файлов и способы скачивания — в разделе «DOWNLOAD OPTIONS» на странице каждой записи.

## API и протоколы

| Протокол | Зачем | Документация |
|:---|:---|:---|
| **Интерфейс Wayback** | Просмотр снимков | [web.archive.org](https://web.archive.org/) |
| **Save Page Now** | Сохранить страницу | [Wayback Machine API](/kb/instruments/tools/wayback-api) |
| **CDX API** | Поиск по индексу снимков | [Wayback Machine API](/kb/instruments/tools/wayback-api) |
| **Availability API** | Есть ли снимок? | [Wayback Machine API](/kb/instruments/tools/wayback-api) |
| **Memento (RFC 7089)** | Стандартный доступ к прежним версиям | [Memento](/kb/instruments/replay/memento) |
| **S3-совместимый API** | Загрузка и скачивание | [ia CLI](/kb/instruments/tools/internet-archive-cli) |

## Ruarxive и Internet Archive

Часть архивов Ruarxive загружена в Internet Archive. Это дополнительная страховка: данные хранятся в двух независимых инфраструктурах.

| Ресурс | Адрес |
|:---|:---|
| Аккаунт Ruarxive на archive.org | [archive.org/details/@ruarxive](https://archive.org/details/@ruarxive) |
| Коллекция «Эхо Москвы» (медиаархив передач) | [archive.org/details/echo-of-moscow](https://archive.org/details/echo-of-moscow) |
| Отчёты Счётной палаты РФ ([публикация #89](https://t.me/ruarxive/89)) | [archive.org/details/achgovru-checks](https://archive.org/details/achgovru-checks) |
| Список всех архивов Ruarxive | [cdn.ruarxive.org/public/allarchives.csv](https://cdn.ruarxive.org/public/allarchives.csv) |

Отдельной коллекции `ruarxive` на archive.org нет: материалы проекта находятся в аккаунте `@ruarxive` и в тематических коллекциях.

## Ограничения

- **Охват определяется цитируемостью.** Wayback Machine обходит веб, ориентируясь на ссылки; страница, на которую никто не ссылается, может не попасть в архив. Для региональных и малоизвестных сайтов лучше делать собственный архив.
- **Не всё сохраняется.** Многие мультимедийные файлы, архивы и документы не собираются при обычном обходе.
- **Сайты, закрытые для внешних краулеров.** Многие сайты госорганов РФ с 2022 года недоступны с нероссийских IP-адресов, поэтому новые снимки в IA не появляются ([публикация #113](https://t.me/ruarxive/113)).
- **Ограничение частоты запросов.** Save Page Now и CDX API ограничивают частоту; при массовых запросах возможны ответы 429 и временные блокировки.
- **Исключения по запросу.** Владельцы сайтов могут закрыть доступ краулеру IA или запросить исключение снимков.

## Когда использовать Internet Archive

✅ Подходит:

- **Международные ресурсы и СМИ.**
- **Долгосрочное хранение** собственных архивов как дополнительная копия.
- **Восстановление давно исчезнувшего сайта.**
- **Поиск через CDX/Memento** в существующих снимках.

❌ Не подходит:

- **Систематическая архивация текущих региональных сайтов** — лучше собственный краулер.
- **Хранение чувствительных данных** (персональные данные, медицинские записи) — загруженное в IA становится публичным.
- **Массовый автоматический сбор через Save Page Now** — упирается в ограничения частоты.
- **Юридически значимая фиксация** — в РФ для этого обычно используют нотариальный осмотр сайта; см. также [Perma.cc](/kb/similar/perma-cc).

## Юридические аспекты загрузки на IA

:::warning
Загружая WARC на archive.org, вы делаете его **публично доступным**. Убедитесь, что:

- у вас есть **права** на распространение содержимого или законное основание для этого;
- вы **не нарушаете** законы о персональных данных и авторском праве;
- **лицензия** в метаданных соответствует действительности.

Подробности: [Авторское право](/kb/legal/copyright), [Персональные данные](/kb/legal/personal-data).
:::

Про лицензии в метаданных:

- Лицензию (`licenseurl`) может назначить только правообладатель. Загружающий копию чужого сайта не может «перелицензировать» его содержимое — ни под CC0, ни под CC BY.
- Сайты госорганов в целом **не** находятся в общественном достоянии: по п. 6 ст. 1259 ГК РФ авторским правом не охраняются только официальные документы (законы, судебные решения, иные официальные материалы) и сообщения о фактах, а статьи, фотографии и оформление сайта охраняются.
- Для собственных материалов (описаний, метаданных, кода) можно указать CC BY 4.0 или CC0.

## Ресурсы

- [archive.org](https://archive.org/) — главный сайт.
- [web.archive.org](https://web.archive.org/) — Wayback Machine.
- [archive.org/developers](https://archive.org/developers/) — портал для разработчиков.
- [Блог Internet Archive](https://blog.archive.org/) — новости.
- [Wayback Machine API — справочник](/kb/instruments/tools/wayback-api).
- [Internet Archive CLI (ia)](/kb/instruments/tools/internet-archive-cli).

## Связанные материалы

- [Common Crawl](/kb/similar/common-crawl) — открытые веб-краулы.
- [Perma.cc](/kb/similar/perma-cc) — постоянные ссылки для цитирования.
- [ArchiveTeam](/kb/similar/archiveteam) — волонтёрские экстренные архивы.
- [Похожие проекты — обзор](/kb/similar) — карта открытых сервисов.
- [Архивы независимых российских СМИ](/kb/similar/russian-independent-media-archives).
