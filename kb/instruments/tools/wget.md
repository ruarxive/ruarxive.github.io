---
title: Wget
sidebar_label: Wget
description: "GNU Wget — справочник для архивистов: установка, рекурсивная загрузка, запись WARC, основные флаги, ограничения и типичные ошибки сочетания опций."
last_update:
  date: 2026-10-12
---

# Wget

**GNU Wget** — неинтерактивный консольный загрузчик файлов по HTTP, HTTPS и FTP и простой рекурсивный кроулер. С версии 1.14 умеет сразу записывать результат в WARC, поэтому это самый доступный инструмент для базовой веб-архивации.

Сайт: [www.gnu.org/software/wget](https://www.gnu.org/software/wget/)

Эта страница — справочник по флагам и поведению Wget. Пошаговые сценарии (как скачать сайт, как собрать список страниц) — в гайде [Wget: сценарии](/kb/guides/wget).

## Зачем нужен

Wget не требует Docker, Python, JVM или Node.js: он есть в большинстве дистрибутивов Linux и легко ставится в macOS и Windows.

Типичные задачи:

- скачать отдельную страницу со всеми ресурсами или небольшой статический сайт;
- регулярно собирать фиксированный список URL;
- записать WARC без дополнительных инструментов.

## Когда использовать

✅ Подходит для:

- статических сайтов (HTML, CSS, изображения без обязательного JavaScript);
- списков URL из файла;
- окружений без Python и Docker.

❌ Не подходит для:

- современных SPA (React, Vue, Angular): Wget не выполняет JavaScript, используйте [Browsertrix](browsertrix);
- сайтов со сложной авторизацией и защитой от ботов;
- больших обходов с очередями, мониторингом и дедупликацией между сессиями: используйте [Heritrix](heritrix), [Brozzler](brozzler) или [grab-site](grab-site).

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

В macOS Wget не входит в систему (предустановлен `curl`). Установка через Homebrew:

```bash
brew install wget
```

### Windows

- [Chocolatey](https://chocolatey.org/): `choco install wget`;
- [MSYS2](https://www.msys2.org/) или Cygwin;
- WSL (обычный Linux-пакет).

### Проверка версии

```bash
wget --version
```

Для записи WARC нужна версия **1.14 или новее**.

> Команды на этой странице сверены с `wget --help` и реальными запусками GNU Wget 1.25.0 (октябрь 2026).

## Использование

### Скачать одну страницу со всеми ресурсами (для офлайн-просмотра)

```bash
wget --page-requisites --adjust-extension --convert-links \
     --span-hosts --domains=example.com,cdn.example.com \
     https://example.com/article/
```

| Флаг | Что делает |
| :--- | :--- |
| `-p, --page-requisites` | Скачивает CSS, изображения, скрипты, нужные для показа страницы |
| `-E, --adjust-extension` | Добавляет `.html`, `.css` по MIME-типу |
| `-k, --convert-links` | После загрузки переписывает ссылки на локальные файлы |
| `-H, --span-hosts` + `-D, --domains` | Разрешает ресурсы с перечисленных доменов (например, CDN) |

### Зеркалирование сайта

```bash
wget --mirror \
     --convert-links \
     --adjust-extension \
     --page-requisites \
     --no-parent \
     --restrict-file-names=windows \
     --wait=1 --random-wait \
     -P ./archive \
     https://example.com/
```

`--mirror` — сокращение для `-N -r -l inf --no-remove-listing`: рекурсия без ограничения глубины и режим timestamping (повторный запуск скачивает только изменившиеся файлы).

### Запись WARC

```bash
wget --recursive --level=2 --no-parent \
     --page-requisites --adjust-extension \
     --warc-file=archive --warc-cdx \
     --wait=1 --random-wait \
     https://example.com/
```

Результат: `archive.warc.gz` и `archive.cdx` (CDX-индекс). Файлы сайта тоже сохраняются на диск; если они не нужны, их можно удалить после сбора.

Флаги WARC:

| Флаг | Что делает |
| :--- | :--- |
| `--warc-file=ИМЯ` | Писать запросы и ответы в `ИМЯ.warc.gz` |
| `--warc-cdx` | Создать CDX-индекс рядом с WARC |
| `--warc-max-size=1G` | Делить WARC на части; файлы получат имена `ИМЯ-00000.warc.gz`, …, плюс `ИМЯ-meta.warc.gz` |
| `--warc-header="ключ: значение"` | Добавить строку в запись `warcinfo` (например, описание коллекции) |
| `--warc-dedup=файл.cdx` | Не сохранять повторно ответы, перечисленные в CDX прошлого сбора (пишутся `revisit`-записи) |
| `--no-warc-compression` | Не сжимать WARC |
| `--no-warc-keep-log` | Не сохранять журнал Wget внутрь WARC |
| `--warc-tempdir=КАТАЛОГ` | Каталог для временных файлов |

Особенности:

- с `--warc-file` Wget отключает `--no-clobber` и предупреждает об этом;
- `--convert-links` меняет только файлы на диске; в WARC остаются исходные ответы сервера;
- Wget 1.x записывает `WARC-Target-URI` в угловых скобках. Строгие валидаторы, например [warchaeology](warchaeology), считают это ошибкой (проверяйте с `--lenient`), а инструменты воспроизведения такие файлы обычно читают.

Готовый WARC можно посмотреть в [ReplayWeb.page](/kb/instruments/replay/replayweb-page) или [pywb](/kb/instruments/replay/pywb).

### Скачивание списка URL из файла

```bash
# urls.txt: по одному URL на строку
wget --input-file=urls.txt \
     --directory-prefix=./archive \
     --wait=1 --random-wait
```

### Докачка после обрыва

```bash
# докачать недокачанные файлы
wget --continue --input-file=urls.txt --directory-prefix=./archive

# или: пропустить уже скачанные файлы целиком
wget --no-clobber --input-file=urls.txt --directory-prefix=./archive
```

### Ограничение по типу файлов

```bash
# только HTML и PDF
wget --recursive --level=3 --no-parent \
     --accept='html,htm,pdf' \
     https://example.com/
```

`--accept` и `--reject` принимают суффиксы или шаблоны имён файлов. Регулярные выражения задаются через `--accept-regex` и `--reject-regex` и применяются к полному URL.

## Несовместимые и конфликтующие флаги

| Сочетание | Что произойдёт |
| :--- | :--- |
| `--mirror` или `-N` вместе с `--no-clobber` | Ошибка: «Can't timestamp and not clobber old files at the same time», Wget не запустится |
| `--no-clobber` вместе с `--convert-links` | Предупреждение, `--no-clobber` игнорируется |
| `--no-clobber` вместе с `--warc-file` | Предупреждение, `--no-clobber` отключается |
| `-o/--output-file` и `-a/--append-output` | Это альтернативы: `-o` перезаписывает журнал, `-a` дописывает в него. Указывайте один из них |

## robots.txt

При рекурсивной загрузке Wget **по умолчанию соблюдает** robots.txt (Robot Exclusion Standard), то есть по умолчанию действует `robots = on`. Отключить можно через `-e robots=off`. Это решение под вашу ответственность: учитывайте правила сайта и нагрузку на сервер. Подробнее — в [руководстве](https://www.gnu.org/software/wget/manual/html_node/Robot-Exclusion.html).

## Конфигурация

### `~/.wgetrc`

```ini
# осмысленный User-Agent с контактом
user_agent = Mozilla/5.0 (compatible; ArchiveBot/1.0; +https://example.com/bot)

# задержка между запросами
wait = 1
random_wait = on

# таймауты (секунды)
connect_timeout = 30
read_timeout = 60

# повторы
tries = 5
retry_connrefused = on
```

Путь к другому файлу настроек задаётся переменной окружения `WGETRC`:

```bash
export WGETRC=/path/to/wgetrc
```

Cookies передаются флагами `--load-cookies=cookies.txt` (формат Netscape) и `--save-cookies`.

## Сравнение с другими инструментами

| Инструмент | WARC | JavaScript | Сложность | Лучше всего для |
| :--- | :---: | :---: | :--- | :--- |
| **Wget** | ✅ (1.14+) | ❌ | Очень низкая | Быстрые разовые загрузки |
| **[Wget2](https://gitlab.com/gnuwget/wget2)** | ❌ | ❌ | Низкая | Параллельная загрузка, HTTP/2 (без WARC) |
| **[Wget-AT](https://github.com/ArchiveTeam/wget-lua)** | ✅ (в т. ч. zstd) | ❌ | Средняя | Проекты ArchiveTeam, Lua-хуки, дедупликация |
| **[Wpull](wpull) / [grab-site](grab-site)** | ✅ | ❌ | Средняя | Большие обходы с WARC, требует старый Python |
| **[HTTrack](httrack)** | ⚠️ через [httrack2warc](https://github.com/nla/httrack2warc) | ❌ | Низкая | Офлайн-копия, GUI |
| **[Heritrix](heritrix)** | ✅ | ❌ | Высокая | Большие проекты архивирования |
| **[Browsertrix](browsertrix)** | ✅ WACZ | ✅ | Средняя | Современные сайты с JavaScript |
| **[SingleFile](singlefile)** | ❌ | ✅ | Низкая | Одна страница в HTML |

GNU Wget 1.x не поддерживает HTTP/2 ни в одной версии. HTTP/2 есть в Wget2, но Wget2 не пишет WARC.

## Рекомендации

### 1. Ставьте осмысленный User-Agent

```bash
wget --user-agent="Ruarxive/1.0 (https://ruarxive.org)" https://example.com/
```

Так администраторы сайта поймут, кто и зачем скачивает.

### 2. Делайте паузы между запросами

```bash
wget --wait=1 --random-wait --recursive --level=2 https://example.com/
```

`--random-wait` варьирует паузу от 0,5 до 1,5 значения `--wait`.

### 3. Ограничивайте домены

```bash
wget --recursive --span-hosts --domains=example.com,cdn.example.com https://example.com/
```

Без `--span-hosts` Wget и так не выходит за пределы стартового хоста. С ним `--domains` задаёт разрешённый список.

### 4. Сохраняйте журнал

```bash
wget --output-file=wget.log ...      # новый журнал
wget --append-output=wget.log ...    # дописать в существующий
```

### 5. Регулярные сборы через cron

```bash
# ежедневно в 3:00 — собрать список URL в WARC с датой в имени
0 3 * * * cd /opt/collector && \
  wget --input-file=urls.txt \
       --directory-prefix="$(date +\%F)" \
       --wait=2 --random-wait \
       --warc-file="$(date +\%F)/archive" \
       --append-output=/var/log/wget-collector.log
```

В crontab символ `%` нужно экранировать (`\%`). Для повторных сборов того же списка можно передать CDX прошлого запуска в `--warc-dedup`.

## Ограничения

- Не выполняет JavaScript: динамический контент не сохранится.
- Загружает файлы последовательно, в один поток. Для параллельности запускайте несколько процессов на разные списки URL.
- Нет HTTP/2.
- Плохо работает со сложной авторизацией: нет браузерного движка.
- WARC-вывод базовый: нет WACZ и CDXJ. Дедупликация только по CDX прошлого сбора (`--warc-dedup`).
- Большие проекты (сотни тысяч URL) лучше отдавать Heritrix, Brozzler или grab-site.

## Ресурсы

- [Официальный сайт GNU Wget](https://www.gnu.org/software/wget/)
- [Руководство Wget](https://www.gnu.org/software/wget/manual/wget.html)
- [Примеры из руководства](https://www.gnu.org/software/wget/manual/html_node/Advanced-Usage.html)
- [GNU Wget2](https://gitlab.com/gnuwget/wget2)
- [Wget-AT (ArchiveTeam)](https://github.com/ArchiveTeam/wget-lua)

## Связанные материалы

- **[Wget: сценарии](/kb/guides/wget)** — пошаговые инструкции.
- **[Wpull](wpull)** — Wget-совместимый загрузчик на Python с WARC.
- **[HTTrack](httrack)** — GUI-альтернатива для зеркалирования.
- **[Обработка WARC](warc-processing)** — что делать с полученным WARC.
- **[Heritrix](heritrix)** — для крупных проектов архивирования.
- **[Как создать цифровой архив сайта](/kb/instruments/howto-collect/make-copy-website)**
- **[Экстренная архивация](/kb/guides/emergency-archiving)**
- **[Формат WARC](/kb/instruments/file-formats/warc)**
- **[Формат CDX](/kb/instruments/file-formats/cdx)**
- **[Воспроизведение через pywb](/kb/instruments/replay/pywb)**
