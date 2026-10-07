---
title: Wget
sidebar_label: Wget
description: Универсальный консольный загрузчик файлов и простой HTTP-кроулер с поддержкой WARC начиная с версии 1.14
---

# Wget

**GNU Wget** — неинтерактивный консольный загрузчик файлов по HTTP, HTTPS и FTP. Предустановлен почти в каждом дистрибутиве Linux, доступен для macOS и Windows. С версии 1.14 умеет писать результат сразу в WARC, что делает его самым доступным инструментом для базовой веб-архивации.

Сайт: [www.gnu.org/software/wget](https://www.gnu.org/software/wget/)

## Зачем нужен

Wget — это **первый инструмент**, к которому обращаются при необходимости быстро скачать сайт целиком, отдельную страницу с ресурсами или набор ссылок из списка. Он не требует Docker, Python, JVM или Node.js — работает везде, где есть bash.

Типичные сценарии:
- **Разовое скачивание сайта** для офлайн-копии.
- **Регулярный сбор** фиксированного списка URL (например, ежедневная выгрузка ленты).
- **Запись WARC** без дополнительных зависимостей (с версии 1.14+).
- **Базовый скрапинг** для последующей обработки в Python.

## Возможности

- **Рекурсивная загрузка** с настраиваемой глубиной и ограничениями.
- **Конвертация ссылок** для офлайн-просмотра (`--convert-links`).
- **Докачка** прерванных загрузок (`-c`).
- **Зеркалирование** с удалением лишнего (`--mirror`).
- **WARC-вывод** (`--warc-file=archive.warc`) — стандарт архивирования.
- **Фильтрация** по расширению, домену, регулярному выражению.
- **Поддержка прокси, cookies, HTTP Basic Auth**.
- **Возобновление работы** после обрыва без потери прогресса.
- **Толерантность к нестабильной сети**: автоматические повторы.

## Когда использовать

✅ Подходит для:

- **Простых статических сайтов** (HTML + CSS + изображения, без JS).
- **Списка URL** из файла или stdin.
- **Быстрого прототипирования** — синтаксис минимальный.
- **Сред без Python/Docker** (только bash и базовая утилита).
- **WARC-вывода** без установки дополнительных библиотек.

❌ Не подходит для:

- **Современных SPA** (React, Vue, Angular) — Wget не выполняет JS.
- **Сайтов с авторизацией** — поддержка ограничена.
- **Сложных сценариев** (ротация, очереди, мониторинг) — используйте Browsertrix, Heritrix.
- **Больших краулингов** без чёткого списка URL.

## Установка

### Linux

```bash
# Debian/Ubuntu
sudo apt-get install wget

# Fedora
sudo dnf install wget

# Arch
sudo pacman -S wget
```

### macOS

```bash
# Уже установлен, либо:
brew install wget
```

### Windows

Доступен через:
- [Chocolatey](https://chocolatey.org/): `choco install wget`
- [MSYS2](https://www.msys2.org/) / Cygwin
- WSL (рекомендуется — нативная среда Linux)

### Проверка версии

```bash
wget --version
```

> [!IMPORTANT]
> Для **WARC-вывода** нужна версия **≥ 1.14**. В большинстве современных дистрибутивов это так по умолчанию, но в старых системах может быть 1.13.x без поддержки WARC.

## Использование

### Скачать одну страницу со всеми ресурсами

```bash
wget --page-requisites --adjust-extension --convert-links \
     --no-clobber --no-parent \
     https://example.com/article/
```

| Флаг | Что делает |
| :--- | :--- |
| `--page-requisites` | Скачивает CSS, изображения, JS |
| `--adjust-extension` | Добавляет `.html`, `.css` и т.д. по MIME-типу |
| `--convert-links` | Переписывает ссылки для офлайн-просмотра |
| `--no-clobber` | Не перезаписывает уже скачанные файлы |
| `--no-parent` | Не поднимается выше указанного пути |

### Зеркалирование сайта целиком

```bash
wget --mirror \
     --convert-links \
     --adjust-extension \
     --page-requisites \
     --no-parent \
     --restrict-file-names=windows \
     --domains example.com \
     --no-clobber \
     -P ./archive \
     https://example.com/
```

### Запись WARC

```bash
wget --warc-file=archive \
     --recursive --level=2 \
     --page-requisites --adjust-extension \
     --warc-cdx \
     --no-parent \
     https://example.com/
```

После выполнения рядом появится `archive.warc.gz` и `archive.cdx` (CDX-индекс).

### Скачивание списка URL из файла

```bash
# urls.txt: один URL на строку
wget --input-file=urls.txt \
     --directory-prefix=./archive \
     --wait=1 --random-wait
```

### Докачка после обрыва

```bash
wget --continue --timestamping --no-clobber \
     --directory-prefix=./archive \
     --input-file=urls.txt
```

### Ограничение по типу файлов

```bash
# Только HTML и CSS
wget --recursive --level=3 \
     --accept='*.html,*.css' \
     --reject='*.jpg,*.png,*.gif' \
     https://example.com/
```

## Конфигурация

### `.wgetrc` (домашний каталог)

```ini
# User agent (помогает избежать блокировок)
user_agent = Mozilla/5.0 (compatible; ArchiveBot/1.0; +https://example.com/bot)

# Задержка между запросами
wait = 1
random_wait = on

# Таймауты
connect_timeout = 30
read_timeout = 60

# Повторы
tries = 5
retry_connrefused = on
```

### Переменные окружения

```bash
# Прокси
export http_proxy=http://proxy:8080
export https_proxy=http://proxy:8080

# Cookies
export WGETRC=/path/to/wgetrc
```

## Сравнение с другими инструментами

| Инструмент | WARC | JS | Сложность | Лучший для |
| :--- | :---: | :---: | :--- | :--- |
| **Wget** | ✅ (1.14+) | ❌ | Очень низкая | Быстрые разовые загрузки |
| **[Wpull](wpull)** | ✅ | ⚠️ | Низкая | WARC + HTTP/2 + плагины |
| **[HTTrack](httrack)** | ⚠️ через конвертацию | ❌ | Низкая | GUI, офлайн-копия |
| **[Heritrix](heritrix)** | ✅ | ❌ | Высокая | Большие проекты архивирования |
| **[Browsertrix](browsertrix)** | ✅ WACZ | ✅ | Средняя | Современные сайты с JS |
| **[SingleFile](singlefile)** | ❌ | ⚠️ | Низкая | Одна страница в HTML |

### Когда Wget лучше всех

- Нужно **максимально быстро** начать без изучения сложного инструмента.
- Целевой сайт — **простая статика** (документация, блог на старом CMS).
- Нет **Python/Docker** в окружении.
- Нужен **WARC** без установки дополнительных пакетов.

### Когда лучше использовать Wpull или Heritrix

- Нужна **HTTP/2** (Wget ≤ 1.19 не поддерживает нативно).
- Требуются **Python-плагины** для кастомной логики.
- Архивирование **сложного и большого** проекта.

## Best practices

### 1. Всегда ставьте осмысленный User-Agent

```bash
wget --user-agent="Ruarxive/1.0 (https://ruarxive.org)" \
     https://example.com/
```

Это помогает администраторам сайта понять, кто и зачем скачивает.

### 2. Используйте задержки для вежливого краулинга

```bash
wget --wait=1 --random-wait --recursive --level=2 https://example.com/
```

`--random-wait` добавляет случайный разброс 0.5–1.5× от базовой задержки — выглядит естественнее и не нагружает сервер.

### 3. Ограничивайте домен

```bash
wget --span-hosts --domains=example.com,cdn.example.com https://example.com/
```

Не даёт кроулеру уйти на чужие домены (CDN можно разрешить явно).

### 4. Сохраняйте логи

```bash
wget --output-file=wget.log --append-output=wget.log ...
```

### 5. Для регулярных сборов — cron

```bash
# Ежедневно в 3:00 — собрать список URL с логированием
0 3 * * * cd /opt/collector && \
  wget --input-file=urls.txt \
       --directory-prefix=$(date +%F) \
       --wait=2 --random-wait \
       --warc-file=$(date +%F)/archive \
       >> /var/log/wget-collector.log 2>&1
```

### 6. Не забывайте о robots.txt

Wget поддерживает `--robots=user-agent`, но не делает это по умолчанию. Для вежливого краулинга — добавьте вручную:

```bash
wget --execute robots=on https://example.com/
```

## Ограничения

- **Не выполняет JavaScript** — динамический контент не сохранится.
- **Однопоточный** по умолчанию (есть `--max-connection-per-server=8`, но это всё равно не Browsertrix).
- **Нет HTTP/2** в большинстве сборок.
- **Плохо работает со сложной авторизацией** (нет полноценного браузерного движка).
- **WARC-вывод ограничен** — нет CDXJ, нет ZIM, нет deduplication на лету.
- **Большие проекты** (>100k URL) лучше отдавать Heritrix или Brozzler.

## Ресурсы

- [Официальный сайт GNU Wget](https://www.gnu.org/software/wget/) — документация и FAQ.
- [Wget Manual](https://www.gnu.org/software/wget/manual/wget.html) — полное руководство.
- [Wget examples](https://www.gnu.org/software/wget/manual/html_node/Advanced-Usage.html) — примеры.
- [Wget Wikipedia](https://en.wikipedia.org/wiki/Wget) — история и применения.
- [httrack2warc](https://github.com/iipc/httrack2warc) — конвертация вывода Wget/HTTrack в WARC.

## Связанные материалы

- **[Wpull](wpull)** — форк Wget с нативной поддержкой WARC, HTTP/2 и Python-плагинов.
- **[HTTrack](httrack)** — GUI-альтернатива для зеркалирования сайтов.
- **[Обработка WARC](warc-processing)** — что делать с полученным WARC (валидация, извлечение URL).
- **[Heritrix](heritrix)** — для серьёзных проектов архивирования.
- **[Wget в гайдах](/kb/guides/wget)** — пошаговые сценарии использования.
- **[Как создать цифровой архив сайта](/kb/instruments/howto-collect/make-copy-website)** — полный workflow.
- **[Экстренная архивация](/kb/guides/emergency-archiving)** — Wget как один из первых инструментов.
- **[Формат WARC](/kb/instruments/file-formats/warc)** — что внутри `.warc.gz`.
- **[Формат CDX](/kb/instruments/file-formats/cdx)** — индекс WARC.
- **[Воспроизведение через pywb](/kb/instruments/replay/pywb)** — как смотреть заархивированный WARC.
