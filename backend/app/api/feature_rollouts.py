from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.dependencies import (
    get_current_user,
    require_admin
)

from app.database.database import get_db

from app.models.user import User

from app.schemas.feature_rollout import (
    RolloutCreate,
    RolloutUpdate,
    RolloutSingleResponse,
    RolloutListResponse,
    RolloutCreateResponse,
    RolloutUpdateResponse,
    RolloutDeleteResponse
)

from app.services.feature_rollout_service import RolloutService


router = APIRouter(
    prefix="/rollouts",
    tags=["Rollouts"]
)


# ============================================================
# GET ALL ROLLOUTS
# ADMIN + USER
# ============================================================

@router.get(
    "",
    response_model=RolloutListResponse,
    status_code=status.HTTP_200_OK,
    summary="Get all rollouts"
)
def get_rollouts(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    return RolloutService.get_all(
        db=db,
        current_user=current_user
    )


# ============================================================
# GET ROLLOUT BY ID
# ADMIN + USER
# ============================================================

@router.get(
    "/{rollout_id}",
    response_model=RolloutSingleResponse,
    status_code=status.HTTP_200_OK,
    summary="Get rollout by ID"
)
def get_rollout(
    rollout_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    return RolloutService.get_by_id(
        db=db,
        rollout_id=rollout_id,
        current_user=current_user
    )


# ============================================================
# CREATE ROLLOUT
# ADMIN ONLY
# ============================================================

@router.post(
    "",
    response_model=RolloutCreateResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create rollout"
)
def create_rollout(
    data: RolloutCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):

    return RolloutService.create(
        db=db,
        data=data,
        current_user=current_user
    )


# ============================================================
# UPDATE ROLLOUT
# ADMIN ONLY
# ============================================================

@router.put(
    "/{rollout_id}",
    response_model=RolloutUpdateResponse,
    status_code=status.HTTP_200_OK,
    summary="Update rollout"
)
def update_rollout(
    rollout_id: int,
    data: RolloutUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):

    return RolloutService.update(
        db=db,
        rollout_id=rollout_id,
        data=data,
        current_user=current_user
    )


# ============================================================
# DELETE ROLLOUT
# ADMIN ONLY
# ============================================================

@router.delete(
    "/{rollout_id}",
    response_model=RolloutDeleteResponse,
    status_code=status.HTTP_200_OK,
    summary="Delete rollout"
)
def delete_rollout(
    rollout_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):

    return RolloutService.delete(
        db=db,
        rollout_id=rollout_id,
        current_user=current_user
    )