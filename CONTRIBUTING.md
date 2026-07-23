# Contributing to GalaCash Frontend

Thank you for contributing. Keep changes small, typed, accessible, and aligned
with the existing route/query/service architecture.

## Setup

Requirements:

- Bun 1.2.14
- Node.js LTS
- Git

```bash
git clone https://github.com/ridwanalfarezi/galacash-frontend.git
cd galacash-frontend
bun install
cp .env.example .env
bun run dev
```

Read [AGENTS.md](AGENTS.md) before implementation work. It points to the
source-grounded `.ai/` guidance for authentication, query caching, financial
workflows, and generated API types.

## Development rules

- Keep TypeScript strict and avoid introducing new `any` usage.
- Use functional React components and preserve accessible Radix/shadcn
  behavior.
- Keep server state in TanStack Query. Zustand is currently auth-only and
  non-persistent.
- Add query keys to `app/lib/queries/keys.ts`.
- Call API services from query modules; do not call `FetchClient` directly from
  components.
- Preserve httpOnly-cookie authentication and single-flight token refresh.
- Treat financial freshness as a matrix: update the initiating list,
  dashboards, summaries, charts, balances, recaps, and other open tabs where
  applicable.
- Keep established user-facing copy in Indonesian.
- Do not hand-edit `app/types/api.d.ts`; use `bun run types:generate`.

## Tests

Choose checks based on the change:

| Change                             | Minimum verification                                       |
| ---------------------------------- | ---------------------------------------------------------- |
| Documentation only                 | links and `git diff --check`                               |
| Component or utility               | `bun run test`, `bun run type-check`, relevant lint        |
| Route, query, or service           | unit tests, type-check, lint, and build                    |
| Auth, roles, or financial workflow | all above plus targeted Playwright E2E                     |
| API contract snapshot              | regenerate types, review the diff, and test affected flows |

Full frontend verification:

```bash
bun run test
bun run type-check
bun run lint
bun run build
bun run test:e2e
```

Run a focused unit test with Bun's test filter or file path. Run a single
browser project with:

```bash
bun run test:e2e --project=chromium
```

## Workflow

1. Create a branch from the intended base branch.
2. Inspect the existing implementation and tests before editing.
3. Implement the smallest complete change.
4. Add or update tests and documentation.
5. Run checks proportional to risk.
6. Review the diff for auth, role, money, date, and cache semantics.
7. Commit using Conventional Commits.

Examples:

```text
feat(bills): add cash batch-payment flow
fix(auth): clear query state on logout
test(api): cover concurrent token refresh
docs(readme): update local verification
```

Use `bun run commit` for the interactive Commitizen flow.

## Pull requests

A pull request should:

- explain the user-visible and architectural impact;
- identify affected routes, query keys, and API operations;
- include tests for success, error, empty, and permission states as relevant;
- include screenshots for meaningful visual changes;
- avoid unrelated formatting or generated-file churn;
- pass the repository CI and E2E workflows.

## Security

Never place tokens, cookies, passwords, personal data, or `.env` contents in
issues, tests, logs, screenshots, or commits. Do not weaken route guards or
infer authorization from UI visibility.

Please keep reviews respectful, specific, and constructive.
