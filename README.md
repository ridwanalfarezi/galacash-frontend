# GalaCash Frontend

GalaCash Frontend is the React single-page application for GalaCash. It provides
student (`user`) and treasurer (`bendahara`) experiences for cash bills, fund
applications, transactions, dashboards, and financial recap.

## Current stack

- React 19 and React Router 7 in SPA mode (`ssr: false`)
- TypeScript with strict checking
- Vite and Tailwind CSS 4
- TanStack Query for remote API state
- Zustand for the in-memory authenticated-user cache
- React Hook Form and Zod for forms
- Radix/shadcn components, Lucide icons, Recharts, and Sonner
- Bun 1.2.14 for dependency management, scripts, unit tests, and the production
  static server
- Playwright for browser tests

React Router's build and Playwright are invoked through Node, so a current Node
LTS installation is also required. The repository's `.nvmrc` tracks `lts/*`.

## Architecture

```text
route loader
  -> authentication or role guard
  -> TanStack Query prefetch
  -> route component
  -> query option factory
  -> service
  -> FetchClient
  -> /api
```

Important boundaries:

- Route definitions live in `app/routes.ts`; route modules are automatically
  code-split.
- Bendahara routes call `requireRole('bendahara')`. Most user routes call
  `requireAuth()`, so the API remains responsible for authorization.
- TanStack Query owns remote data. Zustand stores only the current user in
  memory and is not persisted to local storage.
- Authentication uses httpOnly cookies. `FetchClient` performs one refresh
  request for concurrent expired-token responses.
- Query keys are centralized in `app/lib/queries/keys.ts`.
- Financial mutations invalidate all affected projections and broadcast
  important invalidations to other open tabs.
- `app/types/api.d.ts` is generated from the OpenAPI contract; do not edit it
  manually.

See [AGENTS.md](AGENTS.md) and the `.ai/` directory for detailed,
source-grounded architecture and maintenance guidance.

## Routes

Public:

- `/sign-in`

Authenticated student experience:

- `/user/dashboard`
- `/user/kas-kelas`
- `/user/aju-dana`
- `/user/tagihan-kas`
- `/user/settings`

Bendahara experience:

- `/bendahara/dashboard`
- `/bendahara/kas-kelas`
- `/bendahara/aju-dana`
- `/bendahara/rekap-kas`
- `/bendahara/rekap-kas/:userId`
- `/bendahara/settings`

## Local setup

### Prerequisites

- Bun 1.2.14
- Node.js LTS
- Git

### Install and run

```bash
git clone https://github.com/ridwanalfarezi/galacash-frontend.git
cd galacash-frontend
bun install
```

Copy the environment example:

```bash
cp .env.example .env
```

`VITE_API_URL` defaults to `/api`. During development, Vite proxies `/api` to
the backend specified by `API_URL`, falling back to `http://localhost:3000`.

Start the development server:

```bash
bun run dev
```

The development URL is normally `http://localhost:5173`.

## Verification

Run the fast local checks:

```bash
bun run test
bun run type-check
bun run lint
bun run build
```

Run browser tests:

```bash
bun run test:e2e
```

Playwright builds the SPA and starts the production Bun server on
`http://localhost:3000`. To run only Chromium:

```bash
bun run test:e2e --project=chromium
```

The E2E API layer is mocked, so the browser suite does not require a running
backend.

## API contract generation

The configured generator reads the sibling server repository's
`openapi.yaml`:

```bash
bun run types:generate
```

Review the generated diff in `app/types/api.d.ts`, then run unit tests,
type-checking, lint, and affected E2E flows.

## Project layout

```text
app/
  components/       shared UI, feature components, forms, charts, and modals
  lib/
    api/             native FetchClient and API errors
    queries/         TanStack Query keys, options, mutations, and broadcasts
    services/        typed API adapters
    stores/          in-memory auth store
  routes/            public, user, and bendahara route modules
  types/api.d.ts     generated OpenAPI declaration
public/              static assets
tests/e2e/           Playwright scenarios and API mocks
server.ts            production static server and /api proxy
```

## Scripts

| Command                  | Purpose                                              |
| ------------------------ | ---------------------------------------------------- |
| `bun run dev`            | Start the React Router development server            |
| `bun run build`          | Build the production SPA                             |
| `bun run start`          | Serve `build/client` on port 3000 with Bun           |
| `bun run test`           | Run unit tests under `app/`                          |
| `bun run test:e2e`       | Run Playwright browser tests                         |
| `bun run type-check`     | Generate route types and run TypeScript without emit |
| `bun run typecheck`      | Equivalent route generation and TypeScript check     |
| `bun run types:generate` | Regenerate `app/types/api.d.ts`                      |
| `bun run lint`           | Run ESLint with zero allowed warnings                |
| `bun run lint:fix`       | Apply ESLint fixes                                   |
| `bun run format`         | Format application files                             |
| `bun run format:check`   | Check application formatting                         |
| `bun run clean`          | Remove the production build directory                |
| `bun run prepare`        | Install Husky hooks                                  |
| `bun run commit`         | Create a Conventional Commit interactively           |

## Vercel deployment

Create a frontend Vercel project rooted at this repository. Set:

```dotenv
VITE_API_URL=/api
API_URL=https://YOUR_BACKEND_PROJECT.vercel.app
```

The catch-all function in `api/[...path].ts` proxies browser `/api` requests
to the backend. This keeps JWT cookies same-origin even though frontend and
backend are separate Vercel projects.

## Production and Docker

```bash
bun run build
bun run start
```

The production server uses `PORT` (default `3000`) and `API_URL` for its `/api`
proxy target.

Build and run the container:

```bash
docker build -t galacash-frontend .
docker run --rm -p 3000:3000 galacash-frontend
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

MIT. See [LICENSE](LICENSE).
