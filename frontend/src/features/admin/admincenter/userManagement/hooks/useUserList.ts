// useUserList.ts

import { useEffect, useState } from "react";
import { fetchUsers, fetchUserSummary } from "../api/userManagementApi";
import { DEFAULT_ROWS_PER_PAGE, PAGINATION_VISIBLE_PAGES } from "../constants/userManagementConstants";
import type { UserRow } from "../types/user.types";

export const useUserList = () => {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_ROWS_PER_PAGE);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    Promise.all([fetchUsers(), fetchUserSummary()]).then(([userRows, summary]) => {
      if (cancelled) return;
      setUsers(userRows);
      setTotalRecords(summary.totalRecords);
      setTotalPages(summary.totalPages);
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return {
    users,
    loading,
    totalRecords,
    totalPages,
    visiblePages: PAGINATION_VISIBLE_PAGES,
    rowsPerPage,
    setRowsPerPage,
    currentPage,
    setCurrentPage,
  };
};
