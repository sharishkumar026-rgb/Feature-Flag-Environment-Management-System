
// ============================================================
// FEATURE FLAG TYPES
// ============================================================

// ============================================================
// USER DETAILS
// ============================================================

export interface FeatureFlagUser {
  id?: number;
  name?: string;
  email?: string;
  role?: string;
  role_id?: number;
}

// ============================================================
// FEATURE FLAG
// ============================================================

export interface FeatureFlag {
  id: number;

  name: string;

  key: string;

  description?: string;

  is_enabled?: boolean;

  is_active?: boolean;

  default_value?: string | boolean | number | null;

  value?: string | boolean | number | null;

  created_by_id?: number;

  created_at?: string;

  updated_at?: string;

  created_by?: FeatureFlagUser;

  updated_by?: FeatureFlagUser;
}

// ============================================================
// CREATE FEATURE FLAG REQUEST
// ============================================================

export interface FeatureFlagCreateRequest {
  name: string;

  key: string;

  description?: string;

  is_enabled?: boolean;

  default_value?: string | boolean | number | null;
}

// ============================================================
// UPDATE FEATURE FLAG REQUEST
// ============================================================

export interface FeatureFlagUpdateRequest {
  name?: string;

  key?: string;

  description?: string;

  default_value?: string | boolean | number | null;

  is_enabled?: boolean;

  is_active?: boolean;
}

// ============================================================
// ENABLE / DISABLE RESPONSE
// ============================================================

export interface FeatureFlagToggleResponse {
  success?: boolean;

  message?: string;

  feature?: FeatureFlag;

  enabled_by?: FeatureFlagUser;

  disabled_by?: FeatureFlagUser;

  data?:
    | FeatureFlag
    | {
        feature?: FeatureFlag;

        enabled_by?: FeatureFlagUser;

        disabled_by?: FeatureFlagUser;
      };
}

// ============================================================
// CREATE RESPONSE
// ============================================================

export interface FeatureFlagCreateResponse {
  success?: boolean;

  message?: string;

  feature?: FeatureFlag;

  created_by?: FeatureFlagUser;

  data?:
    | FeatureFlag
    | {
        feature?: FeatureFlag;

        created_by?: FeatureFlagUser;
      };
}

// ============================================================
// UPDATE RESPONSE
// ============================================================

export interface FeatureFlagUpdateResponse {
  success?: boolean;

  message?: string;

  feature?: FeatureFlag;

  updated_by?: FeatureFlagUser;

  data?:
    | FeatureFlag
    | {
        feature?: FeatureFlag;

        updated_by?: FeatureFlagUser;
      };
}

// ============================================================
// DELETE RESPONSE
// ============================================================

export interface FeatureFlagDeleteResponse {
  success?: boolean;

  message?: string;

  feature_id?: number;

  deleted_by?: FeatureFlagUser;

  data?: {
    feature_id?: number;

    deleted_by?: FeatureFlagUser;
  };
}

// ============================================================
// GET SINGLE FEATURE FLAG RESPONSE
// ============================================================

export interface FeatureFlagSingleResponse {
  success?: boolean;

  message?: string;

  feature?: FeatureFlag;

  retrieved_by?: FeatureFlagUser;

  data?:
    | FeatureFlag
    | {
        feature?: FeatureFlag;

        retrieved_by?: FeatureFlagUser;
      };
}

// ============================================================
// GET FEATURE FLAGS RESPONSE
// ============================================================

export interface FeatureFlagListResponse {
  success?: boolean;

  message?: string;

  total?: number;

  features?: FeatureFlag[];

  retrieved_by?: FeatureFlagUser;

  data?:
    | FeatureFlag[]
    | {
        features?: FeatureFlag[];

        total?: number;

        retrieved_by?: FeatureFlagUser;
      };
}

// ============================================================
// FEATURE EVALUATION REQUEST
// ============================================================

export interface FeatureEvaluationRequest {
  user_id?: number;

  environment_id?: number;

  context?: Record<string, any>;
}

// ============================================================
// FEATURE EVALUATION RESULT
// ============================================================

export interface FeatureEvaluation {
  feature_id?: number;

  feature_name?: string;

  feature_key?: string;

  environment_id?: number;

  environment_name?: string;

  user_id?: number;

  user_name?: string;

  value?: string | boolean | number | null;

  is_enabled?: boolean;

  reason?: string;
}

// ============================================================
// FEATURE EVALUATION RESPONSE
// ============================================================

export interface FeatureEvaluationResponse {
  success?: boolean;

  message?: string;

  evaluated_by?: FeatureFlagUser;

  evaluation?: FeatureEvaluation;

  feature?: FeatureEvaluation;

  data?:
    | FeatureEvaluation
    | {
        evaluation?: FeatureEvaluation;

        feature?: FeatureEvaluation;

        evaluated_by?: FeatureFlagUser;
      };
}

