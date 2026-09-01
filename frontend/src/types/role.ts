
// ============================================================
// ROLE TYPES
// ============================================================

// ============================================================
// ROLE
// ============================================================

export interface Role {
  id: number;

  name: string;

  description?: string;

  is_active?: boolean;

  created_at?: string;
  updated_at?: string;
}

// ============================================================
// CREATE ROLE REQUEST
// ============================================================

export interface RoleCreateRequest {
  name: string;

  description?: string;
}

// ============================================================
// UPDATE ROLE REQUEST
// ============================================================

export interface RoleUpdateRequest {
  name?: string;

  description?: string;
}

// ============================================================
// ROLE STATUS UPDATE REQUEST
// ============================================================

export interface RoleStatusUpdateRequest {
  is_active: boolean;
}

// ============================================================
// ROLE CREATE RESPONSE
// ============================================================

export interface RoleCreateResponse {
  success?: boolean;

  message?: string;

  role?: Role;

  created_by?: RoleUser;

  data?:
    | Role
    | {
        role?: Role;
        created_by?: RoleUser;
      };
}

// ============================================================
// ROLE UPDATE RESPONSE
// ============================================================

export interface RoleUpdateResponse {
  success?: boolean;

  message?: string;

  role?: Role;

  updated_by?: RoleUser;

  data?:
    | Role
    | {
        role?: Role;
        updated_by?: RoleUser;
      };
}

// ============================================================
// ROLE DELETE RESPONSE
// ============================================================

export interface RoleDeleteResponse {
  success?: boolean;

  message?: string;

  role_id?: number;

  deleted_by?: RoleUser;

  data?: {
    role_id?: number;
    deleted_by?: RoleUser;
  };
}

// ============================================================
// ROLE STATUS RESPONSE
// ============================================================

export interface RoleStatusResponse {
  success?: boolean;

  message?: string;

  role?: Role;

  updated_by?: RoleUser;

  data?:
    | Role
    | {
        role?: Role;
        updated_by?: RoleUser;
      };
}

// ============================================================
// ROLE SINGLE RESPONSE
// ============================================================

export interface RoleSingleResponse {
  success?: boolean;

  message?: string;

  role?: Role;

  retrieved_by?: RoleUser;

  data?:
    | Role
    | {
        role?: Role;
        retrieved_by?: RoleUser;
      };
}

// ============================================================
// ROLE LIST RESPONSE
// ============================================================

export interface RoleListResponse {
  success?: boolean;

  message?: string;

  total?: number;

  roles?: Role[];

  retrieved_by?: RoleUser;

  data?:
    | Role[]
    | {
        roles?: Role[];
        total?: number;
        retrieved_by?: RoleUser;
      };
}

// ============================================================
// USER DETAILS
// ============================================================

export interface RoleUser {
  id?: number;

  name?: string;

  email?: string;

  role?: string;

  role_id?: number;
}

