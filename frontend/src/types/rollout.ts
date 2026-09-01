
// ============================================================
// ROLLOUT TYPES
// ============================================================

// ============================================================
// USER DETAILS
// ============================================================

export interface RolloutUser {
  id?: number;
  name?: string;
  email?: string;
  role?: string;
  role_id?: number;
}

// ============================================================
// FEATURE DETAILS
// ============================================================

export interface RolloutFeature {
  id?: number;
  name?: string;
  key?: string;
}

// ============================================================
// ENVIRONMENT DETAILS
// ============================================================

export interface RolloutEnvironment {
  id?: number;
  name?: string;
  key?: string;
}

// ============================================================
// ROLLOUT
// ============================================================

export interface Rollout {
  id: number;

  feature_id: number;

  environment_id: number;

  percentage: number;

  is_enabled?: boolean;

  is_active?: boolean;

  start_date?: string;

  end_date?: string;

  created_at?: string;

  updated_at?: string;

  created_by_id?: number;

  feature?: RolloutFeature;

  environment?: RolloutEnvironment;

  created_by?: RolloutUser;

  updated_by?: RolloutUser;
}

// ============================================================
// CREATE ROLLOUT REQUEST
// ============================================================

export interface RolloutCreateRequest {
  feature_id: number;

  environment_id: number;

  percentage: number;

  is_enabled?: boolean;

  is_active?: boolean;

  start_date?: string;

  end_date?: string;
}

// ============================================================
// UPDATE ROLLOUT REQUEST
// ============================================================

export interface RolloutUpdateRequest {
  feature_id?: number;

  environment_id?: number;

  percentage?: number;

  is_enabled?: boolean;

  is_active?: boolean;

  start_date?: string;

  end_date?: string;
}

// ============================================================
// CREATE RESPONSE
// ============================================================

export interface RolloutCreateResponse {
  success?: boolean;

  message?: string;

  rollout?: Rollout;

  created_by?: RolloutUser;

  data?:
    | Rollout
    | {
        rollout?: Rollout;
        created_by?: RolloutUser;
      };
}

// ============================================================
// UPDATE RESPONSE
// ============================================================

export interface RolloutUpdateResponse {
  success?: boolean;

  message?: string;

  rollout?: Rollout;

  updated_by?: RolloutUser;

  data?:
    | Rollout
    | {
        rollout?: Rollout;
        updated_by?: RolloutUser;
      };
}

// ============================================================
// DELETE RESPONSE
// ============================================================

export interface RolloutDeleteResponse {
  success?: boolean;

  message?: string;

  rollout_id?: number;

  deleted_by?: RolloutUser;

  data?: {
    rollout_id?: number;
    deleted_by?: RolloutUser;
  };
}

// ============================================================
// STATUS RESPONSE
// ============================================================

export interface RolloutStatusResponse {
  success?: boolean;

  message?: string;

  rollout?: Rollout;

  updated_by?: RolloutUser;

  data?:
    | Rollout
    | {
        rollout?: Rollout;
        updated_by?: RolloutUser;
      };
}

// ============================================================
// GET SINGLE ROLLOUT RESPONSE
// ============================================================

export interface RolloutSingleResponse {
  success?: boolean;

  message?: string;

  rollout?: Rollout;

  retrieved_by?: RolloutUser;

  data?:
    | Rollout
    | {
        rollout?: Rollout;
        retrieved_by?: RolloutUser;
      };
}

// ============================================================
// GET ROLLOUTS RESPONSE
// ============================================================

export interface RolloutListResponse {
  success?: boolean;

  message?: string;

  total?: number;

  rollouts?: Rollout[];

  retrieved_by?: RolloutUser;

  data?:
    | Rollout[]
    | {
        rollouts?: Rollout[];
        total?: number;
        retrieved_by?: RolloutUser;
      };
}

