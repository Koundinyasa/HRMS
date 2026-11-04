import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { CookieOptions, Response } from 'express';
import { parseDurationToMs } from '../common/utils/duration';

export const ACCESS_COOKIE = 'access_token';
export const REFRESH_COOKIE = 'refresh_token';
// The refresh cookie is only ever sent to the auth routes.
const REFRESH_COOKIE_PATH = '/api/auth';

/**
 * The one place that sets and clears the login cookies, so the flags used
 * when setting a cookie always match the flags used when clearing it
 * (a cookie cleared with different flags is not removed by the browser).
 */
@Injectable()
export class AuthCookieService {
  private readonly secure: boolean;
  private readonly accessMaxAgeMs: number;
  private readonly refreshMaxAgeMs: number;

  constructor(config: ConfigService) {
    this.secure = config.get<boolean>('auth.cookieSecure') === true;
    this.accessMaxAgeMs = parseDurationToMs(
      config.get<string>('auth.accessTtl') ?? '15m',
    );
    this.refreshMaxAgeMs =
      (config.get<number>('auth.sessionAbsoluteMinutes') ?? 1440) * 60 * 1000;
  }

  private base(): CookieOptions {
    return { httpOnly: true, secure: this.secure, sameSite: 'lax' };
  }

  setAccess(res: Response, token: string): void {
    res.cookie(ACCESS_COOKIE, token, {
      ...this.base(),
      path: '/',
      maxAge: this.accessMaxAgeMs,
    });
  }

  setRefresh(res: Response, token: string): void {
    res.cookie(REFRESH_COOKIE, token, {
      ...this.base(),
      path: REFRESH_COOKIE_PATH,
      maxAge: this.refreshMaxAgeMs,
    });
  }

  clear(res: Response): void {
    res.clearCookie(ACCESS_COOKIE, { ...this.base(), path: '/' });
    res.clearCookie(REFRESH_COOKIE, { ...this.base(), path: REFRESH_COOKIE_PATH });
  }
}
