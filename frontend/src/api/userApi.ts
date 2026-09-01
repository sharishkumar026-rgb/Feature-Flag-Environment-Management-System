import api from "./axios";

// ============================================================
// TYPES
// ============================================================

export interface User {
  id: number;
  name: string;
  email: string;
  role_id?: number;
  role?: {
    id?: number;
    name?: string;
  };
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  role_id?: number;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  password?: string;
  role_id?: number;
  is_active?: boolean;
}

// ============================================================
// GET ALL USERS
// GET /api/users
// ============================================================

export const getUsers = async () => {
  const response = await api.get("/users");

  return response.data;
};

// ============================================================
// GET USER BY ID
// GET /api/users/{user_id}
// ============================================================

export const getUserById = async (
  userId: number
) => {
  const response = await api.get(
    `/users/${userId}`
  );

  return response.data;
};

// ============================================================
// CREATE USER
// POST /api/users
// ============================================================

export const createUser = async (
  data: CreateUserRequest
) => {
  const response = await api.post(
    "/users",
    data
  );

  return response.data;
};

// ============================================================
// UPDATE USER
// PUT /api/users/{user_id}
// ============================================================

export const updateUser = async (
  userId: number,
  data: UpdateUserRequest
) => {
  const response = await api.put(
    `/users/${userId}`,
    data
  );

  return response.data;
};

// ============================================================
// DELETE USER
// DELETE /api/users/{user_id}
// ============================================================

export const deleteUser = async (
  userId: number
) => {
  const response = await api.delete(
    `/users/${userId}`
  );

  return response.data;
};