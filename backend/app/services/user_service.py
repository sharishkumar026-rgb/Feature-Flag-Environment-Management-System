from datetime import datetime

from fastapi import HTTPException, status
from sqlalchemy.orm import Session, joinedload

from app.core.security import hash_password
from app.models.role import Role
from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate


class UserService:

    # ========================================================
    # GET ALL USERS
    # ========================================================

    @staticmethod
    def get_users(
        db: Session,
        current_user: User
    ):
        users = (
            db.query(User)
            .options(
                joinedload(User.role)
            )
            .order_by(User.id)
            .all()
        )

        retrieved_by = (
            db.query(User)
            .options(
                joinedload(User.role)
            )
            .filter(
                User.id == current_user.id
            )
            .first()
        )

        return {
            "success": True,
            "message": "Users retrieved successfully by admin",
            "total": len(users),
            "users": users,
            "retrieved_by": {
                "user": retrieved_by
            }
        }

    # ========================================================
    # GET USER BY ID
    # ========================================================

    @staticmethod
    def get_user(
        db: Session,
        user_id: int,
        current_user: User
    ):
        user = (
            db.query(User)
            .options(
                joinedload(User.role)
            )
            .filter(
                User.id == user_id
            )
            .first()
        )

        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )

        retrieved_by = (
            db.query(User)
            .options(
                joinedload(User.role)
            )
            .filter(
                User.id == current_user.id
            )
            .first()
        )

        return {
            "success": True,
            "message": "User retrieved successfully by admin",
            "user": user,
            "retrieved_by": {
                "user": retrieved_by
            }
        }

    # ========================================================
    # CREATE USER
    # ========================================================

    @staticmethod
    def create_user(
        db: Session,
        data: UserCreate,
        current_user: User
    ):
        existing_user = (
            db.query(User)
            .filter(
                User.email == data.email
            )
            .first()
        )

        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Email already registered"
            )

        role = (
            db.query(Role)
            .filter(
                Role.id == data.role_id
            )
            .first()
        )

        if not role:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Role not found"
            )

        user = User(
            name=data.name,
            email=data.email,
            hashed_password=hash_password(
                data.password
            ),
            role_id=data.role_id,
            is_active=data.is_active
        )

        db.add(user)
        db.commit()
        db.refresh(user)

        # Reload created user with role
        user = (
            db.query(User)
            .options(
                joinedload(User.role)
            )
            .filter(
                User.id == user.id
            )
            .first()
        )

        # Reload admin with role
        created_by = (
            db.query(User)
            .options(
                joinedload(User.role)
            )
            .filter(
                User.id == current_user.id
            )
            .first()
        )

        return {
            "success": True,
            "message": "User created successfully by admin",
            "user": user,
            "created_by": {
                "user": created_by
            }
        }

    # ========================================================
    # UPDATE USER
    # ========================================================

    @staticmethod
    def update_user(
        db: Session,
        user_id: int,
        data: UserUpdate,
        current_user: User
    ):
        user = (
            db.query(User)
            .options(
                joinedload(User.role)
            )
            .filter(
                User.id == user_id
            )
            .first()
        )

        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )

        # ----------------------------------------------------
        # EMAIL
        # ----------------------------------------------------

        if data.email is not None:

            existing_user = (
                db.query(User)
                .filter(
                    User.email == data.email,
                    User.id != user_id
                )
                .first()
            )

            if existing_user:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail="Email already registered"
                )

            user.email = data.email

        # ----------------------------------------------------
        # NAME
        # ----------------------------------------------------

        if data.name is not None:
            user.name = data.name

        # ----------------------------------------------------
        # PASSWORD
        # ----------------------------------------------------

        if data.password is not None:
            user.hashed_password = hash_password(
                data.password
            )

        # ----------------------------------------------------
        # ROLE
        # ----------------------------------------------------

        if data.role_id is not None:

            role = (
                db.query(Role)
                .filter(
                    Role.id == data.role_id
                )
                .first()
            )

            if not role:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Role not found"
                )

            user.role_id = data.role_id

        # ----------------------------------------------------
        # ACTIVE STATUS
        # ----------------------------------------------------

        if data.is_active is not None:
            user.is_active = data.is_active

        user.updated_at = datetime.utcnow()

        db.commit()
        db.refresh(user)

        # Reload updated user with role
        user = (
            db.query(User)
            .options(
                joinedload(User.role)
            )
            .filter(
                User.id == user_id
            )
            .first()
        )

        # Reload admin with role
        updated_by = (
            db.query(User)
            .options(
                joinedload(User.role)
            )
            .filter(
                User.id == current_user.id
            )
            .first()
        )

        return {
            "success": True,
            "message": "User updated successfully by admin",
            "user": user,
            "updated_by": {
                "user": updated_by
            }
        }

    # ========================================================
    # DELETE USER
    # ========================================================

    @staticmethod
    def delete_user(
        db: Session,
        user_id: int,
        current_user: User
    ):
        user = (
            db.query(User)
            .options(
                joinedload(User.role)
            )
            .filter(
                User.id == user_id
            )
            .first()
        )

        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )

        # ----------------------------------------------------
        # SAVE USER BEFORE DELETE
        # ----------------------------------------------------

        deleted_user = user

        # ----------------------------------------------------
        # RELOAD ADMIN WITH ROLE
        # ----------------------------------------------------

        deleted_by = (
            db.query(User)
            .options(
                joinedload(User.role)
            )
            .filter(
                User.id == current_user.id
            )
            .first()
        )

        # ----------------------------------------------------
        # DELETE USER
        # ----------------------------------------------------

        db.delete(user)
        db.commit()

        return {
            "success": True,
            "message": "User deleted successfully by admin",
            "user": deleted_user,
            "deleted_by": {
                "user": deleted_by
            }
        }

