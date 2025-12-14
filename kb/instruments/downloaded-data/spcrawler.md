---
sidebar_position: 2
---

# spcrawler: CLI

[spcrawler](https://github.com/ruarxive/spcrawler) — это инструмент командной строки для резервного копирования данных сайтов [SharePoint](https://docs.microsoft.com/ru-ru/sharepoint/dev/sp-add-ins/get-to-know-the-sharepoint-rest-service?tabs=csom).
Это все сайты, расширение гиперссылок (URL) которых будет иметь формат `.aspx`.

В качестве примеров рассмотрены URL сайтов Финансового университета (http://www.fa.ru/Pages/Home.aspx) и сайт информационно-аналитической системы регулирования на транспорте (https://asutk.ru/SitePages/home.aspx).

Утилита использует API SharePoint, расположенный по адресу "/_api/web", и создает дамп всех данных и ресурсов.

## Основные возможности:
- Извлечение метаданных.
- Загрузите все файлы (ресурсы) из установки SharePoint.


## Установка

Требуется Python версии 3.6 или выше.

```python
# Make sure we have an up-to-date version of pip and setuptools:
$ pip install --upgrade pip setuptools

$ pip install --upgrade spcrawler

```

Если по какой-либо причине установка pip не удалась, вы можете попробовать `easy_install spcrawler` в качестве запасного варианта.


## Использование

Синтаксис:

`$ spcrawler [команда] [опции]`

См. также `python -m spcrawler` и `spcrawler [command] --help` для справки по каждой команде.


## Команды


### Команда Ping

Выполняет пинг конечной точки API, расположенной по адресу url + "/_api/web", и возвращает OK, если она доступна.

Пинг конечной точки API asutk.ru:

`$ spcrawler ping --url https://asutk.ru`


### Команда Walk

Перечисляет объекты в установке Sharepoint.

Просматривает объекты сайта fa.ru:

`$ spcrawler walk --url http://fa.ru`


### Команда Dump

Выгружает все объекты/ списки/ данные из API в файлы строк в формате JSON. 
Сохраняет все данные в локальный путь "domainname/data".

Дамп данных с fa.ru:

`$ spcrawler dump --url http://fa.ru`



__Документация__: https://github.com/ruarxive/spcrawler