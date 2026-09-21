import type {
  AttendanceSummaryTableProps,
} from "../types/punch.types";

export default function AttendanceSummaryTable({
  rows,
  isLoading,
}: AttendanceSummaryTableProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white">
      <div className="border-b border-gray-100 px-4 py-3">
        <h3 className="text-sm font-semibold text-gray-800">
          Attendance Summary
        </h3>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-[650px] w-full">
          <thead className="bg-blue-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-blue-700">
                Date
              </th>

              <th className="px-4 py-3 text-left text-xs font-semibold text-blue-700">
                Shift
              </th>

              <th className="px-4 py-3 text-left text-xs font-semibold text-blue-700">
                First Half
              </th>

              <th className="px-4 py-3 text-left text-xs font-semibold text-blue-700">
                Second Half
              </th>

              <th className="px-4 py-3 text-left text-xs font-semibold text-blue-700">
                Status
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {isLoading && (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-8 text-center text-sm text-gray-400"
                >
                  Loading attendance...
                </td>
              </tr>
            )}

            {!isLoading &&
              rows.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-8 text-center text-sm text-gray-400"
                  >
                    No attendance data found.
                  </td>
                </tr>
              )}

            {!isLoading &&
              rows.map(
                (row, index) => (
                  <tr
                    key={`${row.date}-${index}`}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {row.date || "-"}
                    </td>

                    <td className="px-4 py-3 text-sm text-gray-700">
                      {row.shift || "-"}
                    </td>

                    <td className="px-4 py-3 text-sm text-gray-700">
                      {row.firstHalf ||
                        "-"}
                    </td>

                    <td className="px-4 py-3 text-sm text-gray-700">
                      {row.secondHalf ||
                        "-"}
                    </td>

                    <td className="px-4 py-3 text-sm font-medium text-gray-700">
                      {row.dayStatus ||
                        "-"}
                    </td>
                  </tr>
                ),
              )}
          </tbody>
        </table>
      </div>
    </div>
  );
}