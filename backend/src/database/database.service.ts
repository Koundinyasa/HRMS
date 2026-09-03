import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as sql from 'mssql';
 
 
 
@Injectable()
export class DatabaseService {
  private pool: sql.ConnectionPool;
 
  constructor(private readonly configService: ConfigService) {}
 
  async connect(): Promise<sql.ConnectionPool> {
    if (!this.pool) {
      this.pool = await sql.connect({
        server: this.configService.get<string>('database.host'),
        port: this.configService.get<number>('database.port'),
        user: this.configService.get<string>('database.user'),
        password: this.configService.get<string>('database.password'),
        database: this.configService.get<string>('database.name'),
        options: {
          encrypt: this.configService.get<boolean>('database.encrypt'),
          trustServerCertificate: this.configService.get<boolean>(
            'database.trustServerCertificate',
          ),
          // FIX — mssql's tedious driver defaults this to TRUE, which means
          // it reads naive datetime2 values (no timezone attached, e.g.
          // what GETDATE() writes) as if they were UTC. But GETDATE() on
          // this SQL Server actually writes real IST wall-clock time — so
          // the driver was misreading an already-correct IST timestamp as
          // UTC, then the frontend converted THAT to IST again on top,
          // adding a spurious +5:30 on every timestamp read from the DB
          // (confirmed: PunchTimestamp 17:01:57 was displaying as 10:31 PM,
          // exactly +5:30 off). Setting this to false stops the driver
          // from reinterpreting the value at all — it's returned as-is.
          useUTC: false,
        },
      });
    }
 
    return this.pool;
  }
 
  async healthCheck(): Promise<boolean> {
    const pool = await this.connect();
    await pool.request().query('SELECT 1 AS ok');
    return true;
  }
}