---
title: yt-dlp
sidebar_label: yt-dlp
description: "yt-dlp — консольный загрузчик видео и аудио с YouTube, VK Видео, Rutube и более 1700 сайтов: форматы, плейлисты, субтитры, метаданные, инкрементальный архив."
last_update:
  date: 2026-10-12
---

# yt-dlp

**yt-dlp** — консольный загрузчик видео и аудио. Проект появился в 2020 году как форк youtube-dlc (который, в свою очередь, ответвился от youtube-dl) и стал стандартом де-факто для скачивания с YouTube, VK Видео, Rutube, Vimeo, Twitch, SoundCloud и [более 1700 других сайтов](https://github.com/yt-dlp/yt-dlp/blob/master/supportedsites.md). Написан на Python, лицензия Unlicense.

Сайт: [github.com/yt-dlp/yt-dlp](https://github.com/yt-dlp/yt-dlp)

## Когда использовать

✅ Подходит, если нужно:

- скачать видео или аудио с YouTube, VK, Rutube, Twitch, SoundCloud и других платформ;
- получить максимальное качество (отдельные дорожки видео и аудио со слиянием через ffmpeg);
- сохранить субтитры, метаданные, превью и комментарии за один проход;
- вести инкрементальный архив канала или плейлиста через `--download-archive`;
- записать прямую трансляцию.

❌ Не лучший выбор, если:

- нужны изображения и галереи — [gallery-dl](/kb/instruments/tools/gallery-dl);
- нужно сохранить саму страницу с плеером и комментариями как веб-страницу — [Browsertrix Crawler](/kb/instruments/tools/browsertrix), а файл видео — дополнительно через yt-dlp;
- нужен WARC: yt-dlp его не пишет;
- контент защищён DRM: yt-dlp DRM не обходит и не должен.

## Зачем нужен архивисту

Видео удаляют, каналы блокируют, плееры меняются. Самый надёжный способ сохранить ролик — скачать исходный медиафайл вместе с метаданными. yt-dlp:

- скачивает медиафайл в выбранном качестве;
- сохраняет метаданные (название, описание, теги, автор, дата) в `.info.json`;
- пишет субтитры, в том числе автоматические, в VTT/SRT;
- сохраняет превью и при желании комментарии (`--write-comments`);
- ведёт журнал скачанного, чтобы повторный запуск докачивал только новое.

## Установка

```bash
# pip (рекомендуемый вариант с зависимостями)
python3 -m pip install -U "yt-dlp[default]"

# pipx — изолированная установка
pipx install yt-dlp

# macOS / Linux (Homebrew)
brew install yt-dlp

# Arch
sudo pacman -Syu yt-dlp

# Windows
winget install --source winget --id yt-dlp.yt-dlp
# или: scoop install yt-dlp / choco install yt-dlp
```

Готовый бинарник без Python:

```bash
sudo curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp \
  -o /usr/local/bin/yt-dlp
sudo chmod a+rx /usr/local/bin/yt-dlp
```

Официального PPA для Ubuntu и официального Docker-образа нет. Пакеты в репозиториях дистрибутивов часто устаревают: для YouTube это критично.

### Зависимости

- **Python 3.10+** (для установки через pip).
- **ffmpeg и ffprobe** — для слияния видео и аудио и постобработки.
- **JavaScript-среда для YouTube.** С конца 2025 года для полноценной работы с YouTube yt-dlp решает JavaScript-задачи YouTube внешней средой выполнения через компонент **yt-dlp-ejs**. Рекомендуется [Deno](https://deno.com) (включён по умолчанию). Можно использовать Node.js или QuickJS: `--js-runtimes node`. В официальных бинарниках и при установке `yt-dlp[default]` компонент EJS уже есть, остаётся поставить Deno. Подробности — в [wiki: EJS](https://github.com/yt-dlp/yt-dlp/wiki/EJS).
- **PO Token.** Некоторым клиентам YouTube нужен PO Token. Его получают через сторонние плагины-провайдеры или передают вручную (`--extractor-args "youtube:po_token=..."`); см. [PO Token Guide](https://github.com/yt-dlp/yt-dlp/wiki/PO-Token-Guide).

```bash
# Linux
sudo apt install ffmpeg
# macOS
brew install ffmpeg deno
```

### Обновление

```bash
yt-dlp -U                      # для официальных бинарников
python3 -m pip install -U "yt-dlp[default]"   # для pip
```

Для YouTube авторы рекомендуют канал `nightly` (`yt-dlp --update-to nightly`). Большинство поломок с YouTube исправляется обновлением.

> Флаги сверены с `yt-dlp --help` версии 2026.08.19 и README (октябрь 2026).

## Использование

### Скачать одно видео

```bash
yt-dlp "https://www.youtube.com/watch?v=VIDEO_ID"
```

По умолчанию скачивается лучшее видео и лучшее аудио, а затем они сливаются через ffmpeg.

### Только аудио

```bash
yt-dlp -x --audio-format mp3 --audio-quality 0 "https://www.youtube.com/watch?v=VIDEO_ID"
```

Для архива лучше не перекодировать: `-x` без `--audio-format` сохранит исходную дорожку.

### Выбрать качество

```bash
# лучшее видео не выше 1080p + лучшее аудио
yt-dlp -f "bv*[height<=1080]+ba/b[height<=1080]" URL

# посмотреть доступные форматы и выбрать конкретные
yt-dlp -F URL
yt-dlp -f 137+140 URL
```

### Плейлист и канал

```bash
yt-dlp "https://www.youtube.com/playlist?list=PLxxxxxx"

# только элементы 1–10 (синтаксис START:STOP; старый вид 1-10 тоже работает)
yt-dlp -I 1:10 "https://www.youtube.com/playlist?list=PLxxxxxx"

# в обратном порядке
yt-dlp -I ::-1 "https://www.youtube.com/playlist?list=PLxxxxxx"

# весь канал
yt-dlp "https://www.youtube.com/@ChannelName"
```

### Субтитры и метаданные

```bash
yt-dlp --write-subs --write-auto-subs --sub-langs "ru,en" \
       --write-info-json --write-thumbnail --write-description \
       URL
```

Файлы на выходе:

- `Title [VIDEO_ID].mp4` (или `.webm`/`.mkv`) — видео;
- `Title [VIDEO_ID].info.json` — все метаданные;
- `Title [VIDEO_ID].ru.vtt`, `.en.vtt` — субтитры;
- `Title [VIDEO_ID].webp` или `.jpg` — превью;
- `Title [VIDEO_ID].description` — описание.

### Вежливое скачивание

```bash
yt-dlp --limit-rate 5M --sleep-requests 1 --sleep-interval 5 --max-sleep-interval 15 URL
```

### Cookies (видео с ограничением по возрасту, приватные плейлисты своего аккаунта)

```bash
yt-dlp --cookies-from-browser firefox URL
yt-dlp --cookies cookies.txt URL
```

### Возобновление

```bash
yt-dlp -c URL
```

Докачка частично загруженных файлов включена по умолчанию.

### Архив скачанного

```bash
yt-dlp --download-archive archive.txt "https://www.youtube.com/playlist?list=PLxxxx"
```

ID каждого скачанного видео записывается в `archive.txt`; при повторном запуске такие видео пропускаются. С `--break-on-existing` обход останавливается на первом уже скачанном видео, что ускоряет регулярные обновления каналов.

### SponsorBlock

```bash
yt-dlp --sponsorblock-mark all URL          # отметить главы
yt-dlp --sponsorblock-remove sponsor URL    # вырезать
```

Для архива лучше только отмечать (`--sponsorblock-mark`), а не вырезать фрагменты: исходный файл должен остаться полным.

## Конфигурация

Файл `~/.config/yt-dlp/config` (Linux/macOS) или `%APPDATA%\yt-dlp\config` (Windows):

```ini
# шаблон имени файла
-o %(uploader)s/%(upload_date)s - %(title)s [%(id)s].%(ext)s

# параллельная загрузка фрагментов одного видео (HLS/DASH)
--concurrent-fragments 4

# метаданные
--write-info-json
--write-thumbnail
--write-auto-subs
--sub-langs ru,en

# архив
--download-archive ~/.yt-dlp-archive.txt

# прогресс в заголовке окна
--console-title
--progress-template "download-title:%(info.id)s-%(progress.eta)s"
```

Шаблоны прогресса используют синтаксис форматирования Python: `%(progress._percent_str)s`, `%(progress._total_bytes_str)s` (с суффиксом `s`).

## Сравнение с другими инструментами

| Инструмент | Видео | Live | Статус | Язык |
| :--- | :---: | :---: | :--- | :--- |
| **yt-dlp** | ✅ | ✅ | Активен | Python |
| **youtube-dl** | ✅ | ⚠️ | Обновляется редко, без релизов на PyPI с 2021 года | Python |
| **[gallery-dl](gallery-dl)** | ⚠️ (через yt-dlp) | ❌ | Активен | Python |
| **[NewPipe](https://newpipe.net/)** | ✅ | ✅ | Активен | Java/Kotlin (Android) |
| **[lux](https://github.com/iawia002/lux)** | ✅ | ❌ | — | Go |

### Когда лучше альтернативы

- **Просмотр и скачивание YouTube на Android** — NewPipe.
- **Изображения, а не видео** — [gallery-dl](gallery-dl).
- **Графический интерфейс** — см. [GUI-оболочки для youtube-dl/yt-dlp](youtube-dl-gui).

## Рекомендации

### 1. Всегда сохраняйте `--write-info-json`

`info.json` содержит описание, теги, статистику, список форматов, время публикации и сведения о субтитрах: это основа каталогизации.

### 2. Параллельность

yt-dlp скачивает видео плейлиста **последовательно**: флага для параллельной загрузки нескольких видео нет. Внутри одного видео параллельно качаются фрагменты (`-N`/`--concurrent-fragments`). Чтобы скачивать несколько видео одновременно, запускайте отдельные процессы, например через `xargs`:

```bash
# urls.txt — по ссылке на строку; 3 процесса одновременно
xargs -P 3 -n 1 yt-dlp --download-archive archive.txt -N 4 < urls.txt
```

При параллельном запуске с одним `--download-archive` возможны гонки при записи. Надёжнее давать каждому процессу свой список URL. Слишком агрессивная параллельность приводит к блокировкам по IP.

### 3. Регулярные выгрузки через cron

```bash
# каждое воскресенье в 4:00 — обновить архив канала
0 4 * * 0 /usr/local/bin/yt-dlp \
  --download-archive /opt/yt-dlp/archive.txt --break-on-existing \
  --output "/opt/yt-dlp/\%(uploader)s/\%(upload_date)s - \%(title)s [\%(id)s].\%(ext)s" \
  --write-info-json --write-thumbnail --write-subs --sub-langs ru,en \
  "https://www.youtube.com/@ChannelName" \
  >> /var/log/yt-dlp.log 2>&1
```

В crontab символ `%` нужно экранировать (`\%`).

### 4. Используйте официальные сборки

Скачивайте yt-dlp только из официального репозитория, PyPI или пакетных менеджеров. Плагины (в том числе провайдеры PO Token) выполняют произвольный код: ставьте только те, которым доверяете.

### 5. Страница + файл

yt-dlp не пишет WARC. Флаг `--write-pages` — отладочный: он сохраняет промежуточные страницы в файлы `.dump`, это не архив. Если нужен контекст (страница, комментарии, описание в исходном виде), соберите страницу [Browsertrix](/kb/instruments/tools/browsertrix), а медиафайл — yt-dlp.

## Встраивание в Python

У yt-dlp есть Python API (раздел «EMBEDDING YT-DLP» в README):

```python
import yt_dlp

opts = {
    "outtmpl": "%(uploader)s/%(title)s [%(id)s].%(ext)s",
    "writeinfojson": True,
    "download_archive": "archive.txt",
}
with yt_dlp.YoutubeDL(opts) as ydl:
    ydl.download(["https://www.youtube.com/watch?v=VIDEO_ID"])
```

## Ограничения

- DRM-защищённый контент не скачивается.
- Нужен ffmpeg для слияния и постобработки, а для YouTube — JavaScript-среда (Deno).
- YouTube регулярно меняет защиту, поэтому yt-dlp нужно часто обновлять.
- Платформы ограничивают частоту запросов по IP: делайте паузы.
- Не пишет WARC.

## Что дальше

- Для поиска по субтитрам и метаданным загрузите `.info.json` и `.vtt` в свою базу или поисковый индекс.
- Для регулярной архивации канала добавьте команду в cron с `--download-archive` (см. выше).
- Правовые вопросы — в разделе [Правовые вопросы](/kb/legal).

## Юридические аспекты

:::warning
Скачивание видео может нарушать условия использования платформы и авторские права. Публичная доступность ролика не означает разрешения на копирование и распространение. Обходить технические средства защиты (DRM) нельзя. Перед массовой архивацией и особенно перед публикацией копий изучите раздел [Правовые вопросы](/kb/legal/copyright) и при необходимости проконсультируйтесь с юристом.
:::

- Контент под свободными лицензиями (Creative Commons, общественное достояние) можно использовать на условиях этих лицензий.
- Перепубликация чужих видео без разрешения правообладателя почти всегда нарушает авторские права.

## Ресурсы

- [Репозиторий yt-dlp](https://github.com/yt-dlp/yt-dlp)
- [README: все опции](https://github.com/yt-dlp/yt-dlp#readme)
- [Поддерживаемые сайты](https://github.com/yt-dlp/yt-dlp/blob/master/supportedsites.md)
- [Wiki: FAQ](https://github.com/yt-dlp/yt-dlp/wiki/FAQ), [EJS](https://github.com/yt-dlp/yt-dlp/wiki/EJS), [PO Token Guide](https://github.com/yt-dlp/yt-dlp/wiki/PO-Token-Guide)
- [SponsorBlock](https://sponsor.ajay.app/)
- [FFmpeg](https://ffmpeg.org/)

## Связанные материалы

- **[gallery-dl](gallery-dl)** — изображения и галереи.
- **[tdl](tdl)** — Telegram-каналы.
- **[GUI-оболочки](youtube-dl-gui)** — графические интерфейсы к yt-dlp.
- **[Архивация YouTube](/kb/instruments/data-take-out/dto-youtube)**
- **[Архивация Rutube](/kb/instruments/social-media/rutube)**
- **[Архивация ВКонтакте](/kb/instruments/social-media/vk)**
- **[Экстренная архивация](/kb/guides/emergency-archiving)**
- **[Правовые вопросы](/kb/legal/copyright)**
- **[Browsertrix](browsertrix)** — если нужно сохранить страницу с видеоплеером.
