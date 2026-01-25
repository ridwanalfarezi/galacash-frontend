# Contributing to GalaCash Frontend

Thank you for your interest in contributing to the GalaCash Frontend! This document provides guidelines and information for contributors.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Making Contributions](#making-contributions)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)

## Code of Conduct

Please be respectful and constructive in all interactions. We aim to maintain a welcoming and inclusive community.

## Getting Started

### Prerequisites

- Node.js (LTS version) - see `.nvmrc`
- pnpm v10 or higher
- Git
- VS Code (recommended)

### Project Structure

This repository contains the frontend React application built with TypeScript and Vite.

```
galacash-frontend/
├── app/                  # Application source code
├── public/               # Static assets
└── types/                # Type definitions
```

## Development Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/ridwanalfarezi/galacash-frontend.git
   cd galacash-frontend
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Start development server**
   ```bash
   pnpm dev
   ```

## Making Contributions

### Types of Contributions

- 🐛 **Bug fixes**: Found a bug? Open an issue or submit a PR
- ✨ **Features**: New features are welcome! Please discuss larger changes first
- 📝 **Documentation**: Help improve our docs
- 🧪 **Tests**: Additional test coverage is always appreciated

### Workflow

1. **Fork** the repository
2. **Create a branch** from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```
3. **Make your changes**
4. **Test your changes**
5. **Commit** using conventional commits:
   ```bash
   git commit -m "feat(scope): add new feature"
   git commit -m "fix(scope): fix bug description"
   ```
6. **Push** to your fork
7. **Open a Pull Request**

## Pull Request Process

1. Ensure your code follows the project's coding standards
2. Update documentation if needed
3. Ensure all checks pass (`pnpm typecheck`, `pnpm lint`)
4. Request review from maintainers
5. Address any feedback

### Commit Convention

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): description

feat:     New feature
fix:      Bug fix
docs:     Documentation only
style:    Formatting, no code change
refactor: Code restructuring
test:     Adding tests
chore:    Maintenance tasks
```

## Coding Standards

### TypeScript

- Use strict mode
- Avoid `any` types
- Use proper typing for all functions and variables

### React & Frontend

- Use functional components with hooks
- Follow React best practices
- Use Tailwind CSS for styling
- Use Shadcn UI components where possible
- Ensure accessibility (a11y) standards

### Code Quality

```bash
# Run linting
pnpm lint

# Fix lint issues
pnpm lint:fix

# Format code
pnpm format

# Type checking
pnpm typecheck
```

## Questions?

Feel free to open an issue for any questions or concerns.

---

Thank you for contributing! 🎉
