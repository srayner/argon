---
name: merge
description: Pre-merge checklist for merging a feature branch into main in this repo. Verifies typecheck, lint, unit tests, the production build and the full Playwright e2e suite, bumps the version with `npm version`, then merges only after the user confirms. Use when the user says "merge", "ready to merge", "release", or asks to land a feature branch on main.
---

# Merge a feature branch into main

Nothing here is committed, tagged, merged or pushed without the user's explicit
confirmation at the point it happens. A confirmation for one step does not cover the next.

## 1. Preconditions

- `git branch --show-current` must be a `feature/*` branch. If it is `main`, stop.
- `git status` must be clean. If not, stop and ask how to handle the changes
  (commit them first, with the user's approval of the diff). `npm version` refuses to run on a dirty tree.

## 2. Verify (all must pass, run in this order, stop at the first failure)

1. `npx tsc --noEmit`
2. `npm run lint`
3. `npm test`
4. `npm run build` — must complete with no errors. Next's build runs its own typecheck and
   lint, which is what catches problems `next dev` and Playwright do not.
5. `npm run test:e2e` — the full Playwright suite; **every test must pass**. Zero failures,
   zero skipped specs. Do not merge with a flaky or "known failing" test: fix it or hand it back.
   - The seed resets the database first; that is expected. Just run it, no confirmation needed.
   - Playwright starts `npm run dev` itself (port 3000) unless something is already
     listening there; make sure a stale server on 3000 isn't masking the branch's code.
   - Specs depend on each other and run in order (`01-` to `09-`), so a single failure
     can cascade. Fix the first failure and re-run the whole suite, not one spec.
6. `docker build -t argon:premerge .` — the real production path (multi-stage Dockerfile).
   Skip only if Docker is unavailable, and say so explicitly.

Report each result plainly. If anything fails, show the error, fix it or hand it back —
do not continue to the version bump. Never merge on a failing or skipped check without
telling the user exactly what was skipped.

## 3. Bump the version

- Always use `npm version`, never hand-edit `version` in package.json or package-lock.json.
- Ask the user which bump: `patch`, `minor` or `major`. Suggest one based on the diff
  (fix → patch, new feature → minor, breaking → major) but let them decide.
- `npm version <type>` creates a commit and a `v<x.y.z>` tag. Because that is a commit,
  show the user the pending bump and get a yes before running it.
- Run it with the default message, then confirm package.json and package-lock.json both
  show the new version (`git show --stat HEAD`).

## 4. Merge to main

Ask whether to merge locally or open a PR (`gh` may need `gh auth login`).

- Local: `git checkout main && git merge --no-ff <branch>` — confirm before running.
- PR: push the branch (confirm first) and open the PR; end the description with the
  attribution line from the session's system reminder.

## 5. After the merge

- Do not push `main` or tags without confirmation (`git push origin main --follow-tags`).
- Remind the user that deploy runs migrations (`npx prisma migrate deploy`), and flag if
  the branch added anything under `prisma/migrations/`.
- Offer to delete the merged feature branch; don't delete it unprompted.
