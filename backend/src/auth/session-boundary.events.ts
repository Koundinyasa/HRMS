import { Injectable, Logger } from '@nestjs/common';

/**
 * A small in-process notification: "a login session for this employee has
 * just started or ended" (login and logout).
 *
 * Other modules subscribe to clean up their own per-employee state, so the
 * auth module does not have to know about them. The chatbot uses it to drop a
 * half-finished flow (for example "apply leave") instead of resuming it in
 * the next session.
 *
 * A listener that throws is logged and ignored: it must never break a login
 * or a logout.
 */
@Injectable()
export class SessionBoundaryEvents {
  private readonly logger = new Logger(SessionBoundaryEvents.name);
  private readonly listeners = new Set<(employeeId: string) => void>();

  /** Registers a listener. Returns a function that removes it again. */
  subscribe(listener: (employeeId: string) => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  emit(employeeId: string): void {
    for (const listener of this.listeners) {
      try {
        listener(employeeId);
      } catch (error) {
        this.logger.error(
          `A session-boundary listener failed: ${
            error instanceof Error ? error.message : String(error)
          }`,
        );
      }
    }
  }
}
