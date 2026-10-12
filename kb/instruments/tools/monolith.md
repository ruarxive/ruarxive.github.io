---
title: monolith
sidebar_label: monolith
description: "monolith — быстрый CLI на Rust для сохранения веб-страницы со всеми ресурсами (CSS, изображения, шрифты, JS) в один HTML-файл или в MHTML."
last_update:
  date: 2026-10-12
---

# monolith

**monolith** — компактный инструмент командной строки на Rust для сохранения веб-страницы в **один самодостаточный HTML-файл**: CSS, изображения, шрифты и JavaScript встраиваются в документ как data URL. Может также сохранять страницу в формате **MHTML**. Альтернатива [SingleFile](/kb/instruments/tools/singlefile) для командной строки и скриптов. Лицензия — CC0-1.0 (общественное достояние).

Сайт: [github.com/Y2Z/monolith](https://github.com/Y2Z/monolith)

## Зачем нужен

Когда нужна **одна страница** без внешних зависимостей — одним файлом, который откроется в браузере без сети. Главные отличия от SingleFile:

- **Чистый CLI** — без браузерного расширения и без JavaScript-движка.
- **Не выполняет JS** — сохраняется HTML в том виде, в каком его отдал сервер.
- **Быстрый** — написан на Rust.
- **Один бинарник** без зависимостей.

Где незаменим:
- **Скрипты и автоматизация** — без браузера.
- **Серверы без графического интерфейса**.
- **Быстрые разовые задачи** — «сохрани эту страницу одной командой».

## Возможности

- **Один файл** — CSS, изображения, шрифты, JS встраиваются в HTML.
- **Формат MHTML** (`-m`) вместо HTML.
- **Выборочное удаление**: JavaScript (`-j`), изображения (`-i`), CSS (`-c`), шрифты (`-F`), фреймы (`-f`), аудио (`-a`), видео (`-v`).
- **Изоляция документа** (`-I`) — сохранённая страница не будет обращаться к сети.
- **Белые и чёрные списки доменов** для загрузки ресурсов (`-d`, `-B`).
- **Свой User-Agent** (`-u`) и **cookies из файла** (`-C`, формат Netscape).
- **Прокси** — через переменные окружения `https_proxy`, `http_proxy`, `no_proxy`.
- **Вывод в файл или stdout** для пайпов; чтение HTML из stdin.
- **Метаданные**: по умолчанию в файл добавляется комментарий с исходным URL и временем сохранения (`-M` отключает).
- **Графический интерфейс** — отдельная программа `monolith-gui` (собирается с функцией `gui`).

## Когда использовать

✅ Подходит для:

- **сохранения одной страницы** в скрипте или cron-задаче;
- **CI/CD** — сохранение отчётов, документации;
- **быстрой обработки списка URL** в bash-пайплайне.

❌ Не подходит для:

- **современных SPA** с обязательным JS (React, Vue без SSR) — сохранится пустой каркас; в README предлагается предварительно получить DOM через headless Chromium (см. ниже);
- **сайтов с защитой от ботов** — monolith не выполняет JavaScript-проверки; обходить защиту нельзя, используйте другие источники копии;
- **рекурсивного обхода сайта** — monolith сохраняет одну страницу;
- **сложных медиа** (видеоплееры, интерактивные графики) — сохраняются без интерактивности.

## Установка

### Через пакетные менеджеры

```bash
# macOS / Linux (Homebrew)
brew install monolith

# Arch Linux
sudo pacman -S monolith

# Alpine Linux
apk add monolith

# Snap
snap install monolith

# Nix
nix-env -iA nixpkgs.monolith

# FreeBSD
pkg install monolith

# Windows
winget install --id=Y2Z.Monolith -e
# или
choco install monolith
scoop install main/monolith
```

Для Debian README предлагает APT-репозиторий [pkg.haus](https://pkg.haus) (`sudo apt install monolith` после его подключения).

### Cargo

```bash
cargo install monolith
```

### Готовые бинарники

В релизах публикуются бинарники `monolith-linux-x86_64`, `monolith-linux-aarch64`, `monolith-linux-armhf` и `monolith.exe`:

```bash
sudo curl -L -o /usr/local/bin/monolith \
  https://github.com/Y2Z/monolith/releases/latest/download/monolith-linux-x86_64
sudo chmod +x /usr/local/bin/monolith
monolith -V
```

### Docker

Готовый образ в README не публикуется — его собирают из репозитория:

```bash
git clone https://github.com/Y2Z/monolith.git
cd monolith
docker build -t y2z/monolith .
sudo install -b dist/run-in-container.sh /usr/local/bin/monolith
```

> Команды и параметры сверены с README и `src/main.rs` репозитория `Y2Z/monolith` версии 2.11.3 (октябрь 2026).

## Использование

### Базовая команда

```bash
# В файл
monolith https://example.com -o page.html

# В stdout
monolith https://example.com > page.html

# Имя файла из заголовка страницы и времени
monolith https://example.com -o %title%.%timestamp%.html
```

### В формате MHTML

```bash
monolith -m https://example.com -o page.mhtml
```

### Удалить JavaScript

```bash
monolith -j https://example.com -o page.html
```

Полезно для очистки от трекеров, экономии места и для страниц, где JS не нужен для отображения содержимого.

### Удалить изображения

```bash
monolith -i https://example.com -o page.html
```

### Оставить только текст и вёрстку

```bash
monolith -j -i -v -a -F https://example.com -o page-text.html
```

Останутся HTML и встроенный CSS; если убрать и CSS (`-c`), останется только текст с базовой разметкой.

### Cookies

```bash
monolith -C cookies.txt https://example.com/private -o page.html
```

Cookies передаются только файлом в формате Netscape (его можно экспортировать из браузера расширением). Внимание: `-c` (строчная) — это `--no-css`, а не cookies.

Для HTTP Basic-авторизации логин и пароль указываются в URL: `monolith https://user:password@example.com -o page.html`.

### User-Agent

```bash
monolith -u "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36" \
  https://example.com -o page.html
```

### Через прокси

```bash
https_proxy=http://127.0.0.1:8080 monolith https://example.com -o page.html
```

### Только ресурсы с указанных доменов

```bash
# Загружать ресурсы только с example.com и www.example.com
monolith -I -d example.com -d www.example.com https://example.com -o example-only.html

# Не загружать ресурсы с перечисленных доменов (например, рекламных)
monolith -I -B -d .googleusercontent.com -d googleanalytics.com -d .google.com \
  https://example.com -o example-no-ads.html
```

### Страницы, которые строятся JavaScript-ом

monolith не выполняет JavaScript, но может обработать DOM, полученный от headless Chromium (пример из README):

```bash
chromium --headless --window-size=1920,1080 --run-all-compositor-stages-before-draw \
  --virtual-time-budget=9000 --incognito --dump-dom https://github.com \
  | monolith - -I -b https://github.com -o github.html
```

### Обработка списка URL

```bash
# urls.txt — один URL на строку
while read -r url; do
  filename=$(echo "$url" | sed 's|https\?://||;s|/|_|g').html
  monolith "$url" -o "$filename"
done < urls.txt
```

### Вывод в пайп

```bash
monolith https://example.com | gzip > page.html.gz
monolith https://example.com | aws s3 cp - s3://my-bucket/page.html
```

## Параметры

Конфигурационного файла нет, всё задаётся флагами. Полный список — `monolith --help`.

| Флаг | Описание |
| :--- | :--- |
| `-o, --output <file>` | Записать в файл (`-` — в stdout) |
| `-m, --mhtml` | Сохранить в формате MHTML |
| `-u, --user-agent <ua>` | User-Agent |
| `-C, --cookie-file <file>` | Cookies из файла (формат Netscape) |
| `-t, --timeout <seconds>` | Таймаут сетевого запроса (по умолчанию 120 секунд) |
| `-b, --base-url <url>` | Базовый URL для относительных ссылок |
| `-d, --domain <domain>` | Домены для белого (или, с `-B`, чёрного) списка |
| `-B, --blacklist-domains` | Считать домены из `-d` чёрным списком |
| `-I, --isolate` | Изолировать документ от сети |
| `-c, --no-css` | Удалить CSS |
| `-j, --no-js` | Удалить JavaScript |
| `-i, --no-images` | Удалить изображения |
| `-v, --no-video` | Удалить видео |
| `-a, --no-audio` | Удалить аудио |
| `-F, --no-fonts` | Удалить веб-шрифты |
| `-f, --no-frames` | Удалить фреймы и iframe |
| `-n, --unwrap-noscript` | Заменить элементы NOSCRIPT их содержимым |
| `-e, --ignore-errors` | Игнорировать сетевые ошибки |
| `-E, --encoding <charset>` | Принудительная кодировка |
| `-k, --insecure` | Принимать недействительные TLS-сертификаты |
| `-M, --no-metadata` | Не добавлять комментарий с URL и временем сохранения |
| `-D, --create-dirs` | Создавать недостающие каталоги в пути вывода |
| `-q, --quiet` | Тихий режим |
| `-V, --version` | Версия |

## Сравнение с другими инструментами

| Инструмент | Язык | JS | CLI | Расширение | Скорость |
| :--- | :--- | :---: | :---: | :---: | :--- |
| **monolith** | Rust | ❌ | ✅ | ❌ | ⚡ Очень быстро |
| **[SingleFile](/kb/instruments/tools/singlefile)** | JavaScript | ✅ | ⚠️ | ✅ | 🟡 Средне |
| **[Obelisk](/kb/instruments/tools/obelisk)** | Go | ❌ | ✅ | ❌ | ⚡ Быстро |
| **[HTTrack](/kb/instruments/tools/httrack)** | C | ❌ | ✅ | ❌ (есть GUI) | 🟡 Медленнее (но с рекурсией) |
| **MHTML (встроен в Chrome)** | — | ✅ | ❌ | ✅ | ⚡ Встроенный |

### Когда monolith лучше всех

- Нужен **один бинарник без зависимостей**.
- **Скрипт на сервере** без графического интерфейса и без Node.js.
- Нужен **минимальный, предсказуемый результат** без выполнения JS.

### Когда лучше SingleFile

- Страница с **обязательным JS** (SPA, динамическая загрузка).
- Нужно **расширение браузера** для интерактивной работы.
- Нужно **точное соответствие** тому, что видит пользователь.

### Когда лучше Obelisk

- Нужен **Go в стеке** (единый язык).
- Нужна **библиотека** для встраивания в собственный код.

## Best practices

### 1. Удаляйте JS для долгосрочного хранения

```bash
monolith -j https://example.com -o archive/page.html
```

JavaScript — главный источник нестабильности сохранённых страниц: скрипты обращаются к внешним API и CDN, которые со временем перестают работать.

### 2. Если нужен WARC — используйте другие инструменты

monolith создаёт HTML или MHTML, а не WARC. Если нужен WARC той же страницы, сохраните её через [Wget](/kb/instruments/tools/wget) (`--warc-file`) или [Browsertrix Crawler](/kb/instruments/tools/browsertrix); в Python запрос и ответ в WARC записывает библиотека `warcio`.

### 3. Указывайте осмысленный User-Agent

```bash
monolith -u "Mozilla/5.0 (compatible; MyArchiveBot/1.0; +https://example.org/contact)" URL
```

### 4. Настройте таймаут

```bash
monolith -t 30 URL -o page.html
```

По умолчанию таймаут на каждый ресурс — 120 секунд; для массовых задач его разумно уменьшить.

### 5. Для массовых выгрузок — параллелизм

```bash
# 4 параллельных процесса
cat urls.txt | xargs -P 4 -I {} \
  sh -c 'monolith "$1" -o "out/$(echo "$1" | tr / _).html"' _ {}
```

Не увеличивайте параллелизм без необходимости, чтобы не перегружать сайт.

### 6. Проверяйте результат

```bash
monolith https://example.com -o page.html
test -s page.html && grep -q "<title>" page.html && echo "OK"
```

## Ограничения

- **Нет выполнения JavaScript** — современные SPA сохранятся пустыми.
- **Нет рекурсивного обхода** — одна страница за раз.
- **Нет браузерной авторизации** — cookies передаются вручную через файл.
- **Большие страницы** (несколько МБ ресурсов) занимают много памяти.
- **Бинарные ресурсы** (видео, аудио) встраиваются как base64 — файл сильно растёт.
- **Не пишет WARC**.

## Ресурсы

- [GitHub: monolith](https://github.com/Y2Z/monolith) — исходный код и README.
- [Releases](https://github.com/Y2Z/monolith/releases) — готовые бинарники.
- [monolith на crates.io](https://crates.io/crates/monolith) — пакет Rust.

## Связанные материалы

- **[SingleFile](/kb/instruments/tools/singlefile)** — для страниц с обязательным JS.
- **[Obelisk](/kb/instruments/tools/obelisk)** — альтернатива на Go.
- **[WebScrapBook](/kb/instruments/tools/webscrapbook)** — для коллекций со структурой.
- **[Wget](/kb/instruments/tools/wget)** — для рекурсивного обхода сайтов.
- **[Пользовательские workflow](/kb/guides/custom-workflows)** — monolith в скриптах.
- **[Экстренная архивация](/kb/guides/emergency-archiving)** — быстрый захват одной страницы.
- **[Формат MHTML](/kb/instruments/file-formats/mhtml)** — альтернативный формат одной страницы.
