const MS_PER_DAY = 86_400_000;

const JAKARTA = "Asia/Jakarta";

function startOfDay(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
}

/**
 * "hari ini" · "kemarin" · "3 hari lalu" · "2 minggu lalu"
 *
 * Selalu dipanggil dengan `now` eksplisit (lihat `MOCK_NOW`) supaya hasil
 * render server dan browser identik — syarat Cache Components di Next 16.
 */
export function formatRelativeDay(iso: string, now: Date): string {
  const then = new Date(iso);

  if (Number.isNaN(then.getTime())) return "belum diketahui";

  const days = Math.round((startOfDay(now) - startOfDay(then)) / MS_PER_DAY);

  if (days <= 0) return "hari ini";
  if (days === 1) return "kemarin";
  if (days < 7) return `${days} hari lalu`;
  if (days < 30) return `${Math.floor(days / 7)} minggu lalu`;
  if (days < 365) return `${Math.floor(days / 30)} bulan lalu`;

  return `${Math.floor(days / 365)} tahun lalu`;
}

/**
 * Jam dalam WIB dengan format desain: "08.42".
 * Zona waktu dipatok ke Asia/Jakarta agar tidak bergantung zona server.
 */
export function formatTimeWib(iso: string): string {
  const date = new Date(iso);

  if (Number.isNaN(date.getTime())) return "--.--";

  const parts = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: JAKARTA,
  }).formatToParts(date);

  const hour = parts.find((part) => part.type === "hour")?.value ?? "--";
  const minute = parts.find((part) => part.type === "minute")?.value ?? "--";

  return `${hour}.${minute}`;
}

/** "hari ini, 09.20" */
export function formatDayTimeWib(iso: string, now: Date): string {
  return `${formatRelativeDay(iso, now)}, ${formatTimeWib(iso)}`;
}

const dateFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: JAKARTA,
});

/** "20 November 2026" */
export function formatDateId(iso: string): string {
  const date = new Date(iso);

  if (Number.isNaN(date.getTime())) return "tanggal tidak diketahui";

  return dateFormatter.format(date);
}
