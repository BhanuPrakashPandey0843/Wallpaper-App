import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState } from './types';
import { authService } from './services/authService';

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  loading: {
    login: false,
    signup: false,
    google: false,
    phone: false,
    verifyOtp: false,
    forgotPassword: false,
    sendEmailVerification: false,
    linkGoogle: false,
    logout: false,
    bootstrap: false,
  },
  error: null,
  isInitialized: false,
};

export const loginThunk = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }, thunkAPI) => {
    try {
      return await authService.login(email, password);
    } catch (error) {
      return thunkAPI.rejectWithValue(authService.getErrorMessage(error));
    }
  }
);

export const signupThunk = createAsyncThunk(
  'auth/signup',
  async ({ name, email, password }: { name: string; email: string; password: string }, thunkAPI) => {
    try {
      return await authService.signup(name, email, password);
    } catch (error) {
      return thunkAPI.rejectWithValue(authService.getErrorMessage(error));
    }
  }
);

export const forgotPasswordThunk = createAsyncThunk(
  'auth/forgotPassword',
  async ({ email }: { email: string }, thunkAPI) => {
    try {
      await authService.forgotPassword(email);
      return true;
    } catch (error) {
      return thunkAPI.rejectWithValue(authService.getErrorMessage(error));
    }
  }
);

export const googleLoginThunk = createAsyncThunk(
  'auth/googleLogin',
  async ({ idToken }: { idToken: string }, thunkAPI) => {
    try {
      return await authService.googleLogin(idToken);
    } catch (error) {
      return thunkAPI.rejectWithValue(authService.getErrorMessage(error));
    }
  }
);

export const sendOtpThunk = createAsyncThunk(
  'auth/sendOtp',
  async ({ phoneNumber }: { phoneNumber: string }, thunkAPI) => {
    try {
      return await authService.requestPhoneOtp(phoneNumber, null);
    } catch (error) {
      return thunkAPI.rejectWithValue(authService.getErrorMessage(error));
    }
  }
);

export const verifyOtpThunk = createAsyncThunk(
  'auth/verifyOtp',
  async ({ verificationId, code }: { verificationId: string; code: string }, thunkAPI) => {
    try {
      return await authService.verifyPhoneOtp(verificationId, code);
    } catch (error) {
      return thunkAPI.rejectWithValue(authService.getErrorMessage(error));
    }
  }
);

export const sendEmailVerificationThunk = createAsyncThunk('auth/sendEmailVerification', async (_, thunkAPI) => {
  try {
    await authService.sendEmailVerification();
    return true;
  } catch (error) {
    return thunkAPI.rejectWithValue(authService.getErrorMessage(error));
  }
});

export const linkGoogleThunk = createAsyncThunk(
  'auth/linkGoogle',
  async ({ idToken }: { idToken: string }, thunkAPI) => {
    try {
      return await authService.linkGoogleAccount(idToken);
    } catch (error) {
      return thunkAPI.rejectWithValue(authService.getErrorMessage(error));
    }
  }
);

export const logoutThunk = createAsyncThunk('auth/logout', async (_, thunkAPI) => {
  try {
    await authService.logout();
    return true;
  } catch (error) {
    return thunkAPI.rejectWithValue(authService.getErrorMessage(error));
  }
});

export const bootstrapAuthThunk = createAsyncThunk('auth/bootstrap', async (_, thunkAPI) => {
  try {
    return await authService.bootstrapSession();
  } catch (error) {
    return thunkAPI.rejectWithValue(authService.getErrorMessage(error));
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthSuccess: (state, action: PayloadAction<{ user: AuthState['user']; accessToken: string | null; refreshToken: string | null }>) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.error = null;
      state.isInitialized = true;
    },
    setAuthError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    logoutSuccess: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.error = null;
    },
    setInitialized: (state, action: PayloadAction<boolean>) => {
      state.isInitialized = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (state) => {
        state.loading.login = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.loading.login = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.isInitialized = true;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading.login = false;
        state.error = (action.payload as string) ?? 'Unable to login.';
      })
      .addCase(signupThunk.pending, (state) => {
        state.loading.signup = true;
        state.error = null;
      })
      .addCase(signupThunk.fulfilled, (state, action) => {
        state.loading.signup = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.isInitialized = true;
      })
      .addCase(signupThunk.rejected, (state, action) => {
        state.loading.signup = false;
        state.error = (action.payload as string) ?? 'Unable to create account.';
      })
      .addCase(googleLoginThunk.pending, (state) => {
        state.loading.google = true;
        state.error = null;
      })
      .addCase(googleLoginThunk.fulfilled, (state, action) => {
        state.loading.google = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.isInitialized = true;
      })
      .addCase(googleLoginThunk.rejected, (state, action) => {
        state.loading.google = false;
        state.error = (action.payload as string) ?? 'Unable to sign in with Google.';
      })
      .addCase(sendOtpThunk.pending, (state) => {
        state.loading.phone = true;
        state.error = null;
      })
      .addCase(sendOtpThunk.fulfilled, (state) => {
        state.loading.phone = false;
      })
      .addCase(sendOtpThunk.rejected, (state, action) => {
        state.loading.phone = false;
        state.error = (action.payload as string) ?? 'Unable to send OTP.';
      })
      .addCase(verifyOtpThunk.pending, (state) => {
        state.loading.verifyOtp = true;
        state.error = null;
      })
      .addCase(verifyOtpThunk.fulfilled, (state, action) => {
        state.loading.verifyOtp = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.isInitialized = true;
      })
      .addCase(verifyOtpThunk.rejected, (state, action) => {
        state.loading.verifyOtp = false;
        state.error = (action.payload as string) ?? 'Unable to verify OTP.';
      })
      .addCase(forgotPasswordThunk.pending, (state) => {
        state.loading.forgotPassword = true;
        state.error = null;
      })
      .addCase(forgotPasswordThunk.fulfilled, (state) => {
        state.loading.forgotPassword = false;
      })
      .addCase(forgotPasswordThunk.rejected, (state, action) => {
        state.loading.forgotPassword = false;
        state.error = (action.payload as string) ?? 'Unable to send reset email.';
      })
      .addCase(sendEmailVerificationThunk.pending, (state) => {
        state.loading.sendEmailVerification = true;
        state.error = null;
      })
      .addCase(sendEmailVerificationThunk.fulfilled, (state) => {
        state.loading.sendEmailVerification = false;
      })
      .addCase(sendEmailVerificationThunk.rejected, (state, action) => {
        state.loading.sendEmailVerification = false;
        state.error = (action.payload as string) ?? 'Unable to send verification email.';
      })
      .addCase(linkGoogleThunk.pending, (state) => {
        state.loading.linkGoogle = true;
        state.error = null;
      })
      .addCase(linkGoogleThunk.fulfilled, (state, action) => {
        state.loading.linkGoogle = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
      })
      .addCase(linkGoogleThunk.rejected, (state, action) => {
        state.loading.linkGoogle = false;
        state.error = (action.payload as string) ?? 'Unable to link Google account.';
      })
      .addCase(logoutThunk.pending, (state) => {
        state.loading.logout = true;
      })
      .addCase(logoutThunk.fulfilled, (state) => {
        state.loading.logout = false;
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
      })
      .addCase(logoutThunk.rejected, (state, action) => {
        state.loading.logout = false;
        state.error = (action.payload as string) ?? 'Unable to logout.';
      })
      .addCase(bootstrapAuthThunk.pending, (state) => {
        state.loading.bootstrap = true;
      })
      .addCase(bootstrapAuthThunk.fulfilled, (state, action) => {
        state.loading.bootstrap = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.isInitialized = true;
      })
      .addCase(bootstrapAuthThunk.rejected, (state, action) => {
        state.loading.bootstrap = false;
        state.error = (action.payload as string) ?? null;
        state.isInitialized = true;
      });
  },
});

export const { 
  setAuthSuccess, 
  setAuthError, 
  logoutSuccess, 
  setInitialized, 
  clearError 
} = authSlice.actions;

export const authReducer = authSlice.reducer;
