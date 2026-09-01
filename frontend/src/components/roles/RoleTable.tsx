
import React from "react";

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

interface RoleTableProps {
  roles: Role[];
  loading?: boolean;
  onEdit?: (role: Role) => void;
  onDelete?: (role: Role) => void;
  onView?: (role: Role) => void;
}

// ============================================================
// COMPONENT
// ============================================================

const RoleTable: React.FC<RoleTableProps> = ({
  roles,
  loading = false,
  onEdit,
  onDelete,
  onView,
}) => {
  // ==========================================================
  // DATE FORMATTER
  // ==========================================================

  const formatDate = (
    date?: string
  ): string => {
    if (!date) {
      return "-";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <div className="text-center">

          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />

          <p className="mt-3 text-sm text-gray-500">
            Loading roles...
          </p>

        </div>
      </div>
    );
  }

  // ==========================================================
  // EMPTY STATE
  // ==========================================================

  if (roles.length === 0) {
    return (
      <div className="flex min-h-[300px] items-center justify-center px-6">
        <div className="text-center">

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
                d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2m8-8a4 4 0 100-8 4 4 0 000 8zm8-2v6m3-3h-6"
              />
            </svg>

          </div>

          <h3 className="mt-4 text-base font-semibold text-gray-900">
            No roles found
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            Create a role to get started.
          </p>

        </div>
      </div>
    );
  }

  // ==========================================================
  // TABLE
  // ==========================================================

  return (
    <div className="w-full overflow-hidden rounded-2xl">

      {/* ======================================================
          TABLE HEADER
      ====================================================== */}

      <div className="border-b border-gray-200 px-6 py-5">

        <div className="flex items-center justify-between">

          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Roles
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {roles.length}{" "}
              {roles.length === 1
                ? "role"
                : "roles"}{" "}
              available
            </p>
          </div>

        </div>

      </div>

      {/* ======================================================
          RESPONSIVE TABLE
      ====================================================== */}

      <div className="overflow-x-auto">

        <table className="min-w-full divide-y divide-gray-200">

          <thead className="bg-gray-50">

            <tr>

              <th
                scope="col"
                className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500"
              >
                ID
              </th>

              <th
                scope="col"
                className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500"
              >
                Role
              </th>

              <th
                scope="col"
                className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500"
              >
                Description
              </th>

              <th
                scope="col"
                className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500"
              >
                Status
              </th>

              <th
                scope="col"
                className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500"
              >
                Created
              </th>

              <th
                scope="col"
                className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-500"
              >
                Actions
              </th>

            </tr>

          </thead>

          <tbody className="divide-y divide-gray-200 bg-white">

            {roles.map((role) => (

              <tr
                key={role.id}
                className="transition hover:bg-gray-50"
              >

                {/* ID */}

                <td className="whitespace-nowrap px-6 py-4">

                  <span className="text-sm font-medium text-gray-700">
                    #{role.id}
                  </span>

                </td>

                {/* ROLE */}

                <td className="whitespace-nowrap px-6 py-4">

                  <div className="flex items-center">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">

                      <svg
                        className="h-5 w-5 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 15l8-5-8-5-8 5 8 5z"
                        />

                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 12v5l8 5 8-5v-5"
                        />
                      </svg>

                    </div>

                    <div className="ml-3">

                      <p className="text-sm font-semibold text-gray-900">
                        {role.name}
                      </p>

                    </div>

                  </div>

                </td>

                {/* DESCRIPTION */}

                <td className="max-w-xs px-6 py-4">

                  <p
                    className="truncate text-sm text-gray-600"
                    title={
                      role.description || ""
                    }
                  >
                    {role.description || "-"}
                  </p>

                </td>

                {/* STATUS */}

                <td className="whitespace-nowrap px-6 py-4">

                  {role.is_active !== false ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">

                      <span className="h-1.5 w-1.5 rounded-full bg-green-500" />

                      Active

                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">

                      <span className="h-1.5 w-1.5 rounded-full bg-gray-400" />

                      Inactive

                    </span>
                  )}

                </td>

                {/* CREATED */}

                <td className="whitespace-nowrap px-6 py-4">

                  <span className="text-sm text-gray-600">
                    {formatDate(
                      role.created_at
                    )}
                  </span>

                </td>

                {/* ACTIONS */}

                <td className="whitespace-nowrap px-6 py-4">

                  <div className="flex items-center justify-end gap-2">

                    {/* VIEW */}

                    {onView && (
                      <button
                        type="button"
                        onClick={() =>
                          onView(role)
                        }
                        className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
                        title="View role"
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
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />

                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 15a3 3 0 100-6 3 3 0 000 6z"
                          />
                        </svg>
                      </button>
                    )}

                    {/* EDIT */}

                    {onEdit && (
                      <button
                        type="button"
                        onClick={() =>
                          onEdit(role)
                        }
                        className="rounded-lg p-2 text-blue-500 transition hover:bg-blue-50 hover:text-blue-700"
                        title="Edit role"
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
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.5-9.5a2.121 2.121 0 013 3L12 14l-4 1 1-4 8.5-8.5z"
                          />
                        </svg>
                      </button>
                    )}

                    {/* DELETE */}

                    {onDelete && (
                      <button
                        type="button"
                        onClick={() =>
                          onDelete(role)
                        }
                        className="rounded-lg p-2 text-red-500 transition hover:bg-red-50 hover:text-red-700"
                        title="Delete role"
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
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3m-7 0h10"
                          />
                        </svg>
                      </button>
                    )}

                  </div>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
};

export default RoleTable;

