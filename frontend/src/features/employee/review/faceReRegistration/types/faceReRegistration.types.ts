export type FaceReRegistrationStatusFilter =
  | "Pending"
  | "Approved"
  | "Rejected"
  | "Used"
  | "Expired"
  | "All";

export interface FaceReRegistrationRequest {
  id: number;
  employeeId: string;
  employeeCode: string | null;
  employeeName: string;
  reason: string | null;
  status: string;
  requestedAt: string;
  decidedAt: string | null;
  expiresAt: string | null;
  rejectionReason: string | null;
  currentRegistrationDate: string | null;
}

export interface FaceReRegistrationActionResponse {
  success: boolean;
  message: string;
}
