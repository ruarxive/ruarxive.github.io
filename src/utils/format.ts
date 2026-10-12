const numberFormat = new Intl.NumberFormat('ru-RU');

const BYTE_UNITS: [number, string][] = [
  [1e12, 'ТБ'],
  [1e9, 'ГБ'],
  [1e6, 'МБ'],
  [1e3, 'КБ'],
];

export function formatNumber(value: number): string {
  return numberFormat.format(value);
}

/** plural(2, ['домен', 'домена', 'доменов']) → 'домена' */
export function plural(n: number, [one, few, many]: [string, string, string]): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few;
  return many;
}

/** count(144, ['коллекция', 'коллекции', 'коллекций']) → '144 коллекции' */
export function count(n: number, forms: [string, string, string]): string {
  return `${formatNumber(n)} ${plural(n, forms)}`;
}

export const RESOURCE_FORMS: [string, string, string] = ['ресурс', 'ресурса', 'ресурсов'];
export const FILE_FORMS: [string, string, string] = ['файл', 'файла', 'файлов'];
export const COLLECTION_FORMS: [string, string, string] = ['коллекция', 'коллекции', 'коллекций'];
export const FOLDER_FORMS: [string, string, string] = ['папка', 'папки', 'папок'];
export const RECORD_FORMS: [string, string, string] = ['запись', 'записи', 'записей'];

export function formatBytes(bytes: number): string {
  for (const [size, unit] of BYTE_UNITS) {
    if (bytes >= size) {
      const value = bytes / size;
      const digits = value >= 100 ? 0 : 1;
      return `${new Intl.NumberFormat('ru-RU', { maximumFractionDigits: digits }).format(value)} ${unit}`;
    }
  }
  return `${bytes} Б`;
}

/** 2023-12-12 → 12.12.2023 */
export function formatDate(isoDate: string): string {
  const [y, m, d] = isoDate.split('-');
  return `${d}.${m}.${y}`;
}
