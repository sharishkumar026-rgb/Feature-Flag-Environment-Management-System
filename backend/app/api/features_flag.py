from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.dependencies import (
    get_current_user,
    require_admin,
)

from app.database.database import get_db
from app.models.user import User

from app.schemas.feature_flag import (
    FeatureCreate,
    FeatureCreateResponse,
    FeatureDeleteResponse,
    FeatureDisableResponse,
    FeatureEnableResponse,
    FeatureEvaluateResponse,
    FeatureListResponse,
    FeatureSingleResponse,
    FeatureUpdate,
    FeatureUpdateResponse,
)

from app.services.feature_flag_service import FeatureFlagService


router = APIRouter(
    prefix="/feature-flags",
    tags=["Feature Flags"],
)


# ============================================================
# GET ALL FEATURES
# ADMIN + USER
# ============================================================

@router.get(
    "",
    response_model=FeatureListResponse,
    status_code=status.HTTP_200_OK,
    summary="Get all feature flags",
)
def get_features(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    return FeatureFlagService.get_features(
        db=db,
        current_user=current_user,
    )


# ============================================================
# GET FEATURE BY ID
# ADMIN + USER
# ============================================================

@router.get(
    "/{feature_id}",
    response_model=FeatureSingleResponse,
    status_code=status.HTTP_200_OK,
    summary="Get feature flag by ID",
)
def get_feature(
    feature_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    return FeatureFlagService.get_feature(
        db=db,
        feature_id=feature_id,
        current_user=current_user,
    )


# ============================================================
# CREATE FEATURE
# ADMIN ONLY
# ============================================================

@router.post(
    "",
    response_model=FeatureCreateResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create feature flag",
)
def create_feature(
    data: FeatureCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):

    return FeatureFlagService.create_feature(
        db=db,
        data=data,
        current_user=current_user,
    )


# ============================================================
# UPDATE FEATURE
# ADMIN ONLY
# ============================================================

@router.put(
    "/{feature_id}",
    response_model=FeatureUpdateResponse,
    status_code=status.HTTP_200_OK,
    summary="Update feature flag",
)
def update_feature(
    feature_id: int,
    data: FeatureUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):

    return FeatureFlagService.update_feature(
        db=db,
        feature_id=feature_id,
        data=data,
        current_user=current_user,
    )


# ============================================================
# DELETE FEATURE
# ADMIN ONLY
# ============================================================

@router.delete(
    "/{feature_id}",
    response_model=FeatureDeleteResponse,
    status_code=status.HTTP_200_OK,
    summary="Delete feature flag",
)
def delete_feature(
    feature_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):

    return FeatureFlagService.delete_feature(
        db=db,
        feature_id=feature_id,
        current_user=current_user,
    )


# ============================================================
# ENABLE FEATURE
# ADMIN ONLY
# ============================================================

@router.patch(
    "/{feature_id}/enable",
    response_model=FeatureEnableResponse,
    status_code=status.HTTP_200_OK,
    summary="Enable feature flag",
)
def enable_feature(
    feature_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):

    return FeatureFlagService.enable_feature(
        db=db,
        feature_id=feature_id,
        current_user=current_user,
    )


# ============================================================
# DISABLE FEATURE
# ADMIN ONLY
# ============================================================

@router.patch(
    "/{feature_id}/disable",
    response_model=FeatureDisableResponse,
    status_code=status.HTTP_200_OK,
    summary="Disable feature flag",
)
def disable_feature(
    feature_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):

    return FeatureFlagService.disable_feature(
        db=db,
        feature_id=feature_id,
        current_user=current_user,
    )


# ============================================================
# EVALUATE FEATURE
# ADMIN + USER
# ============================================================

@router.get(
    "/{feature_id}/evaluate/{user_id}",
    response_model=FeatureEvaluateResponse,
    status_code=status.HTTP_200_OK,
    summary="Evaluate feature flag",
)
def evaluate_feature(
    feature_id: int,
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    return FeatureFlagService.evaluate_feature(
        db=db,
        feature_id=feature_id,
        user_id=user_id,
        current_user=current_user,
    )