
// ============================================================
// ASSIGNMENT TYPES
// ============================================================

// ============================================================
// USER DETAILS
// ============================================================

export interface AssignmentUser {
  id?: number;
  name?: string;
  email?: string;
  role?: string;
  role_id?: number;
}

// ============================================================
// FEATURE DETAILS
// ============================================================

export interface AssignmentFeature {
  id?: number;
  name?: string;
  key?: string;
}

// ============================================================
// ENVIRONMENT DETAILS
// ============================================================

export interface AssignmentEnvironment {
  id?: number;
  name?: string;
  key?: string;
}

// ============================================================
// ASSIGNMENT
// ============================================================

export interface Assignment {
  id: number;

  user_id?: number;

  feature_id?: number;

  environment_id?: number;

  is_enabled?: boolean;

  is_active?: boolean;

  value?: string | boolean | number | null;

  created_at?: string;

  updated_at?: string;

  created_by_id?: number;

  user?: AssignmentUser;

  feature?: AssignmentFeature;

  environment?: AssignmentEnvironment;

  created_by?: AssignmentUser;

  updated_by?: AssignmentUser;
}

// ============================================================
// CREATE ASSIGNMENT REQUEST
// ============================================================

export interface AssignmentCreateRequest {
  user_id: number;

  feature_id: number;

  environment_id: number;

  is_enabled?: boolean;

  is_active?: boolean;

  value?: string | boolean | number | null;
}

// ============================================================
// UPDATE ASSIGNMENT REQUEST
// ============================================================

export interface AssignmentUpdateRequest {
  user_id?: number;

  feature_id?: number;

  environment_id?: number;

  is_enabled?: boolean;

  is_active?: boolean;

  value?: string | boolean | number | null;
}

// ============================================================
// CREATE RESPONSE
// ============================================================

export interface AssignmentCreateResponse {
  success?: boolean;

  message?: string;

  assignment?: Assignment;

  created_by?: AssignmentUser;

  data?:
    | Assignment
    | {
        assignment?: Assignment;
        created_by?: AssignmentUser;
      };
}

// ============================================================
// UPDATE RESPONSE
// ============================================================

export interface AssignmentUpdateResponse {
  success?: boolean;

  message?: string;

  assignment?: Assignment;

  updated_by?: AssignmentUser;

  data?:
    | Assignment
    | {
        assignment?: Assignment;
        updated_by?: AssignmentUser;
      };
}

// ============================================================
// DELETE RESPONSE
// ============================================================

export interface AssignmentDeleteResponse {
  success?: boolean;

  message?: string;

  assignment_id?: number;

  deleted_by?: AssignmentUser;

  data?: {
    assignment_id?: number;
    deleted_by?: AssignmentUser;
  };
}

// ============================================================
// GET SINGLE ASSIGNMENT RESPONSE
// ============================================================

export interface AssignmentSingleResponse {
  success?: boolean;

  message?: string;

  assignment?: Assignment;

  retrieved_by?: AssignmentUser;

  data?:
    | Assignment
    | {
        assignment?: Assignment;
        retrieved_by?: AssignmentUser;
      };
}

// ============================================================
// GET ALL ASSIGNMENTS RESPONSE
// ============================================================

export interface AssignmentListResponse {
  success?: boolean;

  message?: string;

  total?: number;

  assignments?: Assignment[];

  retrieved_by?: AssignmentUser;

  data?:
    | Assignment[]
    | {
        assignments?: Assignment[];
        total?: number;
        retrieved_by?: AssignmentUser;
      };
}

