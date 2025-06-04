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

### Troubleshooting

- **Git Hooks Not Running**

  ```powershell
  npm run prepare
  ```

- **Path Aliases Not Working**

  - Restart TypeScript Server in VS Code
  - Command Palette (`Ctrl + Shift + P`): `TypeScript: Restart TS Server`

- **Tailwind Classes Not Working**
  - Verify your [components.json](components.json) exists
  - Restart VS Code
  - Restart dev server: `npm run dev`

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
