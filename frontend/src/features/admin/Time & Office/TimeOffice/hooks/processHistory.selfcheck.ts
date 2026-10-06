/**
 * Self-check for the process-history range formatter. Run with:
 *   npx esbuild src/features/admin/talenthub/TimeOffice/hooks/processHistory.selfcheck.ts --bundle --format=cjs | node
 */
import { formatRangeLabel } from "./processHistory";

const assert = (ok: boolean, message: string) => {
  if (!ok) throw new Error(`FAIL: ${message}`);
  console.log(`ok  - ${message}`);
};

assert(
  formatRangeLabel(new Date(2026, 5, 4), new Date(2026, 5, 4)) === "June 4 to 4, 2026",
  "single-day range matches the reference format"
);
assert(
  formatRangeLabel(new Date(2026, 4, 1), new Date(2026, 4, 7)) === "May 1 to 7, 2026",
  "same-month range matches the reference format"
);
assert(
  formatRangeLabel(new Date(2026, 4, 28), new Date(2026, 5, 2)) === "May 28 to June 2, 2026",
  "cross-month range spells out both month names"
);

console.log("\nAll process history checks passed.");
