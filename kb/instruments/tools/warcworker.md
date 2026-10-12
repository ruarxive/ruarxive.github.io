---
title: Warcworker
sidebar_label: Warcworker
description: "Warcworker — архивный проект Peter Krantz: очередь заданий на RabbitMQ и веб-интерфейс поверх Squidwarc для архивации отдельных URL в WARC в Docker."
last_update:
  date: 2026-10-12
---

# Warcworker

:::warning Проект в архиве
Репозиторий [peterk/warcworker](https://github.com/peterk/warcworker) переведён в архив, последние изменения — 2024 год. Проект основан на [Squidwarc](/kb/instruments/tools/squidwarc), который не развивается с 2020 года. Для архивации списков URL с выполнением JavaScript сейчас используйте [Browsertrix Crawler](/kb/instruments/tools/browsertrix) (список seed-URL, `--scopeType page`) или [ArchiveWeb.page](https://archiveweb.page/) для ручной записи.
:::

**Warcworker** — веб-архиватор в Docker с очередью заданий. Автор — Peter Krantz, лицензия GPL-3.0, написан на Python (Flask). Состоит из небольшого веб-интерфейса, очереди RabbitMQ и воркеров, которые сохраняют страницы через Squidwarc (headless Chrome) в WARC.

Важно: **Warcworker не кроулер**. Он не обходит сайт сам, а архивирует отдельные URL, которые ему передали (через форму, букмарклет или HTTP-запрос). Списки URL нужно готовить другими средствами. Для каждого задания можно выбрать скрипты Squidwarc, которые выполнятся на странице: прокрутка, загрузка `srcset`-изображений, скриншот и т. п.

Репозиторий `N0taN3rd/warcworker`, на который ссылались ранее, — форк 2018 года, а не основной проект.

## Установка

```bash
git clone https://github.com/peterk/warcworker
cd warcworker
cp .env_example .env      # задать FLASK_KEY, RMQ_USER, RMQ_PASSWORD, ERROR_EMAIL
docker-compose up -d --scale worker=3
```

После запуска (около минуты) веб-интерфейс доступен на `http://0.0.0.0:5555`. WARC-файлы складываются в каталог `./archive`. Готового образа в Docker Hub нет: образы собираются из каталогов `web` и `worker`.

> Команды сверены с README и `docker-compose.yml` репозитория peterk/warcworker (октябрь 2026). Работоспособность на современных системах не проверялась.

## Использование

### Веб-интерфейс

Откройте `http://0.0.0.0:5555`, введите URL и описание. Поля можно заполнить параметрами запроса `url` и `description`. На этом основан букмарклет из README:

```text
javascript:window.open('http://0.0.0.0:5555?url='+encodeURIComponent(location.href) + '&description=' + encodeURIComponent(document.title));window.focus();
```

### Из командной строки

```bash
curl -d "scripts=srcset&scripts=scroll_everything&url=https://example.com/" \
  -X POST http://0.0.0.0:5555/process/
```

Скрипты из каталога `scripts/`: `scroll_everything`, `srcset`, `take_screenshot`, `video_src_load`. Они выполняются в указанном порядке.

### Воспроизведение

Полученные WARC открываются в [ReplayWeb.page](/kb/instruments/replay/replayweb-page) или [pywb](/kb/instruments/replay/pywb). README предлагает Webrecorder Player, но он больше не развивается.

## Сравнение

| Инструмент | Веб-интерфейс | Очередь | Обход сайта | Статус |
| :--- | :---: | :---: | :---: | :--- |
| **Warcworker** | ✅ | ✅ RabbitMQ | ❌ только переданные URL | В архиве |
| **[Squidwarc](/kb/instruments/tools/squidwarc)** | ❌ | ❌ | ✅ | Не развивается с 2020 |
| **[Browsertrix Crawler](/kb/instruments/tools/browsertrix)** | ❌ (есть облачный Browsertrix с интерфейсом) | — | ✅ | Активен |

## Ресурсы

- [GitHub: peterk/warcworker](https://github.com/peterk/warcworker) (архив)
- [GitHub: N0taN3rd/Squidwarc](https://github.com/N0taN3rd/Squidwarc)

## Связанные материалы

- [Squidwarc](/kb/instruments/tools/squidwarc)
- [Browsertrix](/kb/instruments/tools/browsertrix)
- [Динамические и AJAX-сайты](/kb/guides/dynamic-ajax-sites)
