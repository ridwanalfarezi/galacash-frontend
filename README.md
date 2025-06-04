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
app/                   # Application source code
├── [app.css](http://_vscodecontentref_/0)           # Global styles and Tailwind imports
├── [root.tsx](http://_vscodecontentref_/1)          # Root layout and error handling
├── [routes.ts](http://_vscodecontentref_/2)         # Route configuration
├── components/       # Reusable UI components
│   └── ui/          # Shadcn UI components (Button, etc.)
├── lib/             # Utility functions
│   └── [utils.ts](http://_vscodecontentref_/3)     # Common utilities (cn, etc.)
├── routes/          # Route components
│   └── [home.tsx](http://_vscodecontentref_/4)     # Home page route
└── welcome/         # Welcome module
    └── [welcome.tsx](http://_vscodecontentref_/5)  # Welcome page component

config/              # Configuration files
├── [.eslintrc.json](http://_vscodecontentref_/6)   # ESLint configuration
├── .prettierrc      # Prettier configuration
├── [tsconfig.json](http://_vscodecontentref_/7)    # TypeScript configuration
├── [vite.config.ts](http://_vscodecontentref_/8)   # Vite configuration
└── [components.json](http://_vscodecontentref_/9)  # UI components configuration

.husky/              # Git hooks
├── pre-commit       # Pre-commit hooks (lint, format)
├── commit-msg       # Commit message validation
└── [husky.sh](http://_vscodecontentref_/10)      # Husky shell script

.vscode/             # VS Code settings
├── [settings.json](http://_vscodecontentref_/11)    # Editor configuration
└── [launch.json](http://_vscodecontentref_/12)     # Debug configuration
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

| Command     | Description              |
| ----------- | ------------------------ |
| `dev`       | Start dev server         |
| `build`     | Create production build  |
| `preview`   | Preview production build |
| `lint`      | Run ESLint               |
| `typecheck` | Run type checking        |
| `format`    | Format code              |
| `commit`    | Interactive commit       |

## License

MIT License - see [LICENSE](LICENSE)
