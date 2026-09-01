
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import FeatureFlagToggle from "../../components/featureFlags/FeatureFlagToggle";

import {
  getFeatureFlagById,
} from "../../api/featureFlagApi";

// ============================================================
// TYPES
// ============================================================

interface FeatureFlag {
  id: number;
  name: string;
  key: string;
  description?: string;
  is_enabled?: boolean;
  is_active?: boolean;
  created_by_id?: number;
  created_at?: string;
  updated_at?: string;
}

interface AnalyticsResponseData {
  feature_flag?: FeatureFlag;
  feature?: FeatureFlag;
}

interface FeatureFlagDetailsResponse {
  success?: boolean;
  message?: string;
  feature_flag?: FeatureFlag;
  feature?: FeatureFlag;
  data?: FeatureFlag | AnalyticsResponseData;
}

// ============================================================
// COMPONENT
// ============================================================

const FeatureFlagDetails: React.FC = () => {
  const { featureId } = useParams<{
    featureId: string;
  }>();

  const navigate = useNavigate();

  const [featureFlag, setFeatureFlag] =
    useState<FeatureFlag | null>(null);

  const [loading, setLoading] =
    useState<boolean>(true);

  const [error, setError] =
    useState<string>("");

  // ==========================================================
  // LOAD FEATURE FLAG
  // ==========================================================

  const loadFeatureFlag = async (): Promise<void> => {
    if (!featureId) {
      setError("Feature flag ID is missing.");
      setLoading(false);
      return;
    }

    const id = Number(featureId);

    if (Number.isNaN(id)) {
      setError("Invalid feature flag ID.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response: FeatureFlagDetailsResponse =
        await getFeatureFlagById(id);

      console.log(
        "Feature Flag Details API response:",
        response
      );

      // ------------------------------------------------------
      // { feature_flag: {...} }
      // ------------------------------------------------------

      if (
        response?.feature_flag &&
        typeof response.feature_flag === "object"
      ) {
        setFeatureFlag(response.feature_flag);
        return;
      }

      // ------------------------------------------------------
      // { feature: {...} }
      // ------------------------------------------------------

      if (
        response?.feature &&
        typeof response.feature === "object"
      ) {
        setFeatureFlag(response.feature);
        return;
      }

      // ------------------------------------------------------
      // { data: {...} }
      // ------------------------------------------------------

      if (
        response?.data &&
        typeof response.data === "object" &&
        "id" in response.data &&
        "name" in response.data
      ) {
        setFeatureFlag(
          response.data as FeatureFlag
        );
        return;
      }

      // ------------------------------------------------------
      // { data: { feature_flag: {...} } }
      // ------------------------------------------------------

      if (
        response?.data &&
        typeof response.data === "object" &&
        "feature_flag" in response.data &&
        response.data.feature_flag
      ) {
        setFeatureFlag(
          response.data.feature_flag
        );
        return;
      }

      // ------------------------------------------------------
      // { data: { feature: {...} } }
      // ------------------------------------------------------

      if (
        response?.data &&
        typeof response.data === "object" &&
        "feature" in response.data &&
        response.data.feature
      ) {
        setFeatureFlag(
          response.data.feature
        );
        return;
      }

      setFeatureFlag(null);

      setError(
        "Feature flag details could not be found."
      );
    } catch (err: any) {
      console.error(
        "Failed to load feature flag:",
        err
      );

      const message =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        err?.message ||
        "Failed to load feature flag.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================================
  // INITIAL LOAD
  // ==========================================================

  useEffect(() => {
    loadFeatureFlag();
  }, [featureId]);

  // ==========================================================
  // FORMAT DATE
  // ==========================================================

  const formatDate = (
    date?: string
  ): string => {
    if (!date) {
      return "—";
    }

    const parsedDate = new Date(date);

    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {
      return date;
    }

    return parsedDate.toLocaleString();
  };

  // ==========================================================
  // GO BACK
  // ==========================================================

  const handleBack = (): void => {
    navigate("/feature-flags");
  };

  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">

        <div className="text-center">

          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />

          <p className="mt-4 text-sm font-medium text-gray-600">
            Loading feature flag...
          </p>

        </div>

      </div>
    );
  }

  // ==========================================================
  // NOT FOUND
  // ==========================================================

  if (!featureFlag) {
    return (
      <div className="space-y-6">

        <button
          type="button"
          onClick={handleBack}
          className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 transition hover:text-blue-700"
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

          Back to Feature Flags

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
                d="M12 9v2m0 4h.01M10.29 3.86l-7.5 13A2 2 0 003.66 18h16.68a2 2 0 001.74-1l-7.5-13a2 2 0 00-3.48 0l-7.5 13A2 2 0 003.66 18h16.68a2 2 0 001.74-1l-7.5-13a2 2 0 00-3.48 0z"
              />
            </svg>

            <div>

              <h2 className="text-lg font-bold text-red-800">
                Feature Flag Not Found
              </h2>

              <p className="mt-1 text-sm text-red-700">
                {error ||
                  "The requested feature flag could not be found."}
              </p>

            </div>

          </div>

        </div>

      </div>
    );
  }

  // ==========================================================
  // UI
  // ==========================================================

  return (
    <div className="space-y-6">

      {/* ======================================================
          BACK BUTTON
      ====================================================== */}

      <button
        type="button"
        onClick={handleBack}
        className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 transition hover:text-blue-700"
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

        Back to Feature Flags

      </button>

      {/* ======================================================
          ERROR
      ====================================================== */}

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
              d="M12 9v2m0 4h.01M10.29 3.86l-7.5 13A2 2 0 003.66 18h16.68a2 2 0 001.74-1l-7.5-13a2 2 0 00-3.48 0l-7.5 13a2 2 0 003.48 0l-7.5 13a2 2 0 003.48 0l-7.5 13a2 2 0 003.48 0l-7.5-13a2 2 0 003.48 0l-7.5 13a2 2 0 003.48 0z"
            />

          </svg>

          <p className="text-sm font-medium text-red-800">
            {error}
          </p>

        </div>
      )}

      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

          <div>

            <div className="flex flex-wrap items-center gap-3">

              <h1 className="text-2xl font-bold text-gray-900">
                {featureFlag.name}
              </h1>

              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  featureFlag.is_enabled
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {featureFlag.is_enabled
                  ? "Enabled"
                  : "Disabled"}
              </span>

            </div>

            <p className="mt-2 text-sm text-gray-500">
              Feature flag details and configuration
            </p>

          </div>

          <div className="rounded-xl bg-gray-50 px-5 py-3">

            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              Feature ID
            </p>

            <p className="mt-1 text-lg font-bold text-gray-900">
              #{featureFlag.id}
            </p>

          </div>

        </div>

      </div>

      {/* ======================================================
          INFORMATION + STATUS
      ====================================================== */}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

        {/* ====================================================
            FEATURE INFORMATION
        ===================================================== */}

        <div className="lg:col-span-2">

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

            <div className="mb-6">

              <h2 className="text-lg font-bold text-gray-900">
                Feature Information
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Basic information about this feature flag
              </p>

            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">

              {/* Name */}

              <div>

                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Name
                </p>

                <p className="mt-2 text-sm font-semibold text-gray-900">
                  {featureFlag.name || "—"}
                </p>

              </div>

              {/* Key */}

              <div>

                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Key
                </p>

                <div className="mt-2 rounded-lg bg-gray-50 px-3 py-2">

                  <p className="break-all font-mono text-sm text-gray-800">
                    {featureFlag.key || "—"}
                  </p>

                </div>

              </div>

              {/* Description */}

              <div className="sm:col-span-2">

                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Description
                </p>

                <p className="mt-2 text-sm leading-6 text-gray-700">
                  {featureFlag.description ||
                    "No description provided."}
                </p>

              </div>

              {/* Active */}

              <div>

                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Active Status
                </p>

                <div className="mt-2">

                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                      featureFlag.is_active === false
                        ? "bg-red-100 text-red-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {featureFlag.is_active === false
                      ? "Inactive"
                      : "Active"}
                  </span>

                </div>

              </div>

              {/* Created By */}

              <div>

                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Created By
                </p>

                <p className="mt-2 text-sm font-semibold text-gray-900">
                  {featureFlag.created_by_id
                    ? `User #${featureFlag.created_by_id}`
                    : "—"}
                </p>

              </div>

            </div>

          </div>

        </div>

        {/* ====================================================
            STATUS
        ===================================================== */}

        <div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

            <div className="mb-6">

              <h2 className="text-lg font-bold text-gray-900">
                Feature Status
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Enable or disable this feature flag
              </p>

            </div>

            <div className="rounded-xl bg-gray-50 p-5">

              <div className="mb-5 flex items-center justify-between">

                <span className="text-sm font-medium text-gray-600">
                  Current Status
                </span>

                <span
                  className={`text-sm font-bold ${
                    featureFlag.is_enabled
                      ? "text-green-600"
                      : "text-gray-500"
                  }`}
                >
                  {featureFlag.is_enabled
                    ? "Enabled"
                    : "Disabled"}
                </span>

              </div>

              {/* IMPORTANT:
                  No onSuccess prop here because the
                  current FeatureFlagToggleProps does
                  not define onSuccess.
              */}

              <FeatureFlagToggle
                featureId={featureFlag.id}
                isEnabled={Boolean(
                  featureFlag.is_enabled
                )}
              />

            </div>

          </div>

        </div>

      </div>

      {/* ======================================================
          RECORD INFORMATION
      ====================================================== */}

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

        <div className="mb-6">

          <h2 className="text-lg font-bold text-gray-900">
            Record Information
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Creation and update information
          </p>

        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

          {/* Created At */}

          <div className="rounded-xl bg-gray-50 p-4">

            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              Created At
            </p>

            <p className="mt-2 text-sm font-semibold text-gray-900">
              {formatDate(
                featureFlag.created_at
              )}
            </p>

          </div>

          {/* Updated At */}

          <div className="rounded-xl bg-gray-50 p-4">

            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              Updated At
            </p>

            <p className="mt-2 text-sm font-semibold text-gray-900">
              {formatDate(
                featureFlag.updated_at
              )}
            </p>

          </div>

        </div>

      </div>

    </div>
  );
};

export default FeatureFlagDetails;



