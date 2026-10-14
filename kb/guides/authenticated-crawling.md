---
title: Архивация страниц, которые видны после входа
sidebar_label: Вход на сайт
description: "Как сохранить страницы, доступные вашей собственной учётной записи: профиль Browsertrix и cookies Wget. Чужие сессии и обход входа не используются."
last_update:
  date: 2026-10-14
keywords: [browsertrix, cookies, wget, авторизация]
---

# Архивация страниц, которые видны после входа

Часть сайтов показывает материалы только после входа: закрытый раздел, личный кабинет, лента, которую сервер не отдаёт анонимному краулеру. Сохранять имеет смысл то, что ваша учётная запись и так вправе открыть.

Чужие пароли, украденные cookie и обход страницы входа не используются. Это то же правило, что в [условиях использования сервисов](/kb/legal/terms-of-service).

## Что выбрать

| Ситуация | Инструмент |
|---|---|
| Страница собирается в браузере, есть JavaScript | [Browsertrix](/kb/instruments/tools/browsertrix), профиль после вашего входа |
| Сервер отдаёт HTML и принимает cookie в запросе | [Wget](/kb/instruments/tools/wget) с файлом cookies вашей сессии |
| Нужны тексты WordPress, а REST API закрыт | wparc без авторизации их не получит; см. [гайд по WordPress](/kb/instruments/howto-collect/make-copy-site-wordpress) |
| Сайт и так публичный | Вход не нужен: [стратегии сбора](/kb/guides/collection-strategies) |

Heritrix умеет передавать HTTP-учётные данные в конфигурации задания. Готовый фрагмент конфигурации здесь не приводится: его надо брать из руководства к той версии Heritrix, которой вы пользуетесь, и проверять на тестовом обходе. Для страницы, которая без браузера пустая, Heritrix не заменяет Browsertrix.

## Browsertrix: профиль своего входа

Профиль создаётся интерактивно. Команды те же, что на странице [Browsertrix](/kb/instruments/tools/browsertrix):

```bash
docker run -p 6080:6080 -p 9223:9223 -v $PWD/crawls/profiles:/crawls/profiles/ \
    -it webrecorder/browsertrix-crawler create-login-profile --url "https://example.com/"
```

Откройте `http://localhost:9223/`, войдите в свой аккаунт и сохраните профиль. Затем укажите его при обходе:

```bash
docker run --rm -v $PWD/crawls:/crawls/ \
    webrecorder/browsertrix-crawler crawl \
    --url https://example.com/private/ \
    --profile /crawls/profiles/profile.tar.gz \
    --generateWACZ \
    --collection private-site
```

В профиль попадают сессионные cookie, не пароль. WACZ, снятый под учётной записью, может содержать персональные данные этой учётной записи и чужие сообщения, которые ей видны. Перед публикацией архив нужно просмотреть. Закрытые переписки других людей в архив не кладут.

## Wget: cookies своей сессии

Wget не открывает форму входа. Он подставляет cookie, которые вы сами выгрузили из браузера, где уже вошли в аккаунт. Формат файла — Netscape. Флаги описаны на странице [Wget](/kb/instruments/tools/wget):

```bash
wget --mirror --warc-file=site --no-warc-compression \
  --load-cookies=cookies.txt \
  --wait=1 --random-wait \
  --limit-rate=200k \
  https://example.com/members/
```

Файл `cookies.txt` — это доступ к аккаунту. Его не коммитят в git и не прикладывают к WARC, который уходит в открытое хранилище. Флаг `--save-cookies` записывает cookie, которые сервер прислал во время обхода; этот файл тоже остаётся локальным.

Wget не выполняет JavaScript. Если после входа страница пустая без браузера, cookies ситуацию не исправят.

## Перед публикацией

- Уберите из архива то, что не собирались сохранять: личные сообщения, адреса, закрытые документы.
- Не публикуйте каталог профиля браузера и файл cookies.
- В описании сбора укажите, что обход шёл от имени учётной записи с доступом к закрытому разделу, без подробностей самой учётной записи.
- Если на страницах есть персональные данные других людей, смотрите [персональные данные](/kb/legal/personal-data).

## Связанные материалы

- [Browsertrix](/kb/instruments/tools/browsertrix)
- [Wget](/kb/instruments/tools/wget) и [гайд «сайт в WARC»](/kb/guides/wget)
- [Условия использования сервисов](/kb/legal/terms-of-service)
- [Граница с антибот-защитой](/kb/guides/anti-bot-and-archiving)
