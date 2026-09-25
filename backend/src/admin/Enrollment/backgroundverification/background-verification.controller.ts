import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { BackgroundVerificationService } from './background-verification.service';
import { InitiateBackgroundVerificationDto } from './dto/initiate-background-verification.dto';
import { SaveBackgroundVerificationSettingsDto } from './dto/save-background-verification-settings.dto';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';

@Controller('admin/background-verification')
@UseGuards(JwtAuthGuard)
export class BackgroundVerificationController {
  constructor(
    private readonly backgroundVerificationService: BackgroundVerificationService,
  ) {}

  // ==========================================
  // Dashboard
  // GET /background-verification/dashboard
  // ==========================================

  @Get('dashboard')
  async getDashboard(
    @Req() req: any,
    @Query('month') month?: number,
    @Query('year') year?: number,
  ) {
    const companyId = req.user.companyId;

    return this.backgroundVerificationService.getDashboard(
      month,
      year,
      companyId,
    );
  }

  // ==========================================
  // Initiate List
  // GET /background-verification/initiate-list
  // ==========================================

  @Get('initiate-list')
  async getInitiateList(
    @Req() req: any,
    @Query('searchText') searchText?: string,
    @Query('designationId') designationId?: number,
  ) {
    const companyId = req.user.companyId;

    return this.backgroundVerificationService.getInitiateList(
      searchText,
      designationId,
      companyId,
    );
  }

  // ==========================================
  // Initiate BGV
  // POST /background-verification/initiate
  // ==========================================

  @Post('initiate')
  async initiateBGV(
    @Req() req: any,
    @Body() dto: InitiateBackgroundVerificationDto,
  ) {
    const userId = req.user.userId;

    return this.backgroundVerificationService.initiateBGV(
      dto.applicationIds,
      userId,
      dto.remarks,
    );
  }

  // ==========================================
  // Ongoing BGV
  // GET /background-verification/ongoing
  // ==========================================

  @Get('ongoing')
  async getOngoingList(
    @Req() req: any,
    @Query('searchText') searchText?: string,
    @Query('month') month?: number,
    @Query('year') year?: number,
  ) {
    const companyId = req.user.companyId;

    return this.backgroundVerificationService.getOngoingList(
      searchText,
      month,
      year,
      companyId,
    );
  }

  // ==========================================
  // Completed BGV
  // GET /background-verification/completed
  // ==========================================

  @Get('completed')
  async getCompletedList(
    @Req() req: any,
    @Query('searchText') searchText?: string,
    @Query('month') month?: number,
    @Query('year') year?: number,
  ) {
    const companyId = req.user.companyId;

    return this.backgroundVerificationService.getCompletedList(
      searchText,
      month,
      year,
      companyId,
    );
  }

  // ==========================================
  // Get Settings
  // GET /background-verification/settings
  // ==========================================

  @Get('settings')
  async getSettings(@Req() req: any) {
    const companyId = req.user.companyId;

    return this.backgroundVerificationService.getSettings(companyId);
  }

  // ==========================================
  // Save Settings
  // PUT /background-verification/settings
  // ==========================================

  @Put('settings')
  async saveSettings(
    @Req() req: any,
    @Body() dto: SaveBackgroundVerificationSettingsDto,
  ) {
    const companyId = req.user.companyId;
    const userId = req.user.userId;

    //   console.log('========== BGV SAVE SETTINGS ==========');
    // console.log('JWT companyId:', req.user.companyId);
    // console.log('JWT companyId type:', typeof req.user.companyId);
    // console.log('Converted companyId:', companyId);

    // console.log('JWT userId:', req.user.userId);
    // console.log('JWT userId type:', typeof req.user.userId);
    // console.log('Converted userId:', userId);

    // console.log('DTO:', dto);
    // console.log('========================================');

    return this.backgroundVerificationService.saveSettings(
      companyId,
      dto.configKey,
      dto.configValue,
      dto.requireExternalVerifier,
      userId,
    );
  }

  // ==========================================
  // Audit Logs
  // GET /background-verification/audit-logs
  // ==========================================

  @Get('audit-logs')
  async getAuditLogs(
    @Req() req: any,
    @Query('searchText') searchText?: string,
    @Query('userId') userId?: number,
    @Query('employeeName') employeeName?: string,
  ) {
    return this.backgroundVerificationService.getAuditLogs(
      searchText,
      userId,
      employeeName,
    );
  }

  // ==========================================
  // Verification Checklist
  // GET /background-verification/:bgvId/checklist
  // ==========================================

  @Get(':bgvId/checklist')
  async getVerificationChecklist(
    @Req() req: any,
    @Param('bgvId') bgvId: string,
  ) {
    const companyId = req.user.companyId;

    return this.backgroundVerificationService.getVerificationChecklist(
      Number(bgvId),
      companyId,
    );
  }
  @Get('test')
  async test() {
    return {
      success: true,
      message: 'Background Verification controller working',
    };
  }
}
