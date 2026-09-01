import React, { useEffect, useState } from "react";
import { getRoleById } from "../../api/roleApi";

interface Role {
  id: number;
  name: string;
  description?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

interface RoleDetailsProps {
  roleId: number;
  onBack?: () => void;
  onEdit?: (role: Role) => void;
}

const RoleDetails: React.FC<RoleDetailsProps> = ({
  roleId,
  onBack,
  onEdit,
}) => {
  const [role, setRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ============================================================
  // FETCH ROLE
  // GET /api/roles/{role_id}
  // ============================================================

  const fetchRole = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getRoleById(roleId);

      const roleData =
        response?.data ||
        response?.role ||
        response;

      setRole(roleData);
    } catch (err: any) {
      const message =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        err?.message ||
        "Failed to retrieve role details.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (roleId) {
      fetchRole();
    }
  }, [roleId]);

  // ============================================================
  // FORMAT DATE
  // ============================================================

  const formatDate = (date?: string) => {
    if (!date) {
      return "-";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "-";
    }

    return parsedDate.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <svg
              className="h-8 w-8 animate-spin text-purple-600"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />

              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>

            <p className="text-sm text-gray-500">
              Loading role details...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================
  // ERROR
  // ============================================================

  if (error) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-4">
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
              d="M12 9v2m0 4h.01M10.29 3.86l-7.5 13A2 2 0 004.53 18h14.94a2 2 0 001.74-3l-7.5-13a2 2 0 00-3.42 0z"
            />
          </svg>

          <div>
            <p className="text-sm font-medium text-red-800">
              Unable to load role
            </p>

            <p className="mt-1 text-sm text-red-700">
              {error}
            </p>
          </div>
        </div>

        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="mt-5 rounded-xl border border-gray-300 bg-white px-5 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            ← Back to Roles
          </button>
        )}
      </div>
    );
  }

  // ============================================================
  // ROLE NOT FOUND
  // ============================================================

  if (!role) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100">
          <svg
            className="h-7 w-7 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 13h6m-3-3v6m-8 5h16a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z"
            />
          </svg>
        </div>

        <h3 className="mt-4 text-base font-semibold text-gray-900">
          Role not found
        </h3>

        <p className="mt-1 text-sm text-gray-500">
          The requested role could not be found.
        </p>

        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="mt-5 rounded-xl bg-purple-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-purple-700"
          >
            Back to Roles
          </button>
        )}
      </div>
    );
  }

  // ============================================================
  // UI
  // ============================================================

  return (
    <div className="space-y-6">

      {/* ========================================================
          TOP HEADER
      ========================================================= */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div className="flex items-center gap-3">

          {onBack && (
            <button
              type="button"
              onClick={onBack}
              title="Back"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 transition hover:bg-gray-50 hover:text-gray-900"
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
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
          )}

          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">
                Role Details
              </h1>

              {role.is_active ? (
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                  Active
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-gray-400" />
                  Inactive
                </span>
              )}
            </div>

            <p className="mt-1 text-sm text-gray-500">
              View complete information about this role.
            </p>
          </div>
        </div>

        {onEdit && (
          <button
            type="button"
            onClick={() => onEdit(role)}
            className="flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-purple-700 focus:outline-none focus:ring-4 focus:ring-purple-100"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1-9.5-9.5z"
              />
            </svg>

            Edit Role
          </button>
        )}
      </div>

      {/* ========================================================
          ROLE PROFILE CARD
      ========================================================= */}

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

        <div className="border-b border-gray-200 bg-gradient-to-r from-purple-50 to-white px-6 py-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">

            {/* ROLE ICON */}

            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-purple-100 text-3xl font-bold text-purple-700">
              {role.name?.charAt(0)?.toUpperCase() || "R"}
            </div>

            {/* ROLE INFO */}

            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {role.name || "-"}
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Role ID: #{role.id}
              </p>

              <div className="mt-3">
                {role.is_active ? (
                  <span className="inline-flex items-center gap-2 rounded-lg bg-green-100 px-3 py-1.5 text-xs font-semibold text-green-700">
                    <span className="h-2 w-2 rounded-full bg-green-500" />
                    Active Role
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-600">
                    <span className="h-2 w-2 rounded-full bg-gray-400" />
                    Inactive Role
                  </span>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* ======================================================
            DETAILS
        ======================================================= */}

        <div className="p-6">

          <h3 className="mb-5 text-base font-semibold text-gray-900">
            Role Information
          </h3>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

            {/* ROLE NAME */}

            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                Role Name
              </p>

              <p className="mt-2 text-sm font-semibold text-gray-900">
                {role.name || "-"}
              </p>
            </div>

            {/* ROLE ID */}

            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                Role ID
              </p>

              <p className="mt-2 text-sm font-semibold text-gray-900">
                #{role.id}
              </p>
            </div>

            {/* STATUS */}

            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                Status
              </p>

              <div className="mt-2">
                {role.is_active ? (
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                    Active
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
                    <span className="h-1.5 w-1.5 rounded-full bg-gray-400" />
                    Inactive
                  </span>
                )}
              </div>
            </div>

            {/* CREATED */}

            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                Created At
              </p>

              <p className="mt-2 text-sm font-semibold text-gray-900">
                {formatDate(role.created_at)}
              </p>
            </div>

            {/* UPDATED */}

            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                Updated At
              </p>

              <p className="mt-2 text-sm font-semibold text-gray-900">
                {formatDate(role.updated_at)}
              </p>
            </div>

          </div>

          {/* ====================================================
              DESCRIPTION
          ===================================================== */}

          <div className="mt-5 rounded-xl border border-gray-200 bg-white p-5">

            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Description
            </p>

            <p className="mt-3 text-sm leading-6 text-gray-700">
              {role.description ||
                "No description has been provided for this role."}
            </p>

          </div>

        </div>
      </div>

      {/* ========================================================
          FOOTER ACTION
      ========================================================= */}

      {onBack && (
        <div className="flex justify-start">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-5 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>

            Back to Roles
          </button>
        </div>
      )}

    </div>
  );
};

export default RoleDetails;