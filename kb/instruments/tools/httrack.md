---
title: HTTrack
sidebar_label: HTTrack
description: "HTTrack — бесплатный кроссплатформенный краулер для создания офлайн-зеркал сайтов; с версии 3.49-14 (2026) умеет писать WARC/1.1 и WACZ."
last_update:
  date: 2026-10-12
---

# HTTrack

**[HTTrack](https://www.httrack.com/)** — бесплатный открытый инструмент (GPL-3.0) для копирования сайтов на локальный компьютер: он рекурсивно скачивает страницы, изображения и другие файлы и переписывает ссылки так, чтобы зеркало можно было просматривать офлайн.

После долгого перерыва (версия 3.49-2 вышла в 2017 году) проект снова активно развивается: в 2026 году вышла серия релизов 3.49-3…3.50-5 с поддержкой современных HTTPS-серверов, SOCKS5, Brotli/Zstandard и **записью WARC**.

## Описание

### Особенности

*   **Интерфейсы**: консольная утилита `httrack`, графические оболочки WinHTTrack (Windows) и WebHTTrack (Linux, BSD, macOS; запускается командой `webhttrack` и открывается в браузере).
*   **Рекурсивная загрузка**: скачивает сайт с сохранением структуры.
*   **Офлайн-просмотр**: переписывает ссылки для локального просмотра.
*   **Обновление и докачка**: может обновить существующее зеркало и продолжить прерванную загрузку.
*   **Фильтрация**: гибкие правила включения и исключения URL.
*   **WARC**: с версии 3.49-14 (июль 2026 года) — запись WARC/1.1, индекса CDXJ и упаковка в WACZ.

## Установка

### Windows

Скачайте установщик WinHTTrack с [официального сайта](https://www.httrack.com/).

### Linux

```bash
# Ubuntu/Debian
sudo apt-get install httrack webhttrack

# Fedora
sudo dnf install httrack
```

Пакеты в дистрибутивах могут быть старыми (например, 3.49.2 без поддержки WARC). Проверьте версию командой `httrack --version`; свежую версию можно собрать из [исходников](https://github.com/xroche/httrack/releases) (`./configure && make && sudo make install`).

### macOS

```bash
brew install httrack
```

> Команды и параметры сверены с man-страницей `httrack.1` и `history.txt` репозитория `xroche/httrack` версии 3.50.5 (октябрь 2026).

## Использование

### Мастер настройки

Команда `httrack` без аргументов запускает **текстовый мастер** в консоли: он по очереди спрашивает адрес, каталог и параметры. Графический интерфейс — это отдельные программы WinHTTrack и WebHTTrack.

### Командная строка

```bash
httrack https://example.com/ -O /path/to/output
```

### Базовые опции

```bash
httrack https://example.com/ \
  -O /path/to/output \
  -r5 \
  -%v
```

*   `-O`: каталог зеркала (и журналов/кэша);
*   `-r5`: глубина рекурсии — 5 уровней (`--depth`);
*   `-%v`: показывать на экране имена скачиваемых файлов (`--display`).

Не путайте с `-%p` (`--preserve`): этот параметр сохраняет HTML «как есть», **без переписывания ссылок**, и офлайн-просмотр зеркала после этого работать не будет.

## Запись WARC

Начиная с версии 3.49-14 HTTrack сам пишет архив в формате WARC/1.1 (ISO 28500):

```bash
httrack https://example.com/ \
  -O /path/to/output \
  --warc \
  --warc-file example \
  --warc-cdx \
  --wacz
```

*   `--warc` (`-%r`) — писать WARC/1.1;
*   `--warc-file NAME` — имя выходного файла;
*   `--warc-max-size N` — начинать новый сегмент WARC после N байт;
*   `--warc-cdx` — дополнительно записать отсортированный индекс CDXJ;
*   `--wacz` — упаковать всё в WACZ (его можно открыть в [ReplayWeb.page](/kb/instruments/replay/replayweb-page)).

Эти параметры доступны и в WebHTTrack.

### Конвертация старых зеркал: httrack2warc

Для зеркал, сделанных старыми версиями HTTrack, есть конвертер [httrack2warc](https://github.com/nla/httrack2warc) от Национальной библиотеки Австралии. Он восстанавливает запросы и ответы из кэша `hts-cache` и журналов, поэтому результат приблизительный (авторы предупреждают, что инструмент не используется у них в продакшене). Готовый JAR — на [странице релизов](https://github.com/nla/httrack2warc/releases), нужна Java 8+:

```bash
java -jar httrack2warc-0.6.1-shaded.jar -o /path/to/warcs /path/to/httrack/output
```

## Сравнение с Wget

| Инструмент | GUI | WARC | Простота | Рекомендация |
| :--- | :--- | :--- | :--- | :--- |
| **HTTrack** | Да (WinHTTrack/WebHTTrack) | Да, с 3.49-14 (`--warc`); для старых версий — конвертация | Высокая | **Для пользователей GUI и офлайн-зеркал** |
| **[Wget](/kb/instruments/tools/wget)** | Нет | Да (`--warc-file`, с версии 1.14) | Высокая | Для командной строки |
| **[Browsertrix Crawler](/kb/instruments/tools/browsertrix)** | В сервисе Browsertrix | Да (WARC/WACZ) | Средняя | Для сайтов с JavaScript |

### Когда использовать HTTrack

*   Нужен графический интерфейс.
*   Простые статические сайты.
*   Нужно офлайн-зеркало для просмотра без специальных программ.

### Когда использовать Wget

*   Работа в командной строке и автоматизация через скрипты.
*   В системе доступен только старый пакет HTTrack без поддержки WARC.

### Когда не использовать HTTrack

*   Сайты, где контент подгружается JavaScript-ом, и SPA — используйте [Browsertrix Crawler](/kb/instruments/tools/browsertrix).
*   Очень большие обходы с распределением нагрузки — [Heritrix](/kb/instruments/tools/heritrix) или [Brozzler](/kb/instruments/tools/brozzler).

## Best practices

### Ограничения

```bash
httrack https://example.com/ \
  -O /path/to/output \
  -r3 \
  -m10000000 \
  -M500000000 \
  -E3600
```

*   `-mN` (`--max-files`) — максимальный размер одного не-HTML файла в байтах (здесь 10 МБ);
*   `-MN` (`--max-size`) — максимальный общий объём загрузки в байтах (здесь 500 МБ);
*   `-EN` (`--max-time`) — максимальное время зеркалирования в секундах (здесь 1 час);
*   `-cN` (`--sockets`) — число одновременных соединений (по умолчанию 4); `-AN` (`--max-rate`) — ограничение скорости в байтах/с.

### Фильтрация

```bash
httrack https://example.com/ \
  -O /path/to/output \
  "+*.example.com/*" \
  "-*.jpg" \
  "-*.png"
```

Правила фильтрации лучше брать в кавычки, чтобы оболочка не раскрыла `*`.

### Продолжение прерванной загрузки и обновление

```bash
cd /path/to/output
httrack --continue   # продолжить прерванное зеркало по кэшу (-i)
httrack --update     # обновить существующее зеркало
```

Команды запускаются из каталога проекта (или с тем же `-O`), где лежит кэш `hts-cache`.

## Ограничения

*   Не выполняет JavaScript (только пытается найти ссылки в скриптах).
*   Не подходит для SPA-приложений.
*   Запись WARC появилась недавно (2026 год) — проверяйте результат в [ReplayWeb.page](/kb/instruments/replay/replayweb-page) или [pywb](/kb/instruments/replay/pywb).

## Ресурсы

*   [Официальный сайт](https://www.httrack.com/)
*   [Справочник по параметрам (man)](https://www.httrack.com/html/httrack.man.html) и [руководство по командной строке](https://www.httrack.com/html/fcguide.html)
*   [Репозиторий на GitHub](https://github.com/xroche/httrack)
*   [httrack2warc](https://github.com/nla/httrack2warc)

## Связанные материалы

- [Wget для командной строки](/kb/guides/wget)
- [Конвертация в WARC](/kb/instruments/tools/warc-processing)
- [Формат WARC](/kb/instruments/file-formats/warc)
