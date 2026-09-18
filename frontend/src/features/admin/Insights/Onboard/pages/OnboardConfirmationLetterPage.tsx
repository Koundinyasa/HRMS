





import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import OnboardHeader from "../components/OnboardHeader";
import OnboardFilters from "../components/OnboardFilters";
import OnboardTable from "../components/OnboardTable";
import OnboardPagination from "../components/OnboardPagination";

import {
  ONBOARD_DOCUMENTS,
} from "../constants/onboard.constants";

import { useOnboard } from "../hooks/useOnboard";

import type {
  OnboardEmployee,
} from "../types/onboard.types";

export default function OnboardConfirmationLetterPage() {
  const navigate = useNavigate();

  const { docType, domain } = useParams<{
    docType?: string;
    domain?: string;
  }>();

  const basePath = domain
    ? `/${domain}/admin/insights/onboard`
    : "/insights/onboard";

  const {
    employees,
    filters,
    updateFilter,
    resetFilters,
  } = useOnboard();

  const [currentPage, setCurrentPage] =
    useState(1);

  const [rowsPerPage, setRowsPerPage] =
    useState(10);

  const documentTitle =
    ONBOARD_DOCUMENTS.find(
      (document) =>
        document.value === docType,
    )?.label ?? "Confirmation Letter";

  useEffect(() => {
    setCurrentPage(1);
  }, [
    filters.search,
    filters.branch,
    filters.designation,
    filters.employeeStatus,
  ]);

  const paginatedEmployees =
    useMemo(() => {
      const start =
        (currentPage - 1) *
        rowsPerPage;

      return employees.slice(
        start,
        start + rowsPerPage,
      );
    }, [
      employees,
      currentPage,
      rowsPerPage,
    ]);

  const handleSearchChange = (
    value: string,
  ) => {
    updateFilter("search", value);
  };

  const handleFilterChange = (
    key:
      | "search"
      | "branch"
      | "designation"
      | "employeeStatus",
    value: string,
  ) => {
    updateFilter(key, value);
  };

  const handleReset = () => {
    resetFilters();
    setCurrentPage(1);
  };

  const handleRowsPerPageChange = (
    value: number,
  ) => {
    setRowsPerPage(value);
    setCurrentPage(1);
  };

  const handleBack = () => {
    navigate(basePath);
  };

  const handleViewEmployee = (
    employee: OnboardEmployee,
  ) => {
    navigate(employee.employeeId);
  };

  return (
    <div className="min-h-[calc(100vh-82px)] bg-[#f5f7fb] p-2 sm:p-3 space-y-3">
      <OnboardHeader
        title={documentTitle}
        onBack={handleBack}
      />

      <OnboardFilters
        search={filters.search}
        onSearchChange={handleSearchChange}
        onFilterChange={handleFilterChange}
        onReset={handleReset}
      />

      <div className="rounded-lg border border-slate-200 bg-white">
        <OnboardTable
          employees={paginatedEmployees}
          currentPage={currentPage}
          rowsPerPage={rowsPerPage}
          onView={handleViewEmployee}
        />
        <OnboardPagination
          currentPage={currentPage}
          rowsPerPage={rowsPerPage}
          totalItems={employees.length}
          onPageChange={setCurrentPage}
          onRowsPerPageChange={handleRowsPerPageChange}
        />
      </div>
    </div>
  );
}