import React from "react";

// ============================================================
// TYPES
// ============================================================

interface AssignmentStatsProps {
  isEnabled?: boolean;
  featureName?: string;
  userName?: string;
  userEmail?: string;
}

// ============================================================
// COMPONENT
// ============================================================

const AssignmentStats: React.FC<AssignmentStatsProps> = ({
  isEnabled = false,
  featureName = "",
  userName = "",
  userEmail = "",
}) => {
  const stats = [
    {
      title: "Assignment Status",
      value: isEnabled ? "Enabled" : "Disabled",
      description: isEnabled
        ? "Feature is enabled for this user"
        : "Feature is disabled for this user",
      icon: isEnabled ? (
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
            d="M5 13l4 4L19 7"
          />
        </svg>
      ) : (
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
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      ),
      iconClass: isEnabled
        ? "bg-green-50 text-green-600"
        : "bg-red-50 text-red-600",
    },

    {
      title: "Feature",
      value: featureName || "N/A",
      description: "Feature assigned to the user",
      icon: (
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
            d="M12 3v18m9-9H3"
          />
        </svg>
      ),
      iconClass: "bg-blue-50 text-blue-600",
    },

    {
      title: "User",
      value: userName || "N/A",
      description: "User receiving this assignment",
      icon: (
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
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM4 21a8 8 0 0116 0"
          />
        </svg>
      ),
      iconClass: "bg-purple-50 text-purple-600",
    },

    {
      title: "Email",
      value: userEmail || "N/A",
      description: "User email address",
      icon: (
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
            d="M3 8l9 6 9-6M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      ),
      iconClass: "bg-orange-50 text-orange-600",
    },
  ];

  // ============================================================
  // UI
  // ============================================================

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.title}
          className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-500">
                {stat.title}
              </p>

              <p
                className="mt-2 truncate text-2xl font-bold tracking-tight text-gray-900"
                title={String(stat.value)}
              >
                {stat.value}
              </p>

              <p className="mt-1 text-xs text-gray-500">
                {stat.description}
              </p>
            </div>

            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${stat.iconClass}`}
            >
              {stat.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AssignmentStats;