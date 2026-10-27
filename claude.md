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

## Testing standards

- **Layout**: `__tests__/` mirrors the source tree, with one test file per module under test, named `<module>.test.ts` (e.g. `schemas/supplier.ts` -> `__tests__/schemas/supplier.test.ts`). Never combine tests for separate modules in one file, even if they are identical today. Shared helpers go in `__tests__/<area>/helpers.ts`.
- **Schemas**: for each rule test valid, invalid and boundary input, and assert the exact error message and path (use `errorsOf` from `__tests__/schemas/helpers.ts`). Don't test that zod itself works.
- **Characterization**: when a test pins surprising current behaviour, add a comment saying so, so it's clear whether a later change is intended.
- **Parameterization**: use `describe.each` only for variants of one module (e.g. add and edit versions of a schema), not to cover separate modules.
- **Component and page tests**: assert what a user sees, wait for async work (e.g. the grid's data fetch) to finish before the test ends, and don't duplicate what Playwright already covers.
- **Mocking**: mock only at the boundary (`fetch`, Prisma, `next/navigation`). Never mock the thing under test.
- **Mutation spot-check**: when adding tests for logic, temporarily break the code and confirm a test fails, then restore it.
