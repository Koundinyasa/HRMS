export interface LoginRequest {
  email: string;
  password: string;
}

export interface User {
  id: number;
  name: string;
  role: "ADMIN" | "HR" | "EMPLOYEE";
}