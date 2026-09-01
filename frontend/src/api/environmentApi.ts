import api from "./axios";

// ============================================================
// TYPES
// ============================================================

export interface Environment {
  id: number;
  name: string;
  key: string;
  description?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CreateEnvironmentRequest {
  name: string;
  key: string;
  description?: string;
  is_active?: boolean;
}

export interface UpdateEnvironmentRequest {
  name?: string;
  key?: string;
  description?: string;
  is_active?: boolean;
}

// ============================================================
// GET ALL ENVIRONMENTS
// GET /api/environments
// ============================================================

export const getEnvironments = async () => {
  const response = await api.get("/environments");

  return response.data;
};

// ============================================================
// GET ENVIRONMENT BY ID
// GET /api/environments/{environment_id}
// ============================================================

export const getEnvironmentById = async (
  environmentId: number
) => {
  const response = await api.get(
    `/environments/${environmentId}`
  );

  return response.data;
};

// ============================================================
// CREATE ENVIRONMENT
// POST /api/environments
// ============================================================

export const createEnvironment = async (
  data: CreateEnvironmentRequest
) => {
  const response = await api.post(
    "/environments",
    data
  );

  return response.data;
};

// ============================================================
// UPDATE ENVIRONMENT
// PUT /api/environments/{environment_id}
// ============================================================

export const updateEnvironment = async (
  environmentId: number,
  data: UpdateEnvironmentRequest
) => {
  const response = await api.put(
    `/environments/${environmentId}`,
    data
  );

  return response.data;
};

// ============================================================
// DELETE ENVIRONMENT
// DELETE /api/environments/{environment_id}
// ============================================================

export const deleteEnvironment = async (
  environmentId: number
) => {
  const response = await api.delete(
    `/environments/${environmentId}`
  );

  return response.data;
};