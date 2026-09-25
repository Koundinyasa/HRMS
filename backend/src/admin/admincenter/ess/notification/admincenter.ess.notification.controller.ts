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

import { AdmincenterEssNotificationService } from './admincenter.ess.notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';

@Controller('admin/ess/notification')
export class AdmincenterEssNotificationController {
  constructor(
    private readonly notificationService: AdmincenterEssNotificationService,
  ) {}

  // Create Notification
  @Post()
  @UseInterceptors(FileInterceptor('attachment'))
  async create(
    @Body() dto: CreateNotificationDto,
    @UploadedFile() attachment?: Express.Multer.File,
  ) {
    return this.notificationService.create(
      dto,
      1, // Temporary CreatedBy
      attachment,
    );
  }

  // Get Current Notification List
  @Get()
  async findAll() {
    return this.notificationService.findAll();
  }

  // Get Notification By ID
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.notificationService.findOne(id);
  }

  // Update Notification
  @Put(':id')
  @UseInterceptors(FileInterceptor('attachment'))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateNotificationDto,
    @UploadedFile() attachment?: Express.Multer.File,
  ) {
    return this.notificationService.update(
      id,
      dto,
      1, // Temporary ModifiedBy
      attachment,
    );
  }
}
