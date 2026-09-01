from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import Boolean, DateTime, ForeignKey, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base


if TYPE_CHECKING:
    from app.models.user import User
    from app.models.feature_flag import FeatureFlag


class UserAssignment(Base):

    __tablename__ = "user_assignments"

    # ============================================================
    # ID
    # ============================================================

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        autoincrement=True,
        index=True
    )

    # ============================================================
    # USER ID
    # User receiving the feature
    # ============================================================

    user_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey(
            "users.id",
            ondelete="CASCADE"
        ),
        nullable=False,
        index=True
    )

    # ============================================================
    # FEATURE ID
    # ============================================================

    feature_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey(
            "feature_flags.id",
            ondelete="CASCADE"
        ),
        nullable=False,
        index=True
    )

    # ============================================================
    # ASSIGNED BY ID
    # Admin who assigned the feature
    # ============================================================

    assigned_by_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey(
            "users.id",
            ondelete="RESTRICT"
        ),
        nullable=False,
        index=True
    )

    # ============================================================
    # ENABLED
    # ============================================================

    is_enabled: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False
    )

    # ============================================================
    # CREATED AT
    # ============================================================

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False
    )

    # ============================================================
    # UPDATED AT
    # ============================================================

    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False
    )

    # ============================================================
    # ASSIGNED USER RELATIONSHIP
    # ============================================================

    user: Mapped["User"] = relationship(
        "User",
        foreign_keys=[user_id],
        back_populates="user_assignments"
    )

    # ============================================================
    # ASSIGNED BY RELATIONSHIP
    # ============================================================

    assigned_by: Mapped["User"] = relationship(
        "User",
        foreign_keys=[assigned_by_id],
        back_populates="assigned_assignments"
    )

    # ============================================================
    # FEATURE RELATIONSHIP
    # ============================================================

    feature: Mapped["FeatureFlag"] = relationship(
        "FeatureFlag",
        back_populates="user_assignments"
    )