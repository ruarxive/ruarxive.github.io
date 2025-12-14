# Архивация видео (YouTube и др.)

Для сохранения видеоконтента стандартом де-факто является **yt-dlp**.

## yt-dlp

[yt-dlp](https://github.com/yt-dlp/yt-dlp) — это форк youtube-dl с активной разработкой и новыми функциями. Поддерживает тысячи сайтов (не только YouTube, но и VK, Rutube, Vimeo).

### Установка

```bash
pip install yt-dlp
# или
brew install yt-dlp
```

### Рекомендуемая команда для архивации

Для сохранения метаданных, описания, субтитров и обложки используйте:

```bash
yt-dlp --write-description \
       --write-info-json \
       --write-annotations \
       --write-sub \
       --write-thumbnail \
       --embed-metadata \
       URL
```

### Скачивание каналов

yt-dlp умеет скачивать каналы и плейлисты целиком.

```bash
yt-dlp --download-archive archive.txt https://www.youtube.com/c/ChannelName
```
Опция `--download-archive` позволяет запоминать уже скачанные видео и не качать их повторно при следующем запуске.

## Архивация комментариев

yt-dlp может сохранять комментарии в JSON (`--write-comments`), но для глубокого анализа дискуссий лучше использовать специализированные инструменты.
