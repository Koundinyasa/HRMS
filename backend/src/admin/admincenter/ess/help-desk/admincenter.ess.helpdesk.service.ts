import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';

import { DatabaseService } from '../../../../database/database.service';
import * as sql from 'mssql';

import { CreateHelpdeskCategoryDto } from './dto/create-helpdesk-category.dto';

@Injectable()
export class HelpDeskService {
  constructor(
    private readonly databaseService: DatabaseService,
  ) {}

  // Get Category Types
  async getCategoryTypes() {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .execute('USP_HelpDesk_GetCategoryTypes');

      return result.recordset;
    } catch (error) {
      console.error(
        'Help Desk Category Types API Error:',
        error,
      );

      throw new BadRequestException(
        error instanceof Error
          ? error.message
          : 'Failed to get category types.',
      );
    }
  }

  // Create Category
  async createCategory(
    dto: CreateHelpdeskCategoryDto,
    createdBy: number,
  ) {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .input(
          'Category',
          sql.VarChar(100),
          dto.category,
        )
        .input(
          'CategoryTypeID',
          sql.Int,
          dto.categoryTypeId,
        )
        .input(
          'CreatedBy',
          sql.Int,
          createdBy,
        )
        .execute('USP_HelpDeskCategoryInsert');

      return result.recordset?.[0];
    } catch (error) {
      console.error(
        'Help Desk Category API Error:',
        error,
      );

      throw new BadRequestException(
        error instanceof Error
          ? error.message
          : 'Failed to create help desk category.',
      );
    }
  }

  // Get Categories
  async getCategories() {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .execute('USP_HelpDesk_GetCategories');

      return result.recordset;
    } catch (error) {
      console.error(
        'Help Desk Categories API Error:',
        error,
      );

      throw new BadRequestException(
        error instanceof Error
          ? error.message
          : 'Failed to get help desk categories.',
      );
    }
  }
}