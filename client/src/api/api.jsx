import axios from "axios";
import { store } from "@/store/store";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: BASE_URL,
});

// REQUEST INTERCEPTOR: Add Bearer token from store
api.interceptors.request.use((config) => {
  const state = store.getState();
  const accessToken = state.authStore?.accessToken;
  if (accessToken) {
    // Safer way to ensure headers exist and set the value
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

/* Single-flight refresh token helper (avoid multiple concurrent refresh calls) */
let refreshCall = null;

/**
 * Returns a promise that resolves with a new access token.
 * Ensures only one refresh request is in-flight at any time.
 *
 * It also clears the shared `refreshCall` when the request finishes so
 * future refresh attempts create a new request instead of reusing a
 * resolved/errored promise.
 */
const getRefreshedaccessToken = (refreshToken) => {
  if (!refreshCall) {
    refreshCall = axios
      .post(
        `${BASE_URL}/auth/refresh-token`,
        { refreshToken: refreshToken },
        { headers: { "Content-Type": "application/json" } },
      )
      .then((res) => {
        const data = res?.data ?? {};

        // Try multiple common shapes for the returned access token
        const newaccessToken =
          data.tokens?.accessToken ??
          data.data?.tokens?.accessToken ??
          data.accessToken ??
          data.token ??
          data.data?.access ??
          data.data?.accessToken ??
          data.data?.token ??
          null;

        if (!newaccessToken) {
          // If the response didn't include an access token, treat it as a failure
          throw new Error("Refresh endpoint did not return an access token");
        }

        // Derive refresh token if backend returned one; otherwise keep the existing refreshToken
        const newRefreshToken =
          data.tokens?.refreshToken ??
          data.data?.tokens?.refreshToken ??
          data.refresh ??
          data.refreshToken ??
          refreshToken;

        // Update store tokens (using plain action payload to avoid circular imports)
        const state = store.getState();
        store.dispatch({
          type: "auth/login",
          payload: {
            user: state.authStore.user,
            accessToken: newaccessToken,
            refreshToken: newRefreshToken,
          },
        });

        return newaccessToken;
      })
      .catch((err) => {
        // On refresh failure, force a logout (clear entire auth state)
        store.dispatch({ type: "auth/logout" });
        // Propagate the error to callers
        throw err;
      })
      .finally(() => {
        // Always clear the shared promise when done so subsequent refreshes create a fresh request
        refreshCall = null;
      });
  }
  return refreshCall;
};

// RESPONSE INTERCEPTOR: Handle 401, refresh token, retry original request
api.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error?.config;
    const state = store.getState();
    const refreshToken = state.authStore?.refreshToken;

    // Only attempt refresh on 401 and when refresh token exists and this request hasn't been retried
    const isRefreshRequest = originalRequest?.url?.includes(
      "/auth/refresh-token",
    );
    if (
      error.response &&
      error.response.status === 401 &&
      refreshToken &&
      originalRequest &&
      !originalRequest._retry &&
      !isRefreshRequest
    ) {
      originalRequest._retry = true;
      try {
        // Use single-flight refresh helper
        const newaccessToken = await getRefreshedaccessToken(refreshToken);
        // Clear the shared refreshCall so future 401s can trigger a new refresh when needed
        refreshCall = null;

        // Attach the new token and retry the original request
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${newaccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // refresh failed and logout has been dispatched in helper
        refreshCall = null;
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

// Attach BASE_URL to the default export so callers can access it without a named export
api.BASE_URL = BASE_URL;

export default api;
