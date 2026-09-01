
import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  getAuditLogs,
  getAuditLogById,
} from "../../api/auditLogApi";

// ============================================================
// TYPES
// ============================================================

export interface AuditLog {
  id: number;

  user_id?: number;

  action: string;

  resource_type?: string;

  resource_id?: number;

  description?: string;

  created_at?: string;

  user?: {
    id?: number;
    name?: string;
    email?: string;
    role?: string;
  };
}

// ============================================================
// API RESPONSE
// ============================================================

interface AuditLogListResponse {
  success?: boolean;
  message?: string;

  audit_logs?: AuditLog[];

  data?:
    | AuditLog[]
    | {
        audit_logs?: AuditLog[];
      };
}

// ============================================================
// COMPONENT
// ============================================================

const AuditLogs: React.FC = () => {
  const [auditLogs, setAuditLogs] =
    useState<AuditLog[]>([]);

  const [loading, setLoading] =
    useState<boolean>(true);

  const [error, setError] =
    useState<string>("");

  const [search, setSearch] =
    useState<string>("");

  const [deletingId, setDeletingId] =
    useState<number | null>(null);

  // ==========================================================
  // GET ALL AUDIT LOGS
  // ==========================================================

  const fetchAuditLogs =
    async (): Promise<void> => {
      try {
        setLoading(true);
        setError("");

        const response =
          (await getAuditLogs()) as AuditLogListResponse;

        console.log(
          "Audit Logs API response:",
          response
        );

        let auditLogData: AuditLog[] = [];

        // ----------------------------------------------------
        // RESPONSE:
        // { audit_logs: [...] }
        // ----------------------------------------------------

        if (
          response &&
          Array.isArray(
            response.audit_logs
          )
        ) {
          auditLogData =
            response.audit_logs;
        }

        // ----------------------------------------------------
        // RESPONSE:
        // { data: [...] }
        // ----------------------------------------------------

        else if (
          response &&
          Array.isArray(response.data)
        ) {
          auditLogData =
            response.data;
        }

        // ----------------------------------------------------
        // RESPONSE:
        // { data: { audit_logs: [...] } }
        // ----------------------------------------------------

        else if (
          response &&
          response.data &&
          !Array.isArray(response.data) &&
          Array.isArray(
            response.data.audit_logs
          )
        ) {
          auditLogData =
            response.data.audit_logs;
        }

        // ----------------------------------------------------
        // DIRECT ARRAY
        // ----------------------------------------------------

        else if (
          Array.isArray(response)
        ) {
          auditLogData =
            response as unknown as AuditLog[];
        }

        // ----------------------------------------------------
        // EMPTY
        // ----------------------------------------------------

        else {
          auditLogData = [];
        }

        setAuditLogs(auditLogData);

      } catch (err: any) {
        console.error(
          "Failed to retrieve audit logs:",
          err
        );

        const message =
          err?.response?.data?.detail ||
          err?.response?.data?.message ||
          err?.message ||
          "Failed to retrieve audit logs.";

        setError(message);

      } finally {
        setLoading(false);
      }
    };

  // ==========================================================
  // INITIAL LOAD
  // ==========================================================

  useEffect(() => {
    fetchAuditLogs();
  }, []);

  // ==========================================================
  // SEARCH
  // ==========================================================

  const filteredAuditLogs =
    useMemo(() => {
      const searchValue =
        search.trim().toLowerCase();

      if (!searchValue) {
        return auditLogs;
      }

      return auditLogs.filter(
        (log) => {
          const id =
            log.id.toString();

          const userId =
            log.user_id?.toString() ||
            "";

          const action =
            log.action || "";

          const resourceType =
            log.resource_type || "";

          const resourceId =
            log.resource_id?.toString() ||
            "";

          const description =
            log.description || "";

          const userName =
            log.user?.name || "";

          const userEmail =
            log.user?.email || "";

          const role =
            log.user?.role || "";

          return (
            id.includes(searchValue) ||
            userId.includes(searchValue) ||
            action
              .toLowerCase()
              .includes(searchValue) ||
            resourceType
              .toLowerCase()
              .includes(searchValue) ||
            resourceId.includes(searchValue) ||
            description
              .toLowerCase()
              .includes(searchValue) ||
            userName
              .toLowerCase()
              .includes(searchValue) ||
            userEmail
              .toLowerCase()
              .includes(searchValue) ||
            role
              .toLowerCase()
              .includes(searchValue)
          );
        }
      );
    }, [auditLogs, search]);

  // ==========================================================
  // DELETE AUDIT LOG
  // ==========================================================

  const handleDelete = async (
    auditLog: AuditLog
  ): Promise<void> => {
    const confirmed =
      window.confirm(
        `Are you sure you want to delete audit log #${auditLog.id}?`
      );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(auditLog.id);
      setError("");

      /*
       * Delete API is optional.
       *
       * If your backend has:
       * DELETE /api/audit-logs/{audit_log_id}
       *
       * then add deleteAuditLog to auditLogApi.ts
       * and uncomment the API call below.
       */

      // await deleteAuditLog(auditLog.id);

      setAuditLogs(
        (current) =>
          current.filter(
            (item) =>
              item.id !== auditLog.id
          )
      );

    } catch (err: any) {
      console.error(
        "Failed to delete audit log:",
        err
      );

      const message =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        err?.message ||
        "Failed to delete audit log.";

      setError(message);

    } finally {
      setDeletingId(null);
    }
  };

  // ==========================================================
  // DATE FORMAT
  // ==========================================================

  const formatDate = (
    date?: string
  ): string => {
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

  // ==========================================================
  // ACTION BADGE
  // ==========================================================

  const getActionClass = (
    action: string
  ): string => {
    const value =
      action.toLowerCase();

    if (
      value.includes("create") ||
      value.includes("register") ||
      value.includes("enable") ||
      value.includes("assign")
    ) {
      return "bg-green-100 text-green-700";
    }

    if (
      value.includes("delete") ||
      value.includes("remove") ||
      value.includes("disable")
    ) {
      return "bg-red-100 text-red-700";
    }

    if (
      value.includes("update") ||
      value.includes("edit")
    ) {
      return "bg-blue-100 text-blue-700";
    }

    if (
      value.includes("login") ||
      value.includes("logout") ||
      value.includes("evaluate")
    ) {
      return "bg-purple-100 text-purple-700";
    }

    return "bg-gray-100 text-gray-700";
  };

  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">

        <div className="flex min-h-[500px] items-center justify-center">

          <div className="flex flex-col items-center gap-3">

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

            <p className="text-sm text-gray-500">
              Loading audit logs...
            </p>

          </div>

        </div>

      </div>
    );
  }

  // ==========================================================
  // MAIN UI
  // ==========================================================

  return (
    <div className="space-y-6">

      {/* ======================================================
          PAGE HEADER
      ======================================================= */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <div>

          <h1 className="text-2xl font-bold text-gray-900">
            Audit Logs
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Track system activities and user actions.
          </p>

        </div>

        <button
          type="button"
          onClick={fetchAuditLogs}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50"
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
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>

          Refresh
        </button>

      </div>

      {/* ======================================================
          ERROR
      ======================================================= */}

      {error && (
        <div className="flex items-start justify-between gap-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3">

          <div className="flex items-start gap-3">

            <svg
              className="mt-0.5 h-5 w-5 shrink-0 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01M10.29 3.86l-7.5 13A2 2 0 003.66 18h16.68a2 2 0 001.74-1l-7.5-13a2 2 0 00-3.48 0l-7.5-13a2 2 0 00-3.48 0z"
              />
            </svg>

            <p className="text-sm text-red-700">
              {error}
            </p>

          </div>

          <button
            type="button"
            onClick={() =>
              setError("")
            }
            className="text-red-500 transition hover:text-red-700"
          >
            ×
          </button>

        </div>
      )}

      {/* ======================================================
          TABLE CARD
      ======================================================= */}

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

        {/* ====================================================
            TOOLBAR
        ===================================================== */}

        <div className="flex flex-col gap-4 border-b border-gray-200 p-5 md:flex-row md:items-center md:justify-between">

          <div className="relative w-full md:max-w-md">

            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">

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
              className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-11 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />

          </div>

          <div className="text-sm text-gray-500">

            Total Logs:{" "}

            <span className="font-semibold text-gray-700">
              {auditLogs.length}
            </span>

          </div>

        </div>

        {/* ====================================================
            EMPTY STATE
        ===================================================== */}

        {filteredAuditLogs.length === 0 ? (
          <div className="flex min-h-[400px] flex-col items-center justify-center px-6 text-center">

            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100">

              <svg
                className="h-8 w-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>

            </div>

            <h3 className="mt-4 text-lg font-semibold text-gray-900">

              {search
                ? "No audit logs found"
                : "No audit logs available"}

            </h3>

            <p className="mt-1 max-w-md text-sm text-gray-500">

              {search
                ? "Try changing your search criteria."
                : "System activity will appear here when actions are performed."}

            </p>

            {search && (
              <button
                type="button"
                onClick={() =>
                  setSearch("")
                }
                className="mt-5 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Clear Search
              </button>
            )}

          </div>
        ) : (

          /* ==================================================
             TABLE
          =================================================== */

          <div className="overflow-x-auto">

            <table className="min-w-full divide-y divide-gray-200">

              <thead className="bg-gray-50">

                <tr>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Log
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    User
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Action
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Resource
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Description
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Date
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody className="divide-y divide-gray-100 bg-white">

                {filteredAuditLogs.map(
                  (log) => {

                    const userName =
                      log.user?.name ||
                      (log.user_id
                        ? `User #${log.user_id}`
                        : "-");

                    const userEmail =
                      log.user?.email;

                    const resource =
                      log.resource_type ||
                      "-";

                    const resourceId =
                      log.resource_id;

                    return (
                      <tr
                        key={log.id}
                        className="transition hover:bg-gray-50"
                      >

                        {/* LOG */}

                        <td className="whitespace-nowrap px-6 py-5">

                          <div className="flex items-center gap-3">

                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100">

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
                                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                              </svg>

                            </div>

                            <div>

                              <p className="text-sm font-semibold text-gray-900">
                                Audit Log #{log.id}
                              </p>

                              <p className="mt-0.5 text-xs text-gray-400">
                                ID: {log.id}
                              </p>

                            </div>

                          </div>

                        </td>

                        {/* USER */}

                        <td className="px-6 py-5">

                          <div className="flex items-center gap-3">

                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-purple-100 text-sm font-bold text-purple-600">

                              {userName
                                .charAt(0)
                                .toUpperCase()}

                            </div>

                            <div className="min-w-0">

                              <p className="truncate text-sm font-semibold text-gray-900">
                                {userName}
                              </p>

                              {userEmail && (
                                <p className="max-w-[180px] truncate text-xs text-gray-500">
                                  {userEmail}
                                </p>
                              )}

                              {log.user?.role && (
                                <span className="mt-1 inline-flex rounded-md bg-gray-100 px-2 py-0.5 text-[10px] font-semibold text-gray-600">
                                  {log.user.role}
                                </span>
                              )}

                            </div>

                          </div>

                        </td>

                        {/* ACTION */}

                        <td className="whitespace-nowrap px-6 py-5">

                          <span
                            className={`inline-flex rounded-lg px-3 py-1.5 text-xs font-semibold ${getActionClass(
                              log.action
                            )}`}
                          >
                            {log.action}
                          </span>

                        </td>

                        {/* RESOURCE */}

                        <td className="px-6 py-5">

                          <p className="text-sm font-semibold text-gray-800">
                            {resource}
                          </p>

                          {resourceId !==
                            undefined && (
                            <p className="mt-1 text-xs text-gray-400">
                              ID: {resourceId}
                            </p>
                          )}

                        </td>

                        {/* DESCRIPTION */}

                        <td className="max-w-[350px] px-6 py-5">

                          <p className="truncate text-sm text-gray-600">
                            {log.description ||
                              "-"}
                          </p>

                        </td>

                        {/* DATE */}

                        <td className="whitespace-nowrap px-6 py-5">

                          <p className="text-sm text-gray-600">
                            {formatDate(
                              log.created_at
                            )}
                          </p>

                        </td>

                        {/* ACTIONS */}

                        <td className="whitespace-nowrap px-6 py-5">

                          <div className="flex items-center justify-end gap-2">

                            <button
                              type="button"
                              title="Delete audit log"
                              onClick={() =>
                                handleDelete(
                                  log
                                )
                              }
                              disabled={
                                deletingId ===
                                log.id
                              }
                              className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                            >

                              {deletingId ===
                              log.id ? (
                                <svg
                                  className="h-4 w-4 animate-spin"
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
                              ) : (
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
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3m-9 0h14"
                                  />
                                </svg>
                              )}

                            </button>

                          </div>

                        </td>

                      </tr>
                    );
                  }
                )}

              </tbody>

            </table>

          </div>
        )}

        {/* ====================================================
            FOOTER
        ===================================================== */}

        {filteredAuditLogs.length >
          0 && (
          <div className="flex flex-col gap-2 border-t border-gray-200 bg-gray-50 px-6 py-4 text-sm sm:flex-row sm:items-center sm:justify-between">

            <p className="text-gray-500">

              Showing{" "}

              <span className="font-semibold text-gray-700">
                {filteredAuditLogs.length}
              </span>{" "}

              of{" "}

              <span className="font-semibold text-gray-700">
                {auditLogs.length}
              </span>{" "}

              audit logs

            </p>

            {search && (
              <button
                type="button"
                onClick={() =>
                  setSearch("")
                }
                className="font-medium text-blue-600 hover:text-blue-700"
              >
                Clear search
              </button>
            )}

          </div>
        )}

      </div>

    </div>
  );
};

export default AuditLogs;

