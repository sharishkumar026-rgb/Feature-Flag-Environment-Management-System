import api from "./axios";

// ============================================================
// TYPES
// ============================================================

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success?: boolean;
  message?: string;
  access_token: string;
  token_type: string;

  user?: {
    id?: number;
    name?: string;
    email?: string;
    role_id?: number;
    role?: {
      id?: number;
      name?: string;
      description?: string;
      is_active?: boolean;
    } | string;
    is_active?: boolean;
    created_at?: string;
    updated_at?: string;
  };
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role_id?: number;
  is_active?: boolean;
}

export interface RegisterResponse {
  success?: boolean;
  message?: string;

  user?: {
    id?: number;
    name?: string;
    email?: string;
    role_id?: number;
    role?: {
      id?: number;
      name?: string;
      description?: string;
      is_active?: boolean;
    };
    is_active?: boolean;
    created_at?: string;
    updated_at?: string;
  };
}

// ============================================================
// LOGIN
// POST /api/auth/login
//
// IMPORTANT:
// Backend uses OAuth2PasswordRequestForm:
//
// username
// password
//
// Therefore we convert email -> username here.
// ============================================================

export const login = async (
  data: LoginRequest
): Promise<LoginResponse> => {
  const formData = new URLSearchParams();

  formData.append("username", data.email.trim());
  formData.append("password", data.password);

  const response = await api.post<LoginResponse>(
    "/auth/login",
    formData,
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  return response.data;
};

// ============================================================
// REGISTER
// POST /api/auth/register
// ============================================================

export const register = async (
  data: RegisterRequest
): Promise<RegisterResponse> => {
  const response = await api.post<RegisterResponse>(
    "/auth/register",
    {
      name: data.name.trim(),
      email: data.email.trim(),
      password: data.password,
      role_id: data.role_id,
      is_active: data.is_active ?? true,
    }
  );

  return response.data;
};

// ============================================================
// LOGOUT
// POST /api/auth/logout
// ============================================================

export const logout = async () => {
  const response = await api.post(
    "/auth/logout"
  );

  return response.data;
};

// ============================================================
// CURRENT USER
// GET /api/auth/me
// ============================================================

export const getCurrentUser = async () => {
  const response = await api.get(
    "/auth/me"
  );

  return response.data;
};