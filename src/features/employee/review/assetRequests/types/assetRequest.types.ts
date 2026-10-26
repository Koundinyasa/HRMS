export type AssetRequestStatus =
  | "Pending"
  | "Approved"
  | "Rejected"
  | "Cancelled";

export type AssetRequestPriority =
  | "Low"
  | "Medium"
  | "High"
  | "Critical";

export interface AssetRequest {
  id: number;
  requestId: string;
  employeeId: number | string;
  employeeName: string;
  employeeCode?: string;
  assetType: string;
  assetName: string;
  quantity: number;
  reason: string;
  priority: AssetRequestPriority;
  status: AssetRequestStatus;
  requestedDate: string;
  approvedDate?: string | null;
  rejectedDate?: string | null;
  remarks?: string;
}

export interface AssetRequestFormData {
  assetType: string;
  assetName: string;
  quantity: number;
  reason: string;
  priority: AssetRequestPriority;
}

export interface AssetRequestFilterParams {
  search?: string;
  status?: AssetRequestStatus | "All";
  assetType?: string | "All";
  priority?: AssetRequestPriority | "All";
}

export interface AssetRequestListResponse {
  data: AssetRequest[];
  total?: number;
  message?: string;
}

export interface AssetRequestResponse {
  data: AssetRequest;
  message?: string;
  success?: boolean;
}

export interface AssetRequestActionPayload {
  id: number;
  remarks?: string;
}

export interface AssetRequestApiError {
  message?: string;
  error?: string;
  status?: number;
}