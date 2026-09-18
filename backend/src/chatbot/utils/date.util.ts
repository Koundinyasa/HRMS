export function extractIsoDate(message: string): string | null {
  const m = String(message || '').match(/(\d{4})-(\d{2})-(\d{2})/);
  return m ? m[0] : null;
}
 
export function parseLeaveDate(text: string): string | null {
  const normalized = String(text || '').toLowerCase();
  const months: Record<string, string> = {
    january: '01',
    february: '02',
    march: '03',
    april: '04',
    may: '05',
    june: '06',
    july: '07',
    august: '08',
    september: '09',
    october: '10',
    november: '11',
    december: '12',
  };
  let match = normalized.match(
    /(\d{1,2})\s+(january|february|march|april|may|june|july|august|september|october|november|december)\s*(\d{4})?/i,
  );
  if (match) {
    const day = match[1].padStart(2, '0');
    const month = months[match[2].toLowerCase()];
    const year = match[3] || String(new Date().getFullYear());
    return `${year}-${month}-${day}`;
  }
  match = normalized.match(/(\d{4})-(\d{2})-(\d{2})/);
  if (match) return `${match[1]}-${match[2]}-${match[3]}`;
  return null;
}
 
export function formatLeaveRange(startDate: string, endDate: string): string {
  return startDate === endDate ? startDate : `${startDate} to ${endDate}`;
}
 
export function formatDayCount(duration: number): string {
  return duration === 1 ? '1 day' : `${duration} days`;
}
 
export function getTodayInfo(): string {
  const now = new Date();
  const dateText = now.toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const timeText = now.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  });
  return `Today is ${dateText}. Current time is ${timeText}.`;
}