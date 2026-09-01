
import React, { useState } from "react";
import { evaluateFeatureFlag } from "../../api/featureFlagApi";

interface FeatureFlagEvaluationProps {
  featureId: number;
  featureName?: string;
}

interface EvaluationResult {
  success?: boolean;
  message?: string;
  enabled?: boolean;
  is_enabled?: boolean;
  feature_id?: number;
  user_id?: number;
  [key: string]: unknown;
}

const FeatureFlagEvaluation: React.FC<
  FeatureFlagEvaluationProps
> = ({
  featureId,
  featureName,
}) => {
  const [userId, setUserId] = useState<string>("");

  const [loading, setLoading] =
    useState<boolean>(false);

  const [error, setError] =
    useState<string>("");

  const [result, setResult] =
    useState<EvaluationResult | null>(null);

  // ============================================================
  // EVALUATE FEATURE FLAG
  // ============================================================

  const handleEvaluate = async (): Promise<void> => {
    setError("");
    setResult(null);

    const parsedUserId = Number(userId);

    if (!userId.trim()) {
      setError("Please enter a user ID.");
      return;
    }

    if (
      !Number.isInteger(parsedUserId) ||
      parsedUserId <= 0
    ) {
      setError(
        "User ID must be a valid positive number."
      );
      return;
    }

    try {
      setLoading(true);

      const response = await evaluateFeatureFlag(
        featureId,
        parsedUserId
      );

      console.log(
        "Feature flag evaluation response:",
        response
      );

      setResult(response);
    } catch (err: any) {
      console.error(
        "Failed to evaluate feature flag:",
        err
      );

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
  // CLEAR
  // ============================================================

  const handleClear = (): void => {
    setUserId("");
    setError("");
    setResult(null);
  };

  // ============================================================
  // GET EVALUATION STATUS
  // ============================================================

  const getEvaluationStatus = (): boolean => {
    if (!result) {
      return false;
    }

    if (
      typeof result.enabled === "boolean"
    ) {
      return result.enabled;
    }

    if (
      typeof result.is_enabled === "boolean"
    ) {
      return result.is_enabled;
    }

    return false;
  };

  const isEnabled =
    getEvaluationStatus();

  // ============================================================
  // UI
  // ============================================================

  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">

      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="border-b border-gray-200 px-6 py-5">

        <div className="flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">

            <svg
              className="h-5 w-5 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622C17.176 19.29 21 14.591 21 9c0-1.065-.138-2.098-.4-3.08z"
              />
            </svg>

          </div>

          <div>

            <h2 className="text-lg font-bold text-gray-900">
              Evaluate Feature Flag
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Check whether this feature is enabled
              for a specific user.
            </p>

          </div>

        </div>

      </div>

      {/* ======================================================
          BODY
      ====================================================== */}

      <div className="space-y-6 p-6">

        {/* FEATURE */}
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">

          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            Feature
          </p>

          <p className="mt-1 text-sm font-semibold text-gray-900">
            {featureName ||
              `Feature #${featureId}`}
          </p>

          <p className="mt-1 text-xs text-gray-500">
            Feature ID: {featureId}
          </p>

        </div>

        {/* ====================================================
            USER ID INPUT
        ==================================================== */}

        <div>

          <label
            htmlFor="evaluation-user-id"
            className="mb-2 block text-sm font-semibold text-gray-700"
          >
            User ID
          </label>

          <input
            id="evaluation-user-id"
            type="number"
            min="1"
            value={userId}
            onChange={(event) =>
              setUserId(event.target.value)
            }
            placeholder="Enter user ID"
            disabled={loading}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-gray-100"
          />

          <p className="mt-2 text-xs text-gray-500">
            Enter the ID of the user for whom you
            want to evaluate this feature flag.
          </p>

        </div>

        {/* ====================================================
            ERROR
        ==================================================== */}

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
                d="M12 9v2m0 4h.01M10.29 3.86l-7.5 13A2 2 0 003.66 18h16.68a2 2 0 001.74-1l-7.5-13a2 2 0 00-3.48 0z"
              />
            </svg>

            <p className="text-sm font-medium text-red-800">
              {error}
            </p>

          </div>
        )}

        {/* ====================================================
            ACTIONS
        ==================================================== */}

        <div className="flex flex-col gap-3 sm:flex-row">

          <button
            type="button"
            onClick={handleEvaluate}
            disabled={loading}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
          >

            {loading ? (
              <>
                <svg
                  className="h-5 w-5 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
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
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622C17.176 19.29 21 14.591 21 9c0-1.065-.138-2.098-.4-3.08z"
                  />
                </svg>

                Evaluate Feature
              </>
            )}

          </button>

          <button
            type="button"
            onClick={handleClear}
            disabled={loading}
            className="rounded-xl border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Clear
          </button>

        </div>

        {/* ====================================================
            RESULT
        ==================================================== */}

        {result && (
          <div
            className={`rounded-2xl border p-5 ${
              isEnabled
                ? "border-green-200 bg-green-50"
                : "border-red-200 bg-red-50"
            }`}
          >

            <div className="flex items-start gap-4">

              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
                  isEnabled
                    ? "bg-green-100"
                    : "bg-red-100"
                }`}
              >

                {isEnabled ? (
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
                    className="h-6 w-6 text-red-600"
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

              <div className="min-w-0 flex-1">

                <p
                  className={`text-lg font-bold ${
                    isEnabled
                      ? "text-green-800"
                      : "text-red-800"
                  }`}
                >
                  {isEnabled
                    ? "Feature Enabled"
                    : "Feature Disabled"}
                </p>

                <p
                  className={`mt-1 text-sm ${
                    isEnabled
                      ? "text-green-700"
                      : "text-red-700"
                  }`}
                >
                  {result.message ||
                    (isEnabled
                      ? "The feature is enabled for this user."
                      : "The feature is disabled for this user.")}
                </p>

              </div>

            </div>

            {/* RESULT DETAILS */}

            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">

              <div className="rounded-xl bg-white/70 p-3">

                <p className="text-xs font-medium text-gray-500">
                  Feature ID
                </p>

                <p className="mt-1 text-sm font-semibold text-gray-900">
                  {result.feature_id ??
                    featureId}
                </p>

              </div>

              <div className="rounded-xl bg-white/70 p-3">

                <p className="text-xs font-medium text-gray-500">
                  User ID
                </p>

                <p className="mt-1 text-sm font-semibold text-gray-900">
                  {result.user_id ??
                    Number(userId)}
                </p>

              </div>

              <div className="rounded-xl bg-white/70 p-3 sm:col-span-2">

                <p className="text-xs font-medium text-gray-500">
                  Evaluation Result
                </p>

                <p
                  className={`mt-1 text-sm font-bold ${
                    isEnabled
                      ? "text-green-700"
                      : "text-red-700"
                  }`}
                >
                  {isEnabled
                    ? "ENABLED"
                    : "DISABLED"}
                </p>

              </div>

            </div>

          </div>
        )}

      </div>

    </div>
  );
};

export default FeatureFlagEvaluation;

