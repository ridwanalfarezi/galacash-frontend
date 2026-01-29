# GalaCash Frontend

> **Modern financial management application for class treasurers**  
> Built with React Router v7, TypeScript, TailwindCSS, and TanStack Query  
> **Last Updated:** January 25, 2026

---

A full-stack application that enables treasurers and students to track and manage both income and expenses with complete transparency across the entire batch. Features include fund requests (Aju Dana), cash bill management (Tagihan Kas), and comprehensive financial recaps.

## 🎯 Key Highlights

- **Multi-Class Transparency**: View financial data across all classes in the angkatan (batch)
- **Role-Based Access**: Separate interfaces for students (user) and treasurers (bendahara)
- **Real-Time Data**: TanStack Query for optimized server state management with caching
- **Date Filtering**: Dynamic date range filtering for dashboard summaries and transactions
- **Type Safety**: End-to-end TypeScript with generated API types
- **Performance First**: Route lazy loading, skeleton screens, and optimized assets

## 🛠 Tech Stack

- ⚛️ [React 19](https://react.dev/) with TypeScript
- 🛣️ [React Router v7](https://reactrouter.com/) for routing and SSR
- 🎨 [TailwindCSS](https://tailwindcss.com/) with custom theme
- 🎯 [TypeScript](https://www.typescriptlang.org/) for type safety
- 📦 [Vite](https://vitejs.dev/) for fast builds
- 🎭 [Shadcn UI](https://ui.shadcn.com/) - Accessible components built on Radix UI
- 🏗️ [Zustand](https://zustand-demo.pmnd.rs/) for auth state management
- 📡 [TanStack Query](https://tanstack.com/query/latest) for server state & caching
- ✨ [Zod](https://zod.dev/) for schema validation
- 🔔 [Sonner](https://sonner.emilkowal.ski/) for toast notifications
- 📝 [React Hook Form](https://react-hook-form.com/) for form handling
- 📊 [Recharts](https://recharts.org/) for data visualization
- 🎨 [Lucide React](https://lucide.dev/) for icons
- 🎭 [Playwright](https://playwright.dev/) for End-to-End testing

## 🚀 Getting Started

### Prerequisites

- Node.js (LTS version) - specified in [.nvmrc](.nvmrc)
- pnpm (package manager)
- Git
- VS Code (recommended)

### First Time Setup

1. **Clone Repository**

   ```bash
   git clone https://github.com/ridwanalfarezi/galacash-frontend.git
   cd galacash-frontend
   ```

2. **Setup Node.js**

   ```bash
   # Install and use correct Node.js version
   nvm install $(cat .nvmrc)
   nvm use
   ```

3. **Install Dependencies**

   ```bash
   # Install project dependencies (uses pnpm@10.28.0)
   pnpm install

   # Setup Git hooks
   pnpm run prepare
   ```

4. **VS Code Setup**

   Install recommended extensions:
   - ESLint
   - Prettier
   - Tailwind CSS IntelliSense
   - GitLens
   - ENV

5. **Configuration**

   Copy the example environment file:

   ```bash
   cp .env.example .env
   ```

### Development Workflow

1. **Start Development Server**

   ```bash
   pnpm dev
   ```

   Visit: http://localhost:5173

2. **Run Quality Checks**

   ```bash
   # Type checking
   pnpm run typecheck

   # Lint code
   pnpm lint

   # Fix lint issues
   pnpm lint:fix

   # Format code
   pnpm format

   # Check formatting
   pnpm format:check

   # Run End-to-End Tests
   pnpm test:e2e
   ```

3. **Making Commits**

   ```bash
   # Stage your changes
   git add .

   # Commit using conventional commits
   pnpm commit
   ```

## ✨ Key Features & Optimizations

- **⚡ Performance First**:
  - **Route Lazy Loading**: All pages are code-split using `React.lazy` and `Suspense`.
  - **Skeleton Screens**: Custom loading states for improved perceived performance.
  - **Optimized Assets**: Dynamic imports for heavy components.
- **🛠️ Robust Architecture**:
  - **Centralized Query Keys**: Type-safe query management with TanStack Query.
  - **Auth Store**: Zustand-based authentication state to minimize API calls.
  - **Type Safety**: Comprehensive TypeScript types for all data domains.
- **🎨 Enhanced UX**:
  - **Pagination**: Efficient data handling for large lists.
  - **Smart Forms**: Reusable currency and file upload components.
  - **Responsive Design**: Mobile-first layout with adaptive navigation.

## 📦 Project Structure

```
.
├── app/                      # Application source code
│   ├── app.css              # Global styles and Tailwind imports
│   ├── root.tsx             # Root layout and error boundaries
│   ├── routes.ts            # Route definitions
│   │
│   ├── components/          # Reusable components
│   │   ├── chart/          # Chart components
│   │   │   └── financial-pie-chart.tsx
│   │   ├── data-display/   # Data display components
│   │   │   ├── Skeletons.tsx
│   │   │   ├── EmptyState.tsx
│   │   │   └── ...
│   │   ├── form/           # Form components
│   │   │   ├── CurrencyInput.tsx
│   │   │   └── FileUpload.tsx
│   │   ├── icons/          # Icon components
│   │   ├── modals/         # Modal components
│   │   ├── shared/         # Shared business components
│   │   │   ├── PaginationControls.tsx
│   │   │   └── layout/...
│   │   └── ui/             # Shadcn UI (Base) components
│   │       ├── button.tsx
│   │       ├── pagination.tsx
│   │       └── ...
│   │
│   ├── hooks/              # Custom React hooks
│   │   └── use-mobile.ts
│   │
│   ├── lib/                # Utility functions
│   │   └── utils.ts        # Common utilities (cn, etc.)
│   │
│   ├── pages/              # Page components
│   │   ├── auth/           # Authentication pages
│   │   │   └── sign-in.tsx # Sign-in page
│   │   ├── shared/         # Shared pages across roles
│   │   │   └── settings.tsx # Settings page (shared)
│   │   ├── bendahara/      # Treasurer-specific pages
│   │   │   ├── dashboard.tsx
│   │   │   ├── aju-dana.tsx
│   │   │   ├── kas-kelas.tsx
│   │   │   └── rekap-kas.tsx
│   │   └── user/           # Student-specific pages
│   │       ├── dashboard.tsx
│   │       ├── aju-dana.tsx
│   │       ├── kas-kelas.tsx
│   │       └── tagihan-kas.tsx
│   │
│   └── routes/             # Route components
│       ├── auth/           # Authentication routes
│       │   └── sign-in.tsx
│       ├── bendahara/      # Treasurer routes
│       │   ├── dashboard.tsx
│       │   ├── aju-dana.tsx
│       │   ├── kas-kelas.tsx
│       │   ├── rekap-kas.tsx  # Financial recap
│       │   ├── detail-rekap-kas.tsx
│       │   └── settings.tsx
│       ├── user/           # Student routes
│       │   ├── dashboard.tsx
│       │   ├── aju-dana.tsx
│       │   ├── kas-kelas.tsx
│       │   ├── tagihan-kas.tsx # Bill payments
│       │   └── settings.tsx
│       └── index.tsx       # Home route
│
├── public/                  # Static assets
│   ├── logo.png            # Application logo
│   ├── bg_gala.webp        # Background image
│   └── ...                 # Other static files
│
├── types/                   # TypeScript type definitions
│   ├── globals.d.ts        # Global type definitions
│   └── eslint-plugin-import.d.ts
│
├── .husky/                  # Git hooks configuration
│   ├── _/                  # Husky core scripts
│   │   ├── husky.sh       # Husky shell script
│   │   └── ...            # Other hook scripts
│   ├── pre-commit         # Pre-commit hook
│   └── commit-msg         # Commit message hook
│
├── .vscode/                 # Editor configuration
│   ├── settings.json      # VS Code settings
│   └── launch.json        # Debug configuration
│
├── Configuration Files
│   ├── .eslintrc.json     # ESLint rules
│   ├── .prettierrc        # Prettier config
│   ├── .lintstagedrc.json # Lint-staged config
│   ├── tsconfig.json      # TypeScript config
│   ├── vite.config.ts     # Vite bundler config
│   ├── components.json    # UI components config
│   └── react-router.config.ts # React Router config
│
├── Docker Files
│   ├── Dockerfile         # Multi-stage build config
│   └── .dockerignore      # Docker ignore patterns
│
├── Environment
│   ├── .nvmrc            # Node.js version
│   └── env.d.ts          # Environment variables types
│
└── Git Configuration
    ├── .gitignore        # Git ignore patterns
    └── .gitattributes    # Git attributes
```

### 🏗️ Architecture Overview

**Role-Based Structure:**

- **Auth**: Authentication-related pages and routes
- **Shared**: Components and pages used across all roles (e.g., settings)
- **Bendahara**: Treasurer-specific functionality (rekap kas, approvals)
- **User**: Student-specific functionality (tagihan kas, submissions)

**Data Transparency Architecture:**

- Dashboard summaries aggregate data across all classes in the batch
- Date range filtering for real-time data updates
- Automatic query invalidation and refetch on data changes
- Optimistic updates with error rollback

## 🏗️ Architecture Deep Dive

### Data Flow & State Management

**Server State (TanStack Query)**:

- Query keys organized by feature (dashboard, transactions, bills, applications)
- Automatic refetching on window focus and network reconnection
- Optimistic updates for mutations with rollback on error
- Prefetching in route loaders for instant page loads

**Client State (Zustand)**:

- Authentication state (user, role, tokens)
- Persisted to localStorage for session management
- Used for role-based routing and UI rendering

**Query Key Factory Pattern**:

```typescript
// Centralized, type-safe query keys
const queryKeys = {
  dashboard: {
    all: ['dashboard'] as const,
    summary: (params?: DashboardParams) => [...queryKeys.dashboard.all, 'summary', params] as const,
  },
  transactions: {
    all: ['transactions'] as const,
    list: (filters?: TransactionFilters) =>
      [...queryKeys.transactions.all, 'list', filters] as const,
    recent: (limit: number) => [...queryKeys.transactions.all, 'recent', limit] as const,
  },
}
```

### Route Protection

**Role-Based Access Control**:

```typescript
// In route loaders
export async function clientLoader() {
  await requireRole('bendahara') // Only bendahara can access
  // ... prefetch data
}

// Or for any authenticated user
export async function clientLoader() {
  await requireAuth() // Any logged-in user
  // ... prefetch data
}
```

### API Integration

**Service Layer Pattern**:

- Services encapsulate all API calls
- Consistent error handling with `APIError` class
- Automatic token refresh on 401 responses
- Type-safe responses from generated OpenAPI types

**Date Filtering**:

```typescript
// Dashboard with date range
const { data: summary } = useQuery(
  dashboardQueries.summary({
    startDate: date?.from?.toISOString().split('T')[0],
    endDate: date?.to?.toISOString().split('T')[0],
  })
)
```

### Component Patterns

**Composition over Inheritance**:

- Small, focused components with single responsibility
- Compound components for complex UI (e.g., StatCard, TransactionItem)
- Shared utilities (formatCurrency, formatDate, groupTransactionsByDate)

**Null Safety**:

```typescript
// Use nullish coalescing for proper 0 and negative handling
const totalBalance = summary?.totalBalance ?? 0 // ✅ Correct
const totalBalance = summary?.totalBalance || 0 // ❌ Fails for 0
```

**Component Organization:**

- **UI Components**: Reusable design system components
- **Shared Components**: Business logic components used across pages
- **Icons**: Custom icon components
- **Modals**: Modal dialog components
- **Chart**: Data visualization components

## 🛠 Development Tools

### Code Quality Tools

- 🔍 ESLint with TypeScript and React plugins - [.eslintrc.json](.eslintrc.json)
- 💅 Prettier with TailwindCSS plugin - [.prettierrc](.prettierrc)
- 🐶 Husky for Git hooks
- 📝 Commitlint for conventional commits - [commitlint.config.js](commitlint.config.js)

## 🚀 Deployment

### Production Build

```bash
pnpm build
```

### Docker Deployment

Multi-stage Dockerfile for optimized production builds:

```bash
# Build image
docker build -t galacash .

# Run container
docker run -p 3000:3000 galacash
```

## 🔄 Git Workflow

### Commit Convention

```
type(scope): subject

feat(auth): add user authentication
fix(api): handle network errors
docs(readme): update deployment steps
```

### Branch Strategy

- `main`: Production-ready code
- `develop`: Development branch
- `feature/*`: New features
- `fix/*`: Bug fixes

## 📑 Scripts

| Command               | Description                                       |
| --------------------- | ------------------------------------------------- |
| `pnpm dev`            | Start development server                          |
| `pnpm build`          | Create production build                           |
| `pnpm start`          | Start production server                           |
| `pnpm typecheck`      | Generate types and check TypeScript (emits files) |
| `pnpm types:generate` | Generate API types from OpenAPI spec              |
| `pnpm lint`           | Run ESLint                                        |
| `pnpm lint:fix`       | Fix ESLint issues                                 |
| `pnpm format`         | Format code with Prettier                         |
| `pnpm format:check`   | Check code formatting                             |
| `pnpm type-check`     | Run TypeScript type checking                      |
| `pnpm prepare`        | Setup Husky git hooks                             |
| `pnpm commit`         | Interactive conventional commit                   |
| `pnpm clean`          | Clean build directory                             |
| `pnpm lint-staged`    | Run linters on staged files                       |
| `pnpm test:e2e`       | Run End-to-End tests using Playwright             |

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for guidelines.

## License

MIT License - see [LICENSE](LICENSE)
