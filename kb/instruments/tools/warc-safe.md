---
title: WARC-Safe — антивирусная и NSFW-проверка архивов
sidebar_label: WARC-Safe
description: "WARC-Safe — первый open-source сканер вирусов и NSFW-контента для WARC-файлов от UNT. Интеграция с SolrWayback, UK Web Archive."
last_updated: 2026-11-09
keywords: [warc-safe, antivirus, nsfw, virus, scanner, archive, unt]
---

# WARC-Safe — антивирусная и NSFW-проверка архивов

[WARC-Safe](https://digital.library.unt.edu/ark:/67531/metadc2472470/) — первый open-source сканер для проверки WARC-файлов на **вирусы** и **NSFW-контент** (Not-Safe-For-Work). Разработан в [University of North Texas](https://digital.library.unt.edu/). Особенно важен для **публичных архивов**, где нет модерации каждого файла.

> **Главная идея:** новый WARC из массовой архивации потенциально может содержать вредоносный код (с заархивированных сайтов) или NSFW-контент. WARC-Safe проверяет архив автоматически — так же, как почтовый сервис проверяет вложения.

## Зачем нужен

| Сценарий | Риск без WARC-Safe |
|:---|:---|
| **Публичный архив** (доступен через pywb) | Пользователь получает 200 со страницей, на которой эксплойт через XSS |
| **WARC в публичном S3** | Злоумышленник загружает файл с малварью в HTML-теле, затем скармливает исследователям |
| **Корпоративный архив** | Архивирование скомпрометированного сайта → заражение инфраструктуры при индексации |
| **Демо архива на конференции** | Случайный показ NSFW-страницы |

WARC-Safe решает это:

- **Антивирусная проверка** через ClamAV (или другие движки).
- **NSFW-детекция** через ML-классификатор (NSFWJS, GantMan).
- **Отчёт** с указанием, какие записи проблемные.

## Архитектура

```
┌──────────────┐
│   WARC файл  │
└──────┬───────┘
       │
       ↓ (стриминг по записям)
┌──────────────────────┐
│  WARC-Safe extractor │ ← extract
│  (warcio)            │
└──────────────┬───────┘
               │
       ┌───────┴────────┐
       ↓                ↓
┌──────────────┐  ┌──────────────┐
│   ClamAV     │  │   NSFWJS    │
│   daemon     │  │   ML model   │
└──────┬───────┘  └──────┬───────┘
       │                │
       ↓                ↓
┌────────────────────────────────┐
│   JSON-отчёт per WARC запись  │
│   + сводный CSV для коллекции │
└────────────────────────────────┘
```

## Установка

### Быстрая установка

```bash
pip install warc-safe
```

Для работы нужны:

- Python 3.10+ (рекомендуется 3.11+).
- ClamAV (`brew install clamav` / `apt install clamav-daemon`).
- ~2 ГБ RAM для ML-моделей.

### Полная установка (с dev-окружением)

```bash
git clone https://github.com/unt-libraries/warc-safe
cd warc-safe
pip install -e .
clamav-daemon &
```

## Использование

### CLI

```bash
# Проверить один WARC
warc-safe scan /path/to/archive.warc.gz

# С выводом в JSON
warc-safe scan /path/to/archive.warc.gz --json > report.json

# С выводом в CSV
warc-safe scan /path/to/archive.warc.gz --csv > report.csv

# Проверить несколько WARC
warc-safe scan /path/to/warcs/*.warc.gz --csv > all-reports.csv

# Только вирусы (без NSFW)
warc-safe scan /path/to/archive.warc.gz --only-virus

# Только NSFW
warc-safe scan /path/to/archive.warc.gz --only-nsfw
```

### Python API

```python
from warc_safe import Scanner

scanner = Scanner(
    virus_scanner="clamav",
    nsfw_model="nsfwjs",
    clamav_socket="/var/run/clamav/clamd.ctl",
)

# Сканировать один файл
report = scanner.scan_file("archive.warc.gz")
for finding in report.findings:
    print(finding.url, finding.threat_type, finding.confidence)

# Сканировать коллекцию
for report in scanner.scan_directory("./warcs/"):
    print(f"{report.filename}: {len(report.findings)} проблем")
```

### Конфигурация

`config.yaml`:

```yaml
virus_scanner:
  engine: "clamav"
  socket: "/var/run/clamav/clamd.ctl"
  fallback: "clamd-cli"  # если сокет не работает

nsfw_detector:
  engine: "nsfwjs"
  model: "Inferse/nsfwjs-v2"
  threshold: 0.6

logging:
  level: "info"
  format: "json"

output:
  default_format: "json"
  default_path: "./reports/"
```

## Что обнаруживается

### Вирусы и малварь

- HTML/JavaScript с известными эксплойтами (CVE-2024-XXXX и др.).
- Файлы EICAR тест-сигнатуры (стандарт для проверки антивируса).
- Macro malware в документах.
- Любой сигнатурный вирус в файлах внутри WARC.

ClamAV обновляет базы ежедневно; freshness проверки настраивается.

### NSFW-контент

- Изображения (NSFWJS или YOLO-based).
- Категории: porn, hentai, sexy (настраивается).
- Порог уверенности (по умолчанию 0.6).
- Не применяется к тексту (только изображения и метаданные).

## Интеграция с SolrWayback

WARC-Safe интегрирован с [SolrWayback](/kb/instruments/tools/solrwayback) — после индексации WARC, прежде чем пользователи смогут искать, проверка применяется автоматически:

```bash
# В pipeline SolrWayback
solrwayback-indexer archive.warc.gz --prescan=warc-safe
```

## Интеграция с UK Web Archive

[UK Web Archive](https://www.webarchive.org.uk/) использует WARC-Safe в production для защиты от известных угроз.

## Защищаемые сценарии

### Сценарий 1. Публичный Ruarxive-архив

```bash
#!/bin/bash
# publish-archive.sh
set -e

ARCHIVE=$1

echo "[validate]"
warc-validate "$ARCHIVE"

echo "[virus-scan]"
warc-safe scan "$ARCHIVE" --json > /tmp/scan.json
if python -c "import json,sys;d=json.load(open('/tmp/scan.json'));sys.exit(0 if d['total_threats']==0 else 1)"; then
  echo "[safe] публикуем в S3..."
  aws s3 cp "$ARCHIVE" "s3://ruarxive-public/..."
else
  echo "[WARNING] угрозы обнаружены, проверить вручную"
  cat /tmp/scan.json
  exit 2
fi
```

### Сценарий 2. CI/CD для ежедневных архивов

```cron
# Каждое утро — проверка вчерашних архивов
0 6 * * *  cd /opt/ruarxive && warc-safe scan /data/archives/$(date -d 'yesterday' +%Y-%m-%d)/*.warc.gz --csv > /var/log/warc-safe/daily.csv
```

### Сценарий 3. Real-time на загрузке в pywb

Демонстрирует интеграцию с pywb через webhook после успешной валидации:

```bash
warc-safe scan archive.warc.gz \
  --json \
  --on-success "wb-manager add my-coll archive.warc.gz" \
  --on-threat "echo 'THREAT FOUND' | mail -s 'WARC threat' admin@ruarxive.org"
```

## Отчёт и алертинг

### Формат отчёта

```json
{
  "filename": "archive.warc.gz",
  "scanned_at": "2026-11-09T12:00:00Z",
  "summary": {
    "total_records": 12345,
    "scanned_records": 11000,
    "skipped_records": 1345,
    "threats_found": 3,
    "scan_duration_seconds": 90
  },
  "findings": [
    {
      "url": "https://infected-site.example/payload.html",
      "threat_type": "virus",
      "engine": "clamav",
      "signature": "Win.Test.Eicar",
      "confidence": 1.0,
      "warc_record_id": "<urn:uuid:abc>"
    },
    {
      "url": "https://example.com/nsfw/image.jpg",
      "threat_type": "nsfw-image",
      "engine": "nsfwjs",
      "category": "porn",
      "confidence": 0.87,
      "warc_record_id": "<urn:uuid:def>"
    }
  ]
}
```

### Алертинг

```bash
# Email при обнаружении угроз
warc-safe scan archive.warc.gz --csv | \
  awk -F, 'NR>1 && $3>0 {print}' | \
  mail -s "WARC-Safe: $ARCHIVE — угрозы найдены" admin@ruarxive.org
```

## Точность и false positives

| Тип | Точность | False positive rate |
|:---|:---|:---|
| ClamAV | ~95 % известных угроз | < 0.1 % |
| NSFW (NSFWJS) | ~90 % очевидных случаев | ~3–5 % (фото искусства, медицина) |

**Что делать с false positives:**

- Пометить вручную и сохранить.
- Использовать `tag` вместо удаления.
- Настроить threshold для NSFW (выше — меньше false positives).

## Когда использовать

✅ Подходит:

- **Публичные веб-архивы** перед публикацией.
- **Публичные репозитории WARC** (Academic Torrents, IA).
- **Корпоративные коллекции** для внутренней безопасности.
- **OSINT-архивы** при работе с непроверенным контентом.
- **Демо на конференциях** — гарантия, что не покажут вредонос.
- **Compliance** (GDPR, COPPA) — доказательство должной проверки.

❌ Не подходит:

- **Малые приватные архивы** — overhead не оправдан.
- **Полная замена модерации** — это дополнение к модерации, не замена.
- **Анализ видеофайлов** — нужны специализированные инструменты.
- **Realtime per-page** — это batch-инструмент.

## Юридический аспект

> [!TIP]
> Проведение антивирусной и NSFW-проверки показывает **должную осмотрительность** (due diligence) архиватора. Это критично для публичных архивов в случае претензий правообладателей или провайдеров.

## Ресурсы

- [WARC-Safe на UNT Digital Library](https://digital.library.unt.edu/ark:/67531/metadc2472470/)
- [GitHub проекта](https://github.com/unt-libraries/warc-safe)
- [ClamAV documentation](https://www.clamav.net/)
- [NSFWJS project](https://github.com/infinitered/nsfwjs)
- [SolrWayback интеграция](https://github.com/netarchivesuite/solrwayback)

## Связанные материалы

- [Warchaeology](/kb/instruments/tools/warchaeology) — общие инструменты.
- [WARC-файл: формат](/kb/instruments/file-formats/warc)
- [SolrWayback](/kb/instruments/tools/solrwayback) — куда интегрируется.
- [WARC-файл: от сырого архива до публикации](/kb/guides/warc-workflow) — где в pipeline.
- [Ландшафт 2026](/kb/instruments/landscape-2026) — где WARC-Safe.
- [Правовые вопросы](/kb/legal/copyright) — из-за чего важно сканировать.
