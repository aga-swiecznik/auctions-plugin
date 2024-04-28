import { PrismaClient } from "@prisma/client";
import { Auction, CreateAuctionDTO, EditAuctionDTO } from "~/models/Auction";
import { stringToType } from "~/utils/stringToType";
import { typeToString } from "~/utils/typeToString";
import { exec } from "child_process";
import dayjs from "dayjs";

const ITEMS_PER_PAGE = 100;

export const list = async (prisma: PrismaClient, input: {
    groupId: string,
    auctionType?: string | undefined,
    status?: string | undefined,
    author?: string | undefined,
    search?: string | undefined,
    ends?: Date | undefined,
    page: number
  }): Promise<{ auctions: Auction[], pages: number, dates: {[k: string]: string} }> => {
  const auctions = await prisma.auction.findMany({
    orderBy: [{ endsAt: 'asc' }, { orderNumber: 'asc' }],
    where: { groupId: input.groupId, type: input.auctionType, authorId: input.author, endsAt: input.ends },
    include: { author: true, winner: true, admin: true }
  })

  const dates = await prisma.auction.groupBy({
    by: ['endsAt'],
    where: { archived: false },
    _count: true,
  });

  const today = dayjs();

  const auctionList = auctions
    .filter((auction) => {
      return (
        (!input.search || auction.name.toLowerCase().includes(input.search.toLowerCase())) &&
        (!input.status ||
          (input.status === "to-end" &&
            new Date() > auction.endsAt &&
            !auction.noOffers &&
            !((auction.winnerAmount ?? 0) > 0)) ||
          (input.status === "ended" &&
            (auction.noOffers || (auction.winnerAmount ?? 0) > 0)) ||
          (input.status === "no-offers" && auction.noOffers) ||
          (input.status === "paid" && auction.paid) ||
          (input.status === "not-paid" &&
            !auction.paid &&
            (auction.winnerAmount ?? 0) > 0) ||
          (input.status === "overdue" &&
            !auction.paid &&
            (auction.winnerAmount ?? 0) > 0 &&
            today.diff(auction.endsAt, "day") > 2) ||
          (input.status === "to-delete" &&
            ((auction.paid && today.diff(auction.endsAt, "day") > 14) ||
              (auction.noOffers && today.diff(auction.endsAt, "day") > 2))) ||
              input.status === "archived") &&
        (input.status === "archived" ? auction.archived : auction.archived === false)
    )})

  const days: { [key: string]: string } = {};
  dates.forEach((date) => {
    days[dayjs(date.endsAt).format("YYYY-MM-DD")] = dayjs(date.endsAt).format("ddd, DD.MM");
  });

  return {
    auctions: auctionList
      .slice((input.page - 1) * ITEMS_PER_PAGE, input.page * ITEMS_PER_PAGE)
      .map(auction => ({ ...auction, type: stringToType(auction.type)})),
    pages: Math.ceil(auctionList.length / ITEMS_PER_PAGE),
    dates: days
  };
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
  const oldAuction = await prisma.auction.findFirst({ where: { id: auction.id }, include: {author: true, winner: true, admin: true} });

  let maxNumber;
  let endsAt;
  let oldEndsAt;
  if(auction.endsAt && oldAuction) {
    endsAt = dayjs(auction.endsAt).format('YYYY-MM-DD')
    oldEndsAt = dayjs(oldAuction.endsAt).format('YYYY-MM-DD')
    if (oldEndsAt !== endsAt) {
      maxNumber = await prisma.auction.aggregate({
        where: { endsAt: new Date(endsAt) },
        _max: { orderNumber: true }
      });
    }
  }

  const newAuction = {
    ...rest,
    ...link ? (await parseLink(link)) : {},
    type: auction.type ? stringToType(auction.type) : undefined,
    endsAt: endsAt ? new Date(endsAt) : undefined,
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
    orderNumber: endsAt !== oldEndsAt ? (maxNumber?._max.orderNumber ? maxNumber._max.orderNumber + 1 : 1) : undefined
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
      id: linkMatch[2],
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

export const ending = async (prisma: PrismaClient, input: {
  groupId: string
}) => {
  const auctions = await prisma.auction.findMany({
    orderBy: [{ orderNumber: 'asc' }],
    where: { groupId: input.groupId }
  })

  const today = dayjs();
  const filtered = auctions.filter(auction => (dayjs(auction.endsAt).format('DD.MM.YYYY') === today.format('DD.MM.YYYY') && !auction.archived))
  return filtered;
}

export const summary = async (prisma: PrismaClient, input: {
  groupId: string,
  selectedDate: Date
}) => {
  const auctions = await prisma.auction.findMany({
    orderBy: [{ orderNumber: 'asc' }],
    where: { groupId: input.groupId }
  })

  const selectedDate = dayjs(input.selectedDate)
  const filteredAuctions = (auctions || [])
    .filter(auction => {
      return (!input.selectedDate || selectedDate.isSame(auction.endsAt, 'day'))
    });

  const noOffers = filteredAuctions.filter(auction => auction.noOffers).length;
  const ended = filteredAuctions.filter(auction => auction.winnerAmount).length;
  const sum = filteredAuctions.reduce((partial, auction) => partial + (auction.winnerAmount || 0), 0);

  return { noOffers, ended, sum };
}