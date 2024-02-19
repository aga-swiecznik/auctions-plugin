import { FbUser, PrismaClient } from "@prisma/client";

export const list = async (prisma: PrismaClient): Promise<FbUser[]> => {
  return prisma.fbUser.findMany({ orderBy: [{createdAt: 'asc'}] });
}

export const add = async (prisma: PrismaClient, input: { name: string }): Promise<FbUser> => {
  return await prisma.fbUser.create({ data: input });
}