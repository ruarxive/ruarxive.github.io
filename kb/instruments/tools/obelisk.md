---
title: Obelisk
sidebar_label: Obelisk
description: Go-библиотека и CLI для сохранения веб-страницы в один HTML-файл с обработкой CSS, изображений и шрифтов
---

# Obelisk

**Obelisk** — Go-библиотека и CLI-инструмент для сохранения веб-страницы в **один самодостаточный HTML-файл** со встроенными ресурсами. Альтернатива [SingleFile](singlefile) и [monolith](monolith), написанная на Go.

Сайт: [github.com/go-shiori/obelisk](https://github.com/go-shiori/obelisk)

## Зачем нужен

Obelisk — это ответ на вопрос «как сохранить страницу одним HTML на Go». Главные применения:

- **Go-приложения** — нативная интеграция через `go get` и программный API.
- **Серверный рендеринг** страниц в один файл (для архивирования в фоне).
- **Кросс-платформенные CLI** — статически скомпилированные бинарники Go.
- **Конвейеры данных** — Go в стеке, не хочется тянуть Node.js для SingleFile.

## Возможности

- **Один HTML-файл** — все CSS, изображения, шрифты inline.
- **Программный API** — использование как Go-библиотеки.
- **CLI-режим** — для скриптов.
- **HTTP-сервер** — REST API для интеграции с другими сервисами.
- **Удаление элементов**:
  - JavaScript.
  - Видео, аудио.
  - iframe.
  - Стилей и изображений (опционально).
- **Пользовательский User-Agent**.
- **Поддержка прокси**.
- **CSS-инлайнинг** с обработкой `@import`, `url()`.
- **Кросс-компиляция** — Linux, macOS, Windows, ARM.

## Когда использовать

✅ Подходит для:

- **Go-проектов**, где нужна архивация страниц (краулеры, мониторинг).
- **Серверных сервисов** — REST API для приёма URL и возврата HTML.
- **Скриптов в CI/CD** — статический бинарник без зависимостей.
- **Массовых выгрузок** через горутины (параллелизм «бесплатно»).

❌ Не подходит для:

- **Современных SPA** с обязательным JS.
- **Сайтов за Cloudflare** — нет headless-браузера.
- **Больших проектов** — для них Browsertrix, Heritrix.

## Установка

### Go

```bash
go install github.com/go-shiori/obelisk/cmd/obelisk@latest
```

Бинарник появится в `$GOPATH/bin/obelisk`.

### Docker

```bash
docker run --rm -v $(pwd):/data ghcr.io/go-shiori/obelisk \
  -output /data/page.html https://example.com
```

### Из исходников

```bash
git clone https://github.com/go-shiori/obelisk
cd obelisk
make
```

### Зависимости

- **Go 1.21+** (для сборки из исходников).
- **chromedp** или playwright (опционально, для JS-рендеринга в некоторых режимах).

## Использование

### CLI — базовое сохранение

```bash
obelisk https://example.com -o page.html
```

### Удалить JavaScript

```bash
obelisk -no-js https://example.com -o page.html
```

### Удалить видео и аудио

```bash
obelisk -no-video -no-audio https://example.com -o page.html
```

### Удалить iframe

```bash
obelisk -no-iframe https://example.com -o page.html
```

### HTTP-сервер

```bash
obelisk serve -port 8080
```

Запрос:

```bash
curl -X POST http://localhost:8080/ \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com", "options": {"noJS": true}}' \
  --output page.html
```

### REST API

```http
POST /
Content-Type: application/json

{
  "url": "https://example.com",
  "options": {
    "userAgent": "MyBot/1.0",
    "noJS": true,
    "noVideo": true,
    "timeout": 30
  }
}

→ HTML file
```

## Программное использование (Go)

### Базовый пример

```go
package main

import (
    "log"
    "os"
    "github.com/go-shiori/obelisk"
)

func main() {
    content, err := obelisk.Archive(&obelisk.Request{
        URL: "https://example.com",
    })
    if err != nil {
        log.Fatal(err)
    }
    
    err = os.WriteFile("page.html", content, 0644)
    if err != nil {
        log.Fatal(err)
    }
}
```

### С опциями

```go
import "github.com/go-shiori/obelisk"

content, err := obelisk.Archive(&obelisk.Request{
    URL: "https://example.com",
    UserAgent: "RuarxiveBot/1.0",
    Timeout: 30 * time.Second,
    SkipResources: []string{"video", "audio", "iframe"},
})
```

### Параллельное архивирование (горутины)

```go
package main

import (
    "sync"
    "github.com/go-shiori/obelisk"
)

func archiveBatch(urls []string) map[string][]byte {
    var wg sync.WaitGroup
    results := make(map[string][]byte, len(urls))
    var mu sync.Mutex
    
    for _, url := range urls {
        wg.Add(1)
        go func(u string) {
            defer wg.Done()
            content, err := obelisk.Archive(&obelisk.Request{URL: u})
            if err != nil {
                return
            }
            mu.Lock()
            results[u] = content
            mu.Unlock()
        }(url)
    }
    
    wg.Wait()
    return results
}
```

## Конфигурация

### Параметры `obelisk.Request`

```go
type Request struct {
    URL              string
    UserAgent        string
    Timeout          time.Duration
    SkipResources    []string  // "video", "audio", "image", "css", "js", "iframe"
    AcceptLanguage   string
    ExtraHeaders     map[string]string
}
```

### Переменные окружения

```bash
OBELISK_PORT=8080
OBELISK_TIMEOUT=30s
OBELISK_USER_AGENT="RuarxiveBot/1.0"
```

## Сравнение с другими инструментами

| Инструмент | Язык | JS | CLI | API | Размер бинарника |
| :--- | :--- | :---: | :---: | :---: | :--- |
| **Obelisk** | Go | ❌ | ✅ | ✅ REST | ≈ 15 МБ |
| **[monolith](monolith)** | Rust | ❌ | ✅ | ❌ | ≈ 5 МБ |
| **[SingleFile](singlefile)** | JavaScript | ✅ | ⚠️ | ❌ | — (Node.js) |
| **[Wget](wget)** | C | ❌ | ✅ | ❌ | ≈ 1 МБ |
| **[httrack](httrack)** | C | ❌ | ✅ GUI | ❌ | ≈ 5 МБ |

### Когда Obelisk лучше всех

- **Go в стеке** — нативная интеграция, типобезопасный API.
- Нужен **HTTP-сервис** для приёма URL и отдачи HTML.
- Хочется **параллелизм через горутины** без внешних библиотек.
- Важна **кросс-компиляция** в один статический бинарник.

### Когда лучше monolith

- Минимальный **размер бинарника** (Rust даёт ≈ 5 МБ vs ≈ 15 МБ у Go).
- Не хочется **Go в стеке**.

### Когда лучше SingleFile

- Страницы с **обязательным JS**.
- Нужно **расширение браузера**.

### Когда лучше Wget

- Нужна **рекурсия** по сайту.
- Минимальный размер и **нулевые зависимости**.

## Best practices

### 1. Используйте как библиотеку в Go-сервисах

```go
// В кроулере
for _, url := range seedURLs {
    content, err := obelisk.Archive(&obelisk.Request{URL: url})
    if err != nil {
        log.Printf("Failed to archive %s: %v", url, err)
        continue
    }
    // Сохранить в БД, отправить в S3, и т.д.
}
```

### 2. HTTP-сервер для интеграции

```bash
# Запустить как фоновый сервис
obelisk serve -port 8080 -timeout 60s &

# Использовать из других приложений
curl -X POST http://localhost:8080/ -d '{"url":"https://example.com"}' -o page.html
```

### 3. Параллелизм для массовых выгрузок

```go
// 100 URL параллельно через worker pool
jobs := make(chan string, 100)
results := make(chan string, 100)

for w := 0; w < 10; w++ {
    go func() {
        for url := range jobs {
            content, _ := obelisk.Archive(&obelisk.Request{URL: url})
            // сохранить
        }
    }()
}

for _, url := range urls {
    jobs <- url
}
close(jobs)
```

### 4. Всегда ставьте таймаут

```go
obelisk.Archive(&obelisk.Request{
    URL:     url,
    Timeout: 30 * time.Second,  // обязательно!
})
```

### 5. User-Agent для архивирования

```go
obelisk.Archive(&obelisk.Request{
    URL:       url,
    UserAgent: "RuarxiveBot/1.0 (+https://ruarxive.org/bot)",
})
```

## Ограничения

- **Нет JavaScript-рендера** — статический HTML в момент запроса.
- **Не обходит Cloudflare** и другие anti-bot системы.
- **Нет рекурсивного краулинга** — одна страница за раз.
- **Бинарник больше**, чем у monolith (Go vs Rust).
- **Меньше пользовательского опыта** — community меньше, чем у SingleFile.
- **Меньше фич** — нет аннотаций, нет tree, нет sync.

## Ресурсы

- [GitHub: Obelisk](https://github.com/go-shiori/obelisk) — исходный код.
- [Документация API](https://pkg.go.dev/github.com/go-shiori/obelisk) — Go-пакет.
- [Go-Shiori](https://github.com/go-shiori) — другие проекты автора (shiori — read-it-later, чьи наработки легли в основу).
- [README](https://github.com/go-shiori/obelisk/blob/master/README.md) — использование.

## Связанные материалы

- **[monolith](monolith)** — Rust-альтернатива, меньше размер.
- **[SingleFile](singlefile)** — для страниц с JS.
- **[WebScrapBook](webscrapbook)** — для коллекций с структурой.
- **[wallabag](wallabag)** — read-it-later от тех же авторов (go-shiori).
- **[Wget](wget)** — для рекурсивного краулинга.
- **[Пользовательские workflow](/kb/guides/custom-workflows)** — Obelisk в пайплайнах.
- **[Go-инструменты Ruarxive](/kb/instruments/ruarxive-tools)** — наши Go-утилиты.
