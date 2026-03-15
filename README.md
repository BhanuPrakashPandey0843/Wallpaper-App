# Faithframes Frontend (Expo + React Native + TypeScript)

Modern, production-ready React Native app scaffold built on Expo SDK 55 with Expo Router, Redux Toolkit, Reanimated, Gesture Handler, FlashList, Gorhom Bottom Sheet, Lucide Icons, Expo Image, Linear Gradient, Haptics, and Inter font. Engineered for scalability and developer efficiency.

## Requirements
- Node.js: >= 20.19.4 (LTS). Update if you're on Node 18.
  - Windows: install Node 20+ from https://nodejs.org/en/download or use nvm-windows.
  - macOS/Linux (nvm): `nvm install 20 && nvm use 20`
- npm: comes with Node
- Android Studio (for Android emulator) or physical device with Expo Go
- Xcode (macOS only) for iOS simulator

## Quick Start
1. Install dependencies (inside project directory):
   - `npm install`
2. Verify environment and dependencies:
   - `npx expo-doctor`
   - `npx expo install --check`
3. Start the app:
   - Dev server: `npm run start`
   - Android: `npm run android`
   - iOS (macOS): `npm run ios`
   - Web: `npm run web`

If port 8081 is in use, start with a custom port:
```
npx expo start --port 8082
```

## Project Structure
```
Faithframes/
│
├─ app/                      # Expo Router file-based navigation
│  ├─ _layout.tsx            # Root layout (Redux Provider + Gesture Root)
│  ├─ (tabs)/                # Tabs group
│  │  ├─ _layout.tsx         # Bottom tabs definition
│  │  ├─ index.tsx           # Home screen
│  │  ├─ explore.tsx         # Explore screen
│  │  └─ favorites.tsx       # Favorites screen
│  └─ wallpaper/
│     └─ [id].tsx            # Dynamic detail route
│
├─ store/                    # Redux Toolkit
│  ├─ index.ts               # configureStore
│  └─ hooks.ts               # typed hooks
│
├─ theme/                    # Design tokens for future UI
│  ├─ colors.ts
│  ├─ spacing.ts
│  └─ typography.ts
│
├─ assets/                   # Icons and splash
├─ babel.config.js           # Reanimated plugin (last)
├─ package.json              # Scripts and dependencies
├─ tsconfig.json             # TypeScript config
└─ app.json                  # Expo config
```

## Key Libraries and Rationale
- Expo Router: typed, file-based navigation with deep linking and web support.
- Redux Toolkit + React Redux: predictable state, slices, and best practices out of the box.
- Reanimated + Gesture Handler: 60fps animations and robust gestures.
- FlashList: high-performance lists with better memory usage than FlatList.
- Gorhom Bottom Sheet: performant bottom sheet with gestures and reanimated.
- Expo Image: efficient image loading and caching.
- Lucide Icons + react-native-svg: modern, consistent icons.
- Linear Gradient, Haptics, Font (Inter): tactile and visual polish for a premium feel.
- Moti: declarative micro-interactions and skeletons built on Reanimated.

## TypeScript Tips
- Run type checking without emitting: `npx tsc --noEmit`
- Prefer typed hooks from `store/hooks.ts` to keep selectors and dispatch typed.

## Running on Devices and Simulators
- Android:
  - Install Android Studio and create a virtual device (AVD).
  - Start AVD, then run `npm run android`.
  - Or scan the QR code in Expo Dev Tools with Expo Go on a physical device.
- iOS (macOS only):
  - Install Xcode and Command Line Tools.
  - Run `npm run ios` to open iOS simulator.

## Common Troubleshooting
- Node version error: update Node to >= 20.19.4.
- Port busy: `npx expo start --port 8082`
- Clear Metro cache:
  ```
  npx expo start -c
  ```
- Reanimated issues:
  - Ensure `react-native-reanimated/plugin` is last in `babel.config.js`.
  - Restart the dev server after dependency changes.
- Dependency mismatches:
  - `npx expo-doctor`
  - `npx expo install --check`

## Code Quality and Conventions
- Use functional components and hooks.
- Keep UI tokens in `theme/` and avoid hard-coded values.
- Organize features by route and domain for scalability.
- Avoid side-effects in components; prefer RTK slices and thunks for data logic.
- Use FlashList for any list beyond trivial size for performance.
- Keep animations declarative with Moti; complex sequences with Reanimated worklets where justified.

## GitHub: Prepare and Push
Initialize the repo and push to GitHub:
```
git init
git add .
git commit -m "chore: bootstrap Faithframes Expo app foundation"
git branch -M main
git remote add origin https://github.com/<your-username>/Faithframes.git
git push -u origin main
```

Recommended branch strategy:
- `main`: protected, stable.
- `dev`: integration branch.
- feature branches: `feat/<scope>`, `fix/<scope>`, `chore/<scope>`.

## Scripts
- `npm run start` – Expo dev server
- `npm run android` – launch Android
- `npm run ios` – launch iOS (macOS)
- `npm run web` – launch web

## Notes
- App is scaffolded only; no final UI yet.
- Fonts installed but not loaded globally; wire them in UI phase with `useFonts`.
- Moti and Reanimated installed; create skeleton and micro-interaction components during UI building.

---
Built to be industry-standard, scalable, and ready for premium UI development.
