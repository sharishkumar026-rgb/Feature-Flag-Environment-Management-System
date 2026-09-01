from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.environment import Environment
from app.schemas.environment import (
    EnvironmentCreate,
    EnvironmentUpdate,
)


class EnvironmentService:

    # =========================================================
    # GET ALL ENVIRONMENTS
    # =========================================================

    @staticmethod
    def get_environments(
        db: Session,
        current_user,
    ):

        environments = (
            db.query(Environment)
            .order_by(Environment.id.asc())
            .all()
        )

        return {
            "success": True,
            "message": (
                "Environments retrieved successfully by admin"
                if current_user.role.name.lower() == "admin"
                else "Environments retrieved successfully by user"
            ),
            "total": len(environments),
            "environments": environments,
            "retrieved_by": {
                "user": current_user
            },
        }

    # =========================================================
    # GET ENVIRONMENT BY ID
    # =========================================================

    @staticmethod
    def get_environment(
        db: Session,
        environment_id: int,
        current_user,
    ):

        environment = (
            db.query(Environment)
            .filter(
                Environment.id == environment_id
            )
            .first()
        )

        if not environment:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Environment not found",
            )

        return {
            "success": True,
            "message": (
                "Environment retrieved successfully by admin"
                if current_user.role.name.lower() == "admin"
                else "Environment retrieved successfully by user"
            ),
            "environment": environment,
            "retrieved_by": {
                "user": current_user
            },
        }

    # =========================================================
    # CREATE ENVIRONMENT
    # =========================================================

    @staticmethod
    def create_environment(
        db: Session,
        data: EnvironmentCreate,
        current_user,
    ):

        existing_name = (
            db.query(Environment)
            .filter(
                Environment.name == data.name
            )
            .first()
        )

        if existing_name:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Environment name already exists",
            )

        existing_key = (
            db.query(Environment)
            .filter(
                Environment.key == data.key
            )
            .first()
        )

        if existing_key:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Environment key already exists",
            )

        environment = Environment(
            name=data.name,
            key=data.key,
            description=data.description,
            is_active=data.is_active,
        )

        db.add(environment)
        db.commit()
        db.refresh(environment)

        return {
            "success": True,
            "message": "Environment created successfully by admin",
            "environment": environment,
            "created_by": {
                "user": current_user
            },
        }

    # =========================================================
    # UPDATE ENVIRONMENT
    # =========================================================

    @staticmethod
    def update_environment(
        db: Session,
        environment_id: int,
        data: EnvironmentUpdate,
        current_user,
    ):

        environment = (
            db.query(Environment)
            .filter(
                Environment.id == environment_id
            )
            .first()
        )

        if not environment:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Environment not found",
            )

        if data.name is not None:

            existing_name = (
                db.query(Environment)
                .filter(
                    Environment.name == data.name,
                    Environment.id != environment_id,
                )
                .first()
            )

            if existing_name:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Environment name already exists",
                )

            environment.name = data.name

        if data.key is not None:

            existing_key = (
                db.query(Environment)
                .filter(
                    Environment.key == data.key,
                    Environment.id != environment_id,
                )
                .first()
            )

            if existing_key:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Environment key already exists",
                )

            environment.key = data.key

        if data.description is not None:
            environment.description = data.description

        if data.is_active is not None:
            environment.is_active = data.is_active

        db.commit()
        db.refresh(environment)

        return {
            "success": True,
            "message": "Environment updated successfully by admin",
            "environment": environment,
            "updated_by": {
                "user": current_user
            },
        }

    # =========================================================
    # DELETE ENVIRONMENT
    # =========================================================

    @staticmethod
    def delete_environment(
        db: Session,
        environment_id: int,
        current_user,
    ):

        environment = (
            db.query(Environment)
            .filter(
                Environment.id == environment_id
            )
            .first()
        )

        if not environment:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Environment not found",
            )

        environment_data = environment

        db.delete(environment)
        db.commit()

        return {
            "success": True,
            "message": "Environment deleted successfully by admin",
            "environment": environment_data,
            "deleted_by": {
                "user": current_user
            },
        }