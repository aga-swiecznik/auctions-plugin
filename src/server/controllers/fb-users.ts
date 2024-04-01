import { FbUser, PrismaClient } from "@prisma/client";

export const list = async (prisma: PrismaClient): Promise<FbUser[]> => {
  return prisma.fbUser.findMany({ orderBy: [{createdAt: 'asc'}] });
}

export const add = async (prisma: PrismaClient, input: { name: string }): Promise<FbUser> => {
  return await prisma.fbUser.create({ data: input });
}

export const listWithInfo = async (prisma: PrismaClient) => {
  const counts = await prisma.auction.groupBy({
    by: ['authorId'],
    _count: true,
  });

  const fbUsers = await prisma.fbUser.findMany({ orderBy: [{createdAt: 'asc'}] });

  const result = counts.map((count => ({ 
    auctions: count._count,
    id: count.authorId,
    user: fbUsers.find((user) => count.authorId === user.id)
  })));

  return result;
}

export const get = async (prisma: PrismaClient, input: { id: string }): Promise<FbUser | null> => {
  return await prisma.fbUser.findFirst({ where: { id: input.id } });
}

export const save = async (prisma: PrismaClient, input: { name: string, id: string }): Promise<FbUser> => {
  return await prisma.fbUser.update({
    where: {
      id: input.id,
    },
    data: {name: input.name},
  })
}