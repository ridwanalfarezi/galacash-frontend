# GalaCash

A fun and transparent cash flow management application designed to make managing finances more efficient and accessible for everyone.

## 🎯 Project Overview

GalaCash enables treasurers to easily track and manage both income and expenses, while providing complete transparency on financial activities, without the usual administrative headache.

### 🔍 Background

**Problem:** Managing finances, especially in a group or community setting, can be frustrating and prone to errors. Traditional manual methods often lead to confusion and lack of transparency.

**Solution:** GalaCash offers an intuitive platform where all financial activities are logged and accessible to members in real-time, minimizing the potential for mistakes and maximizing efficiency.

## 🚀 Core Features

### 💰 Income & Expense Management

- Track all transactions with detailed categorization
- Add, edit, or delete income/expense entries
- Easy-to-use category selection

### 🔐 Anytime Access

- Individual user accounts
- Real-time financial monitoring
- Authorized access control

### 📝 Fund Request Submissions

- Submit and track fund requests
- Structured approval workflow
- Notification system for request status

### 📊 Automatic Financial Reports

- Scheduled report generation
- Viewable, downloadable, and shareable formats
- Comprehensive financial overview

### 🔔 Push Notifications

- Transaction alerts
- Fund request status updates
- Real-time activity notifications

## ✨ Why GalaCash?

- **Transparency:** Clear recording and visibility of all financial transactions
- **Time Efficiency:** Eliminates manual bookkeeping needs
- **Accountability:** Complete transaction documentation
- **Accurate Data:** Automated recording reduces human error

## 👥 Team Contributors

### Project Manager

- Ridwan

### UI/UX Design

- Giwank

### Frontend Development

- Dipta
- Nando

### Backend Development

- Rafly
- Ricky

### Mobile Development

- Akmal

## 🎯 Key Objectives

1. Design an intuitive interface for simplified cash flow management
2. Develop secure backend features for transaction tracking
3. Implement real-time notifications and updates
4. Generate automated financial reports

## 🛠 Tech Stack

- ⚛️ [React 19](https://react.dev/) - Frontend framework
- 🛣️ [React Router](https://reactrouter.com/) - Routing and server-side rendering
- 🎨 [TailwindCSS](https://tailwindcss.com/) - Styling
- 🎯 [TypeScript](https://www.typescriptlang.org/) - Type safety
- 📦 [Vite](https://vitejs.dev/) - Build tool
- 🐋 [Docker](https://www.docker.com/) - Containerization

## Development Tools

- 🔍 [ESLint](https://eslint.org/) - Linting
- 💅 [Prettier](https://prettier.io/) - Code formatting
- 🐶 [Husky](https://typicode.github.io/husky/) - Git hooks
- 📝 [Commitlint](https://commitlint.js.org/) - Commit message linting

## 🚀 Getting Started

### Prerequisites

- Node.js (LTS version)
- npm or pnpm

### Installation

```bash
# Install dependencies
npm install
```

### Development

```bash
# Start development server
npm run dev
```

Visit `http://localhost:5173` in your browser.

### Code Quality

```bash
# Type checking
npm run type-check

# Lint code
npm run lint

# Format code
npm run format
```

## 📦 Project Structure

```
app/
├── components/     # Reusable UI components
│   └── ui/        # Core UI components
├── lib/           # Utility functions
├── routes/        # Application routes
└── welcome/       # Welcome page components
```

## 🔨 Development

### Production Build

```bash
npm run build
```

### Docker Deployment

```bash
# Build image
docker build -t galacash .

# Run container
docker run -p 3000:3000 galacash
```

## Git Workflow

This project uses conventional commits and enforces code quality through git hooks:

- Pre-commit: Runs linting, formatting, and type checking
- Commit message: Enforces conventional commit format

### Commit Message Format

```
type(scope): subject

Examples:
feat(auth): add login page
fix(api): handle error responses
docs(readme): update installation steps
```

## Code Style Guide

- ESLint configuration in [.eslintrc.json](d:\College\projects\galacash.eslintrc.json)
- Prettier configuration in [.prettierrc](d:\College\projects\galacash.prettierrc)
- TypeScript configuration in [tsconfig.json](d:\College\projects\galacash\tsconfig.json)

## Scripts

- `dev` - Start development server
- `build` - Create production build
- `start` - Start production server
- `typecheck` - Run TypeScript type checking
- `lint` - Run ESLint
- `lint:fix` - Fix ESLint issues
- `format` - Format code with Prettier
- `type-check` - Run TypeScript compiler

## 📝 License

This project is licensed under the MIT License.
