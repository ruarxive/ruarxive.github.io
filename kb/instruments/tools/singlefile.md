# SingleFile

**SingleFile** — это браузерное расширение для Firefox/Chrome и CLI инструмент для сохранения полной копии веб-страницы в один HTML файл.

## Описание

SingleFile сохраняет веб-страницу со всеми ресурсами (CSS, изображения, шрифты) встроенными в один самодостаточный HTML файл.

### Особенности

*   **Один файл**: Вся страница в одном HTML файле
*   **Самодостаточность**: Все ресурсы встроены
*   **Браузерное расширение**: Удобное использование в браузере
*   **CLI версия**: Для автоматизации

## Установка

### Браузерное расширение

#### Chrome/Chromium

1. Откройте [Chrome Web Store](https://chrome.google.com/webstore/detail/singlefile/mpiodijhokgodhhofbcjdecpffjipkle)
2. Нажмите "Установить"

#### Firefox

1. Откройте [Firefox Add-ons](https://addons.mozilla.org/firefox/addon/single-file/)
2. Нажмите "Добавить в Firefox"

### CLI версия

```bash
npm install -g single-file-cli
```

## Использование

### Браузерное расширение

1. Откройте страницу, которую хотите сохранить
2. Нажмите на иконку SingleFile в панели инструментов
3. Страница будет сохранена в один HTML файл

### CLI версия

```bash
single-file https://example.com --output=page.html
```

### С опциями

```bash
single-file https://example.com \
  --output=page.html \
  --remove-scripts \
  --remove-frames \
  --max-wait-time=5000
```

## Сравнение с другими решениями

### monolith

[monolith](https://github.com/Y2Z/monolith) — CLI инструмент для сохранения страницы в один HTML файл.

*   **Отличия**: Только CLI, нет браузерного расширения

### Obelisk

[Obelisk](https://github.com/go-shiori/obelisk) — Go пакет и CLI для сохранения страницы в один HTML файл.

*   **Отличия**: Написан на Go, только CLI

| Инструмент | Браузерное расширение | CLI | Язык | Рекомендация |
| :--- | :--- | :--- | :--- | :--- |
| **SingleFile** | ✅ | ✅ | JavaScript | **Для большинства случаев** |
| **monolith** | ❌ | ✅ | Rust | Для CLI использования |
| **Obelisk** | ❌ | ✅ | Go | Для Go проектов |

## Best practices

### Сохранение без скриптов

```bash
single-file https://example.com \
  --output=page.html \
  --remove-scripts
```

### Сохранение с удалением фреймов

```bash
single-file https://example.com \
  --output=page.html \
  --remove-frames
```

### Ожидание загрузки

```bash
single-file https://example.com \
  --output=page.html \
  --max-wait-time=10000
```

## Ограничения

*   Один файл может быть очень большим
*   Не подходит для больших сайтов
*   Не создаёт WARC файлы
*   Ограниченная поддержка динамического контента

## Ресурсы

*   [GitHub репозиторий](https://github.com/gildas-lormeau/SingleFile)
*   [Документация](https://github.com/gildas-lormeau/SingleFile/wiki)

## Связанные материалы

- [Другие инструменты сохранения](/kb/instruments/tools)
- [WARC формат для архивов](/kb/instruments/file-formats/warc)
- [Быстрый старт](/kb/guides/quick-start-5min)
