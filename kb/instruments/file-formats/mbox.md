---
title: MBOX
description: "MBOX — семейство форматов для хранения коллекций писем в одном файле: варианты mboxo/mboxrd/mboxcl, конвертация из Maildir и PST, разбор на Python и рекомендации для архивов."
last_update:
  date: 2026-10-12
---

# MBOX

**MBOX** — семейство текстовых форматов для хранения коллекций email-сообщений в одном файле. Это один из самых распространённых форматов архивации электронной почты; медиатип `application/mbox` зарегистрирован в [RFC 4155](https://www.rfc-editor.org/rfc/rfc4155). Используется для архивации корпоративной и государственной переписки.

## Общая идея

В отличие от форматов «один файл на письмо» (EML, Maildir), MBOX объединяет все сообщения в один текстовый файл. Это удобно для передачи, индексации и хеширования, но создаёт проблему определения границ сообщений — её разные варианты формата решают по-разному.

## Варианты MBOX

Каждое сообщение начинается со строки-разделителя `From ` (слово From и пробел). Если такая строка встречается в теле письма, её нужно экранировать, иначе она будет принята за начало нового сообщения. Схему названий вариантов предложили в 1996 году Дэниел Бернстайн, Рахул Дхеси и другие:

| Вариант | Происхождение | Границы сообщений | Экранирование `From ` в теле |
| :--- | :--- | :--- | :--- |
| **mboxo** | исходный формат Unix | строка `From ` | `From ` → `>From `; обратное преобразование неоднозначно |
| **mboxrd** | предложен Р. Дхеси и др., используется в qmail | строка `From ` | к любой строке вида `>…>From ` добавляется ещё один `>`; преобразование обратимо |
| **mboxcl** | почтовые утилиты Unix System V Release 4 | заголовок `Content-Length:` | как в mboxo |
| **mboxcl2** | почтовые утилиты Unix System V Release 4 | заголовок `Content-Length:` | не выполняется |
| **MMDF** | Multichannel Memo Distribution Facility | строка из четырёх символов `Ctrl-A` | не требуется |

Почтовые клиенты семейства Mozilla (в том числе Thunderbird) используют вариацию mboxrd с собственными правилами экранирования.

**Для архивов удобнее `mboxrd`:** экранирование обратимо, и исходный текст писем можно восстановить без потерь. Но главное — фиксировать в метаданных, какой вариант используется: программа, читающая файл, должна знать правила экранирования.

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

Разделитель начинается со слова `From`, пробела и адреса отправителя, за которым идёт дата в формате `ctime` (по RFC 4155 — в UTC). Важно: после слова `From` стоит **пробел**, а не двоеточие (отличие от заголовка `From:` самого письма).

## Создание MBOX

### Из Maildir (Python, стандартная библиотека)

```python
import mailbox

src = mailbox.Maildir('Maildir', factory=None, create=False)
dst = mailbox.mbox('archive.mbox', create=True)
dst.lock()
try:
    for message in src:
        dst.add(mailbox.mboxMessage(message))
    dst.flush()
finally:
    dst.unlock()
    dst.close()
```

### Из Thunderbird

Thunderbird хранит локальные папки в файлах mbox (без расширения) в каталоге профиля. Для удобного экспорта папок в mbox и EML используется дополнение ImportExportTools NG.

### Из Outlook (PST → MBOX)

Утилита `readpst` из библиотеки [libpst](https://www.five-ten-sg.com/libpst/) (пакет `pst-utils` в Debian/Ubuntu) конвертирует PST в mbox:

```bash
sudo apt install pst-utils

mkdir out
# -r — сохранить иерархию папок PST, в каждой папке будет файл mbox
# -D — включить удалённые элементы
readpst -r -D -o out/ archive.pst
```

В рекурсивном режиме (`-r`) `readpst` использует экранирование mboxrd. Опции `-M`, `-S`, `-e` и `-m` вместо mbox сохраняют каждое письмо в отдельный файл.

> Опции `readpst` сверены со страницей руководства Debian (libpst 0.6.76).

PST — проприетарный формат Microsoft Outlook, и конвертация в MBOX — типичная задача при приёме архивов из корпоративных источников.

## Валидация и парсинг

### Python (`mailbox` из stdlib)

```python
import mailbox

mbox = mailbox.mbox('archive.mbox')
print(f"Всего писем: {len(mbox)}")

for i, message in enumerate(mbox):
    print(f"[{i}] From: {message['From']}, Subject: {message['Subject']}, Date: {message['Date']}")
```

Модуль `mailbox` поддерживает форматы `mbox`, `Maildir`, `MH`, `Babyl` и `MMDF`; отдельных классов для mboxcl/mboxrd нет. Класс `mailbox.mbox` ведёт себя как mboxo: при записи добавляет `>` только к строкам, начинающимся с `From `, а при чтении экранирование не снимает. Учитывайте это, если нужно точно восстановить текст писем из файла mboxrd.

### Фильтрация по дате

Заголовок `Date:` в реальных письмах бывает в разных форматах и иногда повреждён, поэтому для разбора используйте `email.utils.parsedate_to_datetime`:

```python
import mailbox
from datetime import datetime, timezone
from email.utils import parsedate_to_datetime

mbox = mailbox.mbox('archive.mbox')
out = mailbox.mbox('filtered.mbox', create=True)
since = datetime(2024, 1, 1, tzinfo=timezone.utc)

for msg in mbox:
    try:
        date = parsedate_to_datetime(msg['Date'])
    except (TypeError, ValueError):
        continue  # нет заголовка Date или он не разбирается
    if date.tzinfo is None:
        date = date.replace(tzinfo=timezone.utc)
    if date >= since:
        out.add(msg)
out.close()
```

## Альтернативы

- **EML** — одно сообщение на файл. Удобно для гранулярного хранения, но файлов получается много.
- **Maildir** — каждое письмо в отдельном файле в каталогах `new/`, `cur/`, `tmp/`. Работает без блокировок, удобен для синхронизации.
- **PST/OST** — проприетарный формат Microsoft Outlook. Сложен для долгосрочного хранения.

Для долгосрочного архива MBOX удобен: один файл, простая индексация, открытый текстовый формат.

## PUID в PRONOM

- **MBOX** — [`fmt/720`](https://www.nationalarchives.gov.uk/PRONOM/fmt/720) (идентификатор сверен с сигнатурным файлом DROID V125).
- **Maildir** — отдельного PUID нет: это структура каталогов, а не формат файла; идентифицируются отдельные файлы писем внутри неё.

## Сценарии использования в Ruarxive

- **Архивы государственной переписки**, выгруженные из почтовых серверов (Postfix, Exchange).
- **Личные архивы публичных лиц** (журналисты, чиновники, активисты), переданные в Ruarxive.
- **Архивы рассылок**, опубликованные организацией и затем требующие сохранения.

## Рекомендации

*   Используйте вариант **mboxrd** и фиксируйте вариант формата в метаданных.
*   **Храните письма как есть**, в исходных кодировках (KOI8-R, CP1251 и т. д.). Перекодирование меняет оригинал и ломает подписи DKIM, а значит, и доказательную ценность архива. Для чтения перекодируйте копии.
*   Сохраняйте **полные заголовки** (`Received:`, `DKIM-Signature:`, `Authentication-Results:`) — они критичны для проверки происхождения.
*   Перед архивацией запустите Siegfried для фиксации формата и хешей файлов.
*   Упаковывайте MBOX в **BagIt** для контрольных сумм и метаданных.

## Ресурсы

*   [RFC 4155 — application/mbox](https://www.rfc-editor.org/rfc/rfc4155)
*   [mailbox (Python stdlib)](https://docs.python.org/3/library/mailbox.html)
*   [readpst / libpst](https://www.five-ten-sg.com/libpst/)
*   [PRONOM — MBOX (fmt/720)](https://www.nationalarchives.gov.uk/PRONOM/fmt/720)
*   [LC FDD — MBOX Email Format](https://www.loc.gov/preservation/digital/formats/fdd/fdd000383.shtml)

## Связанные материалы

*   [Формат BagIt](/kb/instruments/file-formats/bagit)
*   [Идентификация форматов](/kb/instruments/file-formats/identification-tools)
*   [PREMIS](/kb/instruments/file-formats/premis) — описание событий получения почты
