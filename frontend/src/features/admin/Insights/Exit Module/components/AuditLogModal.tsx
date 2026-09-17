// import { ChevronLeft, ChevronRight, Clock, Eye, Filter as FilterIcon, User, Users, X } from "lucide-react";

// import FilterDropdown from "./FilterDropdown";

// import { useAuditLog } from "../hooks/useAuditLog";

// import type { ExitReportKind } from "../types/exitReport.types";

// type AuditLogModalProps = {
//   reportType: ExitReportKind;
//   open: boolean;
//   onClose: () => void;
// };

// export default function AuditLogModal({ reportType, open, onClose }: AuditLogModalProps) {
//   const auditLog = useAuditLog(reportType, open);

//   if (!open) {
//     return null;
//   }

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
//       <div className="flex max-h-[85vh] w-full max-w-4xl flex-col overflow-hidden rounded-xl bg-white shadow-xl">
//         {/* Header */}
//         <div className="flex items-center justify-between gap-4 border-b border-gray-100 px-6 py-4">
//           <div className="flex items-center gap-3">
//             <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#E9C9BC] bg-white text-[#8B4A3C]">
//               <Clock className="h-5 w-5" strokeWidth={2} />
//             </span>

//             <div>
//               <h2 className="text-base font-bold text-gray-900">Audit Log</h2>
//               <p className="text-xs text-gray-500">
//                 Track and monitor actions taken across the system
//               </p>
//             </div>
//           </div>

//           <div className="flex shrink-0 items-center gap-2">
//             <FilterDropdown
//               label="Employees"
//               boxed
//               icon={<Users size={15} className="text-gray-500" />}
//               options={auditLog.employeeOptions}
//               selected={auditLog.employee}
//               onChange={auditLog.setEmployee}
//             />

//             <FilterDropdown
//               label="Action"
//               boxed
//               icon={<FilterIcon size={15} className="text-[#8B4A3C]" />}
//               options={auditLog.actionOptions}
//               selected={auditLog.action}
//               onChange={auditLog.setAction}
//             />
//           </div>
//         </div>

//         {/* Table */}
//         <div className="flex-1 overflow-auto">
//           <table className="w-full min-w-[720px] border-collapse">
//             <thead>
//               <tr className="border-b border-[#F7E4DC] bg-[#FFF3F0] text-left">
//                 <th className="px-4 py-3 text-xs font-bold uppercase tracking-wide text-gray-600">
//                   <span className="flex items-center gap-1.5">
//                     <User size={13} />
//                     Record Details
//                   </span>
//                 </th>
//                 <th className="px-4 py-3 text-xs font-bold uppercase tracking-wide text-gray-600">
//                   Record Changes
//                 </th>
//                 <th className="px-4 py-3 text-xs font-bold uppercase tracking-wide text-gray-600">
//                   <span className="flex items-center gap-1.5">
//                     <Clock size={13} />
//                     Action Time
//                   </span>
//                 </th>
//                 <th className="px-4 py-3 text-xs font-bold uppercase tracking-wide text-gray-600">
//                   <span className="flex items-center gap-1.5">
//                     <User size={13} />
//                     User
//                   </span>
//                 </th>
//                 <th className="px-4 py-3 text-xs font-bold uppercase tracking-wide text-gray-600">
//                   Employee Name
//                 </th>
//               </tr>
//             </thead>

//             <tbody>
//               {auditLog.isLoading ? (
//                 <tr>
//                   <td colSpan={5} className="px-4 py-10 text-center text-sm text-gray-400">
//                     Loading audit log...
//                   </td>
//                 </tr>
//               ) : auditLog.rows.length === 0 ? (
//                 <tr>
//                   <td colSpan={5} className="px-4 py-10 text-center text-sm text-gray-400">
//                     No audit records found
//                   </td>
//                 </tr>
//               ) : (
//                 auditLog.rows.map((row, index) => (
//                   <tr
//                     key={row.id}
//                     className={`border-b border-gray-100 ${
//                       index % 2 === 0 ? "bg-white" : "bg-gray-50/60"
//                     }`}
//                   >
//                     <td className="px-4 py-3">
//                       <span className="flex items-center gap-2 text-sm text-gray-800">
//                         <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
//                           <Eye size={13} />
//                         </span>
//                         {row.recordDetails}
//                       </span>
//                     </td>
//                     <td className="px-4 py-3 text-sm text-gray-400">
//                       {row.recordChanges || "—"}
//                     </td>
//                     <td className="px-4 py-3 text-sm text-gray-700">{row.actionTime}</td>
//                     <td className="px-4 py-3">
//                       <span className="flex items-center gap-2 text-sm text-gray-500">
//                         <span className="h-6 w-6 shrink-0 rounded-full bg-gray-200" />
//                         {row.user}
//                       </span>
//                     </td>
//                     <td className="px-4 py-3 text-sm text-gray-700">{row.employeeName}</td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>

//         {/* Footer */}
//         <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 px-6 py-3">
//           <div className="flex items-center gap-2 text-sm text-gray-600">
//             Rows per page:
//             <select
//               value={auditLog.rowsPerPage}
//               onChange={(event) => {
//                 auditLog.setRowsPerPage(Number(event.target.value));
//                 auditLog.setPage(1);
//               }}
//               className="rounded border border-gray-200 px-2 py-1 text-sm font-medium outline-none"
//             >
//               {[10, 25, 50, 100].map((size) => (
//                 <option key={size} value={size}>
//                   {size}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div className="flex items-center gap-3 text-sm text-gray-600">
//             <span>
//               {auditLog.startIndex} to {auditLog.endIndex} of {auditLog.totalRows}
//             </span>

//             <button
//               type="button"
//               onClick={() => auditLog.setPage((page) => Math.max(1, page - 1))}
//               disabled={auditLog.page <= 1}
//               className="flex h-7 w-7 items-center justify-center rounded-md bg-gray-100 text-gray-500 disabled:opacity-50"
//             >
//               <ChevronLeft size={15} />
//             </button>

//             <button
//               type="button"
//               onClick={() =>
//                 auditLog.setPage((page) => Math.min(auditLog.pageCount, page + 1))
//               }
//               disabled={auditLog.page >= auditLog.pageCount}
//               className="flex h-7 w-7 items-center justify-center rounded-md bg-gray-100 text-gray-500 disabled:opacity-50"
//             >
//               <ChevronRight size={15} />
//             </button>
//           </div>

//           <button
//             type="button"
//             onClick={onClose}
//             className="flex items-center gap-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
//           >
//             <X size={15} /> Cancel
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }


import { useState } from "react";

import {
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Eye,
  UserRound,
  UsersRound,
  X,
} from "lucide-react";

import { useAuditLog } from "../hooks/useAuditLog";

import type { ExitReportKind } from "../types/exitReport.types";

type AuditLogModalProps = {
  reportType: ExitReportKind;
  open: boolean;
  onClose: () => void;
};

export default function AuditLogModal({
  reportType,
  open,
  onClose,
}: AuditLogModalProps) {
  const auditLog = useAuditLog(
    reportType,
    open
  );

  const [employeeMenuOpen, setEmployeeMenuOpen] =
    useState(false);

  const [actionMenuOpen, setActionMenuOpen] =
    useState(false);

  if (!open) {
    return null;
  }

  return (
    <div
      className="
    fixed
    inset-0
    z-[9999]
    flex
    items-center
    justify-center
    overflow-y-auto
    bg-black/35
    p-2
    backdrop-blur-[3px]
    sm:p-4
  "

    >
      {/* =====================================================
          AUDIT LOG MODAL
         ===================================================== */}
      {/* <div
        className="
          flex
          h-[522px]
          w-full
          max-w-[1200px]
          flex-col
          overflow-hidden
          rounded-[16px]
          bg-white
          shadow-[0_12px_35px_rgba(0,0,0,0.20)]
        "
      > */}
      <div
        className="
    flex
    h-[calc(100vh-16px)]
    max-h-[522px]
    w-full
    max-w-[1200px]
    flex-col
    overflow-hidden
    rounded-[16px]
    bg-white
    shadow-[0_12px_35px_rgba(0,0,0,0.20)]
    sm:h-[522px]
  "
      >

        {/* ===================================================
            HEADER
           =================================================== */}
        {/* <div
          className="
            flex
            min-h-[92px]
            items-center
            justify-between
            border-b
            border-[#E5E7EB]
            px-6
          "
        > */}

        <div
          className="
    flex
    min-h-[92px]
    flex-col
    gap-3
    border-b
    border-[#E5E7EB]
    px-3
    py-3
    sm:flex-row
    sm:items-center
    sm:justify-between
    sm:px-6
    sm:py-0
  "
        >
          {/* LEFT */}
          <div className="flex min-w-0 items-center gap-3">

            <div
              className="
                flex
                h-[42px]
                w-[42px]
                items-center
                justify-center
                rounded-[10px]
                border
                border-[#DFAFA0]
                bg-[#FFF8F5]
                text-[#9A5746]
              "
            >
              <Clock3
                className="h-5 w-5"
                strokeWidth={2}
              />
            </div>

            <div className="min-w-0">
              <h2
                className="
                  text-[20px]
                  font-semibold
                  leading-6
                  text-[#172033]
                "
              >
                Audit Log
              </h2>

              <p
                className="
    mt-1
    max-w-full
    text-[11px]
    leading-4
    text-[#64748B]
    sm:text-[12px]
  "
              >
                Track and monitor actions taken across the system
              </p>
            </div>
          </div>

          {/* RIGHT FILTERS */}
          <div className="flex w-full items-center gap-2 sm:w-auto sm:gap-3">

            {/* EMPLOYEES */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setEmployeeMenuOpen(
                    (previous) => !previous
                  );
                  setActionMenuOpen(false);
                }}
                className="
  flex
  h-[38px]
  min-w-0
  flex-1
  items-center
  justify-between
  gap-2
  rounded-[8px]
  border
  border-[#D9E0EA]
  bg-white
  px-2
  text-[13px]
  font-medium
  text-[#334155]
  sm:min-w-[142px]
  sm:flex-none
  sm:px-3
  sm:text-[14px]
"
              >
                <span className="flex items-center gap-2">
                  <UsersRound
                    className="h-4 w-4"
                    strokeWidth={1.8}
                  />

                  Employees
                </span>

                <ChevronDown
                  className="h-4 w-4"
                  strokeWidth={2}
                />
              </button>

              {employeeMenuOpen && (
                <div
                  className="
                    absolute
                    right-0
                    top-[44px]
                    z-[10000]
                    w-[220px]
                    overflow-hidden
                    rounded-lg
                    border
                    border-gray-200
                    bg-white
                    shadow-lg
                  "
                >
                  {auditLog.employeeOptions.length ===
                    0 ? (
                    <div className="px-4 py-3 text-sm text-gray-400">
                      No employees
                    </div>
                  ) : (
                    auditLog.employeeOptions.map(
                      (option) => {
                        const checked =
                          auditLog.employee.includes(
                            option.id
                          );

                        return (
                          <label
                            key={option.id}
                            className="
                              flex
                              cursor-pointer
                              items-center
                              gap-2
                              px-4
                              py-2.5
                              text-sm
                              hover:bg-gray-50
                            "
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => {
                                auditLog.setEmployee(
                                  checked
                                    ? auditLog.employee.filter(
                                      (value) =>
                                        value !==
                                        option.id
                                    )
                                    : [
                                      ...auditLog.employee,
                                      option.id,
                                    ]
                                );

                                auditLog.setPage(1);
                              }}
                            />

                            <span>
                              {option.label}
                            </span>
                          </label>
                        );
                      }
                    )
                  )}
                </div>
              )}
            </div>

            {/* ACTION */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setActionMenuOpen(
                    (previous) => !previous
                  );
                  setEmployeeMenuOpen(false);
                }}
                className="
                  flex
                  h-[38px]
                  min-w-0
flex-1
sm:min-w-[116px]
sm:flex-none
                  items-center
                  justify-between
                  gap-2
                  rounded-[8px]
                  border
                  border-[#9A5746]
                  bg-[#FFF8F5]
                  px-3
                  text-[14px]
                  font-medium
                  text-[#814A3C]
                "
              >
                <span className="flex items-center gap-2">
                  <FilterIcon />

                  Action
                </span>

                <ChevronDown
                  className="h-4 w-4"
                  strokeWidth={2}
                />
              </button>

              {actionMenuOpen && (
                <div
                  className="
                    absolute
right-0
top-[44px]
z-[10000]
w-[min(220px,calc(100vw-24px))]
max-h-[45vh]
overflow-y-auto
overflow-hidden
rounded-lg
border
border-gray-200
bg-white
shadow-lg
                  "
                >
                  {auditLog.actionOptions.length ===
                    0 ? (
                    <div className="px-4 py-3 text-sm text-gray-400">
                      No actions
                    </div>
                  ) : (
                    auditLog.actionOptions.map(
                      (option) => {
                        const checked =
                          auditLog.action.includes(
                            option.id
                          );

                        return (
                          <label
                            key={option.id}
                            className="
                              flex
                              cursor-pointer
                              items-center
                              gap-2
                              px-4
                              py-2.5
                              text-sm
                              hover:bg-gray-50
                            "
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => {
                                auditLog.setAction(
                                  checked
                                    ? auditLog.action.filter(
                                      (value) =>
                                        value !==
                                        option.id
                                    )
                                    : [
                                      ...auditLog.action,
                                      option.id,
                                    ]
                                );

                                auditLog.setPage(1);
                              }}
                            />

                            <span>
                              {option.label}
                            </span>
                          </label>
                        );
                      }
                    )
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ===================================================
            TABLE
           =================================================== */}
        <div className="min-h-0 flex-1 overflow-auto">
           <div className="min-w-[900px]">
             <table className="w-full border-collapse">
            {/* TABLE HEADER */}
            <thead>
              <tr className="bg-[#FFF1EC]">

                <th
                  className="
                    w-[20%]
                    border-b
                    border-[#E5D5CF]
                    px-6
                    py-3
                    text-left
                    text-[12px]
                    font-semibold
                    text-[#30343B]
                  "
                >
                  <div className="flex items-center gap-2">
                    <FileIcon />

                    RECORD DETAILS
                  </div>
                </th>

                <th
                  className="
                    w-[20%]
                    border-b
                    border-[#E5D5CF]
                    px-6
                    py-3
                    text-left
                    text-[12px]
                    font-semibold
                    text-[#30343B]
                    sm:px-6
    sm:text-[12px]
                  "
                >
                  RECORD CHANGES
                </th>

                <th
                  className="
                    w-[20%]
                    border-b
                    border-[#E5D5CF]
                    px-6
                    py-3
                    text-left
                    text-[12px]
                    font-semibold
                    text-[#30343B]
                    sm:px-6
    sm:text-[12px]
                  "
                >
                  <div className="flex items-center gap-2">
                    <CalendarDays
                      className="h-3.5 w-3.5"
                      strokeWidth={1.8}
                    />

                    ACTION TIME
                  </div>
                </th>

                <th
                  className="
                    w-[20%]
                    border-b
                    border-[#E5D5CF]
                    px-6
                    py-3
                    text-left
                    text-[12px]
                    font-semibold
                    text-[#30343B]
                    sm:px-6
                    sm:text-[12px]
                  "
                >
                  <div className="flex items-center gap-2">
                    <UserRound
                      className="h-3.5 w-3.5"
                      strokeWidth={1.8}
                    />

                    USER
                  </div>
                </th>

                <th
                  className="
                    w-[20%]
                    border-b
                    border-[#E5D5CF]
                    px-6
                    py-3
                    text-left
                    text-[12px]
                    font-semibold
                    text-[#30343B]
                    sm:px-6
    sm:text-[12px]
                  "
                >
                  EMPLOYEE NAME
                </th>
              </tr>
            </thead>

            {/* TABLE BODY */}
            <tbody>
              {auditLog.rows.map(
                (row, index) => (
                  <tr
                    key={row.id}
                    className="
                      border-b
                      border-[#DCE3EA]
                      bg-[#F8FAFC]
                    "
                  >

                    {/* RECORD DETAILS */}
                    <td className="px-3 py-4 sm:px-6">
                      <div className="flex items-center gap-3">

                        <span
                          className="
                            flex
                            h-7
                            w-7
                            shrink-0
                            items-center
                            justify-center
                            rounded-md
                            bg-[#E5FAF2]
                            text-[#15B978]
                          "
                        >
                          <Eye
                            className="h-3.5 w-3.5"
                            strokeWidth={2}
                          />
                        </span>

                        <span
                          className="
                            whitespace-nowrap
                            text-[13px]
                            font-medium
                            text-[#172033]
                          "
                        >
                          {row.recordDetails}
                        </span>
                      </div>
                    </td>

                    {/* RECORD CHANGES */}
                    <td
                      className="
                        whitespace-nowrap
                        px-6
                        py-4
                        text-[13px]
                        text-[#64748B]
                      "
                    >
                      {row.recordChanges || "—"}
                    </td>

                    {/* ACTION TIME */}
                    <td
                      className="
                        whitespace-nowrap
                        px-6
                        py-4
                        text-[13px]
                        text-[#172033]
                      "
                    >
                      {row.actionTime}
                    </td>

                    {/* USER */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">

                        <span
                          className="
                            flex
                            h-6
                            w-6
                            shrink-0
                            items-center
                            justify-center
                            rounded-full
                            bg-[#CBD5E1]
                            text-white
                          "
                        >
                          <UserRound
                            className="h-3.5 w-3.5"
                            strokeWidth={1.8}
                          />
                        </span>

                        <span
                          className="
                            whitespace-nowrap
                            text-[13px]
                            text-[#64748B]
                          "
                        >
                          {row.user}
                        </span>
                      </div>
                    </td>

                    {/* EMPLOYEE NAME */}
                    <td
                      className="
                        whitespace-nowrap
                        px-6
                        py-4
                        text-[13px]
                        text-[#64748B]
                      "
                    >
                      {row.employeeName}
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
          </div>
        </div>

        {/* ===================================================
            FOOTER
           =================================================== */}
        <div
          className="
    flex
    min-h-[72px]
    flex-col
    items-stretch
    gap-3
    border-t
    border-[#E1E5EA]
    bg-white
    px-3
    py-3
    sm:flex-row
    sm:items-center
    sm:justify-between
    sm:gap-0
    sm:px-6
    sm:py-0
  "
        >

          {/* ROWS PER PAGE */}
          <div
            className="
    flex
    items-center
    gap-2
    text-[12px]
    text-[#475569]
    sm:text-[13px]
  "
          >
            <span>
              Rows per page:
            </span>

            <select
              value={auditLog.rowsPerPage}
              onChange={(event) => {
                auditLog.setRowsPerPage(
                  Number(event.target.value)
                );
                auditLog.setPage(1);
              }}
              className="
                h-8
                cursor-pointer
                rounded
                border
                border-transparent
                bg-transparent
                px-1
                text-[13px]
                font-semibold
                text-[#172033]
                outline-none
              "
            >
              {[10, 25, 50, 100].map(
                (size) => (
                  <option
                    key={size}
                    value={size}
                  >
                    {size}
                  </option>
                )
              )}
            </select>

            <ChevronDown
              className="h-3.5 w-3.5"
            />
          </div>

          <div
            className="
             flex
             items-center
             justify-between
             gap-2
             text-[12px]
             text-[#475569]
             sm:justify-center
             sm:gap-3
             sm:text-[13px]
  "
          >
            <span>
              {auditLog.startIndex} to{" "}
              {auditLog.endIndex} of{" "}
              {auditLog.totalRows}
            </span>

            <button
              type="button"
              disabled={auditLog.page <= 1}
              onClick={() =>
                auditLog.setPage(
                  (page) =>
                    Math.max(
                      1,
                      page - 1
                    )
                )
              }
              className="
                flex
                h-7
                w-7
                items-center
                justify-center
                rounded-md
                bg-[#EDF1F5]
                text-[#64748B]
                disabled:opacity-40
              "
            >
              <ChevronLeft
                className="h-4 w-4"
              />
            </button>

            <button
              type="button"
              disabled={
                auditLog.page >=
                auditLog.pageCount
              }
              onClick={() =>
                auditLog.setPage(
                  (page) =>
                    Math.min(
                      auditLog.pageCount,
                      page + 1
                    )
                )
              }
              className="
                flex
                h-7
                w-7
                items-center
                justify-center
                rounded-md
                bg-[#EDF1F5]
                text-[#64748B]
                disabled:opacity-40
              "
            >
              <ChevronRight
                className="h-4 w-4"
              />
            </button>
          </div>

          {/* CANCEL */}
          <button
            type="button"
            onClick={onClose}
            className="
              flex
              items-center
              gap-2
              rounded-[8px]
              border
              border-[#D9E0EA]
              bg-white
              px-5
              py-2
              text-[13px]
              font-medium
              text-[#475569]
              shadow-sm
              hover:bg-gray-50
            "
          >
            <X
              className="h-4 w-4"
              strokeWidth={2}
            />

            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

/* =============================================================
   SMALL ICONS
   ============================================================= */

function FilterIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 5H20L14 12V18L10 20V12L4 5Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FileIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6 3H14L19 8V21H6V3Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />

      <path
        d="M14 3V8H19"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}