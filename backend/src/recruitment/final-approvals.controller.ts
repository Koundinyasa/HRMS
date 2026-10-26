import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { FinalApprovalDecisionDto } from './dto/final-approval-decision.dto';
import { RecruitmentService } from './recruitment.service';

@Controller('final-approvals')
@UseGuards(JwtAuthGuard)
export class FinalApprovalsController {
  constructor(private readonly recruitmentService: RecruitmentService) {}

  @Get()
  list(
    @Query('decision') decision?: string,
    @Query('search') search?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    if (
      decision &&
      !['pending', 'selected', 'rejected', 'all'].includes(
        decision.toLowerCase(),
      )
    ) {
      throw new BadRequestException(
        'Decision must be pending, selected, rejected, or all.',
      );
    }

    return this.recruitmentService.getFinalApprovals({
      decision:
        (decision?.toLowerCase() as
          | 'pending'
          | 'selected'
          | 'rejected'
          | 'all'
          | undefined) ?? 'all',
      search,
      page,
      limit,
    });
  }

  @Get(':id')
  get(@Param('id', ParseIntPipe) id: number) {
    return this.recruitmentService.getFinalApproval(id);
  }

  @Post(':id/decision')
  @HttpCode(200)
  decide(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: FinalApprovalDecisionDto,
    @Req() req: { user: { employeeId: string } },
  ) {
    return this.recruitmentService.decideFinalApproval(
      id,
      dto,
      req.user.employeeId,
    );
  }
}
