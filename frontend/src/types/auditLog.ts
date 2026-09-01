
// ============================================================
// AUDIT LOG TYPES
// ============================================================

// ============================================================
// USER DETAILS
// ============================================================

export interface AuditLogUser {
  id?: number;
  name?: string;
  email?: string;
  role?: string;
  role_id?: number;
}

// ============================================================
// AUDIT LOG
// ============================================================

export interface AuditLog {
  id: number;

  user_id?: number;

  action: string;

  resource_type?: string;

  resource_id?: number;

  description?: string;

  created_at?: string;

  user?: AuditLogUser;

  created_by?: AuditLogUser;
}

// ============================================================
// CREATE AUDIT LOG REQUEST
// ============================================================

export interface AuditLogCreateRequest {
  user_id?: number;

  action: string;

  resource_type?: string;

  resource_id?: number;

  description?: string;
}

// ============================================================
// GET SINGLE AUDIT LOG RESPONSE
// ============================================================

export interface AuditLogSingleResponse {
  success?: boolean;

  message?: string;

  audit_log?: AuditLog;

  retrieved_by?: AuditLogUser;

  data?:
    | AuditLog
    | {
        audit_log?: AuditLog;
        retrieved_by?: AuditLogUser;
      };
}

// ============================================================
// GET ALL AUDIT LOGS RESPONSE
// ============================================================

export interface AuditLogListResponse {
  success?: boolean;

  message?: string;

  total?: number;

  audit_logs?: AuditLog[];

  retrieved_by?: AuditLogUser;

  data?:
    | AuditLog[]
    | {
        audit_logs?: AuditLog[];
        total?: number;
        retrieved_by?: AuditLogUser;
      };
}

// ============================================================
// DELETE AUDIT LOG RESPONSE
// ============================================================

export interface AuditLogDeleteResponse {
  success?: boolean;

  message?: string;

  audit_log_id?: number;

  deleted_by?: AuditLogUser;

  data?: {
    audit_log_id?: number;
    deleted_by?: AuditLogUser;
  };
}

