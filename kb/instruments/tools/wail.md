---
title: WAIL
sidebar_label: WAIL
description: "WAIL — настольная оболочка «в один клик» вокруг Heritrix и OpenWayback. Для новой установки базы знаний рекомендует Browsertrix и pywb по отдельности."
last_update:
  date: 2026-10-14
keywords: [wail, heritrix, openwayback, gui]
---

# WAIL

**WAIL** (Web Archiving Integration Layer) — настольная программа, которая прячет связку «собрать сайт → открыть копию» за графическим окном. Её сделали в группе Web Science and Digital Libraries Университета Олд-Доминион. Автор первой версии — Mat Kelly, большой вклад внёс John Berlin.

Исходный репозиторий — [machawk1/wail](https://github.com/machawk1/wail). По его README внутри интерфейса запускаются Heritrix 3.7.0 и OpenWayback 2.4.0, рядом Tomcat и MemGator. Программа написана на Python и собирается PyInstaller. На macOS README предлагает `brew install wail`. Готовые сборки лежат в релизах репозитория, а не ставятся через pip.

Позже появилась переработка **WAIL-Electron** в форке [N0taN3rd/wail](https://github.com/N0taN3rd/wail) (ветка `wail-electron`): вместо OpenWayback там pywb, коллекции ведутся на своём компьютере. README форка называет другие версии вложенных программ (Heritrix 3.2.0 и PyWb 0.33.0) — это описание того форка, не текущего machawk1/wail.

## Когда имеет смысл

- Нужно показать человеку без командной строки, как устроены Heritrix и локальный просмотр.
- Уже есть коллекция, снятая через WAIL, и надо понять, какими программами она собрана.

Для нового архива эта база рекомендует ставить [Browsertrix](/kb/instruments/tools/browsertrix) и [pywb](/kb/instruments/replay/pywb) отдельно. OpenWayback не развивается; Heritrix по-прежнему описан на своей странице, но без оболочки WAIL.

## Связанные материалы

- [Heritrix](/kb/instruments/tools/heritrix)
- [OpenWayback](/kb/instruments/replay/openwayback)
- [pywb](/kb/instruments/replay/pywb)
- [Web Curator Tool](/kb/instruments/tools/web-curator-tool) — учёт заданий для библиотеки, а не личный «один клик»
