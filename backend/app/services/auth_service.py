from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.core.jwt import create_access_token
from app.core.security import hash_password, verify_password
from app.models.role import Role
from app.models.user import User


class AuthService:

    # =========================================================
    # REGISTER
    # =========================================================

    @staticmethod
    def register(
        db: Session,
        name: str,
        email: str,
        password: str,
        role_id: int,
        is_active: bool = True
    ):
        # Check existing email
        existing_user = (
            db.query(User)
            .filter(User.email == email)
            .first()
        )

        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Email already registered"
            )

        # Get requested active role
        user_role = (
            db.query(Role)
            .filter(
                Role.id == role_id,
                Role.is_active.is_(True)
            )
            .first()
        )

        if not user_role:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Role not found or inactive"
            )

        # Create user
        user = User(
            name=name,
            email=email,
            hashed_password=hash_password(password),
            role_id=user_role.id,
            is_active=is_active
        )

        db.add(user)
        db.commit()
        db.refresh(user)

        # Registration message based on role
        if user_role.name.lower() == "admin":
            message = "Admin registration successfully"
        else:
            message = "User registration successfully"

        return {
            "success": True,
            "message": message,
            "user": user
        }

    # =========================================================
    # LOGIN
    # =========================================================

    @staticmethod
    def login(
        db: Session,
        email: str,
        password: str
    ):
        user = (
            db.query(User)
            .filter(User.email == email)
            .first()
        )

        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )

        if not verify_password(
            password,
            user.hashed_password
        ):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )

        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User account is inactive"
            )

        if not user.role:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User role not found"
            )

        if not user.role.is_active:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User role is inactive"
            )

        # Create JWT access token
        access_token = create_access_token(
            user_id=user.id,
            role=user.role.name
        )

        # Login message based on role
        role_name = user.role.name.lower()

        if role_name == "admin":
            message = "Admin login successfully"
        else:
            message = "User login successfully"

        return {
            "success": True,
            "message": message,
            "user": user,
            "access_token": access_token,
            "token_type": "bearer"
        }

    # =========================================================
    # LOGOUT
    # =========================================================

    @staticmethod
    def logout(
        user: User
    ):
        if not user.role:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User role not found"
            )

        role_name = user.role.name.lower()

        if role_name == "admin":
            message = "Admin logout successfully"
        else:
            message = "User logout successfully"

        return {
            "success": True,
            "message": message,
            "user": user
        }

    # =========================================================
    # CURRENT USER
    # =========================================================

    @staticmethod
    def get_me(
        user: User
    ):
        if not user.role:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User role not found"
            )

        role_name = user.role.name.lower()

        if role_name == "admin":
            message = "Admin details retrieved successfully"
        else:
            message = "User details retrieved successfully"

        return {
            "success": True,
            "message": message,
            "user": user
        }