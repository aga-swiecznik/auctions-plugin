import { PrismaClient } from "@prisma/client";
import { Auction, CreateAuctionDTO, EditAuctionDTO } from "~/models/Auction";
import { stringToType } from "~/utils/stringToType";
import { typeToString } from "~/utils/typeToString";
import { exec } from "child_process";

export const list = async (prisma: PrismaClient, groupId: string): Promise<Auction[]> => {
  return (await prisma.auction.findMany({ orderBy: [{orderNumber: 'asc'}], where: { groupId }, include: {author: true, winner: true, admin: true} }))
    .map(auction => ({ ...auction, type: stringToType(auction.type)}));
}

export const get = async (prisma: PrismaClient, postId: string): Promise<Auction | undefined> => {
  const auction = await prisma.auction.findFirst({ where: { id: postId }, include: {author: true, winner: true, admin: true} });
  if(auction) {
    return {
      ...auction,
      type: stringToType(auction.type)
    }
  }
  return;
}

export const patch = async (prisma: PrismaClient, auction: Partial<EditAuctionDTO> & { id: string }) => {
  const { author, winner, link, ...rest } = auction;

  let maxNumber;
  if(auction.endsAt) {
    maxNumber = await prisma.auction.aggregate({
      where: { endsAt: new Date(auction.endsAt) },
      _max: { orderNumber: true }
    });
  }

  const newAuction = {
    ...rest,
    type: auction.type ? stringToType(auction.type) : undefined,
    endsAt: auction.endsAt ? new Date(auction.endsAt) : undefined,
    author: author ? {
      connect: {
        id: author
      }
    } : undefined,
    winner: winner ? {
      connect: {
        id: winner
      }
    } : undefined, 
    orderNumber: auction.endsAt ? (maxNumber?._max.orderNumber ? maxNumber._max.orderNumber + 1 : 1) : undefined
  }

  await prisma.auction.update({
    where: {
      id: auction.id,
    },
    data: newAuction,
  })
}

export const add = async (prisma: PrismaClient, session: {user: {id: string}}, auction: CreateAuctionDTO, groupId: string) => {
  const { author, link, ...rest } = auction;

  const maxNumber = await prisma.auction.aggregate({
    where: { endsAt: new Date(auction.endsAt) },
    _max: { orderNumber: true }
  });

  const newAuction = {
    ...rest,
    ...(await parseLink(link)),
    groupId,
    type: typeToString(auction.type),
    endsAt: new Date(auction.endsAt),
    author: {
      connect: {
        id: author
      }
    },
    winner: undefined,
    orderNumber: maxNumber._max.orderNumber ? maxNumber._max.orderNumber + 1 : 1,
    admin: {
      connect: {
        id: session.user.id
      }
    },
  };

  return await prisma.auction.create({
    data: newAuction,
    include: {
      author: true,
      admin: true
    },
  });
};

const parseCorrectLink = (link: string) => {
  const linkRegex = /facebook\.com\/groups\/(\d+)\/(?:posts|permalink)\/(\d+)/g

  const linkMatch = linkRegex.exec(link);
  if(linkMatch && linkMatch.length > 2) {
    return {
      link,
      groupId: linkMatch[1],
      fbId: linkMatch[2]
    }
  }
}

const parseLink = async (link: string) => {
  let parsed = parseCorrectLink(link);

  if(parsed) return parsed;

  const p = new Promise((resolve, reject) => {
    exec(`curl  -w "%{redirect_url}" -o /dev/null -s "${link}"`, (error, stdout, stderr) => {
      if (error) {
        reject(error.message);
      }
      if (stderr) {
        reject(stderr);
      }

      resolve(stdout);
    });
  });

  const url = (await p) as string;

  if (url) {
    parsed = parseCorrectLink(url);

    if(parsed) return parsed;
  }

  throw new Error("Nieprawidłowy link, sprawdź czy post istnieje i czy link jest skopiowany poprawnie.");
}