
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getAssignmentById } from "../../api/assignmentApi";

// ============================================================
// TYPES
// ============================================================

interface Assignment {
  id: number;

  user_id?: number;
  feature_id?: number;
  environment_id?: number;

  is_enabled?: boolean;
  is_active?: boolean;

  value?: string | boolean | number | null;

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
  };

  environment?: {
    id?: number;
    name?: string;
    key?: string;
  };

  created_by?: {
    id?: number;
    name?: string;
    email?: string;
    role?: string;
  };
}

// ============================================================
// API RESPONSE
// ============================================================

interface AssignmentResponse {
  success?: boolean;
  message?: string;

  // Direct assignment response support
  id?: number;
  user_id?: number;
  feature_id?: number;
  environment_id?: number;

  is_enabled?: boolean;
  is_active?: boolean;

  value?: string | boolean | number | null;

  created_at?: string;
  updated_at?: string;

  assignment?: Assignment;

  data?:
    | Assignment
    | {
        assignment?: Assignment;
      };
}

// ============================================================
// COMPONENT
// ============================================================

const AssignmentDetails: React.FC = () => {
  const navigate = useNavigate();

  const { assignment_id } = useParams<{
    assignment_id: string;
  }>();

  const [assignment, setAssignment] =
    useState<Assignment | null>(null);

  const [loading, setLoading] =
    useState<boolean>(true);

  const [error, setError] =
    useState<string>("");

  // ==========================================================
  // LOAD ASSIGNMENT
  // ==========================================================

  const loadAssignment = async (): Promise<void> => {
    try {
      setLoading(true);
      setError("");

      if (!assignment_id) {
        setError("Assignment ID is missing.");
        return;
      }

      const response =
        (await getAssignmentById(
          Number(assignment_id)
        )) as AssignmentResponse;

      console.log(
        "Assignment details API response:",
        response
      );

      let assignmentData: Assignment | null = null;

      // ------------------------------------------------------
      // RESPONSE:
      // { assignment: {...} }
      // ------------------------------------------------------

      if (
        response &&
        "assignment" in response &&
        response.assignment
      ) {
        assignmentData = response.assignment;
      }

      // ------------------------------------------------------
      // RESPONSE:
      // { data: {...} }
      // ------------------------------------------------------

      else if (
        response &&
        "data" in response &&
        response.data
      ) {
        const data = response.data;

        // ----------------------------------------------------
        // RESPONSE:
        // { data: { assignment: {...} } }
        // ----------------------------------------------------

        if (
          typeof data === "object" &&
          "assignment" in data &&
          data.assignment
        ) {
          assignmentData = data.assignment;
        }

        // ----------------------------------------------------
        // RESPONSE:
        // { data: {...assignment fields...} }
        // ----------------------------------------------------

        else if (
          typeof data === "object" &&
          "id" in data
        ) {
          assignmentData =
            data as Assignment;
        }
      }

      // ------------------------------------------------------
      // DIRECT ASSIGNMENT RESPONSE
      //
      // {
      //   id: 1,
      //   user_id: 2,
      //   feature_id: 3
      // }
      // ------------------------------------------------------

      if (
        !assignmentData &&
        response &&
        "id" in response &&
        typeof response.id === "number"
      ) {
        assignmentData =
          response as Assignment;
      }

      // ------------------------------------------------------
      // FINAL CHECK
      // ------------------------------------------------------

      if (!assignmentData) {
        setError("Assignment not found.");
        return;
      }

      setAssignment(assignmentData);

    } catch (err: any) {
      console.error(
        "Failed to load assignment:",
        err
      );

      const message =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        err?.message ||
        "Failed to load assignment.";

      setError(message);

    } finally {
      setLoading(false);
    }
  };

  // ==========================================================
  // INITIAL LOAD
  // ==========================================================

  useEffect(() => {
    loadAssignment();
  }, [assignment_id]);

  // ==========================================================
  // DATE FORMAT
  // ==========================================================

  const formatDate = (
    date?: string
  ): string => {
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

  // ==========================================================
  // STATUS
  // ==========================================================

  const isActive = (
    item: Assignment
  ): boolean => {
    if (
      item.is_enabled === false
    ) {
      return false;
    }

    if (
      item.is_active === false
    ) {
      return false;
    }

    return true;
  };

  // ==========================================================
  // VALUE
  // ==========================================================

  const getValue = (
    item: Assignment
  ): string => {
    if (
      item.value === undefined ||
      item.value === null
    ) {
      return "-";
    }

    if (
      typeof item.value ===
      "boolean"
    ) {
      return item.value
        ? "Enabled"
        : "Disabled";
    }

    return String(
      item.value
    );
  };

  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">

        <div className="flex flex-col items-center gap-3">

          <svg
            className="h-10 w-10 animate-spin text-blue-600"
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
            Loading assignment details...
          </p>

        </div>

      </div>
    );
  }

  // ==========================================================
  // ERROR
  // ==========================================================

  if (error) {
    return (
      <div className="space-y-5">

        <button
          type="button"
          onClick={() =>
            navigate("/assignments")
          }
          className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
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

          Back to Assignments
        </button>

        <div className="rounded-2xl border border-red-200 bg-red-50 p-6">

          <div className="flex items-start gap-3">

            <svg
              className="mt-0.5 h-6 w-6 shrink-0 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01M10.29 3.86l-7.5 13A2 2 0 004.03 20h15.94a2 2 0 001.74-3l-7.5-13a2 2 0 00-3.42 0z"
              />
            </svg>

            <div>

              <h2 className="font-semibold text-red-800">
                Unable to load assignment
              </h2>

              <p className="mt-1 text-sm text-red-700">
                {error}
              </p>

            </div>

          </div>

        </div>

      </div>
    );
  }

  // ==========================================================
  // NOT FOUND
  // ==========================================================

  if (!assignment) {
    return (
      <div className="space-y-5">

        <button
          type="button"
          onClick={() =>
            navigate("/assignments")
          }
          className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
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

          Back to Assignments
        </button>

        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white px-6 text-center shadow-sm">

          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100">

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
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>

          </div>

          <h2 className="mt-4 text-lg font-semibold text-gray-900">
            Assignment not found
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            The requested assignment could not be found.
          </p>

        </div>

      </div>
    );
  }

  // ==========================================================
  // MAIN DATA
  // ==========================================================

  const active =
    isActive(assignment);

  const userName =
    assignment.user?.name ||
    (assignment.user_id
      ? `User #${assignment.user_id}`
      : "-");

  const userEmail =
    assignment.user?.email ||
    "-";

  const featureName =
    assignment.feature?.name ||
    (assignment.feature_id
      ? `Feature #${assignment.feature_id}`
      : "-");

  const featureKey =
    assignment.feature?.key ||
    "-";

  const environmentName =
    assignment.environment?.name ||
    (assignment.environment_id
      ? `Environment #${assignment.environment_id}`
      : "-");

  const environmentKey =
    assignment.environment?.key ||
    "-";

  const createdByName =
    assignment.created_by?.name ||
    "-";

  const createdByEmail =
    assignment.created_by?.email ||
    "-";

  const createdByRole =
    assignment.created_by?.role ||
    "-";

  // ==========================================================
  // MAIN UI
  // ==========================================================

  return (
    <div className="space-y-6">

      {/* ======================================================
          HEADER
      ======================================================= */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>

          <button
            type="button"
            onClick={() =>
              navigate("/assignments")
            }
            className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
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

            Back to Assignments
          </button>

          <h1 className="text-2xl font-bold text-gray-900">
            Assignment #{assignment.id}
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            View complete user assignment details.
          </p>

        </div>

        <div>

          {active ? (
            <span className="inline-flex items-center gap-2 rounded-xl bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">

              <span className="h-2.5 w-2.5 rounded-full bg-green-500" />

              Active

            </span>
          ) : (
            <span className="inline-flex items-center gap-2 rounded-xl bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-600">

              <span className="h-2.5 w-2.5 rounded-full bg-gray-400" />

              Inactive

            </span>
          )}

        </div>

      </div>

      {/* ======================================================
          ASSIGNMENT OVERVIEW
      ======================================================= */}

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">

        {/* USER */}

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

          <div className="flex items-center gap-4">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-lg font-bold text-blue-600">
              {userName
                .charAt(0)
                .toUpperCase()}
            </div>

            <div className="min-w-0">

              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                User
              </p>

              <p className="mt-1 truncate text-lg font-bold text-gray-900">
                {userName}
              </p>

            </div>

          </div>

          <div className="mt-5 border-t border-gray-100 pt-4">

            <p className="text-xs text-gray-400">
              Email
            </p>

            <p className="mt-1 break-all text-sm font-medium text-gray-700">
              {userEmail}
            </p>

            <p className="mt-4 text-xs text-gray-400">
              User ID
            </p>

            <p className="mt-1 text-sm font-medium text-gray-700">
              {assignment.user_id ?? "-"}
            </p>

            {assignment.user?.role && (
              <>
                <p className="mt-4 text-xs text-gray-400">
                  Role
                </p>

                <span className="mt-1 inline-flex rounded-lg bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700">
                  {assignment.user.role}
                </span>
              </>
            )}

          </div>

        </div>

        {/* FEATURE */}

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

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
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>

            </div>

            <div>

              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Feature
              </p>

              <p className="mt-1 text-lg font-bold text-gray-900">
                {featureName}
              </p>

            </div>

          </div>

          <div className="mt-5 border-t border-gray-100 pt-4">

            <p className="text-xs text-gray-400">
              Feature ID
            </p>

            <p className="mt-1 text-sm font-medium text-gray-700">
              {assignment.feature_id ?? "-"}
            </p>

            <p className="mt-4 text-xs text-gray-400">
              Feature Key
            </p>

            <code className="mt-1 inline-block rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700">
              {featureKey}
            </code>

          </div>

        </div>

        {/* ENVIRONMENT */}

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

          <div className="flex items-center gap-4">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100">

              <svg
                className="h-6 w-6 text-orange-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 7h18M5 7v10a2 2 0 002 2h10a2 2 0 002-2V7M8 7V5a1 1 0 011-1h6a1 1 0 011 1v2"
                />
              </svg>

            </div>

            <div>

              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Environment
              </p>

              <p className="mt-1 text-lg font-bold text-gray-900">
                {environmentName}
              </p>

            </div>

          </div>

          <div className="mt-5 border-t border-gray-100 pt-4">

            <p className="text-xs text-gray-400">
              Environment ID
            </p>

            <p className="mt-1 text-sm font-medium text-gray-700">
              {assignment.environment_id ?? "-"}
            </p>

            <p className="mt-4 text-xs text-gray-400">
              Environment Key
            </p>

            <code className="mt-1 inline-block rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700">
              {environmentKey}
            </code>

          </div>

        </div>

      </div>

      {/* ======================================================
          ASSIGNMENT CONFIGURATION
      ======================================================= */}

      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">

        <div className="border-b border-gray-200 px-6 py-5">

          <h2 className="text-lg font-bold text-gray-900">
            Assignment Configuration
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Current feature assignment configuration.
          </p>

        </div>

        <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-3">

          {/* VALUE */}

          <div>

            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              Value
            </p>

            <div className="mt-2">

              <span className="inline-flex rounded-xl bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700">
                {getValue(assignment)}
              </span>

            </div>

          </div>

          {/* ENABLED */}

          <div>

            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              Feature Enabled
            </p>

            <div className="mt-2">

              {assignment.is_enabled !== false ? (
                <span className="inline-flex rounded-xl bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
                  Enabled
                </span>
              ) : (
                <span className="inline-flex rounded-xl bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-600">
                  Disabled
                </span>
              )}

            </div>

          </div>

          {/* ACTIVE */}

          <div>

            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              Assignment Status
            </p>

            <div className="mt-2">

              {active ? (
                <span className="inline-flex rounded-xl bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
                  Active
                </span>
              ) : (
                <span className="inline-flex rounded-xl bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-600">
                  Inactive
                </span>
              )}

            </div>

          </div>

        </div>

      </div>

      {/* ======================================================
          AUDIT INFORMATION
      ======================================================= */}

      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">

        <div className="border-b border-gray-200 px-6 py-5">

          <h2 className="text-lg font-bold text-gray-900">
            Audit Information
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Assignment creation and update information.
          </p>

        </div>

        <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2">

          {/* CREATED BY */}

          <div className="rounded-xl bg-gray-50 p-5">

            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              Created By
            </p>

            <p className="mt-2 text-base font-bold text-gray-900">
              {createdByName}
            </p>

            <p className="mt-1 text-sm text-gray-500">
              {createdByEmail}
            </p>

            <span className="mt-3 inline-flex rounded-lg bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
              {createdByRole}
            </span>

            {assignment.created_by?.id && (
              <p className="mt-3 text-xs text-gray-400">
                User ID:{" "}
                {assignment.created_by.id}
              </p>
            )}

          </div>

          {/* DATES */}

          <div className="rounded-xl bg-gray-50 p-5">

            <div>

              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Created At
              </p>

              <p className="mt-2 text-sm font-medium text-gray-700">
                {formatDate(
                  assignment.created_at
                )}
              </p>

            </div>

            <div className="mt-5">

              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Updated At
              </p>

              <p className="mt-2 text-sm font-medium text-gray-700">
                {formatDate(
                  assignment.updated_at
                )}
              </p>

            </div>

          </div>

        </div>

      </div>

      {/* ======================================================
          BOTTOM ACTION
      ======================================================= */}

      <div className="flex justify-end">

        <button
          type="button"
          onClick={() =>
            navigate("/assignments")
          }
          className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50"
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

          Back to Assignments
        </button>

      </div>

    </div>
  );
};

export default AssignmentDetails;

