import React, { useEffect, useState } from "react";
import { getFeatureFlagById } from "../../api/featureFlagApi";

interface FeatureFlagDetailsData {
  id: number;
  name: string;
  key?: string;
  description?: string;
  is_enabled?: boolean;
  is_active?: boolean;
  environment_id?: number;

  created_at?: string;
  updated_at?: string;

  created_by?: {
    id?: number;
    name?: string;
    email?: string;
    role?: string;
  };

  updated_by?: {
    id?: number;
    name?: string;
    email?: string;
    role?: string;
  };

  environment?: {
    id?: number;
    name?: string;
    key?: string;
  };
}

interface FeatureFlagDetailsProps {
  featureId: number;
  onBack?: () => void;
  onEdit?: (featureFlag: FeatureFlagDetailsData) => void;
}

const FeatureFlagDetails: React.FC<
  FeatureFlagDetailsProps
> = ({
  featureId,
  onBack,
  onEdit,
}) => {
  const [featureFlag, setFeatureFlag] =
    useState<FeatureFlagDetailsData | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ============================================================
  // GET FEATURE FLAG BY ID
  // GET /api/feature-flags/{feature_id}
  // ============================================================

  const fetchFeatureFlag = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await getFeatureFlagById(featureId);

      const data =
        response?.data ||
        response?.feature_flag ||
        response;

      setFeatureFlag(data);
    } catch (err: any) {
      const message =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        err?.message ||
        "Failed to retrieve feature flag details.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // LOAD
  // ============================================================

  useEffect(() => {
    if (featureId) {
      fetchFeatureFlag();
    }
  }, [featureId]);

  // ============================================================
  // DATE FORMAT
  // ============================================================

  const formatDate = (date?: string) => {
    if (!date) {
      return "-";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "-";
    }

    return parsedDate.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // ============================================================
  // STATUS
  // ============================================================

  const isEnabled =
    featureFlag?.is_enabled === true ||
    featureFlag?.is_active === true;

  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-col items-center gap-3">

          <svg
            className="h-9 w-9 animate-spin text-blue-600"
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
            Loading feature flag...
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
      <div className="rounded-2xl border border-red-200 bg-white p-8 shadow-sm">

        <div className="flex flex-col items-center text-center">

          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
            <svg
              className="h-7 w-7 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01M10.29 3.86l-7.5 13A2 2 0 004.53 18h14.94a2 2 0 001.74-3l-7.5-13a2 2 0 00-3.42 0z"
              />
            </svg>
          </div>

          <h2 className="mt-4 text-lg font-semibold text-gray-900">
            Unable to load feature flag
          </h2>

          <p className="mt-2 max-w-md text-sm text-red-600">
            {error}
          </p>

          <div className="mt-6 flex gap-3">

            <button
              type="button"
              onClick={fetchFeatureFlag}
              className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Try Again
            </button>

            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="rounded-xl border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                Back
              </button>
            )}

          </div>

        </div>
      </div>
    );
  }

  // ============================================================
  // NOT FOUND
  // ============================================================

  if (!featureFlag) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm">

        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100">
          <svg
            className="h-7 w-7 text-gray-400"
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
          Feature flag not found
        </h2>

        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="mt-5 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Back to Feature Flags
          </button>
        )}

      </div>
    );
  }

  // ============================================================
  // MAIN UI
  // ============================================================

  return (
    <div className="space-y-6">

      {/* ========================================================
          TOP BAR
      ========================================================= */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div className="flex items-center gap-3">

          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 transition hover:bg-gray-50 hover:text-gray-900"
              title="Back"
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
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
            </button>
          )}

          <div>
            <p className="text-sm text-gray-500">
              Feature Flags
            </p>

            <h1 className="text-2xl font-bold text-gray-900">
              Feature Details
            </h1>
          </div>

        </div>

        {onEdit && (
          <button
            type="button"
            onClick={() =>
              onEdit(featureFlag)
            }
            className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
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
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1-4-1 1-4 9.5-9.5z"
              />
            </svg>

            Edit Feature
          </button>
        )}

      </div>

      {/* ========================================================
          FEATURE HEADER CARD
      ========================================================= */}

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

        <div className="p-6">

          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-center gap-4">

              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">

                <svg
                  className="h-8 w-8"
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

              <div className="min-w-0">

                <h2 className="text-xl font-bold text-gray-900">
                  {featureFlag.name}
                </h2>

                <div className="mt-2 flex flex-wrap items-center gap-2">

                  <code className="rounded-lg bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                    {featureFlag.key ||
                      "No key"}
                  </code>

                  <span className="text-xs text-gray-400">
                    ID #{featureFlag.id}
                  </span>

                </div>

              </div>

            </div>

            {/* STATUS */}

            {isEnabled ? (
              <span className="inline-flex w-fit items-center gap-2 rounded-xl bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">

                <span className="h-2 w-2 rounded-full bg-green-500" />

                Enabled

              </span>
            ) : (
              <span className="inline-flex w-fit items-center gap-2 rounded-xl bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-600">

                <span className="h-2 w-2 rounded-full bg-gray-400" />

                Disabled

              </span>
            )}

          </div>

        </div>

      </div>

      {/* ========================================================
          DESCRIPTION
      ========================================================= */}

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

        <h3 className="text-base font-semibold text-gray-900">
          Description
        </h3>

        <p className="mt-3 text-sm leading-6 text-gray-600">
          {featureFlag.description ||
            "No description has been provided for this feature flag."}
        </p>

      </div>

      {/* ========================================================
          CONFIGURATION
      ========================================================= */}

      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">

        <div className="border-b border-gray-200 px-6 py-5">

          <h3 className="text-base font-semibold text-gray-900">
            Configuration
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            Current feature flag configuration.
          </p>

        </div>

        <div className="grid grid-cols-1 gap-0 divide-y divide-gray-100 md:grid-cols-2 md:divide-x md:divide-y-0">

          {/* FEATURE ID */}

          <div className="p-6">

            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
              Feature ID
            </p>

            <p className="mt-2 text-sm font-semibold text-gray-900">
              #{featureFlag.id}
            </p>

          </div>

          {/* FEATURE KEY */}

          <div className="p-6">

            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
              Feature Key
            </p>

            <p className="mt-2 break-all font-mono text-sm font-medium text-gray-900">
              {featureFlag.key || "-"}
            </p>

          </div>

        </div>

        <div className="grid grid-cols-1 divide-y divide-gray-100 border-t border-gray-100 md:grid-cols-2 md:divide-x md:divide-y-0">

          {/* ENVIRONMENT */}

          <div className="p-6">

            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
              Environment
            </p>

            {featureFlag.environment ? (
              <div className="mt-2">

                <p className="text-sm font-semibold text-gray-900">
                  {featureFlag.environment.name ||
                    "-"}
                </p>

                {featureFlag.environment.key && (
                  <code className="mt-1 inline-block rounded bg-gray-100 px-2 py-1 text-xs text-gray-600">
                    {featureFlag.environment.key}
                  </code>
                )}

              </div>
            ) : featureFlag.environment_id ? (
              <p className="mt-2 text-sm font-semibold text-gray-900">
                Environment #
                {featureFlag.environment_id}
              </p>
            ) : (
              <p className="mt-2 text-sm text-gray-400">
                No environment assigned
              </p>
            )}

          </div>

          {/* STATUS */}

          <div className="p-6">

            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
              Current Status
            </p>

            <div className="mt-2">

              {isEnabled ? (
                <span className="inline-flex items-center gap-2 rounded-lg bg-green-100 px-3 py-1.5 text-xs font-semibold text-green-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                  Enabled
                </span>
              ) : (
                <span className="inline-flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-gray-400" />
                  Disabled
                </span>
              )}

            </div>

          </div>

        </div>

      </div>

      {/* ========================================================
          CREATED / UPDATED
      ========================================================= */}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

        {/* CREATED */}

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">

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
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>

            </div>

            <div>

              <h3 className="text-sm font-semibold text-gray-900">
                Created
              </h3>

              <p className="text-xs text-gray-500">
                Creation information
              </p>

            </div>

          </div>

          <div className="mt-5 space-y-4">

            <div>
              <p className="text-xs text-gray-400">
                Created At
              </p>

              <p className="mt-1 text-sm font-medium text-gray-700">
                {formatDate(
                  featureFlag.created_at
                )}
              </p>
            </div>

            {featureFlag.created_by && (
              <div>
                <p className="text-xs text-gray-400">
                  Created By
                </p>

                <p className="mt-1 text-sm font-semibold text-gray-900">
                  {featureFlag.created_by.name ||
                    featureFlag.created_by.email ||
                    "-"}
                </p>

                {featureFlag.created_by.role && (
                  <p className="mt-1 text-xs text-gray-500">
                    Role:{" "}
                    {featureFlag.created_by.role}
                  </p>
                )}
              </div>
            )}

          </div>

        </div>

        {/* UPDATED */}

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">

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

            </div>

            <div>

              <h3 className="text-sm font-semibold text-gray-900">
                Last Updated
              </h3>

              <p className="text-xs text-gray-500">
                Latest modification information
              </p>

            </div>

          </div>

          <div className="mt-5 space-y-4">

            <div>
              <p className="text-xs text-gray-400">
                Updated At
              </p>

              <p className="mt-1 text-sm font-medium text-gray-700">
                {formatDate(
                  featureFlag.updated_at
                )}
              </p>
            </div>

            {featureFlag.updated_by && (
              <div>
                <p className="text-xs text-gray-400">
                  Updated By
                </p>

                <p className="mt-1 text-sm font-semibold text-gray-900">
                  {featureFlag.updated_by.name ||
                    featureFlag.updated_by.email ||
                    "-"}
                </p>

                {featureFlag.updated_by.role && (
                  <p className="mt-1 text-xs text-gray-500">
                    Role:{" "}
                    {featureFlag.updated_by.role}
                  </p>
                )}
              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
};

export default FeatureFlagDetails;