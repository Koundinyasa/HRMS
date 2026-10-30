import {
  Controller,
  Get,
  ServiceUnavailableException,
} from '@nestjs/common';
import { DatabaseService } from './database/database.service';
import { Public } from './common/decorators/public.decorator';

@Controller()
export class AppController {
  constructor(private readonly dbService: DatabaseService) {}

  /**
   * Health check for load balancers and uptime monitors.
   * Public on purpose, so it returns no internal error text.
   * `db-check` is kept as an alias for existing monitors.
   */
  @Public()
  @Get(['health', 'db-check'])
  async checkDb() {
    try {
      await this.dbService.healthCheck();
      return { success: true, message: 'Database connected successfully' };
    } catch {
      throw new ServiceUnavailableException('Database connection failed');
    }
  }
}
