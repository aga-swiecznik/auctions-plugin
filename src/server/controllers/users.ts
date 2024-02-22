import { User, PrismaClient } from "@prisma/client";
import sha1 from "js-sha1";
import { env } from "process";

export const list = async (prisma: PrismaClient): Promise<User[]> => {
  return prisma.user.findMany();
}

export const add = async (prisma: PrismaClient, input: { email: string, password: string }): Promise<User> => {
  const password = sha1(input.password + env.SALT);
  return await prisma.user.create({ data:  { email: input.email, name: input.email, password } });
}