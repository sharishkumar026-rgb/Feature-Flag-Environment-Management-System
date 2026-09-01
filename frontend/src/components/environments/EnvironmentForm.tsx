import React, { useEffect, useState } from "react";
import {
  createEnvironment,
  updateEnvironment,
} from "../../api/environmentApi";

interface Environment {
  id: number;
  name: string;
  key?: string;
  description?: string;
  is_active?: boolean;
}

interface EnvironmentFormProps {
  environment?: Environment | null;
  onSuccess?: (environment: any) => void;
  onCancel?: () => void;
}

interface FormData {
  name: string;
  key: string;
  description: string;
  is_active: boolean;
}

const EnvironmentForm: React.FC<
  EnvironmentFormProps
> = ({
  environment,
  onSuccess,
  onCancel,
}) => {
  const isEditMode = Boolean(environment);

  const [formData, setFormData] = useState<FormData>({
    name: "",
    key: "",
    description: "",
    is_active: true,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ============================================================
  // LOAD ENVIRONMENT DATA IN EDIT MODE
  // ============================================================

  useEffect(() => {
    if (environment) {
      setFormData({
        name: environment.name || "",
        key: environment.key || "",
        description:
          environment.description || "",
        is_active:
          environment.is_active !== false,
      });
    } else {
      setFormData({
        name: "",
        key: "",
        description: "",
        is_active: true,
      });
    }

    setError("");
    setSuccess("");
  }, [environment]);

  // ============================================================
  // HANDLE INPUT
  // ============================================================

  const handleChange = (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  // ============================================================
  // HANDLE STATUS
  // ============================================================

  const handleStatusChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData((current) => ({
      ...current,
      is_active: event.target.checked,
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

    const name = formData.name.trim();
    const key = formData.key.trim();
    const description =
      formData.description.trim();

    // ==========================================================
    // VALIDATION
    // ==========================================================

    if (!name) {
      setError("Environment name is required.");
      return;
    }

    if (!key) {
      setError("Environment key is required.");
      return;
    }

    try {
      setLoading(true);

      // ========================================================
      // UPDATE
      // PUT /api/environments/{environment_id}
      // ========================================================

      if (isEditMode && environment) {
        const response =
          await updateEnvironment(
            environment.id,
            {
              name,
              key,
              description,
              is_active:
                formData.is_active,
            },
          );

        setSuccess(
          "Environment updated successfully."
        );

        if (onSuccess) {
          onSuccess(response);
        }
      }

      // ========================================================
      // CREATE
      // POST /api/environments
      // ========================================================

      else {
        const response =
          await createEnvironment({
            name,
            key,
            description,
            is_active:
              formData.is_active,
          });

        setSuccess(
          "Environment created successfully."
        );

        if (onSuccess) {
          onSuccess(response);
        }

        // Reset form after create
        setFormData({
          name: "",
          key: "",
          description: "",
          is_active: true,
        });
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
        } environment.`;

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
                d="M3 7h18M5 7v10a2 2 0 002 2h10a2 2 0 002-2V7M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2"
              />
            </svg>

          </div>

          <div>

            <h2 className="text-lg font-semibold text-gray-900">
              {isEditMode
                ? "Edit Environment"
                : "Create Environment"}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {isEditMode
                ? "Update the environment details."
                : "Create a new application environment."}
            </p>

          </div>

        </div>

      </div>

      {/* ========================================================
          FORM
      ========================================================= */}

      <form
        onSubmit={handleSubmit}
        className="space-y-6 p-6"
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
                d="M12 9v2m0 4h.01M10.29 3.86l-7.5 13A2 2 0 004.53 18h14.94a2 2 0 001.74-3l-7.5-13a2 2 0 00-3.42 0l-7.5 13z"
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

            <p className="text-sm text-green-700">
              {success}
            </p>

          </div>
        )}

        {/* ======================================================
            NAME
        ======================================================= */}

        <div>

          <label
            htmlFor="environment-name"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Environment Name
            <span className="ml-1 text-red-500">
              *
            </span>
          </label>

          <input
            id="environment-name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Production"
            disabled={loading}
            required
            maxLength={100}
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-gray-50"
          />

          <p className="mt-1.5 text-xs text-gray-500">
            A human-readable name for the environment.
          </p>

        </div>

        {/* ======================================================
            KEY
        ======================================================= */}

        <div>

          <label
            htmlFor="environment-key"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Environment Key
            <span className="ml-1 text-red-500">
              *
            </span>
          </label>

          <div className="relative">

            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">

              <span className="text-sm font-mono text-gray-400">
                #
              </span>

            </div>

            <input
              id="environment-key"
              name="key"
              type="text"
              value={formData.key}
              onChange={handleChange}
              placeholder="production"
              disabled={loading}
              required
              maxLength={100}
              className="w-full rounded-xl border border-gray-300 bg-white py-3.5 pl-10 pr-4 font-mono text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-gray-50"
            />

          </div>

          <p className="mt-1.5 text-xs text-gray-500">
            A unique key used to identify the environment.
          </p>

        </div>

        {/* ======================================================
            DESCRIPTION
        ======================================================= */}

        <div>

          <label
            htmlFor="environment-description"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Description
          </label>

          <textarea
            id="environment-description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe this environment..."
            disabled={loading}
            rows={4}
            maxLength={500}
            className="w-full resize-none rounded-xl border border-gray-300 bg-white px-4 py-3.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-gray-50"
          />

          <div className="mt-1.5 flex justify-between">

            <p className="text-xs text-gray-500">
              Optional description.
            </p>

            <span className="text-xs text-gray-400">
              {formData.description.length}/500
            </span>

          </div>

        </div>

        {/* ======================================================
            STATUS
        ======================================================= */}

        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">

          <label className="flex cursor-pointer items-center justify-between">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm">

                <svg
                  className={`h-5 w-5 ${
                    formData.is_active
                      ? "text-green-600"
                      : "text-gray-400"
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 12h14"
                  />
                </svg>

              </div>

              <div>

                <p className="text-sm font-semibold text-gray-900">
                  Active Environment
                </p>

                <p className="mt-0.5 text-xs text-gray-500">
                  Enable this environment for use.
                </p>

              </div>

            </div>

            <div className="relative">

              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={handleStatusChange}
                disabled={loading}
                className="peer sr-only"
              />

              <div className="h-6 w-11 rounded-full bg-gray-300 transition peer-checked:bg-green-500 peer-focus:ring-4 peer-focus:ring-green-100" />

              <div className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white shadow-sm transition peer-checked:translate-x-5" />

            </div>

          </label>

        </div>

        {/* ======================================================
            BUTTONS
        ======================================================= */}

        <div className="flex flex-col-reverse gap-3 border-t border-gray-200 pt-5 sm:flex-row sm:justify-end">

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

                {isEditMode
                  ? "Update Environment"
                  : "Create Environment"}
              </>
            )}

          </button>

        </div>

      </form>
    </div>
  );
};

export default EnvironmentForm;