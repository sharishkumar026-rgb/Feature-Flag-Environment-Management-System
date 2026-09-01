import React from "react";

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

interface UserTableProps {
  users: User[];
  loading?: boolean;
  error?: string;
  onEdit?: (user: User) => void;
  onDelete?: (user: User) => void;
  onView?: (user: User) => void;
}

const UserTable: React.FC<UserTableProps> = ({
  users,
  loading = false,
  error = "",
  onEdit,
  onDelete,
  onView,
}) => {
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

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // ============================================================
  // GET ROLE NAME
  // ============================================================

  const getRoleName = (user: User) => {
    if (user.role?.name) {
      return user.role.name;
    }

    if (user.role_id) {
      return `Role ${user.role_id}`;
    }

    return "User";
  };

  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return (
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="flex h-20 items-center justify-center">
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <svg
              className="h-5 w-5 animate-spin text-blue-600"
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

            Loading users...
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
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-100">
            <svg
              className="h-5 w-5 text-red-600"
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
          </div>

          <div>
            <h3 className="text-sm font-semibold text-red-800">
              Unable to load users
            </h3>

            <p className="mt-1 text-sm text-red-700">
              {error}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================
  // EMPTY STATE
  // ============================================================

  if (users.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white px-6 py-12 text-center shadow-sm">
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
              d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zm11 10v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"
            />
          </svg>
        </div>

        <h3 className="mt-4 text-sm font-semibold text-gray-900">
          No users found
        </h3>

        <p className="mt-1 text-sm text-gray-500">
          There are no users available to display.
        </p>
      </div>
    );
  }

  // ============================================================
  // TABLE
  // ============================================================

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      {/* ========================================================
          TABLE HEADER
      ========================================================= */}

      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-gray-900">
              Users
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {users.length}{" "}
              {users.length === 1 ? "user" : "users"} found
            </p>
          </div>
        </div>
      </div>

      {/* ========================================================
          RESPONSIVE TABLE
      ========================================================= */}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          {/* ====================================================
              HEAD
          ===================================================== */}

          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500"
              >
                User
              </th>

              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500"
              >
                Email
              </th>

              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500"
              >
                Role
              </th>

              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500"
              >
                Status
              </th>

              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500"
              >
                Created
              </th>

              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500"
              >
                Actions
              </th>
            </tr>
          </thead>

          {/* ====================================================
              BODY
          ===================================================== */}

          <tbody className="divide-y divide-gray-100 bg-white">
            {users.map((user) => (
              <tr
                key={user.id}
                className="transition hover:bg-gray-50"
              >
                {/* ==================================================
                    USER
                =================================================== */}

                <td className="whitespace-nowrap px-6 py-4">
                  <div className="flex items-center gap-3">
                    {/* Avatar */}

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-sm font-bold text-blue-700">
                      {user.name
                        ?.charAt(0)
                        ?.toUpperCase() || "U"}
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {user.name || "-"}
                      </p>

                      <p className="mt-0.5 text-xs text-gray-500">
                        ID: #{user.id}
                      </p>
                    </div>
                  </div>
                </td>

                {/* ==================================================
                    EMAIL
                =================================================== */}

                <td className="whitespace-nowrap px-6 py-4">
                  <span className="text-sm text-gray-600">
                    {user.email || "-"}
                  </span>
                </td>

                {/* ==================================================
                    ROLE
                =================================================== */}

                <td className="whitespace-nowrap px-6 py-4">
                  <span className="inline-flex items-center rounded-lg bg-purple-50 px-2.5 py-1 text-xs font-medium text-purple-700">
                    {getRoleName(user)}
                  </span>
                </td>

                {/* ==================================================
                    STATUS
                =================================================== */}

                <td className="whitespace-nowrap px-6 py-4">
                  {user.is_active ? (
                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700">
                      <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                      Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                      <span className="h-1.5 w-1.5 rounded-full bg-gray-400" />
                      Inactive
                    </span>
                  )}
                </td>

                {/* ==================================================
                    CREATED
                =================================================== */}

                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                  {formatDate(user.created_at)}
                </td>

                {/* ==================================================
                    ACTIONS
                =================================================== */}

                <td className="whitespace-nowrap px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    {/* View */}

                    {onView && (
                      <button
                        type="button"
                        onClick={() => onView(user)}
                        title="View user"
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
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
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />

                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      </button>
                    )}

                    {/* Edit */}

                    {onEdit && (
                      <button
                        type="button"
                        onClick={() => onEdit(user)}
                        title="Edit user"
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
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
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"
                          />
                        </svg>
                      </button>
                    )}

                    {/* Delete */}

                    {onDelete && (
                      <button
                        type="button"
                        onClick={() => onDelete(user)}
                        title="Delete user"
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
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
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3m-9 0h12"
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

export default UserTable;