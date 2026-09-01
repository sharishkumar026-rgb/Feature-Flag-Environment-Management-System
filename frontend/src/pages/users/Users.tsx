
import React, { useEffect, useState } from "react";

import UserTable from "../../components/users/UserTable";
import UserForm from "../../components/users/UserForm";

import {
  getUsers,
  deleteUser,
} from "../../api/userApi";

// ============================================================
// TYPES
// ============================================================

interface User {
  id: number;
  name: string;
  email: string;
  role_id?: number;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

// ============================================================
// COMPONENT
// ============================================================

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);

  const [selectedUser, setSelectedUser] =
    useState<User | null>(null);

  // ==========================================================
  // GET USERS
  // ==========================================================

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getUsers();

      console.log("Users API response:", response);

      /*
       * Supports these possible backend response formats:
       *
       * 1. Array
       * [
       *   {...},
       *   {...}
       * ]
       *
       * 2. { users: [...] }
       *
       * 3. { data: [...] }
       *
       * 4. { data: { users: [...] } }
       */

      if (Array.isArray(response)) {
        setUsers(response);
        return;
      }

      if (Array.isArray(response?.users)) {
        setUsers(response.users);
        return;
      }

      if (Array.isArray(response?.data)) {
        setUsers(response.data);
        return;
      }

      if (
        response?.data &&
        Array.isArray(response.data.users)
      ) {
        setUsers(response.data.users);
        return;
      }

      setUsers([]);
    } catch (err: any) {
      console.error(
        "Failed to load users:",
        err
      );

      const message =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        err?.message ||
        "Failed to load users.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================================
  // INITIAL LOAD
  // ==========================================================

  useEffect(() => {
    loadUsers();
  }, []);

  // ==========================================================
  // ADD USER
  // ==========================================================

  const handleAddUser = () => {
    setSelectedUser(null);
    setShowForm(true);
    setError("");
  };

  // ==========================================================
  // EDIT USER
  // ==========================================================

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setShowForm(true);
    setError("");
  };

  // ==========================================================
  // DELETE USER
  // ==========================================================

  const handleDeleteUser = async (
    user: User
  ): Promise<void> => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${user.name}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await deleteUser(user.id);

      await loadUsers();
    } catch (err: any) {
      console.error(
        "Failed to delete user:",
        err
      );

      const message =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        err?.message ||
        "Failed to delete user.";

      setError(message);
    }
  };

  // ==========================================================
  // FORM SUCCESS
  // ==========================================================

  const handleFormSuccess = async () => {
    setShowForm(false);
    setSelectedUser(null);

    await loadUsers();
  };

  // ==========================================================
  // FORM CANCEL
  // ==========================================================

  const handleFormCancel = () => {
    setShowForm(false);
    setSelectedUser(null);
    setError("");
  };

  // ==========================================================
  // CLOSE MODAL WHEN BACKDROP IS CLICKED
  // ==========================================================

  const handleBackdropClick = (
    event: React.MouseEvent<HTMLDivElement>
  ) => {
    if (event.target === event.currentTarget) {
      handleFormCancel();
    }
  };

  // ==========================================================
  // UI
  // ==========================================================

  return (
    <div className="space-y-6">

      {/* ======================================================
          PAGE HEADER
      ====================================================== */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Users
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage application users
          </p>
        </div>

        <button
          type="button"
          onClick={handleAddUser}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>

          Add User
        </button>

      </div>

      {/* ======================================================
          ERROR MESSAGE
      ====================================================== */}

      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3">

          <svg
            className="mt-0.5 h-5 w-5 shrink-0 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01M10.29 3.86l-7.5 13A1 1 0 003.66 18h16.68a2 2 0 001.74-1l-7.5-13a2 2 0 00-3.48 0l-7.5 13A2 2 0 003.66 18h16.68a2 2 0 001.74-1z"
            />
          </svg>

          <div className="flex-1">
            <p className="text-sm font-medium text-red-800">
              {error}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setError("")}
            className="text-red-500 transition hover:text-red-700"
            aria-label="Close error"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

        </div>
      )}

      {/* ======================================================
          USERS TABLE
      ====================================================== */}

      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">

        <UserTable
          users={users}
          loading={loading}
          onEdit={handleEditUser}
          onDelete={handleDeleteUser}
        />

      </div>

      {/* ======================================================
          USER FORM MODAL
      ====================================================== */}

      {showForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onMouseDown={handleBackdropClick}
        >

          <div
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
            onMouseDown={(event) =>
              event.stopPropagation()
            }
          >

            <UserForm
              user={selectedUser ?? undefined}
              onSuccess={handleFormSuccess}
              onCancel={handleFormCancel}
            />

          </div>

        </div>
      )}

    </div>
  );
};

export default Users;

