import React, { useEffect, useState } from "react";
import { getUserById } from "../../api/userApi";

interface UserDetailsProps {
  userId: number;
  onBack?: () => void;
  onEdit?: (user: UserDetailsData) => void;
}

interface UserDetailsData {
  id: number;
  name: string;
  email: string;
  role_id?: number;
  role?: {
    id?: number;
    name?: string;
  };
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

interface ApiResponse {
  data?: UserDetailsData;
  user?: UserDetailsData;
  message?: string;
}

const UserDetails: React.FC<UserDetailsProps> = ({
  userId,
  onBack,
  onEdit,
}) => {
  const [user, setUser] =
    useState<UserDetailsData | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ============================================================
  // FETCH USER
  // ============================================================

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          (await getUserById(userId)) as
            | UserDetailsData
            | ApiResponse;

        // Handle different possible backend response formats
        if (
          "data" in response &&
          response.data
        ) {
          setUser(response.data);
        } else if (
          "user" in response &&
          response.user
        ) {
          setUser(response.user);
        } else {
          setUser(response as UserDetailsData);
        }
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

    fetchUser();
  }, [userId]);

  // ============================================================
  // FORMAT DATE
  // ============================================================

  const formatDate = (date?: string) => {
    if (!date) {
      return "-";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "-";
    }

    return parsedDate.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // ============================================================
  // ROLE
  // ============================================================

  const getRoleName = () => {
    if (!user) {
      return "-";
    }

    if (user.role?.name) {
      return user.role.name;
    }

    if (user.role_id) {
      return `Role ${user.role_id}`;
    }

    return "User";
  };

  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="flex min-h-[300px] items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <svg
              className="h-8 w-8 animate-spin text-blue-600"
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

            <p className="text-sm text-gray-500">
              Loading user details...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================
  // ERROR
  // ============================================================

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-100">
            <svg
              className="h-5 w-5 text-red-600"
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
          </div>

          <div>
            <h3 className="font-semibold text-red-800">
              Unable to load user
            </h3>

            <p className="mt-1 text-sm text-red-700">
              {error}
            </p>
          </div>
        </div>

        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="mt-5 rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            Back to Users
          </button>
        )}
      </div>
    );
  }

  // ============================================================
  // USER NOT FOUND
  // ============================================================

  if (!user) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900">
          User not found
        </h3>

        <p className="mt-2 text-sm text-gray-500">
          The requested user could not be found.
        </p>

        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="mt-5 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Back to Users
          </button>
        )}
      </div>
    );
  }

  // ============================================================
  // USER DETAILS
  // ============================================================

  return (
    <div className="space-y-6">
      {/* ========================================================
          HEADER
      ========================================================= */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              title="Back"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 transition hover:bg-gray-50 hover:text-gray-700"
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
          )}

          <div>
            <h1 className="text-xl font-bold text-gray-900">
              User Details
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              View complete information about this user.
            </p>
          </div>
        </div>

        {onEdit && (
          <button
            type="button"
            onClick={() => onEdit(user)}
            className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
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
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"
              />
            </svg>

            Edit User
          </button>
        )}
      </div>

      {/* ========================================================
          PROFILE CARD
      ========================================================= */}

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="bg-blue-600 px-6 py-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            {/* Avatar */}

            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-white text-2xl font-bold text-blue-600 shadow-sm">
              {user.name
                ?.charAt(0)
                ?.toUpperCase() || "U"}
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white">
                {user.name || "-"}
              </h2>

              <p className="mt-1 text-sm text-blue-100">
                {user.email || "-"}
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="rounded-lg bg-white/15 px-3 py-1 text-xs font-medium text-white">
                  {getRoleName()}
                </span>

                {user.is_active ? (
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-green-500/20 px-3 py-1 text-xs font-medium text-green-100">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-300" />
                    Active
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-white/15 px-3 py-1 text-xs font-medium text-blue-100">
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-200" />
                    Inactive
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================
            INFORMATION
        ======================================================= */}

        <div className="p-6">
          <h3 className="text-base font-semibold text-gray-900">
            Account Information
          </h3>

          <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
            {/* User ID */}

            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                User ID
              </p>

              <p className="mt-2 text-sm font-semibold text-gray-900">
                #{user.id}
              </p>
            </div>

            {/* Name */}

            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                Full Name
              </p>

              <p className="mt-2 text-sm font-semibold text-gray-900">
                {user.name || "-"}
              </p>
            </div>

            {/* Email */}

            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                Email Address
              </p>

              <p className="mt-2 break-all text-sm font-semibold text-gray-900">
                {user.email || "-"}
              </p>
            </div>

            {/* Role */}

            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                Role
              </p>

              <div className="mt-2">
                <span className="inline-flex rounded-lg bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700">
                  {getRoleName()}
                </span>
              </div>
            </div>

            {/* Role ID */}

            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                Role ID
              </p>

              <p className="mt-2 text-sm font-semibold text-gray-900">
                {user.role_id ?? "-"}
              </p>
            </div>

            {/* Status */}

            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                Account Status
              </p>

              <div className="mt-2">
                {user.is_active ? (
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                    Active
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-gray-200 px-3 py-1 text-xs font-semibold text-gray-600">
                    <span className="h-1.5 w-1.5 rounded-full bg-gray-400" />
                    Inactive
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          TIMESTAMPS
      ========================================================= */}

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="text-base font-semibold text-gray-900">
          Activity Information
        </h3>

        <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
          {/* Created */}

          <div className="flex items-start gap-3 rounded-xl border border-gray-200 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100">
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
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                Created At
              </p>

              <p className="mt-1 text-sm font-medium text-gray-900">
                {formatDate(user.created_at)}
              </p>
            </div>
          </div>

          {/* Updated */}

          <div className="flex items-start gap-3 rounded-xl border border-gray-200 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-100">
              <svg
                className="h-5 w-5 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                Updated At
              </p>

              <p className="mt-1 text-sm font-medium text-gray-900">
                {formatDate(user.updated_at)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;