import { PrismaClient } from "@prisma/client";
import { FundraisingWithRole } from "~/models/Fundraising";

export const list = async (prisma: PrismaClient, userId: string) => {
  const data = await prisma.fundraising.findMany();

  return data;
}

export const get = async (prisma: PrismaClient, userId: string, fundraisingId: string): Promise<FundraisingWithRole> => {
  const data = await prisma.fundraising.findFirst({where: { id: fundraisingId }, include: { users: true }});

  if (!data) throw Error('No fundraising');

  const { users, ...fundraising } = data;
  const perm = data.users.find(user => user.id === userId);

  if (!perm) throw Error('User no perm');

  return { ...fundraising, role: perm.role === 'admin' ? 'admin' : 'moderator' };
}