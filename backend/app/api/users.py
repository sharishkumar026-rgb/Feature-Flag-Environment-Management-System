from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.dependencies import (
    get_current_user,
    require_admin,
)
from app.database.database import get_db
from app.models.user import User

from app.schemas.user import (
    UserCreate,
    UserDeleteResponse,
    UserListResponse,
    UserSingleResponse,
    UserCreateResponse,
    UserUpdateResponse,
    UserUpdate,
)

from app.services.user_service import UserService


router = APIRouter(
    prefix="/users",
    tags=["Users"],
)


# ============================================================
# GET ALL USERS
# Admin / User
# ============================================================

@router.get(
    "",
    response_model=UserListResponse,
    status_code=status.HTTP_200_OK,
    summary="Get all users",
)
def get_users(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return UserService.get_users(
        db=db,
        current_user=current_user,
    )


# ============================================================
# GET USER BY ID
# Admin / User
# ============================================================

@router.get(
    "/{user_id}",
    response_model=UserSingleResponse,
    status_code=status.HTTP_200_OK,
    summary="Get user by ID",
)
def get_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return UserService.get_user(
        db=db,
        user_id=user_id,
        current_user=current_user,
    )


# ============================================================
# CREATE USER
# Admin
# ============================================================

@router.post(
    "",
    response_model=UserCreateResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create user",
)
def create_user(
    user_data: UserCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    return UserService.create_user(
        db=db,
        data=user_data,
        current_user=current_user,
    )


# ============================================================
# UPDATE USER
# Admin
# ============================================================

@router.put(
    "/{user_id}",
    response_model=UserUpdateResponse,
    status_code=status.HTTP_200_OK,
    summary="Update user",
)
def update_user(
    user_id: int,
    user_data: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    return UserService.update_user(
        db=db,
        user_id=user_id,
        data=user_data,
        current_user=current_user,
    )


# ============================================================
# DELETE USER
# Admin
# ============================================================

@router.delete(
    "/{user_id}",
    response_model=UserDeleteResponse,
    status_code=status.HTTP_200_OK,
    summary="Delete user",
)
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    return UserService.delete_user(
        db=db,
        user_id=user_id,
        current_user=current_user,
    )