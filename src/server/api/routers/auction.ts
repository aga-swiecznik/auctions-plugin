import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { get, list } from "~/server/controllers/auction";

export const auctionRouter = createTRPCRouter({
  list: publicProcedure
    .input(z.object({ groupId: z.string() }))
    .query(({ input }) => {
      return list(input.groupId);
    }),
  get: publicProcedure
    .input(z.object({ postId: z.string() }))
    .query(({ input }) => {
      return get(input.postId);
    }),
});
