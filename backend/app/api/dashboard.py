from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.user import User

from app.schemas.dashboard import (
    DashboardResponse,
    DashboardStatsResponse,
    DashboardFeatureResponse,
    DashboardEnvironmentResponse,
    DashboardRolloutResponse,
    DashboardAssignmentResponse,
)

from app.services.dashboard_service import DashboardService

from app.core.permissions import get_current_user


router = APIRouter(
    prefix="/api/dashboard",
    tags=["Dashboard"],
)


# =========================================================
# GET DASHBOARD
# Admin / User
# =========================================================

@router.get(
    "",
    response_model=DashboardResponse,
    status_code=status.HTTP_200_OK,
    summary="Get Dashboard",
)
def get_dashboard(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):

    dashboard = DashboardService.get_dashboard(db)

    return {
        "success": True,
        "message": "Dashboard retrieved successfully",
        "dashboard": dashboard,
    }


# =========================================================
# GET DASHBOARD STATS
# Admin / User
# =========================================================

@router.get(
    "/stats",
    response_model=DashboardStatsResponse,
    status_code=status.HTTP_200_OK,
    summary="Get Dashboard Statistics",
)
def get_dashboard_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):

    stats = DashboardService.get_stats(db)

    return {
        "success": True,
        "message": "Dashboard statistics retrieved successfully",
        "stats": stats,
    }


# =========================================================
# GET FEATURE DASHBOARD
# Admin / User
# =========================================================

@router.get(
    "/features",
    response_model=DashboardFeatureResponse,
    status_code=status.HTTP_200_OK,
    summary="Get Feature Dashboard",
)
def get_dashboard_features(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):

    features = DashboardService.get_features(db)

    return {
        "success": True,
        "message": "Feature dashboard retrieved successfully",
        "total": len(features),
        "features": features,
    }


# =========================================================
# GET ENVIRONMENT DASHBOARD
# Admin / User
# =========================================================

@router.get(
    "/environments",
    response_model=DashboardEnvironmentResponse,
    status_code=status.HTTP_200_OK,
    summary="Get Environment Dashboard",
)
def get_dashboard_environments(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):

    environments = DashboardService.get_environments(db)

    return {
        "success": True,
        "message": "Environment dashboard retrieved successfully",
        "total": len(environments),
        "environments": environments,
    }


# =========================================================
# GET ROLLOUT DASHBOARD
# Admin / User
# =========================================================

@router.get(
    "/rollouts",
    response_model=DashboardRolloutResponse,
    status_code=status.HTTP_200_OK,
    summary="Get Rollout Dashboard",
)
def get_dashboard_rollouts(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):

    rollouts = DashboardService.get_rollouts(db)

    return {
        "success": True,
        "message": "Rollout dashboard retrieved successfully",
        "total": len(rollouts),
        "rollouts": rollouts,
    }


# =========================================================
# GET ASSIGNMENT DASHBOARD
# Admin / User
# =========================================================

@router.get(
    "/assignments",
    response_model=DashboardAssignmentResponse,
    status_code=status.HTTP_200_OK,
    summary="Get Assignment Dashboard",
)
def get_dashboard_assignments(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):

    assignments = DashboardService.get_assignments(db)

    return {
        "success": True,
        "message": "Assignment dashboard retrieved successfully",
        "total": len(assignments),
        "assignments": assignments,
    }