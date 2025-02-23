import { User, PrismaClient } from "@prisma/client";
import { randomUUID } from "crypto";
import sha1 from "js-sha1";
import { env } from "process";
import { UserWithRole } from "~/models/User";

type ListUsersType = Omit<UserWithRole, "password"> & { count: number };

export const list = async (prisma: PrismaClient, fundraisingId: string): Promise<ListUsersType[]> => {
  const data = await prisma.auction.groupBy({
    by: ['adminId'],
    _count: { 
      id: true
    },
  });

  const users = await prisma.user.findMany({ 
    include: { fundraisings: true }, 
    where: { 
      fundraisings: { some: { id: fundraisingId } } 
    }, 
  });
  return users.map(user => {
    const count = data.find(count => count.adminId === user.id) || { _count: {id: 0}};
    const perm = user.fundraisings.find(fundraising => fundraising.fundraisingId === fundraisingId);

    if (!perm) throw Error('No perm for this user, should not happen');

    return { 
      name: user.name, 
      email: user.email, 
      id: user.id, 
      count: count._count.id, 
      role: perm.role === 'admin' ? 'admin' : 'moderator'
    };
  });
};

export const add = async (prisma: PrismaClient, input: { email: string, password: string, name: string, fundraisingId: string, role: string }): Promise<User> => {
  const password = sha1(input.password + env.SALT);
  return await prisma.user.create({ 
    data:  { 
      email: input.email, 
      name: input.name, 
      password,
      fundraisings: { 
        create: [{
          fundraisingId: input.fundraisingId,
          role: input.role,
          id: randomUUID()
        }],
      }, 
    }, 
  });
};

export const edit = async (prisma: PrismaClient, input: { id: string, email: string, password: string, name: string }): Promise<User> => {
  const password = input.password ? sha1(input.password + env.SALT) : undefined;
  return await prisma.user.update({ data:  { email: input.email, name: input.name, password }, where: {id: input.id} });
};

export const remove = async (prisma: PrismaClient, input: { id: string }): Promise<User> => {
  return await prisma.user.delete({ where: {id: input.id} });
};
