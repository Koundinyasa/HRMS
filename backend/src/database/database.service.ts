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