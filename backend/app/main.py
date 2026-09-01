from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.auth import router as auth_router
from app.api.users import router as users_router
from app.api.roles import router as roles_router
from app.api.features_flag import router as features_router
from app.api.environments import router as environments_router
from app.api.feature_rollouts import router as rollouts_router
from app.api.user_assignment import router as assignments_router
from app.api.audit_logs import router as audit_logs_router
from app.api.analytics import router as analytics_router
from app.api.dashboard import router as dashboard_router

from app.core.config import settings


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description=(
        "Centralized Feature Flag & Environment Management System "
        "with Admin/User authentication, feature toggles, "
        "environment management, rollouts, user targeting, "
        "audit logs, and analytics."
    ),
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
)


# =========================================================
# CORS
# =========================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================================================
# AUTH API
# =========================================================

app.include_router(
    auth_router,
    prefix=settings.API_PREFIX,
)


# =========================================================
# USERS API
# =========================================================

app.include_router(
    users_router,
    prefix=settings.API_PREFIX,
)


# =========================================================
# ROLES API
# =========================================================

app.include_router(
    roles_router,
    prefix=settings.API_PREFIX,
)


# =========================================================
# FEATURES API
# =========================================================

app.include_router(
    features_router,
    prefix=settings.API_PREFIX,
)


# =========================================================
# ENVIRONMENTS API
# =========================================================

app.include_router(
    environments_router,
    prefix=settings.API_PREFIX,
)


# =========================================================
# ROLLOUTS API
# =========================================================

app.include_router(
    rollouts_router,
    prefix=settings.API_PREFIX,
)


# =========================================================
# ASSIGNMENTS API
# =========================================================

app.include_router(
    assignments_router,
    prefix=settings.API_PREFIX,
)

# =========================================================
# AUDIT LOGS API
# =========================================================

app.include_router(
    audit_logs_router,
)

# =========================================================
# ANALYTICS API
# =========================================================

app.include_router(
    analytics_router,
)

# =========================================================
# DASHBOARD API
# =========================================================

app.include_router(
    dashboard_router,
)


# =========================================================
# ROOT
# =========================================================

@app.get(
    "/",
    tags=["System"],
)
def root():
    return {
        "success": True,
        "message": (
            "Feature Flag & Environment Management "
            "System API is running"
        ),
        "version": settings.APP_VERSION,
    }


# =========================================================
# HEALTH
# =========================================================

@app.get(
    "/health",
    tags=["System"],
)
def health_check():
    return {
        "success": True,
        "message": "API is healthy",
    }