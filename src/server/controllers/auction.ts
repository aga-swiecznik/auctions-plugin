import { PrismaClient } from "@prisma/client";
import dayjs from "dayjs";
import { Auction, CreateAuctionDTO, EditAuctionDTO } from "~/models/Auction";
import { stringToType } from "~/utils/stringToType";
import { typeToString } from "~/utils/typeToString";

export const list = async (prisma: PrismaClient, groupId: string): Promise<Auction[]> => {
  return (await prisma.auction.findMany({ where: { groupId } })).map(auction => ({ ...auction, type: stringToType(auction.type)}));
}

export const get = async (prisma: PrismaClient, postId: string): Promise<EditAuctionDTO | undefined> => {
  const auction = await prisma.auction.findFirst({ where: { id: postId } })
  if(auction) {
    console.log('==========', dayjs(auction.endsAt).format('YYYY-MM-DD'))
    return { 
      ...auction,
      type: stringToType(auction.type),
      endsAt: dayjs(auction.endsAt).format('YYYY-MM-DD')
    }
  }
  return;
}

export const patch = async (prisma: PrismaClient, auction: Partial<EditAuctionDTO> & {id: string}, groupId: string) => {
  const newAuction = {
    ...auction,
    groupId,
    type: auction.type ? stringToType(auction.type) : undefined,
    endsAt: auction.endsAt ? new Date(auction.endsAt) : undefined
  }

  await prisma.auction.update({
    where: {
      id: auction.id,
    },
    data: newAuction,
  })
}

export const add = async (prisma: PrismaClient, auction: CreateAuctionDTO, groupId: string) => {
  return await prisma.auction.create({ data: {
    ...auction,
    groupId,
    type: typeToString(auction.type),
    endsAt: new Date(auction.endsAt)
  }});
};