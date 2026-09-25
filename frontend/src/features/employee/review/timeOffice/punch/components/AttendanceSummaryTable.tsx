import type {
  AttendanceSummaryTableProps,
} from "../types/punch.types";

export default function AttendanceSummaryTable({
  rows,
  isLoading,
}: AttendanceSummaryTableProps) {
  return (
    <div className="rounded-xl border border-black bg-white font-[Urbanist]">
      <div className="border-b border-black px-4 py-3 font-[Urbanist]">
        <h3 className="text-sm font-semibold text-gray-800 font-[Urbanist]">
          Attendance Summary
        </h3>
      </div>

      <div className="overflow-x-auto font-[Urbanist]">
        <table className="min-w-[650px] w-full font-[Urbanist]">
          <thead className="bg-blue-50 font-[Urbanist]">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-blue-700 font-[Urbanist]">
                Date
              </th>

              <th className="px-4 py-3 text-left text-xs font-semibold text-blue-700 font-[Urbanist]">
                Shift
              </th>

              <th className="px-4 py-3 text-left text-xs font-semibold text-blue-700 font-[Urbanist]">
                First Half
              </th>

              <th className="px-4 py-3 text-left text-xs font-semibold text-blue-700 font-[Urbanist]">
                Second Half
              </th>

              <th className="px-4 py-3 text-left text-xs font-semibold text-blue-700 font-[Urbanist]">
                Status
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100 font-[Urbanist]">
            {isLoading && (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-8 text-center text-sm text-gray-400 font-[Urbanist]"
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
                    className="px-4 py-8 text-center text-sm text-gray-400 font-[Urbanist]"
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
                    className="hover:bg-gray-50 font-[Urbanist]"
                  >
                    <td className="px-4 py-3 text-sm text-gray-700 font-[Urbanist]">
                      {row.date || "-"}
                    </td>

                    <td className="px-4 py-3 text-sm text-gray-700 font-[Urbanist]">
                      {row.shift || "-"}
                    </td>

                    <td className="px-4 py-3 text-sm text-gray-700 font-[Urbanist]">
                      {row.firstHalf ||
                        "-"}
                    </td>

                    <td className="px-4 py-3 text-sm text-gray-700 font-[Urbanist]">
                      {row.secondHalf ||
                        "-"}
                    </td>

                    <td className="px-4 py-3 text-sm font-medium text-gray-700 font-[Urbanist]">
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