import React, { useState } from "react";
import {
  enableFeatureFlag,
  disableFeatureFlag,
} from "../../api/featureFlagApi";

interface FeatureFlagToggleProps {
  featureId: number;
  isEnabled: boolean;
  onStatusChange?: (
    isEnabled: boolean,
    response?: any
  ) => void;
  disabled?: boolean;
}

const FeatureFlagToggle: React.FC<
  FeatureFlagToggleProps
> = ({
  featureId,
  isEnabled,
  onStatusChange,
  disabled = false,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ============================================================
  // TOGGLE FEATURE FLAG
  // ============================================================

  const handleToggle = async () => {
    if (loading || disabled) {
      return;
    }

    try {
      setLoading(true);
      setError("");

      let response;

      // ========================================================
      // ENABLE
      // PATCH /api/feature-flags/{feature_id}/enable
      // ========================================================

      if (!isEnabled) {
        response = await enableFeatureFlag(
          featureId
        );

        if (onStatusChange) {
          onStatusChange(true, response);
        }
      }

      // ========================================================
      // DISABLE
      // PATCH /api/feature-flags/{feature_id}/disable
      // ========================================================

      else {
        response = await disableFeatureFlag(
          featureId
        );

        if (onStatusChange) {
          onStatusChange(false, response);
        }
      }
    } catch (err: any) {
      const message =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        err?.message ||
        `Failed to ${
          isEnabled ? "disable" : "enable"
        } feature flag.`;

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-start gap-2">

      {/* ========================================================
          TOGGLE
      ========================================================= */}

      <button
        type="button"
        role="switch"
        aria-checked={isEnabled}
        aria-label={
          isEnabled
            ? "Disable feature flag"
            : "Enable feature flag"
        }
        onClick={handleToggle}
        disabled={loading || disabled}
        className={`group relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-all duration-200 focus:outline-none focus:ring-4 ${
          isEnabled
            ? "bg-green-500 focus:ring-green-100"
            : "bg-gray-300 focus:ring-gray-100"
        } ${
          loading || disabled
            ? "cursor-not-allowed opacity-60"
            : "cursor-pointer"
        }`}
      >

        {/* ======================================================
            SLIDER
        ======================================================= */}

        <span
          className={`inline-flex h-5 w-5 transform items-center justify-center rounded-full bg-white shadow-sm transition-transform duration-200 ${
            isEnabled
              ? "translate-x-6"
              : "translate-x-1"
          }`}
        >

          {loading && (
            <svg
              className="h-3 w-3 animate-spin text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="3"
              />

              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v3a5 5 0 00-5 5H4z"
              />
            </svg>
          )}

        </span>

      </button>

      {/* ========================================================
          STATUS TEXT
      ========================================================= */}

      <div className="flex items-center gap-2">

        <span
          className={`h-2 w-2 rounded-full ${
            isEnabled
              ? "bg-green-500"
              : "bg-gray-400"
          }`}
        />

        <span
          className={`text-xs font-semibold ${
            isEnabled
              ? "text-green-700"
              : "text-gray-500"
          }`}
        >
          {loading
            ? "Updating..."
            : isEnabled
              ? "Enabled"
              : "Disabled"}
        </span>

      </div>

      {/* ========================================================
          ERROR
      ========================================================= */}

      {error && (
        <p className="max-w-[220px] text-xs text-red-600">
          {error}
        </p>
      )}

    </div>
  );
};

export default FeatureFlagToggle;