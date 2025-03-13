import { User, PrismaClient } from "@prisma/client";
import { randomUUID } from "crypto";
import sha1 from "js-sha1";
import { env } from "process";

export const list = async (prisma: PrismaClient, fundraisingId: string) => {
  const data = await prisma.texts.findMany({
    where: { fundraisingId }
  });

  return data;
};

export const add = async (prisma: PrismaClient, input: { text: string, type: string, fundraisingId: string }) => {
  return await prisma.texts.create({ 
    data:  { 
      text: input.text, 
      type: input.type, 
      fundraisingId: input.fundraisingId 
    }, 
  });
};

export const edit = async (prisma: PrismaClient, input: { id: string, text: string, type: string, fundraisingId: string }) => {
  return await prisma.texts.update({ 
    data:  { text: input.text, type: input.type }, 
    where: { id: input.id, fundraisingId: input.fundraisingId } });
};

export const remove = async (prisma: PrismaClient, input: { id: string, fundraisingId: string }) => {
  return await prisma.texts.delete({ where: { id: input.id, fundraisingId: input.fundraisingId } });
};
