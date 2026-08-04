import { Injectable } from '@nestjs/common';
import { MenuService } from './menu.service';
import { DraftService } from './draft.service';
import { LeaveService } from './leave.service';
import { ActionButton, ResponseWidget } from '../types';
import { MENUS } from '../constants/menu.constants';
import { formatLeaveRange, formatDayCount } from '../utils/date.util';

@Injectable()
export class ResponseService {
  constructor(
    private readonly menuService: MenuService,
    private readonly draftService: DraftService,
    private readonly leaveService: LeaveService,
  ) {}

  async buildResponseExtras(
    employeeId: string,
    role: string,
  ): Promise<{ actions: ActionButton[]; widget: ResponseWidget | null }> {
    const menuKey = this.menuService.pendingMenu.get(employeeId);
    if (menuKey) {
      this.menuService.pendingMenu.delete(employeeId);
      const menu = MENUS[menuKey];
      if (menu) {
        const isPrivileged = role === 'admin' || role === 'hr';
        const actions = menu.buttons
          .filter(b => !b.hrOnly || isPrivileged)
          .map(b => ({ label: b.label, send: b.send }));
        return { actions, widget: null };
      }
    }
    const listPreview = this.draftService.pendingListPreview.get(employeeId);
    if (listPreview) {
      this.draftService.pendingListPreview.delete(employeeId);
      const suggested = this.draftService.pendingSuggestedActions.get(employeeId) ?? [];
      this.draftService.pendingSuggestedActions.delete(employeeId);
      return {
        actions: suggested,
        widget: { type: 'listPreview', listTitle: listPreview.title, listRows: listPreview.rows },
      };
    }

    const dataCard = this.draftService.pendingDataCard.get(employeeId);
    if (dataCard) {
      this.draftService.pendingDataCard.delete(employeeId);
      const suggested = this.draftService.pendingSuggestedActions.get(employeeId) ?? [];
      this.draftService.pendingSuggestedActions.delete(employeeId);
      return {
        actions: suggested,
        widget: {
          type: 'dataCard',
          cardTitle: dataCard.title,
          cardSubtitle: dataCard.subtitle,
          cardFields: dataCard.fields,
        },
      };
    }

    const notice = this.draftService.pendingNotice.get(employeeId);
    if (notice) {
      this.draftService.pendingNotice.delete(employeeId);
      const suggested = this.draftService.pendingSuggestedActions.get(employeeId) ?? [];
      this.draftService.pendingSuggestedActions.delete(employeeId);
      return {
        actions: suggested,
        widget: { type: 'notice', noticeTone: notice.tone },
      };
    }

    const steps = this.draftService.pendingSteps.get(employeeId);
    if (steps) {
      this.draftService.pendingSteps.delete(employeeId);
      const suggested = this.draftService.pendingSuggestedActions.get(employeeId) ?? [];
      this.draftService.pendingSuggestedActions.delete(employeeId);
      return {
        actions: suggested,
        widget: { type: 'steps', stepsTitle: steps.title, stepsList: steps.items, stepsNote: steps.note },
      };
    }

    if (this.draftService.cancelTarget.has(employeeId)) {
      return {
        actions: [
          { label: 'Confirm', send: 'confirm cancel' },
          { label: 'Keep it', send: 'discard cancel' },
        ],
        widget: null,
      };
    }

    const teamDraft = this.draftService.getDraft(this.draftService.teamDrafts, employeeId);
    if (teamDraft) {
      if (teamDraft.step === 'awaiting_team') {
        return {
          actions: teamDraft.teams.map(t => ({ label: t.name, send: `team:${t.id}` })),
          widget: null,
        };
      }
      if (teamDraft.step === 'awaiting_action') {
        return {
          actions: [
            { label: 'View', send: 'view' },
            { label: 'Download', send: 'download' },
          ],
          widget: null,
        };
      }
      if (teamDraft.step === 'viewed') {
        return {
          actions: [
            { label: 'Download', send: 'download' },
            { label: 'Cancel', send: 'cancel team' },
          ],
          widget: {
            type: 'teamPreview',
            teamName: teamDraft.teamName,
            members: teamDraft.members,
          },
        };
      }
      if (teamDraft.step === 'awaiting_format') {
        return {
          actions: [
            { label: 'PDF', send: 'pdf' },
            { label: 'Excel', send: 'excel' },
            { label: 'Cancel', send: 'cancel team' },
          ],
          widget: null,
        };
      }
      if (teamDraft.step === 'ready_download') {
        const extension = teamDraft.format === 'pdf' ? 'pdf' : 'xlsx';
        const filename = `${teamDraft.teamName.replace(/\s+/g, '_')}-roster.${extension}`;
        const url = `/chatbot/teams/${teamDraft.teamId}/export?format=${teamDraft.format}`;
        // The file link has been delivered to the client — this draft is done.
        this.draftService.deleteDraft(this.draftService.teamDrafts, employeeId);
        return {
          actions: [],
          widget: { type: 'download', url, filename },
        };
      }
    }

    const draft = this.draftService.getDraft(this.draftService.leaveDrafts, employeeId);
    if (!draft) {
      const suggested = this.draftService.pendingSuggestedActions.get(employeeId) ?? [];
      this.draftService.pendingSuggestedActions.delete(employeeId);
      return { actions: suggested, widget: null };
    }

    if (draft.step === 'awaiting_start') {
      return { actions: [], widget: { type: 'date', step: 'start' } };
    }
    if (draft.step === 'awaiting_end') {
      return { actions: [], widget: { type: 'date', step: 'end', minDate: draft.startDate } };
    }
    if (draft.step === 'awaiting_type') {
      const options = await this.leaveService.buildLeaveTypeOptions(employeeId);
      return { actions: [], widget: { type: 'leaveTypes', step: 'type', options } };
    }
    if (draft.step === 'awaiting_dayChoice') {
      return {
        actions: [
          { label: 'Full Day', send: 'full day' },
          { label: 'Half Day', send: 'half day' },
        ],
        widget: null,
      };
    }
    if (draft.step === 'awaiting_session') {
      return {
        actions: [
          { label: 'First Half',  send: 'session:FirstHalf' },
          { label: 'Second Half', send: 'session:SecondHalf' },
        ],
        widget: null,
      };
    }
    if (draft.step === 'awaiting_reason') {
      return { actions: [{ label: 'Skip', send: 'skip' }], widget: null };
    }
    if (draft.step === 'ready') {
      const rangeText = formatLeaveRange(draft.startDate, draft.endDate);
      const dayText = draft.isHalfDay
        ? `Half day (${draft.session === 'FirstHalf' ? 'First half' : draft.session === 'SecondHalf' ? 'Second half' : draft.session})`
        : 'Full day';
      const durationText = draft.isHalfDay ? '0.5 day' : formatDayCount(draft.duration);
      return {
        actions: [
          { label: 'Confirm Leave', send: 'confirm leave' },
          { label: 'Cancel', send: 'discard leave draft' },
        ],
        widget: {
          type: 'dataCard',
          cardTitle: 'Leave request summary',
          cardFields: [
            { label: 'Type', value: draft.leaveType },
            { label: 'Dates', value: `${rangeText} (${durationText})` },
            { label: 'Day', value: dayText },
            ...(draft.reason ? [{ label: 'Reason', value: draft.reason }] : []),
          ],
        },
      };
    }
    return { actions: [], widget: null };
  }
}