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
  const { environmentId } = useParams<{
    environmentId: string;
  }>();

  const navigate = useNavigate();

  const [environment, setEnvironment] =
    useState<EnvironmentAnalyticsData | null>(null);

  const [loading, setLoading] =
    useState<boolean>(true);

  const [error, setError] =
    useState<string>("");

  // ============================================================
  // FETCH ENVIRONMENT ANALYTICS
  // ============================================================

  useEffect(() => {
    const fetchEnvironmentAnalytics = async () => {
      if (!environmentId) {
        setError("Environment ID is required.");
        setLoading(false);
        return;
      }

      const id = Number(environmentId);

      if (Number.isNaN(id)) {
        setError("Invalid environment ID.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response =
          await getEnvironmentAnalytics(id);

        const data =
          response?.environment ?? null;

        setEnvironment(data);
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
      } finally {
        setLoading(false);
      }
    };

    fetchEnvironmentAnalytics();
  }, [environmentId]);

  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">

          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />

          <p className="mt-4 text-sm font-medium text-gray-600">
            Loading environment analytics...
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
      <div className="space-y-6">

        <div className="flex items-center gap-3">

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            Back
          </button>

          <h1 className="text-2xl font-bold text-gray-900">
            Environment Analytics
          </h1>

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
                d="M12 9v2m0 4h.01M10.29 3.86l-7.5 13A2 2 0 004.03 20h15.94a2 2 0 001.74-3.14l-7.5-13a2 2 0 00-3.42 0z"
              />
            </svg>

            <div>

              <h3 className="font-semibold text-red-800">
                Unable to load environment analytics
              </h3>

              <p className="mt-1 text-sm text-red-700">
                {error}
              </p>

            </div>

          </div>

        </div>

      </div>
    );
  }

  // ============================================================
  // NO DATA
  // ============================================================

  if (!environment) {
    return (
      <div className="space-y-6">

        <div className="flex items-center gap-3">

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            Back
          </button>

          <h1 className="text-2xl font-bold text-gray-900">
            Environment Analytics
          </h1>

        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm">

          <p className="text-sm text-gray-500">
            No environment analytics data found.
          </p>

        </div>

      </div>
    );
  }

  // ============================================================
  // SAFE VALUES
  // ============================================================

  const environmentIdValue =
    environment.id ?? environmentId;

  const totalFeatures =
    environment.total_features ?? 0;

  const enabledFeatures =
    environment.enabled_features ?? 0;

  const disabledFeatures =
    environment.disabled_features ?? 0;

  const totalRollouts =
    environment.total_rollouts ?? 0;

  // ============================================================
  // UI
  // ============================================================

  return (
    <div className="space-y-6">

      {/* ======================================================
          HEADER
      ======================================================= */}

      <div>

        <div className="mb-4">

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            Back
          </button>

        </div>

        <h1 className="text-2xl font-bold text-gray-900">
          Environment Analytics
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Analytics information for environment #
          {environmentIdValue}
        </p>

      </div>

      {/* ======================================================
          SUMMARY CARDS
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
                {totalFeatures}
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
                  d="M12 3v18m9-9H3"
                />
              </svg>

            </div>

          </div>

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

        {/* DISABLED FEATURES */}

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm font-medium text-gray-500">
                Disabled Features
              </p>

              <p className="mt-2 text-3xl font-bold text-red-600">
                {disabledFeatures}
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
                  d="M3 17l6-6 4 4 8-8"
                />
              </svg>

            </div>

          </div>

        </div>

      </div>

      {/* ======================================================
          ENVIRONMENT DETAILS
      ======================================================= */}

      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">

        <div className="border-b border-gray-200 px-6 py-5">

          <h2 className="text-lg font-bold text-gray-900">
            Environment Details
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Information related to this environment.
          </p>

        </div>

        <div className="grid grid-cols-1 gap-6 p-6 sm:grid-cols-2">

          {/* ENVIRONMENT ID */}

          <div>

            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Environment ID
            </p>

            <p className="mt-1 text-sm font-semibold text-gray-900">
              {environmentIdValue}
            </p>

          </div>

          {/* TOTAL FEATURES */}

          <div>

            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Total Features
            </p>

            <p className="mt-1 text-sm font-semibold text-gray-900">
              {totalFeatures}
            </p>

          </div>

          {/* ENABLED */}

          <div>

            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Enabled Features
            </p>

            <p className="mt-1 text-sm font-semibold text-green-600">
              {enabledFeatures}
            </p>

          </div>

          {/* DISABLED */}

          <div>

            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Disabled Features
            </p>

            <p className="mt-1 text-sm font-semibold text-red-600">
              {disabledFeatures}
            </p>

          </div>

          {/* ROLLOUTS */}

          <div>

            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Total Rollouts
            </p>

            <p className="mt-1 text-sm font-semibold text-purple-600">
              {totalRollouts}
            </p>

          </div>

        </div>

      </div>

      {/* ======================================================
          FEATURE STATUS
      ======================================================= */}

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

        <h2 className="text-lg font-bold text-gray-900">
          Feature Status
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Current feature distribution in this environment.
        </p>

        <div className="mt-6 space-y-5">

          {/* ENABLED */}

          <div>

            <div className="mb-2 flex items-center justify-between">

              <span className="text-sm font-medium text-gray-700">
                Enabled
              </span>

              <span className="text-sm font-semibold text-gray-900">
                {enabledFeatures}
              </span>

            </div>

            <div className="h-3 overflow-hidden rounded-full bg-gray-100">

              <div
                className="h-full rounded-full bg-green-500 transition-all"
                style={{
                  width:
                    totalFeatures > 0
                      ? `${Math.min(
                          (enabledFeatures /
                            totalFeatures) *
                            100,
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

              <span className="text-sm font-medium text-gray-700">
                Disabled
              </span>

              <span className="text-sm font-semibold text-gray-900">
                {disabledFeatures}
              </span>

            </div>

            <div className="h-3 overflow-hidden rounded-full bg-gray-100">

              <div
                className="h-full rounded-full bg-red-500 transition-all"
                style={{
                  width:
                    totalFeatures > 0
                      ? `${Math.min(
                          (disabledFeatures /
                            totalFeatures) *
                            100,
                          100
                        )}%`
                      : "0%",
                }}
              />

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default EnvironmentAnalytics;