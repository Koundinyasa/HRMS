// useRolePermissionsGrid.ts

import { useEffect, useState } from "react";
import { fetchRoleAccessData } from "../api/userManagementApi";
import { PERMISSION_COLORS, PERMISSION_KEYS } from "../constants/userManagementConstants";
import type { PermissionRow, RoleAccessConfig } from "../types/role-access.types";

export const useRolePermissionsGrid = (selectedRole: string) => {
  const [roleAccessData, setRoleAccessData] = useState<Record<string, RoleAccessConfig>>({});
  const [loading, setLoading] = useState(true);

  const [tabSelection, setTabSelection] = useState<{
    role: string;
    tab: string;
  } | null>(null);
  const [permissionOverrides, setPermissionOverrides] = useState<
    Record<string, PermissionRow[]>
  >({});
  const [previousRole, setPreviousRole] = useState(selectedRole);
  if (previousRole !== selectedRole) {
    setPreviousRole(selectedRole);
    setTabSelection(null);
  }

  useEffect(() => {
    let cancelled = false;

    fetchRoleAccessData().then((data) => {
      if (cancelled) return;
      setRoleAccessData(data);
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const tabs = roleAccessData[selectedRole]?.modules ?? [];
  const activeTab =
    tabSelection?.role === selectedRole && tabs.includes(tabSelection.tab)
      ? tabSelection.tab
      : (tabs[0] ?? "");
  const permissionsKey = `${selectedRole}:${activeTab}`;
  const permissions =
    permissionOverrides[permissionsKey] ??
    roleAccessData[selectedRole]?.data[activeTab] ??
    [];

  const handleTabChange = (tab: string) => {
    setTabSelection({ role: selectedRole, tab });
  };

  const togglePermission = (rowIndex: number, key: string) => {
    setPermissionOverrides((current) => {
      const prev =
        current[permissionsKey] ??
        roleAccessData[selectedRole]?.data[activeTab] ??
        [];
      const updated = [...prev];
      updated[rowIndex] = {
        ...updated[rowIndex],
        [key]: !updated[rowIndex][key as keyof PermissionRow],
      };
      return { ...current, [permissionsKey]: updated };
    });
  };

  return {
    loading,
    tabs,
    activeTab,
    handleTabChange,
    permissions,
    togglePermission,
    permissionKeys: PERMISSION_KEYS,
    colors: PERMISSION_COLORS,
  };
};
