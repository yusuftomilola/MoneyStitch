const AUTH_TOKEN_KEY = "authToken";
const AUTH_USER_KEY = "authUser";
const AUTH_TOKEN_EXPIRY_KEY = "authTokenExpiry";

export const storage = {
  // [1] A WAY OF WRITING A METHOD/FUNCTION PROPERTY INSIDE AN OBJECT
  //   getToken: function (): string | null {
  //     if (typeof window === "undefined") null;
  //     return localStorage.getItem(AUTH_TOKEN_KEY);
  //   },

  // [2] A SHORTHAND WAY OF WRITING A METHOD/FUNCTION PROPERTY INSIDE AN OBJECT
  getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(AUTH_TOKEN_KEY);
  },

  setToken(token: string): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    // set the token to cookie as well for middleware access
    document.cookie = `authToken=${token}; path=/; max-age=${1 * 24 * 60 * 60}`; // 1 day - Access Token
  },

  removeToken(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(AUTH_TOKEN_KEY);
    document.cookie = `authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT`;
  },

  getUser(): any | null {
    if (typeof window === "undefined") return null;
    const user = localStorage.getItem(AUTH_USER_KEY);
    return user ? JSON.parse(user) : null;
  },

  setUser(user: any): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
  },

  removeUser(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(AUTH_USER_KEY);
  },

  // Token expiry management
  getTokenExpiry(): number | null {
    if (typeof window === "undefined") return null;
    const expiry = localStorage.getItem(AUTH_TOKEN_EXPIRY_KEY);
    return expiry ? parseInt(expiry, 10) : null;
  },

  setTokenExpiry(expiresAt: number): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(AUTH_TOKEN_EXPIRY_KEY, expiresAt.toString());
  },

  removeTokenExpiry(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(AUTH_TOKEN_EXPIRY_KEY);
  },

  clear(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
    localStorage.removeItem(AUTH_TOKEN_EXPIRY_KEY);
    document.cookie = `authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT`;
  },

  setPofilePic(imageUrl: string): void {
    if (typeof window === "undefined") return;
    localStorage.setItem("userProfilePic", imageUrl);
  },
};
