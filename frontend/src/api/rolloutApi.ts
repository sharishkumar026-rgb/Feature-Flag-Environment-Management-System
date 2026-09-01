import api from "./axios";

// ============================================================
// TYPES
// ============================================================

export interface Rollout {
  id: number;
  feature_id: number;
  environment_id: number;
  percentage: number;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CreateRolloutRequest {
  feature_id: number;
  environment_id: number;
  percentage: number;
  is_active?: boolean;
}

export interface UpdateRolloutRequest {
  feature_id?: number;
  environment_id?: number;
  percentage?: number;
  is_active?: boolean;
}

// ============================================================
// GET ALL ROLLOUTS
// GET /api/rollouts
// ============================================================

export const getRollouts = async () => {
  const response = await api.get("/rollouts");

  return response.data;
};

// ============================================================
// GET ROLLOUT BY ID
// GET /api/rollouts/{rollout_id}
// ============================================================

export const getRolloutById = async (
  rolloutId: number
) => {
  const response = await api.get(
    `/rollouts/${rolloutId}`
  );

  return response.data;
};

// ============================================================
// CREATE ROLLOUT
// POST /api/rollouts
// ============================================================

export const createRollout = async (
  data: CreateRolloutRequest
) => {
  const response = await api.post(
    "/rollouts",
    data
  );

  return response.data;
};

// ============================================================
// UPDATE ROLLOUT
// PUT /api/rollouts/{rollout_id}
// ============================================================

export const updateRollout = async (
  rolloutId: number,
  data: UpdateRolloutRequest
) => {
  const response = await api.put(
    `/rollouts/${rolloutId}`,
    data
  );

  return response.data;
};

// ============================================================
// DELETE ROLLOUT
// DELETE /api/rollouts/{rollout_id}
// ============================================================

export const deleteRollout = async (
  rolloutId: number
) => {
  const response = await api.delete(
    `/rollouts/${rolloutId}`
  );

  return response.data;
};