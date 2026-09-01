import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  getUserById,
} from "../../api/userApi";

// ============================================================
// TYPES
// ============================================================

interface User {
  id: number;
  name: string;
  email: string;
  role_id?: number;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

interface UserDetailsResponse {
  success?: boolean;
  message?: string;
  user?: User;
  data?: User;
}

// ============================================================
// USER DETAILS
// ============================================================

const UserDetails: React.FC = () => {
  const { userId } = useParams<{
    userId: string;
  }>();

  const navigate = useNavigate();

  const [user, setUser] =
    useState<User | null>(null);

  const [loading, setLoading] =
    useState<boolean>(true);

  const [error, setError] =
    useState<string>("");

  // ==========================================================
  // GET USER DETAILS
  // ==========================================================

  const fetchUser = async () => {
    if (!userId) {
      setError("User ID is missing.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response =
        (await getUserById(
          Number(userId)
        )) as UserDetailsResponse | User;

      /*
       * Supports common backend response formats:
       *
       * 1. { user: {...} }
       * 2. { data: {...} }
       * 3. {...user fields...}
       */

      let userData: User | undefined;

      if (
        response &&
        typeof response === "object" &&
        "user" in response
      ) {
        userData = response.user;
      } else if (
        response &&
        typeof response === "object" &&
        "data" in response
      ) {
        userData = response.data;
      } else {
        userData =
          response as User;
      }

      if (!userData) {
        throw new Error(
          "User details were not found."
        );
      }

      setUser(userData);
    } catch (err: any) {
      const message =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        err?.message ||
        "Failed to retrieve user details.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================================
  // LOAD USER
  // ==========================================================

  useEffect(() => {
    fetchUser();
  }, [userId]);

  // ==========================================================
  // FORMAT DATE
  // ==========================================================

  const formatDate = (
    value?: string
  ): string => {
    if (!value) {
      return "N/A";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return date.toLocaleString();
  };

  // ==========================================================
  // BACK
  // ==========================================================

  const handleBack = () => {
    navigate("/users");
  };

  // ==========================================================
  // EDIT
  // ==========================================================

  const handleEdit = () => {
    if (!user) {
      return;
    }

    navigate(
      `/users/${user.id}/edit`
    );
  };

  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {
    return (
      <div className="space-y-6">

        {/* Header */}

        <div className="flex items-center gap-3">
          <div className="h-10 w-10 animate-pulse rounded-xl bg-gray-200" />

          <div>
            <div className="h-6 w-40 animate-pulse rounded bg-gray-200" />

            <div className="mt-2 h-4 w-64 animate-pulse rounded bg-gray-200" />
          </div>
        </div>

        {/* Content */}

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

          <div className="space-y-6">

            {[1, 2, 3, 4].map(
              (item) => (
                <div
                  key={item}
                  className="h-16 animate-pulse rounded-xl bg-gray-100"
                />
              )
            )}

          </div>

        </div>

      </div>
    );
  }

  // ==========================================================
  // ERROR
  // ==========================================================

  if (error || !user) {
    return (
      <div className="space-y-6">

        {/* Header */}

        <div className="flex items-center gap-3">

          <button
            type="button"
            onClick={handleBack}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 shadow-sm transition hover:bg-gray-50"
          >
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
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              User Details
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              View user information
            </p>
          </div>

        </div>

        {/* Error */}

        <div className="rounded-2xl border border-red-200 bg-red-50 p-6">

          <div className="flex items-start gap-3">

            <svg
              className="mt-0.5 h-6 w-6 shrink-0 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01M10.29 3.86l-7.5 13A2 2 0 003.66 18h16.68a2 2 0 001.73-3l-7.5-13a2 2 0 00-3.48 0z"
              />
            </svg>

            <div>
              <h2 className="text-sm font-semibold text-red-800">
                Unable to load user
              </h2>

              <p className="mt-1 text-sm text-red-700">
                {error ||
                  "User details were not found."}
              </p>
            </div>

          </div>

          <button
            type="button"
            onClick={handleBack}
            className="mt-4 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
          >
            Back to Users
          </button>

        </div>

      </div>
    );
  }

  // ==========================================================
  // UI
  // ==========================================================

  return (
    <div className="space-y-6">

      {/* ====================================================
          PAGE HEADER
      ===================================================== */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div className="flex items-center gap-3">

          <button
            type="button"
            onClick={handleBack}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 shadow-sm transition hover:bg-gray-50 hover:text-gray-900"
            title="Back to Users"
          >
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
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <div>

            <h1 className="text-2xl font-bold text-gray-900">
              User Details
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              View complete information about this user.
            </p>

          </div>

        </div>

        <button
          type="button"
          onClick={handleEdit}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100"
        >
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
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.5-9.5a2.121 2.121 0 013 3L12 16l-4 1 1-4 8.5-8.5z"
            />
          </svg>

          Edit User
        </button>

      </div>

      {/* ====================================================
          USER PROFILE CARD
      ===================================================== */}

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">

          {/* Avatar */}

          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-2xl font-bold text-blue-700">
            {user.name
              ? user.name
                  .charAt(0)
                  .toUpperCase()
              : "U"}
          </div>

          {/* User Info */}

          <div className="min-w-0 flex-1">

            <div className="flex flex-wrap items-center gap-3">

              <h2 className="text-xl font-bold text-gray-900">
                {user.name}
              </h2>

              {user.is_active !== undefined && (
                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                    user.is_active
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {user.is_active
                    ? "Active"
                    : "Inactive"}
                </span>
              )}

            </div>

            <p className="mt-1 text-sm text-gray-500">
              {user.email}
            </p>

          </div>

        </div>

      </div>

      {/* ====================================================
          USER INFORMATION
      ===================================================== */}

      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">

        {/* Section Header */}

        <div className="border-b border-gray-200 px-6 py-5">

          <h2 className="text-lg font-bold text-gray-900">
            User Information
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Account and access information.
          </p>

        </div>

        {/* Details */}

        <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2">

          {/* User ID */}

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              User ID
            </p>

            <p className="mt-2 text-sm font-medium text-gray-900">
              #{user.id}
            </p>
          </div>

          {/* Name */}

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              Name
            </p>

            <p className="mt-2 text-sm font-medium text-gray-900">
              {user.name || "N/A"}
            </p>
          </div>

          {/* Email */}

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              Email Address
            </p>

            <p className="mt-2 break-all text-sm font-medium text-gray-900">
              {user.email || "N/A"}
            </p>
          </div>

          {/* Role */}

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              Role ID
            </p>

            <p className="mt-2 text-sm font-medium text-gray-900">
              {user.role_id !== undefined
                ? user.role_id
                : "N/A"}
            </p>
          </div>

          {/* Status */}

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              Status
            </p>

            <div className="mt-2">

              {user.is_active !== undefined ? (
                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                    user.is_active
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {user.is_active
                    ? "Active"
                    : "Inactive"}
                </span>
              ) : (
                <span className="text-sm text-gray-500">
                  N/A
                </span>
              )}

            </div>
          </div>

          {/* Created At */}

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              Created At
            </p>

            <p className="mt-2 text-sm font-medium text-gray-900">
              {formatDate(
                user.created_at
              )}
            </p>
          </div>

          {/* Updated At */}

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              Updated At
            </p>

            <p className="mt-2 text-sm font-medium text-gray-900">
              {formatDate(
                user.updated_at
              )}
            </p>
          </div>

        </div>

      </div>

      {/* ====================================================
          ACTIONS
      ===================================================== */}

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">

        <button
          type="button"
          onClick={handleBack}
          className="rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
        >
          Back to Users
        </button>

        <button
          type="button"
          onClick={handleEdit}
          className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          Edit User
        </button>

      </div>

    </div>
  );
};

export default UserDetails;