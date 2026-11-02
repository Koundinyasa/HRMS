import {
  useMemo,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import MissedPunchFilters from "../components/MissedPunchFilters";
import MissedPunchNavbar from "../components/MissedPunchNavbar";
import MissedPunchTable from "../components/MissedPunchTable";

import {
  useMissedPunch,
} from "../hooks/useMissedPunchEmployees";
import { useGetMissedPunchQuery } from "@/features/admin/Time & Office/TimeOffice/api/timeofficeApi";
import type { ProcessDrilldownRow } from "@/features/admin/Time & Office/TimeOffice/types/timeoffice.types";
import {
  getMonthStartDate,
  getTodayDate,
} from "../validations/missedPunch.validation";
import type { MissedPunchFilters as MissedPunchFilterState } from "../types/missedPunch.types";

import type {
  MissedPunchEmployee,
} from "../types/missedPunch.types";

const normalizeFieldName = (field: string) =>
  field.replace(/[^a-z0-9]/gi, "").toLowerCase();

const getRowValue = (
  row: ProcessDrilldownRow,
  candidates: string[],
) => {
  const candidateNames = new Set(candidates.map(normalizeFieldName));
  const key = Object.keys(row).find((field) =>
    candidateNames.has(normalizeFieldName(field)),
  );
  return key ? String(row[key] ?? "") : "";
};

const toMissedPunchEmployee = (
  row: ProcessDrilldownRow,
): MissedPunchEmployee => ({
  ...row,
  employeeId: getRowValue(row, ["employeeId", "employeeCode", "employeeNo", "empId"]),
  employeeName: getRowValue(row, ["employeeName", "employeeFullName", "fullName", "name"]),
  punchDate: getRowValue(row, ["punchDate", "date", "attendanceDate"]),
});

export default function MissedPunchPage({
  adminMode = false,
}: {
  adminMode?: boolean;
}) {
  return adminMode ? <AdminMissedPunchPage /> : <EmployeeMissedPunchPage />;
}

function EmployeeMissedPunchPage() {
  const navigate = useNavigate();

  const {
    employees,
    isLoading,
    error,
    filters,
    setFromDate,
    setToDate,
    setSearchText,
    refetch,
  } = useMissedPunch();

  const filteredEmployees = useMemo(() => {
    const search =
      filters.searchText
        .trim()
        .toLowerCase();

    if (!search) {
      return employees;
    }

    return employees.filter(
      (employee) =>
        employee.employeeId
          .toLowerCase()
          .includes(search) ||
        employee.employeeName
          .toLowerCase()
          .includes(search),
    );
  }, [
    employees,
    filters.searchText,
  ]);

  const handleRegularize = (
    employee: MissedPunchEmployee,
  ) => {
    navigate(
      "../Punch",
      {
        state: {
          employeeId:
            employee.employeeId,

          selectedDate:
            employee.punchDate
              ?.slice(0, 10),
        },
      },
    );
  };

  return (
    <div className="min-h-full w-full min-w-0 bg-[#f4f5f9] p-3 sm:p-6">
      {/* Header / Navigation */}
      <MissedPunchNavbar
        filters={filters}
        onFromDateChange={setFromDate}
        onToDateChange={setToDate}
        onRefresh={() => {
          void refetch();
        }}
      />

      <MissedPunchFilters
        filters={filters}
        onSearchChange={setSearchText}
      />

      {/* Error */}
      {error && (
        <div className="mt-4 rounded-lg border border-black bg-red-50 px-4 py-3 text-sm text-red-600 font-[Urbanist]">
          {error}
        </div>
      )}

      {/* Table */}
      <MissedPunchTable
        employees={filteredEmployees}
        isLoading={isLoading}
        onAction={
          handleRegularize
        }
      />
    </div>
  );
}

function AdminMissedPunchPage() {
  const [filters, setFilters] = useState<MissedPunchFilterState>(() => ({
    fromDate: getMonthStartDate(),
    toDate: getTodayDate(),
    searchText: "",
  }));
  const {
    data: rows = [],
    isFetching,
    isError,
    refetch,
  } = useGetMissedPunchQuery({
    fromDate: filters.fromDate,
    tillDate: filters.toDate,
  });

  const employees = useMemo(
    () => rows.map(toMissedPunchEmployee),
    [rows],
  );
  const filteredEmployees = useMemo(() => {
    const search = filters.searchText.trim().toLowerCase();
    if (!search) return employees;
    return employees.filter((employee) =>
      employee.employeeId.toLowerCase().includes(search) ||
      employee.employeeName.toLowerCase().includes(search),
    );
  }, [employees, filters.searchText]);

  const updateFilter = (
    key: "fromDate" | "toDate" | "searchText",
    value: string,
  ) => {
    setFilters((current) => ({ ...current, [key]: value }));
  };

  return (
    <div className="min-h-full w-full min-w-0 bg-[#f4f5f9] p-3 sm:p-6">
      <MissedPunchNavbar
        adminMode
        filters={filters}
        onFromDateChange={(value) => updateFilter("fromDate", value)}
        onToDateChange={(value) => updateFilter("toDate", value)}
        onRefresh={() => void refetch()}
      />
      <MissedPunchFilters
        filters={filters}
        onSearchChange={(value) => updateFilter("searchText", value)}
      />
      {isError && (
        <div role="alert" className="mt-4 rounded-lg border border-black bg-red-50 px-4 py-3 text-sm text-red-600 font-[Urbanist]">
          Unable to load missed punch employees. Please try again.
        </div>
      )}
      <MissedPunchTable
        employees={filteredEmployees}
        isLoading={isFetching}
        onAction={() => undefined}
      />
    </div>
  );
}