
from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field


# ============================================================
# CREATE ROLE
# ============================================================

class RoleCreate(BaseModel):

    name: str = Field(
        ...,
        min_length=2,
        max_length=100
    )

    description: str | None = Field(
        default=None,
        max_length=500
    )

    is_active: bool = True


# ============================================================
# UPDATE ROLE
# ============================================================

class RoleUpdate(BaseModel):

    name: str | None = Field(
        default=None,
        min_length=2,
        max_length=100
    )

    description: str | None = Field(
        default=None,
        max_length=500
    )

    is_active: bool | None = None


# ============================================================
# ROLE RESPONSE
# ============================================================

class RoleResponse(BaseModel):

    id: int
    name: str
    description: str | None = None
    is_active: bool

    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(
        from_attributes=True
    )


# ============================================================
# ROLE DETAILS INSIDE USER
# ============================================================

class RoleDetailsResponse(BaseModel):

    id: int
    name: str
    description: str | None = None
    is_active: bool

    model_config = ConfigDict(
        from_attributes=True
    )


# ============================================================
# USER DETAILS
# ============================================================

class RoleUserResponse(BaseModel):

    id: int
    name: str
    email: EmailStr
    is_active: bool

    role: RoleDetailsResponse

    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(
        from_attributes=True
    )


# ============================================================
# RETRIEVED BY
# ============================================================

class RoleRetrievedByResponse(BaseModel):

    user: RoleUserResponse


# ============================================================
# UPDATED BY
# ============================================================

class RoleUpdatedByResponse(BaseModel):

    user: RoleUserResponse


# ============================================================
# DELETED BY
# ============================================================

class RoleDeletedByResponse(BaseModel):

    user: RoleUserResponse


# ============================================================
# GET ALL ROLES RESPONSE
# ============================================================

class RoleListResponse(BaseModel):

    success: bool
    message: str
    total: int
    roles: list[RoleResponse]

    retrieved_by: RoleRetrievedByResponse


# ============================================================
# GET ROLE BY ID RESPONSE
# ============================================================

class RoleSingleResponse(BaseModel):

    success: bool
    message: str
    role: RoleResponse

    retrieved_by: RoleRetrievedByResponse


# ============================================================
# CREATE ROLE RESPONSE
# ============================================================

class RoleCreateResponse(BaseModel):

    success: bool
    message: str
    role: RoleResponse


# ============================================================
# UPDATE ROLE RESPONSE
# ============================================================

class RoleUpdateResponse(BaseModel):

    success: bool
    message: str
    role: RoleResponse

    updated_by: RoleUpdatedByResponse


# ============================================================
# DELETE ROLE RESPONSE
# ============================================================

class RoleDeleteResponse(BaseModel):

    success: bool
    message: str
    role: RoleResponse

    deleted_by: RoleDeletedByResponse