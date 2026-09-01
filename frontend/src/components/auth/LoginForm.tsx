import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { login } from "../../api/authApi";

// ============================================================
// TYPES
// ============================================================

interface LoginResponse {
  success?: boolean;
  message?: string;
  access_token?: string;
  token_type?: string;

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
// COMPONENT
// ============================================================

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // ==========================================================
  // STATE
  // ==========================================================

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [rememberMe, setRememberMe] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ==========================================================
  // LOGIN
  // ==========================================================

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();

    setError("");
    setSuccess("");

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

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    setLoading(true);

    try {
      // ======================================================
      // CALL LOGIN API
      //
      // Backend expects:
      // {
      //   email: "...",
      //   password: "..."
      // }
      // ======================================================

      const response = (await login({
        email: trimmedEmail,
        password,
      })) as LoginResponse;

      // ======================================================
      // GET ACCESS TOKEN
      // ======================================================

      const token = response?.access_token;

      if (!token) {
        throw new Error(
          "Login successful, but access token was not received."
        );
      }

      // ======================================================
      // STORE ACCESS TOKEN
      // ======================================================

      if (rememberMe) {
        localStorage.setItem("access_token", token);
      } else {
        sessionStorage.setItem("access_token", token);

        // Remove any previous persistent token
        localStorage.removeItem("access_token");
      }

      // ======================================================
      // STORE USER
      // ======================================================

      if (response?.user) {
        const userData = JSON.stringify(response.user);

        if (rememberMe) {
          localStorage.setItem("user", userData);
          sessionStorage.removeItem("user");
        } else {
          sessionStorage.setItem("user", userData);
          localStorage.removeItem("user");
        }
      }

      // ======================================================
      // SUCCESS MESSAGE
      // ======================================================

      setSuccess(
        response?.message || "Login successful."
      );

      // ======================================================
      // REDIRECT
      // ======================================================

      const state = location.state as
        | {
            from?: {
              pathname?: string;
            };
          }
        | null;

      const redirectPath =
        state?.from?.pathname || "/dashboard";

      // Small delay so success state can be shown
      setTimeout(() => {
        navigate(redirectPath, {
          replace: true,
        });
      }, 300);
    } catch (err: any) {
      console.error("Login failed:", err);

      const detail = err?.response?.data?.detail;

      let message = "Invalid email or password.";

      // FastAPI validation error
      if (Array.isArray(detail)) {
        message = detail
          .map((item: any) => {
            if (typeof item === "string") {
              return item;
            }

            return item?.msg || "Invalid input.";
          })
          .join(", ");
      }

      // FastAPI normal error
      else if (typeof detail === "string") {
        message = detail;
      }

      // Custom backend message
      else if (
        typeof err?.response?.data?.message === "string"
      ) {
        message = err.response.data.message;
      }

      // Axios error
      else if (err?.message) {
        message = err.message;
      }

      setError(message);
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
      {/* ====================================================
          ERROR MESSAGE
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
              d="M12 9v2m0 4h.01M10.29 3.86l-7.5 13A2 2 0 004.03 20h15.94a2 2 0 001.74-3l-7.5-13a2 2 0 00-3.42 0z"
            />
          </svg>

          <p className="text-sm leading-5 text-red-700">
            {messageFix(error)}
          </p>
        </div>
      )}

      {/* ====================================================
          SUCCESS MESSAGE
      ===================================================== */}

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

      {/* ====================================================
          EMAIL
      ===================================================== */}

      <div>
        <label
          htmlFor="login-email"
          className="mb-2 block text-sm font-semibold text-gray-700"
        >
          Email Address
        </label>

        <div className="relative">
          {/* Email Icon */}

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
            id="login-email"
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

      {/* ====================================================
          PASSWORD
      ===================================================== */}

      <div>
        <div className="mb-2 flex items-center justify-between">
          <label
            htmlFor="login-password"
            className="block text-sm font-semibold text-gray-700"
          >
            Password
          </label>

          <button
            type="button"
            onClick={() => {
              // Add forgot password navigation later
              console.log("Forgot password clicked");
            }}
            className="text-xs font-semibold text-blue-600 transition hover:text-blue-700"
          >
            Forgot password?
          </button>
        </div>

        <div className="relative">
          {/* Password Icon */}

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
            id="login-password"
            type="password"
            value={password}
            onChange={(event) =>
              setPassword(event.target.value)
            }
            placeholder="Enter your password"
            autoComplete="current-password"
            required
            disabled={loading}
            className="w-full rounded-xl border border-gray-300 bg-white py-3.5 pl-12 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-gray-50"
          />
        </div>
      </div>

      {/* ====================================================
          REMEMBER ME
      ===================================================== */}

      <div className="flex items-center">
        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(event) =>
              setRememberMe(event.target.checked)
            }
            disabled={loading}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />

          <span className="text-sm text-gray-600">
            Remember me
          </span>
        </label>
      </div>

      {/* ====================================================
          LOGIN BUTTON
      ===================================================== */}

      <button
        type="submit"
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-blue-400"
      >
        {loading ? (
          <>
            {/* Spinner */}

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

            Signing in...
          </>
        ) : (
          <>
            Sign In

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

// ============================================================
// ERROR MESSAGE HELPER
// ============================================================

const messageFix = (message: string): string => {
  if (!message) {
    return "Invalid email or password.";
  }

  return message;
};

export default LoginForm;