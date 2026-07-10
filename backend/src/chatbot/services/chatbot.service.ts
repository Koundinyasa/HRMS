import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HrmsDbService } from '../../db/hrms-db.service';

import { DraftService } from './draft.service';
import { ParserService } from './parser.service';
import { MenuService } from './menu.service';
import { CompanyService } from './company.service';
import { EmployeeService } from './employee.service';
import { AiService } from './ai.service';
import { LeaveService } from './leave.service';
import { ResponseService } from './response.service';

import { IntentCtx, IntentDefinition, ChatResult, ActionButton } from '../types';
import {
  PII_PATTERNS, PAYROLL_KEYWORDS, PERSONAL_INFO_KEYWORDS,
  LEAVE_ACTION_TRIGGERS, LOCAL_INTENT_KEYWORDS,
} from '../constants/keyword.constants';
import { DEFAULT_TEST_USER } from '../constants/chatbot.constants';
import { normalizeText, normalizeMessage, getGeneralHelpGuide } from '../utils/string.util';
import { fuzzyContains } from '../utils/fuzzy.util';
import { getTodayInfo } from '../utils/date.util';

@Injectable()
export class ChatbotService {
  // The extra services below default-construct themselves so that
  // `new ChatbotService(dbStub, configStub)` (used directly by the existing
  // spec files) keeps working unchanged. In the running app, NestJS's DI
  // container always passes its own resolved singleton instances for every
  // constructor parameter, so these defaults are never actually used there —
  // they only matter for manual construction outside of Nest.
  constructor(
    private readonly hrmsDbService: HrmsDbService,
    private readonly configService: ConfigService,
    private readonly draftService: DraftService = new DraftService(),
    private readonly parserService: ParserService = new ParserService(),
    private readonly menuService: MenuService = new MenuService(),
    private readonly companyService: CompanyService = new CompanyService(),
    private readonly employeeService: EmployeeService = new EmployeeService(),
    private readonly aiService: AiService = new AiService(configService),
    private readonly leaveService: LeaveService = new LeaveService(hrmsDbService, draftService, parserService),
    private readonly responseService: ResponseService = new ResponseService(menuService, draftService, leaveService),
  ) {}

  // ── Core intents that don't belong to any single domain service ──────────
  private readonly coreIntents: IntentDefinition[] = [
    {
      name: 'today',
      test: (ctx) => /today'?s? date|current date|what date is it|date today|what day is it|current time|what time is it|time now/i.test(ctx.msg),
      handle: async (_ctx) => getTodayInfo(),
    },
    {
      name: 'identity',
      test: (ctx) =>
        ctx.msg.includes('who are you') || ctx.msg.includes('what can you do') ||
        ctx.msg.includes('help me')     || ctx.msg.includes('general questions'),
      handle: async (ctx) => getGeneralHelpGuide(ctx.name),
    },
    {
      name: 'greeting',
      test: (ctx) =>
        /\b(hi|hey|hello|hii|heyy)\b/.test(ctx.msg) ||
        ctx.msg.includes('good morning') || ctx.msg.includes('good afternoon') || ctx.msg.includes('good evening'),
      handle: async (ctx) => getGeneralHelpGuide(ctx.name),
    },
    {
      name: 'thankYou',
      test: (ctx) =>
        ctx.msg.includes('thank') || ctx.msg.includes('thanks') || ctx.msg.includes('appreciate'),
      handle: async (ctx) => `You're welcome, ${ctx.name}. If you need anything else, just ask!`,
    },
  ];

  // Order matters — first match wins. This is the exact same order the
  // intents appeared in the original single-file version: menu, leave,
  // today/identity/greeting, employee+payroll, company, thankYou.
  private get intents(): IntentDefinition[] {
    return [
      ...this.menuService.getIntents(),
      ...this.leaveService.getIntents(),
      this.coreIntents[0], // today
      this.coreIntents[1], // identity
      this.coreIntents[2], // greeting
      ...this.employeeService.getIntents(),
      ...this.companyService.getIntents(),
      this.coreIntents[3], // thankYou
    ];
  }

  hasLeaveDraft(employeeId: string): boolean {
    return this.draftService.hasLeaveDraft(employeeId);
  }

  getMainMenu(role: string): { title: string; actions: ActionButton[] } {
    return this.menuService.getMainMenu(role);
  }

  normalizeText(raw: string): string {
    return normalizeText(raw);
  }

  fuzzyContains(text: string, keyword: string): boolean {
    return fuzzyContains(text, keyword);
  }

  classifyRoute(message: string, user: Record<string, any>): { useLocal: boolean; reason: string } {
    const employeeId: string = user?.employeeId ?? '';
    const rawMsg = message.toLowerCase();
    const msg = normalizeMessage(message);

    if (/(^|\s)menu:/i.test(message) || msg === 'menu' || msg === 'main menu') {
      return { useLocal: true, reason: 'menu' };
    }

    if (
      this.draftService.hasDraft(this.draftService.leaveDrafts, employeeId) ||
      this.draftService.hasDraft(this.draftService.partialCancelDrafts, employeeId) ||
      this.draftService.hasDraft(this.draftService.cancelChoiceDrafts, employeeId)
    ) {
      return { useLocal: true, reason: 'pending_draft' };
    }

    if (LEAVE_ACTION_TRIGGERS.some(k => msg.includes(k))) {
      return { useLocal: true, reason: 'leave_action' };
    }

    if (PII_PATTERNS.some(k => rawMsg.includes(k))) {
      return { useLocal: true, reason: 'pii' };
    }

    if (PAYROLL_KEYWORDS.some(k => rawMsg.includes(k))) {
      return { useLocal: true, reason: 'payroll' };
    }

    if (
      msg.includes('my') &&
      (PERSONAL_INFO_KEYWORDS.some(k => msg.includes(k)) || msg === 'details' || msg === 'profile')
    ) {
      return { useLocal: true, reason: 'personal_info' };
    }

    if (LOCAL_INTENT_KEYWORDS.some(k => msg.includes(k))) {
      return { useLocal: true, reason: 'known_local_intent' };
    }

    if (rawMsg.trim().split(/\s+/).filter(Boolean).length === 1) {
      return { useLocal: true, reason: 'ambiguous_single_token' };
    }

    return { useLocal: false, reason: 'safe_for_ai' };
  }

  async chat(message: string, userPayload?: Record<string, any>): Promise<ChatResult> {
    if (!message?.trim()) throw new BadRequestException('message is required');

    const user = userPayload ?? DEFAULT_TEST_USER;

    const msg = normalizeMessage(message);
    const { useLocal } = this.classifyRoute(message, user);

    if (useLocal || !this.aiService.aiEnabled) {
      const botResponse = await this.generateResponse(message, user);
      const extras = await this.responseService.buildResponseExtras(user.employeeId as string, user.role as string);
      return {
        success: true,
        userMessage: message,
        botResponse,
        actions: extras.actions,
        widget: extras.widget,
        confidence: 'LOCAL',
        timestamp: new Date(),
        user: { name: user.name as string, role: user.role as string },
      };
    }

    try {
      const botResponse = await this.aiService.generateAIResponse(msg, user);
      const extras = await this.responseService.buildResponseExtras(user.employeeId as string, user.role as string);
      return {
        success: true,
        userMessage: message,
        botResponse,
        actions: extras.actions,
        widget: extras.widget,
        confidence: 'AI',
        timestamp: new Date(),
        user: { name: user.name as string, role: user.role as string },
      };
    } catch {
      const botResponse = await this.generateResponse(message, user);
      const extras = await this.responseService.buildResponseExtras(user.employeeId as string, user.role as string);
      return {
        success: true,
        userMessage: message,
        botResponse,
        actions: extras.actions,
        widget: extras.widget,
        confidence: 'FALLBACK',
        timestamp: new Date(),
        user: { name: user.name as string, role: user.role as string },
      };
    }
  }

  status() {
    return this.aiService.status();
  }

  private async generateResponse(message: string, user: Record<string, any>): Promise<string> {
    const employeeId = user.employeeId as string;

    const info = await this.hrmsDbService.getUserInfo(employeeId);
    const selfEmployee = info?.self ?? null;

    const employees: Record<string, any>[] = selfEmployee ? [selfEmployee] : [];
    const companyData = { holidays: info?.holidays ?? [], announcements: [] as { date: string; title: string }[] };

    const leaveTypes = await this.hrmsDbService.getLeaveTypes();
    const departments = await this.hrmsDbService.getDepartments();
    const designations = await this.hrmsDbService.getDesignations();

    const companyId = (selfEmployee?.companyId as number) ?? null;
    const companyInfo = companyId ? await this.hrmsDbService.getCompanyInfo(companyId) : null;
    const branches    = companyId ? await this.hrmsDbService.getBranches(companyId) : [];
    const directory   = companyId ? await this.hrmsDbService.getEmployeeDirectory(companyId) : [];

    const ctx: IntentCtx = {
      message,
      msg: normalizeText(message),
      user,
      role:        user.role as string,
      employeeId,
      name:        user.name as string,
      employees,
      companyData,
      selfEmployee,
      leaveTypes,
      departments,
      designations,
      companyInfo,
      branches,
      directory,
    };

    const flowReply = await this.leaveService.handleLeaveFlow(ctx);
    if (flowReply !== null) return flowReply;

    for (const intent of this.intents) {
      if (intent.test(ctx)) return intent.handle(ctx);
    }

    return `I didn't quite catch that. Try the ☰ Menu button, or ask something like:\n- "How many leaves do I have left?"\n- "Apply leave"\n- "Latest leave"\n- "How do I download Form16?"`;
  }
}
