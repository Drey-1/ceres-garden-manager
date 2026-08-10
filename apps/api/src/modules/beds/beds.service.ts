import { prisma } from "../../prisma.js";

export async function createBed(
	userId: string,
	data: { name: string; location?: string },
) {
	return await prisma.bed.create({
		data: {
			name: data.name,
			location: data.location ?? null,
			userId,
		},
	});
}

export async function listBeds(userId: string) {
	return await prisma.bed.findMany({ where: { userId } });
}

export async function getBedById(userId: string, bedId: string) {
	return await prisma.bed.findFirst({
		where: { id: bedId, userId },
	});
}

export async function updateBed(
	userId: string,
	bedId: string,
	data: Partial<{ name: string; location: string }>,
) {
	return await prisma.bed.update({ where: { id: bedId, userId }, data });
}

export async function deleteBed(userId: string, bedId: string) {
	return await prisma.bed.delete({
		where: { id: bedId, userId },
	});
}
