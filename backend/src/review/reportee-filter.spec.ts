import { keepReportees } from './reportee-filter';

describe('keepReportees', () => {
  const ids = new Set(['294647', '21wertyu21']);

  it('keeps only rows of direct reports, ignoring case and spaces', () => {
    const rows = [
      { EmployeeID: '21WERTYU21 ', n: 1 },
      { EmployeeID: '234567', n: 2 },
      { EmployeeID: '294647', n: 3 },
    ];
    expect(keepReportees(rows, ids, 'EmployeeID').map((r) => r.n)).toEqual([1, 3]);
  });

  it('works with the column name the missed punch procedure uses', () => {
    const rows = [{ 'Employee ID': '294647' }, { 'Employee ID': '1' }];
    expect(keepReportees(rows, ids, 'Employee ID')).toHaveLength(1);
  });

  it('drops rows with no id column and returns [] for a manager with no reports', () => {
    expect(keepReportees([{ Other: 'x' }], ids, 'EmployeeID')).toEqual([]);
    expect(keepReportees([{ EmployeeID: '294647' }], new Set(), 'EmployeeID')).toEqual([]);
    expect(keepReportees(undefined, ids, 'EmployeeID')).toEqual([]);
  });
});
