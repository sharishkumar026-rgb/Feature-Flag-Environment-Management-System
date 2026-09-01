import React, { useEffect, useMemo, useState } from "react";
import {
  getAssignments,
  deleteAssignment,
} from "../../api/assignmentApi";

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

interface AssignmentTableProps {
  onView?: (assignment: Assignment) => void;
  onEdit?: (assignment: Assignment) => void;
  onCreate?: () => void;
}

const AssignmentTable: React.FC<
  AssignmentTableProps
> = ({
  onView,
  onEdit,
  onCreate,
}) => {
  const [assignments, setAssignments] =
    useState<Assignment[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [deletingId, setDeletingId] =
    useState<number | null>(null);

  // ============================================================
  // GET ALL ASSIGNMENTS
  // GET /api/assignments
  // ============================================================

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await getAssignments();

      const data =
        response?.data ||
        response?.assignments ||
        response;

      if (Array.isArray(data)) {
        setAssignments(data);
      } else {
        setAssignments([]);
      }
    } catch (err: any) {
      const message =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        err?.message ||
        "Failed to retrieve assignments.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // INITIAL LOAD
  // ============================================================

  useEffect(() => {
    fetchAssignments();
  }, []);

  // ============================================================
  // SEARCH
  // ============================================================

  const filteredAssignments = useMemo(() => {
    const searchValue =
      search.trim().toLowerCase();

    if (!searchValue) {
      return assignments;
    }

    return assignments.filter(
      (assignment) => {
        const userName =
          assignment.user?.name || "";

        const userEmail =
          assignment.user?.email || "";

        const featureName =
          assignment.feature?.name || "";

        const featureKey =
          assignment.feature?.key || "";

        const environmentName =
          assignment.environment?.name || "";

        const environmentKey =
          assignment.environment?.key || "";

        const userId =
          assignment.user_id?.toString() || "";

        const featureId =
          assignment.feature_id?.toString() || "";

        const environmentId =
          assignment.environment_id?.toString() ||
          "";

        const assignmentId =
          assignment.id.toString();

        return (
          userName
            .toLowerCase()
            .includes(searchValue) ||
          userEmail
            .toLowerCase()
            .includes(searchValue) ||
          featureName
            .toLowerCase()
            .includes(searchValue) ||
          featureKey
            .toLowerCase()
            .includes(searchValue) ||
          environmentName
            .toLowerCase()
            .includes(searchValue) ||
          environmentKey
            .toLowerCase()
            .includes(searchValue) ||
          userId.includes(searchValue) ||
          featureId.includes(searchValue) ||
          environmentId.includes(
            searchValue
          ) ||
          assignmentId.includes(
            searchValue
          )
        );
      }
    );
  }, [assignments, search]);

  // ============================================================
  // DELETE
  // DELETE /api/assignments/{assignment_id}
  // ============================================================

  const handleDelete = async (
    assignment: Assignment
  ) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete assignment #${assignment.id}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(assignment.id);
      setError("");

      await deleteAssignment(
        assignment.id
      );

      setAssignments((current) =>
        current.filter(
          (item) =>
            item.id !== assignment.id
        )
      );
    } catch (err: any) {
      const message =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        err?.message ||
        "Failed to delete assignment.";

      setError(message);
    } finally {
      setDeletingId(null);
    }
  };

  // ============================================================
  // DATE FORMAT
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

    return parsedDate.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // ============================================================
  // ASSIGNMENT STATUS
  // ============================================================

  const getStatus = (
    assignment: Assignment
  ) => {
    if (
      assignment.is_enabled ===
      false
    ) {
      return false;
    }

    if (
      assignment.is_active ===
      false
    ) {
      return false;
    }

    return true;
  };

  // ============================================================
  // DISPLAY VALUE
  // ============================================================

  const getValue = (
    assignment: Assignment
  ) => {
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
  // LOADING
  // ============================================================

  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">

        <div className="flex min-h-[420px] items-center justify-center">

          <div className="flex flex-col items-center gap-3">

            <svg
              className="h-9 w-9 animate-spin text-blue-600"
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
              Loading assignments...
            </p>

          </div>

        </div>

      </div>
    );
  }

  // ============================================================
  // MAIN UI
  // ============================================================

  return (
    <div className="space-y-5">

      {/* ======================================================
          HEADER
      ======================================================= */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <div>

          <h2 className="text-xl font-bold text-gray-900">
            User Assignments
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Manage feature flag assignments for users and environments.
          </p>

        </div>

        {onCreate && (
          <button
            type="button"
            onClick={onCreate}
            className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100"
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

            Create Assignment

          </button>
        )}

      </div>

      {/* ======================================================
          ERROR
      ======================================================= */}

      {error && (
        <div className="flex items-start justify-between gap-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3">

          <div className="flex items-start gap-3">

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
                d="M12 9v2m0 4h.01M10.29 3.86l-7.5 13A2 2 0 004.53 18h14.94a2 2 0 001.74-3l-7.5-13a2 2 0 00-3.42 0l-7.5-13z"
              />
            </svg>

            <p className="text-sm text-red-700">
              {error}
            </p>

          </div>

          <button
            type="button"
            onClick={() =>
              setError("")
            }
            className="text-red-500 hover:text-red-700"
          >
            ×
          </button>

        </div>
      )}

      {/* ======================================================
          TABLE CARD
      ======================================================= */}

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

        {/* ====================================================
            TOOLBAR
        ===================================================== */}

        <div className="flex flex-col gap-4 border-b border-gray-200 p-5 md:flex-row md:items-center md:justify-between">

          {/* SEARCH */}

          <div className="relative w-full md:max-w-md">

            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">

              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-4.35-4.35m2.35-5.65a8 8 0 11-16 0 8 8 0 0116 0z"
                />
              </svg>

            </div>

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              placeholder="Search assignments..."
              className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-11 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />

          </div>

          {/* REFRESH */}

          <button
            type="button"
            onClick={fetchAssignments}
            className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
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
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>

            Refresh

          </button>

        </div>

        {/* ====================================================
            EMPTY STATE
        ===================================================== */}

        {filteredAssignments.length ===
        0 ? (

          <div className="flex min-h-[350px] flex-col items-center justify-center px-6 text-center">

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
                  d="M17 20h5v-2a4 4 0 00-4-4h-1m-4 6H3v-2a4 4 0 014-4h4m4-6a4 4 0 11-8 0 4 4 0 018 0zm6 0a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>

            </div>

            <h3 className="mt-4 text-lg font-semibold text-gray-900">
              {search
                ? "No assignments found"
                : "No assignments available"}
            </h3>

            <p className="mt-1 max-w-md text-sm text-gray-500">
              {search
                ? "Try changing your search criteria."
                : "Create an assignment to associate a feature with a user."}
            </p>

            {!search &&
              onCreate && (
                <button
                  type="button"
                  onClick={onCreate}
                  className="mt-5 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Create Assignment
                </button>
              )}

          </div>

        ) : (

          /* ==================================================
             TABLE
          =================================================== */

          <div className="overflow-x-auto">

            <table className="min-w-full divide-y divide-gray-200">

              <thead className="bg-gray-50">

                <tr>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Assignment
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    User
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Feature
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Environment
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Value
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Status
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Created
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody className="divide-y divide-gray-100 bg-white">

                {filteredAssignments.map(
                  (assignment) => {
                    const active =
                      getStatus(
                        assignment
                      );

                    const userName =
                      assignment.user
                        ?.name ||
                      (assignment.user_id
                        ? `User #${assignment.user_id}`
                        : "-");

                    const userEmail =
                      assignment.user
                        ?.email;

                    const featureName =
                      assignment.feature
                        ?.name ||
                      (assignment.feature_id
                        ? `Feature #${assignment.feature_id}`
                        : "-");

                    const environmentName =
                      assignment
                        .environment
                        ?.name ||
                      (assignment.environment_id
                        ? `Environment #${assignment.environment_id}`
                        : "-");

                    return (
                      <tr
                        key={
                          assignment.id
                        }
                        className="transition hover:bg-gray-50"
                      >

                        {/* ASSIGNMENT */}

                        <td className="whitespace-nowrap px-6 py-5">

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
                                  strokeWidth={
                                    2
                                  }
                                  d="M17 20h5v-2a4 4 0 00-4-4h-1M9 20H4v-2a4 4 0 014-4h1m6-6a4 4 0 11-8 0 4 4 0 018 0zm6 2a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                              </svg>

                            </div>

                            <div>

                              <p className="text-sm font-semibold text-gray-900">
                                Assignment #
                                {
                                  assignment.id
                                }
                              </p>

                              <p className="mt-0.5 text-xs text-gray-400">
                                ID:{" "}
                                {
                                  assignment.id
                                }
                              </p>

                            </div>

                          </div>

                        </td>

                        {/* USER */}

                        <td className="px-6 py-5">

                          <div className="flex items-center gap-3">

                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-600">

                              {userName
                                .charAt(
                                  0
                                )
                                .toUpperCase()}

                            </div>

                            <div className="min-w-0">

                              <p className="truncate text-sm font-semibold text-gray-900">
                                {userName}
                              </p>

                              {userEmail && (
                                <p className="max-w-[180px] truncate text-xs text-gray-500">
                                  {
                                    userEmail
                                  }
                                </p>
                              )}

                            </div>

                          </div>

                        </td>

                        {/* FEATURE */}

                        <td className="px-6 py-5">

                          <p className="text-sm font-semibold text-gray-900">
                            {
                              featureName
                            }
                          </p>

                          {assignment
                            .feature
                            ?.key && (
                            <code className="mt-1 inline-block rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
                              {
                                assignment
                                  .feature
                                  .key
                              }
                            </code>
                          )}

                        </td>

                        {/* ENVIRONMENT */}

                        <td className="px-6 py-5">

                          <p className="text-sm font-medium text-gray-700">
                            {
                              environmentName
                            }
                          </p>

                          {assignment
                            .environment
                            ?.key && (
                            <code className="mt-1 inline-block rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
                              {
                                assignment
                                  .environment
                                  .key
                              }
                            </code>
                          )}

                        </td>

                        {/* VALUE */}

                        <td className="px-6 py-5">

                          <span className="inline-flex max-w-[150px] items-center rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-700">

                            {getValue(
                              assignment
                            )}

                          </span>

                        </td>

                        {/* STATUS */}

                        <td className="whitespace-nowrap px-6 py-5">

                          {active ? (
                            <span className="inline-flex items-center gap-2 rounded-lg bg-green-100 px-3 py-1.5 text-xs font-semibold text-green-700">

                              <span className="h-2 w-2 rounded-full bg-green-500" />

                              Active

                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-600">

                              <span className="h-2 w-2 rounded-full bg-gray-400" />

                              Inactive

                            </span>
                          )}

                        </td>

                        {/* CREATED */}

                        <td className="whitespace-nowrap px-6 py-5">

                          <p className="text-sm text-gray-600">
                            {formatDate(
                              assignment.created_at
                            )}
                          </p>

                        </td>

                        {/* ACTIONS */}

                        <td className="whitespace-nowrap px-6 py-5">

                          <div className="flex items-center justify-end gap-2">

                            {/* VIEW */}

                            {onView && (
                              <button
                                type="button"
                                onClick={() =>
                                  onView(
                                    assignment
                                  )
                                }
                                title="View assignment"
                                className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
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
                                    strokeWidth={
                                      2
                                    }
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                  />

                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={
                                      2
                                    }
                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                  />
                                </svg>

                              </button>
                            )}

                            {/* EDIT */}

                            {onEdit && (
                              <button
                                type="button"
                                onClick={() =>
                                  onEdit(
                                    assignment
                                  )
                                }
                                title="Edit assignment"
                                className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
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
                                    strokeWidth={
                                      2
                                    }
                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5M18.5 2.5a2 2 0 013 3L12 15l-4 1-4-1 1-4 9.5-9.5z"
                                  />
                                </svg>

                              </button>
                            )}

                            {/* DELETE */}

                            <button
                              type="button"
                              onClick={() =>
                                handleDelete(
                                  assignment
                                )
                              }
                              disabled={
                                deletingId ===
                                assignment.id
                              }
                              title="Delete assignment"
                              className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                            >

                              {deletingId ===
                              assignment.id ? (
                                <svg
                                  className="h-4 w-4 animate-spin"
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
                              ) : (
                                <svg
                                  className="h-4 w-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={
                                      2
                                    }
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3m-9 0h14"
                                  />
                                </svg>
                              )}

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
        )}

        {/* ======================================================
            FOOTER
        ======================================================= */}

        {filteredAssignments.length >
          0 && (
          <div className="flex flex-col gap-2 border-t border-gray-200 bg-gray-50 px-6 py-4 text-sm sm:flex-row sm:items-center sm:justify-between">

            <p className="text-gray-500">

              Showing{" "}

              <span className="font-semibold text-gray-700">
                {
                  filteredAssignments.length
                }
              </span>{" "}

              of{" "}

              <span className="font-semibold text-gray-700">
                {assignments.length}
              </span>{" "}

              assignments

            </p>

            {search && (
              <button
                type="button"
                onClick={() =>
                  setSearch("")
                }
                className="font-medium text-blue-600 hover:text-blue-700"
              >
                Clear search
              </button>
            )}

          </div>
        )}

      </div>

    </div>
  );
};

export default AssignmentTable;