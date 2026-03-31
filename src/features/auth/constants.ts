export const AUTH_STORAGE_KEY = 'faithframes.auth';

export interface AuthSession {
  isAuthenticated: boolean;
  hasOnboarded: boolean;
}

export const defaultAuthSession: AuthSession = {
  isAuthenticated: false,
  hasOnboarded: false,
};
