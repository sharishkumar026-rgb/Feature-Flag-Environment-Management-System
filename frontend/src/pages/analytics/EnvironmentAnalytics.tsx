
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  getEnvironmentAnalytics,
  EnvironmentAnalytics as EnvironmentAnalyticsData,
} from "../../api/analyticsApi";

// ============================================================
// COMPONENT
// ============================================================

const EnvironmentAnalytics: React.FC = () => {
  const navigate = useNavigate();

  const { environment_id } = useParams<{
    environment_id: string;
  }>();

  const [environment, setEnvironment] =
    useState<EnvironmentAnalyticsData | null>(null);

  const [loading, setLoading] =
    useState<boolean>(true);

  const [error, setError] =
    useState<string>("");

  // ==========================================================
  // LOAD ENVIRONMENT ANALYTICS
  // ==========================================================

  const loadEnvironmentAnalytics = async (): Promise<void> => {
    try {
      setLoading(true);
      setError("");

      if (!environment_id) {
        setError("Environment ID is missing.");
        return;
      }

      const id = Number(environment_id);

      if (Number.isNaN(id)) {
        setError("Invalid environment ID.");
        return;
      }

      const response =
        await getEnvironmentAnalytics(id);

      console.log(
        "Environment analytics API response:",
        response
      );

      if (
        response &&
        response.environment
      ) {
        setEnvironment(response.environment);
      } else {
        setEnvironment(null);

        setError(
          response?.message ||
            "Environment analytics data not found."
        );
      }
    } catch (err: any) {
      console.error(
        "Failed to load environment analytics:",
        err
      );

      const message =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        err?.message ||
        "Failed to load environment analytics.";

      setError(message);
      setEnvironment(null);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================================
  // INITIAL LOAD
  // ==========================================================

  useEffect(() => {
    loadEnvironmentAnalytics();
  }, [environment_id]);

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
            Loading environment analytics...
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
                Unable to load environment analytics
              </h2>

              <p className="mt-1 text-sm text-red-700">
                {error}
              </p>

            </div>

            <button
              type="button"
              onClick={loadEnvironmentAnalytics}
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

  if (!environment) {
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
                d="M3 7h18M5 7v10a2 2 0 002 2h10a2 2 0 002-2V7M8 7V5a1 1 0 011-1h6a1 1 0 011 1v2"
              />
            </svg>

          </div>

          <h2 className="mt-4 text-lg font-semibold text-gray-900">
            Environment not found
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Environment analytics could not be found.
          </p>

        </div>

      </div>
    );
  }

  // ==========================================================
  // CALCULATIONS
  // ==========================================================

  const totalFeatures =
    environment.total_features;

  const enabledFeatures =
    environment.enabled_features;

  const disabledFeatures =
    environment.disabled_features;

  const totalRollouts =
    environment.total_rollouts;

  const enabledPercentage =
    totalFeatures > 0
      ? Math.round(
          (enabledFeatures / totalFeatures) * 100
        )
      : 0;

  const disabledPercentage =
    totalFeatures > 0
      ? Math.round(
          (disabledFeatures / totalFeatures) * 100
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
            Environment Analytics
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Analytics overview for this environment.
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

      {/* ======================================================
          ENVIRONMENT INFORMATION
      ======================================================= */}

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">

          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-orange-100">

            <svg
              className="h-8 w-8 text-orange-600"
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

          <div className="min-w-0 flex-1">

            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              Environment
            </p>

            <h2 className="mt-1 text-2xl font-bold text-gray-900">
              {environment.name}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Environment ID: {environment.id}
            </p>

          </div>

          <div className="rounded-xl bg-gray-50 px-5 py-4">

            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              Total Rollouts
            </p>

            <p className="mt-1 text-2xl font-bold text-gray-900">
              {totalRollouts}
            </p>

          </div>

        </div>

      </div>

      {/* ======================================================
          STATISTICS
      ======================================================= */}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">

        {/* TOTAL FEATURES */}

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm font-medium text-gray-500">
                Total Features
              </p>

              <p className="mt-2 text-3xl font-bold text-blue-600">
                {totalFeatures}
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
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>

            </div>

          </div>

          <p className="mt-4 text-xs text-gray-400">
            Features available in this environment
          </p>

        </div>

        {/* ENABLED FEATURES */}

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm font-medium text-gray-500">
                Enabled Features
              </p>

              <p className="mt-2 text-3xl font-bold text-green-600">
                {enabledFeatures}
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
            {enabledPercentage}% of total features
          </p>

        </div>

        {/* DISABLED FEATURES */}

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm font-medium text-gray-500">
                Disabled Features
              </p>

              <p className="mt-2 text-3xl font-bold text-gray-500">
                {disabledFeatures}
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
            {disabledPercentage}% of total features
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
                {totalRollouts}
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
                  d="M13 7h8m0 0v8m0-8L10 18l-4-4-4 4"
                />
              </svg>

            </div>

          </div>

          <p className="mt-4 text-xs text-gray-400">
            Rollouts configured for this environment
          </p>

        </div>

      </div>

      {/* ======================================================
          FEATURE STATUS
      ======================================================= */}

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

        <div className="border-b border-gray-200 pb-5">

          <h2 className="text-lg font-bold text-gray-900">
            Feature Status
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Distribution of enabled and disabled features.
          </p>

        </div>

        <div className="mt-6">

          {/* PROGRESS */}

          <div className="h-5 w-full overflow-hidden rounded-full bg-gray-200">

            {totalFeatures > 0 && (
              <div
                className="h-full rounded-full bg-green-500 transition-all"
                style={{
                  width: `${enabledPercentage}%`,
                }}
              />
            )}

          </div>

          {/* LEGEND */}

          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">

            <div className="flex items-center justify-between rounded-xl bg-green-50 p-4">

              <div className="flex items-center gap-3">

                <span className="h-3 w-3 rounded-full bg-green-500" />

                <span className="text-sm font-semibold text-gray-700">
                  Enabled
                </span>

              </div>

              <span className="text-sm font-bold text-green-700">
                {enabledFeatures}
              </span>

            </div>

            <div className="flex items-center justify-between rounded-xl bg-gray-50 p-4">

              <div className="flex items-center gap-3">

                <span className="h-3 w-3 rounded-full bg-gray-400" />

                <span className="text-sm font-semibold text-gray-700">
                  Disabled
                </span>

              </div>

              <span className="text-sm font-bold text-gray-600">
                {disabledFeatures}
              </span>

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
            Summary of the current environment configuration.
          </p>

        </div>

        <div className="grid grid-cols-1 gap-5 p-6 md:grid-cols-3">

          <div className="rounded-xl bg-blue-50 p-5">

            <p className="text-xs font-semibold uppercase tracking-wide text-blue-500">
              Environment
            </p>

            <p className="mt-2 text-lg font-bold text-gray-900">
              {environment.name}
            </p>

            <p className="mt-1 text-sm text-gray-500">
              ID: {environment.id}
            </p>

          </div>

          <div className="rounded-xl bg-green-50 p-5">

            <p className="text-xs font-semibold uppercase tracking-wide text-green-600">
              Feature Availability
            </p>

            <p className="mt-2 text-lg font-bold text-gray-900">
              {enabledFeatures} Enabled
            </p>

            <p className="mt-1 text-sm text-gray-500">
              {disabledFeatures} Disabled
            </p>

          </div>

          <div className="rounded-xl bg-purple-50 p-5">

            <p className="text-xs font-semibold uppercase tracking-wide text-purple-600">
              Rollouts
            </p>

            <p className="mt-2 text-lg font-bold text-gray-900">
              {totalRollouts}
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Total configured rollouts
            </p>

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

export default EnvironmentAnalytics;

