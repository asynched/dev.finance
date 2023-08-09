import { object, string } from 'zod'
import type { Actions } from './$types'
import { fail, redirect } from '@sveltejs/kit'
import { db } from '@/shared/prisma'
import { verifyPassword } from '@/utils/crypto'

const loginSchema = object({
	email: string().email().max(255),
	password: string().min(8).max(255),
})

export const actions: Actions = {
	default: async ({ cookies, request, getClientAddress }) => {
		const form = await request.formData()

		const result = loginSchema.safeParse({
			email: form.get('email'),
			password: form.get('password'),
		})

		if (!result.success) {
			return fail(400, {
				issues: result.error.issues,
			})
		}

		const data = result.data

		const user = await db.user.findUnique({
			where: {
				email: data.email,
			},
		})

		if (!user) {
			return fail(400, {
				issues: [
					{
						code: 'email',
						message: 'Email not found',
					},
				],
			})
		}

		const isPasswordValid = await verifyPassword(data.password, user.password)

		if (!isPasswordValid) {
			return fail(400, {
				issues: [
					{
						code: 'password',
						message: 'Password is incorrect',
					},
				],
			})
		}

		const session = await db.session.create({
			data: {
				userId: user.id,
				ip: getClientAddress(),
				userAgent: request.headers.get('user-agent') || '',
			},
		})

		cookies.set('session', session.token, {
			secure: false,
			httpOnly: true,
		})

		throw redirect(302, '/app')
	},
}
