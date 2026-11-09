import { Injectable, Logger, OnModuleInit, Optional } from '@nestjs/common';
import {
  Stamped,
  LeaveDraft,
  PartialCancelDraft,
  CancelChoiceDraft,
  TeamDraft,
  EmployeeDirectoryDraft,
} from '../types';
import { DRAFT_TTL_MS, DRAFT_MAX_SIZE } from '../constants/chatbot.constants';
import { HrmsDbService } from '../../db/hrms-db.service';

/**
 * A Map that reports every entry added or removed, so DraftService can keep a
 * copy in the database. Reads stay plain in-memory reads.
 */
class WatchedMap<V> extends Map<string, V> {
  constructor(
    private readonly onSet: (key: string, value: V) => void,
    private readonly onDelete: (key: string) => void,
  ) {
    super();
  }

  override set(key: string, value: V): this {
    super.set(key, value);
    this.onSet(key, value);
    return this;
  }

  override delete(key: string): boolean {
    const existed = super.delete(key);
    if (existed) this.onDelete(key);
    return existed;
  }
}

/**
 * Chatbot conversation state.
 *
 * The multi-step flows (apply leave, cancel choices, team and directory
 * lists) are kept in memory for speed and mirrored to dbo.ChatbotDrafts, so
 * an open conversation survives a server restart. On start-up the drafts
 * saved in the last DRAFT_TTL_MS are loaded back. If the table is missing or
 * the database fails, the chatbot keeps working with memory only (one
 * warning in the log).
 *
 * The one-shot maps (pendingListPreview and the like) live inside a single
 * request and are not saved.
 */
@Injectable()
export class DraftService implements OnModuleInit {
  private readonly log = new Logger(DraftService.name);
  private storeWorking = true;
  private queue: Promise<void> = Promise.resolve();

  constructor(@Optional() private readonly db?: HrmsDbService) {}

  private watched<V>(kind: string): WatchedMap<V> {
    return new WatchedMap<V>(
      (key, value) => this.persist(kind, key, value),
      (key) => this.forget(kind, key),
    );
  }

  readonly leaveDrafts = this.watched<Stamped<LeaveDraft>>('leaveDrafts');
  readonly partialCancelDrafts =
    this.watched<Stamped<PartialCancelDraft>>('partialCancelDrafts');
  readonly cancelChoiceDrafts =
    this.watched<Stamped<CancelChoiceDraft>>('cancelChoiceDrafts');
  readonly teamDrafts = this.watched<Stamped<TeamDraft>>('teamDrafts');
  readonly employeeDirectoryDrafts = this.watched<
    Stamped<EmployeeDirectoryDraft>
  >('employeeDirectoryDrafts');
  readonly pendingEmployeeExport = new Map<string, 'excel' | 'pdf'>();
  // Tracks the numbered leave list shown by "cancel leave" and the pending
  // confirmation target, keyed by employeeId.
  readonly cancelList = this.watched<
    {
      leaveId: number;
      status: string;
      leaveType: string;
    }[]
  >('cancelList');
  readonly cancelTarget = this.watched<{ leaveId: number; actionId: 13 | 38 }>(
    'cancelTarget',
  );

  // One-shot payload for the generic "long list" preview modal (holidays,
  // employee directory, etc.) — set right before an intent returns its text
  // reply, read once by ResponseService, then discarded. No TTL needed since
  // it's always consumed within the same request/response cycle.
  readonly pendingListPreview = new Map<
    string,
    {
      title: string;
      rows: { primary: string; secondary?: string; action?: string }[];
    }
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

  // Employees whose leave data the chatbot has just changed (a leave applied
  // or cancelled). Read once when the reply is built, so the page can refresh
  // its own copy of the leave data instead of waiting for a reload.
  readonly leaveChanged = new Set<string>();

  // ─── Database copy ──────────────────────────────────────────────────────────

  private mapFor(kind: string): Map<string, unknown> | undefined {
    const maps: Record<string, Map<string, unknown>> = {
      leaveDrafts: this.leaveDrafts,
      partialCancelDrafts: this.partialCancelDrafts,
      cancelChoiceDrafts: this.cancelChoiceDrafts,
      teamDrafts: this.teamDrafts,
      employeeDirectoryDrafts: this.employeeDirectoryDrafts,
      cancelList: this.cancelList,
      cancelTarget: this.cancelTarget,
    };
    return maps[kind];
  }

  /** Runs database work one step at a time, so a save never lands after a later delete. */
  private enqueue(work: () => Promise<void>): void {
    if (!this.db || !this.storeWorking) return;
    this.queue = this.queue.then(work).catch((error) => this.storeFailed(error));
  }

  private storeFailed(error: unknown): void {
    if (!this.storeWorking) return;
    this.storeWorking = false;
    const reason = error instanceof Error ? error.message : String(error);
    this.log.warn(
      `Chatbot drafts are kept in memory only (database copy unavailable: ${reason}). Run database/migrations/20261105_create_chatbot_drafts.sql.`,
    );
  }

  private persist(kind: string, key: string, value: unknown): void {
    const savedAt =
      typeof value === 'object' && value !== null && 'savedAt' in value
        ? Number((value as { savedAt: number }).savedAt)
        : Date.now();
    const payload = JSON.stringify(value);
    this.enqueue(() =>
      this.db!.saveChatbotDraft(key, kind, payload, savedAt),
    );
  }

  private forget(kind: string, key: string): void {
    this.enqueue(() => this.db!.deleteChatbotDraft(key, kind));
  }

  /** Loads the drafts saved in the last DRAFT_TTL_MS back into memory. */
  async onModuleInit(): Promise<void> {
    if (!this.db) return;
    try {
      const cutoff = Date.now() - DRAFT_TTL_MS;
      await this.db.deleteExpiredChatbotDrafts(cutoff);
      const rows = await this.db.loadChatbotDrafts(cutoff);
      for (const row of rows) {
        const map = this.mapFor(row.draftType);
        if (!map) continue;
        // Plain Map.set: loading must not write the row back.
        Map.prototype.set.call(map, row.employeeId, JSON.parse(row.payload));
      }
      if (rows.length > 0) {
        this.log.log(`Restored ${rows.length} chatbot draft(s).`);
      }
    } catch (error) {
      this.storeFailed(error);
    }
  }

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
    this.leaveChanged.delete(employeeId);
  }
}
