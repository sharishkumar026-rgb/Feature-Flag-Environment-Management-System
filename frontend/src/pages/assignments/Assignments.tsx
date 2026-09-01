
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import AssignmentTable from "../../components/assignments/AssignmentTable";
import AssignmentForm from "../../components/assignments/AssignmentForm";

import {
  getAssignments,
  deleteAssignment,
} from "../../api/assignmentApi";

// ============================================================
// TYPES
// ============================================================

export interface Assignment {
  id: number;

  user_id: number;
  feature_id: number;

  environment_id?: number;

  is_enabled?: boolean;
  is_active?: boolean;

  value?: string | boolean | number | null;

  user_name?: string;
  user_email?: string;

  feature_name?: string;
  feature_key?: string;

  environment_name?: string;
  environment_key?: string;

  created_by_id?: number;

  created_at?: string;
  updated_at?: string;

  user?: {
    id?: number;
    name?: string;
    email?: string;
    role?: string;
  };

  feature?: {
    id?: number;
    name?: string;
    key?: string;
  };

  environment?: {
    id?: number;
    name?: string;
    key?: string;
  };

  created_by?: {
    id?: number;
    name?: string;
    email?: string;
    role?: string;
  };
}

// ============================================================
// API RESPONSE
// ============================================================

interface AssignmentListResponse {
  success?: boolean;
  message?: string;

  assignments?: Assignment[];

  data?:
    | Assignment[]
    | {
        assignments?: Assignment[];
      };
}

// ============================================================
// COMPONENT
// ============================================================

const Assignments: React.FC = () => {
  const navigate = useNavigate();

  const [assignments, setAssignments] = useState<
    Assignment[]
  >([]);

  const [loading, setLoading] =
    useState<boolean>(false);

  const [error, setError] =
    useState<string>("");

  const [showForm, setShowForm] =
    useState<boolean>(false);

  const [selectedAssignment, setSelectedAssignment] =
    useState<Assignment | null>(null);

  // ==========================================================
  // LOAD ASSIGNMENTS
  // ==========================================================

  const loadAssignments =
    async (): Promise<void> => {
      try {
        setLoading(true);
        setError("");

        const response =
          (await getAssignments()) as AssignmentListResponse;

        console.log(
          "Assignments API response:",
          response
        );

        let assignmentData: Assignment[] = [];

        // ------------------------------------------------------
        // { assignments: [...] }
        // ------------------------------------------------------

        if (
          response &&
          Array.isArray(
            response.assignments
          )
        ) {
          assignmentData =
            response.assignments;
        }

        // ------------------------------------------------------
        // { data: [...] }
        // ------------------------------------------------------

        else if (
          response &&
          Array.isArray(response.data)
        ) {
          assignmentData =
            response.data;
        }

        // ------------------------------------------------------
        // { data: { assignments: [...] } }
        // ------------------------------------------------------

        else if (
          response &&
          response.data &&
          !Array.isArray(response.data) &&
          Array.isArray(
            response.data.assignments
          )
        ) {
          assignmentData =
            response.data.assignments;
        }

        // ------------------------------------------------------
        // EMPTY
        // ------------------------------------------------------

        else {
          assignmentData = [];
        }

        setAssignments(assignmentData);
      } catch (err: any) {
        console.error(
          "Failed to load assignments:",
          err
        );

        const message =
          err?.response?.data?.detail ||
          err?.response?.data?.message ||
          err?.message ||
          "Failed to load assignments.";

        setError(message);
      } finally {
        setLoading(false);
      }
    };

  // ==========================================================
  // INITIAL LOAD
  // ==========================================================

  useEffect(() => {
    loadAssignments();
  }, []);

  // ==========================================================
  // ADD
  // ==========================================================

  const handleAddAssignment =
    (): void => {
      setSelectedAssignment(null);
      setShowForm(true);
      setError("");
    };

  // ==========================================================
  // EDIT
  // ==========================================================

  const handleEditAssignment =
    (assignment: Assignment): void => {
      setSelectedAssignment(
        assignment
      );

      setShowForm(true);
      setError("");
    };

  // ==========================================================
  // VIEW
  // ==========================================================

  const handleViewAssignment =
    (assignment: Assignment): void => {
      navigate(
        `/assignments/${assignment.id}`
      );
    };

  // ==========================================================
  // DELETE
  // ==========================================================

  const handleDeleteAssignment =
    async (
      assignment: Assignment
    ): Promise<void> => {
      const confirmed =
        window.confirm(
          `Are you sure you want to delete assignment #${assignment.id}?`
        );

      if (!confirmed) {
        return;
      }

      try {
        setError("");

        await deleteAssignment(
          assignment.id
        );

        await loadAssignments();
      } catch (err: any) {
        console.error(
          "Failed to delete assignment:",
          err
        );

        const message =
          err?.response?.data?.detail ||
          err?.response?.data?.message ||
          err?.message ||
          "Failed to delete assignment.";

        setError(message);
      }
    };

  // ==========================================================
  // FORM SUCCESS
  // ==========================================================

  const handleFormSuccess =
    async (): Promise<void> => {
      setShowForm(false);
      setSelectedAssignment(null);

      await loadAssignments();
    };

  // ==========================================================
  // FORM CANCEL
  // ==========================================================

  const handleFormCancel =
    (): void => {
      setShowForm(false);
      setSelectedAssignment(null);
      setError("");
    };

  // ==========================================================
  // BACKDROP
  // ==========================================================

  const handleBackdropClick =
    (
      event: React.MouseEvent<HTMLDivElement>
    ): void => {
      if (
        event.target ===
        event.currentTarget
      ) {
        handleFormCancel();
      }
    };

  // ==========================================================
  // UI
  // ==========================================================

  return (
    <div className="space-y-6">

      {/* ======================================================
          HEADER
      ======================================================= */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            User Assignments
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage feature flag assignments for users and environments.
          </p>
        </div>

        <button
          type="button"
          onClick={
            handleAddAssignment
          }
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100"
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
              d="M12 4v16m8-8H4"
            />
          </svg>

          Add Assignment
        </button>

      </div>

      {/* ======================================================
          ERROR
      ======================================================= */}

      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3">

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
              d="M12 9v2m0 4h.01M10.29 3.86l-7.5 13A2 2 0 003.66 18h16.68a2 2 0 001.74-1l-7.5-13a2 2 0 00-3.48 0z"
            />
          </svg>

          <div className="flex-1">
            <p className="text-sm font-medium text-red-800">
              {error}
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              setError("")
            }
            className="text-red-500 transition hover:text-red-700"
            aria-label="Close error"
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

        </div>
      )}

      {/* ======================================================
          TABLE
      ======================================================= */}

      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">

        <AssignmentTable
          assignments={assignments}
          loading={loading}
          onEdit={
            handleEditAssignment
          }
          onDelete={
            handleDeleteAssignment
          }
          onView={
            handleViewAssignment
          }
          onCreate={
            handleAddAssignment
          }
        />

      </div>

      {/* ======================================================
          FORM MODAL
      ======================================================= */}

      {showForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onMouseDown={
            handleBackdropClick
          }
        >

          <div
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
            onMouseDown={(event) =>
              event.stopPropagation()
            }
          >

            <AssignmentForm
              assignment={
                selectedAssignment ??
                undefined
              }
              onSuccess={
                handleFormSuccess
              }
              onCancel={
                handleFormCancel
              }
            />

          </div>

        </div>
      )}

    </div>
  );
};

export default Assignments;
