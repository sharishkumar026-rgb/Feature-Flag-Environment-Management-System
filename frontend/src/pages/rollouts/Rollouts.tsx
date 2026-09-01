
import React, { useEffect, useState } from "react";

import RolloutTable from "../../components/rollouts/RolloutTable";
import RolloutForm from "../../components/rollouts/RolloutForm";

import {
  getRollouts,
  deleteRollout,
} from "../../api/rolloutApi";

// ============================================================
// TYPES
// ============================================================

export interface Rollout {
  id: number;
  feature_id: number;
  environment_id: number;
  percentage: number;

  is_active?: boolean;

  feature_name?: string;
  environment_name?: string;

  created_by_id?: number;
  created_at?: string;
  updated_at?: string;
}

// ============================================================
// COMPONENT
// ============================================================

const Rollouts: React.FC = () => {
  const [rollouts, setRollouts] = useState<Rollout[]>([]);

  const [loading, setLoading] = useState<boolean>(false);

  const [error, setError] = useState<string>("");

  const [showForm, setShowForm] = useState<boolean>(false);

  const [selectedRollout, setSelectedRollout] =
    useState<Rollout | null>(null);

  // ==========================================================
  // LOAD ROLLOUTS
  // ==========================================================

  const loadRollouts = async (): Promise<void> => {
    try {
      setLoading(true);
      setError("");

      const response = await getRollouts();

      console.log("Rollouts API response:", response);

      // ------------------------------------------------------
      // ARRAY RESPONSE
      // ------------------------------------------------------

      if (Array.isArray(response)) {
        setRollouts(response);
        return;
      }

      // ------------------------------------------------------
      // { rollouts: [...] }
      // ------------------------------------------------------

      if (
        response &&
        Array.isArray(response.rollouts)
      ) {
        setRollouts(response.rollouts);
        return;
      }

      // ------------------------------------------------------
      // { data: [...] }
      // ------------------------------------------------------

      if (
        response &&
        Array.isArray(response.data)
      ) {
        setRollouts(response.data);
        return;
      }

      // ------------------------------------------------------
      // { data: { rollouts: [...] } }
      // ------------------------------------------------------

      if (
        response?.data &&
        Array.isArray(response.data.rollouts)
      ) {
        setRollouts(response.data.rollouts);
        return;
      }

      setRollouts([]);
    } catch (err: any) {
      console.error(
        "Failed to load rollouts:",
        err
      );

      const message =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        err?.message ||
        "Failed to load rollouts.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================================
  // INITIAL LOAD
  // ==========================================================

  useEffect(() => {
    loadRollouts();
  }, []);

  // ==========================================================
  // ADD ROLLOUT
  // ==========================================================

  const handleAddRollout = (): void => {
    setSelectedRollout(null);
    setShowForm(true);
    setError("");
  };

  // ==========================================================
  // EDIT ROLLOUT
  // ==========================================================

  const handleEditRollout = (
    rollout: Rollout
  ): void => {
    setSelectedRollout(rollout);
    setShowForm(true);
    setError("");
  };

  // ==========================================================
  // VIEW ROLLOUT
  // ==========================================================

  const handleViewRollout = (
    rollout: Rollout
  ): void => {
    console.log(
      "View rollout:",
      rollout
    );
  };

  // ==========================================================
  // DELETE ROLLOUT
  // ==========================================================

  const handleDeleteRollout = async (
    rollout: Rollout
  ): Promise<void> => {
    const confirmed = window.confirm(
      `Are you sure you want to delete this rollout?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await deleteRollout(rollout.id);

      await loadRollouts();
    } catch (err: any) {
      console.error(
        "Failed to delete rollout:",
        err
      );

      const message =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        err?.message ||
        "Failed to delete rollout.";

      setError(message);
    }
  };

  // ==========================================================
  // FORM SUCCESS
  // ==========================================================

  const handleFormSuccess = async (): Promise<void> => {
    setShowForm(false);
    setSelectedRollout(null);

    await loadRollouts();
  };

  // ==========================================================
  // FORM CANCEL
  // ==========================================================

  const handleFormCancel = (): void => {
    setShowForm(false);
    setSelectedRollout(null);
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
            Rollouts
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage feature rollout percentages across environments
          </p>
        </div>

        <button
          type="button"
          onClick={handleAddRollout}
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

          Add Rollout

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
          ROLLOUT TABLE
      ======================================================= */}

      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">

        <RolloutTable
          rollouts={rollouts}
          loading={loading}
          onEdit={handleEditRollout}
          onDelete={handleDeleteRollout}
          onView={handleViewRollout}
        />

      </div>

      {/* ======================================================
          ROLLOUT FORM MODAL
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

            <RolloutForm
              rollout={
                selectedRollout ?? undefined
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

export default Rollouts;

