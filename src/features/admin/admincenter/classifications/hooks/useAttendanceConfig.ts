import { useMemo, useState } from "react";
import type { AttendanceConfig } from "../types/attendance.types";
import { DEFAULT_ATTENDANCE_CONFIGS } from "../constants/attendance.constants";

let nextId = 2;

export const useAttendanceConfig = () => {
  const [configs, setConfigs] = useState<AttendanceConfig[]>(DEFAULT_ATTENDANCE_CONFIGS);
  const [search, setSearch] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [editingConfig, setEditingConfig] = useState<AttendanceConfig | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<AttendanceConfig | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return configs;
    return configs.filter(
      (c) => c.Name.toLowerCase().includes(q) || c.ShortName.toLowerCase().includes(q)
    );
  }, [configs, search]);

  const totalCount = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / rowsPerPage));
  const currentPage = Math.min(page, totalPages);
  const pageRows = useMemo(
    () => filtered.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage),
    [filtered, currentPage, rowsPerPage]
  );
  const rangeStart = totalCount === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1;
  const rangeEnd = Math.min(currentPage * rowsPerPage, totalCount);

  const toggleActive = (config: AttendanceConfig) => {
    setConfigs((prev) => prev.map((c) => (c.Id === config.Id ? { ...c, Active: !c.Active } : c)));
  };

  const openAdd = () => {
    setIsAdding(true);
    setEditingConfig({
      Id: 0,
      Name: "",
      ShortName: "",
      SalaryCalendarDays: "Actual days/Month",
      AttendanceType: "Daily",
      Independent: false,
      OtEnable: false,
      LateInEarlyOutEnable: false,
      Active: true,
    });
  };

  const openEdit = (config: AttendanceConfig) => {
    setIsAdding(false);
    setEditingConfig(config);
  };

  const closeEdit = () => {
    setEditingConfig(null);
    setIsAdding(false);
  };

  const saveEdit = () => {
    if (!editingConfig || !editingConfig.Name.trim() || !editingConfig.ShortName.trim()) return;
    if (isAdding) {
      setConfigs((prev) => [...prev, { ...editingConfig, Id: nextId++ }]);
    } else {
      setConfigs((prev) => prev.map((c) => (c.Id === editingConfig.Id ? editingConfig : c)));
    }
    closeEdit();
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    setConfigs((prev) => prev.filter((c) => c.Id !== deleteTarget.Id));
    setDeleteTarget(null);
  };

  return {
    search,
    setSearch,
    rowsPerPage,
    setRowsPerPage: (n: number) => {
      setRowsPerPage(n);
      setPage(1);
    },
    page: currentPage,
    setPage,
    totalPages,
    rangeStart,
    rangeEnd,
    totalCount,
    pageRows,
    toggleActive,
    editingConfig,
    setEditingConfig,
    isAdding,
    openAdd,
    openEdit,
    closeEdit,
    saveEdit,
    deleteTarget,
    setDeleteTarget,
    confirmDelete,
  };
};
