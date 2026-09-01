import api from "./axios";

// ============================================================
// TYPES
// ============================================================

export interface Dashboard {
  total_users?: number;
  total_roles?: number;
  total_features?: number;
  total_environments?: number;
  total_rollouts?: number;
  total_assignments?: number;
  total_audit_logs?: number;
}

export interface DashboardStats {
  total_users?: number;
  active_users?: number;
  total_features?: number;
  active_features?: number;
  total_environments?: number;
  active_environments?: number;
  total_rollouts?: number;
  active_rollouts?: number;
  total_assignments?: number;
}

export interface DashboardFeature {
  id: number;
  name?: string;
  key?: string;
  is_enabled?: boolean;
  is_active?: boolean;
  rollout_percentage?: number;
}

export interface DashboardEnvironment {
  id: number;
  name?: string;
  key?: string;
  is_active?: boolean;
  total_features?: number;
  total_rollouts?: number;
}

export interface DashboardRollout {
  id: number;
  feature_id?: number;
  environment_id?: number;
  percentage?: number;
  is_active?: boolean;
}

export interface DashboardAssignment {
  id: number;
  user_id?: number;
  feature_id?: number;
  environment_id?: number;
  is_enabled?: boolean;
}

// ============================================================
// GET DASHBOARD
// GET /api/dashboard
// ============================================================

export const getDashboard = async () => {
  const response = await api.get("/dashboard");

  return response.data;
};

// ============================================================
// GET DASHBOARD STATS
// GET /api/dashboard/stats
// ============================================================

export const getDashboardStats = async () => {
  const response = await api.get(
    "/dashboard/stats"
  );

  return response.data;
};

// ============================================================
// GET DASHBOARD FEATURES
// GET /api/dashboard/features
// ============================================================

export const getDashboardFeatures = async () => {
  const response = await api.get(
    "/dashboard/features"
  );

  return response.data;
};

// ============================================================
// GET DASHBOARD ENVIRONMENTS
// GET /api/dashboard/environments
// ============================================================

export const getDashboardEnvironments = async () => {
  const response = await api.get(
    "/dashboard/environments"
  );

  return response.data;
};

// ============================================================
// GET DASHBOARD ROLLOUTS
// GET /api/dashboard/rollouts
// ============================================================

export const getDashboardRollouts = async () => {
  const response = await api.get(
    "/dashboard/rollouts"
  );

  return response.data;
};

// ============================================================
// GET DASHBOARD ASSIGNMENTS
// GET /api/dashboard/assignments
// ============================================================

export const getDashboardAssignments = async () => {
  const response = await api.get(
    "/dashboard/assignments"
  );

  return response.data;
};