


import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import type {
  OnboardEmployee,
  OnboardFilters as OnboardFiltersType,
} from "../types/onboard.types";

import OnboardFilters from "./OnboardFilters";
import OnboardHeader from "./OnboardHeader";
import OnboardTable from "./OnboardTable";
import OnboardPagination from "./OnboardPagination";
import { useOnboard } from "../hooks/useOnboard";

const ONBOARD_DOCUMENTS = [
  { value: "confirmation-letter", label: "Confirmation Letter" },
];

export default function OnboardConfirmationLetterPage() {
  const navigate = useNavigate();
  const { docType, domain } = useParams<{
    docType?: string;
    domain?: string;
  }>();

  const { employees, filters, updateFilter, resetFilters } = useOnboard();

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const resolvedDocType = docType ?? "confirmation-letter";

  const documentTitle =
    ONBOARD_DOCUMENTS.find(
      (document) => document.value === resolvedDocType,
    )?.label ?? "Confirmation Letter";

  const baseInsightsPath = domain
    ? `/${domain}/admin/insights`
    : "/insights";

  const paginatedEmployees = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;

    return employees.slice(startIndex, startIndex + rowsPerPage);
  }, [employees, currentPage, rowsPerPage]);

  const handleSearchChange = (value: string) => {
    setCurrentPage(1);
    updateFilter("search", value);
  };

  const handleFilterChange = (
    key: keyof OnboardFiltersType,
    value: string,
  ) => {
    setCurrentPage(1);
    updateFilter(key, value);
  };

  const handleReset = () => {
    setCurrentPage(1);
    resetFilters();
  };

  const handleRowsPerPageChange = (value: number) => {
    setRowsPerPage(value);
    setCurrentPage(1);
  };

  const handleBack = () => {
    navigate(`${baseInsightsPath}/onboard`);
  };

  const handleViewEmployee = (employee: OnboardEmployee) => {
    if (resolvedDocType === "confirmation-letter") {
      navigate(`${employee.employeeId}`);
      return;
    }

    navigate(
      `${baseInsightsPath}/onboard/document/confirmation-letter/${employee.employeeId}`,
    );
  };

  return (
    <div className="min-h-[calc(100vh-82px)] bg-[#f5f7fb] p-2 sm:p-3">
      <div className="min-h-[calc(100vh-100px)] overflow-hidden rounded-md border border-slate-200 bg-[#f8f9fc]">
        <OnboardHeader
          title={documentTitle}
          onBack={handleBack}
        />

        <OnboardFilters
          search={filters.search}
          onSearchChange={handleSearchChange}
          onFilterChange={(key, value) =>
            handleFilterChange(key, value)
          }
          onReset={handleReset}
        />

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
