# Argon

A full-stack web application built with Next.js, providing authenticated dashboards and data management features. Uses Prisma ORM for database access and NextAuth for authentication.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Auth**: NextAuth v5 (beta) with Prisma adapter
- **Database ORM**: Prisma 5
- **UI**: React 18, Radix UI, Tailwind CSS, AG Grid, React Hook Form
- **Validation**: Zod
- **Testing**: Vitest, React Testing Library, Playwright (E2E)
- **Linting**: ESLint (eslint-config-next)

## Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

npm run test         # Run Vitest unit tests (single run)
npm run test:watch   # Run Vitest in watch mode
npm run test:coverage # Run Vitest with v8 coverage

npm run seed         # Seed the database (ts-node prisma/seed.ts)
npm run test:e2e     # Seed the database and run Playwright E2E tests
npm run migrate-stock  # Run stock migration script (ts-node prisma/migrate-stock.ts)
```
