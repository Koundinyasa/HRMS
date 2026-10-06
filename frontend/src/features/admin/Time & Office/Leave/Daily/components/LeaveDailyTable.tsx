import type { LeaveDailyRow } from "../types/leaveDaily.types";

interface LeaveDailyTableProps {
  rows: LeaveDailyRow[];
  loading?: boolean;
}

const LeaveDailyTable = ({
  rows,
  loading = false,
}: LeaveDailyTableProps) => {
  if (loading) {
    return (
      <div className="flex w-full items-center justify-center py-12 font-[Urbanist]">
        <p className="text-[13px] font-normal leading-[18px] text-slate-400">
          Loading...
        </p>
      </div>
    );
  }

  if (!rows.length) {
    return null;
  }

  return (
    <div className="w-full overflow-x-auto rounded-lg border border-slate-200 bg-white">
      <table className="w-full min-w-[900px] border-collapse font-[Urbanist]">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50">
            <th className="px-4 py-3 text-left text-[12px] font-medium leading-[16px] text-slate-600">
              Employee
            </th>

            <th className="px-4 py-3 text-left text-[12px] font-medium leading-[16px] text-slate-600">
              Employee Code
            </th>

            <th className="px-4 py-3 text-left text-[12px] font-medium leading-[16px] text-slate-600">
              Department
            </th>

            <th className="px-4 py-3 text-left text-[12px] font-medium leading-[16px] text-slate-600">
              Leave Type
            </th>

            <th className="px-4 py-3 text-left text-[12px] font-medium leading-[16px] text-slate-600">
              Leave Date
            </th>

            <th className="px-4 py-3 text-left text-[12px] font-medium leading-[16px] text-slate-600">
              Duration
            </th>

            <th className="px-4 py-3 text-left text-[12px] font-medium leading-[16px] text-slate-600">
              Status
            </th>

            <th className="px-4 py-3 text-left text-[12px] font-medium leading-[16px] text-slate-600">
              Remarks
            </th>
          </tr>
        </thead>

        <tbody>
          {rows.map((row) => (
            <tr
              key={row.id}
              className="border-b border-slate-100 last:border-b-0"
            >
              <td className="px-4 py-3 text-[13px] font-normal leading-[18px] text-slate-700">
                {row.employeeName}
              </td>

              <td className="px-4 py-3 text-[13px] font-normal leading-[18px] text-slate-600">
                {row.employeeCode || "-"}
              </td>

              <td className="px-4 py-3 text-[13px] font-normal leading-[18px] text-slate-600">
                {row.department || "-"}
              </td>

              <td className="px-4 py-3 text-[13px] font-normal leading-[18px] text-slate-600">
                {row.leaveType || "-"}
              </td>

              <td className="px-4 py-3 text-[13px] font-normal leading-[18px] text-slate-600">
                {row.leaveDate || "-"}
              </td>

              <td className="px-4 py-3 text-[13px] font-normal leading-[18px] text-slate-600">
                {row.duration ?? "-"}
              </td>

              <td className="px-4 py-3 text-[13px] font-normal leading-[18px] text-slate-600">
                {row.status || "-"}
              </td>

              <td className="px-4 py-3 text-[13px] font-normal leading-[18px] text-slate-600">
                {row.remarks || "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeaveDailyTable;