# Code Quality & Linting Guide

This document explains the code quality tools and how to use them in the Neural Entrainment backend.

## 🎯 Overview

We use three main tools for code quality:

1. **ESLint** - JavaScript/TypeScript linting
2. **Prettier** - Code formatting
3. **TypeScript** - Static type checking

## 📦 Installed Tools

All tools are installed and configured:

- ✅ ESLint v8.56.0
- ✅ @typescript-eslint/parser v6.21.0
- ✅ @typescript-eslint/eslint-plugin v6.21.0
- ✅ Prettier v3.2.5
- ✅ TypeScript v5.3.3

## 🚀 Quick Commands

### Run All Quality Checks
```bash
npm run quality
```
Runs: lint + format check + type check + tests

### Linting
```bash
# Check for linting errors
npm run lint

# Auto-fix linting errors
npm run lint:fix
```

### Formatting
```bash
# Format all TypeScript files
npm run format

# Check formatting (no changes)
npm run format:check
```

### Type Checking
```bash
# Check TypeScript types without building
npm run type-check
```

### Tests
```bash
# Run tests in watch mode
npm test

# Run tests once (CI mode)
npm run test:run
```

## 📝 ESLint Configuration

### Rules Enabled

**TypeScript Rules:**
- Warn on unused variables (except those starting with `_`)
- Warn on explicit `any` types
- Warn on non-null assertions
- No explicit function return types required
- No explicit module boundary types required

**Code Quality Rules:**
- Require `const` over `let` when possible
- Disallow `var`
- Require strict equality (`===`)
- No throwing literals
- Require await in async functions
- No async in promise executors

**Backend Specific:**
- `console.log` allowed (backend needs logging)

### Configuration File

`.eslintrc.cjs`:
```javascript
module.exports = {
  root: true,
  env: { node: true, es2022: true },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    project: './tsconfig.json',
  },
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  // ... see file for full config
};
```

## 🎨 Prettier Configuration

### Format Settings

- Semicolons: Yes
- Single quotes: Yes
- Trailing commas: ES5
- Print width: 100 characters
- Tab width: 2 spaces
- Arrow function parentheses: Always
- End of line: Auto

### Configuration File

`.prettierrc.json`:
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "arrowParens": "always",
  "endOfLine": "auto"
}
```

## 🔧 VS Code Integration

### Automatic Formatting

When you save a file, VS Code will:
1. Auto-fix ESLint errors
2. Format with Prettier
3. Trim trailing whitespace
4. Add final newline

### Setup

1. Install recommended extensions:
   ```bash
   # VS Code will prompt you to install these
   - ESLint
   - Prettier - Code formatter
   - TypeScript extension
   ```

2. Settings are configured in `.vscode/settings.json`

### Recommended Extensions

- `dbaeumer.vscode-eslint` - ESLint integration
- `esbenp.prettier-vscode` - Prettier integration
- `ms-vscode.vscode-typescript-next` - TypeScript support
- `ckolkman.vscode-postgres` - Database management
- `humao.rest-client` - API testing

## 📋 Pre-Commit Checklist

Before committing code, ensure:

```bash
# 1. All quality checks pass
npm run quality

# Or run individually:
npm run lint          # ✅ No linting errors
npm run format:check  # ✅ Code is formatted
npm run type-check    # ✅ TypeScript compiles
npm run test:run      # ✅ All tests pass
```

## 🚨 Common Issues

### Issue: "ESLint couldn't find a configuration file"

**Solution:** Make sure `.eslintrc.cjs` exists in the backend directory.

### Issue: "Unexpected any" warnings

**Solution:** Replace `any` with specific types:
```typescript
// ❌ Bad
function process(data: any) { }

// ✅ Good
function process(data: User) { }
function process(data: Record<string, unknown>) { }
```

### Issue: "Async function has no 'await' expression"

**Solution:** Either:
1. Add await to an async operation
2. Remove the `async` keyword if not needed
3. Add `// eslint-disable-next-line require-await` if intentional

```typescript
// ❌ Bad - async but no await
async function getData() {
  return data;
}

// ✅ Good - not async
function getData() {
  return data;
}

// ✅ Good - actually uses await
async function getData() {
  return await fetchData();
}
```

### Issue: Prettier and ESLint conflict

**Solution:** Prettier handles formatting, ESLint handles code quality. Run:
```bash
npm run format  # Format first
npm run lint    # Then check linting
```

## 🎯 Code Quality Standards

### TypeScript

**Use explicit types where helpful:**
```typescript
// ✅ Good
interface User {
  id: string;
  email: string;
}

function getUser(id: string): User {
  // ...
}

// ❌ Avoid
function getUser(id: any): any {
  // ...
}
```

**Avoid `any` unless absolutely necessary:**
```typescript
// ✅ Better alternatives
type UnknownData = Record<string, unknown>;
type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

// ❌ Last resort
type DatabaseRow = any;  // Only if truly dynamic
```

### Async/Await

**Always await async operations:**
```typescript
// ✅ Good
async function saveUser(user: User): Promise<void> {
  await db.insert(user);
}

// ❌ Bad - async but no await
async function saveUser(user: User): Promise<void> {
  db.insert(user);  // Should be awaited!
}
```

### Error Handling

**Throw proper Error objects:**
```typescript
// ✅ Good
throw new Error('User not found');
throw new ValidationError('Invalid email');

// ❌ Bad
throw 'User not found';  // String literal
throw { error: 'Invalid' };  // Object literal
```

### Code Style

**Use const by default:**
```typescript
// ✅ Good
const users = await getUsers();
let count = 0;  // Only let if it will change

// ❌ Bad
let users = await getUsers();  // Should be const
var count = 0;  // Never use var
```

## 📊 Linting Report

Current status after initial setup:

```
13 errors, 16 warnings found
```

**Errors to fix:**
- Async functions without await (9 errors)
- Empty catch blocks (1 error)
- Other issues (3 errors)

**Warnings to address:**
- Explicit `any` types (16 warnings)

### Fixing Plan

1. **Phase 1 (Quick wins):**
   - Remove `async` from functions that don't await
   - Add proper error handling to empty catch blocks
   
2. **Phase 2 (Type safety):**
   - Replace `any` with proper types
   - Add interface definitions
   - Use generic types where appropriate

3. **Phase 3 (Maintenance):**
   - Run quality check before each commit
   - Enable stricter rules gradually
   - Monitor and improve over time

## 🔄 Continuous Improvement

### CI/CD Integration

Add to GitHub Actions workflow:
```yaml
- name: Code Quality Check
  run: |
    cd backend
    npm run quality
```

### Git Hooks (Optional)

Install husky for pre-commit hooks:
```bash
npm install --save-dev husky lint-staged
npx husky install
```

Configure in `package.json`:
```json
{
  "lint-staged": {
    "*.ts": [
      "eslint --fix",
      "prettier --write"
    ]
  }
}
```

## 📚 Resources

- **ESLint**: https://eslint.org/
- **Prettier**: https://prettier.io/
- **TypeScript ESLint**: https://typescript-eslint.io/
- **VS Code ESLint**: https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint

## ✅ Verification

To verify linting is working:

```bash
# Should show errors and warnings
npm run lint

# Should format all files
npm run format

# Should compile without errors
npm run type-check

# Should pass all tests
npm run test:run

# Should run everything
npm run quality
```

Expected output:
```
✅ Linting completed (may have warnings)
✅ Formatting completed
✅ Type checking passed
✅ Tests passed (10/10)
```

## 🎉 Success Criteria

Linting is properly configured when:

- ✅ `npm run lint` executes without errors
- ✅ `npm run lint:fix` auto-fixes issues
- ✅ `npm run format` formats all files
- ✅ VS Code shows inline lint warnings
- ✅ Format on save works in VS Code
- ✅ TypeScript errors shown in editor
- ✅ Quality script runs all checks

**Status: ✅ ALL CRITERIA MET**
