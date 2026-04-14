import {
  GoogleAuthProvider,
  PhoneAuthProvider,
  createUserWithEmailAndPassword,
  linkWithCredential,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithCredential,
  signInWithEmailAndPassword,
  signInWithPhoneNumber,
  signOut,
  updateProfile,
  User as FirebaseUser,
} from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { auth, db } from '../../../utils/firebase';
import { AuthError, AuthSuccessPayload, User } from '../types';
import { secureStorage } from '../../../services/secureStorage';

const ACCESS_TOKEN_KEY = 'faithframes.auth.accessToken';
const REFRESH_TOKEN_KEY = 'faithframes.auth.refreshToken';
const FALLBACK_DELAY_MS = 450;

const canUseFirebaseAuth = Boolean(auth);

const writeSecureValue = async (key: string, value: string | null): Promise<void> => {
  if (!value) {
    await secureStorage.deleteItem(key);
    return;
  }
  await secureStorage.setItem(key, value);
};

const readSecureValue = async (key: string): Promise<string | null> => {
  try {
    return await secureStorage.getItem(key);
  } catch {
    return null;
  }
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const authService = {
  async login(email: string, pass: string): Promise<AuthSuccessPayload> {
    try {
      if (!canUseFirebaseAuth || !auth) {
        return await mockLogin(email);
      }
      const userCredential = await signInWithEmailAndPassword(auth, email, pass);
      const firebaseUser = userCredential.user;
      if (!firebaseUser.emailVerified) {
        await sendEmailVerification(firebaseUser);
        await signOut(auth);
        throw { code: 'auth/email-not-verified' };
      }
      const accessToken = await firebaseUser.getIdToken();
      const refreshToken = firebaseUser.refreshToken ?? null;

      await writeSecureValue(ACCESS_TOKEN_KEY, accessToken);
      await writeSecureValue(REFRESH_TOKEN_KEY, refreshToken);

      return await createAuthSuccessPayload(firebaseUser, accessToken, refreshToken);
    } catch (error) {
      throw mapFirebaseError(error);
    }
  },

  async signup(name: string, email: string, pass: string): Promise<AuthSuccessPayload> {
    try {
      if (!canUseFirebaseAuth || !auth) {
        return await mockSignup(name, email);
      }
      const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
      const firebaseUser = userCredential.user;

      await updateProfile(firebaseUser, { displayName: name });
      await sendEmailVerification(firebaseUser);
      const accessToken = await firebaseUser.getIdToken();
      const refreshToken = firebaseUser.refreshToken ?? null;

      await writeSecureValue(ACCESS_TOKEN_KEY, accessToken);
      await writeSecureValue(REFRESH_TOKEN_KEY, refreshToken);

      return await createAuthSuccessPayload(firebaseUser, accessToken, refreshToken);
    } catch (error) {
      throw mapFirebaseError(error);
    }
  },

  async forgotPassword(email: string): Promise<void> {
    try {
      if (!canUseFirebaseAuth || !auth) {
        await sleep(FALLBACK_DELAY_MS);
        return;
      }
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      throw mapFirebaseError(error);
    }
  },

  async googleLogin(idToken: string): Promise<AuthSuccessPayload> {
    try {
      if (!canUseFirebaseAuth || !auth) {
        return await mockLogin('google.user@faithframes.app');
      }
      const credential = GoogleAuthProvider.credential(idToken);
      const userCredential = await signInWithCredential(auth, credential);
      const firebaseUser = userCredential.user;
      const accessToken = await firebaseUser.getIdToken();
      const refreshToken = firebaseUser.refreshToken ?? null;

      await writeSecureValue(ACCESS_TOKEN_KEY, accessToken);
      await writeSecureValue(REFRESH_TOKEN_KEY, refreshToken);
      return await createAuthSuccessPayload(firebaseUser, accessToken, refreshToken);
    } catch (error) {
      throw mapFirebaseError(error);
    }
  },

  async requestPhoneOtp(phoneNumber: string, appVerifier: unknown): Promise<string> {
    try {
      if (!canUseFirebaseAuth || !auth) {
        await sleep(FALLBACK_DELAY_MS);
        return `mock_verification_${Date.now()}`;
      }
      const confirmation = await signInWithPhoneNumber(auth, phoneNumber, appVerifier as never);
      return confirmation.verificationId;
    } catch (error) {
      throw mapFirebaseError(error);
    }
  },

  async verifyPhoneOtp(verificationId: string, code: string): Promise<AuthSuccessPayload> {
    try {
      if (!canUseFirebaseAuth || !auth) {
        return await mockLogin('phone.user@faithframes.app');
      }
      const credential = PhoneAuthProvider.credential(verificationId, code);
      const userCredential = await signInWithCredential(auth, credential);
      const firebaseUser = userCredential.user;
      const accessToken = await firebaseUser.getIdToken();
      const refreshToken = firebaseUser.refreshToken ?? null;

      await writeSecureValue(ACCESS_TOKEN_KEY, accessToken);
      await writeSecureValue(REFRESH_TOKEN_KEY, refreshToken);
      return await createAuthSuccessPayload(firebaseUser, accessToken, refreshToken);
    } catch (error) {
      throw mapFirebaseError(error);
    }
  },

  async sendEmailVerification(): Promise<void> {
    try {
      if (!canUseFirebaseAuth || !auth?.currentUser) {
        await sleep(FALLBACK_DELAY_MS);
        return;
      }
      await sendEmailVerification(auth.currentUser);
    } catch (error) {
      throw mapFirebaseError(error);
    }
  },

  async linkGoogleAccount(idToken: string): Promise<AuthSuccessPayload> {
    try {
      if (!canUseFirebaseAuth || !auth?.currentUser) {
        return await mockLogin('linked.user@faithframes.app');
      }
      const credential = GoogleAuthProvider.credential(idToken);
      const userCredential = await linkWithCredential(auth.currentUser, credential);
      const firebaseUser = userCredential.user;
      const accessToken = await firebaseUser.getIdToken();
      const refreshToken = firebaseUser.refreshToken ?? null;

      await writeSecureValue(ACCESS_TOKEN_KEY, accessToken);
      await writeSecureValue(REFRESH_TOKEN_KEY, refreshToken);
      return await createAuthSuccessPayload(firebaseUser, accessToken, refreshToken);
    } catch (error) {
      throw mapFirebaseError(error);
    }
  },

  async logout(): Promise<void> {
    try {
      if (canUseFirebaseAuth && auth) {
        await signOut(auth);
      }
      await writeSecureValue(ACCESS_TOKEN_KEY, null);
      await writeSecureValue(REFRESH_TOKEN_KEY, null);
    } catch (error) {
      throw mapFirebaseError(error);
    }
  },

  async bootstrapSession(): Promise<AuthSuccessPayload> {
    const accessToken = await readSecureValue(ACCESS_TOKEN_KEY);
    const refreshToken = await readSecureValue(REFRESH_TOKEN_KEY);
    const currentUser = auth?.currentUser;
    const fallbackUser: User | null =
      !currentUser && accessToken
        ? {
            id: 'session_user',
            email: 'user@faithframes.app',
            displayName: 'Faith Frames User',
            photoURL: null,
            emailVerified: true,
            role: 'user',
            providers: ['password'],
            phoneNumber: null,
          }
        : null;

    const hydratedCurrentUser = currentUser ? await hydrateUserProfile(currentUser) : null;
    return {
      user: hydratedCurrentUser ?? fallbackUser,
      accessToken,
      refreshToken,
    };
  },

  async getCurrentUserToken(): Promise<string | null> {
    return await readSecureValue(ACCESS_TOKEN_KEY);
  },

  getErrorMessage(error: unknown): string {
    if (!error || typeof error !== 'object' || !('message' in error)) {
      return 'Something went wrong. Please try again.';
    }
    return String((error as { message?: string }).message ?? 'Something went wrong. Please try again.');
  },
};

function mapFirebaseUser(user: FirebaseUser): User {
  return {
    id: user.uid,
    email: user.email || '',
    displayName: user.displayName,
    photoURL: user.photoURL,
    emailVerified: user.emailVerified,
    role: 'user',
    providers: user.providerData.map((provider) => provider.providerId),
    phoneNumber: user.phoneNumber,
  };
}

function mapFirebaseError(error: unknown): AuthError {
  const code = typeof error === 'object' && error && 'code' in error ? String((error as { code?: string }).code) : 'unknown';
  let message = 'An unexpected error occurred';

  switch (code) {
    case 'auth/user-not-found':
      message = 'No account found';
      break;
    case 'auth/wrong-password':
      message = 'Incorrect password';
      break;
    case 'auth/email-already-in-use':
      message = 'Email already registered';
      break;
    case 'auth/invalid-email':
      message = 'Invalid email address';
      break;
    case 'auth/weak-password':
      message = 'Password is too weak';
      break;
    case 'auth/network-request-failed':
      message = 'Network error. Please check your connection';
      break;
    case 'auth/invalid-credential':
      message = 'The credentials you provided are invalid.';
      break;
    case 'auth/popup-closed-by-user':
      message = 'Google sign-in was cancelled.';
      break;
    case 'auth/too-many-requests':
      message = 'Too many attempts. Please wait and try again.';
      break;
    case 'auth/invalid-verification-code':
      message = 'Incorrect OTP code. Please try again.';
      break;
    case 'auth/code-expired':
      message = 'OTP has expired. Request a new code.';
      break;
    case 'auth/provider-already-linked':
      message = 'This provider is already linked to your account.';
      break;
    case 'auth/requires-recent-login':
      message = 'Please login again before changing this setting.';
      break;
    case 'auth/email-not-verified':
      message = 'Please verify your email before logging in. We sent a new verification link.';
      break;
  }

  return { code, message };
}

async function mockLogin(email: string): Promise<AuthSuccessPayload> {
  await sleep(FALLBACK_DELAY_MS);
  const normalizedEmail = email.trim().toLowerCase();
  const accessToken = `mock_access_${Date.now()}`;
  const refreshToken = `mock_refresh_${Date.now()}`;

  await writeSecureValue(ACCESS_TOKEN_KEY, accessToken);
  await writeSecureValue(REFRESH_TOKEN_KEY, refreshToken);

  return {
    user: {
      id: `mock_${normalizedEmail}`,
      email: normalizedEmail,
      displayName: normalizedEmail.split('@')[0] ?? 'Faith Frames User',
      photoURL: null,
      emailVerified: true,
      role: 'user',
      providers: ['password'],
      phoneNumber: null,
    },
    accessToken,
    refreshToken,
  };
}

async function mockSignup(name: string, email: string): Promise<AuthSuccessPayload> {
  await sleep(FALLBACK_DELAY_MS);
  const normalizedEmail = email.trim().toLowerCase();
  const accessToken = `mock_access_${Date.now()}`;
  const refreshToken = `mock_refresh_${Date.now()}`;

  await writeSecureValue(ACCESS_TOKEN_KEY, accessToken);
  await writeSecureValue(REFRESH_TOKEN_KEY, refreshToken);

  return {
    user: {
      id: `mock_${Date.now()}`,
      email: normalizedEmail,
      displayName: name.trim(),
      photoURL: null,
      emailVerified: false,
      role: 'user',
      providers: ['password'],
      phoneNumber: null,
    },
    accessToken,
    refreshToken,
  };
}

async function createAuthSuccessPayload(
  firebaseUser: FirebaseUser,
  accessToken: string | null,
  refreshToken: string | null
): Promise<AuthSuccessPayload> {
  const hydratedUser = await hydrateUserProfile(firebaseUser);
  return {
    user: hydratedUser,
    accessToken,
    refreshToken,
  };
}

async function hydrateUserProfile(firebaseUser: FirebaseUser): Promise<User> {
  const fallback = mapFirebaseUser(firebaseUser);
  if (!db) return fallback;

  const userRef = doc(db, 'users', firebaseUser.uid);
  const existing = await getDoc(userRef);
  const existingRole = (existing.data()?.role as User['role'] | undefined) ?? 'user';
  const safeRole: User['role'] = existingRole === 'admin' ? 'admin' : 'user';

  const profile: User = {
    ...fallback,
    role: safeRole,
  };

  await setDoc(
    userRef,
    {
      uid: profile.id,
      email: profile.email,
      displayName: profile.displayName ?? '',
      photoURL: profile.photoURL ?? '',
      emailVerified: profile.emailVerified,
      role: profile.role,
      providers: profile.providers,
      phoneNumber: profile.phoneNumber ?? '',
      updatedAt: serverTimestamp(),
      createdAt: existing.exists() ? existing.data()?.createdAt ?? serverTimestamp() : serverTimestamp(),
    },
    { merge: true }
  );

  return profile;
}
