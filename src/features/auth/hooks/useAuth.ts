import { useCallback, useRef } from 'react';
import { RootState } from '../../../store/store';
import { 
  setAuthError, 
  clearError as clearAuthError,
  forgotPasswordThunk,
  googleLoginThunk,
  linkGoogleThunk,
  loginThunk,
  logoutThunk,
  sendEmailVerificationThunk,
  signupThunk, 
  verifyOtpThunk,
} from '../authSlice';
import { useNetInfo } from '@react-native-community/netinfo';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { authService } from '../services/authService';

const SUBMIT_GUARD_MS = 700;

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { user, accessToken, refreshToken, loading, error, isInitialized } = useAppSelector((state: RootState) => state.auth);
  const netInfo = useNetInfo();
  const lastSubmitRef = useRef(0);

  const canSubmit = useCallback(() => {
    const now = Date.now();
    if (now - lastSubmitRef.current < SUBMIT_GUARD_MS) {
      return false;
    }
    lastSubmitRef.current = now;
    return true;
  }, []);

  const checkNetwork = useCallback(() => {
    if (netInfo.isConnected === false) {
      dispatch(setAuthError('No internet connection'));
      return false;
    }
    return true;
  }, [netInfo.isConnected, dispatch]);

  const login = useCallback(async (email: string, pass: string) => {
    if (!checkNetwork() || !canSubmit()) return;

    await dispatch(loginThunk({ email: email.trim().toLowerCase(), password: pass })).unwrap();
  }, [dispatch, checkNetwork, canSubmit]);

  const signup = useCallback(async (name: string, email: string, pass: string) => {
    if (!checkNetwork() || !canSubmit()) return;

    await dispatch(
      signupThunk({ name: name.trim(), email: email.trim().toLowerCase(), password: pass })
    ).unwrap();
  }, [dispatch, checkNetwork, canSubmit]);

  const logout = useCallback(async () => {
    if (!canSubmit()) return;
    try {
      await dispatch(logoutThunk()).unwrap();
    } catch (err) {
      // Keep UI responsive; errors are already in redux state.
    }
  }, [dispatch, canSubmit]);

  const forgotPassword = useCallback(async (email: string) => {
    if (!checkNetwork() || !canSubmit()) return;
    await dispatch(forgotPasswordThunk({ email: email.trim().toLowerCase() })).unwrap();
  }, [dispatch, checkNetwork, canSubmit]);

  const loginWithGoogle = useCallback(async (idToken: string) => {
    if (!checkNetwork() || !canSubmit()) return;
    await dispatch(googleLoginThunk({ idToken })).unwrap();
  }, [dispatch, checkNetwork, canSubmit]);

  const requestPhoneOtp = useCallback(async (phoneNumber: string, appVerifier: unknown) => {
    if (!checkNetwork() || !canSubmit()) return null;
    try {
      return await authService.requestPhoneOtp(phoneNumber, appVerifier);
    } catch (error) {
      const message = authService.getErrorMessage(error);
      dispatch(setAuthError(message));
      throw error;
    }
  }, [dispatch, checkNetwork, canSubmit]);

  const verifyPhoneOtp = useCallback(async (verificationId: string, code: string) => {
    if (!checkNetwork() || !canSubmit()) return;
    await dispatch(verifyOtpThunk({ verificationId, code })).unwrap();
  }, [dispatch, checkNetwork, canSubmit]);

  const sendEmailVerification = useCallback(async () => {
    if (!checkNetwork() || !canSubmit()) return;
    await dispatch(sendEmailVerificationThunk()).unwrap();
  }, [dispatch, checkNetwork, canSubmit]);

  const linkGoogleAccount = useCallback(async (idToken: string) => {
    if (!checkNetwork() || !canSubmit()) return;
    await dispatch(linkGoogleThunk({ idToken })).unwrap();
  }, [dispatch, checkNetwork, canSubmit]);

  const clearError = useCallback(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  return {
    user,
    accessToken,
    refreshToken,
    loading,
    error,
    isInitialized,
    login,
    signup,
    logout,
    forgotPassword,
    loginWithGoogle,
    requestPhoneOtp,
    verifyPhoneOtp,
    sendEmailVerification,
    linkGoogleAccount,
    clearError,
    isConnected: netInfo.isConnected
  };
};
