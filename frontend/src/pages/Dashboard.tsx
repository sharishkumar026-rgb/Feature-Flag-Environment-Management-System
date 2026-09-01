import React, { useEffect, useState } from "react";

import StatsCards from "../components/dashboard/StatsCards";
import OverviewCharts from "../components/analytics/OverviewCharts";

import api from "../api/axios";

// ============================================================
// TYPES
// ============================================================

interface AnalyticsOverview {
  total_features: number;
  enabled_features: number;
  disabled_features: number;

  total_environments: number;
  total_rollouts: number;
  total_assignments: number;
  active_users: number;
}

interface AnalyticsOverviewResponse {
  success: boolean;
  message: string;
  overview: AnalyticsOverview;
}

// ============================================================
// DEFAULT DATA
// ============================================================

const defaultOverview: AnalyticsOverview = {
  total_features: 0,
  enabled_features: 0,
  disabled_features: 0,
  total_environments: 0,
  total_rollouts: 0,
  total_assignments: 0,
  active_users: 0,
};

// ============================================================
// DASHBOARD
// ============================================================

const Dashboard: React.FC = () => {
  const [overview, setOverview] =
    useState<AnalyticsOverview>(defaultOverview);

  const [loading, setLoading] =
    useState<boolean>(true);

  const [error, setError] =
    useState<string>("");

  // ==========================================================
  // GET ANALYTICS OVERVIEW
  // GET /api/analytics/overview
  // ==========================================================

  const fetchOverview = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await api.get<AnalyticsOverviewResponse>(
          "/analytics/overview"
        );

      if (response.data.success) {
        setOverview(
          response.data.overview
        );
      } else {
        setError(
          response.data.message ||
            "Unable to load dashboard data."
        );
      }
    } catch (err: any) {
      const message =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        err?.message ||
        "Failed to load dashboard data.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================================
  // LOAD DATA
  // ==========================================================

  useEffect(() => {
    fetchOverview();
  }, []);

  // ==========================================================
  // CHART DATA
  // ==========================================================

  const featureFlagData = [
    {
      name: "Feature Flags",
      enabled: overview.enabled_features,
      disabled: overview.disabled_features,
    },
  ];

  const rolloutData =
    overview.total_rollouts > 0
      ? [
          {
            name: "Rollouts",
            percentage: 100,
          },
        ]
      : [
          {
            name: "No Data",
            percentage: 0,
          },
        ];

  const activityData = [
    {
      date: "Features",
      activity: overview.total_features,
    },
    {
      date: "Rollouts",
      activity: overview.total_rollouts,
    },
    {
      date: "Assignments",
      activity: overview.total_assignments,
    },
    {
      date: "Users",
      activity: overview.active_users,
    },
  ];

  const environmentData =
    overview.total_environments > 0
      ? [
          {
            name: "Environments",
            value: overview.total_environments,
          },
        ]
      : [];

  // ==========================================================
  // UI
  // ==========================================================

  return (
    <div className="space-y-6">

      {/* ====================================================
          PAGE HEADER
      ===================================================== */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Dashboard
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Overview of your feature flag system
          </p>
        </div>

        <button
          type="button"
          onClick={fetchOverview}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <svg
            className={`h-4 w-4 ${
              loading ? "animate-spin" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h5M20 20v-5h-5M5.64 18.36A9 9 0 0118.36 5.64M18.36 18.36A9 9 0 015.64 5.64"
            />
          </svg>

          {loading ? "Refreshing..." : "Refresh"}
        </button>

      </div>

      {/* ====================================================
          ERROR MESSAGE
      ===================================================== */}

      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3">

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
              d="M12 9v2m0 4h.01M10.29 3.86l-7.5 13A1 1 0 003.66 18h16.68a2 2 0 00.87-1.5l-7.5-13a1 1 0 00-1.74 0z"
            />
          </svg>

          <div>
            <p className="text-sm font-medium text-red-800">
              Unable to load dashboard
            </p>

            <p className="mt-1 text-sm text-red-700">
              {error}
            </p>
          </div>

        </div>
      )}

      {/* ====================================================
          LOADING
      ===================================================== */}

      {loading ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">

          {[1, 2, 3, 4].map(
            (item) => (
              <div
                key={item}
                className="h-32 animate-pulse rounded-2xl border border-gray-200 bg-white"
              />
            )
          )}

        </div>
      ) : (
        <>
          {/* ================================================
              STAT CARDS
          ================================================= */}

          <StatsCards
            totalFeatures={
              overview.total_features
            }
            enabledFeatures={
              overview.enabled_features
            }
            disabledFeatures={
              overview.disabled_features
            }
            totalEnvironments={
              overview.total_environments
            }
            totalRollouts={
              overview.total_rollouts
            }
            totalAssignments={
              overview.total_assignments
            }
            activeUsers={
              overview.active_users
            }
          />

          {/* ================================================
              OVERVIEW CHARTS
          ================================================= */}

          <OverviewCharts
            featureFlagData={
              featureFlagData
            }
            rolloutData={
              rolloutData
            }
            activityData={
              activityData
            }
            environmentData={
              environmentData
            }
          />
        </>
      )}

    </div>
  );
};

export default Dashboard;