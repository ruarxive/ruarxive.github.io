---
title: Scoop
sidebar_label: Scoop
description: "Scoop — одностраничный браузерный захват Harvard Library Innovation Lab: WARC или подписанный WACZ, скриншот и сведения о происхождении снимка."
last_update:
  date: 2026-10-28
keywords: [scoop, wacz, harvard, подпись]
---

# Scoop

**Scoop** — программа Harvard Library Innovation Lab для снимка одной страницы в браузере. Её делали для ссылок в статьях, судебных материалах и проверке фактов: рядом со страницей сохраняются сведения о том, как снимок получен. Репозиторий — [harvard-lil/scoop](https://github.com/harvard-lil/scoop), пакет npm — `@harvard-lil/scoop`. Описание лаборатории: [Scoop Capture Engine](https://lil.law.harvard.edu/our-work/scoop-capture-engine/).

Scoop пишет `.warc`, `.warc.gz` или `.wacz`. Умеет приложить скриншот, PDF, снимок DOM, сертификаты, извлечённое видео и краткую сводку о происхождении снимка. WACZ можно подписать через сервер, совместимый со спецификацией WACZ Signing and Verification (параметр `--signing-url`). Это снимок одного URL, не обход сайта.

## Установка и снимок

С версии 0.7.0 (сентябрь 2026) нужен Node.js 22 или новее; до этого поддерживались версии 20–23. Перед первым запуском ставят зависимости браузера Playwright.

```bash
npm install -g @harvard-lil/scoop
sudo npx playwright install-deps chromium

scoop "https://example.com/"
```

По умолчанию результат — `./archive.wacz` в текущем каталоге. Другой путь и формат WARC:

```bash
scoop "https://example.com/" -o my-collection/page.wacz
scoop "https://example.com/" -f warc -o my-collection/page.warc
```

Флаги `-o` / `--output` и `-f` / `--format` (`warc`, `warc-gzipped`, `wacz`, `wacz-with-raw`) сверены с `scoop --help` в README версии 0.7.0 (октябрь 2026). Полный список — `scoop --help`.

Программа рассчитана на Linux, macOS и WSL. Для сложной страницы README называет ориентир от 4 ГБ оперативной памяти.

### Запуск в контейнере

С версии 0.7.0 песочница Chromium включена по умолчанию (`--chromium-sandbox true`). Если хост её не поддерживает, браузер не запускается, и Scoop не повторяет попытку без песочницы. Типичный случай — запуск от root в контейнере без пространств имён пользователей. По README лучше запускать Scoop в контейнере от обычного пользователя с совместимым профилем seccomp ([рекомендации Playwright для Docker](https://playwright.dev/docs/docker#crawling-and-scraping)). Если это невозможно, песочницу отключают явно:

```bash
scoop "https://example.com/" --chromium-sandbox false
```

Отключение песочницы снижает защиту хоста от вредоносных страниц. Используйте его только в изолированном окружении.

Ещё одно изменение 0.7.0: список блокировки адресов теперь применяется ко всему трафику снимка, включая редиректы и вспомогательные программы curl и yt-dlp. Запрос к заблокированному адресу любым из этих путей завершается ошибкой.

## Когда брать Scoop, а когда Browsertrix

| | Scoop | Browsertrix |
|---|---|---|
| Сколько страниц | Одна | Список или сайт |
| Зачем | Фиксация адреса со сводкой и подписью WACZ | Коллекция в WACZ |
| Обход ссылок | Нет | Да |

Открывается файл там же, где и другой WACZ: [ReplayWeb.page](/kb/instruments/replay/replayweb-page).

## Связанные материалы

- [Формат WACZ](/kb/instruments/file-formats/wacz)
- [Browsertrix](/kb/instruments/tools/browsertrix)
- [Ландшафт веб-архивации, 2026](/kb/instruments/landscape-2026)
- [README Scoop](https://github.com/harvard-lil/scoop)
