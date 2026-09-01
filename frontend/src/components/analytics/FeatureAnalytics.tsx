import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import {
  getFeatureAnalytics,
  FeatureAnalytics as FeatureAnalyticsType,
} from "../../api/analyticsApi";

const FeatureAnalytics: React.FC = () => {
  const { featureId } = useParams<{
    featureId: string;
  }>();

  const navigate = useNavigate();

  const [feature, setFeature] =
    useState<FeatureAnalyticsType | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ============================================================
  // LOAD FEATURE ANALYTICS
  // ============================================================

  useEffect(() => {
    const loadAnalytics = async () => {
      if (!featureId) {
        setError("Feature ID is required.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await getFeatureAnalytics(
          Number(featureId)
        );

        if (!response.success) {
          throw new Error(
            response.message ||
              "Failed to load feature analytics."
          );
        }

        setFeature(response.feature);
      } catch (err: any) {
        const message =
          err?.response?.data?.detail ||
          err?.response?.data?.message ||
          err?.message ||
          "Failed to load feature analytics.";

        setError(message);
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, [featureId]);

  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />

          <p className="mt-4 text-sm text-gray-500">
            Loading feature analytics...
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
              onClick={() => navigate(-1)}
              className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================
  // NO DATA
  // ============================================================

  if (!feature) {
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
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h6l5 5v11a2 2 0 01-2 2z"
            />
          </svg>
        </div>

        <h3 className="mt-4 text-lg font-semibold text-gray-900">
          No analytics data
        </h3>

        <p className="mt-1 text-sm text-gray-500">
          Feature analytics could not be found.
        </p>
      </div>
    );
  }

  // ============================================================
  // CALCULATIONS
  // ============================================================

  const totalAssignments =
    feature.total_assignments ?? 0;

  const enabledAssignments =
    feature.enabled_assignments ?? 0;

  const disabledAssignments =
    feature.disabled_assignments ?? 0;

  const totalRollouts =
    feature.total_rollouts ?? 0;

  const enabledPercentage =
    totalAssignments > 0
      ? Math.round(
          (enabledAssignments /
            totalAssignments) *
            100
        )
      : 0;

  const disabledPercentage =
    totalAssignments > 0
      ? Math.round(
          (disabledAssignments /
            totalAssignments) *
            100
        )
      : 0;

  // ============================================================
  // UI
  // ============================================================

  return (
    <div className="space-y-6">

      {/* ======================================================
          PAGE HEADER
      ======================================================= */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mb-3 flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900"
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
            Analytics and usage information for this
            feature flag.
          </p>
        </div>

        <div
          className={`inline-flex items-center gap-2 self-start rounded-full px-4 py-2 text-sm font-semibold ${
            feature.is_enabled
              ? "bg-green-100 text-green-700"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          <span
            className={`h-2.5 w-2.5 rounded-full ${
              feature.is_enabled
                ? "bg-green-500"
                : "bg-gray-400"
            }`}
          />

          {feature.is_enabled
            ? "Enabled"
            : "Disabled"}
        </div>

      </div>

      {/* ======================================================
          FEATURE INFORMATION
      ======================================================= */}

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">

          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-blue-50">
            <svg
              className="h-8 w-8 text-blue-600"
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

          <div className="min-w-0">
            <h2 className="text-xl font-bold text-gray-900">
              {feature.name}
            </h2>

            <p className="mt-1 break-all font-mono text-sm text-gray-500">
              {feature.key}
            </p>

            <p className="mt-2 text-sm text-gray-500">
              Feature ID: {feature.id}
            </p>
          </div>

        </div>

      </div>

      {/* ======================================================
          STAT CARDS
      ======================================================= */}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">

        {/* TOTAL ASSIGNMENTS */}

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm font-medium text-gray-500">
                Total Assignments
              </p>

              <p className="mt-2 text-3xl font-bold text-gray-900">
                {totalAssignments}
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50">
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
                  d="M17 20h5v-2a4 4 0 00-4-4h-1M9 20H4v-2a4 4 0 014-4h1m4-5a4 4 0 100-8 4 4 0 000 8zm6 1a3 3 0 100-6 3 3 0 000 6z"
                />
              </svg>
            </div>

          </div>

        </div>

        {/* ENABLED ASSIGNMENTS */}

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm font-medium text-gray-500">
                Enabled Assignments
              </p>

              <p className="mt-2 text-3xl font-bold text-green-600">
                {enabledAssignments}
              </p>

              <p className="mt-1 text-xs text-gray-500">
                {enabledPercentage}% of assignments
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50">
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

        </div>

        {/* DISABLED ASSIGNMENTS */}

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm font-medium text-gray-500">
                Disabled Assignments
              </p>

              <p className="mt-2 text-3xl font-bold text-red-600">
                {disabledAssignments}
              </p>

              <p className="mt-1 text-xs text-gray-500">
                {disabledPercentage}% of assignments
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50">
              <svg
                className="h-6 w-6 text-red-600"
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

        </div>

        {/* TOTAL ROLLOUTS */}

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm font-medium text-gray-500">
                Total Rollouts
              </p>

              <p className="mt-2 text-3xl font-bold text-purple-600">
                {totalRollouts}
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50">
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

        </div>

      </div>

      {/* ======================================================
          ASSIGNMENT DISTRIBUTION
      ======================================================= */}

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

        <div className="mb-6">

          <h3 className="text-lg font-bold text-gray-900">
            Assignment Distribution
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            Distribution of enabled and disabled
            assignments.
          </p>

        </div>

        <div className="space-y-5">

          {/* ENABLED */}

          <div>

            <div className="mb-2 flex items-center justify-between">

              <span className="text-sm font-medium text-gray-700">
                Enabled
              </span>

              <span className="text-sm font-semibold text-gray-900">
                {enabledAssignments} (
                {enabledPercentage}%)
              </span>

            </div>

            <div className="h-3 overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-full rounded-full bg-green-500 transition-all"
                style={{
                  width: `${enabledPercentage}%`,
                }}
              />
            </div>

          </div>

          {/* DISABLED */}

          <div>

            <div className="mb-2 flex items-center justify-between">

              <span className="text-sm font-medium text-gray-700">
                Disabled
              </span>

              <span className="text-sm font-semibold text-gray-900">
                {disabledAssignments} (
                {disabledPercentage}%)
              </span>

            </div>

            <div className="h-3 overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-full rounded-full bg-red-500 transition-all"
                style={{
                  width: `${disabledPercentage}%`,
                }}
              />
            </div>

          </div>

        </div>

      </div>

      {/* ======================================================
          SUMMARY
      ======================================================= */}

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

        <h3 className="text-lg font-bold text-gray-900">
          Analytics Summary
        </h3>

        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">

          <div className="rounded-xl bg-gray-50 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Feature Status
            </p>

            <p className="mt-1 text-base font-semibold text-gray-900">
              {feature.is_enabled
                ? "Feature is currently enabled"
                : "Feature is currently disabled"}
            </p>
          </div>

          <div className="rounded-xl bg-gray-50 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Rollouts
            </p>

            <p className="mt-1 text-base font-semibold text-gray-900">
              {totalRollouts} rollout
              {totalRollouts === 1 ? "" : "s"}
              configured
            </p>
          </div>

          <div className="rounded-xl bg-gray-50 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Assignment Status
            </p>

            <p className="mt-1 text-base font-semibold text-gray-900">
              {enabledAssignments} enabled /{" "}
              {disabledAssignments} disabled
            </p>
          </div>

          <div className="rounded-xl bg-gray-50 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Feature Key
            </p>

            <p className="mt-1 break-all font-mono text-sm font-semibold text-gray-900">
              {feature.key}
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};

export default FeatureAnalytics;