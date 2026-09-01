
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

import api from "../api/axios";
import { getCurrentUser } from "../api/authApi";

// ============================================================
// TYPES
// ============================================================

export interface User {
  id: number;
  name?: string;
  email: string;
  role?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;

  setUser: (user: User | null) => void;

  login: (user: User) => void;

  logout: () => Promise<void>;

  refreshUser: () => Promise<void>;
}

// ============================================================
// CONTEXT
// ============================================================

const AuthContext =
  createContext<AuthContextType | undefined>(
    undefined
  );

// ============================================================
// PROVIDER
// ============================================================

export const AuthProvider: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  const [user, setUser] =
    useState<User | null>(null);

  const [loading, setLoading] =
    useState<boolean>(true);

  // ==========================================================
  // GET CURRENT USER
  // ==========================================================

  const refreshUser = async (): Promise<void> => {
    try {
      setLoading(true);

      const token =
        localStorage.getItem("access_token");

      if (!token) {
        setUser(null);
        return;
      }

      const response =
        await getCurrentUser();

      console.log(
        "Current user response:",
        response
      );

      /*
       * Supported responses:
       *
       * { user: {...} }
       *
       * { data: {...} }
       *
       * { data: { user: {...} } }
       *
       * {...user}
       */

      const responseData =
        response?.data ?? response;

      let currentUser: User | null =
        null;

      if (
        responseData &&
        typeof responseData === "object"
      ) {
        // ----------------------------------------------------
        // { user: {...} }
        // ----------------------------------------------------

        if (
          "user" in responseData &&
          responseData.user
        ) {
          currentUser =
            responseData.user as User;
        }

        // ----------------------------------------------------
        // { data: {...} }
        // ----------------------------------------------------

        else if (
          "data" in responseData &&
          responseData.data
        ) {
          const data =
            responseData.data;

          // { data: { user: {...} } }

          if (
            typeof data === "object" &&
            "user" in data &&
            data.user
          ) {
            currentUser =
              data.user as User;
          }

          // { data: {...user} }

          else if (
            typeof data === "object" &&
            "id" in data
          ) {
            currentUser =
              data as User;
          }
        }

        // ----------------------------------------------------
        // {...user}
        // ----------------------------------------------------

        else if (
          "id" in responseData
        ) {
          currentUser =
            responseData as User;
        }
      }

      setUser(currentUser);
    } catch (error) {
      console.error(
        "Failed to load current user:",
        error
      );

      localStorage.removeItem(
        "access_token"
      );

      localStorage.removeItem(
        "refresh_token"
      );

      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================================
  // INITIAL AUTH CHECK
  // ==========================================================

  useEffect(() => {
    refreshUser();
  }, []);

  // ==========================================================
  // LOGIN
  // ==========================================================

  const login = (
    loggedInUser: User
  ): void => {
    setUser(loggedInUser);
  };

  // ==========================================================
  // LOGOUT
  // ==========================================================

  const logout = async (): Promise<void> => {
    try {
      const token =
        localStorage.getItem(
          "access_token"
        );

      if (token) {
        try {
          await api.post(
            "/auth/logout"
          );
        } catch (error) {
          console.error(
            "Logout API request failed:",
            error
          );
        }
      }
    } finally {
      // ------------------------------------------------------
      // CLEAR AUTH DATA
      // ------------------------------------------------------

      localStorage.removeItem(
        "access_token"
      );

      localStorage.removeItem(
        "refresh_token"
      );

      localStorage.removeItem(
        "user"
      );

      setUser(null);
    }
  };

  // ==========================================================
  // CONTEXT VALUE
  // ==========================================================

  const value: AuthContextType = {
    user,
    loading,
    isAuthenticated: !!user,

    setUser,

    login,
    logout,
    refreshUser,
  };

  // ==========================================================
  // PROVIDER
  // ==========================================================

  return (
    <AuthContext.Provider
      value={value}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ============================================================
// USE AUTH
// ============================================================

export const useAuth =
  (): AuthContextType => {
    const context =
      useContext(AuthContext);

    if (!context) {
      throw new Error(
        "useAuth must be used inside an AuthProvider"
      );
    }

    return context;
  };

// ============================================================
// DEFAULT EXPORT
// ============================================================

export default AuthContext;

