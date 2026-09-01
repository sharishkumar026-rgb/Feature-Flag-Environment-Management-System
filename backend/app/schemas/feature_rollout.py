
from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field


# ============================================================
# ROLLOUT CREATE
# ============================================================

class RolloutCreate(BaseModel):

    feature_id: int

    environment_id: int

    percentage: float = Field(
        ...,
        ge=0,
        le=100
    )

    is_active: bool = True


# ============================================================
# ROLLOUT UPDATE
# ============================================================

class RolloutUpdate(BaseModel):

    feature_id: int | None = None

    environment_id: int | None = None

    percentage: float | None = Field(
        default=None,
        ge=0,
        le=100
    )

    is_active: bool | None = None


# ============================================================
# ROLLOUT RESPONSE
# ============================================================

class RolloutResponse(BaseModel):

    id: int
    feature_id: int
    environment_id: int
    percentage: float
    is_active: bool

    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(
        from_attributes=True
    )


# ============================================================
# ACTION USER ROLE RESPONSE
# ============================================================

class ActionUserRoleResponse(BaseModel):

    id: int
    name: str
    description: str | None = None
    is_active: bool

    model_config = ConfigDict(
        from_attributes=True
    )


# ============================================================
# ACTION USER RESPONSE
# ============================================================

class ActionUserResponse(BaseModel):

    id: int
    name: str
    email: EmailStr
    is_active: bool

    role: ActionUserRoleResponse

    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(
        from_attributes=True
    )


# ============================================================
# RETRIEVED BY RESPONSE
# ============================================================

class RetrievedByResponse(ActionUserResponse):
    pass


# ============================================================
# CREATED BY RESPONSE
# ============================================================

class CreatedByResponse(ActionUserResponse):
    pass


# ============================================================
# UPDATED BY RESPONSE
# ============================================================

class UpdatedByResponse(ActionUserResponse):
    pass


# ============================================================
# DELETED BY RESPONSE
# ============================================================

class DeletedByResponse(ActionUserResponse):
    pass


# ============================================================
# ROLLOUT SINGLE RESPONSE
# ============================================================

class RolloutSingleResponse(BaseModel):

    success: bool
    message: str

    rollout: RolloutResponse

    retrieved_by: RetrievedByResponse


# ============================================================
# ROLLOUT LIST RESPONSE
# ============================================================

class RolloutListResponse(BaseModel):

    success: bool
    message: str
    total: int

    rollouts: list[RolloutResponse]

    retrieved_by: RetrievedByResponse


# ============================================================
# ROLLOUT CREATE RESPONSE
# ============================================================

class RolloutCreateResponse(BaseModel):

    success: bool
    message: str

    rollout: RolloutResponse

    created_by: CreatedByResponse


# ============================================================
# ROLLOUT UPDATE RESPONSE
# ============================================================

class RolloutUpdateResponse(BaseModel):

    success: bool
    message: str

    rollout: RolloutResponse

    updated_by: UpdatedByResponse


# ============================================================
# ROLLOUT DELETE RESPONSE
# ============================================================

class RolloutDeleteResponse(BaseModel):

    success: bool
    message: str

    rollout: RolloutResponse

    deleted_by: DeletedByResponse