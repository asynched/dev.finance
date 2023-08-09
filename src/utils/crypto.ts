import { hash, genSalt, compare } from 'bcrypt'

export async function hashPassword(password: string) {
	return hash(password, await genSalt())
}

export async function verifyPassword(password: string, hash: string) {
	return compare(password, hash)
}
