from logging.config import fileConfig

from sqlalchemy import engine_from_config
from sqlalchemy import pool

from alembic import context

from app.core.config import settings
from app.database.base import Base


# =========================================================
# IMPORT ALL MODELS
# =========================================================

from app.models.user import User
from app.models.role import Role
from app.models.feature_flag import FeatureFlag
from app.models.environment import Environment
from app.models.feature_rollout import FeatureRollout
from app.models.user_assignment import UserAssignment
from app.models.audit_log import AuditLog


# =========================================================
# ALEMBIC CONFIG
# =========================================================

config = context.config


if config.config_file_name is not None:
    fileConfig(config.config_file_name)


# =========================================================
# METADATA
# =========================================================

target_metadata = Base.metadata


# =========================================================
# DATABASE URL
# =========================================================

config.set_main_option(
    "sqlalchemy.url",
    settings.DATABASE_URL.replace("%", "%%")
)

# =========================================================
# OFFLINE
# =========================================================

def run_migrations_offline() -> None:

    url = config.get_main_option(
        "sqlalchemy.url"
    )

    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={
            "paramstyle": "named"
        },
        compare_type=True,
        compare_server_default=True,
    )

    with context.begin_transaction():

        context.run_migrations()


# =========================================================
# ONLINE
# =========================================================

def run_migrations_online() -> None:

    connectable = engine_from_config(
        config.get_section(
            config.config_ini_section,
            {}
        ),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:

        context.configure(
            connection=connection,
            target_metadata=target_metadata,
            compare_type=True,
            compare_server_default=True,
        )

        with context.begin_transaction():

            context.run_migrations()


# =========================================================
# RUN MIGRATION
# =========================================================

if context.is_offline_mode():

    run_migrations_offline()

else:

    run_migrations_online()