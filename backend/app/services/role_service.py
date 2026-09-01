
from datetime import datetime

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.role import Role
from app.models.user import User

from app.schemas.role import (
    RoleCreate,
    RoleUpdate,
)


class RoleService:

    # ============================================================
    # GET ALL ROLES
    # ADMIN + USER
    # ============================================================

    @staticmethod
    def get_roles(
        db: Session,
        current_user: User,
    ):

        roles = (
            db.query(Role)
            .order_by(Role.id)
            .all()
        )

        role_name = (
            current_user.role.name.lower()
            if current_user.role
            else "user"
        )

        return {
            "success": True,
            "message": f"Roles retrieved successfully by {role_name}",
            "total": len(roles),
            "roles": roles,
            "retrieved_by": {
                "user": current_user
            },
        }

    # ============================================================
    # GET ROLE BY ID
    # ADMIN + USER
    # ============================================================

    @staticmethod
    def get_role(
        db: Session,
        role_id: int,
        current_user: User,
    ):

        role = (
            db.query(Role)
            .filter(
                Role.id == role_id
            )
            .first()
        )

        if not role:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Role not found",
            )

        role_name = (
            current_user.role.name.lower()
            if current_user.role
            else "user"
        )

        return {
            "success": True,
            "message": f"Role details retrieved successfully by {role_name}",
            "role": role,
            "retrieved_by": {
                "user": current_user
            },
        }

    # ============================================================
    # CREATE ROLE
    # ADMIN ONLY
    # ============================================================

    @staticmethod
    def create_role(
        db: Session,
        role_data: RoleCreate,
        current_user: User,
    ):

        existing_role = (
            db.query(Role)
            .filter(
                Role.name == role_data.name
            )
            .first()
        )

        if existing_role:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Role already exists",
            )

        role = Role(
            name=role_data.name,
            description=role_data.description,
            is_active=role_data.is_active,
        )

        db.add(role)
        db.commit()
        db.refresh(role)

        return {
            "success": True,
            "message": "Role created successfully by admin",
            "role": role,
        }

    # ============================================================
    # UPDATE ROLE
    # ADMIN ONLY
    # ============================================================

    @staticmethod
    def update_role(
        db: Session,
        role_id: int,
        role_data: RoleUpdate,
        current_user: User,
    ):

        role = (
            db.query(Role)
            .filter(
                Role.id == role_id
            )
            .first()
        )

        if not role:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Role not found",
            )

        # --------------------------------------------------------
        # CHECK DUPLICATE ROLE NAME
        # --------------------------------------------------------

        if role_data.name is not None:

            existing_role = (
                db.query(Role)
                .filter(
                    Role.name == role_data.name,
                    Role.id != role_id,
                )
                .first()
            )

            if existing_role:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail="Role already exists",
                )

            role.name = role_data.name

        # --------------------------------------------------------
        # UPDATE DESCRIPTION
        # --------------------------------------------------------

        if role_data.description is not None:
            role.description = role_data.description

        # --------------------------------------------------------
        # UPDATE ACTIVE STATUS
        # --------------------------------------------------------

        if role_data.is_active is not None:
            role.is_active = role_data.is_active

        role.updated_at = datetime.utcnow()

        db.commit()
        db.refresh(role)

        return {
            "success": True,
            "message": "Role updated successfully by admin",
            "role": role,
            "updated_by": {
                "user": current_user
            },
        }

    # ============================================================
    # DELETE ROLE
    # ADMIN ONLY
    # ============================================================

    @staticmethod
    def delete_role(
        db: Session,
        role_id: int,
        current_user: User,
    ):

        role = (
            db.query(Role)
            .filter(
                Role.id == role_id
            )
            .first()
        )

        if not role:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Role not found",
            )

        # --------------------------------------------------------
        # CHECK WHETHER ROLE IS ASSIGNED TO ANY USER
        # --------------------------------------------------------

        assigned_user = (
            db.query(User)
            .filter(
                User.role_id == role_id
            )
            .first()
        )

        if assigned_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Cannot delete role because it is assigned to users",
            )

        response = {
            "success": True,
            "message": "Role deleted successfully by admin",
            "role": role,
            "deleted_by": {
                "user": current_user
            },
        }

        db.delete(role)
        db.commit()

        return response