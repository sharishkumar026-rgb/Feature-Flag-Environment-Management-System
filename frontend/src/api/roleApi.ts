import api from "./axios";

// ============================================================
// TYPES
// ============================================================

export interface Role {
  id: number;
  name: string;
  description?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CreateRoleRequest {
  name: string;
  description?: string;
  is_active?: boolean;
}

export interface UpdateRoleRequest {
  name?: string;
  description?: string;
  is_active?: boolean;
}

// ============================================================
// GET ALL ROLES
// GET /api/roles
// ============================================================

export const getRoles = async () => {
  const response = await api.get("/roles");

  return response.data;
};

// ============================================================
// GET ROLE BY ID
// GET /api/roles/{role_id}
// ============================================================

export const getRoleById = async (
  roleId: number
) => {
  const response = await api.get(
    `/roles/${roleId}`
  );

  return response.data;
};

// ============================================================
// CREATE ROLE
// POST /api/roles
// ============================================================

export const createRole = async (
  data: CreateRoleRequest
) => {
  const response = await api.post(
    "/roles",
    data
  );

  return response.data;
};

// ============================================================
// UPDATE ROLE
// PUT /api/roles/{role_id}
// ============================================================

export const updateRole = async (
  roleId: number,
  data: UpdateRoleRequest
) => {
  const response = await api.put(
    `/roles/${roleId}`,
    data
  );

  return response.data;
};

// ============================================================
// DELETE ROLE
// DELETE /api/roles/{role_id}
// ============================================================

export const deleteRole = async (
  roleId: number
) => {
  const response = await api.delete(
    `/roles/${roleId}`
  );

  return response.data;
};