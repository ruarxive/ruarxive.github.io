# MHTML

**MHTML (MIME Encapsulation of Aggregate HTML Documents)** — формат для упаковки веб-страницы со всеми её ресурсами (изображения, CSS, JavaScript) в один файл. Описан в [RFC 2557](https://tools.ietf.org/html/rfc2557). Известен по расширениям `.mht`, `.mhtml`.

## Зачем нужен MHTML

До широкого распространения WARC существовал как «способ сохранить страницу в один файл». Старые архивы (Internet Archive до 2008, корпоративные скриншоты, материалы из почтовых клиентов) часто содержат MHTML-файлы. Их понимание нужно при импорте исторических архивов.

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

### Из Chromium

```bash
chromium --headless --disable-gpu --print-to-mhtml=output.mhtml https://example.com
```

### Из Chrome через DevTools Protocol

```bash
curl -X PUT http://localhost:9222/json \
  -d '{"url":"https://example.com/","targetId":"abc"}'
# Получить targetId из /json/version
```

### Из Python (`requests-mhtml`)

```python
import requests
from requests_html import HTMLSession

session = HTMLSession()
response = session.get("https://example.com")
# С mhtml поддержка ограничена; удобнее использовать chromium
```

## Открытие и парсинг

### Браузеры

*   **Internet Explorer** — исторический родной формат (кнопка «Сохранить как веб-страницу, полностью»).
*   **Microsoft Edge (старый, на EdgeHTML)** — поддерживал.
*   **Microsoft Outlook** — прикрепляет страницы как MHTML в `.msg`-файлах.
*   **Chrome / Chromium / Safari** — умеют открывать `.mhtml` напрямую.

### Парсинг в Python

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
| WARC-записи | нет |
| Метаданные архива | нет | да |
| Многостраничные сайты | один файл = одна страница | многостраничная коллекция |
| Сжатие | редко | обычно gzip |
| Использование сейчас | legacy | стандарт |

MHTML **не подходит** для современных архивов. Это наследие, которое нужно понимать для чтения старых данных, но не создавать новые.

## PUID в PRONOM

- **MHTML** — `fmt/1014`

## Инструменты

*   **Chromium / Chrome** — единственный современный браузер с нативной поддержкой `Save as MHTML` и `--print-to-mhtml`.
*   **MS Outlook** — сохраняет HTML-вложения в MHTML.
*   **MHTML-Python** — `mhtml` пакет на PyPI.
*   **`libwkhtmltox`** — для серверного рендеринга с поддержкой MHTML.

## Рекомендации

*   **Не создавайте новые архивы в MHTML** — для современных задач используйте WARC/WACZ.
*   **Для импорта старых MHTML**: конвертируйте в WARC через `warcprox` или `wget --warc-file=output.warc`. Это позволит унифицировать хранение.
*   Всегда прогоняйте через Siegfried для фиксации формата в метаданных архивного объекта.
*   При чтении учитывайте, что **Content-Location** в MHTML не всегда соответствует реальному URL.

## Ресурсы

*   [RFC 2557](https://tools.ietf.org/html/rfc2557)
*   [PRONOM — MHTML](https://www.nationalarchives.gov.uk/PRONOM/)

## Связанные материалы

*   [Формат WARC](/kb/instruments/file-formats/warc)
*   [Формат WACZ](/kb/instruments/file-formats/wacz)
*   [Идентификация форматов](/kb/instruments/file-formats/identification-tools)