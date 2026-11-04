import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as sql from 'mssql';
import { PoolHolder, buildSqlConfig } from './sql-pool';

@Injectable()
export class DatabaseService implements OnModuleDestroy {
  // useUTC: false — this server's GETDATE() writes real IST wall-clock time,
  // but mssql's driver defaults to reading naive datetime2 values as UTC.
  // That added a spurious +5:30 to every timestamp the frontend then showed
  // (PunchTimestamp 17:01:57 displayed as 10:31 PM). With false the value is
  // returned as stored. See database/sql-pool.ts.
  private readonly holder = new PoolHolder('main', () =>
    buildSqlConfig(this.configService, false),
  );

  constructor(private readonly configService: ConfigService) {}

  connect(): Promise<sql.ConnectionPool> {
    return this.holder.get();
  }

  async healthCheck(): Promise<boolean> {
    const pool = await this.connect();
    await pool.request().query('SELECT 1 AS ok');
    return true;
  }

  async onModuleDestroy(): Promise<void> {
    await this.holder.close();
  }
}
