
import React, { useEffect, useState } from "react";

import RoleTable from "../../components/roles/RoleTable";
import RoleForm from "../../components/roles/RoleForm";

import {
  getRoles,
  deleteRole,
} from "../../api/roleApi";

// ============================================================
// TYPES
// ============================================================

interface Role {
  id: number;
  name: string;
  description?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

// ============================================================
// COMPONENT
// ============================================================

const Roles: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);

  const [selectedRole, setSelectedRole] =
    useState<Role | null>(null);

  // ==========================================================
  // GET ROLES
  // ==========================================================

  const loadRoles = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getRoles();

      console.log("Roles API response:", response);

      /*
       * Supports these backend response formats:
       *
       * 1. [...]
       * 2. { roles: [...] }
       * 3. { data: [...] }
       * 4. { data: { roles: [...] } }
       */

      if (Array.isArray(response)) {
        setRoles(response);
        return;
      }

      if (Array.isArray(response?.roles)) {
        setRoles(response.roles);
        return;
      }

      if (Array.isArray(response?.data)) {
        setRoles(response.data);
        return;
      }

      if (
        response?.data &&
        Array.isArray(response.data.roles)
      ) {
        setRoles(response.data.roles);
        return;
      }

      setRoles([]);
    } catch (err: any) {
      console.error(
        "Failed to load roles:",
        err
      );

      const message =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        err?.message ||
        "Failed to load roles.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================================
  // INITIAL LOAD
  // ==========================================================

  useEffect(() => {
    loadRoles();
  }, []);

  // ==========================================================
  // ADD ROLE
  // ==========================================================

  const handleAddRole = () => {
    setSelectedRole(null);
    setShowForm(true);
    setError("");
  };

  // ==========================================================
  // EDIT ROLE
  // ==========================================================

  const handleEditRole = (role: Role) => {
    setSelectedRole(role);
    setShowForm(true);
    setError("");
  };

  // ==========================================================
  // DELETE ROLE
  // ==========================================================

  const handleDeleteRole = async (
    role: Role
  ): Promise<void> => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${role.name}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await deleteRole(role.id);

      await loadRoles();
    } catch (err: any) {
      console.error(
        "Failed to delete role:",
        err
      );

      const message =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        err?.message ||
        "Failed to delete role.";

      setError(message);
    }
  };

  // ==========================================================
  // FORM SUCCESS
  // ==========================================================

  const handleFormSuccess = async () => {
    setShowForm(false);
    setSelectedRole(null);

    await loadRoles();
  };

  // ==========================================================
  // FORM CANCEL
  // ==========================================================

  const handleFormCancel = () => {
    setShowForm(false);
    setSelectedRole(null);
    setError("");
  };

  // ==========================================================
  // MODAL BACKDROP
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
            Roles
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage application roles and permissions
          </p>
        </div>

        <button
          type="button"
          onClick={handleAddRole}
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

          Add Role
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
              d="M12 9v2m0 4h.01M10.29 3.86l-7.5 13A2 2 0 0012 9a2 2 0 001.71 1l7.5 13A2 2 0 0018.5 21H5.5a2 2 0 00-1.71-3z"
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
          ROLES TABLE
      ====================================================== */}

      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">

        <RoleTable
          roles={roles}
          loading={loading}
          onEdit={handleEditRole}
          onDelete={handleDeleteRole}
        />

      </div>

      {/* ======================================================
          ROLE FORM MODAL
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

            <RoleForm
              role={selectedRole ?? undefined}
              onSuccess={handleFormSuccess}
              onCancel={handleFormCancel}
            />

          </div>

        </div>
      )}

    </div>
  );
};

export default Roles;

