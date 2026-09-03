import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { AdmincenterEssPolicyService } from './admincenter.ess.policy.service';
import { CreatePolicyDto } from './dto/create-policy.dto';
import { UpdatePolicyDto } from './dto/update-policy.dto';

@Controller('admin/ess/policy')
export class AdmincenterEssPolicyController {
  constructor(
    private readonly policyService: AdmincenterEssPolicyService,
  ) {}

  // Create Policy
  @Post()
  @UseInterceptors(FileInterceptor('attachment'))
  async create(
    @Body() dto: CreatePolicyDto,
    @UploadedFile() attachment?: Express.Multer.File,
  ) {
    return this.policyService.create(
      dto,
      1, // Temporary CreatedBy
      attachment,
    );
  }

  // Get Policy List
  @Get()
  async findAll() {
    return this.policyService.findAll();
  }

  // Get Target Filters
  @Get('filters')
  async getFilters() {
    return this.policyService.getFilters();
  }

  // Get Acknowledgement Types
  @Get('acknowledgement-types')
  async getAcknowledgementTypes() {
    return this.policyService.getAcknowledgementTypes();
  }

  // Get Policy By ID
  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.policyService.findOne(id);
  }

  // Update Policy
  @Put(':id')
  @UseInterceptors(FileInterceptor('attachment'))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePolicyDto,
    @UploadedFile() attachment?: Express.Multer.File,
  ) {
    return this.policyService.update(
      id,
      dto,
      1, // Temporary ModifiedBy
      attachment,
    );
  }
}