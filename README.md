# RoamPK

RoamPK is a UI-first Pakistan Tourism Super-App demo built with Next.js, TypeScript, Tailwind CSS, Framer Motion, and Lucide React.

## Current Scope

- Landing page and tourism feature pages
- Hotels, SIM, currency, tours, guides, routes, destinations, emergency, language, and join/onboarding UI
- Hardcoded mock data in `src/lib/mock-data.ts`
- Extensible role model in `src/lib/roles.ts`
- Clerk auth routes and protected dashboard/onboarding
- Turso + Drizzle schema and generated migration

## Auth + Database

Use **Clerk** for identity and **Turso** for app data.

Clerk should manage:

- Signup/login
- Sessions
- Email/social auth
- Basic user identity

Turso should manage:

- Users synced from Clerk
- Multiple user roles
- Partner profiles
- Verification status
- Follows
- Bookings and marketplace data

## Environment

Create `.env.local` using `.env.example`:

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_replace_me
CLERK_SECRET_KEY=sk_test_replace_me
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/dashboard
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/onboarding

TURSO_DATABASE_URL=libsql://your-database-org.turso.io
TURSO_AUTH_TOKEN=replace_me
```

Without Turso env vars, local server code falls back to `file:local.db` for development/build safety.

## Supported Roles

- Tourist / Traveler
- Local User
- Admin
- Hotel Partner
- Hostel Partner
- Café Partner
- SIM Partner
- Tour Guide
- Food Expert
- Emergency Response Team

To add another role, add one object to `src/lib/roles.ts`. The `/join` page renders roles dynamically from that file.

## Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Database

Generate migrations:

```bash
npm run db:generate
```

Apply migrations to Turso:

```bash
npm run db:migrate
```

Open Drizzle Studio:

```bash
npm run db:studio
```

## Build

```bash
npm run build
```
