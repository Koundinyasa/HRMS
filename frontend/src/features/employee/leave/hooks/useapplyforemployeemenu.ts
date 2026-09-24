// 🟡🟡🟡 CHANGED (START) 🟡🟡🟡
// NEW FILE: decides who can open "Apply Leave for Employee" from the SIDEBAR MENU
// data (the same menu API the sidebar uses) instead of a hardcoded employee ID list.
// If the backend sends the "Apply Leave for Employee" menu item for this user
// -> access is allowed. If not -> no access.
import { useGetMenusQuery } from "../../dashboard/api/dashboardApi";
import type { MenuItem } from "../../dashboard/types/dashboard.types";
 
const APPLY_FOR_EMPLOYEE_MENU_NAME = "apply leave for employee";
 
// Searches the whole menu tree (it can sit under Review, Leave, etc.)
const findMenuByName = (
  items: MenuItem[] = [],
  name: string,
): MenuItem | undefined => {
  for (const item of items) {
    if (item.menuName?.trim().toLowerCase() === name) return item;
 
    const found = findMenuByName(item.children, name);
    if (found) return found;
  }
 
  return undefined;
};
 
export function useApplyForEmployeeMenu() {
  const { data: menuData, isLoading } = useGetMenusQuery();
 
  const menuItem = findMenuByName(
    menuData?.data?.[0]?.children,
    APPLY_FOR_EMPLOYEE_MENU_NAME,
  );
 
  return {
    menuItem,
    hasAccess: Boolean(menuItem),
    isLoading,
  };
}
