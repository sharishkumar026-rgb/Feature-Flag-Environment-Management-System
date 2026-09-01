import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  getRolloutAnalytics,
  RolloutAnalytics as RolloutAnalyticsType,
} from "../../api/analyticsApi";

const RolloutAnalytics: React.FC = () => {
  const { rolloutId } = useParams<{
    rolloutId: string;
  }>();

  const navigate = useNavigate();

  const [rollout, setRollout] =
    useState<RolloutAnalyticsType | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ============================================================
  // LOAD ROLLOUT ANALYTICS
  // ============================================================

  useEffect(() => {
    const loadAnalytics = async () => {
      if (!rolloutId) {
        setError("Rollout ID is required.");
        setLoading(false);
        return;
      }

      const id = Number(rolloutId);

      if (Number.isNaN(id)) {
        setError("Invalid rollout ID.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response =
          await getRolloutAnalytics(id);

        if (!response.success) {
          throw new Error(
            response.message ||
              "Failed to load rollout analytics."
          );
        }

        setRollout(response.rollout);
      } catch (err: any) {
        const message =
          err?.response?.data?.detail ||
          err?.response?.data?.message ||
          err?.message ||
          "Failed to load rollout analytics.";

        setError(message);
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, [rolloutId]);

  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />

          <p className="mt-4 text-sm text-gray-500">
            Loading rollout analytics...
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
                d="M12 9v2m0 4h.01M10.29 3.86l-7.5 13A1 1 0 003.66 18h16.68a2 2 0 001.73 3H3.66a2 2 0 01-1.73-3l7.5-13a2 2 0 013.46 0z"
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

  if (!rollout) {
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
          No rollout analytics
        </h3>

        <p className="mt-1 text-sm text-gray-500">
          Rollout analytics could not be found.
        </p>
      </div>
    );
  }

  // ============================================================
  // VALUES
  // ============================================================

  const percentage = Number(
    rollout.percentage ?? 0
  );

  const enabledUsers = Number(
    rollout.enabled_users ?? 0
  );

  const disabledUsers = Number(
    rollout.disabled_users ?? 0
  );

  const totalUsers =
    enabledUsers + disabledUsers;

  const enabledUserPercentage =
    totalUsers > 0
      ? Math.round(
          (enabledUsers / totalUsers) * 100
        )
      : 0;

  const disabledUserPercentage =
    totalUsers > 0
      ? Math.round(
          (disabledUsers / totalUsers) * 100
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
            Rollout Analytics
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Analytics and user distribution for this
            feature rollout.
          </p>
        </div>

        {/* ROLLOUT PERCENTAGE */}

        <div className="inline-flex items-center gap-2 self-start rounded-full bg-purple-100 px-4 py-2 text-sm font-semibold text-purple-700">
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
              d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
            />
          </svg>

          {percentage}% Rollout
        </div>

      </div>

      {/* ======================================================
          ROLLOUT INFORMATION
      ======================================================= */}

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">

          {/* ROLLOUT ID */}

          <div className="rounded-xl bg-gray-50 p-5">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Rollout ID
            </p>

            <p className="mt-2 text-2xl font-bold text-gray-900">
              {rollout.id}
            </p>
          </div>

          {/* FEATURE ID */}

          <div className="rounded-xl bg-blue-50 p-5">
            <p className="text-xs font-medium uppercase tracking-wide text-blue-600">
              Feature ID
            </p>

            <p className="mt-2 text-2xl font-bold text-blue-900">
              {rollout.feature_id}
            </p>
          </div>

          {/* ENVIRONMENT ID */}

          <div className="rounded-xl bg-orange-50 p-5">
            <p className="text-xs font-medium uppercase tracking-wide text-orange-600">
              Environment ID
            </p>

            <p className="mt-2 text-2xl font-bold text-orange-900">
              {rollout.environment_id}
            </p>
          </div>

        </div>

      </div>

      {/* ======================================================
          STAT CARDS
      ======================================================= */}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">

        {/* ROLLOUT PERCENTAGE */}

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm font-medium text-gray-500">
                Rollout Percentage
              </p>

              <p className="mt-2 text-3xl font-bold text-purple-600">
                {percentage}%
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

              <p className="mt-1 text-xs text-gray-500">
                {enabledUserPercentage}% of users
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

        {/* DISABLED USERS */}

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm font-medium text-gray-500">
                Disabled Users
              </p>

              <p className="mt-2 text-3xl font-bold text-red-600">
                {disabledUsers}
              </p>

              <p className="mt-1 text-xs text-gray-500">
                {disabledUserPercentage}% of users
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

      </div>

      {/* ======================================================
          ROLLOUT PROGRESS
      ======================================================= */}

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

        <div className="mb-6 flex items-center justify-between">

          <div>
            <h3 className="text-lg font-bold text-gray-900">
              Rollout Progress
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Current percentage of users included
              in the rollout.
            </p>
          </div>

          <span className="text-2xl font-bold text-purple-600">
            {percentage}%
          </span>

        </div>

        <div className="h-5 overflow-hidden rounded-full bg-gray-100">

          <div
            className="h-full rounded-full bg-purple-600 transition-all"
            style={{
              width: `${Math.min(
                Math.max(percentage, 0),
                100
              )}%`,
            }}
          />

        </div>

        <div className="mt-3 flex justify-between text-xs text-gray-500">
          <span>0%</span>
          <span>25%</span>
          <span>50%</span>
          <span>75%</span>
          <span>100%</span>
        </div>

      </div>

      {/* ======================================================
          USER DISTRIBUTION
      ======================================================= */}

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

        <div className="mb-6">

          <h3 className="text-lg font-bold text-gray-900">
            User Distribution
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            Enabled and disabled users associated
            with this rollout.
          </p>

        </div>

        <div className="space-y-5">

          {/* ENABLED */}

          <div>

            <div className="mb-2 flex items-center justify-between">

              <span className="text-sm font-medium text-gray-700">
                Enabled Users
              </span>

              <span className="text-sm font-semibold text-gray-900">
                {enabledUsers} (
                {enabledUserPercentage}%)
              </span>

            </div>

            <div className="h-3 overflow-hidden rounded-full bg-gray-100">

              <div
                className="h-full rounded-full bg-green-500 transition-all"
                style={{
                  width: `${enabledUserPercentage}%`,
                }}
              />

            </div>

          </div>

          {/* DISABLED */}

          <div>

            <div className="mb-2 flex items-center justify-between">

              <span className="text-sm font-medium text-gray-700">
                Disabled Users
              </span>

              <span className="text-sm font-semibold text-gray-900">
                {disabledUsers} (
                {disabledUserPercentage}%)
              </span>

            </div>

            <div className="h-3 overflow-hidden rounded-full bg-gray-100">

              <div
                className="h-full rounded-full bg-red-500 transition-all"
                style={{
                  width: `${disabledUserPercentage}%`,
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
              Rollout Percentage
            </p>

            <p className="mt-1 text-base font-semibold text-gray-900">
              {percentage}% of the rollout is
              configured.
            </p>
          </div>

          <div className="rounded-xl bg-gray-50 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Total Users
            </p>

            <p className="mt-1 text-base font-semibold text-gray-900">
              {totalUsers}
            </p>
          </div>

          <div className="rounded-xl bg-gray-50 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Enabled Users
            </p>

            <p className="mt-1 text-base font-semibold text-green-600">
              {enabledUsers}
            </p>
          </div>

          <div className="rounded-xl bg-gray-50 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Disabled Users
            </p>

            <p className="mt-1 text-base font-semibold text-red-600">
              {disabledUsers}
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};

export default RolloutAnalytics;