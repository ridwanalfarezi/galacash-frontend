# GalaCash

A modern financial management application built with React Router and TypeScript, designed to make managing finances more efficient and accessible.

## 🎯 Project Overview

GalaCash is a full-stack application that enables treasurers to track and manage both income and expenses while providing complete transparency on financial activities.

## 🛠 Tech Stack

- ⚛️ [React 19](https://react.dev/) with TypeScript
- 🛣️ [React Router v7](https://reactrouter.com/) for routing and SSR
- 🎨 [TailwindCSS](https://tailwindcss.com/) with custom theme
- 🎯 [TypeScript](https://www.typescriptlang.org/) for type safety
- 📦 [Vite](https://vitejs.dev/) for fast builds
- 🎭 [Shadcn UI](https://ui.shadcn.com/) - Accessible components built on Radix UI
- 🏗️ [Zustand](https://zustand-demo.pmnd.rs/) for state management
- ✨ [Zod](https://zod.dev/) for schema validation
- 📝 [React Hook Form](https://react-hook-form.com/) for form handling

## 🚀 Getting Started

### Prerequisites

- Node.js (LTS version) - specified in [.nvmrc](.nvmrc)
- npm or pnpm
- Git
- VS Code (recommended)

### First Time Setup

1. **Clone Repository**

   ```powershell
   git clone https://github.com/username/galacash.git
   cd galacash
   ```

2. **Setup Node.js**

   ```powershell
   # Install and use correct Node.js version
   nvm install lts/*
   nvm use lts/*
   ```

3. **Install Dependencies**

   ```powershell
   # Install project dependencies
   npm install

   # Setup Git hooks
   npm run prepare
   ```

4. **Configure Environment**

   ```powershell
   # Create local environment file
   copy .env.example .env
   ```

5. **VS Code Setup**
   Install recommended extensions:
   - ESLint
   - Prettier
   - Tailwind CSS IntelliSense
   - GitLens

### Development Workflow

1. **Start Development Server**

   ```powershell
   npm run dev
   ```

   Visit: http://localhost:5173

2. **Run Quality Checks**

   ```powershell
   # Type checking
   npm run typecheck

   # Lint code
   npm run lint

   # Format code
   npm run format
   ```

3. **Making Commits**

   ```powershell
   # Stage your changes
   git add .

   # Commit using conventional commits
   npm run commit
   ```

## 📦 Project Structure

```text
.
├── app/                      # Application source code
│   ├── app.css              # Global styles and Tailwind imports
│   ├── root.tsx             # Root layout and error boundaries
│   ├── routes.ts            # Route definitions
│   ├── components/          # Reusable components
│   │   └── ui/             # Shadcn UI components
│   │       └── button.tsx  # Button component
│   ├── lib/                # Utility functions
│   │   └── utils.ts       # Common utilities (cn, etc.)
│   ├── routes/             # Route components
│   │   └── home.tsx       # Home page route
│   └── welcome/            # Welcome module
│       └── welcome.tsx    # Welcome page component
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
│   └── components.json    # UI components config
│
├── Docker Files
│   ├── Dockerfile         # Multi-stage build config
│   └── .dockerignore     # Docker ignore patterns
│
├── Environment
│   ├── .nvmrc            # Node.js version
│   └── env.d.ts          # Environment variables types
│
└── Git Configuration
    ├── .gitignore        # Git ignore patterns
    └── .gitattributes    # Git attributes
```

## 🛠 Development Tools

### Code Quality Tools

- 🔍 ESLint with TypeScript and React plugins - [.eslintrc.json](d:\College\projects\galacash.eslintrc.json)
- 💅 Prettier with TailwindCSS plugin - [.prettierrc](d:\College\projects\galacash.prettierrc)
- 🐶 Husky for Git hooks
- 📝 Commitlint for conventional commits - [commitlint.config.js](d:\College\projects\galacash\commitlint.config.js)

## 🚀 Deployment

### Production Build

```bash
npm run build
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

| Command        | Description                         |
| -------------- | ----------------------------------- |
| `dev`          | Start development server            |
| `build`        | Create production build             |
| `start`        | Start production server             |
| `typecheck`    | Generate types and check TypeScript |
| `lint`         | Run ESLint                          |
| `lint:fix`     | Fix ESLint issues                   |
| `format`       | Format code with Prettier           |
| `format:check` | Check code formatting               |
| `type-check`   | Run TypeScript type checking        |
| `prepare`      | Setup Husky git hooks               |
| `commit`       | Interactive conventional commit     |
| `clean`        | Clean build directory               |
| `lint-staged`  | Run linters on staged files         |

## License

MIT License - see [LICENSE](LICENSE)
