import { Injectable } from '@nestjs/common';
import { HrmsDbService } from '../../db/hrms-db.service';
import { DraftService } from './draft.service';
import { ParserService } from './parser.service';
import { IntentCtx, IntentDefinition, LeaveTypeOption } from '../types';
import { formatLeaveRange, formatDayCount } from '../utils/date.util';

@Injectable()
export class LeaveService {
  constructor(
    private readonly hrmsDbService: HrmsDbService,
    private readonly draftService: DraftService,
    private readonly parserService: ParserService,
  ) {}

  async handleLeaveFlow(ctx: IntentCtx): Promise<string | null> {
    const draft = this.draftService.getDraft(this.draftService.leaveDrafts, ctx.employeeId);
    if (!draft) return null;
    if (draft.step === 'ready') return null;

    if (ctx.msg.includes('discard') || ctx.msg === 'cancel' || ctx.msg.includes('cancel leave')) {
      this.draftService.deleteDraft(this.draftService.leaveDrafts, ctx.employeeId);
      return `No problem — I've cancelled that. Nothing was submitted. Say "Apply leave" to start again.`;
    }

    const iso = this.parserService.extractIsoDate(ctx.message);

    if (draft.step === 'awaiting_start') {
      if (!iso) return `Please pick your leave start date below (or type it as YYYY-MM-DD).`;
      draft.startDate = iso;
      draft.leaveDate = iso;
      draft.step = 'awaiting_end';
      this.draftService.setDraft(this.draftService.leaveDrafts, ctx.employeeId, draft);
      return `Start date set to ${iso}. Now pick your end date (same as start for a single day).`;
    }

    if (draft.step === 'awaiting_end') {
      if (!iso) return `Please pick your leave end date below (or type it as YYYY-MM-DD).`;
      if (iso < draft.startDate) {
        return `The end date can't be before the start date (${draft.startDate}). Please pick a later date.`;
      }
      draft.endDate = iso;
      draft.duration = Math.floor((new Date(iso).getTime() - new Date(draft.startDate).getTime()) / 86400000) + 1;
      draft.step = 'awaiting_type';
      this.draftService.setDraft(this.draftService.leaveDrafts, ctx.employeeId, draft);
      return `End date set to ${iso} (${formatDayCount(draft.duration)}). Now choose your leave type below.`;
    }

    if (draft.step === 'awaiting_type') {
      const code = this.parserService.extractLeaveTypeCode(ctx.message, ctx.leaveTypes);
      if (!code) return `Please choose a leave type from the buttons below.`;

      const picked = ctx.leaveTypes.find(t => (t.code ?? '').toUpperCase() === code);
      const isSickLeave =
        (picked?.name ?? '').toLowerCase().includes('sick') || code === 'SL';
      const isSingleDay = draft.startDate === draft.endDate;
      if (isSickLeave && !isSingleDay) {
        return `Sick Leave for more than one day needs a supporting document, which I can't attach here. Please apply multi-day Sick Leave from the Leave Requests page in the portal.\n\nFor a single-day Sick Leave, pick a single date and choose Sick Leave again — or pick a different leave type from the buttons above.`;
      }

      draft.leaveType = code;

      if (isSingleDay) {
        draft.step = 'awaiting_dayChoice';
        this.draftService.setDraft(this.draftService.leaveDrafts, ctx.employeeId, draft);
        return `Leave type set to ${code}. Is this a full day or a half day?`;
      }

      draft.step = 'awaiting_reason';
      this.draftService.setDraft(this.draftService.leaveDrafts, ctx.employeeId, draft);
      return `Leave type set to ${code}. Finally, add a reason (or tap Skip).`;
    }

    if (draft.step === 'awaiting_dayChoice') {
      const m = ctx.msg;
      const choseHalf = m.includes('half');
      const choseFull = m.includes('full');
      if (!choseHalf && !choseFull) {
        return `Please tap "Full Day" or "Half Day".`;
      }
      if (choseFull) {
        draft.isHalfDay = false;
        draft.dayType = 'Full Day';
        draft.step = 'awaiting_reason';
        this.draftService.setDraft(this.draftService.leaveDrafts, ctx.employeeId, draft);
        return `Full day it is. Finally, add a reason (or tap Skip).`;
      }
      draft.isHalfDay = true;
      draft.dayType = 'Half Day';
      draft.step = 'awaiting_session';
      this.draftService.setDraft(this.draftService.leaveDrafts, ctx.employeeId, draft);
      return `Half day — which session?`;
    }

    if (draft.step === 'awaiting_session') {
      const raw = ctx.message.toLowerCase();
      let session = '';
      if (raw.includes('firsthalf') || raw.includes('first half') || raw.includes('first')) session = 'FirstHalf';
      else if (raw.includes('secondhalf') || raw.includes('second half') || raw.includes('second')) session = 'SecondHalf';
      if (!session) return `Please tap "First Half" or "Second Half".`;

      draft.session = session;
      draft.step = 'awaiting_reason';
      this.draftService.setDraft(this.draftService.leaveDrafts, ctx.employeeId, draft);
      return `${this.parserService.sessionLabel(session)} half day. Finally, add a reason (or tap Skip).`;
    }

    if (draft.step === 'awaiting_reason') {
      const reason = ctx.msg === 'skip' || ctx.msg.includes('no reason') ? '' : ctx.message.trim();
      draft.reason = reason;
      draft.step = 'ready';
      this.draftService.setDraft(this.draftService.leaveDrafts, ctx.employeeId, draft);
      const rangeText = formatLeaveRange(draft.startDate, draft.endDate);
      const dayText = draft.isHalfDay ? `Half day (${this.parserService.sessionLabel(draft.session)})` : 'Full day';
      const durationText = draft.isHalfDay ? '0.5 day' : formatDayCount(draft.duration);
      return `Here's your leave request:\n- Type: ${draft.leaveType}\n- Dates: ${rangeText} (${durationText})\n- Day: ${dayText}${draft.reason ? `\n- Reason: ${draft.reason}` : ''}\n\nTap "Confirm Leave" to submit, or "Cancel" to discard.`;
    }

    return null;
  }

  async buildLeaveTypeOptions(employeeId: string): Promise<LeaveTypeOption[]> {
    const types = await this.hrmsDbService.getLeaveTypes();
    const bal = await this.hrmsDbService.getLeaveBalance(employeeId);
    const balByTypeId = new Map<number, number>();
    if (bal.initialised) {
      for (const r of bal.rows) balByTypeId.set(r.leaveTypeId, r.closingBalance);
    }
    return types.map(t => ({
      code: t.code,
      name: t.name,
      balance: balByTypeId.has(t.id) ? balByTypeId.get(t.id)! : null,
    }));
  }

  async getLeaveBalanceSummary(
    employeeId: string,
    leaveTypes: { id: number; name: string; code: string; description: string; annualQuota: number | null }[],
  ): Promise<string> {
    const result = await this.hrmsDbService.getLeaveBalance(employeeId);

    if (!result.initialised || !result.rows.length) {
      return `Your leave balance for ${new Date().getFullYear()} hasn't been set up yet. Please contact HR.`;
    }

    const nameForId = (id: number): string => {
      const match = leaveTypes.find(t => t.id === id);
      return match ? match.name : `Leave type ${id}`;
    };

    const lines = result.rows.map(r => {
      const name = nameForId(r.leaveTypeId);
      const totalAllowance = r.openingBalance + (r.accrued ?? 0);
      return `• ${name}: ${r.closingBalance} available (used ${r.availed} of ${totalAllowance})`;
    });

    return `Your leave balance for ${new Date().getFullYear()}:\n${lines.join('\n')}\n\nTip: Say "Apply leave" to apply.`;
  }

  getIntents(): IntentDefinition[] {
    return [
      {
        name: 'discardDraft',
        test: (ctx) =>
          ctx.msg.includes('discard leave draft') || ctx.msg.includes('discard draft') ||
          ctx.msg.includes('discard leave'),
        handle: async (ctx) => {
          const had = this.draftService.hasDraft(this.draftService.leaveDrafts, ctx.employeeId);
          this.draftService.deleteDraft(this.draftService.leaveDrafts, ctx.employeeId);
          return had
            ? `No problem — I've discarded that leave request. Nothing was submitted. You can start a new one anytime by saying "Apply leave".`
            : `There's no pending leave request to discard. Say "Apply leave" to start one.`;
        },
      },
      {
        name: 'applyLeave',
        test: (ctx) =>
          ctx.msg.includes('apply leave') || ctx.msg.includes('apply for leave') ||
          ctx.msg.includes('request leave') || ctx.msg.includes('leave request') ||
          ctx.msg === 'apply',
        handle: async (ctx) => {
          this.draftService.setDraft(this.draftService.leaveDrafts, ctx.employeeId, {
            leaveType: '', leaveDate: '', startDate: '', endDate: '',
            duration: 0, dayType: 'Full Day', reason: '', step: 'awaiting_start',
            isHalfDay: false, session: '',
          });
          return `Let's apply for leave. First, please pick your leave start date below.`;
        },
      },
      {
        name: 'listLeaves',
        test: (ctx) =>
          ctx.msg.includes('my leaves') || ctx.msg.includes('leave history') ||
          ctx.msg.includes('my leave requests') || ctx.msg.includes('show my leave') ||
          ctx.msg.includes('list my leave') || ctx.msg.includes('view my leave') ||
          ctx.msg.includes('my leave applications') || ctx.msg.includes('leave status') ||
          ctx.msg.includes('my applications') || ctx.msg === 'history' ||
          ctx.msg.includes('leave requests') || ctx.msg.includes('pending request') ||
          ctx.msg.includes('pending requests') || ctx.msg.includes('my requests') ||
          ctx.msg.includes('applied leaves') || ctx.msg.includes('leave applications'),
        handle: async (ctx) => {
          const history = await this.hrmsDbService.getLeaveHistory(ctx.employeeId);
          if (!history.length) {
            return `You have no acted-on leave requests yet (approved/rejected). To see your most recent leave including pending ones, tap "Latest Leave". To apply, say "Apply leave".`;
          }
          const lines = history.map((h, i) =>
            `${i + 1}. ${h.leaveType} — ${formatLeaveRange(h.fromDate, h.toDate)} (${formatDayCount(h.noOfDays)}) — ${h.status}`,
          );
          return `Your leave requests:\n${lines.join('\n')}`;
        },
      },
      {
        name: 'latestLeave',
        test: (ctx) =>
          ctx.msg.includes('latest leave') || ctx.msg.includes('recent leave') ||
          ctx.msg.includes('my latest leave') || ctx.msg.includes('last leave') ||
          ctx.msg.includes('leave status check') || ctx.msg.includes('status of my leave') ||
          ctx.msg.includes('latest status'),
        handle: async (ctx) => {
          const leaves = await this.hrmsDbService.getLeaveStatus(ctx.employeeId);
          if (!leaves.length) {
            return `You don't have any leave requests on record yet. Say "Apply leave" to create one.`;
          }
          const lines = leaves.map((l, i) => {
            const range = l.fromDate === l.toDate ? l.fromDate : `${l.fromDate} to ${l.toDate}`;
            return `${i + 1}. ${l.leaveType} — ${range} — ${l.status}`;
          });
          return `All your leave requests (newest first):\n${lines.join('\n')}`;
        },
      },
      {
        name: 'confirmLeave',
        test: (ctx) =>
          ctx.msg.includes('confirm leave') || ctx.msg.includes('submit leave') ||
          ctx.msg.includes('submit my leave') || ctx.msg.includes('confirm my leave') ||
          ctx.msg.includes('yes submit') || ctx.msg.includes('yes confirm'),
        handle: async (ctx) => {
          const draft = this.draftService.getDraft(this.draftService.leaveDrafts, ctx.employeeId);
          if (!draft) {
            return `I don't have your leave details yet. Say "Apply leave" to start.`;
          }
          const leaveTypeId = this.parserService.resolveLeaveTypeId(draft.leaveType, ctx.leaveTypes);
          if (!leaveTypeId) {
            this.draftService.deleteDraft(this.draftService.leaveDrafts, ctx.employeeId);
            return `I couldn't recognise the leave type "${draft.leaveType}". Please start again with "Apply leave".`;
          }
          const result = await this.hrmsDbService.createLeaveRequest(ctx.employeeId, {
            leaveTypeId,
            fromDate: draft.startDate,
            toDate: draft.endDate,
            reason: draft.reason || null,
            isHalfDay: draft.isHalfDay,
            sessionFrom: draft.isHalfDay ? draft.session : null,
            sessionTo:   draft.isHalfDay ? draft.session : null,
          });
          this.draftService.deleteDraft(this.draftService.leaveDrafts, ctx.employeeId);
          if (result.ok) {
            const rangeText = formatLeaveRange(draft.startDate, draft.endDate);
            const dayText = draft.isHalfDay ? `Half day (${this.parserService.sessionLabel(draft.session)})` : 'Full day';
            return `${result.message}\n- Type: ${draft.leaveType}\n- Dates: ${rangeText}\n- Day: ${dayText}${draft.reason ? `\n- Reason: ${draft.reason}` : ''}\n\nTap "Latest Leave" to see its status.`;
          }
          return result.message;
        },
      },
      {
        name: 'parseLeave',
        test: (ctx) =>
          /(?:\bcl\b|\bel\b|\blop\b|leave type|day type|full day|first half|second half|\btomorrow\b|\btoday\b|\bmonday\b|\btuesday\b|\bwednesday\b|\bthursday\b|\bfriday\b|\bsaturday\b|\bsunday\b|\bjanuary\b|\bfebruary\b|\bmarch\b|\bapril\b|\bmay\b|\bjune\b|\bjuly\b|\baugust\b|\bseptember\b|\boctober\b|\bnovember\b|\bdecember\b)/i.test(ctx.message) &&
          /\d{1,2}/.test(ctx.message) &&
          this.parserService.parseLeaveMessage(ctx.message) !== null,
        handle: async (ctx) => {
          const parsed = this.parserService.parseLeaveMessage(ctx.message)!;
          this.draftService.setDraft(this.draftService.leaveDrafts, ctx.employeeId, { ...parsed, step: 'ready', isHalfDay: false, session: '' });
          const rangeText    = formatLeaveRange(parsed.startDate, parsed.endDate);
          const durationText = formatDayCount(parsed.duration);
          return `Great! I found your leave details:\n- Type: ${parsed.leaveType}\n- Dates: ${rangeText} (${durationText})\n- Day type: ${parsed.dayType}${parsed.reason ? `\n- Reason: ${parsed.reason}` : ''}\n\nTap "Confirm Leave" to submit, or "Cancel" to discard.`;
        },
      },
      {
        name: 'cancelHelp',
        test: (ctx) =>
          ctx.msg.includes('how to cancel') || ctx.msg.includes('cancel help') ||
          ctx.msg.includes('cancel guide') || ctx.msg.includes('help cancel') ||
          ctx.msg.includes('how do i cancel'),
        handle: async (_ctx) =>
          `Leave cancellation through the assistant is coming soon. For now, you can view your leave requests with "my leaves", and cancel a request from the Leave Requests page in the portal.`,
      },
      {
        name: 'cancelConfirmYes',
        test: (ctx) => ctx.msg === 'confirm cancel' || ctx.msg.includes('yes cancel this'),
        handle: async (ctx) => {
          const target = this.draftService.cancelTarget.get(ctx.employeeId);
          if (!target) return `I don't have a leave selected to cancel. Say "cancel leave" to start.`;
          this.draftService.cancelTarget.delete(ctx.employeeId);
          const result = await this.hrmsDbService.withdrawOrCancelLeave(
            ctx.employeeId, target.leaveId, target.actionId,
          );
          return result.message;
        },
      },
      {
        name: 'cancelConfirmNo',
        test: (ctx) => ctx.msg.includes('discard cancel') || ctx.msg === 'keep it',
        handle: async (ctx) => {
          this.draftService.cancelTarget.delete(ctx.employeeId);
          return `No changes made — your leave request is unchanged.`;
        },
      },
      {
        name: 'cancelPick',
        test: (ctx) => /^cancel \d+$/.test(ctx.msg) || /^withdraw \d+$/.test(ctx.msg),
        handle: async (ctx) => {
          const list = this.draftService.cancelList.get(ctx.employeeId);
          const n = Number(ctx.msg.match(/\d+/)?.[0]);
          const item = list?.[n - 1];
          if (!item) return `That number isn't in your list. Say "cancel leave" to see your leaves again.`;
          const actionId: 13 | 38 = item.status.toLowerCase() === 'approved' ? 38 : 13;
          this.draftService.cancelTarget.set(ctx.employeeId, { leaveId: item.leaveId, actionId });
          const verb = actionId === 38 ? 'withdraw' : 'cancel';
          return `Are you sure you want to ${verb} this leave request?`;
        },
      },
      {
        name: 'cancelPendingOnly',
        test: (ctx) => ctx.msg.includes('cancel leave') || ctx.msg.includes('cancel my leave'),
        handle: async (ctx) => {
          const leaves = await this.hrmsDbService.getLeaveStatus(ctx.employeeId);
          const eligible = leaves.filter(l => l.status.toLowerCase() === 'pending');
          if (!eligible.length) {
            return `You have no pending leave requests to cancel.`;
          }
          this.draftService.cancelList.set(ctx.employeeId, eligible.map(l => ({ leaveId: l.leaveId, status: l.status })));
          const lines = eligible.map((l, i) =>
            `${i + 1}. ${l.leaveType} — ${l.fromDate === l.toDate ? l.fromDate : `${l.fromDate} to ${l.toDate}`} — ${l.status}`,
          );
          return `Your pending leave requests:\n${lines.join('\n')}\n\nReply "cancel N" with the number to cancel.`;
        },
      },
      {
        name: 'withdrawApprovedOnly',
        test: (ctx) => ctx.msg.includes('withdraw leave') || ctx.msg.includes('withdraw my leave'),
        handle: async (ctx) => {
          const leaves = await this.hrmsDbService.getLeaveStatus(ctx.employeeId);
          const eligible = leaves.filter(l => l.status.toLowerCase() === 'approved');
          if (!eligible.length) {
            return `You have no approved leave requests to withdraw.`;
          }
          this.draftService.cancelList.set(ctx.employeeId, eligible.map(l => ({ leaveId: l.leaveId, status: l.status })));
          const lines = eligible.map((l, i) =>
            `${i + 1}. ${l.leaveType} — ${l.fromDate === l.toDate ? l.fromDate : `${l.fromDate} to ${l.toDate}`} — ${l.status}`,
          );
          return `Your approved leave requests:\n${lines.join('\n')}\n\nReply "withdraw N" with the number to withdraw.`;
        },
      },
      {
        name: 'approveLeave',
        test: (ctx) =>
          ctx.msg.includes('approve leave') || ctx.msg.includes('pending approval') ||
          ctx.msg.includes('leave approval') || ctx.msg.includes('accept leave'),
        handle: async (ctx) =>
          (ctx.role === 'admin' || ctx.role === 'hr')
            ? `As HR/Admin, you can review pending leave requests on the Leave Requests page. Select a pending request and click Approve when ready.`
            : `Only HR/Admin can approve leave requests. If you want to cancel a pending request before approval, use the Leave Requests page.`,
      },
      {
        name: 'leaveBalance',
        test: (ctx) =>
          ctx.msg.includes('my leave') || ctx.msg.includes('leave balance') ||
          ctx.msg.includes('available leaves') || ctx.msg.includes('available leave') ||
          ctx.msg.includes('no of leaves') || ctx.msg.includes('how many leaves') ||
          ctx.msg.includes('leaves') || ctx.msg.includes('balance') ||
          ctx.msg.includes('leaves left') || ctx.msg.includes('remaining leaves'),
        handle: async (ctx) => this.getLeaveBalanceSummary(ctx.employeeId, ctx.leaveTypes),
      },
    ];
  }
}