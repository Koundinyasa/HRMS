import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { ALLOW_WHILE_PASSWORD_CHANGE_REQUIRED } from '../decorators/allow-password-change.decorator';
import { AuthSessionService } from '../../auth/session/auth-session.service';

/**
 * Single source of truth for JWT auth.
 *
 * Registered once as a global guard (APP_GUARD in AppModule), so every route
 * requires a valid login unless it is marked @Public().
 * Reads the token from the httpOnly cookie set at login.
 *
 * A valid token is not enough: it carries a session id (`sid`), and the
 * session must still be active (not logged out, revoked or timed out).
 * Tokens issued before sessions existed have no `sid`; they are accepted only
 * while auth.allowLegacyTokens is true (ALLOW_LEGACY_TOKENS, default false).
 *
 * A token marked `mcp` (the password must be changed first) is accepted only
 * on routes decorated with @AllowWhilePasswordChangeRequired().
 *
 * Controllers that still declare @UseGuards(JwtAuthGuard) keep working: when
 * the global guard has already authenticated the request, this guard returns
 * immediately instead of checking the token a second time.
 */
@Injectable()
export class JwtAuthGuard implements CanActivate {
  private readonly allowLegacyTokens: boolean;

  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
    private readonly sessions: AuthSessionService,
    config: ConfigService,
  ) {
    this.allowLegacyTokens = config.get<boolean>('auth.allowLegacyTokens') === true;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Only HTTP requests carry the auth cookie.
    if (context.getType() !== 'http') return true;

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const request = context.switchToHttp().getRequest();

    // Already authenticated by the global guard.
    if (request.user) return true;

    const token = request.cookies?.access_token;

    if (!token) {
      throw new UnauthorizedException('Token missing or invalid');
    }

    let payload: any;
    try {
      payload = this.jwtService.verify(token);
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }

    // Short-lived tokens issued for other purposes (for example the
    // password-reset or refresh token) must never work as a login session.
    if (payload?.purpose) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    if (payload?.sid) {
      // May throw 503 when the session store cannot be reached: fail closed.
      const active = await this.sessions.isActive(String(payload.sid));
      if (!active) {
        throw new UnauthorizedException('Session has ended');
      }
    } else if (!this.allowLegacyTokens) {
      throw new UnauthorizedException('Session is no longer valid. Please sign in again.');
    }

    if (payload?.mcp === true) {
      const allowed = this.reflector.getAllAndOverride<boolean>(
        ALLOW_WHILE_PASSWORD_CHANGE_REQUIRED,
        [context.getHandler(), context.getClass()],
      );
      if (!allowed) {
        throw new ForbiddenException(
          'You must change your password before you can continue.',
        );
      }
    }

    request.user = payload;
    return true;
  }
}
