---
title: PastPage — расширение для восстановления страниц
sidebar_label: PastPage
description: "PastPage — открытое расширение для Chrome и Firefox, которое ищет исчезнувшие или изменённые страницы сразу в нескольких веб-архивах: Wayback Machine, Archive.today, Perma.cc, национальных архивах."
last_update:
  date: 2026-10-12
keywords: [pastpage, browser-extension, archive.today, wayback, link-rot]
---

# PastPage — расширение для восстановления страниц

**PastPage** — открытое браузерное расширение (TypeScript, лицензия MIT, проект 2026 года), которое помогает найти архивную копию исчезнувшей, изменённой или недоступной страницы. Вместо поочерёдной проверки архивов вручную оно опрашивает до 15 веб-архивов и кешей и показывает найденные снимки.

- Исходный код: [github.com/nabertronic/pastpage](https://github.com/nabertronic/pastpage)
- Chrome Web Store: [PastPage: Query 10+ Web Archives at Once](https://chromewebstore.google.com/detail/pastpage-query-10+-web-ar/icpegbecignmplpkjjcegmjmfadpcpoo)
- Firefox Add-ons: [PastPage: Query 10+ Web Archives](https://addons.mozilla.org/en-US/firefox/addon/pastpage-query-10-web-archives/)

Не путать с **PastPages** — проектом Бена Уэлша (Ben Welsh) по архивации главных страниц новостных сайтов ([palewire/pastpages.org](https://github.com/palewire/pastpages.org), репозиторий в архиве с 2021 года).

## Зачем нужно

- **Битые ссылки** — источник из книги, статьи или Википедии больше не открывается.
- **Журналистика и исследования** — проверить, что было на странице до того, как её изменили.
- **Недоступные ресурсы** — страница отдаёт 403, 451 или ошибку сервера, и нужно найти сохранённую копию.

## Возможности

По описанию в README:

- распознаёт, что страница исчезла, сломана или заблокирована: реагирует на ответы `403`, `404`, `410`, `451` и типичные ошибки `5xx`;
- проверяет текущую страницу в один клик: с панели инструментов, из всплывающего окна или контекстного меню (для страницы, ссылки или выделенного URL);
- опрашивает до 15 архивов и кешей и сначала показывает те, что подходят к адресу;
- показывает подтверждённые совпадения, неподтверждённые кандидаты, ошибки провайдеров и ссылки для дальнейшего поиска по мере поступления результатов;
- проверяет исходный и «очищенный» URL: без параметров отслеживания, без фрагмента, с вариантами протокола, `www` и завершающего слеша;
- хранит историю поиска локально: фильтры, сортировка, экспорт в CSV, повторный запуск;
- позволяет выбрать набор архивов и их порядок, таймаут, поведение вкладок и домены-исключения;
- интерфейс на английском, немецком, испанском, французском, итальянском, польском, португальском и украинском.

## Поддерживаемые архивы

Общие:

- Wayback Machine (`archive.org`)
- Archive.today
- Ghostarchive
- Perma.cc
- Megalodon / Web Gyotaku
- WebCite
- Yandex Cache

Региональные и специализированные (предлагаются, когда подходят к адресу):

- Arquivo.pt — для португальских доменов
- UK Government Web Archive — для `gov.uk`
- Library of Congress Web Archives — для `gov`, `mil`, `loc.gov`, `congress.gov`
- Government of Canada Web Archive — для `canada.ca`, `gc.ca`
- Vefsafn (Исландия) — для `.is`
- NTUWAS — для `.tw`
- PADICAT (Каталония) — для `.cat`
- Software Heritage — для адресов репозиториев кода

## Установка

Установите расширение из [Chrome Web Store](https://chromewebstore.google.com/detail/pastpage-query-10+-web-ar/icpegbecignmplpkjjcegmjmfadpcpoo) или [Firefox Add-ons](https://addons.mozilla.org/en-US/firefox/addon/pastpage-query-10-web-archives/). Сборку для разработки можно сделать из репозитория; инструкции для разработчиков — в каталоге [`docs/`](https://github.com/nabertronic/pastpage/tree/main/docs).

## Приватность

По заявлению авторов, расширение не использует трекинг, аналитику и телеметрию. Распознавание сломанных страниц и история поиска хранятся локально в браузере. Адрес страницы отправляется архивам только после того, как пользователь сам запустил поиск. Подробности — в [docs/PRIVACY.md](https://github.com/nabertronic/pastpage/blob/main/docs/PRIVACY.md).

## Сравнение с аналогами

| Расширение | Что делает |
|:---|:---|
| **PastPage** | Поиск сразу в нескольких архивах и кешах, история, экспорт в CSV |
| **[Wayback Machine](https://chromewebstore.google.com/detail/wayback-machine/fpnmgdkabkmnadcjpehmlllkndpkmiak)** (официальное расширение Internet Archive, есть и [для Firefox](https://addons.mozilla.org/en-US/firefox/addon/wayback-machine_new/)) | Поиск и сохранение страниц только в Wayback Machine |
| **[Resurrect Pages](https://addons.mozilla.org/en-US/firefox/addon/resurrect-pages/)** (Firefox) | Открывает страницу в одном из нескольких архивов на выбор |

PastPage только ищет существующие снимки и не создаёт новых. Чтобы сохранить текущую версию страницы, используйте [SavePageNow](/kb/instruments/tools/wayback-api), [Archive.today](/kb/instruments/tools/archive-ph) или [Perma.cc](/kb/similar/perma-cc).

## Когда использовать

✅ Подходит:

- для ручного восстановления отдельных ссылок при чтении, проверке фактов и подготовке публикаций;
- когда страница недоступна и нужно быстро перебрать несколько архивов.

❌ Не подходит:

- для массовой проверки списков URL: используйте [Wayback Machine API](/kb/instruments/tools/wayback-api) или [waybackpy](/kb/instruments/tools/waybackpy);
- для создания архива: используйте [Browsertrix](/kb/instruments/tools/browsertrix), [ArchiveWeb.page](https://archiveweb.page/) или [Wget](/kb/instruments/tools/wget).

## Ресурсы

- [GitHub: nabertronic/pastpage](https://github.com/nabertronic/pastpage) — исходный код и README.
- [Chrome Web Store](https://chromewebstore.google.com/detail/pastpage-query-10+-web-ar/icpegbecignmplpkjjcegmjmfadpcpoo)
- [Firefox Add-ons](https://addons.mozilla.org/en-US/firefox/addon/pastpage-query-10-web-archives/)

## Связанные материалы

- [Wayback Machine API](/kb/instruments/tools/wayback-api) — для скриптов.
- [Waybackpy](/kb/instruments/tools/waybackpy) — для Python.
- [Memento](/kb/instruments/replay/memento) — протокол поиска снимков в нескольких архивах.
- [Internet Archive](/kb/similar/internet-archive) — обзор Wayback Machine.
- [Perma.cc](/kb/similar/perma-cc) — постоянные ссылки для цитирования.
