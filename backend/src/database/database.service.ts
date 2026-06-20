import { Injectable } from '@nestjs/common';
import * as sql from 'mssql';


@Injectable()
export class DatabaseService {
  
  private pool: sql.ConnectionPool;

  async connect() {
    if (!this.pool) {
      this.pool = await sql.connect({
        server: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        options: {
          encrypt: false,
          trustServerCertificate: true,
        },
      });
    }

    return this.pool;
  }

  async testConnection() {
    const pool = await this.connect();
    const result = await pool.request().query('SELECT * from Employee');
    return result.recordset;
  }
}