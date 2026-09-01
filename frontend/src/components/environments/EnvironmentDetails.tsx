import React, { useEffect, useState } from "react";
import { getEnvironmentById } from "../../api/environmentApi";

interface EnvironmentDetailsData {
  id: number;
  name: string;
  key?: string;
  description?: string;
  is_active?: boolean;
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
}

interface EnvironmentDetailsProps {
  environmentId: number;
  onBack?: () => void;
  onEdit?: (environment: EnvironmentDetailsData) => void;
}

const EnvironmentDetails: React.FC<
  EnvironmentDetailsProps
> = ({
  environmentId,
  onBack,
  onEdit,
}) => {
  const [environment, setEnvironment] =
    useState<EnvironmentDetailsData | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ============================================================
  // GET ENVIRONMENT BY ID
  // GET /api/environments/{environment_id}
  // ============================================================

  const fetchEnvironment = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await getEnvironmentById(environmentId);

      const data =
        response?.data ||
        response?.environment ||
        response;

      setEnvironment(data);
    } catch (err: any) {
      const message =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        err?.message ||
        "Failed to retrieve environment details.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // LOAD
  // ============================================================

  useEffect(() => {
    fetchEnvironment();
  }, [environmentId]);

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
            Loading environment...
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
              className="h-7 w-7 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01M10.29 3.86l-7.5 13A2 2 0 004.53 18h14.94a2 2 0 001.74-3l-7.5-13a2 2 0 00-3.42 0l-7.5 13z"
              />
            </svg>

          </div>

          <h2 className="mt-4 text-lg font-semibold text-gray-900">
            Unable to load environment
          </h2>

          <p className="mt-2 max-w-md text-sm text-red-600">
            {error}
          </p>

          <div className="mt-5 flex gap-3">

            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="rounded-xl border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Go Back
              </button>
            )}

            <button
              type="button"
              onClick={fetchEnvironment}
              className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Try Again
            </button>

          </div>

        </div>

      </div>
    );
  }

  // ============================================================
  // NOT FOUND
  // ============================================================

  if (!environment) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">

        <h2 className="text-lg font-semibold text-gray-900">
          Environment not found
        </h2>

        <p className="mt-2 text-sm text-gray-500">
          The requested environment could not be found.
        </p>

        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="mt-5 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Go Back
          </button>
        )}

      </div>
    );
  }

  const isActive =
    environment.is_active !== false;

  return (
    <div className="space-y-6">

      {/* ========================================================
          PAGE HEADER
      ========================================================= */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div className="flex items-center gap-3">

          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 transition hover:bg-gray-50 hover:text-gray-900"
              title="Go back"
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
            </button>
          )}

          <div>

            <p className="text-sm text-gray-500">
              Environment
            </p>

            <h1 className="text-2xl font-bold text-gray-900">
              {environment.name}
            </h1>

          </div>

        </div>

        <div className="flex items-center gap-3">

          <button
            type="button"
            onClick={fetchEnvironment}
            className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
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
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>

            Refresh

          </button>

          {onEdit && (
            <button
              type="button"
              onClick={() =>
                onEdit(environment)
              }
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
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
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5M18.5 2.5a2 2 0 013 3L12 15l-4 1-4-1 1-4 9.5-9.5z"
                />
              </svg>

              Edit

            </button>
          )}

        </div>

      </div>

      {/* ========================================================
          MAIN CARD
      ========================================================= */}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

        {/* ======================================================
            OVERVIEW
        ======================================================= */}

        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm lg:col-span-2">

          <div className="border-b border-gray-200 px-6 py-5">

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-600">

                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 7h18M5 7v10a2 2 0 002 2h10a2 2 0 002-2V7M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2"
                  />
                </svg>

              </div>

              <div>

                <h2 className="text-lg font-semibold text-gray-900">
                  Environment Overview
                </h2>

                <p className="text-sm text-gray-500">
                  Basic environment information.
                </p>

              </div>

            </div>

          </div>

          <div className="grid grid-cols-1 gap-6 p-6 sm:grid-cols-2">

            {/* NAME */}

            <div>

              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Name
              </p>

              <p className="mt-2 text-sm font-semibold text-gray-900">
                {environment.name}
              </p>

            </div>

            {/* ID */}

            <div>

              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Environment ID
              </p>

              <p className="mt-2 font-mono text-sm font-semibold text-gray-900">
                #{environment.id}
              </p>

            </div>

            {/* KEY */}

            <div>

              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Key
              </p>

              <div className="mt-2">

                {environment.key ? (
                  <code className="rounded-lg bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700">
                    {environment.key}
                  </code>
                ) : (
                  <span className="text-sm text-gray-400">
                    -
                  </span>
                )}

              </div>

            </div>

            {/* STATUS */}

            <div>

              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Status
              </p>

              <div className="mt-2">

                {isActive ? (
                  <span className="inline-flex items-center gap-2 rounded-lg bg-green-100 px-3 py-1.5 text-xs font-semibold text-green-700">

                    <span className="h-2 w-2 rounded-full bg-green-500" />

                    Active

                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-600">

                    <span className="h-2 w-2 rounded-full bg-gray-400" />

                    Inactive

                  </span>
                )}

              </div>

            </div>

            {/* DESCRIPTION */}

            <div className="sm:col-span-2">

              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Description
              </p>

              <div className="mt-2 rounded-xl bg-gray-50 p-4">

                <p className="text-sm leading-6 text-gray-600">
                  {environment.description ||
                    "No description provided."}
                </p>

              </div>

            </div>

          </div>

        </div>

        {/* ======================================================
            STATUS CARD
        ======================================================= */}

        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">

          <div className="border-b border-gray-200 px-6 py-5">

            <h2 className="text-lg font-semibold text-gray-900">
              Status
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Current environment state.
            </p>

          </div>

          <div className="p-6">

            <div
              className={`flex flex-col items-center rounded-2xl p-6 text-center ${
                isActive
                  ? "bg-green-50"
                  : "bg-gray-50"
              }`}
            >

              <div
                className={`flex h-16 w-16 items-center justify-center rounded-full ${
                  isActive
                    ? "bg-green-100"
                    : "bg-gray-200"
                }`}
              >

                {isActive ? (
                  <svg
                    className="h-8 w-8 text-green-600"
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
                ) : (
                  <svg
                    className="h-8 w-8 text-gray-500"
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
                )}

              </div>

              <p
                className={`mt-4 text-lg font-bold ${
                  isActive
                    ? "text-green-700"
                    : "text-gray-600"
                }`}
              >
                {isActive
                  ? "Active"
                  : "Inactive"}
              </p>

              <p className="mt-1 text-xs text-gray-500">
                Environment is{" "}
                {isActive
                  ? "currently active"
                  : "currently inactive"}
                .
              </p>

            </div>

          </div>

        </div>

      </div>

      {/* ========================================================
          METADATA
      ========================================================= */}

      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">

        <div className="border-b border-gray-200 px-6 py-5">

          <h2 className="text-lg font-semibold text-gray-900">
            Metadata
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Environment creation and update information.
          </p>

        </div>

        <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2">

          {/* CREATED AT */}

          <div className="rounded-xl border border-gray-100 p-4">

            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              Created At
            </p>

            <p className="mt-2 text-sm font-medium text-gray-900">
              {formatDate(
                environment.created_at
              )}
            </p>

          </div>

          {/* UPDATED AT */}

          <div className="rounded-xl border border-gray-100 p-4">

            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              Updated At
            </p>

            <p className="mt-2 text-sm font-medium text-gray-900">
              {formatDate(
                environment.updated_at
              )}
            </p>

          </div>

          {/* CREATED BY */}

          {environment.created_by && (
            <div className="rounded-xl border border-gray-100 p-4">

              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Created By
              </p>

              <div className="mt-3 flex items-center gap-3">

                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-600">
                  {(
                    environment.created_by.name ||
                    environment.created_by.email ||
                    "U"
                  )
                    .charAt(0)
                    .toUpperCase()}
                </div>

                <div>

                  <p className="text-sm font-semibold text-gray-900">
                    {environment.created_by.name ||
                      `User #${environment.created_by.id}`}
                  </p>

                  {environment.created_by.email && (
                    <p className="mt-0.5 text-xs text-gray-500">
                      {
                        environment.created_by
                          .email
                      }
                    </p>
                  )}

                  {environment.created_by.role && (
                    <p className="mt-0.5 text-xs text-blue-600">
                      {
                        environment.created_by
                          .role
                      }
                    </p>
                  )}

                </div>

              </div>

            </div>
          )}

          {/* UPDATED BY */}

          {environment.updated_by && (
            <div className="rounded-xl border border-gray-100 p-4">

              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Updated By
              </p>

              <div className="mt-3 flex items-center gap-3">

                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-purple-100 text-sm font-bold text-purple-600">
                  {(
                    environment.updated_by.name ||
                    environment.updated_by.email ||
                    "U"
                  )
                    .charAt(0)
                    .toUpperCase()}
                </div>

                <div>

                  <p className="text-sm font-semibold text-gray-900">
                    {environment.updated_by.name ||
                      `User #${environment.updated_by.id}`}
                  </p>

                  {environment.updated_by.email && (
                    <p className="mt-0.5 text-xs text-gray-500">
                      {
                        environment.updated_by
                          .email
                      }
                    </p>
                  )}

                  {environment.updated_by.role && (
                    <p className="mt-0.5 text-xs text-purple-600">
                      {
                        environment.updated_by
                          .role
                      }
                    </p>
                  )}

                </div>

              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
};

export default EnvironmentDetails;