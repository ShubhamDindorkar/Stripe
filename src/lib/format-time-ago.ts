const MINUTE_MS = 60_000;
const HOUR_MS = 3_600_000;
const DAY_MS = 86_400_000;

export function formatTimeAgo(isoDate: string, now = Date.now()): string {
  const publishedAt = new Date(isoDate).getTime();
  const elapsedMs = Math.max(0, now - publishedAt);

  const minutes = Math.floor(elapsedMs / MINUTE_MS);
  if (minutes < 60) {
    return minutes === 1 ? "1 minute ago" : `${minutes} minutes ago`;
  }

  const hours = Math.floor(elapsedMs / HOUR_MS);
  if (hours < 24) {
    return hours === 1 ? "1 hour ago" : `${hours} hours ago`;
  }

  const days = Math.floor(elapsedMs / DAY_MS);
  return days === 1 ? "1 day ago" : `${days} days ago`;
}
