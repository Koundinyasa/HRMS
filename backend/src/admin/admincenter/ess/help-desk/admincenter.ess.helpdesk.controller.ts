import {
  Body,
  Controller,
  Get,
  Post,
  Req,
} from '@nestjs/common';

import { HelpDeskService } from './admincenter.ess.helpdesk.service';
import { CreateHelpdeskCategoryDto } from './dto/create-helpdesk-category.dto';

@Controller('ess/helpdesk')
export class HelpDeskController {
  constructor(
    private readonly helpDeskService: HelpDeskService,
  ) {}

  // Get Category Types
  @Get('category-types')
  async getCategoryTypes() {
    return this.helpDeskService.getCategoryTypes();
  }

  // Create Category
  @Post('category')
  async createCategory(
    @Body() dto: CreateHelpdeskCategoryDto,
    @Req() req: any,
  ) {
    const createdBy = req.user?.userId;

    return this.helpDeskService.createCategory(
      dto,
      createdBy,
    );
  }

  // Get Categories
  @Get('categories')
  async getCategories() {
    return this.helpDeskService.getCategories();
  }
}