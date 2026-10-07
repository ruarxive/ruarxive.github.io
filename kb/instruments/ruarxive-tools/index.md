---
sidebar_position: 1
last_updated: 2026-10-07
---

# Инструменты Ruarxive

Инструменты с открытым кодом, разработанные и поддерживаемые командой Ruarxive. Все проекты опубликованы под пермиссивными лицензиями (в основном MIT) и доступны на [github.com/ruarxive](https://github.com/ruarxive) (один репозиторий — `metawarc` — живёт в основной организации [github.com/ruarxive/metawarc](https://github.com/ruarxive/metawarc)).

## Обзор по стадиям архивации

### 1. Сбор (Acquisition)

Инструменты, которые **создают** или **скачивают** архивы и наборы данных.

| Инструмент | Что архивирует | Страница |
| :--- | :--- | :--- |
| **[tgarc](/kb/instruments/ruarxive-tools/tgarc)** | Публичные каналы и чаты Telegram через официальный MTProto API | [→](/kb/instruments/ruarxive-tools/tgarc) |
| **[wparc](/kb/instruments/ruarxive-tools/wparc)** | Сайты на WordPress через открытый REST API `/wp-json/wp/v2/` | [→](/kb/instruments/ruarxive-tools/wparc) |
| **[ydiskarc](/kb/instruments/ruarxive-tools/ydiskarc)** | Публичные папки Яндекс.Диска (обход ограничения «сохранить на свой Диск») | [→](/kb/instruments/ruarxive-tools/ydiskarc) |
| **[filegetter](/kb/instruments/ruarxive-tools/filegetter)** | Произвольные публичные файлы по URL-паттернам и расписаниям | [→](/kb/instruments/ruarxive-tools/filegetter) |

### 2. Обработка и анализ (Process / Analyze)

Инструменты, которые превращают «сырые» WARC-файлы в **индексируемый каталог** с метаданными.

| Инструмент | Что делает | Страница |
| :--- | :--- | :--- |
| **[metawarc](/kb/instruments/ruarxive-tools/metawarc)** | Индексирует WARC-коллекции в DuckDB + Parquet, извлекает метаданные PDF/OOXML/медиа, ищет по тексту, поднимает локальный replay и REST/MCP-интерфейсы | [→](/kb/instruments/ruarxive-tools/metawarc) |

## Сводная таблица «когда что использовать»

| Задача | Рекомендуемый инструмент |
| :--- | :--- |
| Сохранить Telegram-канал или чат | **[tgarc](/kb/instruments/ruarxive-tools/tgarc)** |
| Снять сайт на WordPress целиком (с медиа, тегами, комментариями) | **[wparc](/kb/instruments/ruarxive-tools/wparc)** |
| Скачать публичную папку с Яндекс.Диска | **[ydiskarc](/kb/instruments/ruarxive-tools/ydiskarc)** |
| Скачать много однотипных файлов с публичного сервера (датасеты, документы) | **[filegetter](/kb/instruments/ruarxive-tools/filegetter)** |
| Узнать, что внутри уже собранного WARC, и извлечь метаданные | **[metawarc](/kb/instruments/ruarxive-tools/metawarc)** |
| Найти фразу в тексте заархивированных HTML/PDF | **[metawarc](/kb/instruments/ruarxive-tools/metawarc)** + `index-content --text` |
| Поднять локальный веб-replay архива | **[metawarc](/kb/instruments/ruarxive-tools/metawarc)** + `serve`, либо [pywb](/kb/instruments/replay/pywb) |
| Отдать read-only API коллекции для дашборда / агента | **[metawarc](/kb/instruments/ruarxive-tools/metawarc)** + REST/MCP |

## Установка

Все инструменты доступны через `pip` (рекомендуется устанавливать в отдельное окружение):

```bash
# Сборщики
pip install tgarc wparc ydiskarc filegetter

# Обработка и анализ
pip install metawarc

# metawarc с REST API и веб-replay
pip install 'metawarc[api]'

# metawarc с MCP-сервером
pip install 'metawarc[mcp]'

# metawarc — все интерфейсы сразу
pip install 'metawarc[all]'
```

Альтернативно — установка из исходников, см. репозитории:

- [github.com/ruarxive/tgarc](https://github.com/ruarxive/tgarc)
- [github.com/ruarxive/wparc](https://github.com/ruarxive/wparc)
- [github.com/ruarxive/ydiskarc](https://github.com/ruarxive/ydiskarc)
- [github.com/ruarxive/filegetter](https://github.com/ruarxive/filegetter)
- [github.com/ruarxive/metawarc](https://github.com/ruarxive/metawarc)

## Как читать этот раздел

Каждая страница инструмента выдержана в одном формате:

1. **Что это** — назначение и одна-две ключевые идеи.
2. **Когда использовать** — сценарии, под которые инструмент подходит, и где лучше взять другой.
3. **Установка и быстрый старт** — минимальные команды, чтобы получить первый результат.
4. **Подробности** — конфигурация, расширенные сценарии, формат выходных данных.
5. **Ограничения** — что инструмент не делает, типичные ошибки.
6. **Связанные материалы** — ссылки на смежные страницы базы знаний.

## Принципы

- **Открытый код** — MIT/Apache-2.0, без vendor-lock.
- **Один инструмент — одна задача** — каждый проект решает конкретный класс проблем и хорошо стыкуется с другими.
- **Идемпотентность** — повторный запуск не дублирует данные (`tgarc` инкрементальный, `metawarc index --resume`, `filegetter` пропускает уже скачанные).
- **Обратимость** — `metawarc` хранит исходные WARC неизменными; каталог и сайдкары можно удалить и пересобрать.
- **Документация рядом с кодом** — у `metawarc` есть собственный сайт [ruarxive.org/metawarc](https://ruarxive.org/metawarc/), эта страница — обзорная и служит точкой входа.

## Связанные разделы

- [Все инструменты (включая сторонние)](/kb/instruments)
- [Программы и утилиты (сторонние сборщики и обработчики)](/kb/instruments/tools)
- [Социальные сети](/kb/instruments/social-media) — специализированные сборщики платформ
- [Справочник форматов](/kb/instruments/file-formats) — WARC, WACZ, CDX, METS, BagIt и др.
- [Гайды](/kb/guides) — пошаговые инструкции
- [Кейсы и истории](/kb/case-studies) — примеры использования инструментов на реальных проектах
- [Руководство по WARC](/kb/instruments/file-formats/warc) — что внутри WARC и как с ним работать
