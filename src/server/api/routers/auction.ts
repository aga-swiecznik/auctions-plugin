import { z } from "zod";
import { AuctionType } from "~/models/AuctionType";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { add, get, list, patch } from "~/server/controllers/auction";

export const auctionRouter = createTRPCRouter({
  list: publicProcedure
    .input(z.object({ groupId: z.string() }))
    .query(({ input, ctx }) => {
      return list(ctx.db, input.groupId);
    }),
  get: publicProcedure
    .input(z.object({ postId: z.string() }))
    .query(({ input, ctx }) => {
      return get(ctx.db, input.postId);
    }),
  update: publicProcedure
    .input(z.object({
      auction: z.object({
        id: z.string(),
        link: z.string().optional(),
        name: z.string().optional(),
        endsAt: z.string().optional(),
        winnerName: z.string().optional().nullable(),
        winnerAmount: z.number().optional().nullable(),
        notes: z.string().optional().nullable(),
        collected: z.boolean().optional().nullable(),
        paid: z.boolean().optional().nullable(),
        type: z.nativeEnum(AuctionType).optional(),
      }),
      groupId: z.string(),
    }))
    .mutation(({ input, ctx }) => {
      return patch(ctx.db, input.auction, input.groupId);
    }),
  create: publicProcedure
    .input(z.object({
      auction: z.object({
        name: z.string(),
        link: z.string(),
        endsAt: z.string(),
        type: z.nativeEnum(AuctionType).optional()
      }),
      groupId: z.string(),
    }))
    .mutation(({ input, ctx }) => {
      console.log('.........................', input)
      return add(ctx.db, input.auction, input.groupId);
    }),
});
