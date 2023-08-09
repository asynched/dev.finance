import { fail, redirect } from '@sveltejs/kit'
import { coerce, object, string } from 'zod'
import type { Actions, PageServerLoad } from './$types'
import { db } from '@/shared/prisma'

export const load: PageServerLoad = async ({ locals }) => {
	const user = locals.user!

	return {
		user,
		sessions: await db.session.findMany({
			where: {
				userId: user.id,
			},
			orderBy: {
				createdAt: 'desc',
			},
		}),
		expenses: await db.expense.findMany({
			where: {
				userId: user.id,
			},
			orderBy: {
				date: 'desc',
			},
		}),
	}
}

const createTransactionSchema = object({
	name: string().min(1).max(255),
	amount: coerce.number(),
	date: string()
		.regex(/\d{4}-\d{2}-\d{2}/, 'Must be a date')
		.transform((val) => new Date(val)),
})

export const actions: Actions = {
	logoff: async ({ cookies, locals }) => {
		if (!locals.user) {
			return fail(400, {
				message: 'You must be logged in to logoff',
			})
		}

		const token = cookies.get('session')

		if (!token) {
			return fail(400, {
				message: 'You must be logged in to logoff',
			})
		}

		await db.session.deleteMany({
			where: {
				token,
			},
		})

		throw redirect(302, '/')
	},
	remove: async ({ request, locals }) => {
		if (!locals.user) {
			return fail(400, {
				message: 'You must be logged in to remove a transaction',
			})
		}

		const user = locals.user
		const form = await request.formData()

		if (!form.has('id')) {
			return fail(400, {
				message: 'You must provide an id',
			})
		}

		const id = Number(form.get('id'))

		const hasTransaction = await db.expense.findFirst({
			where: {
				id,
				userId: user.id,
			},
		})

		if (!hasTransaction) {
			return fail(404, {
				message: 'Transaction not found',
			})
		}

		await db.expense.delete({
			where: {
				id,
			},
		})

		return { success: true }
	},
	create: async ({ request, locals }) => {
		if (!locals.user) {
			return fail(400, {
				message: 'You must be logged in to create a transaction',
			})
		}

		const form = await request.formData()
		const user = locals.user

		const result = createTransactionSchema.safeParse({
			name: form.get('name'),
			amount: form.get('amount'),
			date: form.get('date'),
		})

		if (!result.success) {
			return fail(400, {
				issues: result.error.issues,
			})
		}

		const data = result.data

		await db.expense.create({
			data: {
				name: data.name,
				amount: data.amount,
				date: data.date,
				userId: user.id,
			},
		})

		return {
			success: true,
		}
	},
}
