import { Injectable } from '@nestjs/common';
import { Stamped, LeaveDraft, PartialCancelDraft, CancelChoiceDraft } from '../types';
import { DRAFT_TTL_MS, DRAFT_MAX_SIZE } from '../constants/chatbot.constants';

@Injectable()
export class DraftService {
  readonly leaveDrafts        = new Map<string, Stamped<LeaveDraft>>();
  readonly partialCancelDrafts = new Map<string, Stamped<PartialCancelDraft>>();
  readonly cancelChoiceDrafts  = new Map<string, Stamped<CancelChoiceDraft>>();

  // Tracks the numbered leave list shown by "cancel leave" and the pending
  // confirmation target, keyed by employeeId.
  readonly cancelList = new Map<string, { leaveId: number; status: string }[]>();
  readonly cancelTarget = new Map<string, { leaveId: number; actionId: 13 | 38 }>();

  getDraft<T>(map: Map<string, Stamped<T>>, key: string): T | undefined {
    const entry = map.get(key);
    if (!entry) return undefined;
    if (Date.now() - entry.savedAt > DRAFT_TTL_MS) { map.delete(key); return undefined; }
    return entry.data;
  }

  setDraft<T>(map: Map<string, Stamped<T>>, key: string, data: T): void {
    if (map.size >= DRAFT_MAX_SIZE) {
      const oldest = [...map.entries()].sort((a, b) => a[1].savedAt - b[1].savedAt)[0];
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
}
