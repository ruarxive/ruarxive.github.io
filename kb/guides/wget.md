---
title: "Wget: сохранить сайт в WARC"
sidebar_label: "Wget: сайт в WARC"
sidebar_position: 4
last_update:
  date: 2026-10-12
description: "Пошаговые сценарии сбора сайта утилитой GNU wget с записью WARC и CDX-индекса: весь сайт, список URL, ограничения объёма, повторный сбор с дедупликацией, проверка результата."
keywords: [wget, warc, архивация сайтов, зеркалирование, командная строка, экстренная архивация]
---

# Wget: сохранить сайт в WARC

Этот гайд — набор готовых сценариев: как с помощью [GNU wget](https://www.gnu.org/software/wget/) сохранить сайт так, чтобы получился не только набор файлов для офлайн-просмотра, но и **архивный файл WARC** — стандартный формат веб-архивов (ISO 28500), который можно открыть в плеере, проиндексировать и передать в архив.

Справочник по установке, всем параметрам и ограничениям wget — на странице [Wget — справочник по инструменту](/kb/instruments/tools/wget). Здесь — только то, что нужно для конкретных задач.

:::tip Когда wget подходит
wget хорошо работает со статическими сайтами: HTML, изображения, PDF, CSS. Он **не выполняет JavaScript**, поэтому для современных сайтов, где содержимое подгружается скриптами, используйте [Browsertrix](/kb/instruments/tools/browsertrix) — см. [Архивация динамических сайтов](/kb/guides/dynamic-ajax-sites).
:::

## Подготовка

1. Установите wget (Linux: `sudo apt install wget`; macOS: `brew install wget`; Windows: `choco install wget`). Подробнее — в [справочнике](/kb/instruments/tools/wget).
2. Проверьте, что ваша сборка умеет писать WARC (поддержка появилась в wget 1.14):

```bash
wget --version | head -1
wget --help | grep -i warc
```

Если в выводе есть `--warc-file`, всё готово.

3. Пройдите [Preflight-чеклист](/kb/guides/preflight-checklist): цель, охват, правовые ограничения, место на диске.

## Сценарий 1. Сохранить сайт целиком в WARC

Основной рецепт:

```bash
wget --mirror --page-requisites --adjust-extension --convert-links --no-parent \
     --wait=1 --random-wait \
     --warc-file=example-2026-10-12 --warc-cdx --warc-max-size=1G \
     https://example.com/
```

Что делают параметры:

| Параметр | Зачем |
|:---|:---|
| `--mirror` | Рекурсивный обход без ограничения глубины (`-r -l inf`) |
| `--page-requisites` | Скачивать всё, что нужно для отображения страницы: CSS, изображения, скрипты |
| `--adjust-extension` | Добавлять `.html` к страницам без расширения (для офлайн-копии) |
| `--convert-links` | Переписать ссылки в локальных файлах для офлайн-просмотра |
| `--no-parent` | Не подниматься выше стартового каталога |
| `--wait=1 --random-wait` | Пауза около секунды между запросами — щадящая нагрузка на сервер |
| `--warc-file=ИМЯ` | Записывать все запросы и ответы в `ИМЯ.warc.gz` |
| `--warc-cdx` | Дополнительно создать CDX-индекс `ИМЯ.cdx` |
| `--warc-max-size=1G` | Делить WARC на части по ~1 ГБ |

Что получится:

- папка `example.com/` — офлайн-копия для просмотра в браузере;
- `example-2026-10-12-00000.warc.gz`, `-00001.warc.gz` и т. д. — WARC-файлы (при `--warc-max-size`; без него — один файл `example-2026-10-12.warc.gz`);
- `example-2026-10-12-meta.warc.gz` — служебные записи (параметры запуска и журнал wget); без `--warc-max-size` они пишутся в тот же WARC-файл;
- `example-2026-10-12.cdx` — индекс записей.

Важно знать:

- `--convert-links` меняет только локальные файлы; в WARC сохраняются исходные ответы сервера.
- При записи WARC wget сам отключает несовместимые режимы: проверку времени изменения файлов (`-N`, входит в `--mirror`), `--no-clobber` и `--continue` — и сообщает об этом в выводе. Поэтому каждый запуск скачивает сайт заново.
- По умолчанию wget соблюдает `robots.txt`. Отключать это (`-e robots=off`) стоит только осознанно — см. позицию проекта в разделе [Условия использования сервисов](/kb/legal/terms-of-service).

## Сценарий 2. Только WARC, без офлайн-копии

Если папка с файлами не нужна, а важен только архив:

```bash
wget --recursive --level=inf --page-requisites --no-parent \
     --wait=1 --random-wait --delete-after \
     --warc-file=example-2026-10-12 --warc-cdx \
     https://example.com/
```

`--delete-after` удаляет локальные файлы после обработки, при этом ссылки из страниц успевают извлечься, а все ответы остаются в WARC.

## Сценарий 3. Список отдельных страниц

Когда нужно сохранить конкретные страницы (например, список публикаций или документов):

```bash
# urls.txt — по одному URL на строку
wget --input-file=urls.txt --page-requisites --adjust-extension \
     --wait=1 --random-wait \
     --warc-file=pages-2026-10-12 --warc-cdx
```

## Сценарий 4. Ограничить глубину и объём

Для очень большого сайта или когда нужна только часть:

```bash
wget --recursive --level=3 --page-requisites --no-parent \
     --quota=5G --wait=1 --random-wait \
     --reject-regex='\.(mp4|avi|mov|iso|zip)$' \
     --warc-file=example-part-2026-10-12 --warc-cdx \
     https://example.com/news/
```

- `--level=3` — не дальше трёх переходов от стартовой страницы;
- `--quota=5G` — остановиться после ~5 ГБ (при рекурсивной загрузке);
- `--reject-regex` — пропускать тяжёлые файлы по шаблону URL.

## Сценарий 5. Сайт с отдельными доменами для статики

Если изображения и файлы лежат на поддомене или CDN, разрешите переход на эти домены, но только на них:

```bash
wget --mirror --page-requisites --adjust-extension --convert-links --no-parent \
     --span-hosts --domains=example.com,static.example.com \
     --wait=1 --random-wait \
     --warc-file=example-2026-10-12 --warc-cdx \
     https://example.com/
```

Без `--domains` параметр `--span-hosts` уведёт обход на любые внешние сайты.

## Сценарий 6. Повторный сбор с дедупликацией

При регулярной архивации одного сайта можно не хранить повторно ресурсы, которые не изменились. Передайте CDX-индекс предыдущего сбора:

```bash
wget --mirror --page-requisites --no-parent --wait=1 --random-wait \
     --warc-file=example-2026-11-12 --warc-cdx \
     --warc-dedup=example-2026-10-12.cdx \
     https://example.com/
```

Для ресурсов, совпадающих по дайджесту с записями из индекса, wget запишет короткие записи `revisit` со ссылкой на исходную запись (`WARC-Refers-To`) вместо полного содержимого. Храните предыдущие WARC вместе с новыми — без них такие записи не воспроизвести.

## Сценарий 7. Сбор прервался

При записи WARC продолжить загрузку (`--continue`) нельзя — wget отключит этот режим. Запустите сбор заново с **новым** именем WARC-файла, чтобы не перезаписать уже собранное, например `--warc-file=example-2026-10-12-run2`. Если первый запуск успел записать CDX, используйте его в `--warc-dedup` (сценарий 6), чтобы не дублировать данные.

## Дополнительно: описание сбора внутри WARC

В служебную запись `warcinfo` можно добавить сведения о сборе:

```bash
wget --mirror --page-requisites --no-parent \
     --warc-file=example-2026-10-12 --warc-cdx \
     --warc-header="operator: имя или проект" \
     --warc-header="description: архив сайта example.com перед закрытием" \
     https://example.com/
```

## Проверка результата

```bash
# Сколько ответов попало в WARC
gunzip -c example-2026-10-12-00000.warc.gz | grep -a -c '^WARC-Type: response'

# Проверка контрольных сумм записей (warcio)
pip install warcio
warcio check -v example-2026-10-12-00000.warc.gz

# Индекс в формате JSON (по строке на запись)
warcio index example-2026-10-12-00000.warc.gz | head
```

Затем откройте WARC в [ReplayWeb.page](https://replayweb.page/) и пролистайте несколько случайных страниц. Дальнейшие шаги — индексация, упаковка в WACZ, публикация — в гайде [WARC: от архива до публикации](/kb/guides/warc-workflow).

> Параметры сверены с `wget --help` версии 1.25.0 и с [руководством GNU Wget](https://www.gnu.org/software/wget/manual/wget.html); `warcio` — версии 1.8.1 (октябрь 2026).

## Частые проблемы

| Проблема | Что сделать |
|:---|:---|
| Обход «уходит» на чужие сайты | Уберите `--span-hosts` или ограничьте домены через `--domains` |
| Скачивается слишком много | Ограничьте `--level`, `--quota`, добавьте `--reject-regex` или `--exclude-directories` |
| Не видны изображения и стили | Добавьте `--page-requisites`; если они на другом домене — сценарий 5 |
| Сайт отвечает 429 или 503 | Увеличьте `--wait`, добавьте `--limit-rate=200k` |
| Сервер отклоняет запросы с User-Agent wget | Укажите собственный User-Agent с контактом, например `--user-agent="archiver (contact@example.org)"` |
| Капча, антибот-защита, требуется вход | Не пытайтесь обойти защиту — см. [Правовые и этические вопросы](/kb/legal) |
| Страница пустая, содержимое грузится скриптами | wget не выполняет JavaScript — используйте [Browsertrix](/kb/instruments/tools/browsertrix) |

## Альтернативы

| Инструмент | Когда использовать | Статус |
|:---|:---|:---|
| **wget** | Статические сайты, быстрые сборы | Поддерживается |
| **[Wget-AT](https://github.com/ArchiveTeam/wget-lua)** (ArchiveTeam) | Сложная логика обхода через Lua, сжатие WARC в Zstandard | Поддерживается, сборка из исходников |
| **[grab-site](/kb/instruments/tools/grab-site)** | Крупные обходы с панелью мониторинга | Развивается медленно |
| **[Wpull](/kb/instruments/tools/wpull)** | Исторически — замена wget на Python с WARC | Не развивается: последний релиз на PyPI — 2.0.1 (2016), на современных версиях Python не устанавливается без доработок |
| **[Browsertrix](/kb/instruments/tools/browsertrix)** | Сайты на JavaScript, сложные страницы | Поддерживается |
| **[Heritrix](/kb/instruments/tools/heritrix)** | Очень большие обходы, кластер | Поддерживается |

## Связанные материалы

- [Wget — справочник по инструменту](/kb/instruments/tools/wget) — установка, все параметры, ограничения.
- [Быстрый старт: архивация за 5 минут](/kb/guides/quick-start-5min) — без командной строки.
- [Экстренная архивация](/kb/guides/emergency-archiving) — стратегия при кризисных ситуациях.
- [Стратегии сбора](/kb/guides/collection-strategies) — как выбрать охват, глубину и темп.
- [WARC: от архива до публикации](/kb/guides/warc-workflow) — что делать с WARC дальше.
- [Формат WARC](/kb/instruments/file-formats/warc) — устройство файла.
- [Кастомные workflow](/kb/guides/custom-workflows) — автоматизация на bash и Python.
