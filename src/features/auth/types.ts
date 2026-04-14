export interface User {
  id: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
  role: 'admin' | 'user';
  providers: string[];
  phoneNumber: string | null;
}

export interface AuthTokens {
  accessToken: string | null;
  refreshToken: string | null;
}

export interface AuthRequestState {
  login: boolean;
  signup: boolean;
  google: boolean;
  phone: boolean;
  verifyOtp: boolean;
  forgotPassword: boolean;
  sendEmailVerification: boolean;
  linkGoogle: boolean;
  logout: boolean;
  bootstrap: boolean;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  loading: AuthRequestState;
  error: string | null;
  isInitialized: boolean;
}

export type AuthError = {
  code: string;
  message: string;
};

export interface AuthSuccessPayload {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
}
