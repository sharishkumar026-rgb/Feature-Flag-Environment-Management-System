import React from "react";

interface AssignmentDetails {
  id: number;

  user_id?: number;
  feature_id?: number;
  environment_id?: number;

  value?: string | boolean | number | null;

  is_enabled?: boolean;
  is_active?: boolean;

  created_at?: string;
  updated_at?: string;

  user?: {
    id?: number;
    name?: string;
    email?: string;
    role?: string;
  };

  feature?: {
    id?: number;
    name?: string;
    key?: string;
    description?: string;
  };

  environment?: {
    id?: number;
    name?: string;
    key?: string;
    description?: string;
  };

  created_by?: {
    id?: number;
    name?: string;
    email?: string;
    role?: string;
  };

  updated_by?: {
    id?: number;
    name?: string;
    email?: string;
    role?: string;
  };
}

interface AssignmentDetailsProps {
  assignment: AssignmentDetails | null;
  onClose?: () => void;
  onEdit?: (assignment: AssignmentDetails) => void;
}

const AssignmentDetails: React.FC<
  AssignmentDetailsProps
> = ({
  assignment,
  onClose,
  onEdit,
}) => {
  // ============================================================
  // NO DATA
  // ============================================================

  if (!assignment) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">

        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100">

          <svg
            className="h-8 w-8 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h6l5 5v11a2 2 0 01-2 2z"
            />
          </svg>

        </div>

        <h2 className="mt-4 text-lg font-semibold text-gray-900">
          Assignment not found
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          No assignment details are available.
        </p>

      </div>
    );
  }

  // ============================================================
  // FORMAT DATE
  // ============================================================

  const formatDate = (
    date?: string
  ) => {
    if (!date) {
      return "-";
    }

    const parsedDate =
      new Date(date);

    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {
      return "-";
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

  // ============================================================
  // STATUS
  // ============================================================

  const isEnabled =
    assignment.is_enabled !== false;

  const isActive =
    assignment.is_active !== false;

  // ============================================================
  // VALUE
  // ============================================================

  const getValue = () => {
    if (
      assignment.value ===
        undefined ||
      assignment.value === null
    ) {
      return "-";
    }

    if (
      typeof assignment.value ===
      "boolean"
    ) {
      return assignment.value
        ? "Enabled"
        : "Disabled";
    }

    return String(
      assignment.value
    );
  };

  // ============================================================
  // USER DISPLAY
  // ============================================================

  const userName =
    assignment.user?.name ||
    (assignment.user_id
      ? `User #${assignment.user_id}`
      : "-");

  const userEmail =
    assignment.user?.email ||
    "-";

  const userRole =
    assignment.user?.role ||
    "-";

  // ============================================================
  // FEATURE DISPLAY
  // ============================================================

  const featureName =
    assignment.feature?.name ||
    (assignment.feature_id
      ? `Feature #${assignment.feature_id}`
      : "-");

  const featureKey =
    assignment.feature?.key ||
    "-";

  // ============================================================
  // ENVIRONMENT DISPLAY
  // ============================================================

  const environmentName =
    assignment.environment
      ?.name ||
    (assignment.environment_id
      ? `Environment #${assignment.environment_id}`
      : "-");

  const environmentKey =
    assignment.environment
      ?.key ||
    "-";

  // ============================================================
  // UI
  // ============================================================

  return (
    <div className="w-full rounded-2xl border border-gray-200 bg-white shadow-sm">

      {/* ======================================================
          HEADER
      ======================================================= */}

      <div className="flex flex-col gap-4 border-b border-gray-200 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">

        <div className="flex items-center gap-4">

          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100">

            <svg
              className="h-6 w-6 text-purple-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a4 4 0 00-4-4h-1m-4 6H3v-2a4 4 0 014-4h4m4-6a4 4 0 11-8 0 4 4 0 018 0zm6 0a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>

          </div>

          <div>

            <div className="flex flex-wrap items-center gap-3">

              <h2 className="text-xl font-bold text-gray-900">
                Assignment #{assignment.id}
              </h2>

              {isActive ? (
                <span className="inline-flex items-center gap-2 rounded-lg bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">

                  <span className="h-2 w-2 rounded-full bg-green-500" />

                  Active

                </span>
              ) : (
                <span className="inline-flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">

                  <span className="h-2 w-2 rounded-full bg-gray-400" />

                  Inactive

                </span>
              )}

            </div>

            <p className="mt-1 text-sm text-gray-500">
              View complete assignment details.
            </p>

          </div>

        </div>

        {/* ACTIONS */}

        <div className="flex items-center gap-2">

          {onEdit && (
            <button
              type="button"
              onClick={() =>
                onEdit(assignment)
              }
              className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
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
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5M18.5 2.5a2 2 0 013 3L12 15l-4 1-4-1 1-4 9.5-9.5z"
                />
              </svg>

              Edit

            </button>
          )}

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 text-gray-500 transition hover:bg-gray-50 hover:text-gray-700"
              title="Close"
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
          )}

        </div>

      </div>

      {/* ======================================================
          CONTENT
      ======================================================= */}

      <div className="space-y-6 p-6">

        {/* ====================================================
            STATUS CARDS
        ===================================================== */}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

          {/* ASSIGNMENT ID */}

          <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">

            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Assignment ID
            </p>

            <p className="mt-2 text-2xl font-bold text-gray-900">
              #{assignment.id}
            </p>

          </div>

          {/* ENABLED */}

          <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">

            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Feature Status
            </p>

            <div className="mt-2">

              {isEnabled ? (
                <span className="inline-flex items-center gap-2 rounded-lg bg-green-100 px-3 py-1.5 text-sm font-semibold text-green-700">

                  <span className="h-2 w-2 rounded-full bg-green-500" />

                  Enabled

                </span>
              ) : (
                <span className="inline-flex items-center gap-2 rounded-lg bg-red-100 px-3 py-1.5 text-sm font-semibold text-red-700">

                  <span className="h-2 w-2 rounded-full bg-red-500" />

                  Disabled

                </span>
              )}

            </div>

          </div>

          {/* VALUE */}

          <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">

            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Assignment Value
            </p>

            <p className="mt-2 truncate text-lg font-bold text-gray-900">
              {getValue()}
            </p>

          </div>

        </div>

        {/* ====================================================
            USER DETAILS
        ===================================================== */}

        <div className="rounded-2xl border border-gray-200">

          <div className="border-b border-gray-200 px-5 py-4">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100">

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
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>

              </div>

              <div>

                <h3 className="font-semibold text-gray-900">
                  User Details
                </h3>

                <p className="text-xs text-gray-500">
                  User associated with this assignment
                </p>

              </div>

            </div>

          </div>

          <div className="grid grid-cols-1 gap-5 p-5 md:grid-cols-2">

            <div>

              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                User ID
              </p>

              <p className="mt-1 text-sm font-semibold text-gray-900">
                {assignment.user_id
                  ? `#${assignment.user_id}`
                  : "-" }
              </p>

            </div>

            <div>

              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Name
              </p>

              <p className="mt-1 text-sm font-semibold text-gray-900">
                {userName}
              </p>

            </div>

            <div>

              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Email
              </p>

              <p className="mt-1 break-all text-sm text-gray-700">
                {userEmail}
              </p>

            </div>

            <div>

              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Role
              </p>

              <p className="mt-1 text-sm text-gray-700">
                {userRole}
              </p>

            </div>

          </div>

        </div>

        {/* ====================================================
            FEATURE DETAILS
        ===================================================== */}

        <div className="rounded-2xl border border-gray-200">

          <div className="border-b border-gray-200 px-5 py-4">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100">

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
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 3c-2.755 0-5.29.93-7.312 2.495m14.624 0A11.955 11.955 0 0112 21c-2.755 0-5.29-.93-7.312-2.495"
                  />
                </svg>

              </div>

              <div>

                <h3 className="font-semibold text-gray-900">
                  Feature Details
                </h3>

                <p className="text-xs text-gray-500">
                  Feature flag assigned to the user
                </p>

              </div>

            </div>

          </div>

          <div className="grid grid-cols-1 gap-5 p-5 md:grid-cols-2">

            <div>

              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Feature ID
              </p>

              <p className="mt-1 text-sm font-semibold text-gray-900">
                {assignment.feature_id
                  ? `#${assignment.feature_id}`
                  : "-"}
              </p>

            </div>

            <div>

              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Feature Name
              </p>

              <p className="mt-1 text-sm font-semibold text-gray-900">
                {featureName}
              </p>

            </div>

            <div className="md:col-span-2">

              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Feature Key
              </p>

              <code className="mt-1 inline-block rounded-lg bg-gray-100 px-3 py-1.5 text-sm text-gray-700">
                {featureKey}
              </code>

            </div>

            {assignment.feature
              ?.description && (
              <div className="md:col-span-2">

                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Description
                </p>

                <p className="mt-1 text-sm leading-6 text-gray-700">
                  {
                    assignment
                      .feature
                      .description
                  }
                </p>

              </div>
            )}

          </div>

        </div>

        {/* ====================================================
            ENVIRONMENT DETAILS
        ===================================================== */}

        <div className="rounded-2xl border border-gray-200">

          <div className="border-b border-gray-200 px-5 py-4">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100">

                <svg
                  className="h-5 w-5 text-orange-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 7l9-4 9 4-9 4-9-4zm0 5l9 4 9-4M3 17l9 4 9-4"
                  />
                </svg>

              </div>

              <div>

                <h3 className="font-semibold text-gray-900">
                  Environment Details
                </h3>

                <p className="text-xs text-gray-500">
                  Environment where the assignment applies
                </p>

              </div>

            </div>

          </div>

          <div className="grid grid-cols-1 gap-5 p-5 md:grid-cols-2">

            <div>

              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Environment ID
              </p>

              <p className="mt-1 text-sm font-semibold text-gray-900">
                {assignment.environment_id
                  ? `#${assignment.environment_id}`
                  : "-"}
              </p>

            </div>

            <div>

              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Environment Name
              </p>

              <p className="mt-1 text-sm font-semibold text-gray-900">
                {environmentName}
              </p>

            </div>

            <div className="md:col-span-2">

              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Environment Key
              </p>

              <code className="mt-1 inline-block rounded-lg bg-gray-100 px-3 py-1.5 text-sm text-gray-700">
                {environmentKey}
              </code>

            </div>

            {assignment.environment
              ?.description && (
              <div className="md:col-span-2">

                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Description
                </p>

                <p className="mt-1 text-sm leading-6 text-gray-700">
                  {
                    assignment
                      .environment
                      .description
                  }
                </p>

              </div>
            )}

          </div>

        </div>

        {/* ====================================================
            ASSIGNMENT CONFIGURATION
        ===================================================== */}

        <div className="rounded-2xl border border-gray-200">

          <div className="border-b border-gray-200 px-5 py-4">

            <h3 className="font-semibold text-gray-900">
              Assignment Configuration
            </h3>

          </div>

          <div className="grid grid-cols-1 gap-5 p-5 md:grid-cols-3">

            <div>

              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Value
              </p>

              <p className="mt-1 text-sm font-semibold text-gray-900">
                {getValue()}
              </p>

            </div>

            <div>

              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Enabled
              </p>

              <p className="mt-1 text-sm font-semibold">

                {isEnabled ? (
                  <span className="text-green-600">
                    Yes
                  </span>
                ) : (
                  <span className="text-red-600">
                    No
                  </span>
                )}

              </p>

            </div>

            <div>

              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Active
              </p>

              <p className="mt-1 text-sm font-semibold">

                {isActive ? (
                  <span className="text-green-600">
                    Yes
                  </span>
                ) : (
                  <span className="text-gray-500">
                    No
                  </span>
                )}

              </p>

            </div>

          </div>

        </div>

        {/* ====================================================
            AUDIT INFORMATION
        ===================================================== */}

        <div className="rounded-2xl border border-gray-200">

          <div className="border-b border-gray-200 px-5 py-4">

            <h3 className="font-semibold text-gray-900">
              Audit Information
            </h3>

          </div>

          <div className="grid grid-cols-1 gap-5 p-5 md:grid-cols-2">

            <div>

              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Created At
              </p>

              <p className="mt-1 text-sm text-gray-700">
                {formatDate(
                  assignment.created_at
                )}
              </p>

            </div>

            <div>

              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Updated At
              </p>

              <p className="mt-1 text-sm text-gray-700">
                {formatDate(
                  assignment.updated_at
                )}
              </p>

            </div>

            {assignment.created_by && (
              <div>

                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Created By
                </p>

                <p className="mt-1 text-sm font-semibold text-gray-900">
                  {
                    assignment
                      .created_by
                      .name ||
                    "-"
                  }
                </p>

                {assignment
                  .created_by
                  .email && (
                  <p className="mt-0.5 text-xs text-gray-500">
                    {
                      assignment
                        .created_by
                        .email
                    }
                  </p>
                )}

              </div>
            )}

            {assignment.updated_by && (
              <div>

                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Updated By
                </p>

                <p className="mt-1 text-sm font-semibold text-gray-900">
                  {
                    assignment
                      .updated_by
                      .name ||
                    "-"
                  }
                </p>

                {assignment
                  .updated_by
                  .email && (
                  <p className="mt-0.5 text-xs text-gray-500">
                    {
                      assignment
                        .updated_by
                        .email
                    }
                  </p>
                )}

              </div>
            )}

          </div>

        </div>

      </div>

      {/* ======================================================
          FOOTER
      ======================================================= */}

      {onClose && (
        <div className="flex justify-end border-t border-gray-200 bg-gray-50 px-6 py-4">

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            Close
          </button>

        </div>
      )}

    </div>
  );
};

export default AssignmentDetails;