import { z } from "zod";
import { AuctionType } from "~/models/AuctionType";

import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";
import { add, get, list, patch } from "~/server/controllers/auction";

export const auctionRouter = createTRPCRouter({
  list: protectedProcedure
    .input(z.object({ groupId: z.string() }))
    .query(({ input, ctx }) => {
      return list(ctx.db, input.groupId);
    }),
  get: protectedProcedure
    .input(z.object({ postId: z.string() }))
    .query(({ input, ctx }) => {
      return get(ctx.db, input.postId);
    }),
  update: protectedProcedure
    .input(z.object({
      auction: z.object({
        id: z.string(),
        link: z.string().optional(),
        author: z.string().optional(),
        name: z.string().optional(),
        endsAt: z.string().optional(),
        winner: z.string().optional().nullable(),
        winnerAmount: z.number().optional().nullable(),
        notes: z.string().optional().nullable(),
        collected: z.boolean().optional().nullable(),
        noOffers: z.boolean().optional().nullable(),
        archived: z.boolean().optional().nullable(),
        paid: z.boolean().optional().nullable(),
        type: z.nativeEnum(AuctionType).optional(),
      }),
    }))
    .mutation(({ input, ctx }) => {
      return patch(ctx.db, input.auction);
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
      groupId: z.string(),
    }))
    .mutation(({ input, ctx }) => {
      return add(ctx.db, ctx.session, input.auction, input.groupId);
    }),
});
