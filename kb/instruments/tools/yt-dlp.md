---
title: yt-dlp
sidebar_label: yt-dlp
description: Форк youtube-dl с поддержкой 1800+ сайтов, обходом защит, загрузкой плейлистов, субтитров, метаданных и фрагментов HLS/DASH
---

# yt-dlp

**yt-dlp** — форк youtube-dl, активный в 2021 году после фактической остановки оригинального проекта. Сегодня это **де-факто стандарт** для скачивания видео и аудио с YouTube, VK-видео, Rutube, Vimeo, Twitch, SoundCloud и ещё ~1800 сайтов. Написан на Python, лицензия Unlicense.

Сайт: [github.com/yt-dlp/yt-dlp](https://github.com/yt-dlp/yt-dlp)

## Когда использовать

✅ Подходит, если нужно:

- скачать видео или аудио с **YouTube, VK, Rutube, Twitch, SoundCloud** и других платформ;
- получить **максимальное качество** (4K, HDR, отдельные дорожки видео/аудио);
- сохранить **субтитры, метаданные, превью** в одном проходе (`--write-info-json --write-subs --write-thumbnail`);
- вести **инкрементальный архив** канала/плейлиста через `--download-archive` (повторный запуск пропускает уже скачанные).

❌ Не лучший выбор, если:

- нужны только **изображения и галереи** — [gallery-dl](/kb/instruments/tools/gallery-dl);
- нужно сохранить **HTML-страницу с плеером** (а не сам файл) — [Browsertrix Crawler](/kb/instruments/tools/browsertrix) + yt-dlp;
- нужны только аудио-подкасты — [gallery-dl](/kb/instruments/tools/gallery-dl) + yt-dlp;
- контент защищён DRM — yt-dlp не обходит Widevine/PlayReady.

## Зачем нужен архивисту

Видеохостинги умирают: видео удаляют, каналы банят, плееры ломаются. Единственный надёжный способ сохранить ролик — **скачать оригинальный файл** или хотя бы его манифест (DASH/HLS). yt-dlp:

- **Скачивает исходный медиа-файл** в максимальном качестве.
- **Сохраняет метаданные**: title, описание, теги, имя автора, дата.
- **Пишет субтитры** (в т.ч. авто-сгенерированные) в SRT/VTT.
- **Пишет JSON** с полной информацией о ролике (для индексирования).
- **Обходит защиты** — нативная поддержка PO Token, visitor Data, mweb-клиента.
- **Работает в Docker** — для серверов без Python.

## Возможности

- **1800+ поддерживаемых сайтов** через систему экстракторов.
- **Выбор качества**: best, worst, конкретный формат (`-f 137+140`).
- **Слияние видео + аудио** через ffmpeg.
- **Загрузка плейлистов и каналов** целиком.
- **Субтитры**: ручные, авто, перевод.
- **Пост-процессинг**: ffmpeg, метаданные, превью, спонсор-блок.
- **SponsorBlock-интеграция**: вырезание/маркировка спонсорских вставок.
- **Прямая запись в архив** через `--download-archive` (текстовый файл с ID).
- **WARC-вывод** через `--write-pages` и `yt-dlp[default]` + обёртки.
- **Возобновление загрузки** и повторы при сбое.
- **Cookies** и аутентификация.
- **Proxy**, custom headers, custom player_client.
- **JSON-метаданные** для каждого видео.
- **Live streams** (запись в реальном времени).

## Когда использовать

✅ Подходит для:

- **Скачивания видео** с YouTube, VK Video, Rutube, Vimeo, Twitch и т.д.
- **Загрузки аудио** (подкасты, музыка).
- **Массовой архивации каналов/плейлистов**.
- **Извлечения субтитров** (для исследований, NLP).
- **Live-записи** стримов.
- **Сбора метаданных** для каталогизации.

❌ Не подходит для:

- **Скачивания страниц целиком** с комментариями и сайдбаром (для этого — Browsertrix).
- **Скачивания изображений/галерей** (для этого — [gallery-dl](gallery-dl)).
- **Обхода DRM** (Widevine и т.п.) — это технически возможно, но **юридически запрещено** в большинстве юрисдикций.
- **Стриминговых платформ с paywall** (Netflix, Кинопоиск) — без авторизации.

## Установка

### Через пакетные менеджеры (рекомендуется)

```bash
# macOS
brew install yt-dlp

# Linux (pipx — изолированная установка)
pipx install yt-dlp

# Ubuntu/Debian (PPA)
sudo add-apt-repository ppa:yt-dlp/ppa
sudo apt update && sudo apt install yt-dlp

# Arch
sudo pacman -S yt-dlp

# Windows
winget install yt-dlp
choco install yt-dlp
```

### Через pip

```bash
pip install -U yt-dlp
```

### Готовые бинарники (без зависимостей)

```bash
# Linux/macOS
sudo curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp \
          -o /usr/local/bin/yt-dlp
sudo chmod a+rx /usr/local/bin/yt-dlp
```

### Docker

```bash
docker run --rm -u $(id -u):$(id -g) \
  -v $(pwd):/work \
  ghcr.io/yt-dlp/yt-dlp \
  https://www.youtube.com/watch?v=VIDEO_ID
```

### Зависимости

- **Python 3.9+** (для pip-установки).
- **ffmpeg** — для слияния видео/аудио и пост-процессинга.

```bash
# Linux
sudo apt install ffmpeg

# macOS
brew install ffmpeg
```

## Использование

### Скачать одно видео

```bash
yt-dlp "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
```

По умолчанию скачает лучшее качество видео + аудио, смерджит через ffmpeg.

### Скачать только аудио (mp3)

```bash
yt-dlp -x --audio-format mp3 "https://www.youtube.com/watch?v=VIDEO_ID"
```

`-x` — extract audio. Добавьте `--audio-quality 0` для максимального качества.

### Выбрать качество

```bash
# Лучшее видео до 1080p + лучшее аудио
yt-dlp -f "bestvideo[height<=?1080]+bestaudio" URL

# Только 720p
yt-dlp -f "bestvideo[height<=720]+bestaudio" URL

# Конкретный формат (список через -F)
yt-dlp -F URL  # показать доступные форматы
yt-dlp -f 137+140 URL
```

### Скачать плейлист

```bash
yt-dlp "https://www.youtube.com/playlist?list=PLxxxxxx"

# С диапазоном
yt-dlp --playlist-items 1-10 "https://www.youtube.com/playlist?list=PLxxxxxx"

# С начала до 50-го видео
yt-dlp --playlist-items "1-50" URL
```

### Скачать весь канал

```bash
yt-dlp "https://www.youtube.com/@ChannelName"
```

### С субтитрами и метаданными

```bash
yt-dlp --write-subs --write-auto-subs --sub-langs "ru,en" \
       --write-info-json --write-thumbnail \
       --write-description \
       URL
```

Файлы на выходе:
- `Title [VIDEO_ID].mp4` — видео.
- `Title [VIDEO_ID].info.json` — все метаданные.
- `Title [VIDEO_ID].ru.vtt`, `.en.vtt` — субтитры.
- `Title [VIDEO_ID].jpg` — превью.

### С ограничением скорости (для вежливого скачивания)

```bash
yt-dlp --limit-rate 5M URL
```

### С cookies (для приватных/age-restricted видео)

```bash
# Экспорт cookies из браузера
yt-dlp --cookies-from-browser firefox URL

# Из файла
yt-dlp --cookies cookies.txt URL
```

### Возобновление после обрыва

```bash
yt-dlp -c URL
```

### Архив скачанных (чтобы не качать повторно)

```bash
yt-dlp --download-archive archive.txt "https://www.youtube.com/playlist?list=PLxxxx"
```

Каждое успешно скачанное видео запишется в `archive.txt`. При повторном запуске — будет пропущено.

### Удалить спонсорские вставки (SponsorBlock)

```bash
yt-dlp --sponsorblock-mark all URL  # пометить
yt-dlp --sponsorblock-remove sponsor URL  # вырезать
```

### Через прокси (Tor, VPN, корпоративный)

```bash
yt-dlp --proxy "socks5://127.0.0.1:9050" URL
```

## Конфигурация

### `~/.config/yt-dlp/config` (Linux/macOS)

```ini
# Формат имени файла
-o %(uploader)s/%(playlist_index)s - %(title)s [%(id)s].%(ext)s

# Аутентификация (cookies из браузера по умолчанию)
--cookies-from-browser firefox

# Ограничения
--limit-rate 10M
--concurrent-fragments 4

# Субтитры
--write-auto-subs --sub-langs ru,en

# Метаданные
--write-info-json --write-thumbnail

# Архив
--download-archive ~/.yt-dlp-archive.txt

# SponsorBlock
--sponsorblock-remove sponsor,selfpromo

# Лог
--console-title --progress-template "downloading %(progress._percent_str) of %(progress._total_bytes_str)"
```

### `yt-dlp.conf` (Windows)

```ini
-o C:\Users\user\Videos\%(title)s [%(id)s].%(ext)s
--write-info-json
--download-archive C:\Users\user\yt-dlp-archive.txt
```

## Сравнение с другими инструментами

| Инструмент | Сайтов | Видео | Live | SponsorBlock | Язык |
| :--- | :---: | :---: | :---: | :---: | :--- |
| **yt-dlp** | 1800+ | ✅ | ✅ | ✅ | Python |
| **youtube-dl** | 1200+ | ✅ | ⚠️ | ❌ | Python |
| **gallery-dl** | 200+ | ❌ | ❌ | ❌ | Python |
| **newpipe** | ~30 | ✅ | ✅ | ✅ | Java (Android) |
| **lux** | 30+ | ✅ | ❌ | ❌ | Go |
| **you-get** | 80+ | ✅ | ❌ | ❌ | Python |

### Когда yt-dlp лучше всех

- Нужно **максимальное качество** (4K, HDR, high-bitrate audio).
- Нужны **субтитры, метаданные, превью**.
- Нужна **обратная совместимость** со старыми youtube-dl скриптами.
- Нужны **новые фичи** (PO Token, mweb client).

### Когда лучше альтернативы

- **Только YouTube на Android** — [NewPipe](https://newpipe.net/) (без рекламы, без Google-аккаунта).
- **Изображения, а не видео** — [gallery-dl](gallery-dl).
- **Минимализм и CLI без зависимостей** — [lux](https://github.com/iawia002/lux).

## Best practices

### 1. Используйте `--write-info-json` всегда

Метаданные бесценны при каталогизации. `info.json` содержит всё: описание, теги, статистику, форматы, время публикации, имя загруженных субтитров.

### 2. SponsorBlock — для архивирования подкастов, обзоров, геймплея

```bash
yt-dlp --sponsorblock-remove all URL
```

### 3. Параллельная загрузка плейлистов

```bash
yt-dlp --concurrent-fragments 8 --parallel 4 "https://www.youtube.com/playlist?list=PLxxxx"
```

`--parallel 4` — одновременно 4 плейлиста, `--concurrent-fragments 8` — 8 фрагментов на каждый.

### 4. Регулярные выгрузки через cron

```bash
# Каждое воскресенье в 4 утра — обновить архив канала
0 4 * * 0 /usr/local/bin/yt-dlp \
  --download-archive /opt/yt-dlp/archive.txt \
  --output "/opt/yt-dlp/%(uploader)s/%(upload_date)s - %(title)s [%(id)s].%(ext)s" \
  --write-info-json --write-thumbnail --write-subs --sub-langs ru,en \
  "https://www.youtube.com/@ChannelName" \
  >> /var/log/yt-dlp.log 2>&1
```

### 5. Доверяйте только официальным экстракторам

yt-dlp имеет систему экстракторов, которые обновляются еженедельно. Не используйте сторонние форки (часто содержат малварь или backdoor).

### 6. Для больших архивов — внешний диск

```bash
yt-dlp -o "/mnt/external/yt-archive/%(uploader)s/%(title)s [%(id)s].%(ext)s" URL
```

### 7. WARC-вывод (экспериментально)

```bash
yt-dlp --write-pages --write-page-urls URL
# Сохраняет HTML-страницы, с которых скачано видео
# Не полноценный WARC, но полезно для контекста
```

> [!NOTE]
> Полноценный WARC yt-dlp **не пишет** — для этого используйте Browsertrix + yt-dlp: сначала архивируете страницу с видео, потом скачиваете файл.

## Ограничения

- **DRM-защищённый контент** не скачивается без специальных инструментов (юридически серая зона).
- **Зависимость от ffmpeg** для слияния и пост-процессинга.
- **Блокировки YouTube** — Google периодически меняет API, yt-dlp приходится быстро обновлять. **Регулярно делайте `yt-dlp -U`** или используйте свежие сборки.
- **Не качает плейлисты в обратном порядке** (можно через `--playlist-reverse`).
- **Live-стримы** требуют постоянной работы, нет фоновой записи.
- **Лимиты** — YouTube и другие сервисы могут ограничивать по IP, нужны паузы.
- **Не пишет полноценный WARC** — `--write-pages` сохраняет HTML-страницы, но без строгой WARC-семантики. Для полноценного WARC: [Browsertrix Crawler](/kb/instruments/tools/browsertrix).
- **Нет API для запросов** — только CLI; для интеграции с пайплайнами оборачивайте в subprocess.

## Что дальше

- Для полнотекстового поиска по субтитрам — проиндексируйте `.info.json` + `.vtt` через [metawarc](/kb/instruments/ruarxive-tools/metawarc) (предварительно упаковав в WARC или используя его ability читать папки).
- Если нужна интеграция с AI-агентами для анализа видео-коллекций — [metawarc MCP-сервер](/kb/instruments/ruarxive-tools/metawarc-mcp).
- Для регулярной архивации канала — добавьте команду в cron (см. «Best practices» выше) с `--download-archive`.
- Для правовой оценки — см. [Правовые вопросы](/kb/legal).

## Юридические аспекты

> [!WARNING]
> Скачивание видео может нарушать условия использования платформы. В ряде юрисдикций (ЕС, Россия для личного использования) это допустимо; в США — серая зона; в Германии — запрещено. **Перед массовой архивацией уточните правовую базу** в разделе [Правовые вопросы](/kb/legal/).

Для архивистов:
- **Свободно лицензированный контент** (CC, public domain) — можно без ограничений.
- **Личные/исследовательские цели** — в большинстве юрисдикций допустимо.
- **Перепубликация** — почти всегда нарушение, кроме CC0/CC-BY.

## Ресурсы

- [Репозиторий yt-dlp](https://github.com/yt-dlp/yt-dlp) — исходный код, issues, releases.
- [Документация](https://github.com/yt-dlp/yt-dlp#readme) — все опции.
- [Supported sites](https://github.com/yt-dlp/yt-dlp/blob/master/supportedsites.md) — список ~1800 сайтов.
- [Wiki](https://github.com/yt-dlp/yt-dlp/wiki) — FAQ, troubleshooting.
- [SponsorBlock](https://sponsor.ajay.app/) — база данных спонсорских сегментов.
- [FFmpeg](https://ffmpeg.org/) — необходимая зависимость для пост-процессинга.

## Связанные материалы

- **[gallery-dl](gallery-dl)** — для изображений и галерей.
- **[tdl](tdl)** — для Telegram-каналов.
- **[Архивация YouTube](/kb/instruments/data-take-out/dto-youtube)** — Data Take Out + yt-dlp.
- **[Архивация Rutube](/kb/instruments/social-media/rutube)** — российский видеохостинг.
- **[Архивация ВКонтакте](/kb/instruments/social-media/vk)** — VK-видео через yt-dlp.
- **[Экстренная архивация](/kb/guides/emergency-archiving)** — yt-dlp как один из быстрых инструментов.
- **[Правовые вопросы](/kb/legal/copyright)** — юридические аспекты скачивания.
- **[wparc](/kb/instruments/ruarxive-tools/wparc)** — для WordPress-сайтов с видео.
- **[Browsertrix](browsertrix)** — если нужно сохранить страницу с видеоплеером.
