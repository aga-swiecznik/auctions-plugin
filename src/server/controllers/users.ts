import { User, PrismaClient } from "@prisma/client";
import sha1 from "js-sha1";
import { env } from "process";

export const list = async (prisma: PrismaClient) => {
  const data = await prisma.auction.groupBy({
    by: ['adminId'],
    _count: { 
      id: true
    },
  });

  const users = await prisma.user.findMany()
  return users.map(user => {
    const count = data.find(count => count.adminId === user.id) || { _count: {id: 0}};
    return { name: user.name, email: user.email, id: user.id, count: count._count.id };
  });
}

export const add = async (prisma: PrismaClient, input: { email: string, password: string, name: string }): Promise<User> => {
  const password = sha1(input.password + env.SALT);
  return await prisma.user.create({ data:  { email: input.email, name: input.name, password } });
}

export const edit = async (prisma: PrismaClient, input: { id: string, email: string, password: string, name: string }): Promise<User> => {
  console.log(input)
  
  const password = input.password ? sha1(input.password + env.SALT) : undefined;
  return await prisma.user.update({ data:  { email: input.email, name: input.name, password }, where: {id: input.id} });
}

export const remove = async (prisma: PrismaClient, input: { id: string }): Promise<User> => {
  return await prisma.user.delete({ where: {id: input.id} });
}