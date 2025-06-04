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

- Node.js (LTS version) - specified in [.nvmrc](d:\College\projects\galacash.nvmrc)
- npm or pnpm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Visit `http://localhost:5173` - configured in [vite.config.ts](d:\College\projects\galacash\vite.config.ts)

## 📝 Code Quality

```bash
# Type checking
npm run typecheck

# Lint code
npm run lint

# Format code
npm run format
```

## 📦 Project Structure

```
app/
├── components/     # Reusable UI components
│   └── ui/        # Shadcn UI components
├── lib/           # Utility functions
│   └── utils.ts   # Common utilities
├── routes/        # Application routes
│   └── home.tsx   # Home page route
└── welcome/       # Welcome components
    └── welcome.tsx
```

## 🛠 Development Tools

### Code Quality Tools

- 🔍 ESLint with TypeScript and React plugins - [.eslintrc.json](d:\College\projects\galacash.eslintrc.json)
- 💅 Prettier with TailwindCSS plugin - [.prettierrc](d:\College\projects\galacash.prettierrc)
- 🐶 Husky for Git hooks
- 📝 Commitlint for conventional commits - [commitlint.config.js](d:\College\projects\galacash\commitlint.config.js)

### VS Code Integration

Configured in [.vscode/](d:\College\projects\galacash.vscode):

- Format on save
- ESLint auto-fix
- Tailwind CSS IntelliSense
- TypeScript path aliases

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

### Pre-commit Hooks

Configured in [.lintstagedrc.json](d:\College\projects\galacash.lintstagedrc.json):

- ESLint for `.ts`/`.tsx` files
- Prettier for all supported files
- TypeScript type checking

### Commit Message Format

```
type(scope): subject

Examples:
feat(auth): add login page
fix(api): handle error responses
docs(readme): update installation steps
```

## 📜 Available Scripts

- `dev` - Start development server
- `build` - Create production build
- `start` - Start production server
- `typecheck` - Run TypeScript checks
- `lint` - Run ESLint
- `lint:fix` - Fix ESLint issues
- `format` - Format with Prettier
- `clean` - Clean build directory
- `commit` - Commit with conventional format

## License

This project is licensed under the MIT License.
