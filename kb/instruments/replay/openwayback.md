# OpenWayback

**OpenWayback** — это open-source проект для разработки Wayback Machine, ключевого программного обеспечения, используемого веб-архивами по всему миру для воспроизведения заархивированных веб-сайтов в браузере пользователя.

## Описание

OpenWayback — это Java-приложение, которое предоставляет веб-интерфейс для просмотра веб-архивов в формате WARC.

### Особенности

*   **Wayback Machine**: Классическая реализация Wayback Machine
*   **WARC поддержка**: Работает с WARC файлами
*   **CDX индексы**: Использует CDX для быстрого поиска
*   **Веб-интерфейс**: Веб-интерфейс для просмотра архивов

## Установка

### Требования

*   Java 8+
*   Tomcat 8+ или Jetty
*   CDX индексы для WARC файлов

### Установка

1. Скачайте последнюю версию с [GitHub](https://github.com/iipc/openwayback)
2. Соберите проект:
```bash
mvn clean package
```
3. Разверните WAR файл на Tomcat

## Настройка

### Конфигурация wayback.xml

```xml
<wayback>
  <archives>
    <archive>
      <path>/path/to/warcs</path>
      <prefix>http://localhost:8080/wayback/</prefix>
    </archive>
  </archives>
</wayback>
```

### Создание CDX индексов

```bash
cdx-indexer /path/to/warcs/*.warc.gz > index.cdx
```

## Использование

### Веб-интерфейс

После установки откройте браузер на `http://localhost:8080/wayback/`.

### Поиск по URL

Введите URL в поисковую строку для поиска архивных версий.

### Просмотр по дате

Используйте календарь для выбора конкретной даты архивации.

## API

### Memento API

OpenWayback поддерживает Memento API для доступа к архивным версиям:

```
http://localhost:8080/wayback/timemap/link/http://example.com/
```

### JSON API

```bash
curl "http://localhost:8080/wayback/cdx?url=http://example.com/"
```

## Сравнение с PYWB

| Функция | OpenWayback | PYWB | Победитель |
| :--- | :--- | :--- | :--- |
| Язык | Java | Python | Зависит от окружения |
| Простота установки | Средняя | Высокая | PYWB |
| Производительность | Высокая | Средняя | OpenWayback |
| Активность разработки | Средняя | Высокая | PYWB |

### Когда использовать OpenWayback

*   Существующие установки на Java
*   Требуется высокая производительность
*   Классическая установка Wayback Machine
*   Интеграция с Java экосистемой

### Когда использовать PYWB

*   Новая установка
*   Python окружение
*   Нужна простота установки
*   Активная разработка

## Best practices

### Оптимизация индексов

*   Регулярно обновляйте CDX индексы
*   Используйте сжатые индексы
*   Разделяйте индексы по коллекциям

### Кэширование

Настройте кэширование для улучшения производительности:

```xml
<cache>
  <enabled>true</enabled>
  <maxSize>1000</maxSize>
</cache>
```

### Мониторинг

*   Мониторьте использование памяти
*   Проверяйте производительность
*   Логируйте ошибки

## Ресурсы

*   [GitHub репозиторий](https://github.com/iipc/openwayback)
*   [Документация](https://github.com/iipc/openwayback/wiki)
*   [Mailing list](https://groups.google.com/g/openwayback-dev)

## Связанные материалы

- [PYWB для сравнения](/kb/instruments/replay/pywb)
- [CDX формат](/kb/instruments/file-formats/cdx)
- [Формат WARC](/kb/instruments/file-formats/warc)
