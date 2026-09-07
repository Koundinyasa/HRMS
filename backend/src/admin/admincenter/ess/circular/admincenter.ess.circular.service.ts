import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from '../../../../database/database.service';
import * as sql from 'mssql';
import { CreateCircularDto } from './dto/create-circular.dto';
import { UpdateCircularDto } from './dto/update-circular.dto';



@Injectable()
export class AdmincenterEssCircularService {
  constructor(
    private readonly databaseService: DatabaseService,
  ) {}

  // Create Circular
  async create(
    dto: CreateCircularDto,
    createdBy: number,
    attachment?: Express.Multer.File,
  ) {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .input(
          'CircularName',
          sql.VarChar(200),
          dto.circularName,
        )
        .input(
          'Description',
          sql.VarChar(1000),
          dto.description ?? null,
        )
        .input(
          'FilterID',
          sql.Int,
          dto.filterId ?? null,
        )
        .input(
          'CircularDate',
          sql.Date,
          dto.date ?? null,
        )
        .input(
          'AcknowledgementTypeID',
          sql.Int,
          dto.acknowledgementTypeId ?? null,
        )
        .input(
          'AttachmentPath',
          sql.VarChar(500),
          attachment?.path ?? null,
        )
        .input(
          'CreatedBy',
          sql.Int,
          createdBy,
        )
        .execute('USP_AdminESS_Circular_Insert');

      return result.recordset?.[0];
    } catch (error) {
      console.error('Circular Create API Error:', error);

      throw new BadRequestException(
        error instanceof Error
          ? error.message
          : 'Failed to create circular.',
      );
    }
  }

  // Get Circular List
  async findAll() {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .execute('USP_AdminESS_Circular_GetList');

      return {
        statusCode: 200,
        statusMessage: 'Circular list retrieved successfully.',
        data: result.recordset ?? [],
      };
    } catch (error) {
      console.error('Circular List API Error:', error);

      throw new BadRequestException(
        error instanceof Error
          ? error.message
          : 'Failed to retrieve circular list.',
      );
    }
  }

  // Get Circular By ID
  async findOne(id: number) {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .input('ID', sql.Int, id)
        .execute('USP_AdminESS_Circular_GetById');

      if (!result.recordset || result.recordset.length === 0) {
        throw new NotFoundException(
          'Circular not found.',
        );
      }

      return {
        statusCode: 200,
        statusMessage: 'Circular retrieved successfully.',
        data: result.recordset[0],
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      console.error('Circular Get By ID API Error:', error);

      throw new BadRequestException(
        error instanceof Error
          ? error.message
          : 'Failed to retrieve circular.',
      );
    }
  }

  // Update Circular
  async update(
    id: number,
    dto: UpdateCircularDto,
    modifiedBy: number,
    attachment?: Express.Multer.File,
  ) {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .input(
          'ID',
          sql.Int,
          id,
        )
        .input(
          'CircularName',
          sql.VarChar(200),
          dto.circularName ?? null,
        )
        .input(
          'Description',
          sql.VarChar(1000),
          dto.description ?? null,
        )
        .input(
          'FilterID',
          sql.Int,
          dto.filterId ?? null,
        )
        .input(
          'CircularDate',
          sql.Date,
          dto.date ?? null,
        )
        .input(
          'AcknowledgementTypeID',
          sql.Int,
          dto.acknowledgementTypeId ?? null,
        )
        .input(
          'AttachmentPath',
          sql.VarChar(500),
          attachment?.path ?? null,
        )
        .input(
          'ModifiedBy',
          sql.Int,
          modifiedBy,
        )
        .execute('USP_AdminESS_Circular_Update');

      return result.recordset?.[0];
    } catch (error) {
      console.error('Circular Update API Error:', error);

      throw new BadRequestException(
        error instanceof Error
          ? error.message
          : 'Failed to update circular.',
      );
    }
  }

  // Get Target Filters
  async getFilters() {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .execute(
          'USP_AdminESS_Circular_GetFilters',
        );

      return {
        statusCode: 200,
        statusMessage: 'Target filters retrieved successfully.',
        data: result.recordset ?? [],
      };
    } catch (error) {
      console.error('Circular Filters API Error:', error);

      throw new BadRequestException(
        error instanceof Error
          ? error.message
          : 'Failed to retrieve target filters.',
      );
    }
  }

  // Get Acknowledgement Types
  async getAcknowledgementTypes() {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .execute(
          'USP_AdminESS_Circular_GetAcknowledgementTypes',
        );

      return {
        statusCode: 200,
        statusMessage:
          'Acknowledgement types retrieved successfully.',
        data: result.recordset ?? [],
      };
    } catch (error) {
      console.error(
        'Circular Acknowledgement Types API Error:',
        error,
      );

      throw new BadRequestException(
        error instanceof Error
          ? error.message
          : 'Failed to retrieve acknowledgement types.',
      );
    }
  }

    // Create Circular

    // Get Circular List

    // Get Circular By ID

    // Update Circular

    // Get Target Filters

    // Get Acknowledgement Types
}