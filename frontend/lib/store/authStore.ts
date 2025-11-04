import { create } from "zustand";
import { useShallow } from "zustand/shallow";
import { persist, devtools } from "zustand/middleware";
import {
  AuthResponse,
  AuthState,
  LoginUser,
  RegisterUser,
  User,
} from "../types/user";
import { apiClient } from "../apiClient";
import { storage } from "../storage";

interface AuthActions {
  // Authentication actions
  login: (data: LoginUser) => Promise<void>;
  register: (data: RegisterUser) => Promise<void>;
  logout: () => void;
  refreshAccessToken: () => Promise<void>;

  //User actions
  updateProfile: (userData: User) => Promise<void>;
  updateEmailVerificationStatus: (isVerified: boolean) => void;

  // State management actions
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setLoading: (loading: boolean) => void;
  initializeAuth: () => void;
  clearAuth: () => void;

  // Token Refresh Management
  scheduleTokenRefresh: () => void;
  cancelTokenRefresh: () => void;
}

type AuthStore = AuthState &
  AuthActions & {
    tokenExpiresAt: number | null;
    refreshTimerId: NodeJS.Timeout | null;
    isRefreshing: boolean;
  };

// calculate when the token expires (24 hours from now)
const getTokenExpirationTime = (): number => {
  return Date.now() + 24 * 60 * 60 * 1000; // 24 hours in milliseconds
};

function getTokenExpirationFromJWT(token: string): number | null {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000; // Convert to milliseconds
  } catch {
    return null;
  }
}

// Refresh token 5 minutes before it expires
const REFRESH_BEFORE_EXPIRY = 5 * 60 * 1000; // 5 minutes in milliseconds

export const useAuthStore = create<AuthStore>()(
  devtools(
    persist(
      (set, get) => ({
        // INITIAL STATE
        user: null,
        accessToken: null,
        isAuthenticated: false,
        isLoading: false,
        tokenExpiresAt: null,
        refreshTimerId: null,
        isRefreshing: false,

        // AUTHENTICATION ACTIONS
        login: async (data: LoginUser) => {
          try {
            set({ isLoading: true });

            const response = await apiClient.post<AuthResponse>(
              "/auth/login",
              data
            );

            const { user, accessToken } = response;
            console.log(user);
            const expiresAt =
              getTokenExpirationFromJWT(accessToken) ||
              getTokenExpirationTime();

            // set the token in the api request headers authorization so that it always sends it to the backend when sending a request.
            apiClient.setToken(accessToken);

            // update the local ui store state
            set({
              user,
              accessToken,
              isAuthenticated: true,
              isLoading: false,
              tokenExpiresAt: expiresAt,
            });

            // persist token to local storage and cookie for middleware usage
            storage.setToken(accessToken);

            // persist user to local storage
            storage.setUser(user);

            // persist expires at to local storage
            storage.setTokenExpiry(expiresAt);

            // schedule automatic token refresh
            get().scheduleTokenRefresh();
          } catch (error) {
            set({ isLoading: false });
            throw error;
          }
        },
        register: async (data: RegisterUser) => {
          try {
            set({ isLoading: true });

            const { user, accessToken } = await apiClient.post<AuthResponse>(
              "/auth/register",
              data
            );

            const expiresAt =
              getTokenExpirationFromJWT(accessToken) ||
              getTokenExpirationTime();

            apiClient.setToken(accessToken);

            set({
              user,
              accessToken,
              isAuthenticated: true,
              isLoading: false,
              tokenExpiresAt: expiresAt,
            });

            storage.setToken(accessToken);
            storage.setUser(user);
            storage.setTokenExpiry(expiresAt);

            // Schedule automatic token refresh
            get().scheduleTokenRefresh();
          } catch (error) {
            set({ isLoading: false });
            throw error;
          }
        },
        logout: () => {
          // cancel any scheduled refresh
          get().cancelTokenRefresh();

          set({
            user: null,
            accessToken: null,
            isAuthenticated: false,
            isLoading: false,
            tokenExpiresAt: null,
            refreshTimerId: null,
          });
          apiClient.setToken(null);
          storage.clear();
        },
        refreshAccessToken: async () => {
          const state = get();

          // prevent multiple simultaneous refresh attempts
          if (state.isRefreshing) {
            return;
          }

          try {
            set({ isRefreshing: true });

            const currentToken = state.accessToken;

            if (!currentToken) {
              throw new Error("No token available");
            }

            const response = await apiClient.post<AuthResponse>(
              "/auth/refresh-token"
            );

            const { accessToken, user } = response;
            const expiresAt = getTokenExpirationTime();

            apiClient.setToken(accessToken);

            set({
              user,
              accessToken,
              isAuthenticated: true,
              tokenExpiresAt: expiresAt,
              isRefreshing: false,
            });

            storage.setToken(accessToken);
            storage.setUser(user);
            storage.setTokenExpiry(expiresAt);

            // Schedule next refresh
            get().scheduleTokenRefresh();
          } catch (error) {
            get().logout();
            throw error;
          }
        },

        // SCHEDULE AUTOMATIC TOKEN REFRESH
        scheduleTokenRefresh: () => {
          const state = get();

          // Cancel any existing timer
          if (state.refreshTimerId) {
            clearTimeout(state.refreshTimerId);
          }

          const expiresAt = state.tokenExpiresAt;

          if (!expiresAt) return;

          // Calculate when to refresh (5 minutes before expiry)
          const refreshAt = expiresAt - REFRESH_BEFORE_EXPIRY;
          const delay = refreshAt - Date.now();

          // Only schedule if the delay is positive
          if (delay > 0) {
            const timerId = setTimeout(() => {
              get().refreshAccessToken();
            }, delay);

            set({ refreshTimerId: timerId });
          } else {
            // Token is already expired or about to expire, refresh immediately
            get().refreshAccessToken();
          }
        },

        // Cancel scheduled token refresh
        cancelTokenRefresh: () => {
          const state = get();
          if (state.refreshTimerId) {
            clearTimeout(state.refreshTimerId);
            set({ refreshTimerId: null });
          }
        },

        // USER ACTIONS
        updateProfile: async (user: User) => {
          try {
            set({ isLoading: true });

            set({
              user,
              isLoading: false,
            });

            storage.setUser(user);
          } catch (error) {
            set({ isLoading: false });
            throw error;
          }
        },

        // NEW: Update email verification status
        updateEmailVerificationStatus: (isVerified: boolean) => {
          const currentUser = get().user;

          if (currentUser) {
            const updatedUser = {
              ...currentUser,
              isEmailVerified: isVerified,
            };

            set({ user: updatedUser });
            storage.setUser(updatedUser);
          }
        },

        // STATE MANAGEMENT ACTIONS
        setUser: (user: User | null) => {
          set({ user, isAuthenticated: !!user });
        },
        setToken: (accessToken: string | null) => {
          set({ accessToken });
          apiClient.setToken(accessToken);
        },
        setLoading: (loading: boolean) => {
          set({ isLoading: loading });
        },
        initializeAuth: () => {
          // Get the persisted data from localstorage
          const accessToken = storage.getToken();
          const user = storage.getUser();
          const tokenExpiresAt = storage.getTokenExpiry();

          if (accessToken && user && tokenExpiresAt) {
            // check if token is still valid
            if (tokenExpiresAt > Date.now()) {
              apiClient.setToken(accessToken);

              set({
                user,
                accessToken,
                isAuthenticated: true,
                tokenExpiresAt,
              });

              // Schedule token refresh
              get().scheduleTokenRefresh();
            } else {
              // Token expired, try to refresh
              get()
                .refreshAccessToken()
                .catch(() => {
                  // If refresh fails, clear auth
                  storage.clear();
                });
            }
          }
        },
        clearAuth: () => {
          get().cancelTokenRefresh();

          set({
            user: null,
            accessToken: null,
            isAuthenticated: false,
            isLoading: false,
            tokenExpiresAt: null,
            refreshTimerId: null,
          });
          apiClient.setToken(null);
          storage.clear();
        },
      }),
      {
        name: "AuthStore",
        partialize: (state) => ({
          user: state.user,
          accessToken: state.accessToken,
          isAuthenticated: state.isAuthenticated,
          tokenExpiresAt: state.tokenExpiresAt,
        }),
      }
    ),
    { name: "AuthStore" }
  )
);

// SELECTORS FOR OPTIMIZED RE-RENDERS
export const useAuthState = () =>
  useAuthStore(
    useShallow((state) => ({
      user: state.user,
      accessToken: state.accessToken,
      isAuthenticated: state.isAuthenticated,
      isLoading: state.isLoading,
      isRefreshing: state.isRefreshing,
    }))
  );

export const useAuthActions = () =>
  useAuthStore((state) => ({
    login: state.login,
    register: state.register,
    logout: state.logout,
    refreshAccessToken: state.refreshAccessToken,
    updateProfile: state.updateProfile,
    updateEmailVerificationStatus: state.updateEmailVerificationStatus, // NEW
    initializeAuth: state.initializeAuth,
    clearAuth: state.clearAuth,
  }));
