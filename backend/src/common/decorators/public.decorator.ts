import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

/**
 * Marks a controller or a single route as reachable without a login.
 *
 * Every route is protected by the global JwtAuthGuard by default. Use this
 * only for the login flow (captcha, login, company check, forgot-password
 * steps) and health checks.
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
