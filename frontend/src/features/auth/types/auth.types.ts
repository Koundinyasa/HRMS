export interface CaptchaResponse {
  captchaId: string;  
  image: string;        
}

export interface LoginRequest {
  userId: string;        
  password: string;
  captchaId: string;     
  captchaAnswer: string; 
}

export interface LoginResponse {
  success: boolean;
  message: string;
  accessToken: string;   
  isFirstLogin: boolean; 
  data: {                
    employeeId: string;
    userId: string;
  };
}


export interface AuthState {
  accessToken: string | null;
  employeeId: string | null;
  userId: string | null;
  isFirstLogin: boolean;
  isAuthenticated: boolean;
  
}

export interface LogoutResponse {
  success: boolean;
  message: string;
}


export interface User {
  id: number;
  name: string;
  role: "admin" | "hr" | "employee";
}