import React from "react";

// ============================================================
// TYPES
// ============================================================

interface FeatureStatsProps {
  totalAssignments?: number;
  enabledAssignments?: number;
  disabledAssignments?: number;
  totalRollouts?: number;
}

// ============================================================
// COMPONENT
// ============================================================

const FeatureStats: React.FC<FeatureStatsProps> = ({
  totalAssignments = 0,
  enabledAssignments = 0,
  disabledAssignments = 0,
  totalRollouts = 0,
}) => {
  const stats = [
    {
      title: "Total Assignments",
      value: totalAssignments,
      description: "Users assigned to this feature",
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
      iconClass: "bg-blue-50 text-blue-600",
    },

    {
      title: "Enabled Assignments",
      value: enabledAssignments,
      description: "Assignments currently enabled",
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
            d="M5 13l4 4L19 7"
          />
        </svg>
      ),
      iconClass: "bg-green-50 text-green-600",
    },

    {
      title: "Disabled Assignments",
      value: disabledAssignments,
      description: "Assignments currently disabled",
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
      title: "Total Rollouts",
      value: totalRollouts,
      description: "Rollouts configured for this feature",
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

export default FeatureStats;