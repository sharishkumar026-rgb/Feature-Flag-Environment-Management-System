import React, { useEffect, useState } from "react";

import EnvironmentTable from "../../components/environments/EnvironmentTable";
import EnvironmentForm from "../../components/environments/EnvironmentForm";

import {
  getEnvironments,
  deleteEnvironment,
} from "../../api/environmentApi";

// ============================================================
// TYPES
// ============================================================

export interface Environment {
  id: number;
  name: string;
  key?: string;
  description?: string;
  is_active?: boolean;
  created_by_id?: number;
  created_at?: string;
  updated_at?: string;
}

// ============================================================
// COMPONENT
// ============================================================

const Environments: React.FC = () => {
  const [environments, setEnvironments] =
    useState<Environment[]>([]);

  const [loading, setLoading] =
    useState<boolean>(false);

  const [error, setError] =
    useState<string>("");

  const [showForm, setShowForm] =
    useState<boolean>(false);

  const [selectedEnvironment, setSelectedEnvironment] =
    useState<Environment | null>(null);

  // ==========================================================
  // LOAD ENVIRONMENTS
  // ==========================================================

  const loadEnvironments = async (): Promise<void> => {
    try {
      setLoading(true);
      setError("");

      const response = await getEnvironments();

      console.log(
        "Environments API response:",
        response
      );

      // ------------------------------------------------------
      // ARRAY RESPONSE
      // ------------------------------------------------------

      if (Array.isArray(response)) {
        setEnvironments(response);
        return;
      }

      // ------------------------------------------------------
      // { environments: [...] }
      // ------------------------------------------------------

      if (
        response &&
        Array.isArray(response.environments)
      ) {
        setEnvironments(
          response.environments
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
        setEnvironments(response.data);
        return;
      }

      // ------------------------------------------------------
      // { data: { environments: [...] } }
      // ------------------------------------------------------

      if (
        response?.data &&
        Array.isArray(
          response.data.environments
        )
      ) {
        setEnvironments(
          response.data.environments
        );
        return;
      }

      setEnvironments([]);
    } catch (err: any) {
      console.error(
        "Failed to load environments:",
        err
      );

      const message =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        err?.message ||
        "Failed to load environments.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================================
  // INITIAL LOAD
  // ==========================================================

  useEffect(() => {
    loadEnvironments();
  }, []);

  // ==========================================================
  // ADD ENVIRONMENT
  // ==========================================================

  const handleAddEnvironment = (): void => {
    setSelectedEnvironment(null);
    setShowForm(true);
    setError("");
  };

  // ==========================================================
  // EDIT ENVIRONMENT
  // ==========================================================

  const handleEditEnvironment = (
    environment: Environment
  ): void => {
    setSelectedEnvironment(environment);
    setShowForm(true);
    setError("");
  };

  // ==========================================================
  // VIEW ENVIRONMENT
  // ==========================================================

  const handleViewEnvironment = (
    environment: Environment
  ): void => {
    console.log(
      "View environment:",
      environment
    );
  };

  // ==========================================================
  // DELETE ENVIRONMENT
  // ==========================================================

  const handleDeleteEnvironment = async (
    environment: Environment
  ): Promise<void> => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${environment.name}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await deleteEnvironment(
        environment.id
      );

      await loadEnvironments();
    } catch (err: any) {
      console.error(
        "Failed to delete environment:",
        err
      );

      const message =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        err?.message ||
        "Failed to delete environment.";

      setError(message);
    }
  };

  // ==========================================================
  // FORM SUCCESS
  // ==========================================================

  const handleFormSuccess = async (): Promise<void> => {
    setShowForm(false);
    setSelectedEnvironment(null);

    await loadEnvironments();
  };

  // ==========================================================
  // FORM CANCEL
  // ==========================================================

  const handleFormCancel = (): void => {
    setShowForm(false);
    setSelectedEnvironment(null);
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
      ====================================================== */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>

          <h1 className="text-2xl font-bold text-gray-900">
            Environments
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage application environments
          </p>

        </div>

        <button
          type="button"
          onClick={handleAddEnvironment}
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

          Add Environment

        </button>

      </div>

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
          ENVIRONMENT TABLE
      ====================================================== */}

      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">

        <EnvironmentTable
          environments={environments}
          loading={loading}
          onEdit={handleEditEnvironment}
          onDelete={handleDeleteEnvironment}
          onView={handleViewEnvironment}
        />

      </div>

      {/* ======================================================
          ENVIRONMENT FORM MODAL
      ====================================================== */}

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

            <EnvironmentForm
              environment={
                selectedEnvironment ?? undefined
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

export default Environments;