import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from '../../../../database/database.service';
import * as sql from 'mssql';

import { CreatePolicyDto } from './dto/create-policy.dto';
import { UpdatePolicyDto } from './dto/update-policy.dto';

@Injectable()
export class AdmincenterEssPolicyService {
  constructor(private readonly databaseService: DatabaseService) {}

  // Create Policy
  async create(
    dto: CreatePolicyDto,
    createdBy: number,
    attachment?: Express.Multer.File,
  ) {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .input('PolicyName', sql.VarChar(200), dto.policyName)
        .input('Description', sql.VarChar(1000), dto.description ?? null)
        .input('FilterID', sql.Int, dto.filterId ?? null)
        .input('PolicyDate', sql.Date, dto.date ?? null)
        .input(
          'AcknowledgementTypeID',
          sql.Int,
          dto.acknowledgementTypeId ?? null,
        )
        .input(
          'DisableAttachmentDownload',
          sql.Bit,
          dto.disableAttachmentDownload ?? false,
        )
        .input('AttachmentPath', sql.VarChar(500), attachment?.path ?? null)
        .input('CreatedBy', sql.Int, createdBy)
        .execute('USP_AdminESS_Policy_Insert');

      return result.recordset?.[0];
    } catch (error) {
      console.error('Policy Create API Error:', error);

      throw new BadRequestException(
        error instanceof Error ? error.message : 'Failed to create policy.',
      );
    }
  }

  // Get Policy List
  async findAll() {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .execute('USP_AdminESS_Policy_GetList');

      return {
        statusCode: 200,
        statusMessage: 'Policy list retrieved successfully.',
        data: result.recordset ?? [],
      };
    } catch (error) {
      console.error('Policy List API Error:', error);

      throw new BadRequestException(
        error instanceof Error
          ? error.message
          : 'Failed to retrieve policy list.',
      );
    }
  }

  // Get Policy By ID
  async findOne(id: number) {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .input('ID', sql.Int, id)
        .execute('USP_AdminESS_Policy_GetById');

      if (!result.recordset?.length) {
        throw new NotFoundException('Policy not found.');
      }

      return {
        statusCode: 200,
        statusMessage: 'Policy retrieved successfully.',
        data: result.recordset[0],
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      console.error('Policy Get By ID API Error:', error);

      throw new BadRequestException(
        error instanceof Error ? error.message : 'Failed to retrieve policy.',
      );
    }
  }

  // Update Policy
  async update(
    id: number,
    dto: UpdatePolicyDto,
    modifiedBy: number,
    attachment?: Express.Multer.File,
  ) {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .input('ID', sql.Int, id)
        .input('PolicyName', sql.VarChar(200), dto.policyName ?? null)
        .input('Description', sql.VarChar(1000), dto.description ?? null)
        .input('FilterID', sql.Int, dto.filterId ?? null)
        .input('PolicyDate', sql.Date, dto.date ?? null)
        .input(
          'AcknowledgementTypeID',
          sql.Int,
          dto.acknowledgementTypeId ?? null,
        )
        .input(
          'DisableAttachmentDownload',
          sql.Bit,
          dto.disableAttachmentDownload ?? false,
        )
        .input('AttachmentPath', sql.VarChar(500), attachment?.path ?? null)
        .input('ModifiedBy', sql.Int, modifiedBy)
        .execute('USP_AdminESS_Policy_Update');

      return result.recordset?.[0];
    } catch (error) {
      console.error('Policy Update API Error:', error);

      throw new BadRequestException(
        error instanceof Error ? error.message : 'Failed to update policy.',
      );
    }
  }

  // Get Target Filters
  async getFilters() {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .execute('USP_AdminESS_Policy_GetFilters');

      return {
        statusCode: 200,
        statusMessage: 'Target filters retrieved successfully.',
        data: result.recordset ?? [],
      };
    } catch (error) {
      console.error('Policy Filters API Error:', error);

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
        .execute('USP_AdminESS_Policy_GetAcknowledgementTypes');

      return {
        statusCode: 200,
        statusMessage: 'Acknowledgement types retrieved successfully.',
        data: result.recordset ?? [],
      };
    } catch (error) {
      console.error('Policy Acknowledgement Types API Error:', error);

      throw new BadRequestException(
        error instanceof Error
          ? error.message
          : 'Failed to retrieve acknowledgement types.',
      );
    }
  }
}
