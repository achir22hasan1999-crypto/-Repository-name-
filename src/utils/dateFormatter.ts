/**
 * Safe Arabic Date Formatter
 * Guarantees zero runtime crashes even on invalid, missing, or malformed date values.
 */
export function formatSafeArabicDate(dateVal?: string | number | Date | null): string {
  if (!dateVal) return 'اليوم';
  try {
    const d = new Date(dateVal);
    if (isNaN(d.getTime())) {
      return 'اليوم';
    }
    return new Intl.DateTimeFormat('ar-MA', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    }).format(d);
  } catch {
    return 'اليوم';
  }
}

export function formatSafeArabicDateFull(dateVal?: string | number | Date | null): string {
  if (!dateVal) return 'اليوم';
  try {
    const d = new Date(dateVal);
    if (isNaN(d.getTime())) {
      return 'اليوم';
    }
    return new Intl.DateTimeFormat('ar-MA', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(d);
  } catch {
    return 'اليوم';
  }
}
