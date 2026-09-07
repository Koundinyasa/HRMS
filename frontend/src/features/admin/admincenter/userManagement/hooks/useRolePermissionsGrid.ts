// useRolePermissionsGrid.ts

import { useEffect, useState } from "react";
import { fetchRoleAccessData } from "../api/userManagementApi";
import { PERMISSION_COLORS, PERMISSION_KEYS } from "../constants/userManagementConstants";
import type { PermissionRow, RoleAccessConfig } from "../types/role-access.types";

export const useRolePermissionsGrid = (selectedRole: string) => {
  const [roleAccessData, setRoleAccessData] = useState<Record<string, RoleAccessConfig>>({});
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState("");
  const [permissions, setPermissions] = useState<PermissionRow[]>([]);

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

  // Reset to the role's first module tab whenever the role or the
  // underlying data set changes.
  useEffect(() => {
    const roleConfig = roleAccessData[selectedRole];
    const firstTab = roleConfig?.modules[0] ?? "";

    setActiveTab(firstTab);
    setPermissions(roleConfig?.data[firstTab] ?? []);
  }, [selectedRole, roleAccessData]);

  const tabs = roleAccessData[selectedRole]?.modules ?? [];

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setPermissions(roleAccessData[selectedRole]?.data[tab] ?? []);
  };

  const togglePermission = (rowIndex: number, key: string) => {
    setPermissions((prev) => {
      const updated = [...prev];
      updated[rowIndex] = {
        ...updated[rowIndex],
        [key]: !updated[rowIndex][key as keyof PermissionRow],
      };
      return updated;
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
