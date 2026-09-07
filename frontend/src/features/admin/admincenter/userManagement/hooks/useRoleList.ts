// useRoleList.ts

import { useEffect, useMemo, useState } from "react";
import { fetchRoles } from "../api/userManagementApi";
import { ROLE_LIST_MODULES } from "../constants/userManagementConstants";
import type { RoleRow, RoleModule } from "../types/role.types";

export const useRoleList = () => {
  const [roles, setRoles] = useState<RoleRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeModule, setActiveModule] = useState<RoleModule>(ROLE_LIST_MODULES[0]);

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    fetchRoles().then((data) => {
      if (cancelled) return;
      setRoles(data);
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const filteredRoles = useMemo(
    () => roles.filter((role) => role.module === activeModule),
    [roles, activeModule]
  );

  return {
    modules: ROLE_LIST_MODULES,
    activeModule,
    setActiveModule,
    filteredRoles,
    loading,
  };
};
