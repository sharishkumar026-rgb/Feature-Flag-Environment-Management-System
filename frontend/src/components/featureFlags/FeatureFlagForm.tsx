import React, { useEffect, useState } from "react";
import {
  createFeatureFlag,
  updateFeatureFlag,
} from "../../api/featureFlagApi";

interface FeatureFlag {
  id: number;
  name: string;
  key?: string;
  description?: string;
  is_enabled?: boolean;
  is_active?: boolean;
  environment_id?: number;
}

interface FeatureFlagFormProps {
  featureFlag?: FeatureFlag | null;
  onSuccess?: (response: any) => void;
  onCancel?: () => void;
}

interface FormData {
  name: string;
  key: string;
  description: string;
  environment_id: string;
}

const FeatureFlagForm: React.FC<FeatureFlagFormProps> = ({
  featureFlag,
  onSuccess,
  onCancel,
}) => {
  const isEditMode = Boolean(featureFlag);

  const [formData, setFormData] = useState<FormData>({
    name: "",
    key: "",
    description: "",
    environment_id: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ============================================================
  // LOAD FEATURE FLAG FOR EDIT
  // ============================================================

  useEffect(() => {
    if (featureFlag) {
      setFormData({
        name: featureFlag.name || "",
        key: featureFlag.key || "",
        description: featureFlag.description || "",
        environment_id:
          featureFlag.environment_id !== undefined &&
          featureFlag.environment_id !== null
            ? String(featureFlag.environment_id)
            : "",
      });
    } else {
      setFormData({
        name: "",
        key: "",
        description: "",
        environment_id: "",
      });
    }

    setError("");
    setSuccess("");
  }, [featureFlag]);

  // ============================================================
  // INPUT CHANGE
  // ============================================================

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
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

    if (!formData.name.trim()) {
      setError("Feature name is required.");
      return;
    }

    if (!formData.key.trim()) {
      setError("Feature key is required.");
      return;
    }

    try {
      setLoading(true);

      const data: any = {
        name: formData.name.trim(),
        key: formData.key.trim(),
        description: formData.description.trim() || undefined,
      };

      if (formData.environment_id.trim()) {
        data.environment_id = Number(
          formData.environment_id
        );
      }

      let response;

      // ========================================================
      // CREATE
      // POST /api/feature-flags
      // ========================================================

      if (!isEditMode) {
        response = await createFeatureFlag(data);

        setSuccess(
          response?.message ||
            "Feature flag created successfully."
        );

        setFormData({
          name: "",
          key: "",
          description: "",
          environment_id: "",
        });
      }

      // ========================================================
      // UPDATE
      // PUT /api/feature-flags/{feature_id}
      // ========================================================

      else {
        response = await updateFeatureFlag(
          featureFlag!.id,
          data
        );

        setSuccess(
          response?.message ||
            "Feature flag updated successfully."
        );
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
          isEditMode ? "update" : "create"
        } feature flag.`;

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full rounded-2xl border border-gray-200 bg-white shadow-sm">

      {/* ========================================================
          HEADER
      ========================================================= */}

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
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {isEditMode
                ? "Edit Feature Flag"
                : "Create Feature Flag"}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {isEditMode
                ? "Update the feature flag configuration."
                : "Create a new feature flag for your application."}
            </p>
          </div>

        </div>
      </div>

      {/* ========================================================
          FORM
      ========================================================= */}

      <form
        onSubmit={handleSubmit}
        className="space-y-6 px-6 py-6"
      >

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
                d="M12 9v2m0 4h.01M10.29 3.86l-7.5 13A2 2 0 004.53 18h14.94a2 2 0 001.74-3l-7.5-13a2 2 0 00-3.42 0z"
              />
            </svg>

            <p className="text-sm text-red-700">
              {error}
            </p>

          </div>
        )}

        {/* ======================================================
            SUCCESS
        ======================================================= */}

        {success && (
          <div className="flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3">

            <svg
              className="mt-0.5 h-5 w-5 shrink-0 text-green-600"
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

            <p className="text-sm text-green-700">
              {success}
            </p>

          </div>
        )}

        {/* ======================================================
            NAME + KEY
        ======================================================= */}

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

          {/* NAME */}

          <div>
            <label
              htmlFor="feature-name"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Feature Name
              <span className="ml-1 text-red-500">
                *
              </span>
            </label>

            <input
              id="feature-name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. New Dashboard"
              required
              disabled={loading}
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-gray-50"
            />
          </div>

          {/* KEY */}

          <div>
            <label
              htmlFor="feature-key"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Feature Key
              <span className="ml-1 text-red-500">
                *
              </span>
            </label>

            <input
              id="feature-key"
              name="key"
              type="text"
              value={formData.key}
              onChange={handleChange}
              placeholder="e.g. new_dashboard"
              required
              disabled={loading}
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-gray-50"
            />

            <p className="mt-1.5 text-xs text-gray-500">
              Use a unique key to identify this feature.
            </p>
          </div>

        </div>

        {/* ======================================================
            DESCRIPTION
        ======================================================= */}

        <div>
          <label
            htmlFor="feature-description"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Description
          </label>

          <textarea
            id="feature-description"
            name="description"
            rows={4}
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe what this feature controls..."
            disabled={loading}
            className="w-full resize-none rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-gray-50"
          />

          <p className="mt-1.5 text-xs text-gray-500">
            Add a short description to help administrators
            understand this feature.
          </p>
        </div>

        {/* ======================================================
            ENVIRONMENT ID
        ======================================================= */}

        <div>
          <label
            htmlFor="feature-environment"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Environment ID
          </label>

          <input
            id="feature-environment"
            name="environment_id"
            type="number"
            min="1"
            value={formData.environment_id}
            onChange={handleChange}
            placeholder="e.g. 1"
            disabled={loading}
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-gray-50"
          />

          <p className="mt-1.5 text-xs text-gray-500">
            Enter the environment ID if this feature is
            associated with a specific environment.
          </p>
        </div>

        {/* ======================================================
            INFO
        ======================================================= */}

        <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-4">

          <div className="flex items-start gap-3">

            <svg
              className="mt-0.5 h-5 w-5 shrink-0 text-blue-600"
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

            <div>
              <p className="text-sm font-medium text-blue-900">
                Feature flag status
              </p>

              <p className="mt-1 text-xs leading-5 text-blue-700">
                New feature flags can be enabled or disabled
                from the feature flag list after creation.
              </p>
            </div>

          </div>

        </div>

        {/* ======================================================
            BUTTONS
        ======================================================= */}

        <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:justify-end">

          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
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
                {isEditMode
                  ? "Update Feature"
                  : "Create Feature"}

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

        </div>

      </form>
    </div>
  );
};

export default FeatureFlagForm;
