import api from "./axios";

// ============================================================
// TYPES
// ============================================================

export interface Assignment {
  id: number;
  user_id: number;
  feature_id: number;
  environment_id: number;
  is_enabled: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CreateAssignmentRequest {
  user_id: number;
  feature_id: number;
  environment_id: number;
  is_enabled: boolean;
}

export interface UpdateAssignmentRequest {
  user_id?: number;
  feature_id?: number;
  environment_id?: number;
  is_enabled?: boolean;
}

// ============================================================
// GET ALL ASSIGNMENTS
// GET /api/assignments
// ============================================================

export const getAssignments = async () => {
  const response = await api.get("/assignments");

  return response.data;
};

// ============================================================
// GET ASSIGNMENT BY ID
// GET /api/assignments/{assignment_id}
// ============================================================

export const getAssignmentById = async (
  assignmentId: number
) => {
  const response = await api.get(
    `/assignments/${assignmentId}`
  );

  return response.data;
};

// ============================================================
// CREATE ASSIGNMENT
// POST /api/assignments
// ============================================================

export const createAssignment = async (
  data: CreateAssignmentRequest
) => {
  const response = await api.post(
    "/assignments",
    data
  );

  return response.data;
};

// ============================================================
// UPDATE ASSIGNMENT
// PUT /api/assignments/{assignment_id}
// ============================================================

export const updateAssignment = async (
  assignmentId: number,
  data: UpdateAssignmentRequest
) => {
  const response = await api.put(
    `/assignments/${assignmentId}`,
    data
  );

  return response.data;
};

// ============================================================
// DELETE ASSIGNMENT
// DELETE /api/assignments/{assignment_id}
// ============================================================

export const deleteAssignment = async (
  assignmentId: number
) => {
  const response = await api.delete(
    `/assignments/${assignmentId}`
  );

  return response.data;
};