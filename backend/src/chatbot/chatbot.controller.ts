import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
 
import { ChatbotService } from './chatbot.service';
import { ChatRequestDto } from './dto/chat-request.dto';
import { HrmsDbService } from '../db/hrms-db.service';
import { ReportService } from './services/report.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { DraftService } from './services/draft.service';
 
const isPrivileged = (role: string) => role === 'admin' || role === 'hr';
 
// Only accept a clean 6-digit hex value (with or without a leading #).
const HEX_COLOR_RE = /^#?([0-9a-fA-F]{6})$/;
 
function sanitizeThemeColor(raw: string | undefined): string | undefined {
  if (!raw) return undefined;
 
  const match = HEX_COLOR_RE.exec(raw);
 
  return match ? `#${match[1]}` : undefined;
}
 
@Controller('chatbot')
export class ChatbotController {
  constructor(
    private readonly chatbotService: ChatbotService,
    private readonly hrmsDbService: HrmsDbService,
    private readonly reportService: ReportService,
    private readonly draftService: DraftService,
  ) {}
 
  // ============================================================
  // CHAT
  // ============================================================
 
  @UseGuards(JwtAuthGuard)
  @Post('chat')
  async chat(@Body() body: ChatRequestDto, @Req() req: any): Promise<any> {
    return this.chatbotService.chat(body.message, req.user);
  }
 
  // ============================================================
  // RESET CONVERSATION
  // ============================================================
 
  @UseGuards(JwtAuthGuard)
  @Post('reset')
  resetConversation(@Req() req: any): any {
    const employeeId = req.user.employeeId;
 
    this.draftService.resetConversation(employeeId);
 
    return {
      success: true,
      message: 'Conversation reset successfully',
    };
  }
 
  // ============================================================
  // TEAM EXPORT
  // Existing functionality - DO NOT CHANGE
  // ============================================================
 
  @UseGuards(JwtAuthGuard)
  @Get('teams/:teamId/export')
  async exportTeam(
    @Param('teamId') teamId: string,
    @Query('format') format: string,
    @Query('color') color: string,
    @Req() req: any,
    @Res() res: Response,
  ): Promise<void> {
    const role = req.user?.role as string;
 
    if (!isPrivileged(role)) {
      throw new ForbiddenException('Only HR/Admin can export team data.');
    }
 
    const id = Number(teamId);
 
    if (!Number.isInteger(id) || id <= 0) {
      throw new BadRequestException('Invalid team ID.');
    }
 
    const members = await this.hrmsDbService.getTeamMembers(id);
 
    const teams = await this.hrmsDbService.getActiveTeams();
 
    const team = teams.find((t) => t.id === id);
 
    const teamName = team?.name ?? `Team ${id}`;
 
    const themeColor = sanitizeThemeColor(color);
 
    // ------------------------------------------------------------
    // EXCEL
    // ------------------------------------------------------------
 
    if (format === 'excel') {
      const buffer = await this.reportService.generateTeamExcel(
        teamName,
        members,
        themeColor,
      );
 
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
 
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${teamName.replace(/\s+/g, '_')}-roster.xlsx"`,
      );
 
      res.send(buffer);
 
      return;
    }
 
    // ------------------------------------------------------------
    // PDF
    // ------------------------------------------------------------
 
    try {
      const buffer = await this.reportService.generateTeamPdf(
        teamName,
        members,
        themeColor,
      );
 
      res.setHeader('Content-Type', 'application/pdf');
 
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${teamName.replace(/\s+/g, '_')}-roster.pdf"`,
      );
 
      res.send(buffer);
    } catch (err) {
      console.error('=== PDF GENERATION FAILED ===');
 
      console.error(err);
 
      res.status(500).json({
        success: false,
        message: (err as Error).message,
      });
    }
  }
 
  // ============================================================
  // ALL EMPLOYEES EXPORT
  // Admin / HR only
  // ============================================================
 
  @UseGuards(JwtAuthGuard)
  @Get('employees/export')
  async exportAllEmployees(
    @Query('format') format: string,
    @Query('color') color: string,
    @Req() req: any,
    @Res() res: Response,
  ): Promise<void> {
    const role = req.user?.role as string;
 
    // ------------------------------------------------------------
    // AUTHORIZATION
    // ------------------------------------------------------------
 
    if (!isPrivileged(role)) {
      throw new ForbiddenException('Only HR/Admin can export employee data.');
    }
 
    // ------------------------------------------------------------
    // GET ALL EMPLOYEES
    // ------------------------------------------------------------
 
    const employees = await this.hrmsDbService.getAllEmployees();
 
    if (!employees || employees.length === 0) {
      throw new BadRequestException('No employees found to export.');
    }
 
    const themeColor = sanitizeThemeColor(color);
 
    // ------------------------------------------------------------
    // EXCEL
    // ------------------------------------------------------------
 
    if (format === 'excel') {
      const buffer = await this.reportService.generateAllEmployeesExcel(
        employees,
        themeColor,
      );
 
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
 
      res.setHeader(
        'Content-Disposition',
        'attachment; filename="all-employees.xlsx"',
      );
 
      res.send(buffer);
 
      return;
    }
 
    // ------------------------------------------------------------
    // PDF
    // ------------------------------------------------------------
 
    try {
      const buffer = await this.reportService.generateAllEmployeesPdf(
        employees,
        themeColor,
      );
 
      res.setHeader('Content-Type', 'application/pdf');
 
      res.setHeader(
        'Content-Disposition',
        'attachment; filename="all-employees.pdf"',
      );
 
      res.send(buffer);
    } catch (err) {
      console.error('=== ALL EMPLOYEES PDF GENERATION FAILED ===');
 
      console.error(err);
 
      res.status(500).json({
        success: false,
        message: (err as Error).message,
      });
    }
  }
}