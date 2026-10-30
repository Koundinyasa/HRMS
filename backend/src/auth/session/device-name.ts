/**
 * A short, human-readable name for a browser, such as "Chrome on Windows",
 * taken from the User-Agent header. Shown to users and admins, never used for
 * any decision.
 */
export function describeDevice(userAgent?: string | null): string | null {
  if (!userAgent) return null;
  const ua = String(userAgent);

  let browser = 'Browser';
  if (/Edg(e|A|iOS)?\//.test(ua)) browser = 'Edge';
  else if (/OPR\/|Opera/.test(ua)) browser = 'Opera';
  else if (/Firefox\/|FxiOS\//.test(ua)) browser = 'Firefox';
  else if (/Chrome\/|CriOS\//.test(ua)) browser = 'Chrome';
  else if (/Safari\//.test(ua)) browser = 'Safari';

  let os = '';
  if (/Windows/.test(ua)) os = 'Windows';
  else if (/Android/.test(ua)) os = 'Android';
  else if (/iPhone|iPad|iPod/.test(ua)) os = 'iOS';
  else if (/Mac OS X|Macintosh/.test(ua)) os = 'macOS';
  else if (/Linux|X11/.test(ua)) os = 'Linux';

  return (os ? `${browser} on ${os}` : browser).slice(0, 100);
}
