import { Controller, Get, Param, Put, Body } from '@nestjs/common';

import { WorkflowsService } from './workflows.service';

import { Roles } from '../../../common/decorators/roles.decorator';
import { ADMIN_PORTAL_ROLES } from '../../../common/constants/roles';

@Roles(...ADMIN_PORTAL_ROLES)
@Controller('admin/admincenter/workflows')
export class WorkflowsController {
  constructor(private readonly workflowsService: WorkflowsService) {}

  // ==========================================
  // Employee Group
  // ==========================================

  // Get Employee Groups
  @Get('employeegroups')
  async getEmployeeGroups() {
    return this.workflowsService.getEmployeeGroups();
  }

  // ==========================================
  // Module Settings
  // ==========================================

  // Get Module Settings
  @Get('modulesettings')
  async getModuleSettings() {
    return this.workflowsService.getModuleSettings();
  }

  // Save Module Settings
  @Put('modulesettings')
  async updateModuleSettings(@Body() body: any) {
    return this.workflowsService.updateModuleSettings(body);
  }

  // ==========================================
  // Workflow
  // ==========================================

  // Get Workflow Configurations
  @Get('configurations')
  async getWorkflowConfigurations() {
    return this.workflowsService.getWorkflowConfigurations();
  }
  // Get Workflow Details
  @Get(':workflowId')
  async getWorkflowDetails(@Param('workflowId') workflowId: string) {
    return this.workflowsService.getWorkflowDetails(workflowId);
  }
}
