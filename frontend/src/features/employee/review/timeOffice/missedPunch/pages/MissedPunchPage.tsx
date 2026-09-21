import {
  useMemo,
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

import type {
  MissedPunchEmployee,
} from "../types/missedPunch.types";

export default function MissedPunchPage() {
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
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
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
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
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