from pydantic import BaseModel


# =========================================================
# DASHBOARD SUMMARY
# =========================================================

class DashboardSummary(BaseModel):
    total_features: int
    enabled_features: int
    disabled_features: int
    total_environments: int
    total_rollouts: int
    total_assignments: int
    active_users: int


class DashboardResponse(BaseModel):
    success: bool
    message: str
    dashboard: DashboardSummary


# =========================================================
# DASHBOARD STATS
# =========================================================

class DashboardStats(BaseModel):
    total_features: int
    enabled_features: int
    disabled_features: int
    total_environments: int
    total_rollouts: int
    total_assignments: int


class DashboardStatsResponse(BaseModel):
    success: bool
    message: str
    stats: DashboardStats


# =========================================================
# FEATURE DASHBOARD
# =========================================================

class DashboardFeature(BaseModel):
    id: int
    name: str
    key: str
    is_enabled: bool


class DashboardFeatureResponse(BaseModel):
    success: bool
    message: str
    total: int
    features: list[DashboardFeature]


# =========================================================
# ENVIRONMENT DASHBOARD
# =========================================================

class DashboardEnvironment(BaseModel):
    id: int
    name: str
    is_active: bool


class DashboardEnvironmentResponse(BaseModel):
    success: bool
    message: str
    total: int
    environments: list[DashboardEnvironment]


# =========================================================
# ROLLOUT DASHBOARD
# =========================================================

class DashboardRollout(BaseModel):
    id: int
    feature_id: int
    environment_id: int
    percentage: float


class DashboardRolloutResponse(BaseModel):
    success: bool
    message: str
    total: int
    rollouts: list[DashboardRollout]


# =========================================================
# ASSIGNMENT DASHBOARD
# =========================================================

class DashboardAssignment(BaseModel):
    id: int
    user_id: int
    feature_id: int
    is_enabled: bool


class DashboardAssignmentResponse(BaseModel):
    success: bool
    message: str
    total: int
    assignments: list[DashboardAssignment]