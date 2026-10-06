/**
 * Self-check for the punch metric logic. No test runner in this project, so run it with:
 *   npx esbuild src/features/admin/talenthub/TimeOffice/hooks/punchMetrics.selfcheck.ts --bundle --format=cjs | node
 */
import { PUNCH_RECORDS, TOTAL_EMPLOYEES } from "../constants/punch.mock";
import { applyFilters, countMetric, optionsFor, paginate, toCsv, toRow } from "./punchMetrics";
import type { PunchRow } from "../types/timeoffice.types";

const assert = (ok: boolean, message: string) => {
  if (!ok) throw new Error(`FAIL: ${message}`);
  console.log(`ok  - ${message}`);
};

const today = PUNCH_RECORDS.today;
const rows: PunchRow[] = today.map(toRow);

assert(today.length === TOTAL_EMPLOYEES, `roster is ${TOTAL_EMPLOYEES} employees`);

// A tile count must equal the number of rows its drill-down lists.
assert(
  countMetric(today, "late-in") === rows.filter((r) => r.lateInMins !== undefined).length,
  "late-in count matches rows carrying a lateInMins delta"
);
assert(
  countMetric(today, "early-in") === rows.filter((r) => r.earlyInMins !== undefined).length,
  "early-in count matches rows carrying an earlyInMins delta"
);
assert(
  countMetric(today, "early-out") === rows.filter((r) => r.earlyOutMins !== undefined).length,
  "early-out count matches rows carrying an earlyOutMins delta"
);

// Yet-to-login and logged-in must partition everyone who is not on leave.
const yetToLogin = countMetric(today, "yet-to-login");
const loggedIn = countMetric(today, "logged-in");
const onLeave = countMetric(today, "on-leave");
assert(
  yetToLogin + loggedIn + onLeave === TOTAL_EMPLOYEES,
  `yet-to-login (${yetToLogin}) + logged-in (${loggedIn}) + on-leave (${onLeave}) = ${TOTAL_EMPLOYEES}`
);

// Late and early arrivals are disjoint subsets of the logged-in population.
assert(
  countMetric(today, "late-in") + countMetric(today, "early-in") <= loggedIn,
  "late-in and early-in are subsets of logged-in"
);

// Yesterday is settled: nobody is mid-day, so present + absent covers everyone.
const yesterday = PUNCH_RECORDS.yesterday;
assert(
  countMetric(yesterday, "present") + countMetric(yesterday, "absent") === TOTAL_EMPLOYEES,
  "yesterday present + absent covers the whole roster"
);

// Filtering
const branches = optionsFor(rows, "branch");
assert(branches.length > 1, "branch chip has more than one option");
const filtered = applyFilters(rows, { taPolicy: rows[0].taPolicy });
assert(
  filtered.length > 0 && filtered.every((r) => r.taPolicy === rows[0].taPolicy),
  "chip filter keeps only exact matches"
);
assert(applyFilters(rows, {}).length === rows.length, "empty filters keep every row");
assert(
  applyFilters(rows, { search: rows[3].employeeName.slice(0, 6) }).length > 0,
  "search matches on employee name"
);
assert(applyFilters(rows, { search: "zzzz-no-such-person" }).length === 0, "search with no match returns nothing");

// Paging
assert(paginate(rows, 1, 10).length === 10, "page 1 of 10 has 10 rows");
assert(paginate(rows, 9, 10).length === TOTAL_EMPLOYEES - 80, "last page holds the remainder");
assert(paginate(rows, 1, 10)[0] !== paginate(rows, 2, 10)[0], "pages do not overlap");

// CSV
const csv = toCsv([{ label: "Employee Name", key: "employeeName" }], rows.slice(0, 2));
assert(csv.split("\n").length === 3, "csv has a header plus one line per row");
assert(csv.startsWith("Employee Name"), "csv starts with the header row");
assert(
  toCsv([{ label: "Leave Status", key: "leaveStatus" }], [rows[1]]).includes('"'),
  "csv quotes values containing commas"
);

console.log("\nAll punch metric checks passed.");
