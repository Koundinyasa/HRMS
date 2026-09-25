import { Injectable } from '@nestjs/common';
import {
  Stamped,
  LeaveDraft,
  PartialCancelDraft,
  CancelChoiceDraft,
  TeamDraft,
  EmployeeDirectoryDraft,
} from '../types';
import { DRAFT_TTL_MS, DRAFT_MAX_SIZE } from '../constants/chatbot.constants';

@Injectable()
export class DraftService {
  readonly leaveDrafts = new Map<string, Stamped<LeaveDraft>>();
  readonly partialCancelDrafts = new Map<string, Stamped<PartialCancelDraft>>();
  readonly cancelChoiceDrafts = new Map<string, Stamped<CancelChoiceDraft>>();
  readonly teamDrafts = new Map<string, Stamped<TeamDraft>>();
  readonly employeeDirectoryDrafts = new Map<
    string,
    Stamped<EmployeeDirectoryDraft>
  >();
  readonly pendingEmployeeExport = new Map<string, 'excel' | 'pdf'>();

  // Tracks the numbered leave list shown by "cancel leave" and the pending
  // confirmation target, keyed by employeeId.
  readonly cancelList = new Map<
    string,
    {
      leaveId: number;
      status: string;
      leaveType: string;
    }[]
  >();
  readonly cancelTarget = new Map<
    string,
    { leaveId: number; actionId: 13 | 38 }
  >();

  // One-shot payload for the generic "long list" preview modal (holidays,
  // employee directory, etc.) — set right before an intent returns its text
  // reply, read once by ResponseService, then discarded. No TTL needed since
  // it's always consumed within the same request/response cycle.
  readonly pendingListPreview = new Map<
    string,
    { title: string; rows: { primary: string; secondary?: string }[] }
  >();

  // Same one-shot pattern as pendingListPreview above, but for a single
  // record (My Details, Company Info, etc.) shown as a small labeled card
  // instead of a list. Set right before an intent returns its text reply,
  // read once by ResponseService, then discarded.
  readonly pendingDataCard = new Map<
    string,
    {
      title: string;
      subtitle?: string;
      fields: { label: string; value: string }[];
    }
  >();

  // One-shot quick-reply chip(s) to attach alongside a reply that otherwise
  // wouldn't have any actions — e.g. an "Apply Leave" button after showing
  // leave balance. Same lifecycle as the two maps above.
  readonly pendingSuggestedActions = new Map<
    string,
    { label: string; send: string }[]
  >();

  // One-shot flag that tints the bot's own message bubble (info/warning/danger)
  // instead of adding a separate card — used for empty states and access-denied
  // replies so they read as distinct from a normal answer without duplicating
  // the message text in a second widget.
  readonly pendingNotice = new Map<
    string,
    { tone: 'info' | 'warning' | 'danger' }
  >();

  // Short numbered guides (Form16, payslip, certificates how-to) render
  // inline as a card, unlike pendingListPreview which opens a popup —
  // a 3-4 step guide doesn't need a click-through modal.
  readonly pendingSteps = new Map<
    string,
    { title: string; items: string[]; note?: string }
  >();

  getDraft<T>(map: Map<string, Stamped<T>>, key: string): T | undefined {
    const entry = map.get(key);
    if (!entry) return undefined;
    if (Date.now() - entry.savedAt > DRAFT_TTL_MS) {
      map.delete(key);
      return undefined;
    }
    return entry.data;
  }

  setDraft<T>(map: Map<string, Stamped<T>>, key: string, data: T): void {
    if (map.size >= DRAFT_MAX_SIZE) {
      const oldest = [...map.entries()].sort(
        (a, b) => a[1].savedAt - b[1].savedAt,
      )[0];
      if (oldest) map.delete(oldest[0]);
    }
    map.set(key, { data, savedAt: Date.now() });
  }

  hasDraft<T>(map: Map<string, Stamped<T>>, key: string): boolean {
    return this.getDraft(map, key) !== undefined;
  }

  deleteDraft<T>(map: Map<string, Stamped<T>>, key: string): void {
    map.delete(key);
  }

  hasLeaveDraft(employeeId: string): boolean {
    return this.hasDraft(this.leaveDrafts, employeeId);
  }

  resetConversation(employeeId: string): void {
    this.leaveDrafts.delete(employeeId);
    this.partialCancelDrafts.delete(employeeId);
    this.cancelChoiceDrafts.delete(employeeId);
    this.teamDrafts.delete(employeeId);
    this.employeeDirectoryDrafts.delete(employeeId);

    this.cancelList.delete(employeeId);
    this.cancelTarget.delete(employeeId);

    this.pendingListPreview.delete(employeeId);
    this.pendingDataCard.delete(employeeId);
    this.pendingSuggestedActions.delete(employeeId);
    this.pendingNotice.delete(employeeId);
    this.pendingSteps.delete(employeeId);
    this.pendingEmployeeExport.delete(employeeId);
  }
}
