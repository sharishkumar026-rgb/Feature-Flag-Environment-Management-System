import React, { useMemo, useState } from "react";

interface AuditLog {
  id: number;

  action?: string;
  entity_type?: string;
  entity_id?: number;

  description?: string;
  details?: string | Record<string, any>;

  user_id?: number;
  created_by_id?: number;

  created_at?: string;
  updated_at?: string;

  user?: {
    id?: number;
    name?: string;
    email?: string;
    role?: string;
  };

  created_by?: {
    id?: number;
    name?: string;
    email?: string;
    role?: string;
  };
}

interface AuditLogTableProps {
  logs?: AuditLog[];
  loading?: boolean;
  onView?: (log: AuditLog) => void;
  onRefresh?: () => void;
}

const AuditLogTable: React.FC<
  AuditLogTableProps
> = ({
  logs = [],
  loading = false,
  onView,
  onRefresh,
}) => {
  const [search, setSearch] =
    useState("");

  const [actionFilter, setActionFilter] =
    useState("ALL");

  const [entityFilter, setEntityFilter] =
    useState("ALL");

  // ============================================================
  // FORMAT DATE
  // ============================================================

  const formatDate = (
    date?: string
  ) => {
    if (!date) {
      return "-";
    }

    const parsedDate =
      new Date(date);

    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {
      return "-";
    }

    return parsedDate.toLocaleString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  // ============================================================
  // ACTION COLOR
  // ============================================================

  const getActionClasses = (
    action?: string
  ) => {
    const normalized =
      action?.toUpperCase() || "";

    if (
      normalized.includes("CREATE") ||
      normalized.includes("REGISTER")
    ) {
      return "bg-green-100 text-green-700";
    }

    if (
      normalized.includes("UPDATE") ||
      normalized.includes("EDIT")
    ) {
      return "bg-blue-100 text-blue-700";
    }

    if (
      normalized.includes("DELETE") ||
      normalized.includes("REMOVE")
    ) {
      return "bg-red-100 text-red-700";
    }

    if (
      normalized.includes("ENABLE") ||
      normalized.includes("ACTIVATE")
    ) {
      return "bg-emerald-100 text-emerald-700";
    }

    if (
      normalized.includes("DISABLE") ||
      normalized.includes("DEACTIVATE")
    ) {
      return "bg-orange-100 text-orange-700";
    }

    if (
      normalized.includes("LOGIN") ||
      normalized.includes("LOGOUT")
    ) {
      return "bg-purple-100 text-purple-700";
    }

    if (
      normalized.includes("EVALUATE")
    ) {
      return "bg-indigo-100 text-indigo-700";
    }

    return "bg-gray-100 text-gray-700";
  };

  // ============================================================
  // ENTITY COLOR
  // ============================================================

  const getEntityClasses = (
    entity?: string
  ) => {
    const normalized =
      entity?.toUpperCase() || "";

    if (
      normalized.includes("USER")
    ) {
      return "bg-blue-100 text-blue-700";
    }

    if (
      normalized.includes("ROLE")
    ) {
      return "bg-purple-100 text-purple-700";
    }

    if (
      normalized.includes("FEATURE")
    ) {
      return "bg-indigo-100 text-indigo-700";
    }

    if (
      normalized.includes("ENVIRONMENT")
    ) {
      return "bg-orange-100 text-orange-700";
    }

    if (
      normalized.includes("ROLLOUT")
    ) {
      return "bg-pink-100 text-pink-700";
    }

    if (
      normalized.includes("ASSIGNMENT")
    ) {
      return "bg-teal-100 text-teal-700";
    }

    return "bg-gray-100 text-gray-700";
  };

  // ============================================================
  // ACTIONS
  // ============================================================

  const actions = useMemo(() => {
    const values = logs
      .map((log) =>
        log.action
          ? log.action.toUpperCase()
          : ""
      )
      .filter(Boolean);

    return Array.from(
      new Set(values)
    ).sort();
  }, [logs]);

  // ============================================================
  // ENTITIES
  // ============================================================

  const entities = useMemo(() => {
    const values = logs
      .map((log) =>
        log.entity_type
          ? log.entity_type.toUpperCase()
          : ""
      )
      .filter(Boolean);

    return Array.from(
      new Set(values)
    ).sort();
  }, [logs]);

  // ============================================================
  // FILTER LOGS
  // ============================================================

  const filteredLogs = useMemo(() => {
    const searchValue =
      search.trim().toLowerCase();

    return logs.filter((log) => {
      const action =
        log.action?.toLowerCase() ||
        "";

      const entity =
        log.entity_type?.toLowerCase() ||
        "";

      const description =
        log.description?.toLowerCase() ||
        "";

      const details =
        typeof log.details ===
        "string"
          ? log.details.toLowerCase()
          : JSON.stringify(
              log.details || {}
            ).toLowerCase();

      const userName =
        log.user?.name?.toLowerCase() ||
        log.created_by?.name?.toLowerCase() ||
        "";

      const userEmail =
        log.user?.email?.toLowerCase() ||
        log.created_by?.email?.toLowerCase() ||
        "";

      const matchesSearch =
        !searchValue ||
        action.includes(searchValue) ||
        entity.includes(searchValue) ||
        description.includes(searchValue) ||
        details.includes(searchValue) ||
        userName.includes(searchValue) ||
        userEmail.includes(searchValue) ||
        String(
          log.entity_id || ""
        ).includes(searchValue) ||
        String(
          log.user_id || ""
        ).includes(searchValue);

      const matchesAction =
        actionFilter === "ALL" ||
        action ===
          actionFilter.toLowerCase();

      const matchesEntity =
        entityFilter === "ALL" ||
        entity ===
          entityFilter.toLowerCase();

      return (
        matchesSearch &&
        matchesAction &&
        matchesEntity
      );
    });
  }, [
    logs,
    search,
    actionFilter,
    entityFilter,
  ]);

  // ============================================================
  // CLEAR FILTERS
  // ============================================================

  const clearFilters = () => {
    setSearch("");
    setActionFilter("ALL");
    setEntityFilter("ALL");
  };

  const hasFilters =
    search !== "" ||
    actionFilter !== "ALL" ||
    entityFilter !== "ALL";

  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">

        <div className="flex items-center justify-center px-6 py-20">

          <div className="flex flex-col items-center">

            <svg
              className="h-10 w-10 animate-spin text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />

              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>

            <p className="mt-4 text-sm font-medium text-gray-600">
              Loading audit logs...
            </p>

          </div>

        </div>

      </div>
    );
  }

  // ============================================================
  // UI
  // ============================================================

  return (
    <div className="w-full rounded-2xl border border-gray-200 bg-white shadow-sm">

      {/* ======================================================
          HEADER
      ======================================================= */}

      <div className="border-b border-gray-200 px-6 py-5">

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

          <div className="flex items-center gap-4">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100">

              <svg
                className="h-6 w-6 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h6l5 5v11a2 2 0 01-2 2z"
                />
              </svg>

            </div>

            <div>

              <h2 className="text-xl font-bold text-gray-900">
                Audit Logs
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Track user and system activity.
              </p>

            </div>

          </div>

          {onRefresh && (
            <button
              type="button"
              onClick={onRefresh}
              className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
            >

              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h5M20 20v-5h-5M5.07 9A7 7 0 0117.66 6.34L20 9M18.93 15A7 7 0 016.34 17.66L4 15"
                />
              </svg>

              Refresh

            </button>
          )}

        </div>

      </div>

      {/* ======================================================
          FILTERS
      ======================================================= */}

      <div className="border-b border-gray-200 bg-gray-50/70 px-6 py-4">

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">

          {/* SEARCH */}

          <div className="relative lg:col-span-2">

            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">

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
                  d="M21 21l-4.35-4.35m2.35-5.65a8 8 0 11-16 0 8 8 0 0116 0z"
                />
              </svg>

            </div>

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              placeholder="Search audit logs..."
              className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-10 pr-4 text-sm outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />

          </div>

          {/* ACTION */}

          <select
            value={actionFilter}
            onChange={(event) =>
              setActionFilter(
                event.target.value
              )
            }
            className="rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          >

            <option value="ALL">
              All Actions
            </option>

            {actions.map(
              (action) => (
                <option
                  key={action}
                  value={action}
                >
                  {action}
                </option>
              )
            )}

          </select>

          {/* ENTITY */}

          <select
            value={entityFilter}
            onChange={(event) =>
              setEntityFilter(
                event.target.value
              )
            }
            className="rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          >

            <option value="ALL">
              All Entities
            </option>

            {entities.map(
              (entity) => (
                <option
                  key={entity}
                  value={entity}
                >
                  {entity}
                </option>
              )
            )}

          </select>

        </div>

        {/* FILTER SUMMARY */}

        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">

          <p className="text-xs text-gray-500">

            Showing{" "}
            <span className="font-semibold text-gray-700">
              {filteredLogs.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-700">
              {logs.length}
            </span>{" "}
            audit logs

          </p>

          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700"
            >
              Clear filters
            </button>
          )}

        </div>

      </div>

      {/* ======================================================
          TABLE
      ======================================================= */}

      <div className="overflow-x-auto">

        <table className="min-w-full divide-y divide-gray-200">

          <thead className="bg-gray-50">

            <tr>

              <th className="whitespace-nowrap px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                ID
              </th>

              <th className="whitespace-nowrap px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                Action
              </th>

              <th className="whitespace-nowrap px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                Entity
              </th>

              <th className="whitespace-nowrap px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                User
              </th>

              <th className="whitespace-nowrap px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                Description
              </th>

              <th className="whitespace-nowrap px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                Date
              </th>

              {onView && (
                <th className="whitespace-nowrap px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Action
                </th>
              )}

            </tr>

          </thead>

          <tbody className="divide-y divide-gray-100 bg-white">

            {filteredLogs.length === 0 ? (
              <tr>

                <td
                  colSpan={
                    onView ? 7 : 6
                  }
                  className="px-6 py-16 text-center"
                >

                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100">

                    <svg
                      className="h-7 w-7 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h6l5 5v11a2 2 0 01-2 2z"
                      />
                    </svg>

                  </div>

                  <h3 className="mt-4 text-sm font-semibold text-gray-900">
                    No audit logs found
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    {hasFilters
                      ? "Try changing your filters or search term."
                      : "There are no audit logs available."}
                  </p>

                </td>

              </tr>
            ) : (
              filteredLogs.map(
                (log) => {

                  const user =
                    log.user ||
                    log.created_by;

                  const action =
                    log.action ||
                    "UNKNOWN";

                  const entity =
                    log.entity_type ||
                    "UNKNOWN";

                  return (
                    <tr
                      key={log.id}
                      className="transition hover:bg-gray-50"
                    >

                      {/* ID */}

                      <td className="whitespace-nowrap px-6 py-4">

                        <span className="text-sm font-semibold text-gray-900">
                          #{log.id}
                        </span>

                      </td>

                      {/* ACTION */}

                      <td className="whitespace-nowrap px-6 py-4">

                        <span
                          className={`inline-flex rounded-lg px-3 py-1.5 text-xs font-semibold ${getActionClasses(
                            action
                          )}`}
                        >
                          {action.toUpperCase()}
                        </span>

                      </td>

                      {/* ENTITY */}

                      <td className="whitespace-nowrap px-6 py-4">

                        <div className="flex flex-col gap-1">

                          <span
                            className={`inline-flex w-fit rounded-lg px-3 py-1.5 text-xs font-semibold ${getEntityClasses(
                              entity
                            )}`}
                          >
                            {entity.toUpperCase()}
                          </span>

                          {log.entity_id && (
                            <span className="text-xs text-gray-500">
                              ID: #
                              {
                                log.entity_id
                              }
                            </span>
                          )}

                        </div>

                      </td>

                      {/* USER */}

                      <td className="px-6 py-4">

                        <div className="flex items-center gap-3">

                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100">

                            <span className="text-sm font-bold text-blue-600">
                              {(
                                user?.name ||
                                "U"
                              )
                                .charAt(0)
                                .toUpperCase()}
                            </span>

                          </div>

                          <div className="min-w-0">

                            <p className="truncate text-sm font-semibold text-gray-900">
                              {user?.name ||
                                (log.user_id
                                  ? `User #${log.user_id}`
                                  : "System")}
                            </p>

                            <p className="truncate text-xs text-gray-500">
                              {user?.email ||
                                (log.user_id
                                  ? `User ID: ${log.user_id}`
                                  : "System")}
                            </p>

                          </div>

                        </div>

                      </td>

                      {/* DESCRIPTION */}

                      <td className="max-w-sm px-6 py-4">

                        <p className="truncate text-sm text-gray-700">
                          {log.description ||
                            "No description available"}
                        </p>

                      </td>

                      {/* DATE */}

                      <td className="whitespace-nowrap px-6 py-4">

                        <div className="flex items-center gap-2">

                          <svg
                            className="h-4 w-4 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>

                          <span className="text-sm text-gray-600">
                            {formatDate(
                              log.created_at
                            )}
                          </span>

                        </div>

                      </td>

                      {/* VIEW */}

                      {onView && (
                        <td className="whitespace-nowrap px-6 py-4 text-right">

                          <button
                            type="button"
                            onClick={() =>
                              onView(log)
                            }
                            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                          >

                            <svg
                              className="h-4 w-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />

                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              />
                            </svg>

                            View

                          </button>

                        </td>
                      )}

                    </tr>
                  );
                }
              )
            )}

          </tbody>

        </table>

      </div>

      {/* ======================================================
          FOOTER
      ======================================================= */}

      {filteredLogs.length > 0 && (
        <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

            <p className="text-xs text-gray-500">
              Total audit logs:{" "}
              <span className="font-semibold text-gray-700">
                {filteredLogs.length}
              </span>
            </p>

            <p className="text-xs text-gray-400">
              Audit activity is read-only.
            </p>

          </div>

        </div>
      )}

    </div>
  );
};

export default AuditLogTable;