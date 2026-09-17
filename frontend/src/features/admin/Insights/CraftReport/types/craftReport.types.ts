export interface CraftReportTab {
  label: string;
  value: string;
}

export interface CraftReportTemplate {
  id: string;
  name: string;
  category: string;
  state: string;
}

export interface CreateNewFilePayload {
  category: string;
  subCategory: string;
  fileName: string;
  file: File | null;
}

export interface AuditLogEntry {
  id: string;
  recordDetails: string;
  recordChanges: string;
  actionTime: string;
  user: string;
  employeeName: string;
}

// ==================================================
// API request / response types
// ==================================================

export interface CraftReportListItem {
  id: string;
  fileName: string;
  category: string;
  subCategory?: string;
  uploadedBy?: string;
  uploadedAt?: string;
  fileUrl?: string;
}

export interface CraftReportListParams {
  tab?: string;
  category?: string;
  subCategory?: string;
  search?: string;
}

export interface StoreTemplateListParams {
  search?: string;
  categories?: string[];
}

export interface SaveStoreTemplatesPayload {
  categories: string[];
}

export interface AiUploadResponse {
  fileId: string;
  fileName: string;
  status: string;
}

export interface PdfProtectionSettings {
  isPasswordProtected: boolean;
}

export interface AuditLogParams {
  search?: string;
  employeeId?: string;
  action?: string;
}