
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  getFeatureAnalytics,
  FeatureAnalytics as FeatureAnalyticsData,
} from "../../api/analyticsApi";

// ============================================================
// COMPONENT
// ============================================================

const FeatureAnalytics: React.FC = () => {
  const navigate = useNavigate();

  const { feature_id } = useParams<{
    feature_id: string;
  }>();

  const [feature, setFeature] =
    useState<FeatureAnalyticsData | null>(null);

  const [loading, setLoading] =
    useState<boolean>(true);

  const [error, setError] =
    useState<string>("");

  // ==========================================================
  // LOAD FEATURE ANALYTICS
  // ==========================================================

  const loadFeatureAnalytics = async (): Promise<void> => {
    try {
      setLoading(true);
      setError("");

      if (!feature_id) {
        setError("Feature ID is missing.");
        return;
      }

      const id = Number(feature_id);

      if (Number.isNaN(id)) {
        setError("Invalid feature ID.");
        return;
      }

      const response =
        await getFeatureAnalytics(id);

      console.log(
        "Feature analytics API response:",
        response
      );

      if (
        response &&
        response.feature
      ) {
        setFeature(response.feature);
      } else {
        setFeature(null);

        setError(
          response?.message ||
            "Feature analytics data not found."
        );
      }
    } catch (err: any) {
      console.error(
        "Failed to load feature analytics:",
        err
      );

      const message =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        err?.message ||
        "Failed to load feature analytics.";

      setError(message);
      setFeature(null);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================================
  // INITIAL LOAD
  // ==========================================================

  useEffect(() => {
    loadFeatureAnalytics();
  }, [feature_id]);

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
            Loading feature analytics...
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
                Unable to load feature analytics
              </h2>

              <p className="mt-1 text-sm text-red-700">
                {error}
              </p>

            </div>

            <button
              type="button"
              onClick={loadFeatureAnalytics}
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

  if (!feature) {
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
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>

          </div>

          <h2 className="mt-4 text-lg font-semibold text-gray-900">
            Feature not found
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Feature analytics could not be found.
          </p>

        </div>

      </div>
    );
  }

  // ==========================================================
  // CALCULATIONS
  // ==========================================================

  const assignmentPercentage =
    feature.total_assignments > 0
      ? Math.round(
          (feature.enabled_assignments /
            feature.total_assignments) *
            100
        )
      : 0;

  const disabledAssignmentPercentage =
    feature.total_assignments > 0
      ? Math.round(
          (feature.disabled_assignments /
            feature.total_assignments) *
            100
        )
      : 0;

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
            Feature Analytics
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Analytics and assignment statistics for this feature.
          </p>

        </div>

        <div>

          {feature.is_enabled ? (
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

      {/* ======================================================
          FEATURE INFORMATION
      ======================================================= */}

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex items-center gap-4">

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-100">

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

              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Feature
              </p>

              <h2 className="mt-1 text-2xl font-bold text-gray-900">
                {feature.name}
              </h2>

              <code className="mt-2 inline-block rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600">
                {feature.key}
              </code>

            </div>

          </div>

          <div className="rounded-xl bg-gray-50 px-5 py-4">

            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              Feature ID
            </p>

            <p className="mt-1 text-xl font-bold text-gray-900">
              #{feature.id}
            </p>

          </div>

        </div>

      </div>

      {/* ======================================================
          STATISTICS
      ======================================================= */}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">

        {/* TOTAL ASSIGNMENTS */}

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm font-medium text-gray-500">
                Total Assignments
              </p>

              <p className="mt-2 text-3xl font-bold text-gray-900">
                {feature.total_assignments}
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
                  d="M17 20h5v-2a4 4 0 00-4-4h-1m-4 6H3v-2a4 4 0 014-4h4m4-6a4 4 0 11-8 0 4 4 0 018 0zm6 0a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>

            </div>

          </div>

          <p className="mt-4 text-xs text-gray-400">
            Users assigned to this feature
          </p>

        </div>

        {/* ENABLED ASSIGNMENTS */}

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm font-medium text-gray-500">
                Enabled Assignments
              </p>

              <p className="mt-2 text-3xl font-bold text-green-600">
                {feature.enabled_assignments}
              </p>

            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100">

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

            </div>

          </div>

          <p className="mt-4 text-xs text-gray-400">
            {assignmentPercentage}% of assignments enabled
          </p>

        </div>

        {/* DISABLED ASSIGNMENTS */}

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm font-medium text-gray-500">
                Disabled Assignments
              </p>

              <p className="mt-2 text-3xl font-bold text-gray-600">
                {feature.disabled_assignments}
              </p>

            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100">

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

            </div>

          </div>

          <p className="mt-4 text-xs text-gray-400">
            {disabledAssignmentPercentage}% of assignments disabled
          </p>

        </div>

        {/* TOTAL ROLLOUTS */}

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm font-medium text-gray-500">
                Total Rollouts
              </p>

              <p className="mt-2 text-3xl font-bold text-purple-600">
                {feature.total_rollouts}
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
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>

            </div>

          </div>

          <p className="mt-4 text-xs text-gray-400">
            Rollout configurations for this feature
          </p>

        </div>

      </div>

      {/* ======================================================
          ASSIGNMENT DISTRIBUTION
      ======================================================= */}

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">

        {/* ENABLED DISTRIBUTION */}

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

          <div className="flex items-center justify-between">

            <div>

              <h2 className="text-lg font-bold text-gray-900">
                Assignment Status
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Enabled versus disabled assignments.
              </p>

            </div>

          </div>

          <div className="mt-6">

            <div className="mb-2 flex items-center justify-between">

              <span className="text-sm font-medium text-gray-600">
                Enabled
              </span>

              <span className="text-sm font-bold text-green-600">
                {assignmentPercentage}%
              </span>

            </div>

            <div className="h-4 overflow-hidden rounded-full bg-gray-100">

              <div
                className="h-full rounded-full bg-green-500 transition-all"
                style={{
                  width: `${assignmentPercentage}%`,
                }}
              />

            </div>

            <div className="mt-5 flex items-center justify-between text-sm">

              <span className="text-gray-500">
                Enabled assignments
              </span>

              <span className="font-semibold text-gray-900">
                {feature.enabled_assignments}
              </span>

            </div>

            <div className="mt-3 flex items-center justify-between text-sm">

              <span className="text-gray-500">
                Disabled assignments
              </span>

              <span className="font-semibold text-gray-900">
                {feature.disabled_assignments}
              </span>

            </div>

          </div>

        </div>

        {/* ROLLOUT OVERVIEW */}

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

          <div className="flex items-center justify-between">

            <div>

              <h2 className="text-lg font-bold text-gray-900">
                Rollout Overview
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Current rollout configuration count.
              </p>

            </div>

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
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>

            </div>

          </div>

          <div className="mt-6">

            <div className="flex items-center gap-4">

              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-100">

                <span className="text-2xl font-bold text-purple-600">
                  {feature.total_rollouts}
                </span>

              </div>

              <div>

                <p className="text-base font-semibold text-gray-900">
                  Total Rollouts
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  Configured for this feature
                </p>

              </div>

            </div>

            <div className="mt-5 rounded-xl bg-gray-50 p-4">

              <p className="text-sm text-gray-600">
                Rollout configurations determine how this
                feature is distributed across environments.
              </p>

            </div>

          </div>

        </div>

      </div>

      {/* ======================================================
          FEATURE DETAILS
      ======================================================= */}

      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">

        <div className="border-b border-gray-200 px-6 py-5">

          <h2 className="text-lg font-bold text-gray-900">
            Feature Details
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Basic information about this feature flag.
          </p>

        </div>

        <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-3">

          <div className="rounded-xl bg-gray-50 p-5">

            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              Feature ID
            </p>

            <p className="mt-2 text-lg font-bold text-gray-900">
              {feature.id}
            </p>

          </div>

          <div className="rounded-xl bg-gray-50 p-5">

            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              Feature Name
            </p>

            <p className="mt-2 text-lg font-bold text-gray-900">
              {feature.name}
            </p>

          </div>

          <div className="rounded-xl bg-gray-50 p-5">

            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              Feature Key
            </p>

            <code className="mt-2 inline-block rounded-lg bg-white px-3 py-2 text-sm font-medium text-gray-700">
              {feature.key}
            </code>

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

export default FeatureAnalytics;

