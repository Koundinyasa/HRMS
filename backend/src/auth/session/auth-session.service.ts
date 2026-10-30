import {
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHash } from 'crypto';
import * as sql from 'mssql';
import { DatabaseService } from '../../database/database.service';

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
 * instance it takes effect within that window.
 */
@Injectable()
export class AuthSessionService {
  private readonly logger = new Logger(AuthSessionService.name);
  private readonly cache = new Map<string, { active: boolean; until: number }>();
  private readonly cacheMs: number;
  private static readonly CACHE_MAX_ENTRIES = 20000;

  constructor(
    private readonly db: DatabaseService,
    config: ConfigService,
  ) {
    this.cacheMs = (config.get<number>('auth.sessionCacheSeconds') ?? 30) * 1000;
  }

  static hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  async createSession(params: {
    sessionId: string;
    familyId: string;
    employeeId: string;
    refreshToken: string;
    idleMinutes: number;
    absoluteMinutes: number;
    meta?: SessionMeta;
  }): Promise<void> {
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
      .execute('USP_Auth_CreateSession');

    const row = result.recordset?.[0];
    if (!row || Number(row.StatusCode) !== 200) {
      this.logger.error(`USP_Auth_CreateSession failed: ${JSON.stringify(row)}`);
      throw new ServiceUnavailableException('Could not start a session. Please try again.');
    }

    this.remember(params.familyId, true);
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

    if (code === 'OK' && familyId) {
      this.remember(familyId, true);
    } else if (code === 'REUSED' || code === 'REVOKED' || code === 'EXPIRED') {
      if (familyId) this.remember(familyId, false);
    }

    return {
      code,
      employeeId: row.EmployeeID != null ? String(row.EmployeeID) : undefined,
      familyId,
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
  markInactive(familyId: string): void {
    this.remember(String(familyId).toLowerCase(), false);
  }

  /** True while the login (family) has not been revoked or timed out. */
  async isActive(familyId: string): Promise<boolean> {
    const key = String(familyId).toLowerCase();
    const hit = this.cache.get(key);
    if (hit && hit.until > Date.now()) return hit.active;

    let active: boolean;
    try {
      const pool = await this.db.connect();
      const result = await pool
        .request()
        .input('FamilyID', sql.UniqueIdentifier, key)
        .execute('USP_Auth_IsSessionActive');
      active = Boolean(result.recordset?.[0]?.IsActive);
    } catch (error) {
      this.logger.error(
        `Session check failed (are the USP_Auth_* procedures installed?): ${(error as Error).message}`,
      );
      throw new ServiceUnavailableException('Session check is unavailable. Please try again.');
    }

    this.remember(key, active);
    return active;
  }

  async revoke(familyId: string, reason = 'logout'): Promise<void> {
    const key = String(familyId).toLowerCase();
    const pool = await this.db.connect();
    await pool
      .request()
      .input('FamilyID', sql.UniqueIdentifier, key)
      .input('Reason', sql.VarChar(30), reason)
      .execute('USP_Auth_RevokeSession');

    this.remember(key, false);
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

  private remember(familyId: string, active: boolean): void {
    if (this.cache.size >= AuthSessionService.CACHE_MAX_ENTRIES) {
      const now = Date.now();
      for (const [id, entry] of this.cache) {
        if (entry.until <= now) this.cache.delete(id);
      }
      if (this.cache.size >= AuthSessionService.CACHE_MAX_ENTRIES) this.cache.clear();
    }
    this.cache.set(String(familyId).toLowerCase(), {
      active,
      until: Date.now() + this.cacheMs,
    });
  }

  private clip(value: string | null | undefined, max: number): string | null {
    if (!value) return null;
    return String(value).slice(0, max);
  }
}
