export interface CaptchaResponse {
  captchaId: string;   
  svg: string;         
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



export interface User {
  id: number;
  name: string;
<<<<<<< HEAD
  role: "admin" | "hr" | "employee";
=======
  role: "ADMIN" | "HR" | "EMPLOYEE";
}

export interface ForgotPasswordRequest {
  email: string;
  mobile: string;
}

export interface ForgotPasswordResponse {
  success: boolean;
  message: string;
>>>>>>> 94e4f21d9417bafe72cde53b4b961013fa321668
}