import { PrismaClient } from "@prisma/client";

export const list = async (prisma: PrismaClient, userId: string) => {
  const data = await prisma.fundraising.findMany();

  console.log(data)
  return data;
}