
// ============================================================
// STORAGE TYPES
// ============================================================

// ============================================================
// STORAGE KEYS
// ============================================================

export const STORAGE_KEYS = {
  ACCESS_TOKEN: "access_token",
  REFRESH_TOKEN: "refresh_token",
  USER: "user",
} as const;

// ============================================================
// AUTH STORAGE
// ============================================================

export interface AuthStorage {
  access_token?: string;

  refresh_token?: string;

  user?: unknown;
}

// ============================================================
// STORAGE VALUE
// ============================================================

export type StorageValue =
  | string
  | number
  | boolean
  | object
  | null;

// ============================================================
// STORAGE SERVICE
// ============================================================

export interface StorageService {
  get<T = string>(
    key: string
  ): T | null;

  set<T = StorageValue>(
    key: string,
    value: T
  ): void;

  remove(
    key: string
  ): void;

  clear(): void;
}

