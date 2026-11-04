import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as sql from 'mssql';

/**
 * Builds the mssql connection settings from the `database.*` configuration.
 *
 * `useUTC` is a per-pool choice and must not be unified casually:
 *  - `DatabaseService` uses `false`: this server writes IST wall-clock time
 *    with GETDATE(), and the driver must not reinterpret it as UTC.
 *  - `HrmsDbService` (chatbot) keeps the driver default `true`: it turns DATE
 *    columns into 'YYYY-MM-DD' with `toISOString()`, which is only right when
 *    the driver reads them as UTC midnight.
 */
export function buildSqlConfig(
  config: ConfigService,
  useUTC: boolean,
): sql.config {
  return {
    server: config.getOrThrow<string>('database.host'),
    port: config.getOrThrow<number>('database.port'),
    user: config.getOrThrow<string>('database.user'),
    password: config.getOrThrow<string>('database.password'),
    database: config.getOrThrow<string>('database.name'),
    connectionTimeout: config.get<number>('database.connectionTimeoutMs') ?? 15000,
    requestTimeout: config.get<number>('database.requestTimeoutMs') ?? 15000,
    pool: {
      max: config.get<number>('database.poolMax') ?? 10,
      min: config.get<number>('database.poolMin') ?? 0,
      idleTimeoutMillis: 30000,
    },
    options: {
      encrypt: config.get<boolean>('database.encrypt'),
      trustServerCertificate: config.get<boolean>(
        'database.trustServerCertificate',
      ),
      useUTC,
    },
  };
}

/**
 * Holds one connection pool and hands it out.
 *
 *  - Many calls arriving together share ONE connect attempt (no leaked pools).
 *  - A failed connect is not remembered: the next call tries again.
 *  - If the pool is closed or lost, the next call opens a fresh one.
 *  - The pool's 'error' events are handled (an unhandled one would stop the
 *    whole process) and logged.
 */
export class PoolHolder {
  private pool?: sql.ConnectionPool;
  private connecting?: Promise<sql.ConnectionPool>;
  private readonly logger: Logger;

  constructor(
    private readonly label: string,
    private readonly buildConfig: () => sql.config,
  ) {
    this.logger = new Logger(`SqlPool:${label}`);
  }

  get(): Promise<sql.ConnectionPool> {
    if (this.pool?.connected) return Promise.resolve(this.pool);
    if (!this.connecting) {
      this.connecting = this.open().finally(() => {
        this.connecting = undefined;
      });
    }
    return this.connecting;
  }

  private async open(): Promise<sql.ConnectionPool> {
    const stale = this.pool;
    this.pool = undefined;
    if (stale) stale.close().catch(() => undefined);

    const pool = new sql.ConnectionPool(this.buildConfig());
    pool.on('error', (err: Error) => {
      this.logger.error(`Pool error: ${err.message}`);
      if (!pool.connected && this.pool === pool) this.pool = undefined;
    });

    try {
      await pool.connect();
    } catch (err) {
      pool.close().catch(() => undefined);
      throw err;
    }
    this.pool = pool;
    return pool;
  }

  async close(): Promise<void> {
    const pool = this.pool;
    this.pool = undefined;
    // A connect still in flight finishes first, then is closed.
    const pending = this.connecting;
    if (pending) {
      try {
        (await pending).close().catch(() => undefined);
      } catch {
        /* the connect failed; nothing to close */
      }
    }
    if (pool) await pool.close().catch(() => undefined);
  }
}
