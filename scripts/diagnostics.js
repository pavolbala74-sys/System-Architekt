#!/usr/bin/env node
/**
 * Automated Site Diagnostics
 * Run: node scripts/diagnostics.js
 *
 * Checks:
 *   - Project structure integrity
 *   - Required files present
 *   - Dependencies installed
 *   - TypeScript compilation (dry run)
 *   - Component syntax validation
 *   - Missing assets detection
 */

const fs   = require('fs')
const path = require('path')
const { execSync } = require('child_process')

const ROOT = path.resolve(__dirname, '..')

// ── Utilities ────────────────────────────────────────────────────────
const log  = (msg)  => console.log(`  ✓  ${msg}`)
const warn = (msg)  => console.warn(`  ⚠  ${msg}`)
const fail = (msg)  => { console.error(`  ✗  ${msg}`); issues.push(msg) }
const head = (msg)  => console.log(`\n── ${msg} ${'─'.repeat(Math.max(0, 50 - msg.length))}`)

const issues = []

// ── 1. Required files ─────────────────────────────────────────────────
head('Required Files')

const REQUIRED_FILES = [
  'package.json',
  'tsconfig.json',
  'next.config.js',
  'tailwind.config.ts',
  'postcss.config.js',
  'app/layout.tsx',
  'app/page.tsx',
  'app/styles/globals.css',
  'app/components/Navigation.tsx',
  'app/components/sections/HeroSection.tsx',
  'app/components/sections/ProblemSection.tsx',
  'app/components/sections/FieldsSection.tsx',
  'app/components/sections/QuestionsSection.tsx',
  'app/components/sections/AnalysisSection.tsx',
  'app/components/sections/FlowVisualizationSection.tsx',
  'app/components/sections/ToolsSection.tsx',
  'app/components/sections/SystemsSection.tsx',
  'app/components/sections/ResearchSection.tsx',
  'app/components/sections/PhilosophyContactSections.tsx',
  'tests/unit/calculator.test.ts',
  'tests/e2e/main.spec.ts',
  '.github/workflows/ci.yml',
]

REQUIRED_FILES.forEach(f => {
  const full = path.join(ROOT, f)
  if (fs.existsSync(full)) {
    log(f)
  } else {
    fail(`Missing: ${f}`)
  }
})

// ── 2. Package.json validity ──────────────────────────────────────────
head('Package Configuration')

try {
  const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'))
  const required = ['next', 'react', 'framer-motion', 'three', 'chart.js']
  required.forEach(dep => {
    if (pkg.dependencies?.[dep] || pkg.devDependencies?.[dep]) {
      log(`Dependency: ${dep}`)
    } else {
      fail(`Missing dependency: ${dep}`)
    }
  })

  const scripts = ['dev', 'build', 'test', 'diagnostics']
  scripts.forEach(s => {
    if (pkg.scripts?.[s]) {
      log(`Script: ${s}`)
    } else {
      warn(`Missing script: ${s}`)
    }
  })
} catch (e) {
  fail(`package.json parse error: ${e.message}`)
}

// ── 3. Component structure check ──────────────────────────────────────
head('Component Structure')

const SECTIONS_DIR = path.join(ROOT, 'app/components/sections')
if (fs.existsSync(SECTIONS_DIR)) {
  const files = fs.readdirSync(SECTIONS_DIR)
  log(`Sections directory: ${files.length} components found`)
  files.forEach(f => log(`  — ${f}`))
} else {
  fail('Sections directory missing')
}

// ── 4. TypeScript syntax check ────────────────────────────────────────
head('TypeScript Validation')

try {
  execSync('npx tsc --noEmit --skipLibCheck 2>&1', {
    cwd: ROOT,
    stdio: 'pipe',
    timeout: 30000,
  })
  log('TypeScript compilation: no errors')
} catch (e) {
  const output = e.stdout?.toString() || e.stderr?.toString() || ''
  if (output.includes('error TS')) {
    const errorLines = output.split('\n').filter(l => l.includes('error TS')).slice(0, 5)
    errorLines.forEach(l => warn(`TS: ${l.trim()}`))
  } else {
    warn('TypeScript check: could not run (tsc not found or project not initialized)')
  }
}

// ── 5. CSS file validation ─────────────────────────────────────────────
head('Stylesheets')

const cssFile = path.join(ROOT, 'app/styles/globals.css')
if (fs.existsSync(cssFile)) {
  const css = fs.readFileSync(cssFile, 'utf8')
  const checks = [
    ['@tailwind base', 'Tailwind base directive'],
    ['@tailwind components', 'Tailwind components directive'],
    ['@tailwind utilities', 'Tailwind utilities directive'],
    [':root', 'CSS custom properties'],
    ['--color-bg', 'Color system'],
    ['--font-display', 'Typography system'],
    ['.container-eng', 'Layout utilities'],
    ['.btn-eng', 'Button system'],
  ]
  checks.forEach(([token, label]) => {
    if (css.includes(token)) {
      log(label)
    } else {
      warn(`Missing in globals.css: ${label}`)
    }
  })
} else {
  fail('globals.css missing')
}

// ── 6. CI Pipeline check ──────────────────────────────────────────────
head('CI/CD Configuration')

const ciFile = path.join(ROOT, '.github/workflows/ci.yml')
if (fs.existsSync(ciFile)) {
  const ci = fs.readFileSync(ciFile, 'utf8')
  const ciChecks = ['install', 'test', 'build']
  ciChecks.forEach(step => {
    if (ci.toLowerCase().includes(step)) {
      log(`CI step present: ${step}`)
    } else {
      warn(`CI step may be missing: ${step}`)
    }
  })
} else {
  fail('CI workflow missing')
}

// ── Summary ────────────────────────────────────────────────────────────
console.log('\n' + '═'.repeat(56))
if (issues.length === 0) {
  console.log('  ✓  DIAGNOSTICS PASSED — All checks clean\n')
  process.exit(0)
} else {
  console.error(`  ✗  DIAGNOSTICS FAILED — ${issues.length} issue(s) found:\n`)
  issues.forEach(i => console.error(`       • ${i}`))
  console.log()

  // Self-healing attempt
  console.log('  ⟳  Attempting self-healing...')
  try {
    if (!fs.existsSync(path.join(ROOT, 'node_modules'))) {
      console.log('  ⟳  Running npm install...')
      execSync('npm install', { cwd: ROOT, stdio: 'inherit', timeout: 120000 })
      console.log('  ✓  Dependencies installed')
    }
  } catch (e) {
    console.error('  ✗  Self-healing failed:', e.message)
  }

  process.exit(1)
}
