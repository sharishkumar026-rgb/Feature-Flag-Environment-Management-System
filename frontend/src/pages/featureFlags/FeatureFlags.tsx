
import React, { useEffect, useState } from "react";

import FeatureFlagTable from "../../components/featureFlags/FeatureFlagTable";
import FeatureFlagForm from "../../components/featureFlags/FeatureFlagForm";

import {
  getFeatureFlags,
  deleteFeatureFlag,
} from "../../api/featureFlagApi";

import type {
  FeatureFlag,
} from "../../api/featureFlagApi";

// ============================================================
// COMPONENT
// ============================================================

const FeatureFlags: React.FC = () => {
  // ==========================================================
  // STATE
  // ==========================================================

  const [featureFlags, setFeatureFlags] =
    useState<FeatureFlag[]>([]);

  const [loading, setLoading] =
    useState<boolean>(false);

  const [error, setError] =
    useState<string>("");

  const [showForm, setShowForm] =
    useState<boolean>(false);

  const [selectedFeatureFlag, setSelectedFeatureFlag] =
    useState<FeatureFlag | null>(null);

  // ==========================================================
  // LOAD FEATURE FLAGS
  // ==========================================================

  const loadFeatureFlags = async (): Promise<void> => {
    try {
      setLoading(true);
      setError("");

      const response = await getFeatureFlags();

      console.log(
        "Feature Flags API response:",
        response
      );

      // ------------------------------------------------------
      // ARRAY RESPONSE
      // ------------------------------------------------------

      if (Array.isArray(response)) {
        setFeatureFlags(response);
        return;
      }

      // ------------------------------------------------------
      // { feature_flags: [...] }
      // ------------------------------------------------------

      if (
        response &&
        Array.isArray(response.feature_flags)
      ) {
        setFeatureFlags(
          response.feature_flags
        );
        return;
      }

      // ------------------------------------------------------
      // { data: [...] }
      // ------------------------------------------------------

      if (
        response &&
        Array.isArray(response.data)
      ) {
        setFeatureFlags(response.data);
        return;
      }

      // ------------------------------------------------------
      // { data: { feature_flags: [...] } }
      // ------------------------------------------------------

      if (
        response?.data &&
        Array.isArray(
          response.data.feature_flags
        )
      ) {
        setFeatureFlags(
          response.data.feature_flags
        );
        return;
      }

      setFeatureFlags([]);
    } catch (err: any) {
      console.error(
        "Failed to load feature flags:",
        err
      );

      const message =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        err?.message ||
        "Failed to load feature flags.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================================
  // INITIAL LOAD
  // ==========================================================

  useEffect(() => {
    loadFeatureFlags();
  }, []);

  // ==========================================================
  // ADD FEATURE FLAG
  // ==========================================================

  const handleAddFeatureFlag = (): void => {
    setSelectedFeatureFlag(null);
    setShowForm(true);
    setError("");
  };

  // ==========================================================
  // EDIT FEATURE FLAG
  // ==========================================================

  const handleEditFeatureFlag = (
    featureFlag: FeatureFlag
  ): void => {
    setSelectedFeatureFlag(featureFlag);
    setShowForm(true);
    setError("");
  };

  // ==========================================================
  // VIEW FEATURE FLAG
  // ==========================================================

  const handleViewFeatureFlag = (
    featureFlag: FeatureFlag
  ): void => {
    console.log(
      "View feature flag:",
      featureFlag
    );
  };

  // ==========================================================
  // DELETE FEATURE FLAG
  // ==========================================================

  const handleDeleteFeatureFlag = async (
    featureFlag: FeatureFlag
  ): Promise<void> => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${featureFlag.name}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await deleteFeatureFlag(
        featureFlag.id
      );

      await loadFeatureFlags();
    } catch (err: any) {
      console.error(
        "Failed to delete feature flag:",
        err
      );

      const message =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        err?.message ||
        "Failed to delete feature flag.";

      setError(message);
    }
  };

  // ==========================================================
  // FORM SUCCESS
  // ==========================================================

  const handleFormSuccess = async (): Promise<void> => {
    setShowForm(false);
    setSelectedFeatureFlag(null);

    await loadFeatureFlags();
  };

  // ==========================================================
  // FORM CANCEL
  // ==========================================================

  const handleFormCancel = (): void => {
    setShowForm(false);
    setSelectedFeatureFlag(null);
    setError("");
  };

  // ==========================================================
  // MODAL BACKDROP
  // ==========================================================

  const handleBackdropClick = (
    event: React.MouseEvent<HTMLDivElement>
  ): void => {
    if (
      event.target === event.currentTarget
    ) {
      handleFormCancel();
    }
  };

  // ==========================================================
  // UI
  // ==========================================================

  return (
    <div className="space-y-6">

      {/* ======================================================
          PAGE HEADER
      ======================================================= */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>

          <h1 className="text-2xl font-bold text-gray-900">
            Feature Flags
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage application features and feature flags
          </p>

        </div>

        <button
          type="button"
          onClick={handleAddFeatureFlag}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100"
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
              d="M12 4v16m8-8H4"
            />

          </svg>

          Add Feature Flag

        </button>

      </div>

      {/* ======================================================
          ERROR
      ======================================================= */}

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
              d="M12 9v2m0 4h.01M10.29 3.86l-7.5 13A2 2 0 003.66 18h16.68a2 2 0 001.74-1l-7.5-13a2 2 0 00-3.48 0l-7.5 13A2 2 0 003.66 18h16.68a2 2 0 001.74-1z"
            />

          </svg>

          <div className="flex-1">

            <p className="text-sm font-medium text-red-800">
              {error}
            </p>

          </div>

          <button
            type="button"
            onClick={() => setError("")}
            className="text-red-500 transition hover:text-red-700"
            aria-label="Close error"
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
                d="M6 18L18 6M6 6l12 12"
              />

            </svg>

          </button>

        </div>
      )}

      {/* ======================================================
          FEATURE FLAG TABLE
      ======================================================= */}

      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">

        <FeatureFlagTable
          featureFlags={featureFlags}
          loading={loading}
          onEdit={handleEditFeatureFlag}
          onDelete={handleDeleteFeatureFlag}
          onView={handleViewFeatureFlag}
        />

      </div>

      {/* ======================================================
          FEATURE FLAG FORM MODAL
      ======================================================= */}

      {showForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onMouseDown={handleBackdropClick}
        >

          <div
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
            onMouseDown={(event) =>
              event.stopPropagation()
            }
          >

            <FeatureFlagForm
              featureFlag={
                selectedFeatureFlag ?? undefined
              }
              onSuccess={handleFormSuccess}
              onCancel={handleFormCancel}
            />

          </div>

        </div>
      )}

    </div>
  );
};

export default FeatureFlags;

