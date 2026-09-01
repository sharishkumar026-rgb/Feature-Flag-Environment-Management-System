from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.audit_log import AuditLog


class AuditLogService:

    # =====================================================
    # GET ALL AUDIT LOGS
    # =====================================================

    @staticmethod
    def get_all(db: Session):

        audit_logs = (
            db.query(AuditLog)
            .order_by(
                AuditLog.id.desc()
            )
            .all()
        )

        return audit_logs

    # =====================================================
    # GET AUDIT LOG BY ID
    # =====================================================

    @staticmethod
    def get_by_id(
        db: Session,
        audit_log_id: int,
    ):

        audit_log = (
            db.query(AuditLog)
            .filter(
                AuditLog.id == audit_log_id
            )
            .first()
        )

        if not audit_log:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Audit log not found",
            )

        return audit_log

    # =====================================================
    # CREATE AUDIT LOG
    # =====================================================

    @staticmethod
    def create(
        db: Session,
        user_id: int | None,
        action: str,
        resource_type: str,
        resource_id: int | None = None,
        description: str | None = None,
    ):

        audit_log = AuditLog(
            user_id=user_id,
            action=action,
            resource_type=resource_type,
            resource_id=resource_id,
            description=description,
        )

        db.add(audit_log)
        db.commit()
        db.refresh(audit_log)

        return audit_log