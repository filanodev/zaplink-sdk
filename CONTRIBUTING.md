# Contributing to Zaplink SDK

Thank you for your interest in contributing to Zaplink SDK! This document provides guidelines and instructions for contributing.

## Getting Started

1. **Fork the repository**
2. **Clone your fork**
   ```bash
   git clone https://github.com/your-username/zaplink-sdk.git
   cd zaplink-sdk
   ```

3. **Install dependencies**
   ```bash
   pnpm install
   ```

4. **Build all packages**
   ```bash
   pnpm build
   ```

## Development Workflow

### Project Structure

```
zaplink-sdk/
├── packages/
│   ├── core/      # @zaplink/core - Vanilla JS SDK
│   ├── react/     # @zaplink/react - React hooks & components
│   ├── vue/       # @zaplink/vue - Vue composables (planned)
│   ├── next/      # @zaplink/next - Next.js integration (planned)
│   └── nuxt/      # @zaplink/nuxt - Nuxt module (planned)
├── examples/
│   └── react-example/  # React example app
└── docs/          # Documentation
```

### Building Packages

```bash
# Build all packages
pnpm build

# Build specific package
cd packages/core
pnpm build

# Watch mode for development
pnpm dev
```

### Running Examples

```bash
cd examples/react-example
pnpm install
pnpm dev
```

### Testing

```bash
# Run all tests
pnpm test

# Run tests for specific package
cd packages/core
pnpm test
```

### Linting

```bash
# Lint all packages
pnpm lint

# Lint specific package
cd packages/react
pnpm lint
```

## Making Changes

### Branch Naming

- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring

Example: `feature/add-vue-support`

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Code style changes
- `refactor`: Refactoring
- `test`: Tests
- `chore`: Build/config changes

Examples:
```
feat(react): add useTransactions hook
fix(core): handle authentication timeout
docs(readme): update installation instructions
```

## Pull Request Process

1. **Create a pull request** with a clear description
2. **Link related issues** using keywords (Fixes #123)
3. **Ensure tests pass** and code is linted
4. **Update documentation** if needed
5. **Wait for review** from maintainers

### PR Checklist

- [ ] Code builds successfully
- [ ] Tests pass
- [ ] Documentation updated
- [ ] Commit messages follow conventions
- [ ] No breaking changes (or clearly documented)

## Adding a New Package

To add a new framework integration:

1. Create package directory in `packages/`
2. Set up `package.json` with dependencies
3. Add TypeScript configuration
4. Implement the integration using `@zaplink/core`
5. Write documentation and examples
6. Add tests

## Code Style

- Use TypeScript for all code
- Follow ESLint configuration
- Write clear, descriptive variable names
- Add JSDoc comments for public APIs
- Keep functions small and focused

## Documentation

- Update README files for affected packages
- Add JSDoc comments to public APIs
- Create examples for new features
- Keep documentation up-to-date

## Questions or Need Help?

- Open an issue for discussion
- Join our community (link coming soon)
- Email: support@piketplace.com

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

Thank you for contributing to Zaplink SDK! 🚀
