export interface LoginRequest {
  email: string;
  password: string;
}

export interface User {
  id: number;
  name: string;
  role: "ADMIN" | "HR" | "EMPLOYEE";
}

export interface ForgotPasswordRequest {
  email: string;
  mobile: string;
}

export interface ForgotPasswordResponse {
  success: boolean;
  message: string;
}