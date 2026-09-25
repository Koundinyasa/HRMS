import { Injectable, InternalServerErrorException } from '@nestjs/common';

import { DatabaseService } from '../../../database/database.service';

@Injectable()
export class WorkflowsService {
  constructor(private readonly databaseService: DatabaseService) {}

  // ==========================================
  // Employee Group
  // ==========================================

  // Get Employee Groups
  async getEmployeeGroups() {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .execute('USP_GetWorkflowEmployeeGroups'); // Placeholder SP

      return result.recordset;
    } catch (error) {
      console.error('Error while fetching employee groups:', error);

      throw new InternalServerErrorException(
        'Unable to fetch employee groups.',
      );
    }
  }

  // ==========================================
  // Module Settings
  // ==========================================

  // Get Module Settings
  async getModuleSettings() {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .execute('USP_GetWorkflowModuleSettings'); // Placeholder SP

      return result.recordset;
    } catch (error) {
      console.error('Error while fetching module settings:', error);

      throw new InternalServerErrorException(
        'Unable to fetch module settings.',
      );
    }
  }

  // Save Module Settings
  async updateModuleSettings(body: any) {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .input('ModuleSettings', JSON.stringify(body))
        .execute('USP_UpdateWorkflowModuleSettings'); // Placeholder SP

      return result.recordset;
    } catch (error) {
      console.error('Error while updating module settings:', error);

      throw new InternalServerErrorException(
        'Unable to update module settings.',
      );
    }
  }

  // ==========================================
  // Workflow
  // ==========================================

  // ==========================================
  // Workflow Configurations
  // ==========================================

  // Get Workflow Configurations
  async getWorkflowConfigurations() {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .execute('USP_GetWorkflowConfigurations'); // Placeholder SP

      return result.recordset;
    } catch (error) {
      console.error('Error while fetching workflow configurations:', error);

      throw new InternalServerErrorException(
        'Unable to fetch workflow configurations.',
      );
    }
  }
  // Get Workflow Details
  async getWorkflowDetails(workflowId: string) {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .input('WorkflowId', workflowId)
        .execute('USP_GetWorkflowDetails'); // Placeholder SP

      return result.recordset;
    } catch (error) {
      console.error('Error while fetching workflow details:', error);

      throw new InternalServerErrorException(
        'Unable to fetch workflow details.',
      );
    }
  }
}
