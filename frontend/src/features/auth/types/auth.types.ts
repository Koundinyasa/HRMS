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
  /** The server must change the password before anything else. */
  mustChangePassword?: boolean;

  data: {
    employeeId: string;
    userId: string;
    roleId?: number | string | null;
  };
}

// What GET /auth/me returns inside `data`.
export interface SessionUser {
  employeeId: string;
  userId: string;
  roleId: number | string | null;
  companyId?: number | string | null;
  name?: string | null;
  role?: string | null;
  mustChangePassword: boolean;
}

export interface SessionResponse {
  success: boolean;
  data: SessionUser;
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
  employeeId: string | null;
  userId: string | null;
  mustChangePassword: boolean;
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
  userId: string;
}

export interface ForgotPasswordResponse {
  success: boolean;
  message: string;
  remainingSeconds: number;
  remainingMinutes: number;
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