import { SetMetadata } from '@nestjs/common';

export const ALLOW_WHILE_PASSWORD_CHANGE_REQUIRED = 'allowWhilePasswordChangeRequired';

/**
 * A login whose password must be changed (first login, or a temporary password
 * sent by HR) can reach only the routes marked with this decorator, until the
 * password has been changed. Every other route answers 403.
 */
export const AllowWhilePasswordChangeRequired = () =>
  SetMetadata(ALLOW_WHILE_PASSWORD_CHANGE_REQUIRED, true);
