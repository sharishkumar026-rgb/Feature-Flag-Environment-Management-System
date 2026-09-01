import React, { useEffect, useState } from "react";
import {
  createRollout,
  updateRollout,
} from "../../api/rolloutApi";

interface Rollout {
  id: number;
  feature_id?: number;
  environment_id?: number;
  percentage?: number;
  rollout_percentage?: number;
  is_active?: boolean;
}

interface RolloutFormProps {
  rollout?: Rollout | null;
  onSuccess?: (response: any) => void;
  onCancel?: () => void;
}

interface FormData {
  feature_id: string;
  environment_id: string;
  percentage: string;
  is_active: boolean;
}

const RolloutForm: React.FC<RolloutFormProps> = ({
  rollout,
  onSuccess,
  onCancel,
}) => {
  const isEditMode = Boolean(rollout);

  const [formData, setFormData] = useState<FormData>({
    feature_id: "",
    environment_id: "",
    percentage: "",
    is_active: true,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ============================================================
  // LOAD EDIT DATA
  // ============================================================

  useEffect(() => {
    if (rollout) {
      const percentage =
        rollout.rollout_percentage !== undefined
          ? rollout.rollout_percentage
          : rollout.percentage;

      setFormData({
        feature_id:
          rollout.feature_id !== undefined
            ? String(rollout.feature_id)
            : "",

        environment_id:
          rollout.environment_id !== undefined
            ? String(rollout.environment_id)
            : "",

        percentage:
          percentage !== undefined
            ? String(percentage)
            : "",

        is_active:
          rollout.is_active !== false,
      });
    }
  }, [rollout]);

  // ============================================================
  // INPUT CHANGE
  // ============================================================

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement
    >
  ) => {
    const { name, value, type, checked } =
      event.target;

    setFormData((current) => ({
      ...current,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));

    setError("");
    setSuccess("");
  };

  // ============================================================
  // VALIDATION
  // ============================================================

  const validateForm = () => {
    const featureId =
      Number(formData.feature_id);

    const environmentId =
      Number(formData.environment_id);

    const percentage =
      Number(formData.percentage);

    if (
      !formData.feature_id ||
      !Number.isInteger(featureId) ||
      featureId <= 0
    ) {
      setError(
        "Please enter a valid feature ID."
      );
      return false;
    }

    if (
      !formData.environment_id ||
      !Number.isInteger(environmentId) ||
      environmentId <= 0
    ) {
      setError(
        "Please enter a valid environment ID."
      );
      return false;
    }

    if (formData.percentage === "") {
      setError(
        "Please enter rollout percentage."
      );
      return false;
    }

    if (
      Number.isNaN(percentage) ||
      percentage < 0 ||
      percentage > 100
    ) {
      setError(
        "Rollout percentage must be between 0 and 100."
      );
      return false;
    }

    return true;
  };

  // ============================================================
  // SUBMIT
  // ============================================================

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      const requestData = {
        feature_id: Number(
          formData.feature_id
        ),

        environment_id: Number(
          formData.environment_id
        ),

        percentage: Number(
          formData.percentage
        ),

        is_active: formData.is_active,
      };

      let response;

      if (isEditMode && rollout) {
        response = await updateRollout(
          rollout.id,
          requestData
        );

        setSuccess(
          "Rollout updated successfully."
        );
      } else {
        response = await createRollout(
          requestData
        );

        setSuccess(
          "Rollout created successfully."
        );

        setFormData({
          feature_id: "",
          environment_id: "",
          percentage: "",
          is_active: true,
        });
      }

      if (onSuccess) {
        onSuccess(response);
      }
    } catch (err: any) {
      const message =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        err?.message ||
        `Failed to ${
          isEditMode
            ? "update"
            : "create"
        } rollout.`;

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // CANCEL
  // ============================================================

  const handleCancel = () => {
    if (loading) {
      return;
    }

    if (onCancel) {
      onCancel();
    }
  };

  // ============================================================
  // UI
  // ============================================================

  return (
    <div className="w-full rounded-2xl border border-gray-200 bg-white shadow-sm">

      {/* ======================================================
          HEADER
      ======================================================= */}

      <div className="border-b border-gray-200 px-6 py-5">

        <div className="flex items-center gap-4">

          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">

            <svg
              className="h-6 w-6 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 17v-2a4 4 0 014-4h6m0 0l-3-3m3 3l-3 3M5 7h6a2 2 0 012 2v1"
              />
            </svg>

          </div>

          <div>

            <h2 className="text-xl font-bold text-gray-900">
              {isEditMode
                ? "Edit Rollout"
                : "Create Rollout"}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {isEditMode
                ? "Update the feature rollout configuration."
                : "Configure a feature rollout for an environment."}
            </p>

          </div>

        </div>

      </div>

      {/* ======================================================
          FORM
      ======================================================= */}

      <form
        onSubmit={handleSubmit}
        className="space-y-6 p-6"
      >

        {/* ====================================================
            ERROR
        ===================================================== */}

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

            <p className="text-sm font-medium text-red-700">
              {error}
            </p>

          </div>
        )}

        {/* ====================================================
            SUCCESS
        ===================================================== */}

        {success && (
          <div className="flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3">

            <svg
              className="mt-0.5 h-5 w-5 shrink-0 text-green-500"
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

            <p className="text-sm font-medium text-green-700">
              {success}
            </p>

          </div>
        )}

        {/* ====================================================
            FEATURE ID
        ===================================================== */}

        <div>

          <label
            htmlFor="feature_id"
            className="mb-2 block text-sm font-semibold text-gray-700"
          >
            Feature ID
            <span className="ml-1 text-red-500">
              *
            </span>
          </label>

          <input
            id="feature_id"
            name="feature_id"
            type="number"
            min="1"
            value={formData.feature_id}
            onChange={handleChange}
            disabled={loading}
            placeholder="Enter feature ID"
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-gray-50"
          />

          <p className="mt-1.5 text-xs text-gray-500">
            Enter the ID of the feature flag.
          </p>

        </div>

        {/* ====================================================
            ENVIRONMENT ID
        ===================================================== */}

        <div>

          <label
            htmlFor="environment_id"
            className="mb-2 block text-sm font-semibold text-gray-700"
          >
            Environment ID
            <span className="ml-1 text-red-500">
              *
            </span>
          </label>

          <input
            id="environment_id"
            name="environment_id"
            type="number"
            min="1"
            value={
              formData.environment_id
            }
            onChange={handleChange}
            disabled={loading}
            placeholder="Enter environment ID"
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-gray-50"
          />

          <p className="mt-1.5 text-xs text-gray-500">
            Enter the ID of the target environment.
          </p>

        </div>

        {/* ====================================================
            PERCENTAGE
        ===================================================== */}

        <div>

          <div className="mb-2 flex items-center justify-between">

            <label
              htmlFor="percentage"
              className="block text-sm font-semibold text-gray-700"
            >
              Rollout Percentage
              <span className="ml-1 text-red-500">
                *
              </span>
            </label>

            <span className="text-sm font-bold text-blue-600">
              {formData.percentage || 0}%
            </span>

          </div>

          <input
            id="percentage"
            name="percentage"
            type="number"
            min="0"
            max="100"
            step="1"
            value={formData.percentage}
            onChange={handleChange}
            disabled={loading}
            placeholder="0 - 100"
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-gray-50"
          />

          {/* Progress */}

          <div className="mt-3">

            <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">

              <div
                className="h-full rounded-full bg-blue-600 transition-all duration-300"
                style={{
                  width: `${Math.min(
                    Math.max(
                      Number(
                        formData.percentage ||
                          0
                      ),
                      0
                    ),
                    100
                  )}%`,
                }}
              />

            </div>

          </div>

          <p className="mt-1.5 text-xs text-gray-500">
            Percentage must be between 0% and 100%.
          </p>

        </div>

        {/* ====================================================
            ACTIVE STATUS
        ===================================================== */}

        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">

          <label className="flex cursor-pointer items-center justify-between gap-4">

            <div>

              <p className="text-sm font-semibold text-gray-800">
                Active Rollout
              </p>

              <p className="mt-1 text-xs text-gray-500">
                Enable this rollout immediately.
              </p>

            </div>

            <div className="relative">

              <input
                type="checkbox"
                name="is_active"
                checked={
                  formData.is_active
                }
                onChange={handleChange}
                disabled={loading}
                className="peer sr-only"
              />

              <div className="h-6 w-11 rounded-full bg-gray-300 transition peer-checked:bg-blue-600 peer-focus:ring-4 peer-focus:ring-blue-100" />

              <div className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white shadow-sm transition peer-checked:translate-x-5" />

            </div>

          </label>

        </div>

        {/* ====================================================
            ACTIONS
        ===================================================== */}

        <div className="flex flex-col-reverse gap-3 border-t border-gray-200 pt-6 sm:flex-row sm:justify-end">

          {onCancel && (
            <button
              type="button"
              onClick={handleCancel}
              disabled={loading}
              className="rounded-xl border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-blue-400"
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

                {isEditMode
                  ? "Updating..."
                  : "Creating..."}
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
                    d={
                      isEditMode
                        ? "M5 13l4 4L19 7"
                        : "M12 4v16m8-8H4"
                    }
                  />
                </svg>

                {isEditMode
                  ? "Update Rollout"
                  : "Create Rollout"}
              </>
            )}

          </button>

        </div>

      </form>

    </div>
  );
};

export default RolloutForm;