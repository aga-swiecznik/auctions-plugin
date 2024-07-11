import { PrismaClient } from "@prisma/client";
import { Auction, CreateAuctionDTO, EditAuctionDTO } from "~/models/Auction";
import { stringToType } from "~/utils/stringToType";
import { typeToString } from "~/utils/typeToString";
import dayjs from "dayjs";
import { filterAuction } from "../utils/filterAuctions";
import { parseLink } from "../utils/urlParser";
import * as trpc from '@trpc/server';

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

  const auctionList = auctions
    .filter(auction => filterAuction(input, auction))

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

  const linkData = await parseLink(link)

  if (linkData.id) {
    const auction = await prisma.auction.findFirst({ where: { id: linkData.id } });
    if (auction) {
      console.error('FOUND ERROR', link, linkData);
      return {
        message: 'Aukcja została już dodana.',
        cause: { link: auction.link, id: linkData.id, originalLink: link },
      };
    }
  }

  const newAuction = {
    ...rest,
    ...linkData,
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



export const ending = async (prisma: PrismaClient, input: {
  groupId: string
}) => {
  const auctions = await prisma.auction.findMany({
    orderBy: [{ orderNumber: 'asc' }],
    where: { groupId: input.groupId, archived: false }
  })

  const today = dayjs().format('DD.MM.YYYY');
  const filtered = auctions.filter(auction => (dayjs(auction.endsAt).format('DD.MM.YYYY') === today))
  return filtered;
}

export const noOffers = async (prisma: PrismaClient, input: {
  groupId: string
}) => {
  const auctions = await prisma.auction.findMany({
    orderBy: [{ orderNumber: 'asc' }],
    where: { groupId: input.groupId, archived: false, winnerAmount: null }
  })

  const yesterday = dayjs().subtract(1, "day").format('DD.MM.YYYY');
  const filtered = auctions.filter(auction => (dayjs(auction.endsAt).format('DD.MM.YYYY') === yesterday))
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

export const stats = async (prisma: PrismaClient, input: {
  groupId: string
}) => {
  const data = await prisma.auction.groupBy({
    by: ['endsAt'],
    _count: { 
      id: true, 
      winnerAmount: true
    },
    _sum: { winnerAmount: true },
    orderBy: [{ endsAt: 'asc' }],
    where: { groupId: input.groupId }
  });

  const days = data
    .map(d => ({
      endsAt: dayjs(d.endsAt).format("DD-MM"), 
      sum: d._sum.winnerAmount, 
      count: d._count.id, 
      noOffers: d._count.id - d._count.winnerAmount,
      offers: d._count.winnerAmount
    }))

  const statsData =  await prisma.stats.findMany({ orderBy: [{createdAt: 'asc'}] });

  const stats = statsData.map((d, index) => ({ 
      date: dayjs(d.createdAt).format("DD-MM"), 
      amount: d.amount,
      increase: (index > 0 ? d.amount - statsData[index - 1]!.amount : 0)
    }));

  return { days, stats };
}


export const statsCSV = async (prisma: PrismaClient, input: {
  groupId: string
}) => {
  const auctions = await prisma.auction.findMany({
    orderBy: [{ endsAt: 'asc' }],
    where: { groupId: input.groupId },
    include: { winner: true, author: true, admin: true }
  });

  const data = [
    [
      'id', 
      'link', 
      'orderNumber', 
      'name',
      'author',
      'notes',
      'paid',
      'noOffers',
      'archived',
      'endsAt',
      'type',
      'createdAt',
      'winnerAmount',
      'winner',
      'admin'
    ]
  ];

  data.push(...auctions.map(auction => 
    [
      auction.id, 
      auction.link, 
      `${auction.orderNumber}`, 
      auction.name,
      auction.author.name,
      auction.notes || '',
      auction.paid ? 'TAK' : 'NIE',
      auction.noOffers ? 'TAK' : 'NIE',
      auction.archived ? 'TAK' : 'NIE',
      dayjs(auction.endsAt).format("YYYY-MM-DD"),
      auction.type,
      dayjs(auction.createdAt).format("YYYY-MM-DD"),
      `${auction.winnerAmount}`,
      auction.winner?.name || '',
      auction.admin.name
    ]
  ))

  return { data };
}

export const usersNotPaid = async (prisma: PrismaClient, input: {
  groupId: string
}) => {
  const data = await prisma.auction.findMany({
    orderBy: [{ winnerId: 'asc' }],
    where: { groupId: input.groupId, paid: false, winnerAmount: { gt: 0 }, endsAt: { lt: (new Date()).toISOString() } },
    include: { winner: true }
  });

  return data;
}