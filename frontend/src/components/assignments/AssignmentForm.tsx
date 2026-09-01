import React, { useEffect, useState } from "react";
import {
  createAssignment,
  updateAssignment,
} from "../../api/assignmentApi";

interface Assignment {
  id: number;
  user_id?: number;
  feature_id?: number;
  environment_id?: number;
  is_enabled?: boolean;
  is_active?: boolean;
  value?: string | boolean | number | null;
}

interface AssignmentFormProps {
  assignment?: Assignment | null;
  onSuccess?: (response: any) => void;
  onCancel?: () => void;
}

interface FormData {
  user_id: string;
  feature_id: string;
  environment_id: string;
  value: string;
  is_enabled: boolean;
  is_active: boolean;
}

const AssignmentForm: React.FC<
  AssignmentFormProps
> = ({
  assignment,
  onSuccess,
  onCancel,
}) => {
  const isEditMode = Boolean(assignment);

  const [formData, setFormData] =
    useState<FormData>({
      user_id: "",
      feature_id: "",
      environment_id: "",
      value: "",
      is_enabled: true,
      is_active: true,
    });

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  // ============================================================
  // LOAD ASSIGNMENT FOR EDIT
  // ============================================================

  useEffect(() => {
    if (assignment) {
      setFormData({
        user_id:
          assignment.user_id !== undefined
            ? String(assignment.user_id)
            : "",

        feature_id:
          assignment.feature_id !== undefined
            ? String(assignment.feature_id)
            : "",

        environment_id:
          assignment.environment_id !==
          undefined
            ? String(
                assignment.environment_id
              )
            : "",

        value:
          assignment.value !== undefined &&
          assignment.value !== null
            ? String(assignment.value)
            : "",

        is_enabled:
          assignment.is_enabled !== false,

        is_active:
          assignment.is_active !== false,
      });
    }
  }, [assignment]);

  // ============================================================
  // HANDLE INPUT CHANGE
  // ============================================================

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement
    >
  ) => {
    const {
      name,
      value,
      type,
      checked,
    } = event.target;

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
    const userId = Number(
      formData.user_id
    );

    const featureId = Number(
      formData.feature_id
    );

    const environmentId = Number(
      formData.environment_id
    );

    if (
      !formData.user_id ||
      !Number.isInteger(userId) ||
      userId <= 0
    ) {
      setError(
        "Please enter a valid user ID."
      );
      return false;
    }

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
        user_id: Number(
          formData.user_id
        ),

        feature_id: Number(
          formData.feature_id
        ),

        environment_id: Number(
          formData.environment_id
        ),

        value:
          formData.value.trim() === ""
            ? null
            : formData.value.trim(),

        is_enabled:
          formData.is_enabled,

        is_active:
          formData.is_active,
      };

      let response;

      // ========================================================
      // UPDATE
      // ========================================================

      if (
        isEditMode &&
        assignment
      ) {
        response =
          await updateAssignment(
            assignment.id,
            requestData
          );

        setSuccess(
          "Assignment updated successfully."
        );
      }

      // ========================================================
      // CREATE
      // ========================================================

      else {
        response =
          await createAssignment(
            requestData
          );

        setSuccess(
          "Assignment created successfully."
        );

        setFormData({
          user_id: "",
          feature_id: "",
          environment_id: "",
          value: "",
          is_enabled: true,
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
        } assignment.`;

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

          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100">

            <svg
              className="h-6 w-6 text-purple-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a4 4 0 00-4-4h-1m-4 6H3v-2a4 4 0 014-4h4m4-6a4 4 0 11-8 0 4 4 0 018 0zm6 0a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>

          </div>

          <div>

            <h2 className="text-xl font-bold text-gray-900">
              {isEditMode
                ? "Edit Assignment"
                : "Create Assignment"}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {isEditMode
                ? "Update the feature assignment configuration."
                : "Assign a feature flag to a specific user and environment."}
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
                d="M12 9v2m0 4h.01M10.29 3.86l-7.5 13A2 2 0 004.53 18h14.94a2 2 0 001.74-3l-7.5-13a2 2 0 00-3.42 0l-7.5-13a2 2 0 00-3.42 0z"
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
            USER ID
        ===================================================== */}

        <div>

          <label
            htmlFor="user_id"
            className="mb-2 block text-sm font-semibold text-gray-700"
          >
            User ID
            <span className="ml-1 text-red-500">
              *
            </span>
          </label>

          <input
            id="user_id"
            name="user_id"
            type="number"
            min="1"
            value={formData.user_id}
            onChange={handleChange}
            disabled={loading}
            placeholder="Enter user ID"
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-gray-50"
          />

          <p className="mt-1.5 text-xs text-gray-500">
            Enter the ID of the user receiving this assignment.
          </p>

        </div>

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
            Enter the feature flag ID.
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
            Enter the environment where the assignment applies.
          </p>

        </div>

        {/* ====================================================
            VALUE
        ===================================================== */}

        <div>

          <label
            htmlFor="value"
            className="mb-2 block text-sm font-semibold text-gray-700"
          >
            Assignment Value
          </label>

          <input
            id="value"
            name="value"
            type="text"
            value={formData.value}
            onChange={handleChange}
            disabled={loading}
            placeholder="Enter assignment value"
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-gray-50"
          />

          <p className="mt-1.5 text-xs text-gray-500">
            Optional value for this user assignment.
          </p>

        </div>

        {/* ====================================================
            ENABLED STATUS
        ===================================================== */}

        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">

          <label className="flex cursor-pointer items-center justify-between gap-4">

            <div>

              <p className="text-sm font-semibold text-gray-800">
                Assignment Enabled
              </p>

              <p className="mt-1 text-xs text-gray-500">
                Enable or disable this feature assignment.
              </p>

            </div>

            <div className="relative">

              <input
                type="checkbox"
                name="is_enabled"
                checked={
                  formData.is_enabled
                }
                onChange={handleChange}
                disabled={loading}
                className="peer sr-only"
              />

              <div className="h-6 w-11 rounded-full bg-gray-300 transition peer-checked:bg-green-600 peer-focus:ring-4 peer-focus:ring-green-100" />

              <div className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white shadow-sm transition peer-checked:translate-x-5" />

            </div>

          </label>

        </div>

        {/* ====================================================
            ACTIVE STATUS
        ===================================================== */}

        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">

          <label className="flex cursor-pointer items-center justify-between gap-4">

            <div>

              <p className="text-sm font-semibold text-gray-800">
                Active Assignment
              </p>

              <p className="mt-1 text-xs text-gray-500">
                Keep this assignment active in the system.
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
                  ? "Update Assignment"
                  : "Create Assignment"}
              </>
            )}

          </button>

        </div>

      </form>

    </div>
  );
};

export default AssignmentForm;