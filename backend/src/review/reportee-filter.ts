/**
 * Keeps only the rows that belong to one of the manager's direct reports.
 *
 * Used where a stored procedure can only filter by company: the rows come back
 * for everyone, and this removes everyone who does not report to the caller.
 * A row without the employee id column is dropped (fail closed).
 */
export function keepReportees<T extends Record<string, any>>(
  rows: T[] | undefined | null,
  reporteeIds: ReadonlySet<string>,
  idColumn: string,
): T[] {
  if (!Array.isArray(rows)) return [];
  return rows.filter((row) => {
    const id = String(row?.[idColumn] ?? '').trim().toLowerCase();
    return id !== '' && reporteeIds.has(id);
  });
}
