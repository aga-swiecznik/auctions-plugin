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

export const fullAmountStats = async (prisma: PrismaClient) => {
  const target = 16778325;
  const updateDate = '09.02.2025';
  const values = {
    dobryklik: 5692,
    gofundme: 38475,
    zzp: 406260,
    zzp15: 35391,
    siepomaga15: 848785,
    ptchnm: 123567
  }

  const statsResponse = await fetch('https://www.siepomaga.pl/api/v1/causes/qJtooY/stats');
  const statsData = await statsResponse.json() as {data: Stats};
  const total = values.dobryklik + values.gofundme + values.ptchnm + values.siepomaga15 + values.zzp + values.zzp15 + statsData.data.amount;
  const left = target - total;
  return {
    updateDate,
    ...values,
    siepomaga: statsData.data.amount,
    left,
    total,
    percent: 100 - Math.floor(left/target * 100)
  }
};