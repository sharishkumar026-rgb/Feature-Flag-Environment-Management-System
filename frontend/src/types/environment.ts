
// ============================================================
// ENVIRONMENT TYPES
// ============================================================

// ============================================================
// USER DETAILS
// ============================================================

export interface EnvironmentUser {
  id?: number;
  name?: string;
  email?: string;
  role?: string;
  role_id?: number;
}

// ============================================================
// ENVIRONMENT
// ============================================================

export interface Environment {
  id: number;

  name: string;

  key: string;

  description?: string;

  is_active?: boolean;

  created_by_id?: number;

  created_at?: string;

  updated_at?: string;

  created_by?: EnvironmentUser;

  updated_by?: EnvironmentUser;
}

// ============================================================
// CREATE ENVIRONMENT REQUEST
// ============================================================

export interface EnvironmentCreateRequest {
  name: string;

  key: string;

  description?: string;
}

// ============================================================
// UPDATE ENVIRONMENT REQUEST
// ============================================================

export interface EnvironmentUpdateRequest {
  name?: string;

  key?: string;

  description?: string;

  is_active?: boolean;
}

// ============================================================
// CREATE RESPONSE
// ============================================================

export interface EnvironmentCreateResponse {
  success?: boolean;

  message?: string;

  environment?: Environment;

  created_by?: EnvironmentUser;

  data?:
    | Environment
    | {
        environment?: Environment;
        created_by?: EnvironmentUser;
      };
}

// ============================================================
// UPDATE RESPONSE
// ============================================================

export interface EnvironmentUpdateResponse {
  success?: boolean;

  message?: string;

  environment?: Environment;

  updated_by?: EnvironmentUser;

  data?:
    | Environment
    | {
        environment?: Environment;
        updated_by?: EnvironmentUser;
      };
}

// ============================================================
// DELETE RESPONSE
// ============================================================

export interface EnvironmentDeleteResponse {
  success?: boolean;

  message?: string;

  environment_id?: number;

  deleted_by?: EnvironmentUser;

  data?: {
    environment_id?: number;
    deleted_by?: EnvironmentUser;
  };
}

// ============================================================
// STATUS RESPONSE
// ============================================================

export interface EnvironmentStatusResponse {
  success?: boolean;

  message?: string;

  environment?: Environment;

  updated_by?: EnvironmentUser;

  data?:
    | Environment
    | {
        environment?: Environment;
        updated_by?: EnvironmentUser;
      };
}

// ============================================================
// GET SINGLE ENVIRONMENT RESPONSE
// ============================================================

export interface EnvironmentSingleResponse {
  success?: boolean;

  message?: string;

  environment?: Environment;

  retrieved_by?: EnvironmentUser;

  data?:
    | Environment
    | {
        environment?: Environment;
        retrieved_by?: EnvironmentUser;
      };
}

// ============================================================
// GET ENVIRONMENTS RESPONSE
// ============================================================

export interface EnvironmentListResponse {
  success?: boolean;

  message?: string;

  total?: number;

  environments?: Environment[];

  retrieved_by?: EnvironmentUser;

  data?:
    | Environment[]
    | {
        environments?: Environment[];
        total?: number;
        retrieved_by?: EnvironmentUser;
      };
}

