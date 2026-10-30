import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { SessionBoundaryEvents } from '../../auth/session-boundary.events';
import { DraftService } from './draft.service';

/**
 * A login (or logout) is a hard session boundary. Any chatbot flow that was
 * left mid-way, most commonly "apply leave" (the one multi-step flow that can
 * be abandoned partway), must not survive into a new session. Drafts are
 * keyed only by employeeId with a time-based expiry, so without this a
 * logout/login within that window would resume the old, stale flow.
 *
 * The auth module announces the boundary (SessionBoundaryEvents); the chatbot
 * listens here and clears its own state.
 */
@Injectable()
export class ChatbotSessionCleaner implements OnModuleInit, OnModuleDestroy {
  private unsubscribe?: () => void;

  constructor(
    private readonly drafts: DraftService,
    private readonly events: SessionBoundaryEvents,
  ) {}

  onModuleInit(): void {
    this.unsubscribe = this.events.subscribe((employeeId) =>
      this.clear(employeeId),
    );
  }

  onModuleDestroy(): void {
    this.unsubscribe?.();
  }

  clear(employeeId: string): void {
    this.drafts.deleteDraft(this.drafts.leaveDrafts, employeeId);
    this.drafts.deleteDraft(this.drafts.partialCancelDrafts, employeeId);
    this.drafts.deleteDraft(this.drafts.cancelChoiceDrafts, employeeId);
    this.drafts.cancelList.delete(employeeId);
    this.drafts.cancelTarget.delete(employeeId);
  }
}
