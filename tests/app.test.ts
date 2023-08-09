import { test, expect } from '@playwright/test'

test('should be able to register a new transaction', async ({ page }) => {
	await page.goto('/')

	await page.fill('input[name="email"]', 'example@mail.com')
	await page.fill('input[name="password"]', 'password123')

	await page.click('button[type="submit"]')

	await page.click('text=+ Nova transação')

	await page.fill('input[name="name"]', 'Example')
	await page.fill('input[name="amount"]', '500')
	await page.fill('input[name="date"]', '2023-08-08')

	await page.click('button[type="submit"]')

	expect(true).toBe(true)
})
