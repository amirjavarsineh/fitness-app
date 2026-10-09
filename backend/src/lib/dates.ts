const TEHRAN_TZ = 'Asia/Tehran';
const TEHRAN_OFFSET = '+03:30';

export function toTehranDateKey(d: Date | string): string {
  const date = typeof d === 'string' ? new Date(d) : d;
  const fmt = new Intl.DateTimeFormat('en-CA', {
    timeZone: TEHRAN_TZ,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  return fmt.format(date);
}

export function startOfDayTehran(dateKey: string): Date {
  return new Date(`${dateKey}T00:00:00${TEHRAN_OFFSET}`);
}

export function todayTehran(): Date {
  return startOfDayTehran(toTehranDateKey(new Date()));
}