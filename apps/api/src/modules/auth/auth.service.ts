import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../../prisma.js";
import { getExpirationDate } from "../../utils/getExpirationDate.js";

const SALT_ROUNDS = 10;

export async function hashPassword(password: string): Promise<string> {
	return bcrypt.hash(password, SALT_ROUNDS);
}

export async function comparePassword(
	password: string,
	hash: string,
): Promise<boolean> {
	return bcrypt.compare(password, hash);
}

export function generateAccessToken(userId: string): string {
	return jwt.sign({ sub: userId }, process.env.JWT_ACCESS_SECRET!, {
		expiresIn: process.env.JWT_ACCESS_EXPIRES_IN as any,
	});
}

export function generateRefreshToken(userId: string): string {
	return jwt.sign({ sub: userId }, process.env.JWT_REFRESH_SECRET!, {
		expiresIn: process.env.JWT_REFRESH_EXPIRES_IN as any,
	});
}

export async function storeRefreshToken(userId: string, token: string) {
	const expiresAt = getExpirationDate(process.env.JWT_REFRESH_EXPIRES_IN!);

	await prisma.refreshToken.create({
		data: { token, userId, expiresAt },
	});
}
