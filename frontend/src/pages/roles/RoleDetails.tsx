
import React from "react";

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

interface RoleDetailsProps {
  role: Role;
  onClose: () => void;
}

// ============================================================
// COMPONENT
// ============================================================

const RoleDetails: React.FC<RoleDetailsProps> = ({
  role,
  onClose,
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

    return parsedDate.toLocaleString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  // ==========================================================
  // UI
  // ==========================================================

  return (
    <div className="w-full">

      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5">

        <div className="flex items-center gap-3">

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50">

            <svg
              className="h-6 w-6 text-blue-600"
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

          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Role Details
            </h2>

            <p className="text-sm text-gray-500">
              View role information
            </p>
          </div>

        </div>

        <button
          type="button"
          onClick={onClose}
          className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
          aria-label="Close"
          title="Close"
        >
          <svg
            className="h-6 w-6"
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

      {/* ======================================================
          CONTENT
      ====================================================== */}

      <div className="space-y-6 p-6">

        {/* ====================================================
            ROLE SUMMARY
        ===================================================== */}

        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-center gap-4">

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-xl font-bold text-white">
                {role.name
                  ? role.name
                      .charAt(0)
                      .toUpperCase()
                  : "R"}
              </div>

              <div>

                <h3 className="text-xl font-bold text-gray-900">
                  {role.name || "-"}
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Role ID: #{role.id}
                </p>

              </div>

            </div>

            <div>

              {role.is_active !== false ? (
                <span className="inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1.5 text-sm font-semibold text-green-700">

                  <span className="h-2 w-2 rounded-full bg-green-500" />

                  Active

                </span>
              ) : (
                <span className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1.5 text-sm font-semibold text-gray-600">

                  <span className="h-2 w-2 rounded-full bg-gray-400" />

                  Inactive

                </span>
              )}

            </div>

          </div>

        </div>

        {/* ====================================================
            ROLE INFORMATION
        ===================================================== */}

        <div>

          <h3 className="mb-4 text-base font-bold text-gray-900">
            Role Information
          </h3>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

            {/* ROLE ID */}

            <div className="rounded-xl border border-gray-200 bg-white p-4">

              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Role ID
              </p>

              <p className="mt-2 text-sm font-semibold text-gray-900">
                #{role.id}
              </p>

            </div>

            {/* ROLE NAME */}

            <div className="rounded-xl border border-gray-200 bg-white p-4">

              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Role Name
              </p>

              <p className="mt-2 text-sm font-semibold text-gray-900">
                {role.name || "-"}
              </p>

            </div>

            {/* STATUS */}

            <div className="rounded-xl border border-gray-200 bg-white p-4">

              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Status
              </p>

              <div className="mt-2">

                {role.is_active !== false ? (
                  <span className="inline-flex items-center rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                    Active
                  </span>
                ) : (
                  <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
                    Inactive
                  </span>
                )}

              </div>

            </div>

            {/* DESCRIPTION */}

            <div className="rounded-xl border border-gray-200 bg-white p-4 sm:col-span-2">

              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Description
              </p>

              <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-gray-700">
                {role.description ||
                  "No description available."}
              </p>

            </div>

          </div>

        </div>

        {/* ====================================================
            TIMESTAMPS
        ===================================================== */}

        <div>

          <h3 className="mb-4 text-base font-bold text-gray-900">
            Timestamps
          </h3>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

            {/* CREATED */}

            <div className="rounded-xl border border-gray-200 bg-white p-4">

              <div className="flex items-center gap-3">

                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50">

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
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>

                </div>

                <div>

                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Created At
                  </p>

                  <p className="mt-1 text-sm font-medium text-gray-900">
                    {formatDate(
                      role.created_at
                    )}
                  </p>

                </div>

              </div>

            </div>

            {/* UPDATED */}

            <div className="rounded-xl border border-gray-200 bg-white p-4">

              <div className="flex items-center gap-3">

                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-50">

                  <svg
                    className="h-5 w-5 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 2m6-2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>

                </div>

                <div>

                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Updated At
                  </p>

                  <p className="mt-1 text-sm font-medium text-gray-900">
                    {formatDate(
                      role.updated_at
                    )}
                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* ======================================================
          FOOTER
      ====================================================== */}

      <div className="flex justify-end border-t border-gray-200 bg-gray-50 px-6 py-4">

        <button
          type="button"
          onClick={onClose}
          className="rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-gray-200"
        >
          Close
        </button>

      </div>

    </div>
  );
};

export default RoleDetails;

