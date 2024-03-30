import { PrismaClient } from "@prisma/client";
import { Stats } from "~/models/Stats";

export const summary = async (prisma: PrismaClient) => {
  const stats = await prisma.stats.findMany({ orderBy: [{createdAt: 'desc'}] });
  const newest = stats[0] ? stats[0].amount : 0;
  const second = stats[1] ? stats[1].amount : 0;
  const paymentsCount = stats[0] ? stats[0].payments_count : 0;
  const paymentsCountLast = stats[1] ? stats[1].payments_count : 0;
  return { diff: newest - second, paymentsCount, paymentsDiff: paymentsCount - paymentsCountLast };
};

export const fetchData = async (prisma: PrismaClient) => {
  const statsResponse = await fetch('https://www.siepomaga.pl/api/v1/causes/qJtooY/stats');
  const statsData = await statsResponse.json() as {data: Stats};
  return await prisma.stats.create(statsData);
};