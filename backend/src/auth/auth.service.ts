import { Injectable, Logger, UnauthorizedException,NotFoundException,BadRequestException,ForbiddenException,ConflictException,InternalServerErrorException,HttpException,HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as sql from 'mssql';
import * as bcrypt from 'bcrypt';
import { DatabaseService } from '../database/database.service';
import { JwtService } from '@nestjs/jwt';
import { MailService } from '../mail/mail.service';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { CaptchaService } from './captcha/captcha.service';
import { LoginDto } from './dto/login.dto';
import { ResetForgotPasswordDto } from './dto/reset-forgot-password.dto';
import { randomBytes, randomInt, randomUUID } from 'crypto';
import { SessionBoundaryEvents } from './session-boundary.events';
import { ChangePasswordDto } from './dto/change-password.dto';
import { SendWishDto } from './dto/SendWish.dto';
import { AuthSessionService, SessionMeta } from './session/auth-session.service';
@Injectable()
export class AuthService {
  constructor(
    private readonly dbService: DatabaseService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    private readonly captchaService: CaptchaService,
    private readonly boundary: SessionBoundaryEvents,
    private readonly sessions: AuthSessionService,
    private readonly config: ConfigService,
  ) { }

  private readonly logger = new Logger(AuthService.name);

  // ── Login sessions ──────────────────────────────────────────────────────
  // A login is a "session family". The access token carries its id as `sid`;
  // the refresh token (purpose 'refresh') is swapped for a new one on every
  // refresh and only its hash is stored (see AuthSessionService).
  private static readonly REFRESH_PURPOSE = 'refresh';

  private get idleMinutes(): number {
    return this.config.get<number>('auth.sessionIdleMinutes') ?? 60;
  }

  private get absoluteMinutes(): number {
    return this.config.get<number>('auth.sessionAbsoluteMinutes') ?? 1440;
  }

  // True when this login must change its password before doing anything else:
  // never logged in before, or HR sent a temporary password (AuthUserSecurity).
  private async mustChangePassword(user: any): Promise<boolean> {
    if (user.LastLoginDateTime === null) return true;
    return this.sessions.getMustChangePassword(String(user.EmployeeID));
  }

  // USP_UpdatePassword reports through an OUT parameter (@Result: 1 = done,
  // 0 = employee not found, 2 = bad flag) and, on a SQL error, a row with
  // StatusCode >= 400. The old code ignored both and reported success.
  private async updatePassword(
    pool: sql.ConnectionPool,
    employeeId: string,
    passwordHash: string,
    flag: 1 | 2,
    modifiedBy: string,
  ): Promise<void> {
    const result = await pool
      .request()
      .input('EmployeeID', employeeId)
      .input('PasswordHash', passwordHash)
      .input('flag', flag)
      .input('Modifiedby', modifiedBy)
      .output('Result', sql.Int)
      .execute('USP_UpdatePassword');

    const row = result.recordset?.[0];
    if (row && Number(row.StatusCode) >= 400) {
      this.logger.error(`USP_UpdatePassword failed for ${employeeId}: ${JSON.stringify(row)}`);
      throw new InternalServerErrorException('Could not update the password. Please try again.');
    }
    if (result.output?.Result !== 1) {
      this.logger.error(
        `USP_UpdatePassword did not update ${employeeId} (Result=${result.output?.Result})`,
      );
      throw new InternalServerErrorException('Could not update the password. Please try again.');
    }
  }

  // Everything that must follow a password change the user made themselves.
  private async afterOwnPasswordChange(
    employeeId: string,
    keepFamilyId?: string,
  ): Promise<void> {
    await this.sessions.setMustChangePassword(employeeId, false, true);
    await this.sessions.revokeAllForEmployee(employeeId, 'password_changed', keepFamilyId);
  }

  private buildAccessClaims(user: any, familyId: string, mustChange = false) {
    return {
      employeeId: user.EmployeeID,
      userId: user.UserID,
      roleId: user.RoleID,
      companyId: user.CompanyID,
      createdBy: user.Sessionuserid,
      name: user.FullName,
      role:
        user.RoleID === 1 ? 'admin' : user.RoleID === 2 ? 'hr' : 'employee',
      sid: familyId,
      // Present only while the password must be changed; see JwtAuthGuard.
      ...(mustChange ? { mcp: true } : {}),
    };
  }

  private signRefreshToken(user: any, familyId: string): string {
    return this.jwtService.sign(
      {
        purpose: AuthService.REFRESH_PURPOSE,
        sub: String(user.EmployeeID),
        uid: String(user.UserID),
        sid: familyId,
      },
      { expiresIn: this.absoluteMinutes * 60, jwtid: randomUUID() },
    );
  }

  private isLocked(user: any): boolean {
    return user.IsAccountLocked === true || user.IsAccountLocked === 1;
  }
  // ── Password-reset proof token ──────────────────────────────────────────
  // Issued only after USP_VerifyOTP succeeds. The reset step refuses to run
  // without it. It is a short-lived JWT carrying `purpose`, so the global
  // JwtAuthGuard rejects it if anyone tries to use it as a login session.
  // Single-use is enforced with this in-memory set, which is enough for one
  // server instance. Moving to several instances needs a shared store (the
  // session table planned in Phase 1B).
  private static readonly RESET_PURPOSE = 'password-reset';
  private static readonly RESET_TTL = '10m';
  private readonly usedResetTokens = new Map<string, number>(); // jti -> exp (ms)

  // `sub` is the employee, `uid` the login id (UserID). The reset step reads
  // both from here, so the browser never has to send (or know) either.
  issueResetToken(employeeId: string, userId: string): string {
    return this.jwtService.sign(
      { purpose: AuthService.RESET_PURPOSE, sub: String(employeeId), uid: String(userId) },
      { expiresIn: AuthService.RESET_TTL, jwtid: randomUUID() },
    );
  }

  private verifyResetToken(
    token: string | undefined,
  ): { sub: string; uid: string; jti: string; exp: number } {
    if (!token) {
      throw new UnauthorizedException(
        'Password reset session not found. Please verify your OTP again.',
      );
    }

    let payload: any;
    try {
      payload = this.jwtService.verify(token);
    } catch {
      throw new UnauthorizedException(
        'Password reset session expired. Please verify your OTP again.',
      );
    }

    if (
      payload?.purpose !== AuthService.RESET_PURPOSE ||
      !payload.sub ||
      !payload.uid ||
      !payload.jti
    ) {
      throw new UnauthorizedException(
        'Password reset session is not valid. Please verify your OTP again.',
      );
    }

    if (this.usedResetTokens.has(payload.jti)) {
      throw new UnauthorizedException(
        'Password reset session was already used. Please verify your OTP again.',
      );
    }

    return {
      sub: String(payload.sub),
      uid: String(payload.uid),
      jti: payload.jti,
      exp: Number(payload.exp) * 1000,
    };
  }

  private markResetTokenUsed(jti: string, expMs: number): void {
    const now = Date.now();
    // Drop entries whose tokens have expired anyway.
    for (const [id, exp] of this.usedResetTokens) {
      if (exp < now) this.usedResetTokens.delete(id);
    }
    this.usedResetTokens.set(jti, expMs);
  }

  // ── OTP attempt cap ─────────────────────────────────────────────────────
  // USP_VerifyOTP is not under our control (its source is not in the repo),
  // so the cap is enforced here: after OTP_MAX_ATTEMPTS wrong codes for one
  // employee, further tries are refused for OTP_LOCK_MS. In memory, so it is
  // per server instance and resets on restart (the shared store arrives with
  // the session table in Phase 1B). A person who wrongly guesses someone
  // else's OTP can lock that employee out of forgot-password for 15 minutes;
  // that is the accepted trade-off against brute-forcing a 6-digit code.
  private static readonly OTP_MAX_ATTEMPTS = 5;
  private static readonly OTP_LOCK_MS = 15 * 60 * 1000;
  private readonly otpFailures = new Map<string, { count: number; since: number }>();

  private assertOtpNotLocked(key: string): void {
    const entry = this.otpFailures.get(key);
    if (!entry) return;

    if (Date.now() - entry.since > AuthService.OTP_LOCK_MS) {
      this.otpFailures.delete(key);
      return;
    }

    if (entry.count >= AuthService.OTP_MAX_ATTEMPTS) {
      throw new HttpException(
        'Too many incorrect OTP attempts. Please try again in 15 minutes.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }
  }

  // Wrong guesses for a user ID that does not exist are counted too (under an
  // "unknown:" key), so the lock-out message cannot be used to tell real
  // accounts from made-up ones. That map is capped so nobody can fill the
  // server's memory with invented IDs.
  private static readonly OTP_TRACKED_MAX = 5000;

  private recordOtpFailure(key: string): void {
    const now = Date.now();
    const entry = this.otpFailures.get(key);

    if (!entry || now - entry.since > AuthService.OTP_LOCK_MS) {
      if (this.otpFailures.size >= AuthService.OTP_TRACKED_MAX) {
        for (const [k, v] of this.otpFailures) {
          if (now - v.since > AuthService.OTP_LOCK_MS) this.otpFailures.delete(k);
        }
        if (this.otpFailures.size >= AuthService.OTP_TRACKED_MAX && key.startsWith('unknown:')) {
          return;
        }
      }
      this.otpFailures.set(key, { count: 1, since: now });
      return;
    }
    entry.count += 1;
  }

  // A login (or logout) is a hard session boundary. Other modules (the
  // chatbot drops a half-finished "apply leave" flow, for example) listen for
  // it, so a new session never resumes a stale one. See SessionBoundaryEvents.
  private clearChatbotState(employeeId: string): void {
    this.boundary.emit(employeeId);
  }
 
  // ================= LOGIN =================
 
  async login(dto: LoginDto, meta: SessionMeta = {}) {
    try {
      const captchaValid = this.captchaService.validate(
        dto.captchaId,
        dto.captchaAnswer,
      );
 
      if (!captchaValid) {
        throw new BadRequestException(
          'Invalid or expired captcha. Please refresh and try again.',
        );
      }
 
      const pool = await this.dbService.connect();
 
      const result = await pool
        .request()
        .input('EmailID', dto.userId)
        .execute('USP_Validateuser');
 
      const user = result.recordset[0];
 
      if (!user) {
        throw new UnauthorizedException('Invalid UserID or Password');
      }
 
      if (
        user.IsAccountLocked === true ||
        user.IsAccountLocked === 1
      ) {
        throw new UnauthorizedException(
          'Account is locked. Contact administrator.',
        );
      }
 
      const isPasswordValid = await bcrypt.compare(
        dto.password,
        user.PasswordHash,
      );
 
      if (!isPasswordValid) {
        await pool
          .request()
          .input('EmployeeID', user.EmployeeID)
          .input('flag', 1)
          .execute('USP_UpdateLoginInfo');
 
        throw new UnauthorizedException(
          'Invalid UserID or Password',
        );
      }
 
      const isFirstLogin = user.LastLoginDateTime === null;
 
      // update login ONLY after first login is completed
      if (!isFirstLogin) {
        await pool
          .request()
          .input('EmployeeID', user.EmployeeID)
          .input('flag', 2)
          .execute('USP_UpdateLoginInfo');
      }
 
      // Start the session, then sign the tokens that belong to it.
      const familyId = randomUUID();
      const refreshToken = this.signRefreshToken(user, familyId);

      await this.sessions.createSession({
        sessionId: randomUUID(),
        familyId,
        employeeId: String(user.EmployeeID),
        refreshToken,
        idleMinutes: this.idleMinutes,
        absoluteMinutes: this.absoluteMinutes,
        meta,
      });

      const mustChange = await this.mustChangePassword(user);

      const accessToken = this.jwtService.sign(
        this.buildAccessClaims(user, familyId, mustChange),
      );
 
      let loginMessage = 'Login successful';
 
      if (user.RoleID === 1) {
        loginMessage = 'Super Admin login successful';
      } else if (user.RoleID === 2) {
        loginMessage = 'HR Admin login successful';
      }
 
      // Fresh session boundary — wipe any chatbot flow left over
      // from a previous session for this employee.
      this.clearChatbotState(String(user.EmployeeID));
 
      return {
        success: true,
        message: loginMessage,
        // Both tokens go into httpOnly cookies; the controller removes them
        // from the response body.
        accessToken,
        refreshToken,
        // True for a first login and for a temporary password sent by HR.
        mustChangePassword: mustChange,
        data: {
          employeeId: user.EmployeeID,
          userId: user.UserID,
          roleId: user.RoleID,
        },
      };
    } catch (error) {
      throw error;
    }
  }
 
  // ================= VERIFY COMPANY =================
 async verifyCompany(tenantCode: string) {
  try {
    const pool = await this.dbService.connect();
 
    const result = await pool
      .request()
      .execute('USP_GetCompanyInfo');
 
    const company = result.recordset.find(
      (x) => x.DomainName?.toLowerCase() === tenantCode?.toLowerCase(),
    );
 
    if (!company) {
      throw new NotFoundException('Company not found');
    }
 
    return {
      exists: true,
      companyId: company.CompanyID,
      companyName: company.CompanyCode,
      domain: company.DomainName,
    };
  } catch (error) {
    throw error;
  }
}
 
 
 
  // ================= RESET PASSWORD =================
 
  async resetPassword(
    userId: string,
    dto: ResetPasswordDto,
  ) {
    try {
      const pool = await this.dbService.connect();
 
      // Get user using UserID (email)
      const result = await pool
        .request()
        .input('EmailID', userId.trim())
        .execute('USP_Validateuser');
 
      const user = result.recordset?.[0];
 
      if (!user) {
        throw new BadRequestException('User not found');
      }
 
      // Allowed on first login, or while HR's temporary password is still set.
      if (
        user.LastLoginDateTime !== null &&
        !(await this.sessions.getMustChangePassword(String(user.EmployeeID)))
      ) {
        throw new ForbiddenException(
          'Password reset is allowed only on first login',
        );
      }
 
      // Validate current password
      const isMatch = await bcrypt.compare(
        dto.currentPassword,
        user.PasswordHash,
      );
 
      if (!isMatch) {
        throw new BadRequestException(
          'Current password is incorrect',
        );
      }
 
      // Prevent same password reuse
      const samePassword = await bcrypt.compare(
        dto.newPassword,
        user.PasswordHash,
      );
 
      if (samePassword) {
        throw new BadRequestException(
          'New password must be different from current password',
        );
      }
 
      // Confirm password check
      if (dto.newPassword !== dto.confirmPassword) {
        throw new BadRequestException(
          'Passwords do not match',
        );
      }
 
      // Hash new password
      const hashedPassword = await bcrypt.hash(
        dto.newPassword,
        10,
      );
      // USP_UpdatePassword expects EmployeeID
      await this.updatePassword(pool, user.EmployeeID, hashedPassword, 1, user.EmployeeID);

      // STEP 2: Mark first login completed
      await this.updatePassword(pool, user.EmployeeID, hashedPassword, 2, user.EmployeeID);

      // The new password is the user's own: clear the "must change" flag and
      // end every login, this one included. The caller is sent to the login
      // page (the controller clears the cookies).
      await this.afterOwnPasswordChange(String(user.EmployeeID));

      return {
        success: true,
        message: 'Password reset successfully',
      };
    } catch (error) {
      throw error;
    }
  }
 
  // ================= TEMP PASSWORD =================
 
  private generateTempPassword(length = 10): string {
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%';
 
    const bytes = randomBytes(length);
 
    return Array.from(bytes)
      .map((b) => chars[b % chars.length])
      .join('');
  }
 
  async sendTemporaryPassword(employeeId: string) {
    try {
      const pool = await this.dbService.connect();
 
      const result = await pool
        .request()
        .input('EmployeeID', employeeId)
        .execute('USP_GetUserInfo');
 
      const user = result.recordset[0];
 
      if (!user) {
      throw new NotFoundException('User not found');
      }
 
      const tempPassword = this.generateTempPassword();
 
      const hashedPassword = await bcrypt.hash(tempPassword, 10);
 
      await this.updatePassword(pool, employeeId, hashedPassword, 1, 'SYSTEM');

      // The temporary password is known to HR and was sent by email: the
      // owner must replace it at the next login, and anyone logged in with the
      // old password is signed out.
      await this.sessions.setMustChangePassword(String(employeeId), true);
      await this.sessions.revokeAllForEmployee(String(employeeId), 'admin_reset');

      await this.mailService.sendTempPassword(user.Email, tempPassword,user.ApplicationURL);
      return {
        success: true,
        message: 'Temporary password sent successfully',
      };
    } catch (error) {
      throw error;
    }
  }
 
  // async testMail() {
  //   return this.mailService.sendTempPassword(
  //     'test@gmail.com',
  //     'TEST1234',
  //   );
  // }
 
  // async testMail() {
  //   return this.mailService.sendTempPassword(
  //     'test@gmail.com',
  //     'TEST1234',
  //   );
  // }
 
 
  // crypto.randomInt is cryptographically secure; Math.random is predictable.
  private generateOtp(): string {
    return randomInt(100000, 1000000).toString();
  }
 
 
  // ── Forgot password ─────────────────────────────────────────────────────
  // Step 1 of 3. The answer is the same whether or not the user ID exists (and
  // whether or not the e-mail could be sent), so this endpoint cannot be used
  // to find out who has an account. The OTP only ever travels by e-mail, and
  // the browser is never told the employee id.
  private static readonly OTP_VALID_SECONDS = 180;
  private static readonly OTP_ERROR = 'Invalid or expired OTP.';

  async forgotPassword(userId: string) {
    const pool = await this.dbService.connect();

    const result = await pool
      .request()
      .input('EmailID', userId.trim())
      .execute('USP_Validateuser');

    const user = result.recordset?.[0];

    const answer = {
      success: true,
      message:
        'If this user ID is registered, an OTP has been sent to its e-mail address.',
      remainingSeconds: AuthService.OTP_VALID_SECONDS,
      remainingMinutes: AuthService.OTP_VALID_SECONDS / 60,
    };

    if (!user) return answer;

    // A locked account cannot unlock itself through e-mail: only the
    // administrator can. The answer stays the same, so nobody can tell from
    // the response that this account is locked; no OTP is created or mailed.
    if (this.isLocked(user)) {
      this.logger.warn(
        `Forgot password ignored: account of employee ${user.EmployeeID} is locked`,
      );
      return answer;
    }

    try {
      const otp = this.generateOtp();

      const saved = await pool
        .request()
        .input('EmployeeID', user.EmployeeID)
        .input('UserID', user.UserID)
        .input('OTP', otp)
        .input('GeneratedOn', new Date())
        .input(
          'ExpiresOn',
          new Date(Date.now() + AuthService.OTP_VALID_SECONDS * 1000),
        )
        .execute('USP_SaveGeneratedOTP');

      const row = saved.recordset?.[0];
      if (row && Number(row.StatusCode) >= 400) {
        this.logger.error(
          `USP_SaveGeneratedOTP failed for ${user.EmployeeID}: ${JSON.stringify(row)}`,
        );
        return answer;
      }

      // Not awaited: waiting for the mail server would make a real user
      // visibly slower than an unknown one.
      this.mailService.sendOtp(user.Email, otp).catch((error: unknown) => {
        this.logger.error(
          `Could not e-mail the OTP to employee ${user.EmployeeID}: ${
            error instanceof Error ? error.message : String(error)
          }`,
        );
      });
    } catch (error) {
      this.logger.error(
        `Forgot password failed for employee ${user.EmployeeID}: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
    }

    return answer;
  }

  // Step 2 of 3. The person is identified by the user ID they typed in step 1.
  // Every failure gives the same message, whatever the reason (no such user,
  // wrong code, expired code, already used). A correct code returns a
  // short-lived reset token; the controller puts it in an httpOnly cookie.
  async verifyOtp(userId: string, otp: string) {
    const pool = await this.dbService.connect();

    const found = await pool
      .request()
      .input('EmailID', userId.trim())
      .execute('USP_Validateuser');

    const user = found.recordset?.[0];

    const lockKey = user
      ? String(user.EmployeeID)
      : `unknown:${userId.trim().toLowerCase()}`;
    this.assertOtpNotLocked(lockKey);

    // A locked account never verifies (same generic failure as a wrong code).
    let verified = false;
    if (user && !this.isLocked(user)) {
      const result = await pool
        .request()
        .input('EmployeeID', user.EmployeeID)
        .input('OTP', otp)
        .execute('USP_VerifyOTP');

      // USP_VerifyOTP answers with an HTTP-style code (200 = verified, 400 = wrong,
      // used or expired). Fail closed: only an explicit 200 passes.
      verified = Number(result.recordset?.[0]?.StatusCode) === 200;
    }

    if (!verified) {
      this.recordOtpFailure(lockKey);
      throw new BadRequestException(AuthService.OTP_ERROR);
    }

    this.otpFailures.delete(lockKey);

    return {
      success: true,
      message: 'OTP verified successfully',
      resetToken: this.issueResetToken(
        String(user.EmployeeID),
        String(user.UserID),
      ),
    };
  }

  // Step 3 of 3. Who is resetting is decided by the reset token alone.
  async resetForgotPassword(dto: ResetForgotPasswordDto, resetToken?: string) {
    // 1. The caller must have just passed OTP verification.
    const proof = this.verifyResetToken(resetToken);

    const pool = await this.dbService.connect();

    const userResult = await pool
      .request()
      .input('EmailID', proof.uid)
      .execute('USP_Validateuser');

    const user = userResult.recordset?.[0];

    // 2. The account we look up must be the one the OTP was verified for.
    if (!user || String(user.EmployeeID) !== proof.sub) {
      throw new UnauthorizedException(
        'Password reset session does not match this account. Please verify your OTP again.',
      );
    }

    // The account may have been locked after the OTP was verified.
    if (this.isLocked(user)) {
      throw new ForbiddenException('Account is locked. Contact administrator.');
    }

    if (dto.newPassword !== dto.confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    const samePassword = await bcrypt.compare(
      dto.newPassword,
      user.PasswordHash,
    );

    if (samePassword) {
      throw new BadRequestException(
        'New password must be different from the current password',
      );
    }

    const hashedPassword = await bcrypt.hash(dto.newPassword, 10);

    // For an account that has never logged in, choosing a password here
    // completes the first login (flag 1 also records it); otherwise the
    // forgot-password flag leaves everything else untouched.
    await this.updatePassword(
      pool,
      proof.sub,
      hashedPassword,
      user.LastLoginDateTime === null ? 1 : 2,
      proof.sub,
    );

    // Whoever was logged in with the old password is signed out.
    await this.afterOwnPasswordChange(proof.sub);

    // Burn the token only after the password really changed,
    // so a failed attempt can be retried within the 10 minutes.
    this.markResetTokenUsed(proof.jti, proof.exp);

    return {
      success: true,
      message: 'Password updated successfully',
    };
  }

  verifyAccessToken(token: string): Record<string, any> | null {
    try {
      return this.jwtService.verify(token);
    } catch (error) {
      return null;
    }
  }
 
  // ── Refresh ─────────────────────────────────────────────────────────────
  // Swaps the refresh token for a new one and issues a new access token.
  //   OK      -> new tokens
  //   RACE    -> 409: another request refreshed a moment ago; the browser
  //              already holds the new cookie, so the caller retries once
  //   others  -> 401, the caller must sign in again
  // A refresh token that is replayed later (REUSED) ends the whole session.
  async refresh(refreshToken: string | undefined, meta: SessionMeta = {}) {
    if (!refreshToken) {
      throw new UnauthorizedException('Session not found. Please sign in again.');
    }

    let payload: any;
    try {
      payload = this.jwtService.verify(refreshToken);
    } catch {
      throw new UnauthorizedException('Session expired. Please sign in again.');
    }

    if (
      payload?.purpose !== AuthService.REFRESH_PURPOSE ||
      !payload.sub ||
      !payload.uid ||
      !payload.sid
    ) {
      throw new UnauthorizedException('Session is not valid. Please sign in again.');
    }

    const familyId = String(payload.sid).toLowerCase();
    const employeeId = String(payload.sub);

    // The account must still exist and be allowed in. Role, name and company
    // are read fresh here, so changes made since login take effect.
    const pool = await this.dbService.connect();
    const found = await pool
      .request()
      .input('EmailID', String(payload.uid))
      .execute('USP_Validateuser');
    const user = found.recordset?.[0];

    if (!user || String(user.EmployeeID) !== employeeId || this.isLocked(user)) {
      await this.sessions.revoke(familyId, 'user_blocked').catch(() => undefined);
      throw new UnauthorizedException('Session is no longer valid. Please sign in again.');
    }

    const mustChange = await this.mustChangePassword(user);
    const newRefreshToken = this.signRefreshToken(user, familyId);
    const rotated = await this.sessions.rotate({
      oldRefreshToken: refreshToken,
      newSessionId: randomUUID(),
      newRefreshToken,
      idleMinutes: this.idleMinutes,
      meta,
    });

    if (rotated.code === 'OK') {
      if (rotated.familyId !== familyId || rotated.employeeId !== employeeId) {
        // Cannot happen with a genuine token; treat it as tampering.
        this.logger.error(
          `Refresh mismatch for employee ${employeeId}: token family ${familyId}, stored ${rotated.familyId}`,
        );
        await this.sessions.revoke(familyId, 'mismatch').catch(() => undefined);
        throw new UnauthorizedException('Session is not valid. Please sign in again.');
      }

      return {
        accessToken: this.jwtService.sign(
          this.buildAccessClaims(user, familyId, mustChange),
        ),
        refreshToken: newRefreshToken,
        user: {
          employeeId: user.EmployeeID,
          userId: user.UserID,
          roleId: user.RoleID,
          mustChangePassword: mustChange,
        },
      };
    }

    if (rotated.code === 'RACE') {
      throw new ConflictException({
        statusCode: 409,
        message: 'Session was just refreshed. Please retry.',
        code: 'REFRESH_RACE',
      });
    }

    // The stored session is over; make this instance stop trusting it now.
    this.sessions.markInactive(familyId);

    if (rotated.code === 'REUSED') {
      this.logger.warn(
        `Refresh token reuse for employee ${employeeId} (ip ${meta.ip ?? 'unknown'}): session ended`,
      );
    }

    throw new UnauthorizedException('Session ended. Please sign in again.');
  }

  // ── Who is logging out ──────────────────────────────────────────────────
  // Logout is public so it still works with an expired access token. The
  // tokens are checked for a valid signature, but their expiry is ignored.
  identifyForLogout(
    accessToken?: string,
    refreshToken?: string,
  ): { employeeId?: string; familyId?: string } {
    const read = (token?: string): any => {
      if (!token) return null;
      try {
        return this.jwtService.verify(token, { ignoreExpiration: true });
      } catch {
        return null;
      }
    };

    const access = read(accessToken);
    if (access && !access.purpose) {
      return {
        employeeId: access.employeeId != null ? String(access.employeeId) : undefined,
        familyId: access.sid ? String(access.sid) : undefined,
      };
    }

    const refresh = read(refreshToken);
    if (refresh?.purpose === AuthService.REFRESH_PURPOSE) {
      return {
        employeeId: refresh.sub ? String(refresh.sub) : undefined,
        familyId: refresh.sid ? String(refresh.sid) : undefined,
      };
    }

    return {};
  }

  async logout(who: { employeeId?: string; familyId?: string }) {
    // End the session first. If this fails the error is returned and the
    // cookies are kept, so the user can simply try logging out again.
    if (who.familyId) {
      await this.sessions.revoke(who.familyId, 'logout');
    }

    if (who.employeeId) {
      const pool = await this.dbService.connect();

      await pool
        .request()
        .input('EmployeeID', who.employeeId)
        .input('flag', 3)
        .execute('USP_UpdateLoginInfo');

      // Defense in depth alongside the login-time clear above.
      this.clearChatbotState(who.employeeId);
    }

    return {
      success: true,
      message: 'Logout successful',
    };
  }

  // ── Current user (for GET /auth/me) ─────────────────────────────────────
  getSessionUser(user: any) {
    return {
      success: true,
      data: {
        employeeId: user.employeeId,
        userId: user.userId,
        roleId: user.roleId,
        companyId: user.companyId,
        name: user.name,
        role: user.role,
        mustChangePassword: user.mcp === true,
      },
    };
  }

  // ================= CHANGE PASSWORD =================
  async changePassword(
    userId: string,
    dto: ChangePasswordDto,
    current: { sid?: string; mustChange?: boolean } = {},
  ) {
  try {
    const pool = await this.dbService.connect();
 
    const result = await pool
      .request()
      .input('EmailID', userId.trim())
      .execute('USP_Validateuser');
 
    const user = result.recordset?.[0];
 
    if (!user) {
      throw new BadRequestException('User not found');
    }
 
    const isMatch = await bcrypt.compare(
      dto.currentPassword,
      user.PasswordHash,
    );
 
    if (!isMatch) {
      throw new BadRequestException(
        'Current password is incorrect',
      );
    }
 
    if (dto.newPassword !== dto.confirmPassword) {
      throw new BadRequestException(
        'Passwords do not match',
      );
    }
 
    const samePassword = await bcrypt.compare(
      dto.newPassword,
      user.PasswordHash,
    );
 
    if (samePassword) {
      throw new BadRequestException(
        'New password must be different from current password',
      );
    }
 
    const hashedPassword = await bcrypt.hash(
      dto.newPassword,
      10,
    );
 
    await this.updatePassword(pool, user.EmployeeID, hashedPassword, 2, user.EmployeeID);

    // Other logins end; this one stays.
    await this.afterOwnPasswordChange(String(user.EmployeeID), current.sid);

    // If this login was restricted ("must change password"), it is free now:
    // hand the controller a fresh access token without the restriction.
    const newAccessToken =
      current.mustChange && current.sid
        ? this.jwtService.sign(this.buildAccessClaims(user, current.sid, false))
        : undefined;

    return {
      success: true,
      message: 'Password changed successfully',
      newAccessToken,
    };
  } catch (error) {
    throw error;
  }
  }
 
  async sendWish(senderEmployeeId: string, dto: SendWishDto) {
    const pool = await this.dbService.connect();
    const result = await pool
      .request()
      .input('EmployeeID', dto.employeeId)
      .execute('USP_GetUserInfo');
 
    const employee = result.recordset?.[0];
    if (!employee) {
      throw new NotFoundException('Employee not found');
    }
    if (!employee.Email) {
      throw new BadRequestException('Employee does not have an email address');
    }
 
    const senderResult = await pool
      .request()
      .input('EmployeeID', senderEmployeeId)
      .execute('USP_GetUserInfo');
    const sender = senderResult.recordset?.[0];
    if (!sender) {
      throw new NotFoundException('Sender not found');
    }
 
    await this.mailService.sendWish(
      employee.Email,
      dto.eventType,
      dto.message,
      sender.FullName,
    );
 
    return {
      success: true,
      message: 'Wish sent successfully',
    };
  }
}
