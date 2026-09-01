import React, { useState } from "react";
import { register } from "../../api/authApi";

// ============================================================
// TYPES
// ============================================================

interface RegisterResponse {
  success?: boolean;
  message?: string;

  user?: {
    id?: number;
    name?: string;
    email?: string;
    role_id?: number;
    role?: string;
    is_active?: boolean;
    created_at?: string;
    updated_at?: string;
  };
}

// ============================================================
// CONFIGURATION
// ============================================================

// IMPORTANT:
// Change this only if your database uses a different ID
// for the normal User role.
//
// Example:
// Admin = 1
// User  = 2
//
// Admin registration is NOT allowed from this form.
const USER_ROLE_ID = 2;

// ============================================================
// COMPONENT
// ============================================================

const RegisterForm: React.FC = () => {
  // ==========================================================
  // STATE
  // ==========================================================

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ==========================================================
  // REGISTER
  // ==========================================================

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();

    setError("");
    setSuccess("");

    // --------------------------------------------------------
    // NAME VALIDATION
    // --------------------------------------------------------

    const trimmedName = name.trim();

    if (!trimmedName) {
      setError("Please enter your full name.");
      return;
    }

    if (trimmedName.length < 2) {
      setError("Name must contain at least 2 characters.");
      return;
    }

    // --------------------------------------------------------
    // EMAIL VALIDATION
    // --------------------------------------------------------

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setError("Please enter your email address.");
      return;
    }

    // --------------------------------------------------------
    // PASSWORD VALIDATION
    // --------------------------------------------------------

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // --------------------------------------------------------
    // ROLE VALIDATION
    // --------------------------------------------------------

    if (!USER_ROLE_ID) {
      setError("User role is not configured.");
      return;
    }

    setLoading(true);

    try {
      // ======================================================
      // REGISTER USER
      // ======================================================

      const response = (await register({
        name: trimmedName,
        email: trimmedEmail,
        password: password,

        // Always use normal USER role.
        // Admin cannot be selected from public registration.
        role_id: USER_ROLE_ID,

        // New users are active.
        is_active: true,
      })) as RegisterResponse;

      // ======================================================
      // SUCCESS
      // ======================================================

      setSuccess(
        response?.message ||
          "Registration successful. You can now sign in."
      );

      // ======================================================
      // CLEAR FORM
      // ======================================================

      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      console.error("Registration failed:", err);

      const detail = err?.response?.data?.detail;

      let errorMessage =
        "Registration failed. Please try again.";

      if (Array.isArray(detail)) {
        errorMessage = detail
          .map((item: any) => {
            if (typeof item === "string") {
              return item;
            }

            return item?.msg || "Invalid input.";
          })
          .join(", ");
      } else if (typeof detail === "string") {
        errorMessage = detail;
      } else if (
        typeof err?.response?.data?.message === "string"
      ) {
        errorMessage = err.response.data.message;
      } else if (typeof err?.message === "string") {
        errorMessage = err.message;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================================
  // UI
  // ==========================================================

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      {/* ======================================================
          ERROR MESSAGE
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
              d="M12 9v2m0 4h.01M10.29 3.86l-7.5 13A2 2 0 004.03 20h15.94a2 2 0 001.74-3l-7.5-13a2 2 0 00-3.42 0z"
            />
          </svg>

          <p className="text-sm leading-5 text-red-700">
            {error}
          </p>
        </div>
      )}

      {/* ======================================================
          SUCCESS MESSAGE
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

          <p className="text-sm leading-5 text-green-700">
            {success}
          </p>
        </div>
      )}

      {/* ======================================================
          FULL NAME
      ======================================================= */}

      <div>
        <label
          htmlFor="register-name"
          className="mb-1.5 block text-sm font-semibold text-gray-700"
        >
          Full Name
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
                d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zm11 10v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"
              />
            </svg>
          </div>

          <input
            id="register-name"
            type="text"
            value={name}
            onChange={(event) =>
              setName(event.target.value)
            }
            placeholder="Enter your full name"
            autoComplete="name"
            required
            disabled={loading}
            className="w-full rounded-xl border border-gray-300 bg-white py-3.5 pl-12 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-gray-50"
          />
        </div>
      </div>

      {/* ======================================================
          EMAIL
      ======================================================= */}

      <div>
        <label
          htmlFor="register-email"
          className="mb-1.5 block text-sm font-semibold text-gray-700"
        >
          Email Address
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
                d="M3 8l9 6 9-6M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>

          <input
            id="register-email"
            type="email"
            value={email}
            onChange={(event) =>
              setEmail(event.target.value)
            }
            placeholder="you@example.com"
            autoComplete="email"
            required
            disabled={loading}
            className="w-full rounded-xl border border-gray-300 bg-white py-3.5 pl-12 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-gray-50"
          />
        </div>
      </div>

      {/* ======================================================
          PASSWORD
      ======================================================= */}

      <div>
        <label
          htmlFor="register-password"
          className="mb-1.5 block text-sm font-semibold text-gray-700"
        >
          Password
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
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>

          <input
            id="register-password"
            type="password"
            value={password}
            onChange={(event) =>
              setPassword(event.target.value)
            }
            placeholder="Create a password"
            autoComplete="new-password"
            required
            disabled={loading}
            className="w-full rounded-xl border border-gray-300 bg-white py-3.5 pl-12 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-gray-50"
          />
        </div>
      </div>

      {/* ======================================================
          CONFIRM PASSWORD
      ======================================================= */}

      <div>
        <label
          htmlFor="register-confirm-password"
          className="mb-1.5 block text-sm font-semibold text-gray-700"
        >
          Confirm Password
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
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002-2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>

          <input
            id="register-confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(event) =>
              setConfirmPassword(event.target.value)
            }
            placeholder="Confirm your password"
            autoComplete="new-password"
            required
            disabled={loading}
            className="w-full rounded-xl border border-gray-300 bg-white py-3.5 pl-12 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-gray-50"
          />
        </div>
      </div>

      {/* ======================================================
          TERMS
      ======================================================= */}

      <div className="flex items-start gap-2">
        <input
          id="register-terms"
          type="checkbox"
          required
          disabled={loading}
          className="mt-0.5 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />

        <label
          htmlFor="register-terms"
          className="text-xs leading-5 text-gray-500"
        >
          I agree to the terms and conditions.
        </label>
      </div>

      {/* ======================================================
          BUTTON
      ======================================================= */}

      <button
        type="submit"
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-blue-400"
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

            Creating Account...
          </>
        ) : (
          <>
            Create Account

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
    </form>
  );
};

export default RegisterForm;