---
title: InterPlanetary Wayback (ipwb)
sidebar_label: IPWB
description: "InterPlanetary Wayback (ipwb) — индексация WARC в IPFS и воспроизведение веб-архивов из IPFS с поддержкой Memento. Установка, команды ipwb index и ipwb replay, Docker."
last_update:
  date: 2026-10-12
---

# InterPlanetary Wayback (ipwb)

**InterPlanetary Wayback (ipwb)** — инструмент лаборатории ODU WS-DL, который раскладывает содержимое WARC-файлов по сети IPFS и воспроизводит архив из IPFS.

## Описание

[IPFS](https://ipfs.tech/) — одноранговая файловая система с адресацией по содержимому: одинаковые данные получают одинаковый адрес, а копии может хранить любой узел. ipwb отделяет HTTP-заголовки и тело каждой записи `response`, загружает их в IPFS, а затем строит CDXJ-индекс со ссылками на IPFS-хеши. При воспроизведении заголовки и тело собираются обратно.

### Особенности

*   **Хранение в IPFS**: дедупликация на уровне IPFS и добровольное реплицирование копий.
*   **Индекс CDXJ** со ссылками на IPFS-хеши; индекс можно передать как файл, по HTTP или по IPFS-хешу.
*   **Replay с Service Worker**: ссылки переписываются на стороне клиента (библиотека Reconstructive), что уменьшает «утечки» на живой сайт.
*   **Memento**: в replay есть TimeMap и заголовки `Link`.
*   **Шифрование и сжатие** содержимого перед загрузкой в IPFS (`ipwb index -e`, `-c`).

## Установка

### Требования

*   Python 3.9+.
*   Работающий демон IPFS — реализация [kubo](https://github.com/ipfs/kubo) (раньше называлась go-ipfs).

### Установка IPFS (kubo)

Скачайте kubo из [релизов на GitHub](https://github.com/ipfs/kubo/releases) или по [инструкции по установке](https://docs.ipfs.tech/install/command-line/), затем:

```bash
ipfs init
ipfs daemon
```

Если порт API 5001 занят, перед запуском демона его можно сменить:

```bash
ipfs config Addresses.API /ip4/127.0.0.1/tcp/5002
```

### Установка ipwb

```bash
pip install ipwb
```

### Через Docker

Готовый образ запускает демон IPFS, индексирует пример и открывает replay:

```bash
docker container run -it --rm -p 2016:2016 oduwsdl/ipwb
```

> Команды сверены с README ipwb (последняя версия на PyPI — 0.2024.10.24.1853, октябрь 2026).

## Использование

### Индексация WARC-файла

`ipwb index` загружает содержимое в IPFS и пишет CDXJ-индекс в стандартный вывод — его нужно сохранить в файл:

```bash
ipwb index /path/to/archive.warc.gz > archive.cdxj
# или
ipwb index -o archive.cdxj /path/to/archive.warc.gz
```

### Запуск replay

`ipwb replay` принимает путь к индексу (файл, HTTP-адрес или IPFS-хеш):

```bash
ipwb replay archive.cdxj
```

Интерфейс открывается по адресу `http://localhost:2016/`.

### Работа за обратным прокси

Service Worker в браузерах работает только по HTTPS (исключение — `localhost`). Чтобы опубликовать replay под своим доменом, поставьте перед ipwb прокси с HTTPS (например, Caddy или Traefik) и передайте его адрес флагом `--proxy`:

```bash
ipwb replay --proxy=https://ipwb.example.com archive.cdxj
```

### Docker со своими данными

```bash
docker container run -it --rm -v /path/to/data:/data oduwsdl/ipwb \
  ipwb index -o /data/cdxj/custom.cdxj /data/warc/custom.warc.gz
docker container run -it --rm -v /path/to/data:/data -p 2016:2016 oduwsdl/ipwb \
  ipwb replay /data/cdxj/custom.cdxj
```

## Распределённый доступ

После индексации данные доступны другим узлам IPFS, пока хотя бы один узел их хранит. Чтобы данные не удалились сборщиком мусора, важные архивы закрепляют (`ipfs pin`). Сам по себе IPFS не гарантирует долговременного хранения: копии нужно поддерживать.

## Сравнение с другими инструментами

| Инструмент | Хранение | Memento | Сложность | Когда выбирать |
| :--- | :--- | :--- | :--- | :--- |
| **ipwb** | IPFS | ✅ | выше средней | P2P-распространение архива |
| **pywb** | локальный диск / HTTP | ✅ | средняя | Централизованный публичный архив |
| **ReplayWeb.page** | файл / HTTP | ❌ | низкая | Локальный просмотр, публикация WACZ |

### Когда использовать ipwb

*   Нужно распространять архив через IPFS и дать возможность другим узлам хранить копии.
*   Эксперименты с децентрализованным хранением веб-архивов.

### Когда использовать другие инструменты

*   Централизованное хранение и публичный доступ — [pywb](/kb/instruments/replay/pywb).
*   Локальный просмотр — [ReplayWeb.page](/kb/instruments/replay/replayweb-page) (умеет загружать файлы и по `ipfs://`).

## Ограничения

*   Нужен работающий демон IPFS.
*   Индексируются WARC-файлы; WACZ и ARC на вход не принимаются.
*   Встроенный replay в README назван «rudimentary» — базовым; один запуск обслуживает один индекс.
*   Доступность данных зависит от того, кто их хранит в IPFS.

## Ресурсы

*   [GitHub-репозиторий](https://github.com/oduwsdl/ipwb)
*   [Статья TPDL 2016 о проекте (PDF)](https://matkelly.com/papers/2016_tpdl_ipwb.pdf)
*   [Документация IPFS](https://docs.ipfs.tech/)

## Связанные материалы

- [pywb для централизованных архивов](/kb/instruments/replay/pywb)
- [Memento](/kb/instruments/replay/memento)
- [Формат WARC](/kb/instruments/file-formats/warc)
