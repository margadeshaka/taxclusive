export interface User {
  id: string;
  email: string;
  name?: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
  isActive: boolean;
  permissions?: string[];
}

export interface UserRole {
  id: string;
  name: string;
  permissions: string[];
}

export interface Session {
  user: User;
  accessToken: string;
  refreshToken?: string;
  expiresAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface SignupData {
  email: string;
  password: string;
  name?: string;
  confirmPassword?: string;
}

export interface AuthResponse {
  success: boolean;
  session?: Session;
  error?: string;
  message?: string;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirm {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
}