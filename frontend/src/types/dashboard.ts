
// ============================================================
// DASHBOARD TYPES
// ============================================================

// ============================================================
// DASHBOARD STATISTICS
// ============================================================

export interface DashboardStats {
  total_features: number;

  enabled_features: number;

  disabled_features: number;

  total_environments: number;

  total_rollouts: number;

  total_assignments: number;

  active_users: number;
}

// ============================================================
// FEATURE STATISTICS
// ============================================================

export interface FeatureStats {
  total: number;

  enabled: number;

  disabled: number;
}

// ============================================================
// ENVIRONMENT STATISTICS
// ============================================================

export interface EnvironmentStats {
  total: number;

  active?: number;

  inactive?: number;
}

// ============================================================
// ROLLOUT STATISTICS
// ============================================================

export interface RolloutStats {
  total: number;

  active?: number;

  inactive?: number;
}

// ============================================================
// ASSIGNMENT STATISTICS
// ============================================================

export interface AssignmentStats {
  total: number;

  enabled: number;

  disabled: number;

  active?: number;

  inactive?: number;
}

// ============================================================
// USER STATISTICS
// ============================================================

export interface UserStats {
  total?: number;

  active: number;

  inactive?: number;
}

// ============================================================
// DASHBOARD RESPONSE
// ============================================================

export interface DashboardResponse {
  success?: boolean;

  message?: string;

  stats?: DashboardStats;

  dashboard?: DashboardStats;

  data?:
    | DashboardStats
    | {
        stats?: DashboardStats;
        dashboard?: DashboardStats;
      };
}

// ============================================================
// DASHBOARD SUMMARY RESPONSE
// ============================================================

export interface DashboardSummaryResponse {
  success?: boolean;

  message?: string;

  total_features?: number;

  enabled_features?: number;

  disabled_features?: number;

  total_environments?: number;

  total_rollouts?: number;

  total_assignments?: number;

  active_users?: number;

  data?: DashboardStats;
}

