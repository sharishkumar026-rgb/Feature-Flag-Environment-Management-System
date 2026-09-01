from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import Boolean, DateTime, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base


if TYPE_CHECKING:
    from app.models.role import Role
    from app.models.user_assignment import UserAssignment
    from app.models.feature_flag import FeatureFlag
    from app.models.environment import Environment


class User(Base):
    __tablename__ = "users"

    # =========================================================
    # ID
    # =========================================================

    id: Mapped[int] = mapped_column(
        primary_key=True,
        index=True,
    )

    # =========================================================
    # NAME
    # =========================================================

    name: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    # =========================================================
    # EMAIL
    # =========================================================

    email: Mapped[str] = mapped_column(
        String(255),
        unique=True,
        index=True,
        nullable=False,
    )

    # =========================================================
    # PASSWORD
    # =========================================================

    hashed_password: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    # =========================================================
    # ROLE
    # =========================================================

    role_id: Mapped[int] = mapped_column(
        ForeignKey("roles.id"),
        nullable=False,
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
    # ROLE RELATIONSHIP
    # =========================================================

    role: Mapped["Role"] = relationship(
        "Role",
        back_populates="users",
    )

    # =========================================================
    # USER ASSIGNMENTS
    # Features assigned TO this user
    # =========================================================

    user_assignments: Mapped[list["UserAssignment"]] = relationship(
        "UserAssignment",
        foreign_keys="UserAssignment.user_id",
        back_populates="user",
        cascade="all, delete-orphan",
    )

    # =========================================================
    # ASSIGNMENTS CREATED BY THIS USER
    # Features assigned BY this user
    # =========================================================

    assigned_assignments: Mapped[list["UserAssignment"]] = relationship(
        "UserAssignment",
        foreign_keys="UserAssignment.assigned_by_id",
        back_populates="assigned_by",
    )

    # =========================================================
    # FEATURES CREATED BY THIS USER
    # =========================================================

    created_features: Mapped[list["FeatureFlag"]] = relationship(
        "FeatureFlag",
        back_populates="created_by",
        foreign_keys="FeatureFlag.created_by_id",
    )

    # =========================================================
    # ENVIRONMENTS CREATED BY THIS USER
    # =========================================================

    created_environments: Mapped[list["Environment"]] = relationship(
        "Environment",
        back_populates="created_by",
        foreign_keys="Environment.created_by_id",
    )