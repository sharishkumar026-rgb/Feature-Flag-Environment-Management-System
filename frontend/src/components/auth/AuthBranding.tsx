import React from "react";

interface FeatureItemProps {
  title: string;
  description: string;
}

const FeatureItem: React.FC<FeatureItemProps> = ({
  title,
  description,
}) => {
  return (
    <div className="flex items-start gap-4">
      {/* Icon */}
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/15">
        <svg
          className="h-5 w-5 text-white"
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
      </div>

      {/* Content */}
      <div>
        <h3 className="text-sm font-semibold text-white">
          {title}
        </h3>

        <p className="mt-1 text-xs leading-5 text-blue-100">
          {description}
        </p>
      </div>
    </div>
  );
};

const AuthBranding: React.FC = () => {
  return (
    <div className="hidden min-h-screen w-full flex-col justify-between bg-blue-600 p-10 text-white lg:flex xl:p-12">
      {/* =====================================================
          BRAND
      ====================================================== */}

      <div>
        <div className="flex items-center gap-3">
          {/* Logo */}
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 shadow-sm backdrop-blur-sm">
            <svg
              className="h-7 w-7"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.8}
                d="M12 3l8 4v5c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V7l8-4z"
              />

              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.8}
                d="M9 12l2 2 4-4"
              />
            </svg>
          </div>

          {/* Brand Name */}
          <div>
            <h1 className="text-lg font-bold tracking-tight">
              Feature Control
            </h1>

            <p className="text-xs text-blue-100">
              Management System
            </p>
          </div>
        </div>

        {/* =================================================
            MAIN HEADING
        ================================================== */}

        <div className="mt-16">
          <div className="mb-4 inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1.5">
            <span className="mr-2 h-2 w-2 rounded-full bg-green-300" />

            <span className="text-xs font-medium text-blue-50">
              Feature management made simple
            </span>
          </div>

          <h2 className="max-w-lg text-4xl font-bold leading-tight tracking-tight xl:text-5xl">
            Control your features with confidence.
          </h2>

          <p className="mt-6 max-w-md text-sm leading-7 text-blue-100 xl:text-base">
            Manage feature flags, environments, rollouts,
            user assignments and analytics from one
            centralized platform.
          </p>
        </div>

        {/* =================================================
            FEATURES
        ================================================== */}

        <div className="mt-10 space-y-6">
          <FeatureItem
            title="Feature Flags"
            description="Enable or disable application features without redeploying."
          />

          <FeatureItem
            title="Controlled Rollouts"
            description="Gradually release features to selected users and environments."
          />

          <FeatureItem
            title="Analytics"
            description="Track feature usage and monitor your rollout activity."
          />
        </div>
      </div>

      {/* =====================================================
          BOTTOM
      ====================================================== */}

      <div>
        <div className="mb-5 h-px w-full bg-white/15" />

        <div className="flex items-center justify-between">
          <p className="text-xs text-blue-100">
            Secure Feature Management
          </p>

          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-green-300" />

            <span className="text-xs text-blue-100">
              System Online
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthBranding;