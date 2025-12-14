# Heritrix

**Heritrix** — это открытый, расширяемый, масштабируемый веб-кроулер архивного качества, разработанный Internet Archive.

## Описание

Heritrix предназначен для веб-масштабной архивации и создаёт WARC файлы высокого качества, подходящие для долгосрочного хранения.

### Особенности

*   **Архивное качество**: Создаёт WARC файлы, соответствующие стандартам
*   **Расширяемость**: Модульная архитектура, можно добавлять кастомные модули
*   **Масштабируемость**: Поддерживает большие проекты архивации
*   **Гибкая настройка**: Множество опций конфигурации через XML

## Установка

### Требования

*   Java 8 или выше
*   Минимум 2GB RAM (рекомендуется 4GB+)
*   Достаточно места на диске для WARC файлов

### Скачивание

```bash
# Скачать последнюю версию с GitHub
wget https://github.com/internetarchive/heritrix3/releases/download/3.4.0-20201208/heritrix-3.4.0-20201208-dist.tar.gz
tar -xzf heritrix-3.4.0-20201208-dist.tar.gz
cd heritrix-3.4.0-20201208
```

## Запуск

### Веб-интерфейс

```bash
./heritrix
```

Откройте браузер и перейдите на `http://localhost:8443` (по умолчанию).

### Командная строка

```bash
./heritrix -a admin:admin -j job-name -c crawl-order.xml
```

## Конфигурация

### Базовый crawl-order.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans">
  <bean id="crawlScope" class="org.archive.modules.deciderules.DecideRuleSequence">
    <property name="rules">
      <list>
        <bean class="org.archive.modules.deciderules.AcceptDecideRule"/>
      </list>
    </property>
  </bean>
  
  <bean id="crawlController" class="org.archive.crawler.framework.CrawlController">
    <property name="seeds">
      <list>
        <value>https://example.com</value>
      </list>
    </property>
  </bean>
</beans>
```

### Ограничение глубины

```xml
<bean class="org.archive.modules.deciderules.TooManyHopsDecideRule">
  <property name="maxHops" value="3"/>
</bean>
```

### Ограничение домена

```xml
<bean class="org.archive.modules.deciderules.DomainDecideRule">
  <property name="shouldAccept" value="true"/>
  <property name="domains">
    <list>
      <value>example.com</value>
    </list>
  </property>
</bean>
```

## Сравнение с другими инструментами

| Инструмент | JavaScript | Распределённость | Сложность | Формат |
| :--- | :--- | :--- | :--- | :--- |
| **Heritrix** | Нет | Нет | Высокая | WARC |
| **Wget** | Нет | Нет | Низкая | Файлы |
| **Browsertrix** | Да | Нет | Средняя | WARC/WACZ |
| **Brozzler** | Да | Да | Высокая | WARC |

### Когда использовать Heritrix

*   Большие проекты архивации
*   Нужно архивное качество WARC
*   Статические или простые динамические сайты
*   Требуется гибкая настройка через конфигурацию

### Когда не использовать Heritrix

*   JavaScript-heavy сайты (используйте Browsertrix)
*   Нужна простота использования (используйте Wget)
*   Маленькие проекты (используйте более простые инструменты)

## Best practices

### Настройка памяти

```bash
export JAVA_OPTS="-Xmx4g -Xms2g"
./heritrix
```

### Мониторинг

Используйте веб-интерфейс для мониторинга:
*   Прогресс кроулинга
*   Статистика
*   Ошибки
*   Логи

### Обработка ошибок

*   Настройте retry политику
*   Логируйте ошибки
*   Мониторьте блокировки

## Ресурсы

*   [Официальный сайт](https://github.com/internetarchive/heritrix3)
*   [Heritrix Q&A форум](https://groups.google.com/g/heritrix-crawler)
*   [Документация](https://github.com/internetarchive/heritrix3/wiki)

## Связанные материалы

- [Другие кроулеры](/kb/instruments/tools)
- [Формат WARC](/kb/instruments/file-formats/warc)
- [Обработка WARC](/kb/instruments/tools/warc-processing)
