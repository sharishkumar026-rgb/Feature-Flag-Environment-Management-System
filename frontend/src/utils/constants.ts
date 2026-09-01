
// ============================================================
// APPLICATION CONSTANTS
// ============================================================

// ============================================================
// APP
// ============================================================

export const APP_NAME = "Feature Flag System";

export const APP_DESCRIPTION =
  "Feature Flag & Environment Management System";

// ============================================================
// API
// ============================================================

export const API_PREFIX = "/api";

export const API_TIMEOUT = 30000;

// ============================================================
// AUTH
// ============================================================

export const AUTH_TOKEN_KEY = "access_token";

export const REFRESH_TOKEN_KEY = "refresh_token";

export const USER_KEY = "user";

// ============================================================
// ROLES
// ============================================================

export const ROLES = {
  ADMIN: "admin",
  USER: "user",
} as const;

export type Role =
  (typeof ROLES)[keyof typeof ROLES];

// ============================================================
// STATUS
// ============================================================

export const STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  ENABLED: "enabled",
  DISABLED: "disabled",
} as const;

// ============================================================
// PAGINATION
// ============================================================

export const DEFAULT_PAGE = 1;

export const DEFAULT_PAGE_SIZE = 10;

export const PAGE_SIZE_OPTIONS = [
  10,
  20,
  50,
  100,
];

// ============================================================
// DATE FORMAT
// ============================================================

export const DATE_LOCALE = "en-IN";

export const DATE_FORMAT_OPTIONS = {
  day: "2-digit",
  month: "short",
  year: "numeric",
} as const;

export const DATETIME_FORMAT_OPTIONS = {
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
} as const;

// ============================================================
// FEATURE FLAG VALUES
// ============================================================

export const FEATURE_FLAG_TYPES = {
  BOOLEAN: "boolean",
  STRING: "string",
  NUMBER: "number",
} as const;

export type FeatureFlagType =
  (typeof FEATURE_FLAG_TYPES)[keyof typeof FEATURE_FLAG_TYPES];

// ============================================================
// ROUTES
// ============================================================

export const ROUTES = {
  LOGIN: "/auth",
  DASHBOARD: "/dashboard",

  USERS: "/users",
  USER_DETAILS: "/users/:user_id",

  ROLES: "/roles",
  ROLE_DETAILS: "/roles/:role_id",

  FEATURE_FLAGS: "/feature-flags",
  FEATURE_FLAG_DETAILS:
    "/feature-flags/:feature_id",
  FEATURE_FLAG_EVALUATION:
    "/feature-flags/:feature_id/evaluate",

  ENVIRONMENTS: "/environments",
  ENVIRONMENT_DETAILS:
    "/environments/:environment_id",

  ROLLOUTS: "/rollouts",
  ROLLOUT_DETAILS:
    "/rollouts/:rollout_id",

  ASSIGNMENTS: "/assignments",
  ASSIGNMENT_DETAILS:
    "/assignments/:assignment_id",

  AUDIT_LOGS: "/audit-logs",
  AUDIT_LOG_DETAILS:
    "/audit-logs/:audit_log_id",

  ANALYTICS: "/analytics",
  ANALYTICS_OVERVIEW:
    "/analytics/overview",
  FEATURE_ANALYTICS:
    "/analytics/features/:feature_id",
  ROLLOUT_ANALYTICS:
    "/analytics/rollouts/:rollout_id",
  ASSIGNMENT_ANALYTICS:
    "/analytics/assignments/:assignment_id",
  ENVIRONMENT_ANALYTICS:
    "/analytics/environments/:environment_id",
} as const;

// ============================================================
// ERROR MESSAGES
// ============================================================

export const ERROR_MESSAGES = {
  GENERIC:
    "Something went wrong. Please try again.",

  NETWORK:
    "Unable to connect to the server.",

  UNAUTHORIZED:
    "Your session has expired. Please login again.",

  FORBIDDEN:
    "You do not have permission to perform this action.",

  NOT_FOUND:
    "The requested resource was not found.",

  VALIDATION:
    "Please check the entered information.",

  REQUIRED:
    "This field is required.",
} as const;

// ============================================================
// SUCCESS MESSAGES
// ============================================================

export const SUCCESS_MESSAGES = {
  CREATED: "Created successfully.",
  UPDATED: "Updated successfully.",
  DELETED: "Deleted successfully.",
  ENABLED: "Enabled successfully.",
  DISABLED: "Disabled successfully.",
  RETRIEVED: "Retrieved successfully.",
} as const;

// ============================================================
// LOCAL STORAGE
// ============================================================

export const STORAGE_KEYS = {
  ACCESS_TOKEN: AUTH_TOKEN_KEY,
  REFRESH_TOKEN: REFRESH_TOKEN_KEY,
  USER: USER_KEY,
} as const;

// ============================================================
// UI
// ============================================================

export const UI = {
  SEARCH_DEBOUNCE: 300,

  TOAST_DURATION: 3000,

  SIDEBAR_WIDTH: 260,

  HEADER_HEIGHT: 64,
} as const;

