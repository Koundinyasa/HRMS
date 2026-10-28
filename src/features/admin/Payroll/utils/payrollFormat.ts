const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// "2026-11-01" -> "01-Nov-2026" (parsed manually so the timezone never shifts the day)
export function formatDate(iso: string) {
  const [year, month, day] = iso.split("-");
  if (!year || !month || !day) return iso;
  return `${day}-${MONTHS[Number(month) - 1]}-${year}`;
}

// "2026-11" -> "Nov 2026"
export function formatPeriod(period: string) {
  const [year, month] = period.split("-");
  if (!year || !month) return period;
  return `${MONTHS[Number(month) - 1]} ${year}`;
}

// 520000 -> "5.2 LPA"
export function formatLpa(annualCtc: number) {
  return `${Number((annualCtc / 100000).toFixed(2))} LPA`;
}

export function lastDayOfPeriod(period: string) {
  const [year, month] = period.split("-").map(Number);
  const day = new Date(year, month, 0).getDate();
  return `${period}-${String(day).padStart(2, "0")}`;
}
