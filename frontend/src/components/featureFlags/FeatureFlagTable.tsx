
import React from "react";

import type {
  FeatureFlag,
} from "../../api/featureFlagApi";

// ============================================================
// PROPS
// ============================================================

interface FeatureFlagTableProps {
  featureFlags: FeatureFlag[];
  loading?: boolean;
  onEdit: (featureFlag: FeatureFlag) => void;
  onDelete: (featureFlag: FeatureFlag) => void;
  onView: (featureFlag: FeatureFlag) => void;
  onToggle?: (featureFlag: FeatureFlag) => void;
}

// ============================================================
// COMPONENT
// ============================================================

const FeatureFlagTable: React.FC<
  FeatureFlagTableProps
> = ({
  featureFlags,
  loading = false,
  onEdit,
  onDelete,
  onView,
  onToggle,
}) => {
  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center p-6">
        <div className="flex flex-col items-center gap-3">

          <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />

          <p className="text-sm text-gray-500">
            Loading feature flags...
          </p>

        </div>
      </div>
    );
  }

  // ==========================================================
  // EMPTY
  // ==========================================================

  if (featureFlags.length === 0) {
    return (
      <div className="flex min-h-[300px] items-center justify-center p-6">

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
                d="M12 4v16m8-8H4"
              />
            </svg>

          </div>

          <h3 className="mt-4 text-base font-semibold text-gray-900">
            No feature flags found
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            Create a feature flag to get started.
          </p>

        </div>

      </div>
    );
  }

  // ==========================================================
  // UI
  // ==========================================================

  return (
    <div className="w-full overflow-hidden">

      {/* ======================================================
          DESKTOP TABLE
      ======================================================= */}

      <div className="hidden overflow-x-auto md:block">

        <table className="min-w-full divide-y divide-gray-200">

          {/* ==================================================
              HEADER
          =================================================== */}

          <thead className="bg-gray-50">

            <tr>

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
                Key
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

          {/* ==================================================
              BODY
          =================================================== */}

          <tbody className="divide-y divide-gray-200 bg-white">

            {featureFlags.map(
              (featureFlag) => {

                const isEnabled =
                  featureFlag.is_enabled === true;

                return (
                  <tr
                    key={featureFlag.id}
                    className="transition hover:bg-gray-50"
                  >

                    {/* ======================================
                        FEATURE
                    ======================================= */}

                    <td className="whitespace-nowrap px-6 py-4">

                      <div>

                        <p className="text-sm font-semibold text-gray-900">
                          {featureFlag.name}
                        </p>

                        {featureFlag.description && (
                          <p className="mt-1 max-w-xs truncate text-xs text-gray-500">
                            {featureFlag.description}
                          </p>
                        )}

                      </div>

                    </td>

                    {/* ======================================
                        KEY
                    ======================================= */}

                    <td className="whitespace-nowrap px-6 py-4">

                      <code className="rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">
                        {featureFlag.key || "-"}
                      </code>

                    </td>

                    {/* ======================================
                        STATUS
                    ======================================= */}

                    <td className="whitespace-nowrap px-6 py-4">

                      <button
                        type="button"
                        onClick={() =>
                          onToggle?.(featureFlag)
                        }
                        disabled={!onToggle}
                        className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${
                          isEnabled
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-600"
                        } ${
                          onToggle
                            ? "cursor-pointer hover:opacity-80"
                            : "cursor-default"
                        }`}
                      >

                        <span
                          className={`h-2 w-2 rounded-full ${
                            isEnabled
                              ? "bg-green-500"
                              : "bg-gray-400"
                          }`}
                        />

                        {isEnabled
                          ? "Enabled"
                          : "Disabled"}

                      </button>

                    </td>

                    {/* ======================================
                        CREATED
                    ======================================= */}

                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">

                      {featureFlag.created_at
                        ? new Date(
                            featureFlag.created_at
                          ).toLocaleDateString()
                        : "-"}

                    </td>

                    {/* ======================================
                        ACTIONS
                    ======================================= */}

                    <td className="whitespace-nowrap px-6 py-4">

                      <div className="flex items-center justify-end gap-2">

                        {/* VIEW */}

                        <button
                          type="button"
                          onClick={() =>
                            onView(featureFlag)
                          }
                          className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
                          title="View feature flag"
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
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />

                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 15a3 3 0 100-6 3 3 0 000 6z"
                            />

                          </svg>

                        </button>

                        {/* EDIT */}

                        <button
                          type="button"
                          onClick={() =>
                            onEdit(featureFlag)
                          }
                          className="rounded-lg p-2 text-blue-500 transition hover:bg-blue-50 hover:text-blue-700"
                          title="Edit feature flag"
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
                            onDelete(featureFlag)
                          }
                          className="rounded-lg p-2 text-red-500 transition hover:bg-red-50 hover:text-red-700"
                          title="Delete feature flag"
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
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3m-7 0h8"
                            />

                          </svg>

                        </button>

                      </div>

                    </td>

                  </tr>
                );
              }
            )}

          </tbody>

        </table>

      </div>

      {/* ======================================================
          MOBILE CARDS
      ======================================================= */}

      <div className="space-y-4 p-4 md:hidden">

        {featureFlags.map(
          (featureFlag) => {

            const isEnabled =
              featureFlag.is_enabled === true;

            return (
              <div
                key={featureFlag.id}
                className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
              >

                {/* FEATURE */}

                <div className="flex items-start justify-between gap-3">

                  <div className="min-w-0">

                    <h3 className="truncate text-sm font-semibold text-gray-900">
                      {featureFlag.name}
                    </h3>

                    {featureFlag.description && (
                      <p className="mt-1 line-clamp-2 text-xs text-gray-500">
                        {featureFlag.description}
                      </p>
                    )}

                  </div>

                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${
                      isEnabled
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {isEnabled
                      ? "Enabled"
                      : "Disabled"}
                  </span>

                </div>

                {/* DETAILS */}

                <div className="mt-4 space-y-2">

                  <div className="flex items-center justify-between gap-3">

                    <span className="text-xs text-gray-500">
                      Key
                    </span>

                    <code className="max-w-[65%] truncate rounded bg-gray-100 px-2 py-1 text-xs text-gray-700">
                      {featureFlag.key || "-"}
                    </code>

                  </div>

                  <div className="flex items-center justify-between gap-3">

                    <span className="text-xs text-gray-500">
                      Created
                    </span>

                    <span className="text-xs text-gray-700">
                      {featureFlag.created_at
                        ? new Date(
                            featureFlag.created_at
                          ).toLocaleDateString()
                        : "-"}
                    </span>

                  </div>

                </div>

                {/* ACTIONS */}

                <div className="mt-4 flex items-center justify-end gap-2 border-t border-gray-100 pt-3">

                  <button
                    type="button"
                    onClick={() =>
                      onView(featureFlag)
                    }
                    className="rounded-lg px-3 py-2 text-xs font-medium text-gray-600 hover:bg-gray-100"
                  >
                    View
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      onEdit(featureFlag)
                    }
                    className="rounded-lg px-3 py-2 text-xs font-medium text-blue-600 hover:bg-blue-50"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      onDelete(featureFlag)
                    }
                    className="rounded-lg px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50"
                  >
                    Delete
                  </button>

                </div>

              </div>
            );
          }
        )}

      </div>

    </div>
  );
};

export default FeatureFlagTable;

