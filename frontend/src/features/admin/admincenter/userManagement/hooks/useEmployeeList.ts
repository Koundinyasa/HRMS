// useEmployeeList.ts

import { useEffect, useMemo, useState } from "react";
import {
  fetchCreatedEmployees,
  fetchPendingEmployees,
  fetchInactiveEmployees,
  fetchEmployeeSummary,
} from "../api/userManagementApi";
import { EMPLOYEE_SUB_TABS, DEFAULT_ROWS_PER_PAGE } from "../constants/userManagementConstants";
import type { CreatedEmployee, PendingEmployee, EmployeeSubTab } from "../types/employee.types";

export const useEmployeeList = () => {
  const [activeSubTab, setActiveSubTabState] = useState<EmployeeSubTab>(EMPLOYEE_SUB_TABS[0]);
  const [search, setSearch] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_ROWS_PER_PAGE);
  const [currentPage, setCurrentPage] = useState(1);

  const [createdEmployees, setCreatedEmployees] = useState<CreatedEmployee[]>([]);
  const [pendingEmployees, setPendingEmployees] = useState<PendingEmployee[]>([]);
  const [inactiveEmployees, setInactiveEmployees] = useState<CreatedEmployee[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    Promise.all([
      fetchCreatedEmployees(),
      fetchPendingEmployees(),
      fetchInactiveEmployees(),
      fetchEmployeeSummary(),
    ]).then(([created, pending, inactive, summary]) => {
      if (cancelled) return;
      setCreatedEmployees(created);
      setPendingEmployees(pending);
      setInactiveEmployees(inactive);
      setTotalRecords(summary.totalRecords);
      setTotalPages(summary.totalPages);
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const setActiveSubTab = (tab: EmployeeSubTab) => {
    setActiveSubTabState(tab);
    setSearch("");
    setCurrentPage(1);
  };

  const clearSearch = () => setSearch("");

  const matchesSearch = (name: string) =>
    name.toLowerCase().includes(search.toLowerCase());

  const filteredCreatedEmployees = useMemo(
    () => createdEmployees.filter((e) => matchesSearch(e.name)),
    [createdEmployees, search]
  );

  const filteredPendingEmployees = useMemo(
    () => pendingEmployees.filter((e) => matchesSearch(e.name)),
    [pendingEmployees, search]
  );

  const filteredInactiveEmployees = useMemo(
    () => inactiveEmployees.filter((e) => matchesSearch(e.name)),
    [inactiveEmployees, search]
  );

  const showEmptyState = activeSubTab === "Updated Email ID";

  return {
    subTabs: EMPLOYEE_SUB_TABS,
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
  };
};
