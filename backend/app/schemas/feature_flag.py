from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field


# ============================================================
# FEATURE CREATE
# ============================================================

class FeatureCreate(BaseModel):

    name: str = Field(
        ...,
        min_length=2,
        max_length=100
    )

    key: str = Field(
        ...,
        min_length=2,
        max_length=100
    )

    description: str | None = Field(
        default=None,
        max_length=500
    )

    is_enabled: bool = False


# ============================================================
# FEATURE UPDATE
# ============================================================

class FeatureUpdate(BaseModel):

    name: str | None = Field(
        default=None,
        min_length=2,
        max_length=100
    )

    key: str | None = Field(
        default=None,
        min_length=2,
        max_length=100
    )

    description: str | None = Field(
        default=None,
        max_length=500
    )

    is_enabled: bool | None = None


# ============================================================
# ROLE DETAILS
# ============================================================

class FeatureRoleResponse(BaseModel):

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

class FeatureUserResponse(BaseModel):

    id: int
    name: str
    email: EmailStr
    is_active: bool

    role: FeatureRoleResponse

    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(
        from_attributes=True
    )


# ============================================================
# CREATED BY
# ============================================================

class FeatureCreatedByResponse(BaseModel):

    user: FeatureUserResponse

    model_config = ConfigDict(
        from_attributes=True
    )


# ============================================================
# RETRIEVED BY
# ============================================================

class FeatureRetrievedByResponse(BaseModel):

    user: FeatureUserResponse

    model_config = ConfigDict(
        from_attributes=True
    )


# ============================================================
# UPDATED BY
# ============================================================

class FeatureUpdatedByResponse(BaseModel):

    user: FeatureUserResponse

    model_config = ConfigDict(
        from_attributes=True
    )


# ============================================================
# DELETED BY
# ============================================================

class FeatureDeletedByResponse(BaseModel):

    user: FeatureUserResponse

    model_config = ConfigDict(
        from_attributes=True
    )


# ============================================================
# ENABLED BY
# ============================================================

class FeatureEnabledByResponse(BaseModel):

    user: FeatureUserResponse

    model_config = ConfigDict(
        from_attributes=True
    )


# ============================================================
# DISABLED BY
# ============================================================

class FeatureDisabledByResponse(BaseModel):

    user: FeatureUserResponse

    model_config = ConfigDict(
        from_attributes=True
    )


# ============================================================
# EVALUATED BY
# ============================================================

class FeatureEvaluatedByResponse(BaseModel):

    user: FeatureUserResponse

    model_config = ConfigDict(
        from_attributes=True
    )


# ============================================================
# FEATURE RESPONSE
# ============================================================

class FeatureResponse(BaseModel):

    id: int
    name: str
    key: str
    description: str | None = None
    is_enabled: bool

    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(
        from_attributes=True
    )


# ============================================================
# CREATE RESPONSE
# ============================================================

class FeatureCreateResponse(BaseModel):

    success: bool
    message: str
    feature: FeatureResponse
    created_by: FeatureCreatedByResponse


# ============================================================
# SINGLE FEATURE RESPONSE
# ============================================================

class FeatureSingleResponse(BaseModel):

    success: bool
    message: str
    feature: FeatureResponse
    retrieved_by: FeatureRetrievedByResponse


# ============================================================
# LIST RESPONSE
# ============================================================

class FeatureListResponse(BaseModel):

    success: bool
    message: str
    total: int
    features: list[FeatureResponse]
    retrieved_by: FeatureRetrievedByResponse


# ============================================================
# UPDATE RESPONSE
# ============================================================

class FeatureUpdateResponse(BaseModel):

    success: bool
    message: str
    feature: FeatureResponse
    updated_by: FeatureUpdatedByResponse


# ============================================================
# DELETE RESPONSE
# ============================================================

class FeatureDeleteResponse(BaseModel):

    success: bool
    message: str
    feature: FeatureResponse
    deleted_by: FeatureDeletedByResponse


# ============================================================
# ENABLE RESPONSE
# ============================================================

class FeatureEnableResponse(BaseModel):

    success: bool
    message: str
    feature: FeatureResponse
    enabled_by: FeatureEnabledByResponse


# ============================================================
# DISABLE RESPONSE
# ============================================================

class FeatureDisableResponse(BaseModel):

    success: bool
    message: str
    feature: FeatureResponse
    disabled_by: FeatureDisabledByResponse


# ============================================================
# EVALUATE RESPONSE
# ============================================================

class FeatureEvaluateResponse(BaseModel):

    success: bool
    message: str

    feature: FeatureResponse

    # User for whom feature is evaluated
    user: FeatureUserResponse

    enabled: bool

    # Admin/User who performed evaluation
    evaluated_by: FeatureEvaluatedByResponse