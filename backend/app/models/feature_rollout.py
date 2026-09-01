from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import (
    Boolean,
    DateTime,
    Float,
    ForeignKey,
    Integer,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base


if TYPE_CHECKING:
    from app.models.feature_flag import FeatureFlag
    from app.models.environment import Environment
    from app.models.user import User


class FeatureRollout(Base):
    __tablename__ = "feature_rollouts"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True
    )

    feature_id: Mapped[int] = mapped_column(
        ForeignKey(
            "feature_flags.id",
            ondelete="CASCADE"
        ),
        nullable=False,
        index=True
    )

    environment_id: Mapped[int] = mapped_column(
        ForeignKey(
            "environments.id",
            ondelete="CASCADE"
        ),
        nullable=False,
        index=True
    )

    percentage: Mapped[float] = mapped_column(
        Float,
        nullable=False
    )

    is_active: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False
    )

    created_by_id: Mapped[int] = mapped_column(
        ForeignKey(
            "users.id",
            ondelete="RESTRICT"
        ),
        nullable=False,
        index=True
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False
    )

    feature = relationship(
        "FeatureFlag",
        back_populates="rollouts",
    )

    environment = relationship(
        "Environment",
        back_populates="rollouts",
    )

    created_by = relationship(
        "User",
        foreign_keys=[created_by_id],
    )