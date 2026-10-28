import type {
  HelpdeskRequest,
} from "../types/helpdeskRequests.types";

interface HelpdeskRequestsTableProps {
  requests: HelpdeskRequest[];
  selectedIds: Array<string | number>;
  onToggle: (id: string | number) => void;
  onToggleAll: () => void;
  onView: (request: HelpdeskRequest) => void;
}

const getStatusClass = (status?: string) => {
  switch (status?.toUpperCase()) {
    case "RESOLVED":
      return "bg-green-100 text-green-600";

    case "CLOSED":
      return "bg-gray-100 text-gray-600";

    case "REJECTED":
      return "bg-red-100 text-red-600";

    case "IN_PROGRESS":
      return "bg-blue-100 text-blue-600";

    case "OPEN":
      return "bg-cyan-100 text-cyan-600";

    default:
      return "bg-orange-100 text-orange-600";
  }
};

const getPriorityClass = (priority?: string) => {
  switch (priority?.toUpperCase()) {
    case "CRITICAL":
      return "bg-red-100 text-red-600";

    case "HIGH":
      return "bg-orange-100 text-orange-600";

    case "MEDIUM":
      return "bg-yellow-100 text-yellow-600";

    case "LOW":
      return "bg-green-100 text-green-600";

    default:
      return "bg-gray-100 text-gray-600";
  }
};

const formatDate = (date?: string) => {
  if (!date) {
    return "-";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return parsedDate.toLocaleDateString("en-GB");
};

const HelpdeskRequestsTable = ({
  requests,
  selectedIds,
  onToggle,
  onToggleAll,
  onView,
}: HelpdeskRequestsTableProps) => {
  const allSelected =
    requests.length > 0 &&
    selectedIds.length === requests.length;

  return (
    <div className="w-full overflow-hidden rounded-lg border border-slate-200 bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-[1100px] w-full border-collapse">
          <thead>
            <tr className="bg-[#d8ebf8] text-left">
              <th className="px-4 py-4 text-sm font-semibold text-[#0b315d]">
                Request ID
              </th>

              <th className="px-4 py-4 text-sm font-semibold text-[#0b315d]">
                Employee Name
              </th>

              <th className="px-4 py-4 text-sm font-semibold text-[#0b315d]">
                Category
              </th>

              <th className="px-4 py-4 text-sm font-semibold text-[#0b315d]">
                Subject
              </th>

              <th className="px-4 py-4 text-sm font-semibold text-[#0b315d]">
                Date
              </th>

              <th className="px-4 py-4 text-sm font-semibold text-[#0b315d]">
                Priority
              </th>

              <th className="px-4 py-4 text-sm font-semibold text-[#0b315d]">
                Status
              </th>

              <th className="w-[55px] px-4 py-4 text-center">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={onToggleAll}
                  className="h-4 w-4 cursor-pointer accent-blue-600"
                />
              </th>
            </tr>
          </thead>

          <tbody>
            {requests.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="h-[115px] px-4 text-center text-sm text-slate-400"
                >
                  No helpdesk requests found
                </td>
              </tr>
            ) : (
              requests.map((request) => {
                const isSelected = selectedIds.includes(
                  request.id,
                );

                return (
                  <tr
                    key={request.id}
                    className="border-t border-slate-100 transition hover:bg-slate-50"
                  >
                    <td className="px-4 py-4 text-sm">
                      <button
                        type="button"
                        onClick={() => onView(request)}
                        className="font-medium text-blue-600 hover:underline"
                      >
                        {request.requestId || request.id}
                      </button>
                    </td>

                    <td className="px-4 py-4 text-sm text-slate-700">
                      {request.employeeName || "-"}
                    </td>

                    <td className="px-4 py-4 text-sm text-slate-700">
                      {request.category || "-"}
                    </td>

                    <td
                      className="max-w-[250px] truncate px-4 py-4 text-sm text-slate-700"
                      title={request.subject}
                    >
                      {request.subject || "-"}
                    </td>

                    <td className="px-4 py-4 text-sm text-slate-700">
                      {formatDate(request.createdDate)}
                    </td>

                    <td className="px-4 py-4 text-sm">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getPriorityClass(
                          request.priority,
                        )}`}
                      >
                        {request.priority || "-"}
                      </span>
                    </td>

                    <td className="px-4 py-4 text-sm">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getStatusClass(
                          request.status,
                        )}`}
                      >
                        {request.status || "Pending"}
                      </span>
                    </td>

                    <td className="px-4 py-4 text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() =>
                          onToggle(request.id)
                        }
                        className="h-4 w-4 cursor-pointer accent-blue-600"
                      />
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HelpdeskRequestsTable;