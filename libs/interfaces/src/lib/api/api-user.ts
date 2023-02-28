export interface IApiAuthStatus {
  userId?: string;
  userRole?: string;
  authSuccess: boolean;
  authErrorType?: ApiAuthError;
}

export enum ApiAuthError {
  UNAUTHORIZED = 'UNAUTHORIZED',
  EXPIRED = 'EXPIRED',
}
