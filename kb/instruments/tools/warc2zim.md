---
title: Kiwix (warc2zim, zimit)
sidebar_label: Kiwix (warc2zim, zimit)
description: Конвертация WARC в формат ZIM для офлайн-чтения через Kiwix, инструменты warc2zim, zimit, zimwriterfs
---

# Kiwix (warc2zim, zimit, zimwriterfs)

**Kiwix** — open-source экосистема для офлайн-чтения веб-контента. В центре — формат **ZIM** (сжатый, полностью-индексированный, читается через Kiwix-приложения). Для архивистов ключевые инструменты — **warc2zim** (конвертация WARC в ZIM), **zimit** (краулинг сразу в ZIM через Browsertrix) и **zimwriterfs** (создание ZIM из локальной HTML-папки).

Сайт: [kiwix.org](https://kiwix.org/)

## Зачем нужен

WARC — это **«сырой» архив** для долгосрочного хранения. Но обычный пользователь не может его открыть без pywb, OpenWayback или ReplayWeb.page. **ZIM — это «потребительский» формат**:

- **Один файл** — весь архив сайта в `.zim` (5-50 ГБ для больших сайтов).
- **Полнотекстовый поиск** — работает локально в Kiwix-приложении.
- **Читается на любом устройстве** — Windows, macOS, Linux, Android, iOS, Kiwix Serve.
- **Без интернета** — идеально для отключённых регионов, школ, библиотек.
- **Без CDN и трекеров** — никакой сторонней инфраструктуры.
- **Стандарт для Wikipedia-зеркал** — весь Wikipedia-оффлайн это Kiwix.

Для СНГ-архивов это **критически важно**: доступ к информации может быть ограничен, ZIM можно распространять через торренты, флешки, на локальных серверах.

## Что входит в экосистему

| Инструмент | Что делает | Когда использовать |
| :--- | :--- | :--- |
| **zimit** | Кроулинг сразу в ZIM (обёртка над Browsertrix Crawler) | Архивация современного сайта в один файл ZIM |
| **warc2zim** | Конвертация WARC → ZIM | У вас уже есть WARC, хотите ZIM |
| **zimwriterfs** | Создание ZIM из локальной HTML-папки | Архивация статического HTML, генерация с нуля |
| **Kiwix Serve** | HTTP-сервер для раздачи ZIM | Локальная инфраструктура для нескольких ZIM |
| **Kiwix JS** | Браузерный/WASM-читалка ZIM | Читать ZIM без установки приложения |
| **mwoffliner** | Специализированный конвертер MediaWiki → ZIM | Архивирование Википедии, MediaWiki-сайтов |

## Формат ZIM

**ZIM** (Zeno IMproved) — это сжатый, индексированный формат для веб-контента:

- **Содержимое** — HTML, CSS, изображения, видео, аудио, PDF.
- **Полнотекстовый индекс** — поиск с морфологией.
- **Метаданные** — title, описание, автор, дата, язык.
- **Сжатие** — xz, zstd, обычно 2-5× от исходного HTML.
- **Размер** — от нескольких МБ (маленький сайт) до 100+ ГБ (Wikipedia).

Спецификация: [openzim.org/wiki/ZIM_file_format](https://openzim.org/wiki/ZIM_file_format).

## Возможности warc2zim

- **Чтение WARC/WARC.gz** файлов.
- **Извлечение HTML и медиа** из WARC.
- **Создание полнотекстового индекса** (Xapian-based).
- **Сохранение структуры ссылок** для навигации.
- **Метаданные** в ZIM-файле.
- **Параллельная обработка** для больших архивов.
- **Запись в xz или zstd** для максимального сжатия.

## Возможности zimit

- **Краулинг через реальный Chrome** (через Browsertrix Crawler).
- **JS-рендеринг** — современные сайты работают.
- **WARC-вывод опционально** — можно одновременно WARC + ZIM.
- **Behaviors** — autoscroll, autoplay, site-specific скрипты.
- **Аутентификация** через cookies.
- **Rate limiting** и уважение к robots.txt.

## Когда использовать

✅ Kiwix-экосистема подходит для:

- **Распространения архивов** среди пользователей без технических знаний.
- **Офлайн-доступа** к контенту (отключённый интернет, школы, экспедиции).
- **Долгосрочного хранения** с человекочитаемым форматом.
- **Архивирования Википедии** (Wikipedia, Wikidata) и других MediaWiki.
- **Создания «Kiwix-стиля» архивов** для конкретных сайтов.
- **Торрент-распространения** (Wikipedia-зеркала доступны через торренты).

❌ Не подходит для:

- **Серверного воспроизведения** с поиском по URL (для этого — [pywb](/kb/instruments/replay/pywb)).
- **Извлечения отдельных файлов** из WARC (для этого — [WARC-processing](warc-processing)).
- **Долгосрочного архивирования** в стандарт WARC (ZIM теряет часть метаданных WARC).
- **Больших инкрементальных обновлений** (ZIM обычно пересоздаётся).

## Установка

### Docker (рекомендуется)

```bash
# warc2zim
docker pull openzim/warc2zim:latest

# zimit
docker pull ghcr.io/openzim/zimit:latest

# kiwix-serve
docker pull kiwix/kiwix-serve:latest
```

### Из исходников

```bash
# warc2zim
git clone https://github.com/openzim/warc2zim
cd warc2zim
pip install .

# zimit
git clone https://github.com/openzim/zimit
cd zimit
npm install
```

### Пакетные менеджеры

```bash
# Arch
yay -S kiwix-tools kiwix-desktop

# Ubuntu
sudo apt install kiwix-tools
```

### Готовые приложения

- [Kiwix Desktop](https://www.kiwix.org/en/download/) — Windows, macOS, Linux.
- [Kiwix Android](https://play.google.com/store/apps/details?id=org.kiwix.kiwixmobile) — Google Play.
- [Kiwix iOS](https://apps.apple.com/app/kiwix/id997076992) — App Store.

## Использование

### warc2zim: WARC → ZIM

#### Базовое использование

```bash
warc2zim \
  --input archive.warc.gz \
  --output archive.zim \
  --title "My Archive" \
  --description "Archive of example.com from 2025" \
  --creator "Ruarxive"
```

#### С расширенными опциями

```bash
warc2zim \
  --input archive.warc.gz \
  --output archive.zim \
  --title "Government Archive 2025" \
  --description "Daily snapshots of government sites" \
  --creator "Ruarxive" \
  --publisher "Ruarxive.org" \
  --name "ruarxive-gov-2025" \
  --tags "government;russia;archive" \
  --language rus \
  --illustration cover.jpg \
  --no-fulltext  # отключить полнотекстовый индекс
```

#### Через Docker

```bash
docker run --rm \
  -v $(pwd):/data \
  openzim/warc2zim \
  --input /data/archive.warc.gz \
  --output /data/archive.zim \
  --title "My Archive"
```

### zimit: краулинг сразу в ZIM

#### Базовое использование

```bash
zimit \
  --url https://example.com \
  --output example.zim \
  --title "Example Archive" \
  --description "Offline archive of example.com"
```

#### С продвинутыми опциями

```bash
zimit \
  --url https://news.example.com \
  --output news-2025.zim \
  --title "News 2025" \
  --description "Daily news archive" \
  --workers 4 \
  --maxDepth 5 \
  --includeRegex "news.example.com/2025/.*" \
  --excludeRegex ".*\\.(mp4|zip)$" \
  --behaviors autoscroll,autoplay \
  --timeLimit 3600
```

#### С WARC-выводом одновременно

```bash
zimit \
  --url https://example.com \
  --output example.zim \
  --outputWARC example.warc.gz \
  --outputWACZ example.wacz \
  --title "Example Archive"
```

### zimwriterfs: HTML-папка → ZIM

```bash
# Сначала скачать HTML
wget --mirror --convert-links --adjust-extension \
  --no-parent https://example.com -P /tmp/site

# Создать ZIM
zimwriterfs \
  --title="My Site" \
  --description="Offline copy" \
  --creator="Ruarxive" \
  /tmp/site \
  archive.zim
```

### Kiwix Serve: раздача ZIM по HTTP

```bash
kiwix-serve \
  --port 8080 \
  --library /path/to/library.xml \
  *.zim
```

Открыть `http://localhost:8080` — список ZIM с поиском.

## Конфигурация

### `library.xml` для Kiwix Serve

```xml
<library version="1.0">
  <book id="ruarxive-gov-2025" 
        path="/var/kiwix/gov-2025.zim" 
        url="/gov-2025" 
        title="Government Archive 2025"
        description="Daily snapshots of Russian government sites"
        language="rus"
        creator="Ruarxive"
        publisher="ruarxive.org"
        date="2025-12-31"
        tags="government;russia;archive"
        favicon="/var/kiwix/gov-2025-favicon.png"
        size="5368709120"/>
</library>
```

### Docker Compose для Kiwix Serve

```yaml
version: "3"
services:
  kiwix:
    image: kiwix/kiwix-serve:latest
    ports:
      - "8080:8080"
    volumes:
      - ./zims:/zims
      - ./library.xml:/library.xml
    command: kiwix-serve --port 8080 --library /library.xml /zims/*.zim
```

## Сравнение с другими инструментами

| Инструмент | Формат вывода | JS | Офлайн-чтение | Полный текст | Сложность |
| :--- | :--- | :---: | :---: | :---: | :--- |
| **Kiwix (warc2zim/zimit)** | ZIM | ✅ | ✅ | ✅ | Средняя |
| **[pywb](/kb/instruments/replay/pywb)** | WARC + сервер | ⚠️ | ❌ | ⚠️ | Высокая |
| **[ReplayWeb.page](/kb/instruments/replay/replayweb-page)** | WARC + браузер | ✅ | ⚠️ | ❌ | Низкая |
| **[Browsertrix](browsertrix)** | WACZ | ✅ | ❌ | ❌ | Средняя |
| **[ArchiveBox](archivebox)** | HTML + SQLite | ⚠️ | ⚠️ | ✅ | Средняя |
| **HTTrack** | HTML | ❌ | ✅ | ❌ | Низкая |

### Когда Kiwix лучше всех

- Нужно **распространение среди обычных пользователей** (без знаний WARC).
- Целевая аудитория — **офлайн-доступ** (отключённый интернет, экспедиции, школы).
- **Wikipedia-зеркало** или другой MediaWiki-сайт.
- **Торрент-распространение** (Kiwix-зеркала популярны в bittorrent).

### Когда лучше pywb

- Нужен **серверный доступ по URL** (как wayback.example.com).
- Важна **навигация по датам** (как на web.archive.org).
- **Инкрементальное обновление** (новые кроулы добавляются к существующим).

### Когда лучше ReplayWeb.page

- Быстрая проверка **без сервера** — открыл WARC в браузере.
- Не нужно **распространение** (только для себя).

## Best practices

### 1. Всегда делайте WARC-бэкап

ZIM — это «потребительский» формат, WARC — «архивный». Сохраняйте WARC, даже если распространяете ZIM.

```bash
# ZIM + WARC
zimit --url https://example.com \
      --output example.zim \
      --outputWARC example.warc.gz
```

### 2. Метаданные — обязательно

```bash
zimit --url ... \
      --title "..." \
      --description "..." \
      --creator "..." \
      --language rus \
      --tags "..."
```

Без метаданных ZIM невозможно каталогизировать.

### 3. Используйте zimit вместо warc2zim для современных сайтов

```bash
# Современный SPA
zimit --url https://spa-app.com --output spa.zim --behaviors autoscroll,wait

# vs
wget --mirror https://spa-app.com  # пустая каркас
warc2zim archive.warc.gz  # тоже пустая каркас
```

### 4. Сжимайте правильно

```bash
# ZIM обычно уже сжат. Дополнительное сжатие сожмёт ещё ~5-10%
zstd -22 archive.zim -o archive.zim.zst
# или
xz -9 -e archive.zim
```

### 5. Для больших ZIM — Kiwix Serve

Не пытайтесь открыть 50 ГБ ZIM на телефоне — поставьте Kiwix Serve на домашнем NAS, подключайтесь по Wi-Fi.

### 6. Подписывайте manifest

```bash
# Создать manifest.json с контрольными суммами
sha256sum archive.zim > archive.zim.sha256
```

### 7. Используйте mwoffliner для Википедии

```bash
# Гораздо эффективнее, чем warc2zim
mwoffliner --mwUrl="https://ru.wikipedia.org" \
           --adminEmail="you@example.com" \
           --outputDirectory=/tmp \
           --filename="wikipedia-ru.zim"
```

## Ограничения

- **ZIM — не стандарт ISO**, в отличие от WARC. Долгосрочная совместимость зависит от проекта Kiwix.
- **Потеря части метаданных** WARC при конвертации.
- **Большие ZIM** (десятки ГБ) — медленный полнотекстовый поиск.
- **Не инкрементально** — пересоздание с нуля при обновлении.
- **Один сайт на ZIM** (обычно) — нельзя собрать разные сайты в один ZIM.
- **Зависимость от LibreOffice/wkhtmltopdf** для PDF-конверсии в некоторых сценариях.

## Юридические аспекты

> [!WARNING]
> ZIM-файлы могут содержать защищённый авторским правом контент. Распространение ZIM со всем контентом сайта может нарушать ToS сайта. **Всегда указывайте источник и лицензию** в метаданных ZIM.

Свободно лицензированный контент (CC, public domain, государственные сайты многих стран) — можно распространять свободно.

## Ресурсы

- [Официальный сайт Kiwix](https://kiwix.org/) — главная.
- [openZIM на GitHub](https://github.com/openzim) — исходный код всех инструментов.
- [Документация warc2zim](https://github.com/openzim/warc2zim) — параметры.
- [Документация zimit](https://github.com/openzim/zimit) — параметры.
- [Спецификация ZIM](https://openzim.org/wiki/ZIM_file_format) — формат.
- [Wikipedia-зеркала](https://wiki.kiwix.org/wiki/Content_in_other_languages) — готовые ZIM.
- [Kiwix Android на F-Droid](https://f-droid.org/en/packages/org.kiwix.kiwixmobile/) — без Google Play.

## Связанные материалы

- **[Формат WARC](/kb/instruments/file-formats/warc)** — исходный формат.
- **[Browsertrix](browsertrix)** — внутри zimit.
- **[pywb](/kb/instruments/replay/pywb)** — альтернативное воспроизведение.
- **[WARC-processing](warc-processing)** — извлечение данных из WARC.
- **[Как пользоваться архивами](/kb/users/open-warc)** — открытие WARC/ZIM.
- **[Экстренная архивация](/kb/guides/emergency-archiving)** — zimit для быстрого захвата.
- **[Правовые вопросы](/kb/legal/copyright)** — лицензирование ZIM.
- **[Кейсы международных архивов](/kb/case-studies/international-examples)** — Kiwix в действии.
