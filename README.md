# Pavol Baláž — Engineering Laboratory

**Independent Systems Architect** | Energy Efficiency · Friction Reduction · Hydrodynamics · Aerodynamics

---

## Overview

A world-class engineering laboratory website combining:

- **Research Laboratory** — Scientific visualisations and analytical frameworks
- **Interactive Tools** — Energy loss calculator and flow visualisation
- **Deep-Tech Consulting Studio** — Systems architecture expertise

---

## Technology Stack

| Layer        | Technology                          |
|-------------|-------------------------------------|
| Framework   | Next.js 14 (App Router)             |
| Language    | TypeScript                          |
| Styling     | Tailwind CSS + Custom CSS Variables |
| Animation   | Framer Motion                       |
| Visualisation | Canvas API (flow simulation)      |
| Charts      | Chart.js / react-chartjs-2          |
| Testing     | Jest + Playwright + RTL             |
| CI/CD       | GitHub Actions → Vercel             |

---

## Project Structure

```
balazik-engineering/
├── app/
│   ├── components/
│   │   ├── Navigation.tsx
│   │   ├── ErrorBoundary.tsx
│   │   └── sections/
│   │       ├── HeroSection.tsx
│   │       ├── ProblemSection.tsx
│   │       ├── FieldsSection.tsx
│   │       ├── QuestionsSection.tsx
│   │       ├── AnalysisSection.tsx
│   │       ├── FlowVisualizationSection.tsx
│   │       ├── ToolsSection.tsx
│   │       ├── SystemsSection.tsx
│   │       ├── ResearchSection.tsx
│   │       └── PhilosophyContactSections.tsx
│   ├── lib/
│   │   └── physics.ts          # Physics utility functions
│   ├── styles/
│   │   └── globals.css         # Design system & tokens
│   ├── layout.tsx
│   └── page.tsx
├── tests/
│   ├── unit/
│   │   └── calculator.test.ts  # Jest unit tests
│   ├── e2e/
│   │   └── main.spec.ts        # Playwright E2E tests
│   └── setup.ts
├── scripts/
│   └── diagnostics.js          # Automated diagnostics + self-healing
└── .github/
    └── workflows/
        └── ci.yml              # Full CI/CD pipeline
```

---

## Getting Started

### Prerequisites

- Node.js 20+
- npm 10+

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
npm run build
npm start
```

---

## Testing

### Unit Tests (Jest)

```bash
npm test
```

Tests the Energy Loss Calculator physics logic with 15+ test cases covering:
- Basic physics validation
- Velocity quadratic scaling (F_d ∝ v²)
- System type switching (air vs water density)
- Edge cases and boundary conditions

### E2E Tests (Playwright)

```bash
# Install browsers first
npx playwright install

# Run tests
npm run test:e2e
```

Covers:
- Hero section rendering
- Navigation functionality
- Calculator interactivity
- Flow visualization modes
- System tabs switching
- Contact form submission
- Mobile responsiveness
- Accessibility attributes
- Performance (< 5s load)

### Diagnostics

```bash
npm run diagnostics
```

Checks:
- Required files present
- Dependency integrity
- TypeScript validity
- CSS design tokens
- CI configuration

Attempts self-healing (npm install) if issues detected.

---

## CI/CD Pipeline

GitHub Actions workflow (`.github/workflows/ci.yml`):

```
push/PR → Validate (TS + Lint + Unit Tests)
        → Diagnostics
        → Production Build
        → E2E Tests
        → Deploy to Vercel (main branch only)
```

### Required Secrets

| Secret              | Description              |
|--------------------|--------------------------|
| `VERCEL_TOKEN`     | Vercel deploy token      |
| `VERCEL_ORG_ID`    | Vercel organisation ID   |
| `VERCEL_PROJECT_ID`| Vercel project ID        |

---

## Design System

### Typography

| Role    | Font              | Usage                     |
|---------|-------------------|---------------------------|
| Display | DM Serif Display  | Headings, pull quotes     |
| Body    | DM Sans           | Paragraph text, UI labels |
| Mono    | JetBrains Mono    | Data, formulas, codes     |

### Colour Palette

| Token                    | Value     | Usage                    |
|--------------------------|-----------|--------------------------|
| `--color-bg`            | `#F8F9FA` | Primary background       |
| `--color-navy`          | `#0D1B2A` | Dark sections            |
| `--color-blue-accent`   | `#2563A8` | Primary accent           |
| `--color-steel`         | `#9AA0A8` | Secondary/muted elements |
| `--color-text-primary`  | `#1C2128` | Primary text             |

---

## Physics Library (`app/lib/physics.ts`)

Utility functions for engineering calculations:

```typescript
reynoldsNumber(velocity, length, fluid)  // Re = ρvL/μ
flowRegime(re)                           // laminar | transitional | turbulent
dragForce(rho, v, cd, A)                 // F_d = ½ρv²CdA
dragPower(F_drag, v)                     // P = F_d · v
darcyWeisbach(f, L, D, rho, v)           // ΔP = f(L/D)(½ρv²)
frictionFactor(re, roughness)            // Swamee-Jain approximation
```

---

## Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Environment Variables

No environment variables required for the base website.

---

## Section Architecture

| Section              | Key Feature                                      |
|---------------------|--------------------------------------------------|
| Hero                | Canvas flow line animation, expertise tags       |
| Problem             | Animated loss bars, statistics                   |
| Engineering Fields  | 6 domain cards, dark theme                       |
| Questions           | Hover-reveal engineering questions               |
| Friction Analysis   | SVG boundary layer + laminar/turbulent diagrams  |
| Flow Visualization  | Interactive particle simulation (3 modes)        |
| Energy Calculator   | Real-time physics calculator with gauge charts   |
| Real Systems        | 4 system types with tabbed loss breakdowns       |
| Research Concepts   | 3 analytical frameworks                          |
| Philosophy          | 4 engineering principles                         |
| Contact             | Form with validation and confirmation            |

---

*Designed to feel like entering a quiet aerospace research laboratory.*
