import { test, expect } from '@playwright/test'

test.describe('Balazik Engineering — E2E Tests', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  // ── Hero Section ────────────────────────────────────────────────────
  test('hero section renders headline and author name', async ({ page }) => {
    await expect(page.getByText('Engineering')).toBeVisible()
    await expect(page.getByText('Pavol Baláž')).toBeVisible()
    await expect(page.getByText('Independent Systems Architect')).toBeVisible()
  })

  test('hero expertise tags are visible', async ({ page }) => {
    const tags = ['Energy Systems', 'Friction Reduction', 'Hydrodynamics', 'Aerodynamics', 'System Optimization']
    for (const tag of tags) {
      await expect(page.getByText(tag)).toBeVisible()
    }
  })

  // ── Navigation ──────────────────────────────────────────────────────
  test('navigation contains all expected links', async ({ page }) => {
    const navLabels = ['Problem', 'Fields', 'Analysis', 'Tools', 'Systems', 'Philosophy', 'Contact']
    for (const label of navLabels) {
      await expect(page.getByRole('link', { name: label })).toBeVisible()
    }
  })

  test('navigation scrolls to section on click', async ({ page }) => {
    await page.getByRole('link', { name: 'Problem' }).first().click()
    await page.waitForTimeout(800)
    const section = page.locator('#problem')
    await expect(section).toBeInViewport()
  })

  test('navigation becomes opaque on scroll', async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, 200))
    await page.waitForTimeout(400)
    const nav = page.locator('nav').first()
    const bg = await nav.evaluate(el => getComputedStyle(el).backgroundColor)
    // After scroll, nav should have a non-transparent background
    expect(bg).not.toBe('rgba(0, 0, 0, 0)')
  })

  // ── Problem Section ─────────────────────────────────────────────────
  test('problem section displays loss categories', async ({ page }) => {
    await page.locator('#problem').scrollIntoViewIfNeeded()
    const categories = ['Friction', 'Turbulence', 'Drag', 'Hidden Losses']
    for (const cat of categories) {
      await expect(page.getByText(cat)).toBeVisible()
    }
  })

  // ── Energy Loss Calculator ──────────────────────────────────────────
  test('calculator renders with default inputs', async ({ page }) => {
    await page.locator('#tools').scrollIntoViewIfNeeded()
    await expect(page.getByText('Energy Loss Calculator')).toBeVisible()
    await expect(page.locator('select')).toBeVisible()
  })

  test('calculator updates results when velocity changes', async ({ page }) => {
    await page.locator('#tools').scrollIntoViewIfNeeded()
    const velocitySlider = page.locator('input[type="range"]').first()

    // Get initial aero drag value
    const initial = await page.getByText(/N$/).first().textContent()

    // Change velocity slider
    await velocitySlider.evaluate(el => {
      (el as HTMLInputElement).value = '200'
      el.dispatchEvent(new Event('input', { bubbles: true }))
    })

    await page.waitForTimeout(500)
    const updated = await page.getByText(/N$/).first().textContent()
    expect(updated).not.toBe(initial)
  })

  test('calculator system type selector changes outputs', async ({ page }) => {
    await page.locator('#tools').scrollIntoViewIfNeeded()
    const select = page.locator('select')

    await select.selectOption('ship')
    await page.waitForTimeout(300)
    await expect(page.getByText('Marine Vessel')).toBeVisible()
  })

  // ── Flow Visualization ──────────────────────────────────────────────
  test('flow visualization renders with mode buttons', async ({ page }) => {
    await page.getByText('Laminar Flow').first().scrollIntoViewIfNeeded()
    await expect(page.getByText('Laminar Flow').first()).toBeVisible()
    await expect(page.getByText('Turbulent Flow').first()).toBeVisible()
    await expect(page.getByText('Boundary Layer').first()).toBeVisible()
  })

  test('flow visualization switches mode on button click', async ({ page }) => {
    await page.getByText('Turbulent Flow').first().click()
    await page.waitForTimeout(300)
    // Re button should now have active styling (bg-blue)
    const turbBtn = page.getByText('Turbulent Flow').first()
    const bg = await turbBtn.evaluate(el => getComputedStyle(el).backgroundColor)
    expect(bg).not.toBe('rgba(0, 0, 0, 0)')
  })

  // ── Systems Section ─────────────────────────────────────────────────
  test('systems section tabs switch content', async ({ page }) => {
    await page.locator('#systems').scrollIntoViewIfNeeded()
    await page.getByRole('button', { name: 'Marine Vessel' }).click()
    await page.waitForTimeout(400)
    await expect(page.getByText('Wave-making resistance')).toBeVisible()
  })

  // ── Contact Section ─────────────────────────────────────────────────
  test('contact section renders form fields', async ({ page }) => {
    await page.locator('#contact').scrollIntoViewIfNeeded()
    await expect(page.getByPlaceholder('Your name')).toBeVisible()
    await expect(page.getByPlaceholder('your@email.com')).toBeVisible()
    await expect(page.getByPlaceholder(/Describe the system/)).toBeVisible()
  })

  test('contact form shows confirmation on submit', async ({ page }) => {
    await page.locator('#contact').scrollIntoViewIfNeeded()
    await page.getByPlaceholder('Your name').fill('Test Engineer')
    await page.getByPlaceholder('your@email.com').fill('test@example.com')
    await page.getByPlaceholder(/Describe the system/).fill('Testing contact form submission.')
    await page.getByRole('button', { name: /Send Message/ }).click()
    await expect(page.getByText('Message received')).toBeVisible()
  })

  // ── Responsiveness ──────────────────────────────────────────────────
  test('page is responsive on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await expect(page.getByText('Pavol Baláž')).toBeVisible()
    await expect(page.getByText('Engineering')).toBeVisible()
  })

  // ── Accessibility ───────────────────────────────────────────────────
  test('page has meaningful title', async ({ page }) => {
    const title = await page.title()
    expect(title).toContain('Pavol')
  })

  test('canvases have aria-label attributes', async ({ page }) => {
    const canvases = page.locator('canvas[aria-label]')
    const count = await canvases.count()
    expect(count).toBeGreaterThan(0)
  })

  // ── Performance ─────────────────────────────────────────────────────
  test('page loads within 5 seconds', async ({ page }) => {
    const start = Date.now()
    await page.goto('/', { waitUntil: 'domcontentloaded' })
    const duration = Date.now() - start
    expect(duration).toBeLessThan(5000)
  })
})
