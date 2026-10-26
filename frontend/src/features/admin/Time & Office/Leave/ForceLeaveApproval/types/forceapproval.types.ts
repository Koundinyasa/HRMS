import type { FilterOption } from "@/features/admin/components/FilterDropdown";
import type { FilterValues } from "@/features/admin/components/FilterBar";

export type ForceLeaveApprovalTab =
  | "applied"
  | "cancellation";

export type ForceLeaveApprovalMonthTab =
  | "current"
  | "non-current";

export type LeaveApprovalViewType = "applied" | "cancellation";
export type LeaveApprovalMonthType = "current" | "non-current";

export interface LeaveApprovalRow {
  id: number;
  approverName: string;
  employeeId: string;
  employeeName: string;
  leaveName: string;
  date: string;
  fromDate: string;
  toDate: string;
  noofdays: string;
  noofdaysDisplay: string;
  reason: string;
  branchId?: string;
  branchName?: string;
  salaryStructureId?: string;
  salaryStructureName?: string;
  leaveTypeId?: string;
  leaveCode?: string;
  leaveFilterValues: string[];
  attendanceStatusId?: string;
  attendanceStatus?: string;
  designationId?: string;
  designationName?: string;
  employeeStatusId?: string;
  employeeStatus?: string;
}

export interface LeaveApprovalQuery {
  viewType: LeaveApprovalViewType;
  monthType: LeaveApprovalMonthType;
  approverId?: string;
  fromDate?: string;
  toDate?: string;
  branchId?: number;
  branchIds?: number[];
  employmentStatusId?: number;
  designationId?: number;
  leaveTypeId?: number;
  structureId?: number;
  attendanceStatusId?: number;
}

export interface HierarchicalLeaveActionRequest {
  approvalId: number;
  remarks?: string;
}

export interface CompanyDropdownData {
  branches: Record<string, unknown>[];
  salaryStructures: Record<string, unknown>[];
  leaveTypes: Record<string, unknown>[];
  leaveTypeCodes: Record<string, unknown>[];
  attendanceStatuses: Record<string, unknown>[];
  designations: Record<string, unknown>[];
  employeeStatuses: Record<string, unknown>[];
}

export interface ForceLeaveApprovalTableProps {
  rows: LeaveApprovalRow[];
  selectedIds?: number[];
  onSelectionChange?: (ids: number[]) => void;
  loading?: boolean;
}

export interface ForceLeaveApprovalRejectDialogProps {
  rows: LeaveApprovalRow[];
  onClose: () => void;
  onRejected: () => void;
  onSubmittingChange: (isSubmitting: boolean) => void;
}

export interface ForceLeaveApprovalPaginationControlsProps {
  itemCount: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

export interface ForceLeaveApprovalFiltersProps {
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  onAddFilter?: () => void;
  onClear?: () => void;
}

export interface ForceLeaveApprovalTabsProps {
  activeTab: LeaveApprovalViewType;
  onTabChange: (tab: LeaveApprovalViewType) => void;
}

export interface EmptyStateProps {
  message: string;
}

export interface ForceLeaveApprovalHeaderProps {
  hasSelection: boolean;
  isApproving: boolean;
  isRejecting: boolean;
  onApprove: () => void;
  onReject: () => void;
  onExport: () => void;
}

export interface ForceLeaveApprovalFilterBarProps {
  show: boolean;
  searchValue: string;
  filters: FilterValues;
  options: Record<string, FilterOption[]>;
  onSearchChange: (value: string) => void;
  onFilterChange: (key: keyof FilterValues, value: string[]) => void;
  onClear: () => void;
  onClose: () => void;
}

export interface ForceLeaveApprovalRecord {
  id: number;
  approverName: string;
  employeeId: string;
  employeeName: string;
  leaveName: string;
  date: string;
  days: string;
}

export interface ForceLeaveApprovalFilters {
  search: string;
  branchId?: number;
  salaryStructureId?: number;
  leaveId?: number;
  attendanceId?: number;
  designationId?: number;
  employmentStatusId?: number;
}

export interface ForceLeaveApprovalPagination {
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export interface ForceLeaveApprovalResponse {
  data: ForceLeaveApprovalRecord[];
  pagination: ForceLeaveApprovalPagination;
}

export interface ForceLeaveApprovalActionRequest {
  ids: number[];
  action: "approve" | "reject";
}

