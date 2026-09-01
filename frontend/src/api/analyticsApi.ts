import api from "./axios";

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
  success: boolean;
  message: string;
  overview: AnalyticsOverview;
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
  success: boolean;
  message: string;
  feature: FeatureAnalytics;
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
  success: boolean;
  message: string;
  rollout: RolloutAnalytics;
}

// ============================================================
// ASSIGNMENT ANALYTICS
// ============================================================

export interface AssignmentAnalytics {
  id: number;
  user_id: number;
  feature_id: number;

  is_enabled: boolean;

  feature_name: string;
  user_name: string;
  user_email: string;
}

export interface AssignmentAnalyticsResponse {
  success: boolean;
  message: string;
  assignment: AssignmentAnalytics;
}

// ============================================================
// ENVIRONMENT ANALYTICS
// ============================================================

export interface EnvironmentAnalytics {
  id: number;
  name: string;

  total_features: number;
  enabled_features: number;
  disabled_features: number;

  total_rollouts: number;
}

export interface EnvironmentAnalyticsResponse {
  success: boolean;
  message: string;
  environment: EnvironmentAnalytics;
}

// ============================================================
// GET ANALYTICS OVERVIEW
// GET /api/analytics/overview
// ============================================================

export const getAnalyticsOverview = async (): Promise<
  AnalyticsOverviewResponse
> => {
  const response = await api.get(
    "/analytics/overview"
  );

  return response.data;
};

// ============================================================
// GET FEATURE ANALYTICS
// GET /api/analytics/features/{feature_id}
// ============================================================

export const getFeatureAnalytics = async (
  featureId: number
): Promise<FeatureAnalyticsResponse> => {
  const response = await api.get(
    `/analytics/features/${featureId}`
  );

  return response.data;
};

// ============================================================
// GET ROLLOUT ANALYTICS
// GET /api/analytics/rollouts/{rollout_id}
// ============================================================

export const getRolloutAnalytics = async (
  rolloutId: number
): Promise<RolloutAnalyticsResponse> => {
  const response = await api.get(
    `/analytics/rollouts/${rolloutId}`
  );

  return response.data;
};

// ============================================================
// GET ASSIGNMENT ANALYTICS
// GET /api/analytics/assignments/{assignment_id}
// ============================================================

export const getAssignmentAnalytics = async (
  assignmentId: number
): Promise<AssignmentAnalyticsResponse> => {
  const response = await api.get(
    `/analytics/assignments/${assignmentId}`
  );

  return response.data;
};

// ============================================================
// GET ENVIRONMENT ANALYTICS
// GET /api/analytics/environments/{environment_id}
// ============================================================

export const getEnvironmentAnalytics = async (
  environmentId: number
): Promise<EnvironmentAnalyticsResponse> => {
  const response = await api.get(
    `/analytics/environments/${environmentId}`
  );

  return response.data;
};