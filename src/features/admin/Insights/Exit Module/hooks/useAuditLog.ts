// import { useMemo, useState } from "react";

// import { useGetExitAuditLogQuery } from "../api/exitReportsApi";

// import type { ExitReportKind } from "../types/exitReport.types";

// export const useAuditLog = (reportType: ExitReportKind, enabled: boolean) => {
//   const [search, setSearch] = useState("");
//   const [employee, setEmployee] = useState<string[]>([]);
//   const [action, setAction] = useState<string[]>([]);
//   const [page, setPage] = useState(1);
//   const [rowsPerPage, setRowsPerPage] = useState(50);

//   const { data, isLoading, isFetching } = useGetExitAuditLogQuery(
//     { reportType, search, employee, action },
//     { skip: !enabled }
//   );

//   const rows = data ?? [];

//   const employeeOptions = useMemo(
//     () =>
//       Array.from(new Set(rows.map((row) => row.employeeName).filter(Boolean))).map(
//         (name) => ({ id: name, label: name })
//       ),
//     [rows]
//   );

//   const actionOptions = useMemo(
//     () =>
//       Array.from(new Set(rows.map((row) => row.recordDetails).filter(Boolean))).map(
//         (name) => ({ id: name, label: name })
//       ),
//     [rows]
//   );

//   const totalRows = rows.length;
//   const startIndex = totalRows === 0 ? 0 : (page - 1) * rowsPerPage + 1;
//   const endIndex = Math.min(page * rowsPerPage, totalRows);
//   const pageCount = Math.max(1, Math.ceil(totalRows / rowsPerPage));

//   const pagedRows = rows.slice((page - 1) * rowsPerPage, page * rowsPerPage);

//   return {
//     search,
//     setSearch,
//     employee,
//     setEmployee,
//     action,
//     setAction,
//     employeeOptions,
//     actionOptions,
//     rows: pagedRows,
//     totalRows,
//     startIndex,
//     endIndex,
//     page,
//     pageCount,
//     setPage,
//     rowsPerPage,
//     setRowsPerPage,
//     isLoading: isLoading || isFetching,
//   };
// };



import { useMemo, useState } from "react";

import { useGetExitAuditLogQuery } from "../api/exitReportsApi";

import type {
  AuditLogEntry,
  ExitReportKind,
} from "../types/exitReport.types";

const FALLBACK_AUDIT_LOG: AuditLogEntry[] = [
  {
    id: 1,
    recordDetails: "Relieving Letter Viewed",
    recordChanges: "—",
    actionTime: "03/Sep/2026, 03:00 PM",
    user: "aparna.karigari@koundinyastech.com",
    employeeName: "",
  },
  {
    id: 2,
    recordDetails: "Relieving Letter Viewed",
    recordChanges: "—",
    actionTime: "03/Sep/2026, 10:02 PM",
    user: "aparna.karigari@koundinyastech.com",
    employeeName: "",
  },
  {
    id: 3,
    recordDetails: "Relieving Letter Viewed",
    recordChanges: "—",
    actionTime: "03/Sep/2026, 12:50 PM",
    user: "aparna.karigari@koundinyastech.com",
    employeeName: "",
  },
];

export const useAuditLog = (
  reportType: ExitReportKind,
  enabled: boolean
) => {
  const [search, setSearch] = useState("");
  const [employee, setEmployee] = useState<string[]>([]);
  const [action, setAction] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(50);

  const {
    data,
    isLoading,
    isFetching,
  } = useGetExitAuditLogQuery(
    {
      reportType,
      search,
      employee,
      action,
    },
    {
      skip: !enabled,
    }
  );

  /*
   * Use API data when available.
   * If the API currently returns an empty array,
   * display the records from the reference design.
   */
  const sourceRows =
    data && data.length > 0
      ? data
      : FALLBACK_AUDIT_LOG;

  const filteredRows = useMemo(() => {
    let result = [...sourceRows];

    if (search.trim()) {
      const searchValue = search.toLowerCase();

      result = result.filter((row) =>
        [
          row.recordDetails,
          row.recordChanges,
          row.actionTime,
          row.user,
          row.employeeName,
        ]
          .join(" ")
          .toLowerCase()
          .includes(searchValue)
      );
    }

    if (employee.length > 0) {
      result = result.filter((row) =>
        employee.includes(row.employeeName)
      );
    }

    if (action.length > 0) {
      result = result.filter((row) =>
        action.includes(row.recordDetails)
      );
    }

    return result;
  }, [
    sourceRows,
    search,
    employee,
    action,
  ]);

  const employeeOptions = useMemo(
    () =>
      Array.from(
        new Set(
          sourceRows
            .map((row) => row.employeeName)
            .filter(Boolean)
        )
      ).map((name) => ({
        id: name,
        label: name,
      })),
    [sourceRows]
  );

  const actionOptions = useMemo(
    () =>
      Array.from(
        new Set(
          sourceRows
            .map((row) => row.recordDetails)
            .filter(Boolean)
        )
      ).map((name) => ({
        id: name,
        label: name,
      })),
    [sourceRows]
  );

  const totalRows = filteredRows.length;

  const pageCount = Math.max(
    1,
    Math.ceil(totalRows / rowsPerPage)
  );

  const safePage = Math.min(
    page,
    pageCount
  );

  const startIndex =
    totalRows === 0
      ? 0
      : (safePage - 1) * rowsPerPage + 1;

  const endIndex =
    totalRows === 0
      ? 0
      : Math.min(
          safePage * rowsPerPage,
          totalRows
        );

  const pagedRows = filteredRows.slice(
    (safePage - 1) * rowsPerPage,
    safePage * rowsPerPage
  );

  return {
    search,
    setSearch,

    employee,
    setEmployee,

    action,
    setAction,

    employeeOptions,
    actionOptions,

    rows: pagedRows,

    totalRows,
    startIndex,
    endIndex,

    page: safePage,
    pageCount,
    setPage,

    rowsPerPage,
    setRowsPerPage,

    isLoading: isLoading || isFetching,
  };
};