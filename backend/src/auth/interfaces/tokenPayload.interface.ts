export interface TokenPayload {
  sub: string;
  role: string;
  email?: string;
  iat?: number;
  exp?: number;
}
