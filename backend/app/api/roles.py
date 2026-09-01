
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.dependencies import (
    get_current_user,
    require_admin,
)

from app.database.database import get_db
from app.models.user import User

from app.schemas.role import (
    RoleCreate,
    RoleCreateResponse,
    RoleDeleteResponse,
    RoleListResponse,
    RoleSingleResponse,
    RoleUpdate,
    RoleUpdateResponse,
)

from app.services.role_service import RoleService


router = APIRouter(
    prefix="/roles",
    tags=["Roles"],
)


# ============================================================
# GET ALL ROLES
# ADMIN + USER
# ============================================================

@router.get(
    "",
    response_model=RoleListResponse,
    status_code=status.HTTP_200_OK,
    summary="Get all roles",
)
def get_roles(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    return RoleService.get_roles(
        db=db,
        current_user=current_user,
    )


# ============================================================
# GET ROLE BY ID
# ADMIN + USER
# ============================================================

@router.get(
    "/{role_id}",
    response_model=RoleSingleResponse,
    status_code=status.HTTP_200_OK,
    summary="Get role by ID",
)
def get_role(
    role_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    return RoleService.get_role(
        db=db,
        role_id=role_id,
        current_user=current_user,
    )


# ============================================================
# CREATE ROLE
# ADMIN ONLY
# ============================================================

@router.post(
    "",
    response_model=RoleCreateResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create role",
)
def create_role(
    role_data: RoleCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):

    return RoleService.create_role(
        db=db,
        role_data=role_data,
        current_user=current_user,
    )


# ============================================================
# UPDATE ROLE
# ADMIN ONLY
# ============================================================

@router.put(
    "/{role_id}",
    response_model=RoleUpdateResponse,
    status_code=status.HTTP_200_OK,
    summary="Update role",
)
def update_role(
    role_id: int,
    role_data: RoleUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):

    return RoleService.update_role(
        db=db,
        role_id=role_id,
        role_data=role_data,
        current_user=current_user,
    )


# ============================================================
# DELETE ROLE
# ADMIN ONLY
# ============================================================

@router.delete(
    "/{role_id}",
    response_model=RoleDeleteResponse,
    status_code=status.HTTP_200_OK,
    summary="Delete role",
)
def delete_role(
    role_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):

    return RoleService.delete_role(
        db=db,
        role_id=role_id,
        current_user=current_user,
    )