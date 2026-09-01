from pydantic import BaseModel


# =========================================================
# ANALYTICS OVERVIEW
# =========================================================

class AnalyticsOverview(BaseModel):
    total_features: int
    enabled_features: int
    disabled_features: int

    total_environments: int
    total_rollouts: int
    total_assignments: int
    active_users: int


class AnalyticsOverviewResponse(BaseModel):
    success: bool
    message: str
    overview: AnalyticsOverview


# =========================================================
# FEATURE ANALYTICS
# =========================================================

class FeatureAnalytics(BaseModel):
    id: int
    name: str
    key: str
    is_enabled: bool

    total_assignments: int
    enabled_assignments: int
    disabled_assignments: int

    total_rollouts: int


class FeatureAnalyticsResponse(BaseModel):
    success: bool
    message: str
    feature: FeatureAnalytics


# =========================================================
# ROLLOUT ANALYTICS
# =========================================================

class RolloutAnalytics(BaseModel):
    id: int
    feature_id: int
    environment_id: int

    percentage: float

    enabled_users: int
    disabled_users: int


class RolloutAnalyticsResponse(BaseModel):
    success: bool
    message: str
    rollout: RolloutAnalytics


# =========================================================
# ASSIGNMENT ANALYTICS
# =========================================================

class AssignmentAnalytics(BaseModel):
    id: int
    user_id: int
    feature_id: int

    is_enabled: bool

    feature_name: str
    user_name: str
    user_email: str


class AssignmentAnalyticsResponse(BaseModel):
    success: bool
    message: str
    assignment: AssignmentAnalytics


# =========================================================
# ENVIRONMENT ANALYTICS
# =========================================================

class EnvironmentAnalytics(BaseModel):
    id: int
    name: str

    total_features: int
    enabled_features: int
    disabled_features: int

    total_rollouts: int


class EnvironmentAnalyticsResponse(BaseModel):
    success: bool
    message: str
    environment: EnvironmentAnalytics