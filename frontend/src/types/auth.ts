
// ============================================================
// AUTH TYPES
// ============================================================

// ============================================================
// USER
// ============================================================

export interface AuthUser {
  id: number;

  name?: string;
  email: string;

  role?: string;

  is_active?: boolean;

  created_at?: string;
  updated_at?: string;
}

// ============================================================
// LOGIN REQUEST
// ============================================================

export interface LoginRequest {
  email: string;
  password: string;
}

// ============================================================
// LOGIN RESPONSE
// ============================================================

export interface LoginResponse {
  success?: boolean;
  message?: string;

  access_token?: string;
  refresh_token?: string;

  token_type?: string;

  user?: AuthUser;

  data?: {
    access_token?: string;
    refresh_token?: string;
    token_type?: string;
    user?: AuthUser;
  };
}

// ============================================================
// REGISTER REQUEST
// ============================================================

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;

  role_id?: number;
}

// ============================================================
// REGISTER RESPONSE
// ============================================================

export interface RegisterResponse {
  success?: boolean;
  message?: string;

  user?: AuthUser;

  data?: {
    user?: AuthUser;
  };
}

// ============================================================
// LOGOUT RESPONSE
// ============================================================

export interface LogoutResponse {
  success?: boolean;
  message?: string;
}

// ============================================================
// CURRENT USER RESPONSE
// ============================================================

export interface UserMeResponse {
  success?: boolean;
  message?: string;

  user?: AuthUser;

  data?:
    | AuthUser
    | {
        user?: AuthUser;
      };
}

// ============================================================
// AUTH STATE
// ============================================================

export interface AuthState {
  user: AuthUser | null;

  loading: boolean;

  isAuthenticated: boolean;
}

// ============================================================
// AUTH CONTEXT
// ============================================================

export interface AuthContextType {
  user: AuthUser | null;

  loading: boolean;

  isAuthenticated: boolean;

  setUser: (
    user: AuthUser | null
  ) => void;

  login: (
    user: AuthUser
  ) => void;

  logout: () => Promise<void>;

  refreshUser: () => Promise<void>;
}

