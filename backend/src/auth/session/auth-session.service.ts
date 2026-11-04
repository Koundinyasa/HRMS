import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHash } from 'crypto';
import * as sql from 'mssql';
import { DatabaseService } from '../../database/database.service';
import { describeDevice } from './device-name';

export type RotateCode =
  | 'OK'
  | 'INVALID'
  | 'REVOKED'
  | 'EXPIRED'
  | 'RACE'
  | 'REUSED'
  | 'BAD_REQUEST';

export interface SessionMeta {
  ip?: string | null;
  userAgent?: string | null;
}

export interface RotateResult {
  code: RotateCode;
  employeeId?: string;
  familyId?: string;
  /** Why the login is over (replaced, logout, expired, idle, ...); set when code is not OK. */
  reason?: string;
  /** Seconds left on the login; set when code is OK. */
  timing?: SessionTiming;
}

/** Whether a login is still usable and, if not, why it ended. */
export interface SessionState {
  active: boolean;
  reason?: string;
  /** When the 30-minute limit is reached (ms since epoch, this server's clock). */
  absoluteExpiresAtMs?: number;
  /** When the idle window runs out unless the browser refreshes (ms since epoch). */
  idleExpiresAtMs?: number;
}

/**
 * Seconds left on a login. Sent to the browser as a duration, never as a
 * clock time, so the browser's clock does not matter.
 */
export interface SessionTiming {
  /** Until the absolute limit: the login always ends then. */
  expiresInSeconds: number;
  /** Until the idle window ends unless the user is active and refreshes. */
  idleExpiresInSeconds: number;
}

/**
 * Login sessions, stored by the USP_Auth_* procedures.
 *
 * A login is a "family" (familyId, carried in the access token as `sid`).
 * Each refresh swaps the family's refresh token for a new one. Only a hash of
 * the refresh token is stored.
 *
 * isActive() is called on every authenticated request, so its answer is cached
 * in memory for a short time (auth.sessionCacheSeconds, default 30). Logging
 * out or revoking on this server takes effect immediately; on another server
 * instance it takes effect within that window. A cached "active" answer is
 * never used past the login's own absolute or idle expiry.
 *
 * Rules: one login per employee (a new sign-in ends the old one), 30 minutes
 * at most, and the idle window only slides when the browser refreshes.
 */
@Injectable()
export class AuthSessionService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(AuthSessionService.name);
  private readonly cache = new Map<string, { state: SessionState; until: number }>();
  private readonly cacheMs: number;
  private static readonly CACHE_MAX_ENTRIES = 20000;

  private readonly rulesNote: string;

  private readonly purgeEnabled: boolean;
  private readonly purgeIntervalMs: number;
  private readonly purgeRetentionDays: number;
  private purgeTimer?: NodeJS.Timeout;
  private purgeRunning = false;
  // First purge shortly after start-up, so a restart never skips a day.
  private static readonly FIRST_PURGE_DELAY_MS = 2 * 60 * 1000;

  constructor(
    private readonly db: DatabaseService,
    config: ConfigService,
  ) {
    this.cacheMs = (config.get<number>('auth.sessionCacheSeconds') ?? 30) * 1000;
    // Shown once at start-up, so it is obvious which limits this backend runs
    // with (a changed .env only takes effect after a restart).
    this.rulesNote =
      `Session rules: ${config.get<number>('auth.sessionAbsoluteMinutes')} min absolute limit, ` +
      `${config.get<number>('auth.sessionIdleMinutes')} min idle window, ` +
      `access token ${config.get<string>('auth.accessTtl')}, one login per account.`;
    this.purgeEnabled = config.get<boolean>('auth.sessionPurge.enabled') ?? true;
    this.purgeIntervalMs =
      (config.get<number>('auth.sessionPurge.intervalHours') ?? 24) * 60 * 60 * 1000;
    this.purgeRetentionDays = config.get<number>('auth.sessionPurge.retentionDays') ?? 30;
  }

  onModuleInit(): void {
    this.logger.log(this.rulesNote);
    if (!this.purgeEnabled) {
      this.logger.log('Session purge is turned off (SESSION_PURGE_ENABLED=false).');
      return;
    }
    this.scheduleNextPurge(AuthSessionService.FIRST_PURGE_DELAY_MS);
  }

  onModuleDestroy(): void {
    if (this.purgeTimer) clearTimeout(this.purgeTimer);
  }

  private scheduleNextPurge(delayMs: number): void {
    this.purgeTimer = setTimeout(() => {
      void this.runPurge().finally(() => this.scheduleNextPurge(this.purgeIntervalMs));
    }, delayMs);
    // Never keep the process alive just for this timer.
    this.purgeTimer.unref();
  }

  private async runPurge(): Promise<void> {
    if (this.purgeRunning) return;
    this.purgeRunning = true;
    try {
      const deleted = await this.purgeExpired(this.purgeRetentionDays);
      this.logger.log(
        `Session purge: removed ${deleted} row(s) older than ${this.purgeRetentionDays} day(s).`,
      );
    } catch (error) {
      // A failed purge must never affect logins; try again next time.
      this.logger.error(`Session purge failed: ${(error as Error).message}`);
    } finally {
      this.purgeRunning = false;
    }
  }

  /** Deletes ended or expired session rows older than the retention period. */
  async purgeExpired(retentionDays: number): Promise<number> {
    const pool = await this.db.connect();
    const result = await pool
      .request()
      .input('RetentionDays', sql.Int, retentionDays)
      .input('BatchSize', sql.Int, 5000)
      .execute('USP_Auth_PurgeExpired');
    return Number(result.recordset?.[0]?.DeletedRows ?? 0);
  }

  static hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  /**
   * Starts a login. The employee's other live logins are ended in the same
   * database transaction (one login at a time). Returns how many were ended
   * and how long the new login lasts.
   */
  async createSession(params: {
    sessionId: string;
    familyId: string;
    employeeId: string;
    refreshToken: string;
    idleMinutes: number;
    absoluteMinutes: number;
    meta?: SessionMeta;
  }): Promise<{ replaced: number; timing: SessionTiming }> {
    const pool = await this.db.connect();
    const result = await pool
      .request()
      .input('SessionID', sql.UniqueIdentifier, params.sessionId)
      .input('FamilyID', sql.UniqueIdentifier, params.familyId)
      .input('EmployeeID', sql.VarChar(100), String(params.employeeId))
      .input('RefreshTokenHash', sql.Char(64), AuthSessionService.hashToken(params.refreshToken))
      .input('IdleMinutes', sql.Int, params.idleMinutes)
      .input('AbsoluteMinutes', sql.Int, params.absoluteMinutes)
      .input('IPAddress', sql.VarChar(45), this.clip(params.meta?.ip, 45))
      .input('UserAgent', sql.VarChar(300), this.clip(params.meta?.userAgent, 300))
      .input('DeviceName', sql.VarChar(100), describeDevice(params.meta?.userAgent))
      .execute('USP_Auth_CreateSession');

    const row = result.recordset?.[0];
    const status = Number(row?.StatusCode);

    if (status !== 200) {
      this.logger.error(`USP_Auth_CreateSession failed: ${JSON.stringify(row)}`);
      throw new ServiceUnavailableException('Could not start a session. Please try again.');
    }

    const replaced = Number(row.ReplacedCount ?? 0);
    // Logins just ended in the database are still "active" in this server's
    // cache; forget every cached answer so they stop working at once.
    if (replaced > 0) this.cache.clear();

    // Fall back to the configured lengths if the procedure is an old version
    // that does not report the seconds left.
    const timing = this.timingFromRow(row, params.idleMinutes * 60, params.absoluteMinutes * 60);
    this.remember(params.familyId, { active: true, ...this.expiryFields(timing) });

    return { replaced, timing };
  }

  async rotate(params: {
    oldRefreshToken: string;
    newSessionId: string;
    newRefreshToken: string;
    idleMinutes: number;
    meta?: SessionMeta;
  }): Promise<RotateResult> {
    const pool = await this.db.connect();
    const result = await pool
      .request()
      .input('OldRefreshTokenHash', sql.Char(64), AuthSessionService.hashToken(params.oldRefreshToken))
      .input('NewSessionID', sql.UniqueIdentifier, params.newSessionId)
      .input('NewRefreshTokenHash', sql.Char(64), AuthSessionService.hashToken(params.newRefreshToken))
      .input('IdleMinutes', sql.Int, params.idleMinutes)
      .input('IPAddress', sql.VarChar(45), this.clip(params.meta?.ip, 45))
      .input('UserAgent', sql.VarChar(300), this.clip(params.meta?.userAgent, 300))
      .execute('USP_Auth_RotateSession');

    const row = result.recordset?.[0];
    if (!row) {
      this.logger.error('USP_Auth_RotateSession returned no row');
      throw new ServiceUnavailableException('Could not refresh the session. Please try again.');
    }

    const code = String(row.Code) as RotateCode;
    const familyId = row.FamilyID ? String(row.FamilyID).toLowerCase() : undefined;
    const reason = row.RevokedReason != null ? String(row.RevokedReason) : undefined;

    let timing: SessionTiming | undefined;
    if (code === 'OK' && familyId) {
      timing = this.timingFromRow(row, params.idleMinutes * 60, undefined);
      this.remember(familyId, { active: true, ...this.expiryFields(timing) });
    } else if (code === 'REUSED' || code === 'REVOKED' || code === 'EXPIRED') {
      if (familyId) this.remember(familyId, { active: false, reason });
    }

    return {
      code,
      employeeId: row.EmployeeID != null ? String(row.EmployeeID) : undefined,
      familyId,
      reason: code === 'OK' ? undefined : reason,
      timing,
    };
  }

  /** True when HR sent a temporary password that has not been replaced yet. */
  async getMustChangePassword(employeeId: string): Promise<boolean> {
    try {
      const pool = await this.db.connect();
      const result = await pool
        .request()
        .input('EmployeeID', sql.VarChar(100), String(employeeId))
        .execute('USP_Auth_GetUserSecurity');
      return Boolean(result.recordset?.[0]?.MustChangePassword);
    } catch (error) {
      this.logger.error(
        `USP_Auth_GetUserSecurity failed: ${(error as Error).message}`,
      );
      throw new ServiceUnavailableException(
        'Could not check the account. Please try again.',
      );
    }
  }

  /** mustChange = true after a temporary password; false once the user chose their own. */
  async setMustChangePassword(
    employeeId: string,
    mustChange: boolean,
    passwordChanged = false,
  ): Promise<void> {
    const pool = await this.db.connect();
    const result = await pool
      .request()
      .input('EmployeeID', sql.VarChar(100), String(employeeId))
      .input('MustChange', sql.Bit, mustChange)
      .input('PasswordChanged', sql.Bit, passwordChanged)
      .execute('USP_Auth_SetMustChangePassword');

    const row = result.recordset?.[0];
    if (!row || Number(row.StatusCode) !== 200) {
      this.logger.error(`USP_Auth_SetMustChangePassword failed: ${JSON.stringify(row)}`);
      throw new ServiceUnavailableException('Could not save the password status. Please try again.');
    }
  }

  /** Forget a family locally (used when a refresh shows it is over). */
  markInactive(familyId: string, reason?: string): void {
    this.remember(String(familyId).toLowerCase(), { active: false, reason });
  }

  /** True while the login (family) has not been revoked or timed out. */
  async isActive(familyId: string): Promise<boolean> {
    return (await this.getState(familyId)).active;
  }

  /**
   * Whether the login is still usable and, when it is not, why it ended.
   * Cached for a short time (auth.sessionCacheSeconds).
   */
  async getState(familyId: string): Promise<SessionState> {
    const key = String(familyId).toLowerCase();
    const hit = this.cache.get(key);
    const now = Date.now();
    if (hit && hit.until > now) {
      const s = hit.state;
      // An "active" answer stops being believed the moment the login's own
      // expiry passes, however much of the cache time is left.
      if (
        !s.active ||
        ((s.absoluteExpiresAtMs ?? Infinity) > now && (s.idleExpiresAtMs ?? Infinity) > now)
      ) {
        return s;
      }
    }

    let state: SessionState;
    try {
      const pool = await this.db.connect();
      const result = await pool
        .request()
        .input('FamilyID', sql.UniqueIdentifier, key)
        .execute('USP_Auth_IsSessionActive');
      const row = result.recordset?.[0];
      const active = Boolean(row?.IsActive);
      state = {
        active,
        // No row = unknown login (for example purged): treat as timed out.
        reason: active ? undefined : row?.Reason ? String(row.Reason) : 'expired',
      };
      // Procedures older than 20261102 do not report the seconds left.
      if (active && row?.AbsoluteRemainingSeconds != null && row?.IdleRemainingSeconds != null) {
        Object.assign(state, this.expiryFields(this.timingFromRow(row, undefined, undefined)));
      }
    } catch (error) {
      this.logger.error(
        `Session check failed (are the USP_Auth_* procedures installed?): ${(error as Error).message}`,
      );
      throw new ServiceUnavailableException('Session check is unavailable. Please try again.');
    }

    this.remember(key, state);
    return state;
  }

  /**
   * Seconds left on a login, for the browser's countdown. Null when the login
   * is over. Uses the cached answer, which always carries its expiry.
   */
  async getTiming(familyId: string): Promise<SessionTiming | null> {
    const state = await this.getState(familyId);
    if (!state.active) return null;
    if (state.absoluteExpiresAtMs === undefined || state.idleExpiresAtMs === undefined) return null;
    const now = Date.now();
    return {
      expiresInSeconds: Math.max(0, Math.ceil((state.absoluteExpiresAtMs - now) / 1000)),
      idleExpiresInSeconds: Math.max(0, Math.ceil((state.idleExpiresAtMs - now) / 1000)),
    };
  }

  /** Ends a login. Returns how many logins were still active (0 = already over). */
  async revoke(familyId: string, reason = 'logout'): Promise<number> {
    const key = String(familyId).toLowerCase();
    const pool = await this.db.connect();
    const result = await pool
      .request()
      .input('FamilyID', sql.UniqueIdentifier, key)
      .input('Reason', sql.VarChar(30), reason)
      .execute('USP_Auth_RevokeSession');

    const count = Number(result.recordset?.[0]?.RevokedCount ?? 0);
    // Do not overwrite the real reason of a login that was already over.
    if (count > 0) this.remember(key, { active: false, reason });
    else this.cache.delete(key);
    return count;
  }

  /** Ends every login of an employee, optionally keeping one family. */
  async revokeAllForEmployee(
    employeeId: string,
    reason = 'password_changed',
    exceptFamilyId?: string,
  ): Promise<void> {
    const pool = await this.db.connect();
    await pool
      .request()
      .input('EmployeeID', sql.VarChar(100), String(employeeId))
      .input('Reason', sql.VarChar(30), reason)
      .input(
        'ExceptFamilyID',
        sql.UniqueIdentifier,
        exceptFamilyId ? String(exceptFamilyId).toLowerCase() : null,
      )
      .execute('USP_Auth_RevokeAllForEmployee');

    // We do not know which families were hit, so forget every cached answer.
    this.cache.clear();
  }

  private remember(familyId: string, state: SessionState): void {
    if (this.cache.size >= AuthSessionService.CACHE_MAX_ENTRIES) {
      const now = Date.now();
      for (const [id, entry] of this.cache) {
        if (entry.until <= now) this.cache.delete(id);
      }
      if (this.cache.size >= AuthSessionService.CACHE_MAX_ENTRIES) this.cache.clear();
    }
    this.cache.set(String(familyId).toLowerCase(), {
      state,
      until: Date.now() + this.cacheMs,
    });
  }

  /** Seconds left, read from a procedure row (with fallbacks for older procedures). */
  private timingFromRow(
    row: any,
    fallbackIdleSeconds: number | undefined,
    fallbackAbsoluteSeconds: number | undefined,
  ): SessionTiming {
    const num = (v: unknown, fb: number | undefined): number => {
      const n = Number(v);
      return v !== null && v !== undefined && Number.isFinite(n) ? n : (fb ?? 0);
    };
    return {
      expiresInSeconds: Math.max(0, num(row?.AbsoluteRemainingSeconds, fallbackAbsoluteSeconds)),
      idleExpiresInSeconds: Math.max(0, num(row?.IdleRemainingSeconds, fallbackIdleSeconds)),
    };
  }

  private expiryFields(
    timing: SessionTiming,
  ): Pick<SessionState, 'absoluteExpiresAtMs' | 'idleExpiresAtMs'> {
    const now = Date.now();
    return {
      absoluteExpiresAtMs: now + timing.expiresInSeconds * 1000,
      idleExpiresAtMs: now + timing.idleExpiresInSeconds * 1000,
    };
  }

  private clip(value: string | null | undefined, max: number): string | null {
    if (!value) return null;
    return String(value).slice(0, max);
  }
}
