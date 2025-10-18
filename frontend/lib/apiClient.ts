// import { RegisterUser } from "./types/user";

import { LogoutResponse } from "./types/user";

// const BACKEND_BASE_URL =
//   process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:5000/api/v1";

// export async function apiClient(data: RegisterUser, url: string) {
//   const response = await fetch(`${BACKEND_BASE_URL}${url}`, {
//     method: "POST",
//     body: JSON.stringify(data),
//     credentials: "include",
//     headers: {
//       "Content-Type": "application/json",
//     },
//   });

//   if (!response.ok) {
//     throw new Error(`API Error: ${response.statusText}`);
//   }

//   const result = await response.json();
//   console.log(result);
//   return result;
// }

const API_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:5000/api/v1";

class ApiClient {
  private baseURL: string;
  private token: string | null = null;
  private isRefreshingToken = false;
  private refreshTokenPromise: Promise<string> | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  setToken(token: string | null) {
    this.token = token;
  }

  private async refreshToken(): Promise<string> {
    // If already refreshing, return the existing promise
    if (this.isRefreshingToken && this.refreshTokenPromise) {
      return this.refreshTokenPromise;
    }

    this.isRefreshingToken = true;

    // Create a promise for the refresh operation
    this.refreshTokenPromise = (async () => {
      try {
        const response = await fetch(`${this.baseURL}/auth/refresh-token`, {
          method: "POST",
          credentials: "include", // Important: sends the httpOnly refresh token cookie
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Token refresh failed");
        }

        const data = await response.json();
        const newAccessToken = data.accessToken;

        // Update the token
        this.setToken(newAccessToken);

        return newAccessToken;
      } catch (error) {
        throw error;
      } finally {
        this.isRefreshingToken = false;
        this.refreshTokenPromise = null;
      }
    })();

    return this.refreshTokenPromise;
  }

  private isAuthEndpoint(endpoint: string): boolean {
    // List of endpoints that should NOT trigger token refresh
    const authEndpoints = [
      "/auth/login",
      "/auth/register",
      "/auth/refresh-token",
      "/auth/forgot-password",
      "/auth/reset-password",
      "/auth/verify-email",
    ];

    return authEndpoints.some((authEndpoint) =>
      endpoint.startsWith(authEndpoint)
    );
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    retryCount = 0
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }

    const config: RequestInit = {
      ...options,
      headers,
      credentials: "include",
    };

    try {
      const response = await fetch(url, config);

      // Handle 401 Unauthorized - Try to refresh token
      if (response.status === 401 && retryCount === 0) {
        // Don't attempt refresh for auth endpoints or if we don't have a token
        if (this.isAuthEndpoint(endpoint) || !this.token) {
          const errorData = await response.json().catch(() => ({}));
          throw {
            statusCode: 401,
            message: errorData.message || "Unauthorized",
          };
        }

        try {
          // Attempt to refresh the token
          await this.refreshToken();

          // Retry the original request with the new token
          return this.request<T>(endpoint, options, retryCount + 1);
        } catch (refreshError) {
          // Refresh failed - throw 401 to trigger logout
          throw {
            statusCode: 401,
            message: "Session expired. Please login again.",
          };
        }
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw {
          statusCode: response.status,
          message: errorData.message || "An API error occurred",
        };
      }

      return await response.json();
    } catch (error: any) {
      // If it's already our formatted error, throw it
      if (error.statusCode) {
        throw error;
      }
      // Otherwise, wrap it
      throw {
        statusCode: 500,
        message: error.message || "Network error occurred",
      };
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: "GET",
    });
  }

  async post<T, D = unknown>(endpoint: string, data?: D): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T, D = unknown>(endpoint: string, data?: D): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: "DELETE",
    });
  }

  // special method for logout that includes credentials to send httpOnly cookie
  async logout(): Promise<LogoutResponse> {
    return this.request("/auth/logout", {
      method: "POST",
    });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
