import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HrmsDbService } from '../db/hrms-db.service';

import { DraftService } from './services/draft.service';
import { ParserService } from './services/parser.service';
import { MenuService } from './services/menu.service';
import { CompanyService } from './services/company.service';
import { EmployeeService } from './services/employee.service';
import { AiService } from './services/ai.service';
import { LeaveService } from './services/leave.service';
import { LeaveApiService } from './services/leave-api.service';
import { HttpService } from '@nestjs/axios';
import { JwtService } from '@nestjs/jwt';
import { ResponseService } from './services/response.service';
import { TeamService } from './services/team.service';

import { IntentCtx, IntentDefinition, ChatResult, ActionButton } from './types';
import {
  PII_PATTERNS,
  PAYROLL_KEYWORDS,
  PERSONAL_INFO_KEYWORDS,
  LEAVE_ACTION_TRIGGERS,
} from './constants/keyword.constants';
import { DEFAULT_TEST_USER } from './constants/chatbot.constants';
import { normalizeText, normalizeMessage } from './utils/string.util';
import { fuzzyContains } from './utils/fuzzy.util';
import { getTodayInfo } from './utils/date.util';

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
    private readonly companyService: CompanyService = new CompanyService(
      menuService,
      draftService,
    ),
    private readonly employeeService: EmployeeService = new EmployeeService(
      draftService,
    ),
    private readonly aiService: AiService = new AiService(configService),
    // JwtService here has no real secret configured — fine, since this
    // default path is only ever used by the spec files' direct
    // `new ChatbotService(dbStub, configStub)` construction, none of which
    // actually exercise a leave-balance/history call that would need to
    // mint a real token. NestJS's own DI always supplies the properly
    // configured, globally-shared JwtService in the running app.
    private readonly leaveApiService: LeaveApiService = new LeaveApiService(
      new HttpService(),
      new JwtService(),
    ),
    private readonly leaveService: LeaveService = new LeaveService(
      hrmsDbService,
      draftService,
      parserService,
      leaveApiService,
    ),
    private readonly responseService: ResponseService = new ResponseService(
      menuService,
      draftService,
      leaveService,
    ),
    private readonly teamService: TeamService = new TeamService(
      hrmsDbService,
      draftService,
    ),
  ) {}

  // ── Core intents that don't belong to any single domain service ──────────
  private readonly coreIntents: IntentDefinition[] = [
    {
      name: 'today',
      test: (ctx) =>
        /today'?s? date|current date|what date is it|date today|what day is it|current time|what time is it|time now/i.test(
          ctx.msg,
        ),
      handle: async (_ctx) => getTodayInfo(),
    },
    {
      name: 'identity',
      test: (ctx) =>
        ctx.msg.includes('who are you') ||
        ctx.msg.includes('what can you do') ||
        ctx.msg.includes('help me') ||
        ctx.msg.includes('general questions'),
      handle: async (ctx) => {
        this.draftService.pendingSteps.set(ctx.employeeId, {
          title: 'What I can help with',
          items: [
            'Company holidays, announcements, and office policies',
            "Today's date and general portal questions",
            'Apply for leave — just say "Apply leave"',
          ],
          note: 'Use the ☰ Menu anytime to browse everything I can do.',
        });
        return `Hi ${ctx.name} 👋`;
      },
    },
    {
      name: 'greeting',
      test: (ctx) =>
        /\b(hi|hey|hello|hii|heyy)\b/.test(ctx.msg) ||
        ctx.msg.includes('good morning') ||
        ctx.msg.includes('good afternoon') ||
        ctx.msg.includes('good evening'),
      handle: async (ctx) => {
        this.draftService.pendingSteps.set(ctx.employeeId, {
          title: 'What I can help with',
          items: [
            'Company holidays, announcements, and office policies',
            "Today's date and general portal questions",
            'Apply for leave — just say "Apply leave"',
          ],
          note: 'Use the ☰ Menu anytime to browse everything I can do.',
        });
        return `Hi ${ctx.name} 👋`;
      },
    },
    {
      name: 'thankYou',
      test: (ctx) =>
        ctx.msg.includes('thank') ||
        ctx.msg.includes('thanks') ||
        ctx.msg.includes('appreciate'),
      handle: async (ctx) =>
        `You're welcome, ${ctx.name}. If you need anything else, just ask!`,
    },
  ];

  // Order matters — first match wins. This is the exact same order the
  // intents appeared in the original single-file version: menu, leave,
  // today/identity/greeting, employee+payroll, company, thankYou.
  private get intents(): IntentDefinition[] {
    return [
      ...this.menuService.getIntents(),
      ...this.teamService.getIntents(),
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

  // Hard, non-negotiable blocks — these force local handling no matter what,
  // even before we bother checking whether any real intent matches. This is
  // defense-in-depth *underneath* the real check (which now happens by
  // actually attempting local resolution in chat() below): even if intent
  // matching somehow missed something, a message that smells like PII,
  // payroll, personal info, or an in-progress leave action still never
  // reaches the AI.
  hasHardLocalBlock(
    message: string,
    user: Record<string, unknown>,
  ): { blocked: boolean; reason: string } {
    const employeeId = String(user?.employeeId ?? '');
    const rawMsg = message.toLowerCase();
    const msg = normalizeMessage(message);

    if (/(^|\s)menu:/i.test(message) || msg === 'menu' || msg === 'main menu') {
      return { blocked: true, reason: 'menu' };
    }

    if (
      this.draftService.hasDraft(this.draftService.leaveDrafts, employeeId) ||
      this.draftService.hasDraft(
        this.draftService.partialCancelDrafts,
        employeeId,
      ) ||
      this.draftService.hasDraft(
        this.draftService.cancelChoiceDrafts,
        employeeId,
      ) ||
      this.draftService.hasDraft(this.draftService.teamDrafts, employeeId) ||
      this.draftService.hasDraft(
        this.draftService.employeeDirectoryDrafts,
        employeeId,
      )
    ) {
      return { blocked: true, reason: 'pending_draft' };
    }

    if (LEAVE_ACTION_TRIGGERS.some((k) => msg.includes(k))) {
      return { blocked: true, reason: 'leave_action' };
    }

    if (PII_PATTERNS.some((k) => rawMsg.includes(k))) {
      return { blocked: true, reason: 'pii' };
    }

    const hasPayrollKeyword = PAYROLL_KEYWORDS.some((k) => rawMsg.includes(k));

    const isPersonalPayrollQuestion =
      /\b(my|me|mine|i|employee|staff)\b/.test(rawMsg) && hasPayrollKeyword;

    const isPayrollDocumentRequest =
      /\b(form\s*16|form16|payslip|pay\s*slip|salary\s*slip|tax\s*statement)\b/i.test(
        rawMsg,
      );

    if (isPersonalPayrollQuestion || isPayrollDocumentRequest) {
      return { blocked: true, reason: 'payroll' };
    }

    if (
      msg.includes('my') &&
      (PERSONAL_INFO_KEYWORDS.some((k) => msg.includes(k)) ||
        msg === 'details' ||
        msg === 'profile')
    ) {
      return { blocked: true, reason: 'personal_info' };
    }

    return { blocked: false, reason: '' };
  }

  async chat(
    message: string,
    userPayload?: Record<string, unknown>,
  ): Promise<ChatResult> {
    if (!message?.trim()) {
      throw new BadRequestException('message is required');
    }
    const user = userPayload ?? DEFAULT_TEST_USER;
    const buildResult = async (
      botResponse: string,
      confidence: 'LOCAL' | 'AI' | 'FALLBACK',
    ): Promise<ChatResult> => {
      const extras = await this.responseService.buildResponseExtras(
        user.employeeId as string,
        user.role as string,
        user,
      );
      if (extras.widget?.type === 'date') {
        const info = await this.hrmsDbService.getUserInfo(
          user.employeeId as string,
        );
        extras.widget = {
          ...extras.widget,
          holidays: (info?.holidays ?? []).map((holiday: any) => ({
            date: holiday.date,
            name: holiday.name,
          })),
        };
      }
      return {
        success: true,
        userMessage: message,
        botResponse,
        actions: extras.actions,
        widget: extras.widget,
        confidence,
        timestamp: new Date(),
        user: { name: user.name as string, role: user.role as string },
      };
    };

    // Step 1 — hard, unconditional blocks (leave actions, PII, payroll,
    // personal info, an in-progress flow). No amount of AI broadening ever
    // gets a chance to touch these — always resolved locally.
    const { blocked } = this.hasHardLocalBlock(message, user);
    if (blocked || !this.aiService.aiEnabled) {
      const { text } = await this.generateResponse(message, user);
      return buildResult(text, 'LOCAL');
    }

    // Step 2 — actually attempt to resolve this locally, for real, using the
    // exact same rules that would answer it anyway. This is the real
    // "is this a company/office matter?" check — not a keyword guess. Any
    // company/office question that our own rules recognise is answered here
    // and never goes near the AI.
    const local = await this.generateResponse(message, user);
    if (local.matched) {
      return buildResult(local.text, 'LOCAL');
    }

    // Step 3 — nothing in our own rules recognised this message at all, so
    // it's treated as a general, non-company question and handed to the AI.
    try {
      const botResponse = await this.aiService.generateAIResponse(
        message.trim(),
        user,
      );
      return buildResult(botResponse, 'AI');
    } catch (error) {
      return buildResult(local.text, 'FALLBACK');
    }
  }

  status() {
    return this.aiService.status();
  }

  private async generateResponse(
    message: string,
    user: Record<string, unknown>,
  ): Promise<{ matched: boolean; text: string }> {
    const employeeId = user.employeeId as string;

    const info = await this.hrmsDbService.getUserInfo(employeeId);
    const selfEmployee = info?.self ?? null;

    const employees: Record<string, unknown>[] = selfEmployee ? [selfEmployee] : [];
    const companyData = {
      holidays: info?.holidays ?? [],
      announcements: [] as { date: string; title: string }[],
    };

    const leaveTypesRaw = await this.leaveApiService.getLeaveTypes(user);
    const leaveTypes = (leaveTypesRaw ?? []).map((t: any) => ({
      id: t.ID,
      name: t.Name,
      code: t.Code,
      description: t.Description,
      annualQuota: t.AnnualQuota,
    }));

    // Batched: departments, designations, companyInfo, ownOffice, and
    // branches now come from one USP_GetCompanyMasterData call instead of
    // 5 separate ones (getDepartments/getDesignations/getCompanyInfo/
    // getBranches/getEmployeeOffice). getEmployeeDirectory stays a separate
    // call — it's on its own SP (USP_GetEmployeeDirectory), not part of the
    // merged procedure.
    const companyId = (selfEmployee?.companyId as number) ?? null;
    const master = await this.hrmsDbService.getCompanyMasterData(
      companyId,
      employeeId,
    );
    const departments = master.departments;
    const designations = master.designations;
    const companyInfo = master.companyInfo;
    const branches = master.branches;
    const ownOffice = master.ownOffice;
    const directory = companyId
      ? await this.hrmsDbService.getEmployeeDirectory(companyId)
      : [];

    const ctx: IntentCtx = {
      message,
      msg: normalizeText(message),
      user,
      role: user.role as string,
      employeeId,
      name: user.name as string,
      employees,
      companyData,
      selfEmployee,
      leaveTypes,
      departments,
      designations,
      companyInfo,
      branches,
      ownOffice,
      directory,
    };

    const flowReply = await this.leaveService.handleLeaveFlow(ctx);
    if (flowReply !== null) return { matched: true, text: flowReply };

    for (const intent of this.intents) {
      if (intent.test(ctx))
        return { matched: true, text: await intent.handle(ctx) };
    }

    return {
      matched: false,
      text: `I didn't quite catch that. Try the ☰ Menu button, or ask something like:\n- "How many leaves do I have left?"\n- "Apply leave"\n- "Latest leave"\n- "How do I download Form16?"`,
    };
  }
}