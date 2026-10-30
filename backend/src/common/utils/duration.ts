/**
 * Turns a setting such as "15m", "24h", "7d", "90s" or a bare number of
 * seconds into milliseconds. Throws on anything else so a typo in .env stops
 * the app at startup instead of silently producing a wrong lifetime.
 */
export function parseDurationToMs(value: string | number): number {
  const match = /^(\d+)\s*([smhd])?$/i.exec(String(value).trim());
  if (!match) {
    throw new Error(
      `Invalid duration "${value}". Use for example 15m, 24h, 7d, or a number of seconds.`,
    );
  }

  const amount = parseInt(match[1], 10);
  const unit = (match[2] ?? 's').toLowerCase();
  const perUnit: Record<string, number> = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
  };

  return amount * perUnit[unit];
}
