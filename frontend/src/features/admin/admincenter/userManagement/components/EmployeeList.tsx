import { FiEdit2 } from "react-icons/fi";
// import EmployeeFilterBar from "./EmployeeFilterBar";
import { useEmployeeList } from "../hooks/useEmployeeList";
import { ROWS_PER_PAGE_OPTIONS, PAGINATION_VISIBLE_PAGES } from "../constants/userManagementConstants";
import type { CreatedEmployee, PendingEmployee } from "../types/employee.types";

/* ---------- shared bits ---------- */

const StatusPill = ({
  positive,
  positiveLabel,
  negativeLabel,
}: {
  positive: boolean;
  positiveLabel: string;
  negativeLabel: string;
}) => (
  <span
    className={`inline-block px-3 py-1 rounded-md text-xs font-medium ${
      positive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
    }`}
  >
    {positive ? positiveLabel : negativeLabel}
  </span>
);

const ActiveToggle = ({ active }: { active: boolean }) => (
  <button
    className={`relative w-11 h-6 rounded-full transition-colors ${
      active ? "bg-green-500" : "bg-gray-300"
    }`}
  >
    <span
      className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
        active ? "translate-x-5" : "translate-x-0"
      }`}
    />
  </button>
);

const EditButton = () => (
  <button className="text-gray-500 hover:text-violet-600">
    <FiEdit2 size={16} />
  </button>
);

const PaginationFooter = ({
  rowsPerPage,
  setRowsPerPage,
  currentPage,
  setCurrentPage,
  totalRecords,
  totalPages,
}: {
  rowsPerPage: number;
  setRowsPerPage: (n: number) => void;
  currentPage: number;
  setCurrentPage: (updater: (p: number) => number) => void;
  totalRecords: number;
  totalPages: number;
}) => (
  <div className="flex items-center justify-between px-5 py-4 border-t flex-wrap gap-3">
    <div className="flex items-center gap-2 text-sm text-gray-600">
      <span>Rows per page</span>
      <select
        value={rowsPerPage}
        onChange={(e) => setRowsPerPage(Number(e.target.value))}
        className="border rounded-md px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-violet-500"
      >
        {ROWS_PER_PAGE_OPTIONS.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>

    <div className="flex items-center gap-3 text-sm text-gray-600">
      <span>
        1 to {rowsPerPage} of {totalRecords}
      </span>

      <div className="flex items-center gap-1">
        <button
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          className="w-8 h-8 flex items-center justify-center rounded-md border hover:bg-gray-100"
        >
          &lt;
        </button>

        {PAGINATION_VISIBLE_PAGES.map((page) => (
          <button
            key={page}
            onClick={() => setCurrentPage(() => page)}
            className={`w-8 h-8 flex items-center justify-center rounded-md text-sm ${
              currentPage === page
                ? "bg-violet-100 text-violet-600 font-medium"
                : "hover:bg-gray-100"
            }`}
          >
            {page}
          </button>
        ))}

        <span className="px-1">...</span>

        <button
          onClick={() => setCurrentPage(() => totalPages)}
          className={`w-8 h-8 flex items-center justify-center rounded-md text-sm ${
            currentPage === totalPages
              ? "bg-violet-100 text-violet-600 font-medium"
              : "hover:bg-gray-100"
          }`}
        >
          {totalPages}
        </button>

        <button
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          className="w-8 h-8 flex items-center justify-center rounded-md border hover:bg-gray-100"
        >
          &gt;
        </button>
      </div>
    </div>
  </div>
);

/* ---------- sub-tab tables ---------- */

const EmployeeCreatedTable = ({ rows }: { rows: CreatedEmployee[] }) => (
  <table className="w-full">
    <thead className="bg-gray-100">
      <tr>
        <th className="text-left p-4 text-sm text-gray-600">Employee Name</th>
        <th className="text-left p-4 text-sm text-gray-600">Mobile No.</th>
        <th className="text-left p-4 text-sm text-gray-600">Email Id.</th>
        <th className="text-left p-4 text-sm text-gray-600">ESS Role</th>
        <th className="text-left p-4 text-sm text-gray-600">Payroll Role.</th>
        <th className="text-left p-4 text-sm text-gray-600">Login Status</th>
        <th className="text-center p-4 text-sm text-gray-600">Active</th>
        <th className="text-center p-4 text-sm text-gray-600">Action</th>
      </tr>
    </thead>
    <tbody>
      {rows.map((emp) => (
        <tr key={emp.id} className="border-t hover:bg-gray-50">
          <td className="p-4">
            <div className="text-violet-600 text-xs font-medium">{emp.id}</div>
            <div className="font-medium text-gray-800">{emp.name}</div>
          </td>
          <td className="p-4 text-gray-700">{emp.mobile}</td>
          <td className="p-4 text-gray-700">{emp.email}</td>
          <td className="p-4 text-gray-700">{emp.essRole}</td>
          <td className="p-4 text-gray-700">{emp.payrollRole}</td>
          <td className="p-4">
            <StatusPill
              positive={emp.loginDone}
              positiveLabel="Login done"
              negativeLabel="Login not done"
            />
          </td>
          <td className="p-4">
            <div className="flex justify-center">
              <ActiveToggle active={emp.active} />
            </div>
          </td>
          <td className="p-4">
            <div className="flex justify-center">
              <EditButton />
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

const PendingEmployeeTable = ({ rows }: { rows: PendingEmployee[] }) => (
  <table className="w-full">
    <thead className="bg-gray-100">
      <tr>
        <th className="text-left p-4 text-sm text-gray-600">Employee Name</th>
        <th className="text-left p-4 text-sm text-gray-600">Mobile No.</th>
        <th className="text-left p-4 text-sm text-gray-600">Email Id.</th>
        <th className="text-left p-4 text-sm text-gray-600">Email Verification Status</th>
        <th className="text-center p-4 text-sm text-gray-600">Action</th>
      </tr>
    </thead>
    <tbody>
      {rows.map((emp) => (
        <tr key={emp.id} className="border-t hover:bg-gray-50">
          <td className="p-4">
            <div className="text-violet-600 text-xs font-medium">{emp.id}</div>
            <div className="font-medium text-gray-800">{emp.name}</div>
          </td>
          <td className="p-4 text-gray-700">{emp.mobile}</td>
          <td className="p-4 text-gray-700">{emp.email}</td>
          <td className="p-4">
            <StatusPill
              positive={emp.emailVerified === "valid"}
              positiveLabel="Verified"
              negativeLabel="Not Verified"
            />
          </td>
          <td className="p-4">
            <div className="flex justify-center">
              <EditButton />
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

const InactiveEmployeeTable = ({ rows }: { rows: CreatedEmployee[] }) => (
  <table className="w-full">
    <thead className="bg-gray-100">
      <tr>
        <th className="text-left p-4 text-sm text-gray-600">Employee Name</th>
        <th className="text-left p-4 text-sm text-gray-600">Mobile No.</th>
        <th className="text-left p-4 text-sm text-gray-600">Email Id.</th>
        <th className="text-left p-4 text-sm text-gray-600">ESS Role</th>
        <th className="text-left p-4 text-sm text-gray-600">Payroll Role.</th>
        <th className="text-left p-4 text-sm text-gray-600">Login Status</th>
        <th className="text-center p-4 text-sm text-gray-600">Active</th>
        <th className="text-center p-4 text-sm text-gray-600">Action</th>
      </tr>
    </thead>
    <tbody>
      {rows.map((emp) => (
        <tr key={emp.id} className="border-t hover:bg-gray-50">
          <td className="p-4">
            <div className="text-violet-600 text-xs font-medium">{emp.id}</div>
            <div className="font-medium text-gray-800">{emp.name}</div>
          </td>
          <td className="p-4 text-gray-700">{emp.mobile}</td>
          <td className="p-4 text-gray-700">{emp.email}</td>
          <td className="p-4 text-gray-700">{emp.essRole}</td>
          <td className="p-4 text-gray-700">{emp.payrollRole}</td>
          <td className="p-4">
            <StatusPill
              positive={emp.loginDone}
              positiveLabel="Login done"
              negativeLabel="Login not done"
            />
          </td>
          <td className="p-4">
            <div className="flex justify-center">
              <ActiveToggle active={emp.active} />
            </div>
          </td>
          <td className="p-4">
            <div className="flex justify-center">
              <EditButton />
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

const UpdatedEmailEmptyState = () => (
  <div className="flex flex-col items-center justify-center py-16 px-6">
    <svg
      width="210"
      height="150"
      viewBox="0 0 210 150"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="mb-4"
    >
      <circle cx="18" cy="60" r="2" fill="#C7D2FE" />
      <circle cx="10" cy="90" r="2" fill="#C7D2FE" />
      <circle cx="196" cy="70" r="2" fill="#C7D2FE" />
      <path d="M172 30 l3 3 3-3-3-3z" fill="#C7D2FE" />

      <g transform="translate(40,28)">
        <circle cx="10" cy="10" r="9" fill="#EDE9FE" stroke="#C4B5FD" strokeWidth="1.5" />
        <circle cx="10" cy="10" r="3.5" fill="#fff" stroke="#C4B5FD" strokeWidth="1.2" />
      </g>

      <rect x="118" y="30" width="46" height="60" rx="6" fill="#E0E7FF" stroke="#C7D2FE" strokeWidth="1.5" />
      <text x="141" y="66" textAnchor="middle" fontSize="16" fill="#A5B4FC" fontFamily="Arial" fontWeight="bold">
        ?
      </text>

      <g transform="translate(55,55)">
        <rect x="0" y="0" width="90" height="58" rx="6" fill="#EEF2FF" stroke="#C7D2FE" strokeWidth="2" />
        <rect x="10" y="10" width="70" height="38" rx="3" fill="#fff" stroke="#DDD6FE" strokeWidth="1.5" />
        <text x="45" y="35" textAnchor="middle" fontSize="15" fill="#A5B4FC" fontFamily="Arial" fontWeight="bold">
          ?
        </text>
        <rect x="-6" y="58" width="102" height="8" rx="3" fill="#DDD6FE" />
      </g>

      <g transform="translate(150,45)">
        <circle cx="14" cy="14" r="14" fill="#fff" stroke="#FED7AA" strokeWidth="1" />
        <rect x="2" y="2" width="24" height="24" rx="6" fill="#FB923C" />
        <path d="M14 8 L20 19 H8 Z" fill="#fff" />
        <rect x="13" y="12" width="2" height="4" fill="#FB923C" />
        <circle cx="14" cy="17.5" r="1" fill="#FB923C" />
      </g>

      <g transform="translate(30,72)">
        <rect x="0" y="0" width="26" height="26" rx="6" fill="#F87171" />
        <circle cx="13" cy="13" r="8" fill="none" stroke="#fff" strokeWidth="2" />
        <line x1="7.5" y1="18.5" x2="18.5" y2="7.5" stroke="#fff" strokeWidth="2" />
      </g>

      <path d="M20 118 q10 -18 26 -14 q-8 14 -26 14z" fill="#FDBA74" opacity="0.7" />
      <path d="M14 122 q8 -10 20 -8 q-6 10 -20 8z" fill="#FB923C" opacity="0.6" />

      <g transform="translate(150,95)">
        <path d="M4 10 h30 l-4 22 a4 4 0 0 1 -4 3.5 h-14 a4 4 0 0 1 -4 -3.5 z" fill="#FBBF24" />
        <path d="M12 10 q7 -14 15 0z" fill="#86EFAC" />
      </g>

      <g transform="translate(120,100)">
        <circle cx="16" cy="16" r="15" fill="#fff" stroke="#FBBF24" strokeWidth="3" />
        <circle cx="12" cy="13" r="1.6" fill="#78350F" />
        <circle cx="20" cy="13" r="1.6" fill="#78350F" />
        <path d="M11 21 q5 -4 10 0" stroke="#78350F" strokeWidth="1.6" fill="none" strokeLinecap="round" />
        <line x1="26" y1="26" x2="34" y2="34" stroke="#FBBF24" strokeWidth="4" strokeLinecap="round" />
      </g>

      <ellipse cx="105" cy="140" rx="70" ry="6" fill="#EEF2FF" />
    </svg>
    <p className="text-gray-500 text-sm">No Data Found In Employee</p>
  </div>
);

/* ---------- main component ---------- */

const EmployeeList = () => {
  const {
    subTabs,
    activeSubTab,
    setActiveSubTab,
    search,
    setSearch,
    clearSearch,
    rowsPerPage,
    setRowsPerPage,
    currentPage,
    setCurrentPage,
    totalRecords,
    totalPages,
    loading,
    showEmptyState,
    filteredCreatedEmployees,
    filteredPendingEmployees,
    filteredInactiveEmployees,
  } = useEmployeeList();

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      {/* Sub Tabs */}
      <div className="flex gap-2 px-5 py-3 bg-gray-50 border-b flex-wrap">
        {subTabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveSubTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
              activeSubTab === tab
                ? "bg-white border border-violet-600 text-violet-600"
                : "text-gray-600 hover:text-violet-600"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Filter bar */}
      {/* <div className="border-b">
        <EmployeeFilterBar search={search} onSearchChange={setSearch} onClear={clearSearch} />
      </div> */}

      {/* Content */}
      {loading ? (
        <div className="px-5 py-16 text-center text-sm text-gray-400">Loading employees…</div>
      ) : showEmptyState ? (
        <div className="px-5 pt-5">
          <div className="border rounded-xl">
            <UpdatedEmailEmptyState />
          </div>
        </div>
      ) : (
        // <div className="overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <div>
          {activeSubTab === "Employee Created" && (
            <EmployeeCreatedTable rows={filteredCreatedEmployees} />
          )}
          {activeSubTab === "Pending Employee" && (
            <PendingEmployeeTable rows={filteredPendingEmployees} />
          )}
          {activeSubTab === "InActive Employee's" && (
            <InactiveEmployeeTable rows={filteredInactiveEmployees} />
          )}
        </div>
      )}

      {/* Pagination footer is always visible, matching every sub-tab */}
      <PaginationFooter
        rowsPerPage={rowsPerPage}
        setRowsPerPage={setRowsPerPage}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalRecords={totalRecords}
        totalPages={totalPages}
      />
    </div>
  );
};

export default EmployeeList;

