export interface AdjustmentRecord {
  id: number;
  leave: string;
  adjustmentType: string;
  numberOfDays: number | null;
  status: string;
  remarks: string;
}

export interface AdjustmentFilters {
  search: string;
  branchId?: number;
  salaryStructureId?: number;
  leaveId?: number;
  attendanceId?: number;
  designationId?: number;
  employmentStatusId?: number;
  month: string;
}

export interface AdjustmentPagination {
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export interface AdjustmentResponse {
  data: AdjustmentRecord[];
  pagination: AdjustmentPagination;
}

export interface AdjustmentFormData {
  leave: string;
  adjustmentType: string;
  numberOfDays: string;
  remarks: string;
}

export interface AdjustmentImportData {
  templateType: string;
  payMonth: string;
  file: File | null;
}