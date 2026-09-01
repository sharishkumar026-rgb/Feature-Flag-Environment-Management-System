from fastapi import APIRouter, Depends, status, Header
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.database.database import get_db
from app.models.user import User
from app.schemas.auth import (
    LoginResponse,
    LogoutResponse,
    RegisterRequest,
    RegisterResponse,
    UserMeResponse,
)
from app.services.auth_service import AuthService


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


# =========================================================
# REGISTER
# =========================================================

@router.post(
    "/register",
    response_model=RegisterResponse,
    status_code=status.HTTP_201_CREATED
)
def register(
    register_data: RegisterRequest,
    db: Session = Depends(get_db)
):

    return AuthService.register(
        db=db,
        name=register_data.name,
        email=register_data.email,
        password=register_data.password,
        role_id=register_data.role_id,
        is_active=register_data.is_active
    )


# =========================================================
# LOGIN
# =========================================================

@router.post(
    "/login",
    response_model=LoginResponse,
    status_code=status.HTTP_200_OK
)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):

    return AuthService.login(
        db=db,
        email=form_data.username,
        password=form_data.password
    )


# =========================================================
# LOGOUT
# =========================================================

@router.post(
    "/logout",
    response_model=LogoutResponse,
    status_code=status.HTTP_200_OK
)
def logout(
    authorization: str = Header(
        ...,
        alias="Authorization"
    ),
    current_user: User = Depends(get_current_user)
):

    return AuthService.logout(
        user=current_user
    )


# =========================================================
# CURRENT USER
# =========================================================

@router.get(
    "/me",
    response_model=UserMeResponse,
    status_code=status.HTTP_200_OK
)
def get_me(
    current_user: User = Depends(get_current_user)
):

    return AuthService.get_me(
        user=current_user
    )