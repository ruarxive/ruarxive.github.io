---
title: Squidwarc
sidebar_label: Squidwarc
description: "Squidwarc — скриптуемый архивный кроулер на Node.js, который записывает WARC через Chrome/Chromium. Проект не развивается с 2020 года."
last_update:
  date: 2026-10-12
---

# Squidwarc

:::warning Проект не развивается
Последние изменения в репозитории [N0taN3rd/Squidwarc](https://github.com/N0taN3rd/Squidwarc) — май 2020 года. Зависимости устарели (Puppeteer 1.x), на современных Node.js и Chrome проект может не запуститься. Для браузерной архивации сейчас используйте [Browsertrix Crawler](/kb/instruments/tools/browsertrix) или [Brozzler](/kb/instruments/tools/brozzler).
:::

**Squidwarc** — архивный кроулер с высокой точностью воспроизведения, который управляет Chrome или Chromium (с интерфейсом или без) и записывает WARC. Автор — John Berlin (N0taN3rd), исследовательская группа Web Science and Digital Libraries (WS-DL) Университета Олд-Доминион. Лицензия Apache-2.0.

Проект задумывался как простой в установке инструмент для личного архивиста, который выполняет JavaScript, в отличие от Heritrix. Построен на Node.js, [node-warc](https://github.com/N0taN3rd/node-warc), Puppeteer и chrome-remote-interface.

## Как устроен

Squidwarc — автоматический кроулер. Он не предоставляет «ручного» режима управления браузером. Обход настраивается JSON-файлом, а дополнительные действия на странице (прокрутка, раскрытие элементов) выполняет пользовательский скрипт (`userFns.js`), который запускается на каждой странице.

Готовые режимы обхода (`mode`):

- `page-only` — только сама страница, ссылки не обходятся;
- `page-same-domain` — страница и ссылки с неё на тот же домен;
- `page-all-links` — страница и все ссылки с неё, включая внешние.

## Установка

npm-пакета нет: Squidwarc ставится из исходников с помощью скрипта `bootstrap.sh`.

```bash
git clone https://github.com/N0taN3rd/Squidwarc
cd Squidwarc
./bootstrap.sh
```

В репозитории есть также `Dockerfile` и `docker-compose.yml`.

> Команды сверены с README репозитория N0taN3rd/Squidwarc (версия 1.2.0 в `package.json`, октябрь 2026). Работоспособность на современных системах не проверялась.

## Использование

Запуск обхода по конфигурации:

```bash
./run-crawler.sh -c conf.json
# или
node index.js -c conf.json
```

Пример `conf.json` (из репозитория):

```json
{
  "use": "puppeteer",
  "headless": true,
  "script": "./userFns.js",
  "mode": "page-only",
  "depth": 1,
  "seeds": [
    "https://example.com/"
  ],
  "warc": {
    "naming": "url"
  },
  "connect": {
    "launch": true,
    "host": "localhost",
    "port": 9222
  },
  "crawlControl": {
    "globalWait": 60000,
    "inflightIdle": 1000,
    "numInflight": 2,
    "navWait": 8000
  }
}
```

- `seeds` — стартовые URL, `depth` — глубина обхода.
- `connect` — запускать ли Chrome самому (`launch`) или подключиться к уже запущенному с `--remote-debugging-port`.
- `crawlControl` — таймауты в миллисекундах: максимальное время на страницу, ожидание «тишины» в сети, ожидание навигации.
- `warc.append` — писать всё в один WARC или отдельный WARC на страницу.

Полное описание полей — в [руководстве](https://n0tan3rd.github.io/Squidwarc/).

## Сравнение с другими инструментами

| Инструмент | Браузер | Статус | Когда использовать |
| :--- | :--- | :--- | :--- |
| **Squidwarc** | Chrome через Puppeteer / CDP | Не развивается с 2020 | Только для изучения или воспроизведения старых конвейеров |
| **[Browsertrix Crawler](/kb/instruments/tools/browsertrix)** | Chromium (Docker) | Активен | Большинство задач с JavaScript, WACZ |
| **[Brozzler](/kb/instruments/tools/brozzler)** | Chromium + warcprox | Активен | Распределённый обход (состояние в RethinkDB) |
| **[Warcworker](/kb/instruments/tools/warcworker)** | Squidwarc в Docker | В архиве | Очередь отдельных URL через веб-интерфейс |

## Ресурсы

- [GitHub: N0taN3rd/Squidwarc](https://github.com/N0taN3rd/Squidwarc)
- [Руководство (manual)](https://n0tan3rd.github.io/Squidwarc/)

## Связанные материалы

- [Browsertrix](/kb/instruments/tools/browsertrix)
- [Warcworker](/kb/instruments/tools/warcworker) — веб-интерфейс и очередь поверх Squidwarc
- [Динамические и AJAX-сайты](/kb/guides/dynamic-ajax-sites)
- [Формат WARC](/kb/instruments/file-formats/warc)
