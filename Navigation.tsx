name: CI Pipeline — Balazik Engineering

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

env:
  NODE_VERSION: '20'

jobs:
  # ── 1. Type Check ──────────────────────────────────────────────────
  typecheck:
    name: TypeScript Type Check
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: npm
      - run: npm ci
      - run: npm run type-check

  # ── 2. Lint ────────────────────────────────────────────────────────
  lint:
    name: ESLint
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: npm
      - run: npm ci
      - run: npm run lint

  # ── 3. Unit Tests ──────────────────────────────────────────────────
  unit-tests:
    name: Unit Tests (Jest)
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: npm
      - run: npm ci
      - run: npm test -- --passWithNoTests --coverage
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: coverage-report
          path: coverage/

  # ── 4. Diagnostics ─────────────────────────────────────────────────
  diagnostics:
    name: Project Diagnostics
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: npm
      - run: npm ci
      - run: npm run diagnostics
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: diagnostics-log
          path: diagnostics.log

  # ── 5. Build ───────────────────────────────────────────────────────
  build:
    name: Production Build
    runs-on: ubuntu-latest
    needs: [typecheck, lint, unit-tests, diagnostics]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: npm
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-artifact@v4
        with:
          name: next-build
          path: .next/

  # ── 6. E2E Tests ───────────────────────────────────────────────────
  e2e:
    name: E2E Tests (Playwright)
    runs-on: ubuntu-latest
    needs: [build]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: npm
      - run: npm ci
      - run: npx playwright install --with-deps chromium
      - name: Download build
        uses: actions/download-artifact@v4
        with:
          name: next-build
          path: .next/
      - run: npm run test:e2e
        env:
          CI: true
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: playwright-report/

  # ── 7. Deploy (main only) ──────────────────────────────────────────
  deploy:
    name: Deploy to Production
    runs-on: ubuntu-latest
    needs: [build, e2e]
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    steps:
      - uses: actions/checkout@v4
      - name: Deploy notification
        run: |
          echo "✓ All checks passed"
          echo "✓ Production build validated"
          echo "✓ E2E tests passed"
          echo "→ Deploying to production..."
          echo "  Configure deployment target (Vercel/Netlify/custom) in repository secrets"
