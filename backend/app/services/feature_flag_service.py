from datetime import datetime

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.feature_flag import FeatureFlag
from app.models.user import User

from app.schemas.feature_flag import (
    FeatureCreate,
    FeatureUpdate,
)


class FeatureFlagService:

    # ============================================================
    # GET ALL FEATURES
    # ADMIN + USER
    # ============================================================

    @staticmethod
    def get_features(
        db: Session,
        current_user: User,
    ):

        features = (
            db.query(FeatureFlag)
            .order_by(FeatureFlag.id)
            .all()
        )

        if current_user.role.name.lower() == "admin":
            message = "Features retrieved successfully by admin"
        else:
            message = "Features retrieved successfully by user"

        return {
            "success": True,
            "message": message,
            "total": len(features),
            "features": features,
            "retrieved_by": {
                "user": current_user
            },
        }

    # ============================================================
    # GET FEATURE BY ID
    # ADMIN + USER
    # ============================================================

    @staticmethod
    def get_feature(
        db: Session,
        feature_id: int,
        current_user: User,
    ):

        feature = (
            db.query(FeatureFlag)
            .filter(
                FeatureFlag.id == feature_id
            )
            .first()
        )

        if not feature:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Feature not found",
            )

        if current_user.role.name.lower() == "admin":
            message = (
                "Feature details retrieved successfully by admin"
            )
        else:
            message = (
                "Feature details retrieved successfully by user"
            )

        return {
            "success": True,
            "message": message,
            "feature": feature,
            "retrieved_by": {
                "user": current_user
            },
        }

    # ============================================================
    # CREATE FEATURE
    # ADMIN ONLY
    # ============================================================

    @staticmethod
    def create_feature(
        db: Session,
        data: FeatureCreate,
        current_user: User,
    ):

        existing_feature = (
            db.query(FeatureFlag)
            .filter(
                FeatureFlag.key == data.key
            )
            .first()
        )

        if existing_feature:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Feature key already exists",
            )

        feature = FeatureFlag(
            name=data.name,
            key=data.key,
            description=data.description,
            is_enabled=data.is_enabled,
            created_by_id=current_user.id,
        )

        db.add(feature)
        db.commit()
        db.refresh(feature)

        return {
            "success": True,
            "message": "Feature created successfully by admin",
            "feature": feature,
            "created_by": {
                "user": current_user
            },
        }

    # ============================================================
    # UPDATE FEATURE
    # ADMIN ONLY
    # ============================================================

    @staticmethod
    def update_feature(
        db: Session,
        feature_id: int,
        data: FeatureUpdate,
        current_user: User,
    ):

        feature = (
            db.query(FeatureFlag)
            .filter(
                FeatureFlag.id == feature_id
            )
            .first()
        )

        if not feature:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Feature not found",
            )

        # --------------------------------------------------------
        # CHECK DUPLICATE KEY
        # --------------------------------------------------------

        if data.key is not None:

            existing_feature = (
                db.query(FeatureFlag)
                .filter(
                    FeatureFlag.key == data.key,
                    FeatureFlag.id != feature_id,
                )
                .first()
            )

            if existing_feature:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail="Feature key already exists",
                )

            feature.key = data.key

        # --------------------------------------------------------
        # UPDATE NAME
        # --------------------------------------------------------

        if data.name is not None:
            feature.name = data.name

        # --------------------------------------------------------
        # UPDATE DESCRIPTION
        # --------------------------------------------------------

        if data.description is not None:
            feature.description = data.description

        # --------------------------------------------------------
        # UPDATE ENABLED
        # --------------------------------------------------------

        if data.is_enabled is not None:
            feature.is_enabled = data.is_enabled

        feature.updated_at = datetime.utcnow()

        db.commit()
        db.refresh(feature)

        return {
            "success": True,
            "message": "Feature updated successfully by admin",
            "feature": feature,
            "updated_by": {
                "user": current_user
            },
        }

    # ============================================================
    # DELETE FEATURE
    # ADMIN ONLY
    # ============================================================

    @staticmethod
    def delete_feature(
        db: Session,
        feature_id: int,
        current_user: User,
    ):

        feature = (
            db.query(FeatureFlag)
            .filter(
                FeatureFlag.id == feature_id
            )
            .first()
        )

        if not feature:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Feature not found",
            )

        response = {
            "success": True,
            "message": "Feature deleted successfully by admin",
            "feature": feature,
            "deleted_by": {
                "user": current_user
            },
        }

        db.delete(feature)
        db.commit()

        return response

    # ============================================================
    # ENABLE FEATURE
    # ADMIN ONLY
    # ============================================================

    @staticmethod
    def enable_feature(
        db: Session,
        feature_id: int,
        current_user: User,
    ):

        feature = (
            db.query(FeatureFlag)
            .filter(
                FeatureFlag.id == feature_id
            )
            .first()
        )

        if not feature:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Feature not found",
            )

        feature.is_enabled = True
        feature.updated_at = datetime.utcnow()

        db.commit()
        db.refresh(feature)

        return {
            "success": True,
            "message": "Feature enabled successfully by admin",
            "feature": feature,
            "enabled_by": {
                "user": current_user
            },
        }

    # ============================================================
    # DISABLE FEATURE
    # ADMIN ONLY
    # ============================================================

    @staticmethod
    def disable_feature(
        db: Session,
        feature_id: int,
        current_user: User,
    ):

        feature = (
            db.query(FeatureFlag)
            .filter(
                FeatureFlag.id == feature_id
            )
            .first()
        )

        if not feature:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Feature not found",
            )

        feature.is_enabled = False
        feature.updated_at = datetime.utcnow()

        db.commit()
        db.refresh(feature)

        return {
            "success": True,
            "message": "Feature disabled successfully by admin",
            "feature": feature,
            "disabled_by": {
                "user": current_user
            },
        }

    # ============================================================
    # EVALUATE FEATURE
    #
    # ADMIN:
    #   Can evaluate for ANY user.
    #
    # USER:
    #   Can evaluate ONLY themselves.
    # ============================================================

    @staticmethod
    def evaluate_feature(
        db: Session,
        feature_id: int,
        user_id: int,
        current_user: User,
    ):

        # --------------------------------------------------------
        # GET FEATURE
        # --------------------------------------------------------

        feature = (
            db.query(FeatureFlag)
            .filter(
                FeatureFlag.id == feature_id
            )
            .first()
        )

        if not feature:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Feature not found",
            )

        # --------------------------------------------------------
        # GET USER BEING EVALUATED
        # --------------------------------------------------------

        user = (
            db.query(User)
            .filter(
                User.id == user_id
            )
            .first()
        )

        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found",
            )

        # --------------------------------------------------------
        # CHECK ADMIN
        # --------------------------------------------------------

        is_admin = (
            current_user.role is not None
            and current_user.role.name.lower() == "admin"
        )

        # --------------------------------------------------------
        # NORMAL USER CAN ONLY EVALUATE THEMSELVES
        # --------------------------------------------------------

        if not is_admin:

            if current_user.id != user_id:

                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail=(
                        "Users can evaluate features "
                        "only for themselves"
                    ),
                )

        # --------------------------------------------------------
        # MESSAGE
        # --------------------------------------------------------

        if is_admin:
            message = "Feature evaluated successfully by admin"
        else:
            message = "Feature evaluated successfully by user"

        # --------------------------------------------------------
        # RESPONSE
        # --------------------------------------------------------

        return {
            "success": True,
            "message": message,
            "feature": feature,

            # The user for whom the feature is evaluated
            "user": user,

            "enabled": feature.is_enabled,

            # The person performing the evaluation
            "evaluated_by": {
                "user": current_user
            },
        }