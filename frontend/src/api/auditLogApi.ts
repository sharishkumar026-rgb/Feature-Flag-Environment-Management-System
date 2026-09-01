import api from "./axios";

// ============================================================
// TYPES
// ============================================================

export interface AuditLog {
  id: number;
  user_id?: number;
  action: string;
  resource_type?: string;
  resource_id?: number;
  description?: string;
  created_at?: string;
}

// ============================================================
// GET ALL AUDIT LOGS
// GET /api/audit-logs
// ============================================================

export const getAuditLogs = async () => {
  const response = await api.get("/audit-logs");

  return response.data;
};

// ============================================================
// GET AUDIT LOG BY ID
// GET /api/audit-logs/{audit_log_id}
// ============================================================

export const getAuditLogById = async (
  auditLogId: number
) => {
  const response = await api.get(
    `/audit-logs/${auditLogId}`
  );

  return response.data;
};