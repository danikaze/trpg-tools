const RATIO_SECS_MS = 1000;

/**
 * Get the date associated to a timestamp data stored in the database
 */
export function getDateFromTimestamp(timestamp: number): Date {
  return new Date(timestamp * RATIO_SECS_MS);
}

/**
 * Display a date in a user-readable format
 * TODO: Choose a better format maybe?
 */
export function formatDate(date: Date): string {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const hh = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  const ss = String(date.getSeconds()).padStart(2, '0');

  return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`;
}
