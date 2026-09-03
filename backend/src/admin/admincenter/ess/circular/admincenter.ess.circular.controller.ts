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

import { AdmincenterEssCircularService } from './admincenter.ess.circular.service';
import { CreateCircularDto } from './dto/create-circular.dto';
import { UpdateCircularDto } from './dto/update-circular.dto';

@Controller('admin/ess/circular')
export class AdmincenterEssCircularController {
  constructor(
    private readonly circularService: AdmincenterEssCircularService,
  ) {}

  // Create Circular
  @Post()
  @UseInterceptors(FileInterceptor('attachment'))
  async create(
    @Body() dto: CreateCircularDto,
    @UploadedFile() attachment?: Express.Multer.File,
  ) {
    return this.circularService.create(
      dto,
      1, // Temporary CreatedBy
      attachment,
    );
  }

  // Get Circular List
  @Get()
  async findAll() {
    return this.circularService.findAll();
  }

  // Get Circular By ID
  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.circularService.findOne(id);
  }

  // Update Circular
  @Put(':id')
  @UseInterceptors(FileInterceptor('attachment'))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCircularDto,
    @UploadedFile() attachment?: Express.Multer.File,
  ) {
    return this.circularService.update(
      id,
      dto,
      1, // Temporary ModifiedBy
      attachment,
    );
  }

  // Get Target Filters
  @Get('filters')
  async getFilters() {
    return this.circularService.getFilters();
  }

  // Get Acknowledgement Types
  @Get('acknowledgement-types')
  async getAcknowledgementTypes() {
    return this.circularService.getAcknowledgementTypes();
  }
}