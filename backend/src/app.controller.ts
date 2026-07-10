import { Controller, Get } from '@nestjs/common';
import { DatabaseService } from './database/database.service';

@Controller()
export class AppController {
  constructor(private readonly dbService: DatabaseService) {}

  
  @Get('db-check')
  async checkDb() {
    try {
      await this.dbService.healthCheck();
      return { success: true, message: 'Database connected successfully' };
    } catch (error: any) {
      return {
        success: false,
        message: 'Database connection failed',
        error: error.message,
      };
    }
  }
}