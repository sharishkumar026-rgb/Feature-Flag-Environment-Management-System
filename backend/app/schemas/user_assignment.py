from datetime import datetime

from pydantic import BaseModel, ConfigDict


# ============================================================
# CREATE ASSIGNMENT
# ============================================================

class AssignmentCreate(BaseModel):

    user_id: int

    feature_id: int

    is_enabled: bool = True


# ============================================================
# UPDATE ASSIGNMENT
# ============================================================

class AssignmentUpdate(BaseModel):

    user_id: int | None = None

    feature_id: int | None = None

    is_enabled: bool | None = None


# ============================================================
# ROLE RESPONSE
# ============================================================

class AssignmentRoleResponse(BaseModel):

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

class AssignmentUserResponse(BaseModel):

    id: int
    name: str
    email: str
    is_active: bool

    role: AssignmentRoleResponse

    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(
        from_attributes=True
    )


# ============================================================
# ASSIGNMENT RESPONSE
# ============================================================

class AssignmentResponse(BaseModel):

    id: int
    user_id: int
    feature_id: int
    is_enabled: bool

    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(
        from_attributes=True
    )


# ============================================================
# ASSIGNED BY RESPONSE
# ============================================================

class AssignmentAssignedByResponse(BaseModel):

    user: AssignmentUserResponse

    model_config = ConfigDict(
        from_attributes=True
    )


# ============================================================
# UPDATED BY RESPONSE
# ============================================================

class AssignmentUpdatedByResponse(BaseModel):

    user: AssignmentUserResponse

    model_config = ConfigDict(
        from_attributes=True
    )


# ============================================================
# DELETED BY RESPONSE
# ============================================================

class AssignmentDeletedByResponse(BaseModel):

    user: AssignmentUserResponse

    model_config = ConfigDict(
        from_attributes=True
    )


# ============================================================
# RETRIEVED BY RESPONSE
# ============================================================

class AssignmentRetrievedByResponse(BaseModel):

    user: AssignmentUserResponse

    model_config = ConfigDict(
        from_attributes=True
    )


# ============================================================
# CREATE RESPONSE
# ============================================================

class AssignmentCreateResponse(BaseModel):

    success: bool
    message: str

    assignment: AssignmentResponse

    assigned_by: AssignmentAssignedByResponse


# ============================================================
# LIST RESPONSE
# ============================================================

class AssignmentListResponse(BaseModel):

    success: bool
    message: str
    total: int

    assignments: list[AssignmentResponse]

    retrieved_by: AssignmentRetrievedByResponse


# ============================================================
# SINGLE RESPONSE
# ============================================================

class AssignmentSingleResponse(BaseModel):

    success: bool
    message: str

    assignment: AssignmentResponse

    retrieved_by: AssignmentRetrievedByResponse


# ============================================================
# UPDATE RESPONSE
# ============================================================

class AssignmentUpdateResponse(BaseModel):

    success: bool
    message: str

    assignment: AssignmentResponse

    updated_by: AssignmentUpdatedByResponse


# ============================================================
# DELETE RESPONSE
# ============================================================

class AssignmentDeleteResponse(BaseModel):

    success: bool
    message: str

    assignment: AssignmentResponse

    deleted_by: AssignmentDeletedByResponse