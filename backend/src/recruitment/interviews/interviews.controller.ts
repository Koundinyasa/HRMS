import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { InterviewsService } from './interviews.service';
import {
  InterviewFeedbackDto,
  InterviewerCompetencyFeedbackDto,
  InterviewCancelDto,
  InterviewListQueryDto,
  InterviewScheduleDto,
  InterviewStatusDto,
  TechnicalRoundDecisionDto,
  TechnicalRoundTwoScheduleDto,
  UpdateInterviewDto,
} from './interviews.dto';

@Controller('recruitment')
@UseGuards(JwtAuthGuard)
export class InterviewsController {
  constructor(private readonly interviews: InterviewsService) {}

  @Get('interviewers')
  getInterviewers() {
    return this.interviews.getInterviewers();
  }

  @Get('interviews/schedule-options')
  scheduleOptions() {
    return this.interviews.getScheduleOptions();
  }

  @Get('interviews/pending-schedule')
  pendingSchedule(@Query('search') search?: string) {
    return this.interviews.pendingSchedule(search);
  }

  @Get('interviews/today')
  today(
    @Query() query: InterviewListQueryDto,
    @Req() request: { user: { employeeId: string } },
  ) {
    return this.interviews.getTodayInterviews(request.user.employeeId, query);
  }

  @Get('interviews')
  list(
    @Query() query: InterviewListQueryDto,
    @Req() request: { user: { employeeId: string } },
  ) {
    return this.interviews.list(request.user.employeeId, query);
  }

  @Get('interviewer-feedback')
  interviewerFeedbackWorklist(
    @Req() request: { user: { employeeId: string } },
  ) {
    return this.interviews.getInterviewerFeedbackWorklist(
      request.user.employeeId,
    );
  }

  @Post('applications/:applicationId/interviews')
  schedule(
    @Param('applicationId', ParseIntPipe) applicationId: number,
    @Body() dto: InterviewScheduleDto,
    @Req() request: { user: { employeeId: string } },
  ) {
    return this.interviews.schedule(
      applicationId,
      dto,
      request.user.employeeId,
    );
  }

  @Patch('interviews/:id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateInterviewDto,
  ) {
    return this.interviews.updateInterview(id, dto);
  }

  @Post('interviews/:id/cancel')
  cancel(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: InterviewCancelDto,
  ) {
    return this.interviews.cancelInterview(id, dto.reason);
  }

  @Get('interviews/:id')
  get(@Param('id', ParseIntPipe) id: number) {
    return this.interviews.getInterview(id);
  }

  @Get('interviews/:id/feedback')
  getFeedback(@Param('id', ParseIntPipe) id: number) {
    return this.interviews.getInterviewFeedback(id);
  }

  @Post('interviews/:id/feedback')
  feedback(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: InterviewFeedbackDto,
    @Req() request: { user: { employeeId: string } },
  ) {
    return this.interviews.submitFeedback(id, dto, request.user.employeeId);
  }

  @Post('interviews/:id/competency-feedback')
  submitCompetencyFeedback(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: InterviewerCompetencyFeedbackDto,
    @Req() request: { user: { employeeId: string } },
  ) {
    return this.interviews.submitCompetencyFeedback(
      id,
      dto,
      request.user.employeeId,
    );
  }

  @Post('interviews/:id/technical-round-2')
  scheduleTechnicalRoundTwo(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: TechnicalRoundTwoScheduleDto,
    @Req() request: { user: { employeeId: string } },
  ) {
    return this.interviews.scheduleTechnicalRoundTwo(
      id,
      dto,
      request.user.employeeId,
    );
  }

  @Post('interviews/:id/technical-round-decision')
  technicalRoundDecision(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: TechnicalRoundDecisionDto,
    @Req() request: { user: { employeeId: string } },
  ) {
    return this.interviews.setTechnicalRoundDecision(
      id,
      dto.needsTechnical2,
      request.user.employeeId,
    );
  }

  @Patch('interviews/:id/status')
  setStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: InterviewStatusDto,
  ) {
    return this.interviews.setStatus(id, dto);
  }
}
