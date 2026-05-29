# RoamPK

RoamPK is a UI-first Pakistan Tourism Super-App demo built with Next.js, TypeScript, Tailwind CSS, Framer Motion, and Lucide React.

## Current Scope

- Landing page and tourism feature pages
- Hotels, SIM, currency, tours, guides, routes, destinations, emergency, language, and join/onboarding UI
- Hardcoded mock data in `src/lib/mock-data.ts`
- Extensible role model in `src/lib/roles.ts`
- No production backend wired yet

## Future Auth + Database Plan

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

## Build

```bash
npm run build
```
