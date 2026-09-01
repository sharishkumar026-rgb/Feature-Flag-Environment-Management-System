from sqlalchemy.orm import Session

from app.models.user import User
from app.models.feature_flag import FeatureFlag
from app.models.environment import Environment
from app.models.feature_rollout import FeatureRollout
from app.models.user_assignment import UserAssignment


class DashboardService:

    # =========================================================
    # DASHBOARD SUMMARY
    # =========================================================

    @staticmethod
    def get_dashboard(db: Session):

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
    # DASHBOARD STATS
    # =========================================================

    @staticmethod
    def get_stats(db: Session):

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

        return {
            "total_features": total_features,
            "enabled_features": enabled_features,
            "disabled_features": disabled_features,
            "total_environments": total_environments,
            "total_rollouts": total_rollouts,
            "total_assignments": total_assignments,
        }

    # =========================================================
    # FEATURE DASHBOARD
    # =========================================================

    @staticmethod
    def get_features(db: Session):

        return (
            db.query(FeatureFlag)
            .order_by(FeatureFlag.id.asc())
            .all()
        )

    # =========================================================
    # ENVIRONMENT DASHBOARD
    # =========================================================

    @staticmethod
    def get_environments(db: Session):

        return (
            db.query(Environment)
            .order_by(Environment.id.asc())
            .all()
        )

    # =========================================================
    # ROLLOUT DASHBOARD
    # =========================================================

    @staticmethod
    def get_rollouts(db: Session):

        return (
            db.query(FeatureRollout)
            .order_by(FeatureRollout.id.asc())
            .all()
        )

    # =========================================================
    # ASSIGNMENT DASHBOARD
    # =========================================================

    @staticmethod
    def get_assignments(db: Session):

        return (
            db.query(UserAssignment)
            .order_by(UserAssignment.id.asc())
            .all()
        )