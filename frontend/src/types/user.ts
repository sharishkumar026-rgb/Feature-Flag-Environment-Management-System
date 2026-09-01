
// ============================================================
// USER TYPES
// ============================================================

// ============================================================
// USER ROLE
// ============================================================

export interface UserRole {
  id?: number;
  name?: string;
  description?: string;
  is_active?: boolean;

  created_at?: string;
  updated_at?: string;
}

// ============================================================
// USER
// ============================================================

export interface User {
  id: number;

  name: string;
  email: string;

  role?: string;

  role_id?: number;

  is_active?: boolean;

  created_at?: string;
  updated_at?: string;

  role_details?: UserRole;
}

// ============================================================
// CREATE USER REQUEST
// ============================================================

export interface UserCreateRequest {
  name: string;
  email: string;
  password: string;

  role_id?: number;
}

// ============================================================
// UPDATE USER REQUEST
// ============================================================

export interface UserUpdateRequest {
  name?: string;
  email?: string;
  password?: string;

  role_id?: number;
}

// ============================================================
// USER STATUS UPDATE REQUEST
// ============================================================

export interface UserStatusUpdateRequest {
  is_active: boolean;
}

// ============================================================
// USER CREATE RESPONSE
// ============================================================

export interface UserCreateResponse {
  success?: boolean;
  message?: string;

  user?: User;

  data?: User | {
    user?: User;
  };
}

// ============================================================
// USER UPDATE RESPONSE
// ============================================================

export interface UserUpdateResponse {
  success?: boolean;
  message?: string;

  user?: User;

  data?: User | {
    user?: User;
  };
}

// ============================================================
// USER DELETE RESPONSE
// ============================================================

export interface UserDeleteResponse {
  success?: boolean;
  message?: string;

  deleted_by?: User;

  user_id?: number;

  data?: {
    user_id?: number;
    deleted_by?: User;
  };
}

// ============================================================
// USER STATUS RESPONSE
// ============================================================

export interface UserStatusResponse {
  success?: boolean;
  message?: string;

  user?: User;

  data?: User | {
    user?: User;
  };
}

// ============================================================
// GET USER BY ID RESPONSE
// ============================================================

export interface UserSingleResponse {
  success?: boolean;
  message?: string;

  user?: User;

  retrieved_by?: User;

  data?: User | {
    user?: User;
    retrieved_by?: User;
  };
}

// ============================================================
// GET USERS RESPONSE
// ============================================================

export interface UserListResponse {
  success?: boolean;
  message?: string;

  total?: number;

  users?: User[];

  retrieved_by?: User;

  data?: User[] | {
    users?: User[];
    total?: number;
    retrieved_by?: User;
  };
}

