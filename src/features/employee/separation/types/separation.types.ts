/**
 * Overall Separation Status
 */
export type OverallStatus =
  | "Submitted"
  | "Approved"
  | "Rejected"
  | "Withdrawn";

/**
 * Individual Stage Status
 */
export type StageState =
  | "CURRENT"
  | "APPROVED"
  | "COMPLETED"
  | "REJECTED"
  | "PENDING"
  | "NOT VERIFIED";

/**
 * Single Approval Stage
 */
export interface SeparationStage {
  LevelNo: number;
  StageName: string;
  StageState: StageState | string;
  ApproverId: string;
}

/**
 * Separation Status API Response
 */
export interface SeparationStatusResponse {
  Id: number;
  OverallStatus: OverallStatus | string;
  FromDate: string;
  ToDate: string;
  AppliedDate: string;
  TotalLevels: number;
  CurrentLevelNo: number;
  Stages: SeparationStage[];
}

/**
 * Submit Resignation Request
 */
export interface ResignationRequest {
  requestedLastWorkingDate: string | null;
  reason: string;
}

/**
 * Withdraw Request
 */
export interface WithdrawRequest {
  resignationId: number;
  withdrawalReason: string;
}

/**
 * Common API Response
 */
export interface ApiResponse {
  StatusCode: number;
  Message: string;
}

/**
 * Submit Dialog Props
 */
export interface SubmitDialogProps {
  open: boolean;
  loading?: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

/**
 * Withdraw Dialog Props
 */
export interface WithdrawDialogProps {
  open: boolean;
  loading?: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

/**
 * Timeline Props
 */
export interface SeparationTimelineProps {
  request: SeparationStatusResponse;
}