import { z } from "zod";
import { AuctionType } from "~/models/AuctionType";

import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";
import { add, ending, get, list, patch, stats, statsCSV, summary, usersNotPaid, noOffers, active } from "~/server/controllers/auction";

export const auctionRouter = createTRPCRouter({
  list: protectedProcedure
    .input(z.object({ 
      fundraisingId: z.string(),
      auctionType: z.string().optional(),
      status: z.string().optional(),
      author: z.string().optional(),
      search: z.string().optional(),
      ends: z.date().optional(),
      page: z.number(),
    }))
    .query(({ input, ctx }) => {
      return list(ctx.db, input);
    }),
  get: protectedProcedure
    .input(z.object({ postId: z.string(), fundraisingId: z.string(), }))
    .query(({ input, ctx }) => {
      return get(ctx.db, input.postId, input.fundraisingId);
    }),
  update: protectedProcedure
    .input(z.object({
      fundraisingId: z.string(), 
      auction: z.object({
        id: z.string(),
        link: z.string().optional(),
        author: z.string().optional(),
        name: z.string().optional(),
        endsAt: z.string().optional(),
        winner: z.string().optional().nullable(),
        winnerAmount: z.number().optional().nullable(),
        notes: z.string().optional().nullable(),
        noOffers: z.boolean().optional(),
        archived: z.boolean().optional().nullable(),
        paid: z.boolean().optional().nullable(),
        type: z.nativeEnum(AuctionType).optional(),
      }),
    }))
    .mutation(({ input, ctx }) => {
      return patch(ctx.db, input.auction, input.fundraisingId);
    }),
  create: protectedProcedure
    .input(z.object({
      auction: z.object({
        name: z.string(),
        link: z.string(),
        author: z.string(),
        endsAt: z.string(),
        notes: z.string().optional().nullable(),
        type: z.nativeEnum(AuctionType).optional()
      }),
      fundraisingId: z.string(),
    }))
    .mutation(({ input, ctx }) => {
      return add(ctx.db, ctx.session, input.auction, input.fundraisingId);
    }),
  ending: protectedProcedure
  .input(z.object({ 
    fundraisingId: z.string(),
  }))
  .query(({ input, ctx }) => {
    return ending(ctx.db, input);
  }),
  active: protectedProcedure
  .input(z.object({ 
    fundraisingId: z.string(),
  }))
  .query(({ input, ctx }) => {
    return active(ctx.db, input);
  }),
  noOffers: protectedProcedure
  .input(z.object({ 
    fundraisingId: z.string(),
  }))
  .query(({ input, ctx }) => {
    return noOffers(ctx.db, input);
  }),
  summary: protectedProcedure
    .input(z.object({ 
      fundraisingId: z.string(),
      selectedDate: z.date()
    }))
    .query(({ input, ctx }) => {
      return summary(ctx.db, input);
    }),
  stats: protectedProcedure
    .input(z.object({ 
      fundraisingId: z.string()
    }))
    .query(({ input, ctx }) => {
      return stats(ctx.db, input);
    }),
  statsCSV: protectedProcedure
    .input(z.object({ 
      fundraisingId: z.string()
    }))
    .query(({ input, ctx }) => {
      return statsCSV(ctx.db, input);
    }),
  usersNotPaid: protectedProcedure
    .input(z.object({ 
      fundraisingId: z.string()
    }))
    .query(({ input, ctx }) => {
      return usersNotPaid(ctx.db, input);
    }),
});
