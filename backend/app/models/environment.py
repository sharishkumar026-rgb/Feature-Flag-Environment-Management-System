from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import (
    Boolean,
    DateTime,
    ForeignKey,
    Integer,
    String,
    Text,
)
from sqlalchemy.orm import (
    Mapped,
    mapped_column,
    relationship,
)

from app.database.base import Base


if TYPE_CHECKING:
    from app.models.feature_rollout import FeatureRollout
    from app.models.user import User


class Environment(Base):
    __tablename__ = "environments"

    # =========================================================
    # ID
    # =========================================================

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True,
    )

    # =========================================================
    # NAME
    # =========================================================

    name: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
        unique=True,
    )

    # =========================================================
    # KEY
    # =========================================================

    key: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
        unique=True,
        index=True,
    )

    # =========================================================
    # DESCRIPTION
    # =========================================================

    description: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    # =========================================================
    # ACTIVE STATUS
    # =========================================================

    is_active: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False,
    )

    # =========================================================
    # CREATED BY USER
    # =========================================================

    created_by_id: Mapped[int] = mapped_column(
        ForeignKey("users.id"),
        nullable=False,
        index=True,
    )

    created_by: Mapped["User"] = relationship(
        "User",
        back_populates="created_environments",
        foreign_keys=[created_by_id],
    )

    # =========================================================
    # CREATED / UPDATED
    # =========================================================

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False,
    )

    # =========================================================
    # FEATURE ROLLOUT RELATIONSHIP
    # =========================================================

    rollouts: Mapped[list["FeatureRollout"]] = relationship(
        "FeatureRollout",
        back_populates="environment",
        cascade="all, delete-orphan",
    )