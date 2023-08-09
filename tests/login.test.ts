import { expect, test } from '@playwright/test'

test('should be able to login', async ({ page }) => {
	await page.goto('/')

	await page.fill('input[name="email"]', 'example@mail.com')
	await page.fill('input[name="password"]', 'password123')

	await page.click('button[type="submit"]')

	expect(page.url()).toBe('http://localhost:4173/app')
})
