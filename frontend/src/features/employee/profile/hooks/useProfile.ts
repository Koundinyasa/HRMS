import { useDashboard } from "../../dashboard/hooks/useDashboard";
import { useGetProfileInfoQuery } from "../api/profileApi";

export const useProfile = () => {
  // Sidebar menu (Profile Tabs)
  const { menuData } = useDashboard();

  // Profile API
  const {
    data: profileInfo,
    isLoading,
    isError,
  } = useGetProfileInfoQuery();

  // Employee Menu
  const employeeMenu =
    menuData?.data?.[0];

  // My Profile Menu
  const profileMenu =
    employeeMenu?.children?.find(
      (menu) => menu.menuName === "My Profile"
    );

  // Tabs
  const profileTabs =
    profileMenu?.children ?? [];

  return {
    profileTabs,
    profileInfo,
    isLoading,
    isError,
  };
};