import { Injectable } from '@nestjs/common';
import { MenuService } from './menu.service';
import { DraftService } from './draft.service';
import { LeaveService } from './leave.service';
import { ActionButton, ResponseWidget } from '../types';
import { MENUS } from '../constants/menu.constants';

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
    if (this.draftService.cancelTarget.has(employeeId)) {
      return {
        actions: [
          { label: 'Confirm', send: 'confirm cancel' },
          { label: 'Keep it', send: 'discard cancel' },
        ],
        widget: null,
      };
    }
    const draft = this.draftService.getDraft(this.draftService.leaveDrafts, employeeId);
    if (!draft) return { actions: [], widget: null };

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
      return {
        actions: [
          { label: 'Confirm Leave', send: 'confirm leave' },
          { label: 'Cancel', send: 'discard leave draft' },
        ],
        widget: null,
      };
    }
    return { actions: [], widget: null };
  }
}
