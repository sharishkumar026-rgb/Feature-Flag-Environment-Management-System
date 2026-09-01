from fastapi import HTTPException, status
from sqlalchemy.orm import Session, joinedload

from app.models.feature_rollout import FeatureRollout
from app.models.feature_flag import FeatureFlag
from app.models.environment import Environment
from app.models.user import User

from app.schemas.feature_rollout import (
    RolloutCreate,
    RolloutUpdate,
)


class RolloutService:

    # =====================================================
    # HELPER - GET CURRENT USER WITH ROLE
    # =====================================================

    @staticmethod
    def get_user_with_role(
        db: Session,
        user_id: int
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

        return user

    # =====================================================
    # HELPER - GET ROLE NAME
    # =====================================================

    @staticmethod
    def get_user_type(
        current_user: User
    ):

        if (
            current_user.role
            and current_user.role.name.lower() == "admin"
        ):
            return "admin"

        return "user"

    # =====================================================
    # GET ALL ROLLOUTS
    # ADMIN + USER
    # =====================================================

    @staticmethod
    def get_all(
        db: Session,
        current_user: User
    ):

        rollouts = (
            db.query(FeatureRollout)
            .order_by(
                FeatureRollout.id.asc()
            )
            .all()
        )

        retrieved_by = RolloutService.get_user_with_role(
            db=db,
            user_id=current_user.id
        )

        user_type = RolloutService.get_user_type(
            current_user
        )

        return {
            "success": True,
            "message": (
                f"Rollouts retrieved successfully by "
                f"{user_type}"
            ),
            "total": len(rollouts),
            "rollouts": rollouts,
            "retrieved_by": retrieved_by
        }

    # =====================================================
    # GET ROLLOUT BY ID
    # ADMIN + USER
    # =====================================================

    @staticmethod
    def get_by_id(
        db: Session,
        rollout_id: int,
        current_user: User
    ):

        rollout = (
            db.query(FeatureRollout)
            .filter(
                FeatureRollout.id == rollout_id
            )
            .first()
        )

        if not rollout:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Rollout not found"
            )

        retrieved_by = RolloutService.get_user_with_role(
            db=db,
            user_id=current_user.id
        )

        user_type = RolloutService.get_user_type(
            current_user
        )

        return {
            "success": True,
            "message": (
                f"Rollout retrieved successfully by "
                f"{user_type}"
            ),
            "rollout": rollout,
            "retrieved_by": retrieved_by
        }

    # =====================================================
    # CREATE ROLLOUT
    # ADMIN ONLY
    # =====================================================

    @staticmethod
    def create(
        db: Session,
        data: RolloutCreate,
        current_user: User
    ):

        # -------------------------------------------------
        # CHECK FEATURE
        # -------------------------------------------------

        feature = (
            db.query(FeatureFlag)
            .filter(
                FeatureFlag.id == data.feature_id
            )
            .first()
        )

        if not feature:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Feature not found"
            )

        # -------------------------------------------------
        # CHECK ENVIRONMENT
        # -------------------------------------------------

        environment = (
            db.query(Environment)
            .filter(
                Environment.id == data.environment_id
            )
            .first()
        )

        if not environment:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Environment not found"
            )

        # -------------------------------------------------
        # CHECK DUPLICATE
        # -------------------------------------------------

        existing = (
            db.query(FeatureRollout)
            .filter(
                FeatureRollout.feature_id == data.feature_id,
                FeatureRollout.environment_id == data.environment_id
            )
            .first()
        )

        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=(
                    "Rollout already exists for this "
                    "feature and environment"
                )
            )

        # -------------------------------------------------
        # CREATE ROLLOUT
        # -------------------------------------------------

        rollout = FeatureRollout(
            feature_id=data.feature_id,
            environment_id=data.environment_id,
            percentage=data.percentage,
            is_active=data.is_active,
            created_by_id=current_user.id
        )

        db.add(rollout)
        db.commit()
        db.refresh(rollout)

        # -------------------------------------------------
        # CREATED BY
        # -------------------------------------------------

        created_by = RolloutService.get_user_with_role(
            db=db,
            user_id=current_user.id
        )

        user_type = RolloutService.get_user_type(
            current_user
        )

        return {
            "success": True,
            "message": (
                f"Rollout created successfully by "
                f"{user_type}"
            ),
            "rollout": rollout,
            "created_by": created_by
        }

    # =====================================================
    # UPDATE ROLLOUT
    # ADMIN ONLY
    # =====================================================

    @staticmethod
    def update(
        db: Session,
        rollout_id: int,
        data: RolloutUpdate,
        current_user: User
    ):

        rollout = (
            db.query(FeatureRollout)
            .filter(
                FeatureRollout.id == rollout_id
            )
            .first()
        )

        if not rollout:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Rollout not found"
            )

        update_data = data.model_dump(
            exclude_unset=True
        )

        # -------------------------------------------------
        # VALIDATE FEATURE
        # -------------------------------------------------

        if "feature_id" in update_data:

            feature = (
                db.query(FeatureFlag)
                .filter(
                    FeatureFlag.id ==
                    update_data["feature_id"]
                )
                .first()
            )

            if not feature:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Feature not found"
                )

        # -------------------------------------------------
        # VALIDATE ENVIRONMENT
        # -------------------------------------------------

        if "environment_id" in update_data:

            environment = (
                db.query(Environment)
                .filter(
                    Environment.id ==
                    update_data["environment_id"]
                )
                .first()
            )

            if not environment:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Environment not found"
                )

        # -------------------------------------------------
        # NEW FEATURE / ENVIRONMENT
        # -------------------------------------------------

        new_feature_id = update_data.get(
            "feature_id",
            rollout.feature_id
        )

        new_environment_id = update_data.get(
            "environment_id",
            rollout.environment_id
        )

        # -------------------------------------------------
        # CHECK DUPLICATE
        # -------------------------------------------------

        existing = (
            db.query(FeatureRollout)
            .filter(
                FeatureRollout.feature_id == new_feature_id,
                FeatureRollout.environment_id == new_environment_id,
                FeatureRollout.id != rollout_id
            )
            .first()
        )

        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=(
                    "Rollout already exists for this "
                    "feature and environment"
                )
            )

        # -------------------------------------------------
        # UPDATE
        # -------------------------------------------------

        for field, value in update_data.items():

            setattr(
                rollout,
                field,
                value
            )

        db.commit()
        db.refresh(rollout)

        # -------------------------------------------------
        # UPDATED BY
        # -------------------------------------------------

        updated_by = RolloutService.get_user_with_role(
            db=db,
            user_id=current_user.id
        )

        user_type = RolloutService.get_user_type(
            current_user
        )

        return {
            "success": True,
            "message": (
                f"Rollout updated successfully by "
                f"{user_type}"
            ),
            "rollout": rollout,
            "updated_by": updated_by
        }

    # =====================================================
    # DELETE ROLLOUT
    # ADMIN ONLY
    # =====================================================

    @staticmethod
    def delete(
        db: Session,
        rollout_id: int,
        current_user: User
    ):

        rollout = (
            db.query(FeatureRollout)
            .filter(
                FeatureRollout.id == rollout_id
            )
            .first()
        )

        if not rollout:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Rollout not found"
            )

        # -------------------------------------------------
        # DELETED BY
        # -------------------------------------------------

        deleted_by = RolloutService.get_user_with_role(
            db=db,
            user_id=current_user.id
        )

        user_type = RolloutService.get_user_type(
            current_user
        )

        # -------------------------------------------------
        # KEEP OBJECT FOR RESPONSE
        # -------------------------------------------------

        response_rollout = rollout

        # -------------------------------------------------
        # DELETE
        # -------------------------------------------------

        db.delete(rollout)
        db.commit()

        return {
            "success": True,
            "message": (
                f"Rollout deleted successfully by "
                f"{user_type}"
            ),
            "rollout": response_rollout,
            "deleted_by": deleted_by
        }