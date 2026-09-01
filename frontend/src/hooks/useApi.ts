
import { useCallback, useState } from "react";
import api from "../api/axios";

// ============================================================
// TYPES
// ============================================================

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string;
}

interface UseApiReturn<T> extends UseApiState<T> {
  execute: (
    request: () => Promise<any>
  ) => Promise<T | null>;

  get: (
    url: string,
    config?: any
  ) => Promise<T | null>;

  post: (
    url: string,
    data?: any,
    config?: any
  ) => Promise<T | null>;

  put: (
    url: string,
    data?: any,
    config?: any
  ) => Promise<T | null>;

  patch: (
    url: string,
    data?: any,
    config?: any
  ) => Promise<T | null>;

  remove: (
    url: string,
    config?: any
  ) => Promise<T | null>;

  reset: () => void;
}

// ============================================================
// ERROR MESSAGE
// ============================================================

const getErrorMessage = (
  error: any
): string => {
  return (
    error?.response?.data?.detail ||
    error?.response?.data?.message ||
    error?.message ||
    "Something went wrong. Please try again."
  );
};

// ============================================================
// USE API HOOK
// ============================================================

const useApi = <T = any>(): UseApiReturn<T> => {
  const [data, setData] =
    useState<T | null>(null);

  const [loading, setLoading] =
    useState<boolean>(false);

  const [error, setError] =
    useState<string>("");

  // ==========================================================
  // EXECUTE
  // ==========================================================

  const execute = useCallback(
    async (
      request: () => Promise<any>
    ): Promise<T | null> => {
      try {
        setLoading(true);
        setError("");

        const response =
          await request();

        const responseData =
          response?.data ??
          response;

        setData(responseData);

        return responseData as T;
      } catch (err: any) {
        console.error(
          "API request failed:",
          err
        );

        const message =
          getErrorMessage(err);

        setError(message);

        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // ==========================================================
  // GET
  // ==========================================================

  const get = useCallback(
    async (
      url: string,
      config?: any
    ): Promise<T | null> => {
      return execute(() =>
        api.get(
          url,
          config
        )
      );
    },
    [execute]
  );

  // ==========================================================
  // POST
  // ==========================================================

  const post = useCallback(
    async (
      url: string,
      requestData?: any,
      config?: any
    ): Promise<T | null> => {
      return execute(() =>
        api.post(
          url,
          requestData,
          config
        )
      );
    },
    [execute]
  );

  // ==========================================================
  // PUT
  // ==========================================================

  const put = useCallback(
    async (
      url: string,
      requestData?: any,
      config?: any
    ): Promise<T | null> => {
      return execute(() =>
        api.put(
          url,
          requestData,
          config
        )
      );
    },
    [execute]
  );

  // ==========================================================
  // PATCH
  // ==========================================================

  const patch = useCallback(
    async (
      url: string,
      requestData?: any,
      config?: any
    ): Promise<T | null> => {
      return execute(() =>
        api.patch(
          url,
          requestData,
          config
        )
      );
    },
    [execute]
  );

  // ==========================================================
  // DELETE
  // ==========================================================

  const remove = useCallback(
    async (
      url: string,
      config?: any
    ): Promise<T | null> => {
      return execute(() =>
        api.delete(
          url,
          config
        )
      );
    },
    [execute]
  );

  // ==========================================================
  // RESET
  // ==========================================================

  const reset = useCallback(() => {
    setData(null);
    setLoading(false);
    setError("");
  }, []);

  // ==========================================================
  // RETURN
  // ==========================================================

  return {
    data,
    loading,
    error,

    execute,

    get,
    post,
    put,
    patch,
    remove,

    reset,
  };
};

export default useApi;

