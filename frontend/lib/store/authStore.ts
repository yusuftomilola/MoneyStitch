import { create } from "zustand";
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
  refreshToken: () => Promise<void>;

  //User actions
  updateProfile: (userData: Partial<User>) => Promise<void>;

  // State management actions
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setLoading: (loading: boolean) => void;
  initializeAuth: () => void;
  clearAuth: () => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  devtools(
    persist(
      (set, get) => ({
        // INITIAL STATE
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,

        // AUTHENTICATION ACTIONS
        login: async (data: LoginUser) => {
          try {
            set({ isLoading: true });

            const response = await apiClient.post<AuthResponse>(
              "/auth/login",
              data
            );

            const { user, token } = response;

            // set the token in the api request headers authorization so that it always sends it to the backend when sending a request.
            apiClient.setToken(token);

            // update the local ui store state
            set({
              user,
              token,
              isAuthenticated: true,
              isLoading: false,
            });

            // persist token to local storage and cookie for middleware usage
            storage.setToken(token);

            // persist user to local storage
            storage.setUser(user);
          } catch (error) {
            set({ isLoading: false });
            throw error;
          }
        },
        register: async (data: RegisterUser) => {
          try {
            set({ isLoading: true });

            const { user, token } = await apiClient.post<AuthResponse>(
              "/auth/register",
              data
            );

            apiClient.setToken(token);

            set({
              user,
              token,
              isAuthenticated: true,
              isLoading: false,
            });

            storage.setToken(token);
            storage.setUser(user);
          } catch (error) {
            set({ isLoading: false });
            throw error;
          }
        },
        logout: () => {
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
          });
          apiClient.setToken(null);
          storage.clear();
        },
        refreshToken: async () => {
          try {
            const currentToken = get().token;

            if (!currentToken) {
              throw new Error("No token available");
            }

            const response = await apiClient.post<AuthResponse>(
              "/auth/refresh-token"
            );

            const { token, user } = response;

            apiClient.setToken(token);

            set({
              user,
              token,
              isAuthenticated: true,
            });

            storage.setToken(token);
            storage.setUser(user);
          } catch (error) {
            get().logout;
            throw error;
          }
        },

        // USER ACTIONS
        updateProfile: async (userData: Partial<User>) => {
          try {
            set({ isLoading: true });

            const user = await apiClient.patch<User>(
              "/users/profile",
              userData
            );

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

        // STATE MANAGEMENT ACTIONS
        setUser: (user: User | null) => {
          set({ user, isAuthenticated: !!user });
        },
        setToken: (token: string | null) => {
          set({ token });
          apiClient.setToken(token);
        },
        setLoading: (loading: boolean) => {
          set({ isLoading: loading });
        },
        initializeAuth: () => {
          // Get the persisted data from localstorage
          const token = storage.getToken();
          const user = storage.getUser();

          if (token && user) {
            apiClient.setToken(token);

            set({
              user,
              token,
              isAuthenticated: true,
            });
          }
        },
        clearAuth: () => {
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
          });
          apiClient.setToken(null);
          storage.clear();
        },
      }),
      {
        name: "AuthStore",
        partialize: (state) => ({
          user: state.user,
          token: state.token,
          isAuthenticated: state.isAuthenticated,
        }),
      }
    ),
    { name: "AuthStore" }
  )
);

// SELECTORS FOR OPTIMIZED RE-RENDERS
export const useAuthState = () =>
  useAuthStore((state) => ({
    user: state.user,
    token: state.token,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
  }));

export const useAuthActions = () =>
  useAuthStore((state) => ({
    login: state.login,
    register: state.register,
    logout: state.logout,
    refreshToken: state.refreshToken,
    updateProfile: state.updateProfile,
    initializeAuth: state.initializeAuth,
    clearAuth: state.clearAuth,
  }));
