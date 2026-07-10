import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Pulls the authenticated user off the request.
 * Use instead of @Req() req → req.user everywhere.
 *
 * @example
 *   getProfile(@CurrentUser() user: JwtPayload) { ... }
 */



export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) =>
    ctx.switchToHttp().getRequest().user,
);