from datetime import datetime

from pydantic import BaseModel, ConfigDict


class AuditLogResponse(BaseModel):
    id: int
    user_id: int | None
    action: str
    resource_type: str
    resource_id: int | None
    description: str | None
    created_at: datetime

    model_config = ConfigDict(
        from_attributes=True,
    )


class AuditLogSingleResponse(BaseModel):
    success: bool
    message: str
    audit_log: AuditLogResponse


class AuditLogListResponse(BaseModel):
    success: bool
    message: str
    total: int
    audit_logs: list[AuditLogResponse]