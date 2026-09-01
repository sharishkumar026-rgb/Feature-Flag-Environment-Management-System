from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.user import User

from app.schemas.analytics import (
    AnalyticsOverviewResponse,
    FeatureAnalyticsResponse,
    RolloutAnalyticsResponse,
    AssignmentAnalyticsResponse,
    EnvironmentAnalyticsResponse,
)

from app.services.analytics_service import AnalyticsService

from app.core.permissions import require_admin


router = APIRouter(
    prefix="/api/analytics",
    tags=["Analytics"],
)


# =========================================================
# GET ANALYTICS OVERVIEW
# Admin
# =========================================================

@router.get(
    "/overview",
    response_model=AnalyticsOverviewResponse,
    status_code=status.HTTP_200_OK,
    summary="Get Analytics Overview",
)
def get_analytics_overview(
    admin_user: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    overview = AnalyticsService.get_overview(db)

    return {
        "success": True,
        "message": "Analytics overview retrieved successfully",
        "overview": overview,
    }


# =========================================================
# GET FEATURE ANALYTICS
# Admin
# =========================================================

@router.get(
    "/features/{feature_id}",
    response_model=FeatureAnalyticsResponse,
    status_code=status.HTTP_200_OK,
    summary="Get Feature Analytics",
)
def get_feature_analytics(
    feature_id: int,
    admin_user: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    feature = AnalyticsService.get_feature_analytics(
        db=db,
        feature_id=feature_id,
    )

    return {
        "success": True,
        "message": "Feature analytics retrieved successfully",
        "feature": feature,
    }


# =========================================================
# GET ROLLOUT ANALYTICS
# Admin
# =========================================================

@router.get(
    "/rollouts/{rollout_id}",
    response_model=RolloutAnalyticsResponse,
    status_code=status.HTTP_200_OK,
    summary="Get Rollout Analytics",
)
def get_rollout_analytics(
    rollout_id: int,
    admin_user: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    rollout = AnalyticsService.get_rollout_analytics(
        db=db,
        rollout_id=rollout_id,
    )

    return {
        "success": True,
        "message": "Rollout analytics retrieved successfully",
        "rollout": rollout,
    }


# =========================================================
# GET ASSIGNMENT ANALYTICS
# Admin
# =========================================================

@router.get(
    "/assignments/{assignment_id}",
    response_model=AssignmentAnalyticsResponse,
    status_code=status.HTTP_200_OK,
    summary="Get Assignment Analytics",
)
def get_assignment_analytics(
    assignment_id: int,
    admin_user: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    assignment = AnalyticsService.get_assignment_analytics(
        db=db,
        assignment_id=assignment_id,
    )

    return {
        "success": True,
        "message": "Assignment analytics retrieved successfully",
        "assignment": assignment,
    }


# =========================================================
# GET ENVIRONMENT ANALYTICS
# Admin
# =========================================================

@router.get(
    "/environments/{environment_id}",
    response_model=EnvironmentAnalyticsResponse,
    status_code=status.HTTP_200_OK,
    summary="Get Environment Analytics",
)
def get_environment_analytics(
    environment_id: int,
    admin_user: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    environment = AnalyticsService.get_environment_analytics(
        db=db,
        environment_id=environment_id,
    )

    return {
        "success": True,
        "message": "Environment analytics retrieved successfully",
        "environment": environment,
    }