# Squidwarc

**Squidwarc** — это открытый, высококачественный, интерактивный архивный кроулер, использующий Chrome или Chrome Headless напрямую.

## Описание

Squidwarc разработан для интерактивной архивации сложных веб-приложений с полной поддержкой JavaScript и интерактивных элементов.

### Особенности

*   **Интерактивность**: Прямое управление Chrome для интерактивной архивации
*   **Высокое качество**: Создаёт высококачественные WARC файлы
*   **Chrome Headless**: Поддержка headless режима для автоматизации
*   **Прямое управление**: Прямой контроль над браузером

## Установка

### Требования

*   Node.js 12+
*   Chrome или Chromium
*   npm или yarn

### Установка

```bash
npm install -g squidwarc
```

### Из исходников

```bash
git clone https://github.com/N0taN3rd/Squidwarc
cd Squidwarc
npm install
```

## Использование

### Базовое использование

```bash
squidwarc --url https://example.com --output archive.warc
```

### Headless режим

```bash
squidwarc --url https://example.com \
  --output archive.warc \
  --headless
```

### Интерактивный режим

```bash
squidwarc --url https://example.com \
  --output archive.warc \
  --interactive
```

## Особенности работы

### Прямое управление Chrome

Squidwarc использует Chrome DevTools Protocol для прямого управления браузером:

*   Полный контроль над навигацией
*   Интерактивные действия (клики, скроллинг)
*   Захват всех сетевых запросов
*   Обработка JavaScript событий

### Интерактивная архивация

В интерактивном режиме можно:

*   Вручную управлять браузером
*   Выполнять действия на странице
*   Контролировать процесс архивации
*   Останавливать и возобновлять архивацию

## Сравнение с другими инструментами

| Инструмент | Интерактивность | Распределённость | Простота | Рекомендация |
| :--- | :--- | :--- | :--- | :--- |
| **Squidwarc** | ✅ Высокая | Нет | Средняя | **Для интерактивных сайтов** |
| **Browsertrix** | ⚠️ Ограниченная | Нет | Высокая | Для большинства случаев |
| **Brozzler** | ⚠️ Ограниченная | Да | Низкая | Для распределённых проектов |

### Когда использовать Squidwarc

*   Сложные интерактивные веб-приложения
*   Нужен полный контроль над процессом
*   Интерактивная архивация с участием пользователя
*   Специфические требования к архивации

### Когда использовать Browsertrix

*   Автоматическая архивация
*   Нужен WACZ формат
*   Простота использования
*   Стандартные случаи

## Best practices

### Для SPA приложений

```bash
squidwarc --url https://spa-app.example.com \
  --output archive.warc \
  --wait-for-selector ".content-loaded" \
  --scroll-to-bottom
```

### Для интерактивных сайтов

```bash
squidwarc --url https://interactive-site.com \
  --output archive.warc \
  --interactive \
  --click-buttons \
  --expand-menus
```

### Настройка таймаутов

```bash
squidwarc --url https://example.com \
  --output archive.warc \
  --page-timeout=30000 \
  --network-idle-timeout=5000
```

## Ограничения

*   Требует Chrome/Chromium
*   Может быть медленнее автоматических инструментов
*   Интерактивный режим требует участия пользователя
*   Нет встроенной поддержки WACZ

## Ресурсы

*   [GitHub репозиторий](https://github.com/N0taN3rd/Squidwarc)
*   [Документация](https://github.com/N0taN3rd/Squidwarc/wiki)

## Связанные материалы

- [Browsertrix для автоматизации](/kb/instruments/tools/browsertricks)
- [Интерактивная архивация](/kb/guides/custom-workflows)
- [Формат WARC](/kb/instruments/file-formats/warc)
