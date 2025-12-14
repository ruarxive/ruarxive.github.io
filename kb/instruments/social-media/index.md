---
sidebar_position: 1
---

# Архивация социальных сетей

Инструменты для архивации контента из различных социальных сетей и платформ.

## Обзор инструментов

### Twitter

- **[twarc](/kb/instruments/social-media/twarc)** — командная строка и Python библиотека для архивации Twitter JSON данных через Twitter API

### Facebook

- **[fbarc](/kb/instruments/social-media/fbarc)** — командная строка и Python библиотека для архивации данных из Facebook через Graph API

### Instagram

- **[Instagram архивация](/kb/instruments/social-media/instagram)** — методы архивации контента из Instagram

### YouTube

- **[YouTube видео](/kb/instruments/social-media/youtube-video)** — архивация видео с YouTube

### Множественные платформы

- **[Social Feed Manager](/kb/instruments/social-media/social-feed-manager)** — инструмент для архивации контента из множественных социальных сетей

## Сравнение инструментов

| Инструмент | Платформы | API | Формат | Аутентификация | Рекомендация |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **twarc** | Twitter | Twitter API | JSON | API ключи | **Для Twitter** |
| **fbarc** | Facebook | Graph API | JSON | Access Token | **Для Facebook** |
| **Social Feed Manager** | Множественные | Различные | Различные | Зависит от платформы | **Для множественных платформ** |
| **Instagram** | Instagram | Instagram API | Различные | API ключи | Для Instagram |
| **YouTube** | YouTube | YouTube API | Видео файлы | API ключи | Для YouTube |

## Выбор инструмента

### Для одной платформы

- **Twitter**: Используйте [twarc](/kb/instruments/social-media/twarc)
- **Facebook**: Используйте [fbarc](/kb/instruments/social-media/fbarc)
- **Instagram**: Используйте [методы архивации Instagram](/kb/instruments/social-media/instagram)
- **YouTube**: Используйте [YouTube архивацию](/kb/instruments/social-media/youtube-video)

### Для множественных платформ

Используйте [Social Feed Manager](/kb/instruments/social-media/social-feed-manager) для централизованной архивации контента из различных социальных сетей.

## Аутентификация

Большинство инструментов требуют API ключи или токены доступа:

1. Зарегистрируйтесь в Developer Portal соответствующей платформы
2. Создайте приложение
3. Получите API ключи или токены
4. Настройте инструмент с полученными учетными данными

Подробные инструкции по настройке доступны на страницах каждого инструмента.

## Альтернативные методы

Для некоторых платформ доступны альтернативные методы архивации:

- **Data Take-Out**: Использование встроенных функций экспорта данных платформ
- **Веб-архивация**: Использование инструментов веб-архивации для сохранения веб-версий

Подробнее: [Data Take-Out](/kb/instruments/data-take-out/data-take-out-main)

## Связанные материалы

- [Data Take-Out](/kb/instruments/data-take-out/data-take-out-main) — альтернативный метод получения данных
- [Инструменты веб-архивации](/kb/instruments/tools) — для веб-версий социальных сетей
- [Руководства по архивации](/kb/guides) — общие руководства
