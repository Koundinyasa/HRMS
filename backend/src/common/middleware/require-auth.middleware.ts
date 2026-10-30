import { HttpException } from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';
import type { JwtService } from '@nestjs/jwt';

/** What the middleware needs from the session store (AuthSessionService). */
export interface SessionLookup {
  isActive(familyId: string): Promise<boolean>;
}

export interface RequireAuthOptions {
  jwtService: JwtService;
  sessions: SessionLookup;
  /** Same switch as the global guard (ALLOW_LEGACY_TOKENS). */
  allowLegacyTokens: boolean;
}

/**
 * Express middleware for routes that are registered outside Nest's routing
 * (the static /documents folder and the Swagger UI), where the global
 * JwtAuthGuard and RolesGuard never run.
 *
 * It applies the same rules as the global guard:
 *  - the httpOnly `access_token` cookie must hold a valid token,
 *  - the login session behind it must still be active (a user who has signed
 *    out, or whose session was revoked or timed out, is refused at once),
 *  - tokens from before sessions existed are refused unless
 *    ALLOW_LEGACY_TOKENS=true,
 *  - a login that must change its password first cannot use these routes.
 *
 * Pass `allowedRoles` to restrict the route to specific roles (RoleID values).
 */
export function createRequireAuth(
  { jwtService, sessions, allowLegacyTokens }: RequireAuthOptions,
  allowedRoles?: readonly number[],
) {
  const deny = (res: Response, status: number, message: string) =>
    res.status(status).json({ success: false, statusCode: status, message });

  return async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies?.access_token;

    if (!token) {
      return deny(res, 401, 'Token missing or invalid');
    }

    let payload: any;
    try {
      payload = jwtService.verify(token);
    } catch {
      return deny(res, 401, 'Invalid or expired token');
    }

    // Short-lived tokens issued for other purposes (for example the
    // password-reset token) must never work as a login session.
    if (payload?.purpose) {
      return deny(res, 401, 'Invalid or expired token');
    }

    if (payload?.sid) {
      let active: boolean;
      try {
        active = await sessions.isActive(String(payload.sid));
      } catch (error) {
        // Session store unreachable: fail closed, like the global guard.
        const status = error instanceof HttpException ? error.getStatus() : 503;
        return deny(res, status, 'Session check is unavailable. Please try again.');
      }
      if (!active) {
        return deny(res, 401, 'Session has ended');
      }
    } else if (!allowLegacyTokens) {
      return deny(res, 401, 'Session is no longer valid. Please sign in again.');
    }

    if (payload?.mcp === true) {
      return deny(res, 403, 'You must change your password before you can continue.');
    }

    if (allowedRoles && !allowedRoles.includes(Number(payload?.roleId))) {
      return deny(res, 403, 'Forbidden');
    }

    (req as any).user = payload;
    next();
  };
}
