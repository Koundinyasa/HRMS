export type HelpdeskRequestStatus =
  | "PENDING"
  | "OPEN"
  | "IN_PROGRESS"
  | "RESOLVED"
  | "CLOSED"
  | "REJECTED";

export type HelpdeskRequestPriority =
  | "LOW"
  | "MEDIUM"
  | "HIGH"
  | "CRITICAL";

export interface HelpdeskRequest {
  id: string | number;
  requestId: string;

  employeeId?: string | number;
  employeeName: string;

  category?: string;
  subCategory?: string;

  subject: string;
  description: string;

  priority?: HelpdeskRequestPriority | string;
  status: HelpdeskRequestStatus | string;

  assignedTo?: string;
  assignedToId?: string | number;

  createdDate?: string;
  updatedDate?: string;
  resolvedDate?: string;

  remarks?: string;
}

export interface HelpdeskRequestsResponse {
  data?: HelpdeskRequest[];
  items?: HelpdeskRequest[];
  results?: HelpdeskRequest[];
  requests?: HelpdeskRequest[];
  helpdeskRequests?: HelpdeskRequest[];

  message?: string;
  success?: boolean;
}

export interface HelpdeskRequestsParams {
  search?: string;
  status?: string;
  priority?: string;
  category?: string;
  page?: number;
  pageSize?: number;
}

export interface CreateHelpdeskRequestPayload {
  employeeId: string | number;
  category: string;
  subCategory?: string;
  subject: string;
  description: string;
  priority?: string;
}

export interface UpdateHelpdeskRequestPayload {
  id: string | number;
  status?: string;
  priority?: string;
  assignedTo?: string | number;
  remarks?: string;
}

export interface HelpdeskRequestFormValues {
  category: string;
  subCategory: string;
  subject: string;
  description: string;
  priority: string;
}