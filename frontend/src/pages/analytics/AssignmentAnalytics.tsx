
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  getAssignmentAnalytics,
  AssignmentAnalytics as AssignmentAnalyticsData,
} from "../../api/analyticsApi";

// ============================================================
// COMPONENT
// ============================================================

const AssignmentAnalytics: React.FC = () => {
  const navigate = useNavigate();

  const { assignment_id } = useParams<{
    assignment_id: string;
  }>();

  const [assignment, setAssignment] =
    useState<AssignmentAnalyticsData | null>(null);

  const [loading, setLoading] =
    useState<boolean>(true);

  const [error, setError] =
    useState<string>("");

  // ==========================================================
  // LOAD ASSIGNMENT ANALYTICS
  // ==========================================================

  const loadAssignmentAnalytics = async (): Promise<void> => {
    try {
      setLoading(true);
      setError("");

      if (!assignment_id) {
        setError("Assignment ID is missing.");
        return;
      }

      const id = Number(assignment_id);

      if (Number.isNaN(id)) {
        setError("Invalid assignment ID.");
        return;
      }

      const response =
        await getAssignmentAnalytics(id);

      console.log(
        "Assignment analytics API response:",
        response
      );

      if (
        response &&
        response.assignment
      ) {
        setAssignment(response.assignment);
      } else {
        setAssignment(null);

        setError(
          response?.message ||
            "Assignment analytics data not found."
        );
      }
    } catch (err: any) {
      console.error(
        "Failed to load assignment analytics:",
        err
      );

      const message =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        err?.message ||
        "Failed to load assignment analytics.";

      setError(message);
      setAssignment(null);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================================
  // INITIAL LOAD
  // ==========================================================

  useEffect(() => {
    loadAssignmentAnalytics();
  }, [assignment_id]);

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
            Loading assignment analytics...
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
          onClick={() => navigate(-1)}
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

          Back
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

            <div className="flex-1">

              <h2 className="font-semibold text-red-800">
                Unable to load assignment analytics
              </h2>

              <p className="mt-1 text-sm text-red-700">
                {error}
              </p>

            </div>

            <button
              type="button"
              onClick={loadAssignmentAnalytics}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
            >
              Retry
            </button>

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
          onClick={() => navigate(-1)}
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

          Back
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
                d="M17 20h5v-2a4 4 0 00-4-4h-1m-4 6H3v-2a4 4 0 014-4h4m4-6a4 4 0 11-8 0 4 4 0 018 0zm6 0a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>

          </div>

          <h2 className="mt-4 text-lg font-semibold text-gray-900">
            Assignment not found
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Assignment analytics could not be found.
          </p>

        </div>

      </div>
    );
  }

  // ==========================================================
  // MAIN UI
  // ==========================================================

  const status =
    assignment.is_enabled;

  return (
    <div className="space-y-6">

      {/* ======================================================
          HEADER
      ======================================================= */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>

          <button
            type="button"
            onClick={() => navigate(-1)}
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

            Back
          </button>

          <h1 className="text-2xl font-bold text-gray-900">
            Assignment Analytics
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Analytics details for this user feature assignment.
          </p>

        </div>

        <div
          className={
            status
              ? "inline-flex items-center gap-2 rounded-xl bg-green-100 px-4 py-2 text-sm font-semibold text-green-700"
              : "inline-flex items-center gap-2 rounded-xl bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-600"
          }
        >

          <span
            className={
              status
                ? "h-2.5 w-2.5 rounded-full bg-green-500"
                : "h-2.5 w-2.5 rounded-full bg-gray-400"
            }
          />

          {status
            ? "Enabled"
            : "Disabled"}

        </div>

      </div>

      {/* ======================================================
          STATISTICS
      ======================================================= */}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">

        {/* ASSIGNMENT ID */}

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm font-medium text-gray-500">
                Assignment ID
              </p>

              <p className="mt-2 text-3xl font-bold text-purple-600">
                #{assignment.id}
              </p>

            </div>

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

          </div>

          <p className="mt-4 text-xs text-gray-400">
            User assignment identifier
          </p>

        </div>

        {/* USER ID */}

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm font-medium text-gray-500">
                User ID
              </p>

              <p className="mt-2 text-3xl font-bold text-blue-600">
                #{assignment.user_id}
              </p>

            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">

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
                  d="M15 19a3 3 0 11-6 0m6 0H9m6 0h4m-10 0H5m7-4a4 4 0 100-8 4 4 0 000 8z"
                />
              </svg>

            </div>

          </div>

          <p className="mt-4 text-xs text-gray-400">
            Assigned user
          </p>

        </div>

        {/* FEATURE ID */}

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm font-medium text-gray-500">
                Feature ID
              </p>

              <p className="mt-2 text-3xl font-bold text-orange-600">
                #{assignment.feature_id}
              </p>

            </div>

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
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>

            </div>

          </div>

          <p className="mt-4 text-xs text-gray-400">
            Assigned feature
          </p>

        </div>

        {/* STATUS */}

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm font-medium text-gray-500">
                Status
              </p>

              <p
                className={
                  status
                    ? "mt-2 text-3xl font-bold text-green-600"
                    : "mt-2 text-3xl font-bold text-gray-500"
                }
              >
                {status
                  ? "Enabled"
                  : "Disabled"}
              </p>

            </div>

            <div
              className={
                status
                  ? "flex h-12 w-12 items-center justify-center rounded-xl bg-green-100"
                  : "flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100"
              }
            >

              {status ? (
                <svg
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6 text-gray-500"
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
              )}

            </div>

          </div>

          <p className="mt-4 text-xs text-gray-400">
            Current assignment state
          </p>

        </div>

      </div>

      {/* ======================================================
          USER INFORMATION
      ======================================================= */}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

        {/* USER */}

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

          <div className="border-b border-gray-200 pb-5">

            <h2 className="text-lg font-bold text-gray-900">
              User Information
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              User associated with this assignment.
            </p>

          </div>

          <div className="mt-6 flex items-center gap-4">

            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-100 text-xl font-bold text-blue-600">
              {assignment.user_name
                .charAt(0)
                .toUpperCase()}
            </div>

            <div className="min-w-0">

              <p className="text-lg font-bold text-gray-900">
                {assignment.user_name}
              </p>

              <p className="mt-1 break-all text-sm text-gray-500">
                {assignment.user_email}
              </p>

            </div>

          </div>

          <div className="mt-6 rounded-xl bg-gray-50 p-5">

            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              User ID
            </p>

            <p className="mt-2 text-sm font-bold text-gray-800">
              {assignment.user_id}
            </p>

          </div>

        </div>

        {/* FEATURE */}

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

          <div className="border-b border-gray-200 pb-5">

            <h2 className="text-lg font-bold text-gray-900">
              Feature Information
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Feature associated with this assignment.
            </p>

          </div>

          <div className="mt-6 flex items-center gap-4">

            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-purple-100">

              <svg
                className="h-7 w-7 text-purple-600"
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

              <p className="text-lg font-bold text-gray-900">
                {assignment.feature_name}
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Feature ID: {assignment.feature_id}
              </p>

            </div>

          </div>

        </div>

      </div>

      {/* ======================================================
          ASSIGNMENT DETAILS
      ======================================================= */}

      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">

        <div className="border-b border-gray-200 px-6 py-5">

          <h2 className="text-lg font-bold text-gray-900">
            Assignment Details
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Current configuration and status of this assignment.
          </p>

        </div>

        <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-3">

          {/* ASSIGNMENT ID */}

          <div className="rounded-xl bg-gray-50 p-5">

            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              Assignment ID
            </p>

            <p className="mt-2 text-lg font-bold text-gray-900">
              {assignment.id}
            </p>

          </div>

          {/* USER ID */}

          <div className="rounded-xl bg-gray-50 p-5">

            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              User ID
            </p>

            <p className="mt-2 text-lg font-bold text-gray-900">
              {assignment.user_id}
            </p>

          </div>

          {/* FEATURE ID */}

          <div className="rounded-xl bg-gray-50 p-5">

            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              Feature ID
            </p>

            <p className="mt-2 text-lg font-bold text-gray-900">
              {assignment.feature_id}
            </p>

          </div>

        </div>

        <div className="border-t border-gray-100 px-6 py-6">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm font-semibold text-gray-700">
                Feature Assignment Status
              </p>

              <p className="mt-1 text-xs text-gray-400">
                Current enabled state of the assignment
              </p>

            </div>

            {status ? (
              <span className="inline-flex items-center gap-2 rounded-xl bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">

                <span className="h-2.5 w-2.5 rounded-full bg-green-500" />

                Enabled

              </span>
            ) : (
              <span className="inline-flex items-center gap-2 rounded-xl bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-600">

                <span className="h-2.5 w-2.5 rounded-full bg-gray-400" />

                Disabled

              </span>
            )}

          </div>

        </div>

      </div>

      {/* ======================================================
          BOTTOM ACTION
      ======================================================= */}

      <div className="flex justify-end">

        <button
          type="button"
          onClick={() => navigate(-1)}
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

          Back

        </button>

      </div>

    </div>
  );
};

export default AssignmentAnalytics;

