from fastapi import Depends, HTTPException, status

from app.core.dependencies import get_current_user
from app.models.user import User


def require_admin(
    current_user: User = Depends(get_current_user)
) -> User:
    """
    Allow only users with Admin role.
    """

    if not current_user.role:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User role not found"
        )

    if current_user.role.name.lower() != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )

    return current_user


def require_user(
    current_user: User = Depends(get_current_user)
) -> User:
    """
    Allow authenticated Admin and User roles.
    """

    if not current_user.role:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User role not found"
        )

    allowed_roles = ["admin", "user"]

    if current_user.role.name.lower() not in allowed_roles:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User access required"
        )

    return current_user