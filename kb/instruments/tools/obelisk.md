---
title: Obelisk
sidebar_label: Obelisk
description: "Obelisk — Go-библиотека и CLI для сохранения веб-страницы в один HTML-файл со встроенными CSS, изображениями и скриптами."
last_update:
  date: 2026-10-12
---

# Obelisk

**Obelisk** — Go-библиотека и CLI для сохранения веб-страницы в **один HTML-файл** со всеми ресурсами внутри. Автор — Radhi Fadlillah, лицензия MIT. Obelisk написан для read-it-later сервиса [Shiori](https://github.com/go-shiori/shiori) и заменил старый пакет автора [go-shiori/warc](https://github.com/go-shiori/warc). Идея взята у [monolith](monolith).

Сайт: [github.com/go-shiori/obelisk](https://github.com/go-shiori/obelisk)

## Возможности

- Встраивает в один HTML5-документ CSS, изображения, JavaScript и другие ресурсы.
- Внешние скрипты и стили вставляет инлайн (`script`/`style`), а не как base64 data-URL. Так страницы чаще работают, а файл меньше.
- По умолчанию запрещает архивной копии обращаться к внешним адресам через Content Security Policy.
- Скачивает ресурсы параллельно (по умолчанию до 10 одновременно).
- Принимает cookies в формате Netscape: можно сохранять страницы, доступные после входа.
- Если URL ведёт не на HTML (например, на PDF), сохраняет файл как есть.
- Работает и как CLI, и как Go-пакет.

Obelisk делает обычные HTTP-запросы и не запускает браузер. Страницы, которые строятся JavaScript на клиенте (SPA), он сохранит в том виде, в каком их отдал сервер.

## Установка

Готовые бинарники — на [странице релизов](https://github.com/go-shiori/obelisk/releases) (последний релиз v0.91 от 2020 года; код в репозитории обновлялся позже). Сборка свежей версии из исходников (нужен Go 1.21+):

```bash
go install github.com/go-shiori/obelisk/cmd/obelisk@latest
```

Бинарник появится в `$(go env GOPATH)/bin/obelisk`. Официального Docker-образа нет.

> Команды сверены с `obelisk -h` сборки из ветки master (октябрь 2026).

## Использование CLI

```bash
# одна страница; без -o имя файла сгенерируется в текущем каталоге
obelisk https://example.com -o page.html

# несколько страниц из файла (по одному URL в строке), со сжатием gzip
obelisk -i urls.txt -o ./archive/ -z

# без JavaScript и без встроенных iframe
obelisk --no-js --no-embeds https://example.com -o page.html

# без изображений, аудио и видео
obelisk --no-medias https://example.com -o page.html

# с cookies (файл Netscape, например выгруженный из браузера)
obelisk -c cookies.txt https://example.com/private -o private.html

# вывод в stdout (только для одного URL)
obelisk https://example.com -o - > page.html
```

Основные флаги:

| Флаг | Назначение |
| :--- | :--- |
| `-o, --output` | Файл или каталог для результата; `-` — stdout |
| `-i, --input` | Файл со списком URL |
| `-z, --gzip` | Сжать результат gzip |
| `-c, --load-cookies` | Файл cookies в формате Netscape |
| `--no-js`, `--no-css`, `--no-medias`, `--no-embeds` | Не включать скрипты, стили, медиа, встроенные элементы (iframe) |
| `-t, --timeout` | Таймаут запроса в секундах (по умолчанию 60) |
| `-r, --retries` | Число повторов запроса (по умолчанию 3) |
| `-u, --user-agent` | Свой User-Agent |
| `--max-concurrent-download` | Число параллельных загрузок (по умолчанию 10) |
| `--insecure` | Не проверять TLS-сертификат |
| `--skip-resource-url-error` | Не прерываться на ошибках загрузки ресурсов |

Если указан `-o`, а URL несколько, Obelisk сам сгенерирует имена файлов и сохранит их в каталог из `-o`.

## Использование как Go-пакета

```bash
go get github.com/go-shiori/obelisk
```

Пример по [`examples/basic.go`](https://github.com/go-shiori/obelisk/blob/master/examples/basic.go): параметры архивации задаются в структуре `Archiver`, адрес страницы — в `Request`.

```go
package main

import (
	"context"
	"log"
	"os"
	"time"

	"github.com/go-shiori/obelisk"
)

func main() {
	arc := obelisk.Archiver{
		EnableLog:      true,
		UserAgent:      "RuarxiveBot/1.0",
		RequestTimeout: 60 * time.Second,
		DisableJS:      true,
	}
	arc.Validate()

	result, contentType, err := arc.Archive(context.Background(), obelisk.Request{
		URL: "https://example.com",
	})
	if err != nil {
		log.Fatal(err)
	}
	log.Println("content type:", contentType)

	if err := os.WriteFile("page.html", result, 0o644); err != nil {
		log.Fatal(err)
	}
}
```

Другие поля `Archiver`: `DisableCSS`, `DisableEmbeds`, `DisableMedias`, `MaxConcurrentDownload`, `MaxRetries`, `SkipResourceURLError`, `Transport`. В `Request` можно передать cookies (`Cookies []*http.Cookie`) или уже загруженный HTML (`Input io.Reader`). Полное описание API — на [pkg.go.dev](https://pkg.go.dev/github.com/go-shiori/obelisk).

## Сравнение с другими инструментами

| Инструмент | Язык | Выполняет JS | CLI | Библиотека |
| :--- | :--- | :---: | :---: | :---: |
| **Obelisk** | Go | ❌ | ✅ | ✅ Go |
| **[monolith](monolith)** | Rust | ❌ | ✅ | ✅ Rust (crate) |
| **[SingleFile](singlefile)** | JavaScript | ✅ (через браузер) | ✅ `single-file-cli` | ❌ |
| **[Wget](wget)** | C | ❌ | ✅ | ❌ |

Obelisk удобен, если архивация встраивается в Go-приложение, или если нужен один статический бинарник без Node.js и браузера. Для страниц, которым обязательно нужен JavaScript, берите [SingleFile](singlefile). Для рекурсивного обхода сайта и записи WARC — [Wget](wget) или [Browsertrix](browsertrix).

## Ограничения

- Нет выполнения JavaScript: SPA сохраняются не полностью.
- Нет рекурсивного обхода: только перечисленные страницы.
- Результат — HTML, а не WARC: HTTP-заголовки и исходные ответы сервера не сохраняются.
- Проект развивается медленно: последний тегированный релиз — 2020 года.

## Ресурсы

- [GitHub: Obelisk](https://github.com/go-shiori/obelisk) — исходный код и README.
- [Документация Go-пакета](https://pkg.go.dev/github.com/go-shiori/obelisk)
- [Shiori](https://github.com/go-shiori/shiori) — менеджер закладок, для которого написан Obelisk.

## Связанные материалы

- **[monolith](monolith)** — аналог на Rust.
- **[SingleFile](singlefile)** — для страниц с JavaScript.
- **[WebScrapBook](webscrapbook)** — коллекции сохранённых страниц в браузере.
- **[wallabag](wallabag)** — self-hosted read-it-later (отдельный PHP-проект).
- **[Wget](wget)** — для рекурсивного обхода.
- **[Пользовательские workflow](/kb/guides/custom-workflows)**
