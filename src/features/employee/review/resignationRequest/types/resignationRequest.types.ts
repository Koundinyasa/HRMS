export type ResignationStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "CANCELLED";

export interface ResignationRequest {
  id: string | number;
  requestId: string;
  employeeId?: string | number;
  employeeName: string;
  stageOrder?: number;
  resignationDate: string;
  lastWorkingDate: string;
  reason: string;
  status: ResignationStatus | string;
  submittedDate?: string;
  remarks?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ResignationRequestResponse {
  data?: ResignationRequest[];
  items?: ResignationRequest[];
  results?: ResignationRequest[];
  resignationRequests?: ResignationRequest[];
  message?: string;
  success?: boolean;
}

export interface ResignationRequestListParams {
  search?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}

export interface CreateResignationRequestPayload {
  employeeId: string | number;
  resignationDate: string;
  lastWorkingDate: string;
  reason: string;
}

export interface UpdateResignationRequestPayload {
  id: string | number;
  status: ResignationStatus | string;
  remarks?: string;
}

export interface ResignationRequestFormValues {
  resignationDate: string;
  lastWorkingDate: string;
  reason: string;
}

export interface SeparationApprovalPayload {
  resignationId: number;
  stageOrder: number;
  actionStatus: number;
  remarks?: string;
  isExitInterviewCompleted?: boolean;
}

export const SEPARATION_ACTION_STATUS = {
  APPROVED: 4,
  REJECTED: 5,
} as const;