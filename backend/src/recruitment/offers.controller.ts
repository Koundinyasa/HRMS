import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Header,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  StreamableFile,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CreateOfferDto } from './dto/create-offer.dto';
import { OfferResponseDto } from './dto/offer-response.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { OffersService } from './offers.service';
import { Roles } from '../common/decorators/roles.decorator';
import { ADMIN_PORTAL_ROLES } from '../common/constants/roles';

@Roles(...ADMIN_PORTAL_ROLES)
@Controller('offers')
@UseGuards(JwtAuthGuard)
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Get()
  list(
    @Query('search') search?: string,
    @Query('status') status?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const normalizedStatus = status?.toLowerCase() ?? 'all';
    if (
      !['all', 'draft', 'extended', 'accepted', 'rejected'].includes(
        normalizedStatus,
      )
    ) {
      throw new BadRequestException(
        'Status must be all, draft, extended, accepted, or rejected.',
      );
    }
    return this.offersService.getOffers({
      search,
      status: normalizedStatus as
        | 'all'
        | 'draft'
        | 'extended'
        | 'accepted'
        | 'rejected',
      page,
      limit,
    });
  }

  @Post()
  create(
    @Body() dto: CreateOfferDto,
    @Req() req: { user: { employeeId: string } },
  ) {
    return this.offersService.createOffer(dto, req.user.employeeId);
  }

  @Get(':id/letter-url')
  async getLetterUrl(@Param('id', ParseIntPipe) id: number) {
    return { url: await this.offersService.getOfferLetterUrl(id) };
  }

  @Get(':id/letter')
  @Header('Content-Type', 'application/pdf')
  @Header('Content-Disposition', 'inline')
  async getLetter(@Param('id', ParseIntPipe) id: number) {
    return new StreamableFile(await this.offersService.getOfferLetter(id));
  }

  @Get(':id')
  get(@Param('id', ParseIntPipe) id: number) {
    return this.offersService.getOffer(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateOfferDto,
    @Req() req: { user: { employeeId: string } },
  ) {
    if (dto.offeredSalary === undefined && dto.negotiatedSalary === undefined) {
      throw new BadRequestException(
        'Provide at least one offer field to update.',
      );
    }
    return this.offersService.updateDraftOffer(id, dto, req.user.employeeId);
  }

  @Post(':id/extend')
  extend(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: { user: { employeeId: string } },
  ) {
    return this.offersService.extendOffer(id, req.user.employeeId);
  }

  @Post(':id/response')
  respond(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: OfferResponseDto,
    @Req() req: { user: { employeeId: string } },
  ) {
    return this.offersService.recordOfferResponse(
      id,
      dto.response,
      req.user.employeeId,
    );
  }
}
