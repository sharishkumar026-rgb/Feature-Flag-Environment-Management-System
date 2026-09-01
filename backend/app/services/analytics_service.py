from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.user import User
from app.models.feature_flag import FeatureFlag
from app.models.environment import Environment
from app.models.feature_rollout import FeatureRollout
from app.models.user_assignment import UserAssignment


class AnalyticsService:

    # =========================================================
    # OVERVIEW
    # =========================================================

    @staticmethod
    def get_overview(db: Session):

        total_features = (
            db.query(FeatureFlag)
            .count()
        )

        enabled_features = (
            db.query(FeatureFlag)
            .filter(
                FeatureFlag.is_enabled.is_(True)
            )
            .count()
        )

        disabled_features = (
            db.query(FeatureFlag)
            .filter(
                FeatureFlag.is_enabled.is_(False)
            )
            .count()
        )

        total_environments = (
            db.query(Environment)
            .count()
        )

        total_rollouts = (
            db.query(FeatureRollout)
            .count()
        )

        total_assignments = (
            db.query(UserAssignment)
            .count()
        )

        active_users = (
            db.query(User)
            .filter(
                User.is_active.is_(True)
            )
            .count()
        )

        return {
            "total_features": total_features,
            "enabled_features": enabled_features,
            "disabled_features": disabled_features,
            "total_environments": total_environments,
            "total_rollouts": total_rollouts,
            "total_assignments": total_assignments,
            "active_users": active_users,
        }

    # =========================================================
    # FEATURE ANALYTICS
    # =========================================================

    @staticmethod
    def get_feature_analytics(
        db: Session,
        feature_id: int
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
                detail="Feature not found"
            )

        total_assignments = (
            db.query(UserAssignment)
            .filter(
                UserAssignment.feature_id == feature_id
            )
            .count()
        )

        enabled_assignments = (
            db.query(UserAssignment)
            .filter(
                UserAssignment.feature_id == feature_id,
                UserAssignment.is_enabled.is_(True)
            )
            .count()
        )

        disabled_assignments = (
            db.query(UserAssignment)
            .filter(
                UserAssignment.feature_id == feature_id,
                UserAssignment.is_enabled.is_(False)
            )
            .count()
        )

        total_rollouts = (
            db.query(FeatureRollout)
            .filter(
                FeatureRollout.feature_id == feature_id
            )
            .count()
        )

        return {
            "id": feature.id,
            "name": feature.name,
            "key": feature.key,
            "is_enabled": feature.is_enabled,
            "total_assignments": total_assignments,
            "enabled_assignments": enabled_assignments,
            "disabled_assignments": disabled_assignments,
            "total_rollouts": total_rollouts,
        }

    # =========================================================
    # ROLLOUT ANALYTICS
    # =========================================================

    @staticmethod
    def get_rollout_analytics(
        db: Session,
        rollout_id: int
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

        enabled_users = (
            db.query(UserAssignment)
            .filter(
                UserAssignment.feature_id == rollout.feature_id,
                UserAssignment.is_enabled.is_(True)
            )
            .count()
        )

        disabled_users = (
            db.query(UserAssignment)
            .filter(
                UserAssignment.feature_id == rollout.feature_id,
                UserAssignment.is_enabled.is_(False)
            )
            .count()
        )

        return {
            "id": rollout.id,
            "feature_id": rollout.feature_id,
            "environment_id": rollout.environment_id,
            "percentage": rollout.percentage,
            "enabled_users": enabled_users,
            "disabled_users": disabled_users,
        }

    # =========================================================
    # ASSIGNMENT ANALYTICS
    # =========================================================

    @staticmethod
    def get_assignment_analytics(
        db: Session,
        assignment_id: int
    ):

        assignment = (
            db.query(UserAssignment)
            .filter(
                UserAssignment.id == assignment_id
            )
            .first()
        )

        if not assignment:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Assignment not found"
            )

        user = (
            db.query(User)
            .filter(
                User.id == assignment.user_id
            )
            .first()
        )

        feature = (
            db.query(FeatureFlag)
            .filter(
                FeatureFlag.id == assignment.feature_id
            )
            .first()
        )

        return {
            "id": assignment.id,
            "user_id": assignment.user_id,
            "feature_id": assignment.feature_id,
            "is_enabled": assignment.is_enabled,
            "feature_name": feature.name if feature else "",
            "user_name": user.name if user else "",
            "user_email": user.email if user else "",
        }

    # =========================================================
    # ENVIRONMENT ANALYTICS
    # =========================================================

    @staticmethod
    def get_environment_analytics(
        db: Session,
        environment_id: int
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
                detail="Environment not found"
            )

        total_rollouts = (
            db.query(FeatureRollout)
            .filter(
                FeatureRollout.environment_id == environment_id
            )
            .count()
        )

        feature_ids = [
            rollout.feature_id
            for rollout in (
                db.query(FeatureRollout)
                .filter(
                    FeatureRollout.environment_id == environment_id
                )
                .all()
            )
        ]

        feature_ids = list(set(feature_ids))

        total_features = len(feature_ids)

        enabled_features = 0
        disabled_features = 0

        if feature_ids:

            enabled_features = (
                db.query(FeatureFlag)
                .filter(
                    FeatureFlag.id.in_(feature_ids),
                    FeatureFlag.is_enabled.is_(True)
                )
                .count()
            )

            disabled_features = (
                db.query(FeatureFlag)
                .filter(
                    FeatureFlag.id.in_(feature_ids),
                    FeatureFlag.is_enabled.is_(False)
                )
                .count()
            )

        return {
            "id": environment.id,
            "name": environment.name,
            "total_features": total_features,
            "enabled_features": enabled_features,
            "disabled_features": disabled_features,
            "total_rollouts": total_rollouts,
        }