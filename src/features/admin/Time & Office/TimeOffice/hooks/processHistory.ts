import { format, isSameMonth } from "date-fns";

/** "June 4 to 4, 2026" (same month) or "May 28 to June 2, 2026" (crosses a month). */
export const formatRangeLabel = (from: Date, to: Date) =>
  isSameMonth(from, to)
    ? `${format(from, "MMMM d")} to ${format(to, "d, yyyy")}`
    : `${format(from, "MMMM d")} to ${format(to, "MMMM d, yyyy")}`;
