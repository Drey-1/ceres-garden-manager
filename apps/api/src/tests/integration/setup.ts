import { afterEach } from "vitest";
import { prisma } from "../../prisma.js";

afterEach(async () => {
  await prisma.careLog.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.planting.deleteMany();
  await prisma.bed.deleteMany();
  await prisma.user.deleteMany();
});