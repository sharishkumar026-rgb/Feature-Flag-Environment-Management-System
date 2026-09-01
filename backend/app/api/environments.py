from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.database.database import get_db

from app.core.permissions import (
    get_current_user,
    require_admin,
)

from app.models.user import User

from app.schemas.environment import (
    EnvironmentCreate,
    EnvironmentUpdate,
    EnvironmentCreateResponse,
    EnvironmentUpdateResponse,
    EnvironmentListResponse,
    EnvironmentSingleResponse,
    EnvironmentDeleteResponse,
)

from app.services.environment_service import EnvironmentService


router = APIRouter(
    prefix="/environments",
    tags=["Environments"],
)


# =========================================================
# GET ALL
# ADMIN + USER
# =========================================================

@router.get(
    "",
    response_model=EnvironmentListResponse,
    status_code=status.HTTP_200_OK,
)
def get_environments(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    return EnvironmentService.get_environments(
        db=db,
        current_user=current_user,
    )


# =========================================================
# GET BY ID
# ADMIN + USER
# =========================================================

@router.get(
    "/{environment_id}",
    response_model=EnvironmentSingleResponse,
    status_code=status.HTTP_200_OK,
)
def get_environment(
    environment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    return EnvironmentService.get_environment(
        db=db,
        environment_id=environment_id,
        current_user=current_user,
    )


# =========================================================
# CREATE
# ADMIN ONLY
# =========================================================

@router.post(
    "",
    response_model=EnvironmentCreateResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_environment(
    data: EnvironmentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):

    return EnvironmentService.create_environment(
        db=db,
        data=data,
        current_user=current_user,
    )


# =========================================================
# UPDATE
# ADMIN ONLY
# =========================================================

@router.put(
    "/{environment_id}",
    response_model=EnvironmentUpdateResponse,
    status_code=status.HTTP_200_OK,
)
def update_environment(
    environment_id: int,
    data: EnvironmentUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):

    return EnvironmentService.update_environment(
        db=db,
        environment_id=environment_id,
        data=data,
        current_user=current_user,
    )


# =========================================================
# DELETE
# ADMIN ONLY
# =========================================================

@router.delete(
    "/{environment_id}",
    response_model=EnvironmentDeleteResponse,
    status_code=status.HTTP_200_OK,
)
def delete_environment(
    environment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):

    return EnvironmentService.delete_environment(
        db=db,
        environment_id=environment_id,
        current_user=current_user,
    )