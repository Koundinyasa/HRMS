import {
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
import { LeaveApiService } from './services/leave-api.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { AiService } from './services/ai.service';
import { DraftService } from './services/draft.service';
 
const isPrivileged = (role: string) => role === 'admin' || role === 'hr';
 
// Only accept a clean 6-digit hex value (with or without a leading #) as the
// theme color — this comes from a query string the browser controls, so it
// gets validated before ever reaching the PDF/Excel generator rather than
// trusted as-is.
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
    private readonly leaveApiService: LeaveApiService,
    private readonly aiService: AiService,
    private readonly draftService: DraftService,
  ) {}
 
  @UseGuards(JwtAuthGuard)
  @Post('chat')
  async chat(@Body() body: ChatRequestDto, @Req() req: any): Promise<any> {
    return this.chatbotService.chat(body.message, req.user);
  }
 
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
 
  @Get('status')
  status(): any {
    return this.chatbotService.status();
  }
 
  @Post('debug-ai-intent')
  async debugAIIntent(@Body() body: any): Promise<any> {
    console.log('========== AI INTENT TEST ==========');
    console.log('BODY:', body);
    console.log('BODY MESSAGE:', body?.message);
    console.log('====================================');
 
    try {
      const message = body?.message;
 
      if (!message || typeof message !== 'string') {
        return {
          success: false,
          error: 'message field is missing from request body',
          receivedBody: body,
        };
      }
    } catch (error: any) {
      console.error('========== AI INTENT ERROR ==========');
      console.error('Error:', error);
      console.error('Message:', error?.message);
      console.error('Response:', error?.response?.data);
      console.error('====================================');
 
      return {
        success: false,
        error: error?.message || 'AI intent extraction failed',
        details: error?.response?.data ?? null,
      };
    }
  }
 
  @UseGuards(JwtAuthGuard)
  @Get('debug-leave-history')
  async debugLeaveHistory(@Req() req: any): Promise<any> {
    return this.leaveApiService.getLeaveHistory(req.user);
  }
 
  // Generates and streams a team roster as PDF or Excel. Admin/HR only —
  // guarded both by the JWT cookie (identity) and this explicit role check
  // (authorization), matching the same access rule used inside the chatbot
  // flow itself so the download link can't be used to bypass it.
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
    const members = await this.hrmsDbService.getTeamMembers(id);
    const teams = await this.hrmsDbService.getActiveTeams();
    const team = teams.find((t) => t.id === id);
    const teamName = team?.name ?? `Team ${id}`;
 
    // Falls back to the report service's own default purple if the color
    // wasn't supplied or didn't pass validation — same fixed look as before
    // for any caller that doesn't send one.
    const themeColor = sanitizeThemeColor(color);
 
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
 
    // default to pdf
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
      res.status(500).json({ success: false, message: (err as Error).message });
    }
  }
}