import { PrismaClient } from "@prisma/client";
import { mapTypeText } from "~/utils/mapTypeText";

export const list = async (prisma: PrismaClient, fundraisingId: string) => {
  const data = await prisma.texts.findMany({
    where: { fundraisingId }
  });

  return data.map(text => ({
    ...text, 
    type: mapTypeText(text.type)
  }));
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

export const get = async (prisma: PrismaClient, input: { type: string, fundraisingId: string }) => {
  return await prisma.texts.findFirst({ where: { type: input.type, fundraisingId: input.fundraisingId } });
}