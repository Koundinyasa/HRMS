export interface SeparationEmployee {
  id: string;
  employeeCode: string;
  employeeName: string;
  designation?: string;
  department?: string;
  dateOfJoining?: string;
  separationDate?: string;
  separationType?: string;
  status?: string;
}

export interface SeparationFormData {
  employeeId: string;
  separationDate: string;
  separationType: string;
  reason: string;
  remarks?: string;
}

export interface SeparationFilters {
  search: string;
  status: string;
  separationType: string;
}

export interface SeparationResponse {
  data: SeparationEmployee[];
  total?: number;
  page?: number;
  limit?: number;
}

export interface SeparationApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface FinalSettlement {
  id: string;
  employeeId: string;
  employeeName: string;
  basicSalary: number;
  leaveEncashment: number;
  gratuity: number;
  deductions: number;
  netSettlement: number;
  status: string;
}

export interface GratuityDetails {
  employeeId: string;
  employeeName: string;
  dateOfJoining: string;
  separationDate: string;
  yearsOfService: number;
  lastDrawnSalary: number;
  gratuityAmount: number;
}