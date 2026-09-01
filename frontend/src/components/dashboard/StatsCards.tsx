import React from "react";

// ============================================================
// TYPES
// ============================================================

interface StatsCardsProps {
  totalFeatures?: number;
  enabledFeatures?: number;
  disabledFeatures?: number;
  totalEnvironments?: number;
  totalRollouts?: number;
  totalAssignments?: number;
  activeUsers?: number;
}

// ============================================================
// COMPONENT
// ============================================================

const StatsCards: React.FC<StatsCardsProps> = ({
  totalFeatures = 0,
  enabledFeatures = 0,
  disabledFeatures = 0,
  totalEnvironments = 0,
  totalRollouts = 0,
  totalAssignments = 0,
  activeUsers = 0,
}) => {
  // ============================================================
  // STATISTICS
  // ============================================================

  const stats = [
    {
      title: "Total Features",
      value: totalFeatures,
      description: "Total feature flags",
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
      title: "Enabled Features",
      value: enabledFeatures,
      description: "Currently enabled",
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
      title: "Disabled Features",
      value: disabledFeatures,
      description: "Currently disabled",
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
      title: "Environments",
      value: totalEnvironments,
      description: "Total environments",
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
            d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-4h6v4"
          />
        </svg>
      ),
      iconClass: "bg-orange-50 text-orange-600",
    },

    {
      title: "Rollouts",
      value: totalRollouts,
      description: "Total feature rollouts",
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
      title: "Assignments",
      value: totalAssignments,
      description: "Total user assignments",
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
      iconClass: "bg-indigo-50 text-indigo-600",
    },

    {
      title: "Active Users",
      value: activeUsers,
      description: "Currently active users",
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
            d="M17 20h5v-2a4 4 0 00-4-4h-1M9 20H4v-2a4 4 0 014-4h1m4-8a4 4 0 11-8 0 4 4 0 018 0zm6 4a3 3 0 10-6 0"
          />
        </svg>
      ),
      iconClass: "bg-cyan-50 text-cyan-600",
    },
  ];

  // ============================================================
  // UI
  // ============================================================

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

      {stats.map((stat) => (
        <div
          key={stat.title}
          className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
        >
          <div className="flex items-start justify-between">

            {/* CONTENT */}

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

            {/* ICON */}

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

export default StatsCards;