# FaithFrames Authentication Architecture

## Reverse-engineered baseline

- **Legacy mobile reference (`Pixar`)**
  - Uses Firebase Auth, Firestore, and Storage with project `wallpaper-c74a3`.
  - Implements email/password login, signup, forgot password.
  - Google sign-in UI exists, but credentials are not configured.
  - Signup writes basic user profile document to `users/{uid}`.
- **Admin panel reference (`FaithFrames Website`)**
  - Uses same Firebase project config in `src/firebase.js`.
  - Includes an insecure hardcoded `/api/login` route (plain credentials).
  - This route should not be reused for production auth.
- **Target app (`Faithframes`)**
  - Already has Redux auth state, secure token storage, splash bootstrap, and polished auth UI.
  - Missing production features: Google login, phone OTP flow, verification enforcement, and account linking.

## Production architecture (implemented in `Faithframes`)

- **Firebase services**
  - Auth: Email/Password, Google credential sign-in, Phone OTP verification, session persistence.
  - Firestore: User profile hydration and role persistence in `users/{uid}`.
  - Storage/Functions: Not required for core auth, can be layered later for post-auth onboarding.
- **State and boundaries**
  - `authService`: Firebase interactions, token persistence, error code mapping, profile upsert.
  - `authSlice`: Async flow orchestration and loading/error state for each auth operation.
  - `useAuth`: UI-safe command hooks with network guards and duplicate-submit throttling.
  - Screen layer: form validation, transitions, and user feedback.

## Auth flows

- Signup -> create Firebase account -> set display name -> send email verification -> persist profile -> success screen.
- Login -> sign in with email/password -> block unverified emails and re-send verification.
- Google sign-in -> exchange Google `idToken` -> Firebase credential sign-in -> profile upsert.
- Forgot password -> Firebase reset email.
- Phone flow -> request OTP verification ID -> verify OTP code -> authenticate user.
- Logout -> Firebase sign-out + secure token deletion.
- Bootstrap -> read persisted tokens + current Firebase user -> hydrate profile from Firestore.

## Firestore user document

Recommended shape for `users/{uid}`:

```json
{
  "uid": "string",
  "email": "string",
  "displayName": "string",
  "photoURL": "string",
  "emailVerified": true,
  "role": "user",
  "providers": ["password", "google.com"],
  "phoneNumber": "+919999999999",
  "createdAt": "serverTimestamp",
  "updatedAt": "serverTimestamp"
}
```

## Environment configuration

Set Expo `app.json` `extra` values:

- `firebaseApiKey`
- `firebaseAuthDomain`
- `firebaseProjectId`
- `firebaseStorageBucket`
- `firebaseMessagingSenderId`
- `firebaseAppId`
- `googleExpoClientId`
- `googleIosClientId`
- `googleAndroidClientId`
- `googleWebClientId`

## Security checklist

- Never hardcode credentials in API routes or client files.
- Use Firebase Auth tokens as the source of truth for identity.
- Validate all input with schema validation (already in auth forms).
- Enforce role checks from trusted backend context when adding admin APIs.
- Keep Firestore rules strict:

```txt
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

