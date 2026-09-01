import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";

// ============================================================
// TYPES
// ============================================================

interface AssignmentAnalyticsData {
  id: number;
  user_id: number;
  feature_id: number;
  is_enabled: boolean;

  feature_name: string;
  user_name: string;
  user_email: string;
}

interface AssignmentAnalyticsResponse {
  success: boolean;
  message: string;
  assignment: AssignmentAnalyticsData;
}

// ============================================================
// COMPONENT
// ============================================================

const AssignmentAnalytics: React.FC = () => {
  const { assignmentId } = useParams<{
    assignmentId: string;
  }>();

  const navigate = useNavigate();

  const [analytics, setAnalytics] =
    useState<AssignmentAnalyticsData | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ============================================================
  // FETCH ANALYTICS
  // GET /api/analytics/assignments/{assignment_id}
  // ============================================================

  const fetchAnalytics = async () => {
    if (!assignmentId) {
      setError("Assignment ID is required.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response =
        await api.get<AssignmentAnalyticsResponse>(
          `/analytics/assignments/${assignmentId}`
        );

      if (!response.data.success) {
        throw new Error(
          response.data.message ||
            "Failed to retrieve assignment analytics."
        );
      }

      setAnalytics(response.data.assignment);
    } catch (err: any) {
      const message =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        err?.message ||
        "Failed to load assignment analytics.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [assignmentId]);

  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />

          <p className="mt-4 text-sm font-medium text-gray-600">
            Loading assignment analytics...
          </p>
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
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-100">
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
                d="M12 9v2m0 4h.01M10.29 3.86l-7.5 13A1 1 0 003.66 18h16.68a1 1 0 00.87-1.5l-7.5-13a1 1 0 00-1.74 0z"
              />
            </svg>
          </div>

          <div>
            <h3 className="font-semibold text-red-800">
              Unable to load analytics
            </h3>

            <p className="mt-1 text-sm text-red-700">
              {error}
            </p>

            <button
              type="button"
              onClick={fetchAnalytics}
              className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================
  // NO DATA
  // ============================================================

  if (!analytics) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100">
          <svg
            className="h-6 w-6 text-gray-400"
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

        <h3 className="mt-4 text-lg font-semibold text-gray-900">
          No assignment analytics found
        </h3>

        <p className="mt-1 text-sm text-gray-500">
          The requested assignment could not be found.
        </p>
      </div>
    );
  }

  // ============================================================
  // UI
  // ============================================================

  return (
    <div className="space-y-6">

      {/* ======================================================
          HEADER
      ======================================================= */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Assignment Analytics
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            View assignment details and feature status
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50"
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
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>

          Back
        </button>
      </div>

      {/* ======================================================
          STATUS
      ======================================================= */}

      <div
        className={`rounded-2xl border p-6 ${
          analytics.is_enabled
            ? "border-green-200 bg-green-50"
            : "border-gray-200 bg-gray-50"
        }`}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                analytics.is_enabled
                  ? "bg-green-100"
                  : "bg-gray-200"
              }`}
            >
              {analytics.is_enabled ? (
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

            <div>
              <p className="text-sm font-medium text-gray-500">
                Assignment Status
              </p>

              <h2
                className={`text-xl font-bold ${
                  analytics.is_enabled
                    ? "text-green-700"
                    : "text-gray-700"
                }`}
              >
                {analytics.is_enabled
                  ? "Enabled"
                  : "Disabled"}
              </h2>
            </div>
          </div>

          <span
            className={`inline-flex w-fit rounded-full px-4 py-2 text-sm font-semibold ${
              analytics.is_enabled
                ? "bg-green-100 text-green-700"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {analytics.is_enabled
              ? "Feature Enabled"
              : "Feature Disabled"}
          </span>
        </div>
      </div>

      {/* ======================================================
          ANALYTICS CARDS
      ======================================================= */}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">

        {/* Assignment ID */}

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Assignment ID
              </p>

              <p className="mt-2 text-3xl font-bold text-gray-900">
                #{analytics.id}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50">
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
                  d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a3 3 0 006 0M9 5h6"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* User ID */}

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                User ID
              </p>

              <p className="mt-2 text-3xl font-bold text-gray-900">
                #{analytics.user_id}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50">
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
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM4 21a8 8 0 0116 0"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Feature ID */}

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Feature ID
              </p>

              <p className="mt-2 text-3xl font-bold text-gray-900">
                #{analytics.feature_id}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50">
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
                  d="M12 3v18m9-9H3"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================
          USER & FEATURE DETAILS
      ======================================================= */}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

        {/* USER DETAILS */}

        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">

          <div className="border-b border-gray-200 px-6 py-5">
            <h2 className="text-lg font-bold text-gray-900">
              User Details
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              User assigned to this feature
            </p>
          </div>

          <div className="space-y-5 p-6">

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                User Name
              </p>

              <p className="mt-1 text-base font-semibold text-gray-900">
                {analytics.user_name || "N/A"}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Email Address
              </p>

              <p className="mt-1 break-all text-base text-gray-700">
                {analytics.user_email || "N/A"}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                User ID
              </p>

              <p className="mt-1 text-base font-semibold text-gray-900">
                {analytics.user_id}
              </p>
            </div>

          </div>
        </div>

        {/* FEATURE DETAILS */}

        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">

          <div className="border-b border-gray-200 px-6 py-5">
            <h2 className="text-lg font-bold text-gray-900">
              Feature Details
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Feature associated with this assignment
            </p>
          </div>

          <div className="space-y-5 p-6">

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Feature Name
              </p>

              <p className="mt-1 text-base font-semibold text-gray-900">
                {analytics.feature_name || "N/A"}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Feature ID
              </p>

              <p className="mt-1 text-base font-semibold text-gray-900">
                {analytics.feature_id}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Assignment Status
              </p>

              <div className="mt-2">
                <span
                  className={`inline-flex rounded-full px-3 py-1.5 text-sm font-semibold ${
                    analytics.is_enabled
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {analytics.is_enabled
                    ? "Enabled"
                    : "Disabled"}
                </span>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* ======================================================
          SUMMARY
      ======================================================= */}

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

        <div className="flex items-start gap-4">

          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50">
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
                d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z"
              />
            </svg>
          </div>

          <div>
            <h3 className="text-base font-bold text-gray-900">
              Assignment Summary
            </h3>

            <p className="mt-1 text-sm leading-6 text-gray-600">
              The feature{" "}
              <span className="font-semibold text-gray-900">
                {analytics.feature_name}
              </span>{" "}
              is currently{" "}
              <span
                className={`font-semibold ${
                  analytics.is_enabled
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {analytics.is_enabled
                  ? "enabled"
                  : "disabled"}
              </span>{" "}
              for{" "}
              <span className="font-semibold text-gray-900">
                {analytics.user_name}
              </span>{" "}
              ({analytics.user_email}).
            </p>
          </div>

        </div>
      </div>

    </div>
  );
};

export default AssignmentAnalytics;