---
title: Heritrix
sidebar_label: Heritrix
description: "Heritrix — эталонный веб-краулер архивного качества от Internet Archive: создаёт WARC-файлы, настраивается через Spring-конфигурацию crawler-beans.cxml и управляется через веб-интерфейс или REST API."
last_update:
  date: 2026-10-12
---

# Heritrix

**[Heritrix](https://github.com/internetarchive/heritrix3)** — открытый, расширяемый, масштабируемый веб-краулер архивного качества, разработанный Internet Archive. Актуальная ветка — Heritrix 3 (H3). Лицензия — Apache-2.0.

## Описание

Heritrix предназначен для архивации в масштабе веба и создаёт WARC-файлы, подходящие для долгосрочного хранения. Его используют Internet Archive и многие национальные библиотеки.

### Особенности

*   **Архивное качество**: WARC-файлы с полными HTTP-заголовками и метаданными обхода, подробные журналы (`crawl.log`) и отчёты.
*   **Расширяемость**: модульная архитектура, можно подключать собственные модули.
*   **Масштабируемость**: рассчитан на обходы миллионов URL.
*   **Гибкая настройка**: конфигурация задания — XML-файл Spring `crawler-beans.cxml`.

## Установка

### Требования

*   Java 17 или новее (рекомендуется OpenJDK из дистрибутива Linux или сборки [Adoptium](https://adoptium.net/));
*   Linux — основная поддерживаемая платформа;
*   по умолчанию куча Java — 256 МБ, этого хватает для обхода сотен хостов; для тысяч хостов выделите больше памяти через `JAVA_OPTS`;
*   достаточно места на диске для WARC-файлов.

### Скачивание

Скачайте последний архив `heritrix-*-dist.tar.gz` со [страницы релизов](https://github.com/internetarchive/heritrix3/releases). Пример для версии 3.18.0:

```bash
wget https://github.com/internetarchive/heritrix3/releases/download/3.18.0/heritrix-3.18.0-dist.tar.gz
tar -xzf heritrix-3.18.0-dist.tar.gz
export HERITRIX_HOME=$PWD/heritrix-3.18.0
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk   # путь к вашей Java 17+
chmod u+x $HERITRIX_HOME/bin/heritrix
```

> Команды сверены с документацией `heritrix.readthedocs.io` и исходным кодом `Heritrix.java` версии 3.18.0 (октябрь 2026).

## Запуск

### Веб-интерфейс

Параметр `-a` (логин и пароль для веб-интерфейса) обязателен — без него Heritrix не запустится:

```bash
$HERITRIX_HOME/bin/heritrix -a admin:пароль
```

Интерфейс открывается **только по HTTPS**: `https://localhost:8443/`. Heritrix использует самоподписанный сертификат, поэтому браузер покажет предупреждение — его нужно принять. По умолчанию интерфейс слушает только `localhost`; другие адреса задаются через `-b`, но перед этим прочитайте раздел о безопасности в документации.

Чтобы пароль не был виден в списке процессов, его можно хранить в файле: `-a @/путь/к/файлу`.

### Основные параметры командной строки

| Параметр | Назначение |
| :--- | :--- |
| `-a`, `--web-admin` | логин:пароль для веб-интерфейса (обязательно) |
| `-b`, `--web-bind-hosts` | адреса, на которых слушает интерфейс |
| `-p`, `--web-port` | порт интерфейса (по умолчанию 8443) |
| `-j`, `--jobs-dir` | каталог заданий (по умолчанию `./jobs`) |
| `-r`, `--run-job` | запустить одно задание и выйти после его завершения |
| `-c`, `--checkpoint` | восстановиться из контрольной точки (только вместе с `-r`; `latest` — последняя) |

Пример запуска одного задания без ручных действий в интерфейсе:

```bash
$HERITRIX_HOME/bin/heritrix -a admin:пароль -j /data/heritrix-jobs -r myjob
```

### Первый обход через веб-интерфейс

1. На главной странице введите имя задания в поле **create new job** и нажмите **create**.
2. Откройте задание и перейдите в **Configuration** — откроется `crawler-beans.cxml`.
3. Заполните `metadata.operatorContactUrl` (страница с вашими контактами для вебмастеров) и список сидов (см. ниже), нажмите **save changes**.
4. Нажмите **build** (проверка конфигурации), затем **launch** (задание запустится в состоянии паузы), затем **unpause**.
5. Для остановки — **terminate**, затем **teardown**.

### REST API

Те же действия доступны через REST API, например:

```bash
curl -v -d "action=build" -k -u admin:пароль --anyauth --location https://localhost:8443/engine/job/myjob
curl -v -d "action=launch" -k -u admin:пароль --anyauth --location https://localhost:8443/engine/job/myjob
```

## Конфигурация

Конфигурация задания хранится в `jobs/<имя>/crawler-beans.cxml`. Новое задание создаётся из профиля по умолчанию; править лучше его, а не писать файл с нуля. (Файл `crawl-order.xml` относится к устаревшему Heritrix 1 и в H3 не используется.)

### Сиды и контакты оператора

В начале профиля есть блоки переопределений. Сиды задаются в `longerOverrides`:

```xml
<bean id="simpleOverrides" class="org.springframework.beans.factory.config.PropertyOverrideConfigurer">
 <property name="properties">
  <value>
metadata.operatorContactUrl=https://example.org/contact
metadata.jobName=myjob
metadata.description=Архивация example.com
  </value>
 </property>
</bean>

<bean id="longerOverrides" class="org.springframework.beans.factory.config.PropertyOverrideConfigurer">
 <property name="properties">
  <props>
   <prop key="seeds.textSource.value">
https://example.com/
https://www.example.com/
   </prop>
  </props>
 </property>
</bean>
```

Значения подставляются в бин `seeds` класса `org.archive.modules.seeds.TextSeedModule`. Вместо встроенного списка можно указать внешний файл `seeds.txt` в каталоге задания (пример закомментирован в профиле).

### Область обхода (scope)

Область задаётся бином `scope` (`DecideRuleSequence`): правила применяются по порядку, побеждает последнее сработавшее. В профиле по умолчанию обход ограничен SURT-префиксами сидов (`SurtPrefixedDecideRule`).

Ограничение глубины — раскомментируйте `maxHops` в существующем правиле:

```xml
<bean class="org.archive.modules.deciderules.TooManyHopsDecideRule">
  <property name="maxHops" value="3" />
</bean>
```

Ограничение доменом и его поддоменами — правило `OnDomainsDecideRule`, добавленное в список `rules`:

```xml
<bean class="org.archive.modules.deciderules.surt.OnDomainsDecideRule">
  <property name="decision" value="ACCEPT" />
  <property name="surtsSource">
    <bean class="org.archive.spring.ConfigString">
      <property name="value">
        <value>
example.com
        </value>
      </property>
    </bean>
  </property>
</bean>
```

Справочник по всем бинам — в разделе [Bean Reference](https://heritrix.readthedocs.io/en/latest/bean-reference.html) документации.

## Сравнение с другими инструментами

| Инструмент | JavaScript | Распределённость | Сложность | Формат |
| :--- | :--- | :--- | :--- | :--- |
| **Heritrix** | Нет | Нет | Высокая | WARC |
| **[Wget](/kb/instruments/tools/wget)** | Нет | Нет | Низкая | файлы и WARC (`--warc-file`) |
| **[Browsertrix Crawler](/kb/instruments/tools/browsertrix)** | Да | Нет (в одном контейнере) | Средняя | WARC/WACZ |
| **[Brozzler](/kb/instruments/tools/brozzler)** | Да | Да | Высокая | WARC |

### Когда использовать Heritrix

*   Большие проекты архивации с тысячами сайтов.
*   Нужны WARC архивного качества и подробные журналы обхода.
*   Статические или умеренно динамические сайты.
*   Требуется тонкая настройка правил обхода, вежливости и дедупликации.

### Когда не использовать Heritrix

*   Сайты с большим количеством JavaScript — используйте [Browsertrix Crawler](/kb/instruments/tools/browsertrix).
*   Нужна простота — используйте [Wget](/kb/instruments/tools/wget) или [grab-site](/kb/instruments/tools/grab-site).
*   Маленькие разовые проекты.

## Best practices

### Настройка памяти

```bash
export JAVA_OPTS="-Xmx4g"
$HERITRIX_HOME/bin/heritrix -a admin:пароль
```

### Мониторинг

Веб-интерфейс показывает прогресс обхода, статистику по хостам, ошибки и журналы. Журналы и отчёты задания лежат в `jobs/<имя>/<метка запуска>/logs` и `.../reports`.

### Вежливость обхода

*   Укажите реальный `operatorContactUrl` — он попадает в User-Agent.
*   Не отключайте соблюдение `robots.txt` без веских причин и согласования.
*   Следите за блокировками и ошибками в `crawl.log`.

## Ресурсы

*   [Репозиторий на GitHub](https://github.com/internetarchive/heritrix3)
*   [Документация](https://heritrix.readthedocs.io/en/latest/)
*   [Группа вопросов и ответов Heritrix](https://groups.google.com/g/heritrix-crawler)

## Связанные материалы

- [Другие краулеры](/kb/instruments/tools)
- [Формат WARC](/kb/instruments/file-formats/warc)
- [Обработка WARC](/kb/instruments/tools/warc-processing)
