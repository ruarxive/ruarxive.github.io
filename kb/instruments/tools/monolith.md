---
title: monolith
sidebar_label: monolith
description: Быстрый CLI на Rust для сохранения веб-страницы со всеми ресурсами в один HTML-файл, включая CSS, изображения и шрифты
---

# monolith

**monolith** — компактный CLI-инструмент, написанный на Rust, для сохранения веб-страницы в **один самодостаточный HTML-файл** со всеми встроенными ресурсами (CSS, изображениями, шрифтами, JS). Альтернатива [SingleFile](singlefile) для командной строки и скриптов.

Сайт: [github.com/Y2Z/monolith](https://github.com/Y2Z/monolith)

## Зачем нужен

Когда нужна **одна страница** без зависимостей — одним файлом, без сетевых запросов, без сюрпризов с CDN-блокировками. Главные отличия от SingleFile:

- **Чистый CLI** — без браузерного расширения, без JavaScript-движка.
- **Не выполняет JS** — статичный снимок HTML в момент загрузки.
- **Очень быстрый** — написан на Rust, обрабатывает страницу за секунды.
- **Минимальные зависимости** — один бинарник.

Где незаменим:
- **Скрипты и автоматизация** — без браузера.
- **Docker-окружения** — alpine-образ с monolith ≈ 5 МБ.
- **Серверы без GUI** — крошечный размер и нулевые зависимости.
- **Быстрые разовые задачи** — «сохрани эту страницу одной командой».

## Возможности

- **Один файл** — все CSS, изображения, шрифты, JS inline.
- **Опциональное удаление**:
  - JavaScript (`--no-js`).
  - Изображений (`--no-images`).
  - Видео/аудио (`--no-audio`, `--no-video`).
  - CSS (`--no-css`).
- **Base64-кодирование** ресурсов в HTML.
- **Извлечение и замена** — `-e` (CSS-блок из внешнего файла) и `-r` (replace string).
- **User-Agent** настраивается.
- **Cookies** через заголовки.
- **HTTP прокси**.
- **Output в файл или stdout** для пайпов.
- **TUI-режим** — интерактивное сохранение в терминале (опционально).
- **HTML-санитизация** — удаление опасных элементов (`-s`).
- **Кросс-компиляция** — Linux, macOS, Windows, FreeBSD, OpenBSD, NetBSD, Solaris.

## Когда использовать

✅ Подходит для:

- **Сохранения одной страницы** в скрипте или cron-задаче.
- **Server-side рендеринга** без headless-браузера.
- **CI/CD** — сохранение отчётов, документации, выгрузок.
- **Docker** — alpine-контейнер с monolith.
- **Быстрой обработки списка URL** в bash-пайплайне.

❌ Не подходит для:

- **Современных SPA** с обязательным JS (React, Vue без SSR) — страница будет пустой каркас.
- **Сайтов с защитой от ботов** (Cloudflare, Incapsula) — нет headless-браузера для обхода.
- **Страниц за авторизацией** — поддержка cookies ограничена.
- **Сложных медиа** (видео-плееры, интерактивные графики) — сохраняется как есть, без интерактива.

## Установка

### Через пакетные менеджеры

```bash
# macOS
brew install monolith

# Debian/Ubuntu (AUR или скачать .deb)
# https://github.com/Y2Z/monolith/releases

# Arch
yay -S monolith
# или
sudo pacman -S monolith

# Nix
nix-env -i monolith

# FreeBSD
pkg install monolith
```

### Cargo (из исходников)

```bash
cargo install monolith
```

### Готовые бинарники

```bash
# Linux x86_64
curl -L https://github.com/Y2Z/monolith/releases/latest/download/monolith-linux-x86_64.tar.gz \
  | tar -xz -C /usr/local/bin/ monolith
chmod +x /usr/local/bin/monolith
```

### Docker

```bash
docker run --rm -v $(pwd):/data ghcr.io/y2z/monolith \
  https://example.com > /data/page.html
```

## Использование

### Базовая команда

```bash
# В файл
monolith https://example.com > page.html

# Или с -o
monolith -o page.html https://example.com
```

### Удалить JavaScript

```bash
monolith --no-js https://example.com > page.html
```

Полезно для: очистки от трекеров, экономии места, страниц без полезного JS.

### Удалить изображения

```bash
monolith --no-images https://example.com > page.html
```

### Удалить всё «тяжёлое» для текстового архива

```bash
monolith --no-js --no-images --no-video --no-audio --no-css \
  https://example.com > page-text.html
```

Останется чистый текст со встроенными шрифтами и базовой вёрсткой.

### Cookies

```bash
monolith -c "session=abc123; auth=xyz789" https://example.com
```

### User-Agent

```bash
monolith -u "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36" \
  https://example.com
```

### Через прокси

```bash
monolith --proxy-host 127.0.0.1 --proxy-port 8080 https://example.com
```

### HTML-санитизация (удалить `<script>`, `<iframe>` и т.д.)

```bash
monolith -s https://example.com > clean.html
```

### Заменить строку в HTML (например, убрать трекеры)

```bash
monolith -r "google-analytics.com" "blocked.local" https://example.com
```

### Извлечь внешний CSS и заменить его inline-блоком

```bash
monolith -e "https://example.com/style.css" -r "stylesheet-link" "inline-style" \
  https://example.com
```

### Batch-обработка списка URL

```bash
# urls.txt — один URL на строку
while read url; do
  filename=$(echo "$url" | sed 's|https://||;s|/|_|g').html
  monolith "$url" > "$filename"
done < urls.txt
```

### Сохранение в stdout для пайпа

```bash
# Передать в gzip, загрузить по S3, отправить в архив
monolith https://example.com | gzip > page.html.gz
monolith https://example.com | aws s3 cp - s3://my-bucket/page.html
```

## Конфигурация

monolith намеренно минималистичен — конфиг-файла нет. Все настройки через CLI-флаги.

Полный список опций:

```bash
monolith --help
```

| Флаг | Описание |
| :--- | :--- |
| `-o, --output <file>` | Сохранить в файл |
| `-u, --user-agent <ua>` | User-Agent |
| `-c, --cookie <cookies>` | Cookies (header формат) |
| `--proxy-host`, `--proxy-port` | Прокси |
| `--timeout <seconds>` | Таймаут HTTP |
| `--no-css` | Удалить CSS |
| `--no-js` | Удалить JavaScript |
| `--no-images` | Удалить изображения |
| `--no-video` | Удалить видео |
| `--no-audio` | Удалить аудио |
| `--no-fonts` | Удалить шрифты |
| `--no-frames` | Удалить iframe |
| `-i, --isolate` | Изолировать страницу (CSS-неймспейсы) |
| `-s, --sanitize` | Удалить потенциально опасные элементы |
| `-e, --extract <url>` | Извлечь ресурс, заменить его в HTML |
| `-r, --replace <from> <to>` | Заменить строку в HTML |
| `-t, --transform <rules>` | Трансформации (CSS/JS) |
| `-a, --allow-attributes` | Разрешить определённые HTML-атрибуты |
| `-b, --base-url <url>` | Базовый URL для относительных путей |
| `-l, --language <code>` | Accept-Language |
| `-k, --insecure` | Игнорировать TLS-ошибки |

## Сравнение с другими инструментами

| Инструмент | Язык | JS | CLI | Расширение | Скорость |
| :--- | :--- | :---: | :---: | :---: | :--- |
| **monolith** | Rust | ❌ | ✅ | ❌ | ⚡ Очень быстро |
| **[SingleFile](singlefile)** | JavaScript | ✅ | ⚠️ | ✅ | 🟡 Средне |
| **[Obelisk](obelisk)** | Go | ❌ | ✅ | ❌ | ⚡ Быстро |
| **[monolith (Python)](https://github.com/monolith-software/monolith-py)** | Python | ❌ | ✅ | ❌ | 🟡 Медленнее |
| **[HTTrack](httrack)** | C | ❌ | ✅ | ❌ GUI | 🟡 Медленно (но с рекурсией) |
| **MHTML (Chrome встроенный)** | — | ✅ | ❌ | ✅ | ⚡ Встроенный |

### Когда monolith лучше всех

- Нужен **один бинарник без зависимостей** (≈ 5 МБ).
- **Скрипт на сервере** без GUI и без Node.js.
- Хочется **минимальный, предсказуемый результат** — без JS-рендера.
- **Docker-контейнер** минимального размера.

### Когда лучше SingleFile

- Страница с **обязательным JS** (SPA, динамическая загрузка).
- Нужно **расширение браузера** для интерактивной работы.
- Хочется **точное соответствие** тому, что видит пользователь.

### Когда лучше Obelisk

- Нужен **Go в стеке** (единый язык).
- Хочется **API/библиотеку** для интеграции.

## Best practices

### 1. Всегда удаляйте JS для долгосрочного хранения

```bash
monolith --no-js https://example.com > archive/page.html
```

JavaScript — главный источник нестабильности архивов: ссылки CDN умирают, API меняются, рекламные скрипты блокируются.

### 2. Используйте в пайплайнах с другими инструментами

```bash
# Сохранить страницу + сжать + положить в WARC
monolith --no-js https://example.com | \
  gzip > /tmp/page.html.gz

warc-tools -i /tmp/page.html.gz -o archive.warc.gz
```

### 3. Указывайте осмысленный User-Agent

```bash
monolith -u "Mozilla/5.0 (compatible; RuarxiveBot/1.0; +https://ruarxive.org)" URL
```

### 4. Таймаут обязателен

```bash
monolith --timeout 30 URL
```

Без таймаута может «висеть» на медленных ответах.

### 5. Для массовых выгрузок — параллелизм

```bash
# 4 параллельных процесса
cat urls.txt | xargs -n 1 -P 4 -I {} \
  sh -c 'monolith "$1" > "out/$(echo $1 | tr / _).html"' _ {}
```

### 6. Валидируйте выход

```bash
# Проверить, что HTML не пустой и содержит ожидаемое
monolith https://example.com > page.html
test -s page.html && grep -q "<title>" page.html && echo "OK"
```

## Ограничения

- **Нет JavaScript-рендера** — современные SPA сохранятся пустыми.
- **Нет рекурсивного обхода** — одна страница за раз.
- **Нет браузерной авторизации** — cookies передаются вручную.
- **Не обходит Cloudflare и подобные** — нужен прокси с реальным браузером.
- **Большие страницы** (несколько МБ) могут съесть память.
- **Бинарные форматы** (PDF, видео) сохраняются как base64 в HTML — непрактично.
- **Один URL за раз** — для массовых выгрузок нужен wrapper-скрипт.

## Ресурсы

- [GitHub: monolith](https://github.com/Y2Z/monolith) — исходный код.
- [Releases](https://github.com/Y2Z/monolith/releases) — готовые бинарники.
- [README](https://github.com/Y2Z/monolith/blob/master/README.md) — полная документация.
- [Y2Z/monolith на crates.io](https://crates.io/crates/monolith) — пакет Rust.
- [Discussion](https://github.com/Y2Z/monolith/discussions) — вопросы и tips.

## Связанные материалы

- **[SingleFile](singlefile)** — для страниц с обязательным JS.
- **[Obelisk](obelisk)** — Go-альтернатива.
- **[WebScrapBook](webscrapbook)** — для коллекций с структурой.
- **[Wget](wget)** — для рекурсивного обхода сайтов.
- **[Архивация в Docker](/kb/guides/custom-workflows)** — monolith в контейнерах.
- **[Экстренная архивация](/kb/guides/emergency-archiving)** — быстрый захват одной страницы.
- **[Формат MHTML](/kb/instruments/file-formats/mhtml)** — альтернативный формат одной страницы.
