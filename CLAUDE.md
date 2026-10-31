# Argon

Argon is a stock (inventory) management app. Signed-in users maintain a catalogue of products, with their categories, properties, manufacturers, suppliers and images, and record how much stock is held at each location.

Run e2e tests only with `npm run test:e2e`; pass Playwright options after `--` (e.g. `npm run test:e2e -- e2e/category.spec.ts`). Which server the tests run against depends on whether one is already running on port 3001:

- **No server running** (the default): Playwright seeds the database, builds, starts a production server, runs the tests and stops the server.
- **Server already running**: Playwright uses it as it is. It does not seed, build or stop it. You are responsible for it being the right server with the right code, and for running `npm run seed` before each run. Use this for fast repeated runs, e.g. `npm run seed && npm run test:e2e`.

## Testing standards

- **Layout**: `__tests__/` mirrors the source tree, with one test file per module under test, named `<module>.test.ts` (`.tsx` for components and pages) (e.g. `schemas/supplier.ts` -> `__tests__/schemas/supplier.test.ts`). Never combine tests for separate modules in one file, even if they are identical today. Shared helpers go in `__tests__/<area>/helpers.ts`.
- **Schemas**: for each rule test valid, invalid and boundary input, and assert the exact error message and path (use `errorsOf` from `__tests__/schemas/helpers.ts`). Don't test that zod itself works.
- **Characterization**: when a test pins surprising current behaviour, add a comment saying so, so it's clear whether a later change is intended.
- **Parameterization**: use `describe.each` only for variants of one module (e.g. add and edit versions of a schema), not to cover separate modules.
- **Component and page tests**: assert what a user sees, wait for async work (e.g. the grid's data fetch) to finish before the test ends, and don't duplicate what Playwright already covers.
- **Mocking**: mock only at the boundary (`fetch`, Prisma, `next/navigation`). Never mock the thing under test.

## Merging

Before merging, run the checks in the `pre-merge-checks` skill (`.claude/skills/pre-merge-checks/`).
