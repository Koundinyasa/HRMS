// ===============================
// ASSET TYPE (Dropdown)
// ===============================
 
export interface AssetTypeItem {
  AssetID: number;
  AssetName: string;
}
 
// ===============================
// GENERIC DYNAMIC RESPONSE
// Used by Pending Requests &
// Asset Allocation History
// ===============================
 
export interface AssetField {
  label: string;
  value: unknown;
}
 
 
export interface AssetRecord {
  fields: AssetField[];
}
 
export interface AssetSection {
  title: string;
  records: AssetRecord[];
}
 
export interface PendingAssetResponse {
  sections: AssetSection[];
}
 
export interface AssetHistoryResponse {
  sections: AssetSection[];
}
 
export interface AssetTypesResponse {
  sections: AssetSection[];
}
 
 
 
// ===============================
// REQUEST STATUS
// (Already dynamic from backend)
// ===============================
 
export interface AssetStage {
  LevelNo: number;
  StageName: string;
  StageState: string;
  ApproverId: string;
}
 
export interface AssetRequestStatus {
  Id: number;
  OverallStatus: string;
  AssetName: string;
  RequestDate: string;
  TotalLevels: number;
  CurrentLevelNo: number;
  Stages: AssetStage[];
}
 
export interface AssetRequestStatusResponse {
  AssetRequests: AssetRequestStatus[];
}
 
// ===============================
// GENERIC API RESPONSE
// ===============================
 
export interface ApiMessageResponse {
  StatusCode: number;
  Message: string;
}
 
export interface CreateAssetRequestResponse
  extends ApiMessageResponse {
  RequestID: number;
}
 
// ===============================
// APPROVAL ACTION STATUS
// ===============================
 
export const ACTION_STATUS = {
  PENDING: 3,
  APPROVED: 4,
  REJECTED: 5,
} as const;
 
// ===============================
// Asset Request Validation
// ===============================
 
export interface AssetRequestInput {
  assetId: number | null;
  reason: string;
}
 
export interface ValidationResult {
  valid: boolean;
  error?: string;
}