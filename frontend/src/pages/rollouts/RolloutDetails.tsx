
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  getRolloutById,
  deleteRollout,
} from "../../api/rolloutApi";

// ============================================================
// TYPES
// ============================================================

interface Rollout {
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

interface RolloutResponse {
  success?: boolean;
  message?: string;
  rollout?: Rollout;
  data?: Rollout | { rollout?: Rollout };
}

// ============================================================
// COMPONENT
// ============================================================

const RolloutDetails: React.FC = () => {
  const { rolloutId } = useParams<{
    rolloutId: string;
  }>();

  const navigate = useNavigate();

  const [rollout, setRollout] = useState<Rollout | null>(
    null
  );

  const [loading, setLoading] = useState<boolean>(true);

  const [error, setError] = useState<string>("");

  const [deleting, setDeleting] = useState<boolean>(false);

  // ==========================================================
  // LOAD ROLLOUT
  // ==========================================================

  const loadRollout = async (): Promise<void> => {
    if (!rolloutId) {
      setError("Rollout ID is missing.");
      setLoading(false);
      return;
    }

    const id = Number(rolloutId);

    if (!Number.isInteger(id) || id <= 0) {
      setError("Invalid rollout ID.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = (await getRolloutById(
        id
      )) as RolloutResponse | Rollout;

      console.log("Rollout details response:", response);

      // ------------------------------------------------------
      // Extract the actual Rollout object.
      //
      // Supported responses:
      //
      // 1. { rollout: {...} }
      // 2. { data: {...} }
      // 3. { data: { rollout: {...} } }
      // 4. {...}  direct rollout object
      // ------------------------------------------------------

      let rolloutData: Rollout | undefined;

      // Response: { rollout: Rollout }
      if (
        "rollout" in response &&
        response.rollout
      ) {
        rolloutData = response.rollout;
      }

      // Response: { data: ... }
      else if (
        "data" in response &&
        response.data
      ) {
        const data = response.data;

        // { data: { rollout: Rollout } }
        if (
          typeof data === "object" &&
          data !== null &&
          "rollout" in data &&
          data.rollout
        ) {
          rolloutData = data.rollout;
        }

        // { data: Rollout }
        else if (
          typeof data === "object" &&
          data !== null &&
          "id" in data &&
          "feature_id" in data &&
          "environment_id" in data &&
          "percentage" in data
        ) {
          rolloutData = data as Rollout;
        }
      }

      // Direct Rollout response
      else if (
        "id" in response &&
        "feature_id" in response &&
        "environment_id" in response &&
        "percentage" in response
      ) {
        rolloutData = response as Rollout;
      }

      if (!rolloutData) {
        throw new Error(
          "Rollout details not found."
        );
      }

      setRollout(rolloutData);
    } catch (err: any) {
      console.error(
        "Failed to load rollout:",
        err
      );

      const message =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        err?.message ||
        "Failed to load rollout details.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================================
  // INITIAL LOAD
  // ==========================================================

  useEffect(() => {
    loadRollout();
  }, [rolloutId]);

  // ==========================================================
  // DELETE
  // ==========================================================

  const handleDelete = async (): Promise<void> => {
    if (!rollout) {
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete rollout #${rollout.id}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeleting(true);
      setError("");

      await deleteRollout(rollout.id);

      navigate("/rollouts");
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
    } finally {
      setDeleting(false);
    }
  };

  // ==========================================================
  // EDIT
  // ==========================================================

  const handleEdit = (): void => {
    if (!rollout) {
      return;
    }

    navigate(`/rollouts?edit=${rollout.id}`);
  };

  // ==========================================================
  // HELPERS
  // ==========================================================

  const formatDate = (
    value?: string
  ): string => {
    if (!value) {
      return "-";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return date.toLocaleString();
  };

  const getPercentage = (
    value: number
  ): number => {
    if (
      typeof value !== "number" ||
      Number.isNaN(value)
    ) {
      return 0;
    }

    return Math.min(
      100,
      Math.max(0, value)
    );
  };

  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />

          <p className="text-sm font-medium text-gray-500">
            Loading rollout details...
          </p>
        </div>
      </div>
    );
  }

  // ==========================================================
  // ERROR / NOT FOUND
  // ==========================================================

  if (error && !rollout) {
    return (
      <div className="space-y-6">
        <button
          type="button"
          onClick={() =>
            navigate("/rollouts")
          }
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 transition hover:text-gray-900"
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

          Back to Rollouts
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
                d="M12 9v2m0 4h.01M10.29 3.86l-7.5 13A2 2 0 003.66 18h16.68a2 2 0 001.74-1l-7.5-13a2 2 0 00-3.48 0z"
              />
            </svg>

            <div>
              <h2 className="text-base font-semibold text-red-800">
                Unable to load rollout
              </h2>

              <p className="mt-1 text-sm text-red-700">
                {error}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!rollout) {
    return null;
  }

  const percentage = getPercentage(
    rollout.percentage
  );

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
          <button
            type="button"
            onClick={() =>
              navigate("/rollouts")
            }
            className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-gray-500 transition hover:text-gray-900"
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

            Back to Rollouts
          </button>

          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">
              Rollout Details
            </h1>

            <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
              #{rollout.id}
            </span>
          </div>

          <p className="mt-1 text-sm text-gray-500">
            View rollout configuration and details
          </p>
        </div>

        <div className="flex gap-3">

          {/* EDIT */}

          <button
            type="button"
            onClick={handleEdit}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50"
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
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5"
              />

              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"
              />
            </svg>

            Edit
          </button>

          {/* DELETE */}

          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {deleting ? (
              <>
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />

                Deleting...
              </>
            ) : (
              <>
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
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3m-4 0h14"
                  />
                </svg>

                Delete
              </>
            )}
          </button>

        </div>
      </div>

      {/* ======================================================
          ERROR
      ======================================================= */}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3">
          <p className="text-sm font-medium text-red-800">
            {error}
          </p>
        </div>
      )}

      {/* ======================================================
          MAIN CARD
      ======================================================= */}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

        {/* ====================================================
            ROLLOUT PERCENTAGE
        ===================================================== */}

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm lg:col-span-2">

          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-900">
              Rollout Progress
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Current percentage of users included in this rollout
            </p>
          </div>

          <div className="flex flex-col items-center justify-center py-8">

            <div className="relative flex h-48 w-48 items-center justify-center">

              <svg
                className="h-48 w-48 -rotate-90"
                viewBox="0 0 120 120"
              >

                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="10"
                  className="text-gray-100"
                />

                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray="314"
                  strokeDashoffset={
                    314 -
                    (314 * percentage) /
                      100
                  }
                  className="text-blue-600 transition-all duration-500"
                />

              </svg>

              <div className="absolute text-center">

                <p className="text-4xl font-bold text-gray-900">
                  {percentage}%
                </p>

                <p className="mt-1 text-xs font-medium text-gray-500">
                  Rollout
                </p>

              </div>

            </div>

            <div className="mt-6 w-full max-w-md">

              <div className="mb-2 flex justify-between text-sm">

                <span className="font-medium text-gray-500">
                  Progress
                </span>

                <span className="font-bold text-gray-900">
                  {percentage}%
                </span>

              </div>

              <div className="h-3 overflow-hidden rounded-full bg-gray-100">

                <div
                  className="h-full rounded-full bg-blue-600 transition-all duration-500"
                  style={{
                    width: `${percentage}%`,
                  }}
                />

              </div>

            </div>

          </div>
        </div>

        {/* ====================================================
            STATUS
        ===================================================== */}

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

          <h2 className="text-lg font-bold text-gray-900">
            Status
          </h2>

          <div className="mt-6">

            {rollout.is_active === false ? (

              <div className="rounded-xl bg-gray-100 p-5">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200">

                    <svg
                      className="h-5 w-5 text-gray-600"
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

                  <div>

                    <p className="font-semibold text-gray-900">
                      Inactive
                    </p>

                    <p className="text-sm text-gray-500">
                      Rollout is inactive
                    </p>

                  </div>

                </div>

              </div>

            ) : (

              <div className="rounded-xl bg-green-50 p-5">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">

                    <svg
                      className="h-5 w-5 text-green-600"
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

                  <div>

                    <p className="font-semibold text-green-900">
                      Active
                    </p>

                    <p className="text-sm text-green-700">
                      Rollout is active
                    </p>

                  </div>

                </div>

              </div>

            )}

          </div>
        </div>
      </div>

      {/* ======================================================
          DETAILS
      ======================================================= */}

      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">

        <div className="border-b border-gray-200 px-6 py-5">

          <h2 className="text-lg font-bold text-gray-900">
            Rollout Information
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Configuration and metadata
          </p>

        </div>

        <div className="grid grid-cols-1 divide-y divide-gray-100 sm:grid-cols-2 sm:divide-x sm:divide-y-0">

          {/* FEATURE */}

          <div className="p-6">

            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              Feature
            </p>

            <p className="mt-2 text-base font-semibold text-gray-900">
              {rollout.feature_name ||
                `Feature #${rollout.feature_id}`}
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Feature ID:{" "}
              {rollout.feature_id}
            </p>

          </div>

          {/* ENVIRONMENT */}

          <div className="p-6">

            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              Environment
            </p>

            <p className="mt-2 text-base font-semibold text-gray-900">
              {rollout.environment_name ||
                `Environment #${rollout.environment_id}`}
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Environment ID:{" "}
              {rollout.environment_id}
            </p>

          </div>

        </div>

        <div className="grid grid-cols-1 border-t border-gray-100 sm:grid-cols-2">

          {/* CREATED */}

          <div className="border-b border-gray-100 p-6 sm:border-b-0 sm:border-r">

            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              Created At
            </p>

            <p className="mt-2 text-sm font-medium text-gray-900">
              {formatDate(
                rollout.created_at
              )}
            </p>

          </div>

          {/* UPDATED */}

          <div className="p-6">

            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              Updated At
            </p>

            <p className="mt-2 text-sm font-medium text-gray-900">
              {formatDate(
                rollout.updated_at
              )}
            </p>

          </div>

        </div>

      </div>

      {/* ======================================================
          METADATA
      ======================================================= */}

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

        <h2 className="text-lg font-bold text-gray-900">
          Metadata
        </h2>

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">

          <div className="rounded-xl bg-gray-50 p-4">

            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              Rollout ID
            </p>

            <p className="mt-2 text-sm font-bold text-gray-900">
              {rollout.id}
            </p>

          </div>

          <div className="rounded-xl bg-gray-50 p-4">

            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              Feature ID
            </p>

            <p className="mt-2 text-sm font-bold text-gray-900">
              {rollout.feature_id}
            </p>

          </div>

          <div className="rounded-xl bg-gray-50 p-4">

            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              Environment ID
            </p>

            <p className="mt-2 text-sm font-bold text-gray-900">
              {rollout.environment_id}
            </p>

          </div>

        </div>

      </div>

    </div>
  );
};

export default RolloutDetails;

