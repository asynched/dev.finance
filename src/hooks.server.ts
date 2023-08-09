import { redirect, type Handle } from '@sveltejs/kit'
import { db } from './shared/prisma'
import type { User } from '@prisma/client'

export const handle: Handle = async ({ event, resolve }) => {
	const isProtected = event.url.pathname.startsWith('/app')
	const isPublic = !isProtected
	const token = event.cookies.get('session')

	let user: User | null = null

	if (token) {
		user = await db.user.findFirst({
			where: {
				sessions: {
					some: {
						token,
					},
				},
			},
		})
	}

	if (isProtected && !user) {
		throw redirect(302, '/')
	}

	if (isPublic && user) {
		throw redirect(301, '/app')
	}

	if (user) {
		event.locals.user = {
			id: user.id,
			email: user.email,
			name: user.name,
			createdAt: user.createdAt,
			updatedAt: user.updatedAt,
		}
	} else {
		event.locals.user = null
	}

	return resolve(event)
}
