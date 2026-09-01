import React, { useState } from "react";
import { evaluateFeatureFlag } from "../../api/featureFlagApi";

interface FeatureEvaluationProps {
  featureId: number;
}

interface EvaluationResult {
  enabled?: boolean;
  is_enabled?: boolean;
  result?: boolean;
  feature_enabled?: boolean;
  message?: string;
  feature_flag?: {
    id?: number;
    name?: string;
    key?: string;
  };
  user?: {
    id?: number;
    name?: string;
    email?: string;
  };
  environment?: {
    id?: number;
    name?: string;
  };
}

const FeatureEvaluation: React.FC<
  FeatureEvaluationProps
> = ({ featureId }) => {
  const [userId, setUserId] = useState("");

  const [result, setResult] =
    useState<EvaluationResult | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ============================================================
  // EVALUATE FEATURE
  // POST /api/feature-flags/{feature_id}/evaluate/{user_id}
  // ============================================================

  const handleEvaluate = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");
    setResult(null);

    const parsedUserId = Number(userId);

    if (!userId.trim()) {
      setError("User ID is required.");
      return;
    }

    if (
      !Number.isInteger(parsedUserId) ||
      parsedUserId <= 0
    ) {
      setError("Please enter a valid User ID.");
      return;
    }

    try {
      setLoading(true);

      const response =
        await evaluateFeatureFlag(
          featureId,
          parsedUserId
        );

      const data =
        response?.data ||
        response?.result ||
        response;

      setResult(data);
    } catch (err: any) {
      const message =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        err?.message ||
        "Failed to evaluate feature flag.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // DETERMINE EVALUATION RESULT
  // ============================================================

  const isFeatureEnabled =
    result?.enabled === true ||
    result?.is_enabled === true ||
    result?.result === true ||
    result?.feature_enabled === true;

  const hasExplicitResult =
    typeof result?.enabled === "boolean" ||
    typeof result?.is_enabled === "boolean" ||
    typeof result?.result === "boolean" ||
    typeof result?.feature_enabled === "boolean";

  return (
    <div className="w-full rounded-2xl border border-gray-200 bg-white shadow-sm">

      {/* ========================================================
          HEADER
      ========================================================= */}

      <div className="border-b border-gray-200 px-6 py-5">

        <div className="flex items-center gap-3">

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-100 text-purple-600">

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
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>

          </div>

          <div>

            <h2 className="text-lg font-semibold text-gray-900">
              Feature Evaluation
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Check whether this feature is enabled
              for a specific user.
            </p>

          </div>

        </div>

      </div>

      {/* ========================================================
          FORM
      ========================================================= */}

      <form
        onSubmit={handleEvaluate}
        className="space-y-5 p-6"
      >

        {/* ======================================================
            FEATURE ID
        ======================================================= */}

        <div className="rounded-xl bg-gray-50 px-4 py-3">

          <div className="flex items-center justify-between">

            <span className="text-sm text-gray-500">
              Feature ID
            </span>

            <span className="font-mono text-sm font-semibold text-gray-900">
              #{featureId}
            </span>

          </div>

        </div>

        {/* ======================================================
            USER ID
        ======================================================= */}

        <div>

          <label
            htmlFor="evaluation-user-id"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            User ID
            <span className="ml-1 text-red-500">
              *
            </span>
          </label>

          <div className="relative">

            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">

              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>

            </div>

            <input
              id="evaluation-user-id"
              type="number"
              min="1"
              value={userId}
              onChange={(event) =>
                setUserId(event.target.value)
              }
              placeholder="Enter user ID"
              required
              disabled={loading}
              className="w-full rounded-xl border border-gray-300 bg-white py-3.5 pl-12 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 disabled:cursor-not-allowed disabled:bg-gray-50"
            />

          </div>

          <p className="mt-1.5 text-xs text-gray-500">
            Enter the ID of the user you want to evaluate.
          </p>

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
                d="M12 9v2m0 4h.01M10.29 3.86l-7.5 13A2 2 0 004.53 18h14.94a2 2 0 001.74-3l-7.5-13a2 2 0 00-3.42 0l-7.5 13z"
              />
            </svg>

            <p className="text-sm text-red-700">
              {error}
            </p>

          </div>
        )}

        {/* ======================================================
            EVALUATE BUTTON
        ======================================================= */}

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-purple-600 px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-purple-700 focus:outline-none focus:ring-4 focus:ring-purple-100 disabled:cursor-not-allowed disabled:bg-purple-400"
        >

          {loading ? (
            <>
              <svg
                className="h-5 w-5 animate-spin"
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

              Evaluating...
            </>
          ) : (
            <>
              Evaluate Feature

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
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </>
          )}

        </button>

        {/* ======================================================
            RESULT
        ======================================================= */}

        {result && (
          <div
            className={`overflow-hidden rounded-2xl border ${
              hasExplicitResult && isFeatureEnabled
                ? "border-green-200"
                : hasExplicitResult
                  ? "border-gray-200"
                  : "border-blue-200"
            }`}
          >

            {/* RESULT HEADER */}

            <div
              className={`px-5 py-4 ${
                hasExplicitResult && isFeatureEnabled
                  ? "bg-green-50"
                  : hasExplicitResult
                    ? "bg-gray-50"
                    : "bg-blue-50"
              }`}
            >

              <div className="flex items-center gap-3">

                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                    hasExplicitResult &&
                    isFeatureEnabled
                      ? "bg-green-100 text-green-600"
                      : hasExplicitResult
                        ? "bg-gray-200 text-gray-600"
                        : "bg-blue-100 text-blue-600"
                  }`}
                >

                  {hasExplicitResult &&
                  isFeatureEnabled ? (
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
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
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
                        d="M13 16h-1v-4h-1m1-4h.01M12 21a9 9 0 100-18 9 9 0 000 18z"
                      />
                    </svg>
                  )}

                </div>

                <div>

                  <h3
                    className={`text-sm font-semibold ${
                      hasExplicitResult &&
                      isFeatureEnabled
                        ? "text-green-900"
                        : hasExplicitResult
                          ? "text-gray-900"
                          : "text-blue-900"
                    }`}
                  >
                    Evaluation Result
                  </h3>

                  <p className="mt-0.5 text-xs text-gray-500">
                    User #{userId}
                  </p>

                </div>

              </div>

            </div>

            {/* RESULT BODY */}

            <div className="space-y-5 bg-white p-5">

              {/* STATUS */}

              {hasExplicitResult && (
                <div className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 px-4 py-4">

                  <div>

                    <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                      Feature Status
                    </p>

                    <p
                      className={`mt-1 text-lg font-bold ${
                        isFeatureEnabled
                          ? "text-green-600"
                          : "text-gray-600"
                      }`}
                    >
                      {isFeatureEnabled
                        ? "Enabled"
                        : "Disabled"}
                    </p>

                  </div>

                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-full ${
                      isFeatureEnabled
                        ? "bg-green-100"
                        : "bg-gray-200"
                    }`}
                  >

                    {isFeatureEnabled ? (
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
                    ) : (
                      <svg
                        className="h-6 w-6 text-gray-500"
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

                </div>
              )}

              {/* FEATURE INFORMATION */}

              {result.feature_flag && (
                <div className="space-y-3">

                  <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                    Feature
                  </p>

                  <div className="rounded-xl border border-gray-100 p-4">

                    {result.feature_flag.name && (
                      <p className="text-sm font-semibold text-gray-900">
                        {result.feature_flag.name}
                      </p>
                    )}

                    {result.feature_flag.key && (
                      <code className="mt-2 inline-block rounded-lg bg-gray-100 px-2.5 py-1 text-xs text-gray-600">
                        {result.feature_flag.key}
                      </code>
                    )}

                    {result.feature_flag.id && (
                      <p className="mt-2 text-xs text-gray-400">
                        Feature ID: #
                        {result.feature_flag.id}
                      </p>
                    )}

                  </div>

                </div>
              )}

              {/* USER INFORMATION */}

              {result.user && (
                <div className="space-y-3">

                  <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                    User
                  </p>

                  <div className="flex items-center gap-3 rounded-xl border border-gray-100 p-4">

                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-600">
                      {(
                        result.user.name ||
                        result.user.email ||
                        "U"
                      )
                        .charAt(0)
                        .toUpperCase()}
                    </div>

                    <div>

                      <p className="text-sm font-semibold text-gray-900">
                        {result.user.name ||
                          `User #${result.user.id}`}
                      </p>

                      {result.user.email && (
                        <p className="mt-0.5 text-xs text-gray-500">
                          {result.user.email}
                        </p>
                      )}

                    </div>

                  </div>

                </div>
              )}

              {/* ENVIRONMENT */}

              {result.environment && (
                <div className="space-y-3">

                  <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                    Environment
                  </p>

                  <div className="rounded-xl border border-gray-100 p-4">

                    <p className="text-sm font-semibold text-gray-900">
                      {result.environment.name ||
                        `Environment #${result.environment.id}`}
                    </p>

                  </div>

                </div>
              )}

              {/* MESSAGE */}

              {result.message && (
                <div className="rounded-xl bg-gray-50 px-4 py-3">

                  <p className="text-sm text-gray-600">
                    {result.message}
                  </p>

                </div>
              )}

            </div>

          </div>
        )}

      </form>
    </div>
  );
};

export default FeatureEvaluation;