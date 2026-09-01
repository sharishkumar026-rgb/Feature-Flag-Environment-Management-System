import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

interface OverviewChartsProps {
  featureFlagData?: Array<{
    name: string;
    enabled: number;
    disabled: number;
  }>;

  rolloutData?: Array<{
    name: string;
    percentage: number;
  }>;

  activityData?: Array<{
    date: string;
    activity: number;
  }>;

  environmentData?: Array<{
    name: string;
    value: number;
  }>;
}

const defaultFeatureFlagData = [
  {
    name: "Feature Flags",
    enabled: 0,
    disabled: 0,
  },
];

const defaultRolloutData = [
  {
    name: "No Data",
    percentage: 0,
  },
];

const defaultActivityData = [
  {
    date: "Today",
    activity: 0,
  },
];

const defaultEnvironmentData = [
  {
    name: "No Data",
    value: 1,
  },
];

const OverviewCharts: React.FC<OverviewChartsProps> = ({
  featureFlagData = defaultFeatureFlagData,
  rolloutData = defaultRolloutData,
  activityData = defaultActivityData,
  environmentData = defaultEnvironmentData,
}) => {
  // ============================================================
  // PIE LABEL
  // ============================================================

  const renderPieLabel = ({
    name,
    percent,
  }: {
    name?: string;
    percent?: number;
  }) => {
    if (!percent || percent <= 0) {
      return "";
    }

    return `${name || ""} ${(percent * 100).toFixed(0)}%`;
  };

  // ============================================================
  // ENVIRONMENT DATA CHECK
  // ============================================================

  const hasEnvironmentData =
    environmentData.length > 0 &&
    environmentData.some((item) => item.value > 0);

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="space-y-6">

      {/* ======================================================
          ROW 1
      ======================================================= */}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">

        {/* ====================================================
            FEATURE FLAGS
        ===================================================== */}

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

          <div className="mb-6 flex items-center justify-between">

            <div>
              <h3 className="text-lg font-bold text-gray-900">
                Feature Flags
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Enabled vs disabled feature flags
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">

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
                  d="M12 3v18m9-9H3"
                />
              </svg>

            </div>

          </div>

          <div className="h-[300px] w-full">

            <ResponsiveContainer width="100%" height="100%">

              <BarChart
                data={featureFlagData}
                margin={{
                  top: 10,
                  right: 10,
                  left: 0,
                  bottom: 10,
                }}
              >

                <CartesianGrid strokeDasharray="3 3" />

                <XAxis
                  dataKey="name"
                  tick={{
                    fontSize: 12,
                  }}
                />

                <YAxis
                  allowDecimals={false}
                  tick={{
                    fontSize: 12,
                  }}
                />

                <Tooltip />

                <Legend />

                <Bar
                  dataKey="enabled"
                  name="Enabled"
                  radius={[6, 6, 0, 0]}
                />

                <Bar
                  dataKey="disabled"
                  name="Disabled"
                  radius={[6, 6, 0, 0]}
                />

              </BarChart>

            </ResponsiveContainer>

          </div>

        </div>

        {/* ====================================================
            ROLLOUT
        ===================================================== */}

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

          <div className="mb-6 flex items-center justify-between">

            <div>
              <h3 className="text-lg font-bold text-gray-900">
                Rollout Progress
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Feature rollout percentage by feature
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50">

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
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>

            </div>

          </div>

          <div className="h-[300px] w-full">

            <ResponsiveContainer width="100%" height="100%">

              <BarChart
                data={rolloutData}
                layout="vertical"
                margin={{
                  top: 10,
                  right: 20,
                  left: 20,
                  bottom: 10,
                }}
              >

                <CartesianGrid strokeDasharray="3 3" />

                <XAxis
                  type="number"
                  domain={[0, 100]}
                  unit="%"
                />

                <YAxis
                  type="category"
                  dataKey="name"
                  width={100}
                  tick={{
                    fontSize: 12,
                  }}
                />

                <Tooltip
                  formatter={(value) => [
                    `${value}%`,
                    "Rollout",
                  ]}
                />

                <Bar
                  dataKey="percentage"
                  name="Rollout"
                  radius={[0, 8, 8, 0]}
                />

              </BarChart>

            </ResponsiveContainer>

          </div>

        </div>

      </div>

      {/* ======================================================
          ROW 2
      ======================================================= */}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">

        {/* ====================================================
            ACTIVITY
        ===================================================== */}

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

          <div className="mb-6 flex items-center justify-between">

            <div>
              <h3 className="text-lg font-bold text-gray-900">
                Activity Overview
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Audit activity over time
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50">

              <svg
                className="h-5 w-5 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12h4l3-9 4 18 3-9h4"
                />
              </svg>

            </div>

          </div>

          <div className="h-[300px] w-full">

            <ResponsiveContainer width="100%" height="100%">

              <LineChart
                data={activityData}
                margin={{
                  top: 10,
                  right: 10,
                  left: 0,
                  bottom: 10,
                }}
              >

                <CartesianGrid strokeDasharray="3 3" />

                <XAxis
                  dataKey="date"
                  tick={{
                    fontSize: 12,
                  }}
                />

                <YAxis
                  allowDecimals={false}
                  tick={{
                    fontSize: 12,
                  }}
                />

                <Tooltip />

                <Legend />

                <Line
                  type="monotone"
                  dataKey="activity"
                  name="Activity"
                  strokeWidth={3}
                  dot={{
                    r: 4,
                  }}
                  activeDot={{
                    r: 6,
                  }}
                />

              </LineChart>

            </ResponsiveContainer>

          </div>

        </div>

        {/* ====================================================
            ENVIRONMENTS
        ===================================================== */}

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

          <div className="mb-6 flex items-center justify-between">

            <div>
              <h3 className="text-lg font-bold text-gray-900">
                Environments
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Feature distribution across environments
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50">

              <svg
                className="h-5 w-5 text-orange-600"
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

            </div>

          </div>

          <div className="h-[300px] w-full">

            {hasEnvironmentData ? (
              <ResponsiveContainer width="100%" height="100%">

                <PieChart>

                  <Pie
                    data={environmentData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={95}
                    innerRadius={55}
                    paddingAngle={3}
                    label={renderPieLabel}
                    labelLine
                  >

                    {environmentData.map((_, index) => (
                      <Cell
                        key={`environment-${index}`}
                      />
                    ))}

                  </Pie>

                  <Tooltip />

                  <Legend />

                </PieChart>

              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center">

                <div className="text-center">

                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100">

                    <svg
                      className="h-6 w-6 text-gray-400"
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

                  </div>

                  <p className="mt-3 text-sm font-medium text-gray-600">
                    No environment data
                  </p>

                </div>

              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
};

export default OverviewCharts;