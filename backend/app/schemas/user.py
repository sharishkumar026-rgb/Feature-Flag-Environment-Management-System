from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field


# ============================================================
# CREATE USER
# ============================================================

class UserCreate(BaseModel):

    name: str = Field(
        ...,
        min_length=2,
        max_length=100
    )

    email: EmailStr

    password: str = Field(
        ...,
        min_length=6,
        max_length=255
    )

    role_id: int

    is_active: bool = True


# ============================================================
# UPDATE USER
# ============================================================

class UserUpdate(BaseModel):

    name: str | None = Field(
        default=None,
        min_length=2,
        max_length=100
    )

    email: EmailStr | None = None

    password: str | None = Field(
        default=None,
        min_length=6,
        max_length=255
    )

    role_id: int | None = None

    is_active: bool | None = None


# ============================================================
# ROLE RESPONSE
# ============================================================

class RoleResponse(BaseModel):

    id: int
    name: str
    description: str | None = None
    is_active: bool

    model_config = ConfigDict(
        from_attributes=True
    )


# ============================================================
# USER RESPONSE
# ============================================================

class UserResponse(BaseModel):

    id: int
    name: str
    email: EmailStr
    is_active: bool

    role: RoleResponse

    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(
        from_attributes=True
    )


# ============================================================
# ADMIN / ACTION USER RESPONSE
# ============================================================

class UserAdminResponse(BaseModel):

    id: int
    name: str
    email: EmailStr
    is_active: bool

    role: RoleResponse

    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(
        from_attributes=True
    )


# ============================================================
# RETRIEVED BY RESPONSE
# ============================================================

class RetrievedByResponse(BaseModel):

    user: UserAdminResponse

    model_config = ConfigDict(
        from_attributes=True
    )


# ============================================================
# CREATED BY RESPONSE
# ============================================================

class CreatedByResponse(BaseModel):

    user: UserAdminResponse

    model_config = ConfigDict(
        from_attributes=True
    )


# ============================================================
# UPDATED BY RESPONSE
# ============================================================

class UpdatedByResponse(BaseModel):

    user: UserAdminResponse

    model_config = ConfigDict(
        from_attributes=True
    )


# ============================================================
# DELETED BY RESPONSE
# ============================================================

class DeletedByResponse(BaseModel):

    user: UserAdminResponse

    model_config = ConfigDict(
        from_attributes=True
    )


# ============================================================
# USER LIST RESPONSE
# ============================================================

class UserListResponse(BaseModel):

    success: bool
    message: str
    total: int

    users: list[UserResponse]

    retrieved_by: RetrievedByResponse


# ============================================================
# USER SINGLE RESPONSE
# ============================================================

class UserSingleResponse(BaseModel):

    success: bool
    message: str

    user: UserResponse

    retrieved_by: RetrievedByResponse


# ============================================================
# USER CREATE RESPONSE
# ============================================================

class UserCreateResponse(BaseModel):

    success: bool
    message: str

    user: UserResponse

    created_by: CreatedByResponse


# ============================================================
# USER UPDATE RESPONSE
# ============================================================

class UserUpdateResponse(BaseModel):

    success: bool
    message: str

    user: UserResponse

    updated_by: UpdatedByResponse


# ============================================================
# USER DELETE RESPONSE
# ============================================================

class UserDeleteResponse(BaseModel):

    success: bool
    message: str

    user: UserResponse

    deleted_by: DeletedByResponse