import { Injectable } from '@nestjs/common';
import { HrmsDbService } from '../../db/hrms-db.service';
import { DraftService } from './draft.service';
import { ParserService } from './parser.service';
import { LeaveApiService } from './leave-api.service';
import { IntentCtx, IntentDefinition, LeaveTypeOption } from '../types';
import { formatLeaveRange, formatDayCount } from '../utils/date.util';

@Injectable()
export class LeaveService {
  constructor(
    private readonly hrmsDbService: HrmsDbService,
    private readonly draftService: DraftService,
    private readonly parserService: ParserService,
    private readonly leaveApiService: LeaveApiService,
  ) {}

  private notify(
    employeeId: string,
    tone: 'info' | 'warning' | 'danger',
    suggestions: { label: string; send: string }[] = [{ label: 'Main Menu', send: 'menu:main' }],
  ) {
    this.draftService.pendingNotice.set(employeeId, { tone });
    if (suggestions.length) this.draftService.pendingSuggestedActions.set(employeeId, suggestions);
  }

  async handleLeaveFlow(ctx: IntentCtx): Promise<string | null> {
    if (ctx.role === 'admin' || ctx.role === 'hr') return null;
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
      return `Got it — here's your leave request:`;
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

  // The /balance endpoint returns the same nested
  // {sections:[{records:[{fields:[{label,value}]}]}]} shape as /history,
  // not a flat array of rows — confirmed against the real controller/service.
  // This mirrors getLeaveHistoryMapped's parsing below rather than reading
  // rows directly, so both endpoints are read the same defensive way.
  async getLeaveBalanceSummary(ctx: IntentCtx): Promise<string> {
    const raw: any = await this.leaveApiService.getLeaveBalance(ctx.user);
    const records = raw?.sections?.[0]?.records ?? (Array.isArray(raw) ? raw : []);
    const year = new Date().getFullYear();

    if (!records.length) {
      return `Your leave balance for ${year} hasn't been set up yet. Please contact HR.`;
    }

    const rows = records.map((rec: any) => {
      const fields = rec.fields ?? [];
      const get = (label: string) => fields.find((f: any) => f.label === label)?.value;
      return {
        leaveType: get('Leave Type'),
        opening: Number(get('Opening Balance') ?? 0),
        accrued: Number(get('Accrued') ?? 0),
        availed: Number(get('Availed') ?? 0),
        closing: Number(get('Closing Balance') ?? 0),
      };
    });

    this.draftService.pendingListPreview.set(ctx.employeeId, {
      title: `Leave balance (${year})`,
      rows: rows.map((r) => {
        const totalAllowance = r.opening + r.accrued;
        return {
          primary: r.leaveType,
          meta: `Used ${r.availed} of ${totalAllowance}`,
          secondary: `${r.closing} left`,
        };
      }),
    });

    this.draftService.pendingSuggestedActions.set(ctx.employeeId, [
      { label: 'Apply Leave', send: 'apply leave' },
    ]);
    return `Here's your leave balance for ${year}.`;
  }

  // /leave-status actually returns a multi-stage approval workflow shape
  // ({ LeaveApplications: [{ Id, FromDate, ToDate, Stages: [...] }] }),
  // confirmed from a real response — not the {sections/records/fields} shape
  // guessed earlier (that guess was wrong). Two real limitations to know:
  // (1) no leave type is present anywhere in this response at all, so we
  // can't show it here — worth flagging to the backend team separately.
  // (2) there's no single Status field; we derive Pending/Approved/Rejected
  // from the Stages array ourselves. The Approved/Rejected StageState string
  // values are a best guess — we've only seen a still-pending real example,
  // so double check once a completed leave is available to confirm the
  // actual state strings used.
  private async getLeaveStatusMapped(user: Record<string, any>): Promise<
    { leaveId: number; leaveType: string; fromDate: string; toDate: string; status: string; currentStage?: string }[]
  > {
    let raw: any;
    try {
      raw = await this.leaveApiService.getLeaveStatus(user);
    } catch (err) {
      // The backend's own USP_GetLeaveStatus parsing appears to throw when
      // there are zero leave applications (result.recordset[0] is undefined
      // in that case) rather than returning an empty list. Treat a failed
      // call here as "no leave applications" — that's overwhelmingly the
      // most common real-world cause — while still logging so a genuinely
      // different failure doesn't go completely unnoticed.
      console.error('getLeaveStatus request failed, treating as no leave applications:', (err as Error).message);
      return [];
    }
    const apps = raw?.LeaveApplications ?? [];
    return apps.map((app: any) => {
      const stages = app.Stages ?? [];
      const rejected = stages.some((s: any) => (s.StageState ?? '').toUpperCase() === 'REJECTED');
      const allApproved = stages.length > 0 && stages.every((s: any) => (s.StageState ?? '').toUpperCase() === 'APPROVED');
      const status = rejected ? 'Rejected' : allApproved ? 'Approved' : 'Pending';
      const current = stages.find((s: any) => s.LevelNo === app.CurrentLevelNo);
      return {
        leaveId: Number(app.Id),
        leaveType: 'Leave request',
        fromDate: app.FromDate,
        toDate: app.ToDate,
        status,
        currentStage: current?.StageName,
      };
    });
  }

  // Same idea as getLeaveStatusMapped above, but for the history endpoint —
  // which returns ACTED-ON leaves (approved/rejected/cancelled/withdrawn),
  // never pending ones. Field names differ slightly from the status
  // endpoint (LeaveTypeName vs Name, plus NoOfDays and ActionBy).
  //
  // KNOWN GAP (flagged, not yet fixed): the real backend's history record no
  // longer includes a "Leave Id"/"LeaveId" field at all (confirmed against
  // the real service — fields are Leave Type, From Date, To Date, Days,
  // Applied Date, Reason, Status, Approved By, Action). leaveId below will
  // resolve to NaN until either the backend adds the field back, or we learn
  // the ID actually lives inside the "Action" field under a different name.
  // This currently breaks "withdraw leave" (approved leaves specifically —
  // cancelPendingOnly reads its IDs from getLeaveStatusMapped above instead,
  // which is unaffected).
  private async getLeaveHistoryMapped(user: Record<string, any>): Promise<
    { leaveId: number; leaveType: string; fromDate: string; toDate: string; noOfDays: number; status: string; actionBy?: string }[]
  > {
    const raw: any = await this.leaveApiService.getLeaveHistory(user);
    // Backend switched this endpoint to a nested {sections:[{records:[{fields:[...]}]}]}
    // shape instead of a flat array. Support both so this doesn't silently break again
    // if it ever reverts or if another endpoint still returns the old shape.
    const records = raw?.sections?.[0]?.records ?? (Array.isArray(raw) ? raw : []);
    return records.map((rec: any) => {
      const fields = rec.fields ?? [];
      const get = (label: string) => fields.find((f: any) => f.label === label)?.value;
      return {
        leaveId: Number(get('Leave Id') ?? get('LeaveId') ?? NaN),
        leaveType: get('Leave Type'),
        fromDate: get('From Date'),
        toDate: get('To Date'),
        noOfDays: Number(get('Days')),
        status: get('Status'),
        actionBy: get('Approved By'),
      };
    });
  }

  getIntents(): IntentDefinition[] {
    const realIntents: IntentDefinition[] = [
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
          const history = await this.getLeaveHistoryMapped(ctx.user);
          if (!history.length) {
            this.draftService.pendingSuggestedActions.set(ctx.employeeId, [
              { label: 'Latest Leave', send: 'latest leave' },
              { label: 'Apply Leave', send: 'apply leave' },
            ]);
            return `You have no acted-on leave requests yet (approved/rejected). Tap "Latest Leave" to see pending ones too.`;
          }
          this.draftService.pendingListPreview.set(ctx.employeeId, {
            title: 'Leave History',
            rows: history.map(h => ({
              primary: h.leaveType,
              meta: `${formatLeaveRange(h.fromDate, h.toDate)} · ${formatDayCount(h.noOfDays)}`,
              status: h.status,
            })),
          });
          return `Here's your leave history (${history.length} record${history.length === 1 ? '' : 's'}):`;
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
          const leaves = await this.getLeaveStatusMapped(ctx.user);
          if (!leaves.length) {
            this.draftService.pendingSuggestedActions.set(ctx.employeeId, [
              { label: 'Apply Leave', send: 'apply leave' },
            ]);
            return `You don't have any leave requests on record yet.`;
          }
          this.draftService.pendingListPreview.set(ctx.employeeId, {
            title: 'Your leave requests',
            rows: leaves.map(l => {
              const dateRange = l.fromDate === l.toDate ? l.fromDate : `${l.fromDate} to ${l.toDate}`;
              return {
                primary: l.leaveType,
                meta: l.currentStage ? `${dateRange} · Awaiting ${l.currentStage}` : dateRange,
                status: l.status,
              };
            }),
          });
          return `Here are your leave requests (newest first):`;
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
          const rawResult = await this.leaveApiService.applyLeave(ctx.user, {
            leaveTypeId,
            fromDate: draft.startDate,
            toDate: draft.endDate,
            reason: draft.reason || undefined,
            isHalfDay: draft.isHalfDay,
            sessionFrom: draft.isHalfDay ? draft.session : undefined,
            sessionTo:   draft.isHalfDay ? draft.session : undefined,
          });
          // The real endpoint calls the same stored procedure our old code
          // did, so it should return the same {StatusCode, Message} shape —
          // worth confirming with a real test rather than trusting blindly.
          const row = Array.isArray(rawResult) ? rawResult[0] : rawResult;
          const statusCode = Number(row?.StatusCode ?? 500);
          const result = {
            ok: statusCode === 200,
            message: String(row?.Message ?? 'Unknown response from the server.'),
          };
          this.draftService.deleteDraft(this.draftService.leaveDrafts, ctx.employeeId);
          if (result.ok) {
            const rangeText = formatLeaveRange(draft.startDate, draft.endDate);
            const dayText = draft.isHalfDay ? `Half day (${this.parserService.sessionLabel(draft.session)})` : 'Full day';
            this.draftService.pendingDataCard.set(ctx.employeeId, {
              title: 'Leave submitted',
              subtitle: draft.leaveType,
              fields: [
                { label: 'Dates', value: rangeText },
                { label: 'Day', value: dayText },
                ...(draft.reason ? [{ label: 'Reason', value: draft.reason }] : []),
              ],
            });
            this.draftService.pendingSuggestedActions.set(ctx.employeeId, [
              { label: 'Latest Leave', send: 'latest leave' },
            ]);
            return result.message;
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
          return `Great! I found your leave details:`;
        },
      },
      {
        name: 'cancelHelp',
        test: (ctx) =>
          ctx.msg.includes('how to cancel') || ctx.msg.includes('cancel help') ||
          ctx.msg.includes('cancel guide') || ctx.msg.includes('help cancel') ||
          ctx.msg.includes('how do i cancel'),
        handle: async (ctx) => {
          this.draftService.pendingSuggestedActions.set(ctx.employeeId, [
            { label: 'Cancel Leave', send: 'cancel leave' },
          ]);
          return `You can cancel a pending leave request right here — tap "Cancel Leave" below and pick the one you want to cancel.`;
        },
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
          const leaves = await this.getLeaveStatusMapped(ctx.user);
          const eligible = leaves.filter(l => (l.status ?? '').toLowerCase() === 'pending');
          if (!eligible.length) {
            return `You have no pending leave requests to cancel.`;
          }
          this.draftService.cancelList.set(ctx.employeeId, eligible.map(l => ({ leaveId: l.leaveId, status: l.status })));
          this.draftService.pendingListPreview.set(ctx.employeeId, {
            title: 'Pending leave requests',
            rows: eligible.map((l, i) => {
              const dateRange = l.fromDate === l.toDate ? l.fromDate : `${l.fromDate} to ${l.toDate}`;
              return {
                primary: l.leaveType,
                meta: l.currentStage ? `${dateRange} · Awaiting ${l.currentStage}` : dateRange,
                status: l.status,
                action: `cancel ${i + 1}`,
              };
            }),
          });
          return `Tap a request below to cancel it, or reply "cancel N" with its number.`;
        },
      },
      {
        name: 'withdrawApprovedOnly',
        test: (ctx) => ctx.msg.includes('withdraw leave') || ctx.msg.includes('withdraw my leave'),
        handle: async (ctx) => {
          const leaves = await this.getLeaveHistoryMapped(ctx.user);
          const eligible = leaves.filter(l => (l.status ?? '').toLowerCase() === 'approved');
          if (!eligible.length) {
            return `You have no approved leave requests to withdraw.`;
          }
          this.draftService.cancelList.set(ctx.employeeId, eligible.map(l => ({ leaveId: l.leaveId, status: l.status })));
          this.draftService.pendingListPreview.set(ctx.employeeId, {
            title: 'Approved leave requests',
            rows: eligible.map((l, i) => ({
              primary: l.leaveType,
              meta: l.fromDate === l.toDate ? l.fromDate : `${l.fromDate} to ${l.toDate}`,
              status: l.status,
              action: `withdraw ${i + 1}`,
            })),
          });
          return `Tap a request below to withdraw it, or reply "withdraw N" with its number.`;
        },
      },
      {
        name: 'approveLeave',
        test: (ctx) =>
          ctx.msg.includes('approve leave') || ctx.msg.includes('pending approval') ||
          ctx.msg.includes('leave approval') || ctx.msg.includes('accept leave'),
        handle: async (ctx) => {
          if (ctx.role === 'admin' || ctx.role === 'hr') {
            return `As HR/Admin, you can review pending leave requests on the Leave Requests page. Select a pending request and click Approve when ready.`;
          }
          this.notify(ctx.employeeId, 'info');
          return `Only HR/Admin can approve leave requests. If you want to cancel a pending request before approval, use the Leave Requests page.`;
        },
      },
      {
        name: 'leaveBalance',
        test: (ctx) =>
          ctx.msg.includes('my leave') || ctx.msg.includes('leave balance') ||
          ctx.msg.includes('available leaves') || ctx.msg.includes('available leave') ||
          ctx.msg.includes('no of leaves') || ctx.msg.includes('how many leaves') ||
          ctx.msg.includes('leaves') || ctx.msg.includes('balance') ||
          ctx.msg.includes('leaves left') || ctx.msg.includes('remaining leaves'),
        handle: async (ctx) => this.getLeaveBalanceSummary(ctx),
      },
    ];

    // Admin/HR manage their own leave through a separate employee login —
    // this account should never reach any leave-management feature at all.
    // Wrapping here (rather than gating each intent individually) means
    // every leave command, including any added later, is covered
    // automatically with one consistent message.
    return realIntents.map((intent) => ({
      ...intent,
      handle: async (ctx: IntentCtx) => {
        if (ctx.role === 'admin' || ctx.role === 'hr') {
          return `Leave management isn't available from this account. Please sign in with your employee login to apply for or manage leave.`;
        }
        return intent.handle(ctx);
      },
    }));
  }
}