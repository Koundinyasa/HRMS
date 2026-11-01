/**
 * MenuCode values (Mst_Menu.MenuCode) that the backend module gate checks.
 * Only the Phase 1 menus are listed. A route that is not tagged with one of
 * these (or @GateOpen) is switched off for the whole admin and recruitment area.
 */
export const MenuCode = {
  // Admin portal (HR Admin)
  AppliedLeave: 'HR_AppliedLeave',
  AddEmployee: 'HR_AddEmployee',
  CompanyDetails: 'HR_ComapnyDetails', // spelling matches the database row
  TimeOfficeDashboard: 'HR_TO_Dashboard',
  LeaveDaily: 'HR_TO_LeaveDaily',
  ForceLeaveApproval: 'HR_TO_ForceLeaveApproval',
  // Pre-Enrollment: proposed code, the TL must create the Mst_Menu row with this exact MenuCode.
  PreEnrollment: 'HR_PreEnrollment',

  // Employee portal: Review (reporting managers only)
  Review: 'Review',
} as const;

export type MenuCodeValue = (typeof MenuCode)[keyof typeof MenuCode];

/** RoleMenuPermission.RoleID of a reporting manager (Mst_Role 4). */
export const REPORTING_MANAGER_ROLE_ID = 4;
