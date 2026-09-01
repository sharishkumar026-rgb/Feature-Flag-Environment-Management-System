
import React from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

// ============================================================
// AUTH
// ============================================================

import Auth from "../pages/Auth";

// ============================================================
// DASHBOARD
// ============================================================

import Dashboard from "../pages/Dashboard";

// ============================================================
// USERS
// ============================================================

import Users from "../pages/users/Users";
import UserDetails from "../pages/users/UserDetails";

// ============================================================
// ROLES
// ============================================================

import Roles from "../pages/roles/Roles";

// ============================================================
// FEATURE FLAGS
// ============================================================

import FeatureFlags from "../pages/featureFlags/FeatureFlags";
import FeatureFlagDetails from "../pages/featureFlags/FeatureFlagDetails";
import FeatureFlagEvaluation from "../pages/featureFlags/FeatureFlagEvaluation";

// ============================================================
// ENVIRONMENTS
// ============================================================

import Environments from "../pages/environments/Environments";
import EnvironmentDetails from "../pages/environments/EnvironmentDetails";

// ============================================================
// ROLLOUTS
// ============================================================

import Rollouts from "../pages/rollouts/Rollouts";
import RolloutDetails from "../pages/rollouts/RolloutDetails";

// ============================================================
// ASSIGNMENTS
// ============================================================

import Assignments from "../pages/assignments/Assignments";
import AssignmentDetails from "../pages/assignments/AssignmentDetails";

// ============================================================
// AUDIT LOGS
// ============================================================

import AuditLogs from "../pages/auditLogs/AuditLogs";

// ============================================================
// ANALYTICS
// ============================================================

import AnalyticsOverview from "../pages/analytics/AnalyticsOverview";
import FeatureAnalytics from "../pages/analytics/FeatureAnalytics";
import RolloutAnalytics from "../pages/analytics/RolloutAnalytics";
import AssignmentAnalytics from "../pages/analytics/AssignmentAnalytics";
import EnvironmentAnalytics from "../pages/analytics/EnvironmentAnalytics";

// ============================================================
// LAYOUT
// ============================================================

import ProtectedRoute from "../components/layout/ProtectedRoute";

// ============================================================
// FEATURE EVALUATION ROUTE WRAPPER
// ============================================================

const FeatureFlagEvaluationRoute: React.FC = () => {
  const featureIdString =
    window.location.pathname.split("/")[2];

  const featureId = Number(featureIdString);

  if (!featureIdString || Number.isNaN(featureId)) {
    return (
      <div className="p-6">
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <p className="text-sm font-medium text-red-700">
            Invalid feature ID.
          </p>
        </div>
      </div>
    );
  }

  return (
    <FeatureFlagEvaluation
      featureId={featureId}
    />
  );
};

// ============================================================
// APP ROUTES
// ============================================================

const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>

        {/* ======================================================
            PUBLIC ROUTES
        ======================================================= */}

        <Route
          path="/login"
          element={<Auth />}
        />

        <Route
          path="/"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />

        {/* ======================================================
            PROTECTED ROUTES
        ======================================================= */}

        <Route element={<ProtectedRoute />}>

          {/* ====================================================
              DASHBOARD
          ===================================================== */}

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          {/* ====================================================
              USERS
          ===================================================== */}

          <Route
            path="/users"
            element={<Users />}
          />

          <Route
            path="/users/:user_id"
            element={<UserDetails />}
          />

          {/* ====================================================
              ROLES
          ===================================================== */}

          <Route
            path="/roles"
            element={<Roles />}
          />

          {/* ====================================================
              FEATURE FLAGS
          ===================================================== */}

          <Route
            path="/feature-flags"
            element={<FeatureFlags />}
          />

          <Route
            path="/feature-flags/:feature_id"
            element={<FeatureFlagDetails />}
          />

          <Route
            path="/feature-flags/:feature_id/evaluate"
            element={<FeatureFlagEvaluationRoute />}
          />

          {/* ====================================================
              ENVIRONMENTS
          ===================================================== */}

          <Route
            path="/environments"
            element={<Environments />}
          />

          <Route
            path="/environments/:environment_id"
            element={<EnvironmentDetails />}
          />

          {/* ====================================================
              ROLLOUTS
          ===================================================== */}

          <Route
            path="/rollouts"
            element={<Rollouts />}
          />

          <Route
            path="/rollouts/:rollout_id"
            element={<RolloutDetails />}
          />

          {/* ====================================================
              ASSIGNMENTS
          ===================================================== */}

          <Route
            path="/assignments"
            element={<Assignments />}
          />

          <Route
            path="/assignments/:assignment_id"
            element={<AssignmentDetails />}
          />

          {/* ====================================================
              AUDIT LOGS
          ===================================================== */}

          <Route
            path="/audit-logs"
            element={<AuditLogs />}
          />

          {/* ====================================================
              ANALYTICS
          ===================================================== */}

          <Route
            path="/analytics"
            element={<AnalyticsOverview />}
          />

          <Route
            path="/analytics/overview"
            element={<AnalyticsOverview />}
          />

          <Route
            path="/analytics/features/:feature_id"
            element={<FeatureAnalytics />}
          />

          <Route
            path="/analytics/rollouts/:rollout_id"
            element={<RolloutAnalytics />}
          />

          <Route
            path="/analytics/assignments/:assignment_id"
            element={<AssignmentAnalytics />}
          />

          <Route
            path="/analytics/environments/:environment_id"
            element={<EnvironmentAnalytics />}
          />

        </Route>

        {/* ======================================================
            FALLBACK
        ======================================================= */}

        <Route
          path="*"
          element={
            <Navigate
              to="/dashboard"
              replace
            />
          }
        />

      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;







