---
title: Scoop
sidebar_label: Scoop
description: "Scoop — одностраничный браузерный захват Harvard Library Innovation Lab: WARC или подписанный WACZ, скриншот и сведения о происхождении снимка."
last_update:
  date: 2026-10-14
keywords: [scoop, wacz, harvard, подпись]
---

# Scoop

**Scoop** — программа Harvard Library Innovation Lab для снимка одной страницы в браузере. Её делали для ссылок в статьях, судебных материалах и проверке фактов: рядом со страницей сохраняются сведения о том, как снимок получен. Репозиторий — [harvard-lil/scoop](https://github.com/harvard-lil/scoop), пакет npm — `@harvard-lil/scoop`. Описание лаборатории: [Scoop Capture Engine](https://lil.law.harvard.edu/our-work/scoop-capture-engine/).

Scoop пишет `.warc`, `.warc.gz` или `.wacz`. Умеет приложить скриншот, PDF, снимок DOM, сертификаты, извлечённое видео и краткую сводку о происхождении снимка. WACZ можно подписать через сервер, совместимый со спецификацией WACZ Signing and Verification (параметр `--signing-url`). Это снимок одного URL, не обход сайта.

## Установка и снимок

По README пакету нужен Node.js. В разделе требований указан Node.js 18+, в подсказке по установке CLI — Node.js 20–23. Перед первым запуском ставят зависимости браузера Playwright.

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

Флаги `-o` / `--output` и `-f` / `--format` (`warc`, `warc-gzipped`, `wacz`, `wacz-with-raw`) взяты из `scoop --help` в README пакета 0.6.59 (страница npm, август 2025). Полный список — `scoop --help`.

Программа рассчитана на Linux, macOS и WSL. Для сложной страницы README называет ориентир от 4 ГБ оперативной памяти.

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
