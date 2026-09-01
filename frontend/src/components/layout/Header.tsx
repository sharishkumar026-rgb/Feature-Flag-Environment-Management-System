import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface StoredUser {
  id?: number;
  name?: string;
  username?: string;
  email?: string;
  role?: string;
}

const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [user, setUser] = useState<StoredUser | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        setUser(null);
      }
    }
  }, []);

  const getPageTitle = () => {
    const path = location.pathname;

    if (path.startsWith("/users")) {
      return "Users";
    }

    if (path.startsWith("/roles")) {
      return "Roles";
    }

    if (path.startsWith("/feature-flags")) {
      return "Feature Flags";
    }

    if (path.startsWith("/environments")) {
      return "Environments";
    }

    if (path.startsWith("/rollouts")) {
      return "Rollouts";
    }

    if (path.startsWith("/assignments")) {
      return "Assignments";
    }

    if (path.startsWith("/audit-logs")) {
      return "Audit Logs";
    }

    if (path.startsWith("/analytics")) {
      return "Analytics";
    }

    if (path.startsWith("/dashboard")) {
      return "Dashboard";
    }

    return "Feature Control";
  };

  const getUserName = () => {
    return (
      user?.name ||
      user?.username ||
      user?.email?.split("@")[0] ||
      "User"
    );
  };

  const getInitials = () => {
    const name = getUserName();

    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  const handleProfile = () => {
    setMenuOpen(false);
    navigate("/profile");
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");

    setMenuOpen(false);

    navigate("/auth");
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 sm:px-6">
      {/* Left Side */}
      <div className="flex items-center gap-4">
        {/* Mobile Menu Button */}
        <button
          type="button"
          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 lg:hidden"
          aria-label="Open menu"
        >
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
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        {/* Page Title */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            {getPageTitle()}
          </h2>

          <p className="hidden text-xs text-gray-500 sm:block">
            Feature Flag Management System
          </p>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-3">
        {/* Notification */}
        <button
          type="button"
          className="relative rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
          aria-label="Notifications"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 17h5l-1.5-2V9a6.5 6.5 0 00-13 0v6L4 17h5m6 0a3 3 0 01-6 0"
            />
          </svg>

          {/* Notification dot */}
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
        </button>

        {/* Divider */}
        <div className="hidden h-8 w-px bg-gray-200 sm:block" />

        {/* User Menu */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            className="flex items-center gap-3 rounded-lg px-2 py-1.5 transition hover:bg-gray-50"
          >
            {/* Avatar */}
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
              {getInitials()}
            </div>

            {/* User Info */}
            <div className="hidden text-left sm:block">
              <p className="text-sm font-medium text-gray-900">
                {getUserName()}
              </p>

              <p className="text-xs text-gray-500">
                {user?.role || "User"}
              </p>
            </div>

            {/* Arrow */}
            <svg
              className={`hidden h-4 w-4 text-gray-400 transition-transform sm:block ${
                menuOpen ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {/* Dropdown */}
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
              {/* User Details */}
              <div className="border-b border-gray-100 px-4 py-3">
                <p className="text-sm font-semibold text-gray-900">
                  {getUserName()}
                </p>

                {user?.email && (
                  <p className="mt-0.5 truncate text-xs text-gray-500">
                    {user.email}
                  </p>
                )}

                <span className="mt-2 inline-flex rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
                  {user?.role || "User"}
                </span>
              </div>

              {/* Profile */}
              <button
                type="button"
                onClick={handleProfile}
                className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50"
              >
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 7a3 3 0 11-6 0 3 3 0 016 0zM4 21a8 8 0 0116 0"
                  />
                </svg>

                Profile
              </button>

              {/* Logout */}
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-3 border-t border-gray-100 px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1"
                  />
                </svg>

                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;