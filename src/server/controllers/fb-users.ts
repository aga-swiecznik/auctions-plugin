import { FbUser, PrismaClient } from "@prisma/client";

export const list = async (prisma: PrismaClient, fundraisingId: string): Promise<FbUser[]> => {
  // return prisma.fbUser.findMany({ orderBy: [{createdAt: 'asc'}] });
  // return without duplicates and removed users (stupid fix, will fix later)
  const list = await listWithInfo(prisma, fundraisingId);

  const filtered: FbUser[] = [];
  list.forEach(auction => {
    if(auction.user) filtered.push(auction.user);
  });

  return filtered;
}

export const add = async (prisma: PrismaClient, input: { name: string, fundraisingId: string }): Promise<FbUser> => {
  return await prisma.fbUser.create({ data: input });
}

export const listWithInfo = async (prisma: PrismaClient, fundraisingId: string) => {
  const counts = await prisma.auction.groupBy({
    by: ['authorId'],
    where: { fundraisingId },
    _count: true,
    _sum: {winnerAmount: true}
  });

  const fbUsers = await prisma.fbUser.findMany({ orderBy: [{createdAt: 'asc'}] });

  const result = counts.map((count => ({
    auctions: count._count,
    sum: count._sum,
    id: count.authorId,
    user: fbUsers.find((user) => count.authorId === user.id)
  })));

  return result;
}

export const get = async (prisma: PrismaClient, input: { id: string, fundraisingId: string }): Promise<FbUser | null> => {
  return await prisma.fbUser.findFirst({ where: { id: input.id, fundraisingId: input.fundraisingId } });
}

export const save = async (prisma: PrismaClient, input: { name: string, id: string, fundraisingId: string }): Promise<FbUser> => {
  return await prisma.fbUser.update({
    where: {
      id: input.id,
      fundraisingId: input.fundraisingId,
    },
    data: {name: input.name},
  })
}

export const reassign = async (prisma: PrismaClient, input: { newId: string, id: string }) => {
  await prisma.auction.updateMany({
    where: {
      authorId: input.id,
    },
    data: { authorId: input.newId },
  });

  await prisma.fbUser.delete({ where: { id: input.id } });

  return;
}