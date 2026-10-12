---
title: MHTML
description: "MHTML (RFC 2557) — формат «страница в одном файле»: структура, создание через Chrome DevTools Protocol, разбор на Python и перенос в WARC."
last_update:
  date: 2026-10-12
---

# MHTML

**MHTML (MIME Encapsulation of Aggregate HTML Documents)** — формат для упаковки веб-страницы со всеми её ресурсами (изображения, CSS, JavaScript) в один файл. Описан в [RFC 2557](https://www.rfc-editor.org/rfc/rfc2557). Известен по расширениям `.mht`, `.mhtml`.

## Зачем нужен MHTML

До широкого распространения WARC MHTML был распространённым «способом сохранить страницу в один файл»: так сохраняли страницы Internet Explorer и почтовые клиенты Microsoft. Такие файлы встречаются в личных и корпоративных архивах, во вложениях писем, в материалах, переданных на хранение. Понимание формата нужно при импорте исторических коллекций.

## Структура файла

MHTML — это multipart MIME-сообщение. Каждая часть — отдельный ресурс страницы:

```
MIME-Version: 1.0
Content-Type: multipart/related; boundary="boundary_123"

--boundary_123
Content-Type: text/html; charset="UTF-8"
Content-Location: https://example.com/
Content-Transfer-Encoding: quoted-printable

<html>
  <head><link rel="stylesheet" href="style.css"></head>
  <body><img src="logo.png" alt="Logo"></body>
</html>

--boundary_123
Content-Type: text/css
Content-Location: https://example.com/style.css

body { font-family: sans-serif; }

--boundary_123
Content-Type: image/png
Content-Location: https://example.com/logo.png
Content-Transfer-Encoding: base64

iVBORw0KGgoAAAANSUhEUgAA...==base64...

--boundary_123--
```

Одна HTML-страница + все её зависимости упакованы в один файл.

## Создание MHTML

### Вручную в Chrome / Chromium

В десктопном Chrome: «Сохранить страницу как…» → тип «Веб-страница, один файл» (`.mhtml`). Флага командной строки для сохранения в MHTML у Chrome нет (в headless-режиме есть, например, `--print-to-pdf`, `--screenshot` и `--dump-dom`), поэтому для автоматизации используется DevTools Protocol.

### Через Chrome DevTools Protocol (Playwright)

Метод CDP [`Page.captureSnapshot`](https://chromedevtools.github.io/devtools-protocol/tot/Page/#method-captureSnapshot) (помечен как экспериментальный) возвращает страницу в формате MHTML. Пример на Python с Playwright:

```python
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page()
    page.goto("https://example.com/")
    cdp = page.context.new_cdp_session(page)
    snapshot = cdp.send("Page.captureSnapshot", {"format": "mhtml"})
    with open("example.mhtml", "w", encoding="utf-8", newline="") as f:
        f.write(snapshot["data"])
    browser.close()
```

Установка: `pip install playwright && playwright install chromium`. CDP-сессии доступны только для браузеров на базе Chromium. Тот же метод можно вызвать из Puppeteer (`page.createCDPSession()`).

> Пример проверен с Playwright 1.63.0 (октябрь 2026).

## Открытие и парсинг

### Браузеры

*   **Internet Explorer** — исторический родной формат (кнопка «Сохранить как веб-страницу, полностью»).
*   **Microsoft Edge** — старый Edge (EdgeHTML) поддерживал MHTML; современный Edge на Chromium открывает и сохраняет `.mhtml`.
*   **Microsoft Outlook** — может сохранять письма и страницы в MHTML.
*   **Chrome / Chromium** — открывают и сохраняют `.mhtml`.
*   **Safari** использует собственный формат `.webarchive`; рассчитывать на открытие MHTML в Safari не стоит.

### Парсинг в Python

Для разбора достаточно стандартного модуля `email`:

```python
import email
from email import policy

with open("archive.mht", "rb") as f:
    msg = email.message_from_binary_file(f, policy=policy.default)

for part in msg.walk():
    print(f"Content-Type: {part.get_content_type()}, Location: {part.get('Content-Location')}")
    if part.get_content_type() == "text/html":
        html = part.get_content()
        print(html[:200])
```

## Сравнение с WARC

| Характеристика | MHTML | WARC |
| :--- | :--- | :--- |
| Стандартизация | RFC 2557 (только структура) | ISO 28500 (полная) |
| HTTP-заголовки ответов | нет | да |
| Запросы, дедупликация, метаданные записей | нет | да |
| Метаданные архива | нет | да (`warcinfo`) |
| Многостраничные сайты | один файл = одна страница | многостраничная коллекция |
| Сжатие | редко | обычно gzip по записям |
| Использование сейчас | legacy | стандарт |

MHTML **не подходит** для современных архивов. Это наследие, которое нужно понимать для чтения старых данных, но не создавать новые.

## PUID в PRONOM

- **MHTML** — [`x-fmt/429`](https://www.nationalarchives.gov.uk/PRONOM/x-fmt/429)

## Инструменты

*   **Chrome / Chromium** — сохранение вручную и через CDP (`Page.captureSnapshot`).
*   **Microsoft Outlook** — сохраняет письма в MHTML.
*   **Модуль `email` стандартной библиотеки Python** — разбор MHTML без дополнительных зависимостей.

## Перенос MHTML в WARC

Инструменты, записывающие WARC (`wget --warc-file`, warcprox, Browsertrix), сохраняют **живой HTTP-трафик** и не умеют читать готовый MHTML-файл. Если нужно хранить всё в WARC, части MHTML можно перенести в записи типа `resource` с помощью `warcio`:

```python
import email
from email import policy
from io import BytesIO
from warcio.warcwriter import WARCWriter

with open("page.mhtml", "rb") as f:
    msg = email.message_from_binary_file(f, policy=policy.default)

with open("page.warc.gz", "wb") as out:
    writer = WARCWriter(out, gzip=True)
    for part in msg.walk():
        if part.is_multipart():
            continue
        url = part.get("Content-Location")
        if not url or not url.startswith(("http://", "https://")):
            continue
        payload = part.get_payload(decode=True) or b""
        record = writer.create_warc_record(
            url, "resource",
            payload=BytesIO(payload),
            warc_content_type=part.get_content_type(),
        )
        writer.write_record(record)
```

Учтите ограничения: HTTP-заголовков в MHTML нет, Chrome записывает часть ресурсов с адресами вида `cid:` (они отфильтрованы в примере), а датой записи станет время конвертации. Поэтому исходный MHTML-файл стоит сохранить рядом — как оригинал.

## Рекомендации

*   **Не создавайте новые архивы в MHTML** — для современных задач используйте WARC/WACZ.
*   **Храните исходные MHTML как есть**; при необходимости дополнительно переносите их содержимое в WARC (см. выше).
*   Прогоняйте файлы через Siegfried для фиксации формата в метаданных архивного объекта.
*   При чтении учитывайте, что **Content-Location** в MHTML не всегда соответствует реальному URL.

## Ресурсы

*   [RFC 2557](https://www.rfc-editor.org/rfc/rfc2557)
*   [PRONOM — MHTML (x-fmt/429)](https://www.nationalarchives.gov.uk/PRONOM/x-fmt/429)
*   [Chrome DevTools Protocol — Page.captureSnapshot](https://chromedevtools.github.io/devtools-protocol/tot/Page/#method-captureSnapshot)

## Связанные материалы

*   [Формат WARC](/kb/instruments/file-formats/warc)
*   [Формат WACZ](/kb/instruments/file-formats/wacz)
*   [Идентификация форматов](/kb/instruments/file-formats/identification-tools)
