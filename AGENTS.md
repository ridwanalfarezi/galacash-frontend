# GalaCash Frontend Agent Instructions

This repository keeps durable agent memory in `.ai/`.

## Required reading

1. Read `.ai/README.md` to choose the relevant memory.
2. Read `.ai/CONTEXT.md` before changing routes, authentication, API services,
   query keys, financial displays, or role-specific behavior.
3. Read `.ai/DECISIONS.md` before changing an architectural boundary.
4. Use `.ai/SKILLS.md` for task-specific checklists.

## Source-of-truth order

When documentation conflicts, use this order:

1. Executable code and configuration in this repository
2. Tests
3. The local generated API declaration in `app/types/api.d.ts`
4. `.ai/` memory
5. README and historical documents

Do not preserve a memory claim that current source disproves. Update the
relevant `.ai/` entry in the same change when an architectural fact, invariant,
contract, or workflow changes.

All memory evidence must resolve inside this repository. Do not cite or require
files from another project; represent integration only through local API types,
services, configuration, mocks, and tests.

## Non-negotiable working rules

- Keep TypeScript strict and do not add new `any` usage.
- Treat remote API data as TanStack Query state; Zustand is currently
  auth-only.
- Keep query keys centralized in `app/lib/queries/keys.ts`.
- Preserve cookie-based authentication and the single-flight refresh queue.
- A financial mutation must invalidate every affected projection, including
  cross-tab consumers.
- Bendahara routes require `requireRole('bendahara')`. Do not assume user routes
  enforce the inverse role: most currently use `requireAuth()`.
- `app/types/api.d.ts` is the local generated contract snapshot. Follow this
  repository's configured generation workflow instead of hand-editing it.
- Never read, print, or commit secrets from `.env`.

## Verification

Use the narrowest relevant checks, then expand with risk:

```text
bun run type-check
bun run lint
bun run test
bun run test:e2e
```
