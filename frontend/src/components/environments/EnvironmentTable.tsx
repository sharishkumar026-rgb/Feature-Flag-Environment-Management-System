
import React from "react";

// ============================================================
// TYPES
// ============================================================

export interface Environment {
  id: number;
  name: string;
  key?: string;
  description?: string;
  is_active?: boolean;
  created_by_id?: number;
  created_at?: string;
  updated_at?: string;
}

interface EnvironmentTableProps {
  environments: Environment[];
  loading: boolean;
  onEdit: (environment: Environment) => void;
  onDelete: (
    environment: Environment
  ) => void | Promise<void>;
  onView: (environment: Environment) => void;
}

// ============================================================
// COMPONENT
// ============================================================

const EnvironmentTable: React.FC<
  EnvironmentTableProps
> = ({
  environments,
  loading,
  onEdit,
  onDelete,
  onView,
}) => {

  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">

        <div className="flex flex-col items-center">

          <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />

          <p className="mt-4 text-sm text-gray-500">
            Loading environments...
          </p>

        </div>

      </div>
    );
  }

  // ==========================================================
  // EMPTY STATE
  // ==========================================================

  if (environments.length === 0) {
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
                d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-4h6v4"
              />

            </svg>

          </div>

          <h3 className="mt-4 text-base font-semibold text-gray-900">
            No environments found
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            There are no environments available.
          </p>

        </div>

      </div>
    );
  }

  // ==========================================================
  // FORMAT DATE
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
  // UI
  // ==========================================================

  return (
    <div className="w-full overflow-hidden">

      {/* ====================================================
          TABLE HEADER
      ==================================================== */}

      <div className="border-b border-gray-200 px-6 py-5">

        <div className="flex flex-col gap-1">

          <h2 className="text-lg font-bold text-gray-900">
            Environments
          </h2>

          <p className="text-sm text-gray-500">
            Manage application environments
          </p>

        </div>

      </div>

      {/* ====================================================
          TABLE
      ==================================================== */}

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
                Name
              </th>

              <th
                scope="col"
                className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500"
              >
                Key
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

            {environments.map(
              (environment) => (
                <tr
                  key={environment.id}
                  className="transition hover:bg-gray-50"
                >

                  {/* ID */}

                  <td className="whitespace-nowrap px-6 py-4">

                    <span className="text-sm font-medium text-gray-700">
                      #{environment.id}
                    </span>

                  </td>

                  {/* NAME */}

                  <td className="whitespace-nowrap px-6 py-4">

                    <div className="flex items-center gap-3">

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
                            d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-4h6v4"
                          />

                        </svg>

                      </div>

                      <div>

                        <p className="text-sm font-semibold text-gray-900">
                          {environment.name}
                        </p>

                      </div>

                    </div>

                  </td>

                  {/* KEY */}

                  <td className="whitespace-nowrap px-6 py-4">

                    {environment.key ? (
                      <code className="rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">
                        {environment.key}
                      </code>
                    ) : (
                      <span className="text-sm text-gray-400">
                        -
                      </span>
                    )}

                  </td>

                  {/* DESCRIPTION */}

                  <td className="max-w-xs px-6 py-4">

                    <p className="truncate text-sm text-gray-600">
                      {environment.description ||
                        "-"}
                    </p>

                  </td>

                  {/* STATUS */}

                  <td className="whitespace-nowrap px-6 py-4">

                    {environment.is_active !== false ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">

                        <span className="h-1.5 w-1.5 rounded-full bg-green-500" />

                        Active

                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700">

                        <span className="h-1.5 w-1.5 rounded-full bg-red-500" />

                        Inactive

                      </span>
                    )}

                  </td>

                  {/* CREATED */}

                  <td className="whitespace-nowrap px-6 py-4">

                    <span className="text-sm text-gray-600">
                      {formatDate(
                        environment.created_at
                      )}
                    </span>

                  </td>

                  {/* ACTIONS */}

                  <td className="whitespace-nowrap px-6 py-4">

                    <div className="flex items-center justify-end gap-2">

                      {/* VIEW */}

                      <button
                        type="button"
                        onClick={() =>
                          onView(environment)
                        }
                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition hover:bg-blue-50 hover:text-blue-600"
                        title="View environment"
                        aria-label="View environment"
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
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />

                        </svg>

                      </button>

                      {/* EDIT */}

                      <button
                        type="button"
                        onClick={() =>
                          onEdit(environment)
                        }
                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition hover:bg-yellow-50 hover:text-yellow-600"
                        title="Edit environment"
                        aria-label="Edit environment"
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
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5"
                          />

                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"
                          />

                        </svg>

                      </button>

                      {/* DELETE */}

                      <button
                        type="button"
                        onClick={() =>
                          onDelete(environment)
                        }
                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition hover:bg-red-50 hover:text-red-600"
                        title="Delete environment"
                        aria-label="Delete environment"
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
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3m-9 0h14"
                          />

                        </svg>

                      </button>

                    </div>

                  </td>

                </tr>
              )
            )}

          </tbody>

        </table>

      </div>

    </div>
  );
};

export default EnvironmentTable;

