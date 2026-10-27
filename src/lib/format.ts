export function formatDate(date: Date | undefined): string {
  if (!date) return "Undated";
  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(date);
}

export function formatYear(date: string | Date): string {
  return new Date(date).getUTCFullYear().toString();
}

export function readingTime(body: string | undefined): string {
  if (!body) return "";
  const words = body.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(words / 220));
  return `${minutes} min read`;
}
