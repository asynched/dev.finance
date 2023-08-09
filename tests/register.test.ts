import { test, expect } from '@playwright/test'

test('should be able to register a user', async ({ page }) => {
	await page.goto('/register')

	await page.fill('input[name="name"]', 'Example')
	await page.fill('input[name="email"]', 'example@mail.com')
	await page.fill('input[name="password"]', 'password123')

	await page.click('button[type="submit"]')

	expect(page.url()).toBe('http://localhost:4173/')
})
