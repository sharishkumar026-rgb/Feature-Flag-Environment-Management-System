import React from "react";

// ============================================================
// TYPES
// ============================================================

interface RolloutStatsProps {
  percentage?: number;
  enabledUsers?: number;
  disabledUsers?: number;
}

// ============================================================
// COMPONENT
// ============================================================

const RolloutStats: React.FC<RolloutStatsProps> = ({
  percentage = 0,
  enabledUsers = 0,
  disabledUsers = 0,
}) => {
  const stats = [
    {
      title: "Rollout Percentage",
      value: `${percentage}%`,
      description: "Current rollout percentage",
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
            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
          />
        </svg>
      ),
      iconClass: "bg-purple-50 text-purple-600",
    },

    {
      title: "Enabled Users",
      value: enabledUsers,
      description: "Users receiving the feature",
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
            d="M17 20h5v-2a4 4 0 00-4-4h-1M9 20H4v-2a4 4 0 014-4h1m4-6a4 4 0 11-8 0 4 4 0 018 0zm6 2a3 3 0 10-6 0 3 3 0 006 0z"
          />
        </svg>
      ),
      iconClass: "bg-green-50 text-green-600",
    },

    {
      title: "Disabled Users",
      value: disabledUsers,
      description: "Users not receiving the feature",
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
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      ),
      iconClass: "bg-red-50 text-red-600",
    },

    {
      title: "Total Users",
      value: enabledUsers + disabledUsers,
      description: "Users included in rollout",
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
            d="M12 4a4 4 0 100 8 4 4 0 000-8zM4 20a8 8 0 0116 0"
          />
        </svg>
      ),
      iconClass: "bg-blue-50 text-blue-600",
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
          <div className="flex items-start justify-between">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-gray-500">
                {stat.title}
              </p>

              <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
                {stat.value}
              </p>

              <p className="mt-1 text-xs text-gray-500">
                {stat.description}
              </p>
            </div>

            <div
              className={`ml-4 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${stat.iconClass}`}
            >
              {stat.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RolloutStats;