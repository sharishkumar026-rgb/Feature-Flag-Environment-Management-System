import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  getEnvironmentById,
} from "../../api/environmentApi";

// ============================================================
// TYPES
// ============================================================

interface Environment {
  id: number;
  name: string;
  key?: string;
  description?: string;
  is_active?: boolean;
  created_by_id?: number;
  created_at?: string;
  updated_at?: string;
}

interface EnvironmentResponse {
  success?: boolean;
  message?: string;
  environment?: Environment;
  data?: Environment | {
    environment?: Environment;
  };
}

// ============================================================
// COMPONENT
// ============================================================

const EnvironmentDetails: React.FC = () => {
  const { environmentId } = useParams<{
    environmentId: string;
  }>();

  const navigate = useNavigate();

  const [environment, setEnvironment] =
    useState<Environment | null>(null);

  const [loading, setLoading] =
    useState<boolean>(true);

  const [error, setError] =
    useState<string>("");

  // ==========================================================
  // LOAD ENVIRONMENT
  // ==========================================================

  const loadEnvironment = async (): Promise<void> => {
    if (!environmentId) {
      setError("Environment ID is missing.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response: EnvironmentResponse =
        await getEnvironmentById(
          Number(environmentId)
        );

      console.log(
        "Environment details API response:",
        response
      );

      // ------------------------------------------------------
      // { environment: {...} }
      // ------------------------------------------------------

      if (
        response &&
        response.environment
      ) {
        setEnvironment(
          response.environment
        );
        return;
      }

      // ------------------------------------------------------
      // { data: {...} }
      // ------------------------------------------------------

      if (
        response &&
        response.data &&
        !Array.isArray(response.data)
      ) {
        const data = response.data as
          | Environment
          | {
              environment?: Environment;
            };

        if (
          "environment" in data &&
          data.environment
        ) {
          setEnvironment(
            data.environment
          );
          return;
        }

        if (
          "id" in data &&
          typeof data.id === "number"
        ) {
          setEnvironment(
            data as Environment
          );
          return;
        }
      }

      // ------------------------------------------------------
      // Direct environment object
      // ------------------------------------------------------

      if (
        response &&
        "id" in response &&
        typeof (
          response as unknown as Environment
        ).id === "number"
      ) {
        setEnvironment(
          response as unknown as Environment
        );
        return;
      }

      setEnvironment(null);
      setError(
        "Environment details could not be found."
      );
    } catch (err: any) {
      console.error(
        "Failed to load environment:",
        err
      );

      const message =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        err?.message ||
        "Failed to load environment.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================================
  // INITIAL LOAD
  // ==========================================================

  useEffect(() => {
    loadEnvironment();
  }, [environmentId]);

  // ==========================================================
  // FORMAT DATE
  // ==========================================================

  const formatDate = (
    date?: string
  ): string => {
    if (!date) {
      return "-";
    }

    const parsedDate = new Date(date);

    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {
      return date;
    }

    return parsedDate.toLocaleString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  // ==========================================================
  // BACK
  // ==========================================================

  const handleBack = (): void => {
    navigate("/environments");
  };

  // ==========================================================
  // LOADING UI
  // ==========================================================

  if (loading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">

        <div className="flex flex-col items-center">

          <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />

          <p className="mt-4 text-sm text-gray-500">
            Loading environment details...
          </p>

        </div>

      </div>
    );
  }

  // ==========================================================
  // ERROR / NOT FOUND
  // ==========================================================

  if (
    error ||
    !environment
  ) {
    return (
      <div className="space-y-6">

        {/* PAGE HEADER */}

        <div className="flex items-center gap-3">

          <button
            type="button"
            onClick={handleBack}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 shadow-sm transition hover:bg-gray-50 hover:text-gray-900"
            aria-label="Back to environments"
            title="Back to environments"
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

          <div>

            <h1 className="text-2xl font-bold text-gray-900">
              Environment Details
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              View environment information
            </p>

          </div>

        </div>

        {/* ERROR */}

        <div className="rounded-2xl border border-red-200 bg-red-50 p-6">

          <div className="flex items-start gap-4">

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
                  d="M12 9v2m0 4h.01M10.29 3.86l-7.5 13A2 2 0 003.66 18h16.68a2 2 0 001.74-1l-7.5-13a2 2 0 00-3.48 0l-7.5 13A2 2 0 003.66 18h16.68a2 2 0 001.74-1z"
                />

              </svg>

            </div>

            <div>

              <h3 className="font-semibold text-red-900">
                Unable to load environment
              </h3>

              <p className="mt-1 text-sm text-red-700">
                {error ||
                  "Environment not found."}
              </p>

              <button
                type="button"
                onClick={loadEnvironment}
                className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
              >
                Try Again
              </button>

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
          PAGE HEADER
      ====================================================== */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div className="flex items-center gap-3">

          <button
            type="button"
            onClick={handleBack}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 shadow-sm transition hover:bg-gray-50 hover:text-gray-900"
            aria-label="Back to environments"
            title="Back to environments"
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

          <div>

            <h1 className="text-2xl font-bold text-gray-900">
              {environment.name}
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Environment details and configuration
            </p>

          </div>

        </div>

        {/* STATUS */}

        <div>

          {environment.is_active !== false ? (
            <span className="inline-flex items-center gap-2 rounded-full bg-green-50 px-4 py-2 text-sm font-semibold text-green-700">

              <span className="h-2 w-2 rounded-full bg-green-500" />

              Active

            </span>
          ) : (
            <span className="inline-flex items-center gap-2 rounded-full bg-red-50 px-4 py-2 text-sm font-semibold text-red-700">

              <span className="h-2 w-2 rounded-full bg-red-500" />

              Inactive

            </span>
          )}

        </div>

      </div>

      {/* ======================================================
          MAIN INFORMATION
      ====================================================== */}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

        {/* ====================================================
            ENVIRONMENT SUMMARY
        ==================================================== */}

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm lg:col-span-2">

          <div className="mb-6 flex items-center gap-4">

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50">

              <svg
                className="h-7 w-7 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >

                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-4h6v4"
                />

              </svg>

            </div>

            <div>

              <h2 className="text-lg font-bold text-gray-900">
                Environment Information
              </h2>

              <p className="text-sm text-gray-500">
                Basic environment information
              </p>

            </div>

          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

            {/* ID */}

            <div className="rounded-xl bg-gray-50 p-4">

              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Environment ID
              </p>

              <p className="mt-2 text-sm font-semibold text-gray-900">
                #{environment.id}
              </p>

            </div>

            {/* NAME */}

            <div className="rounded-xl bg-gray-50 p-4">

              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Name
              </p>

              <p className="mt-2 text-sm font-semibold text-gray-900">
                {environment.name}
              </p>

            </div>

            {/* KEY */}

            <div className="rounded-xl bg-gray-50 p-4">

              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Key
              </p>

              <div className="mt-2">

                {environment.key ? (
                  <code className="rounded-lg bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-gray-200">
                    {environment.key}
                  </code>
                ) : (
                  <span className="text-sm text-gray-400">
                    Not specified
                  </span>
                )}

              </div>

            </div>

            {/* STATUS */}

            <div className="rounded-xl bg-gray-50 p-4">

              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Status
              </p>

              <div className="mt-2">

                {environment.is_active !== false ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">

                    <span className="h-1.5 w-1.5 rounded-full bg-green-500" />

                    Active

                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700">

                    <span className="h-1.5 w-1.5 rounded-full bg-red-500" />

                    Inactive

                  </span>
                )}

              </div>

            </div>

          </div>

          {/* DESCRIPTION */}

          <div className="mt-5 rounded-xl bg-gray-50 p-4">

            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Description
            </p>

            <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-gray-700">
              {environment.description ||
                "No description provided."}
            </p>

          </div>

        </div>

        {/* ====================================================
            METADATA
        ==================================================== */}

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

          <div className="mb-6 flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50">

              <svg
                className="h-5 w-5 text-purple-600"
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

              <h2 className="text-lg font-bold text-gray-900">
                Metadata
              </h2>

              <p className="text-sm text-gray-500">
                Record information
              </p>

            </div>

          </div>

          <div className="space-y-5">

            {/* CREATED BY */}

            <div>

              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Created By
              </p>

              <p className="mt-1 text-sm font-medium text-gray-900">
                {environment.created_by_id
                  ? `User #${environment.created_by_id}`
                  : "System"}
              </p>

            </div>

            {/* CREATED AT */}

            <div>

              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Created At
              </p>

              <p className="mt-1 text-sm font-medium text-gray-900">
                {formatDate(
                  environment.created_at
                )}
              </p>

            </div>

            {/* UPDATED AT */}

            <div>

              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Updated At
              </p>

              <p className="mt-1 text-sm font-medium text-gray-900">
                {formatDate(
                  environment.updated_at
                )}
              </p>

            </div>

          </div>

        </div>

      </div>

      {/* ======================================================
          FOOTER
      ====================================================== */}

      <div className="flex justify-start">

        <button
          type="button"
          onClick={handleBack}
          className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50"
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

          Back to Environments

        </button>

      </div>

    </div>
  );
};

export default EnvironmentDetails;

