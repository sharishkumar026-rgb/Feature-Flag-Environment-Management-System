
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  getRolloutAnalytics,
  RolloutAnalytics as RolloutAnalyticsData,
} from "../../api/analyticsApi";

// ============================================================
// COMPONENT
// ============================================================

const RolloutAnalytics: React.FC = () => {
  const navigate = useNavigate();

  const { rollout_id } = useParams<{
    rollout_id: string;
  }>();

  const [rollout, setRollout] =
    useState<RolloutAnalyticsData | null>(null);

  const [loading, setLoading] =
    useState<boolean>(true);

  const [error, setError] =
    useState<string>("");

  // ==========================================================
  // LOAD ROLLOUT ANALYTICS
  // ==========================================================

  const loadRolloutAnalytics = async (): Promise<void> => {
    try {
      setLoading(true);
      setError("");

      if (!rollout_id) {
        setError("Rollout ID is missing.");
        return;
      }

      const id = Number(rollout_id);

      if (Number.isNaN(id)) {
        setError("Invalid rollout ID.");
        return;
      }

      const response =
        await getRolloutAnalytics(id);

      console.log(
        "Rollout analytics API response:",
        response
      );

      if (
        response &&
        response.rollout
      ) {
        setRollout(response.rollout);
      } else {
        setRollout(null);

        setError(
          response?.message ||
            "Rollout analytics data not found."
        );
      }
    } catch (err: any) {
      console.error(
        "Failed to load rollout analytics:",
        err
      );

      const message =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        err?.message ||
        "Failed to load rollout analytics.";

      setError(message);
      setRollout(null);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================================
  // INITIAL LOAD
  // ==========================================================

  useEffect(() => {
    loadRolloutAnalytics();
  }, [rollout_id]);

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
            Loading rollout analytics...
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
                Unable to load rollout analytics
              </h2>

              <p className="mt-1 text-sm text-red-700">
                {error}
              </p>

            </div>

            <button
              type="button"
              onClick={loadRolloutAnalytics}
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

  if (!rollout) {
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
            Rollout not found
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Rollout analytics could not be found.
          </p>

        </div>

      </div>
    );
  }

  // ==========================================================
  // CALCULATIONS
  // ==========================================================

  const enabledUsers =
    rollout.enabled_users;

  const disabledUsers =
    rollout.disabled_users;

  const totalUsers =
    enabledUsers + disabledUsers;

  const enabledPercentage =
    totalUsers > 0
      ? Math.round(
          (enabledUsers / totalUsers) * 100
        )
      : 0;

  const disabledPercentage =
    totalUsers > 0
      ? Math.round(
          (disabledUsers / totalUsers) * 100
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
            Rollout Analytics
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Analytics and user distribution for this rollout.
          </p>

        </div>

        <div className="rounded-xl bg-purple-100 px-4 py-2">

          <p className="text-xs font-semibold uppercase tracking-wide text-purple-600">
            Rollout
          </p>

          <p className="mt-1 text-lg font-bold text-purple-700">
            #{rollout.id}
          </p>

        </div>

      </div>

      {/* ======================================================
          ROLLOUT INFORMATION
      ======================================================= */}

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">

          {/* ROLLOUT ID */}

          <div className="rounded-xl bg-gray-50 p-5">

            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              Rollout ID
            </p>

            <p className="mt-2 text-2xl font-bold text-gray-900">
              #{rollout.id}
            </p>

          </div>

          {/* FEATURE ID */}

          <div className="rounded-xl bg-gray-50 p-5">

            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              Feature ID
            </p>

            <p className="mt-2 text-2xl font-bold text-gray-900">
              #{rollout.feature_id}
            </p>

          </div>

          {/* ENVIRONMENT ID */}

          <div className="rounded-xl bg-gray-50 p-5">

            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              Environment ID
            </p>

            <p className="mt-2 text-2xl font-bold text-gray-900">
              #{rollout.environment_id}
            </p>

          </div>

        </div>

      </div>

      {/* ======================================================
          STATISTICS
      ======================================================= */}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">

        {/* PERCENTAGE */}

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm font-medium text-gray-500">
                Rollout Percentage
              </p>

              <p className="mt-2 text-3xl font-bold text-blue-600">
                {rollout.percentage}%
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
                  d="M9 19V6m0 0l-3 3m3-3l3 3M15 5v13m0 0l-3-3m3 3l3-3"
                />
              </svg>

            </div>

          </div>

          <p className="mt-4 text-xs text-gray-400">
            Percentage configured for this rollout
          </p>

        </div>

        {/* ENABLED USERS */}

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm font-medium text-gray-500">
                Enabled Users
              </p>

              <p className="mt-2 text-3xl font-bold text-green-600">
                {enabledUsers}
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
            {enabledPercentage}% of assigned users
          </p>

        </div>

        {/* DISABLED USERS */}

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm font-medium text-gray-500">
                Disabled Users
              </p>

              <p className="mt-2 text-3xl font-bold text-gray-600">
                {disabledUsers}
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
            {disabledPercentage}% of assigned users
          </p>

        </div>

        {/* TOTAL USERS */}

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm font-medium text-gray-500">
                Total Users
              </p>

              <p className="mt-2 text-3xl font-bold text-purple-600">
                {totalUsers}
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
            Enabled + disabled users
          </p>

        </div>

      </div>

      {/* ======================================================
          USER DISTRIBUTION
      ======================================================= */}

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

        <div className="border-b border-gray-200 pb-5">

          <h2 className="text-lg font-bold text-gray-900">
            User Distribution
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Distribution of enabled and disabled users for this rollout.
          </p>

        </div>

        <div className="mt-6">

          {/* ENABLED */}

          <div className="mb-6">

            <div className="mb-2 flex items-center justify-between">

              <div className="flex items-center gap-2">

                <span className="h-3 w-3 rounded-full bg-green-500" />

                <span className="text-sm font-semibold text-gray-700">
                  Enabled Users
                </span>

              </div>

              <span className="text-sm font-bold text-green-600">
                {enabledUsers} ({enabledPercentage}%)
              </span>

            </div>

            <div className="h-4 overflow-hidden rounded-full bg-gray-100">

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

              <div className="flex items-center gap-2">

                <span className="h-3 w-3 rounded-full bg-gray-400" />

                <span className="text-sm font-semibold text-gray-700">
                  Disabled Users
                </span>

              </div>

              <span className="text-sm font-bold text-gray-600">
                {disabledUsers} ({disabledPercentage}%)
              </span>

            </div>

            <div className="h-4 overflow-hidden rounded-full bg-gray-100">

              <div
                className="h-full rounded-full bg-gray-400 transition-all"
                style={{
                  width: `${disabledPercentage}%`,
                }}
              />

            </div>

          </div>

        </div>

      </div>

      {/* ======================================================
          ROLLOUT CONFIGURATION
      ======================================================= */}

      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">

        <div className="border-b border-gray-200 px-6 py-5">

          <h2 className="text-lg font-bold text-gray-900">
            Rollout Configuration
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Configuration details for this rollout.
          </p>

        </div>

        <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-3">

          {/* ROLLOUT */}

          <div className="rounded-xl bg-gray-50 p-5">

            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              Rollout ID
            </p>

            <p className="mt-2 text-lg font-bold text-gray-900">
              {rollout.id}
            </p>

          </div>

          {/* FEATURE */}

          <div className="rounded-xl bg-gray-50 p-5">

            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              Feature ID
            </p>

            <p className="mt-2 text-lg font-bold text-gray-900">
              {rollout.feature_id}
            </p>

          </div>

          {/* ENVIRONMENT */}

          <div className="rounded-xl bg-gray-50 p-5">

            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              Environment ID
            </p>

            <p className="mt-2 text-lg font-bold text-gray-900">
              {rollout.environment_id}
            </p>

          </div>

        </div>

        <div className="border-t border-gray-100 px-6 py-6">

          <div className="mb-2 flex items-center justify-between">

            <span className="text-sm font-semibold text-gray-700">
              Rollout Percentage
            </span>

            <span className="text-sm font-bold text-blue-600">
              {rollout.percentage}%
            </span>

          </div>

          <div className="h-5 overflow-hidden rounded-full bg-gray-100">

            <div
              className="h-full rounded-full bg-blue-600 transition-all"
              style={{
                width: `${Math.min(
                  Math.max(rollout.percentage, 0),
                  100
                )}%`,
              }}
            />

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

export default RolloutAnalytics;

