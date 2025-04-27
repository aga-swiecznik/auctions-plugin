import { PrismaClient } from "@prisma/client";
import { FundraisingWithRole } from "~/models/Fundraising";
import { TextType } from "~/models/Text";

export const list = async (prisma: PrismaClient, userId: string) => {
  const fundraisings = await prisma.fundraisingPermissions.findMany({
    where: { userId },
    include: {
      fundraising: true,
    },
  });

  console.log(await prisma.fundraisingPermissions.findMany({
    include: {
      fundraising: true,
    },
  }))

  return fundraisings.map(f => f.fundraising);
}

export const get = async (prisma: PrismaClient, userId: string, fundraisingId: string): Promise<FundraisingWithRole> => {
  const data = await prisma.fundraising.findFirst({where: { id: fundraisingId }, include: { users: true }});

  if (!data) throw Error('No fundraising');

  const { users, ...fundraising } = data;
  const perm = data.users.find(user => user.userId === userId);

  if (!perm) throw Error('User no perm');

  return { ...fundraising, role: perm.role === 'admin' ? 'admin' : 'moderator' };
}
