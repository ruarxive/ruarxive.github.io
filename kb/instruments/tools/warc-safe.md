---
title: WARC-Safe — антивирусная и NSFW-проверка архивов
sidebar_label: WARC-Safe
description: "WARC-Safe — открытый инструмент Национальной библиотеки Люксембурга для поиска вирусов (ClamAV) и NSFW-изображений в ARC/WARC-файлах: проверка из командной строки и REST-сервер."
last_update:
  date: 2026-10-12
keywords: [warc-safe, antivirus, nsfw, virus, scanner, archive, bnl, luxembourg]
---

# WARC-Safe — антивирусная и NSFW-проверка архивов

[WARC-Safe](https://github.com/natliblux/warc-safe) — программа на Python, которая проверяет ARC/WARC-файлы на **вирусы** (через демон ClamAV `clamd`) и на **NSFW-контент** (насилие и обнажённость на изображениях, через ML-классификатор). Разработана в Национальной библиотеке Люксембурга (Bibliothèque nationale de Luxembourg, BnL; авторы — Yves Maurer и László Tóth), лицензия GPL-3.0, репозиторий создан в 2024 году.

Доклад Л. Тота о WARC-Safe хранится в [UNT Digital Library](https://digital.library.unt.edu/ark:/67531/metadc2472470/): там лежат материалы конференций IIPC. University of North Texas к разработке отношения не имеет.

## Зачем нужен

Массовая веб-архивация собирает всё подряд, в том числе вредоносные файлы со взломанных сайтов и изображения, которые нельзя показывать без предупреждения. Перед публикацией коллекции (через [pywb](/kb/instruments/replay/pywb), [SolrWayback](/kb/instruments/tools/solrwayback) или выкладкой WARC) полезно знать, какие записи стоит проверить вручную.

Что умеет WARC-Safe:

- проверяет записи WARC антивирусом ClamAV;
- оценивает изображения (TIFF, JPEG, PNG, SVG, WEBP) NSFW-классификатором и выдаёт `nsfw_score` от 0 до 1;
- работает со сжатыми и несжатыми файлами;
- проверяет одну запись по смещению;
- в режиме сервера отдаёт результаты в JSON по REST API;
- с июня 2026 года совместим с функцией обогащения полей Solr в [netarchivesuite/warc-indexer](https://github.com/netarchivesuite/warc-indexer): данные о вирусах и NSFW можно добавить в Solr-индекс при индексации.

## Установка

Нужен Python 3.9+. Пакета на PyPI нет: проект ставится из репозитория.

```bash
git clone https://github.com/natliblux/warc-safe
cd warc-safe
pip install -r requirements.txt
```

NSFW-классификатор — пакет `NSFWDetection` из `requirements.txt`. При первом запуске модель скачивается в домашний каталог пользователя.

Для антивирусной проверки нужен демон ClamAV. В Ubuntu (по README):

```bash
apt-get install clamav clamav-daemon -y

# первая настройка: остановить обновлятор, скачать базы, запустить снова
systemctl stop clamav-freshclam
freshclam
systemctl start clamav-freshclam
```

Базы сигнатур время от времени обновляют командой `freshclam`.

> Команды сверены с README и `app.py` репозитория natliblux/warc-safe (октябрь 2026).

## Использование

### Проверка из командной строки

```bash
# антивирусная проверка
python app.py --test-av /path/to/archive.warc.gz

# NSFW-проверка
python app.py --test-nsfw /path/to/archive.warc.gz

# только одна запись, начиная со смещения
python app.py --test-nsfw /path/to/archive.warc.gz --offset 12345
```

Результат выводится таблицей в терминал.

### Режим сервера

```bash
python app.py --host 127.0.0.1 --server 8123
```

По умолчанию сервер слушает `0.0.0.0`. Если запускаете его не в изолированной сети, явно укажите `--host 127.0.0.1`. Эндпоинты (все — POST, параметр `file_path` — абсолютный путь к WARC, доступному серверу через файловую систему):

- `test_nsfw` — только NSFW;
- `test_antivirus` — только вирусы;
- `test_all` — обе проверки.

```bash
curl -X POST -H "Content-Type: application/json" \
  -d '{"file_path": "/data/warcs/archive.warc.gz"}' \
  localhost:8123/test_all
```

Для проверки одной записи в JSON добавляется поле `offset`.

### Формат ответа

Корневой элемент — `results`, ключи — `WARC-Record-ID` записей:

```json
{
  "results": {
    "<urn:uuid:ec2aa5f2-391e-530a-a9ed-b44f944fdcb9>": {
      "av_details": null,
      "is_virus": false,
      "filename": "picture.jpg",
      "mime": "image/jpeg",
      "is_nsfw": true,
      "nsfw_score": 0.7569
    }
  }
}
```

Поля записи: `filename`, `mime`, `av_details`, `is_virus`, `is_nsfw`, `nsfw_score`, при ошибке — `err`. При запросе с `offset` возвращается один объект; если запись не изображение и ClamAV её тип не поддерживает, ответ будет `{}`.

## Точность

Авторы предупреждают, что классификатор даёт ложные срабатывания (например, на медицинских изображениях) и пропускает часть NSFW-изображений. Поэтому лучше ориентироваться на `nsfw_score` и задавать порог под свою коллекцию, а не полагаться только на `is_nsfw`. Опубликованных метрик точности нет. Результат проверки — повод для ручного просмотра, а не автоматического удаления.

## Пример встраивания в конвейер

Проверка коллекции перед публикацией: сервер WARC-Safe запущен локально, скрипт отправляет каждый файл и сохраняет ответы.

```bash
for f in /data/warcs/*.warc.gz; do
  curl -s -X POST -H "Content-Type: application/json" \
    -d "{\"file_path\": \"$f\"}" localhost:8123/test_all \
    > "reports/$(basename "$f").json"
done

# записи с вирусами
jq -r '.results | to_entries[] | select(.value.is_virus) | .key' reports/*.json
```

## Ограничения

- Проверяются только изображения (NSFW) и файлы, которые понимает ClamAV; текст и видео не анализируются.
- Сервер должен иметь доступ к WARC-файлам по файловой системе: загрузка файла через API не предусмотрена.
- Антивирусная проверка на практике предполагает Linux с `clamd`.

## Ресурсы

- [GitHub: natliblux/warc-safe](https://github.com/natliblux/warc-safe)
- [Доклад о WARC-Safe в UNT Digital Library](https://digital.library.unt.edu/ark:/67531/metadc2472470/) ([снимок в Wayback Machine](https://web.archive.org/web/20260205211246/https://digital.library.unt.edu/ark:/67531/metadc2472470/))
- [netarchivesuite/warc-indexer](https://github.com/netarchivesuite/warc-indexer) — индексатор для Solr с поддержкой обогащения полей
- [ClamAV](https://www.clamav.net/)

## Связанные материалы

- [Warchaeology](/kb/instruments/tools/warchaeology) — просмотр и валидация WARC
- [WARC-файл: формат](/kb/instruments/file-formats/warc)
- [SolrWayback](/kb/instruments/tools/solrwayback) — поиск по Solr-индексу
- [WARC-файл: от сырого архива до публикации](/kb/guides/warc-workflow)
- [Ландшафт 2026](/kb/instruments/landscape-2026)
- [Правовые вопросы](/kb/legal/copyright)
