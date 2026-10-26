import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import BulkUpdateTabs from "../components/BulkUpdateTabs";
import BulkUpdateStatutoryTable from "../components/BulkUpdateStatutoryTable";

import {
  BULK_UPDATE_TABS,
  BULK_UPDATE_SECTION_PATH,
} from "../constants/bulkUpdate.constants";

import { useBulkUpdate } from "../hooks/useBulkUpdate";

import type { StatutoryEmployeeRow } from "../types/bulkUpdate.types";

export default function BulkUpdateStatutoryPage() {
  const { domain } = useParams<{ domain: string }>();

  const {
    statutoryEmployees,
    filters,
    updateFilters,
    selectedEmployeeIds,
    selectEmployeeIds,
    toggleEmployeeId,
    clearSelection,
    selectedStatutories,
    updateSelectedStatutories,
    applicable,
    updateApplicable,
    updateStatutoryBulk,
    updateStatutoryBulkState,
  } = useBulkUpdate();

  const [month, setMonth] = useState("2026-06");

  const basePath = `/${domain ?? ""}/admin/${BULK_UPDATE_SECTION_PATH}`;

  const employees: StatutoryEmployeeRow[] =
    statutoryEmployees.data ?? [];

  useEffect(() => {
    if (
      selectedStatutories.length !== 1 ||
      employees.length === 0
    ) {
      return;
    }

    const key = selectedStatutories[0];

    const applicableIds = employees
      .filter(
        (employee) =>
          employee.statutoryApplicability?.[key]
      )
      .map((employee) => employee.employeeId);

    selectEmployeeIds(applicableIds);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedStatutories, employees]);

  const handleBulkSelectAll = (checked: boolean) => {
    selectEmployeeIds(
      checked
        ? employees.map((employee) => employee.employeeId)
        : []
    );
  };

  const handleUpdate = async () => {
    try {
      await updateStatutoryBulk({
        employeeIds: selectedEmployeeIds,
        month,
        statutories: selectedStatutories,
        applicable,
      }).unwrap();

      clearSelection();
    } catch (error) {
      console.error(
        "Failed to update statutory details:",
        error
      );
    }
  };

  return (
    <div className="min-h-full w-full bg-[#f8fafc] text-[#344054]">
      <BulkUpdateTabs
        basePath={basePath}
        tabs={BULK_UPDATE_TABS}
      />

      {statutoryEmployees.isLoading ? (
        <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">
          Loading employees...
        </div>
      ) : statutoryEmployees.isError ? (
        <div className="flex h-40 items-center justify-center text-sm text-destructive">
          Failed to load employees. Please try again.
        </div>
      ) : (
        <BulkUpdateStatutoryTable
          employees={employees}
          filters={filters}
          onFiltersChange={updateFilters}
          selectedIds={selectedEmployeeIds}
          onToggleId={toggleEmployeeId}
          onBulkSelectAll={handleBulkSelectAll}
          month={month}
          onMonthChange={setMonth}
          selectedStatutories={selectedStatutories}
          onStatutoriesChange={
            updateSelectedStatutories
          }
          applicable={applicable}
          onApplicableChange={updateApplicable}
          onUpdate={handleUpdate}
          isUpdating={
            updateStatutoryBulkState.isLoading
          }
        />
      )}
    </div>
  );
}