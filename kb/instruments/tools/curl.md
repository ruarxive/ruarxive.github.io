---
title: curl
sidebar_label: curl
description: Универсальный консольный HTTP-клиент для скриптов, API-запросов и диагностики. Основа для большинства архивных скриптов
---

# curl

**curl** (Client URL) — консольная утилита и библиотека (libcurl) для передачи данных по URL. Поддерживает HTTP, HTTPS, FTP, SFTP, SCP, SMB, LDAP и десятки других протоколов. Это **не кроулер**, но фундаментальный инструмент для скриптов выгрузки данных, работы с API, диагностики и автоматизации.

Сайт: [curl.se](https://curl.se/)

## Зачем нужен архивисту

Curl — это **«швейцарский нож HTTP»**. В отличие от Wget, он не умеет рекурсивно обходить сайт, но:

- **Делает один запрос** с точным контролем заголовков, метода, тела.
- **Работает с любым API** — JSON, OAuth, GraphQL, multipart.
- **Скриптуется** идеально — стабильный exit code, прогнозируемый вывод.
- **Диагностирует** — заголовки, TLS, редиректы, cookies, время.
- **Пишет в WARC** (экспериментально, через `--warc` или отдельные обёртки).

## Возможности

- **20+ протоколов**: HTTP/1.1, HTTP/2, HTTP/3, HTTPS, FTP, SFTP, SMB, LDAP, MQTT, SMTP, IMAP, GOPHER, FILE и др.
- **Любые HTTP-методы**: GET, POST, PUT, DELETE, PATCH, HEAD, OPTIONS, CONNECT, TRACE.
- **Заголовки и аутентификация**: Basic, Digest, NTLM, Bearer, OAuth 2.0, mTLS, AWS SigV4.
- **Cookies и сессии** с персистентным хранилищем (`-c`, `-b`).
- **Загрузка файлов**: multipart, PUT, resume (`-C -`).
- **Прокси**: HTTP, SOCKS4/5, HTTPS через `HTTPS_PROXY`.
- **Сжатие и кодирование**: gzip, deflate, brotli, zstd.
- **Прогресс-бар**, вывод в файл, stdin/stdout pipes.
- **Параллельные загрузки** (`-Z`, `--parallel`).
- **Конфигурация через `.curlrc`** и переменные окружения.
- **TLS 1.3**, проверка сертификатов, клиентские сертификаты.
- **Запись в WARC** (через `--output` + post-processing или сторонние обёртки).

## Когда использовать

✅ Подходит для:

- **API-выгрузок** (Telegram, VK, YouTube через внутренние API, Notion, Slack).
- **Скриптов** на bash / Python shell-out.
- **Проверки доступности и метаданных** URL.
- **Загрузки конкретных файлов** (PDF, JSON, медиа).
- **OAuth-аутентификации** с редиректами.
- **Проксирования** запросов через корпоративный прокси.

❌ Не подходит для:

- **Рекурсивного обхода сайтов** (используйте Wget, Wpull, Heritrix).
- **Выполнения JavaScript** (используйте Browsertrix, Playwright).
- **Автоматической обработки HTML-форм** (используйте Mechanize, Selenium).

## Установка

### Linux

```bash
# Debian/Ubuntu
sudo apt-get install curl

# Fedora
sudo dnf install curl

# Arch
sudo pacman -S curl
```

### macOS

Уже установлен, либо:

```bash
brew install curl
```

### Windows

- В Windows 10+ есть встроенный `curl.exe` (PowerShell 5+).
- Иначе: `winget install curl.curl` или через Chocolatey (`choco install curl`).
- Для WSL — `sudo apt install curl`.

### Проверка

```bash
curl --version
# curl 8.4.0 (x86_64-pc-linux-gnu) libcurl/8.4.0 ...
```

## Использование

### Скачать файл

```bash
# Скачать с сохранением имени из URL
curl -O https://example.com/file.pdf

# Скачать с указанием имени
curl -o my-report.pdf https://example.com/file.pdf

# Скачать несколько файлов
curl -O https://example.com/a.zip -O https://example.com/b.zip
```

### Сделать запрос с заголовками

```bash
curl -H "Authorization: Bearer $TOKEN" \
     -H "Accept: application/json" \
     https://api.example.com/v1/items
```

### POST с JSON

```bash
curl -X POST \
     -H "Content-Type: application/json" \
     -d '{"title":"новость","body":"текст"}' \
     https://api.example.com/posts
```

### POST с multipart (загрузка файла)

```bash
curl -F "file=@report.pdf" \
     -F "description=Annual report" \
     https://api.example.com/upload
```

### Следовать редиректам

```bash
curl -L https://bit.ly/short
```

### Показать заголовки ответа

```bash
curl -I https://example.com
# HTTP/2 200
# server: nginx
# content-type: text/html; charset=utf-8
# ...

# Или с телом:
curl -v https://example.com 2>&1 | head -30
```

### Cookies и сессии

```bash
# Сохранить cookies
curl -c cookies.txt -d "user=ivan&pass=secret" https://example.com/login

# Использовать сохранённые cookies
curl -b cookies.txt https://example.com/dashboard
```

### Параллельная загрузка

```bash
# Из списка URL (urls.txt)
xargs -n 1 -P 8 curl -O < urls.txt

# Или нативно (curl 7.66+)
curl --parallel --parallel-immediate \
     -O https://example.com/a -O https://example.com/b
```

### Загрузка с докачкой

```bash
curl -C - -O https://example.com/big-file.zip
```

### HTTP/3 (QUIC)

```bash
curl --http3 https://example.com
```

### Только заголовки (HEAD)

```bash
curl -I -L https://example.com
# Полезно для проверки кода ответа, редиректов, метаданных
```

## Практические сценарии для архивиста

### 1. Проверить, жив ли URL

```bash
if curl -fsSL -o /dev/null --max-time 10 https://example.com/article; then
  echo "URL доступен"
else
  echo "URL недоступен"
fi
```

`-f` — fail на HTTP ≥400, `-s` — silent, `-S` — показывать ошибки, `-L` — следовать редиректам.

### 2. Скачать RSS-фид и распарсить

```bash
curl -s https://example.com/feed.xml | xmllint --xpath '//item/title' -
```

### 3. Запрос к API с пагинацией

```bash
for page in 1 2 3 4 5; do
  curl -s "https://api.example.com/items?page=$page&limit=100" \
       -H "Authorization: Bearer $TOKEN" \
       -o "page-$page.json"
  sleep 1  # вежливая пауза
done
```

### 4. Скачать все ссылки со страницы

```bash
curl -s https://example.com/page | \
  grep -oE 'href="[^"]+"' | \
  sed 's/href="//;s/"$//' | \
  xargs -n 1 -P 4 curl -O
```

### 5. Проверить цепочку редиректов

```bash
curl -v -L --max-redirs 5 https://bit.ly/short 2>&1 | grep -E '^[<>]'
```

### 6. Скачать через SOCKS-прокси (для обхода блокировок)

```bash
curl --proxy socks5h://127.0.0.1:9050 https://example.com
```

### 7. Записать WARC

Wget — основной инструмент для WARC. Но curl тоже можно использовать в связке с post-processing:

```bash
# Скачать и подготовить для конвертации
curl -L -o page.html https://example.com/article

# Или через обёртку curl-to-warc
pip install curl-to-warc
curl-to-warc -o archive.warc.gz https://example.com/
```

> [!NOTE]
> Нативная поддержка WARC в curl долгое время обсуждалась, но стабильной реализации нет. Для серьёзной работы с WARC используйте Wget, Wpull или Heritrix.

## Конфигурация

### `~/.curlrc`

```ini
# Сжатие
compressed

# Таймауты
connect-timeout = 10
max-time = 300

# Следовать редиректам
location

# User agent
user-agent = "Mozilla/5.0 (compatible; RuarxiveBot/1.0)"

# Cookies по умолчанию
cookie-jar = ~/.curl-cookies

# Не показывать прогресс
silent
show-error
```

### Переменные окружения

```bash
# Прокси
export HTTP_PROXY=http://proxy:8080
export HTTPS_PROXY=http://proxy:8080
export NO_PROXY=localhost,127.0.0.1,.internal

# TLS
export CURL_CA_BUNDLE=/etc/ssl/certs/ca-certificates.crt
```

## Сравнение с другими инструментами

| Инструмент | Протоколы | Рекурсия | WARC | JS | Скриптинг |
| :--- | :---: | :---: | :---: | :---: | :--- |
| **curl** | 20+ | ❌ | ⚠️ | ❌ | ✅ отличный |
| **[Wget](wget)** | HTTP(S), FTP | ✅ | ✅ | ❌ | ✅ хороший |
| **[httrack](httrack)** | HTTP(S), FTP | ✅ | ⚠️ | ❌ | ⚠️ средний |
| **[Wpull](wpull)** | HTTP(S), FTP | ✅ | ✅ | ⚠️ | ✅ хороший |
| **httpie** | HTTP(S) | ❌ | ❌ | ❌ | ✅ человекочитаемый |
| **requests (Python)** | HTTP(S) | ❌ | ❌ | ❌ | ✅ лучший для Python |

### Когда curl лучше всех

- Нужен **один точечный запрос** с контролем каждого заголовка.
- Пишете **shell-скрипт** для массовых выгрузок.
- Нужны **экзотические протоколы** (SFTP, SMB, MQTT).
- Нужен **HTTP/3** или строгий контроль TLS.

### Когда лучше Wget или Wpull

- Нужна **рекурсия** по сайту.
- Нужен **WARC** из коробки.
- Нет чёткого списка URL.

### Когда лучше httpie / requests

- Curl **слишком низкоуровневый** и нужно что-то более читаемое.
- Работа идёт в **Python** (там requests) или в интерактивной оболочке (там httpie).

## Best practices

### 1. Всегда ставьте `--max-time`

```bash
curl --max-time 30 https://example.com
```

Без этого curl может «висеть» бесконечно на медленных ответах.

### 2. Используйте `--fail-with-body` (или `-f`)

```bash
curl -fsSL --max-time 30 -o output.json https://api.example.com
```

`-f` — вернуть exit code 22 при HTTP ≥400, без него curl отдаст ошибку в теле, а код будет 0.

### 3. Ограничивайте редиректы

```bash
curl --max-redirs 5 -L https://example.com
```

Защита от зацикливания и от «редиректных атак».

### 4. Логируйте в скриптах

```bash
{
  echo "=== $(date -Iseconds) $URL ==="
  curl -fsSL --max-time 30 -w "HTTP: %{http_code} | size: %{size_download} | time: %{time_total}s\n" \
       -o "$OUTPUT" "$URL"
} >> /var/log/collector.log 2>&1
```

`-w` — write-out, формат можно гибко настраивать.

### 5. Используйте `--retry` с задержкой

```bash
curl --retry 3 --retry-delay 2 --retry-all-errors \
     -fsSL https://example.com
```

### 6. Уважайте robots.txt и ставьте User-Agent

```bash
curl -A "RuarxiveBot/1.0 (+https://ruarxive.org/bot)" \
     --user-agent "RuarxiveBot/1.0 (+https://ruarxive.org/bot)" \
     https://example.com
```

### 7. Для массовых выгрузок — `xargs -P` или `--parallel`

```bash
cat urls.txt | xargs -n 1 -P 8 curl -fsSLO
```

`-P 8` — 8 параллельных процессов, аккуратнее с нагрузкой на сервер.

## Ограничения

- **Нет рекурсивного обхода** — это не кроулер.
- **Нет JavaScript** — динамика не отрендерится.
- **Нет нативного WARC** (только через обёртки).
- **Однопоточный** в большинстве операций (есть `--parallel`, но это не конкурент Heritrix).
- **Сложный синтаксис** для непривычного пользователя (но есть `--help all` для справки).
- **Не сохраняет метаданные** страницы автоматически (нужно вручную через `-D` для заголовков).

## Ресурсы

- [Официальный сайт curl](https://curl.se/) — документация, FAQ, examples.
- [curl book](https://everything.curl.dev/) — бесплатная онлайн-книга.
- [curl man page](https://curl.se/docs/manpage.html) — полный справочник.
- [HTTP scripting with curl](https://curl.se/docs/httpscripting.html) — основы.
- [curl cookbook](https://catonmat.net/curl-cookbook) — рецепты.

## Связанные материалы

- **[Wget](wget)** — для рекурсивного скачивания сайтов.
- **[Wpull](wpull)** — Wget с WARC и HTTP/2.
- **[tdl](tdl)** — для Telegram API, использует curl-подобные подходы.
- **[wparc](/kb/instruments/ruarxive-tools/wparc)** — утилита Ruarxive для WordPress API (построена на HTTP-запросах).
- **[Архивация Telegram](/kb/instruments/data-take-out/dto-telegram)** — примеры API-скриптов.
- **[Архивация YouTube](/kb/instruments/data-take-out/dto-youtube)** — выгрузка через API.
- **[Экстренная архивация](/kb/guides/emergency-archiving)** — curl как один из быстрых инструментов.
- **[WARC](/kb/instruments/file-formats/warc)** — формат архива; Wget/Wpull умеют его писать нативно.
- **[Пользовательские workflow](/kb/guides/custom-workflows)** — curl в сложных сценариях.
