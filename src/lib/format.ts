export function formatYear(date: string | Date): string {
  return new Date(date).getUTCFullYear().toString();
}
