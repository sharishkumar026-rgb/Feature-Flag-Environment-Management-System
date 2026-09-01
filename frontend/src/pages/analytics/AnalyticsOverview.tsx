
import React, { useEffect, useState } from "react";

import {
  getAnalyticsOverview,
  AnalyticsOverview as AnalyticsOverviewData,
} from "../../api/analyticsApi";

// ============================================================
// COMPONENT
// ============================================================

const AnalyticsOverview: React.FC = () => {
  const [overview, setOverview] =
    useState<AnalyticsOverviewData | null>(null);

  const [loading, setLoading] =
    useState<boolean>(true);

  const [error, setError] =
    useState<string>("");

  // ==========================================================
  // LOAD ANALYTICS OVERVIEW
  // ==========================================================

  const loadOverview = async (): Promise<void> => {
    try {
      setLoading(true);
      setError("");

      const response =
        await getAnalyticsOverview();

      console.log(
        "Analytics overview API response:",
        response
      );

      if (
        response &&
        response.overview
      ) {
        setOverview(response.overview);
      } else {
        setOverview(null);
        setError(
          response?.message ||
            "Analytics overview data not found."
        );
      }
    } catch (err: any) {
      console.error(
        "Failed to load analytics overview:",
        err
      );

      const message =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        err?.message ||
        "Failed to load analytics overview.";

      setError(message);
      setOverview(null);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================================
  // INITIAL LOAD
  // ==========================================================

  useEffect(() => {
    loadOverview();
  }, []);

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
            Loading analytics...
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
      <div className="space-y-6">

        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Analytics Overview
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Overview of feature flags, environments,
            rollouts, assignments and users.
          </p>
        </div>

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
                Unable to load analytics
              </h2>

              <p className="mt-1 text-sm text-red-700">
                {error}
              </p>

            </div>

            <button
              type="button"
              onClick={loadOverview}
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
  // NO DATA
  // ==========================================================

  if (!overview) {
    return (
      <div className="space-y-6">

        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Analytics Overview
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Overview of feature flags, environments,
            rollouts, assignments and users.
          </p>
        </div>

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
                d="M3 3v18h18M7 16v-5m5 5V7m5 9v-8"
              />
            </svg>

          </div>

          <h2 className="mt-4 text-lg font-semibold text-gray-900">
            No analytics data available
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Analytics overview data could not be retrieved.
          </p>

          <button
            type="button"
            onClick={loadOverview}
            className="mt-5 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Refresh
          </button>

        </div>

      </div>
    );
  }

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

          <h1 className="text-2xl font-bold text-gray-900">
            Analytics Overview
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Overview of feature flags, environments,
            rollouts, assignments and users.
          </p>

        </div>

        <button
          type="button"
          onClick={loadOverview}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50"
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
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>

          Refresh

        </button>

      </div>

      {/* ======================================================
          STATISTICS
      ======================================================= */}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">

        {/* TOTAL FEATURES */}

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm font-medium text-gray-500">
                Total Features
              </p>

              <p className="mt-2 text-3xl font-bold text-gray-900">
                {overview.total_features}
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
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>

            </div>

          </div>

          <div className="mt-4 flex items-center gap-2 text-xs">

            <span className="rounded-lg bg-green-100 px-2.5 py-1 font-semibold text-green-700">
              {overview.enabled_features} Enabled
            </span>

            <span className="rounded-lg bg-gray-100 px-2.5 py-1 font-semibold text-gray-600">
              {overview.disabled_features} Disabled
            </span>

          </div>

        </div>

        {/* ENVIRONMENTS */}

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm font-medium text-gray-500">
                Total Environments
              </p>

              <p className="mt-2 text-3xl font-bold text-gray-900">
                {overview.total_environments}
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
                  d="M3 7h18M5 7v10a2 2 0 002 2h10a2 2 0 002-2V7M8 7V5a1 1 0 011-1h6a1 1 0 011 1v2"
                />
              </svg>

            </div>

          </div>

          <p className="mt-4 text-xs text-gray-400">
            Available application environments
          </p>

        </div>

        {/* ROLLOUTS */}

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm font-medium text-gray-500">
                Total Rollouts
              </p>

              <p className="mt-2 text-3xl font-bold text-gray-900">
                {overview.total_rollouts}
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
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>

            </div>

          </div>

          <p className="mt-4 text-xs text-gray-400">
            Feature rollout configurations
          </p>

        </div>

        {/* ASSIGNMENTS */}

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm font-medium text-gray-500">
                Total Assignments
              </p>

              <p className="mt-2 text-3xl font-bold text-gray-900">
                {overview.total_assignments}
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
                  d="M17 20h5v-2a4 4 0 00-4-4h-1m-4 6H3v-2a4 4 0 014-4h4m4-6a4 4 0 11-8 0 4 4 0 018 0zm6 0a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>

            </div>

          </div>

          <p className="mt-4 text-xs text-gray-400">
            User feature assignments
          </p>

        </div>

      </div>

      {/* ======================================================
          FEATURE STATUS
      ======================================================= */}

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">

        {/* FEATURE STATUS */}

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

          <div className="flex items-center justify-between">

            <div>

              <h2 className="text-lg font-bold text-gray-900">
                Feature Status
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Enabled and disabled feature flags.
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
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>

            </div>

          </div>

          <div className="mt-6 space-y-5">

            {/* ENABLED */}

            <div>

              <div className="mb-2 flex items-center justify-between">

                <span className="text-sm font-medium text-gray-600">
                  Enabled Features
                </span>

                <span className="text-sm font-bold text-green-600">
                  {overview.enabled_features}
                </span>

              </div>

              <div className="h-3 overflow-hidden rounded-full bg-gray-100">

                <div
                  className="h-full rounded-full bg-green-500 transition-all"
                  style={{
                    width:
                      overview.total_features > 0
                        ? `${Math.min(
                            100,
                            (overview.enabled_features /
                              overview.total_features) *
                              100
                          )}%`
                        : "0%",
                  }}
                />

              </div>

            </div>

            {/* DISABLED */}

            <div>

              <div className="mb-2 flex items-center justify-between">

                <span className="text-sm font-medium text-gray-600">
                  Disabled Features
                </span>

                <span className="text-sm font-bold text-gray-600">
                  {overview.disabled_features}
                </span>

              </div>

              <div className="h-3 overflow-hidden rounded-full bg-gray-100">

                <div
                  className="h-full rounded-full bg-gray-400 transition-all"
                  style={{
                    width:
                      overview.total_features > 0
                        ? `${Math.min(
                            100,
                            (overview.disabled_features /
                              overview.total_features) *
                              100
                          )}%`
                        : "0%",
                  }}
                />

              </div>

            </div>

          </div>

        </div>

        {/* USER ACTIVITY */}

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

          <div className="flex items-center justify-between">

            <div>

              <h2 className="text-lg font-bold text-gray-900">
                User Activity
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Current active users in the system.
              </p>

            </div>

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
                  d="M17 20h5v-2a4 4 0 00-4-4h-1m-4 6H3v-2a4 4 0 014-4h4m4-6a4 4 0 11-8 0 4 4 0 018 0zm6 0a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>

            </div>

          </div>

          <div className="mt-6">

            <div className="flex items-end gap-3">

              <span className="text-5xl font-bold text-gray-900">
                {overview.active_users}
              </span>

              <span className="mb-1 text-sm font-medium text-gray-500">
                Active Users
              </span>

            </div>

            <div className="mt-5 rounded-xl bg-blue-50 p-4">

              <div className="flex items-center gap-3">

                <span className="h-3 w-3 rounded-full bg-blue-500" />

                <p className="text-sm font-medium text-blue-800">
                  Users currently active in the platform
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* ======================================================
          SUMMARY
      ======================================================= */}

      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">

        <div className="border-b border-gray-200 px-6 py-5">

          <h2 className="text-lg font-bold text-gray-900">
            Analytics Summary
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Current system analytics overview.
          </p>

        </div>

        <div className="grid grid-cols-2 gap-4 p-6 md:grid-cols-3 lg:grid-cols-6">

          <div className="rounded-xl bg-gray-50 p-4 text-center">

            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              Features
            </p>

            <p className="mt-2 text-2xl font-bold text-gray-900">
              {overview.total_features}
            </p>

          </div>

          <div className="rounded-xl bg-gray-50 p-4 text-center">

            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              Enabled
            </p>

            <p className="mt-2 text-2xl font-bold text-green-600">
              {overview.enabled_features}
            </p>

          </div>

          <div className="rounded-xl bg-gray-50 p-4 text-center">

            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              Disabled
            </p>

            <p className="mt-2 text-2xl font-bold text-gray-600">
              {overview.disabled_features}
            </p>

          </div>

          <div className="rounded-xl bg-gray-50 p-4 text-center">

            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              Environments
            </p>

            <p className="mt-2 text-2xl font-bold text-orange-600">
              {overview.total_environments}
            </p>

          </div>

          <div className="rounded-xl bg-gray-50 p-4 text-center">

            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              Rollouts
            </p>

            <p className="mt-2 text-2xl font-bold text-blue-600">
              {overview.total_rollouts}
            </p>

          </div>

          <div className="rounded-xl bg-gray-50 p-4 text-center">

            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              Assignments
            </p>

            <p className="mt-2 text-2xl font-bold text-purple-600">
              {overview.total_assignments}
            </p>

          </div>

        </div>

      </div>

    </div>
  );
};

export default AnalyticsOverview;

