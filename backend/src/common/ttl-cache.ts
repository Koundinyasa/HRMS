/**
 * A small in-memory cache that keeps the result of an async lookup for a short
 * time and lets callers that ask for the same key in the meantime share one
 * run, so the database is asked once instead of once per caller.
 *
 * - A failed lookup is never kept, so the next caller tries again.
 * - `keep` can refuse to store a result (for example an empty result that came
 *   from an error that was swallowed).
 * - The cache holds at most `maxEntries` keys; the oldest are dropped first.
 *
 * Callers receive the same object while it is cached, so they must not change it.
 */
export class TtlCache {
  private readonly entries = new Map<
    string,
    { at: number; value: Promise<unknown> }
  >();

  constructor(
    private readonly ttlMs: number,
    private readonly maxEntries = 500,
  ) {}

  get<V>(
    key: string,
    load: () => Promise<V>,
    keep: (value: V) => boolean = () => true,
  ): Promise<V> {
    const now = Date.now();
    const hit = this.entries.get(key);
    if (hit && now - hit.at < this.ttlMs) return hit.value as Promise<V>;

    if (this.entries.size >= this.maxEntries) this.prune(now);

    const value = load();
    const entry = { at: now, value };
    this.entries.set(key, entry);

    const forget = () => {
      if (this.entries.get(key) === entry) this.entries.delete(key);
    };
    value.then((result) => {
      if (!keep(result)) forget();
    }, forget);

    return value;
  }

  clear(): void {
    this.entries.clear();
  }

  private prune(now: number): void {
    for (const [key, entry] of this.entries) {
      if (now - entry.at >= this.ttlMs) this.entries.delete(key);
    }
    while (this.entries.size >= this.maxEntries) {
      const oldest = this.entries.keys().next().value;
      if (oldest === undefined) break;
      this.entries.delete(oldest);
    }
  }
}
