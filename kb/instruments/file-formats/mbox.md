# MBOX

**MBOX** — семейство текстовых форматов для хранения коллекций email-сообщений в одном файле. Это де-факто стандарт архивации электронной почты, описанный в [RFC 4155](https://tools.ietf.org/html/rfc4155). Используется для архивации корпоративной и государственной переписки.

## Общая идея

В отличие от форматов «один файл на письмо» (EML, Maildir), MBOX объединяет все сообщения в один текстовый файл. Это удобно для передачи, индексации и хеширования, но создаёт проблему определения границ сообщений — её решают разные варианты формата.

## Варианты MBOX

Разные варианты отличаются способом разделения сообщений и обработкой строк, начинающихся с «From »:

| Вариант | Источник | Разделитель | Особенности |
| :--- | :--- | :--- | :--- |
| **mboxo** | Unix mail(1), оригинальный | `From ` (с пробелом) | Простая, но «From » внутри тела письма вызывает проблемы |
| **mboxrd** | Sendmail, рекомендован для архивов | `From ` | Внутри тела «From » префиксируется как `>From `, при чтении убирается |
| **mboxcl** | Unix, qmail | Заголовок `Content-Length:` | Более устойчива, но требует доверия к Content-Length |
| **mboxcl2** | Mozilla Thunderbird | `Content-Length:` | Улучшенная обработка краевых случаев |
| **MMDF** | Multichannel Memo Distribution Facility | специальная 4-символьная последовательность | Используется редко |

**Рекомендуемый вариант для архивов: `mboxrd`** — сохранена человекочитаемость и решена проблема `From `-в-тележек.

## Структура файла

Каждое сообщение — это полный RFC 5322-email, начинающийся с разделителя. Для `mboxo` и `mboxrd`:

```
From sender@example.com Mon Jan 01 12:00:00 2024
From: alice@example.com
To: bob@example.com
Subject: Archive of correspondence
Date: Mon, 1 Jan 2024 12:00:00 +0000
Message-ID: <abc@example.com>

Body of the message starts after one blank line.

>From inside (escape) line — was originally "From inside"

From sender@example.com Mon Jan 01 13:00:00 2024
From: alice@example.com
To: bob@example.com
Subject: Second message
Date: Mon, 1 Jan 2024 13:00:00 +0000
Message-ID: <def@example.com>

Second message body.
```

Разделитель начинается со слова `From`, пробела и email-адреса, за которым идёт строка даты в формате `ctime`. Важно: после слова `From` именно **один пробел**, не двоеточие (отличие от заголовка `From:` самого письма).

## Создание MBOX

### Из Unix mailutils / procmail

```bash
# formail собирает сообщения из stdin в mbox-файл
formail -s cat > archive.mbox < incoming_messages.txt

# maildir2mbox — рекурсивная конвертация
maildir2mbox maildir/ > archive.mbox
```

### Из Thunderbird

`File → ImportExportTools NG → Import mbox file`. Thunderbird хранит локальные папки в `mboxcl2`-формате, который можно экспортировать.

### Из Outlook (PST → MBOX)

```bash
# readpst (часть libpstl-html)
readpst -e -D -m archive.mbox archive.pst
```

PST — проприетарный формат Microsoft Outlook, и конвертация в MBOX — типичная задача при выпуске архивов из корпоративных источников.

## Валидация и парсинг

### Python (`mailbox` из stdlib)

```python
import mailbox

mbox = mailbox.mbox('archive.mbox')
print(f"Всего писем: {len(mbox)}")

for i, message in enumerate(mbox):
    print(f"[{i}] From: {message['From']}, Subject: {message['Subject']}, Date: {message['Date']}")
```

`mailbox.mbox` корректно обрабатывает экранирование `>From ` для варианта `mboxrd`. Для `mboxcl` есть отдельный класс `mailbox.mboxcl` (только чтение).

### Фильтрация по дате

```python
import mailbox
from datetime import datetime

mbox = mailbox.mbox('archive.mbox')
out = mailbox.mbox('filtered.mbox', create=True)

for msg in mbox:
    date = msg['Date']
    if date and datetime.strptime(date, '%a, %d %b %Y %H:%M:%S %z') >= datetime(2024, 1, 1, tzinfo=timezone.utc):
        out.add(msg)
out.close()
```

## Альтернативы

- **EML** — одно сообщение на файл. Удобно для гранулярного хранения и CDN-доставки, но много файлов.
- **Maildir** — каждое письмо в отдельном файле в директориях `new/`, `cur/`, `tmp/`. Быстрый, без блокировок, прост для синхронизации (например, через `git` или `syncthing`).
- **PST/OST** — проприетарный Microsoft Outlook. Сложен для долгосрочного хранения.

Для долгосрочного архива рекомендуется **MBOX (mboxrd)** — один файл, простая индексация, открытый формат с 1979 года.

## PUID в PRONOM

- **mbox (Berkeley)** — `fmt/795` (формально `x-fmt/207` для некоторых вариантов)
- **Maildir** — `fmt/799`

## Сценарии использования в Ruarxive

- **Архивы государственной переписки**, выгруженные из почтовых серверов (Postfix, Exchange).
- **Личные архивы публичных лиц** (журналисты, чиновники, активисты), переданные в Ruarxive.
- **Архивы рассылок**, опубликованные организацией и затем требующие сохранения.

## Рекомендации

*   Используйте вариант **mboxrd** — он рекомендован в RFC 4155 для архивов.
*   Всегда кодируйте сообщения в **UTF-8** — избегайте устаревших кодировок (KOI8-R, CP1251).
*   Сохраняйте **полные заголовки** (`Received:`, `DKIM-Signature:`, `Authentication-Results:`) — они критичны для проверки происхождения и для антифрод-анализа.
*   Перед архивацией запустите Siegfried для фиксации формата и хешей файлов.
*   Упаковывайте MBOX в **BagIt** для контрольных сумм и метаданных.

## Ресурсы

*   [RFC 4155 — application/mbox](https://tools.ietf.org/html/rfc4155)
*   [mailbox (Python stdlib)](https://docs.python.org/3/library/mailbox.html)
*   [readpst / libpst](https://www.five-ten-sg.com/libpst/)
*   [PRONOM — mbox](https://www.nationalarchives.gov.uk/PRONOM/)

## Связанные материалы

*   [Формат BagIt](/kb/instruments/file-formats/bagit)
*   [Идентификация форматов](/kb/instruments/file-formats/identification-tools)
*   [PREMIS](https://ru.wikipedia.org/wiki/PREMIS) — описание событий получения почты