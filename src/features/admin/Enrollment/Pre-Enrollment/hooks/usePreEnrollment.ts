import { useMemo, useState } from "react";
import { DASHBOARD_STATS } from "../constants/dashboard.constants";

export default function usePreEnrollment() {
  const [loading, setLoading] = useState(false);

  const [fromDate, setFromDate] = useState("");

  const [toDate, setToDate] = useState("");

  const [search, setSearch] = useState("");

  const dashboardStats = useMemo(() => {
    return DASHBOARD_STATS;
  }, []);

  const resetFilters = () => {
    setFromDate("");
    setToDate("");
    setSearch("");
  };

  return {
    loading,

    setLoading,

    dashboardStats,

    fromDate,
    setFromDate,

    toDate,
    setToDate,

    search,
    setSearch,

    resetFilters,
  };
}
