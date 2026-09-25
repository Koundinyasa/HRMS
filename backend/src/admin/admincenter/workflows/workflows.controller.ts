import { Controller, Get, Param, Put, Body, UseGuards } from '@nestjs/common';

import { WorkflowsService } from './workflows.service';

import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';

@Controller('admin/admincenter/workflows')
@UseGuards(JwtAuthGuard)
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
