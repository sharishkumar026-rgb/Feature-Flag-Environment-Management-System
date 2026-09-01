from fastapi import (
    APIRouter,
    Depends,
    status,
)

from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.user import User

from app.schemas.audit_log import (
    AuditLogListResponse,
    AuditLogSingleResponse,
)

from app.services.audit_log_service import AuditLogService

from app.core.permissions import require_admin


router = APIRouter(
    prefix="/api/audit-logs",
    tags=["Audit Logs"],
)


# =========================================================
# GET ALL AUDIT LOGS
# Admin Only
# =========================================================

@router.get(
    "",
    response_model=AuditLogListResponse,
    status_code=status.HTTP_200_OK,
    summary="Get Audit Logs",
)
def get_audit_logs(
    admin_user: User = Depends(require_admin),
    db: Session = Depends(get_db),
):

    audit_logs = AuditLogService.get_all(db)

    return {
        "success": True,
        "message": "Audit logs retrieved successfully",
        "total": len(audit_logs),
        "audit_logs": audit_logs,
    }


# =========================================================
# GET AUDIT LOG BY ID
# Admin Only
# =========================================================

@router.get(
    "/{audit_log_id}",
    response_model=AuditLogSingleResponse,
    status_code=status.HTTP_200_OK,
    summary="Get Audit Log",
)
def get_audit_log(
    audit_log_id: int,
    admin_user: User = Depends(require_admin),
    db: Session = Depends(get_db),
):

    audit_log = AuditLogService.get_by_id(
        db,
        audit_log_id,
    )

    return {
        "success": True,
        "message": "Audit log retrieved successfully",
        "audit_log": audit_log,
    }