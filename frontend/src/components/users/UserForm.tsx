import React, { useEffect, useState } from "react";
import {
  createUser,
  updateUser,
  type CreateUserRequest,
  type UpdateUserRequest,
} from "../../api/userApi";

interface UserFormProps {
  user?: {
    id: number;
    name: string;
    email: string;
    role_id?: number;
    is_active?: boolean;
  };
  onSuccess?: (response: any) => void;
  onCancel?: () => void;
}

const UserForm: React.FC<UserFormProps> = ({
  user,
  onSuccess,
  onCancel,
}) => {
  const isEditMode = Boolean(user);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [roleId, setRoleId] = useState("");
  const [isActive, setIsActive] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ============================================================
  // LOAD USER DATA FOR EDIT
  // ============================================================

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setRoleId(
        user.role_id !== undefined
          ? String(user.role_id)
          : ""
      );
      setIsActive(user.is_active ?? true);
    } else {
      setName("");
      setEmail("");
      setPassword("");
      setRoleId("");
      setIsActive(true);
    }

    setError("");
    setSuccess("");
  }, [user]);

  // ============================================================
  // SUBMIT
  // ============================================================

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    // ----------------------------------------------------------
    // VALIDATION
    // ----------------------------------------------------------

    if (!name.trim()) {
      setError("Name is required.");
      return;
    }

    if (!email.trim()) {
      setError("Email is required.");
      return;
    }

    if (!isEditMode && !password.trim()) {
      setError("Password is required.");
      return;
    }

    if (password && password.length < 6) {
      setError(
        "Password must be at least 6 characters."
      );
      return;
    }

    setLoading(true);

    try {
      let response;

      // ========================================================
      // UPDATE USER
      // PUT /api/users/{user_id}
      // ========================================================

      if (isEditMode && user) {
        const data: UpdateUserRequest = {
          name: name.trim(),
          email: email.trim(),
          is_active: isActive,
        };

        // Only send password when the admin/user entered one.
        if (password.trim()) {
          data.password = password;
        }

        if (roleId.trim()) {
          data.role_id = Number(roleId);
        }

        response = await updateUser(
          user.id,
          data
        );

        setSuccess(
          response?.message ||
            "User updated successfully."
        );
      }

      // ========================================================
      // CREATE USER
      // POST /api/users
      // ========================================================

      else {
        const data: CreateUserRequest = {
          name: name.trim(),
          email: email.trim(),
          password: password,
        };

        if (roleId.trim()) {
          data.role_id = Number(roleId);
        }

        response = await createUser(data);

        setSuccess(
          response?.message ||
            "User created successfully."
        );

        // Clear form after successful creation
        setName("");
        setEmail("");
        setPassword("");
        setRoleId("");
        setIsActive(true);
      }

      // ========================================================
      // CALLBACK
      // ========================================================

      if (onSuccess) {
        onSuccess(response);
      }
    } catch (err: any) {
      const message =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        err?.message ||
        (
          isEditMode
            ? "Failed to update user."
            : "Failed to create user."
        );

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // INPUT CLASS
  // ============================================================

  const inputClass =
    "w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-gray-50";

  // ============================================================
  // UI
  // ============================================================

  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
      {/* ========================================================
          HEADER
      ========================================================= */}

      <div className="border-b border-gray-200 px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100">
            <svg
              className="h-5 w-5 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isEditMode ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              )}
            </svg>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {isEditMode
                ? "Edit User"
                : "Create User"}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {isEditMode
                ? "Update user account information."
                : "Create a new user account."}
            </p>
          </div>
        </div>
      </div>

      {/* ========================================================
          FORM
      ========================================================= */}

      <form
        onSubmit={handleSubmit}
        className="space-y-5 p-6"
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
            NAME
        ======================================================= */}

        <div>
          <label
            htmlFor="user-name"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Full Name
            <span className="ml-1 text-red-500">
              *
            </span>
          </label>

          <input
            id="user-name"
            type="text"
            value={name}
            onChange={(event) =>
              setName(event.target.value)
            }
            placeholder="Enter full name"
            autoComplete="name"
            required
            disabled={loading}
            className={inputClass}
          />
        </div>

        {/* ======================================================
            EMAIL
        ======================================================= */}

        <div>
          <label
            htmlFor="user-email"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Email Address
            <span className="ml-1 text-red-500">
              *
            </span>
          </label>

          <input
            id="user-email"
            type="email"
            value={email}
            onChange={(event) =>
              setEmail(event.target.value)
            }
            placeholder="user@example.com"
            autoComplete="email"
            required
            disabled={loading}
            className={inputClass}
          />
        </div>

        {/* ======================================================
            PASSWORD
        ======================================================= */}

        <div>
          <label
            htmlFor="user-password"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Password
            {!isEditMode && (
              <span className="ml-1 text-red-500">
                *
              </span>
            )}
          </label>

          <input
            id="user-password"
            type="password"
            value={password}
            onChange={(event) =>
              setPassword(event.target.value)
            }
            placeholder={
              isEditMode
                ? "Leave blank to keep current password"
                : "Enter password"
            }
            autoComplete={
              isEditMode
                ? "new-password"
                : "new-password"
            }
            required={!isEditMode}
            disabled={loading}
            className={inputClass}
          />

          {isEditMode && (
            <p className="mt-1.5 text-xs text-gray-500">
              Leave this field empty if you do not want
              to change the password.
            </p>
          )}
        </div>

        {/* ======================================================
            ROLE ID
        ======================================================= */}

        <div>
          <label
            htmlFor="user-role"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Role ID
          </label>

          <input
            id="user-role"
            type="number"
            min="1"
            value={roleId}
            onChange={(event) =>
              setRoleId(event.target.value)
            }
            placeholder="Enter role ID"
            disabled={loading}
            className={inputClass}
          />

          <p className="mt-1.5 text-xs text-gray-500">
            Enter the role ID assigned to this user.
          </p>
        </div>

        {/* ======================================================
            STATUS
        ======================================================= */}

        {isEditMode && (
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-gray-800">
                  Account Status
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  Control whether this user can access
                  the system.
                </p>
              </div>

              <button
                type="button"
                role="switch"
                aria-checked={isActive}
                disabled={loading}
                onClick={() =>
                  setIsActive((current) => !current)
                }
                className={`relative inline-flex h-6 w-11 shrink-0 rounded-full transition ${
                  isActive
                    ? "bg-blue-600"
                    : "bg-gray-300"
                } disabled:cursor-not-allowed disabled:opacity-60`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition ${
                    isActive
                      ? "translate-x-5"
                      : "translate-x-0.5"
                  } mt-0.5`}
                />
              </button>
            </div>

            <div className="mt-3">
              {isActive ? (
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                  Active
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-gray-200 px-2.5 py-1 text-xs font-medium text-gray-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-gray-400" />
                  Inactive
                </span>
              )}
            </div>
          </div>
        )}

        {/* ======================================================
            BUTTONS
        ======================================================= */}

        <div className="flex flex-col-reverse gap-3 border-t border-gray-200 pt-5 sm:flex-row sm:justify-end">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="rounded-xl border border-gray-300 bg-white px-5 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-blue-400"
          >
            {loading ? (
              <>
                <svg
                  className="h-4 w-4 animate-spin"
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
                  ? "Update User"
                  : "Create User"}

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

export default UserForm;