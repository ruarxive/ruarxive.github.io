---
last_update:
  date: 2026-10-29
title: ВКонтакте
description: "Публичные стены ВКонтакте через VK API: ключ, лимиты с сентября 2026, комментарии, фото и видео."
keywords: [вконтакте, vk, vk-api, wall.get, gallery-dl, yt-dlp]
---

# ВКонтакте

Публичную стену сообщества или страницы сохраняют через [VK API](https://dev.vk.ru/).
Видео забирает [yt-dlp](/kb/instruments/tools/yt-dlp), фотоальбомы —
[gallery-dl](/kb/instruments/tools/gallery-dl), внешний вид страницы —
[Browsertrix](/kb/instruments/tools/browsertrix). Свою переписку и файлы аккаунта
отдаёт официальная выгрузка: [Как сохранить данные из ВКонтакте](/kb/instruments/data-take-out/dto-vk).

Запросы идут на `api.vk.ru`. В каждом вызове нужен параметр `v` — номер версии API.
Страница [«Формат запросов»](https://dev.vk.ru/ru/api/api-requests) приводит примеры
с версией `5.131`. [Список версий](https://dev.vk.ru/ru/reference/versions) на
14 октября 2026 начинается с `5.199`: для неё VK указывает, что состав методов,
параметров и полей ответа не менялся. В скрипте ниже стоит `5.199`.

## Какой способ для какой задачи

| Задача | Способ |
| :--- | :--- |
| Записи на публичной стене | [`wall.get`](https://dev.vk.ru/ru/method/wall.get), сервисный ключ |
| Комментарии к записи | [`wall.getComments`](https://dev.vk.ru/ru/method/wall.getComments) |
| Список альбомов | [`photos.getAlbums`](https://dev.vk.ru/ru/method/photos.getAlbums) |
| Фотографии альбома | [`photos.get`](https://dev.vk.ru/ru/method/photos.get) |
| Файлы фотографий с альбома или одной записи | [gallery-dl](/kb/instruments/tools/gallery-dl) |
| Видео, клип, плейлист, страница видео сообщества | [yt-dlp](/kb/instruments/tools/yt-dlp) |
| Внешний вид страницы | [Browsertrix](/kb/instruments/tools/browsertrix) |
| Свои сообщения, друзья, файлы аккаунта | [выгрузка данных аккаунта](/kb/instruments/data-take-out/dto-vk) |

Короткое имя из адреса (`vk.com/apiclub`) можно передать в `wall.get` параметром
`domain`. Числовой id даёт [`utils.resolveScreenName`](https://dev.vk.ru/ru/method/utils.resolveScreenName):
в ответе поля `type` (`user`, `group`, `event`, `page`) и `object_id`. Для сообщества,
мероприятия и публичной страницы в `owner_id` этот id указывают со знаком минус.
Свободное имя возвращает пустой массив, неизвестное — ошибка 104.

## Лимиты и правила площадки

:::warning Месячный лимит с 7 сентября 2026
В [правилах платформы](https://dev.vk.ru/ru/rules) (редакция от 19.08.2026) для одного
аккаунта в Кабинете для бизнеса VK ID задан лимит вызовов VK API в месяц: 10 000 без
верификации бизнес-профиля и 100 000 000 после верификации. Лимит выше этого порога
запрашивают у devsupport@corp.vk.com.
:::

Частота запросов ([документация](https://dev.vk.ru/ru/api/api-requests)):

| Ключ | Запросов в секунду |
| :--- | :--- |
| Пользователя | 3 |
| Сообщества | 20 |
| Сервисный | 5 при числе пользователей приложения до 10 000; дальше 20, 40, 50 и 60 |

При превышении API возвращает ошибку 6 «Too many requests per second». Точные
количественные лимиты на однотипные методы VK не публикует: при превышении метод
может временно закрыться (ошибка 9) или запросить капчу (ошибка 14). Ошибка 29 —
достигнут количественный лимит метода.

В [roadmap за июнь 2017](https://dev.vk.ru/ru/reference/roadmap) для `wall.get` указано
5 000 вызовов в сутки. Страница метода эту цифру не повторяет; если суточный лимит
ещё действует, его видно по ошибке 29. На стену в десятки тысяч записей уходит меньше
тысячи вызовов `wall.get` (по 100 записей за раз). Комментарии расходуют лимит быстрее:
отдельный вызов на каждую сотню комментариев каждой записи.

Те же правила платформы относят к приложениям два ограничения на данные:

- пункт 1.6 запрещает приложению скачивание аудио, видео, изображений и документов
  с серверов VK вне функций самой соцсети, чтобы раздавать их офлайн или собирать
  из них отдельное хранилище;
- пункт 2.4 запрещает использовать данные `newsfeed.search`, `wall.get` и `wall.search`,
  включая id пользователей, для передачи, перепродажи, аналитических отчётов и скоринга
  без прямого согласия ООО «ВК».

Как к правилам площадки относится архивация, разобрано в
[условиях использования сервисов](/kb/legal/terms-of-service).

## Ключ доступа

Метод вызывается с ключом. Тип ключа написан в шапке страницы метода.

1. Зарегистрируйте приложение формой [dev.vk.ru/ru/admin/create-app](https://dev.vk.ru/ru/admin/create-app).
   Standalone-приложения и сайты VK создаёт через VK ID: раздел «Переход на VK ID»
   в [roadmap](https://dev.vk.ru/ru/reference/roadmap).
2. Сервисный ключ, по той же странице roadmap: «Мои приложения»
   ([vk.com/apps?act=manage](https://vk.com/apps?act=manage)) → «Редактировать» →
   «Настройки» → значок глаза у строки «Сервисный ключ доступа». Срок ключа не ограничен.
   Обновление ключа аннулирует предыдущий. Ключ хранят на сервере: в клиентский код
   и в репозиторий его передавать нельзя.
3. Для публичной стены, комментариев к ней и альбомов достаточно сервисного ключа:
   так указано у `wall.get`, `wall.getComments`, `photos.get` и `photos.getAlbums`.
4. Закрытое сообщество открывается ключом участника, у которого есть доступ.
   Сбор из закрытых групп — только с согласия участников, см.
   [условия использования сервисов](/kb/legal/terms-of-service).

[`video.get`](https://dev.vk.ru/ru/method/video.get) и [`docs.get`](https://dev.vk.ru/ru/method/docs.get)
вызываются ключом пользователя. Право `video` или `docs` VK выдаёт отдельным запросом
на devsupport@corp.vk.com. Файл ролика сохраняет yt-dlp. Документ, приложенный к записи,
остаётся объектом во вложениях `wall.get`. Публичные методы секции `audio` отключены
с 16 декабря 2016 года (roadmap), кроме методов загрузки.

Ключ передают заголовком `Authorization: Bearer`. Запросы без ключа сервер отклоняет.

## Записи со стены

`wall.get` возвращает объект с полями `count` и `items`. У записи, среди прочего, есть
`id`, `owner_id`, `from_id`, `date` (unix-время), `text`, `attachments`, `comments.count`,
`is_pinned` и, у репоста, `copy_history`. Полный список полей —
[объект «Запись на стене»](https://dev.vk.ru/ru/reference/objects/post). Текст комментариев
в запись не входит.

Параметр `filter`: `owner` — записи владельца стены, `others` — чужие, `all` — те и другие
(значение по умолчанию). `suggests` и `postponed` доступны только с ключом пользователя.
`donut` — записи для платных подписчиков. За один вызов приходит не больше 100 записей.

Скрипт ниже пишет стену в JSONL: одна запись JSON на строку. Так файл можно дополнять
и читать по частям. Ключ берётся из переменной окружения. Повторы одного `id` отбрасываются:
закреплённая запись приходит и в начале ленты, и на своём месте, а новые посты во время
выгрузки сдвигают `offset`, потому что лента идёт от новых к старым. Пауза 0,4 с держит
скорость ниже 3 запросов в секунду — это потолок ключа пользователя и запас для сервисного
ключа приложения с небольшой аудиторией.

```python
import json
import os
import time

import requests

TOKEN = os.environ["VK_SERVICE_TOKEN"]
OWNER_ID = -123456  # у сообщества id со знаком минус
API_VERSION = "5.199"
PAGE = 100


def call_api(method, **params):
    for attempt in range(5):
        response = requests.get(
            f"https://api.vk.ru/method/{method}",
            params={**params, "v": API_VERSION},
            headers={"Authorization": f"Bearer {TOKEN}"},
            timeout=30,
        )
        response.raise_for_status()
        payload = response.json()
        error = payload.get("error")
        if not error:
            return payload["response"]
        if error.get("error_code") == 6 and attempt < 4:
            time.sleep(1 + attempt)
            continue
        raise RuntimeError(error)
    raise RuntimeError("слишком много запросов в секунду")


def iter_wall(owner_id):
    seen = set()
    offset = 0
    while True:
        page = call_api(
            "wall.get",
            owner_id=owner_id,
            offset=offset,
            count=PAGE,
            filter="all",
        )
        items = page.get("items") or []
        if not items:
            break
        for post in items:
            if post["id"] in seen:
                continue
            seen.add(post["id"])
            yield post
        offset += len(items)
        print(f"{offset} / {page.get('count')}", flush=True)
        if offset >= page.get("count", 0):
            break
        time.sleep(0.4)


def main():
    with open("vk_wall.jsonl", "w", encoding="utf-8") as outfile:
        for post in iter_wall(OWNER_ID):
            outfile.write(json.dumps(post, ensure_ascii=False) + "\n")


if __name__ == "__main__":
    main()
```

Вложения остаются объектами внутри JSON. У вложения есть поле `type` (`photo`, `video`,
`doc`, `link` и другие) и объект с тем же именем. Адреса копий фотографии лежат в массиве
`sizes`: поля `url`, `width`, `height`, `type`. Самый крупный пропорциональный тип в
[описании размеров](https://dev.vk.ru/ru/reference/objects/photo-sizes) — `w`.

Повторный сбор той же стены удобно начинать с новых записей и останавливать на первом `id`,
который уже есть в файле.

Частые ошибки: 5 — ключ не принят, 15 — доступ запрещён, 18 — страница удалена или
заблокирована, 30 — профиль закрыт.

## Комментарии

`wall.getComments` с сервисным ключом возвращает комментарии к записи. Ключ пользователя
для этого метода требует право `wall`, которое VK выдаёт отдельно через поддержку.

За вызов приходит не больше 100 комментариев (`count`, по умолчанию 10). `preview_length=0`
оставляет текст целиком. Порядок: `sort=asc` от старых к новым, `desc` наоборот. Вложенные
ответы лежат в поле `thread`; сколько их отдать, задаёт `thread_items_count`. Ветку одного
комментария запрашивают параметром `comment_id`. Имена авторов в том же ответе появляются
при `extended=1` — это уже персональные данные, см. раздел ниже.

```python
call_api(
    "wall.getComments",
    owner_id=OWNER_ID,
    post_id=post_id,
    count=100,
    preview_length=0,
    sort="asc",
)
```

## Фотографии

`photos.getAlbums` с сервисным ключом возвращает альбомы. `need_system=1` добавляет
системные альбомы с отрицательными id, в том числе пустые. `photos.get` читает один альбом:
служебные значения `album_id` — `wall` (фото со стены) и `profile` (фото профиля).
Альбом `saved` метод отдаёт только с ключом пользователя. `photo_sizes=1` возвращает массив
`sizes`. Страница метода максимум для `count` не указывает: альбом читают страницами через
`offset`, пока число полученных фотографий не догонит `count` из ответа. Чужой закрытый
альбом даёт ошибку 200.

[gallery-dl](/kb/instruments/tools/gallery-dl) скачивает сами файлы. Экстрактор VK
(сверен с `gallery_dl/extractor/vk.py` в октябре 2026) понимает такие адреса на `vk.com`
и `vk.ru`:

```bash
# альбом
gallery-dl --write-metadata --download-archive vk-photos.sqlite3 \
  "https://vk.com/album12345_00"

# все фотографии страницы: id, photos, albums или короткое имя
gallery-dl --write-metadata "https://vk.com/photos-12345"

# фотографии одной записи на стене
gallery-dl --write-metadata "https://vk.com/wall12345_123"
```

По адресу сообщества и по короткому имени экстрактор сохраняет фотографии страницы.
Фотографии отдельной записи берут по ссылке вида `wallOWNER_POST`. Закрытый альбом
открывается cookie вашей сессии (`--cookies-from-browser` или `--cookies`).
Продолжить прерванную загрузку можно параметром экстрактора `offset`
(`-o offset=N`): при остановке gallery-dl печатает текущее значение. Между запросами
экстрактор сам ждёт 0,5–1,5 с. Он ходит во внутренний интерфейс сайта, поэтому после
смены вёрстки VK может сломаться раньше, чем `photos.get`.

## Видео

Ролик, клип, плейлист и страницу видео сообщества скачивает yt-dlp. Шаблоны адресов
сверены с экстрактором `vk.py` в репозитории yt-dlp (октябрь 2026). Флаги совпадают
с разделом [yt-dlp](/kb/instruments/tools/yt-dlp) (версия 2026.08.19).

```bash
yt-dlp --write-info-json --write-thumbnail \
  --download-archive vk-video.txt \
  -o "%(uploader)s/%(title)s [%(id)s].%(ext)s" \
  "https://vkvideo.ru/video-OWNER_VIDEO"

# плейлист и страница видео сообщества
yt-dlp --download-archive vk-video.txt \
  "https://vk.com/video/playlist/OWNER_PLAYLIST"
yt-dlp "https://vk.com/video/@screen_name"
```

Те же ролики открываются как `vk.com/video…` и `vk.ru/video…`. Клип в адресе вида
`vk.com/clip…` экстрактор тоже принимает. Ролик «только для зарегистрированных» и
ролик с возрастным ограничением запрашивают с cookie вашего аккаунта:
`--cookies-from-browser firefox` или `--cookies cookies.txt`.

В ответе `video.get` есть карточка ролика и адрес плеера. Файл сохраняет yt-dlp.

## Внешний вид страницы

[Browsertrix](/kb/instruments/tools/browsertrix) сохраняет страницу в WARC/WACZ вместе
с тем, что нарисовал браузер. Так остаётся вид ленты: карточки, кнопки и вёрстка.

Сохранение HTML через Wget для VK — крайняя мера: разметку собирают скрипты, и в файл
часто попадает оболочка без записей.

## Практика Ruarxive

В марте 2022 года волонтёр выгрузил через API сообщество «Эха Москвы»: только тексты,
более 99 тысяч записей ([#6](https://t.me/ruarxive/6)). Файл `echomsk_vk_20220303.zip`
([скачать](https://cdn.ruarxive.org/public/webcollect2022/echomskru2022/echomskru_vk/echomsk_vk_20220303.zip))
весит 138 044 916 байт, дата файла — 3 марта 2022 года. Подробности —
в описании [проекта «Эхо Москвы»](/kb/projects/echomsk).

Отдельного инструмента Ruarxive для ВКонтакте нет. В списке планов 2022 года архивация
аккаунтов VK названа среди задач, статус которых стоит уточнять:
[Задачи для волонтёров](/kb/volunteers/volunteers-tasks).

## Персональные данные и авторское право

Имя, фотография, комментарий и числовой id, по которому человека можно определить, —
персональные данные. Открытая страница сама по себе не даёт согласия на сбор, хранение
и новую публикацию. Подробнее — [персональные данные](/kb/legal/personal-data)
и [авторское право](/kb/legal/copyright).

Параметр `extended=1` у `wall.get` и `wall.getComments` добавляет в ответ объекты
`profiles` и `groups` с именами. Для архива текстов записей он не обязателен.

## Связанные материалы

- [Как сохранить данные из ВКонтакте](/kb/instruments/data-take-out/dto-vk) — архив своего аккаунта
- [Архивация социальных сетей](/kb/instruments/social-media) — обзор площадок
- [Методика архивации соцсетей](/kb/instruments/social-media/methodology) — паспорт сбора, темп, хранение
- [yt-dlp](/kb/instruments/tools/yt-dlp) — видео
- [gallery-dl](/kb/instruments/tools/gallery-dl) — фотографии
- [Browsertrix](/kb/instruments/tools/browsertrix) — копия страницы в WARC/WACZ
- [Проект «Эхо Москвы»](/kb/projects/echomsk) — выгрузка сообщества 2022 года
