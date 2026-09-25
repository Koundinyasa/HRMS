import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from '../../../../database/database.service';
import * as sql from 'mssql';

import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';

@Injectable()
export class AdmincenterEssNotificationService {
  constructor(private readonly databaseService: DatabaseService) {}

  // Create Notification
  async create(
    dto: CreateNotificationDto,
    createdBy: number,
    attachment?: Express.Multer.File,
  ) {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .input('EventName', sql.VarChar(200), dto.eventName)
        .input('FromDate', sql.Date, dto.fromDate)
        .input('ToDate', sql.Date, dto.toDate ?? null)
        .input('AttachmentPath', sql.VarChar(500), attachment?.path ?? null)
        .input('CreatedBy', sql.Int, createdBy)
        .execute('USP_AdminESS_Notification_Insert');

      return result.recordset?.[0];
    } catch (error) {
      console.error('Notification Create API Error:', error);

      throw new BadRequestException(
        error instanceof Error
          ? error.message
          : 'Failed to create notification.',
      );
    }
  }

  // Get Current Notification List
  async findAll() {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .execute('USP_AdminESS_Notification_GetList');

      return {
        statusCode: 200,
        statusMessage: 'Notification list retrieved successfully.',
        data: result.recordset ?? [],
      };
    } catch (error) {
      console.error('Notification List API Error:', error);

      throw new BadRequestException(
        error instanceof Error
          ? error.message
          : 'Failed to retrieve notification list.',
      );
    }
  }

  // Get Notification By ID
  async findOne(id: number) {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .input('ID', sql.Int, id)
        .execute('USP_AdminESS_Notification_GetById');

      if (!result.recordset?.length) {
        throw new NotFoundException('Notification not found.');
      }

      return {
        statusCode: 200,
        statusMessage: 'Notification retrieved successfully.',
        data: result.recordset[0],
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      console.error('Notification Get By ID API Error:', error);

      throw new BadRequestException(
        error instanceof Error
          ? error.message
          : 'Failed to retrieve notification.',
      );
    }
  }

  // Update Notification
  async update(
    id: number,
    dto: UpdateNotificationDto,
    modifiedBy: number,
    attachment?: Express.Multer.File,
  ) {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .input('ID', sql.Int, id)
        .input('EventName', sql.VarChar(200), dto.eventName ?? null)
        .input('FromDate', sql.Date, dto.fromDate ?? null)
        .input('ToDate', sql.Date, dto.toDate ?? null)
        .input('AttachmentPath', sql.VarChar(500), attachment?.path ?? null)
        .input('ModifiedBy', sql.Int, modifiedBy)
        .execute('USP_AdminESS_Notification_Update');

      return result.recordset?.[0];
    } catch (error) {
      console.error('Notification Update API Error:', error);

      throw new BadRequestException(
        error instanceof Error
          ? error.message
          : 'Failed to update notification.',
      );
    }
  }
}
