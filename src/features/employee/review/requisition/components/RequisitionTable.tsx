import type {
  RequisitionTableProps,
} from "../types/requisition.types";

import RequisitionEmptyState from "./RequisitionEmptyState";

export default function RequisitionTable({
  requisitions,
  selectedIds,
  onSelectAll,
  onSelect,
}: RequisitionTableProps) {
  const allSelected =
    requisitions.length > 0 &&
    requisitions.every((item) =>
      selectedIds.includes(item.id)
    );

  return (
    <div className="w-full space-y-3 font-[Urbanist]">
      <div className="overflow-x-auto rounded-md font-[Urbanist]">
        <table className="w-full min-w-[850px] table-fixed border-separate border-spacing-0 font-[Urbanist]">
          <thead>
            <tr className="h-[67px] bg-[#d5e8f5] text-left text-[15px] font-medium text-[#17243a] font-[Urbanist]">
              <th className="w-[18.5%] px-3 font-medium font-[Urbanist]">
                Employee Id
              </th>

              <th className="w-[23.5%] px-3 font-medium font-[Urbanist]">
                Employee Name
              </th>

              <th className="w-[18.5%] px-3 font-medium font-[Urbanist]">
                Leave Name
              </th>

              <th className="w-[9.5%] px-3 font-medium font-[Urbanist]">
                Date
              </th>

              <th className="w-[9.5%] px-3 font-medium font-[Urbanist]">
                Days
              </th>

              <th className="w-[16%] px-3 font-medium font-[Urbanist]">
                Reason
              </th>

              <th className="w-[4.5%] px-3 text-center font-[Urbanist]">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={onSelectAll}
                  aria-label="Select all requisitions"
                  className="h-4 w-4 cursor-pointer accent-sky-500 font-[Urbanist]"
                />
              </th>
            </tr>
          </thead>
        </table>
      </div>

      <div className="min-h-[180px] overflow-x-auto rounded-md border border-black bg-white font-[Urbanist]">
        {requisitions.length === 0 ? (
          <RequisitionEmptyState />
        ) : (
          <table className="w-full min-w-[850px] table-fixed border-collapse font-[Urbanist]">
            <tbody>
              {requisitions.map((item) => (
                <tr
                  key={item.id}
                  className="h-14 border-b border-black text-sm text-slate-700 hover:bg-slate-50 font-[Urbanist]"
                >
                  <td className="w-[18.5%] px-3 font-[Urbanist]">
                    {item.employeeId}
                  </td>

                  <td className="w-[23.5%] px-3 font-[Urbanist]">
                    {item.employeeName}
                  </td>

                  <td className="w-[18.5%] px-3 font-[Urbanist]">
                    {item.leaveName}
                  </td>

                  <td className="w-[9.5%] px-3 font-[Urbanist]">
                    {item.date}
                  </td>

                  <td className="w-[9.5%] px-3 font-[Urbanist]">
                    {item.days}
                  </td>

                  <td className="w-[16%] truncate px-3 font-[Urbanist]">
                    {item.reason}
                  </td>

                  <td className="w-[4.5%] px-3 text-center font-[Urbanist]">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(item.id)}
                      onChange={() => onSelect(item.id)}
                      aria-label={`Select ${item.employeeName}`}
                      className="h-4 w-4 cursor-pointer accent-sky-500 font-[Urbanist]"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}