
// ============================================================
// ANALYTICS TYPES
// ============================================================

// ============================================================
// ANALYTICS OVERVIEW
// ============================================================

export interface AnalyticsOverview {
  total_features: number;

  enabled_features: number;

  disabled_features: number;

  total_environments: number;

  total_rollouts: number;

  total_assignments: number;

  active_users: number;
}

export interface AnalyticsOverviewResponse {
  success?: boolean;

  message?: string;

  overview?: AnalyticsOverview;

  data?: AnalyticsOverview | {
    overview?: AnalyticsOverview;
  };
}

// ============================================================
// FEATURE ANALYTICS
// ============================================================

export interface FeatureAnalytics {
  id: number;

  name: string;

  key: string;

  is_enabled: boolean;

  total_assignments: number;

  enabled_assignments: number;

  disabled_assignments: number;

  total_rollouts: number;
}

export interface FeatureAnalyticsResponse {
  success?: boolean;

  message?: string;

  feature?: FeatureAnalytics;

  data?: FeatureAnalytics | {
    feature?: FeatureAnalytics;
  };
}

// ============================================================
// ROLLOUT ANALYTICS
// ============================================================

export interface RolloutAnalytics {
  id: number;

  feature_id: number;

  environment_id: number;

  percentage: number;

  enabled_users: number;

  disabled_users: number;
}

export interface RolloutAnalyticsResponse {
  success?: boolean;

  message?: string;

  rollout?: RolloutAnalytics;

  data?: RolloutAnalytics | {
    rollout?: RolloutAnalytics;
  };
}

// ============================================================
// ASSIGNMENT ANALYTICS
// ============================================================

export interface AssignmentAnalytics {
  id: number;

  user_id: number;

  feature_id: number;

  environment_id?: number;

  is_enabled: boolean;

  is_active?: boolean;

  value?: string | boolean | number | null;

  feature_name: string;

  user_name: string;

  user_email: string;

  environment_name?: string;
}

export interface AssignmentAnalyticsResponse {
  success?: boolean;

  message?: string;

  assignment?: AssignmentAnalytics;

  data?: AssignmentAnalytics | {
    assignment?: AssignmentAnalytics;
  };
}

// ============================================================
// ENVIRONMENT ANALYTICS
// ============================================================

export interface EnvironmentAnalytics {
  id: number;

  name: string;

  key?: string;

  total_features: number;

  enabled_features: number;

  disabled_features: number;

  total_rollouts: number;
}

export interface EnvironmentAnalyticsResponse {
  success?: boolean;

  message?: string;

  environment?: EnvironmentAnalytics;

  data?: EnvironmentAnalytics | {
    environment?: EnvironmentAnalytics;
  };
}

