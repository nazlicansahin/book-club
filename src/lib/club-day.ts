const DEFAULT_TIMEZONE = "UTC";

export function normalizeTimezone(timezone?: string | null): string {
  if (!timezone) return DEFAULT_TIMEZONE;
  try {
    Intl.DateTimeFormat(undefined, { timeZone: timezone });
    return timezone;
  } catch {
    return DEFAULT_TIMEZONE;
  }
}

export function getClubLocalDate(timezone: string, now = new Date()): string {
  const tz = normalizeTimezone(timezone);
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: tz,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);

  const year = parts.find((p) => p.type === "year")?.value ?? "1970";
  const month = parts.find((p) => p.type === "month")?.value ?? "01";
  const day = parts.find((p) => p.type === "day")?.value ?? "01";
  return `${year}-${month}-${day}`;
}

export function getPreviousDate(dateStr: string): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  dt.setUTCDate(dt.getUTCDate() - 1);
  return dt.toISOString().slice(0, 10);
}

export function getDayEndIso(timezone: string, now = new Date()): string {
  const tz = normalizeTimezone(timezone);
  const clubToday = getClubLocalDate(tz, now);
  const [y, m, d] = clubToday.split("-").map(Number);

  // Walk forward in UTC until club-local date advances past today
  let candidate = new Date(Date.UTC(y, m - 1, d, 12, 0, 0));
  for (let i = 0; i < 72; i++) {
    candidate = new Date(candidate.getTime() + 60 * 60 * 1000);
    if (getClubLocalDate(tz, candidate) !== clubToday) {
      return candidate.toISOString();
    }
  }

  // Fallback: 24h from now
  return new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString();
}
