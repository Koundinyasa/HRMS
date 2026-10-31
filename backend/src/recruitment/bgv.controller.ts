import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { StartBgvDto } from './dto/start-bgv.dto';
import { UpdateBgvDocumentDto } from './dto/update-bgv-document.dto';
import { UpdateBgvDto } from './dto/update-bgv.dto';
import { BgvService } from './bgv.service';
import { Roles } from '../common/decorators/roles.decorator';
import { ADMIN_PORTAL_ROLES } from '../common/constants/roles';

@Roles(...ADMIN_PORTAL_ROLES)
@Controller('bgv')
export class BgvController {
  constructor(private readonly bgvService: BgvService) {}

  @Get()
  list(
    @Req() req: { user: { employeeId: string } },
    @Query('search') search?: string,
    @Query('status') status?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const normalizedStatus = status?.toLowerCase() ?? 'all';
    if (!['all', 'in-progress', 'clear', 'failed'].includes(normalizedStatus)) {
      throw new BadRequestException(
        'Status must be all, in-progress, clear, or failed.',
      );
    }
    return this.bgvService.getBgvs(req.user.employeeId, {
      search,
      status: normalizedStatus as 'all' | 'in-progress' | 'clear' | 'failed',
      page,
      limit,
    });
  }

  @Post()
  start(
    @Body() dto: StartBgvDto,
    @Req() req: { user: { employeeId: string } },
  ) {
    return this.bgvService.startBgv(dto.applicationId, req.user.employeeId);
  }

  @Get(':id')
  get(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: { user: { employeeId: string } },
  ) {
    return this.bgvService.getBgv(id, req.user.employeeId);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateBgvDto,
    @Req() req: { user: { employeeId: string } },
  ) {
    return this.bgvService.updateBgv(id, dto, req.user.employeeId);
  }

  @Patch('documents/:documentId')
  updateDocument(
    @Param('documentId', ParseIntPipe) documentId: number,
    @Body() dto: UpdateBgvDocumentDto,
    @Req() req: { user: { employeeId: string } },
  ) {
    return this.bgvService.updateBgvDocument(
      documentId,
      dto,
      req.user.employeeId,
    );
  }
}
