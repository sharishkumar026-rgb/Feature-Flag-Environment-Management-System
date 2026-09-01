
import React from "react";

// ============================================================
// TYPES
// ============================================================

export interface Rollout {
  id: number;
  feature_id: number;
  environment_id: number;
  percentage: number;

  is_active?: boolean;

  feature_name?: string;
  environment_name?: string;

  created_by_id?: number;
  created_at?: string;
  updated_at?: string;
}

interface RolloutTableProps {
  rollouts: Rollout[];
  loading?: boolean;

  onEdit: (rollout: Rollout) => void;
  onView: (rollout: Rollout) => void;
  onDelete: (rollout: Rollout) => void | Promise<void>;
}

// ============================================================
// COMPONENT
// ============================================================

const RolloutTable: React.FC<RolloutTableProps> = ({
  rollouts,
  loading = false,
  onEdit,
  onView,
  onDelete,
}) => {
  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />

          <p className="text-sm font-medium text-gray-500">
            Loading rollouts...
          </p>
        </div>
      </div>
    );
  }

  // ==========================================================
  // EMPTY
  // ==========================================================

  if (rollouts.length === 0) {
    return (
      <div className="flex min-h-[300px] items-center justify-center px-6 py-10">
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
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>

          <h3 className="mt-4 text-base font-semibold text-gray-900">
            No rollouts found
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            There are no rollout records available.
          </p>
        </div>
      </div>
    );
  }

  // ==========================================================
  // HELPERS
  // ==========================================================

  const formatDate = (
    value?: string
  ): string => {
    if (!value) {
      return "-";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return date.toLocaleString();
  };

  const getPercentage = (
    percentage: number
  ): number => {
    if (Number.isNaN(percentage)) {
      return 0;
    }

    return Math.min(
      100,
      Math.max(0, percentage)
    );
  };

  const getStatus = (
    rollout: Rollout
  ): {
    label: string;
    className: string;
  } => {
    if (rollout.is_active === false) {
      return {
        label: "Inactive",
        className:
          "bg-gray-100 text-gray-700",
      };
    }

    return {
      label: "Active",
      className:
        "bg-green-100 text-green-700",
    };
  };

  // ==========================================================
  // UI
  // ==========================================================

  return (
    <div className="w-full overflow-hidden rounded-2xl">
      {/* ======================================================
          DESKTOP TABLE
      ======================================================= */}

      <div className="hidden overflow-x-auto md:block">
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
                Feature
              </th>

              <th
                scope="col"
                className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500"
              >
                Environment
              </th>

              <th
                scope="col"
                className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500"
              >
                Rollout
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

          <tbody className="divide-y divide-gray-100 bg-white">
            {rollouts.map((rollout) => {
              const percentage =
                getPercentage(
                  rollout.percentage
                );

              const status =
                getStatus(rollout);

              return (
                <tr
                  key={rollout.id}
                  className="transition hover:bg-gray-50"
                >
                  {/* ID */}
                  <td className="whitespace-nowrap px-6 py-4">
                    <span className="text-sm font-semibold text-gray-700">
                      #{rollout.id}
                    </span>
                  </td>

                  {/* Feature */}
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {rollout.feature_name ||
                          `Feature #${rollout.feature_id}`}
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        Feature ID:{" "}
                        {rollout.feature_id}
                      </p>
                    </div>
                  </td>

                  {/* Environment */}
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {rollout.environment_name ||
                          `Environment #${rollout.environment_id}`}
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        Environment ID:{" "}
                        {rollout.environment_id}
                      </p>
                    </div>
                  </td>

                  {/* Percentage */}
                  <td className="px-6 py-4">
                    <div className="w-40">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-sm font-semibold text-gray-900">
                          {percentage}%
                        </span>
                      </div>

                      <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                        <div
                          className="h-full rounded-full bg-blue-600 transition-all"
                          style={{
                            width: `${percentage}%`,
                          }}
                        />
                      </div>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="whitespace-nowrap px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${status.className}`}
                    >
                      {status.label}
                    </span>
                  </td>

                  {/* Created */}
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {formatDate(
                      rollout.created_at
                    )}
                  </td>

                  {/* Actions */}
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      {/* View */}
                      <button
                        type="button"
                        onClick={() =>
                          onView(rollout)
                        }
                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition hover:bg-blue-50 hover:text-blue-600"
                        title="View rollout"
                        aria-label="View rollout"
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

                      {/* Edit */}
                      <button
                        type="button"
                        onClick={() =>
                          onEdit(rollout)
                        }
                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition hover:bg-yellow-50 hover:text-yellow-600"
                        title="Edit rollout"
                        aria-label="Edit rollout"
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

                      {/* Delete */}
                      <button
                        type="button"
                        onClick={() =>
                          onDelete(rollout)
                        }
                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition hover:bg-red-50 hover:text-red-600"
                        title="Delete rollout"
                        aria-label="Delete rollout"
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
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3m-4 0h14"
                          />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ======================================================
          MOBILE CARDS
      ======================================================= */}

      <div className="space-y-4 p-4 md:hidden">
        {rollouts.map((rollout) => {
          const percentage =
            getPercentage(
              rollout.percentage
            );

          const status =
            getStatus(rollout);

          return (
            <div
              key={rollout.id}
              className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                    Rollout #{rollout.id}
                  </p>

                  <h3 className="mt-1 text-base font-bold text-gray-900">
                    {rollout.feature_name ||
                      `Feature #${rollout.feature_id}`}
                  </h3>
                </div>

                <span
                  className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${status.className}`}
                >
                  {status.label}
                </span>
              </div>

              {/* Details */}
              <div className="mt-5 space-y-4">
                <div>
                  <p className="text-xs font-medium text-gray-500">
                    Environment
                  </p>

                  <p className="mt-1 text-sm font-semibold text-gray-900">
                    {rollout.environment_name ||
                      `Environment #${rollout.environment_id}`}
                  </p>
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-xs font-medium text-gray-500">
                      Rollout Percentage
                    </p>

                    <p className="text-sm font-bold text-gray-900">
                      {percentage}%
                    </p>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                    <div
                      className="h-full rounded-full bg-blue-600"
                      style={{
                        width: `${percentage}%`,
                      }}
                    />
                  </div>
                </div>

                <div>
                  <p className="text-xs font-medium text-gray-500">
                    Created
                  </p>

                  <p className="mt-1 text-sm text-gray-700">
                    {formatDate(
                      rollout.created_at
                    )}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-5 flex gap-2 border-t border-gray-100 pt-4">
                <button
                  type="button"
                  onClick={() =>
                    onView(rollout)
                  }
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-200 px-3 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
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

                  View
                </button>

                <button
                  type="button"
                  onClick={() =>
                    onEdit(rollout)
                  }
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-200 px-3 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
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
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5"
                    />

                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"
                    />
                  </svg>

                  Edit
                </button>

                <button
                  type="button"
                  onClick={() =>
                    onDelete(rollout)
                  }
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-red-200 text-red-600 transition hover:bg-red-50"
                  title="Delete rollout"
                  aria-label="Delete rollout"
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
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3m-4 0h14"
                    />
                  </svg>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RolloutTable;

