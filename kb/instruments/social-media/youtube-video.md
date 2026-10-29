---
title: Архивация YouTube
sidebar_label: YouTube
description: "Архивация видео и каналов YouTube через yt-dlp: канал целиком вместе с Shorts и трансляциями, комментарии, субтитры, чат эфира, удалённые видео, зависимости Deno и EJS, ограничения в РФ."
last_update:
  date: 2026-10-29
keywords: [youtube, видео, yt-dlp, shorts, комментарии, live-chat, deno, po-token]
---

# Архивация YouTube

Основной инструмент для YouTube — **[yt-dlp](/kb/instruments/tools/yt-dlp)**. На этой странице — что и как сохранять именно с YouTube. Установка, выбор качества, конфигурация и общие флаги описаны на странице yt-dlp.

В России YouTube замедляют с конца июля 2024 года, а в феврале 2026 года его домен пропал из НСДИ, см. [ограничения доступа в России](/kb/instruments/social-media#ограничения-доступа-в-россии). Важные каналы выгружайте заранее и всегда ведите журнал скачанного (`--download-archive`), чтобы прерванную загрузку можно было продолжить.

## Какой способ для какой задачи

| Задача | Способ |
| :--- | :--- |
| Одно видео с метаданными | yt-dlp, [минимальный набор флагов](#одно-видео) |
| Канал целиком: видео, Shorts, трансляции | yt-dlp по адресу канала **без** вкладки, см. [Канал целиком](#канал-целиком) |
| Одна вкладка канала или плейлист | yt-dlp по адресу `/videos`, `/shorts`, `/streams` или плейлиста |
| Комментарии | `--write-comments`, см. [Комментарии](#комментарии) |
| Субтитры, автоматические субтитры, чат трансляции | `--write-subs`, `--write-auto-subs`, язык `live_chat` |
| Идущий эфир или запланированная премьера | `--live-from-start`, `--wait-for-video` |
| Записи сообщества (вкладка «Записи») | [Browsertrix](/kb/instruments/tools/browsertrix): yt-dlp берёт из них только приложенные видео |
| Свой канал: оригиналы загруженных видео | [Google Takeout](/kb/instruments/data-take-out/dto-google) |
| Без командной строки | графические программы, см. [Как сохранить видео с YouTube](/kb/instruments/data-take-out/dto-youtube) |
| Видео уже удалено | [Wayback Machine и ArchiveTeam](#если-видео-уже-удалено) |

## Установка

```bash
python3 -m pip install -U "yt-dlp[default]"
# для YouTube нужна ещё JavaScript-среда Deno (https://deno.com) и ffmpeg,
# например: brew install deno ffmpeg
```

С конца 2025 года yt-dlp без внешней JavaScript-среды (по умолчанию Deno) и компонента EJS работает с YouTube неполно. Установка через `yt-dlp[default]` или официальный бинарник уже включает EJS, Deno ставится отдельно. Некоторым клиентам YouTube нужен PO Token. Подробнее — в разделе «Зависимости» на странице [yt-dlp](/kb/instruments/tools/yt-dlp#зависимости).

## Одно видео

```bash
# видео, описание, метаданные в JSON, субтитры и обложка
yt-dlp --write-info-json --write-description --write-thumbnail \
  --write-subs --write-auto-subs --sub-langs "ru,en" \
  "https://www.youtube.com/watch?v=VIDEO_ID"
```

`*.info.json` — главный файл архива: в нём исходный адрес, название, автор, дата загрузки, описание, теги, главы и статистика на момент скачивания. Если видео потом удалят, по этому файлу можно описать, что именно было сохранено.

## Канал целиком

:::warning Адрес `/videos` — это только одна вкладка
По адресу `https://www.youtube.com/@ChannelHandle/videos` yt-dlp скачает только вкладку «Видео». Shorts и записи трансляций в неё не входят. Чтобы получить все загрузки канала, передавайте адрес канала без вкладки: тогда yt-dlp сам добавит вкладки «Трансляции» и Shorts, если они есть.
:::

Сначала полезно посмотреть, сколько на канале видео. С `--flat-playlist` yt-dlp только перечисляет ролики, ничего не скачивая:

```bash
yt-dlp --flat-playlist --print "%(id)s %(title)s" \
  "https://www.youtube.com/@ChannelHandle" > channel-list.txt
wc -l channel-list.txt
```

Затем — сама выгрузка:

```bash
yt-dlp --download-archive archive.txt \
  --write-info-json --write-description --write-thumbnail \
  --write-subs --write-auto-subs --sub-langs "ru,en" \
  --sleep-requests 1 --sleep-interval 5 --max-sleep-interval 15 \
  -o "%(channel)s/%(upload_date)s %(title)s [%(id)s].%(ext)s" \
  "https://www.youtube.com/@ChannelHandle"
```

- `--download-archive` записывает ID каждого скачанного видео. Повторный запуск той же команды докачивает только новое — так канал обновляют по расписанию.
- Паузы `--sleep-*` снижают риск временной блокировки. YouTube чаще всего отвечает на слишком быстрый сбор ошибкой 429 или просьбой подтвердить, что вы не бот.
- Вкладка видео «только для спонсоров» при обходе канала не извлекается.
- Метаданные канала и плейлистов (описание, обложки) yt-dlp тоже пишет в отдельные `*.info.json`.

Ограничить качество, а с ним и объём, можно форматом, например `-f "bv*[height<=1080]+ba/b[height<=1080]"` — см. «Выбрать качество» на странице [yt-dlp](/kb/instruments/tools/yt-dlp).

## Комментарии

```bash
yt-dlp --write-info-json --write-comments \
  --extractor-args "youtube:max_comments=1000" \
  "https://www.youtube.com/watch?v=VIDEO_ID"
```

Комментарии попадают в `*.info.json`, в массив `comments`, а не в отдельный файл. На популярных видео их сбор занимает больше времени, чем скачивание самого ролика. Параметр `max_comments` ограничивает объём. Полная форма — пять чисел через запятую: всего комментариев, верхнего уровня, ответов, ответов в одной ветке, глубина. `comment_sort=top` или `new` (по умолчанию) задаёт порядок на стороне YouTube.

Имена и тексты комментаторов — персональные данные, см. [ниже](#право).

## Субтитры и чат трансляции

- `--write-subs` — субтитры, загруженные автором.
- `--write-auto-subs` — автоматические субтитры YouTube. Это фактически расшифровка речи, полезная для поиска по архиву.
- `--list-subs` — показать доступные языки без скачивания.

Чат завершённой трансляции yt-dlp считает отдельной «дорожкой субтитров» с языком `live_chat`. Его сохраняют так:

```bash
yt-dlp --write-subs --sub-langs live_chat --skip-download \
  "https://www.youtube.com/watch?v=VIDEO_ID"
```

Чтобы скачать все субтитры, кроме чата, используйте `--sub-langs all,-live_chat`.

## Трансляции и премьеры

```bash
# идущий эфир с самого начала, а не с момента запуска команды
yt-dlp --live-from-start "https://www.youtube.com/watch?v=VIDEO_ID"

# запланированный эфир: проверять раз в 60 секунд и начать, когда он стартует
yt-dlp --wait-for-video 60 --live-from-start "https://www.youtube.com/watch?v=VIDEO_ID"
```

`--live-from-start` в yt-dlp помечен как экспериментальный. Для важного эфира запустите запись заранее и проверьте результат после окончания.

## Видео с ограничениями

Видео с возрастным ограничением и видео для спонсоров требуют входа: `--cookies-from-browser firefox` (или другой браузер) передаёт yt-dlp cookies вашего аккаунта. Используйте отдельный аккаунт: при автоматическом скачивании YouTube может его ограничить. Подробнее — разделы «Cookies» и «Зависимости» на странице [yt-dlp](/kb/instruments/tools/yt-dlp).

## Записи сообщества и вид страниц

На вкладке канала «Записи» (`/posts`) yt-dlp находит только видео и плейлисты, приложенные к записям или упомянутые в них ссылками. Текст и картинки записей он не сохраняет. Для записей сообщества и для вида страницы видео или канала используйте браузерную архивацию: [Browsertrix](/kb/instruments/tools/browsertrix) пишет WARC/WACZ.

## Если видео уже удалено

- **Свой архив.** `*.info.json` остаётся, даже если ролик удалили: по нему видно название, описание и дату.
- **Wayback Machine.** Снимки страницы видео ищут по ID:

  ```bash
  curl "https://web.archive.org/cdx/search/cdx?url=youtube.com/watch%3Fv%3DVIDEO_ID&output=json&limit=5"
  ```

  Обычно сохранена страница, а не сам видеофайл. Подробнее о запросах — [Wayback Machine API](/kb/instruments/tools/wayback-api).
- **ArchiveTeam.** О проектах по сохранению YouTube — на [вики ArchiveTeam](https://wiki.archiveteam.org/index.php/YouTube).

## Хранение результата

- Храните видео, `*.info.json`, описание, обложку и субтитры в одной папке: шаблон `-o` выше кладёт их рядом под одним именем.
- Сохраняйте `archive.txt` вместе с архивом: это опись уже скачанных ID.
- Паспорт сбора и контрольные суммы — по [методике](/kb/instruments/social-media/methodology#паспорт-сбора): адрес канала, дата сбора, версия yt-dlp, команда.

## YouTube в практике Ruarxive

В хранилище Ruarxive, в [`OGDHub/youtube/raw`](https://cdn.ruarxive.org/public/OGDHub/youtube/raw/), лежат mp4 четырёх каналов госорганов, собранные в 2013 году: Счётной палаты, МЧС, Банка России и Кремля, вместе 14,8 ГБ. Подробнее — в разделе [Сохранённые государственные ресурсы](/kb/projects/preserved-government).

## Право

- Имена и тексты комментаторов — [персональные данные](/kb/legal/personal-data).
- Публичная доступность видео не даёт права на его новую публикацию — см. [авторское право](/kb/legal/copyright).
- Условия YouTube ограничивают скачивание; как к правилам платформ относится архивация — [условия использования сервисов](/kb/legal/terms-of-service).

> Флаги и поведение сверены с README и исходным кодом yt-dlp 2026.10.26 (`yt_dlp/extractor/youtube/_tab.py`, октябрь 2026).

## Ресурсы

- [yt-dlp на GitHub](https://github.com/yt-dlp/yt-dlp)
- [Параметры экстрактора YouTube](https://github.com/yt-dlp/yt-dlp#youtube) (`max_comments`, `comment_sort`, `player_client`)
- [ArchiveTeam: YouTube](https://wiki.archiveteam.org/index.php/YouTube)

## Связанные материалы

- **[yt-dlp](/kb/instruments/tools/yt-dlp)** — установка, качество, конфигурация, регулярные выгрузки.
- **[Как сохранить видео с YouTube](/kb/instruments/data-take-out/dto-youtube)** — графические программы и выгрузка своего канала.
- **[Google Takeout](/kb/instruments/data-take-out/dto-google)** — оригиналы видео своего канала.
- **[Методика архивации соцсетей](/kb/instruments/social-media/methodology)** — паспорт сбора, аккаунт, темп, хранение.
- **[Rutube](/kb/instruments/social-media/rutube)**, **[TikTok](/kb/instruments/social-media/tiktok)**, **[ВКонтакте](/kb/instruments/social-media/vk)** — видео на других площадках.
