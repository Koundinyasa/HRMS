// =========================
// Captcha
// =========================

export interface CaptchaResponse {
  captchaId: string;
  image: string;
}

// =========================
// Login
// =========================

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

// =========================
// Logout
// =========================

export interface LogoutResponse {
  success: boolean;
  message: string;
}

// =========================
// Auth State
// =========================

export interface AuthState {
  accessToken: string | null;
  employeeId: string | null;
  userId: string | null;
  isFirstLogin: boolean;
  isAuthenticated: boolean;
}

// =========================
// User
// =========================

export interface User {
  id: number;
  name: string;
  role: "admin" | "hr" | "employee";
}

// =========================
// Forgot Password
// =========================

export interface ForgotPasswordRequest {
  email: string;
  mobile: string;
}

export interface ForgotPasswordResponse {
  success: boolean;
  message: string;
}

// =========================
// First Login Reset Password
// =========================

export interface FirstLoginResetPasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// =========================
// Change Password
// =========================

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ChangePasswordResponse {
  success: boolean;
  message: string;
}