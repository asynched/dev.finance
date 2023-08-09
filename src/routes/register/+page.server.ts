import { object, string } from 'zod'
import type { Actions } from './$types'
import { fail, redirect } from '@sveltejs/kit'
import { db } from '@/shared/prisma'
import { hashPassword } from '@/utils/crypto'

const registerSchema = object({
	name: string().max(255),
	email: string().email().max(255),
	password: string().min(8).max(255),
})

export const actions: Actions = {
	default: async ({ request }) => {
		const form = await request.formData()

		const result = registerSchema.safeParse({
			name: form.get('name'),
			email: form.get('email'),
			password: form.get('password'),
		})

		if (!result.success) {
			return fail(400, {
				issues: result.error.issues,
			})
		}

		const data = result.data

		await db.user.create({
			data: {
				...data,
				password: await hashPassword(data.password),
			},
		})

		throw redirect(301, '/')
	},
}
