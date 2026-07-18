# Convex Expo Clerk

An Expo SDK 57 React Native app for Android and iOS using Clerk authentication and Convex.

## Environment

Create `.env.local` with:

```env
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
EXPO_PUBLIC_CONVEX_URL=https://...
```

Configure `CLERK_FRONTEND_API_URL` in the Convex deployment environment and activate the Convex
integration and Native API in Clerk.

## Development

Install dependencies:

```bash
npm install
```

Create and launch a native development build:

```bash
npm run ios:dev
npm run android:dev
```

After the development build is installed, start Metro with:

```bash
npm start
```

Clerk's native authentication components require a development build and do not run in Expo Go.

## Project structure

- `src/app/_layout.tsx` configures Clerk, Convex, and protected routes.
- `src/app/sign-in.tsx` is the public authentication route.
- `src/app/(tabs)` contains the protected native-tab routes.
- `convex` contains the Convex backend and generated API types.
