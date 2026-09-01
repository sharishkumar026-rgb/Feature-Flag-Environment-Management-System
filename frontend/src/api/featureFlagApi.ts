
import api from "./axios";

// ============================================================
// TYPES
// ============================================================

export interface FeatureFlag {
  id: number;
  name: string;
  key?: string;
  description?: string;
  is_enabled?: boolean;
  is_active?: boolean;
  created_by_id?: number;
  created_at?: string;
  updated_at?: string;
}

export interface CreateFeatureFlagRequest {
  name: string;
  key: string;
  description?: string;
  is_enabled?: boolean;
}

export interface UpdateFeatureFlagRequest {
  name?: string;
  key?: string;
  description?: string;
  is_enabled?: boolean;
}

// ============================================================
// GET ALL FEATURE FLAGS
// GET /api/feature-flags
// ============================================================

export const getFeatureFlags = async () => {
  const response = await api.get("/feature-flags");

  return response.data;
};

// ============================================================
// GET FEATURE FLAG BY ID
// GET /api/feature-flags/{feature_id}
// ============================================================

export const getFeatureFlagById = async (
  featureId: number
) => {
  const response = await api.get(
    `/feature-flags/${featureId}`
  );

  return response.data;
};

// ============================================================
// CREATE FEATURE FLAG
// POST /api/feature-flags
// ============================================================

export const createFeatureFlag = async (
  data: CreateFeatureFlagRequest
) => {
  const response = await api.post(
    "/feature-flags",
    data
  );

  return response.data;
};

// ============================================================
// UPDATE FEATURE FLAG
// PUT /api/feature-flags/{feature_id}
// ============================================================

export const updateFeatureFlag = async (
  featureId: number,
  data: UpdateFeatureFlagRequest
) => {
  const response = await api.put(
    `/feature-flags/${featureId}`,
    data
  );

  return response.data;
};

// ============================================================
// DELETE FEATURE FLAG
// DELETE /api/feature-flags/{feature_id}
// ============================================================

export const deleteFeatureFlag = async (
  featureId: number
) => {
  const response = await api.delete(
    `/feature-flags/${featureId}`
  );

  return response.data;
};

// ============================================================
// ENABLE FEATURE FLAG
// PATCH /api/feature-flags/{feature_id}/enable
// ============================================================

export const enableFeatureFlag = async (
  featureId: number
) => {
  const response = await api.patch(
    `/feature-flags/${featureId}/enable`
  );

  return response.data;
};

// ============================================================
// DISABLE FEATURE FLAG
// PATCH /api/feature-flags/{feature_id}/disable
// ============================================================

export const disableFeatureFlag = async (
  featureId: number
) => {
  const response = await api.patch(
    `/feature-flags/${featureId}/disable`
  );

  return response.data;
};

// ============================================================
// EVALUATE FEATURE FLAG FOR USER
// GET /api/feature-flags/{feature_id}/evaluate/{user_id}
// ============================================================

export const evaluateFeatureFlag = async (
  featureId: number,
  userId: number
) => {
  const response = await api.get(
    `/feature-flags/${featureId}/evaluate/${userId}`
  );

  return response.data;
};

