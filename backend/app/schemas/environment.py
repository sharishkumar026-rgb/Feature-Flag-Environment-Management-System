from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field


# ============================================================
# CREATE ENVIRONMENT
# ============================================================

class EnvironmentCreate(BaseModel):

    name: str = Field(
        ...,
        min_length=2,
        max_length=100,
    )

    key: str = Field(
        ...,
        min_length=2,
        max_length=100,
    )

    description: str | None = Field(
        default=None,
        max_length=500,
    )

    is_active: bool = True


# ============================================================
# UPDATE ENVIRONMENT
# ============================================================

class EnvironmentUpdate(BaseModel):

    name: str | None = Field(
        default=None,
        min_length=2,
        max_length=100,
    )

    key: str | None = Field(
        default=None,
        min_length=2,
        max_length=100,
    )

    description: str | None = Field(
        default=None,
        max_length=500,
    )

    is_active: bool | None = None


# ============================================================
# ENVIRONMENT RESPONSE
# ============================================================

class EnvironmentResponse(BaseModel):

    id: int
    name: str
    key: str
    description: str | None = None
    is_active: bool
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(
        from_attributes=True
    )


# ============================================================
# ROLE DETAILS
# ============================================================

class EnvironmentUserRoleResponse(BaseModel):

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

class EnvironmentUserResponse(BaseModel):

    id: int
    name: str
    email: EmailStr
    is_active: bool

    role: EnvironmentUserRoleResponse

    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(
        from_attributes=True
    )


# ============================================================
# RETRIEVED BY
# ============================================================

class EnvironmentRetrievedByResponse(BaseModel):

    user: EnvironmentUserResponse


# ============================================================
# CREATE RESPONSE
# ============================================================

class EnvironmentCreateResponse(BaseModel):

    success: bool
    message: str
    environment: EnvironmentResponse
    created_by: EnvironmentRetrievedByResponse


# ============================================================
# UPDATE RESPONSE
# ============================================================

class EnvironmentUpdateResponse(BaseModel):

    success: bool
    message: str
    environment: EnvironmentResponse
    updated_by: EnvironmentRetrievedByResponse


# ============================================================
# LIST RESPONSE
# ============================================================

class EnvironmentListResponse(BaseModel):

    success: bool
    message: str
    total: int
    environments: list[EnvironmentResponse]
    retrieved_by: EnvironmentRetrievedByResponse


# ============================================================
# SINGLE RESPONSE
# ============================================================

class EnvironmentSingleResponse(BaseModel):

    success: bool
    message: str
    environment: EnvironmentResponse
    retrieved_by: EnvironmentRetrievedByResponse


# ============================================================
# DELETE RESPONSE
# ============================================================

class EnvironmentDeleteResponse(BaseModel):

    success: bool
    message: str
    environment: EnvironmentResponse
    deleted_by: EnvironmentRetrievedByResponse