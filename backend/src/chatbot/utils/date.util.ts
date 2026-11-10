import { levenshteinDistance } from './fuzzy.util';

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
 

export type DateTimeIntent =
  | 'CURRENT_DATE'
  | 'CURRENT_TIME'
  | 'CURRENT_DATETIME'
  | 'YESTERDAY_DATE'
  | 'TOMORROW_DATE'
  | 'CURRENT_DAY';

const BUSINESS_TIME_ZONE = 'Asia/Kolkata';

const DATE_TIME_KEYWORDS = [
  { canonical: 'today', aliases: ['tody'] },
  { canonical: 'current', aliases: ['curent'] },
  { canonical: 'yesterday', aliases: ['yestarday', 'yestaday'] },
  { canonical: 'tomorrow', aliases: ['tommorow', 'tomorow'] },
  { canonical: 'date', aliases: [] },
  { canonical: 'time', aliases: [] },
];

function normalizeDateTimeKeyword(token: string): string {
  for (const keyword of DATE_TIME_KEYWORDS) {
    if (
      keyword.canonical === token ||
      keyword.aliases.includes(token)
    ) {
      return keyword.canonical;
    }
  }

  let closest: { canonical: string; distance: number } | undefined;
  for (const { canonical } of DATE_TIME_KEYWORDS) {
    if (canonical.length < 4) continue;

    const distance = levenshteinDistance(token, canonical);
    if (distance <= 1 && (!closest || distance < closest.distance)) {
      closest = { canonical, distance };
    } else if (closest && distance === closest.distance) {
      closest = undefined;
    }
  }

  return closest?.canonical ?? token;
}

function normalizeDateTimeRequest(message: string): string {
  return String(message ?? '')
    .toLowerCase()
    .replace(/[’‘]/g, "'")
    .replace(/'/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeDateTimeKeywords(message: string): string {
  return normalizeDateTimeRequest(message)
    .split(' ')
    .map(normalizeDateTimeKeyword)
    .join(' ');
}

function isPersonalDateRequest(normalized: string): boolean {
  return /\b(my|mine|birth|joining|leaving|leave|previous|prior|start|end)\b/.test(
    normalized,
  );
}

function matchesDateTimeRequest(normalized: string, phrase: RegExp): boolean {
  const prefix =
    /^(?:(?:can|could|would)\s+you\s+)?(?:please\s+)?(?:(?:tell|show|give)\s+me\s+)?/;
  const suffix = /[?!.]*$/;
  return new RegExp(
    `${prefix.source}(?:what\\s+(?:is|was)\\s+)?(?:the\\s+)?${phrase.source}${suffix.source}`,
  ).test(normalized);
}

export function detectDateTimeIntent(message: string): DateTimeIntent | null {
  const normalized = normalizeDateTimeKeywords(message);
  if (!normalized || isPersonalDateRequest(normalized)) return null;

  if (
    matchesDateTimeRequest(
      normalized,
      /(?:today\s+current\s+time|today\s+date\s+and\s+time|current\s+date\s+and\s+time|date\s+and\s+time\s+now|current\s+date\s+time|date\s+time\s+now)/,
    )
  ) {
    return 'CURRENT_DATETIME';
  }
  if (
    matchesDateTimeRequest(
      normalized,
      /(?:yesterday|yesterday\s+date|date\s+yesterday|what\s+date\s+was\s+yesterday|what\s+was\s+yesterday(?:s)?\s+date|yesterdays\s+date)/,
    )
  ) {
    return 'YESTERDAY_DATE';
  }
  if (
    matchesDateTimeRequest(
      normalized,
      /(?:tomorrow|tomorrow\s+date|date\s+tomorrow|what\s+date\s+is\s+tomorrow|what\s+is\s+tomorrow(?:s)?\s+date|tomorrows\s+date)/,
    )
  ) {
    return 'TOMORROW_DATE';
  }
  if (
    matchesDateTimeRequest(
      normalized,
      /(?:today|today\s+date|date\s+today|todays\s+date|current\s+date|what\s+date\s+is\s+it(?:\s+today)?|what\s+date\s+is\s+today|what\s+is\s+(?:the\s+)?(?:today(?:s)?\s+date|date\s+today|current\s+date))/,
    )
  ) {
    return 'CURRENT_DATE';
  }
  if (
    matchesDateTimeRequest(
      normalized,
      /(?:time|today\s+time|current\s+time|time\s+now|what\s+time\s+is\s+it|what\s+is\s+(?:the\s+)?(?:current\s+time|time\s+now))/,
    )
  ) {
    return 'CURRENT_TIME';
  }
  if (
    matchesDateTimeRequest(
      normalized,
      /(?:today\s+day|day\s+today|current\s+day|what\s+day\s+is\s+today|what\s+day\s+is\s+it(?:\s+today)?|what\s+is\s+(?:the\s+)?current\s+day)/,
    )
  ) {
    return 'CURRENT_DAY';
  }

  return null;
}

export function isCurrentDateRequest(message: string): boolean {
  return detectDateTimeIntent(message) === 'CURRENT_DATE';
}

function getDateParts(date: Date): { year: number; month: number; day: number } {
  const parts = new Intl.DateTimeFormat('en-CA', {
    calendar: 'gregory',
    timeZone: BUSINESS_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);
  const value = (type: 'year' | 'month' | 'day') =>
    Number(parts.find((part) => part.type === type)?.value);
  return { year: value('year'), month: value('month'), day: value('day') };
}

function formatBusinessDate(date: Date): string {
  return new Intl.DateTimeFormat('en-IN', {
    calendar: 'gregory',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: BUSINESS_TIME_ZONE,
  }).format(date);
}

function formatBusinessTime(date: Date): string {
  return new Intl.DateTimeFormat('en-IN', {
    hour: 'numeric',
    minute: '2-digit',
    hourCycle: 'h12',
    timeZone: BUSINESS_TIME_ZONE,
  }).format(date);
}

function formatBusinessDay(date: Date): string {
  return new Intl.DateTimeFormat('en-IN', {
    calendar: 'gregory',
    weekday: 'long',
    timeZone: BUSINESS_TIME_ZONE,
  }).format(date);
}

function shiftBusinessDate(date: Date, amount: number): Date {
  const { year, month, day } = getDateParts(date);
  return new Date(Date.UTC(year, month - 1, day + amount, 12));
}

export function getDateTimeResponse(
  intent: DateTimeIntent,
  now: Date = new Date(),
): string {
  const today = shiftBusinessDate(now, 0);
  const todayText = formatBusinessDate(today);

  switch (intent) {
    case 'CURRENT_DATE':
      return `Today's date is ${todayText}.`;
    case 'CURRENT_TIME':
      return `The current time is ${formatBusinessTime(now)}.`;
    case 'CURRENT_DATETIME':
      return `Today's date and time is ${todayText}, ${formatBusinessTime(now)}.`;
    case 'YESTERDAY_DATE':
      return `Yesterday's date was ${formatBusinessDate(shiftBusinessDate(now, -1))}.`;
    case 'TOMORROW_DATE':
      return `Tomorrow's date will be ${formatBusinessDate(shiftBusinessDate(now, 1))}.`;
    case 'CURRENT_DAY':
      return `Today is ${formatBusinessDay(today)}, ${todayText}.`;
  }
}

export function getCurrentDate(): string {
  return getDateTimeResponse('CURRENT_DATE');
}

export function getTodayInfo(): string {
  return getDateTimeResponse('CURRENT_DATETIME');
}
